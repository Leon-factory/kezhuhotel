package com.kzhotel.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.kzhotel.BLLI.IBllNightCheck;



/**
 * 夜审
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/nightCheck")
public class NightCheckController {
	
	private static final int ID = 1111;
	
	@Resource
	private IBllNightCheck bllnightcheck;
	
	
	@RequestMapping( value="/getNightCheck",method=RequestMethod.GET)
	@ResponseBody
	public int getNightCheck(int id){
		if(id!=ID){
			return -1;
		}
		return this.bllnightcheck.trial();
	}
	

	@RequestMapping( value="/updateRFM")
	@ResponseBody
	public int updateRFM(int id){
		if(id!=ID){
			return -1;
		}
		this.bllnightcheck.updateRFM();
		return 1;
	}
	
	
	/**
	 * 夜审时，将未支付且超时的预订单状态修改为取消
	 * @param id
	 * @return
	 */
	@RequestMapping( value="/NC_UpdateReserveState")
	@ResponseBody
	public int NC_UpdateReserveState(int id){
		if(id != ID){
			return -1;
		}
		return this.bllnightcheck.NC_UpdateReserveState();
	}
	
	
	@RequestMapping("/updateMemberRFM")
	@ResponseBody
	public int updateMemberRFM(int id){
		if(id != ID){
			return -1;
		}
		this.bllnightcheck.updateMemberRFM();
		return 1;
	}

}
