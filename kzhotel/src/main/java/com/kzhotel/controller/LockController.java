package com.kzhotel.controller;


import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.bson.Document;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.socket.TextMessage;

import com.PubJavadill.java.CmpLocalDT;
import com.alibaba.fastjson.JSON;
import com.kezhu.mongo.entity.idCards;
import com.kzhotel.BLL.MessageHandler;
import com.kzhotel.BLLI.IBllLock;
import com.kzhotel.BLLI.IBllRoom;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.factory.LockSystemFactory;
import com.kzhotel.factory.locksystem.LockSystem;
import com.kzhotel.model.ReceptionGuest;
import com.kzhotel.model.extend.RoomChild;
import com.kzhotel.per.PerCreateCard;
import com.kzhotel.pojo.hotel;
import com.kzhotel.pojo.lockcard;
import com.kzhotel.pojo.room;
import com.kzhotel.pojo.roomtype;
import com.kzhotel.service.IGuestService;
import com.kzhotel.service.IHotelService;
import com.kzhotel.service.IRoomTypeService;

import me.persevere.util.ClassTransfer;
import me.persevere.util.MongoHandler;
import me.persevere.util.SimpleDateHandler;



@Controller
@RequestMapping("/lock")
public class LockController {
	
	
	@Resource
	private IBllLock lock;
	@Resource
	private IBllRoom bllRoom;
	@Resource
	private IHotelService hotelservice;
	@Resource
	private MessageHandler handler;
	@Resource
	private IRoomTypeService roomTypeService;
	@Resource
	private IGuestService guestService;
	@Resource
	private IBllUser bllUser;
	
