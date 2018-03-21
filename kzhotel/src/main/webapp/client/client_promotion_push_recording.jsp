<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>客户关系--促销推送记录</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/client_promotion_push_recording.js"></script>
<div>
	<div class="easyui-panel" title="" style="width:100%;height:110px;padding:20px;box-sizing:border-box;">   
		<input id="searchCode_promotionPushRecording" class="easyui-textbox"  type="search" style="width:210px;" 
					label="关键字：" labelPosition="before" labelAlign="right" labelWidth="70"/>
		<a id="searchPromotionPushRecording" class="easyui-linkbutton" data-options="iconCls:'icon-search'" 
			style="padding:2px 5px;margin-left:10px;">搜索</a>
	</div>
	<div>   
		<table id="list_promotionPushRecording"></table>
	</div>
	<div id="page_promotionPushRecording" style="margin-top:10px;"></div>
</div>
</body>
</html>