import { loginAction, type LoginState } from "@/app/actions/auth";
import { LoginFormClient } from "@/components/login-form-client";

const initialState: LoginState = {};

// Adaptador para que la firma encaje con useActionState en el cliente
async function loginWithState(
  prevState: LoginState | undefined | void,
  formData: FormData,
): Promise<LoginState | void> {
  // Normalizamos el estado previo a un LoginState válido
  const safePrevState = prevState ?? initialState;
  return loginAction(safePrevState, formData);
}

export function LoginForm() {
  return (
    <LoginFormClient
      loginAction={loginWithState}
      initialState={initialState}
    />
  );
}

