package com.kezhu.mongo.entity;

import java.io.Serializable;

public class rentCard implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String _id;
	
	private String _class;
	
	private String info;
	
	private String createtime;

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}

	public String get_class() {
		return _class;
	}

	public void set_class(String _class) {
		this._class = _class;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public String getCreatetime() {
		return createtime;
	}

	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}

	@Override
	public String toString() {
		return "rentCard [_id=" + _id + ", _class=" + _class + ", info=" + info + ", createtime=" + createtime + "]";
	}

	public rentCard(String _id, String _class, String info, String createtime) {
		super();
		this._id = _id;
		this._class = _class;
		this.info = info;
		this.createtime = createtime;
	}
	
	
	
}
