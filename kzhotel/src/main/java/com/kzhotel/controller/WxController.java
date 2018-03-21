package com.kzhotel.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.kzhotel.wx.WxThridParty;

@Controller
@RequestMapping("/wx")
public class WxController {
	
	private WxThridParty eaporWx = new WxThridParty("wx2704b85972314c85", "87c87986c76552b6351f1341119f1d07");
	
	
	@RequestMapping("/getCode")
	@ResponseBody
	public String getCode(HttpServletRequest request, String code){
		if(code == null){
			return "";
		}
		
		eaporWx.setCode(code);
		String accessToken = eaporWx.getAccessToken();
	//	https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
		String op = eaporWx.getOpenid();
		return accessToken +"   aaa   "+ op;
	}

}
