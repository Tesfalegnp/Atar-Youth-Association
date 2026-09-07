import { Link } from 'react-router-dom';
import { 
  FiUserPlus, FiHeart, FiGlobe, FiCheckCircle, FiArrowRight
} from 'react-icons/fi';


const GetInvolved = () => {
  return (
    <div className="bg-slate-50 space-y-16 lg:space-y-24 pb-12">
      
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="text-xs font-extrabold text-accent-400 uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
            Join the Movement
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-4 mb-6">
            Get Involved With Atar Youth
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Discover how you can participate as a youth member, volunteer your skills, or partner with us to transform communities in South Sudan.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Become a Member */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <FiUserPlus className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">
                Register as Member
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Are you a South Sudanese youth aged 15–35? Join our network to access skills training, leadership forums, and peer mentorship.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-slate-700 font-medium">
                <li className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span>Access to training workshops</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span>Participate in peacebuilding forums</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span>Member directory & profile</span>
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-center text-sm transition-colors shadow-sm flex items-center justify-center space-x-2"
            >
              <span>Create Account</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Volunteer */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <FiHeart className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">
                Volunteer With Us
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Share your expertise, facilitate community workshops, or assist in organizing youth activities and environmental drives.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-slate-700 font-medium">
                <li className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span>Community project leadership</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span>Skills mentoring & teaching</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span>Certificate of appreciation</span>
                </li>
              </ul>
            </div>
            <Link
              to="/contact"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-center text-sm transition-colors shadow-sm flex items-center justify-center space-x-2"
            >
              <span>Offer Skills</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Partner With Us */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <FiGlobe className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-navy-900 mb-3">
                Partner & Support
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                NGOs, community institutions, and partners can collaborate with Atar Youth Association to co-implement impactful programs.
              </p>
              <ul className="space-y-2 mb-6 text-xs text-slate-700 font-medium">
                <li className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span>Joint community projects</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span>Resource & facility sharing</span>
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <span>Transparent reporting</span>
                </li>
              </ul>
            </div>
            <Link
              to="/contact"
              className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-xl text-center text-sm transition-colors shadow-sm flex items-center justify-center space-x-2"
            >
              <span>Partner Inquiry</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default GetInvolved;
