// require needed Models
var User = require('../models/user');
var Models = require('../models/schoolModel')

//set default variables
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
	var defaultSchoolYear = [ 
								{
									 year 	: 2015,
									 grades :
												[
													{
														grade 	: 'K',
														classrooms : [],
													},
													{
														grade 	: 'First',
														classrooms : [],
													},
													{
														grade 	: 'Second',
														classrooms : [],
													},
													{
														grade 	: 'Third',
														classrooms : [],
													},
													{
														grade 	: 'Fourth',
														classrooms : [],
													},
													{
														grade 	: 'Fourth',
														classrooms : [],
													},
													{
														grade 	: 'Fifth',
														classrooms : [],
													},
												 ],
								},
							 ]


	//School
	var initializeSchool = function(req, res){
		console.log('about to intialize School')
		req.body.principal 				= req.user._id
		req.body.address.streetAddress2 = req.body.address.streetAddress2 || ''
		req.body.identifiedTags 		= defaultIdentifiers
		req.body.schoolYears 			= defaultSchoolYear
		
		var newSchool = new Models.School(req.body)
		newSchool.save(function(err, document){
	      	if(err) return res.send({error : 'An error occured, please try again'})	
			else {
				  User.update({ _id: req.user._id }, {$set: {'school.assigned' : true, 'school.id' : document._id }}).exec()
				  console.log('here is the new School', document)
				  res.send(document)
				}
	    	})
	 	}

	var findSchool = function(schoolId, cb){
		console.log('I am in find School')
		Models.School.findOne({_id: schoolId}, function (err, school){
			if (err) {
				console.log(err)
				res.send('could not find the school')
				}
			else {
				console.log('I found this school:', school)
				cb(school)
				}
			})
		}

	var getSchool = function(req,res){
		console.log('the school id is:', req.user.school.id )
		findSchool (req.user.school.id, function(school) {
				console.log('I am getting school', school)
				res.send(school)
				})
		}

	var updateSchool = function(req,res){
		console.log('I am in updating School')
		findSchool (req.user.school.id, function(school){
			console.log('update request is:', req.body.updateRequest)
				
				if (req.body.updateRequest === 'newTag' ) {
		 			school.identifiedTags.push(req.body.tag)
					school.markModified('identifiedTags')
					} 
				else if (req.body.updateRequest === 'removeTag') {
							school.identifiedTags.splice(req.body.index, 1)
							school.markModified('identifiedTags')
					}
				// else if (req.body.updateRequest ==== '') {

				// }

				school.save()
				console.log('saving school:', school)
				res.send(school)	
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

 		var currentTeachers = function (req, res){
 			Models.Teacher.find({school : req.query.id}, function(err, teachersArray) {
 				if (err) {
 					console.log(err)
 					res.send('could not find the array of teachers')
 				} else{
 					console.log('TEACHER ARRAY')
 					console.log(teachersArray)
 					res.send(teachersArray)
 				}
 				})
 			}

 	//Tags

module.exports = {
	initializeSchool		: initializeSchool,
	getSchool				: getSchool,
	updateSchool			: updateSchool,
	currentTeachers 		: currentTeachers,
	addTeacher 				: addTeacher,

}






// var currentSchool = function(req,res){
// 		Models.School.findOne({_id: req.user.school.id}, function (err, school){
// 			if (err) {
// 				console.log(err)
// 				res.send('could not find the school')
// 			}
// 			else {
// 				res.send(school)
// 			}
// 		})
// 	}
