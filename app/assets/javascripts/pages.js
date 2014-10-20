angular.module("root").controller("PagesController", ["$http", "$scope", "sharedModelService", function($http, $scope, sharedModelService) {
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
            $scope.pageItems(id);
            $scope.currentPageId = id;
        }).error(function(data, status, header, config) {
            $scope.page = undefined;
        });
    };
    $scope.pageItems = function(pageId) {
        $http.get("/pages/" + pageId + "/items").success(function(data, status, header, config) {
            $scope.items = data;
        }).error(function(data, status, header, config) {
            $scope.items = undefined;
        });
    };

    $scope.$on('pushBroadcast', function() {
        if (sharedModelService.kind !== "page") {
            return false;
        }
        var name = sharedModelService.model.name;
        var desc = sharedModelService.model.desc;

        $http.post("/pages", {page: {name: name, desc: desc}}).
            success(function(data, status, headers, config) {
                if (!$scope.pages) {
                    $scope.pages = [];
                }
                $scope.pages.push(data);
            }).
            error(function(data, status, headers, config) {
                alert("페이지 등록에 실패: " + status);
            });
    });
}]);

angular.module("root").controller('RegisterPageModalController', function ($scope, $modal, $log) {
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'registerPageModal.html',
            controller: 'PageModalInstanceController'
        });

        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

angular.module("root").controller('PageModalInstanceController',
    ["$scope", "$modalInstance", "sharedModelService",
    function ($scope, $modalInstance, sharedModelService) {
    $scope.ok = function () {
        if ($scope.pageName) {
            sharedModelService.pushItem("page", {name: $scope.pageName, desc: $scope.pageDesc})
        }
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);