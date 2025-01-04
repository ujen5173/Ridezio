import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import LoginButton from "../LoginButton";

const SigninAlert = () => {
  return (
    <Alert className="border-red-300 bg-red-100" variant="default">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex-1">
          <AlertTitle className="text-lg font-medium text-red-600">
            Sign in to continue
          </AlertTitle>
          <AlertDescription className="text-red-600">
            You need to sign in to continue booking a vehicle. Please sign in to
            continue.
          </AlertDescription>
        </div>
        <LoginButton>
          <Button variant={"secondary"} size="sm">
            Sign in
          </Button>
        </LoginButton>
      </div>
    </Alert>
  );
};

export default SigninAlert;
