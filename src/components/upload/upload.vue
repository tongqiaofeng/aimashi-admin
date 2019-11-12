<template>
  <div>
    <div><span>最多上传5张图片</span></div>
    <div style="display:flex;">
      <div class="upload-imgs">
        <div class="add">
          <form id="formUpload" enctype="multipart/form-data">
            <input @change="inputChange($event)" type="file" name="upload-images" accept='image/*' id="picture"
              class="inputUpload" multiple />
            <i class="el-icon-plus addIcon"></i>
          </form>
        </div>
        <div class="previewImg" id="previewImg1"> </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formData: new FormData(),
        imgFiles: [],
        filePath: '',
        fileFormat: '',
        src: '',
        imgs: '',
        imgurls: []
      }
    },
    methods: {
      inputChange(file) {
        let formUpload = document.getElementById('formUpload');
        let formData = new FormData(formUpload);
        console.log(file);
        let imgFiles = file.target.files;
        // for (let i = 0; i < imgFiles.length; i++) {
        console.log(imgFiles);
        formData.append('upload-images', imgFiles);
        console.log('---' + formData.get('upload-imgs'));
        // let filePath = imgFiles.name;
        // let fileFormat = filePath.split('.')[1].toLowerCase();
        // if (!fileFormat.match(/png|jpg|jpeg/)) {
        //   alert('上传错误，文件格式必须为：png/jpg/jpeg');
        //   return
        // };
        this.uploadImg(formData);
        // }

      },
      uploadImg(formData) {
        // console.log(this.formData);
        formData.append('state', 0);
        formData.append('type', 0);
        this.$axios.post(this.$store.state.baseUrl + '/upload', formData).then((res) => {
          if (res.status == 200) {
            this.$message.success({
              message: '图片上传成功',
              showClose: true,
              duration: 2000
            });
          }
          console.log(res);
          this.imgurls = res.data.split("|");
          console.log(this.imgurls);
          let preview1 = document.getElementById("previewImg1");
          console.log(this.$store.state.imgUrl);
          for (let i = 0; i < this.imgurls.length - 1; i++) {
            console.log('https://hk.wistechx.cn:8081/stock/file/' + this.imgurls[i]);
            this.$store.state.imgUrl += 'https://hk.wistechx.cn:8081/stock/file/' + this.imgurls[i] + '|';
            let preview = document.createElement('div');
            preview.style.position = 'relative';
            preview.className = 'previewImg2';
            let span = document.createElement('span');
            span.innerHTML = 'x';
            span.className = 'spanStyle';
            let img = document.createElement("img");
            img.width = 150;
            img.height = 150;
            img.style.borderRadius = '5px';
            img.style.marginLeft = '10px';
            img.style.zIndex = 1;
            img.src = 'https://hk.wistechx.cn:8081/stock/file/' + this.imgurls[i];
            preview.appendChild(span);
            preview.appendChild(img);
            preview1.appendChild(preview);
            span.onclick = (e) => {
              let b = e.currentTarget.nextElementSibling.src + "|";
              console.log('------' + b);
              this.$store.state.imgUrl  = this.$store.state.imgUrl .replace(b, "");
              console.log('333333' + this.$store.state.imgUrl );
              preview1.removeChild(e.currentTarget.parentElement);
            }
            console.log(this.$store.state.imgUrl);
          }
        }).catch((err) => {
          console.log(err);
        })
      },
    }
  }

</script>
<style lang="scss">
  .upload-imgs {
    width: 100%;
    margin-bottom: 10px;
    position: relative;
    display: flex;

    .add {
      width: 150px;
      height: 150px;
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
      }

      .inputUpload {
        position: absolute;
        display: block;
        width: 150px;
        height: 150px;
        opacity: 0;
        cursor: pointer;
      }
    }

    .previewImg {
      display: flex;
      // position: relative;
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
    line-height: 1;
    background-color: rgb(221, 221, 221);
    color: rgb(255, 255, 255);
    border: 1px solid rgb(221, 221, 221);
    border-radius: 50%;
    position: absolute;
    top: 1px;
    right: 1px;
    z-index: 999;
    cursor: default;
  }

</style>
