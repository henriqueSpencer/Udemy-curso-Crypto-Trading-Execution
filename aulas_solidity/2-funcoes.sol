pragma solidity >=0.7.0 < 0.9.0;

contract funcoesBasicas{
    // function(string _variable1, uint _variable2) public  view/pure returns(type) {}

    string coinName = "coinMaluca";
    uint myBalance = 1000;

    struct Coin {
        string name;
        string symbol;
        uint supply;
    }

    mapping (address => Coin) internal mycoins;

    function guessNumber(uint _guess) public pure returns(bool){
        if (_guess ==5){
            return true;
        }else{
            return false;
        }

    }

    function getMyCoinName() public view returns(string memory){
        //memory serve pq nao sabe quao grande é uma string, entao tem q alocar memoria para ela
        return coinName;
    }

    // external so pode ser chamada pelo usuario 
    function multipyBalance(uint _multiplier) external{
        myBalance = myBalance * _multiplier;
    }

    //uso do for
    function findCoinIndex( string[] memory _myCoins, string memory _find, uint _startFrom) public pure returns(uint){
        for (uint i = _startFrom; i<_myCoins.length; i++){
            string memory coin = _myCoins[i];
            if (keccak256(abi.encode(coin)) == keccak256(abi.encode(_find))){
                return i;
            }
    
        }
        return 9999;
    }

    function addCoin( string memory _name, string memory _symbol, uint  _supply) external {
        mycoins[msg.sender] = Coin(_name, _symbol, _supply);
    }

    function getMyCoin() public view returns(Coin memory){
        return mycoins[msg.sender];
    }
    
}