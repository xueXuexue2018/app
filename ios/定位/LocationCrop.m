//
//  LocationCrop.m
//  nscwApp
//
//  Created by yuexun on 2018/6/12.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "LocationCrop.h"
#import "Crop.h"
@interface LocationCrop ()
@property(strong,nonatomic)Crop *crop;
@end
@implementation LocationCrop
RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

-(Crop*)_crop:(UIViewController *)vc{
  if (self.crop==nil) {
    self.crop=[[Crop alloc]initWithViewController:vc];
  }
  return self.crop;
}
@end
