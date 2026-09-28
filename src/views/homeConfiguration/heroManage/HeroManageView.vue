<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
    </el-table>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { http } from "@/utils/request";
let tableData = ref([])
const getList = () => {
    console.log('aaa')
    http.get('static/hero.json', { name: 'dennyy666' }).then((res: any) => {
        console.log('response', res)
        tableData.value = res
    }).catch(error => {

    })
}
onMounted(() => {
    getList()
    // console.log('组件已挂载')
    // let heroData = localStorage.getItem('hero_data')
    // if (!heroData) {
    //     getList();
    // } else {
    //     tableData = JSON.parse(heroData)
    // }
})
</script>


<style scoped lang="less"></style>