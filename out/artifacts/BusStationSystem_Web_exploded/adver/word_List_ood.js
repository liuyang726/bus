var url;
var userdatas;
var currentPageNo = 1;

$(function() {	
	initAdverInfo();
	queryAdverInfo();
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
	$("#adId").attr("readonly","readonly");  //主键不可修改！！
	var row = $('#worddg').datagrid('getSelected');
	if (row) {
		$('#worddlg').dialog('open').dialog('setTitle', '修改广告');
		$('#wordfm').form('load', row);
		$('#adId').textbox('setValue',row.adId);
		$("#adId").textbox({readonly:true});
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
	$('#wordfm').form('submit', {
		url : url,
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			if (result) {
				$('#worddlg').dialog('close');// close the dialog
				$('#worddg').datagrid(queryAdverList()); // reload the user data
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
	$('#worddlg').dialog({closed:true});
}

function destroyAdver() {
	var row = $('#adverdg').datagrid('getSelected');
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
								$('#adverdg').datagrid(queryAdverList()); // reload
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
	$('#worddg').datagrid( {
		url : "../AdService.do",
		rownumbers : true,
		singleSelect : true,
		autoRowHeight : false,
		fitColumns : true,
		pagination : true,
		queryParams : {
			actionType:"queryDate",
			adType : "文本类",
			adName : $("#queryAdName").val()
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
