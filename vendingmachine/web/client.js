const Caver = require('caver-js')

// ../ : 상위 폴더로 이동
// ./ : 현재 폴더
// /폴더명 : 하위 폴더로 이동
const contract_info = require("../build/contracts/VendingMachine.json")

// baobab testnet 주소를 지정
const cav = new Caver("https://api.baobab.klaytn.net:8651")

// smartcontract의 주소를 지정
const smartcontract = new cav.klay.Contract(
    contract_info.abi, contract_info.networks['1001']['address']
)

// 컨트렉트의 owner로 지정되어있는 지갑의 주소를 등록
let account = cav.klay.accounts.createWithAccountKey('0x3778671B6beA5D1dcdd059F1e226B096c82c13a0', '0xef0a0198393a7012063e4892fdeb4ead00a841beaa7c7188893833987d36d7c6')
cav.klay.accounts.wallet.add(account)

// 빵의 재고를 출력해주는 함수
async function bread_balance() {
    // smartcontract에서 함수들 중에 getVendingMachineBalance() 함수를 호출해서 result라는 변수에 대입
    result = await smartcontract
    .methods
    .getVendingMachineBalnace()
    .call()
    return result
}

// 빵의 재고를 추가하는 함수
async function bread_restock(_amount) {
    // smartcontract에서 함수들 중 restock함수를 호출하여 transaction의 결과 메시지를 콘솔에 표시
    let receipt = await smartcontract
    .methods
    .restock(_amount)
    .send({
        from : account.address, 
        gas : '300000'
    })
    console.log(receipt)
}

// 빵을 구입하는 함수 (빵의 재고가 줄어드는 함수)
async function bread_purchase(_amount) {
    // smartcontract에서 함수들 중 purchase 함수를 호출하여 transaction의 결과 메시지를 콘솔에 표시
    let receipt = await smartcontract
    .methods
    .purchase(_amount)
    .send({
        from : account.address, 
        gas : '300000'
    })
    console.log(receipt)
}

// 위에서 지정한 함수들을 다른 js 파일에서 사용하기 위해서 export
module.exports = {
    bread_balance, bread_restock, bread_purchase
}