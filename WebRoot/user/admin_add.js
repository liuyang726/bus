var areaId = "";
var data = getCookie("userInfo");
var login_user = eval("(" + data.substr(1,data.length-2) + ")");


$(function() {
	init();
});

//每当角色发生改变时，清除区域中原有值
function chooseRole(){
	$("#areaName").combotree('reset');
	areaId = "";
}

function init(){
	// 给对话框中添加属性
	$("#areaName").combotree({
		url:"../AreaService.do?actionType=queryArea"
	});
	//根据角色修改添加或编辑对话框中的角色值
	if(login_user.roleName=="省级管理员") 
	{
		$('#roleName option[value="省级管理员"]').remove(); 
	}
	else if(login_user.roleName=="市级管理员")
	{
		$('#roleName option[value="省级管理员"]').remove(); 
		$('#roleName option[value="市级管理员"]').remove(); 
	}
	//设置角色和区域的级联变动
	$("#areaName").combotree({ 
		onChange:function(){
			if($("#roleName").val() == "省级管理员"){
				if($("#areaName").combotree('getValue').length != 2){
					$("#areaName").combotree('reset');
				}
			}else {
				if($("#areaName").combotree('getValue').length != 4){
					$("#areaName").combotree('reset');
				}
			}
			areaId = $("#areaName").combotree('getValue');
		}
	});
}

function saveUserInfo() {
	url = "../CommonService.do?actionType=add&tableName=users";
	$('#superAddfm').form('submit', {
		url : url+="&areaId="+areaId,
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			if (result) {
				$.messager.alert("成功啦！","插入成功!");
				location.href='admin.html';//使页面跳转
			} else {
				$.messager.alert("出错啦！","插入失败!");
			} 
		}
	});
}

function cancelUserInfo(){
	$('#superAdddlg').dialog({closed:true});
}
