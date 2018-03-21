package com.pub.Project;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerExceptionResolverComposite;



public class MyExceptionResolver extends HandlerExceptionResolverComposite {
	
	 private static Logger logger = Logger.getLogger(MyExceptionResolver.class);  
	    @Override  
	    public ModelAndView resolveException(HttpServletRequest request,  
	            HttpServletResponse response, Object handler, Exception ex) {  
	        logger.error("Catch Exception: ",ex);//把漏网的异常信息记入日志  
	        Map<String,Object> map = new HashMap<String,Object>();  
	        StringPrintWriter strintPrintWriter = new StringPrintWriter();  
	        ex.printStackTrace(strintPrintWriter);  
	        map.put("errorMsg", strintPrintWriter.getString());//将错误信息传递给view  
	        return new ModelAndView("err",map);  
	    }    
	    
	    
//	 // 异常处理，例如将异常信息存储到数据库
 //       exceptionLogDao.save(ex);
//        // 视图显示专门的错误页
//        ModelAndView modelAndView = new ModelAndView("errorPage");
//        return modelAndView;
}
