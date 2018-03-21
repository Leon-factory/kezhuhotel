<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>加单 显示 的 新建宾客账单 弹出的dialog</title>
</head>
<body>
	<script type="text/javascript"
		src="${pageContext.request.contextPath }/js/client/common_addReceptionDialog.js"></script>
	<div style="padding:20px 0 0 50px;">
		<div style="margin-bottom:20px;">
			<a class="easyui-linkbutton" id="searchVIPInfo_addReception" style="height: 30px; padding: 0px 10px"  data-options="iconCls:'icon-search'"
				 href="javascript:;">会员信息搜索</a>
		</div>
		<div style="margin-bottom:20px;">
			<input class="easyui-textbox" id="searchName_addReception"  style="width:220px;"
				label="姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
		</div>
		<div style="margin-bottom:20px;">
			<input class="easyui-numberbox" id="searchPhone_addReception"  style="width:220px;"
				label="联系手机：" labelPosition="before" labelAlign="right" labelWidth="70"
				data-options="validType:'mobilephone',delay:1000,invalidMessage:'请输入正确的手机格式！',validateOnCreate:false,validateOnBlur:true"/>
		</div>
		<div style="margin-bottom:20px;">
			<input  id="selectChannel_addReception"  style="width:220px;"
				label="客源：" labelPosition="before" labelAlign="right" labelWidth="70"/>
		</div>
		<div style="margin-bottom:20px;">
			<input  id="selectUseChannelCredit_addReception"  style="width:220px;"
				label="是否签单：" labelPosition="before" labelAlign="right" labelWidth="70"/>
		</div>
		<div style="margin-bottom:20px;">
			<input class="easyui-textbox" id="remark_addReception"  style="width:220px;"
				label="备注：" labelPosition="before" labelAlign="right" labelWidth="70"
			data-options="multiline:true,validType:'maxLength[32]',invalidMessage:'最多输入32个字符！',delay:1000,validateOnCreate:false,validateOnBlur:true"/>
		</div>
		<div id="showVIPInfoDialog_common_addReceptionDialog" style="display:none;"></div>
	</div>
</body>
</html>