// DesktopNavbar.jsx
"use client";
import React, { useState } from "react";
import { LogIn, Loader2, User, LogOut, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SearchBar from "./SearchBar";
import LoginPopup from "../login/LoginPopup";
import RegisterPopup from "../register/RegisterPopup";
import { useAppData } from "@/lib/providers/AppProviders";
import CartIcon from "@/app/_components/CartIcon";

const ProfileButton = ({ user, onLogout, onShowLogin, loading }) => {
  if (loading) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        disabled 
        className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 shadow-sm h-12 w-12"
      >
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </Button>
    );
  }

  const getUserInitials = (user) => {
    if (!user) return 'U';
    if (user.name) {
      const names = user.name.trim().split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  const getDisplayName = (user) => {
    if (!user) return 'Guest';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  const getAvatarSrc = (user) => {
    if (!user) return undefined;
    const src = user.image;
    return src && src.trim() !== '' ? src : undefined;
  };

  return (
    <DropdownMenu key={user ? 'authenticated' : 'unauthenticated'}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-12 w-12 rounded-full bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm"
        >
          <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
            <AvatarImage
              key={user?.image}
              src={getAvatarSrc(user)}
              alt={getDisplayName(user)}
              onError={(e) => {
                console.warn("Avatar failed:", e.target.src);
              }}
            />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-base">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          
          {/* Status indicator for logged in users */}
          {user && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm">
              <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-md bg-white/95" align="end" forceMount>
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                  <AvatarImage src={getAvatarSrc(user)} alt={getDisplayName(user)} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-base font-bold text-gray-900 leading-tight">{getDisplayName(user)}</p>
                  <p className="text-sm text-gray-600 font-medium mt-0.5">
                    {user.email}
                  </p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Online
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
            <DropdownMenuItem 
              onClick={() => window.location.href = '/profile'}
              className="h-12 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group px-4"
            >
              <User className="mr-3 h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold text-gray-700 group-hover:text-indigo-700">Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => window.location.href = '/orders'}
              className="h-12 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200 cursor-pointer group px-4"
            >
              <Sparkles className="mr-3 h-5 w-5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold text-gray-700 group-hover:text-green-700">My Orders</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => window.location.href = '/settings'}
              className="h-12 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-200 cursor-pointer group px-4"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold text-gray-700">Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
            <DropdownMenuItem 
              onClick={onLogout}
              className="h-12 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 cursor-pointer group px-4"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold text-red-600 group-hover:text-red-700">Sign Out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="font-normal p-4 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 mb-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white font-bold">
                    G
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-base font-bold text-gray-900">Guest User</p>
                  <p className="text-sm text-gray-500 font-medium">
                    Sign in to access your account
                  </p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mt-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    Guest
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
            <DropdownMenuItem 
              onClick={onShowLogin}
              className="h-12 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 cursor-pointer group px-4"
            >
              <LogIn className="mr-3 h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-semibold text-gray-700 group-hover:text-indigo-700">Sign In to Continue</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DesktopNavbar = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  
  // Use the combined hook for auth data only
  const {
    user,
    authLoading,
    logout,
    refetchAuth
  } = useAppData();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleShowLogin = () => {
    setShowLoginPopup(true);
  };

  const handleLoginSuccess = () => {
    refetchAuth();
  };

  const handleRegisterSuccess = () => {
    refetchAuth();
  };

  const handleSwitchToRegister = () => {
    setShowLoginPopup(false);
    setShowRegisterPopup(true);
  };

  return (
    <>
      <div className="hidden md:flex items-center w-full justify-between gap-4 px-4">
        {/* Search Bar - Centered and properly sized */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="w-full rounded-2xl border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 hover:border-indigo-200">
            <SearchBar />
          </div>
        </div>

        {/* Right-aligned icons container */}
        <div className="flex items-center gap-5 flex-shrink-0">
          {/* Cart Icon with circular design */}
          <CartIcon 
            variant="circular" 
            className="relative" 
            showTooltip={true}
          />

          {/* Profile Button */}
          <ProfileButton 
            user={user} 
            onLogout={handleLogout} 
            onShowLogin={handleShowLogin}
            loading={authLoading} 
          />
        </div>
      </div>

      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterPopup
        isOpen={showRegisterPopup}
        onClose={() => setShowRegisterPopup(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => {
          setShowRegisterPopup(false);
          setShowLoginPopup(true);
        }}
      />
    </>
  );
};

export default DesktopNavbar;