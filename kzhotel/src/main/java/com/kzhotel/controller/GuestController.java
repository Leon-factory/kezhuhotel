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
import com.kzhotel.BLLI.IBllGuest;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.BLLModel.BeanGuestMark;
import com.kzhotel.BLLModel.BeanPostValue;
import com.kzhotel.join.guestbycert;
import com.kzhotel.join.guestidchange;
import com.kzhotel.join.guestmemberinfo;
import com.kzhotel.model.ReceptionGuest;
import com.kzhotel.model.RentGuest;
import com.kzhotel.model.paraguserinfo;
import com.kzhotel.model.extend.LeaveRentChild;
import com.kzhotel.model.extend.ReceptionGuestChild;
import com.kzhotel.per.PerLivingGuest;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.ClassTransfer;


@Controller
@RequestMapping("/guest")
public class GuestController {
	@Resource
	private IBllGuest bllGuest;
	@Resource
	private IBllUser bllUser;
	
	/**
	 * 增加在住客人
	 * livingguestJoin 住客对象：
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
	 * @param request
	 * @param isPrimary
	 * @param livingguestjoin
	 * @param receptionId
	 * @return
	 */
	@RequestMapping(value="/AddLivingguest", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int AddLivingguest(HttpServletRequest request,
			int isPrimary,/*是主客*/
			String livingguestjoin,/*顾客对象*/
		    long receptionId/*客单id*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "AddLivingguest")){
	        return -3333;
		}
		int createUserId=clspubcontrollerfunc.intNowUserId(request);
		String createUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		
		if(!ValidationStrComp.checkNumber(isPrimary) || !ValidationStrComp.checkNumber(receptionId)){
			return -201;
		}
		List<ReceptionGuestChild> livingguestJoins = ClsJsonToBean.LstFromJson(livingguestjoin,new TypeToken<ArrayList<ReceptionGuestChild>>(){}.getType());
		for(ReceptionGuestChild rgc:livingguestJoins){
			rgc.setIsPrimary(isPrimary);
			rgc.setHotelId(hotelId);
			rgc.setReceptionId(receptionId);
			int type = rgc.getCertificateType().intValue();
			switch (type) {
			case 1:rgc.setIdentityCardNumber(rgc.getCertificateCode());break;
			case 2:rgc.setPassportNumber(rgc.getCertificateCode());break;
			case 3:rgc.setOfficerCardNumber(rgc.getCertificateCode());break;
			}
		}
		int intresult=0;
		for(int i=0;i<livingguestJoins.size();i++){
			intresult += this.bllGuest.AddLivingguest( livingguestJoins.get(i), (long)createUserId, createUsername, hotelId);
		}
		return intresult;
	}
	
	/**
	 * 根据客单id查询宾客信息
	 * @param request
	 * @param orderId
	 * @return
	 */
	@RequestMapping(value="/listGuestByReceptionId", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listGuestByReceptionId(HttpServletRequest request,
			int orderId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listGuestByReceptionId")){
	        return "-3333";
		}
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(Long.valueOf(orderId))){
			return "-201";
		}
		List<ReceptionGuest> lstpf = this.bllGuest.listGuestByReceptionId(hotelId, orderId);
		List<ReceptionGuestChild> receptionGuestChilds = new ArrayList<ReceptionGuestChild>();
		for(ReceptionGuest rg:lstpf){
			ReceptionGuestChild rgc = new ReceptionGuestChild();
			if(rg.getIdentityCardNumber()!=null && !"".equals(rg.getIdentityCardNumber())){
				rgc.setCertificateType(1);
				rgc.setCertificateCode(rg.getIdentityCardNumber());
			}else if(rg.getPassportNumber()!=null && !"".equals(rg.getPassportNumber())){
				rgc.setCertificateType(2);
				rgc.setCertificateCode(rg.getPassportNumber());
			}else if(rg.getOfficerCardNumber()!=null && !"".equals(rg.getOfficerCardNumber())){
				rgc.setCertificateType(3);
				rgc.setCertificateCode(rg.getOfficerCardNumber());
			}
			ClassTransfer.parentToChild(rg, rgc);
			receptionGuestChilds.add(rgc);
		}
		return JSON.toJSONString(receptionGuestChilds);
	}
	
	/**
	 * update:2017-01-24
	 * @author wyx
	 * 列出在住客人信息
	 * @param request
	 * @param guestName
	 * @param roomCode
	 * @param type
	 * @return
	 */
	@RequestMapping(value="/selectLivingGuest",produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String selectLivingGuest(HttpServletRequest request,
    		String guestName,/*姓名*/
    		String roomCode, /*房号*/
    		int type	/* 2只显示当日欲离,3除去当日欲离 , 0全部 */
    		){
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "selectLivingGuest")){
	        return "-3333";
		}
		if(!ValidationStrComp.checkNumber(Long.valueOf(hotelId))){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(roomCode) || !ValidationStrComp.checkStringName(guestName)){
			return "-111";
		}
		
		List<RentGuest> lstgst = this.bllGuest.selectLivingGuest(hotelId, guestName, roomCode, type);
		return JSON.toJSONString(lstgst);
	}
	
	
	/**
	 * 今日预离客人信息
	 * @param request
	 * @param roomCode
	 * @return
	 */
	@RequestMapping(value="/selectExpectedLeaveGuest",produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String selectExpectedLeaveGuest(HttpServletRequest request,
    		String roomCode /*房号*/
    		){
		int hotelId=clspubcontrollerfunc.intNowHotelId(request);
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "selectExpectedLeaveGuest")){
	        return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(roomCode)){
			return "-111";
		}
		
