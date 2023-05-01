
//https://docs.uniswap.org/protocol/reference/deployments
//https://docs.uniswap.org/sdk/v3/guides/quoting#referencing-the-quoter-contract-and-getting-a-quote

const { ethers } = require("ethers");

const {abi: IUniswapV3PoolABI} = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
const {abi: Quoter} = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json')



//Standard Provider
const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-mainnet.g.alchemy.com/v2/P2C1seY9sUumftbgS1NcHUv9zsPOhGHC"
);// pegas os nos disponiveis 

async function getPrice(addressFrom, addressTo, amountInHuman){
    const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

    const quoterContract = new ethers.Contract(
        quoterAddress,
        Quoter,
        provider
    );

    const amountIn = ethers.utils.parseUnits(amountInHuman, 6);
    
    const quoteAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
        addressFrom,
        addressTo,
        3000,
        amountIn.toString(),
        0
    );
    
    const amount = ethers.utils.formatUnits(quoteAmountOut.toString(), 18);
    return amount;

};

const main = async ()=> {
    const addressFrom = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; //USDC
    const addressTo = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH
    const amountInHuman = "2900";

    const amountOut = await getPrice(addressFrom, addressTo, amountInHuman);
    console.log(amountOut);
};

main();