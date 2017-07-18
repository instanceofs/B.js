/**
 * @class B
 * @author 柏小白
 * @date 2015/12/12
 */

(function (){
    var self = this,
        B,
        EMPTY = '',
        loggerLevel = {
            debug: 10,
            info: 20,
            warn: 30,
            error: 40
        };

    function getLogger(logger){
        var obj = {};
        for (var cat in loggerLevel) {
            if(!loggerLevel.hasOwnProperty(cat))
                continue;
            (function (obj, cat){
                obj[cat] = function (msg){
                    return B.log(msg, cat, logger);
                };
            })(obj, cat);
        }
        return obj;
    }

    B = {
        __BUILD_TIME: '2016-11-03',
        VERSION: '0.01',
        Env: {
            host: self
        },
        Config: {
            debug: true,
            loggerLevel: 'debug',
            fns: {}
        },
        /**
         * 类型判断
         * @param obj
         * @param type
         * @return boolean
         */
        is: function (obj, type){
            var isNan = {"NaN": 1, "Infinity": 1, "-Infinity": 1};
            type = type.toLowerCase();
            if(type == "finite"){
                return !isNan["hasOwnProperty"](+obj);
            }
            if(type == "array"){
                return obj instanceof Array;
            }
            if(undefined === obj && type !== "undefined") return false;
            return (type == "null" && obj === null) ||
                (type == typeof obj && obj !== null) ||
                (type == "object" && obj === Object(obj)) ||
                (type == "array" && Array.isArray && Array.isArray(obj)) ||
                Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() == type;
        },
        /**
         * 布尔类型判断
         * @param obj
         * @returns {boolean|*|Boolean}
         */
        isBoolean: function (obj){
            return B.is(obj, "boolean");
        },
        /**
         * 日期类型判断
         * @param obj
         * @returns {boolean|*|Boolean}
         */
        isDate: function (obj){
            return B.is(obj, "date");
        },
        /**
         * 是否是正则表达式判断
         * @param obj
         * @returns {*|boolean}
         */
        isRegExp: function (obj){
            return B.is(obj, "regexp");
        },
        /**
         * 对象类型判断
         * @param obj
         * @returns {*|boolean}
         */
        isObject: function (obj){
            return B.is(obj, "object");
        },
        /**
         * 数组类型判断
         * @param obj
         * @returns {*|boolean}
         */
        isArray: function (obj){
            return B.is(obj, "array");
        },
        /**
         * 数字类型判断
         * @param obj
         * @returns {*|boolean}
         */
        isNumber: function (obj){
            return B.is(obj, "number");
        },
        /**
         * fun 类型判断
         * @param obj
         * @returns {*|boolean}
         */
        isFunction: function (obj){
            return B.is(obj, "function");
        },
        /**
         * null类型判断
         * @param obj
         * @returns {*|boolean}
         */
        isNull: function (obj){
            return B.is(obj, "null");
        },
        /**
         * 字符串类型判断
         * @param obj
         * @returns {*|boolean}
         */
        isString: function (obj){
            return B.is(obj, "string");
        },
        /**
         * 对象是否为空判断
         * @param obj
         * @returns {boolean|*}
         */
        isEmpty: function (obj){
            return EMPTY === obj || B.isNull(obj);
        },
        /**
         * undefined 类型判断
         * @param obj
         * @returns {*|boolean}
         */
        isUndefined: function (obj){
            return B.is(obj, "undefined");
        },
        /**
         * 打印console.log();
         * @param msg
         * @param cat
         * @param logger
         * @returns {*}
         */
        log: function (msg, cat, logger){
            if(!B.Config.debug) return undefined;
            if((loggerLevel[B.Config.loggerLevel] || 1000) > loggerLevel[cat == 'log' ? 'debug' : cat])
                return "min level";
            var matched = false;
            if(logger){
                matched = B.isObject(msg);
                if(!matched)
                    msg = logger + ": " + msg;
            }
            if(typeof console !== 'undefined' && console.log){
                if(matched) console[cat && console[cat] ? cat : 'log'](logger + ":");
                console[cat && console[cat] ? cat : 'log'](msg);
                return msg;
            }
        },
        getLogger: function (logger){
            return getLogger(logger);
        },
        _mix: function (target, resource){
            for (var name in resource) {
                if(resource.hasOwnProperty(name)){
                    target[name] = resource[name];
                }
            }
        }
    };
    B.Logger = {};
    B.Logger.Level = {
        DEBUG: 'debug',
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error'
    };
    return 'B' in self || ( self['B'] = B);

}).call(this);
/**
 * Array Model
 */
