'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LANGS = ['en', 'fa', 'tr']
const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    const saved = localStorage.getItem('inambebar_lang')
    if (saved && LANGS.includes(saved)) {
      // User has a saved preference — always honour it
      setLangState(saved)
    } else {
      // First visit — detect country via IP and pick a language
      fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then(({ country_code }) => {
          const detected = country_code === 'IR' ? 'fa'
                         : country_code === 'TR' ? 'tr'
                         : 'en'
          applyLang(detected)
        })
        .catch(() => {}) // fail silently — stays 'en'
    }
  }, [])

  function applyLang(next) {
    setLangState(next)
    localStorage.setItem('inambebar_lang', next)
    document.documentElement.dir = next === 'fa' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  function toggleLang() {
    applyLang(LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length])
  }

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
