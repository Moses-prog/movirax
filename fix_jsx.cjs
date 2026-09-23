const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

content = content.replace(
  /                  <Switch isSelected=\{isKids\} onValueChange=\{setIsKids\} color="danger" \/>\n                  <\/div>\n\n                  <Input [\s\S]*?\/>\n                <\/div>\n              <\/ModalBody>/,
  `                  <Switch isSelected={isKids} onValueChange={setIsKids} color="danger" />\n                  </div>\n                  <Input \n                    label="Profile PIN (Optional)" \n                    placeholder="Enter 4-digit PIN to lock" \n                    type="password"\n                    maxLength={4}\n                    inputMode="numeric"\n                    value={newPin} \n                    onChange={(e) => setNewPin(e.target.value.replace(/\\D/g, ''))}\n                    classNames={{ inputWrapper: "bg-white/5 border border-white/10 focus-within:border-red-500/50" }}\n                  />\n                </ModalBody>`
);

content = content.replace(
  /                  <Switch isSelected=\{editIsKids\} onValueChange=\{setEditIsKids\} color="danger" \/>\n                  <\/div>\n\n                  <Input [\s\S]*?\/>\n                <\/div>\n              <\/ModalBody>/,
  `                  <Switch isSelected={editIsKids} onValueChange={setEditIsKids} color="danger" />\n                  </div>\n                  <Input \n                    label="Profile PIN (Optional)" \n                    placeholder="Leave empty to remove PIN" \n                    type="password"\n                    maxLength={4}\n                    inputMode="numeric"\n                    value={editPin} \n                    onChange={(e) => setEditPin(e.target.value.replace(/\\D/g, ''))}\n                    classNames={{ inputWrapper: "bg-white/5 border border-white/10 focus-within:border-red-500/50" }}\n                  />\n                </ModalBody>`
);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Fixed JSX syntax");