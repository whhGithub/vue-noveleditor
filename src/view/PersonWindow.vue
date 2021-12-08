<template>
  <div class="app-personW-window">
    <el-page-header @back="goBack" title="回到主页" />
    <el-avatar
      :size="50"
      src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      class="el-avatar"
    ></el-avatar>
    <el-form
      ref="updateUserInfoForm"
      :model="userInfoForm"
      :rules="userInfoRules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <!-- <el-form-item label="账号" prop="userAccount" label-width="50px">
      <el-input v-model="userInfoForm.userAccount"></el-input>
    </el-form-item> -->
      <el-form-item label="昵称" prop="userName" label-width="50px">
        <el-input
          v-model="userInfoForm.userName"
          :disabled="isRepair"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="userMail" label-width="50px">
        <el-input
          v-model="userInfoForm.userMail"
          type="email"
          :disabled="isRepair"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="userPhone" label-width="65px">
        <el-input
          v-model="userInfoForm.userPhone"
          :disabled="isRepair"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userPW" label-width="50px">
        <el-input
          v-model="userInfoForm.userPW"
          :disabled="isRepair"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-button type="primary" @click="isRepair = !isRepair" v-if="isRepair"
          >点击修改</el-button
        >
        <el-button type="primary" @click="submitForm()" v-else
          >保存修改</el-button
        >
        <el-button @click="resetForm()" v-if="!isRepair">重新输入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { request } from "../api/axios";
import { ElMessage } from "element-plus";
import router from "../router";
import { useStore } from "vuex";
const store = useStore();

const goBack = () => {
  router.push({ name: "NovelCard" });
};

const ElMessageWindow = (type, message) => {
  ElMessage({
    type: type,
    message: message,
  });
};

const isRepair = ref(true);

const validatePass = (rule, value, callback) => {
  let ab = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (value === "") {
    callback(new Error("Please input the phone number"));
  } else if (ab.test(value) === false) {
    callback(new Error("Please input the correct phone number"));
  } else {
    callback();
  }
};

const updateUserInfoForm = ref(null);

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

let userInfoForm = reactive({
  uid: "",
  userAccount: "",
  userMail: "",
  userName: "",
  userPW: "",
  userPhone: "",
});

onMounted(() => {
  for (let key in userInfo[0]) {
    if (key != "userPW") {
      userInfoForm[key] = userInfo[0][key];
    }
  }
});

const updateUserInfo = async () => {
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

  const res = await request({
    url: "user/update",
    method: "post",
    headers: header,
    params: {
      UID: userInfoForm.uid,
      UserName: userInfoForm.userName,
      UserPW: userInfoForm.userPW,
      UserMail: userInfoForm.userMail,
      UserPhone: userInfoForm.userPhone,
    },
  });
  console.log(res);
  if (res.data.statusCode === 1) {
    store.state.isUse = false;
    localStorage.clear();
    ElMessageWindow("success", "修改成功，请重新登录！");
    router.push({ name: "UserWindow" });
  } else {
    ElMessageWindow("error", "修改失败！");
  }
};

const submitForm = () => {
  updateUserInfoForm.value.validate((valid) => {
    if (valid) {
      console.log(valid);
      isRepair.value = true;
      updateUserInfo();
      //   loginOrRegister(formName);
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};

const resetForm = () => {
  updateUserInfoForm.value.resetFields();
};

const userInfoRules = {
  userAccount: [
    {
      message: "Please input Activity UserAccountRegist",
      trigger: "change",
    },
    {
      min: 5,
      max: 11,
      message: "Length should be 5 to 11",
      trigger: "blur",
    },
  ],
  userPhone: [{ validator: validatePass, trigger: "blur", required: true }],
  userMail: [
    {
      required: true,
      message: "Please input email address",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Please input correct email address",
      trigger: ["blur", "change"],
    },
  ],
  userName: [
    {
      required: true,
      message: "Please input Activity name",
      trigger: "blur",
    },
    {
      min: 3,
      max: 8,
      message: "Length should be 3 to 8",
      trigger: "blur",
    },
  ],
  userPW: [
    {
      required: true,
      message: "Please input Activity password",
      trigger: "blur",
    },
  ],
};
</script>

<style lang="scss">
@media screen and (min-width: 360px) and (max-width: 768px) {
  .app-personW-window {
    .demo-ruleForm {
      width: 100%;
    }
  }
}
@media screen and (max-width: 768px) {
  .app-personW-window {
    .demo-ruleForm {
      width: 90%;
    }
  }
}
// .app-personW-window {
//   .demo-ruleForm {
//     width: 70%;
//   }
// }
</style>