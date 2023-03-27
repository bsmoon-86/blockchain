const CaverExtKAS = require('caver-js-ext-kas')

const caver  = new CaverExtKAS()

// KAS 에 접속하기 위한 KAS ID, PASSWORD
const accesskeyId = 'KASKVGU5GD7XHP7IJIOJ3Q80'
const secretAccessKey = 'JhC_7OycKEzu1kMTEzR4xMCW7xyU8yj7hOq-Zm94'
// testnet의 networkid 지정
const chainId = 1001

caver.initKASAPI(chainId, accesskeyId, secretAccessKey)


// 사용할 지갑의 주소를 등록
const keyringContaner = new caver.keyringContaner()
const keyring = keyringContaner.keyring.createFromPrivateKey('0xef0a0198393a7012063e4892fdeb4ead00a841beaa7c7188893833987d36d7c6')
keyringContaner.add(keyring)

// 토큰을 생성하는 함수( kip7 토큰 생성 )
async function create_token(){
    const kip7 = await caver.kct.kip7.deploy(
        {
            name : 'Bread', //토큰의 이름
            symbol : 'BR', //토큰의 심볼
            decimals : 0, //토큰의 소수점 자리수
            initialSupply : 100000000 //토큰의 발행량
        }, 
        keyring.addess, 
        keyringContaner
    )
    console.log(kip7._address)
}

// 토큰을 거래하는 함수 
async function trans_token(_address, _amount){
    // 발행한 토큰을 keyringContainer에 지정
    const kip7 = await new caver.kct.kip7('발행된 토큰의 주소')
    kip7.setWallet(keyringContaner)

    // 발행한 토큰을 _address 매개변수로 받은 인자값의 주소로 _amount만큼 보내준다.
    const receipt = await kip7.transfer(_address, _amount, {from : keyring.address})

    console.log(receipt)
}

// 토큰의 양을 출력하는 함수 
async function balance_of(_address){
    const kip7 = await new caver.kct.kip7('발행된 토큰의 주소')
    kip7.setWallet(keyringContaner)

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
    create_token, create_wallet, trans_token, balance_of
}