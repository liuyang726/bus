var url;
$(function() {
	getStationBypinyin();
	queryDivideStation();
});
function getStationBypinyin(){
		$("#queryStationName").html("<option value = \"\">" + "--- 请选择---" + "</option>");
		$.ajax({
			url : "../CommonService.do",
			type : 'post',
			data : {
				actionType : "queryAll",
				tableName : "view_stationinfo",
				pinyin:$("#queryStationPinyin").val()
			},
			dataType : "json",
			success : function(result) {
				if (result) {
					var data = result;
					for ( var i in data) {
						$("#queryStationName").append(
								"<option value='" + data[i].stationName + "'>"
										+ data[i].stationName + "</option>");
					}
				}
			}
	});
}
function queryAllStation(){
	$("#queryStationName").val("");
	queryDivideStation();
}
function queryDivideStation() {
	 $('#routeStationdg').datagrid({
		url:"../CommonService.do",
		queryParams:{
			actionType:"query",
			tableName : "view_stationinfo",
			stationName : $("#queryStationName").val()
		},
		checkOnSelect:true,
		selectOnCheck:true,
		pagination: true, 
        rownumbers: true,
		autoRowHeight : false,
		idField:"stationId",//说明此字段是一个标识字段
		onCheckAll:onCheckAll,
		onUncheckAll:onUncheckAll,
		onCheck:onCheck,
		onUncheck:onUncheck,
		columns : [ [{	
			field:'ck',
			checkbox:true
		},{
			field : 'pinyin',
			title : '字母顺序',
			width : 100
		}, {
			field : 'stationName',
			title : '站牌名称',
			width : 100
		},
		{
			field : 'stationId',
			title : '站牌编号',
			width : 100,
			hidden:true
		}] ]
	});
}
var stationArray = new Array();
function onCheckAll(rows){
	for(var i in rows){
		if(isexcist(rows[i].stationId)){//判断存在
			stationArray.push({"stationId":rows[i].stationId,"stationName":rows[i].stationName});
		}
	}
	$("#addStationRow").empty();
	addStationToRoute();
}
function onUncheckAll(rows){
	for(var i in rows){
		$("#"+rows[i].stationId).remove();
		removeData(rows[i].stationId);
	}
	$("#addStationRow").empty();
	addStationToRoute();
}
function onCheck(rowIndex,rowData){
	if(isexcist(rowData.stationId)){
		stationArray.push({"stationId":rowData.stationId,"stationName":rowData.stationName});
	}
	$("#addStationRow").empty();
	addStationToRoute(rowData);
}
function onUncheck(rowIndex,rowData){
	$("#"+rowData.stationId).remove();
	removeData(rowData.stationId);
	$("#addStationRow").empty();
	addStationToRoute();
}
function isexcist(stationId){
	for(var i in stationArray){
		if(stationArray[i].stationId == stationId){
			return false;
		}
	}
	return true;
}
function removeData(stationId){
	for(var i in stationArray){
		if(stationArray[i].stationId == stationId){
			stationArray.splice(i, 1);
		}
	}
}

var stationInfo;
function addStationToRoute(){
	stationInfo = "";
	for(var i in stationArray){
		if(i == 0 ){
			$("#addStationRow").append("<span id = \""+stationArray[i].stationId+"\">"+stationArray[i].stationName+"</span> ");
		}else{
			$("#addStationRow").append("--><span id = \""+stationArray[i].stationId+"\">"+stationArray[i].stationName+"</span> ");
		}
		stationInfo += stationArray[i].stationId+","+(++i)+";";
	}
}

function saveRouteInfo(){
	stationArray = new Array();
	jQuery.ajax({
		type: "POST",
		url: "../RouteService.do",
		dataType:"json",
		data: {
			actionType:"addRoutes",
			tableName : "routeinfo",
			routeName : $("#addRouteName").val(),
			noRepeat:"routeName",
			startTime:$("#addStartTime").val(),
			endTime:$("#addEndTime").val(),
			swipeCard:$("#addSwipeCard").val(),
			stationInfo:stationInfo
		},
		success: function (result) {
			if(result.result == "true"){
				location.href="route_List.html";
			}else
				$.messager.alert('错误提示', result.result);
		}
	});
}
function routecancel(){
	stationArray = new Array();	
}
