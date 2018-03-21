package com.kzhotel.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.kzhotel.per.ppmUser;

public class clspubcontrollerfunc {
	
	 /**
	 * 设置cookie
	 * @param response
	 * @param name  cookie名字
	 * @param value cookie值
	 * @param maxAge cookie生命周期  以秒为单位
	 */
	public static void addCookie(HttpServletRequest request,HttpServletResponse response,String name,String value,int maxAge){
		
	    Cookie cookie = new Cookie(name,value);
	    cookie.setPath("/");
	    if(maxAge>0)  cookie.setMaxAge(maxAge);
	    response.addCookie(cookie);
	}
	
	
	public static void delCookie(HttpServletRequest request ,HttpServletResponse response,String name){
		Cookie[] cookies = request.getCookies();
		
		for(Cookie cookie : cookies){
			if(cookie.getName().equals(name)){
				Cookie c = new Cookie(name, ""); 
				c.setMaxAge(0);
				c.setPath("/");
				response.addCookie(c);
			}
			
		}
	}



	/**
	 * 根据名字获取cookie
	 * @param request
	 * @param name cookie名字
	 * @return
	 */
	public static Cookie getCookieByName(HttpServletRequest request,String name){
	    Map<String,Cookie> cookieMap = ReadCookieMap(request);
	    if(cookieMap.containsKey(name)){
	        Cookie cookie = (Cookie)cookieMap.get(name);
	        return cookie;
	    }else{
	        return null;
	    }   
	}
	
	/**
	 * 将cookie封装到Map里面
	 * @param request
	 * @return
	 */
	public static Map<String,Cookie> ReadCookieMap(HttpServletRequest request){  
	    Map<String,Cookie> cookieMap = new HashMap<String,Cookie>();
	    Cookie[] cookies = request.getCookies();
	    if(null!=cookies){
	        for(Cookie cookie : cookies){
	            cookieMap.put(cookie.getName(), cookie);
	        }
	    }
	    return cookieMap;
	}
	
	public static ppmUser ppmUInit(String struname,String strrealpwd,String strvalidate,String strerrinfo)
	{
		ppmUser ppmu=new ppmUser();
		ppmu.setStrusername(struname);
		ppmu.setStrpassword(strrealpwd);
		ppmu.setStrvalidate(strvalidate);
		ppmu.setStrerrinfo(strerrinfo);

		return ppmu;
		
	}
	
	public static int intNowUserId(HttpServletRequest request)
	{
		int intuid=0;
		 HttpSession session = request.getSession();
		 
		 if(session.getAttribute("uid")!=null)
		 {
		  String struid=session.getAttribute("uid").toString().toLowerCase();
		  if(struid!=null)
		  {
		   intuid=Integer.parseInt(struid);
		  }
		
		  }	
		 
		return intuid;
	}
	
	public static int intNowSuccessionId(HttpServletRequest request)
	{
		int intuid=0;
		 HttpSession session = request.getSession();
		 
		 if(session.getAttribute("successionId")!=null)
		 {
		  String struid=session.getAttribute("successionId").toString().toLowerCase();
		  if(struid!=null)
		  {
		   intuid=Integer.parseInt(struid);
		  }
		
		  }	
		 
		return intuid;
	}
	
	
	public static int intNowHotelId(HttpServletRequest request)
	{
		int intuid=0;
		 HttpSession session = request.getSession();
		 
		 if(session.getAttribute("hid")!=null)
		 {
		  String struid=session.getAttribute("hid").toString().toLowerCase();
		  if(struid!=null)
		  {
		   intuid=Integer.parseInt(struid);
		  }
		
		  }	
		 
		return intuid;
	}
	
	public static String strNowUnm(HttpServletRequest request)
	{
		 String strnum="";
		 HttpSession session = request.getSession();
		 
		 if(session.getAttribute("unm")!=null)
		 {
		   strnum=session.getAttribute("unm").toString();
		 
		  }	
		 
		return strnum;
	}
	
	public static String strPubError()
	{
		return "{error:error}";
	}
	
	public static String strPubError(String strerrinfo)
	{
		return "{error:"+strerrinfo+"}";
	}
	
	public static String strPubError(int interrcode)
	{
		return "{error:"+String.valueOf(interrcode)+"}";
	}
	
	public static String strPubInfo()
	{
		return  "{info:info}";
	}
	
	public static String strPubInfo(String strinfo)
	{
	return "{info:"+strinfo+"}";
	}
	
	public static String strPubInfo(int intinfo)
	{
		return "{info:"+String.valueOf(intinfo)+"}";
	}
		
}
