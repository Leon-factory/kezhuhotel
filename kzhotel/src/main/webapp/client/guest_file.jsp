<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>宾客档案</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/guest_file.js"></script>
<style type="text/css">
.opendiv{z-index:100;overflow:auto;position:absolute;padding:1px;border:1px solid #888;background:#fff;border-radius:5px;visibility:hidden;}
#bgdiv{z-index:99;width:100%;height:100%;position:absolute;top:0;left:0;filter:alpha(opacity=30);-moz-opacity:0.3;opacity:0.3;;visibility:hidden;background:#000;}
</style>
<div  class="easyui-layout" id="layout_guestFile" style="width:100%;height:610px;padding-right:2px;">   
    <div data-options="region:'north',height:'auto'" style="width:100%;padding:8px;">
    	<input id="guestName_guestFile" class="easyui-textbox" type="search" style="width:200px;"
			label="宾客姓名：" labelPosition="before" labelAlign="right" labelWidth="70"/>
    	<input id="phone_guestFile" class="easyui-numberbox" type="search" data-options="validType:'mobilephone',tipPosition:'top',delay:1000" style="width:200px;"
			label="手机号码：" labelPosition="before" labelAlign="right" labelWidth="70"/>
    	<input id="idCard_guestFile" class="easyui-textbox" type="search" style="width:250px;" data-options="validType:'certificateType',invalidMessage:'身份证格式不正确！',tipPosition:'top',delay:1000"
			label="身份证号码：" labelPosition="before" labelAlign="right" labelWidth="90"/>
    	<input id="passport_guestFile" class="easyui-textbox" type="search" style="width:220px;"
			label="护照号码：" labelPosition="before" labelAlign="right" labelWidth="90"/>
    	<input id="officerCertificate_guestFile" class="easyui-textbox" type="search" style="width:220px;"
			label="军官证号码：" labelPosition="before" labelAlign="right" labelWidth="90"/>
    	<a class="easyui-linkbutton" id="search_guestFile" data-options="iconCls : 'icon-search'" >搜索</a>
    </div>   
     
    <div data-options="region:'west',title:'功能导航',split:true,height:'auto'" style="width:90px;padding:3px;">
    	<div>
    		<a id="show_guestFile" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">显示</a>
    		<a id="merge_guestFile" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">合并</a>
    		<a id="create_guestFile" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">新建</a>
    		<a id="edit_guestFile" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">编辑</a>
    		<a id="empty_guestFile" class="easyui-linkbutton" style="width:100%;height:38px;border-top:1px solid black;
    			border-left:1px solid black;border-right:1px solid black;">清空</a>
    		<a id="bind_guestFile" class="easyui-linkbutton" style="width:100%;height:70px;border:1px solid black;">绑定/解绑会员手机注册</a>
    	</div>
    </div>   
    
    <div data-options="region:'center',title:'',height:'auto'">
    	<div class="easyui-layout" id="cc" style="width:100%;height:100%;padding-top:1px;">   
	    	<div id="centerDiv" data-options="region:'center',title:'简讯',collapsible:false"">
	    		<table id="briefInfo_guestFile"></table> 
	    	</div>   
    		<div data-options="region:'south',title:'明细',collapsible:false" style="height:410px;min-height:400px;width:100%;">
	    		<div id="tabs_guestFile" class="easyui-tabs" style="width:100%;height:98%;">   
				    <div title="个人信息" data-options="iconCls:'icon-user',closable:false" style="padding-top:10px;display:none;">   
				        <table id="personalInfo_guestFile"></table>
				        <div id="appendDiv_guestFile" style="display:none;"></div>
				    </div>   
				    <div title="会员和消费" data-options="iconCls:'icon-large-clipart',closable:false" style="overflow:auto;padding-top:10px;display:none;">   
				        <table id="VIPAndConsumeInfo_guestFile"></table>
				    </div>   
				    <div title="备注和照片" data-options="iconCls:'icon-large-picture',closable:false" style="padding-top:10px;display:none;">   
				       <table id="remarkAndPictureInfo_guestFile"></table>
				    </div>   
				    <div title="驾车信息" data-options="iconCls:'icon-large-shapes',closable:false" style="padding-top:10px;display:none;">   
				       <table id="driveInfo_guestFile"></table>
				    </div>   
				    <div title="发票信息" data-options="iconCls:'icon-large-smartart',closable:false" style="padding-top:10px;display:none;">   
				       <table id="invoiceInfo_guestFile"></table>  
				    </div>   
				</div> 
    		</div>   
		</div> 
    </div>  
</div>
</body>
</html>