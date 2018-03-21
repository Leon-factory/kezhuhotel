package com.pub.Project;

import org.json.JSONException;
import org.json.JSONObject;

public class Countpatameter {
//获取服务器返回的个数以及页数参数
public static String Countnumber(String string){
	try {
		JSONObject json=new JSONObject(string);
	String strcountnumber=json.get("info").toString();
	return strcountnumber;
	} catch (JSONException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	return null;
	
}
}
