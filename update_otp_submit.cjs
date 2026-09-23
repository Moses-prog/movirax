const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

let newOtpOnChange = `onValueChange={(val) => {
                        setEnteredPin(val);
                        setPinError(false);
                        if (val.length === 4) {
                          setTimeout(() => {
                            if (selectedLockedProfile?.pin === val) {
                              onClose();
                              if (isEditingMode) {
                                openEditModalForProfile(selectedLockedProfile);
                              } else {
                                setActiveProfile(selectedLockedProfile);
                                router.push('/');
                                router.refresh();
                              }
                            } else {
                              setPinError(true);
                            }
                          }, 300);
                        }
                      }}`;

content = content.replace(/onValueChange=\{\(val\) => \{[\s\S]*?\}, 300\);\n                        \}\n                      \}\}/, newOtpOnChange);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Fixed auto-submit for Edit Mode");