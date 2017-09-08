package com.base.baseDao;

import java.util.ArrayList;
import java.util.HashMap;

import com.base.dbconn.DBConnection;

public class loginDao extends BaseDao {

	public String login(DBConnection dbcon, HashMap requestMap) {
		String userName = (String) requestMap.get("userName");
		String password = (String) requestMap.get("password");
		String sql = "select count(*) from users where userName='"+userName+"' and password = '"+password+"'" ;
		int count = dbcon.doQueryCount(sql);
		if(count == 1){
			return "success";
		}else{
			return "fail";
		}
	}

	public String logout(DBConnection dbcon, HashMap requestMap) {

		return "";
	}
	public HashMap getUserInfo(DBConnection dbcon, HashMap requestMap){
		String userName = (String) requestMap.get("userName");
		String password = (String) requestMap.get("password");
		String sql = "select * from users where userName='"+userName+"' and password = '"+password+"'" ;
		return dbcon.doQueryData(sql).get(0);
	}
}
