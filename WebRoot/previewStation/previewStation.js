var url;
$(function() {
	init();
});
function getStationByPinyin(){
	init();
}
function init() {
	$("#queryStationName").html("<option>" + "--- 请选择---" + "</option>");
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
							"<option value='" + data[i].stationId + "'>"
									+ data[i].stationName + "</option>");
				}
			}
		}
	});
}

function queryStationInfo() {
	queryStationList();
	queryAdList();
}

function queryStationList() {
	$("#rouinfodlg").empty();
	$.ajax({
				type : 'post',
				url : '../CommonService.do',
				data : {
					actionType : "queryAll",
					tableName : "view_preview",
					stationId : $("#queryStationName").val()
				},
				dataType : 'json',
				success : function(result) {
					var stationDetail = "";
					if (result) {
						$("#rouinfodlg").panel({
							title : "站牌名称：" + result[0].stationName
						});
						for ( var i in result) {
							stationDetail = "<div >";//style=\"border:1px solid #000\"
							var data = result[i].routeInfo.split(",");
							stationDetail += "<div style=\"height: 25px; border-bottom: 1px solid rgb(0, 0, 0); padding-top: 10px;\">"
									+ "<div style=\"font-size:15px;float:left;font-weight:bold;\">"
									+ result[i].routeName
									+ "</div>"
									+ "<div style=\"font-size:15px;float:right;\">首班："
									+ result[i].startTime
									+ "末班："
									+ result[i].endTime + "</div>";
							if (result[i].swipeCard == "0") {
								stationDetail += "<div style=\"text-align:center;color:red;\">不可刷卡路线</div>";
							} else if (result[i].swipeCard == "1") {
								stationDetail += "<div style=\"text-align:center;color:green;\">可刷卡路线</div>";
							}
							stationDetail += "</div>";
							var a = data.length%20 > 0?1:0;
							var count = (data.length/20) + a; 
							var content = "";
							for(var j = 0;j < count;j++){
								content += showStationRoute(result[0].stationName,data,j);
							}
							stationDetail += content;
							stationDetail += "<hr> </div>";
							$("#rouinfodlg").append(stationDetail);
						}
					} else
						messager.alert("提示信息", "服务器处理异常！");
				}
			});
}

function showStationRoute(stationName,data,num){
	var stationRoute = "";
	stationRoute +="<table><tr>";
	for ( var j in data) {
		if(j >= (Number(num)*20) && j<((Number(num)+1)*20)){
			var index  =  Number(j)+1;
			stationRoute += "<td>" + index + "</td>";
		}
	}
	stationRoute += "</tr><tr>";
	var k = 0;
	for ( var j in data) {
		if(j >= (Number(num)*20) && j<((Number(num)+1)*20)){
			if (data[j] == stationName) {
				stationRoute += "<td style=\"color:red;width: -moz-min-content;\">"
						+ data[j] + "</td>";
				k = Number(j)+1;
			} else {
				if (j == k && j != 0 && k < data.length) {
					stationRoute += "<td style=\"color:green;width: -moz-min-content;\">"
							+ data[j] + "</td>";
				} else {
					stationRoute += "<td style=\"width: -moz-min-content;\">" + data[j]
							+ "</td>";
				}
			}
		}
	}
	stationRoute += "</tr></table>";
	return stationRoute;
}
function queryAdList() {
	$("#imgtxt").empty();
	$.ajax({
		type : 'post',
		url : '../CommonService.do',
		data : {
			actionType : "queryAll",
			tableName : "view_station_ad",
			apply:"1",
			stationId : $("#queryStationName").val()
		},
		dataType : 'json',
		success : function(result) {
			if(result){
				var videos = new Array();
				for(var i in result){
					if(result[i].adType=="视频类"){
						videos.push({"videoPath":result[i].content});
					}else if(result[i].adType=="文本类"){
						$("#imgtxt").append("" +
								"<li style=\"width:378px; height:191px;text-align:center;\"><span>"+result[i].content+"</span></li>");
					}else if(result[i].adType=="图文类"){
						$("#imgtxt").append("<li style=\"width:378px; height:191px;\"><img src=\"../"+result[i].content+"\" width=\"378\" height=\"191\"/></li>");
					}
				}
				var oDiv1 = document.getElementById('playBox1');
				initSlide(oDiv1,5000);
				var j = 1;
				var play = document.getElementById("currentplay");
				if(play.currentSrc == "" ){
					play.src ="../"+ videos[0].videoPath;
					play.play();
				}
				play.addEventListener("ended",function(){  
					j = playVideo(play,videos,j);
				});  
			}
		}
	});
}
function playVideo(play,videos,j){
	if(j >= videos.length ) j = 0;
	play.src = "../"+videos[j].videoPath;
	play.play();
	j++;
	return j;
}
