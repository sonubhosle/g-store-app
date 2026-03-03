import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../states/Auth/Action";
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  UserRound,
  Mail,
  Shield
} from "lucide-react";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
      theme: "dark",
    });
    dispatch(logoutUser());
    navigate("/auth");
  };

  const dropdownItems = [
    { 
      icon: User, 
      label: "Profile", 
      action: () => navigate("/admin/profile"),
      color: "text-emerald-400"
    },
    { 
      icon: Mail, 
      label: "Messages", 
      action: () => navigate("/admin/messages"),
      color: "text-blue-400",
      badge: "3"
    },
    { 
      icon: Settings, 
      label: "Settings", 
      action: () => navigate("/admin/settings"),
      color: "text-violet-400"
    },
    { 
      type: "divider"
    },
    { 
      icon: LogOut, 
      label: "Sign Out", 
      action: handleLogout,
      color: "text-red-400",
      danger: true
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-end bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3 ">
      
      <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-3xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all duration-300 ">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-3xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all duration-300  group"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="relative w-10 h-10 bg-linear-to-br from-slate-200 to-slate-300 rounded-2xl border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user?.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>

            {/* User info */}
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-semibold text-slate-700 leading-tight">
                {user?.name || "Admin"} {user?.surname || ""}
              </span>
              <span className="text-xs text-slate-500 leading-tight">
                {user?.role || "USER"}
              </span>
            </div>

            {/* Chevron */}
            <ChevronDown 
              size={16} 
              className={`text-slate-400 transition-transform duration-300 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown menu */}
          <div
            className={`
              absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden
              transition-all duration-300 origin-top-right
              ${isDropdownOpen 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }
            `}
          >
            {/* User info card */}
            <div className="p-4 bg-linear-to-br from-slate-50 to-white border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="relative w-12 h-12 bg-linear-to-br from-slate-200 to-slate-300 rounded-2xl border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
                    {user?.photo ? (
                      <img
                        src={user.photo}
                        alt={user?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserRound className="w-6 h-6 text-slate-500" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-800 truncate">
                    {user?.name || "User"} {user?.surname || ""}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {user?.email || "user@example.com"}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {user?.role === "ADMIN" && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                        <Shield size={10} />
                        ADMIN
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-2">
              {dropdownItems.map((item, index) => {
                if (item.type === "divider") {
                  return (
                    <div key={index} className="my-2 border-t border-slate-100" />
                  );
                }

                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsDropdownOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200
                      ${item.danger 
                        ? 'hover:bg-red-50 text-red-600' 
                        : 'hover:bg-slate-50 text-slate-700'
                      }
                    `}
                  >
                    <div className={`
                      w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
                      ${item.danger 
                        ? 'bg-red-50 group-hover:bg-red-100' 
                        : 'bg-slate-100 group-hover:bg-slate-200'
                      }
                    `}>
                      <Icon size={16} className={item.color} />
                    </div>
                    <span className="flex-1 text-left text-sm font-medium">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

   
    </header>
  );
};

export default Header;