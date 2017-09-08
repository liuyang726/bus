package com.base.dbconn;

import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;

public class DBMap {
	private static HashMap<String, HashMap<String, String>> dbmap = new HashMap<String, HashMap<String, String>>();
	private static HashMap<String, String> realmap = new HashMap<String, String>();

	public static HashMap<String, String> getMap(DBConnection dbconn, String tablename) {
		if (realmap.containsKey(tablename)) {
			tablename = realmap.get(tablename);
		}

		if (!dbmap.containsKey(tablename) || dbmap.get(tablename).isEmpty()) {
			dbmap.put(tablename, getTableMap(dbconn, tablename));
		}

		return dbmap.get(tablename);
	}

	/**
	 * 获取一张表的所有信息
	 * 
	 * @param dbconn
	 * @param tablename
	 * @return HashMap<String, String>
	 */
	public static HashMap<String, String> getTableMap(DBConnection dbconn, String tablename) {
		HashMap<String, String> hm_table = new HashMap<String, String>();

		try {
			DatabaseMetaData dmd = dbconn.getConn().getMetaData();
			ResultSet columns = dmd.getColumns(null, "%", tablename, "%");

			String column_name = "";
			String column_type = "";
			while (columns.next()) {
				column_name = columns.getString("COLUMN_NAME");
				column_type = columns.getString("TYPE_NAME");

				if (!hm_table.containsKey("*tableid") && column_type.endsWith("identity")) {
					hm_table.put("*tableid", column_name);
				}

				if (column_type.startsWith("int") || column_type.startsWith("bigint")) {
					column_type = "int";
				}
				if (column_type.startsWith("numeric")) {
					column_type = "double";
				} else if (column_type.equals("varchar") || column_type.equals("text")) {
					column_type = "string";
				} else if (column_type.equals("datetime")) {
					column_type = "datetime";
				} else if (column_type.equals("bit")) {
					column_type = "boolean";
				}

				hm_table.put(column_name, column_type);
				// System.out.println("------column_name="+column_name+"--column_type="+column_type+"------");
			}

			if (!hm_table.isEmpty()) {
				hm_table.put("*tablename", tablename);
			}

			// System.out.println("------*tableid="+hm_table.get("*tableid"));
			// System.out.println("------*tablename="+hm_table.get("*tablename"));
		} catch (Exception e) {
			e.printStackTrace();
		}

		return hm_table;
	}

	/**
	 * 获取数据库中所有表的信息
	 */
	private void getAllTableInfo() {
		HashSet<String> hs_table = new HashSet<String>();
		HashSet<String> hs_table_field = new HashSet<String>();

		DBConnection dbconn = new DBConnection();
		try {
			DatabaseMetaData dmd = dbconn.getConn().getMetaData();
			ResultSet tables = dmd.getTables(null, "%", "%", new String[] { "TABLE", "VIEW" });

			String table_name = "";
			while (tables.next()) {
				table_name = tables.getString("TABLE_NAME");
				hs_table.add(table_name);
				if (table_name.equals("CHECK_CONSTRAINTS")) {
					break;
				}

				System.out.println("------table_name=" + table_name + "------");
				getTableInfo(table_name, hs_table_field);
				System.out.println("------------------");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				dbconn.close();
				dbconn = null;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		Iterator<String> iterator = hs_table_field.iterator();
		while (iterator.hasNext()) {
			System.out.println("------------------" + iterator.next() + "------------------");
		}
	}

	/**
	 * 获取表中所有字段名称和数据类型
	 * 
	 * @param tablename
	 * @param hs_table_field
	 */
	private void getTableInfo(String tablename, HashSet<String> hs_table_field) {
		DBConnection dbconn = new DBConnection();
		try {
			DatabaseMetaData dmd = dbconn.getConn().getMetaData();
			ResultSet columns = dmd.getColumns(null, "%", tablename, "%");

			String column_name = "";
			String column_type = "";
			while (columns.next()) {
				column_name = columns.getString("COLUMN_NAME");
				column_type = columns.getString("TYPE_NAME");
				hs_table_field.add(column_type);
				System.out.println("------column_name=" + column_name + "--column_type=" + column_type + "------");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				dbconn.close();
				dbconn = null;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * 获取表的所有字段
	 * 
	 * @param dbconn
	 * @param tablename
	 * @return
	 */
	public ArrayList getTableColuns(DBConnection dbconn, String tablename) {
		ArrayList table_field = new ArrayList();
		try {
			DatabaseMetaData dmd = dbconn.getConn().getMetaData();
			ResultSet columns = dmd.getColumns(null, "%", tablename, "%");

			String column_name = "";
			while (columns.next()) {
				column_name = columns.getString("COLUMN_NAME");
				table_field.add(column_name);
				System.out.println("------column_name=" + column_name + "------");
			}
			return table_field;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 获取表的主键
	 * 
	 * @param dbconn
	 * @param tablename
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public HashMap getTablePK(DBConnection dbconn, String tablename) {
		HashMap keyNames = new HashMap();
		try {
			DatabaseMetaData dmd = dbconn.getConn().getMetaData();
			// 主键
			ResultSet ids = dmd.getPrimaryKeys(null, "%", tablename);

			while (ids != null && ids.next()) {
				String keyname = ids.getString("COLUMN_NAME");
				String keytype = ids.getString("PK_NAME");
				keyNames.put(keytype, keyname);
			}
			return keyNames;
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		}
	}
}
