import { ethers } from 'ethers'

import abi from './lido_abi.json' assert { type: 'json' }
import dotenv from 'dotenv';

dotenv.config();

async function read() {
  const url = 'https://mainnet.infura.io/v3/' + process.env.INFURA_PROJECT_ID
  const rpcProvider = new ethers.providers.JsonRpcProvider(url)
  const contractAddress = '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
  const walletAddress = '0x2cea91416b0a752bf9a4b407ff46206d67ccd413'

  const contract = new ethers.Contract(contractAddress, abi, rpcProvider)
  
  const balanceOf = await contract.balanceOf(walletAddress)

  console.log(balanceOf.toString())
}

read()
