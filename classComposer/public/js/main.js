var app = angular.module('App', ['ui.bootstrap','ngMaterial', 'ngMdIcons', 'ngRoute', 'dndLists', 'chart.js']);

// Authentication service
app.service('authService', ['$http', '$location', function($http){
		
		this.authCheck = function(callBack){
			$http.get('/api/me')
				.then( function(returnData){
					callBack(returnData.data)

				})
		}			
	}])

//http Service
app.service('httpService', ['$http', function($http){

		 // @param method	: GET, POST, Delete
		 // @param url 	`	: String
		 // @param data 	: Object


		 this.httpRequest = function (method, url, data, callBack) {
		
			// console.log('http please', method, url, data)
			
			$http({
				method 	: method,										//'POST'
				url		: url, 											//'/api/translate'
				data	: data,											//translationRequest,
			}).then(
			function (returnData){
				//console.log('return data:',returnData.data)
				callBack(returnData.data)
			},
			function (error){
				console.log('error')
			})
		}
}])

// Scroll service
app.service('scrollService', ['$timeout','$location', '$anchorScroll',
  function ($timeout, $location, $anchorScroll) {
    
	    this.scroll = function(elementId) {
	       $timeout(function() {
            // $location.hash(elementId);
            $anchorScroll(elementId);
        });
	    };
  }])

// Define our routes
app.config(['$routeProvider', function($routeProvider){
		// No need to define #, it is assumed
		$routeProvider
			.when('/', {
				templateUrl : '/html/dashboard.html',
				controller : 'mainController'
			})
			.when('/loggedIn/dashboard', {
				templateUrl : '/html/dashboard.html',
				controller : 'mainController'
			})
			.when('/loggedIn/settings', {
				templateUrl : '/html/settings.html',
				controller : 'mainController'
			})
			.when('/loggedIn/assessment', {
				templateUrl : '/html/assessment.html',
				controller : 'mainController'
			})
			.when('/loggedIn/classComposer', {
				templateUrl : '/html/classComposer.html',
				controller : 'mainController'
			})
			.when('/error', {
				templateUrl : 'html/error.html',
				controller : 'errorController'
			})
			.otherwise({
				redirectTo : '/error'
			})
 }])

