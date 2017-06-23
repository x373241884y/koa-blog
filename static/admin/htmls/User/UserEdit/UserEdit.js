UserEditCtrl.$inject = ["$scope", "$remote","$routeParams"];
function UserEditCtrl($scope, $remote,$routeParams) {
	$scope.startup = function () {
		if ($routeParams.UserId) {
			$scope.UserId = $routeParams.UserId;
			var pargs = {
				UserId: $scope.UserId
			};
			$remote.post("admin/getUser.do", pargs, function (data) {
				$scope.userinfo = data;
				$scope.user_login=data.user_login;
				$scope.display_name=data.display_name;
				$scope.user_nicename=data.user_nicename;
				$scope.user_url=data.user_url;
				$scope.user_email=data.user_email;
			});
		}
	};

	$scope.userEdit = function () {
		var pargs = {
			user_id:$scope.UserId,
			user_login: $scope.user_login,
			oldpassword: $scope.oldpassword,
			newpassword: $scope.newpassword,
			display_name: $scope.display_name,
			user_nicename: $scope.user_nicename,
			user_url: $scope.user_url,
			user_email: $scope.user_email
		};
		$remote.post("admin/updateUser.do", pargs, function (data) {
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