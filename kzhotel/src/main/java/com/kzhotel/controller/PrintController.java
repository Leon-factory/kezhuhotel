package com.kzhotel.controller;



import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


import com.alibaba.fastjson.JSON;

import com.kzhotel.BLLI.IBllPrint;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.per.PerPrintAllot;
import com.kzhotel.per.PerPrintInWarehouse;
import com.kzhotel.per.PerPrintInventory;
import com.kzhotel.per.PerPrintOutWarehouse;
import com.kzhotel.per.PerPrintReception;
import com.pub.validation.ValidationStrComp;

@Controller
@RequestMapping("/print")
public class PrintController {
	
	@Resource
	private IBllPrint bllprint;
	@Resource
	private IBllUser bllUser;
	
	/**
	 * create:2017-02-08
	 * 宾客账单报告打印
	 * @param receptionId
	 * @author wyx
	 * @return	PerPrintRecetion model
	 * 修改：
	 * 2017-05-02：新增roomId、guestId参数
	 */
	@RequestMapping( value="/printReception" , method=RequestMethod.POST)
	@ResponseBody
	public String printReception(HttpServletRequest request,
			long receptionId,
			long roomId,
			long guestId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "printReception")){
            return "-3333";
		}
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		if(!ValidationStrComp.checkNumber(receptionId) || !ValidationStrComp.checkNumber(guestId) || !ValidationStrComp.checkNumber(roomId)){
			return "-201";
		}
		PerPrintReception perPrintReceptions = this.bllprint.printReception(receptionId, roomId, guestId, createUsername, (long)clspubcontrollerfunc.intNowHotelId(request));
		return JSON.toJSONString(perPrintReceptions);
	}
	
	
	
	/**
	 * create:2017-05-04
	 * 盘点报告打印
	 * @param request
	 * @param warehouseId
	 * @param inventoryId
	 * @return
	 */
	@RequestMapping( value="/printInventory", method=RequestMethod.POST)
	@ResponseBody
	public String printInventory(HttpServletRequest request,
			long warehouseId,
			long inventoryId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "printInventory")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(warehouseId) || !ValidationStrComp.checkNumber(inventoryId)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long userId = (long)clspubcontrollerfunc.intNowUserId(request);
		String userName = clspubcontrollerfunc.strNowUnm(request);
		PerPrintInventory ppi = this.bllprint.printInventory(hotelId, userId, userName, warehouseId,inventoryId);
		return JSON.toJSONString(ppi);
	}
	
	/**
	 * create:2017-05-04
	 * 入库报告打印
	 * @param request
	 * @param warehouseId
	 * @param goodsinId
	 * @return
	 */
	@RequestMapping( value="/printInWarehouse", method=RequestMethod.POST)
	@ResponseBody
	public String printInWarehouse(HttpServletRequest request,
			long warehouseId,
			long goodsinId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "printInWarehouse")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(warehouseId) || !ValidationStrComp.checkNumber(goodsinId)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long userId = (long)clspubcontrollerfunc.intNowUserId(request);
		String userName = clspubcontrollerfunc.strNowUnm(request);
		PerPrintInWarehouse	ppiw=this.bllprint.printInWarehouseReport(hotelId, userId, userName, warehouseId, goodsinId);
		return JSON.toJSONString(ppiw);
	}
	
	
	/**
	 * create:2017-05-04
	 * 出库报告打印
	 * @param request
	 * @param warehouseId
	 * @param goodsOutId
	 * @return
	 */
	@RequestMapping( value="/printOutWarehouse" , method=RequestMethod.POST)
	@ResponseBody
	public String printOutWarehouse(HttpServletRequest request,
			long warehouseId,
			long goodsOutId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "printOutWarehouse")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(warehouseId) || !ValidationStrComp.checkNumber(goodsOutId)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long userId = (long)clspubcontrollerfunc.intNowUserId(request);
		String userName = clspubcontrollerfunc.strNowUnm(request);
		PerPrintOutWarehouse ppow=this.bllprint.printOutWarehouse(hotelId, userId, userName, warehouseId, goodsOutId);
		return JSON.toJSONString(ppow);
		
	}
	
	
	
	/**
	 * create:2017-05-04
	 * 调拨报告打印
	 * @param request
	 * @param outwarehouseId
	 * @param inwarehouseId
	 * @param allotId
	 * @return
	 */
	@RequestMapping( value="/printAllot", method=RequestMethod.POST)
	@ResponseBody
	public String printAllot(HttpServletRequest request,
			Long outwarehouseId,//起点库
			Long inwarehouseId,//终点库
			Long allotId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "printAllot")){
            return "-3333";
		}
		Long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		Long userId = (long)clspubcontrollerfunc.intNowUserId(request);
		String userName = clspubcontrollerfunc.strNowUnm(request);
		PerPrintAllot ppa = this.bllprint.printAllot(hotelId, userId, userName, outwarehouseId, inwarehouseId, allotId);
		return JSON.toJSONString(ppa);
		
	}

}
