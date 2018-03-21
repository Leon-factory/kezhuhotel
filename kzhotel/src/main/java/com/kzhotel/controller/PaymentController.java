package com.kzhotel.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllPayment;
import com.kzhotel.BLLI.IBllShift;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.per.PerEaporPush;
import com.kzhotel.pojo.hotel;
import com.kzhotel.pojo.payment;
import com.kzhotel.pojo.user;
import com.kzhotel.service.IHotelService;
import com.kzhotel.service.IPaymentService;
import com.kzhotel.service.IUserService;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.MongoHandler;
import me.persevere.util.SimpleDateHandler;
import net.kzhotel.BLLI.NetIBllShops;
import net.kzhotel.BLLI.NetIBllUsers;
import net.kzhotel.model.ShopUser;
import net.kzhotel.pojo.users;
import net.kzhotel.service.INetPaymentService;
import net.kzhotel.service.IShopsService;
import net.kzhotel.service.IUsersService;

@Controller
@RequestMapping("/payment")
public class PaymentController {
	
	
	@Resource
	private IBllPayment bllPayment;
	@Resource
	private IBllUser  bllUser;
	@Resource
	private NetIBllShops netBllShops;
	@Resource
	private IHotelService hotelService;
	@Resource
	private NetIBllUsers netBllUsers;
	@Resource
	private IShopsService shopsService;
	@Resource
	private IUsersService netUsersService;
	@Resource
	private IPaymentService paymentService;
	@Resource
	private IUserService userService;
	@Resource
	private INetPaymentService netPaymentService;
	@Resource
	private IBllShift bllShift;


	/**
	 * 支付列表
	 * update:2017-02-23
	 * 修改参数
	 * @param request
	 * @param billId
	 * @param receptionPageNumber
	 * @return
	 */
	@RequestMapping(value="/listPaymentByBillId", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listPaymentByBillId(HttpServletRequest request,
			long billId,    /*单据id*/
			int receptionPageNumber	/*账页编号，从1开始 ，0代表全部*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listPaymentByBillId")){
	        return "-3333";
		}
		if(!ValidationStrComp.checkNumber(receptionPageNumber) || !ValidationStrComp.checkNumber(billId)){
			return "-201";
		}
		List<payment> lstpf = this.bllPayment.listPaymentByBillId(billId,receptionPageNumber);
		return JSON.toJSONString(lstpf);
	}
	
	
	/**
	 * create:2017-02-23
	 * 修改支付的账页编号。
	 * @author wyx
	 * @param request
	 * @param paymentId
	 * @param receptionPageNumber
	 * @return
	 */
	@RequestMapping(value="/modifyPaymentDetailPageNumber",method=RequestMethod.POST)
	@ResponseBody
	public int modifyPaymentDetailPageNumber(HttpServletRequest request,
			long paymentId,
			int receptionPageNumber
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "modifyPaymentDetailPageNumber")){
	        return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(receptionPageNumber) || !ValidationStrComp.checkNumber(paymentId)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllPayment.modifyPaymentDetailPageNumber(hotelId, paymentId, receptionPageNumber);
		
	}
	
	
	/**
	 * 会员消费页面显示最近消费记录
	 * @param shopId 客主商家id
	 * @return
	 */
	@RequestMapping(value = "/listPayments",produces = "application/json; charset=utf-8", method = {RequestMethod.POST})
	@ResponseBody
	public String listPayments(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listPayments")){
	        return "-3333";
		}
		hotel hotel = this.hotelService.getHotelById(clspubcontrollerfunc.intNowHotelId(request));
		long userId = (long)clspubcontrollerfunc.intNowUserId(request);
		user user = this.userService.selectByPrimaryKey(userId);
		return JSON.toJSONString(this.netBllShops.listPayments(
				hotel.getKezhuShopId() == null ? 0L : hotel.getKezhuShopId(), 
						user.getKezhuUserId() == null ? 0L : user.getKezhuUserId()
						));
	}
	
	
	
	
	
