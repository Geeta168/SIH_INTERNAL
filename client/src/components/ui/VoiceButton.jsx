import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MicrophoneIcon, SpeakerWaveIcon, StopIcon } from '@heroicons/react/24/outline';
import { voiceService } from '../../services/voiceService';
import Button from './Button';

const VoiceButton = ({
  mode = 'both', // 'listen', 'speak', 'both'
  onResult,
  onError,
  text = '',
  className = '',
  size = 'md',
  variant = 'outline'
}) => {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    voiceService.setLanguage(i18n.language);
  }, [i18n.language]);

  const startListening = () => {
    const success = voiceService.startListening({
      onStart: () => {
        setIsListening(true);
        voiceService.autoSpeak(t('ai.listening'), i18n.language);
      },
      onResult: (transcript) => {
        setIsListening(false);
        if (onResult) onResult(transcript);
      },
      onError: (error) => {
        setIsListening(false);
        if (onError) onError(error);
        voiceService.autoSpeak(t('errors.microphoneError'), i18n.language);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (!success) {
      voiceService.autoSpeak(t('errors.speechError'), i18n.language);
    }
  };

  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const speakText = () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!text) {
      voiceService.autoSpeak(t('errors.genericError'), i18n.language);
      return;
    }

    voiceService.speak(text, {
      language: i18n.language,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: (error) => {
        setIsSpeaking(false);
        if (onError) onError(error);
      }
    });
  };

  const toggleVoice = () => {
    if (mode === 'listen' || mode === 'both') {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    } else if (mode === 'speak') {
      speakText();
    }
  };

  if (mode === 'both') {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant={variant}
          size={size}
          onClick={() => setShowControls(!showControls)}
          icon={isListening ? StopIcon : (isSpeaking ? SpeakerWaveIcon : MicrophoneIcon)}
          className="relative"
          aria-label={t('accessibility.voiceInput')}
        >
          {isListening ? t('ai.listening') : isSpeaking ? t('ai.speaking') : t('ai.voiceInput')}
        </Button>

        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 z-10 bg-white rounded-lg shadow-lg border p-2 min-w-[200px]"
          >
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={startListening}
              disabled={isListening}
              icon={MicrophoneIcon}
              className="mb-1"
            >
              {t('ai.voiceInput')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={speakText}
              disabled={!text || isSpeaking}
              icon={SpeakerWaveIcon}
            >
              {isSpeaking ? t('ai.speaking') : t('accessibility.speakText')}
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  const getIcon = () => {
    if (mode === 'listen') return isListening ? StopIcon : MicrophoneIcon;
    if (mode === 'speak') return isSpeaking ? StopIcon : SpeakerWaveIcon;
    return MicrophoneIcon;
  };

  const getLabel = () => {
    if (mode === 'listen') return isListening ? t('common.stop') : t('ai.voiceInput');
    if (mode === 'speak') return isSpeaking ? t('accessibility.stopAudio') : t('accessibility.playAudio');
    return t('ai.voiceInput');
  };

  return (
    <motion.div className={className}>
      <Button
        variant={variant}
        size={size}
        onClick={toggleVoice}
        icon={getIcon()}
        className={`${isListening || isSpeaking ? 'animate-pulse' : ''}`}
        aria-label={getLabel()}
        disabled={mode === 'speak' && !text}
      >
        {getLabel()}
      </Button>
      
      {isListening && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 rounded-lg border-2 border-green-400 animate-pulse"
        />
      )}
    </motion.div>
  );
};

export default VoiceButton;