// MainController
app.controller('mainController', ['$scope', '$http','$mdBottomSheet','$mdSidenav', '$mdDialog','authService','scrollService', 'httpService','studentFactory', function($scope, $http, $mdBottomSheet, $mdSidenav, $mdDialog, authService, scrollService, httpService, studentFactory){
    
		
		
	////////////////////////////////////////////////////////////////////
	//for the charts.
	$scope.labels = ["K", "First", "Second","Thhird","Fourth","Fifth"];
  	$scope.data = [15,14,10,18,22,17]


	$scope.studentList = studentFactory.studentFactoryList
	console.log('total Number of Students: ', $scope.studentList.length)
	$scope.gradeLevel = studentFactory.schoolGradeFactoryList[0]
	$scope.classRoomExpand = function (index) {
		$scope.gradeLevel.classRoomList[index].expand = !$scope.gradeLevel.classRoomList[index].expand
	}

	$scope.classRoomExpanded = function(classRoom) {
		return classRoom.expand === true
	}

	$scope.logEvent = function(message, event, index, listByGender) {
        console.log(message, '(triggered by the following', event.type, 'event)');
        console.log(event);
        console.log(listByGender[index])
    };

    $scope.onMove = function(passedId, listByGender){
    		var selectedIndex;
    		var selectedChild = listByGender.filter(
        	function(child, index){
            		if(child.id === passedId){
                		selectedIndex = index
                		return true
    	        		}
        		})[0]
    		listByGender.splice(selectedIndex, 1) //splice to remove from Array.

    		updateStats()
    		console.log(selectedIndex, selectedChild)
    		// newList.push(selectedChild)
    		// oldList.splice(selectedIndex, 1)

	}

	var updateStats =function () {

		$scope.gradeLevel.classRoomList.forEach(function(classRoom){
    				
    		console.log('hello:', classRoom)

    		var academicCalc = function (students) {
                        var academicAvg = 0
                        var read = 0
                        var math = 0
                        var writing = 0

                        students.forEach(function(element){
                            read    += element.scores['Reading']
                            math    += element.scores['Writing']
                            writing += element.scores['Math']
                        })
                        academicAvg = Math.round( (read + math + writing)/ (3 * students.length) *10) /10

                        return {
                            academicAvg : academicAvg,
                            read : Math.round (read/students.length *10) /10 ,
                            math : Math.round (math/students.length * 10) /10,
                            writing : Math.round(writing/students.length * 10) /10,
                            }
                    }

                    var studentRoaster = []
                    classRoom.studentBlocks.forEach(function(block){
                    	block.studentList.forEach(function(student){
                    			studentRoaster.push(student) 
                    	})
                    })
                    classRoom.academic = academicCalc(studentRoaster)
                    console.log('hi:',classRoom.academic)

   		}) //end of $scope.gradeLevel.classRoomList.forEach
   			
    }     
	////////////////////////////////////////////////////////////////////


		// For Authentication
			authService.authCheck(function(user) {
				// console.log('USER!', user) 
				$scope.user = user
				
				//in case the user already has a school assigned, let's retrieve it.
				if (user) {
					if (user.school.assigned){
						console.log('getting school')
						getSchool()
					}
				}
			})


		// for the Bootstrap scroll
			$scope.scrollTo = scrollService.scroll
			$scope.greeting = 'greeting'

		// sideNav menu
				$scope.toggleSidenav = function(menuId) {
			    	$mdSidenav(menuId).toggle();
			  	};
			 	
			 	$scope.pageTitle = "Dashboard"

			 	$scope.menu = [
				    {
				      link : '/loggedIn/home.html/#/loggedIn/dashboard',
				      title: 'Dashboard',
				      icon: 'dashboard',
				    },
				    {
				      link : '/loggedIn/home.html/#/loggedIn/settings',
				      title: 'Settings',
				      icon: 'edit',
				    },
				    {
				      link : '/loggedIn/home.html/#/loggedIn/assessment',
				      title: 'Student Assessments',
				      icon: 'assessment',
				    },
				    {
				      link : '/loggedIn/home.html/#/loggedIn/classComposer',
				      title: 'Class Composer',
				      icon: 'classComposer',
				    },
				  ];

				  $scope.updatePageTitle = function (title) {
				  	console.log('page title:', title)
				  	$scope.pageTitle = title 
				  }

		// for controlling the input tabs and forms
		    	$scope.step=[false,false,false,false]


				$scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
		    			'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
		    			'WY').split(' ').map(function(state) {
		     	   		return {abbrev: state};
		    	  })

		    	$scope.grades = ('K First Second Third Fourth Fifth').split(' ').map(function(grade) {
		    			return {'grade': grade}
		    	})

		// School and Tag Registration


			// sorting Lists (search teacher should be search item)
				$scope.sortType     	= 'name'; // set the default sort type
		  		$scope.sortReverse  	= false;  // set the default sort order
		  		$scope.searchTeacher   	= '';     // set the default search/filter
			//School	
				$scope.school = {}
				
				$scope.initializeSchool = function () {
						console.log('initializing School', $scope.school )
						return httpService.httpRequest('POST', '/data/initializeSchool', $scope.school, initializeSchoolSync)	
		    	}
		    	var initializeSchoolSync = function (newSchool) {
		   				$scope.school = newSchool
		   				console.log('new School', newSchool)		
		  		}

				var getSchool = function () {
						console.log ('in function get school')
						return httpService.httpRequest('GET', '/data/getSchool', {}, getSchoolSync)	
		    	}
		    	var getSchoolSync = function (school) {
						console.log ('Got School', school)
		   				$scope.school = school
		   				//to do: should no longer get teachers this way bu rather get them from the school object
		   				
		   				getTeachers(school._id)
		   				getStudents(school._id)
		  		}
			//teachers	
		    	$scope.currentTeachers = []
		    	$scope.inputTeacher = {}
		    	$scope.createTeacher = function () {
		    			console.log('about to send a teacher create request:', $scope.inputTeacher )
						return httpService.httpRequest('POST', '/data/newTeacher', $scope.inputTeacher, createTeacherSync)	
		    	}
		    	var createTeacherSync = function (newTeacher) {
		    			console.log('here is the new teacher:', newTeacher)

		   				$scope.currentTeachers.push(newTeacher)
		   				$scope.currentTeachers = $scope.currentTeachers.slice().reverse()
		   				$scope.inputTeacher = {
		   										school                  : {},                  
									            user                    : {},
									            firstName               : '',
									            lastName                : '',
									            grade                   : $scope.inputTeacher.grade,
									            email                   : '',
									            studentsList            : [] 
												}
		  		}
		  		
		  		//to do: get teacher should get the teachers form the school object
		  		var getTeachers = function (schoolId) {
		  			console.log('getting teachers form school id', schoolId)
		  			return httpService.httpRequest('GET', '/data/currentTeachers?id='+schoolId, {}, getTeachersSync)	
		    	}
		    	var getTeachersSync = function (teachersArray) {
		    			console.log ('here is the retrieved teacher Array', teachersArray)
		    			$scope.currentTeachers = teachersArray
		    			$scope.currentTeachers = $scope.currentTeachers.slice().reverse()
		    	}
		  		
		    	$scope.inputIdentifierTag = {}
		    	$scope.createIdentifierTag = function () {
		    		return httpService.httpRequest('POST', '/data/updateSchool', { updateRequest: 'newTag', schoolId: $scope.school._id , tag : $scope.inputIdentifierTag} , createIdentifierTagSync)	
		    	}
		    	var createIdentifierTagSync = function (school) {
		    		console.log('just updated this school:', school._id)
		    		$scope.school = school
		    		$scope.inputIdentifierTag = {}
		    	}
		    	$scope.deleteIdentifierTag = function (passedTag, identifiedTags) {
		    		var selectedIndex;
		    		var selectedChild = identifiedTags.filter(
		    							function(child, index){
												if(child.tag === passedTag){
										    		selectedIndex = index
										    		return true
										    		}
											})[0]	    			
		    		return httpService.httpRequest('POST', '/data/updateSchool', { updateRequest: 'removeTag', schoolId: $scope.school._id , index : selectedIndex} , deleteIdentifierTagSync)	
		    	}
		    	var deleteIdentifierTagSync = function (school) {
		    		$scope.school = school
		    		$scope.inputIdentifierTag = {}
		    	}

// ng-click="deleteIdentifierTag(identified.tag, school.identifiedTags)"
// dnd-moved=            "onMove(student.id,     listByGender.studentList)"

// $scope.onMove = function(passedId, listByGender){
// var selectedIndex;
// var selectedChild = listByGender.filter(
// function(child, index){
// 		if(child.id === passedId){
//     		selectedIndex = index
//     		return true
//     		}
// 	})[0]
// listByGender.splice(selectedIndex, 1) //splice to remove from Array.

// updateStats()
// console.log(selectedIndex, selectedChild)
// // newList.push(selectedChild)
// // oldList.splice(selectedIndex, 1)

// }

		    	

		   
		// Student intitialization, adding and sorting

				$scope.inputStudent = {}
		    	$scope.students = []
				
		    	// this should turn into a databse call
				$scope.addStudent = function () {
					$scope.students.push($scope.inputStudent)
		    		$scope.students = $scope.students.slice().reverse()
		    		$scope.inputStudent = {
		    								firstName 			: "",
		    								lastName 			: "",
		    								grade 				: $scope.inputStudent.grade,
		    								currentTeacherId 	: $scope.inputStudent.currentTeacherId,
		    							}
				}


				var getStudents = function (schoolId) {
		  			console.log('getting students form school id', schoolId)
		  			return httpService.httpRequest('GET', '/data/getStudents?id='+schoolId, {}, getStudentsSync)	
		    	}
		    	var getStudentsSync = function (studentArray) {
		    			console.log ('here is the retrieved student Array', studentArray)
		    			$scope.students = studentArray
		    			$scope.students = $scope.students.slice().reverse()
		    	}
		    	



		
		 // 	$scope.sortPerson = function (persontype, sortingProperty) {
		    // 		console.log("about to sort by", sortingProperty)
		    		
		    // 		$scope[personType].sort(function(personA, personB) {
		    // 			console.log(personA[sortingProperty])
		    // 			if (personA[sortingProperty] > personB[sortingProperty]) {
						// 	return -1
						// } else if (personA[sortingProperty] < personB[sortingProperty]) {
						// 	return 1
						// } else if (personA[sortingProperty] === personB[sortingProperty]) {
						// 	return 0
						// }

		    // 		})
		    // 	}




		// Modal display functions (see also the ModalCtrl js file)
				$scope.showListBottomSheet = function($event) {
				    $scope.alert = '';
				    $mdBottomSheet.show({
				      template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
				      controller: 'ListBottomSheetCtrl',
				      targetEvent: $event
				    }).then(function(clickedItem) {
				      $scope.alert = clickedItem.name + ' clicked!';
				    });
				  };
		  
				  $scope.showAdd = function(ev) {
				  	console.log('we are in showAdd')

				    $mdDialog.show({
				      controller: DialogController,
				      templateUrl: '/html/dialogueForm.html',
				      targetEvent: ev,
				    })
				    .then(function(answer) {
				      $scope.alert = 'You said the information was "' + answer + '".';
				    }, function() {
				      $scope.alert = 'You cancelled the dialog.';
				    });
				  };
}]);


app.controller('ListBottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.items = [
    { name: 'Share', icon: 'share' },
    { name: 'Upload', icon: 'upload' },
    { name: 'Copy', icon: 'copy' },
    { name: 'Print this page', icon: 'print' },
  ];
  
  $scope.listItemClick = function($index) {
    var clickedItem = $scope.items[$index];
    $mdBottomSheet.hide(clickedItem);
  };
});

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $scope.step[1] = True 
  };
};

app.directive('userAvatar', function() {
  return {
    replace: true,
    template: '<svg class="user-avatar" viewBox="0 0 128 128" height="64" width="64" pointer-events="none" display="block" > <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg>'
  };
});

app.config(function($mdThemingProvider) {
  var customBlueMap = 		$mdThemingProvider.extendPalette('light-blue', {
    'contrastDefaultColor': 'light',
    'contrastDarkColors': ['50'],
    '50': 'ffffff'
  });
  $mdThemingProvider.definePalette('customBlue', customBlueMap);
  $mdThemingProvider.theme('default')
    .primaryPalette('customBlue', {
      'default': '500',
      'hue-1': '50'
    })
    .accentPalette('pink');
  $mdThemingProvider.theme('input', 'default')
        .primaryPalette('grey')
});
