import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { voiceService } from '../../services/voiceService';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  speak = false,
  className = '',
  onClick,
  ...props
}) => {
  const { t } = useTranslation();

  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 shadow-md hover:shadow-lg',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const handleClick = (e) => {
    if (speak && children) {
      voiceService.autoSpeak(typeof children === 'string' ? children : 'Button clicked');
    }
    if (onClick) onClick(e);
  };

  const buttonClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      aria-label={typeof children === 'string' ? children : 'Button'}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {t('common.loading')}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 mr-2" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 ml-2" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
