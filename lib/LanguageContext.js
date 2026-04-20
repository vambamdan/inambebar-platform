'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LANGS = ['en', 'fa', 'tr']
const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('inambebar_lang')
    if (LANGS.includes(saved)) setLangState(saved)
  }, [])

  function applyLang(next) {
    setLangState(next)
    localStorage.setItem('inambebar_lang', next)
    document.documentElement.dir = next === 'fa' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  // Cycle through en → fa → tr → en (kept for backward compat)
  function toggleLang() {
    applyLang(LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length])
  }

  // Direct selection — used by the 3-pill switcher
  function setLang(next) {
    applyLang(next)
  }

  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const t = translations[lang]
  const isFa = lang === 'fa'

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t, isFa }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
