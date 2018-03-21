package com.kzhotel.controller;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.per.PerEaporPush;
import com.kzhotel.pojo.hotel;
import com.kzhotel.service.IHotelService;

import me.persevere.util.SimpleDateHandler;
import net.kzhotel.BLLI.NetIBllMessage;
import net.kzhotel.per.PerMessage;
import net.kzhotel.per.VBill;
import net.kzhotel.pojo.Messages;
import net.kzhotel.pojo.users;
import net.kzhotel.service.IMessageService;
import net.kzhotel.service.IUsersService;


@Controller
@RequestMapping(value = "/push")
public class PushController {
	
	@Resource
	private IUsersService netUsersService;
	@Resource
	private IHotelService hotelService;
	@Resource
	private IMessageService messageService;
	@Resource
	private IBllUser bllUser;
	@Resource
	private NetIBllMessage netBllMessage;

	/**
	 * 活动消息推送
	 * @param request
	 * @param type
	 * @param theme
	 * @param time
	 * @param address
	 * @param detail
	 * @return
	 */
	@RequestMapping(value = {"/activityPush"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int activityPush(HttpServletRequest request,
			int type,/*1 本店会员  2储值会员  3都有*/
			String theme,
			String time,
			String address,
			String detail
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "activityPush")){
			return -3333;
		}
		hotel hotel = this.hotelService.getHotelById(clspubcontrollerfunc.intNowHotelId(request));
		long shopId = hotel.getKezhuShopId() == null ? 0L : hotel.getKezhuShopId();
		VBill<PerMessage> perMessages = this.netBllMessage.listMessage(shopId, "", 0, 99, 0L);
		LocalDateTime date = SimpleDateHandler.String2LocalDateTime(perMessages.getData().get(0).getPushTime(), "yyyy-MM-dd HH:mm:ss");
		Duration duration = Duration.between(date,LocalDateTime.now());
		if(duration.toDays() < 14){
			//两次活动间隔时间不足两周，无法推送
			return -1;
		}
		List<users> usersList = null;
		String pushType = "";
		switch (type) {
		case 1:
			usersList = this.netUsersService.getHomeUsers(hotel.getKezhuShopId());
			pushType = "push_home";
			break;
		case 2:
			usersList = this.netUsersService.getStoreUsers(hotel.getKezhuShopId());
			pushType = "push_card";
			break;
		case 3:
			usersList = this.netUsersService.getHomeStore(hotel.getKezhuShopId());
			pushType = "push_all";
			break;
		}
		for(users u : usersList){
			PerEaporPush.pushKezhuActivityChange(hotel.getHotelName(), theme, time, address, detail, u.getWechatOpenid());
			PerEaporPush.pushEaporActivityChange(hotel.getHotelName(), theme, time, address, detail, u.getEbWechatOpenid());
		}
		Messages messages = new Messages();
		messages.setCreateTime(new Date());
		messages.setParentId(0L);
		messages.setFromId((long)clspubcontrollerfunc.intNowUserId(request));
		messages.setType(pushType);
		messages.setMessage(detail);
		messages.setShopId(hotel.getKezhuShopId());
		messages.setToId(0L);
		messages.setToNum(usersList.size());
		return this.messageService.insertSelective(messages);
	}
	
	
	/**
	 * 获取推送消息数量
	 * @param request
	 * @return
	 */
	@RequestMapping(value = {"/selectCount"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int selectCount(HttpServletRequest request, String content){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "selectCount")){
			return -3333;
		}
		hotel hotel = this.hotelService.getHotelById(clspubcontrollerfunc.intNowHotelId(request));
		return this.messageService.selectCount(hotel.getKezhuShopId(), content);
	}
	
	/**
	 * 获取推送消息列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @return
	 */
	@RequestMapping(value = {"/selectPage"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String selectPage(HttpServletRequest request,String content, int offset, int limit, long maxId){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "selectPage")){
			return "-3333";
		}
		hotel hotel = this.hotelService.getHotelById(clspubcontrollerfunc.intNowHotelId(request));
		Long shopId = hotel.getKezhuShopId();
		if(shopId == null || shopId.intValue() == 0){
			//该酒店下无客主绑定商家，无法推送
			return "-1";
		}
		return JSON.toJSONString(this.netBllMessage.listMessage(shopId, content, offset, limit, maxId));
		
	}
}
