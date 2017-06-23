(function (window, document, undefined) {
    'use strict';
    function minErr(module, ErrorConstructor) {
        ErrorConstructor = ErrorConstructor || Error;
        return function () {
            var code = arguments[0],
                prefix = '[' + (module ? module + ':' : '') + code + '] ',
                template = arguments[1],
                templateArgs = arguments,
                message, i;
            message = prefix + template.replace(/\{\d+\}/g, function (match) {
                    var index = +match.slice(1, -1), arg;
                    if (index + 2 < templateArgs.length) {
                        return toDebugString(templateArgs[index + 2]);
                    }
                    return match;
                });
            message = message + '\nhttp://errors.angularjs.org/1.3.20/' +
                (module ? module + '/' : '') + code;
            for (i = 2; i < arguments.length; i++) {
                message = message + (i == 2 ? '?' : '&') + 'p' + (i - 2) + '=' +
                    encodeURIComponent(toDebugString(arguments[i]));
            }
            return new ErrorConstructor(message);
        };
    }

    var REGEX_STRING_REGEXP = /^\/(.+)\/([a-z]*)$/;
    var VALIDITY_STATE_PROPERTY = 'validity';
    var lowercase = function (string) {
        return isString(string) ? string.toLowerCase() : string;
    };
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var uppercase = function (string) {
        return isString(string) ? string.toUpperCase() : string;
    };
    var manualLowercase = function (s) {
        return isString(s)
            ? s.replace(/[A-Z]/g, function (ch) {
            return String.fromCharCode(ch.charCodeAt(0) | 32);
        })
            : s;
    };
    var manualUppercase = function (s) {
        return isString(s)
            ? s.replace(/[a-z]/g, function (ch) {
            return String.fromCharCode(ch.charCodeAt(0) & ~32);
        })
            : s;
    };
    if ('i' !== 'I'.toLowerCase()) {
        lowercase = manualLowercase;
        uppercase = manualUppercase;
    }
    var
        msie,
        jqLite,
        jQuery,
        slice = [].slice,
        splice = [].splice,
        push = [].push,
        toString = Object.prototype.toString,
        ngMinErr = minErr('ng'),
        angular = window.angular || (window.angular = {}),
        angularModule,
        uid = 0;
    window.vx=angular;
    msie = document.documentMode;
    function isArrayLike(obj) {
        if (obj == null || isWindow(obj)) {
            return false;
        }
        var length = "length" in Object(obj) && obj.length;
        if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
            return true;
        }
        return isString(obj) || isArray(obj) || length === 0 ||
            typeof length === 'number' && length > 0 && (length - 1) in obj;
    }

    function forEach(obj, iterator, context) {
        var key, length;
        if (obj) {
            if (isFunction(obj)) {
                for (key in obj) {
                    if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            } else if (isArray(obj) || isArrayLike(obj)) {
                var isPrimitive = typeof obj !== 'object';
                for (key = 0, length = obj.length; key < length; key++) {
                    if (isPrimitive || key in obj) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            } else if (obj.forEach && obj.forEach !== forEach) {
                obj.forEach(iterator, context, obj);
            } else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key, obj);
                    }
                }
            }
        }
        return obj;
    }

    function sortedKeys(obj) {
        return Object.keys(obj).sort();
    }

    function forEachSorted(obj, iterator, context) {
        var keys = sortedKeys(obj);
        for (var i = 0; i < keys.length; i++) {
            iterator.call(context, obj[keys[i]], keys[i]);
        }
        return keys;
    }

    function reverseParams(iteratorFn) {
        return function (value, key) {
            iteratorFn(key, value);
        };
    }

    function nextUid() {
        return ++uid;
    }

    function setHashKey(obj, h) {
        if (h) {
            obj.$$hashKey = h;
        } else {
            delete obj.$$hashKey;
        }
    }

    function extend(dst) {
        var h = dst.$$hashKey;
        for (var i = 1, ii = arguments.length; i < ii; i++) {
            var obj = arguments[i];
            if (obj) {
                var keys = Object.keys(obj);
                for (var j = 0, jj = keys.length; j < jj; j++) {
                    var key = keys[j];
                    dst[key] = obj[key];
                }
            }
        }
        setHashKey(dst, h);
        return dst;
    }

    function int(str) {
        return parseInt(str, 10);
    }

    function inherit(parent, extra) {
        return extend(Object.create(parent), extra);
    }

    function noop() {
    }

    noop.$inject = [];
    function identity($) {
        return $;
    }

    identity.$inject = [];
    function valueFn(value) {
        return function () {
            return value;
        };
    }

    function isUndefined(value) {
        return typeof value === 'undefined';
    }

    function isDefined(value) {
        return typeof value !== 'undefined';
    }

    function isObject(value) {
        return value !== null && typeof value === 'object';
    }

    function isString(value) {
        return typeof value === 'string';
    }

    function isNumber(value) {
        return typeof value === 'number';
    }

    function isDate(value) {
        return toString.call(value) === '[object Date]';
    }

    var isArray = Array.isArray;

    function isFunction(value) {
        return typeof value === 'function';
    }

    function isRegExp(value) {
        return toString.call(value) === '[object RegExp]';
    }

    function isWindow(obj) {
        return obj && obj.window === obj;
    }

    function isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch;
    }

    function isFile(obj) {
        return toString.call(obj) === '[object File]';
    }

    function isFormData(obj) {
        return toString.call(obj) === '[object FormData]';
    }

    function isBlob(obj) {
        return toString.call(obj) === '[object Blob]';
    }

    function isBoolean(value) {
        return typeof value === 'boolean';
    }

    function isPromiseLike(obj) {
        return obj && isFunction(obj.then);
    }

    var trim = function (value) {
        return isString(value) ? value.trim() : value;
    };
    var escapeForRegexp = function (s) {
        return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
            replace(/\x08/g, '\\x08');
    };

    function isElement(node) {
        return !!(node &&
        (node.nodeName
        || (node.prop && node.attr && node.find)));
    }

    function makeMap(str) {
        var obj = {}, items = str.split(","), i;
        for (i = 0; i < items.length; i++)
            obj[items[i]] = true;
        return obj;
    }

    function nodeName_(element) {
        return lowercase(element.nodeName || (element[0] && element[0].nodeName));
    }

    function includes(array, obj) {
        return Array.prototype.indexOf.call(array, obj) != -1;
    }

    function arrayRemove(array, value) {
        var index = array.indexOf(value);
        if (index >= 0)
            array.splice(index, 1);
        return value;
    }

    function copy(source, destination, stackSource, stackDest) {
        if (isWindow(source) || isScope(source)) {
            throw ngMinErr('cpws',
                "Can't copy! Making copies of Window or Scope instances is not supported.");
        }
        if (!destination) {
            destination = source;
            if (source) {
                if (isArray(source)) {
                    destination = copy(source, [], stackSource, stackDest);
                } else if (isDate(source)) {
                    destination = new Date(source.getTime());
                } else if (isRegExp(source)) {
                    destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
                    destination.lastIndex = source.lastIndex;
                } else if (isObject(source)) {
                    var emptyObject = Object.create(Object.getPrototypeOf(source));
                    destination = copy(source, emptyObject, stackSource, stackDest);
                }
            }
        } else {
            if (source === destination) throw ngMinErr('cpi',
                "Can't copy! Source and destination are identical.");
            stackSource = stackSource || [];
            stackDest = stackDest || [];
            if (isObject(source)) {
                var index = stackSource.indexOf(source);
                if (index !== -1) return stackDest[index];
                stackSource.push(source);
                stackDest.push(destination);
            }
            var result;
            if (isArray(source)) {
                destination.length = 0;
                for (var i = 0; i < source.length; i++) {
                    result = copy(source[i], null, stackSource, stackDest);
                    if (isObject(source[i])) {
                        stackSource.push(source[i]);
                        stackDest.push(result);
                    }
                    destination.push(result);
                }
            } else {
                var h = destination.$$hashKey;
                if (isArray(destination)) {
                    destination.length = 0;
                } else {
                    forEach(destination, function (value, key) {
                        delete destination[key];
                    });
                }
                for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                        result = copy(source[key], null, stackSource, stackDest);
                        if (isObject(source[key])) {
                            stackSource.push(source[key]);
                            stackDest.push(result);
                        }
                        destination[key] = result;
                    }
                }
                setHashKey(destination, h);
            }
        }
        return destination;
    }

    function shallowCopy(src, dst) {
        if (isArray(src)) {
            dst = dst || [];
            for (var i = 0, ii = src.length; i < ii; i++) {
                dst[i] = src[i];
            }
        } else if (isObject(src)) {
            dst = dst || {};
            for (var key in src) {
                if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
                    dst[key] = src[key];
                }
            }
        }
        return dst || src;
    }

    function equals(o1, o2) {
        if (o1 === o2) return true;
        if (o1 === null || o2 === null) return false;
        if (o1 !== o1 && o2 !== o2) return true;
        var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
        if (t1 == t2) {
            if (t1 == 'object') {
                if (isArray(o1)) {
                    if (!isArray(o2)) return false;
                    if ((length = o1.length) == o2.length) {
                        for (key = 0; key < length; key++) {
                            if (!equals(o1[key], o2[key])) return false;
                        }
                        return true;
                    }
                } else if (isDate(o1)) {
                    if (!isDate(o2)) return false;
                    return equals(o1.getTime(), o2.getTime());
                } else if (isRegExp(o1)) {
                    return isRegExp(o2) ? o1.toString() == o2.toString() : false;
                } else {
                    if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) ||
                        isArray(o2) || isDate(o2) || isRegExp(o2)) return false;
                    keySet = {};
                    for (key in o1) {
                        if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
                        if (!equals(o1[key], o2[key])) return false;
                        keySet[key] = true;
                    }
                    for (key in o2) {
                        if (!keySet.hasOwnProperty(key) &&
                            key.charAt(0) !== '$' &&
                            o2[key] !== undefined && !isFunction(o2[key])) return false;
                    }
                    return true;
                }
            }
        }
        return false;
    }

    var csp = function () {
        if (isDefined(csp.isActive_)) return csp.isActive_;
        var active = !!(document.querySelector('[ng-csp]') ||
        document.querySelector('[data-ng-csp]'));
        if (!active) {
            try {
                new Function('');
            } catch (e) {
                active = true;
            }
        }
        return (csp.isActive_ = active);
    };

    function concat(array1, array2, index) {
        return array1.concat(slice.call(array2, index));
    }

    function sliceArgs(args, startIndex) {
        return slice.call(args, startIndex || 0);
    }

    function bind(self, fn) {
        var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
        if (isFunction(fn) && !(fn instanceof RegExp)) {
            return curryArgs.length
                ? function () {
                return arguments.length
                    ? fn.apply(self, concat(curryArgs, arguments, 0))
                    : fn.apply(self, curryArgs);
            }
                : function () {
                return arguments.length
                    ? fn.apply(self, arguments)
                    : fn.call(self);
            };
        } else {
            return fn;
        }
    }

    function toJsonReplacer(key, value) {
        var val = value;
        if (typeof key === 'string' && key.charAt(0) === '$' && key.charAt(1) === '$') {
            val = undefined;
        } else if (isWindow(value)) {
            val = '$WINDOW';
        } else if (value && document === value) {
            val = '$DOCUMENT';
        } else if (isScope(value)) {
            val = '$SCOPE';
        }
        return val;
    }

    function toJson(obj, pretty) {
        if (typeof obj === 'undefined') return undefined;
        if (!isNumber(pretty)) {
            pretty = pretty ? 2 : null;
        }
        return JSON.stringify(obj, toJsonReplacer, pretty);
    }

    function fromJson(json) {
        return isString(json)
            ? JSON.parse(json)
            : json;
    }

    function startingTag(element) {
        element = jqLite(element).clone();
        try {
            element.empty();
        } catch (e) {
        }
        var elemHtml = jqLite('<div>').append(element).html();
        try {
            return element[0].nodeType === NODE_TYPE_TEXT ? lowercase(elemHtml) :
                elemHtml.
                    match(/^(<[^>]+>)/)[1].
                    replace(/^<([\w\-]+)/, function (match, nodeName) {
                        return '<' + lowercase(nodeName);
                    });
        } catch (e) {
            return lowercase(elemHtml);
        }
    }

    function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch (e) {
        }
    }

    function parseKeyValue(/**string*/keyValue) {
        var obj = {}, key_value, key;
        forEach((keyValue || "").split('&'), function (keyValue) {
            if (keyValue) {
                key_value = keyValue.replace(/\+/g, '%20').split('=');
                key = tryDecodeURIComponent(key_value[0]);
                if (isDefined(key)) {
                    var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
                    if (!hasOwnProperty.call(obj, key)) {
                        obj[key] = val;
                    } else if (isArray(obj[key])) {
                        obj[key].push(val);
                    } else {
                        obj[key] = [obj[key], val];
                    }
                }
            }
        });
        return obj;
    }

    function toKeyValue(obj) {
        var parts = [];
        forEach(obj, function (value, key) {
            if (isArray(value)) {
                forEach(value, function (arrayValue) {
                    parts.push(encodeUriQuery(key, true) +
                        (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
                });
            } else {
                parts.push(encodeUriQuery(key, true) +
                    (value === true ? '' : '=' + encodeUriQuery(value, true)));
            }
        });
        return parts.length ? parts.join('&') : '';
    }

    function encodeUriSegment(val) {
        return encodeUriQuery(val, true).
            replace(/%26/gi, '&').
            replace(/%3D/gi, '=').
            replace(/%2B/gi, '+');
    }

    function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).
            replace(/%40/gi, '@').
            replace(/%3A/gi, ':').
            replace(/%24/g, '$').
            replace(/%2C/gi, ',').
            replace(/%3B/gi, ';').
            replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
    }

    var ngAttrPrefixes = ['ng-', 'data-ng-', 'ng:', 'x-ng-','v-', 'data-v-', 'v:', 'x-v-'];

    function getNgAttribute(element, ngAttr) {
        var attr, i, ii = ngAttrPrefixes.length;
        element = jqLite(element);
        for (i = 0; i < ii; ++i) {
            attr = ngAttrPrefixes[i] + ngAttr;
            if (isString(attr = element.attr(attr))) {
                return attr;
            }
        }
        return null;
    }

    function angularInit(element, bootstrap) {
        var appElement,
            module,
            config = {};
        forEach(ngAttrPrefixes, function (prefix) {
            var name = prefix + 'app';
            if (!appElement && element.hasAttribute && element.hasAttribute(name)) {
                appElement = element;
                module = element.getAttribute(name);
            }
        });
        forEach(ngAttrPrefixes, function (prefix) {
            var name = prefix + 'app';
            var candidate;
            if (!appElement && (candidate = element.querySelector('[' + name.replace(':', '\\:') + ']'))) {
                appElement = candidate;
                module = candidate.getAttribute(name);
            }
        });
        if (appElement) {
            config.strictDi = getNgAttribute(appElement, "strict-di") !== null;
            bootstrap(appElement, module ? [module] : [], config);
        }
    }

    function bootstrap(element, modules, config) {
        if (!isObject(config)) config = {};
        var defaultConfig = {
            strictDi: false
        };
        config = extend(defaultConfig, config);
        var doBootstrap = function () {
            element = jqLite(element);
            if (element.injector()) {
                var tag = (element[0] === document) ? 'document' : startingTag(element);
                throw ngMinErr(
                    'btstrpd',
                    "App Already Bootstrapped with this Element '{0}'",
                    tag.replace(/</, '&lt;').replace(/>/, '&gt;'));
            }
            modules = modules || [];
            modules.unshift(['$provide', function ($provide) {
                $provide.value('$rootElement', element);
            }]);
            if (config.debugInfoEnabled) {
                modules.push(['$compileProvider', function ($compileProvider) {
                    $compileProvider.debugInfoEnabled(true);
                }]);
            }
            modules.unshift('ng');
            var injector = createInjector(modules, config.strictDi);
            injector.invoke(['$rootScope', '$rootElement', '$compile', '$injector',
                    function bootstrapApply(scope, element, compile, injector) {
                        scope.$apply(function () {
                            element.data('$injector', injector);
                            compile(element)(scope);
                        });
                    }]
            );
            return injector;
        };
        var NG_ENABLE_DEBUG_INFO = /^NG_ENABLE_DEBUG_INFO!/;
        var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
        if (window && NG_ENABLE_DEBUG_INFO.test(window.name)) {
            config.debugInfoEnabled = true;
            window.name = window.name.replace(NG_ENABLE_DEBUG_INFO, '');
        }
        if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
            return doBootstrap();
        }
        window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
        angular.resumeBootstrap = function (extraModules) {
            forEach(extraModules, function (module) {
                modules.push(module);
            });
            return doBootstrap();
        };
        if (isFunction(angular.resumeDeferredBootstrap)) {
            angular.resumeDeferredBootstrap();
        }
    }

    function reloadWithDebugInfo() {
        window.name = 'NG_ENABLE_DEBUG_INFO!' + window.name;
        window.location.reload();
    }

    function getTestability(rootElement) {
        var injector = angular.element(rootElement).injector();
        if (!injector) {
            throw ngMinErr('test',
                'no injector found for element argument to getTestability');
        }
        return injector.get('$$testability');
    }

    var SNAKE_CASE_REGEXP = /[A-Z]/g;

    function snake_case(name, separator) {
        separator = separator || '_';
        return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    }

    var bindJQueryFired = false;
    var skipDestroyOnNextJQueryCleanData;

    function bindJQuery() {
        var originalCleanData;
        if (bindJQueryFired) {
            return;
        }
        jQuery = window.jQuery;
        if (jQuery && jQuery.fn.on) {
            jqLite = jQuery;
            extend(jQuery.fn, {
                scope: JQLitePrototype.scope,
                isolateScope: JQLitePrototype.isolateScope,
                controller: JQLitePrototype.controller,
                injector: JQLitePrototype.injector,
                inheritedData: JQLitePrototype.inheritedData
            });
            originalCleanData = jQuery.cleanData;
            jQuery.cleanData = function (elems) {
                var events;
                if (!skipDestroyOnNextJQueryCleanData) {
                    for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                        events = jQuery._data(elem, "events");
                        if (events && events.$destroy) {
                            jQuery(elem).triggerHandler('$destroy');
                        }
                    }
                } else {
                    skipDestroyOnNextJQueryCleanData = false;
                }
                originalCleanData(elems);
            };
        } else {
            jqLite = JQLite;
        }
        angular.element = jqLite;
        bindJQueryFired = true;
    }

    function assertArg(arg, name, reason) {
        if (!arg) {
            throw ngMinErr('areq', "Argument '{0}' is {1}", (name || '?'), (reason || "required"));
        }
        return arg;
    }

    function assertArgFn(arg, name, acceptArrayAnnotation) {
        if (acceptArrayAnnotation && isArray(arg)) {
            arg = arg[arg.length - 1];
        }
        assertArg(isFunction(arg), name, 'not a function, got ' +
            (arg && typeof arg === 'object' ? arg.constructor.name || 'Object' : typeof arg));
        return arg;
    }

    function assertNotHasOwnProperty(name, context) {
        if (name === 'hasOwnProperty') {
            throw ngMinErr('badname', "hasOwnProperty is not a valid {0} name", context);
        }
    }

    function getter(obj, path, bindFnToScope) {
        if (!path) return obj;
        var keys = path.split('.');
        var key;
        var lastInstance = obj;
        var len = keys.length;
        for (var i = 0; i < len; i++) {
            key = keys[i];
            if (obj) {
                obj = (lastInstance = obj)[key];
            }
        }
        if (!bindFnToScope && isFunction(obj)) {
            return bind(lastInstance, obj);
        }
        return obj;
    }

    function getBlockNodes(nodes) {
        var node = nodes[0];
        var endNode = nodes[nodes.length - 1];
        var blockNodes = [node];
        do {
            node = node.nextSibling;
            if (!node) break;
            blockNodes.push(node);
        } while (node !== endNode);
        return jqLite(blockNodes);
    }

    function createMap() {
        return Object.create(null);
    }

    var NODE_TYPE_ELEMENT = 1;
    var NODE_TYPE_ATTRIBUTE = 2;
    var NODE_TYPE_TEXT = 3;
    var NODE_TYPE_COMMENT = 8;
    var NODE_TYPE_DOCUMENT = 9;
    var NODE_TYPE_DOCUMENT_FRAGMENT = 11;

    function setupModuleLoader(window) {
        var $injectorMinErr = minErr('$injector');
        var ngMinErr = minErr('ng');

        function ensure(obj, name, factory) {
            return obj[name] || (obj[name] = factory());
        }

        var angular = ensure(window, 'angular', Object);
        angular.$$minErr = angular.$$minErr || minErr;
        return ensure(angular, 'module', function () {
            var modules = {};
            return function module(name, requires, configFn) {
                var assertNotHasOwnProperty = function (name, context) {
                    if (name === 'hasOwnProperty') {
                        throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
                    }
                };
                assertNotHasOwnProperty(name, 'module');
                if (requires && modules.hasOwnProperty(name)) {
                    modules[name] = null;
                }
                return ensure(modules, name, function () {
                    if (!requires) {
                        throw $injectorMinErr('nomod', "Module '{0}' is not available! You either misspelled " +
                            "the module name or forgot to load it. If registering a module ensure that you " +
                            "specify the dependencies as the second argument.", name);
                    }
                    var invokeQueue = [];
                    var configBlocks = [];
                    var runBlocks = [];
                    var config = invokeLater('$injector', 'invoke', 'push', configBlocks);
                    var moduleInstance = {
                        _invokeQueue: invokeQueue,
                        _configBlocks: configBlocks,
                        _runBlocks: runBlocks,
                        requires: requires,
                        name: name,
                        provider: invokeLater('$provide', 'provider'),
                        factory: invokeLater('$provide', 'factory'),
                        service: invokeLater('$provide', 'service'),
                        value: invokeLater('$provide', 'value'),
                        constant: invokeLater('$provide', 'constant', 'unshift'),
                        animation: invokeLater('$animateProvider', 'register'),
                        filter: invokeLater('$filterProvider', 'register'),
                        controller: invokeLater('$controllerProvider', 'register'),
                        directive: invokeLater('$compileProvider', 'directive'),
                        config: config,
                        run: function (block) {
                            runBlocks.push(block);
                            return this;
                        }
                    };
                    if (configFn) {
                        config(configFn);
                    }
                    return moduleInstance;
                    function invokeLater(provider, method, insertMethod, queue) {
                        if (!queue) queue = invokeQueue;
                        return function () {
                            queue[insertMethod || 'push']([provider, method, arguments]);
                            return moduleInstance;
                        };
                    }
                });
            };
        });
    }

    function serializeObject(obj) {
        var seen = [];
        return JSON.stringify(obj, function (key, val) {
            val = toJsonReplacer(key, val);
            if (isObject(val)) {
                if (seen.indexOf(val) >= 0) return '<<already seen>>';
                seen.push(val);
            }
            return val;
        });
    }

    function toDebugString(obj) {
        if (typeof obj === 'function') {
            return obj.toString().replace(/ \{[\s\S]*$/, '');
        } else if (typeof obj === 'undefined') {
            return 'undefined';
        } else if (typeof obj !== 'string') {
            return serializeObject(obj);
        }
        return obj;
    }

    var version = {
        full: '1.3.20',
        major: 1,
        minor: 3,
        dot: 20,
        codeName: 'shallow-translucence'
    };

    function publishExternalAPI(angular) {
        extend(angular, {
            'bootstrap': bootstrap,
            'copy': copy,
            'extend': extend,
            'equals': equals,
            'element': jqLite,
            'forEach': forEach,
            'injector': createInjector,
            'noop': noop,
            'bind': bind,
            'toJson': toJson,
            'fromJson': fromJson,
            'identity': identity,
            'isUndefined': isUndefined,
            'isDefined': isDefined,
            'isString': isString,
            'isFunction': isFunction,
            'isObject': isObject,
            'isNumber': isNumber,
            'isElement': isElement,
            'isArray': isArray,
            'version': version,
            'isDate': isDate,
            'lowercase': lowercase,
            'uppercase': uppercase,
            'callbacks': {counter: 0},
            'getTestability': getTestability,
            '$$minErr': minErr,
            '$$csp': csp,
            'reloadWithDebugInfo': reloadWithDebugInfo
        });
        angularModule = setupModuleLoader(window);
        try {
            angularModule('ngLocale');
        } catch (e) {
            angularModule('ngLocale', []).provider('$locale', $LocaleProvider);
        }
        angularModule('ng', ['ngLocale'], ['$provide',
            function ngModule($provide) {
                $provide.provider({
                    $$sanitizeUri: $$SanitizeUriProvider
                });
                $provide.provider('$compile', $CompileProvider).
                    directive({
                        a: htmlAnchorDirective,
                        input: inputDirective,
                        textarea: inputDirective,
                        form: formDirective,
                        script: scriptDirective,
                        select: selectDirective,
                        style: styleDirective,
                        option: optionDirective,
                        ngBind: ngBindDirective,
                        ngBindHtml: ngBindHtmlDirective,
                        ngBindTemplate: ngBindTemplateDirective,
                        ngClass: ngClassDirective,
                        ngClassEven: ngClassEvenDirective,
                        ngClassOdd: ngClassOddDirective,
                        ngCloak: ngCloakDirective,
                        ngController: ngControllerDirective,
                        ngForm: ngFormDirective,
                        ngHide: ngHideDirective,
                        ngIf: ngIfDirective,
                        ngInclude: ngIncludeDirective,
                        ngInit: ngInitDirective,
                        ngNonBindable: ngNonBindableDirective,
                        ngPluralize: ngPluralizeDirective,
                        ngRepeat: ngRepeatDirective,
                        ngShow: ngShowDirective,
                        ngStyle: ngStyleDirective,
                        ngSwitch: ngSwitchDirective,
                        ngSwitchWhen: ngSwitchWhenDirective,
                        ngSwitchDefault: ngSwitchDefaultDirective,
                        ngOptions: ngOptionsDirective,
                        ngTransclude: ngTranscludeDirective,
                        ngModel: ngModelDirective,
                        ngList: ngListDirective,
                        ngChange: ngChangeDirective,
                        pattern: patternDirective,
                        ngPattern: patternDirective,
                        required: requiredDirective,
                        ngRequired: requiredDirective,
                        minlength: minlengthDirective,
                        ngMinlength: minlengthDirective,
                        maxlength: maxlengthDirective,
                        ngMaxlength: maxlengthDirective,
                        ngValue: ngValueDirective,
                        ngModelOptions: ngModelOptionsDirective
                    }).
                    directive({
                        ngInclude: ngIncludeFillContentDirective
                    }).
                    directive(ngAttributeAliasDirectives).
                    directive(ngEventDirectives);
                $provide.provider({
                    $anchorScroll: $AnchorScrollProvider,
                    $animate: $AnimateProvider,
                    $browser: $BrowserProvider,
                    $cacheFactory: $CacheFactoryProvider,
                    $controller: $ControllerProvider,
                    $document: $DocumentProvider,
                    $exceptionHandler: $ExceptionHandlerProvider,
                    $filter: $FilterProvider,
                    $interpolate: $InterpolateProvider,
                    $interval: $IntervalProvider,
                    $http: $HttpProvider,
                    $httpBackend: $HttpBackendProvider,
                    $location: $LocationProvider,
                    $log: $LogProvider,
                    $parse: $ParseProvider,
                    $rootScope: $RootScopeProvider,
                    $q: $QProvider,
                    $$q: $$QProvider,
                    $sce: $SceProvider,
                    $sceDelegate: $SceDelegateProvider,
                    $sniffer: $SnifferProvider,
                    $templateCache: $TemplateCacheProvider,
                    $templateRequest: $TemplateRequestProvider,
                    $$testability: $$TestabilityProvider,
                    $timeout: $TimeoutProvider,
                    $window: $WindowProvider,
                    $$rAF: $$RAFProvider,
                    $$asyncCallback: $$AsyncCallbackProvider,
                    $$jqLite: $$jqLiteProvider
                });
            }
        ]);
    }

    JQLite.expando = 'ng339';
    var jqCache = JQLite.cache = {},
        jqId = 1,
        addEventListenerFn = function (element, type, fn) {
            element.addEventListener(type, fn, false);
        },
        removeEventListenerFn = function (element, type, fn) {
            element.removeEventListener(type, fn, false);
        };
    JQLite._data = function (node) {
        return this.cache[node[this.expando]] || {};
    };
    function jqNextId() {
        return ++jqId;
    }

    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;
    var MOUSE_EVENT_MAP = {mouseleave: "mouseout", mouseenter: "mouseover"};
    var jqLiteMinErr = minErr('jqLite');

    function camelCase(name) {
        return name.
            replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
                return offset ? letter.toUpperCase() : letter;
            }).
            replace(MOZ_HACK_REGEXP, 'Moz$1');
    }

    var SINGLE_TAG_REGEXP = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    var HTML_REGEXP = /<|&#?\w+;/;
    var TAG_NAME_REGEXP = /<([\w:]+)/;
    var XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
    var wrapMap = {
        'option': [1, '<select multiple="multiple">', '</select>'],
        'thead': [1, '<table>', '</table>'],
        'col': [2, '<table><colgroup>', '</colgroup></table>'],
        'tr': [2, '<table><tbody>', '</tbody></table>'],
        'td': [3, '<table><tbody><tr>', '</tr></tbody></table>'],
        '_default': [0, "", ""]
    };
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    function jqLiteIsTextNode(html) {
        return !HTML_REGEXP.test(html);
    }

    function jqLiteAcceptsData(node) {
        var nodeType = node.nodeType;
        return nodeType === NODE_TYPE_ELEMENT || !nodeType || nodeType === NODE_TYPE_DOCUMENT;
    }

    function jqLiteBuildFragment(html, context) {
        var tmp, tag, wrap,
            fragment = context.createDocumentFragment(),
            nodes = [], i;
        if (jqLiteIsTextNode(html)) {
            nodes.push(context.createTextNode(html));
        } else {
            tmp = tmp || fragment.appendChild(context.createElement("div"));
            tag = (TAG_NAME_REGEXP.exec(html) || ["", ""])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            tmp.innerHTML = wrap[1] + html.replace(XHTML_TAG_REGEXP, "<$1></$2>") + wrap[2];
            i = wrap[0];
            while (i--) {
                tmp = tmp.lastChild;
            }
            nodes = concat(nodes, tmp.childNodes);
            tmp = fragment.firstChild;
            tmp.textContent = "";
        }
        fragment.textContent = "";
        fragment.innerHTML = "";
        forEach(nodes, function (node) {
            fragment.appendChild(node);
        });
        return fragment;
    }

    function jqLiteParseHTML(html, context) {
        context = context || document;
        var parsed;
        if ((parsed = SINGLE_TAG_REGEXP.exec(html))) {
            return [context.createElement(parsed[1])];
        }
        if ((parsed = jqLiteBuildFragment(html, context))) {
            return parsed.childNodes;
        }
        return [];
    }

    function JQLite(element) {
        if (element instanceof JQLite) {
            return element;
        }
        var argIsString;
        if (isString(element)) {
            element = trim(element);
            argIsString = true;
        }
        if (!(this instanceof JQLite)) {
            if (argIsString && element.charAt(0) != '<') {
                throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
            }
            return new JQLite(element);
        }
        if (argIsString) {
            jqLiteAddNodes(this, jqLiteParseHTML(element));
        } else {
            jqLiteAddNodes(this, element);
        }
    }

    function jqLiteClone(element) {
        return element.cloneNode(true);
    }

    function jqLiteDealoc(element, onlyDescendants) {
        if (!onlyDescendants) jqLiteRemoveData(element);
        if (element.querySelectorAll) {
            var descendants = element.querySelectorAll('*');
            for (var i = 0, l = descendants.length; i < l; i++) {
                jqLiteRemoveData(descendants[i]);
            }
        }
    }

    function jqLiteOff(element, type, fn, unsupported) {
        if (isDefined(unsupported)) throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');
        var expandoStore = jqLiteExpandoStore(element);
        var events = expandoStore && expandoStore.events;
        var handle = expandoStore && expandoStore.handle;
        if (!handle) return;
        if (!type) {
            for (type in events) {
                if (type !== '$destroy') {
                    removeEventListenerFn(element, type, handle);
                }
                delete events[type];
            }
        } else {
            forEach(type.split(' '), function (type) {
                if (isDefined(fn)) {
                    var listenerFns = events[type];
                    arrayRemove(listenerFns || [], fn);
                    if (listenerFns && listenerFns.length > 0) {
                        return;
                    }
                }
                removeEventListenerFn(element, type, handle);
                delete events[type];
            });
        }
    }

    function jqLiteRemoveData(element, name) {
        var expandoId = element.ng339;
        var expandoStore = expandoId && jqCache[expandoId];
        if (expandoStore) {
            if (name) {
                delete expandoStore.data[name];
                return;
            }
            if (expandoStore.handle) {
                if (expandoStore.events.$destroy) {
                    expandoStore.handle({}, '$destroy');
                }
                jqLiteOff(element);
            }
            delete jqCache[expandoId];
            element.ng339 = undefined;
        }
    }

    function jqLiteExpandoStore(element, createIfNecessary) {
        var expandoId = element.ng339,
            expandoStore = expandoId && jqCache[expandoId];
        if (createIfNecessary && !expandoStore) {
            element.ng339 = expandoId = jqNextId();
            expandoStore = jqCache[expandoId] = {events: {}, data: {}, handle: undefined};
        }
        return expandoStore;
    }

    function jqLiteData(element, key, value) {
        if (jqLiteAcceptsData(element)) {
            var isSimpleSetter = isDefined(value);
            var isSimpleGetter = !isSimpleSetter && key && !isObject(key);
            var massGetter = !key;
            var expandoStore = jqLiteExpandoStore(element, !isSimpleGetter);
            var data = expandoStore && expandoStore.data;
            if (isSimpleSetter) {
                data[key] = value;
            } else {
                if (massGetter) {
                    return data;
                } else {
                    if (isSimpleGetter) {
                        return data && data[key];
                    } else {
                        extend(data, key);
                    }
                }
            }
        }
    }

    function jqLiteHasClass(element, selector) {
        if (!element.getAttribute) return false;
        return ((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").
            indexOf(" " + selector + " ") > -1);
    }

    function jqLiteRemoveClass(element, cssClasses) {
        if (cssClasses && element.setAttribute) {
            forEach(cssClasses.split(' '), function (cssClass) {
                element.setAttribute('class', trim(
                        (" " + (element.getAttribute('class') || '') + " ")
                            .replace(/[\n\t]/g, " ")
                            .replace(" " + trim(cssClass) + " ", " "))
                );
            });
        }
    }

    function jqLiteAddClass(element, cssClasses) {
        if (cssClasses && element.setAttribute) {
            var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ')
                .replace(/[\n\t]/g, " ");
            forEach(cssClasses.split(' '), function (cssClass) {
                cssClass = trim(cssClass);
                if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
                    existingClasses += cssClass + ' ';
                }
            });
            element.setAttribute('class', trim(existingClasses));
        }
    }

    function jqLiteAddNodes(root, elements) {
        if (elements) {
            if (elements.nodeType) {
                root[root.length++] = elements;
            } else {
                var length = elements.length;
                if (typeof length === 'number' && elements.window !== elements) {
                    if (length) {
                        for (var i = 0; i < length; i++) {
                            root[root.length++] = elements[i];
                        }
                    }
                } else {
                    root[root.length++] = elements;
                }
            }
        }
    }

    function jqLiteController(element, name) {
        return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
    }

    function jqLiteInheritedData(element, name, value) {
        if (element.nodeType == NODE_TYPE_DOCUMENT) {
            element = element.documentElement;
        }
        var names = isArray(name) ? name : [name];
        while (element) {
            for (var i = 0, ii = names.length; i < ii; i++) {
                if ((value = jqLite.data(element, names[i])) !== undefined) return value;
            }
            element = element.parentNode || (element.nodeType === NODE_TYPE_DOCUMENT_FRAGMENT && element.host);
        }
    }

    function jqLiteEmpty(element) {
        jqLiteDealoc(element, true);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    function jqLiteRemove(element, keepData) {
        if (!keepData) jqLiteDealoc(element);
        var parent = element.parentNode;
        if (parent) parent.removeChild(element);
    }

    function jqLiteDocumentLoaded(action, win) {
        win = win || window;
        if (win.document.readyState === 'complete') {
            win.setTimeout(action);
        } else {
            jqLite(win).on('load', action);
        }
    }

    var JQLitePrototype = JQLite.prototype = {
        ready: function (fn) {
            var fired = false;

            function trigger() {
                if (fired) return;
                fired = true;
                fn();
            }

            if (document.readyState === 'complete') {
                setTimeout(trigger);
            } else {
                this.on('DOMContentLoaded', trigger);
                JQLite(window).on('load', trigger);
            }
        },
        toString: function () {
            var value = [];
            forEach(this, function (e) {
                value.push('' + e);
            });
            return '[' + value.join(', ') + ']';
        },
        eq: function (index) {
            return (index >= 0) ? jqLite(this[index]) : jqLite(this[this.length + index]);
        },
        length: 0,
        push: push,
        sort: [].sort,
        splice: [].splice
    };
    var BOOLEAN_ATTR = {};
    forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function (value) {
        BOOLEAN_ATTR[lowercase(value)] = value;
    });
    var BOOLEAN_ELEMENTS = {};
    forEach('input,select,option,textarea,button,form,details'.split(','), function (value) {
        BOOLEAN_ELEMENTS[value] = true;
    });
    var ALIASED_ATTR = {
        'ngMinlength': 'minlength',
        'ngMaxlength': 'maxlength',
        'ngMin': 'min',
        'ngMax': 'max',
        'ngPattern': 'pattern'
    };

    function getBooleanAttrName(element, name) {
        var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
        return booleanAttr && BOOLEAN_ELEMENTS[nodeName_(element)] && booleanAttr;
    }

    function getAliasedAttrName(element, name) {
        var nodeName = element.nodeName;
        return (nodeName === 'INPUT' || nodeName === 'TEXTAREA') && ALIASED_ATTR[name];
    }

    forEach({
        data: jqLiteData,
        removeData: jqLiteRemoveData
    }, function (fn, name) {
        JQLite[name] = fn;
    });
    forEach({
        data: jqLiteData,
        inheritedData: jqLiteInheritedData,
        scope: function (element) {
            return jqLite.data(element, '$scope') || jqLiteInheritedData(element.parentNode || element, ['$isolateScope', '$scope']);
        },
        isolateScope: function (element) {
            return jqLite.data(element, '$isolateScope') || jqLite.data(element, '$isolateScopeNoTemplate');
        },
        controller: jqLiteController,
        injector: function (element) {
            return jqLiteInheritedData(element, '$injector');
        },
        removeAttr: function (element, name) {
            element.removeAttribute(name);
        },
        hasClass: jqLiteHasClass,
        css: function (element, name, value) {
            name = camelCase(name);
            if (isDefined(value)) {
                element.style[name] = value;
            } else {
                return element.style[name];
            }
        },
        attr: function (element, name, value) {
            var nodeType = element.nodeType;
            if (nodeType === NODE_TYPE_TEXT || nodeType === NODE_TYPE_ATTRIBUTE || nodeType === NODE_TYPE_COMMENT) {
                return;
            }
            var lowercasedName = lowercase(name);
            if (BOOLEAN_ATTR[lowercasedName]) {
                if (isDefined(value)) {
                    if (!!value) {
                        element[name] = true;
                        element.setAttribute(name, lowercasedName);
                    } else {
                        element[name] = false;
                        element.removeAttribute(lowercasedName);
                    }
                } else {
                    return (element[name] ||
                    (element.attributes.getNamedItem(name) || noop).specified)
                        ? lowercasedName
                        : undefined;
                }
            } else if (isDefined(value)) {
                element.setAttribute(name, value);
            } else if (element.getAttribute) {
                var ret = element.getAttribute(name, 2);
                return ret === null ? undefined : ret;
            }
        },
        prop: function (element, name, value) {
            if (isDefined(value)) {
                element[name] = value;
            } else {
                return element[name];
            }
        },
        text: (function () {
            getText.$dv = '';
            return getText;
            function getText(element, value) {
                if (isUndefined(value)) {
                    var nodeType = element.nodeType;
                    return (nodeType === NODE_TYPE_ELEMENT || nodeType === NODE_TYPE_TEXT) ? element.textContent : '';
                }
                element.textContent = value;
            }
        })(),
        val: function (element, value) {
            if (isUndefined(value)) {
                if (element.multiple && nodeName_(element) === 'select') {
                    var result = [];
                    forEach(element.options, function (option) {
                        if (option.selected) {
                            result.push(option.value || option.text);
                        }
                    });
                    return result.length === 0 ? null : result;
                }
                return element.value;
            }
            element.value = value;
        },
        html: function (element, value) {
            if (isUndefined(value)) {
                return element.innerHTML;
            }
            jqLiteDealoc(element, true);
            element.innerHTML = value;
        },
        empty: jqLiteEmpty
    }, function (fn, name) {
        JQLite.prototype[name] = function (arg1, arg2) {
            var i, key;
            var nodeCount = this.length;
            if (fn !== jqLiteEmpty &&
                (((fn.length == 2 && (fn !== jqLiteHasClass && fn !== jqLiteController)) ? arg1 : arg2) === undefined)) {
                if (isObject(arg1)) {
                    for (i = 0; i < nodeCount; i++) {
                        if (fn === jqLiteData) {
                            fn(this[i], arg1);
                        } else {
                            for (key in arg1) {
                                fn(this[i], key, arg1[key]);
                            }
                        }
                    }
                    return this;
                } else {
                    var value = fn.$dv;
                    var jj = (value === undefined) ? Math.min(nodeCount, 1) : nodeCount;
                    for (var j = 0; j < jj; j++) {
                        var nodeValue = fn(this[j], arg1, arg2);
                        value = value ? value + nodeValue : nodeValue;
                    }
                    return value;
                }
            } else {
                for (i = 0; i < nodeCount; i++) {
                    fn(this[i], arg1, arg2);
                }
                return this;
            }
        };
    });
    function createEventHandler(element, events) {
        var eventHandler = function (event, type) {
            event.isDefaultPrevented = function () {
                return event.defaultPrevented;
            };
            var eventFns = events[type || event.type];
            var eventFnsLength = eventFns ? eventFns.length : 0;
            if (!eventFnsLength) return;
            if (isUndefined(event.immediatePropagationStopped)) {
                var originalStopImmediatePropagation = event.stopImmediatePropagation;
                event.stopImmediatePropagation = function () {
                    event.immediatePropagationStopped = true;
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    }
                    if (originalStopImmediatePropagation) {
                        originalStopImmediatePropagation.call(event);
                    }
                };
            }
            event.isImmediatePropagationStopped = function () {
                return event.immediatePropagationStopped === true;
            };
            if ((eventFnsLength > 1)) {
                eventFns = shallowCopy(eventFns);
            }
            for (var i = 0; i < eventFnsLength; i++) {
                if (!event.isImmediatePropagationStopped()) {
                    eventFns[i].call(element, event);
                }
            }
        };
        eventHandler.elem = element;
        return eventHandler;
    }

    forEach({
        removeData: jqLiteRemoveData,
        on: function jqLiteOn(element, type, fn, unsupported) {
            if (isDefined(unsupported)) throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');
            if (!jqLiteAcceptsData(element)) {
                return;
            }
            var expandoStore = jqLiteExpandoStore(element, true);
            var events = expandoStore.events;
            var handle = expandoStore.handle;
            if (!handle) {
                handle = expandoStore.handle = createEventHandler(element, events);
            }
            var types = type.indexOf(' ') >= 0 ? type.split(' ') : [type];
            var i = types.length;
            while (i--) {
                type = types[i];
                var eventFns = events[type];
                if (!eventFns) {
                    events[type] = [];
                    if (type === 'mouseenter' || type === 'mouseleave') {
                        jqLiteOn(element, MOUSE_EVENT_MAP[type], function (event) {
                            var target = this, related = event.relatedTarget;
                            if (!related || (related !== target && !target.contains(related))) {
                                handle(event, type);
                            }
                        });
                    } else {
                        if (type !== '$destroy') {
                            addEventListenerFn(element, type, handle);
                        }
                    }
                    eventFns = events[type];
                }
                eventFns.push(fn);
            }
        },
        off: jqLiteOff,
        one: function (element, type, fn) {
            element = jqLite(element);
            element.on(type, function onFn() {
                element.off(type, fn);
                element.off(type, onFn);
            });
            element.on(type, fn);
        },
        replaceWith: function (element, replaceNode) {
            var index, parent = element.parentNode;
            jqLiteDealoc(element);
            forEach(new JQLite(replaceNode), function (node) {
                if (index) {
                    parent.insertBefore(node, index.nextSibling);
                } else {
                    parent.replaceChild(node, element);
                }
                index = node;
            });
        },
        children: function (element) {
            var children = [];
            forEach(element.childNodes, function (element) {
                if (element.nodeType === NODE_TYPE_ELEMENT)
                    children.push(element);
            });
            return children;
        },
        contents: function (element) {
            return element.contentDocument || element.childNodes || [];
        },
        append: function (element, node) {
            var nodeType = element.nodeType;
            if (nodeType !== NODE_TYPE_ELEMENT && nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT) return;
            node = new JQLite(node);
            for (var i = 0, ii = node.length; i < ii; i++) {
                var child = node[i];
                element.appendChild(child);
            }
        },
        prepend: function (element, node) {
            if (element.nodeType === NODE_TYPE_ELEMENT) {
                var index = element.firstChild;
                forEach(new JQLite(node), function (child) {
                    element.insertBefore(child, index);
                });
            }
        },
        wrap: function (element, wrapNode) {
            wrapNode = jqLite(wrapNode).eq(0).clone()[0];
            var parent = element.parentNode;
            if (parent) {
                parent.replaceChild(wrapNode, element);
            }
            wrapNode.appendChild(element);
        },
        remove: jqLiteRemove,
        detach: function (element) {
            jqLiteRemove(element, true);
        },
        after: function (element, newElement) {
            var index = element, parent = element.parentNode;
            newElement = new JQLite(newElement);
            for (var i = 0, ii = newElement.length; i < ii; i++) {
                var node = newElement[i];
                parent.insertBefore(node, index.nextSibling);
                index = node;
            }
        },
        addClass: jqLiteAddClass,
        removeClass: jqLiteRemoveClass,
        toggleClass: function (element, selector, condition) {
            if (selector) {
                forEach(selector.split(' '), function (className) {
                    var classCondition = condition;
                    if (isUndefined(classCondition)) {
                        classCondition = !jqLiteHasClass(element, className);
                    }
                    (classCondition ? jqLiteAddClass : jqLiteRemoveClass)(element, className);
                });
            }
        },
        parent: function (element) {
            var parent = element.parentNode;
            return parent && parent.nodeType !== NODE_TYPE_DOCUMENT_FRAGMENT ? parent : null;
        },
        next: function (element) {
            return element.nextElementSibling;
        },
        find: function (element, selector) {
            if (element.getElementsByTagName) {
                return element.getElementsByTagName(selector);
            } else {
                return [];
            }
        },
        clone: jqLiteClone,
        triggerHandler: function (element, event, extraParameters) {
            var dummyEvent, eventFnsCopy, handlerArgs;
            var eventName = event.type || event;
            var expandoStore = jqLiteExpandoStore(element);
            var events = expandoStore && expandoStore.events;
            var eventFns = events && events[eventName];
            if (eventFns) {
                dummyEvent = {
                    preventDefault: function () {
                        this.defaultPrevented = true;
                    },
                    isDefaultPrevented: function () {
                        return this.defaultPrevented === true;
                    },
                    stopImmediatePropagation: function () {
                        this.immediatePropagationStopped = true;
                    },
                    isImmediatePropagationStopped: function () {
                        return this.immediatePropagationStopped === true;
                    },
                    stopPropagation: noop,
                    type: eventName,
                    target: element
                };
                if (event.type) {
                    dummyEvent = extend(dummyEvent, event);
                }
                eventFnsCopy = shallowCopy(eventFns);
                handlerArgs = extraParameters ? [dummyEvent].concat(extraParameters) : [dummyEvent];
                forEach(eventFnsCopy, function (fn) {
                    if (!dummyEvent.isImmediatePropagationStopped()) {
                        fn.apply(element, handlerArgs);
                    }
                });
            }
        }
    }, function (fn, name) {
        JQLite.prototype[name] = function (arg1, arg2, arg3) {
            var value;
            for (var i = 0, ii = this.length; i < ii; i++) {
                if (isUndefined(value)) {
                    value = fn(this[i], arg1, arg2, arg3);
                    if (isDefined(value)) {
                        value = jqLite(value);
                    }
                } else {
                    jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
                }
            }
            return isDefined(value) ? value : this;
        };
        JQLite.prototype.bind = JQLite.prototype.on;
        JQLite.prototype.unbind = JQLite.prototype.off;
    });
    function $$jqLiteProvider() {
        this.$get = function $$jqLite() {
            return extend(JQLite, {
                hasClass: function (node, classes) {
                    if (node.attr) node = node[0];
                    return jqLiteHasClass(node, classes);
                },
                addClass: function (node, classes) {
                    if (node.attr) node = node[0];
                    return jqLiteAddClass(node, classes);
                },
                removeClass: function (node, classes) {
                    if (node.attr) node = node[0];
                    return jqLiteRemoveClass(node, classes);
                }
            });
        };
    }

    function hashKey(obj, nextUidFn) {
        var key = obj && obj.$$hashKey;
        if (key) {
            if (typeof key === 'function') {
                key = obj.$$hashKey();
            }
            return key;
        }
        var objType = typeof obj;
        if (objType == 'function' || (objType == 'object' && obj !== null)) {
            key = obj.$$hashKey = objType + ':' + (nextUidFn || nextUid)();
        } else {
            key = objType + ':' + obj;
        }
        return key;
    }

    function HashMap(array, isolatedUid) {
        if (isolatedUid) {
            var uid = 0;
            this.nextUid = function () {
                return ++uid;
            };
        }
        forEach(array, this.put, this);
    }

    HashMap.prototype = {
        put: function (key, value) {
            this[hashKey(key, this.nextUid)] = value;
        },
        get: function (key) {
            return this[hashKey(key, this.nextUid)];
        },
        remove: function (key) {
            var value = this[key = hashKey(key, this.nextUid)];
            delete this[key];
            return value;
        }
    };
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var $injectorMinErr = minErr('$injector');

    function anonFn(fn) {
        var fnText = fn.toString().replace(STRIP_COMMENTS, ''),
            args = fnText.match(FN_ARGS);
        if (args) {
            return 'function(' + (args[1] || '').replace(/[\s\r\n]+/, ' ') + ')';
        }
        return 'fn';
    }

    function annotate(fn, strictDi, name) {
        var $inject,
            fnText,
            argDecl,
            last;
        if (typeof fn === 'function') {
            if (!($inject = fn.$inject)) {
                $inject = [];
                if (fn.length) {
                    if (strictDi) {
                        if (!isString(name) || !name) {
                            name = fn.name || anonFn(fn);
                        }
                        throw $injectorMinErr('strictdi',
                            '{0} is not using explicit annotation and cannot be invoked in strict mode', name);
                    }
                    fnText = fn.toString().replace(STRIP_COMMENTS, '');
                    argDecl = fnText.match(FN_ARGS);
                    forEach(argDecl[1].split(FN_ARG_SPLIT), function (arg) {
                        arg.replace(FN_ARG, function (all, underscore, name) {
                            $inject.push(name);
                        });
                    });
                }
                fn.$inject = $inject;
            }
        } else if (isArray(fn)) {
            last = fn.length - 1;
            assertArgFn(fn[last], 'fn');
            $inject = fn.slice(0, last);
        } else {
            assertArgFn(fn, 'fn', true);
        }
        return $inject;
    }

    function createInjector(modulesToLoad, strictDi) {
        strictDi = (strictDi === true);
        var INSTANTIATING = {},
            providerSuffix = 'Provider',
            path = [],
            loadedModules = new HashMap([], true),
            providerCache = {
                $provide: {
                    provider: supportObject(provider),
                    factory: supportObject(factory),
                    service: supportObject(service),
                    value: supportObject(value),
                    constant: supportObject(constant),
                    decorator: decorator
                }
            },
            providerInjector = (providerCache.$injector =
                createInternalInjector(providerCache, function (serviceName, caller) {
                    if (angular.isString(caller)) {
                        path.push(caller);
                    }
                    throw $injectorMinErr('unpr', "Unknown provider: {0}", path.join(' <- '));
                })),
            instanceCache = {},
            instanceInjector = (instanceCache.$injector =
                createInternalInjector(instanceCache, function (serviceName, caller) {
                    var provider = providerInjector.get(serviceName + providerSuffix, caller);
                    return instanceInjector.invoke(provider.$get, provider, undefined, serviceName);
                }));
        forEach(loadModules(modulesToLoad), function (fn) {
            instanceInjector.invoke(fn || noop);
        });
        return instanceInjector;
        function supportObject(delegate) {
            return function (key, value) {
                if (isObject(key)) {
                    forEach(key, reverseParams(delegate));
                } else {
                    return delegate(key, value);
                }
            };
        }

        function provider(name, provider_) {
            assertNotHasOwnProperty(name, 'service');
            if (isFunction(provider_) || isArray(provider_)) {
                provider_ = providerInjector.instantiate(provider_);
            }
            if (!provider_.$get) {
                throw $injectorMinErr('pget', "Provider '{0}' must define $get factory method.", name);
            }
            return providerCache[name + providerSuffix] = provider_;
        }

        function enforceReturnValue(name, factory) {
            return function enforcedReturnValue() {
                var result = instanceInjector.invoke(factory, this);
                if (isUndefined(result)) {
                    throw $injectorMinErr('undef', "Provider '{0}' must return a value from $get factory method.", name);
                }
                return result;
            };
        }

        function factory(name, factoryFn, enforce) {
            return provider(name, {
                $get: enforce !== false ? enforceReturnValue(name, factoryFn) : factoryFn
            });
        }

        function service(name, constructor) {
            return factory(name, ['$injector', function ($injector) {
                return $injector.instantiate(constructor);
            }]);
        }

        function value(name, val) {
            return factory(name, valueFn(val), false);
        }

        function constant(name, value) {
            assertNotHasOwnProperty(name, 'constant');
            providerCache[name] = value;
            instanceCache[name] = value;
        }

        function decorator(serviceName, decorFn) {
            var origProvider = providerInjector.get(serviceName + providerSuffix),
                orig$get = origProvider.$get;
            origProvider.$get = function () {
                var origInstance = instanceInjector.invoke(orig$get, origProvider);
                return instanceInjector.invoke(decorFn, null, {$delegate: origInstance});
            };
        }

        function loadModules(modulesToLoad) {
            var runBlocks = [], moduleFn;
            forEach(modulesToLoad, function (module) {
                if (loadedModules.get(module)) return;
                loadedModules.put(module, true);
                function runInvokeQueue(queue) {
                    var i, ii;
                    for (i = 0, ii = queue.length; i < ii; i++) {
                        var invokeArgs = queue[i],
                            provider = providerInjector.get(invokeArgs[0]);
                        provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
                    }
                }

                try {
                    if (isString(module)) {
                        moduleFn = angularModule(module);
                        runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
                        runInvokeQueue(moduleFn._invokeQueue);
                        runInvokeQueue(moduleFn._configBlocks);
                    } else if (isFunction(module)) {
                        runBlocks.push(providerInjector.invoke(module));
                    } else if (isArray(module)) {
                        runBlocks.push(providerInjector.invoke(module));
                    } else {
                        assertArgFn(module, 'module');
                    }
                } catch (e) {
                    if (isArray(module)) {
                        module = module[module.length - 1];
                    }
                    if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
                        e = e.message + '\n' + e.stack;
                    }
                    throw $injectorMinErr('modulerr', "Failed to instantiate module {0} due to:\n{1}",
                        module, e.stack || e.message || e);
                }
            });
            return runBlocks;
        }

        function createInternalInjector(cache, factory) {
            function getService(serviceName, caller) {
                if (cache.hasOwnProperty(serviceName)) {
                    if (cache[serviceName] === INSTANTIATING) {
                        throw $injectorMinErr('cdep', 'Circular dependency found: {0}',
                            serviceName + ' <- ' + path.join(' <- '));
                    }
                    return cache[serviceName];
                } else {
                    try {
                        path.unshift(serviceName);
                        cache[serviceName] = INSTANTIATING;
                        return cache[serviceName] = factory(serviceName, caller);
                    } catch (err) {
                        if (cache[serviceName] === INSTANTIATING) {
                            delete cache[serviceName];
                        }
                        throw err;
                    } finally {
                        path.shift();
                    }
                }
            }

            function invoke(fn, self, locals, serviceName) {
                if (typeof locals === 'string') {
                    serviceName = locals;
                    locals = null;
                }
                var args = [],
                    $inject = createInjector.$$annotate(fn, strictDi, serviceName),
                    length, i,
                    key;
                for (i = 0, length = $inject.length; i < length; i++) {
                    key = $inject[i];
                    if (typeof key !== 'string') {
                        throw $injectorMinErr('itkn',
                            'Incorrect injection token! Expected service name as string, got {0}', key);
                    }
                    args.push(
                        locals && locals.hasOwnProperty(key)
                            ? locals[key]
                            : getService(key, serviceName)
                    );
                }
                if (isArray(fn)) {
                    fn = fn[length];
                }
                return fn.apply(self, args);
            }

            function instantiate(Type, locals, serviceName) {
                var instance = Object.create((isArray(Type) ? Type[Type.length - 1] : Type).prototype || null);
                var returnedValue = invoke(Type, instance, locals, serviceName);
                return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
            }

            return {
                invoke: invoke,
                instantiate: instantiate,
                get: getService,
                annotate: createInjector.$$annotate,
                has: function (name) {
                    return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
                }
            };
        }
    }

    createInjector.$$annotate = annotate;
    function $AnchorScrollProvider() {
        var autoScrollingEnabled = true;
        this.disableAutoScrolling = function () {
            autoScrollingEnabled = false;
        };
        this.$get = ['$window', '$location', '$rootScope', function ($window, $location, $rootScope) {
            var document = $window.document;

            function getFirstAnchor(list) {
                var result = null;
                Array.prototype.some.call(list, function (element) {
                    if (nodeName_(element) === 'a') {
                        result = element;
                        return true;
                    }
                });
                return result;
            }

            function getYOffset() {
                var offset = scroll.yOffset;
                if (isFunction(offset)) {
                    offset = offset();
                } else if (isElement(offset)) {
                    var elem = offset[0];
                    var style = $window.getComputedStyle(elem);
                    if (style.position !== 'fixed') {
                        offset = 0;
                    } else {
                        offset = elem.getBoundingClientRect().bottom;
                    }
                } else if (!isNumber(offset)) {
                    offset = 0;
                }
                return offset;
            }

            function scrollTo(elem) {
                if (elem) {
                    elem.scrollIntoView();
                    var offset = getYOffset();
                    if (offset) {
                        var elemTop = elem.getBoundingClientRect().top;
                        $window.scrollBy(0, elemTop - offset);
                    }
                } else {
                    $window.scrollTo(0, 0);
                }
            }

            function scroll() {
                var hash = $location.hash(), elm;
                if (!hash) scrollTo(null);
                else if ((elm = document.getElementById(hash))) scrollTo(elm);
                else if ((elm = getFirstAnchor(document.getElementsByName(hash)))) scrollTo(elm);
                else if (hash === 'top') scrollTo(null);
            }

            if (autoScrollingEnabled) {
                $rootScope.$watch(function autoScrollWatch() {
                        return $location.hash();
                    },
                    function autoScrollWatchAction(newVal, oldVal) {
                        if (newVal === oldVal && newVal === '') return;
                        jqLiteDocumentLoaded(function () {
                            $rootScope.$evalAsync(scroll);
                        });
                    });
            }
            return scroll;
        }];
    }

    var $animateMinErr = minErr('$animate');
    var $AnimateProvider = ['$provide', function ($provide) {
        this.$$selectors = {};
        this.register = function (name, factory) {
            var key = name + '-animation';
            if (name && name.charAt(0) != '.') throw $animateMinErr('notcsel',
                "Expecting class selector starting with '.' got '{0}'.", name);
            this.$$selectors[name.substr(1)] = key;
            $provide.factory(key, factory);
        };
        this.classNameFilter = function (expression) {
            if (arguments.length === 1) {
                this.$$classNameFilter = (expression instanceof RegExp) ? expression : null;
            }
            return this.$$classNameFilter;
        };
        this.$get = ['$$q', '$$asyncCallback', '$rootScope', function ($$q, $$asyncCallback, $rootScope) {
            var currentDefer;

            function runAnimationPostDigest(fn) {
                var cancelFn, defer = $$q.defer();
                defer.promise.$$cancelFn = function ngAnimateMaybeCancel() {
                    cancelFn && cancelFn();
                };
                $rootScope.$$postDigest(function ngAnimatePostDigest() {
                    cancelFn = fn(function ngAnimateNotifyComplete() {
                        defer.resolve();
                    });
                });
                return defer.promise;
            }

            function resolveElementClasses(element, classes) {
                var toAdd = [], toRemove = [];
                var hasClasses = createMap();
                forEach((element.attr('class') || '').split(/\s+/), function (className) {
                    hasClasses[className] = true;
                });
                forEach(classes, function (status, className) {
                    var hasClass = hasClasses[className];
                    if (status === false && hasClass) {
                        toRemove.push(className);
                    } else if (status === true && !hasClass) {
                        toAdd.push(className);
                    }
                });
                return (toAdd.length + toRemove.length) > 0 &&
                    [toAdd.length ? toAdd : null, toRemove.length ? toRemove : null];
            }

            function cachedClassManipulation(cache, classes, op) {
                for (var i = 0, ii = classes.length; i < ii; ++i) {
                    var className = classes[i];
                    cache[className] = op;
                }
            }

            function asyncPromise() {
                if (!currentDefer) {
                    currentDefer = $$q.defer();
                    $$asyncCallback(function () {
                        currentDefer.resolve();
                        currentDefer = null;
                    });
                }
                return currentDefer.promise;
            }

            function applyStyles(element, options) {
                if (angular.isObject(options)) {
                    var styles = extend(options.from || {}, options.to || {});
                    element.css(styles);
                }
            }

            return {
                animate: function (element, from, to) {
                    applyStyles(element, {from: from, to: to});
                    return asyncPromise();
                },
                enter: function (element, parent, after, options) {
                    applyStyles(element, options);
                    after ? after.after(element)
                        : parent.prepend(element);
                    return asyncPromise();
                },
                leave: function (element, options) {
                    applyStyles(element, options);
                    element.remove();
                    return asyncPromise();
                },
                move: function (element, parent, after, options) {
                    return this.enter(element, parent, after, options);
                },
                addClass: function (element, className, options) {
                    return this.setClass(element, className, [], options);
                },
                $$addClassImmediately: function (element, className, options) {
                    element = jqLite(element);
                    className = !isString(className)
                        ? (isArray(className) ? className.join(' ') : '')
                        : className;
                    forEach(element, function (element) {
                        jqLiteAddClass(element, className);
                    });
                    applyStyles(element, options);
                    return asyncPromise();
                },
                removeClass: function (element, className, options) {
                    return this.setClass(element, [], className, options);
                },
                $$removeClassImmediately: function (element, className, options) {
                    element = jqLite(element);
                    className = !isString(className)
                        ? (isArray(className) ? className.join(' ') : '')
                        : className;
                    forEach(element, function (element) {
                        jqLiteRemoveClass(element, className);
                    });
                    applyStyles(element, options);
                    return asyncPromise();
                },
                setClass: function (element, add, remove, options) {
                    var self = this;
                    var STORAGE_KEY = '$$animateClasses';
                    var createdCache = false;
                    element = jqLite(element);
                    var cache = element.data(STORAGE_KEY);
                    if (!cache) {
                        cache = {
                            classes: {},
                            options: options
                        };
                        createdCache = true;
                    } else if (options && cache.options) {
                        cache.options = angular.extend(cache.options || {}, options);
                    }
                    var classes = cache.classes;
                    add = isArray(add) ? add : add.split(' ');
                    remove = isArray(remove) ? remove : remove.split(' ');
                    cachedClassManipulation(classes, add, true);
                    cachedClassManipulation(classes, remove, false);
                    if (createdCache) {
                        cache.promise = runAnimationPostDigest(function (done) {
                            var cache = element.data(STORAGE_KEY);
                            element.removeData(STORAGE_KEY);
                            if (cache) {
                                var classes = resolveElementClasses(element, cache.classes);
                                if (classes) {
                                    self.$$setClassImmediately(element, classes[0], classes[1], cache.options);
                                }
                            }
                            done();
                        });
                        element.data(STORAGE_KEY, cache);
                    }
                    return cache.promise;
                },
                $$setClassImmediately: function (element, add, remove, options) {
                    add && this.$$addClassImmediately(element, add);
                    remove && this.$$removeClassImmediately(element, remove);
                    applyStyles(element, options);
                    return asyncPromise();
                },
                enabled: noop,
                cancel: noop
            };
        }];
    }];

    function $$AsyncCallbackProvider() {
        this.$get = ['$$rAF', '$timeout', function ($$rAF, $timeout) {
            return $$rAF.supported
                ? function (fn) {
                return $$rAF(fn);
            }
                : function (fn) {
                return $timeout(fn, 0, false);
            };
        }];
    }

    function Browser(window, document, $log, $sniffer) {
        var self = this,
            rawDocument = document[0],
            location = window.location,
            history = window.history,
            setTimeout = window.setTimeout,
            clearTimeout = window.clearTimeout,
            pendingDeferIds = {};
        self.isMock = false;
        var outstandingRequestCount = 0;
        var outstandingRequestCallbacks = [];
        self.$$completeOutstandingRequest = completeOutstandingRequest;
        self.$$incOutstandingRequestCount = function () {
            outstandingRequestCount++;
        };
        function completeOutstandingRequest(fn) {
            try {
                fn.apply(null, sliceArgs(arguments, 1));
            } finally {
                outstandingRequestCount--;
                if (outstandingRequestCount === 0) {
                    while (outstandingRequestCallbacks.length) {
                        try {
                            outstandingRequestCallbacks.pop()();
                        } catch (e) {
                            $log.error(e);
                        }
                    }
                }
            }
        }

        function getHash(url) {
            var index = url.indexOf('#');
            return index === -1 ? '' : url.substr(index);
        }

        self.notifyWhenNoOutstandingRequests = function (callback) {
            forEach(pollFns, function (pollFn) {
                pollFn();
            });
            if (outstandingRequestCount === 0) {
                callback();
            } else {
                outstandingRequestCallbacks.push(callback);
            }
        };
        var pollFns = [],
            pollTimeout;
        self.addPollFn = function (fn) {
            if (isUndefined(pollTimeout)) startPoller(100, setTimeout);
            pollFns.push(fn);
            return fn;
        };
        function startPoller(interval, setTimeout) {
            (function check() {
                forEach(pollFns, function (pollFn) {
                    pollFn();
                });
                pollTimeout = setTimeout(check, interval);
            })();
        }

        var cachedState, lastHistoryState,
            lastBrowserUrl = location.href,
            baseElement = document.find('base'),
            reloadLocation = null;
        cacheState();
        lastHistoryState = cachedState;
        self.url = function (url, replace, state) {
            if (isUndefined(state)) {
                state = null;
            }
            if (location !== window.location) location = window.location;
            if (history !== window.history) history = window.history;
            if (url) {
                var sameState = lastHistoryState === state;
                if (lastBrowserUrl === url && (!$sniffer.history || sameState)) {
                    return self;
                }
                var sameBase = lastBrowserUrl && stripHash(lastBrowserUrl) === stripHash(url);
                lastBrowserUrl = url;
                lastHistoryState = state;
                if ($sniffer.history && (!sameBase || !sameState)) {
                    history[replace ? 'replaceState' : 'pushState'](state, '', url);
                    cacheState();
                    lastHistoryState = cachedState;
                } else {
                    if (!sameBase || reloadLocation) {
                        reloadLocation = url;
                    }
                    if (replace) {
                        location.replace(url);
                    } else if (!sameBase) {
                        location.href = url;
                    } else {
                        location.hash = getHash(url);
                    }
                }
                return self;
            } else {
                return reloadLocation || location.href.replace(/%27/g, "'");
            }
        };
        self.state = function () {
            return cachedState;
        };
        var urlChangeListeners = [],
            urlChangeInit = false;

        function cacheStateAndFireUrlChange() {
            cacheState();
            fireUrlChange();
        }

        function getCurrentState() {
            try {
                return history.state;
            } catch (e) {
            }
        }

        var lastCachedState = null;

        function cacheState() {
            cachedState = getCurrentState();
            cachedState = isUndefined(cachedState) ? null : cachedState;
            if (equals(cachedState, lastCachedState)) {
                cachedState = lastCachedState;
            }
            lastCachedState = cachedState;
        }

        function fireUrlChange() {
            if (lastBrowserUrl === self.url() && lastHistoryState === cachedState) {
                return;
            }
            lastBrowserUrl = self.url();
            lastHistoryState = cachedState;
            forEach(urlChangeListeners, function (listener) {
                listener(self.url(), cachedState);
            });
        }

        self.onUrlChange = function (callback) {
            if (!urlChangeInit) {
                if ($sniffer.history) jqLite(window).on('popstate', cacheStateAndFireUrlChange);
                jqLite(window).on('hashchange', cacheStateAndFireUrlChange);
                urlChangeInit = true;
            }
            urlChangeListeners.push(callback);
            return callback;
        };
        self.$$checkUrlChange = fireUrlChange;
        self.baseHref = function () {
            var href = baseElement.attr('href');
            return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
        };
        var lastCookies = {};
        var lastCookieString = '';
        var cookiePath = self.baseHref();

        function safeDecodeURIComponent(str) {
            try {
                return decodeURIComponent(str);
            } catch (e) {
                return str;
            }
        }

        self.cookies = function (name, value) {
            var cookieLength, cookieArray, cookie, i, index;
            if (name) {
                if (value === undefined) {
                    rawDocument.cookie = encodeURIComponent(name) + "=;path=" + cookiePath +
                        ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
                } else {
                    if (isString(value)) {
                        cookieLength = (rawDocument.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) +
                                ';path=' + cookiePath).length + 1;
                        if (cookieLength > 4096) {
                            $log.warn("Cookie '" + name +
                                "' possibly not set or overflowed because it was too large (" +
                                cookieLength + " > 4096 bytes)!");
                        }
                    }
                }
            } else {
                if (rawDocument.cookie !== lastCookieString) {
                    lastCookieString = rawDocument.cookie;
                    cookieArray = lastCookieString.split("; ");
                    lastCookies = {};
                    for (i = 0; i < cookieArray.length; i++) {
                        cookie = cookieArray[i];
                        index = cookie.indexOf('=');
                        if (index > 0) {
                            name = safeDecodeURIComponent(cookie.substring(0, index));
                            if (lastCookies[name] === undefined) {
                                lastCookies[name] = safeDecodeURIComponent(cookie.substring(index + 1));
                            }
                        }
                    }
                }
                return lastCookies;
            }
        };
        self.defer = function (fn, delay) {
            var timeoutId;
            outstandingRequestCount++;
            timeoutId = setTimeout(function () {
                delete pendingDeferIds[timeoutId];
                completeOutstandingRequest(fn);
            }, delay || 0);
            pendingDeferIds[timeoutId] = true;
            return timeoutId;
        };
        self.defer.cancel = function (deferId) {
            if (pendingDeferIds[deferId]) {
                delete pendingDeferIds[deferId];
                clearTimeout(deferId);
                completeOutstandingRequest(noop);
                return true;
            }
            return false;
        };
    }

    function $BrowserProvider() {
        this.$get = ['$window', '$log', '$sniffer', '$document',
            function ($window, $log, $sniffer, $document) {
                return new Browser($window, $document, $log, $sniffer);
            }];
    }

    function $CacheFactoryProvider() {
        this.$get = function () {
            var caches = {};

            function cacheFactory(cacheId, options) {
                if (cacheId in caches) {
                    throw minErr('$cacheFactory')('iid', "CacheId '{0}' is already taken!", cacheId);
                }
                var size = 0,
                    stats = extend({}, options, {id: cacheId}),
                    data = {},
                    capacity = (options && options.capacity) || Number.MAX_VALUE,
                    lruHash = {},
                    freshEnd = null,
                    staleEnd = null;
                return caches[cacheId] = {
                    put: function (key, value) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key] || (lruHash[key] = {key: key});
                            refresh(lruEntry);
                        }
                        if (isUndefined(value)) return;
                        if (!(key in data)) size++;
                        data[key] = value;
                        if (size > capacity) {
                            this.remove(staleEnd.key);
                        }
                        return value;
                    },
                    get: function (key) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key];
                            if (!lruEntry) return;
                            refresh(lruEntry);
                        }
                        return data[key];
                    },
                    remove: function (key) {
                        if (capacity < Number.MAX_VALUE) {
                            var lruEntry = lruHash[key];
                            if (!lruEntry) return;
                            if (lruEntry == freshEnd) freshEnd = lruEntry.p;
                            if (lruEntry == staleEnd) staleEnd = lruEntry.n;
                            link(lruEntry.n, lruEntry.p);
                            delete lruHash[key];
                        }
                        delete data[key];
                        size--;
                    },
                    removeAll: function () {
                        data = {};
                        size = 0;
                        lruHash = {};
                        freshEnd = staleEnd = null;
                    },
                    destroy: function () {
                        data = null;
                        stats = null;
                        lruHash = null;
                        delete caches[cacheId];
                    },
                    info: function () {
                        return extend({}, stats, {size: size});
                    }
                };
                function refresh(entry) {
                    if (entry != freshEnd) {
                        if (!staleEnd) {
                            staleEnd = entry;
                        } else if (staleEnd == entry) {
                            staleEnd = entry.n;
                        }
                        link(entry.n, entry.p);
                        link(entry, freshEnd);
                        freshEnd = entry;
                        freshEnd.n = null;
                    }
                }

                function link(nextEntry, prevEntry) {
                    if (nextEntry != prevEntry) {
                        if (nextEntry) nextEntry.p = prevEntry;
                        if (prevEntry) prevEntry.n = nextEntry;
                    }
                }
            }

            cacheFactory.info = function () {
                var info = {};
                forEach(caches, function (cache, cacheId) {
                    info[cacheId] = cache.info();
                });
                return info;
            };
            cacheFactory.get = function (cacheId) {
                return caches[cacheId];
            };
            return cacheFactory;
        };
    }

    function $TemplateCacheProvider() {
        this.$get = ['$cacheFactory', function ($cacheFactory) {
            return $cacheFactory('templates');
        }];
    }

    var $compileMinErr = minErr('$compile');
    $CompileProvider.$inject = ['$provide', '$$sanitizeUriProvider'];
    function $CompileProvider($provide, $$sanitizeUriProvider) {
        var hasDirectives = {},
            Suffix = 'Directive',
            COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\w\-]+)\s+(.*)$/,
            CLASS_DIRECTIVE_REGEXP = /(([\w\-]+)(?:\:([^;]+))?;?)/,
            ALL_OR_NOTHING_ATTRS = makeMap('ngSrc,ngSrcset,src,srcset'),
            REQUIRE_PREFIX_REGEXP = /^(?:(\^\^?)?(\?)?(\^\^?)?)?/;
        var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;

        function parseIsolateBindings(scope, directiveName) {
            var LOCAL_REGEXP = /^\s*([@&]|=(\*?))(\??)\s*(\w*)\s*$/;
            var bindings = {};
            forEach(scope, function (definition, scopeName) {
                var match = definition.match(LOCAL_REGEXP);
                if (!match) {
                    throw $compileMinErr('iscp',
                        "Invalid isolate scope definition for directive '{0}'." +
                        " Definition: {... {1}: '{2}' ...}",
                        directiveName, scopeName, definition);
                }
                bindings[scopeName] = {
                    mode: match[1][0],
                    collection: match[2] === '*',
                    optional: match[3] === '?',
                    attrName: match[4] || scopeName
                };
            });
            return bindings;
        }

        this.directive = function registerDirective(name, directiveFactory) {
            assertNotHasOwnProperty(name, 'directive');
            if (isString(name)) {
                assertArg(directiveFactory, 'directiveFactory');
                if (!hasDirectives.hasOwnProperty(name)) {
                    hasDirectives[name] = [];
                    $provide.factory(name + Suffix, ['$injector', '$exceptionHandler',
                        function ($injector, $exceptionHandler) {
                            var directives = [];
                            forEach(hasDirectives[name], function (directiveFactory, index) {
                                try {
                                    var directive = $injector.invoke(directiveFactory);
                                    if (isFunction(directive)) {
                                        directive = {compile: valueFn(directive)};
                                    } else if (!directive.compile && directive.link) {
                                        directive.compile = valueFn(directive.link);
                                    }
                                    directive.priority = directive.priority || 0;
                                    directive.index = index;
                                    directive.name = directive.name || name;
                                    directive.require = directive.require || (directive.controller && directive.name);
                                    directive.restrict = directive.restrict || 'EA';
                                    if (isObject(directive.scope)) {
                                        directive.$$isolateBindings = parseIsolateBindings(directive.scope, directive.name);
                                    }
                                    directives.push(directive);
                                } catch (e) {
                                    $exceptionHandler(e);
                                }
                            });
                            return directives;
                        }]);
                }
                hasDirectives[name].push(directiveFactory);
            } else {
                forEach(name, reverseParams(registerDirective));
            }
            return this;
        };
        this.aHrefSanitizationWhitelist = function (regexp) {
            if (isDefined(regexp)) {
                $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp);
                return this;
            } else {
                return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
            }
        };
        this.imgSrcSanitizationWhitelist = function (regexp) {
            if (isDefined(regexp)) {
                $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp);
                return this;
            } else {
                return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
            }
        };
        var debugInfoEnabled = true;
        this.debugInfoEnabled = function (enabled) {
            if (isDefined(enabled)) {
                debugInfoEnabled = enabled;
                return this;
            }
            return debugInfoEnabled;
        };
        this.$get = [
            '$injector', '$interpolate', '$exceptionHandler', '$templateRequest', '$parse',
            '$controller', '$rootScope', '$document', '$sce', '$animate', '$$sanitizeUri',
            function ($injector, $interpolate, $exceptionHandler, $templateRequest, $parse,
                      $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
                var Attributes = function (element, attributesToCopy) {
                    if (attributesToCopy) {
                        var keys = Object.keys(attributesToCopy);
                        var i, l, key;
                        for (i = 0, l = keys.length; i < l; i++) {
                            key = keys[i];
                            this[key] = attributesToCopy[key];
                        }
                    } else {
                        this.$attr = {};
                    }
                    this.$$element = element;
                };
                Attributes.prototype = {
                    $normalize: directiveNormalize,
                    $addClass: function (classVal) {
                        if (classVal && classVal.length > 0) {
                            $animate.addClass(this.$$element, classVal);
                        }
                    },
                    $removeClass: function (classVal) {
                        if (classVal && classVal.length > 0) {
                            $animate.removeClass(this.$$element, classVal);
                        }
                    },
                    $updateClass: function (newClasses, oldClasses) {
                        var toAdd = tokenDifference(newClasses, oldClasses);
                        if (toAdd && toAdd.length) {
                            $animate.addClass(this.$$element, toAdd);
                        }
                        var toRemove = tokenDifference(oldClasses, newClasses);
                        if (toRemove && toRemove.length) {
                            $animate.removeClass(this.$$element, toRemove);
                        }
                    },
                    $set: function (key, value, writeAttr, attrName) {
                        var node = this.$$element[0],
                            booleanKey = getBooleanAttrName(node, key),
                            aliasedKey = getAliasedAttrName(node, key),
                            observer = key,
                            nodeName;
                        if (booleanKey) {
                            this.$$element.prop(key, value);
                            attrName = booleanKey;
                        } else if (aliasedKey) {
                            this[aliasedKey] = value;
                            observer = aliasedKey;
                        }
                        this[key] = value;
                        if (attrName) {
                            this.$attr[key] = attrName;
                        } else {
                            attrName = this.$attr[key];
                            if (!attrName) {
                                this.$attr[key] = attrName = snake_case(key, '-');
                            }
                        }
                        nodeName = nodeName_(this.$$element);
                        if ((nodeName === 'a' && key === 'href') ||
                            (nodeName === 'img' && key === 'src')) {
                            this[key] = value = $$sanitizeUri(value, key === 'src');
                        } else if (nodeName === 'img' && key === 'srcset') {
                            var result = "";
                            var trimmedSrcset = trim(value);
                            var srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/;
                            var pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/;
                            var rawUris = trimmedSrcset.split(pattern);
                            var nbrUrisWith2parts = Math.floor(rawUris.length / 2);
                            for (var i = 0; i < nbrUrisWith2parts; i++) {
                                var innerIdx = i * 2;
                                result += $$sanitizeUri(trim(rawUris[innerIdx]), true);
                                result += (" " + trim(rawUris[innerIdx + 1]));
                            }
                            var lastTuple = trim(rawUris[i * 2]).split(/\s/);
                            result += $$sanitizeUri(trim(lastTuple[0]), true);
                            if (lastTuple.length === 2) {
                                result += (" " + trim(lastTuple[1]));
                            }
                            this[key] = value = result;
                        }
                        if (writeAttr !== false) {
                            if (value === null || value === undefined) {
                                this.$$element.removeAttr(attrName);
                            } else {
                                this.$$element.attr(attrName, value);
                            }
                        }
                        var $$observers = this.$$observers;
                        $$observers && forEach($$observers[observer], function (fn) {
                            try {
                                fn(value);
                            } catch (e) {
                                $exceptionHandler(e);
                            }
                        });
                    },
                    $observe: function (key, fn) {
                        var attrs = this,
                            $$observers = (attrs.$$observers || (attrs.$$observers = createMap())),
                            listeners = ($$observers[key] || ($$observers[key] = []));
                        listeners.push(fn);
                        $rootScope.$evalAsync(function () {
                            if (!listeners.$$inter && attrs.hasOwnProperty(key)) {
                                fn(attrs[key]);
                            }
                        });
                        return function () {
                            arrayRemove(listeners, fn);
                        };
                    }
                };
                function safeAddClass($element, className) {
                    try {
                        $element.addClass(className);
                    } catch (e) {
                    }
                }

                var startSymbol = $interpolate.startSymbol(),
                    endSymbol = $interpolate.endSymbol(),
                    denormalizeTemplate = (startSymbol == '{{' || endSymbol == '}}')
                        ? identity
                        : function denormalizeTemplate(template) {
                        return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
                    },
                    NG_ATTR_BINDING = /^ngAttr[A-Z]/;
                compile.$$addBindingInfo = debugInfoEnabled ? function $$addBindingInfo($element, binding) {
                    var bindings = $element.data('$binding') || [];
                    if (isArray(binding)) {
                        bindings = bindings.concat(binding);
                    } else {
                        bindings.push(binding);
                    }
                    $element.data('$binding', bindings);
                } : noop;
                compile.$$addBindingClass = debugInfoEnabled ? function $$addBindingClass($element) {
                    safeAddClass($element, 'ng-binding');
                } : noop;
                compile.$$addScopeInfo = debugInfoEnabled ? function $$addScopeInfo($element, scope, isolated, noTemplate) {
                    var dataName = isolated ? (noTemplate ? '$isolateScopeNoTemplate' : '$isolateScope') : '$scope';
                    $element.data(dataName, scope);
                } : noop;
                compile.$$addScopeClass = debugInfoEnabled ? function $$addScopeClass($element, isolated) {
                    safeAddClass($element, isolated ? 'ng-isolate-scope' : 'ng-scope');
                } : noop;
                return compile;
                function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective,
                                 previousCompileContext) {
                    if (!($compileNodes instanceof jqLite)) {
                        $compileNodes = jqLite($compileNodes);
                    }
                    forEach($compileNodes, function (node, index) {
                        if (node.nodeType == NODE_TYPE_TEXT && node.nodeValue.match(/\S+/)) {
                            $compileNodes[index] = jqLite(node).wrap('<span></span>').parent()[0];
                        }
                    });
                    var compositeLinkFn =
                        compileNodes($compileNodes, transcludeFn, $compileNodes,
                            maxPriority, ignoreDirective, previousCompileContext);
                    compile.$$addScopeClass($compileNodes);
                    var namespace = null;
                    return function publicLinkFn(scope, cloneConnectFn, options) {
                        assertArg(scope, 'scope');
                        options = options || {};
                        var parentBoundTranscludeFn = options.parentBoundTranscludeFn,
                            transcludeControllers = options.transcludeControllers,
                            futureParentElement = options.futureParentElement;
                        if (parentBoundTranscludeFn && parentBoundTranscludeFn.$$boundTransclude) {
                            parentBoundTranscludeFn = parentBoundTranscludeFn.$$boundTransclude;
                        }
                        if (!namespace) {
                            namespace = detectNamespaceForChildElements(futureParentElement);
                        }
                        var $linkNode;
                        if (namespace !== 'html') {
                            $linkNode = jqLite(
                                wrapTemplate(namespace, jqLite('<div>').append($compileNodes).html())
                            );
                        } else if (cloneConnectFn) {
                            $linkNode = JQLitePrototype.clone.call($compileNodes);
                        } else {
                            $linkNode = $compileNodes;
                        }
                        if (transcludeControllers) {
                            for (var controllerName in transcludeControllers) {
                                $linkNode.data('$' + controllerName + 'Controller', transcludeControllers[controllerName].instance);
                            }
                        }
                        compile.$$addScopeInfo($linkNode, scope);
                        if (cloneConnectFn) cloneConnectFn($linkNode, scope);
                        if (compositeLinkFn) compositeLinkFn(scope, $linkNode, $linkNode, parentBoundTranscludeFn);
                        return $linkNode;
                    };
                }

                function detectNamespaceForChildElements(parentElement) {
                    var node = parentElement && parentElement[0];
                    if (!node) {
                        return 'html';
                    } else {
                        return nodeName_(node) !== 'foreignobject' && node.toString().match(/SVG/) ? 'svg' : 'html';
                    }
                }

                function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective,
                                      previousCompileContext) {
                    var linkFns = [],
                        attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound, nodeLinkFnFound;
                    for (var i = 0; i < nodeList.length; i++) {
                        attrs = new Attributes();
                        directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined,
                            ignoreDirective);
                        nodeLinkFn = (directives.length)
                            ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement,
                            null, [], [], previousCompileContext)
                            : null;
                        if (nodeLinkFn && nodeLinkFn.scope) {
                            compile.$$addScopeClass(attrs.$$element);
                        }
                        childLinkFn = (nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length)
                            ? null
                            : compileNodes(childNodes,
                            nodeLinkFn ? (
                            (nodeLinkFn.transcludeOnThisElement || !nodeLinkFn.templateOnThisElement)
                            && nodeLinkFn.transclude) : transcludeFn);
                        if (nodeLinkFn || childLinkFn) {
                            linkFns.push(i, nodeLinkFn, childLinkFn);
                            linkFnFound = true;
                            nodeLinkFnFound = nodeLinkFnFound || nodeLinkFn;
                        }
                        previousCompileContext = null;
                    }
                    return linkFnFound ? compositeLinkFn : null;
                    function compositeLinkFn(scope, nodeList, $rootElement, parentBoundTranscludeFn) {
                        var nodeLinkFn, childLinkFn, node, childScope, i, ii, idx, childBoundTranscludeFn;
                        var stableNodeList;
                        if (nodeLinkFnFound) {
                            var nodeListLength = nodeList.length;
                            stableNodeList = new Array(nodeListLength);
                            for (i = 0; i < linkFns.length; i += 3) {
                                idx = linkFns[i];
                                stableNodeList[idx] = nodeList[idx];
                            }
                        } else {
                            stableNodeList = nodeList;
                        }
                        for (i = 0, ii = linkFns.length; i < ii;) {
                            node = stableNodeList[linkFns[i++]];
                            nodeLinkFn = linkFns[i++];
                            childLinkFn = linkFns[i++];
                            if (nodeLinkFn) {
                                if (nodeLinkFn.scope) {
                                    childScope = scope.$new();
                                    compile.$$addScopeInfo(jqLite(node), childScope);
                                } else {
                                    childScope = scope;
                                }
                                if (nodeLinkFn.transcludeOnThisElement) {
                                    childBoundTranscludeFn = createBoundTranscludeFn(
                                        scope, nodeLinkFn.transclude, parentBoundTranscludeFn,
                                        nodeLinkFn.elementTranscludeOnThisElement);
                                } else if (!nodeLinkFn.templateOnThisElement && parentBoundTranscludeFn) {
                                    childBoundTranscludeFn = parentBoundTranscludeFn;
                                } else if (!parentBoundTranscludeFn && transcludeFn) {
                                    childBoundTranscludeFn = createBoundTranscludeFn(scope, transcludeFn);
                                } else {
                                    childBoundTranscludeFn = null;
                                }
                                nodeLinkFn(childLinkFn, childScope, node, $rootElement, childBoundTranscludeFn);
                            } else if (childLinkFn) {
                                childLinkFn(scope, node.childNodes, undefined, parentBoundTranscludeFn);
                            }
                        }
                    }
                }

                function createBoundTranscludeFn(scope, transcludeFn, previousBoundTranscludeFn, elementTransclusion) {
                    var boundTranscludeFn = function (transcludedScope, cloneFn, controllers, futureParentElement, containingScope) {
                        if (!transcludedScope) {
                            transcludedScope = scope.$new(false, containingScope);
                            transcludedScope.$$transcluded = true;
                        }
                        return transcludeFn(transcludedScope, cloneFn, {
                            parentBoundTranscludeFn: previousBoundTranscludeFn,
                            transcludeControllers: controllers,
                            futureParentElement: futureParentElement
                        });
                    };
                    return boundTranscludeFn;
                }
                function transPrefix(input){
                    if(/v-/.test(input)){
                        return input.replace(/v\-/, "ng-");
                    }
                    return input;
                }
                function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
                    var nodeType = node.nodeType,
                        attrsMap = attrs.$attr,
                        match,
                        className;
                    switch (nodeType) {
                        case NODE_TYPE_ELEMENT:
                            addDirective(directives,
                                directiveNormalize(nodeName_(node)), 'E', maxPriority, ignoreDirective);
                            for (var attr, name, nName, ngAttrName, value, isNgAttr, nAttrs = node.attributes,
                                     j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
                                var attrStartName = false;
                                var attrEndName = false;
                                attr = nAttrs[j];
                                name = attr.name;
                                value = trim(attr.value);
                                name = transPrefix(name);
                                ngAttrName = directiveNormalize(name);
                                if (isNgAttr = NG_ATTR_BINDING.test(ngAttrName)) {
                                    name = name.replace(PREFIX_REGEXP, '')
                                        .substr(8).replace(/_(.)/g, function (match, letter) {
                                            return letter.toUpperCase();
                                        });
                                }
                                var directiveNName = ngAttrName.replace(/(Start|End)$/, '');
                                if (directiveIsMultiElement(directiveNName)) {
                                    if (ngAttrName === directiveNName + 'Start') {
                                        attrStartName = name;
                                        attrEndName = name.substr(0, name.length - 5) + 'end';
                                        name = name.substr(0, name.length - 6);
                                    }
                                }
                                name = transPrefix(name.toLowerCase());
                                nName = directiveNormalize(name);
                                attrsMap[nName] = name;
                                if (isNgAttr || !attrs.hasOwnProperty(nName)) {
                                    attrs[nName] = value;
                                    if (getBooleanAttrName(node, nName)) {
                                        attrs[nName] = true;
                                    }
                                }
                                addAttrInterpolateDirective(node, directives, value, nName, isNgAttr);
                                addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName,
                                    attrEndName);
                            }
                            className = node.className;
                            if (isObject(className)) {
                                className = className.animVal;
                            }
                            if (isString(className) && className !== '') {
                                while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
                                    name = transPrefix(match[2]);
                                    nName = directiveNormalize(name);
                                    if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                                        attrs[nName] = trim(match[3]);
                                    }
                                    className = className.substr(match.index + match[0].length);
                                }
                            }
                            break;
                        case NODE_TYPE_TEXT:
                            addTextInterpolateDirective(directives, node.nodeValue);
                            break;
                        case NODE_TYPE_COMMENT:
                            try {
                                match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
                                if (match) {
                                    nName = directiveNormalize(match[1]);
                                    if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
                                        attrs[nName] = trim(match[2]);
                                    }
                                }
                            } catch (e) {
                            }
                            break;
                    }
                    directives.sort(byPriority);
                    return directives;
                }

                function groupScan(node, attrStart, attrEnd) {
                    var nodes = [];
                    var depth = 0;
                    if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
                        do {
                            if (!node) {
                                throw $compileMinErr('uterdir',
                                    "Unterminated attribute, found '{0}' but no matching '{1}' found.",
                                    attrStart, attrEnd);
                            }
                            if (node.nodeType == NODE_TYPE_ELEMENT) {
                                if (node.hasAttribute(attrStart)) depth++;
                                if (node.hasAttribute(attrEnd)) depth--;
                            }
                            nodes.push(node);
                            node = node.nextSibling;
                        } while (depth > 0);
                    } else {
                        nodes.push(node);
                    }
                    return jqLite(nodes);
                }

                function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
                    return function (scope, element, attrs, controllers, transcludeFn) {
                        element = groupScan(element[0], attrStart, attrEnd);
                        return linkFn(scope, element, attrs, controllers, transcludeFn);
                    };
                }

                function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn,
                                               jqCollection, originalReplaceDirective, preLinkFns, postLinkFns,
                                               previousCompileContext) {
                    previousCompileContext = previousCompileContext || {};
                    var terminalPriority = -Number.MAX_VALUE,
                        newScopeDirective,
                        controllerDirectives = previousCompileContext.controllerDirectives,
                        controllers,
                        newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective,
                        templateDirective = previousCompileContext.templateDirective,
                        nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective,
                        hasTranscludeDirective = false,
                        hasTemplate = false,
                        hasElementTranscludeDirective = previousCompileContext.hasElementTranscludeDirective,
                        $compileNode = templateAttrs.$$element = jqLite(compileNode),
                        directive,
                        directiveName,
                        $template,
                        replaceDirective = originalReplaceDirective,
                        childTranscludeFn = transcludeFn,
                        linkFn,
                        directiveValue;
                    for (var i = 0, ii = directives.length; i < ii; i++) {
                        directive = directives[i];
                        var attrStart = directive.$$start;
                        var attrEnd = directive.$$end;
                        if (attrStart) {
                            $compileNode = groupScan(compileNode, attrStart, attrEnd);
                        }
                        $template = undefined;
                        if (terminalPriority > directive.priority) {
                            break;
                        }
                        if (directiveValue = directive.scope) {
                            if (!directive.templateUrl) {
                                if (isObject(directiveValue)) {
                                    assertNoDuplicate('new/isolated scope', newIsolateScopeDirective || newScopeDirective,
                                        directive, $compileNode);
                                    newIsolateScopeDirective = directive;
                                } else {
                                    assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive,
                                        $compileNode);
                                }
                            }
                            newScopeDirective = newScopeDirective || directive;
                        }
                        directiveName = directive.name;
                        if (!directive.templateUrl && directive.controller) {
                            directiveValue = directive.controller;
                            controllerDirectives = controllerDirectives || {};
                            assertNoDuplicate("'" + directiveName + "' controller",
                                controllerDirectives[directiveName], directive, $compileNode);
                            controllerDirectives[directiveName] = directive;
                        }
                        if (directiveValue = directive.transclude) {
                            hasTranscludeDirective = true;
                            if (!directive.$$tlb) {
                                assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
                                nonTlbTranscludeDirective = directive;
                            }
                            if (directiveValue == 'element') {
                                hasElementTranscludeDirective = true;
                                terminalPriority = directive.priority;
                                $template = $compileNode;
                                $compileNode = templateAttrs.$$element =
                                    jqLite(document.createComment(' ' + directiveName + ': ' +
                                        templateAttrs[directiveName] + ' '));
                                compileNode = $compileNode[0];
                                replaceWith(jqCollection, sliceArgs($template), compileNode);
                                childTranscludeFn = compile($template, transcludeFn, terminalPriority,
                                    replaceDirective && replaceDirective.name, {
                                        nonTlbTranscludeDirective: nonTlbTranscludeDirective
                                    });
                            } else {
                                $template = jqLite(jqLiteClone(compileNode)).contents();
                                $compileNode.empty();
                                childTranscludeFn = compile($template, transcludeFn);
                            }
                        }
                        if (directive.template) {
                            hasTemplate = true;
                            assertNoDuplicate('template', templateDirective, directive, $compileNode);
                            templateDirective = directive;
                            directiveValue = (isFunction(directive.template))
                                ? directive.template($compileNode, templateAttrs)
                                : directive.template;
                            directiveValue = denormalizeTemplate(directiveValue);
                            if (directive.replace) {
                                replaceDirective = directive;
                                if (jqLiteIsTextNode(directiveValue)) {
                                    $template = [];
                                } else {
                                    $template = removeComments(wrapTemplate(directive.templateNamespace, trim(directiveValue)));
                                }
                                compileNode = $template[0];
                                if ($template.length != 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
                                    throw $compileMinErr('tplrt',
                                        "Template for directive '{0}' must have exactly one root element. {1}",
                                        directiveName, '');
                                }
                                replaceWith(jqCollection, $compileNode, compileNode);
                                var newTemplateAttrs = {$attr: {}};
                                var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
                                var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                                if (newIsolateScopeDirective) {
                                    markDirectivesAsIsolate(templateDirectives);
                                }
                                directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
                                mergeTemplateAttributes(templateAttrs, newTemplateAttrs);
                                ii = directives.length;
                            } else {
                                $compileNode.html(directiveValue);
                            }
                        }
                        if (directive.templateUrl) {
                            hasTemplate = true;
                            assertNoDuplicate('template', templateDirective, directive, $compileNode);
                            templateDirective = directive;
                            if (directive.replace) {
                                replaceDirective = directive;
                            }
                            nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode,
                                templateAttrs, jqCollection, hasTranscludeDirective && childTranscludeFn, preLinkFns, postLinkFns, {
                                    controllerDirectives: controllerDirectives,
                                    newIsolateScopeDirective: newIsolateScopeDirective,
                                    templateDirective: templateDirective,
                                    nonTlbTranscludeDirective: nonTlbTranscludeDirective
                                });
                            ii = directives.length;
                        } else if (directive.compile) {
                            try {
                                linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
                                if (isFunction(linkFn)) {
                                    addLinkFns(null, linkFn, attrStart, attrEnd);
                                } else if (linkFn) {
                                    addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                                }
                            } catch (e) {
                                $exceptionHandler(e, startingTag($compileNode));
                            }
                        }
                        if (directive.terminal) {
                            nodeLinkFn.terminal = true;
                            terminalPriority = Math.max(terminalPriority, directive.priority);
                        }
                    }
                    nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
                    nodeLinkFn.transcludeOnThisElement = hasTranscludeDirective;
                    nodeLinkFn.elementTranscludeOnThisElement = hasElementTranscludeDirective;
                    nodeLinkFn.templateOnThisElement = hasTemplate;
                    nodeLinkFn.transclude = childTranscludeFn;
                    previousCompileContext.hasElementTranscludeDirective = hasElementTranscludeDirective;
                    return nodeLinkFn;
                    function addLinkFns(pre, post, attrStart, attrEnd) {
                        if (pre) {
                            if (attrStart) pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
                            pre.require = directive.require;
                            pre.directiveName = directiveName;
                            if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                                pre = cloneAndAnnotateFn(pre, {isolateScope: true});
                            }
                            preLinkFns.push(pre);
                        }
                        if (post) {
                            if (attrStart) post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
                            post.require = directive.require;
                            post.directiveName = directiveName;
                            if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                                post = cloneAndAnnotateFn(post, {isolateScope: true});
                            }
                            postLinkFns.push(post);
                        }
                    }

                    function getControllers(directiveName, require, $element, elementControllers) {
                        var value, retrievalMethod = 'data', optional = false;
                        var $searchElement = $element;
                        var match;
                        if (isString(require)) {
                            match = require.match(REQUIRE_PREFIX_REGEXP);
                            require = require.substring(match[0].length);
                            if (match[3]) {
                                if (match[1]) match[3] = null;
                                else match[1] = match[3];
                            }
                            if (match[1] === '^') {
                                retrievalMethod = 'inheritedData';
                            } else if (match[1] === '^^') {
                                retrievalMethod = 'inheritedData';
                                $searchElement = $element.parent();
                            }
                            if (match[2] === '?') {
                                optional = true;
                            }
                            value = null;
                            if (elementControllers && retrievalMethod === 'data') {
                                if (value = elementControllers[require]) {
                                    value = value.instance;
                                }
                            }
                            value = value || $searchElement[retrievalMethod]('$' + require + 'Controller');
                            if (!value && !optional) {
                                throw $compileMinErr('ctreq',
                                    "Controller '{0}', required by directive '{1}', can't be found!",
                                    require, directiveName);
                            }
                            return value || null;
                        } else if (isArray(require)) {
                            value = [];
                            forEach(require, function (require) {
                                value.push(getControllers(directiveName, require, $element, elementControllers));
                            });
                        }
                        return value;
                    }

                    function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
                        var i, ii, linkFn, controller, isolateScope, elementControllers, transcludeFn, $element,
                            attrs;
                        if (compileNode === linkNode) {
                            attrs = templateAttrs;
                            $element = templateAttrs.$$element;
                        } else {
                            $element = jqLite(linkNode);
                            attrs = new Attributes($element, templateAttrs);
                        }
                        if (newIsolateScopeDirective) {
                            isolateScope = scope.$new(true);
                        }
                        if (boundTranscludeFn) {
                            transcludeFn = controllersBoundTransclude;
                            transcludeFn.$$boundTransclude = boundTranscludeFn;
                        }
                        if (controllerDirectives) {
                            controllers = {};
                            elementControllers = {};
                            forEach(controllerDirectives, function (directive) {
                                var locals = {
                                    $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                                    $element: $element,
                                    $attrs: attrs,
                                    $transclude: transcludeFn
                                }, controllerInstance;
                                controller = directive.controller;
                                if (controller == '@') {
                                    controller = attrs[directive.name];
                                }
                                controllerInstance = $controller(controller, locals, true, directive.controllerAs);
                                elementControllers[directive.name] = controllerInstance;
                                if (!hasElementTranscludeDirective) {
                                    $element.data('$' + directive.name + 'Controller', controllerInstance.instance);
                                }
                                controllers[directive.name] = controllerInstance;
                            });
                        }
                        if (newIsolateScopeDirective) {
                            compile.$$addScopeInfo($element, isolateScope, true, !(templateDirective && (templateDirective === newIsolateScopeDirective ||
                            templateDirective === newIsolateScopeDirective.$$originalDirective)));
                            compile.$$addScopeClass($element, true);
                            var isolateScopeController = controllers && controllers[newIsolateScopeDirective.name];
                            var isolateBindingContext = isolateScope;
                            if (isolateScopeController && isolateScopeController.identifier &&
                                newIsolateScopeDirective.bindToController === true) {
                                isolateBindingContext = isolateScopeController.instance;
                            }
                            forEach(isolateScope.$$isolateBindings = newIsolateScopeDirective.$$isolateBindings, function (definition, scopeName) {
                                var attrName = definition.attrName,
                                    optional = definition.optional,
                                    mode = definition.mode,
                                    lastValue,
                                    parentGet, parentSet, compare;
                                switch (mode) {
                                    case '@':
                                        attrs.$observe(attrName, function (value) {
                                            isolateBindingContext[scopeName] = value;
                                        });
                                        attrs.$$observers[attrName].$$scope = scope;
                                        if (attrs[attrName]) {
                                            isolateBindingContext[scopeName] = $interpolate(attrs[attrName])(scope);
                                        }
                                        break;
                                    case '=':
                                        if (optional && !attrs[attrName]) {
                                            return;
                                        }
                                        parentGet = $parse(attrs[attrName]);
                                        if (parentGet.literal) {
                                            compare = equals;
                                        } else {
                                            compare = function (a, b) {
                                                return a === b || (a !== a && b !== b);
                                            };
                                        }
                                        parentSet = parentGet.assign || function () {
                                                lastValue = isolateBindingContext[scopeName] = parentGet(scope);
                                                throw $compileMinErr('nonassign',
                                                    "Expression '{0}' used with directive '{1}' is non-assignable!",
                                                    attrs[attrName], newIsolateScopeDirective.name);
                                            };
                                        lastValue = isolateBindingContext[scopeName] = parentGet(scope);
                                        var parentValueWatch = function parentValueWatch(parentValue) {
                                            if (!compare(parentValue, isolateBindingContext[scopeName])) {
                                                if (!compare(parentValue, lastValue)) {
                                                    isolateBindingContext[scopeName] = parentValue;
                                                } else {
                                                    parentSet(scope, parentValue = isolateBindingContext[scopeName]);
                                                }
                                            }
                                            return lastValue = parentValue;
                                        };
                                        parentValueWatch.$stateful = true;
                                        var unwatch;
                                        if (definition.collection) {
                                            unwatch = scope.$watchCollection(attrs[attrName], parentValueWatch);
                                        } else {
                                            unwatch = scope.$watch($parse(attrs[attrName], parentValueWatch), null, parentGet.literal);
                                        }
                                        isolateScope.$on('$destroy', unwatch);
                                        break;
                                    case '&':
                                        parentGet = $parse(attrs[attrName]);
                                        isolateBindingContext[scopeName] = function (locals) {
                                            return parentGet(scope, locals);
                                        };
                                        break;
                                }
                            });
                        }
                        if (controllers) {
                            forEach(controllers, function (controller) {
                                controller();
                            });
                            controllers = null;
                        }
                        for (i = 0, ii = preLinkFns.length; i < ii; i++) {
                            linkFn = preLinkFns[i];
                            invokeLinkFn(linkFn,
                                linkFn.isolateScope ? isolateScope : scope,
                                $element,
                                attrs,
                                linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers),
                                transcludeFn
                            );
                        }
                        var scopeToChild = scope;
                        if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
                            scopeToChild = isolateScope;
                        }
                        childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);
                        for (i = postLinkFns.length - 1; i >= 0; i--) {
                            linkFn = postLinkFns[i];
                            invokeLinkFn(linkFn,
                                linkFn.isolateScope ? isolateScope : scope,
                                $element,
                                attrs,
                                linkFn.require && getControllers(linkFn.directiveName, linkFn.require, $element, elementControllers),
                                transcludeFn
                            );
                        }
                        function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {
                            var transcludeControllers;
                            if (!isScope(scope)) {
                                futureParentElement = cloneAttachFn;
                                cloneAttachFn = scope;
                                scope = undefined;
                            }
                            if (hasElementTranscludeDirective) {
                                transcludeControllers = elementControllers;
                            }
                            if (!futureParentElement) {
                                futureParentElement = hasElementTranscludeDirective ? $element.parent() : $element;
                            }
                            return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers, futureParentElement, scopeToChild);
                        }
                    }
                }

                function markDirectivesAsIsolate(directives) {
                    for (var j = 0, jj = directives.length; j < jj; j++) {
                        directives[j] = inherit(directives[j], {$$isolateScope: true});
                    }
                }

                function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName,
                                      endAttrName) {
                    if (name === ignoreDirective) return null;
                    var match = null;
                    if (hasDirectives.hasOwnProperty(name)) {
                        for (var directive, directives = $injector.get(name + Suffix),
                                 i = 0, ii = directives.length; i < ii; i++) {
                            try {
                                directive = directives[i];
                                if ((maxPriority === undefined || maxPriority > directive.priority) &&
                                    directive.restrict.indexOf(location) != -1) {
                                    if (startAttrName) {
                                        directive = inherit(directive, {$$start: startAttrName, $$end: endAttrName});
                                    }
                                    tDirectives.push(directive);
                                    match = directive;
                                }
                            } catch (e) {
                                $exceptionHandler(e);
                            }
                        }
                    }
                    return match;
                }

                function directiveIsMultiElement(name) {
                    if (hasDirectives.hasOwnProperty(name)) {
                        for (var directive, directives = $injector.get(name + Suffix),
                                 i = 0, ii = directives.length; i < ii; i++) {
                            directive = directives[i];
                            if (directive.multiElement) {
                                return true;
                            }
                        }
                    }
                    return false;
                }

                function mergeTemplateAttributes(dst, src) {
                    var srcAttr = src.$attr,
                        dstAttr = dst.$attr,
                        $element = dst.$$element;
                    forEach(dst, function (value, key) {
                        if (key.charAt(0) != '$') {
                            if (src[key] && src[key] !== value) {
                                value += (key === 'style' ? ';' : ' ') + src[key];
                            }
                            dst.$set(key, value, true, srcAttr[key]);
                        }
                    });
                    forEach(src, function (value, key) {
                        if (key == 'class') {
                            safeAddClass($element, value);
                            dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;
                        } else if (key == 'style') {
                            $element.attr('style', $element.attr('style') + ';' + value);
                            dst['style'] = (dst['style'] ? dst['style'] + ';' : '') + value;
                        } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
                            dst[key] = value;
                            dstAttr[key] = srcAttr[key];
                        }
                    });
                }

                function compileTemplateUrl(directives, $compileNode, tAttrs,
                                            $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
                    var linkQueue = [],
                        afterTemplateNodeLinkFn,
                        afterTemplateChildLinkFn,
                        beforeTemplateCompileNode = $compileNode[0],
                        origAsyncDirective = directives.shift(),
                        derivedSyncDirective = inherit(origAsyncDirective, {
                            templateUrl: null, transclude: null, replace: null, $$originalDirective: origAsyncDirective
                        }),
                        templateUrl = (isFunction(origAsyncDirective.templateUrl))
                            ? origAsyncDirective.templateUrl($compileNode, tAttrs)
                            : origAsyncDirective.templateUrl,
                        templateNamespace = origAsyncDirective.templateNamespace;
                    $compileNode.empty();
                    $templateRequest(templateUrl)
                        .then(function (content) {
                            var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
                            content = denormalizeTemplate(content);
                            if (origAsyncDirective.replace) {
                                if (jqLiteIsTextNode(content)) {
                                    $template = [];
                                } else {
                                    $template = removeComments(wrapTemplate(templateNamespace, trim(content)));
                                }
                                compileNode = $template[0];
                                if ($template.length != 1 || compileNode.nodeType !== NODE_TYPE_ELEMENT) {
                                    throw $compileMinErr('tplrt',
                                        "Template for directive '{0}' must have exactly one root element. {1}",
                                        origAsyncDirective.name, templateUrl);
                                }
                                tempTemplateAttrs = {$attr: {}};
                                replaceWith($rootElement, $compileNode, compileNode);
                                var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
                                if (isObject(origAsyncDirective.scope)) {
                                    markDirectivesAsIsolate(templateDirectives);
                                }
                                directives = templateDirectives.concat(directives);
                                mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
                            } else {
                                compileNode = beforeTemplateCompileNode;
                                $compileNode.html(content);
                            }
                            directives.unshift(derivedSyncDirective);
                            afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs,
                                childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns,
                                previousCompileContext);
                            forEach($rootElement, function (node, i) {
                                if (node == compileNode) {
                                    $rootElement[i] = $compileNode[0];
                                }
                            });
                            afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);
                            while (linkQueue.length) {
                                var scope = linkQueue.shift(),
                                    beforeTemplateLinkNode = linkQueue.shift(),
                                    linkRootElement = linkQueue.shift(),
                                    boundTranscludeFn = linkQueue.shift(),
                                    linkNode = $compileNode[0];
                                if (scope.$$destroyed) continue;
                                if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                                    var oldClasses = beforeTemplateLinkNode.className;
                                    if (!(previousCompileContext.hasElementTranscludeDirective &&
                                        origAsyncDirective.replace)) {
                                        linkNode = jqLiteClone(compileNode);
                                    }
                                    replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);
                                    safeAddClass(jqLite(linkNode), oldClasses);
                                }
                                if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
                                    childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
                                } else {
                                    childBoundTranscludeFn = boundTranscludeFn;
                                }
                                afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement,
                                    childBoundTranscludeFn);
                            }
                            linkQueue = null;
                        });
                    return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
                        var childBoundTranscludeFn = boundTranscludeFn;
                        if (scope.$$destroyed) return;
                        if (linkQueue) {
                            linkQueue.push(scope,
                                node,
                                rootElement,
                                childBoundTranscludeFn);
                        } else {
                            if (afterTemplateNodeLinkFn.transcludeOnThisElement) {
                                childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude, boundTranscludeFn);
                            }
                            afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, childBoundTranscludeFn);
                        }
                    };
                }

                function byPriority(a, b) {
                    var diff = b.priority - a.priority;
                    if (diff !== 0) return diff;
                    if (a.name !== b.name) return (a.name < b.name) ? -1 : 1;
                    return a.index - b.index;
                }

                function assertNoDuplicate(what, previousDirective, directive, element) {
                    if (previousDirective) {
                        throw $compileMinErr('multidir', 'Multiple directives [{0}, {1}] asking for {2} on: {3}',
                            previousDirective.name, directive.name, what, startingTag(element));
                    }
                }

                function addTextInterpolateDirective(directives, text) {
                    var interpolateFn = $interpolate(text, true);
                    if (interpolateFn) {
                        directives.push({
                            priority: 0,
                            compile: function textInterpolateCompileFn(templateNode) {
                                var templateNodeParent = templateNode.parent(),
                                    hasCompileParent = !!templateNodeParent.length;
                                if (hasCompileParent) compile.$$addBindingClass(templateNodeParent);
                                return function textInterpolateLinkFn(scope, node) {
                                    var parent = node.parent();
                                    if (!hasCompileParent) compile.$$addBindingClass(parent);
                                    compile.$$addBindingInfo(parent, interpolateFn.expressions);
                                    scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                                        node[0].nodeValue = value;
                                    });
                                };
                            }
                        });
                    }
                }

                function wrapTemplate(type, template) {
                    type = lowercase(type || 'html');
                    switch (type) {
                        case 'svg':
                        case 'math':
                            var wrapper = document.createElement('div');
                            wrapper.innerHTML = '<' + type + '>' + template + '</' + type + '>';
                            return wrapper.childNodes[0].childNodes;
                        default:
                            return template;
                    }
                }

                function getTrustedContext(node, attrNormalizedName) {
                    if (attrNormalizedName == "srcdoc") {
                        return $sce.HTML;
                    }
                    var tag = nodeName_(node);
                    if (attrNormalizedName == "xlinkHref" ||
                        (tag == "form" && attrNormalizedName == "action") ||
                        (tag != "img" && (attrNormalizedName == "src" ||
                        attrNormalizedName == "ngSrc"))) {
                        return $sce.RESOURCE_URL;
                    }
                }

                function addAttrInterpolateDirective(node, directives, value, name, allOrNothing) {
                    var trustedContext = getTrustedContext(node, name);
                    allOrNothing = ALL_OR_NOTHING_ATTRS[name] || allOrNothing;
                    var interpolateFn = $interpolate(value, true, trustedContext, allOrNothing);
                    if (!interpolateFn) return;
                    if (name === "multiple" && nodeName_(node) === "select") {
                        throw $compileMinErr("selmulti",
                            "Binding to the 'multiple' attribute is not supported. Element: {0}",
                            startingTag(node));
                    }
                    directives.push({
                        priority: 100,
                        compile: function () {
                            return {
                                pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                                    var $$observers = (attr.$$observers || (attr.$$observers = {}));
                                    if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
                                        throw $compileMinErr('nodomevents',
                                            "Interpolations for HTML DOM event attributes are disallowed.  Please use the " +
                                            "ng- versions (such as ng-click instead of onclick) instead.");
                                    }
                                    var newValue = attr[name];
                                    if (newValue !== value) {
                                        interpolateFn = newValue && $interpolate(newValue, true, trustedContext, allOrNothing);
                                        value = newValue;
                                    }
                                    if (!interpolateFn) return;
                                    attr[name] = interpolateFn(scope);
                                    ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                                    (attr.$$observers && attr.$$observers[name].$$scope || scope).
                                        $watch(interpolateFn, function interpolateFnWatchAction(newValue, oldValue) {
                                            if (name === 'class' && newValue != oldValue) {
                                                attr.$updateClass(newValue, oldValue);
                                            } else {
                                                attr.$set(name, newValue);
                                            }
                                        });
                                }
                            };
                        }
                    });
                }

                function replaceWith($rootElement, elementsToRemove, newNode) {
                    var firstElementToRemove = elementsToRemove[0],
                        removeCount = elementsToRemove.length,
                        parent = firstElementToRemove.parentNode,
                        i, ii;
                    if ($rootElement) {
                        for (i = 0, ii = $rootElement.length; i < ii; i++) {
                            if ($rootElement[i] == firstElementToRemove) {
                                $rootElement[i++] = newNode;
                                for (var j = i, j2 = j + removeCount - 1,
                                         jj = $rootElement.length;
                                     j < jj; j++, j2++) {
                                    if (j2 < jj) {
                                        $rootElement[j] = $rootElement[j2];
                                    } else {
                                        delete $rootElement[j];
                                    }
                                }
                                $rootElement.length -= removeCount - 1;
                                if ($rootElement.context === firstElementToRemove) {
                                    $rootElement.context = newNode;
                                }
                                break;
                            }
                        }
                    }
                    if (parent) {
                        parent.replaceChild(newNode, firstElementToRemove);
                    }
                    var fragment = document.createDocumentFragment();
                    fragment.appendChild(firstElementToRemove);
                    jqLite(newNode).data(jqLite(firstElementToRemove).data());
                    if (!jQuery) {
                        delete jqLite.cache[firstElementToRemove[jqLite.expando]];
                    } else {
                        skipDestroyOnNextJQueryCleanData = true;
                        jQuery.cleanData([firstElementToRemove]);
                    }
                    for (var k = 1, kk = elementsToRemove.length; k < kk; k++) {
                        var element = elementsToRemove[k];
                        jqLite(element).remove();
                        fragment.appendChild(element);
                        delete elementsToRemove[k];
                    }
                    elementsToRemove[0] = newNode;
                    elementsToRemove.length = 1;
                }

                function cloneAndAnnotateFn(fn, annotation) {
                    return extend(function () {
                        return fn.apply(null, arguments);
                    }, fn, annotation);
                }

                function invokeLinkFn(linkFn, scope, $element, attrs, controllers, transcludeFn) {
                    try {
                        linkFn(scope, $element, attrs, controllers, transcludeFn);
                    } catch (e) {
                        $exceptionHandler(e, startingTag($element));
                    }
                }
            }];
    }

    var PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;

    function directiveNormalize(name) {
        return camelCase(name.replace(PREFIX_REGEXP, ''));
    }

    function nodesetLinkingFn(/* angular.Scope */ scope, nodeList, rootElement, boundTranscludeFn) {
    }

    function directiveLinkingFn(/* nodesetLinkingFn */ nodesetLinkingFn, scope, node, rootElement, boundTranscludeFn) {
    }

    function tokenDifference(str1, str2) {
        var values = '',
            tokens1 = str1.split(/\s+/),
            tokens2 = str2.split(/\s+/);
        outer:
            for (var i = 0; i < tokens1.length; i++) {
                var token = tokens1[i];
                for (var j = 0; j < tokens2.length; j++) {
                    if (token == tokens2[j]) continue outer;
                }
                values += (values.length > 0 ? ' ' : '') + token;
            }
        return values;
    }

    function removeComments(jqNodes) {
        jqNodes = jqLite(jqNodes);
        var i = jqNodes.length;
        if (i <= 1) {
            return jqNodes;
        }
        while (i--) {
            var node = jqNodes[i];
            if (node.nodeType === NODE_TYPE_COMMENT) {
                splice.call(jqNodes, i, 1);
            }
        }
        return jqNodes;
    }

    var $controllerMinErr = minErr('$controller');

    function $ControllerProvider() {
        var controllers = {},
            globals = false,
            CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
        this.register = function (name, constructor) {
            assertNotHasOwnProperty(name, 'controller');
            if (isObject(name)) {
                extend(controllers, name);
            } else {
                controllers[name] = constructor;
            }
        };
        this.allowGlobals = function () {
            globals = true;
        };
        this.$get = ['$injector', '$window', function ($injector, $window) {
            return function (expression, locals, later, ident) {
                var instance, match, constructor, identifier;
                later = later === true;
                if (ident && isString(ident)) {
                    identifier = ident;
                }
                if (isString(expression)) {
                    match = expression.match(CNTRL_REG);
                    if (!match) {
                        throw $controllerMinErr('ctrlfmt',
                            "Badly formed controller string '{0}'. " +
                            "Must match `__name__ as __id__` or `__name__`.", expression);
                    }
                    constructor = match[1],
                        identifier = identifier || match[3];
                    expression = controllers.hasOwnProperty(constructor)
                        ? controllers[constructor]
                        : getter(locals.$scope, constructor, true) ||
                    (globals ? getter($window, constructor, true) : undefined);
                    assertArgFn(expression, constructor, true);
                }
                if (later) {
                    var controllerPrototype = (isArray(expression) ?
                        expression[expression.length - 1] : expression).prototype;
                    instance = Object.create(controllerPrototype || null);
                    if (identifier) {
                        addIdentifier(locals, identifier, instance, constructor || expression.name);
                    }
                    return extend(function () {
                        $injector.invoke(expression, instance, locals, constructor);
                        return instance;
                    }, {
                        instance: instance,
                        identifier: identifier
                    });
                }
                instance = $injector.instantiate(expression, locals, constructor);
                if (identifier) {
                    addIdentifier(locals, identifier, instance, constructor || expression.name);
                }
                return instance;
            };
            function addIdentifier(locals, identifier, instance, name) {
                if (!(locals && isObject(locals.$scope))) {
                    throw minErr('$controller')('noscp',
                        "Cannot export controller '{0}' as '{1}'! No $scope object provided via `locals`.",
                        name, identifier);
                }
                locals.$scope[identifier] = instance;
            }
        }];
    }

    function $DocumentProvider() {
        this.$get = ['$window', function (window) {
            return jqLite(window.document);
        }];
    }

    function $ExceptionHandlerProvider() {
        this.$get = ['$log', function ($log) {
            return function (exception, cause) {
                $log.error.apply($log, arguments);
            };
        }];
    }

    var APPLICATION_JSON = 'application/json';
    var CONTENT_TYPE_APPLICATION_JSON = {'Content-Type': APPLICATION_JSON + ';charset=utf-8'};
    var JSON_START = /^\[|^\{(?!\{)/;
    var JSON_ENDS = {
        '[': /]$/,
        '{': /}$/
    };
    var JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;

    function defaultHttpResponseTransform(data, headers) {
        if (isString(data)) {
            var tempData = data.replace(JSON_PROTECTION_PREFIX, '').trim();
            if (tempData) {
                var contentType = headers('Content-Type');
                if ((contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) || isJsonLike(tempData)) {
                    data = fromJson(tempData);
                }
            }
        }
        return data;
    }

    function isJsonLike(str) {
        var jsonStart = str.match(JSON_START);
        return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
    }

    function parseHeaders(headers) {
        var parsed = createMap(), key, val, i;
        if (!headers) return parsed;
        forEach(headers.split('\n'), function (line) {
            i = line.indexOf(':');
            key = lowercase(trim(line.substr(0, i)));
            val = trim(line.substr(i + 1));
            if (key) {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        });
        return parsed;
    }

    function headersGetter(headers) {
        var headersObj = isObject(headers) ? headers : undefined;
        return function (name) {
            if (!headersObj) headersObj = parseHeaders(headers);
            if (name) {
                var value = headersObj[lowercase(name)];
                if (value === void 0) {
                    value = null;
                }
                return value;
            }
            return headersObj;
        };
    }

    function transformData(data, headers, status, fns) {
        if (isFunction(fns))
            return fns(data, headers, status);
        forEach(fns, function (fn) {
            data = fn(data, headers, status);
        });
        return data;
    }

    function isSuccess(status) {
        return 200 <= status && status < 300;
    }

    function $HttpProvider() {
        var defaults = this.defaults = {
            transformResponse: [defaultHttpResponseTransform],
            transformRequest: [function (d) {
                return isObject(d) && !isFile(d) && !isBlob(d) && !isFormData(d) ? toJson(d) : d;
            }],
            headers: {
                common: {
                    'Accept': 'application/json, text/plain, */*'
                },
                post: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
                put: shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
                patch: shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
            },
            xsrfCookieName: 'XSRF-TOKEN',
            xsrfHeaderName: 'X-XSRF-TOKEN'
        };
        var useApplyAsync = false;
        this.useApplyAsync = function (value) {
            if (isDefined(value)) {
                useApplyAsync = !!value;
                return this;
            }
            return useApplyAsync;
        };
        var interceptorFactories = this.interceptors = [];
        this.$get = ['$httpBackend', '$browser', '$cacheFactory', '$rootScope', '$q', '$injector',
            function ($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {
                var defaultCache = $cacheFactory('$http');
                var reversedInterceptors = [];
                forEach(interceptorFactories, function (interceptorFactory) {
                    reversedInterceptors.unshift(isString(interceptorFactory)
                        ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
                });
                function $http(requestConfig) {
                    if (!angular.isObject(requestConfig)) {
                        throw minErr('$http')('badreq', 'Http request configuration must be an object.  Received: {0}', requestConfig);
                    }
                    var config = extend({
                        method: 'get',
                        transformRequest: defaults.transformRequest,
                        transformResponse: defaults.transformResponse
                    }, requestConfig);
                    config.headers = mergeHeaders(requestConfig);
                    config.method = uppercase(config.method);
                    var serverRequest = function (config) {
                        var headers = config.headers;
                        var reqData = transformData(config.data, headersGetter(headers), undefined, config.transformRequest);
                        if (isUndefined(reqData)) {
                            forEach(headers, function (value, header) {
                                if (lowercase(header) === 'content-type') {
                                    delete headers[header];
                                }
                            });
                        }
                        if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
                            config.withCredentials = defaults.withCredentials;
                        }
                        return sendReq(config, reqData).then(transformResponse, transformResponse);
                    };
                    var chain = [serverRequest, undefined];
                    var promise = $q.when(config);
                    forEach(reversedInterceptors, function (interceptor) {
                        if (interceptor.request || interceptor.requestError) {
                            chain.unshift(interceptor.request, interceptor.requestError);
                        }
                        if (interceptor.response || interceptor.responseError) {
                            chain.push(interceptor.response, interceptor.responseError);
                        }
                    });
                    while (chain.length) {
                        var thenFn = chain.shift();
                        var rejectFn = chain.shift();
                        promise = promise.then(thenFn, rejectFn);
                    }
                    promise.success = function (fn) {
                        assertArgFn(fn, 'fn');
                        promise.then(function (response) {
                            fn(response.data, response.status, response.headers, config);
                        });
                        return promise;
                    };
                    promise.error = function (fn) {
                        assertArgFn(fn, 'fn');
                        promise.then(null, function (response) {
                            fn(response.data, response.status, response.headers, config);
                        });
                        return promise;
                    };
                    return promise;
                    function transformResponse(response) {
                        var resp = extend({}, response);
                        if (!response.data) {
                            resp.data = response.data;
                        } else {
                            resp.data = transformData(response.data, response.headers, response.status, config.transformResponse);
                        }
                        return (isSuccess(response.status))
                            ? resp
                            : $q.reject(resp);
                    }

                    function executeHeaderFns(headers) {
                        var headerContent, processedHeaders = {};
                        forEach(headers, function (headerFn, header) {
                            if (isFunction(headerFn)) {
                                headerContent = headerFn();
                                if (headerContent != null) {
                                    processedHeaders[header] = headerContent;
                                }
                            } else {
                                processedHeaders[header] = headerFn;
                            }
                        });
                        return processedHeaders;
                    }

                    function mergeHeaders(config) {
                        var defHeaders = defaults.headers,
                            reqHeaders = extend({}, config.headers),
                            defHeaderName, lowercaseDefHeaderName, reqHeaderName;
                        defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
                        defaultHeadersIteration:
                            for (defHeaderName in defHeaders) {
                                lowercaseDefHeaderName = lowercase(defHeaderName);
                                for (reqHeaderName in reqHeaders) {
                                    if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
                                        continue defaultHeadersIteration;
                                    }
                                }
                                reqHeaders[defHeaderName] = defHeaders[defHeaderName];
                            }
                        return executeHeaderFns(reqHeaders);
                    }
                }

                $http.pendingRequests = [];
                createShortMethods('get', 'delete', 'head', 'jsonp');
                createShortMethodsWithData('post', 'put', 'patch');
                $http.defaults = defaults;
                return $http;
                function createShortMethods(names) {
                    forEach(arguments, function (name) {
                        $http[name] = function (url, config) {
                            return $http(extend(config || {}, {
                                method: name,
                                url: url
                            }));
                        };
                    });
                }

                function createShortMethodsWithData(name) {
                    forEach(arguments, function (name) {
                        $http[name] = function (url, data, config) {
                            return $http(extend(config || {}, {
                                method: name,
                                url: url,
                                data: data
                            }));
                        };
                    });
                }

                function sendReq(config, reqData) {
                    var deferred = $q.defer(),
                        promise = deferred.promise,
                        cache,
                        cachedResp,
                        reqHeaders = config.headers,
                        url = buildUrl(config.url, config.params);
                    $http.pendingRequests.push(config);
                    promise.then(removePendingReq, removePendingReq);
                    if ((config.cache || defaults.cache) && config.cache !== false &&
                        (config.method === 'GET' || config.method === 'JSONP')) {
                        cache = isObject(config.cache) ? config.cache
                            : isObject(defaults.cache) ? defaults.cache
                            : defaultCache;
                    }
                    if (cache) {
                        cachedResp = cache.get(url);
                        if (isDefined(cachedResp)) {
                            if (isPromiseLike(cachedResp)) {
                                cachedResp.then(resolvePromiseWithResult, resolvePromiseWithResult);
                            } else {
                                if (isArray(cachedResp)) {
                                    resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]);
                                } else {
                                    resolvePromise(cachedResp, 200, {}, 'OK');
                                }
                            }
                        } else {
                            cache.put(url, promise);
                        }
                    }
                    if (isUndefined(cachedResp)) {
                        var xsrfValue = urlIsSameOrigin(config.url)
                            ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName]
                            : undefined;
                        if (xsrfValue) {
                            reqHeaders[(config.xsrfHeaderName || defaults.xsrfHeaderName)] = xsrfValue;
                        }
                        $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout,
                            config.withCredentials, config.responseType);
                    }
                    return promise;
                    function done(status, response, headersString, statusText) {
                        if (cache) {
                            if (isSuccess(status)) {
                                cache.put(url, [status, response, parseHeaders(headersString), statusText]);
                            } else {
                                cache.remove(url);
                            }
                        }
                        function resolveHttpPromise() {
                            resolvePromise(response, status, headersString, statusText);
                        }

                        if (useApplyAsync) {
                            $rootScope.$applyAsync(resolveHttpPromise);
                        } else {
                            resolveHttpPromise();
                            if (!$rootScope.$$phase) $rootScope.$apply();
                        }
                    }

                    function resolvePromise(response, status, headers, statusText) {
                        status = status >= -1 ? status : 0;
                        (isSuccess(status) ? deferred.resolve : deferred.reject)({
                            data: response,
                            status: status,
                            headers: headersGetter(headers),
                            config: config,
                            statusText: statusText
                        });
                    }

                    function resolvePromiseWithResult(result) {
                        resolvePromise(result.data, result.status, shallowCopy(result.headers()), result.statusText);
                    }

                    function removePendingReq() {
                        var idx = $http.pendingRequests.indexOf(config);
                        if (idx !== -1) $http.pendingRequests.splice(idx, 1);
                    }
                }

                function buildUrl(url, params) {
                    if (!params) return url;
                    var parts = [];
                    forEachSorted(params, function (value, key) {
                        if (value === null || isUndefined(value)) return;
                        if (!isArray(value)) value = [value];
                        forEach(value, function (v) {
                            if (isObject(v)) {
                                if (isDate(v)) {
                                    v = v.toISOString();
                                } else {
                                    v = toJson(v);
                                }
                            }
                            parts.push(encodeUriQuery(key) + '=' +
                                encodeUriQuery(v));
                        });
                    });
                    if (parts.length > 0) {
                        url += ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&');
                    }
                    return url;
                }
            }];
    }

    function createXhr() {
        return new window.XMLHttpRequest();
    }

    function $HttpBackendProvider() {
        this.$get = ['$browser', '$window', '$document', function ($browser, $window, $document) {
            return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0]);
        }];
    }

    function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
        return function (method, url, post, callback, headers, timeout, withCredentials, responseType) {
            $browser.$$incOutstandingRequestCount();
            url = url || $browser.url();
            if (lowercase(method) == 'jsonp') {
                var callbackId = '_' + (callbacks.counter++).toString(36);
                callbacks[callbackId] = function (data) {
                    callbacks[callbackId].data = data;
                    callbacks[callbackId].called = true;
                };
                var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),
                    callbackId, function (status, text) {
                        completeRequest(callback, status, callbacks[callbackId].data, "", text);
                        callbacks[callbackId] = noop;
                    });
            } else {
                var xhr = createXhr();
                xhr.open(method, url, true);
                forEach(headers, function (value, key) {
                    if (isDefined(value)) {
                        xhr.setRequestHeader(key, value);
                    }
                });
                xhr.onload = function requestLoaded() {
                    var statusText = xhr.statusText || '';
                    var response = ('response' in xhr) ? xhr.response : xhr.responseText;
                    var status = xhr.status === 1223 ? 204 : xhr.status;
                    if (status === 0) {
                        status = response ? 200 : urlResolve(url).protocol == 'file' ? 404 : 0;
                    }
                    completeRequest(callback,
                        status,
                        response,
                        xhr.getAllResponseHeaders(),
                        statusText);
                };
                var requestError = function () {
                    completeRequest(callback, -1, null, null, '');
                };
                xhr.onerror = requestError;
                xhr.onabort = requestError;
                if (withCredentials) {
                    xhr.withCredentials = true;
                }
                if (responseType) {
                    try {
                        xhr.responseType = responseType;
                    } catch (e) {
                        if (responseType !== 'json') {
                            throw e;
                        }
                    }
                }
                xhr.send(post || null);
            }
            if (timeout > 0) {
                var timeoutId = $browserDefer(timeoutRequest, timeout);
            } else if (isPromiseLike(timeout)) {
                timeout.then(timeoutRequest);
            }
            function timeoutRequest() {
                jsonpDone && jsonpDone();
                xhr && xhr.abort();
            }

            function completeRequest(callback, status, response, headersString, statusText) {
                if (timeoutId !== undefined) {
                    $browserDefer.cancel(timeoutId);
                }
                jsonpDone = xhr = null;
                callback(status, response, headersString, statusText);
                $browser.$$completeOutstandingRequest(noop);
            }
        };
        function jsonpReq(url, callbackId, done) {
            var script = rawDocument.createElement('script'), callback = null;
            script.type = "text/javascript";
            script.src = url;
            script.async = true;
            callback = function (event) {
                removeEventListenerFn(script, "load", callback);
                removeEventListenerFn(script, "error", callback);
                rawDocument.body.removeChild(script);
                script = null;
                var status = -1;
                var text = "unknown";
                if (event) {
                    if (event.type === "load" && !callbacks[callbackId].called) {
                        event = {type: "error"};
                    }
                    text = event.type;
                    status = event.type === "error" ? 404 : 200;
                }
                if (done) {
                    done(status, text);
                }
            };
            addEventListenerFn(script, "load", callback);
            addEventListenerFn(script, "error", callback);
            rawDocument.body.appendChild(script);
            return callback;
        }
    }

    var $interpolateMinErr = minErr('$interpolate');

    function $InterpolateProvider() {
        var startSymbol = '{{';
        var endSymbol = '}}';
        this.startSymbol = function (value) {
            if (value) {
                startSymbol = value;
                return this;
            } else {
                return startSymbol;
            }
        };
        this.endSymbol = function (value) {
            if (value) {
                endSymbol = value;
                return this;
            } else {
                return endSymbol;
            }
        };
        this.$get = ['$parse', '$exceptionHandler', '$sce', function ($parse, $exceptionHandler, $sce) {
            var startSymbolLength = startSymbol.length,
                endSymbolLength = endSymbol.length,
                escapedStartRegexp = new RegExp(startSymbol.replace(/./g, escape), 'g'),
                escapedEndRegexp = new RegExp(endSymbol.replace(/./g, escape), 'g');

            function escape(ch) {
                return '\\\\\\' + ch;
            }

            function $interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
                allOrNothing = !!allOrNothing;
                var startIndex,
                    endIndex,
                    index = 0,
                    expressions = [],
                    parseFns = [],
                    textLength = text.length,
                    exp,
                    concat = [],
                    expressionPositions = [];
                while (index < textLength) {
                    if (((startIndex = text.indexOf(startSymbol, index)) != -1) &&
                        ((endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1)) {
                        if (index !== startIndex) {
                            concat.push(unescapeText(text.substring(index, startIndex)));
                        }
                        exp = text.substring(startIndex + startSymbolLength, endIndex);
                        expressions.push(exp);
                        parseFns.push($parse(exp, parseStringifyInterceptor));
                        index = endIndex + endSymbolLength;
                        expressionPositions.push(concat.length);
                        concat.push('');
                    } else {
                        if (index !== textLength) {
                            concat.push(unescapeText(text.substring(index)));
                        }
                        break;
                    }
                }
                if (trustedContext && concat.length > 1) {
                    throw $interpolateMinErr('noconcat',
                        "Error while interpolating: {0}\nStrict Contextual Escaping disallows " +
                        "interpolations that concatenate multiple expressions when a trusted value is " +
                        "required.  See http://docs.angularjs.org/api/ng.$sce", text);
                }
                if (!mustHaveExpression || expressions.length) {
                    var compute = function (values) {
                        for (var i = 0, ii = expressions.length; i < ii; i++) {
                            if (allOrNothing && isUndefined(values[i])) return;
                            concat[expressionPositions[i]] = values[i];
                        }
                        return concat.join('');
                    };
                    var getValue = function (value) {
                        return trustedContext ?
                            $sce.getTrusted(trustedContext, value) :
                            $sce.valueOf(value);
                    };
                    var stringify = function (value) {
                        if (value == null) {
                            return '';
                        }
                        switch (typeof value) {
                            case 'string':
                                break;
                            case 'number':
                                value = '' + value;
                                break;
                            default:
                                value = toJson(value);
                        }
                        return value;
                    };
                    return extend(function interpolationFn(context) {
                        var i = 0;
                        var ii = expressions.length;
                        var values = new Array(ii);
                        try {
                            for (; i < ii; i++) {
                                values[i] = parseFns[i](context);
                            }
                            return compute(values);
                        } catch (err) {
                            var newErr = $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text,
                                err.toString());
                            $exceptionHandler(newErr);
                        }
                    }, {
                        exp: text,
                        expressions: expressions,
                        $$watchDelegate: function (scope, listener, objectEquality) {
                            var lastValue;
                            return scope.$watchGroup(parseFns, function interpolateFnWatcher(values, oldValues) {
                                var currValue = compute(values);
                                if (isFunction(listener)) {
                                    listener.call(this, currValue, values !== oldValues ? lastValue : currValue, scope);
                                }
                                lastValue = currValue;
                            }, objectEquality);
                        }
                    });
                }
                function unescapeText(text) {
                    return text.replace(escapedStartRegexp, startSymbol).
                        replace(escapedEndRegexp, endSymbol);
                }

                function parseStringifyInterceptor(value) {
                    try {
                        value = getValue(value);
                        return allOrNothing && !isDefined(value) ? value : stringify(value);
                    } catch (err) {
                        var newErr = $interpolateMinErr('interr', "Can't interpolate: {0}\n{1}", text,
                            err.toString());
                        $exceptionHandler(newErr);
                    }
                }
            }

            $interpolate.startSymbol = function () {
                return startSymbol;
            };
            $interpolate.endSymbol = function () {
                return endSymbol;
            };
            return $interpolate;
        }];
    }

    function $IntervalProvider() {
        this.$get = ['$rootScope', '$window', '$q', '$$q',
            function ($rootScope, $window, $q, $$q) {
                var intervals = {};

                function interval(fn, delay, count, invokeApply) {
                    var setInterval = $window.setInterval,
                        clearInterval = $window.clearInterval,
                        iteration = 0,
                        skipApply = (isDefined(invokeApply) && !invokeApply),
                        deferred = (skipApply ? $$q : $q).defer(),
                        promise = deferred.promise;
                    count = isDefined(count) ? count : 0;
                    promise.then(null, null, fn);
                    promise.$$intervalId = setInterval(function tick() {
                        deferred.notify(iteration++);
                        if (count > 0 && iteration >= count) {
                            deferred.resolve(iteration);
                            clearInterval(promise.$$intervalId);
                            delete intervals[promise.$$intervalId];
                        }
                        if (!skipApply) $rootScope.$apply();
                    }, delay);
                    intervals[promise.$$intervalId] = deferred;
                    return promise;
                }

                interval.cancel = function (promise) {
                    if (promise && promise.$$intervalId in intervals) {
                        intervals[promise.$$intervalId].reject('canceled');
                        $window.clearInterval(promise.$$intervalId);
                        delete intervals[promise.$$intervalId];
                        return true;
                    }
                    return false;
                };
                return interval;
            }];
    }

    function $LocaleProvider() {
        this.$get = function () {
            return {
                id: 'en-us',
                NUMBER_FORMATS: {
                    DECIMAL_SEP: '.',
                    GROUP_SEP: ',',
                    PATTERNS: [
                        {
                            minInt: 1,
                            minFrac: 0,
                            maxFrac: 3,
                            posPre: '',
                            posSuf: '',
                            negPre: '-',
                            negSuf: '',
                            gSize: 3,
                            lgSize: 3
                        }, {
                            minInt: 1,
                            minFrac: 2,
                            maxFrac: 2,
                            posPre: '\u00A4',
                            posSuf: '',
                            negPre: '(\u00A4',
                            negSuf: ')',
                            gSize: 3,
                            lgSize: 3
                        }
                    ],
                    CURRENCY_SYM: '$'
                },
                DATETIME_FORMATS: {
                    MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'
                        .split(','),
                    SHORTMONTH: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
                    DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
                    SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
                    AMPMS: ['AM', 'PM'],
                    medium: 'MMM d, y h:mm:ss a',
                    'short': 'M/d/yy h:mm a',
                    fullDate: 'EEEE, MMMM d, y',
                    longDate: 'MMMM d, y',
                    mediumDate: 'MMM d, y',
                    shortDate: 'M/d/yy',
                    mediumTime: 'h:mm:ss a',
                    shortTime: 'h:mm a',
                    ERANAMES: [
                        "Before Christ",
                        "Anno Domini"
                    ],
                    ERAS: [
                        "BC",
                        "AD"
                    ]
                },
                pluralCat: function (num) {
                    if (num === 1) {
                        return 'one';
                    }
                    return 'other';
                }
            };
        };
    }

    var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
        DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp': 21};
    var $locationMinErr = minErr('$location');

    function encodePath(path) {
        var segments = path.split('/'),
            i = segments.length;
        while (i--) {
            segments[i] = encodeUriSegment(segments[i]);
        }
        return segments.join('/');
    }

    function parseAbsoluteUrl(absoluteUrl, locationObj) {
        var parsedUrl = urlResolve(absoluteUrl);
        locationObj.$$protocol = parsedUrl.protocol;
        locationObj.$$host = parsedUrl.hostname;
        locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
    }

    function parseAppUrl(relativeUrl, locationObj) {
        var prefixed = (relativeUrl.charAt(0) !== '/');
        if (prefixed) {
            relativeUrl = '/' + relativeUrl;
        }
        var match = urlResolve(relativeUrl);
        locationObj.$$path = decodeURIComponent(prefixed && match.pathname.charAt(0) === '/' ?
            match.pathname.substring(1) : match.pathname);
        locationObj.$$search = parseKeyValue(match.search);
        locationObj.$$hash = decodeURIComponent(match.hash);
        if (locationObj.$$path && locationObj.$$path.charAt(0) != '/') {
            locationObj.$$path = '/' + locationObj.$$path;
        }
    }

    function beginsWith(begin, whole) {
        if (whole.indexOf(begin) === 0) {
            return whole.substr(begin.length);
        }
    }

    function stripHash(url) {
        var index = url.indexOf('#');
        return index == -1 ? url : url.substr(0, index);
    }

    function trimEmptyHash(url) {
        return url.replace(/(#.+)|#$/, '$1');
    }

    function stripFile(url) {
        return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
    }

    function serverBase(url) {
        return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
    }

    function LocationHtml5Url(appBase, appBaseNoFile, basePrefix) {
        this.$$html5 = true;
        basePrefix = basePrefix || '';
        parseAbsoluteUrl(appBase, this);
        this.$$parse = function (url) {
            var pathUrl = beginsWith(appBaseNoFile, url);
            if (!isString(pathUrl)) {
                throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url,
                    appBaseNoFile);
            }
            parseAppUrl(pathUrl, this);
            if (!this.$$path) {
                this.$$path = '/';
            }
            this.$$compose();
        };
        this.$$compose = function () {
            var search = toKeyValue(this.$$search),
                hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
            this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
            this.$$absUrl = appBaseNoFile + this.$$url.substr(1);
        };
        this.$$parseLinkUrl = function (url, relHref) {
            if (relHref && relHref[0] === '#') {
                this.hash(relHref.slice(1));
                return true;
            }
            var appUrl, prevAppUrl;
            var rewrittenUrl;
            if ((appUrl = beginsWith(appBase, url)) !== undefined) {
                prevAppUrl = appUrl;
                if ((appUrl = beginsWith(basePrefix, appUrl)) !== undefined) {
                    rewrittenUrl = appBaseNoFile + (beginsWith('/', appUrl) || appUrl);
                } else {
                    rewrittenUrl = appBase + prevAppUrl;
                }
            } else if ((appUrl = beginsWith(appBaseNoFile, url)) !== undefined) {
                rewrittenUrl = appBaseNoFile + appUrl;
            } else if (appBaseNoFile == url + '/') {
                rewrittenUrl = appBaseNoFile;
            }
            if (rewrittenUrl) {
                this.$$parse(rewrittenUrl);
            }
            return !!rewrittenUrl;
        };
    }

    function LocationHashbangUrl(appBase, appBaseNoFile, hashPrefix) {
        parseAbsoluteUrl(appBase, this);
        this.$$parse = function (url) {
            var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
            var withoutHashUrl;
            if (!isUndefined(withoutBaseUrl) && withoutBaseUrl.charAt(0) === '#') {
                withoutHashUrl = beginsWith(hashPrefix, withoutBaseUrl);
                if (isUndefined(withoutHashUrl)) {
                    withoutHashUrl = withoutBaseUrl;
                }
            } else {
                if (this.$$html5) {
                    withoutHashUrl = withoutBaseUrl;
                } else {
                    withoutHashUrl = '';
                    if (isUndefined(withoutBaseUrl)) {
                        appBase = url;
                        this.replace();
                    }
                }
            }
            parseAppUrl(withoutHashUrl, this);
            this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);
            this.$$compose();
            function removeWindowsDriveName(path, url, base) {
                var windowsFilePathExp = /^\/[A-Z]:(\/.*)/;
                var firstPathSegmentMatch;
                if (url.indexOf(base) === 0) {
                    url = url.replace(base, '');
                }
                if (windowsFilePathExp.exec(url)) {
                    return path;
                }
                firstPathSegmentMatch = windowsFilePathExp.exec(path);
                return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
            }
        };
        this.$$compose = function () {
            var search = toKeyValue(this.$$search),
                hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
            this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
            this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
        };
        this.$$parseLinkUrl = function (url, relHref) {
            if (stripHash(appBase) == stripHash(url)) {
                this.$$parse(url);
                return true;
            }
            return false;
        };
    }

    function LocationHashbangInHtml5Url(appBase, appBaseNoFile, hashPrefix) {
        this.$$html5 = true;
        LocationHashbangUrl.apply(this, arguments);
        this.$$parseLinkUrl = function (url, relHref) {
            if (relHref && relHref[0] === '#') {
                this.hash(relHref.slice(1));
                return true;
            }
            var rewrittenUrl;
            var appUrl;
            if (appBase == stripHash(url)) {
                rewrittenUrl = url;
            } else if ((appUrl = beginsWith(appBaseNoFile, url))) {
                rewrittenUrl = appBase + hashPrefix + appUrl;
            } else if (appBaseNoFile === url + '/') {
                rewrittenUrl = appBaseNoFile;
            }
            if (rewrittenUrl) {
                this.$$parse(rewrittenUrl);
            }
            return !!rewrittenUrl;
        };
        this.$$compose = function () {
            var search = toKeyValue(this.$$search),
                hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
            this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
            this.$$absUrl = appBase + hashPrefix + this.$$url;
        };
    }

    var locationPrototype = {
        $$html5: false,
        $$replace: false,
        absUrl: locationGetter('$$absUrl'),
        url: function (url) {
            if (isUndefined(url))
                return this.$$url;
            var match = PATH_MATCH.exec(url);
            if (match[1] || url === '') this.path(decodeURIComponent(match[1]));
            if (match[2] || match[1] || url === '') this.search(match[3] || '');
            this.hash(match[5] || '');
            return this;
        },
        protocol: locationGetter('$$protocol'),
        host: locationGetter('$$host'),
        port: locationGetter('$$port'),
        path: locationGetterSetter('$$path', function (path) {
            path = path !== null ? path.toString() : '';
            return path.charAt(0) == '/' ? path : '/' + path;
        }),
        search: function (search, paramValue) {
            switch (arguments.length) {
                case 0:
                    return this.$$search;
                case 1:
                    if (isString(search) || isNumber(search)) {
                        search = search.toString();
                        this.$$search = parseKeyValue(search);
                    } else if (isObject(search)) {
                        search = copy(search, {});
                        forEach(search, function (value, key) {
                            if (value == null) delete search[key];
                        });
                        this.$$search = search;
                    } else {
                        throw $locationMinErr('isrcharg',
                            'The first argument of the `$location#search()` call must be a string or an object.');
                    }
                    break;
                default:
                    if (isUndefined(paramValue) || paramValue === null) {
                        delete this.$$search[search];
                    } else {
                        this.$$search[search] = paramValue;
                    }
            }
            this.$$compose();
            return this;
        },
        hash: locationGetterSetter('$$hash', function (hash) {
            return hash !== null ? hash.toString() : '';
        }),
        replace: function () {
            this.$$replace = true;
            return this;
        }
    };
    forEach([LocationHashbangInHtml5Url, LocationHashbangUrl, LocationHtml5Url], function (Location) {
        Location.prototype = Object.create(locationPrototype);
        Location.prototype.state = function (state) {
            if (!arguments.length)
                return this.$$state;
            if (Location !== LocationHtml5Url || !this.$$html5) {
                throw $locationMinErr('nostate', 'History API state support is available only ' +
                    'in HTML5 mode and only in browsers supporting HTML5 History API');
            }
            this.$$state = isUndefined(state) ? null : state;
            return this;
        };
    });
    function locationGetter(property) {
        return function () {
            return this[property];
        };
    }

    function locationGetterSetter(property, preprocess) {
        return function (value) {
            if (isUndefined(value))
                return this[property];
            this[property] = preprocess(value);
            this.$$compose();
            return this;
        };
    }

    function $LocationProvider() {
        var hashPrefix = '',
            html5Mode = {
                enabled: false,
                requireBase: true,
                rewriteLinks: true
            };
        this.hashPrefix = function (prefix) {
            if (isDefined(prefix)) {
                hashPrefix = prefix;
                return this;
            } else {
                return hashPrefix;
            }
        };
        this.html5Mode = function (mode) {
            if (isBoolean(mode)) {
                html5Mode.enabled = mode;
                return this;
            } else if (isObject(mode)) {
                if (isBoolean(mode.enabled)) {
                    html5Mode.enabled = mode.enabled;
                }
                if (isBoolean(mode.requireBase)) {
                    html5Mode.requireBase = mode.requireBase;
                }
                if (isBoolean(mode.rewriteLinks)) {
                    html5Mode.rewriteLinks = mode.rewriteLinks;
                }
                return this;
            } else {
                return html5Mode;
            }
        };
        this.$get = ['$rootScope', '$browser', '$sniffer', '$rootElement', '$window',
            function ($rootScope, $browser, $sniffer, $rootElement, $window) {
                var $location,
                    LocationMode,
                    baseHref = $browser.baseHref(),
                    initialUrl = $browser.url(),
                    appBase;
                if (html5Mode.enabled) {
                    if (!baseHref && html5Mode.requireBase) {
                        throw $locationMinErr('nobase',
                            "$location in HTML5 mode requires a <base> tag to be present!");
                    }
                    appBase = serverBase(initialUrl) + (baseHref || '/');
                    LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
                } else {
                    appBase = stripHash(initialUrl);
                    LocationMode = LocationHashbangUrl;
                }
                var appBaseNoFile = stripFile(appBase);
                $location = new LocationMode(appBase, appBaseNoFile, '#' + hashPrefix);
                $location.$$parseLinkUrl(initialUrl, initialUrl);
                $location.$$state = $browser.state();
                var IGNORE_URI_REGEXP = /^\s*(javascript|mailto):/i;

                function setBrowserUrlWithFallback(url, replace, state) {
                    var oldUrl = $location.url();
                    var oldState = $location.$$state;
                    try {
                        $browser.url(url, replace, state);
                        $location.$$state = $browser.state();
                    } catch (e) {
                        $location.url(oldUrl);
                        $location.$$state = oldState;
                        throw e;
                    }
                }

                $rootElement.on('click', function (event) {
                    if (!html5Mode.rewriteLinks || event.ctrlKey || event.metaKey || event.shiftKey || event.which == 2 || event.button == 2) return;
                    var elm = jqLite(event.target);
                    while (nodeName_(elm[0]) !== 'a') {
                        if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0]) return;
                    }
                    var absHref = elm.prop('href');
                    var relHref = elm.attr('href') || elm.attr('xlink:href');
                    if (isObject(absHref) && absHref.toString() === '[object SVGAnimatedString]') {
                        absHref = urlResolve(absHref.animVal).href;
                    }
                    if (IGNORE_URI_REGEXP.test(absHref)) return;
                    if (absHref && !elm.attr('target') && !event.isDefaultPrevented()) {
                        if ($location.$$parseLinkUrl(absHref, relHref)) {
                            event.preventDefault();
                            if ($location.absUrl() != $browser.url()) {
                                $rootScope.$apply();
                                $window.angular['ff-684208-preventDefault'] = true;
                            }
                        }
                    }
                });
                if (trimEmptyHash($location.absUrl()) != trimEmptyHash(initialUrl)) {
                    $browser.url($location.absUrl(), true);
                }
                var initializing = true;
                $browser.onUrlChange(function (newUrl, newState) {
                    if (isUndefined(beginsWith(appBaseNoFile, newUrl))) {
                        $window.location.href = newUrl;
                        return;
                    }
                    $rootScope.$evalAsync(function () {
                        var oldUrl = $location.absUrl();
                        var oldState = $location.$$state;
                        var defaultPrevented;
                        $location.$$parse(newUrl);
                        $location.$$state = newState;
                        defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl,
                            newState, oldState).defaultPrevented;
                        if ($location.absUrl() !== newUrl) return;
                        if (defaultPrevented) {
                            $location.$$parse(oldUrl);
                            $location.$$state = oldState;
                            setBrowserUrlWithFallback(oldUrl, false, oldState);
                        } else {
                            initializing = false;
                            afterLocationChange(oldUrl, oldState);
                        }
                    });
                    if (!$rootScope.$$phase) $rootScope.$digest();
                });
                $rootScope.$watch(function $locationWatch() {
                    var oldUrl = trimEmptyHash($browser.url());
                    var newUrl = trimEmptyHash($location.absUrl());
                    var oldState = $browser.state();
                    var currentReplace = $location.$$replace;
                    var urlOrStateChanged = oldUrl !== newUrl ||
                        ($location.$$html5 && $sniffer.history && oldState !== $location.$$state);
                    if (initializing || urlOrStateChanged) {
                        initializing = false;
                        $rootScope.$evalAsync(function () {
                            var newUrl = $location.absUrl();
                            var defaultPrevented = $rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl,
                                $location.$$state, oldState).defaultPrevented;
                            if ($location.absUrl() !== newUrl) return;
                            if (defaultPrevented) {
                                $location.$$parse(oldUrl);
                                $location.$$state = oldState;
                            } else {
                                if (urlOrStateChanged) {
                                    setBrowserUrlWithFallback(newUrl, currentReplace,
                                        oldState === $location.$$state ? null : $location.$$state);
                                }
                                afterLocationChange(oldUrl, oldState);
                            }
                        });
                    }
                    $location.$$replace = false;
                });
                return $location;
                function afterLocationChange(oldUrl, oldState) {
                    $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl,
                        $location.$$state, oldState);
                }
            }];
    }

    function $LogProvider() {
        var debug = true,
            self = this;
        this.debugEnabled = function (flag) {
            if (isDefined(flag)) {
                debug = flag;
                return this;
            } else {
                return debug;
            }
        };
        this.$get = ['$window', function ($window) {
            return {
                log: consoleLog('log'),
                info: consoleLog('info'),
                warn: consoleLog('warn'),
                error: consoleLog('error'),
                debug: (function () {
                    var fn = consoleLog('debug');
                    return function () {
                        if (debug) {
                            fn.apply(self, arguments);
                        }
                    };
                }())
            };
            function formatError(arg) {
                if (arg instanceof Error) {
                    if (arg.stack) {
                        arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
                            ? 'Error: ' + arg.message + '\n' + arg.stack
                            : arg.stack;
                    } else if (arg.sourceURL) {
                        arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
                    }
                }
                return arg;
            }

            function consoleLog(type) {
                var console = $window.console || {},
                    logFn = console[type] || console.log || noop,
                    hasApply = false;
                try {
                    hasApply = !!logFn.apply;
                } catch (e) {
                }
                if (hasApply) {
                    return function () {
                        var args = [];
                        forEach(arguments, function (arg) {
                            args.push(formatError(arg));
                        });
                        return logFn.apply(console, args);
                    };
                }
                return function (arg1, arg2) {
                    logFn(arg1, arg2 == null ? '' : arg2);
                };
            }
        }];
    }

    var $parseMinErr = minErr('$parse');

    function ensureSafeMemberName(name, fullExpression) {
        if (name === "__defineGetter__" || name === "__defineSetter__"
            || name === "__lookupGetter__" || name === "__lookupSetter__"
            || name === "__proto__") {
            throw $parseMinErr('isecfld',
                'Attempting to access a disallowed field in Angular expressions! '
                + 'Expression: {0}', fullExpression);
        }
        return name;
    }

    function getStringValue(name, fullExpression) {
        name = name + '';
        if (!isString(name)) {
            throw $parseMinErr('iseccst',
                'Cannot convert object to primitive value! '
                + 'Expression: {0}', fullExpression);
        }
        return name;
    }

    function ensureSafeObject(obj, fullExpression) {
        if (obj) {
            if (obj.constructor === obj) {
                throw $parseMinErr('isecfn',
                    'Referencing Function in Angular expressions is disallowed! Expression: {0}',
                    fullExpression);
            } else if (// isWindow(obj)
            obj.window === obj) {
                throw $parseMinErr('isecwindow',
                    'Referencing the Window in Angular expressions is disallowed! Expression: {0}',
                    fullExpression);
            } else if (// isElement(obj)
            obj.children && (obj.nodeName || (obj.prop && obj.attr && obj.find))) {
                throw $parseMinErr('isecdom',
                    'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}',
                    fullExpression);
            } else if (// block Object so that we can't get hold of dangerous Object.* methods
            obj === Object) {
                throw $parseMinErr('isecobj',
                    'Referencing Object in Angular expressions is disallowed! Expression: {0}',
                    fullExpression);
            }
        }
        return obj;
    }

    var CALL = Function.prototype.call;
    var APPLY = Function.prototype.apply;
    var BIND = Function.prototype.bind;

    function ensureSafeFunction(obj, fullExpression) {
        if (obj) {
            if (obj.constructor === obj) {
                throw $parseMinErr('isecfn',
                    'Referencing Function in Angular expressions is disallowed! Expression: {0}',
                    fullExpression);
            } else if (obj === CALL || obj === APPLY || obj === BIND) {
                throw $parseMinErr('isecff',
                    'Referencing call, apply or bind in Angular expressions is disallowed! Expression: {0}',
                    fullExpression);
            }
        }
    }

    var CONSTANTS = createMap();
    forEach({
        'null': function () {
            return null;
        },
        'true': function () {
            return true;
        },
        'false': function () {
            return false;
        },
        'undefined': function () {
        }
    }, function (constantGetter, name) {
        constantGetter.constant = constantGetter.literal = constantGetter.sharedGetter = true;
        CONSTANTS[name] = constantGetter;
    });
    CONSTANTS['this'] = function (self) {
        return self;
    };
    CONSTANTS['this'].sharedGetter = true;
    var OPERATORS = extend(createMap(), {
        '+': function (self, locals, a, b) {
            a = a(self, locals);
            b = b(self, locals);
            if (isDefined(a)) {
                if (isDefined(b)) {
                    return a + b;
                }
                return a;
            }
            return isDefined(b) ? b : undefined;
        },
        '-': function (self, locals, a, b) {
            a = a(self, locals);
            b = b(self, locals);
            return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
        },
        '*': function (self, locals, a, b) {
            return a(self, locals) * b(self, locals);
        },
        '/': function (self, locals, a, b) {
            return a(self, locals) / b(self, locals);
        },
        '%': function (self, locals, a, b) {
            return a(self, locals) % b(self, locals);
        },
        '===': function (self, locals, a, b) {
            return a(self, locals) === b(self, locals);
        },
        '!==': function (self, locals, a, b) {
            return a(self, locals) !== b(self, locals);
        },
        '==': function (self, locals, a, b) {
            return a(self, locals) == b(self, locals);
        },
        '!=': function (self, locals, a, b) {
            return a(self, locals) != b(self, locals);
        },
        '<': function (self, locals, a, b) {
            return a(self, locals) < b(self, locals);
        },
        '>': function (self, locals, a, b) {
            return a(self, locals) > b(self, locals);
        },
        '<=': function (self, locals, a, b) {
            return a(self, locals) <= b(self, locals);
        },
        '>=': function (self, locals, a, b) {
            return a(self, locals) >= b(self, locals);
        },
        '&&': function (self, locals, a, b) {
            return a(self, locals) && b(self, locals);
        },
        '||': function (self, locals, a, b) {
            return a(self, locals) || b(self, locals);
        },
        '!': function (self, locals, a) {
            return !a(self, locals);
        },
        '=': true,
        '|': true
    });
    var ESCAPE = {"n": "\n", "f": "\f", "r": "\r", "t": "\t", "v": "\v", "'": "'", '"': '"'};
    var Lexer = function (options) {
        this.options = options;
    };
    Lexer.prototype = {
        constructor: Lexer,
        lex: function (text) {
            this.text = text;
            this.index = 0;
            this.tokens = [];
            while (this.index < this.text.length) {
                var ch = this.text.charAt(this.index);
                if (ch === '"' || ch === "'") {
                    this.readString(ch);
                } else if (this.isNumber(ch) || ch === '.' && this.isNumber(this.peek())) {
                    this.readNumber();
                } else if (this.isIdent(ch)) {
                    this.readIdent();
                } else if (this.is(ch, '(){}[].,;:?')) {
                    this.tokens.push({index: this.index, text: ch});
                    this.index++;
                } else if (this.isWhitespace(ch)) {
                    this.index++;
                } else {
                    var ch2 = ch + this.peek();
                    var ch3 = ch2 + this.peek(2);
                    var op1 = OPERATORS[ch];
                    var op2 = OPERATORS[ch2];
                    var op3 = OPERATORS[ch3];
                    if (op1 || op2 || op3) {
                        var token = op3 ? ch3 : (op2 ? ch2 : ch);
                        this.tokens.push({index: this.index, text: token, operator: true});
                        this.index += token.length;
                    } else {
                        this.throwError('Unexpected next character ', this.index, this.index + 1);
                    }
                }
            }
            return this.tokens;
        },
        is: function (ch, chars) {
            return chars.indexOf(ch) !== -1;
        },
        peek: function (i) {
            var num = i || 1;
            return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
        },
        isNumber: function (ch) {
            return ('0' <= ch && ch <= '9') && typeof ch === "string";
        },
        isWhitespace: function (ch) {
            return (ch === ' ' || ch === '\r' || ch === '\t' ||
            ch === '\n' || ch === '\v' || ch === '\u00A0');
        },
        isIdent: function (ch) {
            return ('a' <= ch && ch <= 'z' ||
            'A' <= ch && ch <= 'Z' ||
            '_' === ch || ch === '$');
        },
        isExpOperator: function (ch) {
            return (ch === '-' || ch === '+' || this.isNumber(ch));
        },
        throwError: function (error, start, end) {
            end = end || this.index;
            var colStr = (isDefined(start)
                ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']'
                : ' ' + end);
            throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].',
                error, colStr, this.text);
        },
        readNumber: function () {
            var number = '';
            var start = this.index;
            while (this.index < this.text.length) {
                var ch = lowercase(this.text.charAt(this.index));
                if (ch == '.' || this.isNumber(ch)) {
                    number += ch;
                } else {
                    var peekCh = this.peek();
                    if (ch == 'e' && this.isExpOperator(peekCh)) {
                        number += ch;
                    } else if (this.isExpOperator(ch) &&
                        peekCh && this.isNumber(peekCh) &&
                        number.charAt(number.length - 1) == 'e') {
                        number += ch;
                    } else if (this.isExpOperator(ch) &&
                        (!peekCh || !this.isNumber(peekCh)) &&
                        number.charAt(number.length - 1) == 'e') {
                        this.throwError('Invalid exponent');
                    } else {
                        break;
                    }
                }
                this.index++;
            }
            this.tokens.push({
                index: start,
                text: number,
                constant: true,
                value: Number(number)
            });
        },
        readIdent: function () {
            var start = this.index;
            while (this.index < this.text.length) {
                var ch = this.text.charAt(this.index);
                if (!(this.isIdent(ch) || this.isNumber(ch))) {
                    break;
                }
                this.index++;
            }
            this.tokens.push({
                index: start,
                text: this.text.slice(start, this.index),
                identifier: true
            });
        },
        readString: function (quote) {
            var start = this.index;
            this.index++;
            var string = '';
            var rawString = quote;
            var escape = false;
            while (this.index < this.text.length) {
                var ch = this.text.charAt(this.index);
                rawString += ch;
                if (escape) {
                    if (ch === 'u') {
                        var hex = this.text.substring(this.index + 1, this.index + 5);
                        if (!hex.match(/[\da-f]{4}/i))
                            this.throwError('Invalid unicode escape [\\u' + hex + ']');
                        this.index += 4;
                        string += String.fromCharCode(parseInt(hex, 16));
                    } else {
                        var rep = ESCAPE[ch];
                        string = string + (rep || ch);
                    }
                    escape = false;
                } else if (ch === '\\') {
                    escape = true;
                } else if (ch === quote) {
                    this.index++;
                    this.tokens.push({
                        index: start,
                        text: rawString,
                        constant: true,
                        value: string
                    });
                    return;
                } else {
                    string += ch;
                }
                this.index++;
            }
            this.throwError('Unterminated quote', start);
        }
    };
    function isConstant(exp) {
        return exp.constant;
    }

    var Parser = function (lexer, $filter, options) {
        this.lexer = lexer;
        this.$filter = $filter;
        this.options = options;
    };
    Parser.ZERO = extend(function () {
        return 0;
    }, {
        sharedGetter: true,
        constant: true
    });
    Parser.prototype = {
        constructor: Parser,
        parse: function (text) {
            this.text = text;
            this.tokens = this.lexer.lex(text);
            var value = this.statements();
            if (this.tokens.length !== 0) {
                this.throwError('is an unexpected token', this.tokens[0]);
            }
            value.literal = !!value.literal;
            value.constant = !!value.constant;
            return value;
        },
        primary: function () {
            var primary;
            if (this.expect('(')) {
                primary = this.filterChain();
                this.consume(')');
            } else if (this.expect('[')) {
                primary = this.arrayDeclaration();
            } else if (this.expect('{')) {
                primary = this.object();
            } else if (this.peek().identifier && this.peek().text in CONSTANTS) {
                primary = CONSTANTS[this.consume().text];
            } else if (this.peek().identifier) {
                primary = this.identifier();
            } else if (this.peek().constant) {
                primary = this.constant();
            } else {
                this.throwError('not a primary expression', this.peek());
            }
            var next, context;
            while ((next = this.expect('(', '[', '.'))) {
                if (next.text === '(') {
                    primary = this.functionCall(primary, context);
                    context = null;
                } else if (next.text === '[') {
                    context = primary;
                    primary = this.objectIndex(primary);
                } else if (next.text === '.') {
                    context = primary;
                    primary = this.fieldAccess(primary);
                } else {
                    this.throwError('IMPOSSIBLE');
                }
            }
            return primary;
        },
        throwError: function (msg, token) {
            throw $parseMinErr('syntax',
                'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].',
                token.text, msg, (token.index + 1), this.text, this.text.substring(token.index));
        },
        peekToken: function () {
            if (this.tokens.length === 0)
                throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
            return this.tokens[0];
        },
        peek: function (e1, e2, e3, e4) {
            return this.peekAhead(0, e1, e2, e3, e4);
        },
        peekAhead: function (i, e1, e2, e3, e4) {
            if (this.tokens.length > i) {
                var token = this.tokens[i];
                var t = token.text;
                if (t === e1 || t === e2 || t === e3 || t === e4 ||
                    (!e1 && !e2 && !e3 && !e4)) {
                    return token;
                }
            }
            return false;
        },
        expect: function (e1, e2, e3, e4) {
            var token = this.peek(e1, e2, e3, e4);
            if (token) {
                this.tokens.shift();
                return token;
            }
            return false;
        },
        consume: function (e1) {
            if (this.tokens.length === 0) {
                throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
            }
            var token = this.expect(e1);
            if (!token) {
                this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
            }
            return token;
        },
        unaryFn: function (op, right) {
            var fn = OPERATORS[op];
            return extend(function $parseUnaryFn(self, locals) {
                return fn(self, locals, right);
            }, {
                constant: right.constant,
                inputs: [right]
            });
        },
        binaryFn: function (left, op, right, isBranching) {
            var fn = OPERATORS[op];
            return extend(function $parseBinaryFn(self, locals) {
                return fn(self, locals, left, right);
            }, {
                constant: left.constant && right.constant,
                inputs: !isBranching && [left, right]
            });
        },
        identifier: function () {
            var id = this.consume().text;
            while (this.peek('.') && this.peekAhead(1).identifier && !this.peekAhead(2, '(')) {
                id += this.consume().text + this.consume().text;
            }
            return getterFn(id, this.options, this.text);
        },
        constant: function () {
            var value = this.consume().value;
            return extend(function $parseConstant() {
                return value;
            }, {
                constant: true,
                literal: true
            });
        },
        statements: function () {
            var statements = [];
            while (true) {
                if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
                    statements.push(this.filterChain());
                if (!this.expect(';')) {
                    return (statements.length === 1)
                        ? statements[0]
                        : function $parseStatements(self, locals) {
                        var value;
                        for (var i = 0, ii = statements.length; i < ii; i++) {
                            value = statements[i](self, locals);
                        }
                        return value;
                    };
                }
            }
        },
        filterChain: function () {
            var left = this.expression();
            var token;
            while ((token = this.expect('|'))) {
                left = this.filter(left);
            }
            return left;
        },
        filter: function (inputFn) {
            var fn = this.$filter(this.consume().text);
            var argsFn;
            var args;
            if (this.peek(':')) {
                argsFn = [];
                args = [];
                while (this.expect(':')) {
                    argsFn.push(this.expression());
                }
            }
            var inputs = [inputFn].concat(argsFn || []);
            return extend(function $parseFilter(self, locals) {
                var input = inputFn(self, locals);
                if (args) {
                    args[0] = input;
                    var i = argsFn.length;
                    while (i--) {
                        args[i + 1] = argsFn[i](self, locals);
                    }
                    return fn.apply(undefined, args);
                }
                return fn(input);
            }, {
                constant: !fn.$stateful && inputs.every(isConstant),
                inputs: !fn.$stateful && inputs
            });
        },
        expression: function () {
            return this.assignment();
        },
        assignment: function () {
            var left = this.ternary();
            var right;
            var token;
            if ((token = this.expect('='))) {
                if (!left.assign) {
                    this.throwError('implies assignment but [' +
                        this.text.substring(0, token.index) + '] can not be assigned to', token);
                }
                right = this.ternary();
                return extend(function $parseAssignment(scope, locals) {
                    return left.assign(scope, right(scope, locals), locals);
                }, {
                    inputs: [left, right]
                });
            }
            return left;
        },
        ternary: function () {
            var left = this.logicalOR();
            var middle;
            var token;
            if ((token = this.expect('?'))) {
                middle = this.assignment();
                if (this.consume(':')) {
                    var right = this.assignment();
                    return extend(function $parseTernary(self, locals) {
                        return left(self, locals) ? middle(self, locals) : right(self, locals);
                    }, {
                        constant: left.constant && middle.constant && right.constant
                    });
                }
            }
            return left;
        },
        logicalOR: function () {
            var left = this.logicalAND();
            var token;
            while ((token = this.expect('||'))) {
                left = this.binaryFn(left, token.text, this.logicalAND(), true);
            }
            return left;
        },
        logicalAND: function () {
            var left = this.equality();
            var token;
            while ((token = this.expect('&&'))) {
                left = this.binaryFn(left, token.text, this.equality(), true);
            }
            return left;
        },
        equality: function () {
            var left = this.relational();
            var token;
            while ((token = this.expect('==', '!=', '===', '!=='))) {
                left = this.binaryFn(left, token.text, this.relational());
            }
            return left;
        },
        relational: function () {
            var left = this.additive();
            var token;
            while ((token = this.expect('<', '>', '<=', '>='))) {
                left = this.binaryFn(left, token.text, this.additive());
            }
            return left;
        },
        additive: function () {
            var left = this.multiplicative();
            var token;
            while ((token = this.expect('+', '-'))) {
                left = this.binaryFn(left, token.text, this.multiplicative());
            }
            return left;
        },
        multiplicative: function () {
            var left = this.unary();
            var token;
            while ((token = this.expect('*', '/', '%'))) {
                left = this.binaryFn(left, token.text, this.unary());
            }
            return left;
        },
        unary: function () {
            var token;
            if (this.expect('+')) {
                return this.primary();
            } else if ((token = this.expect('-'))) {
                return this.binaryFn(Parser.ZERO, token.text, this.unary());
            } else if ((token = this.expect('!'))) {
                return this.unaryFn(token.text, this.unary());
            } else {
                return this.primary();
            }
        },
        fieldAccess: function (object) {
            var getter = this.identifier();
            return extend(function $parseFieldAccess(scope, locals, self) {
                var o = self || object(scope, locals);
                return (o == null) ? undefined : getter(o);
            }, {
                assign: function (scope, value, locals) {
                    var o = object(scope, locals);
                    if (!o) object.assign(scope, o = {}, locals);
                    return getter.assign(o, value);
                }
            });
        },
        objectIndex: function (obj) {
            var expression = this.text;
            var indexFn = this.expression();
            this.consume(']');
            return extend(function $parseObjectIndex(self, locals) {
                var o = obj(self, locals),
                    i = getStringValue(indexFn(self, locals), expression),
                    v;
                ensureSafeMemberName(i, expression);
                if (!o) return undefined;
                v = ensureSafeObject(o[i], expression);
                return v;
            }, {
                assign: function (self, value, locals) {
                    var key = ensureSafeMemberName(getStringValue(indexFn(self, locals), expression), expression);
                    var o = ensureSafeObject(obj(self, locals), expression);
                    if (!o) obj.assign(self, o = {}, locals);
                    return o[key] = value;
                }
            });
        },
        functionCall: function (fnGetter, contextGetter) {
            var argsFn = [];
            if (this.peekToken().text !== ')') {
                do {
                    argsFn.push(this.expression());
                } while (this.expect(','));
            }
            this.consume(')');
            var expressionText = this.text;
            var args = argsFn.length ? [] : null;
            return function $parseFunctionCall(scope, locals) {
                var context = contextGetter ? contextGetter(scope, locals) : isDefined(contextGetter) ? undefined : scope;
                var fn = fnGetter(scope, locals, context) || noop;
                if (args) {
                    var i = argsFn.length;
                    while (i--) {
                        args[i] = ensureSafeObject(argsFn[i](scope, locals), expressionText);
                    }
                }
                ensureSafeObject(context, expressionText);
                ensureSafeFunction(fn, expressionText);
                var v = fn.apply
                    ? fn.apply(context, args)
                    : fn(args[0], args[1], args[2], args[3], args[4]);
                if (args) {
                    args.length = 0;
                }
                return ensureSafeObject(v, expressionText);
            };
        },
        arrayDeclaration: function () {
            var elementFns = [];
            if (this.peekToken().text !== ']') {
                do {
                    if (this.peek(']')) {
                        break;
                    }
                    elementFns.push(this.expression());
                } while (this.expect(','));
            }
            this.consume(']');
            return extend(function $parseArrayLiteral(self, locals) {
                var array = [];
                for (var i = 0, ii = elementFns.length; i < ii; i++) {
                    array.push(elementFns[i](self, locals));
                }
                return array;
            }, {
                literal: true,
                constant: elementFns.every(isConstant),
                inputs: elementFns
            });
        },
        object: function () {
            var keys = [], valueFns = [];
            if (this.peekToken().text !== '}') {
                do {
                    if (this.peek('}')) {
                        break;
                    }
                    var token = this.consume();
                    if (token.constant) {
                        keys.push(token.value);
                    } else if (token.identifier) {
                        keys.push(token.text);
                    } else {
                        this.throwError("invalid key", token);
                    }
                    this.consume(':');
                    valueFns.push(this.expression());
                } while (this.expect(','));
            }
            this.consume('}');
            return extend(function $parseObjectLiteral(self, locals) {
                var object = {};
                for (var i = 0, ii = valueFns.length; i < ii; i++) {
                    object[keys[i]] = valueFns[i](self, locals);
                }
                return object;
            }, {
                literal: true,
                constant: valueFns.every(isConstant),
                inputs: valueFns
            });
        }
    };
    function setter(obj, locals, path, setValue, fullExp) {
        ensureSafeObject(obj, fullExp);
        ensureSafeObject(locals, fullExp);
        var element = path.split('.'), key;
        for (var i = 0; element.length > 1; i++) {
            key = ensureSafeMemberName(element.shift(), fullExp);
            var propertyObj = (i === 0 && locals && locals[key]) || obj[key];
            if (!propertyObj) {
                propertyObj = {};
                obj[key] = propertyObj;
            }
            obj = ensureSafeObject(propertyObj, fullExp);
        }
        key = ensureSafeMemberName(element.shift(), fullExp);
        ensureSafeObject(obj[key], fullExp);
        obj[key] = setValue;
        return setValue;
    }

    var getterFnCacheDefault = createMap();
    var getterFnCacheExpensive = createMap();

    function isPossiblyDangerousMemberName(name) {
        return name == 'constructor';
    }

    function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, expensiveChecks) {
        ensureSafeMemberName(key0, fullExp);
        ensureSafeMemberName(key1, fullExp);
        ensureSafeMemberName(key2, fullExp);
        ensureSafeMemberName(key3, fullExp);
        ensureSafeMemberName(key4, fullExp);
        var eso = function (o) {
            return ensureSafeObject(o, fullExp);
        };
        var eso0 = (expensiveChecks || isPossiblyDangerousMemberName(key0)) ? eso : identity;
        var eso1 = (expensiveChecks || isPossiblyDangerousMemberName(key1)) ? eso : identity;
        var eso2 = (expensiveChecks || isPossiblyDangerousMemberName(key2)) ? eso : identity;
        var eso3 = (expensiveChecks || isPossiblyDangerousMemberName(key3)) ? eso : identity;
        var eso4 = (expensiveChecks || isPossiblyDangerousMemberName(key4)) ? eso : identity;
        return function cspSafeGetter(scope, locals) {
            var pathVal = (locals && locals.hasOwnProperty(key0)) ? locals : scope;
            if (pathVal == null) return pathVal;
            pathVal = eso0(pathVal[key0]);
            if (!key1) return pathVal;
            if (pathVal == null) return undefined;
            pathVal = eso1(pathVal[key1]);
            if (!key2) return pathVal;
            if (pathVal == null) return undefined;
            pathVal = eso2(pathVal[key2]);
            if (!key3) return pathVal;
            if (pathVal == null) return undefined;
            pathVal = eso3(pathVal[key3]);
            if (!key4) return pathVal;
            if (pathVal == null) return undefined;
            pathVal = eso4(pathVal[key4]);
            return pathVal;
        };
    }

    function getterFnWithEnsureSafeObject(fn, fullExpression) {
        return function (s, l) {
            return fn(s, l, ensureSafeObject, fullExpression);
        };
    }

    function getterFn(path, options, fullExp) {
        var expensiveChecks = options.expensiveChecks;
        var getterFnCache = (expensiveChecks ? getterFnCacheExpensive : getterFnCacheDefault);
        var fn = getterFnCache[path];
        if (fn) return fn;
        var pathKeys = path.split('.'),
            pathKeysLength = pathKeys.length;
        if (options.csp) {
            if (pathKeysLength < 6) {
                fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, expensiveChecks);
            } else {
                fn = function cspSafeGetter(scope, locals) {
                    var i = 0, val;
                    do {
                        val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++],
                            pathKeys[i++], fullExp, expensiveChecks)(scope, locals);
                        locals = undefined;
                        scope = val;
                    } while (i < pathKeysLength);
                    return val;
                };
            }
        } else {
            var code = '';
            if (expensiveChecks) {
                code += 's = eso(s, fe);\nl = eso(l, fe);\n';
            }
            var needsEnsureSafeObject = expensiveChecks;
            forEach(pathKeys, function (key, index) {
                ensureSafeMemberName(key, fullExp);
                var lookupJs = (index
                        ? 's'
                        : '((l&&l.hasOwnProperty("' + key + '"))?l:s)') + '.' + key;
                if (expensiveChecks || isPossiblyDangerousMemberName(key)) {
                    lookupJs = 'eso(' + lookupJs + ', fe)';
                    needsEnsureSafeObject = true;
                }
                code += 'if(s == null) return undefined;\n' +
                    's=' + lookupJs + ';\n';
            });
            code += 'return s;';
            var evaledFnGetter = new Function('s', 'l', 'eso', 'fe', code);
            evaledFnGetter.toString = valueFn(code);
            if (needsEnsureSafeObject) {
                evaledFnGetter = getterFnWithEnsureSafeObject(evaledFnGetter, fullExp);
            }
            fn = evaledFnGetter;
        }
        fn.sharedGetter = true;
        fn.assign = function (self, value, locals) {
            return setter(self, locals, path, value, path);
        };
        getterFnCache[path] = fn;
        return fn;
    }

    var objectValueOf = Object.prototype.valueOf;

    function getValueOf(value) {
        return isFunction(value.valueOf) ? value.valueOf() : objectValueOf.call(value);
    }

    function $ParseProvider() {
        var cacheDefault = createMap();
        var cacheExpensive = createMap();
        this.$get = ['$filter', '$sniffer', function ($filter, $sniffer) {
            var $parseOptions = {
                    csp: $sniffer.csp,
                    expensiveChecks: false
                },
                $parseOptionsExpensive = {
                    csp: $sniffer.csp,
                    expensiveChecks: true
                };

            function wrapSharedExpression(exp) {
                var wrapped = exp;
                if (exp.sharedGetter) {
                    wrapped = function $parseWrapper(self, locals) {
                        return exp(self, locals);
                    };
                    wrapped.literal = exp.literal;
                    wrapped.constant = exp.constant;
                    wrapped.assign = exp.assign;
                }
                return wrapped;
            }

            return function $parse(exp, interceptorFn, expensiveChecks) {
                var parsedExpression, oneTime, cacheKey;
                switch (typeof exp) {
                    case 'string':
                        cacheKey = exp = exp.trim();
                        var cache = (expensiveChecks ? cacheExpensive : cacheDefault);
                        parsedExpression = cache[cacheKey];
                        if (!parsedExpression) {
                            if (exp.charAt(0) === ':' && exp.charAt(1) === ':') {
                                oneTime = true;
                                exp = exp.substring(2);
                            }
                            var parseOptions = expensiveChecks ? $parseOptionsExpensive : $parseOptions;
                            var lexer = new Lexer(parseOptions);
                            var parser = new Parser(lexer, $filter, parseOptions);
                            parsedExpression = parser.parse(exp);
                            if (parsedExpression.constant) {
                                parsedExpression.$$watchDelegate = constantWatchDelegate;
                            } else if (oneTime) {
                                parsedExpression = wrapSharedExpression(parsedExpression);
                                parsedExpression.$$watchDelegate = parsedExpression.literal ?
                                    oneTimeLiteralWatchDelegate : oneTimeWatchDelegate;
                            } else if (parsedExpression.inputs) {
                                parsedExpression.$$watchDelegate = inputsWatchDelegate;
                            }
                            cache[cacheKey] = parsedExpression;
                        }
                        return addInterceptor(parsedExpression, interceptorFn);
                    case 'function':
                        return addInterceptor(exp, interceptorFn);
                    default:
                        return addInterceptor(noop, interceptorFn);
                }
            };
            function collectExpressionInputs(inputs, list) {
                for (var i = 0, ii = inputs.length; i < ii; i++) {
                    var input = inputs[i];
                    if (!input.constant) {
                        if (input.inputs) {
                            collectExpressionInputs(input.inputs, list);
                        } else if (list.indexOf(input) === -1) {
                            list.push(input);
                        }
                    }
                }
                return list;
            }

            function expressionInputDirtyCheck(newValue, oldValueOfValue) {
                if (newValue == null || oldValueOfValue == null) {
                    return newValue === oldValueOfValue;
                }
                if (typeof newValue === 'object') {
                    newValue = getValueOf(newValue);
                    if (typeof newValue === 'object') {
                        return false;
                    }
                }
                return newValue === oldValueOfValue || (newValue !== newValue && oldValueOfValue !== oldValueOfValue);
            }

            function inputsWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                var inputExpressions = parsedExpression.$$inputs ||
                    (parsedExpression.$$inputs = collectExpressionInputs(parsedExpression.inputs, []));
                var lastResult;
                if (inputExpressions.length === 1) {
                    var oldInputValue = expressionInputDirtyCheck;
                    inputExpressions = inputExpressions[0];
                    return scope.$watch(function expressionInputWatch(scope) {
                        var newInputValue = inputExpressions(scope);
                        if (!expressionInputDirtyCheck(newInputValue, oldInputValue)) {
                            lastResult = parsedExpression(scope);
                            oldInputValue = newInputValue && getValueOf(newInputValue);
                        }
                        return lastResult;
                    }, listener, objectEquality);
                }
                var oldInputValueOfValues = [];
                for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
                    oldInputValueOfValues[i] = expressionInputDirtyCheck;
                }
                return scope.$watch(function expressionInputsWatch(scope) {
                    var changed = false;
                    for (var i = 0, ii = inputExpressions.length; i < ii; i++) {
                        var newInputValue = inputExpressions[i](scope);
                        if (changed || (changed = !expressionInputDirtyCheck(newInputValue, oldInputValueOfValues[i]))) {
                            oldInputValueOfValues[i] = newInputValue && getValueOf(newInputValue);
                        }
                    }
                    if (changed) {
                        lastResult = parsedExpression(scope);
                    }
                    return lastResult;
                }, listener, objectEquality);
            }

            function oneTimeWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                var unwatch, lastValue;
                return unwatch = scope.$watch(function oneTimeWatch(scope) {
                    return parsedExpression(scope);
                }, function oneTimeListener(value, old, scope) {
                    lastValue = value;
                    if (isFunction(listener)) {
                        listener.apply(this, arguments);
                    }
                    if (isDefined(value)) {
                        scope.$$postDigest(function () {
                            if (isDefined(lastValue)) {
                                unwatch();
                            }
                        });
                    }
                }, objectEquality);
            }

            function oneTimeLiteralWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                var unwatch, lastValue;
                return unwatch = scope.$watch(function oneTimeWatch(scope) {
                    return parsedExpression(scope);
                }, function oneTimeListener(value, old, scope) {
                    lastValue = value;
                    if (isFunction(listener)) {
                        listener.call(this, value, old, scope);
                    }
                    if (isAllDefined(value)) {
                        scope.$$postDigest(function () {
                            if (isAllDefined(lastValue)) unwatch();
                        });
                    }
                }, objectEquality);
                function isAllDefined(value) {
                    var allDefined = true;
                    forEach(value, function (val) {
                        if (!isDefined(val)) allDefined = false;
                    });
                    return allDefined;
                }
            }

            function constantWatchDelegate(scope, listener, objectEquality, parsedExpression) {
                var unwatch;
                return unwatch = scope.$watch(function constantWatch(scope) {
                    return parsedExpression(scope);
                }, function constantListener(value, old, scope) {
                    if (isFunction(listener)) {
                        listener.apply(this, arguments);
                    }
                    unwatch();
                }, objectEquality);
            }

            function addInterceptor(parsedExpression, interceptorFn) {
                if (!interceptorFn) return parsedExpression;
                var watchDelegate = parsedExpression.$$watchDelegate;
                var regularWatch =
                    watchDelegate !== oneTimeLiteralWatchDelegate &&
                    watchDelegate !== oneTimeWatchDelegate;
                var fn = regularWatch ? function regularInterceptedExpression(scope, locals) {
                    var value = parsedExpression(scope, locals);
                    return interceptorFn(value, scope, locals);
                } : function oneTimeInterceptedExpression(scope, locals) {
                    var value = parsedExpression(scope, locals);
                    var result = interceptorFn(value, scope, locals);
                    return isDefined(value) ? result : value;
                };
                if (parsedExpression.$$watchDelegate &&
                    parsedExpression.$$watchDelegate !== inputsWatchDelegate) {
                    fn.$$watchDelegate = parsedExpression.$$watchDelegate;
                } else if (!interceptorFn.$stateful) {
                    fn.$$watchDelegate = inputsWatchDelegate;
                    fn.inputs = [parsedExpression];
                }
                return fn;
            }
        }];
    }

    function $QProvider() {
        this.$get = ['$rootScope', '$exceptionHandler', function ($rootScope, $exceptionHandler) {
            return qFactory(function (callback) {
                $rootScope.$evalAsync(callback);
            }, $exceptionHandler);
        }];
    }

    function $$QProvider() {
        this.$get = ['$browser', '$exceptionHandler', function ($browser, $exceptionHandler) {
            return qFactory(function (callback) {
                $browser.defer(callback);
            }, $exceptionHandler);
        }];
    }

    function qFactory(nextTick, exceptionHandler) {
        var $qMinErr = minErr('$q', TypeError);

        function callOnce(self, resolveFn, rejectFn) {
            var called = false;

            function wrap(fn) {
                return function (value) {
                    if (called) return;
                    called = true;
                    fn.call(self, value);
                };
            }

            return [wrap(resolveFn), wrap(rejectFn)];
        }

        var defer = function () {
            return new Deferred();
        };

        function Promise() {
            this.$$state = {status: 0};
        }

        Promise.prototype = {
            then: function (onFulfilled, onRejected, progressBack) {
                var result = new Deferred();
                this.$$state.pending = this.$$state.pending || [];
                this.$$state.pending.push([result, onFulfilled, onRejected, progressBack]);
                if (this.$$state.status > 0) scheduleProcessQueue(this.$$state);
                return result.promise;
            },
            "catch": function (callback) {
                return this.then(null, callback);
            },
            "finally": function (callback, progressBack) {
                return this.then(function (value) {
                    return handleCallback(value, true, callback);
                }, function (error) {
                    return handleCallback(error, false, callback);
                }, progressBack);
            }
        };
        function simpleBind(context, fn) {
            return function (value) {
                fn.call(context, value);
            };
        }

        function processQueue(state) {
            var fn, promise, pending;
            pending = state.pending;
            state.processScheduled = false;
            state.pending = undefined;
            for (var i = 0, ii = pending.length; i < ii; ++i) {
                promise = pending[i][0];
                fn = pending[i][state.status];
                try {
                    if (isFunction(fn)) {
                        promise.resolve(fn(state.value));
                    } else if (state.status === 1) {
                        promise.resolve(state.value);
                    } else {
                        promise.reject(state.value);
                    }
                } catch (e) {
                    promise.reject(e);
                    exceptionHandler(e);
                }
            }
        }

        function scheduleProcessQueue(state) {
            if (state.processScheduled || !state.pending) return;
            state.processScheduled = true;
            nextTick(function () {
                processQueue(state);
            });
        }

        function Deferred() {
            this.promise = new Promise();
            this.resolve = simpleBind(this, this.resolve);
            this.reject = simpleBind(this, this.reject);
            this.notify = simpleBind(this, this.notify);
        }

        Deferred.prototype = {
            resolve: function (val) {
                if (this.promise.$$state.status) return;
                if (val === this.promise) {
                    this.$$reject($qMinErr(
                        'qcycle',
                        "Expected promise to be resolved with value other than itself '{0}'",
                        val));
                } else {
                    this.$$resolve(val);
                }
            },
            $$resolve: function (val) {
                var then, fns;
                fns = callOnce(this, this.$$resolve, this.$$reject);
                try {
                    if ((isObject(val) || isFunction(val))) then = val && val.then;
                    if (isFunction(then)) {
                        this.promise.$$state.status = -1;
                        then.call(val, fns[0], fns[1], this.notify);
                    } else {
                        this.promise.$$state.value = val;
                        this.promise.$$state.status = 1;
                        scheduleProcessQueue(this.promise.$$state);
                    }
                } catch (e) {
                    fns[1](e);
                    exceptionHandler(e);
                }
            },
            reject: function (reason) {
                if (this.promise.$$state.status) return;
                this.$$reject(reason);
            },
            $$reject: function (reason) {
                this.promise.$$state.value = reason;
                this.promise.$$state.status = 2;
                scheduleProcessQueue(this.promise.$$state);
            },
            notify: function (progress) {
                var callbacks = this.promise.$$state.pending;
                if ((this.promise.$$state.status <= 0) && callbacks && callbacks.length) {
                    nextTick(function () {
                        var callback, result;
                        for (var i = 0, ii = callbacks.length; i < ii; i++) {
                            result = callbacks[i][0];
                            callback = callbacks[i][3];
                            try {
                                result.notify(isFunction(callback) ? callback(progress) : progress);
                            } catch (e) {
                                exceptionHandler(e);
                            }
                        }
                    });
                }
            }
        };
        var reject = function (reason) {
            var result = new Deferred();
            result.reject(reason);
            return result.promise;
        };
        var makePromise = function makePromise(value, resolved) {
            var result = new Deferred();
            if (resolved) {
                result.resolve(value);
            } else {
                result.reject(value);
            }
            return result.promise;
        };
        var handleCallback = function handleCallback(value, isResolved, callback) {
            var callbackOutput = null;
            try {
                if (isFunction(callback)) callbackOutput = callback();
            } catch (e) {
                return makePromise(e, false);
            }
            if (isPromiseLike(callbackOutput)) {
                return callbackOutput.then(function () {
                    return makePromise(value, isResolved);
                }, function (error) {
                    return makePromise(error, false);
                });
            } else {
                return makePromise(value, isResolved);
            }
        };
        var when = function (value, callback, errback, progressBack) {
            var result = new Deferred();
            result.resolve(value);
            return result.promise.then(callback, errback, progressBack);
        };

        function all(promises) {
            var deferred = new Deferred(),
                counter = 0,
                results = isArray(promises) ? [] : {};
            forEach(promises, function (promise, key) {
                counter++;
                when(promise).then(function (value) {
                    if (results.hasOwnProperty(key)) return;
                    results[key] = value;
                    if (!(--counter)) deferred.resolve(results);
                }, function (reason) {
                    if (results.hasOwnProperty(key)) return;
                    deferred.reject(reason);
                });
            });
            if (counter === 0) {
                deferred.resolve(results);
            }
            return deferred.promise;
        }

        var $Q = function Q(resolver) {
            if (!isFunction(resolver)) {
                throw $qMinErr('norslvr', "Expected resolverFn, got '{0}'", resolver);
            }
            if (!(this instanceof Q)) {
                return new Q(resolver);
            }
            var deferred = new Deferred();

            function resolveFn(value) {
                deferred.resolve(value);
            }

            function rejectFn(reason) {
                deferred.reject(reason);
            }

            resolver(resolveFn, rejectFn);
            return deferred.promise;
        };
        $Q.defer = defer;
        $Q.reject = reject;
        $Q.when = when;
        $Q.all = all;
        return $Q;
    }

    function $$RAFProvider() {
        this.$get = ['$window', '$timeout', function ($window, $timeout) {
            var requestAnimationFrame = $window.requestAnimationFrame ||
                $window.webkitRequestAnimationFrame;
            var cancelAnimationFrame = $window.cancelAnimationFrame ||
                $window.webkitCancelAnimationFrame ||
                $window.webkitCancelRequestAnimationFrame;
            var rafSupported = !!requestAnimationFrame;
            var rafFn = rafSupported
                ? function (fn) {
                var id = requestAnimationFrame(fn);
                return function () {
                    cancelAnimationFrame(id);
                };
            }
                : function (fn) {
                var timer = $timeout(fn, 16.66, false);
                return function () {
                    $timeout.cancel(timer);
                };
            };
            queueFn.supported = rafSupported;
            var cancelLastRAF;
            var taskCount = 0;
            var taskQueue = [];
            return queueFn;
            function flush() {
                for (var i = 0; i < taskQueue.length; i++) {
                    var task = taskQueue[i];
                    if (task) {
                        taskQueue[i] = null;
                        task();
                    }
                }
                taskCount = taskQueue.length = 0;
            }

            function queueFn(asyncFn) {
                var index = taskQueue.length;
                taskCount++;
                taskQueue.push(asyncFn);
                if (index === 0) {
                    cancelLastRAF = rafFn(flush);
                }
                return function cancelQueueFn() {
                    if (index >= 0) {
                        taskQueue[index] = null;
                        index = null;
                        if (--taskCount === 0 && cancelLastRAF) {
                            cancelLastRAF();
                            cancelLastRAF = null;
                            taskQueue.length = 0;
                        }
                    }
                };
            }
        }];
    }

    function $RootScopeProvider() {
        var TTL = 10;
        var $rootScopeMinErr = minErr('$rootScope');
        var lastDirtyWatch = null;
        var applyAsyncId = null;
        this.digestTtl = function (value) {
            if (arguments.length) {
                TTL = value;
            }
            return TTL;
        };
        function createChildScopeClass(parent) {
            function ChildScope() {
                this.$$watchers = this.$$nextSibling =
                    this.$$childHead = this.$$childTail = null;
                this.$$listeners = {};
                this.$$listenerCount = {};
                this.$id = nextUid();
                this.$$ChildScope = null;
            }

            ChildScope.prototype = parent;
            return ChildScope;
        }

        this.$get = ['$injector', '$exceptionHandler', '$parse', '$browser',
            function ($injector, $exceptionHandler, $parse, $browser) {
                function destroyChildScope($event) {
                    $event.currentScope.$$destroyed = true;
                }

                function Scope() {
                    this.$id = nextUid();
                    this.$$phase = this.$parent = this.$$watchers =
                        this.$$nextSibling = this.$$prevSibling =
                            this.$$childHead = this.$$childTail = null;
                    this.$root = this;
                    this.$$destroyed = false;
                    this.$$listeners = {};
                    this.$$listenerCount = {};
                    this.$$isolateBindings = null;
                }

                Scope.prototype = {
                    constructor: Scope,
                    $new: function (isolate, parent) {
                        var child;
                        parent = parent || this;
                        if (isolate) {
                            child = new Scope();
                            child.$root = this.$root;
                        } else {
                            if (!this.$$ChildScope) {
                                this.$$ChildScope = createChildScopeClass(this);
                            }
                            child = new this.$$ChildScope();
                        }
                        child.$parent = parent;
                        child.$$prevSibling = parent.$$childTail;
                        if (parent.$$childHead) {
                            parent.$$childTail.$$nextSibling = child;
                            parent.$$childTail = child;
                        } else {
                            parent.$$childHead = parent.$$childTail = child;
                        }
                        if (isolate || parent != this) child.$on('$destroy', destroyChildScope);
                        return child;
                    },
                    $watch: function (watchExp, listener, objectEquality) {
                        var get = $parse(watchExp);
                        if (get.$$watchDelegate) {
                            return get.$$watchDelegate(this, listener, objectEquality, get);
                        }
                        var scope = this,
                            array = scope.$$watchers,
                            watcher = {
                                fn: listener,
                                last: initWatchVal,
                                get: get,
                                exp: watchExp,
                                eq: !!objectEquality
                            };
                        lastDirtyWatch = null;
                        if (!isFunction(listener)) {
                            watcher.fn = noop;
                        }
                        if (!array) {
                            array = scope.$$watchers = [];
                        }
                        array.unshift(watcher);
                        return function deregisterWatch() {
                            arrayRemove(array, watcher);
                            lastDirtyWatch = null;
                        };
                    },
                    $watchGroup: function (watchExpressions, listener) {
                        var oldValues = new Array(watchExpressions.length);
                        var newValues = new Array(watchExpressions.length);
                        var deregisterFns = [];
                        var self = this;
                        var changeReactionScheduled = false;
                        var firstRun = true;
                        if (!watchExpressions.length) {
                            var shouldCall = true;
                            self.$evalAsync(function () {
                                if (shouldCall) listener(newValues, newValues, self);
                            });
                            return function deregisterWatchGroup() {
                                shouldCall = false;
                            };
                        }
                        if (watchExpressions.length === 1) {
                            return this.$watch(watchExpressions[0], function watchGroupAction(value, oldValue, scope) {
                                newValues[0] = value;
                                oldValues[0] = oldValue;
                                listener(newValues, (value === oldValue) ? newValues : oldValues, scope);
                            });
                        }
                        forEach(watchExpressions, function (expr, i) {
                            var unwatchFn = self.$watch(expr, function watchGroupSubAction(value, oldValue) {
                                newValues[i] = value;
                                oldValues[i] = oldValue;
                                if (!changeReactionScheduled) {
                                    changeReactionScheduled = true;
                                    self.$evalAsync(watchGroupAction);
                                }
                            });
                            deregisterFns.push(unwatchFn);
                        });
                        function watchGroupAction() {
                            changeReactionScheduled = false;
                            if (firstRun) {
                                firstRun = false;
                                listener(newValues, newValues, self);
                            } else {
                                listener(newValues, oldValues, self);
                            }
                        }

                        return function deregisterWatchGroup() {
                            while (deregisterFns.length) {
                                deregisterFns.shift()();
                            }
                        };
                    },
                    $watchCollection: function (obj, listener) {
                        $watchCollectionInterceptor.$stateful = true;
                        var self = this;
                        var newValue;
                        var oldValue;
                        var veryOldValue;
                        var trackVeryOldValue = (listener.length > 1);
                        var changeDetected = 0;
                        var changeDetector = $parse(obj, $watchCollectionInterceptor);
                        var internalArray = [];
                        var internalObject = {};
                        var initRun = true;
                        var oldLength = 0;

                        function $watchCollectionInterceptor(_value) {
                            newValue = _value;
                            var newLength, key, bothNaN, newItem, oldItem;
                            if (isUndefined(newValue)) return;
                            if (!isObject(newValue)) {
                                if (oldValue !== newValue) {
                                    oldValue = newValue;
                                    changeDetected++;
                                }
                            } else if (isArrayLike(newValue)) {
                                if (oldValue !== internalArray) {
                                    oldValue = internalArray;
                                    oldLength = oldValue.length = 0;
                                    changeDetected++;
                                }
                                newLength = newValue.length;
                                if (oldLength !== newLength) {
                                    changeDetected++;
                                    oldValue.length = oldLength = newLength;
                                }
                                for (var i = 0; i < newLength; i++) {
                                    oldItem = oldValue[i];
                                    newItem = newValue[i];
                                    bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
                                    if (!bothNaN && (oldItem !== newItem)) {
                                        changeDetected++;
                                        oldValue[i] = newItem;
                                    }
                                }
                            } else {
                                if (oldValue !== internalObject) {
                                    oldValue = internalObject = {};
                                    oldLength = 0;
                                    changeDetected++;
                                }
                                newLength = 0;
                                for (key in newValue) {
                                    if (newValue.hasOwnProperty(key)) {
                                        newLength++;
                                        newItem = newValue[key];
                                        oldItem = oldValue[key];
                                        if (key in oldValue) {
                                            bothNaN = (oldItem !== oldItem) && (newItem !== newItem);
                                            if (!bothNaN && (oldItem !== newItem)) {
                                                changeDetected++;
                                                oldValue[key] = newItem;
                                            }
                                        } else {
                                            oldLength++;
                                            oldValue[key] = newItem;
                                            changeDetected++;
                                        }
                                    }
                                }
                                if (oldLength > newLength) {
                                    changeDetected++;
                                    for (key in oldValue) {
                                        if (!newValue.hasOwnProperty(key)) {
                                            oldLength--;
                                            delete oldValue[key];
                                        }
                                    }
                                }
                            }
                            return changeDetected;
                        }

                        function $watchCollectionAction() {
                            if (initRun) {
                                initRun = false;
                                listener(newValue, newValue, self);
                            } else {
                                listener(newValue, veryOldValue, self);
                            }
                            if (trackVeryOldValue) {
                                if (!isObject(newValue)) {
                                    veryOldValue = newValue;
                                } else if (isArrayLike(newValue)) {
                                    veryOldValue = new Array(newValue.length);
                                    for (var i = 0; i < newValue.length; i++) {
                                        veryOldValue[i] = newValue[i];
                                    }
                                } else {
                                    veryOldValue = {};
                                    for (var key in newValue) {
                                        if (hasOwnProperty.call(newValue, key)) {
                                            veryOldValue[key] = newValue[key];
                                        }
                                    }
                                }
                            }
                        }

                        return this.$watch(changeDetector, $watchCollectionAction);
                    },
                    $digest: function () {
                        var watch, value, last,
                            watchers,
                            length,
                            dirty, ttl = TTL,
                            next, current, target = this,
                            watchLog = [],
                            logIdx, logMsg, asyncTask;
                        beginPhase('$digest');
                        $browser.$$checkUrlChange();
                        if (this === $rootScope && applyAsyncId !== null) {
                            $browser.defer.cancel(applyAsyncId);
                            flushApplyAsync();
                        }
                        lastDirtyWatch = null;
                        do {
                            dirty = false;
                            current = target;
                            while (asyncQueue.length) {
                                try {
                                    asyncTask = asyncQueue.shift();
                                    asyncTask.scope.$eval(asyncTask.expression, asyncTask.locals);
                                } catch (e) {
                                    $exceptionHandler(e);
                                }
                                lastDirtyWatch = null;
                            }
                            traverseScopesLoop:
                                do {
                                    if ((watchers = current.$$watchers)) {
                                        length = watchers.length;
                                        while (length--) {
                                            try {
                                                watch = watchers[length];
                                                if (watch) {
                                                    if ((value = watch.get(current)) !== (last = watch.last) && !(watch.eq
                                                            ? equals(value, last)
                                                            : (typeof value === 'number' && typeof last === 'number'
                                                        && isNaN(value) && isNaN(last)))) {
                                                        dirty = true;
                                                        lastDirtyWatch = watch;
                                                        watch.last = watch.eq ? copy(value, null) : value;
                                                        watch.fn(value, ((last === initWatchVal) ? value : last), current);
                                                        if (ttl < 5) {
                                                            logIdx = 4 - ttl;
                                                            if (!watchLog[logIdx]) watchLog[logIdx] = [];
                                                            watchLog[logIdx].push({
                                                                msg: isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp,
                                                                newVal: value,
                                                                oldVal: last
                                                            });
                                                        }
                                                    } else if (watch === lastDirtyWatch) {
                                                        dirty = false;
                                                        break traverseScopesLoop;
                                                    }
                                                }
                                            } catch (e) {
                                                $exceptionHandler(e);
                                            }
                                        }
                                    }
                                    if (!(next = (current.$$childHead ||
                                        (current !== target && current.$$nextSibling)))) {
                                        while (current !== target && !(next = current.$$nextSibling)) {
                                            current = current.$parent;
                                        }
                                    }
                                } while ((current = next));
                            if ((dirty || asyncQueue.length) && !(ttl--)) {
                                clearPhase();
                                throw $rootScopeMinErr('infdig',
                                    '{0} $digest() iterations reached. Aborting!\n' +
                                    'Watchers fired in the last 5 iterations: {1}',
                                    TTL, watchLog);
                            }
                        } while (dirty || asyncQueue.length);
                        clearPhase();
                        while (postDigestQueue.length) {
                            try {
                                postDigestQueue.shift()();
                            } catch (e) {
                                $exceptionHandler(e);
                            }
                        }
                    },
                    $destroy: function () {
                        if (this.$$destroyed) return;
                        var parent = this.$parent;
                        this.$broadcast('$destroy');
                        this.$$destroyed = true;
                        if (this === $rootScope) return;
                        for (var eventName in this.$$listenerCount) {
                            decrementListenerCount(this, this.$$listenerCount[eventName], eventName);
                        }
                        if (parent.$$childHead == this) parent.$$childHead = this.$$nextSibling;
                        if (parent.$$childTail == this) parent.$$childTail = this.$$prevSibling;
                        if (this.$$prevSibling) this.$$prevSibling.$$nextSibling = this.$$nextSibling;
                        if (this.$$nextSibling) this.$$nextSibling.$$prevSibling = this.$$prevSibling;
                        this.$destroy = this.$digest = this.$apply = this.$evalAsync = this.$applyAsync = noop;
                        this.$on = this.$watch = this.$watchGroup = function () {
                            return noop;
                        };
                        this.$$listeners = {};
                        this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead =
                            this.$$childTail = this.$root = this.$$watchers = null;
                    },
                    $eval: function (expr, locals) {
                        return $parse(expr)(this, locals);
                    },
                    $evalAsync: function (expr, locals) {
                        if (!$rootScope.$$phase && !asyncQueue.length) {
                            $browser.defer(function () {
                                if (asyncQueue.length) {
                                    $rootScope.$digest();
                                }
                            });
                        }
                        asyncQueue.push({scope: this, expression: expr, locals: locals});
                    },
                    $$postDigest: function (fn) {
                        postDigestQueue.push(fn);
                    },
                    $apply: function (expr) {
                        try {
                            beginPhase('$apply');
                            return this.$eval(expr);
                        } catch (e) {
                            $exceptionHandler(e);
                        } finally {
                            clearPhase();
                            try {
                                $rootScope.$digest();
                            } catch (e) {
                                $exceptionHandler(e);
                                throw e;
                            }
                        }
                    },
                    $applyAsync: function (expr) {
                        var scope = this;
                        expr && applyAsyncQueue.push($applyAsyncExpression);
                        scheduleApplyAsync();
                        function $applyAsyncExpression() {
                            scope.$eval(expr);
                        }
                    },
                    $on: function (name, listener) {
                        var namedListeners = this.$$listeners[name];
                        if (!namedListeners) {
                            this.$$listeners[name] = namedListeners = [];
                        }
                        namedListeners.push(listener);
                        var current = this;
                        do {
                            if (!current.$$listenerCount[name]) {
                                current.$$listenerCount[name] = 0;
                            }
                            current.$$listenerCount[name]++;
                        } while ((current = current.$parent));
                        var self = this;
                        return function () {
                            var indexOfListener = namedListeners.indexOf(listener);
                            if (indexOfListener !== -1) {
                                namedListeners[indexOfListener] = null;
                                decrementListenerCount(self, 1, name);
                            }
                        };
                    },
                    $emit: function (name, args) {
                        var empty = [],
                            namedListeners,
                            scope = this,
                            stopPropagation = false,
                            event = {
                                name: name,
                                targetScope: scope,
                                stopPropagation: function () {
                                    stopPropagation = true;
                                },
                                preventDefault: function () {
                                    event.defaultPrevented = true;
                                },
                                defaultPrevented: false
                            },
                            listenerArgs = concat([event], arguments, 1),
                            i, length;
                        do {
                            namedListeners = scope.$$listeners[name] || empty;
                            event.currentScope = scope;
                            for (i = 0, length = namedListeners.length; i < length; i++) {
                                if (!namedListeners[i]) {
                                    namedListeners.splice(i, 1);
                                    i--;
                                    length--;
                                    continue;
                                }
                                try {
                                    namedListeners[i].apply(null, listenerArgs);
                                } catch (e) {
                                    $exceptionHandler(e);
                                }
                            }
                            if (stopPropagation) {
                                event.currentScope = null;
                                return event;
                            }
                            scope = scope.$parent;
                        } while (scope);
                        event.currentScope = null;
                        return event;
                    },
                    $broadcast: function (name, args) {
                        var target = this,
                            current = target,
                            next = target,
                            event = {
                                name: name,
                                targetScope: target,
                                preventDefault: function () {
                                    event.defaultPrevented = true;
                                },
                                defaultPrevented: false
                            };
                        if (!target.$$listenerCount[name]) return event;
                        var listenerArgs = concat([event], arguments, 1),
                            listeners, i, length;
                        while ((current = next)) {
                            event.currentScope = current;
                            listeners = current.$$listeners[name] || [];
                            for (i = 0, length = listeners.length; i < length; i++) {
                                if (!listeners[i]) {
                                    listeners.splice(i, 1);
                                    i--;
                                    length--;
                                    continue;
                                }
                                try {
                                    listeners[i].apply(null, listenerArgs);
                                } catch (e) {
                                    $exceptionHandler(e);
                                }
                            }
                            if (!(next = ((current.$$listenerCount[name] && current.$$childHead) ||
                                (current !== target && current.$$nextSibling)))) {
                                while (current !== target && !(next = current.$$nextSibling)) {
                                    current = current.$parent;
                                }
                            }
                        }
                        event.currentScope = null;
                        return event;
                    }
                };
                var $rootScope = new Scope();
                var asyncQueue = $rootScope.$$asyncQueue = [];
                var postDigestQueue = $rootScope.$$postDigestQueue = [];
                var applyAsyncQueue = $rootScope.$$applyAsyncQueue = [];
                return $rootScope;
                function beginPhase(phase) {
                    if ($rootScope.$$phase) {
                        throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
                    }
                    $rootScope.$$phase = phase;
                }

                function clearPhase() {
                    $rootScope.$$phase = null;
                }

                function decrementListenerCount(current, count, name) {
                    do {
                        current.$$listenerCount[name] -= count;
                        if (current.$$listenerCount[name] === 0) {
                            delete current.$$listenerCount[name];
                        }
                    } while ((current = current.$parent));
                }

                function initWatchVal() {
                }

                function flushApplyAsync() {
                    while (applyAsyncQueue.length) {
                        try {
                            applyAsyncQueue.shift()();
                        } catch (e) {
                            $exceptionHandler(e);
                        }
                    }
                    applyAsyncId = null;
                }

                function scheduleApplyAsync() {
                    if (applyAsyncId === null) {
                        applyAsyncId = $browser.defer(function () {
                            $rootScope.$apply(flushApplyAsync);
                        });
                    }
                }
            }];
    }

    function $$SanitizeUriProvider() {
        var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/,
            imgSrcSanitizationWhitelist = /^\s*((https?|ftp|file|blob):|data:image\/)/;
        this.aHrefSanitizationWhitelist = function (regexp) {
            if (isDefined(regexp)) {
                aHrefSanitizationWhitelist = regexp;
                return this;
            }
            return aHrefSanitizationWhitelist;
        };
        this.imgSrcSanitizationWhitelist = function (regexp) {
            if (isDefined(regexp)) {
                imgSrcSanitizationWhitelist = regexp;
                return this;
            }
            return imgSrcSanitizationWhitelist;
        };
        this.$get = function () {
            return function sanitizeUri(uri, isImage) {
                var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
                var normalizedVal;
                normalizedVal = urlResolve(uri).href;
                if (normalizedVal !== '' && !normalizedVal.match(regex)) {
                    return 'unsafe:' + normalizedVal;
                }
                return uri;
            };
        };
    }

    var $sceMinErr = minErr('$sce');
    var SCE_CONTEXTS = {
        HTML: 'html',
        CSS: 'css',
        URL: 'url',
        RESOURCE_URL: 'resourceUrl',
        JS: 'js'
    };

    function adjustMatcher(matcher) {
        if (matcher === 'self') {
            return matcher;
        } else if (isString(matcher)) {
            if (matcher.indexOf('***') > -1) {
                throw $sceMinErr('iwcard',
                    'Illegal sequence *** in string matcher.  String: {0}', matcher);
            }
            matcher = escapeForRegexp(matcher).
                replace('\\*\\*', '.*').
                replace('\\*', '[^:/.?&;]*');
            return new RegExp('^' + matcher + '$');
        } else if (isRegExp(matcher)) {
            return new RegExp('^' + matcher.source + '$');
        } else {
            throw $sceMinErr('imatcher',
                'Matchers may only be "self", string patterns or RegExp objects');
        }
    }

    function adjustMatchers(matchers) {
        var adjustedMatchers = [];
        if (isDefined(matchers)) {
            forEach(matchers, function (matcher) {
                adjustedMatchers.push(adjustMatcher(matcher));
            });
        }
        return adjustedMatchers;
    }

    function $SceDelegateProvider() {
        this.SCE_CONTEXTS = SCE_CONTEXTS;
        var resourceUrlWhitelist = ['self'],
            resourceUrlBlacklist = [];
        this.resourceUrlWhitelist = function (value) {
            if (arguments.length) {
                resourceUrlWhitelist = adjustMatchers(value);
            }
            return resourceUrlWhitelist;
        };
        this.resourceUrlBlacklist = function (value) {
            if (arguments.length) {
                resourceUrlBlacklist = adjustMatchers(value);
            }
            return resourceUrlBlacklist;
        };
        this.$get = ['$injector', function ($injector) {
            var htmlSanitizer = function htmlSanitizer(html) {
                throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
            };
            if ($injector.has('$sanitize')) {
                htmlSanitizer = $injector.get('$sanitize');
            }
            function matchUrl(matcher, parsedUrl) {
                if (matcher === 'self') {
                    return urlIsSameOrigin(parsedUrl);
                } else {
                    return !!matcher.exec(parsedUrl.href);
                }
            }

            function isResourceUrlAllowedByPolicy(url) {
                var parsedUrl = urlResolve(url.toString());
                var i, n, allowed = false;
                for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
                    if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
                        allowed = true;
                        break;
                    }
                }
                if (allowed) {
                    for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
                        if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                            allowed = false;
                            break;
                        }
                    }
                }
                return allowed;
            }

            function generateHolderType(Base) {
                var holderType = function TrustedValueHolderType(trustedValue) {
                    this.$$unwrapTrustedValue = function () {
                        return trustedValue;
                    };
                };
                if (Base) {
                    holderType.prototype = new Base();
                }
                holderType.prototype.valueOf = function sceValueOf() {
                    return this.$$unwrapTrustedValue();
                };
                holderType.prototype.toString = function sceToString() {
                    return this.$$unwrapTrustedValue().toString();
                };
                return holderType;
            }

            var trustedValueHolderBase = generateHolderType(),
                byType = {};
            byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
            byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
            byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
            byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
            byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);
            function trustAs(type, trustedValue) {
                var Constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
                if (!Constructor) {
                    throw $sceMinErr('icontext',
                        'Attempted to trust a value in invalid context. Context: {0}; Value: {1}',
                        type, trustedValue);
                }
                if (trustedValue === null || trustedValue === undefined || trustedValue === '') {
                    return trustedValue;
                }
                if (typeof trustedValue !== 'string') {
                    throw $sceMinErr('itype',
                        'Attempted to trust a non-string value in a content requiring a string: Context: {0}',
                        type);
                }
                return new Constructor(trustedValue);
            }

            function valueOf(maybeTrusted) {
                if (maybeTrusted instanceof trustedValueHolderBase) {
                    return maybeTrusted.$$unwrapTrustedValue();
                } else {
                    return maybeTrusted;
                }
            }

            function getTrusted(type, maybeTrusted) {
                if (maybeTrusted === null || maybeTrusted === undefined || maybeTrusted === '') {
                    return maybeTrusted;
                }
                var constructor = (byType.hasOwnProperty(type) ? byType[type] : null);
                if (constructor && maybeTrusted instanceof constructor) {
                    return maybeTrusted.$$unwrapTrustedValue();
                }
                if (type === SCE_CONTEXTS.RESOURCE_URL) {
                    if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
                        return maybeTrusted;
                    } else {
                        throw $sceMinErr('insecurl',
                            'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}',
                            maybeTrusted.toString());
                    }
                } else if (type === SCE_CONTEXTS.HTML) {
                    return htmlSanitizer(maybeTrusted);
                }
                throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
            }

            return {
                trustAs: trustAs,
                getTrusted: getTrusted,
                valueOf: valueOf
            };
        }];
    }

    function $SceProvider() {
        var enabled = true;
        this.enabled = function (value) {
            if (arguments.length) {
                enabled = !!value;
            }
            return enabled;
        };
        this.$get = ['$parse', '$sceDelegate', function ($parse, $sceDelegate) {
            if (enabled && msie < 8) {
                throw $sceMinErr('iequirks',
                    'Strict Contextual Escaping does not support Internet Explorer version < 11 in quirks ' +
                    'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' +
                    'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
            }
            var sce = shallowCopy(SCE_CONTEXTS);
            sce.isEnabled = function () {
                return enabled;
            };
            sce.trustAs = $sceDelegate.trustAs;
            sce.getTrusted = $sceDelegate.getTrusted;
            sce.valueOf = $sceDelegate.valueOf;
            if (!enabled) {
                sce.trustAs = sce.getTrusted = function (type, value) {
                    return value;
                };
                sce.valueOf = identity;
            }
            sce.parseAs = function sceParseAs(type, expr) {
                var parsed = $parse(expr);
                if (parsed.literal && parsed.constant) {
                    return parsed;
                } else {
                    return $parse(expr, function (value) {
                        return sce.getTrusted(type, value);
                    });
                }
            };
            var parse = sce.parseAs,
                getTrusted = sce.getTrusted,
                trustAs = sce.trustAs;
            forEach(SCE_CONTEXTS, function (enumValue, name) {
                var lName = lowercase(name);
                sce[camelCase("parse_as_" + lName)] = function (expr) {
                    return parse(enumValue, expr);
                };
                sce[camelCase("get_trusted_" + lName)] = function (value) {
                    return getTrusted(enumValue, value);
                };
                sce[camelCase("trust_as_" + lName)] = function (value) {
                    return trustAs(enumValue, value);
                };
            });
            return sce;
        }];
    }

    function $SnifferProvider() {
        this.$get = ['$window', '$document', function ($window, $document) {
            var eventSupport = {},
                android =
                    int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]),
                boxee = /Boxee/i.test(($window.navigator || {}).userAgent),
                document = $document[0] || {},
                vendorPrefix,
                vendorRegex = /^(Moz|webkit|ms)(?=[A-Z])/,
                bodyStyle = document.body && document.body.style,
                transitions = false,
                animations = false,
                match;
            if (bodyStyle) {
                for (var prop in bodyStyle) {
                    if (match = vendorRegex.exec(prop)) {
                        vendorPrefix = match[0];
                        vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
                        break;
                    }
                }
                if (!vendorPrefix) {
                    vendorPrefix = ('WebkitOpacity' in bodyStyle) && 'webkit';
                }
                transitions = !!(('transition' in bodyStyle) || (vendorPrefix + 'Transition' in bodyStyle));
                animations = !!(('animation' in bodyStyle) || (vendorPrefix + 'Animation' in bodyStyle));
                if (android && (!transitions || !animations)) {
                    transitions = isString(document.body.style.webkitTransition);
                    animations = isString(document.body.style.webkitAnimation);
                }
            }
            return {
                history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
                hasEvent: function (event) {
                    if (event === 'input' && msie <= 11) return false;
                    if (isUndefined(eventSupport[event])) {
                        var divElm = document.createElement('div');
                        eventSupport[event] = 'on' + event in divElm;
                    }
                    return eventSupport[event];
                },
                csp: csp(),
                vendorPrefix: vendorPrefix,
                transitions: transitions,
                animations: animations,
                android: android
            };
        }];
    }

    var $compileMinErr = minErr('$compile');

    function $TemplateRequestProvider() {
        this.$get = ['$templateCache', '$http', '$q', '$sce', function ($templateCache, $http, $q, $sce) {
            function handleRequestFn(tpl, ignoreRequestError) {
                handleRequestFn.totalPendingRequests++;
                if (!isString(tpl) || !$templateCache.get(tpl)) {
                    tpl = $sce.getTrustedResourceUrl(tpl);
                }
                var transformResponse = $http.defaults && $http.defaults.transformResponse;
                if (isArray(transformResponse)) {
                    transformResponse = transformResponse.filter(function (transformer) {
                        return transformer !== defaultHttpResponseTransform;
                    });
                } else if (transformResponse === defaultHttpResponseTransform) {
                    transformResponse = null;
                }
                var httpOptions = {
                    cache: $templateCache,
                    transformResponse: transformResponse
                };
                return $http.get(tpl, httpOptions)
                    ['finally'](function () {
                    handleRequestFn.totalPendingRequests--;
                })
                    .then(function (response) {
                        return response.data;
                    }, handleError);
                function handleError(resp) {
                    if (!ignoreRequestError) {
                        throw $compileMinErr('tpload', 'Failed to load template: {0}', tpl);
                    }
                    return $q.reject(resp);
                }
            }

            handleRequestFn.totalPendingRequests = 0;
            return handleRequestFn;
        }];
    }

    function $$TestabilityProvider() {
        this.$get = ['$rootScope', '$browser', '$location',
            function ($rootScope, $browser, $location) {
                var testability = {};
                testability.findBindings = function (element, expression, opt_exactMatch) {
                    var bindings = element.getElementsByClassName('ng-binding');
                    var matches = [];
                    forEach(bindings, function (binding) {
                        var dataBinding = angular.element(binding).data('$binding');
                        if (dataBinding) {
                            forEach(dataBinding, function (bindingName) {
                                if (opt_exactMatch) {
                                    var matcher = new RegExp('(^|\\s)' + escapeForRegexp(expression) + '(\\s|\\||$)');
                                    if (matcher.test(bindingName)) {
                                        matches.push(binding);
                                    }
                                } else {
                                    if (bindingName.indexOf(expression) != -1) {
                                        matches.push(binding);
                                    }
                                }
                            });
                        }
                    });
                    return matches;
                };
                testability.findModels = function (element, expression, opt_exactMatch) {
                    var prefixes = ['ng-', 'data-ng-', 'ng\\:'];
                    for (var p = 0; p < prefixes.length; ++p) {
                        var attributeEquals = opt_exactMatch ? '=' : '*=';
                        var selector = '[' + prefixes[p] + 'model' + attributeEquals + '"' + expression + '"]';
                        var elements = element.querySelectorAll(selector);
                        if (elements.length) {
                            return elements;
                        }
                    }
                };
                testability.getLocation = function () {
                    return $location.url();
                };
                testability.setLocation = function (url) {
                    if (url !== $location.url()) {
                        $location.url(url);
                        $rootScope.$digest();
                    }
                };
                testability.whenStable = function (callback) {
                    $browser.notifyWhenNoOutstandingRequests(callback);
                };
                return testability;
            }];
    }

    function $TimeoutProvider() {
        this.$get = ['$rootScope', '$browser', '$q', '$$q', '$exceptionHandler',
            function ($rootScope, $browser, $q, $$q, $exceptionHandler) {
                var deferreds = {};

                function timeout(fn, delay, invokeApply) {
                    var skipApply = (isDefined(invokeApply) && !invokeApply),
                        deferred = (skipApply ? $$q : $q).defer(),
                        promise = deferred.promise,
                        timeoutId;
                    timeoutId = $browser.defer(function () {
                        try {
                            deferred.resolve(fn());
                        } catch (e) {
                            deferred.reject(e);
                            $exceptionHandler(e);
                        }
                        finally {
                            delete deferreds[promise.$$timeoutId];
                        }
                        if (!skipApply) $rootScope.$apply();
                    }, delay);
                    promise.$$timeoutId = timeoutId;
                    deferreds[timeoutId] = deferred;
                    return promise;
                }

                timeout.cancel = function (promise) {
                    if (promise && promise.$$timeoutId in deferreds) {
                        deferreds[promise.$$timeoutId].reject('canceled');
                        delete deferreds[promise.$$timeoutId];
                        return $browser.defer.cancel(promise.$$timeoutId);
                    }
                    return false;
                };
                return timeout;
            }];
    }

    var urlParsingNode = document.createElement("a");
    var originUrl = urlResolve(window.location.href);

    function urlResolve(url) {
        var href = url;
        if (msie) {
            urlParsingNode.setAttribute("href", href);
            href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute('href', href);
        return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/')
                ? urlParsingNode.pathname
                : '/' + urlParsingNode.pathname
        };
    }

    function urlIsSameOrigin(requestUrl) {
        var parsed = (isString(requestUrl)) ? urlResolve(requestUrl) : requestUrl;
        return (parsed.protocol === originUrl.protocol &&
        parsed.host === originUrl.host);
    }

    function $WindowProvider() {
        this.$get = valueFn(window);
    }

    $FilterProvider.$inject = ['$provide'];
    function $FilterProvider($provide) {
        var suffix = 'Filter';

        function register(name, factory) {
            if (isObject(name)) {
                var filters = {};
                forEach(name, function (filter, key) {
                    filters[key] = register(key, filter);
                });
                return filters;
            } else {
                return $provide.factory(name + suffix, factory);
            }
        }

        this.register = register;
        this.$get = ['$injector', function ($injector) {
            return function (name) {
                return $injector.get(name + suffix);
            };
        }];
        register('currency', currencyFilter);
        register('date', dateFilter);
        register('filter', filterFilter);
        register('json', jsonFilter);
        register('limitTo', limitToFilter);
        register('lowercase', lowercaseFilter);
        register('number', numberFilter);
        register('orderBy', orderByFilter);
        register('uppercase', uppercaseFilter);
    }

    function filterFilter() {
        return function (array, expression, comparator) {
            if (!isArray(array)) return array;
            var expressionType = (expression !== null) ? typeof expression : 'null';
            var predicateFn;
            var matchAgainstAnyProp;
            switch (expressionType) {
                case 'function':
                    predicateFn = expression;
                    break;
                case 'boolean':
                case 'null':
                case 'number':
                case 'string':
                    matchAgainstAnyProp = true;
                case 'object':
                    predicateFn = createPredicateFn(expression, comparator, matchAgainstAnyProp);
                    break;
                default:
                    return array;
            }
            return array.filter(predicateFn);
        };
    }

    function createPredicateFn(expression, comparator, matchAgainstAnyProp) {
        var shouldMatchPrimitives = isObject(expression) && ('$' in expression);
        var predicateFn;
        if (comparator === true) {
            comparator = equals;
        } else if (!isFunction(comparator)) {
            comparator = function (actual, expected) {
                if (isUndefined(actual)) {
                    return false;
                }
                if ((actual === null) || (expected === null)) {
                    return actual === expected;
                }
                if (isObject(actual) || isObject(expected)) {
                    return false;
                }
                actual = lowercase('' + actual);
                expected = lowercase('' + expected);
                return actual.indexOf(expected) !== -1;
            };
        }
        predicateFn = function (item) {
            if (shouldMatchPrimitives && !isObject(item)) {
                return deepCompare(item, expression.$, comparator, false);
            }
            return deepCompare(item, expression, comparator, matchAgainstAnyProp);
        };
        return predicateFn;
    }

    function deepCompare(actual, expected, comparator, matchAgainstAnyProp, dontMatchWholeObject) {
        var actualType = (actual !== null) ? typeof actual : 'null';
        var expectedType = (expected !== null) ? typeof expected : 'null';
        if ((expectedType === 'string') && (expected.charAt(0) === '!')) {
            return !deepCompare(actual, expected.substring(1), comparator, matchAgainstAnyProp);
        } else if (isArray(actual)) {
            return actual.some(function (item) {
                return deepCompare(item, expected, comparator, matchAgainstAnyProp);
            });
        }
        switch (actualType) {
            case 'object':
                var key;
                if (matchAgainstAnyProp) {
                    for (key in actual) {
                        if ((key.charAt(0) !== '$') && deepCompare(actual[key], expected, comparator, true)) {
                            return true;
                        }
                    }
                    return dontMatchWholeObject ? false : deepCompare(actual, expected, comparator, false);
                } else if (expectedType === 'object') {
                    for (key in expected) {
                        var expectedVal = expected[key];
                        if (isFunction(expectedVal) || isUndefined(expectedVal)) {
                            continue;
                        }
                        var matchAnyProperty = key === '$';
                        var actualVal = matchAnyProperty ? actual : actual[key];
                        if (!deepCompare(actualVal, expectedVal, comparator, matchAnyProperty, matchAnyProperty)) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return comparator(actual, expected);
                }
                break;
            case 'function':
                return false;
            default:
                return comparator(actual, expected);
        }
    }

    currencyFilter.$inject = ['$locale'];
    function currencyFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function (amount, currencySymbol, fractionSize) {
            if (isUndefined(currencySymbol)) {
                currencySymbol = formats.CURRENCY_SYM;
            }
            if (isUndefined(fractionSize)) {
                fractionSize = formats.PATTERNS[1].maxFrac;
            }
            return (amount == null)
                ? amount
                : formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize).
                replace(/\u00A4/g, currencySymbol);
        };
    }

    numberFilter.$inject = ['$locale'];
    function numberFilter($locale) {
        var formats = $locale.NUMBER_FORMATS;
        return function (number, fractionSize) {
            return (number == null)
                ? number
                : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP,
                fractionSize);
        };
    }

    var DECIMAL_SEP = '.';

    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
        if (!isFinite(number) || isObject(number)) return '';
        var isNegative = number < 0;
        number = Math.abs(number);
        var numStr = number + '',
            formatedText = '',
            parts = [];
        var hasExponent = false;
        if (numStr.indexOf('e') !== -1) {
            var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
            if (match && match[2] == '-' && match[3] > fractionSize + 1) {
                number = 0;
            } else {
                formatedText = numStr;
                hasExponent = true;
            }
        }
        if (!hasExponent) {
            var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;
            if (isUndefined(fractionSize)) {
                fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
            }
            number = +(Math.round(+(number.toString() + 'e' + fractionSize)).toString() + 'e' + -fractionSize);
            var fraction = ('' + number).split(DECIMAL_SEP);
            var whole = fraction[0];
            fraction = fraction[1] || '';
            var i, pos = 0,
                lgroup = pattern.lgSize,
                group = pattern.gSize;
            if (whole.length >= (lgroup + group)) {
                pos = whole.length - lgroup;
                for (i = 0; i < pos; i++) {
                    if ((pos - i) % group === 0 && i !== 0) {
                        formatedText += groupSep;
                    }
                    formatedText += whole.charAt(i);
                }
            }
            for (i = pos; i < whole.length; i++) {
                if ((whole.length - i) % lgroup === 0 && i !== 0) {
                    formatedText += groupSep;
                }
                formatedText += whole.charAt(i);
            }
            while (fraction.length < fractionSize) {
                fraction += '0';
            }
            if (fractionSize && fractionSize !== "0") formatedText += decimalSep + fraction.substr(0, fractionSize);
        } else {
            if (fractionSize > 0 && number < 1) {
                formatedText = number.toFixed(fractionSize);
                number = parseFloat(formatedText);
            }
        }
        if (number === 0) {
            isNegative = false;
        }
        parts.push(isNegative ? pattern.negPre : pattern.posPre,
            formatedText,
            isNegative ? pattern.negSuf : pattern.posSuf);
        return parts.join('');
    }

    function padNumber(num, digits, trim) {
        var neg = '';
        if (num < 0) {
            neg = '-';
            num = -num;
        }
        num = '' + num;
        while (num.length < digits) num = '0' + num;
        if (trim)
            num = num.substr(num.length - digits);
        return neg + num;
    }

    function dateGetter(name, size, offset, trim) {
        offset = offset || 0;
        return function (date) {
            var value = date['get' + name]();
            if (offset > 0 || value > -offset)
                value += offset;
            if (value === 0 && offset == -12) value = 12;
            return padNumber(value, size, trim);
        };
    }

    function dateStrGetter(name, shortForm) {
        return function (date, formats) {
            var value = date['get' + name]();
            var get = uppercase(shortForm ? ('SHORT' + name) : name);
            return formats[get][value];
        };
    }

    function timeZoneGetter(date) {
        var zone = -1 * date.getTimezoneOffset();
        var paddedZone = (zone >= 0) ? "+" : "";
        paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
            padNumber(Math.abs(zone % 60), 2);
        return paddedZone;
    }

    function getFirstThursdayOfYear(year) {
        var dayOfWeekOnFirst = (new Date(year, 0, 1)).getDay();
        return new Date(year, 0, ((dayOfWeekOnFirst <= 4) ? 5 : 12) - dayOfWeekOnFirst);
    }

    function getThursdayThisWeek(datetime) {
        return new Date(datetime.getFullYear(), datetime.getMonth(),
            datetime.getDate() + (4 - datetime.getDay()));
    }

    function weekGetter(size) {
        return function (date) {
            var firstThurs = getFirstThursdayOfYear(date.getFullYear()),
                thisThurs = getThursdayThisWeek(date);
            var diff = +thisThurs - +firstThurs,
                result = 1 + Math.round(diff / 6.048e8);
            return padNumber(result, size);
        };
    }

    function ampmGetter(date, formats) {
        return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
    }

    function eraGetter(date, formats) {
        return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
    }

    function longEraGetter(date, formats) {
        return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
    }

    var DATE_FORMATS = {
        yyyy: dateGetter('FullYear', 4),
        yy: dateGetter('FullYear', 2, 0, true),
        y: dateGetter('FullYear', 1),
        MMMM: dateStrGetter('Month'),
        MMM: dateStrGetter('Month', true),
        MM: dateGetter('Month', 2, 1),
        M: dateGetter('Month', 1, 1),
        dd: dateGetter('Date', 2),
        d: dateGetter('Date', 1),
        HH: dateGetter('Hours', 2),
        H: dateGetter('Hours', 1),
        hh: dateGetter('Hours', 2, -12),
        h: dateGetter('Hours', 1, -12),
        mm: dateGetter('Minutes', 2),
        m: dateGetter('Minutes', 1),
        ss: dateGetter('Seconds', 2),
        s: dateGetter('Seconds', 1),
        sss: dateGetter('Milliseconds', 3),
        EEEE: dateStrGetter('Day'),
        EEE: dateStrGetter('Day', true),
        a: ampmGetter,
        Z: timeZoneGetter,
        ww: weekGetter(2),
        w: weekGetter(1),
        G: eraGetter,
        GG: eraGetter,
        GGG: eraGetter,
        GGGG: longEraGetter
    };
    var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z|G+|w+))(.*)/,
        NUMBER_STRING = /^\-?\d+$/;
    dateFilter.$inject = ['$locale'];
    function dateFilter($locale) {
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;

        function jsonStringToDate(string) {
            var match;
            if (match = string.match(R_ISO8601_STR)) {
                var date = new Date(0),
                    tzHour = 0,
                    tzMin = 0,
                    dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
                    timeSetter = match[8] ? date.setUTCHours : date.setHours;
                if (match[9]) {
                    tzHour = int(match[9] + match[10]);
                    tzMin = int(match[9] + match[11]);
                }
                dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
                var h = int(match[4] || 0) - tzHour;
                var m = int(match[5] || 0) - tzMin;
                var s = int(match[6] || 0);
                var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
                timeSetter.call(date, h, m, s, ms);
                return date;
            }
            return string;
        }

        return function (date, format, timezone) {
            var text = '',
                parts = [],
                fn, match;
            format = format || 'mediumDate';
            format = $locale.DATETIME_FORMATS[format] || format;
            if (isString(date)) {
                date = NUMBER_STRING.test(date) ? int(date) : jsonStringToDate(date);
            }
            if (isNumber(date)) {
                date = new Date(date);
            }
            if (!isDate(date)) {
                return date;
            }
            while (format) {
                match = DATE_FORMATS_SPLIT.exec(format);
                if (match) {
                    parts = concat(parts, match, 1);
                    format = parts.pop();
                } else {
                    parts.push(format);
                    format = null;
                }
            }
            if (timezone && timezone === 'UTC') {
                date = new Date(date.getTime());
                date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            }
            forEach(parts, function (value) {
                fn = DATE_FORMATS[value];
                text += fn ? fn(date, $locale.DATETIME_FORMATS)
                    : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
            });
            return text;
        };
    }

    function jsonFilter() {
        return function (object, spacing) {
            if (isUndefined(spacing)) {
                spacing = 2;
            }
            return toJson(object, spacing);
        };
    }

    var lowercaseFilter = valueFn(lowercase);
    var uppercaseFilter = valueFn(uppercase);

    function limitToFilter() {
        return function (input, limit) {
            if (isNumber(input)) input = input.toString();
            if (!isArray(input) && !isString(input)) return input;
            if (Math.abs(Number(limit)) === Infinity) {
                limit = Number(limit);
            } else {
                limit = int(limit);
            }
            if (limit) {
                return limit > 0 ? input.slice(0, limit) : input.slice(limit);
            } else {
                return isString(input) ? "" : [];
            }
        };
    }

    orderByFilter.$inject = ['$parse'];
    function orderByFilter($parse) {
        return function (array, sortPredicate, reverseOrder) {
            if (!(isArrayLike(array))) return array;
            sortPredicate = isArray(sortPredicate) ? sortPredicate : [sortPredicate];
            if (sortPredicate.length === 0) {
                sortPredicate = ['+'];
            }
            sortPredicate = sortPredicate.map(function (predicate) {
                var descending = false, get = predicate || identity;
                if (isString(predicate)) {
                    if ((predicate.charAt(0) == '+' || predicate.charAt(0) == '-')) {
                        descending = predicate.charAt(0) == '-';
                        predicate = predicate.substring(1);
                    }
                    if (predicate === '') {
                        return reverseComparator(compare, descending);
                    }
                    get = $parse(predicate);
                    if (get.constant) {
                        var key = get();
                        return reverseComparator(function (a, b) {
                            return compare(a[key], b[key]);
                        }, descending);
                    }
                }
                return reverseComparator(function (a, b) {
                    return compare(get(a), get(b));
                }, descending);
            });
            return slice.call(array).sort(reverseComparator(comparator, reverseOrder));
            function comparator(o1, o2) {
                for (var i = 0; i < sortPredicate.length; i++) {
                    var comp = sortPredicate[i](o1, o2);
                    if (comp !== 0) return comp;
                }
                return 0;
            }

            function reverseComparator(comp, descending) {
                return descending
                    ? function (a, b) {
                    return comp(b, a);
                }
                    : comp;
            }

            function isPrimitive(value) {
                switch (typeof value) {
                    case 'number':
                    case 'boolean':
                    case 'string':
                        return true;
                    default:
                        return false;
                }
            }

            function objectToString(value) {
                if (value === null) return 'null';
                if (typeof value.valueOf === 'function') {
                    value = value.valueOf();
                    if (isPrimitive(value)) return value;
                }
                if (typeof value.toString === 'function') {
                    value = value.toString();
                    if (isPrimitive(value)) return value;
                }
                return '';
            }

            function compare(v1, v2) {
                var t1 = typeof v1;
                var t2 = typeof v2;
                if (t1 === t2 && t1 === "object") {
                    v1 = objectToString(v1);
                    v2 = objectToString(v2);
                }
                if (t1 === t2) {
                    if (t1 === "string") {
                        v1 = v1.toLowerCase();
                        v2 = v2.toLowerCase();
                    }
                    if (v1 === v2) return 0;
                    return v1 < v2 ? -1 : 1;
                } else {
                    return t1 < t2 ? -1 : 1;
                }
            }
        };
    }

    function ngDirective(directive) {
        if (isFunction(directive)) {
            directive = {
                link: directive
            };
        }
        directive.restrict = directive.restrict || 'AC';
        return valueFn(directive);
    }

    var htmlAnchorDirective = valueFn({
        restrict: 'E',
        compile: function (element, attr) {
            if (!attr.href && !attr.xlinkHref && !attr.name) {
                return function (scope, element) {
                    if (element[0].nodeName.toLowerCase() !== 'a') return;
                    var href = toString.call(element.prop('href')) === '[object SVGAnimatedString]' ?
                        'xlink:href' : 'href';
                    element.on('click', function (event) {
                        if (!element.attr(href)) {
                            event.preventDefault();
                        }
                    });
                };
            }
        }
    });
    var ngAttributeAliasDirectives = {};
    forEach(BOOLEAN_ATTR, function (propName, attrName) {
        if (propName == "multiple") return;
        var normalized = directiveNormalize('ng-' + attrName);
        ngAttributeAliasDirectives[normalized] = function () {
            return {
                restrict: 'A',
                priority: 100,
                link: function (scope, element, attr) {
                    scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
                        attr.$set(attrName, !!value);
                    });
                }
            };
        };
    });
    forEach(ALIASED_ATTR, function (htmlAttr, ngAttr) {
        ngAttributeAliasDirectives[ngAttr] = function () {
            return {
                priority: 100,
                link: function (scope, element, attr) {
                    if (ngAttr === "ngPattern" && attr.ngPattern.charAt(0) == "/") {
                        var match = attr.ngPattern.match(REGEX_STRING_REGEXP);
                        if (match) {
                            attr.$set("ngPattern", new RegExp(match[1], match[2]));
                            return;
                        }
                    }
                    scope.$watch(attr[ngAttr], function ngAttrAliasWatchAction(value) {
                        attr.$set(ngAttr, value);
                    });
                }
            };
        };
    });
    forEach(['src', 'srcset', 'href'], function (attrName) {
        var normalized = directiveNormalize('ng-' + attrName);
        ngAttributeAliasDirectives[normalized] = function () {
            return {
                priority: 99,
                link: function (scope, element, attr) {
                    var propName = attrName,
                        name = attrName;
                    if (attrName === 'href' &&
                        toString.call(element.prop('href')) === '[object SVGAnimatedString]') {
                        name = 'xlinkHref';
                        attr.$attr[name] = 'xlink:href';
                        propName = null;
                    }
                    attr.$observe(normalized, function (value) {
                        if (!value) {
                            if (attrName === 'href') {
                                attr.$set(name, null);
                            }
                            return;
                        }
                        attr.$set(name, value);
                        if (msie && propName) element.prop(propName, attr[name]);
                    });
                }
            };
        };
    });
    var nullFormCtrl = {
            $addControl: noop,
            $$renameControl: nullFormRenameControl,
            $removeControl: noop,
            $setValidity: noop,
            $setDirty: noop,
            $setPristine: noop,
            $setSubmitted: noop
        },
        SUBMITTED_CLASS = 'ng-submitted';

    function nullFormRenameControl(control, name) {
        control.$name = name;
    }

    FormController.$inject = ['$element', '$attrs', '$scope', '$animate', '$interpolate'];
    function FormController(element, attrs, $scope, $animate, $interpolate) {
        var form = this,
            controls = [];
        var parentForm = form.$$parentForm = element.parent().controller('form') || nullFormCtrl;
        form.$error = {};
        form.$$success = {};
        form.$pending = undefined;
        form.$name = $interpolate(attrs.name || attrs.ngForm || '')($scope);
        form.$dirty = false;
        form.$pristine = true;
        form.$valid = true;
        form.$invalid = false;
        form.$submitted = false;
        parentForm.$addControl(form);
        form.$rollbackViewValue = function () {
            forEach(controls, function (control) {
                control.$rollbackViewValue();
            });
        };
        form.$commitViewValue = function () {
            forEach(controls, function (control) {
                control.$commitViewValue();
            });
        };
        form.$addControl = function (control) {
            assertNotHasOwnProperty(control.$name, 'input');
            controls.push(control);
            if (control.$name) {
                form[control.$name] = control;
            }
        };
        form.$$renameControl = function (control, newName) {
            var oldName = control.$name;
            if (form[oldName] === control) {
                delete form[oldName];
            }
            form[newName] = control;
            control.$name = newName;
        };
        form.$removeControl = function (control) {
            if (control.$name && form[control.$name] === control) {
                delete form[control.$name];
            }
            forEach(form.$pending, function (value, name) {
                form.$setValidity(name, null, control);
            });
            forEach(form.$error, function (value, name) {
                form.$setValidity(name, null, control);
            });
            forEach(form.$$success, function (value, name) {
                form.$setValidity(name, null, control);
            });
            arrayRemove(controls, control);
        };
        addSetValidityMethod({
            ctrl: this,
            $element: element,
            set: function (object, property, controller) {
                var list = object[property];
                if (!list) {
                    object[property] = [controller];
                } else {
                    var index = list.indexOf(controller);
                    if (index === -1) {
                        list.push(controller);
                    }
                }
            },
            unset: function (object, property, controller) {
                var list = object[property];
                if (!list) {
                    return;
                }
                arrayRemove(list, controller);
                if (list.length === 0) {
                    delete object[property];
                }
            },
            parentForm: parentForm,
            $animate: $animate
        });
        form.$setDirty = function () {
            $animate.removeClass(element, PRISTINE_CLASS);
            $animate.addClass(element, DIRTY_CLASS);
            form.$dirty = true;
            form.$pristine = false;
            parentForm.$setDirty();
        };
        form.$setPristine = function () {
            $animate.setClass(element, PRISTINE_CLASS, DIRTY_CLASS + ' ' + SUBMITTED_CLASS);
            form.$dirty = false;
            form.$pristine = true;
            form.$submitted = false;
            forEach(controls, function (control) {
                control.$setPristine();
            });
        };
        form.$setUntouched = function () {
            forEach(controls, function (control) {
                control.$setUntouched();
            });
        };
        form.$setSubmitted = function () {
            $animate.addClass(element, SUBMITTED_CLASS);
            form.$submitted = true;
            parentForm.$setSubmitted();
        };
    }

    var formDirectiveFactory = function (isNgForm) {
        return ['$timeout', function ($timeout) {
            var formDirective = {
                name: 'form',
                restrict: isNgForm ? 'EAC' : 'E',
                controller: FormController,
                compile: function ngFormCompile(formElement, attr) {
                    formElement.addClass(PRISTINE_CLASS).addClass(VALID_CLASS);
                    var nameAttr = attr.name ? 'name' : (isNgForm && attr.ngForm ? 'ngForm' : false);
                    return {
                        pre: function ngFormPreLink(scope, formElement, attr, controller) {
                            if (!('action' in attr)) {
                                var handleFormSubmission = function (event) {
                                    scope.$apply(function () {
                                        controller.$commitViewValue();
                                        controller.$setSubmitted();
                                    });
                                    event.preventDefault();
                                };
                                addEventListenerFn(formElement[0], 'submit', handleFormSubmission);
                                formElement.on('$destroy', function () {
                                    $timeout(function () {
                                        removeEventListenerFn(formElement[0], 'submit', handleFormSubmission);
                                    }, 0, false);
                                });
                            }
                            var parentFormCtrl = controller.$$parentForm;
                            if (nameAttr) {
                                setter(scope, null, controller.$name, controller, controller.$name);
                                attr.$observe(nameAttr, function (newValue) {
                                    if (controller.$name === newValue) return;
                                    setter(scope, null, controller.$name, undefined, controller.$name);
                                    parentFormCtrl.$$renameControl(controller, newValue);
                                    setter(scope, null, controller.$name, controller, controller.$name);
                                });
                            }
                            formElement.on('$destroy', function () {
                                parentFormCtrl.$removeControl(controller);
                                if (nameAttr) {
                                    setter(scope, null, attr[nameAttr], undefined, controller.$name);
                                }
                                extend(controller, nullFormCtrl);
                            });
                        }
                    };
                }
            };
            return formDirective;
        }];
    };
    var formDirective = formDirectiveFactory();
    var ngFormDirective = formDirectiveFactory(true);
    var ISO_DATE_REGEXP = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
    var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
    var DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})$/;
    var DATETIMELOCAL_REGEXP = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
    var WEEK_REGEXP = /^(\d{4})-W(\d\d)$/;
    var MONTH_REGEXP = /^(\d{4})-(\d\d)$/;
    var TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
    var inputType = {
        'text': textInputType,
        'date': createDateInputType('date', DATE_REGEXP,
            createDateParser(DATE_REGEXP, ['yyyy', 'MM', 'dd']),
            'yyyy-MM-dd'),
        'datetime-local': createDateInputType('datetimelocal', DATETIMELOCAL_REGEXP,
            createDateParser(DATETIMELOCAL_REGEXP, ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss', 'sss']),
            'yyyy-MM-ddTHH:mm:ss.sss'),
        'time': createDateInputType('time', TIME_REGEXP,
            createDateParser(TIME_REGEXP, ['HH', 'mm', 'ss', 'sss']),
            'HH:mm:ss.sss'),
        'week': createDateInputType('week', WEEK_REGEXP, weekParser, 'yyyy-Www'),
        'month': createDateInputType('month', MONTH_REGEXP,
            createDateParser(MONTH_REGEXP, ['yyyy', 'MM']),
            'yyyy-MM'),
        'number': numberInputType,
        'url': urlInputType,
        'email': emailInputType,
        'radio': radioInputType,
        'checkbox': checkboxInputType,
        'hidden': noop,
        'button': noop,
        'submit': noop,
        'reset': noop,
        'file': noop
    };

    function stringBasedInputType(ctrl) {
        ctrl.$formatters.push(function (value) {
            return ctrl.$isEmpty(value) ? value : value.toString();
        });
    }

    function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
        stringBasedInputType(ctrl);
    }

    function baseInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        var type = lowercase(element[0].type);
        if (!$sniffer.android) {
            var composing = false;
            element.on('compositionstart', function (data) {
                composing = true;
            });
            element.on('compositionend', function () {
                composing = false;
                listener();
            });
        }
        var listener = function (ev) {
            if (timeout) {
                $browser.defer.cancel(timeout);
                timeout = null;
            }
            if (composing) return;
            var value = element.val(),
                event = ev && ev.type;
            if (type !== 'password' && (!attr.ngTrim || attr.ngTrim !== 'false')) {
                value = trim(value);
            }
            if (ctrl.$viewValue !== value || (value === '' && ctrl.$$hasNativeValidators)) {
                ctrl.$setViewValue(value, event);
            }
        };
        if ($sniffer.hasEvent('input')) {
            element.on('input', listener);
        } else {
            var timeout;
            var deferListener = function (ev, input, origValue) {
                if (!timeout) {
                    timeout = $browser.defer(function () {
                        timeout = null;
                        if (!input || input.value !== origValue) {
                            listener(ev);
                        }
                    });
                }
            };
            element.on('keydown', function (event) {
                var key = event.keyCode;
                if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;
                deferListener(event, this, this.value);
            });
            if ($sniffer.hasEvent('paste')) {
                element.on('paste cut', deferListener);
            }
        }
        element.on('change', listener);
        ctrl.$render = function () {
            element.val(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
        };
    }

    function weekParser(isoWeek, existingDate) {
        if (isDate(isoWeek)) {
            return isoWeek;
        }
        if (isString(isoWeek)) {
            WEEK_REGEXP.lastIndex = 0;
            var parts = WEEK_REGEXP.exec(isoWeek);
            if (parts) {
                var year = +parts[1],
                    week = +parts[2],
                    hours = 0,
                    minutes = 0,
                    seconds = 0,
                    milliseconds = 0,
                    firstThurs = getFirstThursdayOfYear(year),
                    addDays = (week - 1) * 7;
                if (existingDate) {
                    hours = existingDate.getHours();
                    minutes = existingDate.getMinutes();
                    seconds = existingDate.getSeconds();
                    milliseconds = existingDate.getMilliseconds();
                }
                return new Date(year, 0, firstThurs.getDate() + addDays, hours, minutes, seconds, milliseconds);
            }
        }
        return NaN;
    }

    function createDateParser(regexp, mapping) {
        return function (iso, date) {
            var parts, map;
            if (isDate(iso)) {
                return iso;
            }
            if (isString(iso)) {
                if (iso.charAt(0) == '"' && iso.charAt(iso.length - 1) == '"') {
                    iso = iso.substring(1, iso.length - 1);
                }
                if (ISO_DATE_REGEXP.test(iso)) {
                    return new Date(iso);
                }
                regexp.lastIndex = 0;
                parts = regexp.exec(iso);
                if (parts) {
                    parts.shift();
                    if (date) {
                        map = {
                            yyyy: date.getFullYear(),
                            MM: date.getMonth() + 1,
                            dd: date.getDate(),
                            HH: date.getHours(),
                            mm: date.getMinutes(),
                            ss: date.getSeconds(),
                            sss: date.getMilliseconds() / 1000
                        };
                    } else {
                        map = {yyyy: 1970, MM: 1, dd: 1, HH: 0, mm: 0, ss: 0, sss: 0};
                    }
                    forEach(parts, function (part, index) {
                        if (index < mapping.length) {
                            map[mapping[index]] = +part;
                        }
                    });
                    return new Date(map.yyyy, map.MM - 1, map.dd, map.HH, map.mm, map.ss || 0, map.sss * 1000 || 0);
                }
            }
            return NaN;
        };
    }

    function createDateInputType(type, regexp, parseDate, format) {
        return function dynamicDateInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter) {
            badInputChecker(scope, element, attr, ctrl);
            baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
            var timezone = ctrl && ctrl.$options && ctrl.$options.timezone;
            var previousDate;
            ctrl.$$parserName = type;
            ctrl.$parsers.push(function (value) {
                if (ctrl.$isEmpty(value)) return null;
                if (regexp.test(value)) {
                    var parsedDate = parseDate(value, previousDate);
                    if (timezone === 'UTC') {
                        parsedDate.setMinutes(parsedDate.getMinutes() - parsedDate.getTimezoneOffset());
                    }
                    return parsedDate;
                }
                return undefined;
            });
            ctrl.$formatters.push(function (value) {
                if (value && !isDate(value)) {
                    throw ngModelMinErr('datefmt', 'Expected `{0}` to be a date', value);
                }
                if (isValidDate(value)) {
                    previousDate = value;
                    if (previousDate && timezone === 'UTC') {
                        var timezoneOffset = 60000 * previousDate.getTimezoneOffset();
                        previousDate = new Date(previousDate.getTime() + timezoneOffset);
                    }
                    return $filter('date')(value, format, timezone);
                } else {
                    previousDate = null;
                    return '';
                }
            });
            if (isDefined(attr.min) || attr.ngMin) {
                var minVal;
                ctrl.$validators.min = function (value) {
                    return !isValidDate(value) || isUndefined(minVal) || parseDate(value) >= minVal;
                };
                attr.$observe('min', function (val) {
                    minVal = parseObservedDateValue(val);
                    ctrl.$validate();
                });
            }
            if (isDefined(attr.max) || attr.ngMax) {
                var maxVal;
                ctrl.$validators.max = function (value) {
                    return !isValidDate(value) || isUndefined(maxVal) || parseDate(value) <= maxVal;
                };
                attr.$observe('max', function (val) {
                    maxVal = parseObservedDateValue(val);
                    ctrl.$validate();
                });
            }
            function isValidDate(value) {
                return value && !(value.getTime && value.getTime() !== value.getTime());
            }

            function parseObservedDateValue(val) {
                return isDefined(val) ? (isDate(val) ? val : parseDate(val)) : undefined;
            }
        };
    }

    function badInputChecker(scope, element, attr, ctrl) {
        var node = element[0];
        var nativeValidation = ctrl.$$hasNativeValidators = isObject(node.validity);
        if (nativeValidation) {
            ctrl.$parsers.push(function (value) {
                var validity = element.prop(VALIDITY_STATE_PROPERTY) || {};
                return validity.badInput && !validity.typeMismatch ? undefined : value;
            });
        }
    }

    function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        badInputChecker(scope, element, attr, ctrl);
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
        ctrl.$$parserName = 'number';
        ctrl.$parsers.push(function (value) {
            if (ctrl.$isEmpty(value))      return null;
            if (NUMBER_REGEXP.test(value)) return parseFloat(value);
            return undefined;
        });
        ctrl.$formatters.push(function (value) {
            if (!ctrl.$isEmpty(value)) {
                if (!isNumber(value)) {
                    throw ngModelMinErr('numfmt', 'Expected `{0}` to be a number', value);
                }
                value = value.toString();
            }
            return value;
        });
        if (isDefined(attr.min) || attr.ngMin) {
            var minVal;
            ctrl.$validators.min = function (value) {
                return ctrl.$isEmpty(value) || isUndefined(minVal) || value >= minVal;
            };
            attr.$observe('min', function (val) {
                if (isDefined(val) && !isNumber(val)) {
                    val = parseFloat(val, 10);
                }
                minVal = isNumber(val) && !isNaN(val) ? val : undefined;
                ctrl.$validate();
            });
        }
        if (isDefined(attr.max) || attr.ngMax) {
            var maxVal;
            ctrl.$validators.max = function (value) {
                return ctrl.$isEmpty(value) || isUndefined(maxVal) || value <= maxVal;
            };
            attr.$observe('max', function (val) {
                if (isDefined(val) && !isNumber(val)) {
                    val = parseFloat(val, 10);
                }
                maxVal = isNumber(val) && !isNaN(val) ? val : undefined;
                ctrl.$validate();
            });
        }
    }

    function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
        stringBasedInputType(ctrl);
        ctrl.$$parserName = 'url';
        ctrl.$validators.url = function (modelValue, viewValue) {
            var value = modelValue || viewValue;
            return ctrl.$isEmpty(value) || URL_REGEXP.test(value);
        };
    }

    function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
        baseInputType(scope, element, attr, ctrl, $sniffer, $browser);
        stringBasedInputType(ctrl);
        ctrl.$$parserName = 'email';
        ctrl.$validators.email = function (modelValue, viewValue) {
            var value = modelValue || viewValue;
            return ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value);
        };
    }

    function radioInputType(scope, element, attr, ctrl) {
        if (isUndefined(attr.name)) {
            element.attr('name', nextUid());
        }
        var listener = function (ev) {
            if (element[0].checked) {
                ctrl.$setViewValue(attr.value, ev && ev.type);
            }
        };
        element.on('click', listener);
        ctrl.$render = function () {
            var value = attr.value;
            element[0].checked = (value == ctrl.$viewValue);
        };
        attr.$observe('value', ctrl.$render);
    }

    function parseConstantExpr($parse, context, name, expression, fallback) {
        var parseFn;
        if (isDefined(expression)) {
            parseFn = $parse(expression);
            if (!parseFn.constant) {
                throw ngModelMinErr('constexpr', 'Expected constant expression for `{0}`, but saw ' +
                    '`{1}`.', name, expression);
            }
            return parseFn(context);
        }
        return fallback;
    }

    function checkboxInputType(scope, element, attr, ctrl, $sniffer, $browser, $filter, $parse) {
        var trueValue = parseConstantExpr($parse, scope, 'ngTrueValue', attr.ngTrueValue, true);
        var falseValue = parseConstantExpr($parse, scope, 'ngFalseValue', attr.ngFalseValue, false);
        var listener = function (ev) {
            ctrl.$setViewValue(element[0].checked, ev && ev.type);
        };
        element.on('click', listener);
        ctrl.$render = function () {
            element[0].checked = ctrl.$viewValue;
        };
        ctrl.$isEmpty = function (value) {
            return value === false;
        };
        ctrl.$formatters.push(function (value) {
            return equals(value, trueValue);
        });
        ctrl.$parsers.push(function (value) {
            return value ? trueValue : falseValue;
        });
    }

    var inputDirective = ['$browser', '$sniffer', '$filter', '$parse',
        function ($browser, $sniffer, $filter, $parse) {
            return {
                restrict: 'E',
                require: ['?ngModel'],
                link: {
                    pre: function (scope, element, attr, ctrls) {
                        if (ctrls[0]) {
                            (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrls[0], $sniffer,
                                $browser, $filter, $parse);
                        }
                    }
                }
            };
        }];
    var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
    var ngValueDirective = function () {
        return {
            restrict: 'A',
            priority: 100,
            compile: function (tpl, tplAttr) {
                if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
                    return function ngValueConstantLink(scope, elm, attr) {
                        attr.$set('value', scope.$eval(attr.ngValue));
                    };
                } else {
                    return function ngValueLink(scope, elm, attr) {
                        scope.$watch(attr.ngValue, function valueWatchAction(value) {
                            attr.$set('value', value);
                        });
                    };
                }
            }
        };
    };
    var ngBindDirective = ['$compile', function ($compile) {
        return {
            restrict: 'AC',
            compile: function ngBindCompile(templateElement) {
                $compile.$$addBindingClass(templateElement);
                return function ngBindLink(scope, element, attr) {
                    $compile.$$addBindingInfo(element, attr.ngBind);
                    element = element[0];
                    scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
                        element.textContent = value === undefined ? '' : value;
                    });
                };
            }
        };
    }];
    var ngBindTemplateDirective = ['$interpolate', '$compile', function ($interpolate, $compile) {
        return {
            compile: function ngBindTemplateCompile(templateElement) {
                $compile.$$addBindingClass(templateElement);
                return function ngBindTemplateLink(scope, element, attr) {
                    var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
                    $compile.$$addBindingInfo(element, interpolateFn.expressions);
                    element = element[0];
                    attr.$observe('ngBindTemplate', function (value) {
                        element.textContent = value === undefined ? '' : value;
                    });
                };
            }
        };
    }];
    var ngBindHtmlDirective = ['$sce', '$parse', '$compile', function ($sce, $parse, $compile) {
        return {
            restrict: 'A',
            compile: function ngBindHtmlCompile(tElement, tAttrs) {
                var ngBindHtmlGetter = $parse(tAttrs.ngBindHtml);
                var ngBindHtmlWatch = $parse(tAttrs.ngBindHtml, function getStringValue(value) {
                    return (value || '').toString();
                });
                $compile.$$addBindingClass(tElement);
                return function ngBindHtmlLink(scope, element, attr) {
                    $compile.$$addBindingInfo(element, attr.ngBindHtml);
                    scope.$watch(ngBindHtmlWatch, function ngBindHtmlWatchAction() {
                        element.html($sce.getTrustedHtml(ngBindHtmlGetter(scope)) || '');
                    });
                };
            }
        };
    }];
    var ngChangeDirective = valueFn({
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            ctrl.$viewChangeListeners.push(function () {
                scope.$eval(attr.ngChange);
            });
        }
    });

    function classDirective(name, selector) {
        name = 'ngClass' + name;
        return ['$animate', function ($animate) {
            return {
                restrict: 'AC',
                link: function (scope, element, attr) {
                    var oldVal;
                    scope.$watch(attr[name], ngClassWatchAction, true);
                    attr.$observe('class', function (value) {
                        ngClassWatchAction(scope.$eval(attr[name]));
                    });
                    if (name !== 'ngClass') {
                        scope.$watch('$index', function ($index, old$index) {
                            var mod = $index & 1;
                            if (mod !== (old$index & 1)) {
                                var classes = arrayClasses(scope.$eval(attr[name]));
                                mod === selector ?
                                    addClasses(classes) :
                                    removeClasses(classes);
                            }
                        });
                    }
                    function addClasses(classes) {
                        var newClasses = digestClassCounts(classes, 1);
                        attr.$addClass(newClasses);
                    }

                    function removeClasses(classes) {
                        var newClasses = digestClassCounts(classes, -1);
                        attr.$removeClass(newClasses);
                    }

                    function digestClassCounts(classes, count) {
                        var classCounts = element.data('$classCounts') || {};
                        var classesToUpdate = [];
                        forEach(classes, function (className) {
                            if (count > 0 || classCounts[className]) {
                                classCounts[className] = (classCounts[className] || 0) + count;
                                if (classCounts[className] === +(count > 0)) {
                                    classesToUpdate.push(className);
                                }
                            }
                        });
                        element.data('$classCounts', classCounts);
                        return classesToUpdate.join(' ');
                    }

                    function updateClasses(oldClasses, newClasses) {
                        var toAdd = arrayDifference(newClasses, oldClasses);
                        var toRemove = arrayDifference(oldClasses, newClasses);
                        toAdd = digestClassCounts(toAdd, 1);
                        toRemove = digestClassCounts(toRemove, -1);
                        if (toAdd && toAdd.length) {
                            $animate.addClass(element, toAdd);
                        }
                        if (toRemove && toRemove.length) {
                            $animate.removeClass(element, toRemove);
                        }
                    }

                    function ngClassWatchAction(newVal) {
                        if (selector === true || scope.$index % 2 === selector) {
                            var newClasses = arrayClasses(newVal || []);
                            if (!oldVal) {
                                addClasses(newClasses);
                            } else if (!equals(newVal, oldVal)) {
                                var oldClasses = arrayClasses(oldVal);
                                updateClasses(oldClasses, newClasses);
                            }
                        }
                        oldVal = shallowCopy(newVal);
                    }
                }
            };
            function arrayDifference(tokens1, tokens2) {
                var values = [];
                outer:
                    for (var i = 0; i < tokens1.length; i++) {
                        var token = tokens1[i];
                        for (var j = 0; j < tokens2.length; j++) {
                            if (token == tokens2[j]) continue outer;
                        }
                        values.push(token);
                    }
                return values;
            }

            function arrayClasses(classVal) {
                if (isArray(classVal)) {
                    return classVal;
                } else if (isString(classVal)) {
                    return classVal.split(' ');
                } else if (isObject(classVal)) {
                    var classes = [];
                    forEach(classVal, function (v, k) {
                        if (v) {
                            classes = classes.concat(k.split(' '));
                        }
                    });
                    return classes;
                }
                return classVal;
            }
        }];
    }

    var ngClassDirective = classDirective('', true);
    var ngClassOddDirective = classDirective('Odd', 0);
    var ngClassEvenDirective = classDirective('Even', 1);
    var ngCloakDirective = ngDirective({
        compile: function (element, attr) {
            attr.$set('ngCloak', undefined);
            element.removeClass('ng-cloak');
        }
    });
    var ngControllerDirective = [function () {
        return {
            restrict: 'A',
            scope: true,
            controller: '@',
            priority: 500
        };
    }];
    var ngEventDirectives = {};
    var forceAsyncEvents = {
        'blur': true,
        'focus': true
    };
    forEach(
        'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
        function (eventName) {
            var directiveName = directiveNormalize('ng-' + eventName);
            ngEventDirectives[directiveName] = ['$parse', '$rootScope', function ($parse, $rootScope) {
                return {
                    restrict: 'A',
                    compile: function ($element, attr) {
                        var fn = $parse(attr[directiveName], null, true);
                        return function ngEventHandler(scope, element) {
                            element.on(eventName, function (event) {
                                var callback = function () {
                                    fn(scope, {$event: event});
                                };
                                if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                                    scope.$evalAsync(callback);
                                } else {
                                    scope.$apply(callback);
                                }
                            });
                        };
                    }
                };
            }];
        }
    );
    var ngIfDirective = ['$animate', function ($animate) {
        return {
            multiElement: true,
            transclude: 'element',
            priority: 600,
            terminal: true,
            restrict: 'A',
            $$tlb: true,
            link: function ($scope, $element, $attr, ctrl, $transclude) {
                var block, childScope, previousElements;
                $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {
                    if (value) {
                        if (!childScope) {
                            $transclude(function (clone, newScope) {
                                childScope = newScope;
                                clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ');
                                block = {
                                    clone: clone
                                };
                                $animate.enter(clone, $element.parent(), $element);
                            });
                        }
                    } else {
                        if (previousElements) {
                            previousElements.remove();
                            previousElements = null;
                        }
                        if (childScope) {
                            childScope.$destroy();
                            childScope = null;
                        }
                        if (block) {
                            previousElements = getBlockNodes(block.clone);
                            $animate.leave(previousElements).then(function () {
                                previousElements = null;
                            });
                            block = null;
                        }
                    }
                });
            }
        };
    }];
    var ngIncludeDirective = ['$templateRequest', '$anchorScroll', '$animate',
        function ($templateRequest, $anchorScroll, $animate) {
            return {
                restrict: 'ECA',
                priority: 400,
                terminal: true,
                transclude: 'element',
                controller: angular.noop,
                compile: function (element, attr) {
                    var srcExp = attr.ngInclude || attr.src,
                        onloadExp = attr.onload || '',
                        autoScrollExp = attr.autoscroll;
                    return function (scope, $element, $attr, ctrl, $transclude) {
                        var changeCounter = 0,
                            currentScope,
                            previousElement,
                            currentElement;
                        var cleanupLastIncludeContent = function () {
                            if (previousElement) {
                                previousElement.remove();
                                previousElement = null;
                            }
                            if (currentScope) {
                                currentScope.$destroy();
                                currentScope = null;
                            }
                            if (currentElement) {
                                $animate.leave(currentElement).then(function () {
                                    previousElement = null;
                                });
                                previousElement = currentElement;
                                currentElement = null;
                            }
                        };
                        scope.$watch(srcExp, function ngIncludeWatchAction(src) {
                            var afterAnimation = function () {
                                if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                                    $anchorScroll();
                                }
                            };
                            var thisChangeId = ++changeCounter;
                            if (src) {
                                $templateRequest(src, true).then(function (response) {
                                    if (thisChangeId !== changeCounter) return;
                                    var newScope = scope.$new();
                                    ctrl.template = response;
                                    var clone = $transclude(newScope, function (clone) {
                                        cleanupLastIncludeContent();
                                        $animate.enter(clone, null, $element).then(afterAnimation);
                                    });
                                    currentScope = newScope;
                                    currentElement = clone;
                                    currentScope.$emit('$includeContentLoaded', src);
                                    scope.$eval(onloadExp);
                                }, function () {
                                    if (thisChangeId === changeCounter) {
                                        cleanupLastIncludeContent();
                                        scope.$emit('$includeContentError', src);
                                    }
                                });
                                scope.$emit('$includeContentRequested', src);
                            } else {
                                cleanupLastIncludeContent();
                                ctrl.template = null;
                            }
                        });
                    };
                }
            };
        }];
    var ngIncludeFillContentDirective = ['$compile',
        function ($compile) {
            return {
                restrict: 'ECA',
                priority: -400,
                require: 'ngInclude',
                link: function (scope, $element, $attr, ctrl) {
                    if (/SVG/.test($element[0].toString())) {
                        $element.empty();
                        $compile(jqLiteBuildFragment(ctrl.template, document).childNodes)(scope,
                            function namespaceAdaptedClone(clone) {
                                $element.append(clone);
                            }, {futureParentElement: $element});
                        return;
                    }
                    $element.html(ctrl.template);
                    $compile($element.contents())(scope);
                }
            };
        }];
    var ngInitDirective = ngDirective({
        priority: 450,
        compile: function () {
            return {
                pre: function (scope, element, attrs) {
                    scope.$eval(attrs.ngInit);
                }
            };
        }
    });
    var ngListDirective = function () {
        return {
            restrict: 'A',
            priority: 100,
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                var ngList = element.attr(attr.$attr.ngList) || ', ';
                var trimValues = attr.ngTrim !== 'false';
                var separator = trimValues ? trim(ngList) : ngList;
                var parse = function (viewValue) {
                    if (isUndefined(viewValue)) return;
                    var list = [];
                    if (viewValue) {
                        forEach(viewValue.split(separator), function (value) {
                            if (value) list.push(trimValues ? trim(value) : value);
                        });
                    }
                    return list;
                };
                ctrl.$parsers.push(parse);
                ctrl.$formatters.push(function (value) {
                    if (isArray(value)) {
                        return value.join(ngList);
                    }
                    return undefined;
                });
                ctrl.$isEmpty = function (value) {
                    return !value || !value.length;
                };
            }
        };
    };
    var VALID_CLASS = 'ng-valid',
        INVALID_CLASS = 'ng-invalid',
        PRISTINE_CLASS = 'ng-pristine',
        DIRTY_CLASS = 'ng-dirty',
        UNTOUCHED_CLASS = 'ng-untouched',
        TOUCHED_CLASS = 'ng-touched',
        PENDING_CLASS = 'ng-pending';
    var ngModelMinErr = minErr('ngModel');
    var NgModelController = ['$scope', '$exceptionHandler', '$attrs', '$element', '$parse', '$animate', '$timeout', '$rootScope', '$q', '$interpolate',
        function ($scope, $exceptionHandler, $attr, $element, $parse, $animate, $timeout, $rootScope, $q, $interpolate) {
            this.$viewValue = Number.NaN;
            this.$modelValue = Number.NaN;
            this.$$rawModelValue = undefined;
            this.$validators = {};
            this.$asyncValidators = {};
            this.$parsers = [];
            this.$formatters = [];
            this.$viewChangeListeners = [];
            this.$untouched = true;
            this.$touched = false;
            this.$pristine = true;
            this.$dirty = false;
            this.$valid = true;
            this.$invalid = false;
            this.$error = {};
            this.$$success = {};
            this.$pending = undefined;
            this.$name = $interpolate($attr.name || '', false)($scope);
            var parsedNgModel = $parse($attr.ngModel),
                parsedNgModelAssign = parsedNgModel.assign,
                ngModelGet = parsedNgModel,
                ngModelSet = parsedNgModelAssign,
                pendingDebounce = null,
                parserValid,
                ctrl = this;
            this.$$setOptions = function (options) {
                ctrl.$options = options;
                if (options && options.getterSetter) {
                    var invokeModelGetter = $parse($attr.ngModel + '()'),
                        invokeModelSetter = $parse($attr.ngModel + '($$$p)');
                    ngModelGet = function ($scope) {
                        var modelValue = parsedNgModel($scope);
                        if (isFunction(modelValue)) {
                            modelValue = invokeModelGetter($scope);
                        }
                        return modelValue;
                    };
                    ngModelSet = function ($scope, newValue) {
                        if (isFunction(parsedNgModel($scope))) {
                            invokeModelSetter($scope, {$$$p: ctrl.$modelValue});
                        } else {
                            parsedNgModelAssign($scope, ctrl.$modelValue);
                        }
                    };
                } else if (!parsedNgModel.assign) {
                    throw ngModelMinErr('nonassign', "Expression '{0}' is non-assignable. Element: {1}",
                        $attr.ngModel, startingTag($element));
                }
            };
            this.$render = noop;
            this.$isEmpty = function (value) {
                return isUndefined(value) || value === '' || value === null || value !== value;
            };
            var parentForm = $element.inheritedData('$formController') || nullFormCtrl,
                currentValidationRunId = 0;
            addSetValidityMethod({
                ctrl: this,
                $element: $element,
                set: function (object, property) {
                    object[property] = true;
                },
                unset: function (object, property) {
                    delete object[property];
                },
                parentForm: parentForm,
                $animate: $animate
            });
            this.$setPristine = function () {
                ctrl.$dirty = false;
                ctrl.$pristine = true;
                $animate.removeClass($element, DIRTY_CLASS);
                $animate.addClass($element, PRISTINE_CLASS);
            };
            this.$setDirty = function () {
                ctrl.$dirty = true;
                ctrl.$pristine = false;
                $animate.removeClass($element, PRISTINE_CLASS);
                $animate.addClass($element, DIRTY_CLASS);
                parentForm.$setDirty();
            };
            this.$setUntouched = function () {
                ctrl.$touched = false;
                ctrl.$untouched = true;
                $animate.setClass($element, UNTOUCHED_CLASS, TOUCHED_CLASS);
            };
            this.$setTouched = function () {
                ctrl.$touched = true;
                ctrl.$untouched = false;
                $animate.setClass($element, TOUCHED_CLASS, UNTOUCHED_CLASS);
            };
            this.$rollbackViewValue = function () {
                $timeout.cancel(pendingDebounce);
                ctrl.$viewValue = ctrl.$$lastCommittedViewValue;
                ctrl.$render();
            };
            this.$validate = function () {
                if (isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue)) {
                    return;
                }
                var viewValue = ctrl.$$lastCommittedViewValue;
                var modelValue = ctrl.$$rawModelValue;
                var prevValid = ctrl.$valid;
                var prevModelValue = ctrl.$modelValue;
                var allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
                ctrl.$$runValidators(modelValue, viewValue, function (allValid) {
                    if (!allowInvalid && prevValid !== allValid) {
                        ctrl.$modelValue = allValid ? modelValue : undefined;
                        if (ctrl.$modelValue !== prevModelValue) {
                            ctrl.$$writeModelToScope();
                        }
                    }
                });
            };
            this.$$runValidators = function (modelValue, viewValue, doneCallback) {
                currentValidationRunId++;
                var localValidationRunId = currentValidationRunId;
                if (!processParseErrors()) {
                    validationDone(false);
                    return;
                }
                if (!processSyncValidators()) {
                    validationDone(false);
                    return;
                }
                processAsyncValidators();
                function processParseErrors() {
                    var errorKey = ctrl.$$parserName || 'parse';
                    if (parserValid === undefined) {
                        setValidity(errorKey, null);
                    } else {
                        if (!parserValid) {
                            forEach(ctrl.$validators, function (v, name) {
                                setValidity(name, null);
                            });
                            forEach(ctrl.$asyncValidators, function (v, name) {
                                setValidity(name, null);
                            });
                        }
                        setValidity(errorKey, parserValid);
                        return parserValid;
                    }
                    return true;
                }

                function processSyncValidators() {
                    var syncValidatorsValid = true;
                    forEach(ctrl.$validators, function (validator, name) {
                        var result = validator(modelValue, viewValue);
                        syncValidatorsValid = syncValidatorsValid && result;
                        setValidity(name, result);
                    });
                    if (!syncValidatorsValid) {
                        forEach(ctrl.$asyncValidators, function (v, name) {
                            setValidity(name, null);
                        });
                        return false;
                    }
                    return true;
                }

                function processAsyncValidators() {
                    var validatorPromises = [];
                    var allValid = true;
                    forEach(ctrl.$asyncValidators, function (validator, name) {
                        var promise = validator(modelValue, viewValue);
                        if (!isPromiseLike(promise)) {
                            throw ngModelMinErr("$asyncValidators",
                                "Expected asynchronous validator to return a promise but got '{0}' instead.", promise);
                        }
                        setValidity(name, undefined);
                        validatorPromises.push(promise.then(function () {
                            setValidity(name, true);
                        }, function (error) {
                            allValid = false;
                            setValidity(name, false);
                        }));
                    });
                    if (!validatorPromises.length) {
                        validationDone(true);
                    } else {
                        $q.all(validatorPromises).then(function () {
                            validationDone(allValid);
                        }, noop);
                    }
                }

                function setValidity(name, isValid) {
                    if (localValidationRunId === currentValidationRunId) {
                        ctrl.$setValidity(name, isValid);
                    }
                }

                function validationDone(allValid) {
                    if (localValidationRunId === currentValidationRunId) {
                        doneCallback(allValid);
                    }
                }
            };
            this.$commitViewValue = function () {
                var viewValue = ctrl.$viewValue;
                $timeout.cancel(pendingDebounce);
                if (ctrl.$$lastCommittedViewValue === viewValue && (viewValue !== '' || !ctrl.$$hasNativeValidators)) {
                    return;
                }
                ctrl.$$lastCommittedViewValue = viewValue;
                if (ctrl.$pristine) {
                    this.$setDirty();
                }
                this.$$parseAndValidate();
            };
            this.$$parseAndValidate = function () {
                var viewValue = ctrl.$$lastCommittedViewValue;
                var modelValue = viewValue;
                parserValid = isUndefined(modelValue) ? undefined : true;
                if (parserValid) {
                    for (var i = 0; i < ctrl.$parsers.length; i++) {
                        modelValue = ctrl.$parsers[i](modelValue);
                        if (isUndefined(modelValue)) {
                            parserValid = false;
                            break;
                        }
                    }
                }
                if (isNumber(ctrl.$modelValue) && isNaN(ctrl.$modelValue)) {
                    ctrl.$modelValue = ngModelGet($scope);
                }
                var prevModelValue = ctrl.$modelValue;
                var allowInvalid = ctrl.$options && ctrl.$options.allowInvalid;
                ctrl.$$rawModelValue = modelValue;
                if (allowInvalid) {
                    ctrl.$modelValue = modelValue;
                    writeToModelIfNeeded();
                }
                ctrl.$$runValidators(modelValue, ctrl.$$lastCommittedViewValue, function (allValid) {
                    if (!allowInvalid) {
                        ctrl.$modelValue = allValid ? modelValue : undefined;
                        writeToModelIfNeeded();
                    }
                });
                function writeToModelIfNeeded() {
                    if (ctrl.$modelValue !== prevModelValue) {
                        ctrl.$$writeModelToScope();
                    }
                }
            };
            this.$$writeModelToScope = function () {
                ngModelSet($scope, ctrl.$modelValue);
                forEach(ctrl.$viewChangeListeners, function (listener) {
                    try {
                        listener();
                    } catch (e) {
                        $exceptionHandler(e);
                    }
                });
            };
            this.$setViewValue = function (value, trigger) {
                ctrl.$viewValue = value;
                if (!ctrl.$options || ctrl.$options.updateOnDefault) {
                    ctrl.$$debounceViewValueCommit(trigger);
                }
            };
            this.$$debounceViewValueCommit = function (trigger) {
                var debounceDelay = 0,
                    options = ctrl.$options,
                    debounce;
                if (options && isDefined(options.debounce)) {
                    debounce = options.debounce;
                    if (isNumber(debounce)) {
                        debounceDelay = debounce;
                    } else if (isNumber(debounce[trigger])) {
                        debounceDelay = debounce[trigger];
                    } else if (isNumber(debounce['default'])) {
                        debounceDelay = debounce['default'];
                    }
                }
                $timeout.cancel(pendingDebounce);
                if (debounceDelay) {
                    pendingDebounce = $timeout(function () {
                        ctrl.$commitViewValue();
                    }, debounceDelay);
                } else if ($rootScope.$$phase) {
                    ctrl.$commitViewValue();
                } else {
                    $scope.$apply(function () {
                        ctrl.$commitViewValue();
                    });
                }
            };
            $scope.$watch(function ngModelWatch() {
                var modelValue = ngModelGet($scope);
                if (modelValue !== ctrl.$modelValue &&
                    (ctrl.$modelValue === ctrl.$modelValue || modelValue === modelValue)
                ) {
                    ctrl.$modelValue = ctrl.$$rawModelValue = modelValue;
                    parserValid = undefined;
                    var formatters = ctrl.$formatters,
                        idx = formatters.length;
                    var viewValue = modelValue;
                    while (idx--) {
                        viewValue = formatters[idx](viewValue);
                    }
                    if (ctrl.$viewValue !== viewValue) {
                        ctrl.$viewValue = ctrl.$$lastCommittedViewValue = viewValue;
                        ctrl.$render();
                        ctrl.$$runValidators(modelValue, viewValue, noop);
                    }
                }
                return modelValue;
            });
        }];
    var ngModelDirective = ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            require: ['ngModel', '^?form', '^?ngModelOptions'],
            controller: NgModelController,
            priority: 1,
            compile: function ngModelCompile(element) {
                element.addClass(PRISTINE_CLASS).addClass(UNTOUCHED_CLASS).addClass(VALID_CLASS);
                return {
                    pre: function ngModelPreLink(scope, element, attr, ctrls) {
                        var modelCtrl = ctrls[0],
                            formCtrl = ctrls[1] || nullFormCtrl;
                        modelCtrl.$$setOptions(ctrls[2] && ctrls[2].$options);
                        formCtrl.$addControl(modelCtrl);
                        attr.$observe('name', function (newValue) {
                            if (modelCtrl.$name !== newValue) {
                                formCtrl.$$renameControl(modelCtrl, newValue);
                            }
                        });
                        scope.$on('$destroy', function () {
                            formCtrl.$removeControl(modelCtrl);
                        });
                    },
                    post: function ngModelPostLink(scope, element, attr, ctrls) {
                        var modelCtrl = ctrls[0];
                        if (modelCtrl.$options && modelCtrl.$options.updateOn) {
                            element.on(modelCtrl.$options.updateOn, function (ev) {
                                modelCtrl.$$debounceViewValueCommit(ev && ev.type);
                            });
                        }
                        element.on('blur', function (ev) {
                            if (modelCtrl.$touched) return;
                            if ($rootScope.$$phase) {
                                scope.$evalAsync(modelCtrl.$setTouched);
                            } else {
                                scope.$apply(modelCtrl.$setTouched);
                            }
                        });
                    }
                };
            }
        };
    }];
    var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;
    var ngModelOptionsDirective = function () {
        return {
            restrict: 'A',
            controller: ['$scope', '$attrs', function ($scope, $attrs) {
                var that = this;
                this.$options = $scope.$eval($attrs.ngModelOptions);
                if (this.$options.updateOn !== undefined) {
                    this.$options.updateOnDefault = false;
                    this.$options.updateOn = trim(this.$options.updateOn.replace(DEFAULT_REGEXP, function () {
                        that.$options.updateOnDefault = true;
                        return ' ';
                    }));
                } else {
                    this.$options.updateOnDefault = true;
                }
            }]
        };
    };

    function addSetValidityMethod(context) {
        var ctrl = context.ctrl,
            $element = context.$element,
            classCache = {},
            set = context.set,
            unset = context.unset,
            parentForm = context.parentForm,
            $animate = context.$animate;
        classCache[INVALID_CLASS] = !(classCache[VALID_CLASS] = $element.hasClass(VALID_CLASS));
        ctrl.$setValidity = setValidity;
        function setValidity(validationErrorKey, state, controller) {
            if (state === undefined) {
                createAndSet('$pending', validationErrorKey, controller);
            } else {
                unsetAndCleanup('$pending', validationErrorKey, controller);
            }
            if (!isBoolean(state)) {
                unset(ctrl.$error, validationErrorKey, controller);
                unset(ctrl.$$success, validationErrorKey, controller);
            } else {
                if (state) {
                    unset(ctrl.$error, validationErrorKey, controller);
                    set(ctrl.$$success, validationErrorKey, controller);
                } else {
                    set(ctrl.$error, validationErrorKey, controller);
                    unset(ctrl.$$success, validationErrorKey, controller);
                }
            }
            if (ctrl.$pending) {
                cachedToggleClass(PENDING_CLASS, true);
                ctrl.$valid = ctrl.$invalid = undefined;
                toggleValidationCss('', null);
            } else {
                cachedToggleClass(PENDING_CLASS, false);
                ctrl.$valid = isObjectEmpty(ctrl.$error);
                ctrl.$invalid = !ctrl.$valid;
                toggleValidationCss('', ctrl.$valid);
            }
            var combinedState;
            if (ctrl.$pending && ctrl.$pending[validationErrorKey]) {
                combinedState = undefined;
            } else if (ctrl.$error[validationErrorKey]) {
                combinedState = false;
            } else if (ctrl.$$success[validationErrorKey]) {
                combinedState = true;
            } else {
                combinedState = null;
            }
            toggleValidationCss(validationErrorKey, combinedState);
            parentForm.$setValidity(validationErrorKey, combinedState, ctrl);
        }

        function createAndSet(name, value, controller) {
            if (!ctrl[name]) {
                ctrl[name] = {};
            }
            set(ctrl[name], value, controller);
        }

        function unsetAndCleanup(name, value, controller) {
            if (ctrl[name]) {
                unset(ctrl[name], value, controller);
            }
            if (isObjectEmpty(ctrl[name])) {
                ctrl[name] = undefined;
            }
        }

        function cachedToggleClass(className, switchValue) {
            if (switchValue && !classCache[className]) {
                $animate.addClass($element, className);
                classCache[className] = true;
            } else if (!switchValue && classCache[className]) {
                $animate.removeClass($element, className);
                classCache[className] = false;
            }
        }

        function toggleValidationCss(validationErrorKey, isValid) {
            validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
            cachedToggleClass(VALID_CLASS + validationErrorKey, isValid === true);
            cachedToggleClass(INVALID_CLASS + validationErrorKey, isValid === false);
        }
    }

    function isObjectEmpty(obj) {
        if (obj) {
            for (var prop in obj) {
                return false;
            }
        }
        return true;
    }

    var ngNonBindableDirective = ngDirective({terminal: true, priority: 1000});
    var ngPluralizeDirective = ['$locale', '$interpolate', function ($locale, $interpolate) {
        var BRACE = /{}/g,
            IS_WHEN = /^when(Minus)?(.+)$/;
        return {
            restrict: 'EA',
            link: function (scope, element, attr) {
                var numberExp = attr.count,
                    whenExp = attr.$attr.when && element.attr(attr.$attr.when),
                    offset = attr.offset || 0,
                    whens = scope.$eval(whenExp) || {},
                    whensExpFns = {},
                    startSymbol = $interpolate.startSymbol(),
                    endSymbol = $interpolate.endSymbol(),
                    braceReplacement = startSymbol + numberExp + '-' + offset + endSymbol,
                    watchRemover = angular.noop,
                    lastCount;
                forEach(attr, function (expression, attributeName) {
                    var tmpMatch = IS_WHEN.exec(attributeName);
                    if (tmpMatch) {
                        var whenKey = (tmpMatch[1] ? '-' : '') + lowercase(tmpMatch[2]);
                        whens[whenKey] = element.attr(attr.$attr[attributeName]);
                    }
                });
                forEach(whens, function (expression, key) {
                    whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement));
                });
                scope.$watch(numberExp, function ngPluralizeWatchAction(newVal) {
                    var count = parseFloat(newVal);
                    var countIsNaN = isNaN(count);
                    if (!countIsNaN && !(count in whens)) {
                        count = $locale.pluralCat(count - offset);
                    }
                    if ((count !== lastCount) && !(countIsNaN && isNaN(lastCount))) {
                        watchRemover();
                        watchRemover = scope.$watch(whensExpFns[count], updateElementText);
                        lastCount = count;
                    }
                });
                function updateElementText(newText) {
                    element.text(newText || '');
                }
            }
        };
    }];
    var ngRepeatDirective = ['$parse', '$animate', function ($parse, $animate) {
        var NG_REMOVED = '$$NG_REMOVED';
        var ngRepeatMinErr = minErr('ngRepeat');
        var updateScope = function (scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
            scope[valueIdentifier] = value;
            if (keyIdentifier) scope[keyIdentifier] = key;
            scope.$index = index;
            scope.$first = (index === 0);
            scope.$last = (index === (arrayLength - 1));
            scope.$middle = !(scope.$first || scope.$last);
            scope.$odd = !(scope.$even = (index & 1) === 0);
        };
        var getBlockStart = function (block) {
            return block.clone[0];
        };
        var getBlockEnd = function (block) {
            return block.clone[block.clone.length - 1];
        };
        return {
            restrict: 'A',
            multiElement: true,
            transclude: 'element',
            priority: 1000,
            terminal: true,
            $$tlb: true,
            compile: function ngRepeatCompile($element, $attr) {
                var expression = $attr.ngRepeat;
                var ngRepeatEndComment = document.createComment(' end ngRepeat: ' + expression + ' ');
                var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
                if (!match) {
                    throw ngRepeatMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
                        expression);
                }
                var lhs = match[1];
                var rhs = match[2];
                var aliasAs = match[3];
                var trackByExp = match[4];
                match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
                if (!match) {
                    throw ngRepeatMinErr('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.",
                        lhs);
                }
                var valueIdentifier = match[3] || match[1];
                var keyIdentifier = match[2];
                if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) ||
                    /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
                    throw ngRepeatMinErr('badident', "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.",
                        aliasAs);
                }
                var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn;
                var hashFnLocals = {$id: hashKey};
                if (trackByExp) {
                    trackByExpGetter = $parse(trackByExp);
                } else {
                    trackByIdArrayFn = function (key, value) {
                        return hashKey(value);
                    };
                    trackByIdObjFn = function (key) {
                        return key;
                    };
                }
                return function ngRepeatLink($scope, $element, $attr, ctrl, $transclude) {
                    if (trackByExpGetter) {
                        trackByIdExpFn = function (key, value, index) {
                            if (keyIdentifier) hashFnLocals[keyIdentifier] = key;
                            hashFnLocals[valueIdentifier] = value;
                            hashFnLocals.$index = index;
                            return trackByExpGetter($scope, hashFnLocals);
                        };
                    }
                    var lastBlockMap = createMap();
                    $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
                        var index, length,
                            previousNode = $element[0],
                            nextNode,
                            nextBlockMap = createMap(),
                            collectionLength,
                            key, value,
                            trackById,
                            trackByIdFn,
                            collectionKeys,
                            block,
                            nextBlockOrder,
                            elementsToRemove;
                        if (aliasAs) {
                            $scope[aliasAs] = collection;
                        }
                        if (isArrayLike(collection)) {
                            collectionKeys = collection;
                            trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                        } else {
                            trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                            collectionKeys = [];
                            for (var itemKey in collection) {
                                if (collection.hasOwnProperty(itemKey) && itemKey.charAt(0) != '$') {
                                    collectionKeys.push(itemKey);
                                }
                            }
                            collectionKeys.sort();
                        }
                        collectionLength = collectionKeys.length;
                        nextBlockOrder = new Array(collectionLength);
                        for (index = 0; index < collectionLength; index++) {
                            key = (collection === collectionKeys) ? index : collectionKeys[index];
                            value = collection[key];
                            trackById = trackByIdFn(key, value, index);
                            if (lastBlockMap[trackById]) {
                                block = lastBlockMap[trackById];
                                delete lastBlockMap[trackById];
                                nextBlockMap[trackById] = block;
                                nextBlockOrder[index] = block;
                            } else if (nextBlockMap[trackById]) {
                                forEach(nextBlockOrder, function (block) {
                                    if (block && block.scope) lastBlockMap[block.id] = block;
                                });
                                throw ngRepeatMinErr('dupes',
                                    "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}",
                                    expression, trackById, value);
                            } else {
                                nextBlockOrder[index] = {id: trackById, scope: undefined, clone: undefined};
                                nextBlockMap[trackById] = true;
                            }
                        }
                        for (var blockKey in lastBlockMap) {
                            block = lastBlockMap[blockKey];
                            elementsToRemove = getBlockNodes(block.clone);
                            $animate.leave(elementsToRemove);
                            if (elementsToRemove[0].parentNode) {
                                for (index = 0, length = elementsToRemove.length; index < length; index++) {
                                    elementsToRemove[index][NG_REMOVED] = true;
                                }
                            }
                            block.scope.$destroy();
                        }
                        for (index = 0; index < collectionLength; index++) {
                            key = (collection === collectionKeys) ? index : collectionKeys[index];
                            value = collection[key];
                            block = nextBlockOrder[index];
                            if (block.scope) {
                                nextNode = previousNode;
                                do {
                                    nextNode = nextNode.nextSibling;
                                } while (nextNode && nextNode[NG_REMOVED]);
                                if (getBlockStart(block) != nextNode) {
                                    $animate.move(getBlockNodes(block.clone), null, jqLite(previousNode));
                                }
                                previousNode = getBlockEnd(block);
                                updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                            } else {
                                $transclude(function ngRepeatTransclude(clone, scope) {
                                    block.scope = scope;
                                    var endNode = ngRepeatEndComment.cloneNode(false);
                                    clone[clone.length++] = endNode;
                                    $animate.enter(clone, null, jqLite(previousNode));
                                    previousNode = endNode;
                                    block.clone = clone;
                                    nextBlockMap[block.id] = block;
                                    updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                                });
                            }
                        }
                        lastBlockMap = nextBlockMap;
                    });
                };
            }
        };
    }];
    var NG_HIDE_CLASS = 'ng-hide';
    var NG_HIDE_IN_PROGRESS_CLASS = 'ng-hide-animate';
    var ngShowDirective = ['$animate', function ($animate) {
        return {
            restrict: 'A',
            multiElement: true,
            link: function (scope, element, attr) {
                scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
                    $animate[value ? 'removeClass' : 'addClass'](element, NG_HIDE_CLASS, {
                        tempClasses: NG_HIDE_IN_PROGRESS_CLASS
                    });
                });
            }
        };
    }];
    var ngHideDirective = ['$animate', function ($animate) {
        return {
            restrict: 'A',
            multiElement: true,
            link: function (scope, element, attr) {
                scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
                    $animate[value ? 'addClass' : 'removeClass'](element, NG_HIDE_CLASS, {
                        tempClasses: NG_HIDE_IN_PROGRESS_CLASS
                    });
                });
            }
        };
    }];
    var ngStyleDirective = ngDirective(function (scope, element, attr) {
        scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
            if (oldStyles && (newStyles !== oldStyles)) {
                forEach(oldStyles, function (val, style) {
                    element.css(style, '');
                });
            }
            if (newStyles) element.css(newStyles);
        }, true);
    });
    var ngSwitchDirective = ['$animate', function ($animate) {
        return {
            restrict: 'EA',
            require: 'ngSwitch',
            controller: ['$scope', function ngSwitchController() {
                this.cases = {};
            }],
            link: function (scope, element, attr, ngSwitchController) {
                var watchExpr = attr.ngSwitch || attr.on,
                    selectedTranscludes = [],
                    selectedElements = [],
                    previousLeaveAnimations = [],
                    selectedScopes = [];
                var spliceFactory = function (array, index) {
                    return function () {
                        array.splice(index, 1);
                    };
                };
                scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
                    var i, ii;
                    for (i = 0, ii = previousLeaveAnimations.length; i < ii; ++i) {
                        $animate.cancel(previousLeaveAnimations[i]);
                    }
                    previousLeaveAnimations.length = 0;
                    for (i = 0, ii = selectedScopes.length; i < ii; ++i) {
                        var selected = getBlockNodes(selectedElements[i].clone);
                        selectedScopes[i].$destroy();
                        var promise = previousLeaveAnimations[i] = $animate.leave(selected);
                        promise.then(spliceFactory(previousLeaveAnimations, i));
                    }
                    selectedElements.length = 0;
                    selectedScopes.length = 0;
                    if ((selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?'])) {
                        forEach(selectedTranscludes, function (selectedTransclude) {
                            selectedTransclude.transclude(function (caseElement, selectedScope) {
                                selectedScopes.push(selectedScope);
                                var anchor = selectedTransclude.element;
                                caseElement[caseElement.length++] = document.createComment(' end ngSwitchWhen: ');
                                var block = {clone: caseElement};
                                selectedElements.push(block);
                                $animate.enter(caseElement, anchor.parent(), anchor);
                            });
                        });
                    }
                });
            }
        };
    }];
    var ngSwitchWhenDirective = ngDirective({
        transclude: 'element',
        priority: 1200,
        require: '^ngSwitch',
        multiElement: true,
        link: function (scope, element, attrs, ctrl, $transclude) {
            ctrl.cases['!' + attrs.ngSwitchWhen] = (ctrl.cases['!' + attrs.ngSwitchWhen] || []);
            ctrl.cases['!' + attrs.ngSwitchWhen].push({transclude: $transclude, element: element});
        }
    });
    var ngSwitchDefaultDirective = ngDirective({
        transclude: 'element',
        priority: 1200,
        require: '^ngSwitch',
        multiElement: true,
        link: function (scope, element, attr, ctrl, $transclude) {
            ctrl.cases['?'] = (ctrl.cases['?'] || []);
            ctrl.cases['?'].push({transclude: $transclude, element: element});
        }
    });
    var ngTranscludeDirective = ngDirective({
        restrict: 'EAC',
        link: function ($scope, $element, $attrs, controller, $transclude) {
            if (!$transclude) {
                throw minErr('ngTransclude')('orphan',
                    'Illegal use of ngTransclude directive in the template! ' +
                    'No parent directive that requires a transclusion found. ' +
                    'Element: {0}',
                    startingTag($element));
            }
            $transclude(function (clone) {
                $element.empty();
                $element.append(clone);
            });
        }
    });
    var scriptDirective = ['$templateCache', function ($templateCache) {
        return {
            restrict: 'E',
            terminal: true,
            compile: function (element, attr) {
                if (attr.type == 'text/ng-template') {
                    var templateUrl = attr.id,
                        text = element[0].text;
                    $templateCache.put(templateUrl, text);
                }
            }
        };
    }];
    var ngOptionsMinErr = minErr('ngOptions');
    var ngOptionsDirective = valueFn({
        restrict: 'A',
        terminal: true
    });
    var selectDirective = ['$compile', '$parse', function ($compile, $parse) {
        var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
            nullModelCtrl = {$setViewValue: noop};
        return {
            restrict: 'E',
            require: ['select', '?ngModel'],
            controller: ['$element', '$scope', '$attrs', function ($element, $scope, $attrs) {
                var self = this,
                    optionsMap = {},
                    ngModelCtrl = nullModelCtrl,
                    nullOption,
                    unknownOption;
                self.databound = $attrs.ngModel;
                self.init = function (ngModelCtrl_, nullOption_, unknownOption_) {
                    ngModelCtrl = ngModelCtrl_;
                    nullOption = nullOption_;
                    unknownOption = unknownOption_;
                };
                self.addOption = function (value, element) {
                    assertNotHasOwnProperty(value, '"option value"');
                    optionsMap[value] = true;
                    if (ngModelCtrl.$viewValue == value) {
                        $element.val(value);
                        if (unknownOption.parent()) unknownOption.remove();
                    }
                    if (element && element[0].hasAttribute('selected')) {
                        element[0].selected = true;
                    }
                };
                self.removeOption = function (value) {
                    if (this.hasOption(value)) {
                        delete optionsMap[value];
                        if (ngModelCtrl.$viewValue === value) {
                            this.renderUnknownOption(value);
                        }
                    }
                };
                self.renderUnknownOption = function (val) {
                    var unknownVal = '? ' + hashKey(val) + ' ?';
                    unknownOption.val(unknownVal);
                    $element.prepend(unknownOption);
                    $element.val(unknownVal);
                    unknownOption.prop('selected', true);
                };
                self.hasOption = function (value) {
                    return optionsMap.hasOwnProperty(value);
                };
                $scope.$on('$destroy', function () {
                    self.renderUnknownOption = noop;
                });
            }],
            link: function (scope, element, attr, ctrls) {
                if (!ctrls[1]) return;
                var selectCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1],
                    multiple = attr.multiple,
                    optionsExp = attr.ngOptions,
                    nullOption = false,
                    emptyOption,
                    renderScheduled = false,
                    optionTemplate = jqLite(document.createElement('option')),
                    optGroupTemplate = jqLite(document.createElement('optgroup')),
                    unknownOption = optionTemplate.clone();
                for (var i = 0, children = element.children(), ii = children.length; i < ii; i++) {
                    if (children[i].value === '') {
                        emptyOption = nullOption = children.eq(i);
                        break;
                    }
                }
                selectCtrl.init(ngModelCtrl, nullOption, unknownOption);
                if (multiple) {
                    ngModelCtrl.$isEmpty = function (value) {
                        return !value || value.length === 0;
                    };
                }
                if (optionsExp) setupAsOptions(scope, element, ngModelCtrl);
                else if (multiple) setupAsMultiple(scope, element, ngModelCtrl);
                else setupAsSingle(scope, element, ngModelCtrl, selectCtrl);
                function setupAsSingle(scope, selectElement, ngModelCtrl, selectCtrl) {
                    ngModelCtrl.$render = function () {
                        var viewValue = ngModelCtrl.$viewValue;
                        if (selectCtrl.hasOption(viewValue)) {
                            if (unknownOption.parent()) unknownOption.remove();
                            selectElement.val(viewValue);
                            if (viewValue === '') emptyOption.prop('selected', true);
                        } else {
                            if (viewValue == null && emptyOption) {
                                selectElement.val('');
                            } else {
                                selectCtrl.renderUnknownOption(viewValue);
                            }
                        }
                    };
                    selectElement.on('change', function () {
                        scope.$apply(function () {
                            if (unknownOption.parent()) unknownOption.remove();
                            ngModelCtrl.$setViewValue(selectElement.val());
                        });
                    });
                }

                function setupAsMultiple(scope, selectElement, ctrl) {
                    var lastView;
                    ctrl.$render = function () {
                        var items = new HashMap(ctrl.$viewValue);
                        forEach(selectElement.find('option'), function (option) {
                            option.selected = isDefined(items.get(option.value));
                        });
                    };
                    scope.$watch(function selectMultipleWatch() {
                        if (!equals(lastView, ctrl.$viewValue)) {
                            lastView = shallowCopy(ctrl.$viewValue);
                            ctrl.$render();
                        }
                    });
                    selectElement.on('change', function () {
                        scope.$apply(function () {
                            var array = [];
                            forEach(selectElement.find('option'), function (option) {
                                if (option.selected) {
                                    array.push(option.value);
                                }
                            });
                            ctrl.$setViewValue(array);
                        });
                    });
                }

                function setupAsOptions(scope, selectElement, ctrl) {
                    var match;
                    if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) {
                        throw ngOptionsMinErr('iexp',
                            "Expected expression in form of " +
                            "'_select_ (as _label_)? for (_key_,)?_value_ in _collection_'" +
                            " but got '{0}'. Element: {1}",
                            optionsExp, startingTag(selectElement));
                    }
                    var displayFn = $parse(match[2] || match[1]),
                        valueName = match[4] || match[6],
                        selectAs = / as /.test(match[0]) && match[1],
                        selectAsFn = selectAs ? $parse(selectAs) : null,
                        keyName = match[5],
                        groupByFn = $parse(match[3] || ''),
                        valueFn = $parse(match[2] ? match[1] : valueName),
                        valuesFn = $parse(match[7]),
                        track = match[8],
                        trackFn = track ? $parse(match[8]) : null,
                        trackKeysCache = {},
                        optionGroupsCache = [[{element: selectElement, label: ''}]],
                        locals = {};
                    if (nullOption) {
                        $compile(nullOption)(scope);
                        nullOption.removeClass('ng-scope');
                        nullOption.remove();
                    }
                    selectElement.empty();
                    selectElement.on('change', selectionChanged);
                    ctrl.$render = render;
                    scope.$watchCollection(valuesFn, scheduleRendering);
                    scope.$watchCollection(getLabels, scheduleRendering);
                    if (multiple) {
                        scope.$watchCollection(function () {
                            return ctrl.$modelValue;
                        }, scheduleRendering);
                    }
                    function callExpression(exprFn, key, value) {
                        locals[valueName] = value;
                        if (keyName) locals[keyName] = key;
                        return exprFn(scope, locals);
                    }

                    function selectionChanged() {
                        scope.$apply(function () {
                            var collection = valuesFn(scope) || [];
                            var viewValue;
                            if (multiple) {
                                viewValue = [];
                                forEach(selectElement.val(), function (selectedKey) {
                                    selectedKey = trackFn ? trackKeysCache[selectedKey] : selectedKey;
                                    viewValue.push(getViewValue(selectedKey, collection[selectedKey]));
                                });
                            } else {
                                var selectedKey = trackFn ? trackKeysCache[selectElement.val()] : selectElement.val();
                                viewValue = getViewValue(selectedKey, collection[selectedKey]);
                            }
                            ctrl.$setViewValue(viewValue);
                            render();
                        });
                    }

                    function getViewValue(key, value) {
                        if (key === '?') {
                            return undefined;
                        } else if (key === '') {
                            return null;
                        } else {
                            var viewValueFn = selectAsFn ? selectAsFn : valueFn;
                            return callExpression(viewValueFn, key, value);
                        }
                    }

                    function getLabels() {
                        var values = valuesFn(scope);
                        var toDisplay;
                        if (values && isArray(values)) {
                            toDisplay = new Array(values.length);
                            for (var i = 0, ii = values.length; i < ii; i++) {
                                toDisplay[i] = callExpression(displayFn, i, values[i]);
                            }
                            return toDisplay;
                        } else if (values) {
                            toDisplay = {};
                            for (var prop in values) {
                                if (values.hasOwnProperty(prop)) {
                                    toDisplay[prop] = callExpression(displayFn, prop, values[prop]);
                                }
                            }
                        }
                        return toDisplay;
                    }

                    function createIsSelectedFn(viewValue) {
                        var selectedSet;
                        if (multiple) {
                            if (trackFn && isArray(viewValue)) {
                                selectedSet = new HashMap([]);
                                for (var trackIndex = 0; trackIndex < viewValue.length; trackIndex++) {
                                    selectedSet.put(callExpression(trackFn, null, viewValue[trackIndex]), true);
                                }
                            } else {
                                selectedSet = new HashMap(viewValue);
                            }
                        } else if (trackFn) {
                            viewValue = callExpression(trackFn, null, viewValue);
                        }
                        return function isSelected(key, value) {
                            var compareValueFn;
                            if (trackFn) {
                                compareValueFn = trackFn;
                            } else if (selectAsFn) {
                                compareValueFn = selectAsFn;
                            } else {
                                compareValueFn = valueFn;
                            }
                            if (multiple) {
                                return isDefined(selectedSet.remove(callExpression(compareValueFn, key, value)));
                            } else {
                                return viewValue === callExpression(compareValueFn, key, value);
                            }
                        };
                    }

                    function scheduleRendering() {
                        if (!renderScheduled) {
                            scope.$$postDigest(render);
                            renderScheduled = true;
                        }
                    }

                    function updateLabelMap(labelMap, label, added) {
                        labelMap[label] = labelMap[label] || 0;
                        labelMap[label] += (added ? 1 : -1);
                    }

                    function render() {
                        renderScheduled = false;
                        var optionGroups = {'': []},
                            optionGroupNames = [''],
                            optionGroupName,
                            optionGroup,
                            option,
                            existingParent, existingOptions, existingOption,
                            viewValue = ctrl.$viewValue,
                            values = valuesFn(scope) || [],
                            keys = keyName ? sortedKeys(values) : values,
                            key,
                            value,
                            groupLength, length,
                            groupIndex, index,
                            labelMap = {},
                            selected,
                            isSelected = createIsSelectedFn(viewValue),
                            anySelected = false,
                            lastElement,
                            element,
                            label,
                            optionId;
                        trackKeysCache = {};
                        for (index = 0; length = keys.length, index < length; index++) {
                            key = index;
                            if (keyName) {
                                key = keys[index];
                                if (key.charAt(0) === '$') continue;
                            }
                            value = values[key];
                            optionGroupName = callExpression(groupByFn, key, value) || '';
                            if (!(optionGroup = optionGroups[optionGroupName])) {
                                optionGroup = optionGroups[optionGroupName] = [];
                                optionGroupNames.push(optionGroupName);
                            }
                            selected = isSelected(key, value);
                            anySelected = anySelected || selected;
                            label = callExpression(displayFn, key, value);
                            label = isDefined(label) ? label : '';
                            optionId = trackFn ? trackFn(scope, locals) : (keyName ? keys[index] : index);
                            if (trackFn) {
                                trackKeysCache[optionId] = key;
                            }
                            optionGroup.push({
                                id: optionId,
                                label: label,
                                selected: selected
                            });
                        }
                        if (!multiple) {
                            if (nullOption || viewValue === null) {
                                optionGroups[''].unshift({id: '', label: '', selected: !anySelected});
                            } else if (!anySelected) {
                                optionGroups[''].unshift({id: '?', label: '', selected: true});
                            }
                        }
                        for (groupIndex = 0, groupLength = optionGroupNames.length;
                             groupIndex < groupLength;
                             groupIndex++) {
                            optionGroupName = optionGroupNames[groupIndex];
                            optionGroup = optionGroups[optionGroupName];
                            if (optionGroupsCache.length <= groupIndex) {
                                existingParent = {
                                    element: optGroupTemplate.clone().attr('label', optionGroupName),
                                    label: optionGroup.label
                                };
                                existingOptions = [existingParent];
                                optionGroupsCache.push(existingOptions);
                                selectElement.append(existingParent.element);
                            } else {
                                existingOptions = optionGroupsCache[groupIndex];
                                existingParent = existingOptions[0];
                                if (existingParent.label != optionGroupName) {
                                    existingParent.element.attr('label', existingParent.label = optionGroupName);
                                }
                            }
                            lastElement = null;
                            for (index = 0, length = optionGroup.length; index < length; index++) {
                                option = optionGroup[index];
                                if ((existingOption = existingOptions[index + 1])) {
                                    lastElement = existingOption.element;
                                    if (existingOption.label !== option.label) {
                                        updateLabelMap(labelMap, existingOption.label, false);
                                        updateLabelMap(labelMap, option.label, true);
                                        lastElement.text(existingOption.label = option.label);
                                        lastElement.prop('label', existingOption.label);
                                    }
                                    if (existingOption.id !== option.id) {
                                        lastElement.val(existingOption.id = option.id);
                                    }
                                    if (lastElement[0].selected !== option.selected) {
                                        lastElement.prop('selected', (existingOption.selected = option.selected));
                                        if (msie) {
                                            lastElement.prop('selected', existingOption.selected);
                                        }
                                    }
                                } else {
                                    if (option.id === '' && nullOption) {
                                        element = nullOption;
                                    } else {
                                        (element = optionTemplate.clone())
                                            .val(option.id)
                                            .prop('selected', option.selected)
                                            .attr('selected', option.selected)
                                            .prop('label', option.label)
                                            .text(option.label);
                                    }
                                    existingOptions.push(existingOption = {
                                        element: element,
                                        label: option.label,
                                        id: option.id,
                                        selected: option.selected
                                    });
                                    updateLabelMap(labelMap, option.label, true);
                                    if (lastElement) {
                                        lastElement.after(element);
                                    } else {
                                        existingParent.element.append(element);
                                    }
                                    lastElement = element;
                                }
                            }
                            index++;
                            while (existingOptions.length > index) {
                                option = existingOptions.pop();
                                updateLabelMap(labelMap, option.label, false);
                                option.element.remove();
                            }
                        }
                        while (optionGroupsCache.length > groupIndex) {
                            optionGroup = optionGroupsCache.pop();
                            for (index = 1; index < optionGroup.length; ++index) {
                                updateLabelMap(labelMap, optionGroup[index].label, false);
                            }
                            optionGroup[0].element.remove();
                        }
                        forEach(labelMap, function (count, label) {
                            if (count > 0) {
                                selectCtrl.addOption(label);
                            } else if (count < 0) {
                                selectCtrl.removeOption(label);
                            }
                        });
                    }
                }
            }
        };
    }];
    var optionDirective = ['$interpolate', function ($interpolate) {
        var nullSelectCtrl = {
            addOption: noop,
            removeOption: noop
        };
        return {
            restrict: 'E',
            priority: 100,
            compile: function (element, attr) {
                if (isUndefined(attr.value)) {
                    var interpolateFn = $interpolate(element.text(), true);
                    if (!interpolateFn) {
                        attr.$set('value', element.text());
                    }
                }
                return function (scope, element, attr) {
                    var selectCtrlName = '$selectController',
                        parent = element.parent(),
                        selectCtrl = parent.data(selectCtrlName) ||
                            parent.parent().data(selectCtrlName);
                    if (!selectCtrl || !selectCtrl.databound) {
                        selectCtrl = nullSelectCtrl;
                    }
                    if (interpolateFn) {
                        scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
                            attr.$set('value', newVal);
                            if (oldVal !== newVal) {
                                selectCtrl.removeOption(oldVal);
                            }
                            selectCtrl.addOption(newVal, element);
                        });
                    } else {
                        selectCtrl.addOption(attr.value, element);
                    }
                    element.on('$destroy', function () {
                        selectCtrl.removeOption(attr.value);
                    });
                };
            }
        };
    }];
    var styleDirective = valueFn({
        restrict: 'E',
        terminal: false
    });
    var requiredDirective = function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attr, ctrl) {
                if (!ctrl) return;
                attr.required = true;
                ctrl.$validators.required = function (modelValue, viewValue) {
                    return !attr.required || !ctrl.$isEmpty(viewValue);
                };
                attr.$observe('required', function () {
                    ctrl.$validate();
                });
            }
        };
    };
    var patternDirective = function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attr, ctrl) {
                if (!ctrl) return;
                var regexp, patternExp = attr.ngPattern || attr.pattern;
                attr.$observe('pattern', function (regex) {
                    if (isString(regex) && regex.length > 0) {
                        regex = new RegExp('^' + regex + '$');
                    }
                    if (regex && !regex.test) {
                        throw minErr('ngPattern')('noregexp',
                            'Expected {0} to be a RegExp but was {1}. Element: {2}', patternExp,
                            regex, startingTag(elm));
                    }
                    regexp = regex || undefined;
                    ctrl.$validate();
                });
                ctrl.$validators.pattern = function (modelValue, viewValue) {
                    return ctrl.$isEmpty(viewValue) || isUndefined(regexp) || regexp.test(viewValue);
                };
            }
        };
    };
    var maxlengthDirective = function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attr, ctrl) {
                if (!ctrl) return;
                var maxlength = -1;
                attr.$observe('maxlength', function (value) {
                    var intVal = int(value);
                    maxlength = isNaN(intVal) ? -1 : intVal;
                    ctrl.$validate();
                });
                ctrl.$validators.maxlength = function (modelValue, viewValue) {
                    return (maxlength < 0) || ctrl.$isEmpty(viewValue) || (viewValue.length <= maxlength);
                };
            }
        };
    };
    var minlengthDirective = function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attr, ctrl) {
                if (!ctrl) return;
                var minlength = 0;
                attr.$observe('minlength', function (value) {
                    minlength = int(value) || 0;
                    ctrl.$validate();
                });
                ctrl.$validators.minlength = function (modelValue, viewValue) {
                    return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength;
                };
            }
        };
    };
    if (window.angular.bootstrap) {
        console.log('WARNING: Tried to load angular more than once.');
        return;
    }
    bindJQuery();
    publishExternalAPI(angular);
    jqLite(document).ready(function () {
        angularInit(document, bootstrap);
    });
})(window, document);
!window.angular.$$csp() && window.angular.element(document.head).prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\\:form{display:block;}</style>');;(function (window, angular, undefined) {
	'use strict';

	var ngRouteModule = angular.module('ngRoute', ['ng']).
		provider('$route', $RouteProvider),
		$routeMinErr = angular.$$minErr('ngRoute');

	function $RouteProvider() {
		function inherit(parent, extra) {
			return angular.extend(Object.create(parent), extra);
		}

		var routes = {};

		this.when = function (path, route) {
			var routeCopy = angular.copy(route);
			if (angular.isUndefined(routeCopy.reloadOnSearch)) {
				routeCopy.reloadOnSearch = true;
			}
			if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
				routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
			}
			routes[path] = angular.extend(
				routeCopy,
				path && pathRegExp(path, routeCopy)
			);
			if (path) {
				var redirectPath = (path[path.length - 1] == '/')
					? path.substr(0, path.length - 1)
					: path + '/';
				routes[redirectPath] = angular.extend(
					{redirectTo: path},
					pathRegExp(redirectPath, routeCopy)
				);
			}
			return this;
		};

		this.caseInsensitiveMatch = false;

		function pathRegExp(path, opts) {
			var insensitive = opts.caseInsensitiveMatch,
				ret = {
					originalPath: path,
					regexp: path
				},
				keys = ret.keys = [];
			path = path
				.replace(/([().])/g, '\\$1')
				.replace(/(\/)?:(\w+)([\?\*])?/g, function (_, slash, key, option) {
					var optional = option === '?' ? option : null;
					var star = option === '*' ? option : null;
					keys.push({name: key, optional: !!optional});
					slash = slash || '';
					return ''
						+ (optional ? '' : slash)
						+ '(?:'
						+ (optional ? slash : '')
						+ (star && '(.+?)' || '([^/]+)')
						+ (optional || '')
						+ ')'
						+ (optional || '');
				})
				.replace(/([\/$\*])/g, '\\$1');
			ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
			return ret;
		}

		this.otherwise = function (params) {
			if (typeof params === 'string') {
				params = {redirectTo: params};
			}
			this.when(null, params);
			return this;
		};
		this.$get = ['$rootScope',
			'$location',
			'$routeParams',
			'$q',
			'$injector',
			'$templateRequest',
			'$sce',
			function ($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {

				var forceReload = false,
					preparedRoute,
					preparedRouteIsUpdateOnly,
					$route = {
						routes: routes,

						reload: function () {
							forceReload = true;
							$rootScope.$evalAsync(function () {
								prepareRoute();
								commitRoute();
							});
						},

						updateParams: function (newParams) {
							if (this.current && this.current.$$route) {
								newParams = angular.extend({}, this.current.params, newParams);
								$location.path(interpolate(this.current.$$route.originalPath, newParams));
								$location.search(newParams);
							} else {
								throw $routeMinErr('norout', 'Tried updating route when with no current route');
							}
						}
					};

				/*****************filter********************/
				function proxy($route, fn) {
					if (!proxy.$done) {
						$route.$NoRouteFilters = [];
						proxy.$done = true;
					}
					return function ($locationEvent, newUrl, oldUrl) {
						var breakFlag = false;
						//过滤filter when url change by vpage directive
						for (var i = 0; i < $route.$NoRouteFilters.length; i++) {
							var handler = $route.$NoRouteFilters[i];
							if (typeof handler == "function") {
								breakFlag = handler.apply(null, arguments);
								if (breakFlag) {
									break;
								}
							}
						}
						if (!breakFlag) {
							fn.apply(null, arguments);
						}
					};
				}

				$rootScope.$on('$locationChangeStart', proxy($route, prepareRoute));
				$rootScope.$on('$locationChangeSuccess', proxy($route, commitRoute));
				/*****************filter********************/
				return $route;

				function switchRouteMatcher(on, route) {
					var keys = route.keys,
						params = {};
					if (!route.regexp) return null;
					var m = route.regexp.exec(on);
					if (!m) return null;
					for (var i = 1, len = m.length; i < len; ++i) {
						var key = keys[i - 1];
						var val = m[i];
						if (key && val) {
							params[key.name] = val;
						}
					}
					return params;
				}

				function prepareRoute($locationEvent) {
					var lastRoute = $route.current;
					preparedRoute = parseRoute();
					preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route
						&& angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
						&& !preparedRoute.reloadOnSearch && !forceReload;
					if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
						if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
							if ($locationEvent) {
								$locationEvent.preventDefault();
							}
						}
					}
				}

				function commitRoute() {
					var lastRoute = $route.current;
					var nextRoute = preparedRoute;
					if (preparedRouteIsUpdateOnly) {
						lastRoute.params = nextRoute.params;
						angular.copy(lastRoute.params, $routeParams);
						$rootScope.$broadcast('$routeUpdate', lastRoute);
					} else if (nextRoute || lastRoute) {
						forceReload = false;
						$route.current = nextRoute;
						if (nextRoute) {
							if (nextRoute.redirectTo) {
								if (angular.isString(nextRoute.redirectTo)) {
									$location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params)
										.replace();
								} else {
									$location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search()))
										.replace();
								}
							}
						}
						$q.when(nextRoute).
						then(function () {
							if (nextRoute) {
								var locals = angular.extend({}, nextRoute.resolve),
									template, templateUrl;
								angular.forEach(locals, function (value, key) {
									locals[key] = angular.isString(value) ?
										$injector.get(value) : $injector.invoke(value, null, null, key);
								});
								if (angular.isDefined(template = nextRoute.template)) {
									if (angular.isFunction(template)) {
										template = template(nextRoute.params);
									}
								} else if (angular.isDefined(templateUrl = nextRoute.templateUrl)) {
									if (angular.isFunction(templateUrl)) {
										templateUrl = templateUrl(nextRoute.params);
									}
									if (angular.isDefined(templateUrl)) {
										nextRoute.loadedTemplateUrl = $sce.valueOf(templateUrl);
										template = $templateRequest(templateUrl);
									}
								}
								if (angular.isDefined(template)) {
									locals['$template'] = template;
								}
								return $q.all(locals);
							}
						}).
						then(function (locals) {
							if (nextRoute == $route.current) {
								if (nextRoute) {
									nextRoute.locals = locals;
									angular.copy(nextRoute.params, $routeParams);
								}
								$rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
							}
						}, function (error) {
							if (nextRoute == $route.current) {
								$rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
							}
						});
					}
				}

				function parseRoute() {
					var params, match;
					angular.forEach(routes, function (route, path) {
						if (!match && (params = switchRouteMatcher($location.path(), route))) {
							match = inherit(route, {
								params: angular.extend({}, $location.search(), params),
								pathParams: params
							});
							match.$$route = route;
						}
					});
					return match || routes[null] && inherit(routes[null], {params: {}, pathParams: {}});
				}

				function interpolate(string, params) {
					var result = [];
					angular.forEach((string || '').split(':'), function (segment, i) {
						if (i === 0) {
							result.push(segment);
						} else {
							var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
							var key = segmentMatch[1];
							result.push(params[key]);
							result.push(segmentMatch[2] || '');
							delete params[key];
						}
					});
					return result.join('');
				}
			}];
	}

	ngRouteModule.provider('$routeParams', $RouteParamsProvider);

	function $RouteParamsProvider() {
		this.$get = function () {
			return {};
		};
	}

	ngRouteModule.directive('ngView', ngViewFactory);
	ngRouteModule.directive('ngView', ngViewFillContentFactory);

	ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
	function ngViewFactory($route, $anchorScroll, $animate) {
		return {
			restrict: 'ECA',
			terminal: true,
			priority: 400,
			transclude: 'element',
			link: function (scope, $element, attr, ctrl, $transclude) {
				var currentScope,
					currentElement,
					previousLeaveAnimation,
					autoScrollExp = attr.autoscroll,
					onloadExp = attr.onload || '';
				scope.$on('$routeChangeSuccess', update);
				update();
				function cleanupLastView() {
					if (previousLeaveAnimation) {
						$animate.cancel(previousLeaveAnimation);
						previousLeaveAnimation = null;
					}
					if (currentScope) {
						currentScope.$destroy();
						currentScope = null;
					}
					if (currentElement) {
						previousLeaveAnimation = $animate.leave(currentElement);
						previousLeaveAnimation.then(function () {
							previousLeaveAnimation = null;
						});
						currentElement = null;
					}
				}

				function update() {
					var locals = $route.current && $route.current.locals,
						template = locals && locals.$template;
					if (angular.isDefined(template)) {
						var newScope = scope.$new();
						var current = $route.current;
						var clone = $transclude(newScope, function (clone) {
							$animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
								if (angular.isDefined(autoScrollExp)
									&& (!autoScrollExp || scope.$eval(autoScrollExp))) {
									$anchorScroll();
								}
							});
							cleanupLastView();
						});
						currentElement = clone;
						currentScope = current.scope = newScope;
						currentScope.$emit('$viewContentLoaded');
						currentScope.$eval(onloadExp);
					} else {
						cleanupLastView();
					}
				}
			}
		};
	}

	ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
	function ngViewFillContentFactory($compile, $controller, $route) {
		return {
			restrict: 'ECA',
			priority: -400,
			link: function (scope, $element) {
				var current = $route.current,
					locals = current.locals;
				$element.html(locals.$template);
				var link = $compile($element.contents());
				if (current.controller) {
					locals.$scope = scope;
					var controller = $controller(current.controller, locals);
					if (current.controllerAs) {
						scope[current.controllerAs] = controller;
					}
					$element.data('$ngControllerController', controller);
					$element.children().data('$ngControllerController', controller);
				}
				link(scope);
			}
		};
	}
})(window, window.angular);;(function () {
    'use strict';
    var regModules = ['ng'],
        initModules = [],
        regInvokes = {},
        regConfigs = [],
        justLoaded = [],
        runBlocks = {},
        ocLazyLoad = angular.module('oc.lazyLoad', ['ng']),
        broadcast = angular.noop;
    ocLazyLoad.provider('$ocLazyLoad', ['$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$injector', '$animateProvider',
        function ($controllerProvider, $provide, $compileProvider, $filterProvider, $injector, $animateProvider) {
            var modules = {},
                providers = {
                    $controllerProvider: $controllerProvider,
                    $compileProvider: $compileProvider,
                    $filterProvider: $filterProvider,
                    $provide: $provide,
                    $injector: $injector,
                    $animateProvider: $animateProvider
                },
                anchor = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0],
                jsLoader, cssLoader, templatesLoader,
                debug = false,
                events = false;
            init(angular.element(window.document));
            this.$get = ['$log', '$q', '$templateCache', '$http', '$rootElement', '$rootScope', '$cacheFactory', '$interval', function ($log, $q, $templateCache, $http, $rootElement, $rootScope, $cacheFactory, $interval) {
                var instanceInjector,
                    filesCache = $cacheFactory('ocLazyLoad'),
                    uaCssChecked = false,
                    useCssLoadPatch = false;
                if (!debug) {
                    $log = {};
                    $log['error'] = angular.noop;
                    $log['warn'] = angular.noop;
                    $log['info'] = angular.noop;
                }
                providers.getInstanceInjector = function () {
                    return (instanceInjector) ? instanceInjector : (instanceInjector = ($rootElement.data('$injector') || angular.injector()));
                };
                broadcast = function broadcast(eventName, params) {
                    if (events) {
                        $rootScope.$broadcast(eventName, params);
                    }
                    if (debug) {
                        $log.info(eventName, params);
                    }
                }

                var buildElement = function buildElement(type, path, params) {
                    var deferred = $q.defer(),
                        el, loaded,
                        cacheBuster = function cacheBuster(url) {
                            var dc = new Date().getTime();
                            if (url.indexOf('?') >= 0) {
                                if (url.substring(0, url.length - 1) === '&') {
                                    return url + '_dc=' + dc;
                                }
                                return url + '&_dc=' + dc;
                            } else {
                                return url + '?_dc=' + dc;
                            }
                        };
                    if (angular.isUndefined(filesCache.get(path))) {
                        filesCache.put(path, deferred.promise);
                    }
                    switch (type) {
                        case 'css':
                            el = document.createElement('link');
                            el.type = 'text/css';
                            el.rel = 'stylesheet';
                            el.href = params.cache === false ? cacheBuster(path) : path;
                            break;
                        case 'js':
                            el = document.createElement('script');
                            el.src = params.cache === false ? cacheBuster(path) : path;
                            break;
                        default:
                            deferred.reject(new Error('Requested type "' + type + '" is not known. Could not inject "' + path + '"'));
                            break;
                    }
                    el.onload = el['onreadystatechange'] = function (e) {
                        if ((el['readyState'] && !(/^c|loade/.test(el['readyState']))) || loaded) return;
                        el.onload = el['onreadystatechange'] = null
                        loaded = 1;
                        broadcast('ocLazyLoad.fileLoaded', path);
                        deferred.resolve();
                    }
                    el.onerror = function (e) {
                        deferred.reject(new Error('Unable to load ' + path));
                    }
                    el.async = params.serie ? 0 : 1;
                    var insertBeforeElem = anchor.lastChild;
                    if (params.insertBefore) {
                        var element = angular.element(params.insertBefore);
                        if (element && element.length > 0) {
                            insertBeforeElem = element[0];
                        }
                    }
                    anchor.insertBefore(el, insertBeforeElem);

                    if (type == 'css') {
                        if (!uaCssChecked) {
                            var ua = navigator.userAgent.toLowerCase();
                            if (/iP(hone|od|ad)/.test(navigator.platform)) {
                                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                                var iOSVersion = parseFloat([parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)].join('.'));
                                useCssLoadPatch = iOSVersion < 6;
                            } else if (ua.indexOf("android") > -1) {
                                var androidVersion = parseFloat(ua.slice(ua.indexOf("android") + 8));
                                useCssLoadPatch = androidVersion < 4.4;
                            } else if (ua.indexOf('safari') > -1 && ua.indexOf('chrome') == -1) {
                                var safariVersion = parseFloat(ua.match(/version\/([\.\d]+)/i)[1]);
                                useCssLoadPatch = safariVersion < 6;
                            }
                        }
                        if (useCssLoadPatch) {
                            var tries = 1000;
                            var interval = $interval(function () {
                                try {
                                    el.sheet.cssRules;
                                    $interval.cancel(interval);
                                    el.onload();
                                } catch (e) {
                                    if (--tries <= 0) {
                                        el.onerror();
                                    }
                                }
                            }, 20);
                        }
                    }
                    return deferred.promise;
                }
                if (angular.isUndefined(jsLoader)) {

                    jsLoader = function (paths, callback, params) {
                        var promises = [];
                        angular.forEach(paths, function loading(path) {
                            promises.push(buildElement('js', path, params));
                        });
                        $q.all(promises).then(function success() {
                            callback();
                        }, function error(err) {
                            callback(err);
                        });
                    }
                    jsLoader.ocLazyLoadLoader = true;
                }
                if (angular.isUndefined(cssLoader)) {

                    cssLoader = function (paths, callback, params) {
                        var promises = [];
                        angular.forEach(paths, function loading(path) {
                            promises.push(buildElement('css', path, params));
                        });
                        $q.all(promises).then(function success() {
                            callback();
                        }, function error(err) {
                            callback(err);
                        });
                    }
                    cssLoader.ocLazyLoadLoader = true;
                }
                if (angular.isUndefined(templatesLoader)) {

                    templatesLoader = function (paths, callback, params) {
                        var promises = [];
                        angular.forEach(paths, function (url) {
                            var deferred = $q.defer();
                            promises.push(deferred.promise);
                            $http.get(url, params).success(function (data) {
                                if (angular.isString(data) && data.length > 0) {
                                    angular.forEach(angular.element(data), function (node) {
                                        if (node.nodeName === 'SCRIPT' && node.type === 'text/ng-template') {
                                            $templateCache.put(node.id, node.innerHTML);
                                        }
                                    });
                                }
                                if (angular.isUndefined(filesCache.get(url))) {
                                    filesCache.put(url, true);
                                }
                                deferred.resolve();
                            }).error(function (err) {
                                deferred.reject(new Error('Unable to load template file "' + url + '": ' + err));
                            });
                        });
                        return $q.all(promises).then(function success() {
                            callback();
                        }, function error(err) {
                            callback(err);
                        });
                    }
                    templatesLoader.ocLazyLoadLoader = true;
                }
                var filesLoader = function (config, params) {
                    var cssFiles = [],
                        templatesFiles = [],
                        jsFiles = [],
                        promises = [],
                        cachePromise = null;
                    angular.extend(params || {}, config);
                    var pushFile = function (path) {
                        cachePromise = filesCache.get(path);
                        if (angular.isUndefined(cachePromise) || params.cache === false) {
                            if (/\.(css|less)[^\.]*$/.test(path) && cssFiles.indexOf(path) === -1) {
                                cssFiles.push(path);
                            } else if (/\.(htm|html)[^\.]*$/.test(path) && templatesFiles.indexOf(path) === -1) {
                                templatesFiles.push(path);
                            } else if (jsFiles.indexOf(path) === -1) {
                                jsFiles.push(path);
                            }
                        } else if (cachePromise) {
                            promises.push(cachePromise);
                        }
                    }
                    if (params.serie) {
                        pushFile(params.files.shift());
                    } else {
                        angular.forEach(params.files, function (path) {
                            pushFile(path);
                        });
                    }
                    if (cssFiles.length > 0) {
                        var cssDeferred = $q.defer();
                        cssLoader(cssFiles, function (err) {
                            if (angular.isDefined(err) && cssLoader.hasOwnProperty('ocLazyLoadLoader')) {
                                $log.error(err);
                                cssDeferred.reject(err);
                            } else {
                                cssDeferred.resolve();
                            }
                        }, params);
                        promises.push(cssDeferred.promise);
                    }
                    if (templatesFiles.length > 0) {
                        var templatesDeferred = $q.defer();
                        templatesLoader(templatesFiles, function (err) {
                            if (angular.isDefined(err) && templatesLoader.hasOwnProperty('ocLazyLoadLoader')) {
                                $log.error(err);
                                templatesDeferred.reject(err);
                            } else {
                                templatesDeferred.resolve();
                            }
                        }, params);
                        promises.push(templatesDeferred.promise);
                    }
                    if (jsFiles.length > 0) {
                        var jsDeferred = $q.defer();
                        jsLoader(jsFiles, function (err) {
                            if (angular.isDefined(err) && jsLoader.hasOwnProperty('ocLazyLoadLoader')) {
                                $log.error(err);
                                jsDeferred.reject(err);
                            } else {
                                jsDeferred.resolve();
                            }
                        }, params);
                        promises.push(jsDeferred.promise);
                    }
                    if (params.serie && params.files.length > 0) {
                        return $q.all(promises).then(function success() {
                            return filesLoader(config, params);
                        });
                    } else {
                        return $q.all(promises);
                    }
                }
                return {

                    getModuleConfig: function (moduleName) {
                        if (!angular.isString(moduleName)) {
                            throw new Error('You need to give the name of the module to get');
                        }
                        if (!modules[moduleName]) {
                            return null;
                        }
                        return modules[moduleName];
                    },

                    setModuleConfig: function (moduleConfig) {
                        if (!angular.isObject(moduleConfig)) {
                            throw new Error('You need to give the module config object to set');
                        }
                        modules[moduleConfig.name] = moduleConfig;
                        return moduleConfig;
                    },

                    getModules: function () {
                        return regModules;
                    },

                    isLoaded: function (modulesNames) {
                        var moduleLoaded = function (module) {
                            var isLoaded = regModules.indexOf(module) > -1;
                            if (!isLoaded) {
                                isLoaded = !!moduleExists(module);
                            }
                            return isLoaded;
                        }
                        if (angular.isString(modulesNames)) {
                            modulesNames = [modulesNames];
                        }
                        if (angular.isArray(modulesNames)) {
                            var i, len;
                            for (i = 0, len = modulesNames.length; i < len; i++) {
                                if (!moduleLoaded(modulesNames[i])) {
                                    return false;
                                }
                            }
                            return true;
                        } else {
                            throw new Error('You need to define the module(s) name(s)');
                        }
                    },

                    load: function (module, params) {
                        var self = this,
                            config = null,
                            moduleCache = [],
                            deferredList = [],
                            deferred = $q.defer(),
                            moduleName,
                            errText;
                        if (angular.isUndefined(params)) {
                            params = {};
                        }
                        if (angular.isArray(module)) {
                            angular.forEach(module, function (m) {
                                if (m) {
                                    deferredList.push(self.load(m, params));
                                }
                            });
                            $q.all(deferredList).then(function success() {
                                deferred.resolve(module);
                            }, function error(err) {
                                deferred.reject(err);
                            });
                            return deferred.promise;
                        }
                        moduleName = getModuleName(module);
                        if (typeof module === 'string') {
                            config = self.getModuleConfig(module);
                            if (!config) {
                                config = {
                                    files: [module]
                                };
                                moduleName = null;
                            }
                        } else if (typeof module === 'object') {
                            config = self.setModuleConfig(module);
                        }
                        if (config === null) {
                            errText = 'Module "' + moduleName + '" is not configured, cannot load.';
                            $log.error(errText);
                            deferred.reject(new Error(errText));
                        } else {
                            if (angular.isDefined(config.template)) {
                                if (angular.isUndefined(config.files)) {
                                    config.files = [];
                                }
                                if (angular.isString(config.template)) {
                                    config.files.push(config.template);
                                } else if (angular.isArray(config.template)) {
                                    config.files.concat(config.template);
                                }
                            }
                        }
                        moduleCache.push = function (value) {
                            if (this.indexOf(value) === -1) {
                                Array.prototype.push.apply(this, arguments);
                            }
                        };
                        if (angular.isDefined(moduleName) && moduleExists(moduleName) && regModules.indexOf(moduleName) !== -1) {
                            moduleCache.push(moduleName);
                            if (angular.isUndefined(config.files)) {
                                deferred.resolve();
                                return deferred.promise;
                            }
                        }
                        var localParams = {};
                        angular.extend(localParams, params, config);
                        var loadDependencies = function loadDependencies(module) {
                            var moduleName,
                                loadedModule,
                                requires,
                                diff,
                                promisesList = [];
                            moduleName = getModuleName(module);
                            if (moduleName === null) {
                                return $q.when();
                            } else {
                                try {
                                    loadedModule = getModule(moduleName);
                                } catch (e) {
                                    var deferred = $q.defer();
                                    $log.error(e.message);
                                    deferred.reject(e);
                                    return deferred.promise;
                                }
                                requires = getRequires(loadedModule);
                            }
                            angular.forEach(requires, function (requireEntry) {
                                if (typeof requireEntry === 'string') {
                                    var config = self.getModuleConfig(requireEntry);
                                    if (config === null) {
                                        moduleCache.push(requireEntry);
                                        return;
                                    }
                                    requireEntry = config;
                                }
                                if (moduleExists(requireEntry.name)) {
                                    if (typeof module !== 'string') {
                                        diff = requireEntry.files.filter(function (n) {
                                            return self.getModuleConfig(requireEntry.name).files.indexOf(n) < 0;
                                        });
                                        if (diff.length !== 0) {
                                            $log.warn('Module "', moduleName, '" attempted to redefine configuration for dependency. "', requireEntry.name, '"\n Additional Files Loaded:', diff);
                                        }
                                        promisesList.push(filesLoader(requireEntry.files, localParams).then(function () {
                                            return loadDependencies(requireEntry);
                                        }));
                                    }
                                    return;
                                } else if (typeof requireEntry === 'object') {
                                    if (requireEntry.hasOwnProperty('name') && requireEntry['name']) {
                                        self.setModuleConfig(requireEntry);
                                        moduleCache.push(requireEntry['name']);
                                    }
                                    if (requireEntry.hasOwnProperty('css') && requireEntry['css'].length !== 0) {
                                        angular.forEach(requireEntry['css'], function (path) {
                                            buildElement('css', path, localParams);
                                        });
                                    }
                                }
                                if (requireEntry.hasOwnProperty('files') && requireEntry.files.length !== 0) {
                                    if (requireEntry.files) {
                                        promisesList.push(filesLoader(requireEntry, localParams).then(function () {
                                            return loadDependencies(requireEntry);
                                        }));
                                    }
                                }
                            });
                            return $q.all(promisesList);
                        }
                        filesLoader(config, localParams).then(function success() {
                            if (moduleName === null) {
                                deferred.resolve(module);
                            } else {
                                moduleCache.push(moduleName);
                                loadDependencies(moduleName).then(function success() {
                                    try {
                                        justLoaded = [];
                                        register(providers, moduleCache, localParams);
                                    } catch (e) {
                                        $log.error(e.message);
                                        deferred.reject(e);
                                        return;
                                    }
                                    deferred.resolve(module);
                                }, function error(err) {
                                    deferred.reject(err);
                                });
                            }
                        }, function error(err) {
                            deferred.reject(err);
                        });
                        return deferred.promise;
                    }
                };
            }];
            this.config = function (config) {
                if (angular.isDefined(config.jsLoader) || angular.isDefined(config.asyncLoader)) {
                    if (!angular.isFunction(config.jsLoader || config.asyncLoader)) {
                        throw('The js loader needs to be a function');
                    }
                    jsLoader = config.jsLoader || config.asyncLoader;
                }
                if (angular.isDefined(config.cssLoader)) {
                    if (!angular.isFunction(config.cssLoader)) {
                        throw('The css loader needs to be a function');
                    }
                    cssLoader = config.cssLoader;
                }
                if (angular.isDefined(config.templatesLoader)) {
                    if (!angular.isFunction(config.templatesLoader)) {
                        throw('The template loader needs to be a function');
                    }
                    templatesLoader = config.templatesLoader;
                }
                if (angular.isDefined(config.modules)) {
                    if (angular.isArray(config.modules)) {
                        angular.forEach(config.modules, function (moduleConfig) {
                            modules[moduleConfig.name] = moduleConfig;
                        });
                    } else {
                        modules[config.modules.name] = config.modules;
                    }
                }
                if (angular.isDefined(config.debug)) {
                    debug = config.debug;
                }
                if (angular.isDefined(config.events)) {
                    events = config.events;
                }
            };
        }]);
    ocLazyLoad.directive('ocLazyLoad', ['$ocLazyLoad', '$compile', '$animate', '$parse',
        function ($ocLazyLoad, $compile, $animate, $parse) {
            return {
                restrict: 'A',
                terminal: true,
                priority: 1000,
                compile: function (element, attrs) {
                    var content = element[0].innerHTML;
                    element.html('');
                    return function ($scope, $element, $attr) {
                        var model = $parse($attr.ocLazyLoad);
                        $scope.$watch(function () {
                            return model($scope) || $attr.ocLazyLoad;
                        }, function (moduleName) {
                            if (angular.isDefined(moduleName)) {
                                $ocLazyLoad.load(moduleName).then(function success(moduleConfig) {
                                    $animate.enter(content, $element);
                                    $compile($element.contents())($scope);
                                });
                            }
                        }, true);
                    };
                }
            };
        }]);

    function getRequires(module) {
        var requires = [];
        angular.forEach(module.requires, function (requireModule) {
            if (regModules.indexOf(requireModule) === -1) {
                requires.push(requireModule);
            }
        });
        return requires;
    }

    function moduleExists(moduleName) {
        try {
            return angular.module(moduleName);
        } catch (e) {
            if (/No module/.test(e) || (e.message.indexOf('$injector:nomod') > -1)) {
                return false;
            }
        }
    }

    function getModule(moduleName) {
        try {
            return angular.module(moduleName);
        } catch (e) {
            if (/No module/.test(e) || (e.message.indexOf('$injector:nomod') > -1)) {
                e.message = 'The module "' + moduleName + '" that you are trying to load does not exist. ' + e.message
            }
            throw e;
        }
    }

    function invokeQueue(providers, queue, moduleName, reconfig) {
        if (!queue) {
            return;
        }
        var i, len, args, provider;
        for (i = 0, len = queue.length; i < len; i++) {
            args = queue[i];
            if (angular.isArray(args)) {
                if (providers !== null) {
                    if (providers.hasOwnProperty(args[0])) {
                        provider = providers[args[0]];
                    } else {
                        throw new Error('unsupported provider ' + args[0]);
                    }
                }
                var isNew = registerInvokeList(args, moduleName);
                if (args[1] !== 'invoke') {
                    if (isNew && angular.isDefined(provider)) {
                        provider[args[1]].apply(provider, args[2]);
                    }
                } else {
                    var callInvoke = function (fct) {
                        var invoked = regConfigs.indexOf(moduleName + '-' + fct);
                        if (invoked === -1 || reconfig) {
                            if (invoked === -1) {
                                regConfigs.push(moduleName + '-' + fct);
                            }
                            if (angular.isDefined(provider)) {
                                provider[args[1]].apply(provider, args[2]);
                            }
                        }
                    }
                    if (angular.isFunction(args[2][0])) {
                        callInvoke(args[2][0]);
                    } else if (angular.isArray(args[2][0])) {
                        for (var j = 0, jlen = args[2][0].length; j < jlen; j++) {
                            if (angular.isFunction(args[2][0][j])) {
                                callInvoke(args[2][0][j]);
                            }
                        }
                    }
                }
            }
        }
    }

    function register(providers, registerModules, params) {
        if (registerModules) {
            var k, r, moduleName, moduleFn, tempRunBlocks = [];
            for (k = registerModules.length - 1; k >= 0; k--) {
                moduleName = registerModules[k];
                if (typeof moduleName !== 'string') {
                    moduleName = getModuleName(moduleName);
                }
                if (!moduleName || justLoaded.indexOf(moduleName) !== -1) {
                    continue;
                }
                var newModule = regModules.indexOf(moduleName) === -1;
                moduleFn = angular.module(moduleName);
                if (newModule) {
                    regModules.push(moduleName);
                    register(providers, moduleFn.requires, params);
                }
                if (moduleFn._runBlocks.length > 0) {
                    runBlocks[moduleName] = [];
                    while (moduleFn._runBlocks.length > 0) {
                        runBlocks[moduleName].push(moduleFn._runBlocks.shift());
                    }
                }
                if (angular.isDefined(runBlocks[moduleName]) && (newModule || params.rerun)) {
                    tempRunBlocks = tempRunBlocks.concat(runBlocks[moduleName]);
                }
                invokeQueue(providers, moduleFn._invokeQueue, moduleName, params.reconfig);
                invokeQueue(providers, moduleFn._configBlocks, moduleName, params.reconfig);
                broadcast(newModule ? 'ocLazyLoad.moduleLoaded' : 'ocLazyLoad.moduleReloaded', moduleName);
                registerModules.pop();
                justLoaded.push(moduleName);
            }
            var instanceInjector = providers.getInstanceInjector();
            angular.forEach(tempRunBlocks, function (fn) {
                instanceInjector.invoke(fn);
            });
        }
    }

    function registerInvokeList(args, moduleName) {
        var invokeList = args[2][0],
            type = args[1],
            newInvoke = false;
        if (angular.isUndefined(regInvokes[moduleName])) {
            regInvokes[moduleName] = {};
        }
        if (angular.isUndefined(regInvokes[moduleName][type])) {
            regInvokes[moduleName][type] = [];
        }
        var onInvoke = function (invokeName) {
            newInvoke = true;
            regInvokes[moduleName][type].push(invokeName);
            broadcast('ocLazyLoad.componentLoaded', [moduleName, type, invokeName]);
        }
        if (angular.isString(invokeList) && regInvokes[moduleName][type].indexOf(invokeList) === -1) {
            onInvoke(invokeList);
        } else if (angular.isObject(invokeList)) {
            angular.forEach(invokeList, function (invoke) {
                if (angular.isString(invoke) && regInvokes[moduleName][type].indexOf(invoke) === -1) {
                    onInvoke(invoke);
                }
            });
        } else {
            return false;
        }
        return newInvoke;
    }

    function getModuleName(module) {
        var moduleName = null;
        if (angular.isString(module)) {
            moduleName = module;
        } else if (angular.isObject(module) && module.hasOwnProperty('name') && angular.isString(module.name)) {
            moduleName = module.name;
        }
        return moduleName;
    }

    function init(element) {
        if (initModules.length === 0) {
            var elements = [element],
                names = ['ng:app', 'ng-app', 'x-ng-app', 'data-ng-app', 'v-app'],
                NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/,
                append = function append(elm) {
                    return (elm && elements.push(elm));
                };
            angular.forEach(names, function (name) {
                names[name] = true;
                append(document.getElementById(name));
                name = name.replace(':', '\\:');
                if (element[0].querySelectorAll) {
                    angular.forEach(element[0].querySelectorAll('.' + name), append);
                    angular.forEach(element[0].querySelectorAll('.' + name + '\\:'), append);
                    angular.forEach(element[0].querySelectorAll('[' + name + ']'), append);
                }
            });
            angular.forEach(elements, function (elm) {
                if (initModules.length === 0) {
                    var className = ' ' + element.className + ' ';
                    var match = NG_APP_CLASS_REGEXP.exec(className);
                    if (match) {
                        initModules.push((match[2] || '').replace(/\s+/g, ','));
                    } else {
                        angular.forEach(elm.attributes, function (attr) {
                            if (initModules.length === 0 && names[attr.name]) {
                                initModules.push(attr.value);
                            }
                        });
                    }
                }
            });
        }
        if (initModules.length === 0) {
            throw 'No module found during bootstrap, unable to init ocLazyLoad';
        }
        var addReg = function addReg(moduleName) {
            if (regModules.indexOf(moduleName) === -1) {
                regModules.push(moduleName);
                var mainModule = angular.module(moduleName);
                invokeQueue(null, mainModule._invokeQueue, moduleName);
                invokeQueue(null, mainModule._configBlocks, moduleName);
                angular.forEach(mainModule.requires, addReg);
            }
        };
        angular.forEach(initModules, function (moduleName) {
            addReg(moduleName);
        });
    }

    var bootstrap = angular.bootstrap;
    angular.bootstrap = function (element, modules, config) {
        initModules = modules.slice();
        return bootstrap(element, modules, config);
    };
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var k;
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = +fromIndex || 0;
            if (Math.abs(n) === Infinity) {
                n = 0;
            }
            if (n >= len) {
                return -1;
            }
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            while (k < len) {
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k++;
            }
            return -1;
        };
    }
})();
;//remote service
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

})(window, window.angular);;/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.13.0-SNAPSHOT - 2015-11-16
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.transition", "ui.bootstrap.collapse", "ui.bootstrap.accordion", "ui.bootstrap.alert", "ui.bootstrap.bindHtml", "ui.bootstrap.buttons", "ui.bootstrap.carousel", "ui.bootstrap.dateparser", "ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.dropdown", "ui.bootstrap.modal", "ui.bootstrap.pagination", "ui.bootstrap.tooltip", "ui.bootstrap.popover", "ui.bootstrap.progressbar", "ui.bootstrap.rating", "ui.bootstrap.tabs", "ui.bootstrap.timepicker", "ui.bootstrap.typeahead"]);
angular.module('ui.bootstrap.transition', [])

	/**
	 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
	 * @param  {DOMElement} element  The DOMElement that will be animated.
	 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
	 *   - As a string, it represents the css class to be added to the element.
	 *   - As an object, it represents a hash of style attributes to be applied to the element.
	 *   - As a function, it represents a function to be called that will cause the transition to occur.
	 * @return {Promise}  A promise that is resolved when the transition finishes.
	 */
	.factory('$transition', ['$q', '$timeout', '$rootScope', function ($q, $timeout, $rootScope) {

		var $transition = function (element, trigger, options) {
			options = options || {};
			var deferred = $q.defer();
			var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

			var transitionEndHandler = function (event) {
				$rootScope.$apply(function () {
					element.unbind(endEventName, transitionEndHandler);
					deferred.resolve(element);
				});
			};

			if (endEventName) {
				element.bind(endEventName, transitionEndHandler);
			}

			// Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
			$timeout(function () {
				if (angular.isString(trigger)) {
					element.addClass(trigger);
				} else if (angular.isFunction(trigger)) {
					trigger(element);
				} else if (angular.isObject(trigger)) {
					element.css(trigger);
				}
				//If browser does not support transitions, instantly resolve
				if (!endEventName) {
					deferred.resolve(element);
				}
			});

			// Add our custom cancel function to the promise that is returned
			// We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
			// i.e. it will therefore never raise a transitionEnd event for that transition
			deferred.promise.cancel = function () {
				if (endEventName) {
					element.unbind(endEventName, transitionEndHandler);
				}
				deferred.reject('Transition cancelled');
			};

			return deferred.promise;
		};

		// Work out the name of the transitionEnd event
		var transElement = document.createElement('trans');
		var transitionEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'transition': 'transitionend'
		};
		var animationEndEventNames = {
			'WebkitTransition': 'webkitAnimationEnd',
			'MozTransition': 'animationend',
			'OTransition': 'oAnimationEnd',
			'transition': 'animationend'
		};

		function findEndEventName(endEventNames) {
			for (var name in endEventNames) {
				if (transElement.style[name] !== undefined) {
					return endEventNames[name];
				}
			}
		}

		$transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
		$transition.animationEndEventName = findEndEventName(animationEndEventNames);
		return $transition;
	}]);

angular.module('ui.bootstrap.collapse', ['ui.bootstrap.transition'])

	.directive('collapse', ['$transition', function ($transition) {

		return {
			link: function (scope, element, attrs) {

				var initialAnimSkip = true;
				var currentTransition;

				function doTransition(change) {
					var newTransition = $transition(element, change);
					if (currentTransition) {
						currentTransition.cancel();
					}
					currentTransition = newTransition;
					newTransition.then(newTransitionDone, newTransitionDone);
					return newTransition;

					function newTransitionDone() {
						// Make sure it's this transition, otherwise, leave it alone.
						if (currentTransition === newTransition) {
							currentTransition = undefined;
						}
					}
				}

				function expand() {
					if (initialAnimSkip) {
						initialAnimSkip = false;
						expandDone();
					} else {
						element.removeClass('collapse').addClass('collapsing');
						doTransition({height: element[0].scrollHeight + 'px'}).then(expandDone);
					}
				}

				function expandDone() {
					element.removeClass('collapsing');
					element.addClass('collapse in');
					element.css({height: 'auto'});
				}

				function collapse() {
					if (initialAnimSkip) {
						initialAnimSkip = false;
						collapseDone();
						element.css({height: 0});
					} else {
						// CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
						element.css({height: element[0].scrollHeight + 'px'});
						//trigger reflow so a browser realizes that height was updated from auto to a specific value
						var x = element[0].offsetWidth;

						element.removeClass('collapse in').addClass('collapsing');

						doTransition({height: 0}).then(collapseDone);
					}
				}

				function collapseDone() {
					element.removeClass('collapsing');
					element.addClass('collapse');
				}

				scope.$watch(attrs.collapse, function (shouldCollapse) {
					if (shouldCollapse) {
						collapse();
					} else {
						expand();
					}
				});
			}
		};
	}]);

angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

	.constant('accordionConfig', {
		closeOthers: true
	})

	.controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

		// This array keeps track of the accordion groups
		this.groups = [];

		// Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
		this.closeOthers = function (openGroup) {
			var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
			if (closeOthers) {
				angular.forEach(this.groups, function (group) {
					if (group !== openGroup) {
						group.isOpen = false;
					}
				});
			}
		};

		// This is called from the accordion-group directive to add itself to the accordion
		this.addGroup = function (groupScope) {
			var that = this;
			this.groups.push(groupScope);

			groupScope.$on('$destroy', function (event) {
				that.removeGroup(groupScope);
			});
		};

		// This is called from the accordion-group directive when to remove itself
		this.removeGroup = function (group) {
			var index = this.groups.indexOf(group);
			if (index !== -1) {
				this.groups.splice(index, 1);
			}
		};

	}])

	// The accordion directive simply sets up the directive controller
	// and adds an accordion CSS class to itself element.
	.directive('accordion', function () {
		return {
			restrict: 'EA',
			controller: 'AccordionController',
			transclude: true,
			replace: false,
			templateUrl: 'lib/template/accordion/accordion.html'
		};
	})

	// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
	.directive('accordionGroup', function () {
		return {
			require: '^accordion',         // We need this directive to be inside an accordion
			restrict: 'EA',
			transclude: true,              // It transcludes the contents of the directive into the template
			replace: true,                // The element containing the directive will be replaced with the template
			templateUrl: 'lib/template/accordion/accordion-group.html',
			scope: {
				heading: '@',               // Interpolate the heading attribute onto this scope
				isOpen: '=?',
				isDisabled: '=?'
			},
			controller: function () {
				this.setHeading = function (element) {
					this.heading = element;
				};
			},
			link: function (scope, element, attrs, accordionCtrl) {
				accordionCtrl.addGroup(scope);

				scope.$watch('isOpen', function (value) {
					if (value) {
						accordionCtrl.closeOthers(scope);
					}
				});

				scope.toggleOpen = function () {
					if (!scope.isDisabled) {
						scope.isOpen = !scope.isOpen;
					}
				};
			}
		};
	})

	// Use accordion-heading below an accordion-group to provide a heading containing HTML
	// <accordion-group>
	//   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
	// </accordion-group>
	.directive('accordionHeading', function () {
		return {
			restrict: 'EA',
			transclude: true,   // Grab the contents to be used as the heading
			template: '',       // In effect remove this element!
			replace: true,
			require: '^accordionGroup',
			link: function (scope, element, attr, accordionGroupCtrl, transclude) {
				// Pass the heading to the accordion-group controller
				// so that it can be transcluded into the right place in the template
				// [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
				accordionGroupCtrl.setHeading(transclude(scope, function () {
				}));
			}
		};
	})

	// Use in the accordion-group template to indicate where you want the heading to be transcluded
	// You must provide the property on the accordion-group controller that will hold the transcluded element
	// <div class="accordion-group">
	//   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
	//   ...
	// </div>
	.directive('accordionTransclude', function () {
		return {
			require: '^accordionGroup',
			link: function (scope, element, attr, controller) {
				scope.$watch(function () {
					return controller[attr.accordionTransclude];
				}, function (heading) {
					if (heading) {
						element.html('');
						element.append(heading);
					}
				});
			}
		};
	});

angular.module('ui.bootstrap.alert', [])

	.controller('AlertController', ['$scope', '$attrs', function ($scope, $attrs) {
		$scope.closeable = 'close' in $attrs;
		this.close = $scope.close;
	}])

	.directive('alert', function () {
		return {
			restrict: 'EA',
			controller: 'AlertController',
			templateUrl: 'lib/template/alert/alert.html',
			transclude: true,
			replace: true,
			scope: {
				type: '@',
				close: '&'
			}
		};
	})

	.directive('dismissOnTimeout', ['$timeout', function ($timeout) {
		return {
			require: 'alert',
			link: function (scope, element, attrs, alertCtrl) {
				$timeout(function () {
					alertCtrl.close();
				}, parseInt(attrs.dismissOnTimeout, 10));
			}
		};
	}]);

angular.module('ui.bootstrap.bindHtml', [])

	.directive('bindHtmlUnsafe', function () {
		return function (scope, element, attr) {
			element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
			scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
				element.html(value || '');
			});
		};
	});
angular.module('ui.bootstrap.buttons', [])

	.constant('buttonConfig', {
		activeClass: 'active',
		toggleEvent: 'click'
	})

	.controller('ButtonsController', ['buttonConfig', function (buttonConfig) {
		this.activeClass = buttonConfig.activeClass || 'active';
		this.toggleEvent = buttonConfig.toggleEvent || 'click';
	}])

	.directive('btnRadio', function () {
		return {
			require: ['btnRadio', 'ngModel'],
			controller: 'ButtonsController',
			link: function (scope, element, attrs, ctrls) {
				var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

				//model -> UI
				ngModelCtrl.$render = function () {
					element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
				};

				//ui->model
				element.bind(buttonsCtrl.toggleEvent, function () {
					var isActive = element.hasClass(buttonsCtrl.activeClass);

					if (!isActive || angular.isDefined(attrs.uncheckable)) {
						scope.$apply(function () {
							ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.btnRadio));
							ngModelCtrl.$render();
						});
					}
				});
			}
		};
	})

	.directive('btnCheckbox', function () {
		return {
			require: ['btnCheckbox', 'ngModel'],
			controller: 'ButtonsController',
			link: function (scope, element, attrs, ctrls) {
				var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

				function getTrueValue() {
					return getCheckboxValue(attrs.btnCheckboxTrue, true);
				}

				function getFalseValue() {
					return getCheckboxValue(attrs.btnCheckboxFalse, false);
				}

				function getCheckboxValue(attributeValue, defaultValue) {
					var val = scope.$eval(attributeValue);
					return angular.isDefined(val) ? val : defaultValue;
				}

				//model -> UI
				ngModelCtrl.$render = function () {
					element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
				};

				//ui->model
				element.bind(buttonsCtrl.toggleEvent, function () {
					scope.$apply(function () {
						ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
						ngModelCtrl.$render();
					});
				});
			}
		};
	});

/**
 * @ngdoc overview
 * @name ui.bootstrap.carousel
 *
 * @description
 * AngularJS version of an image carousel.
 *
 */
angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
	.controller('CarouselController', ['$scope', '$timeout', '$interval', '$transition', function ($scope, $timeout, $interval, $transition) {
		var self = this,
			slides = self.slides = $scope.slides = [],
			currentIndex = -1,
			currentInterval, isPlaying;
		self.currentSlide = null;

		var destroyed = false;
		/* direction: "prev" or "next" */
		self.select = $scope.select = function (nextSlide, direction) {
			var nextIndex = slides.indexOf(nextSlide);
			//Decide direction if it's not given
			if (direction === undefined) {
				direction = nextIndex > currentIndex ? 'next' : 'prev';
			}
			if (nextSlide && nextSlide !== self.currentSlide) {
				if ($scope.$currentTransition) {
					$scope.$currentTransition.cancel();
					//Timeout so ng-class in template has time to fix classes for finished slide
					$timeout(goNext);
				} else {
					goNext();
				}
			}
			function goNext() {
				// Scope has been destroyed, stop here.
				if (destroyed) {
					return;
				}
				//If we have a slide to transition from and we have a transition type and we're allowed, go
				if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
					//We shouldn't do class manip in here, but it's the same weird thing bootstrap does. need to fix sometime
					nextSlide.$element.addClass(direction);
					var reflow = nextSlide.$element[0].offsetWidth; //force reflow

					//Set all other slides to stop doing their stuff for the new transition
					angular.forEach(slides, function (slide) {
						angular.extend(slide, {direction: '', entering: false, leaving: false, active: false});
					});
					angular.extend(nextSlide, {direction: direction, active: true, entering: true});
					angular.extend(self.currentSlide || {}, {direction: direction, leaving: true});

					$scope.$currentTransition = $transition(nextSlide.$element, {});
					//We have to create new pointers inside a closure since next & current will change
					(function (next, current) {
						$scope.$currentTransition.then(
							function () {
								transitionDone(next, current);
							},
							function () {
								transitionDone(next, current);
							}
						);
					}(nextSlide, self.currentSlide));
				} else {
					transitionDone(nextSlide, self.currentSlide);
				}
				self.currentSlide = nextSlide;
				currentIndex = nextIndex;
				//every time you change slides, reset the timer
				restartTimer();
			}

			function transitionDone(next, current) {
				angular.extend(next, {direction: '', active: true, leaving: false, entering: false});
				angular.extend(current || {}, {direction: '', active: false, leaving: false, entering: false});
				$scope.$currentTransition = null;
			}
		};
		$scope.$on('$destroy', function () {
			destroyed = true;
		});

		/* Allow outside people to call indexOf on slides array */
		self.indexOfSlide = function (slide) {
			return slides.indexOf(slide);
		};

		$scope.next = function () {
			var newIndex = (currentIndex + 1) % slides.length;

			//Prevent this user-triggered transition from occurring if there is already one in progress
			if (!$scope.$currentTransition) {
				return self.select(slides[newIndex], 'next');
			}
		};

		$scope.prev = function () {
			var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;

			//Prevent this user-triggered transition from occurring if there is already one in progress
			if (!$scope.$currentTransition) {
				return self.select(slides[newIndex], 'prev');
			}
		};

		$scope.isActive = function (slide) {
			return self.currentSlide === slide;
		};

		$scope.$watch('interval', restartTimer);
		$scope.$on('$destroy', resetTimer);

		function restartTimer() {
			resetTimer();
			var interval = +$scope.interval;
			if (!isNaN(interval) && interval > 0) {
				currentInterval = $interval(timerFn, interval);
			}
		}

		function resetTimer() {
			if (currentInterval) {
				$interval.cancel(currentInterval);
				currentInterval = null;
			}
		}

		function timerFn() {
			var interval = +$scope.interval;
			if (isPlaying && !isNaN(interval) && interval > 0) {
				$scope.next();
			} else {
				$scope.pause();
			}
		}

		$scope.play = function () {
			if (!isPlaying) {
				isPlaying = true;
				restartTimer();
			}
		};
		$scope.pause = function () {
			if (!$scope.noPause) {
				isPlaying = false;
				resetTimer();
			}
		};

		self.addSlide = function (slide, element) {
			slide.$element = element;
			slides.push(slide);
			//if this is the first slide or the slide is set to active, select it
			if (slides.length === 1 || slide.active) {
				self.select(slides[slides.length - 1]);
				if (slides.length == 1) {
					$scope.play();
				}
			} else {
				slide.active = false;
			}
		};

		self.removeSlide = function (slide) {
			//get the index of the slide inside the carousel
			var index = slides.indexOf(slide);
			slides.splice(index, 1);
			if (slides.length > 0 && slide.active) {
				if (index >= slides.length) {
					self.select(slides[index - 1]);
				} else {
					self.select(slides[index]);
				}
			} else if (currentIndex > index) {
				currentIndex--;
			}
		};

	}])

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.carousel.directive:carousel
	 * @restrict EA
	 *
	 * @description
	 * Carousel is the outer container for a set of image 'slides' to showcase.
	 *
	 * @param {number=} interval The time, in milliseconds, that it will take the carousel to go to the next slide.
	 * @param {boolean=} noTransition Whether to disable transitions on the carousel.
	 * @param {boolean=} noPause Whether to disable pausing on the carousel (by default, the carousel interval pauses on hover).
	 *
	 * @example
	 <example module="ui.bootstrap">
	 <file name="index.html">
	 <carousel>
	 <slide>
	 <img src="http://placekitten.com/150/150" style="margin:auto;">
	 <div class="carousel-caption">
	 <p>Beautiful!</p>
	 </div>
	 </slide>
	 <slide>
	 <img src="http://placekitten.com/100/150" style="margin:auto;">
	 <div class="carousel-caption">
	 <p>D'aww!</p>
	 </div>
	 </slide>
	 </carousel>
	 </file>
	 <file name="demo.css">
	 .carousel-indicators {
      top: auto;
      bottom: 15px;
    }
	 </file>
	 </example>
	 */
	.directive('carousel', [function () {
		return {
			restrict: 'EA',
			transclude: true,
			replace: true,
			controller: 'CarouselController',
			require: 'carousel',
			templateUrl: 'lib/template/carousel/carousel.html',
			scope: {
				interval: '=',
				noTransition: '=',
				noPause: '='
			}
		};
	}])

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.carousel.directive:slide
	 * @restrict EA
	 *
	 * @description
	 * Creates a slide inside a {@link ui.bootstrap.carousel.directive:carousel carousel}.  Must be placed as a child of a carousel element.
	 *
	 * @param {boolean=} active Model binding, whether or not this slide is currently active.
	 *
	 * @example
	 <example module="ui.bootstrap">
	 <file name="index.html">
	 <div ng-controller="CarouselDemoCtrl">
	 <carousel>
	 <slide ng-repeat="slide in slides" active="slide.active">
	 <img ng-src="{{slide.image}}" style="margin:auto;">
	 <div class="carousel-caption">
	 <h4>Slide {{$index}}</h4>
	 <p>{{slide.text}}</p>
	 </div>
	 </slide>
	 </carousel>
	 Interval, in milliseconds: <input type="number" ng-model="myInterval">
	 <br />Enter a negative number to stop the interval.
	 </div>
	 </file>
	 <file name="script.js">
	 function CarouselDemoCtrl($scope) {
  $scope.myInterval = 5000;
}
	 </file>
	 <file name="demo.css">
	 .carousel-indicators {
      top: auto;
      bottom: 15px;
    }
	 </file>
	 </example>
	 */

	.directive('slide', function () {
		return {
			require: '^carousel',
			restrict: 'EA',
			transclude: true,
			replace: true,
			templateUrl: 'lib/template/carousel/slide.html',
			scope: {
				active: '=?'
			},
			link: function (scope, element, attrs, carouselCtrl) {
				carouselCtrl.addSlide(scope, element);
				//when the scope is destroyed then remove the slide from the current slides array
				scope.$on('$destroy', function () {
					carouselCtrl.removeSlide(scope);
				});

				scope.$watch('active', function (active) {
					if (active) {
						carouselCtrl.select(scope);
					}
				});
			}
		};
	});

angular.module('ui.bootstrap.dateparser', [])

	.service('dateParser', ['$locale', 'orderByFilter', function ($locale, orderByFilter) {

		this.parsers = {};

		var formatCodeToRegex = {
			'yyyy': {
				regex: '\\d{4}',
				apply: function (value) {
					this.year = +value;
				}
			},
			'yy': {
				regex: '\\d{2}',
				apply: function (value) {
					this.year = +value + 2000;
				}
			},
			'y': {
				regex: '\\d{1,4}',
				apply: function (value) {
					this.year = +value;
				}
			},
			'MMMM': {
				regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
				apply: function (value) {
					this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value);
				}
			},
			'MMM': {
				regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
				apply: function (value) {
					this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value);
				}
			},
			'MM': {
				regex: '0[1-9]|1[0-2]',
				apply: function (value) {
					this.month = value - 1;
				}
			},
			'M': {
				regex: '[1-9]|1[0-2]',
				apply: function (value) {
					this.month = value - 1;
				}
			},
			'dd': {
				regex: '[0-2][0-9]{1}|3[0-1]{1}',
				apply: function (value) {
					this.date = +value;
				}
			},
			'd': {
				regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
				apply: function (value) {
					this.date = +value;
				}
			},
			'EEEE': {
				regex: $locale.DATETIME_FORMATS.DAY.join('|')
			},
			'EEE': {
				regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
			}
		};

		function createParser(format) {
			var map = [], regex = format.split('');

			angular.forEach(formatCodeToRegex, function (data, code) {
				var index = format.indexOf(code);

				if (index > -1) {
					format = format.split('');

					regex[index] = '(' + data.regex + ')';
					format[index] = '$'; // Custom symbol to define consumed part of format
					for (var i = index + 1, n = index + code.length; i < n; i++) {
						regex[i] = '';
						format[i] = '$';
					}
					format = format.join('');

					map.push({index: index, apply: data.apply});
				}
			});

			return {
				regex: new RegExp('^' + regex.join('') + '$'),
				map: orderByFilter(map, 'index')
			};
		}

		this.parse = function (input, format) {
			if (!angular.isString(input) || !format) {
				return input;
			}

			format = $locale.DATETIME_FORMATS[format] || format;

			if (!this.parsers[format]) {
				this.parsers[format] = createParser(format);
			}

			var parser = this.parsers[format],
				regex = parser.regex,
				map = parser.map,
				results = input.match(regex);

			if (results && results.length) {
				var fields = {year: 1900, month: 0, date: 1, hours: 0}, dt;

				for (var i = 1, n = results.length; i < n; i++) {
					var mapper = map[i - 1];
					if (mapper.apply) {
						mapper.apply.call(fields, results[i]);
					}
				}

				if (isValid(fields.year, fields.month, fields.date)) {
					dt = new Date(fields.year, fields.month, fields.date, fields.hours);
				}

				return dt;
			}
		};

		// Check if date is valid for specific month (and year for February).
		// Month: 0 = Jan, 1 = Feb, etc
		function isValid(year, month, date) {
			if (month === 1 && date > 28) {
				return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
			}

			if (month === 3 || month === 5 || month === 8 || month === 10) {
				return date < 31;
			}

			return true;
		}
	}]);

angular.module('ui.bootstrap.position', [])

	/**
	 * A set of utility methods that can be use to retrieve position of DOM elements.
	 * It is meant to be used where we need to absolute-position DOM elements in
	 * relation to other, existing elements (this is the case for tooltips, popovers,
	 * typeahead suggestions etc.).
	 */
	.factory('$position', ['$document', '$window', function ($document, $window) {

		function getStyle(el, cssprop) {
			if (el.currentStyle) { //IE
				return el.currentStyle[cssprop];
			} else if ($window.getComputedStyle) {
				return $window.getComputedStyle(el)[cssprop];
			}
			// finally try and get inline style
			return el.style[cssprop];
		}

		/**
		 * Checks if a given element is statically positioned
		 * @param element - raw DOM element
		 */
		function isStaticPositioned(element) {
			return (getStyle(element, 'position') || 'static' ) === 'static';
		}

		/**
		 * returns the closest, non-statically positioned parentOffset of a given element
		 * @param element
		 */
		var parentOffsetEl = function (element) {
			var docDomEl = $document[0];
			var offsetParent = element.offsetParent || docDomEl;
			while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docDomEl;
		};

		return {
			/**
			 * Provides read-only equivalent of jQuery's position function:
			 * http://api.jquery.com/position/
			 */
			position: function (element) {
				var elBCR = this.offset(element);
				var offsetParentBCR = {top: 0, left: 0};
				var offsetParentEl = parentOffsetEl(element[0]);
				if (offsetParentEl != $document[0]) {
					offsetParentBCR = this.offset(angular.element(offsetParentEl));
					offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
					offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
				}

				var boundingClientRect = element[0].getBoundingClientRect();
				return {
					width: boundingClientRect.width || element.prop('offsetWidth'),
					height: boundingClientRect.height || element.prop('offsetHeight'),
					top: elBCR.top - offsetParentBCR.top,
					left: elBCR.left - offsetParentBCR.left
				};
			},

			/**
			 * Provides read-only equivalent of jQuery's offset function:
			 * http://api.jquery.com/offset/
			 */
			offset: function (element) {
				var boundingClientRect = element[0].getBoundingClientRect();
				return {
					width: boundingClientRect.width || element.prop('offsetWidth'),
					height: boundingClientRect.height || element.prop('offsetHeight'),
					top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
					left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
				};
			},

			/**
			 * Provides coordinates for the targetEl in relation to hostEl
			 */
			positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

				var positionStrParts = positionStr.split('-');
				var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

				var hostElPos,
					targetElWidth,
					targetElHeight,
					targetElPos;

				hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

				targetElWidth = targetEl.prop('offsetWidth');
				targetElHeight = targetEl.prop('offsetHeight');

				var shiftWidth = {
					center: function () {
						return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
					},
					left: function () {
						return hostElPos.left;
					},
					right: function () {
						return hostElPos.left + hostElPos.width;
					}
				};

				var shiftHeight = {
					center: function () {
						return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
					},
					top: function () {
						return hostElPos.top;
					},
					bottom: function () {
						return hostElPos.top + hostElPos.height;
					}
				};

				switch (pos0) {
					case 'right':
						targetElPos = {
							top: shiftHeight[pos1](),
							left: shiftWidth[pos0]()
						};
						break;
					case 'left':
						targetElPos = {
							top: shiftHeight[pos1](),
							left: hostElPos.left - targetElWidth
						};
						break;
					case 'bottom':
						targetElPos = {
							top: shiftHeight[pos0](),
							left: shiftWidth[pos1]()
						};
						break;
					default:
						targetElPos = {
							top: hostElPos.top - targetElHeight,
							left: shiftWidth[pos1]()
						};
						break;
				}

				return targetElPos;
			}
		};
	}]);

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.position'])

	.constant('datepickerConfig', {
		formatDay: 'dd',
		formatMonth: 'MMMM',
		formatYear: 'yyyy',
		formatDayHeader: 'EEE',
		formatDayTitle: 'MMMM yyyy',
		formatMonthTitle: 'yyyy',
		datepickerMode: 'day',
		minMode: 'day',
		maxMode: 'year',
		showWeeks: true,
		startingDay: 0,
		yearRange: 20,
		minDate: null,
		maxDate: null
	})

	.controller('DatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$timeout', '$log', 'dateFilter', 'datepickerConfig', function ($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) {
		var self = this,
			ngModelCtrl = {$setViewValue: angular.noop}; // nullModelCtrl;

		// Modes chain
		this.modes = ['day', 'month', 'year'];

		// Configuration attributes
		angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
			'minMode', 'maxMode', 'showWeeks', 'startingDay', 'yearRange'], function (key, index) {
			self[key] = angular.isDefined($attrs[key]) ? (index < 8 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
		});

		// Watchable date attributes
		angular.forEach(['minDate', 'maxDate'], function (key) {
			if ($attrs[key]) {
				$scope.$parent.$watch($parse($attrs[key]), function (value) {
					self[key] = value ? new Date(value) : null;
					self.refreshView();
				});
			} else {
				self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
			}
		});

		$scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
		$scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);
		this.activeDate = angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date();

		$scope.isActive = function (dateObject) {
			if (self.compare(dateObject.date, self.activeDate) === 0) {
				$scope.activeDateId = dateObject.uid;
				return true;
			}
			return false;
		};

		this.init = function (ngModelCtrl_) {
			ngModelCtrl = ngModelCtrl_;

			ngModelCtrl.$render = function () {
				self.render();
			};
		};

		this.render = function () {
			if (ngModelCtrl.$modelValue) {
				var date = new Date(ngModelCtrl.$modelValue),
					isValid = !isNaN(date);

				if (isValid) {
					this.activeDate = date;
				} else {
					$log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
				}
				ngModelCtrl.$setValidity('date', isValid);
			}
			this.refreshView();
		};

		this.refreshView = function () {
			if (this.element) {
				this._refreshView();

				var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
				ngModelCtrl.$setValidity('date-disabled', !date || (this.element && !this.isDisabled(date)));
			}
		};

		this.createDateObject = function (date, format) {
			var model = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;
			return {
				date: date,
				label: dateFilter(date, format),
				selected: model && this.compare(date, model) === 0,
				disabled: this.isDisabled(date),
				current: this.compare(date, new Date()) === 0
			};
		};

		this.isDisabled = function (date) {
			return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({
				date: date,
				mode: $scope.datepickerMode
			})));
		};

		// Split array into smaller arrays
		this.split = function (arr, size) {
			var arrays = [];
			while (arr.length > 0) {
				arrays.push(arr.splice(0, size));
			}
			return arrays;
		};

		$scope.select = function (date) {
			if ($scope.datepickerMode === self.minMode) {
				var dt = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0);
				dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
				ngModelCtrl.$setViewValue(dt);
				ngModelCtrl.$render();
			} else {
				self.activeDate = date;
				$scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1];
			}
		};

		$scope.move = function (direction) {
			var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
				month = self.activeDate.getMonth() + direction * (self.step.months || 0);
			self.activeDate.setFullYear(year, month, 1);
			self.refreshView();
		};

		$scope.toggleMode = function (direction) {
			direction = direction || 1;

			if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
				return;
			}

			$scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction];
		};

		// Key event mapper
		$scope.keys = {
			13: 'enter',
			32: 'space',
			33: 'pageup',
			34: 'pagedown',
			35: 'end',
			36: 'home',
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};

		var focusElement = function () {
			$timeout(function () {
				self.element[0].focus();
			}, 0, false);
		};

		// Listen for focus requests from popup directive
		$scope.$on('datepicker.focus', focusElement);

		$scope.keydown = function (evt) {
			var key = $scope.keys[evt.which];

			if (!key || evt.shiftKey || evt.altKey) {
				return;
			}

			evt.preventDefault();
			evt.stopPropagation();

			if (key === 'enter' || key === 'space') {
				if (self.isDisabled(self.activeDate)) {
					return; // do nothing
				}
				$scope.select(self.activeDate);
				focusElement();
			} else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
				$scope.toggleMode(key === 'up' ? 1 : -1);
				focusElement();
			} else {
				self.handleKeyDown(key, evt);
				self.refreshView();
			}
		};
	}])

	.directive('datepicker', function () {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'lib/template/datepicker/datepicker.html',
			scope: {
				datepickerMode: '=?',
				dateDisabled: '&'
			},
			require: ['datepicker', '?^ngModel'],
			controller: 'DatepickerController',
			link: function (scope, element, attrs, ctrls) {
				var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

				if (ngModelCtrl) {
					datepickerCtrl.init(ngModelCtrl);
				}
			}
		};
	})

	.directive('daypicker', ['dateFilter', function (dateFilter) {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'lib/template/datepicker/day.html',
			require: '^datepicker',
			link: function (scope, element, attrs, ctrl) {
				scope.showWeeks = ctrl.showWeeks;

				ctrl.step = {months: 1};
				ctrl.element = element;

				var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

				function getDaysInMonth(year, month) {
					return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
				}

				function getDates(startDate, n) {
					var dates = new Array(n), current = new Date(startDate), i = 0;
					current.setHours(12); // Prevent repeated dates because of timezone bug
					while (i < n) {
						dates[i++] = new Date(current);
						current.setDate(current.getDate() + 1);
					}
					return dates;
				}

				ctrl._refreshView = function () {
					var year = ctrl.activeDate.getFullYear(),
						month = ctrl.activeDate.getMonth(),
						firstDayOfMonth = new Date(year, month, 1),
						difference = ctrl.startingDay - firstDayOfMonth.getDay(),
						numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : -difference,
						firstDate = new Date(firstDayOfMonth);

					if (numDisplayedFromPreviousMonth > 0) {
						firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
					}

					// 42 is the number of days on a six-month calendar
					var days = getDates(firstDate, 42);
					for (var i = 0; i < 42; i++) {
						days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
							secondary: days[i].getMonth() !== month,
							uid: scope.uniqueId + '-' + i
						});
					}

					scope.labels = new Array(7);
					for (var j = 0; j < 7; j++) {
						scope.labels[j] = {
							abbr: dateFilter(days[j].date, ctrl.formatDayHeader),
							full: dateFilter(days[j].date, 'EEEE')
						};
					}

					scope.title = dateFilter(ctrl.activeDate, ctrl.formatDayTitle);
					scope.rows = ctrl.split(days, 7);

					if (scope.showWeeks) {
						scope.weekNumbers = [];
						var weekNumber = getISO8601WeekNumber(scope.rows[0][0].date),
							numWeeks = scope.rows.length;
						while (scope.weekNumbers.push(weekNumber++) < numWeeks) {
						}
					}
				};

				ctrl.compare = function (date1, date2) {
					return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()) );
				};

				function getISO8601WeekNumber(date) {
					var checkDate = new Date(date);
					checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
					var time = checkDate.getTime();
					checkDate.setMonth(0); // Compare with Jan 1
					checkDate.setDate(1);
					return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
				}

				ctrl.handleKeyDown = function (key, evt) {
					var date = ctrl.activeDate.getDate();

					if (key === 'left') {
						date = date - 1;   // up
					} else if (key === 'up') {
						date = date - 7;   // down
					} else if (key === 'right') {
						date = date + 1;   // down
					} else if (key === 'down') {
						date = date + 7;
					} else if (key === 'pageup' || key === 'pagedown') {
						var month = ctrl.activeDate.getMonth() + (key === 'pageup' ? -1 : 1);
						ctrl.activeDate.setMonth(month, 1);
						date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date);
					} else if (key === 'home') {
						date = 1;
					} else if (key === 'end') {
						date = getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth());
					}
					ctrl.activeDate.setDate(date);
				};

				ctrl.refreshView();
			}
		};
	}])

	.directive('monthpicker', ['dateFilter', function (dateFilter) {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'lib/template/datepicker/month.html',
			require: '^datepicker',
			link: function (scope, element, attrs, ctrl) {
				ctrl.step = {years: 1};
				ctrl.element = element;

				ctrl._refreshView = function () {
					var months = new Array(12),
						year = ctrl.activeDate.getFullYear();

					for (var i = 0; i < 12; i++) {
						months[i] = angular.extend(ctrl.createDateObject(new Date(year, i, 1), ctrl.formatMonth), {
							uid: scope.uniqueId + '-' + i
						});
					}

					scope.title = dateFilter(ctrl.activeDate, ctrl.formatMonthTitle);
					scope.rows = ctrl.split(months, 3);
				};

				ctrl.compare = function (date1, date2) {
					return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth());
				};

				ctrl.handleKeyDown = function (key, evt) {
					var date = ctrl.activeDate.getMonth();

					if (key === 'left') {
						date = date - 1;   // up
					} else if (key === 'up') {
						date = date - 3;   // down
					} else if (key === 'right') {
						date = date + 1;   // down
					} else if (key === 'down') {
						date = date + 3;
					} else if (key === 'pageup' || key === 'pagedown') {
						var year = ctrl.activeDate.getFullYear() + (key === 'pageup' ? -1 : 1);
						ctrl.activeDate.setFullYear(year);
					} else if (key === 'home') {
						date = 0;
					} else if (key === 'end') {
						date = 11;
					}
					ctrl.activeDate.setMonth(date);
				};

				ctrl.refreshView();
			}
		};
	}])

	.directive('yearpicker', ['dateFilter', function (dateFilter) {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'lib/template/datepicker/year.html',
			require: '^datepicker',
			link: function (scope, element, attrs, ctrl) {
				var range = ctrl.yearRange;

				ctrl.step = {years: range};
				ctrl.element = element;

				function getStartingYear(year) {
					return parseInt((year - 1) / range, 10) * range + 1;
				}

				ctrl._refreshView = function () {
					var years = new Array(range);

					for (var i = 0, start = getStartingYear(ctrl.activeDate.getFullYear()); i < range; i++) {
						years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear), {
							uid: scope.uniqueId + '-' + i
						});
					}

					scope.title = [years[0].label, years[range - 1].label].join(' - ');
					scope.rows = ctrl.split(years, 5);
				};

				ctrl.compare = function (date1, date2) {
					return date1.getFullYear() - date2.getFullYear();
				};

				ctrl.handleKeyDown = function (key, evt) {
					var date = ctrl.activeDate.getFullYear();

					if (key === 'left') {
						date = date - 1;   // up
					} else if (key === 'up') {
						date = date - 5;   // down
					} else if (key === 'right') {
						date = date + 1;   // down
					} else if (key === 'down') {
						date = date + 5;
					} else if (key === 'pageup' || key === 'pagedown') {
						date += (key === 'pageup' ? -1 : 1) * ctrl.step.years;
					} else if (key === 'home') {
						date = getStartingYear(ctrl.activeDate.getFullYear());
					} else if (key === 'end') {
						date = getStartingYear(ctrl.activeDate.getFullYear()) + range - 1;
					}
					ctrl.activeDate.setFullYear(date);
				};

				ctrl.refreshView();
			}
		};
	}])

	.constant('datepickerPopupConfig', {
		datepickerPopup: 'yyyy-MM-dd',
		currentText: 'Today',
		clearText: 'Clear',
		closeText: 'Done',
		closeOnDateSelection: true,
		appendToBody: false,
		showButtonBar: true
	})

	.directive('datepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'dateParser', 'datepickerPopupConfig',
		function ($compile, $parse, $document, $position, dateFilter, dateParser, datepickerPopupConfig) {
			return {
				restrict: 'EA',
				require: 'ngModel',
				scope: {
					isOpen: '=?',
					currentText: '@',
					clearText: '@',
					closeText: '@',
					dateDisabled: '&'
				},
				link: function (scope, element, attrs, ngModel) {
					var dateFormat,
						closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
						appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;

					scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

					scope.getText = function (key) {
						return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
					};

					attrs.$observe('datepickerPopup', function (value) {
						dateFormat = value || datepickerPopupConfig.datepickerPopup;
						ngModel.$render();
					});

					// popup element used to display calendar
					var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
					popupEl.attr({
						'ng-model': 'date',
						'ng-change': 'dateSelection()'
					});

					function cameltoDash(string) {
						return string.replace(/([A-Z])/g, function ($1) {
							return '-' + $1.toLowerCase();
						});
					}

					// datepicker element
					var datepickerEl = angular.element(popupEl.children()[0]);
					if (attrs.datepickerOptions) {
						angular.forEach(scope.$parent.$eval(attrs.datepickerOptions), function (value, option) {
							datepickerEl.attr(cameltoDash(option), value);
						});
					}

					scope.watchData = {};
					angular.forEach(['minDate', 'maxDate', 'datepickerMode'], function (key) {
						if (attrs[key]) {
							var getAttribute = $parse(attrs[key]);
							scope.$parent.$watch(getAttribute, function (value) {
								scope.watchData[key] = value;
							});
							datepickerEl.attr(cameltoDash(key), 'watchData.' + key);

							// Propagate changes from datepicker to outside
							if (key === 'datepickerMode') {
								var setAttribute = getAttribute.assign;
								scope.$watch('watchData.' + key, function (value, oldvalue) {
									if (value !== oldvalue) {
										setAttribute(scope.$parent, value);
									}
								});
							}
						}
					});
					if (attrs.dateDisabled) {
						datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
					}

					function parseDate(viewValue) {
						if (!viewValue) {
							ngModel.$setValidity('date', true);
							return null;
						} else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
							ngModel.$setValidity('date', true);
							return viewValue;
						} else if (angular.isString(viewValue)) {
							var date = dateParser.parse(viewValue, dateFormat) || new Date(viewValue);
							if (isNaN(date)) {
								ngModel.$setValidity('date', false);
								return undefined;
							} else {
								ngModel.$setValidity('date', true);
								return date;
							}
						} else {
							ngModel.$setValidity('date', false);
							return undefined;
						}
					}

					ngModel.$parsers.unshift(parseDate);

					ngModel.$formatters.push(function (value) {
						return ngModel.$isEmpty(value) ? value : dateFilter(value, dateFormat);
					});

					// Inner change
					scope.dateSelection = function (dt) {
						if (angular.isDefined(dt)) {
							scope.date = dt;
						}
						ngModel.$setViewValue(scope.date);
						ngModel.$render();

						if (closeOnDateSelection) {
							scope.isOpen = false;
							element[0].focus();
						}
					};

					element.bind('input change keyup', function () {
						scope.$apply(function () {
							scope.date = ngModel.$modelValue;
						});
					});

					// Outer change
					ngModel.$render = function () {
						var date = ngModel.$viewValue ? dateFilter(parseDate(ngModel.$viewValue), dateFormat) : '';
						element.val(date);
						scope.date = parseDate(ngModel.$modelValue);
					};

					var documentClickBind = function (event) {
						if (scope.isOpen && event.target !== element[0]) {
							scope.$apply(function () {
								scope.isOpen = false;
							});
						}
					};

					var keydown = function (evt, noApply) {
						scope.keydown(evt);
					};
					element.bind('keydown', keydown);

					scope.keydown = function (evt) {
						if (evt.which === 27) {
							evt.preventDefault();
							evt.stopPropagation();
							scope.close();
						} else if (evt.which === 40 && !scope.isOpen) {
							scope.isOpen = true;
						}
					};

					scope.$watch('isOpen', function (value) {
						if (value) {
							scope.$broadcast('datepicker.focus');
							scope.position = appendToBody ? $position.offset(element) : $position.position(element);
							scope.position.top = scope.position.top + element.prop('offsetHeight');

							$document.bind('click', documentClickBind);
						} else {
							$document.unbind('click', documentClickBind);
						}
					});

					scope.select = function (date) {
						if (date === 'today') {
							var today = new Date();
							if (angular.isDate(ngModel.$modelValue)) {
								date = new Date(ngModel.$modelValue);
								date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
							} else {
								date = new Date(today.setHours(0, 0, 0, 0));
							}
						}
						scope.dateSelection(date);
					};

					scope.close = function () {
						scope.isOpen = false;
						element[0].focus();
					};

					var $popup = $compile(popupEl)(scope);
					// Prevent jQuery cache memory leak (template is now redundant after linking)
					popupEl.remove();

					if (appendToBody) {
						$document.find('body').append($popup);
					} else {
						element.after($popup);
					}

					scope.$on('$destroy', function () {
						$popup.remove();
						element.unbind('keydown', keydown);
						$document.unbind('click', documentClickBind);
					});
				}
			};
		}])

	.directive('datepickerPopupWrap', function () {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: 'lib/template/datepicker/popup.html',
			link: function (scope, element, attrs) {
				element.bind('click', function (event) {
					event.preventDefault();
					event.stopPropagation();
				});
			}
		};
	});

angular.module('ui.bootstrap.dropdown', [])

	.constant('dropdownConfig', {
		openClass: 'open'
	})

	.service('dropdownService', ['$document', function ($document) {
		var openScope = null;

		this.open = function (dropdownScope) {
			if (!openScope) {
				$document.bind('click', closeDropdown);
				$document.bind('keydown', escapeKeyBind);
			}

			if (openScope && openScope !== dropdownScope) {
				openScope.isOpen = false;
			}

			openScope = dropdownScope;
		};

		this.close = function (dropdownScope) {
			if (openScope === dropdownScope) {
				openScope = null;
				$document.unbind('click', closeDropdown);
				$document.unbind('keydown', escapeKeyBind);
			}
		};

		var closeDropdown = function (evt) {
			// This method may still be called during the same mouse event that
			// unbound this event handler. So check openScope before proceeding.
			if (!openScope) {
				return;
			}

			var toggleElement = openScope.getToggleElement();
			if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
				return;
			}

			openScope.$apply(function () {
				openScope.isOpen = false;
			});
		};

		var escapeKeyBind = function (evt) {
			if (evt.which === 27) {
				openScope.focusToggleElement();
				closeDropdown();
			}
		};
	}])

	.controller('DropdownController', ['$scope', '$attrs', '$parse', 'dropdownConfig', 'dropdownService', '$animate', function ($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate) {
		var self = this,
			scope = $scope.$new(), // create a child scope so we are not polluting original one
			openClass = dropdownConfig.openClass,
			getIsOpen,
			setIsOpen = angular.noop,
			toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;

		this.init = function (element) {
			self.$element = element;

			if ($attrs.isOpen) {
				getIsOpen = $parse($attrs.isOpen);
				setIsOpen = getIsOpen.assign;

				$scope.$watch(getIsOpen, function (value) {
					scope.isOpen = !!value;
				});
			}
		};

		this.toggle = function (open) {
			return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
		};

		// Allow other directives to watch status
		this.isOpen = function () {
			return scope.isOpen;
		};

		scope.getToggleElement = function () {
			return self.toggleElement;
		};

		scope.focusToggleElement = function () {
			if (self.toggleElement) {
				self.toggleElement[0].focus();
			}
		};

		scope.$watch('isOpen', function (isOpen, wasOpen) {
			$animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);

			if (isOpen) {
				scope.focusToggleElement();
				dropdownService.open(scope);
			} else {
				dropdownService.close(scope);
			}

			setIsOpen($scope, isOpen);
			if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
				toggleInvoker($scope, {open: !!isOpen});
			}
		});

		$scope.$on('$locationChangeSuccess', function () {
			scope.isOpen = false;
		});

		$scope.$on('$destroy', function () {
			scope.$destroy();
		});
	}])

	.directive('dropdown', function () {
		return {
			controller: 'DropdownController',
			link: function (scope, element, attrs, dropdownCtrl) {
				dropdownCtrl.init(element);
			}
		};
	})

	.directive('dropdownToggle', function () {
		return {
			require: '?^dropdown',
			link: function (scope, element, attrs, dropdownCtrl) {
				if (!dropdownCtrl) {
					return;
				}

				dropdownCtrl.toggleElement = element;

				var toggleDropdown = function (event) {
					event.preventDefault();

					if (!element.hasClass('disabled') && !attrs.disabled) {
						scope.$apply(function () {
							dropdownCtrl.toggle();
						});
					}
				};

				element.bind('click', toggleDropdown);

				// WAI-ARIA
				element.attr({'aria-haspopup': true, 'aria-expanded': false});
				scope.$watch(dropdownCtrl.isOpen, function (isOpen) {
					element.attr('aria-expanded', !!isOpen);
				});

				scope.$on('$destroy', function () {
					element.unbind('click', toggleDropdown);
				});
			}
		};
	});

angular.module('ui.bootstrap.modal', ['ui.bootstrap.transition'])

	/**
	 * A helper, internal data structure that acts as a map but also allows getting / removing
	 * elements in the LIFO order
	 */
	.factory('$$stackedMap', function () {
		return {
			createNew: function () {
				var stack = [];

				return {
					add: function (key, value) {
						stack.push({
							key: key,
							value: value
						});
					},
					get: function (key) {
						for (var i = 0; i < stack.length; i++) {
							if (key == stack[i].key) {
								return stack[i];
							}
						}
					},
					keys: function () {
						var keys = [];
						for (var i = 0; i < stack.length; i++) {
							keys.push(stack[i].key);
						}
						return keys;
					},
					top: function () {
						return stack[stack.length - 1];
					},
					remove: function (key) {
						var idx = -1;
						for (var i = 0; i < stack.length; i++) {
							if (key == stack[i].key) {
								idx = i;
								break;
							}
						}
						return stack.splice(idx, 1)[0];
					},
					removeTop: function () {
						return stack.splice(stack.length - 1, 1)[0];
					},
					length: function () {
						return stack.length;
					}
				};
			}
		};
	})

	/**
	 * A helper directive for the $modal service. It creates a backdrop element.
	 */
	.directive('modalBackdrop', ['$timeout', function ($timeout) {
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'lib/template/modal/backdrop.html',
			link: function (scope, element, attrs) {
				scope.backdropClass = attrs.backdropClass || '';

				scope.animate = false;

				//trigger CSS transitions
				$timeout(function () {
					scope.animate = true;
				});
			}
		};
	}])

	.directive('modalWindow', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
		return {
			restrict: 'EA',
			scope: {
				index: '@',
				animate: '='
			},
			replace: true,
			transclude: true,
			templateUrl: function (tElement, tAttrs) {
				return tAttrs.templateUrl || 'lib/template/modal/window.html';
			},
			link: function (scope, element, attrs) {
				element.addClass(attrs.windowClass || '');
				scope.size = attrs.size;

				$timeout(function () {
					// trigger CSS transitions
					scope.animate = true;

					/**
					 * Auto-focusing of a freshly-opened modal element causes any child elements
					 * with the autofocus attribute to lose focus. This is an issue on touch
					 * based devices which will show and then hide the onscreen keyboard.
					 * Attempts to refocus the autofocus element via JavaScript will not reopen
					 * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
					 * the modal element if the modal does not contain an autofocus element.
					 */
					if (!element[0].querySelectorAll('[autofocus]').length) {
						element[0].focus();
					}
				});

				scope.close = function (evt) {
					var modal = $modalStack.getTop();
					if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
						evt.preventDefault();
						evt.stopPropagation();
						$modalStack.dismiss(modal.key, 'backdrop click');
					}
				};
			}
		};
	}])

	.directive('modalTransclude', function () {
		return {
			link: function ($scope, $element, $attrs, controller, $transclude) {
				$transclude($scope.$parent, function (clone) {
					$element.empty();
					$element.append(clone);
				});
			}
		};
	})

	.factory('$modalStack', ['$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
		function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {

			var OPENED_MODAL_CLASS = 'modal-open';

			var backdropDomEl, backdropScope;
			var openedWindows = $$stackedMap.createNew();
			var $modalStack = {};

			function backdropIndex() {
				var topBackdropIndex = -1;
				var opened = openedWindows.keys();
				for (var i = 0; i < opened.length; i++) {
					if (openedWindows.get(opened[i]).value.backdrop) {
						topBackdropIndex = i;
					}
				}
				return topBackdropIndex;
			}

			$rootScope.$watch(backdropIndex, function (newBackdropIndex) {
				if (backdropScope) {
					backdropScope.index = newBackdropIndex;
				}
			});

			function removeModalWindow(modalInstance) {

				var body = $document.find('body').eq(0);
				var modalWindow = openedWindows.get(modalInstance).value;

				//clean up the stack
				openedWindows.remove(modalInstance);

				//remove window DOM element
				removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function () {
					modalWindow.modalScope.$destroy();
					body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
					checkRemoveBackdrop();
				});
			}

			function checkRemoveBackdrop() {
				//remove backdrop if no longer needed
				if (backdropDomEl && backdropIndex() == -1) {
					var backdropScopeRef = backdropScope;
					removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
						backdropScopeRef.$destroy();
						backdropScopeRef = null;
					});
					backdropDomEl = undefined;
					backdropScope = undefined;
				}
			}

			function removeAfterAnimate(domEl, scope, emulateTime, done) {
				// Closing animation
				scope.animate = false;

				var transitionEndEventName = $transition.transitionEndEventName;
				if (transitionEndEventName) {
					// transition out
					var timeout = $timeout(afterAnimating, emulateTime);

					domEl.bind(transitionEndEventName, function () {
						$timeout.cancel(timeout);
						afterAnimating();
						scope.$apply();
					});
				} else {
					// Ensure this call is async
					$timeout(afterAnimating);
				}

				function afterAnimating() {
					if (afterAnimating.done) {
						return;
					}
					afterAnimating.done = true;

					domEl.remove();
					if (done) {
						done();
					}
				}
			}

			$document.bind('keydown', function (evt) {
				var modal;

				if (evt.which === 27) {
					modal = openedWindows.top();
					if (modal && modal.value.keyboard) {
						evt.preventDefault();
						$rootScope.$apply(function () {
							$modalStack.dismiss(modal.key, 'escape key press');
						});
					}
				}
			});

			$modalStack.open = function (modalInstance, modal) {

				openedWindows.add(modalInstance, {
					deferred: modal.deferred,
					modalScope: modal.scope,
					backdrop: modal.backdrop,
					keyboard: modal.keyboard
				});

				var body = $document.find('body').eq(0),
					currBackdropIndex = backdropIndex();

				if (currBackdropIndex >= 0 && !backdropDomEl) {
					backdropScope = $rootScope.$new(true);
					backdropScope.index = currBackdropIndex;
					var angularBackgroundDomEl = angular.element('<div modal-backdrop></div>');
					angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
					backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
					body.append(backdropDomEl);
				}

				var angularDomEl = angular.element('<div modal-window></div>');
				angularDomEl.attr({
					'template-url': modal.windowTemplateUrl,
					'window-class': modal.windowClass,
					'size': modal.size,
					'index': openedWindows.length() - 1,
					'animate': 'animate'
				}).html(modal.content);

				var modalDomEl = $compile(angularDomEl)(modal.scope);
				openedWindows.top().value.modalDomEl = modalDomEl;
				body.append(modalDomEl);
				body.addClass(OPENED_MODAL_CLASS);
			};

			$modalStack.close = function (modalInstance, result) {
				var modalWindow = openedWindows.get(modalInstance);
				if (modalWindow) {
					modalWindow.value.deferred.resolve(result);
					removeModalWindow(modalInstance);
				}
			};

			$modalStack.dismiss = function (modalInstance, reason) {
				var modalWindow = openedWindows.get(modalInstance);
				if (modalWindow) {
					modalWindow.value.deferred.reject(reason);
					removeModalWindow(modalInstance);
				}
			};

			$modalStack.dismissAll = function (reason) {
				var topModal = this.getTop();
				while (topModal) {
					this.dismiss(topModal.key, reason);
					topModal = this.getTop();
				}
			};

			$modalStack.getTop = function () {
				return openedWindows.top();
			};

			return $modalStack;
		}])

	.provider('$modal', function () {

		var $modalProvider = {
			options: {
				backdrop: true, //can be also false or 'static'
				keyboard: true
			},
			$get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
				function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

					var $modal = {};

					function getTemplatePromise(options) {
						return options.template ? $q.when(options.template) :
							$http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
								{cache: $templateCache}).then(function (result) {
								return result.data;
							});
					}

					function getResolvePromises(resolves) {
						var promisesArr = [];
						angular.forEach(resolves, function (value) {
							if (angular.isFunction(value) || angular.isArray(value)) {
								promisesArr.push($q.when($injector.invoke(value)));
							}
						});
						return promisesArr;
					}

					$modal.open = function (modalOptions) {

						var modalResultDeferred = $q.defer();
						var modalOpenedDeferred = $q.defer();

						//prepare an instance of a modal to be injected into controllers and returned to a caller
						var modalInstance = {
							result: modalResultDeferred.promise,
							opened: modalOpenedDeferred.promise,
							close: function (result) {
								$modalStack.close(modalInstance, result);
							},
							dismiss: function (reason) {
								$modalStack.dismiss(modalInstance, reason);
							}
						};

						//merge and clean up options
						modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
						modalOptions.resolve = modalOptions.resolve || {};

						//verify options
						if (!modalOptions.template && !modalOptions.templateUrl) {
							throw new Error('One of template or templateUrl options is required.');
						}

						var templateAndResolvePromise =
							$q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


						templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

							var modalScope = (modalOptions.scope || $rootScope).$new();
							modalScope.$close = modalInstance.close;
							modalScope.$dismiss = modalInstance.dismiss;

							var ctrlInstance, ctrlLocals = {};
							var resolveIter = 1;

							//controllers
							if (modalOptions.controller) {
								ctrlLocals.$scope = modalScope;
								ctrlLocals.$modalInstance = modalInstance;
								angular.forEach(modalOptions.resolve, function (value, key) {
									ctrlLocals[key] = tplAndVars[resolveIter++];
								});

								ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
								if (modalOptions.controllerAs) {
									modalScope[modalOptions.controllerAs] = ctrlInstance;
								}
							}

							$modalStack.open(modalInstance, {
								scope: modalScope,
								deferred: modalResultDeferred,
								content: tplAndVars[0],
								backdrop: modalOptions.backdrop,
								keyboard: modalOptions.keyboard,
								backdropClass: modalOptions.backdropClass,
								windowClass: modalOptions.windowClass,
								windowTemplateUrl: modalOptions.windowTemplateUrl,
								size: modalOptions.size
							});

						}, function resolveError(reason) {
							modalResultDeferred.reject(reason);
						});

						templateAndResolvePromise.then(function () {
							modalOpenedDeferred.resolve(true);
						}, function () {
							modalOpenedDeferred.reject(false);
						});

						return modalInstance;
					};

					return $modal;
				}]
		};

		return $modalProvider;
	});

angular.module('ui.bootstrap.pagination', [])

	.controller('PaginationController', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
		var self = this,
			ngModelCtrl = {$setViewValue: angular.noop}, // nullModelCtrl
			setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

		this.init = function (ngModelCtrl_, config) {
			ngModelCtrl = ngModelCtrl_;
			this.config = config;

			ngModelCtrl.$render = function () {
				self.render();
			};

			if ($attrs.itemsPerPage) {
				$scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
					self.itemsPerPage = parseInt(value, 10);
					$scope.totalPages = self.calculateTotalPages();
				});
			} else {
				this.itemsPerPage = config.itemsPerPage;
			}
		};

		this.calculateTotalPages = function () {
			var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
			return Math.max(totalPages || 0, 1);
		};

		this.render = function () {
			$scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
		};

		$scope.selectPage = function (page) {
			if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
				ngModelCtrl.$setViewValue(page);
				ngModelCtrl.$render();
			}
		};

		$scope.getText = function (key) {
			return $scope[key + 'Text'] || self.config[key + 'Text'];
		};
		$scope.noPrevious = function () {
			return $scope.page === 1;
		};
		$scope.noNext = function () {
			return $scope.page === $scope.totalPages;
		};

		$scope.$watch('totalItems', function () {
			$scope.totalPages = self.calculateTotalPages();
		});

		$scope.$watch('totalPages', function (value) {
			setNumPages($scope.$parent, value); // Readonly variable

			if ($scope.page > value) {
				$scope.selectPage(value);
			} else {
				ngModelCtrl.$render();
			}
		});
	}])

	.constant('paginationConfig', {
		itemsPerPage: 10,
		boundaryLinks: false,
		directionLinks: true,
		firstText: 'First',
		previousText: 'Previous',
		nextText: 'Next',
		lastText: 'Last',
		rotate: true
	})

	.directive('pagination', ['$parse', 'paginationConfig', function ($parse, paginationConfig) {
		return {
			restrict: 'EA',
			scope: {
				totalItems: '=',
				firstText: '@',
				previousText: '@',
				nextText: '@',
				lastText: '@'
			},
			require: ['pagination', '?ngModel'],
			controller: 'PaginationController',
			templateUrl: 'lib/template/pagination/pagination.html',
			replace: true,
			link: function (scope, element, attrs, ctrls) {
				var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

				if (!ngModelCtrl) {
					return; // do nothing if no ng-model
				}

				// Setup configuration parameters
				var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
					rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
				scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
				scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

				paginationCtrl.init(ngModelCtrl, paginationConfig);

				if (attrs.maxSize) {
					scope.$parent.$watch($parse(attrs.maxSize), function (value) {
						maxSize = parseInt(value, 10);
						paginationCtrl.render();
					});
				}

				// Create page object used in template
				function makePage(number, text, isActive) {
					return {
						number: number,
						text: text,
						active: isActive
					};
				}

				function getPages(currentPage, totalPages) {
					var pages = [];

					// Default page limits
					var startPage = 1, endPage = totalPages;
					var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

					// recompute if maxSize
					if (isMaxSized) {
						if (rotate) {
							// Current page is displayed in the middle of the visible ones
							startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
							endPage = startPage + maxSize - 1;

							// Adjust if limit is exceeded
							if (endPage > totalPages) {
								endPage = totalPages;
								startPage = endPage - maxSize + 1;
							}
						} else {
							// Visible pages are paginated with maxSize
							startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

							// Adjust last page if limit is exceeded
							endPage = Math.min(startPage + maxSize - 1, totalPages);
						}
					}

					// Add page number links
					for (var number = startPage; number <= endPage; number++) {
						var page = makePage(number, number, number === currentPage);
						pages.push(page);
					}

					// Add links to move between page sets
					if (isMaxSized && !rotate) {
						if (startPage > 1) {
							var previousPageSet = makePage(startPage - 1, '...', false);
							pages.unshift(previousPageSet);
						}

						if (endPage < totalPages) {
							var nextPageSet = makePage(endPage + 1, '...', false);
							pages.push(nextPageSet);
						}
					}

					return pages;
				}

				var originalRender = paginationCtrl.render;
				paginationCtrl.render = function () {
					originalRender();
					if (scope.page > 0 && scope.page <= scope.totalPages) {
						scope.pages = getPages(scope.page, scope.totalPages);
					}
				};
			}
		};
	}])

	.constant('pagerConfig', {
		itemsPerPage: 10,
		previousText: '« Previous',
		nextText: 'Next »',
		align: true
	})

	.directive('pager', ['pagerConfig', function (pagerConfig) {
		return {
			restrict: 'EA',
			scope: {
				totalItems: '=',
				previousText: '@',
				nextText: '@'
			},
			require: ['pager', '?ngModel'],
			controller: 'PaginationController',
			templateUrl: 'lib/template/pagination/pager.html',
			replace: true,
			link: function (scope, element, attrs, ctrls) {
				var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

				if (!ngModelCtrl) {
					return; // do nothing if no ng-model
				}

				scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
				paginationCtrl.init(ngModelCtrl, pagerConfig);
			}
		};
	}]);

/**
 * The following features are still outstanding: animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html tooltips, and selector delegation.
 */
angular.module('ui.bootstrap.tooltip', ['ui.bootstrap.position', 'ui.bootstrap.bindHtml'])

	/**
	 * The $tooltip service creates tooltip- and popover-like directives as well as
	 * houses global options for them.
	 */
	.provider('$tooltip', function () {
		// The default options tooltip and popover.
		var defaultOptions = {
			placement: 'top',
			animation: true,
			popupDelay: 0
		};

		// Default hide triggers for each show trigger
		var triggerMap = {
			'mouseenter': 'mouseleave',
			'click': 'click',
			'focus': 'blur'
		};

		// The options specified to the provider globally.
		var globalOptions = {};

		/**
		 * `options({})` allows global configuration of all tooltips in the
		 * application.
		 *
		 *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
		 */
		this.options = function (value) {
			angular.extend(globalOptions, value);
		};

		/**
		 * This allows you to extend the set of trigger mappings available. E.g.:
		 *
		 *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
		 */
		this.setTriggers = function setTriggers(triggers) {
			angular.extend(triggerMap, triggers);
		};

		/**
		 * This is a helper function for translating camel-case to snake-case.
		 */
		function snake_case(name) {
			var regexp = /[A-Z]/g;
			var separator = '-';
			return name.replace(regexp, function (letter, pos) {
				return (pos ? separator : '') + letter.toLowerCase();
			});
		}

		/**
		 * Returns the actual instance of the $tooltip service.
		 * TODO support multiple triggers
		 */
		this.$get = ['$window', '$compile', '$timeout', '$document', '$position', '$interpolate', function ($window, $compile, $timeout, $document, $position, $interpolate) {
			return function $tooltip(type, prefix, defaultTriggerShow) {
				var options = angular.extend({}, defaultOptions, globalOptions);

				/**
				 * Returns an object of show and hide triggers.
				 *
				 * If a trigger is supplied,
				 * it is used to show the tooltip; otherwise, it will use the `trigger`
				 * option passed to the `$tooltipProvider.options` method; else it will
				 * default to the trigger supplied to this directive factory.
				 *
				 * The hide trigger is based on the show trigger. If the `trigger` option
				 * was passed to the `$tooltipProvider.options` method, it will use the
				 * mapped trigger from `triggerMap` or the passed trigger if the map is
				 * undefined; otherwise, it uses the `triggerMap` value of the show
				 * trigger; else it will just use the show trigger.
				 */
				function getTriggers(trigger) {
					var show = trigger || options.trigger || defaultTriggerShow;
					var hide = triggerMap[show] || show;
					return {
						show: show,
						hide: hide
					};
				}

				var directiveName = snake_case(type);

				var startSym = $interpolate.startSymbol();
				var endSym = $interpolate.endSymbol();
				var template =
					'<div ' + directiveName + '-popup ' +
					'title="' + startSym + 'title' + endSym + '" ' +
					'content="' + startSym + 'content' + endSym + '" ' +
					'placement="' + startSym + 'placement' + endSym + '" ' +
					'animation="animation" ' +
					'is-open="isOpen"' +
					'>' +
					'</div>';

				return {
					restrict: 'EA',
					compile: function (tElem, tAttrs) {
						var tooltipLinker = $compile(template);

						return function link(scope, element, attrs) {
							var tooltip;
							var tooltipLinkedScope;
							var transitionTimeout;
							var popupTimeout;
							var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
							var triggers = getTriggers(undefined);
							var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);
							var ttScope = scope.$new(true);

							var positionTooltip = function () {

								var ttPosition = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
								ttPosition.top += 'px';
								ttPosition.left += 'px';

								// Now set the calculated positioning.
								tooltip.css(ttPosition);
							};

							// By default, the tooltip is not open.
							// TODO add ability to start tooltip opened
							ttScope.isOpen = false;

							function toggleTooltipBind() {
								if (!ttScope.isOpen) {
									showTooltipBind();
								} else {
									hideTooltipBind();
								}
							}

							// Show the tooltip with delay if specified, otherwise show it immediately
							function showTooltipBind() {
								if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
									return;
								}

								prepareTooltip();

								if (ttScope.popupDelay) {
									// Do nothing if the tooltip was already scheduled to pop-up.
									// This happens if show is triggered multiple times before any hide is triggered.
									if (!popupTimeout) {
										popupTimeout = $timeout(show, ttScope.popupDelay, false);
										popupTimeout.then(function (reposition) {
											reposition();
										});
									}
								} else {
									show()();
								}
							}

							function hideTooltipBind() {
								scope.$apply(function () {
									hide();
								});
							}

							// Show the tooltip popup element.
							function show() {

								popupTimeout = null;

								// If there is a pending remove transition, we must cancel it, lest the
								// tooltip be mysteriously removed.
								if (transitionTimeout) {
									$timeout.cancel(transitionTimeout);
									transitionTimeout = null;
								}

								// Don't show empty tooltips.
								if (!ttScope.content) {
									return angular.noop;
								}

								createTooltip();

								// Set the initial positioning.
								tooltip.css({top: 0, left: 0, display: 'block'});
								ttScope.$digest();

								positionTooltip();

								// And show the tooltip.
								ttScope.isOpen = true;
								ttScope.$digest(); // digest required as $apply is not called

								// Return positioning function as promise callback for correct
								// positioning after draw.
								return positionTooltip;
							}

							// Hide the tooltip popup element.
							function hide() {
								// First things first: we don't show it anymore.
								ttScope.isOpen = false;

								//if tooltip is going to be shown after delay, we must cancel this
								$timeout.cancel(popupTimeout);
								popupTimeout = null;

								// And now we remove it from the DOM. However, if we have animation, we
								// need to wait for it to expire beforehand.
								// FIXME: this is a placeholder for a port of the transitions library.
								if (ttScope.animation) {
									if (!transitionTimeout) {
										transitionTimeout = $timeout(removeTooltip, 500);
									}
								} else {
									removeTooltip();
								}
							}

							function createTooltip() {
								// There can only be one tooltip element per directive shown at once.
								if (tooltip) {
									removeTooltip();
								}
								tooltipLinkedScope = ttScope.$new();
								tooltip = tooltipLinker(tooltipLinkedScope, function (tooltip) {
									if (appendToBody) {
										$document.find('body').append(tooltip);
									} else {
										element.after(tooltip);
									}
								});
							}

							function removeTooltip() {
								transitionTimeout = null;
								if (tooltip) {
									tooltip.remove();
									tooltip = null;
								}
								if (tooltipLinkedScope) {
									tooltipLinkedScope.$destroy();
									tooltipLinkedScope = null;
								}
							}

							function prepareTooltip() {
								prepPlacement();
								prepPopupDelay();
							}

							/**
							 * Observe the relevant attributes.
							 */
							attrs.$observe(type, function (val) {
								ttScope.content = val;

								if (!val && ttScope.isOpen) {
									hide();
								}
							});

							attrs.$observe(prefix + 'Title', function (val) {
								ttScope.title = val;
							});

							function prepPlacement() {
								var val = attrs[prefix + 'Placement'];
								ttScope.placement = angular.isDefined(val) ? val : options.placement;
							}

							function prepPopupDelay() {
								var val = attrs[prefix + 'PopupDelay'];
								var delay = parseInt(val, 10);
								ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
							}

							var unregisterTriggers = function () {
								element.unbind(triggers.show, showTooltipBind);
								element.unbind(triggers.hide, hideTooltipBind);
							};

							function prepTriggers() {
								var val = attrs[prefix + 'Trigger'];
								unregisterTriggers();

								triggers = getTriggers(val);

								if (triggers.show === triggers.hide) {
									element.bind(triggers.show, toggleTooltipBind);
								} else {
									element.bind(triggers.show, showTooltipBind);
									element.bind(triggers.hide, hideTooltipBind);
								}
							}

							prepTriggers();

							var animation = scope.$eval(attrs[prefix + 'Animation']);
							ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

							var appendToBodyVal = scope.$eval(attrs[prefix + 'AppendToBody']);
							appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;

							// if a tooltip is attached to <body> we need to remove it on
							// location change as its parent scope will probably not be destroyed
							// by the change.
							if (appendToBody) {
								scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess() {
									if (ttScope.isOpen) {
										hide();
									}
								});
							}

							// Make sure tooltip is destroyed and removed.
							scope.$on('$destroy', function onDestroyTooltip() {
								$timeout.cancel(transitionTimeout);
								$timeout.cancel(popupTimeout);
								unregisterTriggers();
								removeTooltip();
								ttScope = null;
							});
						};
					}
				};
			};
		}];
	})

	.directive('tooltipPopup', function () {
		return {
			restrict: 'EA',
			replace: true,
			scope: {content: '@', placement: '@', animation: '&', isOpen: '&'},
			templateUrl: 'lib/template/tooltip/tooltip-popup.html'
		};
	})

	.directive('tooltip', ['$tooltip', function ($tooltip) {
		return $tooltip('tooltip', 'tooltip', 'mouseenter');
	}])

	.directive('tooltipHtmlUnsafePopup', function () {
		return {
			restrict: 'EA',
			replace: true,
			scope: {content: '@', placement: '@', animation: '&', isOpen: '&'},
			templateUrl: 'lib/template/tooltip/tooltip-html-unsafe-popup.html'
		};
	})

	.directive('tooltipHtmlUnsafe', ['$tooltip', function ($tooltip) {
		return $tooltip('tooltipHtmlUnsafe', 'tooltip', 'mouseenter');
	}]);

/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html popovers, and selector delegatation.
 */
angular.module('ui.bootstrap.popover', ['ui.bootstrap.tooltip'])

	.directive('popoverPopup', function () {
		return {
			restrict: 'EA',
			replace: true,
			scope: {title: '@', content: '@', placement: '@', animation: '&', isOpen: '&'},
			templateUrl: 'lib/template/popover/popover.html'
		};
	})

	.directive('popover', ['$tooltip', function ($tooltip) {
		return $tooltip('popover', 'popover', 'click');
	}]);

angular.module('ui.bootstrap.progressbar', [])

	.constant('progressConfig', {
		animate: true,
		max: 100
	})

	.controller('ProgressController', ['$scope', '$attrs', 'progressConfig', function ($scope, $attrs, progressConfig) {
		var self = this,
			animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

		this.bars = [];
		$scope.max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : progressConfig.max;

		this.addBar = function (bar, element) {
			if (!animate) {
				element.css({'transition': 'none'});
			}

			this.bars.push(bar);

			bar.$watch('value', function (value) {
				bar.percent = +(100 * value / $scope.max).toFixed(2);
			});

			bar.$on('$destroy', function () {
				element = null;
				self.removeBar(bar);
			});
		};

		this.removeBar = function (bar) {
			this.bars.splice(this.bars.indexOf(bar), 1);
		};
	}])

	.directive('progress', function () {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			controller: 'ProgressController',
			require: 'progress',
			scope: {},
			templateUrl: 'lib/template/progressbar/progress.html'
		};
	})

	.directive('bar', function () {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			require: '^progress',
			scope: {
				value: '=',
				type: '@'
			},
			templateUrl: 'lib/template/progressbar/bar.html',
			link: function (scope, element, attrs, progressCtrl) {
				progressCtrl.addBar(scope, element);
			}
		};
	})

	.directive('progressbar', function () {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			controller: 'ProgressController',
			scope: {
				value: '=',
				type: '@'
			},
			templateUrl: 'lib/template/progressbar/progressbar.html',
			link: function (scope, element, attrs, progressCtrl) {
				progressCtrl.addBar(scope, angular.element(element.children()[0]));
			}
		};
	});
angular.module('ui.bootstrap.rating', [])

	.constant('ratingConfig', {
		max: 5,
		stateOn: null,
		stateOff: null
	})

	.controller('RatingController', ['$scope', '$attrs', 'ratingConfig', function ($scope, $attrs, ratingConfig) {
		var ngModelCtrl = {$setViewValue: angular.noop};

		this.init = function (ngModelCtrl_) {
			ngModelCtrl = ngModelCtrl_;
			ngModelCtrl.$render = this.render;

			this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
			this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;

			var ratingStates = angular.isDefined($attrs.ratingStates) ? $scope.$parent.$eval($attrs.ratingStates) :
				new Array(angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max);
			$scope.range = this.buildTemplateObjects(ratingStates);
		};

		this.buildTemplateObjects = function (states) {
			for (var i = 0, n = states.length; i < n; i++) {
				states[i] = angular.extend({index: i}, {stateOn: this.stateOn, stateOff: this.stateOff}, states[i]);
			}
			return states;
		};

		$scope.rate = function (value) {
			if (!$scope.readonly && value >= 0 && value <= $scope.range.length) {
				ngModelCtrl.$setViewValue(value);
				ngModelCtrl.$render();
			}
		};

		$scope.enter = function (value) {
			if (!$scope.readonly) {
				$scope.value = value;
			}
			$scope.onHover({value: value});
		};

		$scope.reset = function () {
			$scope.value = ngModelCtrl.$viewValue;
			$scope.onLeave();
		};

		$scope.onKeydown = function (evt) {
			if (/(37|38|39|40)/.test(evt.which)) {
				evt.preventDefault();
				evt.stopPropagation();
				$scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1));
			}
		};

		this.render = function () {
			$scope.value = ngModelCtrl.$viewValue;
		};
	}])

	.directive('rating', function () {
		return {
			restrict: 'EA',
			require: ['rating', 'ngModel'],
			scope: {
				readonly: '=?',
				onHover: '&',
				onLeave: '&'
			},
			controller: 'RatingController',
			templateUrl: 'lib/template/rating/rating.html',
			replace: true,
			link: function (scope, element, attrs, ctrls) {
				var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];

				if (ngModelCtrl) {
					ratingCtrl.init(ngModelCtrl);
				}
			}
		};
	});

/**
 * @ngdoc overview
 * @name ui.bootstrap.tabs
 *
 * @description
 * AngularJS version of the tabs directive.
 */

angular.module('ui.bootstrap.tabs', [])

	.controller('TabsetController', ['$scope', function TabsetCtrl($scope) {
		var ctrl = this,
			tabs = ctrl.tabs = $scope.tabs = [];

		ctrl.select = function (selectedTab) {
			angular.forEach(tabs, function (tab) {
				if (tab.active && tab !== selectedTab) {
					tab.active = false;
					tab.onDeselect();
				}
			});
			selectedTab.active = true;
			selectedTab.onSelect();
		};

		ctrl.addTab = function addTab(tab) {
			tabs.push(tab);
			// we can't run the select function on the first tab
			// since that would select it twice
			if (tabs.length === 1) {
				tab.active = true;
			} else if (tab.active) {
				ctrl.select(tab);
			}
		};

		ctrl.removeTab = function removeTab(tab) {
			var index = tabs.indexOf(tab);
			//Select a new tab if the tab to be removed is selected and not destroyed
			if (tab.active && tabs.length > 1 && !destroyed) {
				//If this is the last tab, select the previous tab. else, the next tab.
				var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
				ctrl.select(tabs[newActiveIndex]);
			}
			tabs.splice(index, 1);
		};

		var destroyed;
		$scope.$on('$destroy', function () {
			destroyed = true;
		});
	}])

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.tabs.directive:tabset
	 * @restrict EA
	 *
	 * @description
	 * Tabset is the outer container for the tabs directive
	 *
	 * @param {boolean=} vertical Whether or not to use vertical styling for the tabs.
	 * @param {boolean=} justified Whether or not to use justified styling for the tabs.
	 *
	 * @example
	 <example module="ui.bootstrap">
	 <file name="index.html">
	 <tabset>
	 <tab heading="Tab 1"><b>First</b> Content!</tab>
	 <tab heading="Tab 2"><i>Second</i> Content!</tab>
	 </tabset>
	 <hr />
	 <tabset vertical="true">
	 <tab heading="Vertical Tab 1"><b>First</b> Vertical Content!</tab>
	 <tab heading="Vertical Tab 2"><i>Second</i> Vertical Content!</tab>
	 </tabset>
	 <tabset justified="true">
	 <tab heading="Justified Tab 1"><b>First</b> Justified Content!</tab>
	 <tab heading="Justified Tab 2"><i>Second</i> Justified Content!</tab>
	 </tabset>
	 </file>
	 </example>
	 */
	.directive('tabset', function () {
		return {
			restrict: 'EA',
			transclude: true,
			replace: true,
			scope: {
				type: '@'
			},
			controller: 'TabsetController',
			templateUrl: 'lib/template/tabs/tabset.html',
			link: function (scope, element, attrs) {
				scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
				scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
			}
		};
	})

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.tabs.directive:tab
	 * @restrict EA
	 *
	 * @param {string=} heading The visible heading, or title, of the tab. Set HTML headings with {@link ui.bootstrap.tabs.directive:tabHeading tabHeading}.
	 * @param {string=} select An expression to evaluate when the tab is selected.
	 * @param {boolean=} active A binding, telling whether or not this tab is selected.
	 * @param {boolean=} disabled A binding, telling whether or not this tab is disabled.
	 *
	 * @description
	 * Creates a tab with a heading and content. Must be placed within a {@link ui.bootstrap.tabs.directive:tabset tabset}.
	 *
	 * @example
	 <example module="ui.bootstrap">
	 <file name="index.html">
	 <div ng-controller="TabsDemoCtrl">
	 <button class="btn btn-small" ng-click="items[0].active = true">
	 Select item 1, using active binding
	 </button>
	 <button class="btn btn-small" ng-click="items[1].disabled = !items[1].disabled">
	 Enable/disable item 2, using disabled binding
	 </button>
	 <br />
	 <tabset>
	 <tab heading="Tab 1">First Tab</tab>
	 <tab select="alertMe()">
	 <tab-heading><i class="icon-bell"></i> Alert me!</tab-heading>
	 Second Tab, with alert callback and html heading!
	 </tab>
	 <tab ng-repeat="item in items"
	 heading="{{item.title}}"
	 disabled="item.disabled"
	 active="item.active">
	 {{item.content}}
	 </tab>
	 </tabset>
	 </div>
	 </file>
	 <file name="script.js">
	 function TabsDemoCtrl($scope) {
      $scope.items = [
        { title:"Dynamic Title 1", content:"Dynamic Item 0" },
        { title:"Dynamic Title 2", content:"Dynamic Item 1", disabled: true }
      ];

      $scope.alertMe = function() {
        setTimeout(function() {
          alert("You've selected the alert tab!");
        });
      };
    };
	 </file>
	 </example>
	 */

	/**
	 * @ngdoc directive
	 * @name ui.bootstrap.tabs.directive:tabHeading
	 * @restrict EA
	 *
	 * @description
	 * Creates an HTML heading for a {@link ui.bootstrap.tabs.directive:tab tab}. Must be placed as a child of a tab element.
	 *
	 * @example
	 <example module="ui.bootstrap">
	 <file name="index.html">
	 <tabset>
	 <tab>
	 <tab-heading><b>HTML</b> in my titles?!</tab-heading>
	 And some content, too!
	 </tab>
	 <tab>
	 <tab-heading><i class="icon-heart"></i> Icon heading?!?</tab-heading>
	 That's right.
	 </tab>
	 </tabset>
	 </file>
	 </example>
	 */
	.directive('tab', ['$parse', function ($parse) {
		return {
			require: '^tabset',
			restrict: 'EA',
			replace: true,
			templateUrl: 'lib/template/tabs/tab.html',
			transclude: true,
			scope: {
				active: '=?',
				heading: '@',
				onSelect: '&select', //This callback is called in contentHeadingTransclude
				//once it inserts the tab's content into the dom
				onDeselect: '&deselect'
			},
			controller: function () {
				//Empty controller so other directives can require being 'under' a tab
			},
			compile: function (elm, attrs, transclude) {
				return function postLink(scope, elm, attrs, tabsetCtrl) {
					scope.$watch('active', function (active) {
						if (active) {
							tabsetCtrl.select(scope);
						}
					});

					scope.disabled = false;
					if (attrs.disabled) {
						scope.$parent.$watch($parse(attrs.disabled), function (value) {
							scope.disabled = !!value;
						});
					}

					scope.select = function () {
						if (!scope.disabled) {
							scope.active = true;
						}
					};

					tabsetCtrl.addTab(scope);
					scope.$on('$destroy', function () {
						tabsetCtrl.removeTab(scope);
					});

					//We need to transclude later, once the content container is ready.
					//when this link happens, we're inside a tab heading.
					scope.$transcludeFn = transclude;
				};
			}
		};
	}])

	.directive('tabHeadingTransclude', [function () {
		return {
			restrict: 'A',
			require: '^tab',
			link: function (scope, elm, attrs, tabCtrl) {
				scope.$watch('headingElement', function updateHeadingElement(heading) {
					if (heading) {
						elm.html('');
						elm.append(heading);
					}
				});
			}
		};
	}])

	.directive('tabContentTransclude', function () {
		return {
			restrict: 'A',
			require: '^tabset',
			link: function (scope, elm, attrs) {
				var tab = scope.$eval(attrs.tabContentTransclude);

				//Now our tab is ready to be transcluded: both the tab heading area
				//and the tab content area are loaded.  Transclude 'em both.
				tab.$transcludeFn(tab.$parent, function (contents) {
					angular.forEach(contents, function (node) {
						if (isTabHeading(node)) {
							//Let tabHeadingTransclude know.
							tab.headingElement = node;
						} else {
							elm.append(node);
						}
					});
				});
			}
		};
		function isTabHeading(node) {
			return node.tagName && (
					node.hasAttribute('tab-heading') ||
					node.hasAttribute('data-tab-heading') ||
					node.tagName.toLowerCase() === 'tab-heading' ||
					node.tagName.toLowerCase() === 'data-tab-heading'
				);
		}
	})

;

angular.module('ui.bootstrap.timepicker', [])

	.constant('timepickerConfig', {
		hourStep: 1,
		minuteStep: 1,
		showMeridian: true,
		meridians: null,
		readonlyInput: false,
		mousewheel: true
	})

	.controller('TimepickerController', ['$scope', '$attrs', '$parse', '$log', '$locale', 'timepickerConfig', function ($scope, $attrs, $parse, $log, $locale, timepickerConfig) {
		var selected = new Date(),
			ngModelCtrl = {$setViewValue: angular.noop}, // nullModelCtrl
			meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

		this.init = function (ngModelCtrl_, inputs) {
			ngModelCtrl = ngModelCtrl_;
			ngModelCtrl.$render = this.render;

			var hoursInputEl = inputs.eq(0),
				minutesInputEl = inputs.eq(1);

			var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;
			if (mousewheel) {
				this.setupMousewheelEvents(hoursInputEl, minutesInputEl);
			}

			$scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
			this.setupInputEvents(hoursInputEl, minutesInputEl);
		};

		var hourStep = timepickerConfig.hourStep;
		if ($attrs.hourStep) {
			$scope.$parent.$watch($parse($attrs.hourStep), function (value) {
				hourStep = parseInt(value, 10);
			});
		}

		var minuteStep = timepickerConfig.minuteStep;
		if ($attrs.minuteStep) {
			$scope.$parent.$watch($parse($attrs.minuteStep), function (value) {
				minuteStep = parseInt(value, 10);
			});
		}

		// 12H / 24H mode
		$scope.showMeridian = timepickerConfig.showMeridian;
		if ($attrs.showMeridian) {
			$scope.$parent.$watch($parse($attrs.showMeridian), function (value) {
				$scope.showMeridian = !!value;

				if (ngModelCtrl.$error.time) {
					// Evaluate from template
					var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
					if (angular.isDefined(hours) && angular.isDefined(minutes)) {
						selected.setHours(hours);
						refresh();
					}
				} else {
					updateTemplate();
				}
			});
		}

		// Get $scope.hours in 24H mode if valid
		function getHoursFromTemplate() {
			var hours = parseInt($scope.hours, 10);
			var valid = ( $scope.showMeridian ) ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
			if (!valid) {
				return undefined;
			}

			if ($scope.showMeridian) {
				if (hours === 12) {
					hours = 0;
				}
				if ($scope.meridian === meridians[1]) {
					hours = hours + 12;
				}
			}
			return hours;
		}

		function getMinutesFromTemplate() {
			var minutes = parseInt($scope.minutes, 10);
			return ( minutes >= 0 && minutes < 60 ) ? minutes : undefined;
		}

		function pad(value) {
			return ( angular.isDefined(value) && value.toString().length < 2 ) ? '0' + value : value;
		}

		// Respond on mousewheel spin
		this.setupMousewheelEvents = function (hoursInputEl, minutesInputEl) {
			var isScrollingUp = function (e) {
				if (e.originalEvent) {
					e = e.originalEvent;
				}
				//pick correct delta variable depending on event
				var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
				return (e.detail || delta > 0);
			};

			hoursInputEl.bind('mousewheel wheel', function (e) {
				$scope.$apply((isScrollingUp(e)) ? $scope.incrementHours() : $scope.decrementHours());
				e.preventDefault();
			});

			minutesInputEl.bind('mousewheel wheel', function (e) {
				$scope.$apply((isScrollingUp(e)) ? $scope.incrementMinutes() : $scope.decrementMinutes());
				e.preventDefault();
			});

		};

		this.setupInputEvents = function (hoursInputEl, minutesInputEl) {
			if ($scope.readonlyInput) {
				$scope.updateHours = angular.noop;
				$scope.updateMinutes = angular.noop;
				return;
			}

			var invalidate = function (invalidHours, invalidMinutes) {
				ngModelCtrl.$setViewValue(null);
				ngModelCtrl.$setValidity('time', false);
				if (angular.isDefined(invalidHours)) {
					$scope.invalidHours = invalidHours;
				}
				if (angular.isDefined(invalidMinutes)) {
					$scope.invalidMinutes = invalidMinutes;
				}
			};

			$scope.updateHours = function () {
				var hours = getHoursFromTemplate();

				if (angular.isDefined(hours)) {
					selected.setHours(hours);
					refresh('h');
				} else {
					invalidate(true);
				}
			};

			hoursInputEl.bind('blur', function (e) {
				if (!$scope.invalidHours && $scope.hours < 10) {
					$scope.$apply(function () {
						$scope.hours = pad($scope.hours);
					});
				}
			});

			$scope.updateMinutes = function () {
				var minutes = getMinutesFromTemplate();

				if (angular.isDefined(minutes)) {
					selected.setMinutes(minutes);
					refresh('m');
				} else {
					invalidate(undefined, true);
				}
			};

			minutesInputEl.bind('blur', function (e) {
				if (!$scope.invalidMinutes && $scope.minutes < 10) {
					$scope.$apply(function () {
						$scope.minutes = pad($scope.minutes);
					});
				}
			});

		};

		this.render = function () {
			var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;

			if (isNaN(date)) {
				ngModelCtrl.$setValidity('time', false);
				$log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
			} else {
				if (date) {
					selected = date;
				}
				makeValid();
				updateTemplate();
			}
		};

		// Call internally when we know that model is valid.
		function refresh(keyboardChange) {
			makeValid();
			ngModelCtrl.$setViewValue(new Date(selected));
			updateTemplate(keyboardChange);
		}

		function makeValid() {
			ngModelCtrl.$setValidity('time', true);
			$scope.invalidHours = false;
			$scope.invalidMinutes = false;
		}

		function updateTemplate(keyboardChange) {
			var hours = selected.getHours(), minutes = selected.getMinutes();

			if ($scope.showMeridian) {
				hours = ( hours === 0 || hours === 12 ) ? 12 : hours % 12; // Convert 24 to 12 hour system
			}

			$scope.hours = keyboardChange === 'h' ? hours : pad(hours);
			$scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
			$scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
		}

		function addMinutes(minutes) {
			var dt = new Date(selected.getTime() + minutes * 60000);
			selected.setHours(dt.getHours(), dt.getMinutes());
			refresh();
		}

		$scope.incrementHours = function () {
			addMinutes(hourStep * 60);
		};
		$scope.decrementHours = function () {
			addMinutes(-hourStep * 60);
		};
		$scope.incrementMinutes = function () {
			addMinutes(minuteStep);
		};
		$scope.decrementMinutes = function () {
			addMinutes(-minuteStep);
		};
		$scope.toggleMeridian = function () {
			addMinutes(12 * 60 * (( selected.getHours() < 12 ) ? 1 : -1));
		};
	}])

	.directive('timepicker', function () {
		return {
			restrict: 'EA',
			require: ['timepicker', '?^ngModel'],
			controller: 'TimepickerController',
			replace: true,
			scope: {},
			templateUrl: 'lib/template/timepicker/timepicker.html',
			link: function (scope, element, attrs, ctrls) {
				var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

				if (ngModelCtrl) {
					timepickerCtrl.init(ngModelCtrl, element.find('input'));
				}
			}
		};
	});

angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position', 'ui.bootstrap.bindHtml'])

	/**
	 * A helper service that can parse typeahead's syntax (string provided by users)
	 * Extracted to a separate service for ease of unit testing
	 */
	.factory('typeaheadParser', ['$parse', function ($parse) {

		//                      00000111000000000000022200000000000000003333333333333330000000000044000
		var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;

		return {
			parse: function (input) {

				var match = input.match(TYPEAHEAD_REGEXP);
				if (!match) {
					throw new Error(
						'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
						' but got "' + input + '".');
				}

				return {
					itemName: match[3],
					source: $parse(match[4]),
					viewMapper: $parse(match[2] || match[1]),
					modelMapper: $parse(match[1])
				};
			}
		};
	}])

	.directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$position', 'typeaheadParser',
		function ($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {

			var HOT_KEYS = [9, 13, 27, 38, 40];

			return {
				require: 'ngModel',
				link: function (originalScope, element, attrs, modelCtrl) {

					//SUPPORTED ATTRIBUTES (OPTIONS)

					//minimal no of characters that needs to be entered before typeahead kicks-in
					var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

					//minimal wait time after last character typed before typehead kicks-in
					var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

					//should it restrict model values to the ones selected from the popup only?
					var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

					//binding to a variable that indicates if matches are being retrieved asynchronously
					var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

					//a callback executed when a match is selected
					var onSelectCallback = $parse(attrs.typeaheadOnSelect);

					var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

					var appendToBody = attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

					var focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== false;

					//INTERNAL VARIABLES

					//model setter executed upon match selection
					var $setModelValue = $parse(attrs.ngModel).assign;

					//expressions used by typeahead
					var parserResult = typeaheadParser.parse(attrs.typeahead);

					var hasFocus;

					//create a child scope for the typeahead directive so we are not polluting original scope
					//with typeahead-specific data (matches, query etc.)
					var scope = originalScope.$new();
					originalScope.$on('$destroy', function () {
						scope.$destroy();
					});

					// WAI-ARIA
					var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
					element.attr({
						'aria-autocomplete': 'list',
						'aria-expanded': false,
						'aria-owns': popupId
					});

					//pop-up element used to display matches
					var popUpEl = angular.element('<div typeahead-popup></div>');
					popUpEl.attr({
						id: popupId,
						matches: 'matches',
						active: 'activeIdx',
						select: 'select(activeIdx)',
						query: 'query',
						position: 'position'
					});
					//custom item template
					if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
						popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
					}

					var resetMatches = function () {
						scope.matches = [];
						scope.activeIdx = -1;
						element.attr('aria-expanded', false);
					};

					var getMatchId = function (index) {
						return popupId + '-option-' + index;
					};

					// Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
					// This attribute is added or removed automatically when the `activeIdx` changes.
					scope.$watch('activeIdx', function (index) {
						if (index < 0) {
							element.removeAttr('aria-activedescendant');
						} else {
							element.attr('aria-activedescendant', getMatchId(index));
						}
					});

					var getMatchesAsync = function (inputValue) {

						var locals = {$viewValue: inputValue};
						isLoadingSetter(originalScope, true);
						$q.when(parserResult.source(originalScope, locals)).then(function (matches) {

							//it might happen that several async queries were in progress if a user were typing fast
							//but we are interested only in responses that correspond to the current view value
							var onCurrentRequest = (inputValue === modelCtrl.$viewValue);
							if (onCurrentRequest && hasFocus) {
								if (matches.length > 0) {

									scope.activeIdx = focusFirst ? 0 : -1;
									scope.matches.length = 0;

									//transform labels
									for (var i = 0; i < matches.length; i++) {
										locals[parserResult.itemName] = matches[i];
										scope.matches.push({
											id: getMatchId(i),
											label: parserResult.viewMapper(scope, locals),
											model: matches[i]
										});
									}

									scope.query = inputValue;
									//position pop-up with matches - we need to re-calculate its position each time we are opening a window
									//with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
									//due to other elements being rendered
									scope.position = appendToBody ? $position.offset(element) : $position.position(element);
									scope.position.top = scope.position.top + element.prop('offsetHeight');

									element.attr('aria-expanded', true);
								} else {
									resetMatches();
								}
							}
							if (onCurrentRequest) {
								isLoadingSetter(originalScope, false);
							}
						}, function () {
							resetMatches();
							isLoadingSetter(originalScope, false);
						});
					};

					resetMatches();

					//we need to propagate user's query so we can higlight matches
					scope.query = undefined;

					//Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
					var timeoutPromise;

					var scheduleSearchWithTimeout = function (inputValue) {
						timeoutPromise = $timeout(function () {
							getMatchesAsync(inputValue);
						}, waitTime);
					};

					var cancelPreviousTimeout = function () {
						if (timeoutPromise) {
							$timeout.cancel(timeoutPromise);
						}
					};

					//plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
					//$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
					modelCtrl.$parsers.unshift(function (inputValue) {

						hasFocus = true;

						if (inputValue && inputValue.length >= minSearch) {
							if (waitTime > 0) {
								cancelPreviousTimeout();
								scheduleSearchWithTimeout(inputValue);
							} else {
								getMatchesAsync(inputValue);
							}
						} else {
							isLoadingSetter(originalScope, false);
							cancelPreviousTimeout();
							resetMatches();
						}

						if (isEditable) {
							return inputValue;
						} else {
							if (!inputValue) {
								// Reset in case user had typed something previously.
								modelCtrl.$setValidity('editable', true);
								return inputValue;
							} else {
								modelCtrl.$setValidity('editable', false);
								return undefined;
							}
						}
					});

					modelCtrl.$formatters.push(function (modelValue) {

						var candidateViewValue, emptyViewValue;
						var locals = {};

						if (inputFormatter) {

							locals.$model = modelValue;
							return inputFormatter(originalScope, locals);

						} else {

							//it might happen that we don't have enough info to properly render input value
							//we need to check for this situation and simply return model value if we can't apply custom formatting
							locals[parserResult.itemName] = modelValue;
							candidateViewValue = parserResult.viewMapper(originalScope, locals);
							locals[parserResult.itemName] = undefined;
							emptyViewValue = parserResult.viewMapper(originalScope, locals);

							return candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue;
						}
					});

					scope.select = function (activeIdx) {
						//called from within the $digest() cycle
						var locals = {};
						var model, item;

						locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
						model = parserResult.modelMapper(originalScope, locals);
						$setModelValue(originalScope, model);
						modelCtrl.$setValidity('editable', true);

						onSelectCallback(originalScope, {
							$item: item,
							$model: model,
							$label: parserResult.viewMapper(originalScope, locals)
						});

						resetMatches();

						//return focus to the input element if a match was selected via a mouse click event
						// use timeout to avoid $rootScope:inprog error
						$timeout(function () {
							element[0].focus();
						}, 0, false);
					};

					//bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
					element.bind('keydown', function (evt) {

						//typeahead is open and an "interesting" key was pressed
						if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
							return;
						}

						// if there's nothing selected (i.e. focusFirst) and enter is hit, don't do anything
						if (scope.activeIdx == -1 && (evt.which === 13 || evt.which === 9)) {
							return;
						}

						evt.preventDefault();

						if (evt.which === 40) {
							scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
							scope.$digest();

						} else if (evt.which === 38) {
							scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1;
							scope.$digest();

						} else if (evt.which === 13 || evt.which === 9) {
							scope.$apply(function () {
								scope.select(scope.activeIdx);
							});

						} else if (evt.which === 27) {
							evt.stopPropagation();

							resetMatches();
							scope.$digest();
						}
					});

					element.bind('blur', function (evt) {
						hasFocus = false;
					});

					// Keep reference to click handler to unbind it.
					var dismissClickHandler = function (evt) {
						if (element[0] !== evt.target) {
							resetMatches();
							scope.$digest();
						}
					};

					$document.bind('click', dismissClickHandler);

					originalScope.$on('$destroy', function () {
						$document.unbind('click', dismissClickHandler);
						if (appendToBody) {
							$popup.remove();
						}
					});

					var $popup = $compile(popUpEl)(scope);
					if (appendToBody) {
						$document.find('body').append($popup);
					} else {
						element.after($popup);
					}
				}
			};

		}])

	.directive('typeaheadPopup', function () {
		return {
			restrict: 'EA',
			scope: {
				matches: '=',
				query: '=',
				active: '=',
				position: '=',
				select: '&'
			},
			replace: true,
			templateUrl: 'lib/template/typeahead/typeahead-popup.html',
			link: function (scope, element, attrs) {

				scope.templateUrl = attrs.templateUrl;

				scope.isOpen = function () {
					return scope.matches.length > 0;
				};

				scope.isActive = function (matchIdx) {
					return scope.active == matchIdx;
				};

				scope.selectActive = function (matchIdx) {
					scope.active = matchIdx;
				};

				scope.selectMatch = function (activeIdx) {
					scope.select({activeIdx: activeIdx});
				};
			}
		};
	})

	.directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
		return {
			restrict: 'EA',
			scope: {
				index: '=',
				match: '=',
				query: '='
			},
			link: function (scope, element, attrs) {
				var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'lib/template/typeahead/typeahead-match.html';
				$http.get(tplUrl, {cache: $templateCache}).success(function (tplContent) {
					element.replaceWith($compile(tplContent.trim())(scope));
				});
			}
		};
	}])

	.filter('typeaheadHighlight', function () {

		function escapeRegexp(queryToEscape) {
			return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
		}

		return function (matchItem, query) {
			return query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
		};
	});
;'use strict';

(function() {

    /**
     * @ngdoc overview
     * @name ngStorage
     */

    angular.module('ngStorage', []).

    /**
     * @ngdoc object
     * @name ngStorage.$localStorage
     * @requires $rootScope
     * @requires $window
     */

    factory('$localStorage', _storageFactory('localStorage')).

    /**
     * @ngdoc object
     * @name ngStorage.$sessionStorage
     * @requires $rootScope
     * @requires $window
     */

    factory('$sessionStorage', _storageFactory('sessionStorage'));

    function _storageFactory(storageType) {
        return [
            '$rootScope',
            '$window',

            function(
                $rootScope,
                $window
            ){
                // #9: Assign a placeholder object if Web Storage is unavailable to prevent breaking the entire AngularJS app
                var webStorage = $window[storageType] || (console.warn('This browser does not support Web Storage!'), {}),
                    $storage = {
                        $default: function(items) {
                            for (var k in items) {
                                angular.isDefined($storage[k]) || ($storage[k] = items[k]);
                            }

                            return $storage;
                        },
                        $reset: function(items) {
                            for (var k in $storage) {
                                '$' === k[0] || delete $storage[k];
                            }

                            return $storage.$default(items);
                        }
                    },
                    _last$storage,
                    _debounce;

                for (var i = 0, k; i < webStorage.length; i++) {
                    // #8, #10: `webStorage.key(i)` may be an empty string (or throw an exception in IE9 if `webStorage` is empty)
                    (k = webStorage.key(i)) && 'ngStorage-' === k.slice(0, 10) && ($storage[k.slice(10)] = angular.fromJson(webStorage.getItem(k)));
                }

                _last$storage = angular.copy($storage);

                $rootScope.$watch(function() {
                    _debounce || (_debounce = setTimeout(function() {
                        _debounce = null;

                        if (!angular.equals($storage, _last$storage)) {
                            angular.forEach($storage, function(v, k) {
                                angular.isDefined(v) && '$' !== k[0] && webStorage.setItem('ngStorage-' + k, angular.toJson(v));

                                delete _last$storage[k];
                            });

                            for (var k in _last$storage) {
                                webStorage.removeItem('ngStorage-' + k);
                            }

                            _last$storage = angular.copy($storage);
                        }
                    }, 100));
                });

                // #6: Use `$window.addEventListener` instead of `angular.element` to avoid the jQuery-specific `event.originalEvent`
                'localStorage' === storageType && $window.addEventListener && $window.addEventListener('storage', function(event) {
                    if ('ngStorage-' === event.key.slice(0, 10)) {
                        event.newValue ? $storage[event.key.slice(10)] = angular.fromJson(event.newValue) : delete $storage[event.key.slice(10)];

                        _last$storage = angular.copy($storage);

                        $rootScope.$apply();
                    }
                });

                return $storage;
            }
        ];
    }

})();
;/*!
 * ui-select
 * http://github.com/angular-ui/ui-select
 * Version: 0.8.3 - 2014-11-25T22:50:54.095Z
 * License: MIT
 */


(function () {
  "use strict";

  var KEY = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    BACKSPACE: 8,
    DELETE: 46,
    COMMAND: 91,

    MAP: { 91 : "COMMAND", 8 : "BACKSPACE" , 9 : "TAB" , 13 : "ENTER" , 16 : "SHIFT" , 17 : "CTRL" , 18 : "ALT" , 19 : "PAUSEBREAK" , 20 : "CAPSLOCK" , 27 : "ESC" , 32 : "SPACE" , 33 : "PAGE_UP", 34 : "PAGE_DOWN" , 35 : "END" , 36 : "HOME" , 37 : "LEFT" , 38 : "UP" , 39 : "RIGHT" , 40 : "DOWN" , 43 : "+" , 44 : "PRINTSCREEN" , 45 : "INSERT" , 46 : "DELETE", 48 : "0" , 49 : "1" , 50 : "2" , 51 : "3" , 52 : "4" , 53 : "5" , 54 : "6" , 55 : "7" , 56 : "8" , 57 : "9" , 59 : ";", 61 : "=" , 65 : "A" , 66 : "B" , 67 : "C" , 68 : "D" , 69 : "E" , 70 : "F" , 71 : "G" , 72 : "H" , 73 : "I" , 74 : "J" , 75 : "K" , 76 : "L", 77 : "M" , 78 : "N" , 79 : "O" , 80 : "P" , 81 : "Q" , 82 : "R" , 83 : "S" , 84 : "T" , 85 : "U" , 86 : "V" , 87 : "W" , 88 : "X" , 89 : "Y" , 90 : "Z", 96 : "0" , 97 : "1" , 98 : "2" , 99 : "3" , 100 : "4" , 101 : "5" , 102 : "6" , 103 : "7" , 104 : "8" , 105 : "9", 106 : "*" , 107 : "+" , 109 : "-" , 110 : "." , 111 : "/", 112 : "F1" , 113 : "F2" , 114 : "F3" , 115 : "F4" , 116 : "F5" , 117 : "F6" , 118 : "F7" , 119 : "F8" , 120 : "F9" , 121 : "F10" , 122 : "F11" , 123 : "F12", 144 : "NUMLOCK" , 145 : "SCROLLLOCK" , 186 : ";" , 187 : "=" , 188 : "SPACE" , 189 : "-" , 190 : "." , 191 : "/" , 192 : "`" , 219 : "[" , 220 : "\\" , 221 : "]" , 222 : "'"
    },

    isControl: function (e) {
        var k = e.which;
        switch (k) {
        case KEY.COMMAND:
        case KEY.SHIFT:
        case KEY.CTRL:
        case KEY.ALT:
            return true;
        }

        if (e.metaKey) return true;

        return false;
    },
    isFunctionKey: function (k) {
        k = k.which ? k.which : k;
        return k >= 112 && k <= 123;
    },
    isVerticalMovement: function (k){
      return ~[KEY.UP, KEY.DOWN].indexOf(k);
    },
    isHorizontalMovement: function (k){
      return ~[KEY.LEFT,KEY.RIGHT,KEY.BACKSPACE,KEY.DELETE].indexOf(k);
    }
  };

  /**
   * Add querySelectorAll() to jqLite.
   *
   * jqLite find() is limited to lookups by tag name.
   * TODO This will change with future versions of AngularJS, to be removed when this happens
   *
   * See jqLite.find - why not use querySelectorAll? https://github.com/angular/angular.js/issues/3586
   * See feat(jqLite): use querySelectorAll instead of getElementsByTagName in jqLite.find https://github.com/angular/angular.js/pull/3598
   */
  if (angular.element.prototype.querySelectorAll === undefined) {
    angular.element.prototype.querySelectorAll = function(selector) {
      return angular.element(this[0].querySelectorAll(selector));
    };
  }

  angular.module('ui.select', [])

  .constant('uiSelectConfig', {
    theme: 'bootstrap',
    searchEnabled: true,
    placeholder: '', // Empty by default, like HTML tag <select>
    refreshDelay: 1000, // In milliseconds
    closeOnSelect: true
  })

  // See Rename minErr and make it accessible from outside https://github.com/angular/angular.js/issues/6913
  .service('uiSelectMinErr', function() {
    var minErr = angular.$$minErr('ui.select');
    return function() {
      var error = minErr.apply(this, arguments);
      var message = error.message.replace(new RegExp('\nhttp://errors.angularjs.org/.*'), '');
      return new Error(message);
    };
  })

  /**
   * Parses "repeat" attribute.
   *
   * Taken from AngularJS ngRepeat source code
   * See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L211
   *
   * Original discussion about parsing "repeat" attribute instead of fully relying on ng-repeat:
   * https://github.com/angular-ui/ui-select/commit/5dd63ad#commitcomment-5504697
   */
  .service('RepeatParser', ['uiSelectMinErr','$parse', function(uiSelectMinErr, $parse) {
    var self = this;

    /**
     * Example:
     * expression = "address in addresses | filter: {street: $select.search} track by $index"
     * itemName = "address",
     * source = "addresses | filter: {street: $select.search}",
     * trackByExp = "$index",
     */
    self.parse = function(expression) {

      var match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?([\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

      if (!match) {
        throw uiSelectMinErr('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
                expression);
      }

      return {
        itemName: match[2], // (lhs) Left-hand side,
        source: $parse(match[3]),
        trackByExp: match[4],
        modelMapper: $parse(match[1] || match[2])
      };

    };

    self.getGroupNgRepeatExpression = function() {
      return '$group in $select.groups';
    };

    self.getNgRepeatExpression = function(itemName, source, trackByExp, grouped) {
      var expression = itemName + ' in ' + (grouped ? '$group.items' : source);
      if (trackByExp) {
        expression += ' track by ' + trackByExp;
      }
      return expression;
    };
  }])

  /**
   * Contains ui-select "intelligence".
   *
   * The goal is to limit dependency on the DOM whenever possible and
   * put as much logic in the controller (instead of the link functions) as possible so it can be easily tested.
   */
  .controller('uiSelectCtrl',
    ['$scope', '$element', '$timeout', '$filter', 'RepeatParser', 'uiSelectMinErr', 'uiSelectConfig',
    function($scope, $element, $timeout, $filter, RepeatParser, uiSelectMinErr, uiSelectConfig) {

    var ctrl = this;

    var EMPTY_SEARCH = '';

    ctrl.placeholder = undefined;
    ctrl.search = EMPTY_SEARCH;
    ctrl.activeIndex = 0;
    ctrl.activeMatchIndex = -1;
    ctrl.items = [];
    ctrl.selected = undefined;
    ctrl.open = false;
    ctrl.focus = false;
    ctrl.focusser = undefined; //Reference to input element used to handle focus events
    ctrl.disabled = undefined; // Initialized inside uiSelect directive link function
    ctrl.searchEnabled = undefined; // Initialized inside uiSelect directive link function
    ctrl.resetSearchInput = undefined; // Initialized inside uiSelect directive link function
    ctrl.refreshDelay = undefined; // Initialized inside uiSelectChoices directive link function
    ctrl.multiple = false; // Initialized inside uiSelect directive link function
    ctrl.disableChoiceExpression = undefined; // Initialized inside uiSelect directive link function
    ctrl.tagging = {isActivated: false, fct: undefined};
    ctrl.taggingTokens = {isActivated: false, tokens: undefined};
    ctrl.lockChoiceExpression = undefined; // Initialized inside uiSelect directive link function
    ctrl.closeOnSelect = true; // Initialized inside uiSelect directive link function
    ctrl.clickTriggeredSelect = false;
    ctrl.$filter = $filter;

    ctrl.isEmpty = function() {
      return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '';
    };

    var _searchInput = $element.querySelectorAll('input.ui-select-search');
    if (_searchInput.length !== 1) {
      throw uiSelectMinErr('searchInput', "Expected 1 input.ui-select-search but got '{0}'.", _searchInput.length);
    }

    // Most of the time the user does not want to empty the search input when in typeahead mode
    function _resetSearchInput() {
      if (ctrl.resetSearchInput || (ctrl.resetSearchInput === undefined && uiSelectConfig.resetSearchInput)) {
        ctrl.search = EMPTY_SEARCH;
        //reset activeIndex
        if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
          ctrl.activeIndex = ctrl.items.indexOf(ctrl.selected);
        }
      }
    }

    // When the user clicks on ui-select, displays the dropdown list
    ctrl.activate = function(initSearchValue, avoidReset) {
      if (!ctrl.disabled  && !ctrl.open) {
        if(!avoidReset) _resetSearchInput();
        ctrl.focusser.prop('disabled', true); //Will reactivate it on .close()
        ctrl.open = true;
        ctrl.activeMatchIndex = -1;

        ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex;

        // ensure that the index is set to zero for tagging variants
        // that where first option is auto-selected
        if ( ctrl.activeIndex === -1 && ctrl.taggingLabel !== false ) {
          ctrl.activeIndex = 0;
        }

        // Give it time to appear before focus
        $timeout(function() {
          ctrl.search = initSearchValue || ctrl.search;
          _searchInput[0].focus();
        });
      }
    };

    ctrl.findGroupByName = function(name) {
      return ctrl.groups && ctrl.groups.filter(function(group) {
        return group.name === name;
      })[0];
    };

    ctrl.parseRepeatAttr = function(repeatAttr, groupByExp) {
      function updateGroups(items) {
        ctrl.groups = [];
        angular.forEach(items, function(item) {
          var groupFn = $scope.$eval(groupByExp);
          var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
          var group = ctrl.findGroupByName(groupName);
          if(group) {
            group.items.push(item);
          }
          else {
            ctrl.groups.push({name: groupName, items: [item]});
          }
        });
        ctrl.items = [];
        ctrl.groups.forEach(function(group) {
          ctrl.items = ctrl.items.concat(group.items);
        });
      }

      function setPlainItems(items) {
        ctrl.items = items;
      }

      var setItemsFn = groupByExp ? updateGroups : setPlainItems;

      ctrl.parserResult = RepeatParser.parse(repeatAttr);

      ctrl.isGrouped = !!groupByExp;
      ctrl.itemProperty = ctrl.parserResult.itemName;

      // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259
      $scope.$watchCollection(ctrl.parserResult.source, function(items) {

        if (items === undefined || items === null) {
          // If the user specifies undefined or null => reset the collection
          // Special case: items can be undefined if the user did not initialized the collection on the scope
          // i.e $scope.addresses = [] is missing
          ctrl.items = [];
        } else {
          if (!angular.isArray(items)) {
            throw uiSelectMinErr('items', "Expected an array but got '{0}'.", items);
          } else {
            if (ctrl.multiple){
              //Remove already selected items (ex: while searching)
              var filteredItems = items.filter(function(i) {return ctrl.selected.indexOf(i) < 0;});
              setItemsFn(filteredItems);
            }else{
              setItemsFn(items);
            }
            ctrl.ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters

          }
        }

      });

      if (ctrl.multiple){
        //Remove already selected items
        $scope.$watchCollection('$select.selected', function(selectedItems){
          var data = ctrl.parserResult.source($scope);
          if (!selectedItems.length) {
            setItemsFn(data);
          }else{
            if ( data !== undefined ) {
              var filteredItems = data.filter(function(i) {return selectedItems.indexOf(i) < 0;});
              setItemsFn(filteredItems);
            }
          }
          ctrl.sizeSearchInput();
        });
      }

    };

    var _refreshDelayPromise;

    /**
     * Typeahead mode: lets the user refresh the collection using his own function.
     *
     * See Expose $select.search for external / remote filtering https://github.com/angular-ui/ui-select/pull/31
     */
    ctrl.refresh = function(refreshAttr) {
      if (refreshAttr !== undefined) {

        // Debounce
        // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
        // FYI AngularStrap typeahead does not have debouncing: https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
        if (_refreshDelayPromise) {
          $timeout.cancel(_refreshDelayPromise);
        }
        _refreshDelayPromise = $timeout(function() {
          $scope.$eval(refreshAttr);
        }, ctrl.refreshDelay);
      }
    };

    ctrl.setActiveItem = function(item) {
      ctrl.activeIndex = ctrl.items.indexOf(item);
    };

    ctrl.isActive = function(itemScope) {
      if ( !ctrl.open ) {
        return false;
      }
      var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
      var isActive =  itemIndex === ctrl.activeIndex;

      if ( !isActive || ( itemIndex < 0 && ctrl.taggingLabel !== false ) ||( itemIndex < 0 && ctrl.taggingLabel === false) ) {
        return false;
      }

      if (isActive && !angular.isUndefined(ctrl.onHighlightCallback)) {
        itemScope.$eval(ctrl.onHighlightCallback);
      }

      return isActive;
    };

    ctrl.isDisabled = function(itemScope) {

      if (!ctrl.open) return;

      var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
      var isDisabled = false;
      var item;

      if (itemIndex >= 0 && !angular.isUndefined(ctrl.disableChoiceExpression)) {
        item = ctrl.items[itemIndex];
        isDisabled = !!(itemScope.$eval(ctrl.disableChoiceExpression)); // force the boolean value
        item._uiSelectChoiceDisabled = isDisabled; // store this for later reference
      }

      return isDisabled;
    };


    // When the user selects an item with ENTER or clicks the dropdown
    ctrl.select = function(item, skipFocusser, $event) {
      if (item === undefined || !item._uiSelectChoiceDisabled) {

        if ( ! ctrl.items && ! ctrl.search ) return;

        if (!item || !item._uiSelectChoiceDisabled) {
          if(ctrl.tagging.isActivated) {
            // if taggingLabel is disabled, we pull from ctrl.search val
            if ( ctrl.taggingLabel === false ) {
              if ( ctrl.activeIndex < 0 ) {
                item = ctrl.tagging.fct !== undefined ? ctrl.tagging.fct(ctrl.search) : ctrl.search;
                if ( angular.equals( ctrl.items[0], item ) ) {
                  return;
                }
              } else {
                // keyboard nav happened first, user selected from dropdown
                item = ctrl.items[ctrl.activeIndex];
              }
            } else {
              // tagging always operates at index zero, taggingLabel === false pushes
              // the ctrl.search value without having it injected
              if ( ctrl.activeIndex === 0 ) {
                // ctrl.tagging pushes items to ctrl.items, so we only have empty val
                // for `item` if it is a detected duplicate
                if ( item === undefined ) return;
                // create new item on the fly
                item = ctrl.tagging.fct !== undefined ? ctrl.tagging.fct(ctrl.search) : item.replace(ctrl.taggingLabel,'');
              }
            }
            // search ctrl.selected for dupes potentially caused by tagging and return early if found
            if ( ctrl.selected && ctrl.selected.filter( function (selection) { return angular.equals(selection, item); }).length > 0 ) {
              ctrl.close(skipFocusser);
              return;
            }
          }

          var locals = {};
          locals[ctrl.parserResult.itemName] = item;

          ctrl.onSelectCallback($scope, {
              $item: item,
              $model: ctrl.parserResult.modelMapper($scope, locals)
          });

          if(ctrl.multiple) {
            ctrl.selected.push(item);
            ctrl.sizeSearchInput();
          } else {
            ctrl.selected = item;
          }
          if (!ctrl.multiple || ctrl.closeOnSelect) {
            ctrl.close(skipFocusser);
          }
          if ($event && $event.type === 'click') {
            ctrl.clickTriggeredSelect = true;
          }
        }
      }
    };

    // Closes the dropdown
    ctrl.close = function(skipFocusser) {
      if (!ctrl.open) return;
      _resetSearchInput();
      ctrl.open = false;
      if (!ctrl.multiple){
        $timeout(function(){
          ctrl.focusser.prop('disabled', false);
          if (!skipFocusser) ctrl.focusser[0].focus();
        },0,false);
      }
    };

    // Toggle dropdown
    ctrl.toggle = function(e) {
      if (ctrl.open) ctrl.close(); else ctrl.activate();
      e.preventDefault();
      e.stopPropagation();
    };

    ctrl.isLocked = function(itemScope, itemIndex) {
        var isLocked, item = ctrl.selected[itemIndex];

        if (item && !angular.isUndefined(ctrl.lockChoiceExpression)) {
            isLocked = !!(itemScope.$eval(ctrl.lockChoiceExpression)); // force the boolean value
            item._uiSelectChoiceLocked = isLocked; // store this for later reference
        }

        return isLocked;
    };

    // Remove item from multiple select
    ctrl.removeChoice = function(index){
      var removedChoice = ctrl.selected[index];

      // if the choice is locked, can't remove it
      if(removedChoice._uiSelectChoiceLocked) return;

      var locals = {};
      locals[ctrl.parserResult.itemName] = removedChoice;

      ctrl.selected.splice(index, 1);
      ctrl.activeMatchIndex = -1;
      ctrl.sizeSearchInput();

      ctrl.onRemoveCallback($scope, {
        $item: removedChoice,
        $model: ctrl.parserResult.modelMapper($scope, locals)
      });
    };

    ctrl.getPlaceholder = function(){
      //Refactor single?
      if(ctrl.multiple && ctrl.selected.length) return;
      return ctrl.placeholder;
    };

    var containerSizeWatch;
    ctrl.sizeSearchInput = function(){
      var input = _searchInput[0],
          container = _searchInput.parent().parent()[0];
      _searchInput.css('width','10px');
      var calculate = function(){
        var newWidth = container.clientWidth - input.offsetLeft - 10;
        if(newWidth < 50) newWidth = container.clientWidth;
        _searchInput.css('width',newWidth+'px');
      };
      $timeout(function(){ //Give tags time to render correctly
        if (container.clientWidth === 0 && !containerSizeWatch){
          containerSizeWatch = $scope.$watch(function(){ return container.clientWidth;}, function(newValue){
            if (newValue !== 0){
              calculate();
              containerSizeWatch();
              containerSizeWatch = null;
            }
          });
        }else if (!containerSizeWatch) {
          calculate();
        }
      }, 0, false);
    };

    function _handleDropDownSelection(key) {
      var processed = true;
      switch (key) {
        case KEY.DOWN:
          if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
          else if (ctrl.activeIndex < ctrl.items.length - 1) { ctrl.activeIndex++; }
          break;
        case KEY.UP:
          if (!ctrl.open && ctrl.multiple) ctrl.activate(false, true); //In case its the search input in 'multiple' mode
          else if (ctrl.activeIndex > 0 || (ctrl.search.length === 0 && ctrl.tagging.isActivated)) { ctrl.activeIndex--; }
          break;
        case KEY.TAB:
          if (!ctrl.multiple || ctrl.open) ctrl.select(ctrl.items[ctrl.activeIndex], true);
          break;
        case KEY.ENTER:
          if(ctrl.open){
            ctrl.select(ctrl.items[ctrl.activeIndex]);
          } else {
            ctrl.activate(false, true); //In case its the search input in 'multiple' mode
          }
          break;
        case KEY.ESC:
          ctrl.close();
          break;
        default:
          processed = false;
      }
      return processed;
    }

    // Handles selected options in "multiple" mode
    function _handleMatchSelection(key){
      var caretPosition = _getCaretPosition(_searchInput[0]),
          length = ctrl.selected.length,
          // none  = -1,
          first = 0,
          last  = length-1,
          curr  = ctrl.activeMatchIndex,
          next  = ctrl.activeMatchIndex+1,
          prev  = ctrl.activeMatchIndex-1,
          newIndex = curr;

      if(caretPosition > 0 || (ctrl.search.length && key == KEY.RIGHT)) return false;

      ctrl.close();

      function getNewActiveMatchIndex(){
        switch(key){
          case KEY.LEFT:
            // Select previous/first item
            if(~ctrl.activeMatchIndex) return prev;
            // Select last item
            else return last;
            break;
          case KEY.RIGHT:
            // Open drop-down
            if(!~ctrl.activeMatchIndex || curr === last){
              ctrl.activate();
              return false;
            }
            // Select next/last item
            else return next;
            break;
          case KEY.BACKSPACE:
            // Remove selected item and select previous/first
            if(~ctrl.activeMatchIndex){
              ctrl.removeChoice(curr);
              return prev;
            }
            // Select last item
            else return last;
            break;
          case KEY.DELETE:
            // Remove selected item and select next item
            if(~ctrl.activeMatchIndex){
              ctrl.removeChoice(ctrl.activeMatchIndex);
              return curr;
            }
            else return false;
        }
      }

      newIndex = getNewActiveMatchIndex();

      if(!ctrl.selected.length || newIndex === false) ctrl.activeMatchIndex = -1;
      else ctrl.activeMatchIndex = Math.min(last,Math.max(first,newIndex));

      return true;
    }

    // Bind to keyboard shortcuts
    _searchInput.on('keydown', function(e) {

      var key = e.which;

      // if(~[KEY.ESC,KEY.TAB].indexOf(key)){
      //   //TODO: SEGURO?
      //   ctrl.close();
      // }

      $scope.$apply(function() {
        var processed = false;

        if(ctrl.multiple && KEY.isHorizontalMovement(key)){
          processed = _handleMatchSelection(key);
        }

        if (!processed && (ctrl.items.length > 0 || ctrl.tagging.isActivated)) {
          processed = _handleDropDownSelection(key);
          if ( ctrl.taggingTokens.isActivated ) {
            for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
              if ( ctrl.taggingTokens.tokens[i] === KEY.MAP[e.keyCode] ) {
                // make sure there is a new value to push via tagging
                if ( ctrl.search.length > 0 ) {
                  ctrl.select(null, true);
                  _searchInput.triggerHandler('tagged');
                }
              }
            }
          }
        }

        if (processed  && key != KEY.TAB) {
          //TODO Check si el tab selecciona aun correctamente
          //Crear test
          e.preventDefault();
          e.stopPropagation();
        }
      });

      if(KEY.isVerticalMovement(key) && ctrl.items.length > 0){
        _ensureHighlightVisible();
      }

    });

    _searchInput.on('keyup', function(e) {
      if ( ! KEY.isVerticalMovement(e.which) ) {
        $scope.$evalAsync( function () {
          ctrl.activeIndex = ctrl.taggingLabel === false ? -1 : 0;
        });
      }
      // Push a "create new" item into array if there is a search string
      if ( ctrl.tagging.isActivated && ctrl.search.length > 0 ) {

        // return early with these keys
        if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || KEY.isVerticalMovement(e.which) ) {
          return;
        }
        // always reset the activeIndex to the first item when tagging
        ctrl.activeIndex = ctrl.taggingLabel === false ? -1 : 0;
        // taggingLabel === false bypasses all of this
        if (ctrl.taggingLabel === false) return;

        var items = angular.copy( ctrl.items );
        var stashArr = angular.copy( ctrl.items );
        var newItem;
        var item;
        var hasTag = false;
        var dupeIndex = -1;
        var tagItems;
        var tagItem;

        // case for object tagging via transform `ctrl.tagging.fct` function
        if ( ctrl.tagging.fct !== undefined) {
          tagItems = ctrl.$filter('filter')(items,{'isTag': true});
          if ( tagItems.length > 0 ) {
            tagItem = tagItems[0];
          }
          // remove the first element, if it has the `isTag` prop we generate a new one with each keyup, shaving the previous
          if ( items.length > 0 && tagItem ) {
            hasTag = true;
            items = items.slice(1,items.length);
            stashArr = stashArr.slice(1,stashArr.length);
          }
          newItem = ctrl.tagging.fct(ctrl.search);
          newItem.isTag = true;
          // verify the the tag doesn't match the value of an existing item
          if ( stashArr.filter( function (origItem) { return angular.equals( origItem, ctrl.tagging.fct(ctrl.search) ); } ).length > 0 ) {
            return;
          }
        // handle newItem string and stripping dupes in tagging string context
        } else {
          // find any tagging items already in the ctrl.items array and store them
          tagItems = ctrl.$filter('filter')(items,function (item) {
            return item.match(ctrl.taggingLabel);
          });
          if ( tagItems.length > 0 ) {
            tagItem = tagItems[0];
          }
          item = items[0];
          // remove existing tag item if found (should only ever be one tag item)
          if ( item !== undefined && items.length > 0 && tagItem ) {
            hasTag = true;
            items = items.slice(1,items.length);
            stashArr = stashArr.slice(1,stashArr.length);
          }
          newItem = ctrl.search+' '+ctrl.taggingLabel;
          if ( _findApproxDupe(ctrl.selected, ctrl.search) > -1 ) {
            return;
          }
          // verify the the tag doesn't match the value of an existing item from
          // the searched data set
          if ( stashArr.filter( function (origItem) { return origItem.toUpperCase() === ctrl.search.toUpperCase(); }).length > 0 ) {
            // if there is a tag from prev iteration, strip it / queue the change
            // and return early
            if ( hasTag ) {
              items = stashArr;
              $scope.$evalAsync( function () {
                ctrl.activeIndex = 0;
                ctrl.items = items;
              });
            }
            return;
          }
          if ( ctrl.selected.filter( function (selection) { return selection.toUpperCase() === ctrl.search.toUpperCase(); } ).length > 0 ) {
            // if there is a tag from prev iteration, strip it
            if ( hasTag ) {
              ctrl.items = stashArr.slice(1,stashArr.length);
            }
            return;
          }
        }
        if ( hasTag ) dupeIndex = _findApproxDupe(ctrl.selected, newItem);
        // dupe found, shave the first item
        if ( dupeIndex > -1 ) {
          items = items.slice(dupeIndex+1,items.length-1);
        } else {
          items = [];
          items.push(newItem);
          items = items.concat(stashArr);
        }
        $scope.$evalAsync( function () {
          ctrl.activeIndex = 0;
          ctrl.items = items;
        });
      }
    });

    _searchInput.on('tagged', function() {
      $timeout(function() {
        _resetSearchInput();
      });
    });

    _searchInput.on('blur', function() {
      $timeout(function() {
        ctrl.activeMatchIndex = -1;
      });
    });

    function _findApproxDupe(haystack, needle) {
      var tempArr = angular.copy(haystack);
      var dupeIndex = -1;
      for (var i = 0; i <tempArr.length; i++) {
        // handle the simple string version of tagging
        if ( ctrl.tagging.fct === undefined ) {
          // search the array for the match
          if ( tempArr[i]+' '+ctrl.taggingLabel === needle ) {
            dupeIndex = i;
          }
        // handle the object tagging implementation
        } else {
          var mockObj = tempArr[i];
          mockObj.isTag = true;
          if ( angular.equals(mockObj, needle) ) {
            dupeIndex = i;
          }
        }
      }
      return dupeIndex;
    }

    function _getCaretPosition(el) {
      if(angular.isNumber(el.selectionStart)) return el.selectionStart;
      // selectionStart is not supported in IE8 and we don't want hacky workarounds so we compromise
      else return el.value.length;
    }

    // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431
    function _ensureHighlightVisible() {
      var container = $element.querySelectorAll('.ui-select-choices-content');
      var choices = container.querySelectorAll('.ui-select-choices-row');
      if (choices.length < 1) {
        throw uiSelectMinErr('choices', "Expected multiple .ui-select-choices-row but got '{0}'.", choices.length);
      }

      var highlighted = choices[ctrl.activeIndex];
      var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
      var height = container[0].offsetHeight;

      if (posY > height) {
        container[0].scrollTop += posY - height;
      } else if (posY < highlighted.clientHeight) {
        if (ctrl.isGrouped && ctrl.activeIndex === 0)
          container[0].scrollTop = 0; //To make group header visible when going all the way up
        else
          container[0].scrollTop -= highlighted.clientHeight - posY;
      }
    }

    $scope.$on('$destroy', function() {
      _searchInput.off('keyup keydown tagged blur');
    });
  }])

  .directive('uiSelect',
    ['$document', 'uiSelectConfig', 'uiSelectMinErr', '$compile', '$parse',
    function($document, uiSelectConfig, uiSelectMinErr, $compile, $parse) {

    return {
      restrict: 'EA',
      templateUrl: function(tElement, tAttrs) {
        var theme = tAttrs.theme || uiSelectConfig.theme;
        return theme + (angular.isDefined(tAttrs.multiple) ? '/select-multiple.tpl.html' : '/select.tpl.html');
      },
      replace: true,
      transclude: true,
      require: ['uiSelect', 'ngModel'],
      scope: true,

      controller: 'uiSelectCtrl',
      controllerAs: '$select',

      link: function(scope, element, attrs, ctrls, transcludeFn) {
        var $select = ctrls[0];
        var ngModel = ctrls[1];

        var searchInput = element.querySelectorAll('input.ui-select-search');

        $select.multiple = angular.isDefined(attrs.multiple) && (
            attrs.multiple === '' ||
            attrs.multiple.toLowerCase() === 'multiple' ||
            attrs.multiple.toLowerCase() === 'true'
        );

        $select.closeOnSelect = (angular.isDefined(attrs.closeOnSelect) && attrs.closeOnSelect.toLowerCase() === 'false') ? false : uiSelectConfig.closeOnSelect;
        $select.onSelectCallback = $parse(attrs.onSelect);
        $select.onRemoveCallback = $parse(attrs.onRemove);

        //From view --> model
        ngModel.$parsers.unshift(function (inputValue) {
          var locals = {},
              result;
          if ($select.multiple){
            var resultMultiple = [];
            for (var j = $select.selected.length - 1; j >= 0; j--) {
              locals = {};
              locals[$select.parserResult.itemName] = $select.selected[j];
              result = $select.parserResult.modelMapper(scope, locals);
              resultMultiple.unshift(result);
            }
            return resultMultiple;
          }else{
            locals = {};
            locals[$select.parserResult.itemName] = inputValue;
            result = $select.parserResult.modelMapper(scope, locals);
            return result;
          }
        });

        //From model --> view
        ngModel.$formatters.unshift(function (inputValue) {
          var data = $select.parserResult.source (scope, { $select : {search:''}}), //Overwrite $search
              locals = {},
              result;
          if (data){
            if ($select.multiple){
              var resultMultiple = [];
              var checkFnMultiple = function(list, value){
                if (!list || !list.length) return;
                for (var p = list.length - 1; p >= 0; p--) {
                  locals[$select.parserResult.itemName] = list[p];
                  result = $select.parserResult.modelMapper(scope, locals);
                  if (result == value){
                    resultMultiple.unshift(list[p]);
                    return true;
                  }
                }
                return false;
              };
              if (!inputValue) return resultMultiple; //If ngModel was undefined
              for (var k = inputValue.length - 1; k >= 0; k--) {
                if (!checkFnMultiple($select.selected, inputValue[k])){
                  checkFnMultiple(data, inputValue[k]);
                }
              }
              return resultMultiple;
            }else{
              var checkFnSingle = function(d){
                locals[$select.parserResult.itemName] = d;
                result = $select.parserResult.modelMapper(scope, locals);
                return result == inputValue;
              };
              //If possible pass same object stored in $select.selected
              if ($select.selected && checkFnSingle($select.selected)) {
                return $select.selected;
              }
              for (var i = data.length - 1; i >= 0; i--) {
                if (checkFnSingle(data[i])) return data[i];
              }
            }
          }
          return inputValue;
        });

        //Set reference to ngModel from uiSelectCtrl
        $select.ngModel = ngModel;

        //Idea from: https://github.com/ivaynberg/select2/blob/79b5bf6db918d7560bdd959109b7bcfb47edaf43/select2.js#L1954
        var focusser = angular.element("<input ng-disabled='$select.disabled' class='ui-select-focusser ui-select-offscreen' type='text' aria-haspopup='true' role='button' />");

        if(attrs.tabindex){
          //tabindex might be an expression, wait until it contains the actual value before we set the focusser tabindex
          attrs.$observe('tabindex', function(value) {
            //If we are using multiple, add tabindex to the search input
            if($select.multiple){
              searchInput.attr("tabindex", value);
            } else {
              focusser.attr("tabindex", value);
            }
            //Remove the tabindex on the parent so that it is not focusable
            element.removeAttr("tabindex");
          });
        }

        $compile(focusser)(scope);
        $select.focusser = focusser;

        if (!$select.multiple){

          element.append(focusser);
          focusser.bind("focus", function(){
            scope.$evalAsync(function(){
              $select.focus = true;
            });
          });
          focusser.bind("blur", function(){
            scope.$evalAsync(function(){
              $select.focus = false;
            });
          });
          focusser.bind("keydown", function(e){

            if (e.which === KEY.BACKSPACE) {
              e.preventDefault();
              e.stopPropagation();
              $select.select(undefined);
              scope.$apply();
              return;
            }

            if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
              return;
            }

            if (e.which == KEY.DOWN  || e.which == KEY.UP || e.which == KEY.ENTER || e.which == KEY.SPACE){
              e.preventDefault();
              e.stopPropagation();
              $select.activate();
            }

            scope.$digest();
          });

          focusser.bind("keyup input", function(e){

            if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC || e.which == KEY.ENTER || e.which === KEY.BACKSPACE) {
              return;
            }

            $select.activate(focusser.val()); //User pressed some regular key, so we pass it to the search input
            focusser.val('');
            scope.$digest();

          });

        }


        scope.$watch('searchEnabled', function() {
            var searchEnabled = scope.$eval(attrs.searchEnabled);
            $select.searchEnabled = searchEnabled !== undefined ? searchEnabled : uiSelectConfig.searchEnabled;
        });

        attrs.$observe('disabled', function() {
          // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
          $select.disabled = attrs.disabled !== undefined ? attrs.disabled : false;
        });

        attrs.$observe('resetSearchInput', function() {
          // $eval() is needed otherwise we get a string instead of a boolean
          var resetSearchInput = scope.$eval(attrs.resetSearchInput);
          $select.resetSearchInput = resetSearchInput !== undefined ? resetSearchInput : true;
        });

        attrs.$observe('tagging', function() {
          if(attrs.tagging !== undefined)
          {
            // $eval() is needed otherwise we get a string instead of a boolean
            var taggingEval = scope.$eval(attrs.tagging);
            $select.tagging = {isActivated: true, fct: taggingEval !== true ? taggingEval : undefined};
          }
          else
          {
            $select.tagging = {isActivated: false, fct: undefined};
          }
        });

        attrs.$observe('taggingLabel', function() {
          if(attrs.tagging !== undefined && attrs.taggingLabel !== undefined)
          {
            // check eval for FALSE, in this case, we disable the labels
            // associated with tagging
            if ( attrs.taggingLabel === 'false' ) {
              $select.taggingLabel = false;
            }
            else
            {
              $select.taggingLabel = attrs.taggingLabel !== undefined ? attrs.taggingLabel : '(new)';
            }
          }
        });

        attrs.$observe('taggingTokens', function() {
          if (attrs.tagging !== undefined) {
            var tokens = attrs.taggingTokens !== undefined ? attrs.taggingTokens.split('|') : [',','ENTER'];
            $select.taggingTokens = {isActivated: true, tokens: tokens };
          }
        });

        if ($select.multiple){
          scope.$watchCollection(function(){ return ngModel.$modelValue; }, function(newValue, oldValue) {
            if (oldValue != newValue)
              ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters
          });
          scope.$watchCollection('$select.selected', function() {
            ngModel.$setViewValue(Date.now()); //Set timestamp as a unique string to force changes
          });
          focusser.prop('disabled', true); //Focusser isn't needed if multiple
        }else{
          scope.$watch('$select.selected', function(newValue) {
            if (ngModel.$viewValue !== newValue) {
              ngModel.$setViewValue(newValue);
            }
          });
        }

        ngModel.$render = function() {
          if($select.multiple){
            // Make sure that model value is array
            if(!angular.isArray(ngModel.$viewValue)){
              // Have tolerance for null or undefined values
              if(angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null){
                $select.selected = [];
              } else {
                throw uiSelectMinErr('multiarr', "Expected model value to be array but got '{0}'", ngModel.$viewValue);
              }
            }
          }
          $select.selected = ngModel.$viewValue;
        };

        function onDocumentClick(e) {
          var contains = false;

          if (window.jQuery) {
            // Firefox 3.6 does not support element.contains()
            // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
            contains = window.jQuery.contains(element[0], e.target);
          } else {
            contains = element[0].contains(e.target);
          }

          if (!contains && !$select.clickTriggeredSelect) {
            $select.close();
            scope.$digest();
          }
          $select.clickTriggeredSelect = false;
        }

        // See Click everywhere but here event http://stackoverflow.com/questions/12931369
        $document.on('click', onDocumentClick);

        scope.$on('$destroy', function() {
          $document.off('click', onDocumentClick);
        });

        // Move transcluded elements to their correct position in main template
        transcludeFn(scope, function(clone) {
          // See Transclude in AngularJS http://blog.omkarpatil.com/2012/11/transclude-in-angularjs.html

          // One day jqLite will be replaced by jQuery and we will be able to write:
          // var transcludedElement = clone.filter('.my-class')
          // instead of creating a hackish DOM element:
          var transcluded = angular.element('<div>').append(clone);

          var transcludedMatch = transcluded.querySelectorAll('.ui-select-match');
          transcludedMatch.removeAttr('ui-select-match'); //To avoid loop in case directive as attr
          if (transcludedMatch.length !== 1) {
            throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-match but got '{0}'.", transcludedMatch.length);
          }
          element.querySelectorAll('.ui-select-match').replaceWith(transcludedMatch);

          var transcludedChoices = transcluded.querySelectorAll('.ui-select-choices');
          transcludedChoices.removeAttr('ui-select-choices'); //To avoid loop in case directive as attr
          if (transcludedChoices.length !== 1) {
            throw uiSelectMinErr('transcluded', "Expected 1 .ui-select-choices but got '{0}'.", transcludedChoices.length);
          }
          element.querySelectorAll('.ui-select-choices').replaceWith(transcludedChoices);
        });
      }
    };
  }])

  .directive('uiSelectChoices',
    ['uiSelectConfig', 'RepeatParser', 'uiSelectMinErr', '$compile',
    function(uiSelectConfig, RepeatParser, uiSelectMinErr, $compile) {

    return {
      restrict: 'EA',
      require: '^uiSelect',
      replace: true,
      transclude: true,
      templateUrl: function(tElement) {
        // Gets theme attribute from parent (ui-select)
        var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
        return theme + '/choices.tpl.html';
      },

      compile: function(tElement, tAttrs) {

        if (!tAttrs.repeat) throw uiSelectMinErr('repeat', "Expected 'repeat' expression.");

        return function link(scope, element, attrs, $select, transcludeFn) {

          // var repeat = RepeatParser.parse(attrs.repeat);
          var groupByExp = attrs.groupBy;

          $select.parseRepeatAttr(attrs.repeat, groupByExp); //Result ready at $select.parserResult

          $select.disableChoiceExpression = attrs.uiDisableChoice;
          $select.onHighlightCallback = attrs.onHighlight;

          if(groupByExp) {
            var groups = element.querySelectorAll('.ui-select-choices-group');
            if (groups.length !== 1) throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-group but got '{0}'.", groups.length);
            groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
          }

          var choices = element.querySelectorAll('.ui-select-choices-row');
          if (choices.length !== 1) {
            throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row but got '{0}'.", choices.length);
          }

          choices.attr('ng-repeat', RepeatParser.getNgRepeatExpression($select.parserResult.itemName, '$select.items', $select.parserResult.trackByExp, groupByExp))
              .attr('ng-if', '$select.open') //Prevent unnecessary watches when dropdown is closed
              .attr('ng-mouseenter', '$select.setActiveItem('+$select.parserResult.itemName +')')
              .attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');

          var rowsInner = element.querySelectorAll('.ui-select-choices-row-inner');
          if (rowsInner.length !== 1) throw uiSelectMinErr('rows', "Expected 1 .ui-select-choices-row-inner but got '{0}'.", rowsInner.length);
          rowsInner.attr('uis-transclude-append', ''); //Adding uisTranscludeAppend directive to row element after choices element has ngRepeat

          $compile(element, transcludeFn)(scope); //Passing current transcludeFn to be able to append elements correctly from uisTranscludeAppend

          scope.$watch('$select.search', function(newValue) {
            if(newValue && !$select.open && $select.multiple) $select.activate(false, true);
            $select.activeIndex = $select.tagging.isActivated ? -1 : 0;
            $select.refresh(attrs.refresh);
          });

          attrs.$observe('refreshDelay', function() {
            // $eval() is needed otherwise we get a string instead of a number
            var refreshDelay = scope.$eval(attrs.refreshDelay);
            $select.refreshDelay = refreshDelay !== undefined ? refreshDelay : uiSelectConfig.refreshDelay;
          });
        };
      }
    };
  }])
  // Recreates old behavior of ng-transclude. Used internally.
  .directive('uisTranscludeAppend', function () {
    return {
      link: function (scope, element, attrs, ctrl, transclude) {
          transclude(scope, function (clone) {
            element.append(clone);
          });
        }
      };
  })
  .directive('uiSelectMatch', ['uiSelectConfig', function(uiSelectConfig) {
    return {
      restrict: 'EA',
      require: '^uiSelect',
      replace: true,
      transclude: true,
      templateUrl: function(tElement) {
        // Gets theme attribute from parent (ui-select)
        var theme = tElement.parent().attr('theme') || uiSelectConfig.theme;
        var multi = tElement.parent().attr('multiple');
        return theme + (multi ? '/match-multiple.tpl.html' : '/match.tpl.html');
      },
      link: function(scope, element, attrs, $select) {
        $select.lockChoiceExpression = attrs.uiLockChoice;
        attrs.$observe('placeholder', function(placeholder) {
          $select.placeholder = placeholder !== undefined ? placeholder : uiSelectConfig.placeholder;
        });
        
        $select.allowClear = (angular.isDefined(attrs.allowClear)) ? (attrs.allowClear === '') ? true : (attrs.allowClear.toLowerCase() === 'true') : false;

        if($select.multiple){
          $select.sizeSearchInput();
        }

      }
    };
  }])

  /**
   * Highlights text that matches $select.search.
   *
   * Taken from AngularUI Bootstrap Typeahead
   * See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L340
   */
  .filter('highlight', function() {
    function escapeRegexp(queryToEscape) {
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function(matchItem, query) {
      return query && matchItem ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
    };
  });
}());

angular.module("ui.select").run(["$templateCache", function($templateCache) {$templateCache.put("bootstrap/choices.tpl.html","<ul class=\"ui-select-choices ui-select-choices-content dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\" ng-show=\"$select.items.length > 0\"><li class=\"ui-select-choices-group\"><div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label dropdown-header\" ng-bind-html=\"$group.name\"></div><div class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\"><a href=\"javascript:void(0)\" class=\"ui-select-choices-row-inner\"></a></div></li></ul>");
$templateCache.put("bootstrap/match-multiple.tpl.html","<span class=\"ui-select-match\"><span ng-repeat=\"$item in $select.selected\"><span style=\"margin-right: 3px;\" class=\"ui-select-match-item btn btn-default btn-xs\" tabindex=\"-1\" type=\"button\" ng-disabled=\"$select.disabled\" ng-click=\"$select.activeMatchIndex = $index;\" ng-class=\"{\'btn-primary\':$select.activeMatchIndex === $index}\"><span class=\"close ui-select-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$select.removeChoice($index)\">&nbsp;&times;</span> <span uis-transclude-append=\"\"></span></span></span></span>");
$templateCache.put("bootstrap/match.tpl.html","<button type=\"button\" class=\"btn btn-default form-control ui-select-match\" tabindex=\"-1\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{\'btn-default-focus\':$select.focus}\" ;=\"\" ng-click=\"$select.activate()\"><span ng-show=\"$select.isEmpty()\" class=\"text-muted\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" ng-transclude=\"\"></span> <span class=\"caret ui-select-toggle\" ng-click=\"$select.toggle($event)\"></span></button>");
$templateCache.put("bootstrap/select-multiple.tpl.html","<div class=\"ui-select-multiple ui-select-bootstrap dropdown form-control\" ng-class=\"{open: $select.open}\"><div><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"ui-select-search input-xs\" placeholder=\"{{$select.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-click=\"$select.activate()\" ng-model=\"$select.search\"></div><div class=\"ui-select-choices\"></div></div>");
$templateCache.put("bootstrap/select.tpl.html","<div class=\"ui-select-bootstrap dropdown\" ng-class=\"{open: $select.open}\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"off\" tabindex=\"-1\" class=\"form-control ui-select-search\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-show=\"$select.searchEnabled && $select.open\"><div class=\"ui-select-choices\"></div></div>");
$templateCache.put("select2/choices.tpl.html","<ul class=\"ui-select-choices ui-select-choices-content select2-results\"><li class=\"ui-select-choices-group\" ng-class=\"{\'select2-result-with-children\': $select.isGrouped}\"><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label select2-result-label\" ng-bind-html=\"$group.name\"></div><ul ng-class=\"{\'select2-result-sub\': $select.isGrouped, \'select2-result-single\': !$select.isGrouped}\"><li class=\"ui-select-choices-row\" ng-class=\"{\'select2-highlighted\': $select.isActive(this), \'select2-disabled\': $select.isDisabled(this)}\"><div class=\"select2-result-label ui-select-choices-row-inner\"></div></li></ul></li></ul>");
$templateCache.put("select2/match-multiple.tpl.html","<span class=\"ui-select-match\"><li class=\"ui-select-match-item select2-search-choice\" ng-repeat=\"$item in $select.selected\" ng-class=\"{\'select2-search-choice-focus\':$select.activeMatchIndex === $index, \'select2-locked\':$select.isLocked(this, $index)}\"><span uis-transclude-append=\"\"></span> <a href=\"javascript:;\" class=\"ui-select-match-close select2-search-choice-close\" ng-click=\"$select.removeChoice($index)\" tabindex=\"-1\"></a></li></span>");
$templateCache.put("select2/match.tpl.html","<a class=\"select2-choice ui-select-match\" ng-class=\"{\'select2-default\': $select.isEmpty()}\" ng-click=\"$select.activate()\"><span ng-show=\"$select.isEmpty()\" class=\"select2-chosen\">{{$select.placeholder}}</span> <span ng-hide=\"$select.isEmpty()\" class=\"select2-chosen\" ng-transclude=\"\"></span> <abbr ng-if=\"$select.allowClear && !$select.isEmpty()\" class=\"select2-search-choice-close\" ng-click=\"$select.select(undefined)\"></abbr> <span class=\"select2-arrow ui-select-toggle\" ng-click=\"$select.toggle($event)\"><b></b></span></a>");
$templateCache.put("select2/select-multiple.tpl.html","<div class=\"ui-select-multiple select2 select2-container select2-container-multi\" ng-class=\"{\'select2-container-active select2-dropdown-open\': $select.open,\n                \'select2-container-disabled\': $select.disabled}\"><ul class=\"select2-choices\"><span class=\"ui-select-match\"></span><li class=\"select2-search-field\"><input type=\"text\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"select2-input ui-select-search\" placeholder=\"{{$select.getPlaceholder()}}\" ng-disabled=\"$select.disabled\" ng-hide=\"$select.disabled\" ng-model=\"$select.search\" ng-click=\"$select.activate()\" style=\"width: 34px;\"></li></ul><div class=\"select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"ui-select-choices\"></div></div></div>");
$templateCache.put("select2/select.tpl.html","<div class=\"select2 select2-container\" ng-class=\"{\'select2-container-active select2-dropdown-open\': $select.open,\n                \'select2-container-disabled\': $select.disabled,\n                \'select2-container-active\': $select.focus, \n                \'select2-allowclear\': $select.allowClear && !$select.isEmpty()}\"><div class=\"ui-select-match\"></div><div class=\"select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"select2-search\" ng-show=\"$select.searchEnabled\"><input type=\"text\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"ui-select-search select2-input\" ng-model=\"$select.search\"></div><div class=\"ui-select-choices\"></div></div></div>");
$templateCache.put("selectize/choices.tpl.html","<div ng-show=\"$select.open\" class=\"ui-select-choices selectize-dropdown single\"><div class=\"ui-select-choices-content selectize-dropdown-content\"><div class=\"ui-select-choices-group optgroup\"><div ng-show=\"$select.isGrouped\" class=\"ui-select-choices-group-label optgroup-header\" ng-bind-html=\"$group.name\"></div><div class=\"ui-select-choices-row\" ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\"><div class=\"option ui-select-choices-row-inner\" data-selectable=\"\"></div></div></div></div></div>");
$templateCache.put("selectize/match.tpl.html","<div ng-hide=\"($select.open || $select.isEmpty())\" class=\"ui-select-match\" ng-transclude=\"\"></div>");
$templateCache.put("selectize/select.tpl.html","<div class=\"selectize-control single\"><div class=\"selectize-input\" ng-class=\"{\'focus\': $select.open, \'disabled\': $select.disabled, \'selectize-focus\' : $select.focus}\" ng-click=\"$select.activate()\"><div class=\"ui-select-match\"></div><input type=\"text\" autocomplete=\"off\" tabindex=\"-1\" class=\"ui-select-search ui-select-toggle\" ng-click=\"$select.toggle($event)\" placeholder=\"{{$select.placeholder}}\" ng-model=\"$select.search\" ng-hide=\"!$select.searchEnabled || ($select.selected && !$select.open)\" ng-disabled=\"$select.disabled\"></div><div class=\"ui-select-choices\"></div></div>");}]);;/*! Editor.md v1.5.0 | editormd.min.js | Open source online markdown editor. | MIT License | By: Pandao | https://github.com/pandao/editor.md | 2015-06-09 */
!function(e){"use strict";"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?module.exports=e:"function"==typeof define?define.amd||define(["jquery"],e):window.editormd=e()}(function(){"use strict";var e="undefined"!=typeof jQuery?jQuery:Zepto;if("undefined"!=typeof e){var t=function(e,i){return new t.fn.init(e,i)};t.title=t.$name="Editor.md",t.version="1.5.0",t.homePage="https://pandao.github.io/editor.md/",t.classPrefix="editormd-",t.toolbarModes={full:["undo","redo","|","bold","del","italic","quote","ucwords","uppercase","lowercase","|","h1","h2","h3","h4","h5","h6","|","list-ul","list-ol","hr","|","link","reference-link","image","code","preformatted-text","code-block","table","datetime","emoji","html-entities","pagebreak","|","goto-line","watch","preview","fullscreen","clear","search","|","help","info"],simple:["undo","redo","|","bold","del","italic","quote","uppercase","lowercase","|","h1","h2","h3","h4","h5","h6","|","list-ul","list-ol","hr","|","watch","preview","fullscreen","|","help","info"],mini:["undo","redo","|","watch","preview","|","help","info"]},t.defaults={mode:"gfm",name:"",value:"",theme:"",editorTheme:"default",previewTheme:"",markdown:"",appendMarkdown:"",width:"100%",height:"100%",path:"./lib/",pluginPath:"",delay:300,autoLoadModules:!0,watch:!0,placeholder:"Enjoy Markdown! coding now...",gotoLine:!0,codeFold:!1,autoHeight:!1,autoFocus:!0,autoCloseTags:!0,searchReplace:!0,syncScrolling:!0,readOnly:!1,tabSize:4,indentUnit:4,lineNumbers:!0,lineWrapping:!0,autoCloseBrackets:!0,showTrailingSpace:!0,matchBrackets:!0,indentWithTabs:!0,styleSelectedText:!0,matchWordHighlight:!0,styleActiveLine:!0,dialogLockScreen:!0,dialogShowMask:!0,dialogDraggable:!0,dialogMaskBgColor:"#fff",dialogMaskOpacity:.1,fontSize:"13px",saveHTMLToTextarea:!1,disabledKeyMaps:[],onload:function(){},onresize:function(){},onchange:function(){},onwatch:null,onunwatch:null,onpreviewing:function(){},onpreviewed:function(){},onfullscreen:function(){},onfullscreenExit:function(){},onscroll:function(){},onpreviewscroll:function(){},imageUpload:!1,imageFormats:["jpg","jpeg","gif","png","bmp","webp"],imageUploadURL:"",crossDomainUpload:!1,uploadCallbackURL:"",toc:!0,tocm:!1,tocTitle:"",tocDropdown:!1,tocContainer:"",tocStartLevel:1,htmlDecode:!1,pageBreak:!0,atLink:!0,emailLink:!0,taskList:!1,emoji:!1,tex:!1,flowChart:!1,sequenceDiagram:!1,previewCodeHighlight:!0,toolbar:!0,toolbarAutoFixed:!0,toolbarIcons:"full",toolbarTitles:{},toolbarHandlers:{ucwords:function(){return t.toolbarHandlers.ucwords},lowercase:function(){return t.toolbarHandlers.lowercase}},toolbarCustomIcons:{lowercase:'<a href="javascript:;" title="Lowercase" unselectable="on"><i class="fa" name="lowercase" style="font-size:24px;margin-top: -10px;">a</i></a>',ucwords:'<a href="javascript:;" title="ucwords" unselectable="on"><i class="fa" name="ucwords" style="font-size:20px;margin-top: -3px;">Aa</i></a>'},toolbarIconsClass:{undo:"fa-undo",redo:"fa-repeat",bold:"fa-bold",del:"fa-strikethrough",italic:"fa-italic",quote:"fa-quote-left",uppercase:"fa-font",h1:t.classPrefix+"bold",h2:t.classPrefix+"bold",h3:t.classPrefix+"bold",h4:t.classPrefix+"bold",h5:t.classPrefix+"bold",h6:t.classPrefix+"bold","list-ul":"fa-list-ul","list-ol":"fa-list-ol",hr:"fa-minus",link:"fa-link","reference-link":"fa-anchor",image:"fa-picture-o",code:"fa-code","preformatted-text":"fa-file-code-o","code-block":"fa-file-code-o",table:"fa-table",datetime:"fa-clock-o",emoji:"fa-smile-o","html-entities":"fa-copyright",pagebreak:"fa-newspaper-o","goto-line":"fa-terminal",watch:"fa-eye-slash",unwatch:"fa-eye",preview:"fa-desktop",search:"fa-search",fullscreen:"fa-arrows-alt",clear:"fa-eraser",help:"fa-question-circle",info:"fa-info-circle"},toolbarIconTexts:{},lang:{name:"zh-cn",description:"开源在线Markdown编辑器<br/>Open source online Markdown editor.",tocTitle:"目录",toolbar:{undo:"撤销（Ctrl+Z）",redo:"重做（Ctrl+Y）",bold:"粗体",del:"删除线",italic:"斜体",quote:"引用",ucwords:"将每个单词首字母转成大写",uppercase:"将所选转换成大写",lowercase:"将所选转换成小写",h1:"标题1",h2:"标题2",h3:"标题3",h4:"标题4",h5:"标题5",h6:"标题6","list-ul":"无序列表","list-ol":"有序列表",hr:"横线",link:"链接","reference-link":"引用链接",image:"添加图片",code:"行内代码","preformatted-text":"预格式文本 / 代码块（缩进风格）","code-block":"代码块（多语言风格）",table:"添加表格",datetime:"日期时间",emoji:"Emoji表情","html-entities":"HTML实体字符",pagebreak:"插入分页符","goto-line":"跳转到行",watch:"关闭实时预览",unwatch:"开启实时预览",preview:"全窗口预览HTML（按 Shift + ESC还原）",fullscreen:"全屏（按ESC还原）",clear:"清空",search:"搜索",help:"使用帮助",info:"关于"+t.title},buttons:{enter:"确定",cancel:"取消",close:"关闭"},dialog:{link:{title:"添加链接",url:"链接地址",urlTitle:"链接标题",urlEmpty:"错误：请填写链接地址。"},referenceLink:{title:"添加引用链接",name:"引用名称",url:"链接地址",urlId:"链接ID",urlTitle:"链接标题",nameEmpty:"错误：引用链接的名称不能为空。",idEmpty:"错误：请填写引用链接的ID。",urlEmpty:"错误：请填写引用链接的URL地址。"},image:{title:"添加图片",url:"图片地址",link:"图片链接",alt:"图片描述",uploadButton:"本地上传",imageURLEmpty:"错误：图片地址不能为空。",uploadFileEmpty:"错误：上传的图片不能为空。",formatNotAllowed:"错误：只允许上传图片文件，允许上传的图片文件格式有："},preformattedText:{title:"添加预格式文本或代码块",emptyAlert:"错误：请填写预格式文本或代码的内容。"},codeBlock:{title:"添加代码块",selectLabel:"代码语言：",selectDefaultText:"请选择代码语言",otherLanguage:"其他语言",unselectedLanguageAlert:"错误：请选择代码所属的语言类型。",codeEmptyAlert:"错误：请填写代码内容。"},htmlEntities:{title:"HTML 实体字符"},help:{title:"使用帮助"}}}},t.classNames={tex:t.classPrefix+"tex"},t.dialogZindex=99999,t.$katex=null,t.$marked=null,t.$CodeMirror=null,t.$prettyPrint=null;var i,o;t.prototype=t.fn={state:{watching:!1,loaded:!1,preview:!1,fullscreen:!1},init:function(i,o){o=o||{},"object"==typeof i&&(o=i);var r=this.classPrefix=t.classPrefix,n=this.settings=e.extend(!0,t.defaults,o);i="object"==typeof i?n.id:i;var a=this.editor=e("#"+i);this.id=i,this.lang=n.lang;var s=this.classNames={textarea:{html:r+"html-textarea",markdown:r+"markdown-textarea"}};n.pluginPath=""===n.pluginPath?n.path+"../plugins/":n.pluginPath,this.state.watching=n.watch?!0:!1,a.hasClass("editormd")||a.addClass("editormd"),a.css({width:"number"==typeof n.width?n.width+"px":n.width,height:"number"==typeof n.height?n.height+"px":n.height}),n.autoHeight&&a.css("height","auto");var l=this.markdownTextarea=a.children("textarea");l.length<1&&(a.append("<textarea></textarea>"),l=this.markdownTextarea=a.children("textarea")),l.addClass(s.textarea.markdown).attr("placeholder",n.placeholder),("undefined"==typeof l.attr("name")||""===l.attr("name"))&&l.attr("name",""!==n.name?n.name:i+"-markdown-doc");var c=[n.readOnly?"":'<a href="javascript:;" class="fa fa-close '+r+'preview-close-btn"></a>',n.saveHTMLToTextarea?'<textarea class="'+s.textarea.html+'" name="'+i+'-html-code"></textarea>':"",'<div class="'+r+'preview"><div class="markdown-body '+r+'preview-container"></div></div>','<div class="'+r+'container-mask" style="display:block;"></div>','<div class="'+r+'mask"></div>'].join("\n");return a.append(c).addClass(r+"vertical"),""!==n.theme&&a.addClass(r+"theme-"+n.theme),this.mask=a.children("."+r+"mask"),this.containerMask=a.children("."+r+"container-mask"),""!==n.markdown&&l.val(n.markdown),""!==n.appendMarkdown&&l.val(l.val()+n.appendMarkdown),this.htmlTextarea=a.children("."+s.textarea.html),this.preview=a.children("."+r+"preview"),this.previewContainer=this.preview.children("."+r+"preview-container"),""!==n.previewTheme&&this.preview.addClass(r+"preview-theme-"+n.previewTheme),"function"==typeof define&&define.amd&&("undefined"!=typeof katex&&(t.$katex=katex),n.searchReplace&&!n.readOnly&&(t.loadCSS(n.path+"codemirror/addon/dialog/dialog"),t.loadCSS(n.path+"codemirror/addon/search/matchesonscrollbar"))),"function"==typeof define&&define.amd||!n.autoLoadModules?("undefined"!=typeof CodeMirror&&(t.$CodeMirror=CodeMirror),"undefined"!=typeof marked&&(t.$marked=marked),this.setCodeMirror().setToolbar().loadedDisplay()):this.loadQueues(),this},loadQueues:function(){var e=this,i=this.settings,o=i.path,r=function(){return t.isIE8?void e.loadedDisplay():void(i.flowChart||i.sequenceDiagram?t.loadScript(o+"raphael.min",function(){t.loadScript(o+"underscore.min",function(){!i.flowChart&&i.sequenceDiagram?t.loadScript(o+"sequence-diagram.min",function(){e.loadedDisplay()}):i.flowChart&&!i.sequenceDiagram?t.loadScript(o+"flowchart.min",function(){t.loadScript(o+"jquery.flowchart.min",function(){e.loadedDisplay()})}):i.flowChart&&i.sequenceDiagram&&t.loadScript(o+"flowchart.min",function(){t.loadScript(o+"jquery.flowchart.min",function(){t.loadScript(o+"sequence-diagram.min",function(){e.loadedDisplay()})})})})}):e.loadedDisplay())};return t.loadCSS(o+"codemirror/codemirror.min"),i.searchReplace&&!i.readOnly&&(t.loadCSS(o+"codemirror/addon/dialog/dialog"),t.loadCSS(o+"codemirror/addon/search/matchesonscrollbar")),i.codeFold&&t.loadCSS(o+"codemirror/addon/fold/foldgutter"),t.loadScript(o+"codemirror/codemirror.min",function(){t.$CodeMirror=CodeMirror,t.loadScript(o+"codemirror/modes.min",function(){t.loadScript(o+"codemirror/addons.min",function(){return e.setCodeMirror(),"gfm"!==i.mode&&"markdown"!==i.mode?(e.loadedDisplay(),!1):(e.setToolbar(),void t.loadScript(o+"marked.min",function(){t.$marked=marked,i.previewCodeHighlight?t.loadScript(o+"prettify.min",function(){r()}):r()}))})})}),this},setTheme:function(e){var t=this.editor,i=this.settings.theme,o=this.classPrefix+"theme-";return t.removeClass(o+i).addClass(o+e),this.settings.theme=e,this},setEditorTheme:function(e){var i=this.settings;return i.editorTheme=e,"default"!==e&&t.loadCSS(i.path+"codemirror/theme/"+i.editorTheme),this.cm.setOption("theme",e),this},setCodeMirrorTheme:function(e){return this.setEditorTheme(e),this},setPreviewTheme:function(e){var t=this.preview,i=this.settings.previewTheme,o=this.classPrefix+"preview-theme-";return t.removeClass(o+i).addClass(o+e),this.settings.previewTheme=e,this},setCodeMirror:function(){var e=this.settings,i=this.editor;"default"!==e.editorTheme&&t.loadCSS(e.path+"codemirror/theme/"+e.editorTheme);var o={mode:e.mode,theme:e.editorTheme,tabSize:e.tabSize,dragDrop:!1,autofocus:e.autoFocus,autoCloseTags:e.autoCloseTags,readOnly:e.readOnly?"nocursor":!1,indentUnit:e.indentUnit,lineNumbers:e.lineNumbers,lineWrapping:e.lineWrapping,extraKeys:{"Ctrl-Q":function(e){e.foldCode(e.getCursor())}},foldGutter:e.codeFold,gutters:["CodeMirror-linenumbers","CodeMirror-foldgutter"],matchBrackets:e.matchBrackets,indentWithTabs:e.indentWithTabs,styleActiveLine:e.styleActiveLine,styleSelectedText:e.styleSelectedText,autoCloseBrackets:e.autoCloseBrackets,showTrailingSpace:e.showTrailingSpace,highlightSelectionMatches:e.matchWordHighlight?{showToken:"onselected"===e.matchWordHighlight?!1:/\w/}:!1};return this.codeEditor=this.cm=t.$CodeMirror.fromTextArea(this.markdownTextarea[0],o),this.codeMirror=this.cmElement=i.children(".CodeMirror"),""!==e.value&&this.cm.setValue(e.value),this.codeMirror.css({fontSize:e.fontSize,width:e.watch?"50%":"100%"}),e.autoHeight&&(this.codeMirror.css("height","auto"),this.cm.setOption("viewportMargin",1/0)),e.lineNumbers||this.codeMirror.find(".CodeMirror-gutters").css("border-right","none"),this},getCodeMirrorOption:function(e){return this.cm.getOption(e)},setCodeMirrorOption:function(e,t){return this.cm.setOption(e,t),this},addKeyMap:function(e,t){return this.cm.addKeyMap(e,t),this},removeKeyMap:function(e){return this.cm.removeKeyMap(e),this},gotoLine:function(t){var i=this.settings;if(!i.gotoLine)return this;var o=this.cm,r=(this.editor,o.lineCount()),n=this.preview;if("string"==typeof t&&("last"===t&&(t=r),"first"===t&&(t=1)),"number"!=typeof t)return alert("Error: The line number must be an integer."),this;if(t=parseInt(t)-1,t>r)return alert("Error: The line number range 1-"+r),this;o.setCursor({line:t,ch:0});var a=o.getScrollInfo(),s=a.clientHeight,l=o.charCoords({line:t,ch:0},"local");if(o.scrollTo(null,(l.top+l.bottom-s)/2),i.watch){var c=this.codeMirror.find(".CodeMirror-scroll")[0],h=e(c).height(),d=c.scrollTop,u=d/c.scrollHeight;n.scrollTop(0===d?0:d+h>=c.scrollHeight-16?n[0].scrollHeight:n[0].scrollHeight*u)}return o.focus(),this},extend:function(){return"undefined"!=typeof arguments[1]&&("function"==typeof arguments[1]&&(arguments[1]=e.proxy(arguments[1],this)),this[arguments[0]]=arguments[1]),"object"==typeof arguments[0]&&"undefined"==typeof arguments[0].length&&e.extend(!0,this,arguments[0]),this},set:function(t,i){return"undefined"!=typeof i&&"function"==typeof i&&(i=e.proxy(i,this)),this[t]=i,this},config:function(t,i){var o=this.settings;return"object"==typeof t&&(o=e.extend(!0,o,t)),"string"==typeof t&&(o[t]=i),this.settings=o,this.recreate(),this},on:function(t,i){var o=this.settings;return"undefined"!=typeof o["on"+t]&&(o["on"+t]=e.proxy(i,this)),this},off:function(e){var t=this.settings;return"undefined"!=typeof t["on"+e]&&(t["on"+e]=function(){}),this},showToolbar:function(t){var i=this.settings;return i.readOnly?this:(i.toolbar&&(this.toolbar.length<1||""===this.toolbar.find("."+this.classPrefix+"menu").html())&&this.setToolbar(),i.toolbar=!0,this.toolbar.show(),this.resize(),e.proxy(t||function(){},this)(),this)},hideToolbar:function(t){var i=this.settings;return i.toolbar=!1,this.toolbar.hide(),this.resize(),e.proxy(t||function(){},this)(),this},setToolbarAutoFixed:function(t){var i=this.state,o=this.editor,r=this.toolbar,n=this.settings;"undefined"!=typeof t&&(n.toolbarAutoFixed=t);var a=function(){var t=e(window),i=t.scrollTop();return n.toolbarAutoFixed?void r.css(i-o.offset().top>10&&i<o.height()?{position:"fixed",width:o.width()+"px",left:(t.width()-o.width())/2+"px"}:{position:"absolute",width:"100%",left:0}):!1};return!i.fullscreen&&!i.preview&&n.toolbar&&n.toolbarAutoFixed&&e(window).bind("scroll",a),this},setToolbar:function(){var e=this.settings;if(e.readOnly)return this;var i=this.editor,o=(this.preview,this.classPrefix),r=this.toolbar=i.children("."+o+"toolbar");if(e.toolbar&&r.length<1){var n='<div class="'+o+'toolbar"><div class="'+o+'toolbar-container"><ul class="'+o+'menu"></ul></div></div>';i.append(n),r=this.toolbar=i.children("."+o+"toolbar")}if(!e.toolbar)return r.hide(),this;r.show();for(var a="function"==typeof e.toolbarIcons?e.toolbarIcons():"string"==typeof e.toolbarIcons?t.toolbarModes[e.toolbarIcons]:e.toolbarIcons,s=r.find("."+this.classPrefix+"menu"),l="",c=!1,h=0,d=a.length;d>h;h++){var u=a[h];if("||"===u)c=!0;else if("|"===u)l+='<li class="divider" unselectable="on">|</li>';else{var f=/h(\d)/.test(u),g=u;"watch"!==u||e.watch||(g="unwatch");var p=e.lang.toolbar[g],m=e.toolbarIconTexts[g],w=e.toolbarIconsClass[g];p="undefined"==typeof p?"":p,m="undefined"==typeof m?"":m,w="undefined"==typeof w?"":w;var v=c?'<li class="pull-right">':"<li>";"undefined"!=typeof e.toolbarCustomIcons[u]&&"function"!=typeof e.toolbarCustomIcons[u]?v+=e.toolbarCustomIcons[u]:(v+='<a href="javascript:;" title="'+p+'" unselectable="on">',v+='<i class="fa '+w+'" name="'+u+'" unselectable="on">'+(f?u.toUpperCase():""===w?m:"")+"</i>",v+="</a>"),v+="</li>",l=c?v+l:l+v}}return s.html(l),s.find('[title="Lowercase"]').attr("title",e.lang.toolbar.lowercase),s.find('[title="ucwords"]').attr("title",e.lang.toolbar.ucwords),this.setToolbarHandler(),this.setToolbarAutoFixed(),this},dialogLockScreen:function(){return e.proxy(t.dialogLockScreen,this)(),this},dialogShowMask:function(i){return e.proxy(t.dialogShowMask,this)(i),this},getToolbarHandles:function(e){var i=this.toolbarHandlers=t.toolbarHandlers;return e&&"undefined"!=typeof toolbarIconHandlers[e]?i[e]:i},setToolbarHandler:function(){var i=this,o=this.settings;if(!o.toolbar||o.readOnly)return this;var r=this.toolbar,n=this.cm,a=this.classPrefix,s=this.toolbarIcons=r.find("."+a+"menu > li > a"),l=this.getToolbarHandles();return s.bind(t.mouseOrTouch("click","touchend"),function(t){var r=e(this).children(".fa"),a=r.attr("name"),s=n.getCursor(),c=n.getSelection();return""!==a?(i.activeIcon=r,"undefined"!=typeof l[a]?e.proxy(l[a],i)(n):"undefined"!=typeof o.toolbarHandlers[a]&&e.proxy(o.toolbarHandlers[a],i)(n,r,s,c),"link"!==a&&"reference-link"!==a&&"image"!==a&&"code-block"!==a&&"preformatted-text"!==a&&"watch"!==a&&"preview"!==a&&"search"!==a&&"fullscreen"!==a&&"info"!==a&&n.focus(),!1):void 0}),this},createDialog:function(i){return e.proxy(t.createDialog,this)(i)},createInfoDialog:function(){var e=this,i=this.editor,o=this.classPrefix,r=['<div class="'+o+"dialog "+o+'dialog-info" style="">','<div class="'+o+'dialog-container">','<h1><i class="editormd-logo editormd-logo-lg editormd-logo-color"></i> '+t.title+"<small>v"+t.version+"</small></h1>","<p>"+this.lang.description+"</p>",'<p style="margin: 10px 0 20px 0;"><a href="'+t.homePage+'" target="_blank">'+t.homePage+' <i class="fa fa-external-link"></i></a></p>','<p style="font-size: 0.85em;">Copyright &copy; 2015 <a href="https://github.com/pandao" target="_blank" class="hover-link">Pandao</a>, The <a href="https://github.com/pandao/editor.md/blob/master/LICENSE" target="_blank" class="hover-link">MIT</a> License.</p>',"</div>",'<a href="javascript:;" class="fa fa-close '+o+'dialog-close"></a>',"</div>"].join("\n");i.append(r);var n=this.infoDialog=i.children("."+o+"dialog-info");return n.find("."+o+"dialog-close").bind(t.mouseOrTouch("click","touchend"),function(){e.hideInfoDialog()}),n.css("border",t.isIE8?"1px solid #ddd":"").css("z-index",t.dialogZindex).show(),this.infoDialogPosition(),this},infoDialogPosition:function(){var t=this.infoDialog,i=function(){t.css({top:(e(window).height()-t.height())/2+"px",left:(e(window).width()-t.width())/2+"px"})};return i(),e(window).resize(i),this},showInfoDialog:function(){e("html,body").css("overflow-x","hidden");var i=this.editor,o=this.settings,r=this.infoDialog=i.children("."+this.classPrefix+"dialog-info");return r.length<1&&this.createInfoDialog(),this.lockScreen(!0),this.mask.css({opacity:o.dialogMaskOpacity,backgroundColor:o.dialogMaskBgColor}).show(),r.css("z-index",t.dialogZindex).show(),this.infoDialogPosition(),this},hideInfoDialog:function(){return e("html,body").css("overflow-x",""),this.infoDialog.hide(),this.mask.hide(),this.lockScreen(!1),this},lockScreen:function(e){return t.lockScreen(e),this.resize(),this},recreate:function(){var e=this.editor,t=this.settings;return this.codeMirror.remove(),this.setCodeMirror(),t.readOnly||(e.find(".editormd-dialog").length>0&&e.find(".editormd-dialog").remove(),t.toolbar&&(this.getToolbarHandles(),this.setToolbar())),this.loadedDisplay(!0),this},previewCodeHighlight:function(){var e=this.settings,t=this.previewContainer;return e.previewCodeHighlight&&(t.find("pre").addClass("prettyprint linenums"),"undefined"!=typeof prettyPrint&&prettyPrint()),this},katexRender:function(){return null===i?this:(this.previewContainer.find("."+t.classNames.tex).each(function(){var i=e(this);t.$katex.render(i.text(),i[0]),i.find(".katex").css("font-size","1.6em")}),this)},flowChartAndSequenceDiagramRender:function(){var i=this,r=this.settings,n=this.previewContainer;if(t.isIE8)return this;if(r.flowChart){if(null===o)return this;n.find(".flowchart").flowChart()}r.sequenceDiagram&&n.find(".sequence-diagram").sequenceDiagram({theme:"simple"});var a=i.preview,s=i.codeMirror,l=s.find(".CodeMirror-scroll"),c=l.height(),h=l.scrollTop(),d=h/l[0].scrollHeight,u=0;a.find(".markdown-toc-list").each(function(){u+=e(this).height()});var f=a.find(".editormd-toc-menu").height();return f=f?f:0,a.scrollTop(0===h?0:h+c>=l[0].scrollHeight-16?a[0].scrollHeight:(a[0].scrollHeight+u+f)*d),this},registerKeyMaps:function(i){var o=this,r=this.cm,n=this.settings,a=t.toolbarHandlers,s=n.disabledKeyMaps;if(i=i||null){for(var l in i)if(e.inArray(l,s)<0){var c={};c[l]=i[l],r.addKeyMap(i)}}else{for(var h in t.keyMaps){var d=t.keyMaps[h],u="string"==typeof d?e.proxy(a[d],o):e.proxy(d,o);if(e.inArray(h,["F9","F10","F11"])<0&&e.inArray(h,s)<0){var f={};f[h]=u,r.addKeyMap(f)}}e(window).keydown(function(t){var i={120:"F9",121:"F10",122:"F11"};if(e.inArray(i[t.keyCode],s)<0)switch(t.keyCode){case 120:return e.proxy(a.watch,o)(),!1;case 121:return e.proxy(a.preview,o)(),!1;case 122:return e.proxy(a.fullscreen,o)(),!1}})}return this},bindScrollEvent:function(){var i=this,o=this.preview,r=this.settings,n=this.codeMirror,a=t.mouseOrTouch;if(!r.syncScrolling)return this;var s=function(){n.find(".CodeMirror-scroll").bind(a("scroll","touchmove"),function(t){var n=e(this).height(),a=e(this).scrollTop(),s=a/e(this)[0].scrollHeight,l=0;o.find(".markdown-toc-list").each(function(){l+=e(this).height()});var c=o.find(".editormd-toc-menu").height();c=c?c:0,o.scrollTop(0===a?0:a+n>=e(this)[0].scrollHeight-16?o[0].scrollHeight:(o[0].scrollHeight+l+c)*s),e.proxy(r.onscroll,i)(t)})},l=function(){n.find(".CodeMirror-scroll").unbind(a("scroll","touchmove"))},c=function(){o.bind(a("scroll","touchmove"),function(t){var o=e(this).height(),a=e(this).scrollTop(),s=a/e(this)[0].scrollHeight,l=n.find(".CodeMirror-scroll");l.scrollTop(0===a?0:a+o>=e(this)[0].scrollHeight?l[0].scrollHeight:l[0].scrollHeight*s),e.proxy(r.onpreviewscroll,i)(t)})},h=function(){o.unbind(a("scroll","touchmove"))};return n.bind({mouseover:s,mouseout:l,touchstart:s,touchend:l}),"single"===r.syncScrolling?this:(o.bind({mouseover:c,mouseout:h,touchstart:c,touchend:h}),this)},bindChangeEvent:function(){var e=this,t=this.cm,o=this.settings;return o.syncScrolling?(t.on("change",function(t,r){o.watch&&e.previewContainer.css("padding",o.autoHeight?"20px 20px 50px 40px":"20px"),i=setTimeout(function(){clearTimeout(i),e.save(),i=null},o.delay)}),this):this},loadedDisplay:function(t){t=t||!1;var i=this,o=this.editor,r=this.preview,n=this.settings;return this.containerMask.hide(),this.save(),n.watch&&r.show(),o.data("oldWidth",o.width()).data("oldHeight",o.height()),this.resize(),this.registerKeyMaps(),e(window).resize(function(){i.resize()}),this.bindScrollEvent().bindChangeEvent(),t||e.proxy(n.onload,this)(),this.state.loaded=!0,this},width:function(e){return this.editor.css("width","number"==typeof e?e+"px":e),this.resize(),this},height:function(e){return this.editor.css("height","number"==typeof e?e+"px":e),this.resize(),this},resize:function(t,i){t=t||null,i=i||null;var o=this.state,r=this.editor,n=this.preview,a=this.toolbar,s=this.settings,l=this.codeMirror;if(t&&r.css("width","number"==typeof t?t+"px":t),!s.autoHeight||o.fullscreen||o.preview?(i&&r.css("height","number"==typeof i?i+"px":i),o.fullscreen&&r.height(e(window).height()),s.toolbar&&!s.readOnly?l.css("margin-top",a.height()+1).height(r.height()-a.height()):l.css("margin-top",0).height(r.height())):(r.css("height","auto"),l.css("height","auto")),s.watch)if(l.width(r.width()/2),n.width(o.preview?r.width():r.width()/2),this.previewContainer.css("padding",s.autoHeight?"20px 20px 50px 40px":"20px"),s.toolbar&&!s.readOnly?n.css("top",a.height()+1):n.css("top",0),!s.autoHeight||o.fullscreen||o.preview){var c=s.toolbar&&!s.readOnly?r.height()-a.height():r.height();n.height(c)}else n.height("");else l.width(r.width()),n.hide();return o.loaded&&e.proxy(s.onresize,this)(),this},save:function(){if(null===i)return this;var r=this,n=this.state,a=this.settings,s=this.cm,l=s.getValue(),c=this.previewContainer;if("gfm"!==a.mode&&"markdown"!==a.mode)return this.markdownTextarea.val(l),this;var h=t.$marked,d=this.markdownToC=[],u=this.markedRendererOptions={toc:a.toc,tocm:a.tocm,tocStartLevel:a.tocStartLevel,pageBreak:a.pageBreak,taskList:a.taskList,emoji:a.emoji,tex:a.tex,atLink:a.atLink,emailLink:a.emailLink,flowChart:a.flowChart,sequenceDiagram:a.sequenceDiagram,previewCodeHighlight:a.previewCodeHighlight},f=this.markedOptions={renderer:t.markedRenderer(d,u),gfm:!0,tables:!0,breaks:!0,pedantic:!1,sanitize:a.htmlDecode?!1:!0,smartLists:!0,smartypants:!0};h.setOptions(f);var g=t.$marked(l,f);if(g=t.filterHTMLTags(g,a.htmlDecode),this.markdownTextarea.text(l),s.save(),a.saveHTMLToTextarea&&this.htmlTextarea.text(g),a.watch||!a.watch&&n.preview){if(c.html(g),this.previewCodeHighlight(),a.toc){var p=""===a.tocContainer?c:e(a.tocContainer),m=p.find("."+this.classPrefix+"toc-menu");p.attr("previewContainer",""===a.tocContainer?"true":"false"),""!==a.tocContainer&&m.length>0&&m.remove(),t.markdownToCRenderer(d,p,a.tocDropdown,a.tocStartLevel),(a.tocDropdown||p.find("."+this.classPrefix+"toc-menu").length>0)&&t.tocDropdownMenu(p,""!==a.tocTitle?a.tocTitle:this.lang.tocTitle),""!==a.tocContainer&&c.find(".markdown-toc").css("border","none")}a.tex&&(!t.kaTeXLoaded&&a.autoLoadModules?t.loadKaTeX(function(){t.$katex=katex,t.kaTeXLoaded=!0,r.katexRender()}):(t.$katex=katex,this.katexRender())),(a.flowChart||a.sequenceDiagram)&&(o=setTimeout(function(){clearTimeout(o),r.flowChartAndSequenceDiagramRender(),o=null},10)),n.loaded&&e.proxy(a.onchange,this)()}return this},focus:function(){return this.cm.focus(),this},setCursor:function(e){return this.cm.setCursor(e),this},getCursor:function(){return this.cm.getCursor()},setSelection:function(e,t){return this.cm.setSelection(e,t),this},getSelection:function(){return this.cm.getSelection()},setSelections:function(e){return this.cm.setSelections(e),this},getSelections:function(){return this.cm.getSelections()},replaceSelection:function(e){return this.cm.replaceSelection(e),this},insertValue:function(e){return this.replaceSelection(e),this},appendMarkdown:function(e){var t=(this.settings,this.cm);return t.setValue(t.getValue()+e),this},setMarkdown:function(e){return this.cm.setValue(e||this.settings.markdown),this},getMarkdown:function(){return this.cm.getValue()},getValue:function(){return this.cm.getValue()},setValue:function(e){return this.cm.setValue(e),this},clear:function(){return this.cm.setValue(""),this},getHTML:function(){return this.settings.saveHTMLToTextarea?this.htmlTextarea.val():(alert("Error: settings.saveHTMLToTextarea == false"),!1)},getTextareaSavedHTML:function(){return this.getHTML()},getPreviewedHTML:function(){return this.settings.watch?this.previewContainer.html():(alert("Error: settings.watch == false"),!1)},watch:function(t){var o=this.settings;if(e.inArray(o.mode,["gfm","markdown"])<0)return this;if(this.state.watching=o.watch=!0,this.preview.show(),this.toolbar){var r=o.toolbarIconsClass.watch,n=o.toolbarIconsClass.unwatch,a=this.toolbar.find(".fa[name=watch]");a.parent().attr("title",o.lang.toolbar.watch),a.removeClass(n).addClass(r)}return this.codeMirror.css("border-right","1px solid #ddd").width(this.editor.width()/2),i=0,this.save().resize(),o.onwatch||(o.onwatch=t||function(){}),e.proxy(o.onwatch,this)(),this},unwatch:function(t){var i=this.settings;if(this.state.watching=i.watch=!1,this.preview.hide(),this.toolbar){var o=i.toolbarIconsClass.watch,r=i.toolbarIconsClass.unwatch,n=this.toolbar.find(".fa[name=watch]");n.parent().attr("title",i.lang.toolbar.unwatch),n.removeClass(o).addClass(r)}return this.codeMirror.css("border-right","none").width(this.editor.width()),this.resize(),i.onunwatch||(i.onunwatch=t||function(){}),e.proxy(i.onunwatch,this)(),this},show:function(t){t=t||function(){};var i=this;return this.editor.show(0,function(){e.proxy(t,i)()}),this},hide:function(t){t=t||function(){};var i=this;return this.editor.hide(0,function(){e.proxy(t,i)()}),this},previewing:function(){var i=this,o=this.editor,r=this.preview,n=this.toolbar,a=this.settings,s=this.codeMirror,l=this.previewContainer;if(e.inArray(a.mode,["gfm","markdown"])<0)return this;a.toolbar&&n&&(n.toggle(),n.find(".fa[name=preview]").toggleClass("active")),s.toggle();var c=function(e){e.shiftKey&&27===e.keyCode&&i.previewed()};"none"===s.css("display")?(this.state.preview=!0,this.state.fullscreen&&r.css("background","#fff"),o.find("."+this.classPrefix+"preview-close-btn").show().bind(t.mouseOrTouch("click","touchend"),function(){i.previewed()}),a.watch?l.css("padding",""):this.save(),l.addClass(this.classPrefix+"preview-active"),r.show().css({position:"",top:0,width:o.width(),height:a.autoHeight&&!this.state.fullscreen?"auto":o.height()}),this.state.loaded&&e.proxy(a.onpreviewing,this)(),e(window).bind("keyup",c)):(e(window).unbind("keyup",c),this.previewed())},previewed:function(){var i=this.editor,o=this.preview,r=this.toolbar,n=this.settings,a=this.previewContainer,s=i.find("."+this.classPrefix+"preview-close-btn");return this.state.preview=!1,this.codeMirror.show(),n.toolbar&&r.show(),o[n.watch?"show":"hide"](),s.hide().unbind(t.mouseOrTouch("click","touchend")),a.removeClass(this.classPrefix+"preview-active"),n.watch&&a.css("padding","20px"),o.css({background:null,position:"absolute",width:i.width()/2,height:n.autoHeight&&!this.state.fullscreen?"auto":i.height()-r.height(),top:n.toolbar?r.height():0}),this.state.loaded&&e.proxy(n.onpreviewed,this)(),this},fullscreen:function(){var t=this,i=this.state,o=this.editor,r=(this.preview,this.toolbar),n=this.settings,a=this.classPrefix+"fullscreen";r&&r.find(".fa[name=fullscreen]").parent().toggleClass("active");var s=function(e){e.shiftKey||27!==e.keyCode||i.fullscreen&&t.fullscreenExit()};return o.hasClass(a)?(e(window).unbind("keyup",s),this.fullscreenExit()):(i.fullscreen=!0,e("html,body").css("overflow","hidden"),o.css({width:e(window).width(),height:e(window).height()}).addClass(a),this.resize(),e.proxy(n.onfullscreen,this)(),e(window).bind("keyup",s)),this},fullscreenExit:function(){var t=this.editor,i=this.settings,o=this.toolbar,r=this.classPrefix+"fullscreen";return this.state.fullscreen=!1,o&&o.find(".fa[name=fullscreen]").parent().removeClass("active"),e("html,body").css("overflow",""),t.css({width:t.data("oldWidth"),height:t.data("oldHeight")}).removeClass(r),this.resize(),e.proxy(i.onfullscreenExit,this)(),this},executePlugin:function(i,o){var r=this,n=this.cm,a=this.settings;return o=a.pluginPath+o,"function"==typeof define?"undefined"==typeof this[i]?(alert("Error: "+i+" plugin is not found, you are not load this plugin."),this):(this[i](n),this):(e.inArray(o,t.loadFiles.plugin)<0?t.loadPlugin(o,function(){t.loadPlugins[i]=r[i],r[i](n)}):e.proxy(t.loadPlugins[i],this)(n),this)},search:function(e){var t=this.settings;return t.searchReplace?(t.readOnly||this.cm.execCommand(e||"find"),this):(alert("Error: settings.searchReplace == false"),this)},searchReplace:function(){return this.search("replace"),this},searchReplaceAll:function(){return this.search("replaceAll"),this}},t.fn.init.prototype=t.fn,t.dialogLockScreen=function(){var t=this.settings||{dialogLockScreen:!0};t.dialogLockScreen&&(e("html,body").css("overflow","hidden"),this.resize())},t.dialogShowMask=function(t){var i=this.editor,o=this.settings||{dialogShowMask:!0};t.css({top:(e(window).height()-t.height())/2+"px",left:(e(window).width()-t.width())/2+"px"}),o.dialogShowMask&&i.children("."+this.classPrefix+"mask").css("z-index",parseInt(t.css("z-index"))-1).show()},t.toolbarHandlers={undo:function(){this.cm.undo()},redo:function(){this.cm.redo()},bold:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();e.replaceSelection("**"+i+"**"),""===i&&e.setCursor(t.line,t.ch+2)},del:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();e.replaceSelection("~~"+i+"~~"),""===i&&e.setCursor(t.line,t.ch+2)},italic:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();e.replaceSelection("*"+i+"*"),""===i&&e.setCursor(t.line,t.ch+1)},quote:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();0!==t.ch?(e.setCursor(t.line,0),e.replaceSelection("> "+i),e.setCursor(t.line,t.ch+2)):e.replaceSelection("> "+i)},ucfirst:function(){var e=this.cm,i=e.getSelection(),o=e.listSelections();e.replaceSelection(t.firstUpperCase(i)),e.setSelections(o)},ucwords:function(){var e=this.cm,i=e.getSelection(),o=e.listSelections();e.replaceSelection(t.wordsFirstUpperCase(i)),e.setSelections(o)},uppercase:function(){var e=this.cm,t=e.getSelection(),i=e.listSelections();e.replaceSelection(t.toUpperCase()),e.setSelections(i)},lowercase:function(){var e=this.cm,t=(e.getCursor(),e.getSelection()),i=e.listSelections();e.replaceSelection(t.toLowerCase()),e.setSelections(i)},h1:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();0!==t.ch?(e.setCursor(t.line,0),e.replaceSelection("# "+i),e.setCursor(t.line,t.ch+2)):e.replaceSelection("# "+i)},h2:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();0!==t.ch?(e.setCursor(t.line,0),
e.replaceSelection("## "+i),e.setCursor(t.line,t.ch+3)):e.replaceSelection("## "+i)},h3:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();0!==t.ch?(e.setCursor(t.line,0),e.replaceSelection("### "+i),e.setCursor(t.line,t.ch+4)):e.replaceSelection("### "+i)},h4:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();0!==t.ch?(e.setCursor(t.line,0),e.replaceSelection("#### "+i),e.setCursor(t.line,t.ch+5)):e.replaceSelection("#### "+i)},h5:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();0!==t.ch?(e.setCursor(t.line,0),e.replaceSelection("##### "+i),e.setCursor(t.line,t.ch+6)):e.replaceSelection("##### "+i)},h6:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();0!==t.ch?(e.setCursor(t.line,0),e.replaceSelection("###### "+i),e.setCursor(t.line,t.ch+7)):e.replaceSelection("###### "+i)},"list-ul":function(){var e=this.cm,t=(e.getCursor(),e.getSelection());if(""===t)e.replaceSelection("- "+t);else{for(var i=t.split("\n"),o=0,r=i.length;r>o;o++)i[o]=""===i[o]?"":"- "+i[o];e.replaceSelection(i.join("\n"))}},"list-ol":function(){var e=this.cm,t=(e.getCursor(),e.getSelection());if(""===t)e.replaceSelection("1. "+t);else{for(var i=t.split("\n"),o=0,r=i.length;r>o;o++)i[o]=""===i[o]?"":o+1+". "+i[o];e.replaceSelection(i.join("\n"))}},hr:function(){{var e=this.cm,t=e.getCursor();e.getSelection()}e.replaceSelection((0!==t.ch?"\n\n":"\n")+"------------\n\n")},tex:function(){if(!this.settings.tex)return alert("settings.tex === false"),this;var e=this.cm,t=e.getCursor(),i=e.getSelection();e.replaceSelection("$$"+i+"$$"),""===i&&e.setCursor(t.line,t.ch+2)},link:function(){this.executePlugin("linkDialog","link-dialog/link-dialog")},"reference-link":function(){this.executePlugin("referenceLinkDialog","reference-link-dialog/reference-link-dialog")},pagebreak:function(){if(!this.settings.pageBreak)return alert("settings.pageBreak === false"),this;{var e=this.cm;e.getSelection()}e.replaceSelection("\r\n[========]\r\n")},image:function(){this.executePlugin("imageDialog","image-dialog/image-dialog")},code:function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();e.replaceSelection("`"+i+"`"),""===i&&e.setCursor(t.line,t.ch+1)},"code-block":function(){this.executePlugin("codeBlockDialog","code-block-dialog/code-block-dialog")},"preformatted-text":function(){this.executePlugin("preformattedTextDialog","preformatted-text-dialog/preformatted-text-dialog")},table:function(){this.executePlugin("tableDialog","table-dialog/table-dialog")},datetime:function(){var e=this.cm,i=(e.getSelection(),new Date,this.settings.lang.name),o=t.dateFormat()+" "+t.dateFormat("zh-cn"===i||"zh-tw"===i?"cn-week-day":"week-day");e.replaceSelection(o)},emoji:function(){this.executePlugin("emojiDialog","emoji-dialog/emoji-dialog")},"html-entities":function(){this.executePlugin("htmlEntitiesDialog","html-entities-dialog/html-entities-dialog")},"goto-line":function(){this.executePlugin("gotoLineDialog","goto-line-dialog/goto-line-dialog")},watch:function(){this[this.settings.watch?"unwatch":"watch"]()},preview:function(){this.previewing()},fullscreen:function(){this.fullscreen()},clear:function(){this.clear()},search:function(){this.search()},help:function(){this.executePlugin("helpDialog","help-dialog/help-dialog")},info:function(){this.showInfoDialog()}},t.keyMaps={"Ctrl-1":"h1","Ctrl-2":"h2","Ctrl-3":"h3","Ctrl-4":"h4","Ctrl-5":"h5","Ctrl-6":"h6","Ctrl-B":"bold","Ctrl-D":"datetime","Ctrl-E":function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();return this.settings.emoji?(e.replaceSelection(":"+i+":"),void(""===i&&e.setCursor(t.line,t.ch+1))):void alert("Error: settings.emoji == false")},"Ctrl-Alt-G":"goto-line","Ctrl-H":"hr","Ctrl-I":"italic","Ctrl-K":"code","Ctrl-L":function(){var e=this.cm,t=e.getCursor(),i=e.getSelection(),o=""===i?"":' "'+i+'"';e.replaceSelection("["+i+"]("+o+")"),""===i&&e.setCursor(t.line,t.ch+1)},"Ctrl-U":"list-ul","Shift-Ctrl-A":function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();return this.settings.atLink?(e.replaceSelection("@"+i),void(""===i&&e.setCursor(t.line,t.ch+1))):void alert("Error: settings.atLink == false")},"Shift-Ctrl-C":"code","Shift-Ctrl-Q":"quote","Shift-Ctrl-S":"del","Shift-Ctrl-K":"tex","Shift-Alt-C":function(){var e=this.cm,t=e.getCursor(),i=e.getSelection();e.replaceSelection(["```",i,"```"].join("\n")),""===i&&e.setCursor(t.line,t.ch+3)},"Shift-Ctrl-Alt-C":"code-block","Shift-Ctrl-H":"html-entities","Shift-Alt-H":"help","Shift-Ctrl-E":"emoji","Shift-Ctrl-U":"uppercase","Shift-Alt-U":"ucwords","Shift-Ctrl-Alt-U":"ucfirst","Shift-Alt-L":"lowercase","Shift-Ctrl-I":function(){var e=this.cm,t=e.getCursor(),i=e.getSelection(),o=""===i?"":' "'+i+'"';e.replaceSelection("!["+i+"]("+o+")"),""===i&&e.setCursor(t.line,t.ch+4)},"Shift-Ctrl-Alt-I":"image","Shift-Ctrl-L":"link","Shift-Ctrl-O":"list-ol","Shift-Ctrl-P":"preformatted-text","Shift-Ctrl-T":"table","Shift-Alt-P":"pagebreak",F9:"watch",F10:"preview",F11:"fullscreen"};var r=function(e){return String.prototype.trim?e.trim():e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")};t.trim=r;var n=function(e){return e.toLowerCase().replace(/\b(\w)|\s(\w)/g,function(e){return e.toUpperCase()})};t.ucwords=t.wordsFirstUpperCase=n;var a=function(e){return e.toLowerCase().replace(/\b(\w)/,function(e){return e.toUpperCase()})};return t.firstUpperCase=t.ucfirst=a,t.urls={atLinkBase:"https://github.com/"},t.regexs={atLink:/@(\w+)/g,email:/(\w+)@(\w+)\.(\w+)\.?(\w+)?/g,emailLink:/(mailto:)?([\w\.\_]+)@(\w+)\.(\w+)\.?(\w+)?/g,emoji:/:([\w\+-]+):/g,emojiDatetime:/(\d{2}:\d{2}:\d{2})/g,twemoji:/:(tw-([\w]+)-?(\w+)?):/g,fontAwesome:/:(fa-([\w]+)(-(\w+)){0,}):/g,editormdLogo:/:(editormd-logo-?(\w+)?):/g,pageBreak:/^\[[=]{8,}\]$/},t.emoji={path:"http://www.emoji-cheat-sheet.com/graphics/emojis/",ext:".png"},t.twemoji={path:"http://twemoji.maxcdn.com/36x36/",ext:".png"},t.markedRenderer=function(i,o){var n={toc:!0,tocm:!1,tocStartLevel:1,pageBreak:!0,atLink:!0,emailLink:!0,taskList:!1,emoji:!1,tex:!1,flowChart:!1,sequenceDiagram:!1},a=e.extend(n,o||{}),s=t.$marked,l=new s.Renderer;i=i||[];var c=t.regexs,h=c.atLink,d=c.emoji,u=c.email,f=c.emailLink,g=c.twemoji,p=c.fontAwesome,m=c.editormdLogo,w=c.pageBreak;return l.emoji=function(e){e=e.replace(t.regexs.emojiDatetime,function(e){return e.replace(/:/g,"&#58;")});var i=e.match(d);if(!i||!a.emoji)return e;for(var o=0,r=i.length;r>o;o++)":+1:"===i[o]&&(i[o]=":\\+1:"),e=e.replace(new RegExp(i[o]),function(e,i){var o=e.match(p),r=e.replace(/:/g,"");if(o)for(var n=0,a=o.length;a>n;n++){var s=o[n].replace(/:/g,"");return'<i class="fa '+s+' fa-emoji" title="'+s.replace("fa-","")+'"></i>'}else{var l=e.match(m),c=e.match(g);if(l)for(var h=0,d=l.length;d>h;h++){var u=l[h].replace(/:/g,"");return'<i class="'+u+'" title="Editor.md logo ('+u+')"></i>'}else{if(!c){var f="+1"===r?"plus1":r;return f="black_large_square"===f?"black_square":f,f="moon"===f?"waxing_gibbous_moon":f,'<img src="'+t.emoji.path+f+t.emoji.ext+'" class="emoji" title="&#58;'+r+'&#58;" alt="&#58;'+r+'&#58;" />'}for(var w=0,v=c.length;v>w;w++){var k=c[w].replace(/:/g,"").replace("tw-","");return'<img src="'+t.twemoji.path+k+t.twemoji.ext+'" title="twemoji-'+k+'" alt="twemoji-'+k+'" class="emoji twemoji" />'}}}});return e},l.atLink=function(i){return h.test(i)?(a.atLink&&(i=i.replace(u,function(e,t,i,o){return e.replace(/@/g,"_#_&#64;_#_")}),i=i.replace(h,function(e,i){return'<a href="'+t.urls.atLinkBase+i+'" title="&#64;'+i+'" class="at-link">'+e+"</a>"}).replace(/_#_&#64;_#_/g,"@")),a.emailLink&&(i=i.replace(f,function(t,i,o,r,n){return!i&&e.inArray(n,"jpg|jpeg|png|gif|webp|ico|icon|pdf".split("|"))<0?'<a href="mailto:'+t+'">'+t+"</a>":t})),i):i},l.link=function(e,t,i){if(this.options.sanitize){try{var o=decodeURIComponent(unescape(e)).replace(/[^\w:]/g,"").toLowerCase()}catch(r){return""}if(0===o.indexOf("javascript:"))return""}var n='<a href="'+e+'"';return h.test(t)||h.test(i)?(t&&(n+=' title="'+t.replace(/@/g,"&#64;")),n+'">'+i.replace(/@/g,"&#64;")+"</a>"):(t&&(n+=' title="'+t+'"'),n+=">"+i+"</a>")},l.heading=function(e,t,o){var n=e,a=/\s*\<a\s*href\=\"(.*)\"\s*([^\>]*)\>(.*)\<\/a\>\s*/;if(a.test(e)){var s=[];e=e.split(/\<a\s*([^\>]+)\>([^\>]*)\<\/a\>/);for(var l=0,c=e.length;c>l;l++)s.push(e[l].replace(/\s*href\=\"(.*)\"\s*/g,""));e=s.join(" ")}e=r(e);var h=e.toLowerCase().replace(/[^\w]+/g,"-"),d={text:e,level:t,slug:h},u=/^[\u4e00-\u9fa5]+$/.test(e),f=u?escape(e).replace(/\%/g,""):e.toLowerCase().replace(/[^\w]+/g,"-");i.push(d);var g="<h"+t+' id="h'+t+"-"+this.options.headerPrefix+f+'">';return g+='<a name="'+e+'" class="reference-link"></a>',g+='<span class="header-link octicon octicon-link"></span>',g+=this.atLink(a?this.emoji(n):this.emoji(e)),g+="</h"+t+">"},l.pageBreak=function(e){return w.test(e)&&a.pageBreak&&(e='<hr style="page-break-after:always;" class="page-break editormd-page-break" />'),e},l.paragraph=function(e){var i=/\$\$(.*)\$\$/g.test(e),o=/^\$\$(.*)\$\$$/.test(e),r=o?' class="'+t.classNames.tex+'"':"",n=a.tocm?/^(\[TOC\]|\[TOCM\])$/.test(e):/^\[TOC\]$/.test(e),s=/^\[TOCM\]$/.test(e);e=!o&&i?e.replace(/(\$\$([^\$]*)\$\$)+/g,function(e,i){return'<span class="'+t.classNames.tex+'">'+i.replace(/\$/g,"")+"</span>"}):o?e.replace(/\$/g,""):e;var l='<div class="markdown-toc editormd-markdown-toc">'+e+"</div>";return n?s?'<div class="editormd-toc-menu">'+l+"</div><br/>":l:w.test(e)?this.pageBreak(e):"<p"+r+">"+this.atLink(this.emoji(e))+"</p>\n"},l.code=function(e,i,o){return"seq"===i||"sequence"===i?'<div class="sequence-diagram">'+e+"</div>":"flow"===i?'<div class="flowchart">'+e+"</div>":"math"===i||"latex"===i||"katex"===i?'<p class="'+t.classNames.tex+'">'+e+"</p>":s.Renderer.prototype.code.apply(this,arguments)},l.tablecell=function(e,t){var i=t.header?"th":"td",o=t.align?"<"+i+' style="text-align:'+t.align+'">':"<"+i+">";return o+this.atLink(this.emoji(e))+"</"+i+">\n"},l.listitem=function(e){return a.taskList&&/^\s*\[[x\s]\]\s*/.test(e)?(e=e.replace(/^\s*\[\s\]\s*/,'<input type="checkbox" class="task-list-item-checkbox" /> ').replace(/^\s*\[x\]\s*/,'<input type="checkbox" class="task-list-item-checkbox" checked disabled /> '),'<li style="list-style: none;">'+this.atLink(this.emoji(e))+"</li>"):"<li>"+this.atLink(this.emoji(e))+"</li>"},l},t.markdownToCRenderer=function(e,t,i,o){var r="",n=0,a=this.classPrefix;o=o||1;for(var s=0,l=e.length;l>s;s++){var c=e[s].text,h=e[s].level;o>h||(r+=h>n?"":n>h?new Array(n-h+2).join("</ul></li>"):"</ul></li>",r+='<li><a class="toc-level-'+h+'" href="#'+c+'" level="'+h+'">'+c+"</a><ul>",n=h)}var d=t.find(".markdown-toc");if(d.length<1&&"false"===t.attr("previewContainer")){var u='<div class="markdown-toc '+a+'markdown-toc"></div>';u=i?'<div class="'+a+'toc-menu">'+u+"</div>":u,t.html(u),d=t.find(".markdown-toc")}return i&&d.wrap('<div class="'+a+'toc-menu"></div><br/>'),d.html('<ul class="markdown-toc-list"></ul>').children(".markdown-toc-list").html(r.replace(/\r?\n?\<ul\>\<\/ul\>/g,"")),d},t.tocDropdownMenu=function(t,i){i=i||"Table of Contents";var o=400,r=t.find("."+this.classPrefix+"toc-menu");return r.each(function(){var t=e(this),r=t.children(".markdown-toc"),n='<i class="fa fa-angle-down"></i>',a='<a href="javascript:;" class="toc-menu-btn">'+n+i+"</a>",s=r.children("ul"),l=s.find("li");r.append(a),l.first().before("<li><h1>"+i+" "+n+"</h1></li>"),t.mouseover(function(){s.show(),l.each(function(){var t=e(this),i=t.children("ul");if(""===i.html()&&i.remove(),i.length>0&&""!==i.html()){var r=t.children("a").first();r.children(".fa").length<1&&r.append(e(n).css({"float":"right",paddingTop:"4px"}))}t.mouseover(function(){i.css("z-index",o).show(),o+=1}).mouseleave(function(){i.hide()})})}).mouseleave(function(){s.hide()})}),r},t.filterHTMLTags=function(t,i){if("string"!=typeof t&&(t=new String(t)),"string"!=typeof i)return t;for(var o=i.split("|"),r=o[0].split(","),n=o[1],a=0,s=r.length;s>a;a++){var l=r[a];t=t.replace(new RegExp("<s*"+l+"s*([^>]*)>([^>]*)<s*/"+l+"s*>","igm"),"")}if("undefined"!=typeof n){var c=/\<(\w+)\s*([^\>]*)\>([^\>]*)\<\/(\w+)\>/gi;t="*"===n?t.replace(c,function(e,t,i,o,r){return"<"+t+">"+o+"</"+r+">"}):"on*"===n?t.replace(c,function(t,i,o,r,n){var a=e("<"+i+">"+r+"</"+n+">"),s=e(t)[0].attributes,l={};e.each(s,function(e,t){'"'!==t.nodeName&&(l[t.nodeName]=t.nodeValue)}),e.each(l,function(e){0===e.indexOf("on")&&delete l[e]}),a.attr(l);var c="undefined"!=typeof a[1]?e(a[1]).text():"";return a[0].outerHTML+c}):t.replace(c,function(t,i,o,r){var a=n.split(","),s=e(t);return s.html(r),e.each(a,function(e){s.attr(a[e],null)}),s[0].outerHTML})}return t},t.markdownToHTML=function(i,o){var r={gfm:!0,toc:!0,tocm:!1,tocStartLevel:1,tocTitle:"目录",tocDropdown:!1,tocContainer:"",markdown:"",markdownSourceCode:!1,htmlDecode:!1,autoLoadKaTeX:!0,pageBreak:!0,atLink:!0,emailLink:!0,tex:!1,taskList:!1,emoji:!1,flowChart:!1,sequenceDiagram:!1,previewCodeHighlight:!0};t.$marked=marked;var n=e("#"+i),a=n.settings=e.extend(!0,r,o||{}),s=n.find("textarea");s.length<1&&(n.append("<textarea></textarea>"),s=n.find("textarea"));var l=""===a.markdown?s.val():a.markdown,c=[],h={toc:a.toc,tocm:a.tocm,tocStartLevel:a.tocStartLevel,taskList:a.taskList,emoji:a.emoji,tex:a.tex,pageBreak:a.pageBreak,atLink:a.atLink,emailLink:a.emailLink,flowChart:a.flowChart,sequenceDiagram:a.sequenceDiagram,previewCodeHighlight:a.previewCodeHighlight},d={renderer:t.markedRenderer(c,h),gfm:a.gfm,tables:!0,breaks:!0,pedantic:!1,sanitize:a.htmlDecode?!1:!0,smartLists:!0,smartypants:!0};l=new String(l);var u=marked(l,d);u=t.filterHTMLTags(u,a.htmlDecode),a.markdownSourceCode?s.text(l):s.remove(),n.addClass("markdown-body "+this.classPrefix+"html-preview").append(u);var f=""!==a.tocContainer?e(a.tocContainer):n;if(""!==a.tocContainer&&f.attr("previewContainer",!1),a.toc&&(n.tocContainer=this.markdownToCRenderer(c,f,a.tocDropdown,a.tocStartLevel),(a.tocDropdown||n.find("."+this.classPrefix+"toc-menu").length>0)&&this.tocDropdownMenu(n,a.tocTitle),""!==a.tocContainer&&n.find(".editormd-toc-menu, .editormd-markdown-toc").remove()),a.previewCodeHighlight&&(n.find("pre").addClass("prettyprint linenums"),prettyPrint()),t.isIE8||(a.flowChart&&n.find(".flowchart").flowChart(),a.sequenceDiagram&&n.find(".sequence-diagram").sequenceDiagram({theme:"simple"})),a.tex){var g=function(){n.find("."+t.classNames.tex).each(function(){var t=e(this);katex.render(t.html().replace(/&lt;/g,"<").replace(/&gt;/g,">"),t[0]),t.find(".katex").css("font-size","1.6em")})};!a.autoLoadKaTeX||t.$katex||t.kaTeXLoaded?g():this.loadKaTeX(function(){t.$katex=katex,t.kaTeXLoaded=!0,g()})}return n.getMarkdown=function(){return s.val()},n},t.themes=["default","dark"],t.previewThemes=["default","dark"],t.editorThemes=["default","3024-day","3024-night","ambiance","ambiance-mobile","base16-dark","base16-light","blackboard","cobalt","eclipse","elegant","erlang-dark","lesser-dark","mbo","mdn-like","midnight","monokai","neat","neo","night","paraiso-dark","paraiso-light","pastel-on-dark","rubyblue","solarized","the-matrix","tomorrow-night-eighties","twilight","vibrant-ink","xq-dark","xq-light"],t.loadPlugins={},t.loadFiles={js:[],css:[],plugin:[]},t.loadPlugin=function(e,i,o){i=i||function(){},this.loadScript(e,function(){t.loadFiles.plugin.push(e),i()},o)},t.loadCSS=function(e,i,o){o=o||"head",i=i||function(){};var r=document.createElement("link");r.type="text/css",r.rel="stylesheet",r.onload=r.onreadystatechange=function(){t.loadFiles.css.push(e),i()},r.href=e+".css","head"===o?document.getElementsByTagName("head")[0].appendChild(r):document.body.appendChild(r)},t.isIE="Microsoft Internet Explorer"==navigator.appName,t.isIE8=t.isIE&&"8."==navigator.appVersion.match(/8./i),t.loadScript=function(e,i,o){o=o||"head",i=i||function(){};var r=null;r=document.createElement("script"),r.id=e.replace(/[\./]+/g,"-"),r.type="text/javascript",r.src=e+".js",t.isIE8?r.onreadystatechange=function(){r.readyState&&("loaded"===r.readyState||"complete"===r.readyState)&&(r.onreadystatechange=null,t.loadFiles.js.push(e),i())}:r.onload=function(){t.loadFiles.js.push(e),i()},"head"===o?document.getElementsByTagName("head")[0].appendChild(r):document.body.appendChild(r)},t.katexURL={css:"//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min",js:"//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min"},t.kaTeXLoaded=!1,t.loadKaTeX=function(e){t.loadCSS(t.katexURL.css,function(){t.loadScript(t.katexURL.js,e||function(){})})},t.lockScreen=function(t){e("html,body").css("overflow",t?"hidden":"")},t.createDialog=function(i){var o={name:"",width:420,height:240,title:"",drag:!0,closed:!0,content:"",mask:!0,maskStyle:{backgroundColor:"#fff",opacity:.1},lockScreen:!0,footer:!0,buttons:!1};i=e.extend(!0,o,i);var r=this,n=this.editor,a=t.classPrefix,s=(new Date).getTime(),l=""===i.name?a+"dialog-"+s:i.name,c=t.mouseOrTouch,h='<div class="'+a+"dialog "+l+'">';""!==i.title&&(h+='<div class="'+a+'dialog-header"'+(i.drag?' style="cursor: move;"':"")+">",h+='<strong class="'+a+'dialog-title">'+i.title+"</strong>",h+="</div>"),i.closed&&(h+='<a href="javascript:;" class="fa fa-close '+a+'dialog-close"></a>'),h+='<div class="'+a+'dialog-container">'+i.content,(i.footer||"string"==typeof i.footer)&&(h+='<div class="'+a+'dialog-footer">'+("boolean"==typeof i.footer?"":i.footer)+"</div>"),h+="</div>",h+='<div class="'+a+"dialog-mask "+a+'dialog-mask-bg"></div>',h+='<div class="'+a+"dialog-mask "+a+'dialog-mask-con"></div>',h+="</div>",n.append(h);var d=n.find("."+l);d.lockScreen=function(t){return i.lockScreen&&(e("html,body").css("overflow",t?"hidden":""),r.resize()),d},d.showMask=function(){return i.mask&&n.find("."+a+"mask").css(i.maskStyle).css("z-index",t.dialogZindex-1).show(),d},d.hideMask=function(){return i.mask&&n.find("."+a+"mask").hide(),d},d.loading=function(e){var t=d.find("."+a+"dialog-mask");return t[e?"show":"hide"](),d},d.lockScreen(!0).showMask(),d.show().css({zIndex:t.dialogZindex,border:t.isIE8?"1px solid #ddd":"",width:"number"==typeof i.width?i.width+"px":i.width,height:"number"==typeof i.height?i.height+"px":i.height});var u=function(){d.css({top:(e(window).height()-d.height())/2+"px",left:(e(window).width()-d.width())/2+"px"})};if(u(),e(window).resize(u),d.children("."+a+"dialog-close").bind(c("click","touchend"),function(){d.hide().lockScreen(!1).hideMask()}),"object"==typeof i.buttons){var f=d.footer=d.find("."+a+"dialog-footer");for(var g in i.buttons){var p=i.buttons[g],m=a+g+"-btn";f.append('<button class="'+a+"btn "+m+'">'+p[0]+"</button>"),p[1]=e.proxy(p[1],d),f.children("."+m).bind(c("click","touchend"),p[1])}}if(""!==i.title&&i.drag){var w,v,k=d.children("."+a+"dialog-header");i.mask||k.bind(c("click","touchend"),function(){t.dialogZindex+=2,d.css("z-index",t.dialogZindex)}),k.mousedown(function(e){e=e||window.event,w=e.clientX-parseInt(d[0].style.left),v=e.clientY-parseInt(d[0].style.top),document.onmousemove=y});var b=function(e){e.removeClass(a+"user-unselect").off("selectstart")},x=function(e){e.addClass(a+"user-unselect").on("selectstart",function(e){return!1})},y=function(t){t=t||window.event;var i,o,r=parseInt(d[0].style.left),n=parseInt(d[0].style.top);r>=0?r+d.width()<=e(window).width()?i=t.clientX-w:(i=e(window).width()-d.width(),document.onmousemove=null):(i=0,document.onmousemove=null),n>=0?o=t.clientY-v:(o=0,document.onmousemove=null),document.onselectstart=function(){return!1},x(e("body")),x(d),d[0].style.left=i+"px",d[0].style.top=o+"px"};document.onmouseup=function(){b(e("body")),b(d),document.onselectstart=null,document.onmousemove=null},k.touchDraggable=function(){var t=null,i=function(i){var o=i.originalEvent,r=e(this).parent().position();t={x:o.changedTouches[0].pageX-r.left,y:o.changedTouches[0].pageY-r.top}},o=function(i){i.preventDefault();var o=i.originalEvent;e(this).parent().css({top:o.changedTouches[0].pageY-t.y,left:o.changedTouches[0].pageX-t.x})};this.bind("touchstart",i).bind("touchmove",o)},k.touchDraggable()}return t.dialogZindex+=2,d},t.mouseOrTouch=function(e,t){e=e||"click",t=t||"touchend";var i=e;try{document.createEvent("TouchEvent"),i=t}catch(o){}return i},t.dateFormat=function(e){e=e||"";var t=function(e){return 10>e?"0"+e:e},i=new Date,o=i.getFullYear(),r=o.toString().slice(2,4),n=t(i.getMonth()+1),a=t(i.getDate()),s=i.getDay(),l=t(i.getHours()),c=t(i.getMinutes()),h=t(i.getSeconds()),d=t(i.getMilliseconds()),u="",f=r+"-"+n+"-"+a,g=o+"-"+n+"-"+a,p=l+":"+c+":"+h;switch(e){case"UNIX Time":u=i.getTime();break;case"UTC":u=i.toUTCString();break;case"yy":u=r;break;case"year":case"yyyy":u=o;break;case"month":case"mm":u=n;break;case"cn-week-day":case"cn-wd":var m=["日","一","二","三","四","五","六"];u="星期"+m[s];break;case"week-day":case"wd":var w=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];u=w[s];break;case"day":case"dd":u=a;break;case"hour":case"hh":u=l;break;case"min":case"ii":u=c;break;case"second":case"ss":u=h;break;case"ms":u=d;break;case"yy-mm-dd":u=f;break;case"yyyy-mm-dd":u=g;break;case"yyyy-mm-dd h:i:s ms":case"full + ms":u=g+" "+p+" "+d;break;case"full":case"yyyy-mm-dd h:i:s":default:u=g+" "+p}return u},t}});;/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */

;(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.NProgress = factory();
	}

})(this, function() {
	var NProgress = {};

	NProgress.version = '0.2.0';

	var Settings = NProgress.settings = {
		minimum: 0.08,
		easing: 'ease',
		positionUsing: '',
		speed: 200,
		trickle: true,
		trickleRate: 0.02,
		trickleSpeed: 800,
		showSpinner: true,
		barSelector: '[role="bar"]',
		spinnerSelector: '[role="spinner"]',
		parent: 'body',
		template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
	};

	/**
	 * Updates configuration.
	 *
	 *     NProgress.configure({
   *       minimum: 0.1
   *     });
	 */
	NProgress.configure = function(options) {
		var key, value;
		for (key in options) {
			value = options[key];
			if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
		}

		return this;
	};

	/**
	 * Last number.
	 */

	NProgress.status = null;

	/**
	 * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
	 *
	 *     NProgress.set(0.4);
	 *     NProgress.set(1.0);
	 */

	NProgress.set = function(n) {
		var started = NProgress.isStarted();

		n = clamp(n, Settings.minimum, 1);
		NProgress.status = (n === 1 ? null : n);

		var progress = NProgress.render(!started),
			bar      = progress.querySelector(Settings.barSelector),
			speed    = Settings.speed,
			ease     = Settings.easing;

		progress.offsetWidth; /* Repaint */

		queue(function(next) {
			// Set positionUsing if it hasn't already been set
			if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

			// Add transition
			css(bar, barPositionCSS(n, speed, ease));

			if (n === 1) {
				// Fade out
				css(progress, {
					transition: 'none',
					opacity: 1
				});
				progress.offsetWidth; /* Repaint */

				setTimeout(function() {
					css(progress, {
						transition: 'all ' + speed + 'ms linear',
						opacity: 0
					});
					setTimeout(function() {
						NProgress.remove();
						next();
					}, speed);
				}, speed);
			} else {
				setTimeout(next, speed);
			}
		});

		return this;
	};

	NProgress.isStarted = function() {
		return typeof NProgress.status === 'number';
	};

	/**
	 * Shows the progress bar.
	 * This is the same as setting the status to 0%, except that it doesn't go backwards.
	 *
	 *     NProgress.start();
	 *
	 */
	NProgress.start = function() {
		if (!NProgress.status) NProgress.set(0);

		var work = function() {
			setTimeout(function() {
				if (!NProgress.status) return;
				NProgress.trickle();
				work();
			}, Settings.trickleSpeed);
		};

		if (Settings.trickle) work();

		return this;
	};

	/**
	 * Hides the progress bar.
	 * This is the *sort of* the same as setting the status to 100%, with the
	 * difference being `done()` makes some placebo effect of some realistic motion.
	 *
	 *     NProgress.done();
	 *
	 * If `true` is passed, it will show the progress bar even if its hidden.
	 *
	 *     NProgress.done(true);
	 */

	NProgress.done = function(force) {
		if (!force && !NProgress.status) return this;

		return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
	};

	/**
	 * Increments by a random amount.
	 */

	NProgress.inc = function(amount) {
		var n = NProgress.status;

		if (!n) {
			return NProgress.start();
		} else {
			if (typeof amount !== 'number') {
				amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
			}

			n = clamp(n + amount, 0, 0.994);
			return NProgress.set(n);
		}
	};

	NProgress.trickle = function() {
		return NProgress.inc(Math.random() * Settings.trickleRate);
	};

	/**
	 * Waits for all supplied jQuery promises and
	 * increases the progress as the promises resolve.
	 *
	 * @param $promise jQUery Promise
	 */
	(function() {
		var initial = 0, current = 0;

		NProgress.promise = function($promise) {
			if (!$promise || $promise.state() === "resolved") {
				return this;
			}

			if (current === 0) {
				NProgress.start();
			}

			initial++;
			current++;

			$promise.always(function() {
				current--;
				if (current === 0) {
					initial = 0;
					NProgress.done();
				} else {
					NProgress.set((initial - current) / initial);
				}
			});

			return this;
		};

	})();

	/**
	 * (Internal) renders the progress bar markup based on the `template`
	 * setting.
	 */

	NProgress.render = function(fromStart) {
		if (NProgress.isRendered()) return document.getElementById('nprogress');

		addClass(document.documentElement, 'nprogress-busy');

		var progress = document.createElement('div');
		progress.id = 'nprogress';
		progress.innerHTML = Settings.template;

		var bar      = progress.querySelector(Settings.barSelector),
			perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
			parent   = document.querySelector(Settings.parent),
			spinner;

		css(bar, {
			transition: 'all 0 linear',
			transform: 'translate3d(' + perc + '%,0,0)'
		});

		if (!Settings.showSpinner) {
			spinner = progress.querySelector(Settings.spinnerSelector);
			spinner && removeElement(spinner);
		}

		if (parent != document.body) {
			addClass(parent, 'nprogress-custom-parent');
		}

		parent.appendChild(progress);
		return progress;
	};

	/**
	 * Removes the element. Opposite of render().
	 */

	NProgress.remove = function() {
		removeClass(document.documentElement, 'nprogress-busy');
		removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');
		var progress = document.getElementById('nprogress');
		progress && removeElement(progress);
	};

	/**
	 * Checks if the progress bar is rendered.
	 */

	NProgress.isRendered = function() {
		return !!document.getElementById('nprogress');
	};

	/**
	 * Determine which positioning CSS rule to use.
	 */

	NProgress.getPositioningCSS = function() {
		// Sniff on document.body.style
		var bodyStyle = document.body.style;

		// Sniff prefixes
		var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
			('MozTransform' in bodyStyle) ? 'Moz' :
				('msTransform' in bodyStyle) ? 'ms' :
					('OTransform' in bodyStyle) ? 'O' : '';

		if (vendorPrefix + 'Perspective' in bodyStyle) {
			// Modern browsers with 3D support, e.g. Webkit, IE10
			return 'translate3d';
		} else if (vendorPrefix + 'Transform' in bodyStyle) {
			// Browsers without 3D support, e.g. IE9
			return 'translate';
		} else {
			// Browsers without translate() support, e.g. IE7-8
			return 'margin';
		}
	};

	/**
	 * Helpers
	 */

	function clamp(n, min, max) {
		if (n < min) return min;
		if (n > max) return max;
		return n;
	}

	/**
	 * (Internal) converts a percentage (`0..1`) to a bar translateX
	 * percentage (`-100%..0%`).
	 */

	function toBarPerc(n) {
		return (-1 + n) * 100;
	}


	/**
	 * (Internal) returns the correct CSS for changing the bar's
	 * position given an n percentage, and speed and ease from Settings
	 */

	function barPositionCSS(n, speed, ease) {
		var barCSS;

		if (Settings.positionUsing === 'translate3d') {
			barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
		} else if (Settings.positionUsing === 'translate') {
			barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
		} else {
			barCSS = { 'margin-left': toBarPerc(n)+'%' };
		}

		barCSS.transition = 'all '+speed+'ms '+ease;

		return barCSS;
	}

	/**
	 * (Internal) Queues a function to be executed.
	 */

	var queue = (function() {
		var pending = [];

		function next() {
			var fn = pending.shift();
			if (fn) {
				fn(next);
			}
		}

		return function(fn) {
			pending.push(fn);
			if (pending.length == 1) next();
		};
	})();

	/**
	 * (Internal) Applies css properties to an element, similar to the jQuery
	 * css method.
	 *
	 * While this helper does assist with vendor prefixed property names, it
	 * does not perform any manipulation of values prior to setting styles.
	 */

	var css = (function() {
		var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
			cssProps    = {};

		function camelCase(string) {
			return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
				return letter.toUpperCase();
			});
		}

		function getVendorProp(name) {
			var style = document.body.style;
			if (name in style) return name;

			var i = cssPrefixes.length,
				capName = name.charAt(0).toUpperCase() + name.slice(1),
				vendorName;
			while (i--) {
				vendorName = cssPrefixes[i] + capName;
				if (vendorName in style) return vendorName;
			}

			return name;
		}

		function getStyleProp(name) {
			name = camelCase(name);
			return cssProps[name] || (cssProps[name] = getVendorProp(name));
		}

		function applyCss(element, prop, value) {
			prop = getStyleProp(prop);
			element.style[prop] = value;
		}

		return function(element, properties) {
			var args = arguments,
				prop,
				value;

			if (args.length == 2) {
				for (prop in properties) {
					value = properties[prop];
					if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
				}
			} else {
				applyCss(element, args[1], args[2]);
			}
		}
	})();

	/**
	 * (Internal) Determines if an element or space separated list of class names contains a class name.
	 */

	function hasClass(element, name) {
		var list = typeof element == 'string' ? element : classList(element);
		return list.indexOf(' ' + name + ' ') >= 0;
	}

	/**
	 * (Internal) Adds a class to an element.
	 */

	function addClass(element, name) {
		var oldList = classList(element),
			newList = oldList + name;

		if (hasClass(oldList, name)) return;

		// Trim the opening space.
		element.className = newList.substring(1);
	}

	/**
	 * (Internal) Removes a class from an element.
	 */

	function removeClass(element, name) {
		var oldList = classList(element),
			newList;

		if (!hasClass(element, name)) return;

		// Replace the class name.
		newList = oldList.replace(' ' + name + ' ', ' ');

		// Trim the opening and closing spaces.
		element.className = newList.substring(1, newList.length - 1);
	}

	/**
	 * (Internal) Gets a space separated list of the class names on the element.
	 * The list is wrapped with a single space on each end to facilitate finding
	 * matches within the list.
	 */

	function classList(element) {
		return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
	}

	/**
	 * (Internal) Removes an element from the DOM.
	 */

	function removeElement(element) {
		element && element.parentNode && element.parentNode.removeChild(element);
	}

	return NProgress;
});
;/*!
* screenfull
* v1.2.0 - 2014-04-29
* (c) Sindre Sorhus; MIT License
*/
!function(){"use strict";var a="undefined"!=typeof module&&module.exports,b="undefined"!=typeof Element&&"ALLOW_KEYBOARD_INPUT"in Element,c=function(){for(var a,b,c=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],d=0,e=c.length,f={};e>d;d++)if(a=c[d],a&&a[1]in document){for(d=0,b=a.length;b>d;d++)f[c[0][d]]=a[d];return f}return!1}(),d={request:function(a){var d=c.requestFullscreen;a=a||document.documentElement,/5\.1[\.\d]* Safari/.test(navigator.userAgent)?a[d]():a[d](b&&Element.ALLOW_KEYBOARD_INPUT)},exit:function(){document[c.exitFullscreen]()},toggle:function(a){this.isFullscreen?this.exit():this.request(a)},onchange:function(){},onerror:function(){},raw:c};return c?(Object.defineProperties(d,{isFullscreen:{get:function(){return!!document[c.fullscreenElement]}},element:{enumerable:!0,get:function(){return document[c.fullscreenElement]}},enabled:{enumerable:!0,get:function(){return!!document[c.fullscreenEnabled]}}}),document.addEventListener(c.fullscreenchange,function(a){d.onchange.call(d,a)}),document.addEventListener(c.fullscreenerror,function(a){d.onerror.call(d,a)}),void(a?module.exports=d:window.screenfull=d)):void(a?module.exports=!1:window.screenfull=!1)}();;!function (window, $) {
	// 汉字拼音首字母列表 本列表包含了20902个汉字,用于配合 ToChineseSpell
//函数使用,本表收录的字符的Unicode编码范围为19968至40869, XDesigner 整理
	var strChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
//此处收录了375个多音字,数据来自于http://www.51window.net/page/pinyin
	var oMultiDiff = {
		"19969": "DZ",
		"19975": "WM",
		"19988": "QJ",
		"20048": "YL",
		"20056": "SC",
		"20060": "NM",
		"20094": "QG",
		"20127": "QJ",
		"20167": "QC",
		"20193": "YG",
		"20250": "KH",
		"20256": "ZC",
		"20282": "SC",
		"20285": "QJG",
		"20291": "TD",
		"20314": "YD",
		"20340": "NE",
		"20375": "TD",
		"20389": "YJ",
		"20391": "CZ",
		"20415": "PB",
		"20446": "YS",
		"20447": "SQ",
		"20504": "TC",
		"20608": "KG",
		"20854": "QJ",
		"20857": "ZC",
		"20911": "PF",
		"20504": "TC",
		"20608": "KG",
		"20854": "QJ",
		"20857": "ZC",
		"20911": "PF",
		"20985": "AW",
		"21032": "PB",
		"21048": "XQ",
		"21049": "SC",
		"21089": "YS",
		"21119": "JC",
		"21242": "SB",
		"21273": "SC",
		"21305": "YP",
		"21306": "QO",
		"21330": "ZC",
		"21333": "SDC",
		"21345": "QK",
		"21378": "CA",
		"21397": "SC",
		"21414": "XS",
		"21442": "SC",
		"21477": "JG",
		"21480": "TD",
		"21484": "ZS",
		"21494": "YX",
		"21505": "YX",
		"21512": "HG",
		"21523": "XH",
		"21537": "PB",
		"21542": "PF",
		"21549": "KH",
		"21571": "E",
		"21574": "DA",
		"21588": "TD",
		"21589": "O",
		"21618": "ZC",
		"21621": "KHA",
		"21632": "ZJ",
		"21654": "KG",
		"21679": "LKG",
		"21683": "KH",
		"21710": "A",
		"21719": "YH",
		"21734": "WOE",
		"21769": "A",
		"21780": "WN",
		"21804": "XH",
		"21834": "A",
		"21899": "ZD",
		"21903": "RN",
		"21908": "WO",
		"21939": "ZC",
		"21956": "SA",
		"21964": "YA",
		"21970": "TD",
		"22003": "A",
		"22031": "JG",
		"22040": "XS",
		"22060": "ZC",
		"22066": "ZC",
		"22079": "MH",
		"22129": "XJ",
		"22179": "XA",
		"22237": "NJ",
		"22244": "TD",
		"22280": "JQ",
		"22300": "YH",
		"22313": "XW",
		"22331": "YQ",
		"22343": "YJ",
		"22351": "PH",
		"22395": "DC",
		"22412": "TD",
		"22484": "PB",
		"22500": "PB",
		"22534": "ZD",
		"22549": "DH",
		"22561": "PB",
		"22612": "TD",
		"22771": "KQ",
		"22831": "HB",
		"22841": "JG",
		"22855": "QJ",
		"22865": "XQ",
		"23013": "ML",
		"23081": "WM",
		"23487": "SX",
		"23558": "QJ",
		"23561": "YW",
		"23586": "YW",
		"23614": "YW",
		"23615": "SN",
		"23631": "PB",
		"23646": "ZS",
		"23663": "ZT",
		"23673": "YG",
		"23762": "TD",
		"23769": "ZS",
		"23780": "QJ",
		"23884": "QK",
		"24055": "XH",
		"24113": "DC",
		"24162": "ZC",
		"24191": "GA",
		"24273": "QJ",
		"24324": "NL",
		"24377": "TD",
		"24378": "QJ",
		"24439": "PF",
		"24554": "ZS",
		"24683": "TD",
		"24694": "WE",
		"24733": "LK",
		"24925": "TN",
		"25094": "ZG",
		"25100": "XQ",
		"25103": "XH",
		"25153": "PB",
		"25170": "PB",
		"25179": "KG",
		"25203": "PB",
		"25240": "ZS",
		"25282": "FB",
		"25303": "NA",
		"25324": "KG",
		"25341": "ZY",
		"25373": "WZ",
		"25375": "XJ",
		"25384": "A",
		"25457": "A",
		"25528": "SD",
		"25530": "SC",
		"25552": "TD",
		"25774": "ZC",
		"25874": "ZC",
		"26044": "YW",
		"26080": "WM",
		"26292": "PB",
		"26333": "PB",
		"26355": "ZY",
		"26366": "CZ",
		"26397": "ZC",
		"26399": "QJ",
		"26415": "ZS",
		"26451": "SB",
		"26526": "ZC",
		"26552": "JG",
		"26561": "TD",
		"26588": "JG",
		"26597": "CZ",
		"26629": "ZS",
		"26638": "YL",
		"26646": "XQ",
		"26653": "KG",
		"26657": "XJ",
		"26727": "HG",
		"26894": "ZC",
		"26937": "ZS",
		"26946": "ZC",
		"26999": "KJ",
		"27099": "KJ",
		"27449": "YQ",
		"27481": "XS",
		"27542": "ZS",
		"27663": "ZS",
		"27748": "TS",
		"27784": "SC",
		"27788": "ZD",
		"27795": "TD",
		"27812": "O",
		"27850": "PB",
		"27852": "MB",
		"27895": "SL",
		"27898": "PL",
		"27973": "QJ",
		"27981": "KH",
		"27986": "HX",
		"27994": "XJ",
		"28044": "YC",
		"28065": "WG",
		"28177": "SM",
		"28267": "QJ",
		"28291": "KH",
		"28337": "ZQ",
		"28463": "TL",
		"28548": "DC",
		"28601": "TD",
		"28689": "PB",
		"28805": "JG",
		"28820": "QG",
		"28846": "PB",
		"28952": "TD",
		"28975": "ZC",
		"29100": "A",
		"29325": "QJ",
		"29575": "SL",
		"29602": "FB",
		"30010": "TD",
		"30044": "CX",
		"30058": "PF",
		"30091": "YSP",
		"30111": "YN",
		"30229": "XJ",
		"30427": "SC",
		"30465": "SX",
		"30631": "YQ",
		"30655": "QJ",
		"30684": "QJG",
		"30707": "SD",
		"30729": "XH",
		"30796": "LG",
		"30917": "PB",
		"31074": "NM",
		"31085": "JZ",
		"31109": "SC",
		"31181": "ZC",
		"31192": "MLB",
		"31293": "JQ",
		"31400": "YX",
		"31584": "YJ",
		"31896": "ZN",
		"31909": "ZY",
		"31995": "XJ",
		"32321": "PF",
		"32327": "ZY",
		"32418": "HG",
		"32420": "XQ",
		"32421": "HG",
		"32438": "LG",
		"32473": "GJ",
		"32488": "TD",
		"32521": "QJ",
		"32527": "PB",
		"32562": "ZSQ",
		"32564": "JZ",
		"32735": "ZD",
		"32793": "PB",
		"33071": "PF",
		"33098": "XL",
		"33100": "YA",
		"33152": "PB",
		"33261": "CX",
		"33324": "BP",
		"33333": "TD",
		"33406": "YA",
		"33426": "WM",
		"33432": "PB",
		"33445": "JG",
		"33486": "ZN",
		"33493": "TS",
		"33507": "QJ",
		"33540": "QJ",
		"33544": "ZC",
		"33564": "XQ",
		"33617": "YT",
		"33632": "QJ",
		"33636": "XH",
		"33637": "YX",
		"33694": "WG",
		"33705": "PF",
		"33728": "YW",
		"33882": "SR",
		"34067": "WM",
		"34074": "YW",
		"34121": "QJ",
		"34255": "ZC",
		"34259": "XL",
		"34425": "JH",
		"34430": "XH",
		"34485": "KH",
		"34503": "YS",
		"34532": "HG",
		"34552": "XS",
		"34558": "YE",
		"34593": "ZL",
		"34660": "YQ",
		"34892": "XH",
		"34928": "SC",
		"34999": "QJ",
		"35048": "PB",
		"35059": "SC",
		"35098": "ZC",
		"35203": "TQ",
		"35265": "JX",
		"35299": "JX",
		"35782": "SZ",
		"35828": "YS",
		"35830": "E",
		"35843": "TD",
		"35895": "YG",
		"35977": "MH",
		"36158": "JG",
		"36228": "QJ",
		"36426": "XQ",
		"36466": "DC",
		"36710": "JC",
		"36711": "ZYG",
		"36767": "PB",
		"36866": "SK",
		"36951": "YW",
		"37034": "YX",
		"37063": "XH",
		"37218": "ZC",
		"37325": "ZC",
		"38063": "PB",
		"38079": "TD",
		"38085": "QY",
		"38107": "DC",
		"38116": "TD",
		"38123": "YD",
		"38224": "HG",
		"38241": "XTC",
		"38271": "ZC",
		"38415": "YE",
		"38426": "KH",
		"38461": "YD",
		"38463": "AE",
		"38466": "PB",
		"38477": "XJ",
		"38518": "YT",
		"38551": "WK",
		"38585": "ZC",
		"38704": "XS",
		"38739": "LJ",
		"38761": "GJ",
		"38808": "SQ",
		"39048": "JG",
		"39049": "XJ",
		"39052": "HG",
		"39076": "CZ",
		"39271": "XT",
		"39534": "TD",
		"39552": "TD",
		"39584": "PB",
		"39647": "SB",
		"39730": "LG",
		"39748": "TPB",
		"40109": "ZQ",
		"40479": "ND",
		"40516": "HG",
		"40536": "HG",
		"40583": "QJ",
		"40765": "YQ",
		"40784": "QJ",
		"40840": "YK",
		"40863": "QJG"
	};
//参数,中文字符串
//返回值:拼音首字母串数组
	function makePy(str) {
		if (typeof(str) != "string")
			throw new Error(-1, "函数makePy需要字符串类型参数!");
		var arrResult = new Array(); //保存中间结果的数组
		for (var i = 0, len = str.length; i < len; i++) {
			//获得unicode码
			var ch = str.charAt(i);
			//检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
			arrResult.push(checkCh(ch));
		}
		//处理arrResult,返回所有可能的拼音首字母串数组
		return mkRslt(arrResult);
	}

	function checkCh(ch) {
		var uni = ch.charCodeAt(0);
//如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
		if (uni > 40869 || uni < 19968)
			return ch; //dealWithOthers(ch);
//检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
		return (oMultiDiff[uni] ? oMultiDiff[uni] : (strChineseFirstPY.charAt(uni - 19968)));
	}

	function mkRslt(arr) {
		var arrRslt = [""];
		for (var i = 0, len = arr.length; i < len; i++) {
			var str = arr[i];
			var strlen = str.length;
			if (strlen == 1) {
				for (var k = 0; k < arrRslt.length; k++) {
					arrRslt[k] += str;
				}
			} else {
				var tmpArr = arrRslt.slice(0);
				arrRslt = [];
				for (k = 0; k < strlen; k++) {
//复制一个相同的arrRslt
					var tmp = tmpArr.slice(0);
//把当前字符str[k]添加到每个元素末尾
					for (var j = 0; j < tmp.length; j++) {
						tmp[j] += str.charAt(k);
					}
//把复制并修改后的数组连接到arrRslt上
					arrRslt = arrRslt.concat(tmp);
				}
			}
		}
		return arrRslt;
	}
	if(!String.prototype.trim){
		String.prototype.trim = function () {
			return this.replace(/(^\s*)|(\s*$)/g, "");
		}
	}
	function getPosition(obj) {
		var top = 0;
		var left = 0;
		var width = obj.offsetWidth;
		var height = obj.offsetHeight;
		while (obj.offsetParent) {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
		}
		return {"top": top, "left": left, "width": width, "height": height};
	}

	window.CC2PY = function (str) {
		return makePy(str);
	};
}(window, $);;var app = angular.module("app", [
	"ngRoute",
	"oc.lazyLoad",
	"ui.bootstrap",
	"ngStorage",
	"ui.select"
]);

/**
 * 系统错误分类
 * 9开头为系统及服务器错误
 * 6开头业务逻辑错误
 *
 * @type {string[]}
 */
configLog.$inject = ["$logProvider"];
function configLog($logProvider) {
	$logProvider.debugEnabled(true);
}

configRemote.$inject = ["$remoteProvider"];
function configRemote($remoteProvider) {
	$remoteProvider.setErrorTag(function (data, status, headers, config) {
		if (data.errorCode) {
			return true;
		}
	});

	$remoteProvider.setSendBeforeFn(function (config) {
		// console.log('setSendBeforeFn');
		$("#overlay").show(); //showLoading
	});
	$remoteProvider.setSendAfterFn(function (config) {
		// console.log('setSendAfterFn');
		setTimeout(function () { //hideLoading
			$("#overlay").hide();
		}, 300);
	});
	$remoteProvider.setErrorCallback(function (data, status, headers, config) {
		var $rootScope = angular.element("body").scope();
		if (data.errorCode == "999999") { //会话超时或未登录
			window.location.href = "index.html";
		} else if (data.errorCode == "591000") {
			$rootScope.$alert({
				title: "数据库操作异常！",
				content: data.errorMessage
			});
		} else {
			$rootScope.$alert({
				title: data.errorType + "[" + data.errorCode + "]",
				content: data.errorMessage
			});
		}
	});
}
app.config(configLog);
app.config(configRemote);

app.run(["$rootScope", "$location", "$remote", "$cookieService", function ($rootScope, $location, $remote, $cookieService) {

	$remote.post("admin/getLoginInfo.do", {}, function (data) {
		if (data.errorCode == "999999") {
			window.location.href = "index.html";
		} else {
			$rootScope.$userinfo = data;
		}
	});
}]);

app.run(["$rootScope", "$location", "$remote", "$modal", "$route", function ($rootScope, $location, $remote, $modal, $route) {

	$rootScope.$on('$routeChangeStart', function (event, preparedRoute, lastRoute) {
		$rootScope.$nextRouteWrapper = preparedRoute;
		$rootScope.$lastRouteWrapper = lastRoute;
		$rootScope.$currentRoute = preparedRoute && preparedRoute.$$route;
		if ($rootScope.$currentRoute && $rootScope.$currentRoute.originalPath) {
			$rootScope.$Bread = getBread($rootScope.$currentRoute.originalPath);
		}
	});
	$rootScope.$confirm = function (message) {
		if (!$rootScope.$confirm.isOpen) {
			$rootScope.$confirm.isOpen = true;
			var modalInstance = $modal.open({
				templateUrl: 'htmls/Dialog/Confirm.html',
				controller: ['$scope', '$modalInstance',
					function ($scope, $modalInstance) {
						$scope.message = message;
						$scope.ok = function () {
							$modalInstance.close();
							$rootScope.$confirm.isOpen = false;
							if (message.ok && typeof message.ok == "function") {
								message.ok.apply($scope);
							}
						};
						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
							$rootScope.$confirm.isOpen = false;
							if (message.cancel && typeof message.cancel == "function") {
								message.cancel.apply($scope);
							}
						};
					}]
			});
		}
	};
	$rootScope.$alert = function (message) {
		if (!$rootScope.$alert.isOpen) {
			$rootScope.$alert.isOpen = true;
			var modalInstance = $modal.open({
				templateUrl: 'htmls/Dialog/Alert.html',
				controller: ['$scope', '$modalInstance',
					function ($scope, $modalInstance) {
						$scope.message = message;
						$scope.ok = function () {
							$modalInstance.close();
							$rootScope.$alert.isOpen = false;
							if (message.ok && typeof message.ok == "function") {
								message.ok.apply($scope);
							}
						};
					}]

			});

		}
	};

	$rootScope.goto = function (url, isReload) {
		if (!url)
			return;
		if (/^[\/]/.test(url)) {
			var currentScope = vx.element("div[v-view]>*").scope() || vx.element("body").scope();
			if ($location.path() != url) {
				//NativeCall.pages.push($location.$$path);
				$location.path(url);
				if (isReload)
					currentScope.$apply();
			}
		} else if (/^[#]/.test(url)) {
			$rootScope.$loadPage(url);
		} else if (/\.html/.test(url)) {
			window.location = url;
		}
	};
	$rootScope.routeRefresh = function () {
		$route.reload();
	};
	$rootScope.logout = function () {
		$remote.post("user/logout.do", {}, function (data) {
			if (data && data.success == "ok") {
				window.location.href = "index.html";
			}
		});
	};
}]);

app.run(['$rootScope', '$log', '$window', function ($rootScope, $log, $window) {
	$rootScope.$on('$routeChangeStart', function (event) {
		NProgress.start();  //第一个进度节点
		$log.debug("1.$routeChangeStart");
	});
	$rootScope.$on('$viewContentLoading', function (event) {
		$log.debug('2.$viewContentLoading');
		NProgress.inc();  //第二个进度节点
	});

	$rootScope.$on('$routeChangeSuccess', function (event, toroute, toParams, fromroute) {
		NProgress.inc(0.5);//第三个进度节点
		var listener = event.targetScope.$watch('$viewContentLoaded', function () {
			listener();
			$log.debug('4.$viewContentLoaded');
			NProgress.done();  //第四个进度节点
			$window.scrollTo(0, 0);
		});
		$log.debug("3.$routeChangeSuccess");
	});
	$rootScope.$on("$routeChangeError", function () {
		NProgress.done(); //last进度节点
		$window.scrollTo(0, 0);
	});
}]);


;(function (window) {
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

;(function (window, angular) {
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
})(window, window.angular);;(function (window, angular, undefined) {
	'use strict';

	var services = {};
	services.$cookieService = [function () {
		return {
			addCookice: function (name, value, expireHours) {
				// TODO 添加函数过程
				var cookieStr = name + "=" + escape(value);
				//是否设置过期时间
				if (expireHours > 0) {
					var date = new Date();
					date.setTime(date.getTime + expireHours * 3600 * 1000);
					cookieStr = cookieStr + ";expires=" + date.toGMTString();
				}
				document.cookie = cookieStr;
			},
			getCookie: function (name) {

				var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
				if (arr != null)
					return unescape(arr[2]);
				return null;

			},
			deleteCookie: function (name) {
				var exp = new Date();
				exp.setTime(exp.getTime() - 10000);
				var cval = this.getCookie(name);
				if (cval != null) {
					document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
				}
			}
		};
	}];

	angular.module('app').factory(services);

})(window, window.angular);;(function (window, angular) {
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
})(window, angular);;'use strict';
app.controller('AppCtrl', ['$scope', '$localStorage', function ($scope, $localStorage) {
	$scope.$menuList = Menu;
	$scope.$functions = angular.getFunctions();
	// config
	$scope.app = {
		name: 'x373241884y',
		version: '2.4.7',
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
			themeID: 8,
			navbarHeaderColor: 'bg-info',//bg-black
			navbarCollapseColor: 'bg-info',
			asideColor: 'bg-light',
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
