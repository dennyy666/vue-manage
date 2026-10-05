<template>
    <el-card class="table-card">
        <template #header>
            <div class="card-header">
                <span class="title">英雄列表</span>
                <div>
                    <el-button type="danger" @click="batchDelete">批量删除</el-button>
                    <el-button type="primary" @click="addHero">新增英雄</el-button>
                </div>

            </div>
        </template>
        <el-table :data="tableData" border @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column prop="name" label="英雄名" />
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="roleName" label="角色" />
            <el-table-column prop="positionName" label="位置" />
            <el-table-column label="状态">
                <template #default="{ row }">
                    <el-tag :type="row.status === '1' ? 'success' : 'info'">
                        {{ row.status === '1' ? '启用' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="remark" label="备注" show-overflow-tooltip />
            <el-table-column label="操作" fixed="right">
                <template #default="{ row }">
                    <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
                    <el-button type="danger" link @click="deleteHero(row.id, row.name)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination layout="prev, pager, next" :total="total" :current-page="currentPage" :page-size="pageSize"
                :page-sizes="[5, 10, 20]" @current-change="handlePageChange" />
        </div>
    </el-card>

    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="500px" top="10vh" :close-on-click-modal="false"
        destroy-on-close>
        <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="90px" label-position="right" status-icon
            class="hero-form">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名" maxlength="4" clearable />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="请输入手机号" maxlength="11" v-number clearable />
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <el-select v-model="form.role" placeholder="请选择角色" clearable>
                    <el-option label="剑士" value="1" />
                    <el-option label="射手" value="2" />
                    <el-option label="坦克" value="3" />
                    <el-option label="法师" value="4" />
                </el-select>
            </el-form-item>
            <el-form-item label="位置" prop="position">
                <el-select v-model="form.position" placeholder="请选择位置" clearable>
                    <el-option label="上单" value="1" />
                    <el-option label="中单" value="2" />
                    <el-option label="打野" value="3" />
                    <el-option label="ADC" value="4" />
                    <el-option label="辅助" value="5" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择状态" clearable>
                    <el-option label="启用" value="1" />
                    <el-option label="禁用" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="3" maxlength="25" placeholder="请输入备注" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { http } from "@/utils/request";
import { ElMessage, ElMessageBox, } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
// ========== 类型定义 ==========
// 英雄列表项数据结构
interface HeroItem {
    id: number
    name: string
    mobile: string
    role: string
    position: string
    status: string
    remark: string
    roleName?: string
    positionName?: string
    createTime?: string
}
// 下拉选项通用类型
interface SelectOption {
  label: string
  value: number
}
// ========== 常量 ==========
const HERO_STORAGE_KEY = 'hero_data'; // localStorage 中保存英雄数据的键名

// ========== 表格与分页状态 ==========
const allHeroes = ref<HeroItem[]>([]) // 全部英雄数据，未分页
const tableData = ref<HeroItem[]>([]) // 当前页展示的表格数据
const total = ref(0) // 英雄总条数
const loading = ref(false) // 加载状态，当前代码中保留用于请求过程标识
const currentPage = ref(1) // 当前页码
const pageSize = ref(10) // 每页展示条数

// ========== 表格选择状态 ==========
const idSet = ref(new Set()) // 当前表格勾选中的英雄 ID 集合

// ========== 弹窗与表单状态 ==========
const ruleFormRef = ref<FormInstance>() // 表单实例，用于表单校验
const dialogFormVisible = ref(false) // 新增/编辑弹窗是否显示
const isEditMode = ref(false) // 是否为编辑模式
const editingId = ref<number | null>(null) // 当前正在编辑的英雄 ID，新增时为 null

// ========== 下拉选项数据 ==========    
// 角色下拉选项
const roleType: SelectOption[] = [
    {
        label: '剑士',
        value: 1
    },
    {
        label: '射手',
        value: 2
    },
    {
        label: '坦克',
        value: 3
    },
    {
        label: '法师',
        value: 4
    },
]

// 位置下拉选项
const positionType: SelectOption[] = [
    {
        label: '上单',
        value: 1
    },
    {
        label: '中单',
        value: 2
    },
    {
        label: '打野',
        value: 3
    },
    {
        label: 'ADC',
        value: 4
    },
    {
        label: '辅助',
        value: 5
    },
]

// ========== 计算属性 ==========
// 弹窗标题：根据是否为编辑模式动态显示
const dialogTitle = computed(() => (isEditMode.value ? '编辑英雄' : '新增英雄'))


// ========== 表单数据与校验 ==========
// 新增/编辑表单数据
const form = reactive({
    name: '',
    mobile: '',
    role: '',
    position: '',
    status: '',
    remark: '',
})

// 表单校验规则
const rules: FormRules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
            pattern: /^\d{11}$/,
            message: '手机号必须为11位数字',
            trigger: 'blur',
        },
    ],
    role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
    position: [{ required: true, message: '请选择位置', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
    remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}

// ========== 工具函数 ==========
// 格式化当前时间为 yyyy-MM-dd HH:mm:ss
const formatNow = () => {
    const now = new Date()
    const pad = (num: number) => String(num).padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

// ========== 数据存取、分页与请求 ==========
// 从 localStorage 中读取英雄数据
const loadHeroes = () => {
    const data = localStorage.getItem(HERO_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

// 保存英雄数据：同步到 allHeroes 和 localStorage
const saveHeroes = (heroes: HeroItem[]) => {
    allHeroes.value = heroes;
    localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(heroes));
}

// 根据 allHeroes、currentPage、pageSize 计算总条数和当前页表格数据
const applyTablePage = () => {
    total.value = allHeroes.value.length;
    const maxPage = Math.max(1, Math.ceil(total.value / pageSize.value));
    if (currentPage.value > maxPage) {
        currentPage.value = maxPage;
    }
    const start = (currentPage.value - 1) * pageSize.value;
    tableData.value = allHeroes.value.slice(start, start + pageSize.value);
}

// 请求静态 hero.json，并保存到本地后刷新表格
const fetchHeroes = () => {
    loading.value = true;
    http.get('static/hero.json', { name: 'dennyy666' }).then((res: any) => {
        saveHeroes(res || []);
        applyTablePage();
        loading.value = false;
    })
}

// 页码变化时更新当前页并刷新表格
const handlePageChange = (page: number) => {
    currentPage.value = page;
    applyTablePage();
}

// ========== 新增/编辑表单操作 ==========


// 点击新增英雄：重置表单、清空编辑 ID、打开弹窗
const addHero = () => {
    resetForm()
    editingId.value = null
    dialogFormVisible.value = true;
}

// 重置表单字段
const resetForm = () => {
    form.name = ''
    form.mobile = ''
    form.role = ''
    form.position = ''
    form.status = ''
    form.remark = ''
}

// 打开编辑弹窗，并回填当前行数据
const openEditDialog = (row: HeroItem) => {
    isEditMode.value = true
    editingId.value = row.id
    form.name = row.name
    form.mobile = row.mobile
    form.role = row.role
    form.position = row.position
    form.status = row.status
    form.remark = row.remark
    dialogFormVisible.value = true
}

// 提交表单：校验通过后执行新增或编辑，并保存、刷新表格
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            const { role, position } = form
            const roleItem: any = roleType.find((item) => String(item.value) == role)
            const positionItem: any = positionType.find((item) => String(item.value) == position)
            if (isEditMode.value && editingId.value !== null) {
                // 编辑模式：根据 ID 找到原英雄并更新
                const index = allHeroes.value.findIndex((hero) => hero.id === editingId.value)
                if (index === -1) {
                    // 找不到，防御性处理
                    return
                }
                const currentHero = allHeroes.value[index]!
                allHeroes.value[index] = {
                    ...currentHero,
                    ...form,
                    roleName: roleItem.label,
                    positionName: positionItem.label,
                }
                ElMessage.success('编辑成功')
            } else {
                // 新增模式：生成新 ID，追加到全部英雄数据中
                const nextId = allHeroes.value.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
                allHeroes.value.push({
                    ...form,
                    id: nextId,
                    roleName: roleItem.label,
                    positionName: positionItem.label,
                    createTime: formatNow(),
                })
                ElMessage.success('新增成功')
            }
            saveHeroes(allHeroes.value);
            applyTablePage();
            dialogFormVisible.value = false
        } else {
            console.log('error submit!')
        }
    })
}

