import { signUp } from "@/actions/auth";
import { LockPassword, Mail, User } from "@/utils/icons";
import { addToast, Button, Divider, Input, Link } from "@heroui/react";
import { AuthFormProps } from "./Forms";
import { RegisterFormSchema } from "@/schemas/auth";
import PasswordInput from "@/components/ui/input/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Turnstile } from "@marsidev/react-turnstile";
import { useCallback, useState } from "react";
import { isEmpty } from "@/utils/helpers";
import { env } from "@/utils/env";
import GoogleLoginButton from "@/components/ui/button/GoogleLoginButton";
import { useRouter } from "@bprogress/next/app";

// ✅ Import your actual Supabase client builder
import { createClient } from "@/utils/supabase/client";

type AuthMode = "email" | "phone" | "otp";

const AuthRegisterForm: React.FC<AuthFormProps> = ({ setForm }) => {
  const router = useRouter();
  
  // ✅ Initialize the Supabase client
  const supabase = createClient();

  const [isVerifying, setIsVerifying] = useState(false);

  // View State Management
  const [authMode, setAuthMode] = useState<AuthMode>("email");

  // Phone Auth States
  const [phoneUsername, setPhoneUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterFormSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  // ==========================================
  // EMAIL / PASSWORD LOGIC (Untouched)
  // ==========================================
  const onSubmit = handleSubmit(async (data) => {
    if (isEmpty(data.captchaToken)) {
      setIsVerifying(true);
      return;
    }

    const { success, message } = await signUp(data);

    if (!success) {
      setValue("captchaToken", undefined);
      setIsVerifying(false);
    }

    return addToast({
      title: message,
      color: success ? "success" : "danger",
      timeout: success ? Infinity : undefined,
    });
  });

  const onCaptchaSuccess = useCallback(
    (token: string) => {
      setValue("captchaToken", token);
      setIsVerifying(false);
      onSubmit();
    },
    [setValue, setIsVerifying, onSubmit],
  );

  const getButtonText = useCallback(() => {
    if (isSubmitting) return "Signing Up...";
    if (isVerifying) return "Verifying...";
    return "Sign Up";
  }, [isSubmitting, isVerifying]);


  // ==========================================
  // SUPABASE PHONE AUTH LOGIC (Registration)
  // ==========================================
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPhoneLoading(true);

    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          data: {
            username: phoneUsername, // Save the username to user metadata
          },
        },
      });

      if (error) throw error;

      addToast({ title: "Code sent successfully!", color: "success" });
      setAuthMode("otp");
    } catch (err: any) {
      addToast({ title: err.message || "Failed to send code.", color: "danger" });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPhoneLoading(true);

    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: "sms",
      });

      if (error) throw error;

      if (data?.session) {
        addToast({ title: "Account created successfully!", color: "success" });
        
        // ✅ CRUCIAL: Refresh the router to let the server read the new Auth cookie
        router.refresh(); 
        
        setTimeout(() => {
          router.push("/");
        }, 100);
      }
    } catch (err: any) {
      addToast({ title: err.message || "Invalid verification code.", color: "danger" });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      
      {/* --------------------------------------------------- */}
      {/* VIEW 1: STANDARD EMAIL & PASSWORD (DEFAULT)         */}
      {/* --------------------------------------------------- */}
      {authMode === "email" && (
        <>
          <form className="flex flex-col gap-3" onSubmit={onSubmit}>
            <p className="text-small text-foreground-500 mb-4 text-center">
              Join to track your favorites and watch history
            </p>
            <Input
              {...register("username")}
              isInvalid={!!errors.username?.message}
              errorMessage={errors.username?.message}
              isRequired
              label="Username"
              placeholder="Enter your username"
              variant="underlined"
              startContent={<User className="text-xl" />}
              isDisabled={isSubmitting || isVerifying}
            />
            <Input
              {...register("email")}
              isInvalid={!!errors.email?.message}
              errorMessage={errors.email?.message}
              isRequired
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              variant="underlined"
              startContent={<Mail className="text-xl" />}
              isDisabled={isSubmitting || isVerifying}
            />
            <PasswordInput
              value={watch("password")}
              {...register("password")}
              isInvalid={!!errors.password?.message}
              errorMessage={errors.password?.message}
              isRequired
              variant="underlined"
              label="Password"
              placeholder="Enter your password"
              startContent={<LockPassword className="text-xl" />}
              isDisabled={isSubmitting || isVerifying}
            />
            <PasswordInput
              {...register("confirm")}
              isInvalid={!!errors.confirm?.message}
              errorMessage={errors.confirm?.message}
              isRequired
              variant="underlined"
              label="Confirm Password"
              placeholder="Confirm your password"
              startContent={<LockPassword className="text-xl" />}
              isDisabled={isSubmitting || isVerifying}
            />
            
            {isVerifying && (
              <Turnstile
                className="flex h-fit w-full items-center justify-center"
                siteKey={env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
                onSuccess={onCaptchaSuccess}
              />
            )}
            
            <Button
              className="mt-3 w-full font-medium"
              color="primary"
              type="submit"
              variant="shadow"
              isLoading={isSubmitting || isVerifying}
            >
              {getButtonText()}
            </Button>
          </form>

          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="text-tiny text-default-500 shrink-0">OR</p>
            <Divider className="flex-1" />
          </div>
          
          <div className="flex flex-col gap-3">
            <GoogleLoginButton isDisabled={isSubmitting || isVerifying} />
            
            <Button
              variant="bordered"
              className="w-full font-medium"
              isDisabled={isSubmitting || isVerifying}
              onPress={() => setAuthMode("phone")}
              startContent={
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              }
            >
              Sign Up with Phone
            </Button>
          </div>

          <p className="text-small text-center mt-2">
            Already have an account?{" "}
            <Link
              isBlock
              onClick={() => setForm("login")}
              size="sm"
              className="cursor-pointer font-medium text-primary"
              isDisabled={isSubmitting || isVerifying}
            >
              Sign In
            </Link>
          </p>
        </>
      )}

      {/* --------------------------------------------------- */}
      {/* VIEW 2: PHONE NUMBER & USERNAME INPUT FOR OTP       */}
      {/* --------------------------------------------------- */}
      {authMode === "phone" && (
        <form className="flex flex-col gap-4 animate-appearance-in" onSubmit={handleSendOtp}>
          <div className="text-center mb-2">
             <p className="text-small text-foreground-500">
               Create an account securely using your phone number.
             </p>
          </div>
          
          <Input
            isRequired
            label="Username"
            placeholder="Choose a username"
            variant="underlined"
            value={phoneUsername}
            onValueChange={setPhoneUsername}
            isDisabled={isPhoneLoading}
            startContent={<User className="text-xl text-default-400" />}
          />

          <Input
            isRequired
            label="Phone Number"
            placeholder="+2348000000000"
            type="tel"
            variant="underlined"
            value={phone}
            onValueChange={setPhone}
            isDisabled={isPhoneLoading}
            description="Include your country code (e.g. +234)"
            startContent={
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-default-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.273-3.973-6.869-6.869l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            }
          />

          <Button
            className="mt-4 font-medium"
            color="primary"
            type="submit"
            variant="shadow"
            isLoading={isPhoneLoading}
            isDisabled={phone.length < 8 || phoneUsername.length < 3}
          >
            {isPhoneLoading ? "Sending Code..." : "Send SMS Code"}
          </Button>

          <Button
            variant="light"
            className="text-foreground-500 font-medium"
            onPress={() => setAuthMode("email")}
            isDisabled={isPhoneLoading}
          >
            Back to Email Sign Up
          </Button>
        </form>
      )}

      {/* --------------------------------------------------- */}
      {/* VIEW 3: VERIFY OTP CODE                             */}
      {/* --------------------------------------------------- */}
      {authMode === "otp" && (
        <form className="flex flex-col gap-4 animate-appearance-in" onSubmit={handleVerifyOtp}>
          <div className="text-center mb-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Code Sent
            </span>
            <p className="text-small text-foreground-500 mt-4">
              Enter the 6-digit verification code sent to <br/>
              <span className="font-bold text-foreground">{phone}</span>
            </p>
          </div>
          
          <Input
            isRequired
            label="6-Digit Code"
            placeholder="••••••"
            type="text"
            maxLength={6}
            variant="underlined"
            value={otp}
            onValueChange={setOtp}
            isDisabled={isPhoneLoading}
            classNames={{ input: "tracking-[0.5em] text-center font-mono text-xl" }}
          />

          <Button
            className="mt-4 font-medium"
            color="success"
            type="submit"
            variant="shadow"
            isLoading={isPhoneLoading}
            isDisabled={otp.length < 6}
          >
            {isPhoneLoading ? "Verifying..." : "Verify & Create Account"}
          </Button>

          <Button
            variant="light"
            className="text-foreground-500 font-medium"
            onPress={() => {
              setOtp("");
              setAuthMode("phone");
            }}
            isDisabled={isPhoneLoading}
          >
            Wrong number? Go back
          </Button>
        </form>
      )}

    </div>
  );
};

export default AuthRegisterForm;