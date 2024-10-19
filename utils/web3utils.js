const Web3 = require('web3');

const web3 = new Web3(process.env.INFURA_URL);

async function getAccounts() {
    return await web3.eth.getAccounts();
}

async function getBalance(address) {
    return await web3.eth.getBalance(address);
}

module.exports = { getAccounts, getBalance };
