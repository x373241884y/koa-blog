UserListCtrl.$inject = ["$scope", "$remote"];
function UserListCtrl($scope, $remote) {
	$scope.startup = function () {
		$scope.doQuery(0, 10);
	};

	$scope.doQuery = function (offset, limit) {
		$remote.post("admin/userList.do", {
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
	$scope.editUser=function(row){
		$scope.goto('/UserEdit/' + row.ID);
	};
	$scope.deleteUser = function (row) {
		$scope.$confirm({
			title: "警告!",
			content: "文章删除不可恢复!",
			ok: function () {
				var pargs = {
					user_login: row.user_login
				};
				$remote.post("admin/deleteUser.do", pargs, function (data) {
					if (data.success == "ok") {
						$scope.routeRefresh();
					}
				});
			}
		});
	};
}