package com.kezhu.mongo.dto.Impl;

import java.util.List;
import java.util.Map;

import javax.xml.registry.infomodel.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapreduce.GroupBy;
import org.springframework.data.mongodb.core.mapreduce.GroupByResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.kezhu.mongo.dto.UsersDto;
import com.kezhu.mongo.entity.Users;
import com.kezhu.mongo.entity.idCards;
import com.mongodb.BasicDBList;
import com.mongodb.DBObject;

@Deprecated
@Service()
public class UserDtoImpl implements UsersDto<Map<String, Object>>{

	@Autowired
	private MongoTemplate mongoTemplate;

	@Override
	public List<Users> findAll() {
		// TODO Auto-generated method stub
		List<Users> userList = mongoTemplate.findAll(Users.class, "user");
		return userList;
	}

	@Override
	public int insertUser(Map<String, Object> map,String tablename) {
		// TODO Auto-generated method stub
		this.mongoTemplate.save(map,tablename);
		return 1;
	}

	@Override
	public void removeUser(String userName) {
		// TODO Auto-generated method stub
		Query query = new Query(Criteria.where("name").is(userName));
		this.mongoTemplate.remove(query, "user");
	}

	@Override
	public void updateUser(Users user) {
		// TODO Auto-generated method stub
		// 设置修改条件
				Query query = new Query();
				Criteria criteria = new Criteria("name");
				criteria.is(user.getName());
				query.addCriteria(criteria);
				// 设置修改内容
				Update update = Update.update("age", user.getAge());
				// 参数：查询条件，更改结果，集合名
				mongoTemplate.updateFirst(query, update, "user");
	}

	@Override
	public Users findForRequery(String userName) {
		// TODO Auto-generated method stub
		Query query = new Query();
		Criteria criteria = Criteria.where("name");
		criteria.is(userName);
		query.addCriteria(criteria);
		return this.mongoTemplate.findOne(query, Users.class, "user");
	}

	@Override
	public BasicDBList mongoGroup() {
		// TODO Auto-generated method stub
		GroupBy groupBy = GroupBy.key("name").initialDocument("{count:0}").reduceFunction("function(doc, out){out.count++}")
			    .finalizeFunction("function(out){return out;}");
			GroupByResults<Users> res = mongoTemplate.group("test111", groupBy, Users.class);
			DBObject obj = res.getRawResults();
			BasicDBList dbList = (BasicDBList) obj.get("retval");
		return dbList;
	}

}
