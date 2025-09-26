import React from 'react'
import { useI18n } from '../context/I18nContext'

const Header = () => {
  const { t } = useI18n()
  return (
    <div className='bg-gradient-to-b from-[#fef3c7] via-[#fff7ed] to-white'>
    
   {/*<img className="w-full sm:h-170 h-80" src="./public/p1.jpg" />*/}

<div className="flex flex-col md:flex-row justify-around items-center mt-16 gap-12 px-6">
  
  {/* Left side text */}
  <div className="w-full md:w-1/2 text-center md:text-left ml-30 mt-20">
  <div className="bg-[#2a3b1f] text-white p-10 rounded-2xl shadow-xl border border-white/10">
    <h1 className="font-extrabold text-2xl md:text-5xl text-white drop-shadow-lg">
      {t('header_title')}
    </h1>
    <p className="pt-6 text-amber-100 md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
      {t('header_sub')}
    </p>
  </div>
</div>


   

  {/* Right side circle */}

  <div className="w-full md:w-1/2 flex justify-center mt-20">
    <div className="relative grid border-[12px] aspect-square text-[#2a3b1f] rounded-full 
                    w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] md:w-[340px] md:h-[340px]
                    bg-gradient-to-br from-[#ffedd5] to-[#fde68a] shadow-xl">
      
      <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     text-center text-white font-semibold text-lg sm:text-xl">
        बेहतर खेती,<br/>उज्ज्वल भविष्य 🌾

      </h3>

      {/* Floating images with animation */}
      <img className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full top-[-40px] left-1/2 -translate-x-1/2 " src="fertilizer1.jpg" />
      <img className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bottom-[-40px] left-[10%] " src="fertilizer2.jpg" />
      <img className="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bottom-[-40px] right-[10%] " src="fertilizer3.webp" />
    </div>
  </div>
</div>

  
  {/*hero section*/}
  <div>
   <section className="  text-black min-h-screen flex items-center justify-center">
      <div className="text-center px-6 max-w-6xl">
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-12">
          Smart Farming Assistance
        </h1>

        {/* Features in Boxes */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-[#285ca8]  backdrop-blur-lg p-6 rounded-2xl shadow-lg text-left hover:scale-105 transition">
            <h2 className="text-2xl font-semibold mb-2">🌦 Weather-based alerts</h2>
            <p className="text-gray-200">
              Get real-time updates and predictive forecasts to plan your farming activities better.
            </p>
          </div>

          <div className="bg-[#285ca8]  backdrop-blur-lg p-6 rounded-2xl shadow-lg text-left hover:scale-105 transition">
            <h2 className="text-2xl font-semibold mb-2">🐛 Pest & disease detection</h2>
            <p className="text-gray-200">
              Upload crop images to identify pests or diseases early and receive timely advice.
            </p>
          </div>

          <div className="bg-[#285ca8]  backdrop-blur-lg p-6 rounded-2xl shadow-lg text-left hover:scale-105 transition">
            <h2 className="text-2xl font-semibold mb-2">💹 Market price tracking</h2>
            <p className="text-gray-200">
              Stay updated with daily market prices to make informed selling and buying decisions.
            </p>
          </div>

          <div className="bg-[#285ca8]  backdrop-blur-lg p-6 rounded-2xl shadow-lg text-left hover:scale-105 transition">
            <h2 className="text-2xl font-semibold mb-2">🎙 Voice support</h2>
            <p className="text-gray-200">     
              Access features with simple voice commands, designed for low-literate users.
            </p>
          </div>

          <div className="bg-[#285ca8] backdrop-blur-lg p-6 rounded-2xl shadow-lg text-left hover:scale-105 transition">
            <h2 className="text-2xl font-semibold mb-2">📊 Feedback & improvement</h2>
            <p className="text-gray-200">
              Share your experiences to improve services and get smarter recommendations over time.
            </p>
          </div>
          <div className="bg-[#285ca8]  backdrop-blur-lg p-6 rounded-2xl shadow-lg text-left hover:scale-105 transition">
            <h2 className="text-2xl font-semibold mb-2">💹 Soil health recommendationsand guidance</h2>
            <p className="text-gray-200">
              Stay updated with daily market prices to make informed selling and buying decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
    
    </div>
  )
}

export default Header
