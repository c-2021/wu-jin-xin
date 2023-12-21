<template>
  <el-card class="card">
    <el-upload
      ref="uploadEle"
      action=""
      :multiple="false"
      :show-file-list="true"
      :limit="1"
      accept=".doc,.docx,.DOC,.DOCX"
      :auto-upload="false"
      :http-request="uploadFile"
      :before-upload="beforeUpload"
      :on-exceed="onExceed"
    >
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
      <el-button class="ml-6" type="success" @click="submitUpload"> 上传 </el-button>
    </el-upload>
  </el-card>
  <el-dialog
    title="转换PDF"
    v-model="visible"
    width="400px"
    destroy-on-close
    center:close-on-click-modal="false"
  >
    <el-form ref="formEle" :model="form" :rules="rules" class="demo-ruleForm">
      <el-form-item label="转换后的文件名称" prop="name">
        <el-input v-model.trim="form.name" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import request from "@/lib/request";
import apiPath from "@/lib/apiPath";
import { ref, reactive } from "vue";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { ElMessage, genFileId } from "element-plus";

const originalFileName = ref("");
const uploadEle = ref<UploadInstance>();
const uploadLoading = ref(false);
const clearFiles = () => {
  uploadEle.value!.clearFiles();
};
// 上传文件
const uploadFile = ({ file }) => {
  let data = new FormData();
  data.append("file", file);
  uploadLoading.value = true;
  return request
    .post(apiPath.file.upload, data)
    .then((res: any) => {
      ElMessage.success("操作成功");
      originalFileName.value = res;
      visible.value = true;
      clearFiles();
    })
    .finally(() => {
      uploadLoading.value = false;
    });
};
const beforeUpload = file => {
  const isExcel = /\.(doc|docx|DOC|DOCX)$/i.test(file.name);
  const isExceedSize = file.size / 1024 / 1024 > 5;
  if (!isExcel) {
    ElMessage.error("上传文件只能是word文件,请检查文件!");
  }
  if (isExceedSize) {
    ElMessage.error("上传文件大小不能超过5MB!");
  }
  return isExcel && !isExceedSize;
};
const onExceed: UploadProps["onExceed"] = files => {
  uploadEle.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadEle.value!.handleStart(file);
};
const submitUpload = () => {
  uploadEle.value!.submit();
};

const visible = ref(false);
const form = reactive({
  name: "",
});
const formEle = ref();
const rules = {
  name: [
    {
      required: true,
      message: "请输入转换后的文件名称",
      trigger: "blur",
    },
  ],
};
const submit = () => {
  formEle.value?.validate(valid => {
    if (valid) {
      request
        .post(
          apiPath.file.toPDF,
          {
            fileName: originalFileName.value,
            toName: form.name,
          },
          { responseType: "blob" }
        )
        .then((res: any) => {
          ElMessage.success("操作成功");
          if (res) {
            // 创建一个新的Blob对象来表示响应数据
            const blob = new Blob([res], { type: "application/pdf" });
            // 创建一个临时URL来表示这个Blob对象
            const url = URL.createObjectURL(blob);
            // 新增代码：在新窗口中预览PDF文件
            window.open(url);
          }
        });
    }
  });
};
</script>

<style lang="less">
.card {
  width: 300px;
  margin: 100px auto;
}
.ml-6 {
  margin-left: 6px;
}
</style>
