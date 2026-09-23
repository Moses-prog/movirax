const fs = require("fs");
let content = fs.readFileSync("src/actions/auth.ts", "utf8");

content = content.replace(
  /import \{ cookies \} from "next\/headers";/,
  `import { cookies, headers } from "next/headers";`
);

let oldResetAction = `const sendResetPasswordEmailAction: AuthAction<ForgotPasswordFormInput> = async (
  data,
  supabase,
) => {
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    captchaToken: data.captchaToken,
  });`;

let newResetAction = `const sendResetPasswordEmailAction: AuthAction<ForgotPasswordFormInput> = async (
  data,
  supabase,
) => {
  const origin = (await headers()).get("origin") || "";
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    captchaToken: data.captchaToken,
    redirectTo: \`\${origin}/api/auth/confirm?next=/auth/reset-password\`,
  });`;

content = content.replace(oldResetAction, newResetAction);

fs.writeFileSync("src/actions/auth.ts", content);
console.log("Updated sendResetPasswordEmailAction with redirectTo");