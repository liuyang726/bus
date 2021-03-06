$(function() {
	init();
	queryUserList();// 显示公交公司会员列表
});

function init(){
	//给查询框中添加数据
	$("#queryArea").combotree({
		url:"../AreaService.do?actionType=queryArea"
	});
	//设置区域查询选择限制(因为会员所属区域一定为市区，所以不可选择非市区的选项)
	$("#queryArea").combotree({ 
		onChange:function(){
				if($("#queryArea").combotree('getValue').length != 4){
					$("#queryArea").combotree('reset');
				}
			}
	});
}

// 查出所有公交公司会员信息
function queryUserList() {
 	    	$('#busdg').datagrid({
				url:"../UserService.do",
				queryParams:{
 	    		actionType:"queryMember",
 	    		roleName:"公交公司会员",
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
				}, {
					field : 'isExamined',
					title : '审核状态',
					width : 100,
					formatter:function(value){
					if(value == "1"){
						return "已审核";
					}else if(value == "0"){
						return "待审核";
					}else {
						return value;
					}
				}
				},{
					field : 'areaId',
					hidden : true,
				  }
				] ]
			});
}
function checkBusMember() {
	$('#queryArea').combotree('clear');//清除查询框中数据
	var row = $('#busdg').datagrid('getSelected');
	if (row) {
		if(row.isExamined=="1") $.messager.alert("出错啦！","该公交公司会员已审核!");
		else 
			{
			$.messager.confirm('提示！',
				'确定审核通过此公交公司会员吗?', function(r) {
					if (r) {
						$.post("../CommonService.do?", {
							actionType:"edit",
							tableName : "users",
							userId : row.userId,
							isExamined:"1"
						}, function(result) {
							if (result) {
								$.messager.alert("成功啦！","公交公司会员审核成功!");
							    $('#busdg').datagrid(queryUserList()); // 重新加载数据
							} else {
								$.messager.alert("出错啦！","公交公司会员审核成功失败!");
							}
						}, 'json');
					}
				});
	}
}else{
		$.messager.alert("出错啦！","请选择一条数据!");
	}
}