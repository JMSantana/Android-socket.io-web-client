'use strict';

angular.module('socketiochat')
.controller('ChatController',
function() {
    var TYPING_TIMER_LENGTH = 400;

    $scope.identification = $stateParams.identification;
    $scope.address = $stateParams.address;
    $scope.port = $stateParams.port;
    //initializing messages array
    $scope.message = {};
    $scope.messages = [];
    $scope.mySocket = null;
    $scope.typing = false;
    $scope.lastTypingTime = null;


});
