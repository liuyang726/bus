package com.base.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.base.dbconn.DBConnection;
import com.base.util.BaseUtil;

@SuppressWarnings("serial")
public abstract class BaseAction extends HttpServlet {

	@SuppressWarnings("rawtypes")
	private static ThreadLocal dbconn = new ThreadLocal();

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void service(HttpServletRequest _request, HttpServletResponse _response) throws ServletException, IOException {
		String result = "";
		try {
			_response.setCharacterEncoding("UTF-8");  
			_request.setCharacterEncoding("UTF-8");  
			HashMap requestMap = (HashMap) BaseUtil.getParameterMap(_request);
			// 添加session
			HttpSession session =  _request.getSession();
			HashMap map =  (HashMap) session.getAttribute("user_session");
			requestMap.put("user_session", map);
			result = action(requestMap);
		} catch (Exception e) {
			result = "{ \"base_error\":{\"other_error\":\"服务处理异常!\"} }";
			e.printStackTrace();
		} finally {
			try {
				getDBConn().close();
				dbconn.remove();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		_response.setContentType("text/html;charset=UTF-8");
		PrintWriter out = _response.getWriter();
		out.println(result);
		out.flush();
		out.close();
	}

	@SuppressWarnings("rawtypes")
	public abstract String action(HashMap requestMap);

	
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