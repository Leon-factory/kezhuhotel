<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>客户关系---会员充值</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/client_memberRecharge.js"></script>
<div>
	<div>
		<div style="padding:8px 0 ;text-align:center;">
			<input id="iptName_searchVIPInfo" class="easyui-textbox" type="search" style="width:210px;" 
					label="姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="iptPhone_searchVIPInfo" class="easyui-numberbox"  type="search" style="width:210px;" data-options="validType:'mobilephone',tipPosition:'top',delay:1000"
					label="联系手机：" labelPosition="before" labelAlign="right" labelWidth="70"/>
				<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" data-options="iconCls: 'icon-search'"
					id="searchVIPInfo_searchVIPInfo" >搜索</a>
			<div id="showSearchVipInfoDialog" style="display:none;"></div>
		</div>
		
		<div style="width:300px;margin:0px auto;">
			<div style="margin-bottom:10px;">
				<input id="guestName_memberRecharge" class="easyui-textbox"  style="width:260px;" disabled="disabled"
					label="姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="guestPhone_memberRecharge" class="easyui-textbox"   style="width:260px;" disabled="disabled"
					label="联系手机：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="cardNum_memberRecharge"   type="search" style="width:260px;" 
					label="实体卡：" labelPosition="before" labelAlign="right" labelWidth="70" />
			</div>
			<div style="margin-bottom:10px;">
				<input id="phone_memberRecharge" class="easyui-numberbox" type="search"  style="width:260px;" 
				data-options="validType:'mobilephone',delay:1000,required:true,validateOnCreate:false,validateOnBlur:true"
					label="手机号：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="num_memberRecharge" class="easyui-textbox"  type="search" style="width:260px;" 
				data-options="validType:'number',delay:1000,required:true,validateOnCreate:false,validateOnBlur:true"
					label="匹配码：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="getAmount_memberRecharge" class="easyui-numberbox"  type="search" style="width:260px;" 
				data-options="precision:2,required:true,validateOnCreate:false,validateOnBlur:true"
					label="实收金额：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="rechangeAmount_memberRecharge" class="easyui-numberbox"  type="search" style="width:260px;"  
				data-options="precision:2,required:true,validateOnCreate:false,validateOnBlur:true"
					label="充值金额：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="remark_memberRecharge" class="easyui-textbox"   style="width:260px;" 
				data-options="multiline:true,validType:'maxLength[40]',delay:1000"
					label="备注 ：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="padding-left: 75px;margin-bottom:10px;">
					<a style="height: 30px; padding: 0px 10px; margin-right: 15px;" class="easyui-linkbutton" 
					id="submit_memberRecharge" >提交</a> 
					<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" 
					id="reset_memberRecharge" >清空</a>
			</div>
		</div>
	</div>
	<div>
		<table id="list_memberRecharge"></table>
	</div>
</div>
</body>
</html>