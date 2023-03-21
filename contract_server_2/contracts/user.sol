// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract user {

    // 유저 정보 
    struct user_info {
        string password;
        string name;
    }

    // mapping 데이터를 생성
    mapping (string => user_info) public users;

    // 회원 정보를 추가 함수
    function add_user(string memory _id, string memory _pass, string memory _name) public {
        users[_id].password = _pass;
        users[_id].name = _name;
    }

    // 회원 정보를 확인
    function view_user(string memory _id) view public returns (string memory, string memory){
        string memory password = users[_id].password;
        string memory name = users[_id].name;
        return (password, name);
    }


}