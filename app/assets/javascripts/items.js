angular.module("root").controller("ItemsController",
    ["$http", "$scope", "$modal", "$log", "sharedModelService",
    function($http, $scope, $modal, $log, sharedModelService) {
    $scope.init = function() {
        $scope.checkedItemList = [];
        $scope.mode = "create"; // create, update, append
    };
    $scope.checkItem = function(e, id) {
        e.stopPropagation();
        var index = _.indexOf($scope.checkedItemList, id);
        if (index >= 0) {
            $scope.checkedItemList.splice(index, 1);
        } else {
            $scope.checkedItemList.push(id);
        }
    };
    $scope.removeItem = function(id) {
        $scope.checkedItemList = [id];
        $scope.removeItems();
    };
    $scope.removeSelectedItems = function() {
        if (window.confirm("선택한 아이템을 삭제 할까요?")) {
            $scope.removeItems();
            return true;
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
        .success(function(data) {
            _.each(data, function(e) {
                /** @namespace e.item_id */
                $scope.$parent.items = _.without($scope.$parent.items, _.findWhere($scope.$parent.items, {id: e.item_id}));
            });
            $scope.checkedItemList = [];
        }).
        error(function(data, status) {
            alert("아이템 삭제에 실패: " + status);
        });
    };
    $scope.$on('pushBroadcast', function() {
        if (sharedModelService.kind !== "item") {
            return false;
        }
        function containsObjectAttr(arr, attrName, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][attrName] === value) {
                    return i;
                }
            }
            return -1;
        }
        var id = sharedModelService.model.id;
        var name = sharedModelService.model.name;
        var category = sharedModelService.model.category;
        var desc = sharedModelService.model.desc;
        var mode = sharedModelService.model.mode;
        var url = (mode === "append") ?
            "/pages/" + $scope.$parent.currentPageId + "/add_item" :
            (mode === "create") ? "/items" : "/items/" + id;

        if (mode === "append" && containsObjectAttr($scope.$parent.items, "name", name) >= 0) {
            alert("Already contains item name: " + name);
            return false;
        }

        $http({
            url: url,
            method: ($scope.mode === "update") ? "PUT" : "POST",
            params: {
                page_id: $scope.$parent.currentPageId,
                is_new_item: ($scope.mode === "create"),
                item: {
                    id: id,
                    name: name,
                    category: category,
                    desc: desc
                }
            }
        })
        .success(function(data) {
            if (!$scope.$parent.items) {
                $scope.$parent.items = [];
            }
            if ($scope.mode === "update") {
                for (var i = 0; i < $scope.$parent.items.length; i++) {
                    if ($scope.$parent.items[i].id === data.id) {
                        $scope.$parent.items[i] = data;
                    }
                }
            } else {
                $scope.$parent.items.push(data);
            }
        }).
        error(function(data, status) {
            alert("아이템 등록에 실패: " + status);
        });
    });
    $scope.modalOpen = function (mode, id) {
        $scope.mode = mode;
        if (typeof id !== "undefined") {
            $scope.selectedItem = _.findWhere($scope.$parent.items, {id: id});
        }
        var modalInstance = $modal.open({
            templateUrl: 'registerItemModal.html',
            controller: 'ItemModalInstanceController',
            scope: $scope,
            resolve: {
                selectedItem: function () {
                    return $scope.selectedItem;
                }
            }
        });
        modalInstance.result.then(function () {
            $scope.selectedItem = undefined;
        }, function () {
            $scope.selectedItem = undefined;
            $log.info('Modal dismissed at: ' + new Date());
        });

    };
}]);

angular.module("root").controller('ItemModalInstanceController',
    ["$scope", "$http", "$modalInstance", "limitToFilter", "sharedModelService", "selectedItem",
    function ($scope, $http, $modalInstance, limitToFilter, sharedModelService, selectedItem) {
    $scope.searchResults = [];

    if (selectedItem) {
        $scope.itemId = selectedItem.id;
        $scope.itemName = selectedItem.name;
        $scope.itemCategory = selectedItem.category;
        $scope.itemDesc = selectedItem.desc;
    }
    $scope.searchNames = function(q) {
        return $http.get("/search_items?q=" + q).then(function(response){
            $scope.searchResults = response.data;
            return response.data.map(function(item){
                return item.name;
            });
        });
    };
    $scope.onTypeAHeadSelect = function($item) {
        for (var i = 0; i < $scope.searchResults.length; i++) {
            var current = $scope.searchResults[i];
            if (current.name == $item) {
                $scope.itemId = current.id;
                $scope.itemName = current.name;
                $scope.itemCategory = current.category;
                $scope.itemDesc = current.desc;
            }
        }
    };
    $scope.ok = function () {
        if ($scope.itemName) {
            sharedModelService.pushItem("item", {
                id: $scope.itemId,
                name: $scope.itemName,
                category: $scope.itemCategory,
                desc: $scope.itemDesc,
                mode: $scope.mode
            });
        }
        $modalInstance.close();
    };
    $scope.remove = function() {
        if ($scope.itemId) {
            if (window.confirm("아이템을 삭제 할까요?")) {
                $scope.removeItem($scope.itemId);
                $modalInstance.dismiss("remove");
                return true;
            }
            $modalInstance.dismiss("bug: not reachable");
        }
        $modalInstance.dismiss("bug: not reachable");
    };
    $scope.cancel = function () {
        $scope.clearFields();
        $modalInstance.dismiss("cancel");
    };
    $scope.setMode = function(mode) {
        $scope.clearFields();
        $scope.mode = mode;
    };
    $scope.isEditable = function() {
        return $scope.mode === "create" || $scope.mode === "update";
    };
    $scope.clearFields = function() {
        $scope.itemId = "";
        $scope.itemName = "";
        $scope.itemCategory = "";
        $scope.itemDesc = "";
        $scope.itemSearch = "";
    };
}]);
