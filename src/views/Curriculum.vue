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

        <el-table :data="tableData" class="tb-edit" style="width: 100%" highlight-current-row @row-click="handleCurrentChange">
            <el-table-column label="id" >
                <template #default="scope">
                    <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.id" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> 
                    <span v-else>{{ scope.row.id }}</span>
                </template>
            </el-table-column>
           <el-table-column label="课程名" >
                <template #default="scope">
                    <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.title" placeholder="课程名" @change="handleEdit(scope.$index, scope.row)"></el-input> 
                    <span v-else>{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column  label="图片">
                <template #default="scope">
                    <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.img_src" placeholder="图片" @change="handleEdit(scope.$index, scope.row)"></el-input> 
                    <span v-else>{{ scope.row.img_src }}</span>
                </template>
            </el-table-column>
            <el-table-column  label="创建时间">
                <template #default="scope">
                    <el-input size="small" v-if="scope.row.isSet" v-model="scope.row.gmt_create" placeholder="创建时间" @change="handleEdit(scope.$index, scope.row)"></el-input> 
                     <span v-else>{{ scope.row.gmt_create }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button  type="text"  @click="pwdChange(scope.row, scope.$index,  true)">
                        {{scope.row.isSet?'保存':"修改"}}
                        </el-button>
                    <el-button  type="text" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <el-button  type="text"  @click="handleCancel(scope.$index, scope.row)">取消</el-button>
                </template>
            </el-table-column>
        </el-table>
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
  
        <el-table-column prop="id" width="55" label="id"></el-table-column>
        <el-table-column prop="name" label="类型名"></el-table-column>
        <!-- <el-table-column prop="name" label="文件格式"></el-table-column> -->
        <el-table-column prop="img_src" label="图片"></el-table-column>
        <el-table-column prop="gmt_create" label="创建时间"></el-table-column>
        
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>

      </el-table>
                </el-tab-pane>
                
            </el-tabs>
        </div>
    </div>
</template>


<script>

import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";
import { getAllCourseType, getCourseTypes, findCourseByTypeId } from "../api/index";

export default {
    name: "Curriculum",
    data() {
       return {
           members:[],
           name:"",
         tableData: [],
         options:[],
         typeData:[]
       }
    },

    mounted() {    
        getAllCourseType().then((res) => {
            // debugger;
            this.options = res;


            // console.log(res);
    });
     getCourseTypes().then((res) => {
            // debugger;
            this.typeData = res;
            // console.log(res);
    });
  }, 
  methods: {
      //修改
                pwdChange(row, index, cg) {
                    // debugger;
                    for (const i of this.tableData) {
                      if (i.isSet && i.id != row.id ) return this.$message.warning('请先保存当前编辑项')
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
           
            handleDelete(index, row) {
                console.log(index, row);
            },


    // 编辑
    // handleEdit(index, row) {
    //   for (const i of this.tableData) {
    //     if (i.isSet) return this.$message.warning('请先保存当前编辑项')
    //   }
    //   row.edit = true
    //   row.isSet = true
    // },
    // 取消
    handleCancel(row) {
      row.edit = false;
      row.isSet = false;
    //   this.getSystemConfigList()
        findCourseByTypeId({id: 2}).then((res) => {
        //   debugger;
          // this.selectedItem = res;

          this.tableData = res;


        //   this.tableData.push({"title":"aa", "img_src":"cc"});
          // console.log(res);
          // tableData.value = res.list;
          // pageTotal.value = res.pageTotal || 50;
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
      for (const i of this.data) {
        if (i.isSet) return this.$message.warning('请先保存当前编辑项')
      }
      const j = { 'key': '', 'type': '', 'value': '', 'desc': '', 'isSet': true, 'edit': true }
      this.data.push(j)
    },
      handleChange( val ) {
        console.log("val:" + val)
        findCourseByTypeId({id: parseInt(val)}).then((res) => {
        //   debugger;
          // this.selectedItem = res;

          this.tableData = res;


        //   this.tableData.push({"title":"aa", "img_src":"cc"});
          // console.log(res);
          // tableData.value = res.list;
          // pageTotal.value = res.pageTotal || 50;
        });
      }
  },
    setup() {
        const message = ref("first");
        const state = reactive({
            unread: [
                {
                    date: "2018-04-19 20:00:00",
                    title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                },
                {
                    date: "2018-04-19 21:00:00",
                    title: "今晚12点整发大红包，先到先得",
                },
            ],
            read: [
                {
                    date: "2018-04-19 20:00:00",
                    title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                },
            ],
            recycle: [
                {
                    date: "2018-04-19 20:00:00",
                    title: "【系统通知】该系统将于今晚凌晨2点到5点进行升级维护",
                },
            ],
        });

        const handleRead = (index) => {
            const item = state.unread.splice(index, 1);
            console.log(item);
            state.read = item.concat(state.read);
        };
        const handleDel = (index) => {
            const item = state.read.splice(index, 1);
            state.recycle = item.concat(state.recycle);
        };
        const handleRestore = (index) => {
            const item = state.recycle.splice(index, 1);
            state.read = item.concat(state.read);
        };

        return {
            message,
            state,
            handleRead,
            handleDel,
            handleRestore,
        };
    },
};
</script>

<style>
.message-title {
    cursor: pointer;
}
.handle-row {
    margin-top: 30px;
}
</style>

