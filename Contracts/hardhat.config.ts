/** @type import('hardhat/config').HardhatUserConfig */
import 'dotenv/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-chai-matchers';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: 0,
    dev: 1,
    user1: 2,
    user2: 3
  },
  networks: {
    hardhat: {
      mining: {
        auto: true,
        interval: 1000
      }
    },
    milkomeda_t: {
			url: "https://rpc-devnet-algorand-rollup.a1.milkomeda.com",
			accounts:
				process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, process.env.PRIVATE_KEY_2!, process.env.PRIVATE_KEY_3!] : [],
			chainId: 200202 ,
      saveDeployments: true,
      tags: ["staging"],
		},
  }
};
