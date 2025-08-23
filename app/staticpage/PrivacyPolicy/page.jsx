import React from 'react';
import { Shield, Mail, Phone, MapPin, Eye, Lock, Users, Database, AlertTriangle, CheckCircle, FileText, Heart } from 'lucide-react';

const PrivacyPolicy = () => {
  const colorTheme = {
    primary: "#173961",
    accent: "#0f2d4e",
    secondary: "#1e4b87",
    text: "#ffffff",
    highlight: "#1E88E5",
    lightBg: "#f8fafc",
    darkText: "#2d3748"
  };

  const privacyFeatures = [
    {
      icon: Lock,
      title: "Secure Data",
      description: "Your information is protected with industry-standard security measures"
    },
    {
      icon: Eye,
      title: "Transparent",
      description: "Clear policies on how we collect and use your information"
    },
    {
      icon: Users,
      title: "User Control",
      description: "You have full control over your personal information"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "We prioritize your privacy in everything we do"
    }
  ];

  const informationTypes = [
    { icon: CheckCircle, text: "Name and contact details", color: "green" },
    { icon: CheckCircle, text: "Email address", color: "green" },
    { icon: CheckCircle, text: "Demographic information", color: "blue" },
    { icon: CheckCircle, text: "Purchase preferences", color: "purple" }
  ];

  const usageReasons = [
    {
      title: "Internal Operations",
      description: "Internal record keeping and service improvement",
      icon: Database,
      color: "blue"
    },
    {
      title: "Product Enhancement", 
      description: "We may use the information to improve our products and services",
      icon: Heart,
      color: "green"
    },
    {
      title: "Communication",
      description: "We may periodically send promotional emails about new products and special offers",
      icon: Mail,
      color: "purple"
    },
    {
      title: "Research",
      description: "We may contact you for market research purposes to better serve you",
      icon: Users,
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Mobile-First Header */}
      <div 
        className="relative py-12 sm:py-16 md:py-20 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colorTheme.primary} 0%, ${colorTheme.secondary} 50%, ${colorTheme.accent} 100%)`
        }}
      >
        {/* Mobile-optimized background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-5 -right-5 sm:-top-10 sm:-right-10 w-20 h-20 sm:w-40 sm:h-40 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 w-16 h-16 sm:w-32 sm:h-32 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-white rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-bounce mb-6 sm:mb-8">
            <Shield size={60} className="sm:w-20 sm:h-20 mx-auto" style={{ color: colorTheme.text }} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" style={{ color: colorTheme.text }}>
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl px-4 sm:px-0" style={{ color: `${colorTheme.text}CC` }}>
            Your privacy is our top priority at RangoliStore
          </p>
          
          {/* Mobile-optimized trust badges */}
          <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-xs sm:text-sm max-w-2xl mx-auto">
            {privacyFeatures.map((feature, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <feature.icon size={16} className="sm:w-4 sm:h-4" style={{ color: colorTheme.highlight }} />
                <span style={{ color: colorTheme.text }} className="text-center leading-tight">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile-First Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16">
          
          {/* Introduction - Mobile Optimized */}
          <section className="mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 sm:p-8 rounded-2xl border-l-4" style={{ borderColor: colorTheme.highlight }}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3" style={{ color: colorTheme.primary }}>
                <Shield size={28} />
                <span className="text-center sm:text-left">Our Privacy Commitment</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: colorTheme.darkText }}>
                This privacy policy sets out how <strong>DEVARAM GUNESHARAM CHOUDHARI</strong> uses and protects any information that you give when you visit our website and/or agree to purchase from us. We are committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, you can be assured that it will only be used in accordance with this privacy statement.
              </p>
            </div>
          </section>

          {/* Information Collection - Mobile Grid */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
              <Database size={32} />
              <span>Information We Collect</span>
            </h2>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 sm:p-8 rounded-2xl">
              <p className="mb-6 text-base sm:text-lg text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                We may collect the following information to provide you with better service:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                {informationTypes.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                    <item.icon size={20} className={`text-${item.color}-500`} />
                    <span className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How We Use Information - Mobile Cards */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
              <Users size={32} />
              <span>How We Use Your Information</span>
            </h2>
            <p className="mb-6 text-base sm:text-lg text-center sm:text-left" style={{ color: colorTheme.darkText }}>
              We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
            </p>
            <div className="grid gap-4 sm:gap-6">
              {usageReasons.map((reason, index) => (
                <div key={index} className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg border-l-4 border-${reason.color}-400 hover:shadow-xl transition-all duration-300`}>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className={`bg-${reason.color}-100 p-3 rounded-xl`}>
                      <reason.icon size={24} className={`text-${reason.color}-600`} />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="font-semibold text-lg mb-2" style={{ color: colorTheme.secondary }}>{reason.title}</h3>
                      <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>{reason.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Security Section - Mobile Friendly */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
              <Lock size={32} />
              <span>Security Measures</span>
            </h2>
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 sm:p-8 rounded-2xl border-l-4 border-green-400">
              <p className="text-base sm:text-lg text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
              </p>
            </div>
          </section>

          {/* Cookies Section - Mobile Cards */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
              <Database size={32} />
              <span>How We Use Cookies</span>
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-yellow-50 p-4 sm:p-6 rounded-xl border-l-4 border-yellow-400">
                <h3 className="font-semibold text-lg mb-3 text-center sm:text-left" style={{ color: colorTheme.secondary }}>What are Cookies?</h3>
                <p className="text-sm sm:text-base text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                  A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site.
                </p>
              </div>
              <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border-l-4 border-blue-400">
                <h3 className="font-semibold text-lg mb-3 text-center sm:text-left" style={{ color: colorTheme.secondary }}>Our Cookie Usage</h3>
                <p className="text-sm sm:text-base text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                  We use traffic log cookies to identify which pages are being used. This helps us analyze data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
                </p>
              </div>
              <div className="bg-purple-50 p-4 sm:p-6 rounded-xl border-l-4 border-purple-400">
                <h3 className="font-semibold text-lg mb-3 text-center sm:text-left" style={{ color: colorTheme.secondary }}>Your Choice</h3>
                <p className="text-sm sm:text-base text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                  You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
                </p>
              </div>
            </div>
          </section>

          {/* Controlling Personal Information - Mobile Optimized */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
              <Eye size={32} />
              <span>Controlling Your Personal Information</span>
            </h2>
            <p className="mb-6 text-base sm:text-lg text-center sm:text-left" style={{ color: colorTheme.darkText }}>
              You may choose to restrict the collection or use of your personal information in the following ways:
            </p>
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <p className="text-sm sm:text-base text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                  • Whenever you are asked to fill in information on the website, look for the option to indicate that you do not want the information to be used for direct marketing purposes
                </p>
              </div>
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <p className="text-sm sm:text-base text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                  • If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by contacting us
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-pink-100 p-6 sm:p-8 rounded-2xl border-l-4 border-red-400 mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3">
                <AlertTriangle className="text-red-600 mt-1 mx-auto sm:mx-0" size={24} />
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-lg mb-2" style={{ color: colorTheme.primary }}>Important Promise</h3>
                  <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>
                    We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information - Mobile Grid */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
              <Mail size={32} />
              <span>Contact Us About Privacy</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-blue-50 rounded-xl">
                  <Mail className="text-blue-600" size={24} />
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-base sm:text-lg" style={{ color: colorTheme.primary }}>Email</p>
                    <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>itspracin750@gmail.com</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-green-50 rounded-xl">
                  <Phone className="text-green-600" size={24} />
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-base sm:text-lg" style={{ color: colorTheme.primary }}>Phone</p>
                    <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>8788941075</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-orange-50 rounded-xl">
                  <MapPin className="text-orange-600 mt-1" size={24} />
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-base sm:text-lg" style={{ color: colorTheme.primary }}>Address</p>
                    <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>
                      Main Road Kodoli<br />
                      Kolhapur, Maharashtra 416114
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 sm:p-8 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4 text-center sm:text-left" style={{ color: colorTheme.primary }}>Data Accuracy</h3>
                <p className="text-sm sm:text-base leading-relaxed text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                  If you believe that any information we are holding on you is incorrect or incomplete, please contact us as soon as possible. We will promptly correct any information found to be incorrect.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;