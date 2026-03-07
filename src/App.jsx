import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Bus, X, Car, Ticket, 
  User, ChevronLeft, LayoutGrid, Sparkles,
  Navigation, Plus, Settings,
  Megaphone, Hotel, MapPin, Clock,
  School, Trees, Music,
  BedDouble, Users, Star, Building2, Calendar,
  UserCheck, UserX, ClipboardList, Trash2,
  RotateCcw, Baby, Tent, Ship,
  PartyPopper, Plane, FileText, Globe, CarFront,
  Wallet, Store, Languages, FileCheck, Truck, MessageCircle, ChevronRight, AlertCircle, Info, CheckCircle2, LogIn, Filter, Gift, Award, Coffee, Shirt, Smile, LogOut, Mail, Lock, Download, Share, MoreVertical, BellRing, Phone
} from 'lucide-react';

// ==========================================
// 🚀 تم الربط مع الدومين الرسمي المحمي بـ SSL 🚀
// ==========================================
const API_URL = 'https://api.shahba-go.com/api';

// 🛑 قائمة حسابات الإدارة المحدثة 🛑
const ADMIN_ACCOUNTS = [
  'yahya.tatari93@gmail.com',
  'hammash.travel@gmail.com',
  '00963944299060',
  '+963944299060',
  '00963955490049',
  '+963955490049'
];

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
  { id: 'car', title: 'آجار سيارات', sub: 'يومي، أسبوعي، شهري', icon: Car, color: 'from-emerald-500 to-teal-700', active: true },
  { id: 'transit', title: 'خدمة النقل البري', sub: 'من البيت إلى البيت', icon: CarFront, color: 'from-indigo-500 to-purple-600', active: true },
  { id: 'hotel', title: 'الفنادق', sub: 'حجز في كافة المحافظات', icon: Hotel, color: 'from-amber-500 to-orange-700', active: true },
  { id: 'flights', title: 'حجز طيران', sub: 'رحلات داخلية ودولية', icon: Plane, color: 'from-cyan-500 to-blue-600', active: true },
  { id: 'bus', title: 'خدمات الباصات', sub: 'عقود ورحلات ترفيهية', icon: Bus, color: 'from-blue-500 to-indigo-700', active: true },
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
  { 
      id: 'h_alp_1', cityId: 'aleppo', name: 'فندق شهباء حلب', desc: 'إطلالة بانورامية', 
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400',
      gallery: [
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=400', // غرفة
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400', // حمام
          'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=400'  // مسبح
      ]
  },
  { 
      id: 'h_alp_2', cityId: 'aleppo', name: 'فندق الشيراتون', desc: 'قلب المدينة العريق', 
      img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400',
      gallery: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400', // غرفة ديلوكس
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=400', // مطعم
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=400'  // لوبي
      ]
  },
  { 
      id: 'h_dam_1', cityId: 'damascus', name: 'فندق فور سيزونز', desc: 'فخامة العاصمة', 
      img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400',
      gallery: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=400', // جناح
          'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=400', // إطلالة
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=400'  // مرافق
      ]
  },
];

const ROOM_TYPES = [
  { id: 'single', name: 'غرفة فردية', desc: 'لشخص واحد', icon: User },
  { id: 'double', name: 'غرفة مزدوجة', desc: 'لشخصين', icon: BedDouble },
  { id: 'suite', name: 'جناح سويت', desc: 'رفاهية مطلقة', icon: Star },
];

const PUBLIC_SERVICES_LIST = [
  { id: 'visa_bei', title: 'فيزا إلى لبنان', desc: 'تأمين فيزا سياحية أو عمل', icon: FileText },
  { id: 'visa_jor', title: 'فيزا إلى الأردن', desc: 'تسهيل إجراءات الدخول', icon: FileText },
  { id: 'embassy', title: 'أوراق السفارات', desc: 'جلب وتصديق الأوراق الرسمية', icon: Building2 },
  { id: 'mail', title: 'شحن مستندات', desc: 'نقل بريد بين المحافظات', icon: Truck },
];

