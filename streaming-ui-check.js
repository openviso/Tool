/**
 * ==========================================
 * 脚本名称: ChatGPT & Netflix 解锁状态双检脚本
 * 适用平台: Quantumult X (Build 598+ ONLY)
 * 脚本类型: 节点交互拨测 (event-interaction)
 * 使用说明: 绑定至策略组交互事件，切换节点时自动触发
 * ==========================================
 **/

// ==========================================
// 1. 全局常量与测试端点配置 (Constants & Endpoints)
// ==========================================
const BASE_URL_NF = 'https://www.netflix.com/title/';
const FILM_ID = 81280792; // 具有严格区域版权限制的特定 Netflix 影片 ID (用于检测是否完整解锁)

const BASE_URL_GPT = 'https://chat.openai.com/';
const Region_URL_GPT = 'https://chat.openai.com/cdn-cgi/trace'; // Cloudflare 边缘诊断页

const arrow = " ➟ "; // UI 箭头分隔符

// ==========================================
// 2. 网络请求上下文配置 (Network Options)
// ==========================================
// $environment.params 会动态传入用户当前在 UI 中选中的“节点名称”，确保流量走对应的代理
var opts = { 
  policy: $environment.params 
};

// opts1 关闭了 HTTP 自动重定向 (redirection: false)，专门用来捕捉 302 临时跳转状态
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
  ["KE","🇰🇪"],["KG","🇰🇬"],["KH","🇰🇭"],["KI","🇰🇮"],["KM","🇰🇲"],["KN","KN"],["KP","🇰🇵"],["KR","🇰🇷"],["KW","🇰🇼"],["KY","🇰🇾"],["KZ","KZ"],
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

// OpenAI 官方明文支持 ChatGPT 服务的常见国家/地区列表
const support_countryCodes = ["US","TW","HK","SG","JP","KR","GB","FR","DE","CA","AU","IT","ES","CH","NL","IE","NZ","MY"];

// 默认响应状态模板 (网络卡顿或异常时的后备状态)
let result = {
  "title": '    🤖  服务解锁查询',
  "Netflix": '<b>Netflix: </b>检测失败，请重试 ❗️',
  "ChatGPT" : '<b>ChatGPT: </b>检测失败，请重试 ❗️'
};

// 向 QX 内核请求解析当前完整策略树的通讯载荷
const message = {
  action: "get_policy_state",
  content: $environment.params
};

// ==========================================
// 4. 异步控制中心与主流程驱动 (Main Orchestrator)
// ==========================================
;(async () => {
  // 【多路齐发】并行启动 Netflix 与 ChatGPT 探测
  await Promise.all([testNf(FILM_ID), testChatGPT()]);

  // 向内核查询策略链
  $configuration.sendMessage(message).then(resolve => {
    let output = $environment.params; // 默认采用当前策略名兜底
    if (resolve.ret && resolve.ret[message.content]) {
      // 格式化输出策略树路径
      output = JSON.stringify(resolve.ret[message.content]).replace(/\"|\[|\]/g,"").replace(/\,/g," ➟ ");
    }
    
    // 【UI 视图装配】排版面板中仅组合展示 ChatGPT 和 Netflix 的结果
    let content = "--------------------------------------</br>" + [result["ChatGPT"], result["Netflix"]].join("</br></br>");
    content = content + "</br>--------------------------------------</br>" + "<font color=#CD5C5C>" + "<b>节点</b> ➟ " + output + "</font>";
    content = `<p style="text-align: center; font-family: -apple-system; font-size: large; font-weight: thin">` + content + `</p>`;
    
    // 回传数据至 Quantumult X 渲染 UI 视图
    $done({"title": result["title"], "htmlMessage": content});
  }, reject => {
    $done();
  });  
})()
.catch(() => {
  // 顶层未捕获异常的全局防死锁兜底
  $done({"title": result["title"], "htmlMessage": `<p style="text-align: center;">----------------------</br></br>🚥 检测异常</br></br>----------------------</p>`});
});

// ==========================================
// 5. 工具函数模块 (Utility Functions)
// ==========================================
/**
 * 国家代码转 Emoji 国旗工具函数
 * @param {string} code - 两个字母的国家代码缩写 (如 'US')
 * @returns {string} 对应的 Emoji 旗帜或原文本
 */
function getFlag(code) {
  if (!code) return "🏳️";
  let flag = flags.get(code.toUpperCase());
  return flag ? flag : code.toUpperCase(); // 若找不到映射则直接输出原大写代码
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
      timeout: 4000, // 4秒超时硬断开
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    };
    
    $task.fetch(option).then(response => {
      if (response.statusCode === 404) {
        result["Netflix"] = "<b>Netflix: </b>支持自制剧集 ⚠️";
      } else if (response.statusCode === 403) {
        result["Netflix"] = "<b>Netflix: </b>未支持 🚫";
      } else if (response.statusCode === 200) {
        // 从响应头拿到重定向后的最终归属 URL 路径
        let url = response.headers['X-Originating-URL'] || '';
        let region = url.split('/')[3] || 'US'; // 截取域名后的第一级路径
        region = region.split('-')[0].toUpperCase();
        if (region === 'TITLE') region = 'US'; // 特殊处理：直接到主站未重定向则代表美区
        
        result["Netflix"] = "<b>Netflix: </b>完整支持" + arrow + "⟦ " + getFlag(region) + " ⟧ 🎉";
      }
      resolve(); // 释放当前 Promise
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
    
    // 第一步：初探主页
    $task.fetch(option).then(response => {
      let resp = JSON.stringify(response);
      
      // text/plain 说明被 Cloudflare 防火墙或验证码页拦截
      if (resp.indexOf("text/plain") == -1) {
        let option1 = { url: Region_URL_GPT, opts: opts1, timeout: 4000 };
        
        // 第二步：通过边缘节点诊断拉取真实定位
        $task.fetch(option1).then(response => {
          // 切割解析文本中的 "loc=XX" 属性
          let region = response.body.split("loc=")[1].split("\n")[0].toUpperCase();
          
          // 检查解析出的定位是否在官方准入白名单中
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
