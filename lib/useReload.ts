import { useState } from "preact/hooks"

export const useReload = () => {
  const [state, setState] = useState(true)

  return () => setState(!state)
} 