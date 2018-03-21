package com.kzhotel.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllGoods;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.join.goodsJoin;
import com.kzhotel.per.PerGoodsDetail;
import com.pub.validation.ValidationStrComp;



@Controller
@RequestMapping("/Goods")
public class GoodsController {
	@Resource
	private IBllGoods bllGoods;
	@Resource
	private IBllUser bllUser;

	/**
	 * 新增商品
	 * @param request
	 * @param goodsItemCode
	 * @param goodsCategoryId
	 * @param unitName
	 * @param price
	 * @param sortCode
	 * @param alertNumber
	 * @param saleState
	 * @param remark
	 * @param photo
	 * @return
	 */
	@RequestMapping(value="/add", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int add(HttpServletRequest request,
			String goodsItemCode,/*商品名称*/
		    long goodsCategoryId,/*商品类别id*/
		    String unitName,/*单位，如   瓶，桶*/
		    int price,/*价格，分*/
		    int sortCode,/*优先级*/
		    int alertNumber,/*警示数量  ，大于或等于0*/
		    int saleState,/*经营状态，1上架，2，下架*/
		    String remark,/*备注*/
		    String photo/*照片*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addGoods")){
            return -3333;
		}
		int createUserId=clspubcontrollerfunc.intNowUserId(request);
		String createUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		/*宾馆id*/
		Long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);	
		if(!ValidationStrComp.checkNumber(goodsCategoryId) || !ValidationStrComp.checkNumber(price) ||!ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(goodsItemCode) || !ValidationStrComp.checkStringName(unitName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -111;
		}
		
		return this.bllGoods.AddGoods(goodsItemCode, goodsCategoryId, unitName, price, sortCode, 
				alertNumber, saleState, remark, hotelId, photo, (long)createUserId, createUsername);
	}
	
	/**
	 * 编辑商品
	 * @param request
	 * @param goodsId
	 * @param goodsItemCode
	 * @param goodsCategoryId
	 * @param unitName
	 * @param price
	 * @param sortCode
	 * @param alertNumber
	 * @param saleState
	 * @param remark
	 * @param photo
	 * @return
	 */
	@RequestMapping(value="/edit", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int edit(HttpServletRequest request,
			long goodsId,/*id*/
			String goodsItemCode,/*商品名称*/
		    long goodsCategoryId,/*商品类别id*/
		    String unitName,/*单位，如   瓶，桶*/
		    int price,/*价格，分*/
		    int sortCode,/*是否可调价*/
		    int alertNumber,/*警示数量*/
		    int saleState,/*经营状态*/
		    String remark,/*备注*/
		    String photo/*照片*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editGoods")){
            return -3333;
		}
		/*宾馆id*/
		int modifyUserId=clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername=clspubcontrollerfunc.strNowUnm(request); /*创建人*/
		long hotelId=(long)clspubcontrollerfunc.intNowHotelId(request);
		if(!ValidationStrComp.checkNumber(goodsCategoryId) || !ValidationStrComp.checkNumber(price) ||
				!ValidationStrComp.checkNumber(sortCode) || !ValidationStrComp.checkNumber(goodsId)){
			return -201;
		}
		if(!ValidationStrComp.checkStringName(goodsItemCode) || !ValidationStrComp.checkStringName(unitName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -111;
		}
		
		return this.bllGoods.EditGoods(goodsId, goodsItemCode, goodsCategoryId, unitName, price, sortCode, 
				alertNumber, saleState, remark, hotelId, photo, (long)modifyUserId, modifyUsername);
	}
	
	/**
	 * 删除商品
	 * @param request
	 * @param goodsId
	 * @return
	 */
	@RequestMapping(value="/del", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int del(HttpServletRequest request,
			int goodsId
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteGoods")){
            return -3333;
		}
		if(!ValidationStrComp.checkNumber(Long.valueOf(goodsId))){
			return -201;
		}
		return this.bllGoods.DelGoodsById(goodsId);
	}
	

	/**
	 * 商品数量
	 * @param request
	 * @param goodsName
	 * @param goodsCategoryId
	 * @param saleState
	 * @param usageCode
	 * @return
	 * 修改：
	 * 2017-04-19：删除usageCode参数
	 */
	@RequestMapping(value="/getGoodsCount", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public int getGoodsCount(HttpServletRequest request,
			String goodsName,/*按商品名称搜索*/
			int goodsCategoryId, /*按商品分类id搜索*/
			int saleState	/*经营状态   1上架 2下架  0全部*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getGoodsCount")){
	        return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(goodsName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkNumber(goodsCategoryId)){
			return -201;
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		return this.bllGoods.getGoodsCount(hotelId, goodsName, goodsCategoryId, saleState);
	}
	
	
	/**
	 * 商品列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param goodsName
	 * @param goodsCategoryId
	 * @param saleState
	 * @param usageCode
	 * @return
	 * 修改：
	 * 2017-04-19：删除usageCode参数
	 */
	@RequestMapping(value="/listGoodsPage", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String listGoodsPage(HttpServletRequest request,
			int offset,
			int limit,
			String goodsName, /*按商品名称搜索*/
			int goodsCategoryId,  /*按商品分类id搜索*/
			int saleState /*经营状态   1上架 2下架  0全部*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listGoodsPage")){
	        return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(goodsName)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit) ||!ValidationStrComp.checkNumber(goodsCategoryId)){
			return "-201";
		}
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		List<goodsJoin> lstpf = this.bllGoods.listGoodsPage(offset, limit, hotelId, goodsName, goodsCategoryId, saleState);
		return JSON.toJSONString(lstpf);
	}
	
	
	
	
	/**
	 * create:2017-07-06
	 * 根据库存情况查询商品信息
	 * @param request
	 * @param warehouseId
	 * @param goodsCategoryId
	 * @return
	 */
	@RequestMapping(value={"/getGoodsListByWarehouse"}, produces={"application/json; charset=utf-8"}, method={RequestMethod.POST})
	@ResponseBody
	public String getGoodsListByWarehouse(HttpServletRequest request,
			long warehouseId,/*库id*/
			long goodsCategoryId/*商品类别ID*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getGoodsListByWarehouse")){
	        return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(warehouseId) || !ValidationStrComp.checkNumber(goodsCategoryId)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerGoodsDetail> perGoodsDetails = this.bllGoods.getGoodsListByWarehouse(hotelId,warehouseId,goodsCategoryId);
		return JSON.toJSONString(perGoodsDetails);
		
	}
	
}
