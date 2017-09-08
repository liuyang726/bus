package com.base.baseDao;

import java.util.ArrayList;
import java.util.HashMap;

import com.base.dbconn.DBConnection;

public interface DaoInterface {
	
	@SuppressWarnings("rawtypes")
	public ArrayList<HashMap> queryAll(DBConnection dbconn, HashMap parm);
	@SuppressWarnings("rawtypes")
	public HashMap queryPage(DBConnection dbconn, HashMap parm);
	@SuppressWarnings("rawtypes")
	public ArrayList<HashMap> queryId(DBConnection dbconn, HashMap parm);
	@SuppressWarnings("rawtypes")
	public boolean insert(DBConnection dbconn, HashMap parm);
	@SuppressWarnings("rawtypes")
	public boolean update(DBConnection dbconn, HashMap parm);
	@SuppressWarnings("rawtypes")
	public boolean delete(DBConnection dbconn, HashMap parm);
	

}
