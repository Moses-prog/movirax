const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

// Add state for the new Set PIN modal
let stateReplacement = `  const [editPin, setEditPin] = useState('');
  const [confirmDeletePending, setConfirmDeletePending] = useState(false);
  const [editAvatar, setEditAvatar] = useState(avatarOptions[0]);
  const { isOpen: isPinOpen, onOpen: onPinOpen, onOpenChange: onPinOpenChange } = useDisclosure();
  const [selectedLockedProfile, setSelectedLockedProfile] = useState<any>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const { isOpen: isSetPinOpen, onOpen: onSetPinOpen, onOpenChange: onSetPinOpenChange } = useDisclosure();
  const [tempPin, setTempPin] = useState('');
  const [isSettingPinFor, setIsSettingPinFor] = useState<'add' | 'edit' | null>(null);`;

content = content.replace(/const \[editPin, setEditPin\] = useState\(''\);[\s\S]*?const \[pinError, setPinError\] = useState\(false\);/, stateReplacement);

// Replace the Add Profile inline OTP with the new Button
let addPinButton = `                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 mt-2">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold">Profile Lock</p>
                      <p className="text-xs text-muted-foreground">Require a 4-digit PIN to access this profile.</p>
                    </div>
                    <Button 
                      color={newPin ? "success" : "default"} 
                      variant="flat" 
                      onPress={() => { setIsSettingPinFor('add'); setTempPin(newPin); onSetPinOpen(); }}
                    >
                      {newPin ? <><CheckCircle2 className="w-4 h-4" /> PIN Set</> : <><Lock className="w-4 h-4" /> Add PIN</>}
                    </Button>
                  </div>`;

content = content.replace(/<div className="flex flex-col items-start p-4 bg-white\/5 rounded-xl border border-white\/5 mt-2 gap-3">[\s\S]*?size="md"\n\s*\/>\n\s*<\/div>/, addPinButton);

// Replace the Edit Profile inline OTP with the new Button (it appears twice, second match is Edit Profile)
let editPinButton = `                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 mt-2">
                    <div className="flex flex-col gap-1">
                      <p className="font-bold">Profile Lock</p>
                      <p className="text-xs text-muted-foreground">Require a 4-digit PIN to access this profile.</p>
                    </div>
                    <Button 
                      color={editPin ? "success" : "default"} 
                      variant="flat" 
                      onPress={() => { setIsSettingPinFor('edit'); setTempPin(editPin); onSetPinOpen(); }}
                    >
                      {editPin ? <><CheckCircle2 className="w-4 h-4" /> PIN Set</> : <><Lock className="w-4 h-4" /> Add PIN</>}
                    </Button>
                  </div>`;

content = content.replace(/<div className="flex flex-col items-start p-4 bg-white\/5 rounded-xl border border-white\/5 mt-2 gap-3">[\s\S]*?size="md"\n\s*\/>\n\s*<\/div>/, editPinButton);

// Update the Unlock Modal to use round boxes
content = content.replace(
  /<InputOtp \n\s*length=\{4\}[\s\S]*?size="lg"\n\s*\/>/,
  `<InputOtp 
                      length={4}
                      value={enteredPin}
                      onValueChange={(val) => {
                        setEnteredPin(val);
                        setPinError(false);
                        if (val.length === 4) {
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
                      classNames={{
                        segmentWrapper: "gap-x-4",
                        segment: "w-14 h-14 rounded-full border-2 border-white/20 data-[active=true]:border-primary text-xl font-bold bg-white/5",
                      }}
                    />`
);

// Add the new Set PIN Modal right before the closing tag of the main div
let setPinModal = `
      {/* Set PIN Modal */}
      <Modal isOpen={isSetPinOpen} onOpenChange={onSetPinOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-content1/60 backdrop-blur-md border border-white/10 shadow-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center pb-0 mt-4">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-primary/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                {tempPin.length === 4 ? "Profile PIN Set!" : "Set Profile PIN"}
              </ModalHeader>
              <ModalBody className="py-6 flex flex-col items-center">
                <p className="text-center text-muted-foreground mb-4">
                  Enter a 4-digit PIN to lock this profile.
                </p>
                <InputOtp 
                  length={4}
                  value={tempPin}
                  onValueChange={(val) => {
                    setTempPin(val);
                    if (val.length === 4) {
                      setTimeout(() => {
                        if (isSettingPinFor === 'add') setNewPin(val);
                        if (isSettingPinFor === 'edit') setEditPin(val);
                        onClose();
                      }, 400);
                    }
                  }}
                  autoFocus
                  classNames={{
                    segmentWrapper: "gap-x-4",
                    segment: "w-14 h-14 rounded-full border-2 border-white/20 data-[active=true]:border-primary text-xl font-bold bg-white/5",
                  }}
                />
              </ModalBody>
              <ModalFooter className="flex-col gap-2">
                <Button variant="flat" onPress={onClose} className="w-full">Cancel</Button>
                {((isSettingPinFor === 'add' && newPin) || (isSettingPinFor === 'edit' && editPin)) && (
                  <Button color="danger" variant="flat" className="w-full" onPress={() => {
                    if (isSettingPinFor === 'add') setNewPin('');
                    if (isSettingPinFor === 'edit') setEditPin('');
                    onClose();
                  }}>
                    Remove PIN
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
`;

content = content.replace(/<\/div>\n    <\/div>\n  \);\n\}/, setPinModal + '\n      </div>\n    </div>\n  );\n}');

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Applied UI updates for proper PIN button and round boxes");