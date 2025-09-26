
import React, { Suspense } from 'react'
import {Routes,Route} from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/Login'))
const Emailverify = React.lazy(() => import('./pages/Emailverify'))
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'))
const Updates = React.lazy(() => import('./pages/Updates'))
const AIAssistant = React.lazy(() => import('./pages/AIAssistant'))
const Auction = React.lazy(() => import('./pages/Auction'))
const AuctionDetail = React.lazy(() => import('./pages/AuctionDetail'))
const DiseaseDetection = React.lazy(() => import('./pages/DiseaseDetection'))
const Profile = React.lazy(() => import('./pages/profile'))
const Chat = React.lazy(() => import('./pages/Chat'))
const People = React.lazy(() => import('./pages/People'))
const Payments = React.lazy(() => import('./pages/Payments'))


const App = () => {
  return (
    <div>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
          <LoadingSpinner size="xl" text="Loading application..." />
        </div>
      }>
        <Routes>
          <Route path='/' element={<RequireAuth><Home/></RequireAuth>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/auction' element={<RequireAuth><Auction/></RequireAuth>}/>
          <Route path='/auction/:id' element={<AuctionDetail/>}/>
          <Route path='/email-verify' element={<Emailverify/>}/>
          <Route path='/reset-password' element={<ResetPassword/>}/>
          <Route path='/updates' element={<RequireAuth><Updates/></RequireAuth>}/>
          <Route path='/AI-Assistant' element={<RequireAuth><AIAssistant/></RequireAuth>}/>
          <Route path='/Disease-Detection' element={<RequireAuth><DiseaseDetection/></RequireAuth>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/chat' element={<RequireAuth><Chat/></RequireAuth>}/>
          <Route path='/people' element={<RequireAuth><People/></RequireAuth>}/>
          <Route path='/payments' element={<RequireAuth><Payments/></RequireAuth>}/>
        </Routes>
      </Suspense>
    </div>
  )
}


export default App
