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
