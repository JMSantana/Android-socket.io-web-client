describe('LoginController', function() {

    var controller,
    state,
    scope;

    beforeEach(module('socketiochat'));

    beforeEach(inject(function($controller, $rootScope, $state){
        scope = $rootScope.$new();
        state = $state;
        controller = $controller('LoginController', {
            $scope: scope,
            $state: state
        });
    }));

    describe('LoginController', function() {
        it('should go to chat page', function() {
            // given
            scope.user = { identification: 'test', address: '192.168.1.105', port: '3000' };

            // and
            spyOn(state, 'go');

            // when
            scope.join();

            // then
            expect(state.go).toHaveBeenCalledWith('chat', {
                identification: 'test',
                address: '192.168.1.105',
                port: '3000'
             });
        });

        it('should not go to chat page if identification is null', function() {
            // given
            scope.user = { identification: null, address: '192.168.1.105', port: '3000' };

            // and
            spyOn(state, 'go');

            // when
            scope.join();

            // then
            expect(state.go).not.toHaveBeenCalled();
        });

        it('should not go to chat page if identification is undefined', function() {
            // given
            scope.user = { identification: undefined };

            // and
            spyOn(state, 'go');

            // when
            scope.join();

            // then
            expect(state.go).not.toHaveBeenCalled();
        });

        it('should not go to chat page if identification is empty', function() {
            // given
            scope.user = { identification: '' };

            // and
            spyOn(state, 'go');

            // when
            scope.join();

            // then
            expect(state.go).not.toHaveBeenCalled();
        });
    });
});
