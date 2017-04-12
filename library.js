
!(function(window,document){

    var Jeff = function (){};

    //数组类
    //字符串类

/*********************  时间类  *********************/

    /*
    * 时间戳转换成指定的时间显示格式   
    * @param format ==> string ("Y-m-d H:i:s")
    * @param timestamp  ==> int (1491970964)
    * new Date().formatUnix('Y-m-d H:i:s',new Date().getTime()/1000) ==> 2017-04-12 12:28:00
    */
    Jeff.prototype.formatUnix = function(format, timestamp) {
        var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
        var pad = function(n, c){
            if((n = n + "").length < c){
                return new Array(++c - n.length).join("0") + n;
            } else {
                return n;
            }
        };
        var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};
        var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var f = {
            // Day
            d: function(){return pad(f.j(), 2)},
            D: function(){return f.l().substr(0,3)},
            j: function(){return jsdate.getDate()},
            l: function(){return txt_weekdays[f.w()]},
            N: function(){return f.w() + 1},
            S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'},
            w: function(){return jsdate.getDay()},
            z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0},

            // Week
            W: function(){
                var a = f.z(), b = 364 + f.L() - a;
                var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
                if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
                    return 1;
                } else{
                    if(a <= 2 && nd >= 4 && a >= (6 - nd)){
                        nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                        return date("W", Math.round(nd2.getTime()/1000));
                    } else{
                        return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                    }
                }
            },

            // Month
            F: function(){return txt_months[f.n()]},
            m: function(){return pad(f.n(), 2)},
            M: function(){return f.F().substr(0,3)},
            n: function(){return jsdate.getMonth() + 1},
            t: function(){
                var n;
                if( (n = jsdate.getMonth() + 1) == 2 ){
                    return 28 + f.L();
                } else{
                    if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
                        return 31;
                    } else{
                        return 30;
                    }
                }
            },

            // Year
            L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0},
            Y: function(){return jsdate.getFullYear()},
            y: function(){return (jsdate.getFullYear() + "").slice(2)},
            // Time
            a: function(){return jsdate.getHours() > 11 ? "pm" : "am"},
            A: function(){return f.a().toUpperCase()},
            B: function(){
                var off = (jsdate.getTimezoneOffset() + 60)*60;
                var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
                var beat = Math.floor(theSeconds/86.4);
                if (beat > 1000) beat -= 1000;
                if (beat < 0) beat += 1000;
                if ((String(beat)).length == 1) beat = "00"+beat;
                if ((String(beat)).length == 2) beat = "0"+beat;
                return beat;
            },
            g: function(){return jsdate.getHours() % 12 || 12},
            G: function(){return jsdate.getHours()},
            h: function(){return pad(f.g(), 2)},
            H: function(){return pad(jsdate.getHours(), 2)},
            i: function(){return pad(jsdate.getMinutes(), 2)},
            s: function(){return pad(jsdate.getSeconds(), 2)},
            O: function(){
                var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
                if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
                return t;
            },
            P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))},
            c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()},
            U: function(){return Math.round(jsdate.getTime()/1000)}
        };

        return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
            var ret;
            if( t!=s ){
                ret = s;
            } else if( f[s] ){
                ret = f[s]();
            } else{
                ret = s;
            }
            return ret;
        });

    };
    /*
    * 获取某天前后X天日期
    * @param dayCount ==> int (1)
    * @param date  ==> string & object ("2090-04-01" or new Date())
    * J.getDateStr(-1,new Date()) ==> 获取昨天的日期
    * J.getDateStr(5,"2017-04-05") ==>  获取5天后的日期
    */
    Jeff.prototype.getLaterDay = function(dayCount,date) {
    	//如果传入date的值为字符串，就将其转换为日期对象
        if (typeof date === 'string') {  
			date = new Date(Date.parse(date.replace(/-/g, "/")));
        }
        date.setDate(date.getDate() + dayCount);//获取DayCount天后的日期
        var y = date.getFullYear(),
            m = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1),
            d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); 
        return y + "-" + m + "-" + d;
    };
    /*
    * 获取某月最后一天的日期
    * @param year ==> int (2017)
    * @param date  ==> int (5)
    * J.getLastDay(2017,5) ==> 获取5月份最后一天的日期
    */
    Jeff.prototype.getLastDay = function(year, month) {
        var new_year = year,    //取当前的年份
            new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）
        if (month > 12) {
            new_month -= 12;
            new_year++; 
        }
        var new_date = new Date(new_year, new_month, 1);//取当年当月中的第一天
        return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期
    };

    /*
    * 比较两个时间大小  yyyy-mm-dd
    * @returns true ==> d1比d2大, flase d1比d2小
     */
    Jeff.prototype.compareDate = function(d1, d2) {
        return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
    }
/*********************  时间类 End  *********************/

    //常用正则验证

    /*
    * cookie操作类
    */
    Jeff.prototype.cookie = {

        del: function(name, path, domain){
            document.cookie = name + "=" +	((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
        },

        get: function(name){
            var v = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
            return v ? decodeURIComponent(v[1]) : null;
        },

        set: function(name, value ,expires, path, domain){
            var str = name + "=" + encodeURIComponent(value);
            if (expires != null || expires != '') {
                if (expires == 0) {expires = 100*365*24*60;}
                var exp = new Date();
                exp.setTime(exp.getTime() + expires*60*1000);
                str += "; expires=" + exp.toGMTString();
            }
            if (path) {str += "; path=" + path;}
            if (domain) {str += "; domain=" + domain;}
            document.cookie = str;
        }
    };

    //获取本机内网IP
    Jeff.prototype.getLocalIp =  function(callback){
        var ip_dups = {},
            RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
            mediaConstraints = {
                optional: [{RtpDataChannels: true}]
            },
            servers = undefined;
        if(window.webkitRTCPeerConnection)
            servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
        var pc = new RTCPeerConnection(servers, mediaConstraints);
        pc.onicecandidate = function(ice){
            if(ice.candidate){
                var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
                if(ip_dups[ip_addr] === undefined)
                    callback(ip_addr);
                ip_dups[ip_addr] = true;
            }
        };
        pc.createDataChannel("");
        pc.createOffer(function(result){
            pc.setLocalDescription(result, function(){});
        }, function(){});
    };

    window.J = new Jeff();

})(window,document)