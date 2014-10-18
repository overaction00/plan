angular.module("root").controller("ItemsController", ["$http", "$scope", "sharedModelService", function($http, $scope, sharedModelService) {
    $scope.$on('pushBroadcast', function() {
        if (sharedModelService.kind !== "item") {
            return false;
        }
        var name = sharedModelService.model.name;
        var category = sharedModelService.model.category;
        var desc = sharedModelService.model.desc;

        $http.post('/items', {
            page_id: $scope.$parent.currentPageId,
            item: {
                name: name,
                category: category,
                desc: desc
            }
        })
            .success(function(data, status, headers, config) {
                if (!$scope.$parent.items) {
                    $scope.$parent.items = [];
                }
                $scope.$parent.items.push(data);
            }).
            error(function(data, status, headers, config) {
                alert("아이템 등록에 실패: " + status);
            });
    });
}]);

angular.module("root").controller('RegisterItemModalController', function ($scope, $modal, $log) {
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'registerItemModal.html',
            controller: 'ItemModalInstanceController'
        });

        modalInstance.result.then(function () {
            $scope.isOpen = true;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

angular.module("root").controller('ItemModalInstanceController',
    ["$scope", "$modalInstance", "sharedModelService",
    function ($scope, $modalInstance, sharedModelService) {
    $scope.isOpen = false;
    $scope.ok = function () {
        if ($scope.itemName) {
            sharedModelService.pushItem("item", {
                name: $scope.itemName,
                category: $scope.itemCategory,
                desc: $scope.itemDesc
            });
        }
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);