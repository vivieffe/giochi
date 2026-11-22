import React, { useState } from 'react';
import { Check, Copy, Download, ShieldCheck, X } from 'lucide-react';
import { sound } from '../utils/sound';

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDownload = async () => {
    sound.tap();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('./missione-9-renne.html');
      if (!res.ok) throw new Error('Impossibile caricare il file.');
      const html = await res.text();
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'missione-9-renne.html';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setErrorMsg('Errore durante il download del file HTML unico.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    sound.tap();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('./missione-9-renne.html');
      if (!res.ok) throw new Error('Impossibile leggere il file.');
      const html = await res.text();
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      setErrorMsg('Copia automatica non riuscita: usa il pulsante Scarica File Unico.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-[#FFFDF9] border border-slate-200 shadow-2xl overflow-hidden my-auto">
        <div className="px-6 py-4 bg-[#F5F1E8] border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
            <h2 className="font-display text-lg font-extrabold text-slate-900">
              File Unico HTML per Google Sites e Offline
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              sound.tap();
              onClose();
            }}
            className="rounded-xl bg-white border border-slate-200 p-2 text-slate-600 hover:text-slate-900 cursor-pointer"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm text-slate-700 leading-relaxed">
          <p className="font-medium">
            Questo gioco è pronto anche in formato <strong>file unico HTML + CSS + JavaScript</strong> (nessun
            server, nessun cookie, nessuna chiamata esterna, zero Google Apps Script): perfetto per la privacy dei bambini!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-4 py-3.5 cursor-pointer min-h-[48px] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Scarica missione-9-renne.html</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-3.5 cursor-pointer min-h-[48px] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Codice copiato!' : 'Copia codice HTML'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-bold text-rose-800">
              {errorMsg}
            </div>
          )}

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs sm:text-sm">
            <h3 className="font-display font-bold text-slate-900">Come usarlo senza costi e a prova di privacy:</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>
                <strong>Google Sites (senza Apps Script):</strong> apri la pagina su Google Sites, clicca{' '}
                <em>Inserisci → Incorpora → Incorpora codice</em>, incolla il codice HTML copiato e pubblica.
              </li>
              <li>
                <strong>100% Offline a casa o a scuola:</strong> scarica <code>missione-9-renne.html</code> e aprilo
                con un doppio clic su qualsiasi PC, Mac, Chromebook o chiavetta USB (funziona anche senza Wi-Fi!).
              </li>
              <li>
                <strong>Altre soluzioni gratuite e private:</strong> caricalo su <em>GitHub Pages</em> o{' '}
                <em>Netlify Drop</em> trascinando il file HTML nella pagina.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
