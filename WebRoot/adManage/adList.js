var d=new Date().getDate();//获取当前天数
var day=(d<10?("0"+d):d);
var m=new Date().getMonth()+1;//获取当前月
var month=(m<10?("0"+m):m);
var year=new Date().getFullYear();//获取当前年
var date=year+"-"+month+"-"+day; //获取当前时间，定制日期

$(function() {
	$('#queryAdType').val('');//使查询框初始值为空
	queryAdverList();
	getDetailview();
});
function queryAdverList() {
	$('#alladdg').datagrid({
		url:"../CommonService.do",
		queryParams:{
		actionType : "query",
		tableName : "adinfo",
		adType : $("#queryAdType").val()
	//取对应的input框的值进行查询,vedio_List.html中
		},
		rownumbers : true,
		singleSelect : true,
		autoRowHeight : false,
		pagination : true,
		resizable:false,
		pageNumber: 1,
		pageSize:10,
		columns : [ [{
			field : 'adId', //此处的feild名称必须与数据库表中保持一致
			title : '广告编号',
			width : 80
		}, {
			field : 'adName',
			title : '广告名称',
			width : 300
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
			field : 'owner',
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
				if(value == "1"){
					return "已审核";
				}else if(value == "0"){
					return "待审核";
				}else {
					return value;
				}
			}
		} ] ]
	});
    }
//广告详情展示
function getDetailview() {
	$('#alladdg').datagrid(
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
					href : 'showAdContent.jsp?content='+encodeURI(encodeURI(row.content))+'&publishDate='+row.publishDate+'&expiryDate='+row.expiryDate+'&IsExamined='+row.IsExamined
					+'&adType='+encodeURI(encodeURI(row.adType)),
					onLoad : function() {
						$('#alladdg').datagrid('fixDetailRowHeight', index);
						$('#alladdg').datagrid('selectRow', index);
						$('#alladdg').datagrid('getRowDetail', index).find(
								'form').form('load', row);
					}
				});
				$('#alladdg').datagrid('fixDetailRowHeight', index);
			}
		});
};

//审批广告！
function checkAdver() {
	$('#queryAdType').val('');//清除查询框中数据
	var row = $('#alladdg').datagrid('getSelected');
	if (row) {
		if(row.isExamined=="1") $.messager.alert("出错啦！","该广告已审核!");
		else if(row.expiryDate<date) $.messager.alert("出错啦！","该广告已过期!");
		else 
			{
			$.messager.confirm('提示！',
				'确定审核通过此条广告吗?', function(r) {
					if (r) {
						$.post("../CommonService.do?", {
							actionType:"edit",
							tableName : "adinfo",
							userId : row.adId,
							isExamined:"1"
						}, function(result) {
							if (result) {
								$.messager.alert("成功啦！","广告审核成功!");
							    $('#alladdg').datagrid(queryAdverList()); // 重新加载数据
							} else {
								$.messager.alert("出错啦！","广告审核失败!");
							}
						}, 'json');
					}
				});
	}
}else{
		$.messager.alert("出错啦！","请选择一条数据!");
	}
}

