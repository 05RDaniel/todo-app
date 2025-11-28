import { loginAction, type LoginState } from "@/app/actions/auth";
import { LoginFormClient } from "@/components/login-form-client";

const initialState: LoginState = { error: "" };

export function LoginForm() {
  async function loginWithState(
    prevState: LoginState | undefined | void,
    formData: FormData | null,
  ) {
    if (!formData) {
      return prevState ?? initialState;
    }

    return (
      (await loginAction((prevState ?? initialState) as LoginState, formData)) ??
      initialState
    );
  }

  return (
    <LoginFormClient
      loginAction={loginWithState}
      initialState={initialState}
    />
  );
}

