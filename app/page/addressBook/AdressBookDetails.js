import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Linking,
    StyleSheet
} from 'react-native';
import NavgationBar from '../../components/NavgationBar';

export default class AdressBookDetails extends Component{
    constructor(props){
        super(props);
        this.state = {
            phone: this.props.navigation.getParam('phone'),
            name: this.props.navigation.getParam('name')
        }
    }
    linking(url){
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }
    render(){
        return(
            <View>
                <NavgationBar
                    title='通讯录详情'
                    statusBar={{backgroundColor: '#028ce5'}}
                    leftButton={
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                            <Image style={{width:22,height:22,margin:5}} source={require('../../res/img/back.png')}/>
                        </TouchableOpacity>
                    }
                />
                <View style={styles.box}>
                    <Image style={styles.img} source={require('../../res/img/qstd_icon_default.png')}/>
                    <View style={styles.boxRight}>
                        <Text>{this.state.name}</Text>
                        <Text></Text>
                    </View>
                </View>
                <TouchableOpacity  style={styles.box} onPress={()=>this.linking('tel:'+this.state.phone)}>
                    <Image style={styles.img} source={require('../../res/img/qstd_phone_icon.png')}/>
                    <View style={styles.boxRight}>
                        <Text>拨打电话</Text>
                        <Text>{this.state.phone}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity  style={styles.box} onPress={()=>this.linking('smsto:'+this.state.phone)}>
                    <Image style={styles.img} source={require('../../res/img/qstd_msm_icon.png')}/>
                    <View style={styles.boxRight}>
                        <Text>发送短信</Text>
                        <Text>{this.state.phone}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f4f4f4'
    },
    box:{
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#999',
        height: 52,
        margin: 10,
        flexDirection: 'row',
        borderRadius: 10
    },
    img:{
        width: 50,
        height: 50
    },
    boxRight:{
        justifyContent:'center',
        paddingLeft: 10
    }
})
