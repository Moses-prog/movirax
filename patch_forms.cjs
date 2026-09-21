const fs = require("fs");
const files = [
  "src/components/sections/Auth/Login.tsx",
  "src/components/sections/Auth/Register.tsx",
  "src/components/sections/Auth/ForgotPassword.tsx",
  "src/components/sections/Auth/ResetPassword.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(
    "if (isEmpty(data.captchaToken)) {",
    "if (env.NEXT_PUBLIC_CAPTCHA_SITE_KEY && isEmpty(data.captchaToken)) {"
  );
  fs.writeFileSync(file, content);
  console.log(`Patched ${file}`);
}