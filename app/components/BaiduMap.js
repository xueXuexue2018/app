// BaiduMap
import React, {
    Component
} from 'react';
import {
    MapView,
    MapTypes,
    Geolocation
} from 'react-native-baidu-map';

import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
} from 'react-native';

import styles from './styles';
export default class BaiduMap extends Component<Props>{

    constructor(props) {
        super(props);
        this.text='';
        this.state = {
            mayType: MapTypes.NORMAL,
            zoom: 15,
            trafficEnabled: true,
            baiduHeatMapEnabled: false,
        };
    }

    componentDidMount() { // 获取位置
        this.findLocation();
    }
    findLocation(){
        Geolocation.getCurrentPosition().then(
            (data) => {
                this.setState({
                    zoom:18,
                    markers:[{//标记点
                        latitude:data.latitude,
                        longitude:data.longitude,
                        title:data.address.substring(2,)
                    }],
                    center:{//设置显示在中心
                        latitude:data.latitude,
                        longitude:data.longitude,
                    }
                })
            }
        ).catch(error => {
            alert(error,'error')
        })
    }
    getLoginText(e){
        this.text=e;
    }
    seachFind(){//通过街道地点名称反编译出经纬度
        Geolocation.geocode(this.text,this.text).then(
            (data) => {
                this.clickMap(data,1);
            }
        ).catch(error => {
            alert(error,'error')
        })
    }
    clickMap(e,type){//通过经纬度查询地点
        Geolocation.reverseGeoCode(e.latitude,e.longitude).then(
            (data) => {
                if (type==1){
                    this.setState({
                        zoom:18,
                        markers:[{//标记点
                            latitude:e.latitude,
                            longitude:e.longitude,
                            title:data.address
                        }],
                        center:{//设置显示在中心
                            latitude:e.latitude,
                            longitude:e.longitude,
                        }
                    })
                }else {
                    this.setState({
                        zoom:18,
                        markers:[{//标记点
                            latitude:e.latitude,
                            longitude:e.longitude,
                            title:data.address
                        }]
                    })
                }

            }
        ).catch(error => {
            alert(error,'error')
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.seach}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text)=>this.getLoginText(text)}//输入框改变触发的函数
                        placeholder="请输入地点"
                        underlineColorAndroid='transparent'
                    />
                    <TouchableOpacity style={styles.seachTou} activeOpacity={0.5} onPress={() => this.seachFind()}>
                        <Text style={styles.seachText}>搜索</Text>
                    </TouchableOpacity>

                </View>
                <MapView
                    trafficEnabled={this.state.trafficEnabled}
                    baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                    zoom={this.state.zoom}
                    mapType={this.state.mapType}
                    center={this.state.center}
                    marker={this.state.marker}
                    markers={this.state.markers}
                    style={styles.map}
                    onMapClick={(e) => {
                        this.clickMap(e,2);
                    }}
                    onMarkerClick={(data)=>{//点击地图标注点
                        console.warn(data);
                    }}
                    // onMapStatusChangeStart={(data)=>{//地图移动
                    //     console.warn(data);
                    // }}
                    onMapPoiClick={(data)=>{//点击地图上建筑名称方法
                        this.setState({
                            zoom:18,
                            markers:[{//标记点
                                latitude:data.latitude,
                                longitude:data.longitude,
                                title:data.name
                            }],
                        })
                    }}
                >
                </MapView>

            </View>
        );
    }
}