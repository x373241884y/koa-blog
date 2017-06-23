PageListCtrl.$inject = ["$scope", "$remote"];
function PageListCtrl($scope, $remote) {
	$scope.startup = function () {
		$scope.doQuery(0, 10);
	};

	$scope.doQuery = function (offset, limit) {
		$remote.post("admin/PageList.do", {
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

	$scope.editPage=function(row) {
		$scope.goto("/PageEdit/" + row.ID);
	};

	$scope.deletePage = function (row) {
		$scope.$confirm({
			title: "警告!",
			content: "文章删除不可恢复!",
			ok: function () {
				var pargs = {
					post_id: row.ID
				};
				$remote.post("admin/deletePage.do", pargs, function (data) {
					if (data.success == "ok") {
						$scope.routeRefresh();
					}
				});
			}
		});
	};
}