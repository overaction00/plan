var root = angular.module("root", ['ui.bootstrap']);

root.config([
    "$httpProvider", function($httpProvider) {
        var csrfToken = $('meta[name=csrf-token]').attr("content");
        console.log(csrfToken);
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = csrfToken;
        $httpProvider.defaults.headers.post['X-CSRF-Token'] = csrfToken;
        $httpProvider.defaults.headers.put['X-CSRF-Token'] = csrfToken;
        $httpProvider.defaults.headers.patch['X-CSRF-Token'] = csrfToken;
//        $httpProvider.defaults.headers.delete['X-CSRF-Token'] = csrfToken;
    }
]);

root.controller("HelloController", function($scope) {
    $scope.name = "Angular!";
    $scope.sayHello = function() {
        $scope.hello = "Hello, " + $scope.name;
    };
});

root.factory('sharedModelService', function($rootScope) {
    var sharedModelService = {};
    sharedModelService.model = "";
    sharedModelService.pushItem = function(msg) {
        this.model = msg;
        this.broadcastPushItem();
    };
    sharedModelService.broadcastPushItem = function() {
        $rootScope.$broadcast('pushBroadcast');
    };
    return sharedModelService;
});


