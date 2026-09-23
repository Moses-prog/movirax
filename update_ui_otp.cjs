const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

if (!content.includes("InputOtp")) {
  content = content.replace(
    /import \{ Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, addToast \} from '@heroui\/react';/,
    `import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input, InputOtp, addToast } from '@heroui/react';`
  );
}

// Replace the unlock Input with InputOtp
let otpUnlock = `                  <div className="flex justify-center w-full">
                    <InputOtp 
                      length={4}
                      value={enteredPin}
                      onValueChange={(val) => {
                        setEnteredPin(val);
                        setPinError(false);
                        if (val.length === 4) {
                          // Auto submit when 4 digits are entered
                          setTimeout(() => {
                            if (selectedLockedProfile?.pin === val) {
                              setActiveProfile(selectedLockedProfile);
                              onClose();
                              router.push('/');
                              router.refresh();
                            } else {
                              setPinError(true);
                            }
                          }, 300);
                        }
                      }}
                      isInvalid={pinError}
                      errorMessage={pinError ? "Incorrect PIN" : ""}
                      autoFocus
                      size="lg"
                    />
                  </div>`;

content = content.replace(
  /<Input \n\s*type="password"\n\s*maxLength=\{4\}\n\s*inputMode="numeric"\n\s*placeholder="Enter 4-digit PIN"\n\s*value=\{enteredPin\}[\s\S]*?autoFocus\n\s*\/>/,
  otpUnlock
);

// Replace the Edit/Add Pin Inputs with InputOtp
let otpEdit = `                  <div className="flex flex-col items-start p-4 bg-white/5 rounded-xl border border-white/5 mt-2 gap-3">
                    <div className="w-full">
                      <p className="font-bold">Profile PIN Lock</p>
                      <p className="text-xs text-muted-foreground">Require a 4-digit PIN to access this profile.</p>
                    </div>
                    <InputOtp 
                      length={4}
                      value={editPin}
                      onValueChange={(val) => setEditPin(val)}
                      size="md"
                    />
                  </div>`;

content = content.replace(
  /<Input \n\s*label="Profile PIN \(Optional\)" \n\s*placeholder="Leave empty to remove PIN" [\s\S]*?\/>/,
  otpEdit
);

let otpAdd = `                  <div className="flex flex-col items-start p-4 bg-white/5 rounded-xl border border-white/5 mt-2 gap-3">
                    <div className="w-full">
                      <p className="font-bold">Profile PIN Lock</p>
                      <p className="text-xs text-muted-foreground">Require a 4-digit PIN to access this profile.</p>
                    </div>
                    <InputOtp 
                      length={4}
                      value={newPin}
                      onValueChange={(val) => setNewPin(val)}
                      size="md"
                    />
                  </div>`;

content = content.replace(
  /<Input \n\s*label="Profile PIN \(Optional\)" \n\s*placeholder="Enter 4-digit PIN to lock" [\s\S]*?\/>/,
  otpAdd
);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Replaced with InputOtp");