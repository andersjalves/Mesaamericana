export interface MesaProprietaria {
  id: string;
  nome: string;
  logo: string;
  desconto: string;
  cupom: string;
  linkAfiliado: string;
  destaque: boolean;
  drawdown: string;
  profitSplit: string;
  avaliacao: string;
  corTag: string;
  plataformas: string[]; // Alterado para Array para mapear os ícones individualmente
}

// Mapeamento automático dos domínios para carregar o ícone de cada plataforma via Google Favicon
export const LOGOS_PLATAFORMAS: Record<string, string> = {
  'NinjaTrader': 'https://www.google.com/s2/favicons?domain=ninjatrader.com&sz=64',
  'Tradovate': 'https://www.google.com/s2/favicons?domain=tradovate.com&sz=64',
  'TradingView': 'https://www.google.com/s2/favicons?domain=tradingview.com&sz=64',
  'Rithmic': 'https://www.google.com/s2/favicons?domain=rithmic.com&sz=64',
  'DXTrade': 'https://www.google.com/s2/favicons?domain=ftmo.com&sz=64',
  'Match-Trader': 'https://www.google.com/s2/favicons?domain=match-trader.com&sz=64',
  'MetaTrader 5': 'https://www.google.com/s2/favicons?domain=metatrader5.com&sz=64',
  'MetaTrader': 'https://www.google.com/s2/favicons?domain=metatrader4.com&sz=64',
  'BlackArrow': 'https://www.google.com/s2/favicons?domain=nelogica.com.br&sz=64',
  'Finamark': 'https://www.google.com/s2/favicons?domain=finamark.com&sz=64',
  'Profit': 'https://www.google.com/s2/favicons?domain=nelogica.com.br&sz=64'
};

