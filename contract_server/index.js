// express 모듈 로드 
var express = require('express')
var app = express()

// HTML파일들의 위치를 지정(현재 경로에서 views라는 하위폴더로 지정)
// view engine 'ejs'를 사용한다
app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

// POST 형식에서 데이터를 받을때 JSON의 데이터형태로 설정
app.use(express.json())
app.use(express.urlencoded({extended : false}))

var server = app.listen(3000, function(){
    console.log("Server Start")
})

// Klaytn을 사용할 수 있는 모듈을 로드 
var Caver = require('caver-js')

// contract의 주소와 abi를 저장한 파일 로드 
var product_contract = require("./contract/contract_info")
console.log(product_contract.address)

// contract를 배포한 네트워크 지정 
// 클레이튼 테스트넷(바오밥) 주소를 입력
var cav = new Caver('https://api.baobab.klaytn.net:8651')
// 배포한 contract의 주소와 abi값을 지정
var smartcontract = new cav.klay.Contract(product_contract.abi, product_contract.address)
// 지갑 주소 입력
var account = cav.klay.accounts.createWithAccountKey('0x6a12a3909d0737d7e4cdedb3cde300406700d672', '0xb1cfbca1ae8245638921bd5e1db5ec92cb99ddf6d334c9773d725b229706d8a8')
// 입력한 지갑 주소를 caver 추가
cav.klay.accounts.wallet.add(account)

// 이 아래부터는 api(url 주소) 생성 
// localhost:3000/ 으로 요청 시
app.get("/", function(req, res){
    // contract에 있는 change_a() 함수를 실행
    smartcontract.methods
    .change_a() //contract 내의 실행 할 함수
    .send({
        from : account.address, // 컨트렉트를 실행할 지갑 주소
        gas : 2000000   // 수수료
    })
    .then(function(result){ //트랜젝션이 발생하고 난 뒤 실행되는 코드
        res.send(result)
    }) 
})

// localhost:3000/view 주소 생성
app.get('/view', function(req, res){
    // contract에 있는 view_a() 함수를 실행
    smartcontract.methods
    .view_a()
    .call()
    .then(function(result){
        res.send(result)
    })
})