import { ethers } from 'ethers'

import abi from './lido_abi.json' assert { type: 'json' }
import dotenv from 'dotenv';

dotenv.config();

async function read(blockTag) {
  const url = 'https://mainnet.infura.io/v3/' + process.env.INFURA_PROJECT_ID
  const rpcProvider = new ethers.providers.JsonRpcProvider(url)
  const contractAddress = '0xc3d688b66703497daa19211eedff47f25384cdc3'

  const encodedBaseSupplyIndex = await rpcProvider.getStorageAt(
    contractAddress,
    0,
    blockTag
  )
  const encodedLastAccrualTime = await rpcProvider.getStorageAt(
    contractAddress,
    1,
    blockTag
  )
  console.log(encodedBaseSupplyIndex)
  // baseSupplyIndex:uint64 has 8 bytes and offset from right to left 0 bytes
  // since it's the first variable of slot 0
  let baseSupplyIndex = getStorageVariable(encodedBaseSupplyIndex, 8, 0)

  // lastAccrualTime:uint40 has 5 bytes and offset from right to left 26 bytes
  // since it comes after 2 uint104 variables. uint104 + uint104 = 208 bits = 26 bytes
  const lastAccrualTime = getStorageVariable(encodedLastAccrualTime, 5, 26)

  console.log({
    baseSupplyIndex: baseSupplyIndex.toString(),
    lastAccrualTime: lastAccrualTime.toString(),
  })
}

function getStorageVariable (storageData, dataSizeInBytes, offsetInBytes) {
  const STORAGE_SIZE = 32
  const actualStorageSize = ethers.utils.hexDataLength(storageData)

  if (actualStorageSize !== STORAGE_SIZE) {
    throw new Error(`\`data\` is not ${STORAGE_SIZE} bytes, received: ${actualStorageSize} bytes`)
  }

  const sliced = ethers.utils.hexDataSlice(storageData, (STORAGE_SIZE - offsetInBytes) - dataSizeInBytes, STORAGE_SIZE - offsetInBytes)
  return ethers.BigNumber.from(sliced)
}

read(16582771) // 51 days ago
read(16889527) // 8 days ago
read('latest')
