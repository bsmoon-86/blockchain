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
var ether_contract = require("./build/contracts/used_deal.json") 

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

app.get("/", async function(req, res){
    const deal_no = await smartcontract.methods
                        .view_deal_num()
                        .call()
    console.log(deal_no)
    // 비어있는 리스트 생성
    let deals_list = new Array()
    for(var i = 1; i < deal_no; i++){
        await smartcontract.methods
        .view_deal()
        .call()
        .then(function(result){
            deals_list.push(result)
        })
    }
    console.log(deals_list)
    res.render('index', {
        deals_list : deals_list
    })
})

app.get("/add_deal", function(req, res){
    res.render("add_deal")
})
