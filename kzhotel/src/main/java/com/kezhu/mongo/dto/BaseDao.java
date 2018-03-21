package com.kezhu.mongo.dto;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
/**
 * 	MongoDB 基本操作，inser  remove find  update
 * 
 * 	@author Administrator
 * 	@date 2018/3/20
 * **/
public interface BaseDao<T> {
	
	
	/**
	 * 新增数据
	 * 
	 * @name  insert
	 * @param T , String 
	 * @return int
	 * **/
	int insert(Object data,String _tableName);
	
	
	/**
	 * 删除数据
	 * @name remove
	 * @param Object
	 * @return int
	 * **/
	int remove(Object data);
	
	/**
	 * 查询所有数据
	 * @name findAll
	 * @param 
	 * @return List<T>
	 * **/
	List<T> finAll();
	
	/**
	 * 根据条件查询数据
	 * @name findOne
	 * @param Object
	 * @return T
	 * **/
	T finOne(Object data);

	
	/**
	 * 更新数据
	 * @name update
	 * @param T
	 * @return int
	 * **/
	int update(T data);
}