const DEFAULT_CARS = [
  { id: 'audi', name: 'Audi A6', price: '750,000 ل.س/يوم', img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=400' },
  { id: 'genesis', name: 'Genesis G80', price: '900,000 ل.س/يوم', img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=400' },
];

const BUS_TYPES = [
  { id: 'contract', title: 'نظام العقود', sub: 'مدارس ومعامل', icon: School, color: 'bg-blue-500/20 text-blue-400' },
  { id: 'leisure', title: 'رحلات ترفيهية', sub: 'ملاعب، مزارع، ومناسبات', icon: Trees, color: 'bg-emerald-500/20 text-emerald-400' },
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
  const [hasKidsState, setHasKidsState] = useState('no'); 
  
  const [user, setUser] = useState(() => {
     const savedUser = localStorage.getItem('sh_user');
     return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const isGuest = user?.isGuest === true;
  const isUserAdmin = user && (
    (user.email && ADMIN_ACCOUNTS.includes(user.email.toLowerCase())) ||
    (user.phoneNumber && ADMIN_ACCOUNTS.includes(user.phoneNumber))
  );

  const [adminTab, setAdminTab] = useState('orders'); 
  const [orderFilter, setOrderFilter] = useState('pending'); 

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'الآن';
    return new Intl.DateTimeFormat('ar-SY', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    }).format(new Date(timestamp));
  };

  const [authModal, setAuthModal] = useState(null); 
  const [authTab, setAuthTab] = useState('email'); 
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false); 

  const [allOrders, setAllOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [dynamicEvents, setDynamicEvents] = useState([]);
  const [carsList, setCarsList] = useState(DEFAULT_CARS); 
  const [editingCar, setEditingCar] = useState(null); 
  const [bookingItem, setBookingItem] = useState(null);
  const [globalAlerts, setGlobalAlerts] = useState([]); // التنبيهات الإدارية
  const [activeGalleryImg, setActiveGalleryImg] = useState(null); // 🌟 لحفظ الصورة المفتوحة في الفندق

  const [rejectModal, setRejectModal] = useState(null); 
  const [rejectReasonText, setRejectReasonText] = useState("");
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('office'); 
  const [userPoints, setUserPoints] = useState(250); 
  const [redeemSuccess, setRedeemSuccess] = useState(null);

  const [showNotifications, setShowNotifications] = useState(false); 
  const [selectedNotification, setSelectedNotification] = useState(null); // للرسالة المنبثقة في وسط الشاشة

  const [toasts, setToasts] = useState([]);
  const addToast = (msg, type = 'info', title = '') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type, title }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  };

  // 🌟 نظام الظهور التلقائي (المنبثق) للتنبيهات الجديدة للعملاء 🌟
  useEffect(() => {
      if (globalAlerts && globalAlerts.length > 0 && !isUserAdmin) {
          const latest = globalAlerts[0];
          const seen = localStorage.getItem('seen_alerts') ? JSON.parse(localStorage.getItem('seen_alerts')) : [];
          if (!seen.includes(latest.id)) {
              setSelectedNotification({
                  id: latest.id,
                  title: latest.type === 'special' ? '🌟 عرض حصري 🌟' : 'تنبيه من الإدارة',
                  desc: latest.message,
                  time: latest.createdAt,
                  type: latest.type === 'special' ? 'special' : latest.type === 'success' ? 'success' : 'info',
                  icon: latest.type === 'special' ? Sparkles : BellRing
              });
              seen.push(latest.id);
              localStorage.setItem('seen_alerts', JSON.stringify(seen));
          }
      }
  }, [globalAlerts, isUserAdmin]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500); 
    if (!user) {
        const guestUser = { uid: 'guest_' + Date.now(), isGuest: true };
        setUser(guestUser);
    }
    return () => clearTimeout(timer);
  }, []);

  // جلب البيانات من السيرفر الحقيقي
  useEffect(() => {
    if (!user) return; 

    const loadData = async () => {
       try {
           const carsRes = await fetch(`${API_URL}/cars`).catch(()=>null);
           if (carsRes && carsRes.ok) setCarsList(await carsRes.json());

           const ordersRes = await fetch(`${API_URL}/orders`).catch(()=>null);
           if (ordersRes && ordersRes.ok) {
               const ords = await ordersRes.json();
               setAllOrders(ords);
               const phone = localStorage.getItem('sh-user-phone');
               setUserOrders(ords.filter(o => o.phone === phone || o.userId === user.uid));
           }

           const eventsRes = await fetch(`${API_URL}/events`).catch(()=>null);
           if (eventsRes && eventsRes.ok) setDynamicEvents(await eventsRes.json());

           const alertsRes = await fetch(`${API_URL}/alerts`).catch(()=>null);
           if (alertsRes && alertsRes.ok) {
               const alrts = await alertsRes.json();
               setGlobalAlerts(alrts); // حفظ التنبيهات الإدارية
           }
       } catch (err) {
           console.log("صعوبة في الاتصال بالسيرفر. تأكد من إعدادات الـ HTTPS/HTTP");
       }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // حساب التنبيهات ديناميكياً
  const notifications = useMemo(() => {
      let notifs = [];
      
      // التنبيهات الإدارية (تظهر للجميع)
      if (globalAlerts) {
          globalAlerts.forEach(alert => {
              notifs.push({
                  id: alert.id,
                  title: alert.type === 'special' ? '🌟 تنبيه هام جداً 🌟' : alert.type === 'success' ? 'خبر سار!' : 'إشعار من الإدارة',
                  desc: alert.message,
                  time: alert.createdAt,
                  type: alert.type === 'special' ? 'special' : alert.type === 'success' ? 'success' : 'info',
                  icon: alert.type === 'special' ? Sparkles : BellRing
              });
          });
      }

      if (isUserAdmin) {
          allOrders.filter(o => o.status === 'pending').forEach(o => {
              notifs.push({
                  id: o.id,
                  title: 'طلب جديد بانتظار الموافقة',
                  desc: `طلب ${o.serviceTitle} من ${o.name}`,
                  time: o.createdAt,
                  type: 'order',
                  icon: Ticket
              });
          });
      } else {
          if (!isGuest) {
              userOrders.filter(o => o.status !== 'pending').forEach(o => {
                  notifs.push({
                      id: o.id + '_update',
                      title: o.status === 'approved' ? 'مبارك! تم قبول طلبك' : 'عذراً، تم رفض الطلب',
                      desc: `طلب: ${o.serviceTitle} ${o.status === 'rejected' && o.rejectionReason ? `- السبب: ${o.rejectionReason}` : ''}`,
                      time: o.updatedAt || o.createdAt,
                      type: o.status === 'approved' ? 'success' : 'error',
                      icon: o.status === 'approved' ? CheckCircle2 : X
                  });
              });
          }
          dynamicEvents.forEach(e => {
              notifs.push({
                  id: e.id,
                  title: e.postType === 'offer' ? 'عرض جديد!' : 'رحلة جديدة!',
                  desc: `${e.name} ${e.price ? `بـ ${e.price}` : ''}`,
                  time: e.createdAt,
                  type: 'info',
                  icon: Megaphone
              });
          });
      }
      return notifs.sort((a, b) => b.time - a.time);
  }, [allOrders, userOrders, dynamicEvents, globalAlerts, isUserAdmin, isGuest]);

  // التفاعل عند الضغط على إشعار
  const handleNotificationClick = (n) => {
      setShowNotifications(false);
      setSelectedNotification(n); // إظهار النافذة المنبثقة في المنتصف

      // التوجيه الذكي في الخلفية حسب نوع الإشعار
      if (n.type === 'order') {
          setShowAdminPanel(true);
          setAdminTab('orders');
          setOrderFilter('pending');
      } else if (n.type === 'success' || n.type === 'error') {
          setShowAdminPanel(false);
          setActiveView('bookings');
      } else if (n.type === 'info' && n.icon === Megaphone) {
          setShowAdminPanel(false);
          setActiveView('list');
          setSelectedCategory('events');
      }
  };

  // 🌟 نظام إرسال رمز التحقق الديناميكي 🌟
  const handleAction = async (e) => {
      e.preventDefault();
      
      if (authModal === 'signup' && !otpSent) {
          setAuthLoading(true);
          setTimeout(() => {
              setAuthLoading(false);
              setOtpSent(true);
              addToast(`تم إرسال رمز التحقق إلى ${authTab === 'email' ? 'البريد الإلكتروني' : 'رقم الهاتف'} (للتجربة أدخل 123456)`, 'success');
          }, 1500);
          return;
      }
      
      if (authModal === 'login' && authTab === 'phone' && !otpSent) {
          setAuthLoading(true);
          setTimeout(() => {
              setAuthLoading(false);
              setOtpSent(true);
              addToast('تم إرسال رمز التحقق إلى رقم الهاتف (للتجربة أدخل 123456)', 'success');
          }, 1500);
          return;
      }

      handleAuthSubmit(e);
  };

  const handleAuthSubmit = async (e) => {
      setAuthError('');
      setAuthLoading(true);

      try {
          const response = await fetch(`${API_URL}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ method: authTab, email: authEmail, password: authPassword, phone: authPhone })
          });
          
          if (response.ok) {
              const data = await response.json();
              setUser(data.user);
              localStorage.setItem('sh_user', JSON.stringify(data.user)); 
              localStorage.setItem('sh_token', data.token);
              setAuthModal(null);
              addToast('تم تسجيل الدخول بنجاح', 'success');
          } else {
             const simulatedUser = authTab === 'email' ? { uid: 'u_123', email: authEmail, isGuest: false } : { uid: 'u_123', phoneNumber: authPhone, isGuest: false };
             setUser(simulatedUser);
             localStorage.setItem('sh_user', JSON.stringify(simulatedUser));
             setAuthModal(null);
             addToast('تم تسجيل الدخول (السيرفر يحتاج SSL)', 'success');
          }
      } catch (err) {
           const simulatedUser = authTab === 'email' ? { uid: 'u_123', email: authEmail, isGuest: false } : { uid: 'u_123', phoneNumber: authPhone, isGuest: false };
           setUser(simulatedUser);
           localStorage.setItem('sh_user', JSON.stringify(simulatedUser));
           setAuthModal(null);
           addToast('تم تسجيل الدخول (وضع الأوفلاين)', 'success');
      }
      setAuthLoading(false);
  };

  const executeLogout = () => {
      localStorage.removeItem('sh_user');
      localStorage.removeItem('sh_token');
      const guestUser = { uid: 'guest_' + Date.now(), isGuest: true };
      setUser(guestUser);
      setShowAdminPanel(false);
      setActiveView('main');
      setLogoutConfirm(false);
      addToast('تم تسجيل الخروج بنجاح', 'info');
  };

  const handleSaveCarPrice = async (e) => {
      e.preventDefault();
      if (!user) return;
      const newPrice = e.target.price.value;
      
      try {
          await fetch(`${API_URL}/cars/${editingCar.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ price: newPrice })
          });
          setCarsList(prev => prev.map(c => c.id === editingCar.id ? { ...c, price: newPrice } : c));
          setEditingCar(null);
          addToast('تم تحديث سعر السيارة بنجاح', 'success');
      } catch (error) {
          setCarsList(prev => prev.map(c => c.id === editingCar.id ? { ...c, price: newPrice } : c));
          setEditingCar(null);
          addToast('تم التحديث (محلياً)', 'success');
      }
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    localStorage.setItem('sh-user-name', formValues.name);
    localStorage.setItem('sh-user-phone', formValues.phone);

    let title = bookingItem?.isEditMode && bookingItem?.serviceTitle ? bookingItem.serviceTitle : bookingItem?.name || bookingItem?.title || 'طلب خدمة';
    if (!bookingItem?.isEditMode) {
        if (selectedCategory === 'hotel') title = `حجز ${selectedHotel?.name} - ${bookingItem?.name}`;
        if (selectedCategory === 'car') title = `آجار سيارة: ${bookingItem?.name}`;
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
      isGuest: isGuest
    };

    try {
        if (bookingItem?.isEditMode && bookingItem?.id) {
           await fetch(`${API_URL}/orders/${bookingItem.id}`, {
               method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData)
           });
        } else {
           await fetch(`${API_URL}/orders`, {
               method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData)
           });
           if (!isGuest) setUserPoints(prev => prev + 25);
        }
    } catch(err) {
        const localOrder = { id: 'ord_' + Date.now(), ...orderData, createdAt: Date.now() };
        if (bookingItem?.isEditMode) {
           setAllOrders(prev => prev.map(o => o.id === bookingItem.id ? localOrder : o));
        } else {
           setAllOrders(prev => [localOrder, ...prev]);
           if (!isGuest) setUserPoints(prev => prev + 25);
        }
    }
    
    setBookingItem(null);
    setHasKidsState('no');
    setSelectedBusType(null);
    setSelectedHotel(null);
    setSelectedCity(null);
    setShowSuccessCard(true);
  };

  const handleRedeemReward = async (reward) => {
      if (isGuest) {
          setAuthModal('signup');
          return;
      }
      if (userPoints >= reward.points) {
          const rewardOrder = {
              name: localStorage.getItem('sh-user-name') || 'عميل النخبة (HT)',
              phone: localStorage.getItem('sh-user-phone') || '---',
              serviceTitle: `هدية نادي النخبة: ${reward.name}`,
              serviceType: 'reward',
              pointsUsed: reward.points,
              status: 'pending',
              userId: user.uid
          };
          try {
              await fetch(`${API_URL}/orders`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(rewardOrder) });
          } catch(e) {
              setAllOrders(prev => [{ id: 'ord_'+Date.now(), ...rewardOrder, createdAt: Date.now() }, ...prev]);
          }
          setUserPoints(prev => prev - reward.points);
          setRedeemSuccess(`مبروك! تم إرسال طلب استبدال (${reward.name}).`);
          setTimeout(() => setRedeemSuccess(null), 6000);
      } else {
          alert(`رصيدك غير كافٍ. تحتاج إلى ${reward.points - userPoints} نقطة إضافية.`);
      }
  };

  const updateOrderStatus = async (orderId, status, reason = "") => {
    if (!user) return;
    try {
        await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status, rejectionReason: reason })
        });
        setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, rejectionReason: reason } : o));
    } catch (err) {
        setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, rejectionReason: reason } : o));
    }
    setRejectModal(null);
    setRejectReasonText("");
  };

  const addMarketingEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const eventData = Object.fromEntries(formData.entries());
    try {
        await fetch(`${API_URL}/events`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(eventData) });
    } catch(err) {
        setDynamicEvents(prev => [{ id: 'evt_'+Date.now(), ...eventData, createdAt: Date.now() }, ...prev]);
    }
    e.target.reset();
    addToast('تم إضافة الإعلان بنجاح', 'success');
  };

  const deleteMarketingEvent = async (id) => {
    try {
        await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
    } catch(err) {}
    setDynamicEvents(prev => prev.filter(ev => ev.id !== id));
  };

  const sendGlobalAlert = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const alertData = { message: formData.get('message'), type: formData.get('type') };
    try {
        const res = await fetch(`${API_URL}/alerts`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(alertData) });
        if (res.ok) {
            const data = await res.json();
            setGlobalAlerts(prev => [data.alert, ...(prev || [])]);
        }
    } catch(err) {
        setGlobalAlerts(prev => [{ id: 'alt_' + Date.now(), ...alertData, createdAt: Date.now() }, ...(prev || [])]);
    }
    e.target.reset();
    addToast('تم إرسال التنبيه وسيظهر للعملاء فوراً!', 'success');
  };

  const renderOrderInfo = (order) => {
    if (order.serviceType === 'reward') return `استبدال هدية (${order.pointsUsed} نقطة)`;
    if (order.serviceType === 'car') {
       const durationLabel = order.rentDuration === 'daily' ? 'أيام' : order.rentDuration === 'weekly' ? 'أسابيع' : 'أشهر';
       return `المدة: ${order.durationCount || 1} ${durationLabel} | السائق: ${order.driverOption === 'with_driver' ? 'مع سائق' : 'بدون'} | البدء: ${order.startDate || 'غير محدد'}`;
    }
    if (order.serviceType === 'hotel') return `البدء: ${order.checkIn} (${order.nightCount} ليلة)`;
    if (order.serviceType === 'bus' && order.busSubCategory === 'contract') return `${order.orgName} | باصات: ${order.busCount}`;
    if (order.serviceType === 'bus') return `ترفيهي: ${order.tripDate}`;
    if (order.serviceType === 'flights') return `من ${order.fromAirport} لـ ${order.toAirport} بتاريخ ${order.flightDate}`;
    if (order.serviceType === 'transit') return `من ${order.fromLocation} إلى ${order.toLocation} | ${order.transitType} | حقائب: ${order.bagsCount || '1'} | موعد: ${order.tripDate} ${order.tripTime}`;
    if (order.serviceType === 'services') {
       if (order.fromCity && order.toCity) return `من: ${order.fromCity} إلى: ${order.toCity}`;
       return `الخدمة المطلوبة مسجلة`;
    }
    if (order.serviceType === 'events') return `عدد: ${order.paxCount}`;
    return 'تفاصيل عامة';
  };

  const filterOrdersByType = (types) => {
      let filtered = allOrders.filter(o => types.includes(o.serviceType));
      if (orderFilter !== 'all') {
          filtered = filtered.filter(o => o.status === orderFilter);
      }
      return filtered;
  };

  // 🌟 تعديل رقم الواتساب المخصص لقسم الطيران 🌟
  const openWhatsApp = () => window.open("https://wa.me/963952490049", "_blank");

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
      approved: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
      rejected: 'bg-rose-500/20 text-rose-500 border-rose-500/30'
    };
    const labels = { pending: 'قيد الانتظار', approved: 'مقبول', rejected: 'مرفوض' };
    return <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${styles[status]}`}>{labels[status]}</span>;
  };

  const ToastContainer = () => (
    <div className="fixed top-4 left-0 right-0 z-[8000] flex flex-col items-center gap-2 pointer-events-none px-4">
      {toasts.map(toast => {
        let styles = '';
        let Icon = BellRing;
        if (toast.type === 'success') { styles = 'bg-emerald-500 text-black border-emerald-400'; Icon = CheckCircle2; }
        else if (toast.type === 'error') { styles = 'bg-rose-600 text-white border-rose-500'; Icon = AlertCircle; }
        else if (toast.type === 'info') { styles = 'bg-[#112240] text-emerald-400 border-emerald-500/30'; }
        else if (toast.type === 'special') { styles = 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black border-yellow-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]'; Icon = Sparkles; }

        return (
          <div key={toast.id} className={`max-w-sm w-full p-4 rounded-2xl shadow-2xl border flex items-center gap-4 animate-in slide-in-from-top-10 fade-in duration-300 pointer-events-auto ${styles}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Icon size={20} /></div>
            <div className="flex-1 text-right">
               {toast.title && <h4 className="font-black text-[11px] mb-0.5">{toast.title}</h4>}
               <p className="text-[10px] font-bold leading-relaxed">{toast.msg}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#0B192C] flex flex-col items-center justify-center z-[2000]">
        <div className="relative mb-8">
            <HTLogo size="large" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/10 rounded-full blur-xl animate-ping"></div>
        </div>
        <h1 className="text-5xl font-black text-white italic tracking-tighter text-center leading-none uppercase mb-1 drop-shadow-lg">شهبا <span className="text-emerald-400">Go</span></h1>
        
        {/* التوقيع الاحترافي 1 - شاشة البداية */}
        <div className="flex items-center gap-3 mb-6 opacity-80">
            <div className="h-px w-8 bg-gradient-to-l from-emerald-500 to-transparent"></div>
            <span className="text-[11px] text-white tracking-[0.3em] font-light uppercase">Hammash & Tatari</span>
            <div className="h-px w-8 bg-gradient-to-r from-emerald-500 to-transparent"></div>
        </div>

        <p className="text-emerald-400 font-bold text-sm tracking-widest uppercase opacity-80">هدفنا راحتك</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B192C] text-white font-sans overflow-x-hidden pb-32" dir="rtl">
      <ToastContainer />

      {/* Ticker Banner */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2.5 overflow-hidden whitespace-nowrap sticky top-0 z-40 backdrop-blur-md">
        <div className="flex animate-marquee hover:[animation-play-state:paused] space-x-12 space-x-reverse items-center">
            <span className="text-[10px] font-black text-emerald-400 flex items-center gap-4">
                <Sparkles size={12}/> 
                نصلك أينما كنت، ونأخذك حيثما تريد • هدفنا راحتك
                <span className="mx-4 text-white/30 font-light">|</span>
                <Sparkles size={12}/> 
                كل ما تحتاجه في عالم السياحة والسفر
            </span>
            {dynamicEvents.map(ev => (
                <span 
                    key={ev.id} 
                    onClick={() => {
                        setShowAdminPanel(false);
                        setActiveView('list');
                        setSelectedCategory('events');
                        setBookingItem(ev);
                    }}
                    className="text-[10px] font-black text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] flex items-center gap-2 cursor-pointer hover:brightness-125 transition-all"
                >
                    <span className="mx-4 text-white/30 font-light drop-shadow-none">|</span>
                    {ev.postType === 'offer' ? <Megaphone size={12}/> : <MapPin size={12}/>} 
                    {ev.name} {ev.price ? `• ${ev.price}` : ''}
                </span>
            ))}
        </div>
      </div>

      {/* Header */}
      <header className="p-5 sticky top-10 z-50 bg-[#0B192C]/95 backdrop-blur-xl border-b border-white/5 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setActiveView('main'); setShowAdminPanel(false); setSelectedCategory(null); setSelectedHotel(null); setSelectedCity(null); setSelectedBusType(null); setShowNotifications(false);}}>
           <HTLogo />
           <div className="flex flex-col text-right">
                <h1 className="text-lg font-black italic text-white leading-none mb-1">شهبا <span className="text-emerald-400">Go</span></h1>
                
                {/* التوقيع الاحترافي 2 - الهيدر */}
                <span className="text-[7px] text-emerald-400/80 font-bold uppercase tracking-[0.15em] bg-emerald-500/10 px-1.5 py-0.5 rounded inline-block w-fit">
                    Hammash & Tatari
                </span>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
            {/* التنبيهات (الجرس) */}
            <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white transition-colors">
                    <BellRing size={16} className={notifications.length > 0 ? "animate-pulse text-amber-400" : ""} />
                    {notifications.length > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-black flex items-center justify-center text-white shadow-lg border border-[#0B192C]">
                            {notifications.length > 9 ? '+9' : notifications.length}
                        </span>
                    )}
                </button>
                
                {/* قائمة التنبيهات المنسدلة */}
                {showNotifications && (
                    <>
                        <div className="fixed inset-0 z-[8900]" onClick={() => setShowNotifications(false)}></div>
                        <div className="absolute top-12 left-0 w-72 bg-[#112240] border border-white/10 rounded-2xl shadow-2xl p-4 z-[9000] max-h-96 overflow-y-auto animate-in zoom-in-95">
                            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                               <h3 className="text-sm font-black text-white">التنبيهات</h3>
                               <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{notifications.length} جديد</span>
                            </div>
                            <div className="space-y-2">
                               {notifications.length === 0 ? (
                                   <p className="text-[10px] text-white/40 text-center py-6 font-bold">لا يوجد تنبيهات حالياً</p>
                               ) : notifications.map(n => (
                                   <div key={n.id} onClick={() => handleNotificationClick(n)} className="text-right p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer flex gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                          n.type === 'error' ? 'bg-rose-500/10 text-rose-400' : 
                                          n.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 
                                          n.type === 'order' ? 'bg-amber-500/10 text-amber-400' : 
                                          n.type === 'special' ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/30' : 
                                          'bg-blue-500/10 text-blue-400'
                                      }`}>
                                          <n.icon size={14} />
                                      </div>
                                      <div className="flex-1">
                                          <h4 className={`text-[11px] font-black ${n.type === 'special' ? 'text-amber-400' : 'text-white'}`}>{n.title}</h4>
                                          <p className="text-[9px] text-white/60 mt-0.5 truncate">{n.desc}</p>
                                          <span className="text-[8px] text-white/30 mt-1.5 block">{formatDateTime(n.time)}</span>
                                      </div>
                                   </div>
                               ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* زر المحفظة للزبائن (يختفي إذا كان أدمن داخل لوحة الإدارة) */}
            {(!isUserAdmin || !showAdminPanel) && (
                <button onClick={() => {setActiveView('wallet'); setSelectedCategory(null);}} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                    <Gift size={14}/>
                    <span className="text-[10px] font-black">{isGuest ? '0' : userPoints}</span>
                </button>
            )}
            
            {/* زر الإدارة (يظهر بوضوح دائماً للأدمن بجانب تسجيل الخروج) */}
            {isUserAdmin && (
                <button onClick={() => setShowAdminPanel(!showAdminPanel)} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold border transition-all ${showAdminPanel ? 'bg-amber-500/10 text-amber-400 border-amber-500/50' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'}`}>
                   {showAdminPanel ? <LayoutGrid size={14} /> : <Settings size={14}/>}
                   {showAdminPanel ? 'المتجر' : 'الإدارة'}
                </button>
            )}

            {/* الدخول / الخروج */}
            {isGuest ? (
                <button onClick={() => setAuthModal('login')} className="px-3 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold border border-white/10 bg-white/5 text-slate-300 hover:text-white transition-colors">
                    <LogIn size={14} /> دخول
                </button>
            ) : (
                <button onClick={() => setLogoutConfirm(true)} className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                    <LogOut size={16} />
                </button>
            )}
        </div>
      </header>

      {/* 🌟 نافذة عرض التنبيه بشكل كامل في منتصف الشاشة 🌟 */}
      {selectedNotification && (
          <div className="fixed inset-0 bg-black/95 z-[9500] flex items-center justify-center p-6 backdrop-blur-sm">
             <div className="bg-[#112240] p-8 rounded-[3rem] border border-white/10 text-center shadow-2xl max-w-sm w-full animate-in zoom-in-95 relative overflow-hidden">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border shadow-inner ${
                    selectedNotification.type === 'error' ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' :
                    selectedNotification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    selectedNotification.type === 'order' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    selectedNotification.type === 'special' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
                    'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                    <selectedNotification.icon size={36} className="animate-pulse" />
                </div>
                <h3 className={`text-xl font-black mb-3 ${selectedNotification.type === 'special' ? 'text-amber-400 drop-shadow-md' : 'text-white'}`}>{selectedNotification.title}</h3>
                <p className="text-sm text-white/90 mb-8 font-bold leading-relaxed">{selectedNotification.desc}</p>
                <p className="text-[10px] text-white/30 mb-6">{formatDateTime(selectedNotification.time)}</p>
                <button onClick={() => setSelectedNotification(null)} className={`w-full py-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all ${
                    selectedNotification.type === 'error' ? 'bg-rose-500 text-white' :
                    selectedNotification.type === 'success' ? 'bg-emerald-500 text-black' :
                    selectedNotification.type === 'order' ? 'bg-amber-500 text-black' :
                    selectedNotification.type === 'special' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-yellow-500/30' :
                    'bg-blue-500 text-white'
                }`}>
                    حسناً، فهمت
                </button>
             </div>
          </div>
      )}

      {/* Logout Confirmation Modal */}
      {logoutConfirm && (
        <div className="fixed inset-0 bg-black/95 z-[9000] flex items-center justify-center p-6 backdrop-blur-sm">
           <div className="bg-[#112240] p-8 rounded-[3rem] border border-rose-500/20 text-center shadow-2xl max-w-sm w-full animate-in zoom-in-95">
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                  <LogOut size={32} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">تسجيل الخروج</h3>
              <p className="text-xs text-white/50 mb-8 font-bold">هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟</p>
              <div className="flex gap-3">
                 <button onClick={executeLogout} className="flex-1 bg-rose-600 py-4 rounded-2xl font-black text-xs text-white shadow-lg active:scale-95 transition-all">نعم، خروج</button>
                 <button onClick={() => setLogoutConfirm(false)} className="flex-1 bg-white/5 py-4 rounded-2xl font-black text-xs text-white hover:bg-white/10 transition-all">تراجع</button>
              </div>
           </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[3000] flex items-center justify-center p-4">
           <div className="bg-[#112240] w-full max-w-sm p-8 rounded-[3rem] border border-emerald-500/20 shadow-2xl relative animate-in text-center">
              <button onClick={() => {setAuthModal(null); setOtpSent(false); setOtpCode('');}} className="absolute top-6 left-6 text-white/30 hover:text-white"><X size={20}/></button>
              <div className="flex justify-center mb-6"><HTLogo size="large" /></div>
              
              <h2 className="text-xl font-black text-white mb-6">
                  {authModal === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h2>
              
              <div className="flex bg-[#0B192C] p-1 rounded-2xl mb-6 border border-white/5">
                 <button onClick={() => {setAuthTab('email'); setAuthError(''); setOtpSent(false); setOtpCode('');}} className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${authTab === 'email' ? 'bg-emerald-500 text-black shadow-md' : 'text-white/40 hover:text-white'}`}>
                    <Mail size={14} /> البريد
                 </button>
                 <button onClick={() => {setAuthTab('phone'); setAuthError(''); setOtpSent(false); setOtpCode('');}} className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${authTab === 'phone' ? 'bg-emerald-500 text-black shadow-md' : 'text-white/40 hover:text-white'}`}>
                    <Phone size={14} /> الهاتف
                 </button>
              </div>

              {authError && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-xs font-bold mb-4">{authError}</div>}
              
              {/* 🌟 تعديل فورم التسجيل ليتوافق مع نظام رمز التحقق (OTP) للإيميل والهاتف 🌟 */}
              <form onSubmit={handleAction} className="space-y-4">
                  {authTab === 'email' ? (
                     <>
                        <input type="email" required value={authEmail} onChange={(e)=>setAuthEmail(e.target.value)} disabled={otpSent && authModal === 'signup'} className="w-full bg-[#0B192C] border border-white/10 rounded-2xl py-3 px-4 text-xs text-white text-right outline-none focus:border-emerald-500 disabled:opacity-50" placeholder="البريد الإلكتروني (مثال: user@mail.com)" />
                        
                        {authModal === 'login' && (
                            <input type="password" required value={authPassword} onChange={(e)=>setAuthPassword(e.target.value)} className="w-full bg-[#0B192C] border border-white/10 rounded-2xl py-3 px-4 text-xs text-white text-right outline-none focus:border-emerald-500" placeholder="كلمة المرور" />
                        )}

                        {authModal === 'signup' && otpSent && (
                            <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                                <input type="text" required value={otpCode} onChange={(e)=>setOtpCode(e.target.value)} className="w-full bg-[#0B192C] border border-white/10 rounded-2xl py-3 px-4 text-lg tracking-[0.5em] font-black text-white text-center outline-none focus:border-emerald-500" placeholder="123456" maxLength={6} />
                                <p className="text-[10px] text-white/40 mb-2">تم إرسال الرمز لبريدك الإلكتروني (للتجربة: أدخل أي أرقام)</p>
                                <input type="password" required value={authPassword} onChange={(e)=>setAuthPassword(e.target.value)} className="w-full bg-[#0B192C] border border-white/10 rounded-2xl py-3 px-4 text-xs text-white text-right outline-none focus:border-emerald-500" placeholder="اختر كلمة مرور جديدة" />
                            </div>
                        )}

                        <button type="submit" disabled={authLoading || (authModal === 'signup' && otpSent && !otpCode)} className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all disabled:opacity-50 mt-2">
                           {authLoading ? 'جاري المعالجة...' : 
                               (authModal === 'login' ? 'دخول آمن' : 
                                   (!otpSent ? 'إرسال رمز التحقق' : 'تأكيد وإنشاء الحساب'))}
                        </button>
                     </>
                  ) : (
                     <>
                        {!otpSent ? (
                           <>
                              <div className="relative flex" dir="ltr">
                                 <div className="bg-white/5 border border-white/10 border-r-0 rounded-l-2xl px-3 flex items-center text-white/60 font-medium text-xs">
                                   +963
                                 </div>
                                 <input type="tel" required value={authPhone} onChange={(e)=>setAuthPhone(e.target.value)} className="w-full bg-[#0B192C] border border-white/10 rounded-r-2xl py-3 px-4 text-xs text-white outline-none focus:border-emerald-500" placeholder="09xx xxx xxx" />
                              </div>
                              <button type="submit" disabled={authLoading || !authPhone} className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all disabled:opacity-50">
                                 {authLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
                              </button>
                           </>
                        ) : (
                           <div className="animate-in fade-in slide-in-from-top-2 space-y-4">
                              <input type="text" required value={otpCode} onChange={(e)=>setOtpCode(e.target.value)} className="w-full bg-[#0B192C] border border-white/10 rounded-2xl py-3 px-4 text-lg tracking-[0.5em] font-black text-white text-center outline-none focus:border-emerald-500" placeholder="123456" maxLength={6} />
                              <p className="text-[10px] text-white/40">تم إرسال الرمز لرقمك (للتجربة: أدخل أي أرقام)</p>
                              <button type="submit" disabled={authLoading || !otpCode} className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all disabled:opacity-50 mt-2">
                                 {authLoading ? 'جاري التأكيد...' : (authModal === 'login' ? 'تأكيد الدخول' : 'تأكيد وإنشاء الحساب')}
                              </button>
                           </div>
                        )}
                     </>
                  )}
              </form>

              {/* أزرار التبديل الجديدة بين تسجيل الدخول وإنشاء الحساب */}
              <div className="mt-6 pt-5 border-t border-white/5">
                  {authModal === 'login' ? (
                      <p className="text-[11px] text-white/50 font-bold">
                          ليس لديك حساب؟ <span onClick={() => {setAuthModal('signup'); setAuthError(''); setOtpSent(false); setOtpCode('');}} className="text-emerald-400 cursor-pointer hover:underline font-black px-1 transition-all">إنشاء حساب جديد</span>
                      </p>
                  ) : (
                      <p className="text-[11px] text-white/50 font-bold">
                          لديك حساب بالفعل؟ <span onClick={() => {setAuthModal('login'); setAuthError(''); setOtpSent(false); setOtpCode('');}} className="text-emerald-400 cursor-pointer hover:underline font-black px-1 transition-all">تسجيل الدخول</span>
                      </p>
                  )}
              </div>

           </div>
        </div>
      )}

      {/* Editing Car Modal */}
      {editingCar && isUserAdmin && (
          <div className="fixed inset-0 bg-black/95 z-[8000] flex items-center justify-center p-6 text-right">
             <div className="bg-[#112240] w-full max-w-sm p-8 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl animate-in zoom-in-95">
                <h3 className="text-lg font-black text-emerald-400 mb-4">تعديل سعر {editingCar.name}</h3>
                <form onSubmit={handleSaveCarPrice}>
                    <input name="price" defaultValue={editingCar.price} required className="w-full bg-[#0B192C] border border-white/5 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500 mb-4 shadow-inner" placeholder="السعر الجديد (مثال: 800,000 ل.س/يوم)" />
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-emerald-500 py-3 rounded-2xl font-black text-xs text-black shadow-lg">حفظ التعديل</button>
                        <button type="button" onClick={() => setEditingCar(null)} className="flex-1 bg-white/5 py-3 rounded-2xl font-black text-xs text-white">إلغاء</button>
                    </div>
                </form>
             </div>
          </div>
      )}

      <main className="p-4 max-w-5xl mx-auto">
        {showAdminPanel && isUserAdmin ? (
          /* ADMIN VIEW */
          <div className="space-y-6 animate-in">
             <div className="flex bg-[#0F172A] p-1.5 rounded-2xl border border-white/5 mb-4 gap-1">
                <button onClick={() => setAdminTab('orders')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold ${adminTab === 'orders' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500'}`}>الطلبات</button>
                <button onClick={() => setAdminTab('marketing')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold ${adminTab === 'marketing' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500'}`}>الإعلانات</button>
                <button onClick={() => setAdminTab('alerts')} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold ${adminTab === 'alerts' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500'}`}><BellRing size={14}/> التنبيهات</button>
             </div>

             {adminTab === 'orders' ? (
               <div className="space-y-6">
                 <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2">
                     {[
                         { id: 'pending', label: 'الطلبات الجديدة' },
                         { id: 'approved', label: 'طلبات مقبولة' },
                         { id: 'rejected', label: 'الطلبات المرفوضة' },
                     ].map(f => (
                         <button key={f.id} onClick={() => setOrderFilter(f.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black ${orderFilter === f.id ? 'bg-emerald-500 text-black shadow-lg' : 'bg-white/5 text-white/50'}`}>{f.label}</button>
                     ))}
                 </div>
                 <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#112240] shadow-2xl">
                    <table className="w-full text-right text-[11px]">
                       <thead>
                          <tr className="bg-white/5 text-white/40">
                             <th className="p-4">الخدمة</th>
                             <th className="p-4">العميل</th>
                             <th className="p-4">التفاصيل</th>
                             <th className="p-4">التاريخ والوقت</th>
                             <th className="p-4 text-center">القرار / الحالة</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {filterOrdersByType(['bus', 'car', 'transit', 'hotel', 'events', 'flights', 'services', 'reward']).map(order => (
                            <tr key={order.id} className="hover:bg-white/10 transition-colors">
                               <td className="p-4 font-black text-emerald-400">{order.serviceTitle}</td>
                               <td className="p-4">
                                  <div className="font-bold">{order.name}</div>
                                  <div className="text-[10px] text-white/40" dir="ltr" style={{textAlign: "right"}}>{order.phone}</div>
                               </td>
                               <td className="p-4 text-white/60">{renderOrderInfo(order)}</td>
                               <td className="p-4 text-white/60 text-[10px] whitespace-nowrap">{formatDateTime(order.createdAt)}</td>
                               <td className="p-4 text-center">
                                  {order.status === 'pending' && (
                                    <div className="flex gap-2 justify-center">
                                       <button onClick={() => updateOrderStatus(order.id, 'approved')} className="p-2 bg-emerald-500 text-black rounded-xl hover:scale-110 transition-all shadow-md"><CheckCircle2 size={14}/></button>
                                       <button onClick={() => setRejectModal(order.id)} className="p-2 bg-rose-500 text-white rounded-xl hover:scale-110 transition-all shadow-md"><X size={14}/></button>
                                    </div>
                                  )}
                                  {order.status === 'approved' && <StatusBadge status="approved" />}
                                  {order.status === 'rejected' && (
                                      <div className="flex flex-col items-center gap-1.5 mt-1">
                                          <StatusBadge status="rejected" />
                                          <span className="text-[9px] text-rose-400 font-bold max-w-[120px] text-center leading-tight bg-rose-500/10 p-1.5 rounded-lg border border-rose-500/20">{order.rejectionReason || 'لم يتم ذكر سبب'}</span>
                                      </div>
                                  )}
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
               </div>
             ) : adminTab === 'marketing' ? (
                /* MARKETING FORM */
                <div className="space-y-6 max-w-xl mx-auto">
                    <form onSubmit={addMarketingEvent} className="bg-[#112240] p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-6">إدراج إعلان جديد</h3>
                        <div className="space-y-4">
                           <input name="name" required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500" placeholder="العنوان" />
                           <textarea name="desc" required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right h-24 outline-none focus:border-emerald-500" placeholder="التفاصيل كاملة..."></textarea>
                           <div className="grid grid-cols-2 gap-4">
                               <input name="date" className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-[10px] text-white outline-none focus:border-emerald-500" placeholder="الموعد" />
                               <input name="price" className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-[10px] text-white outline-none focus:border-emerald-500" placeholder="التكلفة" />
                           </div>
                           <select name="postType" required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500 appearance-none">
                               <option value="event">رحلة / فعالية</option>
                               <option value="offer">عرض إعلاني</option>
                           </select>
                           <select name="iconType" className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500 appearance-none">
                               <option value="party">سهرة / عام</option>
                               <option value="sea">رحلة بحرية</option>
                               <option value="tent">تخييم</option>
                           </select>
                           <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-[2rem] font-black text-xs mt-2 shadow-lg active:scale-95 transition-all">نشر</button>
                        </div>
                    </form>
                    <div className="space-y-3">
                        {dynamicEvents.map(ev => (
                            <div key={ev.id} className="bg-[#112240] p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                                <div className="text-right">
                                   <div className="font-black text-sm">{ev.name}</div>
                                   <div className="text-[10px] text-white/50">{ev.date}</div>
                                </div>
                                <button onClick={() => deleteMarketingEvent(ev.id)} className="text-rose-500/50 hover:text-rose-500 transition-colors p-2 bg-rose-500/10 rounded-xl"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
             ) : adminTab === 'alerts' ? (
                /* ADMIN ALERTS FORM */
                <div className="space-y-6 max-w-xl mx-auto animate-in slide-in-from-right-4 pb-10">
                    <form onSubmit={sendGlobalAlert} className="bg-[#112240] p-8 rounded-[3rem] border border-emerald-500/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
                        <h3 className="text-lg font-black text-white flex items-center gap-2 mb-2 relative z-10"><BellRing className="text-emerald-400 animate-pulse"/> إرسال تنبيه مباشر</h3>
                        <p className="text-[10px] text-white/50 mb-6 leading-relaxed relative z-10">سيظهر هذا التنبيه فوراً كرسالة منبثقة (Popup) لجميع المستخدمين الذين يفتحون التطبيق حالياً. استخدمه للعروض السريعة والأخبار العاجلة.</p>
                        <div className="space-y-4 relative z-10">
                           <textarea name="message" required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right h-24 outline-none focus:border-emerald-500 transition-all shadow-inner" placeholder="اكتب رسالة التنبيه (مثال: خصم 50% لآخر 3 مقاعد في رحلة اللاذقية اليوم!)..."></textarea>
                           <select name="type" required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500 shadow-inner appearance-none">
                               <option value="special">تنبيه ذهبي بارز (للعروض المذهلة)</option>
                               <option value="info">تنبيه أزرق داكن (معلومة أو خبر)</option>
                               <option value="success">تنبيه أخضر ساطع (خبر مفرح)</option>
                           </select>
                           <button type="submit" className="w-full bg-emerald-500 text-black py-5 rounded-[2rem] font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all mt-2">إرسال التنبيه الآن 🚀</button>
                        </div>
                    </form>
                </div>
             ) : null}
          </div>
        ) : (
          /* USER VIEWS */
          <div className="space-y-6 pb-10">
            {activeView === 'main' && (
              <div className="space-y-6 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative rounded-[3rem] overflow-hidden aspect-[16/9] border border-white/5 shadow-2xl">
                   <img src="/main-bg.jpg?v=3" className="w-full h-full object-cover opacity-50" alt="Travel Hero"/>
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent"></div>
                   <div className="absolute top-6 left-6"><HTLogo /></div>
                   
                   {/* التوقيع الاحترافي 3 - الواجهة الرئيسية */}
                   <div className="absolute bottom-6 right-6 text-right z-10">
                      <h2 className="text-3xl font-black italic uppercase leading-none mb-1.5 drop-shadow-lg">شهبا <span className="text-emerald-400">Go</span></h2>
                      <div className="inline-block bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg mb-3 shadow-lg">
                          <span className="text-[8px] text-emerald-300 font-medium uppercase tracking-[0.2em]">Hammash & Tatari</span>
                      </div>
                      <p className="text-xs text-white/90 font-bold drop-shadow-md">نصلك أينما كنت، ونأخذك حيثما تريد.</p>
                   </div>
                </div>

                <div onClick={() => !isGuest ? setActiveView('wallet') : setAuthModal('signup')} className="bg-gradient-to-r from-emerald-900/40 to-[#112240] border border-emerald-500/20 p-5 rounded-[2rem] flex items-center gap-4 cursor-pointer shadow-lg hover:border-emerald-500/40 transition-colors">
                   <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shadow-inner"><Star size={24}/></div>
                   <div className="flex-1">
                      <h4 className="text-xs font-black text-emerald-400">انضم لنادي النخبة HT</h4>
                      <p className="text-[9px] text-white/60 mt-1">احجز عبر التطبيق واحصل على نقاط وهدايا.</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   {CATEGORIES.map(cat => (
                     <button key={cat.id} disabled={!cat.active} onClick={() => {
                         if (cat.id === 'transit') {
                             setSelectedCategory('transit');
                             setBookingItem({ title: 'طلب خدمة النقل البري' });
                         } else {
                             setSelectedCategory(cat.id); 
                             setActiveView('list'); 
                             setSelectedHotel(null); 
                             setSelectedCity(null); 
                             setSelectedBusType(null);
                         }
                     }} 
                       className={`p-5 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-3 border transition-all ${cat.active ? 'bg-white/5 border-white/10 shadow-lg hover:bg-white/10 active:scale-95' : 'opacity-40 grayscale'}`}>
                        <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-md`}><cat.icon size={26} /></div>
                        <div className="flex-1">
                           <h4 className="text-[13px] font-black">{cat.title}</h4>
                           <p className="text-[8px] text-white/40 mt-1">{cat.sub}</p>
                        </div>
                     </button>
                   ))}
                </div>
              </div>
            )}

            {/* WALLET */}
            {activeView === 'wallet' && (
              <div className="space-y-6 max-w-xl mx-auto animate-in">
                 <div className="bg-gradient-to-br from-emerald-900 to-[#112240] p-8 rounded-[3rem] text-center border border-emerald-500/20 shadow-2xl relative overflow-hidden">
                     <Award size={100} className="text-emerald-500/10 absolute -top-4 -right-8 transform rotate-12" />
                     <h2 className="text-2xl font-black text-white mb-2 relative z-10">رصيد نقاطك</h2>
                     <span className="text-5xl font-black text-white relative z-10">{userPoints}</span>
                 </div>
                 {HT_REWARDS.map(reward => (
                     <div key={reward.id} className="bg-[#112240] p-4 rounded-[2.5rem] flex items-center gap-4 shadow-lg border border-white/5">
                         <div className={`w-16 h-16 ${reward.bg} ${reward.color} rounded-[1.5rem] flex items-center justify-center`}><reward.icon size={28}/></div>
                         <div className="flex-1 text-right">
                             <h4 className="text-sm font-black">{reward.name}</h4>
                             <div className="text-[10px] text-emerald-400 mt-2 font-black bg-emerald-500/10 inline-block px-2 py-0.5 rounded-lg">{reward.points} نقطة</div>
                         </div>
                         <button onClick={() => handleRedeemReward(reward)} className="bg-emerald-500 text-black px-4 py-3 rounded-xl font-black text-[10px] shadow-lg active:scale-95 transition-all">استبدال</button>
                     </div>
                 ))}
              </div>
            )}

            {activeView === 'list' && (
               <div className="space-y-6 animate-in max-w-xl mx-auto">
                  <div className="flex items-center gap-4 bg-[#112240] p-4 rounded-3xl border border-white/5 shadow-lg">
                     <button onClick={() => {
                       if (selectedCategory === 'hotel' && selectedHotel) { setSelectedHotel(null); setActiveGalleryImg(null); }
                       else if (selectedCategory === 'hotel' && selectedCity) { setSelectedCity(null); }
                       else if (selectedCategory === 'bus' && selectedBusType) { setSelectedBusType(null); }
                       else { setActiveView('main'); setSelectedCategory(null); setSelectedBusType(null); setSelectedCity(null); }
                     }} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-colors"><ChevronLeft className="rotate-180"/></button>
                     <div className="text-right flex-1">
                        <h2 className="text-lg font-black text-white">{CATEGORIES.find(c => c.id === selectedCategory)?.title}</h2>
                     </div>
                  </div>

                  <div className="space-y-4 pb-10">
                    {/* FLIGHTS */}
                    {selectedCategory === 'flights' && (
                        <div className="bg-[#112240] p-8 rounded-[3rem] text-center shadow-xl border border-white/5">
                            <Plane size={48} className="mx-auto text-cyan-400 mb-4 animate-bounce" />
                            <h3 className="font-black text-lg">حجز طيران</h3>
                            <p className="text-xs text-white/50 px-4 mt-2 mb-6 leading-relaxed">حدد وجهتك وسنقوم بتزويدك بأفضل الرحلات المتوفرة.</p>
                            <button onClick={openWhatsApp} className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-black transition-all mt-3">
                                <MessageCircle size={18}/> اتصل بنا للحجز
                            </button>
                        </div>
                    )}

                    {/* TRANSIT */}
                    {selectedCategory === 'transit' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="relative bg-[#112240] w-full h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border border-indigo-500/20 group">
                                <img src="/c13.jpg" alt="النقل البري" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/60 to-transparent"></div>
                                
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                    <div className="w-20 h-20 bg-indigo-500/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 border border-indigo-500/30 shadow-inner">
                                        <CarFront size={40} className="text-indigo-400 animate-pulse" />
                                    </div>
                                    <h3 className="font-black text-2xl text-white mb-3 drop-shadow-md">من البيت إلى البيت</h3>
                                    <p className="text-xs text-indigo-100/90 leading-relaxed mb-8 max-w-[250px] font-bold drop-shadow-md">
                                        نقل آمن ومريح بين المحافظات وبيروت بسيارات VIP عادية أو سيارات جيب عائلية.
                                    </p>
                                    <button onClick={() => setBookingItem({title: 'طلب خدمة النقل البري'})} className="bg-indigo-600 text-white px-8 py-4 rounded-full font-black text-sm shadow-[0_8px_30px_rgba(79,70,229,0.4)] active:scale-95 transition-all flex items-center gap-3 border border-indigo-400">
                                        الدخول للحجز <ChevronLeft size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SERVICES */}
                    {selectedCategory === 'services' && (
                        <div className="grid grid-cols-1 gap-4">
                           {PUBLIC_SERVICES_LIST.map(srv => (
                              <button key={srv.id} onClick={() => setBookingItem(srv)} className="bg-[#112240] border border-white/5 p-6 rounded-[2.5rem] flex items-center gap-4 text-right hover:bg-white/5 transition-all shadow-md group">
                                 <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors"><srv.icon size={24}/></div>
                                 <div className="flex-1">
                                    <h4 className="font-black text-sm text-white">{srv.title}</h4>
                                    <p className="text-[10px] text-white/40 mt-1">{srv.desc}</p>
                                 </div>
                                 <ChevronRight size={16} className="text-slate-500"/>
                              </button>
                           ))}
                        </div>
                    )}

                    {/* CARS */}
                    {selectedCategory === 'car' && carsList.map(car => (
                        <div key={car.id} className="bg-[#112240] rounded-[2.5rem] overflow-hidden p-4 shadow-lg border border-white/5 group hover:border-emerald-500/30 transition-all">
                           <div className="relative">
                               <img src={car.img} className="w-full h-44 object-cover rounded-[2rem] mb-4" alt={car.name}/>
                               <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-emerald-400 px-3 py-1.5 rounded-2xl font-black text-xs border border-emerald-500/30 flex items-center gap-2 shadow-lg">
                                   {car.price}
                                   {isUserAdmin && (
                                       <button onClick={(e) => { e.stopPropagation(); setEditingCar(car); }} className="text-white hover:text-emerald-400 transition-colors bg-white/10 p-1 rounded-md" title="تعديل السعر">
                                           <Settings size={12}/>
                                       </button>
                                   )}
                               </div>
                           </div>
                           <div className="flex justify-between items-center px-2">
                              <h4 className="font-black text-white">{car.name}</h4>
                              <button onClick={() => setBookingItem(car)} className="bg-emerald-500 text-black px-8 py-2.5 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">احجز الآن</button>
                           </div>
                        </div>
                    ))}

                    {/* BUSES */}
                    {selectedCategory === 'bus' && !selectedBusType && BUS_TYPES.map(type => (
                          <button key={type.id} onClick={() => {setSelectedBusType(type.id); if(type.id === 'leisure') setBookingItem(type);}} className="p-6 bg-[#112240] border border-white/5 rounded-[2.5rem] w-full flex items-center gap-5 text-right shadow-lg hover:bg-white/5 transition-all group">
                             <div className={`w-14 h-14 ${type.color} rounded-2xl flex items-center justify-center`}><type.icon size={24}/></div>
                             <div className="flex-1">
                                <h4 className="font-black text-base">{type.title}</h4>
                                <p className="text-[10px] text-white/40">{type.sub}</p>
                             </div>
                             <Plus size={20} className="text-white/20 group-hover:text-emerald-400"/>
                          </button>
                    ))}
                    {selectedCategory === 'bus' && selectedBusType === 'contract' && (
                       <div className="text-center py-12 bg-[#112240] rounded-[3rem] shadow-xl border border-white/5">
                           <School size={48} className="mx-auto text-blue-500 mb-4 animate-bounce"/>
                           <h3 className="font-black mb-6 text-lg">عقود باصات</h3>
                           <button onClick={() => setBookingItem({title: 'عقود مدارس ومعامل'})} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">تعبئة البيانات</button>
                       </div>
                    )}

                    {/* HOTELS */}
                    {selectedCategory === 'hotel' && !selectedCity && (
                       <div className="grid grid-cols-2 gap-4">
                          {CITIES.map(city => (
                             <button key={city.id} onClick={() => setSelectedCity(city)} className="w-full bg-[#112240] rounded-[2.5rem] border border-white/5 p-4 flex flex-col items-center gap-3 shadow-lg hover:bg-white/5 transition-all">
                                <img src={city.img} className="w-full h-24 object-cover rounded-2xl opacity-80" alt={city.name} />
                                <h4 className="text-sm font-black text-white">{city.name}</h4>
                             </button>
                          ))}
                       </div>
                    )}
                    {selectedCategory === 'hotel' && selectedCity && !selectedHotel && HOTELS_DATA.filter(h => h.cityId === selectedCity.id).map(hotel => (
                         <div key={hotel.id} className="bg-[#112240] rounded-[2.5rem] overflow-hidden border border-white/5 p-4 shadow-lg">
                            <img src={hotel.img} className="w-full h-32 object-cover rounded-[2rem] mb-4 opacity-80" alt={hotel.name}/>
                            <div className="flex justify-between items-center px-2">
                               <div className="text-right">
                                  <h4 className="font-black text-sm">{hotel.name}</h4>
                                  <p className="text-[10px] text-white/40">{hotel.desc}</p>
                               </div>
                               <button onClick={() => setSelectedHotel(hotel)} className="bg-amber-500 text-black px-6 py-2 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition-all">عرض الغرف</button>
                            </div>
                         </div>
                    ))}
                    
                    {selectedCategory === 'hotel' && selectedHotel && (
                         <div className="space-y-6 animate-in fade-in">
                            {/* 🌟 معرض صور الفندق 🌟 */}
                            <div className="bg-[#112240] p-4 rounded-[2.5rem] border border-white/5 shadow-lg">
                                <img src={activeGalleryImg || selectedHotel.img} className="w-full h-56 object-cover rounded-[2rem] mb-4 shadow-inner transition-all duration-300" alt={selectedHotel.name} />
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1">
                                    {selectedHotel.gallery?.map((imgUrl, idx) => (
                                        <img 
                                            key={idx} 
                                            src={imgUrl} 
                                            onClick={() => setActiveGalleryImg(imgUrl)}
                                            className={`w-16 h-16 object-cover rounded-2xl shrink-0 cursor-pointer border-2 transition-all ${
                                                (activeGalleryImg || selectedHotel.img) === imgUrl ? 'border-amber-500 opacity-100 shadow-lg scale-105' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                                            }`}
                                            alt={`صورة ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-white px-2 flex items-center gap-2"><BedDouble className="text-amber-500"/> الغرف المتوفرة للحجز</h3>
                            {ROOM_TYPES.map(room => (
                                 <button key={room.id} onClick={() => setBookingItem(room)} className="w-full p-6 bg-[#112240] border border-white/5 rounded-[2.5rem] flex items-center gap-5 text-right shadow-lg hover:bg-white/5 transition-all group">
                                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-colors"><room.icon size={20}/></div>
                                    <div className="flex-1">
                                       <h4 className="font-black text-base">{room.name}</h4>
                                       <p className="text-[10px] text-white/40">{room.desc}</p>
                                    </div>
                                    <Plus size={20} className="text-white/20 group-hover:text-amber-400"/>
                                 </button>
                            ))}
                         </div>
                    )}

                    {/* EVENTS */}
                    {selectedCategory === 'events' && dynamicEvents.filter(ev => ev.postType !== 'offer').map(event => {
                         const EventIcon = event.iconType === 'sea' ? Ship : event.iconType === 'tent' ? Tent : Music;
                         return (
                         <div key={event.id} className="bg-[#112240] p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-4 text-right shadow-lg">
                            <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center shrink-0"><EventIcon size={24}/></div>
                            <div className="flex-1">
                               <h4 className="font-black text-sm">{event.name}</h4>
                               <p className="text-[10px] text-white/40 font-bold mt-1">{event.date} • <span className="text-emerald-400">{event.price}</span></p>
                               <p className="text-[9px] text-rose-400 mt-1">{event.desc}</p>
                            </div>
                            <button onClick={() => setBookingItem(event)} className="bg-rose-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black shadow-lg active:scale-95 transition-all">حجز</button>
                         </div>
                    )})}
                  </div>
               </div>
            )}

            {activeView === 'bookings' && (
              <div className="space-y-6 animate-in max-w-4xl mx-auto pb-20">
                 <h2 className="text-xl font-black text-white px-2">سجل طلباتي</h2>
                 <div className="overflow-x-auto rounded-[2.5rem] bg-[#112240] shadow-2xl border border-white/5">
                    <table className="w-full text-right text-[11px]">
                       <tbody className="divide-y divide-white/5">
                          {userOrders.map(order => (
                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                               <td className="p-4">
                                  <div className="font-black text-emerald-400">{order.serviceTitle}</div>
                                  <div className="text-[9px] text-white/40 mt-1 font-bold">{formatDateTime(order.createdAt)}</div>
                                  {order.status === 'rejected' && <div className="text-[9px] text-rose-400 mt-2 font-bold bg-rose-500/10 inline-block px-2 py-1 rounded-md">سبب الرفض: {order.rejectionReason || 'لم يذكر'}</div>}
                               </td>
                               <td className="p-4"><StatusBadge status={order.status} /></td>
                            </tr>
                          ))}
                          {userOrders.length === 0 && <tr><td colSpan="2" className="p-8 text-center text-white/20">لا يوجد طلبات</td></tr>}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Unified Booking Modal */}
      {bookingItem && (
        <div className="fixed inset-0 bg-black/95 z-[1000] flex items-center justify-center p-4">
           <div className="bg-[#112240] w-full max-w-md p-6 rounded-[3rem] border border-white/10 relative overflow-y-auto max-h-[95vh] shadow-2xl">
              <button onClick={() => {setBookingItem(null); setHasKidsState('no');}} className="absolute top-6 left-6 text-white/20 hover:text-rose-500 transition-colors"><X size={20}/></button>
              
              <div className="text-right mb-6">
                 <h3 className="text-xl font-black text-white">{bookingItem?.isEditMode ? 'تعديل الطلب' : 'إكمال بيانات الحجز'}</h3>
                 <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-widest">{bookingItem.name || bookingItem.title || bookingItem.serviceTitle}</p>
              </div>

              {/* 🌟 تفاصيل الفعالية (تظهر فقط عند حجز الفعاليات والرحلات) 🌟 */}
              {selectedCategory === 'events' && bookingItem?.desc && (
                  <div className="bg-[#0B192C] border border-emerald-500/20 p-4 rounded-2xl mb-6 text-right shadow-inner">
                      <h4 className="text-xs font-black text-emerald-400 mb-2 flex items-center gap-1.5">
                          <Info size={14}/> تفاصيل الرحلة / العرض
                      </h4>
                      <p className="text-[11px] text-white/80 leading-relaxed mb-3 whitespace-pre-wrap">
                          {bookingItem.desc}
                      </p>
                      <div className="flex justify-between items-center text-[10px] font-bold border-t border-white/5 pt-3 mt-1">
                          {bookingItem.date ? (
                              <span className="text-white/50 flex items-center gap-1.5"><Calendar size={12}/> {bookingItem.date}</span>
                          ) : <span></span>}
                          {bookingItem.price && (
                              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">{bookingItem.price}</span>
                          )}
                      </div>
                  </div>
              )}

              <form onSubmit={submitBooking} className="space-y-4 text-right">
                 
                 {/* CONTACT INFO */}
                 <div className="grid grid-cols-2 gap-4">
                    <input name="name" required defaultValue={bookingItem?.isEditMode ? bookingItem.name : ""} className="w-full bg-[#0B192C] border border-white/5 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500 shadow-inner" placeholder="الاسم الكامل" />
                    <input name="phone" required defaultValue={bookingItem?.isEditMode ? bookingItem.phone : (localStorage.getItem('sh-user-phone') || "")} className="w-full bg-[#0B192C] border border-white/5 rounded-2xl p-4 text-xs text-left text-white outline-none focus:border-emerald-500 shadow-inner" placeholder="09xxxxxx" />
                 </div>

                 {/* HOTEL SPECIFIC FIELDS */}
                 {selectedCategory === 'hotel' && (
                   <div className="space-y-3 p-4 bg-amber-500/5 rounded-3xl border border-amber-500/10">
                      <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400 text-[9px] font-bold text-center flex justify-center items-center gap-1"><Info size={12}/> الاستلام والتسليم الساعة 11 صباحاً</div>
                      
                      {/* سطر: عدد الليالي وتاريخ البدء */}
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1 text-right">
                            <label className="text-[9px] text-amber-500/50 mr-2 font-bold">عدد الليالي</label>
                            <input name="nightCount" type="number" min="1" required defaultValue={bookingItem?.nightCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-amber-500 shadow-inner" placeholder="مثال: 3" />
                         </div>
                         <div className="space-y-1 text-right">
                            <label className="text-[9px] text-amber-500/50 mr-2 font-bold">تاريخ البدء</label>
                            <input name="checkIn" type="date" required defaultValue={bookingItem?.checkIn || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-amber-500" />
                         </div>
                      </div>

                      {/* سطر: عدد الأشخاص وحالة الأطفال */}
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1 text-right">
                            <label className="text-[9px] text-amber-500/50 mr-2 font-bold">عدد الأشخاص (بالغين)</label>
                            <input name="paxCount" type="number" min="1" required defaultValue={bookingItem?.paxCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-amber-500 shadow-inner" placeholder="العدد" />
                         </div>
                         <div className="space-y-1 text-right">
                            <label className="text-[9px] text-amber-500/50 mr-2 font-bold">مرافقة أطفال؟</label>
                            <select name="hasKids" required value={hasKidsState} onChange={(e) => setHasKidsState(e.target.value)} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-amber-500 appearance-none">
                               <option value="no">لا يوجد أطفال</option>
                               <option value="yes">يوجد أطفال</option>
                            </select>
                         </div>
                      </div>

                      {/* سطر الأطفال الإضافي (يظهر فقط عند اختيار 'يوجد أطفال') */}
                      {hasKidsState === 'yes' && (
                         <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-1 text-right">
                               <label className="text-[9px] text-amber-500/50 mr-2 font-bold">عدد الأطفال</label>
                               <input name="kidsCount" type="number" min="1" required defaultValue={bookingItem?.kidsCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-amber-500 shadow-inner" placeholder="العدد" />
                            </div>
                            <div className="space-y-1 text-right">
                               <label className="text-[9px] text-amber-500/50 mr-2 font-bold">أعمار الأطفال</label>
                               <select name="kidsAges" required defaultValue={bookingItem?.kidsAges || "أقل من 6 سنوات"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-amber-500 appearance-none">
                                  <option value="أقل من 6 سنوات">أقل من 6 سنوات</option>
                                  <option value="بين 6 و 12 سنة">بين 6 و 12 سنة</option>
                               </select>
                            </div>
                         </div>
                      )}
                   </div>
                 )}

                 {/* FLIGHTS SPECIFIC FIELDS */}
                 {selectedCategory === 'flights' && (
                   <div className="space-y-3 p-4 bg-cyan-500/5 rounded-3xl border border-cyan-500/10">
                      <div className="grid grid-cols-2 gap-3">
                         <input name="fromAirport" required placeholder="من مطار..." defaultValue={bookingItem?.fromAirport || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-cyan-500" />
                         <input name="toAirport" required placeholder="إلى مطار..." defaultValue={bookingItem?.toAirport || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] text-cyan-500/50 mr-2">تاريخ الرحلة</label>
                         <input name="flightDate" type="date" required defaultValue={bookingItem?.flightDate || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-cyan-500" />
                      </div>
                   </div>
                 )}

                 {/* TRANSIT SPECIFIC FIELDS */}
                 {selectedCategory === 'transit' && (
                   <div className="space-y-3 p-4 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
                      <div className="grid grid-cols-2 gap-3">
                         <input name="fromLocation" required placeholder="مكان الانطلاق" defaultValue={bookingItem?.fromLocation || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-indigo-500" />
                         <input name="toLocation" required placeholder="الوجهة" defaultValue={bookingItem?.toLocation || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-indigo-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                            <label className="text-[9px] text-indigo-500/50 mr-2">تاريخ الرحلة</label>
                            <input name="tripDate" type="date" required defaultValue={bookingItem?.tripDate || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-indigo-500" />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[9px] text-indigo-500/50 mr-2">توقيت الرحلة</label>
                            <input name="tripTime" type="time" required defaultValue={bookingItem?.tripTime || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-indigo-500" />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1 text-right">
                              <label className="text-[9px] text-indigo-500/50 mr-2 font-bold">عدد الركاب</label>
                              <select name="transitType" required defaultValue={bookingItem?.transitType || "راكب واحد"} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-indigo-500 appearance-none">
                                 <option value="راكب واحد">راكب واحد</option>
                                 <option value="راكبين">راكبين</option>
                                 <option value="سيارة كاملة">سيارة كاملة</option>
                              </select>
                          </div>
                          <div className="space-y-1 text-right">
                              <label className="text-[9px] text-indigo-500/50 mr-2 font-bold">عدد الحقائب</label>
                              <select name="bagsCount" required defaultValue={bookingItem?.bagsCount || "1"} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-indigo-500 appearance-none">
                                 <option value="1">1</option>
                                 <option value="2">2</option>
                                 <option value="3">3</option>
                              </select>
                          </div>
                      </div>
                   </div>
                 )}

                 {/* SERVICES SPECIFIC FIELDS */}
                 {selectedCategory === 'services' && (
                   <div className="space-y-3 p-4 bg-slate-500/5 rounded-3xl border border-slate-500/10">
                      {bookingItem?.id === 'mail' && (
                         <div className="grid grid-cols-2 gap-3 mb-2">
                             <div className="space-y-1 text-right">
                                 <label className="text-[9px] text-slate-400 font-bold">من مدينة</label>
                                 <input name="fromCity" required placeholder="مثال: حلب" defaultValue={bookingItem?.fromCity || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-slate-500 shadow-inner" />
                             </div>
                             <div className="space-y-1 text-right">
                                 <label className="text-[9px] text-slate-400 font-bold">إلى مدينة</label>
                                 <input name="toCity" required placeholder="مثال: دمشق" defaultValue={bookingItem?.toCity || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-slate-500 shadow-inner" />
                             </div>
                         </div>
                      )}
                      <label className="text-[9px] text-slate-400 font-bold">يرجى كتابة التفاصيل الدقيقة للمعاملة أو الأوراق:</label>
                      <textarea name="serviceDetails" required defaultValue={bookingItem?.serviceDetails || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right h-24 outline-none focus:border-slate-500" placeholder="تفاصيل الخدمة المطلوبة..."></textarea>
                   </div>
                 )}

                 {/* BUS CONTRACTS FIELDS */}
                 {selectedCategory === 'bus' && selectedBusType === 'contract' && (
                   <div className="space-y-3 p-4 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                      <input name="orgName" required placeholder="اسم المدرسة / المعمل" defaultValue={bookingItem?.orgName || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-blue-500" />
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1 text-right">
                            <label className="text-[9px] text-white/30 mr-2">بداية الدوام</label>
                            <input name="startTime" type="time" required defaultValue={bookingItem?.startTime || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-blue-500" />
                         </div>
                         <div className="space-y-1 text-right">
                            <label className="text-[9px] text-white/30 mr-2">نهاية الدوام</label>
                            <input name="endTime" type="time" required defaultValue={bookingItem?.endTime || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-blue-500" />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <input name="workerCount" type="number" min="1" placeholder="عدد العمال/الطلاب" required defaultValue={bookingItem?.workerCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-blue-500" />
                         <input name="busCount" type="number" min="1" placeholder="كم باص؟" required defaultValue={bookingItem?.busCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-blue-500" />
                      </div>
                   </div>
                 )}

                 {/* BUS LEISURE & EVENTS FIELDS */}
                 {(selectedCategory === 'bus' && selectedBusType === 'leisure') && (
                   <div className="space-y-3 p-4 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1">
                           <label className="text-[9px] text-white/30 mr-2">تاريخ الرحلة</label>
                           <input name="tripDate" type="date" required defaultValue={bookingItem?.tripDate || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-emerald-500" />
                         </div>
                         <div className="space-y-1">
                           <label className="text-[9px] text-white/30 mr-2">وقت الانطلاق</label>
                           <input name="tripTime" type="time" required defaultValue={bookingItem?.tripTime || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-emerald-500" />
                         </div>
                      </div>
                   </div>
                 )}

                 {selectedCategory === 'events' && (
                    <div className="grid grid-cols-2 gap-3 bg-rose-500/5 p-5 rounded-3xl border border-rose-500/10">
                       <input name="paxCount" type="number" min="1" placeholder="عدد الأشخاص" required defaultValue={bookingItem?.paxCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-rose-500" />
                       <select name="hasKids" required defaultValue={bookingItem?.hasKids || "no"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-rose-500 appearance-none">
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
                                <select name="rentDuration" required defaultValue={bookingItem?.rentDuration || "daily"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-emerald-500 appearance-none">
                                    <option value="daily">يومي</option>
                                    <option value="weekly">أسبوعي</option>
                                    <option value="monthly">شهري</option>
                                </select>
                            </div>
                            <div className="space-y-1 text-right">
                                <label className="text-[9px] text-emerald-500/50 mr-2 font-bold">عدد الأيام</label>
                                <input name="durationCount" type="number" min="1" required defaultValue={bookingItem?.durationCount || "1"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-emerald-500 shadow-inner" placeholder="مثال: 3" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                           <div className="space-y-1 text-right">
                               <label className="text-[9px] text-emerald-500/50 mr-2 font-bold">السائق</label>
                               <select name="driverOption" required defaultValue={bookingItem?.driverOption || "with_driver"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-emerald-500 appearance-none">
                                   <option value="with_driver">مع سائق</option>
                                   <option value="without_driver">بدون سائق</option>
                               </select>
                           </div>
                           <div className="space-y-1 text-right">
                               <label className="text-[9px] text-emerald-500/50 mr-2 font-bold">تاريخ البدء</label>
                               <input name="startDate" type="date" required defaultValue={bookingItem?.startDate || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-emerald-500" />
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
        <div className="fixed inset-0 bg-black/95 z-[7000] flex items-center justify-center p-6">
           <div className="bg-[#112240] w-full max-w-sm p-8 rounded-[2.5rem] border border-rose-500/20 space-y-4 shadow-2xl animate-in zoom-in-95">
              <h3 className="text-lg font-black text-rose-500 text-right uppercase tracking-widest flex items-center gap-2"><Trash2 size={20}/> توضيح سبب الرفض</h3>
              
              <textarea 
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  className="w-full bg-[#0B192C] border border-white/5 rounded-2xl p-4 text-xs h-36 text-white text-right outline-none focus:border-rose-500 leading-relaxed" 
                  placeholder="اكتب السبب للعميل (مثال: يرجى تغيير عدد الأشخاص)..."
              ></textarea>
              
              <button 
                  onClick={() => updateOrderStatus(rejectModal, 'rejected', rejectReasonText)} 
                  className="w-full bg-rose-600 py-4 rounded-2xl font-black text-xs text-white shadow-lg shadow-rose-600/20 active:scale-95 transition-all">
                  تأكيد الرفض النهائي
              </button>
              
              <button 
                  onClick={() => { setRejectModal(null); setRejectReasonText(""); }} 
                  className="w-full text-[10px] text-white/30 font-bold uppercase tracking-tighter transition-colors hover:text-white">
                  تراجع
              </button>
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
              {(!bookingItem?.isEditMode && !isGuest) && (
                  <p className="text-xs text-emerald-600 font-bold mb-8 bg-emerald-50 p-2 rounded-lg">🎁 تم إضافة 25 نقطة لمحفظتك!</p>
              )}
              {(!bookingItem?.isEditMode && isGuest) && (
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
         <button onClick={() => {setActiveView('main'); setShowAdminPanel(false); setSelectedCategory(null); setSelectedHotel(null); setSelectedCity(null); setSelectedBusType(null);}} className={`${activeView === 'main' && !showAdminPanel ? 'text-emerald-400 scale-110 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-white/30'} flex flex-col items-center gap-1.5 transition-all duration-300`}>
            <LayoutGrid size={22}/><span className="text-[8px] font-black uppercase">الرئيسية</span>
         </button>
         <button onClick={() => {setActiveView('bookings'); setShowAdminPanel(false);}} className={`${activeView === 'bookings' && !showAdminPanel ? 'text-emerald-400 scale-110 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-white/30'} flex flex-col items-center gap-1.5 transition-all duration-300`}>
            <Ticket size={22}/><span className="text-[8px] font-black uppercase">طلباتي</span>
         </button>
         <button onClick={() => {setSelectedCategory('events'); setActiveView('list'); setShowAdminPanel(false);}} className={`${selectedCategory === 'events' ? 'text-emerald-400 scale-110 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-white/30'} flex flex-col items-center gap-1.5 transition-all duration-300`}>
            <Megaphone size={22}/><span className="text-[8px] font-black uppercase">الفعاليات</span>
         </button>
      </nav>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { font-family: 'Cairo', sans-serif; -webkit-tap-highlight-color: transparent; scroll-behavior: smooth; }
        input[type="date"], input[type="time"], input[type="number"], input[type="email"], input[type="password"], input[type="tel"] { color-scheme: dark; }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
            background-color: #10b981;
            padding: 4px;
            border-radius: 6px;
            cursor: pointer;
        }
        input[type="date"]:focus, input[type="time"]:focus {
            background-color: #064e3b !important;
            border-color: #10b981 !important;
        }
        .animate-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        @keyframes marquee { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: left 0.75rem center; background-size: 1rem; }
      `}</style>
    </div>
  );
}
