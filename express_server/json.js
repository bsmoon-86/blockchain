// json 데이터의 형태
// key : value

var test_json = {
    'name' : 'test', 
    'age' : 30, 
    'phone' : '01012345678'
}   //json 데이터의 형태

// console.log(test_json)
// console.log(test_json.name)
// console.log(test_json.age)
// console.log(test_json.phone)

var test_json_2 = {
    'query' : {
        'age' : 30, 
        'name' : 'test', 
        'phone' : "01012345678"
    }, 
    'body' : {
        'area' : 'seoul', 
        'wallet' : '0x0000'
    }
}
// test_json_2 데이터에서 test라는 문자열을 출력하려면
// test_json_2 안에 query의 값의 안에 name 곳 존재 test
// test_json_2.query.name -> test
console.log(test_json_2)
console.log(test_json_2.query)
console.log(test_json_2.query.name)