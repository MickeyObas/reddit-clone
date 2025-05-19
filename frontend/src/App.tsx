import './App.css';
import { ModalProvider } from './contexts/ModalContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './config';



const App = () => {

  return (
    <>
      <ModalProvider>
        <Toaster position='top-right' reverseOrder={false} toastOptions={{duration: 5000}}/>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AppRoutes />
        </GoogleOAuthProvider>
      </ModalProvider>
    </>
  )
}

export default App
