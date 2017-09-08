package com.base.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

public class ActionUtil {
	
    public static String hashMapToJson(HashMap _hm) {
		String str = "{";
		for (Iterator it = _hm.entrySet().iterator(); it.hasNext();) {
			Entry entry = (Entry) it.next();
			str += "\"" + entry.getKey() + "\":";
			
			Object valueObj = entry.getValue();
			if (null == valueObj) {
				str += "\"\",";
			} else if (valueObj instanceof String) {
				String value = ((String)valueObj).trim();
				if(value.startsWith("#")&&value.length()>1){
					str += value.substring(1, value.length()) + ",";
				}else if(value.equals("#")){
					str += "\"\",";
				}else{
					str += "\"" + value + "\",";
				}
			} else {
				str += "\"--\",";
			}
		}
		str = str.substring(0, str.lastIndexOf(","));
		str += "}";
		return str;
	}

	public static String listToJson(List _list) {
		StringBuffer sb = new StringBuffer();
		sb.append("[");
		for (int i = 0; i < _list.size(); i++) {
			if (i != 0){
				sb.append(",");
			}
			sb.append(hashMapToJson((HashMap) _list.get(i)));    
		}
		sb.append("]");
		return sb.toString();
	}  
    
	public static void main(String[] args) {

	}
}
