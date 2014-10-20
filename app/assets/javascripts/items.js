angular.module("root").controller("ItemsController",
    ["$http", "$scope", "$modal", "$log", "sharedModelService",
    function($http, $scope, $modal, $log, sharedModelService) {
    $scope.init = function() {
        $scope.checkedItemList = [];
        $scope.isNewItem = false;
    };
    $scope.checkItem = function(id) {
        var index = _.indexOf($scope.checkedItemList, id);
        if (index >= 0) {
            $scope.checkedItemList.splice(index, 1);
        } else {
            $scope.checkedItemList.push(id);
        }
    };
    $scope.removeItems = function() {
        if ($scope.checkedItemList.length <= 0) {
            return false;
        }
        $http.delete("/pages/" + $scope.$parent.currentPageId + "/remove_items", {
            params: {
                page_id: $scope.$parent.currentPageId,
                item_ids: JSON.stringify($scope.checkedItemList)
            }
        })
        .success(function(data, status, headers, config) {
            _.each(data, function(e) {
                $scope.$parent.items = _.without($scope.$parent.items, _.findWhere($scope.$parent.items, {id: e.item_id}));
            });
            $scope.checkedItemList = [];
        }).
        error(function(data, status, headers, config) {
            alert("아이템 삭제에 실패: " + status);
        });
    };
    $scope.$on('pushBroadcast', function() {
        if (sharedModelService.kind !== "item") {
            return false;
        }
        var name = sharedModelService.model.name;
        var category = sharedModelService.model.category;
        var desc = sharedModelService.model.desc;
        var isNewItem = sharedModelService.model.isNewItem;

        var url = isNewItem ? "/items" : "/pages/" + $scope.$parent.currentPageId + "/add_item";

        function containsObjectAttr(arr, attrName, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][attrName] === value) {
                    return i;
                }
            }
            return -1;
        }

        if (!isNewItem && containsObjectAttr($scope.$parent.items, "name", name) >= 0) {
            alert("Already contains item name: " + name);
            return false;
        }

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
    $scope.modalOpen = function () {
        var modalInstance = $modal.open({
            templateUrl: 'registerItemModal.html',
            controller: 'ItemModalInstanceController'
        });
        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

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
        $modalInstance.dismiss("cancel");
    };
    $scope.setIsNewItem = function(setValue) {
        $scope.$parent.isNewItem = setValue;
    };
}]);
