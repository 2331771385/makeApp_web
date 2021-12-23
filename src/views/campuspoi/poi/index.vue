<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="查询条件" prop="poiuuid">
        <el-select
          v-model="queryParams.campusid"
          filterable
          class="header-search-select"
        >
          <el-option v-for="option in campusList" :key="option.id" :value="option.id" :label="option.value" />
        </el-select>
        <!-- <el-input
          v-model="queryParams.poiuuid"
          placeholder="请输入"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
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

    <el-table v-loading="loading" :data="poiList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" width="55" prop="poiid" />
      <el-table-column label="名称" min-width="150" align="center" prop="poiname" />
      <el-table-column label="校区" min-width="120" align="center" prop="campusid">
        <template slot-scope="scope">
          [{{scope.row.campusid}}]{{scope.row.campusname}}
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="poitype" />
      <!-- <el-table-column label="简介" show-overflow-tooltip='true' align="center" prop="shortdescribe" /> -->
      <el-table-column label="详情" show-overflow-tooltip='true' align="center" prop="detaildescribe" />
      <el-table-column label="图片" show-overflow-tooltip='true'align="center" prop="picurls" />
      
      <el-table-column label="创建时间" align="center" show-overflow-tooltip='true' prop="createTime" width="80">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" show-overflow-tooltip='true' prop="updateTime" width="80">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <font v-if="scope.row.state==0" style="color:green">正常</font>
          <font v-else style="color:red">停用</font>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['campuspoi:poi:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['campuspoi:poi:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改位置信息管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="位置点名称" prop="poiname">
          <el-input v-model="form.poiname" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="所在校区" prop="campusid">
          <el-select
            v-model="form.campusid"
            filterable
            class="header-search-select"
          >
            <el-option v-for="option in campusList" :key="option.id" :value="option.id" :label="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="图片" prop="picurls">
          <el-input v-model="form.picurls" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="官网url" prop="weburl">
          <el-input v-model="form.weburl" placeholder="请输入官网地址" />
        </el-form-item>
        <el-form-item label="简介" prop="shortdescribe">
          <el-input v-model="form.shortdescribe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="详情" prop="detaildescribe">
          <el-input v-model="form.detaildescribe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPoi, getPoi, delPoi, addPoi, updatePoi } from "@/api/campuspoi/poi";
import { listCampus } from "@/api/campus/campus";

export default {
  name: "Poi",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 位置信息管理表格数据
      poiList: [],
      // 校区信息管理列表
      campusList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        campusid: '中心校区',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getCampusList()
    
  },
  methods: {
    getCampusList() {
      this.loading = true;
      listCampus({
        pageNum: 1,
        pageSize: 10
      }).then(response => {
        response.rows.forEach(item => {
          this.campusList.push({
            id: item.campusid,
            value: item.campusname
          })
        })
        this.getList();
      }).catch(err => {
        this.$message.error('获取数据失败!');
      });
    },

    /** 查询位置信息管理列表 */
    getList() {
      this.loading = true;
      listPoi(this.queryParams).then(response => {
        response.rows.forEach(item => {
          this.campusList.forEach(element => {
            if (element.id == item.campusid) {
              item.campusname = element.value;
            }
          })
        })
        this.poiList = response.rows;
        console.log(this.poiList);
        this.total = response.total;
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        this.$message.error('获取数据失败!');
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        poiid: null,
        poiuuid: null,
        poiname: null,
        poitype: null,
        poisubtype: null,
        isforfreshman: null,
        ishotspot: null,
        campusid: null,
        objectid: null,
        longitude: null,
        latitude: null,
        height: null,
        cameraview: null,
        coverpicurl: null,
        picurls: null,
        pic720url: null,
        pic720defaultlng: null,
        pic720defaultlat: null,
        videourl: null,
        weburl: null,
        shortdescribe: null,
        detaildescribe: null,
        data: null,
        pindata: null,
        createTime: null,
        updateTime: null,
        state: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.poiid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加位置信息管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const poiid = row.poiid || this.ids
      getPoi(poiid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改位置信息管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.poiid != null) {
            updatePoi(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPoi(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const poiids = row.poiid || this.ids;
      this.$modal.confirm('是否确认删除位置信息管理编号为"' + poiids + '"的数据项？').then(function() {
        return delPoi(poiids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
  }
};
</script>
