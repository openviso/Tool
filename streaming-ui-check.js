/**
 * ==========================================
 * 脚本名称: 流媒体 & AI 服务解锁多核心精准检测脚本
 * 适用平台: Quantumult X (Build 598+ 交互事件绑定)
 * 脚本说明: 适配自全能检测脚本底层的 API 拨测逻辑，修正 QX 异步网络握手机制
 * ==========================================
 **/

const arrow = " ➟ ";
const support_countryCodes = ["US","TW","HK","SG","JP","KR","GB","FR","DE","CA","AU","IT","ES","CH","NL","IE","NZ","MY"];

// 策略组注入参数
var opts = { policy: $environment.params };
var optsNoRedirect = { policy: $environment.params, redirection: false };

let result = {
  "title": '    🤖  服务解锁查询',
  "ChatGPT" : '<b>ChatGPT: </b>检测失败，请重试 ❗️',
  "Gemini"  : '<b>Gemini: </b>检测失败，请重试 ❗️',
  "Claude"  : '<b>Claude: </b>检测失败，请重试 ❗️',
  "Netflix" : '<b>Netflix: </b>检测失败，请重试 ❗️',
  "Disney"  : '<b>Disney+: </b>检测失败，请重试 ❗️',
  "YouTube" : '<b>YouTube Premium: </b>检测失败 ❗️',
  "TikTok"  : '<b>TikTok: </b>检测失败，请重试 ❗️'
};

const message = {
  action: "get_policy_state",
  content: $environment.params
};

// 预定义国旗
var flags = new Map([
  ["US","🇺🇸"],["TW","🇨🇳"],["HK","🇭🇰"],["SG","🇸🇬"],["JP","🇯🇵"],["KR","🇰🇷"],["GB","🇬🇧"],["FR","🇫🇷"],["DE","🇩🇪"],["CA","🇨🇦"],["AU","🇦🇺"]
]);

function getFlag(code) {
  if (!code) return "🏳️";
  let flag = flags.get(code.toUpperCase());
  return flag ? flag : code.toUpperCase();
}

;(async () => {
  // 并行执行所有的探测任务，极大提升交互切换速度
  await Promise.all([
    testChatGPT(),
    testGemini(),
    testClaude(),
    testNetflix(),
    testDisneyPlus(),
    testYouTubePremium(),
    testTikTok()
  ]);

  $configuration.sendMessage(message).then(resolve => {
    let output = $environment.params;
    if (resolve.ret && resolve.ret[message.content]) {
      output = JSON.stringify(resolve.ret[message.content]).replace(/\"|\[|\]/g,"").replace(/\,/g," ➟ ");
    }
    
    // 渲染 UI 格式化文本
    let content = "--------------------------------------</br>" + 
                  [result["ChatGPT"], result["Gemini"], result["Claude"], result["Netflix"], result["Disney"], result["YouTube"], result["TikTok"]].join("</br></br>");
    content = content + "</br>--------------------------------------</br>" + "<font color=#CD5C5C>" + "<b>当前节点</b> ➟ " + output + "</font>";
    content = `<p style="text-align: center; font-family: -apple-system; font-size: medium; font-weight: thin">` + content + `</p>`;
    
    $done({"title": result["title"], "htmlMessage": content});
  }, reject => {
    $done();
  });  
})()
.catch(() => {
  $done({"title": result["title"], "htmlMessage": `<p style="text-align: center;">----------------------</br></br>🚥 脚本拨测执行异常</br></br>----------------------</p>`});
});

/* ==================== 1. AI 服务检测板块 ==================== */

function testChatGPT() {
  return new Promise((resolve) => {
    // 优先采用 Cloudflare CDN Trace 获取真实准入地区
    let option = { url: 'https://chat.openai.com/cdn-cgi/trace', opts: optsNoRedirect, timeout: 3500 };
    $task.fetch(option).then(response => {
      if (response.body && response.body.indexOf("loc=") !== -1) {
        let region = response.body.split("loc=")[1].split("\n")[0].toUpperCase();
        if (support_countryCodes.includes(region)) {
          result["ChatGPT"] = "<b>ChatGPT: </b>完全解锁" + arrow + "⟦ " + getFlag(region) + " ⟧ 🎉";
        } else {
          result["ChatGPT"] = "<b>ChatGPT: </b>未支持 (地区不匹配) 🚫";
        }
      } else {
        result["ChatGPT"] = "<b>ChatGPT: </b>未支持 (被安全拦截) 🚫";
      }
      resolve();
    }, () => {
      result["ChatGPT"] = "<b>ChatGPT: </b>检测超时 🚦";
      resolve();
    });
  });
}

function testGemini() {
  return new Promise((resolve) => {
    // 剥离自官方初始化链路的核心鉴权边缘节点，严禁重定向防送中
    let option = {
      url: 'https://alkalimera-pa.clients6.google.com/v1:skipreauth',
      opts: optsNoRedirect,
      timeout: 3500,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    };
    $task.fetch(option).then(response => {
      // 完美的未送中节点在没有 Token 时，此处核心接口必然返回 400 Bad Request
      if (response.statusCode === 400) {
        result["Gemini"] = "<b>Gemini: </b>完全解锁 🎉";
      } else if (response.statusCode === 403 || response.statusCode === 451) {
        result["Gemini"] = "<b>Gemini: </b>未支持 🚫";
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        result["Gemini"] = "<b>Gemini: </b>未支持 (地理位置偏移/送中) 🚫";
      } else {
        result["Gemini"] = "<b>Gemini: </b>未支持 (错误码 " + response.statusCode + ") 🚫";
      }
      resolve();
    }, () => {
      result["Gemini"] = "<b>Gemini: </b>检测超时 🚦";
      resolve();
    });
  });
}

function testClaude() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://claude.ai/login',
      opts: optsNoRedirect,
      timeout: 3500,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    };
    $task.fetch(option).then(response => {
      // 如果未准入，Anthropic 会强制 307 重定向到 /illegal-location
      if (response.statusCode === 200) {
        result["Claude"] = "<b>Claude: </b>完全解锁 🎉";
      } else if (response.statusCode === 307 || response.statusCode === 302) {
        result["Claude"] = "<b>Claude: </b>未支持 (地区受限) 🚫";
      } else {
        result["Claude"] = "<b>Claude: </b>未支持 🚫";
      }
      resolve();
    }, () => {
      result["Claude"] = "<b>Claude: </b>检测超时 🚦";
      resolve();
    });
  });
}

