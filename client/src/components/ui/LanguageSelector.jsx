import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, LanguageIcon } from '@heroicons/react/24/outline';
import { voiceService } from '../../services/voiceService';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' }
];

const LanguageSelector = ({ className = '', compact = false }) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(
    languages.find(lang => lang.code === i18n.language) || languages[0]
  );

  const changeLanguage = async (language) => {
    try {
      await i18n.changeLanguage(language.code);
      setCurrentLanguage(language);
      voiceService.setLanguage(language.code);
      setIsOpen(false);
      
      // Announce language change
      voiceService.autoSpeak(
        `Language changed to ${language.name}`,
        language.code
      );
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
          aria-label={t('settings.language')}
        >
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                    currentLanguage.code === language.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{language.nativeName}</div>
                    <div className="text-sm text-gray-500">{language.name}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <LanguageIcon className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold">{t('settings.language')}</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {languages.map((language) => (
          <motion.button
            key={language.code}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => changeLanguage(language)}
            className={`p-3 rounded-lg border-2 transition-all ${
              currentLanguage.code === language.code
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">{language.flag}</div>
            <div className="font-medium text-sm">{language.nativeName}</div>
            <div className="text-xs text-gray-500">{language.name}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
