PostListCtrl.$inject = ["$scope", "$remote"];
function PostListCtrl($scope, $remote) {
	$scope.startup = function () {
		$scope.doQuery(0, 10);
	};

	$scope.doQuery = function (offset, limit) {
		$remote.post("admin/postList.do", {
			offset: offset,
			limit: limit
		}, function (data) {
			$scope.pageModel = {
				offset: data.offset,
				limit: data.limit,
				capacity: data.recordCount,
				List: data.recordList
			};
		});
		$scope.range = {
			offset: offset,
			limit: limit,
		};
	};
	$scope.editPost = function (post) {
		$scope.goto("/PostEdit/" + post.ID);
	};
	$scope.deletePost = function (post) {
		$scope.$confirm({
			title: "警告!",
			content: "文章删除不可恢复!",
			ok: function () {
				var pargs = {
					post_id: post.ID
				};
				$remote.post("admin/deletePost.do", pargs, function (data) {
					if (data.success == "ok") {
						if($scope.pageModel.List.length==1){
							$scope.range.offset = $scope.range.offset - $scope.range.limit;
						}
						$scope.doQuery($scope.range.offset, $scope.range.limit);
					}
				});
			}
		});
	};
}
