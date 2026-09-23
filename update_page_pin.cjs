const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

// State
content = content.replace(
  /const \[enteredPin, setEnteredPin\] = useState\(''\);\n  const \[pinError, setPinError\] = useState\(false\);/,
  `const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);`
);

// Unlock modal replacement
let oldUnlockModalBody = `<ModalBody className="py-6 flex flex-col items-center">
                <InputOtp 
                  length={4}
                  value={enteredPin}
                  onValueChange={(val) => {
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
                  }}
                  isInvalid={pinError}
                  errorMessage={pinError ? "Incorrect PIN" : ""}
                  autoFocus
                  classNames={{
                    segmentWrapper: "gap-x-4",
                    segment: "w-14 h-14 rounded-full border-2 border-white/20 data-[active=true]:border-primary text-xl font-bold bg-white/5",
                  }}
                />
              </ModalBody>`;

let newUnlockModalBody = `<ModalBody className="py-6 flex flex-col items-center">
                {isLockedOut ? (
                  <p className="text-danger font-bold text-center">Too many attempts. Please try again later.</p>
                ) : (
                  <>
                    <InputOtp 
                      length={4}
                      value={enteredPin}
                      onValueChange={(val) => {
                        setEnteredPin(val);
                        setPinError(false);
                        if (val.length === 4) {
                          setTimeout(() => {
                            if (selectedLockedProfile?.pin === val) {
                              setPinAttempts(0);
                              onClose();
                              if (isEditingMode) {
                                openEditModalForProfile(selectedLockedProfile);
                              } else {
                                setActiveProfile(selectedLockedProfile);
                                router.push('/');
                                router.refresh();
                              }
                            } else {
                              const newAttempts = pinAttempts + 1;
                              setPinAttempts(newAttempts);
                              setPinError(true);
                              if (newAttempts >= 5) {
                                setIsLockedOut(true);
                                setTimeout(() => {
                                  setIsLockedOut(false);
                                  setPinAttempts(0);
                                  onClose();
                                }, 60000); // 1 minute lockout
                              }
                            }
                          }, 300);
                        }
                      }}
                      isInvalid={pinError}
                      errorMessage={pinError ? "Incorrect PIN" : ""}
                      autoFocus
                      classNames={{
                        segmentWrapper: "gap-x-4",
                        segment: "w-14 h-14 rounded-full border-2 border-white/20 data-[active=true]:border-primary text-xl font-bold bg-white/5",
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-4">
                      {5 - pinAttempts} attempts remaining
                    </p>
                  </>
                )}
              </ModalBody>`;

content = content.replace(oldUnlockModalBody, newUnlockModalBody);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Added rate limiting to Profiles page");