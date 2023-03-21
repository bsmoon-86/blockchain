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
// console.log(product_contract.address)

// contract를 배포한 네트워크 지정 
// 클레이튼 테스트넷(바오밥) 주소를 입력
var cav = new Caver('https://api.baobab.klaytn.net:8651')
// 배포한 contract의 주소와 abi값을 지정
var smartcontract = new cav.klay.Contract(product_contract.abi, product_contract.address)
// 지갑 주소 입력
var account = cav.klay.accounts.createWithAccountKey('0x6a12a3909d0737d7e4cdedb3cde300406700d672', '0xb1cfbca1ae8245638921bd5e1db5ec92cb99ddf6d334c9773d725b229706d8a8')
// 입력한 지갑 주소를 caver 추가
cav.klay.accounts.wallet.add(account)



// 이더리움에 contract를 배포하였을 때 contract를 호출하는 방법
// 이더리움을 사용할 수 있는 모듈은 web3
var Web3 = require('web3')
var ether_contract = require("./build/contracts/user.json") 

// 이더리움 테스트넷의 주소를 입력
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"))
// 배포한 contract의 주소와 abi값을 지정 
var contract = new web3.eth.Contract(
    ether_contract.abi, 
    ether_contract.networks[5777].address
)
// ganache에 있는 주소의 목록 
var ether_address;
web3.eth.getAccounts(function(err, ass){
    if(err){
        console.log(err)
    }else{
        console.log(ass[0])
        ether_address = ass[0]
    }
})



// api 생성

// localhost:3000 접속 시
app.get("/", function(req, res){
    res.render("index.ejs")
})

// localhost:3000/login 이라는 주소를 생성 (형식은 post)
app.post("/login", function(req, res){
    // input에서 보내준 데이터를 변수에 담아준다
    var id = req.body._id   //유저가 입력한 아이디 값
    var password = req.body._pass   //유저가 입력한 패스워드 값
    console.log(id, password)

    // 이더리움인 경우
    contract.methods
    .view_user(id)  //유저가 입력한 아이디 값 (test)
    .call() // view함수를 호출
    .then(function(result){ //함수가 호출된 뒤 결과 값을 확인 -> 결과 값은 result 변수에 담긴다
        // password 항목이 result[0]
        // 유저에게서 입력받은 패스워드는 result[0]와 같아야 로그인이 성공
        console.log(result)
        console.log(result[0])
        console.log(result[1])
        if (password == result[0]){
            // 로그인이 성공 했을 때는 새로운 페이지를 보여준다
            // res.send("로그인 성공")
            res.render('main.ejs')
        }else{
            // 로그인이 실패하는 경우 로그인 화면으로 되돌려 준다
            res.redirect("/")
        }

    // klaytn의 경우
    // smartcontract.methods
    // .view_user(id)  //유저가 입력한 아이디 값 (test)
    // .call() // view함수를 호출
    // .then(function(result){ //함수가 호출된 뒤 결과 값을 확인 -> 결과 값은 result 변수에 담긴다
    //     // password 항목이 result[0]
    //     // 유저에게서 입력받은 패스워드는 result[0]와 같아야 로그인이 성공
    //     console.log(result)
    //     console.log(result[0])
    //     console.log(result[1])
    //     if (password == result[0]){
    //         // 로그인이 성공 했을 때는 새로운 페이지를 보여준다
    //         // res.send("로그인 성공")
    //         res.render('main.ejs')
    //     }else{
    //         // 로그인이 실패하는 경우 로그인 화면으로 되돌려 준다
    //         res.redirect("/")
    //     }
        // result의 값은 contract 안에 있는 mapping 데이터를 리턴 받는 부분
        // result 값이 { '0' : '1234', '1' : 'moon' }
        // password 라는 변수의 값과 result에 있는 첫번째 항목의 값이 같다면
        // 로그인이 성공 
        // 만약에 두개의 값이 같지 않다면 
        // 로그인이 실패
        // var json = { 'name' : 'moon', 'age' : 30 }
        // json.name -> moon
        // json[name] -> moon

        // res.send(result)
    })
})

// 회원가입 api 를 생성
app.get('/signup', function(req, res){
    // signup.ejs 파일을 랜더링
    res.render('signup.ejs')
})

// 회원 가입 페이지에서 보내준 데이터를 smartcontract에 있는 add_user()에 넣어서 호출
app.get("/signup2", function(req, res){
    // 유저가 보낸 데이터를 각각의 변수에 담아주는 과정
    var id = req.query._id
    var password = req.query._pass
    var name = req.query._name
    // 데이터가 정상적으로 들어왔는지 확인을 로그를 통해서 한다. 
    console.log(id, password, name)


    // 이더리움인 경우
    contract.methods
    .add_user(id, password, name)
    .send({

        from : ether_address, 
        gas : 2000000
    }) 
    .then(function(result){
        console.log(result)
        res.send("회원 가입에 성공")
    })

    // kalytn인 경우
    // contract에 있는 add_user 함수를 호출 
    // smartcontract.methods
    // .add_user(id, password, name)
    // .send({
    //     from : account.address, 
    //     gas : 2000000
    // }) 
    // .then(function(result){
    //     console.log(result)
    //     res.send("회원 가입에 성공")
    // })

})