<template>
  <div class="publish-container">
    <el-form ref="form" label-width="135px">
      <div style="margin-left:3%;">
        <upload></upload>
      </div>
      <el-form-item label="入库时间" required>
        <el-col :span="11">
          <el-form-item>
            <el-date-picker type="datetime" placeholder="请选择日期时间" v-model="createTime"
              style="width: 100%;margin-left:17%;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="价格">
        <el-form-item label="价格币种" required>
          <el-select v-model="currencyId" placeholder="请选择" style="width: 50%;" clearable>
            <el-option v-for="item in currencyIds" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成本价" required>
          <el-input style="width:50%;" type="text" placeholder="请输入成本价" v-model="cost" clearable></el-input>
        </el-form-item>
        <el-form-item label="同行价" required>
          <el-input style="width:50%;" placeholder="请输入同行价" v-model="pricePeer" clearable></el-input>
        </el-form-item>
        <el-form-item label="散客价" required>
          <el-input style="width:50%;" placeholder="请输入散客价" v-model="priceIndi" clearable></el-input>
        </el-form-item>
        <el-form-item label="货源" required>
          <el-input style="width:50%;" placeholder="请输入货源" v-model="source" clearable></el-input>
        </el-form-item>
        <el-form-item label="库存地" required>
          <el-select v-model="stockLoc" placeholder="请选择" style="width: 50%;" clearable>
            <el-option v-for="item in stockLocs" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="属性" style="margin-bottom:40px;">
        <el-form-item label="包款" required>
          <el-select v-model="model" placeholder="请选择" style="width: 50%;" clearable @change="sizeSel">
            <el-option v-for="item in modelSize" :key="item.name" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="大小" required>
          <el-select v-model="size" placeholder="请选择" style="width: 50%;" clearable>
            <el-option v-for="items in sizes" :key="items" :label="items" :value="items">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材质" required>
          <el-cascader v-model="leather" :options="leathers" @change="handleChange" style="width: 50%;">
          </el-cascader>
        </el-form-item>
        <el-form-item label="金属质感" required>
          <el-select v-model="metal" placeholder="请选择" style="width: 50%;" clearable>
            <el-option v-for="item in metals" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="色号" required>
          <el-input style="width:50%;" placeholder="请输入色号" v-model="colorId" @input="colorIdBlur" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="颜色">
          <el-input style="width:50%;" v-model="color" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="色系">
          <el-input style="width:50%;" v-model="colorSeries" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="刻度" required>
          <el-input style="width:50%;" placeholder="请输入刻度" v-model="letter" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" required>
          <el-checkbox-group v-model="stock" style="width:50%;">
            <el-checkbox v-for="stocks in stockStats" :label="stocks" :key="stocks">{{stocks}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
      <el-form-item style="margin-left:40%;">
        <input type="button" class="publish-button" @click="submitForm" value="立即创建">
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modelSize: [{
            id: 1,
            name: "Kelly 凯莉包",
            size: ["Kelly Mini", "Kelly Mini 2", "Kelly 25", "Kelly 28", "Kelly 32", "Kelly 35", "Kelly 40",
              "Kelly 50", "Kelly Depeche 34", "Kelly Depeche 38", "Kelly Depeche 25 Pochette", "Kelly Picnic Mini",
              "Kelly Lakis 32"
            ]
          },
          {
            id: 2,
            name: "Birkin 铂金包",
            size: ["Birkin Mini", "Birkin 25", "Birkin 30", "Birkin 35", "Birkin 40", "Birkin 45", "Birkin 50",
              "Birkin Shadow 35"
            ]
          },
          {
            id: 3,
            name: "Constance 康康包",
            size: ["Constance 14", "Constance 18", "Constance 23", "Constance 24"]
          },
          {
            id: 4,
            name: "Lindy 枕头包",
            size: ["Lindy Mini", "Lindy 26", "Lindy 30", "Lindy 34", "Lindy 45"]
          },
          {
            id: 5,
            name: "Roulis 猪鼻包",
            size: ["Roulis Mini", "Roulis S"]
          },
          {
            id: 6,
            name: "Verrou 手枪包",
            size: ["Verrou 17", "Verrou 21"]
          },
          {
            id: 7,
            name: "Picotin 菜篮子",
            size: ["Picotin PM", "Picotin MM", "Picotin GM"]
          },
          {
            id: 8,
            name: "Evelyne 伊夫林",
            size: ["Evelyne TPM", "Evelyne PM", "Evelyne GM", "Evelyne TGM"]
          },
          {
            id: 9,
            name: "Garden Party 空中花园",
            size: ["Garden Party TTPM", "Garden Party TPM", "Garden Party PM", "Garden Party MM", "Garden Party GM"]
          },
          {
            id: 10,
            name: "Jypsiere 吉普赛包",
            size: ["Jypsiere 28", "Jypsiere 31", "Jypsiere 34", "Jypsiere 37"]
          },
          {
            id: 11,
            name: "Bolide",
            size: ["Bolide 15", "Bolide 21", "Bolide 27", "Bolide 31", "Bolide 37", "Bolide 47"]
          },
          {
            id: 12,
            name: "Toolbox",
            size: ["Toolbox 20", "Toolbox 26", "Toolbox 33"]
          },
          {
            id: 13,
            name: "Passe Guide",
            size: ["Passe Guide 28"]
          },
          {
            id: 14,
            name: "Double Sens",
            size: ["Double Sens 36", "Double Sens 45"]
          },
          {
            id: 15,
            name: "Victoria",
            size: ["Victoria II 35", "Victoria II 40"]
          },
          {
            id: 16,
            name: "Cabag",
            size: ["Cabag 32", "Cabag 39", "Cabag 42"]
          },
          {
            id: 17,
            name: "Herbag",
            size: ["Herbag TPM", "Herbag PM", "Herbag MM", "Herbag GM"]
          }
        ],
        form: '',
        pics: '',
        createTime: '', //入库时间
        currencyId: '', //价格币种
        cost: '', //成本价
        pricePeer: '', //同行价
        priceIndi: '', //散客价
        source: '', //货源
        stockLoc: '', //库存地
        model: '', //包款
        size: '', //大小
        leather: '', //材质
        metal: '', //金属质感
        colorId: '', //色号
        color: '', //颜色
        colorSeries: '', //色系
        letter: '', //刻度
        stockStat: '', //状态 
        stock: [],
        imgsUpload: '', //上传图片
        dialogImageUrl: '',
        dialogVisible: false,

        currencyIds: [{
            value: '1',
            label: 'CNY人民币'
          }, {
            value: '2',
            label: 'HKD港元'
          },
          {
            value: '3',
            label: 'USD美元'
          },
          {
            value: '4',
            label: 'EUR欧元'
          },
          {
            value: '5',
            label: 'GBP英镑'
          },
          {
            value: '6',
            label: 'AUD澳元'
          }
        ],

        stockLocs: [{
            value: '香港',
            label: '香港'
          },
          {
            value: '大陆',
            label: '大陆'
          },
          {
            value: '海外',
            label: '海外'
          }
        ],
        sizes: [],

        leathers: [{
            value: '鳄鱼皮',
            label: '鳄鱼皮',
            children: [{
              value: '鳄鱼皮倒 V(亮面)',
              label: '鳄鱼皮倒 V(亮面)',
            }, {
              value: '鳄鱼皮倒 V(雾面)',
              label: '鳄鱼皮倒 V(雾面)',
            }, {
              value: '鳄鱼皮两点(亮面)',
              label: '鳄鱼皮两点(亮面)',
            }, {
              value: '鳄鱼皮两点(雾面)',
              label: '鳄鱼皮两点(雾面)',
            }, {
              value: '鳄鱼皮方块(亮面)',
              label: '鳄鱼皮方块(亮面)',
            }, {
              value: '鳄鱼皮方块(雾面)',
              label: '鳄鱼皮方块(雾面)',
            }]
          },
          {
            value: '普通皮',
            label: '普通皮',
            children: [{
              value: 'Togo',
              label: 'Togo',
            }, {
              value: 'Clemence',
              label: 'Clemence',
            }, {
              value: 'Epsom',
              label: 'Epsom',
            }, {
              value: 'Fjord',
              label: 'Fjord',
            }, {
              value: 'Box Calf',
              label: 'Box Calf',
            }, {
              value: 'Tadelakt',
              label: 'Tadelakt',
            }, {
              value: 'Chamonix',
              label: 'Chamonix',
            }, {
              value: 'Evercalf',
              label: 'Evercalf',
            }, {
              value: 'Evergrain',
              label: 'Evergrain',
            }, {
              value: 'Sikkim',
              label: 'Sikkim',
            }, {
              value: 'Barenia Natural',
              label: 'Barenia Natural',
            }, {
              value: 'Swift',
              label: 'Swift',
            }, {
              value: 'Evercolor',
              label: 'Evercolor',
            }, {
              value: 'Buffalo',
              label: 'Buffalo',
            }, {
              value: 'Sombrcro',
              label: 'Sombrcro',
            }, {
              value: 'Chevre de coromandel',
              label: 'Chevre de coromandel',
            }, {
              value: 'Chenre mysore',
              label: 'Chenre mysore',
            }, {
              value: 'Doblis Suede',
              label: 'Doblis Suede',
            }]
          },
          {
            value: '特殊皮',
            label: '特殊皮',
            children: [{
              value: '蜥蜴皮',
              label: '蜥蜴皮',
            }, {
              value: '鸵鸟皮',
              label: '鸵鸟皮',
            }, {
              value: '马鞍皮',
              label: '马鞍皮',
            }, {
              value: '竹篮子',
              label: '竹篮子'
            }]
          }
        ],

        clrs: [{
            sexi: "Black 黑色系",
            yanse: [{
                sehao: "89",
                name: "黑色"
              },
              {
                sehao: "88",
                name: "炭黑"
              },
              {
                sehao: "46",
                name: "乌木色"
              }
            ]
          },
          {
            sexi: "Brown 棕色系",
            yanse: [{
                sehao: "33",
                name: "蜜色"
              },
              {
                sehao: "45",
                name: "深棕色"
              },
              {
                sehao: "4G",
                name: "焦褐色"
              },
              {
                sehao: "4D",
                name: "深咖啡（大地色）"
              },
              {
                sehao: "4I",
                name: "印度棕"
              },
              {
                sehao: "4H",
                name: "可可色"
              },
              {
                sehao: "21",
                name: "自然沙色"
              },
              {
                sehao: "40",
                name: "奶茶色"
              },
              {
                sehao: "34",
                name: "浅褐色"
              },
              {
                sehao: "41",
                name: "哈瓦那咖啡色"
              }
            ]
          },
          {
            sexi: "White 白色系",
            yanse: [{
                sehao: "3C",
                name: "羊毛白"
              },
              {
                sehao: "1B",
                name: "鮰鱼色"
              },
              {
                sehao: "1",
                name: "白色"
              },
              {
                sehao: "5",
                name: "银色"
              },
              {
                sehao: "01",
                name: "喜马拉雅"
              },
              {
                sehao: "8L",
                name: "奶昔白"
              },
              {
                sehao: "10",
                name: "米白色"
              },
              {
                sehao: "12",
                name: "灰白色"
              },
              {
                sehao: "14",
                name: "米色"
              }
            ]
          },
          {
            sexi: "Gold 金色系",
            yanse: [{
                sehao: "6",
                name: "鎏金色"
              },
              {
                sehao: "37",
                name: "金色"
              },
              {
                sehao: "1H",
                name: "太妃糖色"
              }
            ]
          },
          {
            sexi: "Yellow 黄色系",
            yanse: [{
                sehao: "1Z",
                name: "小鸡黄"
              },
              {
                sehao: "1A",
                name: "稻草黄"
              },
              {
                sehao: "2C",
                name: "咖喱黄"
              },
              {
                sehao: "2E",
                name: "肉桂黄"
              },
              {
                sehao: "2H",
                name: "牛皮纸色"
              },
              {
                sehao: "2P",
                name: "小茴香色"
              },
              {
                sehao: "4A",
                name: "咖啡色"
              },
              {
                sehao: "4C",
                name: "果皮色"
              },
              {
                sehao: "4L",
                name: "雪茄色"
              },
              {
                sehao: "4V",
                name: "铁锈"
              },
              {
                sehao: "9D",
                name: "琥珀黄"
              },
              {
                sehao: "9H",
                name: "日光金"
              },
              {
                sehao: "9R",
                name: "柠檬黄"
              },
              {
                sehao: "9U",
                name: "新芒果黄"
              },
              {
                sehao: "9V",
                name: "太阳黄"
              },
              {
                sehao: "9Y",
                name: "姜黄色"
              },
              {
                sehao: "9Z",
                name: "芒果黄"
              },
              {
                sehao: "C9",
                name: "硫磺色"
              },
              {
                sehao: "M9",
                name: "含羞草黄"
              },
              {
                sehao: "16",
                name: "鼹鼠灰"
              },
              {
                sehao: "27",
                name: "天然色"
              },
              {
                sehao: "28",
                name: "焦糖色"
              },
              {
                sehao: "30",
                name: "榛褐色"
              },
              {
                sehao: "48",
                name: "尼古丁色"
              },
              {
                sehao: "35",
                name: "干邑色"
              },
              {
                sehao: "44",
                name: "摩卡色"
              },
              {
                sehao: "47",
                name: "巧克力色"
              },
              {
                sehao: "I9",
                name: "杏黄色"
              },
              {
                sehao: "9O",
                name: "那不勒斯黄"
              }
            ]
          },
          {
            sexi: "Orange 橙色系",
            yanse: [{
                sehao: "36",
                name: "砖红"
              },
              {
                sehao: "3B",
                name: "玛瑙色"
              },
              {
                sehao: "3H",
                name: "赫石色"
              },
              {
                sehao: "5F",
                name: "南瓜橙"
              },
              {
                sehao: "5K",
                name: "橘子红"
              },
              {
                sehao: "9J",
                name: "火焰橙"
              },
              {
                sehao: "L5",
                name: "虾红色"
              },
              {
                sehao: "93",
                name: "橙色"
              },
              {
                sehao: "8V",
                name: "罂粟橙"
              }
            ]
          },
          {
            sexi: "Red 红色系",
            yanse: [{
                sehao: "53",
                name: "艳红色"
              },
              {
                sehao: "56",
                name: "鲜红"
              },
              {
                sehao: "5I",
                name: "异国红"
              },
              {
                sehao: "5X",
                name: "辣椒红"
              },
              {
                sehao: "5Z",
                name: "印度红"
              },
              {
                sehao: "D5",
                name: "天兰葵红"
              },
              {
                sehao: "54",
                name: "大红"
              },
              {
                sehao: "S3",
                name: "心红色"
              },
              {
                sehao: "S5",
                name: "西红柿红"
              },
              {
                sehao: "95",
                name: "法拉利红"
              },
              {
                sehao: "51",
                name: "异国红"
              },
              {
                sehao: "55",
                name: "爱马仕红"
              },
              {
                sehao: "57",
                name: "波尔多酒红"
              },
              {
                sehao: "B5",
                name: "宝石红"
              },
              {
                sehao: "5E",
                name: "朱砂红"
              },
              {
                sehao: "A5",
                name: "杜鹃红"
              },
              {
                sehao: "5D",
                name: "珊瑚红"
              },
              {
                sehao: "Q5",
                name: "国旗红"
              },
              {
                sehao: "5Q",
                name: "糖果红"
              },
              {
                sehao: "9M",
                name: "三文鱼红"
              },
              {
                sehao: "9T",
                name: "火橙"
              },
              {
                sehao: "2R",
                name: "牡丹红"
              },
              {
                sehao: "R1",
                name: "红土色"
              },
              {
                sehao: "K1",
                name: "石榴红"
              },
              {
                sehao: "6C",
                name: "古铜色"
              },
              {
                sehao: "F5",
                name: "酒红色"
              }
            ]
          },
          {
            sexi: "Pink 粉色系",
            yanse: [{
                sehao: "1R",
                name: "沙漠玫瑰色"
              },
              {
                sehao: "5U",
                name: "糖果粉"
              },
              {
                sehao: "E5",
                name: "提尔粉"
              },
              {
                sehao: "G5",
                name: "玫瑰木色"
              },
              {
                sehao: "K5",
                name: "托斯卡紫"
              },
              {
                sehao: "8W",
                name: "杜鹃粉"
              },
              {
                sehao: "U9",
                name: "桃粉色"
              },
              {
                sehao: "1Q",
                name: "玫瑰粉色"
              },
              {
                sehao: "3L",
                name: "玫瑰粉"
              },
              {
                sehao: "3Q",
                name: "樱花粉"
              },
              {
                sehao: "5V",
                name: "玫瑰木粉"
              },
              {
                sehao: "5R",
                name: "艳桃粉"
              },
              {
                sehao: "5P",
                name: "樱花粉"
              },
              {
                sehao: "5J",
                name: "桃粉"
              },
              {
                sehao: "U5",
                name: "唇膏粉"
              },
              {
                sehao: "T5",
                name: "普尔斋粉"
              },
              {
                sehao: "I5",
                name: "火烈鸟粉"
              },
              {
                sehao: "I6",
                name: "亮粉色"
              },
              {
                sehao: "9I",
                name: "玉兰粉"
              },
              {
                sehao: "94",
                name: "陶瓷粉"
              }
            ]
          },
          {
            sexi: "Purple 紫色系",
            yanse: [{
                sehao: "9G",
                name: "紫水晶"
              },
              {
                sehao: "58",
                name: "李子深紫红"
              },
              {
                sehao: "59",
                name: "葡萄紫"
              },
              {
                sehao: "96",
                name: "紫罗兰"
              },
              {
                sehao: "P9",
                name: "海葵紫"
              },
              {
                sehao: "9P",
                name: "新熏衣草紫"
              },
              {
                sehao: "9K",
                name: "鸢尾紫"
              },
              {
                sehao: "9W",
                name: "梦幻紫"
              },
              {
                sehao: "5H",
                name: "熏衣草紫"
              },
              {
                sehao: "J5",
                name: "天方夜谭紫"
              },
              {
                sehao: "5C",
                name: "紫罗兰"
              },
              {
                sehao: "5L",
                name: "极紫"
              },
              {
                sehao: "N5",
                name: "黑加仑"
              },
              {
                sehao: "L3",
                name: "紫玫色"
              },
              {
                sehao: "3V",
                name: "紫色"
              }
            ]
          },
          {
            sexi: "Blue 蓝色系",
            yanse: [{
                sehao: "8",
                name: "浅蓝色"
              },
              {
                sehao: "71",
                name: "法国蓝"
              },
              {
                sehao: "73",
                name: "宝石蓝色"
              },
              {
                sehao: "78",
                name: "海军蓝"
              },
              {
                sehao: "3P",
                name: "马卡龙蓝"
              },
              {
                sehao: "P3",
                name: "北方蓝"
              },
              {
                sehao: "J7",
                name: "亚麻蓝"
              },
              {
                sehao: "75",
                name: "牛仔蓝"
              },
              {
                sehao: "7W",
                name: "伊兹密尔蓝"
              },
              {
                sehao: "7Q",
                name: "希腊蓝"
              },
              {
                sehao: "K7",
                name: "深蓝色"
              },
              {
                sehao: "7C",
                name: "钴蓝"
              },
              {
                sehao: "7P",
                name: "普鲁士蓝"
              },
              {
                sehao: "7L",
                name: "马耳他蓝"
              },
              {
                sehao: "7B",
                name: "松石蓝"
              },
              {
                sehao: "7F",
                name: "孔雀蓝"
              },
              {
                sehao: "7V",
                name: "湖水绿"
              },
              {
                sehao: "7M",
                name: "湖水蓝"
              },
              {
                sehao: "7N",
                name: "糖果蓝"
              },
              {
                sehao: "Z7",
                name: "深海蓝"
              },
              {
                sehao: "7K",
                name: "宝石蓝"
              },
              {
                sehao: "7R",
                name: "天青蓝"
              },
              {
                sehao: "8U",
                name: "冰川蓝"
              },
              {
                sehao: "7T",
                name: "电光蓝"
              },
              {
                sehao: "T7",
                name: "水妖蓝"
              },
              {
                sehao: "I7",
                name: "琉璃蓝"
              },
              {
                sehao: "S7",
                name: "加利西亚蓝"
              },
              {
                sehao: "7G",
                name: "天空蓝"
              },
              {
                sehao: "Y7",
                name: "蓝灰色"
              },
              {
                sehao: "7E",
                name: "明蓝色"
              },
              {
                sehao: "7A",
                name: "皇家蓝"
              },
              {
                sehao: "N7",
                name: "风暴蓝"
              },
              {
                sehao: "2T",
                name: "天堂蓝"
              },
              {
                sehao: "2Z",
                name: "午夜蓝"
              },
              {
                sehao: "R2",
                name: "玛瑙蓝"
              },
              {
                sehao: "U2",
                name: "和风蓝"
              },
              {
                sehao: "1P",
                name: "鸭绿色"
              },
              {
                sehao: "76",
                name: "靛蓝"
              },
              {
                sehao: "77",
                name: "鸢尾蓝"
              },
              {
                sehao: "M3",
                name: "宝墨蓝"
              },
              {
                sehao: "W0",
                name: "深蓝色"
              },
              {
                sehao: "B3",
                name: "坦桑尼亚蓝"
              }
            ]
          },
          {
            sexi: "Grey 灰色系",
            yanse: [{
                sehao: "80",
                name: "珍珠灰"
              },
              {
                sehao: "85",
                name: "石板灰"
              },
              {
                sehao: "8G",
                name: "煤黑色"
              },
              {
                sehao: "8P",
                name: "铅灰色"
              },
              {
                sehao: "8S",
                name: "鼠灰色"
              },
              {
                sehao: "81",
                name: "斑鸠灰"
              },
              {
                sehao: "18",
                name: "麻绳灰"
              },
              {
                sehao: "19",
                name: "深米色"
              },
              {
                sehao: "1F",
                name: "粘土色"
              },
              {
                sehao: "32",
                name: "伊特鲁里亚红"
              },
              {
                sehao: "8F",
                name: "锡器灰"
              },
              {
                sehao: "8C",
                name: "大象灰"
              },
              {
                sehao: "8M",
                name: "银河灰"
              },
              {
                sehao: "M8",
                name: "沥青灰"
              },
              {
                sehao: "15",
                name: "粉杏色"
              },
              {
                sehao: "16",
                name: "鼹鼠灰"
              },
              {
                sehao: "17",
                name: "淡灰褐色"
              },
              {
                sehao: "18",
                name: "麻绳灰"
              },
              {
                sehao: "4Z",
                name: "海鸥灰"
              },
              {
                sehao: "S2",
                name: "风衣灰"
              }
            ]
          },
          {
            sexi: "Green 绿色系",
            yanse: [{
                sehao: "60",
                name: "青铜绿"
              },
              {
                sehao: "U4",
                name: "丝绒绿"
              },
              {
                sehao: "7",
                name: "浅绿色"
              },
              {
                sehao: "2Q",
                name: "英国绿"
              },
              {
                sehao: "6F",
                name: "苔绿色"
              },
              {
                sehao: "6G",
                name: "草坪绿"
              },
              {
                sehao: "6U",
                name: "薄荷绿"
              },
              {
                sehao: "F6",
                name: "桉树绿"
              },
              {
                sehao: "K6",
                name: "苹果绿"
              },
              {
                sehao: "Z6",
                name: "孔雀绿"
              },
              {
                sehao: "66",
                name: "茴香绿"
              },
              {
                sehao: "61",
                name: "橄榄绿"
              },
              {
                sehao: "67",
                name: "深绿色"
              },
              {
                sehao: "1K",
                name: "竹子绿"
              },
              {
                sehao: "1L",
                name: "仙人掌绿"
              },
              {
                sehao: "U1",
                name: "维罗斯纳绿"
              },
              {
                sehao: "6Q",
                name: "祖母绿"
              },
              {
                sehao: "6Z",
                name: "孔雀绿"
              },
              {
                sehao: "V6",
                name: "丛林绿"
              },
              {
                sehao: "6R",
                name: "奇异果绿"
              },
              {
                sehao: "6W",
                name: "薄荷绿"
              },
              {
                sehao: "6V",
                name: "月桂叶绿"
              },
              {
                sehao: "C6",
                name: "墨绿"
              },
              {
                sehao: "6H",
                name: "维罗纳绿"
              },
              {
                sehao: "6L",
                name: "孟加拉国绿"
              },
              {
                sehao: "6O",
                name: "松柏绿"
              },
              {
                sehao: "Q1",
                name: "鼠尾草绿"
              }
            ]
          }
        ],

        metals: [{
            value: '金',
            label: '金'
          },
          {
            value: '淡金',
            label: '淡金'
          },
          {
            value: '玫瑰金',
            label: '玫瑰金'
          },
          {
            value: '磨砂金',
            label: '磨砂金'
          },
          {
            value: '银',
            label: '银'
          },
          {
            value: '钻石',
            label: '钻石'
          },
          {
            value: '法郎',
            label: '法郎'
          }
        ],

        stockStats: ['全新', '9.9成新', '齐膜', '有轻微划痕', '有压痕', '发票', '鳄鱼皮证书', '说明书', '锁扣', '肩带', '盒子', '绒布', '雨衣'],
        colorList: [],
        b: '',
        c: '',
        e: '',
        d: ''
      }
    },
    methods: {
      sizeSel() {
        for (let i = 0; i < this.modelSize.length; i++) {
          if (this.model == this.modelSize[i].name) {
            this.sizes = this.modelSize[i].size;
          }
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleChange(value) {
        console.log(value);
        this.leather = value[1];
        console.log(this.leather);
      },
      // 颜色色系
      colorIdBlur() {
        this.b = '';
        this.c = '';
        this.e = '';
        this.d = '';
        this.color = '';
        this.colorSeries = '';
        for (let i in this.clrs) {
          for (let j in this.clrs[i].yanse) {
            if (this.colorId.match(/[a-z]/g) !== null) {
              this.colorId = this.colorId.toUpperCase();
              if (this.colorId.indexOf('/') !== -1) {
                this.colorList = this.colorId.split('/');
                if (this.colorList[0] == this.clrs[i].yanse[j].sehao) {
                  this.e = this.clrs[i].yanse[j].name;
                  this.b = this.clrs[i].sexi;
                }
                if (this.colorList[1] == this.clrs[i].yanse[j].sehao) {
                  this.d = this.clrs[i].yanse[j].name;
                  this.c = this.clrs[i].sexi;
                }
                this.color = this.e + '拼' + this.d;
                this.colorSeries = this.b + '/' + this.c;
              } else {
                if (this.colorId == this.clrs[i].yanse[j].sehao) {
                  this.color = this.clrs[i].yanse[j].name;
                  this.colorSeries = this.clrs[i].sexi;
                }
              }
            } else {
              if (this.colorId.indexOf('/') !== -1) {
                this.colorList = this.colorId.split('/');
                if (this.colorList[0] == this.clrs[i].yanse[j].sehao) {
                  this.e = this.clrs[i].yanse[j].name;
                  this.b = this.clrs[i].sexi;
                }
                if (this.colorList[1] == this.clrs[i].yanse[j].sehao) {
                  this.d = this.clrs[i].yanse[j].name;
                  this.c = this.clrs[i].sexi;
                }
                this.color = this.e + '拼' + this.d;
                this.colorSeries = this.b + '/' + this.c;
              } else {
                if (this.colorId == this.clrs[i].yanse[j].sehao) {
                  this.color = this.clrs[i].yanse[j].name;
                  this.colorSeries = this.clrs[i].sexi;
                }
              }
            }
          }
        }
      },
      // 时间转换
      transitionTime(time) {
        if (time) {
          let date = new Date(time);
          console.log('MMM' + date);
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          var d = date.getDate();
          var h = date.getHours();
          var m1 = date.getMinutes();
          var s = date.getSeconds();
          m = m < 10 ? ("0" + m) : m;
          d = d < 10 ? ("0" + d) : d;
          h = h < 10 ? ("0" + h) : h;
          m1 = m1 < 10 ? ("0" + m1) : m1;
          s = s < 10 ? ("0" + s) : s;
          console.log('qqq' + y + "-" + m + "-" + d + " " + h + ":" + m1 + ":" + s);
          return y + "-" + m + "-" + d + " " + h + ":" + m1 + ":" + s;
        }
      },
      // 提交
      data1() {
        if (this.$store.state.imgUrl == '' || this.createTime == null || this.currencyId == '' || this.cost == '' || this.pricePeer == '' || this.priceIndi == '' ||
          this.source == '' || this.stockLoc == '' || this.model == '' || this.size == '' || this.leather == '' || this.metal == '' ||
          this.colorId == '' || this.letter == '' || this.stock == '') {
          alert('数据不能为空，请检查数据的填写');
          return 1;
        }
        if(this.color == ''){
          alert('颜色色号输入错误，请重新填写');
          return 1;
        }
      },
      submitForm() {
        if (this.data1() !== 1) {
          this.updateData();
        }
      },
      updateData() {
        for (let item of this.stock) {
          this.stockStat += item + '|';
        }
        console.log('ppppp');
        console.log(this.$store.state.imgUrl);
        let params = {
          pics: this.$store.state.imgUrl,
          createTime: this.transitionTime(this.createTime),
          currencyId: this.currencyId,
          cost: this.cost,
          pricePeer: this.pricePeer,
          priceIndi: this.priceIndi,
          source: this.source,
          stockLoc: this.stockLoc,
          model: this.model,
          size: this.size,
          leather: this.leather,
          metal: this.metal,
          colorId: this.colorId,
          color: this.color,
          letter: this.letter,
          stockStat: this.stockStat,
          name: this.model + ' ' + this.size + ' ' + this.colorId + ' ' + this.color + ' ' + this.leather + ' ' +
            this.metal,
          colorSeries: this.colorSeries,
          saleStat: "出售中",
          sold: "0"
        };
        this.$axios.post(this.$store.state.baseUrl + '/insert', params).then((res) => {
          console.log('1111tong');
          console.log(res);
          if (res.status == 200) {
            this.$message.success({
              message: '商品发布成功',
              showClose: true,
              duration: 2000
            })
            location.reload();
          }
        }).catch((err) => {
          this.$message.error({
            message: err,
            showClose: true,
            duration: 6000
          })
        })
      }
    }
  }

</script>
<style lang="scss" scoped>
  .publish-container {
    margin-top: 40px;
    margin-left: 40px;
  }

  .publish-button {
    width: 160px;
    height: 48px;
    background: url('../../assets/imgs/export.png') no-repeat;
    border: 0;
    border-radius: 10px;
    font-size: 15px;
    color: #fff;
    cursor: pointer;
  }

  .publish-button:focus {
    outline: 0;
  }

</style>
<style lang="scss">
  .el-upload--picture-card {
    width: 100px !important;
    height: 100px !important;
    line-height: 110px;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    margin: auto 0;
  }

  .el-form-item .el-form-item {
    margin-bottom: 10px;
  }

</style>
