package com.nscwapp;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.nscwapp.util.Act_takephoto;
import com.nscwapp.util.FileUploadClientMethod;
import com.nscwapp.util.FileUtil;
import com.nscwapp.util.UrlInfo;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * Created by Brucelin on 2018-06-13.
 */

public class CropImpl implements ActivityEventListener,Crop {

    private Handler handler = new Handler() {

        @Override
        public void handleMessage(Message msg) {
            // TODO Auto-generated method stub
            super.handleMessage(msg);
            switch (msg.what) {
                case 0:
                    if (!uploadSuccess) {
//                        Toast.makeText(activity, "照片提交失败，请重新拍照", Toast.LENGTH_LONG).show();
                    } else {
//                        Log.d("Test", "调用jssubmitPhone");
//                        webview.loadUrl("javascript:submitPhone()");
                    }

                    break;
                case 1:
                    if (!uploadSuccess) {
//                        Toast.makeText(activity, "照片提交失败，请重新拍照", Toast.LENGTH_LONG).show();
                    } else {
//                        Log.d("Test", "调用jssubmitPhone");
//                        webview.loadUrl("javascript:submitPhone()");
                    }

                    break;
                case 2:
                    if (!uploadSuccess) {
//                        Toast.makeText(activity, "照片提交失败，请重新拍照", Toast.LENGTH_LONG).show();
                    } else {
//                        Log.d("Test", "调用jssubmitPhone");
//                        webview.loadUrl("javascript:dlRefuelingPictures()");
                    }
                    break;
                case 400:
//                    uploadSuccess = false;
//                    Toast.makeText(activity, "成功", Toast.LENGTH_LONG).show();
                    break;
                case 500:
                    uploadSuccess = false;
//                    Toast.makeText(activity, "抱歉，照片提交失败，检查网络是否能用", Toast.LENGTH_LONG).show();
                    break;

                default:
                    break;
            }
        }

    };

        private Activity activity;
        public static CropImpl of(Activity activity){
            return new CropImpl(activity);
        }