(function (B, undefined){
    var AP = Array.prototype,
        indexOf = AP.indexOf,
        lastIndexOf = AP.lastIndexOf,
        UF = undefined,
        FALSE = false;
    B._mix(B, {
        /**
         * 循环操作
         * @param object
         * @param fn
         * @param context
         * @returns {*}
         */
        each: function (object, fn, context){
            if(object){
                var key,
                    val,
                    keys,
                    i = 0,
                    length = object && object.length,
                    isObj = B.isUndefined(length) || B.isFunction(object);

                context = context || null;

                if(isObj){
                    keys = B.keys(object);
                    for (; i < keys.length; i++) {
                        key = keys[i];
                        if(fn.call(context, object[key], key, object) === FALSE){
                            break;
                        }
                    }
                } else {
                    for (val = object[0];
                         i < length; val = object[++i]) {
                        if(fn.call(context, val, i, object) === FALSE){
                            break;
                        }
                    }
                }
            }
            return object;
        },
        /**
         * 检查指定的参数在数组中的位置  不存在 返回-1
         * @param item
         * @param arr
         * @param fromIndex
         * @returns {*}
         */
        index: function (item, arr, fromIndex){
            if(indexOf){
                return fromIndex === UF ?
                    indexOf.call(arr, item) :
                    indexOf.call(arr, item, fromIndex);
            }
            var i = fromIndex || 0;
            for (; i < arr.length; i++) {
                if(arr[i] === item)
                    break;
            }
            return i;
        },
        /**
         * 与 B.index类似 arr倒序计算位置
         * @param item
         * @param arr
         * @param fromIndex
         * @returns {*}
         */
        lastIndex: function (item, arr, fromIndex){
            if(lastIndexOf){
                return fromIndex === UF ?
                    lastIndexOf.call(arr, item) :
                    lastIndexOf.call(arr, item, fromIndex);
            }
            if(fromIndex === UF){
                fromIndex = arr.length - 1;
            }
            var i = fromIndex;
            for (; i >= 0; i--) {
                if(arr[i] === item)
                    break;
            }
            return i;
        },
        /**
         * 检查是否包含在数组中
         * @param item
         * @param arr
         * @returns {boolean}
         */
        inArray: function (item, arr){
            return B.index(item, arr) >= 0;
        }
    });
})(B);
/**
 * String Model
 * @author BAI
 * @date 2016/11/04
 */
