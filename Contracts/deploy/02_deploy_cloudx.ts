import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { formatBytes32String } from 'ethers/lib/utils';
import {ethers} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy, get, execute} = deployments;

  const {deployer, dev} = await getNamedAccounts();
  const usdc = await get('USDC');

  await deploy('CloudX', {
    contract: 'CloudX',
    from: deployer,
    args: [usdc.address],
    log: true,
  });

  await execute('CloudX', {from: deployer}, 'changeDevAddress', dev);

  
};
export default func;
func.tags = ['CloudX'];
func.dependencies=["USDC"]
