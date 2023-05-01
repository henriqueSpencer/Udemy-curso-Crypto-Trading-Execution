pragma solidity >=0.7.0 < 0.9.0;


contract MyEpicCoin{
    uint avalibleSupply;
    uint maxSuply;

    constructor(uint _startingSupply, uint _maxSupply){
        avalibleSupply = _startingSupply;
        maxSuply = _maxSupply;
    }
}

contract MyEpicToken is MyEpicCoin{
    constructor(uint ss, uint ms) MyEpicCoin (ss, ms){}
    
}