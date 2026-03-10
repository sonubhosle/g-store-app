import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle, ShoppingBag, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { resetPassword } from '../../states/Auth/Action';
import authBg from '../../assets/auth_bg.png';

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const { loading, error, resetPasswordMessage } = useSelector(state => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (resetPasswordMessage) {
      toast.success(resetPasswordMessage, { position: "top-right", autoClose: 3000 });
      setResetSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [resetPasswordMessage, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 5000 });
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error('Both fields are mandatory');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Password mismatch detected');
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      toast.error('Does not meet security complexity requirements');
      return false;
    }
    return true;
  };

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[@$!%*?&]/.test(password)) s++;
    return s;
  };

  const strength = getPasswordStrength(formData.newPassword);
  const strengthConfig = [
    { label: 'Too Weak', color: 'bg-slate-200' },
    { label: 'Vulnerable', color: 'bg-red-400' },
    { label: 'Moderate', color: 'bg-orange-400' },
    { label: 'Secured', color: 'bg-yellow-400' },
    { label: 'Bulletproof', color: 'bg-emerald-500' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(resetPassword(token, formData.newPassword, formData.confirmPassword));
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-2xl border border-red-50">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Access Expired</h2>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">The security token provided is invalid or has expired for this session.</p>
          <Link to="/forgot-password" className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-emerald-600 transition-all">Request New Token</Link>
        </motion.div>
      </div>
    );
  }
  const authInput = "w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 outline-none transition-all duration-300 font-bold placeholder:text-slate-300 focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5";


  const leafPattern = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-5.807 5.807l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-11.614 0l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-5.807-5.807l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-11.614 0l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83z' fill='%2310b981' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")";

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left Side: Branding/Info */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-20 overflow-hidden"
        style={{ backgroundColor: '#064e3b', backgroundImage: leafPattern }}
      >
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <ShoppingBag size={24} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Plantify</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-black text-white leading-tight mb-6"
          >
            Secure Your <br />
            <span className="text-emerald-400 text-6xl">Garden.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-emerald-50 text-lg font-medium mb-12 max-w-sm"
          >
            Your privacy is our priority. Establish a new core access key with our advanced encryption protocols.
          </motion.p>

        </div>
      </motion.div>

      {/* Right Side: Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-20"
      >
        <div className="w-full max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {!resetSuccess ? (
              <motion.div
                key="reset-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    <ShieldCheck size={12} /> Authority Verified
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Reset Key</h2>
                  <p className="text-slate-500 font-medium">Define a new master password for your identity profile.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <div className="mb-2">
                      <label className="text-base font-semibold text-slate-600 uppercase  ml-1">New Password</label>

                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        name="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className={authInput || 'pr-12'}
                        disabled={loading}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Strength Visualizer */}
                    <div className="pt-2 flex items-center gap-3">
                      <div className="flex-1 h-1.5 flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-full flex-1 rounded-full transition-all duration-500 ${strength >= i ? strengthConfig[strength].color : 'bg-slate-100'}`} />
                        ))}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-tighter ${strength > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {strengthConfig[strength].label}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="mb-2">
                      <label className="text-base font-semibold text-slate-600 uppercase  ml-1">Confirm New Password</label>
                    </div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Re-enter Password"
                        className={authInput || 'pr-12'}
                        disabled={loading}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formData.confirmPassword && (
                      <p className={`text-[10px] font-black uppercase tracking-tighter ml-1 mt-1 ${formData.newPassword === formData.confirmPassword ? 'text-emerald-500' : 'text-red-400'}`}>
                        {formData.newPassword === formData.confirmPassword ? '✓ Integrity Confirmed' : '✗ Multi-factor Mismatch'}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-2xl hover:bg-emerald-600 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <>Set Password <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-semibold text-xs uppercase tracking-widest transition-all">
                    Login
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reset-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10"
              >
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-xl shadow-emerald-500/10">
                    <CheckCircle size={48} />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Access Restored</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">Your identity has been re-authorized with the new security key. Initializing secure redirection...</p>
                </div>
                <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                  <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 3, ease: "linear" }} className="w-full h-full bg-emerald-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>


    </div>
  );
};

export default ResetPassword;