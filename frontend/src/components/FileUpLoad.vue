<!-- FolderUploadDialog.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VFileInput,
  VBtn,
  VProgressCircular,
  VSnackbar,
  VProgressLinear,
} from 'vuetify/components';
import { uploadFolder, clearFolder } from "@/api";

// 定义文件项类型
interface FileItem {
  file: File;
  relativePath: string;
}

// 控制对话框显示
const dialog = defineModel("show", { default: false });
// 存储上传的文件和相对路径
const files = ref<FileItem[]>([]);
// 拖拽状态
const isDragging = ref(false);
// 上传状态
const isUploading = ref(false);
// 上传进度
const uploadProgress = ref(0);
// 当前上传批次
const currentBatch = ref(0);
// 每批文件数量
const BATCH_SIZE = 10;
// Snackbar 提示
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

// 计算进度百分比
const progressPercentage = computed(() => {
  return files.value.length > 0
    ? Math.round((uploadProgress.value / files.value.length) * 100)
    : 0;
});

// 处理文件选择（点击上传）
const handleFileInput = (selectedFiles: File[]) => {
  files.value = []; // 清空现有文件
  Array.from(selectedFiles).forEach(async (file) => {
    const relativePath = await getRelativePath(file);
    files.value.push({ file, relativePath });
  });
};

// 处理拖拽文件
const handleDrop = async (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;

  const items = event.dataTransfer?.items;
  if (!items) return;

  files.value = []; // 清空现有文件
  const fileEntries: FileItem[] = [];

  for (const item of Array.from(items)) {
    const entry = item.webkitGetAsEntry();
    if (entry) {
      await processEntry(entry, fileEntries, '', entry.name);
    }
  }

  files.value = fileEntries;
};

// 处理拖拽进入
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

// 处理拖拽离开
const handleDragLeave = () => {
  isDragging.value = false;
};

// 获取文件的相对路径，去除根目录
const getRelativePath = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // @ts-ignore: webkitRelativePath 是非标准属性
    let relativePath = file.webkitRelativePath || file.name;
    const pathParts = relativePath.split('/');
    if (pathParts.length > 1) {
      relativePath = pathParts.slice(1).join('/');
    }
    resolve(relativePath || file.name);
  });
};

// 递归处理文件夹和文件，去除根目录
const processEntry = async (
  entry: FileSystemEntry,
  fileEntries: FileItem[],
  basePath = '',
  rootDir = '',
): Promise<void> => {
  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;
    const file = await new Promise<File>((resolve) => fileEntry.file(resolve));
    let relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
    if (rootDir && relativePath.startsWith(`${rootDir}/`)) {
      relativePath = relativePath.slice(rootDir.length + 1);
    }
    fileEntries.push({ file, relativePath: relativePath || entry.name });
  } else if (entry.isDirectory) {
    const dirEntry = entry as FileSystemDirectoryEntry;
    const reader = dirEntry.createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve) => {
      reader.readEntries(resolve);
    });
    const newBasePath = basePath ? `${basePath}/${entry.name}` : (entry.name === rootDir ? '' : entry.name);
    for (const subEntry of entries) {
      await processEntry(subEntry, fileEntries, newBasePath, rootDir);
    }
  }
};

// 清空文件列表
const clearFiles = () => {
  files.value = [];
  uploadProgress.value = 0;
  currentBatch.value = 0;
};

// 分批上传文件
const uploadFiles = async () => {
  if (!files.value.length) {
    snackbarMessage.value = '请先选择文件夹';
    snackbarColor.value = 'warning';
    snackbar.value = true;
    return;
  }
  isUploading.value = true;
  uploadProgress.value = 0;
  currentBatch.value = 0;
  try {
    await clearFolder(props.tableName);

  } catch (error) {

  }
  try {
    // 计算总批次
    const totalBatches = Math.ceil(files.value.length / BATCH_SIZE);

    // 分批上传
    for (let i = 0; i < totalBatches; i++) {
      currentBatch.value = i + 1;
      const start = i * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, files.value.length);
      const batchFiles = files.value.slice(start, end);

      const formData = new FormData();
      batchFiles.forEach((item) => {
        formData.append('files', item.file);
      });
      formData.append('paths', JSON.stringify(batchFiles.map((item) => item.relativePath)));
      formData.append('tableName', props.tableName);
      formData.append('batch', i.toString());
      formData.append('totalBatches', totalBatches.toString());

      const response = await uploadFolder(formData);

      if (response.status === 201) {
        uploadProgress.value += batchFiles.length;
      } else {
        throw new Error(`批次 ${i + 1} 上传失败`);
      }
    }

    snackbarMessage.value = '所有文件上传成功';
    snackbarColor.value = 'success';
    snackbar.value = true;
    clearFiles();
    dialog.value = false;
  } catch (error: any) {
    snackbarMessage.value = error.message || '上传失败';
    snackbarColor.value = 'error';
    snackbar.value = true;
  } finally {
    isUploading.value = false;
  }
};

const props = defineProps({
  tableName: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>上传文件夹</v-card-title>
      <v-card-text>
        <div class="drop-zone" :class="{ 'dragging': isDragging }" @dragover="handleDragOver"
          @dragleave="handleDragLeave" @drop="handleDrop">
          <v-file-input v-model="files" label="选择文件夹" webkitdirectory directory multiple prepend-icon="mdi-folder"
            @update:modelValue="handleFileInput" :disabled="isDragging || isUploading"></v-file-input>
          <p v-if="!isDragging">拖拽文件夹到此区域或点击选择</p>
          <p v-else>释放文件夹以上传</p>
        </div>

        <!-- 文件列表 -->
        <div v-if="files.length" class="file-list">
          <p v-for="(item, index) in files" :key="index">
            {{ item.relativePath }} ({{ (item.file.size / 1024).toFixed(2) }} KB)
          </p>
        </div>
        <p v-else class="text-center">暂无文件</p>

        <!-- 上传进度 -->
        <div v-if="isUploading" class="progress-container">
          <v-progress-linear :model-value="progressPercentage" color="primary" height="10" rounded></v-progress-linear>
          <p class="progress-text">
            上传中: {{ uploadProgress }} / {{ files.length }} 文件 (批次 {{ currentBatch }})
          </p>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" text @click="dialog = false" :disabled="isUploading">取消</v-btn>
        <v-btn color="warning" text @click="clearFiles" :disabled="!files.length || isUploading">清空</v-btn>
        <v-btn color="primary" text @click="uploadFiles" :disabled="!files.length || isUploading">上传</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<style scoped>
.drop-zone {
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.drop-zone.dragging {
  border-color: #1976d2;
  background-color: #e3f2fd;
}

.file-list {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 16px;
}

.text-center {
  text-align: center;
  color: #888;
}

.progress-container {
  margin-top: 16px;
}

.progress-text {
  text-align: center;
  margin-top: 8px;
  color: #666;
}
</style>
