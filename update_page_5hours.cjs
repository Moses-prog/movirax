const fs = require("fs");
let content = fs.readFileSync("src/app/profiles/page.tsx", "utf8");

// 1. Insert the useEffect for checking localStorage
let stateCode = `  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);`;

let useEffectCode = `  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  useEffect(() => {
    const lockoutUntil = localStorage.getItem("movira_pin_lockout");
    if (lockoutUntil) {
      if (Date.now() < parseInt(lockoutUntil)) {
        setIsLockedOut(true);
      } else {
        localStorage.removeItem("movira_pin_lockout");
      }
    }
  }, [isPinOpen]);`;

content = content.replace(stateCode, useEffectCode);
if (!content.includes('useEffect(() => {')) {
  // Try to insert after useState if not matched exactly
  content = content.replace(
    /const \[isLockedOut, setIsLockedOut\] = useState\(false\);/,
    `const [isLockedOut, setIsLockedOut] = useState(false);
  
  useEffect(() => {
    const lockoutUntil = localStorage.getItem("movira_pin_lockout");
    if (lockoutUntil) {
      if (Date.now() < parseInt(lockoutUntil)) {
        setIsLockedOut(true);
      } else {
        localStorage.removeItem("movira_pin_lockout");
      }
    }
  }, [isPinOpen]);`
  );
}

// 2. Change 60000 to 18000000 and add localStorage logic
let oldLockout = `                              if (newAttempts >= 5) {
                                setIsLockedOut(true);
                                setTimeout(() => {
                                  setIsLockedOut(false);
                                  setPinAttempts(0);
                                  onClose();
                                }, 60000); // 1 minute lockout
                              }`;

let newLockout = `                              if (newAttempts >= 5) {
                                setIsLockedOut(true);
                                const lockoutTime = Date.now() + 18000000;
                                localStorage.setItem("movira_pin_lockout", lockoutTime.toString());
                              }`;

content = content.replace(oldLockout, newLockout);

fs.writeFileSync("src/app/profiles/page.tsx", content);
console.log("Updated page.tsx with 5 hour localStorage rate limiting");