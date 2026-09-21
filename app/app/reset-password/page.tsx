import PasswordRecovery from "@/components/auth/PasswordRecovery";
export const metadata = { title: "Reset password", robots: { index: false, follow: false }, referrer: "no-referrer" as const };
export default function ResetPasswordPage() { return <PasswordRecovery reset />; }
