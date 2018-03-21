package com.kezhu.mongo.dto.Impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.kezhu.mongo.entity.Users;
import com.kezhu.mongo.entity.rentCard;


/**
 * 封装用户User对MongoDB的基本操作，此类继承 BaseDaoImpl, 可重写父类的方法,或增加自身的方法
 * @author Administrator 
 * 
 * **/
@Service
public class UserDaoImpl extends BaseDaoImpl<Users>{
	
	//查找所有
	@Override
	public List<Users> finAll() {
		// TODO Auto-generated method stub
		List<Users> list = mongoTemplate.findAll(Users.class, "user");
		return list;
	}
	
	
	//根据条件查询
	@Override
	public Users finOne(Object data) {
		// TODO Auto-generated method stub
		Query query = new Query();
		Criteria criteria = Criteria.where("name");
		criteria.is(data);
		query.addCriteria(criteria);
		Users user = mongoTemplate.findOne(query, Users.class, "user");;
		return user;
	}
	
	//更新数据
	@Override
	public int update(Users data) {
		// TODO Auto-generated method stub
		Query query = new Query();
		Criteria criteria = new Criteria("name");
		criteria.is(data.getName());
		query.addCriteria(criteria);
		Update update = Update.update("age", data.getAge());
		mongoTemplate.updateFirst(query, update, "user");
		return 1;
	}
	
	
	public rentCard findOne(String name){
		Query query = new Query();
		Criteria criteria = Criteria.where("info");
		criteria.is(name);
		query.addCriteria(criteria);
		rentCard ren = mongoTemplate.findOne(query,rentCard.class);
		return ren;
	}
}
