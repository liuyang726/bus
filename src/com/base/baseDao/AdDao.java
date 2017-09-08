package com.base.baseDao;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;

import com.base.dbconn.DBConnection;
import com.base.util.ActionUtil;
import com.base.util.BaseUtil;

public class AdDao extends BaseDao {
	/**
	 * query
	 * 
	 * @param dbconn
	 * @param parm
	 * @return ArrayList<HashMap> 查询过期日期小于当前时间的，筛选出过期广告
	 */
	public HashMap queryDate(DBConnection dbconn, HashMap parm) {
		String adName = (String) parm.get("adName");
		String adType = (String) parm.get("adType");
		//从session中获取登录用户的信息
		HashMap userinfo = (HashMap) parm.get("user_session");
		String ownerId = (String) userinfo.get("userId");//获取userId 
		String sql = "select * from view_adinfo where  expiryDate < curdate() ";
		if (!"".equals(adName) && !"null".equals(adName) && adName != null) {
			sql += "and adName = '" + adName + "'";
		}
		if (!"".equals(adType) && !"null".equals(adType) && adType != null) {
			sql += "and adType = '" + adType + "'";
		}
		if (!"".equals(ownerId) && !"null".equals(ownerId) && ownerId != null) {
			sql += "and ownerId = '" + ownerId + "'";
		}
		return queryAdInfoPage(dbconn, parm, sql);
	}

	/**
	 * query
	 * 
	 * @param dbconn
	 * @param parm
	 * @return ArrayList<HashMap> 查询失效日期大于当前时间且发布位为0，筛选出预发布的广告
	 */
	public HashMap queryPublish(DBConnection dbconn, HashMap parm) {
		String adName = (String) parm.get("adName");
		String adType = (String) parm.get("adType");
		//从session中获取登录用户的信息
		HashMap userinfo = (HashMap) parm.get("user_session");
		String ownerId = (String) userinfo.get("userId");//获取userId 
		String sql = "select * from view_adinfo where  expiryDate >= curdate() and publish='0' ";
		if (!"".equals(adName) && !"null".equals(adName) && adName != null) {
			sql += "and adName = '" + adName + "'";
		}
		if (!"".equals(adType) && !"null".equals(adType) && adType != null) {
			sql += "and adType = '" + adType + "'";
		}
		if (!"".equals(ownerId) && !"null".equals(ownerId) && ownerId != null) {
			sql += "and ownerId = '" + ownerId + "'";
		}
		return queryAdInfoPage(dbconn, parm, sql);
	}

	/**
	 * 
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public HashMap queryAdInfoPage(DBConnection dbconn, HashMap parm, String sql) {
		HashMap map = new HashMap();
		int pager = 0;
		int pagersize = 10;
		if (!"null".equals(parm.get("page")) && parm.get("page") != null) {
			pager = Integer.parseInt((String) parm.get("page"));
		}
		pager = (pager - 1) < 0 ? 0 : (pager - 1);
		if (!"null".equals(parm.get("rows")) && parm.get("rows") != null) {
			pagersize = Integer.parseInt((String) parm.get("rows"));
		}

		String querySql = "select ads.* from ( " + sql + ") as ads limit "
				+ (pager * pagersize) + "," + pagersize;
		map.put("total",
				dbconn.doQueryCount("select count(*)  from (" + sql
						+ ") as ads")
						+ "");
		map.put("rows",
				"#"
						+ ActionUtil.listToJson(dbconn.doQueryData(querySql
								.toString())));
		return map;
	}

	public boolean deleteAd(DBConnection dbconn, HashMap parm) {
		try {
			String adId = (String) parm.get("adId");
			ArrayList<HashMap> list = dbconn
					.doQueryData("select content from adinfo where adId = '"
							+ adId + "'");
			String path = (String) list.get(0).get("content");
			String currentPath = this.getClass().getResource("").toURI()
					.toString();
			String filepath = currentPath.substring(6,
					currentPath.lastIndexOf("WEB-INF"));
			deleteFile(filepath.replace("%20", " ") + path);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return delete(dbconn, parm);
	}

	public void deleteFile(String path) {
		File file = new File(path);
		if (file.exists() && !file.isDirectory()) {
			file.delete();
		}
	}

	public HashMap queryStation(DBConnection dbconn, HashMap parm) {
		String adName = (String) parm.get("adName");
		String sql = "select * from view_adinfo where stationName is not null";
		if (!"".equals(adName) && !"null".equals(adName) && adName != null) {
			sql += "and adName = '" + adName + "'";
		}
		return queryAdInfoPage(dbconn, parm, sql);
	}

	public HashMap queryStation_Ad(DBConnection dbconn, HashMap parm) {
		String adType = (String) parm.get("adType");
		// 从session中获取登录用户的信息
		HashMap userinfo = (HashMap) parm.get("user_session");
		String areaId = (String) userinfo.get("areaId");// 获取areaId
		String sql = "SELECT adinfo.*, adsa.stationId,adsa.stationName,adsa.areaName,adsa.apply FROM adinfo,(SELECT station_ad.adId,station_ad.apply,view_stationinfo.stationName,"
				+ "view_stationinfo.stationId,view_stationinfo.areaId,view_stationinfo.areaName from view_stationinfo,station_ad WHERE view_stationinfo.stationId = station_ad.stationId) AS adsa "
				+ "WHERE adinfo.adId = adsa.adId";
		if (!"".equals(adType) && !"null".equals(adType) && adType != null) {
			sql += " and adType = '" + adType + "'";
		}
		if (!"".equals(areaId) && !"null".equals(areaId) && areaId != null) {
			sql += " and adsa.areaId like '" + areaId + "%'";
		}
		return queryAdInfoPage(dbconn, parm, sql);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public boolean updateStation_Ad(DBConnection dbconn, HashMap parm) {
		String adId = (String) parm.get("adId");
		String stationId = (String) parm.get("stationId");
		String apply = (String) parm.get("apply");
		String publishDate = (String) parm.get("publishDate");
		ArrayList list = new ArrayList();
		String sql = "update station_ad set ";
		if (!"".equals(adId) && !"null".equals(adId) && adId != null && !"".equals(stationId) && !"null".equals(stationId)
				&& stationId != null) {
			if (!"".equals(apply) && !"null".equals(apply) && apply != null) {
				sql += " apply = '" + apply + "'";
			}
			if (!"".equals(publishDate) && !"null".equals(publishDate)
					&& publishDate != null) {
				sql += " and publishDate = '" + publishDate + "'";
			}
			sql += " where adId = '" + adId + "' and stationId = '" + stationId + "'";
		}
		list.add(sql);
		list.add("update adinfo set publishDate = '" + BaseUtil.getSysDate() + "' where adId = '" + adId + "'");
		return dbconn.doExecute(list);
	
	}

	public boolean updateAdinfo(DBConnection dbconn, String publish) {
		String sql = "update adinfo set ";
		if (!"".equals(publish) && !"null".equals(publish) && publish != null) {
			sql += " publish = '" + publish + "'";
		}
		return dbconn.doExecute(sql.toString());
	}

}
