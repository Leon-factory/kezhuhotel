package com.kezhu.mongo.entity;

import java.io.Serializable;

public class idCards{

	private String _id;
	
	private String info;
	
	private String creatime;

	public String get_id() {
		return _id;
	}

	public void set_id(String _id) {
		this._id = _id;
	}

	public String getInfo() {
		return info;
	}

	public void setInfo(String info) {
		this.info = info;
	}

	public String getCreatime() {
		return creatime;
	}

	public void setCreatime(String creatime) {
		this.creatime = creatime;
	}

	@Override
	public String toString() {
		return "idCards [_id=" + _id + ", info=" + info + ", creatime=" + creatime + "]";
	}

	public idCards(String _id, String info, String creatime) {
		super();
		this._id = _id;
		this.info = info;
		this.creatime = creatime;
	}
	
	public idCards() {};
}
