
// 扩展验证方法
$.extend($.fn.validatebox.defaults.rules, {
	// 验证两次输入密码是否正确
	equals : {
		validator : function(value, param) {
			return value == param[0];
		},
		message : '两次密码输入不一致！'
	},

	// 字符验证
	stringCheck : {
		validator : function(value) {
			return /^[\w]+$/.test(value);
		},
		message : "输入只能包括英文字母、数字和下划线."
	}
 ,
	minLength : {
		validator : function(value, param) {
			return value.length >= param[0];
		},
		message : '请至少输入{0}个字符！.'
		 }
		});
