class MMUtil{
    //type媒体值  name字段名
    getMessages(type, name) {
        var constantArray = {
            "jobType": [ //任务类型 CountryCode
                ["1", "接人"],
                ["2", "送人"],
                ["3", "取货"],
                ["4", "送货"],
                ["5", "公务"],
                ["6", "调研"],
                ["7", "接待"],
            ],
            "carType": [ //车辆类型 CountryCode
                ["1", "小车"],
                ["2", "面包车"],
                ["3", "中巴车"],
            ],
        };
        if(!type || !name) {
            return type;
        }
        //获取数组对应的字段名
        var constantName = constantArray[name];
        if(!constantName) {
            return type;
        }
        //遍历对象内 对应字段的数组
        for(var i = 0; i < constantName.length; i++) {
            //对应字段内的数组
            var conName = constantName[i];
    //		for(var k = 0; k < conName.length; k++) {
                //如果对应字段数组内的第一项（媒体值）和传入媒体值相等 则输出转换内容 并结束循环
                if(conName[0] == type) {
                    return conName[1];
                    break
                } else if(i == (constantName.length-1)){ //如果没有找到对应的匹配项 则输出原对应字段
                    return type;
                }

    //		}

        }

    }

    //日期格式化
    static formate(t, f) {
        var time = new Date(t);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        m < 10 ? m = '0' + m : m = m;
        var d = time.getDate();
        d < 10 ? d = '0' + d : d = d;
        var h = time.getHours();
        h < 10 ? h = '0' + h : h = h;
        var min = time.getMinutes();
        min < 10 ? min = '0' + min : min = min;
        var s = time.getSeconds();
        s < 10 ? s = '0' + s : s = s;
        if (!f) {
            return y + "-" + m + "-" + d;
        } else if (f == 1) {
            return y + "-" + m + "-" + d + " " + h + ":" + min;
        } else if(f == 2){
            return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
        } else if(f == 3){
            return h + ":" + min;
        }else if (f==4) {
            return  m + "-" + d + " " + h + ":" + min;
        }else if (f==5) {
            return m + "-" + d + " " + h + ":" + min
        }
    }
}
export default MMUtil;