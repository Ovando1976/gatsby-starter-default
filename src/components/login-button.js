"use client"

import * as React from 'react'
import { signIn } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { IconGitHub, IconSpinner } from '@/components/ui/icons'

export function LoginButton({
  text = 'Login with GitHub',
  showGithubIcon = true,
  className,
  ...props
}) {
  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsLoading(true)
        signIn('github', { callbackUrl: '/' })
      }}
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