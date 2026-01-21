import { registerAction, type RegisterState } from "@/app/actions/auth";
import { RegisterFormClient } from "@/components/register-form-client";

const initialState: RegisterState = { error: "" };

async function registerWithState(
  prevState: RegisterState | undefined | void,
  formData: FormData,
): Promise<RegisterState | void> {
  const safePrevState = prevState ?? initialState;
  return registerAction(safePrevState, formData);
}

export function RegisterForm() {
  return (
    <RegisterFormClient
      registerAction={registerWithState}
      initialState={initialState}
    />
  );
}

