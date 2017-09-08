
$(function(){
	getAdInfo();
	getStationInfo();
});

function getAdInfo() {
	$("#adId").append("<option>"+"请选择广告名称"+"</option>");
	$.ajax({
		url : "../CommonService.do",
		type : 'post',
		data : {
			actionType : "queryAll",
			tableName : "view_adinfo"
		},
		dataType : "json",
		success : function(result) {
			if (result) {
				var data = result;
				for ( var i in data) {
					$("#adId").append(
							"<option value='" + data[i].adId + "'>"
									+ data[i].adName + "</option>");
				}
			}
		}
	});
}
function getStationInfo() {
	$("#stationId").append("<option>"+"请选择站牌名称"+"</option>");
	$.ajax({
		url : "../CommonService.do",
		type : 'post',
		data : {
			actionType : "queryAll",
			tableName : "stationinfo"
		},
		dataType : "json",
		success : function(result) {
			if (result) {
				var data = result;
				for ( var i in data) {
					$("#stationId").append(
							"<option value='" + data[i].stationId + "'>"
							+ data[i].stationName + "</option>");
				}
			}
		}
	});
}
function saveStaTiobInfo(){
	$('#applyfm').form('submit', {
		url : "../CommonService.do?actionType=add&tableName=station_ad&apply=0",
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			if (result) {
				$.messager.alert({
					title : '提示信息',
					msg : "申请成功!",
					showType:'show'
					
				});
			} else {
				$.messager.alert({
					title : '提示信息',
					msg : "服务器处理异常！"
				});
			}
		}
	});
}
