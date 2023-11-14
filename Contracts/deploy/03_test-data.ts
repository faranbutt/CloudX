import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {formatBytes32String} from 'ethers/lib/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {get, execute} = deployments;

  const {deployer, user1} = await getNamedAccounts();

  // console.log('dply', deployer, ', usr1 ', user1)

  const cloudXAdd = await get('CloudX');
  console.log('cloudXAdd:', cloudXAdd.address)
  const cloudX =  await ethers.getContractAt(cloudXAdd.abi, cloudXAdd.address)
  console.log('Limit Reg 1: ', (await cloudX.limits(1)))
  console.log('Limit Reg 2: ', (await cloudX.limits(2)))

  console.log('u Reg 1: ', (await cloudX.usage(1)))
  console.log('u Reg 2: ', (await cloudX.usage(2)))

  // await execute('USDC', {from: user1}, 'giveMe', ethers.utils.parseUnits('1000', 6));

  // await execute('CloudX', {from: deployer}, 'setLimits', 1, 8, 8);
  // await execute('CloudX', {from: deployer}, 'setLimits', 2, 8, 8);

  // // await execute('CloudX', {from: deployer}, 'setLimits', 2, 2, 4);

  // await execute('CloudX', {from: deployer}, 'setServer', formatBytes32String('g4dn.xlarge'), 4);
  // await execute('CloudX', {from: deployer}, 'setServer', formatBytes32String('t2.medium'), 2);

  // await execute('CloudX', {from: deployer}, 'setServer', formatBytes32String('t2.micro'), 1);

  await execute('CloudX', {from: deployer}, 'setServer', formatBytes32String('t3.micro'), 2);


  // await execute('CloudX', {from: deployer}, 'setTemplate', formatBytes32String('t3.micro'), formatBytes32String('t3.micro'),
  //   ethers.utils.parseUnits('0.02', 6));

  // await execute('CloudX', {from: deployer}, 'setTemplate', formatBytes32String('diffusion.xlarge'), formatBytes32String('g4dn.xlarge'),
  //   ethers.utils.parseUnits('1', 6));
  // await execute('CloudX', {from: deployer}, 'setTemplate', formatBytes32String('docker.medium'), formatBytes32String('t2.medium'),
  //   ethers.utils.parseUnits('0.1', 6));

  //   await execute('CloudX', {from: deployer}, 'setTemplate', formatBytes32String('docker.micro'), formatBytes32String('t2.micro'),
  //   ethers.utils.parseUnits('0.05', 6));
};
export default func;
func.tags = ['Test'];
func.dependencies=["CloudX"]
