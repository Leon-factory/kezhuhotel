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
import com.kzhotel.BLLI.IBllConsume;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.model.extend.ConsumeItemChild;
import com.kzhotel.pojo.consumeitem;
import com.kzhotel.pojo.payment;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.SimpleDateHandler;



@Controller
@RequestMapping("/consume")
public class ConsumeController {
	@Resource
	private IBllConsume bllConsume;
	@Resource
	private IBllUser bllUser;

	/**
	 * 增加消费记录
	 * @param request
	 * @param receptionId
	 * @param warehouseId
	 * @param consumeList
	 * @param payState
	 * @param paymentList
	 * @param rentId
	 * @param roomId
	 * @param roomCode
	 * @return
	 * -6,5分钟之内不允许重复操作
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			long receptionId,/*客单id*/
			long warehouseId,/*库id，如果为0，则默认主库*/
			String consumeList,/*消费明细*/
			int payState,/*是否支付      0未支付，1已支付*/
			String paymentList,/*支付明细，未支付时为null*/
			long rentId,/*租住id*/
			long roomId,/*房间id*/
			String roomCode/*房间编号*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addConsume")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(receptionId) || !ValidationStrComp.checkNumber(payState) ||
				!ValidationStrComp.checkNumber(rentId) || !ValidationStrComp.checkNumber(roomId)
				){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(roomCode) ){
			return -111;
		}
		
		if(!ValidationStrComp.checkJson(consumeList) ){
			return -801;
		}
		String createUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		/*宾馆id*/
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);	    
		List<consumeitem> consumedetails = ClsJsonToBean.LstFromJson(consumeList, new TypeToken<ArrayList<consumeitem>>(){}.getType());
		List<payment> payments = new ArrayList<payment>();
		if(paymentList != null && !"".equals(paymentList)){
			payments=ClsJsonToBean.LstFromJson(paymentList, new TypeToken<ArrayList<payment>>(){}.getType());
			
		}
		int intresult = this.bllConsume.AddConsume(receptionId, warehouseId, consumedetails, payState+1, payments, 
				createUsername, rentId, roomId, roomCode, hotelId, createUserId, createUsername);
	
		return intresult;
	}
	
	/**
	 * 2016-12-01
     * update:2017-03-16
     * 按照 客单id  房间id  列出消费明细
	 * @param receptionId
	 * @param feeItemTypes
	 * @param receptionPageNumber
	 * @param payStates
	 * @param rentId
	 * @param roomId
	 * @param accountDate
	 * @return
	 * 修改：
     * 新增receptionPageNumber参数
     * 2017-03-16:修改 参数  payState
	 */
	@RequestMapping(value="/listConsumedetail",method=RequestMethod.POST)
	@ResponseBody
	public String listConsumedetail(HttpServletRequest request,
			long receptionId,/*客单id*/
    		String feeItemTypes , //消费类型，1房租，2商品消费，3服务消费，""表示所有
    		int receptionPageNumber,//账页编号，从1开始，0为全部
    		String payStates,//3坏账 ，4免单 ;  null为全部
    		long rentId,//租住id,0为全部
    		long roomId,//房间id,0为全部
    		String accountDate   //null为全部日期
    		){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listConsumedetail")){
            return "-3333";
		}
		if(!ValidationStrComp.checkNumber(receptionId)||!ValidationStrComp.checkNumber(roomId) ||
				!ValidationStrComp.checkNumber(receptionPageNumber) || !ValidationStrComp.checkNumber(rentId)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(feeItemTypes) || !ValidationStrComp.checkStringName(payStates)){
			return "-111";
		}
		
		List<ConsumeItemChild> consumedetails = this.bllConsume.listConsumedetail(receptionId, feeItemTypes,receptionPageNumber, payStates, rentId, roomId, SimpleDateHandler.StringToDateByYMDHMS(accountDate));
		return JSON.toJSONString(consumedetails);		
	}
	
	
	/**
     * create:2017-02-23
     * 修改消费账项的账页编号
     * @author wyx
     * @param request
     * @param consumeDetailId
     * @param receptionPageNumber
     * @return
     */
	@RequestMapping(value="/modifyConsumeDetailPageNumber",method=RequestMethod.POST)
	@ResponseBody
	public int modifyConsumeDetailPageNumber(HttpServletRequest request,
    		long consumeDetailId,/*消费明细id*/
    		int receptionPageNumber,	/*账页编号，从1开始*/
    		int detailGenre/*标识*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "modifyConsumeDetailPageNumber")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(consumeDetailId)||!ValidationStrComp.checkNumber(receptionPageNumber)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllConsume.modifyConsumeDetailPageNumber(hotelId, consumeDetailId, receptionPageNumber,detailGenre);
		
	}
	
	/**
     * create:2017-02-23
     * 获取最大账页编号
     * 账页编号从1开始，最大不限。
     * @author wyx
     * @param receptionId
     * @return
     */
	@RequestMapping(value="/getMaxReceptionPageNumber",method=RequestMethod.POST)
	@ResponseBody
	public int getMaxReceptionPageNumber(HttpServletRequest request,
			long receptionId	/*客单id*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getMaxReceptionPageNumber")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(receptionId)){
			return -201;
		}
		return this.bllConsume.getMaxReceptionPageNumber(receptionId);
	}
	
	
	/**
     * create:2017-03-06
     * 获取账页号码的列表
     * @author wyx
     * @param receptionId
     * @return
     */
	@RequestMapping(value="/getReceptionPageNumberList",method=RequestMethod.POST)
	@ResponseBody
	public String getReceptionPageNumberList(HttpServletRequest request,
			long receptionId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getReceptionPageNumberList")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(receptionId)){
			return "-201";
		}
		List<Integer> ints = this.bllConsume.getReceptionPageNumberList(receptionId);
		return JSON.toJSONString(ints);
	}
	
	
}
