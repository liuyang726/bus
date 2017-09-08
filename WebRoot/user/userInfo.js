//var userId="";
$(function() {
	init();	
});
//想表单中加载当前用户的信息
function init(){
	jQuery.ajax({
		type: "POST",
		url: "../UserService.do",
		data: {
 			actionType:"queryUserInfo"
 		},
	   dataType: "json",
 	   success: function (result) {
 			if(result){
 				$("#userName").textbox({value:result[0].userName});
 				$("#roleName").textbox({value:result[0].roleName});
 				$("#areaName").textbox({value:result[0].areaName});
 				userId=result[0].userId;
 				//alert(result[0].userId);
 			}
		},
		error: function (data) {
			$.messager.alert("出错啦！","查询异常!");
		},
		beforeSend: function (data) {
			
		}
	});
}
//确认修改用户信息
function saveUserInfo() {
	url = "../CommonService.do?actionType=edit&tableName=users&userId="+userId;
	$('#infofm').form('submit', {
		url : url,
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			if (result) {
				$.messager.alert("成功啦！","信息修改成功!");
			} else {
				$.messager.alert("出错啦！","信息修改失败!");
			} 
		}
	});
}
//取消修改用户信息
function cancelUserInfo(){
	$('#infofm').form('reset');
}
