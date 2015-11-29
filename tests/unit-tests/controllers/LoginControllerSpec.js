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

        });

        it('should not go to chat page if identification is null', function() {

        });

        it('should not go to chat page if identification is undefined', function() {

        });

        it('should not go to chat page if identification is empty', function() {
            
        });
    });
});
