<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="查询条件" prop="campusId">
        <el-select
          v-model="queryParams.campusId"
          filterable
          @change='getPoiList'
          class="header-search-select"
        >
          <el-option v-for="option in campusList" :key="option.id" :value="option.id" :label="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="msgDes">
        <el-select
            v-model="queryParams.parentId"
            filterable
            class="header-search-select"
          >
            <el-option v-for="option in poiList" :key="option.poiid" :value="option.poiid" :label="option.poiname" />
          </el-select>
        <!-- <el-input
          v-model="queryParams.msgDes"
          placeholder="位置点关键词"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        /> -->
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
          v-hasPermi="['TbTalkContent:content:add']"
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
          v-hasPermi="['TbTalkContent:content:edit']"
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
          v-hasPermi="['TbTalkContent:content:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" v-loading="loading" :data="contentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" min-width="85" align="center" prop="id" />
      <el-table-column label="位置点名称" min-width="120" align="center" prop="poiId">
        <template slot-scope="scope">
          [{{scope.row.poiId}}]{{scope.row.poiName}}
        </template>
      </el-table-column>
      <el-table-column label="校区" align="center" prop="campusId">
        <template slot-scope="scope">
          [{{scope.row.campusId}}]{{scope.row.campusname}}
        </template>
      </el-table-column>
      <el-table-column label="留言内容" min-width="150" :show-overflow-tooltip="true" align="center" prop="msgDes" />
      <el-table-column label="微信头像" align="center" prop="msgImg">
        <template slot-scope="scope">
          <img style="width:32px;height:32px" :src="scope.row.msgImg">
        </template>
      </el-table-column>
      <el-table-column label="昵称" min-width="100" :show-overflow-tooltip="true" align="center" prop="msgName" />
      <el-table-column label="创建时间" align="center" :show-overflow-tooltip="true" prop="msgTimer" min-width="80">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.msgTimer, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['TbTalkContent:content:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['TbTalkContent:content:remove']"
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

    <!-- 添加或修改建筑论坛对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="400px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="校区" prop="campusId">
          <el-select
            v-model="form.campusId"
            filterable
            class="header-search-select"
            @change='getPoiList'
          >
            <el-option v-for="option in campusList" :key="option.id" :value="option.id" :label="option.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="位置点" prop="poiId">
          <el-select
            v-model="form.poiId"
            filterable
            @change="getParentList"
            class="header-search-select"
          >
            <el-option v-for="option in poiList" :key="option.poiid" :value="option.poiid" :label="option.poiname" />
          </el-select>
        </el-form-item>

        <el-form-item label="评论内容" prop="msgDes">
          <el-input v-model="form.msgDes" placeholder="请输入评论内容" />
        </el-form-item>
        <el-form-item label="微信头像" prop="msgImg">
          <el-upload 
            ref="picurls" 
            :on-success="uploadSuccess"
            :file-list="fileList" 
            :action="fileAction"
            :before-upload="field101BeforeUpload">
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
          <!-- <el-input v-model="form.msgImg" placeholder="请输入${comment}" /> -->
        </el-form-item>
        <el-form-item label="昵称" prop="msgName">
          <el-input v-model="form.msgName" placeholder="请输入微信昵称" />
        </el-form-item>
        <el-form-item label="所属父类">
          <el-select
            v-model="form.parentId"
            filterable
            class="header-search-select"
          >
            <el-option v-for="option in parentList" :key="option.id" :value="option.id" :label="'['+option.id+']'+option.poiName" />
          </el-select>
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
import { listContent, getContent, delContent, addContent, updateContent } from "@/api/TbTalkContent/content";
import { listCampus } from "@/api/campus/campus";
import { listPoi } from "@/api/campuspoi/poi";

export default {
  name: "Content",
  data() {
    return {
      fileAction: '/dev-api/common/upload',
      fileList: [],
      // 遮罩层
      loading: true,
      parentList: [],
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
      // 建筑论坛表格数据
      contentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        campusId: 1,
        msgDes: null,
        msgImg: null,
        msgName: null,
        msgTimer: null,
        parentId: 312,
        poiId: null,
      },
      // 表单参数
      form: {},
      campusList: [], // 获取校区数据
      // 表单校验
      rules: {
        poiId: [
          { required: true, message: "位置点名称不能为空", trigger: "blur" }
        ],
        campusId: [
          { required: true, message: "校区名称不能为空", trigger: "blur" }
        ],
      },
      poiList: []
    };
  },
  created() {
    this.getCampusList();
    this.getPoiList(); // 获取所有的位置点
  },
  methods: {
     uploadSuccess(res) {
      this.imgUrl = res.fileName;
      this.form.msgImg = res.url;
    },
    field101BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      return isRightSize
    },
    // 获取所有的位置点信息
    getPoiList() {
      listPoi({
        campusid: this.form.campusId || this.queryParams.campusId
      }).then(response => {
        this.poiList = response.rows;
      }).catch(err => {
        this.$message.error('获取数据失败!');
      });
    },
    getCampusList() {
      listCampus({
        pageNum: 1,
        pageSize: 10
      }).then(response => {
        response.rows.forEach(item => {
          this.campusList.push({
            id: item.campusid,
            value: item.campusname
          });
        })
        this.getList();
      }).catch(err => {
        this.$message.error('获取数据失败!');
      });
    },

    // 得到选中位置点的所有父类
    getParentList() {
      listContent({
        campusId: this.form.campusId,
        parentId: this.form.poiId,
      }).then(res => {
        this.parentList = res.rows;
      })
    },
    /** 查询建筑论坛列表 */
    getList() {
      this.loading = true;
      this.contentList = [];
      listContent(this.queryParams).then(response => {
        this.contentList = response.rows;
        for(let i = 0; i < this.contentList.length; i++) {
          for(let j = 0; j < this.campusList.length; j++) {
            if (this.campusList[j].id == this.contentList[i].campusId) {
              this.contentList[i].campusname = this.campusList[j].value;
              if (this.contentList[i].children) {
                this.contentList[i].children.forEach(item => {
                  item.campusname = this.campusList[j].value;
                  item.poiName = this.contentList[i].poiName
                })
              }
              break;
            }
          }
        }
        this.total = this.contentList.length;
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
        id: null,
        campusId: null,
        msgDes: null,
        msgImg: null,
        msgName: null,
        msgTimer: null,
        parentId: null,
        poiId: null,
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加留言信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getContent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改留言信息";
      });
      this.getParentList();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.parentId = this.form.parentId || this.form.poiId
          if (this.form.id != null) {
            updateContent(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addContent(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除论坛编号为"' + ids + '"的数据项？').then(function() {
        return delContent(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>