(function (B, undefined){
    var RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g,
        trim = String.prototype.trim,
        SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g,
        EMPTY = '';
    B._mix(B, {
        /**
         * trim字符串左右清楚空格
         * @param str
         * @returns {*}
         */
        trim: function (str){
            return B.isEmpty(str) ? str : (trim ? trim.call(str) : (str + '').replace(RE_TRIM, EMPTY));
        },
        /**
         * 中文字符长度
         * @param str
         * @returns {*}
         */
        lengthCn: function (str){
            if(!B.isString(str)) return 0;
            return str.replace(/[\u4e00-\u9fa5]/g, "**").length;
        },
        /**
         * 截取字符串长度，后部分截取使用“...”代替
         * @param str
         * @param num
         * @param strip
         * @returns {*}
         */
        subCn: function (str, num, strip){
            if(B.lengthCn(str) <= num) return str.toString();
            for (var i = 0; i < str.length; i++) {
                if(B.lengthCn(str.substr(0, i)) >= num){
                    return str.substr(0, i) + (strip || "...");
                }
            }
            return str;
        },
        stripTags: function (str){
            return str.replace(/<\/?[^>]+>/gi, '');
        },
        stripScript: function (h){
            return h.replace(/<script[^>]*>([\\S\\s]*?)<\/script>/g, '');
        },
        /**
         * 是否是手机号码
         * @param m
         * @returns {boolean}
         */
        isMobile: function (m){
            return /^(1[3578]\d{9})$/.test(B.trim(m));
        },
        /**
         * 是否是座机号码
         * @param str
         * @returns {boolean}
         */
        isTelephone: function (str){
            return /((0[1-9]{2,3}[\s-]?)?\d{7,8})/gi.test(B.trim(str));
        },
        /**
         * 替代
         * @param str
         * @param o
         * @param regexp
         * @returns {*}
         */
        substitute: function (str, o, regexp){
            if(!(B.isString(str) && o)){
                return str;
            }
            return str.replace(regexp || SUBSTITUTE_REG, function (match, name){
                if(match.charAt(0) === '\\'){
                    return match.slice(1);
                }
                return (o[name] === undefined) ? EMPTY : o[name];
            });
        },
        /**
         * 首字母大写
         * @param str
         * @returns {string}
         */
        ucFirst: function (str){
            str += '';
            return str.charAt(0).toUpperCase() + str.substring(1);

        },
        /**
         * 以某个字符串开始
         * @param str
         * @param prefix
         * @returns {boolean}
         */
        startsWith: function (str, prefix){
            return str.lastIndexOf(prefix, 0) === 0;
        },
        /**
         * 以某个字符串结束
         * @param str
         * @param suffix
         * @returns {boolean}
         */
        endsWith: function (str, suffix){
            var ind = str.length - suffix.length;
            return ind >= 0 && str.indexOf(suffix, ind) === ind;
        },
        /**
         *  格式化字符串
         * @param str
         * @returns {*}
         */
        format: function (str){
            if(arguments.length <= 1) return str || EMPTY;
            var result = str,
                reg;
            if(2 === arguments.length && B.isObject(arguments[1])){
                for (var key in arguments[1]) {
                    if(!arguments[1].hasOwnProperty(key)) continue;
                    reg = new RegExp("\\{" + key + "\\}", "gi");
                    result = result.replace(reg, arguments[1][key]);
                }
            } else {
                for (var i = 1; i < arguments.length; i++) {
                    reg = new RegExp("\\{" + (i - 1) + "\\}", "gi");
                    result = result.replace(reg, arguments[i]);
                }
            }
            return result;
        },
        /**
         * 左侧填充
         * @param obj
         * @param len
         * @param ch
         */
        padLeft: function (obj, len, ch){
            ch = B.isUndefined(ch) ? '0' : ch;
            var s = String(obj);
            while (s.length < len)
                s = ch + s;
            return s;
        },
        /**
         * 右侧填充
         * @param obj
         * @param len
         * @param ch
         */
        padRight: function (obj, len, ch){
            ch = B.isUndefined(ch) ? '0' : ch;
            var s = String(obj);
            while (s.length < len)
                s += ch;
            return s;
        }
    });
})(B);
/**
 * Function Model
 * @author BAI
 * @date 2015/4/7.
 */
(function (B){
    B._mix(B, {
        later: function (method, time, isInterval, context, data){
            var timer,
                f;
            time = time || 0;
            if(B.isString(method))
                method = context[method];
            if(!method){
                B.error("fn is undefined");
            }
            f = function (){
                method.apply(context, data);
            };
            timer = (isInterval ? setInterval(f, time) : setTimeout(f, time));
            return {
                timer: timer,
                isInterval: isInterval,
                cancel: function (){
                    if(this.isInterval){
                        clearInterval(timer);
                    } else {
                        clearTimeout(timer);
                    }
                }
            };
        }
    });
})(B);
/**
 * Uri
 * @author BAI
 * @date 2016/11/04
 */
