const Web3 = require("web3");
const transferDataModel = require("../model/transferDataModel");
const lastCheckBlockModel = require("../model/lastCheckBlockModel");

const infuraLink = process.env.NODE_ENV === 'kovan' ? 
  'https://kovan.infura.io/v3/c81ee4a9ca67464e816fff9ce7855cdd'
  :
  'https://mainnet.infura.io/v3/c81ee4a9ca67464e816fff9ce7855cdd'

const web3 = new Web3(new Web3.providers.HttpProvider(infuraLink))

// const walletModel = require('../model/walletModel')
const TOKEN_ABI = require('./abi')

const INTERVAL = 5000;

const ETH_MIN_BLOCK_TIME = 10 //s
const MAX_NEW_BLOCKS = 30 / ETH_MIN_BLOCK_TIME

let isRunning = {}
let tokenContract = {}
let fromBlockPreviousRun = {}
let timer = {}
const maxQueryBlocks = 100

const core = {

  getTokenTransfersFromChainWrapper(erc20Address, owner) {
  
    const timerId = setInterval(() => {
      core.getTokenTransfersFromChain(erc20Address, owner)
    }, INTERVAL)

    timer[`${erc20Address-owner}`] = timerId
  },

  async getTokenTransfersFromChain(erc20Address, owner) {
    
    // erc20Address = '0x2002D3812F58e35F0EA1fFbf80A75a38c32175fA'
    // owner = '0x759bdf07766715d38a2085b891efd4cb81dc6eed'

    if (isRunning[`${erc20Address-owner}`]) {
      return
    }

    isRunning[`${erc20Address-owner}`] = true
    
    // Instantiate token contract object with JSON ABI and address
    if (!tokenContract[erc20Address]) {
      tokenContract[erc20Address] = new web3.eth.Contract(
        TOKEN_ABI, erc20Address,
        (error, result) => { 
          if (error) {
            console.log('Referencing erc20Address (', erc20Address, ') Error:', error)
            isRunning[`${erc20Address-owner}`] = false
          }
        }
      )
    }

    const lastCheckBlockNum = await lastCheckBlockModel.getLastCheckBlockNum(erc20Address, owner)
    const currentBlock = await web3.eth.getBlockNumber()
    
    let fromBlock = lastCheckBlockNum || 1

    // Ensure the "toBlock" not exceed the max 10K blocks from the "fromBlock"
    let toBlock = Number(fromBlock) + maxQueryBlocks

    if (Number(toBlock) >= Number(currentBlock)) {
      toBlock = 'latest'
    }

    console.log(`getTokenTransfersFromChain (${erc20Address}) - Running (from block:${fromBlock}, toBlock:${toBlock})`)

    const events = await tokenContract[erc20Address].getPastEvents(
      "Transfer",
      {                               
        fromBlock,     
        toBlock
      }
    )

    // Store last check block num
    const lastCheckBlockModelObj = new lastCheckBlockModel({
      erc20Address, 
      owner,
      blockNumber: toBlock !== 'latest' ? toBlock + 1 : currentBlock
    });
    await lastCheckBlockModelObj.save();

    console.log(events);
    
    for (let event of events) {
      await core.tokenTransferEventHandler(event, erc20Address, owner)
    }

    if (toBlock === 'latest') {
      clearInterval(timer[`${erc20Address-owner}`])
    }

    isRunning[`${erc20Address-owner}`] = false

  },

  async tokenTransferEventHandler(event, erc20Address, owner) {
    if (owner.toLowerCase() !== event.returnValues._from.toLowerCase() && owner !== event.returnValues._to.toLowerCase()) {
      return
    }

    const data = {
      erc20Address,
      from: event.returnValues._from,
      to: event.returnValues._to,
      value: event.returnValues._value,
      hash: event.transactionHash,
      blockHash: event.blockHash,
      blockNumber: event.blockNumber,
      type: event.type
    }
    
    // Store erc20 transfer data
    const transferDataModelObj = new transferDataModel(data);
    await transferDataModelObj.save();
  },

  async list(erc20Address, owner, limit, skip) {
    limit = Number(limit || 10)
    skip = Number(skip || 0)

    return transferDataModel.find({erc20Address, $or:[{'from': owner}, {'to': owner}]}).limit(limit).skip(skip)
  }
}

module.exports = core