/* ==================== 2. 国际流媒体检测板块 ==================== */

function testNetflix() {
  return new Promise((resolve) => {
    // 探测非自制剧经典 ID
    let option = {
      url: 'https://www.netflix.com/title/70143836',
      opts: optsNoRedirect,
      timeout: 3500,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    };
    $task.fetch(option).then(response => {
      if (response.statusCode === 200) {
        result["Netflix"] = "<b>Netflix: </b>完整解锁 🎉";
      } else if (response.statusCode === 404) {
        result["Netflix"] = "<b>Netflix: </b>仅支持自制剧 (Originals) ⚠️";
      } else if (response.statusCode === 403) {
        result["Netflix"] = "<b>Netflix: </b>未支持 (已被屏蔽) 🚫";
      } else {
        result["Netflix"] = "<b>Netflix: </b>检测失败 (HTTP " + response.statusCode + ") ❗️";
      }
      resolve();
    }, () => {
      result["Netflix"] = "<b>Netflix: </b>检测超时 🚦";
      resolve();
    });
  });
}

function testDisneyPlus() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://disney.api.edge.bamgrid.com/devices',
      method: 'POST',
      opts: opts,
      timeout: 3500,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'authorization': 'ZGlzbmV5JmJyb3dzZXImMS4wLjA.Cu56AgSfBTDag5NiRA81oLHkDZfu5L3CKadnefEAY84'
      },
      body: JSON.stringify({"deviceFamily":"browser","applicationRuntime":"chrome","deviceProfile":"windows","attributes":{}})
    };
    $task.fetch(option).then(response => {
      if (response.body && response.body.indexOf("assertion") !== -1) {
        result["Disney"] = "<b>Disney+: </b>完全解锁 🎉";
      } else if (response.body && (response.body.indexOf("ip-country-blocked") !== -1 || response.body.indexOf("GEO_BLOCKED") !== -1)) {
        result["Disney"] = "<b>Disney+: </b>地区不受支持 🚫";
      } else {
        result["Disney"] = "<b>Disney+: </b>未支持 🚫";
      }
      resolve();
    }, () => {
      result["Disney"] = "<b>Disney+: </b>检测超时 🚦";
      resolve();
    });
  });
}

function testYouTubePremium() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://www.youtube.com/premium',
      opts: opts,
      timeout: 3500,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    };
    $task.fetch(option).then(response => {
      if (response.body && (response.body.indexOf("NotAvailable") !== -1 || response.body.indexOf("not available in your country") !== -1)) {
        result["YouTube"] = "<b>YouTube Premium: </b>地区不支持 🚫";
      } else if (response.body && (response.body.indexOf("Premium") !== -1 || response.body.indexOf("youtubepremium") !== -1)) {
        result["YouTube"] = "<b>YouTube Premium: </b>完全解锁 🎉";
      } else {
        result["YouTube"] = "<b>YouTube Premium: </b>检测失败 ❗️";
      }
      resolve();
    }, () => {
      result["YouTube"] = "<b>YouTube Premium: </b>检测超时 🚦";
      resolve();
    });
  });
}

function testTikTok() {
  return new Promise((resolve) => {
    let option = {
      url: 'https://www.tiktok.com/',
      opts: optsNoRedirect,
      timeout: 3500,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    };
    $task.fetch(option).then(response => {
      if (response.statusCode === 200 || response.statusCode === 301) {
        result["TikTok"] = "<b>TikTok: </b>完全解锁 🎉";
      } else if (response.statusCode === 403) {
        result["TikTok"] = "<b>TikTok: </b>未支持 (已被屏蔽) 🚫";
      } else {
        result["TikTok"] = "<b>TikTok: </b>未支持 🚫";
      }
      resolve();
    }, () => {
      result["TikTok"] = "<b>TikTok: </b>检测超时 🚦";
      resolve();
    });
  });
}
