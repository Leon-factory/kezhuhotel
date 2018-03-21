package com.kzhotel.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllServicetype;
import com.kzhotel.BLLI.IBllUser;

import com.kzhotel.pojo.servicetype;
import com.pub.validation.ValidationStrComp;

@Controller
@RequestMapping("/Servicetype")
public class ServicetypeController {
	@Resource
	private IBllServicetype bllServicetype;
	@Resource
	private IBllUser bllUser;


	/**
	 * 新增服务类型
	 * @param request
	 * @param serviceTypeName
	 * @param sortCode
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			String serviceTypeName, 
			int sortCode
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addServiceType")){
            return -3333;
		}
		if(!ValidationStrComp.checkNumber(Long.valueOf(sortCode))){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(serviceTypeName)){
			return -111;
		}
		String creator=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllServicetype.AddServicetype(serviceTypeName, sortCode, hotelId, creator);
	}
	
	
	/**
	 * 编辑服务类型
	 * @param request
	 * @param serviceTypeId
	 * @param serviceTypeName
	 * @param sortCode
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			Long serviceTypeId,
			String serviceTypeName,/*服务分类名称*/
			int sortCode/*排序*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editServiceType")){
            return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(serviceTypeId) ||!ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(serviceTypeName)){
			return -111;
		}
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllServicetype.EditServicetype(serviceTypeId, serviceTypeName, sortCode, hotelId);
	}
	/**
	 * 删除服务类型
	 * @param request
	 * @param serviceTypeId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int serviceTypeId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteServiceType")){
            return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(serviceTypeId)){
			return -201;
		}
		return this.bllServicetype.DelServicetypeById(serviceTypeId);
	}
	/**
	 * 服务类型数量
	 * @param request
	 * @param serviceTypeName
	 * @return
	 */
	@RequestMapping(value="/getServicetypeCount", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int getServicetypeCount(HttpServletRequest request,
			String serviceTypeName/*按名称模糊查询*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getServicetypeCount")){
            return -3333;
		}
		
		
		if(!ValidationStrComp.checkStringName(serviceTypeName)){
			return -111;
		}
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		return this.bllServicetype.getServicetypeCount(hotelId, serviceTypeName);
	}
	/**
	 * 服务类型列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param serviceTypeName
	 * @return
	 */
	@RequestMapping(value="/listServicetypePage", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listServicetypePage(HttpServletRequest request,
			int offset,/*分页offset*/
    		int limit,/*分页limit*/
    		String serviceTypeName /*按名称模糊查询*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listServicetypePage")){
            return "-3333";
		}
		if( !ValidationStrComp.checkNumber(offset) ||!ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(serviceTypeName)){
			return "-111";
		}
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		List<servicetype> lstpf = this.bllServicetype.listServicetypePage(offset, limit, hotelId, serviceTypeName);
		return JSON.toJSONString(lstpf);
	}
	
}
