PostCategoryCtrl.$inject = ["$scope", "$remote", "$location"];
function PostCategoryCtrl($scope, $remote, $location) {
	$scope.startup = function () {
		$scope.doQuery(0, 10);
		$remote.post("admin/getAllCategory.do", {}, function (data) {
			$scope.allCategory = data;
		});
	};

	$scope.doQuery = function (offset, limit) {
		$remote.post("admin/getCategoryList.do", {
			offset: offset,
			limit: limit
		}, function (data) {
			$scope.pageModel = {
				offset: data.offset,
				limit: data.limit,
				capacity: data.recordCount,
				List: data.recordList
			};
		})
	};

	$scope.postCategory = function () {
		if($scope.editFlag){
			$scope.editCategory();
		}else{
			var pargs = {
				name: $scope.name,
				slug: $scope.slug,
				parent: $scope.parent,
				description: $scope.description,
			};
			$remote.post("admin/addCategory.do", pargs, function (data) {
				$scope.$alert({
					title: "success",
					content: "success",
					ok: function () {
						$scope.routeRefresh();
					}
				});
			});
		}
	};

	$scope.editCategoryPre = function (row) {
		$scope.editFlag = true;
		$scope.name=row.name;
		$scope.slug=row.slug;
		$scope.parent=row.parent;
		$scope.description=row.description;
		$scope.term_id=row.term_id;
	};
	$scope.editCategory=function() {
		var pargs = {
			name: $scope.name,
			slug: $scope.slug,
			parent: $scope.parent,
			description: $scope.description,
		};
		pargs.term_id = $scope.term_id;
		$remote.post("admin/updateCategory.do", pargs, function (data) {
			$scope.$alert({
				title: "success",
				content: "success",
				ok: function () {
					$scope.routeRefresh();
				}
			});
		});
	};
	$scope.deleteCategory = function (row) {
		if (row.count != 0) {
			$scope.$confirm({
				title: "错误操作" + new Date().getTime(),
				content: "分类下文章数不为0"
			});
		} else {
			var pargs = {
				term_id: row.term_id
			};
			$remote.post("admin/deleteCategory.do", pargs, function (data) {
				if (data.success == "ok") {
					$scope.routeRefresh();
				}
			});
		}
	};
}
