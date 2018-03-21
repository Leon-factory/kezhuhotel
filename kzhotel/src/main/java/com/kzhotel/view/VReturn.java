package com.kzhotel.view;

import com.alibaba.fastjson.JSON;

/**
 * 返回值类
 * @author Administrator
 * @param <T>
 *
 */
public class VReturn<T> {
	
	/**
	 * 返回码
	 */
	private int errCode;

	/**
	 * 返回模型
	 */
	private T data;

	public int getErrCode() {
		return errCode;
	}

	public void setErrCode(int errCode) {
		this.errCode = errCode;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public VReturn(int errCode, T data) {
		super();
		this.errCode = errCode;
		this.data = data;
	}

	public VReturn() {
		super();
	}

	@Override
	public String toString() {
		return JSON.toJSONString(this);
	}
	
	
}
