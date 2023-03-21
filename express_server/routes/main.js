// express 로드 
var express = require("express");
// express 안에 있는 Router() 매서드를 로드 
var router = express.Router();

module.exports = function(){
    // localhost:3000/main으로 요청 시
    router.get("/", function(req, res){
        res.send("Route Page")
    })

    // localhost:3000/main/second 로 요청 시
    router.get("/second", function(req, res){
        res.send("route second page")
    })

    return router;
}