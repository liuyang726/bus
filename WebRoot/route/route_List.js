var url;
$(function() {
	queryRouteInfo();
	getDetailview();
});
function queryRouteInfo(){
	queryRouteList();
} 
function queryAllRoute(){
	$("#queryRouteName").val("");
	queryRouteInfo();
}
function editRoute() {
	var row = $('#routedg').datagrid('getSelected');
	if (row) {
		setCookie("routeId",row.routeId,1);
		setCookie("routeName",row.routeName,1);
		setCookie("startTime",row.startTime,1);
		setCookie("endTime",row.endTime,1);
		setCookie("swipeCard",row.swipeCard,1);
		location.href="route_Edit.html";
	}else{
		$.messager.alert('错误提示','请选择一条数据');
	}
}

function saveRouteInfo() {
	$('#routefm').form('submit', {
		url : url,
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			if (result) {
				$('#routedlg').dialog('close');// close the dialog
				$('#routedg').datagrid(queryRouteList()); // reload the user data
			} else {
				$.messager.alert('错误提示',result);
			}
		}
	});
}

function routecancel(){
	$('#routedlg').dialog({closed:true});
}

function destroyRoute() {
	var row = $('#routedg').datagrid('getSelected');
	if (row) {
		$.messager.confirm('Confirm',
				'确定删除此条记录吗?', function(r) {
					if (r) {
						$.post("../RouteService.do?",{
							routeId : row.routeId,
							actionType:"delRoutes"
						},function(result) {
							if (result.result == "true") {
								$('#routedg').datagrid(queryRouteList()); // reload
							} else {
								$.messager.alert('错误提示',result.result);
							}
						}, 'json');
					}
				});
	}else{
		$.messager.alert('错误提示','请选择一条数据');
	}
}
function queryRouteList() {
	 $('#routedg').datagrid({
		url:"../CommonService.do",
		queryParams:{
			actionType:"query",
			tableName : "view_routeinfo",
			routeName:$("#queryRouteName").val()
		},
		singleSelect : true,
		pagination: true, 
        rownumbers: true,
		autoRowHeight : false,
		columns : [ [ {
			field : 'routeId',
			title : '路线编号',
			width : 100,
			hidden : true
		}, {
			field : 'routeName',
			title : '路线名称',
			width :100
			
		}, {
			field : 'routeInfo',
			title : '线路区间',
			width :300,
			formatter:function(value){
				if(value){
					var val = value.split(",");
					return val[0]+"-->"+val[(val.length-1)];
				}
			}
		}, {
			field : 'startTime',
			title : '首班时间',
			width :100
			
		}, {
			field : 'endTime',
			title : '末班时间',
			width :100
			
		}, {
			field : 'swipeCard',
			title : '是否可刷卡',
			width :100,
			formatter:function(value){
				var swipe="";
				if(value=="1"){
					swipe="可刷卡";
				}else if(value== "0"){
					swipe="不可刷卡";
				}
				return swipe;
			}
			
		}
		] ]
	});
}

function getDetailview() {
	$('#routedg').datagrid(
		{
			view : detailview,
			detailFormatter : function(index, row) {
				return '<div class="ddv"></div>';
			},
			onExpandRow : function(index, row) {
				var ddv = $(this).datagrid('getRowDetail', index).find(
						'div.ddv');
				routeInfo=row.routeInfo!=''? encodeURI(encodeURI(row.routeInfo)) : '';
				ddv.panel( {
					border : false,
					cache : true,
					href : 'route_Show.jsp?routeInfo='+routeInfo,
					onLoad : function() {
						$('#routedg').datagrid('fixDetailRowHeight', index);
						$('#routedg').datagrid('selectRow', index);
						$('#routedg').datagrid('getRowDetail', index).find(
								'form').form('load', row);
					}
				});
				$('#routedg').datagrid('fixDetailRowHeight', index);
			}
		});
};
