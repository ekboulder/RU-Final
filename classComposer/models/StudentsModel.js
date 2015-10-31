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
            identifiedTags          : {type : mongoose.Schema.ObjectId, ref:'IdentifiedTags'}
            specialRequests         : {
                                        targetTeacherId         :   {type : mongoose.Schema.ObjectId, ref:'Teacher'},
                                        combinedStudentIds      : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
                                        separatedStudentIds     : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
                                      },
    
         })
        
        var IdentifiedTagsSchema = mongoose.schema({
            studentId               : {type : mongoose.Schema.ObjectId, ref:'Student'} 
            tags                    : {
                                        GT           :{type: Boolean, default: false, },  
                                        GPV          :{type: Boolean, default: false, }, 
                                        IEP          :{type: Boolean, default: false, }, 
                                        BPL          :{type: Boolean, default: false, }, 
                                        ELL          :{type: Boolean, default: false, }, 
                                        RCC          :{type: Boolean, default: false, }, 
                                        RT           :{type: Boolean, default: false, }, 
                                        SPE          :{type: Boolean, default: false, }, 
                                        FOF          :{type: Boolean, default: false, }, 
                                        PT           :{type: Boolean, default: false, }, 
                                        KLG          :{type: Boolean, default: false, }, 
                                        BEN          :{type: Boolean, default: false, }, 
                                      }, 
        })
                                            
        var ClassRoomSchema = mongoose.schema({
            teacher                 :   {type : mongoose.Schema.ObjectId, ref:'Teacher'},
            grade                   :   {type : mongoose.Schema.ObjectId, ref:'Grade'},
            students                : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
            boys                    : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ], //result of above
            girls                   : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ], //result of above               

        })

       

        var SchoolSchema = mongoose.schema({
            name                    : String,
            address                 : {
                                        streetAdress1 : String,
                                        StreetAdress2 : String.
                                        City          : String,
                                        State         : String,
                                        Postal Code   : String, 
                                       },
            number                  : String,
            email                   : String,
            contactPerson           : {type : mongoose.Schema.ObjectId, ref:'User'},

        })

         var GradeSchema = mongoose.schema({
            gradeName               : String,
            year                    : Number,
            students                : [ {type : mongoose.Schema.ObjectId, ref:'Student'} ],
            teachers                : [ {type : mongoose.Schema.ObjectId, ref:'Teachers'} ],
            classRoom               : [ {type : mongoose.Schema.ObjectId, ref:'ClassRoom'} ],

        })

        var TeacherSchema = mongoose.schema({
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

        var Student             = mongoose.model('Student', studentSchema),
            StudentGradeProfile = mongoose.model('StudentGradeProfile', StudentGradeProfileSchema),
            IdentifiedTags      = mongoose.model('IdentifiedTags', IdentifiedTagsSchema), 
            ClassRoom           = mongoose.model('ClassRoom', ClassRoomSchema),
            Grade               = mongoose.model('Grade', GradeSchema), 
            School              = mongoose.model('School', SchoolSchema),
            Teacher             = mongoose.model('Teacher', TeacherSchema)  

        


module.exports = {
                Student                 : Student,
                StudentGradeProfile     : StudentGradeProfile,
                IdentifiedTags          : IdentifiedTags,
                ClassRoom               : ClassRoom,
                Grade                   : Grade,
                School                  : School,
                Teacher                 : Teacher,
}             

             

       