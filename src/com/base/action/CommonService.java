package com.base.action;

import java.util.ArrayList;
import java.util.HashMap;

import com.base.baseDao.BaseDao;
import com.base.dbconn.DBConnection;
import com.base.util.ActionUtil;

public class CommonService extends BaseAction {
	private static final long serialVersionUID = 2768212069001501333L;
	@SuppressWarnings({  "static-access",  "rawtypes", "unchecked"})
	public String action(HashMap requestMap) {
		StringBuffer sb = new StringBuffer();
		BaseDao bd = new BaseDao();
		ActionUtil au = new ActionUtil();
		HashMap userinfo = (HashMap) requestMap.get("user_session");
		String actionType = (String) requestMap.get("actionType");
		if (actionType != null && actionType.equals("query")) {
			if(userinfo != null ){
				requestMap.put("areaId", userinfo.get("areaId"));
			}
			HashMap list = bd.queryPage(getDBConn(), requestMap);
			sb.append(au.hashMapToJson(list));
		} else if (actionType != null && actionType.equals("add")) {
			if("success".equals(valid(getDBConn(), requestMap))){
				boolean result = bd.insert(getDBConn(), requestMap);
				sb.append("{\"result\":\""+result+"\"}");
			}else{
				sb.append("{\"result\":\""+valid(getDBConn(), requestMap)+"\"}");
			}
		} else if (actionType != null && actionType.equals("edit")) {
			if("success".equals(valid(getDBConn(), requestMap))){
				boolean result = bd.update(getDBConn(), requestMap);
				sb.append("{\"result\":\""+result+"\"}");
			}else{
				sb.append("{\"result\":\""+valid(getDBConn(), requestMap)+"\"}");
			}
		} else if (actionType != null && actionType.equals("del")) {
			boolean result = bd.delete(getDBConn(), requestMap);
			sb.append("{\"result\":\""+result+"\"}");
		}else if (actionType != null && actionType.equals("queryAll")) {
			if(userinfo != null ){
				requestMap.put("areaId", userinfo.get("areaId"));
			}
			ArrayList<HashMap> list = bd.queryALL(getDBConn(), requestMap);
			sb.append(au.listToJson(list));
		}
		System.out.println("---" + sb.toString() + "---");
		return sb.toString();
	}
	@SuppressWarnings("rawtypes")
	public String valid(DBConnection dbconn, HashMap requestMap){
		String actionType = (String) requestMap.get("actionType");
		 if("add".equals(actionType)){//|| "edit".equals(actionType)
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
