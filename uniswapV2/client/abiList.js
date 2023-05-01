//peguei pesquisando o addressFactory no bscScan e olhando o contrato
const erc20ABI = ["function decimals() external pure returns (uint8)"];

const factoryABI = ["function getPair(address tokenA, address tokenB) external view returns (address pair)"];

const pairABI = [
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)",
];

const routerABI = [
    "function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint amountOut)",
    "function getAmountsOut(uint amountIn, address[] memory path) public view  returns (uint[] memory amounts)"
];

module.exports = {
    erc20ABI,
    factoryABI,
    pairABI,
    routerABI
}