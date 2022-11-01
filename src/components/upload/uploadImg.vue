<template>
  <div class="upload-imgs">
    <div class="add">
      <form enctype="multipart/form-data" style="width:100px;height:100px;">
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
    <div
      v-for="(item, index) of imgSrcs"
      :key="index"
      style="margin: 0 10px 10px 0;position:relative;"
    >
      <span class="spanStyle" @click="delImage2(item, index)">x</span>
      <img
        :src="baseUrl + '/file/' + item"
        width="100px"
        height="100px"
        style="border-radius:5px;object-fit:cover;"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: this.$store.state.baseUrl,
      imgSrcs: []
    };
  },
  methods: {
    // 1、获取input上传file文件，inputChange
    // 2、大于2M压缩，否则直接上传
    // 压缩过程
    // 1、读取文件，photoCompress2
    // 2、利用canvas数据化图片进行压缩，图片转base64，canvasDataURL2
    // 3、图片base64 转Blob格式/file格式，base64UrlToBlob2
    // 4、上传图片，uploadLice2
    // 多张图片上传
    inputChange(e) {
      let file = e.target.files;

      if (file[0] == undefined) {
        return;
      } else {
        this.loading = this.$loading({
          lock: true,
          text: "图片上传中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.5)"
        });

        for (let item of file) {
          console.log(item);
          // 文件大于2M，进行压缩上传
          if (item.size / 1024 > 2050) {
            this.photoCompress2(
              item,
              {
                // 调用压缩图片方法
                quality: 0.7
              },
              base64Codes => {
                let bl = this.base64UrlToBlob2(base64Codes);
                this.uploadLice2(bl); // 请求图片上传接口
              }
            );
          } else {
            // 小于等于2M 原图上传
            this.uploadLice2(item);
          }
        }
      }
    },
    /*压缩图片
      读取文件
      file：文件(类型是图片格式)，
      obj：文件压缩后对象width， height， quality(0-1)
      callback：容器或者回调函数
      */
    photoCompress2(file, obj, callback) {
      let ready = new FileReader(); //实例化reader，读取文件内容
      ready.readAsDataURL(file); // 把目标文件转地址
      ready.onload = event => {
        // 文件读取成功
        let res = event.target.result;
        this.canvasDataURL2(res, obj, callback); // 开始压缩
      };
    },
    /* 利用canvas数据化图片进行压缩 */
    /* 图片转base64 */
    canvasDataURL2(path, obj, callback) {
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

        // 创建节点属性
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
        // 返回值是一个数据url，是base64组成的图片的源数据、可以直接赋值给图片的src属性
        let base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    // base64 转Blob格式/file格式
    base64UrlToBlob2(urlData) {
      console.log("转Blob格式/file格式", urlData);

      let arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
        bstr = new Buffer.from(arr[1], "base64").toString("binary"), // 处理异常,将ascii码小于0的转换为大于0
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      console.log("u8arr数据", u8arr);

      // 转blob
      // return new Blob([u8arr], {type: mime})

      // 转file
      let filename = Date.parse(new Date()) + ".jpg";
      /* [u8arr] 文件的內容  filename 文件的文件名/文件路徑  { type: mime } 配置對象 */
      return new File([u8arr], filename, {
        type: mime
      });
    },
    // 返回file文件，调用接口执行上传
    uploadLice2(file) {
      console.log("圖片file", file);
      let formdata = new FormData(); //创建form对象
      formdata.append("upload-images", file); //通过append向form对象添加数据
      this.$axios
        .post(this.baseUrl + "/upload", formdata)
        .then(res => {
          if (res.status == 200) {
            this.$message.success({
              message: "图片上传成功",
              showClose: true,
              duration: 2000
            });
          }
          console.log(res);
          this.loading.close();
          this.imgSrcs.push(
            res.data.split("|").filter(el => {
              return el != "";
            })[0]
          );
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
    },
    // 刪除圖片
    delImage2(item, index) {
      console.log(item, index);
      this.imgSrcs.splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-imgs {
  width: 100%;
  margin-bottom: 10px;
  // position: relative;
  display: flex;
  flex-wrap: wrap;

  .add {
    width: 100px;
    height: 100px;
    margin-right: 10px;
    position: relative;
    // display: flex;

    .addIcon {
      width: 50px;
      height: 50px;
      position: absolute;
      top: 44.5%;
      left: 44%;
      z-index: 1;
    }

    .inputUpload {
      width: 100px;
      height: 100px;
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      opacity: 0;
      cursor: pointer;
      z-index: 999;
    }
  }

  .spanStyle {
    width: 15px;
    height: 15px;
    position: absolute;
    top: 1px;
    right: 1px;
    text-align: center;
    line-height: 0.8;
    background-color: rgb(221, 221, 221);
    color: rgb(255, 255, 255);
    border: 1px solid rgb(221, 221, 221);
    border-radius: 50%;
    z-index: 9;
    cursor: pointer;
  }
}
</style>
