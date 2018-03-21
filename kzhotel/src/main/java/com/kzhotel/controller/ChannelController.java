package com.kzhotel.controller;


import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllChannel;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.join.channelJoin;
import com.kzhotel.model.AdvanceChannel;
import com.kzhotel.model.AgentCollection;
import com.kzhotel.model.CreditBalance;
import com.kzhotel.model.CreditBalanceSummary;
import com.kzhotel.model.channelbalanceflow;
import com.kzhotel.per.PerSignDetail;
import com.kzhotel.pojo.channel;
import com.kzhotel.pojo.channelcollect;
import com.kzhotel.service.IChannelService;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.SimpleDateHandler;

@Controller
@RequestMapping("/channel")
public class ChannelController {
	@Resource
	private IBllChannel bllChannel;
	@Resource
	private IChannelService channelService;

	@Resource
	private IBllUser bllUser=null;

	/**
	 * 2017-01-17
	 * update:2017-02-08
	 * author:wyx
	 * @param request 
	 * @param channelName
	 * @param contact
	 * @param mobile
	 * @param telephone
	 * @param email
	 * @param address
	 * @param bankAccount
	 * @param salerUserId
	 * @param salerUsername
	 * @param remark
	 * @param credit
	 * @param creditAmount
	 * @param balance
	 * @param rentplanId
	 * @param sourceGroupId
	 * @param sortCode
	 * 修改：新增usageState参数
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
		    String channelName,/*渠道名称*/
		    String contact,/*联系人*/
		    String mobile,/*联系手机*/
		    String telephone,/*联系座机*/
		    String email,/*邮箱*/
		    String address,/*地址*/
		    String bankAccount,/*银行账户*/
		    long salerUserId,/*客户经理id*/
		    String salerUsername, /*客户经理*/
		    String remark,/*备注*/
		    int usageState,/*1使用  ，2冻结*/
		    int credit,/*是否能挂帐*/
		    int creditAmount,/*挂帐最大额度*/
		    int balance,/*余额*/
		    long rentplanId,/*默认房价方案*/
		    long sourceGroupId,/*客源组id*/
		    int sortCode/*排序*/
			){

		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addChannel")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(salerUserId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(salerUsername)){
			return -111;
		}
		
		if(!ValidationStrComp.checkTelphone(telephone)){
			return -302;
		}
		if(!ValidationStrComp.checkEmail(email)){
			return -401;
		}
		
		if(!ValidationStrComp.checkAddress(address)){
			return -501;
		}
		
		if(!ValidationStrComp.checkBankAccount(bankAccount)){
			return -601;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		Long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		Long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllChannel.AddChannel(hotelId, channelName, contact, mobile, telephone, email, address, bankAccount, salerUserId, salerUsername, createUserId, createUsername, remark, usageState, credit, creditAmount, balance, rentplanId, sourceGroupId, sortCode);
		
	}
	
	
	/**
	 * update:2017-02-08
	 * @author wyx
	 * @param request
	 * @param channelId
	 * @param channelName
	 * @param contact
	 * @param mobile
	 * @param telephone
	 * @param email
	 * @param address
	 * @param bankAccount
	 * @param salerUserId
	 * @param salerUsername
	 * @param remark
	 * @param credit
	 * @param creditAmount
	 * @param balance
	 * @param rentplanId
	 * @param sourceGroupId
	 * @param sortCode
	 * 修改：新增usageState参数
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			long channelId,/*id*/
		    String channelName,/*渠道名称*/
		    String contact,/*联系人*/
		    String mobile,/*联系手机*/
		    String telephone,/*联系座机*/
		    String email,/*邮箱*/
		    String address,/*地址*/
		    String bankAccount,/*银行账户*/
		    long salerUserId,/*客户经理id*/
		    String salerUsername, /*客户经理*/
		    String remark,/*备注*/
		    int usageState,/*1使用  ，2冻结*/
		    int credit,/*是否能挂帐*/
		    int creditAmount,/*挂帐最大额度*/
		    int balance,/*余额*/
		    long rentplanId,/*默认房价方案*/
		    long sourceGroupId,/*客源组id*/
		    int sortCode/*排序*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editChannel")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(salerUserId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(salerUsername)){
			return -111;
		}
		
		if(!ValidationStrComp.checkTelphone(telephone)){
			return -302;
		}
		
		if(!ValidationStrComp.checkEmail(email)){
			return -401;
		}
		
		if(!ValidationStrComp.checkAddress(address)){
			return -501;
		}
		
		if(!ValidationStrComp.checkBankAccount(bankAccount)){
			return -601;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		if(!ValidationStrComp.checkNumber(channelId)){
			return -201;
		}
		long modifyUserId=(long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllChannel.EditChannel(channelId, hotelId, channelName, contact, mobile, telephone, email, address, bankAccount, salerUserId, salerUsername, modifyUserId, modifyUsername, remark, usageState, credit, creditAmount, balance, rentplanId, sourceGroupId, sortCode);
		
	}
	
	/**
	 * 根据id获取channel对象
	 * @param request
	 * @param channelId
	 * @return
	 */
	@RequestMapping(value="/getbyid", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String getbyid(HttpServletRequest request,
			int channelId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getChannelById")){
			//return -3333;
            return "-3333";
		}
		if(!ValidationStrComp.checkNumber(channelId)){
			return "-201";
		}
		channel pojoresult = this.bllChannel.getChannelById(channelId);
		return JSON.toJSONString(pojoresult);
	}
	
	
	/**
	 * create:2017-04-11
	 * 获取客源List
	 * @param request
	 * @param offset
	 * @param limit
	 * @param channelName
	 * @param usageState
	 * @return
	 */
	@RequestMapping(value="/pglist",method=RequestMethod.POST)
	@ResponseBody
	public String listChannelPage(HttpServletRequest request,
			int offset,/*分页offset*/
    		int limit,/*分页limit*/
    		String channelName, /*按客源名称模糊查询*/
    		int usageState/*使用状态,0全部,1使用,2冻结*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getChannelList")){
            return "-3333";
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(limit) || !ValidationStrComp.checkNumber(offset)|| !ValidationStrComp.checkNumber(usageState)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(channelName)){
			return "-111";
		}
		
		List<channelJoin> channelJoins = this.bllChannel.listChannelPage(offset, limit, hotelId, channelName, usageState);
		return JSON.toJSONString(channelJoins);
	}
	
	
	/**
	 * 2017-01-19
	 * 客源应收款收款录入
	 * 录入时，输入负数即撤销
	 * @param request
	 * @param accessAmount
	 * @param rechargeAmount
	 * @param channelId
	 * @param salerUserId
	 * @param salerUsername
	 * @param remark
	 * @return
	 */
	@RequestMapping( value="/addChanelCollect",method=RequestMethod.POST)
	@ResponseBody
	public int addChanelCollect(HttpServletRequest request,
			int accessAmount,/*实收金额*/
		    int rechargeAmount,/*冲抵金额*/
		    long channelId,/*渠道单位id*/
		    long salerUserId,/*客户经理id*/
		    String salerUsername,/*客户经理username*/
		    int paymethodCode,/*支付方式编码*/
		    String paymethodName,/*支付方式名称*/
		    String remark
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addChanelCollect")){
			return -3333;
            //return "-3333";
		}
		Long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		Long createUserId = (long)clspubcontrollerfunc.intNowHotelId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		
		if(!ValidationStrComp.checkNumber(accessAmount) || !ValidationStrComp.checkNumber(rechargeAmount) ||
				!ValidationStrComp.checkNumber(channelId) || !ValidationStrComp.checkNumber(salerUserId) || 
				!ValidationStrComp.checkNumber(hotelId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(salerUsername)){
			return -111;
		}
		
		return this.bllChannel.addChanelCollect(hotelId, accessAmount, rechargeAmount, channelId, salerUserId, salerUsername,paymethodCode,paymethodName, remark, createUserId, createUsername);
	}
	
	
	/**
	 * 2017-01-19
	 * 客源应收款收款列表数量
	 * @param request
	 * @param channelId
	 * @param channelName
	 * @return
	 */
	@RequestMapping( value="/getChannelCollectCount",method=RequestMethod.POST)
	@ResponseBody
	public int getChannelCollectCount(HttpServletRequest request,
    		long channelId,
    		String channelName
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getChannelCollectCount")){
			return -3333;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		
		if(!ValidationStrComp.checkNumber(channelId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(channelName)){
			return -111;
		}
		
		return this.bllChannel.getChannelCollectCount(hotelId, channelId, channelName);
	}
	
	
	/**
	 * 2017-01-19
	 * 客源应收款收款列表
	 * @param request
	 * @param channelId
	 * @param channelName
	 * @param offset
	 * @param limit
	 * @return
	 */
	@RequestMapping(value="/listChannelCollectPage",method=RequestMethod.POST)
	@ResponseBody
	public String listChannelCollectPage(HttpServletRequest request,
    		long channelId,
    		String channelName,
    		int offset,
    		int limit
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listChannelCollectPage")){
            return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(channelId) ||!ValidationStrComp.checkNumber(Long.valueOf(offset)) || !ValidationStrComp.checkNumber(Long.valueOf(limit))){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(channelName)){
			return "-111";
		}
		List<channelcollect> channelcollects = this.bllChannel.listChannelCollectPage(hotelId, channelId, channelName, offset, limit);
		return JSON.toJSONString(channelcollects);
	}
	
	/**
	 * 2017-01-19
	 * 客源应收款管理
	 * @param creditChannelId
	 * @param startDate
	 * @param stopDate
	 * @return
	 */
	@RequestMapping(value="/getChannelBalanceFlow",method=RequestMethod.POST)
	@ResponseBody
	public String getChannelBalanceFlow(HttpServletRequest request,
			long creditChannelId,
    		String startDate,
    		String stopDate,
    		int offset, int limit
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getChannelBalanceFlow")){
            return "-3333";
		}
		if(!ValidationStrComp.checkNumber(creditChannelId)){
			return "-201";
		}
		List<channelbalanceflow> channelbalanceflows = this.bllChannel.getChannelBalanceFlow(
				creditChannelId, 
				SimpleDateHandler.StringToDateByYMDHMS(startDate), 
				SimpleDateHandler.StringToDateByYMDHMS(stopDate),
				offset, limit
				);
		return JSON.toJSONString(channelbalanceflows);
	}
	
	
	/**
	 * create:2017-02-17
	 * 基本、高级客源数量
	 * @author wyx
	 * @param hotelId
	 * @param channelName
	 * @param sourceGroupId
	 * @param usageState
	 * 修改：
	 * 2017-04-11：删除sourcegroupId参数
	 * @return
	 */
	@RequestMapping(value="/getChannelCount",method=RequestMethod.POST)
	@ResponseBody
	public int getAdvanceChannelCount(HttpServletRequest request,
    		String channelName,/*按客源名称模糊查询*/
    		int usageState/*使用状态,0全部,1使用,2冻结*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getChannelCount")){
			return -3333;
		}
		if(!ValidationStrComp.checkStringName(channelName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkNumber(usageState)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllChannel.getChannelCount(hotelId, channelName, usageState);
	}
	
	
	/**
	 * create:2017-02-17
	 * 高级客源分页
	 * @author wyx
	 * @param offset
	 * @param limit
	 * @param hotelId
	 * @param channelName
	 * @param sourceGroupId
	 * @param usageState
	 * @return
	 * 修改：
	 * 2017-04-11：删除sourcegroupId参数
	 */
	@RequestMapping(value="/listAdvanceChannelPage",method=RequestMethod.POST)
	@ResponseBody
	public String listAdvanceChannelPage(HttpServletRequest request,
			int offset,/*分页offset*/
    		int limit,/*分页limit*/
    		String channelName, /*按客源名称模糊查询*/
    		int usageState/*使用状态,0全部,1使用,2冻结*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) { return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listAdvanceChannelPage")){
            return "-3333";
		}
		if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit) || !ValidationStrComp.checkNumber(usageState)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(channelName)){
			return "-111";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<AdvanceChannel> advanceChannels = this.bllChannel.listAdvanceChannelPage(offset, limit, hotelId, channelName, usageState);
		advanceChannels = advanceChannels.stream().sorted(Comparator.comparing(AdvanceChannel::getBalance).reversed()).collect(Collectors.toList());
		return JSON.toJSONString(advanceChannels);
		
	}
	
	/**
	 * create:2017-02-17
	 * 信用额度设定
	 * @author wyx
	 * @param channelId
	 * @param creditAmount
	 * @return
	 */
	@RequestMapping(value="/modifyCreditAmount",method=RequestMethod.POST)
	@ResponseBody
	public int modifyCreditAmount(HttpServletRequest request,
			int channelId,
    		int creditAmount	/*信用额度*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "modifyCreditAmount")){
			return -3333;
		}
		//只有协议单位和旅行社可以设置信用额度
		channel channel = this.bllChannel.getChannelById(channelId);
		int sourceGroupId = channel.getSourceGroupId().intValue();
		if(sourceGroupId!=3 && sourceGroupId!=6){
			return -9;
		}
		return this.bllChannel.modifyCreditAmount((long)channelId, creditAmount);
	}
	
	/**
	 * create:2017-02-17
	 * 客户经理指定
	 * @param channelId
	 * @param salerUserId
	 * @param salerUsername
	 * @return
	 */
	@RequestMapping(value="/modifySaler",method=RequestMethod.POST)
	@ResponseBody
	public int modifySaler(HttpServletRequest request,
			long channelId,
			long salerUserId,	/*客户经理用户Id*/
    		String salerUsername	/*客户经理用户名*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "modifySaler")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(channelId) || !ValidationStrComp.checkNumber(salerUserId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(salerUsername)){
			return -111;
		}
		return this.bllChannel.modifySaler(channelId, salerUserId, salerUsername);
	}
	
	
	/**
	 * create:2017-04-11
	 * 客源应收款余额统计汇总
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getCreditBalanceSummary",method=RequestMethod.POST)
	@ResponseBody
	public String getCreditBalanceSummary(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getCreditBalanceSummary")){
            return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		CreditBalanceSummary cbs = this.bllChannel.getCreditBalanceSummary(hotelId);
		return JSON.toJSONString(cbs);
	}
	
	
	/**
	 * create:2017-04-11
	 * 客源应收款余额统计明细分页
	 * @param request
	 * @param offset
	 * @param limit
	 * @param channelName
	 * @param usageState
	 * @return
	 */
	@RequestMapping(value="/listCreditBalancePage",method=RequestMethod.POST)
	@ResponseBody
	public String listCreditBalancePage(HttpServletRequest request,
			int offset,/*分页offset*/
    		int limit,/*分页limit*/
    		String channelName, /*按客源名称模糊查询*/
    		int usageState/*使用状态,0全部,1使用,2冻结*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listCreditBalancePage")){
            return "-3333";
		}
		Long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(limit) || !ValidationStrComp.checkNumber(offset)|| !ValidationStrComp.checkNumber(usageState)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(channelName) ){
			return "-111";
		}
		List<CreditBalance> creditBalances = this.bllChannel.listCreditBalancePage(offset, limit, hotelId, channelName, usageState);
		return JSON.toJSONString(creditBalances);
	}
	
	
	
	/**
	 * create:2017-04-18
	 * 获取代收列表
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getAgentCollectionList",method=RequestMethod.POST)
	@ResponseBody
	public String getAgentCollectionList(HttpServletRequest request){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getAgentCollectionList")){
            return "-3333";
		}
		Long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<AgentCollection> agentCollections = this.bllChannel.getAgentCollectionList(hotelId);
		return JSON.toJSONString(agentCollections);
	}
	
	
	
	/**
	 * create:2017-04-18
	 * 设置是否代收
	 * @param channelId
	 * @param flag
	 * @return
	 */
	@RequestMapping(value="/modifyIsAgentCollection",method=RequestMethod.POST)
	@ResponseBody
	public int modifyIsAgentCollection(HttpServletRequest request,
			long channelId,//客源id
    		int flag//0非第三方支付，1是第三方支付
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "modifyIsAgentCollection")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(channelId) || !ValidationStrComp.checkNumber(flag)){
			return -201;
		}
		return this.bllChannel.modifyIsAgentCollection(channelId, flag);
		
	}
	
	/**
	 * create:2017-05-03
	 * 签单明细
	 * @param receptionId
	 * @return
	 * 修改：
	 * 2017-05-03：新增参数paymentId
	 */
	@RequestMapping( value="/getPerSignDetail",method=RequestMethod.POST)
	@ResponseBody
	public String getPerSignDetail(HttpServletRequest request,
			long receptionId,
			long paymentId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "modifyIsAgentCollection")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(receptionId)||!ValidationStrComp.checkNumber(paymentId)){
			return "-201";
		}
		List<PerSignDetail> perSignDetails = this.bllChannel.getPerSignDetail(receptionId,paymentId);
		return JSON.toJSONString(perSignDetails);
		
	}
	
	/**
	 * 客源应收款余额统计
	 * @param request
	 * @return
	 */
	@RequestMapping("/channelCollectManage")
	@ResponseBody
	public String channelCollectManage(HttpServletRequest request){
//		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
//		if(intselfuid<1) {return "-3335";}
//		else if(!this.bllUser.hasPermision(intselfuid, "channelCollectManage")){
//            return "-3333";
//		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		int count = this.bllChannel.getChannelCount(hotelId, "", 1);
		List<AdvanceChannel> advanceChannels = this.bllChannel.listAdvanceChannelPage(0, count + 1, hotelId, "", 1);
		Map<String, Integer> map = new HashMap<>();
		map.put("balance", advanceChannels.stream().mapToInt(AdvanceChannel::getBalance).sum());
		map.put("creditAmount", advanceChannels.stream().mapToInt(AdvanceChannel::getCreditAmount).sum());
		map.put("creditAvailable", advanceChannels.stream().mapToInt(AdvanceChannel::getCreditAvailable).sum());
		return JSON.toJSONString(map);
	}
	
	/**
	 * 应收款count
	 * @param creditChannelId
	 * @param startDate
	 * @param stopDate
	 * @return
	 */
	@RequestMapping("/getChannelBalanceFlowCount")
	@ResponseBody
	public int getChannelBalanceFlowCount(Long creditChannelId, String startDate, String stopDate){
		return this.channelService.getChannelBalanceFlowCount(creditChannelId, SimpleDateHandler.StringToDateByYMDHMS(startDate), SimpleDateHandler.StringToDateByYMDHMS(stopDate));
	}
}
