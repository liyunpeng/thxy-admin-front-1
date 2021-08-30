<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-calendar"></i> 表单
        </el-breadcrumb-item>
        <el-breadcrumb-item>上传文件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="block">
      <span class="demonstration">选择文件上传到那个课程:</span>
      <el-cascader
        style="margin: 20px"
        expand-trigger="hover"
        v-model="value"
        :options="options"
        @change="handleChange"
      >
      </el-cascader>
    </div>
    <div class="container">
      <!-- <div class="plugins-tips">
                Element UI自带上传组件。
                访问地址：
                <a href="http://element.eleme.io/#/zh-CN/component/upload" target="_blank">Element UI Upload</a>
            </div> 
            // accept=".pdf" // 限制文件格式 
            -->
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

      <!-- <div class="content-title">支持裁剪</div>
      <div class="plugins-tips">
        vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。 访问地址：
        <a href="https://github.com/Agontuk/vue-cropperjs" target="_blank"
          >vue-cropperjs</a
        >
      </div> -->
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import defaultSrc from "../assets/img/img.jpg";
import { getAllCourseIds } from "../api/index";
export default {
  name: "upload",
  components: {
    VueCropper,
  },
  data() {
    return {
    audioDuration: '100',  //时长
      courseId: 1,
      　pdfData: { 'courseId' : 1 },
      selectedItem: -1, 
      value: [],
      options: [
        {
          value: 1,  // value 为id
          label: "讲经",
          children: [
            {
              value: 1,
              label: "大般涅槃经"
            },
            {
              value: "2",
              label: "华严经"
            },
          ],
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局",
                },
              ],
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框",
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框",
                },
              ],
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格",
                },
                {
                  value: "tag",
                  label: "Tag 标签",
                },
              ],
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告",
                },
              ],
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单",
                },
              ],
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框",
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示",
                },
              ],
            },
          ],
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components",
            },
          ],
        },
      ],
    };
  },
  methods: {

// beforeAvatarUpload(file) {
		
// 	},

	  getTimes(file) {  //获取时长
	    var content = file;
      const sleep = (timeout) => {
        return new Promise((resolve)=>{
          setTimeout(()=>{
            resolve();
          }, timeout)
        });
      };

	    var url = URL.createObjectURL(content);
	    //经测试，发现audio也可获取视频的时长
	    var audioElement = new Audio(url);
	    audioElement.addEventListener("loadedmetadata", (_event) => {
	        this.audioDuration = parseInt(audioElement.duration);
	        console.log("in" + this.audioDuration);
	    });

      audioElement.onloadedmetadata = () => {
      this.audioDuration = parseInt(audioElement.duration); //时长为秒，取整
      console.log("in11111111 :" + this.audioDuration);
	};
  // const main = async()=>{
      //   await sleep(2000);
      //   console.log("222222 out" + this.audioDuration);
      // // };

      // // main();
      // // await sleep(2000);
      console.log("22222 out" + this.audioDuration);
      //  await sleep(1000);
      // console.log("out" + this.audioDuration);
	},

    handleBefore(file) {
      this.getTimes(file); //
      // debugger
      // this.pdfData.courseId = 1;
      // this.courseId = 5;
    }, 
    handleChange(value) {
    //   debugger
    this.courseId = value[value.length-1];

    this.selectedItem = value[value.length-1];

      console.log("i=", value[value.length-1]);
    //   console.log(value);
    },
  },
  mounted() {
    // debugger
    getAllCourseIds().then((res) => {
        // this.selectedItem = res;
        this.options = res;
        console.log(res);
        // tableData.value = res.list;
        // pageTotal.value = res.pageTotal || 50;
    });
  }, 
  setup() {
    const imgSrc = ref("");
    const cropImg = ref(defaultSrc);
    const dialogVisible = ref(false);
    const cropper = ref(null);

    const setImage = (e) => {
    const file = e.target.files[0];
      if (!file.type.includes("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        dialogVisible.value = true;
        imgSrc.value = event.target.result;
        cropper.value && cropper.value.replace(event.target.result);
      };
      reader.readAsDataURL(file);
    };

    const cropImage = () => {
      cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
    };

    const cancelCrop = () => {
      dialogVisible.value = false;
      cropImg.value = defaultSrc;
    };

    return {
      cropper,
      imgSrc,
      cropImg,
      dialogVisible,
      setImage,
      cropImage,
      cancelCrop,
    };
  },
};
</script>

<style scoped>
.content-title {
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}

.pre-img {
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 5px;
}
.crop-demo {
  display: flex;
  align-items: flex-end;
}
.crop-demo-btn {
  position: relative;
  width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  margin-left: 30px;
  background-color: #409eff;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;
  box-sizing: border-box;
}
.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>