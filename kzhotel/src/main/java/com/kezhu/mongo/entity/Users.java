package com.kezhu.mongo.entity;

import java.io.Serializable;

public class Users implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private String _id;
	
	private String name;
	
	private Integer age;
	
	private String _class;
	
	


	public Users(String _id, String name, Integer age, String _class) {
		super();
		this._id = _id;
		this.name = name;
		this.age = age;
		this._class = _class;
	}




	@Override
	public String toString() {
		return "Users [_id=" + _id + ", name=" + name + ", age=" + age + ", _class=" + _class + "]";
	}




	public String get_id() {
		return _id;
	}




	public void set_id(String _id) {
		this._id = _id;
	}




	public String getName() {
		return name;
	}




	public void setName(String name) {
		this.name = name;
	}




	public Integer getAge() {
		return age;
	}




	public void setAge(Integer age) {
		this.age = age;
	}




	public String get_class() {
		return _class;
	}




	public void set_class(String _class) {
		this._class = _class;
	}




	public static long getSerialversionuid() {
		return serialVersionUID;
	}




	public Users() {};
}
