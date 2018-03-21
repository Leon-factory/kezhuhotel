package com.kzhotel.view;

import com.kzhotel.model.ReceptionDetail;

/**
 * 用于交叉使用的宾客账单
 * @author Administrator
 *
 */
public class VReceptionDetail extends ReceptionDetail {

	private String _checkoutTime;
	private String _createTime;
	
	public String get_checkoutTime() {
		return _checkoutTime;
	}
	public void set_checkoutTime(String _checkoutTime) {
		this._checkoutTime = _checkoutTime;
	}
	public String get_createTime() {
		return _createTime;
	}
	public void set_createTime(String _createTime) {
		this._createTime = _createTime;
	}
	
	
}
