// SPDX-License-Identifier: MIT
pragma solidity = 0.8.15;

contract Survey {
    // 설문에 저장시켜야되는 데이터
    // 이름, 휴대폰번호, 성별, 연령대, 커피선호도
    // mapping 해당하는 사람의 설문을 중복으로 받지 않겠다. 
    // mapping key값을 "이름(휴대폰번호)" 해당하는 데이터들은 성별, 연령대, 커피선호도
    // 전체 설문에 대한 정보를 출력

    // 변수 선언
    // 성별, 연령대, 커피선호도 3가지의 데이터를 하나의 변수에 담는다. 
    struct survey_info {
        string gender;
        uint8 age;
        string coffee;
    }
    // mapping 데이터 생성 
    // 개개인의 설문 이력 확인하기 위한 mapping
    mapping (string => survey_info) internal survey;

    // 전체 데이터를 저장하는 공간
    // 구조체 생성 (설문에 대한 구조체)
    struct surveys {
        string name;
        string gender;
        uint8 age;
        string coffee;
    }

    // 배열 생성 (리스트)
    // 설문 조사자가 전체의 설문 리스트를 확인하기 위하여 만든 배열
    surveys[] internal survey_list;

    // 설문을 참여여부를 체크하는 함수
    function check_survey(string memory _user) public view returns (bool){
        // 설문의 참여 여부를 확인하는 방법은?
        // mapping데이터에서 매개변수로 들어온 키 값에 해당하는 데이터가 존재하는지 확인 
        if (survey[_user].age == 0){    
            //숫자형태의 데이터에서 데이터가 존재하지 않으면 0으로 출력이 되기때문에
            // 0과 같은 경우는 데이터가 존재하지 않는다
            return false;
        }else{
            return true;
        }
    } 

    // 설문 내역을 추가 
    function add_survey(string memory _user, string memory _gender, uint8 _age, string memory _coffee) public {
        // 설문 내역을 mapping 데이터 추가 
        survey[_user].gender = _gender;
        survey[_user].age = _age;
        survey[_user].coffee = _coffee;
        // 설문 내역을 배열에 추가 
        survey_list.push(surveys(_user, _gender, _age, _coffee));
    }

    // 배열의 크기를 리턴하는 함수
    function count_list() public view returns (uint256){
        uint256 result = survey_list.length;
        return result;
    }

    // 배열의 정보를 리턴하는 함수
    function get_survey(uint256 _index) public view returns (string memory, string memory, uint8, string memory){
        string memory name = survey_list[_index].name;
        string memory gender = survey_list[_index].gender;
        uint8 age = survey_list[_index].age;
        string memory coffee = survey_list[_index].coffee;

        return (name, gender, age, coffee);
    }

}