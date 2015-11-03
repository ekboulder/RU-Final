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

    //Schools
		var currentSchool = function(req,res){
			// console.log(req.user)
			// console.log('currentSchool id', req.user.school.id)
			Models.School.findOne({_id: req.user.school.id},function (err, school){
				if (err) {
					console.log(err)
					res.send('could not find the school')
				}
				else {
					// console.log(school)
					res.send(school)
				}
			})
		}

		var addSchool = function(req, res){
			req.body.contactPerson 		= req.user._id
			req.body.identifiedTags 	= defaultIdentifiers
			req.body.address.streetAddress2 = req.body.address.streetAddress2 || ''

			// console.log('adding School',req.body)
			var newSchool = new Models.School(req.body)
			newSchool.save(function(err, document){
		      	if(err) return res.send({error : 'An error occured, please try again'})	
				else {
					  User.update({ _id: req.user._id }, {$set: {'school.assigned' : true, 'school.id' : document._id }}).exec()
					  res.send(document)
					}
		    })
		  }

    //Teachers   (grades)
 		var addTeacher = function(req,res){
 			console.log('about to add a teacher')
 			req.body.school 		= req.user.school.id
 			req.body.studentsList 	= []
 			userTeacher 			= new User({
					 				  firstName : req.body.firstName,
								      lastName  : req.body.lastName,
								      role      : 'teacher',
								      username  : req.body.email,
								      password  : req.body.email,
								      email     : req.body.email,
								      school    : {
								                    assigned  : true,
								                    id        : req.user.school.id,
								                  },
								    })
 			userTeacher.save(function(err, savedUser){
 				console.log('first registering the teacher type user')
		      	if(err) return res.send({error : 'An error occured while registering a teacher\'s req.body.user as a USER'})	
				else {
						req.body.user = savedUser._id
						var newTeacher = new Models.Teacher(req.body)
							newTeacher.save(function(err, teacher){
								console.log('now registering the teacher in its collection')
								if(err) return res.send({error : 'An error occured while registering a new Teacher'})		
								else res.send(teacher)
							}) 	
					}
 			})
 		}



module.exports = {
	addSchool				: addSchool,
	currentSchool			: currentSchool,
	// currentTeachers 		: currentTeachers,
	addTeacher 				: addTeacher,
}
