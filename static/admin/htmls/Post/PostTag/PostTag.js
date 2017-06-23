PostTagCtrl.$inject = ["$scope", "$remote", "$location"];
function PostTagCtrl($scope, $remote, $location) {
	$scope.startup = function () {
		$scope.doQuery(0, 10);
	};

	$scope.doQuery = function (offset, limit) {
		$remote.post("admin/getTagList.do", {
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

	$scope.postTag = function () {
		if($scope.editFlag){
			$scope.editTag();
		}else{
			var pargs = {
				name: $scope.name,
				slug: $scope.slug,
				description: $scope.description,
			};
			$remote.post("admin/addTag.do", pargs, function (data) {
				if (data.success == "ok") {
					$scope.$alert({
						title: "success",
						content: "success",
						ok: function () {
							$scope.routeRefresh();
						}
					});
				}
			});
		}
	};
	$scope.editTagPre=function(row) {
		$scope.editFlag = true;
		$scope.term_id = row.term_id;
		$scope.name = row.name;
		$scope.slug = row.slug;
		$scope.description = row.description;
	};
	$scope.editTag=function() {
		var pargs = {
			name: $scope.name,
			slug: $scope.slug,
			description: $scope.description,
		};
		pargs.term_id = $scope.term_id;
		$remote.post("admin/updateTag.do", pargs, function (data) {
			if (data.success == "ok") {
				$scope.$alert({
					title: "success",
					content: "success",
					ok: function () {
						$scope.routeRefresh();
					}
				});
			}
		});
	};
	$scope.deleteTag = function (row) {
		if (row.count != 0) {
			$scope.$confirm({
				title: "错误操作!",
				content: "分类下文章数不为0"
			});
		} else {
			var pargs = {
				term_id: row.term_id
			};
			$remote.post("admin/deleteTag.do", pargs, function (data) {
				if (data.success == "ok") {
					$scope.routeRefresh();
				}
			});
		}
	};
}