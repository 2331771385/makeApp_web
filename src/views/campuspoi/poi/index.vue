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

    <el-table v-loading="loading" :data="poiList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" width="55" prop="poiid" />
      <el-table-column label="名称" :show-overflow-tooltip="true" min-width="150" align="center" prop="poiname" />
      <el-table-column label="校区" :show-overflow-tooltip="true" min-width="110" align="center" prop="campusid">
        <template slot-scope="scope">
          [{{scope.row.campusid}}]{{scope.row.campusname}}
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" min-width="110" prop="poisubtype">
        <template slot-scope="scope">
          [{{scope.row.poisubtype}}]{{bindVal}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="简介" show-overflow-tooltip='true' align="center" prop="shortdescribe" /> -->
      <el-table-column label="详情" :show-overflow-tooltip="true" align="center" prop="detaildescribe" />
      <el-table-column label="图片" :show-overflow-tooltip="true" align="center" prop="imgUrl">
        <template slot-scope="scope">
          <img style="width:32px;height:32px" :src="scope.row.imgUrl">
        </template>
      </el-table-column>
      
      <el-table-column label="修改时间" align="center" :show-overflow-tooltip="true" prop="updateTime" width="80">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="80" prop="state">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            :active-value='activeVal'
            :inactive-value='inactiveVal'
            @change="handleStatusChange(scope.row)"
          ></el-switch>
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
    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
      <el-form class="formItem" ref="form" :inline="true" :model="form" :rules="rules" label-width="100px">
        <el-form-item label-width="400" label="位置点名称:" prop="poiname">
          <el-input v-model="form.poiname" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="所在校区:" prop="campusid">
          <el-select
            v-model="form.campusid"
            filterable
          >
            <el-option v-for="option in campusList" :key="option.id" :value="option.id" :label="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="经度:" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度:" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="form.poisubtype"
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
        <el-form-item label="图片:">
          <el-upload 
            ref="picurls" 
            :on-success="uploadSuccess"
            :file-list="fileList" 
            :action="fileAction"
            :before-upload="field101BeforeUpload">
            <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="官网url:">
          <el-input v-model="form.weburl" placeholder="请输入官网地址" />
        </el-form-item>
        <el-form-item label="简介:">
          <el-input v-model="form.shortdescribe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="详情:">
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
import { listAllType } from "@/api/TbPoiType/type";


export default {
  name: "Poi",
  data() {
    return {
      formData: {
        field101: null,
      },
      // 表单验证功能
      rules: {
        poiname: [
          { required: true, message: "位置点名称不能为空", trigger: "blur" }
        ],
        campusid: [
          { required: true, message: "校区名称不能为空", trigger: "blur" }
        ],
        longitude: [
          { required: true, message: "经度不能为空", trigger: "blur" }
        ],
        latitude: [
          { required: true, message: "纬度不能为空", trigger: "blur" }
        ]
      },
      fileAction: '/dev-api/common/upload',
      fileList: [],
      typeList: [], // 位置点类型数据
      parentChildren: [
        {
          id: 1,
          value: '建筑类型',
          children: []
        },
        {
          id: 2,
          value: '单位类型',
          children: []
        },
        {
          id: 3,
          value: '景点'
        },
        {
          id: 4,
          value: '迎新'
        },
        {
          id: 5,
          value: '服务类型',
          children: []
        }
      ], // 所有的数据类型
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
      activeVal: 0,
      inactiveVal: 2,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        campusid: 1,
        poisubtype: 100
      },
      // 表单参数
      form: {},
      bindVal: '出入门',
      imgUrl: ''
    };
  },
  created() {
    this.getCampusList();
    this.getAllType();
  },
  watch: {
    'queryParams.poisubtype': function(newVal, oldVal) {
      this.parentChildren.forEach(item => {
        if (item.children) {
          item.children.forEach(element => {
            if (element.id == newVal) {
              this.bindVal = element.value
            }
          })
        }
      })
    }
  },
  methods: {
    //状态修改
    handleStatusChange(row) {
      let data = {
        poiid: row.poiid,
        state: row.state
      }
      let text = row.state == "0" ? "启用" : "停用";
      this.$modal.confirm('确认要' + text + '该位置点的信息吗？').then(function() {
        return updatePoi(data);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.state = row.state === "0" ? "2" : "0";
      });
    },
    uploadSuccess(res) {
      this.imgUrl = res.fileName;
      this.form.picurls = res.fileName
    },
    field101BeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 < 2
      if (!isRightSize) {
        this.$message.error('文件大小超过 2MB')
      }
      return isRightSize
    },
    getAllType() {
      listAllType().then(response => {
        let data = response.data;
        for(let i = 0; i < data.length; i++) {
          for(let j = 0; j < this.parentChildren.length; j++) {
            if (data[i].parenttype == this.parentChildren[j].id) {
              this.parentChildren[j].children.push({
                id: data[i].poitype,
                value: data[i].poitypename
              })
            }
          }
        };
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
        });
        this.poiList = response.rows;
        this.poiList.forEach(item => {
          let img = item.picurls.split(';')[0];
          item.imgUrl = '/dev-api' + img
        });
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
        picurls: this.imgUrl,
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
<style lang='scss'>
.formItem {
  .el-form-item {
    width: 340px !important;
  }
}

.el-dialog__header {
  background: #1890ff ;
}
.el-dialog__title {
  color: #fff;
}
.el-icon-close:before {
  color: #fff;
}
</style>
