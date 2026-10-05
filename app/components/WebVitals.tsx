'use client'
import { useEffect } from 'react'
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals'

export default function WebVitals() {
  useEffect(() => {
    const log = (m: { name: string; value: number }) => console.log(m.name, m.value)
    onLCP(log); onINP(log); onCLS(log); onFCP(log); onTTFB(log)
  }, [])
  return null
}