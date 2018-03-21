package com.kzhotel.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;   

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllAccount;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.model.HotelAccount;
import com.kzhotel.pojo.apply;
import com.pub.validation.ValidationStrComp;

@Controller
@RequestMapping("/account")
public class AccountController {
	
	@Resource
	private IBllAccount bllAccount;
	@Resource
	private IBllUser bllUser;
	
	/**
	 * create:2017-06-08
	 * 00-01提交申请
	 * @param hotelName
	 * @param address
	 * @param contact
	 * @param mobile
	 * @param email
	 * @return
	 */
	@RequestMapping( value="/addApply", method=RequestMethod.POST)
	@ResponseBody
	public int addApply(HttpServletRequest request,
			String hotelName,
		    String address,
		    String contact,
		    String mobile,
		    String email,
		    String applyCode/*验证码*/
			){
		String apply = (String)request.getSession().getAttribute("applyCode");
		if(!apply.toUpperCase().equals(applyCode.toUpperCase())){
			return -3;
		}
		return this.bllAccount.addApply(hotelName, address, contact, mobile, email);
		
	}
	
	/**
	 * create:2017-06-08
	 * 获取申请数量
	 * @return
	 */
	@RequestMapping( value="/getApplyCount", method=RequestMethod.POST)
	@ResponseBody
	public int getApplyCount(){
		return this.bllAccount.getApplyCount();
	}
	
	/**
	 * create:2017-06-08
	 * 获取申请列表
	 * @param offset
	 * @param limit
	 * @return
	 */
	@RequestMapping( value="/getApplyList", method=RequestMethod.POST)
	@ResponseBody
	public String getApplyList(
			int offset,
			int limit
			){
		if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		List<apply> applies = this.bllAccount.getApplyList(offset, limit);
		return JSON.toJSONString(applies);
	}
	
	/**
	 * create:2017-06-08
	 * 批准申请
	 * @param applyId
	 * @param mainUsername
	 * @param password
	 * @return
	 * 返回值：
	 * 		-1： applyId不存在；
	 * 		-2：宾馆名称已存在；
	 * 		-3：客主主账号已被占用
	 */
	@RequestMapping( value="/approval", method=RequestMethod.POST)
	@ResponseBody
	public int approval(
			long applyId,//申请id
			String mainUsername,//主账号
			String password//主账号密码
			){
		return this.bllAccount.approval(applyId, mainUsername, password);
	}
	
	/**
	 * create:2017-06-08
	 * 账户数量
	 * @param hotelName
	 * @return
	 */
	@RequestMapping( value="/getAccountCount", method=RequestMethod.POST)
	@ResponseBody
	public int getAccountCount(
			String hotelName//宾馆关键字
			){
		return this.bllAccount.getAccountCount(hotelName);
	}
	
	
	/**
	 * create:2017-06-08
	 * 账户列表
	 * @param hotelName
	 * @param offset
	 * @param limit
	 * @return
	 */
	@RequestMapping( value="/getAccountList", method=RequestMethod.POST)
	@ResponseBody
	public String getAccountList(
			String hotelName,//宾馆关键字
			int offset,
			int limit
			){
		List<HotelAccount> hotelAccounts = this.bllAccount.getAccountList(hotelName, offset, limit);
		return JSON.toJSONString(hotelAccounts);   
	}
	
	/**
	 * create:2017-06-08
	 * 编辑账户
	 * @param hotelId
	 * @param mainUserId
	 * @param mainUsername
	 * @param kezhuUsername
	 * @return
	 */
	@RequestMapping( value="/editAccount", method=RequestMethod.POST)
	@ResponseBody
	public int editAccount(
			long hotelId,
			String kezhuUsername//客主主账号
			){
		
		return this.bllAccount.editAccount(hotelId, kezhuUsername);
		
	}
	
	/**
	 * create:2017-06-08
	 * 密码重置
	 * @param mainUserId
	 * @param replacePassword
	 * @return
	 */
	@RequestMapping( value="/resetPassword", method=RequestMethod.POST)
	@ResponseBody
	public int resetPassword(
			long mainUserId,//主账号id
			String replacePassword//重置密码
			){
		return this.bllAccount.resetPassword(mainUserId, replacePassword);
	}
	
	/**
	 * create:2017-06-08
	 * 移除
	 * @param hotelId
	 * @return
	 */
	@RequestMapping( value="/removeHotel", method=RequestMethod.POST)
	@ResponseBody
	public int removeHotel(
			long hotelId
			){
		
		return this.bllAccount.removeHotel(hotelId);
		
	}
	
	/**
	 * create:2017-06-08
	 * 删除申请
	 * @param applyId
	 * @return
	 */
	@RequestMapping( value="/removeApply", method=RequestMethod.POST)
	@ResponseBody
	public int removeApply(
			long applyId
			){
		return this.bllAccount.removeApply(applyId);
	}

}
