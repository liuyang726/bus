package com.base.baseDao;

import java.util.ArrayList;

import java.util.HashMap;

import com.base.dbconn.DBConnection;

public class NoticeDao extends BaseDao{
	public ArrayList<HashMap> queryNotice(DBConnection dbconn, HashMap parm){
		String beginDate = (String) parm.get("beginDate");
		String endDate = (String) parm.get("endDate");
		String sql = "SELECT * FROM notice WHERE 1=1 "; 
		if(!"null".equals(beginDate) && !"".equals(beginDate) && beginDate != null){
			if(!"null".equals(endDate) && !"".equals(endDate) && endDate != null){
				sql += " and publishDate between '"+ beginDate+"' and '" +endDate+"'";
			}else{
				sql += " and publishDate >= '"+ beginDate+"'";
			}
		}else if(!"null".equals(endDate) && !"".equals(endDate) && endDate != null){
			sql += " and publishDate <= '" +endDate+"'";
		}
		return dbconn.doQueryData(sql);
	}
	
}