CommentListCtrl.$inject = ["$scope", "$remote"];
function CommentListCtrl($scope, $remote) {
	$scope.startup = function () {
		$scope.doQuery(0, 10);
	};

	$scope.doQuery = function (offset, limit) {
		$remote.post("admin/commentlist.do", {
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
	$scope.editComment = function (row) {
		$scope.goto('/CommentApprove/' + row.comment_ID);
	};
	$scope.deleteComment = function (row) {
		$scope.$confirm({
			title: "警告!",
			content: "文章删除不可恢复!",
			ok: function () {
				var pargs = {
					comment_ID: row.comment_ID
				};
				$remote.post("admin/deleteComment.do", pargs, function (data) {
					if (data.success == "ok") {
						if ($scope.pageModel.List.length == 1) {
							$scope.range.offset = $scope.range.offset - $scope.range.limit;
						}
						$scope.doQuery($scope.range.offset, $scope.range.limit);
					}
				});
			}
		});
	};
}