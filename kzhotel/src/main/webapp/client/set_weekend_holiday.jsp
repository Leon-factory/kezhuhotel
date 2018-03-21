<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>周末节假日设置</title>

</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/setholiday.js"></script>
<div>
	<div style="padding:10px;">
		<input id="setWH_holidayName" class="easyui-textbox" type="search" label="节假日名称：" 
		labelWidth="80px;"  labelAlign="right" labelPosition="before" style="width:200px;height:25px;">
		<a id="setWH_search" class="easyui-linkbutton" data-options="iconCls:'icon-search'">搜索</a>
	</div>
	
	<div class="easyui-panel" title="周末设定" style="padding:8px 0;">
		<link rel="stylesheet" href="${pageContext.request.contextPath }/css/set_weekend.css">
		<div>
			<div class="sw_check">
				<div class="sw_mon float-left">
					<div class="sw_mon_tit text_align_center">一</div>
					<div class="text_align_center" style="width:80px;">
						<input class="easyui-switchbutton" data-options="onText:'√',offText:'×',handleWidth:1,value:'0'" id="sbtn0"/>
					</div>
				</div>
				<div class="sw_tue float-left">
					<div class="sw_tue_tit text_align_center">二</div>
					<div class="text_align_center" style="width:80px;">
						<input class="easyui-switchbutton" data-options="onText:'√',offText:'×',handleWidth:1,value:'1'" id="sbtn1"/>
					</div>
				</div>
				<div class="sw_wed float-left">
					<div class="sw_wed_tit text_align_center">三</div>
					<div class="text_align_center" style="width:80px;">
						<input class="easyui-switchbutton" data-options="onText:'√',offText:'×',handleWidth:1,value:'2'" id="sbtn2"/>
					</div>
				</div>
				<div class="sw_thu float-left">
					<div class="sw_thu_tit text_align_center">四</div>
					<div class="text_align_center" style="width:80px;">
						<input class="easyui-switchbutton" data-options="onText:'√',offText:'×',handleWidth:1,value:'3'" id="sbtn3"/>
					</div>
				</div>
				<div class="sw_fri float-left">
					<div class="sw_fri_tit text_align_center">五</div>
					<div class="text_align_center" style="width:80px;">
						<input class="easyui-switchbutton" data-options="onText:'√',offText:'×',handleWidth:1,value:'4'" id="sbtn4"/>
					</div>
				</div>
				<div class="sw_sat float-left">
					<div class="sw_sat_tit text_align_center">六</div>
					<div class="text_align_center" style="width:80px;">
						<input class="easyui-switchbutton" data-options="onText:'√',offText:'×',handleWidth:1,value:'5'" id="sbtn5"/>
					</div>
				</div>
				<div class="sw_sun float-left">
					<div class="sw_sun_tit text_align_center">日</div>
					<div class="text_align_center" style="width:80px;">
						<input class="easyui-switchbutton" data-options="onText:'√',offText:'×',handleWidth:1,value:'6'" id="sbtn6"/>
					</div>
				</div>
				<div class="sw_save float-left"><a id="sw_weeked_submit" class="easyui-linkbutton" style="padding:3px;">保存</a></div>
				<div class="clear"></div>
			</div>
		</div>
	</div>
	
	<div  class="easyui-panel" title="节假日设定">
		<table id="setWH_List"></table>
		<div id="holiday_addDialog" style="display:none;"></div>
		<div id="holiday_editDialog" style="display:none;"></div>
	</div>
</div>
</body>
</html>