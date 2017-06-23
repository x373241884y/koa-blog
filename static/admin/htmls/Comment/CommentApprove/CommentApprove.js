CommentApproveCtrl.$inject = ["$scope", "$remote", "$routeParams"];
function CommentApproveCtrl($scope, $remote, $routeParams) {
	$scope.startup = function () {
		if ($routeParams.CommentId) {

			$scope.CommentId = $routeParams.CommentId;
			var pargs = {
				comment_ID: $scope.CommentId
			};
			$remote.post("admin/getComment.do", pargs, function (data) {
				$scope.comment = data;
				console.log(data);
			});
		} else {
			$scope.goto('/CommentList');
		}
	};

	$scope.ApproveResolve = function (flag) {
		if (flag) {
			$scope.comment.comment_approved = 1;
		} else {
			$scope.comment.comment_approved = 2;
		}
		$remote.post("admin/commentApprove.do", $scope.comment, function (data) {
			if (data.success == "ok") {
				$scope.$alert({
					title: "审核成功！",
					content: "审核评论成功！",
					ok: function () {
						$scope.routeRefresh();
					}
				});
			}
		});

	};

}