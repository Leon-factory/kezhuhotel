package org.kzhotel.testmybatis;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.PubJavadill.CmpBeanValue;
import com.PubJavadill.CmpDateUtil;
import com.PubJavadill.java.CmpLocalDT;
import com.PubJavadill.CmpLstGroup;
import com.alibaba.fastjson.JSON;
import com.kzhotel.service.IGuestService;
import com.kzhotel.service.IReportService;
import com.kzhotel.BLLI.IBllPrint;
import com.kzhotel.BLLI.IBllReception;
import com.kzhotel.controller.clspubcontrollerfunc;
import com.kzhotel.dao.systemMapper;
import com.kzhotel.model.RepPayDaily;
import com.kzhotel.model.paymentdailyreport;
import com.kzhotel.per.PerCollectionSummary;
import com.kzhotel.per.PerMemConsRFM;
import com.kzhotel.per.PerPrintReception;
import com.kzhotel.per.PerRecetionInfo;



//import com.kzhotel.service.IRentPriceService;

@RunWith(SpringJUnit4ClassRunner.class)		//表示继承了SpringJUnit4ClassRunner类
@ContextConfiguration(locations = {"classpath:smybnet.xml","classpath:smybcom.xml","classpath:smybeb.xml"})

public class JavadillTestBatis {
	private static Logger logger = Logger.getLogger(JavadillTestBatis.class);

	@Resource
	private IGuestService guestService;
	
	@Resource
	private IBllPrint bllprint;
	@Resource
	private IBllReception bllReception;
	@Test
	public void test1() {
		List<Integer> guestIds = this.guestService.getTwoYearConsumptionGuestIdList(1);
		System.out.println(JSON.toJSONString(guestIds));
		
		List<PerMemConsRFM> lstpmcr = this.guestService.getTwoYearConsumptionGuestValue(1);
		System.out.println(JSON.toJSONString(lstpmcr));
	}
	

	@Test
	public void testprintReception() {
		PerPrintReception perPrintReceptions = this.bllprint.printReception(450, 0, 4834, "javadill",26l);
		System.out.println( JSON.toJSONString(perPrintReceptions) );
	}
	
	@Test
	public void testReceptionInfo() {
		PerRecetionInfo  perReceptionInfo = this.bllReception.getReceptionInfo(25,450);
		System.out.println( JSON.toJSONString(perReceptionInfo) );
	}

}
