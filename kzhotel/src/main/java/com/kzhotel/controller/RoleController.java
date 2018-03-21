package com.kzhotel.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.web.bind.annotation.ResponseBody;



import com.alibaba.fastjson.JSON;

import com.kzhotel.BLLI.IBllRole;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.BLLI.IBllUserGroup;
import com.kzhotel.BLLI.IBllUsergroupRole;
import com.kzhotel.join.usergrouproleJoin;
import com.kzhotel.per.resultLstRoleAndLstType;
import com.kzhotel.pojo.role;
import com.kzhotel.pojo.user;

import com.kzhotel.service.IUserService;
import com.pub.validation.ValidationStrComp;


@Controller
@RequestMapping("/role")
public class RoleController {
	//bll
	@Resource
	private IBllRole bllRole;
	@Resource
	private IBllUser bllUser;
	@Resource
	private IBllUserGroup bllUserGroup;
	@Resource
	private IBllUsergroupRole bllUserGroupRole;
	//service
	@Resource
	private IUserService userService;
	
	
	/**
	 * 新增角色
	 * @param request
	 * @param roleName
	 * @param remark
	 * @param typeCode
	 * @param sortCode
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			String roleName,/*角色名称*/
		    String remark,/*角色备注*/
		    int typeCode,/*分类*/
		    int sortCode/*排序*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addRole")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(typeCode) || !ValidationStrComp.checkNumber(sortCode)){
	    	return -201;
	    }
	    
	    if( !ValidationStrComp.checkStringName(roleName)){
	    	return -111;
	    }
	    
	    if(!ValidationStrComp.checkRemark(remark)){
	    	return -112;
	    }
		
	    String creator = clspubcontrollerfunc.strNowUnm(request);
		return this.bllRole.AddRole(roleName, remark, typeCode,sortCode, creator);
	}
	
	

	/**
	 * 编辑角色
	 * @param request
	 * @param roleId
	 * @param roleName
	 * @param remark
	 * @param typeCode
	 * @param sortCode
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			int roleId,/*id*/
			String roleName,/*角色名称*/
		    String remark,
		    int typeCode,/*分类*/
		    int sortCode/*排序*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editRole")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(roleId) || !ValidationStrComp.checkNumber(typeCode)||!ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(roleName)){
			return -111;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		return this.bllRole.EditRole(roleId, roleName, remark,typeCode,sortCode );
	}
	
	

	/**
	 * 删除角色
	 * @param request
	 * @param roleId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int roleId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteRole")){
			return -3333;
		}
	   
		if(!ValidationStrComp.checkNumber(roleId)){
			return -201;
		}
		return this.bllRole.DelRole(roleId);
	}

	/**
	 * 获取角色列表
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/listall", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listall(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getRoleList")){
            return "-3333";
		}
		List<role> lstpojo = this.bllRole.listAll();
		return JSON.toJSONString(lstpojo);
	}
	
	
	/**
	 * create:2017-06-05
	 * 根据userId获取所有拥有的角色
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getRolesByUserId",method=RequestMethod.POST)
	@ResponseBody
	public String getRolesByUserId(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getRolesByUserId")){
			return "-3333";
		}
		int userId = clspubcontrollerfunc.intNowUserId(request);
		user user = this.userService.getUserById(userId);
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		List<usergrouproleJoin> usergrouproleJoins = this.bllUserGroupRole.listByUsergroupId(hotelId, user.getUsergroupId().intValue());
		return JSON.toJSONString(usergrouproleJoins);
		
	}
	
	
	
	
	/**
	 * 权限部分
	 * @param request
	 * @param roleId
	 * @param permisionId
	 * @return
	 */

	/**
	 * 获取角色列表和角色类型列表
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/listwithtype", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listwithtype(HttpServletRequest request
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listwithtype")){
            return "-3333";
		}
		resultLstRoleAndLstType rlralt=new resultLstRoleAndLstType(); 
		rlralt.setLstroletype(this.bllRole.listAllRoletype()  );
		rlralt.setLstrole( this.bllRole.listAll());
		return JSON.toJSONString(rlralt);
	}
	
	
	
	
}
