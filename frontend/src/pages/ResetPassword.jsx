import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { authAPI } from '../services/api';
import { organizationInfo } from '../data/siteContent';

const ResetSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords do not match')
    .required('Confirm new password'),
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!token) {
      setError('Invalid or missing password reset token.');
      setSubmitting(false);
      return;
    }

    try {
      setError('');
      setSuccessMessage('');
      const response = await authAPI.resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      });

      if (response.success) {
        setSuccessMessage(response.message || 'Password reset successfully! You can now log in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 space-y-6">
        
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-navy-900 to-primary-600 rounded-xl flex items-center justify-center shadow-md p-1">
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
            <span className="font-extrabold text-xl text-navy-900 tracking-tight">
              {organizationInfo.shortName}
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Create New Password
          </h1>
          <p className="text-sm text-slate-600">
            Set a new secure password for your Atar Youth Association account.
          </p>
        </div>

        {!token && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-center space-x-3 text-xs font-medium">
            <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Missing password reset token. Please check your email link or request a new reset.</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center space-x-3 text-xs font-medium">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <FiCheckCircle className="w-7 h-7 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-base">Password Reset Complete!</h3>
                <p className="text-xs text-emerald-700">{successMessage}</p>
              </div>
            </div>

            <div className="pt-2">
              <Link 
                to="/login"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center text-sm transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                <span>Log In With New Password</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          token && (
            <Formik
              initialValues={{ newPassword: '', confirmPassword: '' }}
              validationSchema={ResetSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-5">
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Field
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className={`input-field pl-10 ${errors.newPassword && touched.newPassword ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        placeholder="At least 6 characters"
                      />
                    </div>
                    <ErrorMessage name="newPassword" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Field
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`input-field pl-10 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                        placeholder="Re-enter new password"
                      />
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-3.5 flex items-center justify-center font-bold"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          )
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
            Return to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
