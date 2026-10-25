import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  increment 
} from 'firebase/firestore';
import { 
  Compass, 
  Anchor, 
  Calendar, 
  Clock, 
  User, 
  Heart, 
  LogOut, 
  Plus, 
  CheckCircle, 
  Send, 
  Scissors, 
  Sparkles, 
  Eye, 
  Lock, 
  Menu, 
  X, 
  Maximize2,
  Filter,
  Search,
  RotateCcw,
  Check,
  Flame,
  MessageCircle,
  Edit3,
  ImageIcon,
  AlertCircle,
  MapPin,
  Instagram,
  ShieldCheck,
  Droplet,
  Sun,
  Award,
  Mic,
  Square,
  Trash2,
  FileText,
  Camera,
  Phone,
  CheckSquare,
  XCircle,
  CalendarDays,
  Star,
  Bell
} from 'lucide-react';

// ==========================================
// FIREBASE INITIALIZATION
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyBusfJB_C__lpyyyQO3-s3Isprd7MgUwcU",
  authDomain: "nautilus-studio.firebaseapp.com",
  projectId: "nautilus-studio",
  storageBucket: "nautilus-studio.firebasestorage.app",
  messagingSenderId: "758814669659",
  appId: "1:758814669659:web:628ccd4f645141d48a387e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'nautilus-studio-app';

const PUBLIC_DATA_PATH = ['artifacts', appId, 'public', 'data'];

const INSTAGRAM_STUDIO_URL = "https://www.instagram.com/nautilus.studiio";
const ADDRESS_TEXT = "R. Prof. Max Menezes, 159 - Jardim Pontal, Ilhéus - BA, 45654-155";
const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_TEXT)}`;
const GOOGLE_REVIEW_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Nautilus Studio Ilheus BA")}`;

const INITIAL_PROFESSIONALS = [
  {
    id: 'prof-1',
    name: 'Victor "Kraken" Silva',
    role: 'Tatuador Neotradicional & Blackwork',
    category: 'tatuagem',
    phone: '5573999998888',
    avatar: 'https://images.unsplash.com/photo-1562159278-1253a58da141?auto=format&fit=crop&q=80&w=400',
    bio: 'Especialista em peças de grande porte, blackwork pesado e elementos marítimos.',
    instagram: '@victorkraken.tattoo',
    instagramUrl: 'https://www.instagram.com/victorkraken.tattoo',
    email: 'victor@nautilus.com'
  },
  {
    id: 'prof-2',
    name: 'Camila "Siren" Rossi',
    role: 'Designer de Sobrancelhas & Micropigmentação',
    category: 'sobrancelhas',
    phone: '5573988887777',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Especialista em visagismo do olhar, nano blending e restauração de sobrancelhas.',
    instagram: '@camilarossi.brows',
    instagramUrl: 'https://www.instagram.com/camilarossi.brows',
    email: 'camila@nautilus.com'
  },
  {
    id: 'prof-3',
    name: 'Lucas "Anchor" Almeida',
    role: 'Barbeiro Visagista & Mestre Navalheiro',
    category: 'barbearia',
    phone: '5573977776666',
    avatar: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=400',
    bio: 'Cortes clássicos, barbeados tradicionais com toalha quente e tratamento de barba.',
    instagram: '@lucasanchor.barber',
    instagramUrl: 'url?id=7',
    email: 'lucas@nautilus.com'
  }
];

const INITIAL_PORTFOLIO = [
  {
    id: 'port-1',
    title: 'Escafandro Neotradicional',
    category: 'tatuagem',
    style: 'Neotradicional Náutico',
    profId: 'prof-1',
    profName: 'Victor "Kraken" Silva',
    imageUrl: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=800',
    likes: 142,
    comments: [
      { id: 'c1', author: 'Matheus', text: 'Sombra perfeita, parabéns!', date: '22/10/2026' }
    ]
  },
  {
    id: 'port-2',
    title: 'Micropigmentação Nano Blending',
    category: 'sobrancelhas',
    style: 'Micropigmentação',
    profId: 'prof-2',
    profName: 'Camila "Siren" Rossi',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
    likes: 89,
    comments: []
  },
  {
    id: 'port-3',
    title: 'Barba Clássica e Fade Modelado',
    category: 'barbearia',
    style: 'Corte & Barba Visagista',
    profId: 'prof-3',
    profName: 'Lucas "Anchor" Almeida',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800',
    likes: 115,
    comments: []
  },
  {
    id: 'port-4',
    title: 'Caravela Blackwork Sombreada',
    category: 'tatuagem',
    style: 'Blackwork / Darkwork',
    profId: 'prof-1',
    profName: 'Victor "Kraken" Silva',
    imageUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=800',
    likes: 198,
    comments: []
  }
];

const TATTOO_STYLES = [
  'Todos os Estilos',
  'Blackwork / Darkwork',
  'Neotradicional Náutico',
  'Realismo P&B',
  'Fineline / Traço Fino',
  'Old School / Traditional',
  'Geométrico / Tribal'
];

const BODY_LOCATIONS = [
  'Antebraço',
  'Braço Completo (Fechamento)',
  'Coxa / Perna',
  'Panturrilha',
  'Peito',
  'Costas',
  'Pescoço / Mão'
];

const DivingHelmetIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 10 C30 10 18 25 18 45 C18 55 22 63 28 68 L28 85 L72 85 L72 68 C78 63 82 55 82 45 C82 25 70 10 50 10 Z M50 25 C62 25 70 33 70 45 C70 57 62 65 50 65 C38 65 30 57 30 45 C30 33 38 25 50 25 Z" opacity="0.3"/>
    <circle cx="50" cy="45" r="15" fill="none" stroke="currentColor" strokeWidth="6"/>
    <line x1="38" y1="45" x2="62" y2="45" stroke="currentColor" strokeWidth="4"/>
    <line x1="50" y1="33" x2="50" y2="57" stroke="currentColor" strokeWidth="4"/>
    <rect x="42" y="14" width="16" height="8" rx="2" fill="currentColor"/>
    <circle cx="22" cy="45" r="4" fill="currentColor"/>
    <circle cx="78" cy="45" r="4" fill="currentColor"/>
    <path d="M25 80 L75 80 L70 92 L30 92 Z" fill="currentColor"/>
  </svg>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState(INITIAL_PORTFOLIO);
  const [professionals, setProfessionals] = useState(INITIAL_PROFESSIONALS);
  const [appointments, setAppointments] = useState([]);
  const [customSchedules, setCustomSchedules] = useState({});

  // Filtros Avançados
  const [activeCategory, setActiveCategory] = useState('todos');
  const [selectedStyle, setSelectedStyle] = useState('Todos os Estilos');
  const [selectedProfFilter, setSelectedProfFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Modais
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAftercareOpen, setIsAftercareOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 
  const [authError, setAuthError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '', role: 'Tatuador', category: 'tatuagem', phone: '', instagram: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [likedPosts, setLikedPosts] = useState({});
  const [notification, setNotification] = useState(null);

  // Ampliar Imagem
  const [selectedWork, setSelectedWork] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  // Navegação de Abas
  const [activeTab, setActiveTab] = useState('main'); 

  // Funil de Agendamento + Descrição/Áudio
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: '',
    profId: '',
    tattooStyle: '',
    tattooSizeCm: 12,
    bodyLocation: '',
    tattooIdeaText: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    clientName: '',
    clientPhone: ''
  });

  // Gravador de Áudio
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Painel do Prestador
  const [currentProvider, setCurrentProvider] = useState(null);
  const [appointmentFilter, setAppointmentFilter] = useState('todos');
  const [profileForm, setProfileForm] = useState({
    name: '',
    role: '',
    bio: '',
    instagram: '',
    instagramUrl: '',
    phone: '',
    avatar: ''
  });

  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);

  const [newPost, setNewPost] = useState({
    title: '',
    category: 'tatuagem',
    imageUrl: ''
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [scheduleInput, setScheduleInput] = useState({
    time: '14:00',
    status: 'disponivel'
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (usr) => setUser(usr));
    return () => unsubscribe();
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    if (!user) return;

    const portfolioCol = collection(db, ...PUBLIC_DATA_PATH, 'portfolio');
    const unsubPortfolio = onSnapshot(portfolioCol, (snapshot) => {
      if (snapshot.empty) {
        INITIAL_PORTFOLIO.forEach(async (item) => {
          await setDoc(doc(db, ...PUBLIC_DATA_PATH, 'portfolio', item.id), item);
        });
        setPortfolio(INITIAL_PORTFOLIO);
      } else {
        const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setPortfolio(items);

        if (selectedWork) {
          const updatedSelected = items.find(i => i.id === selectedWork.id);
          if (updatedSelected) setSelectedWork(updatedSelected);
        }
      }
    });

    const profsCol = collection(db, ...PUBLIC_DATA_PATH, 'professionals');
    const unsubProfs = onSnapshot(profsCol, (snapshot) => {
      if (snapshot.empty) {
        INITIAL_PROFESSIONALS.forEach(async (p) => {
          await setDoc(doc(db, ...PUBLIC_DATA_PATH, 'professionals', p.id), p);
        });
        setProfessionals(INITIAL_PROFESSIONALS);
      } else {
        const items = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        setProfessionals(items);
      }
    });

    const appointmentsCol = collection(db, ...PUBLIC_DATA_PATH, 'appointments');
    const unsubAppointments = onSnapshot(appointmentsCol, (snapshot) => {
      setAppointments(snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
    });

    const scheduleCol = collection(db, ...PUBLIC_DATA_PATH, 'custom_schedules');
    const unsubSchedule = onSnapshot(scheduleCol, (snapshot) => {
      const data = {};
      snapshot.docs.forEach(docSnap => {
        data[docSnap.id] = docSnap.data().items || [];
      });
      setCustomSchedules(data);
    });

    return () => {
      unsubPortfolio();
      unsubProfs();
      unsubAppointments();
      unsubSchedule();
    };
  }, [user, selectedWork]);

  useEffect(() => {
    if (user && !user.isAnonymous) {
      const matched = professionals.find(p => p.uid === user.uid || p.email === user.email || p.id === user.uid);
      if (matched) {
        setCurrentProvider(matched);
        setProfileForm(matched);
      }
    } else if (currentProvider) {
      const matched = professionals.find(p => p.id === currentProvider.id);
      if (matched) {
        setCurrentProvider(matched);
      }
    }
  }, [user, professionals]);

  // Gravação de Áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      showToast('Permissão de microfone negada ou indisponível.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const handleLikePost = async (id) => {
    if (likedPosts[id] || !user) return;
    try {
      const postRef = doc(db, ...PUBLIC_DATA_PATH, 'portfolio', id);
      await updateDoc(postRef, { likes: increment(1) });
      setLikedPosts(prev => ({ ...prev, [id]: true }));
      showToast('Obrigado pela curtida!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText || !selectedWork || !user) return;

    const newComment = {
      id: Date.now().toString(),
      author: commentAuthor || 'Cliente Anônimo',
      text: newCommentText,
      date: new Date().toLocaleDateString('pt-BR')
    };

    try {
      const currentComments = selectedWork.comments || [];
      const updatedComments = [newComment, ...currentComments];

      const postRef = doc(db, ...PUBLIC_DATA_PATH, 'portfolio', selectedWork.id);
      await updateDoc(postRef, { comments: updatedComments });

      setNewCommentText('');
      showToast('Comentário publicado!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
        showToast('Login realizado com sucesso!');
      } else {
        const res = await createUserWithEmailAndPassword(auth, loginForm.email, loginForm.password);
        const handleInsta = loginForm.instagram || '@nautilus.studiio';
        const cleanInsta = handleInsta.replace('@', '');
        const newProf = {
          id: res.user.uid,
          uid: res.user.uid,
          name: loginForm.name || 'Novo Prestador',
          role: loginForm.role || 'Artista Nautilus',
          category: loginForm.category || 'tatuagem',
          phone: loginForm.phone || '5573999998888',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
          bio: 'Membro da equipe Nautilus Studio.',
          instagram: handleInsta.startsWith('@') ? handleInsta : `@${handleInsta}`,
          instagramUrl: `https://www.instagram.com/${cleanInsta}`,
          email: loginForm.email
        };
        await setDoc(doc(db, ...PUBLIC_DATA_PATH, 'professionals', res.user.uid), newProf);
        showToast('Perfil criado com sucesso!');
      }
      setIsLoginOpen(false);
      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
      setAuthError('Falha no acesso. Verifique seus dados.');
    }
  };

  const handleQuickDemoLogin = (prof) => {
    setCurrentProvider(prof);
    setProfileForm(prof);
    setActiveTab('dashboard');
    setIsLoginOpen(false);
    showToast(`Acessando como ${prof.name}`);
  };

  const handleLogout = async () => {
    await signOut(auth);
    await signInAnonymously(auth);
    setCurrentProvider(null);
    setActiveTab('main');
    showToast('Sessão encerrada');
  };

  // Seleção de Nova Foto de Perfil
  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileForm(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // SALVAR PERFIL COM BIOGRAFIA DELIMITADA
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!currentProvider) return;

    try {
      const handleInsta = profileForm.instagram || '@nautilus.studiio';
      const cleanInsta = handleInsta.replace('@', '');

      const updatedProf = {
        ...currentProvider,
        name: profileForm.name || currentProvider.name,
        phone: profileForm.phone || currentProvider.phone,
        bio: (profileForm.bio || currentProvider.bio || '').slice(0, 120),
        avatar: profileForm.avatar || currentProvider.avatar,
        instagram: handleInsta.startsWith('@') ? handleInsta : `@${handleInsta}`,
        instagramUrl: `https://www.instagram.com/${cleanInsta}`
      };

      await setDoc(doc(db, ...PUBLIC_DATA_PATH, 'professionals', currentProvider.id), updatedProf, { merge: true });

      setCurrentProvider(updatedProf);
      setProfessionals(prev => prev.map(p => p.id === currentProvider.id ? updatedProf : p));
      setSelectedAvatarFile(null);

      showToast('Perfil e Biografia atualizados com sucesso!');
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar as informações do perfil.');
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const appRef = doc(db, ...PUBLIC_DATA_PATH, 'appointments', appointmentId);
      await updateDoc(appRef, { status: newStatus });
      showToast(`Agendamento atualizado para ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error(err);
      showToast('Erro ao atualizar agendamento.');
    }
  };

  // ENVIO DE LEMBRETE DE VÉSPERA (24H ANTES)
  const handleSendReminder24h = (app) => {
    const cleanPhone = (app.clientPhone || '').replace(/\D/g, '');
    if (!cleanPhone) {
      showToast('Cliente não possui WhatsApp cadastrado.');
      return;
    }

    let text = `Olá *${app.clientName}*! Passando para lembrar do seu atendimento amanhã no *Nautilus Studio* com o(a) *${app.profName}*.\n\n`;
    text += `📅 *Data:* ${app.date}\n⏰ *Horário:* ${app.time}\n⚓ *Serviço:* ${app.service.toUpperCase()}\n📍 *Endereço:* ${ADDRESS_TEXT}\n\n`;
    text += `💡 *Recomendações importantes para a sua sessão:*\n`;
    text += `1. Venha bem alimentado(a) e hidratado(a).\n`;
    text += `2. Evite o consumo de bebidas alcoólicas nas 24h anteriores.\n`;
    text += `3. Use roupas confortáveis e adequadas ao local da tattoo/procedimento.\n\n`;
    text += `Qualquer dúvida ou imprevisto, responda aqui. Até amanhã! ⚓🔥`;

    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // SOLICITAÇÃO DE AVALIAÇÃO GOOGLE REVIEWS
  const handleRequestGoogleReview = (app) => {
    const cleanPhone = (app.clientPhone || '').replace(/\D/g, '');
    if (!cleanPhone) {
      showToast('Cliente não possui WhatsApp cadastrado.');
      return;
    }

    let text = `Olá *${app.clientName}*! Foi um prazer atender você aqui no *Nautilus Studio*! ⚓✨\n\n`;
    text += `Sua opinião é extremamente importante para o nosso trabalho. Poderia dedicar 1 minutinho para nos deixar uma avaliação 5 estrelas no Google?\n\n`;
    text += `⭐ *Deixe sua avaliação aqui:* ${GOOGLE_REVIEW_LINK}\n\n`;
    text += `Muito obrigado pela confiança e até a próxima sessão! 🙏🔥`;

    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAddCustomSlot = async () => {
    if (!currentProvider || !bookingData.date || !scheduleInput.time) return;
    const key = `${currentProvider.id}_${bookingData.date}`;
    const existingSlots = customSchedules[key] || [];
    const filtered = existingSlots.filter(s => s.time !== scheduleInput.time);
    const updated = [...filtered, { time: scheduleInput.time, status: scheduleInput.status }];

    try {
      await setDoc(doc(db, ...PUBLIC_DATA_PATH, 'custom_schedules', key), {
        profId: currentProvider.id,
        date: bookingData.date,
        items: updated
      });
      showToast(`Horário ${scheduleInput.time} atualizado!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setNewPost(prev => ({ ...prev, imageUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleAddPortfolioItem = async (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.imageUrl || !currentProvider || !user) return;

    try {
      const newItem = {
        title: newPost.title,
        category: newPost.category,
        profId: currentProvider.id,
        profName: currentProvider.name,
        imageUrl: newPost.imageUrl,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, ...PUBLIC_DATA_PATH, 'portfolio'), newItem);
      setNewPost({ title: '', category: currentProvider.category || 'tatuagem', imageUrl: '' });
      setSelectedImageFile(null);
      showToast('Obra publicada no portfólio live!');
    } catch (err) {
      showToast('Erro ao publicar obra.');
    }
  };

  const handleCompleteBooking = async () => {
    if (!user) return;
    const selectedProf = professionals.find(p => p.id === bookingData.profId) || professionals[0];
    const appointmentRecord = { 
      ...bookingData, 
      profName: selectedProf.name, 
      hasAudio: !!audioUrl, 
      status: 'pendente',
      createdAt: new Date().toISOString() 
    };

    try {
      await addDoc(collection(db, ...PUBLIC_DATA_PATH, 'appointments'), appointmentRecord);
      let text = `Olá *${selectedProf.name}*! Agendamento feito pelo site do *Nautilus Studio*.\n\n`;
      text += `👤 *Cliente:* ${bookingData.clientName}\n📱 *Contato:* ${bookingData.clientPhone}\n⚓ *Serviço:* ${bookingData.service.toUpperCase()}\n`;
      if (bookingData.service === 'tatuagem') {
        text += `🎨 *Estilo:* ${bookingData.tattooStyle}\n📍 *Local:* ${bookingData.bodyLocation}\n`;
        if (bookingData.tattooIdeaText) {
          text += `📝 *Descrição do Projeto:* "${bookingData.tattooIdeaText}"\n`;
        }
        if (audioUrl) {
          text += `🎙️ *Áudio Explicativo:* Gravei um áudio detalhando a ideia e vou enviar aqui na conversa!\n`;
        }
      }
      text += `📅 *Data:* ${bookingData.date}\n⏰ *Horário:* ${bookingData.time}\n`;

      window.open(`https://wa.me/${selectedProf.phone}?text=${encodeURIComponent(text)}`, '_blank');
      setBookingStep(1);
    } catch (err) {
      showToast('Erro ao gravar agendamento.');
    }
  };

  const resetFilters = () => {
    setActiveCategory('todos');
    setSelectedStyle('Todos os Estilos');
    setSelectedProfFilter('todos');
    setSearchQuery('');
  };

  const filteredPortfolio = portfolio.filter(item => {
    const matchCategory = activeCategory === 'todos' || item.category === activeCategory;
    const matchStyle = selectedStyle === 'Todos os Estilos' || item.style === selectedStyle;
    const matchProf = selectedProfFilter === 'todos' || item.profId === selectedProfFilter;
    const matchSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.profName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchStyle && matchProf && matchSearch;
  });

  const currentSlotsKey = `${bookingData.profId}_${bookingData.date}`;
  const availableCustomSlots = customSchedules[currentSlotsKey] || [
    { time: '10:00', status: 'disponivel' },
    { time: '14:00', status: 'tatuando' },
    { time: '16:30', status: 'disponivel' },
    { time: '19:00', status: 'disponivel' }
  ];

  const myAppointments = currentProvider 
    ? appointments.filter(app => app.profId === currentProvider.id || app.profName === currentProvider.name)
    : [];

  const filteredMyAppointments = myAppointments.filter(app => {
    if (appointmentFilter === 'todos') return true;
    return (app.status || 'pendente') === appointmentFilter;
  });

  return (
    <div className="min-h-screen bg-[#0B0D0E] text-gray-100 font-sans selection:bg-[#C5A059] selection:text-black">
      
      {/* TOAST COM GLOW E ANIMAÇÃO */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(197,160,89,0.3)] border flex items-center gap-3 bg-[#121518]/95 border-[#C5A059]/60 text-[#C5A059] backdrop-blur-xl transition-all duration-300 animate-bounce">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{notification}</span>
        </div>
      )}

      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#121518]/80 backdrop-blur-xl border-b border-[#1E2328]/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <button onClick={() => setActiveTab('main')} className="flex items-center gap-3 text-left group">
            <div className="p-2 rounded-xl bg-[#161A1D] border border-[#C5A059]/30 text-[#C5A059] group-hover:border-[#C5A059] group-hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all duration-300">
              <DivingHelmetIcon className="w-8 h-8" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-wider text-white uppercase flex items-center gap-1 group-hover:text-[#C5A059] transition-colors duration-300">
                NAUTILUS <span className="text-[#C5A059]">STUDIO</span>
              </span>
              <span className="text-[10px] tracking-widest text-gray-400 block uppercase -mt-1">
                Ilhéus - BA
              </span>
            </div>
          </button>

          {/* Links de Navegação */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#portfolio" onClick={() => setActiveTab('main')} className="hover:text-[#C5A059] transition-colors duration-300">Portfólio</a>
            <a href="#profissionais" onClick={() => setActiveTab('main')} className="hover:text-[#C5A059] transition-colors duration-300">Equipe</a>
            <button onClick={() => setIsAftercareOpen(true)} className="flex items-center gap-1.5 text-gray-300 hover:text-[#C5A059] transition-colors duration-300">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" /> Guia pós-Tattoo
            </button>
            <a href={INSTAGRAM_STUDIO_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-300 hover:text-[#C5A059] transition-colors duration-300">
              <Instagram className="w-4 h-4 text-[#C5A059]" /> Instagram
            </a>
          </nav>

          {/* Botões da Direita */}
          <div className="hidden md:flex items-center gap-4">
            {currentProvider ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab(activeTab === 'dashboard' ? 'main' : 'dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                    activeTab === 'dashboard'
                      ? 'bg-[#C5A059] text-black font-bold shadow-[0_0_15px_rgba(197,160,89,0.4)]'
                      : 'text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/40 hover:bg-[#C5A059]/20 hover:shadow-[0_0_15px_rgba(197,160,89,0.2)]'
                  }`}
                >
                  <User className="w-4 h-4" /> {activeTab === 'dashboard' ? 'Ver Site' : `Painel (${currentProvider.name.split(' ')[0]})`}
                </button>
                <button onClick={handleLogout} title="Sair" className="p-2 text-gray-400 hover:text-rose-400 transition-colors duration-300">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)} 
                className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-300 hover:text-white px-3.5 py-2 border border-transparent hover:border-[#1E2328] hover:bg-[#161A1D] rounded-xl transition-all duration-300"
              >
                <Lock className="w-3.5 h-3.5 text-[#C5A059]" /> Área da Equipe
              </button>
            )}

            <a 
              href="#agendamento" 
              onClick={() => setActiveTab('main')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#C5A059] via-[#E2C382] to-[#9E7C3B] text-black hover:brightness-110 transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.25)] hover:shadow-[0_0_25px_rgba(197,160,89,0.4)] hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" /> Agendar Horário
            </a>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-300">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MAIN VIEW */}
      {activeTab === 'main' && (
        <main>
          {/* Hero */}
          <section className="relative min-h-[50vh] flex items-center justify-center border-b border-[#1E2328] text-center px-4 py-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#121518]/80 via-[#0B0D0E]/90 to-[#0B0D0E] z-10" />
            
            <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
              <div className="p-5 rounded-full bg-gradient-to-b from-[#1E2328] to-[#121518] border-2 border-[#C5A059]/40 text-[#C5A059] mb-6 shadow-[0_0_30px_rgba(197,160,89,0.2)] animate-pulse">
                <DivingHelmetIcon className="w-16 h-16" />
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-white tracking-tight">
                Arte Gravada na Pele, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E2C382] to-[#B87333] drop-shadow-sm">
                  Estilo Esculpido nos Detalhes
                </span>
              </h1>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a 
                  href={MAPS_SEARCH_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161A1D]/90 border border-[#C5A059]/30 hover:border-[#C5A059] text-xs text-gray-300 hover:text-white transition-all duration-300 shadow-lg"
                >
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>{ADDRESS_TEXT}</span>
                </a>

                <button 
                  onClick={() => setIsAftercareOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161A1D]/90 border border-[#C5A059]/30 hover:border-[#C5A059] text-xs text-[#C5A059] hover:text-white transition-all duration-300 shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cuidados pós-Sessão (Aftercare)</span>
                </button>
              </div>
            </div>
          </section>

          {/* PORTFÓLIO */}
          <section id="portfolio" className="py-16 px-4 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-2 flex items-center justify-center gap-2">
                <Filter className="w-4 h-4" /> Galeria & Filtros Inteligentes
              </h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">Portfólio em Tempo Real</h3>
              <p className="text-xs text-gray-400 mt-2">Clique na imagem para ampliar, curtir e comentar!</p>
            </div>

            {/* Painel de Filtros */}
            <div className="bg-[#161A1D]/80 border border-[#1E2328] hover:border-[#C5A059]/30 rounded-2xl p-6 mb-10 shadow-2xl transition-all duration-300 space-y-6 backdrop-blur-md">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar obra pelo título ou artista..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#121518] border border-[#1E2328] rounded-xl pl-11 pr-4 py-3 text-xs text-white outline-none focus:border-[#C5A059] focus:shadow-[0_0_15px_rgba(197,160,89,0.2)] transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-400 mb-2">Categoria de Serviço</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'todos', label: 'Todos os Trabalhos' },
                    { id: 'tatuagem', label: 'Tatuagens' },
                    { id: 'barbearia', label: 'Barbearia' },
                    { id: 'sobrancelhas', label: 'Sobrancelhas' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-300 border ${
                        activeCategory === cat.id 
                          ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.3)]' 
                          : 'bg-[#121518] text-gray-400 border-[#1E2328] hover:border-[#C5A059]/40 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1E2328]">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-400 mb-2">Estilo de Tatuagem</label>
                  <select
                    value={selectedStyle}
                    onChange={e => setSelectedStyle(e.target.value)}
                    className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-3 text-xs text-gray-200 outline-none focus:border-[#C5A059] transition-all duration-300"
                  >
                    {TATTOO_STYLES.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-400 mb-2">Artista Responsável</label>
                  <select
                    value={selectedProfFilter}
                    onChange={e => setSelectedProfFilter(e.target.value)}
                    className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-3 text-xs text-gray-200 outline-none focus:border-[#C5A059] transition-all duration-300"
                  >
                    <option value="todos">Todos os Artistas</option>
                    {professionals.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-gray-400">
                <span>Exibindo <strong className="text-[#C5A059]">{filteredPortfolio.length}</strong> obra(s)</span>
                {(activeCategory !== 'todos' || selectedStyle !== 'Todos os Estilos' || selectedProfFilter !== 'todos' || searchQuery) && (
                  <button onClick={resetFilters} className="flex items-center gap-1 text-[#C5A059] font-bold hover:underline transition-all duration-300">
                    <RotateCcw className="w-3.5 h-3.5" /> Limpar Filtros
                  </button>
                )}
              </div>
            </div>

            {/* Grid do Portfólio */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolio.map(item => (
                <div 
                  key={item.id} 
                  className="group bg-[#161A1D] border border-[#1E2328] rounded-2xl overflow-hidden hover:border-[#C5A059]/60 hover:shadow-[0_0_25px_rgba(197,160,89,0.2)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div 
                    onClick={() => setSelectedWork(item)}
                    className="relative aspect-[4/3] overflow-hidden bg-[#0B0D0E]"
                  >
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-bold text-xs uppercase backdrop-blur-xs">
                      <Maximize2 className="w-5 h-5 text-[#C5A059]" /> Ampliar Foto
                    </div>
                  </div>

                  <div className="p-5 flex items-center justify-between gap-4">
                    <div onClick={() => setSelectedWork(item)} className="flex-1">
                      <h4 className="font-bold text-white text-base group-hover:text-[#C5A059] transition-colors duration-300">{item.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#C5A059]" /> {item.profName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button onClick={(e) => { e.stopPropagation(); handleLikePost(item.id); }} className="flex items-center gap-1 text-xs text-gray-400 hover:text-rose-400 transition-colors duration-300">
                        <Heart className={`w-4 h-4 ${likedPosts[item.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{item.likes || 0}</span>
                      </button>

                      <button onClick={() => setSelectedWork(item)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#C5A059] transition-colors duration-300">
                        <MessageCircle className="w-4 h-4" />
                        <span>{item.comments?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* EQUIPE / ESPECIALISTAS */}
          <section id="profissionais" className="py-20 bg-[#121518]/50 border-y border-[#1E2328]/80">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-2 flex items-center justify-center gap-2">
                  <Compass className="w-4 h-4" /> Corpo Artístico
                </h2>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">Equipe de Especialistas</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {professionals.map(prof => (
                  <div key={prof.id} className="bg-[#161A1D] border border-[#1E2328] rounded-2xl p-6 flex flex-col items-center text-center relative hover:border-[#C5A059]/60 hover:shadow-[0_0_25px_rgba(197,160,89,0.2)] hover:-translate-y-1.5 transition-all duration-300">
                    <div className="relative w-28 h-28 mb-4 rounded-full p-1 bg-gradient-to-b from-[#C5A059] to-[#1E2328] shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                      <img src={prof.avatar} alt={prof.name} className="w-full h-full object-cover rounded-full" />
                    </div>

                    <h4 className="text-xl font-bold text-white mb-1">{prof.name}</h4>
                    <p className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider mb-2">{prof.role}</p>

                    <a 
                      href={prof.instagramUrl || INSTAGRAM_STUDIO_URL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#C5A059] transition-colors mb-4 bg-[#121518] px-3 py-1 rounded-full border border-[#1E2328]"
                    >
                      <Instagram className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{prof.instagram || '@nautilus.studiio'}</span>
                    </a>

                    <p className="text-xs text-gray-400 leading-relaxed mb-6 flex-1 min-h-[40px] italic">"{prof.bio}"</p>

                    <button 
                      onClick={() => { 
                        setBookingData(prev => ({ ...prev, profId: prof.id, service: prof.category })); 
                        setBookingStep(2); 
                        window.location.hash = '#agendamento'; 
                      }} 
                      className="w-full py-2.5 rounded-xl bg-[#121518] border border-[#1E2328] hover:border-[#C5A059] hover:bg-[#C5A059]/10 text-xs font-bold uppercase text-[#C5A059] transition-all duration-300"
                    >
                      Agendar com {prof.name.split(' ')[0]} →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AGENDAMENTO INTERATIVO */}
          <section id="agendamento" className="py-20 px-4 max-w-5xl mx-auto">
            <div className="bg-[#161A1D] border border-[#1E2328] hover:border-[#C5A059]/40 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden transition-all duration-300">
              
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold uppercase tracking-widest border border-[#C5A059]/20">
                  Consulta & Agendamento
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase mt-4 tracking-tight">Monte seu Atendimento</h2>
              </div>

              {/* Stepper Progress Indicator */}
              <div className="flex items-center justify-between max-w-2xl mx-auto mb-12 relative">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#1E2328] -z-0" />
                {[1, 2, 3, 4, 5].map(step => (
                  <div 
                    key={step} 
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      bookingStep === step 
                        ? 'bg-[#C5A059] text-black ring-4 ring-[#C5A059]/20 shadow-[0_0_15px_rgba(197,160,89,0.4)]' 
                        : bookingStep > step 
                        ? 'bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]' 
                        : 'bg-[#121518] text-gray-600 border border-[#1E2328]'
                    }`}
                  >
                    {bookingStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                ))}
              </div>

              {/* Passo 1: Serviço */}
              {bookingStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white text-center mb-6">Passo 1: Qual serviço você procura?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'tatuagem', title: 'Tatuagem Autoral', desc: 'Projetos exclusivos e coberturas', icon: Sparkles },
                      { id: 'barbearia', title: 'Barbearia & Corte', desc: 'Cortes visagistas tradicionais', icon: Scissors },
                      { id: 'sobrancelhas', title: 'Design de Sobrancelhas', desc: 'Visagismo e micropigmentação', icon: Eye }
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => setBookingData(prev => ({ ...prev, service: s.id }))}
                        className={`p-6 rounded-2xl border text-left transition-all duration-300 ${
                          bookingData.service === s.id ? 'bg-[#1E2328] border-[#C5A059] text-white shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-[#121518] border-[#1E2328] text-gray-400 hover:border-[#C5A059]/40'
                        }`}
                      >
                        <h4 className="font-bold text-white text-base mb-1">{s.title}</h4>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      disabled={!bookingData.service}
                      onClick={() => setBookingStep(2)}
                      className="px-6 py-3 rounded-xl font-bold uppercase text-xs bg-[#C5A059] text-black hover:brightness-110 disabled:opacity-40 transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                    >
                      Próximo Passo →
                    </button>
                  </div>
                </div>
              )}

              {/* Passo 2: Profissional */}
              {bookingStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white text-center mb-6">Passo 2: Escolha o Profissional</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {professionals
                      .filter(p => !bookingData.service || p.category === bookingData.service)
                      .map(prof => (
                        <button
                          key={prof.id}
                          onClick={() => setBookingData(prev => ({ ...prev, profId: prof.id }))}
                          className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all duration-300 ${
                            bookingData.profId === prof.id ? 'bg-[#1E2328] border-[#C5A059] text-white shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-[#121518] border-[#1E2328] text-gray-400 hover:border-[#C5A059]/40'
                          }`}
                        >
                          <img src={prof.avatar} alt={prof.name} className="w-14 h-14 rounded-full object-cover border border-[#C5A059]" />
                          <div>
                            <h4 className="font-bold text-white text-sm">{prof.name}</h4>
                            <p className="text-xs text-[#C5A059]">{prof.role}</p>
                          </div>
                        </button>
                      ))}
                  </div>

                  <div className="flex justify-between pt-6">
                    <button onClick={() => setBookingStep(1)} className="px-5 py-2.5 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors">Voltar</button>
                    <button disabled={!bookingData.profId} onClick={() => setBookingStep(bookingData.service === 'tatuagem' ? 3 : 4)} className="px-6 py-3 rounded-xl font-bold uppercase text-xs bg-[#C5A059] text-black disabled:opacity-40 transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.2)]">Próximo Passo →</button>
                  </div>
                </div>
              )}

              {/* Passo 3: Detalhes Tatuagem + Descrição / Áudio */}
              {bookingStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white text-center mb-6">Passo 3: Detalhes da Tatuagem & Ideia</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-300 mb-2">Estilo Preferido</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {TATTOO_STYLES.filter(s => s !== 'Todos os Estilos').map(style => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => setBookingData(prev => ({ ...prev, tattooStyle: style }))}
                            className={`p-3 text-xs font-medium rounded-xl border text-center transition-all duration-300 ${
                              bookingData.tattooStyle === style ? 'bg-[#C5A059] text-black font-bold shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-[#121518] text-gray-400 border-[#1E2328] hover:text-white'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-300 mb-2">Local do Corpo</label>
                      <select
                        value={bookingData.bodyLocation}
                        onChange={e => setBookingData(prev => ({ ...prev, bodyLocation: e.target.value }))}
                        className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-3 text-sm text-gray-200 outline-none focus:border-[#C5A059] transition-all duration-300"
                      >
                        <option value="">Selecione o local...</option>
                        {BODY_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>

                    {/* TEXTO LIVRE DA IDEIA */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-300 mb-2 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#C5A059]" /> Como você imagina a sua tatuagem? (Texto)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Descreva aqui elementos que gostaria, frases, significados ou referências visuais que tem em mente..."
                        value={bookingData.tattooIdeaText}
                        onChange={e => setBookingData(prev => ({ ...prev, tattooIdeaText: e.target.value }))}
                        className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-3 text-xs text-gray-200 outline-none focus:border-[#C5A059] transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* GRAVADOR DE ÁUDIO */}
                    <div className="pt-2 border-t border-[#1E2328]">
                      <label className="block text-xs font-bold uppercase text-gray-300 mb-2 flex items-center gap-1.5">
                        <Mic className="w-4 h-4 text-[#C5A059]" /> Prefere explicar por áudio?
                      </label>

                      <div className="bg-[#121518] border border-[#1E2328] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {!audioUrl ? (
                          <div className="flex items-center gap-3 w-full justify-between">
                            <span className="text-xs text-gray-400">
                              {isRecording ? `Gravação em andamento... (${recordingTime}s)` : 'Grave um áudio de até 1 minuto explicando a ideia.'}
                            </span>
                            {isRecording ? (
                              <button
                                type="button"
                                onClick={stopRecording}
                                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 animate-pulse transition-all duration-300"
                              >
                                <Square className="w-4 h-4" /> Parar
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={startRecording}
                                className="px-4 py-2 rounded-xl bg-[#C5A059] hover:brightness-110 text-black font-bold text-xs flex items-center gap-2 transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                              >
                                <Mic className="w-4 h-4" /> Gravar Áudio
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full gap-3">
                            <div className="flex items-center gap-2 flex-1">
                              <audio controls src={audioUrl} className="h-9 w-full max-w-xs rounded-lg" />
                            </div>
                            <button
                              type="button"
                              onClick={deleteRecording}
                              className="p-2 rounded-xl bg-rose-950/50 border border-rose-900 text-rose-400 hover:text-rose-300 transition-colors"
                              title="Excluir áudio"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button onClick={() => setBookingStep(2)} className="px-5 py-2.5 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors">Voltar</button>
                    <button disabled={!bookingData.tattooStyle || !bookingData.bodyLocation} onClick={() => setBookingStep(4)} className="px-6 py-3 rounded-xl font-bold uppercase text-xs bg-[#C5A059] text-black disabled:opacity-40 transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.2)]">Próximo Passo →</button>
                  </div>
                </div>
              )}

              {/* Passo 4: Data & Horário */}
              {bookingStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white text-center mb-6">Passo 4: Agenda & Status do Artista</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-300 mb-2">Escolha a Data</label>
                      <input 
                        type="date"
                        value={bookingData.date}
                        onChange={e => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-3 text-sm text-gray-200 outline-none focus:border-[#C5A059] transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-300 mb-2">Horários do Artista nesta Data</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableCustomSlots.map(slot => {
                          const isTatuando = slot.status === 'tatuando';
                          return (
                            <button
                              key={slot.time}
                              type="button"
                              disabled={isTatuando}
                              onClick={() => setBookingData(prev => ({ ...prev, time: slot.time }))}
                              className={`p-3 text-xs font-bold rounded-xl border flex items-center justify-between transition-all duration-300 ${
                                isTatuando
                                  ? 'bg-rose-950/30 border-rose-900/50 text-rose-400 opacity-60 cursor-not-allowed'
                                  : bookingData.time === slot.time
                                  ? 'bg-[#C5A059] text-black border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.2)]'
                                  : 'bg-[#121518] text-gray-300 border-[#1E2328] hover:border-[#C5A059]/40'
                              }`}
                            >
                              <span>{slot.time}</span>
                              {isTatuando ? (
                                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-rose-400">
                                  <Flame className="w-3 h-3 fill-rose-500" /> Tatuando
                                </span>
                              ) : (
                                <span className="text-[10px] uppercase font-bold text-emerald-400">Livre</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1E2328] grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Seu Nome Completo</label>
                      <input type="text" placeholder="Ex: Gabriel Souza" value={bookingData.clientName} onChange={e => setBookingData(prev => ({ ...prev, clientName: e.target.value }))} className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-3 text-sm text-gray-200 outline-none focus:border-[#C5A059] transition-all duration-300" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Seu WhatsApp</label>
                      <input type="tel" placeholder="Ex: (73) 99999-9999" value={bookingData.clientPhone} onChange={e => setBookingData(prev => ({ ...prev, clientPhone: e.target.value }))} className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-3 text-sm text-gray-200 outline-none focus:border-[#C5A059] transition-all duration-300" />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button onClick={() => setBookingStep(bookingData.service === 'tatuagem' ? 3 : 2)} className="px-5 py-2.5 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors">Voltar</button>
                    <button disabled={!bookingData.date || !bookingData.time || !bookingData.clientName} onClick={() => setBookingStep(5)} className="px-6 py-3 rounded-xl font-bold uppercase text-xs bg-[#C5A059] text-black disabled:opacity-40 transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.2)]">Resumo Final →</button>
                  </div>
                </div>
              )}

              {/* Passo 5: Resumo e WhatsApp */}
              {bookingStep === 5 && (
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 bg-[#C5A059]/20 text-[#C5A059] rounded-full flex items-center justify-center mx-auto border border-[#C5A059]/40 shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight">Resumo da Consulta</h3>
                  <div className="bg-[#121518] border border-[#1E2328] rounded-2xl p-6 text-left max-w-md mx-auto text-xs space-y-3 shadow-xl">
                    <p><span className="text-gray-500 font-bold uppercase">Cliente:</span> <span className="text-white">{bookingData.clientName}</span></p>
                    <p><span className="text-gray-500 font-bold uppercase">Serviço:</span> <span className="text-[#C5A059] font-bold uppercase">{bookingData.service}</span></p>
                    {bookingData.service === 'tatuagem' && (
                      <>
                        <p><span className="text-gray-500 font-bold uppercase">Estilo:</span> <span className="text-white">{bookingData.tattooStyle}</span></p>
                        <p><span className="text-gray-500 font-bold uppercase">Local:</span> <span className="text-white">{bookingData.bodyLocation}</span></p>
                        {bookingData.tattooIdeaText && (
                          <p><span className="text-gray-500 font-bold uppercase">Descrição:</span> <span className="text-gray-300 italic">"{bookingData.tattooIdeaText}"</span></p>
                        )}
                        {audioUrl && (
                          <p><span className="text-gray-500 font-bold uppercase">Áudio Anexado:</span> <span className="text-emerald-400 font-bold">Sim (Gravado)</span></p>
                        )}
                      </>
                    )}
                    <p><span className="text-gray-500 font-bold uppercase">Data & Horário:</span> <span className="text-white">{bookingData.date} às {bookingData.time}</span></p>
                    <p><span className="text-gray-500 font-bold uppercase">Localização:</span> <span className="text-[#C5A059]">Ilhéus - BA</span></p>
                  </div>

                  <div className="pt-4 flex justify-center gap-4">
                    <button onClick={() => setBookingStep(4)} className="px-5 py-3 text-xs font-bold uppercase text-gray-400 hover:text-white transition-colors">Ajustar</button>
                    <button onClick={handleCompleteBooking} className="px-8 py-4 rounded-xl font-bold uppercase text-xs bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-300 flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                      <Send className="w-4 h-4" /> Enviar para o WhatsApp
                    </button>
                  </div>
                </div>
              )}

            </div>
          </section>
        </main>
      )}

      {/* DASHBOARD DO PRESTADOR COM LEMBRETE 24H E GOOGLE REVIEWS */}
      {activeTab === 'dashboard' && currentProvider && (
        <section className="py-12 bg-[#0B0D0E] min-h-[85vh]">
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            <div className="bg-[#161A1D] border border-[#C5A059]/40 rounded-2xl p-6 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-4">
                <img src={currentProvider.avatar} alt={currentProvider.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#C5A059]" />
                <div>
                  <h3 className="text-xl font-bold text-white">{currentProvider.name}</h3>
                  <p className="text-xs text-gray-400">{currentProvider.role}</p>
                </div>
              </div>

              <button onClick={() => setActiveTab('main')} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-300 bg-[#121518] border border-[#1E2328]">
                Ver Site Público
              </button>
            </div>

            {/* SEÇÃO DA AGENDA DETALHADA DE ATENDIMENTOS */}
            <div className="bg-[#161A1D] border border-[#1E2328] rounded-2xl p-6 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2328]">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-[#C5A059]" /> Minha Agenda de Atendimentos Detalhada
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">Acompanhe agendamentos, envie lembretes de véspera e peça avaliações no Google.</p>
                </div>

                {/* Filtros de Status */}
                <div className="flex items-center gap-2">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'pendente', label: 'Pendentes' },
                    { id: 'confirmado', label: 'Confirmados' },
                    { id: 'concluido', label: 'Concluídos' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setAppointmentFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border ${
                        appointmentFilter === f.id
                          ? 'bg-[#C5A059] text-black border-[#C5A059]'
                          : 'bg-[#121518] text-gray-400 border-[#1E2328] hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Atendimentos */}
              {filteredMyAppointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs italic">
                  Nenhum agendamento encontrado para este filtro.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMyAppointments.map(app => {
                    const status = app.status || 'pendente';
                    const cleanPhone = (app.clientPhone || '').replace(/\D/g, '');

                    return (
                      <div key={app.id} className="bg-[#121518] border border-[#1E2328] hover:border-[#C5A059]/40 rounded-xl p-5 space-y-4 flex flex-col justify-between transition-all duration-300">
                        <div>
                          <div className="flex items-center justify-between border-b border-[#1E2328] pb-3 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-[#C5A059]" />
                              <span className="font-bold text-white text-sm">{app.clientName || 'Cliente sem nome'}</span>
                            </div>
                            
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              status === 'confirmado'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                                : status === 'concluido'
                                ? 'bg-blue-950/80 text-blue-400 border border-blue-800'
                                : status === 'cancelado'
                                ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                                : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                            }`}>
                              {status}
                            </span>
                          </div>

                          <div className="space-y-2 text-xs text-gray-300">
                            <p className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> 
                              <span><strong>Data:</strong> {app.date} às {app.time}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> 
                              <span><strong>Serviço:</strong> <span className="uppercase text-[#C5A059] font-bold">{app.service}</span></span>
                            </p>
                            {app.tattooStyle && (
                              <p className="pl-5 text-gray-400"><strong>Estilo:</strong> {app.tattooStyle}</p>
                            )}
                            {app.bodyLocation && (
                              <p className="pl-5 text-gray-400"><strong>Local:</strong> {app.bodyLocation}</p>
                            )}
                            {app.tattooIdeaText && (
                              <div className="mt-2 p-3 bg-[#0B0D0E] rounded-lg border border-[#1E2328] text-gray-300 italic text-[11px]">
                                "{app.tattooIdeaText}"
                              </div>
                            )}
                          </div>
                        </div>

                        {/* AÇÕES DO PRESTADOR: WHATSAPP, LEMBRETE 24H E GOOGLE REVIEWS */}
                        <div className="pt-3 border-t border-[#1E2328] space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/55${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" /> Conversar
                              </a>
                            )}

                            {/* BOTÃO LEMBRETE DE VÉSPERA (24H) */}
                            <button
                              onClick={() => handleSendReminder24h(app)}
                              className="py-2 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                              title="Enviar Lembrete 24h antes com recomendações"
                            >
                              <Bell className="w-3.5 h-3.5" /> Lembrete 24h
                            </button>
                          </div>

                          {/* SOLICITAR AVALIAÇÃO DO GOOGLE MAPS (EXIBIDO QUANDO CONCLUÍDO OU CONFIRMADO) */}
                          {status === 'concluido' && (
                            <button
                              onClick={() => handleRequestGoogleReview(app)}
                              className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400" /> Pedir Avaliação no Google
                            </button>
                          )}

                          <div className="flex gap-2 pt-1">
                            {status !== 'confirmado' && (
                              <button
                                onClick={() => handleUpdateAppointmentStatus(app.id, 'confirmado')}
                                className="flex-1 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-400 hover:bg-emerald-900 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                              >
                                <CheckSquare className="w-3 h-3" /> Confirmar
                              </button>
                            )}
                            {status !== 'concluido' && (
                              <button
                                onClick={() => handleUpdateAppointmentStatus(app.id, 'concluido')}
                                className="flex-1 py-1.5 bg-blue-950 border border-blue-800 text-blue-400 hover:bg-blue-900 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                              >
                                <Check className="w-3 h-3" /> Concluir
                              </button>
                            )}
                            {status !== 'cancelado' && (
                              <button
                                onClick={() => handleUpdateAppointmentStatus(app.id, 'cancelado')}
                                className="p-1.5 bg-rose-950 border border-rose-800 text-rose-400 hover:bg-rose-900 rounded-lg transition-colors"
                                title="Cancelar Agendamento"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* EDITAR PERFIL, FOTO DE AVATAR & BIOGRAFIA */}
              <div className="bg-[#161A1D] border border-[#1E2328] rounded-2xl p-6 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#C5A059]" /> Editar Perfil
                </h4>

                <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                  {/* ALTERAR FOTO DE PERFIL */}
                  <div>
                    <label className="block uppercase text-gray-400 mb-1">Foto de Perfil (Avatar)</label>
                    <label className="cursor-pointer bg-[#121518] border border-[#1E2328] hover:border-[#C5A059]/40 rounded-xl p-3 flex items-center justify-center gap-2 text-center transition-colors">
                      <Camera className="w-4 h-4 text-[#C5A059]" />
                      <span className="text-gray-300">{selectedAvatarFile ? selectedAvatarFile.name : 'Importar Nova Foto'}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
                    </label>
                  </div>

                  <div>
                    <label className="block uppercase text-gray-400 mb-1">Nome Profissional</label>
                    <input type="text" value={profileForm.name} onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-2.5 text-white outline-none focus:border-[#C5A059]" />
                  </div>

                  {/* CAMPO DE BIOGRAFIA COM LIMITE DE 120 CARACTERES */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block uppercase text-gray-400">Descrição / Biografia</label>
                      <span className={`text-[10px] font-bold ${(profileForm.bio || '').length >= 110 ? 'text-rose-400' : 'text-gray-500'}`}>
                        {(profileForm.bio || '').length}/120
                      </span>
                    </div>
                    <textarea 
                      rows={3} 
                      maxLength={120} 
                      placeholder="Ex: Especialista em peças de grande porte, blackwork pesado e elementos marítimos." 
                      value={profileForm.bio || ''} 
                      onChange={e => setProfileForm(prev => ({ ...prev, bio: e.target.value }))} 
                      className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-2.5 text-white outline-none focus:border-[#C5A059] resize-none" 
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-gray-400 mb-1">Seu Instagram (ex: @seu.user)</label>
                    <input type="text" value={profileForm.instagram} onChange={e => setProfileForm(prev => ({ ...prev, instagram: e.target.value }))} className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-2.5 text-white outline-none focus:border-[#C5A059]" />
                  </div>
                  <div>
                    <label className="block uppercase text-gray-400 mb-1">WhatsApp de Atendimento</label>
                    <input type="text" value={profileForm.phone} onChange={e => setProfileForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-2.5 text-white outline-none focus:border-[#C5A059]" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-[#C5A059] text-black font-bold uppercase rounded-xl hover:brightness-110 transition-all">Salvar Perfil</button>
                </form>
              </div>

              {/* HORÁRIOS MANUAIS DA AGENDA */}
              <div className="bg-[#161A1D] border border-[#1E2328] rounded-2xl p-6 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C5A059]" /> Bloquear/Liberar Horários
                </h4>

                <div className="space-y-3">
                  <input type="date" value={bookingData.date} onChange={e => setBookingData(prev => ({ ...prev, date: e.target.value }))} className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#C5A059]" />
                  
                  <div className="flex gap-2">
                    <input type="time" value={scheduleInput.time} onChange={e => setScheduleInput(prev => ({ ...prev, time: e.target.value }))} className="bg-[#121518] border border-[#1E2328] rounded-xl p-2 text-xs text-white outline-none focus:border-[#C5A059]" />
                    <select value={scheduleInput.status} onChange={e => setScheduleInput(prev => ({ ...prev, status: e.target.value }))} className="bg-[#121518] border border-[#1E2328] rounded-xl p-2 text-xs text-white outline-none flex-1 focus:border-[#C5A059]">
                      <option value="disponivel">🟢 Livre</option>
                      <option value="tatuando">🔴 Tatuando</option>
                    </select>
                  </div>

                  <button onClick={handleAddCustomSlot} className="w-full py-2 bg-[#C5A059] text-black font-bold text-xs uppercase rounded-xl hover:brightness-110 transition-all">Adicionar Status</button>
                </div>
              </div>

              {/* PUBLICAR NO PORTFÓLIO */}
              <div className="bg-[#161A1D] border border-[#1E2328] rounded-2xl p-6 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#C5A059]" /> Publicar no Portfólio
                </h4>

                <form onSubmit={handleAddPortfolioItem} className="space-y-3 text-xs">
                  <input type="text" placeholder="Título da Obra" required value={newPost.title} onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-2.5 text-white outline-none focus:border-[#C5A059]" />
                  <label className="cursor-pointer bg-[#121518] border border-[#1E2328] rounded-xl p-3 flex flex-col items-center justify-center text-center hover:border-[#C5A059]/40 transition-colors">
                    <ImageIcon className="w-5 h-5 text-[#C5A059] mb-1" />
                    <span>{selectedImageFile ? selectedImageFile.name : 'Importar Foto da Obra'}</span>
                    <input type="file" accept="image/*" required onChange={handleImageSelect} className="hidden" />
                  </label>
                  <button type="submit" className="w-full py-2.5 bg-[#C5A059] text-black font-bold uppercase rounded-xl hover:brightness-110 transition-all">Salvar Obra</button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODAL CUIDADOS PÓS-SESSÃO (AFTERCARE) */}
      {isAftercareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#161A1D]/95 border border-[#C5A059]/40 rounded-3xl p-6 md:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <button onClick={() => setIsAftercareOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-[#C5A059]/10 text-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#C5A059]/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-white uppercase tracking-tight">Guia & Cuidados Pós-Sessão</h3>
              <p className="text-xs text-gray-400 mt-1">Siga o passo a passo para garantir uma cicatrização perfeita e cores vivas.</p>
            </div>

            {/* Fases do Aftercare */}
            <div className="space-y-6">
              <div className="bg-[#121518] border border-[#1E2328] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm">
                  <Droplet className="w-4 h-4" />
                  <span>Fase 1: Dias 1 a 3 (Higienização Inicial)</span>
                </div>
                <ul className="text-xs text-gray-300 space-y-1.5 pl-6 list-disc">
                  <li>Remova o filme protetor após o tempo indicado pelo seu artista (de 2 a 4 horas).</li>
                  <li>Lave suavemente a área com água morna/fria e <strong>sabão neutro líquido</strong>.</li>
                  <li>Seque com papel toalha dando leveis toques (nunca esfregue a toalha de banho).</li>
                  <li>Aplique uma camada muito fina da pomada cicatrizante recomendada.</li>
                </ul>
              </div>

              <div className="bg-[#121518] border border-[#1E2328] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Fase 2: Dias 4 a 7 (Descascamento Natural)</span>
                </div>
                <ul className="text-xs text-gray-300 space-y-1.5 pl-6 list-disc">
                  <li>Mantenha a região limpa e aplique pomada/hidratante suave 2 a 3 vezes ao dia.</li>
                  <li><strong>NÃO puxe casquinhas</strong> nem coce a pele para não remover o pigmento.</li>
                  <li>Evite usar roupas muito apertadas ou sintéticas cobrindo a tatuagem.</li>
                </ul>
              </div>

              <div className="bg-[#121518] border border-[#1E2328] rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#C5A059] font-bold text-sm">
                  <Sun className="w-4 h-4" />
                  <span>Fase 3: Semanas 2 a 4 (Proteção Continuada)</span>
                </div>
                <ul className="text-xs text-gray-300 space-y-1.5 pl-6 list-disc">
                  <li><strong>Proibido:</strong> Praia, piscina, sauna ou banho de imersão nos primeiros 20 dias.</li>
                  <li>Evite exposição solar direta na área tatuada enquanto estiver cicatrizando.</li>
                  <li>Após o 20º dia, use sempre <strong>protetor solar FPS 50+</strong> na tattoo para manter as cores vibrantes.</li>
                </ul>
              </div>

              {/* Produtos Recomendados */}
              <div className="pt-4 border-t border-[#1E2328]">
                <h4 className="text-xs font-bold uppercase text-[#C5A059] mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Produtos Recomendados
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#121518] rounded-xl border border-[#1E2328]">
                    <span className="font-bold text-white block">1. Sabão Neutro</span>
                    <span className="text-gray-400 text-[11px]">Glicerinado ou antisséptico suave.</span>
                  </div>
                  <div className="p-3 bg-[#121518] rounded-xl border border-[#1E2328]">
                    <span className="font-bold text-white block">2. Pomada Cicatrizante</span>
                    <span className="text-gray-400 text-[11px]">Bepantol Derma, Cicaplast ou específicas.</span>
                  </div>
                  <div className="p-3 bg-[#121518] rounded-xl border border-[#1E2328]">
                    <span className="font-bold text-white block">3. Protetor Solar</span>
                    <span className="text-gray-400 text-[11px]">FPS 50+ (após 20 dias de sessão).</span>
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => setIsAftercareOpen(false)} className="w-full mt-6 py-3 bg-[#C5A059] text-black font-bold uppercase text-xs rounded-xl">Entendido</button>
          </div>
        </div>
      )}

      {/* MODAL LIGHTBOX */}
      {selectedWork && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#161A1D]/90 border border-[#C5A059]/50 rounded-3xl max-w-4xl w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col md:flex-row max-h-[90vh]">
            <button onClick={() => setSelectedWork(null)} className="absolute top-4 right-4 z-10 p-2 bg-[#121518]/80 text-gray-300 hover:text-white rounded-full border border-[#1E2328] transition-colors duration-300">
              <X className="w-5 h-5" />
            </button>

            <div className="md:w-3/5 bg-black flex items-center justify-center p-2 relative overflow-hidden">
              <img src={selectedWork.imageUrl} alt={selectedWork.title} className="max-h-[75vh] w-full object-contain rounded-xl" />
            </div>

            <div className="md:w-2/5 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#1E2328] bg-[#161A1D]">
              <div>
                <h3 className="text-xl font-bold text-white uppercase mt-2 tracking-tight">{selectedWork.title}</h3>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#C5A059]" /> {selectedWork.profName}
                </p>

                <div className="my-4 pt-3 border-t border-[#1E2328]">
                  <button onClick={() => handleLikePost(selectedWork.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#121518] text-gray-300 hover:text-rose-400 border border-[#1E2328] transition-colors duration-300">
                    <Heart className={`w-4 h-4 ${likedPosts[selectedWork.id] ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{selectedWork.likes || 0} Curtidas</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 my-4">
                  <h4 className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-[#C5A059]" /> Comentários ({selectedWork.comments?.length || 0})
                  </h4>

                  {!selectedWork.comments || selectedWork.comments.length === 0 ? (
                    <p className="text-xs text-gray-500 italic py-4">Seja o primeiro a comentar!</p>
                  ) : (
                    selectedWork.comments.map(c => (
                      <div key={c.id} className="p-3 rounded-xl bg-[#121518] border border-[#1E2328] text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-[#C5A059]">
                          <span>{c.author}</span>
                          <span className="text-[10px] text-gray-500">{c.date}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <form onSubmit={handleAddComment} className="space-y-2 pt-3 border-t border-[#1E2328]">
                <input type="text" placeholder="Seu nome (opcional)" value={commentAuthor} onChange={e => setCommentAuthor(e.target.value)} className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#C5A059] transition-all duration-300" />
                <div className="flex gap-2">
                  <input type="text" required placeholder="Escreva um comentário..." value={newCommentText} onChange={e => setNewCommentText(e.target.value)} className="flex-1 bg-[#121518] border border-[#1E2328] rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#C5A059] transition-all duration-300" />
                  <button type="submit" className="px-4 py-2.5 bg-[#C5A059] text-black font-bold text-xs rounded-xl hover:brightness-110 transition-all duration-300"><Send className="w-3.5 h-3.5" /></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE LOGIN */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#161A1D]/95 border border-[#C5A059]/40 rounded-3xl p-8 max-w-md w-full relative shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Acesso da Equipe</h3>
            </div>

            {authError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">E-mail Profissional</label>
                <input type="email" required value={loginForm.email} onChange={e => setLoginForm(prev => ({ ...prev, email: e.target.value }))} className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-3 text-sm text-gray-200 outline-none focus:border-[#C5A059] transition-all duration-300" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Senha</label>
                <input type="password" required value={loginForm.password} onChange={e => setLoginForm(prev => ({ ...prev, password: e.target.value }))} className="w-full bg-[#121518] border border-[#1E2328] rounded-xl p-3 text-sm text-gray-200 outline-none focus:border-[#C5A059] transition-all duration-300" />
              </div>

              <button type="submit" className="w-full py-3.5 rounded-xl font-bold text-xs uppercase bg-[#C5A059] text-black hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(197,160,89,0.2)]">Entrar no Painel</button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#1E2328] text-center">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-3">Acesso Rápido de Demonstração:</p>
              <div className="flex flex-col gap-2">
                {professionals.map(p => (
                  <button key={p.id} type="button" onClick={() => handleQuickDemoLogin(p)} className="w-full p-2.5 rounded-xl bg-[#121518] border border-[#1E2328] hover:border-[#C5A059] text-xs text-gray-300 flex justify-between transition-all duration-300">
                    <span>{p.name}</span>
                    <span className="text-[10px] text-[#C5A059] font-bold uppercase">{p.category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#0B0D0E] border-t border-[#1E2328] py-12 px-4 text-center text-xs text-gray-400 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[#C5A059] font-medium">
          <a 
            href={MAPS_SEARCH_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:underline"
          >
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{ADDRESS_TEXT}</span>
          </a>

          <button 
            onClick={() => setIsAftercareOpen(true)}
            className="flex items-center gap-2 text-gray-300 hover:text-[#C5A059]"
          >
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#C5A059]" />
            <span>Guia de Cuidados</span>
          </button>

          <a 
            href={INSTAGRAM_STUDIO_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:underline"
          >
            <Instagram className="w-4 h-4 shrink-0" />
            <span>@nautilus.studiio</span>
          </a>
        </div>

        <p className="text-gray-600">NAUTILUS STUDIO — Tattoo & Body Art Studio — Ilhéus, Bahia</p>
      </footer>

    </div>
  );
}