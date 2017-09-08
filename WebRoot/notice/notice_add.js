var d=new Date().getDate();//获取当前天数
var day=(d<10?("0"+d):d);
var m=new Date().getMonth()+1;//获取当前月
var month=(m<10?("0"+m):m);
var year=new Date().getFullYear();//获取当前年
var publishDate=year+"-"+month+"-"+day; //获取当前时间，定制日期
function saveNotice() {
	url = "../CommonService.do?actionType=add&tableName=notice";
	$('#noticeAddfm').form('submit', {
		url : url+="&publishDate="+publishDate,
		onSubmit : function() {
			return $(this).form('validate');
		},
		success : function(result) {
			if (result) {
				$.messager.alert("成功啦！","发布成功!");
				location.href='notice.html';//使页面跳转
			} else {
				$.messager.alert("出错啦！","发布失败!");
			} 
		}
	});
}

function cancelNotice(){
	$('#noticeAdddlg').dialog({closed:true});
}
