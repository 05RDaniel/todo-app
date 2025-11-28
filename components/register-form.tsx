import { registerAction, type RegisterState } from "@/app/actions/auth";
import { RegisterFormClient } from "@/components/register-form-client";

const initialState: RegisterState = { error: "" };

export function RegisterForm() {
  async function registerWithState(
    prevState: RegisterState | undefined | void,
    formData: FormData | null,
  ) {
    "use server";

    if (!formData) {
      return prevState ?? initialState;
    }

    return (
      (await registerAction((prevState ?? initialState) as RegisterState, formData)) ??
      initialState
    );
  }

  return (
    <RegisterFormClient
      registerAction={registerWithState}
      initialState={initialState}
    />
  );
}

