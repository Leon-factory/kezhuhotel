package com.kzhotel.controller;

import java.text.ParseException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.PubJavadill.java.ClsJsonToBean;
import com.PubJavadill.java.CmpLocalDT;
import com.alibaba.fastjson.JSON;
import com.eapor.pojo.tbpayment;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.kzhotel.BLLI.IBllChannel;
import com.kzhotel.BLLI.IBllConsume;
import com.kzhotel.BLLI.IBllGuest;
import com.kzhotel.BLLI.IBllLock;
import com.kzhotel.BLLI.IBllPayment;
import com.kzhotel.BLLI.IBllPersevere;
import com.kzhotel.BLLI.IBllReception;
import com.kzhotel.BLLI.IBllRent;
import com.kzhotel.BLLI.IBllRentPrice;
import com.kzhotel.BLLI.IBllReport;
import com.kzhotel.BLLI.IBllReserve;
import com.kzhotel.BLLI.IBllRoom;
import com.kzhotel.BLLI.IBllRoomType;
import com.kzhotel.BLLI.IBllSpecialDay;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.BLLI.IBllUsergroupRole;
import com.kzhotel.BLLModel.BeanPMid;
import com.kzhotel.join.rentpriceJoin;
import com.kzhotel.join.roomJoin;
import com.kzhotel.model.LivingRoom;
import com.kzhotel.model.ReceptionDetail;
import com.kzhotel.model.ReceptionGuest;
import com.kzhotel.model.RentGuest;
import com.kzhotel.model.Reservedetail;
import com.kzhotel.model.extend.ConsumeItemChild;
import com.kzhotel.model.extend.RentChild;
import com.kzhotel.per.ContinueRoom;
import com.kzhotel.per.PerCreditAndStore;
import com.kzhotel.per.PerHistoryGuestInfo;
import com.kzhotel.per.PerLivingReception;
import com.kzhotel.per.PerLocalRentPrice;
import com.kzhotel.per.PerLowBalance;
import com.kzhotel.per.PerPayMentAndReserveDetail;
import com.kzhotel.per.PerReceptionDetail;
import com.kzhotel.per.PerRecetionInfo;
import com.kzhotel.per.PerRoomInfo;
import com.kzhotel.pojo.channel;
import com.kzhotel.pojo.guest;
import com.kzhotel.pojo.payment;
import com.kzhotel.pojo.reception;
import com.kzhotel.pojo.roomtype;
import com.kzhotel.service.IPaymentService;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.SimpleDateHandler;
import net.kzhotel.BLLI.NetIBllShops;
import net.kzhotel.BLLI.NetIBllUsers;
import net.kzhotel.pojo.cards;
import net.kzhotel.pojo.users;

@Controller
@RequestMapping("/persevere")
public class PersevereController {
	
	
	@Resource
	private IBllReception bllReception;
	@Resource
	private IBllGuest bllGuest;
	@Resource
	private IBllRent bllrent;
	@Resource
	private IBllConsume bllconsume;
	@Resource
	private IBllPayment bllpayment;
	@Resource
	private IBllUser bllUser;
	@Resource
	private IBllUsergroupRole bllUsergroupRole;
	@Resource
	private IBllReserve bllreserve;
	@Resource
	private	IBllReport bllreport;
	@Resource
	private IBllRoom bllroom;
	@Resource
	private IBllSpecialDay bllspecial;
	@Resource
	private IBllRentPrice bllrentprice;
	@Resource
	private IBllLock blllock;
	@Resource
	private IBllChannel bllchannel;
	@Resource
	private IBllPersevere bllPersevere;
	@Resource
	private IBllRoomType bllRoomType;
	@Resource
	private IPaymentService paymentService;
	@Resource
	private NetIBllUsers netBllUsers;
	@Resource
	private NetIBllShops netBllShops;
	
	/**
	 * 根据receptionId获取退房、续房、换房的所需信息
	 * @param request
	 * @param receptionId
	 * @return
	 */
	@RequestMapping(value="/getContinueRoomDataByReceptionId",method=RequestMethod.POST)
	@ResponseBody
	public String getContinueRoomDataByReceptionId(HttpServletRequest request,
			int receptionId,
			String roomCode
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getContinueRoomDataByReceptionId")){
			return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(receptionId)){
			return "-201";
		}
		
