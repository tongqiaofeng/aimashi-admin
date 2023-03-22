import axios from "axios";
import store from "../vuex/store";

const UploadImg = {
  // 上传图片
  handleAdd_quill_editor(val) {
    let file = val;

    let that = this;
    if (file === undefined) {
      return;
    }
    let base_request_url = store.state.baseUrl;

    return new Promise((resolved, rejected) => {
      if (file.size / 1024 > 1025) {
        that.photoCompress(
          file,
          {
            quality: 0.7
          },
          base64Codes => {
            let arr = base64Codes.split(","),
              mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
              bstr = atob(arr[1]), // 处理异常,将ascii码小于0的转换为大于0
              // bstr = new Buffer.from(arr[1], "base64").toString("binary"),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }

            let filename = Date.parse(new Date()) + ".jpg";
            // 转file
            let bl = new File([u8arr], filename, {
              type: mime
            });

            let formdata = new FormData(); //创建form对象

            formdata.append("upload-images", bl); //通过append向form对象添加数据
            formdata.append("state", 0);
            formdata.append("type", 0);

            axios
              .post(base_request_url + "/upload", formdata)
              .then(res => {
                console.log("封装上传图片函数结果", res);
                let pathUrl =
                  base_request_url + "/file/" + res.data.split("|")[0];
                resolved(pathUrl);
              })
              .catch(err => {
                console.log(err);
                rejected(err);
              });
          }
        );
      } else {
        // 小于等于1M 原图上传
        let formdata = new FormData(); //创建form对象
        formdata.append("upload-images", file); //通过append向form对象添加数据
        formdata.append("state", 0);
        formdata.append("type", 0);

        axios
          .post(base_request_url + "/upload", formdata)
          .then(res => {
            console.log("封装上传图片函数结果", res);
            let pathUrl = base_request_url + "/file/" + res.data.split("|")[0];
            resolved(pathUrl);
          })
          .catch(err => {
            console.log(err);
            rejected(err);
          });
      }
    });
  },
  /*压缩图片
    file：文件(类型是图片格式)，
    obj：文件压缩后对象width， height， quality(0-1)
    callback：容器或者回调函数
    */
  photoCompress(file, obj, callback) {
    let ready = new FileReader();
    /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
    ready.readAsDataURL(file);
    ready.onload = event => {
      let path = event.target.result;

      // 开始压缩
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
    };
  }
};
export default UploadImg;