(function (B){
    var splitPathRe = /^(\/?)([\s\S]+\/(?!$)|\/)?((?:\.{1,2}$|[\s\S]+?)?(\.[^.\/]*)?)$/;
    B._mix(B, {
        /**
         * 获取页面参数
         * @param uri
         * @returns {Array}
         */
        uri: function (uri){
            var q = [], qs;
            qs = (uri ? uri + "" : location.search);
            if(qs.indexOf('?') >= 0){
                qs = qs.substring(1);
                qs = qs.substring(1);
            }
            if(qs){
                qs = qs.split('&');
            }
            if(qs.length > 0){
                for (var i = 0; i < qs.length; i++) {
                    var qt = qs[i].split('=');
                    q[qt[0]] = decodeURIComponent(qt[1]);
                }
            }
            return q;
        },
        /**
         * cookie操作
         */
        cookie: {
            set: function (name, value, minutes, domain){
                if("string" !== typeof name || "" === B.trim(name)) return;
                var c = name + '=' + encodeURI(value);
                if("number" === typeof minutes && minutes > 0){
                    var time = (new Date()).getTime() + 1000 * 60 * minutes;
                    c += ';expires=' + (new Date(time)).toGMTString();
                }
                if("string" == typeof domain)
                    c += ';domain=' + domain;
                document.cookie = c + '; path=/';
            },
            get: function (name){
                var b = document.cookie;
                var d = name + '=';
                var c = b.indexOf('; ' + d);
                if(c == -1){
                    c = b.indexOf(d);
                    if(c != 0){
                        return null;
                    }
                }
                else {
                    c += 2;
                }
                var a = b.indexOf(';', c);
                if(a == -1){
                    a = b.length;
                }
                return decodeURI(b.substring(c + d.length, a));
            },
            clear: function (name, domain){
                if(this.get(name)){
                    document.cookie = name + '=' + (domain ? '; domain=' + domain : '') + '; expires=Thu, 01-Jan-70 00:00:01 GMT';
                }
            }
        },
        ext: function (url){
            return (url.match(splitPathRe) || [])[4] || '';
        }
    });
})(B);
/**
 * 终端识别
 */
