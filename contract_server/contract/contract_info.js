var address = '0x77C57b13848c80dfECb42DE2ac80c560D36450a4'

var abi = [
	{
		"inputs": [],
		"name": "change_a",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "view_a",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

module.exports= {address, abi}