!(function(window, document) {

    var Jeff = function() {
        this.version = "1.0.0.1";
    };

    //数据类型判断
    Jeff.prototype.is = {

        isArray: function(arr) {
            return Object.prototype.toString.call(arr) === '[object Array]';
        },
        isFn: function(fn) {
            return Object.prototype.toString.call(fn) === '[object Function]';
        },
        isObj: function(x) {
            return x === Object(x);
        },
        emptyObj: function(obj) {
            if (this.isObj(obj)) {
                var k;
                for (k in obj) {
                    if (obj[k] === "undefined" || obj[k] === null || obj[k] === '')
                        return false
                }
                return true
            }
        }

    }
    //比较两个对象是否完全相等
    Jeff.prototype.cmp = function(x, y) {
        if (x === y) {
            return true;
        }
        if (!(x instanceof Object) || !(y instanceof Object)) {
            return false;
        }
        if (x.constructor !== y.constructor) {
            return false;
        }
        for (var p in x) {
            if (x.hasOwnProperty(p)) {
                if (!y.hasOwnProperty(p)) {
                    return false;
                }
                if (x[p] === y[p]) {
                    continue;
                }
                if (typeof(x[p]) !== "object") {
                    return false;
                }
            }
        }
        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }
    //符点数相加
    Jeff.prototype.accAdd = function(arg1, arg2) {
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    }

    //字符串类

    /*
     * 实现utf8字符解码
     */
    Jeff.prototype.utf8_decode = function(str) {
        var tmp_arr = [],
            i = 0,
            ac = 0,
            c1 = 0,
            c2 = 0,
            c3 = 0;
        str += '';
        while (i < str.length) {
            c1 = str.charCodeAt(i);
            if (c1 < 128) {
                tmp_arr[ac++] = String.fromCharCode(c1);
                i++;
            } else if (c1 > 191 && c1 < 224) {
                c2 = str.charCodeAt(i + 1);
                tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = str.charCodeAt(i + 1);
                c3 = str.charCodeAt(i + 2);
                tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return tmp_arr.join('');
    }

    /*
     * HTML代码过滤
     */
    Jeff.prototype.htmlDecode = function(str) {
        return str
            .replace(/&#39;/g, '\'')
            .replace(/<br\s*(\/)?\s*>/g, '\n')
            .replace(/&nbsp;/g, ' ')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&');
    }

    //URL类

    /*********************  URL类  *********************/

    Jeff.prototype.url = {
        /*
         * 获取url参数
         * @return {mame1:value1,name2:value1}
         */
        getUrlParam: function() {
            var result = {},
                queryString = location.search.substring(1),
                re = /([^&=]+)=([^&]*)/g,
                s;
            while (s = re.exec(queryString)) {
                result[s[1]] = s[2];
            }
            return result;
        }
    }

    Jeff.prototype.load = {
        //动态加载JS
        js: function(url, callback) {
            var head = document.getElementsByTagName('head')[0]
            var script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', url);
            head.appendChild(script);

            //回调
            var callbackFn = function() {
                if (typeof callback === 'function') {
                    callback();
                }
            };

            if (document.all) { //IE
                script.onreadystatechange = function() {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        callbackFn();
                    }
                }
            } else {
                script.onload = function() {
                    callbackFn();
                }
            }

        }

        //css
    };
    /*********************  URL类 End  *********************/


    /*********************  时间类  *********************/

    /*
     * 时间戳转换成指定的时间显示格式   
     * @param format ==> string ("Y-m-d H:i:s")
     * @param timestamp  ==> int (1491970964)
     * new Date().formatUnix('Y-m-d H:i:s',new Date().getTime()/1000) ==> 2017-04-12 12:28:00
     */
    Jeff.prototype.formatUnix = function(format, timestamp) {
        var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
        var pad = function(n, c) {
                if ((n = n + "").length < c) {
                    return new Array(++c - n.length).join("0") + n;
                } else {
                    return n;
                }
            },
            txt_weekdays = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            txt_ordin = { 1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st" },
            txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            f = {
                // Day
                d: function() { return pad(f.j(), 2) },
                D: function() { return f.l().substr(0, 3) },
                j: function() { return jsdate.getDate() },
                l: function() { return txt_weekdays[f.w()] },
                N: function() { return f.w() + 1 },
                S: function() { return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th' },
                w: function() { return jsdate.getDay() },
                z: function() { return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0 },

                // Week
                W: function() {
                    var a = f.z(),
                        b = 364 + f.L() - a;
                    var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
                    if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
                        return 1;
                    } else {
                        if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
                            nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                            return date("W", Math.round(nd2.getTime() / 1000));
                        } else {
                            return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                        }
                    }
                },

                // Month
                F: function() { return txt_months[f.n()] },
                m: function() { return pad(f.n(), 2) },
                M: function() { return f.F().substr(0, 3) },
                n: function() { return jsdate.getMonth() + 1 },
                t: function() {
                    var n;
                    if ((n = jsdate.getMonth() + 1) == 2) {
                        return 28 + f.L();
                    } else {
                        if (n & 1 && n < 8 || !(n & 1) && n > 7) {
                            return 31;
                        } else {
                            return 30;
                        }
                    }
                },

                // Year
                L: function() { var y = f.Y(); return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0 },
                Y: function() { return jsdate.getFullYear() },
                y: function() { return (jsdate.getFullYear() + "").slice(2) },
                // Time
                a: function() { return jsdate.getHours() > 11 ? "pm" : "am" },
                A: function() { return f.a().toUpperCase() },
                B: function() {
                    var off = (jsdate.getTimezoneOffset() + 60) * 60;
                    var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
                    var beat = Math.floor(theSeconds / 86.4);
                    if (beat > 1000) beat -= 1000;
                    if (beat < 0) beat += 1000;
                    if ((String(beat)).length == 1) beat = "00" + beat;
                    if ((String(beat)).length == 2) beat = "0" + beat;
                    return beat;
                },
                g: function() { return jsdate.getHours() % 12 || 12 },
                G: function() { return jsdate.getHours() },
                h: function() { return pad(f.g(), 2) },
                H: function() { return pad(jsdate.getHours(), 2) },
                i: function() { return pad(jsdate.getMinutes(), 2) },
                s: function() { return pad(jsdate.getSeconds(), 2) },
                O: function() {
                    var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
                    if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
                    else t = "+" + t;
                    return t;
                },
                P: function() { var O = f.O(); return (O.substr(0, 3) + ":" + O.substr(3, 2)) },
                c: function() { return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P() },
                U: function() { return Math.round(jsdate.getTime() / 1000) }
            };

        return format.replace(/[\\]?([a-zA-Z])/g, function(t, s) {
            var result;
            if (t != s) {
                result = s;
            } else if (f[s]) {
                result = f[s]();
            } else {
                result = s;
            }
            return result;
        });

    };
    /*
     * 获取某天前后X天日期
     * J.getDateStr(-1,new Date()) ==> 获取昨天的日期
     * J.getDateStr(5,"2017-04-05") ==>  获取5天后的日期
     */
    Jeff.prototype.getLaterDay = function(dayCount, date) {
        if (typeof date === 'string') {
            date = new Date(Date.parse(date.replace(/-\/./g, "/")));
        }
        date.setDate(date.getDate() + dayCount);
        return date;
    };
    /*
     * 获取某月最后一天的日期
     * @param year ==> int (2017)
     * @param date  ==> int (5)
     * J.getLastDay(2017,5) ==> 获取5月份最后一天的日期
     */
    Jeff.prototype.getLastDay = function(year, month) {
        if (!year || !month) {
            year = new Date().getFullYear();
            month = new Date().getMonth() + 1;
        }
        return new Date(year, month, 0).getDate();
    };

    /*
     * 比较两个时间大小  yyyy-mm-dd
     * @returns： true d1比d2大, flase d1比d2小
     */
    Jeff.prototype.compareDate = function(d1, d2) {
        return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
    }
    /*********************  时间类 End  *********************/

    //常用正则验证
    //DOM操作
    //微信相关
    Jeff.prototype.wx = {
        //解决audio在IOS微信中不能自动播放的问题
        audioAutoPlay: function(ele) {
            var audio = document.getElementById(ele);
            audio.play();
            document.addEventListener("WeixinJSBridgeReady", function() {
                audio.play();
            }, false);
        }
    }


    /*
     * cookie操作类
     */
    Jeff.prototype.cookie = {

        del: function(name, path, domain) {
            document.cookie = name + "=" + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
        },

        get: function(name) {
            var v = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
            return v ? decodeURIComponent(v[1]) : null;
        },

        set: function(name, value, expires, path, domain) {
            var str = name + "=" + encodeURIComponent(value);
            if (expires != null || expires != '') {
                if (expires == 0) { expires = 100 * 365 * 24 * 60; }
                var exp = new Date();
                exp.setTime(exp.getTime() + expires * 60 * 1000);
                str += "; expires=" + exp.toGMTString();
            }
            if (path) { str += "; path=" + path; }
            if (domain) { str += "; domain=" + domain; }
            document.cookie = str;
        }
    };

    /*
     *随机类
     */
    Jeff.prototype.random = {
        //随机生成一个十六进制颜色
        color: function() {
            var c = Math.random(0, 0xFFFFFF);
            return '#' + ('000000' + c.toString(16)).slice(-6);
        },
        intNum: function(begin, end) {
            var c = end - begin + 1;
            return Math.floor(Math.random() * c + begin);
        },
        //生成指定位数的随机字符串大小写字母
        string: function(len) {
            len = len || 32;
            var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
                max = chars.length,
                exp = '';
            for (i = 0; i < len; i++) {
                exp += chars.charAt(Math.floor(Math.random() * (max + 1)));
            }
            return exp;
        }
    }

    //判断当前系统平台
    /*
        · isAndroid : 是否为安卓系统
        · isBlackBerry : 是否为黑莓
        · isIpad : 是否为iPad
        · isIphone : 是否为iPhone
        · isMacintosh : 是否为Mac
        · isMobile : 是否为移动设备
        · isWindows : 是否为Windows
        . isWeiXin : 是否是微信
        . isQQBrowser : 就否QQ浏览器
        . isFirefox : 是否火狐浏览器
        . is360 : 是否360浏览器
    */
    Jeff.prototype.os = {
        isAndroid: /android/i.test(navigator.userAgent),
        isBlackBerry: /BlackBerry/i.test(navigator.userAgent),
        isIpad: /ipad/i.test(navigator.userAgent),
        isIphone: /iphone/i.test(navigator.userAgent),
        isMacintosh: /macintosh/i.test(navigator.userAgent),
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isWindows: /windows/i.test(navigator.userAgent),
        isWeiXin: window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger',
        isQQBrowser: /QQBrowser/i.test(navigator.userAgent),
        isFirefox: /Firefox/i.test(navigator.userAgent),
        is360: /360/i.test(navigator.userAgent)
    }

    //获取本机内网(局域网)IP
    Jeff.prototype.getLocalIp = function(callback) {
        var ip_dups = {},
            RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
            mediaConstraints = {
                optional: [{ RtpDataChannels: true }]
            },
            servers = undefined;
        if (window.webkitRTCPeerConnection)
            servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };
        var pc = new RTCPeerConnection(servers, mediaConstraints);
        pc.onicecandidate = function(ice) {
            if (ice.candidate) {
                var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
                if (ip_dups[ip_addr] === undefined)
                    callback(ip_addr);
                ip_dups[ip_addr] = true;
            }
        };
        pc.createDataChannel("");
        pc.createOffer(function(result) {
            pc.setLocalDescription(result, function() {});
        }, function() {});
    };

    /*********************  事件  *********************/
    //添加事件监听
    Jeff.prototype.addEvent = function(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on' + type, function() {
                handler.call(element);
            });
        }
    };
    //移除事件， handler 不能为匿名函数
    Jeff.prototype.removeEvent = function(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else {
            element.detachEvent('on' + type, handler);
        }
    };

    /**
     * 防抖
     * @param func
     * @param wait
     * @param scope
     * @returns {Function}
     */
    Jeff.prototype.debounce = function(func, wait, scope) {
        var timeout;
        return function() {
            var context = scope || this,
                args = arguments;
            var later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 节流
     * @param fn
     * @param threshhold
     * @param scope
     * @returns {Function}
     */
    Jeff.prototype.throttle = function(fn, threshhold, scope) {
        threshhold || (threshhold = 250);
        var last,
            deferTimer;
        return function() {
            var context = scope || this;

            var now = +new Date,
                args = arguments;
            if (last && now < last + threshhold) {
                // hold on to it
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function() {
                    last = now;
                    fn.apply(context, args);
                }, threshhold);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

    window.J = new Jeff();

})(window, document)