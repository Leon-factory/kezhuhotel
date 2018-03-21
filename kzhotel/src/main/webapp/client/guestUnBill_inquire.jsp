<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>新宾客账单</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/guestUnBill_inquire.js"></script>
<div  class="easyui-layout" style="width:100%;height:700px;">   
    <div data-options="region:'north',title:'',height:'auto'" style="width:100%;padding:8px;">
    	<a class="easyui-linkbutton" id="getReceptionListByLivingGuestShouldCheckOut_ungetbill1" style="padding:2px;margin-left:5px;">预离宾客账单</a>
    	<a class="easyui-linkbutton" id="getReceptionListByLivingGuestShouldCheckOut_ungetbill2" style="padding:2px;margin-left:5px;">在住非预离宾客账单</a>
    	<a class="easyui-linkbutton" id="showReceptionForUnGetBill_ungetbill2" style="padding:2px;margin-left:5px;">已退房未结账单</a>
    	<a class="easyui-linkbutton" id="showReceptionForUnGetBill_ungetbill1" style="padding:2px;margin:0 5px 0 5px;">非住客未结账单</a>
    	<span>宾客姓名：</span>
    	<input id="iptGuestName_ungetbill" style="width:130px;"/>
    	<span>宾客手机号：</span>
    	<input  data-options="validType:'mobilephone'" id="iptGuestPhone_ungetbill" style="width:130px;"/>
    	<span>房号：</span>
    	<input  id="iptRoomCode_ungetbill" style="width:130px;"/>
    	<a class="easyui-linkbutton" data-options="iconCls : 'icon-search'" id="searchReceptionBtn_ungetbill">搜索</a>
    	<span>选择账页：</span>
    	<input id="selectReceptionPageNumber_ungetbill" style="width:80px;"/>
    	<div id="showLivingGuestShouldCheckOutDiv_ungetbill"></div>
    </div>   
     
    <div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:80px;padding:3px;">
    	<div>
    		<a id="ungetBill_submit" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">结账</a>
    		<a id="addDetailsForReception_ungetbill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">加单</a>
    		<a id="receiptBtn_ungetbill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">收款</a>
    		<a id="cancelReceiptBtn_ungetbill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">退款</a>
    		<a id="turnout_ungetbill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">转出</a>
    		<a id="signup_ungetbill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">签单</a>
    		<a id="badBillBtn_ungetbill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">坏账</a>
    		<a id="freeConsumeBtn_ungetbill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">免单</a>
    		<a id="cancelBtn_ungetbill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">撤销</a>
    		<a id="editPageNumber_ungetbill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">编辑账页</a>
    		<a id="editShortInfo_ungetBill"  class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">编辑简讯</a>
    		<!-- <a id="" onclick="alert('功能未实现！')" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">撤销结账</a> -->
    		<a id="printBtn_ungetbill" data-options="iconCls:'icon-print'" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;">打印</a>
    	</div>
    	<div id="receiptBtn_receiptDiv_ungetbill"></div><%-- 收款div  --%>
    	<div id="ungetBill_receptionListP"></div><%-- 显示在住客单div  --%>
    	<div id="editPageNumberDiv_ungetBill" style="display:none;"></div><%-- 修改账页/坏账弹出的输入新账页框Div  --%>
    	<div id="searchResultShowInfoDiv_ungetbill"></div><%-- 显示搜索结果的dialogDiv --%>
    	<input id="hidden_balance_inThisJsp_ungetbill" type="hidden"/>
    </div>   
    
    <div data-options="region:'center',title:'',height:'auto'">
    	<div class="easyui-layout" style="width:100%;height:100%;">   
	    	<div data-options="region:'north',title:'简讯',collapsible:false"  style="height:78px;">
	    		<table id="briefInfo_ungetbill"></table> 
	    	</div>   
    		<div data-options="region:'center',title:'汇总'" style="padding-top:8px;">
    			<ul id="ulNewGetBill_ungetbill" style="float:left;width:200px;line-height: 20px;">
    				<li style="margin-bottom:14px;">
    					<div style="border-bottom: 2px solid black;margin-left: 50px;width: 138px;">
    						<lable style="display:inline-block;font-weight: bolder;text-align:right;border-bottom:1px solid #eee;">
    							Balance:
    						</lable>
    						<span style="display:inline-block;width:80px;text-align:center;" id="balance_ungetbill"></span>
    					</div>
    				</li>
    				<li>
    					<lable>房费:</lable>
    					<span id="roomPrice_ungetbill"></span>
    				</li>
    				<li>
    					<lable>其他消费:</lable>
    					<span id="consumeAmount_ungetbill"></span>
    				</li>
    				<li>
    					<lable>收款:</lable>
    					<span id="getAmountFromGuestOrToAmount_ungetbill"></span>
    				</li>
    			</ul>
    			<ul id="ulNewGetBillRight_ungetbill" style="float:left;width:240px; line-height: 20px;">
    				<li>
    					<lable>信用参考:</lable>
    					<span id="credit_unGetBill"></span>
    				</li>
    				<li style="display:none;" id="signup_li_ungetbill">
    					<lable>签单:</lable>
    					<span id="signupAmountResult_ungetbill"></span>
    				</li>
    				<li style="display:none;" id="bad_li_ungetbill">
    					<lable>坏账:</lable>
    					<span id="badAmountResult_ungetbill"></span>
    				</li>
    				<li style="display:none;" id="free_li_ungetbill">
    					<lable>免单:</lable>
    					<span id="freeAmountResult_ungetbill"></span>
    				</li>
    				<li style="display:none;" id="transfer_li_ungetbill">
    					<lable>转出/转入:</lable>
    					<span id="transferAmountResult_ungetbill"></span>
    				</li>
    			</ul>
    		</div>   
	    	<div data-options="region:'south',title:'明细',collapsible:false" style="height:420px;">
	    		<table id="detail_ungetbill"></table>
	    	</div>   
		</div> 
    </div>  
</div>
<style>
    	#ulNewGetBill_ungetbill > li{
    		margin:2px 0 2px 0;
    		height:24px;
    	}
    	#ulNewGetBill_ungetbill > li > lable{
    		display:inline-block;
    		width:100px;
    		font-weight: bolder;
    		text-align:right;
    		border-bottom:1px solid #FAFAFA;
    	}
    	#ulNewGetBill_ungetbill > li > span{
    		display:inline-block;
    		width:80px;
    		text-align:center;
    		border-bottom:1px solid black;
    	}
    	
    	#ulNewGetBillRight_ungetbill > li{
    		margin:2px 0 2px 0;
    	}
    	#ulNewGetBillRight_ungetbill > li > lable{
    		display:inline-block;
    		width:100px;
    		font-weight: bolder;
    		text-align:right;
    		border-bottom:1px solid #FAFAFA;
    	}
    	#ulNewGetBillRight_ungetbill > li > span{
    		display:inline-block;
    		width:120px;
    		text-align:center;
    		border-bottom:1px solid black;
    	}
</style>
</body>
</html>