'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { LOGOS_PLATAFORMAS } from '@/data/mesas';

// Bandeiras em SVG para compatibilidade universal (sem dependência de fontes do SO)
function FlagBR() {
  return (
    <svg className="w-5 h-3.5 rounded-sm object-cover shrink-0" viewBox="0 0 640 480">
      <path fill="#009b3a" d="M0 0h640v480H0z"/>
      <path fill="#fedf00" d="M320 40L600 240 320 440 40 240z"/>
      <circle fill="#002776" cx="320" cy="240" r="105"/>
    </svg>
  );
}

function FlagUS() {
  return (
    <svg className="w-5 h-3.5 rounded-sm object-cover shrink-0" viewBox="0 0 640 480">
      <path fill="#bd3d44" d="M0 0h640v480H0z"/>
      <path stroke="#fff" strokeWidth="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"/>
      <path fill="#192f5d" d="M0 0h256v259H0z"/>
    </svg>
  );
}

function FlagES() {
  return (
    <svg className="w-5 h-3.5 rounded-sm object-cover shrink-0" viewBox="0 0 640 480">
      <path fill="#c60b1e" d="M0 0h640v480H0z"/>
      <path fill="#ffc400" d="M0 120h640v240H0z"/>
    </svg>
  );
}

export interface MesaProprietaria {
  id: string;
  nome: string;
  logo: string;
  desconto: string;
  cupom: string;
  link_afiliado: string;
  destaque: boolean;
  drawdown: string;
  profit_split: string;
  avaliacao: string;
  cor_tag: string;
  plataformas: string[];
  ordem?: number;
}

export interface Campanha {
  id: string;
  titulo?: string;
  descricao?: string;
  imagem?: string;
  imagem_url?: string;
  banner?: string;
  link?: string;
  link_direcionamento?: string;
  cor_destaque?: string;
  ativo?: boolean;
  ativa?: boolean;
  data_fim?: string;
  criado_em?: string;
}

