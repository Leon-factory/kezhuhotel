package com.kzhotel.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.PubJavadill.java.ClsJsonToBean;
import com.alibaba.fastjson.JSON;
import com.google.gson.reflect.TypeToken;
import com.kzhotel.BLLI.IBllReserve;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.controller.conversion.ConversionReserveDetail;
import com.kzhotel.model.ReserveSituationItem;
import com.kzhotel.model.extend.ReservedetailChild;
import com.kzhotel.pojo.payment;
import com.kzhotel.pojo.reservedetail;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.ClassTransfer;
import me.persevere.util.SimpleDateHandler;
import net.kzhotel.BLLI.NetIBllReserve;


@Controller
@RequestMapping("/reserve")
public class ReserveController {
	
	
	@Resource
	private IBllReserve bllReserve;
	@Resource
	private NetIBllReserve netBllreserve;
	
	@Resource
	private IBllUser bllUser;
	
	/**
	 * 创建预定
	 * 
	 * update:2017-02-22 by wyx
	 *  预定项：
	 	roomtypeId	房型id
		roomNumber	间数
		channelId	客源id
		sourceGroupId	客源组id
		checkinType	入住方式	1全日房 2钟点房 3晚房
		expectedEnterTime	预抵时间
		expectedStayNumber	预住数
		expectedRentAmount	预计房费
		reservePerson	预定人姓名
		reserveMobile	预定人手机
	 
	 支付：payment
		paymethodId		支付方式id
		amount			支付金额（分）
		paymethodName
		
		修改：新增channelId参数
	 * 
	 * @param request
	 * @param channelId
	 * @param memberPhone
	 * @param contact
	 * @param reservedetailList
	 * @param guaranteeAmount
	 * @param paymentList
	 * @return
	 */
	@RequestMapping(value="/createReserve",method=RequestMethod.POST)
	@ResponseBody
	public int createReserve(HttpServletRequest request,
			long channelId,/*客源id*/
			String memberPhone,/*客主会员对应的phone*/
			String contact,/*客主会员的姓名*/
			String reservedetailList,/*预定项列表，微信端客源指定为会员*/
			int guaranteeAmount,/*担保金额*/
			String paymentList/*支付明细*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "createReserve")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(guaranteeAmount) ||!ValidationStrComp.checkNumber(channelId)){
			return -201;
		}
		if(!ValidationStrComp.checkJson(reservedetailList) || !ValidationStrComp.checkJson(paymentList)){
			return -801;
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		/*备注*/
		String remark = null;
		List<ConversionReserveDetail> conversionReserveDetails = ClsJsonToBean.LstFromJson(reservedetailList, new TypeToken<ArrayList<ConversionReserveDetail>>(){}.getType());
		List<reservedetail> reservedetails = new ArrayList<reservedetail>();
		
		for(ConversionReserveDetail crd:conversionReserveDetails){
			reservedetail rd = new reservedetail();
			rd=ClassTransfer.conversion(crd,rd);
			reservedetails.add(rd);
			if(crd.getRemark() != null){
				remark = crd.getRemark();
			}
		}
		List<payment> payMentList = ClsJsonToBean.LstFromJson(paymentList, new TypeToken<ArrayList<payment>>(){}.getType());
		long reserveUserId = 0l;
		return this.bllReserve.createReserve((long) hotelId, channelId, reserveUserId, memberPhone, contact, reservedetails, payMentList,remark, (long)createUserId, createUsername);
	}
	
