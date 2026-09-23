const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

// We want to insert the two missing modals right before the final `</div>`
let unlockModal = `
      {/* PIN Unlock Modal */}
      <Modal isOpen={isPinOpen} onOpenChange={onPinOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-content1/60 backdrop-blur-md border border-white/10 shadow-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center pb-0 mt-4">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-primary/20 bg-white/5">
                  <img src={selectedLockedProfile?.avatar || avatarOptions[0]} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                Enter PIN for {selectedLockedProfile?.name}
              </ModalHeader>
              <ModalBody className="py-6 flex flex-col items-center">
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

// Insert them right before the closing `    </div>\n  );\n}`
content = content.replace(/    <\/div>\n  \);\n\}/, unlockModal + setPinModal + '\n    </div>\n  );\n}');

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Injected missing modals");