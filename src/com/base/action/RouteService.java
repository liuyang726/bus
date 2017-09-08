package com.base.action;

import java.util.ArrayList;
import java.util.HashMap;

import com.base.baseDao.RouteDao;
import com.base.dbconn.DBConnection;
import com.base.util.ActionUtil;
public class RouteService extends BaseAction{
	private static final long serialVersionUID = -7531305678546966746L;
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public String action(HashMap requestMap) {
		StringBuffer sb = new StringBuffer();
		RouteDao rd = new RouteDao();
		String actionType = (String) requestMap.get("actionType");
		HashMap userinfo = (HashMap) requestMap.get("user_session");
		if(actionType != null && actionType.equals("queryRouteInfo")){
			ArrayList<HashMap> list = rd.queryRouteInfo(getDBConn(), requestMap);
			sb.append(ActionUtil.listToJson(list));
		}else if (actionType != null && actionType.equals("addRoutes")) {
			if("success".equals(valid(getDBConn(), requestMap))){
				boolean result = rd.addRouteinfo(getDBConn(), requestMap);
				sb.append("{\"result\":\""+result+"\"}");
			}else{
				sb.append("{\"result\":\""+valid(getDBConn(), requestMap)+"\"}");
			}
		}else if (actionType != null && actionType.equals("editRoutes")) {
			if("success".equals(valid(getDBConn(), requestMap))){
				boolean result = rd.editRouteinfo(getDBConn(), requestMap);
				sb.append("{\"result\":\""+result+"\"}");
			}else{
				sb.append("{\"result\":\""+valid(getDBConn(), requestMap)+"\"}");
			}
		} else if (actionType != null && actionType.equals("delRoutes")) {
			boolean result = rd.delRoute(getDBConn(), requestMap);
			sb.append("{\"result\":\""+result+"\"}");
		} else if (actionType != null && actionType.equals("delStation")){
			if("success".equals(valid(getDBConn(), requestMap))){
				boolean result = rd.delete(getDBConn(), requestMap);
				sb.append("{\"result\":\""+result+"\"}");
			}else{
				sb.append("{\"result\":\""+valid(getDBConn(), requestMap)+"\"}");
			}
		}else if(actionType != null && actionType.equals("addStation")){
			if(userinfo != null ){
				requestMap.put("areaId", userinfo.get("areaId"));
				if("success".equals(valid(getDBConn(), requestMap))){
					boolean result = rd.insert(getDBConn(), requestMap);
					sb.append("{\"result\":\""+result+"\"}");
				}else{
					sb.append("{\"result\":\""+valid(getDBConn(), requestMap)+"\"}");
				}
			}
		}else if (actionType != null && actionType.equals("editStation")) {
			if(userinfo != null ){
				requestMap.put("areaId", userinfo.get("areaId"));
				if("success".equals(valid(getDBConn(), requestMap))){
					boolean result = rd.update(getDBConn(), requestMap);
					sb.append("{\"result\":\""+result+"\"}");
				}else{
					sb.append("{\"result\":\""+valid(getDBConn(), requestMap)+"\"}");
				}
			}
		}
		System.out.println("---" + sb.toString() + "---");
		return sb.toString();
	}
	@SuppressWarnings("rawtypes")
	public String valid(DBConnection dbconn, HashMap requestMap){
		String actionType = (String) requestMap.get("actionType");
		 if("addRoutes".equals(actionType)){// || "editRoutes".equals(actionType)
			 String tableName =  (String) requestMap.get("tableName");
			 String noRepeat =  (String) requestMap.get("noRepeat");
			 String columnValue =  (String) requestMap.get(noRepeat);
			 String sql = "select count(*) from "+tableName+" where "+noRepeat+" = '"+columnValue+"'";
			 int count = dbconn.doQueryCount(sql);
			 if(count > 0)
			 return "您添加的记录已存在，请重新添加！";
		 }else if("addStation".equals(actionType)){
			 String stationId = (String) requestMap.get("stationId");
			 String sql = "select count(*) from station_route where stationId = '"+stationId+"'";
			 int count = dbconn.doQueryCount(sql);
			 if(count > 0)
			 return "站牌正在使用中，请勿删除！";
		 }else if("delStation".equals(actionType)){
			 String tableName =  (String) requestMap.get("tableName");
			 String noRepeat =  (String) requestMap.get("noRepeat");
			 String columnValue =  (String) requestMap.get(noRepeat);
			 String sql = "select count(*) from "+tableName+" where "+noRepeat+" = '"+columnValue+"'";
			 int count = dbconn.doQueryCount(sql);
			 if(count > 0)
			 return "您添加的记录已存在，请重新添加！";
		 }
		 return "success";
	}

}
