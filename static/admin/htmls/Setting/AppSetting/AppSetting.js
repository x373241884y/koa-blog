AppSettingCtrl.$inject = ["$scope", "$remote"];
function AppSettingCtrl($scope, $remote) {
	$scope.startup = function () {
		$scope.doQuery(0, 10);
	};

	$scope.doQuery = function (offset, limit) {
		$remote.post("admin/optionList.do", {
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

	$scope.postOption = function () {
		if($scope.editFlag){
			$scope.editOption();
		}else{
			var pargs = {
				option_name: $scope.option_name,
				option_value: $scope.option_value
			};
			$remote.post("admin/addOption.do", pargs, function (data) {
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
	$scope.editOptionPre=function(row) {
		$scope.editFlag = true;
		$scope.option_id = row.option_id;
		$scope.option_name = row.option_name;
		$scope.option_value = row.option_value;
	};
	$scope.editOption=function() {
		var pargs = {
			option_id: $scope.option_id,
			option_name: $scope.option_name,
			option_value: $scope.option_value
		};
		$remote.post("admin/updateOption.do", pargs, function (data) {
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
	$scope.deleteOption = function (row) {
		var pargs = {
			option_id: row.option_id
		};
		$remote.post("admin/deleteOption.do", pargs, function (data) {
			if (data.success == "ok") {
				$scope.routeRefresh();
			}
		});
	};
}