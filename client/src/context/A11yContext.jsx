import React, { createContext, useContext, useMemo, useState } from 'react'

const A11yContext = createContext({ fontScale: 1, highContrast: false, setFontScale: ()=>{}, toggleContrast: ()=>{} })

export const A11yProvider = ({ children }) => {
  const [fontScale, setFontScale] = useState(Number(localStorage.getItem('fontScale')||'1'))
  const [highContrast, setHighContrast] = useState(localStorage.getItem('highContrast')==='1')
  const value = useMemo(()=>({
    fontScale,
    highContrast,
    setFontScale: (v)=>{ localStorage.setItem('fontScale', String(v)); setFontScale(v) },
    toggleContrast: ()=>{ const v = !highContrast; localStorage.setItem('highContrast', v?'1':'0'); setHighContrast(v) }
  }),[fontScale, highContrast])
  return (
    <A11yContext.Provider value={value}>
      <div style={{ fontSize: `${fontScale*100}%` }} className={highContrast? 'contrast' : ''}>
        {children}
      </div>
    </A11yContext.Provider>
  )
}

export const useA11y = () => useContext(A11yContext)
