
var getLoggedInHome = function(req, res){
	console.log('on to home.html')
  	res.sendFile('/html/home.html', {root : './public'})
}

var getLoggedInSettings = function (req, res) {
	console.log("on to settings")
	console.log('req query:', req.query)
	res.sendFile('/html/settings.html',{root : './public'})

}

module.exports = {
	getLoggedInHome		: getLoggedInHome,
	getLoggedInSettings  : getLoggedInSettings,
}

// var submissionRouting = function (req, res){
// 	console.log('req body:', req.body)
// 	new submissions.Video(req.body)
// 	res.send(submissions.submissionsList)

// }

// var setVote = function (req,res) {
// 	console.log('set Vote:',req.body)
// 	submissions.submissionsList[req.body.id].voteCount++
// 	res.send(submissions.submissionsList)
		

// }

// module.exports = {
// 	getListing			: getListing,
// 	submissionRouting 	: submissionRouting,
// 	setVote				: setVote,
	
// }