pragma solidity >=0.7.0 < 0.9.0;

contract testesBasicos{

    //Variaveis:
    uint public meuBalanco =2;
    int private conta =-3; // so pode ser chamado pelo contrato
    string internal coinName ="ola mundo";// so pode ser chamado pelo contrato ou contratos internos
    bool eValido = true;

    //variaveis globais
    uint blockTime = block.timestamp;
    address sender = msg.sender;

    //arrays
    string[] public tokensNames = ["eth","btc","ola"];
    uint[5] niveis = [1,2,3,4,5]; // define o limite do array

    //DataTime
    uint timeNow1 = 1 seconds;
    uint timeNow2 = 1 minutes;
    uint timeNow3 = 1 hours;
    uint timeNow4 = 2 days;
    uint timeNow5 = 1 weeks;
    
    //Struct
    struct User{
        address userAddress;
        string name;
        bool hasTrade;
    }
    // salvar uma estrutura em um array
    User[] public users;

    //Mapping =  dict 
    mapping(string => string) public accountName;

    // Mapping 
    mapping(address => mapping(string => User)) private userNestdMap;

    //Enums
    enum coinRanks {STRONG, CAUTION, DODGY}
    coinRanks testLevel;
    coinRanks public defaultTrustLevel = coinRanks.CAUTION;

    
}