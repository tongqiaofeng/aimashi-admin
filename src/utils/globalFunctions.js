export default function(Vue) {
  let stateList = [
    {
      label: "采购中",
      value: "0"
    },
    {
      label: "存货",
      value: "1"
    },
    {
      label: "客人预留",
      value: "2"
    },
    {
      label: "已出售",
      value: "3"
    },
    {
      label: "购入退货",
      value: "6"
    },
    {
      label: "已寄卖",
      value: "8"
    },
    {
      label: "遗失",
      value: "7"
    },
    {
      label: "客人取回",
      value: "5"
    }
  ];
  Vue.prototype.soldStateRgx = function(item) {
    if (item == 3 || item == 4) {
      return "已出售";
    } else {
      for (let i = 0; i < stateList.length; ++i) {
        if (item == stateList[i].value) return stateList[i].label;
      }
    }

    return "";
  };

  let typeList = [
    {
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
  Vue.prototype.tradeTypeRgx = function(item) {
    for (let i = 0; i < typeList.length; ++i) {
      if (item == typeList[i].value) return typeList[i].label;
    }
    return "";
  };

  let currencyIds = [
    {
      value: "1",
      label: "CNY人民币"
    },
    {
      value: "2",
      label: "HKD港币"
    },
    {
      value: "3",
      label: "USD美元"
    },
    {
      value: "4",
      label: "EUR欧元"
    },
    {
      value: "5",
      label: "GBP英镑"
    },
    {
      value: "6",
      label: "AUD澳元"
    }
  ];
  Vue.prototype.currencyRgx = function(item) {
    for (let i = 0; i < currencyIds.length; ++i) {
      if (item == currencyIds[i].value)
        return currencyIds[i].label
          .split("")
          .slice(0, 3)
          .join("");
    }
    return "";
  };

  Vue.prototype.currencyFontRgx = function(item) {
    for (let i = 0; i < currencyIds.length; ++i) {
      if (
        item ==
        currencyIds[i].label
          .split("")
          .slice(0, 3)
          .join("")
      )
        return currencyIds[i].label
          .split("")
          .slice(3, 6)
          .join("");
    }
    return "";
  };

  // 貨號提取
  Vue.prototype.productCodeGet = function(item) {
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
  Vue.prototype.formatNumberRgx = function(num) {
    if (num == "" || num == null || num == 0) {
      return 0;
    } else {
      let parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
  };

  // 負數及带小数數字的獲取
  Vue.prototype.getPriceNum = function(value) {
    console.log(value);
    if (value != "" && value != null) {
      let reg = /(\-)?\d+[0-9]+([.]{1}[0-9]+){0,1}/g;
      let m = value
        .toString()
        .replace(/,/g, "")
        .match(reg);
      console.log(m);
      return m ? m.join("") : value;
    } else {
      return "";
    }
  };
  // 負數及整数数字的获取
  Vue.prototype.getIntegerNum = function(value) {
    console.log(value);
    if (value != "" && value != null) {
      let reg = /(\-)?\d+[0-9]+([0-9]+){0,1}/g;

      let m = value
        .toString()
        .replace(/,/g, "")
        .match(reg);
      console.log(m);
      return m ? m.join("") : value;
    } else {
      return "";
    }
  };
  // 在庫时长
  Vue.prototype.timeLong = function(time) {
    if (time !== null && time !== "") {
      let startTime = new Date(time); // 开始时间
      let endTime = new Date(); // 结束时间
      let times =
        Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24) + " 天";
      return times;
    } else {
      return "-";
    }
  };

  // 大图
  Vue.prototype.bigImg = function(pics) {
    // console.log(pics);
    if (pics) {
      let list = pics.split("|").filter(s => {
        return s && s.trim();
      });

      return list;
    } else {
      return [];
    }
  };
}
