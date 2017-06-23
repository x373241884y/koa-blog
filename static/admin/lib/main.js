'use strict';
app.controller('AppCtrl', ['$scope', '$localStorage', function ($scope, $localStorage) {
	$scope.$menuList = Menu;
	$scope.$functions = angular.getFunctions();
	// config
	$scope.app = {
		name: 'x373241884y',
		version: '0.0.1',
		// for chart colors
		color: {
			primary: '#7266ba',
			info: '#23b7e5',
			success: '#27c24c',
			warning: '#fad733',
			danger: '#f05050',
			light: '#e8eff0',
			dark: '#3a3f51',
			black: '#1c2b36'
		},
	settings: {
			themeID: 2,
			navbarHeaderColor: 'bg-white-only',//bg-black
			navbarCollapseColor: 'bg-white-only',
			asideColor: 'bg-black',
			headerFixed: true,
			asideFixed: true,
			asideFolded: false,
			asideDock: false,
			container: false
		}
	};
	$scope.selectItem = function (item) {
		console.log(item);
		if (item.ActionId) {
			$scope.goto('/' + item.ActionId);
		}
		if (item.ActionName === "Home") {
			$scope.goto('/Welcome');
		}
	};

	// save settings to local storage
	if (vx.isDefined($localStorage.settings)) {
		$scope.app.settings = $localStorage.settings;
	} else {
		$localStorage.settings = $scope.app.settings;
	}
	$scope.$watch('app.settings', function () {
		if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
			// aside dock and fixed must set the header fixed.
			$scope.app.settings.headerFixed = true;
		}
		// save to local storage
		$localStorage.settings = $scope.app.settings;
	}, true);
}]);
