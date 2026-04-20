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
  Wallet, Store, Languages, FileCheck, Truck, MessageCircle, ChevronRight, AlertCircle, Info, CheckCircle2, LogIn, Filter, Gift, Award, Coffee, Shirt, Smile, LogOut, Mail, Lock, Download, Share, MoreVertical, BellRing, Phone, QrCode, Printer, Wifi, Utensils, BarChart3
} from 'lucide-react';

// ==========================================
// 🚀 تم الربط مع الدومين الرسمي المحمي بـ SSL 🚀
// ==========================================
const API_URL = 'https://api.shahba-go.com/api';

// 🛑 قائمة حسابات الإدارة 🛑
const ADMIN_ACCOUNTS = [
  'yahya.tatari93@gmail.com',
  'hammash.travel@gmail.com',
  '00963944299060',
  '+963944299060',
  '00963955490049',
  '+963955490049'
];

// 🛑 خيارات النقل البري 🛑
const TRANSIT_LOCATIONS = ['حلب', 'دمشق', 'اللاذقية', 'بيروت', 'عمان', 'مطار حلب', 'مطار دمشق'];

const TRANSIT_VEHICLES = [
  { id: 'standard', name: 'سيارة عادية', icon: Car, desc: 'سفر مريح واقتصادي 🚗' },
  { id: 'suv', name: 'سيارة جيب', icon: CarFront, desc: 'مساحة أوسع ورفاهية عالية 🚙' },
  { id: 'van', name: 'فان', icon: Bus, desc: 'عائلية تتسع لـ 7 ركاب 🚐' },
  { id: 'microbus', name: 'ميكرو باص', icon: Bus, desc: 'للمجموعات حتى 10 ركاب 🚌' }
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
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=400',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400',
          'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=400'
      ]
  },
  { 
      id: 'h_alp_2', cityId: 'aleppo', name: 'فندق الشيراتون', desc: 'قلب المدينة العريق', 
      img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400',
      gallery: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=400',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=400'
      ]
  },
  { 
      id: 'h_dam_1', cityId: 'damascus', name: 'فندق فور سيزونز', desc: 'فخامة العاصمة', 
      img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400',
      gallery: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=400',
          'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=400',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=400'
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
  { id: 'audi', name: 'Audi A6', price: '750,000 ل.س', img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=400' },
  { id: 'genesis', name: 'Genesis G80', price: '900,000 ل.س', img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=400' },
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
  
  // ✅ (النقطة 8) حماية الـ localStorage بـ try/catch
  const [user, setUser] = useState(() => {
     const savedUser = localStorage.getItem('sh_user');
     if (!savedUser) return null;
     try {
         return JSON.parse(savedUser);
     } catch (e) {
         console.error("Failed to parse user data from localStorage", e);
         localStorage.removeItem('sh_user');
         return null;
     }
  });
  
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const isGuest = user?.isGuest === true;
  const isUserAdmin = user && (
    user.role === 'admin' || 
    (user.email && ADMIN_ACCOUNTS.includes(user.email.toLowerCase())) ||
    (user.phoneNumber && ADMIN_ACCOUNTS.includes(user.phoneNumber))
  );

  const [adminTab, setAdminTab] = useState('analytics'); 
  const [orderFilter, setOrderFilter] = useState('pending'); 

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'الآن';
    return new Intl.DateTimeFormat('ar-SY', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    }).format(new Date(timestamp));
  };

  const getTodayDateString = () => {
    const d = new Date();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };
  const todayDate = getTodayDateString();

  const getAuthHeaders = () => {
      const token = localStorage.getItem('sh_token');
      return {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
  };

  const [authMode, setAuthMode] = useState('login'); 
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
  
  const [dynamicEvents, setDynamicEvents] = useState(() => {
      const saved = localStorage.getItem('sh_dynamic_events');
      if (!saved) return [];
      try {
          return JSON.parse(saved);
      } catch (e) {
          return [];
      }
  });
  
  const [carsList, setCarsList] = useState(DEFAULT_CARS); 
  const [editingCar, setEditingCar] = useState(null); 
  const [bookingItem, setBookingItem] = useState(null);
  const [globalAlerts, setGlobalAlerts] = useState([]); 
  const [activeGalleryImg, setActiveGalleryImg] = useState(null); 

  const [rejectModal, setRejectModal] = useState(null); 
  const [rejectReasonText, setRejectReasonText] = useState("");
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('office'); 
  const [userPoints, setUserPoints] = useState(250); 
  
  const [phoneError, setPhoneError] = useState(''); 

  const [showNotifications, setShowNotifications] = useState(false); 
  const [selectedNotification, setSelectedNotification] = useState(null); 
  
  const [readNotifs, setReadNotifs] = useState(() => {
      const saved = localStorage.getItem('sh_read_notifs');
      if (!saved) return [];
      try {
          return JSON.parse(saved);
      } catch (e) {
          return [];
      }
  });

  const [printingOrder, setPrintingOrder] = useState(null); 
  
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [invoicePreview, setInvoicePreview] = useState(null);

  const [transitLive, setTransitLive] = useState({
      from: '', to: '', pax: '1', bags: '0', meal: false, internet: false, extra: false
  });

  const calculateLiveTransitPrice = () => {
      let base = 0;
      if (transitLive.from && transitLive.to) base = 75;
      if (base === 0) return 0;

      let paxMultiplier = 1;
      if (bookingItem?.vehicleId === 'standard' || bookingItem?.vehicleId === 'suv') {
          if (transitLive.pax === '2') paxMultiplier = 2;
          else if (transitLive.pax === 'full') paxMultiplier = 3;
      } else {
          paxMultiplier = parseInt(transitLive.pax) || 1;
      }

      let total = base * paxMultiplier;
      total += parseInt(transitLive.bags) * 10;
      if (transitLive.meal) total += 8;
      if (transitLive.internet) total += 7;
      if (transitLive.extra) total += 12;

      return total;
  };

  const [toasts, setToasts] = useState([]);
  const addToast = (msg, type = 'info', title = '') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type, title }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
    }
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW Registration failed', err));
    }
  }, []);

  useEffect(() => {
      if (globalAlerts && globalAlerts.length > 0 && !isUserAdmin) {
          const latest = globalAlerts[0];
          const savedSeen = localStorage.getItem('seen_alerts');
          let seen = [];
          try { seen = savedSeen ? JSON.parse(savedSeen) : []; } catch(e) {}
          
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
              
              setReadNotifs(prev => {
                  if (!prev.includes(latest.id)) {
                      const updated = [...prev, latest.id];
                      localStorage.setItem('sh_read_notifs', JSON.stringify(updated));
                      return updated;
                  }
                  return prev;
              });
          }
      }
  }, [globalAlerts, isUserAdmin]);

  useEffect(() => {
    if (!user) return; 

    const loadData = async () => {
       try {
           const carsRes = await fetch(`${API_URL}/cars`).catch(()=>null);
           if (carsRes && carsRes.ok) setCarsList(await carsRes.json());

           const ordersRes = await fetch(`${API_URL}/orders`, { headers: getAuthHeaders() }).catch(()=>null);
           if (ordersRes && ordersRes.ok) {
               const ords = await ordersRes.json();
               setAllOrders(ords);
               const phone = localStorage.getItem('sh-user-phone');
               setUserOrders(ords.filter(o => o.phone === phone || o.userId === user.uid));
           }

           const eventsRes = await fetch(`${API_URL}/events`).catch(()=>null);
           if (eventsRes && eventsRes.ok) {
               const evts = await eventsRes.json();
               if (Array.isArray(evts)) {
                   setDynamicEvents(prev => {
                       if (evts.length < prev.length) return prev;
                       localStorage.setItem('sh_dynamic_events', JSON.stringify(evts));
                       return evts;
                   });
               }
           }

           const alertsRes = await fetch(`${API_URL}/alerts`).catch(()=>null);
           if (alertsRes && alertsRes.ok) {
               const alrts = await alertsRes.json();
               setGlobalAlerts(alrts); 
           }
       } catch (err) {
           console.log("صعوبة في الاتصال بالسيرفر.");
       }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const analyticsData = useMemo(() => {
      const approvedOrders = allOrders.filter(o => o.status === 'approved');
      const pendingOrders = allOrders.filter(o => o.status === 'pending');

      let totalSYP = 0;
      let totalUSD = 0;

      approvedOrders.forEach(o => {
          if (o.calculatedTotal) {
              if (o.calculatedCurrency === '$') totalUSD += Number(o.calculatedTotal);
              else totalSYP += Number(o.calculatedTotal);
          }
      });

      const categoryCounts = {
          car: 0, transit: 0, hotel: 0, flights: 0, bus: 0, services: 0, events: 0
      };

      const carStats = {};
      const transitDestStats = {};
      const transitVehicleStats = {};
      const hotelStats = {};
      const serviceStats = {};

      allOrders.forEach(o => {
          if (categoryCounts[o.serviceType] !== undefined) {
              categoryCounts[o.serviceType]++;
          }

          if (o.serviceType === 'car' && o.serviceTitle) {
              const carName = o.serviceTitle.replace('آجار سيارة: ', '').trim();
              carStats[carName] = (carStats[carName] || 0) + 1;
          }
          if (o.serviceType === 'transit') {
              if (o.toLocation) {
                  transitDestStats[o.toLocation] = (transitDestStats[o.toLocation] || 0) + 1;
              }
              const vName = o.serviceTitle ? o.serviceTitle.replace('طلب حجز - ', '').trim() : 'غير محدد';
              transitVehicleStats[vName] = (transitVehicleStats[vName] || 0) + 1;
          }
          if (o.serviceType === 'hotel' && o.hotelName) {
              hotelStats[o.hotelName] = (hotelStats[o.hotelName] || 0) + 1;
          }
          if (o.serviceType === 'services' && o.serviceTitle) {
              serviceStats[o.serviceTitle] = (serviceStats[o.serviceTitle] || 0) + 1;
          }
      });

      const sortStats = (statObj) => Object.entries(statObj).sort((a, b) => b[1] - a[1]);

      return {
          totalOrders: allOrders.length,
          approvedCount: approvedOrders.length,
          pendingCount: pendingOrders.length,
          totalSYP,
          totalUSD,
          categoryCounts,
          carStats: sortStats(carStats),
          transitDestStats: sortStats(transitDestStats),
          transitVehicleStats: sortStats(transitVehicleStats),
          hotelStats: sortStats(hotelStats),
          serviceStats: sortStats(serviceStats)
      };
  }, [allOrders]);

  const notifications = useMemo(() => {
      let notifs = [];
      
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
                  desc: `طلب ${o.serviceTitle} من ${o.name}\nرقم الهاتف: ${o.phone}`,
                  time: o.createdAt,
                  type: 'order',
                  icon: Ticket,
                  orderData: o
              });
          });
      } else {
          if (!isGuest) {
              userOrders.filter(o => o.status !== 'pending').forEach(o => {
                  notifs.push({
                      id: o.id + '_update',
                      title: o.status === 'approved' ? 'مبارك! تم قبول طلبك' : 'عذراً، تم رفض الطلب',
                      desc: `طلب: ${o.serviceTitle} ${o.status === 'rejected' && o.rejectionReason ? `\nالسبب: ${o.rejectionReason}` : ''}`,
                      time: o.updatedAt || o.createdAt,
                      type: o.status === 'approved' ? 'success' : 'error',
                      icon: o.status === 'approved' ? CheckCircle2 : X,
                      orderData: o
                  });
              });
          }
          dynamicEvents.forEach(e => {
              notifs.push({
                  id: e.id,
                  title: e.postType === 'offer' ? 'عرض جديد!' : 'رحلة جديدة!',
                  desc: `${e.name} ${e.price ? `بـ ${e.price}` : ''}\n${e.desc || ''}`,
                  time: e.createdAt,
                  type: 'info',
                  icon: Megaphone
              });
          });
      }
      return notifs.sort((a, b) => b.time - a.time);
  }, [allOrders, userOrders, dynamicEvents, globalAlerts, isUserAdmin, isGuest]);

  useEffect(() => {
      if ("Notification" in window && Notification.permission === "granted") {
          let osNotified = [];
          try {
              const saved = localStorage.getItem('sh_os_notified');
              osNotified = saved ? JSON.parse(saved) : [];
          } catch(e){}
          
          let updated = false;

          notifications.forEach(n => {
              if (!osNotified.includes(n.id) && !readNotifs.includes(n.id)) {
                  new Notification("شهبا Go | " + n.title, { 
                      body: n.desc.replace(/\n/g, " - "), 
                  });
                  osNotified.push(n.id);
                  updated = true;
              }
          });

          if (updated) {
              localStorage.setItem('sh_os_notified', JSON.stringify(osNotified));
          }
      }
  }, [notifications, readNotifs]);

  const handleNotificationClick = (n) => {
      if (!readNotifs.includes(n.id)) {
          const newRead = [...readNotifs, n.id];
          setReadNotifs(newRead);
          localStorage.setItem('sh_read_notifs', JSON.stringify(newRead));
      }

      setShowNotifications(false);
      setSelectedNotification(n); 

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

  const handleAuthSubmit = async (e) => {
      e.preventDefault();
      setAuthError('');
      
      let dbUsers = [];
      try {
          const savedUsers = localStorage.getItem('sh_db_users');
          dbUsers = savedUsers ? JSON.parse(savedUsers) : [];
      } catch(e){}

      if (authMode === 'login') {
          setAuthLoading(true);
          try {
              const res = await fetch(`${API_URL}/auth/login`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ method: authTab, email: authEmail, password: authPassword, phone: authPhone })
              });
              
              const data = await res.json();
              if (res.ok) {
                  setUser(data.user);
                  localStorage.setItem('sh_user', JSON.stringify(data.user));
                  localStorage.setItem('sh_token', data.token);
                  addToast('تم تسجيل الدخول بنجاح', 'success');
              } else {
                  setAuthError(data.error || 'بيانات الدخول غير صحيحة!');
              }
          } catch (error) {
              const accountFound = dbUsers.find(u => 
                  (authTab === 'email' && u.email === authEmail && u.password === authPassword) || 
                  (authTab === 'phone' && u.phone === authPhone && u.password === authPassword)
              );

              if (accountFound || ADMIN_ACCOUNTS.includes(authEmail) || ADMIN_ACCOUNTS.includes(authPhone)) {
                  const loggedInUser = accountFound || { uid: 'admin_' + Date.now(), email: authEmail, phoneNumber: authPhone, role: 'admin', isGuest: false };
                  setUser(loggedInUser);
                  localStorage.setItem('sh_user', JSON.stringify(loggedInUser));
                  addToast('تم تسجيل الدخول بنجاح', 'success');
              } else {
                  setAuthError('بيانات الدخول خاطئة أو الحساب غير مسجل!');
              }
          }
          setAuthLoading(false);
      } else {
          if (!otpSent) {
              const exists = dbUsers.find(u => (authTab === 'email' && u.email === authEmail) || (authTab === 'phone' && u.phone === authPhone));
              if (exists) {
                  setAuthError('هذا الحساب مسجل مسبقاً! يرجى تسجيل الدخول.');
                  return;
              }
              
              setAuthLoading(true);
              try {
                  const res = await fetch(`${API_URL}/auth/send-otp`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ method: authTab, email: authEmail, phone: authPhone })
                  });
                  if (res.ok) {
                      setOtpSent(true);
                      addToast(`تم إرسال الرمز إلى ${authTab === 'email' ? 'إيميلك' : 'رقمك'}!`, 'success');
                  } else {
                      throw new Error('Failed');
                  }
              } catch (error) {
                  setTimeout(() => {
                      setOtpSent(true);
                      addToast(`(وضع التجربة) استخدم الرمز 123456`, 'info');
                  }, 1000);
              }
              setAuthLoading(false);
          } else {
              setAuthLoading(true);
              if (otpCode !== '123456' && otpCode.length > 0) {
                 // Verify real OTP here later
              }
              
              const newUser = { 
                  uid: 'u_' + Date.now(), 
                  email: authTab === 'email' ? authEmail : null, 
                  phone: authTab === 'phone' ? authPhone : null, 
                  password: authPassword,
                  isGuest: false,
                  role: 'user'
              };
              
              dbUsers.push(newUser);
              localStorage.setItem('sh_db_users', JSON.stringify(dbUsers));
              setUser(newUser);
              localStorage.setItem('sh_user', JSON.stringify(newUser));
              addToast('تم إنشاء الحساب وتسجيل الدخول بنجاح!', 'success');
              setAuthLoading(false);
          }
      }
  };

  const handleGuestLogin = () => {
      const guestUser = { uid: 'guest_' + Date.now(), isGuest: true };
      setUser(guestUser);
      localStorage.setItem('sh_user', JSON.stringify(guestUser));
      addToast('تم الدخول كزائر للتصفح', 'info');
  };

  // ✅ (النقطة 6) توحيد مسح الجلسات باستخدام دالة executeLogout
  const executeLogout = () => {
      localStorage.removeItem('sh_user');
      localStorage.removeItem('sh_token');
      setUser(null); 
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
          const res = await fetch(`${API_URL}/cars/${editingCar.id}`, {
              method: 'PUT',
              headers: getAuthHeaders(),
              body: JSON.stringify({ price: newPrice })
          });
          if (res.ok) {
              setCarsList(prev => prev.map(c => c.id === editingCar.id ? { ...c, price: newPrice } : c));
              setEditingCar(null);
              addToast('تم تحديث سعر السيارة بنجاح', 'success');
          } else {
              addToast('ليس لديك صلاحية لهذا التعديل', 'error');
          }
      } catch (error) {
          addToast('تعذر الاتصال بالسيرفر لحفظ التعديلات.', 'error');
      }
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!user) return;

    let formValues;

    if (!invoicePreview) {
        const formData = new FormData(e.target);
        formValues = Object.fromEntries(formData.entries());

        const phoneStr = formValues.phone.trim();
        if (!/^\d{10}$/.test(phoneStr)) {
            setPhoneError("يرجى إدخال رقم هاتف صحيح مكون من 10 أرقام (مثال: 0912345678)");
            return; 
        }
        setPhoneError(""); 

        localStorage.setItem('sh-user-name', formValues.name);
        localStorage.setItem('sh-user-phone', phoneStr);

        if (selectedCategory === 'car') {
            const basePriceStr = bookingItem.price || "0";
            const basePrice = parseInt(basePriceStr.replace(/[^0-9]/g, '')) || 0;
            const isWithDriver = formValues.driverOption === 'with_driver';
            const dailyRate = isWithDriver ? basePrice * 1.25 : basePrice;
            const daysCount = parseInt(formValues.durationCount || 7);
            const total = dailyRate * daysCount;
            
            // ✅ (النقطة 3) إضافة isWithDriver لـ invoicePreview
            setInvoicePreview({
                ...formValues,
                totalPrice: total,
                currency: 'ل.س',
                daysCount: daysCount,
                isWithDriver: isWithDriver 
            });
            return; 
        }

        if (selectedCategory === 'transit') {
            const finalPrice = calculateLiveTransitPrice();
            setInvoicePreview({
                ...formValues,
                ...transitLive, 
                totalPrice: finalPrice,
                currency: '$'
            });
            return;
        }
    } else {
        formValues = invoicePreview;
    }

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
      isGuest: isGuest,
      calculatedTotal: invoicePreview ? invoicePreview.totalPrice : null,
      calculatedCurrency: invoicePreview ? invoicePreview.currency : null
    };

    try {
        let res;
        if (bookingItem?.isEditMode && bookingItem?.id) {
           res = await fetch(`${API_URL}/orders/${bookingItem.id}`, {
               method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(orderData)
           });
        } else {
           res = await fetch(`${API_URL}/orders`, {
               method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(orderData)
           });
        }
        
        if (res.ok) {
            if (!isGuest && !bookingItem?.isEditMode) setUserPoints(prev => prev + 25);
            setBookingItem(null);
            setInvoicePreview(null);
            setAcceptTerms(false);
            setHasKidsState('no');
            setSelectedBusType(null);
            setSelectedHotel(null);
            setSelectedCity(null);
            setTransitLive({ from: '', to: '', pax: '1', bags: '0', meal: false, internet: false, extra: false });
            setShowSuccessCard(true);
        } else {
            addToast('حدث خطأ أثناء معالجة الطلب في السيرفر.', 'error');
        }
    } catch(err) {
        addToast('خطأ في الاتصال بالسيرفر! يرجى المحاولة لاحقاً.', 'error');
    }
  };

  const handleRedeemReward = async (reward) => {
      if (isGuest) {
          // ✅ (النقطة 6) توحيد مسح الجلسة
          executeLogout();
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
              const res = await fetch(`${API_URL}/orders`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(rewardOrder) });
              if (res.ok) {
                  setUserPoints(prev => prev - reward.points);
                  addToast(`مبروك! تم إرسال طلب استبدال (${reward.name}).`, 'success');
              } else {
                  addToast('تعذر إرسال الطلب.', 'error');
              }
          } catch(e) {
              addToast('خطأ في الاتصال بالسيرفر! يرجى المحاولة لاحقاً.', 'error');
          }
      } else {
          alert(`رصيدك غير كافٍ. تحتاج إلى ${reward.points - userPoints} نقطة إضافية.`);
      }
  };

  const updateOrderStatus = async (orderId, status, reason = "") => {
    if (!user) return;
    try {
        const res = await fetch(`${API_URL}/orders/${orderId}`, {
            method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status, rejectionReason: reason })
        });
        if (res.ok) {
            setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, rejectionReason: reason } : o));
            setRejectModal(null);
            setRejectReasonText("");
        } else {
            addToast('ليس لديك صلاحية أو حدث خطأ بالسيرفر.', 'error');
        }
    } catch (err) {
        addToast('تعذر الاتصال بالسيرفر.', 'error');
    }
  };

  const addMarketingEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const eventData = Object.fromEntries(formData.entries());
    const newLocalEvent = { id: 'evt_' + Date.now(), ...eventData, createdAt: Date.now() };

    setDynamicEvents(prev => {
        const updated = [newLocalEvent, ...prev];
        localStorage.setItem('sh_dynamic_events', JSON.stringify(updated));
        return updated;
    });
    e.target.reset();
    addToast('تم إدراج الإعلان بنجاح', 'success');

    try {
        await fetch(`${API_URL}/events`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(newLocalEvent) });
    } catch(err) {
        console.log('ملاحظة: العمل يتم في بيئة الاختبار المحلية للمحاكي.');
    }
  };

  const deleteMarketingEvent = async (id) => {
    setDynamicEvents(prev => {
        const updated = prev.filter(ev => ev.id !== id);
        localStorage.setItem('sh_dynamic_events', JSON.stringify(updated));
        return updated;
    });
    addToast('تم حذف الإعلان', 'success');

    try {
        await fetch(`${API_URL}/events/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch(err) {
        console.log('ملاحظة: العمل يتم في بيئة الاختبار المحلية للمحاكي.');
    }
  };

  const sendGlobalAlert = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const alertData = { message: formData.get('message'), type: formData.get('type') };
    try {
        const res = await fetch(`${API_URL}/alerts`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(alertData) });
        if (res.ok) {
            const data = await res.json();
            setGlobalAlerts(prev => [data.alert, ...(prev || [])]);
            e.target.reset();
            addToast('تم إرسال التنبيه وسيظهر للعملاء فوراً!', 'success');
        } else {
            addToast('ليس لديك صلاحية', 'error');
        }
    } catch(err) {
        addToast('تعذر الاتصال بالسيرفر.', 'error');
    }
  };

  const renderOrderInfo = (order) => {
    if (order.serviceType === 'reward') return `استبدال هدية (${order.pointsUsed} نقطة)`;
    if (order.serviceType === 'car') {
       return `المدة: ${order.durationCount || order.daysCount || 7} أيام | السائق: ${order.driverOption === 'with_driver' ? 'مع سائق' : 'بدون'} | البدء: ${order.startDate || 'غير محدد'}`;
    }
    if (order.serviceType === 'hotel') return `البدء: ${order.checkIn} (${order.nightCount} ليلة)`;
    if (order.serviceType === 'bus' && order.busSubCategory === 'contract') return `${order.orgName} | باصات: ${order.busCount}`;
    if (order.serviceType === 'bus') return `ترفيهي: ${order.tripDate}`;
    if (order.serviceType === 'flights') return `من ${order.fromAirport} لـ ${order.toAirport} بتاريخ ${order.flightDate}`;
    if (order.serviceType === 'transit') return `من ${order.fromLocation} إلى ${order.toLocation} | ركاب: ${order.pax} | حقائب: ${order.bags || '0'} | موعد: ${order.tripDate}`;
    if (order.serviceType === 'services') {
       if (order.fromCity && order.toCity) return `من: ${order.fromCity} إلى: ${order.toCity}`;
       return `الخدمة المطلوبة مسجلة`;
    }
    if (order.serviceType === 'events') return `عدد: ${order.paxCount}`;
    return 'تفاصيل عامة';
  };

  const calculateEstimatedPrice = (order) => {
      if (order.calculatedTotal) {
          if (order.calculatedCurrency === '$') {
              return `$${order.calculatedTotal}`;
          }
          return new Intl.NumberFormat('ar-SY', { style: 'currency', currency: 'SYP' }).format(order.calculatedTotal);
      }

      let total = 0;
      let pax = parseInt(order.paxCount) || 1;
      let duration = parseInt(order.durationCount) || parseInt(order.nightCount) || 1;
      
      if (order.serviceType === 'hotel') total = pax * duration * 250000;
      else if (order.serviceType === 'transit') total = pax * 150000;
      else if (order.serviceType === 'flights') total = pax * 1200000;
      else if (order.serviceType === 'events') total = pax * 100000;
      else if (order.serviceType === 'bus' && order.busSubCategory === 'contract') total = (parseInt(order.busCount)||1) * 500000;
      else total = pax * 50000; 
      
      return new Intl.NumberFormat('ar-SY', { style: 'currency', currency: 'SYP' }).format(total);
  };

  const filterOrdersByType = (types) => {
      let filtered = allOrders.filter(o => types.includes(o.serviceType));
      if (orderFilter !== 'all') {
          filtered = filtered.filter(o => o.status === orderFilter);
      }
      return filtered;
  };

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

  const unreadCount = notifications.filter(n => !readNotifs.includes(n.id)).length;

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

  const renderMiniStat = (title, statsArray, IconComponent, emptyMsg) => (
      <div className="bg-[#112240] p-4 rounded-[2rem] border border-white/5 shadow-lg flex flex-col">
          <h5 className="text-[11px] font-black text-emerald-400 mb-3 border-b border-white/5 pb-2 flex items-center justify-end gap-1.5">
              {title} <IconComponent size={14}/>
          </h5>
          {statsArray.length === 0 ? (
              <p className="text-[9px] text-white/30 text-center py-4 font-bold">{emptyMsg}</p>
          ) : (
              <div className="space-y-2 flex-1">
                  {statsArray.slice(0, 5).map(([name, count], i) => (
                      <div key={i} className="flex justify-between items-center text-[10px] bg-white/5 p-2 rounded-xl">
                          <span className="font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">{count}</span>
                          <span className="text-white/80 truncate w-3/4 text-right font-bold">{name}</span>
                      </div>
                  ))}
              </div>
          )}
      </div>
  );

  // 1. شاشة البداية (Splash Screen)
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#0B192C] flex flex-col items-center justify-center z-[2000]">
        <div className="relative mb-8">
            <HTLogo size="large" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/10 rounded-full blur-xl animate-ping"></div>
        </div>
        <h1 className="text-5xl font-black text-white italic tracking-tighter text-center leading-none uppercase mb-1 drop-shadow-lg">شهبا <span className="text-emerald-400">Go</span></h1>
        
        <div className="flex items-center gap-3 mb-6 opacity-80">
            <div className="h-px w-8 bg-gradient-to-l from-emerald-500 to-transparent"></div>
            <span className="text-[11px] text-white tracking-[0.3em] font-light uppercase">Hammash & Tatari</span>
            <div className="h-px w-8 bg-gradient-to-r from-emerald-500 to-transparent"></div>
        </div>

        <p className="text-emerald-400 font-bold text-sm tracking-widest uppercase opacity-80">هدفنا راحتك</p>
      </div>
    );
  }

  // 2. شاشة تسجيل الدخول الإجبارية (Auth Screen)
  if (!user) {
      return (
          <div className="min-h-screen bg-[#0B192C] flex flex-col items-center justify-center p-6 relative overflow-hidden" dir="rtl">
              <ToastContainer />
              
              {/* زينة الخلفية */}
              <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="w-full max-w-md bg-[#112240]/80 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl relative z-10 animate-in zoom-in-95">
                  <div className="flex flex-col items-center mb-8">
                      <HTLogo size="large" />
                      <h1 className="text-3xl font-black italic text-white mt-4 tracking-tighter">شهبا <span className="text-emerald-400">Go</span></h1>
                      <p className="text-emerald-400/80 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Hammash & Tatari</p>
                  </div>

                  <h2 className="text-xl font-black text-white text-center mb-6">
                      {authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                  </h2>

                  <div className="flex bg-[#0B192C]/80 p-1.5 rounded-2xl mb-6 border border-white/10 shadow-inner">
                      <button onClick={() => {setAuthTab('email'); setAuthError(''); setOtpSent(false); setOtpCode('');}} className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${authTab === 'email' ? 'bg-emerald-500 text-black shadow-md' : 'text-white/40 hover:text-white'}`}>
                          <Mail size={16} /> الإيميل
                      </button>
                      <button onClick={() => {setAuthTab('phone'); setAuthError(''); setOtpSent(false); setOtpCode('');}} className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${authTab === 'phone' ? 'bg-emerald-500 text-black shadow-md' : 'text-white/40 hover:text-white'}`}>
                          <Phone size={16} /> الهاتف
                      </button>
                  </div>

                  {authError && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs font-bold mb-6 text-center animate-in fade-in">{authError}</div>}

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                      {authTab === 'email' ? (
                          <input type="email" required value={authEmail} onChange={(e)=>setAuthEmail(e.target.value)} disabled={otpSent} className="w-full bg-[#0B192C] border border-white/10 rounded-2xl py-4 px-4 text-xs text-white text-right outline-none focus:border-emerald-500 disabled:opacity-50 transition-all shadow-inner" placeholder="البريد الإلكتروني (مثال: user@mail.com)" />
                      ) : (
                          <div className="relative flex" dir="ltr">
                              <div className="bg-[#0B192C] border border-white/10 border-r-0 rounded-l-2xl px-4 flex items-center text-white/60 font-medium text-xs shadow-inner">+963</div>
                              <input type="tel" required value={authPhone} onChange={(e)=>setAuthPhone(e.target.value)} disabled={otpSent} className="w-full bg-[#0B192C] border border-white/10 rounded-r-2xl py-4 px-4 text-xs text-white outline-none focus:border-emerald-500 disabled:opacity-50 transition-all shadow-inner" placeholder="09xx xxx xxx" />
                          </div>
                      )}

                      <input type="password" required value={authPassword} onChange={(e)=>setAuthPassword(e.target.value)} disabled={otpSent} className="w-full bg-[#0B192C] border border-white/10 rounded-2xl py-4 px-4 text-xs text-white text-right outline-none focus:border-emerald-500 disabled:opacity-50 transition-all shadow-inner" placeholder="كلمة المرور" />

                      {authMode === 'signup' && otpSent && (
                          <div className="animate-in fade-in slide-in-from-top-2 space-y-4 pt-4 border-t border-white/10">
                              <p className="text-[10px] text-emerald-400 text-center font-bold">تم إرسال رمز التحقق، يرجى إدخاله أدناه:</p>
                              <input type="text" required value={otpCode} onChange={(e)=>setOtpCode(e.target.value)} className="w-full bg-[#0B192C] border border-white/10 rounded-2xl py-4 px-4 text-xl tracking-[0.5em] font-black text-white text-center outline-none focus:border-emerald-500 shadow-inner" placeholder="123456" maxLength={6} />
                          </div>
                      )}

                      <button type="submit" disabled={authLoading || (authMode === 'signup' && otpSent && !otpCode)} className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 mt-4">
                          {authLoading ? 'جاري المعالجة...' : 
                              (authMode === 'login' ? 'تسجيل الدخول' : 
                                  (!otpSent ? 'إرسال رمز التأكيد' : 'تأكيد وإنشاء الحساب'))}
                      </button>
                  </form>

                  <div className="mt-8 text-center space-y-4">
                      {authMode === 'login' ? (
                          <p className="text-xs text-white/50 font-bold">
                              ليس لديك حساب؟ <span onClick={() => {setAuthMode('signup'); setAuthError(''); setOtpSent(false); setOtpCode('');}} className="text-emerald-400 cursor-pointer hover:text-emerald-300 font-black px-1 transition-all">إنشاء حساب جديد</span>
                          </p>
                      ) : (
                          <p className="text-xs text-white/50 font-bold">
                              لديك حساب بالفعل؟ <span onClick={() => {setAuthMode('login'); setAuthError(''); setOtpSent(false); setOtpCode('');}} className="text-emerald-400 cursor-pointer hover:text-emerald-300 font-black px-1 transition-all">تسجيل الدخول</span>
                          </p>
                      )}
                      
                      <div className="pt-6 border-t border-white/10">
                          <button onClick={handleGuestLogin} className="text-[10px] text-white/30 hover:text-white font-bold transition-colors">تخطي ومتابعة كزائر</button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // 3. قالب الفاتورة المطبوعة (PDF Voucher)
  if (printingOrder) {
      return (
          <div className="min-h-screen bg-white text-black p-8 font-sans" dir="rtl">
              <div className="max-w-2xl mx-auto border-2 border-gray-200 p-8 rounded-3xl relative">
                  <div className="flex justify-between items-start border-b-2 border-gray-100 pb-6 mb-6">
                      <div>
                          <h1 className="text-3xl font-black text-emerald-700 italic mb-1">شهبا Go</h1>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Hammash & Tatari Tourism</p>
                      </div>
                      <div className="text-left">
                          <div className="text-2xl font-black text-gray-800">VOUCHER</div>
                          <div className="text-sm text-gray-500">رقم الحجز: #{printingOrder.id.substring(4, 12)}</div>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4">
                          <div>
                              <p className="text-xs text-gray-400 font-bold mb-1">الخدمة المحجوزة</p>
                              <p className="text-lg font-black text-emerald-600">{printingOrder.serviceTitle}</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-400 font-bold mb-1">اسم العميل</p>
                              <p className="font-bold text-gray-800">{printingOrder.name}</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-400 font-bold mb-1">رقم الهاتف</p>
                              <p className="font-bold text-gray-800" dir="ltr">{printingOrder.phone}</p>
                          </div>
                      </div>
                      <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                          <div>
                              <p className="text-xs text-gray-400 font-bold mb-1">تاريخ الحجز</p>
                              <p className="font-bold text-gray-800">{formatDateTime(printingOrder.createdAt)}</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-400 font-bold mb-1">طريقة الدفع المختارة</p>
                              <p className="font-bold text-gray-800">{printingOrder.paymentMethod === 'office' ? 'نقداً في المكتب' : 'تحويل عبر شام كاش'}</p>
                          </div>
                          <div>
                              <p className="text-xs text-gray-400 font-bold mb-1">حالة الطلب</p>
                              <p className="font-black text-emerald-600 bg-emerald-100 w-fit px-3 py-1 rounded-lg">مؤكد ومقبول</p>
                          </div>
                      </div>
                  </div>

                  <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-8 flex justify-between items-end">
                      <div>
                          <p className="text-xs text-gray-400 font-bold mb-1">المبلغ الإجمالي للتسديد</p>
                          <p className="text-3xl font-black text-gray-900">{calculateEstimatedPrice(printingOrder)}</p>
                          {(!printingOrder.calculatedTotal) && (
                             <p className="text-[10px] text-gray-400 mt-2">*هذا المبلغ تقديري وسيتم تأكيده بشكل نهائي عند التواصل.</p>
                          )}
                      </div>
                      <div className="text-center">
                          <QrCode size={64} className="text-gray-800 mx-auto mb-2"/>
                          <p className="text-[10px] font-bold text-gray-500 tracking-widest">HT-SHAHBA-GO</p>
                      </div>
                  </div>

                  <div className="flex gap-4 mt-12 no-print border-t border-gray-200 pt-6">
                      <button onClick={() => window.print()} className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30">
                          <Printer size={18}/> طباعة / حفظ كـ PDF
                      </button>
                      <button onClick={() => setPrintingOrder(null)} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-black text-sm hover:bg-gray-200 transition-colors">
                          عودة للتطبيق
                      </button>
                  </div>
              </div>
              <style>{`@media print { .no-print { display: none !important; } body { background: white; } }`}</style>
          </div>
      );
  }

  // 4. واجهة التطبيق الرئيسية (Main App)
  return (
    <div className="min-h-screen bg-[#0B192C] text-white font-sans overflow-x-hidden pb-32" dir="rtl">
      <ToastContainer />

      {showTermsModal && (
          <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-6">
              <div className="bg-[#112240] w-full max-w-md p-8 rounded-[2.5rem] border border-emerald-500/30 shadow-2xl relative text-right animate-in zoom-in-95">
                   <button type="button" onClick={() => setShowTermsModal(false)} className="absolute top-6 left-6 text-white/30 hover:text-rose-500 transition-colors"><X size={20}/></button>
                   <h3 className="text-lg font-black text-emerald-400 mb-4 flex items-center gap-2"><FileText size={20}/> دفتر شروط آجار السيارات</h3>
                   <div className="bg-[#0B192C] p-4 rounded-2xl h-48 overflow-y-auto text-[11px] text-white/80 leading-relaxed font-bold border border-white/5 mb-6 shadow-inner scrollbar-thin">
                        <p className="mb-2 text-amber-400">سيتم إدراج النص القانوني الخاص بالشروط والأحكام هنا بناءً على طلب الإدارة.</p>
                        <p>يجب على العميل الالتزام بكافة البنود المذكورة لحماية حقوق الطرفين، والتي تتضمن شروط التسليم، التأمين، وتجاوز المدة المحددة.</p>
                   </div>
                   <button type="button" onClick={() => { setAcceptTerms(true); setShowTermsModal(false); }} className="w-full bg-emerald-500 text-black py-4 rounded-xl font-black text-xs shadow-lg active:scale-95 transition-all">قرأت وموافق على الشروط</button>
              </div>
          </div>
      )}

      {/* 🌟 شريط العروض المتحرك المحسن والسريع 🌟 */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2.5 overflow-hidden whitespace-nowrap sticky top-0 z-40 backdrop-blur-md">
        <div className="flex animate-marquee hover:[animation-play-state:paused] space-x-8 space-x-reverse items-center w-max px-10">
            {dynamicEvents.length > 0 ? dynamicEvents.map((ev, index) => (
                <span 
                    key={ev.id} 
                    onClick={() => {
                        setShowAdminPanel(false);
                        setActiveView('list');
                        setSelectedCategory('events');
                        setBookingItem(ev);
                    }}
                    className="text-[10px] font-black text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] flex items-center gap-2 cursor-pointer hover:brightness-125 transition-all shrink-0"
                >
                    {index > 0 && <span className="mx-4 text-white/30 font-light drop-shadow-none shrink-0">|</span>}
                    {ev.postType === 'offer' ? <Megaphone size={12} className="shrink-0"/> : <MapPin size={12} className="shrink-0"/>} 
                    {ev.name}
                </span>
            )) : (
                <span className="text-[10px] font-black text-emerald-400/50 flex items-center gap-4 shrink-0">
                    <Sparkles size={12} className="shrink-0"/> ترقبوا أحدث العروض والرحلات قريباً
                </span>
            )}
        </div>
      </div>

      <header className="p-5 sticky top-10 z-50 bg-[#0B192C]/95 backdrop-blur-xl border-b border-white/5 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setActiveView('main'); setShowAdminPanel(false); setSelectedCategory(null); setSelectedHotel(null); setSelectedCity(null); setSelectedBusType(null); setShowNotifications(false);}}>
           <HTLogo />
           <div className="flex flex-col text-right">
                <h1 className="text-lg font-black italic text-white leading-none mb-1">شهبا <span className="text-emerald-400">Go</span></h1>
                
                <span className="text-[7px] text-emerald-400/80 font-bold uppercase tracking-[0.15em] bg-emerald-500/10 px-1.5 py-0.5 rounded inline-block w-fit">
                    Hammash & Tatari
                </span>
           </div>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white transition-colors">
                    <BellRing size={16} className={unreadCount > 0 ? "animate-pulse text-amber-400" : ""} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] font-black flex items-center justify-center text-white shadow-lg border border-[#0B192C]">
                            {unreadCount > 9 ? '+9' : unreadCount}
                        </span>
                    )}
                </button>
                
                {showNotifications && (
                    <>
                        <div className="fixed inset-0 z-[8900]" onClick={() => setShowNotifications(false)}></div>
                        <div className="absolute top-12 left-0 w-72 bg-[#112240] border border-white/10 rounded-2xl shadow-2xl p-4 z-[9000] max-h-96 overflow-y-auto animate-in zoom-in-95">
                            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                               <h3 className="text-sm font-black text-white">التنبيهات</h3>
                               {unreadCount > 0 && (
                                   <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{unreadCount} جديد</span>
                               )}
                            </div>
                            <div className="space-y-2">
                               {notifications.length === 0 ? (
                                   <p className="text-[10px] text-white/40 text-center py-6 font-bold">لا يوجد تنبيهات حالياً</p>
                               ) : notifications.map(n => (
                                   <div key={n.id} onClick={() => handleNotificationClick(n)} className={`text-right p-3 rounded-xl border transition-all cursor-pointer flex gap-3 relative overflow-hidden ${
                                       readNotifs.includes(n.id) 
                                       ? 'bg-white/5 border-white/5 opacity-60 hover:opacity-100' 
                                       : 'bg-[#1e293b] border-white/10 hover:bg-white/20 shadow-md'
                                   }`}>
                                      {!readNotifs.includes(n.id) && (
                                          <div className="absolute top-3 left-3 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                      )}
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                          n.type === 'error' ? 'bg-rose-500/10 text-rose-400' : 
                                          n.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 
                                          n.type === 'order' ? 'bg-amber-500/10 text-amber-400' : 
                                          n.type === 'special' ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/30' : 
                                          'bg-blue-500/10 text-blue-400'
                                      }`}>
                                          <n.icon size={14} />
                                      </div>
                                      <div className="flex-1 z-10">
                                          <h4 className={`text-[11px] font-black ${n.type === 'special' && !readNotifs.includes(n.id) ? 'text-amber-400' : 'text-white'}`}>{n.title}</h4>
                                          <p className="text-[9px] text-white/60 mt-0.5 whitespace-pre-wrap leading-relaxed">{n.desc}</p>
                                          <span className="text-[8px] text-white/30 mt-1.5 block">{formatDateTime(n.time)}</span>
                                      </div>
                                   </div>
                               ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {(!isUserAdmin || !showAdminPanel) && (
                <button onClick={() => {
                    if (isGuest) {
                        executeLogout(); // ✅ (النقطة 6)
                    } else {
                        setActiveView('wallet'); 
                        setSelectedCategory(null);
                    }
                }} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 hover:bg-emerald-500/30 transition-colors">
                    <Gift size={14}/>
                    <span className="text-[10px] font-black">{isGuest ? '0' : userPoints}</span>
                </button>
            )}
            
            {isUserAdmin && (
                <button onClick={() => setShowAdminPanel(!showAdminPanel)} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold border transition-all ${showAdminPanel ? 'bg-amber-500/10 text-amber-400 border-amber-500/50' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'}`}>
                   {showAdminPanel ? <LayoutGrid size={14} /> : <Settings size={14}/>}
                   {showAdminPanel ? 'المتجر' : 'الإدارة'}
                </button>
            )}

            {isGuest ? (
                <button onClick={() => {
                    executeLogout(); // ✅ (النقطة 6)
                }} className="px-3 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold border border-white/10 bg-white/5 text-slate-300 hover:text-white transition-colors">
                    <LogIn size={14} /> دخول
                </button>
            ) : (
                <button onClick={() => setLogoutConfirm(true)} className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all">
                    <LogOut size={16} />
                </button>
            )}
        </div>
      </header>

      <main className="p-4 max-w-5xl mx-auto">
        {showAdminPanel && isUserAdmin ? (
          <div className="space-y-6 animate-in">
             {/* 🌟 تبويبات الإدارة المحسنة 🌟 */}
             <div className="flex bg-[#0F172A] p-1.5 rounded-2xl border border-white/5 mb-4 gap-1 overflow-x-auto scrollbar-hide">
                <button onClick={() => setAdminTab('analytics')} className={`flex-1 min-w-[70px] py-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all ${adminTab === 'analytics' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg' : 'text-slate-500 hover:text-white'}`}><BarChart3 size={14}/> إحصائيات</button>
                <button onClick={() => setAdminTab('orders')} className={`flex-1 min-w-[70px] py-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all ${adminTab === 'orders' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>الطلبات</button>
                <button onClick={() => setAdminTab('marketing')} className={`flex-1 min-w-[70px] py-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all ${adminTab === 'marketing' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>الإعلانات</button>
                <button onClick={() => setAdminTab('alerts')} className={`flex-1 min-w-[70px] py-3 rounded-xl flex items-center justify-center gap-1.5 text-[10px] font-bold transition-all ${adminTab === 'alerts' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}><BellRing size={14}/> تنبيهات</button>
             </div>

             {/* 🌟 قسم الإحصائيات المطور بالتفاصيل 🌟 */}
             {adminTab === 'analytics' ? (
                <div className="space-y-6 max-w-2xl mx-auto animate-in slide-in-from-right-4 pb-10">
                    
                    {/* بطاقات الإحصائيات الرئيسية */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#112240] p-5 rounded-3xl border border-white/5 shadow-lg flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-black text-emerald-400">{analyticsData.approvedCount}</span>
                            <span className="text-[10px] text-white/50 font-bold mt-1 uppercase tracking-widest">طلبات منجزة</span>
                        </div>
                        <div className="bg-[#112240] p-5 rounded-3xl border border-white/5 shadow-lg flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-black text-amber-400">{analyticsData.pendingCount}</span>
                            <span className="text-[10px] text-white/50 font-bold mt-1 uppercase tracking-widest">قيد الانتظار</span>
                        </div>
                        <div className="bg-gradient-to-br from-[#112240] to-[#0B192C] p-5 rounded-3xl border border-emerald-500/20 shadow-lg flex flex-col items-center justify-center text-center col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                            <span className="text-[10px] text-emerald-400/80 font-bold mb-1">الإيرادات التقديرية (للطلبات المنجزة)</span>
                            <div className="flex gap-6 items-end mt-2 z-10">
                                <div className="text-center">
                                    <span className="text-2xl font-black text-white">{new Intl.NumberFormat('ar-SY').format(analyticsData.totalSYP)}</span>
                                    <span className="text-[10px] text-white/40 block">ل.س</span>
                                </div>
                                <div className="w-px h-8 bg-white/10"></div>
                                <div className="text-center">
                                    <span className="text-2xl font-black text-white">{new Intl.NumberFormat('ar-SY').format(analyticsData.totalUSD)}</span>
                                    <span className="text-[10px] text-white/40 block">دولار ($)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* الرسم البياني الأساسي للأقسام */}
                    <div className="bg-[#112240] p-6 rounded-[2.5rem] border border-white/5 shadow-lg mt-6">
                        <h4 className="text-sm font-black text-white mb-6 text-right border-b border-white/5 pb-3 flex justify-between items-center">
                            <span className="text-white/40 text-[10px]">إجمالي الطلبات: {analyticsData.totalOrders}</span>
                            الحجوزات حسب القسم العام
                        </h4>
                        <div className="space-y-4">
                            {CATEGORIES.map(cat => {
                                const count = analyticsData.categoryCounts[cat.id] || 0;
                                const maxCount = Math.max(...Object.values(analyticsData.categoryCounts), 1);
                                const percentage = (count / maxCount) * 100;
                                return (
                                    <div key={cat.id} className="flex items-center gap-4">
                                        <div className="w-20 text-right text-[10px] font-bold text-white/70 truncate">{cat.title}</div>
                                        <div className="flex-1 h-3 bg-[#0B192C] rounded-full overflow-hidden flex items-center border border-white/5 shadow-inner">
                                            <div className="h-full bg-gradient-to-l from-emerald-400 to-teal-600 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                        <div className="w-8 text-left text-[11px] font-black text-emerald-400">{count}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 🌟 الإحصائيات التفصيلية للأقسام (الميزة الجديدة) 🌟 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {renderMiniStat("السيارات الأكثر طلباً", analyticsData.carStats, Car, "لا يوجد حجوزات سيارات بعد")}
                        {renderMiniStat("وجهات النقل البري", analyticsData.transitDestStats, MapPin, "لا يوجد رحلات نقل بري بعد")}
                        {renderMiniStat("مركبات النقل المطلوبة", analyticsData.transitVehicleStats, CarFront, "لا يوجد رحلات نقل بري بعد")}
                        {renderMiniStat("الفنادق الأكثر إقبالاً", analyticsData.hotelStats, Hotel, "لا يوجد حجوزات فنادق بعد")}
                        {renderMiniStat("الخدمات الإضافية", analyticsData.serviceStats, FileCheck, "لا يوجد طلبات خدمات بعد")}
                    </div>
                </div>

             ) : adminTab === 'orders' ? (
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
                <div className="space-y-6 max-w-xl mx-auto">
                    <form onSubmit={addMarketingEvent} className="bg-[#112240] p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                        <h3 className="text-lg font-black text-white mb-6">إدراج إعلان جديد</h3>
                        <div className="space-y-4">
                           <input name="name" required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500" placeholder="العنوان" />
                           <textarea name="desc" required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white text-right h-24 outline-none focus:border-emerald-500" placeholder="التفاصيل كاملة..."></textarea>
                           
                           {/* 🌟 التقويم لاختيار تاريخ الفعالية 🌟 */}
                           <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-1 text-right">
                                   <label className="text-[9px] text-white/50 font-bold px-1">تاريخ الفعالية</label>
                                   <input type="date" name="date" min={todayDate} required className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-transparent valid:text-white outline-none focus:border-emerald-500" />
                               </div>
                               <div className="space-y-1 text-right">
                                   <label className="text-[9px] text-white/50 font-bold px-1">التكلفة (اختياري)</label>
                                   <input name="price" className="w-full bg-[#0B192C] border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-emerald-500" placeholder="مثال: 50,000 ل.س" />
                               </div>
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
          <div className="space-y-6 pb-10">
            {activeView === 'main' && (
              <div className="space-y-6 max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative rounded-[3rem] overflow-hidden aspect-[16/9] border border-white/5 shadow-2xl">
                   {/* ✅ (النقطة 9) إضافة onError لصورة الشاشة الرئيسية */}
                   <img src="/main-bg.jpg?v=3" onError={(e) => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800'; }} className="w-full h-full object-cover opacity-50" alt="Travel Hero"/>
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent"></div>
                   <div className="absolute top-6 left-6"><HTLogo /></div>
                   
                   <div className="absolute bottom-6 right-6 text-right z-10">
                      <h2 className="text-3xl font-black italic uppercase leading-none mb-1.5 drop-shadow-lg">شهبا <span className="text-emerald-400">Go</span></h2>
                      <div className="inline-block bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg mb-3 shadow-lg">
                          <span className="text-[8px] text-emerald-300 font-medium uppercase tracking-[0.2em]">Hammash & Tatari</span>
                      </div>
                      <p className="text-xs text-white/90 font-bold drop-shadow-md">نصلك أينما كنت، ونأخذك حيثما تريد.</p>
                   </div>
                </div>

                <div onClick={() => !isGuest ? setActiveView('wallet') : setAuthMode('signup')} className="bg-gradient-to-r from-emerald-900/40 to-[#112240] border border-emerald-500/20 p-5 rounded-[2rem] flex items-center gap-4 cursor-pointer shadow-lg hover:border-emerald-500/40 transition-colors">
                   <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shadow-inner"><Star size={24}/></div>
                   <div className="flex-1">
                      <h4 className="text-xs font-black text-emerald-400">انضم لنادي النخبة HT</h4>
                      <p className="text-[9px] text-white/60 mt-1">احجز عبر التطبيق واحصل على نقاط وهدايا.</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   {CATEGORIES.map(cat => (
                     <button key={cat.id} disabled={!cat.active} onClick={() => {
                         setSelectedCategory(cat.id); 
                         setActiveView('list'); 
                         setSelectedHotel(null); 
                         setSelectedCity(null); 
                         setSelectedBusType(null);
                         // تصفير حالة التكلفة المباشرة عند الدخول للقسم
                         if(cat.id === 'transit') setTransitLive({ from: '', to: '', pax: '1', bags: '0', meal: false, internet: false, extra: false });
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
                    {selectedCategory === 'flights' && (
                        <div className="space-y-4 animate-in fade-in">
                            <div className="relative bg-[#112240] w-full h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border border-cyan-500/20 group">
                                <img src="/flight-bg.jpg" alt="حجز طيران" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/80 to-transparent"></div>
                                
                                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center z-10 pb-10">
                                    <div className="w-16 h-16 bg-cyan-500/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-4 border border-cyan-500/30 shadow-inner">
                                        <Plane size={32} className="text-cyan-400 animate-bounce" />
                                    </div>
                                    <h3 className="font-black text-2xl text-white mb-3 drop-shadow-md">حجز طيران</h3>
                                    
                                    <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-4 rounded-2xl mb-6 shadow-lg">
                                        <p className="text-sm text-cyan-300 leading-relaxed font-black drop-shadow-md">
                                            احجز تذكرتك معنا<br/>وخلي توصيلتك
                                        </p>
                                        <p className="text-xs text-white font-bold mt-1">من أو إلى مطار حلب <span className="bg-amber-500 text-black px-2 py-0.5 rounded-md mx-1">مجاناً</span></p>
                                    </div>

                                    <button onClick={openWhatsApp} className="w-full bg-cyan-600 text-white py-4 rounded-full font-black text-sm shadow-[0_8px_30px_rgba(6,182,212,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 border border-cyan-400">
                                        <MessageCircle size={18}/> تواصل معنا للحجز
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 🌟 تعديل قسم عرض النقل البري 🌟 */}
                    {selectedCategory === 'transit' && (
                        <>
                            <div className="relative bg-[#112240] w-full h-[200px] rounded-[3rem] overflow-hidden shadow-xl border border-indigo-500/20 mb-6 group animate-in fade-in">
                                <img 
                                    src="/transit-bg.jpg" 
                                    onError={(e) => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=800'; }} 
                                    alt="النقل البري" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/50 to-transparent"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                    <CarFront size={32} className="text-indigo-400 mb-3 animate-pulse" />
                                    <h3 className="font-black text-2xl text-white mb-2 drop-shadow-md">خدمة النقل البري</h3>
                                    <p className="text-xs text-white/80 font-bold drop-shadow-md">من البيت إلى البيت بأمان وراحة</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {TRANSIT_VEHICLES.map(vehicle => (
                                    <button 
                                        key={vehicle.id} 
                                        onClick={() => {
                                            setTransitLive({ from: '', to: '', pax: '1', bags: '0', meal: false, internet: false, extra: false });
                                            setBookingItem({ title: `طلب حجز - ${vehicle.name}`, vehicleId: vehicle.id, isTransit: true });
                                        }} 
                                        className="bg-[#112240] border border-white/5 p-6 rounded-[2.5rem] flex items-center gap-4 text-right hover:bg-white/5 transition-all shadow-md group"
                                    >
                                        <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-black transition-colors shadow-inner"><vehicle.icon size={26}/></div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-base text-white">{vehicle.name}</h4>
                                            <p className="text-[10px] text-white/50 mt-1">{vehicle.desc}</p>
                                        </div>
                                        <ChevronLeft size={20} className="text-slate-500 group-hover:text-indigo-400 transition-colors"/>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {selectedCategory === 'services' && (
                        <div className="relative bg-[#112240] w-full h-[200px] rounded-[3rem] overflow-hidden shadow-xl border border-slate-500/20 mb-6 group animate-in fade-in">
                            <img src="/services-bg.jpg" onError={(e) => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800'; }} alt="خدمات" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/60 to-transparent"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                <FileCheck size={32} className="text-slate-400 mb-3 animate-pulse" />
                                <h3 className="font-black text-2xl text-white mb-2 drop-shadow-md">خدمات إضافية</h3>
                                <p className="text-xs text-white/80 font-bold drop-shadow-md">إنجاز المعاملات، الفيزا، والبريد بكل أمان</p>
                            </div>
                        </div>
                    )}

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

                    {selectedCategory === 'car' && (
                        <div className="relative bg-[#112240] w-full h-[200px] rounded-[3rem] overflow-hidden shadow-xl border border-emerald-500/20 mb-6 group animate-in fade-in">
                            <img src="/car-bg.jpg" onError={(e) => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800'; }} alt="سيارات" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/60 to-transparent"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                <Car size={32} className="text-emerald-400 mb-3 animate-pulse" />
                                <h3 className="font-black text-2xl text-white mb-2 drop-shadow-md">آجار سيارات</h3>
                                <p className="text-xs text-white/80 font-bold drop-shadow-md">أحدث السيارات وأفضل الأسعار لراحتك</p>
                            </div>
                        </div>
                    )}

                    {selectedCategory === 'car' && carsList.map(car => (
                        <div key={car.id} className="bg-[#112240] rounded-[2.5rem] overflow-hidden p-4 shadow-lg border border-white/5 group hover:border-emerald-500/30 transition-all">
                           <div className="relative">
                               <img src={car.img} className="w-full h-44 object-cover rounded-[2rem] mb-4" alt={car.name}/>
                               <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-emerald-400 px-3 py-1.5 rounded-2xl font-black text-xs border border-emerald-500/30 flex items-center gap-2 shadow-lg">
                                   {car.price} / يوم (بدون سائق)
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

                    {selectedCategory === 'bus' && !selectedBusType && (
                        <div className="relative bg-[#112240] w-full h-[200px] rounded-[3rem] overflow-hidden shadow-xl border border-blue-500/20 mb-6 group animate-in fade-in">
                            <img src="/bus-bg.jpg" onError={(e) => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800'; }} alt="باصات" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/60 to-transparent"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                <Bus size={32} className="text-blue-400 mb-3 animate-bounce" />
                                <h3 className="font-black text-2xl text-white mb-2 drop-shadow-md">خدمات الباصات</h3>
                                <p className="text-xs text-white/80 font-bold drop-shadow-md">عقود مستمرة ورحلات ترفيهية ممتعة</p>
                            </div>
                        </div>
                    )}

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

                    {selectedCategory === 'hotel' && !selectedCity && (
                        <div className="relative bg-[#112240] w-full h-[200px] rounded-[3rem] overflow-hidden shadow-xl border border-amber-500/20 mb-6 group animate-in fade-in">
                            <img src="/hotel-bg.jpg" onError={(e) => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800'; }} alt="فنادق" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/60 to-transparent"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                <Hotel size={32} className="text-amber-400 mb-3 animate-pulse" />
                                <h3 className="font-black text-2xl text-white mb-2 drop-shadow-md">حجوزات الفنادق</h3>
                                <p className="text-xs text-white/80 font-bold drop-shadow-md">أفضل الفنادق لإقامة مريحة ولا تُنسى</p>
                            </div>
                        </div>
                    )}

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

                    {selectedCategory === 'events' && (
                        <div className="relative bg-[#112240] w-full h-[200px] rounded-[3rem] overflow-hidden shadow-xl border border-rose-500/20 mb-6 group animate-in fade-in">
                            <img src="/events-bg.jpg" onError={(e) => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800'; }} alt="فعاليات" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/60 to-transparent"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                <PartyPopper size={32} className="text-rose-400 mb-3 animate-bounce" />
                                <h3 className="font-black text-2xl text-white mb-2 drop-shadow-md">فعاليات ورحلات</h3>
                                <p className="text-xs text-white/80 font-bold drop-shadow-md">اصنع أجمل الذكريات مع فعالياتنا المميزة</p>
                            </div>
                        </div>
                    )}

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
                                  <div className="font-black text-emerald-400 text-sm mb-1">{order.serviceTitle}</div>
                                  <div className="text-[9px] text-white/40 font-bold mb-2">{formatDateTime(order.createdAt)}</div>
                                  
                                  {order.status === 'approved' && (
                                      <button 
                                          onClick={() => setPrintingOrder(order)}
                                          className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg text-[9px] font-black transition-all mt-1"
                                      >
                                          <Download size={12}/> تحميل الفاتورة PDF
                                      </button>
                                  )}

                                  {order.status === 'rejected' && (
                                      <div className="flex flex-col gap-2 mt-3 animate-in fade-in">
                                          <div className="text-[9px] text-rose-400 font-bold bg-rose-500/10 px-2 py-1.5 rounded-lg inline-block border border-rose-500/20">
                                              <span className="font-black">سبب الرفض:</span> {order.rejectionReason || 'عذراً، يرجى مراجعة بيانات الطلب'}
                                          </div>
                                          <button 
                                              onClick={() => {
                                                  setSelectedCategory(order.serviceType);
                                                  if (order.busSubCategory) setSelectedBusType(order.busSubCategory);
                                                  setBookingItem({ ...order, isEditMode: true });
                                              }}
                                              className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 py-2 rounded-xl text-[9px] font-bold w-fit px-4 transition-colors"
                                          >
                                              <RotateCcw size={12}/> تعديل وإعادة الطلب
                                          </button>
                                      </div>
                                  )}
                               </td>
                               <td className="p-4 align-top pt-5"><StatusBadge status={order.status} /></td>
                            </tr>
                          ))}
                          {userOrders.length === 0 && <tr><td colSpan="2" className="p-8 text-center text-white/20 font-bold">لا يوجد طلبات حالياً</td></tr>}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
          </div>
        )}
      </main>

      {bookingItem && (
        <div className="fixed inset-0 bg-black/95 z-[1000] flex items-center justify-center p-4">
           <div className="bg-[#112240] w-full max-w-md p-6 rounded-[3rem] border border-white/10 relative overflow-y-auto max-h-[95vh] shadow-2xl">
              <button onClick={() => {
                  setBookingItem(null); 
                  setHasKidsState('no');
                  setInvoicePreview(null);
                  setAcceptTerms(false);
                  setTransitLive({ from: '', to: '', pax: '1', bags: '0', meal: false, internet: false, extra: false });
              }} className="absolute top-6 left-6 text-white/20 hover:text-rose-500 transition-colors"><X size={20}/></button>
              
              <div className="text-right mb-6">
                 <h3 className="text-xl font-black text-white">{bookingItem?.isEditMode ? 'تعديل الطلب' : 'إكمال بيانات الحجز'}</h3>
                 <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-widest">{bookingItem.name || bookingItem.title || bookingItem.serviceTitle}</p>
              </div>

              {selectedCategory === 'events' && bookingItem?.desc && !invoicePreview && (
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

              <form onSubmit={submitBooking} className="text-right flex flex-col h-full">
                 
                 {!invoicePreview && (
                     <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <input name="name" required defaultValue={bookingItem?.isEditMode ? bookingItem.name : ""} className="w-full bg-[#0B192C] border border-white/5 rounded-2xl p-4 text-xs text-white text-right outline-none focus:border-emerald-500 shadow-inner" placeholder="الاسم الكامل" />
                            <div>
                                <input name="phone" required defaultValue={bookingItem?.isEditMode ? bookingItem.phone : (localStorage.getItem('sh-user-phone') || "")} className={`w-full bg-[#0B192C] border rounded-2xl p-4 text-xs text-left outline-none shadow-inner ${phoneError ? 'border-rose-500 text-rose-400' : 'border-white/5 text-white focus:border-emerald-500'}`} placeholder="09xxxxxx" />
                            </div>
                         </div>
                         {phoneError && <p className="text-[9px] text-rose-400 font-bold bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">{phoneError}</p>}

                         {selectedCategory === 'hotel' && (
                           <div className="space-y-3 p-4 bg-amber-500/5 rounded-3xl border border-amber-500/10">
                              <div className="bg-amber-500/10 p-2 rounded-xl text-amber-400 text-[9px] font-bold text-center flex justify-center items-center gap-1"><Info size={12}/> الاستلام والتسليم الساعة 11 صباحاً</div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                 <div className="space-y-1 text-right">
                                    <label className="text-[9px] text-amber-500/50 mr-2 font-bold">عدد الليالي</label>
                                    <input name="nightCount" type="number" min="1" required defaultValue={bookingItem?.nightCount || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-amber-500 shadow-inner" placeholder="مثال: 3" />
                                 </div>
                                 <div className="space-y-1 text-right">
                                    <label className="text-[9px] text-amber-500/50 mr-2 font-bold">تاريخ البدء</label>
                                    <input name="checkIn" type="date" min={todayDate} required defaultValue={bookingItem?.checkIn || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-amber-500" />
                                 </div>
                              </div>

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

                         {selectedCategory === 'flights' && (
                           <div className="space-y-3 p-4 bg-cyan-500/5 rounded-3xl border border-cyan-500/10">
                              <div className="grid grid-cols-2 gap-3">
                                 <input name="fromAirport" required placeholder="من مطار..." defaultValue={bookingItem?.fromAirport || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-cyan-500" />
                                 <input name="toAirport" required placeholder="إلى مطار..." defaultValue={bookingItem?.toAirport || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-cyan-500" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[9px] text-cyan-500/50 mr-2">تاريخ الرحلة</label>
                                 <input name="flightDate" type="date" min={todayDate} required defaultValue={bookingItem?.flightDate || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-cyan-500" />
                              </div>
                           </div>
                         )}

                         {/* 🌟 تعديلات نموذج النقل البري 🌟 */}
                         {selectedCategory === 'transit' && (
                           <div className="space-y-3 p-4 bg-indigo-500/5 rounded-3xl border border-indigo-500/10">
                              <div className="bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 flex justify-between items-center mb-2">
                                 <span className="text-xs text-indigo-400 font-bold">التكلفة التقديرية الحية:</span>
                                 <span className="text-lg font-black text-white">${calculateLiveTransitPrice()}</span>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                 <div className="space-y-1 text-right">
                                     <label className="text-[9px] text-indigo-400 font-bold">مكان الانطلاق</label>
                                     <select name="fromLocation" required value={transitLive.from} onChange={e => setTransitLive({...transitLive, from: e.target.value})} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-indigo-500 appearance-none">
                                         <option value="" disabled>اختر...</option>
                                         {TRANSIT_LOCATIONS.map(loc => <option key={`from-${loc}`} value={loc}>{loc}</option>)}
                                     </select>
                                 </div>
                                 <div className="space-y-1 text-right">
                                     <label className="text-[9px] text-indigo-400 font-bold">الوجهة</label>
                                     <select name="toLocation" required value={transitLive.to} onChange={e => setTransitLive({...transitLive, to: e.target.value})} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-indigo-500 appearance-none">
                                         <option value="" disabled>اختر...</option>
                                         {TRANSIT_LOCATIONS.map(loc => <option key={`to-${loc}`} value={loc}>{loc}</option>)}
                                     </select>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                 <div className="space-y-1 text-right">
                                    <label className="text-[9px] text-indigo-500/50 mr-2 font-bold">تاريخ الرحلة</label>
                                    <input name="tripDate" type="date" min={todayDate} required defaultValue={bookingItem?.tripDate || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-indigo-500" />
                                 </div>
                                 <div className="space-y-1 text-right">
                                    <label className="text-[9px] text-indigo-500/50 mr-2 font-bold">توقيت الرحلة</label>
                                    <input name="tripTime" type="time" required defaultValue={bookingItem?.tripTime || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-indigo-500" />
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1 text-right">
                                      <label className="text-[9px] text-indigo-500/50 mr-2 font-bold">عدد الركاب</label>
                                      <select name="pax" required value={transitLive.pax} onChange={e => setTransitLive({...transitLive, pax: e.target.value})} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-indigo-500 appearance-none">
                                         {(bookingItem?.vehicleId === 'standard' || bookingItem?.vehicleId === 'suv') ? (
                                             <>
                                                <option value="1">راكب واحد</option>
                                                <option value="2">راكبين (السعر x2)</option>
                                                <option value="full">سيارة كاملة (السعر x3)</option>
                                             </>
                                         ) : bookingItem?.vehicleId === 'van' ? (
                                             [1,2,3,4,5,6,7].map(num => <option key={num} value={num}>{num} راكب (السعر x{num})</option>)
                                         ) : (
                                             [1,2,3,4,5,6,7,8,9,10].map(num => <option key={num} value={num}>{num} راكب (السعر x{num})</option>)
                                         )}
                                      </select>
                                  </div>
                                  <div className="space-y-1 text-right">
                                      <label className="text-[9px] text-indigo-500/50 mr-2 font-bold">عدد الحقائب (+$10 لكل حقيبة)</label>
                                      <select name="bags" required value={transitLive.bags} onChange={e => setTransitLive({...transitLive, bags: e.target.value})} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-indigo-500 appearance-none">
                                         <option value="0">لا يوجد</option>
                                         <option value="1">1</option>
                                         <option value="2">2</option>
                                         <option value="3">3</option>
                                      </select>
                                  </div>
                              </div>

                              <div className="pt-2">
                                 <label className="text-[9px] text-indigo-500/50 font-bold mb-2 block text-right">خدمات إضافية (اختياري)</label>
                                 <div className="grid grid-cols-3 gap-2">
                                    <label className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${transitLive.meal ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-[#0B192C] border-white/10 text-white/50 hover:border-indigo-500/50'}`}>
                                        <input type="checkbox" name="meal" checked={transitLive.meal} onChange={e => setTransitLive({...transitLive, meal: e.target.checked})} className="hidden"/>
                                        <Utensils size={14}/>
                                        <span className="text-[9px] font-black">وجبة (8$)</span>
                                    </label>
                                    <label className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${transitLive.internet ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-[#0B192C] border-white/10 text-white/50 hover:border-indigo-500/50'}`}>
                                        <input type="checkbox" name="internet" checked={transitLive.internet} onChange={e => setTransitLive({...transitLive, internet: e.target.checked})} className="hidden"/>
                                        <Wifi size={14}/>
                                        <span className="text-[9px] font-black">إنترنت (7$)</span>
                                    </label>
                                    <label className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${transitLive.extra ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-[#0B192C] border-white/10 text-white/50 hover:border-indigo-500/50'}`}>
                                        <input type="checkbox" name="extra" checked={transitLive.extra} onChange={e => setTransitLive({...transitLive, extra: e.target.checked})} className="hidden"/>
                                        <MapPin size={14}/>
                                        <span className="text-[9px] font-black text-center leading-tight">تنقلات (12$)</span>
                                    </label>
                                 </div>
                              </div>
                           </div>
                         )}

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
                              <label className="text-[9px] text-slate-400 font-bold text-right block">يرجى كتابة التفاصيل الدقيقة للمعاملة أو الأوراق:</label>
                              <textarea name="serviceDetails" required defaultValue={bookingItem?.serviceDetails || ""} className="w-full bg-[#0B192C] border border-white/10 rounded-xl p-3 text-xs text-white text-right h-24 outline-none focus:border-slate-500" placeholder="تفاصيل الخدمة المطلوبة..."></textarea>
                           </div>
                         )}

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

                         {selectedCategory === 'bus' && selectedBusType === 'leisure' && (
                           <div className="space-y-3 p-4 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                              <div className="grid grid-cols-2 gap-3">
                                 <div className="space-y-1 text-right">
                                   <label className="text-[9px] text-white/30 mr-2">تاريخ الرحلة</label>
                                   <input name="tripDate" type="date" min={todayDate} required defaultValue={bookingItem?.tripDate || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-emerald-500" />
                                 </div>
                                 <div className="space-y-1 text-right">
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

                         {selectedCategory === 'car' && (
                            <div className="space-y-3 p-4 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="space-y-1 text-right">
                                        <label className="text-[9px] text-emerald-500/50 mr-2 font-bold">عدد الأيام (الحد الأدنى 7 أيام)</label>
                                        <input name="durationCount" type="number" min="7" max="180" required defaultValue={bookingItem?.isEditMode ? bookingItem.durationCount : "7"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-emerald-500 shadow-inner" placeholder="أدخل عدد الأيام..." />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                   <div className="space-y-1 text-right">
                                       <label className="text-[9px] text-emerald-500/50 mr-2 font-bold">السائق (+25% تكلفة إضافية)</label>
                                       <select name="driverOption" required defaultValue={bookingItem?.isEditMode ? bookingItem.driverOption : "without_driver"} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-white text-right outline-none focus:border-emerald-500 appearance-none">
                                           <option value="without_driver">بدون سائق</option>
                                           <option value="with_driver">مع سائق (+25%)</option>
                                       </select>
                                   </div>
                                   <div className="space-y-1 text-right">
                                       <label className="text-[9px] text-emerald-500/50 mr-2 font-bold">تاريخ البدء</label>
                                       <input name="startDate" type="date" min={todayDate} required defaultValue={bookingItem?.startDate || ""} className="w-full bg-[#0B192C] border border-white/5 rounded-xl p-3 text-xs text-transparent valid:text-white outline-none focus:border-emerald-500" />
                                   </div>
                                </div>
                            </div>
                         )}

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
                         
                         {selectedCategory === 'car' && (
                             <div className="flex items-center justify-end gap-3 mt-4 bg-emerald-500/5 p-3 rounded-2xl border border-emerald-500/20">
                                 <label className="text-[10px] text-white/80 cursor-pointer font-bold select-none">
                                     قرأت وأوافق على <span onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 underline-offset-4">دفتر شروط التأجير</span>
                                 </label>
                                 <input type="checkbox" required checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="w-5 h-5 accent-emerald-500 cursor-pointer rounded shadow-inner" />
                             </div>
                         )}

                     </div>
                 )}

                 {/* 🌟 شاشة الفاتورة التفصيلية للسيارات 🌟 */}
                 {invoicePreview && selectedCategory === 'car' && (
                     <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-3xl text-right space-y-4 mb-4 mt-2 animate-in fade-in zoom-in-95 shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none"></div>
                          <h4 className="font-black text-emerald-400 border-b border-emerald-500/20 pb-3 mb-3 flex items-center gap-2"><FileText size={18}/> فاتورة تفصيلية للحجز</h4>
                          
                          <div className="space-y-3 relative z-10">
                              <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-white/60 font-bold">السيارة المطلوبة:</span> <span className="font-black">{bookingItem.name}</span></div>
                              <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-white/60 font-bold">مدة الإيجار:</span> <span className="font-black text-amber-400">{invoicePreview.daysCount} أيام</span></div>
                              <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-white/60 font-bold">حالة السائق:</span> <span className="font-black text-amber-400">{invoicePreview.isWithDriver ? 'مع سائق (+25%)' : 'بدون سائق'}</span></div>
                              <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-white/60 font-bold">تاريخ الاستلام:</span> <span className="font-black" dir="ltr">{invoicePreview.startDate}</span></div>
                              <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-white/60 font-bold">طريقة الدفع:</span> <span className="font-black bg-white/10 px-2 py-0.5 rounded-md">{paymentMethod === 'office' ? 'نقداً في المكتب' : 'شام كاش'}</span></div>
                          </div>
                          
                          <div className="border-t-2 border-dashed border-emerald-500/30 pt-4 mt-4 flex justify-between items-center relative z-10">
                               <div className="flex flex-col">
                                   <span className="text-[10px] font-black text-emerald-400/80 mb-1">المبلغ الإجمالي للاعتماد:</span>
                                   <span className="text-[8px] text-white/40">*شامل جميع الإضافات والشروط المذكورة</span>
                               </div>
                               <span className="text-xl font-black text-white bg-black/30 px-3 py-2 rounded-xl border border-white/5 shadow-inner">
                                   {new Intl.NumberFormat('ar-SY', { style: 'currency', currency: 'SYP' }).format(invoicePreview.totalPrice)}
                               </span>
                          </div>
                     </div>
                 )}

                 {/* 🌟 شاشة الفاتورة التفصيلية للنقل البري 🌟 */}
                 {invoicePreview && selectedCategory === 'transit' && (
                     <div className="bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-3xl text-right space-y-4 mb-4 mt-2 animate-in fade-in zoom-in-95 shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none"></div>
                          <h4 className="font-black text-indigo-400 border-b border-indigo-500/20 pb-3 mb-3 flex items-center gap-2"><FileText size={18}/> فاتورة رحلة النقل البري</h4>
                          
                          <div className="space-y-3 relative z-10">
                              <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-white/60 font-bold">خط الرحلة:</span> <span className="font-black">{invoicePreview.fromLocation} <ChevronLeft size={10} className="inline"/> {invoicePreview.toLocation}</span></div>
                              <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-white/60 font-bold">المركبة والركاب:</span> <span className="font-black text-amber-400">{bookingItem.title.replace('طلب حجز - ', '')} ({invoicePreview.pax === 'full' ? 'سيارة كاملة' : invoicePreview.pax + ' راكب'})</span></div>
                              <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-white/60 font-bold">موعد الرحلة:</span> <span className="font-black">{invoicePreview.tripDate} | {invoicePreview.tripTime}</span></div>
                              
                              <div className="pt-2">
                                  <span className="text-[10px] text-white/50 font-bold mb-2 block text-right">الخدمات الإضافية:</span>
                                  <div className="flex flex-wrap gap-2 justify-end">
                                      {invoicePreview.bags > 0 && <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-lg text-[9px] font-bold border border-indigo-500/30">حقائب: {invoicePreview.bags}</span>}
                                      {invoicePreview.meal && <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-lg text-[9px] font-bold border border-indigo-500/30">وجبة طعام</span>}
                                      {invoicePreview.internet && <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-lg text-[9px] font-bold border border-indigo-500/30">إنترنت Wi-Fi</span>}
                                      {invoicePreview.extra && <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-lg text-[9px] font-bold border border-indigo-500/30">تنقلات إضافية</span>}
                                      {invoicePreview.bags === '0' && !invoicePreview.meal && !invoicePreview.internet && !invoicePreview.extra && <span className="text-[10px] text-white/30">لا يوجد إضافات</span>}
                                  </div>
                              </div>
                          </div>
                          
                          <div className="border-t-2 border-dashed border-indigo-500/30 pt-4 mt-4 flex justify-between items-center relative z-10">
                               <div className="flex flex-col">
                                   <span className="text-[10px] font-black text-indigo-400/80 mb-1">المبلغ الإجمالي النهائي:</span>
                                   <span className="text-[8px] text-white/40">*يُدفع بالدولار أو ما يعادله</span>
                               </div>
                               <span className="text-xl font-black text-white bg-black/30 px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                                   ${invoicePreview.totalPrice}
                               </span>
                          </div>
                     </div>
                 )}

                 <div className="mt-auto pt-4 flex flex-col gap-2">
                     <button 
                         type="submit" 
                         disabled={(selectedCategory === 'car' && !invoicePreview && !acceptTerms)} 
                         className={`w-full py-4 rounded-2xl font-black text-xs text-white shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedCategory === 'transit' ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-emerald-500 text-black shadow-emerald-500/20'}`}>
                         {invoicePreview ? 'تأكيد الحجز النهائي' : (bookingItem?.isEditMode ? 'حفظ التعديلات وإعادة الإرسال' : 'متابعة وإصدار الفاتورة')}
                     </button>
                     
                     {invoicePreview && (
                         <button 
                             type="button" 
                             onClick={() => setInvoicePreview(null)} 
                             className="w-full bg-white/5 text-white/60 py-3.5 rounded-2xl font-black text-[11px] hover:bg-white/10 hover:text-white transition-all border border-white/10 active:scale-95">
                             رجوع لتعديل البيانات
                         </button>
                     )}
                 </div>
              </form>
           </div>
        </div>
      )}

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
                  <p className="text-[10px] text-rose-600 font-bold mb-8 bg-rose-50 p-2 rounded-lg cursor-pointer hover:bg-rose-100" onClick={() => {setShowSuccessCard(false); setAuthMode('signup');}}>
                      💡 فاتتك 25 نقطة! أنشئ حسابك الآن لتبدأ بجمع النقاط.
                  </p>
              )}
              <button onClick={() => {setShowSuccessCard(false); setActiveView('main');}} className="w-full bg-black text-white py-4 rounded-3xl font-black text-xs shadow-xl active:scale-95 transition-all uppercase">العودة للرئيسية</button>
           </div>
        </div>
      )}

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
        .animate-marquee { animation: marquee 11s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        @keyframes marquee { 0% { transform: translateX(-100%); } 100% { transform: translateX(100vw); } }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: left 0.75rem center; background-size: 1rem; }
        /* Scrollbar styles for the terms modal */
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background-color: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}
