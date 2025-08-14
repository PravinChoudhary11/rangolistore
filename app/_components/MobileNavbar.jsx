//app/_components/MobileNavbar.jsx
"use client";
import React, { useState } from "react";
import { Menu, LogIn, Loader2, ChevronRight, ChevronDown, User, LogOut, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import SearchBar from "./SearchBar";
import LoginPopup from "../login/LoginPopup";
import RegisterPopup from "../register/RegisterPopup";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAppData } from "@/lib/providers/AppProviders";

// Define the classicBlueGold theme colors
const classicBlueGold = {
    name: "Ocean Depth Gradient",
    primary: "#173961",     // Deep blue
    accent: "#0f2d4e",      // Darker navy blue
    secondary: "#1e4b87",   // Medium-deep blue
    text: "#ffffff",        // White text
    highlight: "#64b5f6"    // Light blue highlight
};

const BrandHeader = ({ onClose }) => (
  <div
    className="flex flex-col items-center justify-center py-6 px-6 bg-gradient-to-r relative"
    style={{
      background: `linear-gradient(to right, ${classicBlueGold.primary}, ${classicBlueGold.accent})`,
    }}
  >
    {/* Enhanced Close Button with improved positioning and z-index */}
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:scale-105 active:scale-95 group z-10 cursor-pointer"
      style={{ 
        zIndex: 50,
        pointerEvents: 'auto',
        touchAction: 'manipulation'
      }}
    >
      <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200 pointer-events-none" />
    </Button>

    <div className="relative w-full h-16 mb-2 p-2">
      <Image
        src="/logo.png"
        alt="Brand Logo"
        fill
        className="object-contain rounded-full"
        sizes="64px"
      />
    </div>
    <h1 className="text-3xl font-extrabold text-white tracking-tight">
      Rangoli Store
    </h1>
    <p className="text-sm text-white mt-1">
      Discover Amazing Products
    </p>
  </div>
);

const UserProfileSection = ({ 
  user, 
  loading, 
  onLogout, 
  onShowLogin, 
  onShowRegister, 
  onCloseSheet 
}) => {
  // Helper function to get user initials
  const getUserInitials = (user) => {
    if (!user) {
      return 'U'; // Default when not logged in
    }
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

  // Helper function to get display name
  const getDisplayName = (user) => {
    if (!user) return 'Guest';
    return user.name || user.email?.split('@')[0] || 'User';
  };

  // Helper function to get safe avatar src
  const getAvatarSrc = (user) => {
    if (!user) return undefined; // Return undefined instead of empty string
    const src = user.image || user.avatar;
    return src && src.trim() !== '' ? src : undefined; // Only return valid non-empty strings
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* User Profile Header */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
        <Avatar className="h-12 w-12">
          <AvatarImage
            key={user?.image} // <== forces React to re-render image
            src={getAvatarSrc(user)}
            alt={getDisplayName(user)}
            onError={(e) => {
              console.warn("Avatar failed:", e.target.src);
            }}
          />
          <AvatarFallback className="bg-indigo-500 text-white font-medium text-lg">
            {getUserInitials(user)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{getDisplayName(user)}</p>
          <p className="text-sm text-gray-500">
            {user ? user.email : 'Not signed in'}
          </p>
        </div>
      </div>

      <Separator />

      {/* User Menu Options */}
      {user ? (
        // Logged in user options
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => {
              onCloseSheet();
              window.location.href = '/profile';
            }}
          >
            <User className="mr-3 h-5 w-5" />
            My Profile
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => {
              onCloseSheet();
              window.location.href = '/orders';
            }}
          >
            <User className="mr-3 h-5 w-5" />
            My Orders
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-12"
            onClick={() => {
              onCloseSheet();
              window.location.href = '/settings';
            }}
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
          
          <Separator />
          
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              onCloseSheet();
              onLogout();
            }}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      ) : (
        // Not logged in options
        <div className="space-y-2">
          <Button 
            className="w-full h-12"
            style={{
              background: `linear-gradient(to right, ${classicBlueGold.primary}, ${classicBlueGold.accent})`,
              color: classicBlueGold.text,
            }}
            onClick={() => {
              onCloseSheet();
              onShowLogin();
            }}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Sign In
          </Button>
          
          <Button 
            variant="outline"
            className="w-full h-12"
            onClick={() => {
              onCloseSheet();
              onShowRegister();
            }}
          >
            Create Account
          </Button>
        </div>
      )}
    </div>
  );
};

const MobileNavbar = ({ categories, isLoading, error, isOpen, setIsOpen }) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
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

  const handleShowRegister = () => {
    setShowRegisterPopup(true);
  };

  const handleCloseSheet = () => {
    setIsOpen(false);
  };

  // Handler for when search result is clicked
  const handleSearchResultClick = () => {
    handleCloseSheet();
  };

  const handleLoginSuccess = () => {
    refetchAuth(); // Refresh auth state after login
    console.log('User logged in successfully from mobile navbar!');
  };

  const handleRegisterSuccess = () => {
    refetchAuth(); // Refresh auth state after registration
    console.log('User registered successfully from mobile navbar!');
  };

  const handleSwitchToLogin = () => {
    setShowRegisterPopup(false);
    setShowLoginPopup(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginPopup(false);
    setShowRegisterPopup(true);
  };

  return (
    <>
      <div className="md:hidden bg-white rounded-full">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] p-0 [&>button]:hidden">
            <SheetHeader>
              <VisuallyHidden>
                <SheetTitle>Mobile Navigation</SheetTitle>
              </VisuallyHidden>
            </SheetHeader>

            <ScrollArea className="h-full">
              <BrandHeader onClose={handleCloseSheet} />

              <div className="p-4 space-y-4">
                <div className="border-rounded-full border-gray-800">
                  <SearchBar onResultClick={handleSearchResultClick} />
                </div>
              </div>

              <Separator />

              {/* User Profile Section */}
              <UserProfileSection 
                user={user} 
                loading={authLoading} 
                onLogout={handleLogout}
                onShowLogin={handleShowLogin}
                onShowRegister={handleShowRegister}
                onCloseSheet={handleCloseSheet}
              />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Login Popup - Fixed version */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Register Popup */}
      <RegisterPopup
        isOpen={showRegisterPopup}
        onClose={() => setShowRegisterPopup(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default MobileNavbar;