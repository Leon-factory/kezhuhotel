<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>餐宴账单</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/banquet_bill.js"></script>
<div  class="easyui-layout" style="width:100%;height:700px;">   
    <div data-options="region:'north',title:'',height:'auto'" style="width:100%;padding:8px;">
		<label style="cursor: pointer;">
    		<input type="radio" name="selectedBill_banquet" value="1" checked>
    		未结餐宴账单
    	</label>
    	<label  style="cursor: pointer;">
    		<input type="radio" name="selectedBill_banquet" value="2">
    		当日已结餐宴账单
    	</label>
    	<input id="restaurant_banquentBill"   style="width:200px;" 
				label="餐宴会馆：" labelPosition="before" labelAlign="right" labelWidth="70" />
    	<input id="guestPhone_banquentBill"  type="search" style="width:200px;" 
				label="宾客手机号：" labelPosition="before" labelAlign="right" labelWidth="80" />
    	<input id="guestName_banquentBill"  type="search" style="width:200px;" 
				label="宾客姓名：" labelPosition="before" labelAlign="right" labelWidth="70" />
		<input id="remark_banquentBill"  type="search" style="width:190px;" 
				label="备注：" labelPosition="before" labelAlign="right" labelWidth="50" />
    	<a class="easyui-linkbutton" data-options="iconCls : 'icon-search'" id="search_banquentBill">搜索</a>
    	<input id="selectReceptionPageNumber_banquetBill" style="width:180px;" 
				label="选择账页：" labelPosition="before" labelAlign="right" labelWidth="70" />
    	<div id="showSearchResultDialog" style="diaplay:none;"></div>
    	<div id="showReceiptDialog" style="diaplay:none;"></div>
    	<div id="showAddDialog" style="diaplay:none;"></div><%-- 餐宴加单dialog --%>
    	<div id="showTransferDialog" style="diaplay:none;"></div><%-- 转出选择对方dialog --%>
    </div>   
     
    <div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:80px;padding:3px;">
    	<div>
    		<a id="getBill_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">结账</a>
    		
    		<a id="addDetailsForReception_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">加单</a>
    		
    		<a id="cancelDetailsForReception_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">退单</a>
    			
    		<a id="receiptBtn_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">收款</a>
    		
    		<a id="cancelReceiptBtn_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">退款</a>
    		
    		<a id="turnout_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">转出</a>
    		
    		<a id="signup_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">签单</a>
    		
    		<a id="badBillBtn_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">坏账</a>
    		
    		<a id="freeConsumeBtn_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">免单</a>
    		
    		<a id="cancelBtn_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">撤销</a>
    		
    		<a id="editPageNumber_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">编辑账页</a>
    		
    		<a id="editShortInfo_banquentBill" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">编辑简讯</a>
    		
    		<a id="cancelGetBill_banquentBill"  class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">撤销结账</a>
    		
    		<a id="printBtn_banquentBill" data-options="iconCls:'icon-print'" class="easyui-linkbutton" style="width:100%;height:38px;border:1px solid black;">打印</a>
    	</div>
    </div>   
    
    <div data-options="region:'center',title:'',height:'auto'">
    	<div class="easyui-layout" style="width:100%;height:100%;">   
	    	<div data-options="region:'north',title:'简讯',collapsible:false"  style="height:78px;">
	    		<table id="briefInfo_banquentBill"></table> 
	    	</div>   
    		<div data-options="region:'center',title:'汇总'" style="padding-top:8px;">
    			<ul id="ulNewGetBill_banquentBill" style="float:left;width:200px;line-height: 20px;">
    				<li style="margin-bottom:14px;">
    					<div style="border-bottom: 2px solid black;margin-left: 50px;width: 138px;">
    						<lable style="display:inline-block;font-weight: bolder;text-align:right;border-bottom:1px solid #eee;">
    							Balance:
    						</lable>
    						<span style="display:inline-block;width:80px;text-align:center;" id="balance_banquentBill"></span>
    					</div>
    				</li>
    				<li>
    					<lable>餐费:</lable>
    					<span id="banquentPrice_banquentBill"></span>
    				</li>
    				<li>
    					<lable>其他消费:</lable>
    					<span id="consumeAmount_banquentBill"></span>
    				</li>
    				<li>
    					<lable>收款:</lable>
    					<span id="getAmountFromGuestOrToAmount_banquentBill"></span>
    				</li>
    			</ul>
    			<ul id="ulNewGetBillRight_banquentBill" style="float:left;width:240px; line-height: 20px;">
    				<li>
    					<lable>信用参考:</lable>
    					<span id="credit_banquentBill"></span>
    				</li>
    				<li style="display:none;" id="signup_li_banquentBill">
    					<lable>签单:</lable>
    					<span id="signupAmountResult_banquentBill"></span>
    				</li>
    				<li style="display:none;" id="bad_li_banquentBill">
    					<lable>坏账:</lable>
    					<span id="badAmountResult_banquentBill"></span>
    				</li>
    				<li style="display:none;" id="free_li_banquentBill">
    					<lable>免单:</lable>
    					<span id="freeAmountResult_banquentBill"></span>
    				</li>
    				<li style="display:none;" id="transfer_li_banquentBill">
    					<lable>转出/转入:</lable>
    					<span id="transferAmountResult_banquentBill"></span>
    				</li>
    			</ul>
    		</div>   
	    	<div data-options="region:'south',title:'明细',collapsible:false" style="height:420px;">
	    		<table id="detail_banquentBill"></table>
	    	</div>   
		</div> 
    </div>  