// Dicionário de Traduções
const TRANSLATIONS = {
  PT: {
    navCampanhas: 'Campanhas',
    navPromocoes: 'Promoções',
    navParcerias: 'Parcerias Oficial',
    navComparativo: 'Comparativo',
    navNoticias: 'Notícias & Calendário',
    navConteudo: 'Vídeos & Instagram',
    navIndicadores: 'Indicadores Grátis',
    areaTrader: 'Área do Trader',
    grupoTelegram: 'Grupo Telegram',
    heroBadge: '⚡ Tenha acesso a vários indicadores gratuitos! Cadastre-se Grátis ⚡',
    heroTituloLinha1: 'Baixe o Seu Pack 100% Gratuito de',
    heroTituloDestaque: 'Indicadores para NinjaTrader 8',
    heroDescricao: 'Indicadores desenvolvidos especialmente para traders que usam NinjaTrader 8 e buscam ferramentas profissionais de análise gráfica, estudo de fluxo de ordens (order flow) e pesquisa de mercado.',
    heroCadastroTexto: 'Cadastre-se para acessar e baixar instantaneamente direto na sua',
    heroIndicador1: 'FootPrint',
    heroIndicador2: 'FVG (Fair Value Gap)',
    heroIndicador3: 'Oscilador Premium',
    heroBonusLabel: 'Bônus inclusos:',
    heroBonusTexto: 'Vários Indicadores Gratuitos',
    heroBtnCadastro: '👉 CADASTRE-SE GRÁTIS E BAIXE AGORA',
    heroJaTemConta: 'Já tem uma conta?',
    heroFacaLogin: 'Faça login aqui',
    heroParaAcessar: 'para acessar seus downloads.',
    placeholderBusca: 'Pesquisar mesa, cupom, plataforma ou drawdown...',
    tituloCampanhas: 'Campanhas & Eventos Especiais',
    descCampanhas: 'Acompanhe os principais lançamentos, pass-throughs e promoções por tempo limitado.',
    tituloCupons: 'Cupons & Ofertas Ativas',
    mesasEncontradas: 'mesas encontradas',
    carregando: 'Carregando...',
    buscandoDados: 'Buscando dados atualizados...',
    tituloComparativo: 'Tabela Comparativa de Regras',
    descComparativo: 'Visualização simplificada de plataformas suportadas, tipo de drawdown e descontos vigentes.',
    thMesa: 'Mesa Proprietária',
    thDesconto: 'Desconto',
    thPlataformas: 'Plataformas',
    thDrawdown: 'Tipo de Drawdown',
    thCupom: 'Cupom',
    thAcao: 'Ação',
    btnAcessarSite: 'Acessar Site',
    tituloNoticias: 'Central de Notícias e Indicadores em Tempo Real',
    descNoticias: 'Calendário Econômico com filtros dos EUA (2 e 3 estrelas) e feed instantâneo de breaking news.',
    abrirInvesting: 'Abrir no Investing ↗',
    calEconomico: 'Calendário Econômico (EUA - Relevância Média/Alta)',
    aoVivo: 'AO VIVO',
    feedNoticias: 'Feed de Notícias Mercado Futuros EUA',
    tituloMidias: 'Mídias & Redes Oficiais',
    descMidias: 'Assista à live explicativa e acompanhe nosso carrossel oficial do Instagram.',
    btnYoutube: 'Acessar Canal do YouTube',
    btnPlaylist: 'Ver Playlist de Aulas',
    btnInstagram: 'Ver perfil no Instagram',
    tituloParcerias: 'Integração Avançada NinjaTrader & Kinetick',
    descParcerias: 'As principais mesas proprietárias americanas utilizam a tecnologia da plataforma NinjaTrader para execução de ordens e o feed de dados Kinetick para cotações em tempo real sem atrasos.',
    ecosistemaOficial: 'Eco-sistema Oficial de Dados',
    plataformaRecomendada: 'Plataforma Recomendada',
    dadosTempoReal: 'Dados de Mercado em Tempo Real',
    assistenteIa: 'Dúvidas de Mesas? Assistente IA',
    assistenteTitulo: 'Assistente de Mesas Americanas',
    assistenteMsgInicial: 'Olá! Sou o Assistente IA especializado em Mesas Proprietárias Americanas. Como posso te ajudar hoje? Selecione uma dúvida abaixo ou digite sua pergunta.',
    perguntaCupomApex: 'Qual cupom usar na Apex?',
    perguntaDrawdown: 'Como funciona o Drawdown Trailing vs EOD?',
    perguntaPayout: 'Como funcionam os saques e payouts?',
    respostaPadrao: 'Posso te ajudar com regras de avaliação, escolha de plataformas (NinjaTrader, Tradovate, Rithmic, BlackArrow) e cupons ativos. Qual mesa você quer analisar?',
    respostaApex: 'A Apex Trader Funding é uma das maiores mesas dos EUA. Oferece até 90% de desconto com o cupom ANDMP. Possui drawdown do tipo Trailing (em tempo real) e repasse de 100% dos primeiros $25.000 de lucro. Funciona via NinjaTrader e Tradovate.',
    respostaDrawdown: 'Existem 3 tipos principais de Drawdown:\n1. Trailing: Sobe junto com o lucro em tempo real (ex: Apex, Bulenox).\n2. EOD (End of Day): Atualizado apenas ao final do dia operacional (ex: Tradeify, MFF).\n3. Estático: O limite não sobe à medida que você lucra, ficando fixo.',
    respostaCupom: 'Cupons ativos no momento:\n• Apex Trader Funding: ANDMP\n• My Funded Futures: AND5\n• Earn2Trade: ANDER\n• Tradeify & LVL: ANDMP',
    respostaPayout: 'A maioria das mesas permite saques quinzenais ou mensais. Mesas como Apex e MFF repassam 100% dos primeiros lucros ($12.500 a $25.000) e depois mantêm o repasse em 90%.',
    respostaPlataforma: 'Para operadoras brasileiras via BlackArrow, recomendamos LVL Funding e Ylos. Se preferir NinjaTrader ou Tradovate no navegador/celular, Apex e My Funded Futures são excelentes opções.',
    duvidasCupom: '🏷️ Cupons Apex',
    duvidasDrawdown: '📊 Drawdowns',
    duvidasPayout: '💰 Payout & Saques',
    btnEnviar: 'Enviar',
    placeholderChat: 'Pergunte sobre cupons, regras ou plataformas...',
    cupomDesconto: 'Cupom de Desconto',
    copiar: 'Copiar',
    copiado: '✓ Copiado!',
    semCupom: 'Sem Cupom',
    aproveitarOferta: 'Aproveitar Oferta',
    saibaMais: 'Saiba Mais / Acessar',
  },
  EN: {
    navCampanhas: 'Campaigns',
    navPromocoes: 'Deals',
    navParcerias: 'Official Partners',
    navComparativo: 'Comparison',
    navNoticias: 'News & Calendar',
    navConteudo: 'Videos & Instagram',
    navIndicadores: 'Free Indicators',
    areaTrader: 'Trader Area',
    grupoTelegram: 'Telegram Group',
    heroBadge: '⚡ Get access to several free indicators! Sign up for Free ⚡',
    heroTituloLinha1: 'Download Your 100% Free Pack of',
    heroTituloDestaque: 'Indicators for NinjaTrader 8',
    heroDescricao: 'Indicators built specifically for traders using NinjaTrader 8 who want professional-grade charting tools, order flow analysis, and market research.',
    heroCadastroTexto: 'Sign up to access and instantly download straight to your',
    heroIndicador1: 'FootPrint',
    heroIndicador2: 'FVG (Fair Value Gap)',
    heroIndicador3: 'Premium Oscillator',
    heroBonusLabel: 'Bonuses included:',
    heroBonusTexto: 'Several Free Indicators',
    heroBtnCadastro: '👉 SIGN UP FREE & DOWNLOAD NOW',
    heroJaTemConta: 'Already have an account?',
    heroFacaLogin: 'Log in here',
    heroParaAcessar: 'to access your downloads.',
    placeholderBusca: 'Search prop firm, coupon, platform or drawdown...',
    tituloCampanhas: 'Campaigns & Special Events',
    descCampanhas: 'Track major launches, pass-throughs, and limited-time promotions.',
    tituloCupons: 'Active Coupons & Deals',
    mesasEncontradas: 'firms found',
    carregando: 'Loading...',
    buscandoDados: 'Fetching updated data...',
    tituloComparativo: 'Rules Comparison Table',
    descComparativo: 'Simplified overview of supported platforms, drawdown types, and active discounts.',
    thMesa: 'Prop Firm',
    thDesconto: 'Discount',
    thPlataformas: 'Platforms',
    thDrawdown: 'Drawdown Type',
    thCupom: 'Coupon',
    thAcao: 'Action',
    btnAcessarSite: 'Visit Website',
    tituloNoticias: 'Real-Time News & Economic Hub',
    descNoticias: 'US Economic Calendar (2 & 3 stars) and instant breaking news feed.',
    abrirInvesting: 'Open in Investing ↗',
    calEconomico: 'Economic Calendar (US - Med/High Impact)',
    aoVivo: 'LIVE',
    feedNoticias: 'US Futures Market News Feed',
    tituloMidias: 'Official Media & Networks',
    descMidias: 'Watch our explanatory streams and follow our official Instagram carousel.',
    btnYoutube: 'Visit YouTube Channel',
    btnPlaylist: 'View Video Playlist',
    btnInstagram: 'View Instagram Profile',
    tituloParcerias: 'Advanced NinjaTrader & Kinetick Integration',
    descParcerias: 'Leading US prop firms rely on NinjaTrader technology for order execution and Kinetick data feed for real-time market data.',
    ecosistemaOficial: 'Official Data Ecosystem',
    plataformaRecomendada: 'Recommended Platform',
    dadosTempoReal: 'Real-Time Market Data',
    assistenteIa: 'Prop Firm Questions? AI Assistant',
    assistenteTitulo: 'US Prop Firms Assistant',
    assistenteMsgInicial: 'Hi! I\'m the AI Assistant specialized in US Proprietary Trading Firms. How can I help you today? Pick a question below or type your own.',
    perguntaCupomApex: 'Which coupon should I use on Apex?',
    perguntaDrawdown: 'How does Trailing vs EOD drawdown work?',
    perguntaPayout: 'How do withdrawals and payouts work?',
    respostaPadrao: 'I can help with evaluation rules, platform choice (NinjaTrader, Tradovate, Rithmic, BlackArrow), and active coupons. Which firm do you want to analyze?',
    respostaApex: 'Apex Trader Funding is one of the largest prop firms in the US. It offers up to 90% off with the coupon ANDMP. It has a Trailing drawdown (real-time) and a 100% profit split on the first $25,000 in profit. It runs on NinjaTrader and Tradovate.',
    respostaDrawdown: 'There are 3 main types of Drawdown:\n1. Trailing: Rises with your profit in real time (e.g. Apex, Bulenox).\n2. EOD (End of Day): Only updated at the close of the trading day (e.g. Tradeify, MFF).\n3. Static: The limit stays fixed and doesn\'t rise as you profit.',
    respostaCupom: 'Active coupons right now:\n• Apex Trader Funding: ANDMP\n• My Funded Futures: AND5\n• Earn2Trade: ANDER\n• Tradeify & LVL: ANDMP',
    respostaPayout: 'Most firms allow bi-weekly or monthly withdrawals. Firms like Apex and MFF pay out 100% of the first profits ($12,500 to $25,000) and then keep the split at 90%.',
    respostaPlataforma: 'For Brazilian operators via BlackArrow, we recommend LVL Funding and Ylos. If you prefer NinjaTrader or Tradovate on browser/mobile, Apex and My Funded Futures are excellent choices.',
    duvidasCupom: '🏷️ Apex Coupons',
    duvidasDrawdown: '📊 Drawdowns',
    duvidasPayout: '💰 Payout & Withdrawals',
    btnEnviar: 'Send',
    placeholderChat: 'Ask about coupons, rules, or platforms...',
    cupomDesconto: 'Discount Coupon',
    copiar: 'Copy',
    copiado: '✓ Copied!',
    semCupom: 'No Coupon',
    aproveitarOferta: 'Get Offer',
    saibaMais: 'Learn More / Visit',
  },
  ES: {
    navCampanhas: 'Campañas',
    navPromocoes: 'Promociones',
    navParcerias: 'Socios Oficiales',
    navComparativo: 'Comparativa',
    navNoticias: 'Noticias y Calendario',
    navConteudo: 'Videos e Instagram',
    navIndicadores: 'Indicadores Gratis',
    areaTrader: 'Área del Trader',
    grupoTelegram: 'Grupo de Telegram',
    heroBadge: '⚡ ¡Accede a varios indicadores gratis! Regístrate Gratis ⚡',
    heroTituloLinha1: 'Descarga Tu Pack 100% Gratuito de',
    heroTituloDestaque: 'Indicadores para NinjaTrader 8',
    heroDescricao: 'Indicadores desarrollados especialmente para traders que usan NinjaTrader 8 y buscan herramientas profesionales de análisis gráfico, estudio de order flow y research de mercado.',
    heroCadastroTexto: 'Regístrate para acceder y descargar al instante directo en tu',
    heroIndicador1: 'FootPrint',
    heroIndicador2: 'FVG (Fair Value Gap)',
    heroIndicador3: 'Oscilador Premium',
    heroBonusLabel: 'Bonos incluidos:',
    heroBonusTexto: 'Varios Indicadores Gratuitos',
    heroBtnCadastro: '👉 REGÍSTRATE GRATIS Y DESCARGA AHORA',
    heroJaTemConta: '¿Ya tienes una cuenta?',
    heroFacaLogin: 'Inicia sesión aquí',
    heroParaAcessar: 'para acceder a tus descargas.',
    placeholderBusca: 'Buscar empresa, cupón, plataforma o drawdown...',
    tituloCampanhas: 'Campañas y Eventos Especiales',
    descCampanhas: 'Sigue los principales lanzamientos, promociones y ofertas por tiempo limitado.',
    tituloCupons: 'Cupones y Ofertas Activas',
    mesasEncontradas: 'empresas encontradas',
    carregando: 'Cargando...',
    buscandoDados: 'Buscando datos actualizados...',
    tituloComparativo: 'Tabla Comparativa de Reglas',
    descComparativo: 'Vista simplificada de plataformas compatibles, tipos de drawdown y descuentos vigentes.',
    thMesa: 'Empresa de Fondeo',
    thDesconto: 'Descuento',
    thPlataformas: 'Plataformas',
    thDrawdown: 'Tipo de Drawdown',
    thCupom: 'Cupón',
    thAcao: 'Acción',
    btnAcessarSite: 'Visitar Sitio',
    tituloNoticias: 'Central de Noticias e Indicadores en Tiempo Real',
    descNoticias: 'Calendario Económico de EE. UU. (2 y 3 estrellas) y feed de noticias de última hora.',
    abrirInvesting: 'Abrir en Investing ↗',
    calEconomico: 'Calendario Económico (EE. UU. - Impacto Medio/Alto)',
    aoVivo: 'EN VIVO',
    feedNoticias: 'Feed de Noticias Mercado de Futuros EE. UU.',
    tituloMidias: 'Medios y Redes Oficiales',
    descMidias: 'Mira nuestros videos explicativos y sigue nuestro carrusel oficial en Instagram.',
    btnYoutube: 'Ir al Canal de YouTube',
    btnPlaylist: 'Ver Playlist de Clases',
    btnInstagram: 'Ver Perfil en Instagram',
    tituloParcerias: 'Integración Avanzada NinjaTrader y Kinetick',
    descParcerias: 'Las principales empresas de fondeo americanas utilizan la tecnología de NinjaTrader para la ejecución de órdenes y el feed de datos Kinetick para cotizaciones en tiempo real.',
    ecosistemaOficial: 'Ecosistema Oficial de Datos',
    plataformaRecomendada: 'Plataforma Recomendada',
    dadosTempoReal: 'Datos de Mercado en Tiempo Real',
    assistenteIa: '¿Dudas de Fondeo? Asistente IA',
    assistenteTitulo: 'Asistente de Empresas de Fondeo',
    assistenteMsgInicial: '¡Hola! Soy el Asistente IA especializado en Empresas de Fondeo Americanas. ¿Cómo puedo ayudarte hoy? Elige una duda abajo o escribe tu pregunta.',
    perguntaCupomApex: '¿Qué cupón usar en Apex?',
    perguntaDrawdown: '¿Cómo funciona el Drawdown Trailing vs EOD?',
    perguntaPayout: '¿Cómo funcionan los retiros y payouts?',
    respostaPadrao: 'Puedo ayudarte con reglas de evaluación, elección de plataformas (NinjaTrader, Tradovate, Rithmic, BlackArrow) y cupones activos. ¿Qué empresa quieres analizar?',
    respostaApex: 'Apex Trader Funding es una de las mayores empresas de fondeo de EE. UU. Ofrece hasta 90% de descuento con el cupón ANDMP. Tiene drawdown tipo Trailing (en tiempo real) y reparto del 100% de las primeras ganancias de $25.000. Funciona con NinjaTrader y Tradovate.',
    respostaDrawdown: 'Existen 3 tipos principales de Drawdown:\n1. Trailing: Sube junto con la ganancia en tiempo real (ej: Apex, Bulenox).\n2. EOD (End of Day): Se actualiza solo al final del día operativo (ej: Tradeify, MFF).\n3. Estático: El límite no sube a medida que ganas, queda fijo.',
    respostaCupom: 'Cupones activos ahora mismo:\n• Apex Trader Funding: ANDMP\n• My Funded Futures: AND5\n• Earn2Trade: ANDER\n• Tradeify & LVL: ANDMP',
    respostaPayout: 'La mayoría de las empresas permiten retiros quincenales o mensuales. Empresas como Apex y MFF reparten el 100% de las primeras ganancias ($12.500 a $25.000) y luego mantienen el reparto en 90%.',
    respostaPlataforma: 'Para operadores brasileños vía BlackArrow, recomendamos LVL Funding y Ylos. Si prefieres NinjaTrader o Tradovate en navegador/móvil, Apex y My Funded Futures son excelentes opciones.',
    duvidasCupom: '🏷️ Cupones Apex',
    duvidasDrawdown: '📊 Drawdowns',
    duvidasPayout: '💰 Payout y Retiros',
    btnEnviar: 'Enviar',
    placeholderChat: 'Pregunta sobre cupones, reglas o plataformas...',
    cupomDesconto: 'Cupón de Descuento',
    copiar: 'Copiar',
    copiado: '✓ ¡Copiado!',
    semCupom: 'Sin Cupón',
    aproveitarOferta: 'Aprovechar Oferta',
    saibaMais: 'Saber Más / Acceder',
  }
};

