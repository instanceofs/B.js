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