// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

// precisa disso para conseguir receber um flash loan
import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";


import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase{
    address payable owner;

    constructor(address _addresProvider ) 
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addresProvider))
        {}
}