package com.kzhotel.controller;



import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllRentPrice;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.join.rentpriceJoin;
import com.kzhotel.model.TimePrice;
import com.kzhotel.pojo.rentprice;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.SimpleDateHandler;

@Controller
@RequestMapping("/rentprice")
public class RentPriceController {
	@Resource
	private IBllRentPrice bllrentprice;
	@Resource
	private IBllUser bllUser;

	
	/**
	 * 新增房价
	 * @param request
	 * @param roomtypeId
	 * @param timeinterval
	 * @param checkinType
	 * @param rentplanId
	 * @param price
	 * @param remark
	 * @return -1111不允许钟点房
	 * 			-1112不允许晚房
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			long roomtypeId,/*房型id*/
		    int timeinterval,/*时段，1平日，2周末，3节日*/
		    int checkinType,/*入住方式 1全日房，2钟点房，3晚房*/
		    long rentplanId,/*方案id*/
		    int price,/*价格，单位分*/
		    String remark/*备注*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addRentPrice")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(roomtypeId) || !ValidationStrComp.checkNumber(rentplanId) || 
				!ValidationStrComp.checkNumber(timeinterval) || !ValidationStrComp.checkNumber(checkinType)||
				!ValidationStrComp.checkNumber(price)){
			return -201;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		int createUserId=clspubcontrollerfunc.intNowUserId(request);
		String createUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllrentprice.AddRentPrice(roomtypeId, timeinterval, checkinType, rentplanId, price, hotelId, (long)createUserId, createUsername, remark);
	}
	
	/**
	 * 编辑方案价格
	 * @param request
	 * @param rentpriceId
	 * @param roomtypeId
	 * @param timeinterval
	 * @param checkinType
	 * @param rentplanId
	 * @param price
	 * @param remark
	 * @return
	 */
	@RequestMapping(value="/EditRentPrice",method=RequestMethod.POST)
	@ResponseBody
	public int EditRentPrice(HttpServletRequest request,
			long rentpriceId,/*id*/
			long roomtypeId,/*房型id*/
		    int timeinterval,/*时段，1平日，2周末，3节日*/
		    int checkinType,/*入住方式 1全日房，2钟点房，3晚房*/
		    long rentplanId,/*方案id*/
		    int price,/*价格*/
		    String remark/*备注*/
		    ){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "EditRentPrice")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(roomtypeId) || !ValidationStrComp.checkNumber(rentplanId) || 
				!ValidationStrComp.checkNumber(timeinterval) || !ValidationStrComp.checkNumber(checkinType)||
				!ValidationStrComp.checkNumber(price) || !ValidationStrComp.checkNumber(rentpriceId)){
			return -201;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		int modifyUserId=clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllrentprice.EditRentPrice(rentpriceId, roomtypeId, timeinterval, checkinType, rentplanId, price, hotelId,(long) modifyUserId, modifyUsername, remark);
	}
	
	/**
	 * 删除房价
	 * @param request
	 * @param rentpriceId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int rentpriceId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteRentPrice")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(rentpriceId)){
			return -201;
		}
		return this.bllrentprice.DelRentPrice(rentpriceId);
	}
	
	/**
	 * 房价数量
	 * @param request
	 * @param rentplanId
	 * @param roomtypeId
	 * @param checkinType
	 * @param timeinterval
	 * @return
	 */
	@RequestMapping(value="/pgcount", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int pgcount(HttpServletRequest request,
    		int rentplanId,/*方案id，0表示全部*/
    		int roomtypeId,/*房型id，0表示全部*/
    		int checkinType,/*入住方式，0表示全部，1全日房，2钟点房，3晚房*/
    		int timeinterval /*时段，0表示全部，1平日，2周末，3节日*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getRentPriceCount")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(rentplanId) || !ValidationStrComp.checkNumber(roomtypeId) ||
				!ValidationStrComp.checkNumber(checkinType) || !ValidationStrComp.checkNumber(timeinterval)){
			return -201;
		}
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		return this.bllrentprice.getRentPriceCount(hotelId, rentplanId, roomtypeId, checkinType, timeinterval);
	}
	
	/**
	 * 房价列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param rentplanId
	 * @param roomtypeId
	 * @param checkinType
	 * @param timeinterval
	 * @return
	 */
	@RequestMapping(value="/pglist", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String pglist(HttpServletRequest request,
			int offset,
    		int limit,
    		int rentplanId,/*方案id，0表示全部*/
    		int roomtypeId,/*房型id，0表示全部*/
    		int checkinType,/*入住方式，0表示全部，1全日房，2钟点房，3晚房*/
    		int timeinterval /*时段，0表示全部，1平日，2周末，3节日*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getRentPriceList")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(rentplanId) || !ValidationStrComp.checkNumber(roomtypeId) ||
				!ValidationStrComp.checkNumber(checkinType) || !ValidationStrComp.checkNumber(timeinterval) ||
				!ValidationStrComp.checkNumber(limit)||!ValidationStrComp.checkNumber(offset)){
			return "-201";
		}
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		List<rentpriceJoin> lstpojo = this.bllrentprice.listRentPricePage(offset, limit, hotelId, rentplanId, roomtypeId, checkinType, timeinterval);
		return JSON.toJSONString(lstpojo);
	}
	
	/**
	 * 根据房型、入住方式、房价方案，获得一段时间的价格列表
	 * @param request
	 * @param startTime
	 * @param endTime
	 * @param roomtypeId
	 * @param checkinType
	 * @param rentplanId
	 * @return
	 */
	@RequestMapping(value="/getRoomPriceListByPeriod", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String getRoomPriceListByPeriod(HttpServletRequest request,
    		String startTime,/*开始时间*/
    		String endTime,/*终止时间*/
    		int roomtypeId,/*房型id*/
    		int checkinType,/*入住方式     1全日房   2终点房  3晚房*/
    		int rentplanId   /*房价方案id*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getRoomPriceListByPeriod")){
           return "-3333";
		}
		if(!ValidationStrComp.checkNumber(roomtypeId) || !ValidationStrComp.checkNumber(checkinType) ||
				!ValidationStrComp.checkNumber(rentplanId)){
			return "-201";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		List<TimePrice> lstresult = this.bllrentprice.getRoomPriceListByPeriod(hotelId, roomtypeId, checkinType, rentplanId, SimpleDateHandler.StringToDateByYMDHMS(startTime),SimpleDateHandler.StringToDateByYMDHMS(endTime));
		return JSON.toJSONString(lstresult);
	}
		
	/**
	 * 根据条件获取房价
	 * @param request
	 * @param roomTypeId
	 * @param rentplanId
	 * @return
	 */
	@RequestMapping(value="/getRentpriceListByHotelId",method=RequestMethod.POST)
	@ResponseBody
	public String getRentpriceListByHotelId(HttpServletRequest request,
    		int roomTypeId,/*房型 id,0为全部*/
    		int rentplanId  /*房价方案id,0为全部*/
    		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getRentpriceListByHotelId")){
           return "-3333";
		}
		if(!ValidationStrComp.checkNumber(roomTypeId) ||!ValidationStrComp.checkNumber(rentplanId)){
			return "-201";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		List<rentprice> rentprices = this.bllrentprice.getRentpriceListByHotelId(hotelId, roomTypeId, rentplanId);
		return JSON.toJSONString(rentprices);
	}
		
}
