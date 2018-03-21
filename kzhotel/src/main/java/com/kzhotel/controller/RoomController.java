package com.kzhotel.controller;


import java.util.LinkedList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.PubJavadill.ClsCalculationString;
import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllRoom;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.join.roomJoin;
import com.kzhotel.model.extend.RoomJoinChild;
import com.kzhotel.per.PerReception;
import com.kzhotel.pojo.room;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.SimpleDateHandler;


@Controller
@RequestMapping("/room")
public class RoomController {
	@Resource
	private IBllRoom bllRoom;

	@Resource
	private IBllUser bllUser;

	
	/**
	 * 新增房间
	 * update:2017-01-04
	 * author:wyx
	 * @param request
	 * @param roomCode
	 * @param floorId
	 * @param roomtypeId
	 * @param lockCode
	 * @param description
	 * @return
	 */
	@RequestMapping(value="/addroom", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int addroom(HttpServletRequest request,
			String roomCode,/*房间号码*/
		    long floorId,/*位置*/
		    long roomtypeId,/*房型id*/
		    String lockCode,/*门锁编码*/
		    String description /*备注*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addroom")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(roomCode)){
			return -111;
		}
		if(!ValidationStrComp.checkNumber(floorId) ||!ValidationStrComp.checkNumber(roomtypeId)){
			return -201;
		}
		if(!ValidationStrComp.checkRemark(description)){
			return -112;
		}
		int createUserId=clspubcontrollerfunc.intNowUserId(request);
	    String createUsername=clspubcontrollerfunc.strNowUnm(request);
	    /*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllRoom.AddRoom(roomCode, floorId, roomtypeId, lockCode, (long)createUserId, createUsername, description, hotelId);
	}
	
	/**
	 * 编辑房间
	 * @param request
	 * @param roomId
	 * @param roomCode
	 * @param floorId
	 * @param roomtypeId
	 * @param lockCode
	 * @param description
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			long roomId,/*id*/
			String roomCode,/*房间号码*/
		    long floorId,/*位置*/
		    long roomtypeId,/*房型id*/
		    String lockCode,/*门锁编码*/
		    String description /*备注*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editRoom")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(roomCode)){
			return -111;
		}
		
		if(!ValidationStrComp.checkNumber(floorId) ||!ValidationStrComp.checkNumber(roomtypeId) || !ValidationStrComp.checkNumber(roomId)){
			return -201;
		}
		if(!ValidationStrComp.checkRemark(description)){
			return -112;
		}
		
		room room = this.bllRoom.getRoomById(roomId);
		if(room == null){
			return -3;//该房间不存在
		}
		
		if(room.getRoomState().intValue() == 3 || room.getRoomState().intValue() == 4){
			return -4;//房间如果在入住状态下，不允许修改任何信息
		}
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId =(long) clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllRoom.EditRoom(roomId, roomCode, floorId, roomtypeId, lockCode, modifyUserId, modifyUsername, description, hotelId);
	}
	
	/**
	 * 删除房间
	 * @param request
	 * @param roomId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			long roomId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteRoom")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(roomId)){
			return -201;
		}
		
		room room = this.bllRoom.getRoomById(roomId);
		if(room == null){
			return -3;//该房间不存在
		}
		
		if(room.getRoomState().intValue() == 3 || room.getRoomState().intValue() == 4){
			return -4;//房间在入住状态下不允许进行删除操作
		}
		return this.bllRoom.DelRoomById(roomId);
	}

	/**
	 * 获取房间数量
	 * @param request
	 * @param roomtypeId
	 * @param roomCode
	 * @param floorId
	 * @return
	 */
	@RequestMapping(value="/getRoomCount", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int getRoomCount(HttpServletRequest request,
			 int roomtypeId,
			 String roomCode,
			 int floorId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getRoomCount")){
			return -3333;
		}
	   
		if(!ValidationStrComp.checkNumber(roomtypeId) || !ValidationStrComp.checkNumber(floorId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(roomCode)){
			return -111;
		}
		
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		return this.bllRoom.getRoomCount(hotelId, roomtypeId,floorId, roomCode);
	}
	
	/**
	 * 获取房间列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param roomtypeId
	 * @param floorId
	 * @param roomCode
	 * @return
	 */
	@RequestMapping(value="/listRoomPage", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listRoomPage(HttpServletRequest request,
			int offset, 
			int limit, 
			int roomtypeId,
			int floorId,
			String roomCode
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listRoomPage")){
           return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(roomtypeId) || !ValidationStrComp.checkNumber(floorId) ||
				!ValidationStrComp.checkNumber(limit) ||!ValidationStrComp.checkNumber(offset)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(roomCode)){
			return "-111";
		}
		
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		List<RoomJoinChild> roomJoinChilds = this.bllRoom.listRoomPage(offset,  limit,  hotelId,  roomtypeId,floorId, roomCode);
		return JSON.toJSONString(roomJoinChilds);
	}
	
	/**
	 * 修改房间的状态
	 * @param request
	 * @param roomId
	 * @param roomState
	 * @return
	 */
	@RequestMapping(value="/UpRState", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int UpRState(HttpServletRequest request,
			 int roomId, 
			 int roomState
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "updateRoomState")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(Long.valueOf(roomId)) || !ValidationStrComp.checkNumber(Long.valueOf(roomState))){
			return -201;
		}
	    /*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		return this.bllRoom.updateRoomState(hotelId, roomId, roomState);
	}


	/**
	 * 按条件显示房间列表
	 * @param request
	 * @param roomCode
	 * @param roomtypeId
	 * @param floorId
	 * @param roomstates
	 * @return
	 */
	@RequestMapping(value="/selectRoomList", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String selectRoomList(HttpServletRequest request,
    		String roomCode,/*房间号码，''表示全部*/
    		int roomtypeId /*房型id，0为所有*/,
    		int floorId /*位置id，0为所有*/,
    		String roomstates   /*""表示全部,1为空净，12为空净或脏房*/
    		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "selectRoomList")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(roomtypeId) || !ValidationStrComp.checkNumber(floorId)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(roomCode) || !ValidationStrComp.checkStringName(roomstates)){
			return "-111";
		}
	    /*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		List<roomJoin> lstrojo =this.bllRoom.selectRoomList(hotelId, roomCode, roomtypeId, floorId, roomstates);
		return JSON.toJSONString(lstrojo);
	}
	
	
	/**
	 * create:2017-02-20
	 * 根据roomID获取room信息
	 * @author wyx
	 * @param roomId
	 * @return
	 */
	@RequestMapping(value="/getRoomById",method=RequestMethod.POST)
	@ResponseBody
	public String getRoomById(HttpServletRequest request,
			Long roomId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getRoomById")){
			//return -3333;
            return "-3333";
		}
		room room = this.bllRoom.getRoomById(roomId);
		return JSON.toJSONString(room);
	}
	
	
	/**
	 * create:2017-05-18
	 * 根据不同的条件查询 
	 * 用于 宾客账单 下 各个快捷按钮
	 * @param request
	 * @param receptionState
	 * @param receptionType
	 * @param createDate
	 * @param checkoutDate
	 * @return
	 */
	@RequestMapping( value="/getReceptionInfo", method=RequestMethod.POST)
	@ResponseBody
	public String getReceptionInfo(HttpServletRequest request,
			int receptionState,/*客单状态  1未结  2 已结 0为全部  10为已退房未结*/
	    	int receptionType,	/*客单类型：1租住客单       2非租住客单  0为全部  */
	    	String createDate,/*创建日期，空为全部 yyyy-MM-dd HH:mm:ss*/
	    	String checkoutDate  /*结账日期，空为全部*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getReceptionInfo")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(receptionState) || !ValidationStrComp.checkNumber(receptionType)){
			return "-201";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		List<PerReception> perReceptions = this.bllRoom.getReceptionInfo(hotelId, receptionState, receptionType, SimpleDateHandler.StringToDateByYMDHMS(createDate), SimpleDateHandler.StringToDateByYMDHMS(checkoutDate));
		return JSON.toJSONString(perReceptions);
	}
	
	/**
	 * 复制房间
	 * @param request
	 * @param roomCode
	 * @param copyNumber
	 * @return
	 */
	@RequestMapping(value = {"/copyRoom"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String copyRoom(HttpServletRequest request, String roomCode, int copyNumber){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "copyRoom")){
            return "-3333";
		}
		int r = ClsCalculationString.lastValueType(roomCode);
		if(r == 1){
			List<String> strings = new LinkedList<>();
			int number = ClsCalculationString.getLastNumber(roomCode);
			if(String.valueOf(number).equals(roomCode)){
				for(int i = 1; i <= copyNumber; i++){
					strings.add(String.valueOf(number + i)); 
				}
				return JSON.toJSONString(strings);
			}
			String[] rc = roomCode.split(String.valueOf(number));
			for(int i = 1; i <= copyNumber; i++){
				strings.add(rc[0] + (number + i)); 
			}
			return JSON.toJSONString(strings);
		}else {
			List<String> strings = new LinkedList<>();
			for(int i = 1; i <= copyNumber; i++){
				strings.add(roomCode + "-" + i);
			}
			return JSON.toJSONString(strings);
		}
	}
	
	/**
	 * 批量添加房间
	 * @param request
	 * @param roomCodeList
	 * @param roomTypeId
	 * @param floorId
	 * @return
	 */
	@RequestMapping(value = {"/batchAddRoom"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int batchAddRoom(HttpServletRequest request,
			String roomCodeList,
			long roomTypeId, 
			long floorId 
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "batchAddRoom")){
            return -3333;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		try {
			return this.bllRoom.addRommList(roomCodeList, roomTypeId, floorId, hotelId, createUserId, createUserName);
		} catch (Exception e) {
			return 0;
		}
	}
}
