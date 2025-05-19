import React from 'react';
import { motion } from 'framer-motion';

const TahapPengenalanCarousel = () => {
  // Contoh data dengan lebih dari 4 item untuk menunjukkan animasi
  const tahapData = [
    { id: 1, title: 'Tahap Pengenalan', subtitle: '12 Orang' },
    { id: 2, title: 'Tahap Pengenalan', subtitle: '12 Orang' },
    { id: 3, title: 'Tahap Pengenalan', subtitle: '12 Orang' },
    { id: 4, title: 'Tahap Pengenalan', subtitle: '12 Orang' },
    { id: 5, title: 'Tahap Pengenalan', subtitle: '12 Orang' },
    { id: 6, title: 'Tahap Pengenalan', subtitle: '12 Orang' },
    { id: 7, title: 'Tahap Pengenalan', subtitle: '12 Orang' },
  ];

  const shouldAnimate = tahapData.length > 4;

  // Card component
  const Card = ({ item }) => (
    <div className="flex-shrink-0 w-64 h-32 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-1">
        {item.title}
      </h3>
      <p className="text-sm text-gray-500">
        {item.subtitle}
      </p>
    </div>
  );

  return (
    <div className="w-full py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {shouldAnimate ? (
          // Animated carousel for more than 4 items
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: ['0%', '-50%'],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 20,
                  ease: 'linear',
                },
              }}
              style={{
                width: `${(tahapData.length * 2) * 280}px`, // 280px = card width + gap
              }}
            >
              {/* Render items twice for seamless loop */}
              {[...tahapData, ...tahapData].map((item, index) => (
                <Card key={`${item.id}-${index}`} item={item} />
              ))}
            </motion.div>
          </div>
        ) : (
          // Static grid for 4 or fewer items
          <div className="flex flex-wrap justify-center gap-6">
            {tahapData.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
      
      {/* Control to test with different amounts of data */}
      
    </div>
  );
};

export default TahapPengenalanCarousel;