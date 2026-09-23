const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

// State
content = content.replace(
  /const \[isKids, setIsKids\] = useState\(false\);/,
  `const [isKids, setIsKids] = useState(false);\n  const [newPin, setNewPin] = useState('');`
);
content = content.replace(
  /const \[editIsKids, setEditIsKids\] = useState\(false\);/,
  `const [editIsKids, setEditIsKids] = useState(false);\n  const [editPin, setEditPin] = useState('');`
);

content = content.replace(
  /const \[editAvatar, setEditAvatar\] = useState\(avatarOptions\[0\]\);/,
  `const [editAvatar, setEditAvatar] = useState(avatarOptions[0]);\n  const { isOpen: isPinOpen, onOpen: onPinOpen, onOpenChange: onPinOpenChange } = useDisclosure();\n  const [selectedLockedProfile, setSelectedLockedProfile] = useState<any>(null);\n  const [enteredPin, setEnteredPin] = useState('');\n  const [pinError, setPinError] = useState(false);`
);

// handleSelectProfile
let handleSelectReplacement = `const handleSelectProfile = (profile: any) => {
    setConfirmDeletePending(false);
    if (isEditingMode) {
      setEditingProfile(profile);
      setEditName(profile.name);
      setEditIsKids(profile.isKids || false);
      setEditAvatar(profile.avatar || avatarOptions[0]);
      setEditPin(profile.pin || '');
      onEditOpen();
      return;
    }
    
    if (profile.pin) {
      setSelectedLockedProfile(profile);
      setEnteredPin('');
      setPinError(false);
      onPinOpen();
      return;
    }

    setActiveProfile(profile);
    router.push('/');
    router.refresh();
  };`;

content = content.replace(
  /const handleSelectProfile = \(profile: any\) => \{[\s\S]*?router\.refresh\(\);\n  \};/,
  handleSelectReplacement
);

// handlePinSubmit
let pinSubmitCode = `
  const handlePinSubmit = (onClose: () => void) => {
    if (selectedLockedProfile?.pin === enteredPin) {
      setActiveProfile(selectedLockedProfile);
      onClose();
      router.push('/');
      router.refresh();
    } else {
      setPinError(true);
    }
  };
`;
content = content.replace(/const handleAddProfile = async/, pinSubmitCode + '\n  const handleAddProfile = async');

// handleAddProfile body
content = content.replace(
  /newProfile: \{ name: newName, avatar: selectedAvatar, isKids \}/,
  `newProfile: { name: newName, avatar: selectedAvatar, isKids, pin: newPin }`
);
content = content.replace(
  /setNewName\(''\);\n\s*setIsKids\(false\);/,
  `setNewName('');\n        setIsKids(false);\n        setNewPin('');`
);

// handleSaveEdit body
content = content.replace(
  /updates: \{ name: editName, isKids: editIsKids, avatar: editAvatar \}/,
  `updates: { name: editName, isKids: editIsKids, avatar: editAvatar, pin: editPin }`
);

// Add PIN Modal at the end of return
let pinModal = `
        <Modal isOpen={isPinOpen} onOpenChange={onPinOpenChange} placement="center" backdrop="blur">
          <ModalContent className="bg-content1/60 backdrop-blur-md border border-white/10 shadow-2xl">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-center pb-0">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-primary/20">
                    <img src={selectedLockedProfile?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  Enter PIN for {selectedLockedProfile?.name}
                </ModalHeader>
                <ModalBody className="py-6">
                  <Input 
                    type="password"
                    maxLength={4}
                    inputMode="numeric"
                    placeholder="Enter 4-digit PIN"
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      setPinError(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handlePinSubmit(onClose);
                      }
                    }}
                    isInvalid={pinError}
                    errorMessage={pinError ? "Incorrect PIN" : ""}
                    size="lg"
                    classNames={{
                      input: "text-center text-2xl tracking-[0.5em] font-bold"
                    }}
                    autoFocus
                  />
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" onPress={onClose} className="w-full">
                    Cancel
                  </Button>
                  <Button color="primary" onPress={() => handlePinSubmit(onClose)} className="w-full">
                    Unlock
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
`;

content = content.replace(/<\/div>\n    <\/div>\n  \);\n\}/, pinModal + '\n      </div>\n    </div>\n  );\n}');

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Applied Phase 1 replacements");