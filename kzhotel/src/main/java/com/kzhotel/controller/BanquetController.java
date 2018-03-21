package com.kzhotel.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.PubJavadill.java.CmpLocalDT;
import com.alibaba.fastjson.JSON;
import com.eapor.BLLI.IBllBanquetChart;
import com.eapor.BLLI.IBllBanquetItem;
import com.eapor.BLLI.IBllBanquetReception;
import com.eapor.BLLI.IBllBanquetType;
import com.eapor.BLLI.IBllBqBreakfast;
import com.eapor.BLLI.IBllLocation;
import com.eapor.BLLI.IBllRestaurant;
import com.eapor.bean.PerBanquetItem;
import com.eapor.bean.PerBanquetLocation;
import com.eapor.bean.PerBanquetReception;
import com.eapor.bean.PerBanquetRestaurant;
import com.eapor.bean.PerBanquetType;
import com.eapor.per.PerBanquetChart;
import com.eapor.per.PerBqBreakfastInfo;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.view.VBqRcpAndRest;
import com.pub.validation.ValidationStrComp;

import me.persevere.util.SimpleDateHandler;

/**
 * 餐宴系统controller
 * @author WPersevere
 * @version 1.0
 *
 */
@Controller
@RequestMapping(value = {"/banquet"})
public class BanquetController {
	
	@Resource
	private IBllLocation bllBanquetLocation;
	@Resource
	private IBllRestaurant bllBanquetRestaurant;
	@Resource
	private IBllBanquetType bllBanquetType;
	@Resource
	private IBllBanquetItem bllBanquetItem;
	@Resource
	private IBllBanquetChart bllBanquetChart;
	@Resource
	private IBllUser bllUser;
	@Resource
	private IBllBqBreakfast bllBqBreakfast;
	@Resource
	private IBllBanquetReception bllBqReception;
	
	/**
	 * 餐宴位置部分
	 */
	
