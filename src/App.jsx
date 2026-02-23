import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, onSnapshot, 
  query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, onAuthStateChanged, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut 
} from 'firebase/auth';
import { 
  Bus, X, Car, Ticket, 
  User, ChevronLeft, LayoutGrid, Sparkles,
  Navigation, Plus, Settings,
  Megaphone, Hotel, MapPin, Clock,
  School, Trees, Music,
  BedDouble, Users, Star, Building2, Calendar,
  UserCheck, UserX, ClipboardList, Trash2,
  RotateCcw, Baby, Tent, Ship,
  PartyPopper, Plane, FileText, Globe,
  Wallet, Store, Languages, FileCheck, Truck, MessageCircle, ChevronRight, AlertCircle, Info, CheckCircle2, LogIn, Filter, Gift, Award, Coffee, Shirt, Smile, LogOut, Mail, Lock
} from 'lucide-react';

// 1. مفاتيح قاعدة البيانات الحقيقية الخاصة بشركة HT (Shahba Go)
const firebaseConfig = {
  apiKey: "AIzaSyD0iCt_GXhp5sOfAH_C4GYnRQ69JijXd1Q",
  authDomain: "shahba-go-ht.firebaseapp.com",
  projectId: "shahba-go-ht",
  storageBucket: "shahba-go-ht.firebasestorage.app",
  messagingSenderId: "85312414911",
  appId: "1:85312414911:web:edd7691f7a7a075fafd20a",
  measurementId: "G-Q17W0BX2TJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'shahba-go-ht'; // مسار البيانات في السحابة

// --- HT Custom Logo Component ---
const HTLogo = ({ size = "normal" }) => {
  const dims = size === 'large' ? 'w-24 h-24 text-5xl rounded-[2rem]' : 'w-10 h-10 text-xl rounded-xl';
  return (
    <div dir="ltr" className={`${dims} bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center font-black shadow-lg shadow-emerald-500/30 border border-emerald-300 relative overflow-hidden shrink-0`}>
       <div className="absolute top-0 left-0 w-full h-full bg-white/20 rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
       <span className="text-white drop-shadow-md z-10 italic pr-0.5">H</span>
       <span className="text-[#0B192C] drop-shadow-md z-10">T</span>
    </div>
  );
};

// --- Global Data Structures ---
const CATEGORIES = [
  { id: 'car', title: 'أجار سيارات', sub: 'يومي، أسبوعي، شهري', icon: Car, color: 'from-emerald-500 to-teal-700', active: true },
  { id: 'bus', title: 'خدمات الباصات', sub: 'عقود ورحلات ترفيهية', icon: Bus, color: 'from-blue-500 to-indigo-700', active: true },
  { id: 'hotel', title: 'الفنادق', sub: 'حجز في كافة المحافظات', icon: Hotel, color: 'from-amber-500 to-orange-700', active: true },
  { id: 'flights', title: 'حجز طيران', sub: 'رحلات داخلية ودولية', icon: Plane, color: 'from-cyan-500 to-blue-600', active: true },
  { id: 'transit', title: 'سفريات', sub: 'توصيل بين المحافظات وبيروت', icon: Globe, color: 'from-indigo-500 to-purple-600', active: true },
  { id: 'services', title: 'خدمات إضافية', sub: 'فيزا، أوراق رسمية، بريد', icon: FileCheck, color: 'from-slate-500 to-gray-700', active: true }, 
  { id: 'events', title: 'الفعاليات', sub: 'رحلات وسهرات فنية', icon: Megaphone, color: 'from-rose-500 to-pink-700', active: true },
];

const CITIES = [
  { id: 'aleppo', name: 'حلب', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400' },
  { id: 'damascus', name: 'دمشق', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400' },
  { id: 'latakia', name: 'اللاذقية', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400' },
  { id: 'beirut', name: 'بيروت', img: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=400' },
];

const HOTELS_DATA = [
  { id: 'h_alp_1', cityId: 'aleppo', name: 'فندق شهباء حلب', desc: 'إطلالة بانورامية', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400' },
  { id: 'h_alp_2', cityId: 'aleppo', name: 'فندق الشيراتون', desc: 'قلب المدينة العريق', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400' },
  { id: 'h_dam_1', cityId: 'damascus', name: 'فندق فور سيزونز', desc: 'فخامة العاصمة', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400' },
];

const ROOM_TYPES = [
  { id: 'single', name: 'غرفة فردية', desc: 'لشخص واحد', icon: User },
  { id: 'double', name: 'غرفة مزدوجة', desc: 'لشخصين', icon: BedDouble },
  { id: 'suite', name: 'جناح سويت', desc: 'رفاهية مطلقة', icon: Star },
];

const PUBLIC_SERVICES_LIST = [
  { id: 'visa_bei', title: 'فيزا بيروت', desc: 'تأمين فيزا سياحية أو عمل', icon: FileText },
  { id: 'visa_jor', title: 'فيزا الأردن', desc: 'تسهيل إجراءات الدخول', icon: FileText },
  { id: 'embassy', title: 'أوراق السفارات', desc: 'جلب وتصديق الأوراق الرسمية', icon: Building2 },
  { id: 'mail', title: 'شحن مستندات', desc: 'نقل بريد بين المحافظات', icon: Truck },
];

const CAR_MODELS = [
  { id: 'audi', name: 'Audi A6', price: '750,000 ل.س/يوم', img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=400' },
  { id: 'genesis', name: 'Genesis G80', price: '900,000 ل.س/يوم', img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=400' },
];

const BUS_TYPES = [
  { id: 'contract', title: 'نظام العقود', sub: 'مدارس ومعامل', icon: School, color: 'bg-blue-500/20 text-blue-400' },
  { id: 'leisure', title: 'رحلات ترفيهية', sub: 'مزارع ومناسبات', icon: Trees, color: 'bg-emerald-500/20 text-emerald-400' },
];

const HT_REWARDS = [
  { id: 'r1', name: 'كوب ماك HT', points: 150, icon: Coffee, desc: 'كوب قهوة حراري فاخر يحمل شعار HT لتبدأ يومك بنشاط.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'r2', name: 'تيشيرت HT الأنيق', points: 200, icon: Shirt, desc: 'تيشيرت قطني مريح بجودة عالية وتصميم عصري يحمل شعارنا.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { id: 'r3', name: 'دبدوب HT للسيارة', points: 300, icon: Smile, desc: 'دبدوب زينة لطيف لسيارتك يرافقك في كل مشاويرك.', color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState('main'); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedBusType, setSelectedBusType] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState('orders'); 
  const [orderFilter, setOrderFilter] = useState('all'); 

  // Auth State
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [allOrders, setAllOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [dynamicEvents, setDynamicEvents] = useState([]);
  const [bookingItem, setBookingItem] = useState(null);
  const [rejectModal, setRejectModal] = useState(null); 
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('office'); 
  const [lang, setLang] = useState('ar');

  // Wallet State
  const [userPoints, setUserPoints] = useState(250); 
  const [redeemSuccess, setRedeemSuccess] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500); 
    const initAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
         setUser(currentUser);
      } else {
         // إذا لم يكن مسجلاً، ادخل كضيف بشكل مخفي لتسهيل التصفح
         try { await signInAnonymously(auth); } catch (err) { console.error("Auth error:", err); }
      }
    });
    return () => { clearTimeout(timer); initAuth(); };
  }, []);

  useEffect(() => {
    if (!user) return;
    const qOrders = query(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      const docs = snap.docs.map(d => ({id: d.id, ...d.data()}));
      setAllOrders(docs);
      const phone = localStorage.getItem('sh-user-phone');
      setUserOrders(docs.filter(o => o.phone === phone || o.userId === user.uid));
    }, (err) => console.error(err));

    const qEvents = query(collection(db, 'artifacts', appId, 'public', 'data', 'marketing_events'), orderBy('createdAt', 'desc'));
    const unsubEvents = onSnapshot(qEvents, (snap) => {
      setDynamicEvents(snap.docs.map(d => ({id: d.id, ...d.data()})));
    }, (err) => console.error(err));

    return () => { unsubOrders(); unsubEvents(); };
  }, [user]);

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
      e.preventDefault();
      setAuthError('');
      try {
          if (authModal === 'signup') {
              await createUserWithEmailAndPassword(auth, authEmail, authPassword);
          } else {
              await signInWithEmailAndPassword(auth, authEmail, authPassword);
          }
          setAuthModal(null);
          setAuthEmail('');
          setAuthPassword('');
      } catch (err) {
          setAuthError('بيانات الدخول غير صحيحة، يرجى التأكد والمحاولة مجدداً.');
      }
  };

  const handleLogout = async () => {
      await signOut(auth);
      setIsAdmin(false);
      setActiveView('main');
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    const numberFields = ['paxCount', 'workerCount', 'busCount', 'nightCount'];
    for (let field of numberFields) {
       if (formValues[field] !== undefined && formValues[field] !== "") {
           const val = parseInt(formValues[field]);
           if (isNaN(val) || val <= 0) {
               alert("عذراً، يجب أن يكون العدد المدخل أكبر من صفر لضمان صحة الطلب.");
               return;
           }
       }
    }

    localStorage.setItem('sh-user-name', formValues.name);
    localStorage.setItem('sh-user-phone', formValues.phone);

    let title = bookingItem?.name || bookingItem?.title || 'طلب خدمة';
    
    if (bookingItem?.isEditMode && bookingItem?.serviceTitle) {
        title = bookingItem.serviceTitle;
    } else {
        if (selectedCategory === 'hotel') title = `حجز ${selectedHotel?.name} - ${bookingItem?.name}`;
        if (selectedCategory === 'car') title = `أجار سيارة: ${bookingItem?.name}`;
    }

    const orderData = {
      ...formValues,
      serviceTitle: title,
      serviceType: selectedCategory,
      busSubCategory: selectedBusType || null,
      hotelName: selectedHotel?.name || bookingItem?.hotelName || null,
      paymentMethod: paymentMethod, 
      status: 'pending',
      rejectionReason: '', 
      userId: user.uid,
      isGuest: user.isAnonymous
    };

    if (bookingItem?.isEditMode && bookingItem?.id) {
       const orderRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', bookingItem.id);
       await updateDoc(orderRef, { ...orderData, updatedAt: serverTimestamp() });
    } else {
       await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), { ...orderData, createdAt: serverTimestamp() });
       if (!user.isAnonymous) {
           setUserPoints(prev => prev + 25); // مكافأة للمسجلين فقط
       }
    }
    
    setBookingItem(null);
    setSelectedBusType(null);
    setSelectedHotel(null);
    setSelectedCity(null);
    setShowSuccessCard(true);
  };

  const handleRedeemReward = async (reward) => {
      if (!user || user.isAnonymous) {
          setAuthModal('signup');
          return;
      }
      if (userPoints >= reward.points) {
          try {
              await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), {
                  name: localStorage.getItem('sh-user-name') || 'عميل النخبة (HT)',
                  phone: localStorage.getItem('sh-user-phone') || '---',
                  serviceTitle: `هدية نادي النخبة: ${reward.name}`,
                  serviceType: 'reward',
                  pointsUsed: reward.points,
                  status: 'pending',
                  userId: user.uid,
                  createdAt: serverTimestamp()
              });

              setUserPoints(prev => prev - reward.points);
              setRedeemSuccess(`مبروك! تم إرسال طلب استبدال (${reward.name}) للإدارة. تابعه من قسم طلباتي لتستلمه قريباً.`);
              setTimeout(() => setRedeemSuccess(null), 6000);
          } catch (error) {
              console.error(error);
          }
      } else {
          alert(`رصيدك غير كافٍ. تحتاج إلى ${reward.points - userPoints} نقطة إضافية.`);
      }
  };

  const updateOrderStatus = async (orderId, status, reason = "") => {
    if (!user) return;
    const orderRef = doc(db, 'artifacts', appId, 'public', 'data', 'orders', orderId);
    await updateDoc(orderRef, { status, rejectionReason: reason });
    setRejectModal(null);
  };

  const handleEditOrder = (order) => {
    setBookingItem({ ...order, title: order.serviceTitle, isEditMode: true });
    setSelectedCategory(order.serviceType);
    setSelectedBusType(order.busSubCategory || null);
    setPaymentMethod(order.paymentMethod || 'office');
  };

  const repeatOrder = (order) => {
    setBookingItem({ ...order, title: order.serviceTitle, id: undefined, isEditMode: false });
    setSelectedCategory(order.serviceType);
    setSelectedBusType(order.busSubCategory || null);
    setPaymentMethod(order.paymentMethod || 'office');
  };

  const addMarketingEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const eventData = Object.fromEntries(formData.entries());
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'marketing_events'), {
      ...eventData,
      createdAt: serverTimestamp()
    });
    e.target.reset();
  };

  const deleteMarketingEvent = async (id) => {
    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'marketing_events', id));
  };

  const renderOrderInfo = (order) => {
    if (order.serviceType === 'reward') return `طلب استبدال هدية (${order.pointsUsed} نقطة) - بانتظار تأكيد التسليم.`;
    if (order.serviceType === 'car') return `المدة: ${order.rentDuration} | السائق: ${order.driverOption === 'with_driver' ? 'مع سائق' : 'بدون'}`;
    if (order.serviceType === 'hotel') return `${order.checkIn} لغاية ${order.checkOut} (${order.nightCount} ليلة) | أشخاص: ${order.paxCount}`;
    if (order.serviceType === 'bus' && order.busSubCategory === 'contract') return `${order.orgName} | باصات: ${order.busCount}`;
    if (order.serviceType === 'bus') return `ترفيهي: ${order.tripDate} - ${order.tripTime}`;
    if (order.serviceType === 'flights') return `من ${order.fromAirport} لـ ${order.toAirport} بتاريخ ${order.flightDate}`;
    if (order.serviceType === 'transit') return `من ${order.fromLocation} إلى ${order.toLocation} | ${order.transitType} | سيارة: ${order.carTypePreference}`;
    if (order.serviceType === 'services') return `التفاصيل: ${order.serviceDetails || ''}`;
    if (order.serviceType === 'events') return `عدد: ${order.paxCount} | أطفال: ${order.hasKids === 'yes' ? 'نعم' : 'لا'}`;
    return 'تفاصيل عامة';
  };

  const filterOrdersByType = (types) => {
      let filtered = allOrders.filter(o => types.includes(o.serviceType));
      if (orderFilter !== 'all') {
          filtered = filtered.filter(o => o.status === orderFilter);
      }
      return filtered;
  };

  const safeFormatDate = (timestamp) => {
    if (!timestamp) return 'قيد المعالجة';
    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleDateString();
    }
    return 'قيد المعالجة';
  };

  const openWhatsApp = () => window.open("https://wa.me/9639xxxxxxxx", "_blank");

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
      approved: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
      rejected: 'bg-rose-500/20 text-rose-500 border-rose-500/30'
    };
    const labels = { pending: 'قيد الانتظار', approved: 'مقبول', rejected: 'مرفوض' };
    return <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${styles[status]}`}>{labels[status]}</span>;
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#0B192C] flex flex-col items-center justify-center z-[2000]">
        <div className="relative mb-8">
            <HTLogo size="large" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/10 rounded-full blur-xl animate-ping"></div>
        </div>
        <h1 className="text-5xl font-black text-white italic tracking-tighter text-center leading-none uppercase mb-2 drop-shadow-lg">شهباء <span className="text-emerald-400">Go</span></h1>
        <p className="text-emerald-400 font-bold text-sm mb-8 tracking-widest uppercase opacity-80">هدفنا راحتك</p>
        <div className="flex gap-5 items-center">
           <span className="text-white/80 font-black text-sm uppercase tracking-widest animate-bounce [animation-delay:-0.3s]">كفالة</span>
           <div className="w-1 h-6 bg-emerald-500/50 rounded-full"></div>
           <span className="text-white/80 font-black text-sm uppercase tracking-widest animate-bounce [animation-delay:-0.15s]">متعة</span>
           <div className="w-1 h-6 bg-emerald-500/50 rounded-full"></div>
           <span className="text-white/80 font-black text-sm uppercase tracking-widest animate-bounce">رفاهية</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B192C] text-white font-sans overflow-x-hidden pb-32" dir="rtl">
      
      {/* Ticker Banner */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2.5 overflow-hidden whitespace-nowrap sticky top-0 z-40 backdrop-blur-md">
        <div className="flex animate-marquee space-x-12 space-x-reverse items-center">
            <span className="text-[10px] font-black text-emerald-400 flex items-center gap-2">
                <Sparkles size={12}/> نصلك أينما كنت، ونأخذك حيثما تريد • هدفنا راحتك
            </span>
            {dynamicEvents.map(ev => (
                <span key={ev.id} className="text-[10px] font-black text-emerald-400 flex items-center gap-2">
                    {ev.postType === 'offer' ? <Megaphone size={12}/> : <MapPin size={12}/>} 
                    {ev.name} {ev.price ? `• ${ev.price}` : ''}
                </span>
            ))}
        </div>
      </div>

      {/* Header */}
      <header className="p-5 sticky top-10 z-50 bg-[#0B192C]/95 backdrop-blur-xl border-b border-white/5 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {setActiveView('main'); setIsAdmin(false); setSelectedCategory(null); setSelectedHotel(null); setSelectedCity(null); setSelectedBusType(null);}}>
           <HTLogo />
           <div className="flex flex-col text-right">
                <h1 className="text-lg font-black italic text-white leading-none">شهباء <span className="text-emerald-400">Go</span></h1>
                <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest mt-1">By Tatari & Hammash</span>
           </div>
        </div>
        <div className="flex items-center gap-2">
            {!isAdmin && (
                <button onClick={() => {setActiveView('wallet'); setSelectedCategory(null);}} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                    <Gift size={14}/>
                    <span className="text-[10px] font-black">{user?.isAnonymous ? '0' : userPoints}</span>
                </button>
            )}

            {/* زر الإدارة أصبح ظاهراً دائماً لسهولة التجريب */}
            <button onClick={() => setIsAdmin(!isAdmin)} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold border transition-all ${isAdmin ? 'bg-amber-500/10 text-amber-400 border-amber-500/50' : 'bg-white/5 border-white/10 text-slate-300'}`}>
               {isAdmin ? <LayoutGrid size={14} /> : <Settings size={14}/>}
               {isAdmin ? 'المتجر' : 'الإدارة'}
            </button>

            {user?.isAnonymous ? (
                <button onClick={() => setAuthModal('login')} className="px-3 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 transition-all">
                    <LogIn size={14} /> دخول
                </button>
            ) : (
                <button onClick={handleLogout} className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                    <LogOut size={14} />
                </button>
            )}
        </div>
      </header>

      {/* Auth Modal */}
      {authModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
           <div className="bg-[#112240] w-full max-w-sm p-8 rounded-[3rem] border border-emerald-500/20 shadow-2xl relative animate-in zoom-in-95 text-center">
              <button onClick={() => setAuthModal(null)} className="absolute top-6 left-6 text-white/30 hover:text-white"><X size={20}/></button>
              <div className="flex justify-center mb-6"><HTLogo size="large" /></div>
              <h2 className="text-xl font-black text-white mb-2">{authModal === 'login' ? 'مرحباً بعودتك' : 'انضم لنادي النخبة HT'}</h2>
              <p className="text-[10px] text-emerald-400 mb-6">سجل الآن لتبدأ بجمع النقاط والهدايا مع كل حجز.</p>
              
              {authError && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs font-bold mb-4">{authError}</div>}
              
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div className="relative">
                      <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input type="email" required value={authEmail} onChange={(e)=>setAuthEmail(e.target.value)} className="w-full bg-[#0B192C] border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-xs text-white text-right outline-none focus:border-emerald-500" placeholder="البريد الإلكتروني" />
                  </div>
                  <div className="relative">
                      <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30" />
                      <input type="password" required value={authPassword} onChange={(e)=>setAuthPassword(e.target.value)} className="w-full bg-[#0B192C] border border-white/10 rounded-2xl py-3 pr-12 pl-4 text-xs text-white text-right outline-none focus:border-emerald-500" placeholder="كلمة المرور" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all mt-2">
                      {authModal === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                  </button>
              </form>
              <button onClick={() => setAuthModal(authModal === 'login' ? 'signup' : 'login')} className="mt-6 text-[10px] text-white/40 hover:text-emerald-400 font-bold transition-colors">
                  {authModal === 'login' ? 'ليس لديك حساب؟ أنشئ حسابك الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
              </button>
           </div>
        </div>
      )}

      <main className="p-4 max-w-5xl mx-auto">
        {isAdmin ? (
          /* ADMIN VIEW */
          <div className="space-y-6 animate-in fade-in">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-black text-emerald-400 uppercase tracking-tighter flex items-center gap-2"><HTLogo size="small" className="w-6 h-6 text-[10px]"/> لوحة الإدارة الشاملة</h2>
             </div>

             <div className="flex bg-[#0F172A] p-1.5 rounded-2xl border border-white/5 shadow-xl mb-4">
                <button onClick={() => setAdminTab('orders')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold transition-all ${adminTab === 'orders' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>
                   <ClipboardList size={14}/> إدارة الطلبات
                </button>
                <button onClick={() => setAdminTab('marketing')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold transition-all ${adminTab === 'marketing' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>
                   <Megaphone size={14}/> إدارة الإعلانات
                </button>
             </div>

             {adminTab === 'orders' ? (
               <div className="space-y-6">
                 {/* Admin Filters */}
                 <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
                     {[
                         { id: 'all', label: 'كافة الطلبات', icon: ClipboardList },
                         { id: 'pending', label: 'قيد الانتظار', icon: Clock },
                         { id: 'approved', label: 'المقبولة', icon: CheckCircle2 },
                         { id: 'rejected', label: 'المرفوضة', icon: Trash2 },
                     ].map(filter => (
                         <button key={filter.id} onClick={() => setOrderFilter(filter.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black transition-all whitespace-nowrap ${orderFilter === filter.id ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'}`}>
                            <filter.icon size={12}/> {filter.label}
                         </button>
                     ))}
                 </div>

                 <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#112240] shadow-2xl">
                    <table className="w-full text-right text-[11px]">
                       <thead>
                          <tr className="bg-white/5 text-white/40 border-b border-white/10">
                             <th className="p-4">الخدمة</th>
                             <th className="p-4 text-right">العميل</th>
                             <th className="p-4">التفاصيل الفنية</th>
                             <th className="p-4">الدفع</th>
                             <th className="p-4">الحالة</th>
                             <th className="p-4 text-center font-black">القرار</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {filterOrdersByType(['bus', 'car', 'transit', 'hotel', 'events', 'flights', 'services', 'reward']).map(order => (
                            <tr key={order.id} className="hover:bg-white/10 transition-colors">
                               <td className="p-4 font-black text-emerald-400">{order.serviceTitle}</td>
                               <td className="p-4">
                                  <div className="font-bold flex items-center gap-1">
                                      {order.name} 
                                      {!order.isGuest && order.serviceType !== 'reward' && <Sparkles size={10} className="text-amber-400"/>}
                                  </div>
                                  <div className="text-[10px] text-white/40">{order.phone}</div>
                               </td>
                               <td className="p-4 text-white/60">
                                  {renderOrderInfo(order)}
                               </td>
                               <td className="p-4">
                                  {order.serviceType === 'reward' ? (
                                      <span className="px-2 py-0.5 rounded-lg border font-bold text-[9px] bg-purple-500/10 border-purple-500 text-purple-400">
                                          مجاني (نقاط HT)
                                      </span>
                                  ) : (
                                      <span className={`px-2 py-0.5 rounded-lg border font-bold text-[9px] ${order.paymentMethod === 'cham_cash' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'}`}>
                                          {order.paymentMethod === 'cham_cash' ? 'شام كاش' : 'المكتب'}
                                      </span>
                                  )}
                               </td>
                               <td className="p-4"><StatusBadge status={order.status} /></td>
                               <td className="p-4 text-center">
                                  {order.status === 'pending' && (
                                    <div className="flex gap-2 justify-center">
                                       <button onClick={() => updateOrderStatus(order.id, 'approved')} className="p-2 bg-emerald-500 text-black rounded-xl hover:scale-110 transition-transform"><CheckCircle2 size={14}/></button>
                                       <button onClick={() => setRejectModal(order.id)} className="p-2 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform"><X size={14}/></button>
                                    </div>
                                  )}
                                  {order.status === 'rejected' && (
                                      <span className="text-[9px] text-rose-500 font-bold block max-w-[100px] overflow-hidden truncate" title={order.rejectionReason}>{order.rejectionReason}</span>
                                  )}
                               </td>
                            </tr>
                          ))}
                          {filterOrdersByType(['bus', 'car', 'transit', 'hotel', 'events', 'flights', 'services', 'reward']).length === 0 && <tr><td colSpan="6" className="p-8 text-center text-white/20 italic">لا توجد طلبات متطابقة</td></tr>}
                       </tbody>
                    </table>
                 </div>
               </div>
             ) : (
                /* ADMIN MARKETING FORM */
                <div className="space-y-6 animate-in slide-in-from-right-4 max-w-xl mx-auto pb-10">
                    <form onSubmit={addMarketingEvent} className="bg-[#112240] p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-6"><Megaphone className="text-emerald-500"/> إدراج إعلان جديد (رحلة أو عرض)</h3>
                        <div className="space-y-4">
                           <input name="name" required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500 shadow-inner" placeholder="العنوان (مثال: رحلة اللاذقية، أو سيارة جيب جديدة)" />
                           <textarea name="desc" required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right h-24 outline-none focus:border-emerald-500" placeholder="التفاصيل كاملة..."></textarea>
                           <div className="grid grid-cols-2 gap-4">
                               <input name="date" className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-[10px] text-white outline-none focus:border-emerald-500" placeholder="الموعد (اختياري)" />
                               <input name="price" className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-[10px] text-white outline-none focus:border-emerald-500" placeholder="التكلفة (اختياري)" />
                           </div>
                           <select name="postType" required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500 shadow-inner appearance-none">
                               <option value="event">رحلة / فعالية (تظهر كبطاقة قابلة للحجز)</option>
                               <option value="offer">عرض خاص / خبر جديد (يظهر بالشريط الإعلاني فقط)</option>
                           </select>
                           <select name="iconType" className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500 shadow-inner appearance-none">
                               <option value="party">أيقونة: سهرة / حفلة / عام</option>
                               <option value="sea">أيقونة: رحلة بحرية / سفينة</option>
                               <option value="tent">أيقونة: تخييم / طبيعة</option>
                           </select>
                           <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-[2rem] font-black text-xs shadow-lg active:scale-95 transition-all mt-2">نشر الإعلان للمستخدمين</button>
                        </div>
                    </form>
                    <div className="space-y-3">
                        <h4 className="text-[10px] text-emerald-500 font-black px-2">الإعلانات المنشورة حالياً:</h4>
                        {dynamicEvents.map(ev => {
                            const EventIcon = ev.iconType === 'sea' ? Ship : ev.iconType === 'tent' ? Tent : Music;
                            return (
                                <div key={ev.id} className="bg-[#112240] p-5 rounded-3xl border border-white/5 flex items-center gap-4 shadow-lg">
                                    <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                                        <EventIcon size={20}/>
                                    </div>
                                    <div className="flex-1 text-right">
                                       <div className="font-black text-sm text-white flex items-center gap-2">
                                           {ev.name}
                                           <span className={`text-[8px] px-2 py-0.5 rounded ${ev.postType === 'offer' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                               {ev.postType === 'offer' ? 'عرض إعلاني' : 'رحلة'}
                                           </span>
                                       </div>
                                       <div className="text-[10px] text-white/50 mt-1">{ev.date} {ev.price ? `• ${ev.price}` : ''}</div>
                                    </div>
                                    <button onClick={() => deleteMarketingEvent(ev.id)} className="text-rose-500/50 hover:text-rose-500 p-2 transition-colors bg-rose-500/10 rounded-xl"><Trash2 size={16}/></button>
                                </div>
                            )
                        })}
                    </div>
                </div>
             )}
          </div>
        ) : (
          /* USER VIEWS */
          <div className="space-y-6 pb-10">
            {activeView === 'main' && (
              <div className="space-y-6 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative rounded-[3rem] overflow-hidden aspect-[16/9] border border-white/5 shadow-2xl">
                   <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800" className="w-full h-full object-cover opacity-50" alt="Travel Hero"/>
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent"></div>
                   <div className="absolute top-6 left-6"><HTLogo /></div>
                   <div className="absolute bottom-6 right-6 text-right">
                      <h2 className="text-3xl font-black italic uppercase leading-none tracking-tighter">شهباء <span className="text-emerald-400">Go</span></h2>
                      <p className="text-xs text-white/80 font-bold mt-2 leading-relaxed">
                         نصلك أينما كنت، ونأخذك حيثما تريد.<br/>
                         <span className="text-emerald-400">هدفنا راحتك دائماً.</span>
                      </p>
                   </div>
                </div>

                {/* Marketing Banner for App Usage */}
                <div onClick={() => !user?.isAnonymous ? setActiveView('wallet') : setAuthModal('signup')} className="bg-gradient-to-r from-emerald-900/40 to-[#112240] border border-emerald-500/20 p-5 rounded-[2rem] flex items-center gap-4 shadow-lg animate-in zoom-in-95 cursor-pointer hover:border-emerald-500/40 transition-colors">
                   <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                      <Star size={24} fill="currentColor" className="opacity-80"/>
                   </div>
                   <div className="flex-1">
                      <h4 className="text-xs font-black text-emerald-400">انضم لنادي النخبة HT</h4>
                      <p className="text-[9px] text-white/60 mt-1 leading-relaxed font-bold">احجز عبر التطبيق واحصل على <span className="text-white">نقاط وهدايا حصرية</span> لعملائنا المميزين.</p>
                   </div>
                </div>

                {/* Highlighted Events / Trips */}
                {dynamicEvents.filter(ev => ev.postType !== 'offer').length > 0 && (
                   <div className="space-y-3 animate-in fade-in">
                      <h3 className="text-sm font-black text-emerald-400 px-2 flex items-center gap-2"><Sparkles size={16}/> رحلات قادمة لا تفوتها</h3>
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                         {dynamicEvents.filter(ev => ev.postType !== 'offer').map(trip => (
                            <div key={trip.id} onClick={() => { setSelectedCategory('events'); setBookingItem(trip); setActiveView('list'); }} className="min-w-[240px] bg-gradient-to-br from-[#112240] to-[#0B192C] p-5 rounded-[2.5rem] border border-white/5 shrink-0 shadow-xl cursor-pointer hover:border-emerald-500/50 transition-colors relative overflow-hidden group">
                               <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-[100%] transition-transform group-hover:scale-110"></div>
                               <h4 className="text-sm font-black text-white relative z-10">{trip.name}</h4>
                               <p className="text-[10px] text-white/50 mt-1 relative z-10">{trip.date}</p>
                               <div className="mt-3 flex justify-between items-center relative z-10">
                                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl">{trip.price}</span>
                                  <ChevronLeft size={16} className="text-white/30 group-hover:text-emerald-400 transition-colors"/>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                   {CATEGORIES.map(cat => (
                     <button key={cat.id} disabled={!cat.active} onClick={() => {setSelectedCategory(cat.id); setActiveView('list'); setSelectedHotel(null); setSelectedCity(null); setSelectedBusType(null);}} 
                       className={`p-5 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-3 border transition-all ${cat.active ? 'bg-white/5 border-white/10 hover:border-emerald-500/30 hover:bg-white/10 active:scale-95 shadow-lg' : 'opacity-40 grayscale'}`}>
                        <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-md`}>
                           <cat.icon size={26} />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-[13px] font-black tracking-tight">{cat.title}</h4>
                           <p className="text-[8px] text-white/40 font-bold mt-1 line-clamp-1">{cat.sub}</p>
                        </div>
                     </button>
                   ))}
                </div>
              </div>
            )}

            {/* WALLET / REWARDS VIEW */}
            {activeView === 'wallet' && (
              <div className="space-y-6 max-w-xl mx-auto animate-in fade-in slide-in-from-right-4">
                 <div className="bg-gradient-to-br from-emerald-900 to-[#112240] p-8 rounded-[3rem] text-center shadow-2xl relative overflow-hidden border border-emerald-500/20">
                     <Award size={100} className="text-emerald-500/10 absolute -top-4 -right-8 transform rotate-12" />
                     <div className="flex justify-center mb-4"><HTLogo /></div>
                     <h2 className="text-2xl font-black text-white mb-2">نادي النخبة HT</h2>
                     <p className="text-xs text-emerald-100/70 mb-6">اجمع النقاط مع كل طلب وحوّلها لهدايا مميزة تحمل بصمتنا</p>
                     
                     {user?.isAnonymous ? (
                         <button onClick={() => setAuthModal('signup')} className="bg-emerald-500 text-black px-6 py-3 rounded-2xl font-black text-xs shadow-lg animate-pulse">
                             سجل حسابك الآن لتفعيل المحفظة
                         </button>
                     ) : (
                         <div className="bg-[#0B192C]/60 backdrop-blur-md rounded-[2rem] p-5 inline-block border border-white/5">
                             <p className="text-[10px] text-emerald-400 font-black uppercase mb-1">رصيد نقاطك الحالي</p>
                             <div className="flex items-baseline justify-center gap-1">
                                 <span className="text-5xl font-black text-white">{userPoints}</span>
                                 <span className="text-sm font-bold text-white/50">نقطة</span>
                             </div>
                         </div>
                     )}
                 </div>

                 {redeemSuccess && (
                     <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-center text-[10px] font-black flex items-center justify-center gap-2 animate-in zoom-in-95">
                         <PartyPopper size={16}/> {redeemSuccess}
                     </div>
                 )}

                 <div>
                     <h3 className="text-lg font-black px-2 mb-4 flex items-center gap-2"><Gift size={18} className="text-emerald-400"/> متجر هدايا HT</h3>
                     <div className="space-y-4">
                         {HT_REWARDS.map(reward => (
                             <div key={reward.id} className="bg-[#112240] border border-white/5 p-4 rounded-[2.5rem] flex items-center gap-4 shadow-lg group">
                                 <div className={`w-16 h-16 ${reward.bg} ${reward.color} rounded-[1.5rem] flex items-center justify-center shrink-0`}>
                                     <reward.icon size={28}/>
                                 </div>
                                 <div className="flex-1 text-right">
                                     <h4 className="text-sm font-black text-white">{reward.name}</h4>
                                     <p className="text-[9px] text-white/40 mt-1 leading-relaxed">{reward.desc}</p>
                                     <div className="text-[10px] font-black text-emerald-400 mt-2 bg-emerald-500/10 inline-block px-2 py-0.5 rounded-lg">{reward.points} نقطة</div>
                                 </div>
                                 <button onClick={() => handleRedeemReward(reward)} className={`px-4 py-3 rounded-xl font-black text-[10px] shadow-lg transition-all active:scale-95 ${(!user?.isAnonymous && userPoints >= reward.points) ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>
                                     استبدال
                                 </button>
                             </div>
                         ))}
                     </div>
                 </div>
              </div>
            )}

            {activeView === 'list' && (
               <div className="space-y-6 animate-in slide-in-from-left-4 max-w-xl mx-auto">
                  <div className="flex items-center gap-4 bg-[#112240] p-4 rounded-3xl border border-white/5 shadow-lg">
                     <button onClick={() => {
                       if (selectedCategory === 'hotel' && selectedHotel) { setSelectedHotel(null); }
                       else if (selectedCategory === 'hotel' && selectedCity) { setSelectedCity(null); }
                       else if (selectedCategory === 'bus' && selectedBusType) { setSelectedBusType(null); }
                       else { setActiveView('main'); setSelectedCategory(null); setSelectedBusType(null); setSelectedCity(null); }
                     }} className="w-10 h-10 bg-white/5 hover:bg-emerald-500 hover:text-black rounded-xl flex items-center justify-center transition-colors"><ChevronLeft className="rotate-180"/></button>
                     <div className="text-right flex-1">
                        <h2 className="text-lg font-black text-white">{CATEGORIES.find(c => c.id === selectedCategory)?.title}</h2>
                        <p className="text-[10px] text-white/40">{selectedHotel ? selectedHotel.name : selectedCity ? `فنادق ${selectedCity.name}` : selectedBusType ? 'حجز باصات' : 'اختر ما يناسبك'}</p>
                     </div>
                  </div>

                  <div className="space-y-4 pb-10">
                    {/* FLIGHTS VIEW */}
                    {selectedCategory === 'flights' && (
                        <div className="bg-[#112240] p-8 rounded-[3rem] border border-white/5 shadow-xl text-center space-y-4 animate-in zoom-in-95">
                            <Plane size={48} className="mx-auto text-cyan-400 mb-4 animate-bounce" />
                            <h3 className="font-black text-lg text-white">حجز طيران بأفضل الأسعار</h3>
                            <p className="text-xs text-white/50 leading-relaxed px-4">عليك فقط تحديد المطارات والتاريخ، وسنقوم بتزويدك بأفضل الرحلات المتوفرة.</p>
                            <div className="flex flex-col gap-3 pt-4">
                              <button onClick={() => setBookingItem({title: 'حجز طيران'})} className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black text-xs shadow-lg shadow-cyan-600/20 active:scale-95 transition-all">بدء طلب الحجز</button>
                              <button onClick={openWhatsApp} className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-black transition-all">
                                <MessageCircle size={18}/> دردشة لمعرفة الرحلات المتاحة
                              </button>
                            </div>
                        </div>
                    )}

                    {/* TRANSIT VIEW */}
                    {selectedCategory === 'transit' && (
                        <div className="bg-[#112240] p-8 rounded-[3rem] border border-white/5 shadow-xl text-center animate-in zoom-in-95">
                            <Globe size={48} className="mx-auto text-indigo-400 mb-4 animate-pulse" />
                            <h3 className="font-black text-lg text-white">سفريات المحافظات</h3>
                            <p className="text-xs text-white/50 px-4 mt-2 mb-6 leading-relaxed">نقل آمن ومريح بسيارات VIP عادية أو سيارات جيب.</p>
                            <button onClick={() => setBookingItem({title: 'طلب سفر بين المحافظات'})} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">حجز رحلة سفر</button>
                        </div>
                    )}
                    
                    {/* PUBLIC SERVICES VIEW */}
                    {selectedCategory === 'services' && (
                        <div className="grid grid-cols-1 gap-4">
                           {PUBLIC_SERVICES_LIST.map(srv => (
                              <button key={srv.id} onClick={() => setBookingItem(srv)} className="bg-[#112240] border border-white/5 p-6 rounded-[2.5rem] flex items-center gap-4 text-right hover:bg-white/5 transition-all group shadow-md">
                                 <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-emerald-400"><srv.icon size={24}/></div>
                                 <div className="flex-1">
                                    <h4 className="font-black text-sm text-white">{srv.title}</h4>
                                    <p className="text-[10px] text-white/40 mt-1">{srv.desc}</p>
                                 </div>
                                 <ChevronRight size={16} className="text-slate-500"/>
                              </button>
                           ))}
                        </div>
                    )}

                    {/* CARS LIST */}
                    {selectedCategory === 'car' && CAR_MODELS.map(car => (
                        <div key={car.id} className="bg-[#112240] rounded-[2.5rem] overflow-hidden border border-white/5 p-4 shadow-lg group hover:border-emerald-500/30 transition-all">
                           <div className="relative mb-4">
                              <img src={car.img} className="w-full h-44 object-cover rounded-[2rem]" alt={car.name}/>
                           </div>
                           <div className="flex justify-between items-center px-2">
                              <div className="text-right">
                                 <h4 className="font-black text-white">{car.name}</h4>
                              </div>
                              <button onClick={() => setBookingItem(car)} className="bg-emerald-500 text-black px-8 py-2.5 rounded-2xl font-black text-xs shadow-lg active:scale-95">احجز الآن</button>
                           </div>
                        </div>
                    ))}

                    {/* BUSES */}
                    {selectedCategory === 'bus' && !selectedBusType && (
                        <div className="grid grid-cols-1 gap-4">
                           {BUS_TYPES.map(type => (
                              <button key={type.id} onClick={() => {setSelectedBusType(type.id); if(type.id === 'leisure') setBookingItem(type);}} 
                                className="p-6 bg-[#112240] border border-white/5 rounded-[2.5rem] flex items-center gap-5 text-right hover:bg-white/5 transition-all shadow-lg">
                                 <div className={`w-14 h-14 ${type.color} rounded-2xl flex items-center justify-center`}><type.icon size={24}/></div>
                                 <div className="flex-1">
                                    <h4 className="font-black text-base text-white">{type.title}</h4>
                                    <p className="text-[10px] text-white/40 mt-1">{type.sub}</p>
                                 </div>
                                 <Plus size={20} className="text-white/20"/>
                              </button>
                           ))}
                        </div>
                    )}
                    {selectedCategory === 'bus' && selectedBusType === 'contract' && (
                       <div className="text-center py-12 bg-[#112240] rounded-[3rem] border border-white/5 shadow-xl">
                           <School size={48} className="mx-auto text-blue-500 mb-4 animate-bounce"/>
                           <h3 className="text-white font-black mb-6 text-lg">تأمين باصات للمدارس والمعامل</h3>
                           <button onClick={() => setBookingItem({title: 'عقود مدارس ومعامل', type: 'bus'})} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-lg">تعبئة بيانات العقد</button>
                       </div>
                    )}

                    {/* HOTELS */}
                    {selectedCategory === 'hotel' && !selectedCity && (
                       <div className="grid grid-cols-2 gap-4">
                          {CITIES.map(city => (
                             <button key={city.id} onClick={() => setSelectedCity(city)} className="bg-[#112240] rounded-[2.5rem] border border-white/5 p-4 flex flex-col items-center gap-3 hover:bg-white/5 transition-all shadow-lg">
                                <img src={city.img} className="w-full h-24 object-cover rounded-2xl opacity-80" alt={city.name} />
                                <h4 className="text-sm font-black text-white">{city.name}</h4>
                             </button>
                          ))}
                       </div>
                    )}
                    {selectedCategory === 'hotel' && selectedCity && !selectedHotel && (
                       <div className="grid grid-cols-1 gap-4">
                          <h3 className="text-xs font-black text-amber-500 px-2 flex items-center gap-2"><MapPin size={14}/> فنادق {selectedCity.name}</h3>
                          {HOTELS_DATA.filter(h => h.cityId === selectedCity.id).map(hotel => (
                             <div key={hotel.id} className="bg-[#112240] rounded-[2.5rem] overflow-hidden border border-white/5 p-4 shadow-lg">
                                <img src={hotel.img} className="w-full h-32 object-cover rounded-[2rem] mb-4 opacity-80" alt={hotel.name}/>
                                <div className="flex justify-between items-center px-2">
                                   <div className="text-right">
                                      <h4 className="font-black text-white text-sm">{hotel.name}</h4>
                                      <p className="text-[10px] text-white/40 mt-1">{hotel.desc}</p>
                                   </div>
                                   <button onClick={() => setSelectedHotel(hotel)} className="bg-amber-500 text-black px-6 py-2 rounded-2xl font-black text-xs">عرض الغرف</button>
                                </div>
                             </div>
                          ))}
                       </div>
                    )}
                    {selectedCategory === 'hotel' && selectedHotel && (
                       <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-right-4">
                          {ROOM_TYPES.map(room => (
                             <button key={room.id} onClick={() => setBookingItem(room)} 
                               className="p-6 bg-[#112240] border border-white/5 rounded-[2.5rem] flex items-center gap-5 hover:bg-white/5 transition-all text-right group shadow-lg">
                                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-colors"><room.icon size={20}/></div>
                                <div className="flex-1">
                                   <h4 className="font-black text-base text-white">{room.name}</h4>
                                   <p className="text-[10px] text-white/40 mt-1">{room.desc}</p>
                                </div>
                                <Plus size={20} className="text-white/20"/>
                             </button>
                          ))}
                       </div>
                    )}

                    {/* EVENTS */}
                    {selectedCategory === 'events' && (
                       <div className="grid grid-cols-1 gap-4">
                          {dynamicEvents.filter(ev => ev.postType !== 'offer').map(event => {
                              const EventIcon = event.iconType === 'sea' ? Ship : event.iconType === 'tent' ? Tent : Music;
                              return (
                                 <div key={event.id} className="bg-[#112240] p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-4 text-right shadow-lg">
                                    <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center shrink-0"><EventIcon size={24}/></div>
                                    <div className="flex-1">
                                       <h4 className="font-black text-sm text-white">{event.name}</h4>
                                       <p className="text-[10px] text-white/40 font-bold mt-1">{event.date} • <span className="text-emerald-400">{event.price}</span></p>
                                       <p className="text-[9px] text-rose-400 mt-1">{event.desc}</p>
                                    </div>
                                    <button onClick={() => setBookingItem(event)} className="bg-rose-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black">حجز</button>
                                 </div>
                              );
                          })}
                          {dynamicEvents.filter(ev => ev.postType !== 'offer').length === 0 && (
                              <div className="text-center py-10 opacity-50">
                                  <p className="text-xs font-bold">لا توجد رحلات قادمة حالياً. تابعنا للحصول على أحدث العروض!</p>
                              </div>
                          )}
                       </div>
                    )}
                  </div>
               </div>
            )}

            {activeView === 'bookings' && (
              <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto pb-20">
                 <h2 className="text-xl font-black text-white px-2 flex items-center gap-2"><ClipboardList size={20} className="text-emerald-500"/> سجل طلباتي</h2>
                 
                 {/* PENDING / APPROVED TABLE */}
                 <div className="space-y-4">
                     <h3 className="text-xs font-black text-emerald-400/50 mr-2 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14}/> الطلبات الجارية والمقبولة</h3>
                     <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-[#112240] shadow-lg">
                        <table className="w-full text-right text-[11px]">
                           <thead>
                              <tr className="bg-white/5 text-white/40 border-b border-white/5">
                                 <th className="p-4">الخدمة</th>
                                 <th className="p-4">التاريخ</th>
                                 <th className="p-4">الحالة</th>
                                 <th className="p-4">تكرار</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {userOrders.filter(o => o.status !== 'rejected').map(order => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                   <td className="p-4">
                                      <div className="font-black text-emerald-400">{order.serviceTitle}</div>
                                   </td>
                                   <td className="p-4 text-white/50">{safeFormatDate(order.createdAt)}</td>
                                   <td className="p-4"><StatusBadge status={order.status} /></td>
                                   <td className="p-4">
                                      <button onClick={() => repeatOrder(order)} className="p-2 bg-white/5 hover:bg-emerald-500 hover:text-black rounded-lg transition-all text-white">
                                         <RotateCcw size={12}/>
                                      </button>
                                   </td>
                                </tr>
                              ))}
                              {userOrders.filter(o => o.status !== 'rejected').length === 0 && <tr><td colSpan="4" className="p-8 text-center text-white/20 italic">لا يوجد طلبات</td></tr>}
                           </tbody>
                        </table>
                     </div>
                 </div>

                 {/* REJECTED TABLE */}
                 <div className="space-y-4">
                     <h3 className="text-xs font-black text-rose-500/50 mr-2 uppercase tracking-widest flex items-center gap-2"><AlertCircle size={14}/> الطلبات المرفوضة (للتعديل)</h3>
                     <div className="overflow-x-auto rounded-[2.5rem] border border-rose-500/20 bg-[#112240] shadow-lg">
                        <table className="w-full text-right text-[11px]">
                           <thead>
                              <tr className="bg-rose-500/10 text-rose-500/40 border-b border-rose-500/10">
                                 <th className="p-4">الخدمة وسبب الرفض</th>
                                 <th className="p-4 text-center">إجراء</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {userOrders.filter(o => o.status === 'rejected').map(order => (
                                <tr key={order.id} className="hover:bg-rose-500/10 transition-colors">
                                   <td className="p-4">
                                      <div className="font-black text-rose-400 mb-1">{order.serviceTitle}</div>
                                      <div className="text-[9px] bg-rose-500/10 text-rose-400 p-2 rounded inline-block font-bold">السبب: {order.rejectionReason || 'غير محدد'}</div>
                                   </td>
                                   <td className="p-4 text-center">
                                      <button onClick={() => handleEditOrder(order)} className="px-3 py-2 bg-rose-500 text-white rounded-xl font-black text-[9px]">تعديل وإعادة إرسال</button>
                                   </td>
                                </tr>
                              ))}
                              {userOrders.filter(o => o.status === 'rejected').length === 0 && <tr><td colSpan="2" className="p-8 text-center text-white/20 italic">لا يوجد طلبات مرفوضة</td></tr>}
                           </tbody>
                        </table>
                     </div>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Unified Booking Modal */}
      {bookingItem && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
           <div className="bg-[#112240] w-full max-w-md p-6 rounded-[3rem] border border-white/10 relative overflow-y-auto max-h-[95vh] shadow-2xl">
              <button onClick={() => {setBookingItem(null);}} className="absolute top-6 left-6 text-white/20 hover:text-rose-500 transition-colors"><X size={20}/></button>
              
              <div className="text-right mb-6">
                 <h3 className="text-xl font-black text-white">{bookingItem?.isEditMode ? 'تعديل الطلب المرفوض' : 'إكمال بيانات الحجز'}</h3>
                 <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-widest">{bookingItem.name || bookingItem.title || bookingItem.serviceTitle}</p>
              </div>

              <form onSubmit={submitBooking} className="space-y-4 text-right">
                 
                 {/* CONTACT INFO */}
                 <div className="grid grid-cols-2 gap-4">
                    <input name="name" required defaultValue={bookingItem?.name || localStorage.getItem('sh-user-name') || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500 shadow-inner" placeholder="الاسم الكامل" />
                    <input name="phone" required defaultValue={bookingItem?.phone || localStorage.getItem('sh-user-phone') || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-2xl p-4 text-xs text-left text-white outline-none focus:border-emerald-500 shadow-inner" placeholder="09xxxxxx" />
                 </div>

                 {/* HOTEL SPECIFIC FIELDS */}
                 {selectedCategory === 'hotel' && (
                   <div className="space-y-3 p-4 bg-amber-500/5 rounded-3xl border border-amber-500/10">
                      <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400 text-[9px] font-bold text-center flex justify-center items-center gap-1"><Info size={12}/> الاستلام والتسليم الساعة 11 صباحاً</div>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label className="text-[9px] text-amber-500/50 mr-2">من تاريخ</label>
                            <input name="checkIn" type="date" required defaultValue={bookingItem?.checkIn || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[9px] text-amber-500/50 mr-2">إلى تاريخ</label>
                            <input name="checkOut" type="date" required defaultValue={bookingItem?.checkOut || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white" />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <input name="nightCount" type="number" min="1" placeholder="عدد الليالي" required defaultValue={bookingItem?.nightCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right" />
                         <input name="paxCount" type="number" min="1" placeholder="عدد الأشخاص" required defaultValue={bookingItem?.paxCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right" />
                      </div>
                      <select name="hasKids" required defaultValue={bookingItem?.hasKids || "no"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none">
                         <option value="no">لا يوجد أطفال</option>
                         <option value="yes">يوجد أطفال</option>
                      </select>
                   </div>
                 )}

                 {/* FLIGHTS SPECIFIC FIELDS */}
                 {selectedCategory === 'flights' && (
                   <div className="space-y-3 p-4 bg-cyan-500/5 rounded-3xl border border-cyan-500/10">
                      <div className="grid grid-cols-2 gap-3">
                         <input name="fromAirport" required placeholder="من مطار..." defaultValue={bookingItem?.fromAirport || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right" />
                         <input name="toAirport" required placeholder="إلى مطار..." defaultValue={bookingItem?.toAirport || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] text-cyan-500/50 mr-2">تاريخ الرحلة</label>
                         <input name="flightDate" type="date" required defaultValue={bookingItem?.flightDate || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white" />
                      </div>
                   </div>
                 )}

                 {/* TRANSIT SPECIFIC FIELDS */}
                 {selectedCategory === 'transit' && (
                   <div className="space-y-3 p-4 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
                      <div className="grid grid-cols-2 gap-3">
                         <input name="fromLocation" required placeholder="مكان الانطلاق" defaultValue={bookingItem?.fromLocation || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right" />
                         <input name="toLocation" required placeholder="الوجهة" defaultValue={bookingItem?.toLocation || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right" />
                      </div>
                      <select name="transitType" required defaultValue={bookingItem?.transitType || "راكب واحد"} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none">
                         <option value="راكب واحد">راكب واحد</option>
                         <option value="راكبين">راكبين</option>
                         <option value="سيارة كاملة">سيارة كاملة</option>
                      </select>
                      <select name="carTypePreference" required defaultValue={bookingItem?.carTypePreference || "normal"} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none">
                         <option value="normal">سيارة VIP عادية</option>
                         <option value="jeep">تفضيل سيارة جيب (Jeep)</option>
                      </select>
                   </div>
                 )}

                 {/* SERVICES SPECIFIC FIELDS */}
                 {selectedCategory === 'services' && (
                   <div className="space-y-3 p-4 bg-slate-500/5 rounded-3xl border border-slate-500/10">
                      <label className="text-[9px] text-slate-400 font-bold">يرجى كتابة التفاصيل الدقيقة للمعاملة أو الأوراق:</label>
                      <textarea name="serviceDetails" required defaultValue={bookingItem?.serviceDetails || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right h-24 outline-none" placeholder="تفاصيل الخدمة المطلوبة..."></textarea>
                   </div>
                 )}

                 {/* BUS CONTRACTS FIELDS */}
                 {selectedCategory === 'bus' && selectedBusType === 'contract' && (
                   <div className="space-y-3 p-4 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                      <input name="orgName" required placeholder="اسم المدرسة / المعمل" defaultValue={bookingItem?.orgName || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right" />
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1 text-right">
                            <label className="text-[9px] text-white/30 mr-2">بداية الدوام</label>
                            <input name="startTime" type="time" required defaultValue={bookingItem?.startTime || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white" />
                         </div>
                         <div className="space-y-1 text-right">
                            <label className="text-[9px] text-white/30 mr-2">نهاية الدوام</label>
                            <input name="endTime" type="time" required defaultValue={bookingItem?.endTime || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white" />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <input name="workerCount" type="number" min="1" placeholder="عدد العمال/الطلاب" required defaultValue={bookingItem?.workerCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right" />
                         <input name="busCount" type="number" min="1" placeholder="كم باص؟" required defaultValue={bookingItem?.busCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right" />
                      </div>
                   </div>
                 )}

                 {/* BUS LEISURE & EVENTS FIELDS */}
                 {(selectedCategory === 'bus' && selectedBusType === 'leisure') && (
                   <div className="space-y-3 p-4 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                           <label className="text-[9px] text-white/30 mr-2">تاريخ الرحلة</label>
                           <input name="tripDate" type="date" required defaultValue={bookingItem?.tripDate || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white" />
                         </div>
                         <div className="space-y-1">
                           <label className="text-[9px] text-white/30 mr-2">وقت الانطلاق</label>
                           <input name="tripTime" type="time" required defaultValue={bookingItem?.tripTime || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white" />
                         </div>
                      </div>
                   </div>
                 )}

                 {selectedCategory === 'events' && (
                    <div className="grid grid-cols-2 gap-3 bg-rose-500/5 p-5 rounded-3xl border border-rose-500/10">
                       <input name="paxCount" type="number" min="1" placeholder="عدد الأشخاص" required defaultValue={bookingItem?.paxCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right" />
                       <select name="hasKids" required defaultValue={bookingItem?.hasKids || "no"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none">
                          <option value="no">لا يوجد أطفال</option>
                          <option value="yes">نعم، يوجد أطفال</option>
                       </select>
                    </div>
                 )}

                 {/* CAR OPTIONS */}
                 {selectedCategory === 'car' && (
                    <div className="space-y-3 p-4 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1 text-right">
                                <label className="text-[9px] text-emerald-500/50 mr-2 font-bold">المدة</label>
                                <select name="rentDuration" required defaultValue={bookingItem?.rentDuration || "daily"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none">
                                    <option value="daily">يومي</option>
                                    <option value="weekly">أسبوعي</option>
                                    <option value="monthly">شهري</option>
                                </select>
                            </div>
                            <div className="space-y-1 text-right">
                                <label className="text-[9px] text-emerald-500/50 mr-2 font-bold">السائق</label>
                                <select name="driverOption" required defaultValue={bookingItem?.driverOption || "with_driver"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none">
                                    <option value="with_driver">مع سائق</option>
                                    <option value="without_driver">بدون سائق</option>
                                </select>
                            </div>
                        </div>
                    </div>
                 )}

                 {/* PAYMENT SECTION - ALWAYS AT THE BOTTOM */}
                 <div className="pt-4 border-t border-white/5 space-y-3">
                    <p className="text-[9px] font-black text-white/40 uppercase">اختر طريقة الدفع المفضلة</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setPaymentMethod('office')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'office' ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/20' : 'bg-[#0B192C] border-white/10 text-white/40'}`}>
                            <Store size={18}/>
                            <span className="text-[10px] font-black">الدفع بالمكتب</span>
                        </button>
                        <button type="button" onClick={() => setPaymentMethod('cham_cash')} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'cham_cash' ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' : 'bg-[#0B192C] border-white/10 text-white/40'}`}>
                            <Wallet size={18}/>
                            <span className="text-[10px] font-black">شام كاش</span>
                        </button>
                    </div>
                    {paymentMethod === 'office' && <p className="text-[8px] text-emerald-400/60 text-center mt-2 font-bold">مركزنا: حلب - محطة بغداد - مقابل المحطة</p>}
                 </div>

                 <button type="submit" className="w-full bg-emerald-500 py-4 rounded-2xl font-black text-xs text-black mt-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                     {bookingItem?.isEditMode ? 'حفظ التعديلات وإعادة الإرسال' : 'تأكيد وإرسال الطلب'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Admin Rejection Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/95 z-[2000] flex items-center justify-center p-6">
           <div className="bg-[#112240] w-full max-sm p-8 rounded-[2.5rem] border border-rose-500/20 space-y-4 shadow-2xl">
              <h3 className="text-lg font-black text-rose-500 text-right uppercase tracking-widest flex items-center gap-2"><Trash2 size={20}/> توضيح سبب الرفض</h3>
              <textarea id="reasonText" className="w-full bg-[#0B192C] border border-white/5 rounded-2xl p-4 text-xs h-36 text-white text-right outline-none focus:border-rose-500 leading-relaxed" placeholder="اكتب السبب للعميل (مثال: يرجى تغيير عدد الأشخاص)..."></textarea>
              <button onClick={() => updateOrderStatus(rejectModal, 'rejected', document.getElementById('reasonText')?.value)} className="w-full bg-rose-600 py-4 rounded-2xl font-black text-xs text-white shadow-lg shadow-rose-600/20">تأكيد الرفض النهائي</button>
              <button onClick={() => setRejectModal(null)} className="w-full text-[10px] text-white/30 font-bold uppercase tracking-tighter transition-colors hover:text-white">تراجع</button>
           </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessCard && (
        <div className="fixed inset-0 bg-emerald-950/90 backdrop-blur-md z-[2000] flex items-center justify-center p-6 text-black">
           <div className="bg-white w-full max-w-sm p-10 rounded-[4rem] text-center shadow-2xl relative overflow-hidden animate-in zoom-in-75">
              <PartyPopper size={64} className="mx-auto text-emerald-600 mb-6 animate-bounce" />
              <h3 className="text-2xl font-black mb-2 italic">تم بنجاح!</h3>
              <p className="text-sm font-bold text-gray-600 mb-2 leading-relaxed">
                شكراً لثقتك بـ HT. سيقوم فريقنا بالرد عليك فوراً.
              </p>
              {(!bookingItem?.isEditMode && !user?.isAnonymous) && (
                  <p className="text-xs text-emerald-600 font-bold mb-8 bg-emerald-50 p-2 rounded-lg">🎁 تم إضافة 25 نقطة لمحفظتك!</p>
              )}
              {(!bookingItem?.isEditMode && user?.isAnonymous) && (
                  <p className="text-[10px] text-rose-600 font-bold mb-8 bg-rose-50 p-2 rounded-lg cursor-pointer hover:bg-rose-100" onClick={() => {setShowSuccessCard(false); setAuthModal('signup');}}>
                      💡 فاتتك 25 نقطة! أنشئ حسابك الآن لتبدأ بجمع النقاط.
                  </p>
              )}
              <button onClick={() => {setShowSuccessCard(false); setActiveView('main');}} className="w-full bg-black text-white py-4 rounded-3xl font-black text-xs shadow-xl active:scale-95 transition-all uppercase">العودة للرئيسية</button>
           </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#112240]/95 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-4 flex justify-around shadow-2xl z-[500] border-t border-emerald-500/10">
         <button onClick={() => {setActiveView('main'); setIsAdmin(false); setSelectedCategory(null); setSelectedHotel(null); setSelectedCity(null); setSelectedBusType(null);}} className={`${activeView === 'main' && !isAdmin ? 'text-emerald-400 scale-110 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-white/30'} flex flex-col items-center gap-1.5 transition-all duration-300`}>
            <LayoutGrid size={22}/><span className="text-[8px] font-black uppercase">الرئيسية</span>
         </button>
         <button onClick={() => {setActiveView('bookings'); setIsAdmin(false);}} className={`${activeView === 'bookings' && !isAdmin ? 'text-emerald-400 scale-110 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-white/30'} flex flex-col items-center gap-1.5 transition-all duration-300`}>
            <Ticket size={22}/><span className="text-[8px] font-black uppercase">طلباتي</span>
         </button>
         <button onClick={() => {setSelectedCategory('events'); setActiveView('list'); setIsAdmin(false);}} className={`${selectedCategory === 'events' ? 'text-emerald-400 scale-110 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-white/30'} flex flex-col items-center gap-1.5 transition-all duration-300`}>
            <Megaphone size={22}/><span className="text-[8px] font-black uppercase">الفعاليات</span>
         </button>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif; -webkit-tap-highlight-color: transparent; scroll-behavior: smooth; }
        input[type="date"], input[type="time"], input[type="number"], input[type="email"], input[type="password"] { color-scheme: dark; }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: left 0.75rem center; background-size: 1rem; }
      `}</style>
    </div>
  );
}
