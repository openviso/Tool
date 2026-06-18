/**
 * ==========================================
 * 脚本名称: ChatGPT & Netflix & Gemini 解锁状态三检脚本
 * 适用平台: Quantumult X (Build 598+ ONLY)
 * 脚本类型: 节点交互拨测 (event-interaction)
 * 使用说明: 绑定至策略组交互事件，切换节点时自动触发
 * ==========================================
 **/

// ==========================================
// 1. 全局常量与测试端点配置 (Constants & Endpoints)
// ==========================================
const BASE_URL_NF = 'https://www.netflix.com/title/';
const FILM_ID = 81280792; // 具有严格区域版权限制的特定 Netflix 影片 ID

const BASE_URL_GPT = 'https://chat.openai.com/';
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace'; // Cloudflare 边缘诊断页

const BASE_URL_GEMINI = 'https://alkalimera-pa.clients6.google.com/v1:skipreauth'; // Gemini 边缘服务拨测点

const arrow = " ➟ "; // UI 箭头分隔符

// ==========================================
// 2. 网络请求上下文配置 (Network Options)
// ==========================================
var opts = { 
  policy: $environment.params 
};

var opts1 = { 
  policy: $environment.params, 
  redirection: false 
};

// ==========================================
// 3. 经典国旗 Emoji 映射表 (Emoji Flags Map)
// ==========================================
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

// OpenAI 官方明文支持 ChatGPT 服务的常见国家/地区列表
const support_countryCodes = ["US","TW","HK","SG","JP","KR","GB","FR","DE","CA","AU","IT","ES","CH","NL","IE","NZ","MY"];

// 默认响应状态模板
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

// ==========================================
// 4. 异步控制中心与主流程驱动 (Main Orchestrator)
// ==========================================
;(async () => {
  // 并行启动 Netflix、ChatGPT 和 Gemini 探测
  await Promise.all([testNf(FILM_ID), testChatGPT(), testGemini()]);

  // 向内核查询策略链
  $configuration.sendMessage(message).then(resolve => {
    let output = $environment.params;
    if (resolve.ret && resolve.ret[message.content]) {
      output = JSON.stringify(resolve.ret[message.content]).replace(/\"|\[|\]/g,"").replace(/\,/g," ➟ ");
    }
    
    // 【UI 视图装配】按顺序组合展示 ChatGPT、Gemini 和 Netflix
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

// ==========================================
// 5. 工具函数模块 (Utility Functions)
// ==========================================
function getFlag(code) {
  if (!code) return "🏳️";
  let flag = flags.get(code.toUpperCase());
  return flag ? flag : code.toUpperCase();
}

// ==========================================
// 6. 核心业务检测模块 (Core Business Logic)
// ==========================================

/**
 * 【模块一：Netflix 区域解锁能力拨测】
 */
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

/**
 * 【模块二：ChatGPT / OpenAI 访问权限拨测】
 */
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
 * 【模块三：Gemini / Google AI 访问权限拨测】
 */
/**
 * 【核心业务修正：Gemini 专属精准拨测】
 * 探测 Gemini 核心鉴权边缘节点，带上特定的语言请求头，防止被 Google 误判
 */
function testGemini() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://alkalimera-pa.clients6.google.com/v1:skipreauth',
      opts: opts1, // 使用禁止重定向的配置，精准捕捉 403 / 451 状态
      timeout: 4000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9' // 强制声明英文语言环境，绕过部分语义拦截
      }
    };
    
    $task.fetch(option).then(response => {
      // 携带空凭证访问该接口时：
      // 1. 准入区域的合规节点：Google 会正常响应并返回 400 Bad Request（证明接口通路完好）
      // 2. 封锁区域（如中国大陆、香港等）：Google 会直接拒绝并返回 403 Forbidden 或 451
      if (response.statusCode === 400) {
        result["Gemini"] = "<b>Gemini: </b>支持 🎉";
      } else if (response.statusCode === 403 || response.statusCode === 451) {
        result["Gemini"] = "<b>Gemini: </b>未支持 🚫";
      } else {
        // 捕捉可能存在的 302 重定向（比如送中后跳转到 google.com.hk）
        result["Gemini"] = "<b>Gemini: </b>未支持 (区域受限) 🚫";
      }
      resolve();
    }, () => {
      result["Gemini"] = "<b>Gemini: </b>检测超时 🚦";
      resolve();
    });
  });
}
