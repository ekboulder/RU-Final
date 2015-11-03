// require needed Models
var User = require('../models/user');
var School = require('../models/schoolModel')


//set default identifiers
var defaultIdentifiers =[
						 {
						 	tag 		: 'ELL',
						 	description	: 'English Language Learner',
						 	value		: false,
						 },
						 {
						 	tag 		: 'GT',
						 	description	: 'Gifted and Talented',
						 	value		: false,
						 },
						 {
						 	tag 		: 'IEP',
						 	description	: 'Individualized Education Plan',
						 	value		: false,
						 },
						 {
						 	tag 		: 'SPE',
						 	description	: 'Speech',
						 	value		: false,
						 },
						 {
						 	tag 		: '504',
						 	description	: 'on a 504 Plan',
						 	value		: false,
						 },
						 {
						 	tag 		: 'PT',
						 	description	: 'Physical Therapy',
						 	value		: false,
						 },
						 {
						 	tag 		: 'GPV',
						 	description	: 'Great Parent Volunteer',
						 	value		: false,
						 },
						 {
						 	tag 		: 'BPL',
						 	description	: 'On a Behavior Plan',
						 	value		: false,
						 },
						 ]
var getDefaultSchool = function(req, res) {
	var defaultSchool = {
						contactPerson		: req.user._id,
						name                : '',
			            address             : {
			                                    streetAdress1 : '',
		                                        streetAdress2 : '', 
		                                        city          : '',
		                                        State         : '',
		                                        postalCode   : '', 
		                                       },
			            number             	: '',
			            email               : '',
			            IdentifiedTagsId	: defaultIdentifiers,
						}
	res.send(defaultSchool)
}

var addSchool = function(req, res){
	console.log('adding School')
	console.log(req.body)
  	res.send('success')







  	// /res.sendFile('/html/home.html', {root : './public'})
}

// var getLoggedInSettings = function (req, res) {
// 	console.log("on to settings")
// 	console.log('req query:', req.query)
// 	res.sendFile('/html/settings.html',{root : './public'})

// }

module.exports = {
	getDefaultSchool		: getDefaultSchool,
	addSchool				: addSchool,
}
