<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 文件管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- <div class="block">
        <el-cascader expand-trigger="hover" v-model="value" :options="options" @change="handleChange">
        </el-cascader>
      </div> -->
      <!-- <div class="handle-box">
                <el-select v-model="query.address" placeholder="课程类型" class="handle-select mr10">
                    <el-option key="1" label="讲经" value="讲经"></el-option>
                    <el-option key="2" label="随笔" value="随笔"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div> -->

      <div class="block">
      <span class="demonstration">选择课程:</span>
      <el-cascader
        style="margin: 20px"
        expand-trigger="hover"
        v-model="value"
        :options="options"
        @change="handleChange"
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
        <el-table-column prop="number" width="55" label="序号"></el-table-column>
        <el-table-column prop="mp3_file_name" label="文件名"></el-table-column>
        <!-- <el-table-column prop="name" label="文件格式"></el-table-column> -->
        <el-table-column prop="duration" label="时长"></el-table-column>
        <el-table-column prop="gmt_create" label="上传时间"></el-table-column>

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
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageIndex"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
// import { fetchData } from "../api/index";
import { getAllCourseIds } from "../api/index";
import { getCourseFileByCourseId } from "../api/index";
export default {
  name: "basetable",
    data() {
       return {
         tableData: [],
         options:[]
       }
    },
    mounted() {
    getAllCourseIds().then((res) => {
        this.options = res;
        // console.log(res);
    });
  },
  methods: {
      handleChange() {
        getCourseFileByCourseId({id: 1}).then((res) => {
          // debugger;
          // this.selectedItem = res;

          this.tableData = res;
          // console.log(res);
          // tableData.value = res.list;
          // pageTotal.value = res.pageTotal || 50;
        });
      }
  },
  setup() {
    const query = reactive({
      address: "",
      name: "",
      pageIndex: 1,
      pageSize: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    // 获取表格数据
    // const getData = () => {
    //   fetchData(query).then((res) => {
    //     tableData.value = res.list;
    //     pageTotal.value = res.pageTotal || 50;
    //   });
    // };


    //   getCourseFileByCourseId(1).then((res) => {
    //     tableData.name=res.list;
    //     // this.selectedItem = res;
    //     // this.options = res;
    //     // console.log(res);
    //     // tableData.value = res.list;
    //     // pageTotal.value = res.pageTotal || 50;
    //     });
    // };
    getData();

    // 查询操作
    const handleSearch = () => {
      query.pageIndex = 1;
      getData();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          ElMessage.success("删除成功");
          tableData.value.splice(index, 1);
        })
        .catch(() => {});
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      name: "",
      address: "",
    });
    let idx = -1;
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      editVisible.value = true;
    };
    const saveEdit = () => {
      editVisible.value = false;
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      Object.keys(form).forEach((item) => {
        tableData.value[idx][item] = form[item];
      });
    };

    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      handleDelete,
      handleEdit,
      saveEdit,
    };
  },
}
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
