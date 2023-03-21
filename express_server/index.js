// express를 이용하여 웹 서버 생성 
// express 모듈을 로드하여 변수 이름이 express인 곳에 할당
var express = require("express");
// app이라는 변수에 express() 담아준다
var app = express();

// app의 세팅 변경 
// 어떠한 파일을 불러와서 웹에 표시할지 지정 
app.set("views", __dirname+"/views");
app.set("view engine", "ejs");

// json 형태의 데이터를 사용
// json 데이터 형태 
app.use(express.json())
app.use(express.urlencoded(
    {
        extended : false
    }
))

// express 모듈 내의 listen() 함수에 3000이라는 port 번호를 지정하여 서버를 실행
var server = app.listen(3000, function(){
    console.log("Express Server Start")
})


// api 하나 생성 (localhost:3000/ 주소로 접속 하는 경우)
// localhost -> 자기 자신의 컴퓨터 
// :3000 -> port 번호
app.get("/", function(req, res){
    // res.send('Hello World')
    // localhost:3000/ 요청 시 index.ejs 파일을 유저에게 보내준다.
    // 웹 브라우져가 index.ejs파일을 읽어서 유저가 보기 좋은 형태로 표시 
    res.render('index.ejs')
})

// api를 생성 
// localhost:3000/second 이라는 api 생성
app.get("/second", function(req, res){
    // res.send("Second Page")
    res.render('input.ejs')
})

// /login 이라는 api를 생성 
app.get("/login", function(req, res){
    // url에 있는 데이터를 추출
    // get 방식의 데이터를 보내는 형식이기 때문에 req.query에 데이터가 존재
    var input_id = req.query._id;//test 값을 입력
    var input_pass = req.query._pass;//1234 값을 입력
    // 입력받은 아이디, 패스워드 값을 다시 유저에게 보내준다
    res.render("main.ejs", {
        'id' : input_id, 
        'pass' : input_pass
    })
})

app.get("/input2", function(req, res){
    res.render("input2.ejs")
})

// post 형식으로 api 생성
app.post("/post", function(req, res){
    // post 형식에서 데이터는 request안에 body 부분에 데이터가 존재
    var input_id = req.body._id
    var input_pass = req.body._pass
    console.log(input_id, input_pass)
    res.send("post page")
})

// main 이라는 js파일을 로드 
var main = require('./routes/main')();
// localhost:3000/main 이라는 주소로 요청이 들어왔을때 routes/main.js 파일을 실행
app.use("/main", main)

// 상대 경로 
// - 상대적인 주소
// - 현재 내 위치에서 상위로 이동하거나 하위로 이동하는 경로를 지정
// - ./ : 현재 디렉토리(폴더)
// - ../ : 상위 디렉토리(파일 탐색기에서 위로 이동과 같은 의미)
// - ./폴더명 : 하위 디렉토리로 이동
// - 상위 폴더로 이동해서 sample이라는 하위 폴더로 이동 ( ../sample/ )

// 절대 경로
// - 절대적인 주소
// - 변하지 않는 주소 값
// 예시 ) url 주소들 -> https://www.google.com, https://www.naver.com
//        c:\users\administrator\a.txt