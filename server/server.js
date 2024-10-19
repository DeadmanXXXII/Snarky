const express = require('express'); 
const bodyParser = require('body-parser');
const Web3 = require('web3').default; // Adjusted import
const fs = require('fs');
const { exec } = require('child_process');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const web3 = new Web3(process.env.INFURA_URL);
const TumblerABI = JSON.parse(fs.readFileSync('../build/contracts/Tumbler.json')).abi; // Updated path
const tumblerAddress = "0x346c61fB9878580407596f2977C75c26c03f7d64"; // Deployed contract address
const tumblerContract = new web3.eth.Contract(TumblerABI, tumblerAddress);

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(bodyParser.json());

// Function to log transactions
function logTransaction(type, user, amount, status) {
    const logEntry = `${new Date().toISOString()} - ${type} - User: ${user}, Amount: ${amount}, Status: ${status}\n`;
    fs.appendFileSync(path.join(__dirname, 'transactions.log'), logEntry);
}

// Deposit endpoint
app.post('/deposit', async (req, res) => {
    const { fromAddress, amount } = req.body; // Amount in Ether and fromAddress
    try {
        const receipt = await tumblerContract.methods.deposit().send({
            from: fromAddress, // Use the provided fromAddress
            value: web3.utils.toWei(amount, 'ether')
        });
        logTransaction('Deposit', fromAddress, amount, 'Success');
        res.json({ success: true, receipt });
    } catch (error) {
        logTransaction('Deposit', fromAddress, amount, 'Failed: ' + error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Withdraw endpoint
app.post('/withdraw', async (req, res) => {
    const { toAddress, amount } = req.body; // Amount in Ether and toAddress
    try {
        const receipt = await tumblerContract.methods.withdraw(web3.utils.toWei(amount, 'ether')).send({
            from: toAddress // Use the provided toAddress
        });
        logTransaction('Withdraw', toAddress, amount, 'Success');
        res.json({ success: true, receipt });
    } catch (error) {
        logTransaction('Withdraw', toAddress, amount, 'Failed: ' + error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start Tor Hidden Service
const torPath = 'C:\\Users\\bluco\\AppData\\Roaming\\tor\\torrc\\Browser\\TorBrowser\\Tor\\tor.exe'; // Full path to tor.exe
exec(torPath, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

