angular.module("root").controller("ItemsController", ["$http", "$scope", "sharedModelService", function($http, $scope, sharedModelService) {
    $scope.$on('pushBroadcast', function() {
        if (sharedModelService.kind !== "item") {
            return false;
        }
        var name = sharedModelService.model.name;
        var category = sharedModelService.model.category;
        var desc = sharedModelService.model.desc;
        var isNewItem = sharedModelService.model.isNewItem;

        var url = isNewItem ? "/items" : "/pages/" + $scope.$parent.currentPageId + "/add_item";

        $http.post(url, {
            page_id: $scope.$parent.currentPageId,
            is_new_item: isNewItem,
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
    $scope.init = function() {
        $scope.isNewItem = false;
    };
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'registerItemModal.html',
            controller: 'ItemModalInstanceController'
        });
        modalInstance.result.then(function () {

        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
});

angular.module("root").controller('ItemModalInstanceController',
    ["$scope", "$http", "$modalInstance", "limitToFilter", "sharedModelService",
    function ($scope, $http, $modalInstance, limitToFilter, sharedModelService) {
    $scope.searchResults = [];
    $scope.searchNames = function(q) {
        return $http.get("/search_items?q=" + q).then(function(response){
            $scope.searchResults = response.data;
            return response.data.map(function(item){
                return item.name;
            });
        });
    };
    $scope.onSelect = function($item) {
        for (var i = 0; i < $scope.searchResults.length; i++) {
            var current = $scope.searchResults[i];
            if (current.name == $item) {
                $scope.itemName = current.name;
                $scope.itemCategory = current.category;
                $scope.itemDesc = current.desc;
            }
        }
    };
    $scope.ok = function () {
        if ($scope.itemName) {
            sharedModelService.pushItem("item", {
                name: $scope.itemName,
                category: $scope.itemCategory,
                desc: $scope.itemDesc,
                isNewItem: $scope.isNewItem
            });
        }
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.setIsNewItem = function(setValue) {
        $scope.$parent.isNewItem = setValue;
    }
}]);