	/**
	 * 会员储值页面显示最近储值记录
	 * @param shopId 客主商家id
	 * @return
	 */
	@RequestMapping(value = "/listRecharge",produces = "application/json; charset=utf-8", method = {RequestMethod.POST})
	@ResponseBody
	public String listRecharge(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listRecharge")){
	        return "-3333";
		}
		hotel hotel = this.hotelService.getHotelById(clspubcontrollerfunc.intNowHotelId(request));
		long userId = (long)clspubcontrollerfunc.intNowUserId(request);
		user user = this.userService.selectByPrimaryKey(userId);
		return JSON.toJSONString(this.netBllShops.listRecharge(
				hotel.getKezhuShopId() == null ? 0L : hotel.getKezhuShopId(), 
						user.getKezhuUserId() == null ? 0L : user.getKezhuUserId()
						));
	}
	
	/**
	 * 客主消费
	 * @param request
	 * @param type
	 * @param entity
	 * @param phone
	 * @param matchCode
	 * @param amount
	 * @param remark
	 * @return
	 * 			-1,查询不到顾客信息
	 * 			-2,查询不到用户注册商家信息
	 * 			-3,查询不到消费商家信息
	 * 			-4,余额不足
	 * 			-5,未知操作者
	 * 			-6,操作失败
	 * 			-7,验证码不正确
	 * 			-8,验证码过期
	 * 			-9,3分钟内请勿再次充值
	 */
	@RequestMapping(value = "/kezhuConsume",produces = "application/json; charset=utf-8", method = {RequestMethod.POST})
	@ResponseBody
	public int kezhuConsume(HttpServletRequest request,
			int type,/*3储值  2积分  1现金*/
			String entity,
			String phone,
			String matchCode,
			int amount,
			String remark
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "kezhuConsume")){
	        return -3333;
		}
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		hotel hotel = this.hotelService.getHotelById(clspubcontrollerfunc.intNowHotelId(request));
		user user = this.userService.selectByPrimaryKey(createUserId);
		ShopUser shopUser = new ShopUser();
		shopUser.setShopId(hotel.getKezhuShopId());
		shopUser.setId(user.getKezhuUserId());
		Map<String, Double> resultMap = null;
		users users = this.netUsersService.getUserByPhone(phone);
				
		String strType = "";
		switch (type) {
		case 3:
			strType = "card";
			break;
		case 2:
			strType = "point";
			break;
		case 1:
			strType = "cash";
			break;
		}
		Date before = this.netPaymentService.getRecentPaymentTime((double)amount, user.getKezhuUserId(), strType, users.getId(), users.getShopId(), null);
		if(before != null){
			if( SimpleDateHandler.getMinuteBetweenTwoDates(new Date(), before) > -5){
				//5分钟内请勿再次充值
				return -9;
			};
		}
		if(remark == null || "".equals(remark)){
			remark = "驿宝消费";
		}
		String kezhuResult = "";
		String eaporResult = "";
		if(!"".equals(entity)){
			//有实体卡
			String guestPhone = this.netBllUsers.getMemberPhoneByVipcard(entity);
			if(guestPhone.equals(phone)){
				switch (type) {
				case 1:
					//现金
					resultMap = this.shopsService.cashConsume(shopUser, phone, ((double)amount)/100, remark);
					int r1 = resultMap.get("result").intValue();
					if(r1 > 0){
						//修改matchCode
						this.netUsersService.getMatchCode(phone);
						eaporResult = PerEaporPush.pushEaporAccountChangeByCash(phone, hotel.getHotelName(), amount, resultMap.get("pointsReturned"), users.getEbWechatOpenid());
						kezhuResult = PerEaporPush.pushKezhuAccountChangeByCash(phone, hotel.getHotelName(), amount, resultMap.get("pointsReturned"), users.getWechatOpenid());
					}else if(r1 == -10){
						return -9;
					}else if(r1 == -9){
						return -10;
					}
					return r1;
				case 2:
					//积分
					resultMap = this.shopsService.pointConsume(shopUser, phone, amount/100, remark);
					int r2 = resultMap.get("result").intValue();
					if(r2 > 0){
						//修改matchCode
						this.netUsersService.getMatchCode(phone);
						eaporResult = PerEaporPush.pushEaporAccountChangeByPoint(phone, hotel.getHotelName(), ((double)amount), resultMap.get("pointsReturned"), users.getEbWechatOpenid());
						kezhuResult = PerEaporPush.pushKezhuAccountChangeByPoint(phone, hotel.getHotelName(), ((double)amount), resultMap.get("pointsReturned"), users.getWechatOpenid());
					}else if(r2 == -10){
						return -9;
					}else if(r2 == -9){
						return -10;
					}
					
					return r2;
				case 3:
					//储值
					int r3 =  this.shopsService.storeConsume(shopUser, phone, ((double)amount)/100, remark);
					if(r3 > 0){
						//修改matchCode
						this.netUsersService.getMatchCode(phone);
						eaporResult = PerEaporPush.pushEaporAccountChangeByStore(phone, hotel.getHotelName(), ((double)amount),  users.getEbWechatOpenid());
						kezhuResult = PerEaporPush.pushKezhuAccountChangeByStore(phone, hotel.getHotelName(), ((double)amount),  users.getWechatOpenid());
					}else if(r3 == -10){
						return -9;
					}else if(r3 == -9){
						return -10;
					}
					return r3;
				}
				Map<String, String> map = new HashMap<>();
				map.put("kezhuResult", kezhuResult);
				map.put("eaporResult", eaporResult);
				map.put("phone", phone);
				map.put("matchCode", matchCode);
				map.put("type", "消费");
				map.put("comment", "驿宝网页端");
				MongoHandler.insertMongoByMaps("pushResult", map);
			}
		}else{
			boolean result;
			if("0000".equals(matchCode)){
				result = true;
			}else{
				result  = this.netUsersService.checkMatchCode(phone, matchCode);
			}
			if(result){
				if(!"0000".equals(matchCode)){
					int time = SimpleDateHandler.getMinuteBetweenTwoDates(new Date(), users.getMatchTime());
					if(time < 0){
						//验证码过期
						return -8;
					}
				}
				switch (type) {
				case 1:
					//现金
					resultMap = this.shopsService.cashConsume(shopUser, phone, ((double)amount)/100, remark);
					int r1 = resultMap.get("result").intValue();
					if(r1 > 0){
						//修改matchCode
						this.netUsersService.getMatchCode(phone);
						eaporResult = PerEaporPush.pushEaporAccountChangeByCash(phone, hotel.getHotelName(), ((double)amount), resultMap.get("pointsReturned"), users.getEbWechatOpenid());
						kezhuResult = PerEaporPush.pushKezhuAccountChangeByCash(phone, hotel.getHotelName(), ((double)amount), resultMap.get("pointsReturned"), users.getWechatOpenid());
					}
					return r1 == -10 ? -9 : r1;
				case 2:
					//积分
					resultMap = this.shopsService.pointConsume(shopUser, phone, ((double)amount)/100, remark);
					int r2 = resultMap.get("result").intValue();
					if(r2 > 0){
						//修改matchCode
						this.netUsersService.getMatchCode(phone);
						eaporResult = PerEaporPush.pushEaporAccountChangeByPoint(phone, hotel.getHotelName(), ((double)amount), resultMap.get("pointsReturned"), users.getEbWechatOpenid());
						kezhuResult = PerEaporPush.pushKezhuAccountChangeByPoint(phone, hotel.getHotelName(), ((double)amount), resultMap.get("pointsReturned"), users.getWechatOpenid());
					}
					return r2 == -10 ? -9 : r2;
				case 3:
					//储值
					int r3 =  this.shopsService.storeConsume(shopUser, phone, ((double)amount)/100, remark);
					if(r3 > 0){
						//修改matchCode
						this.netUsersService.getMatchCode(phone);
						eaporResult = PerEaporPush.pushEaporAccountChangeByStore(phone, hotel.getHotelName(), ((double)amount),  users.getEbWechatOpenid());
						kezhuResult = PerEaporPush.pushKezhuAccountChangeByStore(phone, hotel.getHotelName(), ((double)amount),  users.getWechatOpenid());
					}
					return r3 == -10 ? -9 : r3;
				}
				Map<String, String> map = new HashMap<>();
				map.put("kezhuResult", kezhuResult);
				map.put("eaporResult", eaporResult);
				map.put("phone", phone);
				map.put("matchCode", matchCode);
				map.put("type", "消费");
				map.put("comment", "驿宝网页端");
				MongoHandler.insertMongoByMaps("pushResult", map);
			}else{
				//验证码不正确
				return -7;
			}
		}
		return -6;
	}
	
}
