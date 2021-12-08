import axios from "axios";
//创建axios实例
export function request(config) {
    const instance = axios.create({
        baseURL: 'http://10.1.86.79:8080',
        timeout: 60 * 1000,
        withCredentials: true
    })

    //拦截器
    instance.interceptors.request.use(config => {
        return config
    }, err => {
        console.log(err)
    })

    instance.interceptors.response.use(res => {
            return res
        }, err => {
            console.log(err);
        })
        //发送真正的网络请求
    return instance(config)
}