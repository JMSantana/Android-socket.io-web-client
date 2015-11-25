describe('ChatController', function() {

    var controller,
    scope;

    beforeEach(module('socketiochat'));

    beforeEach(inject(function($controller, $rootScope, $stateParams, socket,
        $ionicScrollDelegate, $timeout, $ionicHistory, $ionicPlatform, $httpBackend) {
            scope = $rootScope.$new();
            controller = $controller('ChatController', {
                $scope: scope,
            });
            scope.mySocket = {
                emit: function (message) {},
                disconnect: function () {},
                on: function () {}
            }
    }));
});
