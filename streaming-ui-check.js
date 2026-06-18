/**

[task_local]
event-interaction https://raw.githubusercontent.com/KOP-XIAO/QuantumultX/master/Scripts/streaming-ui-check.js, tag=流媒体-解锁查询, img-url=checkmark.seal.system, enabled=true

**/

const BASE_URL_NF = 'https://www.netflix.com/title/';
const FILM_ID = 81280792;
const BASE_URL_GPT = 'https://chat.openai.com/';
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace';

const arrow = " ➟ "

var opts = { policy: $environment.params };
var opts1 = { policy: $environment.params, redirection: false };

// 经典国旗映射表
var flags = new Map([
  ["AC","🇦🇨"],["AE","🇦🇪"],["AF","🇦🇫"],["AI","🇦🇮"],["AL","🇦🇱"],["AM","🇦🇲"],["AQ","🇦🇶"],["AR","🇦🇷"],["AS","🇦🇸"],["AT","🇦🇹"],["AU","🇦🇺"],["AW","🇦🇼"],["AX","🇦🇽"],["AZ","🇦🇿"],
  ["BA","🇧🇦"],["BB","🇧🇧"],["BD","🇧🇩"],["BE","🇧🇪"],["BF","🇧🇫"],["BG","🇧🇬"],["BH","🇧🇭"],["BI","🇧🇮"],["BJ","🇧🇯"],["BM","🇧🇲"],["BN","🇧🇳"],["BO","🇧🇴"],["BR","🇧🇷"],["BS","🇧🇸"],["BT","🇧🇹"],["BV","🇧🇻"],["BW","🇧🇼"],["BY","🇧🇾"],["BZ","🇧🇿"],
  ["CA","🇨🇦"],["CF","🇨🇫"],["CH","🇨🇭"],["CK","🇨🇰"],["CL","🇨🇱"],["CM","🇨🇲"],["CN","🇨🇳"],["CO","🇨🇴"],["CP","🇨🇵"],["CR","🇨🇷"],["CU","🇨🇺"],["CV","🇨🇻"],["CW","🇨🇼"],["CX","🇨🇽"],["CY","🇨🇾"],["CZ","🇨🇿"],
  ["DE","🇩🇪"],["DG","🇩🇬"],["DJ","🇩🇯"],["DK","🇩🇰"],["DM","🇩🇲"],["DO","🇩🇴"],["DZ","🇩🇿"],
  ["EA","🇪🇦"],["EC","🇪🇨"],["EE","🇪🇪"],["EG","🇪🇬"],["EH","🇪🇭"],["ER","🇪🇷"],["ES","🇪🇸"],["ET","🇪🇹"],["EU","🇪🇺"],
  ["FI","🇫🇮"],["FJ","🇫🇯"],["FK","🇫🇰"],["FM","🇫🇲"],["FO","🇫🇴"],["FR","🇫🇷"],
  ["GA","🇬🇦"],["GB","🇬🇧"],["GD","🇬🇩"],["GE","🇬🇪"],["GF","🇬🇫"],["GG","🇬🇬"],["GH","🇬🇭"],["GI","🇬🇮"],["GL","🇬🇱"],["GM","🇬🇲"],["GN","🇬🇳"],["GP","🇬🇵"],["GQ","🇬🇶"],["GR","🇬🇷"],["GS","🇬🇸"],["GT","🇬🇹"],["GU","🇬🇺"],["GW","🇬🇺"],["GY","🇬🇾"],
  ["HK","🇭🇰"],["HN","🇭🇳"],["HR","🇭🇷"],["HT","🇭🇹"],["HU","🇭🇺"],
  ["ID","🇮🇩"],["IE","🇮🇪"],["IL","🇮🇱"],["IM","🇮🇲"],["IN","🇮🇳"],["IO","🇮🇴"],["IQ","🇮🇶"],["IR","🇮🇷"],["IS","🇮🇸"],["IT","🇮🇹"],
  ["JE","🇯🇪"],["JM","🇯🇲"],["JO","🇯🇴"],["JP","🇯🇵"],
  ["KE","🇰🇪"],["KG","🇰🇬"],["KH","🇰🇭"],["KI","🇰🇮"],["KM","🇰🇲"],["KN","🇰🇳"],["KP","🇰🇵"],["KR","🇰🇷"],["KW","🇰🇼"],["KY","🇰🇾"],["KZ","KZ"],
  ["LA","🇱🇦"],["LB","🇱🇧"],["LC","🇱🇨"],["LI","🇱🇮"],["LK","🇱🇰"],["LR","🇱🇷"],["LS","🇱🇸"],["LT","🇱🇺"],["LU","🇱🇺"],["LV","🇱🇻"],["LY","🇱🇾"],
  ["MA","🇲🇦"],["MC","🇲🇨"],["MD","🇲🇩"],["ME","🇲🇪"],["MF","🇲🇫"],["MG","🇲🇬"],["MH","🇲🇭"],["MK","🇲🇰"],["ML","🇲🇱"],["MM","🇲🇲"],["MN","🇲🇳"],["MO","🇲🇴"],["MP","🇲🇵"],["MQ","🇲🇶"],["MR","🇲🇷"],["MS","🇲🇸"],["MT","🇲🇹"],["MU","🇲🇺"],["MV","🇲🇲"],["MW","🇲🇼"],["MX","🇲🇽"],["MY","🇲🇾"],["MZ","🇲🇿"],
  ["NA","🇳🇦"],["NC","🇳🇨"],["NE","🇳🇪"],["NF","🇳🇫"],["NG","🇳🇬"],["NI","🇳🇮"],["NL","🇳🇱"],["NO","🇳🇺"],["NP","🇳🇵"],["NR","🇳🇷"],["NU","🇳🇺"],["NZ","🇳🇿"],
  ["OM","🇴🇲"],
  ["PA","🇵🇦"],["PE","🇵🇪"],["PF","🇵🇫"],["PG","🇵🇬"],["PH","🇵🇭"],["PK","🇵🇰"],["PL","🇵🇱"],["PM","🇵🇲"],["PN","🇵🇳"],["PR","🇵🇷"],["PS","🇵🇸"],["PT","🇵🇹"],["PW","🇵🇼"],["PY","🇵🇾"],
  ["QA","🇶🇦"],
  ["RE","🇷🇪"],["RO","🇷🇴"],["RS","🇷🇸"],["RU","🇷🇺"],["RW","🇷🇼"],
  ["SA","🇸🇦"],["SB","🇧🇸"],["SC","🇸🇨"],["SD","🇸🇩"],["SE","🇸🇪"],["SG","🇸🇬"],["SH","🇸🇭"],["SI","🇸🇮"],["SJ","🇸🇯"],["SK","🇸🇰"],["SL","🇸🇱"],["SM","🇸🇲"],["SN","🇸🇳"],["SO","🇸🇴"],["SR","🇸🇷"],["SS","🇸🇸"],["ST","🇸🇹"],["SV","🇸🇻"],["SX","🇸🇽"],["SY","🇸🇾"],["SZ","🇸🇿"],
  ["TC","🇹🇨"],["TD","🇹🇩"],["TF","🇹🇫"],["TG","🇹🇬"],["TH","🇹🇭"],["TJ","🇹🇯"],["TK","🇹🇰"],["TL","🇹🇱"],["TM","🇹🇲"],["TN","🇹🇳"],["TO","🇹🇴"],["TR","🇹🇷"],["TT","🇹🇹"],["TV","🇹🇻"],["TW","🇨🇳"],["TZ","🇹🇿"],
  ["UA","🇺🇦"],["UG","🇺🇬"],["UK","🇬🇧"],["UM","🇺🇲"],["US","🇺🇸"],["UY","🇺🇾"],["UZ","🇺🇿"],
  ["VA","🇻🇦"],["VC","🇻🇨"],["VE","🇻🇪"],["VG","🇻🇬"],["VI","🇻🇮"],["VN","🇻🇳"],["VU","🇻🇺"],
  ["WF","🇼🇫"],["WS","🇼🇸"],
  ["XK","🇽🇰"],
  ["YE","🇾🇪"],["YT","🇾🇹"],
  ["ZA","🇿🇦"],["ZM","🇿🇲"],["ZW","🇿🇼"]
]);

