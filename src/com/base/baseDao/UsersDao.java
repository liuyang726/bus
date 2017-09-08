package com.base.baseDao;

import java.util.ArrayList;
import java.util.HashMap;

import com.base.dbconn.DBConnection;
import com.base.util.ActionUtil;

public class UsersDao extends BaseDao {
	
	/**
	 * query
	 * 
	 * @param dbconn
	 * @param parm
	 * @return ArrayList<HashMap>
	 */
	@SuppressWarnings({ "unchecked" })
	public ArrayList<HashMap> queryUserByid(DBConnection dbconn, String userId) {
		String sql = "";
		sql = "select u.*,a.areaName from users as u,area as a where u.areaid = a.areaid ";
		sql += " and u.userId = '"+userId+"' ";
		return dbconn.doQueryData(sql);
	}
	/**
	 * query
	 * 
	 * @param dbconn
	 * @param parm
	 * @return ArrayList<HashMap>
	 */
	@SuppressWarnings({ "unchecked" })
	public Boolean checkPassword(String password,HashMap parm) {
		String pwd = (String) parm.get("oldpwd");
		if(!(pwd.equals(password))){
			return false;
		}
		return true;
	}

	/**
	 * query
	 * 
	 * @param dbconn
	 * @param parm
	 * @return ArrayList<HashMap>
	 */
	@SuppressWarnings({ "unchecked" })
	public HashMap exceptQuery(DBConnection dbconn, HashMap parm) {
		String sql = "";
		String areaId = (String) parm.get("areaId");
		sql = "select u.*,a.areaName from users as u,area as a where u.areaid = a.areaid and roleName not in ('公交公司会员','广告商会员')";
		//从session中获取登录用户的信息
		HashMap userinfo = (HashMap) parm.get("user_session");
		String parentId = (String) userinfo.get("areaId");//获取areaId 
		sql += " and a.parentId like '"+parentId+"%'";
		if(!"null".equals(areaId) && !"".equals(areaId) && areaId != null){
			sql += "and a.areaId = '"+areaId+"'";
		}
		return getPagerDate(dbconn,parm,sql);
	}
	
	
	/**
	 * query
	 * 
	 * @param dbconn
	 * @param parm
	 * @return ArrayList<HashMap>
	 */
	@SuppressWarnings({ "unchecked" })
	public HashMap queryMember(DBConnection dbconn, HashMap parm) {
		String sql = "";
		String roleName = (String) parm.get("roleName");
		String areaId = (String) parm.get("areaId");
		sql = "select u.*,a.areaName from users as u,area as a where u.areaid = a.areaid ";
		//从session中获取登录用户的信息
		HashMap userinfo = (HashMap) parm.get("user_session");
		String area = (String) userinfo.get("areaId");//获取当前登录用户的areaId  
		sql += " and a.areaId like '"+area+"%'";
		if(!"null".equals("") && !"".equals(roleName) && roleName != null){
			sql += "and roleName = '"+roleName+"'";
		}
		if(!"null".equals("") && !"".equals(areaId) && areaId != null){
			sql += "and u.areaId = '"+areaId+"'";
		}
		return getPagerDate(dbconn,parm,sql);
	}
	/**
	 * 
	 * @param dbconn
	 * @param parm
	 * @param sql
	 * @return HashMap
	 */
	@SuppressWarnings("unchecked")
	public HashMap getPagerDate(DBConnection dbconn,HashMap parm,String sql){
		HashMap map = new HashMap();
		int pager=0;int pagersize = 10;
		if(!"null".equals(parm.get("page")) && parm.get("page") != null){
			pager = Integer.parseInt((String) parm.get("page"));
		}
		pager = (pager-1)<0?0:(pager-1);
		if(!"null".equals(parm.get("rows")) && parm.get("rows") != null){
			pagersize = Integer.parseInt((String) parm.get("rows"));
		}
		String querySql = "select page.* from ( "+ sql.toString() +" ) as page limit "+(pager*pagersize)+","+pagersize;
		map.put("total", dbconn.doQueryCount("select count(*) from ("+ sql.toString() +") as page ")+"");
		map.put("rows","#"+ ActionUtil.listToJson(dbconn.doQueryData(querySql.toString())));
		return map;
	}
}
