package com.nscwapp.util;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.BitmapFactory.Options;
import android.hardware.Camera;
import android.hardware.Camera.PictureCallback;
import android.os.Bundle;
import android.os.Environment;
import android.view.KeyEvent;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceHolder.Callback;
import android.view.SurfaceView;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.nscwapp.R;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Act_takephoto extends BaseActivity implements OnClickListener{
	   private Button bntTakePic;  
	      private Button bntEnter;  
	      private Button bntCancel;  
	      private SurfaceView surfaceView ;  
//	      private FrameLayout fraShadeTop;  
	      private FrameLayout fraShadeBottom;  
	      private Camera camera;    
//	      private Camera.Parameters parameters = null;    
	      private WindowManager mWindowManager;  
	      private int windowWidth ;//��ȡ�ֻ���Ļ���  
	      private int windowHight ;//��ȡ�ֻ���Ļ�߶�  
	      private String savePath = "/finger/";  
	      private Bundle bundle = null;// ����һ��Bundle���������洢����      
	      private int IS_TOOK = 0;//�Ƿ��Ѿ����� ,0Ϊ��  
	      
	    @Override  
	    protected void onCreate(Bundle savedInstanceState) {  
	        super.onCreate(savedInstanceState);  
	        setContentView(R.layout.act_takephoto);
	          
	        init();  
	          
	          
	    }  
	      
	    @SuppressWarnings("deprecation")  
	    private void init(){  
	        mWindowManager = (WindowManager) getSystemService(Context.WINDOW_SERVICE);  
	        windowWidth = mWindowManager.getDefaultDisplay().getWidth();  
	        windowHight = mWindowManager.getDefaultDisplay().getHeight();  
//	        fraShadeTop = (FrameLayout)findViewById(R.id.fra_shade_top);  
	        fraShadeBottom = (FrameLayout)findViewById(R.id.fra_shade_bottom);  
//	        RelativeLayout.LayoutParams topParams =(RelativeLayout.LayoutParams) fraShadeTop.getLayoutParams();  
//	        topParams.width = windowWidth;  
//	        topParams.height =(windowHight - windowWidth) / 2;  
//	        fraShadeTop.setLayoutParams(topParams);  
//	        fraShadeTop.getBackground().setAlpha(200);  
	          
	        RelativeLayout.LayoutParams bottomParams =(RelativeLayout.LayoutParams) fraShadeBottom.getLayoutParams();  
	        bottomParams.width = windowWidth;  
	        bottomParams.height =(windowHight - windowWidth) / 2;  
	        fraShadeBottom.setLayoutParams(bottomParams);  
	        fraShadeBottom.getBackground().setAlpha(200);  
	          
	        //��ť  
	        bntTakePic = (Button)findViewById(R.id.bnt_takepicture);  
	        bntEnter = (Button)findViewById(R.id.bnt_enter);  
	        bntCancel = (Button)findViewById(R.id.bnt_cancel);  
	          
	        bntTakePic.setVisibility(View.VISIBLE);  
	        bntEnter.setVisibility(View.INVISIBLE);  
	        bntCancel.setVisibility(View.INVISIBLE);  
	        bntTakePic.setOnClickListener(this);  
	        bntEnter.setOnClickListener(this);  
	        bntCancel.setOnClickListener(this);  
	          
	        //�����Ԥ���Ŀռ�  
	        surfaceView = (SurfaceView) this  
	                .findViewById(R.id.surfaceView);  
	        surfaceView.getHolder()  
	                .setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);  
	        surfaceView.getHolder().setFixedSize(150, 150); // ����Surface�ֱ���  
	        surfaceView.getHolder().setKeepScreenOn(true);// ��Ļ����  
	        surfaceView.getHolder().addCallback(new SurfaceCallback());// ΪSurfaceView�ľ�����һ���ص�����  
	    }  
	      
	    /** 
	     * ������ť����¼� 
	     */  
	    @Override  
	    public void onClick(View v) {  
	        // TODO Auto-generated method stub  
	        switch (v.getId()) {    
	            case R.id.bnt_takepicture:    
	                // ����    
	                 if (camera != null) {  
	                     camera.takePicture(null, null, new MyPictureCallback());    
	                 }  
	                break;    
	              
	            case R.id.bnt_enter:  
	                              
	                        finish();  
	                 break;   
	            case R.id.bnt_cancel:  
	                 bntTakePic.setVisibility(View.VISIBLE);  
	                 bntCancel.setVisibility(View.INVISIBLE);  
	                 bntEnter.setVisibility(View.INVISIBLE);  
	                 if (camera != null) {  
	                     IS_TOOK = 0;  
	                     camera.startPreview();  
	                 }  
	             break;  
	        }     
	    }  
	  
	    /** 
	     * �����Ƿ���SD�� 
	     * @true or false 
	     */  
	    public static boolean isHaveSDCard() {  
	        return Environment.MEDIA_MOUNTED.equals(Environment  
	                .getExternalStorageState());  
	    }  
	      
	    /** 
	     * �ع������� 
	     * @author  
	     * 
	     */  
	    private final class MyPictureCallback implements PictureCallback {    
	          
	        @Override    
	        public void onPictureTaken(byte[] data, Camera camera) {    
	            try {    
	                bundle = new Bundle();
	                bundle.putByteArray("bytes", data); //��ͼƬ�ֽ����ݱ�����bundle���У�ʵ�����ݽ���    
	                  
	           //     saveToSDCard(data); // ����ͼƬ��sd����    
//	                Toast.makeText(getApplicationContext(), "success",    
//	                        Toast.LENGTH_SHORT).show();    
	                bntTakePic.setVisibility(View.INVISIBLE);  
	                bntCancel.setVisibility(View.VISIBLE);  
	                bntEnter.setVisibility(View.VISIBLE);  
	              //  camera.startPreview(); // �����պ����¿�ʼԤ��    
	                camera.stopPreview();
	                IS_TOOK = 1; 
	                Intent intent = new Intent();
	                intent.putExtras(bundle);
	                setResult(RESULT_OK, intent);
	            } catch (Exception e) {    
	                e.printStackTrace();    
	            }    
	        }    
	    }    
	      
	    /**  
	     * ������������Ƭ�����SD����  
	     * @param data    
	     * @throws IOException  
	     */    
	    public void saveToSDCard(byte[] data) throws IOException {    
	        //����Ϊ������  
	        Bitmap b = byteToBitmap(data);  
	        Bitmap bitmap = Bitmap.createBitmap(b, 0, 0, windowWidth, windowWidth );   
	        //�����ļ�  
	        Date date = new Date();    
	        SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss"); // ��ʽ��ʱ��    
	        String filename = format.format(date) + ".jpg";    
	        File fileFolder = new File(Environment.getExternalStorageDirectory()    
	                + savePath);    
	        if (!fileFolder.exists()) { // ���Ŀ¼�����ڣ��򴴽�һ����Ϊ"finger"��Ŀ¼    
	            fileFolder.mkdir();    
	        }    
	        File jpgFile = new File(fileFolder, filename);    
	        FileOutputStream outputStream = new FileOutputStream(jpgFile); // �ļ������    
	        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);  
	        outputStream.flush();  
	  
	          
	     //   out.close();  
	      //  outputStream.write(data); // д��sd����    
	        outputStream.close(); // �ر������    
	        Intent intent = new Intent();  
	        intent.putExtra("path",Environment.getExternalStorageDirectory() + savePath + filename);  
	        setResult(1, intent);  
	    }    
	      
	    /** 
	     *  
	     */  
	    public void saveToRoot(byte[] data) throws IOException {    
	        //����Ϊ������  
	        Bitmap b = byteToBitmap(data);  
	        Bitmap bitmap = Bitmap.createBitmap(b, 0, 0, windowWidth, windowWidth );   
	        //�����ļ�  
	        Date date = new Date();    
	        SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss"); // ��ʽ��ʱ��    
	        String filename = format.format(date) + ".jpg";    
	        File fileFolder = new File(Environment.getRootDirectory()    
	                + savePath);    
	        if (!fileFolder.exists()) { // ���Ŀ¼�����ڣ��򴴽�һ����Ϊ"finger"��Ŀ¼    
	            fileFolder.mkdir();    
	        }    
	        File jpgFile = new File(fileFolder, filename);    
	        FileOutputStream outputStream = new FileOutputStream(jpgFile); // �ļ������    
	        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outputStream);  
	        outputStream.flush();  
	  
	          
	     //   out.close();  
	      //  outputStream.write(data); // д��sd����    
	        outputStream.close(); // �ر������    
	        Intent intent = new Intent();  
	        intent.putExtra("path",Environment.getExternalStorageDirectory() + savePath + filename);  
	        setResult(1, intent);  
	    }    
	      
	      
	      
	    /** 
	     * ��ͼƬbyte�����bitmap 
	     * @param data 
	     * @return 
	     */  
	    private Bitmap byteToBitmap(byte[] data){  
	        Options options = new Options();
	        options.inJustDecodeBounds = true;
	        Bitmap b = BitmapFactory.decodeByteArray(data, 0, data.length,options);
	        int i = 0;
	        while (true) {
	            if ((options.outWidth >> i <= 1000)
	                    && (options.outHeight >> i <= 1000)) {
	                options.inSampleSize = (int) Math.pow(2.0D, i);
	                options.inJustDecodeBounds = false;
	                b = BitmapFactory.decodeByteArray(data, 0, data.length,options);
	                break;
	            }
	            i += 1;
	        }
	        return b;

	    }

	    /**
	     * �ع��������ص���
	     * @author pc
	     *
	     */
	    private final class SurfaceCallback implements Callback {

	        @SuppressWarnings("deprecation")
	        @Override
	        public void surfaceChanged(SurfaceHolder holder, int format, int width,
	                int height) {
	            // TODO Auto-generated method stub
//	            parameters = camera.getParameters(); // ��ȡ�������
//	            parameters.setPictureFormat(PixelFormat.JPEG); // ����ͼƬ��ʽ
//	            parameters.setPreviewSize(width, height); // ����Ԥ����С
//	            parameters.setPreviewFrameRate(5);  //����ÿ����ʾ4֡
//	            parameters.setPictureSize(width, height); // ���ñ����ͼƬ�ߴ�
//	            parameters.setJpegQuality(80); // ������Ƭ����
	          //  camera.setParameters(parameters);
	        }

	        @SuppressWarnings("deprecation")
			@Override
	        public void surfaceCreated(SurfaceHolder holder) {
	            // TODO Auto-generated method stub
	            try {
	                camera = Camera.open(); // ������ͷ
	                camera.setPreviewDisplay(holder); // ����������ʾ����Ӱ���SurfaceHolder����
	                camera.setDisplayOrientation(getPreviewDegree(Act_takephoto.this));
	                camera.startPreview(); // ��ʼԤ��
	            } catch (Exception e) {
	                e.printStackTrace();
	                Toast.makeText(getApplicationContext(), "�������ʧ�ܣ�����Ӧ�ó���Ȩ�޹���������Ȩ��", Toast.LENGTH_LONG).show();
	            }
	        }

	        @Override
	        public void surfaceDestroyed(SurfaceHolder holder) {
	            // TODO Auto-generated method stub
	            if (camera != null) {
	            	camera.stopPreview();
	                camera.release(); // �ͷ������
	                camera = null;

	            }
	        }



	    }


	  /**
	   * �������¼�
	   */

	    @Override
	    public boolean onKeyDown(int keyCode, KeyEvent event) {
	        switch (keyCode) {
	        case KeyEvent.KEYCODE_CAMERA: // �������հ�ť
	            if (camera != null && event.getRepeatCount() == 0) {
	                // ����
	                //ע������takePicture()�������������Ǵ�����һ��PictureCallback���󡪡��������ȡ���������õ�ͼƬ����֮��
	                //��PictureCallback���󽫻ᱻ�ص����ö�����Ը������Ƭ���б����������
	                camera.takePicture(null, null, new MyPictureCallback());
	            }
	        case KeyEvent.KEYCODE_BACK:
	            if (IS_TOOK == 0)
	                finish();
	            else{
	            //  camera.startPreview();
	                bntCancel.performClick();
	                return false;
	            }

	            break;

	        }

	        return super.onKeyDown(keyCode, event);
	    }

	    // �ṩһ����̬���������ڸ����ֻ����������Ԥ��������ת�ĽǶ�
	    public static int getPreviewDegree(Activity activity) {
	        // ����ֻ��ķ���
	        int rotation = activity.getWindowManager().getDefaultDisplay()
	                .getRotation();
	        int degree = 0;
	        // �����ֻ��ķ���������Ԥ������Ӧ��ѡ��ĽǶ�
	        switch (rotation) {
	        case Surface.ROTATION_0:
	            degree = 90;
	            break;
	        case Surface.ROTATION_90:
	            degree = 0;
	            break;
	        case Surface.ROTATION_180:
	            degree = 270;
	            break;
	        case Surface.ROTATION_270:
	            degree = 180;
	            break;
	        }
	        return degree;
	    }




	    /**
	     * ͨ���ļ���ַ��ȡ�ļ���bitmap
	     * @param path
	     * @return
	     * @throws IOException
	     */

	    public static Bitmap getBitmapByPath(String path) throws IOException {
	        BufferedInputStream in = new BufferedInputStream(new FileInputStream(
	                new File(path)));
	        Options options = new Options();
	        options.inJustDecodeBounds = true;  
	        BitmapFactory.decodeStream(in, null, options);  
	        in.close();  
	        int i = 0;  
	        Bitmap bitmap = null;  
	        while (true) {  
	            if ((options.outWidth >> i <= 1000)  
	                    && (options.outHeight >> i <= 1000)) {  
	                in = new BufferedInputStream(  
	                        new FileInputStream(new File(path)));  
	                options.inSampleSize = (int) Math.pow(2.0D, i);  
	                options.inJustDecodeBounds = false;  
	                bitmap = BitmapFactory.decodeStream(in, null, options);  
	                break;  
	            }  
	            i += 1;  
	        }  
	        return bitmap;  
	    }  
	    
	    
}
