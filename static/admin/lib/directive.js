(function (window, angular) {
	var app = angular.module("app");
	app.directive("uiSlideToggle", function () {
		return {
			restrict: 'A',
			link: function (scope, element) {
				element.bind("click", function (event) {
					var target = event.target, target_link;
					target_link = $(target).parents("a.level1");
					if ($(target_link).hasClass("menu-ctrl")) {
						$(this).find(".menu-nav2").hide();
						$(document.body).toggleClass("folded");
						$(target_link).find("i").toggleClass("icon-circle-arrow-left");
						$(target_link).find("i").toggleClass("icon-circle-arrow-right");
					} else {
						if ($(target_link).hasClass("level1")) {
							var level2_ul = $(target_link).next();
							if (level2_ul.is(":visible")) {
								level2_ul.slideUp();
								$(target_link).removeClass("active");
							} else {
								$(target_link).parent().parent().find("li>a").removeClass("active");
								$(target_link).parent().parent().find("ul.menu-nav2").slideUp();
								$(target_link).parent().find("ul.menu-nav2").slideDown();
								$(target_link).addClass("active");
							}
						} else if ($(target).hasClass("level2")) {
							$(target).parent().parent().children().removeClass("active");
							$(target).parent().addClass("active");
						}
					}

				});
			}
		}
	});
	app.directive('uiToggleClass', ['$timeout', '$document', function ($timeout, $document) {
		return {
			restrict: 'AC',
			link: function (scope, el, attr) {
				el.on('click', function (e) {
					e.preventDefault();
					var classes = attr.uiToggleClass.split(','),
						targets = (attr.target && attr.target.split(',')) || Array(el),
						key = 0;
					vx.forEach(classes, function (_class) {
						var target = targets[(targets.length && key)];
						( _class.indexOf('*') !== -1 ) && magic(_class, target);
						$(target).toggleClass(_class);
						key++;
					});
					$(el).toggleClass('active');

					function magic(_class, target) {
						var patt = new RegExp('\\s' +
							_class.replace(/\*/g, '[A-Za-z0-9-_]+').split(' ').join('\\s|\\s') +
							'\\s', 'g');
						var cn = ' ' + $(target)[0].className + ' ';
						while (patt.test(cn)) {
							cn = cn.replace(patt, ' ');
						}
						$(target)[0].className = $.trim(cn);
					}
				});
			}
		};
	}]);
	app.directive('uiFullscreen', ['$document', '$window', function ($document, $window) {
		return {
			restrict: 'AC',
			template: '<i class="fa fa-expand fa-fw text"></i><i class="fa fa-compress fa-fw text-active"></i>',
			link: function (scope, el, attr) {
				el.addClass('hide');
				if (IsPC()) {
					// disable on ie11
					if (screenfull.enabled && !navigator.userAgent.match(/Trident.*rv:11\./)) {
						el.removeClass('hide');
					}
					el.on('click', function () {
						var target;
						attr.target && ( target = $(attr.target)[0] );
						screenfull.toggle(target);
					});
					//兼容IE9修改
					screenfull.raw && $document.on(screenfull.raw.fullscreenchange, function () {
						if (screenfull.isFullscreen) {
							el.addClass('active');
						} else {
							el.removeClass('active');
						}
					});
				}
				function IsPC() {
					var userAgentInfo = navigator.userAgent;
					var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
					var flag = true;
					for (var v = 0; v < Agents.length; v++) {
						if (userAgentInfo.indexOf(Agents[v]) > 0) {
							flag = false;
							break;
						}
					}
					return flag;
				}

			}
		};
	}]);

})(window, angular);
(function (window, vx, undefined) {
	'use strict';
	var mod = vx.module('app');
	var directive = {};
	directive.uiMenuadmin = ['$parse', '$compile',
		function ($parse, $compile) {
			return {
				restrict: 'A',
				scope: true,
				link: function ($scope, element, attrs, ctrl) {
					// 获得参数
					var menuSource = attrs.uiMenuadmin || "menu", template, itemSelectExp = attrs.itemSelect, fn;
					fn = $parse(itemSelectExp, null, true);
					template = $('<ul class="nav" ui-nav></ul>');
					$scope.$watch(function () {
						return $scope.$eval(menuSource);
					}, function (newValue, oldValue) {
						if (newValue) {
							createMenu(newValue);
							bindEvent(template);
						}
					});
					function createMenu(menus) {
						var firstNode = '<li class="line dk"></li>' +
							'<li class="level1 active">' +
							'   <a class="home"><i class="fa fa-home icon"></i><span>首页</span></a>' +
							'</li>';
						var spaceLine = '<li class="line dk"></li>';
						var nav_ul2, nav_ul3;
						template.append(firstNode);
						vx.forEach(menus, function (temp1, index) {
							var temp_level1, temp_level2, level1_link, level2_link, level3_link, menuList2, menuList3;
							if(temp1.ignore){
								return false;
							}
							temp_level1 = $(spaceLine + "<li class='level1'></li>");
							level1_link = $(
								'<a class="auto"> ' +
								'   <span class="pull-right text-muted"> ' +
								'       <i class="fa fa-fw fa-angle-right text"></i> ' +
								'       <i class="fa fa-fw fa-angle-down text-active"></i> ' +
								'   </span> ' +
								'   <i class="fa fa-' + temp1.icon + ' icon"></i> ' +
								'   <span>' + temp1.ActionName + '</span> ' +
								'</a>');
							temp_level1.append(level1_link);

							menuList2 = temp1.MenuList;
							if (menuList2 && menuList2.length > 0) {
								nav_ul2 = $("<ul style='display: none;' class='nav nav-list2 nav-sub dk'></ul>");
								vx.forEach(menuList2, function (temp2, index) {
									if(temp2.ignore){
										return false;
									}
									temp_level2 = $(spaceLine + "<li class='level2'></li>");
									var hasChild = false;
									menuList3 = temp2.MenuList;
									if (menuList3 && menuList3.length > 0) {
										hasChild = true;
									}
									if (hasChild) {
										level2_link = $(
											'<a class="auto"> ' +
											'   <span class="pull-right text-muted"> ' +
											'       <i class="fa fa-fw fa-angle-down text-active"></i> ' +
											'       <i class="fa fa-fw fa-angle-right text"></i> ' +
											'   </span> ' +
											'   <span>' + temp2.ActionName + '</span> ' +
											'</a>');
									} else {
										level2_link = $('<a class="leaf"><span>' + temp2.ActionName + '</span></a>');
										level2_link.data("$item", temp2);
									}
									temp_level2.append(level2_link);
									nav_ul2.append(temp_level2);
								});
								temp_level1.append(nav_ul2);
							}
							template.append(temp_level1);
						});
						element.append(template);
					}

					function bindEvent(template) {
						// var last;
						//branch
						template.delegate(".level1 >a", "click", function () {
							if ($(this).hasClass("home")) {
								var item = {"ActionName": "Home"};
								var callback = function () {
									fn($scope, {$item: item});
								};
								$scope.$apply(callback);
							} else {
								var ul = $(this).next();
								if (ul.is(":hidden")) {
									ul.show();
									ul.parent().addClass("active");
								} else {
									ul.hide();
									ul.parent().removeClass("active");
								}
							}
						});
						//leaf
						template.delegate(".level2 >a", "click", function () {
							// if (this === last) {
							// 	return false;
							// }
							var item = $(this).data("$item");
							var callback = function () {
								fn($scope, {$item: item});
							};
							$scope.$apply(callback);
							template.find(".level2").removeClass("active");
							$(this).parent().addClass("active");
							// last = this;
						});
					}
				}
			};
		}];
	mod.directive(directive);
})(window, window.vx);

