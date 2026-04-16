'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('inambebar_lang')
    if (saved === 'fa' || saved === 'en') setLang(saved)
  }, [])

  function toggleLang() {
    const next = lang === 'en' ? 'fa' : 'en'
    setLang(next)
    localStorage.setItem('inambebar_lang', next)
    document.documentElement.dir = next === 'fa' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const t = translations[lang]
  const isFa = lang === 'fa'

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isFa }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
