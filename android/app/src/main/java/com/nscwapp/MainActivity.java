package com.nscwapp;

import com.facebook.react.ReactActivity;
//import com.learnium.RNDeviceInfo.R;  // <--- import
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "nscwApp";
    }

//    @Override
//    protected List<ReactPackage> getPackages() {
//        return Arrays.<ReactPackage>asList(
//                new RNDeviceInfo(), // <------ add here
//                new MainReactPackage());
//    }
}