function extrairUrlLimpa(linkBruto?: string): string {
  if (!linkBruto) return '#';
  
  let link = linkBruto.trim();

  const matchMarkdown = link.match(/\((https?:\/\/[^\)]+)\)/);
  if (matchMarkdown && matchMarkdown[1]) {
    return matchMarkdown[1].trim();
  }

  const urlsEncontradas = link.match(/https?:\/\/[^\s"'>]+/g);
  if (urlsEncontradas && urlsEncontradas.length > 0) {
    return urlsEncontradas[urlsEncontradas.length - 1].replace(/\]$/, '').trim();
  }

  return link;
}

const POSTS_INSTAGRAM = [
  {
    id: 1,
    tag: 'GESTÃO DE RISCO',
    titulo: 'Diferença entre Drawdowns',
    descricao: 'Entenda como funciona o Trailing Drawdown vs End of Day (EOD) antes de assinar.',
    imagem: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    link: 'https://www.instagram.com/traderfunding_mesausa/'
  },
  {
    id: 2,
    tag: 'OFERTAS & CUPONS',
    titulo: 'Até 90% OFF na Apex Trader Funding',
    descricao: 'Aproveite os maiores descontos ativos do mês usando o cupom oficial ANDMP.',
    imagem: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=80',
    link: 'https://www.instagram.com/traderfunding_mesausa/'
  },
  {
    id: 3,
    tag: 'REGRAS & PAYOUT',
    titulo: 'Como aprovar na sua primeira tentativa',
    descricao: 'Dicas fundamentais de gerenciamento e limites de contratos para evitar estouro da conta.',
    imagem: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80',
    link: 'https://www.instagram.com/traderfunding_mesausa/'
  }
];

