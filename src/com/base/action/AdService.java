package com.base.action;

import java.util.HashMap;

import com.base.baseDao.AdDao;
import com.base.util.ActionUtil;

@SuppressWarnings("serial")
public class AdService extends BaseAction {

	@SuppressWarnings("static-access")
	@Override
	public String action(HashMap requestMap) {
		StringBuffer sb = new StringBuffer();
		AdDao ad = new AdDao();
		ActionUtil au = new ActionUtil();
		String actionType = (String) requestMap.get("actionType");
		if (actionType != null && actionType.equals("queryDate")) {
			HashMap list = ad.queryDate(getDBConn(), requestMap);
			sb.append(au.hashMapToJson(list));
		}else if(actionType != null && actionType.equals("publish")){
			HashMap list = ad.queryPublish(getDBConn(), requestMap);
			sb.append(au.hashMapToJson(list));
		}else if(actionType != null && actionType.equals("queryStation")){
			HashMap list = ad.queryStation(getDBConn(), requestMap);
			sb.append(au.hashMapToJson(list));
		}else if(actionType != null && actionType.equals("deleteAd")){
			boolean result = ad.deleteAd(getDBConn(), requestMap);
			sb.append(result);
		}else if(actionType != null && actionType.equals("deleteSta_Ad")){
			boolean result = ad.deleteAd(getDBConn(), requestMap);
			sb.append(result);
		}else if(actionType != null && actionType.equals("queryStation_Ad")){
			HashMap list = ad.queryStation_Ad(getDBConn(), requestMap);
			sb.append(au.hashMapToJson(list));
		}else if(actionType != null && actionType.equals("updateStation_Ad")){
			boolean result = ad.updateStation_Ad(getDBConn(), requestMap);
			sb.append(result);
		}
		return sb.toString();
	}
}
