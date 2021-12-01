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
         * @param {String} uri
         * @returns {Array}
         */
        uri: function (url){
          var url = (url ? url: location.href);
          return (B.urlDecode(url).match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function(e, r) {
            return e[r.slice(0, r.indexOf("="))] = r.slice(r.indexOf("=") + 1), e;
          }, {});
        },
      /**
       * url编码
       * @param  url
       * @return {String} 已编码的url部分字符串
       */
      urlEncode: function(b) {
        return encodeURIComponent(String(b))
      },
      /**
       * url解码
       * @param  url
       * @param {String} url 这是url的一部分被解码.
       * @return {String} 解码的url部分字符串
       */
      urlDecode: function(url) {
        return decodeURIComponent(url.replace(/\+/g, " "))
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