		List<LeaveRentChild> lstExpGuest = this.bllGuest.selectExpectedLeaveGuest(hotelId,roomCode);
		return JSON.toJSONString(lstExpGuest);
	}
	
	/**
	 * 应离店预警
	 * @param request
	 * @param roomCode
	 * @return
	 */
	@RequestMapping(value="/selectLeaveRentAlert",method=RequestMethod.POST)
	@ResponseBody
	public String selectLeaveRentAlert(HttpServletRequest request,
	    	String roomCode
	    	){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "selectLeaveRentAlert")){
			
	        return "-3333";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkStringName(roomCode)){
			return "-111";
		}
		
		List<LeaveRentChild> leaveRents = this.bllGuest.selectLeaveRentAlert(hotelId, roomCode);
		return JSON.toJSONString(leaveRents);		
	}
	
	/**
	 * 获取所有在住宾客信息
	 * create:2017-02-14
	 * @author wyx
	 * @param request
	 * @param guestName
	 * @param roomCode
	 * @return
	 */
	@RequestMapping(value="/getAllLivingGuest",method=RequestMethod.POST)
	@ResponseBody
	public String getAllLivingGuest(HttpServletRequest request,
			String guestName,
			String roomCode
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getAllLivingGuest")){
	        return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(guestName) || !ValidationStrComp.checkStringName(roomCode)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerLivingGuest> perLivingGuests = this.bllGuest.getAllLivingGuest(hotelId, guestName, roomCode);
		return JSON.toJSONString(perLivingGuests);
	}
	
	
	/**
	 * create:2017-05-16
	 * 根据 账单id 和 房间id 查询该房间下所有宾客信息
	 * @param request
	 * @param receptionId
	 * @param roomId
	 * @return
	 */
	@RequestMapping( value="/getLivingGuestByReceptionIdAndRoomId",method=RequestMethod.POST)
	@ResponseBody
	public String getLivingGuestByReceptionIdAndRoomId(HttpServletRequest request,
			long receptionId,
			long roomId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getLivingGuestByReceptionIdAndRoomId")){
	        return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(receptionId) || !ValidationStrComp.checkNumber(roomId)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<ReceptionGuestChild> receptionGuests = this.bllGuest.getLivingGuestByReceptionId(hotelId, receptionId, roomId);
		return JSON.toJSONString(receptionGuests);
	}

	
	/**
	 * 宾客信息列表
	 * @param request
	 * @param guestName
	 * @param strphone
	 * @param identitycardnumber
	 * @param passportnumber
	 * @param officercardnumber
	 * @return
	 */
	@RequestMapping(value="/lstginfo",produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String lstginfo(HttpServletRequest request,
			String guestName,
			String strphone,
			String identitycardnumber,
			String passportnumber,
			String officercardnumber
    		){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "lstginfo")){
	        return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(guestName)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkMobile(strphone)){
			return "-301";
		}
		
		if(!ValidationStrComp.checkIdCardNumber(identitycardnumber)){
			return "-701";
		}
	
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		paraguserinfo paraguserinfo = new paraguserinfo();
		paraguserinfo.setGuestName(guestName);
		paraguserinfo.setStrphone(strphone);
		paraguserinfo.setIdentitycardnumber(identitycardnumber);
		paraguserinfo.setPassportnumber(passportnumber);
		paraguserinfo.setOfficercardnumber(officercardnumber);
		paraguserinfo.setLonghotelid(hotelId);
		List<guestmemberinfo> lstgst = this.bllGuest.listByGuestInfo(paraguserinfo);
		return JSON.toJSONString(lstgst);
	}
	
	
	/**
	 * 宾客详细信息
	 * @param request
	 * @param guestId
	 * @return
	 */
	@RequestMapping(value="/guestinfodetail",produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String guestinfodetail(HttpServletRequest request,
			long guestId
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "guestinfodetail")){
	        return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(guestId)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
	
		com.kzhotel.join.guestinfodetail lstgst = this.bllGuest.selectguestinfobyid(guestId, hotelId);
		return JSON.toJSONString(lstgst);
	}
	
	/**
	 * 更新宾客 主信息
	 * @param request
	 * @param gmaininfo
	 * @return
	 */
	@RequestMapping(value="/updateguesterinfo",produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int updateguesterinfo(HttpServletRequest request,
			com.kzhotel.join.guestinfodetail gmaininfo
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "updateguesterinfo")){
	        return -3333;
		}
		
		if(gmaininfo==null){
			return 0;
		}
		
		String strnum=clspubcontrollerfunc.strNowUnm(request);
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		gmaininfo.setLonghotelid(hotelId);
		return this.bllGuest.updateguesterinfo(gmaininfo,strnum);
	}
	
	/**
	 * 更新 辅助 信息
	 * @param request
	 * @param benguest
	 * @return
	 */
	@RequestMapping(value="/updatemark",produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int updatemark(HttpServletRequest request,
			BeanGuestMark benguest
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "updatemark")){
	        return -3333;
		}
		if(benguest==null) return 0;
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		String strnum=clspubcontrollerfunc.strNowUnm(request);
		benguest.setStrnum(strnum);
		benguest.setHotelId(hotelId);
		int intresult = this.bllGuest.updatemark(benguest);
		return intresult;
	}
	
	
	/**
	 * create:2017-06-12
	 * 新建宾客
	 * @param request
	 * @param guestName
	 * @param sexCode
	 * @param title
	 * @param phone
	 * @param identityCardNumber
	 * @param passportNumber
	 * @param officeCardNumber
	 * @param email
	 * @param expressAddress
	 * @param group
	 * @return
	 */
	@RequestMapping( value="/addGuest", method=RequestMethod.POST)
	@ResponseBody
	public int addGuest(HttpServletRequest request,
		    String guestName,//姓名
			int sexCode, //性别  0保密 1男 2女
			String title,//称谓
			String phone,//手机号码
			String identityCardNumber,//身份证号码
			String passportNumber,//护照号码
			String officeCardNumber,//军官证号码
			String email,
			String expressAddress,//快地地址
			int group//1vip；2黑名单
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addGuest")){
	        return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(guestName) || !ValidationStrComp.checkStringName(title)){
			return -111;
		}
		
		if(!ValidationStrComp.checkNumber(sexCode) || !ValidationStrComp.checkNumber(group)){
			return -201;
		}
		
		if(!ValidationStrComp.checkMobile(phone)){
			return -301;
		}
		
		if(!ValidationStrComp.checkIdCardNumber(identityCardNumber)){
			return -701;
		}
		
		if(!ValidationStrComp.checkEmail(email)){
			return -401;
		}
		
		if(!ValidationStrComp.checkAddress(expressAddress)){
			return -113;
		}
		long creationUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String creationUsername = clspubcontrollerfunc.strNowUnm(request);
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllGuest.addGuest(guestName, sexCode, title, phone, identityCardNumber, passportNumber, officeCardNumber, email, expressAddress, group, creationUserId, creationUsername, hotelId);
		
	}
	
	/**
	 * 合并宾客
	 * @param request
	 * @param benguest
	 * @return
	 */
	@RequestMapping(value="/updagtenewidbyoldid",produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int updagtenewidbyoldid(HttpServletRequest request,
			guestidchange gidc
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "updagtenewidbyoldid")){
	        return -3333;
		}
		if(gidc==null) return 0;
		String creationUsername = clspubcontrollerfunc.strNowUnm(request);
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		int intresult = this.bllGuest.updagtenewidbyoldid(gidc,creationUsername, hotelId);
		return intresult;
	}
	
	
	/**
	 * 检测要合并的宾客
	 * -2  -3 表示2个用户有一个为空 负值其他错误如下
	 *	4	名字  5手机   6绑定会员手机 7 黑名单 8 会员
	 * 9性别、10称谓、11身份证 12护照号码、13军官证号码、14电子邮件
	 * 15照片、16厂商、17车型、18车牌、19公司名称、20公司税号、21公司地址、22开户行、23账号
	 * @return
	 */
	@RequestMapping(value="/chktwoguest",produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int chktwoguest(HttpServletRequest request,
			guestidchange gidc
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "chktwoguest")){
	        return -3333;
		}
		if(gidc==null) {
			return 0;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllGuest.chktwoguest(gidc,hotelId);
	}
	
	
	
	/**
	 * 3个以内的 宾客详细信息
	 * @param request
	 * @param List<Long> lstlongId
	 * @return
	 */
	@RequestMapping(value="/lstguestinfodetail",produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String lstguestinfodetail(HttpServletRequest request,
			String strlid
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "lstguestinfodetail")){
	        return "-3333";
		}
		BeanPostValue<List<Long>> lstlbp=ClsJsonToBean.BeanFromJson(strlid, 
				new TypeToken<BeanPostValue<ArrayList<Long>>>(){}.getType());
		for(Long guestId:lstlbp.Tpost)
		{
				if(!ValidationStrComp.checkNumber(guestId)){
					return "-201";
				}
		}
		
		//不能太多
		if(lstlbp.Tpost.size()<1 || lstlbp.Tpost.size()>3)
		{
			return "-1111";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<com.kzhotel.join.guestinfodetail> lstgst = this.bllGuest.lstselectguestinfobyid(lstlbp.Tpost, hotelId);
		return JSON.toJSONString(lstgst);
	}
	
	
	/**
	 * create:2017-08-02
	 * 绑定手机号
	 * @param request
	 * @param guestId
	 * @param phone
	 * @return
	 * 返回值：
	 * 		-1：宾客不存在
	 * 		-2：该宾客已经绑定手机号
	 * 		-3：该手机号已经被其他宾客绑定
	 * 		-4：该手机号不是客主会员
	 */
	@RequestMapping(value = {"/bindPhone"}, produces = {"application/json; charset=utf-8"}, method = RequestMethod.POST)
	@ResponseBody
	public int bindPhone(HttpServletRequest request,
			long guestId,
			String phone
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "bindPhone")){
	        return -3333;
		}
		if(!ValidationStrComp.checkNumber(guestId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkMobile(phone)){
			return -301;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		String userName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllGuest.bindPhone(guestId, hotelId, phone, userName);
		
	}
	
	/**
	 * 根据证件号码查询宾客
	 * @author WPersevere
	 * @param request
	 * @param certificateType 证件类型
	 * @param certificateCode 证件号码
	 * @return 	-201: 证件类型不正确；
	 * 			-701: 身份证号码格式不正确；
	 * 			-1: 该用户不存在；
	 */
	@RequestMapping(value = {"/getGuestByCertificate"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getGuestByCertificate(
			HttpServletRequest request,
			int certificateType,
			String certificateCode
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getGuestByCertificate")){
	        return "-3333";
		}
		
		//检验int类型
		if(!ValidationStrComp.checkNumber(certificateType)){
			return "-201";
		}
		
		if(certificateType == 1){
			//当证件类型为身份证时，检验格式（目前只支持检验身份证格式）
			if(!ValidationStrComp.checkIdCardNumber(certificateCode)){
				return "-701";
			}
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		guestbycert guestbycert = this.bllGuest.getGuestByCertificate(certificateType, certificateCode, hotelId);
		if(guestbycert == null){
			return "-1";
		}
		
		return JSON.toJSONString(guestbycert);
		
		
	}
	
	/**
	 * 通过手机查找宾客
	 * @param request
	 * @param phone
	 * @return
	 */
	@RequestMapping(value = {"/getGuestByPhone"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getGuestByPhone(HttpServletRequest request,
			String phone
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getGuestByPhone")){
	        return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return JSON.toJSONString(this.bllGuest.listGuestByPhone(phone, hotelId));
	}
	
	
}
	
