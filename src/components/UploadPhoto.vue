<template>
  <el-upload
    action=""
    list-type="picture-card"
    :auto-upload="false"
    :on-change="beforeUpload"
    :on-success="uploadSuccess"
    ref="upload"
    limit="1"
    :on-exceed="onExceed"
    :http-request="httpRequest"
  >
    <template #default>
      <el-icon><plus /></el-icon>
    </template>
    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <!-- <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span> -->
          <!-- <span
            v-if="!state.disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <el-icon><download /></el-icon>
          </span> -->
          <span
            v-if="!state.disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>
  <el-dialog v-model="state.dialogVisible">
    <img width="100%" :src="state.dialogImageUrl" alt="" />
  </el-dialog>
</template>
<script>
import { Plus, ZoomIn, Download, Delete } from "@element-plus/icons";
import { uploadNovel } from "../api/unit";
import { ElNotification, ElMessage } from "element-plus";
import { reactive, ref } from "vue";
export default {
  components: {
    Plus,
    ZoomIn,
    Download,
    Delete,
  },
  props: {
    noveldata: Object,
  },
  setup(props) {
    const state = reactive({
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: [],
    });

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

    const onExceed = () => {
      ElMessageWindow("error", "只能上传一张封面，可删除本封面再上传！");
    };

    const handleRemove = (file) => {
      state.fileList.splice(0, 1);
    };

    const beforeUpload = (file, fileList) => {
      state.fileList = fileList;
      /* 判断图片格式以及大小 */
      /* 查找 . 最后出现的位置 并提取字符串 +1 为了解决substring()方法返回的子串包括 开始 处的字符，但不包括 结束 处的字符。*/
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["jpg", "png"];
      const isLt2M = file.size / 1024 / 1024 > 2;
      const isSuffix = whiteList.indexOf(fileSuffix) === -1;
      if (isSuffix) {
        ElMessageWindow("error", "只支持上传png/jpg格式的图片噢！");
        /* 验证不通过删除此文件 */
        const currIdx = state.fileList.indexOf(file);
        state.fileList.splice(currIdx, 1);
        return;
      }
      if (isLt2M) {
        ElMessageWindow("error", "封面的大小不能超过2mb!");
        const currIdx = state.fileList.indexOf(file);
        state.fileList.splice(currIdx, 1);
        return;
      }
    };

    const upload = ref(null);

    const submitUpload = () => {
      upload.value.submit();
    };

    const httpRequest = async (param) => {
      const res = await uploadNovel(param, props.noveldata);
      console.log(res);
      if (res === 1) {
        notify("保存成功", "success", "期待您的高质量作品！！！！");
      } else {
        notify("保存失败", "error", "出错啦，请重新添加~");
      }
    };

    const uploadSuccess = () => {
      upload.value.clearFiles();
    };

    return {
      state,
      props,
      submitUpload,
      upload,
      httpRequest,
      uploadSuccess,
      beforeUpload,
      handleRemove,
      onExceed,
    };
  },
};

// props: ["noveldata"],
// components: {
//   Plus,
//   ZoomIn,
//   Download,
//   Delete,
// }
</script>