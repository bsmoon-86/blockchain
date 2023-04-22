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
    // 등록된 게시물을 반복문을 사용하여 리스트에 추가
    for(var i = 1; i < deal_no; i++){
        await smartcontract.methods
        .view_deal(i)
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

app.post("/add_deal", async function(req, res){
    const title = req.body.title
    const price = req.body.price
    const content = req.body.content
    const state = 1
    console.log(title, price, content)
    // 글의 번호는 컨트렉트에서 받기
    const deal_no = await smartcontract.methods
    .view_deal_num()
    .call()
    console.log(deal_no)
    // 유저가 입력한 게시글의 정보를 스마트 컨트렉트를 이용하여 저장
    await smartcontract.methods
    .add_deal(deal_no, title, content, price, state)
    .send({
        from : ether_address[0], 
        gas : 2000000
    })
    .then(function(receipt){
        console.log(receipt)
    })
    // 모든 작업이 완료되면 localhost:3000/으로 돌아감
    res.redirect("/")

})

app.get("/view_deal", async function(req, res){
    const deal_no = req.query.no
    console.log(deal_no)

    const deal = await smartcontract.methods
    .view_deal(deal_no)
    .call()

    res.render('view_deal', {
        data : deal, 
        deal_no : deal_no
    })
})

app.get("/change_deal", async function(req, res){
    const deal_no = req.query.no
    const state = req.query.state
    console.log(deal_no, state)

    if (state==2){
        await smartcontract.methods
        .add_trading(deal_no, state)
        .send({
            from : ether_address[1], 
            gas : 2000000
        }).then(function(receipt){
            console.log(receipt)
        })
    }else{
        await smartcontract.methods
        .change_trade(deal_no, state)
        .send({
            from : ether_address[0], 
            gas : 2000000
        }).then(function(receipt){
            console.log(receipt)
        })
    }

    res.redirect("/")
})


