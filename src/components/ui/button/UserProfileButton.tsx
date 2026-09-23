import { signOut } from "@/actions/auth";
import useBreakpoints from "@/hooks/useBreakpoints";
import useSupabaseUser from "@/hooks/useSupabaseUser";
import { DropdownItemProps } from "@/types/component";
import { env } from "@/utils/env";
import { Gear, Logout, User, Help } from "@/utils/icons";
import { useRouter } from "@bprogress/next/app";
import { addToast, Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, InputOtp } from "@heroui/react";
import Link from "next/link";
import { useMemo, useState } from "react";

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

  if (isLoading) return null;

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
              setActiveProfile(p);
              window.location.href = '/';
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
  );
};

export default UserProfileButton;



