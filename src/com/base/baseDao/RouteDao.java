package com.base.baseDao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

import com.base.dbconn.DBConnection;


public class RouteDao extends BaseDao{
	@SuppressWarnings({ "rawtypes" })
	public ArrayList<HashMap> queryRouteInfo(DBConnection dbcon,HashMap requestMap){
		String  routeId = (String) requestMap.get("routeId");
		String sql = "select * from view_station_route where routeId = '"+routeId+"' order by stationSort asc";
		return dbcon.doQueryData(sql);
	}
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public boolean addRouteinfo(DBConnection dbcon,HashMap requestMap){
		ArrayList list = new ArrayList(); 
		String  routeinfo = (String) requestMap.get("stationInfo");
		String routeName = (String) requestMap.get("routeName");
		String startTime = (String) requestMap.get("startTime");
		String endTime = (String) requestMap.get("endTime");
		String swipeCard = (String) requestMap.get("swipeCard");
		HashMap userinfo = (HashMap) requestMap.get("user_session");
		String areaId = (String) userinfo.get("areaId");
		String routeId = UUID.randomUUID().toString();
		String fieldParm = "";
		String valueParm = "";
		if(!"".equals(startTime) && startTime != null && !"null".equals(startTime)){
			fieldParm += ",startTime";
			valueParm += ",'"+startTime+"'";
		}
		if(!"".equals(endTime) && endTime != null && !"null".equals(endTime)){
			fieldParm += ",endTime";
			valueParm += ",'"+endTime+"'";
		}
		if(!"".equals(swipeCard) && swipeCard != null && !"null".equals(swipeCard)){
			fieldParm += ",swipeCard";
			valueParm += ",'"+swipeCard+"'";
		}
		list.add(" insert into routeinfo (routeId,routeName,areaId"+fieldParm+") values ('"+routeId+"','"+routeName+"','"+areaId+"',"+valueParm+")");
		if(routeinfo != null && !"".equals(routeinfo)&&!"null".equals(routeinfo)){
			String[] stations = routeinfo.split(";");
			if(stations != null && !"".equals(stations)&&!"null".equals(stations)){
				for(int i = 0 ; i < stations.length;i++){
					String[] stationinfo = stations[i].split(",");
					list.add("insert into station_route (stationId,routeId,stationSort) values('"+stationinfo[0]+"','"+routeId+"','"+stationinfo[1]+"')");
				}
			}
		}
		return dbcon.doExecute(list);
	}
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public boolean editRouteinfo(DBConnection dbcon,HashMap requestMap){
		String  routeId = (String) requestMap.get("routeId");
		ArrayList list = new ArrayList(); 
		String  routeinfo = (String) requestMap.get("stationInfo");
		String routeName = (String) requestMap.get("routeName");
		String startTime = (String) requestMap.get("startTime");
		String endTime = (String) requestMap.get("endTime");
		String swipeCard = (String) requestMap.get("swipeCard");
		list.add(0, "delete from station_route where routeId = '"+routeId+"'");
		String sql = "update routeinfo set routeName = '"+routeName+"' ";
		if(!"".equals(startTime) && startTime != null && !"null".equals(startTime)){
			sql+=",startTime = '"+startTime+"'" ;
		}
		if(!"".equals(endTime) && endTime != null && !"null".equals(endTime)){
			sql+=",endTime = '"+endTime+"'" ;
		}
		if(!"".equals(swipeCard) && swipeCard != null && !"null".equals(swipeCard)){
			sql+=",swipeCard = '"+swipeCard+"'" ;
		}
		sql+= " where routeId = '"+routeId+"'";
		list.add(sql);
		if(routeinfo != null && !"".equals(routeinfo)&&!"null".equals(routeinfo)){
			String[] stations = routeinfo.split(";");
			if(stations != null && !"".equals(stations)&&!"null".equals(stations)){
				for(int i = 0 ; i < stations.length;i++){
					String[] stationinfo = stations[i].split(",");
					list.add("insert into station_route (stationId,routeId,stationSort) values('"+stationinfo[0]+"','"+routeId+"','"+stationinfo[1]+"')");
				}
			}
		}		
		return dbcon.doExecute(list);
	}
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public boolean delRoute(DBConnection dbcon,HashMap requestMap){
		ArrayList list = new ArrayList();
		String  routeId = (String) requestMap.get("routeId");
		list.add(0, "delete from station_route where routeId = '"+routeId+"'");
		list.add(1, "delete from routeinfo where routeId = '"+routeId+"'");
		return dbcon.doExecute(list);
	}
}
