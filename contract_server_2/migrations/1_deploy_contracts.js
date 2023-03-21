const user = artifacts.require('user')

module.exports = function(deployer){
    deployer.deploy(user)
    .then(function(){
        console.log(user)
    })
}