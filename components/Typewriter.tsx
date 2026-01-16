'use client'

import { useState, useEffect } from 'react'

interface TypewriterProps {
  words: string[]
  delay?: number
}

export default function Typewriter({ words, delay = 3000 }: TypewriterProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentWord = words[currentIndex]

    if (!isDeleting && charIndex < currentWord.length) {
      // Typing
      const timeout = setTimeout(() => {
        setDisplayText(currentWord.substring(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 100)
      return () => clearTimeout(timeout)
    } else if (!isDeleting && charIndex === currentWord.length) {
      // Pause at end of word
      const timeout = setTimeout(() => {
        setIsDeleting(true)
      }, delay)
      return () => clearTimeout(timeout)
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      const timeout = setTimeout(() => {
        setDisplayText(currentWord.substring(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      }, 50)
      return () => clearTimeout(timeout)
    } else if (isDeleting && charIndex === 0) {
      // Move to next word
      setIsDeleting(false)
      setCurrentIndex((currentIndex + 1) % words.length)
    }
  }, [charIndex, currentIndex, isDeleting, words, delay])

  return (
    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}
