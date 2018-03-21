package org.kzhotel.testBLL;



import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.PubJavadill.ClsBinHex;
import com.PubJavadill.ClsCalculationString;
import com.PubJavadill.CoreMD5;
import com.PubJavadill.java.ClsHttpVisit;
import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllChannel;
import com.kzhotel.BLLI.IBllGuest;
import com.kzhotel.BLLI.IBllNightCheck;
import com.kzhotel.BLLI.IBllPrint;
import com.kzhotel.BLLI.IBllReception;
import com.kzhotel.BLLI.IBllReport;
import com.kzhotel.factory.LockSystemFactory;
import com.kzhotel.factory.locksystem.LockSystem;
import com.kzhotel.join.goodsJoin;
import com.kzhotel.model.AdvanceChannel;
import com.kzhotel.model.Reservedetail;
import com.kzhotel.pojo.goodscategory;
import com.kzhotel.service.IGoodsService;
import com.kzhotel.service.IGoodscategoryService;
import com.kzhotel.service.IGuestService;
import com.kzhotel.service.IHotelService;
import com.kzhotel.service.IReceptionService;
import com.kzhotel.service.IReserveService;

import me.persevere.util.SimpleDateHandler;
import net.kzhotel.BLLI.NetIBllReserve;
import net.kzhotel.BLLI.NetIBllUsers;
import net.kzhotel.service.IShopsService;



@RunWith(SpringJUnit4ClassRunner.class)		//表示继承了SpringJUnit4ClassRunner类
@ContextConfiguration(locations = {"classpath:smybcom.xml","classpath:smybnet.xml","classpath:smybeb.xml"})
public class TestBll3 {
	
	@Resource
	private NetIBllReserve netBllReserve;
	@Resource
	private IBllReception bllReception;
	
	@Resource
	private IReserveService reserveService;
	@Resource
	private IGoodsService goodsService;
	@Resource
	private IGoodscategoryService goodscategoryService;
	@Resource
	private IBllReport bllReport;
	@Resource
	private NetIBllUsers netIBllUsers;
	@Resource
	private IHotelService hotelService;
	@Resource
	private IBllGuest bllGuest;
	@Resource
	private IShopsService netShopsService;
	@Resource
	private IGuestService guestService;
	@Resource
	private IReceptionService receptionService;
	@Resource
	private IBllNightCheck bllNightCheck;
	@Resource
	private IBllPrint bllPrint;
	@Resource
	private IBllChannel bllChannel;
	
	//@Test
	public void test1(){
		CancelOrderToWeChat cotw = new CancelOrderToWeChat();
		cotw.appid = "okkkkk";
		cotw.mch_id = "111111";
		System.out.println(JSON.toJSONString(cotw));
        
	}
	
	class CancelOrderToWeChat{
		//传送给微信服务器的model
		String appid;//微信支付分配的公众账号ID（企业号corpid即为此appId）
		String mch_id;//微信支付分配的商户号
		String transaction_id;//微信的订单号，建议优先使用
		String out_trade_no;//商户系统内部订单号，与transaction_id二选一使用
		String nonce_str;//随机字符串，不长于32位
		String sign;//签名
		String sign_type;//签名类型，默认为MD5
	}
	
	//@Test
	public void test2(){
		Map<String, String> map = new HashMap<String, String>();
		map.put("text", "C:\\kzhotelexe\\kzlock.exe 15177422");
		String result = ClsHttpVisit.strPostJsonStr("test.kezhu.net/kzhotel/lock/inputRent", JSON.toJSONString(map));
		System.out.println(result);
	}
	
	
	//@Test
	public void test3(){
		long start = System.currentTimeMillis();
		System.out.println(start);
		List<goodsJoin> gjs = this.goodsService.listGoodsPage(0, 9999, 1, "", 0, 0);
		List<goodscategory> gcs = this.goodscategoryService.listGoodscategoryPage(0, 9999, 1l, "");
		Collections.sort(gcs, new Comparator<goodscategory>() {

			@Override
			public int compare(goodscategory o1, goodscategory o2) {
				// TODO Auto-generated method stub
				return o1.getSortCode().compareTo(o2.getSortCode());
			}
		});
		List<goodsJoin> goodsJoins = new ArrayList<goodsJoin>();
		for(int i = 0; i < gcs.size(); i++){
			List<goodsJoin> gs = new ArrayList<goodsJoin>();
			for(int j = 0; j < gjs.size(); j++){
				if(gjs.get(j).getGoodsCategoryId().intValue() == gcs.get(i).getGoodsCategoryId().intValue()){
					gs.add(gjs.get(j));
				}
			}
			Collections.sort(gs, new Comparator<goodsJoin>() {

				@Override
				public int compare(goodsJoin o1, goodsJoin o2) {
					// TODO Auto-generated method stub
					return o1.getSortCode().compareTo(o2.getSortCode());
				}
			});
			for(int k = 0; k < gs.size(); k++){
				goodsJoins.add(gs.get(k));
			}
			gs = null;
		}
		long end = System.currentTimeMillis();
		System.out.println(end);
		System.out.println("耗时："+((start-end)/1000));
		System.out.println(JSON.toJSONString(goodsJoins));
	}
	
