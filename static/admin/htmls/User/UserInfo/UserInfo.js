UserInfoCtrl.$inject = ["$scope", "$remote"];
function UserInfoCtrl($scope, $remote) {
	$scope.startup = function () {
		var pargs = {};
		$remote.post("admin/getLoginInfo.do", pargs, function (data) {
			$scope.userinfo = data;
		});
	};

}