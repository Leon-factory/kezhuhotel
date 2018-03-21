package com.kzhotel.controller;

import java.util.Date;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.eapor.BLLI.IBllBqReserve;
import com.eapor.bean.PerBqReserve;
import com.kzhotel.BLLI.IBllUser;

@Controller
@RequestMapping(value = "/bqReserve")
public class BqReserveController {
	
	@Resource
	private IBllBqReserve bllBqReserve;
	@Resource
	private IBllUser bllUser;
	
	/**
	 * 创建预订单
	 * @param request
	 * @param pbr：
	 * 			long bqRestaurantId,餐宴 会馆id
	 *			String expectedArrivalTime,预计抵达时间
	 *			int peopleNumer,/*人数
	 *			String contactName,/*联系人姓名
	 *			String contactPhone,/*联系人手机
	 *			String remark/*预订备注
	 * @return
	 * 			-1:该会馆不存在
	 * 			-2:异常
	 * 			-3：预计到达时间不正确
	 */
	@RequestMapping(value = {"/createBqReserve"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int createBqReserve(
			HttpServletRequest request,
			PerBqReserve pbr
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "createBqReserve")){
			return -3333;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		pbr.setHotelId(hotelId);
		pbr.setCreateUserId(createUserId);
		pbr.setCreateUserName(createUserName);
		pbr.setDBcreateTime(new Date());
		return this.bllBqReserve.createBqReserve(pbr);
		
	}
	
	/**
	 * 修改预订单
	 * @param request
	 * @param pbr:
	 * 			bqReserveId 餐宴预订id
	 * 			bqReservePeopleNumber 餐宴预订人数
	 * 			remark 预订备注
	 * 			orderState 订单状态  1有效  2开台  3取消
	 * @return
	 */
	@RequestMapping(value = {"/updateBqReserve"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int updateBqReserve(
			HttpServletRequest request,
			PerBqReserve pbr
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "updateBqReserve")){
			return -3333;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUserName = clspubcontrollerfunc.strNowUnm(request);
		pbr.setHotelId(hotelId);
		pbr.setModifyUserId(modifyUserId);
		pbr.setModifyUserName(modifyUserName);
		pbr.setDBmodifyTime(new Date());
		return this.bllBqReserve.updateBqReserve(pbr);
		
	}
	
	/**
	 * 根据房间信息获取该房间的预订信息（主要用于预订单开台后的局部刷新）
	 * @param bqRestaurantId
	 * @return
	 */
	@RequestMapping(value = {"/getBqReserveInfoByBqRestaurant"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getBqReserveInfoByBqRestaurant(
			HttpServletRequest request,
			long bqRestaurantId
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getBqReserveInfoByBqRestaurant")){
            return "-3333";
		}
		
		return JSON.toJSONString(this.bllBqReserve.getBqReserveInfoByBqRestaurant(bqRestaurantId));
		
	}

}
