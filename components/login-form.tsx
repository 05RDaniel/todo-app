import { loginAction, type LoginState } from "@/app/actions/auth";
import { LoginFormClient } from "@/components/login-form-client";

const initialState: LoginState = {};

async function loginWithState(
  prevState: LoginState | undefined | void,
  formData: FormData | null,
): Promise<LoginState> {
  "use server";
  
  if (!formData) {
    return prevState ?? initialState;
  }

  const result = await loginAction((prevState ?? initialState) as LoginState, formData);
  return result ?? initialState;
}

export function LoginForm() {
  return (
    <LoginFormClient
      loginAction={loginWithState}
      initialState={initialState}
    />
  );
}

