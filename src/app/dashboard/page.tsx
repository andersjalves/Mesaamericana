'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import LanguageSelector, { Language } from '@/components/LanguageSelector';

// Estrutura mapeada das mesas do banco Supabase
interface PropFirm {
  id: string;
  name: string;
  discount: string;
  code: string;
  drawdownType: string;
  platform: string;
  link: string;
  featured?: boolean;
}

interface Indicator {
  id: string;
  title: string;
  description: string;
  isRestricted: boolean;
  downloadUrl?: string;
}

// Dicionário de Traduções para o Dashboard
const TRANSLATIONS = {
  pt: {
    loading: 'Carregando área VIP...',
    title: 'Painel do Trader',
    subtitle: 'Acesso exclusivo para gerenciar suas Prop Firms salvas, indicadores e promoções ativas.',
    liveRoomTitle: 'Sala ao Vivo',
    liveRoomBadge: 'EM BREVE',
    liveRoomDesc: 'Acompanhe a abertura do mercado ao vivo com nossa equipe.',
    liveRoomBtn: 'Transmissão Offline',
    favSectionTitle: 'Minhas Prop Firms Favoritas',
    addMesaBtn: '+ Adicionar Mesa',
    noFavs: 'Nenhuma mesa favoritada ainda.',
    noFavsSub: 'Clique no botão acima para adicionar e acompanhar suas mesas preferidas.',
    drawdown: 'Drawdown',
    platform: 'Plataforma',
    couponLabel: 'Cupom:',
    copyBtn: 'Copiar',
    copiedBtn: '✓ Copiado',
    accessBtn: 'Acessar Mesa Oficial',
    modalTitle: 'Selecione para adicionar às favoritas',
    modalAllAdded: 'Todas as mesas já foram adicionadas!',
    modalClose: 'Fechar',
    modalFavBtn: '+ Favoritar',
    freeIndTitle: 'Indicadores e Utilitários (NinjaTrader)',
    noFreeInd: 'Nenhum indicador gratuito cadastrado no momento.',
    noFreeIndSub: 'Novos utilitários serão liberados pelo administrador em breve.',
    downloadDll: 'Download',
    restIndTitle: 'Indicadores Restritos (PRO / Automações)',
    restIndBoxTitle: 'Ferramentas de Execução e Zonas Institucionais',
    restIndBoxDesc: 'Liberação exclusiva para contas cadastradas com nosso link parceiro da plataforma NinjaTrader.',
    restIndBtn: 'Acesso Restrito',
    restIndTooltip: 'Aguarde, ainda não disponível',
    logoutBtn: 'Sair'
  },
  en: {
    loading: 'Loading VIP area...',
    title: 'Trader Dashboard',
    subtitle: 'Exclusive access to manage your saved Prop Firms, indicators, and active promotions.',
    liveRoomTitle: 'Live Room',
    liveRoomBadge: 'COMING SOON',
    liveRoomDesc: 'Follow the market open live with our team.',
    liveRoomBtn: 'Offline Stream',
    favSectionTitle: 'My Favorite Prop Firms',
    addMesaBtn: '+ Add Prop Firm',
    noFavs: 'No favorite prop firms added yet.',
    noFavsSub: 'Click the button above to add and track your preferred firms.',
    drawdown: 'Drawdown',
    platform: 'Platform',
    couponLabel: 'Coupon:',
    copyBtn: 'Copy',
    copiedBtn: '✓ Copied',
    accessBtn: 'Access Official Firm',
    modalTitle: 'Select to add to favorites',
    modalAllAdded: 'All prop firms have already been added!',
    modalClose: 'Close',
    modalFavBtn: '+ Favorite',
    freeIndTitle: 'Indicators & Utilities (NinjaTrader)',
    noFreeInd: 'No free indicators available at the moment.',
    noFreeIndSub: 'New tools will be released by the admin soon.',
    downloadDll: 'Download',
    restIndTitle: 'Restricted Indicators (PRO / Automations)',
    restIndBoxTitle: 'Execution Tools & Institutional Zones',
    restIndBoxDesc: 'Exclusive release for accounts registered with our partner link on NinjaTrader platform.',
    restIndBtn: 'Restricted Access',
    restIndTooltip: 'Please wait, not available yet',
    logoutBtn: 'Sign Out'
  },
  es: {
    loading: 'Cargando área VIP...',
    title: 'Panel del Trader',
    subtitle: 'Acceso exclusivo para gestionar tus Prop Firms guardadas, indicadores y promociones activas.',
    liveRoomTitle: 'Sala en Vivo',
    liveRoomBadge: 'PRÓXIMAMENTE',
    liveRoomDesc: 'Sigue la apertura del mercado en vivo con nuestro equipo.',
    liveRoomBtn: 'Transmisión Offline',
    favSectionTitle: 'Mis Prop Firms Favoritas',
    addMesaBtn: '+ Añadir Mesa',
    noFavs: 'Aún no hay mesas favoritas guardadas.',
    noFavsSub: 'Haz clic en el botón de arriba para añadir y seguir tus mesas preferidas.',
    drawdown: 'Drawdown',
    platform: 'Plataforma',
    couponLabel: 'Cupón:',
    copyBtn: 'Copiar',
    copiedBtn: '✓ Copiado',
    accessBtn: 'Acceder a la Mesa Oficial',
    modalTitle: 'Selecciona para añadir a favoritas',
    modalAllAdded: '¡Todas las mesas ya han sido añadidas!',
    modalClose: 'Cerrar',
    modalFavBtn: '+ Favorita',
    freeIndTitle: 'Indicadores y Utilitarios (NinjaTrader)',
    noFreeInd: 'No hay indicadores gratuitos registrados por el momento.',
    noFreeIndSub: 'El administrador liberará nuevas herramientas pronto.',
    downloadDll: 'Download',
    restIndTitle: 'Indicadores Restringidos (PRO / Automatizaciones)',
    restIndBoxTitle: 'Herramientas de Ejecución y Zonas Institucionales',
    restIndBoxDesc: 'Liberación exclusiva para cuentas registradas con nuestro enlace de socio en la plataforma NinjaTrader.',
    restIndBtn: 'Acceso Restringido',
    restIndTooltip: 'Espera, aún no disponible',
    logoutBtn: 'Salir'
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>('pt');

  // Mesas buscadas dinamicamente da tabela "mesas" do Supabase
  const [propFirms, setPropFirms] = useState<PropFirm[]>([]);

  // Mesas favoritas persistidas
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [showModalFav, setShowModalFav] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Lista dinâmica de indicadores
  const [freeIndicators, setFreeIndicators] = useState<Indicator[]>([]);
  const [restrictedIndicators, setRestrictedIndicators] = useState<Indicator[]>([]);

  // Textos traduzidos para o idioma atual
  const t = TRANSLATIONS[lang] || TRANSLATIONS.pt;

  useEffect(() => {
    async function checkUserAndFetchData() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      // Carregar mesas favoritas salvas no LocalStorage EXCLUSIVAS do ID deste usuário
      const storageKey = `user_favorite_firms_${currentUser.id}`;
      const savedFavs = localStorage.getItem(storageKey);
      if (savedFavs) {
        try {
          setFavoriteIds(JSON.parse(savedFavs));
        } catch (e) {
          console.error('Erro ao ler favoritos do usuário', e);
        }
      } else {
        setFavoriteIds([]);
      }

      // 1. Busca diretamente na tabela 'mesas' do Supabase
      const { data: rawMesas, error: errorMesas } = await supabase
        .from('mesas')
        .select('*');

      if (!errorMesas && rawMesas && rawMesas.length > 0) {
        const formattedFirms: PropFirm[] = rawMesas.map((m: any) => ({
          id: m.id,
          name: m.nome || m.name,
          discount: m.desconto || m.discount || '',
          code: m.cupom || m.code || '',
          drawdownType: m.drawdown || m.drawdownType || 'EOD',
          platform: Array.isArray(m.plataformas) ? m.plataformas.join(' / ') : (m.plataformas || m.platform || ''),
          link: m.link_afiliado || m.link || '#',
          featured: m.destaque || false
        }));

        setPropFirms(formattedFirms);
      } else {
        if (errorMesas) console.error('Erro ao buscar mesas no Supabase:', errorMesas);
        setPropFirms([]);
      }

      // 2. Busca na tabela 'indicators' do Supabase
      const { data: rawIndicators, error: errorInd } = await supabase
        .from('indicators')
        .select('*')
        .order('created_at', { ascending: false });

      if (!errorInd && rawIndicators) {
        const formattedInds: Indicator[] = rawIndicators.map((ind: any) => ({
          id: ind.id,
          title: ind.title,
          description: ind.description,
          isRestricted: ind.is_restricted,
          downloadUrl: ind.download_url
        }));

        setFreeIndicators(formattedInds.filter(i => !i.isRestricted));
        setRestrictedIndicators(formattedInds.filter(i => i.isRestricted));
      } else if (errorInd) {
        console.error('Erro ao buscar indicadores no Supabase:', errorInd);
      }

      setLoading(false);
    }

    checkUserAndFetchData();
  }, [router]);

  // Salvar alterações de favoritas no LocalStorage associando o ID do usuário
  const handleToggleFavorite = (firmId: string) => {
    if (!user) return;

    let updated: string[];
    if (favoriteIds.includes(firmId)) {
      updated = favoriteIds.filter((id) => id !== firmId);
    } else {
      updated = [...favoriteIds, firmId];
    }
    setFavoriteIds(updated);

    // Chave única para o usuário autenticado
    const storageKey = `user_favorite_firms_${user.id}`;
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center text-slate-400 text-sm font-mono">
        {t.loading}
      </div>
    );
  }

  const favoriteFirms = propFirms.filter((m) => favoriteIds.includes(m.id));
  const availableToAdd = propFirms.filter((m) => !favoriteIds.includes(m.id));

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans pb-16">
      {/* HEADER DO DASHBOARD */}
      <header className="border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-xl">
                M
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                MESA PROP <span className="text-emerald-400 font-light">VIP</span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* SELETOR DE IDIOMA DROPDOWN */}
            <LanguageSelector currentLang={lang} onSelectLanguage={setLang} />

            <span className="text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full hidden sm:inline">
              {user?.email}
            </span>

            <button
              onClick={handleLogout}
              className="bg-slate-900 hover:bg-red-500/20 hover:text-red-400 text-slate-300 text-xs font-bold px-3.5 py-1.5 rounded-full transition border border-slate-800"
            >
              {t.logoutBtn}
            </button>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* BOAS VINDAS */}
        <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/20 p-6 sm:p-8 rounded-2xl">
          <h1 className="text-2xl sm:text-3xl font-black text-white">{t.title}</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* SALA AO VIVO (MENU DESATIVADO) */}
        <div className="bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 opacity-70">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-slate-600 animate-pulse"></div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-300">{t.liveRoomTitle}</h3>
                <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">{t.liveRoomBadge}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t.liveRoomDesc}</p>
            </div>
          </div>
          <button disabled className="bg-slate-800 text-slate-500 cursor-not-allowed text-xs font-bold px-4 py-2 rounded-xl border border-slate-700/50">
            {t.liveRoomBtn}
          </button>
        </div>

        {/* SEÇÃO: MINHAS PROP FIRMS FAVORITAS */}
        <section className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <h2 className="text-lg font-bold text-white">{t.favSectionTitle}</h2>
            </div>
            <button
              onClick={() => setShowModalFav(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl transition shadow-md flex items-center gap-1.5"
            >
              {t.addMesaBtn}
            </button>
          </div>

          {/* LISTA DE CARDS FAVORITADOS COMPLETOS */}
          {favoriteFirms.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl">
              <p className="text-xs text-slate-500">{t.noFavs}</p>
              <p className="text-[11px] text-slate-600 mt-1">{t.noFavsSub}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteFirms.map((mesa) => (
                <div key={mesa.id} className="relative bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between gap-5 hover:border-slate-700 transition shadow-xl">
                  <button
                    onClick={() => handleToggleFavorite(mesa.id)}
                    title="Remover"
                    className="absolute top-4 right-4 w-7 h-7 bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg flex items-center justify-center transition border border-slate-800 text-xs font-bold z-10"
                  >
                    ✕
                  </button>

                  <div className="space-y-4">
                    <div className="pr-8">
                      <span className="inline-block bg-emerald-500/10 text-emerald-400 text-[11px] font-black px-2.5 py-1 rounded-md border border-emerald-500/20 uppercase tracking-wider">
                        {mesa.discount}
                      </span>
                      <h3 className="text-lg font-black text-white mt-2 tracking-tight">{mesa.name}</h3>
                    </div>

                    <div className="space-y-2 text-xs text-slate-400 pt-3 border-t border-slate-900">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">{t.drawdown}:</span>
                        <span className="text-slate-200 font-semibold">{mesa.drawdownType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">{t.platform}:</span>
                        <span className="text-slate-200 font-semibold">{mesa.platform}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                      <span className="text-slate-500 font-mono text-[11px]">{t.couponLabel}</span>
                      <button
                        onClick={() => handleCopyCode(mesa.code)}
                        className="font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition"
                      >
                        <span>{mesa.code}</span>
                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                          {copiedCode === mesa.code ? t.copiedBtn : t.copyBtn}
                        </span>
                      </button>
                    </div>

                    <a
                      href={mesa.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-3 rounded-xl transition shadow-lg shadow-emerald-500/10"
                    >
                      {t.accessBtn}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MODAL PARA SELEÇÃO DE MESAS */}
        {showModalFav && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">{t.modalTitle}</h3>
                <button onClick={() => setShowModalFav(false)} className="text-slate-500 hover:text-white text-xs font-bold">✕</button>
              </div>

              {availableToAdd.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">{t.modalAllAdded}</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {availableToAdd.map((mesa) => (
                    <div
                      key={mesa.id}
                      onClick={() => {
                        handleToggleFavorite(mesa.id);
                        setShowModalFav(false);
                      }}
                      className="cursor-pointer bg-slate-950 hover:bg-slate-800 border border-slate-800 p-3.5 rounded-xl transition flex justify-between items-center group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">{mesa.name}</p>
                        <p className="text-[10px] text-slate-500">{mesa.discount}</p>
                      </div>
                      <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded">
                        {t.modalFavBtn}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowModalFav(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-xl transition"
              >
                {t.modalClose}
              </button>
            </div>
          </div>
        )}

        {/* SEÇÃO: INDICADORES GRATUITOS */}
        <section className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <h2 className="text-base font-bold text-emerald-400">{t.freeIndTitle}</h2>
          </div>

          {freeIndicators.length === 0 ? (
            <div className="text-center py-6 bg-slate-950/50 border border-dashed border-slate-800/80 rounded-xl">
              <p className="text-xs text-slate-500">{t.noFreeInd}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{t.noFreeIndSub}</p>
            </div>
          ) : (
            <div className="max-h-[380px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {freeIndicators.map((ind) => (
                  <div key={ind.id} className="relative group bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex justify-between items-center gap-4 hover:border-slate-700 transition">
                    <div className="min-w-0 flex-1 cursor-pointer">
                      <h4 className="font-bold text-sm text-white truncate">{ind.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{ind.description}</p>
                    </div>

                    <a
                      href={ind.downloadUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition shadow-md shadow-emerald-500/10"
                    >
                      {t.downloadDll}
                    </a>

                    {/* POPUP/TOOLTIP POSICIONADO PARA BAIXO PARA EVITAR CORTES */}
                    {ind.description && (
                      <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50 w-full max-w-sm p-3.5 bg-slate-900 text-slate-200 text-xs rounded-xl border border-emerald-500/40 shadow-2xl backdrop-blur-md pointer-events-none">
                        <p className="font-bold text-emerald-400 mb-1">{ind.title}</p>
                        <p className="leading-relaxed text-slate-300">{ind.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SEÇÃO: INDICADORES RESTRITOS */}
        <section className="bg-slate-900/80 border border-purple-500/20 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔒</span>
              <h2 className="text-base font-bold text-purple-400">{t.restIndTitle}</h2>
            </div>
          </div>

          {restrictedIndicators.length === 0 ? (
            <div className="bg-slate-950/60 border border-purple-900/30 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">{t.restIndBoxTitle}</h4>
                  <span className="text-xs">🔒</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t.restIndBoxDesc}
                </p>
              </div>

              <div className="relative group">
                <button
                  disabled
                  className="bg-purple-950/80 text-purple-300 border border-purple-700/50 text-xs font-bold px-4 py-2.5 rounded-xl cursor-not-allowed opacity-90 transition"
                >
                  {t.restIndBtn}
                </button>
                <div className="absolute top-full mt-2 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 hidden group-hover:block w-48 bg-slate-950 text-slate-200 text-[11px] text-center font-medium py-1.5 px-3 rounded-lg border border-purple-500/40 shadow-xl z-50 whitespace-nowrap">
                  {t.restIndTooltip}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-[380px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restrictedIndicators.map((ind) => (
                  <div key={ind.id} className="relative group bg-slate-950 border border-purple-900/40 p-4 rounded-xl flex justify-between items-center gap-4 hover:border-purple-700/50 transition">
                    <div className="min-w-0 flex-1 cursor-pointer">
                      <h4 className="font-bold text-sm text-white truncate">{ind.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{ind.description}</p>
                    </div>

                    <div className="shrink-0">
                      <button
                        disabled
                        className="bg-purple-950/80 text-purple-300 border border-purple-700/50 text-xs font-bold px-3.5 py-2 rounded-xl cursor-not-allowed"
                      >
                        {t.restIndBtn}
                      </button>
                    </div>

                    {/* POPUP/TOOLTIP POSICIONADO PARA BAIXO PARA EVITAR CORTES */}
                    {ind.description && (
                      <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50 w-full max-w-sm p-3.5 bg-slate-900 text-slate-200 text-xs rounded-xl border border-purple-500/40 shadow-2xl backdrop-blur-md pointer-events-none">
                        <p className="font-bold text-purple-400 mb-1">{ind.title}</p>
                        <p className="leading-relaxed text-slate-300">{ind.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}