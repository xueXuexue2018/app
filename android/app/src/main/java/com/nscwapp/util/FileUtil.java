package com.nscwapp.util;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;

import java.io.File;

public class FileUtil {
	public static Intent getAllIntent(String paramString) {
		Intent localIntent = new Intent();
		localIntent.addFlags(268435456);
		localIntent.setAction("android.intent.action.VIEW");
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "*/*");
		return localIntent;
	}

	public static Intent getApkFileIntent(String paramString) {
		Intent localIntent = new Intent();
		localIntent.addFlags(268435456);
		localIntent.setAction("android.intent.action.VIEW");
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "application/vnd.android.package-archive");
		return localIntent;
	}

	public static Intent getAudioFileIntent(String paramString) {
		Intent localIntent = new Intent("android.intent.action.VIEW");
		localIntent.addFlags(67108864);
		localIntent.putExtra("oneshot", 0);
		localIntent.putExtra("configchange", 0);
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "audio/*");
		return localIntent;
	}

	public static Intent getChmFileIntent(String paramString) {
		Intent localIntent = new Intent("android.intent.action.VIEW");
		localIntent.addCategory("android.intent.category.DEFAULT");
		localIntent.addFlags(268435456);
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "application/x-chm");
		return localIntent;
	}

	public static Intent getExcelFileIntent(String paramString) {
		Intent localIntent = new Intent("android.intent.action.VIEW");
		localIntent.addCategory("android.intent.category.DEFAULT");
		localIntent.addFlags(268435456);
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "application/vnd.ms-excel");
		return localIntent;
	}

	public static Intent getHtmlFileIntent(String paramString) {
		Uri localUri = Uri.parse(paramString).buildUpon().encodedAuthority("com.android.htmlfileprovider")
				.scheme("content").encodedPath(paramString).build();
		Intent localIntent = new Intent("android.intent.action.VIEW");
		localIntent.setDataAndType(localUri, "text/html");
		return localIntent;
	}

	public static Intent getImageFileIntent(String paramString) {
		Intent localIntent = new Intent("android.intent.action.VIEW");
		localIntent.addCategory("android.intent.category.DEFAULT");
		localIntent.addFlags(268435456);
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "image/*");
		return localIntent;
	}

	public static Intent getPdfFileIntent(String paramString) {
		Intent localIntent = new Intent("android.intent.action.VIEW");
		localIntent.addCategory("android.intent.category.DEFAULT");
		localIntent.addFlags(268435456);
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "application/pdf");
		return localIntent;
	}

	public static Intent getPptFileIntent(String paramString) {
		Intent localIntent = new Intent("android.intent.action.VIEW");
		localIntent.addCategory("android.intent.category.DEFAULT");
		localIntent.addFlags(268435456);
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "application/vnd.ms-powerpoint");
		return localIntent;
	}

	public static Intent getTextFileIntent(String paramString, boolean paramBoolean) {
		Intent localIntent = new Intent("android.intent.action.VIEW");
		localIntent.addCategory("android.intent.category.DEFAULT");
		localIntent.addFlags(268435456);
		if (paramBoolean) {
			localIntent.setDataAndType(Uri.parse(paramString), "text/plain");
			return localIntent;
		}
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "text/plain");
		return localIntent;
	}

	public static Intent getVideoFileIntent(String paramString) {
		Intent localIntent = new Intent("android.intent.action.VIEW");
		localIntent.addFlags(67108864);
		localIntent.putExtra("oneshot", 0);
		localIntent.putExtra("configchange", 0);
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "video/*");
		return localIntent;
	}

	public static Intent getWordFileIntent(String paramString) {
		Intent localIntent = new Intent("android.intent.action.VIEW");
		localIntent.addCategory("android.intent.category.DEFAULT");
		localIntent.addFlags(268435456);
		localIntent.setDataAndType(Uri.fromFile(new File(paramString)), "application/msword");
		return localIntent;
	}

	public static Intent openFile(String paramString) {
		File localFile = new File(paramString);
		if (!localFile.exists())
			return null;
		String str = localFile.getName()
				.substring(1 + localFile.getName().lastIndexOf("."), localFile.getName().length()).toLowerCase();
		if ((str.equals("m4a")) || (str.equals("mp3")) || (str.equals("mid")) || (str.equals("xmf"))
				|| (str.equals("ogg")) || (str.equals("wav")))
			return getAudioFileIntent(paramString);
		if ((str.equals("3gp")) || (str.equals("mp4")))
			return getAudioFileIntent(paramString);
		if ((str.equals("jpg")) || (str.equals("gif")) || (str.equals("png")) || (str.equals("jpeg"))
				|| (str.equals("bmp")))
			return getImageFileIntent(paramString);
		if (str.equals("apk"))
			return getApkFileIntent(paramString);
		if ((str.equals("ppt")) || (str.equals("pptx")))
			return getPptFileIntent(paramString);
		if ((str.equals("xls")) || (str.equals("xlsx")))
			return getExcelFileIntent(paramString);
		if ((str.equals("doc")) || (str.equals("docx")))
			return getWordFileIntent(paramString);
		if (str.equals("pdf"))
			return getPdfFileIntent(paramString);
		if (str.equals("chm"))
			return getChmFileIntent(paramString);
		if (str.equals("txt"))
			return getTextFileIntent(paramString, false);
		return getAllIntent(paramString);
	}

	// ��ȡ�����ļ�·��
	public static String getFileDownLoadPath(Context mContext) {
		String str = getSDPath() + File.separator + "Android" + File.separator + "data" + File.separator
				+ mContext.getPackageName() + File.separator + "FuJian";
		File localFile = new File(str);
		if (!localFile.exists())
			localFile.mkdirs();
		return str;
	}

	// ��ȡsd��·��
	public static String getSDPath() {
		boolean bool = Environment.getExternalStorageState().equals("mounted");
		File localFile = null;
		if (bool)
			localFile = Environment.getExternalStorageDirectory();
		if (localFile != null)
			return localFile.toString();
		return "";
	}

	// ��ȡͼƬ����λ��
	public static String getNewsPictureDownLoadPath(Context mContext) {
		String str = getSDPath() + File.separator + "Android" + File.separator + "data" + File.separator
				+ mContext.getPackageName() + File.separator + "NewsPicture";
		File localFile = new File(str);
		if (!localFile.exists())
			localFile.mkdirs();
		return str;
	}

	// ��ȡͷ��λ��
	public static String getHeadPhotoDownLoadPath(Context mContext) {
		String str = getSDPath() + File.separator + "Android" + File.separator + "data" + File.separator
				+ mContext.getPackageName() + File.separator + "HeadPhoto";
		File localFile = new File(str);
		if (!localFile.exists())
			localFile.mkdirs();
		return str;
	}

	// ɾ���ļ����µ������ļ�
	public static void deleteFolderFile(String filePath, boolean deleteThisPath) {
		if (filePath != null) {
			try {
				File file = new File(filePath);
//				if(file.list().length == 0)
//					return;
				if (file.isDirectory()) {// ����Ŀ¼
					File files[] = file.listFiles();
					for (int i = 0; i < files.length; i++) {
						deleteFolderFile(files[i].getAbsolutePath(), true);
					}
				}
				if (deleteThisPath) {
					if (!file.isDirectory()) {// ������ļ���ɾ��
						file.delete();
					} else {// Ŀ¼
						if (file.listFiles().length == 0) {// Ŀ¼��û���ļ�����Ŀ¼��ɾ��
							file.delete();
						}
					}
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	//ɾ��ָ��·���µ��ļ�
	public static void deleteFileByFilePath(String filePath){
		File deleteFile = new File(filePath);
		deleteFile.delete();
	}
	

}
