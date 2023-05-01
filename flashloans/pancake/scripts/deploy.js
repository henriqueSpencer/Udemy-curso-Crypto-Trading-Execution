const { ethers } = require("hardhat");

//Deploiando o contrato !!
async function main() {
  const [deploy] = await ethers.getSigners(); //

  console.log('deploiando contrato com a conta: ', deploy.address);
  console.log("account balance: ", (await deploy.getBalance()).toString());

  const Token = await ethers.getContractFactory("PancakeFlashSwap");
  const token = await Token.deploy();

  console.log('Token address: ' + token.address);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);

})