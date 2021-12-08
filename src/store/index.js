import * as Vuex from "vuex";
import { request } from "../api/axios.js";
import { downloadNovelCover } from "../api/unit";
const store = Vuex.createStore({
            state() {
                return {
                    search: "",
                    isUse: false,
                    userInfo: {},
                    novelList: [],
                    currentNovel: {}
                }
            },
            mutations: {
                addNovel(state, task) {
                    state.novelList.unshift(task)
                },
                updateUserStatusCode(state, code) {
                    state.userStatusCode = code
                },
                firstloadNovel(state, task) {
                    state.novelList = task
                },
                UpdateChapter(state, task) {
                    state.novelList[task.mainPointIndex].mainPoint[0].children = task.children
                },

                deleteNovel(state, novel_ID) {
                    state.novelList.splice(state.novelList.findIndex(item => item.novel_ID === novel_ID), 1);
                }
                // addMainPoint(state, task) {
                //     if (task.radio == 1) { state.novelList[task.mainPointIndex].mainPoint[0].children.unshift(task.children) }
                //     if (task.radio == 2) { state.novelList[task.mainPointIndex].mainPoint[0].children.push(task.children) }
                //     if (task.radio == 3) {
                //         console.log(state.novelList[task.mainPointIndex].mainPoint[0].children.length)
                //         for (var i = 0; i < state.novelList[task.mainPointIndex].mainPoint[0].children.length; i++) {
                //             if (state.novelList[task.mainPointIndex].mainPoint[0].children[i].label == task.nearchapter) {
                //                 state.novelList[task.mainPointIndex].mainPoint[0].children.splice(i + 1, 0, task.children)
                //             }
                //         }
                //     }
                // },

                // addSection(state, task) {
                //     if (task.radio == 1) {
                //         state.novelList[task.mainPointIndex].mainPoint[0].children.filter((item) => item.label == task.inchapter)[0].children.unshift(task.children)
                //     }
                //     if (task.radio == 2) {
                //         state.novelList[task.mainPointIndex].mainPoint[0].children.filter((item) => item.label == task.inchapter)[0].children.push(task.children)
                //     }
                //     if (task.radio == 3) {
                //         const nearSectionIndex = state.novelList[task.mainPointIndex].mainPoint[0].children.filter((item) => item.label == task.inchapter)[0].children.findIndex((item) => item.label === task.nearchapter);
                //         state.novelList[task.mainPointIndex].mainPoint[0].children.filter((item) => item.label == task.inchapter)[0].children.splice(nearSectionIndex + 1, 0, task.children)
                //     }
                // }
            },
            actions: {
                async firstloadNovel(context) {
                    const header = {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Accept: "application/json",
                    };
                    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                    const tokenName = userInfo[1].tokenName; // 从本地缓存读取tokenName值
                    const tokenValue = userInfo[1].tokenValue; // 从本地缓存读取tokenValue值
                    if (tokenName != undefined && tokenName != "") {
                        header[tokenName] = tokenValue;
                    }
                    const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
                    const res = await request({
                        url: "novel/loadAllNovel",
                        method: "GET",
                        headers: header,
                        params: {
                            userName: UserInfo[0].userName,
                        },
                    });
                    console.log(res)
                    if (res.data.statusCode === 1) {
                        for (let i = 0; i < res.data.data.length; i++) {
                            let NovelImageLink;
                            if (res.data.data[i].novel_Cover_Link === "") {
                                NovelImageLink = await downloadNovelCover('1.png');
                            } else {
                                NovelImageLink = await downloadNovelCover(`${res.data.data[i].novel_ID}${res.data.data[i].novel_Cover_Link.split(`${res.data.data[i].novel_ID}`)[1].split("?")[0]}` );
                            }
                            res.data.data[i].novel_Cover_Link = NovelImageLink
                            res.data.data[i].mainPoint = [{
                                label: res.data.data[i].title,
                                children: [],
                            }, ]
                    }
            }context.commit('firstloadNovel', res.data.data)
        },
        async UpdateChapter(context,task){
            context.commit('UpdateChapter', task)
        }
    }
})

export default store;