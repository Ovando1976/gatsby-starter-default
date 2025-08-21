import React from "react";
// Replace NavLink with Gatsby's Link
import { Link } from "gatsby"
import Textarea from "react-textarea-autosize"

import { useEnterSubmit } from "../lib/Hooks/use-enter-to-submit"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { IconArrowElbow, IconPlus } from "./ui/icons"

export function PromptForm({ onSubmit, input, setInput, isLoading }) {
  const { formRef } = useEnterSubmit()
  const inputRef = React.useRef(null)

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input?.trim()) {
      return
    }
    // Clear input locally
    setInput("")
    // Call parent onSubmit
    await onSubmit(input)
  }

  return (
    <div className={cn("prompt-form-container")}>
      {/* Replaced NavLink with Gatsby <Link to="/"> */}
      <Link to="/">
        <Tooltip>
          <TooltipTrigger asChild>
            <IconPlus />
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      </Link>

      <form onSubmit={handleSubmit} ref={formRef}>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className={cn("textarea-class")}
        />
        <div className="action-buttons">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input === ""}
              >
                <IconArrowElbow />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </form>
    </div>
  )
}

export default PromptForm