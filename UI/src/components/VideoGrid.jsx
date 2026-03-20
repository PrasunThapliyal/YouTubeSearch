import React from 'react';
import { useGetLikedVideosQuery } from '../store/apiSlice';

export default function VideoGrid() {
  const { data: videos, isLoading, error } = useGetLikedVideosQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <p className="text-sm text-red-700">
          Error loading videos. {error.data ? (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)) : "The Google Auth Token might be expired or not fully provisioned."}
        </p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return <p className="text-gray-500 text-center py-10">No liked videos found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-0">
      {videos.map(video => (
        <a 
          key={video.id} 
          href={video.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="aspect-video w-full bg-gray-200 overflow-hidden">
            <img 
              src={video.thumbnailUrl} 
              alt={video.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2" title={video.title}>{video.title}</h3>
            {video.description && (
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">{video.description}</p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
