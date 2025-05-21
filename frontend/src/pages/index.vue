<template>
  <v-sheet border rounded>
    <v-data-table :headers="headers" hover :hide-default-footer="lists.length < 11" :items="lists"
      style="min-height: 500px;">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>

            记录
          </v-toolbar-title>

          <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="创建记录" border @click="add"></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.title="{ value }">
        <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-book" label>
          <template v-slot:prepend>
            <v-icon color="medium-emphasis"></v-icon>
          </template>
        </v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <!-- 复制URL按钮 -->
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" color="medium-emphasis" icon="mdi-content-copy" size="small"
                @click="addClipBoard(item.url)"></v-icon>
            </template>
            <span>复制预览URL</span>
          </v-tooltip>

          <!-- 打开URL按钮 -->
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" color="medium-emphasis" icon="mdi-open-in-new" size="small"
                @click="openUrl(item.url)" style="cursor: pointer;"></v-icon>
            </template>
            <span>打开预览URL</span>
          </v-tooltip>

          <!-- 上传文件按钮 -->
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" color="medium-emphasis" icon="mdi-folder-upload" size="small"
                @click="tableName = item.name; fileshow = true;"></v-icon>
            </template>
            <span>上传文件</span>
          </v-tooltip>

          <!-- 删除按钮 -->
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" color="medium-emphasis" icon="mdi-delete" size="small"
                @click="remove(item.name)"></v-icon>
            </template>
            <span>删除记录</span>
          </v-tooltip>
        </div>
      </template>
      <template v-slot:bottom>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="length"></v-pagination>
        </div>
      </template>
    </v-data-table>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card :subtitle="`${isEditing ? '编辑' : '创建'} 记录`" :title="`${isEditing ? '编辑' : '创建'}记录`">
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="record.name" label="名称"></v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-text-field v-model="record.description" label="描述"></v-text-field>
          </v-col>

        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="取消" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="保存" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <FileUpLoad v-model:show="fileshow" :tableName="tableName"></FileUpLoad>
</template>

<script lang="ts" setup>
import { listTable, createTable, deleteTable } from "@/api"
import { shallowRef } from "vue"
import FileUpLoad from "@/components/FileUpLoad.vue";
import { useAppStore } from "@/stores/app";
function openUrl(url: string) {
  const fullUrl = `${window.location.origin}/user-upload/${url}/`
  window.open(fullUrl, "_blank")
}
const store = useAppStore()
function addClipBoard(url: string) {
  navigator.clipboard.writeText(`${window.location.origin}/user-upload/${url}/`)
  store.addQueue({
    text: "预览URL已复制到剪贴板！"
  });
}
const page = 1;
const length = ref(0)
async function getData() {
  const data = await listTable({
    page: page,
    limit: 10
  })
  lists.value = data.data.data
  length.value = data.data.total / 10 + 1;
}
onMounted(getData)
const lists = ref<{ name: string, description: string, url: string }[]>([])

const DEFAULT_RECORD = { name: "", description: "" }

// const lists = ref([])
const record = ref(DEFAULT_RECORD)
const dialog = shallowRef(false)
const isEditing = shallowRef(false)
const headers = [
  { title: '名称 ', key: 'name', align: 'start' },
  { title: '描述', key: 'description' },
  { title: '操作', key: 'actions', align: 'end', sortable: false },
]
function add() {
  isEditing.value = false
  record.value = DEFAULT_RECORD
  dialog.value = true
}
function edit(name: string) {
  isEditing.value = true

  const found = lists.value.find(book => book.name === name)

  record.value = {
    name: found?.name || "",
    description: found?.description || "",
  }

  dialog.value = true
}
async function remove(name: string) {
  if (isEditing.value) {

  } else {
    try {
      const data = await deleteTable(name)
      console.log(data)
      if (data.status === 201 || data.status === 200) {
        getData()
      }

    } catch (error) {

    }
  }
}
async function save() {
  if (isEditing.value) {

  } else {
    try {
      const data = await createTable(record.value)
      console.log(data)
      if (data.status === 201 || data.status === 200) {
        getData()
        dialog.value = false
      }

    } catch (error) {

    }
  }
}

const fileshow = ref(false);
const tableName = ref("");
</script>
