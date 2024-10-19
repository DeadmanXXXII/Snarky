const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*",
        },
        // Other networks can be added here if needed
    },
    compilers: {
        solc: {
            version: "0.8.0",
        },
    },
};
