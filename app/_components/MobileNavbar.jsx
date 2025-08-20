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
import CartIcon from "@/app/_components/CartIcon";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAppData } from "@/lib/providers/AppProviders";
import { useCart } from "@/lib/contexts/CartContext";

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
    className="flex flex-col items-center justify-center py-8 px-6 bg-gradient-to-br relative overflow-hidden"
    style={{
      background: `linear-gradient(135deg, ${classicBlueGold.primary} 0%, ${classicBlueGold.secondary} 50%, ${classicBlueGold.accent} 100%)`,
    }}
  >
    {/* Decorative elements */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
    <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-300/20 rounded-full blur-lg"></div>

    {/* Enhanced Close Button */}
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white transition-all duration-300 hover:scale-110 active:scale-95 group z-10 cursor-pointer shadow-lg"
      style={{ 
        zIndex: 50,
        pointerEvents: 'auto',
        touchAction: 'manipulation'
      }}
    >
      <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300 pointer-events-none" />
    </Button>

    <div className="relative w-20 h-20 mb-4 p-2 z-10">
      <div className="absolute inset-0 bg-white/20 rounded-full backdrop-blur-sm"></div>
      <Image
        src="/logo.png"
        alt="Brand Logo"
        fill
        className="object-contain rounded-full z-10 relative"
        sizes="80px"
      />
    </div>
    <h1 className="text-4xl font-black text-white tracking-tight mb-1 z-10 relative">
      Rangoli Store
    </h1>
    <p className="text-base text-white/90 font-medium z-10 relative">
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
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <span className="text-gray-600 font-medium">Loading your profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* User Profile Header with enhanced styling */}
      <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 border border-gray-200/50 shadow-sm">
        <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
          <AvatarImage
            key={user?.image}
            src={getAvatarSrc(user)}
            alt={getDisplayName(user)}
            onError={(e) => {
              console.warn("Avatar failed:", e.target.src);
            }}
          />
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
            {getUserInitials(user)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-bold text-xl text-gray-900">{getDisplayName(user)}</p>
          <p className="text-sm text-gray-600 font-medium">
            {user ? user.email : 'Not signed in'}
          </p>
          {user && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* User Menu Options */}
      {user ? (
        // Logged in user options with enhanced styling
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start h-14 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl border border-transparent hover:border-blue-200/50 transition-all duration-300 group"
            onClick={() => {
              onCloseSheet();
              window.location.href = '/profile';
            }}
          >
            <User className="mr-4 h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-gray-700 group-hover:text-indigo-700">My Profile</span>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-14 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl border border-transparent hover:border-green-200/50 transition-all duration-300 group"
            onClick={() => {
              onCloseSheet();
              window.location.href = '/orders';
            }}
          >
            <User className="mr-4 h-5 w-5 text-green-600 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-gray-700 group-hover:text-green-700">My Orders</span>
          </Button>

          {/* Cart Button - Only visible in mobile menu */}
          <Button
            variant="ghost"
            className="w-full justify-between h-14 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl border border-transparent hover:border-purple-200/50 transition-all duration-300 group"
            onClick={() => {
              onCloseSheet();
              window.location.href = '/cart';
            }}
          >
            <div className="flex items-center">
              <div className="mr-4 group-hover:scale-110 transition-transform duration-200">
                <CartIcon variant="compact" showTooltip={false} />
              </div>
              <span className="font-semibold text-gray-700 group-hover:text-purple-700">Shopping Cart</span>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start h-14 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 rounded-xl border border-transparent hover:border-gray-200/50 transition-all duration-300 group"
            onClick={() => {
              onCloseSheet();
              window.location.href = '/settings';
            }}
          >
            <Settings className="mr-4 h-5 w-5 text-gray-600 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold text-gray-700 group-hover:text-gray-700">Settings</span>
          </Button>
          
          <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          
          <Button
            variant="ghost"
            className="w-full justify-start h-14 text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl border border-transparent hover:border-red-200/50 transition-all duration-300 group"
            onClick={() => {
              onCloseSheet();
              onLogout();
            }}
          >
            <LogOut className="mr-4 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-semibold">Sign Out</span>
          </Button>
        </div>
      ) : (
        // Not logged in options with enhanced styling
        <div className="space-y-4">
          <Button 
            className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${classicBlueGold.primary} 0%, ${classicBlueGold.secondary} 100%)`,
              color: classicBlueGold.text,
            }}
            onClick={() => {
              onCloseSheet();
              onShowLogin();
            }}
          >
            <LogIn className="mr-3 h-6 w-6" />
            Sign In
          </Button>
          
          <Button 
            variant="outline"
            className="w-full h-14 text-lg font-bold rounded-xl border-2 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
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

// Footer component for "Powered by RangoliStore™"
const BrandFooter = () => (
  <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
    <div className="text-center">
      <p className="text-xs text-gray-500 font-medium tracking-wide">
        POWERED BY
      </p>
      <div className="flex items-center justify-center gap-2 mt-1">
        <div className="w-6 h-6 relative">
          <Image
            src="/logo.png"
            alt="Brand Logo"
            fill
            className="object-contain rounded-full"
            sizes="24px"
          />
        </div>
        <span className="text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          RangoliStore™
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-1 font-medium">
        Your Premium Shopping Destination
      </p>
    </div>
  </div>
);

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

  // Get cart data for notification dot
  const { cartItemsCount } = useCart();

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
      <div className="flex items-center">
        {/* Mobile Menu Button with Notification Dot */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-2xl bg-white/20 hover:bg-white/30 shadow-lg hover:shadow-xl border border-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Menu className="h-6 w-6 text-white" />
              </Button>
              
              {/* Notification Dot - Shows when cart has items and user is authenticated */}
              {user && cartItemsCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white animate-bounce">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          </SheetTrigger>
          <SheetContent side="right" className="w-[90vw] max-w-sm p-0 [&>button]:hidden">
            <SheetHeader>
              <VisuallyHidden>
                <SheetTitle>Mobile Navigation</SheetTitle>
              </VisuallyHidden>
            </SheetHeader>

            <ScrollArea className="h-full">
              <BrandHeader onClose={handleCloseSheet} />

              {/* Mobile Header Actions - Inside Sheet */}
              <div className="p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 border-b border-gray-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Quick Search</h2>
                </div>
                
                {/* Enhanced Search Bar */}
                <div className="border-2 rounded-2xl border-gray-200/50 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                  <SearchBar onResultClick={handleSearchResultClick} />
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

              {/* User Profile Section */}
              <UserProfileSection 
                user={user} 
                loading={authLoading} 
                onLogout={handleLogout}
                onShowLogin={handleShowLogin}
                onShowRegister={handleShowRegister}
                onCloseSheet={handleCloseSheet}
              />
              
              {/* Brand Footer - Replaces Quick Links */}
              <BrandFooter />
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