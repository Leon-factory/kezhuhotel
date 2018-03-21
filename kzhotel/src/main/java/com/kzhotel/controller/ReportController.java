package com.kzhotel.controller;



import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.PubJavadill.java.CmpLocalDT;
import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllReport;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.model.channelcollectdailyreport;
import com.kzhotel.model.channelcollectsummary;
import com.kzhotel.model.channelpaymentdailyreport;
import com.kzhotel.model.checkinroomdailyreport;
import com.kzhotel.model.checkoutpaymentdailyreport;
import com.kzhotel.model.checkoutpaymentsummaryreport;
import com.kzhotel.model.consumesummarydailyreport;
import com.kzhotel.model.consumesummaryforsource;
import com.kzhotel.model.paymentdailyreport;
import com.kzhotel.model.rentconsumesummaryreport;
import com.kzhotel.model.singleconsumesumarydailyreport;
import com.kzhotel.model.tbguesthotelAnalysis;
import com.kzhotel.per.PerCollectionOfReceivables;
import com.kzhotel.per.PerCollectionSummary;
import com.kzhotel.per.PerConsumeSummary;
import com.kzhotel.per.PerGivenGoodsOrService;
import com.kzhotel.per.PerGoodsAndServiceConsume;
import com.kzhotel.per.PerManagerAchievement;
import com.kzhotel.per.PerMemberConsumeRFM;
import com.kzhotel.per.PerRoomTypeAnalysis;
import com.kzhotel.per.PerShouldConllection;
import com.kzhotel.pojo.hotel;
import com.kzhotel.pojo.logchangeroom;
import com.kzhotel.pojo.logchangestay;
import com.kzhotel.pojo.logexitroom;
import com.kzhotel.service.IHotelService;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.SimpleDateHandler;
import net.kzhotel.BLLI.NetIBllShops;
import net.kzhotel.model.MemberInviteDailyReport;
import net.kzhotel.model.MemberInviteDailySummary;
import net.kzhotel.model.Memberinvitereport;
import net.kzhotel.model.Memberstoredailyreport;
import net.kzhotel.model.Memberstoresummaryreport;

@Controller
@RequestMapping("/report")
public class ReportController {
	
	
	@Resource
	private IBllReport bllReport;
	@Resource
	private NetIBllShops netbllshops;
	@Resource
	private IHotelService hotelService;
	@Resource
	private IBllUser bllUser;
	
	/**
	 * 2017-01-13
	 * 开房明细日报
	 * @param request
	 * @param date
	 * @return
	 */
	@RequestMapping(value="/getcheckinroomdailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getcheckinroomdailyreport(HttpServletRequest request,
			Date date
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getcheckinroomdailyreport")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<checkinroomdailyreport> checkinroomdailyreports = this.bllReport.getcheckinroomdailyreport(hotelId, date);
		return JSON.toJSONString(checkinroomdailyreports);
	}
	
	
	/**
	 * 2017-01-13
	 * 续房日报
	 * @param request
	 * @param date
	 * @return
	 */
	@RequestMapping(value="/getextendroomdailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getextendroomdailyreport(HttpServletRequest request,
			Date date
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getextendroomdailyreport")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<logchangestay> logextendrooms = this.bllReport.getextendroomdailyreport(hotelId, date);
		return JSON.toJSONString(logextendrooms);
	}
	
