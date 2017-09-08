var areaId = "";
var roleName=$("input[type='radio']:checked").val();
var isExamined="0";
$(function() {
	init();
});
function init(){
	// 给对话框中添加属性
	$("#areaName").combotree({
		url:"../AreaService.do?actionType=queryAreaRes"
	});
	//设置区域查询选择限制(因为会员所属区域一定为市区，所以不可选择非市区的选项)
	$("#areaName").combotree({ 
		onChange:function(){
				if($("#areaName").combotree('getValue').length != 4){
					$("#areaName").combotree('reset');
				}
			}
	});
}	
function role(){
   roleName=$("input[type='radio']:checked").val();
}
function saveMemberInfo() {
	roleName=$("input[type='radio']:checked").val();
	areaId = $("#areaName").combotree('getValue');
	url = "../CommonService.do?actionType=add&tableName=users";
	$('#registerfm').form('submit', {
		url : url+="&roleName="+roleName+"&areaId="+areaId+"&isExamined="+isExamined,
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			if (result) {
				$.messager.alert("成功啦！","会员注册成功!");
				location.href='../login.html';//使页面跳转
			} else {
				$.messager.alert("出错啦！","会员注册失败!");
			} 
		}
	});
}

function cancelMemberInfo(){
	$('#registerdlg').dialog({closed:true});
}


