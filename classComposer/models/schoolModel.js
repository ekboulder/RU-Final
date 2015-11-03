 //require mongoose module
 var mongoose = require('mongoose')
 // We also will be using our User model
 var User = require('../models/user')

	
//define the schema

        var SchoolSchema = mongoose.Schema({
            principal               : {type : mongoose.Schema.ObjectId, ref:'User'},
            name                    : String,
            address                 : {
                                        streetAddress1 : String,
                                        streetAddress2 : String, 
                                        city          : String,
                                        state         : String,
                                        postalCode   : String, 
                                       },
            number                  : String,
            email                   : String,
            identifiedTags          : Array,
            schoolYear               : [ 
                                        { 
                                          year   : Number, 
                                          grades : [
                                                    { 
                                                      grade: String,
                                                      Classrooms : 
                                                                    [ 
                                                                        {
                                                                            teacher   : [{type : mongoose.Schema.ObjectId, ref:'Teacher'}],
                                                                            students  : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
                                                                        },
                                                                    ]
                                                    },
                                                  ],
                                        },
                                       ],
            })


         var TeacherSchema = mongoose.Schema({
            school                  : {type : mongoose.Schema.ObjectId, ref:'School'},                  
            user                    : {type : mongoose.Schema.ObjectId, ref:'User'},
            firstName               : String,
            lastName                : String,
            email                   : String,
        })

        var studentSchema = mongoose.Schema({
            firstName               : String,
            lastName                : String,
            profilePicture          : String,
            gender                  : String,
            studentGradeProfile     : [ 
                                        {
                                        schoolYear              : Number,
                                        school                  : {type : mongoose.Schema.ObjectId, ref:'School'},
                                        grade                   : String,                                    
                                        currentTeacherId        : {type : mongoose.Schema.ObjectId, ref:'Teacher'},
                                        academicScores          : {
                                                                    Reading     : Number,
                                                                    Writing     : Number,
                                                                    Math        : Number,
                                                                    Avg         : Number, //Result of the above
                                                                  },
                                        lifeSkillsScores        : {
                                                                    Behavior    : Number,
                                                                    WorkSkills  : Number,
                                                                    Avg         : Number, //result of the above
                                                                  },
                                        rank                    : Number,                  //result of the bove
                                        identifiedTags          : [
                                                                    {
                                                                        tag          : String,
                                                                        description  : String,
                                                                        value        : {type: Boolean, default: false, },

                                                                    }
                                                                   ],        
                                        specialRequests         : {
                                                                    targetTeacherId         :   {type : mongoose.Schema.ObjectId, ref:'Teacher'},
                                                                    combinedStudentIds      : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
                                                                    separatedStudentIds     : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
                                                                  },
                                        }
                                    ],
        })


        

       

        var School              = mongoose.model('School', SchoolSchema)
        var Teacher             = mongoose.model('Teacher', TeacherSchema) 
        var Student             = mongoose.model('Student', studentSchema)
        
                                            
module.exports = {
                    School                  : School,
                    Teacher                 : Teacher,
                    Student                 : Student,
                }             






        // var ClassRoomSchema = mongoose.Schema({
        //     teacher                 :   {type : mongoose.Schema.ObjectId, ref:'Teacher'},
        //     grade                   :   {type : mongoose.Schema.ObjectId, ref:'Grade'},
        //     students                : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
        //     boys                    : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ], //result of above
        //     girls                   : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ], //result of above               

        // })

        //  var GradeSchema = mongoose.Schema({
        //     gradeName               : String,
        //     year                    : Number,
        //     students                : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
        //     teachers                : [ {type : mongoose.Schema.ObjectId, ref:'Teachers'} ],
        //     classRoom               : [ {type : mongoose.Schema.ObjectId, ref:'ClassRoom'} ],

        // })

        

        // var PrincipalSchema = mongoose.Schema({
        //     user                    : {type : mongoose.Schema.ObjectId, ref:'User'},
        //     firstName               : String,
        //     lastName                : String,
        //     school                  : [ {type : mongoose.Schema.ObjectId, ref:'School'} ], 
        //     email                   : String,
        //     number                  : String,
    
        // })

        

        




             

       