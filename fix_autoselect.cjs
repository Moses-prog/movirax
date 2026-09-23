const fs = require("fs");
let content = fs.readFileSync("src/contexts/ProfileContext.tsx", "utf8");

let oldCode = `          } else if (profilesJson.data.length === 1) {
            // Auto select if only 1
            setActiveProfileState(profilesJson.data[0]);
            Cookies.set('movira_active_profile', profilesJson.data[0].id, { expires: 365 });
          }`;

let newCode = `          } else if (profilesJson.data.length === 1 && !profilesJson.data[0].pin) {
            // Auto select if only 1 AND it is not locked with a PIN
            setActiveProfileState(profilesJson.data[0]);
            Cookies.set('movira_active_profile', profilesJson.data[0].id, { expires: 365 });
          }`;

content = content.replace(oldCode, newCode);

fs.writeFileSync("src/contexts/ProfileContext.tsx", content);
console.log("Fixed auto-select bug for locked profiles");