		if(roomCode == null || !ValidationStrComp.checkStringName(roomCode)){
			return "-111";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		ContinueRoom continueRoom = new ContinueRoom();
		//获取rentplanId
		reception reception = this.bllReception.getReceptionById(receptionId);
		
		if(reception==null){
			return JSON.toJSONString(continueRoom);
		}
		continueRoom.setReceptionId(receptionId);
		continueRoom.setRentplanId(reception.getRentplanId());
		
		//住客信息
		guest guest = this.bllGuest.getGuestById(reception.getPrimaryGuestId());
		if(guest != null){
			continueRoom.setGuestName(guest.getGuestName());
			continueRoom.setChannelId(reception.getChannelId());
			continueRoom.setPhone(guest.getPhone());
		}
		
		//根据客单id获取入住时间
		List<RentChild> rents = this.bllrent.listRentByReceptionId((long)receptionId, "");
		for(RentChild r: rents){
			if(roomCode.equals(r.getRoomCode())){
				//得到房间信息
				continueRoom.setRoomId(r.getRoomId());
				continueRoom.setRoomCode(r.getRoomCode());
				continueRoom.setExpectedLeaveTime(SimpleDateHandler.DateToStringByYMDHMS(CmpLocalDT.LocalDateTimeToDate(r.getExpectedLeaveTime())));
				continueRoom.setOldRoomPrice((long)r.getExpectedRentAmount());
				continueRoom.setCheckinType((long)r.getCheckinType());
				continueRoom.setRentId(r.getRentId());
				continueRoom.setRoomtypeId(r.getRoomtypeId());
				continueRoom.setEnterTime(SimpleDateHandler.DateToStringByYMDHMS(CmpLocalDT.LocalDateTimeToDate(r.getEnterTime())));
				continueRoom.setCreateTime(SimpleDateHandler.DateToStringByYMDHMS(CmpLocalDT.LocalDateTimeToDate(r.getCreateTime())));
				continueRoom.setExpectedStayNumber(r.getExpectedStayNumber());
				//发出的房卡数
				int roomCardCount = this.blllock.getLockcardCount(continueRoom.getRoomId(), 2);
				continueRoom.setRoomCardCount(roomCardCount);
				break;
			}
		}
		//根据客单ID获取消费详情
		List<ConsumeItemChild> consumedetails = this.bllconsume.listConsumedetail((long)receptionId, "23",0,null,0l,0l,null);
		long amount = consumedetails.stream().mapToLong(ConsumeItemChild::getAmount).sum();
		continueRoom.setConsumeAmount(amount);
		
		//根据客单id获取支付总额
		List<payment> payments  =  this.paymentService.listPaymentByBillId((long)receptionId, 0);
		long paymentAmount = payments.stream().mapToLong(payment::getAmount).sum();
		continueRoom.setPaymentAmount(paymentAmount);
		
		 
		List<ConsumeItemChild> consumedetails_rent = this.bllconsume.listConsumedetail((long)receptionId, "1",0,null,0l,0l,null);
		long rentAmount = consumedetails_rent.stream().mapToLong(ConsumeItemChild::getAmount).sum();
		continueRoom.setRentAmount(rentAmount);
		List<ConsumeItemChild> consumedetails_goods = this.bllconsume.listConsumedetail((long)receptionId, "2",0,null,0l,0l,null);
		List<ConsumeItemChild> consumedetails_service = this.bllconsume.listConsumedetail((long)receptionId, "3",0,null,0l,0l,null);
		continueRoom.setGoodsConsumedetails(consumedetails_goods);
		continueRoom.setServiceConsumedetails(consumedetails_service);
		continueRoom.setRentConsumedetails(consumedetails_rent);
		
		/*签单、免单、坏账总额*/
		int count = -1;
		long bill = 0l;
		long debt = 0l;
		long free = 0l;
		StringBuffer signName = new StringBuffer();
		StringBuffer signId = new StringBuffer();
		for(int x=0;x<3;x++){
			List<tbpayment> paylist = this.bllReception.getNonePaymentList(receptionId, count,1);
			for(tbpayment payment : paylist){
				switch (count) {
				case -1:
					bill+=payment.getFamount();
					if(!signId.toString().contains(payment.getFcreditchannelid().toString())){
						signId.append(payment.getFcid());
						signId.append(";");
						channel c = this.bllchannel.getChannelById(payment.getFcreditchannelid().intValue());
						signName.append(c.getChannelName());
						signId.append(";");
					}
					
					break;
				case -2:free+=payment.getFamount();break;
				case -3:debt+=payment.getFamount();break;
				}
			}
			count --;
		}
		continueRoom.setSignId(signId.toString());
		continueRoom.setSignName(signName.toString());
		continueRoom.setSignAmount(bill);
		continueRoom.setDebtAmount(debt);
		continueRoom.setFreeAmount(free);
		
		/*转入转出*/
		PerRecetionInfo pri = this.bllReception.getReceptionInfo((long)hotelId, (long)receptionId);
		continueRoom.setTransferOut(pri.getTransferOut() == null ? 0 : pri.getTransferOut());
		continueRoom.setTransferIn(pri.getTransferIn() == null ? 0 : pri.getTransferIn());
		if(continueRoom.getTransferOut().intValue() > 0){
			continueRoom.setZhuanyi("false");
		}else{
			continueRoom.setZhuanyi("true");
		}
		
		/*信用参考*/
		//如有预授权则显示预授权金额
		int guarant = reception.getGuaranteeAmount();
		channel channel = this.bllchannel.getChannelById(reception.getChannelId().intValue());
		if(guarant > 0){
			continueRoom.setCredit(Double.valueOf(String.valueOf(guarant)));
			continueRoom.setCreditName("预授权");
		}else{
			//如挂账为0，则不显示
			int isCredit = reception.getUseCredit();
			if(isCredit == 0){
				continueRoom.setCredit(0d);
				continueRoom.setCreditName("");
			}else{
				//如挂账为1，则根据客源显示金额
				if(channel.getChannelName().equals("会员") || channel.getChannelName().equals("驿宝")){
					try {
						users users = this.netBllUsers.getUsersByPhone(guest.getPhone());
						cards cards = this.netBllShops.getUserCard(users.getShopId(), users.getId());
						continueRoom.setCredit(cards.getBalance());
						continueRoom.setCreditName("储值余额");
					} catch (Exception e) {
						continueRoom.setCredit(0d);
						continueRoom.setCreditName("");
					}
					
				}else{
					try {
						continueRoom.setCredit(channel.getCreditAmount().doubleValue()); 
						continueRoom.setCreditName("信用余额");
					} catch (Exception e) {
						continueRoom.setCredit(0d);
						continueRoom.setCreditName("");
					}
				}
			}
			
		}
		return JSON.toJSONString(continueRoom);
		
	}
	
	
	/**获取押金不足列表
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getLowBalanceList",method=RequestMethod.POST)
	@ResponseBody
	public String getLowBalanceList(HttpServletRequest request,
			String roomCode,
			String guestName
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getLowBalanceList")){
	        return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(roomCode) || !ValidationStrComp.checkStringName(guestName)){
			return "-111";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerLowBalance> lowBalances = this.bllPersevere.getLowBalance(hotelId, roomCode,guestName);
		return JSON.toJSONString(lowBalances);
		
	}
	
	/**
	 * 住宿历史
	 * @param request
	 * @param beginTime
	 * @param endTime
	 * @param guestName
	 * @param roomCode
	 * @return
	 */
	@RequestMapping(value="/getHistoryGuestInfo",method=RequestMethod.POST)
	@ResponseBody
	public String getHistoryGuestInfo(HttpServletRequest request,
			String beginTime, 
			String endTime, 
			String guestName,
			String roomCode
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getHistoryGuestInfo")){
	        return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(guestName) || !ValidationStrComp.checkStringName(roomCode)){
			return "-111";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerHistoryGuestInfo> perHistoryGuestInfos = this.bllPersevere.getHistoryGuestInfo(hotelId,SimpleDateHandler.StringToDateByYMDHMS(beginTime),SimpleDateHandler.StringToDateByYMDHMS(endTime), guestName,roomCode);
		return JSON.toJSONString(perHistoryGuestInfos);
	}
	
	
	/**
	 * 获取在住客单信息
	 * update:2017-03-01
	 * 修改：2017-03-01：新增receptionState参数
	 * @param request
	 * @param receptionState
	 * @return
	 */
	@RequestMapping(value="/getLivingReceptionInfo",method=RequestMethod.POST)
	@ResponseBody
	public String getLivingReceptionInfo(HttpServletRequest request,
			int receptionState/*1未结 2已结 0全部*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getLivingReceptionInfo")){
	        return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(receptionState)){
			return "-201";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		List<ReceptionDetail> receptionJoins = this.bllReception.selectReceptionList(hotelId, receptionState, 1, null, null);
		List<PerLivingReception> perLivingReceptions = new ArrayList<PerLivingReception>();
		PerLivingReception plr = null;
		for(ReceptionDetail r : receptionJoins ){
			plr = new PerLivingReception();
			plr.setHotelId(r.getHotelId());
			plr.setReceptionId(r.getReceptionId());
			plr.setSourceGroupId(r.getSourceGroupId());
			plr.setChannelId(r.getChannelId());
			plr.setRentplanId(r.getRentplanId());
			plr.setUseChannelCredit(r.getUseCredit());
			perLivingReceptions.add(plr);
		}
		
		for(int i=0;i<perLivingReceptions.size();i++){
			long reid = perLivingReceptions.get(i).getReceptionId();
			List<ReceptionGuest> livingguestJoins = this.bllGuest.listGuestByReceptionId(hotelId, new Long(reid).intValue());
			for(ReceptionGuest l : livingguestJoins){
				if(l.getIsPrimary() == 1){
					perLivingReceptions.get(i).setIsPrimary(l.getIsPrimary());
					perLivingReceptions.get(i).setGuestId(l.getGuestId());
					perLivingReceptions.get(i).setGuestName(l.getGuestName());
					perLivingReceptions.get(i).setRoomId(l.getRoomId());
					perLivingReceptions.get(i).setRoomCode(l.getRoomCode());
					perLivingReceptions.get(i).setPhone(l.getPhone());
					break;
				}
			}
		}
		return JSON.toJSONString(perLivingReceptions);
		
	}
	
	/**
	 * 批量增加或删除权限
	 * @param add
	 * @param remove
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/batchRole",method=RequestMethod.POST)
	@ResponseBody
	public int batchRole(HttpServletRequest request,
			String add,/*list json*/
			String remove,/*list 这是一个数组*/
			long usergroupId
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addOrDeleteRole")){
			return -3333;
		}
		if(!ValidationStrComp.checkJson(add) ){
			return -801;
		}
		
