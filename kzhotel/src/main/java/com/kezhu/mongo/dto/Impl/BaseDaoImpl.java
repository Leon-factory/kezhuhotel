package com.kezhu.mongo.dto.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.kezhu.mongo.dto.BaseDao;


/**
 *	BaseDao 实现 BaseDao接口， 封装对MongoDB的常用操作,
 *	@author Administrator 
 * 
 * **/
public class BaseDaoImpl<T> implements BaseDao<T>{
	
	@Autowired
	protected MongoTemplate mongoTemplate;
	
	@Override
	public int insert(Object data,String tableName) {
		// TODO Auto-generated method stub
		mongoTemplate.save(data, tableName);
		return 1;
	}

	@Override
	public int remove(Object data) {
		// TODO Auto-generated method stub
		Query query = new Query(Criteria.where("name").is(data));
		mongoTemplate.remove(query, "user");
		return 0;
	}

	@Override
	public List<T> finAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public T finOne(Object data) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int update(T data) {
		// TODO Auto-generated method stub
		
		return 0;
	}

}
