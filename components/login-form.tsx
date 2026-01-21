import { loginAction, type LoginState } from "@/app/actions/auth";
import { LoginFormClient } from "@/components/login-form-client";

const initialState: LoginState = {};

export function LoginForm() {
  return (
    <LoginFormClient
      loginAction={loginAction}
      initialState={initialState}
    />
  );
}

