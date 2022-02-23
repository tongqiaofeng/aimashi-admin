export default function (Vue) {
  let typeList = [{
      label: "買入",
      value: 0
    },
    {
      label: "賣出",
      value: 1
    },
    {
      label: "轉賬",
      value: 2
    },
    {
      label: "買入退款",
      value: 3
    },
    {
      label: "賣出退款",
      value: 4
    },
    {
      label: "其他收入",
      value: 5
    },
    {
      label: "其他支出",
      value: 6
    }
  ];
  // 账单类型匹配
  Vue.prototype.tradeTypeRgx = function (item) {
    for (let i = 0; i < typeList.length; ++i) {
      if (item == typeList[i].value) return typeList[i].label;
    }
    return "";
  };

  // 貨號提取
  Vue.prototype.productCodeGet = function (item) {
    if (item.length > 0) {
      let msg = "";
      for (const every of item) {
        msg += every.productCode + "<br />";
      }
      return msg;
    } else {
      return "/";
    }
  };

  // 千分钱数
  Vue.prototype.formatNumberRgx = function (num) {
    if (num == "" || num == null || num == 0) {
      return 0;
    } else {
      let parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
  };

  // 負數及带小数數字的獲取
  Vue.prototype.getPriceNum = function (value) {
    console.log(value);
    if (value != "") {
      let reg = /(\-)?\d+[0-9]+([.]{1}[0-9]+){0,1}/g;
      let m = value.toString().replace(/,/g, '').match(reg);
      console.log(m);
      return m.join("");
    } else {
      return "";
    }
  };
  // 負數及整数数字的获取
  Vue.prototype.getIntegerNum = function (value) {
    console.log(value);
    if (value != "" && value != null && value != 0) {
      let reg = /(\-)?\d+[0-9]+([0-9]+){0,1}/g;

      let m = value.toString().replace(/,/g, '').match(reg);
      console.log(m);
      return m.join("");
    } else {
      return "";
    }
  };
};