(function (window, angular, undefined) {
	'use strict';
	var directive = {};
	directive.uiPager = ['$log', '$compile', '$rootScope',
		function ($log, $compile, $rootScope) {
			// 设置默认值
			var defaults = {
				pageLimit: 10
				// 最多显示多少页
			};
			return {
				restrict: 'A',
				template: "<div class='pagination'></div>",
				replace: true,
				link: function ($scope, elem, attrs, ctrl) {
					var name = attrs.uiPager;
					var callback = attrs.callback;
					// 监听pager是否改变
					$scope.$watch(function () {
						return $scope[name];
					}, function (newValue, oldValue) {
						// 获取pager数据源
						if (newValue == undefined) {
							return;
						}
						createPager(newValue);
					});
					function createPager(pager) {
						$(elem).empty();
						// 总页数
						var pageCapacity = Math.ceil(pager.capacity / pager.limit);
						// 当前页码
						var curPage = pager.offset / pager.limit + 1;
						if (pageCapacity <= 1 && pager.offset == 0) {
							// 如果没有数据移除分页栏
							return;
						}
						// 显示多少页
						var pageLimit;
						if (pageCapacity > defaults.pageLimit) {
							pageLimit = defaults.pageLimit;
						} else {
							pageLimit = pageCapacity;
						}
						// 首页偏移量
						var pageOffset = curPage - (defaults.pageLimit / 2);
						if (pageOffset + defaults.pageLimit > pageCapacity) {
							pageOffset = pageCapacity - defaults.pageLimit;
						}
						if (pageOffset < 0) {
							pageOffset = 0;
						}
						var ul = $("<ul class='pagination'></ul>");
						var first;
						if (curPage == 1) {
							first = $("<li class='disabled'><a class='disable' href='javascript:void(0);'>首页</a></li>");
						} else {
							first = $("<li><a href='javascript:void(0);' v-click='" + callback + "(" + 0 * pager.limit + ", " + pager.limit + ")'>首页</a></li>");
						}
						ul.append(first);
						var prev;
						if (curPage == 1) {
							prev = $("<li class='disabled'><a class='disable' href='javascript:void(0);'>上一页</a></li>");
						} else {
							prev = $("<li><a href='javascript:void(0);' v-click='" + callback + "(" + (curPage - 2) * pager.limit + ", " + pager.limit + ")'>上一页</a></li>");
						}
						ul.append(prev);
						for (var i = 1; i <= pageLimit; i++) {
							var page;
							if (curPage == (i + pageOffset)) {
								page = "<li class='active'><a href='javascript:void(0);'>" + (i + pageOffset) + "</a></li>";
							} else {
								page = "<li><a href='javascript:void(0);' v-click='" + callback + "(" + (i + pageOffset - 1) * pager.limit + ", " + pager.limit + ")'>" + (i + pageOffset) + "</a></li>";
							}
							ul.append(page);
						}
						var next;
						if (curPage == pageOffset + pageLimit) {
							next = $("<li class='disabled'><a class='disable' href='javascript:void(0);'>下一页</a></li>");
						} else {
							next = $("<li><a href='javascript:void(0);' v-click='" + callback + "(" + curPage * pager.limit + ", " + pager.limit + ")'>下一页</a></li>");
						}
						var last;
						if (curPage == pageCapacity) {
							last = $("<li class='disabled'><a class='disable' href='javascript:void(0);'>尾页</a></li>");
						} else {
							last = $("<li><a href='javascript:void(0);' v-click='" + callback + "(" + (pageCapacity - 1) * pager.limit + ", " + pager.limit + ")'>尾页</a></li>");
						}
						ul.append(next);
						ul.append(last);
						$(elem).append(ul);
						$compile(elem.contents())($scope);
					}

				}
			};
		}];
	angular.module('app').directive(directive);
})(window, window.angular);

