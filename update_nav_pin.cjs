const fs = require("fs");
let content = fs.readFileSync("src/components/ui/button/UserProfileButton.tsx", "utf8");

// Imports
content = content.replace(
  /import \{\n  addToast,\n  Avatar,\n  Button,\n  Dropdown,\n  DropdownItem,\n  DropdownMenu,\n  DropdownTrigger,\n  Spinner,\n\} from "@heroui\/react";/,
  `import {
  addToast,
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  InputOtp
} from "@heroui/react";`
);

// State
content = content.replace(
  /const \{ mobile, desktop \} = useBreakpoints\(\);/,
  `const { mobile, desktop } = useBreakpoints();
  const { isOpen: isPinOpen, onOpen: onPinOpen, onOpenChange: onPinOpenChange, onClose: onPinClose } = useDisclosure();
  const [selectedLockedProfile, setSelectedLockedProfile] = useState<any>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);`
);

// Press handler
let oldPress = `                onPress={() => {
                  if (activeProfile?.id === p.id) return;
                  if (p.pin) {
                    // Route to profiles page to enforce PIN check
                    window.location.href = '/profiles';
                  } else {
                    setActiveProfile(p);
                    window.location.href = '/';
                  }
                }}`;

let newPress = `                onPress={() => {
                  if (activeProfile?.id === p.id) return;
                  if (p.pin) {
                    setSelectedLockedProfile(p);
                    setEnteredPin('');
                    setPinError(false);
                    onPinOpen();
                  } else {
                    setActiveProfile(p);
                    window.location.href = '/';
                  }
                }}`;

content = content.replace(oldPress, newPress);

// Modal
let modalCode = `
      {/* PIN Unlock Modal for Quick Switch */}
      <Modal isOpen={isPinOpen} onOpenChange={onPinOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-content1/90 backdrop-blur-md border border-white/10 shadow-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center pb-0 mt-4">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-primary/20 bg-white/5">
                  <img src={selectedLockedProfile?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                Enter PIN for {selectedLockedProfile?.name}
              </ModalHeader>
              <ModalBody className="py-6 flex flex-col items-center">
                {isLockedOut ? (
                  <p className="text-danger font-bold">Too many attempts. Please try again later.</p>
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
                              setPinAttempts(0); // reset
                              onClose();
                              setActiveProfile(selectedLockedProfile);
                              window.location.href = '/';
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
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose} className="w-full">
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
`;

content = content.replace(/    <\/>\n  \);\n\};\n\nexport default UserProfileButton;/, '    </>\n' + modalCode + '  );\n};\n\nexport default UserProfileButton;');

fs.writeFileSync("src/components/ui/button/UserProfileButton.tsx", content);
console.log("Added inline modal and rate limiting to UserProfileButton");