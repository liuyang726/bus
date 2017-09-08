package com.base.dbconn;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;

import org.apache.log4j.Logger;

import com.base.util.ConfigUtil;

public class DBConnection {
	static Logger logger = Logger.getLogger(DBConnection.class);

	Connection conn = null;
	ResultSet rs;
	Statement stmt;
	PreparedStatement pstmt;

	public DBConnection() {
		this.conn = getConn();
	}

	public Connection getConn() {
		if (this.conn != null) {
			return this.conn;
		}

		String isdbcp = ConfigUtil.isdbcp;
		if (isdbcp.equals("Y")) {
			try {
				return ConnectionSource.getConnection();
			} catch (SQLException e) {
				logger.info("连接池-数据库连接失败...");
				e.printStackTrace();
			}
		} else {
			String driver = ConfigUtil.db_driver;
			String url = ConfigUtil.db_url;
			String user = ConfigUtil.db_user;
			String pwd = ConfigUtil.db_pwd;

			try {
				Class.forName(driver);
				return DriverManager.getConnection(url, user, pwd);
			} catch (Exception e) {
				logger.info("数据库连接失败...");
				e.printStackTrace();
			}
		}

		return null;
	}

	public ResultSet getResult(String sql) throws Exception {
		if (conn == null) {
			return null;
		}
		try {
			this.stmt = conn.createStatement();
			this.rs = stmt.executeQuery(sql);
			return rs;
		} catch (Exception e) {
			logger.info("数据库获取结果集操作失败,SQL为【" + sql + "】");
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 数据库更新
	 * 
	 * @param sql
	 * @return boolean
	 */
	public boolean doExecute(String sql) {
		logger.info("数据库更新,SQL为【" + sql + "】");

		try {
			this.pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();
			return true;
		} catch (Exception e) {
			logger.info("数据库更新操作失败,SQL为【" + sql + "】");
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * 数据库更新
	 * 
	 * @param sql
	 * @throws Exception
	 */
	public void doExecute_Exception(String sql) throws Exception {
		logger.info("数据库更新,SQL为【" + sql + "】");

		this.pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();
	}

	/**
	 * 执行批处理sql
	 * 
	 * @param al_sql
	 * @return boolean
	 */

	public boolean doExecute(ArrayList al_sql) {
		try {
			conn.setAutoCommit(false);
			stmt = conn.createStatement();

			for (int i = 0; i < al_sql.size(); i++) {
				String sql = (String) al_sql.get(i);
				logger.info("数据库批处理更新,第" + i + "条SQL为【" + sql + "】");
				if (sql != null && sql.length() > 0) {
					stmt.addBatch(sql);
				} else {
					logger.info("数据库批处理更新第" + i + "条SQL语句为空");
					throw new Exception("数据库批处理更新第" + i + "条SQL语句为空");
				}
			}

			stmt.executeBatch();
			conn.commit();
			return true;
		} catch (Exception e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				logger.info("数据库批处理更新回滚操作失败!");
				e1.printStackTrace();
			}

			for (int i = 0; i < al_sql.size(); i++) {
				logger.info("数据库批处理更新操作失败,SQL为【" + (String) al_sql.get(i) + "】");
			}
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * 执行查询语句
	 * 
	 * @param sql
	 * @return ArrayList<HashMap>
	 */
	@SuppressWarnings("unchecked")
	public ArrayList<HashMap> doQueryData(String sql) {
		ArrayList al = new ArrayList<HashMap>();
		logger.info("数据库查询,SQL为【" + sql + "】");

		try {
			ResultSet rs = getResult(sql);

			ResultSetMetaData rsmd = rs.getMetaData();
			int columncount = rsmd.getColumnCount(); // 总共有几列
			String[] str_columnnames = new String[columncount];
			String[] str_columntypes = new String[columncount];
			for (int i = 0; i < columncount; i++) {
				str_columnnames[i] = rsmd.getColumnName(i + 1);
				str_columntypes[i] = rsmd.getColumnTypeName(i + 1);
			}

			while (rs.next()) {
				HashMap hm = new HashMap();
				for (int i = 0; i < columncount; i++) {
					if (str_columntypes[i].equals("datetime")) {
						hm.put(str_columnnames[i], getDateTime(rs.getString(str_columnnames[i])));
					} else {
						hm.put(str_columnnames[i], rs.getString(str_columnnames[i]));
					}
				}
				al.add(hm);
			}
		} catch (Exception e) {
			logger.info("数据库查询操作失败,SQL为【" + sql + "】");
			e.printStackTrace();
		}
		return al;
	}

	/**
	 * 查询MaxID
	 * 
	 * @param tablename
	 * @param primaryKey
	 * @return String
	 */
	public String getMaxID(String tablename, String id) {
		String sql = "select max(" + id + ") max_id from " + tablename;
		logger.info("数据库查询,SQL为【" + sql + "】");

		try {
			ResultSet rs = getResult(sql);

			while (rs.next()) {
				return rs.getString("max_id");
			}
		} catch (Exception e) {
			logger.info("数据库查询操作失败,SQL为【" + sql + "】");
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 查询数据库数据条数
	 * 
	 * @param sql_count
	 * @return int
	 */
	public int doQueryCount(String sql_count) {
		logger.info("数据库查询,SQL为【" + sql_count + "】");

		try {
			ResultSet rs = getResult(sql_count);

			while (rs.next()) {
				return rs.getInt(1);
			}
		} catch (Exception e) {
			logger.info("数据库查询操作失败,SQL为【" + sql_count + "】");
			e.printStackTrace();
		}

		return 0;
	}

	/**
	 * 调用存储过程
	 * 
	 * @param sql
	 * @return boolean
	 */
	public boolean CallProcedure(String sql) {
		logger.info("数据存储过程,SQL为【" + sql + "】");

		try {
			this.stmt = conn.prepareCall(sql);
			stmt.execute(sql);
			return true;
		} catch (Exception e) {
			logger.info("数据库查询操作失败,SQL为【" + sql + "】");
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * 关闭
	 * 
	 * @throws Exception
	 */
	public void close() throws Exception {
		if (this.rs != null)
			this.rs.close();
		if (this.pstmt != null)
			this.pstmt.close();
		if (this.stmt != null)
			this.stmt.close();
		if (this.conn != null)
			this.conn.close();
	}

	/**
	 * 格式化日期
	 * 
	 * @param datetime
	 * @return
	 */
	public static String getDateTime(String datetime) {
		if (datetime == null || datetime.equals("")) {
			return "";
		}

		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			return sdf.format(sdf.parse(datetime));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return "";
	}
}
