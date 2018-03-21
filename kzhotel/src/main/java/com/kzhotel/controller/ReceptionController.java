package com.kzhotel.controller;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.PubJavadill.java.ClsJsonToBean;
import com.PubJavadill.java.CmpLocalDT;
import com.alibaba.fastjson.JSON;
import com.eapor.BLLI.IBllBanquetReception;
import com.eapor.bean.PerBanquetPayment;
import com.google.gson.reflect.TypeToken;
import com.kzhotel.BLLI.IBllGuest;
import com.kzhotel.BLLI.IBllReception;
import com.kzhotel.BLLI.IBllShift;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.controller.conversion.ConversionRent;
import com.kzhotel.controller.conversion.ConversionTimePriceRange;
import com.kzhotel.model.ReceptionDetail;
import com.kzhotel.model.ReceptionGuest;
import com.kzhotel.model.TimePriceRange;
import com.kzhotel.model.extend.ReceptionGuestChild;
import com.kzhotel.per.ContinueRoom;
import com.kzhotel.per.PerPaymentAndConsume;
import com.kzhotel.per.PerReception;
import com.kzhotel.per.PerRecetionInfo;
import com.kzhotel.pojo.consumeitem;
import com.kzhotel.pojo.guest;
import com.kzhotel.pojo.payment;
import com.kzhotel.pojo.rent;
import com.kzhotel.pojo.succession;
import com.kzhotel.service.IGuestService;
import com.kzhotel.view.VExtendRent;
import com.kzhotel.view.VOpenRoom;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.ClassTransfer;
import me.persevere.util.SimpleDateHandler;


@Controller
@RequestMapping("/reception")
public class ReceptionController {
	@Resource
	private IBllReception bllReception;
	@Resource
	private IBllShift bllShift;
	@Resource
	private IBllUser bllUser;
	@Resource
	private IBllGuest bllGuest;
	@Resource
	private IGuestService guestService;
	@Resource
	private IBllBanquetReception bllBanquetReception;	