(function(window, angular, undefined) {'use strict';
	var directive = {};
	directive.uiCountup = ['$log',
		function($log) {
			return {
				restrict : 'A',
				link : function(scope, element, attrs) {
					var defaults = {
						startval : "0", //开始值
						endval : "1", //结束值
						decimals : "2", //展示小数点后位数
						duration : "2"//持续时间
					};
					if(attrs.countLazy==="true"){
						scope.$watch(attrs.uiCountup,function (newvalue, oldValue) {
							if(newvalue&&newvalue.endval){ //符合要求的数据
								new CountUp($(element).get(0), newvalue.startval, newvalue.endval, newvalue.decimals, newvalue.duration).start();
							}
						})
					}else{
						var params = $.extend({}, defaults, vx.fromJson(attrs.uiCountup || {}));
						//调用方法
						new CountUp($(element).get(0), params.startval, params.endval, params.decimals, params.duration).start();
					}

					function CountUp(target, startVal, endVal, decimals, duration, options) {
						var lastTime = 0;
						var vendors = ['webkit', 'moz', 'ms', 'o'];
						for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
							window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
							window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
						}
						if (!window.requestAnimationFrame) {
							window.requestAnimationFrame = function(callback, element) {
								var currTime = new Date().getTime();
								var timeToCall = Math.max(0, 16 - (currTime - lastTime));
								var id = window.setTimeout(function() {
									callback(currTime + timeToCall);
								}, timeToCall);
								lastTime = currTime + timeToCall;
								return id;
							};
						}
						if (!window.cancelAnimationFrame) {
							window.cancelAnimationFrame = function(id) {
								clearTimeout(id);
							};
						}

						// default options
						this.options = {
							useEasing : true, // toggle easing
							useGrouping : true, // 1,000,000 vs 1000000
							separator : ',', // character to use as a separator
							decimal : '.', // character to use as a decimal
							postFormatter : null // post formatter to run after internal formatting
						};
						// extend default options with passed options object
						for (var key in options) {
							if (options.hasOwnProperty(key)) {
								this.options[key] = options[key];
							}
						}
						if (this.options.separator === '')
							this.options.useGrouping = false;
						if (!this.options.prefix)
							this.options.prefix = '';
						if (!this.options.suffix)
							this.options.suffix = '';

						// this.d = ( typeof target === 'string') ? document.getElementById(target) : target;
						this.d = $(element).get(0);
						this.startVal = Number(startVal);
						this.endVal = Number(endVal);
						this.countDown = (this.startVal > this.endVal);
						this.frameVal = this.startVal;
						this.decimals = Math.max(0, decimals || 0);
						this.dec = Math.pow(10, this.decimals);
						this.duration = Number(duration) * 1000 || 2000;
						var self = this;

						this.version = function() {
							return '1.6.1';
						};

						// Print value to target
						this.printValue = function(value) {
							var result = (!isNaN(value)) ? self.formatNumber(value) : '--';
							if (self.d.tagName == 'INPUT') {
								this.d.value = result;
							} else if (self.d.tagName == 'text' || self.d.tagName == 'tspan') {
								this.d.textContent = result;
							} else {
								this.d.innerHTML = result;
							}
						};

						// Robert Penner's easeOutExpo
						this.easeOutExpo = function(t, b, c, d) {
							return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
						};
						this.count = function(timestamp) {

							if (!self.startTime)
								self.startTime = timestamp;

							self.timestamp = timestamp;

							var progress = timestamp - self.startTime;
							self.remaining = self.duration - progress;

							// to ease or not to ease
							if (self.options.useEasing) {
								if (self.countDown) {
									self.frameVal = self.startVal - self.easeOutExpo(progress, 0, self.startVal - self.endVal, self.duration);
								} else {
									self.frameVal = self.easeOutExpo(progress, self.startVal, self.endVal - self.startVal, self.duration);
								}
							} else {
								if (self.countDown) {
									self.frameVal = self.startVal - ((self.startVal - self.endVal) * (progress / self.duration));
								} else {
									self.frameVal = self.startVal + (self.endVal - self.startVal) * (progress / self.duration);
								}
							}

							// don't go past endVal since progress can exceed duration in the last frame
							if (self.countDown) {
								self.frameVal = (self.frameVal < self.endVal) ? self.endVal : self.frameVal;
							} else {
								self.frameVal = (self.frameVal > self.endVal) ? self.endVal : self.frameVal;
							}

							// decimal
							self.frameVal = Math.floor(self.frameVal * self.dec) / self.dec;

							// format and print value
							self.printValue(self.frameVal);

							// whether to continue
							if (progress < self.duration) {
								self.rAF = requestAnimationFrame(self.count);
							} else {
								if (self.callback)
									self.callback();
							}
						};
						// start your animation
						this.start = function(callback) {
							self.callback = callback;
							self.rAF = requestAnimationFrame(self.count);
							return false;
						};
						// toggles pause/resume animation
						this.pauseResume = function() {
							if (!self.paused) {
								self.paused = true;
								cancelAnimationFrame(self.rAF);
							} else {
								self.paused = false;
								delete self.startTime;
								self.duration = self.remaining;
								self.startVal = self.frameVal;
								requestAnimationFrame(self.count);
							}
						};
						// reset to startVal so animation can be run again
						this.reset = function() {
							self.paused = false;
							delete self.startTime;
							self.startVal = startVal;
							cancelAnimationFrame(self.rAF);
							self.printValue(self.startVal);
						};
						// pass a new endVal and start animation
						this.update = function(newEndVal) {
							cancelAnimationFrame(self.rAF);
							self.paused = false;
							delete self.startTime;
							self.startVal = self.frameVal;
							self.endVal = Number(newEndVal);
							self.countDown = (self.startVal > self.endVal);
							self.rAF = requestAnimationFrame(self.count);
						};
						this.formatNumber = function(nStr) {
							nStr = nStr.toFixed(self.decimals);
							nStr += '';
							var x, x1, x2, rgx;
							x = nStr.split('.');
							x1 = x[0];
							x2 = x.length > 1 ? self.options.decimal + x[1] : '';
							rgx = /(\d+)(\d{3})/;
							if (self.options.useGrouping) {
								while (rgx.test(x1)) {
									x1 = x1.replace(rgx, '$1' + self.options.separator + '$2');
								}
							}
							var value = self.options.prefix + x1 + x2 + self.options.suffix;
							if (self.options.postFormatter != null) {
								value = self.options.postFormatter(value);
							}
							return value;
						};

						// format startVal on initialization
						self.printValue(self.startVal);
					};

				}
			}
		}];
	angular.module('app').directive(directive);
})(window, window.angular);