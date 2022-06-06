import React, { useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function SearchInput({
  onOpen,
  onChange,
  className,
  focus,
}: {
  onOpen?: () => void
  onChange?: (value: string) => void
  className?: string
  focus?: boolean
}) {
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (focus && ref.current) {
      ref.current.focus()
    }
  }, [focus])

  return (
    <div className={className}>
      <div className="relative rounded bg-white/10">
        <input
          ref={ref}
          type="text"
          className="block w-full bg-transparent p-2 placeholder:text-white/50"
          placeholder="Click to open browser..."
          onInput={(ev) => onChange?.((ev.target as HTMLInputElement).value)}
          onClick={() => onOpen?.()}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex h-full items-center px-2">
          <FontAwesomeIcon icon={faSearch} className="opacity-50" />
        </div>
      </div>
    </div>
  )
}
