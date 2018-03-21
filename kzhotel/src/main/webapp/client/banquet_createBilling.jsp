<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>餐宴开单</title>
</head>
<body>
	<div style="width:300px;margin:0px auto;padding-top:35px;">
		<div style="margin-bottom:10px;">
			<span id="orderFlag_createBilling"
				style="display:block;width:210px;height:30px;line-height:30px;text-align:center;color:red;
    					font-size: 16px;font-weight: bold;padding-left: 20px;">非预订开单</span>
		</div>
		<div style="margin-bottom:10px;">
			<input id="restaurant_createBilling"   style="width:210px;" 
				label="餐厅：" labelPosition="before" labelAlign="right" labelWidth="70"/>
		</div>
		<div style="margin-bottom:10px;">
			<input id="guestPhone_createBilling" type="search"   style="width:210px;"
				label="宾客手机：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" data-options="iconCls: 'icon-search'"
			id="search_searchVIPInfo" >搜索</a>
		</div>
		<div style="margin-bottom:10px;">
			<input id="guestName_createBilling"  type="search" style="width:210px;" 
				label="宾客姓名：" labelPosition="before" labelAlign="right" labelWidth="70" />
		</div>
		<div style="margin-bottom:10px;">
			<input id="guestNum_createBilling"  type="search"  style="width:210px;" 
				label="人数：" labelPosition="before" labelAlign="right" labelWidth="70"/>
		</div>
		<div style="margin-bottom:10px;">
			<input id="channel_createBilling"  style="width:210px;" 
				label="客源：" labelPosition="before" labelAlign="right" labelWidth="70"/>
		</div>
		<div style="margin-bottom:10px;">
			<input id="remark_createBilling" type="search" style="width:210px;"
				label="备注：" labelPosition="before" labelAlign="right" labelWidth="70"/>
		</div>
		<div style="padding-left: 75px;margin-bottom:10px;">
				<a style="height: 30px; padding: 0px 10px; margin-right: 15px;" 
				class="easyui-linkbutton" id="submit_createBilling" >新建宾客账单</a> 
		</div>
	</div>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/banquet_createBilling.js"></script>
</body>
</html>