const StakingToken = artifacts.require("StakingToken");
const BigNumber = require('bignumber.js');

module.exports = function (deployer) {
  const manyTokens = BigNumber(10).pow(18).multipliedBy(1000);
  deployer.deploy(StakingToken, '0x49410844C9A37554C1E9d216a983A11E5758b4F2', manyTokens.toString(10));
};
