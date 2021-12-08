<template>
  <el-autocomplete
    v-model="state2"
    :fetch-suggestions="querySearch"
    :trigger-on-focus="false"
    class="inline-input"
    placeholder="Please Input"
    @select="handleSelect"
  />
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const novelList = computed(() => store.state.novelList);

const searchobj = (raw) => ({
  value: raw.title,
});

const loadAll = () => {
  if (novelList.value != null) {
    const searchAll = [];
    for (let i = 0; i < novelList.value.length; i++) {
      searchAll.push(searchobj(novelList.value[i]));
    }
    return searchAll;
  }
};

const restaurants = ref([]);

const querySearch = (queryString, cb) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value;
  // call callback function to return suggestions
  cb(results);
};

const createFilter = (queryString) => {
  return (restaurants) => {
    return (
      restaurants.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

// 搜索框输入的双向绑定
let state2 = ref("");

watch(state2, () => {
  store.state.search = state2.value;
});

const handleSelect = (item) => {
  console.log(item);
};

watch(
  () => store.state.novelList,
  async () => {
    restaurants.value = loadAll();
  }
);
</script>