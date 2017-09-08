var d=new Date().getDate();//获取当前天数
var day=(d<10?("0"+d):d);
var m=new Date().getMonth()+1;//获取当前月
var month=(m<10?("0"+m):m);
var year=new Date().getFullYear();//获取当前年
var date=year+"-"+month+"-"+day; //获取当前时间，定制日期
$(function() {
	$('#queryAdType').val('');//使查询框初始值为空
	queryAdverList();
});

// 查出所有待发布广告
function queryAdverList() {
 	    	$('#alloctdg').datagrid({
				url:"../AdService.do",
				queryParams:{
 	    		actionType:"queryStation_Ad",
 	    		adType : $("#queryAdType").val()
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
					width : 150
				}, {
					field : 'adType',
					title : '广告类型',
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
				},{
					field : 'stationId',
					title:'预分配广告位编号',
					width : 80	
				},{
					field : 'stationName',
					title:'预分配广告位名',
					width : 80	
				} ,{
					field : 'areaName',
					title:'预分配广告位所属区域',
					width : 120	
				}  ,{
					field : 'apply',
					title:'广告位分配状态',
					width : 80,
					formatter:function(value){
						if(value == "1"){
							return "已分配";
						}else if(value == "0"){
							return "待分配";
						}else {
							return value;
						}
					}
				},{
					field : 'publishDate',
					title:'(预）发布日期',
					width : 100
				} ,{
					field : 'expiryDate',
					title:'过期日期',
					width : 100
				}  
			] ]
			});
 	    	
}
//分配广告位
function alloctAdLocation() {
	$('#queryAdType').val('');//清除查询框中数据
	var row = $('#alloctdg').datagrid('getSelected');
	if (row) {
		if(row.apply=="1") $.messager.alert("出错啦！","该广告已分配于此广告位!");
		else if(row.expiryDate<date) $.messager.alert("出错啦！","该广告已过期!");
		else
		{
		$.messager.confirm('提示！',
				'确定给此条广告分配广告位吗?', function(r) {
					if (r) {
						$.post("../AdService.do?", {
							adId : row.adId,
							stationId : row.stationId,
							apply: "1",
							actionType:"updateStation_Ad"
						}, function(result) {
							if (result) {
								$.messager.alert("成功啦！","广告位分配成功!");
								$('#alloctdg').datagrid(queryAdverList()); // 重新加载数据
							} else {
								$.messager.alert("出错啦！","广告位分配失败!");
							}
						}, 'json');
					}
				});
	}
	}else{
		$.messager.alert("出错啦！","请选择一条数据!");
	}
}

