$(function() {	
	queryAdverInfo();
});
function queryAdverInfo(){	
	queryAdverList();
} 

	
function queryAdverList() {
	$('#showAddg').datagrid( {
		url : "../AdService.do",
		rownumbers : true,
		singleSelect : true,
		autoRowHeight : false,
		fitColumns : true,
		pagination : true,
		queryParams : {
			actionType : "queryStation",
			adName : $("#queryAdName").val()//取对应的input框的值进行查询,vedio_List.html中
		},
		columns : [ [{
			field : 'adName',
			title : '广告名称',
			width : 80
		},  {
			field : 'adType',
			title : '广告类型',
			width : 80
		},  {
			field : 'stationName',
			title : '站牌名称',
			width : 200
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
