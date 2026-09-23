import { signOut } from "@/actions/auth";
import useBreakpoints from "@/hooks/useBreakpoints";
import useSupabaseUser from "@/hooks/useSupabaseUser";
import { env } from "@/utils/env";
import { Gear, Logout, User, Help } from "@/utils/icons";
import { useRouter } from "@bprogress/next/app";
import { addToast, Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, InputOtp, Skeleton } from "@heroui/react";
import Link from "next/link";
import { useState, useEffect } from "react";

import { useProfile } from "@/contexts/ProfileContext";

const UserProfileButton: React.FC = () => {
  const router = useRouter();
  const [logout, setLogout] = useState(false);
  const { data: user, isLoading } = useSupabaseUser();
  const { mobile, desktop } = useBreakpoints();
  const { isOpen: isPinOpen, onOpen: onPinOpen, onOpenChange: onPinOpenChange, onClose: onPinClose } = useDisclosure();
  const [selectedLockedProfile, setSelectedLockedProfile] = useState<any>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const { activeProfile, profiles, setActiveProfile } = useProfile();

  useEffect(() => {
    // Check localStorage for 5-hour lockout
    const lockoutUntil = localStorage.getItem("movira_pin_lockout");
    if (lockoutUntil) {
      if (Date.now() < parseInt(lockoutUntil)) {
        setIsLockedOut(true);
      } else {
        localStorage.removeItem("movira_pin_lockout");
      }
    }
  }, []);

  if (isLoading) {
    return (
      <Button variant="light" isIconOnly className="min-w-fit px-2 md:px-3">
        <Skeleton className="rounded-full size-7" />
      </Button>
    );
  }

  const guest = !user;
  const mainAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || user?.email || 'User')}&background=18181b&color=fff&size=256&bold=true`;
  
  const displayName = activeProfile ? activeProfile.name : user?.username;
  const displayAvatar = activeProfile && activeProfile.avatar ? activeProfile.avatar : mainAvatar;

  const ProfileButton = (
    <Button
      title={guest ? "Login" : displayName}
      variant="light"
      href={guest ? "/auth" : undefined}
      as={guest ? Link : undefined}
      isIconOnly={guest || mobile}
      endContent={
        !guest ? (
          <Avatar
            showFallback
            src={displayAvatar}
            className="size-7"
            fallback={<User className="text-xl" />}
          />
        ) : undefined
      }
      className="min-w-fit px-2 md:px-3"
    >
      {guest ? (
        <User className="text-xl" />
      ) : (
        <p className="hidden lg:block max-w-[200px] truncate">{displayName}</p>
      )}
    </Button>
  );

  if (guest) return ProfileButton;

  const handleLogout = async () => {
    if (logout) return;
    setLogout(true);
    const { success, message } = await signOut();
    addToast({
      title: message,
      color: success ? "primary" : "danger",
    });
    if (!success) {
      return setLogout(false);
    }
    return router.push("/auth");
  };

  return (
    <>
      <Dropdown showArrow>
        <DropdownTrigger>{ProfileButton}</DropdownTrigger>
        <DropdownMenu
          aria-label="User profile dropdown"
          variant="flat"
          disabledKeys={logout ? ["logout", "switch-header"] : ["switch-header"]}
        >
          <DropdownItem key="profile" href="/profile" startContent={<User />}>
            Profile
          </DropdownItem>
          
          <DropdownItem key="support" href="/support" startContent={<Help />}>
            Support
          </DropdownItem>
          
          {profiles.length > 0 && (
            <DropdownItem key="switch-header" className="opacity-50 mt-2" isReadOnly>
              Switch Profile:
            </DropdownItem>
          )}
          
          {profiles.map((p) => (
            <DropdownItem 
              key={`profile-${p.id}`}
              startContent={<Avatar src={p.avatar || mainAvatar} className="size-5" />}
              onPress={() => {
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
              }}
            >
              {p.name}
            </DropdownItem>
          ))}

          <DropdownItem key="manage-profiles" href="/profiles" className="text-primary font-medium">
            Manage Profiles
          </DropdownItem>

          <DropdownItem 
            key="logout" 
            className="text-danger mt-2" 
            color="danger" 
            startContent={logout ? <Spinner size="sm" color="danger" /> : <Logout />}
            onPress={handleLogout}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* PIN Unlock Modal for Quick Switch */}
      <Modal isOpen={isPinOpen} onOpenChange={onPinOpenChange} placement="center" backdrop="blur">
        <ModalContent className="bg-content1/90 backdrop-blur-md border border-white/10 shadow-2xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center pb-0 mt-4">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-primary/20 bg-white/5">
                  <img src={selectedLockedProfile?.avatar || mainAvatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                Enter PIN for {selectedLockedProfile?.name}
              </ModalHeader>
              <ModalBody className="py-6 flex flex-col items-center">
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
                                // 5 hours lockout = 5 * 60 * 60 * 1000
                                const lockoutTime = Date.now() + 18000000;
                                localStorage.setItem("movira_pin_lockout", lockoutTime.toString());
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
    </>
  );
};

export default UserProfileButton;