package com.nscwapp.util;

import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FileUploadClientMethod {//�����ѯ����

	private static  String serverIp="127.0.0.1";//�ļ�������ip
	
	private static Integer socketPort=9000;//�ļ��������˿�
	
	private static String fileSession="bb7d3fb0b3f046f0b7cd48eb25cc2cfb";
	
	public static Map<Object,Object> processMap=new HashMap<Object,Object>();//������Ϣ
	
	private static final int bufferSize=1024;//ÿ�η�Ƭ�����ݰ���С
	
	public FileUploadClientMethod(String serverIp, int socketPort, String fileSession){
		FileUploadClientMethod.serverIp=serverIp;
		FileUploadClientMethod.socketPort=socketPort;
		FileUploadClientMethod.fileSession=fileSession;
	}
	
	public static void main(String[] args) {
		try{
			
			//������ͨ�ϴ��ļ�
//			FileInputStream fis=new FileInputStream("D://gzyx-meeting//temp//f9cfbf6b179746f6a6f4d8d65fb6a922.jpg");
//			String savePath="D://test2//";
//			String fileName="test.jpg";
//			String id="123";
//			boolean result=new FileUploadClientMethod(serverIp,socketPort,fileSession).uploadFile(id, savePath,fileName,fis);
//			System.out.println("�ϴ������"+result);
			
//			FileInputStream fis=new FileInputStream("D:\\gzyx-meeting\\temp\\f9cfbf6b179746f6a6f4d8d65fb6a922.jpg");
//			String savePath="D:\\gzyx-meeting\\qrCode\\";
//			String fileName="f9cfbf6b179746f6a6f4d8d65fb6a922.jpg";
//			String id="123";
//			boolean result=new FileUploadClientMethod(serverIp,socketPort,fileSession).uploadFile(id, savePath,fileName,fis);
//			System.out.println("�ϴ������"+result);
			
			FileInputStream fis=new FileInputStream("D:\\gzyx-meeting\\temp\\c960f0d0e6c348c19514f5090b495166.jpg");
			String savePath="D:\\gzyx-meeting\\qrCode\\";
			String fileName="c960f0d0e6c348c19514f5090b495166.jpg";
			String id="99b027c5a0a04d6a8de6feeaefe3e3be";
			boolean result=new FileUploadClientMethod(serverIp,socketPort,fileSession).uploadFile(id, savePath,fileName,fis);
			System.out.println("�ϴ������"+result);
			
			
			//���������ļ������byte[]
//			String savePath="D://test1//";
//			String fileName="test.jpg";
//			byte[] buf=new FileUploadClientMethod(serverIp,socketPort,fileSession).downloadFileToBytes("123",savePath,fileName);
//			System.out.println("���յ����ļ����ȣ�"+buf.length);
//			FileOutputStream fos = new FileOutputStream("D://test//"+fileName);
//			fos.write(buf);
//			fos.flush();
//			fos.close();
			
			
			//������ͨ�����ļ��������ڱ���ָ��Ŀ¼����
//			String filePath="D://test1//";
//			String fileName="test2.jpg";
//			String savePath="D://test2//";
//			String saveName="test3.jpg";
//			new FileUploadClientMethod().downloadFileToSavePath("123", filePath, fileName, savePath, saveName);
			
			
			//���Զϵ�����
//			String localFilePath="D://test2//test.jpg";
//			long size=new FileUploadClientMethod().breakDownloadFile("123",localFilePath,"D://test1//","test2.jpg");
//			System.out.println(size);
			
			
			//���Բ�ѯ�ļ��Ƿ��ϴ��ɹ�
//			boolean bool=new FileUploadClientMethod().checkIsUpload("123");
//			System.out.println("�ϴ������"+bool);
			
			
			//����ɾ���ļ�
//			boolean bool=new FileUploadClientMethod().deleteFile("D://test2//","test3.jpg");
//			System.out.println(bool);
			
			
			//�����޸��ļ�
//			boolean bool=new FileUploadClientMethod().renameFile("D://test2//","test2.jpg","test3.jpg");
//			System.out.println(bool);
			
			
			//���Ը��Ʒ������ϵ��ļ�copyFile
//			boolean bool=new FileUploadClientMethod().copyFile("D://test2//","D://usr//","test.jpg","test.jpg");
//			System.out.println(bool);
			
			
			//���Ի�ȡĿ¼�µ������ļ���
//			List<String> list=new FileUploadClientMethod().findAllFileNameByFilePath("D://test2//");
//			Gson gson=new Gson();
//			System.out.println(gson.toJson(list));
			
			
			//���Բ�ѯ�ļ�����
//			String filePath="D://test2//";
//			String fileName="test3.jpg";
//			long length=new FileUploadClientMethod().findFileLength(filePath,fileName);
//			System.out.println(length);
			
			
			//���Զϵ������ļ�
//			String filePath="D://test2//";
//			String fileName="test1.jpg";
//			long length=new FileUploadClientMethod().findFileLength(filePath,fileName);
//			FileInputStream fis=new FileInputStream("D://test1//test.jpg");
//			//���Ա����ļ��ϵ��ϴ�
//			boolean bool=new FileUploadClientMethod().breakUploadOfFile("123",filePath,fileName,"D://test1//test2.jpg",(int)length);
			//�����ļ��������ϵ��ϴ�
//			boolean bool=new FileUploadClientMethod().breakUploadOfFileInputStream("123",filePath,fileName,fis,(int)length);
//			System.out.println(bool);
			
			//�����ϴ���;�жϵ����
//			test1();
			
			//���Խ�����ͼƬ��ʽת����jpg
//			boolean bool=new FileUploadClientMethod(serverIp,socketPort,fileSession).switchPictureToJpg("D://temp//","D://test//","book.png","1.jpg");
//			System.out.println(bool);
			
			//���ĵ�ת����jpgͼƬ
//			long count=new FileUploadClientMethod(serverIp,socketPort,fileSession).switchOfficeToJpg("D://temp//", "D://test//","test2.pptx","pptx");
//			System.out.println(count);
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * �ϴ��ļ�
	 * @param id     	Ψһ��ʶ��������ѯ����
	 * @param filePath  �ļ���������ŵ�Ŀ¼
	 * @param fileName	�ļ���������ŵ��ļ���		
	 * @param fis		�ļ�������
	 * @return			�ļ����������صĽ��
	 * @throws Exception
	 */
	//���ļ��������ϴ��ļ�,id��������ѯ���ȵ�
	public boolean uploadFile(String id,String filePath,String fileName,FileInputStream fis) throws Exception{
		DataInputStream dis=null;
		DataOutputStream dos=null;
		Socket socket=null;
		boolean bool=false;
		try{
			
			int fileLen=fis.available();
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setId(id);
			fd.setRequestType(1);
			fd.setSavePath(filePath);
			fd.setFileName(fileName);
			fd.setLength(fileLen);
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dis = new DataInputStream(fis); 
			dos = new DataOutputStream(socket.getOutputStream()); 
			dos.writeUTF(json);  
			dos.writeLong(fileLen);  
            byte[] buf = new byte[bufferSize];
            int passedlen=0;
            while (true) {  
                int read = 0;  
                if (dis!=null) {  
                    read = dis.read(buf);//DataInputStream������ĩβ�򷵻�-1�����򷵻ض������ֽ���
                }  
                if (read == -1) {  
                    break;  
                }  
                passedlen += read;
                processMap.put(fd.getId(),(passedlen*100 / fileLen) + "%");
                System.out.println("�ļ��ϴ���" + (passedlen*100 / fileLen) + "%");
                dos.write(buf, 0, read);  
            }  
            dos.flush();
            socket.shutdownOutput();
            dis=new DataInputStream(socket.getInputStream());
            String result=dis.readUTF();
            if("OK".equals(result)){
				Log.i("Test12", "uploadSuccess== " );
            	bool=true;
            }
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=fis){
					
					fis.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return bool;
	} 
	
	/**
	 * �ļ����ز���ֵ�Ž������
	 * @param id		Ψһ��ʶ��������ѯ�ϴ�����
	 * @param os		�������������ֱ���������ҳ��
	 * @param filePath	�ļ���������ŵ�Ŀ¼
	 * @param fileName	�ļ���������ŵ��ļ���
	 * @throws Exception
	 */
	//start-�Ӻδ���ʼ��Ϊ�˷���ϵ����أ�OutputStream-�����
	public void downloadFileToOutputStream(String id,OutputStream os,String filePath,String fileName) throws Exception{
		Socket socket=null;
		DataOutputStream dos=null;
		DataInputStream dis=null;
		try{
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setRequestType(2);
			fd.setSavePath(filePath);
			fd.setFileName(fileName);
		    Gson gson=new Gson();
			String json=gson.toJson(fd);
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream());
			dos.writeUTF(json);
			dos.flush();
			socket.shutdownOutput();
			dis=new DataInputStream(new BufferedInputStream(socket.getInputStream()));  
			long len=0;
			len = dis.readLong();
			byte[] buf = new byte[bufferSize];  
			int passedlen = 0;  
	        while (true) {  
	             int read = 0;  
	             if (dis != null) {  
	                 read = dis.read(buf);  
	             }  
	             passedlen += read;  
	             if (read == -1) {  
	                 break;  
	             }  
	             //�������ؽ���
	             processMap.put(id,(passedlen*100/len)+"%");
	             // �����������Ϊͼ�ν����prograssBar���ģ���������Ǵ��ļ������ܻ��ظ���ӡ��һЩ��ͬ�İٷֱ�  
	             System.out.println("�ļ�������" + (passedlen * 100 / len)+"%\n");  
	             os.write(buf, 0, read);  
	        } 
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * �����ļ��Ž�byte����
	 * @param id		Ψһ��ʶ��������ѯ�ϴ����ؽ���
	 * @param filePath	�ļ��������ļ��Ĵ��Ŀ¼
	 * @param fileName	�ļ��������ļ����ļ���
	 * @return	byte����
	 * @throws Exception
	 */
	//start-�Ӻδ���ʼ��OutputStream-�����
	public byte[] downloadFileToBytes(String id,String filePath,String fileName) throws Exception{
		Socket socket=null;
		DataOutputStream dos=null;
		DataInputStream dis=null;
		byte[] buf = null;
		try{
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setRequestType(2);
			fd.setSavePath(filePath);
			fd.setFileName(fileName);
		    Gson gson=new Gson();
			String json=gson.toJson(fd);
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream());
			dos.writeUTF(json);
			dos.flush();
			socket.shutdownOutput();
			dis=new DataInputStream(new BufferedInputStream(socket.getInputStream()));  
			long len = dis.readLong();
			byte[] temp = new byte[bufferSize];  
			buf=new byte[(int)len];
			int passedlen = 0;  
			int bufStart=0;
	        while (true) {  
              int read = 0;  
              if (dis != null) {  
                 read = dis.read(temp);  
              }  
              passedlen += read;  
              if (read == -1) {  
                 break;  
              }  
              //�������ؽ���
              processMap.put(id,(passedlen*100/len)+"%");
              // �����������Ϊͼ�ν����prograssBar���ģ���������Ǵ��ļ������ܻ��ظ���ӡ��һЩ��ͬ�İٷֱ�  
              System.out.println("�ļ�������" + (passedlen * 100 / len)+"%\n");  
              int tt=0;
              for(int i=0;i<temp.length;i++){
            	  tt=bufStart+i;
            	  if(tt>buf.length-1){
            		  break;
            	  }else{
            		  buf[tt]=temp[i];
            	  }
              }  
              bufStart=passedlen;
	        } 
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return buf;
	}
	
	/**
	 * �����ļ����浽����ָ����Ŀ¼
	 * @param id		Ψһ��ʶ��������ѯ����
	 * @param filePath	�ļ��������ļ��Ĵ��Ŀ¼
	 * @param fileName	�ļ��������ļ����ļ���
	 * @param savePath	���ر����Ŀ¼
	 * @param saveName	���ر�����ļ���
	 * @return			�ļ��ĳ���
	 * @throws Exception
	 */
	//�����ļ�����ŵ�ָ��Ŀ¼
	public long downloadFileToSavePath(String id,String filePath,String fileName,String savePath,String saveName) throws Exception{
		Socket socket=null;
		DataOutputStream dos=null;
		DataInputStream dis=null;
		FileOutputStream fos=null;
		long length=0;
		try{
				File savePathDir=new File(savePath);
				if(!savePathDir.exists()){
					savePathDir.mkdirs();
				}
				fos=new FileOutputStream(savePath+saveName);
				FileDescribe fd=new FileDescribe();
				fd.setSession(fileSession);
				fd.setRequestType(2);
				fd.setSavePath(filePath);
				fd.setFileName(fileName);
			    Gson gson=new Gson();
				String json=gson.toJson(fd);
				socket=new Socket();//serverIp,socketPort
				socket.setSoTimeout(30000);
				socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
				dos = new DataOutputStream(socket.getOutputStream());
				dos.writeUTF(json);
				dos.flush();
				socket.shutdownOutput();
				dis=new DataInputStream(new BufferedInputStream(socket.getInputStream()));  
				length = dis.readLong();
			    byte[] buf = new byte[bufferSize];  
			    int passedlen = 0;  
	            while (true) {  
	               int read = 0;  
	               if (dis != null) {  
	                 read = dis.read(buf);  
	               }  
	               passedlen += read;  
	               if (read == -1) {  
	                 break;  
	               }  
	               //�������ؽ���
	               processMap.put(id,(passedlen*100/length)+"%");
	               // �����������Ϊͼ�ν����prograssBar���ģ���������Ǵ��ļ������ܻ��ظ���ӡ��һЩ��ͬ�İٷֱ�  
	               System.out.println("�ļ�������" + (passedlen * 100 / length)+"%\n");  
	               fos.write(buf, 0, read);  
	            } 
	             fos.flush();
			
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
				if(null!=fos){
					fos.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return length;
	}
	
	/**
	 * �ϵ������ļ�
	 * @param id			Ψһ��ʶ
	 * @param localFilePath	�����ļ�
	 * @param filePath
	 * @param fileName
	 * @return
	 * @throws Exception
	 */
	//�ϵ������ļ�,����ֵ���ļ��ܴ�С
	public long breakDownloadFile(String id,String localFilePath,String filePath,String fileName) throws Exception{
		long length=0;
		Socket socket=null;
		DataOutputStream dos=null;
		DataInputStream dis=null;
		try{
			long localFileLength=0;
			File temp=new File(localFilePath);
			if(!temp.exists()){//˵�������ļ������ڣ�����Ҫ�ϵ�����
				return -1;
			}else{
				localFileLength=temp.length();
			}
			RandomAccessFile raf = new RandomAccessFile(localFilePath,"rw");
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setId(id);
			fd.setRequestType(2);
			fd.setSavePath(filePath);
			fd.setFileName(fileName);
			fd.setNote(""+localFileLength);
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
        	dis=new DataInputStream(socket.getInputStream());
			dos=new DataOutputStream(socket.getOutputStream());
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			dos.writeUTF(json);
			dos.flush();
			socket.shutdownOutput();
			length=dis.readLong();
			raf.seek(localFileLength);
            byte[] buf = new byte[bufferSize]; 
        	int amount = 0;
        	int passedlen=(int)localFileLength;
          	while((amount = dis.read(buf))!=-1){
          		passedlen+=amount;
          		processMap.put(fd.getId(),(passedlen * 100 / length) + "%\n");
                System.out.println("�ļ�������" + (passedlen * 100 / length) + "%\n");
        		raf.write(buf,0,amount);
        		localFileLength = localFileLength + amount;
        	}
          	raf.close();
			socket.shutdownInput();
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return length;
	}
	
	/**
	 * ��ѯ�ļ��Ƿ��ϴ��ɹ�
	 * @param id		Ψһ��ʶ
	 * @return
	 * @throws Exception
	 */
	//��ѯ�ļ��Ƿ��ϴ��ɹ�
	public boolean checkIsUpload(String id) throws Exception{
		DataInputStream dis=null;
		DataOutputStream dos=null;
		Socket socket=null;
		boolean bool=false;
		try{
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setId(id);
			fd.setRequestType(3);
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream()); 
			dos.writeUTF(json);  
			dos.flush();
			socket.shutdownOutput();
			dis=new DataInputStream(socket.getInputStream()); 
			String result=dis.readUTF();
			if("OK".equals(result)){
				bool=true;
			}
			socket.shutdownInput();
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return bool;
	}
	
	/**
	 * ɾ���ļ�
	 * @param filePath		�ļ��������Ĵ��Ŀ¼
	 * @param fileName		�ļ��������Ĵ���ļ�����
	 * @return
	 * @throws Exception
	 */
	//ɾ���ļ�
	public boolean deleteFile(String filePath,String fileName) throws Exception{
		boolean bool=false;
		Socket socket=null;
		DataInputStream dis=null;
		DataOutputStream dos=null;
		try{
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			 dos = new DataOutputStream(socket.getOutputStream());
			 FileDescribe fd=new FileDescribe();
			 fd.setSession(fileSession);
			 fd.setRequestType(4);
			 fd.setSavePath(filePath);
			 fd.setFileName(fileName);
			 Gson gson=new Gson();
			 String json=gson.toJson(fd);
			 dos.writeUTF(json);
			 dos.flush();
			 socket.shutdownOutput();
			 dis=new DataInputStream(socket.getInputStream());
			 String result=dis.readUTF();
			 if("OK".equals(result)){
				 bool=true;
			 }
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return bool;
	}
	
	/**
	 * �������ļ�
	 * @param filePath		�ļ��������ϵĴ��Ŀ¼
	 * @param oldFileName	�ɵ��ļ���
	 * @param newFileName	�µ��ļ���
	 * @return
	 * @throws Exception
	 */
	//�޸��ļ���
	public boolean renameFile(String filePath,String oldFileName,String newFileName) throws Exception{
		boolean bool=false;
		Socket socket=null;
		DataInputStream dis=null;
		DataOutputStream dos=null;
		try{
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream()); 
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setRequestType(5);
			String fileName=oldFileName+"###"+newFileName;
			fd.setSavePath(filePath);
			fd.setFileName(fileName);
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			dos.writeUTF(json);  
			dos.flush();
			socket.shutdownOutput();
			dis=new DataInputStream(socket.getInputStream());
			String result=dis.readUTF();
			if("OK".equals(result)){
				bool=true;
			}
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return bool;
	}
	
	/**
	 * �����ļ����������е��ļ���ָ��Ŀ¼
	 * @param oldFilePath	�����ļ���·��
	 * @param newFilePath	Ҫ���Ƶ���Ŀ¼
	 * @param oldFileName	�����ļ����ļ���
	 * @param newFileName	Ҫ���Ƶ����ļ���
	 * @return	�Ƿ��Ƴɹ�
	 * @throws Exception
	 */
	//�����ļ�
	public boolean copyFile(String oldFilePath,String newFilePath,String oldFileName,String newFileName) throws Exception{
		boolean bool=false;
		Socket socket=null;
		DataInputStream dis=null;
		DataOutputStream dos=null;
		try{
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream()); 
			String savePath=oldFilePath+"###"+newFilePath;
			String fileName=oldFileName+"###"+newFileName;
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setRequestType(6);
			fd.setSavePath(savePath);
			fd.setFileName(fileName);
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			dos.writeUTF(json);
			dos.flush();
			socket.shutdownOutput();
			dis=new DataInputStream(socket.getInputStream());
			String result=dis.readUTF();
			if("OK".equals(result)){
				bool=true;
			}
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return bool;
	}
	
	/**
	 * �����ļ��е������ļ���
	 * @param filePath	�ļ�·��
	 * @return
	 * @throws Exception
	 */
	//�����ļ����µ������ļ���
	public List<String> findAllFileNameByFilePath(String filePath) throws Exception{
		List<String> list=null;
		Socket socket=null;
		DataInputStream dis=null;
		DataOutputStream dos=null;
		try{
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream()); 
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setRequestType(7);
			fd.setSavePath(filePath);
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			dos.writeUTF(json);
			dos.flush();
			socket.shutdownOutput();
			dis=new DataInputStream(socket.getInputStream());
			String result=dis.readUTF();
			if(null!=result&&result.length()>0){
				list=gson.fromJson(result,new TypeToken<List<String>>(){}.getType());
			}
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return list;
	}
	
	/**
	 * ��ѯ�ļ��ĳ��ȣ��������򷵻�0
	 * @param filePath	�ļ����ļ��������Ĵ��Ŀ¼
	 * @param fileName	�ļ����ļ����������ļ���
	 * @return
	 * @throws Exception
	 */
	//��ѯ�ļ��Ƿ��Ѿ����ڣ�����ļ������򷵻��ļ��Ĵ�С
	public long findFileLength(String filePath,String fileName) throws Exception{
		long length=0;
		Socket socket=null;
		DataInputStream dis=null;
		DataOutputStream dos=null;
		try{
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream()); 
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setRequestType(8);
			fd.setSavePath(filePath);
			fd.setFileName(fileName);
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			dos.writeUTF(json);
			dos.flush();
			socket.shutdownOutput();
			dis=new DataInputStream(socket.getInputStream());
			String result=dis.readUTF();
			if("OK".equals(result)){
				length=dis.readLong();
			}
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return length;
	}
	
	/**
	 * �ϵ�����
	 * @param id		Ψһ��ʶ��������ѯ�ϴ����صĽ���
	 * @param filePath	�ļ�·��
	 * @param fileName	�ļ���
	 * @param fis		�ļ�������
	 * @param start		��ʼ�ϴ���λ��
	 * @return		�Ƿ��ϴ��ɹ�
	 * @throws Exception
	 */
	//�ϵ�����
	public boolean breakUploadOfFileInputStream(String id,String filePath,String fileName,FileInputStream fis,int start) throws Exception{
		boolean bool=false;
		DataInputStream dis=null;
		DataOutputStream dos=null;
		Socket socket=null;
		try{
			long fileLen=fis.available();
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream()); 
			dos.writeLong(fileLen);
			dos.flush();
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setId(id);
			fd.setSavePath(filePath);
			fd.setFileName(fileName);
			fd.setRequestType(9);
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			dos.writeUTF(json);
			dos.flush();
			dis=new DataInputStream(fis);
			byte[] buf = new byte[bufferSize];  
			dis.skipBytes((int)start);
			int passedlen =start; 
	        while (true) {  
	            int read = 0;  
	            if (dis != null) {  
	                read = dis.read(buf);
	            }  
	            if (read == -1) {  
	                break;  
	            }  
                passedlen += read;
                processMap.put(fd.getId(),(passedlen * 100 / fileLen) + "%");
                System.out.println("�ļ��ϴ���" + (passedlen * 100 / fileLen) + "%");
	            dos.write(buf, 0, read);  
	        }  
	        dos.flush();
			socket.shutdownOutput();
			dis=new DataInputStream(socket.getInputStream());
			String result=dis.readUTF();
			if("OK".equals(result)){
				bool=true;
			}
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return bool;
	}
	
	/**
	 * �ϵ�����
	 * @param id		Ψһ��ʶ��������ѯ�ϴ����صĽ���
	 * @param filePath	�ļ����������ļ���ŵ�Ŀ¼
	 * @param fileName	�ļ����������ļ���ŵ��ļ���
	 * @param localPath	����Ҫ�ϴ��ļ�������Ŀ¼
	 * @param start		�ϴ��Ŀ�ʼλ��
	 * @return	�Ƿ��ϴ��ɹ�
	 * @throws Exception
	 */
	//�ϵ�����
	public boolean breakUploadOfFile(String id,String filePath,String fileName,String localPath,int start) throws Exception{
		boolean bool=false;
		DataInputStream dis=null;
		DataOutputStream dos=null;
		Socket socket=null;
		try{
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream()); 
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setId(id);
			fd.setSavePath(filePath);
			fd.setFileName(fileName);
			fd.setRequestType(9);
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			dos.writeUTF(json);
			dos.flush();
			long fileLen=0;
			File temp=new File(localPath);
			if(temp.exists()){
				fileLen=temp.length();
			}else{//�����ļ�������
				return false;
			}
			dos.writeLong(fileLen);
			dos.flush();
			RandomAccessFile raf = new RandomAccessFile(localPath,"r");
			raf.skipBytes((int)start);
	    	int serstart =0;
	        byte[] buf = new byte[bufferSize];
			int passedlen =start;
	    	while((serstart=raf.read(buf))!=-1){
	    		dos.write(buf,0,serstart);
	    		dos.flush();
	    		start+=serstart;
                passedlen += serstart;
                processMap.put(fd.getId(),(passedlen * 100 / fileLen) + "%");
                System.out.println("�ļ��ϴ���" + (passedlen * 100 / fileLen) + "%");
	    	}
	    	raf.close();
	    	socket.shutdownOutput();//�������ʹ��dos.close();�����socket���ر�
	    	dis=new DataInputStream(socket.getInputStream());
	    	String result=dis.readUTF();
	    	if("OK".equals(result)){
	    		bool=true;
	    	}
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return bool;
	}
	
	/**
	 * ��ͼƬת����jpg��ʽ
	 * @param oldFilePath	��ת����ͼƬ��Ŀ¼
	 * @param newFilePath   ��ͼƬ��Ŀ¼ 
	 * @param oldFileName   ��ת����ͼƬ������
	 * @param newFileName   ��ͼƬ������
	 * @return
	 * @throws Exception
	 */
	public boolean switchPictureToJpg(String oldFilePath,String newFilePath,String oldFileName,String newFileName) throws Exception{
		boolean bool=false;
		Socket socket=null;
		DataInputStream dis=null;
		DataOutputStream dos=null;
		try{
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(30000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream()); 
			String savePath=oldFilePath+"###"+newFilePath;
			String fileName=oldFileName+"###"+newFileName;
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setRequestType(10);
			fd.setSavePath(savePath);
			fd.setFileName(fileName);
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			dos.writeUTF(json);
			dos.flush();
			socket.shutdownOutput();
			dis=new DataInputStream(socket.getInputStream());
			String result=dis.readUTF();
			if("OK".equals(result)){
				bool=true;
			}
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return bool;
	}
	
	/**
	 * 
	 * @param oldFilePath  Ҫת�����ĵ�Ŀ¼
	 * @param newFilePath  ת��������ͼƬ�Ĵ��Ŀ¼
	 * @param fileName   Ҫת�����ļ���
	 * @param fileType   Դ�ļ�����
	 * @return  ����ֵ��ת�������ͼƬ����
	 * @throws Exception
	 */
	public long switchOfficeToJpg(String oldFilePath,String newFilePath,String fileName,String fileType) throws Exception{
		Socket socket=null;
		DataInputStream dis=null;
		DataOutputStream dos=null;
		long count=-1;
		try{
			socket=new Socket();//serverIp,socketPort
			socket.setSoTimeout(960000);
			socket.connect(new InetSocketAddress(serverIp,socketPort),30000);
			dos = new DataOutputStream(socket.getOutputStream()); 
			String savePath=oldFilePath+"###"+newFilePath;
			FileDescribe fd=new FileDescribe();
			fd.setSession(fileSession);
			fd.setRequestType(11);
			fd.setSavePath(savePath);
			fd.setFileName(fileName);
			fd.setNote(fileType);
			Gson gson=new Gson();
			String json=gson.toJson(fd);
			dos.writeUTF(json);
			dos.flush();
			socket.shutdownOutput();
			dis=new DataInputStream(socket.getInputStream());
			String result=dis.readUTF();
			if("OK".equals(result)){
				count=dis.readLong();
			}
		}catch(Exception e){
			e.printStackTrace();
			throw e;
		}finally{
			try {
				if(null!=dos){
					dos.close();
				}
				
				if(null!=dis){
					dis.close();
				}
				
				if(null!=socket){
					socket.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return count;
	}
	
	//ģ���ϴ���;�жϵ����
	public static void test1() throws Exception{
		DataInputStream dis=null;
		DataOutputStream dos=null;
		Socket socket=null;
		String savePath="D://test2//";
		String fileName="test1.jpg";
		FileInputStream fis=new FileInputStream("D://test1//test2.jpg");
		FileDescribe fd=new FileDescribe();
		String id="123abc";
		fd.setId(id);
		fd.setSavePath(savePath);
		fd.setFileName(fileName);
		fd.setRequestType(1);//�ϴ��ļ�
		Gson gson=new Gson();
		String json=gson.toJson(fd);
		socket=new Socket("192.168.1.15",9000);
		dis = new DataInputStream(fis);  
		dos = new DataOutputStream(socket.getOutputStream()); 
		dos.writeUTF(json);  
		dos.writeLong(fis.available());  
		int bufferSize = 402400;  
        byte[] buf = new byte[bufferSize];  
        int read = 0;  
        if (fis != null) {  
        	System.out.println("&&&&&&&&&&"+fis.available());
            read = fis.read(buf);  //DataInputStream������ĩβ�򷵻�-1�����򷵻ض������ֽ���
        }  
        dos.write(buf, 0, read); 
        dos.close();
        dis.close();
        socket.close();
	}
}
