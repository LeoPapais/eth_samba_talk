import axios from 'axios';
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
dotenv.config();

const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;

const mintDai = async () => {
  console.time('Simulation');
  const wardAddress = '0xe2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2';
  // calculte the storage location of `wards[wardAddress]`
  // yields 0xedd7d04419e9c48ceb6055956cbb4e2091ae310313a4d1fa7cbcfe7561616e03
  const overrideStorageLocation = ethers.utils.keccak256(
    ethers.utils.concat([
      ethers.utils.hexZeroPad(wardAddress, 32), // the ward address (address 0xe2e..2) - mapping key
      ethers.utils.hexZeroPad('0x0', 32), // the wards slot is 0th  in the DAI contract - the mapping variable
    ])
  );
  console.log('Storage Override Location', overrideStorageLocation);
  const mint = (
    await axios.post(
      `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate`,
      // the transaction
      {
        save: true,
        save_if_fails: true,
        simulation_type: 'full',
        network_id: '1',
        from: '0xe2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2',
        to: '0x6b175474e89094c44da98b954eedeac495271d0f',
        input: '0x40c10f19000000000000000000000000e58b9ee93700a616b50509c8292977fa7a0f8ce10000000000000000000000000000000000000000000000001bc16d674ec80000',
        gas: 8000000,
        state_objects: {
          '0x6b175474e89094c44da98b954eedeac495271d0f': {
            storage: {
              '0xedd7d04419e9c48ceb6055956cbb4e2091ae310313a4d1fa7cbcfe7561616e03':
                '0x0000000000000000000000000000000000000000000000000000000000000001',
            },
          },
        },
      },
      {
        headers: {
          'X-Access-Key': TENDERLY_ACCESS_KEY,
        },
      }
    )
  ).data;

  console.timeEnd('Simulation');
  console.log(JSON.stringify(mint.transaction.transaction_info.logs, null, 2));
  // TODO: extract token transferred
};


mintDai()