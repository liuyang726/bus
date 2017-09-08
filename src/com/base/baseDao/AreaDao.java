package com.base.baseDao;

import java.util.ArrayList;

import java.util.HashMap;

import com.base.dbconn.DBConnection;

public class AreaDao extends BaseDao{
	public ArrayList<HashMap> queryUserByArea(DBConnection dbconn, HashMap parm){
		String areaName = (String) parm.get("areaName");
		String sql = "SELECT * FROM users WHERE users.areaName in (SELECT area.areaName FROM area WHERE area.parentName='"+areaName+"' )";
		return dbconn.doQueryData(sql);
	}
	public ArrayList<HashMap> queryUserByAreaId(DBConnection dbconn, HashMap parm){
		String areaId = (String) parm.get("areaId");
		String sql = "SELECT * FROM users WHERE users.areaName =(SELECT area.areaName FROM area WHERE area.areaId='"+areaId+"' )";
		return dbconn.doQueryData(sql);
	}
	public ArrayList<HashMap> queryArea(DBConnection dbconn, HashMap parm){
		String sql="SELECT * FROM area";
		//从session中获取登录用户的信息
		HashMap userinfo = (HashMap) parm.get("user_session");
		String areaId = (String) userinfo.get("areaId");//获取areaId 
		if(!"null".equals(areaId) && !"".equals(areaId) && areaId != null){
			sql += " where areaId like '"+areaId+"%'";
		}
		return dbconn.doQueryData(sql);
	}
	
	public ArrayList<HashMap> queryAreaRes(DBConnection dbconn, HashMap parm){
		String sql="SELECT * FROM area";
		return dbconn.doQueryData(sql);
	}
}

