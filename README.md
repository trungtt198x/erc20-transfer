# ERC20 Transfer Sync and Retrieve

## Installation

`npm i`

## Start

### Start MongoDB server listenning at port `27017`

Other listenning port, please set the param `MONGO_PORT` in `package.json`

### Start API server

  - Interact with `kovan` network: `npm run kovan`
  - Interact with `mainnet` network: `npm run mainnet`

**Listenning port:** `3000`

Other listenning port, please set the param `PORT` in `package.json`

## API

**POST**

```
localhost:3000/api/v1/transactions/0x2002D3812F58e35F0EA1fFbf80A75a38c32175fA?owner=0x6b194E74825BF0Ec067a6fDB8d9a48668BA842e7
```

Used to get from chain and store into MongoDB the ERC20 token transfers for the specified `owner` address

**GET**

```
localhost:3000/api/v1/transactions/0x2002D3812F58e35F0EA1fFbf80A75a38c32175fA?owner=0x6b194E74825BF0Ec067a6fDB8d9a48668BA842e7&limit=10&skip=1
```

Used to retrieve from MongoDB the ERC20 token transfers for the specified `owner` address with optional `limit` and `skip`

## Stored data

  - Collection `transferdatas` stores the ERC20 token transfers

```
erc20Address: { type: String, required: true },
from: { type: String, required: true },
to: { type: String, required: true },
value: { type: String, required: true },
hash: { type: String, required: true },
blockHash: { type: String, required: true },
blockNumber: { type: Number, required: true },
type: { type: String }
```

  - Collection `lastcheckblockdatas` stores the last checked block numbers

```
erc20Address: { type: String, required: true },
owner: { type: String, required: true },
blockNumber: { type: Number, required: true }
```




