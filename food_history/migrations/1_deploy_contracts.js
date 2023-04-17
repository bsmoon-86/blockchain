const user = artifacts.require('food_history')

module.exports = function(deployer){
    deployer.deploy(user)
    .then(function(){
        console.log(user)
    })
}