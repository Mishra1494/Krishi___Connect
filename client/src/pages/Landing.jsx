import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaChartLine, FaCloudSunRain, FaRobot, FaArrowRight } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Landing = () => {
  const { t } = useTranslation();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: <FaLeaf className="w-8 h-8 text-brand-500" />,
      title: t('pages.landing.features.cropManagement.title', "Crop Management"),
      description: t('pages.landing.features.cropManagement.desc', "Optimize your yield with smart AI-driven recommendations tailored to your soil and climate.")
    },
    {
      icon: <FaCloudSunRain className="w-8 h-8 text-brand-500" />,
      title: t('pages.landing.features.climateAnalysis.title', "Climate Analysis"),
      description: t('pages.landing.features.climateAnalysis.desc', "Stay ahead of the weather with precise, hyper-local climate forecasting and alerts.")
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-brand-500" />,
      title: t('pages.landing.features.marketInsights.title', "Market Insights"),
      description: t('pages.landing.features.marketInsights.desc', "Connect to realtime market trends and maximize your profit margins easily.")
    },
    {
      icon: <FaRobot className="w-8 h-8 text-brand-500" />,
      title: t('pages.landing.features.aiAgronomist.title', "AI Agronomist"),
      description: t('pages.landing.features.aiAgronomist.desc', "Get immediate answers to your farming questions with our built-in intelligent assistant.")
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 transition-all duration-300 glass-panel border-b-0 rounded-none rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-brand-500 p-2 rounded-xl text-white">
              <FaLeaf className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-slate-800">
              Krishi<span className="text-brand-600">Connect</span>
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
              {t('navigation.login', 'Log in')}
            </Link>
            <Link to="/signup" className="glass-button px-5 py-2.5">
              {t('pages.landing.getStarted', 'Get Started')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 px-6">
          <div className="absolute inset-0 -z-10 overflow-hidden">
             {/* Decorative background blobs */}
             <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
             <div className="absolute top-0 -right-40 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
             <div className="absolute -bottom-40 left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="font-heading text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-8"
            >
              {t('pages.landing.hero.title1', 'Farming')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">{t('pages.landing.hero.title2', 'Reimagined')}</span> {t('pages.landing.hero.title3', 'for the Modern Era.')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              {t('pages.landing.hero.subtitle', 'Krishi Connect brings AI-driven insights, advanced climate tracking, and smart marketplace access directly to your fingertips. Empowering farmers to grow more, with less.')}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/signup" className="glass-button px-8 py-4 text-lg flex items-center justify-center gap-2 group">
                {t('pages.landing.startGrowingFree', 'Start Growing Free')}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="px-8 py-4 text-lg font-medium text-slate-700 bg-white/50 backdrop-blur-md border border-slate-200 hover:bg-white hover:border-slate-300 rounded-lg shadow-sm transition-all duration-300">
                {t('pages.landing.signBackIn', 'Sign back in')}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-white/40 backdrop-blur-sm border-t border-slate-200/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900">{t('pages.landing.intelligenceTitle', 'Intelligence at Every Level')}</h2>
              <p className="mt-4 text-slate-600 text-lg">{t('pages.landing.intelligenceDesc', 'Everything you need to manage your farm efficiently in one unified platform.')}</p>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeIn} className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 font-heading">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
             <div className="glass-card bg-gradient-to-br from-brand-900 to-brand-700 text-white p-12 md:p-16 text-center border-none shadow-2xl overflow-hidden relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="relative z-10">
                  <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">{t('pages.landing.cta.title', 'Ready to Transform Your Yield?')}</h2>
                  <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto">{t('pages.landing.cta.desc', 'Join thousands of modern farmers leveraging data and AI to secure their future.')}</p>
                  <Link to="/signup" className="bg-white text-brand-900 hover:bg-brand-50 px-8 py-4 rounded-lg font-bold text-lg inline-block shadow-lg transition-colors">
                    {t('pages.landing.cta.button', 'Create Your Account')}
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white/50 backdrop-blur-md text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
            <FaLeaf className="w-5 h-5 text-brand-500" />
            <span className="font-heading font-bold text-xl text-slate-800">KrishiConnect</span>
        </div>
        <p className="text-slate-500">{t('footer.copyright', '© 2026 Krishi Connect. All rights reserved.')}</p>
      </footer>
    </div>
  );
};

export default Landing;
