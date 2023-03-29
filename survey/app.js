// express 모듈을 로드 
const express = require('express')
// app 변수 express 실행
const app = express()
// port 번호 지정
const port = 3000
// web3 모듈을 로드
const Web3 = require('web3')

// html 파일의 위치를 지정
app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

// post 형식으로 데이터를 받아오기 위한 설정
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// json파일 로드 
const product_contract = require("./build/contracts/Survey.json")

// smartcontract을 불러오는 작업
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
const smartcontract = new web3.eth.Contract(
    product_contract.abi, 
    product_contract.networks["5777"]['address']
)

// private Key와 같은 중요한 값들을 숨겨놓는 작업

// localhost:3000/ 요청 시
app.get("/", (req, res)=>{
    res.render('index')
})

// 유저의 정보를 받아오는 api 생성
// localhost:3000/user_info POST 형태의 api
app.post("/user_info", (req, res)=>{
    // 유저가 보낸 정보를 변수에 대입 
    const _name = req.body.user_name
    const _phone = req.body.user_phone
    // 컨트렉트에 보낼 유저 정보 이름(휴대폰번호) 형태
    const user = _name +'('+_phone+')'
    console.log(user)

    // 컨트렉트와 연동하여 설문에 참여한지 여부를 체크
    smartcontract
    .methods
    .check_survey(user)
    .call()
    .then(function(result){
        console.log(result)
        // check_survey라는 함수가 돌려주는 데이터는 bool의 형태 -> result라는 변수에 대입되어있다.
        if (result) {   // 설문을 한 경우
            // 설문에 참여했다면 localhost:3000/ 이동
            console.log('설문 이력이 있는 경우')
            res.redirect('/')
        }else{          // 설문을 참여하지 않은 경우
            // 설문에 참여하지 않았다면 localhost:3000/survey 이동
            console.log('설문 이력이 없는 경우')
            // 유저의 정보를 ejs 파일과 함께 보내준다
            res.render("survey", {user_info : user})
        }
    })

})


app.get('/survey_submit', async (req, res)=>{
    // 설문의 내용들은 변수에 대입 
    const _user = req.query.user
    const _gender = req.query.gender
    const _age = req.query.age
    const _coffee = req.query.coffee
    console.log(_user, _gender, _age, _coffee)

    // ganache 환경에 있는 지갑의 주소를 로드 
    // const로 변수를 생성 -> 데이터의 변환 불가
    // let, var로 변수를 생성 -> 데이터의 변환 가능
    let address = "";

    await web3.eth.getAccounts(function(err, ass){
        if(err != null){        // 주소를 불러오는 도중에 에러가 발생한다면
            console.log(err)
        }else{
            if(ass.length == 0){    // 주소 값이 존재하지 않는 경우
                console.log('Account undefind')
            }else{
                address = ass
            }
        }
    })
    console.log(address)
    
    // 컨트렉트에서 key 값과 value의 값이 필요하다
    // add_survey(user, gender, age, coffee)
    // 유저가 보낸 설문 대답을 컨트렉트를 이용하여 데이터를 저장
    smartcontract
    .methods
    .add_survey(_user, _gender, _age, _coffee)
    .send({
        from : address[0], 
        gas : 200000
    })
    .then(function(receipt){
        console.log(receipt)
        // 저장이 완료되면 localhost:3000/ 이동
        res.redirect("/")
    })
    
})

// 설문조사 내역을 전체를 확인하는 함수
// localhost:3000/survey_list api 생성
app.get("/survey_list", async (req, res)=>{
    // 설문 내역의 개수를 저장한 변수를 지정
    let count = 0
    // 설문 내역이 몇개가 존재하는 확인
    // 컨트렉트에 있는 count_list() 함수가 리턴하는 값이 설문 내역의 개수
    await smartcontract
    .methods
    .count_list()
    .call()
    .then(function(_count){
        // count_list() 함수에서 리턴한 결과 값을 _count에 담아둔다.
        count = _count
    })
    console.log(count)
    // 배열의 데이터를 담는 array를 생성
    let survey_list = new Array()
    // 배열의 길이만큼 반복적으로 get_survey 함수를 호출
    // 반복문 생성
    // 배열의 길이만큼 반복
    // 배열의 모든 데이터를 받아온다 
    // 반복을 할 때마다 새로운 array에 추가해준다
    for (var i =0; i < count; i++){
        await smartcontract
        .methods
        // get_survey(i)-> 모든 배열의 값들을 불러온다
        .get_survey(i)
        .call()
        .then(function(result){
            // get_survey 함수의 리턴값은 json 형태로 들어온다
            // 키값이 0은 부분에는 유저의 정보
            // 키 값이 1인 부분에는 성별
            // 2인 부분에는 연령대
            // 3인 부분에는 커피 선호
            // 결과를 survey_list에 추가해준다
            survey_list.push(result)
        })
    }
    // survey_list.ejs 파일을 보내면서 컨트렉트에 있는 설문 내역(data라는 이름으로)을 같이 보내준다.
    res.render("survey_list", {data : survey_list})

})


const server = app.listen(port, function(){
    console.log("Server Start")
})
