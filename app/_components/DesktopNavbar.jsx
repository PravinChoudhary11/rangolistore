//app/_components/DesktopNavbar.jsx
"use client";
import React, { useState } from "react";
import { LogIn, Loader2, User, LogOut, Settings } from "lucide-react";
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

const ProfileButton = ({ user, onLogout, onShowLogin, loading }) => {
  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              key={user?.image}
              src={getAvatarSrc(user)}
              alt={getDisplayName(user)}
              onError={(e) => {
                console.warn("Avatar failed:", e.target.src);
              }}
            />
            <AvatarFallback className="bg-indigo-500 text-white font-medium">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {user ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{getDisplayName(user)}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Guest</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Not signed in
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onShowLogin}>
              <LogIn className="mr-2 h-4 w-4" />
              <span>Sign in</span>
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
      <div className="hidden md:flex items-center w-full justify-end gap-2">
        <div className="flex items-center gap-1">
          <div className="flex-1 max-w-md mb-12">
            <SearchBar />
          </div>
        </div>

        <div className="flex items-center gap-3">
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