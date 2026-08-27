import React from 'react';

export default function OverviewVideo() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <video
          controls
          className="w-full rounded shadow"
          src="/overviewvideo.mp4"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}
