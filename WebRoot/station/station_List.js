var url;
$(function() {
	getStationBypinyin();
	queryStationList();
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
	queryStationList();
}
function newStation() {
	$('#stationdlg').dialog('open');
	$('#stationfm').form('clear');
	url = "../RouteService.do?actionType=addStation&noRepeat=stationName&tableName=stationInfo";
}

function editStation() {
	var row = $('#stationdg').datagrid('getSelected');
	if (row) {
		$('#stationdlg').dialog('open').dialog('setTitle', '修改站牌');
		$('#stationfm').form('load', row);
		url = "../RouteService.do?actionType=editStation&noRepeat=stationName&tableName=stationInfo&stationId="
				+ row.stationId;
	} else {
		$.messager.alert('错误提示', '请选择一条数据');
	}
}

function saveStationInfo() {
	$('#stationfm').form('submit', {
		url : url,
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			var rs = eval("("+result+")");
			if (rs.result == "true") {
				$('#stationdlg').dialog('close');// close the dialog
				$('#stationdg').datagrid(queryStationList()); // reload the
			} else {
				$.messager.alert('错误提示', rs.result);
			}
		}
	});
}

function stationcancel() {
	$('#stationdlg').dialog({
		closed : true
	});
}

function destroyStation() {
	var row = $('#stationdg').datagrid('getSelected');
	if (row) {
		$.messager.confirm('Confirm', '确定删除此条记录吗?', function(r) {
			if (r) {
				$.post("../RouteService.do?", {
					stationId : row.stationId,
					tableName : "stationInfo",
					actionType : "delStation"
				}, function(result) {
					if (result.result == "true") {
						$('#stationdg').datagrid(queryStationList()); // reload
					} else {
						$.messager.alert('错误提示', result.result);
					}
				}, 'json');
			}
		});
	} else {
		$.messager.alert('错误提示', '请选择一条数据!');
	}
}
function queryStationList() {
	$('#stationdg').datagrid({
		url : "../CommonService.do",
		queryParams : {
			actionType : "query",
			tableName : "view_stationinfo",
			stationName : $("#queryStationName").val()
		},
		singleSelect : true,
		pagination : true,
		rownumbers : true,
		autoRowHeight : false,
		columns : [ [ {
			field : 'pinyin',
			title : '字母顺序',
			width : 100
		}, {
			field : 'stationName',
			title : '站牌名称',
		}, {
			field : 'routeName',
			title : '公交线路',
		}, {
			field : 'adName',
			title : '广告名称',
		} ] ]

	});
}