<template>
  <!-- logo -->
  <img src="../assets/logo.jpg" class="logo2" />
  <el-container class="index commonuse app-index">
    <!-- 首页左侧菜单 -->
    <el-aside class="main-el-aside">
      <el-menu
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        @close="handleClose"
        :default-active="drawerLeftActive"
      >
        <el-menu-item
          index="1"
          @click="
            drawerleft = true;
            drawerLeftActive = 1;
          "
        >
          <el-icon size="25"> <i-expand /> </el-icon>
        </el-menu-item>
        <!-- 左侧导航 el-drawer-->
        <el-drawer
          v-model="drawerleft"
          direction="ltr"
          :with-header="false"
          :size="drawerLeftSize()"
        >
          <img src="../assets/logo.jpg" class="logo1" />
          <el-menu
            :default-active="elMenuActive"
            class="el-menu-vertical-demo"
            v-if="isUse"
          >
            <el-menu-item index="1" @click="switchNav('main')">
              <template #title>
                <i class="el-icon-location"></i>
                <span>首页</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2" @click="switchNav('person')">
              <i class="el-icon-user-solid"></i>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="3" @click="switchNav('edit')">
              <i class="el-icon-edit"></i>
              <span>新增小说</span>
            </el-menu-item>
            <el-menu-item index="4" @click="signOut">
              <i class="el-icon-unlock"></i>
              <span>退出登录</span>
            </el-menu-item>
            <el-menu-item index="5" @click="switchNav('opinion')">
              <i class="el-icon-chat-line-round"></i>
              <span>意见信箱/投诉</span>
            </el-menu-item>
          </el-menu>
          <el-menu default-active="1" class="el-menu-vertical-demo" v-else>
            <el-menu-item index="1">
              <template #title>
                <i class="el-icon-user-solid"></i>
                <span>用户登录/注册</span>
              </template>
            </el-menu-item>
          </el-menu>
        </el-drawer>
        <!-- <template #title><span>Navigator One</span></template> -->
      </el-menu>
    </el-aside>
    <!-- 右侧顶导航已及main部分 -->
    <el-container class="rightmax">
      <el-header class="rights">
        <img src="../assets/logo.jpg" class="logo" />
        <div class="dssearch commonuse" v-if="isUse">
          <img src="../assets/search.png" class="search" />
          <search-novel
            v-model="input"
            placeholder="点击查询小说..."
            id="main"
          ></search-novel>
        </div>
        <div class="rightsButton">
          <div id="loginfront" v-if="isUse">
            <el-tooltip content="主页" placement="bottom" effect="light">
              <el-button
                icon="el-icon-location"
                circle
                class="addbutton"
                @click="switchNav('main')"
              ></el-button>
            </el-tooltip>

            <el-tooltip content="添加小说" placement="bottom" effect="light">
              <el-button
                icon="el-icon-edit"
                circle
                class="addbutton"
                @click="switchNav('edit')"
              ></el-button>
            </el-tooltip>

            <el-dropdown>
              <el-button
                icon="el-icon-user-solid"
                circle
                class="addbutton"
              ></el-button
              ><arrow-down />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="switchNav('person')"
                    >修改个人信息</el-dropdown-item
                  >
                  <el-dropdown-item @click="signOut">
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main>
        <!-- 内容部分 -->
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- 新增按钮弹出层 -->
    <el-dialog
      v-model="dialogVisible"
      title="大胆的创作吧~！"
      :width="dialogVisibleSize()"
      :before-close="handleClose"
    >
      <el-form
        :label-position="labelPosition"
        label-width="100px"
        :model="formLabelAlign"
        :rules="rules"
      >
        <el-form-item label="小说名字" required>
          <el-input
            v-model="formLabelAlign.title"
            prop="title"
            placeholder="三脚猫的故事"
          ></el-input>
        </el-form-item>
        <el-form-item label="小说类型" required>
          <el-input v-model="formLabelAlign.type" placeholder="动画"></el-input>
        </el-form-item>
        <el-form-item label="创建日期" required>
          <el-date-picker
            v-model="formLabelAlign.createTime"
            type="date"
            placeholder="2020-1-30"
            :disabled-date="disabledDate"
            :shortcuts="shortcuts"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="小说简介">
          <el-input
            v-model="formLabelAlign.Novel_Brief"
            maxlength="30"
            type="textarea"
            prop="brief"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传封面"
          ><upload-photo
            ref="upload"
            :noveldata="formLabelAlign"
          ></upload-photo>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSaveBasic">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 是否保存框 -->
    <el-dialog
      v-model="innerVisible"
      width="30%"
      title="Inner Dialog"
      append-to-body
    >
    </el-dialog>
  </el-container>

  <!-- <el-drawer
    v-model="drawerright"
    :with-header="false"
    size="85%"
    close-on-press-escape="true"
    :before-close="handleClose1"
  >
    <el-container id="el-container-right">
      <el-header class="el-header-right commonuse"
        ><img src="../assets/logo.jpg" class="logoright" />
      </el-header>
      <el-main class="el-container-right-small1 commonuse">
        <el-aside class=""></el-aside>
        <el-main></el-main>
      </el-main>
    </el-container>
  </el-drawer> -->
  <!-- 底部footer -->
  <el-footer class="footer">Copyright © 2021-2025 Dianchuang Club.</el-footer>
