<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>创建卡公共页</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/createCard.js"></script>
	<div  class="easyui-layout" style="width:100%;height:600px;">   
	    <div data-options="region:'north',height:'auto'" style="padding:10px 0 10px 20px;">
			<input id="roomCode_createCard"  style="width:200px;"
				label="房号：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="roomType_createCard"  style="width:200px;"
				label="房间类型：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			<input id="floor_createCard"  style="width:200px;"
				label="楼层选择：" labelPosition="before" labelAlign="right" labelWidth="70"/>
	    	<a class="easyui-linkbutton"  id="search_createCard" data-options="iconCls: 'icon-search'" style="padding:3px;" >搜索</a>
	    </div>
	     <div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:140px;padding:3px;">
	    	<a class="easyui-linkbutton"  id="btn_createCard_open" target="_blank" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">制房卡</a>
	    	<a class="easyui-linkbutton"  id="btn_createCard_logout" target="_blank" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">注销门卡</a>
	    	<a class="easyui-linkbutton"  id="btn_createCard_inquiry" target="_blank" style="width:100%;height:38px;border-top:1px solid black;
    		border-left:1px solid black;border-right:1px solid black;">查询门卡信息</a>
	    	<a class="easyui-linkbutton"  id="btn_createCard_forceLogout" target="_blank" style="width:100%;height:38px;border:1px solid black;" >强制注销门卡信息</a>
			<div id="ifdisplay" style="display:none;">
				<iframe  id="ifid1" width="10px" height="10px"></iframe>
				<iframe  id="ifid2" width="10px" height="10px"></iframe>
				<iframe  id="ifid3" width="10px" height="10px"></iframe>
			</div>
	    </div>   
	    <div data-options="region:'center'">
	    	<table id="tab_guestRoom"></table>
	    </div>   
	</div> 
	<div id="parentDialogDiv"></div>
	<div id="inputLeaveTimeDialigDiv"></div>
</body>
</html>