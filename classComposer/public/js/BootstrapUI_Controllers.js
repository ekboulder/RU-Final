angular.module('ui.bootstrap')
	.controller('CarouselCtrl', function ($scope) {
		  $scope.myInterval = 5000;
		  $scope.noWrapSlides = false;
		  $scope.slides = [ //move to server side in order to protect.
		  		{
		  			image	: '/imgs/kumbaya.jpeg',
		  			text	: 'This is a text test',
		  			button	: 'Regiter',
		  		},
		  		{
		  			image	: '/imgs/happyandengaged.jpeg',
		  			text	: 'This is a second text test',
		  			button	: 'Contact us',
		  		}
		  ];
	});