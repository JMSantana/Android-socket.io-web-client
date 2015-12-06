'use strict';

angular.module('socketiochat')
.factory('socket', function(socketFactory){

    return {
        connectToSocket: function (address, port) {
            //Create socket and connect to http://chat.socket.io
            var myIoSocket = io.connect('http://' + address + ':' + port);

            var mySocket = socketFactory({
                ioSocket: myIoSocket
            });

            return mySocket;
        }
    };
})
