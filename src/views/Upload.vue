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
      <el-upload
          ref="fileUpload"
          class="upload-demo"
          :before-upload="beforeFile"
          drag
          :action="actionUpload"
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
import {ref} from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import defaultSrc from "../assets/img/img.jpg";
import {getAllCourseIds} from "../api/index";
import { BASE_API } from "../config";
export default {
  name: "upload",
  components: {
    VueCropper,
  },
  data() {
    return {
      baseUrl: BASE_API,
      actionUpload:  BASE_API + '/adminApi/multiUpload',
      audioDuration: 0 ,  //时长
      courseId: 1,
      pdfData: {'courseId': 1},
      selectedItem: -1,
      value: [],
      options: []
    };
  },
  methods: {
    beforeFile(file) {
      return  new Promise((resolve, reject) => {
        var videoElement =  document.createElement('audio');
        videoElement.addEventListener('loadedmetadata', ()=> {
          this.audioDuration = parseInt(videoElement.duration);
          console.log("audioDuration: " + this.audioDuration);
          resolve(true);
        })
        let url = URL.createObjectURL(file)
        videoElement.src = url;
      });
    },


    handleChange(value) {
      //   debugger
      this.courseId = value[value.length - 1];

      this.selectedItem = value[value.length - 1];

      console.log("i=", value[value.length - 1]);
      //   console.log(value);
    }
    ,
  },
  mounted() {
    // debugger
    getAllCourseIds().then((res) => {
      // this.selectedItem = res;
      this.options = res.data;
      console.log(res);
      // tableData.value = res.list;
      // pageTotal.value = res.pageTotal || 50;
    });

    // this.actionUpload = this.baseUrl + '/api/multiUpload';
  }
  ,
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
  }
  ,
}
;
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
