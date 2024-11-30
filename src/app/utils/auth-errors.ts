// lib/auth-errors.ts
export const authErrors: Record<string, string> = {
  OAuthSignin: "Error in constructing an authorization URL.",
  OAuthCallback: "Error in handling the response from OAuth provider.",
  OAuthCreateAccount: "Could not create OAuth provider user account.",
  EmailCreateAccount: "Could not create email provider user account.",
  Callback: "Error in the OAuth callback handler.",
  OAuthAccountNotLinked:
    "The email on the account is already registered with a different provider.",
  CredentialsSignin: "The credentials you provided are incorrect.",
  Default: "Unable to sign in. Please try again.",
};

export function getAuthErrorMessage(error: string | undefined): string {
  if (!error)
    return authErrors.Default ?? "Unable to sign in. Please try again.";
  return (
    authErrors[error] ??
    authErrors.Default ??
    "Unable to sign in. Please try again."
  );
}
