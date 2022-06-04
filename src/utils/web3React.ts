import Web3 from 'web3'

require('dotenv').config()

export const getLibrary = (provider:any): Web3 => {
  return provider
}