	/**
	 * 2017-01-13
	 * 退房日报
	 * @param request
	 * @param date
	 * @return
	 */
	@RequestMapping(value="/getlogexitroomdailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getlogexitroomdailyreport(HttpServletRequest request,
			Date date
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getlogexitroomdailyreport")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<logexitroom> logexitrooms = this.bllReport.getlogexitroomdailyreport(hotelId, date);
		return JSON.toJSONString(logexitrooms);
	}
	
	
	/**
	 * 2017-01-13
	 * 宾客消费明细日报
	 * @param request
	 * @param accountDate
	 * @return
	 */
	@RequestMapping(value="/getconsumesumarydailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getconsumesumarydailyreport(HttpServletRequest request,
    		Date accountDate	/*日报日期*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getconsumesumarydailyreport")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<consumesummarydailyreport> consumesumarydailyreports = this.bllReport.getconsumesummarydailyreport(hotelId, accountDate);
		return JSON.toJSONString(consumesumarydailyreports);
	}
	
	/**
	 * 2017-01-13
	 * 商品或服务 消费明细日报
	 * @param request
	 * @param feeItemType
	 * @param accountDate
	 * @return
	 */
	@RequestMapping(value="/getsingleconsumesumarydailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getsingleconsumesumarydailyreport(HttpServletRequest request,
    		int feeItemType,/*2商品   3服务*/
    		Date accountDate	/*日期*/
    		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getsingleconsumesumarydailyreport")){
           return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(feeItemType)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<singleconsumesumarydailyreport> singleconsumesumarydailyreports = this.bllReport.getsingleconsumesumarydailyreport(hotelId, feeItemType, accountDate);
		return JSON.toJSONString(singleconsumesumarydailyreports);
	}
	
	/**
	 * 2017-01-13
	 * 收退款明细日报
	 * @param request
	 * @param date
	 * @return
	 */
	@RequestMapping(value="/getpaymentdailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getpaymentdailyreport(HttpServletRequest request,
    		Date date
    		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getpaymentdailyreport")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<paymentdailyreport> paymentdailyreports = this.bllReport.getpaymentdailyreport(hotelId, date);
		return JSON.toJSONString(paymentdailyreports);
	}
	
	/**
	 * 2017-01-16
	 * 宾客消费汇总表 
	 * @param request
	 * @param start
	 * @param stop
	 * @return
	 */
	@RequestMapping(value="/getconsumedailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getconsumedailyreport(HttpServletRequest request,
    		String start,
    		String stop
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getconsumedailyreport")){
           return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerConsumeSummary> PerConsumeSummarys = this.bllReport.getconsumedailyreport(hotelId, SimpleDateHandler.StringToDateByYMDHMS(start), SimpleDateHandler.StringToDateByYMDHMS(stop));
		return JSON.toJSONString(PerConsumeSummarys);
		
	}

	
	/**
	 * 2017-01-13
	 * 收退款汇总
	 * @param request
	 * @param date
	 * @return
	 */
	@RequestMapping(value="/RepPayment",method=RequestMethod.POST)
	@ResponseBody
	public String RepPayment(HttpServletRequest request,
    		Date sdate,
    		Date edate
    		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "RepPayment")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerCollectionSummary> PerCollectionSummarys = this.bllReport.RepPayment(hotelId, sdate,edate);
		return JSON.toJSONString(PerCollectionSummarys);
	}
	
	
	/**
	 * 2017-01-17
	 * 商品或服务消费汇总
	 * @param request
	 * @param feeItemType
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping(value="/getGoodsOrServiceConsumeSummary",method=RequestMethod.POST)
	@ResponseBody
	public String getGoodsOrServiceConsumeSummary(HttpServletRequest request,
	 		 int feeItemType,/*2商品   3服务*/
	 		 Date startTime,
	 		 Date endTime
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getGoodsOrServiceConsumeSummary")){
           return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(feeItemType)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerGoodsAndServiceConsume> PerGoodsAndServiceConsumes = this.bllReport.RepCsr(hotelId, feeItemType, startTime,endTime);
		return JSON.toJSONString(PerGoodsAndServiceConsumes);
	}
	
	
	/**
	 * 2017-01-17
	 * 结账明细日报
	 * @author wyx
	 * @param request
	 * @param date
	 * @return 宾客姓名为空则匿名宾客
	 */
	@RequestMapping(value="/getcheckoutpaymentdailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getcheckoutpaymentdailyreport(HttpServletRequest request,
    		Date date
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getcheckoutpaymentdailyreport")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<checkoutpaymentdailyreport> checkoutpaymentdailyreports = this.bllReport.getcheckoutpaymentdailyreport(hotelId, date);
		return JSON.toJSONString(checkoutpaymentdailyreports);
	}
	
	/**
	 * 2017-01-17
	 * 特定商品或服务消费分析
	 * @param request
	 * @param consumeCode
	 * @param feeItemType
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping(value="/givenGoodsOrServiceAnalysis",method=RequestMethod.POST)
	@ResponseBody
	public String givenGoodsOrServiceAnalysis(HttpServletRequest request,
			String consumeCode, /*消费项名称*/
	 		int feeItemType,/*2商品   3服务*/
	 		Date startTime,
	 		Date endTime
	 		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "givenGoodsOrServiceAnalysis")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerGivenGoodsOrService> PerGivenGoodsOrServices = this.bllReport.givenGoodsOrServiceAnalysis(hotelId,consumeCode, feeItemType, startTime,endTime);
		return JSON.toJSONString(PerGivenGoodsOrServices);
		
	}
	
	/**
	 * 2017-01-17
	 * 宾客结账汇总表
	 * @param request
	 * @param start
	 * @param stop
	 * @return
	 */
	@RequestMapping(value="/getcheckoutpaymentsummaryreport",method=RequestMethod.POST)
	@ResponseBody
	public String getcheckoutpaymentsummaryreport(HttpServletRequest request,
    		Date start,
    		Date stop
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getcheckoutpaymentsummaryreport")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<checkoutpaymentsummaryreport> checkoutpaymentsummaryreports = this.bllReport.getcheckoutpaymentsummaryreport(hotelId, start, stop);
		return JSON.toJSONString(checkoutpaymentsummaryreports);
	}
	
	/**
	 * 2017-01-18
	 * 特定客源消费分析
	 * @param request
	 * @param channelId
	 * @param start
	 * @param stop
	 * @return
	 *getGivenChannelAnalysis
	 */
	@RequestMapping(value="/getconsumesummaryforsource",method=RequestMethod.POST)
	@ResponseBody
	public String getGivenChannelAnalysis(HttpServletRequest request,
			long channelId,
			long sourceGroupId,
    		String start,
    		String stop
    		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getconsumesummaryforsource")){
           return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(channelId) || !ValidationStrComp.checkNumber(sourceGroupId)){
			return "-201";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<consumesummaryforsource> consumesummaryforsources = this.bllReport.getconsumesummaryforsource(
				hotelId, 
				sourceGroupId, 
				channelId, 
				CmpLocalDT.DateToLocalDate(SimpleDateHandler.StringToDateByYMDHMS(start)), 
				CmpLocalDT.DateToLocalDate(SimpleDateHandler.StringToDateByYMDHMS(stop))
				);
		return JSON.toJSONString(consumesummaryforsources);
		
	}
	
	
	/**
	 * 2017-01-18
	 * 应收款明细日报
	 * @param request
	 * @param date
	 * @return
	 */
	@RequestMapping(value="/getchannelpaymentdailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getchannelpaymentdailyreport(HttpServletRequest request,
    		Date date
    		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getchannelpaymentdailyreport")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<channelpaymentdailyreport> channelpaymentdailyreports = this.bllReport.getchannelpaymentdailyreport(hotelId,date);
		return JSON.toJSONString(channelpaymentdailyreports);
	}
	
	
	/**
	 * 2017-01-18
	 * 应收款汇总
	 * @param channelId
	 * @param start
	 * @param stop
	 * @return
	 */
	@RequestMapping(value="/getchannelpaymentsummaryreport",method=RequestMethod.POST)
	@ResponseBody
	public String getchannelpaymentsummaryreport(HttpServletRequest request,
			long channelId,
    		Date start,
    		Date stop
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getchannelpaymentsummaryreport")){
           return "-3333";
		}
		if(!ValidationStrComp.checkNumber(channelId)){
			return "-201";
		}
		List<PerShouldConllection> PerShouldConllections = this.bllReport.getchannelpaymentsummaryreport(channelId,start,stop);
		return JSON.toJSONString(PerShouldConllections);
		
	}
	
	/**
	 * 2017-01-18
	 * 特定房型消费分析
	 * @param request
	 * @param roomtypeId
	 * @param start
	 * @param stop
	 * @return
	 */
	@RequestMapping(value="/getGivenRoomTypeAnalysis",method=RequestMethod.POST)
	@ResponseBody
	public String getGivenRoomTypeAnalysis(HttpServletRequest request,
    		long roomtypeId,
    		Date start,
    		Date stop
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getGivenRoomTypeAnalysis")){
           return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(roomtypeId)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerRoomTypeAnalysis> perRoomTypeAnalysis = this.bllReport.getGivenRoomTypeAnalysis(hotelId, roomtypeId, start, stop);
		return JSON.toJSONString(perRoomTypeAnalysis);
	}
	
	
	/**
	 * 2017-01-19
	 * 应收款收款明细日报
	 * @param hotelId
	 * @param date
	 * @return
	 */
	@RequestMapping(value="/getchannelcollectdailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getchannelcollectdailyreport(HttpServletRequest request,
    		Date date
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getchannelcollectdailyreport")){
           return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<channelcollectdailyreport> channelcollectdailyreports = this.bllReport.getchannelcollectdailyreport(hotelId, date);
		return JSON.toJSONString(channelcollectdailyreports);
		
	}
	
	/**
	 * 2017-01-19
	 * 应收款收款汇总
	 * @param request
	 * @param start
	 * @param stop
	 * @return
	 */
	@RequestMapping(value="/getchannelcollectsummary",method=RequestMethod.POST)
	@ResponseBody
	public String getchannelcollectsummary(HttpServletRequest request,
    		Date start,
    		Date stop
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getchannelcollectsummary")){
           return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerCollectionOfReceivables> perCollectionOfReceivables = this.bllReport.getchannelcollectsummary(hotelId, start, stop);
		return JSON.toJSONString(perCollectionOfReceivables);
		
	}
	
	/**
	 * 2017-01-19
	 * 客户经理业绩汇总
	 * @param salerUserId
	 * @param start
	 * @param stop
	 * @return
	 */
	@RequestMapping(value="/getManagerAchievementSummary",method=RequestMethod.POST)
	@ResponseBody
	public String getManagerAchievementSummary(HttpServletRequest request,
			long salerUserId,
    		Date start,
    		Date stop
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getManagerAchievementSummary")){
           return "-3333";
		}
		if(!ValidationStrComp.checkNumber(salerUserId)){
			return "-201";
		}
		
		List<PerManagerAchievement> perManagerAchievements = this.bllReport.getManagerAchievementSummary(salerUserId, start, stop);
		return JSON.toJSONString(perManagerAchievements);
		
	}
	
	/**
	 * 2017-01-19
	 * 客户经理应收款收款分析
	 * @param request
	 * @param salerUserId
	 * @param startDate
	 * @param stopDate
	 * @return
	 * 
	 */
	@RequestMapping(value="/getchannelcollectsummaryBySaler",method=RequestMethod.POST)
	@ResponseBody
	public String getchannelcollectsummaryBySaler(HttpServletRequest request,
    		long salerUserId,/*客户经理id*/
    		Date startDate,
    		Date stopDate
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getchannelcollectsummaryBySaler")){
           return "-3333";
		}
		if(!ValidationStrComp.checkNumber(salerUserId)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<channelcollectsummary> channelcollectsummaries = this.bllReport.getchannelcollectsummaryBySaler(hotelId, salerUserId, startDate, stopDate);
		return JSON.toJSONString(channelcollectsummaries);
	}
	
	
	/**
	 * 2017-01-19
	 * 会员结账明细日报
	 * @param request
	 * @param startDate
	 * @param stopDate
	 * @return
	 * 修改：
	 * 2017-05-16：删除stopDate参数
	 */
	@RequestMapping(value="/getmembercheckoutpaymentdailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getmembercheckoutpaymentdailyreport(HttpServletRequest request,
    		Date startDate
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getmembercheckoutpaymentdailyreport")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<checkoutpaymentdailyreport> checkoutpaymentdailyreports = this.bllReport.getmembercheckoutpaymentdailyreport(hotelId, startDate);
		return JSON.toJSONString(checkoutpaymentdailyreports);
	}
	
	
	/**
	 * 2017-01-20
	 * 会员消费RFM分析
	 * @param request
	 * @param R
	 * @param F
	 * @param M
	 * @return
	 */
	@RequestMapping(value="/getMemberConsumeRFM",method=RequestMethod.POST)
	@ResponseBody
	public String getMemberConsumeRFM(HttpServletRequest request,
    		int R,
    		int F,
    		int M
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getMemberConsumeRFM")){
           return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(R) || !ValidationStrComp.checkNumber(F)||!ValidationStrComp.checkNumber(M)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerMemberConsumeRFM> perMemberConsumeRFMs = this.bllReport.getMemberConsumeRFM(hotelId, R, F, M);
		return JSON.toJSONString(perMemberConsumeRFMs);
		
	}
	
	
	/**
	 * create:2017-01-24
	 * 换房明细日报
	 * @param request
	 * @param date
	 * @return
	 */
	@RequestMapping(value="/getchangeroomdailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getchangeroomdailyreport(HttpServletRequest request,
    		Date date
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getchangeroomdailyreport")){
           return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<logchangeroom> logchangerooms = this.bllReport.getchangeroomdailyreport(hotelId,date);
		return JSON.toJSONString(logchangerooms);
	}
	
	/**
	 * create:2017-03-10
	 * report:8-1-10 会员储值明细日报
	 * @param shopId
	 * @param date
	 * @return
	 * 修改：
	 * 2017-05-15：删除shopId参数
	 */
	@RequestMapping(value="/getMemberstoredailyreport",method=RequestMethod.POST)
	@ResponseBody
	public String getMemberstoredailyreport(HttpServletRequest request,
	    	String date/*yyyy-MM-dd HH:mm:ss  报表日期*/
	    	) {
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getMemberstoredailyreport")){
           return "-3333";
		}
		hotel hotel = this.hotelService.getHotelById(clspubcontrollerfunc.intNowHotelId(request));
		List<Memberstoredailyreport> memberstoredailyreports = this.netbllshops.getMemberstoredailyreport(hotel.getKezhuShopId(), SimpleDateHandler.StringToDateByYMDHMS(date));
		return JSON.toJSONString(memberstoredailyreports);
		
	}
	
	
	/**
	 * create:2017-03-10
	 * report:8-2-7:会员储值汇总表
	 * @param shopId
	 * @param startDate
	 * @param stopDate
	 * @return
	 * 修改：
	 * 2017-05-15：删除shopId参数
	 */
	@RequestMapping(value="/getMemberstoresummaryreport",method=RequestMethod.POST)
	@ResponseBody
	public String getMemberstoresummaryreport(HttpServletRequest request,
			long managerId,//客户经理id，不为空则用于8-3-8
			String startDate,//开始日期
			String stopDate//结束日期
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getMemberstoresummaryreport")){
           return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(managerId)){
			return "-201";
		}
		hotel hotel = this.hotelService.getHotelById(clspubcontrollerfunc.intNowHotelId(request));
		List<Memberstoresummaryreport> memberstoresummaryreports = this.netbllshops.getMemberstoresummaryreport(hotel.getKezhuShopId(),managerId, SimpleDateHandler.StringToDateByYMDHMS(startDate), SimpleDateHandler.StringToDateByYMDHMS(stopDate));
		
		return JSON.toJSONString(memberstoresummaryreports);
	}
	
	
	
	/**
	 * create:2017-05-16
	 * 会员发展明细日报
	 * @param shopId
	 * @param date
	 * @return
	 */
	@RequestMapping( value="/getMemberInviteDailyReport" ,method=RequestMethod.POST)
	@ResponseBody
	public String getMemberInviteDailyReport(HttpServletRequest request,
	    	String date//日期
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getMemberInviteDailyReport")){
           return "-3333";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		hotel hotel = this.hotelService.getHotelById(hotelId);
		List<MemberInviteDailyReport> memberInviteDailyReports = this.netbllshops.getMemberInviteDailyReport(hotel.getKezhuShopId(),SimpleDateHandler.StringToDateByYMDHMS(date));
		return JSON.toJSONString(memberInviteDailyReports);
		
	}
	
	/**
	 * create:2017-05-18
	 * 房间消费汇总表
	 * @param request
	 * @param startDate
	 * @param stopDate
	 * @return
	 */
	@RequestMapping( value="/getrentconsumesummaryreport", method=RequestMethod.POST)
	@ResponseBody
	public String getrentconsumesummaryreport(HttpServletRequest request,
			Date startDate,
			Date stopDate
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getrentconsumesummaryreport")){
           return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<rentconsumesummaryreport> rentconsumesummaryreports = this.bllReport.getrentconsumesummaryreport(hotelId, startDate, stopDate);
		return JSON.toJSONString(rentconsumesummaryreports);
		
	}
	
	/**
	 * create:2017-05-19
	 * 为报表8-2-4 在每次夜审时生成一条汇总记录。
	 * 返回值大于0表示成功
	 * @param request
	 * @return
	 */
	@RequestMapping( value="/createRentConsumeDailyReport", method=RequestMethod.POST)
	@ResponseBody
	public int createRentConsumeDailyReport(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "createRentConsumeDailyReport")){
			return -3333;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllReport.createRentConsumeDailyReport(hotelId);
	}
	
	
	/**
	 * create:2017-05-19
	 * 8-2-11会员结账汇总
	 * @param request
	 * @param startDate
	 * @param stopDate
	 * @return
	 */
	@RequestMapping( value="/getmembercheckoutpaymentsummaryreport", method =RequestMethod.POST)
	@ResponseBody
	public String getmembercheckoutpaymentsummaryreport(HttpServletRequest request,
	   		String startDate,
	   		String stopDate
	   		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getmembercheckoutpaymentsummaryreport")){
           return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<checkoutpaymentsummaryreport> checkoutpaymentsummaryreports = 
				this.bllReport.getmembercheckoutpaymentsummaryreport(
						hotelId, 
						CmpLocalDT.DateToLocalDate(SimpleDateHandler.StringToDateByYMDHMS(startDate)), 
						CmpLocalDT.DateToLocalDate(SimpleDateHandler.StringToDateByYMDHMS(stopDate)));
		
		return JSON.toJSONString(checkoutpaymentsummaryreports);
		
	}
	
	
	/**
	 * create:2017-05-19
	 * 8-3-10会员发展分析
	 * @param request
	 * @param phone
	 * @param startDate
	 * @param stopDate
	 * @return
	 */
	@RequestMapping( value="/getMemberInvitereport", method=RequestMethod.POST)
	@ResponseBody
	public String getMemberInvitereport(HttpServletRequest request,
			String phone,
	    	String startDate,//报表日期
	    	String stopDate
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getMemberInvitereport")){
           return "-3333";
		}
		
		if(!ValidationStrComp.checkMobile(phone)){
			return "-301";
		}
		hotel hotel=this.hotelService.getHotelById(clspubcontrollerfunc.intNowHotelId(request));
		List<Memberinvitereport> memberinvitereports = this.netbllshops.getMemberInvitereport(
				hotel.getKezhuShopId(), 
				phone, 
				CmpLocalDT.DateToLocalDate(SimpleDateHandler.StringToDateByYMDHMS(startDate)),
				CmpLocalDT.DateToLocalDate(SimpleDateHandler.StringToDateByYMDHMS(stopDate)));
		return JSON.toJSONString(memberinvitereports);
		
	}
	
	/**
	 * create:2017-06-08
	 * 8-3-5 宾客消费RFM分析
	 * @param request
	 * @param sourceGroupId
	 * @param isHome
	 * @param rIndex
	 * @param fIndex
	 * @param mIndex
	 * @return
	 */
	@RequestMapping( value="/getGuestRFMAnalysis", method=RequestMethod.POST)
	@ResponseBody
	public String getGuestRFMAnalysis(HttpServletRequest request,
			long sourceGroupId,//客源组id，0为不限制
			//int isHome,//是否本店会员，大于0为是，小于0不是，0不限制
			int rIndex,//R选择(1-5),0为不限制
			int fIndex,//F选择(1-5),0为不限制
			int mIndex//M选择(1-5),0为不限制
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getGuestRFMAnalysis")){
           return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(sourceGroupId)|| !ValidationStrComp.checkNumber(rIndex) 
				|| !ValidationStrComp.checkNumber(fIndex) ||!ValidationStrComp.checkNumber(mIndex)){
			return "-201";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<tbguesthotelAnalysis> guestRFMAnalysis = this.bllReport.getGuestRFMAnalysis(hotelId, sourceGroupId, rIndex, fIndex, mIndex);
		return JSON.toJSONString(guestRFMAnalysis);
		
	}
	
	
	
	/**
	 * create:2017-07-03
	 * 会员发展汇总
	 * @param request
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@RequestMapping(value={ "/getMemberInviteDailySummary"}, produces = {"application/json; charset=utf-8"},method= { RequestMethod.POST })
	@ResponseBody
	public String getMemberInviteDailySummary(HttpServletRequest request,
			String startTime,
			String endTime
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getMemberInviteDailySummary")){
           return "-3333";
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		hotel hotel = this.hotelService.getHotelById(hotelId);
		if(hotel.getKezhuShopId() == null){
			return JSON.toJSONString(new ArrayList<MemberInviteDailySummary>());
		}
		List<MemberInviteDailySummary> memberInviteDailySummaries = this.netbllshops.getMemberInviteDailySummary(hotel.getKezhuShopId().intValue(),SimpleDateHandler.StringToDateByYMDHMS(startTime),SimpleDateHandler.StringToDateByYMDHMS(endTime));
		return JSON.toJSONString(memberInviteDailySummaries);
	}
	
	/**
	 * 客户经理储值分析
	 * @param start
	 * @param end
	 * @param eaporManagerId
	 * @return
	 */
	@RequestMapping("/managerStoreAnalysis")
	@ResponseBody
	public String managerStoreAnalysis(String start, String end, long eaporManagerId){
//		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
//		if(intselfuid<1) {return "-3335";}
//		else if(!this.bllUser.hasPermision(intselfuid, "getMemberInviteDailySummary")){
//           return "-3333";
//		}
		List<Memberstoresummaryreport> mems = this.bllReport.managerStoreAnalysis(
				SimpleDateHandler.String2LocalDate(start, "yyyy-MM-dd"), 
				SimpleDateHandler.String2LocalDate(end, "yyyy-MM-dd"), 
				eaporManagerId);
		return JSON.toJSONString(mems);
	}
	
}
