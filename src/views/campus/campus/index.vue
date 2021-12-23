<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="查询条件" prop="createyear">
        <el-input
          v-model="queryParams.campusname"
          placeholder="请输入创建时间"
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
          v-hasPermi="['campus:campus:add']"
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
          v-hasPermi="['campus:campus:edit']"
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
          v-hasPermi="['campus:campus:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['campus:campus:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="campusList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="校区id" align="center" prop="campusid" />
      <el-table-column label="${comment}" align="center" prop="campusname" />
      <el-table-column label="${comment}" align="center" prop="campusshortname" />
      <el-table-column label="${comment}" align="center" prop="cityid" />
      <el-table-column label="${comment}" align="center" prop="cityname" />
      <el-table-column label="${comment}" align="center" prop="address" />
      <el-table-column label="${comment}" align="center" prop="sortindex" />
      <el-table-column label="图片url" align="center" prop="picurl" />
      <el-table-column label="${comment}" align="center" prop="map3durl" />
      <el-table-column label="详情" align="center" prop="describe" />
      <el-table-column label="存放children对象" align="center" prop="edgebaidu" />
      <el-table-column label="贴图左上角经度" align="center" prop="ltlongitudegaode" />
      <el-table-column label="${comment}" align="center" prop="ltlatitudegaode" />
      <el-table-column label="贴图右下角经度" align="center" prop="rblongitudegaode" />
      <el-table-column label="${comment}" align="center" prop="rblatitudegaode" />
      <el-table-column label="${comment}" align="center" prop="centerlongitudebaidu" />
      <el-table-column label="${comment}" align="center" prop="centerlatitudebaidu" />
      <el-table-column label="${comment}" align="center" prop="centerlongitudegaode" />
      <el-table-column label="${comment}" align="center" prop="centerlatitudegaode" />
      <el-table-column label="${comment}" align="center" prop="scalelevelbaidu" />
      <el-table-column label="${comment}" align="center" prop="scalelevelgaode" />
      <el-table-column label="相机坐标,隔开" align="center" prop="camerahead" />
      <el-table-column label="倾斜" align="center" prop="cameratilt" />
      <el-table-column label="创建时间" align="center" prop="createyear" />
      <el-table-column label="修改时间" align="center" prop="updatetime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatetime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="0 存在 1 删除" align="center" prop="state" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['campus:campus:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['campus:campus:remove']"
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

    <!-- 添加或修改校园信息管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="${comment}" prop="campusname">
          <el-input v-model="form.campusname" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="campusshortname">
          <el-input v-model="form.campusshortname" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="cityid">
          <el-input v-model="form.cityid" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="cityname">
          <el-input v-model="form.cityname" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="address">
          <el-input v-model="form.address" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="sortindex">
          <el-input v-model="form.sortindex" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="图片url" prop="picurl">
          <el-input v-model="form.picurl" placeholder="请输入图片url" />
        </el-form-item>
        <el-form-item label="${comment}" prop="map3durl">
          <el-input v-model="form.map3durl" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="详情" prop="describe">
          <el-input v-model="form.describe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="存放children对象" prop="edgebaidu">
          <el-input v-model="form.edgebaidu" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="贴图左上角经度" prop="ltlongitudegaode">
          <el-input v-model="form.ltlongitudegaode" placeholder="请输入贴图左上角经度" />
        </el-form-item>
        <el-form-item label="${comment}" prop="ltlatitudegaode">
          <el-input v-model="form.ltlatitudegaode" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="贴图右下角经度" prop="rblongitudegaode">
          <el-input v-model="form.rblongitudegaode" placeholder="请输入贴图右下角经度" />
        </el-form-item>
        <el-form-item label="${comment}" prop="rblatitudegaode">
          <el-input v-model="form.rblatitudegaode" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="centerlongitudebaidu">
          <el-input v-model="form.centerlongitudebaidu" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="centerlatitudebaidu">
          <el-input v-model="form.centerlatitudebaidu" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="centerlongitudegaode">
          <el-input v-model="form.centerlongitudegaode" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="centerlatitudegaode">
          <el-input v-model="form.centerlatitudegaode" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="scalelevelbaidu">
          <el-input v-model="form.scalelevelbaidu" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="scalelevelgaode">
          <el-input v-model="form.scalelevelgaode" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="相机坐标,隔开" prop="camerahead">
          <el-input v-model="form.camerahead" placeholder="请输入相机坐标,隔开" />
        </el-form-item>
        <el-form-item label="倾斜" prop="cameratilt">
          <el-input v-model="form.cameratilt" placeholder="请输入倾斜" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createyear">
          <el-input v-model="form.createyear" placeholder="请输入创建时间" />
        </el-form-item>
        <el-form-item label="0 存在 1 删除" prop="state">
          <el-input v-model="form.state" placeholder="请输入0 存在 1 删除" />
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
import { listCampus, getCampus, delCampus, addCampus, updateCampus } from "@/api/campus/campus";

export default {
  name: "Campus",
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
      // 校园信息管理表格数据
      campusList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        campusname: '',
        campusshortname: '',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询校园信息管理列表 */
    getList() {
      this.loading = true;
      listCampus(this.queryParams).then(response => {
        this.campusList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        campusid: null,
        campusname: null,
        campusshortname: null,
        cityid: null,
        cityname: null,
        address: null,
        sortindex: null,
        picurl: null,
        map3durl: null,
        describe: null,
        edgebaidu: null,
        ltlongitudegaode: null,
        ltlatitudegaode: null,
        rblongitudegaode: null,
        rblatitudegaode: null,
        centerlongitudebaidu: null,
        centerlatitudebaidu: null,
        centerlongitudegaode: null,
        centerlatitudegaode: null,
        scalelevelbaidu: null,
        scalelevelgaode: null,
        camerahead: null,
        cameratilt: null,
        createyear: null,
        updatetime: null,
        state: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.ids = selection.map(item => item.campusid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加校园信息管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const campusid = row.campusid || this.ids
      getCampus(campusid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改校园信息管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.campusid != null) {
            updateCampus(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCampus(this.form).then(response => {
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
      const campusids = row.campusid || this.ids;
      this.$modal.confirm('是否确认删除校园信息管理编号为"' + campusids + '"的数据项？').then(function() {
        return delCampus(campusids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('campus/campus/export', {
        ...this.queryParams
      }, `campus_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
