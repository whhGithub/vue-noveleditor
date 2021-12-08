<template>
  <div class="app-user-window">
    <el-avatar
      :size="50"
      src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      class="el-avatar"
    ></el-avatar>
    <!-- 登录表单 -->
    <el-form
      ref="loginFruleForm"
      :model="LoginForm"
      :rules="Loginrules"
      label-width="120px"
      class="demo-ruleForm"
      v-if="isLogin"
    >
      <el-form-item label="账号" prop="UserAccount" label-width="50px">
        <el-input v-model="LoginForm.UserAccount"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="UserPW" label-width="50px">
        <el-input v-model="LoginForm.UserPW" type="password"></el-input>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-button type="primary" @click="submitForm('loginFruleForm')"
          >登录</el-button
        >
        <el-button @click="resetForm('loginFruleForm')"
          >重新输入</el-button
        ></el-form-item
      >
    </el-form>

    <!-- 注册表单 -->
    <el-form
      ref="registerFruleForm"
      :model="RegisterForm"
      :rules="Registrules"
      label-width="120px"
      class="demo-ruleForm"
      v-else
      ><el-form-item label="账号" prop="UserAccountRegist" label-width="50px">
        <el-input v-model="RegisterForm.UserAccountRegist"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="UserNameRegist" label-width="50px">
        <el-input v-model="RegisterForm.UserNameRegist"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="UserPWRegist" label-width="50px">
        <el-input
          v-model="RegisterForm.UserPWRegist"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="UserMailRegist" label-width="50px">
        <el-input v-model="RegisterForm.UserMailRegist" type="email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="UserPhoneRegist" label-width="65px">
        <el-input v-model="RegisterForm.UserPhoneRegist"></el-input>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-button type="primary" @click="submitForm('registerFruleForm')"
          >点击注册</el-button
        >
        <el-button @click="resetForm('registerFruleForm')">重新输入</el-button>
      </el-form-item>
    </el-form>

    <el-button type="text" @click="Switch">{{ switchText }}</el-button>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElNotification, ElMessage } from "element-plus";
import { request } from "../api/axios";
import router from "../router/index";
import { useStore } from "vuex";
const store = useStore();

const loginFruleForm = ref(null);

const registerFruleForm = ref(null);

const isLogin = ref(true);

const switchText = ref("没有账号用户，点击注册");

const notify = (title, type, info) => {
  ElNotification({
    title: title,
    message: info,
    type: type,
  });
};

const ElMessageWindow = (type, message) => {
  ElMessage({
    type: type,
    message: message,
  });
};

const validatePass = (rule, value, callback) => {
  let ab = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (value === "") {
    callback(new Error("Please input the password"));
  } else if (ab.test(value) === false) {
    callback(new Error("Please input the correct password"));
  } else {
    callback();
  }
};

const Registrules = {
  UserAccountRegist: [
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
  UserPhoneRegist: [
    { validator: validatePass, trigger: "blur", required: true },
  ],
  UserMailRegist: [
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
  UserNameRegist: [
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
  UserPWRegist: [
    {
      required: true,
      message: "Please input Activity password",
      trigger: "blur",
    },
  ],
};

const Loginrules = {
  UserAccount: [
    {
      required: true,
      message: "Please input Activity UserAccount",
      trigger: "blur",
    },
    {
      min: 5,
      max: 11,
      message: "Length should be 5 to 11",
      trigger: "blur",
    },
  ],
  UserPW: [
    {
      required: true,
      message: "Please input Activity password",
      trigger: "blur",
    },
  ],
};
const initLoginForm = { UserAccount: "", UserPW: "" };

var LoginForm = reactive({ ...initLoginForm });

const initRegisterForm = {
  UserAccountRegist: "",
  UserNameRegist: "",
  UserPWRegist: "",
  UserMailRegist: "",
  UserPhoneRegist: "",
};

let RegisterForm = reactive({
  ...initRegisterForm,
});

const Switch = () => {
  if (switchText.value === "没有账号用户，点击注册") {
    switchText.value = "已注册完毕，去登录";
    isLogin.value = false;
    resetForm("loginFruleForm");
  } else {
    switchText.value = "没有账号用户，点击注册";
    isLogin.value = true;
    resetForm("registerFruleForm");
  }
};

const submitForm = (formName) => {
  if (formName === "loginFruleForm") {
    loginFruleForm.value.validate((valid) => {
      if (valid) {
        console.log(valid);
        loginOrRegister(formName);
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  } else if (formName === "registerFruleForm") {
    registerFruleForm.value.validate((valid) => {
      if (valid) {
        console.log(valid);
        loginOrRegister(formName);
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  }
};

const resetForm = (formName) => {
  if (formName === "loginFruleForm") {
    loginFruleForm.value.resetFields();
  } else if (formName === "registerFruleForm") {
    registerFruleForm.value.resetFields();
  }
};

const loginOrRegister = (formName) => {
  if (
    formName === "loginFruleForm" &&
    LoginForm.UserAccount != null &&
    LoginForm.UserPW != null
  ) {
    // 发送 POST 请求
    request({
      url: "user/login",
      method: "GET",
      params: {
        UserAccount: LoginForm.UserAccount,
        UserPW: LoginForm.UserPW,
      },
    })
      .then((res) => {
        if (res.data.statusCode === 1) {
          console.log(res);
          localStorage.setItem("userStatusCode", res.data.statusCode);
          localStorage.setItem("userInfo", JSON.stringify(res.data.data));
          router.push({ name: "NovelCard" });
          store.state.isUse = true;
          resetForm("loginFruleForm");
          notify("登录成功", "success", "开始您的创作吧！！！");
        } else {
          resetForm("loginFruleForm");
          ElMessageWindow("warning", "登录失败，用户名或密码错误！");
        }
      })
      .catch((err) => {
        ElMessageWindow("error", "网路出错啦！");
      });
  }
  if (
    formName === "registerFruleForm" &&
    RegisterForm.UserNameRegist != null &&
    RegisterForm.UserPWRegist != null &&
    RegisterForm.UserMailRegist != null &&
    RegisterForm.UserPhoneRegist != null
  ) {
    // 发送 POST 请求
    request({
      url: "user/register",
      method: "POST",
      params: {
        UserAccount: RegisterForm.UserAccountRegist,
        UserName: RegisterForm.UserNameRegist,
        UserPW: RegisterForm.UserPWRegist,
        UserMail: RegisterForm.UserMailRegist,
        UserPhone: RegisterForm.UserPhoneRegist,
      },
    })
      .then((res) => {
        if (res.data.statusCode === 1) {
          resetForm("registerFruleForm");
          isLogin.value = true;
          console.log(res);
          notify("注册成功", "success", "马上登录！");
        } else {
          resetForm("registerFruleForm");
          ElMessageWindow("warning", "该账号或手机号已存在");
        }
      })
      .catch((err) => {
        ElMessageWindow("error", "网路出错啦！");
      });
  }
};
</script>
<style lang="scss">
@media screen and (min-width: 360px) and (max-width: 768px) {
  .demo-ruleForm {
    display: flex;
    flex-direction: column;
    width: 95%;
    margin: auto;
  }
}
@media screen and (min-width: 768px) and (max-width: 1334px) {
  .demo-ruleForm {
    display: flex;
    flex-direction: column;
    width: 70%;
    margin: auto;
  }
}
@media screen and (min-width: 1334px) {
  .demo-ruleForm {
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: auto;
  }
}
.app-user-window {
  .el-avatar {
    margin: 25px auto;
  }
}
</style>