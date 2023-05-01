
//https://docs.uniswap.org/contracts/v2/reference/smart-contracts/factory
//serve para ver as infos dos pools e das moedas 
const addressFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"; //pancakeswap factory address BINANCE CHAIN
//serve para vermos a precificacao 
const addressRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; //pancakeswap ROUTER address 
const addressFrom = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Weth
const addressTo = "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"; // Sushi token

module.exports = {
    addressFactory,
    addressRouter,
    addressFrom,
    addressTo,
};
