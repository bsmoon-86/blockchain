const express = require('express')
const app = express()

// 외부의 파일을 로드(같은 경로에 있는 client.js파일)
const client = require("./client")

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
    data = await parseInt(req.query.bread)
    await client.bread_purchase(data)
    console.log(data)
    res.redirect("/")
})

// 서버를 시작
const server = app.listen(3000, ()=>{
    console.log('Server Start')
})