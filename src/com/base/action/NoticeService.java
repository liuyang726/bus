package com.base.action;

import java.util.ArrayList;
import java.util.HashMap;

import com.base.baseDao.NoticeDao;
import com.base.util.ActionUtil;
public class NoticeService extends BaseAction{
	private static final long serialVersionUID = 6156541401818613895L;

	@SuppressWarnings("rawtypes")
	public String action(HashMap requestMap) {
		StringBuffer sb = new StringBuffer();
		NoticeDao nd = new NoticeDao();
		String actionType = (String) requestMap.get("actionType");
		if (actionType != null && actionType.equals("queryNotice")) {
			ArrayList<HashMap> list = nd.queryNotice(getDBConn(), requestMap);
			sb.append(ActionUtil.listToJson(list));
		}
		System.out.println("---" + sb.toString() + "---");
		return sb.toString();
	}

}
