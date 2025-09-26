import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        home: "Home",
        aiAssistant: "AI Assistant",
        diseaseDetection: "Disease Detection", 
        weather: "Weather",
        auction: "Marketplace",
        chat: "Messages",
        people: "Community",
        profile: "Profile",
        logout: "Logout",
        settings: "Settings"
      },
      
      // Common
      common: {
        loading: "Loading...",
        submit: "Submit",
        cancel: "Cancel",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        search: "Search",
        filter: "Filter",
        upload: "Upload",
        download: "Download",
        back: "Back",
        next: "Next",
        previous: "Previous",
        close: "Close",
        open: "Open",
        yes: "Yes",
        no: "No",
        ok: "OK",
        error: "Error",
        success: "Success",
        warning: "Warning",
        info: "Information"
      },

      // Home page
      home: {
        title: "Smart Farming Dashboard",
        subtitle: "Transform your agricultural practices with AI-powered assistance",
        features: {
          aiAssistant: {
            title: "AI Agricultural Assistant",
            description: "Get expert farming advice in multiple languages",
            points: ["Multilingual support", "Crop-specific guidance", "24/7 availability", "Voice interaction"]
          },
          diseaseDetection: {
            title: "Disease Detection", 
            description: "Upload soil/crop images for instant analysis",
            points: ["Instant image analysis", "Treatment suggestions", "Confidence scoring", "Soil health check"]
          },
          weather: {
            title: "Weather Monitoring",
            description: "Real-time weather data and farming alerts", 
            points: ["5-day forecasts", "Farming alerts", "Location-based data", "Crop protection tips"]
          },
          marketplace: {
            title: "Auction Marketplace",
            description: "List produce & equipment, bid securely",
            points: ["List items", "Secure bidding", "Seller chat", "Market prices"]
          },
          messages: {
            title: "Direct Messages",
            description: "Connect with buyers and sellers",
            points: ["Buyer-Seller chats", "Conversation history", "Secure messaging", "Real-time updates"]
          },
          community: {
            title: "Find People", 
            description: "Discover and connect with other farmers",
            points: ["Search by username", "Browse all users", "Start conversations", "Build network"]
          }
        },
        stats: {
          title: "Quick Stats",
          activeFarmers: "Active Farmers",
          successfulAuctions: "Successful Auctions", 
          aiConsultations: "AI Consultations"
        },
        cta: {
          getStarted: "Start with AI Assistant",
          browseAuctions: "Browse Auctions"
        }
      },

      // Authentication
      auth: {
        login: "Login",
        signup: "Sign Up", 
        logout: "Logout",
        forgotPassword: "Forgot Password?",
        resetPassword: "Reset Password",
        email: "Email Address",
        password: "Password",
        confirmPassword: "Confirm Password",
        username: "Username",
        fullName: "Full Name",
        alreadyHaveAccount: "Already have an account?",
        dontHaveAccount: "Don't have an account?",
        loginHere: "Login Here",
        signupHere: "Sign Up Here",
        loggingIn: "Logging In...",
        creatingAccount: "Creating Account...",
        emailVerification: "Email Verification",
        verifyEmail: "Verify Email",
        resendOtp: "Resend OTP",
        otpSent: "OTP sent to your email",
        enterOtp: "Enter the 6-digit OTP"
      },

      // AI Assistant
      ai: {
        title: "AI Farming Assistant",
        placeholder: "Ask me anything about farming...",
        examples: {
          title: "Try asking:",
          crop: "How to grow tomatoes?",
          pest: "How to control aphids?", 
          soil: "How to improve soil health?",
          weather: "Best time to plant wheat?"
        },
        listening: "Listening...",
        speaking: "Speaking...",
        voiceInput: "Voice Input",
        textInput: "Text Input",
        sendMessage: "Send Message",
        clearChat: "Clear Chat",
        newChat: "New Chat"
      },

      // Disease Detection
      disease: {
        title: "Soil & Crop Health Analysis",
        subtitle: "Upload a clear image for AI-powered analysis",
        uploadArea: {
          title: "Upload Image",
          subtitle: "Click to select or drag and drop",
          supportedFormats: "PNG, JPG, WebP up to 10MB",
          analyzing: "Analyzing Image...",
          chooseDifferent: "Choose Different Image"
        },
        results: {
          healthy: "Healthy",
          dry: "Dry Conditions", 
          salinity: "Salinity Detected",
          disease: "Disease Detected",
          viewDetails: "View Technical Details",
          confidence: "Confidence",
          recommendations: "Recommendations"
        },
        analyze: "Analyze Image",
        retake: "Take Another Photo"
      },

      // Weather
      weather: {
        title: "Weather & Farming Alerts",
        current: "Current Conditions",
        forecast: "5-Day Forecast", 
        alerts: "Farming Alerts",
        temperature: "Temperature",
        humidity: "Humidity",
        windSpeed: "Wind Speed",
        rainfall: "Rainfall",
        uvIndex: "UV Index",
        soilMoisture: "Soil Moisture",
        recommendation: "Today's Recommendation"
      },

      // Marketplace/Auction
      marketplace: {
        title: "Agricultural Marketplace",
        subtitle: "Buy and sell agricultural products and equipment",
        categories: {
          all: "All Categories",
          grains: "Grains & Cereals",
          vegetables: "Vegetables",
          fruits: "Fruits", 
          equipment: "Equipment",
          seeds: "Seeds & Fertilizers",
          livestock: "Livestock"
        },
        listing: {
          title: "Create Listing",
          productName: "Product Name",
          description: "Description", 
          category: "Category",
          price: "Starting Price",
          location: "Location",
          images: "Upload Images",
          create: "Create Listing"
        },
        bid: {
          currentBid: "Current Bid",
          placeBid: "Place Bid",
          bidAmount: "Bid Amount",
          timeLeft: "Time Left",
          bidHistory: "Bid History",
          winner: "Winning Bid"
        }
      },

      // Messages/Chat
      messages: {
        title: "Messages",
        newMessage: "New Message",
        searchConversations: "Search conversations...",
        typeMessage: "Type a message...",
        sendMessage: "Send",
        noMessages: "No messages yet",
        startConversation: "Start a conversation",
        online: "Online",
        offline: "Offline",
        lastSeen: "Last seen"
      },

      // Settings
      settings: {
        title: "Settings",
        language: "Language",
        notifications: "Notifications",
        theme: "Theme",
        accessibility: "Accessibility",
        account: "Account Settings",
        privacy: "Privacy",
        about: "About",
        version: "Version",
        enableVoice: "Enable Voice Features",
        enableTTS: "Enable Text-to-Speech",
        voiceLanguage: "Voice Language",
        fontSize: "Font Size",
        highContrast: "High Contrast Mode"
      },

      // Accessibility
      accessibility: {
        playAudio: "Play Audio",
        stopAudio: "Stop Audio",
        speakText: "Speak Text",
        voiceInput: "Voice Input",
        screenReader: "Screen Reader Compatible",
        keyboardNavigation: "Use Tab to navigate",
        skipToContent: "Skip to main content",
        altText: "Image description"
      },

      // Error messages
      errors: {
        networkError: "Network connection error",
        serverError: "Server error occurred",
        validationError: "Please check your input",
        authError: "Authentication failed",
        fileUploadError: "File upload failed",
        microphoneError: "Microphone access denied",
        speechError: "Speech recognition error",
        genericError: "Something went wrong"
      },

      // Success messages
      success: {
        loginSuccess: "Login successful",
        signupSuccess: "Account created successfully", 
        profileUpdated: "Profile updated",
        messageSent: "Message sent",
        listingCreated: "Listing created",
        bidPlaced: "Bid placed successfully",
        settingsSaved: "Settings saved"
      }
    }
  },

  hi: {
    translation: {
      // Navigation (Hindi)
      nav: {
        home: "होम",
        aiAssistant: "AI सहायक",
        diseaseDetection: "रोग पहचान",
        weather: "मौसम",
        auction: "बाज़ार",
        chat: "संदेश",
        people: "समुदाय", 
        profile: "प्रोफ़ाइल",
        logout: "लॉग आउट",
        settings: "सेटिंग्स"
      },

      // Common (Hindi)
      common: {
        loading: "लोड हो रहा है...",
        submit: "जमा करें",
        cancel: "रद्द करें",
        save: "सेव करें",
        delete: "हटाएं",
        edit: "संपादित करें",
        search: "खोजें",
        filter: "फ़िल्टर",
        upload: "अपलोड",
        download: "डाउनलोड",
        back: "वापस",
        next: "अगला",
        previous: "पिछला",
        close: "बंद करें",
        open: "खोलें",
        yes: "हाँ",
        no: "नहीं",
        ok: "ठीक है",
        error: "त्रुटि",
        success: "सफलता",
        warning: "चेतावनी",
        info: "जानकारी"
      },

      // Home page (Hindi)
      home: {
        title: "स्मार्ट खेती डैशबोर्ड",
        subtitle: "AI-संचालित सहायता के साथ अपनी कृषि प्रथाओं को बदलें",
        features: {
          aiAssistant: {
            title: "AI कृषि सहायक",
            description: "कई भाषाओं में विशेषज्ञ कृषि सलाह प्राप्त करें",
            points: ["बहुभाषी समर्थन", "फसल-विशिष्ट मार्गदर्शन", "24/7 उपलब्धता", "आवाज़ इंटरैक्शन"]
          },
          diseaseDetection: {
            title: "रोग पहचान",
            description: "तत्काल विश्लेषण के लिए मिट्टी/फसल की छवियां अपलोड करें",
            points: ["तत्काल छवि विश्लेषण", "उपचार सुझाव", "विश्वास स्कोरिंग", "मिट्टी स्वास्थ्य जांच"]
          }
        },
        stats: {
          title: "त्वरित आंकड़े",
          activeFarmers: "सक्रिय किसान",
          successfulAuctions: "सफल नीलामी",
          aiConsultations: "AI परामर्श"
        }
      },

      // Authentication (Hindi)
      auth: {
        login: "लॉग इन करें",
        signup: "साइन अप करें",
        logout: "लॉग आउट",
        forgotPassword: "पासवर्ड भूल गए?",
        email: "ईमेल पता",
        password: "पासवर्ड",
        username: "उपयोगकर्ता नाम",
        fullName: "पूरा नाम",
        alreadyHaveAccount: "पहले से खाता है?",
        dontHaveAccount: "खाता नहीं है?",
        loginHere: "यहाँ लॉग इन करें",
        signupHere: "यहाँ साइन अप करें"
      },

      // AI Assistant (Hindi)
      ai: {
        title: "AI खेती सहायक",
        placeholder: "खेती के बारे में मुझसे कुछ भी पूछें...",
        examples: {
          title: "पूछने की कोशिश करें:",
          crop: "टमाटर कैसे उगाएं?",
          pest: "एफिड्स को कैसे नियंत्रित करें?",
          soil: "मिट्टी के स्वास्थ्य में सुधार कैसे करें?",
          weather: "गेहूं बोने का सबसे अच्छा समय?"
        },
        listening: "सुन रहा है...",
        speaking: "बोल रहा है...",
        voiceInput: "आवाज़ इनपुट",
        textInput: "टेक्स्ट इनपुट"
      }
    }
  },

  pa: {
    translation: {
      // Navigation (Punjabi)
      nav: {
        home: "ਘਰ",
        aiAssistant: "AI ਸਹਾਇਕ",
        diseaseDetection: "ਬਿਮਾਰੀ ਪਛਾਣ",
        weather: "ਮੌਸਮ",
        auction: "ਬਾਜ਼ਾਰ",
        chat: "ਸੰਦੇਸ਼",
        people: "ਭਾਈਚਾਰਾ",
        profile: "ਪ੍ਰੋਫਾਈਲ",
        logout: "ਲਾਗ ਆਊਟ"
      },

      // Common (Punjabi)
      common: {
        loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
        submit: "ਜਮਾਂ ਕਰੋ",
        cancel: "ਰੱਦ ਕਰੋ",
        save: "ਸੇਵ ਕਰੋ",
        search: "ਖੋਜੋ",
        upload: "ਅਪਲੋਡ",
        back: "ਵਾਪਸ",
        next: "ਅਗਲਾ",
        close: "ਬੰਦ ਕਰੋ",
        yes: "ਹਾਂ",
        no: "ਨਹੀਂ"
      },

      // Home (Punjabi)
      home: {
        title: "ਸਮਾਰਟ ਖੇਤੀ ਡੈਸ਼ਬੋਰਡ",
        subtitle: "AI-ਸੰਚਾਲਿਤ ਸਹਾਇਤਾ ਨਾਲ ਆਪਣੀ ਖੇਤੀਬਾੜੀ ਦੀਆਂ ਪ੍ਰਥਾਵਾਂ ਨੂੰ ਬਦਲੋ"
      },

      // AI Assistant (Punjabi)
      ai: {
        title: "AI ਖੇਤੀ ਸਹਾਇਕ",
        placeholder: "ਖੇਤੀ ਬਾਰੇ ਮੈਨੂੰ ਕੁਝ ਵੀ ਪੁੱਛੋ...",
        listening: "ਸੁਣ ਰਿਹਾ ਹੈ...",
        speaking: "ਬੋਲ ਰਿਹਾ ਹੈ..."
      }
    }
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false // React already escapes values
    },

    react: {
      useSuspense: false
    }
  });

export default i18n;
