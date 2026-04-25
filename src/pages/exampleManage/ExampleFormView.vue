<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface ExampleFormModel {
  name: string
  mobile: string
  remark: string
  gender: string
  nation: string
}

const formRef = ref<FormInstance>()
const submitSuccess = ref(false)

const initialFormModel: ExampleFormModel = {
  name: '',
  mobile: '',
  remark: '',
  gender: '',
  nation: '',
}

const formModel = reactive<ExampleFormModel>({
  ...initialFormModel,
})

const nationOptions = [
  { label: '汉族', value: 'han' },
  { label: '壮族', value: 'zhuang' },
  { label: '回族', value: 'hui' },
  { label: '满族', value: 'man' },
  { label: '苗族', value: 'miao' },
]

const formRules: FormRules<ExampleFormModel> = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 4, max: 4, message: '姓名必须为4位', trigger: 'blur' },
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '手机号必须为11位数字且首位为1', trigger: 'blur' },
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  nation: [{ required: true, message: '请选择民族', trigger: 'change' }],
}

const handleReset = () => {
  submitSuccess.value = false
  formRef.value?.resetFields()
}

const handleSubmit = async () => {
  submitSuccess.value = false
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitSuccess.value = true
  console.info('Example form submit success:', { ...formModel })
}
</script>

<template>
  <div class="example-form-page">
    <div class="form-card">
      <h3>表单验证示例</h3>
      <el-form
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        label-width="88px"
        class="example-form"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formModel.name" maxlength="4" placeholder="请输入4位姓名" clearable />
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formModel.mobile" maxlength="11" placeholder="请输入手机号" clearable />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="formModel.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注（非必填）"
          />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formModel.gender">
            <el-radio value="male">男</el-radio>
            <el-radio value="female">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="民族" prop="nation">
          <el-select v-model="formModel.nation" placeholder="请选择民族" clearable>
            <el-option
              v-for="item in nationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <div class="actions">
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSubmit">提交</el-button>
          </div>
        </el-form-item>
      </el-form>

      <p v-if="submitSuccess" class="submit-success">表单校验通过，提交成功。</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.example-form-page {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.form-card {
  width: 100%;
  max-width: 560px;
  padding: 24px 24px 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-sizing: border-box;
  background-color: #fff;

  h3 {
    margin: 0 0 20px;
    text-align: center;
    color: #303133;
    font-weight: 600;
  }
}

.example-form {
  :deep(.el-select) {
    width: 100%;
  }
}

.actions {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.submit-success {
  margin: 8px 0 0;
  text-align: center;
  color: #67c23a;
}
</style>
