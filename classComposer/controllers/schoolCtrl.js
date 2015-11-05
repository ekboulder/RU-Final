// require needed Models
var User = require('../models/user');
var Models = require('../models/schoolModel')
var async = require('async')
var mongoose = require('mongoose')

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
														classRooms : [],
													},
													{
														grade 	: 'First',
														classRooms : [],
													},
													{
														grade 	: 'Second',
														classRooms : [],
													},
													{
														grade 	: 'Third',
														classRooms : [],
													},
													{
														grade 	: 'Fourth',
														classRooms : [],
													},
													{
														grade 	: 'Fourth',
														classRooms : [],
													},
													{
														grade 	: 'Fifth',
														classRooms : [],
													},
												 ],
								},
							 ]


	//School
	var initializeSchool = function(req, res){
		// console.log('about to intialize School')
		req.body.principal 				= req.user._id
		req.body.address.streetAddress2 = req.body.address.streetAddress2 || ''
		req.body.identifiedTags 		= defaultIdentifiers
		req.body.schoolYears 			= defaultSchoolYear
		
		var newSchool = new Models.School(req.body)
		// console.log('here is the new school', newSchool)
		newSchool.save(function(err, document){
	      	if(err) return res.send({error : 'An error occured, please try again'})	
			else {
				  User.update({ _id: req.user._id }, {$set: {'school.assigned' : true, 'school.id' : document._id }}).exec()
				  // console.log('here is the new School', document)
				  res.send(document)
				}
	    	})
	 	}

	var findSchool = function(schoolId, cb){
		// console.log('I am in find School')
		Models.School.findOne({_id: schoolId}, function (err, school){
			if (err) {
				console.log(err)
				res.send('could not find the school')
				}
			else {
				// console.log('I found this school:', school)
				cb(school)
				}
			})
		}

	var getSchool = function(req,res){
		// console.log('the school id is:', req.user.school.id )
		findSchool (req.user.school.id, function(school) {
				// console.log('I am getting school', school)
				res.send(school)
				})
		}

	var updateSchool = function(req,res){
		// console.log('I am in updating School')
		findSchool (req.user.school.id, function(school){
			// console.log('update request is:', req.body.updateRequest)
				
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
				// console.log('saving school:', school)
				res.send(school)	
				})	
 		}

    //Teachers   (grades)
 		var addTeacher = function(req,res){
 			console.log('about to add a teacher')
 			req.body.schoolId 		= req.user.school.id
 			//this is a hack
 			req.body.year = 2015
 			// req.body.studentsList 	= []
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
						req.body.userId = savedUser._id

						var newTeacher = new Models.Teacher(req.body)
							newTeacher.save(function(err, teacher){  	
							console.log('now registering the teacher in its collection')
							if(err) return res.send({error : 'An error occured while registering a new Teacher'})		
							else {
									findSchool (teacher.schoolId, function(school){


											for(var year = 0; year < school.schoolYears.length; year++){
												if (school.schoolYears[year].year === req.body.year) {
													var targetSchoolYear = school.schoolYears[year]
												}
											}
											// targetSchoolYear = school.schoolYears.filter(function(schoolYear){
											// 	if (schoolYear.year === req.body.year) {
											// 		return true
											// 	}
											// })
											console.log('targetSchoolYear', targetSchoolYear)
											
											for(var grade = 0; grade < targetSchoolYear.grades.length; grade++){
												if (targetSchoolYear.grades[grade].grade === req.body.grade) {
													var targetGrade = targetSchoolYear.grades[grade]
												}
											}

											// targetGrade =  targetSchoolYear.grades.filter(function(grade){
											// 	if (grade.grade === req.body.grade) {
											// 		return true	
											// 	}
											// })
									
											console.log('targetGrade', targetGrade)
											targetGrade.classRooms = targetGrade.classRooms || []
											targetGrade.classRooms.push({
														teacherId 	: teacher._id,
														studentsIds	: []
													})
											
											console.log('targetGrade', targetGrade)

											console.log('Before save', school.schoolYears[0].grades)
											school.markModified('schoolYears')
											school.save(function(err, document){
												console.log('saving school erro',err)
												console.log('saving school success',document)
											})		
											res.send(teacher)
									})
								} 
						}) 	
					}
 			})
		}

 		var currentTeachers = function (req, res){
 			Models.Teacher.find({schoolId : req.query.id}, function(err, teachersArray) {
 				if (err) {
 					console.log(err)
 					res.send('could not find the array of teachers')
 				} else{
 					console.log('TEACHER ARRAY', teachersArray)
 				
 					res.send(teachersArray)
 				}
 				})
 			}

 	//Tags


var getStudents = function (req,res) {
	Models.Student.find({studentGradeProfile: { $elemMatch : {school : req.query.id}}}, function(err, studentArray) {
 				if (err) {
 					console.log(err)
 					res.send('could not find the array of students')
 				} else{
 					console.log('Student Array')
 					console.log(studentArray)
 					//res.send(studentArray) the below is to populate the teacher
 					
 					var tasks = []

 					for (var student = 0; student < studentArray.length; student++ ) {
 						studentArray[student] = studentArray[student].toObject()
 						// console.log('---Student---', studentArray[student])
 						
 						function studentStuff(student){

	 						for (var gradeProfile = 0; gradeProfile < studentArray[student].studentGradeProfile.length; gradeProfile++){
	 							
	 							function gradeStuff(gradeProfile){

	 							tasks.push(function(cb){  //push a single task into an arry of tasks for async to perform

	 									Models.Teacher.findOne({ _id : mongoose.Types.ObjectId(studentArray[student].studentGradeProfile[gradeProfile].currentTeacherId)}, function (err, teacher){ //find the teacher
	 										console.log(student, gradeProfile, studentArray[student].studentGradeProfile[gradeProfile].currentTeacherId, teacher)
	 										studentArray[student].studentGradeProfile[gradeProfile].currentTeacherId = teacher
	 										// console.log('=============', studentArray[student].studentGradeProfile[gradeProfile].currentTeacherId)
	 										cb() //this task os done. we found the teacher and we changed the property o the object.
	 										})
	 									})
	 							}
	 							gradeStuff(gradeProfile)
	 						}
	 					}
	 					studentStuff(student)
 					}
 					console.log('after loops')
 					async.series(tasks, function(){
 						console.log('======== DONE =======')
 					res.send(studentArray)
 					})
 				}
 			})
}








module.exports = {
	initializeSchool		: initializeSchool,
	getSchool				: getSchool,
	updateSchool			: updateSchool,
	currentTeachers 		: currentTeachers,
	addTeacher 				: addTeacher,
	getStudents				: getStudents,

}
