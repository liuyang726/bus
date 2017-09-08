
//确认修改密码
function saveUserInfo() {
	$('#pwdfm').form('submit', {
		url : "../UserService.do?actionType=userEdit&tableName=users",
		onSubmit : function() {
			return $(this).form('validate');
		},
		dataType:"text",
		success : function(result) {
			var rs = eval("(" + result + ")");
			if(rs.result == "success"){
				$.messager.alert("提示信息！","密码修改成功，请重新登录！");
				parent.location.href="../login.html";	
			}else{
				$.messager.alert("提示信息！",rs.result);
			}
		}
	});
}
//取消修改密码
function cancelUserInfo(){
	$('#pwdfm').form('reset');
}
