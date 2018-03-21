<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>加单</title>
</head>
<body>
	<script type="text/javascript" src="../js/client/add_reception.js"></script>
	<div class="easyui-layout" style="width: 100%; height: 695px">
		<div data-options="region:'north'" style="width: 100%;height: 310px;">
			<div class="easyui-layout" style="width: 100%; height: 100%;">
				<div data-options="region:'north',title:''" style="height: 150px;max-height: 150px;width:100%;">
					<div class="easyui-layout" style="width: 100%; height: 100%;">
						<div data-options="region:'north',title:'操作目标定位',height:'auto',collapsible:false" style="padding:8px 0 8px 20px;">
							<input  id="selectWarehouse_addreception" style="width:190px;"
								label="出货库：" labelWidth="60px" labelPosition="before" labelAlign="right"/>
							<a class="easyui-linkbutton" id="getReceptionListByLivingGuestShouldCheckOut_addreception2" style="padding:2px;margin-left:10px;">显示未预离宾客账单</a>
							<a class="easyui-linkbutton" id="getReceptionListByLivingGuestShouldCheckOut_addreception1" style="padding:2px;margin-left:10px;">显示预离宾客账单</a>
							<a class="easyui-linkbutton" id="showReceptionForUnLiving_addreception2" style="padding:2px;margin-left:10px;">显示已退房未结宾客账单</a>
							<a class="easyui-linkbutton" id="showReceptionForUnLiving_addreception1" style="padding:2px;margin-left:10px;">显示非住客未结宾客账单</a>
    	
							<a class="easyui-linkbutton" id="createNewReception" style="padding:2px;margin-left:10px;">新建宾客账单</a>
							<div id="showUnGetBillDialog_addreception" style="display:none;"></div>
							<div id="showSearchVipInfoDialog_addreception" style="display:none;"></div>
							<div id="showLivingGuestShouldCheckOutDiv_addreception" style="display:none;"></div>
						</div>
						<div data-options="region:'center',title:'功能导航'" style="padding:10px 0 10px 20px;">
							<input  id="addReception_PayMethod" style="width:200px;" 
								label="支付方式：" labelWidth="70px" labelPosition="before" labelAlign="right"/>
							<span id="showDiv_pay" style="display:none;">
								<input  id="addReception_PayPhone" style="width:200px;" type="search"
									label="手机号码：" labelWidth="70px" labelPosition="before" labelAlign="right"/>
								<input  id="addReception_PayCode" style="width:200px;" type="search"
									label="匹配码：" labelWidth="70px" labelPosition="before" labelAlign="right"/>
							</span>
							<input  id="addReception_PayMoney" style="width:170px;" type="search"
								label="支付金额：" labelWidth="70px" labelPosition="before" labelAlign="right"/>
							<a class="easyui-linkbutton" id="addReception" 
								style="width:60px;padding:2px;margin-left:10px;" 
								disabled >加单</a>
							<a class="easyui-linkbutton" id="noNameAddReceptionAndGetBill_addReception" 
							style="padding:2px;margin-left:10px;" >匿名加单并快捷结账</a> 
							<input type="hidden" id="addReception_hiddenData" />
							<input  id="addReception_guestDeposit"  type="hidden" />
							<div id="addReception_livingRoomListP" style="display: none"></div>
						</div>
					</div>
				</div>
				<div data-options="region:'center',title:'简讯'" style="width: 100%; min-height: 80px;">
					<table  id="shortInfo_addreception"></table>
				</div> 
				<div data-options="region:'south',title:'汇总',collapsible:false" style="width: 100%; height: 80px;padding:8px 0 8px 25px;">
					<ul>
						<li style="float:left;width:220px;height:30px;line-height:30px;">
							<span style="float:left;display:inline;width:80px;height:30px;font-size:16px;line-height:30px;">商品总计：</span>
								<input readonly id="addReception_goodsTotal" style="width:100px;" value="0"/>
						</li>
						<li style="float:left;width:220px;height:30px;line-height:30px;">
							<span style="float:left;display:inline;width:80px;height:30px;font-size:16px;line-height:30px;">服务总计：</span>
								<input readonly id="addReception_serviceTotal" style="width:100px;" value="0"/>
						</li>
						<li style="float:left;width:220px;height:30px;line-height:30px;">
							<span style="float:left;display:inline;width:80px;height:30px;font-size:16px;line-height:30px;">加单总计：</span>
								<input readonly id="addReception_Total" style="width:100px;" value="0"/>
						</li>
						<li style="float:left;width:220px;height:30px;line-height:30px;">
							<span id="addRecetion_depositTip"></span>
						</li>
					</ul>
				</div> 
			</div>
		</div>
		
		
		<div data-options="region:'center',title:'明细'" style="width:49%;padding-top:8px;">
			<div class="easyui-tabs" data-options="fit:true,plain:true">
				<div title="商品">
					<table id="goodsCar"></table>
					<div id="addGoods" style="display:none;"></div>
				</div>
				<div title="服务">
					<table id="serviceCar"></table>
					<div id="addService" style="display:none;text-align:center">
						<br/><br/>
						<input labelAlign="right" id="addService_serviceType" class="easyui-combobox" style="width:250px;" label="服务类型：" labelPosition="before"><br/><br/>
						<input labelAlign="right" id="addService_serviceName" class="easyui-combobox" style="width:250px;" label="服务名称：" labelPosition="before"><br/><br/>
						<input labelAlign="right" id="addService_servicePrice" data-options="precision:2" class="easyui-numberbox" style="width:250px;" label="服务单价：" labelPosition="before"><br/><br/>
						<input labelAlign="right" id="addService_serviceCount" class="easyui-numberspinner" style="width:250px;" label="服务数量：" labelPosition="before"><br/><br/>
						<input labelAlign="right" id="addService_serviceTotal" data-options="editable:false,precision:2"  class="easyui-numberbox" style="width:250px;" label="服务小计：" labelPosition="before"><br/><br/>
						<input labelAlign="right" id="addService_serviceRemark" class="easyui-textbox" style="width:250px;" label="服务备注：" labelPosition="before" data-options="multiline:true"><br/><br/>
					</div>
				</div>
			</div>
		</div>
		
		<div data-options="region:'east',title:' ',collapsible:false" style="width:50%;padding-top:8px;">
			<div class="easyui-tabs" data-options="fit:true,plain:true">
				<div title="商品">
					<table id="goodsConsume"></table>
					<div id="returnGoods" style="display:none;"></div>
				</div>
				<div title="服务">
					<table id="serviceConsume"></table>
					<div id="returnService" style="display:none;"></div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>