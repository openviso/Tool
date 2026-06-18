/**
 * ==========================================
 * 脚本名称: ChatGPT & Netflix & Gemini 解锁状态三检脚本
 * 适用平台: Quantumult X (Build 598+ ONLY)
 * 脚本类型: 节点交互拨测 (event-interaction)
 * 使用说明: 绑定至策略组交互事件，切换节点时自动触发
 * ==========================================
 **/

const BASE_URL_NF = 'https://www.netflix.com/title/';
const FILM_ID = 81280792; 

const BASE_URL_GPT = 'https://chat.openai.com/';
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace'; 

// Gemini 官方最核心的鉴权边缘 API，绝无可能被第三方镜像伪造
const BASE_URL_GEMINI = 'https://alkalimera-pa.clients6.google.com/v1:skipreauth'; 

const arrow = " ➟ "; 

var opts = { policy: $environment.params };
var opts1 = { policy: $environment.params, redirection: false }; // 强制禁止重定向

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
  ["XK","🇽开"],
  ["YE","🇾🇪"],["YT","🇾🇹"],
  ["ZA","🇿🇦"],["ZM","🇿🇲"],["ZW","🇿🇼"]
]);

const support_countryCodes = ["US","TW","HK","SG","JP","KR","GB","FR","DE","CA","AU","IT","ES","CH","NL","IE","NZ","MY"];

let result = {
  "title": '    🤖  服务解锁查询',
  "Netflix": '<b>Netflix: </b>检测失败，请重试 ❗️',
  "ChatGPT" : '<b>ChatGPT: </b>检测失败，请重试 ❗️',
  "Gemini" : '<b>Gemini: </b>检测失败，请重试 ❗️'
};

const message = {
  action: "get_policy_state",
  content: $environment.params
};

;(async () => {
  await Promise.all([testNf(FILM_ID), testChatGPT(), testGemini()]);

  $configuration.sendMessage(message).then(resolve => {
    let output = $environment.params;
    if (resolve.ret && resolve.ret[message.content]) {
      output = JSON.stringify(resolve.ret[message.content]).replace(/\"|\[|\]/g,"").replace(/\,/g," ➟ ");
    }
    
    let content = "--------------------------------------</br>" + [result["ChatGPT"], result["Gemini"], result["Netflix"]].join("</br></br>");
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

function getFlag(code) {
  if (!code) return "🏳️";
  let flag = flags.get(code.toUpperCase());
  return flag ? flag : code.toUpperCase();
}

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

/**
 * 【精准修正版：Gemini 专属鉴权链路嗅探】
 */
function testGemini() {
  return new Promise((resolve) => {
    let option = {
      url: BASE_URL_GEMINI,
      opts: opts1, // 关键点：使用 opts1 彻底掐断 302 重定向跟随
      timeout: 4000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    };
    
    $task.fetch(option).then(response => {
      // 1. 真正高纯度、未送中的准入区域节点，会在此特定接口拿到标准的 400 报错（证明成功触达核心鉴权）
      if (response.statusCode === 400) {
        result["Gemini"] = "<b>Gemini: </b>支持 🎉";
      } 
      // 2. 被拒绝（403）或被法律政策拦截（451）
      else if (response.statusCode === 403 || response.statusCode === 451) {
        result["Gemini"] = "<b>Gemini: </b>未支持 🚫";
      } 
      // 3. 捕捉到了 302/301 重定向跳转（说明 IP 被送中去验证码页或香港主页了）
      else if (response.statusCode === 301 || response.statusCode === 302) {
        result["Gemini"] = "<b>Gemini: </b>未支持 (地理位置偏移) 🚫";
      } 
      else {
        result["Gemini"] = "<b>Gemini: </b>未支持 🚫";
      }
      resolve();
    }, () => {
      result["Gemini"] = "<b>Gemini: </b>检测超时 🚦";
      resolve();
    });
  });
}
