<template>
  <el-row>
    <el-col :sm="12" :lg="6">
      <el-result
        icon="error"
        title="移动端"
        sub-title="暂不支持本设备，请使用pc端"
      >
        <template #extra>
          <el-button type="primary" size="medium" @click="close"
            >close</el-button
          >
        </template>
      </el-result>
    </el-col>
  </el-row>
</template>

<script setup>
const close = () => {
  window.close();
};
</script>

<style lang="scss" scoped>
.el-row {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  box-sizing: border-box;
  justify-content: center;
}
</style>