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