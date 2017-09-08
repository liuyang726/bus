var url;
var routeId;
$(function() {
	routeId = getCookie("routeId");
	getStationBypinyin();
	queryCurrentRoute();
	$("#editRouteName").textbox({
		value : getCookie("routeName")
	});
	$("#editStartTime").textbox({
		value : getCookie("startTime")
	});
	$("#editEndTime").textbox({
		value : getCookie("endTime")
	});
	$("#editSwipeCard").val(getCookie("swipeCard"));
	setCookie("routeId", "", -1);
	setCookie("routeName", "", -1);
	setCookie("startTime", "", -1);
	setCookie("endTime", "", -1);
	setCookie("swipeCard", "", -1);
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
var stationArray = new Array();
function queryCurrentRoute() {
	$.ajax({
		type : 'POST',
		url : "../RouteService.do",
		data : {
			actionType : "queryRouteInfo",
			routeId : routeId
		},
		dataType : "json",
		success : function(result) {
			if (result) {
				for ( var i in result) {
					stationArray.push({
						"stationId" : result[i].stationId,
						"stationName" : result[i].stationName
					});
				}
			}
			addStationToRoute();
			queryAllStation();
		}
	});
}
function queryAllStation() {
	$('#editRouteStationdg').datagrid({
		url : "../CommonService.do",
		queryParams : {
			actionType : "query",
			tableName : "view_stationinfo",
			stationName : $("#queryStationName").val()
		},
		checkOnSelect : true,
		selectOnCheck : true,
		pagination : true,
		rownumbers : true,
		autoRowHeight : false,
		idField : "stationId",// 说明此字段是一个标识字段
		onCheckAll : onCheckAll,
		onUncheckAll : onUncheckAll,
		onCheck : onCheck,
		onUncheck : onUncheck,
		columns : [ [ {
			field : 'ck',
			checkbox : true
		}, {
			field : 'pinyin',
			title : '字母顺序',
			width : 100
		}, {
			field : 'stationName',
			title : '站牌名称',
			width : 100
		}, {
			field : 'stationId',
			title : '站牌编号',
			width : 100,
			hidden : true,
			formatter:function(value,row,index){
				for(var i in stationArray){
					if(value == stationArray[i].stationId){
						$('#editRouteStationdg').datagrid('selectRow', index);
					}
				}
			}
		} ] ]
	});
}

function onCheckAll(rows) {
	for ( var i in rows) {
		if (isexcist(rows[i].stationId)) {// 判断存在
			stationArray.push({
				"stationId" : rows[i].stationId,
				"stationName" : rows[i].stationName
			});
		}
	}
	$("#editStationRow").empty();
	addStationToRoute();
}
function onUncheckAll(rows) {
	for ( var i in rows) {
		$("#" + rows[i].stationId).remove();
		removeData(rows[i].stationId);
	}
	$("#editStationRow").empty();
	addStationToRoute();
}
function onCheck(rowIndex, rowData) {
	if (isexcist(rowData.stationId)) {
		stationArray.push({
			"stationId" : rowData.stationId,
			"stationName" : rowData.stationName
		});
	}
	$("#editStationRow").empty();
	addStationToRoute(rowData);
}
function onUncheck(rowIndex, rowData) {
	$("#" + rowData.stationId).remove();
	removeData(rowData.stationId);
	$("#editStationRow").empty();
	addStationToRoute();
}
function isexcist(stationId) {
	for ( var i in stationArray) {
		if (stationArray[i].stationId == stationId) {
			return false;
		}
	}
	return true;
}
function removeData(stationId) {
	for ( var i in stationArray) {
		if (stationArray[i].stationId == stationId) {
			stationArray.splice(i, 1);
		}
	}
}

var stationInfo;
function addStationToRoute(){
	stationInfo = "";
	for(var i in stationArray){
		if(i == 0 ){
			$("#editStationRow").append("<span id = \""+stationArray[i].stationId+"\">"+stationArray[i].stationName+"</span> ");
		}else{
			$("#editStationRow").append("--><span id = \""+stationArray[i].stationId+"\">"+stationArray[i].stationName+"</span> ");
		}
		stationInfo += stationArray[i].stationId+","+(++i)+";";
	}
}

function saveRouteInfo() {
	stationArray = new Array(); 
	jQuery.ajax({
		type : "POST",
		url : "../RouteService.do",
		dataType:"json",
		data : {
			actionType : "editRoutes",
			tableName:"routeinfo",
			routeName : $("#editRouteName").val(),
			noRepeat:"routeName",
			routeId:routeId,
			startTime:$("#editStartTime").val(),
			endTime:$("#editEndTime").val(),
			swipeCard:$("#editSwipeCard").val(),
			stationInfo : stationInfo
		},
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success : function(result) {
			if (result.result == "true") {
				location.href="route_List.html";
			}else{
				$.messager.alert('错误提示', result.result);
			}
		}
	});
}
function routecancel() {
	stationArray = new Array();
	location.href="route_List.html";
}
function routeReset(){
	stationArray = new Array();
	$('#editRouteStationdg').datagrid('clearChecked');
	queryCurrentRoute();
}