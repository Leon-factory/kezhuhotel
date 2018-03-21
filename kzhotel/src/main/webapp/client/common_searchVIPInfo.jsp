<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>客户关系---查找会员 引入的公共JSP页面</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/common_searchVIPInfo.js"></script>
	<div style="padding:8px 0 8px 30px;">
		<span>姓名： </span>
			<input class="easyui-textbox" id="iptName_searchVIPInfo" style="width:130px;"/>
			<span> 联系手机： </span>
			<input class="easyui-numberbox" id="iptPhone_searchVIPInfo" style="width:130px;"/> 
			<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" data-options="iconCls: 'icon-search'"
				id="searchVIPInfo_searchVIPInfo" href="javascript:void(0)">搜索</a>
	</div>
		
	<table id="tab_common_searchVIPInfo"></table>
</body>
</html>