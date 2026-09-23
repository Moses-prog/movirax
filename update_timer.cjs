const fs = require("fs");

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // 1. Add state for lockout message
  if (!content.includes('const [lockoutMsg, setLockoutMsg]')) {
    content = content.replace(
      /const \[isLockedOut, setIsLockedOut\] = useState\(false\);/,
      `const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutMsg, setLockoutMsg] = useState("");`
    );
  }

  // 2. Replace the useEffect for localStorage
  const oldUseEffectRegex = /useEffect\(\(\) => \{[\s\S]*?const lockoutUntil = localStorage\.getItem\("movira_pin_lockout"\);[\s\S]*?\}, \[.*?\]\);/;
  
  const newUseEffect = `useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkLockout = () => {
      const lockoutUntil = localStorage.getItem("movira_pin_lockout");
      if (lockoutUntil) {
        const timeDiff = parseInt(lockoutUntil) - Date.now();
        if (timeDiff > 0) {
          setIsLockedOut(true);
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          
          let timeStr = '';
          if (hours > 0) timeStr += \`\${hours}h \`;
          if (minutes > 0 || hours > 0) timeStr += \`\${minutes}m \`;
          timeStr += \`\${seconds}s\`;
          
          setLockoutMsg(\`Too many attempts. Please try again in \${timeStr.trim()}.\`);
        } else {
          setIsLockedOut(false);
          localStorage.removeItem("movira_pin_lockout");
          setLockoutMsg("");
        }
      }
    };

    checkLockout();
    
    // Always poll if there's a lockout to keep the timer updated
    interval = setInterval(checkLockout, 1000);
    
    return () => clearInterval(interval);
  }, []);`;

  // First try to replace the exact useEffect if it exists
  if (content.match(oldUseEffectRegex)) {
    content = content.replace(oldUseEffectRegex, newUseEffect);
  } else {
    // For UserProfileButton, the dependency array might be `[]`
    const oldUseEffectRegex2 = /useEffect\(\(\) => \{[\s\S]*?const lockoutUntil = localStorage\.getItem\("movira_pin_lockout"\);[\s\S]*?\}, \[\]\);/;
    if (content.match(oldUseEffectRegex2)) {
      content = content.replace(oldUseEffectRegex2, newUseEffect);
    }
  }

  // 3. Replace the UI for lockout
  content = content.replace(
    /<p className="text-danger font-bold text-center">Too many attempts\. Please try again later\.<\/p>/g,
    `<div className="text-center flex flex-col items-center gap-3">
                    <AlertCircle className="w-12 h-12 text-danger" />
                    <p className="text-danger font-bold">{lockoutMsg || "Too many attempts. Please try again later."}</p>
                  </div>`
  );

  fs.writeFileSync(filePath, content);
  console.log("Updated", filePath);
}

updateFile("src/app/profiles/page.tsx");
updateFile("src/components/ui/button/UserProfileButton.tsx");