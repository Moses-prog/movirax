"use client";

import { signIn } from "@/actions/auth";
import PasswordInput from "@/components/ui/input/PasswordInput";
import { LoginFormSchema } from "@/schemas/auth";
import { isEmpty } from "@/utils/helpers";
import { LockPassword, Mail } from "@/utils/icons";
import { addToast, Button, Divider, Input, Link } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { env } from "@/utils/env";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/ui/button/GoogleLoginButton";
import { createClient } from "@/utils/supabase/client";

// Define AuthFormProps inline
export interface AuthFormProps {
  setForm: (form: "login" | "register" | "forgot") => void;
}

type AuthMode = "email" | "phone" | "otp";

const AuthLoginForm: React.FC<AuthFormProps> = ({ setForm }) => {
  const router = useRouter();

  // View State Management
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  
  // Phone Auth States
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);

  // Email Auth States
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      loginPassword: "",
    },
  });

  // ==========================================
  // EMAIL / PASSWORD LOGIC
  // ==========================================
  const onSubmit = handleSubmit(async (data) => {
    if (isEmpty(data.captchaToken)) {
      setIsVerifying(true);
      return;
    }

    const { success, message } = await signIn(data);

    addToast({
      title: message,
      color: success ? "success" : "danger",
    });

    if (!success) {
      setValue("captchaToken", undefined);
      setIsVerifying(false);
      return;
    }

    // Small delay to ensure session is set before redirect
    await new Promise(resolve => setTimeout(resolve, 500));
    router.push("/");
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
    if (isSubmitting) return "Signing In...";
    if (isVerifying) return "Verifying...";
    return "Sign In";
  }, [isSubmitting, isVerifying]);

  // ==========================================
  // SUPABASE PHONE AUTH LOGIC
  // ==========================================
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPhoneLoading(true);

    try {
      // Initialize client only when needed
      const supabase = createClient();
      
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      addToast({ title: "Code sent successfully!", color: "success" });
      setAuthMode("otp");
    } catch (err: any) {
      console.error("Send OTP Error:", err);
      addToast({ title: err.message || "Failed to send code.", color: "danger" });
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPhoneLoading(true);

    try {
      // Initialize client only when needed
      const supabase = createClient();
      
      const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: "sms",
      });

      if (error) throw error;

      if (data?.session) {
        addToast({ title: "Signed in successfully!", color: "success" });
        
        // Small delay to ensure session is set before redirect
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push("/");
      }
    } catch (err: any) {
      console.error("Verify OTP Error:", err);
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
              Sign in to continue your streaming journey
            </p>
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
              {...register("loginPassword")}
              isInvalid={!!errors.loginPassword?.message}
              errorMessage={errors.loginPassword?.message}
              isRequired
              variant="underlined"
              label="Password"
              placeholder="Enter your password"
              startContent={<LockPassword className="text-xl" />}
              isDisabled={isSubmitting || isVerifying}
            />
            <div className="flex w-full items-center justify-end px-1 py-2">
              <Link
                size="sm"
                className="text-foreground cursor-pointer"
                onClick={() => setForm("forgot")}
                isDisabled={isSubmitting || isVerifying}
              >
                Forgot password?
              </Link>
            </div>
            
            {isVerifying && (
              <Turnstile
                className="flex h-fit w-full items-center justify-center"
                siteKey={env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
                onSuccess={onCaptchaSuccess}
              />
            )}
            
            <Button
              className="mt-4 font-medium"
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
              Continue with Phone
            </Button>
          </div>

          <p className="text-small text-center mt-2">
            Don't have an account?{" "}
            <Link
              size="sm"
              className="cursor-pointer font-medium text-primary"
              onClick={() => setForm("register")}
              isDisabled={isSubmitting || isVerifying}
            >
              Sign Up
            </Link>
          </p>
        </>
      )}

      {/* --------------------------------------------------- */}
      {/* VIEW 2: PHONE NUMBER INPUT FOR OTP                  */}
      {/* --------------------------------------------------- */}
      {authMode === "phone" && (
        <form className="flex flex-col gap-4" onSubmit={handleSendOtp}>
          <div className="text-center mb-2">
             <p className="text-small text-foreground-500">
               Enter your phone number to receive a secure login code.
             </p>
          </div>
          
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
            isDisabled={phone.length < 8}
          >
            {isPhoneLoading ? "Sending Code..." : "Send SMS Code"}
          </Button>

          <Button
            variant="light"
            className="text-foreground-500 font-medium"
            onPress={() => setAuthMode("email")}
            isDisabled={isPhoneLoading}
          >
            Back to Email Login
          </Button>
        </form>
      )}

      {/* --------------------------------------------------- */}
      {/* VIEW 3: VERIFY OTP CODE                             */}
      {/* --------------------------------------------------- */}
      {authMode === "otp" && (
        <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
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
            {isPhoneLoading ? "Verifying..." : "Verify & Sign In"}
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

export default AuthLoginForm;