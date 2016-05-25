/*
 @整理一些自用的js代码
*/
"use strict";
var jeff = {
    
    //获取Dom元素
    get : function(s){
           return document.querySelectorAll(s);
    },
    // 判断数组
    isArray : function(a) {
        return toString.apply(a) === '[object Array]';
    },
    Cun:(function(){
    	  var n = 0;
    	  return function(){
    	    	return ++n;
      	}
    })()
}
