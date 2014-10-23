angular.module("root").controller("PagesController", ["$http", "$scope", "$log", "sharedModelService", function($http, $scope, $log, sharedModelService) {
    $scope.index = function() {
        $http.get("/pages").success(function(data){
            $scope.pages = data;
            $scope.show(data[0].id);
        }).error(function(data, status) {
            alert("페이지 목록을 불러오는데 실패 했습니다.");
            $log.error(status + ": " + data);
            $scope.pages = undefined;
        });
    };
    $scope.show = function(id) {
        $http.get("/pages/" + id).success(function(data){
            $scope.page = data;
            $scope.pageItems(id);
            $scope.currentPageId = id;
        }).error(function(data, status) {
            alert("페이지를 불러오는데 실패 했습니다.");
            $log.error(status + ": " + data);
            $scope.page = undefined;
        });
    };
    $scope.remove = function(id) {
        if (window.confirm("페이지를 삭제할까요?")) {
            $http.delete("/pages/" + id, {
            })
            .success(function(data) {
                $scope.pages = _.without($scope.pages, _.findWhere($scope.pages, { id: data.id }));
            }).error(function(data, status) {
                alert("페이지를 삭제하는데 실패 했습니다.");
                $log.error(status + ": " + data);
            });
        }
    };
    $scope.pageItems = function(pageId) {
        $http.get("/pages/" + pageId + "/items").success(function(data) {
            $scope.items = data;
        }).error(function(data, status) {
            alert("아이템 목록을 불러오는데 실패 했습니다.");
            $log.error(status + ": " + data);
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
            success(function(data) {
                if (!$scope.pages) {
                    $scope.pages = [];
                }
                $scope.pages.push(data);
            }).
            error(function(data, status) {
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
        /** @namespace $scope.pageName */
        /** @namespace $scope.pageDesc */
        if ($scope.pageName) {
            sharedModelService.pushItem("page", {name: $scope.pageName, desc: $scope.pageDesc})
        }
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);