var adId = "";
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
	$('#imagedg2').datagrid(
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
						href : 'show.jsp?content='+row.content,
						onLoad : function() {
							$('#imagedg2').datagrid('fixDetailRowHeight', index);
							$('#imagedg2').datagrid('selectRow', index);
							$('#imagedg2').datagrid('getRowDetail', index).find(
									'form').form('load', row);
						}
					});
					$('#imagedg2').datagrid('fixDetailRowHeight', index);
				}
			});
};
	
//校验数据
function initAdverInfo(){
   $('#adId').validatebox({
        required: true,
        validType: {length:[0,20]}
    });
}
//修改广告！
function editAdver() {
	$("#adId").attr("readonly","readonly");  //主键不可修改！！
	var row = $('#imagedg2').datagrid('getSelected');
	if (row) {
		$('#imagedlg2').dialog('open').dialog('setTitle', '修改广告');
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

function advercancel(){
	$('#imagedlg2').dialog({closed:true});
}

function destroyAdver() {
	var row = $('#imagedg2').datagrid('getSelected');
	if (row) {
		$.messager.confirm('Confirm',
				'确定删除此条记录吗?', function(r) {
					if (r) {
						$.post("../AdService.do?", {
							adId : row.adId,
							tableName : "adInfo",
							actionType:"deleteAd"
						}, function(result) {
							if (result) {
								$('#imagedg2').datagrid(queryAdverList()); // reload
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
	$('#imagedg2').datagrid( {
		url : "../AdService.do",
		rownumbers : true,
		singleSelect : true,
		autoRowHeight : false,
		fitColumns : true,
		pagination : true,
		queryParams : {
			actionType : "publish",
			adType : "图文类",
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
//保存修改后的内容
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
			directory: "image",
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
				$('#imagedlg2').dialog('close');
				queryAdverList();
			};
		},
		error : function(data, status, e)// 服务器响应失败处理函数
		{
			alert(e);
		}
	});
}