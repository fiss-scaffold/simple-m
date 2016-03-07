//base.js


//公共的代码
;(function(){
	console.log('base.js 代码实现！');

	
	//如果实在有必要才暴露变量到一个固定的命名空间例如window.zt上面，不要随便暴露变量到全局
	window.zt = window.zt || {};
	window.zt.say= function(msg){
		console.log(msg);
	}

})();