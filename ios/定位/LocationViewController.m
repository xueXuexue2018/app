//
//  LocationViewController.m
//  nscwApp
//
//  Created by yuexun on 2018/6/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "LocationViewController.h"
#import <BaiduMapAPI_Map/BMKMapComponent.h>
#import <BaiduMapAPI_Location/BMKLocationComponent.h>
#import <BaiduMapAPI_Utils/BMKUtilsComponent.h>
#import <BaiduMapAPI_Search/BMKGeocodeSearch.h>
#import <Masonry.h>
#import "AppDelegate.h"
@interface LocationViewController ()<BMKLocationServiceDelegate,BMKMapViewDelegate,BMKGeoCodeSearchDelegate>
@property (nonatomic,strong) BMKMapView *mapView;//地图视图
@property (nonatomic,strong) BMKLocationService *service;//定位服务
/** BMKGeoCodeSearch */
@property (strong, nonatomic)  BMKGeoCodeSearch *searcher;
@property(nonatomic,assign)CGFloat longitude;// 经度
@property(nonatomic,assign)CGFloat latitude; //纬度
/** 大头针数组 */
@property (strong, nonatomic)  NSMutableArray *annotationArr;
@end
@implementation LocationViewController

- (void)viewDidLoad {
    [super viewDidLoad];
  self.view.backgroundColor=[UIColor whiteColor];

}
-(void)creacteMap:(NSDictionary*)option successs:(PickSuccess)success failure:(PickFailure)failure{
  self.optionDic=option;
  self.pickSuccess = success;
  self.pickFailure =failure;
  
  
  [self.view addSubview:self.mapView];

  [self.mapView mas_makeConstraints:^(MASConstraintMaker *make) {
    make.left.top.right.bottom.mas_equalTo(0);
  }];
  
  NSString *str=[NSString stringWithFormat:@"%@",self.optionDic[@"address"]];

    _searcher =[[BMKGeoCodeSearch alloc]init];
    _searcher.delegate = self;
    //发起地理位置检索
    BMKGeoCodeSearchOption *geoCodeSearchOption = [[BMKGeoCodeSearchOption alloc]init];
    geoCodeSearchOption.address =str;
//    geoCodeSearchOption.city = @"北京";
    BOOL flag = [_searcher geoCode:geoCodeSearchOption];
   
    if(flag)
    {
      NSLog(@"geo检索发送成功反反复复");
    }
    else
    {
      NSLog(@"geo检索发送失败");
    }
  
  

  
  
}
//实现Deleage处理回调结果
//返回地址信息搜索结果
- (void)onGetGeoCodeResult:(BMKGeoCodeSearch *)searcher result:(BMKGeoCodeResult *)result errorCode:(BMKSearchErrorCode)error {
  
  if (error == BMK_SEARCH_NO_ERROR) {
    //在此处理正常结果
    NSArray* array = [NSArray arrayWithArray:self.mapView.annotations];
    [self.mapView removeAnnotations:array];
     array = [NSArray arrayWithArray:self.mapView.overlays];
      [self.mapView removeOverlays:array];
    [self.annotationArr removeAllObjects];
    self.annotationArr=[array mutableCopy];
    BMKPointAnnotation *annotation2=[[BMKPointAnnotation alloc]init];
    
    annotation2.title=@"您选择的位置";
    
    //  annotation2.subtitle=@"*＊＊＊＊";
    
    annotation2.coordinate=result.location;
    
    // annotation2.image=[UIImage imageNamed:@"1"];
    [self.annotationArr addObject:annotation2];
    [self.mapView addAnnotations:self.annotationArr];
     self.mapView.centerCoordinate = result.location;
    CLGeocoder *geocoder = [[CLGeocoder alloc] init];
    [geocoder geocodeAddressString:[NSString stringWithFormat:@"%@",self.optionDic[@"address"]] completionHandler:^(NSArray *placemarks, NSError *error){
      
      if ([placemarks count] > 0) {
        CLPlacemark *placemark = [placemarks objectAtIndex:0];
        CLLocationCoordinate2D coordinate = placemark.location.coordinate;
//
//        NSString *strCoordinate = [NSString stringWithFormat:@"经度:%3.5f 纬度:%3.5f:",coordinate.latitude,coordinate.longitude ];
//        NSLog(@"%@",strCoordinate);
        self.longitude=coordinate.longitude;
        self.latitude=coordinate.latitude;
      }
    }];
  }
  else {
    NSLog(@"抱歉，未找到结果");
    
    //初始化定位
    self.service = [[BMKLocationService alloc] init];
    self.service.distanceFilter=10;
    //设置代理
    self.service.delegate = self;
    //开启定位
    [self.service startUserLocationService];
    
    
    // 大头针2
    
    CLLocationCoordinate2D location2=CLLocationCoordinate2DMake(22.5620972735, 113.9531726118);
    
    BMKPointAnnotation *annotation2=[[BMKPointAnnotation alloc]init];
    
    annotation2.title=@"您选择的位置";
    
    //  annotation2.subtitle=@"*＊＊＊＊";
    
    annotation2.coordinate=location2;
    
    // annotation2.image=[UIImage imageNamed:@"1"];
    [self.annotationArr addObject:annotation2];
    [self.mapView addAnnotations:self.annotationArr];
  }
}
#pragma 定位-delegete

