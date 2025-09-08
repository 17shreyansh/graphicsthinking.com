import { useState } from 'react'
import { Image, Skeleton, Box } from '@chakra-ui/react'

export default function LazyImage({ src, alt, fallback, fallbackSrc, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <Image
        src={fallbackSrc || fallback || 'https://via.placeholder.com/400x200/E5E5E5/999999?text=No+Image'}
        alt={alt}
        {...props}
      />
    )
  }

  return (
    <>
      {!loaded && !error && <Skeleton {...props} />}
      <Image
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        display={loaded ? 'block' : 'none'}
        loading="lazy"
        {...props}
      />
    </>
  )
}