package com.base.dbconn;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;

import org.apache.commons.dbcp.BasicDataSource;
import org.apache.commons.dbcp.BasicDataSourceFactory;

import com.base.util.ConfigUtil;

public class ConnectionSource {
	private static BasicDataSource dataSource = null;

	public ConnectionSource() {
	}

	public static void init() {
		if (dataSource != null) {
			try {
				dataSource.close();
			} catch (Exception e) {
				System.out.println("连接池初始化关闭链接失败...");
				e.printStackTrace();
			}
			dataSource = null;
		}

		try {
			Properties p = new Properties();
			p.setProperty("driverClassName", ConfigUtil.db_driver);
			p.setProperty("url", ConfigUtil.db_url);
			p.setProperty("username", ConfigUtil.db_user);
			p.setProperty("password", ConfigUtil.db_pwd);
			p.setProperty("initialSize", ConfigUtil.initialSize); // 初始化连接数量
			p.setProperty("maxIdle", ConfigUtil.maxIdle); // 最大等待数量 0表示无限制
			p.setProperty("minIdle", ConfigUtil.minIdle); // 最小等待数量
			p.setProperty("maxActive", ConfigUtil.maxActive); // 最大连接数量 0表示无限制
			p.setProperty("maxWait", ConfigUtil.maxWait); // 最大等待秒数 单位ms
			p.setProperty("removeAbandoned", ConfigUtil.removeAbandoned); // 是否自我中断，默认false
			p.setProperty("removeAbandonedTimeout", ConfigUtil.removeAbandonedTimeout); // 几秒后会自我中断 removeAbandoned必须为true 默认300秒
			p.setProperty("logAbandoned", ConfigUtil.logAbandoned); // 是否记录自我中断事件 默认false
			dataSource = (BasicDataSource) BasicDataSourceFactory.createDataSource(p);
		} catch (Exception e) {
			System.out.println("连接池初始化失败...");
			e.printStackTrace();
		}
	}

	public static synchronized Connection getConnection() throws SQLException {
		if (dataSource == null) {
			init();
		}

		Connection conn = null;
		if (dataSource != null) {
			conn = dataSource.getConnection();
		}
		return conn;
	}

}
