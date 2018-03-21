package com.kzhotel.controller;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.eapor.BLLI.IBllBanquetPayment;
import com.eapor.BLLI.IBllBanquetReception;
import com.eapor.BLLI.IBllBqConsume;
import com.eapor.BLLI.IBllBqTransfer;
import com.eapor.bean.PerBanquetConsumeItemDetail;
import com.eapor.bean.PerBanquetPayment;
import com.eapor.bean.PerBanquetReception;
import com.eapor.per.PerBanquetReceptionDetail;
import com.eapor.per.PerBanquetReceptionLetters;
import com.eapor.per.PerBqBillBack;
import com.eapor.per.PerPrintBqReception;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.model.ReceptionDetail;
import com.kzhotel.view.VBanquetConsume;
import com.kzhotel.view.VBqTransfer;
import com.kzhotel.view.VReceptionDetail;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.ClassTransfer;
import me.persevere.util.SimpleDateHandler;

@Controller
@RequestMapping(value = {"/banquetBill"})
public class BanquetBillController {
	
	@Resource
	private IBllBanquetReception banquetReception;
	@Resource
	private IBllBanquetPayment bllBanquetPayment;
	@Resource
	private IBllBqConsume bllBqConsume;
	@Resource
	private IBllBqTransfer bllBqTransfer;
	@Resource
	private IBllUser bllUser;

