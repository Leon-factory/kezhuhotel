package org.kzhotel.testmybatis;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.kzhotel.pojo.allotdetail;
import com.kzhotel.pojo.consumeitem;
import com.kzhotel.pojo.consumeitem;
import com.kzhotel.pojo.goodsindetail;
import com.kzhotel.pojo.goodsoutdetail;
import com.kzhotel.pojo.guest;
import com.kzhotel.pojo.inventorydetail;
import com.kzhotel.pojo.payment;
import com.kzhotel.pojo.rent;
import com.kzhotel.pojo.rentplan;
import com.kzhotel.pojo.rentprice;
import com.kzhotel.pojo.reservedetail;
import com.kzhotel.pojo.user;
import com.kzhotel.service.IChannelService;
import com.kzhotel.service.IHotelService;
import com.kzhotel.service.IPermisionService;
import com.kzhotel.service.IRentPlanService;
import com.kzhotel.service.IRentPriceService;
import com.kzhotel.service.IRolePermisionService;
import com.kzhotel.service.IRoleService;
import com.kzhotel.service.IRoomTypeService;
import com.kzhotel.service.ISourceGroupService;
import com.kzhotel.service.IUserGroupService;
import com.kzhotel.service.IUserService;
import com.kzhotel.service.IUsergroupRoleService;

import net.kzhotel.model.ShopUser;
import net.kzhotel.pojo.shops;
import net.kzhotel.pojo.users;

import com.kzhotel.BLLI.IBllWarehouse;
import com.kzhotel.dao.floorMapper;
import com.kzhotel.model.GoodsStoreState;
import com.kzhotel.model.ReceptionGuest;
import com.kzhotel.model.pageUserJoin;

//import com.kzhotel.service.IRentPriceService;

@RunWith(SpringJUnit4ClassRunner.class)		//表示继承了SpringJUnit4ClassRunner类
//@ContextConfiguration(locations = {"classpath:spring-mybatis.xml"})
@ContextConfiguration(locations = {"classpath:smybnet.xml","classpath:smybcom.xml"})

public class TestMyBatis {
	private static Logger logger = Logger.getLogger(TestMyBatis.class);
//	private ApplicationContext ac = null;
	@Resource
	private IUserService userService = null;

	@Resource
	private IHotelService hotelService = null;
	
	@Resource
	private IRoomTypeService roomtypeService = null;
	
	@Resource
	private IRentPlanService rentPlanService = null;
	
	@Resource
	private com.kzhotel.service.IFloorService floorService = null;
	
	@Resource
	private com.kzhotel.service.IRoomService roomService = null;
	
	@Resource
	private com.kzhotel.service.ISpecialDayService specialDayService = null;
	
	@Resource private IRentPriceService rentPriceService = null;
	
	@Resource private ISourceGroupService sourcegroupService = null;
	
	@Resource private IChannelService channelService = null;
	
	@Resource private IRoleService roleService = null;
	
	@Resource private IRolePermisionService rolePermisionService = null;
	
	@Resource private IUserGroupService UserGroupService  = null;
	
	@Resource private IUsergroupRoleService usergroupRoleService = null;
	
	@Resource private IPermisionService permisionService = null;
	
	@Resource private com.kzhotel.service.IGuestService guestService = null;
	
	@Resource private com.kzhotel.service.IReceptionService receptionService = null;
	
	@Resource private com.kzhotel.service.ISystemParamService sysService = null;
	
	@Resource private com.kzhotel.service.IRentService rentService = null;
	
	@Resource private com.kzhotel.service.IPaymentService paymentService = null;
	
	@Resource private com.kzhotel.service.IRentPriceService rentpriceService = null;
	
	@Resource private com.kzhotel.dao.rentpriceMapper rentpriceDao =null;
	
	@Resource private com.kzhotel.service.IGoodscategoryService goodscategoryService = null;
	
	
	@Resource private com.kzhotel.service.IGoodsService goodsService = null;
	
	@Resource private com.kzhotel.service.IServicetypeService servicetypeService= null;
	
	@Resource private com.kzhotel.service.IServiceitemService sitemService =null;
	
	@Resource private com.kzhotel.service.IConsumeService consumeService = null;
	
	@Resource private com.kzhotel.service.IShiftService shiftService = null;
	
	@Resource private com.kzhotel.service.IWarehouseService warehouseService = null;
	
	@Resource private com.kzhotel.service.IReserveService reserveService =null;
	
	@Resource private net.kzhotel.service.IUsersService usersService = null;
	
	
	@Resource private net.kzhotel.service.IShopsService shopsService = null;
	
	
	@Resource private com.kzhotel.service.ILockService lockService = null;
	
	@Resource private com.kzhotel.service.IReportService reportService = null;
	
	@Resource private com.kzhotel.service.IAccountService accountService = null;
	
	@Resource
	private IBllWarehouse bllWarehouse;
	
//	@Before
//	public void before() {
//		ac = new ClassPathXmlApplicationContext("applicationConte俄xt.xml");
//		userService = (IUserService) ac.getBean("userService");
//	}

