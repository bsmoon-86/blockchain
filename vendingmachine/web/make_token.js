const CaverExtKAS = require('caver-js-ext-kas')

const caver  = new CaverExtKAS()

// KAS 에 접속하기 위한 KAS ID, PASSWORD
const accesskeyId = 'KASKVGU5GD7XHP7IJIOJ3Q80'
const secretAccessKey = 'JhC_7OycKEzu1kMTEzR4xMCW7xyU8yj7hOq-Zm94'
// testnet의 networkid 지정
const chainId = 1001

caver.initKASAPI(chainId, accesskeyId, secretAccessKey)


// 사용할 지갑의 주소를 등록
const keyringContainer = new caver.keyringContainer()
const keyring = keyringContainer.keyring.createFromPrivateKey('0xef0a0198393a7012063e4892fdeb4ead00a841beaa7c7188893833987d36d7c6')
keyringContainer.add(keyring)

// 토큰을 생성하는 함수( kip7 토큰 생성 )
async function create_token(){
    const kip7 = await caver.kct.kip7.deploy(
        {
            name : 'Bread', //토큰의 이름
            symbol : 'BR', //토큰의 심볼
            decimals : 0, //토큰의 소수점 자리수
            initialSupply : 100000000 //토큰의 발행량
        }, 
        keyring.address, 
        keyringContainer
    )
    console.log(kip7._address)
    return kip7._address
}

// 토큰을 거래하는 함수 
async function trans_token(_address, _amount){
    // 발행한 토큰을 keyringContainer에 지정
    const kip7 = await new caver.kct.kip7('0x44112F4b951BEf88d8b736cEbb0F9313a3bFb606')
    kip7.setWallet(keyringContainer)

    // 발행한 토큰을 _address 매개변수로 받은 인자값의 주소로 _amount만큼 보내준다.
    const receipt = await kip7.transfer(_address, _amount, {from : keyring.address})

    console.log(receipt)
}

// 유저가 토큰 발생자(owner)에게 토큰을 보낼수 있는 함수 
async function trans_from_token(_address, _amount){
    // 발행한 토큰을 keyringContainer에 지정
    const kip7 = await new caver.kct.kip7('0x44112F4b951BEf88d8b736cEbb0F9313a3bFb606')
    kip7.setWallet(keyringContainer)

    // owner의 지갑 주소 
    const owner = keyring.address
    console.log(owner)


    // 두번째 지갑의 주소를 KAS 환경에 등록
    const keyring2 = keyringContainer.keyring.createFromPrivateKey('0x1b02d2bb3012f7218e90d336a935bd919d0741a5814252d51cf5c337984f2192') 
    keyringContainer.add(keyring2)
    // approve() 함수를 실행
    // approve()는 오너의 주소가 아닌 유저의 지갑주소로 트랙젝션을 일으킨다. 
    // approve('오너의 지갑주소', '사용할수 있는 토큰의 양', {from : 지갑의 주인의 주소})
    await kip7.approve(owner, _amount, {from : keyring2.address})


    // 일반적인 transfer는 받는 주소와 토큰 양만 지정이 가능
    // transferFrom 함수는 토큰을 보내는 주소와 받는 주소 토큰의 양을 지정 가능
    const receipt = await kip7.transferFrom(_address, owner, _amount, {from : keyring.address})

    // 이 함수는 에러가 발생한다
    // 에러가 발생하는 이유는 오너가 오너의 지갑이 아닌 다른 사람의 지갑의 토큰을 이동을 시킬수 없기때문
    // 이 함수를 실행을 시키기 위해서는 approve 함수를 먼저 실행을 시켜야 한다. 
    // approve()  함수가 하는 행동은 자기 자신의 지갑에서 일정 토큰의 양을 다른 사람이 이동 시킬수 있도록 허가하는 함수
    // transferFrom() 함수를 사용하기 위해서는 approve()함수를 먼저 실행하여 토큰을 다른 사람이 사용할 수 있도록 허가를 해야한다. 


    console.log(receipt)
    
}

// 토큰의 양을 출력하는 함수 
async function balance_of(_address){
    const kip7 = await new caver.kct.kip7('0x44112F4b951BEf88d8b736cEbb0F9313a3bFb606')
    kip7.setWallet(keyringContainer)

    // balanceOf 함수를 호출하여 해당하는 주소의 토큰의 양을 출력
    // 지갑의 토큰의 개수만 출력하는 함수 ( 데이터의 변화는 없다. )
    // transaction 일어나지 않는다.
    // 가스비를 내야될 주소가 필요가 없다.
    // from 을 적지 않는다
    const balance = await kip7.balanceOf(_address)
    return balance
}

// 지갑을 생성하는 함수 
async function create_wallet(){
    // 지갑을 생성하는 api를 호출 
    const wallet = await caver.kas.wallet.createAccount()
    console.log(wallet)
}

// 다른 파일에서 함수들을 호출하기 위해서 module.exports
module.exports = {
    create_token, create_wallet, trans_token, balance_of, trans_from_token
}