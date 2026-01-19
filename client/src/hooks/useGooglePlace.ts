import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface PlaceDetails {
  photoUrl: string | null;
  name: string;
  address: string;
  rating?: number;
  attributions?: string[];
}

export function useGooglePlace(query: string | undefined) {
  const [data, setData] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || !API_KEY) return;

    const fetchPlace = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Text Search (New) to get Place ID
        const searchUrl = `https://places.googleapis.com/v1/places:searchText`;
        
        const searchRes = await fetch(searchUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': 'places.id,places.name,places.formattedAddress,places.rating,places.photos'
          },
          body: JSON.stringify({ textQuery: query })
        });

        if (!searchRes.ok) throw new Error('Search failed');
        const searchData = await searchRes.json();
        const place = searchData.places?.[0];

        if (!place) {
          setData(null);
          return;
        }

        // 2. Construct Photo URL if available
        let photoUrl = null;
        let attributions: string[] = [];
        
        if (place.photos && place.photos.length > 0) {
          const photoName = place.photos[0].name;
          // Build the photo URL directly. Note: This will be a redirect.
          // maxPx is required.
          photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=600&key=${API_KEY}`;
          
          if (place.photos[0].authorAttributions) {
             attributions = place.photos[0].authorAttributions.map((attr: any) => attr.displayName);
          }
        }

        setData({
          name: place.name,
          address: place.formattedAddress,
          rating: place.rating,
          photoUrl,
          attributions
        });

      } catch (err) {
        console.error('Google Places fetch error:', err);
        setError('Failed to load place data');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [query]);

  return { data, loading, error, hasApiKey: !!API_KEY };
}
