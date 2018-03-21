<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>预抵宾客</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/arrival_guest.js"></script>

	<div class="easyui-layout" style="width:100%;height:600px;">
		<div data-options="region:'north'" style="height:40px;border:0;margin:5px 0px 0px 0px;padding-left:50px;">
			<span>姓名:</span>
			<span>
				<input class="easyui-textbox" id="ipt_name_arrival_guest" type="search" style="width:130px;" />
			</span>
			<span>联系手机:</span>
			<span>
				<input class="easyui-numberbox" id="ipt_phone_arrival_guest" type="search" style="width:130px;"  data-options="validType:'mobilephone',tipPosition:'top',delay:1000"/>
			</span>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton" id="searchBtn_arrival_guest"
				data-options="iconCls: 'icon-search'" >搜索</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton"  id="openRoomBtn_arrival_guest">开房</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton"  id="removeBtn_arrival_guest">解除</a>
			<a style="height:30px;padding:0px 10px" class="easyui-linkbutton"  id="missBtn_arrival_guest">失约</a>
		</div>
		
		<div data-options="region:'center'">
			<table id="tab_arrivalguest"></table>
		</div>
	</div>
</body>
</html>