	//@Test
	public void test4(){

		List<Reservedetail> reservedetails = this.reserveService.listReservedetailPage(1, 
					"1", "", "", null,new Date(), 0, 9999);
		System.out.println(reservedetails.size());
	}
	
	
	//@Test
	public void test5(){
		LockSystem ls = LockSystemFactory.newInstanceJundatai(1l, "123333", "123", "20171023161900", "20171023161900");
		System.out.println(LockSystem.spell(ls));
		new HashMap<>();
	}
	
	@Test
	public void test6(){
//		String c = "ok";
//		String d = "ok";
//		String a = new String("ok");
//		String b = new String("ok");
//		
//		System.out.println(a == b);
//		System.out.println(c == a);
//		System.out.println(c == b);
//		System.out.println(c == d);
//		c = "ok2";
//		System.out.println(d);
//		List<Integer> ints = new ArrayList<>();
		//18767131932
//		System.out.println(JSON.toJSONString(this.netIBllUsers.listMemberPage(1l, "", "18767131932", 0,999)));
//		for(int i = 0; i < 10; i++){
//			ints.add(i);
//		}
//		int sum = ints.stream().mapToInt(Integer::intValue).sum();
//		this.bllNightCheck.NC_UpdateReserveState();
//		System.out.println(PerEaporPush.pushEaporAccountChangeByCashStore("17301767224", "测试",0.1, 1, "o8LBQxG3Cv7Tl0MiARevgFp1ZIdM"));
//		System.out.println(PerEaporPush.pushKezhuAccountChangeByCashStore("17301767224", "测试",0.1, 1, "oc9L0wRs_jKSPPainxjPHE_Vc0vE"));
//		System.out.println(JSON.toJSONString(this.bllReception.getReceptionInfo(1l, 1l)));
//		this.bllPrint.printReception(178L, 3L, 4694L, "nbeapor", 1L);
//		System.out.println(SimpleDateHandler.date2LocalDate(new Date(2016,11,15)).toString());
//		System.out.println(ClsCalculationString.plusString("A101-1",3));
//		Duration duration = Duration.between(LocalDateTime.of(LocalDate.of(2017, 10, 11), LocalTime.of(0, 0)),LocalDateTime.now());
//		System.out.println(duration.toDays());
//		String roomCode = "101";
//		int r = ClsCalculationString.lastValueType(roomCode);
//		if(r == 1){
//			List<String> strings = new LinkedList<>();
//			int number = ClsCalculationString.getLastNumber(roomCode);
//			if(String.valueOf(number).equals(roomCode)){
//				for(int i = 1; i <= 10; i++){
//					strings.add(String.valueOf(number + i)); 
//				}
//			}
//			System.out.println(JSON.toJSONString(strings));
//			String[] rc = roomCode.split(String.valueOf(number));
//			for(int i = 1; i <= 10; i++){
//				strings.add(rc[0] + (number + i)); 
//			}
//			System.out.println(JSON.toJSONString(strings));
//		}else {
//			List<String> strings = new LinkedList<>();
//			for(int i = 1; i <= 10; i++){
//				strings.add(roomCode + "-" + i);
//			}
//			System.out.println(JSON.toJSONString(strings));
//		}
//		System.out.println(CoreMD5.strMD5Encode32("111111"));
		
//		List<Integer> list = new ArrayList<>();
		
//		list.add(1);
//		list.add(2);
//		list.add(3);
//		list.add(1);
//		
//		Map<Integer, List<Integer>> map = list.stream().collect(Collectors.groupingBy(Integer::intValue));
//		for(Map.Entry<Integer, List<Integer>> entry: map.entrySet()){
//			System.out.println("房型id：" + entry.getKey() + ";房型数量：" + entry.getValue().size());
//		}
//		int hour = SimpleDateHandler.getHourBetweenTwoDates(new Date(), SimpleDateHandler.StringToDateByYMDHMS("2017-12-27 13:58:00"));
//		System.out.println(hour);
//		System.out.println(this.bllReport.getMemberConsumeRFM(9L, 0, 0, 0).size());
		
//		System.out.println(this.bllReport.getGuestRFMAnalysis(9L, 0L, 0, 0, 0).size());
		List<AdvanceChannel> advanceChannels = this.bllChannel.listAdvanceChannelPage(0, 999, 1L, "", 0);
		advanceChannels = advanceChannels.stream().sorted(Comparator.comparing(AdvanceChannel::getBalance).reversed()).collect(Collectors.toList());
		System.out.println(JSON.toJSONString(advanceChannels));
		advanceChannels.sort( (ad2, ad1) -> {
			return ad1.getBalance().compareTo(ad2.getBalance());
		});
		System.out.println(JSON.toJSONString(advanceChannels));
	}

}
