<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>

<%--百度地图容器--%>
<div style="width:100%;height:100%;border:#ccc solid 1px;" id="dituContent"></div>
<div id="r-result"><input type="text" id="suggestId" size="20" value="" style="width:250px;height:36px;position: absolute; top:50px;left:160px;border: 1px solid #c4c7cc;"  placeholder="请输入搜索地点" /></div>
<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
<script type="text/javascript">
$(function(){
	var map = new BMap.Map("dituContent");
	var point = new BMap.Point(116.331398,39.897445);
 	map.centerAndZoom(point,12);
 	//添加左上角放大缩小控件
 	var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
	var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
	var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
	//添加控件和比例尺
	function add_control(){
		map.addControl(top_left_control);        
		map.addControl(top_left_navigation);     
		map.addControl(top_right_navigation);    
	}
	add_control();
	
	map.enableScrollWheelZoom();
	map.enableScrollWheelZoom(true);//地图缩放设置
	//添加城市选择
	var size = new BMap.Size(80, 60);
	map.addControl(new BMap.CityListControl({
	    anchor: BMAP_ANCHOR_TOP_LEFT,
	    offset: size
	}));
	//单击获取点击的经纬度
	var geoc = new BMap.Geocoder();
	map.addEventListener("click",function(e){
			var pt = e.point;
			//得到省市区 hidden保存 
			geoc.getLocation(pt, function(rs){
				var addComp = rs.addressComponents;
				if(addComp.province == "上海市" || addComp.province == "重庆市" 
						|| addComp.province == "北京市" || addComp.province == "天津市"){
					$('#province_hotelInfo').val(addComp.province);
					$('#city_hotelInfo').val(addComp.district);
					$('#district_hotelInfo').val(addComp.district);
					$('#hotel_prov_city').textbox('setValue',
							(addComp.province?addComp.province:'')+
							(addComp.district?addComp.district:'')		
					);
				}else{
					$('#province_hotelInfo').val(addComp.province);
					$('#city_hotelInfo').val(addComp.city);
					$('#district_hotelInfo').val(addComp.district);
					$('#hotel_prov_city').textbox('setValue',
							(addComp.province?addComp.province:'')+
							(addComp.city?addComp.city:'')+
							(addComp.district?addComp.district:'')		
					);
				}
			});        
		
		$('#hotel_long').numberbox('setValue',pt.lng);//获得坐标
		$('#hotel_lat').numberbox('setValue',pt.lat);//获得坐标
		
		
		$('#mapClose').trigger('click');//关闭地图保存地图坐标
		$('#businessSubmit').css('color','white');
		$('#businessSubmit').removeAttr('disabled');
		
		$.messager.show({title:'系统提示',msg:'成功获得经纬度，提交后生效！',timeout:3000,showType:'slide'});

	});

	var geolocation = new BMap.Geolocation();
 	geolocation.getCurrentPosition(function(r){ //定位结果对象会传递给r变量
		if(this.getStatus() == BMAP_STATUS_SUCCESS){//通过Geolocation类的getStatus()可以判断是否成功定位
		var mk = new BMap.Marker(r.point);//基于定位的这个点的点位创建marker
			map.addOverlay(mk); //将marker作为覆盖物添加到map地图上
			map.panTo(r.point);//将地图中心点移动到定位的这个点位置
			mk.enableDragging();//地点图标可移动设置
		}else {
		     //alert('failed'+this.getStatus());
		} 
	});
	
	// 添加定位控件
    var geolocationControl = new BMap.GeolocationControl();
    map.addControl(geolocationControl);
  
  	//添加搜索功能
  	function G(id) {
		return document.getElementById(id);
	}
	var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
			{"input" : "suggestId"
			  ,"location" : map
	        });

	ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
	var str = "";
	var _value = e.fromitem.value;
	var value = "";
	if (e.fromitem.index > -1) {
		value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
	}    
	str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
			
	value = "";
	if (e.toitem.index > -1) {
		_value = e.toitem.value;
		value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
	}    
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
		G("searchResultPanel").innerHTML = str;
	});

	var myValue;
	ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
		var _value = e.item.value;
		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
				
		setPlace();
	});

	function setPlace(){
		map.clearOverlays();    //清除地图上所有覆盖物
		function myFun(){
			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
			map.centerAndZoom(pp, 12);
			map.addOverlay(new BMap.Marker(pp));    //添加标注
		}
		var local = new BMap.LocalSearch(map, { //智能搜索
			 onSearchComplete: myFun
		});
		local.search(myValue);
	}
});
</script>
</body>
</html>