import React from "react";
// Removed: import { signIn } from 'next-auth/react' (not compatible with Gatsby)
import { navigate } from "gatsby" // If you need programmatic navigation

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconGitHub, IconSpinner } from "@/components/ui/icons"

export function LoginButton({
  text = "Login with GitHub",
  showGithubIcon = true,
  className,
  ...props
}) {
  const [isLoading, setIsLoading] = React.useState(false)

  // Placeholder function to handle GitHub OAuth redirection in Gatsby
  // Could be an API route on your server or an external link to GitHub OAuth
  const redirectToGitHubOAuth = async () => {
    try {
      setIsLoading(true)
      // Example: you might do a fetch to your backend or window.location to GitHub's OAuth
      // For demonstration, we'll just do a quick setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // On success, navigate or refresh:
      navigate("/dashboard") // or window.location.replace("/some-callback")
    } catch (err) {
      console.error("GitHub OAuth Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={redirectToGitHubOAuth}
      disabled={isLoading}
      className={cn(className)}
      {...props}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showGithubIcon ? (
        <IconGitHub className="mr-2" />
      ) : null}
      {text}
    </Button>
  )
}