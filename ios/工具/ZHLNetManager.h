//
//  ZHLNetManager.h
//  ShenZhenHG
//
//  Created by 曾惠龙 on 17/2/22.
//  Copyright © 2017年 yuexun. All rights reserved.
//

#import "AFHTTPSessionManager.h"

typedef NS_ENUM(NSInteger,FiletType){
    FiletTypeWorld  =0,    // 文档类型
    FiletTypeImage        //图片类型
};
typedef NS_ENUM(NSInteger,AFNetType){
    AFNetTypeGet,    //get 请求
    AFNetTypePost      //post 请求
};
@protocol ZHLNetDelegete <NSObject>
@end

@interface ZHLNetManager : AFHTTPSessionManager
@property(nonatomic,weak)id<ZHLNetDelegete> delegete;


/*
 urlstring: 请求的地址
 parameter: 请求参数
 showhud:显示加载情况
 hidehud：隐藏加载情况
 success:   请求成功的结果
 failure:   请求失败的结果
 
 */
/*
 get 请求
 */
-(void)networkingGet:(NSString *)urlString andParameter:(NSDictionary *)parameter showHudBlock:(void(^)(void))showHud hideHudBlock:(void(^)(void))hideHud andSuccess:(void(^)(id responseObject))success failure:(void(^)(NSError *error))failure;

/*
 post请求
 */
-(void)networkingPost:(NSString *)urlString andParameter:(NSDictionary *)parameter showHudBlock:(void(^)(void))showHud hideHudBlock:(void(^)(void))hideHud andSuccess:(void(^)(id responseObject))success failure:(void(^)(NSError *error))failure;
/*
 下载文件
 */
-(void)downLoadFile:(NSString *)urlString andfileType:(FiletType )filetype andNetType:(AFNetType )netType fileDownPath:(NSString *)fileDownPath success:(void(^)(id responseObject))success failure:(void(^)(NSError *error))failure fractionCompleted:(void(^)(double count))fractionCompleted;

/*
 上传文件
 */
-(void)uploadFile:(NSString *)urlstring parameter:(id)parameter data:(NSData *)data name:(NSString *)name fileName:(NSString *)fileName success:(void(^)(id response))success failure:(void(^)(NSError *error))failure fractionCompleted:(void(^)(double count))fractionCompleted;

-(void)cleanZHLManageFile;

@end
