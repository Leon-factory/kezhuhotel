<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>前台--开房</title>
</head>
<body>

	<div class="easyui-layout" data-options="fit:true" id="div_room_open" style="width: 100%;">
		<div id="dqsfzdialog" style="padding:50px 0 0 60px"></div> 
		<div data-options="region:'north',height:'auto'" style="padding:8px 20px;" >
			<input type="hidden" id="hidden_searchRoomtypeId"/>
			<input type="hidden" id="hidden_searchRoomprice"/>
			<input type="hidden" id="hidden_rentplanId"/>
			<input type="hidden" id="hidden_isSpecial"/>
			<input type="hidden" id="hidden_reserveDetailId"/><%-- 预订单转入住 开房 保存reserveDetailId 后传入 开房接口 --%>
			
			<input type="hidden" id="roomopen_hidden_livingRoomDataT"/>
			<input type="hidden" id="roomopen_hidden_livingRoomData"/>
			<a class="easyui-linkbutton" id="north_orderform_openroom"  style="width:80px;margin-right:15px;">预订单</a>
			<span>客源：</span>
			<input id="north_guestsource_openroom"   style="width:150px;"  data-options="validType:'calculateMY',required:true"/>
			<span id="noReserveOpenRoom_roomOpen" style="color:red;font-size:18px;margin-left:20px;">非预订单开房</span>
			<span id="reserveOpenRoom_roomOpen" style="color:red;font-size:18px;margin-left:20px;display:none;">预订单开房</span>
			<div id="roomopen_guestListP" style="display:none;"></div>
		</div>
		
		<div id="eastDiv_roomOpen" data-options="region:'east',href:'../client/common-cleanRoomC.jsp'" style="width: 68%;padding-left:8px;" ></div>
		<div  data-options="region:'west',title:''" style="width: 32%;min-width:410px;padding-right:20px;">
		
			<div class="panel datagrid propertygrid easyui-fluid" style="width: 99%;">
		   <div class="datagrid-wrap panel-body panel-body-noheader" title="" style="width:100%;">
		    <div class="datagrid-view" style="width: 100%; height: 645px;">
		     <div class="datagrid-view1" style="width: 2%;min-width:16px;">
		      <div class="datagrid-header" style="width: 2%;min-width:16px; height: 0px;">
		       <div class="datagrid-header-inner" style="display: none;">
		        <table class="datagrid-htable" border="0" cellspacing="0" cellpadding="0" style="height: 0px;">
		         <tbody>
		          <tr class="datagrid-header-row">
		           <td field="f">
		            <div class="datagrid-cell datagrid-cell-c2-f" resizable="false">
		             <span></span>
		             <span class="datagrid-sort-icon"></span>
		            </div></td>
		          </tr>
		         </tbody>
		        </table>
		       </div>
		      </div>
		      <div class="datagrid-body" style="width: 2%;min-width:16px; margin-top: 0px; height: 644px;">
		       <div class="datagrid-body-inner">
		        <div class="datagrid-group" group-index="0">
		         <span class="datagrid-group-expander"><span class="">&nbsp;</span></span>
		        </div>
		        <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">
		         <tbody>
		          <tr id="datagrid-row-r2-1-0" datagrid-row-index="0" class="datagrid-row" style="height: 27px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-1" datagrid-row-index="1" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-2" datagrid-row-index="2" class="datagrid-row" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-3" datagrid-row-index="3" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-4" datagrid-row-index="4" class="datagrid-row" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-5" datagrid-row-index="5" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		         </tbody>
		        </table>
		        <div class="datagrid-group" group-index="1">
		         <span class="datagrid-group-expander"><span class="">&nbsp;</span></span>
		        </div>
		        <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">
		         <tbody>
		          <tr id="datagrid-row-r2-1-6" datagrid-row-index="6" class="datagrid-row  " style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-7" datagrid-row-index="7" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-8" datagrid-row-index="8" class="datagrid-row" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-9" datagrid-row-index="9" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-10" datagrid-row-index="10" class="datagrid-row" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		         </tbody>
		        </table>
		        <div class="datagrid-group" group-index="2">
		         <span class="datagrid-group-expander"><span class="">&nbsp;</span></span>
		        </div>
		        <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">
		         <tbody>
		          <tr id="datagrid-row-r2-1-11" datagrid-row-index="11" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-12" datagrid-row-index="12" class="datagrid-row" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-13" datagrid-row-index="13" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		         </tbody>
		        </table>
		        <div class="datagrid-group" group-index="3">
		         <span class="datagrid-group-expander"><span class="">&nbsp;</span></span>
		        </div>
		        <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">
		         <tbody>
		          <tr id="datagrid-row-r2-1-14" datagrid-row-index="14" class="datagrid-row" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-15" datagrid-row-index="15" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-16" datagrid-row-index="16" class="datagrid-row" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-17" datagrid-row-index="17" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		         </tbody>
		        </table>
		        <div class="datagrid-group" group-index="4">
		         <span class="datagrid-group-expander"><span class="">&nbsp;</span></span>
		        </div>
		        <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">
		         <tbody>
		          <tr id="datagrid-row-r2-1-18" datagrid-row-index="18" class="datagrid-row  " style="height: 27px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		          <tr id="datagrid-row-r2-1-19" datagrid-row-index="19" class="datagrid-row datagrid-row-alt " style="height: 25px;">
		           <td field="f">
		            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-f"></div></td>
		          </tr>
		         </tbody>
		        </table>
		       </div>
		      </div>
		     </div>
		     <div class="datagrid-view2" style="width: 98%;">
		      <div class="datagrid-header" style="width: 100%; height: 0px;">
		       <div class="datagrid-header-inner" style="display: none;">
		        <table class="datagrid-htable" border="0" cellspacing="0" cellpadding="0" style="height: 0px;">
		         <tbody>
		          <tr class="datagrid-header-row">
		           <td field="name">
		            <div class="datagrid-cell datagrid-cell-c2-name">
		             <span></span>
		             <span class="datagrid-sort-icon"></span>
		            </div></td>
		           <td field="value" style="width:100%;">
		            <div class="datagrid-cell datagrid-cell-c2-value">
		             <span></span>
		             <span class="datagrid-sort-icon"></span>
		            </div></td>
		          </tr>
		         </tbody>
		        </table>
		       </div>
		      </div>
		      <div class="datagrid-body" style="width: 100%; margin-top: 0px; overflow-x: hidden; height: 644px;">
		       <div class="datagrid-group pdlf-roomopen"  group-index="0">
		        <span class="datagrid-group-title">宾客身份信息</span>
		       </div>
		       <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">
		        <tbody>
		         <tr id="datagrid-row-r2-2-0" datagrid-row-index="0" class="datagrid-row" style="height: 27px;">
		          <td field="name">
		           <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-name"></div></td>
		          <td field="value" style="width:100%;">
		           <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
		            <button class="l-btn l-btn-small" onmouseover="this.style.cssText='background:#9ba842; text-decoration: none; display: inline-block; overflow: hidden; margin: 0;padding: 0; cursor: pointer; outline: none; text-align: center; vertical-align: middle; line-height: normal;width:170px;height:24px;line-height:24px;vertical-align:middle;'" onmouseout="this.style.cssText='background:#9ba842; text-decoration: none; display: inline-block; overflow: hidden; margin: 0;padding: 0; cursor: pointer; outline: none; text-align: center; vertical-align: middle; line-height: normal;width:170px;height:24px;line-height:24px;vertical-align:middle;'" style="background: rgb(155, 168, 66); text-decoration: none; display: inline-block; overflow: hidden; margin: 0px; padding: 0px; cursor: pointer; outline: none; text-align: center; width: 170px; height: 24px; line-height: 24px; vertical-align: middle;" data-options="iconCls:'icon-search'" id="showReadIdCardJSP">读取身份证信息</button>
		           </div></td>
		         </tr>
		         <tr id="datagrid-row-r2-2-1" datagrid-row-index="1" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            姓名
		            <span style="color:red;">*</span>
		           </div></td>
		          <td field="value" style="width:100%;">
		          	<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input id="guestName_roomopen"  class="input-roomopen" type="search" 
			           		data-options="required:true,missingMessage:'姓名不能为空！',validateOnCreate:false,validateOnBlur:true"/>
			           </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-2" datagrid-row-index="2" class="datagrid-row" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            手机号码
		           </div></td>
		          <td field="value" style="width:100%;">
			           <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input  type="search"  class="input-roomopen" id="guestPhone_roomopen" 
			           		data-options="validType:'mobilephone',invalidMessage:'请输入正确的手机号码！',validateOnCreate:false,validateOnBlur:true"/>
			           		<a id="usePhoneSearchGuestInfo_roomOpen" class="easyui-linkbutton" style="width:55px;">搜索</a>
			           </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-3" datagrid-row-index="3" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            证件类型
		            <span style="color:red;">*</span>
		           </div></td>
		          <td field="value" style="width:100%;">
		           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input id="certificateType_roomopen"  class="input-roomopen"/>
			           </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-4" datagrid-row-index="4" class="datagrid-row" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            证件号码
		            <span style="color:red;">*</span>
		           </div></td>
		          <td field="value" style="width:100%;">
		           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input  type="search"  id="certificateCode_roomopen"   class="input-roomopen"
			           		data-options="required:true,validType:'certificateType',missingMessage:'证件号码不能为空！',invalidMessage:'请输入正确的证件号码！',validateOnCreate:false,validateOnBlur:true"/>
			           </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-5" datagrid-row-index="5" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            性别
		            <span style="color:red;">*</span>
		           </div></td>
		          <td field="value" style="width:100%;">
		           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input id="gender_roomopen"  class="input-roomopen"/>
			           </div>
		           </td>
		         </tr>
		        </tbody>
		       </table>
		       <div class="datagrid-group" style="padding-left: 75px;" group-index="1">
		        <span class="datagrid-group-title">入住信息</span>
		       </div>
		       <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">
		        <tbody>
		         <tr id="datagrid-row-r2-2-6" datagrid-row-index="6" class="datagrid-row  " style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            入住类型
		            <span style="color:red;">*</span>
		           </div></td>
		          <td field="value" style="width:100%;">
		           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input  id="checkInType_roomopen"  class="input-roomopen"/>
			           </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-7" datagrid-row-index="7" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            入住日期时间
		           </div></td>
		          <td field="value" style="width:100%;">
				          <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input  id="checkInTime_roomopen" disabled  class="input-roomopen"/>
			           </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-8" datagrid-row-index="8" class="datagrid-row" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" id="stayNumberName_roomopen" class="datagrid-cell datagrid-cell-c2-name">
		            计划居住（天）<span style="color:red;">*</span>
		           </div></td>
		          <td field="value" style="width:100%;">
		           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input  id="stayNumber_roomopen"  class="input-roomopen"/>
			           </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-9" datagrid-row-index="9" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            计划离店时间
		           </div></td>
		          <td field="value" style="width:100%;">
		           <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
		            <input class="easyui-textbox input-roomopen" id="checkOutTime_roomopen"  disabled/>
		           </div></td>
		         </tr>
		         <tr id="datagrid-row-r2-2-10" datagrid-row-index="10" class="datagrid-row" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            房费
		           </div></td>
		          <td field="value" style="width:100%;">
			           <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           	<input class="easyui-textbox input-roomopen" id="roomAmount_roomopen" disabled/>
			           	<a id="diyRoomPrice_roomOpen" class="easyui-linkbutton" >手动房价</a>
			           	<div id="showRoomPriceDetails_roomOpen" style="display:none;"></div>
			           </div>
		           </td>
		         </tr>
		          <tr id="datagrid-row-r2-2-11" datagrid-row-index="11" class="datagrid-row" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		           包价早餐
		           </div></td>
		          <td field="value" style="width:100%;">
			           <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           	<input class="easyui-numberspinner input-roomopen" id="packageBreakfast_roomopen" value="0" min="0"/>
			           </div>
		           </td>
		         </tr>
		        </tbody>
		       </table>
		       <div class="datagrid-group" style="padding-left: 100px;" group-index="2">
		        <span class="datagrid-group-title">自付</span>
		       </div>
		       <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">
		        <tbody>
		         <tr id="datagrid-row-r2-2-11" datagrid-row-index="11" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            已付总金额
		           </div></td>
		          <td field="value" style="width:100%;">
		            	<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input class="easyui-textbox input-roomopen" id="paidAmount_roomopen" value="0" disabled/>
			             </div>
			       </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-12" datagrid-row-index="12" class="datagrid-row" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            支付方式
		           </div></td>
		          <td field="value" style="width:100%;">
		           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input  id="payType_roomopen"    class="input-roomopen"/>
			            </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-13" datagrid-row-index="13" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            押金金额
		           </div></td>
		          <td field="value" style="width:100%;">
		           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input class="easyui-textbox input-roomopen" type="search" id="payAmount_roomopen"/>
			            </div>
		          </td>
		         </tr>
		        </tbody>
		       </table>
		       <div class="datagrid-group" style="padding-left: 100px;"  group-index="3">
		        <span class="datagrid-group-title">挂账</span>
		       </div>
		       <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">
		        <tbody>
		         <tr id="datagrid-row-r2-2-14" datagrid-row-index="14" class="datagrid-row" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            是否挂账
		           </div></td>
		          <td field="value" style="width:100%;">
			            <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input id="isSign_roomopen"   class="input-roomopen"/>
		           </div></td>
		         </tr>
		         <tr id="datagrid-row-r2-2-15" datagrid-row-index="15" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            信用余额
		           </div></td>
		          <td field="value" style="width:100%;">
		           	<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           	<input class="easyui-textbox input-roomopen" id="creditBalance_roomopen"/>
			           </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-16" datagrid-row-index="16" class="datagrid-row" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            储值金额
		           </div></td>
		          <td field="value" style="width:100%;">
		               <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           	<input  class="easyui-textbox input-roomopen" id="storedAmount_roomopen" value="--" disabled/>
			           </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-17" datagrid-row-index="17" class="datagrid-row datagrid-row-alt" style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            预授权金额
		           </div></td>
		          <td field="value" style="width:100%;">
		           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input class="easyui-textbox input-roomopen"  type="search"  id="creditCardAmount_roomopen"/>
			            </div>
		           </td>
		         </tr>
		        </tbody>
		       </table>
		       <div class="datagrid-group" style="padding-left: 100px;" group-index="4">
		        <span class="datagrid-group-title">联房</span>
		       </div>
		       <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0">
		        <tbody>
		         <tr id="datagrid-row-r2-2-18" datagrid-row-index="18" class="datagrid-row  " style="height: 27px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            是否联房
		           </div></td>
		          <td field="value" style="width:100%;">
		           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           	<input class="easyui-combobox input-roomopen" id="isJointRoom_roomopen"  />
			           </div>
		           </td>
		         </tr>
		         <tr id="datagrid-row-r2-2-19" datagrid-row-index="19" class="datagrid-row datagrid-row-alt " style="height: 25px;">
		          <td field="name">
		           <div style="height:auto;text-align:right;" class="datagrid-cell datagrid-cell-c2-name">
		            <a class="l-btn l-btn-small" onmouseover="this.style.cssText='background:#9ba842; text-decoration: none; display: inline-block; overflow: hidden; margin: 0;padding: 0; cursor: pointer; outline: none; text-align: center; vertical-align: middle; line-height: normal;width:100%;height:22px;line-height:22px;vertical-align:middle;'" onmouseout="this.style.cssText='background:#9ba842; text-decoration: none; display: inline-block; overflow: hidden; margin: 0;padding: 0; cursor: pointer; outline: none; text-align: center; vertical-align: middle; line-height: normal;width:100%;height:22px;line-height:22px;vertical-align:middle;'" style="width:100%;height:22px;line-height:22px;vertical-align:middle;" data-options="iconCls:'icon-search'" id="roomopen_showLivingRoomListBtn">选择联入的房间</a>
		           </div>
		          </td>
		          <td field="value" style="width:100%;">
		           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value pdlf-roomopen">
			           		<input  id="JointRoomNumber_roomopen"   class="easyui-textbox input-roomopen" disabled/>
			            </div>
		           </td>
		         </tr>
		        </tbody>
		       </table>
		      </div>
		     </div>
		     <style type="text/css" easyui="true">
				.datagrid-header-rownumber{width:29px}
				.datagrid-cell-rownumber{width:29px}
				.datagrid-cell-c2-f{width:7px}
				.datagrid-cell-c2-name{width:120px}
				.datagrid-cell-c2-value{width:249px}
			</style>
		    </div>
		   </div>
		  </div>
  
	  	    <div style="margin-top:15px;margin-left:50px;">
		        <a tabindex="13" class="easyui-linkbutton" id="south_addguest_openroom"  style="width:100px;margin-right:10px;">添加随住客人</a>
			    <a tabindex="14" class="easyui-linkbutton" id="south_openroomcard_openroom"  style="width:80px;margin-right:10px;">制房卡</a>
			    <a tabindex="15" class="easyui-linkbutton" id="south_openroom_openroom" style="width:80px;margin-right:10px;">开房</a>
	  	    </div>
	    </div>
		
		
		<div id="roomopen_showLivingRoomListP"></div>
		
		<div data-options="region:'center',title:''"></div>
	</div>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/room_open.js"></script>
</body>
</html>