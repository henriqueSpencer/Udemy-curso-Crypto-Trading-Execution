
const ethers = require("ethers");

const { 
    addressFactory,
    addressRouter, 
    addressFrom, 
    addressTo 
} = require("./AddressList");

const { 
    erc20ABI,
    factoryABI,
    routerABI,
    pairABI
} = require("./abiList");

//Standard Provider
const provider = new ethers.providers.JsonRpcProvider(
    "https://bsc-dataseed.binance.org"
);// pegas os nos disponiveis 
//pesquisei bsc json rpc
//console.log(provider);

// Connect to Factory
const contractFactory = new ethers.Contract(
    addressFactory,
    factoryABI,
    provider
);
//console.log(contractFactory);

// Connect to Router
const contractRouter = new ethers.Contract(addressRouter, routerABI, provider);
// console.log(contractRouter);

// call the BlockChain
const getPrices = async(amountInHuman) =>{
    const contractToken = new ethers.Contract(addressFrom, erc20ABI, provider);
    const decimals = await contractToken.decimals();
    const amountIn = ethers.utils.parseUnits(amountInHuman, decimals).toString();
    //console.log(decimals) // retorna 18
    //console.log(amountIn); // transforma o valor humano no valor da moeda 

    //get amounts out
    const amountOut = await contractRouter.getAmountsOut(amountIn,[
        addressFrom, 
        addressTo 
    ]);
    //console.log(amountOut);
    //Convert amount out - decimals
    const contractToken2 = new ethers.Contract(addressTo, erc20ABI, provider);
    const decimals2 = await contractToken2.decimals();

    //Convert amount out - human readable
    const amountOutHuman = ethers.utils.formatUnits(
        amountOut[1].toString(),
        decimals2
        );
    
    console.log(`valor entrada em BUSC:${amountInHuman}  valor saida em WBNB: ${amountOutHuman}`);

};

const amountInHuman ="500";
getPrices(amountInHuman);