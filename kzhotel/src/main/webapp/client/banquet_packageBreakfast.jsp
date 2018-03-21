<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>包价早餐</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/banquet_packageBreakfast.js"></script>
	<div  class="easyui-layout" style="width:100%;height:600px;">   
	    <div data-options="region:'north',height:'auto'" style="padding:10px 0 10px 20px;">
			<a class="easyui-linkbutton"  id="readRoomCard_packageBreakfast"  target="_blank" style="padding:3px;" >读房卡 </a>
			<input id="roomCode_packageBreakfast"  style="width:200px;" type="search"
				label="房号：" labelPosition="before" labelAlign="right" labelWidth="50"/>
	    	<a class="easyui-linkbutton"  id="search_packageBreakfast" data-options="iconCls: 'icon-search'" 
	    		style="padding:3px;" >搜索</a>
    		<div style="display:none;">
	    		<iframe  id="ifid4" width="10px" height="10px"></iframe>
    		</div>
	    	<div id="dialogParent_packageBreakfas" style="display:none;"></div>
	    </div>
	     <div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:100px;padding:3px;">
	    	<a class="easyui-linkbutton"  id="use_packageBreakfast" 
	    		style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">使用</a>
	    	<a class="easyui-linkbutton"  id="cancel_packageBreakfast" 
	    		style="width:100%;height:38px;border:1px solid black;" >撤销</a>
	    </div>   
	    <div data-options="region:'center',title:'简讯'">
	    	<table id="tab_packageBreakfast"></table>
	    </div>   
	</div> 
</body>
</html>