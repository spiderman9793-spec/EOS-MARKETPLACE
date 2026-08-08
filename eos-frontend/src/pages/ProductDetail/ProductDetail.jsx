import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, MapPin, Star, MessageCircle, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useAuthStore((s) => s.listings.find((p) => p.id === id));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-slate-600 text-lg mb-4">Product not found</p>
        <Button onClick={() => navigate('/browse')}>Back to browse</Button>
      </div>
    );
  }

  const makeOffer = () => {
    const value = prompt('Enter your offer amount');
    const offer = Number(value);
    if (!value || Number.isNaN(offer) || offer <= 0) {
      toast.error('Please enter a valid offer amount');
      return;
    }
    const platformFee = Math.round(offer * 0.05 * 100) / 100;
    const sellerPayout = Math.round((offer - platformFee) * 100) / 100;
    toast.success(
      `Offer sent: $${offer}. Fee $${platformFee} • Seller payout $${sellerPayout}`
    );
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 pt-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-sm rounded-2xl overflow-hidden">
            <div className="aspect-[16/9] bg-slate-100">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="px-6 pb-4 pt-2">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === selectedImageIndex
                          ? 'border-[#0066FF] shadow-md'
                          : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-[#0066FF]">
                  {product.category}
                </span>
                <span className="text-xs text-slate-400">{product.condition}</span>
              </div>

              <h1 className="text-2xl font-bold text-[#0f172a] mb-2">
                {product.title}
              </h1>

              <div className="flex items-end gap-3 mb-4">
                <p className="text-3xl font-bold text-[#0066FF]">${product.price}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <p className="text-sm text-slate-400 line-through">
                    ${product.originalPrice}
                  </p>
                )}
              </div>

              <p className="text-slate-600 leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(product.specs || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 border border-white/40 text-xs font-medium text-slate-600"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">
                      {product.seller.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {product.seller.rating}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>{product.seller.reviewsCount} reviews</span>
                      <span className="text-slate-300">•</span>
                      <span>{product.seller.college}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100/70 hover:text-red-500 transition-colors" aria-label="Save">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100/70 hover:text-slate-700 transition-colors" aria-label="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <MapPin className="w-4 h-4" />
                {product.pickupSpot}
                <span className="text-slate-300">•</span>
                {product.campus}
                <span className="text-slate-300">•</span>
                {product.timeAgo}
                <span className="text-slate-300">•</span>
                {product.distance}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/chat')}
                >
                  <MessageCircle className="w-5 h-5" />
                  Message Seller
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  onClick={makeOffer}
                >
                  Make Offer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
