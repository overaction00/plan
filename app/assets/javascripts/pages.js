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
            $scope.elementsInPage(id);
        }).error(function(data, status, header, config) {
            $scope.page = undefined;
        });
    };
    $scope.elementsInPage = function(pageId) {
        $http.get("/pages/" + pageId + "/elements").success(function(data, status, header, config) {
            $scope.elements = data;
        }).error(function(data, status, header, config) {
            $scope.elements = undefined;
        });
    };
    $scope.$on('pushBroadcast', function() {
        var name = sharedModelService.model.name;
        var desc = sharedModelService.model.desc;

        $http.post('/pages', {page: {name: name, desc: desc}}).
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
            controller: 'ModalInstanceController'
        });

        modalInstance.result.then(function () {
            $scope.isOpen = true;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

angular.module("root").controller('ModalInstanceController',
    ["$scope", "$modalInstance", "sharedModelService",
    function ($scope, $modalInstance, sharedModelService) {
    $scope.isOpen = false;
    $scope.ok = function () {
        if ($scope.pageName) {
            sharedModelService.pushItem({name: $scope.pageName, desc: $scope.pageDesc})
        }
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);