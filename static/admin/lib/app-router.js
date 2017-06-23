(function (window) {
	//生成路由和菜单
	window.Menu = [
		{
			"ActionName": "文章",
			"Level": "1",
			"root": "Post",
			"icon": "file-text",
			"MenuList": [
				{
					"ActionName": "写文章",
					"Level": "2",
					"ActionId": "PostAdd"
				},
				{
					"ActionName": "文章分类",
					"Level": "2",
					"ActionId": "PostCategory"
				},
				{
					"ActionName": "所有文章",
					"Level": "2",
					"ActionId": "PostList"
				},
				{
					"ActionName": "文章标签",
					"Level": "2",
					"ActionId": "PostTag"
				},
				{
					"ActionName": "编辑文章",
					"Level": "2",
					"ActionId": "PostEdit",
					"RouteUrl": "/PostEdit/:PostId"
				}
			]
		},
		{
			"ActionName": "页面",
			"Level": "1",
			"root": "Page",
			"icon": "file-text-o",
			"MenuList": [
				{
					"ActionName": "所有页面",
					"Level": "2",
					"ActionId": "PageList"
				}, {
					"ActionName": "新建页面",
					"Level": "2",
					"ActionId": "PageAdd"
				}, {
					"ActionName": "编辑页面",
					"Level": "2",
					"ActionId": "PageEdit",
					"RouteUrl": "/PageEdit/:PostId"
				}
			]
		},
		{
			"ActionName": "评论",
			"Level": "1",
			"root": "Comment",
			"icon": "comment",
			"MenuList": [
				{
					"ActionName": "评论列表",
					"Level": "2",
					"ActionId": "CommentList"
				}, {
					"ActionName": "评论审核",
					"Level": "2",
					"ActionId": "CommentApprove",
					"RouteUrl": "/CommentApprove/:CommentId"
				}
			]
		},
		{
			"ActionName": "用户",
			"Level": "1",
			"root": "User",
			"icon": "users",
			"MenuList": [
				{
					"ActionName": "用户添加",
					"Level": "2",
					"ActionId": "UserAdd"
				},
				{
					"ActionName": "所有用户",
					"Level": "2",
					"ActionId": "UserList"
				},
				{
					"ActionName": "用户信息",
					"Level": "2",
					"ActionId": "UserInfo"
				},
				{
					"ActionName": "用户编辑",
					"Level": "2",
					"ActionId": "UserEdit",
					"RouteUrl": "/UserEdit/:UserId"
				}
			]
		},
		{
			"ActionName": "设置",
			"Level": "1",
			"root": "Setting",
			"icon": "cog",
			"MenuList": [
				{
					"ActionName": "应用设置",
					"Level": "2",
					"ActionId": "AppSetting"
				},
				{
					"ActionName": "个性设置",
					"Level": "2",
					"ActionId": "PersonSetting"
				}
			]

		}
	];
	//菜单生成导航数组
	window.Breadcrumb = (function () {
		var arraylist = [];

		function getBreadcrumb(base, Menu) {
			if (!base) {
				base = [];
				base.push("Home");
			}
			for (var i = 0; i < Menu.length; i++) {
				var temp_node = Menu[i];
				if (temp_node.MenuList && temp_node.MenuList.length > 0) {
					var base2 = base.slice(0);
					base2.push(temp_node.ActionName);
					getBreadcrumb(base2, temp_node.MenuList);
				} else {
					var base2 = base.slice(0);
					base2.push(temp_node.ActionName);

					arraylist.push({
						bread: base2.splice(0),
						RouteUrl: temp_node.RouteUrl ? temp_node.RouteUrl : "/" + temp_node.ActionId
					});
				}
			}
		}

		getBreadcrumb(null, Menu);
		return arraylist;
	})();
	//通过路由定位导航
	window.getBread = function (routeUrl) {
		for (var i = 0; i < window.Breadcrumb.length; i++) {
			var temp = window.Breadcrumb[i];
			if (routeUrl == temp.RouteUrl) {
				return temp.bread;
			}
		}
	};
})(window);


(function (window, angular, undefined) {
	'use strict';
	app.config(config);
	config.$inject = ['$routeProvider', '$httpProvider', '$locationProvider', '$controllerProvider', "$compileProvider", "$filterProvider", "$provide"];
	function config($routeProvider, $httpProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
		app.register = {
			controller: $controllerProvider.register,
			directive: $compileProvider.directive,
			filter: $filterProvider.register,
			factory: $provide.factory,
			service: $provide.service
		};
		$controllerProvider.allowGlobals();

		$routeProvider.otherwise({
			redirectTo: "/Welcome"
		});

		$routeProvider.when("/Welcome", {
			templateUrl: 'htmls/Welcome/Welcome.html'
		});
		//遍历菜单生成路由
		function registerRoute(base, Menu) {
			base = base || "htmls";
			for (var i = 0; i < Menu.length; i++) {
				var temp_node = Menu[i];
				if (temp_node.MenuList && temp_node.MenuList.length > 0) {
					registerRoute(base + "/" + temp_node.root, temp_node.MenuList);
				} else {
					if (temp_node.RouteUrl) {
						temp_node.ignore = true;
						$routeProvider.when(temp_node.RouteUrl, {
							templateUrl: base + "/" + temp_node.ActionId + "/" + temp_node.ActionId + ".html"
						});
					} else {
						$routeProvider.when("/" + temp_node.ActionId, {
							templateUrl: base + "/" + temp_node.ActionId + "/" + temp_node.ActionId + ".html"
						});
						functions.push(Menu[i]);
					}
				}
			}
		}

		var functions = [];
		angular.getFunctions = function () {
			return functions;
		};
		registerRoute(null, Menu);
	};

})(window, angular);

