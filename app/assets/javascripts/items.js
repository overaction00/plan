angular.module("root").controller("ItemController",
    ["$http", "$scope", "$state", "$stateParams", "$modal", "$log", "sharedModelService",
    function($http, $scope, $state, $stateParams, $modal, $log, sharedModelService) {
    $scope.pageItems = function(pageId) {
        $scope.pageItemsPromise = $http.get("/api/pages/" + pageId + "/items");
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
        $http.delete("/api/pages/" + $scope.currentPageId + "/remove_items", {
            params: {
                page_id: $scope.currentPageId,
                item_ids: JSON.stringify($scope.checkedItemList)
            }
        })
        .success(function(data) {
            _.each(data, function(e) {
                /** @namespace e.item_id */
                $scope.items = _.without($scope.items, _.findWhere($scope.items, {id: e.item_id}));
            });
            $scope.checkedItemList = [];
        }).
        error(function(data, status) {
            alert("아이템 삭제에 실패: " + status);
        });
    };
    $scope.$on("createItem", function() {
        var id = sharedModelService.obj.id;
        var name = sharedModelService.obj.name;
        var category = sharedModelService.obj.category;
        var desc = sharedModelService.obj.desc;
        var pageId = sharedModelService.obj.pageId;

        $http({
            url: "/api/items",
            method: "POST",
            params: {
                page_id: pageId,
                item: {
                    id: id,
                    name: name,
                    category: category,
                    desc: desc
                }
            }
        })
        .success(function(data) {
            if (!$scope.items) {
                $scope.items = [];
            }
            $scope.items.push(data);
        }).
        error(function(data, status) {
            alert("아이템 등록에 실패: " + status);
        });
    });
    $scope.$on("appendItem", function() {
        var id = sharedModelService.obj.id;
        var name = sharedModelService.obj.name;
        var category = sharedModelService.obj.category;
        var desc = sharedModelService.obj.desc;
        var pageId = sharedModelService.obj.pageId;

        function containsObjectAttr(arr, attrName, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][attrName] === value) {
                    return i;
                }
            }
            return -1;
        }

        if (containsObjectAttr($scope.items, "name", name) >= 0) {
            alert("Already contains item name: " + name);
            return false;
        }

        $http({
            url: "/api/pages/" + $scope.currentPageId + "/add_item",
            method: "POST",
            params: {
                page_id: pageId,
                item: {
                    id: id,
                    name: name,
                    category: category,
                    desc: desc
                }
            }
        })
        .success(function(data) {
            if (!$scope.items) {
                $scope.items = [];
            }
            $scope.items.push(data);
        }).
        error(function(data, status) {
            alert("아이템 등록에 실패: " + status);
        });
    });
    $scope.$on("updateItem", function() {
        var id = sharedModelService.obj.id;
        var name = sharedModelService.obj.name;
        var category = sharedModelService.obj.category;
        var desc = sharedModelService.obj.desc;
        var pageId = sharedModelService.obj.pageId;

        $http({
            url: "/api/items/" + id,
            method: "PUT",
            params: {
                page_id: pageId,
                item: {
                    id: id,
                    name: name,
                    category: category,
                    desc: desc
                }
            }
        })
        .success(function(data) {
            if (!$scope.items) {
                $scope.items = [];
                $scope.items.push(data);
            } else {
                for (var i = 0; i < $scope.items.length; i++) {
                    var e = $scope.items[i];
                    if (e.id === data.id) {
                        $scope.items[i] = data;
                    }
                }
            }

        }).
        error(function(data, status) {
            alert("아이템 등록에 실패: " + status);
        });
    });
    $scope.modalOpen = function(itemId) {
        $state.go("page.editItem", {id: $scope.currentPageId, itemId: itemId});
    };
    $scope.pageItems($stateParams.id);
    $scope.pageItemsPromise.then(function(response) {
        $scope.items = response.data;
    }, function(response) {
        alert("아이템 목록을 불러오는데 실패 했습니다.");
        $log.error(status + ": " + response.status);
        $scope.items = undefined;
    });
    $scope.checkedItemList = [];
}]);

angular.module("root").controller("ItemEditController", ["$http", "$scope", "$modal", "$state", "$stateParams", "$log", function($http, $scope, $modal, $state, $stateParams, $log) {
    $scope.mode = "update";
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: "registerItemModal.html",
            controller: "EditItemModalController",
            scope: $scope
        });
        modalInstance.result.then(function () {
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
            $state.go("page", {id: $stateParams.id});
        });
    };
    $scope.open();
}]);

angular.module("root").controller('EditItemModalController',
    ["$scope", "$http", "$modalInstance", "$stateParams", "sharedModelService",
    function ($scope, $http, $modalInstance, $stateParams, sharedModelService) {
    $scope.ok = function () {
        sharedModelService.requestBroadcast("updateItem", {
            id: $scope.itemId,
            name: $scope.itemName,
            category: $scope.itemCategory,
            desc: $scope.itemDesc,
            mode: $scope.mode,
            pageId: $scope.currentPageId
        });
        $modalInstance.dismiss("ok");
    };

    $scope.remove = function() {
        if ($scope.itemId) {
            if (window.confirm("아이템을 삭제 할까요?")) {
                $scope.removeItem($scope.itemId);
                $modalInstance.dismiss("remove");
                return true;
            } else {
                return false;
            }
        }
        $modalInstance.dismiss("bug: not reachable");
    };
    $scope.cancel = function () {
        $modalInstance.dismiss("cancel");
    };
    $scope.isEditable = function() {
        return true;
    };
    $scope.$on("$stateChangeStart",  function() {
        $modalInstance.dismiss("change page");
    });
    $scope.init = function() {
        $scope.pageItemsPromise.then(function() {
            $scope.item = _.findWhere($scope.items, {id: Number($stateParams.itemId)});
            $scope.itemId = $scope.item.id;
            $scope.itemName = $scope.item.name;
            $scope.itemCategory = $scope.item.category;
            $scope.itemDesc = $scope.item.desc;
        });
    };
    $scope.init();
}]);
