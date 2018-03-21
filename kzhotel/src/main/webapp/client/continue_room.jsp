<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>前台--续房</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/continue_room.js"></script>
	<div id="div_room_continue" class="easyui-layout" style="width: 100%;">
		<div data-options="region:'north',height:'auto'" style="padding: 10px 0 10px 30px;">
				<a class="easyui-linkbutton" id="north_livingguest_continueroom" style="width:90px;padding:2px;">显示全部在住</a>
				
				<input type="hidden" id="hiddenGetAmount_continueroom"/>
				<input type="hidden" id="hiddenGetrentid_continueroom"/>
				<input type="hidden" id="continurRoom_roomData"/>
				<div id="showalllivingguestsDiv_continueroomP"></div>
		</div>
		<div data-options="region:'center',title:''" style="width: 100%; height: 100%;">
			<div class="panel datagrid propertygrid easyui-fluid"  style="width: 99%;">
			   <div class="datagrid-wrap panel-body panel-body-noheader" title="" style="width: 100%;">
			    <div class="datagrid-view" style="width: 100%;height: 491px;">
			     <div class="datagrid-view1" style="width: 1%;">
			      <div class="datagrid-header" style="width: 16px; height: 0px;">
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
			      <div class="datagrid-body" style="width: 16px; margin-top: 0px; height: 491px;">
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
			         </tbody>
			        </table>
			       </div>
			      </div>
			     </div>
			     <div class="datagrid-view2" style="width: 99%;">
			      <div class="datagrid-header" style="width: 100%;height: 0px;">
			       <div class="datagrid-header-inner" style="display: none;">
			        <table class="datagrid-htable" border="0" cellspacing="0" cellpadding="0" style="height: 0px;">
			         <tbody>
			          <tr class="datagrid-header-row">
			           <td field="name">
			            <div class="datagrid-cell ">
			             <span></span>
			             <span class="datagrid-sort-icon"></span>
			            </div></td>
			           <td field="value">
			            <div class="datagrid-cell datagrid-cell-c2-value">
			             <span></span>
			             <span class="datagrid-sort-icon"></span>
			            </div></td>
			          </tr>
			         </tbody>
			        </table>
			       </div>
			      </div>
			      <div class="datagrid-body" style="width: 100%;margin-top: 0px;overflow-x: hidden;height: 491px;">
			       <div class="datagrid-group" style="padding-left: 0px;" group-index="0">
			        <span class="datagrid-group-title"></span>
			       </div>
			       <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
			        <tbody>
			         <tr  datagrid-row-index="1" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name" style="width:210px;">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            宾客姓名
			           </div></td>
			          <td field="value">
			          	<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			          		<span id="guestName_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			         <tr id="datagrid-row-r2-2-2" datagrid-row-index="2" class="datagrid-row" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			           入住时间
			           </div></td>
			          <td field="value">
				           <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
				           	<span class="span_CR" id="enterTime_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			         <tr id="datagrid-row-r2-2-3" datagrid-row-index="3" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			           原计划居住（天）
			           </div></td>
			          <td field="value">
			           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			           			<span class="span_CR" id="oldStayDays_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			         <tr id="datagrid-row-r2-2-4" datagrid-row-index="4" class="datagrid-row" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            现计划居住（天）
			           </div></td>
			          <td field="value">
			           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			           			<span style="position: relative;">
									<input  id="newStayDays_continueRoom" style="width:150px;" />
									<span class="textbox-addon textbox-addon-right" style="left: 110px; top: -2px;height:22px;border: 1px solid #B1C242;">
										<a href="javascript:void(0)" class="textbox-icon spinner-arrow" icon-index="0" 
												tabindex="-1" style="width:18px;height:22px;">
											<a  class="spinner-arrow-up" id="iop" tabindex="-1" style="height:10px;position:relative;top:-22px;cursor:pointer;"></a>
											<a  class="spinner-arrow-down" id="jkl" tabindex="-1" style="height:10px;position:relative;top:-22px;cursor:pointer;"></a>
										</a>
									</span>
								</span>
								<a id="diyRoomPrice_continueRoom" class="easyui-linkbutton" >手动房价</a>
			           			<div id="showRoomPriceDetails_continueRoom" style="display:none;"></div>
				           </div>
			           </td>
			         </tr>
			         <tr id="datagrid-row-r2-2-5" datagrid-row-index="5" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            预计退房时间
			           </div></td>
			          <td field="value">
			           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			           			<span class="span_CR" id="newExitTime_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			        </tbody>
			       </table>
			       <div class="datagrid-group" style="padding-left: 0px;" group-index="0">
			        <span class="datagrid-group-title"></span>
			       </div>
			       <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
			        <tbody>
			         <tr  datagrid-row-index="1" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name"  style="width:210px;">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            原房费
			           </div></td>
			          <td field="value">
			          	<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			          		<span class="span_CR" id="oldRoomPrice_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			         <tr id="datagrid-row-r2-2-2" datagrid-row-index="2" class="datagrid-row" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            现房费预期
			           </div></td>
			          <td field="value">
				           <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
				           		<span class="span_CR" id="newRoomPrice_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			         <tr id="datagrid-row-r2-2-3" datagrid-row-index="3" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            加单消费
			           </div></td>
			          <td field="value">
			           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			           			<span class="span_CR" id="addBill_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			         <tr id="datagrid-row-r2-2-4" datagrid-row-index="4" class="datagrid-row" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            总额
			           </div></td>
			          <td field="value">
			           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			           			<span class="span_CR" id="allPrice_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			         <tr id="datagrid-row-r2-2-5" datagrid-row-index="5" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			           已付金额
			           </div></td>
			          <td field="value">
			           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			           			<span class="span_CR" id="payedPrice_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			        </tbody>
			       </table>
			       <div class="datagrid-group" style="padding-left: 0px;" group-index="0">
			        <span class="datagrid-group-title"></span>
			       </div>
			       <table class="datagrid-btable" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
			        <tbody>
			         <tr  datagrid-row-index="1" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name"  style="width:210px;">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            需支付金额
			           </div></td>
			          <td field="value">
			          	<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			          		<span class="span_CR" id="needPayPrice_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			         <tr  datagrid-row-index="1" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name"  style="width:210px;">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            支付方式
			           </div></td>
			          <td field="value">
			          	<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			          		<input  id="payMethodPrice_continueRoom" style="width:150px;"/>
				           </div>
			           </td>
			         </tr>
			         
			          <tr  id="showPhone_continueRoom" datagrid-row-index="1" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name"  style="width:210px;">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            手机号码
			           </div></td>
			          <td field="value">
			          	<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			          		<input  id="payPhone_continueRoom" style="width:150px;"/>
				           </div>
			           </td>
			         </tr>
			         
			          <tr  id="showCode_continueRoom"  datagrid-row-index="1" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name"  style="width:210px;">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            匹配码
			           </div></td>
			          <td field="value">
			          	<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			          		<input  id="payCode_continueRoom" style="width:150px;"/>
				           </div>
			           </td>
			         </tr>
			         
			         <tr  datagrid-row-index="1" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name"  style="width:210px;">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            支付金额
			           </div></td>
			          <td field="value">
			          	<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			          		<input class="easyui-numberbox" id="payPrice_continueRoom" style="width:150px;"/>
				           </div>
			           </td>
			         </tr>
			        <!--  <tr id="datagrid-row-r2-2-2" datagrid-row-index="2" class="datagrid-row" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            信用卡担保
			           </div></td>
			          <td field="value">
				           <div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
				           	<span class="span_CR" id="credit_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			         <tr id="datagrid-row-r2-2-3" datagrid-row-index="3" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			           储值金额
			           </div></td>
			          <td field="value">
			           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			           		
				           </div>
			           </td>
			         </tr> -->
			         <tr id="datagrid-row-r2-2-4" datagrid-row-index="4" class="datagrid-row" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            签单挂账
			           </div></td>
			          <td field="value">
			           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			           			<span class="span_CR" id="sign_continueRoom"></span>
				           </div>
			           </td>
			         </tr>
			         <tr id="datagrid-row-r2-2-5" datagrid-row-index="5" class="datagrid-row datagrid-row-alt" style="height: 25px;">
			          <td field="name">
			           <div style="height:auto;text-align:left;" class="datagrid-cell ">
			            信用余额
			           </div></td>
			          <td field="value">
			           		<div style="height:auto;" class="datagrid-cell datagrid-cell-c2-value">
			           			<span class="span_CR" id="creditBalance_continueRoom"></span>
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
					.{width:120px}
					.datagrid-cell-c2-value{width:249px}
				</style>
			    </div>
			   </div>
			  </div>
			<div style="padding:10px 0 0 30px;">
				<a  class="easyui-linkbutton" id="south_continueroom_continueroom" style="width:60px;padding:2px;">续房</a>
				<a  class="easyui-linkbutton" id="south_continueroomcard_continueroom"  style="width:110px;padding:2px;margin-left:15px;" >续房并制房卡</a>
			</div>
		</div>
	</div>
</body>
</html>