	@Test
	public void test1() {
		//pojouser user = userService.getUserById(1);
		// System.out.println(user.getUserName());
		
		
		//logger.info(JSON.toJSONString(userService.getUserById(1)));
		
		
		//logger.info(JSON.toJSONString(userService.login("test", "9db06bcff9248837f86d1a6bcf41c9e7")));
		
		
		//logger.info(JSON.toJSONString(userService.getUserCount(1,0,"")));

		
		
		 
		//logger.info(JSON.toJSONString( this.userService.Changepwd("111111","xxx","test")));
		
		//logger.info(JSON.toJSONString(userService.AddUser(1, "test2222255555", "111111", 1L)));
		
		
		//logger.info(JSON.toJSONString(userService.getUserCount(1, 0, "")));
		
		
		//logger.info(JSON.toJSONString(userService.listUserPage(0, 100,0, 1,0,"")));
		
		//logger.info(JSON.toJSONString(userService.selectAllAdmin("")));
		
		//logger.info(JSON.toJSONString(userService.updateUsergroupId(6, 2)));
		
		//logger.info(JSON.toJSONString(userService.hasPermision(1, "UsM")));
		
		//logger.info(JSON.toJSONString(userService.getUserByLoadKey("1255580674a2f99d63e59950c956bf97")));
		
		//logger.info(JSON.toJSONString(testService.getCount(null,null)));
		
		
		//logger.info(JSON.toJSONString(userTypeService.ShoAllUsertype()));
		//List<pojobuilding> buildinglist = testService.listByHotelId(1);
		//logger.info(JSON.toJSONString(buildinglist));
		
		//logger.info(testService.selectPasswordById(1));
		//int updateresult=testService.updatePassword("9db06bcff9248837f86d1a6bcf41c9e7","xxx",1);
		//logger.info(updateresult);
		
		//logger.info(intresult);
		//logger.info(JSON.toJSONString(testService.selectByUsername("ceshi")));
		//logger.info(JSON.toJSONString(testService.getUserCount(1, "", "")));
		
		//logger.info(floorDao.getfloorCount(1, "A"));
		//logger.info(JSON.toJSONString(floorDao.floorPageList(0, 1000,1, "A")));
		
		/*
		com.kzhotel.pojo.pojofloor floor=new com.kzhotel.pojo.pojofloor();
		floor.setCreator("test");
		floor.setFloorName("D5");
		floor.setHotelId((long)1);
		floor.setCreateTime(new Date());
		floorDao.insertSelective(floor);
		
		logger.info(JSON.toJSONString(floorDao.selectByFloorName("D1")));
		*/
		
		/*
		logger.info(JSON.toJSONString(roomtypeDao.getRoomTypeCount(1, "单")));
		logger.info(JSON.toJSONString(roomtypeDao.listRoomTypePage(0, 100,1, "单")));
		
		com.kzhotel.pojo.pojoroomtype roomtype=new com.kzhotel.pojo.pojoroomtype();
		roomtype.setBedNumber(10);
		roomtype.setCreator("test");
		roomtype.setHotelId((long)1);
		roomtype.setLateRoom(1);
		roomtype.setOverorderNumber(-1);
		roomtype.setRestRoom(1);
		roomtype.setRoomtypeName("海景房");
		
		roomtypeDao.insertSelective(roomtype);
		*/
		
		//logger.info(JSON.toJSONString(roomtypeDao.selectRoomTypeName("海景房")));
		
		
		/*
		com.kzhotel.pojo.pojoroom room =new com.kzhotel.pojo.pojoroom();
		room.setRoomCode("A00000002");
		room.setCreator("test");
		room.setDescription("xxxxxx");
		room.setFloorId((long)1);
		room.setHotelId((long)1);
		room.setRoomState(0);
		room.setRoomtypeId((long)1);
		logger.info(JSON.toJSONString(roomDao.insertSelective(room)));
		
		logger.info(JSON.toJSONString(roomDao.selectByRoomCode("A00000001")));
		
		
		logger.info(JSON.toJSONString(roomJoinDao.getRoomCount(1, 0, "B")));
		logger.info(JSON.toJSONString(roomJoinDao.listRoomPage(0, 100,1, 0, "B")));
		*/
		
		//logger.info(JSON.toJSONString(rentPlanDao.getRentPlanCount(1, "协")));
		//logger.info(JSON.toJSONString(rentPlanDao.listRentPlanPage(0, 1000, 1, "协")));
		
	
		/*
		logger.info(JSON.toJSONString(rentPlanDao.selectByRentPlanName(1,"协议aaaaaaaaaaaaaaaaaa5")));
		pojorentplan prentplan = new pojorentplan();
		prentplan.setCreator("test");
		prentplan.setHotelId((long)1);
		prentplan.setRentplanName("协议cccccc1");
		prentplan.setRemark("");
		logger.info(JSON.toJSONString(rentPlanDao.insertSelective(prentplan)));
		*/
		
		
		/*
		com.kzhotel.pojo.pojouser user=new com.kzhotel.pojo.pojouser();
		user.setState((byte)0);
		user.setCreateTime(new Date());
		user.setHotelId((long)1);
		user.setPassword("");
		user.setLastVisit(new Date());
		user.setFailNum(0);
		user.setUsername("test2");
		logger.info(userDao.insertSelective(user));
		*/
		
		/*
		logger.info(JSON.toJSONString(specialdayDao.getSpecialDayCount(1, "")));
		logger.info(JSON.toJSONString(specialdayDao.listSpecialDayPage(0,1000,1, "")));
		logger.info(JSON.toJSONString(specialdayDao.selectBySpecialDayName(1, "八一节")));
		
		specialdayDao.editWeekEndStart(1,1);
		specialdayDao.editWeekEndEnd(1,1);
		*/
		
		/*
		com.kzhotel.pojo.pojoroomtype roomtype=new com.kzhotel.pojo.pojoroomtype();
		roomtype.setBedNumber(10);
		roomtype.setCreator("test");
		roomtype.setHotelId((long)1);
		roomtype.setLateRoom(1);
		roomtype.setOverorderNumber(-1);
		roomtype.setRestRoom(1);
		roomtype.setRoomtypeName("海景房3");
		*/

		
		//logger.info(JSON.toJSONString(rentPlanService.AddRentPlan("协议cccccc88", (long)1, "test", "")));
		
		
		//logger.info(JSON.toJSONString(floorService.AddFloor("Adong01floor3", (long)1, "test")));
		//logger.info(JSON.toJSONString(floorService.EditFloor(14L,"Adong01floor3000", (long)1, "test")));
		
		
		//logger.info(JSON.toJSONString(rentPlanService.AddRentPlan("tttttt11111", (long)1,1, "test", "")));
		
		//logger.info(JSON.toJSONString(rentPlanService.EditRentPlan(82L,"tttttt11211", (long)1,1, "test", "")));
		
		//logger.info(JSON.toJSONString(rentPlanService.DelRentPlan(1)));
		
		//logger.info(JSON.toJSONString(roomService.AddRoom("F109", 5L, 4L, "xxxxxx01",1L,"test", "描述", 1L)));
		
		//logger.info(JSON.toJSONString(roomService.EditRoom(28L,"F109xxxxxx", 5L, 4L, "xxxxxx02",1L,"test2","描述xxxxxxxx", 1L)));
		
		//logger.info(JSON.toJSONString(roomService.DelRoomById(26L)));
		
		//logger.info(JSON.toJSONString(roomService.selectRoomList(1, "",1,1,"3")));
		
		//logger.info(JSON.toJSONString(roomService.selectRoomList(1, "",1,1,"03")));
		
		//logger.info(JSON.toJSONString(roomService.updateRoomState(1, 25, 2)));
		
		//logger.info(JSON.toJSONString(roomService.updateRoomUnitedState(1, 25, 2)));
		
		//logger.info(JSON.toJSONString(roomService.getRoomCount(1, 1,1, "")));
		//logger.info(JSON.toJSONString(roomService.listRoomPage(0, 10, 1, 2,0, "")));
		
		//logger.info(JSON.toJSONString(roomService.DelRoomById(25L)));
		
		//logger.info(JSON.toJSONString(roomService.selectLivingReception(1)));
		
		//logger.info(JSON.toJSONString(roomService.selectLivingGuest(1)));



		//logger.info(JSON.toJSONString(roomService.selectExpectedLeaveGuest(1, new Date())));
		
		
		
		//logger.info(JSON.toJSONString(roomService.selectCheckinGuest(1, new Date())));
		
		//logger.info(JSON.toJSONString(floorService.floorPageList(0, 1000, 1, "")));
		
		
		//logger.info(JSON.toJSONString(roomService.selectReceptionIdList(1, "123")));
	
		
		
		//logger.info(JSON.toJSONString(roomtypeService.AddRoomType(1L,"xxxhaohua9", 3, 100,  "","path",1, 1,1L, "test")));
		
		//logger.info(JSON.toJSONString(roomtypeService.EditRoomType(11L,1L,"xxxxxxxxxxxx", 0, 101,  "","path33333333", 0, 1,1L, "test")));
		
		//logger.info(JSON.toJSONString(roomtypeService.getRoomTypeById(1)));
		
		//logger.info(JSON.toJSONString(roomtypeService.DelRoomType(5)));
		
		//logger.info(JSON.toJSONString(roomtypeService.listRoomTypePage(0, 999999, 1, "")));
		
		SimpleDateFormat sdf = new SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" );
		
		Date start = null;
		Date end = null;
		try {
			start = sdf.parse("2016-10-01 01:01:01");
			end = sdf.parse("2016-10-10 01:01:01");
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		//logger.info(JSON.toJSONString(specialDayService.AddSpecialDay("shiyi2012",start,end , 1L, "test")));
		//logger.info(JSON.toJSONString(specialDayService.EditSpecialDay(20L,"shiyi2016",start,end , 1L)));
		
		//logger.info(JSON.toJSONString(rentPriceService.getRentPriceCount(1, 33, 1, 0, 0)));
		//logger.info(JSON.toJSONString(rentPriceService.listRentPricePage(0, 1000 , 1, 33, 1, 0, 0)));
		
		//logger.info(JSON.toJSONString(rentPriceService.AddRentPrice(8L, 1, 1, 80L, 10000,1L, 1L, "test", "")));
		
		//logger.info(JSON.toJSONString(rentPriceService.EditRentPrice(42L,8L, 1, 1, 80L, 10001, 1L, "test", "")));
		
		
		//logger.info(JSON.toJSONString(rentPriceService.getRentPriceCountByRoomTypeId(1, 1)));
		//logger.info(JSON.toJSONString(rentPriceService.listRentPriceByRoomTypeId(0, 10, 1, 1)));
		
		//logger.info(JSON.toJSONString(rentPriceService.listRentpriceByRoomTypeId(1, 1)));
		//logger.info(JSON.toJSONString(rentPriceService.listRentpriceByRentplanId(1, 1)));
		//logger.info(JSON.toJSONString(rentPriceService.listExistsRentplanByRoomtypeId(1, 1, 1)));
		//logger.info(JSON.toJSONString(rentPriceService.listExistsRoomtypeByRentplanId(1, 1, 1)));
		
		//logger.info(JSON.toJSONString(rentPriceService.isWeekEnd(1, new Date())));
		
		//logger.info(JSON.toJSONString(sourcegroupService.AddSourceGroup(1L, "wyx", 100, "test")));
		//logger.info(JSON.toJSONString(sourcegroupService.EditSourceGroup(21L,1L, "团队组三sdfdsfsdfdfds", 0)));
		
		//logger.info(JSON.toJSONString(sourcegroupService.getSourceGroupCount(1, "")));
		//logger.info(JSON.toJSONString(sourcegroupService.listSourceGroupPage(0, 0, 1, "")));
		
		//logger.info(JSON.toJSONString(channelService.AddChannel(1L, "机场啊啊啊aaadsfsdf", "王先生", "139999999999", "021-11111111", "kkk@sina.com", "jichang001", "jianhang",1L, "test",1L, "test", "",1, 1, 20000,20000,1L, 1L, 1)));
		
		//logger.info(JSON.toJSONString(channelService.EditChannel(31L,1L, "xxx机场2200dfdsggdfgdfgfd", "王先生", "139999999999", "021-11111111", "kkk@sina.com", "jichang001", "jianhang", 1L,"test",1L, "test", "", 1, 20000,20000, 1L,1L, 1)));
		
		//logger.info(JSON.toJSONString(channelService.getChannelCount(1, "",0,2)));
		
		//logger.info(JSON.toJSONString(channelService.listChannelPage(0, 9999, 1, "",0,2)));
		
		//logger.info(JSON.toJSONString(channelService.selectBySourceGroupId(1, 3)));
		
		//logger.info(JSON.toJSONString(channelService.getBalanceByChanelId(27)));
		//logger.info(JSON.toJSONString(channelService.changeBalanceByChanelId(27, 5000)));
		
		//logger.info(JSON.toJSONString(userService.validateUserType(1, 1, "hotel_main")));
		
		
		List<Integer> listti=new ArrayList<Integer>();
		listti.add(1);
		listti.add(2);
		listti.add(3);
		//logger.info(JSON.toJSONString(rentPriceService.getRoomPrice(1, 1, listti, 1, 1)));
		Date start1 = null;
		Date stop1 = null;
		try {
			start1 = sdf.parse("2016-10-27 17:49:55");
			stop1 = sdf.parse("2016-11-03 17:49:58");
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//logger.info(JSON.toJSONString(rentPriceService.getRoomPriceListByPeriod(1,  4, 1, 1,start1, stop1)));
		//logger.info(JSON.toJSONString(rentPriceService.getPrice(1, 1, 1, 1, 10)));
		
		
		List<rentprice> listrp1 = new ArrayList<rentprice>();
		//rentprice prp1=rentPriceService.getRentPriceById(42);
		//prp1.setPrice(10007);
		//listrp1.add(prp1);
		rentprice prp2=new rentprice();
		prp2.setCheckinType(2);
		prp2.setTimeinterval(1);
		prp2.setCreateTime(new Date());
		prp2.setCreateUsername("test");
		prp2.setHotelId((long)1);
		prp2.setPrice(588);
		prp2.setRemark("");
		prp2.setRentplanId((long)2);
		prp2.setRoomtypeId((long)6);
		listrp1.add(prp2);
		//rentPriceService.editRentPriceBatch(listrp1);
		
		
		//logger.info(JSON.toJSONString(rentPriceService.listRentPriceByRoomTypeId(1, 1)));
		
		/*事务*/
		List<com.kzhotel.pojo.roomtype> testlist =new ArrayList<com.kzhotel.pojo.roomtype>();
		com.kzhotel.pojo.roomtype rt1=new com.kzhotel.pojo.roomtype();
		rt1.setRoomtypeName("单人间2");
		rt1.setCreateTime(new Date());
		rt1.setCreateUsername("test");
		rt1.setHotelId((long)1);
		rt1.setPhoto("path33333333");
		rt1.setLateRoom(1);
		rt1.setLateRoom(1);
		rt1.setOverorderNumber(0);

		com.kzhotel.pojo.roomtype rt2=new com.kzhotel.pojo.roomtype();
		rt2.setRoomtypeName("单人间");
		rt2.setCreateTime(new Date());
		rt2.setCreateUsername("test");
		rt2.setHotelId((long)1);
		rt2.setPhoto("path33333333");
		rt2.setLateRoom(1);
		rt2.setLateRoom(1);
		rt2.setOverorderNumber(0);
		testlist.add(rt1);testlist.add(rt2);
		//roomtypeService.insertbatch(testlist);
		
		
		Date	sometime1=null,
				sometime2 =null,
				sometime3=null,
						sometime4=null
		;
		try {
			sometime1 = sdf.parse("2015-10-02 01:01:01");
			sometime2 = sdf.parse("2015-10-02 01:01:01");
			sometime3 = sdf.parse("2016-10-12 01:01:01");
			sometime4 = sdf.parse("2016-12-01 00:00:00");
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//logger.info(JSON.toJSONString(specialDayService.isSpecialDay(1, sometime2)));
		//logger.info(JSON.toJSONString(rentPriceService.isWeekEnd(1, sometime3)));
		
		
		/*
		List listrp =new ArrayList();
		com.kzhotel.pojo.pojorentprice  rp1=new com.kzhotel.pojo.pojorentprice();
		rp1.setCheckinType(2);
		rp1.setTimeinterval(1);
		rp1.setCreateTime(new Date());
		rp1.setCreator("test");
		rp1.setHotelId((long)1);
		rp1.setPrice(288);
		rp1.setRemark("");
		rp1.setRentplanId((long)1);
		rp1.setRoomtypeId((long)1);
		listrp.add(rp1);
		rentPriceService.insertbatch(listrp);
		*/
		
		//logger.info(JSON.toJSONString(roleService.AddRole("报表角色组", "报表角色组", 1,1, "test")));
		
		//logger.info(JSON.toJSONString(roleService.EditRole(13,"报表角色组1xxx", "报表角色组1",1,1)));
		//logger.info(JSON.toJSONString(roleService.listAll()));
		
		//logger.info(JSON.toJSONString(roleService.listAllRoletype()));
		//logger.info(JSON.toJSONString(roleService.listRoleByTypeId(1)));
		
		//logger.info(JSON.toJSONString(rolePermisionService.AddRolePermision(1, 7, 1L, "test")));
		
		
		//logger.info(JSON.toJSONString(rolePermisionService.listByRoleId(1, 1)));
		
		
		
		List<com.kzhotel.pojo.rolepermision> listrp =new ArrayList<com.kzhotel.pojo.rolepermision>(); 
		com.kzhotel.pojo.rolepermision rp1=new com.kzhotel.pojo.rolepermision();
		com.kzhotel.pojo.rolepermision rp2=new com.kzhotel.pojo.rolepermision();
		//rp.setCreateTime(new Date());
		rp1.setCreator("test");
		rp1.setHotelId(1L);
		rp1.setPermisionId(16L);
		rp1.setRoleId(2L);
		rp2.setCreator("test");
		rp2.setHotelId(1L);
		rp2.setPermisionId(1L);
		rp2.setRoleId(2L);
		//rp2.
		listrp.add(rp1);
		listrp.add(rp2);
		//logger.info(JSON.toJSONString(rolePermisionService.insertBatch(listrp)));
		/*
		List<Integer> rpids=new ArrayList();
		rpids.add(10);
		rpids.add(11);
		rpids.add(12);
		logger.info(JSON.toJSONString(rolePermisionService.removeBatch(rpids)));
		*/
		
		//logger.info(JSON.toJSONString(UserGroupService.AddUsergroup("仓库管理员4", "仓库管理员4", 1L, "test")));
		//logger.info(JSON.toJSONString(UserGroupService.EditUsergroup(2, "仓库管理员3", "仓库管理员3", 1L)));
		//logger.info(JSON.toJSONString(UserGroupService.listByHotelId(1)));
		//logger.info(JSON.toJSONString(UserGroupService.DelUsergroup(7)));
		
		
		//logger.info(JSON.toJSONString(usergroupRoleService.AddUsergroupRole(1L, 4L, 1L, "test")));
		
		//logger.info(JSON.toJSONString(usergroupRoleService.listByUsergroupId(1, 1)));
		
		//logger.info(JSON.toJSONString(usergroupRoleService.DelUsergroupRole(7)));
		
		//logger.info(JSON.toJSONString(usergroupRoleService.deleteByRoleIdAndUsergroupId(3, 6)));
	
		
		
		List list =new ArrayList();
		com.kzhotel.pojo.usergrouprole ugr1=new com.kzhotel.pojo.usergrouprole();
		ugr1.setCreator("test");
		ugr1.setHotelId(1L);
		ugr1.setUsergroupId(8L);
		ugr1.setRoleId(10L);
		list.add(ugr1);
		
		com.kzhotel.pojo.usergrouprole ugr2=new com.kzhotel.pojo.usergrouprole();
		ugr2.setCreator("test");
		ugr2.setHotelId(1L);
		ugr2.setUsergroupId(8L);
		ugr2.setRoleId(9L);
		list.add(ugr2);
		
		com.kzhotel.pojo.usergrouprole ugr3=new com.kzhotel.pojo.usergrouprole();
		ugr3.setCreator("test");
		ugr3.setHotelId(1L);
		ugr3.setUsergroupId(8L);
		ugr3.setRoleId(8L);
		list.add(ugr3);
		
		//logger.info(JSON.toJSONString(usergroupRoleService.insertBatch(list)));
		
		
		
		
		
		
		
		List<Integer> ugrids= new ArrayList();
		ugrids.add(3);
		ugrids.add(4);
		//logger.info(JSON.toJSONString(usergroupRoleService.removeBatch(ugrids)));
		
		
		
		
		//logger.info(JSON.toJSONString(permisionService.AddPermision("报表6", "baobiao", "", 100)));
		//logger.info(JSON.toJSONString(permisionService.EditPermision(29L, "报表6xxxxx", "baobiao6xxxx", "", 101)));
		//logger.info(JSON.toJSONString(permisionService.listAll()));
		
		
		//logger.info(JSON.toJSONString(permisionService.listByParentId(1)));
		
		//logger.info(JSON.toJSONString(guestDao.searchByGuestName("e")));
		
		/*
		logger.info(JSON.toJSONString(guestService.AddGuest("xxxxxxyyyyy", "xxxx", "yyyyy", "159555555555", 1, "abc@11.com", "beijing", 1L, "66666666", 
				
				"回",

				sometime3,

			    sometime3,

			    "String issuedOffice",

			    sometime3,

			    "String photo",
			    
				1L, 
				"test")));
		
		
		logger.info(JSON.toJSONString(guestService.EditGuest(3893L,"xxxxxx1yyyyy1", "xxxx1", "yyyyy1", "159555555551", 2, "abc2@22.com", "beijing2", 1L, "666666662", 
				
				"回",

				sometime3,

			    sometime3,

			    "String issuedOffice",

			    sometime3,

			    "String photo",
			    
				1L)));
				
		*/
		
		//logger.info(guestService.DelGuestById(3862));
		
		//logger.info(JSON.toJSONString(guestService.AddLivingguest(1, 3L, 1L, 1L, "A103", 1L, "test")));
		//logger.info(JSON.toJSONString(guestService.EditLivingguest(74L,0, 3L, 1L, 1L, "A103xxxx", 1L)));
		
		//logger.info(JSON.toJSONString(guestService.listGuestByReceptionId(1, 1)));
		
		//logger.info(JSON.toJSONString(guestService.getGuestCount("", "")));
		//logger.info(JSON.toJSONString(guestService.listGuestPage(0, 1000, "", "")));
		
		//logger.info(JSON.toJSONString(guestService.selectLivingGuest(1)));
		//logger.info(JSON.toJSONString(guestService.selectCheckinGuest(1)));
		
		//logger.info(JSON.toJSONString(guestService.selectExpectedLeaveGuest(1)));
		//logger.info(JSON.toJSONString(guestService.selectCheckoutGuest(1)));
		//logger.info(JSON.toJSONString(guestService.listHistoryGuest(1,"",null,sometime4)));
		//logger.info(JSON.toJSONString(guestService.selectLowBalanceReception(1)));
		
		
		
		//logger.info(JSON.toJSONString(receptionService.getReceptionById(97)));
		
		//logger.info(JSON.toJSONString(receptionService.cancelRentReception(1)));
		
		
				
		List<Integer> rentids=new ArrayList<Integer>();
		rentids.add(93);
		rentids.add(94);
		
		//logger.info(JSON.toJSONString(receptionService.splitRentReception(1, rentids, 93)));
		
		
		List<payment> extendpaymentlist = new ArrayList<payment>();
		payment extendpayment1 = new payment(); 
		payment extendpayment2 = new payment(); 
		
		extendpayment1.setPaymethodCode(1);
		extendpayment1.setAmount(1000);
		
		extendpayment2.setPaymethodCode(2);
		extendpayment2.setAmount(2000);
		extendpaymentlist.add(extendpayment1);
		extendpaymentlist.add(extendpayment2);
		//logger.info(JSON.toJSONString(receptionService.extendRent(91, sometime4, extendpaymentlist, "test")));
		
		
		
		//logger.info(JSON.toJSONString(receptionService.checkoutRentReception(1L, 130, "test", extendpaymentlist)));
		
		
		/*
		logger.info(sysService.getCertificateTypeJson());
		logger.info(sysService.getCertificateTypeDefault());
		logger.info(sysService.getPaymethodJson());
		logger.info(sysService.getPaymethodDefault());
		*/
		//logger.info(sysService.getServerPath());
		
		
		//logger.info(sysService.setWeekEnd(1, "3456"));
		//logger.info(sysService.getWeekEnd(1));
		
		//logger.info(JSON.toJSONString(sysService.getConfigByHotelId(1)));
		
		//logger.info(sysService.EditConfig(1L, null, null, null, null, null, null, null, null,null, "345",(float)0.5,(float)0.5,"天","式","晚"));
		
		//logger.info(JSON.toJSONString(rentService.AddRent(1L, 1L, "A103", 1L, 1, new Date(), new Date(), "test")));
		
		//logger.info(JSON.toJSONString(rentService.listRentByReceptionId(110, "")));
		
		//logger.info(JSON.toJSONString(rentService.changeRoom(290L, 8L,1,1L,"test")));
		
		//logger.info(JSON.toJSONString(rentService.exitRoom(205L,1L,"test")));
		
		//logger.info(JSON.toJSONString(rentService.selectLivingRentGuest(1, false, "", "")));
				
		//logger.info(JSON.toJSONString(paymentService.AddPayment(1L, 2, 2000, 1L, "test", 1, 1L, "20160005", 1L,"testxxxxxx")));
		
		//logger.info(JSON.toJSONString(paymentService.getPaymentById(98)));
		
		//logger.info(JSON.toJSONString(paymentService.listPaymentByBillId(3, 72)));
		
		List recepitionids =new ArrayList<Integer>();
		recepitionids.add(93);
		
		//logger.info(JSON.toJSONString(receptionService.selectByReceptionIdList(recepitionids)));
		
		
		
		
		
		List<rent> rentList = new ArrayList<rent>();
		rent prent1 =new rent();
		//prent1.setCreateUsername("test");
		prent1.setCheckinType(1);
		prent1.setExpectedLeaveTime(LocalDateTime.now());
		prent1.setRoomId(5L);
		prent1.setRoomCode("A105");
		prent1.setRoomtypeId(1L);
		prent1.setRoomtypeName("hhhhh间");
		prent1.setExpectedStayNumber(1.0);
		//prent1.setReserveDetailId(58L);
		
		rent prent2 =new rent();
		//prent2.setCreateUsername("test");
		prent2.setCheckinType(2);
		prent2.setExpectedLeaveTime(LocalDateTime.now());
		prent2.setRoomId(6L);
		prent2.setRoomCode("A106");
		prent2.setRoomtypeId(1L);
		prent2.setRoomtypeName("hhhhh间");
		prent2.setExpectedStayNumber(3.0);
		prent2.setReserveDetailId(59L);
		
		rentList.add(prent1);
		rentList.add(prent2);
		
		List<payment> paymentlist = new ArrayList<payment>();
		payment ppayment1 = new payment(); 
		payment ppayment2 = new payment(); 
		
		ppayment1.setPaymethodCode(1);
		ppayment1.setPaymethodName("现金");
		ppayment1.setAmount(1000);
		
		ppayment2.setPaymethodCode(7);
		ppayment2.setPaymethodName("签单");
		ppayment2.setAmount(2000);
		ppayment2.setCreditChannelId(23L);//单位的channelId
		paymentlist.add(ppayment1);
		paymentlist.add(ppayment2);
		
		List<ReceptionGuest> livingguestList= new ArrayList<ReceptionGuest>();
		ReceptionGuest guest1 = new ReceptionGuest();
		ReceptionGuest guest2 = new ReceptionGuest();
		ReceptionGuest guest3 = new ReceptionGuest();
		ReceptionGuest guest4 = new ReceptionGuest();
		
		guest1.setGuestName("A105guestprimary");

		guest1.setPhone("1333333333");

		guest1.setIdentityCardNumber("64654545456546465");

		guest1.setRoomId(5L);
		guest1.setRoomCode("A105");
		
		guest2.setGuestName("A105guest2");

		guest2.setPhone("1333333333");
		guest2.setEmail("sdfsdfsdfs@sdfdsfd.sdfsdf");

		guest2.setIdentityCardNumber("64654545456546465");
		
		guest2.setRoomId(5L);
		guest2.setRoomCode("A105");
		
		guest3.setGuestName("A106guest1");
		guest3.setPhone("1333333333");
		guest3.setEmail("sdfs@sdfdsfd.sdfsdf");
		guest3.setIdentityCardNumber("64655465465465");
		guest3.setRoomId(6L);
		guest3.setRoomCode("A106");
		
		guest4.setGuestName("A106guest2");
		guest4.setPhone("1333333333");
		guest4.setEmail("sdfs@sdfdsfd.sdfsdf");
		guest4.setIdentityCardNumber("64655465465465");
		guest4.setRoomId(6L);
		guest4.setRoomCode("A106");
		livingguestList.add(guest1);
		livingguestList.add(guest2);
		livingguestList.add(guest3);
		livingguestList.add(guest4);
		
		

		
		
		
		
		//logger.info(JSON.toJSONString(rentpriceDao.listRentpriceByRoomTypeId(1, 1)));
		//logger.info(JSON.toJSONString(rentpriceDao.listRentpriceByRentplanId(1, 1)));s
		//logger.info(JSON.toJSONString(rentpriceDao.listExistsRentplanByRoomtypeId(1, 1, 0)));
		//logger.info(JSON.toJSONString(rentpriceDao.listExistsRoomtypeByRentplanId(1, 1, 0)));
		
		
		//logger.info(JSON.toJSONString(goodscategoryService.AddGoodscategory("茶水uuuuu",  100,1, 1L,"test")));
		//logger.info(JSON.toJSONString(goodscategoryService.EditGoodscategory(20L, "茶水xxxxx",1,  101, 1L)));
		
		//logger.info(JSON.toJSONString(goodscategoryService.getGoodscategoryCount(1, "",0)));
		
		//logger.info(JSON.toJSONString(goodscategoryService.listGoodscategoryPage(0, 1000, 1, "",0)));
		
		//logger.info(JSON.toJSONString(goodscategoryService.DelGoodscategory(20)));
		
		//logger.info(JSON.toJSONString(goodsService.getGoodsCount(1, "茶", 1,0,1)));
		//logger.info(JSON.toJSONString(goodsService.listGoodsPage(0, 10000, 1, "", 1,1)));
		
		//logger.info(JSON.toJSONString(goodsService.AddGoods("yyydfdsfsd", "sdfdsf", 1L, "ping", 10001, 1,1,1,"", 1L, "dsfdsfd",1L,"test")));
		//logger.info(JSON.toJSONString(goodsService.EditGoods(34L,"dddxxxdfdsfsdxxxx", "sdfdsf", 1L,"ping", 10001, 1,1,1, "", 1L,"",1L,"dsfdsfd")));
		
		
		
		//logger.info(JSON.toJSONString(servicetypeService.AddServicetype("房费", 100, 1L, "test")));
		//logger.info(JSON.toJSONString(servicetypeService.EditServicetype(26L, "房费sdfdsfds", 1001, 1L)));
		//logger.info(JSON.toJSONString(servicetypeService.getServicetypeCount(1, "")));
		//logger.info(JSON.toJSONString(servicetypeService.listServicetypePage(0, 9999, 1, null)));
		//logger.info(JSON.toJSONString(servicetypeService.DelServicetypeById(15)));
		
		//logger.info(JSON.toJSONString(sitemService.AddServiceitem(1L, "zzzyyy房务打扫xxxx", 200, 100, "房务打扫", 1L, "test")));
		//logger.info(JSON.toJSONString(sitemService.EditServiceitem(26L, 1L, "tttyyyyyy房务打扫xxxx", 200, 100, "房务打扫", 1L)));
		//logger.info(JSON.toJSONString(sitemService.getServiceitemCount(1, "", 1)));
		
		
		//logger.info(JSON.toJSONString(sitemService.listServiceitemPage(0, 9999, 4, "", 1)));
		
		
		List<consumeitem> rentconsumelist = new ArrayList<consumeitem>();
		consumeitem rentconsume1= new consumeitem();
		rentconsume1.setFeeItemCode("绿茶");
		rentconsume1.setFeeItemType(2);/*2商品，3服务*/
		rentconsume1.setFeeItemId(7L);
		rentconsume1.setNumber(10.0);
		rentconsume1.setSalePrice(10);
		rentconsume1.setAmount(100);
		rentconsume1.setUnitName("瓶");
		rentconsumelist.add(rentconsume1);
		
		consumeitem rentconsume2 = new consumeitem();
		rentconsume2.setFeeItemCode("红茶");
		rentconsume2.setFeeItemType(2);/*2商品，3服务*/
		rentconsume2.setFeeItemId(9L);
		rentconsume2.setNumber(10.0);
		rentconsume2.setSalePrice(10);
		rentconsume2.setAmount(100);
		rentconsume2.setUnitName("瓶");
		rentconsumelist.add(rentconsume2);
		
		List<payment> rentpaymentlist = new ArrayList<payment>();
		payment rentpayment1 = new payment(); 
		payment rentpayment2 = new payment(); 
		
		rentpayment1.setCreditChannelId(1L);
		rentpayment1.setPaymethodCode(1);
		rentpayment1.setPaymethodName("现金");
		rentpayment1.setAmount(1000);
		
		rentpayment2.setPaymethodCode(7);
		rentpayment2.setPaymethodName("客主储值");  //签单
		rentpayment2.setMemberPhone("1777777777777");
		//rentpayment2.setCreditChannelId(23L);
		rentpayment2.setAmount(2000);
		
		
		rentpaymentlist.add(rentpayment1);
		rentpaymentlist.add(rentpayment2);
		
		//logger.info(JSON.toJSONString(receptionService.AddConsume(195L,0L, rentconsumelist, 0,rentpaymentlist, "test", 215L, 1L, "A101", 1L,1L, "test")));
	
		//logger.info(JSON.toJSONString(consumeService.listConsumedetailByReceptionId(89, "3")));
		
		//logger.info(JSON.toJSONString(shiftService.getAutoCode(1)));
				
		//logger.info(JSON.toJSONString(shiftService.createShift("test10", 1L, 100, 100, 100, 100, 101,"测试")));
		
		//logger.info(JSON.toJSONString(shiftService.createSuccession("test10", 1L, "测试接班", 0,0)));
					
		//logger.info(JSON.toJSONString(shiftService.listShift(1, 1)));
		
		//logger.info(JSON.toJSONString(shiftService.getActiveSuccession(1, "test10")));
		
		//logger.info(JSON.toJSONString(shiftService.getPaymentAmount("test", 1, sometime1, sometime4)));
		
		//logger.info(JSON.toJSONString(shiftService.AddPasscash("test7", 7001, "上缴1100", 1, 11L, 1L)));
		
		//logger.info(JSON.toJSONString(shiftService.AuditPasscash(5L, "admin", 2)));
		
		//logger.info(JSON.toJSONString(shiftService.getPasscashAmount(10, 0,0)));
		
		//logger.info(JSON.toJSONString(shiftService.getPasscashCount(1,0, 1, 1)));
		
		//logger.info(JSON.toJSONString(shiftService.listPasscashPage(1, 0, 1, 1, 0, 1000)));
		
		//logger.info(JSON.toJSONString(shiftService.getMoneyAmountBySuccessionUser(1, "test", 0)));
		
		//logger.info(JSON.toJSONString(shiftService.getReceptionCountBySuccessionId(1, 10)));
		//logger.info(JSON.toJSONString(shiftService.listReceptionPageBySuccessionId(1, 10, 0, 1000)));
		
		//logger.info(JSON.toJSONString(warehouseService.AddWarehouse("sdfdsf", 1L, 1L, "test", 101, "测试")));
				
		//logger.info(JSON.toJSONString(warehouseService.EditWarehouse(23L, "xxxxx", 1L, 2L, "test2", 102, "xxxx")));
		List<goodsindetail> goodsindetailList = new ArrayList<goodsindetail>();
		goodsindetail goodsindetailel1= new goodsindetail();
		goodsindetailel1.setGoodsId(1L);
		goodsindetailel1.setGoodsItemCode("测试商品");
		goodsindetailel1.setGoodsCategoryId(9L);
		goodsindetailel1.setGoodsCategoryName("测试分类");
		goodsindetailel1.setSupplierId(99L);
		goodsindetailel1.setSupplierName("测试供应商");
		goodsindetailel1.setUnitName("瓶");
		goodsindetailel1.setNumber(100);
		goodsindetailel1.setPurchasePrice(20000);
		
		
		goodsindetail goodsindetailel2= new goodsindetail();
		goodsindetailel2.setGoodsId(7L);
		goodsindetailel2.setGoodsItemCode("测试商品");
		goodsindetailel2.setGoodsCategoryId(9L);
		goodsindetailel2.setGoodsCategoryName("测试分类");
		goodsindetailel2.setSupplierId(99L);
		goodsindetailel2.setSupplierName("测试供应商");
		goodsindetailel2.setUnitName("瓶");
		goodsindetailel2.setNumber(100);
		goodsindetailel2.setPurchasePrice(20000);
		
		goodsindetailList.add(goodsindetailel1);goodsindetailList.add(goodsindetailel2);
		
		//logger.info(JSON.toJSONString(warehouseService.AddGoodsin(1L, 111L, "test", 1L, "test",goodsindetailList)));
		
		List<goodsoutdetail> goodsoutdetailList = new ArrayList<goodsoutdetail>();
		goodsoutdetail goodsoutdetail1= new goodsoutdetail();
		goodsoutdetail1.setGoodsId(1L);
		goodsoutdetail1.setGoodsItemCode("测试商品");
		goodsoutdetail1.setUnitName("瓶");
		goodsoutdetail1.setNumber(100);
		goodsoutdetail1.setGoodsCategoryId(9L);
		goodsoutdetail1.setGoodsCategoryName("测试分类");
		goodsoutdetail1.setPurchasePrice(20000);
		
		goodsoutdetail goodsoutdetail2= new goodsoutdetail();
		goodsoutdetail2.setGoodsId(7L);
		goodsoutdetail2.setGoodsItemCode("测试商品");
		goodsoutdetail2.setUnitName("瓶");
		goodsoutdetail2.setNumber(100);
		goodsoutdetail2.setGoodsCategoryId(9L);
		goodsoutdetail2.setGoodsCategoryName("测试分类");
		goodsoutdetail2.setPurchasePrice(20000);
		
		goodsoutdetailList.add(goodsoutdetail1);goodsoutdetailList.add(goodsoutdetail2);
		//logger.info(JSON.toJSONString(warehouseService.AddGoodsout(1L, 111L, "test", 1L,"test", goodsoutdetailList,1,"xx/xxx")));
		
		
		//logger.info(JSON.toJSONString(warehouseService.getGoodsoutCount(1L, null, null)));
		//logger.info(JSON.toJSONString(warehouseService.getGoodsoutList(0,999999,1L, null, null)));
		
	

		
		//logger.info(JSON.toJSONString(roomService.selectLivingRoom(1)));
		
		//logger.info(JSON.toJSONString(receptionService.selectActiveReception(1,2)));
		
		//logger.info(JSON.toJSONString(guestService.getGuestLivingCount(1)));
		
		//logger.info(JSON.toJSONString(guestService.listGuestLivingPage(1, 0, 9999)));
		
		List<reservedetail> reservedetailList = new ArrayList<reservedetail>();
		reservedetail reservedetail1 =new reservedetail();
		reservedetail1.setRoomtypeId(1L);
		reservedetail1.setRoomNumber(2);
		reservedetail1.setChannelId(1L);
		reservedetail1.setSourceGroupId(1L);
		reservedetail1.setCheckinType(1);
		//reservedetail1.setExpectedEnterTime(sometime4);
		reservedetail1.setExpectedStayNumber(7);
		reservedetail1.setExpectedRentAmount(2001);
		reservedetail1.setReservePerson("客人1130-1");
		reservedetail1.setReserveMobile("133333333331");
		
		reservedetail reservedetail2 =new reservedetail();
		reservedetail2.setRoomtypeId(2L);
		reservedetail2.setRoomNumber(2);
		reservedetail2.setChannelId(1L);
		reservedetail2.setSourceGroupId(1L);
		reservedetail2.setCheckinType(1);
		//reservedetail2.setExpectedEnterTime(sometime4);
		reservedetail2.setExpectedStayNumber(5);
		reservedetail2.setExpectedRentAmount(2002);
		reservedetail2.setReservePerson("客人1130-2");
		reservedetail2.setReserveMobile("133333333332");
		
		reservedetailList.add(reservedetail1);reservedetailList.add(reservedetail2);
		
		
		
		//logger.info(JSON.toJSONString(reserveService.createReserve(1L, 1L,111L,"18888888888","wxy", reservedetailList,2,rentpaymentlist,"rrrrrrr",1L,"test")));
		//logger.info(JSON.toJSONString(reserveService.paySuccessForReserve(86l, "ttt3", rentpaymentlist)));
		//logger.info(JSON.toJSONString(reserveService.cancelReserve(87l)));
		
		List<Integer> payStateList1 = new ArrayList<Integer>();
		payStateList1.add(1);payStateList1.add(2);payStateList1.add(3);payStateList1.add(4);
		//logger.info(JSON.toJSONString(reserveService.getMobileReserveCount(111l, payStateList1)));
		//logger.info(JSON.toJSONString(reserveService.getMobileReserveList(0, 999999, 111l, payStateList1)));
		
		//logger.info(JSON.toJSONString(reserveService.getReservedetailCount(1, "1234", "", "",null,null)));
		
		//logger.info(JSON.toJSONString(reserveService.listReservedetailPage(1, "1234", "", "",null,null, 0, 999999)));
		
		
		
		//logger.info(JSON.toJSONString(reserveService.changeReserveState(9L, 3)));
		
		//logger.info(JSON.toJSONString(reserveService.editReservedetail(9L, 11L, 11L, 11L, 3001, sometime4, 9, 2, 2, "guest1", "1355555551", 2L, "test2")));
		
		//logger.info(JSON.toJSONString(reserveService.reserveSituation(1L,new Date(), 14)));
		
		
		//logger.info(JSON.toJSONString(reserveService.getReserveSituationByRoomtypeId(1L, 8L, sometime4, 20)));
		
		//logger.info(JSON.toJSONString(reserveService.getReservedetailCountByReserveUserId( 111, null, null)));
		//logger.info(JSON.toJSONString(reserveService.listReservedetailPageByReserveUserId( 111, null, null, 0, 9999)));
		
		//logger.info(JSON.toJSONString(roomService.selectLivingRoomGuest(1, "", null, 0, 0)));
		//logger.info(JSON.toJSONString(roomService.selectLivingRoom(1, "", null, 0, 0)));
		
		//logger.info(JSON.toJSONString(consumeService.listConsumedetail(233L,"", 0L,0L,0L,null)));
		
		//logger.info(JSON.toJSONString(consumeService.selectConsumeList(1L, 233L, 0L, 0L)));
		
		
		//logger.info(JSON.toJSONString(consumeService.getConsumeAmount(128, 0, "")));
		
		//logger.info(JSON.toJSONString(specialDayService.isWeekEnd(1, sometime4)));
		
		//logger.info(JSON.toJSONString(rentpriceService.getRentpriceListByHotelId(1,0,0)));
		
		//logger.info(JSON.toJSONString(shiftService.getShiftListBySuccessionId(1)));
		
		//logger.info(JSON.toJSONString(roomService.selectLivingRoom(1, "")));
		
		
		
		//logger.info(JSON.toJSONString(shiftService.listPasscashPage(1, 0, 0, 2, 0, 9999)));
		
		//logger.info(JSON.toJSONString(roomService.selectLivingRoomGuest(1, "", null, 0, 0)));
		
		
		guest nonerentguest  = new guest();
		
		nonerentguest.setGuestName("A105guestprimary");

		nonerentguest.setPhone("1333333333");
		//nonerentguest.setEmail("sdfsdfsdfs@sdfdsfd.sdfsdf");


		nonerentguest.setIdentityCardNumber("64654545456546465");

		//nonerentguest.setGuestId(13999L);

		//logger.info(JSON.toJSONString(receptionService.createAnonymousReception(1L, rentconsumelist, 1, rentpaymentlist, 1L, "test","tttt")));
		

		//logger.info(JSON.toJSONString(guestService.selectLivingGuest(1, "", "",3)));
		
		
		//logger.info(JSON.toJSONString(guestService.selectExpectedLeaveGuest(1, "")));
		//logger.info(JSON.toJSONString(guestService.selectCheckinGuest(1, "", "")));
		//logger.info(JSON.toJSONString(reserveService.selectPreArrivalList(1, "", "")));
		//logger.info(JSON.toJSONString(reserveService.selectLossArrivalAlertList(1, "", "")));
		//logger.info(JSON.toJSONString(guestService.selectCheckoutGuest(1, "")));
		//logger.info(JSON.toJSONString(guestService.listHistoryGuest(1, "", null, null)));
		//logger.info(JSON.toJSONString(guestService.selectLeaveRentAlert(1, "")));
		
		ReceptionGuest livingguest1 = new ReceptionGuest();
		livingguest1.setGuestName("A105guestprimary");

		livingguest1.setPhone("1333333333");
		livingguest1.setEmail("sdfsdfsdfs@sdfdsfd.sdfsdf");

		livingguest1.setIdentityCardNumber("64654545456546465");

		livingguest1.setRoomId(5L);
		livingguest1.setRoomCode("A105");
		livingguest1.setGuestId(3919L);
		//logger.info(JSON.toJSONString(guestService.AddLivingguest(1, livingguest1, 1L,  1L, "test")));
		
		
		//logger.info(JSON.toJSONString(roomService.selectLivingRoom(1, "C108")));
		
		//logger.info(JSON.toJSONString(guestService.selectCheckoutGuest(1, "", "")));
		
		
		
		
		
		
		
		
		
		//logger.info(JSON.toJSONString(usersService.memberLogin("mihaisheng", "a02cc9a3fc5def5275b5ca22f0d8f414")));
		//logger.info(JSON.toJSONString(usersService.memberEdit(3929L, "man111", "mihaisheng@sssssss", "pujjjjjj")));
		
		//logger.info(JSON.toJSONString(usersService.editPassword(3929L, "9db06bcff9248837f86d1a6bcf41c9e7", "9db06bcff9248837f86d1a6bcf41c9e7")));
		
		//logger.info(JSON.toJSONString(receptionService.extendRent(116, 10, new Date(), null, "test")));
		//logger.info(JSON.toJSONString(receptionService.extendRent(115, 10, new Date(), null, "test")));
		//logger.info(JSON.toJSONString(receptionService.extendRent(298L, 9, new Date(), null, 1L,"test")));
		

		//logger.info(JSON.toJSONString(receptionService.getExpectedRentAmount(116, 10)));
		//logger.info(JSON.toJSONString(receptionService.getExpectedRentAmount(115, 10)));
		//logger.info(JSON.toJSONString(receptionService.getExpectedRentAmount(1L, 1L,1L,1,new Date(),10)));
		

		//logger.info(JSON.toJSONString(receptionService.addRentPayment(228L, rentpaymentlist, 1L, "test")));

	
		//logger.info( JSON.toJSONString(warehouseService.getCurrentGoodsStore(1, 0, "")));
			
		
		//logger.info( JSON.toJSONString("userid:"+usersService.memberlogin("17301767224", "14e1b600b1fd579f47433b88e8d85291")));
		//logger.info( JSON.toJSONString(usersService.memberRegister("1555558903", "kkkk", "kkkkk", 1,"1234567","sdfdsfxx1","dsfsdfxx2")));
		
		//logger.info( JSON.toJSONString(usersService.selectByOpenid("x8uiououiou1")));
		//logger.info( JSON.toJSONString(usersService.selectByUnionid("y8ippoipoipo")));
		
		//logger.info( JSON.toJSONString(usersService.updateOpenId("4402xcvdsfsdf", 4402L)));
		//logger.info( JSON.toJSONString(usersService.updateUnionId("4402unionsdfdsfsdfds", 4402L)));
		
		//logger.info( JSON.toJSONString(usersService.getUsersById(4270L)));
	
	Date timenow = new Date();
	long snap= timenow.getTime();
	//System.out.println((int)snap);
	//BigInteger 
	
	
	//logger.info( JSON.toJSONString(rentService.(119, 14, 2)));
	//logger.info( JSON.toJSONString(guestService.selectLowBalanceReception(1)));
	
	Date calDate = null;
	try {

		calDate = sdf.parse("2016-12-15 00:00:00");
	} catch (ParseException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	}
	
	
	//logger.info( JSON.toJSONString(consumeService.createRentConsume(1, calDate)));
	
	
	//logger.info(JSON.toJSONString(usersService.bindWechatOpenid("15921504067", "verifyCode", "9db06bcff9248837f86d1a6bcf41c9e7", "oc9L0wdmA9PouTRzpigbWbMJALV8")));
	//logger.info(JSON.toJSONString(usersService.getPointsReturnedCount(3929)));
	//logger.info(JSON.toJSONString(usersService.listPointsReturned(3929)));
	
	//logger.info(JSON.toJSONString(usersService.getPointsPaidCount(3929)));
	//logger.info(JSON.toJSONString(usersService.listPointsPaid(3929)));
	
	//logger.info(JSON.toJSONString(usersService.findPhoneVerification("15921504067")));
	//logger.info(JSON.toJSONString(usersService.createPhoneVerification("15921504067", "tm1615")));
	
	//logger.info(JSON.toJSONString(usersService.checkPhoneVerification("15921504067", "tm1615")));
	
	
	//logger.info(JSON.toJSONString(usersService.getNoneEstimateCount(3929)));
	
	//logger.info(JSON.toJSONString(usersService.listNoneEstimatePage(3929,0,99999)));
	//logger.info(JSON.toJSONString(usersService.estimateConsume(11421, 1)));
	//logger.info(JSON.toJSONString(usersService.getUserStoreCount(3929)));
	
	//logger.info(JSON.toJSONString(usersService.listUserStorePage(3929, 0, 99999)));  //1446   1868
	//logger.info(JSON.toJSONString(usersService.getUserStoreDetailCount(1446)));
	//logger.info(JSON.toJSONString(usersService.listUserStoreDetailPage(1446, 0, 9999)));
	
	//logger.info(JSON.toJSONString(usersService.getFaqCount()));
	//logger.info(JSON.toJSONString(usersService.listFaqPage(0, 9999)));
	//logger.info(JSON.toJSONString(usersService.getMatchCode(3929)));
	
	
	
	//logger.info(JSON.toJSONString(usersService.listProvincePage()));
	
	//logger.info(JSON.toJSONString(usersService.listCityPage("610000")));
	
	//logger.info(JSON.toJSONString(shopsService.getProductCount(29)));
	//logger.info(JSON.toJSONString(shopsService.listProductPage(29, 0, 9999)));
	
	//logger.info(JSON.toJSONString(shopsService.getShopDetail(36)));
	
	
	
	//logger.info(JSON.toJSONString(warehouseeService.addSupplier("sdfdsf", "li", "021-22222", "1888888", "普降", "农行", "大学生", "6546546546", "remark", 1L, 1L, "test", 1)));
	
	
	//logger.info(JSON.toJSONString(warehouseService.editSupplier(2L,"sdfdswerewf", "li", "021-22222", "1888888", "普降", "农行", "大学生", "6546546546", "remark", 1L, 1L, "test", 1)));
	
	//logger.info(JSON.toJSONString(warehouseService.getSupplierCount(1, "")));
	//logger.info(JSON.toJSONString(warehouseService.listSupplierPage(1, "",0,9999)));
	
	//logger.info(JSON.toJSONString(warehouseService.delSupplierById(3L)));
	//logger.info(JSON.toJSONString(userService.listUserPage(0, 9999, 0, 1, 0, "")));
	
	//logger.info(JSON.toJSONString(goodsService.listGoodsPage(0, 99999, 1, "", 0, 0)));
	
	//logger.info(JSON.toJSONString(UserGroupService.selectUsergroupByRoleId(1)));
	
	//logger.info(JSON.toJSONString(roleService.listRoletypeByParentId(12)));
	

	//logger.info(JSON.toJSONString(shopsService.getShopCount("", "", "上海市", "")));
	//logger.info(JSON.toJSONString(shopsService.listShopPage("", "", "上海市", "", 0, 9999)));
	//logger.info(JSON.toJSONString(shopsService.getShopDetail(29)));
	//logger.info(JSON.toJSONString(shopsService.getById(29L)));
	
	//logger.info(JSON.toJSONString(usersService.listCityPage("110000")));
	//logger.info(JSON.toJSONString(usersService.listCityPage("130000")));
	
	//logger.info(JSON.toJSONString(lockService.createLockCard(1L, 1L, "hotel01", "xxx01", "card1=01", 1L, "A101", new Date(), new Date(), 1L, "test1")));
	
	//logger.info(JSON.toJSONString(lockService.selectLockCard(1L, 3)));
	//logger.info(JSON.toJSONString(lockService.getLockcardCount(1L, 3)));
	//logger.info(JSON.toJSONString(lockService.getLockcardByCardCode("card1=01")));
	
	//logger.info(JSON.toJSONString(lockService.updateLockCardState(1L, 2,3,"test3")));
	//logger.info(JSON.toJSONString(lockService.extendLockCard(1L, new Date(), 3,"test3")));
	
	
	
	
	//logger.info(JSON.toJSONString(hotelService.getHotelCount("")));
	//logger.info(JSON.toJSONString(hotelService.listHotelPage("", 0, 99999)));
	//logger.info(JSON.toJSONString(hotelService.updateKezhuShop(1, 1, "testtest")));
	//logger.info(JSON.toJSONString(shopsService.getKezhuShopCount("厦门")));
	//logger.info(JSON.toJSONString(shopsService.listKezhuShopPage("厦门", 0, 9999)));
	
	//logger.info(JSON.toJSONString(shopsService.shopUserLogin("test123", "ff92a240d11b05ebd392348c35f781b2")));
	
	//ShopUser test123 = shopsService.getUserById(83);
	//shopsService.storeConsume(test123, "15921504067", .10, "commmmmmmennnnnnnnt");
	
	//logger.info(JSON.toJSONString(reportService.getcheckinroomdailyreport(1L, new Date())));
	
	
	//logger.info(JSON.toJSONString(reportService.getextendroomdailyreport(1L, new Date())));
	//logger.info(JSON.toJSONString(reportService.getlogexitroomdailyreport(1L, new Date())));
	
	//logger.info(JSON.toJSONString(reportService.getsingleconsumesumarydailyreport(1L, 2, new Date())));
	//logger.info(JSON.toJSONString(reportService.getsingleconsumesumarydailyreport(1L, 3, new Date())));
	
	//logger.info(JSON.toJSONString(reportService.getpaymentdailyreport(1L, new Date())));
	
	
	
	//logger.info(JSON.toJSONString(reportService.getchannelpaymentdailyreport(1L, new Date("2017/01/16"))));
	
	//logger.info(JSON.toJSONString(reportService.getcheckoutpaymentsummaryreport(1L, new Date("2017/01/10"), new Date("2017/01/20"))));
	//logger.info(JSON.toJSONString(reportService.getconsumedailyreport(1L, new Date("2017/01/10"), new Date("2017/01/20"))));
	
	
	//logger.info(JSON.toJSONString(reportService.getchannelpaymentsummaryreport(22L, new Date("2017/01/10"), new Date("2017/01/20"))));
	
	//logger.info(JSON.toJSONString(reportService.getpaymentdailyreport(1L, new Date())));
	
	//logger.info(JSON.toJSONString(reportService.RepPayment(1L, new Date("2016/01/10"), new Date("2017/01/20"))));
	
	//logger.info(JSON.toJSONString(reportService.getitemdailyconsumesummary(1L, new Date("2017/01/16"), 0, "")));
	
	//logger.info(JSON.toJSONString(reportService.getitemdailyconsumesummary(1L, new Date("2017/01/16"), 2, "红茶")));
	
	//logger.info(JSON.toJSONString(reportService.getchanneldailyconsumesummary(1L, new Date("2017/01/16"), 1L, 1L)));
	//logger.info(JSON.toJSONString(reportService.getchanneldailyconsumesummary(1L, new Date("2017/01/16"), 0L, 0L)));
	
	//logger.info(JSON.toJSONString(reportService.getcheckoutbillcountbychannelsaler(1L, new Date("2017/01/16"))));
	//logger.info(JSON.toJSONString(reportService.getconsumesumamountbychannelsaler(1L, new Date("2017/01/16"))));
	//logger.info(JSON.toJSONString(reportService.getconsumegoodsamountbychannelsaler(1L, new Date("2017/01/16"))));
	//logger.info(JSON.toJSONString(reportService.getconsumeserviceamountbychannelsaler(1L, new Date("2017/01/16"))));
	//logger.info(JSON.toJSONString(reportService.getpaymentpayamountbychannelsaler(1L, new Date("2017/01/16"))));
	//logger.info(JSON.toJSONString(reportService.getpaymentcreditamountbychannelsaler(1L, new Date("2017/01/16"))));
	//logger.info(JSON.toJSONString(reportService.getchannelcollectdailyreport(1L, new Date("2017/01/18"))));
	
	
	//logger.info(JSON.toJSONString(reportService.getchannelcollectsummaryBySaler(1L,1L, new Date("2017/01/01"), new Date("2017/12/01"))));
	
	//logger.info(JSON.toJSONString(reportService.getmembercheckoutpaymentdailyreport(1L,new Date("2016/01/01"), new Date("2017/12/01"))));
	//logger.info(JSON.toJSONString(reportService.getchangeroomdailyreport(1L, new Date("2017/05/10"))));
	
	//logger.info(JSON.toJSONString(channelService.addChanelCollect(1L,501, 601, 23L, 1L, "test", "ceshi", 1L, "test")));
	
	
	//logger.info(JSON.toJSONString(channelService.delChanelRecharge(10L)));
	
	//logger.info(JSON.toJSONString(channelService.getChannelCollectCount(1L, 0L, "")));
	//logger.info(JSON.toJSONString(channelService.listChannelCollectPage(1L, 0L, "", 0, 99999)));
	//logger.info(JSON.toJSONString(channelService.getChannelBalanceFlow(26L, new Date("2017/01/01"), new Date("2017/12/01"))));
	
	
	//logger.info(JSON.toJSONString(channelService.getChannelBalanceFlow(23L,null,null)));
	
	//logger.info(JSON.toJSONString(channelService.getchannelcreditsummary(1L, "")));
	
	//logger.info(JSON.toJSONString(channelService.getChannelCount(1L, "", 0)));
	//logger.info(JSON.toJSONString(channelService.listAdvanceChannelPage(0,9999,1L, "", 0L, 0)));
	
	
	//logger.info(JSON.toJSONString(channelService.getCreditBalanceSummary(1L)));
			
	//logger.info(JSON.toJSONString(channelService.listCreditBalancePage(0, 1000, 1L, "", 0)));
			
			
			
	
	for(int index = 0 ;index < livingguestList.size();index ++){
	livingguestList.get(index).setRoomId(0L);
	livingguestList.get(index).setRoomCode(null);
	}
	guest visitguest1 = new guest();
	visitguest1.setGuestName("nonerentguest");
	visitguest1.setPhone("1333333333");
	//visitguest1.setEmail("sdfsdfsdfs@sdfdsfd.sdfsdf");

	visitguest1.setIdentityCardNumber("64654545456546465");

	//logger.info(JSON.toJSONString(receptionService.AddReception(1L, 1L,"13777777777",visitguest1, 1, 1L, "test","ceshi")));
	
	
	//System.out.println(reserveService.updateReserveStateToCheckin(1L));
	//System.out.println(reserveService.updateReserveStateToLoss(1L));
	
	
	//ShopUser casher =shopsService.getUserById(83L);
	//902 hxnchuntian ; 899 hxnxinyu ; 83 test1234
	
	//card home test 
	//ShopUser casher =shopsService.getUserById(902L); //hxnchuntian
	//logger.info(JSON.toJSONString(shopsService.storeConsume(casher, "15921504067", 1.0, "from J g")));
	
	//card group test 
	//ShopUser casher =shopsService.getUserById(899L); //hxnxinyu
	//logger.info(JSON.toJSONString(shopsService.storeConsume(casher, "15921504067", 1.0, "from J g")));
		
	//card group (inculude home) test 
	//ShopUser casher =shopsService.getUserById(899L); //hxnxinyu
	//logger.info(JSON.toJSONString(shopsService.storeConsume(casher, "15921504067", 15.0, "from J g")));
			
	//cash home
	//ShopUser casher = shopsService.getUserById(902L); //hxnchuntian
	//logger.info(JSON.toJSONString(shopsService.cashConsume(casher, "15921504067", 100.0, "cash from J g")));
		
	//cash group
	//ShopUser casher = shopsService.getUserById(899L); //hxnxinyu
	//logger.info(JSON.toJSONString(shopsService.cashConsume(casher, "15921504067", 100.0, "cash from J g")));
			
	//cash cross  :  cash_cross or cash_cross_no_agent
	//ShopUser casher = shopsService.getUserById(83L); //test123
	//logger.info(JSON.toJSONString(shopsService.cashConsume(casher, "15921504067", 100.0, "cash from J g")));
		
	//point home
	//ShopUser casher = shopsService.getUserById(902L); //hxnchuntian
	//logger.info(JSON.toJSONString(shopsService.pointConsume(casher, "15921504067", 1.0, "point from J g")));
		
	//poin home group cross  从cards里home,群组  其他商家扣积分
	//ShopUser casher = shopsService.getUserById(902L); //hxnchuntian
	//logger.info(JSON.toJSONString(shopsService.pointConsume(casher, "15921504067", 30.0, "point from J g")));
		
	//card store
	//ShopUser casher = shopsService.getUserById(899L); //hxnxinyu
	//logger.info(JSON.toJSONString(shopsService.cardStore(casher, "15921504067", 100.0,110.0, "store from J g")));
		
	//card store
	//ShopUser casher = shopsService.getUserById(83L); //test123
	//logger.info(JSON.toJSONString(shopsService.cardStore(casher, "17301767224", 100.0,110.0, "store from J g")));
	//logger.info(JSON.toJSONString(shopsService.cardStore(casher, "15921504067", 1,1.5, "store from J 2017")));
	
	//logger.info(JSON.toJSONString(usersService.getMatchCode("15921504067")));
	//logger.info(JSON.toJSONString(usersService.checkMatchCode("15921504067", "9082")));
	//logger.info(JSON.toJSONString(usersService.clearMatchCode("15921504067")));
	//logger.info(JSON.toJSONString(usersService.getUserPhoneByVipcard("1243")));
		
	//logger.info(JSON.toJSONString(usersService.bindVipcard(39291L, "1234", "aaa001")));
		
	//logger.info(JSON.toJSONString(usersService.unbindVipcard(39291L)));
	
	//logger.info(JSON.toJSONString(shopsService.modifyTencentCoordinate(1L, 2.0, 2.0)));
	
	//shops tmp = shopsService.getShopById(204L);
	
	//System.out.println( tmp.getStatus().equals("union"));
	
	//rentList.remove(1);logger.info(JSON.toJSONString(receptionService.createRentReception(1L, 0L, true, 1L, "18899160255", 0, rentList, livingguestList,paymentlist,0,1L,1L,"test","ttt")));
	
	//logger.info(JSON.toJSONString(receptionService.calculateRentAmount(1L, 1L, 1L, 3, LocalDateTime.now(), 1, 5.5)));
	
	//logger.info(JSON.toJSONString(receptionService.changeStay(391L, 1.5, LocalDateTime.of(2017, 7, 19, 0, 0), null, 1L, "test2")));
	
	//logger.info(JSON.toJSONString(receptionService.changeRoom(366L, 8L, 2, 1L, "test")));
	//logger.info(JSON.toJSONString(receptionService.changeRoom(383L, 8L, 2, 1L, "test")));
	
	//logger.info(JSON.toJSONString(consumeService.getMaxReceptionPageNumber(287L)));
	
	//logger.info(JSON.toJSONString(consumeService.modifyConsumeDetailPageNumber(1L, 1276L, 3)));
	//logger.info(JSON.toJSONString(paymentService.modifyPaymentDetailPageNumber(1L, 533L, 2)));
	//logger.info(JSON.toJSONString(paymentService.getPaymentList(290L, 0)));
	//logger.info(JSON.toJSONString(consumeService.listConsumedetail(287L, null, 0, null, null, null, null)));

	//Long a1= 1L;System.out.println(a1 == 1);
	
	//logger.info(JSON.toJSONString(shopsService.getShopByWechatId(123456)));
	//logger.info(JSON.toJSONString(shopsService.updateShopWechat(29L, 1234560, "1234560_____")));
	//logger.info(JSON.toJSONString(usersService.updateShopWechatId(2345670, 39291L)));
	//logger.info(JSON.toJSONString(consumeService.getReceptionPageNumberList(287L)));
	
	//logger.info(JSON.toJSONString(usersService.getMemberCount(29L,"王","")));
	//logger.info(JSON.toJSONString(usersService.listMemberPage(29L,"王","", 0, 9999)));
	
	//logger.info(JSON.toJSONString(shopsService.getMemberstoredailyreport(29L, new Date("2017/03/08"))));
	
	//logger.info(JSON.toJSONString(shopsService.getUserCard(29L, 3929L)));
	
	
	
	//logger.info(JSON.toJSONString(receptionService.payOnChannelCredit(249L, 13, 23L, 600, "qian", "q", 1L, 1L, "test")));
	
	//logger.info(JSON.toJSONString(receptionService.undoPayOnChannelCredit(293L, 7, "undo", "u", 1L, "test")));
	
	//logger.info(JSON.toJSONString(receptionService.getLockedReceptionPageList(294L)));
	
	
	
	
	//logger.info(JSON.toJSONString(receptionService.payOnFreeConsume(293L, 8,  600, "mian", "m", 1L, 1L, "test")));
	
	//logger.info(JSON.toJSONString(receptionService.undoPayOnFreeConsume(293L, 8, "undomian", "undom", 1L, "test")));
		
	//logger.info(JSON.toJSONString(receptionService.payOnBadDebt(293L, 500, "bad", "b", 1L, 1L, "test")));
	
	//logger.info(JSON.toJSONString(receptionService.undoPayOnBadDebt(293L, 10, "undobad", "undob", 1L, "test")));
	
	//logger.info(JSON.toJSONString(receptionService.getNonePaymentList(293l, -3)));
	
	//logger.info(JSON.toJSONString(receptionService.transferConsume(1l,293L, 9, 294L, 1L, "test")));
	
	//logger.info(JSON.toJSONString(receptionService.undoTransferConsume(1L, 23L, 2L, "test2")));
			
	
	//logger.info(JSON.toJSONString(receptionService.listTransferItem(24l)));
	
	//logger.info(JSON.toJSONString(receptionService.listTransferItemByOutReceptionId(293L)));
	
	//logger.info(JSON.toJSONString(receptionService.listTransfer(1l,293l,0l)));
	
	//logger.info(JSON.toJSONString(this.consumeService.listConsumL,edetail(217l, "23", 0, null, 0l, 0l, null)));

	//logger.info(JSON.toJSONString(receptionService.listConsumeTransferIO(293l)));
	
	//logger.info(JSON.toJSONString(channelService.getThirdPartyPaymentList(1L)));
	
	
	//26
	
	List<payment> thirdlist =new ArrayList<payment>();
	
	payment thirdpay1 = new payment();
	thirdpay1.setPaymethodCode(5);
	thirdpay1.setPaymethodName("携程");
	thirdpay1.setCreditChannelId(20L);
	thirdpay1.setAmount(2000);
	thirdlist.add(thirdpay1);
	
	//logger.info(JSON.toJSONString(receptionService.addRentPayment(249L, thirdlist, 1L, "test")));
	
	//logger.info(JSON.toJSONString(receptionService.editReception(293L, "gai", 200, "测试")));
	
	//logger.info(JSON.toJSONString(shiftService.addDeliverCash(1L, 1L, "from A", 1L, 9999, "ceshi")));
	//logger.info(JSON.toJSONString(shiftService.receiveCash(4L, 2L, "By B", 2L)));
	//logger.info(JSON.toJSONString(shiftService.listDeliverCashPage(0, 9999, 1L, 0L, 2L, 2)));
	
	
	//logger.info(JSON.toJSONString(warehouseService.getGoodsinCount(1l,0l, null, null)));
	//logger.info(JSON.toJSONString(warehouseService.getGoodsinList(0,99999,1l,0L, null, null)));
	//logger.info(JSON.toJSONString(warehouseService.getGoodsinDetailList(25L)));
	
	
	
	allotdetail paldt1= new allotdetail();
	paldt1.setGoodsCategoryId(1L);
	paldt1.setGoodsCategoryName("测试分类");
	paldt1.setGoodsId(1L);
	paldt1.setGoodsItemCode("茶叶");
	paldt1.setNumber(10);
	paldt1.setPurchasePrice(2000);
	paldt1.setUnitName("包");
	
	allotdetail paldt2= new allotdetail();
	paldt2.setGoodsCategoryId(1L);
	paldt2.setGoodsCategoryName("测试分类");
	paldt2.setGoodsId(7L);
	paldt2.setGoodsItemCode("茶叶");
	paldt2.setNumber(10);
	paldt2.setPurchasePrice(2000);
	paldt2.setUnitName("包");
	
	List<allotdetail>  allotdetaillist = new ArrayList<allotdetail>();
	allotdetaillist.add(paldt1);
	allotdetaillist.add(paldt2);
	
	//logger.info(JSON.toJSONString(warehouseService.allot(1L, 1L, 2L, allotdetaillist, 1L, "test", "test allot")));
	
	//logger.info(JSON.toJSONString(warehouseService.getAllotCount(1L,1L,0L,null,null)));
	//logger.info(JSON.toJSONString(warehouseService.getAllotList(0,99999,1L,1L,0L,null,null)));
	
	//logger.info(JSON.toJSONString(warehouseService.getAllotDetailList(4L)));
	
	//logger.info(JSON.toJSONString(warehouseService.changeGoodsStore(1L, 1L, 2L, "茶叶2", "和", 3, 300)));
	//logger.info(JSON.toJSONString(warehouseService.changeGoodsStore(1L, 1L, 11L, "统一冰红茶", "和", 3)));
	
	//logger.info(JSON.toJSONString(warehouseService.getGoodsStoreDetailList(1L, 0L, 0L, "", 0)));
	
	//logger.info(JSON.toJSONString(warehouseService.getGoodsStoreDetailList(1L, 2L, 0L, "", 0)));
	
	//logger.info(JSON.toJSONString(warehouseService.getGoodsStoreDetailList(1L, 0L, 1L, "", 0)));
	
	//logger.info(JSON.toJSONString(warehouseService.getGoodsStoreDetailList(1L, 0L, 0L, "月", 0)));
	
	//logger.info(JSON.toJSONString(warehouseService.getGoodsStoreDetailList(1L, 0L, 0L, "", 0)));
	
	//logger.info(JSON.toJSONString(warehouseService.getGoodsStoreSummary(1L, 0L, 0L, "", 0)));
	List<inventorydetail> invdtlist = warehouseService.getInventoryDetailPreList(1L, 1L);
	//logger.info(JSON.toJSONString(invdtlist));
	for(inventorydetail invdt:invdtlist){
		invdt.setStoreNumberFinal(200);
	}
	
	//logger.info(JSON.toJSONString(warehouseService.addInventory(1l, 1l,"xx库", 1l, "test", invdtlist)));
	
	//logger.info(JSON.toJSONString(warehouseService.getLatestInventoryList(1l, 1l, 100)));
	
	//logger.info(JSON.toJSONString(warehouseService.getInventoryDetailList(3l)));
	
	
	//logger.info(JSON.toJSONString(guestService.modifyGuestNameByGuestId(4517l, "A106guest2eeee3",3l,"test3")));
	//logger.info(JSON.toJSONString(guestService.modifySexCodeByGuestId(4517l, 2,3l,"test3")));
	
	//logger.info(JSON.toJSONString(guestService.getTwoYearConsumptionGuestIdList(1l)));
	//logger.info(JSON.toJSONString(guestService.getTwoYearConsumptionRecentRanking(1l)));
	//logger.info(JSON.toJSONString(guestService.getTwoYearConsumptionFrequencyRanking(1l)));
	//logger.info(JSON.toJSONString(guestService.getTwoYearConsumtionMoneyRanking(1l)));
	//logger.info(JSON.toJSONString(guestService.getSingleRFMData(1l, 4145l)));
	//logger.info(JSON.toJSONString(guestService.updateRFMValue(1l, 4145l, 4, 5, 5)));
	//logger.info(JSON.toJSONString(guestService.getSingleRFM(1l, 4145l)));
	//logger.info(JSON.toJSONString(guestService.cleanExpiredRFM(1l, guestService.getTwoYearConsumptionGuestIdList(1l))));
	
	//logger.info(JSON.toJSONString(guestService.getGuestByCertificate(1, "123456")));
	
	//logger.info(JSON.toJSONString(shiftService.getSuccessionList(1l, 0, 0, new Date("2017/05/08"))));
	
	//logger.info(JSON.toJSONString(receptionService.checkout(1l,291l, 5l, "test5l", null)));
	//logger.info(JSON.toJSONString(receptionService.undoCheckout(291l, 6l, "test6l")));
	
	
	
	//logger.info(JSON.toJSONString(consumeService.getConsumeAmount(291l, null, null, null)));
	
	//logger.info(JSON.toJSONString(shiftService.modifySuccessionState(3l, 1, 7l, "test7")));
	
	//logger.info(JSON.toJSONString(shiftService.getPaymentListBySuccession(3L, 0,false)));
	
	//logger.info(JSON.toJSONString(reportService.getconsumesummarydailyreport(1L, LocalDate.of(2017,05,11))));
	//logger.info(JSON.toJSONString(reportService.getcheckoutpaymentdailyreport(1L, new Date("2017/02/22"))));
	//logger.info(JSON.toJSONString(reportService.getmembercheckoutpaymentdailyreport(1L, new Date("2017/02/22"))));
	//logger.info(JSON.toJSONString(reportService.getcheckoutpaymentsummaryreport(1l, LocalDate.of(1900,01,01), LocalDate.of(2017,05,05))));
	//logger.info(JSON.toJSONString(reportService.getmembercheckoutpaymentsummaryreport(1l, LocalDate.of(1900,01,01), LocalDate.of(2017,05,31))));
	//logger.info(JSON.toJSONString(shopsService.getMemberInviteDailyReport(29l, LocalDate.of(2017,01,23))));
	//logger.info(JSON.toJSONString(shopsService.getMemberInvitereport(29l,"17301767224", LocalDate.of(1900,01,01), LocalDate.of(2017,05,05))));
	//logger.info(JSON.toJSONString(consumeService.getConsumeCount(1l,null, "1", null, null,null,null)));
	
	//logger.info(JSON.toJSONString(consumeService.getConsumeAmount(1l,null, "1", null, null,null,null)));
	
	//logger.info(JSON.toJSONString(reportService.createRentConsumeDailyReport(1l)));
	//logger.info(JSON.toJSONString(reportService.getrentconsumesummaryreport(1l, LocalDate.of(1900,01,01), LocalDate.of(2017,05,31))));
	//logger.info(JSON.toJSONString(reportService.getcertainroomtypeconsumeanalysis(1l, LocalDate.of(1900,01,01), LocalDate.of(2017,05,31))));
	//logger.info(JSON.toJSONString(shopsService.getMemberstoresummaryreport(29L, new Date("2017/01/01"), new Date("2017/05/31"))));
	//logger.info(JSON.toJSONString(reportService.getchannelcollectsummary(1L, LocalDate.of(2007, 1, 1), LocalDate.of(2007, 5, 31))));
	
	//logger.info(JSON.toJSONString(guestService.updateSingleRFMValue(1l, 1l, 5, 5, 5,LocalDateTime.now(),10,1000)));
	
	//logger.info(JSON.toJSONString(shopsService.getShopUserList(29l)));
	//logger.info(JSON.toJSONString(shopsService.getMemberstoresummaryreport(29l, null, LocalDate.of(1900,01,01), LocalDate.of(2017,05,31))));
	
	//logger.info(JSON.toJSONString(reportService.getconsumesummaryreport(1l, LocalDate.of(2007, 1, 1), LocalDate.of(2017, 5, 31))));
	
	//logger.info(JSON.toJSONString(reportService.getconsumesummaryforsource(1l, 1l, 1l, LocalDate.of(1900,01,01), LocalDate.of(2017,05,31))));
	
	//logFger.info(JSON.toJSONString(shopsService.getMemberInvitesummary(29l,  LocalDate.of(1900,01,01), LocalDate.of(2017,06,30))));
	
	
	//logger.info(JSON.toJSONString(accountService.addApply("kkk4", "addr_kkkk4", "Mr_kkkk4", "1666666666", "sdfdsf@sdfds.sdfs")));
	
	//logger.info(JSON.toJSONString(applyService.getApplyCount()));
	//logger.info(JSON.toJSONString(accountService.getApplyList(0, 9999)));
	//logger.info(JSON.toJSONString(accountService.approval(5l, "kkkk3", "kkkk3")));
	//logger.info(JSON.toJSONString(accountService.isHotelExist("zzz1")));
	//logger.info(JSON.toJSONString(accountService.resetPassword(56l, "ttttttt")));
	
	//logger.info(JSON.toJSONString(reportService.getGuestRFMAnalysis(1l, 0l, 0, 0, 0, 0)));
	
	//logger.info(JSON.toJSONString(receptionService.calculateRentAmount(1l, 1l, 1l, 2, LocalDateTime.now(), 4, 3)));
	//logger.info(JSON.toJSONString(receptionService.calculateRentAmount(9l, 5l, 26l, 1, LocalDateTime.of(2017, 7, 19, 0, 0), 1, .5)));
	
	//logger.info(JSON.toJSONString(sysService.addConfig(3l, LocalTime.now(), 20, 5,  LocalTime.now(),  LocalTime.now(),  LocalTime.now(),  LocalTime.now(), "t", "s")));
	
	
	//logger.info(JSON.toJSONString(guestService.selectLowBalanceReception(1)));
	
	//logger.info(JSON.toJSONString(usersService.resetPassword(88l, "111")));
	
	//logger.info(JSON.toJSONString(usersService.getUserByPhone("13585772156")));
	//logger.info(JSON.toJSONString(usersService.getUserIdByPhone("13585772156")));

	//logger.info(JSON.toJSONString(hotelService.getHotelByKezhuShopId(29l)));
	
	//logger.info(JSON.toJSONString(hotelService.modifyAverageRoomPrice(1l,999)));
	
	

	//System.out.println(JSON.toJSONString(this.rentPriceService.getRentpriceListByHotelId(1, 0, 2)));
	
	//logger.info(JSON.toJSONString(usersService.findByUsername("kezhu")));
	
	//logger.info(JSON.toJSONString(roomService.EditRoom(28l, "F109xxxxxx2-1", 5l, 1l, "lockCode", 1111l, "test111", "2-1", 1l)));
	
	//logger.info(JSON.toJSONString(channelService.getAgentCollectionList(1l))); 
	///logger.info(JSON.toJSONString(channelService.getChannelByName(1l, "驿宝")));
	
	
	//logger.info(JSON.toJSONString(usersService.modifyManager(39291l, 999999l, "testmanager999999")));
	//logger.info(JSON.toJSONString(shopsService.getShopUserList(207l)));
	
	}

}
