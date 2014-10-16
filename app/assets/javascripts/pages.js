angular.module("root").controller("PagesController", ["$http", "$scope", function($http, $scope) {
    $scope.index = function() {
        $http.get("/pages").success(function(data, status, header, config){
            $scope.pages = data;
            $scope.show(data[0].id);
        }).error(function(data, status, header, config) {
            $scope.pages = undefined;
        });
    };
    $scope.show = function(id) {
        $http.get("/pages/" + id).success(function(data, status, header, config){
            $scope.page = data;
            $scope.elementsInPage(id)
        }).error(function(data, status, header, config) {
            $scope.page = undefined;
        });
    };
    $scope.elementsInPage = function(pageId) {
        $http.get("/pages/" + pageId + "/elements").success(function(data, status, header, config){
            $scope.elements = data;
        }).error(function(data, status, header, config) {
            $scope.elements = undefined;
        });
    };
}]);