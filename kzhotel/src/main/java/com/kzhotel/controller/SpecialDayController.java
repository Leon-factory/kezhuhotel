package com.kzhotel.controller;


import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllSpecialDay;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.pojo.specialday;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.SimpleDateHandler;

@Controller
@RequestMapping("/specialday")
public class SpecialDayController {
	@Resource
	private IBllSpecialDay bllSpecialDay;
	@Resource
	private IBllUser bllUser;

	/**
	 * 新增节假日
	 * @param request
	 * @param specialdayName
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			String specialdayName,/*节日名称*/
		    String startTime,/*节日开始时间*/
		    String endTime/*节日结束时间*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addSpecialDay")){
			return -3333;
		}
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);  
		String creator=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		return this.bllSpecialDay.AddSpecialDay(specialdayName, SimpleDateHandler.StringToDateByYMDHMS(startTime), SimpleDateHandler.StringToDateByYMDHMS(endTime), hotelId, creator);
	}
	/**
	 * 编辑节假日
	 * @param request
	 * @param specialdayId
	 * @param specialdayName
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			long specialdayId,/*id*/
			String specialdayName,/*节日名称*/
		    String startTime,/*节日开始时间*/
		    String endTime/*节日结束时间*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editSpecialDay")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(specialdayId)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(specialdayName)){
			return -111;
		}
		
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);  
		return this.bllSpecialDay.EditSpecialDay(specialdayId, specialdayName, SimpleDateHandler.StringToDateByYMDHMS(startTime), SimpleDateHandler.StringToDateByYMDHMS(endTime), hotelId);
	}
	/**
	 * 删除节假日
	 * @param request
	 * @param specialdayId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int specialdayId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteSpecialDay")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(specialdayId)){
			return -201;
		}
		return this.bllSpecialDay.DelSpecialDay(specialdayId);
	}
	
	/**
	 * 节假日数量
	 * @param request
	 * @param specialdayName
	 * @return
	 */
	@RequestMapping(value="/pgcount", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int pgcount(HttpServletRequest request,
			String specialdayName/*按名称模糊查询*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getSpecialDayCount")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(specialdayName)){
			return -111;
		}	
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		return this.bllSpecialDay.getSpecialDayCount(hotelId, specialdayName);
	}
	
	/**
	 * 节假日列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param specialdayName
	 * @return
	 */
	@RequestMapping(value="/pglist", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String pglist(HttpServletRequest request,
	 		int offset,/*分页offset*/
    		int limit,/*分页limit*/
    		String specialdayName /*按名称模糊查询*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getSpecialDayList")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(specialdayName)){
			return "-111";
		}	
		
		if( !ValidationStrComp.checkNumber(limit) ||!ValidationStrComp.checkNumber(offset)){
			return "-201";
		}
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		List<specialday> lstpojo = this.bllSpecialDay.listSpecialDayPage(offset, limit, hotelId, specialdayName);
		return JSON.toJSONString(lstpojo);
	}
	
	/**
	 * 判断某时是否是节日
	 * @param request
	 * @param sometime
	 * @return
	 */
	@RequestMapping(value="/isSpecialDay", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int isSpecialDay(HttpServletRequest request,
			String sometime
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "isSpecialDay")){
			return -3333;
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		if(this.bllSpecialDay.isSpecialDay(hotelId, SimpleDateHandler.StringToDateByYMDHMS(sometime))){
			return 1;
		}
		return 0;
	}
		
		
	/**
	 * 判断某时是否是周末
	 * @param request
	 * @param sometime
	 * @return
	 */
	@RequestMapping( value="/isWeekEnd" , method=RequestMethod.POST)
	@ResponseBody
	public int isWeekEnd(HttpServletRequest request,
    		String sometime  /*某时*/
    		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "isWeekEnd")){
			return -3333;
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		boolean result = this.bllSpecialDay.isWeekEnd(hotelId, SimpleDateHandler.StringToDateByYMDHMS(sometime));
		if(result){
			return 1;
		}
		return 0;
	}
		
}
