<template>
  <el-page-header @back="goBack" title="回到主页" />
  <el-container class="editmax">
    <el-aside class="edit-el-aside">
      <div class="block">
        <h2>《{{ novelName }}》</h2>
        <div class="demo-collapse">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="大纲" name="1">
              <el-input
                v-model="filterText"
                placeholder="小说大纲搜索"
                class="search-mainPoint"
              />
              <el-tree
                ref="tree"
                class="filter-tree"
                :data="mainPoint"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                @node-click="nodeClick"
              />
            </el-collapse-item>
            <!-- <el-collapse-item title="基本信息" name="2">
              <p>{{ currentNovelInfo }}</p>
            </el-collapse-item> -->
            <el-collapse-item title="使用说明" name="3">
              <ol>
                <li>生成大纲的方法！！</li>
                <li>点击"H"选择h1新建章</li>
                <li>通过h1到h5来确定章节所属</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-aside>
    <el-main class="edit-el-main">
      <el-form :label-position="labelPosition" class="edit-el-main-form">
        <div class="demo-collapse"></div>
        <div id="text-area"></div>
        <el-button @click="onSaveArticle(1)">本地保存</el-button>
        <el-button @click="onSaveArticle(2)">上传</el-button>
      </el-form>
      <!-- 新增章按钮弹出层 -->
      <!-- <el-dialog
        v-model="dialogFestival"
        width="15%"
        :before-close="closeDialog()"
      >
        <el-form :model="formChapter">
          <el-form-item label="新建章名" required>
            <el-input
              v-model="formChapter.name"
              prop="name"
              placeholder="章节一"
            ></el-input>
          </el-form-item>
          <el-form-item label="章节位置" required>
            <el-radio-group v-model="formChapter.radio">
              <el-radio :label="1" @change="formChapter.nearlabel = 1"
                >开头</el-radio
              >
              <el-radio :label="2" @change="formChapter.nearlabel = 2"
                >结尾</el-radio
              >
              <el-radio :label="3" @change="formChapter.nearlabel = 3"
                >在某章后</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="最近章名"
            required
            v-if="formChapter.nearlabel == 3"
          >
            <el-select v-model="formChapter.nearchapter" placeholder="Select">
              <el-option-group
                v-for="group in mainPoint"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFestival = false">取消</el-button>
            <el-button type="primary" @click="onAddChapter()">保存</el-button>
          </span>
        </template>
      </el-dialog> -->

      <!-- 新增节按钮弹出层 -->
      <!-- <el-dialog
        v-model="dialogChapter"
        width="15%"
        :before-close="closeDialog()"
      >
        <el-form :model="formChapter">
          <el-form-item label="新建节名" required>
            <el-input
              v-model="formChapter.name"
              prop="name"
              placeholder="第一节"
            ></el-input>
          </el-form-item>
          <el-form-item label="所在章名" required>
            <el-select
              v-model="formChapter.inchapter"
              placeholder="Select"
              @click="formChapter.nearchapter = ''"
            >
              <el-option-group
                v-for="group in mainPoint"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="位置" required>
            <el-radio-group v-model="formChapter.radio">
              <el-radio :label="1" @change="formChapter.nearlabel = 1"
                >开头</el-radio
              >
              <el-radio :label="2" @change="formChapter.nearlabel = 2"
                >结尾</el-radio
              >
              <el-radio :label="3" @change="formChapter.nearlabel = 3"
                >在某节后</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="在某节后"
            v-if="formChapter.nearlabel == 3"
            required
          >
            <el-select
              v-model="formChapter.nearchapter"
              placeholder="Select"
              @click="arr = getChapter(formChapter.inchapter)"
            >
              <el-option
                v-for="item in arr"
                :key="item.label"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogChapter = false">取消</el-button>
            <el-button type="primary" @click="onAddSection()">保存</el-button>
          </span>
        </template>
      </el-dialog> -->
    </el-main>
  </el-container>
</template>

