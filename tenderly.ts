import { post } from './axios'
import { ethers } from 'ethers'

export default async function simulateTx(populatedTransaction: any, blockNumber: any, stateOverrides: any) {
  const TENDERLY_USER = 'Pods-tech'
  const TENDERLY_PROJECT = 'yield'
  const SIMULATE_URL = `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate`

  // If you don't have one, or you want to generate
  // a new go to: https://dashboard.tenderly.co/account/authorization
  const opts = {
    headers: {
      'X-Access-Key': process.env.TENDERLY_ACCESS_KEY
    }
  }

  const body: any = {
    // standard TX fields
    network_id: '1',
    to: populatedTransaction.to,
    from: ethers.constants.AddressZero,
    input: populatedTransaction.data,
    gas: 2100000,
    gas_price: '0',
    value: 0,
    // simulation config (tenderly specific)
    save_if_fails: true,
    save: false,
    simulation_type: 'full'
  }

  if (populatedTransaction.from) {
    body.from = populatedTransaction.from
  }

  if (blockNumber) {
    body.block_number = blockNumber
  }

  if (stateOverrides) {
    body.state_objects = stateOverrides
  }

  try {
    const _ = await post(SIMULATE_URL, body, opts.headers)
    return _
  } catch (err) {
    console.log(err)
  }
}
