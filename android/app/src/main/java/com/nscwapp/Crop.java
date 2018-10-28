package com.nscwapp;

import com.facebook.react.bridge.Promise;

/**
 * Created by Brucelin on 2018-06-13.
 */

interface Crop {

    /**
     *  调用安卓上传图片
     */


    void selectWithCrop(String savePath, String fileName, int code, Promise promise);
}
