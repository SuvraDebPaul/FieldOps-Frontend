"use client";
import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { useLogout } from "@/hooks";
import { Spinner } from "../ui/spinner";
import { LogOut } from "lucide-react";

export default function LogoutButton(props: ComponentProps<typeof Button>) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Button
      variant={"outline"}
      onClick={() => logout()}
      disabled={isPending}
      {...props}
    >
      {isPending ? <Spinner /> : <LogOut />} Logout
    </Button>
  );
}
