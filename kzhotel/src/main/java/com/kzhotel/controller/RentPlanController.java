package com.kzhotel.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.alibaba.fastjson.JSON;

import com.kzhotel.BLLI.IBllRentPlan;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.pojo.rentplan;
import com.pub.validation.ValidationStrComp;

@Controller
@RequestMapping("/rentplan")
public class RentPlanController {
	@Resource
	private IBllRentPlan bllRentPlan;
	@Resource
	private IBllUser bllUser;


	/**
	 * 新增房价方案
	 * @param request
	 * @param rentplanName
	 * @param remark
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			String rentplanName,
		    String remark
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addRentPlan")){
			return -3333;
		}
		int createUserId=clspubcontrollerfunc.intNowUserId(request);
		String createUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkStringName(rentplanName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		return this.bllRentPlan.AddRentPlan(rentplanName, hotelId, createUserId, createUsername, remark);
	}
	
	
	/**
	 * 编辑房价方案
	 * @param request
	 * @param rentplanId
	 * @param rentplanName
	 * @param remark
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			long rentplanId,/*id*/
			String rentplanName,/*方案名称*/
		    String remark
			){

		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editRentPlan")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(rentplanName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		if(!ValidationStrComp.checkNumber(rentplanId)){
			return -201;
		}
		
		int modifyUserId=clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername=clspubcontrollerfunc.strNowUnm(request); //创建人
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllRentPlan.EditRentPlan(rentplanId, rentplanName, hotelId, modifyUserId, modifyUsername, remark);
	}
	/**
	 * 删除房价方案
	 * @param request
	 * @param rentplanId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int rentplanId
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteRentPlan")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(Long.valueOf(rentplanId))){
			return -201;
		}
		return this.bllRentPlan.DelRentPlan(rentplanId);
	}
	
	/**
	 * 房价方案数量
	 * @param request
	 * @param rentplanName
	 * @return
	 */
	@RequestMapping(value="/pgcount", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int pgcount(HttpServletRequest request,
	    	String rentplanName/*按方案名称模糊查询*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getRentPlanCount")){
			return -3333;
		}
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkStringName(rentplanName)){
			return -111;
		}
		return this.bllRentPlan.getRentPlanCount(hotelId, rentplanName);
	}
	
	
	/**
	 * 房价方案列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param rentplanName
	 * @return
	 */
	@RequestMapping(value="/pglist", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String pglist(HttpServletRequest request,
			int offset,/*分页offset*/
    		int limit,/*分页limit*/
    		String rentplanName /*按方案名称模糊查询*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getRentPlanList")){
			return "-3333";
		}
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(offset) ||!ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(rentplanName)){
			return "-111";
		}
		List<rentplan> lstpojo = this.bllRentPlan.listRentPlanPage(offset, limit, hotelId, rentplanName);
		return JSON.toJSONString(lstpojo);
	}
	
	
}
