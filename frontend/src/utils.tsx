import { Outlet, Navigate, useLocation } from "react-router-dom";


export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export function ProtectedRoutes(){
    const isAuthenticated = !!localStorage.getItem('accessToken');
    const location = useLocation();
    
    return (
        isAuthenticated ?
        <Outlet /> :
        <Navigate to='/login' state={{ from: location }} replace />
    )
}

export const isObjectEmpty = (obj: object | null | undefined) => {
  if(!obj){
    return true;
  }
  return Array.from(Object.keys(obj)).length === 0;
}