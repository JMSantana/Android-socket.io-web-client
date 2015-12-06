describe('ChatController', function() {

    var controller,
    scope,
    stateParams,
    socket = {},
    ionicScrollDelegate,
    timeout,
    ionicHistory,
    ionicPlatform,
    httpBackend;

    beforeEach(module('socketiochat'));

    beforeEach(function () {
        socket.connectToSocket = function (address, port) {}

        module(function ($provide) {
            $provide.value('socket', socket);
        });
    });

    beforeEach(inject(function($controller, $rootScope, $stateParams, socket,
        $ionicScrollDelegate, $timeout, $ionicHistory, $ionicPlatform, $httpBackend) {
            scope = $rootScope.$new();
            stateParams = $stateParams;
            ionicScrollDelegate = $ionicScrollDelegate;
            timeout = $timeout;
            ionicHistory = $ionicHistory;
            ionicPlatform = $ionicPlatform;
            httpBackend = $httpBackend;
            controller = $controller('ChatController', {
                $scope: scope,
                $stateParams: stateParams,
                $ionicScrollDelegate: ionicScrollDelegate,
                $timeout: timeout,
                $ionicHistory: ionicHistory,
                $ionicPlatform: ionicPlatform,
            });
            scope.mySocket = {
                emit: function (message) {},
                disconnect: function () {},
                on: function () {}
            }
    }));

    describe('ChatController', function() {
        it('should start connection', function() {
            // given
            scope.address = '192.168.1.1';
            scope.port = '1234';

            // and
            spyOn(socket, 'connectToSocket');

            // when
            scope.startConnection();

            // expect
            expect(socket.connectToSocket).toHaveBeenCalledWith('192.168.1.1', '1234');
        });

        it('should send message', function() {
            // given
            scope.identification = 'user';
            scope.message.text = 'message';

            // and
            spyOn(scope, 'addMessageToList');
            spyOn(scope.mySocket, 'emit').and.callFake(function(arg0, arg1) {});

            // when
            scope.sendMessage('test');

            // expect
            expect(scope.mySocket.emit).toHaveBeenCalledWith('new message', 'message');
            expect(scope.addMessageToList).toHaveBeenCalledWith('user', 'message');
            expect(scope.mySocket.emit).toHaveBeenCalledWith('stop typing');
            expect(scope.message.text).toBeFalsy();
        });

        it('should update typing', function() {
            // given
            spyOn(scope, 'sendUpdateTyping');

            // when
            scope.updateTyping();

            // expect
            expect(scope.sendUpdateTyping).toHaveBeenCalled();
        });

        it('should go back', function() {
            // given
            spyOn(scope.mySocket, 'disconnect');
            spyOn(ionicHistory, 'goBack');

            // when
            scope.goBack();

            // expect
            expect(scope.mySocket.disconnect).toHaveBeenCalled();
            expect(ionicHistory.goBack).toHaveBeenCalled();
        });

        it('should add messages to list', function() {
            // given
            scope.messages = [];

            // and
            spyOn(scope, 'removeChatTyping');
            spyOn(ionicScrollDelegate, 'scrollBottom');

            // when
            scope.addMessageToList('user', 'message');

            // expect
            expect(scope.removeChatTyping).toHaveBeenCalledWith('user');
            expect(ionicScrollDelegate.scrollBottom).toHaveBeenCalled();
            expect(scope.messages).toEqual([{content: 'message', username: 'user'}]);
        });

        it('should send update typing and stop typing', function() {
            // given
            scope.connected = true;
            scope.typing = false;
            var alreadyCalled = false;

            // and
            spyOn(scope.mySocket, 'emit').and.callFake(function(arg0) {});
            spyOn(scope.mySocket, 'on').and.callFake(function(arg0) {});
            spyOn(scope, 'getNewDateTime').and.callFake(function() {
                if (alreadyCalled) return 1000;
                alreadyCalled = true;
                return 500;
            });

            // and
            httpBackend.expectGET('templates/login.html').respond(200);
            httpBackend.expectGET('templates/chat.html').respond(200);

            // when
            scope.sendUpdateTyping();

            // and
            timeout.flush();

            // then
            expect(scope.mySocket.emit).toHaveBeenCalledWith('typing');
            expect(scope.mySocket.emit).toHaveBeenCalledWith('stop typing');
            expect(scope.mySocket.on).toHaveBeenCalledWith('connect', jasmine.any(Function));
            expect(scope.typing).toBeFalsy();
        });

        it('should send update typing and not stop typing', function() {
            // given
            scope.connected = true;
            scope.typing = false;
            var alreadyCalled = false;

            // and
            spyOn(scope.mySocket, 'emit').and.callFake(function(arg0) {});
            spyOn(scope, 'getNewDateTime').and.callFake(function() {
                if (alreadyCalled) return 500;
                alreadyCalled = true;
                return 1000;
            });

            // and
            httpBackend.expectGET('templates/login.html').respond(200);
            httpBackend.expectGET('templates/chat.html').respond(200);

            // when
            scope.sendUpdateTyping();

            // and
            timeout.flush();

            // then
            expect(scope.mySocket.emit).toHaveBeenCalledWith('typing');
            expect(scope.mySocket.emit).not.toHaveBeenCalledWith('stop typing');
            expect(scope.typing).toBeTruthy();
        });

        it('should return date time', function() {
            // when
            var time = scope.getNewDateTime();

            // then
            expect(time).toBeTruthy();
        });

        it('should add chat typing', function() {
            // given
            var data = {username: 'user'};

            // and
            spyOn(scope, 'addMessageToList');

            // when
            scope.addChatTyping(data);

            // then
            expect(scope.addMessageToList).toHaveBeenCalledWith('user', ' is typing');
        });

        it('should remove chat typing', function() {
            // given
            var username = 'user0';
            scope.messages = [
                {content: ' is typing', username: 'user0'},
                {content: 'message', username: 'user1'}
            ];

            // when
            scope.removeChatTyping(username);

            // then
            expect(scope.messages).toEqual([{content: 'message', username: 'user1'}]);
        });

        it('should get one participant message', function() {
            // when
            var string = scope.getParticipantsString(1);

            // then
            expect(string).toBe('there\'s 1 participant');
        });

        it('should get many participants message', function() {
            // when
            var string = scope.getParticipantsString(20);

            // then
            expect(string).toBe('there are 20 participants');
        });
    });
});
