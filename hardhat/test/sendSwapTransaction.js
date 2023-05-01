
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

const {
    addressFactory,
    addressRouter,
    addressFrom,
    addressTo
} = require("../utils/AddressList");

const {erc20ABI,
    factoryABI,
    routerABI} = require("../utils/AbiList");

describe("Ler e escrever na BlockChain", () => {
    let provider, ContractFactory, contractRouter, contractToken, decimals, amountIn, amountOut;
    //let e não uma const
    //declarando as variaveis globais

    //Conectando ao provedor(Nó)
    provider = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/P2C1seY9sUumftbgS1NcHUv9zsPOhGHC");
    
    //Endereços dos contratos
    ContractFactory = new ethers.Contract(addressFactory, factoryABI, provider);
    contractRouter = new ethers.Contract(addressRouter, routerABI, provider);
    contractToken = new ethers.Contract(addressFrom, erc20ABI, provider);

    const amountInHuman = "1";
    amountIn = ethers.utils.parseUnits(amountInHuman, decimals).toString();

    //get price information
    const getAmountsOut = async() =>{
        decimals = await contractToken.decimals();
        
        amountOut = await contractRouter.getAmountsOut(amountIn,[
            addressFrom, 
            addressTo 
        ]);
        
        console.log(amountOut);

        return amountOut[1].toString();
    };
    


    it("conects em um provedor, factory, token and router", () => {
        assert(provider._isProvider);
        expect(ContractFactory.address).to.equal("0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f");

        expect(contractRouter.address).to.equal("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
        expect(contractToken.address).to.equal("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
    });

    it("gets o preço da amount ", async() =>{
        const amount = getAmountsOut();
        assert(amount.toString());
        console.log(amount.toString());
        
    });
   
    it("manda a transação", async () =>{
        const [ownerSigner] = await ethers.getSigners();
        //console.log(ownerSigner)

        const mainnetForkUniswapRouter = new ethers.Contract(
            addressRouter,
            routerABI,
            ownerSigner
        );

        const myAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        
        const txSwap = await mainnetForkUniswapRouter.swapExactTokensForTokens(
            amountIn,// amount In
            amountOut,// amount out
            [addressFrom, addressTo], // path
            myAddress,// address to
            Date.now() + 1000*60*5,// deadline
            {
                gasLimit: 200000,
                gasPrice: ethers.utils.parseUnits("5.5", "gwei"),
            }// gas
        );
        
        assert(txSwap.hash);

        const mainnetForkProvider = waffle.provider;
        const txReceipt = await mainnetForkProvider.getTransactionReceipt(
            txSwap.hash
        );

        console.log(txSwap);

        console.log(txReceipt);
    }); 
});


