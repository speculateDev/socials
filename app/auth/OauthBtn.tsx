import { Button } from "@/components/ui/button";
import { signInOauth } from "../actions/auth";

function OauthBtn() {
  return (
    <Button className="px-3 py-6" variant="secondary" onClick={signInOauth}>
      <img
        className="size-6"
        src="https://authjs.dev/img/providers/google.svg"
        alt="Google icon"
      />
      <span>Continue with Google</span>
    </Button>
  );
}

export default OauthBtn;