		if(!ValidationStrComp.checkNumber(usergroupId)){
			return -201;
		}
		int intresult = 0;
		int addresult = 0,removeresult = 0 ;
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		String creator = clspubcontrollerfunc.strNowUnm(request);
		if(add.length()>0){
			List<BeanPMid> addList = ClsJsonToBean.LstFromJson(add, new TypeToken<ArrayList<BeanPMid>>(){}.getType());
			addresult = this.bllUsergroupRole.insertBatch(addList, (long)hotelId, creator);
			intresult = 1;
		}
		if(remove.length()>0){
			Gson gson = new Gson();
			List<Integer> removeList = gson.fromJson(remove, new TypeToken<ArrayList<Integer>>(){}.getType());
			removeresult = this.bllUsergroupRole.removeBatch(removeList);
			intresult = 2;
		}
		this.bllPersevere.updatePermissionListAndRoleListByUserGroupId((long)hotelId, usergroupId);
		if(addresult>0 && removeresult>0 ){
			intresult = 3;
		}
		return intresult;
	}
	
	/**
	 * update:2017-01-13 by wyx
	 * create:2017-01-12
	 * 获取预订查询项
	 * @param request
	 * @param reserveStates
	 * @param reservePerson
	 * @param reserveMobile
	 * @param startTime
	 * @param stopTime
	 * @param offset
	 * @param limit
	 * @return
	 */
	@RequestMapping(value="/paymentAndReserveDetail",method=RequestMethod.POST)
	@ResponseBody
	public String paymentAndReserveDetail(HttpServletRequest request,
			String reserveStates,/*状态组合:状态  1有效  2解除  3失约  4入住*/
	    	String reservePerson,/*查询预定人姓名，""为全部*/
	    	String reserveMobile,/*查询预定人手机，""为全部*/
	    	String starttime,/*起始时间*/
	    	String stoptime,/*结束时间*/
	    	int offset,
	    	int limit
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "paymentAndReserveDetail")){
            return "-3333";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(reservePerson)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkMobile(reserveMobile)){
			return "-301";
		}
		List<Reservedetail> Reservedetails = this.bllreserve.listReservedetailPage(hotelId, reserveStates, reservePerson, reserveMobile, SimpleDateHandler.StringToDateByYMDHMS(starttime), SimpleDateHandler.StringToDateByYMDHMS(stoptime), offset, limit);
		List<PerPayMentAndReserveDetail> payMentAndReserveDetails = new ArrayList<PerPayMentAndReserveDetail>();
		for(Reservedetail r : Reservedetails){
			PerPayMentAndReserveDetail p = new PerPayMentAndReserveDetail();
			p.setReserveId(r.getReserveId());
			p.setReserveDetailId(r.getReserveDetailId());
			p.setReserveCode(r.getReserveCode());
			p.setChannelId(r.getChannelId());
			p.setSourceGroupId(r.getSourceGroupId());
			p.setItemIndex(r.getItemIndex());
			p.setCheckinType(r.getCheckinType());
			p.setCheckinTypeChar(r.getCheckinTypeChar());
			p.setExpectedEnterTime(r.getExpectedEnterTime());
			p.setExpectedStayNumber(r.getExpectedStayNumber());
			p.setExpectedRentAmount(r.getExpectedRentAmount());
			p.setRoomNumber(r.getRoomNumber());
			p.setCheckinRoomNumber(r.getCheckinRoomNumber());
			p.setReservePerson(r.getReservePerson());
			p.setReserveMobile(r.getReserveMobile());
			p.setReserveState(r.getReserveState());
			p.setPayState(r.getPayState());
			p.setPayStateChar(r.getPayStateChar());
			p.setChannelName(r.getChannelName());
			
			List<roomtype> roomtypes = this.bllRoomType.listRoomTypePage(0, 50, hotelId, r.getRoomtypeName());
			for(roomtype rt : roomtypes){
				if(rt.getRoomtypeName().equals(r.getRoomtypeName())){
					p.setRoomtypeId(rt.getRoomtypeId());
					break;
				}
			}
			p.setRoomtypeName(r.getRoomtypeName());
			p.setModifyUserId(r.getModifyUserId());
			p.setModifyUsername(r.getModifyUsername());
			p.setModifyTime(r.getModifyTime());
			p.setMemberPhone(r.getMemberPhone());
			p.setReceptionId(r.getReceptionId());
			List<payment> payments = null;
			if(p.getReceptionId()!=null){
				payments = this.bllpayment.listPaymentByBillId(p.getReceptionId(),0 );
			}
			for(payment pay : payments){
				p.setPaymentId(pay.getPaymentId());
				p.setPaymethodId((long)pay.getPaymethodCode());
				p.setAmount(pay.getAmount());
				p.setCreateTime(CmpLocalDT.LocalDateTimeToDate(pay.getCreateTime()));
				p.setCreateUsername(pay.getCreateUsername());
				p.setCreateUserId(pay.getCreateUserId());
				p.setHotelId(pay.getHotelId());
				p.setBillType(pay.getBillType());
				p.setBillId(pay.getBillId());
				p.setBillCode(pay.getBillCode());
				p.setRemark(pay.getRemark());
				p.setCreditChannelId(pay.getCreditChannelId());
				if(pay.getCreditChannelId() != null && pay.getCreditChannelId().intValue() > 0){
					p.setCreaditChannelName(this.bllchannel.getChannelById(pay.getCreditChannelId().intValue()).getChannelName());
				}
				break;
			}
			payMentAndReserveDetails.add(p);
		}
		return JSON.toJSONString(payMentAndReserveDetails);
	}
	
	
	/**
	 * 2017-01-13
	 * 客单详细信息
	 * @param receptionId
	 * @return
	 */
	@RequestMapping(value="/getGuestLivingReceptionDetailByReceptionId",method=RequestMethod.POST)
	@ResponseBody
	public String getGuestReceptionDetailByReceptionId(HttpServletRequest request,
			Long receptionId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getGuestLivingReceptionDetailByReceptionId")){
            return "-3333";
		}
		if(!ValidationStrComp.checkNumber(receptionId)){
			return "-201";
		}
		PerReceptionDetail prd = new PerReceptionDetail();
		reception r = this.bllReception.getReceptionById(receptionId.intValue());
		guest guest = this.bllGuest.getGuestById(r.getPrimaryGuestId());
		List<ConsumeItemChild> rents = this.bllconsume.listConsumedetail(receptionId, "1",0,null,0l,0l,null);
		List<ConsumeItemChild> goods = this.bllconsume.listConsumedetail(receptionId, "2",0,null,0l,0l,null);
		List<ConsumeItemChild> service = this.bllconsume.listConsumedetail(receptionId, "3",0,null,0l,0l,null);
		prd.setGuestName(guest.getGuestName());
		prd.setRents(rents);
		prd.setGoodsConsumeDetails(goods);
		prd.setServiceConsumeDetails(service);
		return JSON.toJSONString(prd);
	}
	
	
	
	/**
	 * 2017-01-25
	 * 根据预离或非预离选项获取在住房间
	 * @author wyx
	 * @param request
	 * @param guestName
	 * @param date
	 * @param roomtypeId
	 * @param channelId
	 * @param leave
	 * @param notleave
	 * @return
	 */
	@RequestMapping(value="/roomLeaveOrNotLeave",method=RequestMethod.POST)
	@ResponseBody
	public String roomLeaveOrNotLeave(HttpServletRequest request,
			String guestName,/*顾客姓名，空为全部*/
	    	String date,/*日期，可为null*/
	    	int roomtypeId,/*房型id,0为全部*/
	    	int channelId, /*客源id,0为全部*/
	    	boolean leave,
	    	boolean notleave
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "roomLeaveOrNotLeave")){
            return "-3333";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(roomtypeId) ||!ValidationStrComp.checkNumber(channelId)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(guestName)){
			return "-111";
		}
		
		
		List<LivingRoom> livingRooms = this.bllroom.selectLivingRoom(hotelId, guestName, SimpleDateHandler.StringToDateByYMDHMS(date), roomtypeId, channelId);
		List<PerRoomInfo> perRoomInfos = new ArrayList<PerRoomInfo>();
		List<PerRoomInfo> perRoomInfos2 = new ArrayList<PerRoomInfo>();
		for(LivingRoom lvr : livingRooms){
			PerRoomInfo pri = new PerRoomInfo();
			pri.setChannelId(lvr.getChannelId());
			pri.setChannelName(lvr.getChannelName());
			pri.setEnterTime(lvr.getEnterTime());
			pri.setExpectedLeaveTime(lvr.getExpectedLeaveTime());
			pri.setGuestId(lvr.getGuestId());
			pri.setGuestName(lvr.getGuestName());
			pri.setReceptionId(lvr.getReceptionId());
			pri.setRentId(lvr.getRentId());
			pri.setRoomCode(lvr.getRoomCode());
			pri.setRoomId(lvr.getRoomId());
			pri.setRoomtypeId(lvr.getRoomtypeId());
			pri.setRoomtypeName(lvr.getRoomtypeName());
			List<roomJoin> roomJoins = this.bllroom.selectRoomList(hotelId, pri.getRoomCode(), pri.getRoomtypeId(), 0, "");
			for(roomJoin rj : roomJoins){
				if(rj.getRoomCode().equals(pri.getRoomCode())){
					if(rj.getLockCode()!=null){
						pri.setLockcode(rj.getLockCode().toString());
					}
				}
			}
			List<RentGuest> rentGuests = this.bllGuest.selectLivingGuest(hotelId, lvr.getGuestName(), lvr.getRoomCode(), 0);
			for(RentGuest rg:rentGuests){
				pri.setIsPrimary(rg.getIsPrimary());
				pri.setSexCode(rg.getSexCode());
				pri.setSexChar(rg.getSexChar());
				pri.setPhone(rg.getPhone());
				pri.setCertificateCode(rg.getIdentityCardNumber());
				perRoomInfos.add(pri);
				break;
			}
		}
		
		if(leave){
			for(PerRoomInfo prinfo : perRoomInfos){
				//返回值如果为正，则当前对象时间较晚
				Date expected = prinfo.getExpectedLeaveTime();
				if(expected != null && LocalDate.now().compareTo(CmpLocalDT.DateToLocalDate(expected))>=0){
					perRoomInfos2.add(prinfo);
				}
				
			}
		}
		if(notleave){
			for(PerRoomInfo prinfo : perRoomInfos){
				//返回值如果为正，则当前对象时间较晚
				Date expected = prinfo.getExpectedLeaveTime();
				if(expected != null && LocalDate.now().compareTo(CmpLocalDT.DateToLocalDate(expected))<0){
					perRoomInfos2.add(prinfo);
				}
			}
		}
		return JSON.toJSONString(perRoomInfos2);
		
	}
	
	
	/**
	 * create:2017-02-24
	 * 获取所有符合条件的房价组合
	 * update:2017-02-30
	 * 修改：新增time参数
	 * @author wyx
	 * @param request
	 * @param time
	 * @param rentplanId
	 * @param roomtypeId
	 * @param checkinType
	 * @param timeinterval
	 * @return
	 * @throws ParseException
	 */
	@RequestMapping(value="/localRentPrice",method=RequestMethod.POST)
	@ResponseBody
	public String localRentPrice(HttpServletRequest request,
    		int rentplanId,/*方案id，0表示全部*/
    		int roomtypeId,/*房型id，0表示全部*/
    		int checkinType,/*入住方式，0表示全部，1全日房，2钟点房，3晚房*/
    		int timeinterval /*时段，0表示全部，1平日，2周末，3节日*/
			) {
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "localRentPrice")){
            return "-3333";
		}
		PerLocalRentPrice plrc = new PerLocalRentPrice();
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		int count = this.bllrentprice.getRentPriceCount(hotelId, rentplanId, roomtypeId, checkinType, timeinterval);
		List<rentpriceJoin> rJoins = this.bllrentprice.listRentPricePage(0, count+1, hotelId, rentplanId, roomtypeId, checkinType, timeinterval);
		if(rJoins.size()==0){
			return JSON.toJSONString(plrc);
		}
		plrc.setRentpriceJoins(rJoins);
		List<Integer> ints = new ArrayList<Integer>();
		LocalDate ldt =LocalDate.now();
		LocalDate monthNano = ldt.plusDays(60L);//当前时间+60天
		while(monthNano.compareTo(ldt)>=0){
			Integer isSpecialDay = 1;//平日
			if(this.bllspecial.isWeekEnd(hotelId, CmpLocalDT.LocalDateToDate(ldt))){isSpecialDay=2;};//周末
			if(this.bllspecial.isSpecialDay(hotelId, CmpLocalDT.LocalDateToDate(ldt))){isSpecialDay=3;};//节假日
			ints.add(isSpecialDay);
			ldt = ldt.plusDays(1l);
		}
		plrc.setSpecials(ints);
		return JSON.toJSONString(plrc);
	}
	
	
	/**
	 * create:2017-08-21<br />
	 * 开房页面-挂账选项-信用余额与储值金额
	 * @param channelId 客源id；
	 * @param phone 手机号；
	 * @return
	 * 		PerCreditAndStore结构:<br />
	 * 			credit 信用余额：-1，该客源不存在；<br />
	 * 			store 储值：	-1，该手机号不是会员；<br />
	 * 						-2，该酒店未与客主对应；<br />
	 * 						-3，该会员未在该酒店储值；<br />
	 * 						-4，手机号为空；
	 */
	@RequestMapping(value = {"/getCreditAndStore"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getCreditAndStore(
			HttpServletRequest request,
			long channelId,
			String phone
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getCreditAndStore")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(channelId)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkMobile(phone)){
			return "-301";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		PerCreditAndStore pcas = this.bllPersevere.getCreditAndStore(hotelId, channelId, phone);
		return JSON.toJSONString(pcas);
		
	}
	
}
