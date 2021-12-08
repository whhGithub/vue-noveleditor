<template>
  <el-card class="opinion-box-card">
    <template #header>
      <div class="card-header">
        <span>意见反馈</span>
        <!-- <el-button class="button" type="primary" disabled>提交</el-button> -->
      </div>
    </template>
    <el-row>
      <el-col :sm="12" :lg="6">
        <el-result
          icon="info"
          title="模块正在更新中.."
          sub-title="反馈请先发送邮箱至：2625650995@qq.com"
        >
          <template #extra>
            <el-button type="primary" size="medium" @click="goMain"
              >回到主页</el-button
            >
          </template>
        </el-result>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import router from "../router/index";
import { useStore } from "vuex";
const store = useStore();
const goMain = () => {
  router.push("NovelCard");
};
</script>

<style lang="scss">
.opinion-box-card {
  width: 70%;
  margin: auto;
  height: 400px;
  .el-row .el-col-lg-6 {
    margin: auto;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    width: 480px;
  }
}
</style>
