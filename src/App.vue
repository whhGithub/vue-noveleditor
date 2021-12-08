<script setup>
import { onMounted, ref } from "vue";
import MainApp from "./view/Main.vue";
import PhoneWindow from "./components/PhoneWindow.vue";
// const isMobile = () => {
//   let flag = navigator.userAgent.match(
//     /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows)/i
//   );
//   return flag;
// };

const isMobileFlag = ref(false);

// onMounted(() => {
//   if (isMobile()[0] === "Windows" || isMobile()[0] === "MacOS") {
//     isMobileFlag.value = false;
//   } else {
//     localStorage.setItem("userStatusCode", "isMobile");
//   }
// });
</script>

<template>
  <phone-window v-if="isMobileFlag"></phone-window>
  <main-app v-else></main-app>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
@media (min-width: 0px) {
  #app {
    margin-top: 60px;
  }
}
</style>
