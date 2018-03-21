<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
	<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Insert title here</title>
</head>
<body>

<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/set_rule.js"></script>
	<div class="easyui-panel" id="panel_setRule" style="padding:30px 60px 0 30px;margin:0 auto;border:0;text-align:center">
		<div style="margin-bottom:20px">
			<input id="rule_auditTime"  showSeconds="true" labelAlign="right" labelWidth="170" label="夜审点：" labelPosition="before" style="width:320px;height:30px">
		</div>
		<div style="margin-bottom:20px">
			<input id="rule_noonExitRoomTime" showSeconds="true" labelAlign="right" labelWidth="170" label="中午退房时间：" labelPosition="before" style="width:320px;height:30px">
		</div>
		<div style="margin-bottom:20px">
			<input id="rule_vipNoonExitRoomTime"  showSeconds="true" labelAlign="right" labelWidth="170" label="会员中午延时退房时间(小时)：" labelPosition="before" style="width:320px;height:30px">
		</div>
		<div style="margin-bottom:20px">
			<input id="rule_afternoonExitRoomTime"   showSeconds="true" labelAlign="right" labelWidth="170" label="下午退房时间：" labelPosition="before" style="width:320px;height:30px">
		</div>
		<div style="margin-bottom:20px">
			<input id="rule_restHour" showSeconds="true"   labelAlign="right" labelWidth="170" label="钟点房时段(小时)：" labelPosition="before" style="width:320px;height:30px">
		</div>
		<div style="margin-bottom:20px">
			<input id="rule_lateRoomTime"  showSeconds="true"  labelAlign="right" labelWidth="170" label="晚房时间：" labelPosition="before" style="width:320px;height:30px">
		</div>
		<div style="margin-bottom:20px;display:none;">
			<input id="rule_dayRoomUnit"  showSeconds="true"  labelAlign="right" labelWidth="170" label="天房单位：" labelPosition="before" style="width:320px;height:30px">
		</div>
		<div style="margin-bottom:20px;display:none;">
			<input id="rule_restRoomUnit"  showSeconds="true"  labelAlign="right" labelWidth="170" label="钟点房单位：" labelPosition="before" style="width:320px;height:30px">
		</div>
		<div style="width:320px;margin:0 auto;padding-left:155px;">
			<a  id="submitBtn_setRule" style="margin-left:0px;padding:3px 12px 3px 12px;"  class="easyui-linkbutton">确定</a>
			<a id="rule_clean" style="margin-left:15px;padding:3px 12px 3px 12px;" class="easyui-linkbutton">清空</a>
		</div>
	</div>
	<script>
	(function($) {
		eapor.utils.layoutHeightSetAuto("panel_setRule");
	})(jQuery)
	</script>
</body>
</html>