package com.base.action;

import java.util.ArrayList;

import java.util.HashMap;

import com.base.baseDao.AreaDao;
import com.base.util.ActionUtil;
import com.base.util.treeJson;
public class AreaService extends BaseAction{
      
	public String action(HashMap requestMap) {
		//从session中获取登录用户的信息
		HashMap userinfo = (HashMap) requestMap.get("user_session");
		String areaId = "";//获取areaId 
		StringBuffer sb = new StringBuffer();
		AreaDao ad = new AreaDao();
		String actionType = (String) requestMap.get("actionType");
		if (actionType != null && actionType.equals("queryUserByArea")) {
			ArrayList<HashMap> list = ad.queryUserByArea(getDBConn(), requestMap);
			sb.append(ActionUtil.listToJson(list));
		}else if(actionType != null && actionType.equals("queryUserByAreaId")) {
			ArrayList<HashMap> list = ad.queryUserByAreaId(getDBConn(), requestMap);
			sb.append(ActionUtil.listToJson(list));
		}else if(actionType != null && actionType.equals("queryArea")){
			ArrayList<HashMap> list = ad.queryArea(getDBConn(), requestMap);
			areaId = (String) userinfo.get("areaId");//获取areaId 
			sb.append(treeJson.listToTreeJson(list,areaId));
		}else if(actionType != null && actionType.equals("queryAreaRes")){
			ArrayList<HashMap> list = ad.queryAreaRes(getDBConn(), requestMap);
			sb.append(treeJson.listToTreeJson(list,areaId));
		}
		System.out.println("---" + sb.toString() + "---");
		return sb.toString();
	}

}
