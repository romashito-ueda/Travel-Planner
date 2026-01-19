import { Recommendation } from "@/lib/types";
import { useGooglePlace } from "@/hooks/useGooglePlace";
import { MapPin, ExternalLink, ImageOff, Star, Loader2 } from "lucide-react";

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const { data, loading, hasApiKey } = useGooglePlace(rec.searchQuery);

  // Fallback if no API key or no photo found
  const showFallback = !hasApiKey || (!loading && !data?.photoUrl);
  
  // Use data from API if available, otherwise fall back to static text
  const displayTitle = data?.name || rec.title;
  const displayImage = data?.photoUrl || rec.image; // rec.image might be empty string now

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Image Area */}
      <div className="aspect-video w-full bg-muted relative overflow-hidden group">
        {loading ? (
           <div className="w-full h-full flex items-center justify-center bg-muted">
             <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
           </div>
        ) : showFallback && !rec.image ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground p-4 text-center">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs">No preview available</span>
          </div>
        ) : (
          <img 
            src={displayImage} 
            alt={displayTitle} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            onError={(e) => {
              // Fallback on error
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              // We could insert an icon here via DOM, but CSS fallback is tricky in React without state.
              // For simplicity, just hiding the broken image reveals the background.
            }}
          />
        )}
        
        {/* Rating Badge */}
        {data?.rating && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {data.rating}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div>
          <h3 className="font-bold text-lg leading-tight">{rec.title}</h3>
          {data?.name && data.name !== rec.title && (
             <p className="text-xs text-muted-foreground mt-0.5">{data.name}</p>
          )}
        </div>
        
        <p className="text-sm text-foreground/80 leading-relaxed flex-1">
          {rec.description}
        </p>

        {/* Attributions */}
        {data?.attributions && data.attributions.length > 0 && (
          <p className="text-[10px] text-muted-foreground truncate">
            Photo by {data.attributions.join(', ')}
          </p>
        )}

        {/* Action Button */}
        {rec.searchQuery && (
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rec.searchQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-primary bg-primary/5 border border-primary/10 px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors w-full mt-auto"
          >
            <MapPin className="w-3.5 h-3.5" />
            Google Mapsで見る
            <ExternalLink className="w-3 h-3 opacity-50 ml-auto" />
          </a>
        )}
      </div>
    </div>
  );
}