export const MESAS_MOCK: MesaProprietaria[] = [
  {
    id: 'apex',
    nome: 'Apex Trader Funding',
    logo: 'https://www.google.com/s2/favicons?domain=apextraderfunding.com&sz=128',
    desconto: 'Até 90% OFF',
    cupom: 'ANDMP',
    linkAfiliado: 'https://apextraderfunding.com/member/aff/go/andersjalves?c=IUKVLNHX',
    destaque: true,
    drawdown: 'Trailing',
    profitSplit: '100% dos 1º $25k',
    avaliacao: '1 Etapa',
    corTag: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    plataformas: ['NinjaTrader', 'Tradovate']
  },
  {
    id: 'mff',
    nome: 'My Funded Futures (MFF)',
    logo: 'https://www.google.com/s2/favicons?domain=myfundedfutures.com&sz=128',
    desconto: 'Até 80% OFF',
    cupom: 'AND5',
    linkAfiliado: 'https://myfundedfutures.com/?ref=1866',
    destaque: true,
    drawdown: 'EOD / Estático',
    profitSplit: '100% dos 1º $10k',
    avaliacao: '1 Etapa / Sim-to-Funded',
    corTag: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    plataformas: ['Tradovate', 'NinjaTrader']
  },
  {
    id: 'tradeify',
    nome: 'Tradeify',
    logo: 'https://www.google.com/s2/favicons?domain=tradeify.co&sz=128',
    desconto: 'Promocional',
    cupom: 'ANDMP',
    linkAfiliado: 'https://tradeify.co/?ref=0GT0Q6YW',
    destaque: true,
    drawdown: 'Estático / Growth',
    profitSplit: '90%',
    avaliacao: '1 Etapa / Direct',
    corTag: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    plataformas: ['NinjaTrader', 'Tradovate']
  },
  {
    id: 'bulenox',
    nome: 'Bulenox',
    logo: 'https://www.google.com/s2/favicons?domain=bulenox.com&sz=128',
    desconto: 'Promocional',
    cupom: 'AND89',
    linkAfiliado: 'https://bulenox.com/member/aff/go/andersja',
    destaque: false,
    drawdown: 'EOD (End of Day)',
    profitSplit: '100% dos 1º $10k',
    avaliacao: '1 Etapa',
    corTag: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    plataformas: ['NinjaTrader', 'Rithmic']
  },
  {
    id: 'earn2trade',
    nome: 'Earn2Trade',
    logo: 'https://www.google.com/s2/favicons?domain=earn2trade.com&sz=128',
    desconto: 'Oferta Especial',
    cupom: 'ANDER',
    linkAfiliado: 'https://www.earn2trade.com/?a_pid=ANDER',
    destaque: false,
    drawdown: 'Trailing (EOD)',
    profitSplit: '80%',
    avaliacao: 'Gauntlet Mini / TCP',
    corTag: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    plataformas: ['NinjaTrader', 'Finamark']
  },
  {
    id: 'lvl',
    nome: 'LVL Funding',
    logo: 'https://www.google.com/s2/favicons?domain=lvlfunding.trade&sz=128',
    desconto: 'Desconto Ativo',
    cupom: 'ANDMP',
    linkAfiliado: 'https://lvlfunding.trade/pt/',
    destaque: false,
    drawdown: 'Estático',
    profitSplit: 'Até 90%',
    avaliacao: '1 Etapa',
    corTag: 'bg-cyan-500/10 text-cyan-400 border-cyan-400/20',
    plataformas: ['BlackArrow', 'DXTrade']
  },
  {
    id: 'tradeday',
    nome: 'TradeDay',
    logo: 'https://www.google.com/s2/favicons?domain=tradeday.com&sz=128',
    desconto: '20% OFF',
    cupom: 'ANDMP',
    linkAfiliado: 'https://www.tradeday.com/?a_aid=ANDMP',
    destaque: false,
    drawdown: 'Trailing Real-time',
    profitSplit: '100% dos 1º $10k',
    avaliacao: '1 Etapa (Direct)',
    corTag: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    plataformas: ['Tradovate', 'NinjaTrader']
  },
  {
    id: 'blusky',
    nome: 'BluSky Trading',
    logo: 'https://www.google.com/s2/favicons?domain=blusky.pro&sz=128',
    desconto: '30% OFF',
    cupom: '30off',
    linkAfiliado: 'https://trader.blusky.pro/checkout?referral_id=ANDMP',
    destaque: false,
    drawdown: 'Daily Hard Limit',
    profitSplit: '90%',
    avaliacao: '1 Etapa',
    corTag: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    plataformas: ['NinjaTrader', 'Rithmic']
  },
  {
    id: 'blueguardian',
    nome: 'Blue Guardian',
    logo: 'https://www.google.com/s2/favicons?domain=blueguardian.com&sz=128',
    desconto: 'Desconto Ativo',
    cupom: 'ANDMP',
    linkAfiliado: 'https://blueguardian.com/?afmc=ANDMP',
    destaque: false,
    drawdown: 'Balance Based',
    profitSplit: '85%',
    avaliacao: 'Unlimited',
    corTag: 'bg-blue-600/10 text-blue-300 border-blue-600/20',
    plataformas: ['DXTrade', 'Match-Trader']
  },
  {
    id: 'ylos',
    nome: 'Ylos Trading',
    logo: 'https://www.google.com/s2/favicons?domain=ylostrading.com&sz=128',
    desconto: 'Cupom Exclusivo',
    cupom: 'ANDMPATF',
    linkAfiliado: 'https://www.ylostrading.com/#a_aid=AND',
    destaque: false,
    drawdown: 'Trailing / EOD',
    profitSplit: 'Até 90%',
    avaliacao: '1 Etapa',
    corTag: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    plataformas: ['BlackArrow', 'Rithmic', 'NinjaTrader']
  },
  {
    id: 'mideglobal',
    nome: 'Mide Global',
    logo: 'https://www.google.com/s2/favicons?domain=gomideglobal.com&sz=128',
    desconto: 'Acesso Direto',
    cupom: 'Sem cupom',
    linkAfiliado: 'https://gomideglobal.com/?aff=A2AABF',
    destaque: false,
    drawdown: 'Regras da Mesa',
    profitSplit: 'Variável',
    avaliacao: 'Acesso Direto',
    corTag: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    plataformas: ['BlackArrow', 'MetaTrader 5']
  },
  {
    id: 'euroglobal',
    nome: 'Euro Global',
    logo: 'https://www.google.com/s2/favicons?domain=euroinvest.com.br&sz=128',
    desconto: 'Campanha Especial',
    cupom: 'Sem cupom',
    linkAfiliado: 'https://g.euroinvest.com.br/campaign/euro-global-andersonalves',
    destaque: false,
    drawdown: 'Regras Euro Global',
    profitSplit: 'Variável',
    avaliacao: 'Campanha Oficial',
    corTag: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    plataformas: ['BlackArrow', 'Profit', 'MetaTrader']
  }
];