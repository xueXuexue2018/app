package com.nscwapp;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.widget.Toast;

import com.baidu.location.BDAbstractLocationListener;
import com.baidu.location.BDLocation;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Brucelin on 2018-06-13.
 */

public class ToastExample extends ReactContextBaseJavaModule implements Crop{
    private static final String LONG_TIME = "LONG";
    private static final String SHORT_TIME = "SHORT";
    private ReactApplicationContext reactContext;


    public ToastExample(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext=reactContext;
    }

    /**
     * return string 这个名字在JavaScript端标记这个模块
     * 这样就可以在JavaScript中通过React.NativeModules.ToastForAndroid访问到这个模块
     * */
    @Override
    public String getName() {
        return "ImageCrop";
    }

    /**
     * return 需要导出给JavaScript使用的常量。它并不一定需要实现，但在定义一些可以被JavaScript同步访问到的预定义的值时非常有用。
     * */
    @Override
    public Map<String, Object> getConstants() {
        //让js那边能够使用这些常量
        Map<String,Object> constants = new HashMap<>();
        constants.put(LONG_TIME, Toast.LENGTH_LONG);
        constants.put(SHORT_TIME,Toast.LENGTH_SHORT);
        return constants;
//        return super.getConstants();
    }

    public static Promise promise;
    /**
     * 调用安卓地图
     * */
    @ReactMethod
    public void RNOpenVC(String a,Promise promise){
        Intent intent = new Intent(reactContext, MapActivity.class);
        ToastExample.promise =promise;
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        reactContext.startActivity(intent);
    }

    public LocationClient mLocationClient = null;
    /**
     * 调用安卓定位地址
     * */
    @ReactMethod
    public void getLocation(String a,Promise promise){
        ToastExample.promise=promise;
        mLocationClient = new LocationClient(reactContext);
        MyLocationListener myListener = new MyLocationListener();
        //声明LocationClient类
        mLocationClient.registerLocationListener(myListener);
        LocationClientOption option = new LocationClientOption();
        option.setIsNeedAddress(true);
        mLocationClient.setLocOption(option);
        //开始定位
        mLocationClient.start();
    }

    /**
     * 调用安卓相机
     * */
    @ReactMethod
    public void selectWithCrop(String savePath, String fileName, int code, Promise promise){
//        getCrop().selectWithCrop("D:\\carManage\\trans\\pictures\\return\\","E:\\carManage\\trans\\pictures\\return\\","E:\\carManage\\oils\\pictures\\","af43bcbb3efe4cb9b170a4e78f02d4a2_1528962916269.jpg");
        getCrop().selectWithCrop(savePath,fileName,code,promise);
    }



    @Override
    public boolean canOverrideExistingModule() {
        //这里需要返回true
        return true;
    }






    private CropImpl cropImpl;
    private CropImpl getCrop(){
        if(cropImpl==null){
            cropImpl=CropImpl.of(getCurrentActivity());
            getReactApplicationContext().addActivityEventListener(cropImpl);
        }else {
            cropImpl.updateActivity(getCurrentActivity());
        }
        return cropImpl;
    }
    public class MyLocationListener extends BDAbstractLocationListener {


        @Override
        public void onReceiveLocation(BDLocation location){
            //此处的BDLocation为定位结果信息类，通过它的各种get方法可获取定位相关的全部结果
            //以下只列举部分获取地址相关的结果信息
            //更多结果信息获取说明，请参照类参考中BDLocation类中的说明

            String addr = location.getAddrStr();    //获取详细地址信息
            String country = location.getCountry();    //获取国家
            String province = location.getProvince();    //获取省份
            String city = location.getCity();    //获取城市
            String district = location.getDistrict();    //获取区县
            String street = location.getStreet();    //获取街道信息
            promise.resolve(addr);
        }
    }


}
