import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function read() {
  const url = 'https://mainnet.infura.io/v3/' + process.env.INFURA_PROJECT_ID
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "eth_call",
      params: [
          {
              from: "0x0000000000000000000000000000000000000000",
              data: "0x70a082310000000000000000000000002cea91416b0a752bf9a4b407ff46206d67ccd413",
              to: "0xae7ab96520de3a18e5e111b5eaab095312d7fe84"
          },
          "latest"
      ]
    }),
  });
  const data = await response.json();
  const balanceOf = parseInt(data.result, '16')
  console.log(data.result, balanceOf)
  return balanceOf
}

read()
