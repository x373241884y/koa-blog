UserAddCtrl.$inject = ["$scope", "$remote"];
function UserAddCtrl($scope, $remote) {
	$scope.startup = function () {

	};

	$scope.userAdd = function () {
		var pargs = {
			user_login: $scope.user_login,
			user_pass: $scope.user_pass,
			display_name: $scope.display_name,
			user_nicename: $scope.user_nicename,
			user_url: $scope.user_url,
			user_email: $scope.user_email,
		};
		$remote.post("admin/addUser.do", pargs, function (data) {
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
}