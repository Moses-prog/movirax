"use client";

import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Link,
} from "@heroui/react";
import { ShieldAlert, Info, Chrome } from "lucide-react";
import { ADS_WARNING_STORAGE_KEY, IS_BROWSER } from "@/utils/constants";

const AdsWarning: React.FC = () => {
  const [seen, setSeen] = useLocalStorage<boolean>({
    key: ADS_WARNING_STORAGE_KEY,
    getInitialValueInEffect: false,
  });
  const [opened, handlers] = useDisclosure(!seen && IS_BROWSER);

  const handleSeen = () => {
    handlers.close();
    setSeen(true);
  };

  if (seen) return null;

  return (
    <Modal
      hideCloseButton
      isOpen={opened}
      placement="center"
      backdrop="blur"
      size="2xl"
      isDismissable={false}
      classNames={{
        base: "bg-zinc-950/90 border border-white/10 backdrop-blur-md",
        header: "border-b border-white/10",
        footer: "border-t border-white/10"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-2 pt-8 text-center items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500 mb-2 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Ad-Blocker Recommended
          </h2>
        </ModalHeader>
        <ModalBody className="py-6 px-8">
          <div className="space-y-6 text-zinc-300 text-center">
            <p className="text-base leading-relaxed">
              To keep this platform free, our third-party streaming servers utilize advertisements. Because we don't control these external servers, you might encounter intrusive pop-ups while trying to watch.
            </p>
            
            <div className="rounded-xl bg-white/5 p-5 border border-white/10 text-left">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
                <Info size={18} className="text-blue-400" />
                For a flawless, ad-free experience:
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">�</span>
                  <span>
                    Use the <Link isExternal color="danger" href="https://brave.com/" className="font-semibold px-1">Brave Browser</Link> (Built-in ad blocking for mobile & desktop)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">�</span>
                  <span>
                    Or install <Link isExternal color="danger" href="https://ublockorigin.com/" className="font-semibold px-1">uBlock Origin</Link> if you prefer Chrome/Firefox.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="justify-center pb-8 pt-4">
          <Button 
            color="danger" 
            variant="shadow" 
            size="lg"
            className="font-bold w-full max-w-xs shadow-lg shadow-red-500/30"
            onPress={handleSeen}
          >
            I Understand, Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdsWarning;

