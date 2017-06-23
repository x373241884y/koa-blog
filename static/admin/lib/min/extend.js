//remote service
(function (window, angular) {
	var ng = angular.module("ng");

	angular.extend(angular, {
		isUndefined: function (value) {
			return "undefined" == typeof value;
		},
		isEmpty: function (value) {
			return angular.isUndefined(value) || "" === value || null === value || value !== value;
		},

	});
	ng.config(["$provide", "$compileProvider", function ($provide, $compileProvider, $filterProvider) {

		$provide.provider({
			$remote: $remoteProvider
		});
		$compileProvider.directive({});
	}]);
	function $remoteProvider() {
		var service = {
			errorTag: "$error",
			config: {},
			ServerContext: "",
			getFailDataFn: null,
			sendBeforeFn: null,
			sendAfterFn: null,
			setErrorCallback: function (fn) {
				this.filterErrorFn = fn;
			},
			setSendBeforeFn: function (fn) {
				this.sendBeforeFn = fn;
			},
			setSendAfterFn: function (fn) {
				this.sendAfterFn = fn;
			},
			setErrorTag: function (tag) {
				this.errorTag = tag;
			},
			setServerContext: function (prefix) {
				window.ServerContent = this.ServerContext = prefix;
			}
		}, $minErr = angular.$$minErr("$remoteErr");
		angular.extend(this, service);

		this.$get = ['$http', '$log', function ($http, $log) {

			var now = Date.now,
				that = this,
				errorTag = this.errorTag,
				filterErrorFn = this.filterErrorFn;

			function preHandle(config) {
				var url = config.url;
				if (url.indexOf("/") != 0) {
					config.url = this.ServerContext + '/' + url;
				}
			}

			function proxy(method, url, data, okFn, errorFn, config) {
				config = angular.extend(config || {}, {
					method: method,
					headers:{
						"x-requested-with":"XMLHttpRequest"
					},
					url: url,
					data: data
				});

				preHandle.apply(that, [config]);

				var start = now();

				that.sendBeforeFn && that.sendBeforeFn(config);
				$log.debug('remote ' + method + ': ' + url + ( data ? ', with data: ' + angular.toJson(data) : ''));
				$http(config).then(function (response) {
					if (response.data && response.status >= 200 && 300 > response.status) {
						success(response.data, response.status, response.headers, config);
					} else {
						fail(response.data, response.status, response.headers, config);
					}
				}, function (response) {
					fail(response.data, response.status, response.headers, config);
				}).then(function sendAfter() {
					that.sendAfterFn && that.sendAfterFn(config);
				});

				function success(data, status, headers, config) {
					//success: status[200, 300)
					var flag = false, error;
					if (typeof errorTag == "function") {
						flag = errorTag(data, status, headers, config) || false;
					} else {
						flag = data[errorTag] || false;
					}
					if (flag) {
						if (errorFn) {
							error = errorFn(data, status, headers, config);
						} else {
							error = filterErrorFn && filterErrorFn(data, status, headers, config);
						}
					}
					if (error) {
						$log.error('remote receive(' + (now() - start) + 'ms): ' + url + ', with error: ' + angular.toJson(error));
					} else {
						$log.debug('remote receive(' + (now() - start) + 'ms): ' + url + ( data ? ', with data: ' + angular.toJson(data) : ''));
						okFn && okFn(data);
					}
				}

				function fail(data, status, headers, config) {
					$log.error('remote receive(' + (now() - start) + 'ms): ' + url + ', with error: ' + angular.toJson(data));
					if (errorFn) {
						errorFn(data, status, headers, config);
					} else {
						filterErrorFn && filterErrorFn(data, status, headers, config);
					}

				}
			}

			return {
				post: function (url, params, okFn, errFn, config) {
					proxy("POST", url, params, okFn, errFn, config);
				},
				get: function (url, params, okFn, errFn, config) {
					proxy("GET", url, params, okFn, errFn, config);
				}
			};


		}];
	}

})(window, window.angular);