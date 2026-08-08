import { useState } from 'react';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { categories } from '../../mock/products';

const conditions = ['New', 'Like New', 'Good', 'Fair'];

export default function Sell() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Other');
  const [condition, setCondition] = useState('Good');
  const [description, setDescription] = useState('');

  const addImage = () => {
    const url = prompt('Paste an image URL');
    if (url && images.length < 5) {
      setImages((imgs) => [...imgs, url]);
    }
  };

  const removeImage = (idx) => setImages((imgs) => imgs.filter((_, i) => i !== idx));

  const isSubmitDisabled = images.length < 3;

  const submit = (e) => {
    e.preventDefault();
    // TODO: API call
    alert('Listing created!');
    navigate('/dashboard');
  };

  const numericPrice = Number(price) || 0;
  const platformFee = numericPrice ? Math.round(numericPrice * 0.05 * 100) / 100 : 0;
  const payout = numericPrice ? Math.round((numericPrice - platformFee) * 100) / 100 : 0;

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 pt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100/70 text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-[#0f172a]">New listing</h1>
          </div>

          <form onSubmit={submit} className="bg-white/80 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Photos</label>
              <div className="flex flex-wrap gap-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={addImage}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-[#0066FF] hover:text-[#0066FF] transition-colors"
                  >
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-xs">Add</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">Upload between 3 and 5 photos</p>
              {isSubmitDisabled && (
                <p className="text-xs text-red-500 mt-1">Please upload at least 3 photos</p>
              )}
            </div>

            <Field label="Title" required>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you selling?"
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                required
              />
            </Field>

            <Field label="Price ($)" required>
              <div className="space-y-2">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                  required
                />
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>Platform fee (5%): ${platformFee || '0.00'}</span>
                  <span>Seller payout: ${payout || '0.00'}</span>
                </div>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" required>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-slate-800"
                  required
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Condition" required>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-slate-800"
                  required
                >
                  {conditions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Description" required>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item…"
                rows={4}
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 resize-none"
                required
              />
            </Field>

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitDisabled}>
              Publish listing
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="px-4 py-3 rounded-xl bg-white/60 border border-slate-200 focus-within:border-[#0066FF] transition-colors">
        {children}
      </div>
    </div>
  );
}
