package com.nscwapp.util;

import java.util.HashMap;
import java.util.Map;

public class UrlInfo {
/*
	// 互联网测试地址
	public final static String HttpHead = "http://120.76.84.8:8080";
	// 推送服务ip地址 互联网测试地址
	public final static String ImServerIp = "120.76.84.8";
	// 推送服务端口
	public final static int ImServerPort = 15820;
	// 文件服务 互联网测试服务器
	public final static String FileServerIp = "120.76.84.8";
	// 文件服务端口
	public final static int SocketPort = 9000;
	// 文件服务令牌
	public final static String FileSession = "bb7d3fb0b3f046f0b7cd48eb25cc2cfb";

	
	*/
	
	/* 正式发布 */

	// 正式服务器推送
	public final static String ImServerIp = "14.23.171.10";
	// 推送服务端口
	public final static int ImServerPort = 15820;
	// 正式服务 公网
	public final static String HttpHead = "http://14.23.171.10:8080";
	// 文件服务 正式服务器
	public final static String FileServerIp = "14.23.171.10";
	// 文件服务端口
	public final static int SocketPort = 9000;
	// 文件服务令牌
	public final static String FileSession = "bb7d3fb0b3f046f0b7cd48eb25cc2cfb";
	
	private Map<Integer, String> UrlMap;

	// 登陆接口
	public final static int FlagCheckLogin = 1;
	public final static String UrlCheckLogin = HttpHead + "/carManage/phone/login/checkLogin";

	// /carManage/phone/carlocation/addCarLocation
	// 移动端上传位置信息记录
	// CarLocation-车辆位置信息表
	public final static int FlagAddCarLocation = 2;
	public final static String UrlAddCarLocation = HttpHead + "/carManage/phone/carlocation/addCarLocation";

	public Map<Integer, String> getMap() {
		Map<Integer, String> map = new HashMap<Integer, String>();
		map.put(FlagCheckLogin, UrlCheckLogin);
		map.put(FlagAddCarLocation, UrlAddCarLocation);
		return map;
	}

	public Map<Integer, String> getUrlMap() {
		return getMap();
	}

	public void setUrlMap(Map<Integer, String> urlMap) {
		UrlMap = urlMap;
	}

}
