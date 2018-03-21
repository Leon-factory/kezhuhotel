package com.kzhotel.controller;


import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllRent;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.model.extend.RentChild;
import com.pub.validation.ValidationStrComp;


@Controller
@RequestMapping("/rent")
public class RentController {
	@Resource
	private IBllRent bllRent;
	@Resource
	private IBllUser bllUser;

	/**
	 * 根据客单id获取房租信息
	 * @param request
	 * @param receptionId
	 * @param livingStates
	 * @return
	 */
	@RequestMapping(value="/listRentByReceptionId", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listRentByReceptionId(HttpServletRequest request,
			long receptionId,	/*客单id*/
			String livingStates		/*租住状态                   空""代表所有， 1在住，2离开*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listRentByReceptionId")){
			return "-3333";
		}
		if(!ValidationStrComp.checkNumber(Long.valueOf(receptionId))){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(livingStates)){
			return "-111";
		}
		
		List<RentChild> lstpf = this.bllRent.listRentByReceptionId(receptionId,livingStates);
		return JSON.toJSONString(lstpf);
	}
	

	
	/**
	 * 退房
	 * @param request
	 * @param rentId
	 * @return
	 */
	@RequestMapping(value="/exitRoom",method=RequestMethod.POST)
	@ResponseBody
	public int exitRoom(HttpServletRequest request,Long rentId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "exitRoom")){
			return -3333;
		}
		long createUserId = (long)clspubcontrollerfunc.intNowHotelId(request);
		String createUsername =  clspubcontrollerfunc.strNowUnm(request);
		if(!ValidationStrComp.checkNumber(Long.valueOf(rentId))){
			return -201;
		}
		return this.bllRent.exitRoom(rentId, createUserId, createUsername);
	}
}