	/**
	 * create:2017-02-22
	 * 新增客单 ，即新增账簿
	 * @param hotelId
	 * @param channelId
	 * @param memberPhone
	 * @param rcpGuestList : 住客对象参照 createRentReception的ReceptionGuest对象
	 * @param useChannelCredit
	 * @param createUserId
	 * @param createUsername
	 * @return
	 * 修改：
	 * 2017-04-18:添加参数 comment
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
		    long channelId,/*渠道id*/
		    String memberPhone,/*客源为会员时,对应客主会员手机号，可为null*/
		    String rcpGuestList,/*宾客列表*/
		    int useChannelCredit,/*是否挂账 0否，1是*/
		    String comment
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addReception")){
			return -3333;
		}
		int createUserId=clspubcontrollerfunc.intNowUserId(request);
		String createUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		Long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		if( !ValidationStrComp.checkNumber(channelId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkMobile(memberPhone)){
			return -301;
		}
		
		List<ReceptionGuest> rGuests = ClsJsonToBean.LstFromJson(rcpGuestList, new TypeToken<ArrayList<ReceptionGuest>>(){}.getType());
		guest guest = null;
		for(ReceptionGuest rg:rGuests){
			guest = new guest();
			guest.setGuestName(rg.getGuestName());
			guest.setPhone(rg.getPhone());
		}
		return this.bllReception.AddReception(hotelId, channelId, memberPhone, guest, useChannelCredit,(long) createUserId, createUsername, comment);
	}

	
	/**
	 * 保存租住客单
	 *	rent  租住房间对象：
	 *	checkinOperator  开房员username
	 *	checkinType		入住方式：1全日房2终点房3晚房
	 *	expectedStayNumber	预计停留数
	 *	expectedLeaveTime	预计离开时间
	 *	roomId				房间id
	 *	roomCode			房间编号
	 *	roomtypeId			房型id
	 *	roomtypeName		房型名称
	 *	reservedetailId		如果由预定入住，则传入订项id
	 *	
	 *	ReceptionGuest 住客对象：
	 *	guestName	顾客姓名
	 *	firstName	姓
	 *	lastName	名
	 *	phone		手机
	 *	email		邮箱
	 *	address		地址
	 *	certificateType		证件类型
	 *	certificateCode		证件号码
	 *	nation	民族
	 *	startTimeLimit	开始期限
	 *	stopTimeLimit	结束期限
	 *	issuedOffice	签发机关
	 *	Date birthday	出生日期
	 *	photo	照片存放路径
	 *	roomId				房间id
	 *	roomCode			房间编号
	 *	guestId			有顾客id则不新增
	 *
	 *	payment 押金支付
	 *	paymethodId		支付方式id
	 *	paymethodName	支付方式名称
	 *	amount			支付金额（分）
	 *	scene	支付场景
	 * @param request
	 * @param linkReceptionId
	 * @param linkByReserve
	 * @param channelId
	 * @param memberPhone
	 * @param useChannelCredit
	 * @param rentList
	 * @param livingguestList
	 * @param guarantee_amount
	 * @param paymentList
	 * @param rentplanId
	 * @param comment
	 * @return
	 * 修改：
	 *  2017-01-11 Long reserveDetailId,转入rentList的rent中
	 *	2017-01-23 rent对象增加roomtypeName属性，房型名称。
	 *	2017-02-24  新增scene属性
	 *	2017-04-13  新增guarantee_amount、comment参数
	 */
	@RequestMapping(value="/createRentReception", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int createRentReception(HttpServletRequest request,
			@RequestBody VOpenRoom vOpenRoom
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "createRentReception")){
			return -3333;
		}
		int createUserId=clspubcontrollerfunc.intNowUserId(request);
		String createUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		succession succession = this.bllShift.getActiveSuccession((long)hotelId, (long)createUserId);
		if(succession == null){
			return -3334;
		}
		//reception验证
		List<rent> rents = new ArrayList<rent>();
		List<ConversionRent> conversionRents = ClsJsonToBean.LstFromJson(vOpenRoom.getRentList(),new TypeToken<ArrayList<ConversionRent>>(){}.getType());
		double stayNumber = 0l;
		//转化
		for(ConversionRent cr:conversionRents){
			rent rent = new rent();
			rent = ClassTransfer.conversion(cr, rent);
			stayNumber = rent.getExpectedStayNumber();
			rents.add(rent);
		}
		List<ReceptionGuest> receptionGuests = new ArrayList<ReceptionGuest>();
		List<ReceptionGuestChild> receptionGuestChilds = ClsJsonToBean.LstFromJson(vOpenRoom.getLivingguestList(),new TypeToken<ArrayList<ReceptionGuestChild>>(){}.getType());
		for(ReceptionGuestChild rgc:receptionGuestChilds){
			ReceptionGuest rg = new ReceptionGuest();
			int type = rgc.getCertificateType().intValue();
			String code = rgc.getCertificateCode();
			switch (type) {
			case 1:
				rg.setIdentityCardNumber(code);
				break;
			case 2:
				//护照
				rg.setPassportNumber(code);
				break;
			case 3:
				//军官证
				rg.setOfficerCardNumber(code);
				break;
			}
			
			rg.setChannelId(rgc.getChannelId());
			rg.setEmail(rgc.getEmail());
			rg.setExpressAddress(rgc.getExpressAddress());
			rg.setGroupCode(rgc.getGroupCode());
			rg.setGuestName(rgc.getGuestName());
			rg.setHotelId((long)hotelId);
			rg.setIsPrimary(rgc.getIsPrimary());
			rg.setPhone(rgc.getPhone());
			rg.setReceptionGuestId(rgc.getReceptionGuestId());
			rg.setReceptionId(rgc.getReceptionId());
			rg.setRoomCode(rgc.getRoomCode());
			rg.setRoomId(rgc.getRoomId());
			rg.setSexCode(rgc.getSexCode());
			rg.setTitle(rgc.getTitle());
			receptionGuests.add(rg);
			
		}
		receptionGuests.get(0).setIsPrimary(1);
		List<payment> payments= ClsJsonToBean.LstFromJson(vOpenRoom.getPaymentList(),new TypeToken<ArrayList<payment>>(){}.getType());
		payments.forEach(x->{x.setHotelId((long)hotelId);});
		
		//添加手动修改房价
		ConversionTimePriceRange ctpr = vOpenRoom.getTimePriceRange();
		TimePriceRange tpr = new TimePriceRange();
		tpr.setActualAmount(ctpr.getActualAmount());
		tpr.setPriceList(ctpr.getPriceList());
		tpr.setActualPriceList(ctpr.getActualPriceList());
		tpr.setCheckinTypeList(ctpr.getCheckinTypeList());
		tpr.setNumberList(ctpr.getNumberList());
		tpr.setHasPrice(ctpr.getHasPrice());
		List<LocalDateTime> times = new ArrayList<>();
		for(String str : ctpr.getTimeList()){
			LocalDateTime localDateTime = CmpLocalDT.DateToLocalDateTime(SimpleDateHandler.StringToDateByYMDHMS(str));
			times.add(localDateTime);
		}
		tpr.setTimeList(times);
		
		//验证
		if(stayNumber != times.size()){
			//居住天数不同
			return -1;
		}
		
		if(tpr.getActualAmount() != tpr.getActualPriceList().stream().mapToInt(Integer::intValue).sum()){
			//价格不同
			return -2;
		}
		return this.bllReception.createRentReception((long)hotelId, vOpenRoom.getLinkReceptionId(), vOpenRoom.isLinkByReserve(), vOpenRoom.getChannelId(), vOpenRoom.getMemberPhone(), vOpenRoom.getUseChannelCredit(), rents, receptionGuests, payments,vOpenRoom.getGuarantee_amount(), vOpenRoom.getRentplanId(), (long) createUserId, createUsername,vOpenRoom.getComment(),vOpenRoom.getIsBreakfast(),vOpenRoom.getBreakfastNumber(),tpr);
	}
	
	/**
	 * 续房
	 * @param request
	 * @param rentId
	 * @param newExpectedStayNumber
	 * @param newExpectedLeaveTime
	 * @param paymentList
	 * @return
	 * -6,5分钟之内不允许重复操作
	 */
	@RequestMapping(value="/extendRent", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int changeStay(HttpServletRequest request,
			@RequestBody VExtendRent vExtendRent
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "extendRent")){
			return -3333;
		}
		
		
		int createUserId=clspubcontrollerfunc.intNowUserId(request);
		String createUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		succession s = this.bllShift.getActiveSuccession((long)hotelId, (long)createUserId);
		if(s == null){
			return -3334;
		}
		List<payment> payments = ClsJsonToBean.LstFromJson(vExtendRent.getPaymentList(),new TypeToken<ArrayList<payment>>(){}.getType());
		
		//添加手动修改房价
		ConversionTimePriceRange ctpr = vExtendRent.getTimePriceRange();
		TimePriceRange tpr = new TimePriceRange();
		tpr.setActualAmount(ctpr.getActualAmount());
		tpr.setPriceList(ctpr.getPriceList());
		tpr.setActualPriceList(ctpr.getActualPriceList());
		tpr.setCheckinTypeList(ctpr.getCheckinTypeList());
		tpr.setNumberList(ctpr.getNumberList());
		tpr.setHasPrice(ctpr.getHasPrice());
		List<LocalDateTime> times = new ArrayList<>();
		for(String str : ctpr.getTimeList()){
			LocalDateTime localDateTime = CmpLocalDT.DateToLocalDateTime(SimpleDateHandler.StringToDateByYMDHMS(str));
			times.add(localDateTime);
		}
		tpr.setTimeList(times);
		return this.bllReception.changeStay(
				Integer.valueOf(vExtendRent.getRentId() + ""), 
				vExtendRent.getNewExpectedStayNumber(),
				SimpleDateHandler.StringToDateByYMDHMS(vExtendRent.getNewExpectedLeaveTime()), 
				payments, 
				(long)createUserId, 
				createUsername,
				tpr
				);
		
	}
	
	
	/**
	 * 结账
	 * payment 押金支付
	 * paymethodId		支付方式id
	 * amount			支付金额（分）
	 * @param request
	 * @param receptionId
	 * @param payMentList
	 * @return
	 * -5,5分钟之内不允许重复操作
	 */
	@RequestMapping(value="/checkoutRentReception",method=RequestMethod.POST)
	@ResponseBody
	public int checkoutRentReception(HttpServletRequest request,
			long receptionId,   /*客单id*/
			String payMentList   /*支付列表*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "checkoutRentReception")){
			return -3333;
		}
		long hotelId =(long) clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		if(!ValidationStrComp.checkNumber(receptionId)){
			return -201;
		}
		if(!ValidationStrComp.checkJson(payMentList)){
			return -801;
		}
		
		List<payment> paymentList = ClsJsonToBean.LstFromJson(payMentList, new TypeToken<ArrayList<payment>>(){}.getType() );
		return this.bllReception.checkout(hotelId, receptionId, createUserId, createUsername, paymentList);
	}
	
	
	
	/**
	 * 在住客单列表
	 * update：2017-02-28
	 * 修改：
	 * 2017-02-28：新增receptionType参数
	 * @author wyx
	 * @param request
	 * @param receptionType
	 * @return
	 * @throws ParseException 
	 */
	@RequestMapping(value="/selectReceptionList",method=RequestMethod.POST)
	@ResponseBody
	public String selectReceptionList(HttpServletRequest request,
	    	int receptionState,/*客单状态  1未结  2 已结 0为全部*/
	    	int receptionType,	/*客单类型：1租住客单       2非租住客单  0为全部  */
	    	String createDate,/*创建日期，空为全部 yyyy-MM-dd HH:mm:ss*/
	    	String checkoutDate  /*结账日期，空为全部*/
			) throws ParseException{
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "selectReceptionList")){
			return "-3333";
		}
		int hotelId =  clspubcontrollerfunc.intNowHotelId(request);
		
		if(!ValidationStrComp.checkNumber(receptionState) || !ValidationStrComp.checkNumber(receptionType)){
			return "-201";
		}
		
		List<ReceptionDetail> livingReceptions = this.bllReception.selectReceptionList(
				hotelId, 
				receptionState, 
				receptionType, 
				SimpleDateHandler.StringToDateByYMDHMS(createDate), 
				SimpleDateHandler.StringToDateByYMDHMS(checkoutDate)
				);
		
		return JSON.toJSONString(livingReceptions);
	}
	
	
	/**
	 * create:2017-02-22
	 * 创建匿名加单客单：即开即结
	 * @author wyx
	 * @param hotelId
	 * @param consumedetailList	包括以下：
	 * feeItemCode	费用名称
	   feeItemType	费用类型        商品2,服务3
	   feeItemId	商品id，或服务id,房租为0
	   salePrice	售价
	   number	数量
	   amount	售价  * 数量 
	   unitName	单位
	 * @param warehouseId
	 * @param paymentList	包括以下：
	 * paymethodId		支付方式id
	   amount			支付金额（分） 
	 * @param createUserId
	 * @param createUsername
	 * @return
	 * 修改：
	 * 2017-04-18：添加参数comment
	 */
	@RequestMapping(value="/createAnonymousReception",method=RequestMethod.POST)
	@ResponseBody
	public int createAnonymousReception(HttpServletRequest request,
			String consumedetailList,/*消费列表*/
			int warehouseId,/*0代表默认库*/
			String paymentList,/*押金支付列表*/
			String comment
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "createAnonymousReception")){
			return -3333;
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		if(!ValidationStrComp.checkNumber(Long.valueOf(warehouseId))){
			return -201;
		}
		if(!ValidationStrComp.checkJson(paymentList) || !ValidationStrComp.checkJson(consumedetailList)){
			return -801;
		}
		List<consumeitem> consumedetails = ClsJsonToBean.LstFromJson(consumedetailList, new TypeToken<ArrayList<consumeitem>>(){}.getType());
		if(consumedetails == null){
			return 0;
		}
		List<payment> payments = ClsJsonToBean.LstFromJson(paymentList, new TypeToken<ArrayList<payment>>(){}.getType());
		if(payments == null){
			return 0;
		}
		return this.bllReception.createAnonymousReception((long)hotelId, consumedetails, warehouseId, payments, (long) createUserId, createUsername,comment);
	}
	
	
	/**
	 * create:2017-02-08
	 * 付款
	 * @author WPersevere
	 * @param receptionId
	 * @param payments
	 * @param phone
	 * @param matchCode
	 * @return
	 * 			0:支付失败
	 * 			-1:该账单不存在
	 * 			-2:支付明细为空
	 * 			-3:匹配码不存在，请检查手机号是否正确
	 * 			-4:匹配码不正确
	 * 			-7:该手机号不是客主会员
	 * 			-8:查不到顾客信息
	 * 			-9:查询不到用户注册商家信息
	 * 			-10:查询不到消费商家信息
	 * 			-11:储值余额不足
	 * 			-12:未知操作者
	 * 			-13:5分钟之内不允许重复操作
	 */
	@RequestMapping(value="/addRentPayment",method=RequestMethod.POST)
	@ResponseBody
	public int addRentPayment(HttpServletRequest request,
			long receptionId,//客单id
		    String payments,	/*支付明细*/
		    String phone,/*手机号*/
		    String matchCode/*匹配码*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addRentPayment")){
			return -3333;
		}
		List<payment> paymentList = ClsJsonToBean.LstFromJson(payments, new TypeToken<ArrayList<payment>>(){}.getType());
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllReception.addRentPayment(hotelId, receptionId, paymentList,phone, matchCode, createUserId, createUsername);
	}
	
	/**
	 * update:2017-02-15
	 * @author wyx
	 * 更换租住房间
	 * 不修改房租，变更由加服务单手动调
	 * @param request
	 * @param rentId
	 * @param newRoomId
	 * @param oldRoomStateTo
	 * @return
	 * 修改：
	 * 由rentController移入
	 */
	@RequestMapping(value="/changeRoom", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int changeRoom(HttpServletRequest request,
			long rentId,/*租住id*/
			long newRoomId,/*新房间id*/
			int oldRoomStateTo	/*旧房间状态更新为    1空净 ，2空脏*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "changeRoom")){
			return -3333;
		}
		long modifyUserId = (long)clspubcontrollerfunc.intNowHotelId(request);
		String modifyUsername = clspubcontrollerfunc.strNowUnm(request);
		if(!ValidationStrComp.checkNumber(rentId) || !ValidationStrComp.checkNumber(newRoomId) ||!ValidationStrComp.checkNumber(oldRoomStateTo)){
			return -201;
		}
		return this.bllReception.changeRoom(rentId, newRoomId, oldRoomStateTo, modifyUserId, modifyUsername);
	}
	
	
	
	/**
	 * create:2017-02-22
	 * 计算逗留数对应的房价列表
	 * 数量可加0.5
	 * @author wyx
	 * @param request
	 * @param roomtypeId
	 * @param rentplanId
	 * @param checkinType
	 * @param startDateTime
	 * @param increment
	 * @param expectedStay
	 * @return
	 */
	@RequestMapping(value="/calculateRentAmount",method=RequestMethod.POST)
	@ResponseBody
	public String calculateRentAmount(HttpServletRequest request,
			long roomtypeId,/*房型id*/
			long rentplanId,/*房价方案id*/
			int checkinType,/*入住方式*/
			String startDateTime,/*开始日*/
			int increment,/*间隔数：天房，晚房为1 ，钟点房为钟点房小时数*/
			double expectedStay,    /*居住数  ：  正整数  + 0.5的倍数*/
			long receptionId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "calculateRentAmount")){
			return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(roomtypeId) || !ValidationStrComp.checkNumber(rentplanId) ||!ValidationStrComp.checkNumber(checkinType) 
				|| !ValidationStrComp.checkNumber(increment) || !ValidationStrComp.checkNumber(expectedStay)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		
		LocalDateTime localDateTime = CmpLocalDT.DateToLocalDateTime(SimpleDateHandler.StringToDateByYMDHMS(startDateTime));
		TimePriceRange tp = this.bllReception.calculateRentAmount(hotelId, roomtypeId, rentplanId, checkinType, localDateTime, increment, expectedStay,receptionId);
		return JSON.toJSONString(tp);
	}
	
	
	/**
	 * create:2017-02-27
	 * 根据receptionId获取支付消费信息
	 * @author wyx
	 * @param receptionId
	 * @return
	 */
	@RequestMapping(value="/getPaymentAndConsumeByReceptionId",method=RequestMethod.POST)
	@ResponseBody
	public String getPaymentAndConsumeByReceptionId(HttpServletRequest request,
			long receptionId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getPaymentAndConsumeByReceptionId")){
			return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(receptionId)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerPaymentAndConsume> paymentAndConsumes = this.bllReception.getPaymentAndConsumeByReceptionId(hotelId,receptionId,1);
		return JSON.toJSONString(paymentAndConsumes);
	}
	
	
	
	/**
	 * create:2017-03-02
	 * 根据宾客信息查询宾客账簿
	 * @author wyx
	 * @param request
	 * @param receptionState
	 * @param guestName
	 * @param phone
	 * @param roomCode
	 * @return
	 * 参数为模糊查询条件
	 */
	@RequestMapping(value="/getReceptionByGuest",method=RequestMethod.POST)
	@ResponseBody
	public String getReceptionByGuest(HttpServletRequest request,
			int receptionState,/*1未结   2已结   0全部*/
			String guestName,
			String phone,
			String roomCode,
			String checkoutTime
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getReceptionByGuest")){
			return "-3333";
		}
		if(!ValidationStrComp.checkNumber(receptionState)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(guestName) || !ValidationStrComp.checkStringName(roomCode)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkMobile(phone)){
			return "-301";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<String> list = new ArrayList<String>();
		if(guestName.length()==0 && phone.length()==0 && roomCode.length()==0 && checkoutTime.length()==0){
			return JSON.toJSONString(list);
		}
		List<PerReception> rents = this.bllReception.getReceptionByGuest(hotelId, receptionState, guestName, phone, roomCode, SimpleDateHandler.StringToDateByYMDHMS(checkoutTime));
		return JSON.toJSONString(rents);
	}
	
	
	/**
	 * create：2017-03-23
	 * 对帐页签单
	 * @param receptionId
	 * @param receptionPageNumber
	 * @param channelId
	 * @param amount
	 * @param remark
	 * @param scene
	 * @return
	 */
	@RequestMapping(value="/payOnChannelCredit",method=RequestMethod.POST)
	@ResponseBody
	public int payOnChannelCredit(HttpServletRequest request,
			long receptionId,
			int receptionPageNumber,//账页编号，>=1
			long channelId,//协议单位的客源id
			int amount,//签单金额
			String remark,//备注
			String scene//场景
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "payOnChannelCredit")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(receptionId) || !ValidationStrComp.checkNumber(receptionPageNumber) ||
				!ValidationStrComp.checkNumber(channelId) || !ValidationStrComp.checkNumber(amount)){
			return -201;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		if(!ValidationStrComp.checkStringName(scene)){
			return -111;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		PerBanquetPayment pbp = new PerBanquetPayment();
		pbp.setBanquetReceptionId(receptionId);
		pbp.setHotelId(hotelId);
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUsername);
		pbp.setCreateTime(SimpleDateHandler.DateToStringByYMDHMS(new Date()));
		pbp.setDBcreateTime(new Date());
		pbp.setBanquetReceptionFolio(receptionPageNumber);
		pbp.setCreditChannelId(channelId);
		pbp.setPayAmount(amount);
		pbp.setScene(scene);
		pbp.setRemark(remark);
		System.out.println(JSON.toJSONString(pbp));
		return this.bllBanquetReception.banquetSign(pbp, 1);
	}
	
	
	
	
	/**
	 * create:2017-03-23
	 * 撤销对帐页签单
	 * @param receptionId
	 * @param receptionPageNumber
	 * @param remark
	 * @param scene
	 * @return
	 */
	@RequestMapping(value="/undoPayOnChannelCredit",method=RequestMethod.POST)
	@ResponseBody
	public int undoPayOnChannelCredit(HttpServletRequest request,
			long receptionId,
			int receptionPageNumber,//账页编号，>=1
			String remark,//场景
			String scene
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "undoPayOnChannelCredit")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(receptionId) || !ValidationStrComp.checkNumber(receptionPageNumber)){
			return -201;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		if(!ValidationStrComp.checkStringName(scene)){
			return -111;
		}
		
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		PerBanquetPayment pbp = new PerBanquetPayment();
		pbp.setCreateTime(SimpleDateHandler.DateToStringByYMDHMS(new Date()));
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUsername);
		pbp.setBanquetReceptionId(receptionId);
		pbp.setBanquetReceptionFolio(receptionPageNumber);
		pbp.setRemark(remark);
		pbp.setScene(scene);
		pbp.setHotelId((long)clspubcontrollerfunc.intNowHotelId(request));
		pbp.setDBcreateTime(new Date());
		return this.bllBanquetReception.bqCancelSign(pbp, 1);
	}
	
	
	/**
	 * create:2017-03-23
	 * 取得已锁定的账页编号列表。
	 * 列表从小到大排序
	 * @param receptionId
	 * @return
	 */
	@RequestMapping(value="/getLockedReceptionPageList",method=RequestMethod.POST)
	@ResponseBody
	public String getLockedReceptionPageList(HttpServletRequest request,
			long receptionId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getLockedReceptionPageList")){
			return "-3333";
		}
		if(!ValidationStrComp.checkNumber(receptionId)){
			return "-201";
		}
		List<Integer> integers = this.bllReception.getLockedReceptionPageList(receptionId);
		return JSON.toJSONString(integers);
	}
	
	
	/**
	 * create:2017-03-23
	 * 对账页做免单
	 * @param receptionId
	 * @param receptionPageNumber
	 * @param amount
	 * @param remark
	 * @param scene
	 * @return
	 */
	@RequestMapping(value="/payOnFreeConsume",method=RequestMethod.POST)
	@ResponseBody
	public int payOnFreeConsume(HttpServletRequest request,
			long receptionId,
			int receptionPageNumber,//账页编号，>=1
			int amount,//金额
			String remark,//备注
			String scene//场景
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "payOnFreeConsume")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(receptionId) || !ValidationStrComp.checkNumber(receptionPageNumber) ||
				!ValidationStrComp.checkNumber(amount)){
			return -201;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		if(!ValidationStrComp.checkStringName(scene)){
			return -111;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		PerBanquetPayment pbp = new PerBanquetPayment();
		pbp.setCreateTime(SimpleDateHandler.DateToStringByYMDHMS(new Date()));
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUsername);
		pbp.setHotelId(hotelId);
		pbp.setRemark(remark);
		pbp.setScene(scene);
		pbp.setBanquetReceptionId(receptionId);
		pbp.setBanquetReceptionFolio(receptionPageNumber);
		pbp.setDBcreateTime(new Date());
		pbp.setPayAmount(amount);
		return this.bllBanquetReception.bqFree(pbp, 1);
	}
	
	
	/**
	 * create:2017-03-23
	 * 撤销对账页的免单
	 * @param receptionId
	 * @param receptionPageNumber
	 * @param remark
	 * @param scene
	 * @return
	 */
	@RequestMapping(value="/undoPayOnFreeConsume",method=RequestMethod.POST)
	@ResponseBody
	public int undoPayOnFreeConsume(HttpServletRequest request,
			long receptionId,
			int receptionPageNumber,//账页编号，>=1
			String remark,//备注
			String scene//场景
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "undoPayOnFreeConsume")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(receptionId) || !ValidationStrComp.checkNumber(receptionPageNumber)){
			return -201;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		if(!ValidationStrComp.checkStringName(scene)){
			return -111;
		}
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		PerBanquetPayment pbp = new PerBanquetPayment();
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUsername);
		pbp.setHotelId((long)clspubcontrollerfunc.intNowHotelId(request));
		pbp.setBanquetReceptionId(receptionId);
		pbp.setBanquetReceptionFolio(receptionPageNumber);
		pbp.setRemark(remark);
		pbp.setScene(scene);
		pbp.setDBcreateTime(new Date());
		return this.bllBanquetReception.bqCancelFree(pbp, 1);
	}
	
	
	/**
	 * create:2017-03-23
	 * 对帐簿做坏账
	 * @param receptionId
	 * @param amount
	 * @param remark
	 * @param scene
	 * @return
	 */
	@RequestMapping(value="/payOnBadDebt",method=RequestMethod.POST)
	@ResponseBody
	public int payOnBadDebt(HttpServletRequest request,
			long receptionId,
			int amount,//空缺金额
			String remark,//备注
			String scene//场景
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "payOnBadDebt")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(receptionId) || !ValidationStrComp.checkNumber(amount)
				){
			return -201;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		if(!ValidationStrComp.checkStringName(scene)){
			return -111;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllReception.payOnBadDebt(receptionId, amount, remark, scene, hotelId, createUserId, createUsername);
	}
	
	/**
	 * create:2017-03-23
	 * 撤销坏账
	 * @param receptionId
	 * @param receptionPageNumber
	 * @param remark
	 * @param scene
	 * @return
	 */
	@RequestMapping(value="/undoPayOnBadDebt",method=RequestMethod.POST)
	@ResponseBody
	public int undoPayOnBadDebt(HttpServletRequest request,
			long receptionId,
			int receptionPageNumber,
			String remark,//备注
			String scene//场景
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "undoPayOnBadDebt")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(receptionId) || !ValidationStrComp.checkNumber(receptionPageNumber)){
			return -201;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		if(!ValidationStrComp.checkStringName(scene)){
			return -111;
		}
		
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllReception.undoPayOnBadDebt(receptionId, receptionPageNumber, remark, scene, createUserId, createUsername);
	}
	
	/**
	 * create:2017-03-23
	 * 转移账页下的消费项
	 * @param outReceptionId
	 * @param receptionPageNumber
	 * @param inReceptionId
	 * @return
	 */
	@RequestMapping(value="/transferConsume",method=RequestMethod.POST)
	@ResponseBody
	public int transferConsume(HttpServletRequest request,
			long outReceptionId,//转出方的帐簿id
			int receptionPageNumber,//账页编号
			long inReceptionId,//转入方的帐簿id
			int intinrtype,/*转入方账单的receptionType*/
			int intoutrtype/*转出方账单的receptionType*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "transferConsume")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(outReceptionId) || !ValidationStrComp.checkNumber(receptionPageNumber) ||
				!ValidationStrComp.checkNumber(inReceptionId)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		int r = this.bllReception.transferConsume(hotelId, outReceptionId, receptionPageNumber, inReceptionId, createUserId, createUsername,intinrtype,intoutrtype);
		return r; 
	}
	
	
	/**
	 * create:2017-04-05
	 * 宾客账单简讯、汇总
	 * @param request
	 * @param receptionId
	 * @return
	 */
	@RequestMapping(value="/getReceptionInfo",method=RequestMethod.POST)
	@ResponseBody
	public String getReceptionInfo(HttpServletRequest request,
			long receptionId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getReceptionInfo")){
			return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(receptionId)){
			return "-201";
		}
		
		long hotelId = (long) clspubcontrollerfunc.intNowHotelId(request);
		PerRecetionInfo  perReceptionInfo = this.bllReception.getReceptionInfo(hotelId,receptionId);
		return JSON.toJSONString(perReceptionInfo);
	}
	
	/**
	 * create:2017-04-27
	 * 修改账单
	 * @param receptionId
	 * @param guestName
	 * @param guaranteeAmount
	 * @param comment
	 * @return
	 */
	@RequestMapping(value="/editReception",method=RequestMethod.POST)
	@ResponseBody
	public int editReception(HttpServletRequest request,
			long receptionId,//帐簿id
			String guestName,//主宾姓名，为null则不修改
			Integer guaranteeAmount,//担保金额，为null则不修改
			String comment//备注，为null不修改
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editReception")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(receptionId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(guestName)){
			return -102;
		}
		
		if(!ValidationStrComp.checkRemark(comment)){
			return -112;
		}
		
		return this.bllReception.editReception(receptionId, guestName, guaranteeAmount, comment);
	}
	
	
	
	/**
	 * create:2017-05-11
	 * 反结账
	 * @param request
	 * @param receptionId
	 * @return
	 */
	@RequestMapping( value="/undoCheckout" , method =RequestMethod.POST)
	@ResponseBody
	public int undoCheckout(HttpServletRequest request,
			long receptionId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "undoCheckout")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(receptionId)){
			return -201;
		}
		long checkoutUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String checkoutUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllReception.undoCheckout(receptionId, checkoutUserId, checkoutUsername);
	}
	
	/**
	 * create:2017-07-10
	 * 加单页面的信息
	 * @param request
	 * @param receptionId
	 * @param roomCode
	 * @return
	 */
	@RequestMapping(value={"/addReceptionPageDetail"}, produces={"application/json;charset=utf-8"}, method=RequestMethod.POST)
	@ResponseBody
	public String addReceptionPageDetail(HttpServletRequest request,
			long receptionId,
			String roomCode
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "addReceptionPageDetail")){
			return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(receptionId)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(roomCode)){
			return "-111";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		ContinueRoom cr = this.bllReception.addReceptionPageDetail(hotelId, receptionId, roomCode);
		return JSON.toJSONString(cr);
		
	}
	
}
