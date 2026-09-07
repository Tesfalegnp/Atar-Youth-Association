import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../services/api';
import { organizationInfo } from '../data/siteContent';

const LoginSchema = Yup.object().shape({
  email: Yup.string().required('Email address or phone number is required'),
  password: Yup.string().required('Password is required'),
});

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isJustRegistered = searchParams.get('registered') === 'true';

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await authAPI.login(values);
      
      if (response.success) {
        onLogin(response.user);
        
        // Check mandatory first-login password change requirement
        if (response.user.mustChangePassword) {
          navigate('/change-password', { replace: true });
          return;
        }

        // Navigate according to user role
        if (response.user.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/profile', { replace: true });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="w-12 h-12 bg-gradient-to-tr from-navy-900 to-primary-600 rounded-2xl flex items-center justify-center shadow-md p-1">
              <img 
                src="/uploads/thumbnails/logo.png" 
                alt={organizationInfo.name} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <span className="font-extrabold text-2xl text-navy-900 tracking-tight">
              {organizationInfo.shortName}
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Member Sign In
          </h1>
          <p className="text-sm text-slate-600">
            Enter your credentials to access your account profile
          </p>
        </div>

        {isJustRegistered && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center space-x-3 text-xs font-medium">
            <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Registration complete! Please log in using the temporary password sent to your email.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3 text-xs font-medium">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address or Phone Number
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Field
                    type="text"
                    id="email"
                    name="email"
                    className={`input-field pl-10 ${errors.email && touched.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    placeholder="e.g. member@example.com or +211..."
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 font-medium" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-bold text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </Link>
                </div>
                
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Field
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={`input-field pl-10 pr-10 ${errors.password && touched.password ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1 font-medium" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-3.5 flex items-center justify-center font-bold"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Sign In'
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;