var areaId = "";
function saveAdInfo() {
	$.ajaxFileUpload({
		type :'post',
		url : '../addAdService.do', // 用于文件上传的服务器端请求地址
		secureuri : false, // 一般设置为false
		fileElementId : 'filebox_file_id_1', // 文件上传空间的id属性 
		contentType:"text/html; charset=utf-8",
		data:{
			actionType:"add",
			directory: "image",
			adName:$("#adName").val(),
			adType:$("#adType").val(),
			publishDate:$("#publishDate").datebox('getValue'),
			expiryDate:$("#expiryDate").datebox('getValue')
		},
		dataType : 'json', // 返回值类型 一般设置为json
		success : function(data, status) // 服务器成功响应处理函数
		{
			if(data.result == "true"){
				alert("保存成功！");
			};
		},
		error : function(data, status, e)// 服务器响应失败处理函数
		{
			alert(e);
		}
	});
}
