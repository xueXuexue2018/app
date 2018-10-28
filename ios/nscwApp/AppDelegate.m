/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "ViewController.h"
#import <IQKeyboardManager.h>
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [IQKeyboardManager sharedManager].enable=YES;
  
   self.manage=[[BMKMapManager alloc]init];
    BOOL ret=[self.manage start:@"Sj24dwwOCWGZpdATjjhQQU9Y5wPjK1Nh" generalDelegate:self];
    if (!ret) {
      NSLog(@"manage start failed");
    }
    NSURL *jsCodeLocation;
    jsCodeLocation=[[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"nscwApp"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
   ViewController *rootViewController = [ViewController new];
  UINavigationController *nav=[[UINavigationController alloc]initWithRootViewController:rootViewController];
  _vc=rootViewController;
  rootViewController.view = rootView;
  _nav=nav;
  self.window.rootViewController = nav;
  
  [self.window makeKeyAndVisible];
  
  return YES;
}
-(void)onGetNetworkState:(int)iError{
  NSLog(@"网络-----%d");
}
-(void)onGetPermissionState:(int)iError{
  NSLog(@"授权======%d");
}
@end