</template>

<script>
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  watch,
  computed,
  onMounted,
} from "vue";
import { ElMessageBox, ElMessage, ElNotification } from "element-plus";
import SearchNovel from "../components/SearchNovel.vue";
import router from "../router/index";
import { useStore } from "vuex";
// import Schema from "async-validator";
import { v4 as uuidv4 } from "uuid";
import UploadPhoto from "../components/UploadPhoto.vue";
import { request } from "../api/axios.js";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { downloadNovelCover } from "../api/unit.js";
import { onBeforeRouteUpdate } from "vue-router";

const initTask = {
  title: "",
  novel_ID: "",
  novel_Author: "",
  type: "",
  createTime: "",
  novel_Brief: "",
  novel_Cover_Link: "",
  novel_File_Link: "",
  mainPoint: [
    {
      label: "",
      children: [],
    },
  ],
};
export default defineComponent({
  components: { UploadPhoto, SearchNovel },
  setup() {
    onMounted(async () => {
      if (userStatusCodeLocal == 1) {
        store.state.isUse = true;
        await store.dispatch("firstloadNovel");
        notify("欢迎回来", "success", "期待您今天的操作！！！！");
      } else {
        router.push("/UserWindow");
      }
    });
    const elMenuActive = ref("1");

    const drawerleft = ref(false);

    const drawerLeftActive = ref("2");

    watch(
      () => drawerleft.value,
      async (newParams) => {
        if (newParams) {
          drawerLeftActive.value = "1";
        } else {
          drawerLeftActive.value = "2";
        }
      }
    );

    const route = useRoute();

    const novelList = computed(() => store.state.novelList);

    const realRefreshCover = async () => {
      if (novelList.value != null && novelList.value.length > 0) {
        let currentCoverLink;
        for (let i = 0; i < novelList.value.length; i++) {
          currentCoverLink = novelList.value[i].novel_Cover_Link;
          if (currentCoverLink.indexOf("1.png") != -1) {
            currentCoverLink = await downloadNovelCover("1.png");
          } else {
            currentCoverLink = await downloadNovelCover(
              `${novelList.value[i].novel_ID}${
                currentCoverLink
                  .split(`${novelList.value[i].novel_ID}`)[1]
                  .split("?")[0]
              }`
            );
          }
          store.state.novelList[i].novel_Cover_Link = currentCoverLink;
        }
      }
    };

    setInterval(realRefreshCover, 10000);

    watch(
      () => route.name,
      async (newParams) => {
        console.log(newParams);
        // 首页-1,个人信息-2,
        if (newParams === "NovelCard") {
          elMenuActive.value = "1";
          return;
        } else if (newParams === "PersonWindow") {
          elMenuActive.value = "2";
          return;
        } else if (newParams === "EditWindow") {
          // store.dispatch("firstloadNovel");
        } else if (newParams === "OpinionWindow") {
          elMenuActive.value = "5";
          return;
        }
      }
    );

    const store = useStore();

    const isCollapse = ref(true);

    const dialogVisible = ref(false);

    const formLabelAlign = ref({
      ...initTask,
    });

    const labelPosition = ref("right");

    const isUse = computed(() => store.state.isUse);

    const input = ref("");

    let userStatusCodeLocal = localStorage.getItem("userStatusCode");

    // 自适应左侧导航的大小
    const drawerLeftSize = () => {
      if (window.screen.width >= 360 && window.screen.width < 540) {
        return window.screen.width / 2;
      } else if (window.screen.width >= 540 && window.screen.width <= 768) {
        return window.screen.width / 3;
      } else if (window.screen.width > 768 && window.screen.width <= 1344) {
        return window.screen.width / 5;
      } else if (window.screen.width > 1344 && window.screen.width <= 1980) {
        return window.screen.width / 7;
      } else {
        return window.screen.width / 10;
      }
    };

    watch(
      () => window.screen.width,
      async () => {
        dialogVisibleSize();
      }
    );

    const dialogVisibleSize = () => {
      if (window.screen.width < 450) {
        return "98%";
      } else if (window.screen.width > 450 && window.screen.width < 768) {
        return "80%";
      } else {
        return "50%";
      }
    };

    // 切换顶部导航
    const switchNav = (nav) => {
      drawerleft.value = false;
      if (nav === "main") {
        router.push({ name: "NovelCard" });
      }
      if (nav === "opinion") {
        router.push({ name: "OpinionWindow" });
      }
      if (nav === "edit") dialogVisible.value = true;
      if (nav === "person") router.push({ name: "PersonWindow" });
    };

    // 新增按钮弹出层
    const handleClose = () => {
      ElMessageBox.confirm("保留此次编辑？", {
        distinguishCancelAndClose: true,
        confirmButtonText: "保留",
        cancelButtonText: "不保留",
      })
        .then((res) => {
          console.log(res);
          ElMessageWindow("warning", "您已保留上一次编辑");
          dialogVisible.value = false;
        })
        .catch((action) => {
          ElMessageWindow(
            "info",
            action === "cancel" ? "您已撤销编辑" : "您已撤销编辑"
          );
          dialogVisible.value = false;
          initForm();
        });
    };

    // 页面通知
    const notify = (title, type, info) => {
      ElNotification({
        title: title,
        message: info,
        type: type,
      });
    };

    // 消息弹出
    const ElMessageWindow = (type, message) => {
      ElMessage({
        type: type,
        message: message,
      });
    };

    const upload = ref(null);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const header = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    };

    if (userInfo != null) {
      const tokenName = userInfo[1].tokenName; // 从本地缓存读取tokenName值

      const tokenValue = userInfo[1].tokenValue; // 从本地缓存读取tokenValue值

      if (tokenName != undefined && tokenName != "") {
        header[tokenName] = tokenValue;
      }
    }

    const onSaveBasic = async () => {
      if (
        formLabelAlign.value.title != "" &&
        formLabelAlign.value.type != "" &&
        formLabelAlign.value.createTime != ""
      ) {
        if (formLabelAlign.value.novel_Brief == "") {
          formLabelAlign.value.novel_Brief = "还没想好呢！";
        }
        formLabelAlign.value.novel_ID = uuidv4();
        formLabelAlign.value.mainPoint[0].label = formLabelAlign.value.title;
        if (upload.value.state.fileList.length == 0) {
          const Novel_Cover_Link = await downloadNovelCover("1.png");
          console.log(Novel_Cover_Link);
          formLabelAlign.value.novel_Cover_Link = Novel_Cover_Link;
          formLabelAlign.value.novel_Author = userInfo[0].userName;
          // 没有上传图片则直接提交
          const uploadNovelCoverRes = await request({
            url: "novel/uploadNovelCover",
            method: "POST",
            headers: header,
            params: {
              Novel_ID: formLabelAlign.value.novel_ID,
              UID: userInfo[0].uid,
              Novel_Author: formLabelAlign.value.novel_Author,
              Novel_Brief: formLabelAlign.value.novel_Brief,
              Novel_Cover_Link: "",
              Novel_File_Link: formLabelAlign.value.novel_File_Link,
              title: formLabelAlign.value.title,
              type: formLabelAlign.value.type,
              createTime: formLabelAlign.value.createTime,
            },
          });
          console.log(uploadNovelCoverRes);
          if (uploadNovelCoverRes.data.statusCode === 1) {
            console.log(formLabelAlign.value);
            store.commit("addNovel", formLabelAlign.value);
            ElMessageWindow(
              "success",
              `《${formLabelAlign.value.title}》新增成功！！！`
            );
          } else {
            ElMessageWindow(
              "error",
              `《${formLabelAlign.value.title}》新增失败！！！`
            );
          }
          dialogVisible.value = false;
          return;
        }
        dialogVisible.value = false;
        upload.value.submitUpload();
        initForm();
      } else {
        ElMessageWindow("warning", "保存失败，请输入完整！");
      }
    };

    // 重置表单
    const initForm = () => {
      formLabelAlign.value = {
        ...initTask,
      };
      upload.value.state.fileList.splice(0, 1);
    };

    const signOut = async () => {
      drawerleft.value = false;
      const res = await request({
        url: "user/logout",
        method: "get",
        headers: header,
        data: {
          UserAccount: userInfo[0].userAccount,
        },
      });
      console.log(res);
      if (res.data.statusCode === 1) {
        store.state.isUse = false;
        localStorage.clear();
        router.push("/UserWindow");
        ElMessageWindow("success", "退出成功！欢迎下次登录");
      } else {
        ElMessageWindow("error", "退出失败！！");
      }
    };

    //日期判断函数
    const state = reactive({
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      shortcuts: [
        {
          text: "Today",
          value: new Date(),
        },
        {
          text: "Yesterday",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            return date;
          },
        },
        {
          text: "A week ago",
          value: () => {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            return date;
          },
        },
      ],
      value2: "",
    });

    return {
      // isValidator,
      isCollapse,
      input,
      dialogVisible,
      innerVisible: ref(false),
      drawerleft,
      formLabelAlign,
      labelPosition,
      isUse,
      elMenuActive,
      drawerLeftActive,
      upload,
      drawerLeftSize,
      dialogVisibleSize,
      switchNav,
      realRefreshCover,
      handleClose,
      ...toRefs(state),
      open,
      notify,
      onSaveBasic,
      ElMessageWindow,
      signOut,
    };
  },
});
</script>

