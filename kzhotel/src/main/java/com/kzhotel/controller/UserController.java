package com.kzhotel.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.ibatis.io.Resources;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.PubJavadill.ClsLstTran;
import com.PubJavadill.CoreMD5;
import com.PubJavadill.java.ClsHttpVisit;
import com.alibaba.fastjson.JSON;
import com.eapor.mongo.MongoDBConn;
import com.kzhotel.BLL.StaticPermission;
import com.kzhotel.BLLI.IBllPermission;
import com.kzhotel.BLLI.IBllRole;
import com.kzhotel.BLLI.IBllShift;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.join.userJoin;
import com.kzhotel.model.extend.SuccessionChild;
import com.kzhotel.pojo.hotel;
import com.kzhotel.pojo.succession;
import com.kzhotel.pojo.user;
import com.kzhotel.service.IHotelService;
import com.kzhotel.view.VReturn;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.ClassTransfer;
import me.persevere.util.MongoHandler;

@Controller
@RequestMapping("/user")
public class UserController {

	@Resource
	private IBllUser bllUser;
	@Resource
	private IBllShift bllShift;
	@Resource
	private IBllPermission bllPermission;
	@Resource
	private IBllRole bllRole;
	@Resource
	private IHotelService hotelService;
	
	public static int serverNum = 0;
	
	private void initMongo(String uri){
		if(uri.contains("eapor.com")){
			serverNum = 1;
    		MongoDBConn.mongoDatabaseInstance(1);
    	}
    	
    	if(uri.contains("test.kezhu.net")){
    		serverNum = 2;
    		MongoDBConn.mongoDatabaseInstance(2);
    	}
    	
    	if(uri.contains("localhost")){
    		serverNum = 3;
    		MongoDBConn.mongoDatabaseInstance(1);
    	}
	}
	
	/**
	 * 删除用户
	 * @param request
	 * @param intduid
	 * @return
	 */
	@RequestMapping(value="/dhuser", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String dhuser(HttpServletRequest request,
			int intduid
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteUser")){
            return "-3333";
		}
		int intresult = 0;
		int intuid=clspubcontrollerfunc.intNowUserId(request);
		if(this.bllUser.BIsUserType(intuid, "hotel_main") && intduid>0){
			intresult =this.bllUser.DelUserById(intduid);
		}
		return String.valueOf(intresult);
	}
	
	/**
	 * 重置密码
	 * @param request
	 * @param intouid
	 * @param strPwd
	 * @return
	 */
	@RequestMapping(value="/Repassword", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int Repassword(HttpServletRequest request,int intouid,String strPwd){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editUserPassword")){
			return -3333;
		}
		if(!ValidationStrComp.checkStringName(strPwd)){
			return -111;
		}
		int intresult = 0;
		int intuid=clspubcontrollerfunc.intNowUserId(request);
		if(this.bllUser.BIsUserType(intuid, "hotel_main") && intouid>0  ){
			user pusernew=new user();
			pusernew.setUserId((long)intouid);
			pusernew.setPassword(strPwd);
			intresult =this.bllUser.Repassword(pusernew);
		}
		return intresult;
	}
	
	/**
	 * 修改密码
	 * @param request
	 * @param oldpassword
	 * @param newpassword
	 * @param userId
	 * @return
	 */
	@RequestMapping("/changePassword")
	@ResponseBody
	public int changePassword(HttpServletRequest request,
			String oldPassword,/*旧密码*/
			String newPassword,/*新密码*/
			String userName
			){
		if(!ValidationStrComp.checkStringName(oldPassword) || !ValidationStrComp.checkStringName(newPassword)){
			return -111;
		}
		return this.bllUser.changePassword(userName, oldPassword, newPassword);
	}
	
