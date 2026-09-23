const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

let addPinInput = `
                  <Input 
                    label="Profile PIN (Optional)" 
                    placeholder="Enter 4-digit PIN to lock" 
                    type="password"
                    maxLength={4}
                    inputMode="numeric"
                    value={newPin} 
                    onChange={(e) => setNewPin(e.target.value.replace(/\\D/g, ''))}
                    classNames={{ inputWrapper: "bg-white/5 border border-white/10 focus-within:border-red-500/50" }}
                  />`;

content = content.replace(
  /<Switch isSelected=\{isKids\} onValueChange=\{setIsKids\} color="danger" \/>/,
  `<Switch isSelected={isKids} onValueChange={setIsKids} color="danger" />\n                  </div>\n` + addPinInput
);

let editPinInput = `
                  <Input 
                    label="Profile PIN (Optional)" 
                    placeholder="Leave empty to remove PIN" 
                    type="password"
                    maxLength={4}
                    inputMode="numeric"
                    value={editPin} 
                    onChange={(e) => setEditPin(e.target.value.replace(/\\D/g, ''))}
                    classNames={{ inputWrapper: "bg-white/5 border border-white/10 focus-within:border-red-500/50" }}
                  />`;

content = content.replace(
  /<Switch isSelected=\{editIsKids\} onValueChange=\{setEditIsKids\} color="danger" \/>/,
  `<Switch isSelected={editIsKids} onValueChange={setEditIsKids} color="danger" />\n                  </div>\n` + editPinInput
);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Added PIN inputs successfully");