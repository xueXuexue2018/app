//
//  Crop.h
//  nscwApp
//
//  Created by yuexun on 2018/6/12.
//  Copyright © 2018年 Facebook. All rights reserved.
//
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "BaiduMapAPI_Location/BMKLocationService.h"
#import "BaiduMapAPI_Search/BMKSearchComponent.h"
@interface Crop:NSObject<UIImagePickerControllerDelegate,UINavigationControllerDelegate,BMKLocationServiceDelegate,BMKGeoCodeSearchDelegate>
-(instancetype)initWithViewController:(UIViewController *)vc;
typedef void(^PickSuccess)(NSDictionary *resultDic);
typedef void(^PickFailure)(NSString* message);
@property (nonatomic, retain) NSMutableDictionary *response;
@property (nonatomic,copy)PickSuccess pickSuccess;
@property (nonatomic,copy)PickFailure pickFailure;
@property(nonatomic,strong)UIViewController *viewController;
@property(nonatomic,strong)BMKLocationService *server;
@property(nonatomic,strong)BMKGeoCodeSearch *search;
@property(nonatomic,strong)BMKReverseGeoCodeOption *option;
//选图片
-(void)selectImage:(NSDictionary*)option successs:(PickSuccess)success failure:(PickFailure)failure;
//定位
-(void)getLocation:(NSDictionary*)option successs:(PickSuccess)success failure:(PickFailure)failure;
//获取版本号
-(void)getVersion:(NSDictionary*)option successs:(PickSuccess)success failure:(PickFailure)failure;
@end
