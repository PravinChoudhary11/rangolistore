
import React from 'react';
import { FileText, AlertTriangle, Scale, Mail, Phone, MapPin, User, Shield, Eye, Lock, Globe, Building } from 'lucide-react';

const TermsOfService = () => {
  const colorTheme = {
    primary: "#173961",
    accent: "#0f2d4e",
    secondary: "#1e4b87",
    text: "#ffffff",
    highlight: "#1E88E5",
    lightBg: "#f8fafc",
    darkText: "#2d3748"
  };

  const legalSections = [
    {
      icon: FileText,
      title: "Website Content",
      description: "The content of the pages of this website is subject to change without notice. Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose.",
      color: "blue"
    },
    {
      icon: User,
      title: "Your Responsibility", 
      description: "It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.",
      color: "green"
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      description: "Our website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.",
      color: "purple"
    },
    {
      icon: Globe,
      title: "External Links",
      description: "From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information. You may not create a link to our website from another website or document without DEVARAM GUNESHARAM CHOUDHARI's prior written consent.",
      color: "orange"
    }
  ];

  const trustIndicators = [
    {
      icon: Scale,
      title: "Legal Compliance",
      description: "Compliant with Indian law"
    },
    {
      icon: Shield,
      title: "User Protection",
      description: "Clear terms and conditions"
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Open and honest policies"
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
        {/* Mobile-optimized background shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-5 -left-5 sm:-top-10 sm:-left-10 w-20 h-20 sm:w-40 sm:h-40 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-10 right-10 sm:top-20 sm:right-20 w-16 h-16 sm:w-32 sm:h-32 bg-white rounded-full animate-bounce"></div>
          <div className="absolute bottom-5 left-1/4 sm:bottom-10 w-12 h-12 sm:w-24 sm:h-24 bg-white rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-bounce mb-6 sm:mb-8">
            <FileText size={60} className="sm:w-20 sm:h-20 mx-auto" style={{ color: colorTheme.text }} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" style={{ color: colorTheme.text }}>
            Terms of Service
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl px-4 sm:px-0" style={{ color: `${colorTheme.text}CC` }}>
            Please read these terms and conditions carefully
          </p>

          {/* Mobile-optimized trust indicators */}
          <div className="mt-8 sm:mt-12 grid grid-cols-3 sm:flex sm:justify-center gap-2 sm:gap-8 text-xs sm:text-sm max-w-2xl mx-auto">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex flex-col items-center space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                <indicator.icon size={14} style={{ color: colorTheme.highlight }} />
                <span style={{ color: colorTheme.text }} className="text-center leading-tight">{indicator.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Mobile-First Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-6 sm:p-8 md:p-12 lg:p-16">
          
          {/* Introduction - Mobile Optimized */}
          <section className="mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 sm:p-8 rounded-2xl border-l-4" style={{ borderColor: colorTheme.highlight }}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left" style={{ color: colorTheme.primary }}>
                <AlertTriangle size={28} />
                <span>Important Notice</span>
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                For the purpose of these Terms and Conditions, the term "we", "us", "our" used anywhere on this page shall mean <strong>DEVARAM GUNESHARAM CHOUDHARI</strong>, whose registered/operational office is Main Road Kodoli, Kolhapur, Maharashtra 416114. "You", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
              </p>
            </div>
          </section>

          {/* Terms and Conditions - Mobile Cards */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center" style={{ color: colorTheme.primary }}>
              Terms and Conditions
            </h2>
            
            <div className="space-y-6 sm:space-y-8">
              {legalSections.map((section, index) => (
                <div key={index} className={`bg-${section.color}-50 p-6 sm:p-8 rounded-2xl border-l-4 border-${section.color}-400 hover:shadow-lg transition-all duration-300`}>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                    <div className={`bg-${section.color}-100 p-3 rounded-xl`}>
                      <section.icon size={24} className={`text-${section.color}-600`} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-center sm:text-left" style={{ color: colorTheme.secondary }}>
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                    {section.description}
                  </p>
                </div>
              ))}

              {/* Disclaimer - Special styling */}
              <div className="bg-yellow-50 p-6 sm:p-8 rounded-2xl border-l-4 border-yellow-400">
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3">
                  <AlertTriangle className="text-yellow-600 mt-1 mx-auto sm:mx-0" size={24} />
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colorTheme.secondary }}>
                      Disclaimer
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: colorTheme.darkText }}>
                      You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law. Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trademarks */}
              <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center sm:text-left" style={{ color: colorTheme.secondary }}>
                  Trademarks
                </h3>
                <p className="text-sm sm:text-base text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                  All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website. Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Jurisdiction - Mobile Alert */}
          <section className="mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-red-50 to-pink-100 p-6 sm:p-8 rounded-2xl border-l-4 border-red-400">
              <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-3">
                <Scale className="text-red-600 mt-1 mx-auto sm:mx-0" size={28} />
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: colorTheme.primary }}>
                    Legal Jurisdiction
                  </h2>
                  <p className="text-sm sm:text-base" style={{ color: colorTheme.darkText }}>
                    Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Transactions - Mobile Card */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center" style={{ color: colorTheme.primary }}>
              Payment Transactions
            </h2>
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 sm:p-8 rounded-2xl">
              <p className="text-sm sm:text-base text-center sm:text-left" style={{ color: colorTheme.darkText }}>
                We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any transaction, on account of the cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
              </p>
            </div>
          </section>

          {/* Business Information - Mobile Grid */}
          <section className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center" style={{ color: colorTheme.primary }}>
              Business Information
            </h2>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-100 p-6 sm:p-8 rounded-2xl border-l-4 border-indigo-400">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
                <Building className="text-indigo-600" size={28} />
                <h3 className="text-lg sm:text-xl font-semibold text-center sm:text-left" style={{ color: colorTheme.primary }}>
                  Legal Entity Details
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8 text-center sm:text-left">
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: `${colorTheme.darkText}80` }}>
                    Business Name
                  </p>
                  <p className="text-base sm:text-lg font-bold" style={{ color: colorTheme.darkText }}>
                    DEVARAM GUNESHARAM CHOUDHARI
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: `${colorTheme.darkText}80` }}>
                    Business Type
                  </p>
                  <p className="text-base sm:text-lg font-bold" style={{ color: colorTheme.darkText }}>
                    Registered Entity
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>  
      </div>
    </div>
  );
};

export default TermsOfService;