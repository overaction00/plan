describe('CONTROLLERS: HelloController', function() {
    // Load the module with MainController
    beforeEach(module('root'));

    var ctrl, scope;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        // Create the controller
        ctrl = $controller('HelloController', {
            $scope: scope
        });
    }));
    it('should create $scope.hello when calling sayHello',
        function() {
            expect(scope.hello).toBeUndefined();
            scope.sayHello();
            expect(scope.hello).toEqual("Hello, Angular!");
        }
    );
});