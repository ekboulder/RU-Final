// require needed Models
var User = require('../models/user');
var Models = require('../models/schoolModel')


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

var addSchool = function(req, res){
	req.body.contactPerson 		= req.user._id
	req.body.IdentifiedTagsId 	= defaultIdentifiers
	req.body.address.streetAdress2 = req.body.address.streetAdress2 || ''

	console.log('adding School',req.body)
	var newSchool = new Models.School({ School : req.body})
	newSchool.save(function(err, document){
      	if(err) return res.send({error : 'An error occured, please try again'})	
		else {
			  User.update({ _id: req.user._id }, {$set: {'school.assigned' : true, 'school.id' : document._id }}).exec()
			  res.send('document')
			}
    })
  }

module.exports = {
	addSchool				: addSchool,
}
