package com.kzhotel.controller;



import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.bson.Document;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllSystemParam;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.pojo.config;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.MongoHandler;
import me.persevere.util.SimpleDateHandler;

//系统参数
@Controller
@RequestMapping("/syspara")
public class SystemParamController {
	@Resource
	private IBllSystemParam bllSystemParam;
	@Resource
	private IBllUser bllUser;

	/**
	 * 获取证件类型json
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getCertificateTypeJson", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String getCertificateTypeJson(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getCertificateTypeJson")){
			return "-3333";
		}
		return this.bllSystemParam.getCertificateTypeJson();
	}
	/**
	 * 获取支付方式json
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getPaymethodJson", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String getPaymethodJson(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getPaymethodJson")){
			return "-3333";
		}
		return this.bllSystemParam.getPaymethodJson();
	}
	
	/**
	 * 获取酒店规则设置
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getConfigByHotelId", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String getConfigByHotelId(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getConfigByHotelId")){
			return "-3333";
		}
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		config cfgresult = this.bllSystemParam.getConfigByHotelId(hotelId);
		return  JSON.toJSONString(cfgresult);
	}
	
	/**
	 * 设置周末
	 * @param request
	 * @param weekendCodeList
	 * @return
	 */
	@RequestMapping(value="/setWeekEnd", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int setWeekEnd(HttpServletRequest request,
			String weekendCodeList	/*0星期一,1星期二,6星期天*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "setWeekEnd")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(weekendCodeList)){
			return -111;
		}
		
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		return this.bllSystemParam.setWeekEnd(hotelId,weekendCodeList);
	}
	
	/**
	 * 获取周末设置
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getWeekEnd", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String getWeekEnd(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getWeekEnd")){
			return "-3333";
		}
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		String strresult = this.bllSystemParam.getWeekEnd(hotelId);
		return  JSON.toJSONString(strresult);
	}
	
	/**
	 * 规则设置
	 * @param request
	 * @param auditTime
	 * @param memberCheckoutDelay
	 * @param restHour
	 * @param noonCheckoutTime
	 * @param afternoonCheckoutTime
	 * @param lateRoomTime
	 * @param noonOvertimePayRate
	 * @param afternoonOvertimePayRate
	 * @param dayRoomUnit
	 * @param restRoomUnit
	 * @return
	 */
	@RequestMapping(value="/EditConfig", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int EditConfig(HttpServletRequest request,
		    String auditTime,/*夜审时间*/
		    Integer memberCheckoutDelay,/*会员中午退房延时*/
		    Integer restHour,/*钟点房小时基数*/
		    String noonCheckoutTime,/*中午退房时间*/
		    String afternoonCheckoutTime,/*下午退房时间*/
		    String lateRoomTime,/*晚房开始时间*/
		    String dayRoomUnit,	/*天房单位*/
		    String restRoomUnit	/*钟点房单位*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "EditConfig")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(memberCheckoutDelay) || !ValidationStrComp.checkNumber(restHour)){
			return -201;
		}
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		int strresult = this.bllSystemParam.EditConfig(
				(long)hotelId, 
				SimpleDateHandler.StringToDateByYMDHMS(auditTime),  
				memberCheckoutDelay, 
				restHour, 
				SimpleDateHandler.StringToDateByYMDHMS(noonCheckoutTime), 
				SimpleDateHandler.StringToDateByYMDHMS(afternoonCheckoutTime), 
				SimpleDateHandler.StringToDateByYMDHMS(lateRoomTime), 
				null,
				dayRoomUnit, 
				restRoomUnit
				);
		
		if(strresult > 0){
			Map<String, Object> maps = new HashMap<String , Object>();
			maps.put("hotelId", (long)hotelId);
			maps.put("auditTime", auditTime);
			maps.put("memberCheckoutDelay", memberCheckoutDelay);
			maps.put("restHour", restHour);
			maps.put("noonCheckoutTime", noonCheckoutTime);
			maps.put("afternoonCheckoutTime", afternoonCheckoutTime);
			maps.put("lateRoomTime", lateRoomTime);
			maps.put("dayRoomUnit", dayRoomUnit);
			maps.put("restRoomUnit", restRoomUnit);
			maps.put("audit", "");
			Document document = MongoHandler.findOneMongo("hotelConfig", "hotelId", (long)hotelId);
			if(document==null){
				MongoHandler.insertMongoByMaps("hotelConfig", maps);
			}else{
				MongoHandler.deleteMongo("hotelConfig", "hotelId", (long)hotelId,2);
				MongoHandler.insertMongoByMaps("hotelConfig", maps);
			}
		}
		return  strresult;
	}
	
	/**
	 * 规则设置页面
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping(value="/set_rule",method=RequestMethod.GET)
	public String setRule(HttpServletRequest request){
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		config config = this.bllSystemParam.getConfigByHotelId(hotelId);
		request.getSession().setAttribute("config", JSON.toJSONString(config));
		return "../../client/set_rule";
	}
	
}
