'use strict';

angular.module('socketiochat')
.controller('ChatController', ['$scope', '$stateParams', 'socket',
'$ionicScrollDelegate', '$timeout', '$ionicHistory', '$ionicPlatform', 'MediaService',
function($scope, $stateParams, socket,
    $ionicScrollDelegate, $timeout, $ionicHistory, $ionicPlatform, MediaService) {
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

    //initialize connection
    $scope.startConnection = function () {
        $scope.mySocket = socket.connectToSocket($scope.address, $scope.port);

        $timeout(function() {
            $scope.setEvents();
        }, 10);
    }

    $scope.setEvents = function () {
        $scope.mySocket.on('connect', function(){
            //Add user
            $scope.mySocket.emit('add user', $scope.identification);
            // On login display welcome message
            $scope.mySocket.on('login', function (data) {
                //Set the value of connected flag
                $scope.connected = true;
                $scope.messageNumber = $scope.getParticipantsString(data.numUsers);
            });
            // Whenever the server emits 'new message', update the chat body
            $scope.mySocket.on('new message', function (data) {
                if(data.message && data.username)
                {
                    $scope.addMessageToList(data.username, data.message);
                    MediaService.loadMedia('sounds/FacebookSound.mp3').then(function(media){
                        media.play();
                    });
                }
            });
            // Whenever the server emits 'user joined', log it in the chat body
            $scope.mySocket.on('user joined', function (data) {
                $scope.addMessageToList("", data.username + " joined");
                $scope.addMessageToList("", $scope.getParticipantsString(data.numUsers));
            });
            // Whenever the server emits 'user left', log it in the chat body
            $scope.mySocket.on('user left', function (data) {
                $scope.addMessageToList("", data.username + " left");
                $scope.addMessageToList("", $scope.getParticipantsString(data.numUsers));
            });
            //Whenever the server emits 'typing', show the typing message
            $scope.mySocket.on('typing', function (data) {
                $scope.addChatTyping(data);
            });
            // Whenever the server emits 'stop typing', kill the typing message
            $scope.mySocket.on('stop typing', function (data) {
                $scope.removeChatTyping(data.username);
            });
        })
    }

    //function called when user hits the send button
    $scope.sendMessage = function(){
        $scope.mySocket.emit('new message', $scope.message.text);
        $scope.addMessageToList($scope.identification, $scope.message.text);
        $scope.mySocket.emit('stop typing');
        $scope.message.text = "";
    }
    //function called on Input Change
    $scope.updateTyping = function(){
        $scope.sendUpdateTyping();
    }

    $scope.goBack = function() {
        $scope.mySocket.disconnect();
        $ionicHistory.goBack();
    };

    // Display message by adding it to the message list
    $scope.addMessageToList = function (username, message) {
        $scope.removeChatTyping(username);
        $scope.messages.push({content:message, username:username});
        $ionicScrollDelegate.scrollBottom();
    }
    // Updates the typing event
    $scope.sendUpdateTyping = function () {
        if($scope.connected){
            if (!$scope.typing) {
                $scope.typing = true;
                $scope.mySocket.emit('typing');
            }
        }
        $scope.lastTypingTime = $scope.getNewDateTime();
        $timeout(function () {
            var typingTimer = $scope.getNewDateTime();
            var timeDiff = typingTimer - $scope.lastTypingTime;
            if (timeDiff >= TYPING_TIMER_LENGTH && $scope.typing) {
                $scope.mySocket.emit('stop typing');
                $scope.typing = false;
            }
        }, TYPING_TIMER_LENGTH)
    }

    $scope.getNewDateTime = function () {
        return (new Date()).getTime();
    }

    // Adds the visual chat typing message
    $scope.addChatTyping = function(data) {
        $scope.addMessageToList(data.username, " is typing");
    }

    // Removes the visual chat typing message
    $scope.removeChatTyping = function(username) {
        $scope.messages = $scope.messages.filter(function(element){
            return element.username != username || element.content != " is typing"
        })
    }

    // Return message string depending on the number of users
    $scope.getParticipantsString = function(usersNumber) {
        return usersNumber === 1 ? "there's 1 participant" : "there are " + usersNumber + " participants";
    }

    $ionicPlatform.onHardwareBackButton(function() {
        $scope.mySocket.disconnect();
    });

    $scope.startConnection();
}]);
