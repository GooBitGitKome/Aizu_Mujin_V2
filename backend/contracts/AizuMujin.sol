// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; 

//Changed class name to AizuMujinToken
contract AizuMujin is ERC20 {
    mapping(address => uint256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;
    uint256 private _totalDeposit;
    address private _owner;

    constructor() ERC20("Aizu Mujin Token", "AMT") {
        _owner = msg.sender;
    }

    // @title 'faucet function for a caller to be sent 100 tokens'
    // @author 'Komeda'
    // @notice 'this function is for a caller to be sent 100 tokens'
    function faucet() public{
        _mint(msg.sender, 100);
    }

    function send(uint256 amount) public{
        _transfer(msg.sender, address(this), amount);
        _totalDeposit += amount;
    }

    function fundTokens(address to, uint amount) public{
        _transfer(address(this), to, amount);
    }

    function getDeposit() public view returns(uint256){
        return _totalDeposit;
    }

    function getMyBalance() public view returns(uint256){
        return balanceOf(msg.sender);
    }   
  
    /*
    @title	'overricde dicimals function in ERC20
    @author	'Komeda
    @notice	'change the return value 18(default) to 0, because of being user frendly.
    @dev	'if you want to use this mint in a huge amount of people, you need the change to be removed
    @param	'none
    @return	'unit8
    */
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}


