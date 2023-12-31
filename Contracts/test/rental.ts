import {deployments, ethers, getNamedAccounts} from 'hardhat';
import {formatBytes32String} from 'ethers/lib/utils';
import {expect} from 'chai';
import {fromUSDC, getBlockTime} from './utils';
import {time} from '@nomicfoundation/hardhat-network-helpers';

const deploy = deployments.createFixture(
  async ({deployments, getNamedAccounts, ethers}, options) => {
    const {deployer, user1, user2} = await getNamedAccounts();
    await deployments.fixture(['USDC', 'CloudX']);
    const USDC_user1 = await ethers.getContract('USDC', user1);
    const GPU_user1 = await ethers.getContract('CloudX', user1);
    const GPU_user2 = await ethers.getContract('CloudX', user2);
    const GPU_deployer = await ethers.getContract('CloudX', deployer);
    return {
      USDC_user1,
      GPU_user1,
      GPU_user2,
      GPU_deployer
    };
  }
);

const giveUSDC = deployments.createFixture(
  async ({deployments, getNamedAccounts, ethers}, options) => {
    const {user1, user2} = await getNamedAccounts();

    const USDC_user1 = await ethers.getContract('USDC', user1);
    const USDC_user2 = await ethers.getContract('USDC', user2);
    const CloudX = await deployments.get('CloudX');

    await USDC_user1.giveMe(fromUSDC(100));
    await USDC_user1.approve(CloudX.address, fromUSDC(100));

    await USDC_user2.giveMe(fromUSDC(100));
    await USDC_user2.approve(CloudX.address, fromUSDC(100));
  }
);

const createTemplate1 = deployments.createFixture(
  async ({deployments, getNamedAccounts, ethers}, options) => {
    const {deployer} = await getNamedAccounts();

    const GPU_deployer = await ethers.getContract('CloudX', deployer);
    await GPU_deployer.setServer(formatBytes32String('t2.small'), 2);
    await GPU_deployer.setTemplate(formatBytes32String('template1'), formatBytes32String('t2.small'), fromUSDC(0.2));
    await GPU_deployer.setLimits(1, 32, 4);
  }
);

