const mongoose = require('mongoose');

const transferDataSchema = new mongoose.Schema({
  erc20Address: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  value: { type: String, required: true },
  hash: { type: String, required: true },
  blockHash: { type: String, required: true },
  blockNumber: { type: Number, required: true },
  type: { type: String }
});


module.exports = mongoose.model('TransferData', transferDataSchema);
