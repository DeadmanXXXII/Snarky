const Tumbler = artifacts.require("Tumbler");

module.exports = function (deployer) {
    const initialFeePercentage = 500; // Example: 5% fee (500 basis points)
    deployer.deploy(Tumbler, initialFeePercentage);
};

