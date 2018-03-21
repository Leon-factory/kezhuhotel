<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>新宾客账簿---账务--已结宾客账簿</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/newGetBill_getBill.js"></script>
<div  class="easyui-layout" style="width:100%;height:700px;">   
    <div data-options="region:'north',title:'',height:'auto'" style="width:100%;padding:8px;">
    	<a class="easyui-linkbutton" id="showReceptionForGetBill_GetBill"  style="padding:2px;margin:0 5px 0 5px;">今日已结账单</a>
    	<span>结账时间：</span>
    	<input class="easyui-datebox" id="iptDate_GetBill" data-options="editable:false" style="width:130px;"/>
    	<span>宾客姓名：</span>
    	<input  id="iptGuestName_GetBill" style="width:130px;"/>
    	<span>宾客手机号：</span>
    	<input  id="iptGuestPhone_GetBill"  style="width:130px;"/>
    	<span>房号：</span>
    	<input  id="iptRoomCode_GetBill"  style="width:130px;"/>
    	<a class="easyui-linkbutton"  data-options="iconCls : 'icon-search'" id="searchReceptionBtn_GetBill">搜索</a>
    	<span>选择账页：</span>
    	<input id="selectReceptionPageNumber_GetBill" style="width:80px;"/>
    	<div id="searchResultShowInfoDiv_GetBill"></div><%-- 显示搜索结果的dialogDiv --%>
    </div>   
     
       <div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:80px;padding:3px;">
    	<div>
    		<a id="GetBill_submit" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">结账</a>
    		<a id="addDetailsForReception_GetBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">加单</a>
    		<a id="receiptBtn_GetBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">收款</a>
    		<a id="cancelReceiptBtn_GetBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">退款</a>
    		<a id="turnout_GetBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">转出</a>
    		<a id="signup_GetBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">签单</a>
    		<a id="badBillBtn_GetBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">坏账</a>
    		<a id="freeConsumeBtn_GetBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">免单</a>
    		<a id="cancelBtn_GetBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">撤销</a>
    		<a id="editPageNumber_GetBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">编辑账页</a>
    		<a id="editShortInfo_GetBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">编辑简讯</a>
    		<a id="cancelGetBill_GetBill"  class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">撤销结账</a>
    		<a id="printBtn_GetBill" data-options="iconCls:'icon-print'" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;">打印</a>
    	</div>
    	<div id="receiptBtn_receiptDiv_GetBill" style="display:none;"></div><%-- 收款div --%> 
    	<div id="getBill_receptionListP_GetBill" style="display:none;"></div><%-- 显示在住客单div   --%>
    	<div id="editPageNumberDiv_GetBill" style="display:none;"></div><%-- 修改账页弹出的输入新账页框Div  --%>
    	<div id="searchResultShowInfoDiv_GetBill"></div><%-- 显示搜索结果的dialogDiv --%>
    	<input id="hidden_balance_inThisJsp_GetBill" type="hidden"/>
    </div> 
    	
    	
    
    <div data-options="region:'center',title:'',height:'auto'" style="padding:0px;">
    	<div class="easyui-layout" style="width:100%;height:100%;">   
	    	<div data-options="region:'north',title:'简讯',collapsible:false"  style="height:78px;">
	    		<table id="briefInfo_GetBill"></table> 
	    	</div>   
    		<div data-options="region:'center',title:'汇总'" style="padding-top:8px;">
    			<ul id="ulNewGetBill_GetBill" style="float:left;width:200px;line-height: 20px;">
    				<li style="margin-bottom:14px;">
    					<div style="border-bottom: 2px solid black;margin-left: 50px;width: 138px;">
    						<lable style="display:inline-block;font-weight: bolder;text-align:right;border-bottom:1px solid #eee;">
    							Balance:
    						</lable>
    						<span style="display:inline-block;width:80px;text-align:center;" id="balance_GetBill"></span>
    					</div>
    				</li>
    				<li>
    					<lable>房费:</lable>
    					<span id="roomPrice_GetBill"></span>
    				</li>
    				<li>
    					<lable>其他消费:</lable>
    					<span id="consumeAmount_GetBill"></span>
    				</li>
    				<li>
    					<lable>收款:</lable>
    					<span id="getAmountFromGuestOrToAmount_GetBill"></span>
    				</li>
    			</ul>
    			<ul id="ulNewGetBillRight_GetBill" style="float:left;width:240px; line-height: 20px;">
    				<li>
    					<lable>信用参考:</lable>
    					<span id="credit_GetBill_getBill"></span>
    				</li>
    				<li style="display:none;" id="signup_li_GetBill">
    					<lable>签单:</lable>
    					<span id="signupAmountResult_GetBill"></span>
    				</li>
    				<li style="display:none;" id="bad_li_GetBill">
    					<lable>坏账:</lable>
    					<span id="badAmountResult_GetBill"></span>
    				</li>
    				<li style="display:none;" id="free_li_GetBill">
    					<lable>免单:</lable>
    					<span id="freeAmountResult_GetBill"></span>
    				</li>
    				<li style="display:none;" id="transfer_li_GetBill">
    					<lable>转出/转入:</lable>
    					<span id="transferAmountResult_GetBill"></span>
    				</li>
    			</ul>
    		</div>   
	    	<div data-options="region:'south',title:'明细',collapsible:false" style="height:420px;">
	    		<table id="detail_GetBill"></table>
	    	</div>   
		</div> 
    </div>  
</div>  
<style>
    	#ulNewGetBill_GetBill > li{
    		margin:2px 0 2px 0;
    		height:24px;
    	}
    	#ulNewGetBill_GetBill > li > lable{
    		display:inline-block;
    		width:100px;
    		font-weight: bolder;
    		text-align:right;
    		border-bottom:1px solid #FAFAFA;
    	}
    	#ulNewGetBill_GetBill > li > span{
    		display:inline-block;
    		width:80px;
    		text-align:center;
    		border-bottom:1px solid black;
    	}
    	
    	#ulNewGetBillRight_GetBill > li{
    		margin:2px 0 2px 0;
    	}
    	#ulNewGetBillRight_GetBill > li > lable{
    		display:inline-block;
    		width:100px;
    		font-weight: bolder;
    		text-align:right;
    		border-bottom:1px solid #FAFAFA;
    	}
    	#ulNewGetBillRight_GetBill > li > span{
    		display:inline-block;
    		width:120px;
    		text-align:center;
    		border-bottom:1px solid black;
    	}
</style>
</body>
</html>