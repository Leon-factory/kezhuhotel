package com.kzhotel.controller;


import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import com.kzhotel.BLLI.IBllRoomType;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.pojo.roomtype;
import com.pub.validation.ValidationStrComp;


@Controller
@RequestMapping("/roomtype")
public class RoomTypeController {

	@Resource 
	private IBllRoomType bllRoomType;
	@Resource
	private IBllUser bllUser;
	
	/**
	 * 新增房型
	 * @param request
	 * @param roomtypeName
	 * @param overorderNumber
	 * @param sortCode
	 * @param remark
	 * @param photo
	 * @param restRoom
	 * @param lateRoom
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int Add(HttpServletRequest request,
			String roomtypeName,  //名字
			int overorderNumber,   //超定数量
			int sortCode,  //排序
			String remark,  //备注
			String photo,  //图片路径
			int restRoom,//   钟点
		    int lateRoom//  晚房
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addRoomType")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(overorderNumber) ||!ValidationStrComp.checkNumber(restRoom) || 
				!ValidationStrComp.checkNumber(lateRoom) || !ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(roomtypeName)){
			return -111;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		int createUserId=clspubcontrollerfunc.intNowUserId(request);
		String createUsername= clspubcontrollerfunc.strNowUnm(request);
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllRoomType.AddRoomType((long)hotelId, roomtypeName, overorderNumber, sortCode, remark, 
				photo, restRoom, lateRoom, (long)createUserId, createUsername);
	}
	/**
	 * 编辑房型
	 * @param request
	 * @param roomtypeId
	 * @param roomtypeName
	 * @param overorderNumber
	 * @param sortCode
	 * @param remark
	 * @param photo
	 * @param restRoom
	 * @param lateRoom
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			long roomtypeId,/*id*/
			String roomtypeName,  //名字
			int overorderNumber,   //超定数量
			int sortCode,  //排序
			String remark,  //备注
			String photo,  //图片路径
			int restRoom,//   钟点
		    int lateRoom//  晚房
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editRoomType")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(overorderNumber) || !ValidationStrComp.checkNumber(restRoom) || !ValidationStrComp.checkNumber(lateRoom)||
				!ValidationStrComp.checkNumber(roomtypeId) || !ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(roomtypeName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllRoomType.EditRoomType(roomtypeId, hotelId,roomtypeName, overorderNumber, sortCode, remark, photo, restRoom, lateRoom, modifyUserId, modifyUsername);
		
	}
	/**
	 * 删除房型
	 * @param request
	 * @param roomTypeId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int roomTypeId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteRoomType")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(roomTypeId)){
			return -201;
		}
		return this.bllRoomType.DelRoomType(roomTypeId);
	}
	
	/**
	 * 房型数量
	 * @param request
	 * @param roomtypeName
	 * @return
	 */
	@RequestMapping(value="/rtc", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int rtc(HttpServletRequest request,
			 String roomtypeName
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getRoomTypeCount")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(roomtypeName)){
			return -111;
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		return this.bllRoomType.getRoomTypeCount(hotelId, roomtypeName);
	}
	/**
	 * 房型列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param roomtypeName
	 * @return
	 */
	@RequestMapping(value="/lrtc", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String lrtc(HttpServletRequest request,
			int offset, 
			int limit,  
			String roomtypeName
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getRoomTypeList")){
            return "-3333";
		}
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(roomtypeName)){
			return "-111";
		}
		
		List<roomtype> lstpojo = this.bllRoomType.listRoomTypePage(offset,  limit,  hotelId,  roomtypeName);
		return JSON.toJSONString(lstpojo);
		
	}
	
	/**
	 * 2017-01-19
	 * 获取房型（房间数>0）列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param roomtypeName
	 * @return
	 */
	@RequestMapping(value="/getRoomtypeForSearch",method=RequestMethod.POST)
	@ResponseBody
	public String getRoomtypeForSearch(HttpServletRequest request,
			int offset, 
			int limit, 
			String roomtypeName
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getRoomtypeForSearch")){
            return "-3333";
		}
		if(!ValidationStrComp.checkNumber(limit)||!ValidationStrComp.checkNumber(offset)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(roomtypeName)){
			return "-111";
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		return JSON.toJSONString(this.bllRoomType.getRoomtypeForSearch(offset, limit, hotelId, roomtypeName));
		
	}
	
}
