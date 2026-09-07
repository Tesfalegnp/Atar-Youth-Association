import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMail, FiUser, FiSmartphone, FiMapPin, FiCalendar, FiCheckCircle, FiShield, FiArrowRight
} from 'react-icons/fi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../services/api';
import { organizationInfo } from '../data/siteContent';

const RegisterSchema = Yup.object().shape({
  full_name: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name is too long')
    .required('Full name (First, Middle, Last) is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  phone: Yup.string()
    .matches(/^\+211\d{9}$/, 'Must be South Sudan phone format (+211XXXXXXXXX)')
    .required('Phone number is required'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Select a valid gender')
    .required('Gender selection is required'),
  date_of_birth: Yup.date()
    .max(new Date(Date.now() - 86400000 * 365 * 13), 'Must be at least 13 years old')
    .required('Date of birth is required'),
  county: Yup.string().required('County location is required'),
  payam: Yup.string().required('Payam location is required'),
});

const Register = ({ onSuccess }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await authAPI.register(values);
      if (response.success) {
        setSuccessMessage(response.message || 'Registration successful! Your login credentials have been sent to your email.');
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/login?registered=true');
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      const msg = error.response?.data?.message || 'Registration failed. Please check your inputs and try again.';
      if (msg.includes('already')) {
        if (msg.toLowerCase().includes('email')) setFieldError('email', 'This email is already registered');
        if (msg.toLowerCase().includes('phone')) setFieldError('phone', 'This phone number is already registered');
      } else {
        setFieldError('full_name', msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 space-y-8">
        
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

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Register as a Member
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Join the youth movement in South Sudan. No password setup is required now—your temporary login credential will be sent to your email.
          </p>
        </div>

        {/* Success Confirmation Banner */}
        {successMessage ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl space-y-3">
            <div className="flex items-center space-x-3">
              <FiCheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg">Registration Successful!</h3>
                <p className="text-sm text-emerald-700">{successMessage}</p>
              </div>
            </div>
            <div className="pt-2">
              <Link 
                to="/login"
                className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-900 underline"
              >
                <span>Proceed to Login</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={{
              full_name: '',
              email: '',
              phone: '+211',
              gender: 'male',
              date_of_birth: '',
              county: '',
              payam: ''
            }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                
                {/* Security Process Note */}
                <div className="p-4 bg-primary-50/70 border border-primary-100 rounded-2xl flex items-start space-x-3 text-xs text-primary-900">
                  <FiShield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-primary-950">Passwordless Registration</span>
                    <span>Your temporary password (format: <code>MiddleNameA123</code>) will be generated automatically and sent to your email address. You will set your own secure password upon your first login.</span>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Full Name (First, Middle, Last) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Field
                        type="text"
                        name="full_name"
                        className={`input-field pl-10 ${errors.full_name && touched.full_name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        placeholder="e.g. John Deng Mabior"
                      />
                    </div>
                    <ErrorMessage name="full_name" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <Field as="select" name="gender" className="input-field">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Prefer not to say</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Field
                        type="email"
                        name="email"
                        className={`input-field pl-10 ${errors.email && touched.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        placeholder="member@example.com"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiSmartphone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Field
                        type="tel"
                        name="phone"
                        className={`input-field pl-10 ${errors.phone && touched.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        placeholder="+211912345678"
                      />
                    </div>
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                  </div>
                </div>

                {/* Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      County <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Field
                        type="text"
                        name="county"
                        className={`input-field pl-10 ${errors.county && touched.county ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        placeholder="Central Equatoria"
                      />
                    </div>
                    <ErrorMessage name="county" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Payam <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Field
                        type="text"
                        name="payam"
                        className={`input-field pl-10 ${errors.payam && touched.payam ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        placeholder="Juba"
                      />
                    </div>
                    <ErrorMessage name="payam" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Field
                      type="date"
                      name="date_of_birth"
                      className={`input-field pl-10 ${errors.date_of_birth && touched.date_of_birth ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    />
                  </div>
                  <ErrorMessage name="date_of_birth" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-3.5 flex items-center justify-center font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating Credentials & Creating Account...
                    </>
                  ) : (
                    'Submit Member Registration'
                  )}
                </button>
              </Form>
            )}
          </Formik>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
              Sign in to your account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;