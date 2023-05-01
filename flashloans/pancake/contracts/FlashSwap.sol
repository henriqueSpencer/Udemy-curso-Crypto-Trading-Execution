// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.6;

import "hardhat/console.sol";

//Uniswap interface e library importaçoes
import "./libraries/UniswapV2Library.sol";
import "./libraries/SafeERC20.sol";
import "./interfaces/IUniswapV2Router01.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IERC20.sol";

contract PancakeFlashSwap {
    using SafeERC20 for IERC20; //Aprovacao para executar a operacao

    // Enderecos da fabrica e Rota
    address private constant PANCAKE_FACTORY = 0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73; // Constant em solidity é mais barata pela memoria alocada
    address private constant PANCAKE_ROUTER = 0x10ED43C718714eb63d5aA57B78B54704E256024E;

    // Token Address
    address private constant WBNB = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c;
    address private constant BUSD = 0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56;
    address private constant CAKE = 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82;
    address private constant USDT = 0x55d398326f99059fF775485246999027B3197955;
    address private constant CROX = 0x2c094F5A7D1146BB93850f629501eB749f6Ed491;

    // Variaveis do trade
    uint256 private deadline = block.timestamp + 1 days; //Limite da operacao
    uint256 private constant MAX_INT = 115792089237316195423570985008687907853269984665640564039457584007913129639935; // maximo que pode aprovar por nois // so coloqei o integer maximo msm do solidity

    // Provendo uma funcao para dar fundos ao contrato
    function fundFlashSwapContract(address _owner, address _token, uint256 _amount) public {
        //
        IERC20(_token).transferFrom(_owner, address(this), _amount);
    }
    
    // Pegando o balanco do contrato
    function getBalanceOfToken(address _address) public view returns (uint256){
        return IERC20(_address).balanceOf(address(this));

    }
    // colocando um trade
    // Executando o trade
    function placeTrade(
        address _fromToken,
        address _toToken,
        uint _amountIn
    ) private returns (uint256) {
        address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(_fromToken, _toToken);
        require(pair != address(0), "pool dos not exist");

        // Perform Arbitrage - Swap por outro token
        address[] memory path = new address[](2);
        path[0] = _fromToken;
        path[1] = _toToken;

        uint256 amountRequired = IUniswapV2Router01(PANCAKE_ROUTER).getAmountOut(_amountIn, path)[1];
        console.log("amountRequired", amountRequired);

        //Perform Arbitrage - Swap for another Token
        uint256 amountReceived = IUniswapV2Router01(PANCAKE_ROUTER).swapExtractTokenForToken(
            _amountIn,
            amountRequired,
            path,
            address(this),
            deadline
        )[1];
        console.log("amountRecieved", amountReceived);

        require(amountReceived > 0, "Aborted Tx: Trade returned zero");
        return amountReceived;
    }

    // Iniciando Arbitragem
    // 1- recebe o emprestimo para fazer o trade de arbitragem
    function startArbitrage(address _tokenBorrow, uint256 _amount) external{
        IERC20(WBNB).safeApprove(address(PANCAKE_ROUTER), MAX_INT); // APROVANDO PARA TODAS ESSAS   
        IERC20(BUSD).safeApprove(address(PANCAKE_ROUTER), MAX_INT);
        IERC20(CAKE).safeApprove(address(PANCAKE_ROUTER), MAX_INT);
        IERC20(USDT).safeApprove(address(PANCAKE_ROUTER), MAX_INT);
        IERC20(CROX).safeApprove(address(PANCAKE_ROUTER), MAX_INT);

        // pegando o factory pair address para cada combinacao
        address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(_tokenBorrow, WBNB);

        // Rotorne erro caso o par não exista
        require(pair != address(0), "A pool nao existe");

        // Descobrindo qual token (0 ou 1) tem o saldo and assign
        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        uint amount0Out = _tokenBorrow == token0 ? _amount : 0; // se tokenBorrow é igual a token0 amount vai para o amountOut caso contrario ele é zero
        uint amount1Out = _tokenBorrow == token1 ? _amount : 0;

        // Passando data como Bytes para que SWAP function saiba que é um flashLoan
        bytes memory data = abi.encode(_tokenBorrow, _amount);

        // Executando o primeiro swap para pegar o loan
        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);

    }

    function pancakeCall(address _sender, uint256 _amount0, uint256 _amount1, bytes calldata _data) external{
        // garantindo que o request veio do contrato
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        address pair = IUniswapV2Factory(PANCAKE_FACTORY).getPair(
            token0,
            token1
        );
        require(msg.sender == pair, "o sender precisa bater com o pair contract");
        require(_sender == address(this), "o sender tem que bater com esse contrato");

        // Decode Data para calculation the repayment
        (address tokenBorrow, uint256 amount) = abi.decode(
            _data,
            (address, uint256)
        );

        // Calculando o valor para ser pago no final
        uint256 fee = ((amount * 3)/ 997 ) + 1;
        uint256 amountToRepay = amount + fee;

        // Faca arbitragem

        // Me pagando 

        // Pagando o loan
        IERC20(tokenBorrow).transfer(pair, amountToRepay);
    }
}