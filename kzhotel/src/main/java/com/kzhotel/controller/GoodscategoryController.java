package com.kzhotel.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllGoodscategory;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.pojo.goodscategory;
import com.pub.validation.ValidationStrComp;


@Controller
@RequestMapping("/Goodscategory")
public class GoodscategoryController {
	@Resource
	private IBllGoodscategory bllGoodscategory;
	@Resource
	private IBllUser bllUser;

	/**
	 * 增加商品分类
	 * @param request
	 * @param goodsCategoryName
	 * @param sortCode
	 * @return
	 * 修改：
	 * 2017-04-19：删除useageCode用途字段
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			String goodsCategoryName,/*商品分类名称*/
			int sortCode/*排序*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addGoodsCategory")){
            return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(goodsCategoryName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllGoodscategory.AddGoodscategory(goodsCategoryName, sortCode, hotelId, modifyUserId, modifyUsername);
		
	}
	
	/**
	 * 编辑商品分类
	 * @param request
	 * @param goodsCategoryId
	 * @param goodsCategoryName
	 * @param sortCode
	 * @return
	 * 修改：
	 * 2017-04-19：删除useageCode用途字段
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			long goodsCategoryId,
			String goodsCategoryName,/*商品分类名称*/
			int sortCode/*排序*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editGoodsCategory")){
            return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(goodsCategoryName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkNumber(sortCode) ||!ValidationStrComp.checkNumber(goodsCategoryId)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllGoodscategory.EditGoodscategory(goodsCategoryId, goodsCategoryName, sortCode, hotelId, modifyUserId, modifyUsername);
	}
	
	/**
	 * 删除商品分类
	 * @param request
	 * @param goodsCategoryId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int goodsCategoryId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "delGoodsCategory")){
            return -3333;
		}
		if(!ValidationStrComp.checkNumber(Long.valueOf(goodsCategoryId))){
			return -201;
		}
		return this.bllGoodscategory.DelGoodscategory(goodsCategoryId);
	}
	
	
	/**
	 * 商品分类数量
	 * @param request
	 * @param goodsCategoryName
	 * @return
	 * 修改：
	 * 2017-04-19：删除useageCode用途字段
	 */
	@RequestMapping(value="/getGoodscategoryCount", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int getGoodscategoryCount(HttpServletRequest request,
    		String goodsCategoryName/*按名称模糊查询*/
			){
//		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
//		if(intselfuid<1) {return -3335;}
//		else if(!this.bllUser.hasPermision(intselfuid, "getGoodsCategoryCount")){
//            return -3333;
//		}
		
		if(!ValidationStrComp.checkStringName(goodsCategoryName)){
			return -111;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllGoodscategory.getGoodscategoryCount(hotelId,goodsCategoryName);
	}
	
	
	/**
	 * 商品分类列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param goodsCategoryName
	 * @return
	 * 修改：
	 * 2017-04-19：删除useageCode用途字段
	 */
	@RequestMapping(value="/listGoodscategoryPage", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listGoodscategoryPage(HttpServletRequest request,
    		int offset,/*分页offset*/
    		int limit,/*分页limit*/
    		String goodsCategoryName /*按名称模糊查询*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listGoodscategoryPage")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(goodsCategoryName)){
			return "-111";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<goodscategory> lstpf = this.bllGoodscategory.listGoodscategoryPage(offset, limit, hotelId, goodsCategoryName);
		return JSON.toJSONString(lstpf);
	}
}
