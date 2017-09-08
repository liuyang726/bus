$(function() {
	logout();
	queryRouteList();
	getDetailview();
	queryAdList();
	queryNoticeList();
});
function queryAllRoute(){
	$("#queryRouteName").val("");
	$("#queryRouteName").textbox('setValue',"");
	queryRouteList();
}
function queryRouteList() {
	$('#routeList').datagrid({
		url:"CommonService.do",
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
	$('#routeList').datagrid(
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
					href : 'route/route_Show.jsp?routeInfo='+routeInfo,
					onLoad : function() {
						$('#routeList').datagrid('fixDetailRowHeight', index);
						$('#routeList').datagrid('selectRow', index);
						$('#routeList').datagrid('getRowDetail', index).find(
								'form').form('load', row);
					}
				});
				$('#routeList').datagrid('fixDetailRowHeight', index);
			}
		});
};
function logout() {
	$.ajax({
		type : 'post',
		url : 'login.do',
		data : {
			actionType : 'logout'
		},
		dataType : 'json',
		success : function(result) {
			if (result.result == "success") {
				setCookie("userInfo", "", -1);
			} else {
				messager.alert("提示信息", "服务器处理异常！");
			}
		}
	});
}
function queryAdList() {	
	$("#imgtxtinfo").empty();
	$.ajax({
				type : 'post',
				url : 'CommonService.do',
				data : {
					actionType : "queryAll",
					tableName : "adinfo"
				},
				dataType : 'json',
				success : function(result) {
					if(result){
						for(var i in result){
							if(result[i].adType=="图文类"){//style=\"width:1080px; height:230px;\"
								$("#imgtxtinfo").append("<li style=\"width:1080px; height:230px;\"><img src=\""+result[i].content+"\" width=\"1080\" height=\"230\"/></li>");
							}
						}
						var oDiv1 = document.getElementById('playingBox');
						initSlide(oDiv1,5000);
						  
					}
				}
			});
	
}

function queryNoticeList() {
		$('#noticeList').datagrid({
			url:"NoticeService.do",
			queryParams:{
				actionType:"queryNotice",
				tableName : "notice",
				type:"post"
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
			width : 300
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