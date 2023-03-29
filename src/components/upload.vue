<template>
  <div>
    <div style="margin-bottom:20px;">
      <div v-if="imgNum === 9"> <span style="color: #f56c6c;">*</span><span>商品展示图：(最多上传9张图片)</span></div>
      <div v-else>
        <span style="color: #f56c6c;">*</span><span>内部图：(最多上传30张图片)</span>
        <span style="cursor: pointer;color: #409EFF;font-size:15px;" @click="showImgSel">查看图片</span>
      </div>
    </div>
    <div style="display:flex;" v-if="imgIsShow">
      <div class="upload-imgs">
        <div class="add">
          <form id="formUpload" enctype="multipart/form-data">
            <input @change="inputChange($event)" type="file" name="upload-images" accept="image/*" class="inputUpload"
              multiple />
            <i class="el-icon-plus addIcon"></i>
          </form>
        </div>

        <div v-for="(item, index) in imgurls" :key="item" style="display: flex; margin-right: 10px">
          <div style="position: relative;cursor: pointer;">
            <span class="spanStyle" @click="delImage(index)">x</span>
            <img :src="item" style="width: 100px;height: 100px;border-radius: 5px;object-fit: cover;cursor: pointer;" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import uploadImg from "../utils/uploadImgs";

export default {
  data() {
    return {
      baseUrl: '',
      imgurls: [],
      loading: null,
      imgIsShow: true
    };
  },
  props: {
    imgs: {
      type: [Array, String],
    },
    imgNum: { type: Number },
    isAdd: { type: Boolean }
  },
  watch: {
    imgs: {
      handler: function (newVal) {
        console.log("上传图片组件");

        if (newVal) {
          if (newVal.indexOf("|") === -1) {
            this.imgurls = newVal;
          } else {
            this.imgurls = newVal.split("|").filter(item => {
              return item && item.trim()
            });
          }
        } else {
          this.imgurls = []
        }
        console.log(this.imgurls);
      },
      immediate: true,
    },
  },
  created() {
    this.baseUrl = this.$store.state.baseUrl;
    if (this.isAdd) {
      this.imgIsShow = true
    } else {
      if (this.imgNum === 30) {
        this.imgIsShow = false
      } else {
        this.imgIsShow = true
      }
    }
  },
  methods: {
    // 是否显示内部图片
    showImgSel() {
      if (this.imgIsShow) {
        this.imgIsShow = false;
      } else {
        this.imgIsShow = true;
      }
    },
    // 上传图片
    async inputChange(e) {
      console.log("图片");
      console.log(e);
      let file = e.target.files;

      if (file.length > this.imgNum) {
        this.$message.error({
          message: `最多上传${this.imgNum}张图片，请重新选择`,
          showClose: true,
          duration: 2000
        });
      } else {
        this.loading = this.$loading({
          lock: true,
          text: "图片上传中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.5)"
        });

        for (let i = 0; i < file.length;) {
          if (this.imgurls.length === this.imgNum || this.imgurls.length > this.imgNum) {
            this.$message.error({
              message: `最多上传${this.imgNum}张图片`,
              showClose: true,
              duration: 2000
            });
            this.loading.close();
            return
          } else {
            await uploadImg
              .handleAdd_quill_editor(file[i])
              .then((res) => {
                console.log(res);

                let pathUrl = res;
                this.imgurls.push(pathUrl)

                this.loading.close();

                i++
              })
              .catch((err) => {
                console.log(err);
                this.loading.close();
              });
          }
        }

        this.$emit('uploadImgsRes', this.imgurls)
      }
    },

    // 删除图片
    delImage(index) {
      this.imgurls.splice(index, 1);
      this.$emit('uploadImgsRes', this.imgurls)
    },
  }
};
</script>
<style lang="scss">
.upload-imgs {
  width: 100%;
  margin-bottom: 10px;
  position: relative;
  display: flex;
  flex-wrap: wrap;

  .add {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    position: relative;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: flex;

    .addIcon {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 45%;
      left: 45%;
      z-index: 1;
    }

    .inputUpload {
      position: absolute;
      display: block;
      width: 100px;
      height: 100px;
      opacity: 0;
      cursor: pointer;
      z-index: 999;
    }
  }

  .previewImg {
    display: flex;
    flex-wrap: wrap;
    z-index: 1;
  }
}

.previewImg2 {
  display: flex;
}

.spanStyle {
  width: 15px;
  height: 15px;
  text-align: center;
  line-height: 0.7;
  background-color: rgb(221, 221, 221);
  color: rgb(255, 255, 255);
  border: 1px solid rgb(221, 221, 221);
  border-radius: 50%;
  position: absolute;
  top: 1px;
  right: 1px;
  z-index: 999;
  cursor: pointer;
}
</style>
