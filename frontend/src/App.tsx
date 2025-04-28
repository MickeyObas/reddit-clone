import './App.css';
import { ModalProvider } from './contexts/ModalContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';


function App() {

  return (
    <>
      <ModalProvider>
        <Toaster position='top-right' reverseOrder={false}/>
        <AppRoutes />
      </ModalProvider>
    </>
  )
}

export default App
