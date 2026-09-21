const fs = require("fs");
let content = fs.readFileSync("src/actions/auth.ts", "utf8");

// Remove the strict captcha token check
const captchaCheck = `    if (!result.data.captchaToken) {\r\n      return { success: false, message: "Captcha is required." };\r\n    }`;
const captchaCheck2 = `    if (!result.data.captchaToken) {\n      return { success: false, message: "Captcha is required." };\n    }`;

if (content.includes(captchaCheck)) {
  content = content.replace(captchaCheck, "");
  console.log("Removed CRLF captcha check");
} else if (content.includes(captchaCheck2)) {
  content = content.replace(captchaCheck2, "");
  console.log("Removed LF captcha check");
} else {
  console.log("Could not find captcha check block in auth.ts!");
}

fs.writeFileSync("src/actions/auth.ts", content);