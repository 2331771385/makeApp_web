<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="查询条件" prop="campusid">
        <el-select
            v-model="queryParams.campusid"
            filterable
          >
            <el-option v-for="option in campusList" :key="option.id" :value="option.id" :label="option.value" />
          </el-select>
      </el-form-item>
      <el-form-item prop="buildid">
        <el-input
          v-model="queryParams.sourcename"
          placeholder="资源名称关键词"
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
          v-hasPermi="['TbPanoSource:panoSource:add']"
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
          v-hasPermi="['TbPanoSource:panoSource:edit']"
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
          v-hasPermi="['TbPanoSource:panoSource:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="panoSourceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" width="55" align="center" prop="sourceid" />
      <!-- <el-table-column label="资源类型" align="center" prop="typeid" /> -->
      <el-table-column label="资源名称" min-width="140" align="center" prop="sourcename" />
      <el-table-column label="校区" align="center" prop="campusid">
        <template slot-scope="scope">
          [{{scope.row.campusid}}]{{scope.row.campusname}}
        </template>
      </el-table-column>
      <el-table-column label="资源图片" align="center" prop="sourceurl">
        <template slot-scope="scope">
          <img :src="scope.row.sourceurl">
        </template>
      </el-table-column>
      <el-table-column label="大小" align="center" prop="sourcesize" />
      <el-table-column label="状态" align="center" prop="state">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            :active-value='activeVal'
            :inactive-value='inactiveVal'
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- <el-table-column label="${comment}" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="修改时间" :show-overflow-tooltip="true" align="center" prop="updateTime" width="80">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="水平高度" width="80" align="center" prop="x" />
      <el-table-column label="垂直高度" align="center" width="80" prop="y" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['TbPanoSource:panoSource:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['TbPanoSource:panoSource:remove']"
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

    <!-- 添加或修改全景图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="380px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="校区" prop="campusid">
          <el-select
            v-model="form.campusid"
            filterable
            class="header-search-select"
          >
            <el-option v-for="option in campusList" :key="option.id" :value="option.id" :label="option.value" />
          </el-select>
          <!-- <el-input v-model="form.campusid" placeholder="请输入校区" /> -->
        </el-form-item>
        <el-form-item label="资源名称" prop="sourcename">
          <el-input v-model="form.sourcename" placeholder="请输入资源名称" />
        </el-form-item>
        
        <el-form-item label="存储路径" prop="sourceurl">
          <el-upload 
            ref="picurls" 
            :on-success="uploadSuccess"
            :file-list="fileList" 
            :action="fileAction"
            :before-upload="field101BeforeUpload">
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
          <!-- <el-input v-model="form.sourceurl" placeholder="请输入存储路径" /> -->
        </el-form-item>
      
        <el-form-item label="水平高度" prop="x">
          <el-input type="number" step="0.1" v-model="form.x" />
        </el-form-item>
        <el-form-item label="垂直高度" prop="y">
          <el-input v-model="form.y" step="0.1" type="number" />
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
import { listPanoSource, getPanoSource, delPanoSource, addPanoSource, updatePanoSource } from "@/api/TbPanoSource/panoSource";
import { listCampus } from "@/api/campus/campus";

export default {
  name: "PanoSource",
  data() {
    return {
      activeVal: 0,
      inactiveVal: 2,
      fileAction: '/dev-api/common/upload',
      fileList: [],
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
      // 全景图表格数据
      panoSourceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeid: null,
        sourcename: null,
        brief: null,
        campusid: 1,
        departmentid: null,
        buildid: null,
        floor: null,
        serviceid: null,
        userid: null,
        sourceurl: null,
        thumburl: null,
        latitude: null,
        longitude: null,
        sourcesize: null,
        state: null,
        createTime: null,
        updateTime: null,
        x: null,
        y: null,
      },
      campusList: [], // 查询所有的校区数据
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        campusid: [
          { required: true, message: "校区名称不能为空", trigger: "blur" }
        ],
        sourcename: [
          { required: true, message: "校区名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCampusList(); // 查询所有的校区
  },
  methods: {
    uploadSuccess(res) {
      this.imgUrl = res.fileName;
      console.log(res);
      this.form.sourceurl = res.url;
    },
    field101BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      return isRightSize
    },
    //状态修改
    handleStatusChange(row) {
      console.log(row);
      let data = {
        sourceid: row.sourceid,
        state: row.state
      }
      let text = row.state == "0" ? "启用" : "停用";
      this.$modal.confirm('确认要' + text + '该位置点的信息吗？').then(function() {
        return updatePanoSource(data);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.state = row.state === "0" ? "2" : "0";
      });
    },
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
    /** 查询全景图列表 */
    getList() {
      this.loading = true;
      listPanoSource(this.queryParams).then(response => {
        this.panoSourceList = response.rows;
        this.panoSourceList.forEach(item => {
          item.sourceurl = '/dev-api' + item.sourceurl
        })
        for(let i = 0; i < this.panoSourceList.length; i++) {
          for(let j = 0; j < this.campusList.length; j++) {
            if (this.campusList[j].id == this.panoSourceList[i].campusid) {
              this.panoSourceList[i].campusname = this.campusList[j].value;
              break;
            }
          }
        }
        console.log(this.panoSourceList);
        this.total = response.total;
        this.loading = false;
      }).catch(err => {
        this.$message.error('获取数据失败！')
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
        sourceid: null,
        typeid: null,
        sourcename: null,
        brief: null,
        campusid: null,
        departmentid: null,
        buildid: null,
        floor: null,
        serviceid: null,
        userid: null,
        sourceurl: null,
        thumburl: null,
        latitude: null,
        longitude: null,
        sourcesize: null,
        state: null,
        createTime: null,
        updateTime: null,
        x: 0,
        y: 0,
        createBy: null,
        updateBy: null
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
      this.ids = selection.map(item => item.sourceid)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加全景图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sourceid = row.sourceid || this.ids
      getPanoSource(sourceid).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改全景图";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.sourceid != null) {
            updatePanoSource(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPanoSource(this.form).then(response => {
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
      const sourceids = row.sourceid || this.ids;
      this.$modal.confirm('是否确认删除全景图编号为"' + sourceids + '"的数据项？').then(function() {
        return delPanoSource(sourceids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
  }
};
</script>