	/**
	 * create:2017-05-15
	 * 身份证
	 * @param text
	 * @return
	 */
	@RequestMapping("/inputIdCard")
	@ResponseBody
	public String inputIdCard(String text){
		Map<String, String> map = new HashMap<String,String>();
		text=text.replace(".", "%dian%").replace("$", "%dollar%");
		map.put("info", text);
		Integer intresult = MongoHandler.insertMongoByMaps("idCardInfo", map);
		if(intresult==1){
			Document document = MongoHandler.findOneMongo("idCardInfo", "info", text);
			return (String)document.get("createtime");
		}
		
		return intresult.toString();
	}
	
	
	/**
	 * create:2017-03-14
	 * 门卡应急
	 * @param text
	 */
	@RequestMapping("/inputRent")
	@ResponseBody
	public String inputRent(String text){
		Map<String, String> map = new HashMap<String,String>();
		text=text.replace(".", "%dian%").replace("$", "%dollar%");
		map.put("info", text);
		int intresult = MongoHandler.insertMongoByMaps("rentCard", map);
		if(intresult==1){
			Document document = MongoHandler.findOneMongo("rentCard", "info", text);
			return (String)document.get("createtime");
		}
		return String.valueOf(intresult);
	}
	
	
	/**
	 * create:2017-02-17
	 * 读卡第一步
	 * @author wyx
	 * @param request
	 * @param eventCode
	 * @param comCode
	 * @return
	 * 			-1：数据存入mongo失败
	 */
	@RequestMapping(value="/readCardFirst",method=RequestMethod.POST)
	@ResponseBody
	public int readCard(HttpServletRequest request,
			String eventCode,/*事件号*/
			String comCode/*通讯号*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "readCardFirst")){
			return -3333;
           
		}
		
		Map<String, String> map = new HashMap<String, String>();
		map.put("eventCode", eventCode);
		map.put("communicationCode", comCode);
		int intresult = MongoHandler.insertMongoByMaps("readCard", map);
		if(intresult > 0){
			return 1;
		}else{
			return -1;//数据存入mongo失败
		}
		
	}
	
	/**
	 * create:2017-02-17
	 * 读卡第二步
	 * @author wyx
	 * @param eventCode
	 * @param cardCode
	 * @throws Exception
	 */
	@RequestMapping("/readCardSecond")
	@ResponseBody
	public int readCardSecond(
			String eventCode,/*事件号*/
			String cardCode
			) throws Exception{
		Document document = MongoHandler.findOneMongo("readCard", "eventCode", eventCode);
		if(document.isEmpty()){
			return -1;//mongo中不存在数据
		}
		String comCode = document.getString("communicationCode");
		returnModel rm = new returnModel();
		rm.setComIdentity("1");
		if("".equals(cardCode)){
			rm.setComInfo("199");
			this.handler.toSelf(new TextMessage(JSON.toJSONString(rm)), comCode);
			return -2;//卡号位空
		}
		String event = document.getString("eventCode");
		
		if(event.equals(eventCode)){
			lockcard lockcard = this.lock.getLockcardByCardCode(cardCode);
			if(lockcard!=null){
				lockcard.setComIdentity("1");
				//根据roomid获取room信息
				room room = this.bllRoom.getRoomById(lockcard.getRoomId());
				//根据roomtypeid获取roomtype信息
				roomtype resultpojo = this.roomTypeService.getRoomTypeById( room.getRoomtypeId().intValue());
				//获取房型名称
				lockcard.setRoomtypeName(resultpojo.getRoomtypeName());
				//获取宾客姓名
				List<ReceptionGuest> lstpf = this.guestService.listGuestByReceptionId(room.getHotelId().intValue(), room.getReceptionId().intValue());
				for(ReceptionGuest rg : lstpf){
					if(rg.getIsPrimary()==1){
						lockcard.setGuestName(rg.getGuestName());
						break;
					}
				}
				lockcard.setComInfo("101");//读卡成功
				
				if(this.handler.toSelf(new TextMessage(JSON.toJSONString(lockcard)), comCode)){
					MongoHandler.deleteMongo("readCard", "eventCode", event, 2);
				}
			}else{
				rm.setComInfo("198");//卡内信息为空
				this.handler.toSelf(new TextMessage(JSON.toJSONString(rm)), comCode);
			}
		}
		return 1;
	}
	
	/**
	 * create:2017-02-16
	 * 开卡第一步
	 * @author wyx
	 * @param expectedLeaveTime
	 * @param eventCode
	 * @param roomId
	 * @param comCode
	 * @return
	 * @throws UnsupportedEncodingException
	 * 重做：2017-07-19
	 */
	@RequestMapping(value = {"/createCardFirst"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int createCard(HttpServletRequest request,
			String startTime,/*起始时间*/
			String expectedLeaveTime,/*预计离开时间*/
			String eventCode,/*事件号*/
			long roomId,
			String comCode /*通讯号*/
			) throws UnsupportedEncodingException{
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "createCardFirst")){
			return -3333;
            //return "-3333";
		}
		Map<String, String> map = new HashMap<String, String>();
		/*房间锁号确认*/
		room room = this.bllRoom.getRoomById(roomId);
		String roomLockCode = room.getLockCode();
		if( roomLockCode == null || "".equals(roomLockCode)){
			return -3;//房间未设置锁号
		}
		map.put("roomLockCode", roomLockCode);
		/*酒店标识确认*/
		hotel hotel = this.hotelservice.getHotelById(room.getHotelId().intValue());
		String hotelIdentity = hotel.getHotelIdentity();
		if("".equals(hotelIdentity) || hotelIdentity == null){
			return -2;//酒店标识未设置
		}
		map.put("hotelIdentity", hotelIdentity);
		map.put("roomId", String.valueOf(roomId));
		map.put("startTime", new SimpleDateFormat("yyyyMMddHHmmss").format(SimpleDateHandler.StringToDateByYMDHMS(startTime)));
		map.put("expectedLeaveTime", new SimpleDateFormat("yyyyMMddHHmmss").format(SimpleDateHandler.StringToDateByYMDHMS(expectedLeaveTime)));
		map.put("userId", String.valueOf(clspubcontrollerfunc.intNowUserId(request)));
		map.put("userName", clspubcontrollerfunc.strNowUnm(request));
		map.put("eventCode", eventCode);
		map.put("communicationCode", comCode);
		map.put("lockType", String.valueOf(hotel.getLockType()));
		map.put("hotelId", hotel.getHotelId().toString());
		Document document = MongoHandler.findOneMongo("createCard", "eventCode", eventCode);
		if(!document.isEmpty()){
			MongoHandler.deleteMongo("createCard", "eventCode", eventCode, 2);
		}
		int intresult = MongoHandler.insertMongoByMaps("createCard", map);
		if(intresult > 0){
			return 1;
		}else{
			return -1;//存入mongo失败
		}
	}
	
	/**
	 * create:2017-02-16
	 * 开卡第二步
	 * @author wyx
	 * @param eventCode
	 * @return
	 * 重做：2017-07-19
	 */
	@RequestMapping(value = {"/createCardSecond"})
	@ResponseBody
	public String createCardSecond(String eventCode){
		
		Document document = MongoHandler.findOneMongo("createCard", "eventCode", eventCode);
		if(document.isEmpty()){
			return "-1";//mongo中不存在数据
		}
		Integer lockType = Integer.valueOf(document.getString("lockType"));
		LockSystem ls = null;
		switch (lockType) {
		case 0:
			ls = LockSystemFactory.newInstanceJundatai(
					Long.valueOf(document.getString("roomId")),
					document.getString("hotelIdentity"),
					document.getString("roomLockCode"),
					document.getString("startTime"),
					document.getString("expectedLeaveTime")
					);
			break;

		case 1:
			ls = LockSystemFactory.newInstanceLiRong(
					document.getString("roomLockCode"),
					document.getString("startTime"),
					document.getString("expectedLeaveTime"),
					"00","01","000000"
					);
			break;
		}
		return LockSystem.spell(ls) + "," + eventCode;
	
	}
	
	/**
	 * create:2017-02-16
	 * 开卡第三步
	 * @author wyx
	 * @param cardCode
	 * @param eventCode
	 * @return
	 * @throws Exception
	 * 重做：2017-07-19
	 */
	@RequestMapping(value = {"/createCardLast"})
	@ResponseBody
	public int createCardLast(
			String hotelIdentity,/*酒店标识*/
			String lockCode,/*锁号*/
			String expectedLeaveTime,/*预离时间*/ 
			long roomId,
			String cardCode,/*卡号*/
			String eventCode/*事件号*/
			) throws Exception{
		Document document = MongoHandler.findOneMongo("createCard", "eventCode", eventCode);
		if(document.isEmpty()){
			return -1;//mongo中不存在数据
		}
		String comCode = document.getString("communicationCode");
		if(cardCode == null || "".equals(cardCode)){
			RoomChild rc = new RoomChild();
			rc.setComIdentity("1");
			rc.setComInfo("199");
			this.handler.toSelf(new TextMessage(JSON.toJSONString(rc).getBytes()), comCode);
			return -2;//卡号为空
		}
		//锁号，卡号，事件号
		hotelIdentity = document.getString("hotelIdentity");
		roomId = Long.valueOf(document.getString("roomId"));
		room room = this.bllRoom.getRoomById(roomId);
		Date extime = new SimpleDateFormat("yyyyMMddHHmmss").parse(document.getString("expectedLeaveTime"));
		int intresult1 = this.lock.createLockCard(room.getHotelId(), hotelIdentity,
					lockCode, cardCode, room.getRoomId(), room.getRoomCode(), CmpLocalDT.LocalDateTimeToDate(LocalDateTime.now()),
					extime, Long.valueOf(document.getString("userId")) ,document.getString("userName"));
		
		
		if(intresult1 > 0){
			RoomChild rc = new RoomChild();
			ClassTransfer.parentToChild(room, rc);
			rc.setComIdentity("1");
			rc.setComInfo("102");//开卡成功
			if(this.handler.toSelf(new TextMessage(JSON.toJSONString(rc)),comCode)){
				MongoHandler.deleteMongo("createCard", "communicationCode", comCode, 2);
			}
		}
		return intresult1;
		
	}
	
	/**
	 * create:2017-02-17
	 * 读取卡片失败
	 * @author wyx
	 * @param eventCode
	 * @param errorCode
	 * 40001:未知错误
	 * 40002:开卡失败
	 * 40003:未检测到卡
	 * 40004:卡内信息为空
	 * 40005:不是用户卡
	 * 40006:卡号为空
	 * @throws Exception
	 */
	@RequestMapping("/createCardFailed")
	@ResponseBody
	public void createCardFailed(
			String eventCode,/*事件号*/
			int errorCode/*错误信息*/
			) throws Exception{
		Document document = MongoHandler.findOneMongo("createCard", "eventCode", eventCode);
		if(document.isEmpty()){
			return;
		}
		String comCode = document.getString("communicationCode");
		returnModel rm = new returnModel();
		rm.setComIdentity("1");
		switch (errorCode) {
		case 3:rm.setComInfo("197");break;//开卡失败
		case 4:case 1002:rm.setComInfo("196");break;//检测不到卡
		case 1003:rm.setComInfo("198");break;//卡内信息为空
		case 1004:rm.setComInfo("195");break;//不是用户卡
		default:rm.setComInfo("194");break;//未知错误
		}
		this.handler.toSelf(new TextMessage(JSON.toJSONString(rm)), comCode);
	}
	
	/**
	 * create:2017-02-17
	 * 注销卡第一步
	 * @author wyx
	 * @param eventCode
	 * @param comCode
	 * @return
	 */
	@RequestMapping(value="/cancelCardFirst",method=RequestMethod.POST)
	@ResponseBody
	public int cancelCardFirst(HttpServletRequest request,
			String eventCode, /*事件号*/
			String comCode/*通讯号*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "cancelCardFirst")){
			return -3333;
		}
		long currentUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String currentUserName = clspubcontrollerfunc.strNowUnm(request);
		Map<String, String> map = new HashMap<String, String>();
		map.put("eventCode", eventCode);
		map.put("userId", String.valueOf(currentUserId));
		map.put("userName", currentUserName);
		map.put("communicationCode", comCode);
		if(MongoHandler.insertMongoByMaps("cancelCard", map) > 0){
			return 1;
		}else{
			return -1;//数据写入mongo失败
		}
		
		
	}
	
	/**
	 * create:2017-02-17
	 * 注销卡第二步
	 * @author wyx
	 * @param eventCode
	 * @param cardCode
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping("/cancelCardSecond")
	@ResponseBody
	public String cancelCardSecond(
			String eventCode,/*事件号*/
			String cardCode
			) throws Exception{
		Document document = MongoHandler.findOneMongo("cancelCard", "eventCode", eventCode);
		if(document.isEmpty()){
			return "-1";
		}
		String comCode = document.getString("communicationCode");
		returnModel rm = new returnModel();
		
		long userId = Long.valueOf(document.getString("userId"));
		String userName = document.getString("userName");
		
		lockcard lockcard = this.lock.getLockcardByCardCode(cardCode);
		
		int intresult = 0;
		if(lockcard!=null){
			intresult = this.lock.updateLockCardState(lockcard.getLockCardId(), 3, Long.valueOf(userId).intValue(), userName);
		}
		
		if(intresult > 0){
			rm.setComIdentity("1");
			rm.setComInfo("103");//注销卡成功
			this.handler.toSelf(new TextMessage(JSON.toJSONString(rm)), comCode);
		}else{
			rm.setComIdentity("1");
			rm.setComInfo("193");//注销卡失败
			this.handler.toSelf(new TextMessage(JSON.toJSONString(rm)), comCode);
		}
		
		MongoHandler.deleteMongo("cancelCard", "eventCode", eventCode, 2);
		return "1";
	}
	
	/**
	 * create : 2017-02-20
	 * 修改门锁卡状态
	 * @author wyx
	 * @param request
	 * @param lockCardId
	 * @return
	 */
	@RequestMapping(value="/updateLockState",method=RequestMethod.POST)
	@ResponseBody
	public int updateLockState(HttpServletRequest request,
			Long lockCardId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "updateLockState")){
			return -3333;
            //return "-3333";
		}
		return this.lock.updateLockCardState(lockCardId, 4, clspubcontrollerfunc.intNowUserId(request), clspubcontrollerfunc.strNowUnm(request));
	}
	
	
	/**
	 * create:2017-02-21
	 * 根据roomid获取该房间下有效门卡信息
	 * @author wyx
	 * @param roomId
	 * @return List<lockcard>
	 */
	@RequestMapping(value="/getLockCardByRoomId",method=RequestMethod.POST)
	@ResponseBody
	public String getLockCardByRoomId(HttpServletRequest request,
			Long roomId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getLockCardByRoomId")){
			//return -3333;
            return "-3333";
		}
		List<lockcard> lockcards = this.lock.selectLockCard(roomId.intValue(), 2);
		return JSON.toJSONString(lockcards);
	}
	
	class returnModel{
		private String comInfo;
		private String comIdentity;
		
		

		public String getComIdentity() {
			return comIdentity;
		}

		public void setComIdentity(String comIdentity) {
			this.comIdentity = comIdentity;
		}

		public String getComInfo() {
			return comInfo;
		}

		public void setComInfo(String comInfo) {
			this.comInfo = comInfo;
		}
		
	}
	
	
	/**
	 * create:2017-05-16
	 * 根据 账单id 和 房间id 查询宾客以及卡信息
	 * @param request
	 * @param receptionId
	 * @param roomId
	 * @return
	 */
	@RequestMapping(value="/getCreateCardInfoByReceptionIdAndRoomId",method=RequestMethod.POST)
	@ResponseBody
	public String getCreateCardInfoByReceptionIdAndRoomId(HttpServletRequest request,
			Long receptionId,
			Long roomId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getCreateCardInfoByReceptionIdAndRoomId")){
			//return -3333;
            return "-3333";
		}
		Long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerCreateCard> ppcs = this.lock.getCreateCardInfoByReceptionIdAndRoomId(hotelId, receptionId, roomId);
		return JSON.toJSONString(ppcs);
	}
}
