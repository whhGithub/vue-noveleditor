<template>
  <el-container class="el-container-max" v-if="novelList.length">
    <el-card
      :body-style="{ padding: '0px' }"
      v-for="item in novelList"
      :key="item"
      class="el-card-small"
    >
      <img
        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        class="image"
      />
      <div style="padding: 14px">
        <span>《{{ item.name }}》</span>
        <div class="bottom">
          <el-button type="text" class="button">点击编辑</el-button>
        </div>
      </div>
    </el-card> </el-container
  ><el-empty description="点击右上角铅笔或抽柜新增小说！！！！！" v-else>
  </el-empty>
</template>

<script>
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import router from "../router/index";
export default defineComponent({
  setup() {
    const store = useStore();
    const novelList = computed(() => store.state.novelList);
    const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
    const toEdit = (uid, name) => {
      router.push({ name: "EditWindow", params: { uid: uid, name: name } });
    };
    return { novelList, UserInfo, toEdit };
  },
});
</script>

<style lang="scss" scoped>
.el-container-max {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
  .el-card-small {
    // margin-left: 100px;
    // margin-right: 100px;
    // margin-top: 50px;
    border-radius: 0.5cm;
  }
}
</style>