/**
 *用户方向更新后，会调用此函数
 *@param userLocation 新的用户位置
 */
- (void)didUpdateUserHeading:(BMKUserLocation *)userLocation
{
  [self.mapView updateLocationData:userLocation];
  //   NSLog(@"heading is %@",userLocation.heading);
}
/**
 *用户位置更新后，会调用此函数
 *@param userLocation 新的用户位置
 */
- (void)didUpdateBMKUserLocation:(BMKUserLocation *)userLocation
{
  
  // [_locService stopUserLocationService];
  self.latitude=userLocation.location.coordinate.latitude;
  self.longitude=userLocation.location.coordinate.longitude;
  BMKCoordinateRegion region;
  region.center.latitude = userLocation.location.coordinate.latitude;
  region.center.longitude = userLocation.location.coordinate.longitude;
  region.span.latitudeDelta = 0.01;
  region.span.longitudeDelta = 0.01;
  _mapView.region=region;
  _mapView.centerCoordinate=userLocation.location.coordinate;
  [_mapView updateLocationData:userLocation];

}

#pragma mark 底图手势操作
/**
 *点中底图标注后会回调此接口
 *@param mapview 地图View
 *@param mapPoi 标注点信息
 */
- (void)mapView:(BMKMapView *)mapView onClickedMapPoi:(BMKMapPoi*)mapPoi
{

  self.longitude=mapPoi.pt.longitude;
  self.latitude=mapPoi.pt.latitude;
  // 大头针2
  [self.annotationArr removeAllObjects];
  [self.mapView removeOverlays:mapView.overlays];
  [self.mapView removeAnnotations:mapView.annotations];
  
  CLLocationCoordinate2D location2=CLLocationCoordinate2DMake(mapPoi.pt.latitude, mapPoi.pt.longitude);
  
  BMKPointAnnotation *annotation2=[[BMKPointAnnotation alloc]init];
  
  annotation2.title=@"您选择的位置";
  
//  annotation2.subtitle=@"*＊＊＊＊";
  
  annotation2.coordinate=location2;
  
  // annotation2.image=[UIImage imageNamed:@"1"];
  [self.annotationArr addObject:annotation2];
  [self.mapView addAnnotations:self.annotationArr];
}
/**
 *点中底图空白处会回调此接口
 *@param mapview 地图View
 *@param coordinate 空白处坐标点的经纬度
 */
- (void)mapView:(BMKMapView *)mapView onClickedMapBlank:(CLLocationCoordinate2D)coordinate
{
 
  self.longitude=coordinate.longitude;
  self.latitude=coordinate.latitude;
  // 大头针2
  [self.annotationArr removeAllObjects];
  [self.mapView removeOverlays:mapView.overlays];
  [self.mapView removeAnnotations:mapView.annotations];
  
  CLLocationCoordinate2D location2=CLLocationCoordinate2DMake(coordinate.latitude, coordinate.longitude);
  
  BMKPointAnnotation *annotation2=[[BMKPointAnnotation alloc]init];
  
  annotation2.title=@"您选择的位置";
  
//  annotation2.subtitle=@"*＊＊＊＊";
  
  annotation2.coordinate=location2;
  
  // annotation2.image=[UIImage imageNamed:@"1"];
  [self.annotationArr addObject:annotation2];
  [self.mapView addAnnotations:self.annotationArr];
  
  

}
//mapview delegate 大头针点击
- (void)mapView:(BMKMapView *)mapView didSelectAnnotationView:(BMKAnnotationView *)view{

  if (self.longitude>0&& self.latitude>0) {
    UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"提示"
                                                                   message:@"确定定位吗？"
                                                            preferredStyle:UIAlertControllerStyleAlert];
    
    UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault
                                                          handler:^(UIAlertAction * action) {
                                                            
                                                            //响应事件
                                                            
                                                            self.pickSuccess(@{@"longitude":@(self.longitude),@"latitude":@(self.latitude)});
                                                            [self dismissViewControllerAnimated:YES completion:nil];
                                                            
                                                          }];
    UIAlertAction* cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleDefault
                                                         handler:^(UIAlertAction * action) {
                                                           
                                                         }];
    
    [alert addAction:defaultAction];
    [alert addAction:cancelAction];
    [self presentViewController:alert animated:YES completion:nil];
  }
 
}
/**
 *双击地图时会回调此接口
 *@param mapview 地图View
 *@param coordinate 返回双击处坐标点的经纬度
 */
