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
                  />`;

content = content.replace(
  /<Switch isSelected=\{isKids\} onValueChange=\{setIsKids\} color="primary">/,
  addPinInput + `\n                  <Switch isSelected={isKids} onValueChange={setIsKids} color="primary">`
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
                  />`;

content = content.replace(
  /<Switch isSelected=\{editIsKids\} onValueChange=\{setEditIsKids\} color="primary">/,
  editPinInput + `\n                  <Switch isSelected={editIsKids} onValueChange={setEditIsKids} color="primary">`
);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Applied Phase 2 replacements");