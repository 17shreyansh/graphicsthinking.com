import { useInView } from 'framer-motion'
import { useRef } from 'react'

export const useScrollAnimation = (threshold = 0.1) => {\n  const ref = useRef(null)\n  const isInView = useInView(ref, { threshold, once: true })\n\n  return { ref, isInView }\n}