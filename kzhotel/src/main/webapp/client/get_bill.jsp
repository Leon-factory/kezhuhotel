<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>新宾客账单</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/get_bill.js"></script>
<div  class="easyui-layout" style="width:100%;height:700px;">   
    <div data-options="region:'north',title:'',height:'auto'" style="width:100%;padding:8px;">
    	<a class="easyui-linkbutton" id="getReceptionListByLivingGuestShouldCheckOut1" style="padding:2px;margin-left:5px;">预离宾客账单</a>
    	<a class="easyui-linkbutton" id="getReceptionListByLivingGuestShouldCheckOut2" style="padding:2px;margin-left:5px;">在住非预离宾客账单</a>
    	<a class="easyui-linkbutton" id="showReceptionForUnLiving_getBill2" style="padding:2px;margin-left:5px;">已退房未结账单</a>
    	<a class="easyui-linkbutton" id="showReceptionForUnLiving_getBill1" style="padding:2px;margin-left:5px;">非住客未结账单</a>
    	<a class="easyui-linkbutton" id="showReceptionForGetBillList" style="padding:2px;margin-left:5px;">今日已结账单</a>
    	<span>宾客姓名：</span>
    	<input id="iptGuestName_getBill" type="search" style="width:100px;"/>
    	<span>宾客手机号：</span>
    	<input  id="iptGuestPhone_getBill" type="search" style="width:100px;"/>
    	<span>房号：</span>
    	<input  id="iptRoomCode_getBill" type="search" style="width:100px;"/>
    	<a class="easyui-linkbutton" data-options="iconCls : 'icon-search'" id="searchReceptionBtn_getBill">搜索</a>
    	<span>选择账页：</span>
    	<input id="selectReceptionPageNumber" style="width:80px;"/>
    	<div id="showLivingGuestShouldCheckOutDiv"></div>
    </div>   
     
    <div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:80px;padding:3px;">
    	<div>
    		<a id="getBill_submit" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">结账</a>
    		<a id="addDetailsForReception_getBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">加单</a>
    		<a id="receiptBtn_getBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">收款</a>
    		<a id="cancelReceiptBtn_getBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">退款</a>
    		<a id="turnout_getBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">转出</a>
    		<a id="signup_getBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">签单</a>
    		<a id="badBillBtn" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">坏账</a>
    		<a id="freeConsumeBtn" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">免单</a>
    		<a id="cancelBtn" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">撤销</a>
    		<a id="editPageNumber" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">编辑账页</a>
    		<a id="editShortInfo_getBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">编辑简讯</a>
    		<a id="cancelGetBill_getBill"  class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">撤销结账</a>
    		<a id="printBtn_getBill" data-options="iconCls:'icon-print'" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;">打印</a>
    	</div>
    	<div id="receiptBtn_receiptDiv"></div><%-- 收款div  --%>
    	<div id="getBill_receptionListP"></div><%-- 显示在住客单div  --%>
    	<div id="editPageNumberDiv_getBill" style="display:none;">
    		
    	</div><%-- 修改账页弹出的输入新账页框Div  --%>
    	<div id="searchResultShowInfoDiv"></div><%-- 显示搜索结果的dialogDiv --%>
    	<input id="hidden_balance_inThisJsp" type="hidden"/>
    </div>   
    
    <div data-options="region:'center',title:'',height:'auto'">
    	<div class="easyui-layout" style="width:100%;height:100%;">   
	    	<div data-options="region:'north',title:'简讯',collapsible:false"  style="height:78px;">
	    		<table id="briefInfo"></table> 
	    	</div>   
    		<div data-options="region:'center',title:'汇总'" style="padding-top:8px;">
    			<ul id="ulNewGetBill" style="float:left;width:200px;line-height: 20px;">
    				<li style="margin-bottom:14px;">
    					<div style="border-bottom: 2px solid black;margin-left: 50px;width: 138px;">
    						<lable style="display:inline-block;font-weight: bolder;text-align:right;border-bottom:1px solid #eee;">
    							Balance:
    						</lable>
    						<span style="display:inline-block;width:80px;text-align:center;" id="balance_getBill"></span>
    					</div>
    				</li>
    				<li>
    					<lable>房费:</lable>
    					<span id="roomPrice_getBill"></span>
    				</li>
    				<li>
    					<lable>其他消费:</lable>
    					<span id="consumeAmount_getBill"></span>
    				</li>
    				<li>
    					<lable>收款:</lable>
    					<span id="getAmountFromGuestOrToAmount"></span>
    				</li>
    			</ul>
    			<ul id="ulNewGetBillRight" style="float:left;width:240px; line-height: 20px;">
    				<li>
    					<lable>信用参考:</lable>
    					<span id="credit_getBill"></span>
    				</li>
    				<li style="display:none;" id="signup_li">
    					<lable>签单:</lable>
    					<span id="signupAmountResult"></span>
    				</li>
    				<li style="display:none;" id="bad_li">
    					<lable>坏账:</lable>
    					<span id="badAmountResult"></span>
    				</li>
    				<li style="display:none;" id="free_li">
    					<lable>免单:</lable>
    					<span id="freeAmountResult"></span>
    				</li>
    				<li style="display:none;" id="transfer_li">
    					<lable>转出/转入:</lable>
    					<span id="transferAmountResult"></span>
    				</li>
    			</ul>
    		</div>   
	    	<div data-options="region:'south',title:'明细',collapsible:false" style="height:420px;">
	    		<table id="detail_getBill"></table>
	    	</div>   
		</div> 
    </div>  
</div>
<style>
    	#ulNewGetBill > li{
    		margin:2px 0 2px 0;
    		height:24px;
    	}
    	#ulNewGetBill > li > lable{
    		display:inline-block;
    		width:100px;
    		font-weight: bolder;
    		text-align:right;
    		border-bottom:1px solid #FAFAFA;
    	}
    	#ulNewGetBill > li > span{
    		display:inline-block;
    		width:80px;
    		text-align:center;
    		border-bottom:1px solid black;
    	}
    	
    	#ulNewGetBillRight > li{
    		margin:2px 0 2px 0;
    	}
    	#ulNewGetBillRight > li > lable{
    		display:inline-block;
    		width:100px;
    		font-weight: bolder;
    		text-align:right;
    		border-bottom:1px solid #FAFAFA;
    	}
    	#ulNewGetBillRight > li > span{
    		display:inline-block;
    		width:120px;
    		text-align:center;
    		border-bottom:1px solid black;
    	}
</style>
</body>
</html>