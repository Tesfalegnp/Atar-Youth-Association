import { Link } from 'react-router-dom';
import { FiArrowRight, FiUserPlus, FiMail } from 'react-icons/fi';
import { organizationInfo } from '../data/siteContent';

const CTASection = ({ 
  title = "Ready to Support Youth Empowerment in South Sudan?",
  description = "Join Atar Youth Association as a member, volunteer, or strategic partner to create meaningful opportunities for young people across South Sudan.",
  primaryBtnText = "Register as Member",
  primaryBtnLink = "/register",
  secondaryBtnText = "Contact Our Team",
  secondaryBtnLink = "/contact"
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-primary-900 text-white py-16 lg:py-20 rounded-3xl shadow-xl my-12 mx-4 sm:mx-6 lg:mx-8">
      {/* Subtle Background Glow Spheres */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-primary-200 border border-white/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
          <span>{organizationInfo.shortName} Community Movement</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
          {title}
        </h2>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={primaryBtnLink}
            className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg hover:shadow-primary-500/25 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <FiUserPlus className="w-5 h-5" />
            <span>{primaryBtnText}</span>
            <FiArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to={secondaryBtnLink}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm"
          >
            <FiMail className="w-5 h-5" />
            <span>{secondaryBtnText}</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
