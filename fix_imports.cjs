const fs = require("fs");
let content = fs.readFileSync("src/components/ui/button/UserProfileButton.tsx", "utf8");

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

// If it failed because of whitespace differences:
if (!content.includes('useDisclosure')) {
  content = content.replace(
    /import \{[\s\S]*?\} from "@heroui\/react";/,
    `import { addToast, Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, InputOtp } from "@heroui/react";`
  );
}

fs.writeFileSync("src/components/ui/button/UserProfileButton.tsx", content);
console.log("Fixed missing imports");