import { registerAction, type RegisterState } from "@/app/actions/auth";
import { RegisterFormClient } from "@/components/register-form-client";

const initialState: RegisterState = { error: "" };

export function RegisterForm() {
  return (
    <RegisterFormClient
      registerAction={registerAction}
      initialState={initialState}
    />
  );
}