(function (B){
    /*global process*/

    var win = B.Env.host,
        doc = win.document,
        navigator = win.navigator,
        ua = navigator && navigator.userAgent || '';

    function numberify(s){
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function (){
            return (c++ === 0) ? '.' : '';
        }));
    }

    function setTridentVersion(ua, UA){
        var core, m;
        UA[core = 'trident'] = 0.1; // Trident detected, look for revision

        // Get the Trident's accurate version
        if((m = ua.match(/Trident\/([\d.]*)/)) && m[1]){
            UA[core] = numberify(m[1]);
        }

        UA.core = core;
    }

    function getIEVersion(ua){
        var m, v;
        if((m = ua.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) &&
            (v = (m[1] || m[2]))){
            return numberify(v);
        }
        return 0;
    }

    function getDescriptorFromUserAgent(ua){
        var EMPTY = '',
            os,
            core = EMPTY,
            shell = EMPTY, m,
            IE_DETECT_RANGE = [6, 9],
            ieVersion,
            v,
            end,
            VERSION_PLACEHOLDER = '{{version}}',
            IE_DETECT_TPL = '<!--[if IE ' + VERSION_PLACEHOLDER + ']><' + 's></s><![endif]-->',
            div = doc && doc.createElement('div'),
            s = [];
        /**
         * UA
         * @class BAI.UA
         * @singleton
         */
        var UA = {
            /**
             * webkit version
             * @type undefined|Number
             * @member BAI.UA
             */
            webkit: undefined,
            /**
             * trident version
             * @type undefined|Number
             * @member BAI.UA
             */
            trident: undefined,
            /**
             * gecko version
             * @type undefined|Number
             * @member BAI.UA
             */
            gecko: undefined,
            /**
             * presto version
             * @type undefined|Number
             * @member BAI.UA
             */
            presto: undefined,
            /**
             * chrome version
             * @type undefined|Number
             * @member BAI.UA
             */
            chrome: undefined,
            /**
             * safari version
             * @type undefined|Number
             * @member BAI.UA
             */
            safari: undefined,
            /**
             * firefox version
             * @type undefined|Number
             * @member BAI.UA
             */
            firefox: undefined,
            /**
             * ie version
             * @type undefined|Number
             * @member BAI.UA
             */
            ie: undefined,
            /**
             * ie document mode
             * @type undefined|Number
             * @member BAI.UA
             */
            ieMode: undefined,
            /**
             * opera version
             * @type undefined|Number
             * @member BAI.UA
             */
            opera: undefined,
            /**
             * mobile browser. apple, android.
             * @type String
             * @member BAI.UA
             */
            mobile: undefined,
            /**
             * browser render engine name. webkit, trident
             * @type String
             * @member BAI.UA
             */
            core: undefined,
            /**
             * browser shell name. ie, chrome, firefox
             * @type String
             * @member BAI.UA
             */
            shell: undefined,

            /**
             * PhantomJS version number
             * @type undefined|Number
             * @member BAI.UA
             */
            phantomjs: undefined,

            /**
             * operating system. android, ios, linux, windows
             * @type string
             * @member BAI.UA
             */
            os: undefined,

            /**
             * ipad ios version
             * @type Number
             * @member BAI.UA
             */
            ipad: undefined,
            /**
             * iphone ios version
             * @type Number
             * @member BAI.UA
             */
            iphone: undefined,
            /**
             * ipod ios
             * @type Number
             * @member BAI.UA
             */
            ipod: undefined,
            /**
             * ios version
             * @type Number
             * @member BAI.UA
             */
            ios: undefined,

            /**
             * android version
             * @type Number
             * @member BAI.UA
             */
            android: undefined,

            /**
             * nodejs version
             * @type Number
             * @member BAI.UA
             */
            nodejs: undefined
        };

        // ejecta
        if(div && div.getElementsByTagName){
            // try to use IE-Conditional-Comment detect IE more accurately
            // IE10 doesn't support this method, @ref: http://blogs.msdn.com/b/ie/archive/2011/07/06/html5-parsing-in-ie10.aspx
            div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, '');
            s = div.getElementsByTagName('s');
        }

        if(s.length > 0){

            setTridentVersion(ua, UA);

            // Detect the accurate version
            // 注意：
            //  UA.shell = ie, 表示外壳是 ie
            //  但 UA.ie = 7, 并不代表外壳是 ie7, 还有可能是 ie8 的兼容模式
            //  对于 ie8 的兼容模式，还要通过 documentMode 去判断。但此处不能让 UA.ie = 8, 否则
            //  很多脚本判断会失误。因为 ie8 的兼容模式表现行为和 ie7 相同，而不是和 ie8 相同
            for (v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1]; v <= end; v++) {
                div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);
                if(s.length > 0){
                    UA[shell = 'ie'] = v;
                    break;
                }
            }

            // win8 embed app
            if(!UA.ie && (ieVersion = getIEVersion(ua))){
                UA[shell = 'ie'] = ieVersion;
            }

        } else {
            // WebKit
            if((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]){
                UA[core = 'webkit'] = numberify(m[1]);

                if((m = ua.match(/OPR\/(\d+\.\d+)/)) && m[1]){
                    UA[shell = 'opera'] = numberify(m[1]);
                }
                // Chrome
                else if((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]){
                    UA[shell = 'chrome'] = numberify(m[1]);
                }
                // Safari
                else if((m = ua.match(/\/([\d.]*) Safari/)) && m[1]){
                    UA[shell = 'safari'] = numberify(m[1]);
                }

                // Apple Mobile
                if(/ Mobile\//.test(ua) && ua.match(/iPad|iPod|iPhone/)){
                    UA.mobile = 'apple'; // iPad, iPhone or iPod Touch

                    m = ua.match(/OS ([^\s]*)/);
                    if(m && m[1]){
                        UA.ios = numberify(m[1].replace('_', '.'));
                    }
                    os = 'ios';
                    m = ua.match(/iPad|iPod|iPhone/);
                    if(m && m[0]){
                        UA[m[0].toLowerCase()] = UA.ios;
                    }
                } else if(/ Android/i.test(ua)){
                    if(/Mobile/.test(ua)){
                        os = UA.mobile = 'android';
                    }
                    m = ua.match(/Android ([^\s]*);/);
                    if(m && m[1]){
                        UA.android = numberify(m[1]);
                    }
                }
                // Other WebKit Mobile Browsers
                else if((m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))){
                    UA.mobile = m[0].toLowerCase(); // Nokia N-series, Android, webOS, ex: NokiaN95
                }

                if((m = ua.match(/PhantomJS\/([^\s]*)/)) && m[1]){
                    UA.phantomjs = numberify(m[1]);
                }
            }
            // NOT WebKit
            else {
                // Presto
                // ref: http://www.useragentstring.com/pages/useragentstring.php
                if((m = ua.match(/Presto\/([\d.]*)/)) && m[1]){
                    UA[core = 'presto'] = numberify(m[1]);

                    // Opera
                    if((m = ua.match(/Opera\/([\d.]*)/)) && m[1]){
                        UA[shell = 'opera'] = numberify(m[1]); // Opera detected, look for revision

                        if((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]){
                            UA[shell] = numberify(m[1]);
                        }

                        // Opera Mini
                        if((m = ua.match(/Opera Mini[^;]*/)) && m){
                            UA.mobile = m[0].toLowerCase(); // ex: Opera Mini/2.0.4509/1316
                        }
                        // Opera Mobile
                        // ex: Opera/9.80 (Windows NT 6.1; Opera Mobi/49; U; en) Presto/2.4.18 Version/10.00
                        // issue: 由于 Opera Mobile 有 Version/ 字段，可能会与 Opera 混淆，同时对于 Opera Mobile 的版本号也比较混乱
                        else if((m = ua.match(/Opera Mobi[^;]*/)) && m){
                            UA.mobile = m[0];
                        }
                    }

                    // NOT WebKit or Presto
                } else {
                    // MSIE
                    // 由于最开始已经使用了 IE 条件注释判断，因此落到这里的唯一可能性只有 IE10+
                    // and analysis tools in nodejs
                    if((ieVersion = getIEVersion(ua))){
                        UA[shell = 'ie'] = ieVersion;
                        setTridentVersion(ua, UA);
                        // NOT WebKit, Presto or IE
                    } else {
                        // Gecko
                        if((m = ua.match(/Gecko/))){
                            UA[core = 'gecko'] = 0.1; // Gecko detected, look for revision
                            if((m = ua.match(/rv:([\d.]*)/)) && m[1]){
                                UA[core] = numberify(m[1]);
                                if(/Mobile|Tablet/.test(ua)){
                                    UA.mobile = 'firefox';
                                }
                            }
                            // Firefox
                            if((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]){
                                UA[shell = 'firefox'] = numberify(m[1]);
                            }
                        }
                    }
                }
            }
        }

        if(!os){
            if((/windows|win32/i).test(ua)){
                os = 'windows';
            } else if((/macintosh|mac_powerpc/i).test(ua)){
                os = 'macintosh';
            } else if((/linux/i).test(ua)){
                os = 'linux';
            } else if((/rhino/i).test(ua)){
                os = 'rhino';
            }
        }

        UA.os = os;
        UA.core = UA.core || core;
        UA.shell = shell;
        UA.ieMode = UA.ie && doc.documentMode || UA.ie;

        return UA;
    }

    var UA = BAI.UA = getDescriptorFromUserAgent(ua);

    // nodejs
    if(typeof process === 'object'){
        var versions, nodeVersion;

        if((versions = process.versions) && (nodeVersion = versions.node)){
            UA.os = process.platform;
            UA.nodejs = numberify(nodeVersion);
        }
    }

    // use by analysis tools in nodejs
    UA.getDescriptorFromUserAgent = getDescriptorFromUserAgent;

    //设置html的Css
