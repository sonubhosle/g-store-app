import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, UserRound, Phone, Image, Loader2, Eye, EyeOff, ShoppingBag, Sparkles, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { registerUser } from '../../states/Auth/Action';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector(state => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    photo: null
  });

  useEffect(() => {
    if (user && !loading) {
      toast.success("Welcome to the Community!", { position: "top-right", autoClose: 2000 });
      setTimeout(() => {
        if (user.role?.toUpperCase() === "ADMIN") navigate("/admin");
        else navigate("/");
      }, 1000);
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-right", autoClose: 5000 });
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, photo: file }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.surname || !formData.email || !formData.mobile || !formData.password) {
      toast.error('All essential fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error('Security policy: 8+ chars, Upper, Number, Symbol');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) submitData.append(key, formData[key]);
    });
    dispatch(registerUser(submitData));
  };

  const authInput = "w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 outline-none transition-all duration-300 font-bold placeholder:text-slate-300 focus:bg-white focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5";
  const leafPattern = "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-5.807 5.807l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-11.614 0l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-5.807-5.807l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83zm-11.614 0l.83.83-1.66 1.66-.83-.83.83-.83-.83-.83 1.66-1.66.83.83z' fill='%2310b981' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")";

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Left Side: Branding/Info */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-2/5 relative flex-col justify-center p-16 h-full overflow-hidden"
        style={{ backgroundColor: '#064e3b', backgroundImage: leafPattern }}
      >
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
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
            Grow with <br />
            <span className="text-emerald-400 text-6xl">Nature.</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-emerald-50 text-lg font-medium mb-12 max-w-sm"
          >
            Join our community of plant lovers. Get exclusive access to rare plants, care guides, and personalized green tips.
          </motion.p>

        </div>
      </motion.div>

      {/* Right Side: Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-3/5 flex flex-col items-center justify-center p-6 h-full overflow-y-auto scrollbar-hide"
      >
        <div className="w-full max-w-2xl mx-auto py-8">
          <div className="mb-10 text-center lg:text-left">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
            >
              <UserPlus size={12} /> New Account Registration
            </motion.div>
            <p className="text-slate-500 font-medium">Please fill in your details to start your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <div className="mb-2">
                  <label className="text-base font-semibold text-slate-600 uppercase  ml-1 ">First Name</label>
                </div>
                <div className="relative">
                  <UserRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="John" className={authInput || 'pr-4'} disabled={loading} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="mb-2">
                  <label className="text-base font-semibold text-slate-600 uppercase  ml-1">Surname</label>
                </div>
                <div className="relative">
                  <UserRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input name="surname" type="text" value={formData.surname} onChange={handleInputChange} placeholder="Doe" className={authInput || 'pr-4'} disabled={loading} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <div className="mb-2">
                  <label className="text-base font-semibold text-slate-600 uppercase  ml-1">Email</label>
                </div>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className={authInput || 'pr-4'} disabled={loading} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="mb-2">
                  <label className="text-base font-semibold text-slate-600 uppercase ml-1">Contact</label>

                </div>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input name="mobile" type="text" value={formData.mobile} onChange={handleInputChange} placeholder="+XX XXXXX XXXXX" className={authInput || 'pr-4'} disabled={loading} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <div className="mb-2">
                  <label className="text-base font-semibold text-slate-600 uppercase ml-1">Password</label>

                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} placeholder="••••••••" className={authInput || 'pr-12'} disabled={loading} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="mb-2">
                  <label className="text-base font-semibold text-slate-600 uppercase ml-1">Confirm Password</label>

                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" className={authInput || 'pr-12'} disabled={loading} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-600">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="mb-2">
                <label className="text-base font-semibold text-slate-600 uppercase ml-1"> Profile Image</label>
              </div>
              <div className="relative group">
                <input type="file" onChange={handleFileChange} accept="image/*" className={authInput || 'pr-12'} disabled={loading} />
                <Image size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>

            <div className="pt-4 flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-2xl hover:bg-emerald-600 hover:shadow-emerald-200 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Register <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>

            </div>

          </form>

          <div className="pt-5 border-t border-slate-50 text-center ">
            <p className="text-slate-600 font-semibold text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Injected Styles for Shared Components */}

    </div>
  );
};

export default Register;