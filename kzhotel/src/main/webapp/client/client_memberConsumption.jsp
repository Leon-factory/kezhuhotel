<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>客户关系--会员消费</title>
</head>
<body>
	<script type="text/javascript" src="${pageContext.request.contextPath }/js/client/client_memberConsumption.js"></script>
<div>
	<div>
		<div style="width:300px;margin:0px auto;">
			<div style="margin-bottom:10px;">
			<label style="width:70px;display:inline-block;margin-top:20px;text-align:right;
			padding-right:5px;box-sizing: border-box;">消费类型：</label>
				<label style="display: inline-block;width: 50px;cursor:pointer;margin-right:5px;">
					<input  type="radio" name="consumptionType_memberConsumption" value="3" checked
						style="margin-right: 5px; vertical-align: middle;cursor:pointer;"/>储值
				</label>
				<label style="display: inline-block;width: 50px;cursor:pointer;margin-right:5px;">
					<input  type="radio" name="consumptionType_memberConsumption" value="2" 
						style="margin-right: 5px; vertical-align: middle;cursor:pointer;"/>积分
				</label>
				<label style="display: inline-block;width: 50px;cursor:pointer;">
					<input type="radio" name="consumptionType_memberConsumption" value="1" 
						style="margin-right: 5px; vertical-align: middle;cursor:pointer;"/>现金
				</label>
			</div>
			<div style="margin-bottom:10px;">
				<input id="cardNum_memberConsumption"   type="search" style="width:260px;"
					label="实体卡：" labelPosition="before" labelAlign="right" labelWidth="70" placeholder="若没有实体卡忽略此项"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="phone_memberConsumption" class="easyui-numberbox" type="search"  style="width:260px;" 
				data-options="validType:'mobilephone',delay:1000,required:true,validateOnCreate:false,validateOnBlur:true"
					label="手机号：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="num_memberConsumption" class="easyui-textbox"  type="search" style="width:260px;" 
				data-options="validType:'number',delay:1000,required:true,validateOnCreate:false,validateOnBlur:true"
					label="匹配码：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="consumptioneAmount_memberConsumption" class="easyui-numberbox"  type="search" style="width:260px;"  
				data-options="precision:2,required:true,validateOnCreate:false,validateOnBlur:true"
					label="消费金额：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="margin-bottom:10px;">
				<input id="remark_memberConsumption" class="easyui-textbox"   style="width:260px;" 
				data-options="multiline:true,validType:'maxLength[40]',delay:1000"
					label="备注 ：" labelPosition="before" labelAlign="right" labelWidth="70"/>
			</div>
			<div style="padding-left: 75px;margin-bottom:10px;">
					<a style="height: 30px; padding: 0px 10px; margin-right: 15px;" class="easyui-linkbutton" 
					id="submit_memberConsumption" >提交</a> 
					<a style="height: 30px; padding: 0px 10px" class="easyui-linkbutton" 
					id="reset_memberConsumption" >清空</a>
			</div>
		</div>
	</div>
	<div>
		<table id="list_memberConsumption"></table>
	</div>
</div>
</body>
</html>