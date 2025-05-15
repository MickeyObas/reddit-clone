import './App.css';
import { ModalProvider } from './contexts/ModalContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';



const App = () => {

  return (
    <>
      <ModalProvider>
        <Toaster position='top-right' reverseOrder={false} toastOptions={{duration: 5000}}/>
        <GoogleOAuthProvider clientId='122624213242-71mdgmfrnltubnb8l7ss0ikpfabhvmf7.apps.googleusercontent.com'>
          <AppRoutes />
        </GoogleOAuthProvider>
      </ModalProvider>
    </>
  )
}

export default App
