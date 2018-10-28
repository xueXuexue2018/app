//
//  Crop.m
//  nscwApp
//
//  Created by yuexun on 2018/6/12.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "Crop.h"
#import <AssetsLibrary/AssetsLibrary.h>
#import <MobileCoreServices/MobileCoreServices.h>
#import "ZHLNetManager.h"
#define UPLOAD @"http://120.76.84.8:9090/FileUpload/uploadFileServlet"
//#define UPLOAD @"http://192.168.2.200:9090/carManage/phone/carTrans/phoneUploadMeetImage"
//在这个类中呢，我们实现了从相册选择照片以及裁切照片的功能：
@interface Crop ()
@property(strong,nonatomic)NSDictionary *optionDic;
@property(nonatomic,strong)NSString *type;
@end
@implementation Crop
-(instancetype)initWithViewController:(UIViewController *)vc{
  self=[super init];
  self.viewController=vc;
  return self;
}

-(void)selectImage:(NSDictionary*)option successs:(PickSuccess)success failure:(PickFailure)failure{
  self.pickSuccess=success;
  self.pickFailure=failure;
  self.optionDic=option;
 
  UIImagePickerController *picker=[[UIImagePickerController alloc]init];
  if ([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera]) {
    picker.sourceType=UIImagePickerControllerSourceTypeCamera;
    NSString *requiredtype=(NSString *)kUTTypeImage;
    NSArray *temp_MediaTypes=[NSArray arrayWithObject:requiredtype];
    [picker setMediaTypes:temp_MediaTypes];
    picker.delegate=self;
    picker.allowsEditing=YES;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    [self.viewController presentViewController:picker animated:YES completion:nil];
  });
}
//摄像头回调方法
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary<NSString *,id> *)info
{
  self.type=[info objectForKey:UIImagePickerControllerMediaType];
  UIImage *image=[info objectForKey:@"UIImagePickerControllerOriginalImage"];
 
  [self postImageToServer:image];
  [picker dismissViewControllerAnimated:YES completion:nil];
}
-(void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
{
  [picker dismissViewControllerAnimated:YES completion:nil];
}
-(void)postImageToServer:(UIImage *)info
{
  
  UIImage *image=info;
  CGSize imagesize=image.size;
  imagesize.height=626;
  imagesize.width=413;
  image=[self changeImagesize:image scaleTosize:imagesize];
 
  [self updateImagewithUrl:self.optionDic[@"savePath"] andimg:image];

  
}
-(void)updateImagewithUrl:(NSString *)url andimg:(UIImage *)image{
  
  NSLog(@"%@",url);
  ZHLNetManager *manage=[ZHLNetManager manager];
  manage.responseSerializer=[AFJSONResponseSerializer serializer];
  manage.requestSerializer=[AFHTTPRequestSerializer serializer];
  manage.requestSerializer.timeoutInterval=60;
  
  NSMutableString *mustr=[[NSMutableString alloc]init];
//  NSDictionary *dic=[NSDictionary dictionaryWithObjectsAndKeys:self.optionDic[@"session"],@"session",self.optionDic[@"fileName"],@"fileName",url,@"filePath",nil];
//  NSData *data=[NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:nil];
//  NSString *jsonStr=[[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
//  [mustr setString:jsonStr];
  
  NSDictionary *dic=[NSDictionary dictionaryWithObjectsAndKeys:@"b73e70881edc4a4f8da7cd3311520930",@"session",self.optionDic[@"fileName"],@"fileName",url,@"savePath",nil];
  NSData *data=[NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:nil];
  NSString *jsonStr=[[NSString alloc]initWithData:data encoding:NSUTF8StringEncoding];
  [mustr setString:jsonStr];
  
  NSDictionary *dddd=@{@"fileDescribe":mustr};
  
  [manage POST:UPLOAD parameters:dddd constructingBodyWithBlock:^(id<AFMultipartFormData> formData) {
    NSData *data=UIImageJPEGRepresentation(image, 0.3);
    [formData appendPartWithFileData:data name:@"file" fileName:self.optionDic[@"fileName"] mimeType:@"image/jpeg"];
    
  } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
    NSLog(@"res1==%@",responseObject[@"content"]);
    NSInteger code=[responseObject[@"code"] integerValue];
    if (code==1) {
      self.pickSuccess(@{@"code":@(code)});
      
    }else{
      self.pickFailure([NSString stringWithFormat:@"%ld",(long)code]);
    }
  } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
    self.pickFailure(@{@"code":@(-1)});
  }];
}
-(UIImage *)changeImagesize:(UIImage *)image scaleTosize:(CGSize)size
{
  UIGraphicsBeginImageContext(size);
  [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
  UIImage *newimage=UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return newimage;
}

//获取定位
-(void)getLocation:(NSDictionary *)option successs:(PickSuccess)success failure:(PickFailure)failure{
  self.pickSuccess=success;
  self.pickFailure=failure;
  self.optionDic=option;
  [self initMAp];
}
-(void)initMAp
{

  self.option=[[BMKReverseGeoCodeOption alloc]init];
  self.option=[[BMKReverseGeoCodeOption alloc]init];
  self.search=[[BMKGeoCodeSearch alloc]init];
  self.server=[[BMKLocationService alloc]init];
  self.search.delegate=self;
  self.server.delegate=self;
  [self.server startUserLocationService];
}
-(void)didUpdateBMKUserLocation:(BMKUserLocation *)userLocation
{
  //没有跑这个方法
  NSLog(@"1");
  
  [self.server stopUserLocationService];
  
  NSLog(@"经纬度%f---%f",userLocation.location.coordinate.latitude,userLocation.location.coordinate.longitude);
  
  [self reverserGeoWith:userLocation.location.coordinate.latitude andLong:userLocation.location.coordinate.longitude];
  
}

-(void)reverserGeoWith:(CGFloat)lat andLong:(CGFloat)lont
{
  CLLocationCoordinate2D pt=(CLLocationCoordinate2D){lat,lont};
  self.option.reverseGeoPoint=pt;
  BOOL flag=[self.search reverseGeoCode:self.option];
  if (flag) {
    NSLog(@"反geo检索成功");
  }else{
    NSLog(@"反geo检索失败");
  }
}
-(void)onGetReverseGeoCodeResult:(BMKGeoCodeSearch *)searcher result:(BMKReverseGeoCodeResult *)result errorCode:(BMKSearchErrorCode)error
{
  NSLog(@"%@",result.address);
  NSString *address=result.address;
  if (address!=nil&& address.length>0) {
    self.pickSuccess(@{@"location":address});
  }
  
  [self writeLocatToLabel];
  
}
-(void)writeLocatToLabel
{
 
  
}
-(void)getVersion:(NSDictionary *)option successs:(PickSuccess)success failure:(PickFailure)failure{
  self.pickSuccess = success;
  self.pickFailure = failure;
  self.optionDic=option;
  NSString *nowversion=[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
  if (nowversion.length>0) {
    self.pickSuccess(@{@"version":nowversion});
  }
}
-(void)getVersionCallBack:(PickSuccess)sucess{
  self.pickSuccess = sucess;
   NSString *nowversion=[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];
  self.pickSuccess(@{@"version":nowversion});
}
#pragma mark 获取临时文件路径
-(NSString*)getTempFile:(NSString*)fileName{
  NSString *imageContent=[[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingString:@"/temp"];
  NSFileManager * fileManager = [NSFileManager defaultManager];
  if (![fileManager fileExistsAtPath:imageContent]) {
    [fileManager createDirectoryAtPath:imageContent withIntermediateDirectories:YES attributes:nil error:nil];
  }
  return [imageContent stringByAppendingPathComponent:fileName];
}
-(NSString*)getFileName:(NSDictionary*)info{
  NSString *fileName;
  NSString *tempFileName = [[NSUUID UUID] UUIDString];
  fileName = [tempFileName stringByAppendingString:@".jpg"];
  return fileName;
}
@end
