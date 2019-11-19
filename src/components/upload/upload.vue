<template>
  <div>
    <div style="margin-bottom:20px;"><span>最多上传9张图片</span></div>
    <div style="display:flex;">
      <div class="upload-imgs">
        <div class="add">
          <form id="formUpload" enctype="multipart/form-data">
            <input @change="inputChange($event)" type="file" name="upload-images" accept='image/*' class="inputUpload" multiple />
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
        let formdata = new FormData(formUpload);
        console.log(file);
        let imgFiles = file.target.files;
        console.log(imgFiles);
        formdata.append('upload-images', imgFiles);
        console.log('---' + formdata.get('upload-imgs'));
        for (let i = 0; i < imgFiles.length; i++) {
          let filePath = imgFiles[i].name;
          let fileFormat = filePath.split('.')[1].toLowerCase();
          if (!fileFormat.match(/png|jpg|jpeg/)) {
            alert('上传错误，文件格式必须为：png/jpg/jpeg');
            return
          };
        }
        this.uploadImg(formdata);
      },
      uploadImg(formdata) {
        // console.log(this.formData);
        formdata.append('state', 0);
        formdata.append('type', 0);
        this.$axios.post(this.$store.state.baseUrl + '/upload', formdata).then((res) => {
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
            console.log('http://192.168.0.104:8080/stock/file/' + this.imgurls[i]);
            this.$store.state.imgUrl += 'http://192.168.0.104:8080/stock/file/' + this.imgurls[i] + '|';
            let preview = document.createElement('div');
            preview.style.position = 'relative';
            preview.className = 'previewImg2';
            let span = document.createElement('span');
            span.innerHTML = 'x';
            span.className = 'spanStyle';
            let img = document.createElement("img");
            img.width = 150;
            img.height = 150;
            img.style.objectFit = 'cover';
            img.style.borderRadius = '5px';
            img.style.marginLeft = '10px';
            img.style.zIndex = 1;
            img.src = 'http://192.168.0.104:8080/stock/file/' + this.imgurls[i];
            preview.appendChild(span);
            preview.appendChild(img);
            preview1.appendChild(preview);
            span.onclick = (e) => {
              let b = e.currentTarget.nextElementSibling.src + "|";
              console.log('------' + b);
              console.log(this.$store.state.imgUrl);
              let a = this.$store.state.imgUrl.replace(b,"");
              this.$store.state.imgUrl = a;
              console.log('333333' + this.$store.state.imgUrl);
              preview1.removeChild(e.currentTarget.parentElement);
            }
            console.log('444444'+this.$store.state.imgUrl);
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
        z-index: 1;
      }

      .inputUpload {
        position: absolute;
        display: block;
        width: 150px;
        height: 150px;
        opacity: 0;
        cursor: pointer;
        z-index: 999;
      }
    }

    .previewImg {
      display: flex;
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
