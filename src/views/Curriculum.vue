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

          <el-table :data="tableData"
                    border
                    style="width: 100%"
                    highlight-current-row
                    @row-click="handleCurrentChange">
            <el-table-column label="id">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.id" placeholder="请输入内容"/>
                <span v-else>{{ scope.row.id }}</span>
              </template>
            </el-table-column>

            <el-table-column label="图片">
              <!--              <template #default="scope">-->
              <!--                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.img_src" placeholder="图片"/>-->
              <!--                <span v-else>{{ scope.row.img_src }}</span>-->
              <template #default="scope">
                <el-image style="width: 50px; height: 50px"
                          :src="scope.row.img_url"></el-image>
              </template>
              <!--              </template>-->
            </el-table-column>
            <el-table-column label="课程名">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.title" placeholder="课程名"/>
                <span v-else>{{ scope.row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column label="简介">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.introduction" placeholder="课程简介"/>
                <span v-else>{{ scope.row.introduction }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.gmt_create" placeholder="创建时间"/>
                <span v-else>{{ myformatdate(scope.row.gmt_create) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
<!--                <el-button type="text" @click="handleEdit(scope.row, scope.$index,  true, this.tableData)">-->
                <el-button type="text" @click="handleEditDialog(scope.row, scope.$index,  true, this.tableData)">
                  {{ scope.row.isSet ? '保存' : "修改" }}
                </el-button>
                <el-button type="text" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
                <el-button type="text" @click="handleCancel(scope.row, scope.$index)">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--          <div class="el-table-add-row" @click="handleAdd()">-->
          <div class="el-table-add-row" @click="popupDialog()">
            <span> 添加课程</span>
          </div>

        </el-tab-pane>
        <el-tab-pane :label="`课程类型管理`" name="second">
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
            <el-table-column label="类型名">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.name" placeholder="类型名"/>
                <span v-else>{{ scope.row.name }}</span>
              </template>

            </el-table-column>

            <el-table-column label="创建时间">
              <template #default="scope">
                <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.gmt_create" placeholder="请输入内容"/>
                <span v-else>{{ myformatdate(scope.row.gmt_create) }}</span>
              </template>

            </el-table-column>

            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="text" @click="handleEdit(scope.row, scope.$index,  true, this.typeData)">
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

    <el-dialog title="编辑课程" v-model="editVisible" width="70%">


      <el-form label-width="70px">
        <el-form-item label="课程名">
          <el-input  placeholder="请输入课程名" v-model="editForm.title"></el-input>
        </el-form-item>


        
        <el-form-item>
          <el-upload
              webki
              webkitdirectory="true"
              class="upload-demo"
              :before-upload="handleBefore"
              :action="actionUrl"
              drag
              list-type="picture"
              :file-list="fileList"
              :data="{course_title: form.name, type_id: optionSelected}"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将课程图片文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传课程图片文件</div>
          </el-upload>
        </el-form-item>


      </el-form>


      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>


    <el-dialog title="添加课程" v-model="addVisible" width="70%">
      <el-form label-width="70px">
        <el-form-item label="课程名">
          <el-input v-model="form.name" placeholder="请输入课程名"></el-input>
        </el-form-item>
        <!--        <el-form-item label="地址">-->
        <!--          <el-input v-model="form.address"></el-input>-->
        <!--        </el-form-item>-->

        <el-form-item>
          <el-upload
              webki
              webkitdirectory="true"
              class="upload-demo"
              :before-upload="handleBefore"
              drag
              :action="actionUrl"
              list-type="picture"
              :file-list="fileList"
              :data="{course_title: form.name, type_id: optionSelected}"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将课程图片文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传课程图片文件</div>
            <!--            <template #tip>-->
            <!--              <div class="el-upload__tip">请上传文件的tip</div>-->
            <!--            </template>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { BASE_API } from "../config";
import {
  getAllCourseType,
  getCourseTypes,
  findCourseByTypeId,
  addCourseType,
  updateCourseType,
  updateCourse,
  addCourse,
  deleteCourseType,
  deleteCourse
} from "../api/index";

export default {
  name: "Curriculum",
  data() {
    return {
      editForm: {
        title: "123",
        imageUrl: ""
      },
      dialogValue: " aa",
      editVisible: false,
      baseUrl: BASE_API,
      // baseUrl: 'http://47.102.146.8:8082',
      // http://localhost:8082/api/coursePictureUpload
      actionUrl: BASE_API + '/api/coursePictureUpload',
      value: "1",
      addVisible: false,
      message: "first",
      members: [],
      name: "",
      optionSelected: 0,
      tableData: [],
      options: [],
      form: {
        name: "",
      },
      typeData: [],
      fileList: []
    }
  },

  mounted() {
    getAllCourseType().then((res) => {
      this.options = res;
    });

    getCourseTypes().then((res) => {
      this.typeData = res;
    });

    this.optionSelected = 1;
    this.freshCourse();
  },

  methods: {

    handleBefore() {

    },
    saveEdit() {
      this.addVisible = false;
      this.freshCourse();
    },
    myformatdate(inputTime) {
      if (!inputTime && typeof inputTime !== 'number') {
        return '';
      }
      var localTime = '';
      inputTime = new Date(inputTime).getTime();
      const offset = (new Date()).getTimezoneOffset();
      localTime = (new Date(inputTime - offset * 60000)).toISOString();
      localTime = localTime.substr(0, localTime.lastIndexOf('.'));
      localTime = localTime.replace('T', ' ');
      return localTime;
    },

    handleEditDialog(row, index, cg, data) {
      // this.dialogValue = row.title;
      this.editForm.title = row.title;
      this.editForm.imageUrl = row.imageUrl;
      this.editVisible = true;
    },

    handleEdit(row, index, cg, data) {
      // debugger;
      for (const i of data) {
        if (i.isSet && i.id != row.id)
          return this.$prompt.warning('请先保存当前编辑项')
      }

      // 点击修改 判断是否已经保存所有操作
      for (let i of data) {
        if (i.isSet && i.id != row.id) {
          app.$prompt.warning("请先保存当前编辑项123");
          return false;
        }
      }
      //是否是取消操作
      if (!cg) {
        if (!app.master_user.sel.id) app.master_user.data.splice(index, 1);
        return row.isSet = !row.isSet;
      }

      if (row.isSet) {
        (function (mes, typeId, app) {
          // let data = JSON.parse(JSON.stringify(app.master_user.sel));
          // for (let k in data) row[k] = data[k];
          console.log("mes = ", mes, " typeId=", typeId);
          // debugger
          if (mes == "first") {
            if (row.is_add == 1) {
              addCourse({title: row.title,  introduction: row.introduction, type_id: typeId}).then((res) => {
                // debugger;
                if (res.code == 3) {
                  app.freshCourse();
                  app.freshType();
                  app.$message({
                    type: 'success',
                    message: "保存成功!"
                  });
                } else {
                  app.$message({
                    type: 'fail',
                    message: "保存失败! res=" + res
                  });
                }
              });
            } else {
              updateCourse({title: row.title, introduction: row.introduction, type_id: typeId, id: row.id}).then((res) => {
                if (res.code == 3) {
                  app.freshCourse();
                  app.freshType();
                  app.$message({
                    type: 'success',
                    message: "修改成功!"
                  });
                } else {
                  this.$message({
                    type: 'fail',
                    message: "修改失败! res=" + res
                  });
                }
              });
            }
          } else if (mes == "second") {
            // debugger;
            if (row.is_add == 1) {
              addCourseType({name: row.name}).then((res) => {
                if (res.code == 3) {
                  app.freshCourse();
                  app.freshType();
                  app.$message({
                    type: 'success',
                    message: "保存成功!"
                  });

                } else {
                  app.$message({
                    type: 'fail',
                    message: "保存失败! res=" + res
                  });
                }
              });
              // } else if ( row.is_add == 0  || "undefined" != typeof row.is_add) {
            } else {
              updateCourseType({name: row.name, id: row.id}).then((res) => {
                if (res.code == 3) {
                  app.freshCourse();
                  app.freshType();
                  ;
                  app.$message({
                    type: 'success',
                    message: "修改成功!"
                  });
                } else {
                  app.$message({
                    type: 'success',
                    message: "修改失败! res=" + res
                  });
                }
              });
            }
          }
          row.isSet = false;
          row.edit = false;
          row.is_add = 0;
        })(this.message, this.optionSelected, this);

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

    freshType() {
      getCourseTypes().then((res) => {
        this.typeData = res;
      });
    },

    freshCourse() {
      findCourseByTypeId({id: this.optionSelected}).then((res) => {
        this.tableData = [];
        for (let item of res) {
          let courseItem = {
            img_url:  this.baseUrl + "/api/fileDownload?file_type=img&file_name=" +  item.img_file_name +
                "&course_id=" + item.id,
            introduction: item.introduction,
            title: item.title,
            gmt_create: item.gmt_create,
            id: item.id,
          };
          this.tableData.push(courseItem);
        };
      });
    },

    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        (function (mes, idVal, app) {
          if (mes == "first") {
            deleteCourse({id: idVal}).then((res) => {
              app.freshCourse();
              app.freshType();
            });
          } else if (mes == "second") {
            deleteCourseType({id: idVal}).then((res) => {
              app.freshCourse();
              app.freshType();
            });
          }
          row.isSet = false;
          row.edit = false;
        })(this.message, row.id, this);
      }).catch(() => {
        app.$message({
          type: 'info',
          message: '已取消删除'
        })
      });
    },

    handleAdd() {
      for (const i of this.tableData) {
        if (i.isSet) return this.$prompt.warning('请先保存当前编辑项')
      }

      const j = {'id': '', 'title': '', 'img_src': '', 'gmt_create': '', 'isSet': true, 'edit': true, 'is_add': 1}
      this.tableData.push(j)
    },

    popupDialog() {
      this.fileList = [];
      this.addVisible = true;
    },

    handleAddType() {
      for (const i of this.typeData) {
        if (i.isSet) return this.$prompt.warning('请先保存当前编辑项')
      }

      const j = {'id': '', 'name': '', 'gmt_create': '', 'isSet': true, 'edit': true, 'is_add': 1}
      this.typeData.push(j)
    },
    handleChange(val) {
      console.log("val:" + val)
      this.optionSelected = parseInt(val);
      this.freshCourse();
    }
  },
  setup() {
    // let message = ref("first");
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
.el-table-add-row {
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

