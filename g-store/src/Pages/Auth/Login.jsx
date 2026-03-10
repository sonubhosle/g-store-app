import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, ShoppingBag, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { loginUser } from '../../states/Auth/Action';
import authBg from '../../assets/auth_bg.png';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user, jwt } = useSelector(state => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user && jwt && !loading) {
      toast.success('Access Granted. Welcome back!', { position: "top-right", autoClose: 2000 });
      const redirectTimer = setTimeout(() => {
        if (user.role === 'ADMIN') navigate('/admin', { replace: true });
        else navigate('/', { replace: true });
      }, 1000);
      return () => clearTimeout(redirectTimer);
    }
  }, [user, jwt, loading, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 5000 });
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Credentials are required');
      return;
    }
    dispatch(loginUser({ email: formData.email.toLowerCase(), password: formData.password }));
  };

  const leafPattern = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-5.807 5.807l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-11.614 0l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-5.807-5.807l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-11.614 0l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83z' fill='%2310b981' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")";

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left Side: Branding/Info (Hidden on small screens) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-20 overflow-hidden"
        style={{ backgroundColor: '#064e3b', backgroundImage: leafPattern }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShoppingBag size={24} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Plantify</span>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-black text-white leading-[1.1] mb-6"
          >
            Bring Nature <br />
            <span className="text-emerald-400">Inside.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-emerald-50 text-lg font-medium mb-12 max-w-sm"
          >
            Your one-stop destination for beautiful indoor plants, succulents, and gardening accessories.
          </motion.p>

        </div>

        {/* Bottom stats/info */}
        <div className="absolute bottom-12 left-20 z-10 flex gap-8">
          <div>
            <p className="text-2xl font-black text-white leading-tight">1k+</p>
            <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest">Plant Varieties</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white leading-tight">24/7</p>
            <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest">Plant Care Support</p>
          </div>
        </div>
      </motion.div>

      {/* Right Side: Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-20"
      >
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header (Only visible on small screens) */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShoppingBag size={20} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Plantify</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
            >
              <Sparkles size={12} /> Personalized Experience
            </motion.div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Sign In</h2>
            <p className="text-slate-500 font-medium">Please enter your details to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <div className='mb-3'>
                <label className="text-base font-semibold text-slate-700 uppercase ml-1 ">Email Address</label>
              </div>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@plantify.com"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-semibold placeholder:text-slate-600"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1 mb-3">
                <label className="text-base font-semibold text-slate-700 uppercase ">Password</label>
              </div>
              <div className="relative mb-2">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your security key"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 outline-none focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all font-semibold placeholder:text-slate-600"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Link to="/forgot-password" className="text-base  font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot Password ?</Link>

            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase shadow-2xl hover:bg-emerald-600 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-slate-600 font-semibold text-sm">
                If you don't have an account?{' '}
                <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-all">
                  Register Here
                </Link>
              </p>
            </div>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

export default Login;