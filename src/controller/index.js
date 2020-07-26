const transferDataModel = require("../model/transferDataModel");
const core = require("../core");

exports.syncErc20Transfer = async (req, res, next) => {
  try {
    const { erc20Address } = req.params;
    if (!erc20Address) {
      return res.status(400).json({
        status: "failure",
        message: "Please provide ERC20 token address",
      });
    }

    const { owner } = req.query;
    if (!owner) {
      return res.status(400).json({
        status: "failure",
        message: "Please provide owner address",
      });
    }

    console.log(
      `syncErc20Transfer - erc20Address:${erc20Address}, owner:${owner}`
    );

    // For test
    // erc20Address: 0x2002D3812F58e35F0EA1fFbf80A75a38c32175fA
    // owner=0x6b194E74825BF0Ec067a6fDB8d9a48668BA842e7
    // block:19799125
    core.getTokenTransfersFromChainWrapper(erc20Address, owner)

    return res.status(200).json({
      status: "ok",
      message: "syncErc20Transfer started",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failure",
      message: "Internal error",
    });
  }
};

exports.listErc20Transfer = async (req, res, next) => {
  try {

    const { erc20Address } = req.params;
    if (!erc20Address) {
      return res.status(400).json({
        status: "failure",
        message: "Please provide ERC20 token address",
      });
    }

    const { owner, limit, skip } = req.query;
    if (!owner) {
      return res.status(400).json({
        status: "failure",
        message: "Please provide owner address",
      });
    }

    const result = await core.list(erc20Address, owner, limit, skip)

    return res.status(200).json({
      status: "ok",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failure",
      message: "Internal error",
    });
  }
};
