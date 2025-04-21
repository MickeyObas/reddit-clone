import { ChevronRight } from "lucide-react";

const SettingsHeader = () => {
  return (
    <>
      <h1 className="font-bold text-[32px] mt-6 px-4">Settings</h1>
      <div className="ps-4 pe-8 relative mt-2">
        <div className="flex items-center overflow-x-auto no-scrollbar gap-x-2">
          <div className="flex flex-col font-semibold text-gray-500 px-4 py-2 border-b-2">Account</div>
          <div className="flex flex-col font-semibold text-gray-500 px-4 py-2">Profile</div>
          <div className="flex flex-col font-semibold text-gray-500 px-4 py-2">Privacy</div>
          <div className="flex flex-col font-semibold text-gray-500 px-4 py-2">Preferences</div>
          <div className="flex flex-col font-semibold text-gray-500 px-4 py-2">Notifications</div>
          <div className="flex flex-col font-semibold text-gray-500 px-4 py-2">Email</div>
          {/* <button className="absolute right-7 p-2 bottom-1/2 flex items-center translate-y-1/2 bg-white">
            <ChevronRight size={18} />
          </button> */}
        </div>
      </div>
    </>
  )
}

export default SettingsHeader;