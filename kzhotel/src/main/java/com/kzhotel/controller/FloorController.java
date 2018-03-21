package com.kzhotel.controller;


import java.util.List;

import javax.annotation.Resource;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import com.kzhotel.BLLI.IBllFloor;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.pojo.floor;
import com.pub.validation.ValidationStrComp;

@Controller
@RequestMapping("/floor")
public class FloorController {
	@Resource
	private IBllFloor bllFloor;
	@Resource
	private IBllUser bllUser;

	/**
	 * 增加楼层
	 * @param request
	 * @param floorName
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			String floorName  //楼层名
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addFloor")){
			return -3333;
		}
		
		String creator=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(hotelId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(floorName)){
			return -111;
		}
		
		int intresult = this.bllFloor.AddFloor(floorName,hotelId,creator);
		return intresult;
	}
	

	/**
	 * 编辑楼层
	 * @param request
	 * @param floorId
	 * @param floorName
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			long floorId,/*id*/
		    String floorName/*位置名称*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editFloor")){
			return -3333;
		}
		
		String creator=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(hotelId) || !ValidationStrComp.checkNumber(floorId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(floorName)){
			return -111;
		}
		int intresult = this.bllFloor.EditFloor(floorId, floorName, hotelId, creator);
		return intresult;
	}
	
	/**
	 * 删除楼层
	 * @param request
	 * @param floorId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int floorId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteFloor")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(Long.valueOf(floorId))){
			return -201;
		}
		int intresult = this.bllFloor.DelFloorById(floorId);
		return intresult;
	}
	
	/**
	 * 楼层数量
	 * @param request
	 * @param floorName
	 * @return
	 */
	@RequestMapping(value="/pgcount", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int pgcount(HttpServletRequest request,
			String floorName/*按位置名称模糊查询，空字符串为全部*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getFloorCount")){
			return -3333;
		}
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		
		if(!ValidationStrComp.checkNumber(Long.valueOf(hotelId))){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(floorName)){
			return -111;
		}
		
		int intresult = this.bllFloor.getfloorCount(hotelId, floorName);
		return intresult;
	}
	
	/**
	 * 楼层列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param floorName
	 * @return
	 */
	@RequestMapping(value="/pglist", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String pglist(HttpServletRequest request,
			int offset, 
			int limit,  
			String floorName
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getFloorList")){
            return "-3333";
		}
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		if( !ValidationStrComp.checkNumber(offset) ||!ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(floorName)){
			return "-111";
		}
		
		List<floor> lstpf = this.bllFloor.floorPageList( offset,  limit,  hotelId,  floorName);
		return JSON.toJSONString(lstpf);
	}
	
	/**
	 * 2017-01-19
	 * 获取楼层（房间数>0）列表
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getFloorForSearch",method=RequestMethod.POST)
	@ResponseBody
	public String getFloorForSearch(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getFloorForSearch")){
            return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<floor> floors  = this.bllFloor.getFloorForSearch(hotelId);
		return JSON.toJSONString(floors);
	}
	
	
}
