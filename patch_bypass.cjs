const fs = require("fs");
let content = fs.readFileSync("src/components/ui/button/UserProfileButton.tsx", "utf8");

let oldPress = `                onPress={() => {
                  if (activeProfile?.id === p.id) return;
                  setActiveProfile(p);
                  window.location.href = '/';
                }}`;

let newPress = `                onPress={() => {
                  if (activeProfile?.id === p.id) return;
                  if (p.pin) {
                    // Route to profiles page to enforce PIN check
                    window.location.href = '/profiles';
                  } else {
                    setActiveProfile(p);
                    window.location.href = '/';
                  }
                }}`;

content = content.replace(oldPress, newPress);

fs.writeFileSync("src/components/ui/button/UserProfileButton.tsx", content);
console.log("Patched PIN bypass vulnerability");