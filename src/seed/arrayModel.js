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
