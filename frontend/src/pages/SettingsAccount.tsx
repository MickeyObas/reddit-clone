import { ChevronRight, SquareArrowOutUpRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const SettingsAccount = () => {
  const { user } = useAuth();

  return (
    <div className="grid grid-cols-1 pt-6 ps-4 pe-6">
      <div className="mb-8">
        <h1 className="font-bold text-xl mb-4">General</h1>
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-[90%]">
              <span className="w-[28%]">Email address</span>
              <span className="text-xs">{user?.email}</span>
            </div>
            <div className="flex justify-end items-center w-9">
              <ChevronRight size={18}/>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-[90%]">
              <span className="w-[28%]">Gender</span>
              <span className="text-xs">Man</span>
            </div>
            <div className="flex justify-end items-center w-9">
              <ChevronRight size={18}/>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between w-[90%]">
              <span className="w-[28%]">Location customization</span>
              <span className="text-xs text-right">Use approximate location (based on IP)</span>
            </div>
            <div className="flex justify-end items-center w-9">
              <ChevronRight size={18}/>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="font-bold text-xl mb-4">Account authorization</h1>
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-[60%] gap-y-1">
              <span className="font-medium">Google</span>
              <span className="text-xs">Connect to log in to Reddit with your Google account</span>
            </div>
            <div className="flex justify-center items-center">
              <button className="border border-gray-400 rounded-full px-4 py-3 font-semibold">Disconnect</button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-[60%] gap-y-1">
              <span className="font-medium">Apple</span>
              <span className="text-xs">Connect to log in to Reddit with your Apple account</span>
            </div>
            <div className="flex justify-center items-center">
              <button className="rounded-full px-4 py-3 font-semibold bg-gray-white">Connect</button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-[60%] gap-y-0.5">
              <span className="font-medium">Two-factor authentication</span>
              <span className="text-xs">Lost access to your authenticator app?</span>
              <span className="text-xs text-blue-700">Access your backup codes</span>
            </div>
            <div className="flex justify-center items-center gap-3">
              <span>Enable</span>
              <SquareArrowOutUpRight size={16} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h1 className="font-bold text-xl mb-4">Subscriptions</h1>
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-[60%] gap-y-0.5">
              <span className="font-medium">Get premium</span>
            </div>
            <div className="flex justify-center items-center">
              <SquareArrowOutUpRight size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="font-bold text-xl mb-4">Advanced</h1>
        <div className="flex flex-col gap-y-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-[60%] gap-y-0.5">
              <span className="font-medium">Delete account</span>
            </div>
            <div className="flex justify-end items-center w-11">
              <ChevronRight size={18}/>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default SettingsAccount;