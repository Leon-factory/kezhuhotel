package com.kzhotel.controller;

import java.util.List;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.BLLI.IBllUserGroup;
import com.kzhotel.BLLI.IBllUsergroupRole;
import com.kzhotel.join.usergrouproleJoin;
import com.kzhotel.pojo.usergroup;
import com.pub.validation.ValidationStrComp;

@Controller
@RequestMapping("/ugrole")
public class UserGroupController {
	@Resource
	private IBllUserGroup bllUserGroup;
	@Resource
	private IBllUser bllUser;
	@Resource
	private IBllUsergroupRole bllUsergroupRole;
	
	
	/**
	 * 增加用户组对应的角色
	 * @param request
	 * @param usergroupId
	 * @param roleId
	 * @return
	 */
	@RequestMapping(value="/addug", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int addug(HttpServletRequest request,
			long usergroupId,/*用户组id*/
		    long roleId/*角色id*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addUserGroupRole")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(usergroupId) || !ValidationStrComp.checkNumber(roleId)){
			return -201;
		}
	    String creator=clspubcontrollerfunc.strNowUnm(request);
	    /*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllUsergroupRole.AddUsergroupRole(usergroupId, roleId, hotelId, creator);
	}
		
	 /**
	  * 获取用户组所对应的角色列表
	  * @param request
	  * @param usergroupId
	  * @return
	  */
	@RequestMapping(value="/lstbyug", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String lstbyug(HttpServletRequest request,
			int usergroupId	
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "lstbyug")){
            return "-3333";
		}
		if(!ValidationStrComp.checkNumber(usergroupId)){
			return "-201";
		}
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		List<usergrouproleJoin> lstpojo = this.bllUsergroupRole.listByUsergroupId(hotelId, usergroupId);
		return JSON.toJSONString(lstpojo);
	}
			
			
	/**
	 * 新增用户组
	 * @param request
	 * @param usergroupName
	 * @param remark
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			String usergroupName,/*用户组名称*/
			String remark/*用户组备注*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addUserGroup")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(usergroupName)){
			return -111;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
	    String creator=clspubcontrollerfunc.strNowUnm(request);
	    /*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllUserGroup.AddUsergroup(usergroupName, remark, hotelId, creator);
	}
	
	/**
	 * 编辑用户组
	 * @param request
	 * @param usergroupId
	 * @param usergroupName
	 * @param remark
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			int usergroupId,
			String usergroupName,/*组名称*/
			String remark
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editUserGroup")){
			return -3333;
		}
		if( !ValidationStrComp.checkNumber(usergroupId)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(usergroupName)){
			return -111;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllUserGroup.EditUsergroup(usergroupId, usergroupName, remark, hotelId);
	}
	
	/**
	 * 删除用户组
	 * @param request
	 * @param usergroupId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int usergroupId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteUserGroup")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(usergroupId)){
			return -201;
		}
		return this.bllUserGroup.DelUsergroup(usergroupId);
	}

	/**
	 * 用户组列表
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/listall", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listall(HttpServletRequest request
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getUserGroupList")){
            return "-3333";
		}
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		List<usergroup> lstpojo = this.bllUserGroup.listByHotelId(hotelId);
		return JSON.toJSONString(lstpojo);
	}
	
	
	/**
	 * 按照角色roleId反查用户组usergroup列表
	 * @param roleId
	 * @return
	 */
	@RequestMapping(value="/selectUsergroupByRoleId",method=RequestMethod.POST)
	@ResponseBody
	public String selectUsergroupByRoleId(HttpServletRequest request,
			int roleId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "selectUsergroupByRoleId")){
            return "-3333";
		}
		if(!ValidationStrComp.checkNumber(roleId)){
			return "-201";
		}
		long hotelId =(long)clspubcontrollerfunc.intNowHotelId(request);
		List<usergroup> usergroups = this.bllUserGroup.selectUsergroupByRoleId(hotelId,roleId);
		return JSON.toJSONString(usergroups);
	}
	
	
	/**
	 * 2016-12-26
	 * 根据角色id role_id,用户组id usergroup_id 删除角色用户组对应。
	 * @param usergroupId
	 * @param roleId
	 * @return
	 */
	@RequestMapping("/deleteByRoleIdAndUsergroupId")
	@ResponseBody
	public int deleteByRoleIdAndUsergroupId(HttpServletRequest request,
			int usergroupId,
			int roleId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteByRoleIdAndUsergroupId")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(usergroupId) || !ValidationStrComp.checkNumber(roleId)){
			return -201;
		}
		long hotelId =(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllUsergroupRole.deleteByRoleIdAndUsergroupId(hotelId,usergroupId, roleId);
	}
	
}
