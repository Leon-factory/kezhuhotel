package com.kzhotel.controller;


import javax.servlet.http.HttpServletRequest;


import javax.swing.JOptionPane;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.ResponseBody;


import com.kzthread.sms.juhesms;


@Controller
@RequestMapping("/SMS")
public class SMSController {
	
	public static final String ID = "111111"; 
	

	//发验证码
	@RequestMapping("/send")
	@ResponseBody
	public String sendcode(HttpServletRequest request,
			String strphone,String strcode){
	
  		String strmessage="#code#="+strcode;
  		
  		String strresult=juhesms.SendSMS(strphone, strmessage, "25985");
      	  JOptionPane.showMessageDialog(null,strresult
                  , "结果", JOptionPane.INFORMATION_MESSAGE);
		//结果可以尝试解析成可以理解的错误代码
		return strresult;
	}
	
	@RequestMapping("/sendsys")
		@ResponseBody
		public String sendsys(HttpServletRequest request,
				String strphone,String strcode){
		String stre="cuowu";
		String strs="sysnum";
	  		String strmessage="#code#="+strcode+"&#err#="+stre+"&#sys#="+strs;
	  		
	  		String strresult=juhesms.SendSMS(strphone, strmessage, "29081");
	      	  JOptionPane.showMessageDialog(null,strresult
	                  , "结果", JOptionPane.INFORMATION_MESSAGE);
			//结果可以尝试解析成可以理解的错误代码
			return strresult;
		}
	
	
	//列出不适当的词语
	@RequestMapping("/check")
	@ResponseBody
	public String sendcode(HttpServletRequest request,
			String strcode){
      	String strresult=juhesms.checkword(strcode);
		//结果可以尝试解析成可以理解的错误代码
		return strresult;
	}
	
	
	@RequestMapping("/sendAndReceiveService")
	@ResponseBody
	public String sendAndReceiveService(
			String id,
			String errorCode,/*错误码*/
			String sender,/*发送者*/
			String receiver/*接收者*/
			){
		
		if(!id.equals(SMSController.ID)){
			return "id不匹配";
		}
		String strmessage="#code#="+errorCode+sender;
		
  		String strphone = "";
  		String strresult = "";
  		if("12".equals(receiver)){
  			//推送到app上（今后）
  			strphone="17301767224";
  			strresult=juhesms.SendSMS(strphone, strmessage, "25985");
        	  JOptionPane.showMessageDialog(null,strresult
                    , "结果", JOptionPane.INFORMATION_MESSAGE);
        	strphone="13916628656";
        	strresult=juhesms.SendSMS(strphone, strmessage, "25985");
      	  JOptionPane.showMessageDialog(null,strresult
                  , "结果", JOptionPane.INFORMATION_MESSAGE);
  		}
  		
		return strresult;
	}
	

}
