//
//  LocationViewController.h
//  nscwApp
//
//  Created by yuexun on 2018/6/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
typedef void(^PickSuccess)(NSDictionary *resultDic);
typedef void(^PickFailure)(NSString* message);
@interface LocationViewController : UIViewController
@property (nonatomic,copy)PickSuccess pickSuccess;
@property (nonatomic,copy)PickFailure pickFailure;
@property(strong,nonatomic)NSDictionary *optionDic;

-(void)creacteMap:(NSDictionary*)option successs:(PickSuccess)success failure:(PickFailure)failure;
@end
