<template>
  <div>
    <div style="margin-bottom:20px;">
      <span style="color: #f56c6c;">*</span
      ><span>商品展示图：(最多上传9张图片)</span>
    </div>
    <div style="display:flex;">
      <div class="upload-imgs">
        <div class="add">
          <form id="formUpload" enctype="multipart/form-data">
            <input
              @change="inputChange($event)"
              type="file"
              name="upload-images"
              accept="image/*"
              class="inputUpload"
              multiple
            />
            <i class="el-icon-plus addIcon"></i>
          </form>
        </div>
        <div class="previewImg" id="previewImg1"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgurls: [],
      loading: null
    };
  },
  methods: {
    // 上传图片
    inputChange(e) {
      console.log("图片");
      console.log(e);
      let file = e.target.files;
      let that = this;
      let check = file[0];
      console.log(check);
      if (check == undefined) {
        return;
      } else {
        if (file.length > 9) {
          this.$message.error({
            message: "最多上传9张图片，请重新选择",
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
          for (let item of file) {
            if (item.size / 1024 > 2050) {
              // 文件大于2M，进行压缩上传
              this.photoCompress(
                item,
                {
                  // 调用压缩图片方法
                  quality: 0.7
                },
                function(base64Codes) {
                  // console.log("压缩后：" + base.length / 1024 + " " + base);
                  let bl = that.base64UrlToBlob(base64Codes);
                  // file.append('file', bl, 'file_' + Date.parse(new Date()) + '.jpg') // 文件对象
                  that.uploadLice(bl); // 请求图片上传接口
                }
              );
            } else {
              // 小于等于2M 原图上传
              this.uploadLice(item);
            }
          }
        }
      }
    },
    // base64 转 Blob 格式 和file格式
    base64UrlToBlob(urlData) {
      let arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
        bstr = new Buffer.from(arr[1], "base64").toString("binary"), // 处理异常,将ascii码小于0的转换为大于0
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // 转blob
      // return new Blob([u8arr], {type: mime})
      let filename = Date.parse(new Date()) + ".jpg";
      // 转file
      return new File([u8arr], filename, {
        type: mime
      });
    },
    photoCompress(file, obj, callback) {
      let that = this;
      let ready = new FileReader();
      /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
      ready.readAsDataURL(file);
      ready.onload = function() {
        let re = this.result;
        that.canvasDataURL(re, obj, callback); // 开始压缩
      };
    },
    canvasDataURL(path, obj, callback) {
      let img = new Image();
      img.src = path;
      img.onload = function() {
        let that = this; // 指到img
        // 默认按比例压缩
        let w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        let quality = 0.7; // 默认图片质量为0.7
        // 生成canvas
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        // 创建属性节点
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        // 铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(that, 0, 0, w, h);

        // 图像质量
        if (obj.quality && obj.quality >= 1 && obj.quality < 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        let base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    //  返回file文件，调用接口执行上传
    uploadLice(file) {
      console.log(file);
      let formdata1 = new FormData(); //创建form对象
      formdata1.append("upload-images", file); //通过append向form对象添加数据
      this.uploadImg(formdata1);
    },
    uploadImg(formdata) {
      // console.log(this.formData);
      formdata.append("state", 0);
      formdata.append("type", 0);
      let arr;
      if (this.$store.state.imgUrl !== "") {
        arr = this.$store.state.imgUrl.match(/[|]/g);
      } else {
        arr = [];
      }
      console.log(arr);
      if (arr.length > 8) {
        this.$message.error({
          message: "最多上传9张图片",
          showClose: true,
          duration: 2000
        });
      } else {
        this.$axios
          .post(this.$store.state.baseUrl + "/upload", formdata)
          .then(res => {
            if (res.status == 200) {
              this.$message.success({
                message: "图片上传成功",
                showClose: true,
                duration: 2000
              });
            }
            console.log(res);
            this.imgurls = res.data.split("|").filter(el => {
              return el != "";
            });
            console.log(this.imgurls);
            let preview1 = document.getElementById("previewImg1");
            console.log(this.$store.state.imgUrl);
            for (let i = 0; i < this.imgurls.length - 1; i++) {
              console.log(
                this.$store.state.baseUrl + "/file/" + this.imgurls[i]
              );
              this.$store.state.imgUrl +=
                this.$store.state.baseUrl + "/file/" + this.imgurls[i] + "|";
              let preview = document.createElement("div");
              preview.style.position = "relative";
              preview.className = "previewImg2";
              let span = document.createElement("span");
              span.innerHTML = "x";
              span.className = "spanStyle";
              let img = document.createElement("img");
              img.width = 100;
              img.height = 100;
              img.style.objectFit = "cover";
              img.style.borderRadius = "5px";
              img.style.marginLeft = "10px";
              img.style.zIndex = 1;
              img.src = this.$store.state.baseUrl + "/file/" + this.imgurls[i];
              preview.appendChild(span);
              preview.appendChild(img);
              preview1.appendChild(preview);
              span.onclick = e => {
                let b = e.currentTarget.nextElementSibling.src + "|";
                console.log("------" + b);
                console.log(this.$store.state.imgUrl);
                let a = this.$store.state.imgUrl.replace(b, "");
                this.$store.state.imgUrl = a;
                console.log("333333" + this.$store.state.imgUrl);
                preview1.removeChild(e.currentTarget.parentElement);
              };
              console.log("444444" + this.$store.state.imgUrl);
            }
            this.loading.close();
            console.log(this.$store.state.imgUrl);
          })
          .catch(err => {
            this.loading.close();
            console.log(err);
            this.$message.error({
              message: err.data.status,
              showClose: true,
              duration: 2000
            });
          });
      }
    }
  }
};
</script>
<style lang="scss">
.upload-imgs {
  width: 100%;
  margin-bottom: 10px;
  position: relative;
  display: flex;

  .add {
    width: 100px;
    height: 100px;
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
