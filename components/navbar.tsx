import { getCurrentUser } from "@/lib/auth";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return <NavbarClient username={user.username} />;
}

