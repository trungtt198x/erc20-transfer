const mongoose = require('mongoose');

const lastCheckBlockSchema = new mongoose.Schema({
  erc20Address: { type: String, required: true },
  owner: { type: String, required: true },
  blockNumber: { type: Number, required: true }
});

// static methods
lastCheckBlockSchema.statics = {
  async getLastCheckBlockNum(erc20Address, owner){
    let blockNum = null;
    
    const result =  await this.find({
      erc20Address,
      owner
    }).sort({blockNumber: -1});

    if (result.length) {
      blockNum = result[0].blockNumber
    }
    
    console.log(`getLastCheckBlockNum - erc20Address:${erc20Address}, owner:${owner}, blockNum:${blockNum}`);
    return blockNum;
  },
};

module.exports = mongoose.model('LastCheckBlockData', lastCheckBlockSchema);
