package com.kzhotel.controller;




import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllShift;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.model.extend.SuccessionChild;
import com.kzhotel.per.PerCurrentSuccesion;
import com.kzhotel.per.PerSuccessionDetail;
import com.kzhotel.per.PerSuccessionInfo;
import com.kzhotel.pojo.delivercash;
import com.kzhotel.pojo.succession;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.ClassTransfer;
import me.persevere.util.SimpleDateHandler;


@Controller
@RequestMapping("/shift")
public class ShiftController {
	@Resource
	private IBllShift bllShift;
	@Resource
	private IBllUser bllUser;
	
	
	/**
	 * create:2017-04-18
	 * 开班
	 * @param request
	 * @param remark
	 * @return
	 * 修改：
	 * 2017-04-18：接班重做
	 */
	@RequestMapping(value="/createSuccession",method=RequestMethod.POST)
	@ResponseBody
	public long createSuccession(HttpServletRequest request,
		    String remark/*接班备注*/
		   ){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "createSuccession")){
			return -3333;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		long successorUserId=(long)clspubcontrollerfunc.intNowUserId(request);
		String successorUsername=clspubcontrollerfunc.strNowUnm(request); /*当前操作员*/
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		int intresult = this.bllShift.createSuccession(successorUserId, successorUsername, hotelId, remark);
		long returnValue = 0;
		if(intresult>0){
			succession succession = this.bllShift.getActiveSuccession(hotelId, (long)successorUserId);
			SuccessionChild sc = new SuccessionChild();
			ClassTransfer.parentToChild(succession, sc);
			request.getSession().removeAttribute("succession");
			request.getSession().setAttribute("succession", sc);
			request.getSession().removeAttribute("successionId");
			request.getSession().setAttribute("successionId", sc.getSuccessionId());
			returnValue = succession.getSuccessionId();
		}
		return returnValue;
	}
	
	/**
	 * 获取用户当前接班记录
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getActiveSuccession",method=RequestMethod.POST)
	@ResponseBody
	public String getActiveSuccession(HttpServletRequest request){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getActiveSuccession")){
			return "-3333";
		}
		/*宾馆id*/
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		int successorUserId = clspubcontrollerfunc.intNowUserId(request);
		succession s = this.bllShift.getActiveSuccession((long)hotelId, (long)successorUserId);
		return JSON.toJSONString(s);
	}
	
	/**
	 * create:2017-04-18
	 * 现金上缴
	 * @param request
	 * @param amount
	 * @param remark
	 * @param typeCode
	 * @param successionId
	 * @return
	 * 修改：
	 * 2017-04-18：上缴财务重做
	 */
	@RequestMapping(value="/AddPasscash",method=RequestMethod.POST)
	@ResponseBody
	public int AddPasscash(HttpServletRequest request,
		    int amount,//金额：分
		    String remark,//备注
		    int typeCode, //类别，1上缴     2领用   
		    long successionId //开班id
		   ){
		
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "AddPasscash")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(amount) || !ValidationStrComp.checkNumber(typeCode)||!ValidationStrComp.checkNumber(successionId)){
			return -201;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		int passbyUserId=clspubcontrollerfunc.intNowUserId(request);
		String passbyUsername = clspubcontrollerfunc.strNowUnm(request);
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		succession s = this.bllShift.getActiveSuccession((long)hotelId, (long)passbyUserId);
		if(s==null){
			return -3334;
		}
		return this.bllShift.AddPasscash((long)passbyUserId, passbyUsername, amount, remark, typeCode, successionId, (long)hotelId);
	}
	
	/**
	 * create：2017-04-05
	 * 获取当前当班者简讯、汇总信息
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getCurrentSuccession",method=RequestMethod.POST)
	@ResponseBody
	public String getCurrentSuccession(HttpServletRequest request){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getCurrentSuccession")){
			return "-3333";
		}
		long hotelId = (long) clspubcontrollerfunc.intNowHotelId(request);
		long userId = (long) clspubcontrollerfunc.intNowUserId(request);
		succession succession = this.bllShift.getActiveSuccession(hotelId, userId);
		if(succession == null){
			return JSON.toJSONString(new PerCurrentSuccesion());
		}
		PerCurrentSuccesion perCurrentSuccesion = this.bllShift.getSuccessionInfo(hotelId, userId, succession.getSuccessionId());
		return JSON.toJSONString(perCurrentSuccesion);
		
	}
	
	/**
	 * create:2017-04-05
	 * 获取当前当班者明细信息
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/getSuccessionDetail",method=RequestMethod.POST)
	@ResponseBody
	public String getSuccessionDetail(HttpServletRequest request){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getSuccessionDetail")){
			return "-3333";
		}
		long hotelId = (long) clspubcontrollerfunc.intNowHotelId(request);
		long userId = (long) clspubcontrollerfunc.intNowUserId(request);
		succession succession = this.bllShift.getActiveSuccession(hotelId, userId);
		if(succession == null){
			return JSON.toJSONString(new PerCurrentSuccesion());
		}
		List<PerSuccessionDetail> perSuccessionDetails = this.bllShift.getSuccessionDetail(hotelId, userId, succession.getSuccessionId());
		return JSON.toJSONString(perSuccessionDetails);
	}
	
	
	/**
	 * create:2017-04-18
	 * 交款
	 * @param request
	 * @param deliverSuccessionId
	 * @param amount
	 * @param remark
	 * @return
	 */
	@RequestMapping(value="/addDeliverCash",method=RequestMethod.POST)
	@ResponseBody
	public int addDeliverCash(HttpServletRequest request,
		    long deliverSuccessionId,//交款人开班id
		    int amount,//交款金额
		    String remark
			){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addDeliverCash")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(deliverSuccessionId) || !ValidationStrComp.checkNumber(amount)){
			return -201;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long deliverUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String deliverUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllShift.addDeliverCash(hotelId, deliverUserId, deliverUsername, deliverSuccessionId, amount, remark);
	}
	
	
	/**
	 * create:2017-04-18
	 * 接款
	 * @param request
	 * @param deliverCashId
	 * @param receiveSuccessionId
	 * @return
	 * 修改：
	 * 2017-04-19：删除receiveSuccessionId参数
	 */
	@RequestMapping(value="/receiveCash",method=RequestMethod.POST)
	@ResponseBody
	public int receiveCash(HttpServletRequest request,
			long deliverCashId//交款记录id
			){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "receiveCash")){
			return -3333;
		}
		if( !ValidationStrComp.checkNumber(deliverCashId)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long receiveUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String receiveUsername = clspubcontrollerfunc.strNowUnm(request);
		int intresult = this.bllShift.receiveCash(deliverCashId, receiveUserId, receiveUsername,hotelId);
		if(intresult > 0){
			succession succession = this.bllShift.getActiveSuccession(hotelId, receiveUserId);
			SuccessionChild sc = new SuccessionChild();
			ClassTransfer.parentToChild(succession, sc);
			request.getSession().removeAttribute("succession");
			request.getSession().setAttribute("succession", sc);
			request.getSession().removeAttribute("successionId");
			request.getSession().setAttribute("successionId", sc.getSuccessionId());
		}
		return intresult;
	}
	
	
	/**
	 * create:2017-04-18
	 * 交款记录数量
	 * @param request
	 * @param deliverSuccessionId
	 * @param receiveSuccessionId
	 * @param receiveState
	 * @return
	 */
	@RequestMapping(value="/getDeliverCashCount",method=RequestMethod.POST)
	@ResponseBody
	public int getDeliverCashCount(HttpServletRequest request,
			long deliverSuccessionId,//交款人的开班id,0为全部
			long receiveSuccessionId,//接款人的开班id,0为全部
			int receiveState//接款状态，1未接，2已接，0全部
			){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getDeliverCashCount")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(receiveSuccessionId) || !ValidationStrComp.checkNumber(deliverSuccessionId) ||
				!ValidationStrComp.checkNumber(receiveState)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllShift.getDeliverCashCount(hotelId, deliverSuccessionId, receiveSuccessionId, receiveState);
		
	}
	
	/**
	 * create:2017-04-18
	 * 列出交款
	 * @param request
	 * @param offset
	 * @param limit
	 * @param deliverSuccessionId
	 * @param receiveSuccessionId
	 * @param receiveState
	 * @return
	 */
	@RequestMapping(value="/listDeliverCashPage",method=RequestMethod.POST)
	@ResponseBody
	public String listDeliverCashPage(HttpServletRequest request,
			int offset,
			int limit,
			long deliverSuccessionId,//交款人的开班id,0为全部
			long receiveSuccessionId,//接款人的开班id,0为全部
			int receiveState//接款状态，1未接，2已接，0全部
			){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listDeliverCashPage")){
			return "-3333";
		}
		if(!ValidationStrComp.checkNumber(receiveSuccessionId) || !ValidationStrComp.checkNumber(deliverSuccessionId) ||
				!ValidationStrComp.checkNumber(receiveState) || !ValidationStrComp.checkNumber(limit) ||
				!ValidationStrComp.checkNumber(offset)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<delivercash> delivercashs = this.bllShift.listDeliverCashPage(offset, limit, hotelId, deliverSuccessionId, receiveSuccessionId, receiveState);
		return JSON.toJSONString(delivercashs);
	}
	
	
	/**
	 * create:2017-04-18
	 * 修改开班状态
	 * @param successionId
	 * @param successionState
	 * @return
	 */
	@RequestMapping(value="/modifySuccessionState",method=RequestMethod.POST)
	@ResponseBody
	public int modifySuccessionState(HttpServletRequest request,
			HttpServletResponse response,
			long successionId,//开班id
			int successionState//1开班，2关闭，3审核
			){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "modifySuccessionState")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(successionId) || !ValidationStrComp.checkNumber(successionState)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long successorUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String successorUsername = clspubcontrollerfunc.strNowUnm(request);
		int intresult = this.bllShift.modifySuccessionState(successionId, successionState,successorUserId,successorUsername);
		if(intresult>0){
			succession succession = this.bllShift.getActiveSuccession(hotelId, successorUserId);
			SuccessionChild sc = new SuccessionChild();
			if(succession!=null){
				ClassTransfer.parentToChild(succession, sc);
			}
			if(successionState==2){
				request.getSession().invalidate();
				clspubcontrollerfunc.addCookie(request, response, "lk", "", 1);
			}
		}
		return intresult;
	}
	
	/**
	 * create:2017-05-08
	 * 审核
	 * @param request
	 * @param successionId
	 * @param passcashId
	 * @param state
	 * @return
	 */
	@RequestMapping( value="/review", method = RequestMethod.POST)
	@ResponseBody
	public int review(HttpServletRequest request,
			long successionId,
			long passcashId,
			int state/*当passcashId 不为0时，state  2通过    3不通过
							当passcaId 为0时， state 1开班，2关闭，3审核*/
			){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "review")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(passcashId) || !ValidationStrComp.checkNumber(successionId) ||!ValidationStrComp.checkNumber(state)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long auditorUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String auditorUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllShift.review(hotelId,successionId, passcashId, auditorUserId, auditorUsername, state);
	}
	
	
	
	/**
	 * create:2017-05-10
	 * 获取当班列表
	 * @param request
	 * @param successionState
	 * @param successorUserId
	 * @param createTime
	 * @return
	 */
	@RequestMapping( value="/getSuccessionList",method=RequestMethod.POST)
	@ResponseBody
	public String getSuccessionList(HttpServletRequest request,
			int successionState,//当班状态：1工作中、2已结班、3已审核、0全部
			long successorUserId,//账号，0全部
			String createTime//日期，null全部
			){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getSuccessionList")){
			return "-3333";
		}
		if(!ValidationStrComp.checkNumber(successorUserId) || !ValidationStrComp.checkNumber(successionState)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<SuccessionChild> successionChilds = this.bllShift.getSuccessionList(hotelId, successionState, successorUserId, SimpleDateHandler.StringToDateByYMDHMS(createTime));
		return JSON.toJSONString(successionChilds);
	}
	
	
	/**
	 * create:2017-05-11
	 * 根据当班id获取当班简讯、汇总、明细信息
	 * @param request
	 * @param successionId
	 * @return
	 */
	@RequestMapping( value="/getSuccessInfoById",method =RequestMethod.POST)
	@ResponseBody
	public String getSuccessInfoById(HttpServletRequest request,
			long successionId
			){
		int intselfuid = clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getSuccessInfoById")){
			return "-3333";
		}
		if(!ValidationStrComp.checkNumber(successionId)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long successorUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		PerSuccessionInfo psi = new PerSuccessionInfo();
		PerCurrentSuccesion pcs = this.bllShift.getSuccessionInfoById(hotelId, successorUserId, successionId);
		psi.setPerCurrentSuccesion(pcs);
		List<PerSuccessionDetail> perSuccessionDetails = this.bllShift.getSuccessionDetailById(hotelId, successorUserId, successionId);
		psi.setPerSuccessionDetails(perSuccessionDetails);
		return JSON.toJSONString(psi);
		
	}
	
	
}
