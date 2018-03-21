<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title>驿宝首页</title>
    
    <link rel="Shortcut Icon" href="${pageContext.request.contextPath }/home/images/eapolog.ico" />
    <link href="${pageContext.request.contextPath }/home/css/bootstrap.min.css" rel="stylesheet">
    <!-- <link href="http://libs.baidu.com/fontawesome/4.0.3/css/font-awesome.css" rel="stylesheet"/> -->
    <link href="${pageContext.request.contextPath }/home/css/font-awesome.min.css" rel="stylesheet" />
    <link href="${pageContext.request.contextPath }/home/css/home.css?v=20171019155755" rel="stylesheet" />
	<script src="${pageContext.request.contextPath }/home/js/jquery-3.1.1.min.js"></script>
	<script src="${pageContext.request.contextPath }/home/js/bootstrap.min.js"></script>
	<script src="${pageContext.request.contextPath }/home/js/md5.min.js"></script>
	<script src="${pageContext.request.contextPath }/home/js/login.js?v=20171211175543"></script>
    <%-- <link href="https://cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.css" rel="stylesheet">
    <link href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
	<script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> --%>
</head>
<body>
    <%-- hander start--%>
    <div class="navbar navbar-inverse"  style="background-color: white;" id="menu">
        <div class="container" >
            <div class="navbar-header" style="width:230px;">
                <button style="position:absolute;right:0;" type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" tabindex="-1" style="width: 80px;height: 80px;padding: 8px 0;" href="http://www.eapor.com">
				<img  style="width: 80px;height: 64px;" src="home/images/eapolog.png" alt="logo"/>
                </a>
              <div class="float-right pdt5 pdl5">
                <span class="logotitle">酒店结盟连锁<br></span>
                <span class="logotitle">中国第一品牌</span>
              </div>
            </div>
            <div class="navbar-collapse collapse move-me">
                <ul class="nav navbar-nav navbar-right">
                    <li  class="topTitle" style="color:#3D4E6A;padding:0 0 0 30px;"><a  tabindex="-1" class="topTitleActive" style="width:34px;color:#3D4E6A;padding:20px 0 0 0;font-size:16px;text-indent: 1px;cursor: default;">首页</a></li>
                     <li class="topTitle" style="color:#3D4E6A;padding:0;"><a tabindex="-1" class="topahover"  id="title_about" style="color:#3D4E6A;padding:20px 0 0 0;font-size:16px;text-indent: 2px;cursor:pointer;" >关于驿宝</a></li>
                     <li class="topTitle" style="color:#3D4E6A;padding:0;"><a tabindex="-1" class="topahover"  id="title_lianxi" style="color:#3D4E6A;padding:20px 0 0 0;font-size:16px;text-indent: 2px;cursor:pointer;" >联系我们</a></li>
                    <li class="topTitle"  style="padding:0;"><a tabindex="-1" class="topahover" href="../kzhotel/home/client/useapplication.jsp" target="_blank" style="color:#3D4E6A;padding:20px 0 0 0;font-size:16px;text-indent: 2px;">使用申请</a></li>
                </ul>
            </div>
        </div>
    </div>
    <%-- hander end--%>
      <%--login start--%>
    <div class="home-sec" id="home" >
           <div class="overlay">
              <div class="container">
                <div class="row" >
                  <div class="col-lg-12  col-md-12 col-sm-12">
                      <div class="flexslider set-flexi" id="main-section" >
                               <%-- content--%>
                        <div class="content">
                        <div id="nocookie"  class="login-topBg">
                          <div class="login-topStyle" style="top: 0;right:0;">
       						<%-- <form id="loginForm" action="${pageContext.request.contextPath }/user/login" method="post" autocomplete="off" > --%>
                            <h3 class="white logintitle" style="text-align: center;">用户登录</h3>
                            <div class="input-group pdb10">
                              <span class="input-group-addon bgwhite" id="basic-addon1">
                                <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
                              </span>
                              <input id="username" class="iptname  form-control" type="text" name="username" tabindex="1" aria-describedby="basic-addon1" autocomplete="off" placeholder="请输入用户名">
                            </div>
                            <div class="input-group pdb10" >
                              <span class="input-group-addon bgwhite" id="basic-addon2">
                                <span class="glyphicon glyphicon-lock" aria-hidden="true"></span>
                              </span>
                              <input id="password" class="iptpsw form-control" type="text"  style="padding-right: 40px;" aria-describedby="basic-addon2" tabindex="2" name="password" autocomplete="new-password" placeholder="请输入密码">
                              <i id="showPWD" class="fa fa-lg fa-eye-slash black" style="position: absolute;right: 10px; top: 10px;z-index: 3;cursor: pointer;"></i>
                            </div>
                            <div>
                              <div class="float-left">
                                <input id="validate"  style="width:110px;" tabindex="3" class="form-control validate" name="validate" type="validator" placeholder="请输入验证码">
                              </div>
                              <div class="float-left">
							   <img alt="验证码" tabindex="-1" style="width:100px;height:32px;margin-top:1px; margin-left: 8px;cursor:pointer;" id="verificationCode" src="${pageContext.request.contextPath }/validate/code">
                              </div>
                            </div>
                            <div class="clear"></div>
                             <div class="float-left mgb10">
                                <div class="main-checkbox">
                                    <input type="checkbox" value="auto" id="checkbox1" tabindex="-1" name="autoLoginCheck"/>
                                    <label for="checkbox1"></label>
                                </div>
                                <span class="text white">记住账号</span>
                              </div>
                              <div class="float-right mgb10">
                                <a class="white" href="home/client/editpassword.jsp" target="_blank" tabindex="-1">修改密码</a>
                              </div>
                              <div class="clear"></div>
                              <div>
                              	<!-- <span id="loginInfoIsExpired" class="error_xinxi" style="display:none;color: red;font-size: 120%;letter-spacing: 1px;margin: 5px;">身份信息过期，请重新登录</span> 
                               	<span id="loginInfoIsNull" class="error_xinxi" style="display:none;color: red;font-size: 120%;letter-spacing: 1px;margin: 5px;">登录信息不能为空</span> 
                                <span id="userError" class="error_xinxi" style="display:none;color: red;font-size: 120%;letter-spacing: 1px;margin: 5px;">用户名或密码不正确</span> 
                                <span id="validateError" class="error_xinxi" style="display:none;color: red;font-size: 120%;letter-spacing: 1px;margin: 5px;">验证码不正确</span> -->
                                <span id="errTip" class="error_xinxi" style="display:none;color: red;font-size: 120%;letter-spacing: 1px;margin: 5px;"></span>
                                <a id="indexLogin" class="btn btn-primary loginsubmit"  tabindex="-1">
                                	<span id="loggingIn" style="display:none;"><i class="fa fa-spinner fa-pulse"></i> 登录中...</span>
                                	<span id="logInImmediately">立即登录</span>
                                </a>
                            </div>
                            <!-- </form> -->
                        </div>
                      </div>
                      
                      <div id="hasCookie" style="display: none" class="login-topBg">
					      <div class="login-topBg1">
					        <div class="login-topStyle" id="loginStyle">
					          <%--在点击注册时出现样式login-topStyle3登录框，而login-topStyle2则消失--%>
					            <h3 class="white logintitle" style="text-align: center;">用户登录</h3>
					            <div class="ui-form-item loginUsername input-group" style="margin-bottom:15px;">
					            	<span class="input-group-addon glyphicon glyphicon-user" style="background-color:#fff;position: relative;top: 0;" id="sizing-addon1"></span>
					              <input id="hascookie_username" style="background-color:#fff;" aria-describedby="sizing-addon1" class="iptname  form-control" readonly name="username" type="username" >
					            </div>
					            <div class="ui-form-item loginPassword input-group"  style="margin-bottom:15px;">
					            <span class="input-group-addon glyphicon glyphicon-home" style="background-color:#fff;position: relative;top: 0;" id="sizing-addon2"></span>
					              <input id="hascookie_hotelname" style="background-color:#fff;" aria-describedby="sizing-addon2" class="iptname  form-control"  readonly  name="hotelname" type="username" >
					            </div>
					            <div class="login_reme" style="text-align:center;">
					              <a class="btn btn-primary" style="width:90px;margin-left:0px;" id="autoLogin">进入</a>
					               <a class="btn btn-primary"  style="width:90px;" id="signOut">退出</a> </div>
					        </div>
					      </div>
					    </div>
		    		</div>
                </div>
            </div>
               </div>
                </div>
           </div>
       </div>
      <%--login end--%>

      <%--about start--%>
         <div id="features-sec" class="container set-pad" >
             <div class="row text-center">
                 <div class="col-lg-8 col-lg-offset-2 col-md-8 col-sm-8 col-md-offset-2 col-sm-offset-2">
                     <h1 data-scroll-reveal="enter from the bottom after 0.2s" id="aboutEapor" class="header-line">关于驿宝</h1>
                     <p data-scroll-reveal="enter from the bottom after 0.3s" ></p>
                 </div>
             </div>
             <div class="row" >
                <div class="col-lg-6  col-md-6 col-sm-6" data-scroll-reveal="enter from the bottom after 0.4s">
                     <div class="about-div">
                        <i class="icon-round-border pot4836"></i>
                        <h3 style="margin-top: 0px;">驿宝是酒店结盟连锁</h3>
                        <hr />
                          独立酒店为何容易陷入营销困境？
                       <hr />
                       <p >
                          酒店经营环境变了。我们这个时代相比往日旧时光最大的不同是互联网的冲击。
                        这个变化对酒店是非常不利的。但是，酒店管理的教科书无视变化，
                        继续写着“酒店最重要的客源是散客”。这简直是睁着眼睛说瞎话。互联网时代来临，散客消失了。<br>
                        酒店应对变化的环境无非有如下几个对策：<br>①选择连锁品牌加盟（还行！）<br>
                        ②依赖网络渠道，放弃维护客源（惨！）<br>
                        ③单打独斗，做自己的会员（难！）<br>
                        ④结盟连锁，做自己的会员（现实选择！）
                       </p>
                     </div>
                </div>
                <div class="col-lg-6  col-md-6 col-sm-6" data-scroll-reveal="enter from the bottom after 0.5s">
                     <div class="about-div">
                        <i class="icon-round-border pot4836" ></i>
                        <h3 style="margin-top: 0px;font-weight: initial;">本站推荐使用谷歌浏览器 <a href="http://www.baidu.com/link?url=BzB8ZwxpBiLZ6lmB6sEBiAUK66qqH7s7FwBjUjv7yYFnYl_fKDp_lsw14YllFTNFj-7fsj_08Nmm-vxumLhTZNq4hhrEiSZT97_BuUt-b9O">点击下载</a></h3>
                        <hr />
                          什么是酒店结盟连锁？
                        <hr />
                        <p >
                            酒店结盟连锁不同于加盟连锁。
                          美国最佳西方成立于1946年，是第一个酒店结盟连锁。结盟连锁的每个酒店都是独立酒店，甚至有独立的酒店名称，比如Best Western Gateway Inn或Best Western Berkshire Inn。没有任何一个酒店是直营店。最佳西方内部也有小的连锁酒店，比如Best Western Midway Hotels。
                          最佳西方的品牌由全部运营酒店共享。总部的运营类似于一个秘书处，服务于联盟的利益，但最佳西方的运营总部在美国是上市公司。最佳西方也一度是全球最大的酒店连锁。
                        结盟连锁的运营规则是由全部运营酒店按规则来设置的。
                          驿宝致力于在中国实现酒店结盟连锁。
                        我们把驿宝内部小的连锁酒店称为一个群组。
                        </p>
                     </div>
                </div>
            </div>

                 <%--/.HEADER LINE END--%>
           <div class="row" >
                <div class="col-lg-6  col-md-6 col-sm-6" data-scroll-reveal="enter from the bottom after 0.4s">
                     <div class="about-div">
                         <i class="icon-round-border pot4836" ></i>
                         <h3 style="margin-top: 0px;">驿宝实现会员共享</h3>
                         <hr />
                         <hr />
                         <p >
                          不同于加盟酒店是在帮总部发展会员，驿宝的联盟酒店都是为自己发展会员。每个酒店接待其他酒店的会员消费按规则付费3%；在这一交叉消费中，其中的1%支付给发展会员的酒店。
                          会员共享实现了一卡通，一个酒店的会员在全联盟酒店都享受会员待遇，而每个酒店的会员优惠是自己独立设计的，但是必须开放给其他酒店的会员。
                          会员共享实现积分通积通兑。牵涉到的清算由驿宝负责。
                          储值只在本店用。储值在内部小连锁也就是同一群组的酒店是通用的。储值交叉消费的清算由群组的群主负责。
                        </p>
                    </div>
                </div>
                <div class="col-lg-6  col-md-6 col-sm-6" data-scroll-reveal="enter from the bottom after 0.5s">
                     <div class="about-div">
                          <i class="icon-round-border pot4836" ></i>
                          <h3 style="margin-top: 0px;">至少3公里竞争保护政策</h3>
                          <hr />
                          <hr />
                           <p >
                            在其平日会员价均价的上下30%以内，我们为每一成员酒店提供至少3公里的竞争保护距离。
                           </p>
                    </div>
                </div>   
          </div>
                   <%--/.HEADER LINE END--%>
           <div class="row" >
                <div class="col-lg-6  col-md-6 col-sm-6" data-scroll-reveal="enter from the bottom after 0.4s">
                     <div class="about-div">
                         <i class="icon-round-border pot4836" ></i>
                         <h3 style="margin-top: 0px;">驿宝服务费</h3>
                         <hr />
                         <hr />
                         <p >
                           驿宝按照成员酒店的房间数量和平日会员价均价之乘积收取年费做为运营服务费。
                         </p>
                     </div>
                </div>
                   <div class="col-lg-6  col-md-6 col-sm-6" data-scroll-reveal="enter from the bottom after 0.5s">
                      <div class="about-div">
                         <i class="icon-round-border pot4836" ></i>
                         <h3 style="margin-top: 0px;">驿宝的服务</h3>
                         <hr />
                         <hr />
                         <p >
                            驿宝提供统一的结盟连锁品牌运营，实现市场协同；<br>
                            驿宝提供统一的酒店管理软件；<br>
                            驿宝提供统一的会员管理软件，并且实现与不同行业会员共享；<br>
                            驿宝提供统一的微信订房公众服务号，实现会员交叉订房。
                         </p>
                      </div>
                   </div>
              </div>
            </div>
	<%-- 联系我们 --%>
				<div class="row" style="margin:0;">
				 <div class="row text-center" style="margin:0;">
	                 <div class="col-lg-8 col-lg-offset-2 col-md-8 col-sm-8 col-md-offset-2 col-sm-offset-2">
	                     <h1 data-scroll-reveal="enter from the bottom after 0.2s" id="lianxiEapor" class="header-line">联系我们</h1>
	                     <p data-scroll-reveal="enter from the bottom after 0.3s" ></p>
	                 </div>
	             </div>
	             </div>
                <div class="container"  style="background: #043d5d;width:100%;margin:0;padding:1em 0 0 0;">
					<div class="col-md-1 col-xs-0 col-sm-0"></div>
					<div id="allmap" class="col-md-5 col-xs-12 col-sm-12" style="background-color:#fff;height:200px;">
						
			
			
					</div>
					<script type="text/javascript">
						$(function(){
							var map = new BMap.Map("allmap");            // 创建Map实例
							var point = new BMap.Point(121.427924,31.032678); // 创建点坐标
							
							var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
							var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
							var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
							/*缩放控件type有四种类型:
							BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
							
							//添加控件和比例尺
							
							map.addControl(top_left_control);        
							map.addControl(top_left_navigation);     
							//map.addControl(top_right_navigation); 
								
							map.centerAndZoom(point,18);   
							
							var marker = new BMap.Marker(new BMap.Point(121.427924,31.032678));  // 创建标注
							map.addOverlay(marker);
				
							map.enableScrollWheelZoom();
							setTimeout(function(){
								$('a[href="http://map.baidu.com/?sr=1"]').attr("tabindex",-1);
							},1000);
							
						});
					</script>
					<div class="col-md-5 col-xs-12 col-sm-12" style="color: #fff;padding-top:1em;padding-bottom:1em;">
						<div style="display:inline;">
							<div style="float:left;">
								<i class="fa fa-map-marker fa-3x" aria-hidden="true"></i>
							</div>
							<div style="padding-left:50px;">
								<div style="float:left;">
									<span>上海客主商务服务有限公司<br></span>
									<span>地址：上海市剑川路951号零号湾2号楼307<br></span>
									<span>电话：021-57466066<br></span>
									<span>手机：18516271001<br></span>
									<span>客服QQ：87882788<br></span>
									<span>邮箱：419885411@qq.com</span>
								</div>
								<div style="float:left;margin-left:20px;">
									<p style="text-align:center;"><h4 style="text-align:center;">微信公众号二维码</h4></p>
									<img src="home/images/eapor_weChat_erwei.jpg" alt="" style="width:160px;display:inline;">
								</div>
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
				</div>
            </div>
    <!-- </div> -->
    <%-- footer start --%>     
    <div id="footer" style="text-align: center;">
    <div id="backtop" style="position: fixed;background-color: #9E9E9E;border-radius: 30px; bottom: 20px;
    		right: 20px; width: 38px; height: 38px; cursor:pointer;display:none;">
	    <canvas id="cvs" width="38px;" height="38px;" ></canvas>
    </div>
    <span class="footerText" style="color: white;">Copyright © 2017，All Rights Reserved <a tabindex="-1" href="http://www.miibeian.gov.cn" style="color:white;" target="_blank">沪ICP备17002277号</a>&nbsp;&nbsp;<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1262059817'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s13.cnzz.com/stat.php%3Fid%3D1262059817%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E"));</script></span>
    </div>
    <%-- footer end--%> 
   <!-- <script type="text/javascript" src="https://api.map.baidu.com/api?v=2.0&ak=PDzweVAQXotI9pGAyDjzeQWN3U66LS2S&s=1"></script>
 --><script type="text/javascript" src="https://api.map.baidu.com/getscript?v=2.0&ak=caqG8Gdfe7ahDQcDjTKTUldzcqC4REnW"></script>
	
</body>
</html>