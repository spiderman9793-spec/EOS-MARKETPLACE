import { X } from 'lucide-react';

const content = {
  about: {
    title: 'About Eos',
    body: 'Eos is a campus-exclusive, zero-fee marketplace built by students, for students. We connect verified university communities to buy and sell textbooks, electronics, furniture, and more—safely and affordably.',
  },
  privacy: {
    title: 'Privacy Policy',
    body: 'Eos only collects essential information required to verify student status and facilitate transactions. We never sell your data. Your campus email and profile information are used solely to maintain a trusted community.',
  },
  terms: {
    title: 'Terms of Service',
    body: 'By using Eos, you agree to verify your student identity, treat community members with respect, and comply with your university\'s policies. Eos is provided "as is" without warranties. All sales are final between users.',
  },
};

export default function InfoModal({ isOpen, onClose, type = 'about' }) {
  if (!isOpen) return null;

  const { title, body } = content[type];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 p-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">{title}</h2>
        <p className="text-slate-600 leading-relaxed">{body}</p>

        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}