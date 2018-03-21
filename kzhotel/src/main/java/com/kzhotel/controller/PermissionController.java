package com.kzhotel.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllPermission;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.pojo.permision;
import com.pub.validation.ValidationStrComp;




@Controller
@RequestMapping("/permission")
public class PermissionController {
	@Resource
	private IBllPermission bllPermision;

	@Resource
	private IBllUser bllUser;
	
	/**
	 * 新增权限
	 * @param request
	 * @param permisionName
	 * @param permisionCode
	 * @param remark
	 * @param sortCode
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			 String permisionName,/*权限名称*/
		     String permisionCode,/*权限code*/
		     String remark,/*备注*/
		     int sortCode /*顺序*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addPermission")){
			return -3333;
		}
		if(!ValidationStrComp.checkStringName(permisionCode) || !ValidationStrComp.checkStringName(permisionName)){
			return -111;
		}
		if(!ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		return this.bllPermision.AddPermision( permisionName, permisionCode, remark, sortCode);
	}
	
	

	/**
	 * 编辑权限
	 * @param request
	 * @param permisionId
	 * @param permisionName
	 * @param permisionCode
	 * @param remark
	 * @param sortCode
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			long permisionId,/*权限id*/
		    String permisionName,/*权限名称*/
		    String permisionCode,/*权限code*/
		    String remark,/*备注*/
		    int sortCode /*顺序*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editPermission")){
			return -3333;
		}
		if(!ValidationStrComp.checkStringName(permisionCode) || !ValidationStrComp.checkStringName(permisionName)){
			return -111;
		}
		if(!ValidationStrComp.checkNumber(sortCode) || !ValidationStrComp.checkNumber(permisionId)){
			return -201;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		return this.bllPermision.EditPermision(permisionId, permisionName, permisionCode, remark, sortCode);
	}


	/**
	 * 删除权限
	 * @param request
	 * @param permisionId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int permisionId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deletePermission")){
			return -3333;
		}
	    if(!ValidationStrComp.checkNumber(Long.valueOf(permisionId))){
	    	return -201;
	    }
	    return this.bllPermision.DelPermision(permisionId);
	}

	/**
	 * 获取权限列表
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/listall", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listall(HttpServletRequest request
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getPermissionList")){
            return "-3333";
		}
		List<permision> lstpojo = this.bllPermision.listAll();
		return JSON.toJSONString(lstpojo);
	}
	
	
	
}
