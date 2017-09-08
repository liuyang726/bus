package com.base.util;

import java.util.ResourceBundle;

public class ConfigUtil {
	public static String db_driver;
	public static String db_url;
	public static String db_user;
	public static String db_pwd;

	public static String isdbcp;
	public static String initialSize;
	public static String maxIdle;
	public static String minIdle;
	public static String maxActive;
	public static String maxWait;
	public static String removeAbandoned;
	public static String removeAbandonedTimeout;
	public static String logAbandoned;

	static {
		ResourceBundle resources = ResourceBundle.getBundle("config");
		db_driver = resources.getString("db_driver").trim();
		db_url = resources.getString("db_url").trim();
		db_user = resources.getString("db_user").trim();
		db_pwd = resources.getString("db_pwd").trim();

		isdbcp = resources.getString("isdbcp").trim();
		initialSize = resources.getString("initialSize").trim();
		maxIdle = resources.getString("maxIdle").trim();
		minIdle = resources.getString("minIdle").trim();
		maxActive = resources.getString("maxActive").trim();
		maxWait = resources.getString("maxWait").trim();
		removeAbandoned = resources.getString("removeAbandoned").trim();
		removeAbandonedTimeout = resources.getString("removeAbandonedTimeout").trim();
		logAbandoned = resources.getString("logAbandoned").trim();
	}
}
