package com.kzhotel.controller;


import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.alibaba.fastjson.JSON;
import com.kzhotel.BLLI.IBllSourceGroup;
import com.kzhotel.BLLI.IBllUser;
import com.kzhotel.pojo.sourcegroup;
import com.pub.validation.ValidationStrComp;



@Controller
@RequestMapping("/sourcegroup")
public class SourceGroupController {
	@Resource
	private IBllSourceGroup bllSourceGroup;
	@Resource
	private IBllUser bllUser;
	
	/**
	 * 获取客源组列表
	 * @param request
	 * @param offset
	 * @param limit
	 * @param groupName
	 * @return
	 */
	@RequestMapping(value="/pglist", produces = "application/json; charset=utf-8",method=RequestMethod.POST)
	@ResponseBody
	public String pglist(HttpServletRequest request,
			int offset,/*分页offset*/
    		int limit,/*分页limit*/
    		String groupName /*按客源组名称模糊查询*/
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return "-3335";}
		else if(!this.bllUser.hasPermision(intselfuid, "getSourcegroupList")){
            return "-3333";
		}
		
		if(!ValidationStrComp.checkNumber(offset) ||!ValidationStrComp.checkNumber(limit)){
			return "-201";
		}
		if(groupName.length()>0){
			if(!ValidationStrComp.checkStringName(groupName)){
				return "-111";
			}
		}
		List<sourcegroup> lstpojo = this.bllSourceGroup.listSourceGroupPage(offset, limit, groupName);
		return JSON.toJSONString(lstpojo);
	}
	
	
}
