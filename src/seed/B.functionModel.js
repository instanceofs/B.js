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