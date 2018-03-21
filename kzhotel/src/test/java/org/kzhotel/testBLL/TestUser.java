package org.kzhotel.testBLL;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.PubJavadill.ClsBinHex;
import com.PubJavadill.ClsLstTran;
import com.alibaba.fastjson.JSON;
import com.kzhotel.BLL.StaticPermission;
import com.kzhotel.BLLI.IBllConsume;
import com.kzhotel.BLLI.IBllGuest;
import com.kzhotel.BLLI.IBllNightCheck;
import com.kzhotel.BLLI.IBllPermission;
import com.kzhotel.BLLI.IBllReception;
import com.kzhotel.BLLI.IBllRole;
import com.kzhotel.BLLI.IBllShift;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.BLLI.IBllUserGroup;
import com.kzhotel.per.PerReception;
import com.kzhotel.pojo.permision;
import com.kzhotel.pojo.role;
import com.kzhotel.pojo.rolepermision;
import com.kzhotel.pojo.usergroup;
import com.kzhotel.pojo.usergroupExample;
import com.kzhotel.service.IGuestService;
import com.kzhotel.service.IPermisionService;
import com.kzhotel.service.IReserveService;
import com.kzhotel.service.IRolePermisionService;
import com.kzhotel.service.IUserGroupService;
import com.kzhotel.service.IUserService;
import com.kzhotel.service.IUsergroupRoleService;

import me.persevere.util.SearchFile;
import me.persevere.util.SimpleDateHandler;
import net.kzhotel.BLLI.NetIBllUsers;

@RunWith(SpringJUnit4ClassRunner.class)		//表示继承了SpringJUnit4ClassRunner类
@ContextConfiguration(locations = {"classpath:smybcom.xml","classpath:smybnet.xml","classpath:smybeb.xml"})
public class TestUser {
	//bll
	
	@Resource
	private IBllShift bllshift;
	@Resource
	private IBllNightCheck bllNightCheck;
	@Resource
	private IBllPermission bllPermission;
	@Resource
	private IBllUserGroup bllUserGroup;
	@Resource
	private IBllRole bllRole;
	@Resource
	private IBllUser bllUser;
	@Resource
	private IBllGuest bllGuest;
	@Resource
	private NetIBllUsers netBllUsers;
	
	//service
	@Resource
	private IGuestService guestService;
	@Resource
	private IUserService userService;
	@Resource
	private IUserGroupService userGroupService;
	@Resource
	private IRolePermisionService rolePermissionService;
	@Resource
	private IPermisionService permissionService;
	@Resource
	private IUsergroupRoleService usergroupRoleService;
	@Resource
	private IReserveService reserveService;
	@Resource
	private IBllConsume bllConsume;
	
	@Test
	public void junitTest5(){
		List<role> roles = this.bllRole.internalListAll();
		for(role role:roles){
    		if(role.getRoleId().intValue()<=1000){
    			continue;
    		}
    		List<String> strings = SearchFile.searchAllAjaxPath(role.getRemark()+".jsp");
    		List<permision> permisions = this.bllPermission.listAll();
        	List<rolepermision> rolepermisions = new ArrayList<rolepermision>();
        	for(permision per:permisions){
        		for(String s:strings){
        			if(s.equals(per.getRemark())){
        				rolepermision rp = new rolepermision();
        				rp.setCreateTime(new Date());
        				rp.setCreator("wyx");
        				rp.setHotelId(1l);
        				rp.setRoleId(role.getRoleId());
        				rp.setPermisionId(per.getPermisionId());
        				rp.setRemark(s);
        				rolepermisions.add(rp);
        			}
        		}
        	}
        	
        	if(rolepermisions.size()!=0){
        		this.rolePermissionService.insertBatch(rolepermisions);
        	}
    		
		}
		
	}
	
	
	
	@Test
	public void junitTest6(){
		this.bllPermission.getPermissionMap();
		String permissionList="";
		for(Map.Entry<String, Integer> entry:StaticPermission.PermissionMap.entrySet()){
			permissionList= ClsBinHex.strBitBinValue(permissionList, entry.getValue().intValue(), true);
		}
		System.out.println(permissionList);
		
		
		this.bllRole.getRoleMap();
		String roleList="";
		for(Map.Entry<String, Integer> entry:StaticPermission.roleMap.entrySet()){
			roleList= ClsBinHex.strBitBinValue(roleList, entry.getValue().intValue(), true);
		}
		System.out.println(roleList);
		
		//ClsBinHex.BLstBitBinValue
		
	}
	
	
	@Test
	public void junitTest7(){
		//System.out.println(JSON.toJSONString(SearchFile.searchAllAjaxPath("accept_onduty.jsp")));
		
		System.out.println(JSON.toJSONString(SearchFile.searchAllAjaxPath("supplier.jsp")));
	}
	
	
	//@Test
	public void junitTest8(){
//		System.out.println(new String(CoreBase64.strMyB64Decode("eapor_2017").getBytes(),"utf-8"));
//		System.out.println(new String(Base64.getEncoder().encode("eapor_2017".getBytes()),"utf-8"));
//		new HashMap<>();
//		System.out.println(CoreBase64.strMyB64Encode("abc"));
//		System.out.println(CoreBase64.strBase64Decode("YWJj"));
//		
//		try {
//			final byte[] KEY = { 9, -1, 0, 5, 39, 8, 6, 19 };
//			System.out.println(new String(KEY,"utf-8"));
//			SecretKeyFactory skf = javax.crypto.SecretKeyFactory.getInstance("DES");
//			DESKeySpec desKeySpec = new DESKeySpec(KEY);
//			
//			SecretKey se = skf.generateSecret(desKeySpec);
//			System.out.println(se.getAlgorithm());
//		} catch (Exception e) {
//			System.out.println(e.getMessage());
//		}
		
//		SearchFile.searchAllAjaxPath("accept_onduty.js");
		List<usergroup> usergroups = this.userGroupService.selectByExample(new usergroupExample());
		this.bllRole.getRoleMap();
		;
		Map<Long, List<Integer>> map = new HashMap<>();
		usergroups.forEach( (ug) -> {
			String roleList = ug.getRoleList();
			List<Integer> lstPermissionList = ClsLstTran.LstIntFromSpilt(roleList,",");
			
			List<Integer> list = new ArrayList<>();
			for(Map.Entry<String, Integer> entry : StaticPermission.roleMap.entrySet()){
				boolean b = ClsBinHex.BLstBitBinValue(lstPermissionList, entry.getValue().intValue());
				if(b){
					list.add(entry.getValue().intValue());
				}
			}
			map.put(ug.getUsergroupId(), list);
			
			
		});
		System.out.println(JSON.toJSONString(map));
	}
	
	
	
	

}
