<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="查询条件">
                <el-select
                    v-model="queryParams.campusid"
                    filterable
                    class="header-search-select"
                >
                    <el-option v-for="option in campusList" :key="option.id" :value="option.id" :label="option.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="类型">
                <el-select
                    v-model="queryParams.poisubtype"
                    filterable
                    clearable
                    class="header-search-select"
                >
                <el-option-group
                    v-for="(group, index) in parentChildren"
                    :key="index"
                    :label="group.value"
                >
                    <el-option
                        v-for="item in group.children"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                    </el-option>
                </el-option-group>
                </el-select>
            </el-form-item>
            <el-form-item prop="poiname">
                <el-input
                    v-model="queryParams.poiname"
                    placeholder="位置点关键词"
                    clearable
                    size="small"
                    @keyup.enter.native="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button
                        type="primary"
                        plain
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAdd"
                        v-hasPermi="['campuspoi:poi:add']"
                    >新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button
                        type="success"
                        plain
                        icon="el-icon-edit"
                        size="mini"
                        :disabled="single"
                        @click="handleUpdate"
                        v-hasPermi="['campuspoi:poi:edit']"
                    >修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button
                        type="danger"
                        plain
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="handleDelete"
                    v-hasPermi="['campuspoi:poi:remove']"
                    >删除</el-button>
                </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'webStatic',
    data() {
        return {
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                campusid: 1,
                poisubtype: 100
            },
            // 显示搜索条件
            showSearch: true,
        }
    },
    created() {
        
    },
    methods: {
        
    },
}
</script>
<style lang="scss" scoped>

</style>