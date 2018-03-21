package com.kzhotel.controller;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.bson.Document;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.socket.TextMessage;

import com.alibaba.fastjson.JSON;
import com.kzhotel.BLL.MessageHandler;
import com.kzhotel.BLLI.IBllUser;

import me.persevere.util.MongoHandler;





@Controller
@RequestMapping("/transmit")
public class TransmitController {
	
	@Resource
	private MessageHandler handler;
	@Resource
	private IBllUser bllUser;
	
	
	
	/**
	 * create:2017-02-17
	 * 读取身份证第一步
	 * @author wyx
	 * @param eventCode
	 * @param comCode
	 * @return	"success"即成功
	 * 
	 */
	@RequestMapping(value="/readIdCardFirst",method=RequestMethod.POST)
	@ResponseBody
	public int readIdCardFirst(HttpServletRequest request,
			String eventCode,/*事件号*/
			String comCode,/*通讯号*/
			String type
			){
		int intselfuid=clspubcontrollerfunc.intNowUserId(request);
		if(intselfuid<1) {return -3335;}
		else if(!this.bllUser.hasPermision(intselfuid, "readIdCardFirst")){
			return -3333;
		}
		
		Map<String, String> map = new HashMap<String, String>();
		map.put("eventCode", eventCode);
		map.put("communicationCode", comCode);
		map.put("type", type);
		int r = MongoHandler.insertMongoByMaps("readIDCard", map);
		if(r > 0){
			return 1;
		}else {
			return -1;
		}
		
	}
	
	/**
	 * create:2017-02-17
	 * 读取身份证第二步
	 * @author wyx
	 * @param eventCode
	 * @return	0：eventCode匹配失败，1：eventCode匹配成功
	 */
	@RequestMapping("/readIdCardSecond")
	@ResponseBody
	public int readIdCardSecond(
			String eventCode
			){
		Document document = MongoHandler.findOneMongo("readIDCard", "eventCode", eventCode);
		if(document.isEmpty()){
			return -1;//mongo中不存在该数据
		}else{
			return 1;
		}
	}
	
	/**
	 * create:2017-02-17
	 * 读取身份证第三步
	 * @author wyx
	 * @param name
	 * @param sex
	 * @param nation
	 * @param birthDay
	 * @param address
	 * @param idCode
	 * @param idIssue
	 * @param effectiveBeginTime
	 * @param effectiveEndTime
	 * @param photoCode
	 * @return	0:照片上传服务器失败 		1:照片上传服务器成功
	 * @throws Exception 
	 */
	@RequestMapping("/readIdCardThird")
	@ResponseBody
	public int readIdCardThird(
			String eventCode,/*事件号*/
			String name,/*姓名*/
			String sex,/*性别*/
			String nation,/*民族*/
			String birthDay,/*出生日期*/
			String address,/*住址*/
			String idCode,/*身份证号*/
			String idIssue,/*签发机关*/
			String effectiveBeginTime,/*有效期起时间*/
			String effectiveEndTime,
			String photoCode/*照片信息*/
			) throws Exception{
		if(photoCode.length()<=0 || "".equals(photoCode)){
			return 0;
		}
		Document document = MongoHandler.findOneMongo("readIDCard", "eventCode", eventCode);
		if(document.isEmpty()){
			return -1;//mongo数据为空
		}
		
		IdCard id = new IdCard();
		id.setAddress(address);
		id.setBirthDay(new SimpleDateFormat("yyyyMMdd").parse(birthDay));
		id.setEffectiveBeginTime(new SimpleDateFormat("yyyyMMdd").parse(effectiveBeginTime));
		id.setEffectiveEndTime(new SimpleDateFormat("yyyyMMdd").parse(effectiveEndTime));
		id.setIdCode(idCode);
		id.setIdIssue(idIssue);
		id.setName(name);
		id.setNation(nation);
		id.setSex(sex);
		id.setComIdentity("2");
		id.setComInfo("201");
		id.setType(document.getString("type"));
		
		String fileName =  new UploadController().uploadIDCardFile(idCode, photoCode);
		
		int intreuslt = 0;
		if(fileName.length()>0){
			intreuslt=1;
			id.setPhotoCode(fileName);
		}
		boolean bolresult = this.handler.toSelf(new TextMessage(JSON.toJSONString(id)), document.getString("communicationCode"));
		if(bolresult){
			MongoHandler.deleteMongo("readIDCard", "eventCode", eventCode, 2);
		}
		return intreuslt;
		
	}
	
	/**
	 * create:2017-02-17
	 * 读取身份证失败
	 * @author wyx
	 * @param eventCode
	 * @param errorCode
	 * @throws Exception
	 */
	@RequestMapping("/readIdCardFailed")
	@ResponseBody
	public void readIdCardFailed(
			String eventCode,
			int errorCode
			) throws Exception{
		Document document = MongoHandler.findOneMongo("readIDCard", "eventCode", eventCode);
		if(document.isEmpty()){
			return ;
		}
		String comCode = document.getString("communicationCode");
		IdCard id = new IdCard();
		id.setComIdentity("2");
		if(errorCode == 1){
			id.setComInfo("299");//设备未找到
			this.handler.toSelf(new TextMessage(JSON.toJSONString(id)), comCode);
		}
		
		if(errorCode == 2){
			id.setComInfo("298");//未知错误
			this.handler.toSelf(new TextMessage(JSON.toJSONString(id)), comCode);
		}
	}
	
	class IdCard{
		private String name;
		private String sex;
		private String nation;
		private Date birthDay;
		private String address;
		private String idCode;
		private String idIssue;
		private Date effectiveBeginTime;
		private Date effectiveEndTime;
		private String photoCode;
		private String comInfo;
		private String comIdentity;
		private String type;
		
		public String getType() {
			return type;
		}
		public void setType(String type) {
			this.type = type;
		}
		public String getComIdentity() {
			return comIdentity;
		}
		public void setComIdentity(String comIdentity) {
			this.comIdentity = comIdentity;
		}
		public String getComInfo() {
			return comInfo;
		}
		public void setComInfo(String comInfo) {
			this.comInfo = comInfo;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getSex() {
			return sex;
		}
		public void setSex(String sex) {
			this.sex = sex;
		}
		public String getNation() {
			return nation;
		}
		public void setNation(String nation) {
			this.nation = nation;
		}
		public Date getBirthDay() {
			return birthDay;
		}
		public void setBirthDay(Date birthDay) {
			this.birthDay = birthDay;
		}
		public String getAddress() {
			return address;
		}
		public void setAddress(String address) {
			this.address = address;
		}
		public String getIdCode() {
			return idCode;
		}
		public void setIdCode(String idCode) {
			this.idCode = idCode;
		}
		public String getIdIssue() {
			return idIssue;
		}
		public void setIdIssue(String idIssue) {
			this.idIssue = idIssue;
		}
		public Date getEffectiveBeginTime() {
			return effectiveBeginTime;
		}
		public void setEffectiveBeginTime(Date effectiveBeginTime) {
			this.effectiveBeginTime = effectiveBeginTime;
		}
		public Date getEffectiveEndTime() {
			return effectiveEndTime;
		}
		public void setEffectiveEndTime(Date effectiveEndTime) {
			this.effectiveEndTime = effectiveEndTime;
		}
		public String getPhotoCode() {
			return photoCode;
		}
		public void setPhotoCode(String photoCode) {
			this.photoCode = photoCode;
		}
		
		
		
	}
	
}
