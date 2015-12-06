'use strict';
angular.module('socketiochat')
.controller('LoginController', ['$scope', '$state', function($scope, $state) {
    $scope.user = { address: '192.168.1.105', port: '3000' };

    $scope.join = function() {
        if($scope.user.identification)
        {
            $state.go('chat', {
                identification: $scope.user.identification,
                address: $scope.user.address,
                port: $scope.user.port
             })
        }
    }
}]);
