var url;
$(function() {	
	initAdverInfo();
	queryAdverInfo();
	getDetailview();
});
function queryAdverInfo(){	
	queryAdverList();
} 

//获取详细信息的方法
function getDetailview() {
	$('#vediodg2').datagrid(
			{
				view : detailview,
				detailFormatter : function(index, row) {		
					return '<div class="ddv"></div>';
				},
				onExpandRow : function(index, row) {
					var ddv = $(this).datagrid('getRowDetail', index).find(
							'div.ddv');
					ddv.panel( {
						border : false,
						cache : true,
						href : 'show_vedio.jsp?content='+row.content+'&publishDate='+row.publishDate+'&expiryDate='+row.expiryDate+'&IsExamined='+row.IsExamined,
						onLoad : function() {
							$('#vediodg2').datagrid('fixDetailRowHeight', index);
							$('#vediodg2').datagrid('selectRow', index);
							$('#vediodg2').datagrid('getRowDetail', index).find(
									'form').form('load', row);
						}
					});
					$('#vediodg2').datagrid('fixDetailRowHeight', index);
				}
			});
};
	
//在弹出的对话框中添加两个按钮，按钮的提交信息由handle后面的事件实现，对应：id为dlg的对话框
function initAdverInfo(){
   $('#adId').validatebox({
        required: true,
        validType: {length:[0,20]}
    });
}
function editAdver() {
	$("#adId").attr("readonly","readonly");  //主键不可修改！！
	var row = $('#vediodg2').datagrid('getSelected');
	if (row) {
		$('#vediodlg2').dialog('open').dialog('setTitle', '修改广告');
		$("#adId").textbox('setValue',row.adId);
		$("#adId").textbox({readonly:true});
		$("#adName").textbox('setValue',row.adName);
		$("#adType").val(row.adType);
		$("#content").filebox('setText',row.content);
		$("#publishDate").datebox('setValue',row.publishDate);
		$("#expiryDate").datebox('setValue',row.expiryDate);
		adId = row.adId;
	}else{
		$.messager.show({
			title : '出错啦！',
			msg : "请选择一条数据!",
			showType:'show'
		});
	}
}
//保存修改后的信息
function saveAdInfo() {
	$.ajaxFileUpload({
		type :'post',
		url : '../addAdService.do', // 用于文件上传的服务器端请求地址
		secureuri : false, // 一般设置为false
		fileElementId : 'filebox_file_id_1', // 文件上传空间的id属性 
		contentType:"text/html; charset=utf-8",
		data:{
			adId:adId,
			actionType:"edit",
			directory: "vedio",
			adName:$("#adName").val(),
			adType:$("#adType").val(),
			publishDate:$("#publishDate").datebox('getValue'),
			expiryDate:$("#expiryDate").datebox('getValue')
		},
		dataType : 'json', // 返回值类型 一般设置为json
		success : function(data, status) // 服务器成功响应处理函数
		{
			if(data.result == "true"){
				alert("保存成功！");
				$('#vediodlg2').dialog('close');
				queryAdverList();
			};
		},
		error : function(data, status, e)// 服务器响应失败处理函数
		{
			alert(e);
		}
	});
}

function advercancel(){
	$('#vediodlg2').dialog({closed:true});
}

//删除广告
function destroyAdver(){
	var row=$('#vediodg2').datagrid('getSelected');
	if(row){
		$.messager.confirm('Confirm','是否确定删除该条记录？',function (r){
			if(r){
				$.post("../AdService.do?",{
					adId:row.adId,
					tableName:"adinfo",
				    actionType:"deleteAd"
					
				},function(result){
					if(result){
						$('#vediodg2').datagrid(queryAdverList());
					}else{
						$.messager.show({
							title:'出错啦!',
							msg:"删除失败"
						});
					}
				},'json');
			}
		});
	}else{
		$.messager.show({
			title:'出错啦！',
			msg:"请选择一条数据！",
			showType:'show'
		});
	}
}

function queryAdverList() {
	$('#vediodg2').datagrid( {
		url : "../AdService.do",
		rownumbers : true,
		singleSelect : true,
		autoRowHeight : false,
		fitColumns : true,
		pagination : true,
		queryParams : {
			actionType : "publish",
			adType : "视频类",
			adName : $("#queryAdName").val()//取对应的input框的值进行查询,vedio_List.html中
		},
		columns : [ [ {
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