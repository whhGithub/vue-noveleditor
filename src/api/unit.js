import COS from 'cos-js-sdk-v5'
import { request } from "../api/axios.js";
import store from '../store/index'
const baseCosConfig = {
    bucket: 'noveleditor-1308439491',
    region: 'ap-guangzhou'
};

const header = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
};

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

if (userInfo != null) {
    const tokenName = userInfo[1].tokenName; // 从本地缓存读取tokenName值

    const tokenValue = userInfo[1].tokenValue; // 从本地缓存读取tokenValue值

    if (tokenName != undefined && tokenName != "") {
        header[tokenName] = tokenValue;
    }
}

const uploadNovel = (param, noveldata) => {
    const coverImageName = noveldata.novel_ID + "." + param.file.name.substring(param.file.name.lastIndexOf(".") + 1)
    let cos = new COS({
        getAuthorization: async(options, callback) => {
            const res = await request({
                url: "novel/getCosTempKey",
                method: "get",
                headers: header,
                params: {
                    location: 1,
                    fileName: coverImageName,
                    operate: 1,
                },
            })
            if (res.data.statusCode === 1) {
                const { data } = res;
                const data1 = JSON.parse(data.data)
                callback({
                    TmpSecretId: data1.credentials.tmpSecretId,
                    TmpSecretKey: data1.credentials.tmpSecretKey,
                    XCosSecurityToken: data1.credentials.sessionToken,
                    StartTime: data1.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: data1.expiredTime, // 时间戳，单位秒，如：1580000000
                });
            }
        },
    })

    return new Promise((resolve) => {
        cos.putObject({
            Bucket: baseCosConfig.bucket,
            Region: baseCosConfig.region,
            /* 存储桶所在地域，必须字段 */
            Key: "covers/" + coverImageName,
            Body: param.file, // 上传文件对象
        }, async(err, data) => {
            const Novel_Cover_Link = await downloadNovelCover(coverImageName)
            const Novel_File_Link = await uploadNovelContent(noveldata.novel_ID, "")
            noveldata.novel_Cover_Link = Novel_Cover_Link
            noveldata.novel_File_Link = Novel_File_Link
            console.log(err || data)
            if (data.statusCode === 200) {
                const uploadNovelCoverRes = await request({
                    url: "novel/uploadNovelCover",
                    method: "POST",
                    headers: header,
                    params: {
                        Novel_ID: noveldata.novel_ID,
                        UID: userInfo[0].uid,
                        Novel_Author: userInfo[0].userName,
                        Novel_Brief: noveldata.novel_Brief,
                        Novel_Cover_Link: noveldata.novel_Cover_Link,
                        Novel_File_Link: noveldata.novel_File_Link,
                        title: noveldata.title,
                        type: noveldata.type,
                        createTime: noveldata.createTime
                    },
                });
                console.log(uploadNovelCoverRes)
                if (uploadNovelCoverRes.data.statusCode === 1) {
                    noveldata.uid = userInfo[0].uid
                    noveldata.novel_Author = userInfo[0].userName
                    store.commit("addNovel", noveldata);
                }
                resolve(uploadNovelCoverRes.data.statusCode)
            }
        })
    });
}

const downloadNovelCover = (coverImageName) => {
    let cos = new COS({
        getAuthorization: async(options, callback) => {
            const res = await request({
                url: "novel/getCosTempKey",
                method: "get",
                headers: header,
                params: {
                    location: 1,
                    fileName: coverImageName,
                    operate: 2,
                },
            })
            if (res.data.statusCode === 1) {
                const { data } = res;
                const data1 = JSON.parse(data.data)
                callback({
                    TmpSecretId: data1.credentials.tmpSecretId,
                    TmpSecretKey: data1.credentials.tmpSecretKey,
                    XCosSecurityToken: data1.credentials.sessionToken,
                    StartTime: data1.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: data1.expiredTime, // 时间戳，单位秒，如：1580000000
                });
            }
        },
    })

    return new Promise((resolve) => {
        cos.getObjectUrl({
            Bucket: baseCosConfig.bucket,
            Region: baseCosConfig.region,
            /* 存储桶所在地域，必须字段 */
            Key: "covers/" + coverImageName,

        }, function(err, data) {
            let url = data.Url;
            let downloadUrl = url + (url.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=inline'; // 补充强制下载的参数
            resolve(err || downloadUrl)
        })
    });
}

const uploadNovelContent = (novel_ID, editorContent) => {
    const fileContent = new File([editorContent], `${novel_ID}.txt`, { type: 'txt' })
    const formdata = new FormData()
        // 模仿单文件上传给接口传参
    formdata.append('file', fileContent)
    let cos = new COS({
        getAuthorization: async(options, callback) => {
            const res = await request({
                url: "novel/getCosTempKey",
                method: "get",
                headers: header,
                params: {
                    location: 3,
                    fileName: novel_ID + "." + fileContent.name.substring(fileContent.name.lastIndexOf(".") + 1),
                    operate: 1,
                },
            })
            if (res.data.statusCode === 1) {
                const { data } = res;
                const data1 = JSON.parse(data.data)
                callback({
                    TmpSecretId: data1.credentials.tmpSecretId,
                    TmpSecretKey: data1.credentials.tmpSecretKey,
                    XCosSecurityToken: data1.credentials.sessionToken,
                    StartTime: data1.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: data1.expiredTime, // 时间戳，单位秒，如：1580000000
                });
            }
        },
    })
    return new Promise((resolve) => {
        cos.putObject({
            Bucket: baseCosConfig.bucket,
            Region: baseCosConfig.region,
            /* 存储桶所在地域，必须字段 */
            Key: "novels/" + novel_ID + "." + fileContent.name.substring(fileContent.name.lastIndexOf(".") + 1),
            Body: formdata.get("file"), // 上传文件对象
        }, async(err, data) => {
            resolve(err || data.Location)
        })
    });
}

const downloadNovel = (novel_ID) => {
    let cos = new COS({
        getAuthorization: async(options, callback) => {
            const res = await request({
                url: "novel/getCosTempKey",
                method: "get",
                headers: header,
                params: {
                    location: 3,
                    fileName: novel_ID + ".txt",
                    operate: 2,
                },
            })
            if (res.data.statusCode === 1) {
                const { data } = res;
                const data1 = JSON.parse(data.data)
                callback({
                    TmpSecretId: data1.credentials.tmpSecretId,
                    TmpSecretKey: data1.credentials.tmpSecretKey,
                    XCosSecurityToken: data1.credentials.sessionToken,
                    StartTime: data1.startTime, // 时间戳，单位秒，如：1580000000
                    ExpiredTime: data1.expiredTime, // 时间戳，单位秒，如：1580000000
                });
            }
        },
    })

    return new Promise((resolve) => {
        cos.getObject({
            Bucket: baseCosConfig.bucket,
            Region: baseCosConfig.region,
            /* 存储桶所在地域，必须字段 */
            Key: "novels/" + novel_ID + ".txt",
        }, function(err, data) {
            resolve(data)
        })
    });
}

export { uploadNovel, uploadNovelContent, downloadNovel, downloadNovelCover }