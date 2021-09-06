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
      
    <el-table
        :data="tableData"
        border
        class="table"
        ref="multipleTable"
        header-cell-class-name="table-header"
      >
        <!-- <el-table-column
          prop="id"
          label="ID"
          width="55"
          align="center"
        ></el-table-column> -->
        <el-table-column prop="id" width="55" label="id"></el-table-column>
        <!-- <el-table-column prop="title" label="课程名"/> -->
        <el-table-column prop="title"  label="课程名">
                

        </el-table-column>
        <!-- </el-table-column> -->


        <!-- </el-table-column> -->
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

         <el-table :data="tableDataT" class="tb-edit" style="width: 100%" highlight-current-row @row-click="handleCurrentChange">
            <el-table-column label="日期" width="180">
                <template #default="scope">
                    <el-input size="small"  v-model="scope.row.date" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> 
                </template>
            </el-table-column>
           <el-table-column label="姓名" width="180">
                <template #default="scope">
                    <el-input size="small" v-model="scope.row.name" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> 
                </template>
            </el-table-column>
            <el-table-column prop="address" label="地址">
                <template #default="scope">
                    <el-input size="small" v-model="scope.row.address" placeholder="请输入内容" @change="handleEdit(scope.$index, scope.row)"></el-input> 
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    
            tableDataT: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
        
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
      handleCurrentChange(row, event, column) {
                console.log(row, event, column, event.currentTarget)
        },
            handleEdit(index, row) {
                console.log(index, row);
            },
            handleDelete(index, row) {
                console.log(index, row);
            },

      handleChange( val ) {
          console.log("val:" + val)
        findCourseByTypeId({id: parseInt(val)}).then((res) => {
        //   debugger;
          // this.selectedItem = res;

          this.tableData = res;


          this.tableData.push({"title":"aa", "img_src":"cc"});
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

