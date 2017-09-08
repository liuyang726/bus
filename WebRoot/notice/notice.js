var d=new Date().getDate();//获取当前天数
var day=(d<10?("0"+d):d);
var m=new Date().getMonth()+1;//获取当前月
var month=(m<10?("0"+m):m);
var year=new Date().getFullYear();//获取当前年
var publishDate=year+"-"+month+"-"+day; //获取当前时间，定制日期
var date=publishDate;

$(function() {
	queryNoticeList();// 显示公告列表	
});


$.extend($.fn.validatebox.defaults.rules, {
	date: {
		validator: function(value, param){
			return value>=param[0];
		},
		message: '截止日期不能早于初始日期.'
	}
});
// 查出所有公告信息
function queryNoticeList() {
 	    	$('#noticedg').datagrid({
				url:"../NoticeService.do",
				queryParams:{
 	    		actionType:"queryNotice",
 	    		beginDate:$('#beginDate').datebox('getValue'),
 	    		endDate:$('#endDate').datebox('getValue')
				},
				rownumbers : true,
				singleSelect : true,
				autoRowHeight : false,
				pagination : true,
				resizable:false,
				pageNumber: 1,
				pageSize:10,
				columns : [ [ {
					field : 'title',
					title : '公告标题',
					width : 400
				}, {
					field : 'content',
					title : '公告内容',
					width : 400
				}, {
					field : 'publishDate',
					title : '发布日期',
					width : 100
				}
				] ]
			});
}

//清除表单中的数据
function clearForm(){
	//清除所有行的数据
	$("#title").textbox('clear');
	$("#content").textbox('clear');
	$("#oldPublishDate").textbox('clear');
}
//发布公告
function addNotice() {
	$('#oldDate').attr("style","display:none");//使原发布日期行隐藏不显示
	$('#noticedlg').dialog('open').dialog('setTitle', '发布公告');
//	clearForm();//新建人员时先清除表单中其他信息
	url = "../CommonService.do?actionType=add&tableName=notice";
}
//编辑公告
function editNotice() {
	var row = $('#noticedg').datagrid('getSelected');
	$('#oldDate').removeAttr("style");//显示原始发布日期行
	if (row) {
		$('#noticedlg').dialog('open').dialog('setTitle', '编辑公告');
        $('#noticefm').form('load', row);//向form表单中加载数据
        $("#oldPublishDate").textbox({value:row.publishDate});//因为发布和编辑时该字段冲突了，向form表单中加载数据
        //时原始发布日期不会加载成功，所以应该使其再加载一次
		url = "../CommonService.do?actionType=edit&tableName=notice&title="+row.title;
	}else{
		$.messager.alert("出错啦！","请选择一条数据!");
	}
}
//删除公告
function destroyNotice() {
	var row = $('#noticedg').datagrid('getSelected');
	if (row) {
		if(row.expiryDate<date) $.messager.alert("出错啦！","该公告还未失效!");
		else
		{
		$.messager.confirm('提示！',
				'确定删除此公告吗?', function(r) {
					if (r) {
						$.post("../CommonService.do?", {
							title : row.title,
							tableName : "notice",
							actionType:"del"
						}, function(result) {
							if (result) {
								$.messager.alert("成功啦！","公告删除成功!");
								$('#noticedg').datagrid(queryNoticeList()); // 重新加载数据
							} else {
								$.messager.alert("出错啦！","公告删除失败!");
							}
						}, 'json');
					}
				});
	}
	}else{
		$.messager.alert("出错啦！","请选择一条数据!");
	}
}
//保存
function saveNotice() {
	$('#beginDate').datebox('clear');//清除起始日期查询框中的值
	$('#endDate').datebox('clear');//清除终止日期查询框中的值
	$('#noticefm').form('submit', {
		url : url+="&publishDate="+publishDate,
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			if (result) {
				$.messager.alert("成功啦！","操作成功!");
				clearForm();
				$('#noticedlg').dialog('close');// 关闭对话框
				$('#noticedg').datagrid(queryNoticeList()); //重新加载数据
			} else {
				$.messager.alert("出错啦！","操作失败!");
			} 
		}
	});
}
//取消
function cancelNotice(){
	$('#noticedlg').dialog({closed:true});
}