describe('CloudX', () => {
  it('should allow renting 1 hour', async () => {
    const {user1} = await getNamedAccounts();
    const {GPU_user1, USDC_user1} = await deploy();
    await giveUSDC();
    await createTemplate1();

    await expect(GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'))).to.emit(GPU_user1, 'Rent').withArgs(1);
    const blockTimestamp = await getBlockTime();
    const [userInfo, expired] = await GPU_user1.userInfo(BigInt(1));
    expect(userInfo.user).to.equal(user1);
    expect(userInfo.expires).to.equal(BigInt(blockTimestamp + 3600));
    expect(userInfo.templateId).to.equal(formatBytes32String('template1'));
    expect(userInfo.region).to.equal(1);
    expect(userInfo.payment).to.equal(fromUSDC('0.2'));
    expect(expired).to.equal(false);
    expect((await GPU_user1.usage(1)).t).to.equal(2);
    expect(await USDC_user1.balanceOf(GPU_user1.address)).to.equal(fromUSDC(0.2));
    expect(await USDC_user1.balanceOf(user1)).to.equal(fromUSDC(100 - 0.2));
  });

  it('should allow stopping server for credits', async () => {
    const {deployer, dev, user1} = await getNamedAccounts();
    const {GPU_deployer, GPU_user1, USDC_user1} = await deploy();
    await giveUSDC();
    await createTemplate1();
    await GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'));
    const currentBlockTime = await getBlockTime();
    await time.setNextBlockTimestamp(currentBlockTime + 1800); // half hour
    await GPU_user1.stopRental(1);

    const expectedSpend = fromUSDC('0.2').mul(31).div(60);
    const balance = fromUSDC('100').sub(expectedSpend);
    expect(await USDC_user1.balanceOf(user1)).to.be.approx(balance);
    expect(await USDC_user1.balanceOf(dev)).to.be.approx(expectedSpend);
    expect(await USDC_user1.balanceOf(GPU_user1.address)).to.equal(0);
    expect((await GPU_user1.usage(1)).t).to.equal(0);
    const [userInfo, expired] = await GPU_user1.userInfo(BigInt(1));
    expect(expired).to.equal(true);
  });

  it('should allow extending rental', async () => {
    const {deployer, dev, user1} = await getNamedAccounts();
    const {GPU_deployer, GPU_user1, USDC_user1} = await deploy();
    await giveUSDC();
    await createTemplate1();
    await GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'));
    const blockTimestamp = await getBlockTime();

    await GPU_user1.extendRental(1, fromUSDC('0.2'));
    const [userInfo, expired] = await GPU_user1.userInfo(BigInt(1));
    expect(userInfo.user).to.equal(user1);
    expect(userInfo.expires).to.equal(BigInt(blockTimestamp + 7200), 'expires');
    expect(userInfo.templateId).to.equal(formatBytes32String('template1'));
    expect(userInfo.region).to.equal(1);
    expect(userInfo.payment).to.equal(fromUSDC('0.4'));
    expect(expired).to.equal(false);
    expect((await GPU_user1.usage(1)).t).to.equal(2);
    expect(await USDC_user1.balanceOf(GPU_user1.address)).to.equal(fromUSDC(0.4));
    expect(await USDC_user1.balanceOf(user1)).to.equal(fromUSDC(100 - 0.4));
  });

  it('should not allow renting if no allowance', async () => {
    const {GPU_user1} = await deploy();
    await createTemplate1();
    await expect(GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.1'))).to.be
      .revertedWith('ERC20: insufficient allowance');
  });

  it('should not allow renting if no usdc', async () => {
    const {GPU_user1, USDC_user1} = await deploy();
    await createTemplate1();
    await USDC_user1.approve(GPU_user1.address, fromUSDC(100));
    await expect(GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.1'))).to.be
      .revertedWith('ERC20: transfer amount exceeds balance');
  });

  it('should not allow renting invalid template ', async () => {
    const {GPU_user1} = await deploy();
    await giveUSDC();

    await expect(GPU_user1.rent('abc', formatBytes32String('tiny'), 1, fromUSDC('0.1'))).to.be.revertedWith('template not found');
  });

  it('should not allow renting if no cpus available', async () => {
    const {GPU_user1, GPU_deployer} = await deploy();
    await giveUSDC();
    await GPU_deployer.setServer(formatBytes32String('t2.small'), 2);
    await GPU_deployer.setTemplate(formatBytes32String('template1'), formatBytes32String('t2.small'), fromUSDC(0.2));

    await expect(GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.1'))).to.be
      .revertedWith('No resources available for CPU servers');
  });

  it('should not allow renting if usage is too high', async () => {
    const {GPU_user1, GPU_deployer} = await deploy();
    await giveUSDC();
    await GPU_deployer.setServer(formatBytes32String('t2.small'), 2);
    await GPU_deployer.setServer(formatBytes32String('t2.tiny'), 1);
    await GPU_deployer.setTemplate(formatBytes32String('template1'), formatBytes32String('t2.small'), fromUSDC(0.2));
    await GPU_deployer.setTemplate(formatBytes32String('template2'), formatBytes32String('t2.tiny'), fromUSDC(0.2));
    await GPU_deployer.setLimits(1, 2, 0);

    await GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.1'));
    expect((await GPU_user1.usage(1)).t).to.equal(2);
    await expect(GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'))).to.be
      .revertedWith('No resources available for CPU servers');

    await GPU_deployer.setLimits(1, 3, 0);
    await expect(GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'))).to.be
      .revertedWith('No resources available for CPU servers');
    await GPU_user1.rent('abc', formatBytes32String('template2'), 1, fromUSDC('0.1'));
    expect((await GPU_user1.usage(1)).t).to.equal(3);
  });

  it('should not allow renting for less than minimum time', async () => {
    const {GPU_user1, GPU_deployer} = await deploy();
    await giveUSDC();
    await createTemplate1();

    await expect(GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.01'))).to.be
      .revertedWith('minimum rental time not met');
  });

  it('should not allow renting for more than maximum time', async () => {
    const {GPU_user1, USDC_user1} = await deploy();
    await USDC_user1.giveMe(fromUSDC(10000));
    await USDC_user1.approve(GPU_user1.address, fromUSDC(10000));
    await createTemplate1();

    await expect(GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC(0.2 * 24 * 31))).to.be
      .revertedWith('max rental time');

    await GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC(0.2 * 24 * 29));
    await expect(GPU_user1.extendRental(1, fromUSDC(0.2 * 24 * 2))).to.be.revertedWith('max rental time');
  });

  it('should provide refund by owner', async () => {
    const {deployer, dev, user1} = await getNamedAccounts();
    const {GPU_deployer, GPU_user1, USDC_user1} = await deploy();
    await giveUSDC();
    await createTemplate1();
    await GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'));

    await GPU_deployer.provideRefund(1);
    expect(await USDC_user1.balanceOf(GPU_user1.address)).to.equal(fromUSDC(0));
    expect(await USDC_user1.balanceOf(user1)).to.equal(fromUSDC(100));
    expect(await USDC_user1.balanceOf(dev)).to.equal(fromUSDC(0));
  });

  it('should clean up servers', async () => {
    const {deployer, dev, user1} = await getNamedAccounts();
    const {GPU_deployer, GPU_user1, USDC_user1} = await deploy();
    await giveUSDC();
    await createTemplate1();
    await GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'));

    const currentBlockTime = await getBlockTime();
    await time.setNextBlockTimestamp(currentBlockTime + 3700); // over 1 hour

    await GPU_user1.cleanUpOldRentals();
    expect(await USDC_user1.balanceOf(GPU_user1.address)).to.equal(fromUSDC(0));
    expect(await USDC_user1.balanceOf(user1)).to.equal(fromUSDC(100 - 0.2));
    expect(await USDC_user1.balanceOf(dev)).to.equal(fromUSDC(0.2));
  });

  it('should clean up servers before renting again', async () => {
    const {deployer, dev, user1} = await getNamedAccounts();
    const {GPU_deployer, GPU_user1, GPU_user2} = await deploy();
    await giveUSDC();
    await createTemplate1();
    await GPU_deployer.setLimits(1, 4, 0);
    await GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'));

    const currentBlockTime = await getBlockTime();
    await time.setNextBlockTimestamp(currentBlockTime + 1800); // half hour

    await GPU_user2.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'));

    await time.setNextBlockTimestamp(currentBlockTime + 3700); // over 1 hour

    await GPU_user1.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'));
    await time.setNextBlockTimestamp(currentBlockTime + 3800); // over 1 hour
    await expect(GPU_user2.rent('abc', formatBytes32String('template1'), 1, fromUSDC('0.2'))).to.be
      .revertedWith('No resources available for CPU servers');
  });
});