- (void)mapview:(BMKMapView *)mapView onDoubleClick:(CLLocationCoordinate2D)coordinate
{
//  NSLog(@"onDoubleClick-latitude==%f,longitude==%f",coordinate.latitude,coordinate.longitude);
//  NSString* showmeg = [NSString stringWithFormat:@"您双击了地图(double click).\r\n当前经度:%f,当前纬度:%f,\r\nZoomLevel=%d;RotateAngle=%d;OverlookAngle=%d", coordinate.longitude,coordinate.latitude,
//                       (int)_mapView.zoomLevel,_mapView.rotation,_mapView.overlooking];
//
}

/**
 *长按地图时会回调此接口
 *@param mapview 地图View
 *@param coordinate 返回长按事件坐标点的经纬度
 */
- (void)mapview:(BMKMapView *)mapView onLongClick:(CLLocationCoordinate2D)coordinate
{
//  NSLog(@"onLongClick-latitude==%f,longitude==%f",coordinate.latitude,coordinate.longitude);
//  NSString* showmeg = [NSString stringWithFormat:@"您长按了地图(long pressed).\r\n当前经度:%f,当前纬度:%f,\r\nZoomLevel=%d;RotateAngle=%d;OverlookAngle=%d", coordinate.longitude,coordinate.latitude,
//                       (int)_mapView.zoomLevel,_mapView.rotation,_mapView.overlooking];
 
  
}
- (void)mapView:(BMKMapView *)mapView regionDidChangeAnimated:(BOOL)animated
{
//  NSString* showmeg = [NSString stringWithFormat:@"地图区域发生了变化(x=%d,y=%d,\r\nwidth=%d,height=%d).\r\nZoomLevel=%d;RotateAngle=%d;OverlookAngle=%d",(int)_mapView.visibleMapRect.origin.x,(int)_mapView.visibleMapRect.origin.y,(int)_mapView.visibleMapRect.size.width,(int)_mapView.visibleMapRect.size.height,(int)_mapView.zoomLevel,_mapView.rotation,_mapView.overlooking];
 
}
-(BMKAnnotationView *)mapView:(BMKMapView *)mapView viewForAnnotation:(id<BMKAnnotation>)annotation{
  BMKAnnotationView *annotationView = (BMKAnnotationView *)[mapView dequeueReusableAnnotationViewWithIdentifier:@"otherAnnotationView"];
  if (annotationView == nil) {
    annotationView = [[BMKAnnotationView alloc]initWithAnnotation:annotation reuseIdentifier:@"otherAnnotationView"];
  }
 
 
  annotationView.image = [UIImage imageNamed:@"datouzhen"];
  annotationView.frame=CGRectMake(0, 0, 25, 25);
  annotationView.contentMode=UIViewContentModeScaleAspectFit;
  return annotationView;
}
-(BMKMapView *)mapView{
  if (_mapView==nil) {
    _mapView=[[BMKMapView alloc]init];
    _mapView.delegate=self;
    _mapView.userTrackingMode = BMKUserTrackingModeNone;//设置定位的状态
    _mapView.showsUserLocation = YES;//显示定位图层
    CLLocationCoordinate2D coords = CLLocationCoordinate2DMake(22.54,114.07);
    _mapView.centerCoordinate=coords;
  
   
  }
  return _mapView;
}
-(NSMutableArray *)annotationArr{
  if (_annotationArr==nil) {
    _annotationArr=[NSMutableArray array];
  }
  return _annotationArr;
}
-(void)viewDidAppear:(BOOL)animated{
  [super viewDidAppear:animated];
 
}
#pragma view-appear
-(void)viewDidDisappear:(BOOL)animated{
  [super viewDidDisappear:animated];
  if (_mapView) {
    _mapView = nil;
  }
  
  if (_searcher) {
     _searcher.delegate = nil;
  }
 
}
- (void)dealloc {
  if (_mapView) {
    _mapView = nil;
  }
}
/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
