const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

let openEditCode = `  const openEditModalForProfile = (profile: any) => {
    setEditingProfile(profile);
    setEditName(profile.name);
    setEditIsKids(profile.isKids || false);
    setEditAvatar(profile.avatar || avatarOptions[0]);
    setEditPin(profile.pin || '');
    onEditOpen();
  };`;

content = content.replace(/const handleSelectProfile =/, openEditCode + '\n\n  const handleSelectProfile =');

let handleSelectReplacement = `const handleSelectProfile = (profile: any) => {
    setConfirmDeletePending(false);
    
    // If the profile is locked, require the PIN before doing ANYTHING (entering OR editing)
    if (profile.pin) {
      setSelectedLockedProfile(profile);
      setEnteredPin('');
      setPinError(false);
      onPinOpen();
      return;
    }

    if (isEditingMode) {
      openEditModalForProfile(profile);
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

let pinSubmitReplacement = `const handlePinSubmit = (onClose: () => void) => {
    if (selectedLockedProfile?.pin === enteredPin) {
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
  };`;

content = content.replace(
  /const handlePinSubmit = \(onClose: \(\) => void\) => \{[\s\S]*?setPinError\(true\);\n    \}\n  \};/,
  pinSubmitReplacement
);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Protected Edit Profile with PIN");