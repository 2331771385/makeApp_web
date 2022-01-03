<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="查询条件" prop="createyear">
        <el-input
          v-model="queryParams.campusname"
          placeholder="校区名称或简称关键词"
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

    <el-table v-loading="loading" :data="campusList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" width="55" align="center" prop="campusid" />
      <el-table-column label="校区名称" min-width="125" align="center" prop="campusname" />
      <el-table-column label="校区简称" width="105" align="center" prop="campusshortname" />
      <el-table-column label="所属城市" align="center" prop="cityid">
        <template slot-scope="scope">
          [{{scope.row.cityid}}]{{scope.row.cityname}}
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="picurl">
        <font slot-scope="scope">
          <el-image style="width:32px;height:32px" :src="scope.row.picurl"></el-image>
        </font>
      </el-table-column>
      <el-table-column label="校区简介" :show-overflow-tooltip="true" align="center" min-width="120" prop="describe" />
      <el-table-column label="经纬度" align="center" min-width="130" prop="centerlongitudegaode">
        <template slot-scope="scope">
          {{scope.row.centerlongitudegaode}},{{scope.row.centerlatitudegaode}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['campus:campus:edit']"
          >修改</el-button>
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
        <el-form-item label="校区名称" prop="campusname">
          <el-input v-model="form.campusname" disabled/>
        </el-form-item>
        <el-form-item label="校区简称">
          <el-input v-model="form.campusshortname" placeholder="请输入校区简称" />
        </el-form-item>
        <el-form-item label="校区图片">
          <el-upload 
            ref="picurls" 
            :on-success="uploadSuccess"
            :file-list="fileList" 
            :action="fileAction"
            :before-upload="field101BeforeUpload">
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
          <!-- <el-input v-model="form.picurl" placeholder="请输入图片url" /> -->
        </el-form-item>
        <el-form-item label="校区描述" prop="describe">
          <el-input v-model="form.describe" type="textarea" placeholder="请输入内容" />
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
      fileAction: '/dev-api/common/upload',
      fileList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        campusname: [
          { required: true, message: "校区名称不能为空", trigger: "blur" }
        ],
        cronExpression: [
          { required: true, message: "cron执行表达式不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList(); // 获取校区列表
  },
  methods: {
    uploadSuccess(res) {
      this.imgUrl = res.fileName;
      this.form.picurl = res.fileName
    },
    field101BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      return isRightSize
    },

    /** 查询校园信息管理列表 */
    getList() {
      this.loading = true;
      listCampus(this.queryParams).then(response => {
        this.campusList = response.rows;
        this.campusList.forEach(item => {
          item.picurl = '/dev-api' + item.picurl;
        })
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
        campusid: null,
        campusname: '',
        campusshortname: '',
        picurl: '',
        describe: ''
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const campusid = row.campusid || this.ids
      getCampus(campusid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改校园信息";
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
  }
};
</script>