<script>
import { defineComponent, ref, onMounted, computed, watch } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import { useStore } from "vuex";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import E from "wangeditor";
import { uploadNovelContent, downloadNovel } from "../api/unit";
export default defineComponent({
  data() {
    return { filterText: "" };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
  setup() {
    const activeNames = ref(["3"]);

    const router = useRouter();

    const goBack = () => {
      router.push({ name: "NovelCard" });
    };

    const formChapter = ref({
      name: "",
      radio: "",
      nearlabel: "",
      nearchapter: "",
      inchapter: "",
    });

    let editor;

    const nodeClick = (res) => {
      if (res.label != novelName) editor.scrollToHead(res.id);
    };

    const count = ref(0);

    const store = useStore();

    const dialogChapter = ref(false);

    const dialogFestival = ref(false);

    const filterText = ref("");
    // const tree = ref(null);
    // const route = useRoute();
    const currentNovelInfo = JSON.parse(
      localStorage.getItem("currentNovelInfo")
    );

    const novel_ID = currentNovelInfo.novel_ID;

    const novelName = currentNovelInfo.title;

    const load = () => {
      count.value += 2;
    };

    const defaultProps = {
      children: "children",
      label: "label",
      id: "id",
    };

    let novelList = computed(() => store.state.novelList);

    let mainPoint = computed(() => {
      if (store.state.novelList.length > 0) {
        return store.state.novelList.filter(
          (item) => item.novel_ID == novel_ID
        )[0].mainPoint;
      }
    });

    const getChapter = (name) => {
      for (let i = 0; i < mainPoint.value[0].children.length; i++) {
        if (name === mainPoint.value[0].children[i].label) {
          return mainPoint.value[0].children[i].children;
        }
      }
    };

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
    const closeDialog = () => {
      formChapter.value = {
        name: "",
        radio: "",
        nearlabel: "",
        nearchapter: "",
        inchapter: "",
      };
    };

    // 根据h1-h5切割数组
    const convert = (raw) => ({
      label: raw.text,
      tag: raw.tag,
      children: [],
      id: raw.id,
    });

    const isParent = (tag1, tag2) => {
      return parseInt(tag1[1]) + 1 === parseInt(tag2[1]);
    };

    const isGte = (tag1, tag2) => {
      return parseInt(tag1[1]) >= parseInt(tag2[1]);
    };

    const isEqual = (tag1, tag2) => {
      return parseInt(tag1[1]) === parseInt(tag2[1]);
    };

    const recurse = (node, arr) => {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (isParent(node.tag, item.tag)) {
          const convertedItem = convert(item);
          node.children.push(convertedItem);
          recurse(convertedItem, arr.slice(i + 1));
        }
        if (isGte(node.tag, item.tag)) break;
      }
    };

    const fn = (arr) => {
      const result = [];
      const head = arr[0];
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (isEqual(head.tag, item.tag)) {
          const converedItem = convert(item);
          result.push(converedItem);
          recurse(converedItem, arr.slice(i + 1));
        }
      }
      return result;
    };

    const onSaveArticle = async (flag) => {
      switch (flag) {
        case 1:
          if (editor.txt.text() != "") {
            localStorage.setItem(novel_ID, editor.txt.html());
            notify("保存成功", "info", `《${novelName}》已进行本地保存`);
            break;
          }
        case 2:
          if (editor.txt.text() != "") {
            articleToServer(novel_ID, editor.txt.html());
            notify("保存成功", "success", `《${novelName}》已上传`);
            break;
          }
      }
    };

    // 将文章提交到对象存储
    const articleToServer = (novel_ID, editorContent) => {
      localStorage.removeItem(novel_ID);
      uploadNovelContent(novel_ID, editorContent);
    };

    const getNovelContent = async () => {
      const localdata = localStorage.getItem(novel_ID);
      if (localdata != null) {
        return localdata;
      } else {
        try {
          const res = await downloadNovel(novel_ID);
          localStorage.setItem(novel_ID, res.Body);
          return res.Body;
        } catch {}
      }
    };

    const addChildren = (arr) => {
      if (novelList.value.length > 0) {
        let mainPointIndex = novelList.value.findIndex(
          (item) => item.novel_ID == novel_ID
        );
        const children = fn(arr);
        store.dispatch("UpdateChapter", { children, mainPointIndex });
      }
    };

    // watch(
    //   () => novelList.value,
    //   async (newParams) => {}
    // );

    onMounted(async () => {
      editor = new E(document.getElementById("text-area"));
      editor.config.excludeMenus = [
        "emoticon",
        "video",
        "link",
        "list",
        "todo",
        "image",
        "table",
        "code",
      ];
      editor.config.zIndex = 1;
      editor.config.height = 600;
      const novelContent = await getNovelContent(editor);
      editor.config.onCatalogChange = (arr) => {
        addChildren(arr);
      };
      editor.create();
      editor.txt.html(novelContent);
    });
    onBeforeRouteLeave(async (to, from) => {
      if (from.name === "EditWindow") {
        // 本地保存1
        onSaveArticle(1);
      }
    });
    window.onbeforeunload = (event) => {
      // onSaveArticle(1);
    };
    return {
      count,
      novelName,
      formChapter,
      dialogChapter,
      dialogFestival,
      defaultProps,
      filterText,
      value: "",
      mainPoint,
      activeNames,
      currentNovelInfo,
      // onAddChapter,
      // onAddSection,
      ElMessageWindow,
      load,
      getChapter,
      closeDialog,
      nodeClick,
      onSaveArticle,
      articleToServer,
      goBack,
    };
  },
});
</script>

<style lang="scss" scoped>
.editmax {
  .demo-collapse {
    width: 90%;
    margin: auto;
  }
  .demo-collapse li {
    text-align: left;
  }
  #catalogBox a {
    text-decoration: none;
    color: black;
  }
  #text-area {
    width: 100%;
    margin-top: 50px;
    text-align: left;
    margin-bottom: 30px;
  }
  .el-tree {
    width: 90%;
    margin: 10px auto;
  }
  .editform {
    width: 50%;
    margin: 10px auto;
  }
  .editmax {
    display: flex;
  }
  .edit-el-main {
    height: 100%;
  }
  .edit-el-aside {
    width: 20%;
    // margin-left: 50px;
  }
  .search-mainPoint {
    margin-top: 10px;
    width: 90%;
  }
  .infinite-list {
    height: 500px;
    padding: 0;
    margin: 0;
    list-style: none;

    .infinite-list-item {
      display: flex;
      border-radius: 0.5cm;
      align-items: center;
      justify-content: center;
      height: 50px;
      background: var(--el-color-primary-light-9);
      margin: 10px;
      color: var(--el-color-primary);
      & + .list-item {
        margin-top: 10px;
      }
    }
  }
  .edit-el-main-form {
    width: 100%;
  }
  .editmax .EasyMDEContainer {
    width: 90%;
    margin: auto;
    text-align: left;
  }
  .edit-right-input {
    width: 90%;
  }
}
</style>