//    var browsers = [
//            // browser core type
//            'webkit',
//            'trident',
//            'gecko',
//            'presto',
//            // browser type
//            'chrome',
//            'safari',
//            'firefox',
//            'ie',
//            'opera'
//        ],
//        documentElement = doc && doc.documentElement,
//        className = '';
//    if (documentElement) {
//        B.each(browsers, function (key) {
//            var v = UA[key];
//            if (v) {
//                className += ' ks-' + key + (parseInt(v) + '');
//                className += ' ks-' + key;
//            }
//        });
//        if (B.trim(className)) {
//            documentElement.className = B.trim(documentElement.className + className);
//        }
//    }
})(B);
/**
 * 加载script标签
 * @author BAI
 * @date 2016/11/04
 */
(function (B){
    var MILLISECONDS_OF_SECOND = 1000,
        doc = document,
        UA = B.UA,
        headNode = doc.getElementsByTagName('head')[0] || doc.documentElement,
        jsCssCallbacks = {};
    B._mix(B, {
        currentScript: function (){
            //取得正在解析的script节点
            if(document.currentScript){ //firefox 4+
                return document.currentScript.src;
            }
            // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
            var stack;
            try {
                a.b.c(); //强制报错,以便捕获e.stack
            } catch (e) {//safari的错误对象只有line,sourceId,sourceURL
                stack = e.stack;
                if(!stack && window.opera){
                    //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
                    stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
                }
            }
            if(stack){
                stack = stack.split(/[@ ]/g).pop();//取得最后一行,最后一个空格或@之后的部分
                stack = stack[0] == "(" ? stack.slice(1, -1) : stack;
                return stack.replace(/(:\d+)?:\d+$/i, "");//去掉行号与或许存在的出错字符起始位置
            }
            var nodes = document.getElementsByTagName("script"); //只在head标签中寻找
            for (var i = 0, node; node = nodes[i++];) {
                if(node.readyState === "interactive"){
                    return node.className = node.src;
                }
            }
        },
        /**
         * 加载script
         * @param url
         * @param success
         * @param charset
         */
        loadScript: function (url, success, charset){
            var
                config = success,
                error,
                attrs,
                css = 0,
                timeout,
                callbacks,
                timer;
            if(B.startsWith(B.ext(url).toLowerCase(), '.css')){
                css = 1;
            }
            if(B.isObject(config)){
                success = config.success;
                error = config.error;
                attrs = config.attrs;
                timeout = config.timeout;
                charset = config.charset;
            }
            callbacks = jsCssCallbacks[url] = jsCssCallbacks[url] || [];

            callbacks.push([success, error]);

            if(callbacks.length > 1){
                return callbacks.node;
            }

            var node = doc.createElement(css ? 'link' : 'script'),
                clearTimer = function (){
                    if(timer){
                        timer.cancel();
                        timer = undefined;
                    }
                };

            if(attrs){
                B.each(attrs, function (v, n){
                    var attrName = n.toLowerCase();
                    if(attrName == "async" && !B.isUndefined(node.async)){
                        node.async = v;
                    } else {
                        node.setAttribute(n, v);
                    }
                });
            }

            if(charset){
                node.charset = charset;
            }

            if(css){
                node.href = url;
                node.rel = 'stylesheet';
            } else {
                node.src = url;
                node.async = true;
            }

            callbacks.node = node;

            var end = function (error){
                var index = error,
                    fn;
                clearTimer();
                S.each(jsCssCallbacks[url], function (callback){
                    if((fn = callback[index])){
                        fn.call(node);
                    }
                });
                delete jsCssCallbacks[url];
            };

            var useNative = 'onload' in node;
            var forceCssPoll = B.Config.forceCssPoll || (UA.webkit && UA.webkit < 536);

            if(css && forceCssPoll && useNative){
                useNative = false;
            }

            function onload(){
                var readyState = node.readyState;
                if(!readyState ||
                    readyState === 'loaded' ||
                    readyState === 'complete'){
                    node.onreadystatechange = node.onload = null;
                    end(0);
                }
            }

            //标准浏览器 css and all script
            if(useNative){
                node.onload = onload;
                node.onerror = function (){
                    node.onerror = null;
                    end(1);
                };
            }
            // old chrome/firefox for css
            else if(css){
                //:todo
//                pollCss(node, function () {
//                    end(0);
//                });
            } else {
                node.onreadystatechange = onload;
            }

            if(timeout){
                timer = B.later(function (){
                    end(1);
                }, timeout * MILLISECONDS_OF_SECOND);
            }
            if(css){
                headNode.appendChild(node);
            } else {
                headNode.insertBefore(node, headNode.firstChild);
            }
            return node;
        }
    });
})(B);
/**
 * Object Model
 */
