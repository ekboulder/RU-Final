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

angular.module('ui.bootstrap')
	.controller('ModalCtrl', function ($scope, $uibModal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {
    var modalInstance = $uibModal.open({
	      animation			: true,
	      templateUrl		: '/html/signInModal.html',
	      controller		: 'ModalInstanceCtrl',
	      size				: size,
	      resolve			: {
						        items: function () {
						          return $scope.items;
						        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('ui.bootstrap')
	.controller('ModalInstanceCtrl', function ($timeout, $scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
   // below is jquery code from http://bootsnipp.com/snippets/featured/login-and-register-tabbed-form
   // used for the animating signInModal
   //added $timeout for jqueery to wait for the form elements and their id.
  	$timeout(function(){
  		console.log($('#login-form-link')[0])
        $('#login-form-link').click(function(e) {
        	console.log('two')
    		$("#login-form").delay(100).fadeIn(100);
     		$("#register-form").fadeOut(100);
    		$('#register-form-link').removeClass('active');
    		$(this).addClass('active');
    		e.preventDefault();
    	});
    	$('#register-form-link').click(function(e) {
    		console.log('three')
    		$("#register-form").delay(100).fadeIn(100);
     		$("#login-form").fadeOut(100);
    		$('#login-form-link').removeClass('active');
    		$(this).addClass('active');
    		e.preventDefault();
    	});


  	})
});