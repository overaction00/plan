angular.module("root").controller("PageController", ["$http", "$scope", "$stateParams", "$log", "sharedModelService", function($http, $scope, $stateParams, $log, sharedModelService) {
    $scope.show = function(id) {
        $scope.pagesPromise =  $http.get("/api/pages/" + id);
    };
    $scope.remove = function(id) {
        if (window.confirm("페이지를 삭제할까요?")) {
            $http.delete("/api/pages/" + id, {
            })
            .success(function(data) {
                $scope.pages = _.without($scope.pages, _.findWhere($scope.pages, { id: data.id }));
            }).error(function(data, status) {
                alert("페이지를 삭제하는데 실패 했습니다.");
                $log.error(status + ": " + data);
            });
        }
    };
    $scope.$on("createPage", function() {
        var name = sharedModelService.obj.name;
        var desc = sharedModelService.obj.desc;

        $http({
            url: "/api/pages",
            method: "POST",
            params: {
                page: {
                    name: name,
                    desc: desc
                }
            }
        })
        .success(function(data) {
            if (!$scope.items) {
                $scope.items = [];
            }
            $scope.pages.push(data);
        }).
        error(function(data, status) {
            alert("아이템 등록에 실패: " + status);
        });
    });
    $scope.$parent.currentPageId = $stateParams.id;
    $scope.show($stateParams.id);
    $scope.pagesPromise.then(function(response){
        $scope.page = response.data;
    }, function(response) {
        alert("페이지를 불러오는데 실패 했습니다.");
        $log.error(status + ": " + response.data);
        $scope.page = undefined;
    });
}]);

angular.module("root").controller("PageItemController", ["$http", "$scope", "$modal", "$state", "$stateParams", "$log", function($http, $scope, $modal, $state, $stateParams, $log) {
    $scope.mode = "append";
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: "registerItemModal.html",
            controller: "CreateItemModalController",
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

angular.module("root").controller('CreateItemModalController',
    ["$scope", "$http", "$modalInstance", "sharedModelService",
    function ($scope, $http, $modalInstance, sharedModelService) {
    $scope.searchResults = [];

    $scope.searchNames = function(q) {
        return $http.get("/api/search_items?q=" + q).then(function(response){
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
        var msg = $scope.mode === "create" ? "createItem" : "appendItem";
        sharedModelService.requestBroadcast(msg, {
            id: $scope.itemId,
            name: $scope.itemName,
            category: $scope.itemCategory,
            desc: $scope.itemDesc,
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
            }
            $modalInstance.dismiss("bug: not reachable");
        }
        $modalInstance.dismiss("bug: not reachable");
    };
    $scope.cancel = function () {
        $modalInstance.dismiss("cancel");
    };
    $scope.setMode = function(mode) {
        $scope.clearFields();
        $scope.$parent.mode = mode;
    };
    $scope.isEditable = function() {
        return $scope.mode === "create";
    };
    $scope.clearFields = function() {
        $scope.itemId = "";
        $scope.itemName = "";
        $scope.itemCategory = "";
        $scope.itemDesc = "";
        $scope.itemSearch = "";
    };
    $scope.$on("$stateChangeStart",  function() {
        $modalInstance.dismiss("change page");
    });
}]);