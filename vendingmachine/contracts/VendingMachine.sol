// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

// contract의 이름을 지정
contract VendingMachine{
    // 주인이라는 주소 변수를 생성
    address public owner;

    // 빵의 재고를 나타내는 mapping 값을 지정
    mapping(address => uint) public breadBalances;

    // 컨트렉트 배포 시 자동으로 실행이 되는 생성자
    constructor() {
        // owner는 컨트렉트의 배포자이다. 
        owner = msg.sender;
        // 빵의 재고를 100개로 초기에 지정
        breadBalances[address(this)] = 100;
        // address(this) -> this: 자신, address(this) : 자기 자신의 주소(컨트렉트의 주소)
    }

    // 빵의 재고를 출력해주는 함수
    function getVendingMachineBalnace() public view returns (uint) {
        // mapping 데이터에서 컨트렉트 주소를 키값으로 하는 value의 값을 되돌려준다.
        return breadBalances[address(this)];
    }

    // 빵을 판매 하는 함수 생성 (빵을 판매한다는 뜻은 내부의 데이터가 변경 -> transaction이 발생)
    function purchase(uint _amount) public {
        // 빵을 판매하는 조건? -> 재고보다 구매하려는 빵의 개수가 많다면 거래가 불가능
        require(breadBalances[address(this)] >= _amount, "Not enough bread");
        // 위의 조건이 참이라면 address(this)가 가진 빵의 개수를 줄이고
        // 구매하려는 주소의 빵의 개수를 증가
        breadBalances[address(this)] -= _amount;
        // breadBalances[address(this)] = breadBalances[address(this)] - _amount;
        breadBalances[msg.sender] += _amount;
    }

    // 빵을 재고를 추가하는 함수 생성(빵을 제작한다는 뜻은 재고가 변경된다. -> transaction 발생)
    function restock(uint _amount) public {
        // 빵의 갯수를 추가하는 조건? -> owner만이 빵의 재고를 늘릴 수 있다.
        require(owner == msg.sender, "Only the owner can restock");
        // 빵의 재고가 있는 변수 ? breadBalances[address(this)]이 값을 _amount만큼 늘려준다
        breadBalances[address(this)] += _amount;
    }
}