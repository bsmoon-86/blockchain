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

// 이더리움에 contract를 배포하였을 때 contract를 호출하는 방법
// 이더리움을 사용할 수 있는 모듈은 web3
var Web3 = require('web3')
var ether_contract = require("./build/contracts/food_history.json") 

// 이더리움 테스트넷의 주소를 입력
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"))
// 배포한 contract의 주소와 abi값을 지정 
var smartcontract = new web3.eth.Contract(
    ether_contract.abi, 
    ether_contract.networks[5777].address
)
// ganache에 있는 주소의 목록 
var ether_address;
web3.eth.getAccounts(function(err, ass){
    if(err){
        console.log(err)
    }else{
        console.log(ass)
        ether_address = ass
    }
})


// 이 아래부터는 api(url 주소) 생성 
// localhost:3000/ 으로 요청 시
app.get("/", function(req, res){
    res.render('index')
})

// 식품을 추가하는 페이지로 이동
app.get("/regist_food", function(req, res){
    res.render('regist_food')
})

// 스마트 컨트렉트에 데이터를 추가하는 주소 생성
app.post("/regist", async function(req, res){
    // regist_food 페이지에서 유저가 입력한 데이터를 변수에 대입
    const food = req.body._food
    const name = req.body._name
    const type = req.body._type
    const address = req.body._address
    console.log(food, name, type, address)

    // 스마트 컨트렉트 호출
    const receipt = await smartcontract.methods
    .regist_history(food, name, type)
    .send({
        from : ether_address[address], 
        gas : 2000000
    })

    console.log(receipt)
    res.redirect("/")

})

app.get("/add_history", function(req, res){
    res.render('add_history')
})

app.post("/add", async function(req, res){
    const food = req.body._food
    const address = req.body._address
    console.log(food, address)

    const receipt = await smartcontract.methods
    .add_history(food)
    .send({
        from : ether_address[address], 
        gas : 2000000
    })

    console.log(receipt)
    res.redirect("/")
})


app.get("/view", async function(req, res){
    const food = req.query._food
    console.log(food)

    const result = await smartcontract.methods
    .view_history(food)
    .call()

    console.log(result)

    res.render('view_history', {
        data : result
    })
})

