package com.nscwapp.util;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;


public class BaseActivity extends Activity {
//	private List<Activity> activitys = new ArrayList<Activity>();
//	private MyApplication app = MyApplication.getInstance();
	private UrlInfo urlInfo;

//	public void addActivity(Activity paramActivity) {
//		this.activitys.add(paramActivity);
//	}

//	public void finishAllActivity() {
//		try {
//			Iterator<Activity> localIterator = this.activitys.iterator();
//			if (!localIterator.hasNext())
//				return;
//			((Activity) localIterator.next()).finish();
//		} catch (Exception localException) {
//		}
//	}

	protected void onCreate(Bundle paramBundle) {
		super.onCreate(paramBundle);
//		app.addActivity(this);
	}

	protected void onDestroy() {
		super.onDestroy();
//		app.removeActivity(this);
	}

//	public void removeActivity(Activity paramActivity) {
//		this.activitys.remove(paramActivity);
//	}

	public void start2ActWithBundle(Class<?> paramClass, Bundle paramBundle) {
		Intent localIntent = new Intent(this, paramClass);
		if (paramBundle != null)
			localIntent.putExtras(paramBundle);
		startActivity(localIntent);
	}



}
