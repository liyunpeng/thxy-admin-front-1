<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 课程设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message">
                <el-tab-pane :label="`课程管理(${state.unread.length})`" name="first"> 
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
        <el-table-column prop="title" label="课程名"></el-table-column>
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
                <el-tab-pane :label="`课程类型(${state.read.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="state.read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template #default="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template #default="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`回收站(${state.recycle.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="state.recycle" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template #default="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template #default="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { fetchData } from "../api/index";
import { getAllCourseType, findCourseByTypeId } from "../api/index";

export default {
    name: "Curriculum",
    data() {
       return {
         tableData: [],
         options:[]
       }
    },

    mounted() {    
        getAllCourseType().then((res) => {
            // debugger;
            this.options = res;
            // console.log(res);
    });
  }, 
  methods: {
      handleChange( val ) {
          console.log("val:" + val)
        findCourseByTypeId({id: parseInt(val)}).then((res) => {
        //   debugger;
          // this.selectedItem = res;

          this.tableData = res;
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

