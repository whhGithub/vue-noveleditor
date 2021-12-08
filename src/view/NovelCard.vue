<template>
  <el-container class="el-container-max" v-if="showNovelList.length">
    <!-- <transition-group name="list"> -->
    <el-card
      class="box-card animate__animated animate__backInDown"
      shadow="hover"
      v-for="item in showNovelList"
      :key="item"
    >
      <template #header>
        <div class="card-header">
          <span>《{{ item.title }}》</span>
          <div>
            <el-button
              class="button"
              type="text"
              @click="toEdit(item.novel_ID, item.title)"
              >编辑</el-button
            >
            <el-popconfirm
              confirm-button-text="是"
              cancel-button-text="否"
              :icon="InfoFilled"
              icon-color="red"
              title="确定要永久删除这本小说吗?"
              @confirm="toDeleteNovel(item.novel_ID, item.title)"
            >
              <template #reference>
                <el-button class="button" type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
      <div class="el-card-body">
        <img :src="item.novel_Cover_Link" class="image" />
        <el-descriptions title="小说简介" column="1">
          <el-descriptions-item label="uid：">{{
            item.novel_ID
          }}</el-descriptions-item>
          <el-descriptions-item label="作者：">{{
            item.novel_Author
          }}</el-descriptions-item>
          <el-descriptions-item label="类型：">{{
            item.type
          }}</el-descriptions-item>
          <el-descriptions-item label="创建日期：">{{
            item.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="简介：">{{
            item.novel_Brief
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    <!-- </transition-group> -->
  </el-container>
  <el-empty
    :image-size="300"
    description="点击右上角铅笔或抽柜新增小说！！！！！"
    v-else
  >
  </el-empty
  ><el-pagination
    layout="prev, pager, next"
    :page-count="pageCount"
    hide-on-single-page="true"
    :current-page="currentPage"
    onUpdate:currentPage
    @current-change="currentChange"
    v-if="isOpenPagination"
  ></el-pagination>
</template>

<script setup>
import { ref, defineComponent, onMounted, watch, computed } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { useStore } from "vuex";
import router from "../router/index";
import { useRoute } from "vue-router";
import { downloadNovelCover } from "../api/unit";
import { request } from "../api/axios";
import { InfoFilled } from "@element-plus/icons";
const ElMessageWindow = (type, message) => {
  ElMessage({
    type: type,
    message: message,
  });
};

// 页面通知
const notify = (title, type, info) => {
  ElNotification({
    title: title,
    message: info,
    type: type,
    position: "top-left",
  });
};
const store = useStore();

const novelList = computed(() => store.state.novelList);

const UserInfo = JSON.parse(localStorage.getItem("userInfo"));

const toEdit = (uid, name) => {
  router.push({
    name: "EditWindow",
  });
  const currentNovelInfo = { novel_ID: uid, title: name };
  localStorage.setItem("currentNovelInfo", JSON.stringify(currentNovelInfo));
};

const isOpenPagination = ref(true);

// 总页数
let pageCount = computed(() => {
  if (novelList.value != null) {
    return Math.ceil(novelList.value.length / 2);
  }
});

// 当前页码
let currentPage = ref(1);

// 展示的列表
const search = computed(() => store.state.search);

const showNovelList = computed(() => {
  if (novelList.value == null) {
    return 0;
  }
  if (search.value != "" && novelList.value != null) {
    isOpenPagination.value = false;
    return JSON.parse(JSON.stringify(novelList.value)).filter(
      (item) => item.title == search.value
    );
  } else if (search.value === "" && novelList.value != null) {
    isOpenPagination.value = true;
    return novelList.value.slice(
      (currentPage.value - 1) * 2,
      currentPage.value * 2
    );
  }
});

// 改变页码时触发的函数
const currentChange = (res) => {
  currentPage.value = res;
};

const toDeleteNovel = async (novel_ID, novel_Name) => {
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

  const res = await request({
    url: "novel/deleteNovel",
    method: "get",
    headers: header,
    params: {
      novelId: novel_ID,
    },
  });

  if (res.data.statusCode === 1) {
    store.commit("deleteNovel", novel_ID);
    ElMessageWindow("success", `《${novel_Name}》删除成功`);
  }
  console.log(res);
};
</script>

<style lang="scss" scoped>
.el-container-max {
  height: 900px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
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
  .el-card-body {
    display: flex;
    justify-content: left;
    .image {
      border-radius: 0.1cm;
      margin-right: 20px;
      width: 200px;
      height: 200px;
    }
  }
  .box-card {
    width: 90%;
    height: 40%;
    margin-bottom: 40px;
  }
  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
}
</style>


