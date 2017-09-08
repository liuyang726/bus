
//文本类的直接显示对应的信息
var url;
$(function() {	
	initAdverInfo();
	queryAdverInfo();
	//getDetailview();
});
function queryAdverInfo(){	
	queryAdverList();
} 

	
//在弹出的对话框中添加两个按钮，按钮的提交信息由handle后面的事件实现，对应：id为dlg的对话框
function initAdverInfo(){
   $('#adId').validatebox({
        required: true,
        validType: {length:[0,20]}
    });
}
//修改广告！
function editAdver() {
	var row = $('#worddg2').datagrid('getSelected');
	if (row) {
		$('#worddlg2').dialog('open').dialog('setTitle', '修改广告');
		$('#adId').textbox('setValue',row.adId);
		$("#adId").textbox({readonly:true});
		$('#wordfm2').form('load', row);
		$("#publishDate").datebox('setValue',row.publishDate);
		$("#expiryDate").datebox('setValue',row.expiryDate);
		url = "../CommonService.do?actionType=edit&&tableName=adInfo&adId=" + row.adId;
	}else{
		$.messager.show({
			title : '出错啦！',
			msg : "请选择一条数据!",
			showType:'show'
		});
	}
}
//保存信息
function saveAdverInfo() {
	$('#wordfm2').form('submit', {
		url : url,
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			if (result) {
				$('#worddlg2').dialog('close');// close the dialog
				$('#worddg2').datagrid(queryAdverList()); // reload the user data
			} else {
				$.messager.show({
					title : '出错啦！',
					msg : result,
					showType:'show'
				});
			}
		}
	});
}

function advercancel(){
	$('#worddlg2').dialog({closed:true});
}

function destroyAdver() {
	var row = $('#worddg2').datagrid('getSelected');
	if (row) {
		$.messager.confirm('Confirm',
				'确定删除此条记录吗?', function(r) {
					if (r) {
						$.post("../CommonService.do?", {
							adId : row.adId,
							tableName : "adInfo",
							actionType:"del"
						}, function(result) {
							if (result) {
								$('#worddg2').datagrid(queryAdverList()); // reload
							} else {
								$.messager.show({ // show error message
									title : '出错啦！',
									msg : "删除失败"
								});
							}
						}, 'json');
					}
				});
	}else{
		$.messager.show({
			title : '出错啦！',
			msg : "请选择一条数据!",
			showType:'show'
		});
	}
}
function queryAdverList() {
	$('#worddg2').datagrid( {
		url : "../AdService.do",
		rownumbers : true,
		singleSelect : true,
		autoRowHeight : false,
		fitColumns : true,
		pagination : true,
		queryParams : {
			actionType : "publish",
			adType : "文本类",
			adName : $("#queryAdName").val()//取对应的input框的值进行查询,vedio_List.html中
		},
		columns : [ [{
			field : 'adId', //此处的feild名称必须与数据库表中保持一致
			title : '广告编号',
			width : 80
		}, {
			field : 'adName',
			title : '广告名称',
			width : 80
		},  {
			field : 'publish',
			title : '是否发布',
			width : 80,
			formatter:function(value){
				if(value == "0"){
					return "未发布";
				}else if(value == "1"){
					return "已发布";
				}else {
					return value;
				}
			}
		}, {
			field : 'userName',
			title : '广告所有者',
			width : 80
		}, {
			field : 'adType',
			title : '广告类型',
			width : 80
		},{
			field : 'publishDate',
			title:'发布日期',
			width : 80
		},{
			field : 'expiryDate',
			title:'失效日期',
			width : 80
		},{
			field : 'isExamined',
			title:'审核状态',
			width : 80,
			formatter:function(value){
				if(value == "0"){
					return "待审核";
				}else if(value == "1"){
					return "已审核";
				}else {
					return value;
				}
			}
		},{
			field : 'content',
			title:'广告内容',
			width : 200
		} ] ],
		error: function (data) {
			 $.messager.show({
				 title:'出错啦1',
				 msg:'查询异常',
				 showType:'show'
			 });
		},
		beforeSend: function (data) {
			
		}
	});
}