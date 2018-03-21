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
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.BLLI.IBllWarehouse;
import com.kzhotel.model.GoodsStoreDetail;
import com.kzhotel.model.GoodsStoreSummary;
import com.kzhotel.model.extend.GoodsOutDetailChild;
import com.kzhotel.pojo.allot;
import com.kzhotel.pojo.allotdetail;
import com.kzhotel.pojo.goodsin;
import com.kzhotel.pojo.goodsindetail;
import com.kzhotel.pojo.goodsout;
import com.kzhotel.pojo.goodsoutdetail;
import com.kzhotel.pojo.inventory;
import com.kzhotel.pojo.inventorydetail;
import com.kzhotel.pojo.supplier;
import com.kzhotel.pojo.warehouse;
import com.kzhotel.service.IWarehouseService;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.SimpleDateHandler;

@Controller
@RequestMapping("/warehouse")
public class WareHouseController {
	
	@Resource
	private IBllWarehouse bllWarehouse;
	@Resource
	private IBllUser bllUser;
	@Resource
	private IWarehouseService warehouseService;
	
	/**
	 * 新增仓库
	 * @param request
	 * @param warehouseName
	 * @param sortCode
	 * @param remark
	 * @return
	 */
	@RequestMapping(value="/AddWarehouse",method=RequestMethod.POST)
	@ResponseBody
	public int AddWarehouse(HttpServletRequest request,
			String warehouseName,/*库名称*/
		    int sortCode,/*排序*/
		    String remark	/*备注*/
		    ){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "AddWarehouse")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(warehouseName)){
			return -111;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		if(!ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllWarehouse.AddWarehouse(warehouseName, hotelId, Long.valueOf(createUserId),
				createUsername, sortCode, remark);
	}
	
	
	/**
	 * 编辑仓库
	 * @param request
	 * @param warehouseId
	 * @param warehouseName
	 * @param sortCode
	 * @param remark
	 * @return
	 */
	@RequestMapping(value="/EditWarehouse",method=RequestMethod.POST)
	@ResponseBody
	public int EditWarehouse(HttpServletRequest request,
			long warehouseId,/*id*/
			String warehouseName,/*库名称*/
		    int sortCode,/*排序*/
		    String remark	/*备注*/
		    ){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "EditWarehouse")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(warehouseName)){
			return -111;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		if(!ValidationStrComp.checkNumber(sortCode) || !ValidationStrComp.checkNumber(warehouseId)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		int modifyUserId = clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername = String.valueOf(modifyUserId);
		return this.bllWarehouse.EditWarehouse(warehouseId, warehouseName, hotelId,Long.valueOf(modifyUserId)
				,modifyUsername,sortCode, remark);
	}
	
	/**
	 * 根据id获取仓库对象
	 * @param request
	 * @param warehouseId
	 * @return
	 */
	@RequestMapping(value="/getWarehouseListById",method=RequestMethod.POST)
	@ResponseBody
	public String getWarehouseListById(HttpServletRequest request,
			int warehouseId
			){
		int userid = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(userid, "getWarehouseListById")){
			return "-3333";
		}
		if(!ValidationStrComp.checkNumber(warehouseId)){
			return "-201";
		}
		warehouse w = this.bllWarehouse.getWarehouseById(warehouseId);
		List<warehouse> wares = new ArrayList<warehouse>();
		wares.add(w);
		return JSON.toJSONString(wares);
	}
	
	/**
	 * 移除仓库
	 * @param request
	 * @param warehouseId
	 * @return
	 */
	@RequestMapping(value="/DelWarehouse",method=RequestMethod.POST)
	@ResponseBody
	public int DelWarehouse(HttpServletRequest request,
			int warehouseId
			){
		int userid = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(userid, "DelWarehouse")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(warehouseId)){
			return -201;
		}
		return this.bllWarehouse.DelWarehouse(warehouseId);
	}
	
	
	/**
	 * 仓库列表
	 * @param request
	 * @return
	 */
	@RequestMapping(value="/listWarehouse",method=RequestMethod.POST)
	@ResponseBody
	public String listWarehouse(HttpServletRequest request, long warehouseId, int offset, int limit){
		int hotelid = clspubcontrollerfunc.intNowHotelId(request);
		int userid = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(userid, "listWarehouse")){
			return "-3333";
		}
		List<warehouse> warehouseList = this.bllWarehouse.listWarehouse(hotelid,warehouseId, offset, limit);
		return JSON.toJSONString(warehouseList);
	}
	
	/**
	 * create:2017-04-19
	 * 插入入库记录
	 * @param warehouseId
	 * @param remark
	 * @param goodsindetails  包括如下：
	 * goodsindetail对象：
 		goodsId   商品id
		goodsItemCode	商品名称
		goodsCategoryId	商品分类id
   		goodsCategoryName	商品分类名称
		unitName	商品单位
		number	商品数量
		purchasePrice	进价
		supplierId	供应商id
		supplierName 供应商名称
	 * @return
	 * 修改：
	 * 2017-04-19：重做，改为：AddGoodsin
	 */
	@RequestMapping(value="/AddGoodsin",method=RequestMethod.POST)
	@ResponseBody
	public int AddGoodsin(HttpServletRequest request,
			Long warehouseId,/*仓库id*/
			String remark,//备注
			String goodsList
			){
		int userid = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(userid, "AddGoodsin")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(warehouseId) ){
			return -201;
		}
		if(!ValidationStrComp.checkJson(goodsList)){
			return -801;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long operateUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String operateUsername = clspubcontrollerfunc.strNowUnm(request);
		List<goodsindetail> goodsInDetailList = ClsJsonToBean.LstFromJson(goodsList, new TypeToken<ArrayList<goodsindetail>>(){}.getType());
		return this.bllWarehouse.AddGoodsin(hotelId, operateUserId, operateUsername, warehouseId, remark, goodsInDetailList);
	}
	
	/**
	 * create:2017-04-18
	 * 入库单列表
	 * @param warehouseId
	 * @param startTime
	 * @param stopTime
	 * @return
	 * 修改：
	 * 2017-04-18：重做。改为getGoodsinList
	 * 2017-04-24：新增offset,limit参数
	 */
	@RequestMapping(value="/getGoodsinList",method=RequestMethod.POST)
	@ResponseBody
	public String getGoodsinList(HttpServletRequest request,
			int offset,
			int limit,
			long warehouseId,//库房id
			String startTime,//起始日期时间,为null则不限制,yyyy-MM-dd HH:mm:ss
			String stopTime//截止日期时间,为null则不限制
	    	){
		
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(createUserId, "getGoodsinList")){
		return "-3333";
		}
		if(!ValidationStrComp.checkNumber(warehouseId)){
			return "-201";
		}
		long  hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<goodsin> goodsins = this.bllWarehouse.getGoodsinList(offset, limit, hotelId,warehouseId, SimpleDateHandler.StringToDateByYMDHMS(startTime), SimpleDateHandler.StringToDateByYMDHMS(stopTime));
		return JSON.toJSONString(goodsins);
		
	}
	
	/**
	 * create:2017-04-18
	 * 列出入库单下进货明细
	 * @param goodsinId
	 * @return
	 */
	@RequestMapping(value="/getGoodsinDetailList",method=RequestMethod.POST)
	@ResponseBody
	public String getGoodsinDetailList(HttpServletRequest request,
			long goodsinId//进货单id
			){
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(createUserId, "getGoodsinDetailList")){
			return "-3333";
		}
		if(!ValidationStrComp.checkNumber(goodsinId)){
			return "-201";
		}
		List<goodsindetail> goodsindetails =  this.bllWarehouse.getGoodsinDetailList(goodsinId);
		return JSON.toJSONString(goodsindetails);
	}
	
	
	/**
	 * create:2016-12-06
	 * 调拨
	 * @param request
	 * @param fromWarehouseId
	 * @param toWarehouseId
	 * @param remark
	 * @param goodsoutdetaiLlist
	 * @return
	 */
	@RequestMapping(value="/allocation",method=RequestMethod.POST)
	@ResponseBody
	public int allocation(HttpServletRequest request,
			int fromWarehouseId,/*出库id*/
			int toWarehouseId,/*入库id*/
			String remark   /*备注*/,
			String goodsoutdetaiLlist/*商品列表*/
			){
		
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(createUserId, "allocation")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(fromWarehouseId) || !ValidationStrComp.checkNumber(toWarehouseId)){
			return -201;
		}
		if(!ValidationStrComp.checkJson(goodsoutdetaiLlist)){
			return -801;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long operatorUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String operatorUsername = clspubcontrollerfunc.strNowUnm(request);
		List<allotdetail> gdList = ClsJsonToBean.LstFromJson(goodsoutdetaiLlist, new TypeToken<ArrayList<allotdetail>>(){}.getType());
		return this.bllWarehouse.allot(hotelId, fromWarehouseId, toWarehouseId, gdList, operatorUserId, operatorUsername, remark);
	}
	
	
	
	/**
	 * 增加供应商
	 * @param request
	 * @param supplierName
	 * @param contact
	 * @param telephone
	 * @param mobile
	 * @param address
	 * @param bank
	 * @param accountName
	 * @param accountNo
	 * @param remark
	 * @param sortCode
	 * @return
	 */
	@RequestMapping(value="/addSupplier",method=RequestMethod.POST)
	@ResponseBody
	public int addSupplier(HttpServletRequest request,
			String supplierName,/*供应商名称*/
			String contact,/*联系人*/
			String telephone,/*联系电话*/
			String mobile,/*联系手机*/
			String address,/*地址*/
			String bank,/*开户银行*/
			String accountName,/*账户名称*/
			String accountNo,/*帐号*/
			String remark,
			int sortCode	/*排序*/
			){
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(createUserId, "addSupplier")){
			return -3333;
		}
		if(!ValidationStrComp.checkStringName(contact) || !ValidationStrComp.checkStringName(accountName)||
				!ValidationStrComp.checkStringName(bank) ){
			return -111;
		}
		if(!ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		if(!ValidationStrComp.checkTelphone(telephone)){
			return -302;
		}
		if(!ValidationStrComp.checkMobile(mobile)){
			return -301;
		}
		if(!ValidationStrComp.checkAddress(address)){
			return -113;
		}
		if(!ValidationStrComp.checkBankAccount(accountNo)){
			return -601;
		}
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		String createUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllWarehouse.addSupplier(supplierName, contact, telephone, mobile, address, bank, accountName, 
				accountNo, remark, hotelId, (long)createUserId, createUsername, sortCode);
	}
	
	/**
	 * 编辑供应商
	 * @param request
	 * @param supplierId
	 * @param supplierName
	 * @param contact
	 * @param telephone
	 * @param mobile
	 * @param address
	 * @param bank
	 * @param accountName
	 * @param accountNo
	 * @param remark
	 * @param sortCode
	 * @return
	 */
	@RequestMapping(value="/editSupplier",method=RequestMethod.POST)
	@ResponseBody
	public int editSupplier(HttpServletRequest request,
			long supplierId,/*id*/
			String supplierName,/*供应商名称*/
			String contact,/*联系人*/
			String telephone,/*联系电话*/
			String mobile,/*联系手机*/
			String address,/*地址*/
			String bank,/*开户银行*/
			String accountName,/*账户名称*/
			String accountNo,/*帐号*/
			String remark,
			int sortCode /*排序*/
			){
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(createUserId, "editSupplier")){
			return -3333;
		}
		if( !ValidationStrComp.checkStringName(supplierName) ||!ValidationStrComp.checkStringName(accountName) || 
				!ValidationStrComp.checkStringName(contact) ||!ValidationStrComp.checkStringName(bank)){
			return -111;
		}
		if( !ValidationStrComp.checkNumber(sortCode) || !ValidationStrComp.checkNumber(supplierId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkTelphone(telephone)){
			return -302;
		}
		
		if(!ValidationStrComp.checkMobile(mobile)){
			return -301;
		}
		
		if(!ValidationStrComp.checkAddress(address)){
			return -113;
		}
		
		if(!ValidationStrComp.checkBankAccount(accountNo)){
			return -601;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		long hotelId =(long) clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUsername = clspubcontrollerfunc.strNowUnm(request);
		return this.bllWarehouse.editSupplier(supplierId, supplierName, contact, telephone, mobile, address, bank, 
				accountName, accountNo, remark, hotelId, modifyUserId, modifyUsername, sortCode);
		
	}
	
	
	/**
	 * 移除供应商
	 * 返回-1：表示存在入库或出库记录，不能删除
	 * 返回>0：删除成功
	 * @param supplierId
	 * @return
	 */
	@RequestMapping(value="/delSupplierById",method=RequestMethod.POST)
	@ResponseBody
	public int delSupplierById(HttpServletRequest request,
			long supplierId	/*id*/
			){
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(createUserId, "delSupplierById")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(supplierId)){
			return -201;
		}
		return this.bllWarehouse.delSupplierById(supplierId);
	}
	
	
	/**
	 * 供应商数量
	 * @param request
	 * @param supplierName
	 * @return
	 */
	 @RequestMapping(value="/getSupplierCount",method=RequestMethod.POST)
	 @ResponseBody
	 public int getSupplierCount(HttpServletRequest request,
		    	String supplierName	/*供应商名称模糊查询*/
		    	){
		int createUserId = clspubcontrollerfunc.intNowUserId(request);
		if(!this.bllUser.hasPermision(createUserId, "getSupplierCount")){
			return -3333;
		}
		if(!ValidationStrComp.checkStringName(supplierName)){
			return -111;
		}
		
		int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		return this.bllWarehouse.getSupplierCount(hotelId, supplierName);
	 }
	 
	 /**
	  * 供应商列表
	  * @param request
	  * @param supplierName
	  * @param offset
	  * @param limit
	  * @return
	  */
	  @RequestMapping(value="/listSupplierPage",method=RequestMethod.POST)
	  @ResponseBody
	  public String listSupplierPage(HttpServletRequest request,
		    	String supplierName,	/*供应商名称模糊查询*/
		    	int offset,
		    	int limit
		    	){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "listSupplierPage")){
			  return "-3333";
		  }
		  
		  if( !ValidationStrComp.checkNumber(offset)||!ValidationStrComp.checkNumber(limit)){
			  return "-201";
		  }
		  
		  if(!ValidationStrComp.checkStringName(supplierName)){
			  return "-111";
		  }
		  
		  int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		  List<supplier> suppliers = this.bllWarehouse.listSupplierPage(hotelId, supplierName, offset, limit);
		  return JSON.toJSONString(suppliers);
	  }
	  
	  /**
	   * create:2017-04-21
	   * 插入出库记录
	   * @param warehouseId
	   * @param remark
	   * @param list对象包括：
	   *	goodsId   商品id
	   *	goodsItemCode	商品名称
	   *	goodsCategoryId	商品分类id
	   *	goodsCategoryName	商品分类名称
	   *	unitName	商品单位
	   *	number	商品数量
	   *	purchasePrice	进价
	   *	remark	备注
	   * @param typeCode
	   * @param reference
	   * @return
	   * 变更零售内部出库
	   */
	  @RequestMapping(value="/AddGoodsout",method=RequestMethod.POST)
	  @ResponseBody
	  public int AddGoodsout(HttpServletRequest request,
			  long warehouseId,/*仓库id*/
			  String remark   /*备注*/,
			  String list,//出库明细
			  int typeCode//出库方式，1领用   2加单或退单
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "AddGoodsout")){
				return -3333;
		  }
		  if(!ValidationStrComp.checkNumber(warehouseId) || !ValidationStrComp.checkNumber(typeCode)){
			  return -201;
		  }
		  
		  if(!ValidationStrComp.checkRemark(remark) ){
			  return -112;
		  }
		  
		  if(!ValidationStrComp.checkJson(list)){
			  return -801;
		  }
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  long operatorUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		  String operatorUsername = clspubcontrollerfunc.strNowUnm(request);
		  List<goodsoutdetail> goodsoutdetails = ClsJsonToBean.LstFromJson(list, new TypeToken<ArrayList<goodsoutdetail>>(){}.getType());
		  return this.bllWarehouse.AddGoodsout(hotelId, operatorUserId, operatorUsername, warehouseId, remark, goodsoutdetails, typeCode);
	  }
	  
	  
	  /**
	   * create：2017-04-21
	   * 出库报告:列出出库单
	   * @param warehouseId
	   * @param startTime
	   * @param stopTime
	   * @return
	   * 修改：
	   * 2017-04-24：新增offset,limit参数
	   */
	  @RequestMapping(value="/getGoodsoutList",method=RequestMethod.POST)
	  @ResponseBody
	  public String getGoodsoutList(HttpServletRequest request,
			  int offset,
			  int limit,
			  long warehouseId,//库房id
			  String startTime,//起始日期时间,为null则不限制
			  String stopTime//截止日期时间,为null则不限制
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getGoodsoutList")){
			  return "-3333";
		  }
		  if(!ValidationStrComp.checkNumber(warehouseId)){
			  return "-201";
		  }
		  
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  List<goodsout> goodsouts = this.bllWarehouse.getGoodsoutList(offset, limit, hotelId, warehouseId, SimpleDateHandler.StringToDateByYMDHMS(startTime), SimpleDateHandler.StringToDateByYMDHMS(stopTime));
		  return JSON.toJSONString(goodsouts);
		  
	  }
	  
	  
	  /**
	   * create:2017-04-21
	   * 出库报告：列出出库单下进货明细
	   * @param goodsoutId
	   * @return
	   */
	  @RequestMapping(value="/getGoodsoutDetailList",method=RequestMethod.POST)
	  @ResponseBody
	  public String getGoodsoutDetailList(HttpServletRequest request,
			  long goodsoutId//出货单id
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getGoodsoutDetailList")){
			  return "-3333";
		  }
		  if(!ValidationStrComp.checkNumber(goodsoutId)){
			  return "-201";
		  }
		  List<GoodsOutDetailChild> goodsoutdetails = this.bllWarehouse.getGoodsoutDetailList(goodsoutId);
		  return JSON.toJSONString(goodsoutdetails);
		  
	  }
	  
	  /**
	   * create:2017-04-21
	   * 调拨报告：列出调拨单
	   * @param warehouseId
	   * @return
	   * 修改：
	   * 2017-04-24：删除原有参数warehouseId，新增offset,limit,outwarehouseId,inwarehouseId参数
	   * 2017-04-25：新增startTime、stopTime参数
	   */
	  @RequestMapping(value="/getAllotList",method=RequestMethod.POST)
	  @ResponseBody
	  public String getAllotList(HttpServletRequest request,
			  int offset,
			  int limit,
			  long outwarehouseId,//起点库
			  long inwarehouseId,//终点库
			  String startTime,
			  String stopTime
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getAllotList")){
			  return "-3333";
		  }
		  if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit) ||
				  !ValidationStrComp.checkNumber(outwarehouseId) || !ValidationStrComp.checkNumber(inwarehouseId)){
			  return "-201";
		  }
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  List<allot> allots = this.bllWarehouse.getAllotList(
				  offset, limit,hotelId, outwarehouseId, inwarehouseId,
				  SimpleDateHandler.StringToDateByYMDHMS(startTime),
				  SimpleDateHandler.StringToDateByYMDHMS(stopTime)
				  );
		  return JSON.toJSONString(allots);
	  }
	  
	  /**
	   * create:2017-04-21
	   * 调拨报告：列出调拨单下的明细
	   * @param allotId
	   * @return
	   */
	  @RequestMapping(value="/getAllotDetailList",method=RequestMethod.POST)
	  @ResponseBody
	  public String getAllotDetailList(HttpServletRequest request,
			  long allotId
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getAllotDetailList")){
			  return "-3333";
		  }
		  if(!ValidationStrComp.checkNumber(allotId)){
			  return "-201";
		  }
		  List<allotdetail> allots = this.bllWarehouse.getAllotDetailList(allotId);
		  return JSON.toJSONString(allots);
		  
	  }
	  
	  
	  /**
	   * create:2017-04-24
	   * 入库报告:计算入库单数量
	   * @param warehouseId
	   * @param startTime
	   * @param stopTime
	   * @return
	   */
	  @RequestMapping(value="/getGoodsinCount",method=RequestMethod.POST)
	  @ResponseBody
	  public int getGoodsinCount(HttpServletRequest request,
			  long warehouseId,//库房id
			  String startTime,//起始日期时间,为null则不限制
			  String stopTime//截止日期时间,为null则不限制
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getGoodsinCount")){
			  return -3333;
		  }
		  if(!ValidationStrComp.checkNumber(warehouseId)){
			  return -201;
		  }
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  return this.bllWarehouse.getGoodsinCount(hotelId,warehouseId, SimpleDateHandler.StringToDateByYMDHMS(startTime), SimpleDateHandler.StringToDateByYMDHMS(stopTime));
		 
	  }
	  
	  /**
	   * create:2017-04-24
	   * 出库报告:列出出库单数量
	   * @param warehouseId
	   * @param startTime
	   * @param stopTime
	   * @return
	   */
	  @RequestMapping(value="/getGoodsoutCount",method=RequestMethod.POST)
	  @ResponseBody
	  public int getGoodsoutCount(HttpServletRequest request,
			  long warehouseId,//库房id
			  String startTime,//起始日期时间,为null则不限制
			  String stopTime//截止日期时间,为null则不限制
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getGoodsoutCount")){
			  return -3333;
		  }
		  if(!ValidationStrComp.checkNumber(warehouseId)){
			  return -201;
		  }
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  return this.bllWarehouse.getGoodsoutCount(hotelId, warehouseId, SimpleDateHandler.StringToDateByYMDHMS(startTime), SimpleDateHandler.StringToDateByYMDHMS(stopTime));
		 
	  }
	  
	  /**
	   * create:2017-04-24
	   * 调拨报告：计算调拨单数量
	   * @param outwarehouseId
	   * @param inwarehouseId
	   * @return
	   * 修改：
	   * 2017-04-25：新增startTime、stopTime参数
	   */
	  @RequestMapping(value="/getAllotCount",method=RequestMethod.POST)
	  @ResponseBody
	  public int getAllotCount(HttpServletRequest request,
			  long outwarehouseId,//起点库
			  long inwarehouseId,//终点库
			  String startTime,
			  String stopTime
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getAllotCount")){
			  return -3333;
		  }
		  if(!ValidationStrComp.checkNumber(outwarehouseId) || !ValidationStrComp.checkNumber(inwarehouseId)){
			  return -201;
		  }
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  return this.bllWarehouse.getAllotCount(
				  hotelId,outwarehouseId, inwarehouseId,
				  SimpleDateHandler.StringToDateByYMDHMS(startTime),
				  SimpleDateHandler.StringToDateByYMDHMS(stopTime)
				  );
	  }
	  
	  /**
	   * create:2017-04-24
	   * 库存：汇总
	   * @param request
	   * @param warehouseId
	   * @param goodsCategoryId
	   * @param goodsItemCode
	   * @param alertType
	   * @return
	   */
	  @RequestMapping(value="/getGoodsStoreSummary",method=RequestMethod.POST)
	  @ResponseBody
	  public String getGoodsStoreSummary(HttpServletRequest request,
			  long warehouseId,//库房id
			  long goodsCategoryId,//商品类别id,0为全部
			  String goodsItemCode,//商品名称
			  int alertType//报警   0全部，1 报警，2 不报警
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getGoodsStoreSummary")){
			  return "-3333";
		  }
		  if(!ValidationStrComp.checkNumber(warehouseId) || !ValidationStrComp.checkNumber(goodsCategoryId) ||
				  !ValidationStrComp.checkNumber(alertType)){
			  return "-201";
		  }
		  if(!ValidationStrComp.checkStringName(goodsItemCode)){
			  return "-111";
		  }
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  List<GoodsStoreSummary> goodsStoreSummaries = this.bllWarehouse.getGoodsStoreSummary(hotelId, warehouseId, goodsCategoryId, goodsItemCode, alertType);
		  return JSON.toJSONString(goodsStoreSummaries);
	  }
	  
	  /**
	   * create:2017-04-24
	   * 库存：明细
	   * @param request
	   * @param warehouseId
	   * @param goodsCategoryId
	   * @param goodsItemCode
	   * @param alertType
	   * @return
	   */
	  @RequestMapping(value="/getGoodsStoreDetailList",method=RequestMethod.POST)
	  @ResponseBody
	  public String getGoodsStoreDetailList(HttpServletRequest request,
			  long warehouseId,//库房id
			  long goodsCategoryId,//商品类别id,0为全部
			  String goodsItemCode,//商品名称
			  int alertType//报警   0全部，1 报警，2 不报警
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getGoodsStoreDetailList")){
			  return "-3333";
		  }
		  if(!ValidationStrComp.checkNumber(warehouseId) || !ValidationStrComp.checkNumber(goodsCategoryId) ||
				  !ValidationStrComp.checkNumber(alertType)){
			  return "-201";
		  }
		  
		  if(!ValidationStrComp.checkStringName(goodsItemCode)){
			  return "-111";
		  }
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  List<GoodsStoreDetail> goodsStoreDetails = this.bllWarehouse.getGoodsStoreDetailList(hotelId, warehouseId, goodsCategoryId, goodsItemCode, alertType);
		  return JSON.toJSONString(goodsStoreDetails);
	  }
	  
	  
	  /**
	   * create:2017-04-26
	   * 盘点：保存盘点单
	   * @param request
	   * @param warehouseId
	   * @param warehouseName
	   * @param detailList
	   * @return
	   */
	  @RequestMapping(value="/addInventory",method=RequestMethod.POST)
	  @ResponseBody
	  public int addInventory(HttpServletRequest request,
			  long warehouseId,//库id
			  String warehouseName,//库名
			  String detailList//明细      填充inventorydetail对象的实际库存数量storeNumberFinal字段。
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "addInventory")){
			  return -3333;
		  }
		  if(!ValidationStrComp.checkNumber(warehouseId)){
			  return -201;
		  }
		 
		  if(!ValidationStrComp.checkStringName(warehouseName)){
			  return -102;
		  }
		  
		  if(!ValidationStrComp.checkJson(detailList)){
			  return -801;
		  }
		  
		  List<inventorydetail> inventorydetails = ClsJsonToBean.LstFromJson(detailList, new TypeToken<ArrayList<inventorydetail>>(){}.getType());
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  long operationUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		  String operationUsername = clspubcontrollerfunc.strNowUnm(request);
		  return this.bllWarehouse.addInventory(hotelId, warehouseId, warehouseName, operationUserId, operationUsername, inventorydetails);
		  
	  }
	  
	  
	  /**
	   * create:2017-04-26
	   * 盘点：获取盘点前库存明细列表
	   * @param request
	   * @param warehouseId
	   * @return
	   * 返回值：
		 * 	inventorydetail对象：
			 latestPurchasePrice	最新进价
			 storeAmount	盘点前库存金额
			 storeNumber	盘点前库存数量
			 numberChange	盘增/损数量
			 amountChange	盘增/损金额
			 storeNumberFinal	盘点后库存数量
			 storeAmountFinal	盘点后库存金额
	   */
	  @RequestMapping(value="/getInventoryDetailPreList",method=RequestMethod.POST)
	  @ResponseBody
	  public String getInventoryDetailPreList(HttpServletRequest request,
			  long warehouseId
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getInventoryDetailPreList")){
			  return "-3333";
		  }
		  if(!ValidationStrComp.checkNumber(warehouseId)){
			  return "-201";
		  }
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  List<inventorydetail> inventorydetails = this.bllWarehouse.getInventoryDetailPreList(hotelId, warehouseId);
		  return JSON.toJSONString(inventorydetails);
		  
	  }
	  
	  
	  /**
	   * create:2017-04-26
	   * 盘点报告：获取最近的盘点单列表
	   * @param request
	   * @param warehouseId
	   * @param limit
	   * @return
	   */
	  @RequestMapping(value="/getLatestInventoryList",method=RequestMethod.POST)
	  @ResponseBody
	  public String getLatestInventoryList(HttpServletRequest request,
			  long warehouseId,
			  int limit//最近的盘点单数量
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getLatestInventoryList")){
			  return "-3333";
		  }
		  if(!ValidationStrComp.checkNumber(warehouseId) || !ValidationStrComp.checkNumber(limit)){
			  return "-201";
		  }
		  long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		  List<inventory> inventories = this.bllWarehouse.getLatestInventoryList(hotelId, warehouseId, limit);
		  return JSON.toJSONString(inventories);
	  }
	  
	  
	  /**
	   * create:2017-04-26
	   * 盘点报告：按盘点单id获取盘点商品明细
	   * @param inventoryId
	   * @return
	   */
	  @RequestMapping(value="/getInventoryDetailList",method=RequestMethod.POST)
	  @ResponseBody
	  public String getInventoryDetailList(HttpServletRequest request,
			  long inventoryId	//盘点单id
			  ){
		  int createUserId = clspubcontrollerfunc.intNowUserId(request);
		  if(!this.bllUser.hasPermision(createUserId, "getLatestInventoryList")){
			  return "-3333";
		  }
		  if(!ValidationStrComp.checkNumber(inventoryId)){
			  return "-201";
		  }
		  List<inventorydetail> inventorydetails = this.bllWarehouse.getInventoryDetailList(inventoryId);
		  return JSON.toJSONString(inventorydetails);
	  }
	  
	  /**
	   * 仓库count
	   * @param request
	   * @return
	   */
	  @RequestMapping("/listWarehouseCount")
	  @ResponseBody
	  public int listWarehouseCount(HttpServletRequest request, long warehouseId){
		  int hotelId = clspubcontrollerfunc.intNowHotelId(request);
		  return this.warehouseService.listWarehouseCount(hotelId, warehouseId);
	  }

	
}