	/**
	 * 餐宴系统 位置管理  新增位置
	 * @param request
	 * @param locationName 位置名称，不可为""
	 * @param sortCode 优先级
	 * @return
	 * 			>0:成功<br />
	 * 			=0:失败<br />
	 * 			-1：位置名称已存在<br />
	 * 			-111：locationName 为""或位置名称长度超过32<br />
	 * 			-201：sortCode 不是数字<br />
	 */
	@RequestMapping(value = {"/addBanquetLocation"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int addBanquetLocation(
			HttpServletRequest request,
			String locationName,/*位置名称，不可为""*/ 
			int sortCode/*优先级*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addBanquetLocation")){
			return -3333;
		}
		
		if(locationName.length() <= 0 || !ValidationStrComp.checkStringName(locationName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllBanquetLocation.addBanquetLocation(hotelId, locationName, sortCode, createUserId, createUserName);
		
	}
	
	/**
	 * 餐宴系统 位置管理  编辑位置
	 * @param request
	 * @param banquetLocationId 餐宴位置id
	 * @param locationName 位置名称，不可为""
	 * @param sortCode 优先级
	 * @return
	 * 			>0:成功<br />
	 * 			=0:失败<br />
	 * 			-1：位置名称已存在<br />
	 * 			-111：locationName 为""或位置名称长度超过32<br />
	 * 			-201：sortCode 或 banquetLocationId  不是数字<br />
	 */
	@RequestMapping(value = {"/editBanquetLocation"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int editBanquetLocation(
			HttpServletRequest request,
			long banquetLocationId,/*餐宴位置id*/
			String locationName,/*位置名称，不可为""*/
			int sortCode/*优先级*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editBanquetLocation")){
			return -3333;
		}
		
		if(locationName.length() <= 0 || !ValidationStrComp.checkStringName(locationName)){
			return -111;
		}
		
		if(!ValidationStrComp.checkNumber(sortCode) || !ValidationStrComp.checkNumber(banquetLocationId)){
			return -201;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllBanquetLocation.editBanquetLocation(hotelId, banquetLocationId, locationName, sortCode, modifyUserId, modifyUserName);
		
	}
	
	/**
	 * 餐宴系统 位置管理 删除位置
	 * @param request
	 * @param banquetLocationId 餐宴位置id
	 * @return
	 * 			>0:成功<br />
	 * 			=0:失败<br />
	 * 			-1：该位置下含有会馆，无法删除
	 * 			-201：banquetLocationId 不是数字
	 */
	@RequestMapping(value = {"/deleteBanquetLocation"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int deleteBanquetLocation(
			HttpServletRequest request,
			long banquetLocationId/*餐宴位置id*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteBanquetLocation")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(banquetLocationId)){
			return -201;
		}
		
		return this.bllBanquetLocation.deleteBanquetLocation(banquetLocationId);
	}
	
	
	/**
	 * 餐宴系统 位置管理 获取位置数量
	 * @param request
	 * @param banquetLocationName 餐宴位置名称，可为""
	 * @return
	 * 			>0 位置数量<br />
	 *			=0 无
	 *			-111:banquetLocationName 长度超过32
	 */
	@RequestMapping(value = {"/getBanquetLocationCount"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int getBanquetLocationCount(
			HttpServletRequest request,
			String banquetLocationName/*餐宴位置名称，可为""*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getBanquetLocationCount")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(banquetLocationName)){
			return -111;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllBanquetLocation.getBanquetLocationCount(hotelId, banquetLocationName);
		
	}
	
	/**
	 * 餐宴系统 位置管理 获取位置列表
	 * @param request
	 * @param banquetLocationName 餐宴位置名称
	 * @param offset
	 * @param limit
	 * @return
	 * 			List<PerBanquetLocation>
	 *		PerBanquetLocation结构：
	 *			Long hotelId;//酒店id
	 *			Long banquetLocationId;/*餐宴位置id
	 *			String banquetLocationName;/*餐宴位置名称
	 *			Integer sortCode;/*排序
	 *		-111：banquetLocationName /*长度超过32
	 *		-201：offset 或 limit /*不是数字
	 */
	@RequestMapping(value = {"/listBanquetLocation"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String listBanquetLocation(
			HttpServletRequest request,
			String banquetLocationName,/*餐宴位置名称，可为""*/
			int offset,
			int limit
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listBanquetLocation")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(banquetLocationName)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerBanquetLocation> pbls = this.bllBanquetLocation.listBanquetLocation(hotelId, banquetLocationName, offset, limit);
		return JSON.toJSONString(pbls);
		
		
	}
	
	
	/**
	 * 餐宴会馆部分
	 */
	
	/**
	 * 餐宴系统 餐厅会馆管理 新增餐厅会馆
	 * @param request
	 * @param restaurantName 餐厅会馆名称
	 * @param maxPeople 最大人数
	 * @param banquetLocationId 餐宴位置id
	 * @param sortCode 优先级
	 * @param remark 备注，该参数可为""，且长度限制为28
	 * @return
	 * 			>0:成功<br />
	 * 			=0:名称重复<br />
	 * 			-201：maxPeople 或banquetLocationId 或sortCode 不是数字<br />
	 *			-111：restaurantName 为""或长度超过32<br />
	 *			-112：remark 长度超过28
	 */
	@RequestMapping(value = {"/addRestaurant"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int addRestaurant(
			HttpServletRequest request,
			String restaurantName,/*餐厅会馆名称*/
			long maxPeople,/*最大人数*/
			long banquetLocationId,/*餐宴位置id*/
			long sortCode,/*优先级*/
			String remark/*备注，该参数可为""，且长度限制为28*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addRestaurant")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(maxPeople) || !ValidationStrComp.checkNumber(banquetLocationId) || !ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(restaurantName) || restaurantName.length() == 0){
			return -111;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllBanquetRestaurant.addRestaurant(hotelId, restaurantName, maxPeople, banquetLocationId, sortCode, remark, createUserId, createUserName);
		
	}
	
	/**
	 * 餐宴系统 餐厅会馆管理 编辑餐厅会馆
	 * @param request
	 * @param restaurantId 餐厅会馆id
	 * @param restaurantName 餐厅会馆名称
	 * @param maxPeople 最大人数，默认为0
	 * @param banquetLocationId 餐宴位置id
	 * @param sortCode 优先级
	 * @param remark 备注，该参数可为""，且长度限制为28
	 * @return
	 * 			>0:成功<br />
	 * 			=0:名称重复<br />
	 * 			-201：maxPeople 或banquetLocationId 或sortCode 或 restaurantId 不是数字<br />
	 *			-111：restaurantName 为""或长度超过32<br />
	 *			-112：remark 长度超过28
	 * 			
	 */
	@RequestMapping(value = {"/editRestaurant"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int editRestaurant(
			HttpServletRequest request,
			long restaurantId,/*餐厅会馆id*/
			String restaurantName,/*餐厅会馆名称*/
			long maxPeople,/*最大人数，默认为0*/
			long banquetLocationId,/*餐宴位置id*/
			long sortCode,/*优先级*/
			String remark/*备注，该参数可为""，且长度限制为28*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editRestaurant")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(maxPeople) || !ValidationStrComp.checkNumber(banquetLocationId) 
				|| !ValidationStrComp.checkNumber(sortCode) || !ValidationStrComp.checkNumber(restaurantId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(restaurantName) || restaurantName.length() == 0){
			return -111;
		}
		
		if(!ValidationStrComp.checkRemark(remark)){
			return -112;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllBanquetRestaurant.editRestaurant(hotelId, restaurantId, restaurantName, maxPeople, banquetLocationId, sortCode, remark, modifyUserId, modifyUserName);
	}
	
	/**
	 * 餐宴系统 餐厅会馆管理 删除餐厅会馆
	 * @param restaurantId 餐厅会馆id
	 * @return
	 * 			>0:成功
	 * 			=0:失败
	 * 			-201:restaurantId 不是数字
	 */
	@RequestMapping(value = {"/deleteRestaurant"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int deleteRestaurant(
			HttpServletRequest request,
			long restaurantId/*餐厅会馆id*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteRestaurant")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(restaurantId)){
			return -201;
		}
		
		return this.bllBanquetRestaurant.deleteRestaurant(restaurantId);
	}
	
	
	/**
	 * 餐宴系统 餐厅会馆管理 获取餐厅会馆数量
	 * @param request
	 * @param restaurantName 餐厅会馆名称
	 * @param banquetLocationId 餐宴位置id
	 * @return
	 * 			-201: banquetLocationId 不是数字
	 * 			-111：restaurantName 长度超过32
	 */
	@RequestMapping(value = {"/getRestaurantCount"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public long getRestaurantCount(
			HttpServletRequest request,
			String restaurantName,/*餐厅会馆名称*/
			long banquetLocationId/*餐宴位置id*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getRestaurantCount")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(banquetLocationId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(restaurantName)){
			return -111;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllBanquetRestaurant.getRestaurantCount(hotelId,restaurantName, banquetLocationId);
		
	}
	
	/**
	 * 餐宴系统 餐厅会馆管理 获取餐厅会馆列表
	 * @param request
	 * @param restaurantName 餐厅会馆名称
	 * @param banquetLocationId 餐宴位置id
	 * @param offset
	 * @param limit
	 * @return
	 */
	@RequestMapping(value = {"/listRestaurant"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String listRestaurant(
			HttpServletRequest request,
			String restaurantName,/*餐厅会馆名称*/
			long banquetLocationId,/*餐宴位置id*/
			int offset,
			int limit
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listRestaurant")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(banquetLocationId) || !ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(restaurantName)){
			return "-111";
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerBanquetRestaurant> perRestaurants = this.bllBanquetRestaurant.listRestaurant(hotelId, restaurantName, banquetLocationId, null,offset, limit);
		return JSON.toJSONString(perRestaurants);
	}
	
	
	/**
	 * 餐宴类别部分
	 */
	/**
	 * 餐宴系统 餐宴类别管理 新增类别
	 * @param request
	 * @param banquetTypeName 餐宴类别名称
	 * @param sortCode 优先级
	 * @return
	 * 			>0:成功<br />
	 * 			<=0:失败<br />
	 * 			-201：sortCode 不是数字<br />
	 * 			-111：banquetTypeName 为"" 或 长度超过32
	 */
	@RequestMapping(value = {"/addType"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int addType(
			HttpServletRequest request,
			String banquetTypeName,/*餐宴类别名称*/
			long sortCode/*优先级*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addType")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(sortCode)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(banquetTypeName) || banquetTypeName.length() <= 0){
			return -111;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowHotelId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllBanquetType.addType(hotelId, banquetTypeName, sortCode, createUserId, createUserName);
	
	}
	
	/**
	 * 餐宴系统 餐宴类别管理 编辑类别
	 * @param request
	 * @param banquetTypeId 餐宴类别id
	 * @param banquetTypeName 餐宴类别名称
	 * @param sortCode 优先级
	 * @return 
	 *  		>0:成功<br />
	 * 			<=0:失败<br />
	 * 			-201：sortCode 或 banquetTypeId 不是数字<br />
	 * 			-111：banquetTypeName 为"" 或 长度超过32
	 */
	@RequestMapping(value = {"/editType"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int editType(
			HttpServletRequest request,
			long banquetTypeId,/*餐宴类别id*/
			String banquetTypeName,/*餐宴类别名称*/
			long sortCode/*优先级*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editType")){
			return -3333;
		}
		if(!ValidationStrComp.checkNumber(sortCode) || !ValidationStrComp.checkNumber(banquetTypeId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(banquetTypeName) || banquetTypeName.length() <= 0){
			return -111;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllBanquetType.editType(hotelId, banquetTypeId, banquetTypeName, sortCode, modifyUserId, modifyUserName);
		
	}
	
	/**
	 * 餐宴系统 餐宴类别管理 删除类别
	 * @param banquetTypeId 餐宴类别id
	 * @return
	 * 			>0:成功
	 * 			<=0: 失败
	 * 			-201:banquetTypeId 不是数字
	 */
	@RequestMapping(value = {"/deleteType"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int deleteType(
			HttpServletRequest request,
			long banquetTypeId/*餐宴类别id*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteType")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(banquetTypeId)){
			return -201;
		}
		
		return this.bllBanquetType.deleteType(banquetTypeId);
		
	}
	
	/**
	 * 餐宴系统 餐宴类别管理 获取餐宴类别数量
	 * @param request
	 * @param banquetTypeName 类别名称，用于模糊查询，可为""
	 * @return
	 * 			-111：banquetTypeName 长度超过32<br />
	 */
	@RequestMapping(value = {"/getBanquetTypeCount"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public long getBanquetTypeCount(
			HttpServletRequest request,
			String banquetTypeName/*类别名称，用于模糊查询，可为""*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getBanquetTypeCount")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkStringName(banquetTypeName)){
			return -111;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllBanquetType.getBanquetTypeCount(hotelId, banquetTypeName);
		
	}
	
	/**
	 * 餐宴系统 餐宴类别管理 获取餐宴类别列表
	 * @param request
	 * @param banquetTypeName 类别名称，用于模糊查询，可为""
	 * @param offset
	 * @param limit
	 * @return
	 * 			List<PerBanquetType>
	 *				PerBanquetType结构：
	 *				 	Long banquetTypeId;/*餐宴类别id
	 *					String banquetTypeName;/*餐宴类别名称
	 *					Long hotelId;/*酒店id
	 *					Long sortCode;/*优先级
	 *			-111：banquetTypeName 长度超过32
	 *			-201：offset 或 limit 不是数字
	 */
	@RequestMapping(value = {"/listBanquetType"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String listBanquetType(
			HttpServletRequest request,
			String banquetTypeName,/*类别名称，用于模糊查询，可为""*/
			int offset,
			int limit
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listBanquetType")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(banquetTypeName)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkNumber(offset) || !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerBanquetType> perBanquetTypes = this.bllBanquetType.listBanquetType(hotelId, banquetTypeName, offset, limit);
		return JSON.toJSONString(perBanquetTypes);
	}
	
	
	/**
	 * 餐宴项目部分
	 */
	
	/**
	 * 餐宴系统 餐宴项目管理 新增餐宴项目
	 * @param request
	 * @param banquetTypeId 餐宴类别id
	 * @param banquetItemName 餐宴项目名称
	 * @param unit 单位
	 * @param sortCode 优先级
	 * @param salePrice 销售单价
	 * @param operatingState 经营状态
	 * @return
	 * 				>0:成功
	 * 				<=0:失败
	 * 				-201: banquetTypeId 或 sortCode 或 salePrice 或 operatingState 不是数字
	 * 				-111：  banquetItemName 或 unit 为""或 长度超过32
	 */
	@RequestMapping(value = {"/addBanquetItem"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int addBanquetItem(
			HttpServletRequest request,
			long banquetTypeId,/*餐宴类别id*/
			String banquetItemName,/*餐宴项目名称*/
			String unit,/*单位*/
			long sortCode,/*优先级*/
			long salePrice,/*销售单价*/
			long operatingState/*经营状态*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "addBanquetItem")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(banquetTypeId) || !ValidationStrComp.checkNumber(sortCode) 
				|| !ValidationStrComp.checkNumber(salePrice) || !ValidationStrComp.checkNumber(operatingState)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(banquetItemName) || banquetItemName.length() <= 0
				|| !ValidationStrComp.checkStringName(unit) || unit.length() <= 0){
			return -111;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long createUserId = (long)clspubcontrollerfunc.intNowHotelId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllBanquetItem.addBanquetItem(hotelId, banquetTypeId, banquetItemName, unit, sortCode, salePrice, operatingState, createUserId, createUserName);
	}
	
	/**
	 * 餐宴系统 餐宴项目管理 编辑餐宴项目
	 * @param request
	 * @param banquetTypeId 餐宴类别id
	 * @param banquetItemId 餐宴项目id
	 * @param banquetItemName 餐宴项目名称
	 * @param unit 单位
	 * @param sortCode 优先级
	 * @param salePrice 销售单价
	 * @param operatingState 经营状态
	 * @return
	 * 				>0:成功
	 * 				<=0:失败
	 * 				-201: banquetTypeId 或 sortCode 或 salePrice 或 operatingState 或 banquetItemId 不是数字
	 * 				-111：  banquetItemName 或 unit 为""或 长度超过32
	 */
	@RequestMapping(value = {"/editBanquetItem"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int editBanquetItem(
			HttpServletRequest request,
			long banquetTypeId,/*餐宴类别id*/
			long banquetItemId,/*餐宴项目id*/
			String banquetItemName,/*餐宴项目名称*/
			String unit,/*单位*/
			long sortCode,/*优先级*/
			long salePrice,/*销售单价*/
			long operatingState/*经营状态*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "editBanquetItem")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(banquetTypeId) || !ValidationStrComp.checkNumber(sortCode) 
				|| !ValidationStrComp.checkNumber(salePrice) || !ValidationStrComp.checkNumber(operatingState)
				|| !ValidationStrComp.checkNumber(banquetItemId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(banquetItemName) || banquetItemName.length() <= 0
				|| !ValidationStrComp.checkStringName(unit) || unit.length() <= 0){
			return -111;
		}
		
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		long modifyUserId = (long)clspubcontrollerfunc.intNowUserId(request);
		String modifyUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllBanquetItem.editBanquetItem(hotelId, banquetTypeId, banquetItemId, banquetItemName, unit, sortCode, salePrice, operatingState, modifyUserId, modifyUserName);
		
	}
	
	/**
	 * 餐宴系统 餐宴项目管理 删除餐宴项目
	 * @param banquetItemId 餐宴项目id
	 * @return
	 * 			>0:成功
	 * 			<=0:失败
	 * 			-201：banquetItemId 不是数字
	 */
	@RequestMapping(value = {"/deleteBanquetItem"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int deleteBanquetItem(
			HttpServletRequest request,
			long banquetItemId/*餐宴项目id*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "deleteBanquetItem")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(banquetItemId)){
			return -201;
		}
		
		return this.bllBanquetItem.deleteBanquetItem(banquetItemId);
		
	}
	
	/**
	 * 餐宴系统 餐宴项目管理 获取餐宴项目数量
	 * @param request
	 * @param banquetTypeId 餐宴类别id，提供模糊查询，此处为0则为所有
	 * @param banquetItemName 餐宴项目名称，提供模糊查询，此处为""则为所有
	 * @return
	 * 			-111：banquetItemName 长度超过32<br />
	 * 			-201: banquetTypeId 不是数字
	 */
	@RequestMapping(value = {"/getBanquetItemCount"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public long getBanquetItemCount(
			HttpServletRequest request,
			long banquetTypeId,/*餐宴类别id，提供模糊查询，此处为0则为所有*/
			String banquetItemName/*餐宴项目名称，提供模糊查询，此处为""则为所有*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "getBanquetItemCount")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(banquetTypeId)){
			return -201;
		}
		
		if(!ValidationStrComp.checkStringName(banquetItemName)){
			return -111;
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		return this.bllBanquetItem.getBanquetItemCount(hotelId, banquetTypeId, banquetItemName);
		
	}
	
	/**
	 * 餐宴系统 餐宴项目管理 获取餐宴项目列表
	 * @param request
	 * @param banquetTypeId 餐宴类别id，提供模糊查询，此处为0则为所有
	 * @param banquetItemName 餐宴项目名称，提供模糊查询，此处为""则为所有
	 * @param offset
	 * @param limit
	 * @return
	 * 
	 * 			List<PerBanquetItem>
	 *				PerBanquetItem结构：
	 *				 	Long hotelId;/*酒店id
	 *					Long banquetItemId;/*餐宴项目id
	 *					String banquetItemName;/*餐宴项目名称
	 *					Long banquetTypeId;/*餐宴类别id
	 *					String banquetTypeName;/*餐宴类别名称
	 *					String unit;/*单位
	 *					Long sortCode;/*优先级
	 *					Long salePrice;/*销售单价
	 *					Long operatingState;/*经营状态
	 *			-111：banquetTypeName 长度超过32
	 *			-201：banquetTypeId 或 offset 或 limit 不是数字
	 */
	@RequestMapping(value = {"/listBanquetItem"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String listBanquetItem(
			HttpServletRequest request,
			long banquetTypeId,/*餐宴类别id，提供模糊查询，此处为0则为所有*/
			String banquetItemName,/*餐宴项目名称，提供模糊查询，此处为""则为所有*/
			int offset,
			int limit
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listBanquetItem")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(banquetTypeId) || !ValidationStrComp.checkNumber(offset) 
				|| !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(banquetItemName)){
			return "-111";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerBanquetItem> perBanquetItems = this.bllBanquetItem.listBanquetItem(hotelId, banquetTypeId, banquetItemName, offset, limit);
		return JSON.toJSONString(perBanquetItems);
	}
	
	/**
	 * 餐宴系统 餐宴项目管理 获取餐宴项目列表(不含包价早餐项)
	 * @param request
	 * @param banquetTypeId 餐宴类别id，提供模糊查询，此处为0则为所有
	 * @param banquetItemName 餐宴项目名称，提供模糊查询，此处为""则为所有
	 * @param offset
	 * @param limit
	 * @return
	 * 
	 * 			List<PerBanquetItem>
	 *				PerBanquetItem结构：
	 *				 	Long hotelId;/*酒店id
	 *					Long banquetItemId;/*餐宴项目id
	 *					String banquetItemName;/*餐宴项目名称
	 *					Long banquetTypeId;/*餐宴类别id
	 *					String banquetTypeName;/*餐宴类别名称
	 *					String unit;/*单位
	 *					Long sortCode;/*优先级
	 *					Long salePrice;/*销售单价
	 *					Long operatingState;/*经营状态
	 *			-111：banquetTypeName 长度超过32
	 *			-201：banquetTypeId 或 offset 或 limit 不是数字
	 */
	@RequestMapping(value = {"/listBanquetItemNotHasBreakfast"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String listBanquetItemNotHasBreakfast(
			HttpServletRequest request,
			long banquetTypeId,/*餐宴类别id，提供模糊查询，此处为0则为所有*/
			String banquetItemName,/*餐宴项目名称，提供模糊查询，此处为""则为所有*/
			int offset,
			int limit
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "listBanquetItemNotHasBreakfast")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(banquetTypeId) || !ValidationStrComp.checkNumber(offset) 
				|| !ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		
		if(!ValidationStrComp.checkStringName(banquetItemName)){
			return "-111";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerBanquetItem> perBanquetItems = this.bllBanquetItem.listBanquetItemNotHasBreakfast(hotelId, banquetTypeId, banquetItemName, offset, limit);
		return JSON.toJSONString(perBanquetItems);
	}
	
	/**
	 * 获取餐宴图
	 * @param restaurantName 厅台名称，可为""
	 * @param banquetLocationId 位置id，可为0
	 * @param restaurantState 厅台状态，1净台  2开台  3脏台  4预订  5自用
	 * @param hotelId 酒店id
	 * @return
	 * 			List<PerBanquetChart>结构：
	 * 			/*位置id
	 *			long banquetLocationId;
	 *			/*位置名称
	 *			String banquetLocationName;
	 *			/*该层所包含的会馆信息
	 *			List<PerRestaurantDetail> restaurantDetails;
	 *				
	 *				List<PerRestaurantDetail>结构：
	 *				/*会馆信息
	 *				PerRestaurant restaurantInfo;
	 *				/*已经开台的会馆信息
	 *				List<PerBanquetChartInfo> banquetChartInfos;
	 *
	 *					List<PerBanquetChartInfo>结构：
	 *					/*宾客姓名
	 *					String guestName;
	 *					/*宾客手机
	 *					String guestPhone;
	 *					/*人数
	 *					int peopleNumer;
	 *					/*账单金额
	 *					double billAmount;
	 *					/*账单id
						private long banquetReceptionId;
	 *					/*备注，该备注是开单时的备注
	 *					String remark;
	 * 			
	 */
	@RequestMapping(value = {"/getBanquetChart"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getBanquetChart(
			HttpServletRequest request,
			String restaurantName,/*厅台名称，可为""*/
			long banquetLocationId,/*位置id，可为0*/
			int restaurantState/*厅台状态，1净台  2开台  3脏台  4预订  5自用*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getBanquetChart")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkStringName(restaurantName)){
			return "-111";
		}
		
		if(!ValidationStrComp.checkNumber(banquetLocationId) || !ValidationStrComp.checkNumber(restaurantState)){
			return "-201";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerBanquetChart> perBanquetCharts = this.bllBanquetChart.getBanquetChart(restaurantName, banquetLocationId, restaurantState, hotelId);
		return JSON.toJSONString(perBanquetCharts);
	}
	
	/**
	 * 修改餐宴会馆状态
	 * @param banquetRestaurantId 厅台id
	 * @param updateState 修改后的状态
	 * @return
	 * 			-1：该会馆不存在
	 * 			-2：不符合关系，不允许修改
	 * 
	 * 			修改关系：
	 * 			1净台  ->  3脏台  
	 * 			3脏台  ->  1净台  
	 * 			
	 */
	@RequestMapping(value = {"/updateChartState"}, produces = {"application/json; charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int updateChartState(
			HttpServletRequest request,
			long banquetRestaurantId,/*厅台id*/
			int updateState/*修改后的状态*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "updateChartState")){
			return -3333;
		}
		
		if(!ValidationStrComp.checkNumber(banquetRestaurantId) || !ValidationStrComp.checkNumber(updateState)){
			return -201;
		}
		
		return this.bllBanquetChart.updateChartState(banquetRestaurantId, updateState);
	}
	
	/**
	 * 获取餐宴预订图
	 * @param request
	 * @param date
	 * @param bqRestaurantId
	 * @param bqLocationId
	 * @return
	 */
	@RequestMapping(value = {"/getBqReserveChart"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getBqReserveChart(
			HttpServletRequest request,
			String date,/*日期，不能为空，如传NULL，默认为今天*/
			String bqRestaurantName,/*餐宴会馆名称，模糊搜索，NULL为全部*/
			long bqLocationId/*位置id，0为全部*/
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getBqReserveChart")){
            return "-3333";
		}
		
		long hotelId = clspubcontrollerfunc.intNowHotelId(request);
		List<PerBanquetChart> pbcs = this.bllBanquetChart.getBqReserveChart(CmpLocalDT.DateToLocalDate(SimpleDateHandler.StringToDateByYMDHMS(date)), bqRestaurantName, bqLocationId, hotelId);
		return JSON.toJSONString(pbcs);
	}
	
	/**
	 * 根据房间号获取包价早餐简讯
	 * @param request
	 * @param roomCode
	 * @return
	 */
	@RequestMapping(value = {"/getInfoByRoomCode"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getInfoByRoomCode(
			HttpServletRequest request,
			String roomCode
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getInfoByRoomCode")){
            return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		List<PerBqBreakfastInfo> pbbis = this.bllBqBreakfast.getInfoByRoomCode(roomCode, hotelId);
		return JSON.toJSONString(pbbis);
		
	}
	
	/**
	 * 使用包价早餐
	 * @param request
	 * @param roomId
	 * @param number
	 * @return
	 * 		-1:超过还能使用的最大数量
	 */
	@RequestMapping(value = {"/useBreakfast"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public int useBreakfast(
			HttpServletRequest request,
			long roomId,
			double number
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "useBreakfast")){
			return -3333;
		}
		
		long createUserId = (long)clspubcontrollerfunc.intNowHotelId(request);
		String createUserName = clspubcontrollerfunc.strNowUnm(request);
		return this.bllBqBreakfast.useBreakfast(roomId, number, createUserId, createUserName);
		
	}
	
	/**
	 * 根据会馆id获取会馆信息
	 * @param request
	 * @param bqRestaurantId
	 * @return
	 */
	@RequestMapping(value = {"/getBqRestaurantById"}, produces = {"application/json;charset=utf-8"}, method = {RequestMethod.POST})
	@ResponseBody
	public String getBqRestaurantById(
			HttpServletRequest request,
			long bqRestaurantId
			){
		
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getBqRestaurantById")){
            return "-3333";
		}
		long hotelId = (long)clspubcontrollerfunc.intNowHotelId(request);
		VBqRcpAndRest vBqRcpAndRest = new VBqRcpAndRest();
		
		PerBanquetRestaurant pbrs = this.bllBanquetRestaurant.getRestaurantById(bqRestaurantId);
		vBqRcpAndRest.setPbRestaurant(pbrs);
		PerBanquetReception pbre = this.bllBqReception.getBanquetReceptionByRestaurant(hotelId, bqRestaurantId);
		vBqRcpAndRest.setPbReception(pbre);
		return JSON.toJSONString(vBqRcpAndRest);
	}
	
	
	
	

}
