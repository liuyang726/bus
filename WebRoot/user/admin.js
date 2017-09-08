var areaId = "";
var data = getCookie("userInfo");
var login_user = eval("(" + data.substr(1,data.length-2) + ")");

$(function() {
	init();
	queryUserList();// 显示管理员列表	
});
//每当角色发生改变时，清除区域中原有值
function chooseRole(){
	$("#areaName").combotree('reset');
	areaId = "";
}
function init(){
	// 添加查询时的组合树
	$("#queryArea").combotree({
		url:"../AreaService.do?actionType=queryArea"
	});
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
	//设置区域查询选择限制(不可选择最顶级的选项)
	$("#queryArea").combotree({ 
		onChange:function(){
			if(login_user.roleName=="超级管理员"){
				if($("#queryArea").combotree('getValue').length == 1){
					$("#queryArea").combotree('reset');
				}
			}
			else if(login_user.roleName=="省级管理员"){
				if($("#queryArea").combotree('getValue').length == 2){
					$("#queryArea").combotree('reset');
				}
			}
		}
	});
}

// 查出所有管理员信息
function queryUserList() {
 	    	$('#dg').datagrid({
				url:"../UserService.do",
				queryParams:{
 	    		actionType:"exceptQuery",
 	    		areaId:$("#queryArea").combotree('getValue')
				},
				rownumbers : true,
				singleSelect : true,
				autoRowHeight : false,
				pagination : true,
				resizable:false,
				pageNumber: 1,
				pageSize:10,
				columns : [ [ {
					field : 'userId',
					title : '用户编号',
					width : 100
				}, {
					field : 'userName',
					title : '用户名称',
					width : 100
				}, {
					field : 'password',
					title : '密码',
					width : 100
				}, {
					field : 'roleName',
					title : '角色',
					width : 100
				}, {
					field : 'areaName',
					title : '所属区域',
					width : 100
				},{
					field : 'areaId',
					hidden : true,
				  }
				] ]
			});
 	    	
}
 	    	
// 添加用户信息
function addUser() {
	$("#rpwd").validatebox({disabled:false});
	$('#dlg').dialog('open').dialog('setTitle', '添加管理员');
	clearForm();// 新建人员时先清除表单中其他信息
	$("#userName").textbox({readonly:false});// 使用户名可编辑
	$('#password').textbox({readonly:false});// 密码可编辑
	$('#repwd').removeAttr("style");// 显示确认密码行
	url = "../CommonService.do?actionType=add&tableName=users";
	areaId = "";
}
// 清除表单中的数据
function clearForm(){
	// 清除所有行的数据
	$("#userName").textbox('clear');
	$("#password").textbox('clear');
	$("#rpwd").textbox('clear');
	$('#areaName').combotree('clear');
	$("#roleName option：first").attr("selected", true);// 使角色默认选择第一项
}
// 编辑人员信息
function editUser() {
	$("#userName").textbox({readonly:true});
	$("#password").textbox({readonly:true});
	$('#repwd').attr("style","display:none");// 使确认密码行隐藏不显示
	$("#rpwd").validatebox({disabled:true});
	var row = $('#dg').datagrid('getSelected');
	if (row) {
		$('#dlg').dialog('open').dialog('setTitle', '编辑管理员');
        $('#fm').form('load', row);// 向form表单中加载数据
        $("#rpwd").textbox({value:row.password});//
        $("#areaName").combotree({value:row.areaName});//
		url = "../CommonService.do?actionType=edit&tableName=users&userId="+row.userId;
		areaId = row.areaId;
	}else{
		$.messager.alert("出错啦！","请选择一条数据!");
	}
}
// 删除用户
function destroyUser() {
	var row = $('#dg').datagrid('getSelected');
	if (row) {
		$.messager.confirm('提示！',
				'确定删除此条记录吗?', function(r) {
					if (r) {
						$.post("../CommonService.do?", {
							userId : row.userId,
							tableName : "users",
							actionType:"del"
						}, function(result) {
							if (result) {
								$.messager.alert("成功啦！","删除成功!");
								$('#dg').datagrid(queryUserList()); // 重新加载数据
							} else {
								$.messager.alert("出错啦！","删除失败!");
							}
						}, 'json');
					}
				});
	}else{
		$.messager.alert("出错啦！","请选择一条数据!");
	}
}
// 保存
function saveUserInfo() {
	$('#queryArea').combotree('clear');// 清除查询框中的值
	$('#fm').form('submit', {
		url : url+="&areaId="+areaId,
		onSubmit : function() {
			if(areaId == ""){
				$.messager.alert("提示信息","请选择区域信息！");// 没有选择区域信息时增加提示消息
				return false;
			}
			return $(this).form('validate');
		},
		success : function(result) {
			if (result) {
				$.messager.alert("成功啦！","操作成功!");
				$('#dlg').dialog('close');// 关闭对话框
				$('#dg').datagrid(queryUserList()); // 重新加载数据
			} else {
				$.messager.alert("出错啦！","操作失败!");
			} 
		}
	});
}
// 取消
function cancelUserInfo(){
	$('#dlg').dialog({closed:true});
}
