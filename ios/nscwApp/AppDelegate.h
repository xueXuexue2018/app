/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#import "BaiduMapAPI_Base/BMKMapManager.h"
#import "BaiduMapAPI_Location/BMKLocationService.h"
#import "UserNotifications/UserNotifications.h"
@interface AppDelegate : UIResponder <UIApplicationDelegate,BMKGeneralDelegate>

@property (nonatomic, strong) UIWindow *window;
@property(nonatomic,strong)BMKMapManager *manage;
/**  */
@property (strong, nonatomic)  UINavigationController *nav;
/**  */
@property (strong, nonatomic)  UIViewController *vc;
@end
