<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<title>接班</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/accept_onduty.js"></script>
	<div  class="easyui-layout" id="layout_onduty" style="width:100%;height:600px;">   
	    <div data-options="region:'north',title:'',height:'auto'" style="padding:8px 0 8px 25px;">
	    	<a class="easyui-linkbutton" style="height:30px;padding:0px 10px" id="createShift_acceptOnduty">新开班</a>
	    	<a class="easyui-linkbutton" style="height:30px;padding:0px 10px" id="receiveMoney_acceptOnduty">接款</a>
	    </div>   
	    <div data-options="region:'center',title:'待接款明细'">
	    	<div class="easyui-panel" style="width:100%;height:100%;">
				<table id="acceptOnduty_table"></table>
				<div id="acceptOnduty_acceptShiftDiv" style="display:none;padding:30px 10px;margin:0 auto;border:0;text-align:center">
					<div style="margin-bottom:20px">
						<input id="acceptOnduty_acceptShiftCode" class="easyui-textbox" label="交班号：" labelPosition="before" labelAlign="right" style="width:250px;"/>
					</div>
					<div style="margin-bottom:20px">
						<input id="acceptOnduty_acceptShiftPrice" class="easyui-numberbox" label="交班金额：" labelPosition="before" labelAlign="right" style="width:250px;"/>
					</div>
					<div style="margin-bottom:20px">
						<input id="acceptOnduty_acceptShiftRemark" class="easyui-textbox" label="备注：" labelPosition="before" labelAlign="right" style="width:250px;"/>
					</div>
				</div>
			</div>
	    </div>   
	</div>  
</body>
</html>