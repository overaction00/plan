var root = angular.module("root", []);

root.controller("HelloController", function($scope) {
    $scope.name = "Angular!";
    $scope.sayHello = function() {
        $scope.hello = "Hello, " + $scope.name;
    };
});


