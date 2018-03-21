<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>客户关系--促销推送</title>
</head>
<body>
<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/client_promotion_push.js"></script>
<div>
	<div>
		<div id="nextPushTime_promotion_push" style="width:100%;text-align:right;font-size:14px;padding-right:10px;box-sizing: border-box;height:24px;line-height:24px;"></div>
		<div style="width:300px;margin:0px auto;">
			<div style="margin-bottom:10px;">
			<label style="width:90px;display:inline-block;margin-top:20px;text-align:right;
			padding-right:5px;box-sizing: border-box;">推送对象：</label>
				<label style="display: inline-block;width: 80px;cursor:pointer;margin-right:5px;">
					<input  type="checkbox" name="checkbox_promotionPush" value="1" checked
						style="margin-right: 5px; vertical-align: middle;cursor:pointer;"/>本店会员
				</label>
				<label style="display: inline-block;width: 80px;cursor:pointer;margin-right:5px;">
					<input  type="checkbox" name="checkbox_promotionPush" value="2" checked
						style="margin-right: 5px; vertical-align: middle;cursor:pointer;"/>储值会员
				</label>
			</div>
			<div style="margin-bottom:10px;">
				<input id="activityTheme_promotionPush" type="search" style="width:260px;"
					label="活动主题：" labelPosition="before" labelAlign="right" labelWidth="90" />
			</div>
			<div style="margin-bottom:10px;">
				<input id="activityTime_promotionPush"   style="width:260px;" 
					label="活动时间：" labelPosition="before" labelAlign="right" labelWidth="90"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="activityAddress_promotionPush"  type="search" style="width:260px;" 
					label="活动地址：" labelPosition="before" labelAlign="right" labelWidth="90"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="activityDetail_promotionPush" style="width:260px;"
					label="活动详情：" labelPosition="before" labelAlign="right" labelWidth="90"/>
			</div>
			<div style="padding-left: 95px;margin-bottom:10px;">
					<a style="height: 30px; padding: 0px 10px; margin-right: 15px;" class="easyui-linkbutton" 
					id="submit_promotionPush" >提交</a> 
					<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" 
					id="reset_promotionPush" >清空</a>
			</div>
		</div>
	</div>
	<div>
		<table id="list_promotionPush"></table>
	</div>
	<div id="page_promotionPush" style="margin-top:10px;"></div>
</div>
</body>
</html>