// ========== 删除与选择操作 =========

// 表格勾选变化时，更新 idSet
const handleSelectionChange = (val: any[]) => {
    idSet.value = new Set(val.map(row => String(row.id)))
}

// 删除单个英雄
const deleteHero = (id: number, name: string) => {
    ElMessageBox.confirm(
        `是否确认删除英雄${name}?`,
        'Warning',
        {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
        }
    )
        .then(() => {
            const heroes = allHeroes.value.filter(item => item.id != id);
            saveHeroes(heroes);
            ElMessage.success('删除成功')
            applyTablePage();
        })
        .catch(() => {

        })
}

// 批量删除选中的英雄
const batchDelete = () => {
    if (idSet.value.size == 0) {
        ElMessage.warning('请选择要删除的英雄');
        return
    }

    ElMessageBox.confirm(
        `是否确认进行批量删除?`,
        'Warning',
        {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
        }
    )
        .then(() => {
            const heroes = allHeroes.value.filter(item => !idSet.value.has(String(item.id)));
            saveHeroes(heroes);
            applyTablePage();
            ElMessage.success('批量删除成功')
        })
        .catch(() => {

        })

}

// ========== 生命周期 ==========
// 组件挂载后初始化：优先读取本地数据，没有则请求静态数据
onMounted(() => {
    let localHeroes = loadHeroes()
    if (localHeroes.length > 0) {
        allHeroes.value = localHeroes;
        applyTablePage()
    } else {
        fetchHeroes()
    }

})
</script>


<style scoped lang="less">
.table-card {
    border: none;
    box-shadow: none;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
    }
}

.pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
}




/* 表单整体：固定内容宽度 + 居中，label 和控件天然对齐 */
.hero-form {
    width: 340px;
    /* 80 (label) + 260 (控件) */
    max-width: 100%;
    margin: 0 auto;
    /* 关键：在弹窗里水平居中 */
    padding: 4px 0;

    :deep(.el-form-item) {
        margin-bottom: 18px;
    }

    :deep(.el-form-item__label) {
        font-size: 14px;
        font-weight: 500;
        color: #606266;
    }


    /* 控件撑满 content 区，content 区 = 340 - 80 = 260px*/
    :deep(.el-input),
    :deep(.el-select) {
        width: 100%;
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}
</style>