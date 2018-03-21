package com.kzhotel.wx;

import java.util.Date;

import com.PubJavadill.java.ClsHttpVisit;
import com.alibaba.fastjson.JSONObject;

import me.persevere.util.SimpleDateHandler;

/**
 * 微信第三方类
 * @author Administrator
 *
 */
public class WxThridParty {
	
	/**
	 * appid
	 */
	private String appid;
	
	/**
	 * secret
	 */
	private String secret;
	
	/**
	 * code
	 */
	private String code;
	
	/**
	 * grant_type,必填
	 */
	private final String grantType = "authorization_code";
	
	/**
	 * 第三方授权accessToken
	 */
	private String accessToken;
	
	/**
	 * 第三方授权accessTokenTime
	 */
	private Date accessTokenTime;
	
	/**
	 * refresh_token,用于刷新accessToken凭证
	 */
	private String refreshToken;
	
	/**
	 * refresh_token时间，比较长，周期为30天
	 */
	private Date refreshTokenTime;
	
	/**
	 * openid
	 */
	private String openid;

	/**
	 * scope，作用域
	 */
	private String scope;
	
	/**
	 * unionid,当且仅当该网站应用已获得该用户的userinfo授权时，才会出现该字段。
	 */
	private String unionid;

	public WxThridParty(String appid, String secret) {
		super();
		this.appid = appid;
		this.secret = secret;
	}

	public String getAppid() {
		return appid;
	}

	public String getSecret() {
		return secret;
	}

	public String getCode() {
		return code;
	}
	
	public void setCode(String code){
		this.code = code;
	}

	public String getGrantType() {
		return grantType;
	}

	public String getAccessToken() {
		getAccessTokenByCode();
//		if(this.accessToken == null){
//			getAccessTokenByCode();
//		}else{
//			//判断是否过期
//			int hour = SimpleDateHandler.getHourBetweenTwoDates(this.accessTokenTime, new Date());
//			if(hour >= 0){
//				//说明已过期
//				refreshAccessToken();
//			}
//		}
		return this.accessToken;
	}
	
	/**
	 * 刷新accessToken
	 */
	private void refreshAccessToken(){
		if(this.refreshToken == null){
			return;
		}
		
		int days = SimpleDateHandler.getDayBetweenTwoDates(this.refreshTokenTime, new Date());
		if(days >= 20){
			//大于20天，直接刷新整个授权凭证
			getAccessTokenByCode();
		}else{
			String url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=" + this.appid + 
					"&grant_type=refresh_token" +
					"&refresh_token=" + this.refreshToken;
			String result = ClsHttpVisit.GetByUrl(url);
			JSONObject jsonobj = JSONObject.parseObject(result);
			String errorcode = jsonobj.getString("errorcode");
			if(errorcode != null && !"0".equals(errorcode)){
				return;
			}
			this.accessToken = jsonobj.getString("access_token");
			this.accessTokenTime = new Date();
			this.refreshToken = jsonobj.getString("refresh_token");
			this.openid = jsonobj.getString("openid");
			this.scope = jsonobj.getString("scope");
		}
		
	}
	
	
	/**
	 * 根据code获取新的accessToken
	 * @return
	 */
	private void getAccessTokenByCode(){
		if(this.code == null){
			return ;
		}
		String url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + this.appid + 
				"&secret=" + this.secret + 
				"&code=" + this.code + 
				"&grant_type=" + this.grantType;
		
		String result = ClsHttpVisit.GetByUrl(url);
		JSONObject jsonobj = JSONObject.parseObject(result);
		String errorcode = jsonobj.getString("errorcode");
		if(errorcode != null && !"0".equals(errorcode)){
			return;
		}
		this.accessToken = jsonobj.getString("access_token");
		this.accessTokenTime = new Date();
		this.refreshToken = jsonobj.getString("refresh_token");
		this.openid = jsonobj.getString("openid");
		this.scope = jsonobj.getString("scope");
		this.unionid = jsonobj.getString("unionid");
	}

	public Date getAccessTokenTime() {
		return accessTokenTime;
	}

	public String getRefreshToken() {
		return refreshToken;
	}
	
	public Date getRefreshTokenTime(){
		return refreshTokenTime;
	}

	public String getOpenid() {
		return openid;
	}

	public String getScope() {
		return scope;
	}

	public String getUnionid() {
		return unionid;
	}
	
	
}
