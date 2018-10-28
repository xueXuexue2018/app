//
//  ZHLNetManager.m
//  ShenZhenHG
//
//  Created by 曾惠龙 on 17/2/22.
//  Copyright © 2017年 yuexun. All rights reserved.
//

#import "ZHLNetManager.h"

@implementation ZHLNetManager

-(void)networkingGet:(NSString *)urlString andParameter:(NSDictionary *)parameter showHudBlock:(void (^)(void))showHud hideHudBlock:(void (^)(void))hideHud andSuccess:(void (^)(id ))success failure:(void (^)(NSError *))failure{
    if (showHud) {
        showHud();
    }
    [self GET:urlString parameters:parameter progress:^(NSProgress * _Nonnull downloadProgress) {
        
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        if (showHud) {
            hideHud();
        }
            success(responseObject);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        if (showHud) {
            hideHud();
        }
        failure(error);
    }];
}
-(void)networkingPost:(NSString *)urlString andParameter:(NSDictionary *)parameter showHudBlock:(void (^)(void))showHud hideHudBlock:(void (^)(void))hideHud andSuccess:(void (^)(id))success failure:(void (^)(NSError *))failure{
    if (showHud) {
        showHud();
    }
    [self GET:urlString parameters:parameter progress:^(NSProgress * _Nonnull downloadProgress) {
        
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        if (showHud) {
            hideHud();
        }
        success(responseObject);
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        if (showHud) {
            hideHud();
        }
        failure(error);
    }];
    
   
}

-(void)downLoadFile:(NSString *)urlString andfileType:(FiletType )filetype andNetType:(AFNetType )netType fileDownPath:(NSString *)fileDownPath success:(void (^)(id))success failure:(void (^)(NSError *))failure fractionCompleted:(void (^)(double))fractionCompleted{
    self.responseSerializer=[AFHTTPResponseSerializer serializer];

    if (netType==AFNetTypeGet) {
        [self GET:urlString parameters:nil progress:^(NSProgress * _Nonnull downloadProgress) {
            
        } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
            if (success) {
                success(responseObject);
            }
        } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
            if (failure) {
                failure(error);
            }
        }];
    }else {
        [self POST:urlString parameters:nil progress:^(NSProgress * _Nonnull uploadProgress) {
            
        } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
            if (success) {
                success(responseObject);
            }
        } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
            if (failure) {
                failure(error);
            }
        }];
    
    }
    

}
-(void)uploadFile:(NSString *)urlstring parameter:(id)parameter data:(NSData *)data name:(NSString *)name fileName:(NSString *)fileName success:(void (^)(id))success failure:(void (^)(NSError *))failure fractionCompleted:(void (^)(double))fractionCompleted{
    [self POST:urlstring parameters:parameter constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {
        [formData appendPartWithFileData:data name:name fileName:fileName mimeType:@"application/octet-stream"];
        
    } progress:^(NSProgress * _Nonnull uploadProgress) {
        if (fractionCompleted) {
            fractionCompleted(uploadProgress.fractionCompleted);
        }
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        if (success) {
            success(responseObject);
        }
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        if (failure) {
            failure(error);
        }
    }];
    
    

}
//清除本地图片，文件
-(void)cleanZHLManageFile{
    //清除afnet的缓存
    [[NSURLCache sharedURLCache] removeAllCachedResponses];
}
@end