</div>

<style>
    	#ulNewGetBill_banquentBill > li{
    		margin:2px 0 2px 0;
    		height:24px;
    	}
    	#ulNewGetBill_banquentBill > li > lable{
    		display:inline-block;
    		width:100px;
    		font-weight: bolder;
    		text-align:right;
    		border-bottom:1px solid #FAFAFA;
    	}
    	#ulNewGetBill_banquentBill > li > span{
    		display:inline-block;
    		width:80px;
    		text-align:center;
    		border-bottom:1px solid black;
    	}
    	
    	#ulNewGetBillRight_banquentBill > li{
    		margin:2px 0 2px 0;
    	}
    	#ulNewGetBillRight_banquentBill > li > lable{
    		display:inline-block;
    		width:100px;
    		font-weight: bolder;
    		text-align:right;
    		border-bottom:1px solid #FAFAFA;
    	}
    	#ulNewGetBillRight_banquentBill > li > span{
    		display:inline-block;
    		width:120px;
    		text-align:center;
    		border-bottom:1px solid black;
    	}
</style>

	<%--打印容器开始--%>
	<div id="banquetBillPrint" style="display: none;width: 960px;">
        <h1 style="width: 100%;font-size: 20px;color: #000;text-align: center;float: left;line-height: 45px;">餐宴账单</h1>
        <div id="banquetBillDivHead" style="width:100%">
			<ul  style="width:100%;font-size:12px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
				<li style="width: 43%;float: left;">酒店名称：<span id="hotelName_printBanquetBill"></span></li>
				<li style="width: 57%;float: left;">打印日期：<span id="printTime_printBanquetBill"></span></li>
			</ul>
			<ul style="width:100%;font-size:12px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
				<li style="width: 43%;float: left;">宾客姓名：<span id="guestName_printBanquetBill"></span></li>
				<li style="width: 57%;float: left;">开单时间：<span id="enterTime_printBanquetBill"></span></li>
			</ul>
			<ul style="width:100%;font-size:12px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
				<li style="width: 43%;float: left;">手机号码：<span id="phone_printBanquetBill"></span></li>
				<li style="width: 57%;float: left;">结账时间：<span id="leaveTime_printBanquetBill"></span></li>
			</ul>       	
			<ul style="width:100%;font-size:12px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
				<li style="width: 43%;float: left;">客&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;源：<span id="channelName_printBanquetBill"></span></li>
				<li style="width: 57%;float: left;">餐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;厅：<span id="restaurantName_printBanquetBill"></span></li>
			</ul>       	
			<ul style="width:100%;font-size:12px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
				<li style="width: 43%;float: left;">餐宴账单：<span id="receptionCode_printBanquetBill"></span></li>
				<li style="width: 57%;float: left;">用餐人数：<span id="peopleNumber_printBanquetBill"></span></li>
			</ul>       	
        </div>
        <div style="width:100%">
            <ul  style="width:100%;font-size:14px;list-style: none;float: left;margin-bottom:6px;margin-top:0px;">
                <li style="width: 27%;float: left;border-bottom:2px solid #000;">日期/时间</li>
                <li style="width: 5%;text-align:center;float: left;border-bottom:2px solid #000;">页</li>
                <li style="width: 42%;text-align:center;float: left;border-bottom:2px solid #000;">内容</li>
                <li style="width: 14%;text-align:center;float: left;border-bottom:2px solid #000;">数量*单价</li>
                <li style="width: 10%;text-align:center;float: left;border-bottom:2px solid #000;">小计</li>
            </ul>
               <ul id="details_printBanquetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
               <!-- <ul id="consumeDetails_printBanquetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
               <ul id="billDetails_printBanquetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
               <ul id="debtDetails_printBanquetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
               <ul id="freeDetails_printBanquetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul>
               <ul id="tranferDetails_printBanquetBill" style="display:none;width:100%;font-size:6px;list-style: none;float: left;margin-top:0px;margin-bottom:6px;"></ul> -->
        </div>
        <div>
        	<ul style="width:100%;list-style: none;font-size:12px;float: left;margin-bottom:3px;margin-top:0px;">
        		<li style="width: 25%;float: left;"><label>支付合计：</label><span id="pay_printBanquetBill"></span></li>
        		<li style="width: 25%;float: left;"><label>消费合计：</label><span id="consume_printBanquetBill"></span></li>
        		<li style="width: 25%;float: left;"><label>签单合计：</label><span id="bill_printBanquetBill"></span></li>
        		<li style="width: 15%;float: left;"><label>余额：</label><span id="printBalance_printBanquetBill"></span></li>
        	</ul>
        	<ul style="width:100%;list-style: none;font-size:12px;float: left;margin-bottom:3px;margin-top:20px;">
        		<li style="width:50%;float: left;"><label>接待员：</label><span id="handler_printBanquetBill"></span></li>
        		<li  style="width:49%;float: left;"><label>客户签字：</label><span style="display:inline-block;width:130px;border-bottom:1px solid #000;"></span></li>
        	</ul>
        </div>
    </div>
    <%--打印容器结束--%>
    
      <%--打印容器开始--%>
			<div id="banquetBillPrintSmall" style="display: none;">
				<style>
					body,html,ul,h1,h2,h3,h4,h5,h6{
						margin:0;
						padding:0;
					}
					.title-printSmall{
						width: 100%;
						font-size: 16px;
						color: #000;
						text-align: center;
						display: block;
					}
					.ul-printSmall{
						width: 100%;
						text-decoration-style: none;
						font-size: 12px;
						line-height: 1.5;
						margin-top: 10px;
					}
					.printSmall li{
						list-style:none;
					}
					.printSmall li ~ span{
						font-size: 12px;
					}
				</style>
				<span class="title-printSmall" id="hotelName_printBanquetBillSmall"></span>
				<span class="title-printSmall">餐宴账单</span>
				<ul class="ul-printSmall">
					<li>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打印日期:</span>
						<span id="printTime_printBanquetBillSmall"></span>
					</li>
					<li>
						<span id="receptionCodeTitle_printBanquetBillSmall">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;账单号码:</span>
						<br>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="receptionCode_printBanquetBillSmall"></span>
					</li>
					<li>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;宾客姓名:</span>
						<span id="guestName_printBanquetBillSmall"></span>
					</li>
					<li>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;源:</span>
						<span id="channelName_printBanquetBillSmall"></span>
					</li>
					<li>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;餐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;厅:</span>
						<span id="restaurantName_printBanquetBillSmall"></span>
					</li>
					<li>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用餐人数:</span>
						<span id="peopleNumber_printBanquetBillSmall"></span>
					</li>
					<li>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机号码:</span>
						<span id="phone_printBanquetBillSmall"></span>
					</li>
					<li>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开单时间:</span>
						<span id="enterTime_printBanquetBillSmall"></span>
					</li>
					<li>
						<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结账时间:</span>
						<span id="leaveTime_printBanquetBillSmall"></span>
					</li>
				</ul>	
				<hr>
				<div id="content_printBanquetBillSmall">
						<ul class="ul-printSmall" style="display:none;display:block;font-size:12px;">
							<li style="list-style:none;display:inline-block;width:50%;text-align:center;border-bottom:1px solid #000;">内容</li><li style="list-style:none;display:inline-block;width:30%;text-align:center;border-bottom:1px solid #000;">数量*单价</li><li style="list-style:none;display:inline-block;width:20%;text-align:left;border-bottom:1px solid #000;">金额</li>
						</ul>
						<ul id="details_printBanquetBillSmall" class="ul-printSmall" style="display:none;display:block;font-size:12px;"></ul>
				</div>
				<div style="clear:both;"></div>
				<div>
					<ul class="ul-printSmall">
						<li>
							<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支付合计:</span>
							<span id="pay_printBanquetBillSmall"></span>
						</li>
						<li>
							<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消费合计:</span>
							<span id="consume_printBanquetBillSmall"></span>
						</li>
						<li>
							<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签单合计:</span>
							<span id="bill_printBanquetBillSmall"></span>
						</li>
						<li>
							<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;余额:</span>
							<span id="printBalance_printBanquetBillSmall"></span>
						</li>
					</ul>
					<hr>
					<ul class="ul-printSmall">
						<li>
							<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接待员:</span>
							<span id="handler_printBanquetBillSmall"></span>
						</li>
						<li style="height:10px;">

						</li>
						<li>
							<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客户签字:</span>
							<span style="display:inline-block;width:130px;border-bottom:1px solid #000;"></span>
						</li>
					</ul>
				</div>
			</div>
		    <%--打印容器结束--%>
</body>
</html>