<%@ page language="java" import="java.util.*" pageEncoding="UtF-8"%> 

<%
request.setCharacterEncoding("GB2312");
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String routeInfo = request.getParameter("routeInfo");
routeInfo=routeInfo!=null && !routeInfo.equals("")?java.net.URLDecoder.decode(routeInfo, "utf-8") : "";
String[] routeList = routeInfo.split(",");
String routeListShow="";
for(String route_station : routeList){
		if(route_station == routeList[0] ){
		    routeListShow=routeListShow+route_station;
		}else{
			routeListShow=routeListShow+"-->"+route_station;
		}
	}
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'show.jsp' starting page</title>
  </head>
  
  <body>
    	<table  style="width: 100%; background: #fafafa;">
				<tr>
					<td width=80px>
					线路信息：
					</td>
					<td><%=routeListShow%></td>
				</tr>
			</table>
  </body>
</html>
