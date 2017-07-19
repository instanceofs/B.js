/**
 * 加载script标签
 * @author BAI
 * @date 2016/6/04
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