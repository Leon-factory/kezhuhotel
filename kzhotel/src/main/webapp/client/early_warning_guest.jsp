<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>宾客失约预警</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/early_warning_guest.js"></script>

	<div class="easyui-layout" style="width:100%;height:600px;">
		<div data-options="region:'north',height:'auto'" style="padding:8px 30px;">
			<input id="ipt_guestName_ewg" class="easyui-textbox" style="width:200px;" type="search"
				label="姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="ipt_guestPhone_ewg" class="easyui-textbox" style="width:200px;" type="search"
				label="联系手机：" data-options="validType:'mobilephone',tipPosition:'top',delay:1000" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="search_btn_ewg"
				data-options="iconCls: 'icon-search'">搜索</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="openRoom_btn_ewg" >开房</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="remove_btn_ewg" >解除</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="miss_btn_ewg" >失约</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="edit_btn_ewg">编辑</a>
			<div id="showEditEarlyWarningGuestInfo" style="display: none;"></div>
		</div>
		<div data-options="region:'center'">
			<table id="tab_earlywarningguest"></table>
		</div>
	</div>
</body>
</html>