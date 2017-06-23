(function (window, angular) {
	angular.module('app').filter('filterPinyin', function () {
		return function (inputArray, key, value) {
			var array = []; //定义返回的新数组；
			if (value == undefined || value == null) {
				array = inputArray; //当过滤条件为空的时候返回全部的内容；
			} else {
				for (var i = 0; i < inputArray.length; i++) {
					var temp = inputArray[i];
					if (temp[key].indexOf(value) != -1) {
						array.push(temp);//过滤第一个字段，如果不符合条件则判断第二个字段
					} else {
						if (window.CC2PY && /^[A-z]+$/.test(value)) {
							var pinyin = window.CC2PY(temp[key]);
							var pinyinStr = pinyin[0];
							if (pinyinStr.indexOf(value.toUpperCase()) == 0) {
								array.push(temp);
							}
						}
					}
				}
			}
			return array;
		}
	});
	angular.module('app').filter('propsFilter', function() {
		return function(items, props) {
			var out = [];

			if (angular.isArray(items)) {
				items.forEach(function(item) {
					var itemMatches = false;

					var keys = Object.keys(props);
					for (var i = 0; i < keys.length; i++) {
						var prop = keys[i];
						var text = props[prop].toLowerCase();
						if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
							itemMatches = true;
							break;
						}
					}

					if (itemMatches) {
						out.push(item);
					}
				});
			} else {
				// Let the output be the input untouched
				out = items;
			}

			return out;
		};
	})
})(window, angular);

(function (window, angular) {
	angular.module('app').filter('cut', function () {
		return function (input, length) {
			return cutMaxTitle(input, length);
		};

		function cutMaxTitle(str, length) {
			if (typeof str == "string") {
				if (str.length > length) {
					return str.substr(0, length) + "...";
				} else {
					return str;
				}
			} else {
				return str;
			}
		}
	});
})(window, angular);