export default function Home() {
  const [mesas, setMesas] = useState<MesaProprietaria[]>([]);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [copiado, setCopiado] = useState<string | null>(null);

  // Estado do Idioma
  const [idioma, setIdioma] = useState<'PT' | 'EN' | 'ES'>('PT');
  const t = TRANSLATIONS[idioma];
  const [idiomaAberto, setIdiomaAberto] = useState(false);
  const idiomaRef = useRef<HTMLDivElement>(null);

  const OPCOES_IDIOMA: { codigo: 'PT' | 'EN' | 'ES'; Bandeira: () => React.JSX.Element; label: string }[] = [
    { codigo: 'PT', Bandeira: FlagBR, label: 'Português' },
    { codigo: 'EN', Bandeira: FlagUS, label: 'English' },
    { codigo: 'ES', Bandeira: FlagES, label: 'Español' },
  ];

  // Estado do Modal Lightbox
  const [imagemExpandida, setImagemExpandida] = useState<{ url: string; titulo: string } | null>(null);

  // Carrossel Instagram State
  const [slideAtual, setSlideAtual] = useState(0);

  // Chat IA State
  const [chatAberto, setChatAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Array<{ autor: 'user' | 'ia'; texto: string }>>([
    {
      autor: 'ia',
      texto: t.assistenteMsgInicial
    }
  ]);
  const [inputChat, setInputChat] = useState('');
  const [enviandoIa, setEnviandoIa] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown de idioma ao clicar fora dele
  useEffect(() => {
    function handleClickFora(event: MouseEvent) {
      if (idiomaRef.current && !idiomaRef.current.contains(event.target as Node)) {
        setIdiomaAberto(false);
      }
    }
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  useEffect(() => {
    async function buscarDados() {
      setCarregando(true);
      
      const { data: dataMesas, error: errorMesas } = await supabase
        .from('mesas')
        .select('*')
        .order('ordem', { ascending: true });

      if (errorMesas) {
        const { data: fallbackData } = await supabase.from('mesas').select('*');
        if (fallbackData) setMesas(fallbackData as MesaProprietaria[]);
      } else if (dataMesas) {
        setMesas(dataMesas as MesaProprietaria[]);
      }

      const { data: dataCampanhas, error: errorCampanhas } = await supabase
        .from('campanhas')
        .select('*');

      if (!errorCampanhas && dataCampanhas) {
        const campanhasValidas = dataCampanhas.filter((c: any) => c.ativo !== false && c.ativa !== false);
        setCampanhas(campanhasValidas as Campanha[]);
      }

      setCarregando(false);
    }

    buscarDados();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImagemExpandida(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [mensagens, enviandoIa]);

  const proximoSlide = () => {
    setSlideAtual((prev) => (prev + 1) % POSTS_INSTAGRAM.length);
  };

  const slideAnterior = () => {
    setSlideAtual((prev) => (prev - 1 + POSTS_INSTAGRAM.length) % POSTS_INSTAGRAM.length);
  };

  const copiarCupom = (cupom: string, id: string) => {
    if (cupom.toLowerCase().includes('sem cupom')) return;
    navigator.clipboard.writeText(cupom);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  const mesasFiltradas = mesas.filter((mesa) =>
    mesa.nome.toLowerCase().includes(busca.toLowerCase()) ||
    mesa.cupom.toLowerCase().includes(busca.toLowerCase()) ||
    mesa.drawdown.toLowerCase().includes(busca.toLowerCase()) ||
    (mesa.plataformas && mesa.plataformas.some((p) => p.toLowerCase().includes(busca.toLowerCase())))
  );

  const processarPergunta = (perguntaTexto: string) => {
    if (!perguntaTexto.trim() || enviandoIa) return;

    const msgUsuario = perguntaTexto;
    setInputChat('');
    setMensagens((prev) => [...prev, { autor: 'user', texto: msgUsuario }]);
    setEnviandoIa(true);

    const text = msgUsuario.toLowerCase();
    let resposta = t.respostaPadrao;

    if (text.includes('apex')) {
      resposta = t.respostaApex;
    } else if (
      text.includes('drawdown') || text.includes('perda') || text.includes('limite') ||
      text.includes('loss') || text.includes('limit') || text.includes('perdida') || text.includes('límite')
    ) {
      resposta = t.respostaDrawdown;
    } else if (
      text.includes('cupom') || text.includes('desconto') || text.includes('codigo') ||
      text.includes('coupon') || text.includes('discount') || text.includes('code') ||
      text.includes('cupón') || text.includes('descuento') || text.includes('código')
    ) {
      resposta = t.respostaCupom;
    } else if (
      text.includes('payout') || text.includes('saque') || text.includes('receber') ||
      text.includes('withdrawal') || text.includes('receive') ||
      text.includes('retiro') || text.includes('recibir')
    ) {
      resposta = t.respostaPayout;
    } else if (
      text.includes('plataforma') || text.includes('ninja') || text.includes('blackarrow') ||
      text.includes('platform')
    ) {
      resposta = t.respostaPlataforma;
    }

    setTimeout(() => {
      setMensagens((prev) => [...prev, { autor: 'ia', texto: resposta }]);
      setEnviandoIa(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* HEADER */}
      <header className="border-b border-slate-800/80 bg-[#0B0F17]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-xl">
              M
            </div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-white">
              MESA PROP <span className="text-emerald-400 font-light">AMERICANA</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#indicadores" className="hover:text-emerald-400 transition">{t.navIndicadores}</a>
            <a href="#campanhas" className="hover:text-emerald-400 transition">{t.navCampanhas}</a>
            <a href="#promocoes" className="hover:text-emerald-400 transition">{t.navPromocoes}</a>
            <a href="#parcerias" className="hover:text-emerald-400 transition">{t.navParcerias}</a>
            <a href="#comparativo" className="hover:text-emerald-400 transition">{t.navComparativo}</a>
            <a href="#noticias" className="hover:text-emerald-400 transition">{t.navNoticias}</a>
            <a href="#conteudo" className="hover:text-emerald-400 transition">{t.navConteudo}</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* SELETOR DE IDIOMA DA ÁREA NÃO LOGADA (DROPDOWN) */}
            <div className="relative" ref={idiomaRef}>
              <button
                onClick={() => setIdiomaAberto((v) => !v)}
                className="h-10 flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl px-3 text-xs font-bold text-slate-200 transition"
              >
                {(() => {
                  const BandeiraAtual = OPCOES_IDIOMA.find((o) => o.codigo === idioma)?.Bandeira;
                  return BandeiraAtual ? <BandeiraAtual /> : null;
                })()}
                <span>{idioma}</span>
                <svg
                  className={`w-3 h-3 text-slate-500 transition-transform ${idiomaAberto ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {idiomaAberto && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
                  {OPCOES_IDIOMA.map((opcao) => (
                    <button
                      key={opcao.codigo}
                      onClick={() => {
                        setIdioma(opcao.codigo);
                        setIdiomaAberto(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-left transition ${
                        idioma === opcao.codigo
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <opcao.Bandeira />
                      <span>{opcao.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="/login"
              className="h-10 flex items-center justify-center whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition"
            >
              {t.areaTrader}
            </a>

            <a
              href="https://t.me/MesasAmericana"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 flex items-center justify-center whitespace-nowrap bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition gap-2 shadow-lg shadow-emerald-500/10"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.02 9.52c-.15.68-.55.85-1.12.53l-3.08-2.27-1.48 1.43c-.16.16-.3.3-.62.3l.22-3.14 5.72-5.17c.25-.22-.05-.34-.38-.12l-7.07 4.45-3.04-.95c-.66-.21-.67-.66.14-.98l11.89-4.58c.55-.2 1.03.13.84.98z"/>
              </svg>
              <span className="hidden sm:inline">{t.grupoTelegram}</span>
              <span className="sm:hidden">Telegram</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION / BANNER HAMERAL EM DESTAQUE */}
      <section id="indicadores" className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
        {/* HAMERAL STYLE CONTAINER */}
        <div className="relative border-2 border-purple-600/80 bg-gradient-to-b from-[#0F0A1E] via-[#0B0F17] to-[#0D0B18] rounded-3xl p-6 sm:p-12 shadow-[0_0_50px_rgba(147,51,234,0.25)]">
          
          {/* BADGE PISCANTE CHAMATIVO */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider mb-6 animate-pulse shadow-lg shadow-emerald-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            {t.heroBadge}
          </div>

          {/* TÍTULO PRINCIPAL */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight text-white">
            {t.heroTituloLinha1} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
              {t.heroTituloDestaque}
            </span>
          </h1>

          <p className="text-slate-300 max-w-3xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
            {t.heroDescricao}
          </p>

          {/* CAIXA DE LISTA DE INDICADORES (HAMERAL STYLE) */}
          <div className="max-w-3xl mx-auto bg-purple-950/20 border border-purple-500/30 rounded-2xl p-6 mb-8 backdrop-blur-md">
            <p className="text-xs sm:text-sm font-medium text-slate-300 mb-4">
              {t.heroCadastroTexto} <strong className="text-purple-300 font-bold">{t.areaTrader}</strong>:
            </p>

            {/* CHECKBOXES DOS INDICADORES */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-slate-100">
              <div className="flex items-center gap-2 bg-purple-900/40 px-3.5 py-2 rounded-xl border border-purple-500/30 shadow-sm">
                <span className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                <span>{t.heroIndicador1}</span>
              </div>

              <div className="flex items-center gap-2 bg-purple-900/40 px-3.5 py-2 rounded-xl border border-purple-500/30 shadow-sm">
                <span className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                <span>{t.heroIndicador2}</span>
              </div>

              <div className="flex items-center gap-2 bg-purple-900/40 px-3.5 py-2 rounded-xl border border-purple-500/30 shadow-sm">
                <span className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                <span>{t.heroIndicador3}</span>
              </div>
            </div>

            {/* BÔNUS EXTRAS */}
            <div className="mt-5 pt-4 border-t border-purple-800/40 text-xs font-semibold text-purple-300">
              🎁 <strong className="text-white">{t.heroBonusLabel}</strong> {t.heroBonusTexto}
            </div>
          </div>

          {/* BOTÃO SIGN IN / CADASTRO ÁREA LOGADA */}
          <div className="max-w-md mx-auto space-y-3">
            <a
              href="/login"
              className="block w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-black py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl shadow-purple-600/30 hover:scale-105 transition duration-200 transform uppercase tracking-wider"
            >
              <span className="animate-pulse">{t.heroBtnCadastro}</span>
            </a>
            <p className="text-[11px] text-slate-400">
              {t.heroJaTemConta} <a href="/login" className="text-purple-400 hover:underline font-bold">{t.heroFacaLogin}</a> {t.heroParaAcessar}
            </p>
          </div>

        </div>

        {/* BARRA DE PESQUISA */}
        <div className="max-w-lg mx-auto relative mt-10">
          <input
            type="text"
            placeholder={t.placeholderBusca}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3.5 pl-12 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
          />
          <svg className="w-5 h-5 text-slate-500 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </section>

      {/* SEÇÃO 1: CAMPANHAS & EVENTOS ESPECIAIS */}
      {campanhas.length > 0 && (
        <section id="campanhas" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 border-b border-slate-800/60">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <span>🚀</span> {t.tituloCampanhas}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t.descCampanhas}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campanhas.map((campanha) => (
              <CardCampanha
                key={campanha.id}
                campanha={campanha}
                onExpandirImagem={(url, titulo) => setImagemExpandida({ url, titulo })}
                t={t}
              />
            ))}
          </div>
        </section>
      )}

      {/* SEÇÃO 2: GRID DE MESAS E CUPONS */}
      <section id="promocoes" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <span>🔥</span> {t.tituloCupons}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {carregando ? t.carregando : `${mesasFiltradas.length} ${t.mesasEncontradas}`}
          </span>
        </div>

        {carregando ? (
          <div className="text-center py-12 text-slate-500 text-sm">{t.buscandoDados}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mesasFiltradas.map((mesa) => (
              <CardMesa key={mesa.id} mesa={mesa} copiado={copiado} onCopiar={copiarCupom} t={t} />
            ))}
          </div>
        )}
      </section>

      {/* TABELA COMPARATIVA */}
      <section id="comparativo" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-800/60">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📊</span> {t.tituloComparativo}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.descComparativo}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-slate-300 min-w-[920px]">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4 pl-6 w-[200px]">{t.thMesa}</th>
                  <th className="p-4 w-[140px]">{t.thDesconto}</th>
                  <th className="p-4">{t.thPlataformas}</th>
                  <th className="p-4 w-[160px]">{t.thDrawdown}</th>
                  <th className="p-4 w-[120px]">{t.thCupom}</th>
                  <th className="p-4 text-right pr-6 w-[150px]">{t.thAcao}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mesasFiltradas.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition group">
                    <td className="p-4 pl-6 font-bold text-slate-100">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <LogoImage src={m.logo} alt={m.nome} className="w-8 h-8 rounded-lg bg-slate-950 p-1 border border-slate-800 flex-shrink-0" />
                        <span className="font-semibold text-slate-100">{m.nome}</span>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-extrabold text-emerald-400">{m.desconto}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[320px]">
                        {m.plataformas && m.plataformas.length > 0 ? (
                          m.plataformas.map((plat, idx) => {
                            const logoPlat = LOGOS_PLATAFORMAS[plat];
                            return (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md bg-slate-950 text-slate-200 border border-slate-800 font-medium whitespace-nowrap shadow-sm"
                              >
                                {logoPlat && (
                                  <img
                                    src={logoPlat}
                                    alt={plat}
                                    className="w-3.5 h-3.5 rounded-sm object-contain"
                                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                  />
                                )}
                                {plat}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-xs text-slate-500">Futures</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-200 border border-slate-700/50">
                        {m.drawdown}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <code className="bg-slate-950 px-2.5 py-1 rounded text-xs font-mono text-emerald-400 border border-slate-800">
                        {m.cupom}
                      </code>
                    </td>
                    <td className="p-4 text-right pr-6 whitespace-nowrap">
                      <a
                        href={m.link_afiliado}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
                      >
                        {t.btnAcessarSite}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SEÇÃO 50/50: CALENDÁRIO ECONÔMICO + FEED DE NOTÍCIAS EM TEMPO REAL */}
      <section id="noticias" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-800/60">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>⚡</span> {t.tituloNoticias}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.descNoticias}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://br.investing.com/economic-calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400 transition flex items-center gap-1.5"
            >
              {t.abrirInvesting}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col h-[520px] shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                📅 {t.calEconomico}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {t.aoVivo}
              </span>
            </div>
            <div className="flex-1 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <iframe
                src="https://sslecal2.investing.com/?defaultFont=%23000000&innerBorderColor=%23e5e7eb&columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=5&calType=week&timeZone=12&lang=12&importance=2,3"
                width="100%"
                height="100%"
                frameBorder="0"
                allowTransparency={true}
                title="Calendário Econômico EUA - Investing.com"
              ></iframe>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col h-[520px] shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                📢 {t.feedNoticias}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE BREAKING NEWS
              </span>
            </div>
            <div className="flex-1 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <iframe
                src="https://feed.financialjuice.com/widgets/headlines.aspx?wtype=NEWS&mode=Dark&width=100%25&height=100%25&backC=0f172a&fontC=e2e8f0&affurl="
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="yes"
                title="Feed de Notícias em Tempo Real - Financial Juice"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: CONTEÚDOS & MÍDIAS */}
      <section id="conteudo" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-800/60">
        <div className="mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📺</span> {t.tituloMidias}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.descMidias}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/PJj3DLT9J1w"
                  title="Explicando como funcionam as Mesas Proprietarias"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="font-bold text-sm text-slate-100">Explicando Mesas Proprietárias</h3>
              <p className="text-xs text-slate-400 mt-1">Assista diretamente aqui sobre regras, aprovação e payout no mercado americano.</p>
            </div>
            <a
              href="https://www.youtube.com/@BolsaAmericana"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl py-2.5 text-xs transition shadow-lg shadow-red-600/20"
            >
              {t.btnYoutube}
            </a>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-800">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/videoseries?list=PL7fT4LKG0FB-_UAs4p2lomtMlc9eYFhl_"
                  title="Playlist Configuração de Plataformas"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="font-bold text-sm text-slate-100">Configuração de Plataformas</h3>
              <p className="text-xs text-slate-400 mt-1">Aulas práticas de NinjaTrader, Tradovate, BlackArrow e Rithmic.</p>
            </div>
            <a
              href="https://youtube.com/playlist?list=PL7fT4LKG0FB-_UAs4p2lomtMlc9eYFhl_&si=bPCutvdns5410Q9W"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl py-2.5 text-xs transition border border-slate-700"
            >
              {t.btnPlaylist}
            </a>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    📸
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-100">Instagram Oficial</h3>
                    <a
                      href="https://www.instagram.com/traderfunding_mesausa/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-emerald-400 font-mono hover:underline"
                    >
                      @traderfunding_mesausa
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={slideAnterior}
                    aria-label="Anterior"
                    className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={proximoSlide}
                    aria-label="Próximo"
                    className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group">
                <div className="aspect-video w-full relative overflow-hidden">
                  <img
                    src={POSTS_INSTAGRAM[slideAtual].imagem}
                    alt={POSTS_INSTAGRAM[slideAtual].titulo}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-md tracking-wider">
                    {POSTS_INSTAGRAM[slideAtual].tag}
                  </span>
                </div>

                <div className="p-3.5 pt-2">
                  <h4 className="font-bold text-sm text-slate-100 leading-snug">
                    {POSTS_INSTAGRAM[slideAtual].titulo}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {POSTS_INSTAGRAM[slideAtual].descricao}
                  </p>
                </div>

                <div className="flex justify-center gap-1.5 pb-3">
                  {POSTS_INSTAGRAM.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSlideAtual(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === slideAtual ? 'w-5 bg-emerald-400' : 'w-1.5 bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <a
              href="https://www.instagram.com/traderfunding_mesausa/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-center bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold rounded-xl py-2.5 text-xs transition shadow-md hover:opacity-95"
            >
              {t.btnInstagram}
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO: PARCERIAS OFICIAIS NINJATRADER & KINETICK */}
      <section id="parcerias" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 border-t border-slate-800/60">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                {t.ecosistemaOficial}
              </span>
              <h3 className="text-lg font-bold text-slate-100">
                {t.tituloParcerias}
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                {t.descParcerias}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <a
                href="https://ninjatraderdomesticvendor.sjv.io/4G4WBn"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 px-4 py-3 rounded-xl flex items-center gap-3 transition"
              >
                <img src="https://ninjatrader.com/favicon.ico" alt="NinjaTrader Logo" className="w-6 h-6 object-contain" />
                <div className="text-left">
                  <span className="text-xs font-bold block text-slate-100">NinjaTrader</span>
                  <span className="text-[10px] text-slate-500">{t.plataformaRecomendada}</span>
                </div>
              </a>
              <a
                href="https://ninjatraderdomesticvendor.sjv.io/4G4WBn"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 px-4 py-3 rounded-xl flex items-center gap-3 transition"
              >
                <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                  K
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block text-slate-100">Kinetick Data</span>
                  <span className="text-[10px] text-slate-500">{t.dadosTempoReal}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CHAT IA INTELIGENTE */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatAberto ? (
          <button
            onClick={() => setChatAberto(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3.5 rounded-2xl shadow-2xl font-bold flex items-center gap-2 transition hover:scale-105"
          >
            <span className="text-xl">🤖</span>
            <span className="text-xs font-black hidden sm:inline">{t.assistenteIa}</span>
          </button>
        ) : (
          <div className="bg-slate-900 border border-slate-800 w-[330px] sm:w-[380px] h-[480px] rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
            <div className="bg-slate-950 p-3.5 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-100">{t.assistenteTitulo}</span>
              </div>
              <button
                onClick={() => setChatAberto(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-2 bg-slate-950/60 border-b border-slate-800/80 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                onClick={() => processarPergunta(t.perguntaCupomApex)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg whitespace-nowrap border border-slate-700/50"
              >
                {t.duvidasCupom}
              </button>
              <button
                onClick={() => processarPergunta(t.perguntaDrawdown)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg whitespace-nowrap border border-slate-700/50"
              >
                {t.duvidasDrawdown}
              </button>
              <button
                onClick={() => processarPergunta(t.perguntaPayout)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg whitespace-nowrap border border-slate-700/50"
              >
                {t.duvidasPayout}
              </button>
            </div>

            <div ref={chatScrollRef} className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
              {mensagens.map((m, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-line ${
                    m.autor === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-medium ml-auto rounded-br-none'
                      : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.texto}
                </div>
              ))}
              {enviandoIa && (
                <div className="bg-slate-950 text-slate-400 p-2.5 rounded-xl border border-slate-800 w-fit text-[11px] animate-pulse">
                  Analisando regras...
                </div>
              )}
            </div>

            <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder={t.placeholderChat}
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && processarPergunta(inputChat)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => processarPergunta(inputChat)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-2 rounded-xl font-bold text-xs"
              >
                {t.btnEnviar}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL LIGHTBOX */}
      {imagemExpandida && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setImagemExpandida(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setImagemExpandida(null)}
              className="absolute -top-10 right-0 sm:-right-8 text-slate-400 hover:text-white bg-slate-900/80 p-2 rounded-full border border-slate-800 transition"
              title="Fechar (Esc)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={imagemExpandida.url}
              alt={imagemExpandida.titulo}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-slate-800"
            />

            {imagemExpandida.titulo && (
              <p className="text-slate-300 text-xs sm:text-sm mt-3 font-semibold text-center bg-slate-950/80 px-4 py-1.5 rounded-lg border border-slate-800">
                {imagemExpandida.titulo}
              </p>
            )}
          </div>
        </div>
      )}

      {/* FOOTER & DECLARAÇÃO DE RISCO */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="space-y-4 text-slate-400 leading-relaxed border-b border-slate-800/80 pb-6 text-[11px]">
            <h4 className="text-slate-200 font-bold text-xs uppercase tracking-wide">Declaração de Risco</h4>
            <p>
              Negociar futuros e forex traz riscos substanciais e não é para todos os investidores. Um investidor pode perder todo ou mais o investimento inicial. Capital de risco é dinheiro que pode ser perdido sem comprometer a segurança financeira ou o estilo de vida da pessoa. Somente capital de risco deve ser usado para negociação, e somente aqueles com capital de risco suficiente devem considerar a negociação. Resultados passados não são necessariamente indicativos de resultados futuros.
            </p>

            <h5 className="text-slate-300 font-semibold text-[11px] pt-2">Divulgação de desempenho hipotético</h5>
            <p>
              Os resultados de desempenho hipotéticos têm muitas limitações inerentes, algumas das quais são descritas abaixo. nenhuma representação está sendo feita de que qualquer conta terá ou provavelmente obterá lucros ou perdas semelhantes aos mostrados; na verdade, frequentemente existem diferenças acentuadas entre os resultados de desempenho hipotéticos e os resultados reais subsequentemente alcançados por qualquer programa de negociação específico.
            </p>

            <h5 className="text-slate-300 font-semibold text-[11px] pt-2">Divulgação de depoimentos</h5>
            <p>
              Divulgação de depoimentos: Os depoimentos que aparecem neste site são de nossos clientes mas não são uma garantia de desempenho ou sucesso futuro.
            </p>

            <h5 className="text-slate-300 font-semibold text-[11px] pt-2">Risk Disclosure</h5>
            <p>
              Futures and forex trading contains substantial risk and is not for every investor. An investor could potentially lose all or more than the initial investment. Risk capital is money that can be lost without jeopardizing ones’ financial security or lifestyle. Only risk capital should be used for trading and only those with sufficient risk capital should consider trading. Past performance is not necessarily indicative of future results.
            </p>

            <h5 className="text-slate-300 font-semibold text-[11px] pt-2">Hypothetical Risk Disclosure</h5>
            <p>
              Hypothetical performance results have many inherent limitations, some of which are described below. No representation is being made that any account will or is likely to achieve profits or losses similar to those shown; in fact, there are frequently sharp differences between hypothetical performance results and the actual results subsequently achieved by any particular trading program.
            </p>
          </div>

          <div className="text-center text-slate-500 text-xs">
            © {new Date().getFullYear()} Mesa Prop Americana - Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

function CardCampanha({ campanha, onExpandirImagem, t }: { campanha: Campanha; onExpandirImagem: (url: string, titulo: string) => void; t: any }) {
  const urlImagem = campanha.imagem_url || campanha.imagem || campanha.banner;
  const urlLink = extrairUrlLimpa(campanha.link_direcionamento || campanha.link);

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5 group">
      <div>
        <div className="w-full relative bg-slate-950 border-b border-slate-800 flex items-center justify-center overflow-hidden">
          <CampanhaImage 
            src={urlImagem} 
            alt={campanha.titulo || 'Campanha'} 
            onExpandir={() => urlImagem && onExpandirImagem(urlImagem, campanha.titulo || '')}
          />
          {campanha.cor_destaque && (
            <span
              className="absolute top-3 left-3 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-md tracking-wider uppercase z-10 shadow-md pointer-events-none"
              style={{ backgroundColor: campanha.cor_destaque }}
            >
              Destaque
            </span>
          )}
        </div>

        {campanha.titulo && (
          <div className="p-5">
            <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition">
              {campanha.titulo}
            </h3>
            {campanha.descricao && (
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {campanha.descricao}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="p-5 pt-3">
        <a
          href={urlLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-500/10"
        >
          {t.saibaMais}
        </a>
      </div>
    </div>
  );
}

function CampanhaImage({ src, alt, onExpandir }: { src?: string; alt: string; onExpandir: () => void }) {
  const [erro, setErro] = useState(!src);

  useEffect(() => {
    setErro(!src);
  }, [src]);

  if (erro || !src) {
    return (
      <div className="w-full h-48 flex flex-col items-center justify-center bg-slate-950/80 p-4 text-center">
        <span className="text-2xl mb-1">📢</span>
        <span className="text-[11px] font-semibold text-slate-500">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onClick={onExpandir}
      title="Clique para ampliar"
      className="w-full h-auto max-h-[380px] object-contain cursor-zoom-in transition-transform duration-500 group-hover:scale-102"
      onError={() => setErro(true)}
    />
  );
}

function CardMesa({ mesa, copiado, onCopiar, t }: { mesa: MesaProprietaria; copiado: string | null; onCopiar: (c: string, id: string) => void; t: any }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/5 group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <LogoImage src={mesa.logo} alt={mesa.nome} className="w-12 h-12 rounded-xl bg-slate-950 p-2 border border-slate-800/80 group-hover:border-slate-700" />
            <div>
              <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition">{mesa.nome}</h3>
              <span className={`inline-block text-[10px] px-2 py-0.5 rounded border mt-1 font-semibold ${mesa.cor_tag}`}>
                {mesa.avaliacao}
              </span>
            </div>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold text-xs px-2.5 py-1 rounded-lg">
            {mesa.desconto}
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-400 my-5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Drawdown:</span>
            <span className="text-slate-200 font-semibold">{mesa.drawdown}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Profit Split:</span>
            <span className="text-slate-200 font-semibold">{mesa.profit_split}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between bg-slate-950 border border-dashed border-slate-800 rounded-xl p-2.5">
          <div className="pl-2">
            <span className="text-[10px] text-slate-500 block uppercase font-medium">{t.cupomDesconto}</span>
            <span className="font-mono font-bold text-emerald-400 tracking-wider text-sm">{mesa.cupom}</span>
          </div>
          <button
            onClick={() => onCopiar(mesa.cupom, mesa.id)}
            disabled={mesa.cupom.toLowerCase().includes('sem cupom')}
            className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-200 font-semibold px-3.5 py-2 rounded-lg transition"
          >
            {copiado === mesa.id ? t.copiado : mesa.cupom.toLowerCase().includes('sem cupom') ? t.semCupom : t.copiar}
          </button>
        </div>

        <a
          href={mesa.link_afiliado}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3 rounded-xl text-sm transition shadow-lg shadow-emerald-500/10"
        >
          {t.aproveitarOferta}
        </a>
      </div>
    </div>
  );
}

function LogoImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [erro, setErro] = useState(false);

  if (erro) {
    return (
      <div className={`${className} flex items-center justify-center font-bold text-emerald-400 text-xs bg-slate-900 border border-slate-800`}>
        {alt.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErro(true)}
    />
  );
}