        private CropImpl(Activity activity) {
            this.activity = activity;
        }
        public void updateActivity(Activity activity){
            this.activity=activity;
        }
    private Bitmap assectBitmap;
    private Bitmap commitBitmap;
    private Bitmap commitOilsBitmap;
    private String assectPath,commitPath,commitOilsPath;
    private Promise promise;
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
// TODO Auto-generated method stub
            if (requestCode == 0 && resultCode == -1) {
                Bundle extras = data.getExtras();
                byte[] datad = (byte[]) extras.get("bytes");
                if (datad != null) {
                    assectBitmap = byteToBitmap(datad);
                } else {
                    assectBitmap = (Bitmap) extras.get("data");
                }

                uploadPhoto(assectPath, assectBitmap, assectFileName);
            }
            if (requestCode == 1 && resultCode == -1) {
                Bundle extras = data.getExtras();
                byte[] datad = (byte[]) extras.get("bytes");
                if (datad != null) {
                    commitBitmap = byteToBitmap(datad);
                } else {
                    commitBitmap = (Bitmap) extras.get("data");
                }

                uploadPhoto(commitPath, commitBitmap, commitFileName);
            }
            if (requestCode == 2 && resultCode == -1) {
                Bundle extras = data.getExtras();
                byte[] datad = (byte[]) extras.get("bytes");
                if (datad != null) {
                    commitOilsBitmap = byteToBitmap(datad);
                } else {
                    commitOilsBitmap = (Bitmap) extras.get("data");
                }

                uploadPhoto(commitOilsPath, commitOilsBitmap, commitOilsFileName);
            }
        }

    @Override
    public void onNewIntent(Intent intent) {

    }
    private boolean uploadSuccess;
    private String savePatha = Environment.getExternalStorageDirectory() + "/transferVehicle/";
    private String assectFileName = null;
    private String commitFileName = null;
    private String commitOilsFileName = null;
    public void startAcceptCamera(String fileName,int code) {
        assectFileName = fileName;
        commitFileName=fileName;
        commitOilsFileName=fileName;
        startCamera(code);
    }
    // 调用摄像头
    protected void startCamera(int code) {
        String model = android.os.Build.MODEL; // 手机型号
        if (model.startsWith("GALAXY") || model.startsWith("GT")) {
            Intent intent = new Intent(activity, Act_takephoto.class);
            activity.startActivityForResult(intent, code);
        } else {
            Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
            activity.startActivityForResult(intent, code);
        }

    }

    @Override
    public void selectWithCrop(String savePath, String fileName, int code, Promise promise) {
        this.assectPath=savePath;
        this.commitPath=savePath;
        this.commitOilsPath=savePath;
        this.promise=promise;
        startAcceptCamera(fileName,code);
    }

    /**
     * 把图片byte流编程bitmap
     *
     * @param data
     * @return
     */
    private Bitmap byteToBitmap(byte[] data) {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inJustDecodeBounds = true;
        Bitmap b = BitmapFactory.decodeByteArray(data, 0, data.length, options);
        int i = 0;
        while (true) {
            if ((options.outWidth >> i <= 1000) && (options.outHeight >> i <= 1000)) {
                options.inSampleSize = (int) Math.pow(2.0D, i);
                options.inJustDecodeBounds = false;
                b = BitmapFactory.decodeByteArray(data, 0, data.length, options);
                break;
            }
            i += 1;
        }
        return b;

    }

    // 保存并上传拍照
    private void uploadPhoto(final String savePath, Bitmap bitmap, final String fileName) {
        try {
            saveToSDCard(bitmap, fileName);
        } catch (IOException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }

        // ByteArrayOutputStream stream = new ByteArrayOutputStream();

        // bitmap.compress(Bitmap.CompressFormat.PNG, 100, stream);
        // final InputStream inputStream = new
        // ByteArrayInputStream(stream.toByteArray());
        new Thread(new Runnable() {

            @Override
            public void run() {
                // TODO Auto-generated method stub
               try {
                    FileInputStream inputStream = new FileInputStream(new File(savePatha + "/" + fileName));
                    Log.i("Test", "uploadSuccess== "+savePatha + "/" + fileName+"-----"+UrlInfo.FileServerIp+"/"+UrlInfo.SocketPort+"/"+
                            UrlInfo.FileSession+"----"+fileName+"/"+ savePath+"/"+fileName);

                    uploadSuccess = new FileUploadClientMethod(UrlInfo.FileServerIp, UrlInfo.SocketPort,
                            UrlInfo.FileSession).uploadFile(fileName, savePath, fileName, inputStream);
                    // uploadSuccess = FileUpload.uploadFile(savePath, fileName,
                    // inputStream);
                   promise.resolve(1);
                    Log.i("Test", "uploadSuccess== " + uploadSuccess);
                   handler.sendEmptyMessage(400);
                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    handler.sendEmptyMessage(500);
                   promise.resolve(2);
                    // uploadSuccess = false;
                    // Toast.makeText(getApplicationContext(),
                    // "抱歉，照片提交失败，检查网络是否能用", Toast.LENGTH_LONG).show();
                    e.printStackTrace();
                }
                FileUtil.deleteFileByFilePath(savePatha + "/" + fileName);
                Message msg = new Message();
                if (savePath == assectPath) {
                    msg.what = 0;
                }
                if (savePath == commitPath) {
                    msg.what = 1;
                }
                if (savePath == commitOilsPath) {
                    msg.what = 2;
                }
                handler.sendMessage(msg);

            }
        }).start();

    }
    /**
     * 将拍下来的照片存放在SD卡中
     *
     * @throws IOException
     */
    public void saveToSDCard(Bitmap bitmap, String fileName) throws IOException {
        // 生成文件
        String filename = fileName;
        File fileFolder = new File(savePatha);
        if (!fileFolder.exists()) { // 如果目录不存在，则创建一个名为"finger"的目录
            fileFolder.mkdir();
        }
        File jpgFile = new File(fileFolder, filename);
        FileOutputStream outputStream = new FileOutputStream(jpgFile); // 文件输出流
        bitmap.compress(Bitmap.CompressFormat.JPEG, 50, outputStream);
        outputStream.flush();// 写入到sd卡
        outputStream.close(); // 关闭输出流
    }
}
