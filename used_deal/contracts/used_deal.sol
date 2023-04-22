// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.8.20;

contract used_deal {
    struct deal_info{
        string title;
        string content;
        uint price;
        address writer;
        address trader;
        uint8 state;
    }

    mapping (uint => deal_info) public deals;

    uint deal_num = 1;
    

    function add_deal(uint _num, string memory _title, string memory _content, uint _price, uint8 _state) public{
        require(deals[_num].state == 0, "deal exist");
        deals[_num].title = _title;
        deals[_num].content = _content;
        deals[_num].price = _price;
        deals[_num].writer = msg.sender;
        deals[_num].state = _state;
        deal_num++;
    }

    function add_trading(uint _num, uint8 _state) public {
        require(deals[_num].writer != address(0), "deal not exist");
        require(deals[_num].trader == address(0), "trader exist");
        deals[_num].trader = msg.sender;
        deals[_num].state = _state;
    }

    function change_trade(uint _num, uint8 _state) public {
        require(deals[_num].writer == msg.sender, "writer not match");
        deals[_num].state = _state;
        if (_state == 1){
            deals[_num].trader = address(0);
        }
    }

    function view_deal_num() public view returns (uint){
        return (deal_num);
    }

    function view_deal(uint _num) public view returns (string memory, string memory, uint, address, address, uint8){
        return (deals[_num].title, deals[_num].content, deals[_num].price, deals[_num].writer, deals[_num].trader, deals[_num].state);
    }

}