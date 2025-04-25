import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SettingsHeader = () => {
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForScroll = () => {
    if (!menuRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = menuRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth + 0.7 < scrollWidth);
    console.log((scrollLeft + clientWidth), scrollWidth);
  };

  const scroll = (direction: string) => {
    if (menuRef.current) {
      const scrollAmount = 500;
      menuRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    const menuEl = menuRef.current;
    if (!menuEl) return;

    checkForScroll();

    // Add scroll event listener
    menuEl.addEventListener("scroll", checkForScroll);
    window.addEventListener("resize", checkForScroll);

    // Cleanup
    return () => {
      menuEl.removeEventListener("scroll", checkForScroll);
      window.removeEventListener("resize", checkForScroll);
    };
  }, []);

  return (
    <>
      <h1 className="font-bold text-[32px] mt-6 px-4">Settings</h1>
      <div className="ps-4 pe-8 relative mt-2">
        <div ref={menuRef} className="flex items-center overflow-x-auto no-scrollbar gap-x-2">
          {["account", "profile", "privacy", "preferences", "notifications", "email"].map((tab, idx) => (
            <Link
              to={`/settings/${tab}/`}
              key={idx} 
              className={`border-b-[3px] flex flex-col font-semibold text-gray-500 px-4 py-2 ${location.pathname.includes(tab) ? ' border-b-slate-400' : 'border-b-transparent'}`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Link>
          ))}
          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 p-2 ps-5 bottom-1/2 flex items-center translate-y-1/2 bg-linear-to-r from-[rgba(0,0,0,0)] from-0% to-30% to-white">
              <ChevronLeft size={18} />
            </button>
          )}
          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-4 p-2 ps-5 bottom-1/2 flex items-center translate-y-1/2 bg-linear-to-r from-[rgba(0,0,0,0)] from-0% to-30% to-white">
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default SettingsHeader;