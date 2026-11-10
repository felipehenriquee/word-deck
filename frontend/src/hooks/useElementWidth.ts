import { useCallback, useState } from 'react'

/**
 * Mede a largura de um elemento e acompanha mudanças (ResizeObserver).
 * Usado para escalar as cartas e o palco do booster conforme a tela.
 *
 *   const [ref, width] = useElementWidth<HTMLDivElement>()
 *   <div ref={ref}>...</div>
 */
export function useElementWidth<T extends HTMLElement>() {
  const [width, setWidth] = useState(0)
  const [observer] = useState(() =>
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(([entry]) => setWidth(entry.contentRect.width)),
  )

  const ref = useCallback(
    (el: T | null) => {
      observer?.disconnect()
      if (el) {
        setWidth(el.getBoundingClientRect().width)
        observer?.observe(el)
      }
    },
    [observer],
  )

  return [ref, width] as const
}
