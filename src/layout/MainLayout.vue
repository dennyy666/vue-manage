<template>
    <div class="pags-contain">
        <aside class="sidebar">
            <Sidebar />
        </aside>

        <div class="content-box">
            <Breadcrumb />
            <TagsView />
        </div>
    </div>

</template>
<script setup lang="ts">
import Sidebar from '@/layout/components/Sidebar.vue'
import Breadcrumb from '@/layout/components/Breadcrumb.vue'
import TagsView from './components/TagsView.vue';
</script>
<style scoped lang="less">
.pags-contain {
    height: 100vh;
    display: flex;
    background-color: #eeeeee;

    .sidebar {
        width: 220px;
        flex-shrink: 0;
        background-color: #001529;
        overflow-y: hidden;
    }

    .content-box {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
    }
}
</style>