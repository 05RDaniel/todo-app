import { loginAction } from "@/app/actions/auth";
import { LoginFormClient } from "@/components/login-form-client";

export function LoginForm() {
  const loginWithState = loginAction.bind(null);
  return <LoginFormClient loginAction={loginWithState} />;
}

