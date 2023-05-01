const { ethers } = require("ethers");

// TestNET Provider
const providerTestnet = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/oPnuF0J8B15afRjRPBhvKpVsbv1GFqgl");

const myAddress = "0x20F2885487f62Ca17099e504932930A9870ddF25";
const privateKey = "cb5f937345b487e3088f97d306915acdae27d3c956bfe3a5e7232ba512c1f2dc";

const walletSigner = new ethers.Wallet(privateKey, providerTestnet);

//console.log(walletSigner);

const exchengeETH = async () => {
    const sendValue = '0.01';
    const gasPrice = await providerTestnet.getGasPrice();
    const nonce =1 ; // mudar ele para cada transacao
    const txBuild = {
        from: myAddress,//from
        to: '0xD8Ea779b8FFC1096CA422D40588C4c0641709890',//to
        value: ethers.utils.parseEther(sendValue),//value
        nonce: nonce,//nonce
        gasLimit: 100000,//gas limit
        gasPrice: gasPrice //gas price
    }
    //console.log(txBuild);

    const txSend = await walletSigner.sendTransaction(txBuild);
    console.log('tx enviado')
    console.log(txSend)

};

exchengeETH();
