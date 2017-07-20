/**
 * Date Model
 */
(function (B) {
    var AP = Date.prototype;
    AP.addDays = AP.addDays || function (days) {
            this.setDate(this.getDate() + days);
            return this;
        };
    var weeks = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    AP.format = AP.format || function (strFormat) {
            if (strFormat === 'soon' || strFormat === 'week') {
                var left = this.left();
                if (left.dd < 5) {
                    var str = '';
                    var dd = B.now().getDate() - this.getDate();
                    if (left.dd == 0 && dd != 0) {
                        left.status = dd < 0;
                        left.dd = 1;
                    }
                    if (left.dd > 0) {
                        if (left.dd == 1)
                            return (left.status ? "明天" : "昨天") + this.format(' hh:mm');
                        if (strFormat == 'week') {
                            return weeks[this.getDay()];
                        } else {
                            str = left.dd + '天';
                        }
                    } else if (left.hh > 0) {
                        str = left.hh + '小时';
                    } else if (left.mm > 0) {
                        str = left.mm + '分钟';
                    } else if (left.ss > 10) {
                        str = left.ss + '秒';
                    } else {
                        return '刚刚';
                    }
                    return str + (left.status ? '后' : '前');
                }
                strFormat = 'yyyy-MM-dd';
            }
            if (strFormat === "date")
                return this;
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(strFormat))
                strFormat = strFormat.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(strFormat)) {
                    strFormat =
                        strFormat.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                            (o[k]) :
                            (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return strFormat;
        };
    AP.left = function () {
        var arr = {status: true};
        var nDifference = this - (new Date());
        if (nDifference < 0) {
            arr.status = false;
            nDifference = Math.abs(nDifference);
        }
        console.log(nDifference);
        var iDays = nDifference / (1000 * 60 * 60 * 24);
        arr.dd = iDays > 1 ? parseInt(iDays) : 0;
        var temp = iDays - arr.dd;
        var hh = temp * 24;
        arr.hh = hh > 1 ? parseInt(hh) : 0;
        temp = temp * 24 - arr.hh;
        hh = temp * 60;
        arr.mm = hh > 1 ? parseInt(hh) : 0;
        temp = temp * 60 - arr.mm;
        hh = temp * 60;
        arr.ss = hh > 1 ? parseInt(hh) : 0;
        temp = temp * 60 - arr.ss;
        hh = temp * 1000;
        arr.ms = hh > 1 ? parseInt(hh) : 0;
        return arr;
    };
    B._mix(B, {
        /**
         * 当前时间戳
         */
        nowTick: Date.now || function () {
            return +new Date();
        },
        /**
         * 现在的时间
         * @returns {Date}
         */
        now: function () {
            return new Date(B.nowTick());
        },
        /**
         * 添加天数
         * @param date
         * @param days
         * @returns {*}
         */
        addDays: function (date, days) {
            if (!B.isDate(date)) return B.now();
            days = (B.isNumber(days) ? days : 0);
            return new Date(date.addDays(days));
        },
        /**
         * 格式化时间
         * @param date
         * @param strFormat
         * @returns {*}
         */
        formatDate: function (date, strFormat) {
            if (B.isString(date) && /Date\((\d+)\)/gi.test(date)) {
                date = new Date(RegExp.$1 * 1);
            }
            if (!B.isDate(date)) return date;
            strFormat = strFormat || "yyyy-MM-dd";
            return date.format(strFormat);
        },
        /**
         * 计算剩余时间
         * @param date
         * @returns {*}
         */
        leftTime: function (date) {
            return date.left();
        }
    });
})(B);