(function (B){
    var MIX_CIRCULAR_DETECTION = '__MIX_CIRCULAR',
        hasEnumBug = !({toString: 1}.propertyIsEnumerable('toString')),
        enumProperties = [
            'constructor',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'toString',
            'toLocaleString',
            'valueOf'
        ];
    B._mix(B, {
        /**
         * 获取对象属性名
         */
        keys: Object.keys || function (o){
            var result = [], p, i;

            for (p in o) {
                if(o.hasOwnProperty(p)){
                    result.push(p);
                }
            }
            if(hasEnumBug){
                for (i = enumProperties.length - 1; i >= 0; i--) {
                    p = enumProperties[i];
                    if(o.hasOwnProperty(p)){
                        result.push(p);
                    }
                }
            }
            return result;
        },
        /**
         * 扩展
         * @param target    当前对象
         * @param resource  资源对象
         * @param overwrite 是否重写
         * @param whiteList 白名单
         * @param deep      是否深度复制
         */
        mix: function (target, resource, overwrite, whiteList, deep){
            if(overwrite && B.isObject(overwrite)){
                whiteList = overwrite["whiteList"];
                deep = overwrite["deep"];
                overwrite = overwrite["overwrite"];
            }
            if(whiteList && !B.isFunction(whiteList)){
                var originalWl = whiteList;
                whiteList = function (name, val){
                    return B.inArray(name, originalWl) ? val : undefined;
                };
            }
            if(overwrite === undefined){
                overwrite = true;
            }
            var cache = [],
                c,
                i = 0;
            mixInternal(target, resource, overwrite, whiteList, deep, cache);
            while ((c = cache[i++])) {
                delete c[MIX_CIRCULAR_DETECTION];
            }
            return target;
        },
        /**
         * 克隆对象
         * @param obj
         * @returns {*}
         */
        clone: function (obj){
            var objClone;
            if(obj.constructor === Object){
                objClone = new obj.constructor();
            } else {
                objClone = new obj.constructor(obj.valueOf());
            }
            for (var key in obj) {
                if(obj.hasOwnProperty(key) && objClone[key] != obj[key]){
                    if(typeof(obj[key]) == 'object'){
                        objClone[key] = obj[key].clone();
                    } else {
                        objClone[key] = obj[key];
                    }
                }
            }
            objClone.toString = obj.toString;
            objClone.valueOf = obj.valueOf;
            return objClone;
        }
    });

    function mixInternal(target, resource, overwrite, whiteList, deep, cache){
        if(!resource || !target){
            return resource;
        }
        var i, p, keys, len;

        // 记录循环标志
        resource[MIX_CIRCULAR_DETECTION] = target;

        // 记录被记录了循环标志的对像
        cache.push(resource);

        // mix all properties
        keys = B.keys(resource);
        len = keys.length;
        for (i = 0; i < len; i++) {
            p = keys[i];
            if(p !== MIX_CIRCULAR_DETECTION){
                // no hasOwnProperty judge!
                _mix(p, target, resource, overwrite, whiteList, deep, cache);
            }
        }
        return target;
    }

    function _mix(p, r, s, ov, wl, deep, cache){
        // 要求覆盖
        // 或者目的不存在
        // 或者深度mix
        if(ov || !(p in r) || deep){
            var target = r[p],
                src = s[p];
            // prevent never-end loop
            if(target === src){
                if(target === undefined){
                    r[p] = target;
                }
                return;
            }
            if(wl){
                src = wl.call(s, p, src);
            }
            // 来源是数组和对象，并且要求深度 mix
            if(deep && src && (B.isArray(src) || B.isObject(src))){
                if(src[MIX_CIRCULAR_DETECTION]){
                    r[p] = src[MIX_CIRCULAR_DETECTION];
                } else {
                    // 目标值为对象或数组，直接 mix
                    // 否则 新建一个和源值类型一样的空数组/对象，递归 mix
                    var clone = target && (B.isArray(target) || B.isObject(target)) ?
                        target :
                        (B.isArray(src) ? [] : {});
                    r[p] = clone;
                    mixInternal(clone, src, ov, wl, true, cache);
                }
            } else if(src !== undefined && (ov || !(p in r))){
                r[p] = src;
            }
        }
    }
})(B);

