package com.base.action;

import java.util.ArrayList;
import java.util.HashMap;

import com.base.baseDao.UsersDao;
import com.base.util.ActionUtil;

public class UserService extends BaseAction{

	private static final long serialVersionUID = 4698743582320190848L;

	@SuppressWarnings({ "static-access", "unchecked", "rawtypes" })
	@Override
	public String action(HashMap requestMap) {
		StringBuffer sb = new StringBuffer();
		UsersDao ud = new UsersDao();
		ActionUtil au = new ActionUtil();
		//从session中获取登录用户的信息
		HashMap userinfo = (HashMap) requestMap.get("user_session");
		String actionType = (String) requestMap.get("actionType");
		if(actionType != null && actionType.equals("exceptQuery")){
			HashMap list = ud.exceptQuery(getDBConn(), requestMap);
			sb.append(au.hashMapToJson(list));
		}else if(actionType != null && actionType.equals("queryMember")){
			HashMap list = ud.queryMember(getDBConn(), requestMap);
			sb.append(au.hashMapToJson(list));
		}
		else if(actionType != null && actionType.equals("queryUserInfo")){
			String userId = (String) userinfo.get("userId");//获取userId
			ArrayList<HashMap> list = ud.queryUserByid(getDBConn(),userId);
			sb.append(au.listToJson(list));
		}else if(actionType != null && actionType.equals("userEdit")){
			String userId = (String) userinfo.get("userId");//获取userId
			String password = (String) userinfo.get("password");//获取password
			requestMap.put("userId", userId);
			boolean value = ud.checkPassword(password,requestMap);
			if(value){
				boolean result = ud.update(getDBConn(), requestMap);
				if(result){
					sb.append("{\"result\":\"success\"}");
				}else{
					sb.append("{\"result\":\"密码修改失败!\"}");
				}
			}else{
				sb.append("{\"result\":\"原始密码输入不正确!\"}");
			}
		}else if(actionType != null && actionType.equals("checkLogin")){
			if(userinfo == null){
				sb.append("{\"result\":\"false\"}");
			}else{
				sb.append("{\"result\":\"true\"}");
			}
		}
		System.out.println("---" + sb.toString() + "---");
		return sb.toString();
	}

}
