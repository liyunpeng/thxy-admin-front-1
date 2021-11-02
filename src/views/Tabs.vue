<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-copy"></i> tab选项卡</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message">
        <el-tab-pane :label="`手机端log(${state.unread.length})`" name="first">
          <el-table
              :data="tableData"
              border
              class="table"
              ref="multipleTable"
              header-cell-class-name="table-header"
              v-if="showList"
          >
            <!-- <el-table-column
              prop="id"
              label="ID"
              width="55"
              align="center"
            ></el-table-column> -->
            <!--            FileName      string `json:"file_name"`      // log文件名-->
            <!--            AppVersion    string `json:"app_version"`    //  软件版本-->
            <!--            SystemVersion string `json:"system_version"` // 手机系统版本号-->
            <!--            Brand         string `json:"brand"`          // 手机厂商-->
            <!--            ModelVersion  string `json:"model_version"`  // 手机型号-->
            <el-table-column prop="file_name" label="文件名"></el-table-column>
            <el-table-column prop="app_version" label="软件版本"></el-table-column>
            <el-table-column prop="system_version" label="手机系统版本号"></el-table-column>
            <el-table-column prop="brand" label="手机厂商"></el-table-column>
            <el-table-column prop="model_version" label="手机型号"></el-table-column>

            <el-table-column label="操作" width="180" align="center">
              <template #default="scope">
                <el-button
                    type="text"
                    icon="el-icon-edit"
                    @click="viewDetail(scope.$index, scope.row)"

                >查看
                </el-button>
                <el-button
                    type="text"
                    icon="el-icon-delete"
                    class="red"
                    @click="handleDelete(scope.$index, scope.row)"
                >删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>

          <div>
            <div>
              <el-button type="primary" @click="switch1">返回</el-button>
            </div>
<!--            <div>-->
<!--              <span class="span-caaaaa" v-if="!showList">{{ data1 }}</span>-->
<!--            </div>-->

            <div class="text-wrapper" v-if="!showList" >{{data1}}</div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`已读消息(${state.read.length})`" name="second">
          <template v-if="message === 'second'">
            <el-table :data="state.read" :show-header="false" style="width: 100%">
              <el-table-column>
                <template #default="scope">
                  <span class="message-title">{{ scope.row.title }}</span>
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
                  <span class="message-title">{{ scope.row.title }}</span>
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


  <!--  <bonus-detail v-else :record='selectedRecord' @back='showList=true' />-->
</template>

<script>
import {ref, reactive} from "vue";
import {getLogList, getLogFile} from "../api";

export default {
  name: "tabs",
  data() {
    return {
      showList: true,
      tableData: [],
      data1: ""
      // options: []
    }
  },

  mounted() {
    getLogList().then((res) => {
      // debugger;
      this.tableData = res.data;
      // console.log(res);
    });
  },

  methods: {

    // const handleEdit = (index, row) => {
    //   idx = index;
    //   Object.keys(form).forEach((item) => {
    //     form[item] = row[item];
    //   });
    //   editVisible.value = true;
    // };
    viewDetail(index, row) {
      // this.showList = false;
      // debugger

      // getLogFile( "?file_name"+ row.file_name);
      getLogFile({file_name: row.file_name}).then((res) => {
        this.showList = false;
        // this.typeData = res;
        this.data1 = res;
      });
    },
    switch1() {
      this.showList = true;
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

.span-caaaaa {
  max-width: 100%;
  display: inline-block;
  overflow-wrap: break-word;    /*  css3属性，当内容超过指定容器的边界时是否断行  */
  text-align: left;
}

.handle-row {
  margin-top: 30px;
}

.text-wrapper {
  white-space: pre-wrap;
}
</style>

