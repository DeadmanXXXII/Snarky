// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Tumbler {
    address public owner;
    uint256 public feePercentage; // Fee percentage (1% = 100 basis points)
    uint256 public constant BASIS_POINTS = 10000;
    mapping(address => uint256) public deposits;
    address[] public depositors; // Array to store the addresses of depositors

    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);
    event OwnerWithdraw(address indexed to, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(uint256 _feePercentage) {
        require(_feePercentage <= 1000, "Fee must be less than or equal to 10%");
        owner = msg.sender;
        feePercentage = _feePercentage;
    }

    function deposit() public payable {
        require(msg.value > 0, "Must send some ether to deposit");
        
        uint256 fee = (msg.value * feePercentage) / BASIS_POINTS;
        uint256 depositAmount = msg.value - fee;
        
        deposits[msg.sender] += depositAmount;

        // Check if the depositor is new and add them to the depositors array
        if (deposits[msg.sender] == depositAmount) {
            depositors.push(msg.sender);
        }

        emit Deposit(msg.sender, depositAmount);
    }

    function withdraw(uint256 amount) public {
        require(deposits[msg.sender] >= amount, "Insufficient balance to withdraw");

        deposits[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    // Allows the owner to withdraw collected fees
    function withdrawFees() public onlyOwner {
        uint256 contractBalance = address(this).balance;
        uint256 totalDeposits = 0;

        // Calculate total deposits for all users
        for (uint256 i = 0; i < depositors.length; i++) {
            totalDeposits += deposits[depositors[i]];
        }

        uint256 feesCollected = contractBalance - totalDeposits;
        require(feesCollected > 0, "No fees available for withdrawal");

        payable(owner).transfer(feesCollected);
        emit OwnerWithdraw(owner, feesCollected);
    }

    // Allow the owner to change the fee percentage
    function setFeePercentage(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 1000, "Fee must be less than or equal to 10%");
        feePercentage = newFeePercentage;
    }

    // Fallback function to handle direct ETH transfers to the contract
    receive() external payable {
        deposit();
    }

    fallback() external payable {
        deposit();
    }
}