	/**
	 * 餐宴开单
	 * @param request
	 * @param banquetRestaurantId 餐厅会馆id，可以为0
	 * @param bqReserveId 预订单id，若无则为0
	 * @param phone 宾客手机号，可以为""，当值为""时，客源不可以是【会员】
	 * @param guestName 宾客姓名，可以为""
	 * @param peopleNumber 人数
	 * @param channelId 客源id
	 * @param remark 备注，10字以内
	 * @return
	 * 			-1：该餐厅不存在
	 * 			-2：该餐厅不允许开台
	 * 			-3：手机号为""时，客源不能为【会员】
	 * 			-201: banquetRestaurantId 或 peopleNumber 或 channelId 不是数字
	 * 			-301：phone 格式不正确
	 * 			-111：guestName 长度超过32
	 * 			-112：remark 长度超过28
	 */
	@RequestMapping(value = {"/createBanquetReception"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int createBanquetReception(
			HttpServletRequest request,
			long banquetRestaurantId,/*餐厅会馆id*/
			long bqReserveId,/*预订单id，若无则为0*/
			String phone,/*宾客手机号，可以为""，当值为""时，客源不可以是【会员】*/
			String guestName,/*宾客姓名，可以为""*/
			long peopleNumber,/*人数*/
			long channelId,/*客源id*/
			String remark/*备注，10字以内*/
			){
	
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "createBanquetReception")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(banquetRestaurantId) || !ValidationStrComp.checkNumber(peopleNumber)
				|| !ValidationStrComp.checkNumber(channelId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkMobile(phone)){
			return -301;
		}
		
		if(!ValidationStrComp.checkStringName(guestName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.banquetReception.createBanquetReception(banquetRestaurantId,bqReserveId, phone, guestName, peopleNumber, channelId, remark, hotelId, createUserId, createUserName);
		
	}
	
	
	/**
	 * 根据账单id查询简讯、汇总信息
	 * @param banquetReceptionId 餐宴账单id
	 * @return
	 * 			null:请检查账单id，如无误，则内部异常
	 */
	@RequestMapping(value = {"/getBanquetReceptionLettersById"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getBanquetReceptionLettersById(
			HttpServletRequest request,
			long banquetReceptionId/*餐宴账单id*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getBanquetReceptionLettersById")){
			//return -3333;
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(banquetReceptionId)){
			return "-201";
		}
		
		PerBanquetReceptionLetters pbrl = this.banquetReception.getBanquetReceptionLettersById(banquetReceptionId);
		if(pbrl == null){
			return JSON.toJSONString(new PerBanquetReceptionLetters());
		}
		return JSON.toJSONString(pbrl);
		
	}
	
	/**
	 * 餐宴账单明细
	 * @param banquetReceptionId
	 * @return
	 */
	@RequestMapping(value = {"/listBanquetReceptionDetail"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String listBanquetReceptionDetail(
			HttpServletRequest request,
			long banquetReceptionId/*账单id*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listBanquetReceptionDetail")){
			return "-3333";
		}
		
		List<PerBanquetReceptionDetail> pbrds = this.banquetReception.listBanquetReceptionDetail(banquetReceptionId,3);
		return JSON.toJSONString(pbrds);
		
	}
	
	/**
	 * 获取餐宴账单数量
	 * @param receptionState 账单状态 0全部  1正在使用   2已结账
	 * @param receptionCreatTime 订单创建时间，可传""
	 * @param guestPhone 宾客手机号，手机号不支持模糊查询
	 * @param guestName 宾客姓名
	 * @param remark 备注
	 * @return
	 */
	@RequestMapping(value = {"/getBanquetReceptionCount"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public long getBanquetReceptionCount(
			HttpServletRequest request,
			long banquetRestaurantId,/*餐宴会馆id*/
			int receptionState,/*账单状态 0全部  1正在使用   2已结账*/
			String receptionCreatTime,/*订单创建时间，可传""*/
			String guestPhone,/*宾客手机号，手机号不支持模糊查询*/
			String guestName,/*宾客姓名*/
			String remark/*备注*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getBanquetReceptionCount")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(receptionState)){
			return -201;
		}
		
		if(!ValidationStrComp.checkMobile(guestPhone)){
			return -301;
		}
		
		if(!ValidationStrComp.checkStringName(guestName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.banquetReception.getBanquetReceptionCount(banquetRestaurantId, receptionState, SimpleDateHandler.StringToDateByYMDHMS(receptionCreatTime), guestPhone, guestName, remark, hotelId);
		
	}
	
	
	/**
	 * 获取餐宴账单列表
	 * @param receptionState 账单状态 0全部  1正在使用   2已结账
	 * @param receptionCreatTime 订单创建时间
	 * @param guestPhone 宾客手机号
	 * @param guestName 宾客姓名
	 * @param remark 备注
	 * @param offset
	 * @param limit
	 * @return
	 * 			List<PerBanquetReception>
	 * 				
	 */
	@RequestMapping(value = {"/listBanquetReception"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String listBanquetReception(
			HttpServletRequest request,
			long banquetRestaurantId,/*餐宴会馆id*/
			int receptionState,/*账单状态 0全部  1正在使用   2已结账*/
			String receptionCreatTime,/*订单创建时间*/
			String guestPhone,/*宾客手机号*/
			String guestName,/*宾客姓名*/
			String remark,/*备注*/
			int offset,
			int limit
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listBanquetReception")){
			return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(receptionState) || !ValidationStrComp.checkNumber(offset) 
				|| !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkMobile(guestPhone)){
			return "-301";
		}
		
		if(!ValidationStrComp.checkStringName(guestName)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return "-112";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerBanquetReception> perBanquetReceptions = this.banquetReception.listBanquetReception(banquetRestaurantId, receptionState, SimpleDateHandler.StringToDateByYMDHMS(receptionCreatTime), guestPhone, guestName, remark, offset, limit, hotelId);
		return JSON.toJSONString(perBanquetReceptions);
	}
	
	
	/**
	 * 增加餐宴消费记录
	 * @param request
	 * @param vBanquetConsume
	 * @return
	 */
	@RequestMapping(value = {"/banquetConsume"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int banquetConsume(
			HttpServletRequest request,
			@RequestBody VBanquetConsume vBanquetConsume
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "banquetConsume")){
			return -3333;
            //return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		for(PerBanquetConsumeItemDetail pbcd : vBanquetConsume.getPbcds()){
			pbcd.setHotelId(hotelId);
			pbcd.setCreateUserId(createUserId);
			pbcd.setCreateUserName(createUserName);
			pbcd.setDBcreateTime(new Date());
			pbcd.setDBbanquetReceptionAccountTime(new Date());
		}
		if(vBanquetConsume.getPbp() != null){
			vBanquetConsume.getPbp().setHotelId(hotelId);
			vBanquetConsume.getPbp().setCreateUserId(createUserId);
			vBanquetConsume.getPbp().setCreateUserName(createUserName);
			vBanquetConsume.getPbp().setDBcreateTime(new Date());
		}
		return this.banquetReception.banquetConsume(vBanquetConsume.getPbcds(),vBanquetConsume.getPbp());
		
	}
	
	/**
	 * 餐宴收款
	 * @param request
	 * @param pbp
	 * @return
	 * 		-1：该账单不存在
	 *		-2：异常
	 *		-3：手机号或验证码不正确
	 *		-4：不是积分或储值消费
	 *		-5：积分消费写入失败
	 *		-6：储值消费写入失败
	 *		-7：插入支付数据失败
	 *		-8：传入数据为NULL
	 */
	@RequestMapping(value = {"/banquetReceipt"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int banquetReceipt(
			HttpServletRequest request,
			PerBanquetPayment pbp
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "banquetReceipt")){
			return -3333;
		}
		
		if(pbp == null){
			return -8;
		}

		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		pbp.setDBcreateTime(new Date());
		pbp.setHotelId(hotelId);
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUserName);
		return this.bllBanquetPayment.receipt(pbp);
		
	}
	
	
	/**
	 * 餐宴退款
	 * @param request
	 * @param pbp
	 * @return
	 * 		-1：该账单不存在
	 *		-2：异常
	 *		-3：手机号或验证码不正确
	 *		-4：不是积分或储值消费
	 *		-5：积分消费写入失败
	 *		-6：储值消费写入失败
	 *		-7：插入支付数据失败
	 *		-8：传入数据为NULL
	 */
	@RequestMapping(value = {"/banquetRefund"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int banquetRefund(
			HttpServletRequest request,
			PerBanquetPayment pbp
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "banquetRefund")){
			return -3333;
		}
		
		if(pbp == null){
			return -8;
		}

		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		pbp.setDBcreateTime(new Date());
		pbp.setHotelId(hotelId);
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUserName);
		return this.bllBanquetPayment.refund(pbp);
		
	}
	
	
	/**
	 * 根据账单id获取该帐页下的最大帐页值
	 * @param bqReceptionId
	 * @return
	 */
	@RequestMapping(value = {"/getMaxFolioByBqReceptionId"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int getMaxFolioByBqReceptionId(
			HttpServletRequest request,
			long bqReceptionId/*账单id*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getMaxFolioByBqReceptionId")){
			return -3333;
		}
		return this.banquetReception.getMaxFolioByBqReceptionId(bqReceptionId,3);
		
	}
	
	
	/**
	 * 根据账单id获取该账单下所有帐页列表
	 * @param request
	 * @param bqReceptionId
	 * @return
	 */
	@RequestMapping(value = {"/getFoliosByBqReceptionId"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getFoliosByBqReceptionId(
			HttpServletRequest request,
			long bqReceptionId/*账单id*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getFoliosByBqReceptionId")){
            return "-3333";
		}
		List<Integer> ints = this.banquetReception.getFoliosByBqReceptionId(bqReceptionId,3);
		return JSON.toJSONString(ints);
		
	}
	
	
	/**
	 * 根据账单id获取该帐页下的锁定帐页列表
	 * @param request
	 * @param bqReceptionId
	 * @return
	 */
	@RequestMapping(value = {"/getLockByReceptionId"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getLockByReceptionId(
			HttpServletRequest request,
			long bqReceptionId/*账单id*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getMaxFolioByBqReceptionId")){
            return "-3333";
		}
		List<Integer> ints = this.banquetReception.getLockByReceptionId(bqReceptionId,3);
		return JSON.toJSONString(ints);
		
	}
	
	/**
	 * 修改消费项帐页
	 * @param bqReceptionDetailId
	 * @param bqFolio
	 * @return
	 */
	@RequestMapping(value = {"/updateReceptionDetailFolio"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int updateReceptionDetailFolio(
			HttpServletRequest request,
			long bqReceptionDetailId,/*消费项id*/
			int bqFolio,/*更新后的帐页编号*/
			int detailGenre/*标识*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "updateReceptionDetailFolio")){
			return -3333;
		}
		return this.bllBqConsume.updateReceptionDetailFolio(bqReceptionDetailId, bqFolio,detailGenre);
	}
	
	
	/**
	 * 修改支付项帐页
	 * @param request
	 * @param bqPaymentId
	 * @param bqFolio
	 * @return
	 */
	@RequestMapping(value = {"/updatePaymentFolio"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int updatePaymentFolio(
			HttpServletRequest request,
			long bqPaymentId,/*支付项id*/
			int bqFolio/*修改后的帐页*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "updatePaymentFolio")){
			return -3333;
		}
		return this.bllBanquetPayment.updatePaymentFolio(bqPaymentId, bqFolio);
		
	}
	
	
	/**
	 * 餐宴对帐页签单
	 * @param request
	 * @param pbp结构：
	 * 			payAmount 支付金额
	 * 			banquetReceptionId 餐宴账单id
	 * 			banquetReceptionFolio 餐宴账单 帐页
	 * 			remark 支付项备注
	 * 			scene 支付项场景
	 * 			creditChannelId 签单单位id
	 * @return
	 * 			-1：传入数据不正确
	 * 			-2：该账单不存在
	 * 			-3：该帐页下无消费项
	 * 			-4：签单单位不存在
	 * 			-5：签单余额不足
	 * 			-6：签单失败
	 * 			-7：不是签单
	 */
	@RequestMapping(value = {"/banquetSign"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int banquetSign(
			HttpServletRequest request,
			PerBanquetPayment pbp
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "banquetSign")){
			return -3333;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		pbp.setHotelId(hotelId);
		pbp.setDBcreateTime(new Date());
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUserName);
		return this.banquetReception.banquetSign(pbp,3);
		
	}
	
	/**
	 * 餐宴 签单撤销
	 * @param request
	 * @param pbp
	 * 			banquetReceptionId 餐宴账单id
	 * 			banquetReceptionFolio 餐宴账单 帐页
	 * 			remark 支付项备注
	 * 			scene 支付项场景
	 * @return
	 * 			0：失败
	 * 			-1：传入数据不正确
	 * 			-2：该账单不存在
	 * 			-3：该帐页下无消费项
	 */
	@RequestMapping(value = {"/bqCancelSign"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int bqCancelSign(
			HttpServletRequest request,
			PerBanquetPayment pbp
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "bqCancelSign")){
			return -3333;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		pbp.setHotelId(hotelId);
		pbp.setDBcreateTime(new Date());
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUserName);
		return this.banquetReception.bqCancelSign(pbp,3);
		
	}
	
	/**
	 * 餐宴 坏账
	 * @param pbp
	 * 			banquetReceptionId 餐宴账单id
	 * 			payAmount 金额
	 * 			remark 支付项备注
	 * 			scene 支付项场景
	 * @return
	 * 			0：失败
	 * 			-1：传入数据不正确
	 * 			-2：该账单不存在
	 */
	@RequestMapping(value = {"/bqDebt"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int bqDebt(
			HttpServletRequest request,
			PerBanquetPayment pbp
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "bqDebt")){
			return -3333;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		pbp.setHotelId(hotelId);
		pbp.setDBcreateTime(new Date());
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUserName);
		return this.banquetReception.bqDebt(pbp,3);
		
	}
	
	/**
	 * 餐宴 撤销坏账
	 * @param pbp
	 * 			banquetReceptionId 餐宴账单id
	 * 			banquetReceptionFolio 餐宴账单 帐页
	 * 			payAmount 金额
	 * 			remark 支付项备注
	 * 			scene 支付项场景
	 * @return
	 * 			0：失败
	 * 			-1：传入数据不正确
	 * 			-2：该账单不存在
	 */
	@RequestMapping(value = {"/bqCancelDebt"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int bqCancelDebt(
			HttpServletRequest request,
			PerBanquetPayment pbp
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "bqCancelDebt")){
			return -3333;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		pbp.setHotelId(hotelId);
		pbp.setDBcreateTime(new Date());
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUserName);
		return this.banquetReception.bqCancelDebt(pbp,3);
		
	}
	
	/**
	 * 餐宴 免单
	 * @param pbp
	 * 			banquetReceptionId 餐宴账单id
	 * 			banquetReceptionFolio 餐宴账单 帐页
	 * 			remark 支付项备注
	 * 			scene 支付项场景
	 * @return
	 * 			0：失败
	 * 			-1：传入数据不正确
	 * 			-2：该账单不存在
	 * 			-3：该帐页下无消费项
	 */
	@RequestMapping(value = {"/bqFree"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int bqFree(
			HttpServletRequest request,
			PerBanquetPayment pbp
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "bqFree")){
			return -3333;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		pbp.setHotelId(hotelId);
		pbp.setDBcreateTime(new Date());
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUserName);
		return this.banquetReception.bqFree(pbp,3);
		
	}
	
	/**
	 * 餐宴 撤销免单
	 * @param pbp
	 * 			banquetReceptionId 餐宴账单id
	 * 			banquetReceptionFolio 餐宴账单 帐页
	 * 			remark 支付项备注
	 * 			scene 支付项场景
	 * @return
	 * 			0：失败
	 * 			-1：传入数据不正确
	 * 			-2：该账单不存在
	 * 			-3：该帐页下无消费项
	 */
	@RequestMapping(value = {"/bqCancelFree"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int bqCancelFree(
			HttpServletRequest request,
			PerBanquetPayment pbp
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "bqCancelFree")){
			return -3333;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		pbp.setHotelId(hotelId);
		pbp.setDBcreateTime(new Date());
		pbp.setCreateUserId(createUserId);
		pbp.setCreateUserName(createUserName);
		return this.banquetReception.bqCancelFree(pbp,3);
		
	}
	
	/**
	 * 编辑餐宴账单
	 * @param request
	 * @param pbr
	 * @return
	 * 			-1:该账单不存在
	 * 			-2:异常
	 */
	@RequestMapping(value = {"/updateBqReceptionLetters"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int updateBqReceptionLetters(
			HttpServletRequest request,
			PerBanquetReception pbr
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "updateBqReceptionLetters")){
			return -3333;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUserName = clspubcontrollerfunc.strNowUnm(request);
		pbr.setDBmodifyTime(new Date());
		pbr.setModifyUserId(modifyUserId);
		pbr.setModifyUserName(modifyUserName);
		pbr.setHotelId(hotelId);
		return this.banquetReception.updateBqReceptionLetters(pbr);
		
	}
	
	/**
	 * 餐宴账单结账
	 * @param request
	 * @param bqReceptionId
	 * @return
	 * 			0：结账失败
	 * 			-1：该账单不存在
	 * 			-2：该账单金额不平，不能结账
	 * 			-3：更新餐厅会馆状态失败
	 */
	@RequestMapping(value = {"/checkOutBqReception"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int checkOutBqReception(
			HttpServletRequest request,
			long bqReceptionId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "checkOutBqReception")){
			return -3333;
		}
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		return this.banquetReception.checkOutBqReception(bqReceptionId, createUserId);
		
	}
	

	/**
	 * 撤销餐宴结账
	 * @param request
	 * @param bqReceptionId
	 * @return
	 * 			0：撤销失败
	 * 			-1：该账单不存在
	 * 			-2：该账单不是结账状态
	 */
	@RequestMapping(value = {"/cancelCheckOut"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int cancelCheckOut(
			HttpServletRequest request,
			long bqReceptionId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "cancelCheckOut")){
			return -3333;
		}
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		return this.banquetReception.cancelCheckOut(bqReceptionId, createUserId);
	}
	
	/**
	 * 餐宴 新增转移记录
	 * @param request
	 * @param vBqTransfer
	 * @return
	 * 			-1:消费项不存在
	 */
	@RequestMapping(value = {"/addTransfer"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int addTransfer(
			HttpServletRequest request,
			@RequestBody VBqTransfer vBqTransfer
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addTransfer")){
			return -3333;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllBqTransfer.addTransfer(vBqTransfer.getBqReceptionDetailIds(), vBqTransfer.getInReceptionId(), hotelId, createUserId, createUserName,vBqTransfer.getReceptionType());
		
	}
	
	/**
	 * 餐宴退单
	 * @param pbbbs
	 * @return
	 * 			-1:消费项不存在
	 */
	@RequestMapping(value = {"/cancelConsume"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int cancelConsume(
			@RequestBody List<PerBqBillBack> pbbbs,
			HttpServletRequest request
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "cancelConsume")){
			return -3333;
		}
		return this.banquetReception.cancelConsume(pbbbs);
		
	}
	
	/**
	 * 餐宴账单打印
	 * @param request
	 * @param bqReceptionId
	 * @return
	 */
	@RequestMapping(value = {"/printBqReception"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String printBqReception(
			HttpServletRequest request,
			long bqReceptionId,
			int bqReceptionFolio
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "printBqReception")){
			return "-3333";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		PerPrintBqReception ppbr = this.banquetReception.printBqReception(bqReceptionId,bqReceptionFolio, hotelId, createUserName);
		
		return JSON.toJSONString(ppbr);
	}
	
	
	/**
	 * 获取账单列表，交叉使用
	 * @param request
	 * @param receptionState
	 * @param receptionType
	 * @param createDate
	 * @param checkoutDate
	 * @return
	 */
	@RequestMapping(value = {"/listAllReception"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String listAllReception(
			HttpServletRequest request,
			int receptionState,/*客单状态  1未结  2 已结 0为全部*/
			int receptionType,/*1租住客单2非租住客单3餐宴0全部*/
			String createDate,/*创建日期，空为全部*/
			String checkoutDate/*结账日期，空为全部*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listAllReception")){
			return "-3333";
            //return "-3333";
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		List<ReceptionDetail> receptionDetails = this.banquetReception.selectReceptionList(hotelId, receptionState, receptionType, SimpleDateHandler.StringToDateByYMDHMS(createDate), SimpleDateHandler.StringToDateByYMDHMS(checkoutDate));
		List<VReceptionDetail> vReceptionDetails = new LinkedList<>();
		for(ReceptionDetail rd : receptionDetails){
			VReceptionDetail vr = new VReceptionDetail();
			ClassTransfer.parentToChild(rd, vr);
			vr.set_checkoutTime(SimpleDateHandler.DateToStringByYMDHMS(vr.getCheckoutTime()));
			vr.setCheckoutTime(null);
			vr.set_createTime(SimpleDateHandler.DateToStringByYMDHMS(vr.getCreateTime()));
			vr.setCreateTime(null);
			vReceptionDetails.add(vr);
		}
		
		return JSON.toJSONString(vReceptionDetails);
	}
	
}
