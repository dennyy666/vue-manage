<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface HeroItem {
  id: number
  name: string
  mobile: string
  role: string
  position: string
  roleName: string
  positionName: string
  status: string
  remark: string
  createTime: string
}

type HeroForm = Omit<HeroItem, 'id' | 'createTime'>

const STORAGE_KEY = 'hero-manage-list'
const DEFAULT_PAGE_SIZE = 5

const loading = ref(false)
const heroes = ref<HeroItem[]>([])
const currentPage = ref(1)
const pageSize = ref(DEFAULT_PAGE_SIZE)
const dialogVisible = ref(false)
const isEditMode = ref(false)
const editingId = ref<number | null>(null)

const formRef = ref()
const formModel = reactive<HeroForm>({
  name: '',
  mobile: '',
  role: '',
  position: '',
  roleName: '',
  positionName: '',
  status: '1',
  remark: '',
})

const pagedHeroes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return heroes.value.slice(start, end)
})

const dialogTitle = computed(() => (isEditMode.value ? '编辑英雄' : '新增英雄'))

const formRules = {
  name: [{ required: true, message: '请输入英雄名称', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  positionName: [{ required: true, message: '请输入位置名称', trigger: 'blur' }],
}

const formatNow = () => {
  const now = new Date()
  const pad = (num: number) => String(num).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

const toSafeArray = (value: unknown): HeroItem[] => {
  if (!Array.isArray(value)) return []
  return value as HeroItem[]
}

const persistHeroes = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(heroes.value))
}

const readHeroesFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return toSafeArray(JSON.parse(raw))
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const loadHeroes = async () => {
  const savedHeroes = readHeroesFromStorage()
  if (savedHeroes && savedHeroes.length > 0) {
    heroes.value = savedHeroes
    return
  }

  loading.value = true
  try {
    const url = new URL('../../assets/hero.json', import.meta.url)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }
    const data = toSafeArray(await response.json())
    heroes.value = data
    persistHeroes()
  } catch (error) {
    console.error(error)
    ElMessage.error('英雄数据加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formModel.name = ''
  formModel.mobile = ''
  formModel.role = ''
  formModel.position = ''
  formModel.roleName = ''
  formModel.positionName = ''
  formModel.status = '1'
  formModel.remark = ''
}

const openCreateDialog = () => {
  isEditMode.value = false
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

const openEditDialog = (row: HeroItem) => {
  isEditMode.value = true
  editingId.value = row.id
  formModel.name = row.name
  formModel.mobile = row.mobile
  formModel.role = row.role
  formModel.position = row.position
  formModel.roleName = row.roleName
  formModel.positionName = row.positionName
  formModel.status = row.status
  formModel.remark = row.remark
  dialogVisible.value = true
}

const submitForm = async () => {
  await formRef.value?.validate()

  if (isEditMode.value && editingId.value !== null) {
    const index = heroes.value.findIndex((hero) => hero.id === editingId.value)
    if (index >= 0) {
      const current = heroes.value[index]
      if (current) {
        heroes.value[index] = {
          ...current,
          ...formModel,
        }
        ElMessage.success('编辑成功')
      }
    }
  } else {
    const maxId = heroes.value.reduce((max, item) => Math.max(max, item.id), 0)
    heroes.value.unshift({
      id: maxId + 1,
      createTime: formatNow(),
      ...formModel,
    })
    ElMessage.success('新增成功')
  }

  persistHeroes()
  dialogVisible.value = false
}

const removeHero = async (row: HeroItem) => {
  try {
    await ElMessageBox.confirm(`确认删除英雄“${row.name}”吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    heroes.value = heroes.value.filter((hero) => hero.id !== row.id)
    const maxPage = Math.max(1, Math.ceil(heroes.value.length / pageSize.value))
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage
    }
    persistHeroes()
    ElMessage.success('删除成功')
  } catch {
    // User cancelled deletion.
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

onMounted(() => {
  void loadHeroes()
})
</script>

<template>
  <div class="hero-manage">
    <div class="toolbar">
      <h3>英雄管理</h3>
      <el-button type="primary" @click="openCreateDialog">新增英雄</el-button>
    </div>

    <el-table :data="pagedHeroes" border stripe v-loading="loading" class="hero-table">
      <el-table-column prop="name" label="英雄名" min-width="120" />
      <el-table-column prop="mobile" label="手机号" min-width="140" />
      <el-table-column prop="roleName" label="角色" min-width="100" />
      <el-table-column prop="positionName" label="位置" min-width="100" />
      <el-table-column label="状态" min-width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'info'">
            {{ row.status === '1' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="170" />
      <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />
      <el-table-column label="操作" fixed="right" width="160">
        <template #default="{ row }">
          <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
          <el-button type="danger" link @click="removeHero(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="heroes.length"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="90px">
        <el-form-item label="英雄名" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入英雄名称" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formModel.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="formModel.role" placeholder="例如：1" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formModel.roleName" placeholder="例如：剑士" />
        </el-form-item>
        <el-form-item label="位置编码">
          <el-input v-model="formModel.position" placeholder="例如：1" />
        </el-form-item>
        <el-form-item label="位置名称" prop="positionName">
          <el-input v-model="formModel.positionName" placeholder="例如：上单" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formModel.status" placeholder="请选择状态">
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formModel.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.hero-manage {
  padding: 16px;

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 18px;
      color: #303133;
    }
  }

  .hero-table {
    width: 100%;
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
