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
  <el-row>
    <el-card>
      <el-row class="text-right m-b">
        <el-button type="primary" @click="handleAdd()">
          添加行
        </el-button>
        <el-button type="danger" plain @click="batchRemove">
          删除行
        </el-button>
        <el-button type="primary" @click="handleInsert">
          插入行
        </el-button>
        <el-button type="primary" @click="handleMove(1)">
          上移
        </el-button>
        <el-button type="primary" @click="handleMove(0)">
          下移
        </el-button>
        <el-button type="primary" @click="handleTopOrBottom(1)">
          置顶
        </el-button>
        <el-button type="primary" @click="handleTopOrBottom(0)">
          置底
        </el-button>
        <el-button type="primary" @click="clearList">
          清空
        </el-button>
      </el-row>

        <el-form ref="form2" :model="submitData" :rules="rules" label-width="150px">
        <el-row :span="24"> 
          <el-table
            ref="studentTable"
            :data="submitData.studentTableData"
            style="width: 100%"
            highlight-current-row
            stripe
            border
            :row-class-name="tableRowClassName"
            @current-change="currentChange"
            @selection-change="clickLogCheckboxHandler"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
            />
            <el-table-column
              prop="studentCode"
              label="学号"
            >
              <template slot-scope="scope">
                <el-form-item :prop="'studentTableData.'+scope.$index+'.studentCode'" :rules="rules.studentTableDataRules.studentCode" label-width="0">
                  <el-input v-if="scope.row.showFormDom" v-model="scope.row.studentCode"/>
                  <div v-else>
                    {{ scope.row.studentCode }}
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="studentName"
              label="学生姓名"
            >
              <template slot-scope="scope">
                <el-form-item :prop="'studentTableData.'+scope.$index+'.studentName'" :rules="rules.studentTableDataRules.studentName" label-width="0">
                  <el-input v-if="scope.row.showFormDom" v-model="scope.row.studentName"/>
                  <div v-else>
                    {{ scope.row.studentName }}
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="studentAge"
              label="学生年龄"
            >
              <template slot-scope="scope">
                <el-form-item :prop="'studentTableData.'+scope.$index+'.studentAge'" :rules="rules.studentTableDataRules.studentAge" label-width="0">
                  <el-input v-if="scope.row.showFormDom" v-model="scope.row.studentAge"/>
                  <div v-else>
                    {{ scope.row.studentAge }}
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="studentSex"
              label="学生性别"
            >
              <template slot-scope="scope">
                <el-form-item :prop="'studentTableData.'+scope.$index+'.studentSex'" :rules="rules.studentTableDataRules.studentSex" label-width="0">
                  <el-input v-if="scope.row.showFormDom" v-model="scope.row.studentSex"/>
                  <div v-else>
                        {{ scope.row.studentSex }}
                    </div>
                    </el-form-item>
                </template>
                </el-table-column>
            </el-table>
            </el-row>
            <el-row class="text-center m-t">
            <el-button type="primary" @click="submitHandler">
                保存
            </el-button>
            </el-row>
        </el-form>
        </el-card>
    </el-row>


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
export default {
    name: "Curriculum",
    data() {
    return {
	  // 选中的行
      selected: null,
      rowIndex: 0,
      set:[],
      // 提交数据
      submitData: {
        studentTableData: []
      },
	  // 校验信息
      rules: {
        studentTableDataRules: {
          studentName: [
            { required: true, message: '请输入学生姓名', trigger: 'blur' }
          ],
          studentCode: [
            { required: true, message: '请输入学号', trigger: 'blur' }
          ],
          studentAge: [
            { required: true, message: '请输入学生年龄', trigger: 'blur' }
          ],
          studentSex: [
            { required: true, message: '请输入学生性别', trigger: 'blur' }
          ]
        }
      },
	  // 多选情况下多选数据存储
      selecteds: []
    }
  },

  methods: {
    clickLogCheckboxHandler(selection) {
        this.selecteds = selection
    }, 
    tableRowClassName({ row, rowIndex }) {
      row.row_index = rowIndex
    },
    handleAdd() {
      const list = {
        studentCode: '',
        studentName: '',
        studentAge: '',
        studentSex: '',
        showFormDom: true
      }
      this.$refs['form2'].validate((valid) => {
        if (valid) {
        //   if (this.selected !== null) {
        //     const index = this.selected.row_index
        //     this.$set(this.submitData.studentTableData[index], 'showFormDom', false)
        //   }
          this.submitData.studentTableData.push(list)
          this.selected = list
          this.selected.row_index = this.submitData.studentTableData.length - 1
          this.$refs.studentTable.setCurrentRow(this.submitData.studentTableData[this.selected.row_index])
        } else {
          // 此处为验证失败代码
          this.$message.warning('请先为当前行填值！')
        }
      })
    },
    batchRemove() {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          if (this.selected !== null) {
            this.submitData.studentTableData.splice(this.selected.row_index, 1)
            this.selected = null
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '请选择要删除的行！',
              type: 'warning'
            })
          }
        })
        .catch(() => {})
    },
    handleInsert() {
      if (this.selected !== null) {
        const list = {
          studentCode: '',
          studentName: '',
          studentAge: '',
          studentSex: '',
          showFormDom: true
        }
        if (this.submitData.studentTableData.length > 0) {
          this.$refs['form2'].validate((valid) => {
            if (valid) {
              const index = this.selected.row_index
              this.$set(this.submitData.studentTableData[index], 'showFormDom', false)
              this.submitData.studentTableData.splice(index, 0, list)
              this.selected = list
              this.selected.row_index = index
              this.$refs.studentTable.setCurrentRow(this.submitData.studentTableData[index])
            } else {
              // 此处为验证失败代码
              this.$message.warning('请先为当前行填值！')
            }
          })
        } else {
          this.submitData.studentTableData.push(list)
          this.selected = list
          this.selected.row_index = 0
          this.$refs.studentTable.setCurrentRow(this.submitData.studentTableData[0])
        }
      } else {
        this.$message.warning('请选择插入位置！')
      }
    },
    handleMove(dir) {
      if (this.selected !== null) {
        const moveComm = (curIndex, nextIndex) => {
          const arr = this.submitData.studentTableData
          arr[curIndex] = arr.splice(nextIndex, 1, arr[curIndex])[0]
          return arr
        }
        this.submitData.studentTableData.some((val, index) => {
          if (val.studentCode === this.selected.studentCode) {
            if (dir === 1 && index === 0) {
              this.$message.warning('已在顶部！')
            } else if (dir === 0 && index === this.submitData.studentTableData.length - 1) {
              this.$message.warning('已在底部！')
            } else {
              const nextIndex = dir === 1 ? index - 1 : index + 1
              this.submitData.studentTableData = moveComm(index, nextIndex)
            }
            return true
          }
          return false
        })
      } else {
        this.$message.warning('请选择操作的行！')
      }
    },
    handleTopOrBottom(dir) {
      if (this.selected !== null) {
        const moveComm = (curIndex, nextIndex) => {
          const arr = this.submitData.studentTableData
          arr[curIndex] = arr.splice(nextIndex, 1, arr[curIndex])[0]
          return arr
        }
        this.submitData.studentTableData.some((val, index) => {
          if (val.studentCode === this.selected.studentCode) {
            if (dir === 1 && index === 0) {
              this.$message.warning('已在顶部！')
            } else if (dir === 0 && index === this.submitData.studentTableData.length - 1) {
              this.$message.warning('已在底部！')
            } else {
              const nextIndex = dir === 1 ? 0 : this.submitData.studentTableData.length - 1
              this.submitData.studentTableData = moveComm(index, nextIndex)
            }
            return true
          }
          return false
        })
      } else {
        this.$message.warning('请选择操作的行！')
      }
    },
    clearList() {
      this.$confirm('确认执行清空操作吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.submitData.studentTableData = []
          this.selected = null
          this.$message({
            message: '清空完成！',
            type: 'success'
          })
        })
    },
    currentChange(newRow, oldRow) {
      if (this.selected !== null) {
        if (newRow.row_index !== this.selected.row_index) {
          this.$refs['form2'].validate((valid) => {
            if (valid) {
              const index = this.selected.row_index
              this.$set(this.submitData.studentTableData[newRow.row_index], 'showFormDom', true)
              this.$set(this.submitData.studentTableData[index], 'showFormDom', false)
              this.selected = newRow
            } else {
              // 此处为验证失败代码
              this.$refs.studentTable.setCurrentRow(this.submitData.studentTableData[this.selected.row_index])
              // this.$message.warning('请先为当前行填值！')
            }
          })
        }
      } else {
        this.$set(this.submitData.studentTableData[newRow.row_index], 'showFormDom', true)
        this.selected = newRow
      }
    },
    submitHandler() {
      this.$refs['form2'].validate((valid) => {
        if (valid) {
          this.$message({
            showClose: true,
            message: '请完善列表中的数据!',
            type: 'warning'
          })
        } else {
          this.$message({
            showClose: true,
            message: '请完善列表中的数据!',
            type: 'warning'
          })
        }
      })
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