<style lang="scss">
@media screen and (max-width: 540px) {
  .app-index {
    .el-dialog {
      > .el-input__inner {
        width: 60%;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .logo2 {
    display: inline;
    width: 225px;
  }
  .logo {
    display: none;
  }
  .rightsButton {
    display: none;
  }
  .dssearch {
    flex-grow: 1;
    margin: auto;
  }
  .index {
    width: 100%;
    height: 100%;
    border-radius: 0.2cm;
    margin: 0px auto;
  }
}
@media screen and (min-width: 768px) {
  .logo2 {
    display: none;
  }
  .dssearch {
    flex-grow: 0.8;
    margin: auto;
  }
}
@media screen and (min-width: 1024px) {
  .index {
    width: 80%;
    height: 100%;
    border-radius: 0.2cm;
    margin: 0px auto;
  }
}
@media (min-width: 1980px) {
  .index {
    width: 70%;
    height: 100%;
    border-radius: 0.2cm;
    margin: auto;
  }
}
.app-index {
  .el-dialog {
    > .el-dialog__body {
      text-align: left;
      display: inline-block;
    }
  }
  .rights {
    display: flex;
    justify-content: space-between;
  }
  .logo {
    width: 25%;
  }

  .el-input {
    margin-bottom: 10px;
  }
  #el-container-right {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-header-right {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 10%;
  }
  .el-header-right .el-icon {
    margin-top: 5px;
  }
  .dssearch {
    border-radius: 2cm;
    height: 42px;
    display: inline-flex;
    margin-top: 7px;
    overflow: hidden;
  }
  .dssearch input {
    overflow: hidden;
  }
  .rightmax {
    flex-direction: column;
  }
  .main-el-aside {
    width: 66px;
    border-right: 1px solid rgb(218, 218, 218);
    box-shadow: 0px 0px 5px rgb(212, 212, 212);
  }
  .rightmax .logo {
    width: 165px;
    height: 45px;
    margin-top: 10px;
  }
  .el-menu-vertical-demo {
    border: none;
    text-align: left;
  }
  .search {
    height: 20px;
    margin-left: 23px;
    float: left;
    margin-top: 12px;
  }
  .consultation {
    height: 20px;
    float: right;
    margin-right: 20px;
    margin-top: 12px;
  }
  .el-autocomplete {
    width: 95%;
  }
  #main {
    width: 95%;
    height: 35px;
    border: none;
    font-size: 18px;
    color: rgb(112, 112, 112);
    margin-left: 10px;
    outline: none;
    margin-top: 3px;
    float: left;
  }
  .addbutton {
    height: 60%;
    margin-top: 10px;
    margin-left: 10px;
  }
  .logoright {
    width: 130px;
    height: 45px;
    margin-top: 10px;
  }
  .logo1 {
    width: 80%;
  }
  .el-drawer__body {
    text-align: center;
  }
}

.commonuse {
  border: 1px solid rgb(218, 218, 218);
  box-shadow: 0px 0px 5px rgb(212, 212, 212);
}
.footer {
  margin-top: 30px;
  color: rgb(112, 112, 112);
}
</style>