// 官方支持 ChatGPT 的主流国家/地区代码
const support_countryCodes = ["US","TW","HK","SG","JP","KR","GB","FR","DE","CA","AU","IT","ES","CH","NL","IE","NZ","MY"];

let result = {
  "title": '    🤖  服务解锁查询',
  "Netflix": '<b>Netflix: </b>检测失败，请重试 ❗️',
  "ChatGPT" : '<b>ChatGPT: </b>检测失败，请重试 ❗️'
}

const message = {
  action: "get_policy_state",
  content: $environment.params
};

;(async () => {
  // 并发执行 Netflix 和 ChatGPT 检测
  await Promise.all([testNf(FILM_ID), testChatGPT()]);

  $configuration.sendMessage(message).then(resolve => {
    let output = $environment.params;
    if (resolve.ret && resolve.ret[message.content]) {
      output = JSON.stringify(resolve.ret[message.content]).replace(/\"|\[|\]/g,"").replace(/\,/g," ➟ ");
    }
    
    // 构造 HTML 界面
    let content = "--------------------------------------</br>" + [result["ChatGPT"], result["Netflix"]].join("</br></br>");
    content = content + "</br>--------------------------------------</br>" + "<font color=#CD5C5C>" + "<b>节点</b> ➟ " + output + "</font>";
    content = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`;
    
    $done({"title": result["title"], "htmlMessage": content});
  }, reject => {
    $done();
  });  
})()
.catch(() => {
  $done({"title": result["title"], "htmlMessage": `<p style="text-align: center;">----------------------</br></br>🚥 检测异常</br></br>----------------------</p>`});
});

// 获取国旗小工具函数
function getFlag(code) {
  if (!code) return "🏳️";
  let flag = flags.get(code.toUpperCase());
  return flag ? flag : code.toUpperCase();
}

// ==================== Netflix 检测 ====================
function testNf(filmId) {
  return new Promise((resolve) => {
    let option = {
      url: BASE_URL_NF + filmId,
      opts: opts,
      timeout: 4000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    };
    $task.fetch(option).then(response => {
      if (response.statusCode === 404) {
        result["Netflix"] = "<b>Netflix: </b>支持自制剧集 ⚠️";
      } else if (response.statusCode === 403) {
        result["Netflix"] = "<b>Netflix: </b>未支持 🚫";
      } else if (response.statusCode === 200) {
        let url = response.headers['X-Originating-URL'] || '';
        let region = url.split('/')[3] || 'US';
        region = region.split('-')[0].toUpperCase();
        if (region === 'TITLE') region = 'US';
        result["Netflix"] = "<b>Netflix: </b>完整支持" + arrow + "⟦ " + getFlag(region) + " ⟧ 🎉";
      }
      resolve();
    }, () => {
      result["Netflix"] = "<b>Netflix: </b>检测超时 🚦";
      resolve();
    });
  });
}

// ==================== ChatGPT 检测 ====================
function testChatGPT() {
  return new Promise((resolve) => {
    let option = { url: BASE_URL_GPT, opts: opts1, timeout: 4000 };
    $task.fetch(option).then(response => {
      let resp = JSON.stringify(response);
      if (resp.indexOf("text/plain") == -1) {
        let option1 = { url: Region_URL_GPT, opts: opts1, timeout: 4000 };
        $task.fetch(option1).then(response => {
          let region = response.body.split("loc=")[1].split("\n")[0].toUpperCase();
          if (support_countryCodes.includes(region)) {
            result["ChatGPT"] = "<b>ChatGPT: </b>支持" + arrow + "⟦ " + getFlag(region) + " ⟧ 🎉";
          } else {
            result["ChatGPT"] = "<b>ChatGPT: </b>未支持 (地区不匹配) 🚫";
          }
          resolve();
        }, () => {
          result["ChatGPT"] = "<b>ChatGPT: </b>检测超时 🚦";
          resolve();
        });
      } else {
        result["ChatGPT"] = "<b>ChatGPT: </b>未支持 (被安全拦截) 🚫";
        resolve();
      }
    }, () => {
      result["ChatGPT"] = "<b>ChatGPT: </b>检测超时 🚦";
      resolve();
    });
  });
}
