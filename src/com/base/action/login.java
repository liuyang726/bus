package com.base.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.base.baseDao.loginDao;
import com.base.dbconn.DBConnection;
import com.base.util.ActionUtil;
import com.base.util.BaseUtil;


@SuppressWarnings("serial")
public class login extends HttpServlet{
	@SuppressWarnings("rawtypes")
	private static ThreadLocal dbconn = new ThreadLocal();
	@SuppressWarnings("rawtypes")
	public void service(ServletRequest request, ServletResponse response) throws IOException {
		String result = "";
		try {
			response.setCharacterEncoding("UTF-8");  
			request.setCharacterEncoding("UTF-8");
			HashMap requestMap = (HashMap) BaseUtil.getParameterMap(request);
			response.setContentType("text/html;charset=UTF-8");
			String actionType = (String) requestMap.get("actionType");
			HttpSession session =((HttpServletRequest) request).getSession();
			if(actionType != null && actionType.equals("login")){
				loginDao ld = new loginDao();
				if("success".equals(ld.login(getDBConn(), requestMap))){
					HashMap list = ld.getUserInfo(getDBConn(), requestMap);
					session.setAttribute("user_session", list);
					result = "{\"result\":\"success\",\"userInfo\":["+ActionUtil.hashMapToJson(list)+"]}";
				}else{
					result = "{\"result\":\"failure\"}";
				}
			}else if(actionType != null && actionType.equals("logout")){
				session.removeAttribute("user_session");
				result = "{\"result\":\"success\"}";
			}
			System.out.println(result.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			try {
				getDBConn().close();
				dbconn.remove();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		PrintWriter out = response.getWriter();
		out.println(result);
		out.flush();
		out.close();
		
	}
	@SuppressWarnings("unchecked")
	public DBConnection getDBConn() {
		DBConnection db = (DBConnection) dbconn.get();
		if (db == null) {
			db = new DBConnection();
			dbconn.set(db);
		}
		return db;
	}
}
