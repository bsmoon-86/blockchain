// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.8.20;

contract food_history{

    struct food_info {
        string food_name;
        string food_type;
        address[] food_address;
    }

    mapping (string => food_info) internal foods;

    function regist_history(string memory _food, string memory _name, string memory _type) public {
        foods[_food].food_name = _name;
        foods[_food].food_type = _type;
        foods[_food].food_address.push(msg.sender);
    }

    function add_history(string memory _food) public {
        require(foods[_food].food_address[0] != address(0), "Error");
        foods[_food].food_address.push(msg.sender);
    }

    function view_history(string memory _food) public view returns (string memory, string memory, address[] memory){
        return (foods[_food].food_name, foods[_food].food_type, foods[_food].food_address);
    }
}
