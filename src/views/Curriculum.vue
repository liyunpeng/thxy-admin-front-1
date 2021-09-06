<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 课程设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="`课程管理`" name="first">
          <div class="block">
            <span class="demonstration">选择课程类型:</span>
            <el-cascader
                style="margin: 20px"
                expand-trigger="hover"
                v-model="value"
                :options="options"
                @change="handleChange(value)"
            >
            </el-cascader>
          </div>

          <el-table :data="tableData" border   style="width: 100%" highlight-current-row
                    @row-click="handleCurrentChange">
            <el-table-column label="id">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.id" placeholder="请输入内容"/>
                <span v-else>{{ scope.row.id }}</span>
              </template>
            </el-table-column>
            <el-table-column label="课程名">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.title" placeholder="课程名"/>
                <span v-else>{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="图片">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.img_src" placeholder="图片"/>
                <span v-else>{{ scope.row.img_src }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.gmt_create" placeholder="创建时间"/>
                <span v-else>{{ scope.row.gmt_create }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="pwdChange(scope.row, scope.$index,  true)">
                  {{ scope.row.isSet ? '保存' : "修改" }}
                </el-button>
                <el-button type="text" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
                <el-button type="text" @click="handleCancel(scope.row, scope.$index)">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="el-table-add-row" @click="handleAdd()">
            <span> 添加课程</span>
          </div>
          <el-row>
            <el-upload
                webki
                webkitdirectory="true"
                class="upload-demo"
                :before-upload="handleBefore"
                drag
                action="http://localhost:8082/api/multiUpload"
                multiple
                :data="{courseId: courseId, duration: audioDuration}"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">请上传文件的tip</div>
              </template>
            </el-upload>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="`课程类型`" name="second">
          <el-table
              :data="typeData"
              border
              class="table"
              ref="multipleTable"
              header-cell-class-name="table-header"
          >
            <el-table-column width="55" label="id">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.id" placeholder="id"/>
                <span v-else>{{ scope.row.id }}</span>
              </template>

            </el-table-column>
            <el-table-column  label="类型名">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.name" placeholder="请输入内容"/>
                <span v-else>{{ scope.row.name }}</span>
              </template>

            </el-table-column>

            <el-table-column  label="创建时间">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.gmt_create" placeholder="请输入内容"/>
                <span v-else>{{ scope.row.gmt_create }}</span>
              </template>

            </el-table-column>

            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="pwdChange(scope.row, scope.$index,  true)">
                  {{ scope.row.isSet ? '保存' : "修改" }}
                </el-button>
                <el-button type="text" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
                <el-button type="text" @click="handleCancel(scope.row, scope.$index)">取消</el-button>
              </template>
            </el-table-column>

          </el-table>
          <div class="el-table-add-row" @click="handleAddType()">
            <span> 添加类型</span>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>


<script>

import {ref, reactive} from "vue";
import {getAllCourseType, getCourseTypes, findCourseByTypeId} from "../api/index";

export default {
  name: "Curriculum",
  data() {
    return {
      members: [],
      name: "",
      optionSelected: 0,
      tableData: [],
      options: [],
      typeData: []
    }
  },

  mounted() {
    getAllCourseType().then((res) => {
      this.options = res;
    });
    getCourseTypes().then((res) => {
      this.typeData = res;
    });
  },

  methods: {
    pwdChange(row, index, cg) {
      // debugger;
      for (const i of this.tableData) {
        if (i.isSet && i.id != row.id) return this.$message.warning('请先保存当前编辑项')
      }

      // //点击修改 判断是否已经保存所有操作
      // for (let i of app.master_user.data) {
      //     if (i.isSet && i.id != row.id) {
      //         app.$message.warning("请先保存当前编辑项");
      //         return false;
      //     }
      // }
      //是否是取消操作
      if (!cg) {
        if (!app.master_user.sel.id) app.master_user.data.splice(index, 1);
        return row.isSet = !row.isSet;
      }
      //提交数据
      if (row.isSet) {
        //项目是模拟请求操作  自己修改下
        (function () {
          // let data = JSON.parse(JSON.stringify(app.master_user.sel));
          // for (let k in data) row[k] = data[k];
          // app.$message({
          //     type: 'success',
          //     message: "保存成功!"
          // });
          // //然后这边重新读取表格数据
          // app.readMasterUser();
          row.isSet = false;
        })();
      } else {
        // app.master_user.sel = JSON.parse(JSON.stringify(row));
        row.isSet = true;
        row.edit = true;

      }
    },

    handleCurrentChange(row, event, column) {
      console.log(row, event, column, event.currentTarget)
    },

    handleCancel(row, index) {
      row.edit = false;
      row.isSet = false;
      // 刷新数据， 已经编辑的不会显示到刷新后的列表
      findCourseByTypeId({id: this.optionSelected}).then((res) => {
        this.tableData = res;
      });
    },

    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteConfig(row.id)
        this.data.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 添加
    handleAdd() {
      for (const i of this.tableData) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }

      const j = {'id': '', 'title': '', 'img_src': '', 'gmt_create': '', 'isSet': true, 'edit': true}
      this.tableData.push(j)
    },

    handleAddType() {
      for (const i of this.typeData) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }

      const j = {'id': '', 'name': '', 'gmt_create': '', 'isSet': true, 'edit': true}
      this.typeData.push(j)
    },
    handleChange(val) {
      console.log("val:" + val)
      this.optionSelected = parseInt(val);
      findCourseByTypeId({id: this.optionSelected}).then((res) => {
        this.tableData = res;
      });
    }
  },
  setup() {
    // const message = ref("first");
    // // const handleRead = (index) => {
    // //   const item = state.unread.splice(index, 1);
    // //   console.log(item);
    // //   state.read = item.concat(state.read);
    // // };
    // // const handleDel = (index) => {
    // //   const item = state.read.splice(index, 1);
    // //   state.recycle = item.concat(state.recycle);
    // // };
    // // const handleRestore = (index) => {
    // //   const item = state.recycle.splice(index, 1);
    // //   state.read = item.concat(state.read);
    // // };
    //
    // return {
    //   message,
    //   // state,
    //   // handleRead,
    //   // handleDel,
    //   // handleRestore,
    // };
  },
};
</script>

<style>
.el-table-add-row{
  border: 1px dashed #0f6ab4;
  width: 100%;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
  margin-top: 5px;
}

.message-title {
  cursor: pointer;
}

.handle-row {
  margin-top: 30px;
}
</style>

