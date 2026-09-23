const fs = require("fs");
let content = fs.readFileSync("src/components/ui/button/UserProfileButton.tsx", "utf8");

content = content.replace(
  /import \{\s*addToast,\s*Avatar,\s*Button,\s*Dropdown,\s*DropdownItem,\s*DropdownMenu,\s*DropdownTrigger,\s*Spinner,\s*\} from "@heroui\/react";/,
  `import { addToast, Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, InputOtp } from "@heroui/react";`
);

fs.writeFileSync("src/components/ui/button/UserProfileButton.tsx", content);
console.log("Fixed missing imports for real");