	/**
	 * 新增用户
	 * @param request
	 * @param usergroupId
	 * @param username
	 * @param password
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			Integer usergroupId,
		    String username,
		    String password,
		    String kezhuUserName
		    ){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addUser")){
			return -3333;
		}
		Long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(usergroupId)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(username) || !ValidationStrComp.checkStringName(password)){
			return -111;
		}
		return bllUser.addUser(usergroupId, username, password, hotelId, kezhuUserName);
	}
	
	
	/**
	 * 用户列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param maxUserId
	 * @param usergroupId
	 * @param username
	 * @return
	 */
	@RequestMapping(value="/ujlist", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String ujlist(HttpServletRequest request,
			int offset,
			int limit,
			int maxUserId,
			int usergroupId,
			String username
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getUserList")){
            return "-3333";
		}
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(usergroupId) ||!ValidationStrComp.checkNumber(offset) || 
				!ValidationStrComp.checkNumber(limit) ||!ValidationStrComp.checkNumber(maxUserId)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(username)){
			return "-111";
		}
		
		List<userJoin> lstuj  = this.bllUser.userPageList(offset,limit,maxUserId,hotelId,usergroupId,username);
		return JSON.toJSONString(lstuj);
	}
	
	@RequestMapping("/exit")
	@ResponseBody
	public String exit(HttpServletRequest request,HttpServletResponse response){
		request.getSession().invalidate();
		VReturn<String> vReturn = new VReturn<>();
		vReturn.setErrCode(0);
		vReturn.setData(null);
		return vReturn.toString();
		
	}
	
	/**
	 * create:2017-02-27
	 * 更新session
	 * @author wyx
	 * @param request
	 * @return
	 */
	@RequestMapping("/refreshSession")
	@ResponseBody
	public int refreshSession(HttpServletRequest request){
		return 1;
	}
	
	
	/**
	 * 绑定客主商家账号
	 * @param request
	 * @param userId
	 * @param kezhuUserName
	 * @return
	 */
	@RequestMapping(value = {"/bindKezhuShop"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int bindKezhuShop(HttpServletRequest request,
			long userId,
			String kezhuUserName
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "bindKezhuShop")){
			return -3333;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllUser.bindKezhuShop(userId, kezhuUserName, hotelId);
		
	}
	
	/**
	 * 更换用户组
	 * @param userId
	 * @param usergroupId
	 * @return
	 */
	@RequestMapping("/editUserGroup")
	@ResponseBody
	public String editUserGroup(HttpServletRequest request,
			long userId,
			long usergroupId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "editUserGroup")){
			return "-3333";
		}
		int result = this.bllUser.editUserGroup(userId, usergroupId);
		VReturn<String> vReturn = new VReturn<>();
		if(result > 0){
			vReturn.setErrCode(0);
			vReturn.setData(null);
		}else{
			vReturn.setErrCode(-6);
			vReturn.setData(null);
		}
		return vReturn.toString();
	}
	
	
	
	
	@RequestMapping("/newlogin")
	@ResponseBody
	public String newlogin(HttpServletRequest request,String username, String password, String validateCode){
		HttpSession session = request.getSession();
		String code = (String)session.getAttribute("code");
		VReturn<Map<String, Object>> vReturn = new VReturn<>();
		if(code == null || !code.toUpperCase().equals(validateCode.toUpperCase())){
			//验证码错误
			vReturn.setErrCode(-1);
			vReturn.setData(null);
			return vReturn.toString();
		}
		
		if(username == null || "".equals(username) || password == null || "".equals(password)){
			//账号或密码不能为空
			vReturn.setErrCode(-2);
			vReturn.setData(null);
			return vReturn.toString();
		}
		
		//数据库登录记录
		//ip
		String ip = ClsHttpVisit.getIpAddr(request);
		//路径
		String path = request.getContextPath();
		user user = this.bllUser.login2(username, password, ip, path, "驿宝登录");
		if(user == null){
			//账号或密码错误
			vReturn.setErrCode(-3);
			vReturn.setData(null);
			return vReturn.toString();
		}
		
		String uri = request.getRequestURL().toString();
		initMongo(uri);
		//验证jdbc
		Properties pro;
		try {
			pro = Resources.getResourceAsProperties("jdbc.properties");
			String url = pro.getProperty("url");
	    	if(uri.contains("eapor.com") && !url.contains("rm-javadill.mysql.rds.aliyuncs.com:3306")){
	    		vReturn.setErrCode(-4);
	    		vReturn.setData(null);
	    		return vReturn.toString();
	    	}
		} catch (Exception e) {
			vReturn.setErrCode(-4);
    		vReturn.setData(null);
    		return vReturn.toString();
		}
		
		//mongo做登录记录
		MongoHandler.updateMongo("loginLog", "userId", user.getUserId(), "isCollection", "false");
		Map<String, String> loginLogMap = new HashMap<>();
		loginLogMap.put("username", username);
		loginLogMap.put("ip", ip);
		loginLogMap.put("path", path);
		loginLogMap.put("hotelId", user.getHotelId().toString());
		loginLogMap.put("userId", user.getUserId().toString());
		loginLogMap.put("loginMethod", "login");
		//没有使用getProtocol的原因是，getScheme返回当前协议链接，而getProtocol返回的是当前协议
		loginLogMap.put("protocol", request.getScheme());
		loginLogMap.put("serverPort", String.valueOf(request.getServerPort()));
		loginLogMap.put("serverName", request.getServerName());
		String mdCode = CoreMD5.strMD5Encode16(String.valueOf(user.getUserId()+user.getHotelId()+System.currentTimeMillis()));
		loginLogMap.put("mdCode", mdCode);
		loginLogMap.put("isCollection", "true");
		MongoHandler.insertMongoByMaps("loginLog", loginLogMap);
		
		session.setAttribute("mdCode", mdCode);
		session.setMaxInactiveInterval(30*60); 
	    session.setAttribute("uid",user.getUserId());
	    session.setAttribute("unm",user.getUsername());
	    session.setAttribute("hid",user.getHotelId());
	    
	    session.setAttribute("userinfo", user);
	    session.setAttribute("roleList", JSON.toJSONString(ClsLstTran.LstIntFromSpilt(user.getRoleList(),",")));
	    //静态角色map
	    this.bllRole.getRoleMap();
	    session.setAttribute("roleMap", JSON.toJSONString(StaticPermission.roleMap));
	    
	    //静态权限map
	    this.bllPermission.getPermissionMap();
	    //静态权限列表map
	    List<Integer> lstPermissionList = ClsLstTran.LstIntFromSpilt(user.getPermissionList(),",");
    	StaticPermission.permissionListMap.put(user.getUserId(), lstPermissionList);
    	Map<String, String> map2 = new HashMap<>();
    	map2.put(user.getUserId().toString(), JSON.toJSONString(lstPermissionList));
    	MongoHandler.insertMongoByMaps("loginPermission", map2);
    	//hotelid
	    int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		hotel hotel = this.hotelService.getHotelById(hotelId);
		session.setAttribute("hotelName", hotel.getHotelName());
	    //使用者
		int userId = clspubcontrollerfunc.intNowUserId(request);
		succession succession = this.bllShift.getActiveSuccession((long)hotelId, (long)userId);
		SuccessionChild sc = new SuccessionChild();
		if(succession != null){
			ClassTransfer.parentToChild(succession, sc);
			session.setAttribute("succession", sc);
			session.setAttribute("successionId", sc.getSuccessionId());
		}else{
			session.setAttribute("succession", null);
			session.setAttribute("successionId", 0);
		}
		Map<String, Object> map = new HashMap<>();
		map.put("user", user);
		map.put("hotel", hotel);
		vReturn.setErrCode(0);
		vReturn.setData(map);
		return vReturn.toString();
	}
	
	
	
	@RequestMapping("/newAutoLogin")
	@ResponseBody
	public String newAutoLogin(HttpServletRequest request,
			String loadkey
			){
		HttpSession session = request.getSession();
		user user = this.bllUser.getUserByLoadKey(loadkey);
		VReturn<Map<String, Object>> vReturn = new VReturn<>();
		if(user == null){
			//登录信息过期
			vReturn.setErrCode(-5);
			vReturn.setData(null);
			return vReturn.toString();
		}
		String uri = request.getRequestURL().toString();
		initMongo(uri);
		//验证jdbc
		Properties pro;
		try {
			pro = Resources.getResourceAsProperties("jdbc.properties");
			String url = pro.getProperty("url");
	    	if(uri.contains("eapor.com") && !url.contains("rm-javadill.mysql.rds.aliyuncs.com:3306")){
	    		vReturn.setErrCode(-4);
	    		vReturn.setData(null);
	    		return vReturn.toString();
	    	}
		} catch (Exception e) {
			vReturn.setErrCode(-4);
    		vReturn.setData(null);
    		return vReturn.toString();
		}
		//ip
		String ip = ClsHttpVisit.getIpAddr(request);
		//路径
		String path = request.getContextPath();
		//mongo做登录记录
		MongoHandler.updateMongo("loginLog", "userId", user.getUserId(), "isCollection", "false");
		Map<String, String> loginLogMap = new HashMap<>();
		loginLogMap.put("username", user.getUsername());
		loginLogMap.put("ip", ip);
		loginLogMap.put("path", path);
		loginLogMap.put("hotelId", user.getHotelId().toString());
		loginLogMap.put("userId", user.getUserId().toString());
		loginLogMap.put("loginMethod", "autoLogin");
		//没有使用getProtocol的原因是，getScheme返回当前协议链接，而getProtocol返回的是当前协议
		loginLogMap.put("protocol", request.getScheme());
		loginLogMap.put("serverPort", String.valueOf(request.getServerPort()));
		loginLogMap.put("serverName", request.getServerName());
		String mdCode = CoreMD5.strMD5Encode16(String.valueOf(user.getUserId()+user.getHotelId()+System.currentTimeMillis()));
		loginLogMap.put("mdCode", mdCode);
		loginLogMap.put("isCollection", "true");
		MongoHandler.insertMongoByMaps("loginLog", loginLogMap);
		
		session.setAttribute("mdCode", mdCode);
		session.setMaxInactiveInterval(30*60); 
	    session.setAttribute("uid",user.getUserId());
	    session.setAttribute("unm",user.getUsername());
	    session.setAttribute("hid",user.getHotelId());
	    
	    session.setAttribute("userinfo", user);
	    session.setAttribute("roleList", JSON.toJSONString(ClsLstTran.LstIntFromSpilt(user.getRoleList(),",")));
	    //静态角色map
	    this.bllRole.getRoleMap();
	    session.setAttribute("roleMap", JSON.toJSONString(StaticPermission.roleMap));
	    
	    //静态权限map
	    this.bllPermission.getPermissionMap();
	    //静态权限列表map
	    List<Integer> lstPermissionList = ClsLstTran.LstIntFromSpilt(user.getPermissionList(),",");
    	StaticPermission.permissionListMap.put(user.getUserId(), lstPermissionList);
	    //hotelid
	    int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		hotel hotel = this.hotelService.getHotelById(hotelId);
		session.setAttribute("hotelName", hotel.getHotelName());
	    //使用者
		int userId = clspubcontrollerfunc.intNowUserId(request);
		succession succession = this.bllShift.getActiveSuccession((long)hotelId, (long)userId);
		SuccessionChild sc = new SuccessionChild();
		if(succession != null){
			ClassTransfer.parentToChild(succession, sc);
			session.setAttribute("succession", sc);
			session.setAttribute("successionId", sc.getSuccessionId());
		}else{
			session.setAttribute("succession", null);
			session.setAttribute("successionId", 0);
		}
		Map<String, Object> map = new HashMap<>();
		map.put("user", user);
		map.put("hotel", hotel);
		vReturn.setErrCode(0);
		vReturn.setData(map);
		return vReturn.toString();
	}

}
