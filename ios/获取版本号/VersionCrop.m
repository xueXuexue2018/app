//
//  VersionCrop.m
//  nscwApp
//
//  Created by yuexun on 2018/6/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "VersionCrop.h"
#import "Crop.h"
@interface VersionCrop ()
@property(strong,nonatomic)Crop *crop;
@end
@implementation VersionCrop
RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}
//暴露
RCT_EXPORT_METHOD(getVersion:(NSInteger)aspectX aspectY:(NSInteger)aspectY resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
  while (root.presentedViewController != nil) {
    root = root.presentedViewController;
  }
  NSString*aspectXStr=[NSString stringWithFormat: @"%ld",aspectX];
  NSString*aspectYStr=[NSString stringWithFormat: @"%ld",aspectY];
  [[self _crop:root]getVersion:@{@"aspectX":aspectXStr,@"aspectY":aspectYStr} successs:^(NSDictionary *resultDic) {
    //回调
    resolve(resultDic);
  } failure:^(NSString *message) {
     reject(@"fail",message,nil);
  }];
 
}
-(Crop*)_crop:(UIViewController *)vc{
  if (self.crop==nil) {
    self.crop=[[Crop alloc]initWithViewController:vc];
  }
  return self.crop;
}
@end
