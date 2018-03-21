package org.kzhotel.testmybatis;

import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.PubJavadill.java.ClsHttpVisit;
import com.PubJavadill.CmpLstGroup;
import com.PubJavadill.Datatest;
import com.alibaba.fastjson.JSON;
import com.kzhotel.per.PerPrintReception;
import com.kzhotel.service.IReportService;

import net.kzhotel.pojo.shops;
import net.kzhotel.service.IShopsService;

import java.util.ArrayList;  
import java.util.LinkedHashMap;  
import java.util.List;  
import java.util.Map;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.lang.reflect.Method;  
import java.util.ArrayList;  
import java.util.Collection;  
import java.util.HashMap;  
import java.util.Iterator;  
import java.util.List;  
import java.util.Map;  

@RunWith(SpringJUnit4ClassRunner.class)		//表示继承了SpringJUnit4ClassRunner类
@ContextConfiguration(locations = {"classpath:smybnet.xml","classpath:smybcom.xml","classpath:smybeb.xml"})
public class JavadillNetTestBatis {
	private static Logger logger = Logger.getLogger(JavadillTestBatis.class);

	@Resource
	private IShopsService shopsService;
	@Test
	public void test1() {
		
//	String qrjson = "{\"ActionCode\":\"Login\",\"RequertParams\":\"{'UserName':'139139139111'"
//			+ ",'UserPwd':'abcd','UserIdentity':'sss'"
//			+ "}\"}";
//	String url = "http://www.zhiyushou.com:10000/api/User/MethodMapping";
	
//		String qrjson = "{\"ActionCode\":\"GetBanners\",\"RequertParams\":\"{'PageIndex':0"
//		+ ",'PageSize':10,'Order':'','Where':'Banner'"
//		+ "}\"}";
		String qrjson="{\"ActionCode\":\"GetAppraisalStatusIsNotOverAll\",\"RequertParams\":\""
				+ "{\u0027Order\u0027:\u0027\u0027,\u0027PageIndex\u0027:8,"
				+ "\u0027PageSize\u0027:7,\u0027Where\u0027:\u0027appraisal\u0027}\"}";
		System.out.println(qrjson);
		String url = "http://www.zhiyushou.com:10000/api/Appraisal/MethodMapping";
		
		String ticketresult = ClsHttpVisit.strPostJsonReal(url, qrjson);
	
        System.out.println("result="+ticketresult);
    }  

	
	

}
