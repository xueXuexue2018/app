//
//  ImageCrop.m
//  nscwApp
//
//  Created by yuexun on 2018/6/12.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "ImageCrop.h"
#import "Crop.h"
#import "LocationViewController.h"
// 导入AppDelegate，获取UINavigationController
#import "AppDelegate.h"
@interface ImageCrop ()
@property(strong,nonatomic)Crop *crop;
@end
@implementation ImageCrop
RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
//获取图片
RCT_EXPORT_METHOD(selectWithCrop:(NSString*)fileName savePath:(NSString *)savePath Session:(NSString *)session resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
  while (root.presentedViewController != nil) {
    root = root.presentedViewController;
  }
  
  [[self _crop:root] selectImage:@{@"fileName":fileName,@"savePath":savePath,@"session":[NSString stringWithFormat:@"%@",session]} successs:^(NSDictionary *resultDic) {
   //回调
    resolve(resultDic[@"code"]?resultDic[@"code"]:@"-2");
  } failure:^(NSString *message) {
    reject(@"fail",message,nil);
  }];
}
// 获取定位
RCT_EXPORT_METHOD(getLocation:(NSString*)location resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
  while (root.presentedViewController != nil) {
    root = root.presentedViewController;
  }
 
  [[self _crop:root] getLocation:@{@"aspectX":location} successs:^(NSDictionary *resultDic) {
    //回调
    resolve(resultDic[@"location"]);
  } failure:^(NSString *message) {
    reject(@"fail",message,nil);
  }];
}
//获取地图
// RN跳转原生界面
// RNOpenOneVC指的就是跳转的方法，下面会用到
RCT_EXPORT_METHOD(RNOpenVC:(NSString*)XY resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  
  NSLog(@"RN传入原生界面的数据为:");
  //主要这里必须使用主线程发送,不然有可能失效
  dispatch_async(dispatch_get_main_queue(), ^{
    LocationViewController *one = [[LocationViewController alloc]init];
    
    AppDelegate *app = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [app.vc presentViewController:one animated:YES completion:nil];
    //    [app.nav pushViewController:one animated:YES];
    
    [one creacteMap:@{@"address":[NSString stringWithFormat:@"%@",XY]} successs:^(NSDictionary *resultDic) {
      resolve(resultDic);
    } failure:^(NSString *message) {
      reject(@"fail",message,nil);
    }];
    
  });
}
-(Crop*)_crop:(UIViewController *)vc{
  if (self.crop==nil) {
    self.crop=[[Crop alloc]initWithViewController:vc];
  }
  return self.crop;
}
@end
