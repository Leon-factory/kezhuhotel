package com.kzhotel.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllServiceitem;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.join.serviceitemJoin;
import com.pub.validation.ValidationStrComp;





@Controller
@RequestMapping("/Serviceitem")
public class ServiceitemController {
	@Resource
	private IBllServiceitem bllServiceitem;
	@Resource
	private IBllUser bllUser;


	/**
	 * 新增服务
	 * @param request
	 * @param serviceTypeId
	 * @param serviceItemName
	 * @param price
	 * @param sortCode
	 * @param remark
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			long serviceTypeId,
		    String serviceItemName,
		    int price,
		    int sortCode,
		    String remark
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addService")){
            return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(serviceTypeId) || !ValidationStrComp.checkNumber(price) || !ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(serviceItemName)){
			return -111;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		String creator=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllServiceitem.AddServiceitem(serviceTypeId, 
				serviceItemName, price, sortCode, remark, hotelId, creator);
	}
	
	/**
	 * 编辑服务
	 * @param request
	 * @param serviceItemId
	 * @param serviceTypeId
	 * @param serviceItemName
	 * @param price
	 * @param sortCode
	 * @param remark
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			long serviceItemId,
			long serviceTypeId,
		    String serviceItemName,
		    int price,
		    int sortCode,
		    String remark
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editService")){
            return -3333;
		}
		if( !ValidationStrComp.checkNumber(serviceTypeId) ||!ValidationStrComp.checkNumber(serviceItemId) || !ValidationStrComp.checkNumber(price) ||
				!ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(serviceItemName)){
			return -111;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllServiceitem.EditServiceitem(serviceItemId, serviceTypeId, 
				serviceItemName, price, sortCode, remark, hotelId);
	}
	/**
	 * 删除服务
	 * @param request
	 * @param serviceItemId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int serviceItemId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteService")){
            return -3333;
		}
		if(!ValidationStrComp.checkNumber(Long.valueOf(serviceItemId))){
			return -201;
		}
		return this.bllServiceitem.DelServiceitemById(serviceItemId);
	}
	
	/**
	 * 服务数量
	 * @param request
	 * @param serviceItemName
	 * @param serviceTypeId
	 * @return
	 */
	@RequestMapping(value="/getServiceitemCount", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int getServiceitemCount(HttpServletRequest request,
			String serviceItemName,
			int serviceTypeId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getServiceitemCount")){
            return -3333;
		}
		if(!ValidationStrComp.checkNumber(serviceTypeId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(serviceItemName)){
			return -111;
		}
		
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		return this.bllServiceitem.getServiceitemCount(hotelId, serviceItemName, serviceTypeId);
	}
	/**
	 * 服务列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param serviceItemName
	 * @param serviceTypeId
	 * @return
	 */
	@RequestMapping(value="/listServiceitemPage", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listServiceitemPage(HttpServletRequest request,
			int offset,
			int limit,
			String serviceItemName,
			int serviceTypeId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listServiceitemPage")){
            return "-3333";
		}
		if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(Long.valueOf(limit))||!ValidationStrComp.checkNumber(Long.valueOf(serviceTypeId))){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(serviceItemName)){
			return "-111";
		}
		
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		List<serviceitemJoin> lstpf = this.bllServiceitem.listServiceitemPage(offset, limit,hotelId, serviceItemName, serviceTypeId);
		return JSON.toJSONString(lstpf);
	}
	
}
