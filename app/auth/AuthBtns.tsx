import { Button } from "@/components/ui/button";
import Link from "next/link";

function AuthBtns() {
  return (
    <div className="flex gap-3 flex-1 md:flex-row flex-col relative z-50">
      <Button className="flex-1" variant="outline">
        <Link href="/auth/signup">Sign up</Link>
      </Button>
      <Button asChild className="flex-1">
        <Link href="auth/login">Login</Link>
      </Button>
    </div>
  );
}

export default AuthBtns;
