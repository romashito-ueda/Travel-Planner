import { TripData } from "@/lib/types";
import { MapPin, ExternalLink, Navigation } from "lucide-react";

interface MapListProps {
  data: TripData;
}

export default function MapList({ data }: MapListProps) {
  const getGoogleMapsLink = (address: string, name: string) => {
    const query = encodeURIComponent(`${name} ${address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="pb-24 pt-8 px-4 max-w-md mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold mb-2">Saved Places</h1>
        <p className="text-muted-foreground text-sm">Tap to open in Google Maps</p>
      </header>

      <div className="grid gap-4">
        {data.places.map((place, index) => (
          <a
            key={index}
            href={getGoogleMapsLink(place.address, place.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-card hover:bg-accent/5 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-1 group-hover:bg-blue-100 transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground group-hover:text-blue-700 transition-colors">
                  {place.nameJa || place.name}
                </h3>
                {place.nameJa && (
                  <p className="text-xs text-muted-foreground font-medium">
                    {place.name}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1 leading-snug">
                  {place.address}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-blue-500 mt-1" />
            </div>
          </a>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-muted/30 rounded-xl text-center border border-dashed border-border">
         <Navigation className="w-8 h-8 mx-auto text-muted-foreground mb-2 opacity-50" />
         <p className="text-sm text-muted-foreground">
           オフライン時は住所をコピーして地図アプリで使用してください。
         </p>
      </div>
    </div>
  );
}