	/**
	 * 改变预定项的状态
	 * @param reserveDetailId
	 * @param reserveState
	 * @return
	 */
	@RequestMapping(value="/changeReserveState",method=RequestMethod.POST)
	@ResponseBody
	public int changeReserveState(HttpServletRequest request,
			long reserveDetailId,/*预定项id*/
			int reserveState /*1有效；2宾客取消，解除；3宾客失约*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "changeReserveState")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(reserveDetailId) || !ValidationStrComp.checkNumber(reserveState)){
			return -201;
		}
		return this.bllReserve.changeReserveState(reserveDetailId, reserveState);
	}
	
	
	/**
	 * 根据预定项id编辑预定项
	 * @param request
	 * @param reserveDetailId
	 * @param channelId
	 * @param sourceGroupId
	 * @param roomtypeId
	 * @param checkinType
	 * @param expectedEnterTime
	 * @param expectedStayNumber
	 * @param expectedRentAmount
	 * @param roomNumber
	 * @param reservePerson
	 * @param reserveMobile
	 * @return
	 */
	@RequestMapping(value="/editReservedetail",method=RequestMethod.POST)
	@ResponseBody
	public int editReservedetail(HttpServletRequest request,
			long reserveDetailId,
		    long channelId,/*客源id*/
		    long sourceGroupId,/*客源组id*/
		    long roomtypeId,/*房型id*/
		    int checkinType,/*入住方式   1全日房  2终点房  3晚房*/
		    String expectedEnterTime,/*入住时间*/
		    int expectedStayNumber,/*停留数*/
		    int expectedRentAmount,/*预计总房租*/
		    int roomNumber,/*预定房间数*/
		    String reservePerson,/*预定人姓名*/
		    String reserveMobile/*预定人手机*/
		    ){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editReservedetail")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(reserveDetailId) || !ValidationStrComp.checkNumber(channelId) ||
				!ValidationStrComp.checkNumber(sourceGroupId) || !ValidationStrComp.checkNumber(roomtypeId) || 
				!ValidationStrComp.checkNumber(checkinType) ||!ValidationStrComp.checkNumber(expectedStayNumber) || 
				!ValidationStrComp.checkNumber(expectedRentAmount) ||!ValidationStrComp.checkNumber(roomNumber)){
			return -201;
		}
		if(!ValidationStrComp.checkMobile(reserveMobile)){
			return -301;
		}
		if(!ValidationStrComp.checkStringName(reservePerson)){
			return -111;
		}
		
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername = clspubcontrollerfunc.strNowUnm(request);
		
		int intresult = this.bllReserve.editReservedetail(reserveDetailId, channelId, sourceGroupId, roomtypeId, 
				checkinType, SimpleDateHandler.StringToDateByYMDHMS(expectedEnterTime), expectedStayNumber, expectedRentAmount, roomNumber, reservePerson, 
				reserveMobile, modifyUserId, modifyUsername);
		return intresult;
	}
	
	
	/**
	 * 预定态势图
	 * @param request
	 * @param date
	 * @param dateRange
	 * @return
	 */
	@RequestMapping(value="/reserveSituation",method=RequestMethod.POST)
	@ResponseBody
	public String reserveSituation(HttpServletRequest request,
			String date,/*起始日期*/
			int dateRange    /*到结束日期之间的天数*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "reserveSituation")){
			return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(dateRange)){
			return "-201";
		}
		
		long hotelId =(long) clspubcontrollerfunc.intNowHotelId(request);
		List<ReserveSituationItem> rsiList = this.bllReserve.reserveSituation(hotelId, SimpleDateHandler.StringToDateByYMDHMS(date), dateRange);
		return JSON.toJSONString(rsiList);
		
	}
	
	
	/**
	 * 预抵宾客
	 * @param request
	 * @param reservePerson
	 * @param reserveMobile
	 * @return
	 */
	@RequestMapping(value="/selectPreArrivalList",method=RequestMethod.POST)
	@ResponseBody
	public String selectPreArrivalList(HttpServletRequest request,
			String reservePerson,/*预定人模糊查询*/
			String reserveMobile  /*预定人手机*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "selectPreArrivalList")){
			return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(reservePerson)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkMobile(reserveMobile)){
			return "-301";
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		List<ReservedetailChild> reservedetails = this.bllReserve.selectPreArrivalList(hotelId, reservePerson, reserveMobile);
		return JSON.toJSONString(reservedetails);
	}
	
	
	/**
	 * 失约预警
	 * @param request
	 * @param reservePerson
	 * @param reserveMobile
	 * @return
	 */
	@RequestMapping(value="/selectLossArrivalAlertList",method=RequestMethod.POST)
	@ResponseBody
	public String selectLossArrivalAlertList(HttpServletRequest request,
    		String reservePerson,/*预定人模糊查询*/
    		String reserveMobile /*预定人手机*/
    		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "selectLossArrivalAlertList")){
			return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(reservePerson)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkMobile(reserveMobile)){
			return "-301";
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		List<ReservedetailChild> reservedetails = this.bllReserve.selectLossArrivalAlertList(hotelId, reservePerson, reserveMobile);
		return JSON.toJSONString(reservedetails);
	}
	
	
	/**
	 * 获取可预订数量
	 * @param request
	 * @param roomTypeId
	 * @param startTime
	 * @param stayNumber
	 * @return
	 */
	@RequestMapping( value="/getReserveCount",method=RequestMethod.POST)
	@ResponseBody
	public int getReserveCount(HttpServletRequest request,
			long roomTypeId,/*房型id*/
			String startTime,/*起始时间*/
			int stayNumber/*停留天数*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getReserveCount")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(roomTypeId) || !ValidationStrComp.checkNumber(stayNumber)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllReserve.getReserveCount(hotelId,roomTypeId,SimpleDateHandler.StringToDateByYMDHMS(startTime),stayNumber);
	}
	
	
}
