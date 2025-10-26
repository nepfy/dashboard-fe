"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CloseIcon from "#/components/icons/CloseIcon";

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
  error?: string;
}

interface PexelsGalleryProps {
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

export default function PexelsGallery({
  onClose,
  onSelectImage,
}: PexelsGalleryProps) {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const debouncedSearch = (searchQuery: string, pageNum: number = 1) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchPhotos(searchQuery, pageNum);
    }, 300);
  };

  const searchPhotos = async (searchQuery: string, pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        query: searchQuery,
        page: pageNum.toString(),
        per_page: "15",
      });

      const response = await fetch(`/api/pexels/search?${params}`);
      const data: PexelsResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch images");
      }

      if (pageNum === 1) {
        setPhotos(data.photos);
      } else {
        setPhotos((prev) => [...prev, ...data.photos]);
      }

      setHasMore(data.photos.length === 15);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Load curated photos on mount
  useEffect(() => {
    searchPhotos("");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    debouncedSearch(query, 1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      debouncedSearch(query, page + 1);
    }
  };

  const handleImageSelect = (photo: PexelsPhoto) => {
    onSelectImage(photo.src.large);
    onClose();
  };

  return (
    <div className="bg-white-neutral-light-100 flex h-full w-full flex-col pt-2">
      {/* Header */}
      <div
        className="mb-6 flex w-full flex-shrink-0 items-center justify-between border-b border-b-[#E0E3E9] pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-lg font-medium text-[#2A2A2A]">Galeria</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-[4px] border border-[#DBDDDF] bg-[#F7F6FD] p-1.5"
        >
          <CloseIcon width="12" height="12" fill="#1C1A22" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex-shrink-0">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar imagem..."
            className="w-full rounded-[4px] border border-[#DBDDDF] bg-[#F6F8FA] px-3 py-2 text-sm font-medium text-[#1C1C1C] placeholder:text-[#7C7C7C] focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </form>
      </div>

      {/* Image Grid */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        {loading && photos.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
              Carregando imagens...
            </div>
          </div>
        ) : error ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray-500">Nenhuma imagem encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => handleImageSelect(photo)}
                className="group relative h-[95px] w-[160px] cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 hover:grayscale"
              >
                <Image
                  src={photo.src.large}
                  alt={photo.alt || photo.photographer}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && photos.length > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-white-neutral-light-100 border-white-neutral-light-300 button-inner text-white-neutral-light-900 hover:bg-white-neutral-light-200 flex w-full transform cursor-pointer items-center justify-center rounded-[12px] border px-6 py-3.5 text-sm font-medium transition-all duration-200"
            >
              {loading ? "Carregando..." : "Carregar mais"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
