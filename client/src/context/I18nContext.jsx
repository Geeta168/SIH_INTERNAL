import React, { createContext, useContext, useMemo, useState } from 'react'

const translations = {
	en: {
		brand: 'KisaanMitra',
		nav_chat: 'Chat',
		nav_auction: 'Auction',
		nav_ai: 'AI Assistant',
		nav_login: 'Login',
		header_title: 'Namaste Kisan! KisaanMitra',
		header_sub: 'Weather, soil and market insights for better decisions.',
		login_welcome: 'Welcome back, Farmer',
		login_create: 'Create your Farm Account',
		login_forgot: 'Forgot Password',
		ai_title: 'AI Assistant',
	},
	hi: {
		brand: 'किसानमित्र',
		nav_chat: 'चैट',
		nav_auction: 'नीलामी',
		nav_ai: 'एआई सहायक',
		nav_login: 'लॉगिन',
		header_title: 'नमस्ते किसान! किसानमित्र',
		header_sub: 'मौसम, मिट्टी और बाज़ार की जानकारी — बेहतर निर्णय।',
		login_welcome: 'वापसी पर स्वागत है, किसान',
		login_create: 'अपना फार्म अकाउंट बनाएं',
		login_forgot: 'पासवर्ड भूल गए',
		ai_title: 'एआई सहायक',
	},
	kn: {
		brand: 'ಕಿಸಾನ್ ಮಿತ್ರ',
		nav_chat: 'ಚಾಟ್',
		nav_auction: 'ಲಿಲಾವು',
		nav_ai: 'ಎಐ ಸಹಾಯಕ',
		nav_login: 'ಲಾಗಿನ್',
		header_title: 'ನಮಸ್ಕಾರ ರೈತರೆ! ಕಿಸಾನ್ ಮಿತ್ರ',
		header_sub: 'ಹವಾಮಾನ, ಮಣ್ಣು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ತಿಳಿವು — ಉತ್ತಮ ನಿರ್ಧಾರಗಳಿಗೆ.',
		login_welcome: 'ಮತ್ತೆ ಸ್ವಾಗತ, ರೈತರೆ',
		login_create: 'ನಿಮ್ಮ ಫಾರ್ಮ್ ಖಾತೆ ರಚಿಸಿ',
		login_forgot: 'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ',
		ai_title: 'ಎಐ ಸಹಾಯಕ',
	}
}

const I18nContext = createContext({ lang: 'en', t: (k)=>k, setLang: ()=>{} })

export const I18nProvider = ({ children }) => {
	const [lang, setLang] = useState(localStorage.getItem('lang') || 'en')
	const t = useMemo(()=> (key) => {
		return translations[lang]?.[key] || translations['en'][key] || key
	}, [lang])
	const value = { lang, setLang: (l)=>{ localStorage.setItem('lang', l); setLang(l) }, t }
	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
