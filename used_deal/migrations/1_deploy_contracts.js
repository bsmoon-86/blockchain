const user = artifacts.require('used_deal')

module.exports = function(deployer){
    deployer.deploy(user)
    .then(function(){
        console.log(user)
    })
}