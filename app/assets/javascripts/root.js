var root = angular.module("root", ["ui.bootstrap", "ui.router"]);

root.config([
    "$httpProvider", function($httpProvider) {
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr("content");
    }
]);

root.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state("page", {
            url: "/pages/:id",
            templateUrl: "/assets/pages/page.html",
            controller: "PageController"
        })
        .state("page.newItem", {
            url: "/items/new",
            templateUrl: "/assets/pages/page.item.html",
            controller: "PageItemController"
        })
        .state("page.editItem", {
            url: "/items/:itemId/edit",
            templateUrl: "/assets/pages/page.item.html",
            controller: "ItemEditController"
        });
});

root.controller("RootController", ["$scope", "$http", "$state","$modal", "$log", function($scope, $http, $state, $modal, $log) {
    $scope.index = function() {
        $http.get("/api/pages").success(function(data){
            $scope.currentPageId = data[0].id;
            $scope.pages = data;
        }).error(function(data, status) {
            alert("페이지 목록을 불러오는데 실패 했습니다.");
            $log.error(status + ": " + data);
            $scope.pages = undefined;
        });
    };
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: "registerPageModal.html",
            controller: "CreatePageModalController"
        });
        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.index();
}]);

angular.module("root").controller("CreatePageModalController", ["$scope", "$modalInstance", "sharedModelService", function($scope, $modalInstance, sharedModelService) {
    $scope.ok = function() {
        /** @namespace $scope.pageName */
        /** @namespace $scope.pageDesc */
        sharedModelService.requestBroadcast("createPage", {
            name: $scope.pageName,
            desc: $scope.pageDesc
        });
        $modalInstance.dismiss("ok");
    };
    $scope.cancel = function() {
        $modalInstance.dismiss("cancel");
    };
}]);

root.controller("HelloController", function($scope) {
    $scope.name = "Angular!";
    $scope.sayHello = function() {
        $scope.hello = "Hello, " + $scope.name;
    };
});

root.factory('sharedModelService', function($rootScope) {
    var sharedModelService = {};
    sharedModelService.model = {};
    sharedModelService.requestBroadcast = function(msg, object) {
        this.obj = object;
        this.broadcast(msg);
    };
    sharedModelService.broadcast = function(msg) {
        $rootScope.$broadcast(msg);
    };
    return sharedModelService;
});