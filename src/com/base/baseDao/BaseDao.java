package com.base.baseDao;

import java.util.ArrayList;
import java.util.HashMap;

import com.base.dbconn.DBConnection;
import com.base.dbconn.DBMap;
import com.base.util.ActionUtil;

public class BaseDao implements DaoImplement{
	DBMap tableInfo = new DBMap();

	/**
	 * query
	 * 
	 * @param dbconn
	 * @param parm
	 * @return ArrayList<HashMap>
	 */
	@SuppressWarnings({ "rawtypes" })
	public ArrayList<HashMap> queryALL(DBConnection dbconn, HashMap parm) {
		StringBuffer sql = new StringBuffer();
		String tableName = (String) parm.get("tableName");
		ArrayList list = tableInfo.getTableColuns(dbconn, tableName);
		tableInfo.getTablePK(dbconn, tableName);
		sql.append("select * from " + tableName + " where 1=1");
		if (list != null) {
			for (int i = 0; i < list.size(); i++) {
				String columnName = (String) list.get(i);
				if (parm.get(columnName) != null && parm.get(columnName) != "" && !"".equals(parm.get(columnName))) {
					sql.append(" and " + columnName + " = '" + parm.get(columnName) + "'");
				}
			}
		}
		// System.out.println("-----------" + sql.toString() + "-----------");
		return dbconn.doQueryData(sql.toString());
	}

	/**
	 * queryByid
	 * 
	 * @param dbconn
	 * @param parm
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public ArrayList<HashMap> queryId(DBConnection dbconn, HashMap parm) {
		StringBuffer sql = new StringBuffer();
		String tableName = (String) parm.get("tableName");
		HashMap PKNames = tableInfo.getTablePK(dbconn, tableName);
		String primaryKey = (String) PKNames.get("PRIMARY");
		sql.append("select * from " + tableName + " where " + primaryKey + "= '" + parm.get(primaryKey) + "'");

		// System.out.println("-----------" + sql.toString() + "-----------");
		return dbconn.doQueryData(sql.toString());
	}

	/**
	 * 
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public HashMap queryPage(DBConnection dbconn, HashMap parm) {
		HashMap map = new HashMap();
		StringBuffer sql = new StringBuffer();
		String tableName = (String) parm.get("tableName");
		int pager=0;int pagersize = 10;
		if(!"null".equals(parm.get("page")) && parm.get("page") != null){
			pager = Integer.parseInt((String) parm.get("page"));
		}
		pager = (pager-1)<0?0:(pager-1);
		if(!"null".equals(parm.get("rows")) && parm.get("rows") != null){
			pagersize = Integer.parseInt((String) parm.get("rows"));
		}
		ArrayList list = tableInfo.getTableColuns(dbconn, tableName);
		tableInfo.getTablePK(dbconn, tableName);
		sql.append("from " + tableName + " where 1=1");
		if (list != null) {
			for (int i = 0; i < list.size(); i++) {
				String columnName = (String) list.get(i);
				if (parm.get(columnName) != null && parm.get(columnName) != "" && !"".equals(parm.get(columnName))) {
					sql.append(" and " + columnName + " like '" + parm.get(columnName) + "%'");
				}
			}
		}
		String querySql = "select * "+ sql.toString() +" limit "+(pager*pagersize)+","+pagersize;
		map.put("total", dbconn.doQueryCount("select count(*) " + sql.toString())+"");
		map.put("rows","#"+ ActionUtil.listToJson(dbconn.doQueryData(querySql.toString())));
		return map;
	}
	
	/**
	 * insert
	 * 
	 * @param dbconn
	 * @param parm
	 * @return boolean
	 */
	@SuppressWarnings("rawtypes")
	public boolean insert(DBConnection dbconn, HashMap parm) {
		StringBuffer sql = new StringBuffer();
		String tableName = (String) parm.get("tableName");
		ArrayList list = tableInfo.getTableColuns(dbconn, tableName);
		String fieldNames = "";
		String fieldValues = "";
		if (list != null) {
			for (int i = 0; i < list.size(); i++) {
				String columnName = (String) list.get(i);
				if (parm.get(columnName) != null && parm.get(columnName) != "" && !"".equals(parm.get(columnName))) {
					if (fieldNames == "" && "".equals(fieldNames)) {
						fieldNames = columnName;
					} else {
						fieldNames += "," + columnName;
					}
					if (fieldValues == "" && "".equals(fieldValues)) {
						fieldValues = "'" + parm.get(columnName) + "'";
					} else {
						fieldValues += ",'" + parm.get(columnName) + "'";
					}
				}
			}
		}
		sql.append("insert into  " + tableName + " (" + fieldNames + ") values(" + fieldValues + ") ");
		System.out.println("-----------" + sql.toString() + "-----------");
		return dbconn.doExecute(sql.toString());
	}

	/**
	 * update
	 * 
	 * @param dbconn
	 * @param parm
	 * @return boolean
	 */
	@SuppressWarnings("rawtypes")
	public boolean update(DBConnection dbconn, HashMap parm) {
		StringBuffer sql = new StringBuffer();
		String tableName = (String) parm.get("tableName");
		ArrayList list = tableInfo.getTableColuns(dbconn, tableName);
		HashMap PKNames = tableInfo.getTablePK(dbconn, tableName);
		String primaryKey = (String) PKNames.get("PRIMARY");
		String setValues = "";
		if (list != null) {
			sql.append("update " + tableName + " set ");
			for (int i = 0; i < list.size(); i++) {
				String columnName = (String) list.get(i);
				if (parm.get(columnName) != null && parm.get(columnName) != "" && !"".equals(parm.get(columnName)) && !columnName.equals(primaryKey)) {
					if (setValues == "" && "".equals(setValues)) {
						setValues = columnName + " = '" + parm.get(columnName) + "'";
					} else {
						setValues += "," + columnName + " = '" + parm.get(columnName) + "'";
					}
				}
			}

			sql.append(setValues + " where " + primaryKey + " = '" + parm.get(primaryKey) + "'");
		}
		System.out.println("-----------" + sql.toString() + "-----------");
		return dbconn.doExecute(sql.toString());
	}

	/**
	 * delete
	 * 
	 * @param dbconn
	 * @param parm
	 * @return boolean
	 */
	@SuppressWarnings("rawtypes")
	public boolean delete(DBConnection dbconn, HashMap parm) {
		StringBuffer sql = new StringBuffer();
		String tableName = (String) parm.get("tableName");
		HashMap PKNames = tableInfo.getTablePK(dbconn, tableName);
		String primaryKey = (String) PKNames.get("PRIMARY");
		sql.append("delete from " + tableName + " where " + primaryKey + " = '" + parm.get(primaryKey) + "'");
		System.out.println("-----------" + sql.toString() + "-----------");
		return dbconn.doExecute(sql.toString());
	}

	public static void main(String args[]){
		String sql="update routeInfo set routeName = '3路',routeInfo = '1，2，3，4' where routeId = '4'";
		DBConnection dbc = new DBConnection();
		dbc.doExecute(sql.toString());
	}

}
