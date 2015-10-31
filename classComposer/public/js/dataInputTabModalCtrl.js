angular.module('ngMaterial')
  .controller('dialogueCtrl', function($scope, $mdDialog) {
  
  $scope.status = '  ';

  $scope.showTabDialog = function(ev) {
      $mdDialog.show({
      controller: DialogController,
      templateUrl: '/html/dataInputTabModal.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false,
    })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
  };


});