import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle, ShoppingBag, Sparkles, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../states/Auth/Action';
import authBg from '../../assets/auth_bg.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, forgotPasswordMessage } = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (forgotPasswordMessage) {
      toast.success(forgotPasswordMessage, { position: "top-right", autoClose: 5000 });
      setEmailSent(true);
    }
  }, [forgotPasswordMessage]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 5000 });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required for recovery');
      return;
    }
    dispatch(forgotPassword(email));
  };


  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left Side: Branding/Info */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative bg-slate-50 flex-col justify-center p-20 overflow-hidden border-r border-slate-100"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-emerald-100 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShoppingBag size={24} />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">G-Store</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-black text-slate-900 leading-tight mb-6"
          >
            Account <br />
            <span className="text-emerald-600 text-6xl">Recovery.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 text-lg font-medium mb-12 max-w-sm"
          >
            Don't worry, even the best of us forget. Follow the link we send to your email to regain access securely.
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
            {!emailSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    <KeyRound size={12} /> Security Protocol
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Forgot Password?</h2>
                  <p className="text-slate-500 font-medium">Initialize the recovery sequence by providing your linked account email.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <div className="mb-2">
                      <label className="text-base font-semibold text-slate-600 uppercase ml-1">Email</label>
                    </div>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-semibold placeholder:text-slate-600"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-2xl hover:bg-emerald-600 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <>Send Reset Link <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-semibold text-xs uppercase  transition-all">
                    Return to Sign In
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10"
              >
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 border border-emerald-100"
                  >
                    <CheckCircle size={48} />
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Email Dispatched</h2>
                  <p className="text-slate-500 font-medium">
                    The recovery link has been sent to: <br />
                    <span className="text-emerald-600 font-black">{email}</span>
                  </p>
                  <p className="text-sm text-slate-400 bg-slate-50 p-4 rounded-2xl leading-relaxed">
                    Please access the link within the next 60 minutes to finalize your new security key.
                  </p>
                </div>

                <div className="pt-6 space-y-4">
                  <button
                    onClick={() => setEmailSent(false)}
                    className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-slate-100 transition-all"
                  >
                    Try Different Email
                  </button>

                  <Link to="/login" className="block text-emerald-600 hover:text-emerald-700 font-semibold text-xs uppercase tracking-widest">
                     Login
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
