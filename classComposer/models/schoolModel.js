 //require mongoose module
 var mongoose = require('mongoose')
 // We also will be using our User model
 var User = require('../models/user')

	
//define the schema

        var studentSchema = mongoose.Schema({
            firstName               : String,
            lastName                : String,
            profilePicture          : String,
            gender                  : String,
            school                  : [ {type : mongoose.Schema.ObjectId, ref:'School'} ], 
            studentGradeProfile     : [ {type : mongoose.Schema.ObjectId, ref:'StudentGradeProfile'} ],
        })

        var StudentGradeProfileSchema = mongoose.Schema({
            studentId               :   {type : mongoose.Schema.ObjectId, ref:'Student'},
            grade                   :   {type : mongoose.Schema.ObjectId, ref:'Grade'},
            currentTeacherId        :   {type : mongoose.Schema.ObjectId, ref:'Teacher'},
            year                    : Number,
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
            identifiedTags          : {type : mongoose.Schema.ObjectId, ref:'IdentifiedTags'},
            specialRequests         : {
                                        targetTeacherId         :   {type : mongoose.Schema.ObjectId, ref:'Teacher'},
                                        combinedStudentIds      : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
                                        separatedStudentIds     : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
                                      },
    
         })
        
        var IdentifiedTagsSchema = mongoose.Schema({
            schoolId                : {type : mongoose.Schema.ObjectId, ref:'School'},
            studentId               : {type : mongoose.Schema.ObjectId, ref:'Student'},
            Identifiers             : [
                                        {
                                            tag             : String,
                                            description     : String,
                                            value           : {type: Boolean, default: false, },
                                        },
                                      ], 
        })
                                            
        var ClassRoomSchema = mongoose.Schema({
            teacher                 :   {type : mongoose.Schema.ObjectId, ref:'Teacher'},
            grade                   :   {type : mongoose.Schema.ObjectId, ref:'Grade'},
            students                : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
            boys                    : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ], //result of above
            girls                   : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ], //result of above               

        })

       

        var SchoolSchema = mongoose.Schema({
            contactPerson           : {type : mongoose.Schema.ObjectId, ref:'User'},
            name                    : String,
            address                 : {
                                        streetAdress1 : String,
                                        streetAdress2 : String, 
                                        city          : String,
                                        State         : String,
                                        postalCode   : String, 
                                       },
            number                  : String,
            email                   : String,
            // IdentifiedTagsId        : {type : mongoose.Schema.ObjectId, ref:'IdentifiedTags'},
            IdentifiedTagsId        : [],
        })

         var GradeSchema = mongoose.Schema({
            gradeName               : String,
            year                    : Number,
            students                : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
            teachers                : [ {type : mongoose.Schema.ObjectId, ref:'Teachers'} ],
            classRoom               : [ {type : mongoose.Schema.ObjectId, ref:'ClassRoom'} ],

        })

        var TeacherSchema = mongoose.Schema({
            user                    : {type : mongoose.Schema.ObjectId, ref:'User'},
            firstName               : String,
            lastName                : String,
            grade                   : Number,
            email                   : String,
            studentsList            : {
                                        year     : Number,
                                        grade    : [ {type : mongoose.Schema.ObjectId, ref:'Grade'} ],
                                        students : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
                                       },
            
        })

        var PrincipalSchema = mongoose.Schema({
            user                    : {type : mongoose.Schema.ObjectId, ref:'User'},
            firstName               : String,
            lastName                : String,
            school                  : [ {type : mongoose.Schema.ObjectId, ref:'School'} ], 
            email                   : String,
            number                  : String,
    
        })

        var Student             = mongoose.model('Student', studentSchema),
            StudentGradeProfile = mongoose.model('StudentGradeProfile', StudentGradeProfileSchema),
            IdentifiedTags      = mongoose.model('IdentifiedTags', IdentifiedTagsSchema), 
            ClassRoom           = mongoose.model('ClassRoom', ClassRoomSchema),
            Grade               = mongoose.model('Grade', GradeSchema), 
            School              = mongoose.model('School', SchoolSchema),
            Teacher             = mongoose.model('Teacher', TeacherSchema), 
            Principal           = mongoose.model('Principal', PrincipalSchema) 

        


module.exports = {
                Student                 : Student,
                StudentGradeProfile     : StudentGradeProfile,
                IdentifiedTags          : IdentifiedTags,
                ClassRoom               : ClassRoom,
                Grade                   : Grade,
                School                  : School,
                Teacher                 : Teacher,
                Principal               :Principal,
}             

             

       