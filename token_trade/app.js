// express 모듈을 로드
const express = require("express")
const app = express()
// 서버의 포트 번호 설정
const port = 3000
// 뷰 엔진 설정 및 ejs 파일들의 기본 경로를 설정
app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')
// post 통신 방식에서 json을 사용하기 위한 설정
app.use(express.json())
app.use(express.urlencoded({extended:false}))


//외부 파일 불러오기
const token = require("./make_token")


// api 생성 시작
app.get("/", function(req, res){
    res.render('index')
})

app.get("/create_token", function(req, res){
    res.render('create_token')
})

//토큰 생성 정보를 받아와서 토큰을 생성하는 api
// get과 post 형식은 주소가 같더라도 따로 생성이 가능하다. 
app.post("/create_token", async function(req, res){
    const name = req.body.token_name
    const symbol = req.body.token_symbol
    const decimal = Number(req.body.token_decimal)
    const amount = Number(req.body.token_amount)
    console.log(name, symbol, decimal, amount)
    // 외부 파일에 있는 토큰 생성 함수를 실행한다
    token_address = await token.create_token(name, symbol, decimal, amount)
    res.render("token_info", {address : token_address})
})

app.get("/trade_token", function(req, res){
    res.render('trade_token')
})
// 토큰 발행자에게서 토큰을 받는 부분
app.post("/trade_token", async function(req, res){
    const token_address = req.body.token_address
    const address = req.body.address
    const amount = req.body.amount
    console.log(token_address, address, amount)
    const receipt = await token.trans_token(token_address, address, amount)
    console.log(receipt)
    res.redirect("/")
})

//토큰 발행자에게 토큰을 보내는 부분
app.post("/trade_from_token",async function(req, res){
    const token_address = req.body.token_address
    const address = req.body.address
    const amount = req.body.amount
    console.log(token_address, address, amount)
    const receipt = await token.trans_from_token(token_address, address, amount)
    console.log(receipt)
    res.redirect("/")
})


// api 생성 끝

app.listen(port, function(){
    console.log("Server Start")
})