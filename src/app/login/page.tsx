'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'sucesso'; texto: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMensagem({ tipo: 'erro', texto: 'E-mail ou senha inválidos. Verifique suas credenciais.' });
      } else {
        router.push('/dashboard');
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMensagem({ tipo: 'erro', texto: error.message });
      } else {
        setMensagem({ tipo: 'sucesso', texto: 'Cadastro realizado! Verifique seu e-mail para confirmar a conta.' });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans flex flex-col justify-between">
      {/* HEADER SIMPLES */}
      <header className="border-b border-slate-800 bg-[#0B0F17]/80 px-6 py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-xl">
            M
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            MESA PROP <span className="text-emerald-400 font-light">AMERICANA</span>
          </span>
        </a>
        <a href="/" className="text-xs text-slate-400 hover:text-emerald-400 transition">
          ← Voltar ao site
        </a>
      </header>

      {/* CARD DE AUTENTICAÇÃO */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-white">
              {isLogin ? 'Acessar Área do Trader' : 'Criar Conta Gratuita'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Acesse cupons exclusivos, materiais de apoio e simuladores de risco.
            </p>
          </div>

          {mensagem && (
            <div
              className={`p-3 rounded-xl text-xs mb-4 font-medium ${
                mensagem.tipo === 'erro'
                  ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              }`}
            >
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-xl text-sm transition shadow-lg shadow-emerald-500/10 disabled:opacity-50"
            >
              {loading ? 'Carregando...' : isLogin ? 'Entrar no Painel' : 'Concluir Cadastro'}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-800/80 pt-4">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setMensagem(null);
              }}
              className="text-xs text-slate-400 hover:text-emerald-400 transition"
            >
              {isLogin ? 'Ainda não tem conta? Cadastre-se' : 'Já possui uma conta? Faça Login'}
            </button>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-[11px] text-slate-600">
        © {new Date().getFullYear()} Mesa Prop Americana. Todos os direitos reservados.
      </footer>
    </div>
  );
}