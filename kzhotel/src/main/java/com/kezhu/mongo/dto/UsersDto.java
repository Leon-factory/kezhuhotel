package com.kezhu.mongo.dto;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.kezhu.mongo.entity.Users;
import com.kezhu.mongo.entity.idCards;
import com.mongodb.BasicDBList;
import com.mongodb.DBObject;


@Deprecated
@Repository
public interface UsersDto<T>{
	/**
	 * 查询数据
	 * 
	 * @Title: findAll
	 * @param @return
	 * @return List<UserModel>
	 * @throws
	 */
	public List<Users> findAll();
	
	/**
	 * 新增数据
	 * 
	 * @Title: insertUser
	 * @param @param user
	 * @return void
	 * @throws
	 */
	public int insertUser(T user,String tablename);

	/**
	 * 删除数据
	 * @Title: removeUser
	 * @param @param userName
	 * @return void
	 * @throws
	 */
	public void removeUser(String userName);

	/**
	 * 修改数据
	 * @Title: updateUser
	 * @param @param user
	 * @return void
	 * @throws
	 */
	public void updateUser(Users user);

	/**
	 * 按条件查询
	 * @Title: findForRequery
	 * @param
	 * @return void
	 * @throws
	 */
	public Users findForRequery(String userName);

	/**
	 * mongodb简单的分组查询
	 * @Title: mongoGroup
	 * @param @return
	 * @return BasicDBList
	 * @throws
	 */
	public BasicDBList mongoGroup();

}
