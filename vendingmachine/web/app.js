const express = require('express')
const app = express()
const path =require('path')

// 외부의 파일을 로드(같은 경로에 있는 client.js파일)
const client = require("./client")
// make_token.js 파일을 로드
const token = require("./make_token")

// express web 설정 
// html 파일들을 어떤 경로에 있는 파일을 사용을 할지 지정
// __dirname : 현재 파일이 있는 경로
// __dirname+"/views" : 현재 경로에서 views 폴더로 이동
app.set("views", __dirname+"/views")
// html 파일을 어떠한 엔진으로 보여줄것인가 지정
app.set('view engine', 'ejs')

// POST 형태의 데이터를 받기 위한 설정
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

// 외부의 css, image, js 파일들을 저장해두는 공간의 위치를 지정
// 일반적으로 public 폴더에 모아서 관리
app.use(express.static(path.join(__dirname, 'public')))

// api를 생성 
// localhost:3000/ 생성
app.get("/", async function(req, res){
    // 현재 빵의 재고를 출력하는 함수를 호출하여 결과를 result라는 변수에 대입
    result = await client.bread_balance()
    // render(보여줄 페이지의 파일명, {임의의 key값 : 같이 보내줄 데이터 })
    res.render('index', {data : result})
})

// localhost:3000/input주소 데이터를 보내는 형식이 POST인 api 생성
app.post("/input", async function(req, res){
    // POST 형식으로 보낸 데이터는 request 안 body라는 곳 안에 존재
    // {"bread" : 유저가 입력한 데이터}
    // parseInt() int형태로 데이터를 변환
    data = await parseInt(req.body.bread)
    // await 다음 코드가 실행이 완료될때까지 대기하고 완료가 되면 다음 코드를 실행
    // await는 async 안에서만 사용이 가능
    await client.bread_restock(data)
    console.log(data)
    // redirect를 해당하는 주소로 이동
    // localhost:3000/ 다시 이동으로 한다.
    res.redirect("/")
})

// localhost:3000/sell 주소 데이터를 보내는 형식이 GET인 api 생성
app.get("/sell", async (req, res)=>{
    // GET형식으로 보낸 데이터를 변수에 대입
    // GET형식은 POST와 달리 query 부분에 데이터가 존재
    // 구입하려는 빵의 개수만큼 빵의 재고를 줄이고 
    // 구입하는 사람의 빵의 재고를 늘린다.
    // 빵의 구입을 하는 경우 생성한 토큰을 오너에게 보낸다.
    // 조건 -> 빵을 구입할때 빵의 가격보다 지갑내의 토큰이 많거나 같은 경우에만 빵의 구입이 가능
    //          토큰의 양이 부족하다면 구매는 실패
    // 위의 조건이 만족하는 경우 
    // 빵의 가격만큼 오너에게 토큰을 지불하고 빵을 받아가야된다
    // 조건문은 if문으로 생성
    // 조건 유저의 지갑의 토큰의 양 >= 빵의 가격
    const _address = req.query.address
    // 유저의 지갑에 남은 토큰의 양
    // make_token.js에 있는 balance_of() 함수를 호출
    // 이 함수는 매개변수 address를 가지고 있다
    // 해당하는 주소의 토큰의 양을 출력하여 token_amount라는 변수에 대입
    const token_amount = await token.balance_of(_address)
    console.log(token_amount)
    // 빵의 가격 10토큰 
    // 구매하려는 빵의 토탈 금액 = 10 * data
    data = await parseInt(req.query.bread)
    const price = 10 * data
    console.log(price)
    // 조건문 시작 
    if (token_amount >= price) {
        // 오너에게 토큰을 보낸다
        await token.trans_from_token(_address, price)
        // 오너의 빵의 재고가 줄어드는 함수
        await client.bread_purchase(data)
        res.redirect("/")
    }else{
        res.send("소유하고 있는 토큰의 양이 빵의 가격보다 적습니다.")
    }
})

// 토큰을 생성하는 api를 생성
// localhost:3000/create_token 주소 생성
app.get('/create_token', async (req, res)=>{
    // make_token.js 파일 안에 있는 create_token이라는 함수를 호출 하여 리턴값을 token_address 변수에 대입
    const token_address = await token.create_token()
    // localhost:3000/create_token 주소로 요청했을때 token_address 웹 화면에 보여준다
    res.send(token_address)
})

// 토큰을 거래하는 화면을 보여주는 api 생성
// localhost:3000/transfer 주소 생성
app.get("/transfer", (req, res)=>{
    // views폴더 안에 있는 transfer.ejs 파일을 보여주겠다
    res.render('transfer')
})

// 토큰을 거래하는 함수 생성 
// localhost:3000/token_trans 라는 post형태의 주소 생성
app.post("/token_trans", async (req, res)=>{
    // 유저에게서 받아온 토큰의 양, 지갑 주소를 변수에 대입 
    const _amount = parseInt(req.body.amount)
    const _address = req.body.address
    console.log(_amount, _address)
    // make_token.js 파일 안에 있는 trans_token()함수를 호출
    // 해당하는 함수에는 매개변수가 2개 존재
    // address -> 토큰을 받을 지갑의 주소 ,  amount -> 보낼 토큰의 양
    await token.trans_token(_address, _amount)

    // 토큰의 거래가 완료되면 토큰 거래 화면으로 돌아간다
    res.redirect('/transfer')
    // transfer라는 함수는 토큰을 발생한 사람으로부터 유저의 지갑에 토큰을 보내는 함수
    // 반대로 유저가 토큰을 발생한 사람에게 토큰을 보내는 방법은 되지 않는다.

})

// 유저가 오너에게 토큰을 보내는 함수 생성
// localhost:3000/trans_owner 라는 POST 형태의 주소를 생성
app.post('/trans_owner', async (req, res)=>{
    // 유저가 보내온 데이터를 변수에 대입 
    const _amount = parseInt(req.body.amount)
    const _address = req.body.address
    console.log(_amount, _address)

    // make_token.js 안에 있는 trans_from_token() 함수를 호출
    // address, amount 매개변수 
    const receipt = await token.trans_from_token(_address, _amount)
    console.log(receipt)

    res.redirect("/transfer")
})

// log-in.ejs파일을 오픈하는 api 생성
app.get("/login", (req, res)=>{
    res.render('log-in')
})

// 서버를 시작
const server = app.listen(3000, ()=>{
    console.log('Server Start')
})