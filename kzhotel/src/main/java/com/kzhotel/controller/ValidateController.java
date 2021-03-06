package com.kzhotel.controller;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;
import javax.imageio.ImageIO;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

	
@Controller
@RequestMapping("/validate")
public class ValidateController {
	private int width = 120;//定义图片的width  90
	private int height = 30;//定义图片的height  20
	private int codeCount = 4;//定义图片上显示验证码的个数 4
	private int intcodex = width/(3*codeCount/2);//15;
	private int fontHeight = height*9/10;//18;
	private int intcodeY =  height*codeCount/5;//16;
	char[] codeSequence = { 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J',
      'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
      'X', 'Y', 'Z', '2', '3', '4', '5', '6', '7', '8', '9' };
	//黑色、蓝色、
	int[] colorArray = {0x000000,0x0000ff,0x8B0000,0xE9967A,0x8FBC8F,0x483D8B,0xa52a2a,0xdeb887,0x5f9ea0,0xdc143c,0x006400};

	@RequestMapping("/session")
	@ResponseBody
	public String getSession(HttpServletRequest req, HttpServletResponse resp)
	{
		HttpSession session = req.getSession();
		String strreturn=session.getAttribute("code").toString();
		return strreturn;
	}
  
  
	  @RequestMapping("/cpesession")
	  @ResponseBody
	  public int compareSession(HttpServletRequest req, HttpServletResponse resp)
	  {
		  
		  String strgetcode = req.getParameter("code").toLowerCase();
		  
		  HttpSession session = req.getSession();
		  String strreturn=session.getAttribute("code").toString().toLowerCase();
		  int intchkresult=0;
		  if(strgetcode.equals(strreturn))
		  {
			  intchkresult=1;
		  }
		  return intchkresult;
	  }
	  
	  
	  @RequestMapping("/code")
	  public void getCode(HttpServletRequest req, HttpServletResponse resp)
	      throws IOException {
	
	    // 定义图像buffer
	    BufferedImage buffImg = new BufferedImage(width, height,
	        BufferedImage.TYPE_INT_RGB);
	
	    Graphics gd = buffImg.getGraphics();
	    // 创建一个随机数生成器类
	    Random random = new Random();
	    // 将图像填充为白色
	    gd.setColor(Color.WHITE);
	    //gd.setColor(Color.LIGHT_GRAY);
	    gd.fillRect(0, 0, width, height);
	
	    // 创建字体，字体的大小应该根据图片的高度来定。
	    Font font = new Font("Fixedsys", Font.BOLD, fontHeight);
	    // 设置字体。
	    gd.setFont(font);
	
	    // 画边框。
	    gd.setColor(Color.BLACK);
	    gd.drawRect(0, 0, width - 1, height - 1);
	
	    // 随机产生40条干扰线，使图象中的认证码不易被其它程序探测到。
	    /*gd.setColor(Color.BLACK);
	    for (int i = 0; i < 40; i++) {
	      int x = random.nextInt(width);
	      int y = random.nextInt(height);
	      int xl = random.nextInt(12);
	      int yl = random.nextInt(12);
	      gd.drawLine(x, y, x + xl, y + yl);
	    }*/
	
	    // randomCode用于保存随机产生的验证码，以便用户登录后进行验证。
	    StringBuffer randomCode = new StringBuffer();
	    int red = 0;// green = 0, blue = 0;
	
	    // 随机产生codeCount数字的验证码。
	    for (int i = 0; i < codeCount; i++) {
	      // 得到随机产生的验证码数字。
	      String code = String.valueOf(codeSequence[random.nextInt(32)]);
	      // 产生随机的颜色分量来构造颜色值，这样输出的每位数字的颜色值都将不同。
	      int index=(int)(Math.random()*colorArray.length);
	      red = colorArray[index];
	      // 用随机产生的颜色将验证码绘制到图像中。
	      gd.setColor(new Color(red));
	      gd.drawString(code, (i + 1) * intcodex, intcodeY);
	
	      // 将产生的四个随机数组合在一起。
	      randomCode.append(code);
	    }
	    // 将四位数字的验证码保存到Session中。
	    HttpSession session = req.getSession();
	    session.setAttribute("code", randomCode.toString());
	
	    // 禁止图像缓存。
	    resp.setHeader("Pragma", "no-cache");
	    resp.setHeader("Cache-Control", "no-cache");
	    resp.setDateHeader("Expires", 0);
	
	    resp.setContentType("image/jpeg");
	
	    // 将图像输出到Servlet输出流中。
	    ServletOutputStream sos = resp.getOutputStream();
	    ImageIO.write(buffImg, "jpeg", sos);
	    sos.close();
	  }
	
	  
	  @RequestMapping("/applyCode")
	  public void getApplyCode(HttpServletRequest req, HttpServletResponse resp)
	      throws IOException {
	
	    // 定义图像buffer
	    BufferedImage buffImg = new BufferedImage(width, height,
	        BufferedImage.TYPE_INT_RGB);
	
	    Graphics gd = buffImg.getGraphics();
	    // 创建一个随机数生成器类
	    Random random = new Random();
	    // 将图像填充为白色
	    gd.setColor(Color.WHITE);
	    
	    gd.fillRect(0, 0, width, height);
	
	    // 创建字体，字体的大小应该根据图片的高度来定。
	    Font font = new Font("Fixedsys", Font.BOLD, fontHeight);
	    // 设置字体。
	    gd.setFont(font);
	
	    // 画边框。
	    gd.setColor(Color.BLACK);
	    gd.drawRect(0, 0, width - 1, height - 1);
	
	    // 随机产生40条干扰线，使图象中的认证码不易被其它程序探测到。
	//	    gd.setColor(Color.BLACK);
	//	    for (int i = 0; i < 40; i++) {
	//	      int x = random.nextInt(width);
	//	      int y = random.nextInt(height);
	//	      int xl = random.nextInt(12);
	//	      int yl = random.nextInt(12);
	//	      gd.drawLine(x, y, x + xl, y + yl);
	//	    }
	
	    // randomCode用于保存随机产生的验证码，以便用户登录后进行验证。
	    StringBuffer randomCode = new StringBuffer();
	    int red = 0;// green = 0, blue = 0;
	
	    // 随机产生codeCount数字的验证码。
	    for (int i = 0; i < codeCount; i++) {
	      // 得到随机产生的验证码数字。
	      String code = String.valueOf(codeSequence[random.nextInt(32)]);
	      // 产生随机的颜色分量来构造颜色值，这样输出的每位数字的颜色值都将不同。
	      int index=(int)(Math.random()*colorArray.length);
	      red = colorArray[index];
	      // 用随机产生的颜色将验证码绘制到图像中。
	      gd.setColor(new Color(red));
	      gd.drawString(code, (i + 1) * intcodex, intcodeY);
	
	      // 将产生的四个随机数组合在一起。
	      randomCode.append(code);
	    }
	    // 将四位数字的验证码保存到Session中。
	    HttpSession session = req.getSession();
	    session.setAttribute("applyCode", randomCode.toString());
	
	    // 禁止图像缓存。
	    resp.setHeader("Pragma", "no-cache");
	    resp.setHeader("Cache-Control", "no-cache");
	    resp.setDateHeader("Expires", 0);
	
	    resp.setContentType("image/jpeg");
	
	    // 将图像输出到Servlet输出流中。
	    ServletOutputStream sos = resp.getOutputStream();
	    ImageIO.write(buffImg, "jpeg", sos);
	    sos.close();
	  }
}
