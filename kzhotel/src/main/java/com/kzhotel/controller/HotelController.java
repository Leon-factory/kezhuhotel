package com.kzhotel.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.eapor.service.ITestService;
import com.kzhotel.BLLI.IBllGuest;
import com.kzhotel.BLLI.IBllShift;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.join.guestinfodetail;
import com.kzhotel.pojo.hotel;
import com.kzhotel.pojo.user;
import com.kzhotel.per.ppmBusiness;
import com.kzhotel.service.IHotelService;
import com.kzhotel.service.IHotelTestService;
import com.kzhotel.service.IUserService;
import com.pub.validation.ValidationStrComp;

import net.kzhotel.BLLI.NetIBllShops;
import net.kzhotel.BLLI.NetIBllUsers;
import net.kzhotel.model.MemberDetail;
import net.kzhotel.model.ShopUser;
import net.kzhotel.per.VBill;
import net.kzhotel.pojo.shops;
import net.kzhotel.pojo.users;
import net.kzhotel.service.IShopsService;
import net.kzhotel.service.IUsersService;


@Controller
@RequestMapping("/hotel")
public class HotelController {
	@Resource
	private IHotelService hotelService;
	@Resource
	private NetIBllShops netshops;
	@Resource
	private NetIBllUsers netbllusers;
	@Resource
	private IBllUser bllUser;
	@Resource
	private IShopsService shopsService;
	@Resource
	private IUsersService usersService;
	@Resource
	private ITestService testService;
	@Resource
	private IHotelTestService hotelTestService;
	@Resource
	private IUserService userService;
	@Resource
	private IBllGuest bllGuest;
	@Resource
	private IBllShift bllShift;

	
	/**
	 * 获取酒店信息
	 * @param request
	 * @param model
	 * @return
	 */
	@RequestMapping(value="/hotelbyid", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String hotelbyid(HttpServletRequest request,Model model){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "hotelbyid")){
            return "-3333";
		}
		int hotelId =clspubcontrollerfunc.intNowHotelId(request);
		hotel pjhotel = this.hotelService.getHotelById(hotelId);
		ppmBusiness ppmb=new ppmBusiness();
		if(pjhotel!=null){
			ppmb.setBusinessId(pjhotel.getHotelId());
			ppmb.setBusinessName(pjhotel.getHotelName());
			ppmb.setBusinessContact(pjhotel.getContact());
			ppmb.setBusinessMobile(pjhotel.getMobile());
			ppmb.setBusinessEmali(pjhotel.getEmail());
			ppmb.setBusinessLong(pjhotel.getLongitude());
			ppmb.setBusinessLat(pjhotel.getLatitude());
			ppmb.setBusinessAdd(pjhotel.getAddress());
			ppmb.setBusinessReserveTel(pjhotel.getReserveTel());
			ppmb.setBusinessPhoto(pjhotel.getPhoto());
			ppmb.setBusinessBri(pjhotel.getDescription());
			ppmb.setHotelIdentity(pjhotel.getHotelIdentity());
			ppmb.setProvince(pjhotel.getProvince());
			ppmb.setCity(pjhotel.getCity());
			ppmb.setDistrict(pjhotel.getDistrict());
		}
		return JSON.toJSONString(ppmb);
	}
	
	/**
	 * 修改酒店信息
	 * @param request
	 * @param ppmb
	 * @return
	 */
	@RequestMapping(value="/upinfobyid", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String upinfolbyid(HttpServletRequest request,ppmBusiness ppmb){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "upinfobyid")){
			//return -3333;
            return "-3333";
		}
		int intresult =0;
		if(ppmb!=null && ppmb.getBusinessId()!=null){
		    hotel pjhotel = new hotel();
		    int hotelId =clspubcontrollerfunc.intNowHotelId(request);
		    pjhotel.setHotelId((long)hotelId);
		    pjhotel.setHotelName(ppmb.getBusinessName());
		    pjhotel.setContact(ppmb.getBusinessContact());
		    pjhotel.setMobile(ppmb.getBusinessMobile());
		    pjhotel.setAddress(ppmb.getBusinessAdd());
		    pjhotel.setReserveTel(ppmb.getBusinessReserveTel());
		    pjhotel.setEmail(ppmb.getBusinessEmali());
		    pjhotel.setLatitude(ppmb.getBusinessLat());
		    pjhotel.setLongitude(ppmb.getBusinessLong());
		    pjhotel.setPhoto(ppmb.getBusinessPhoto());
		    pjhotel.setDescription(ppmb.getBusinessBri());
		    pjhotel.setHotelIdentity(ppmb.getHotelIdentity());
		    pjhotel.setProvince(ppmb.getProvince());
		    pjhotel.setCity(ppmb.getCity());
		    pjhotel.setDistrict(ppmb.getDistrict());
		    pjhotel.setHotelState(1);
			intresult = this.hotelService.UpInfoById(pjhotel);
			if(intresult > 0){
				//当更新hotel信息成功后，同步到shop
				hotel hotel = this.hotelService.getHotelById(hotelId);
				shops shop = new shops();
				shop.setId(hotel.getKezhuShopId());
				shop.setName(ppmb.getBusinessName());
				shop.setContact(ppmb.getBusinessContact());
				shop.setContactPhone(ppmb.getBusinessMobile());
				shop.setAddress(ppmb.getBusinessAdd());
				shop.setOrderPhone(ppmb.getBusinessReserveTel());
				shop.setEmail(ppmb.getBusinessEmali());
				shop.setLatitude(ppmb.getBusinessLat());
				shop.setLongitude(ppmb.getBusinessLong());
				shop.setPhoto(ppmb.getBusinessPhoto());
				shop.setDesc(ppmb.getBusinessBri());
				shop.setSubtype("hotel");
				shop.setShopType("shop");
				shop.setProvince(ppmb.getProvince());
				shop.setCity(ppmb.getCity());
				shop.setDistrict(ppmb.getDistrict());
				this.shopsService.editShop(shop);
			}
		}
		return String.valueOf(intresult);
	}
	
	
	
	/**
	 * create:2017-03-06
	 * 会员储值
	 * 如果有实体卡号，则手机号允许为空
	 * @author wyx
	 * @param entity
	 * @param phone
	 * @param matchCode
	 * @param actual
	 * @param recharge
	 * @param remark
	 * @return   
	 * 	 -1,查询不到顾客信息
	 * 	 -2,查询不到用户注册商家信息
	 * 	 -3,查询不到消费商家信息
	 * 	 -4,余额不足
	 * 	 -5,未知操作者
	 * 	 -6,实体卡号不正确；
	 * 	 -7,验证码不正确
	 * 	 -8,验证码过期
	 * 	 -9,5分钟内请勿再次充值
	 * 	 -10,用户正在进行充值消费操作中，请稍候重试
	 */
	@RequestMapping(value="/memberStore",method=RequestMethod.POST)
	@ResponseBody
	public int memberStore(HttpServletRequest request,
			String entity,/*实体卡*/
			String phone,
			String matchCode,/*匹配码*/
			Long actual,/*实收金额*/
			Long recharge,/*充值金额*/
			String remark/*备注*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "memberStore")){
			return -3333;
		}
		
		user user = this.userService.selectByPrimaryKey((long)clspubcontrollerfunc.intNowUserId(request));
		Long kezhuUserId = user.getKezhuUserId();
		if(kezhuUserId == null){
			kezhuUserId = 0L;
		}
		users users = this.netbllusers.getUsersById(kezhuUserId);
		if(users != null){
			if("shop_front".equals(users.getUserType())){
				return -3333;
			}
		}
		if(remark == null || "".equals(remark)){
			remark = "驿宝充值";
		}
		return this.netshops.cardStore(entity, phone, matchCode, actual, recharge, remark, kezhuUserId,(long)clspubcontrollerfunc.intNowHotelId(request), (long)clspubcontrollerfunc.intNowUserId(request), clspubcontrollerfunc.strNowUnm(request));
	}
	
	
	/**
	 * create:2017-03-10
	 * 获得本店会员本店储值会员的总数
	 * @param hotelId
	 * @param membername
	 * @param phone
	 * @return
	 */
	@RequestMapping(value="/getMemberCount",method=RequestMethod.POST)
	@ResponseBody
	public int getMemberCount(HttpServletRequest request,
			Long hotelId,
			String membername,//按会员昵称模糊查询
			String phone//按会员手机号模糊查询
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getMemberCount")){
			return -3333;
		}
		return this.netbllusers.getMemberCount(hotelId, membername, phone);
		
	}
	
	
	/**
	 * create:2017-03-10
	 * 列出本店会员本店储值会员列表
	 * 取消rfm字段
	 * @param hotelId
	 * @param membername
	 * @param phone
	 * @param offset
	 * @param limit
	 * @return
	 */
	@RequestMapping(value="/listMemberPage",method=RequestMethod.POST)
	@ResponseBody
	public String listMemberPage(HttpServletRequest request,
			String membername,
			String phone,//按会员手机号模糊查询
			int offset,
			int limit,
			long maxId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listMemberPage")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(membername)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkMobile(phone)){
			return "-301";
		}
		hotel hotel = this.hotelService.getHotelById(clspubcontrollerfunc.intNowHotelId(request));
		Long shopId = hotel.getKezhuShopId();
		if(shopId == null){
			shopId = 0L;
		}
		VBill<MemberDetail> vBill = this.netbllusers.listMemberPage(hotel.getHotelId(), shopId, membername, phone, offset, limit, maxId);
		return JSON.toJSONString(vBill);
		
	}
	
	
	/**
	 * create:2017-07-28
	 * 绑定实体卡
	 * @param request
	 * @param userId
	 * @param vipcard
	 * @param vipcardface
	 * @return
	 */
	@RequestMapping(value = {"/bindVipcard"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int bindVipcard(HttpServletRequest request,
			long userId,//会员id
			String vipcard,//实体卡号
			String vipcardface//卡的编号
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "bindVipcard")){
            return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(userId)){
			return -201;
		}
		
		return this.usersService.bindVipcard(userId, vipcard, vipcardface);
		
	}
	
	
	/**
	 * create:2017-07-28
	 * 取消绑定实体卡
	 * @param request
	 * @param userId
	 * @return
	 */
	@RequestMapping(value = {"/unbindVipcard"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int unbindVipcard(HttpServletRequest request,
			long userId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "unbindVipcard")){
            return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(userId)){
			return -201;
		}
		
		return this.usersService.unbindVipcard(userId);
	}
	
	
	/**
	 * create:2017-07-28
	 * 客户经理列表
	 * @param shopId
	 * @return
	 */
	@RequestMapping(value = {"/getShopUserList"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getShopUserList(HttpServletRequest request){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getShopUserList")){
            return "-3333";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		hotel hotel = this.hotelService.getHotelById(hotelId);
		List<ShopUser> shopUsers = this.shopsService.getShopUserList(hotel.getKezhuShopId());
		
		return JSON.toJSONString(shopUsers);
		
	}
	
	/**
	 * create:2017-07-28
	 * 指定客户经理
	 * @param userId
	 * @param clientmanagerId
	 * @param clientmanagerName
	 * @return
	 */
	@RequestMapping(value = {"/modifyManager"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int modifyManager(
			HttpServletRequest request,
    		long userId,
    		String userName,
    		long clientmanagerId,//客户经理用户Id
    		String clientmanagerName//客户经理用户名
    		){
	
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "modifyManager")){
            return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(userId) || !ValidationStrComp.checkNumber(clientmanagerId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(clientmanagerName)){
			return -111;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllUser.modifyManager(hotelId, userId, userName, clientmanagerId, clientmanagerName);
	}
	
	/**
	 * 根据手机号获取用户
	 * @param request
	 * @param phone
	 * @return
	 */
	@RequestMapping(value = {"/getUsersByPhone"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getUsersByPhone(HttpServletRequest request,String phone){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getUsersByPhone")){
			return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		users users = this.netbllusers.getUsersByPhone(phone);
		if(users != null){
			if(users.getIdCard() == null || "".equals(users.getIdCard())){
				guestinfodetail guestinfodetail = this.bllGuest.listGuestByPhone(phone, hotelId);
				if(guestinfodetail != null){
					users.setIdCard(guestinfodetail.getIdentitycardnumber());
				}
			}
		}
		
		return JSON.toJSONString(users);
	}
	
	
	@RequestMapping(value = {"/eblistId"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.GET})
	@ResponseBody
	public String eblistId(HttpServletRequest request,String phone){
		List<Integer> ints = testService.listId();
		return JSON.toJSONString(ints);
	}
	
	
	@RequestMapping(value = {"/hotellistId"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.GET})
	@ResponseBody
	public String hotellistId(){
		List<Integer> ints = hotelTestService.listId();
		return JSON.toJSONString(ints);
	}
	
	/**
	 * 根据实体卡号获取手机号和匹配码
	 * @param entity
	 * @return
	 */
	@RequestMapping(value = "/getPhoneAndMatchCode")
	@ResponseBody
	public String getPhoneAndMatchCode(HttpServletRequest request, String entity){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getPhoneAndMatchCode")){
			return "-3333";
		}
		String phone = netbllusers.getMemberPhoneByVipcard(entity);
		if(phone == null || "".equals(phone)){
			return "-1";
		}
		users users = netbllusers.getUsersByPhone(phone);
		if(users == null){
			return "-2";
		}
		Map<String, String> map = new HashMap<>();
		map.put("phone", phone);
		map.put("matchCode", users.getMatchCode());
		return JSON.toJSONString(map);
	}
	
	
	@RequestMapping(value = "/getKezhuShopId")
	@ResponseBody
	public long getKezhuShopId(HttpServletRequest request){
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		hotel hotel = this.hotelService.getHotelById(hotelId);
		if(hotel == null){
			return 0L;
		}
		long kezhuShopId = hotel.getKezhuShopId() == null ? 0L : hotel.getKezhuShopId();
		return kezhuShopId;
	}
	
	
	
	
	
}
