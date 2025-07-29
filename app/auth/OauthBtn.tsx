import { Button } from "@/components/ui/button";
import { signInOauth } from "../actions/auth";
import { Loader2Icon } from "lucide-react";
import { useTransition } from "react";

function OauthBtn({
  children,
  provider,
}: {
  children: React.ReactNode;
  provider: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleLogin() {
    startTransition(async () => {
      try {
        await signInOauth(provider);
      } catch (error) {
        console.error("Error in OauthBtn: ", error);
      }
    });
  }

  return (
    <Button className="px-9 py-6" variant="secondary" onClick={handleLogin}>
      {isPending ? (
        <>
          <Loader2Icon className="text-muted-foreground animate-spin size-6" />
          <span>Loggin in...</span>
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
}

export default OauthBtn;
