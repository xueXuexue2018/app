package com.nscwapp.util;

public class FileDescribe {
	
	private String id;//文件id
	
	private int requestType;//请求类型1上传2下载
	
	private String fileName;//文件名称
	
	private String savePath;//文件保存路径
	
	private int length;//文件长度
	private String session ;
	private String note;//备注
	

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getSession() {
		if(session == null){
			setSession(null);
		}
		return session;
	}

	public void setSession(String session) {
		if( session == null){
			this.session = "b73e70881edc4a4f8da7cd3311520930";
		}else{
			this.session = session;
		}
		
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public int getRequestType() {
		return requestType;
	}

	public void setRequestType(int requestType) {
		this.requestType = requestType;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getSavePath() {
		return savePath;
	}

	public void setSavePath(String savePath) {
		this.savePath = savePath;
	}

	public int getLength() {
		return length;
	}

	public void setLength(int length) {
		this.length = length;
	}





	
	
}
