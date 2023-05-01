const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { impersonateFoundEcr30, impersonateFundErc20 } =  require("../utils/utilities"); // se apropiando de outra conta com fundos

const { abi } = require("../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");
const { inputToConfig } = require("@ethereum-waffle/compiler");

const provider = waffle.provider;//ethers.provider;//waffle.provider;

describe("FlashSwap Contract", ()=>{
  let FLASHSWAP, BORROW_AMOUNT, FUND_AMOUNT, initialFundHuman, txArbitrage, gasUsedUSD;
    
  
  const DECIMALS = 18;

  const BUSD_WHALE = "0xf977814e90da44bfa03b6295a0616a897441acec";//"0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503"; //large busd addresses //https://www.coincarp.com/currencies/binanceusd/richlist/
  const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
  const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
  const CAKE = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82";
  const USDT = "0x55d398326f99059fF775485246999027B3197955";
  const CROX = "0x2c094F5A7D1146BB93850f629501eB749f6Ed491";

  const BASE_TOKEN_ADDRESS = BUSD; // Ele vai ser o token base de toda transacao.

  const tokenBase = new ethers.Contract(BASE_TOKEN_ADDRESS, abi, provider); // conecatando ao contrato


  beforeEach(async () =>{  //Teste antes dos testes
    // get o owner as signer

    [owner] = await ethers.getSigners();

    // certificando que a baleia tem balanco
    const whale_balance = await provider.getBalance(BUSD_WHALE);
    console.log(` BALANCO:  ${whale_balance}`);
    console.log(whale_balance);
    expect(whale_balance).not.equal("0");

    // Deploy smart contract
    const FlashSwap = await ethers.getContractFactory("PancakeFlashSwap");
    FLASHSWAP = await FlashSwap.deploy();
    await FLASHSWAP.deployed();

    // Configure our Borrowing
    const borrowAmountHuman = "1";
    BORROW_AMOUNT = ethers.utils.parseUnits(borrowAmountHuman, DECIMALS);
    console.log(BORROW_AMOUNT);

    // Configure Funding - FOR TESTING ONLY
    initialFundHuman = "100";
    FUND_AMOUNT = ethers.utils.parseUnits(initialFundHuman, DECIMALS);
    console.log(FUND_AMOUNT);

    // Fund our Contract - FOR TESTING ONLY
    await impersonateFundErc20(
      tokenBase,
      BUSD_WHALE,
      FLASHSWAP.address,
      initialFundHuman
    );

  });
    
    describe("Arbitrage Execution ", () => {
      it("ensures the contract is funded", async () => {
        const flashSwapBalance = await FLASHSWAP.getBalanceOfToken(
          BASE_TOKEN_ADDRESS
        );
        const flashSwapBalanceHuman =  ethers.utils.formatUnits(
          flashSwapBalance, 
          DECIMALS
        );
        
        console.log(flashSwapBalanceHuman);

        expect(Number(flashSwapBalanceHuman)).equal(Number(initialFundHuman));
      });

      it("executes the arbitrage", async () => {
        txArbitrage = await FLASHSWAP.startArbitrage(
          BASE_TOKEN_ADDRESS,
          BORROW_AMOUNT
        );

        assert(txArbitrage);

        //Print balance
        const contractBalanceBUSD = await FLASHSWAP.getBalanceOfToken(BUSD);
        const formattedBalBUSD = Number(
          ethers.utils.formatUnits(contractBalanceBUSD, DECIMALS)
        );
        console.log("Balance of BUSD: " + formattedBalBUSD);

      });

    });
  

});
      


describe("Token contract", () =>{
  it("print OLA", () =>{
    console.log("Ola");
  });
});