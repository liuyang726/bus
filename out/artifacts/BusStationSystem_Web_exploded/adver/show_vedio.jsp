<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	String content = request.getParameter("content");
/* 	String publishDate = request.getParameter("publishDate");
	String expiryDate = request.getParameter("expiryDate");
	String IsExamined = "";
	if ("1".equals(request.getParameter("IsExamined"))) {
		IsExamined = "已审核";
	} else if ("0".equals(request.getParameter("IsExamined"))) {
		IsExamined = "待审核";
	} */
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">

<title>show_page</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">

</head>

<body>
	 <div align="center">
    	<table id="detailDg" class="dv-table"
				style=" background: #fafafa; padding: 5px; margin-top: 5px;">
				<tr>
				    <td width="30%"></td>
					 <td>
					   <div align="center">
							<video width="350px" height="200px" controls="controls">
							<source src="../<%=content %>" type="video/mp4"></source>
							</video> 
					   </div>
					</td>
				</tr>	
			</table>
			</div>
</body>
</html>
