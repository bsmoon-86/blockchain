const Survey = artifacts.require("Survey");

module.exports = function (deployer) {
  deployer.deploy(Survey);
};
