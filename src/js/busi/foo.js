//foo.js
/**
 * @require ./base.js
 */
//你的js应该包含在一个自执行函数里面
;(function(){
	zt.say('foo.js say');
	console.log('foo.js 业务逻辑代码在这里！');
})();