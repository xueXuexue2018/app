export default class HttpUtil {
    static IP = "http://120.76.84.8:8080";
    static get(url){
        return new Promise((resolve, reject) => {
            fetch(HttpUtil.IP+ url)
                .then(response=>response.json())
                .then(result=>{
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                })
        } )
    }
    static post(url,data){
        return new Promise((resolve, reject) => {
            fetch(HttpUtil.IP + url, {
                method:'POST',
                header:{
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                },
                body:data
            })
                .then(response=>response.json())
                .then(result=>{
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                })
        })
    }
}