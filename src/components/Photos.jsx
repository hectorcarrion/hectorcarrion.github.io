import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import { myPics } from '../images/photos';

const possibleRotations = [1.3, -1.3, 1.3, -1.3, 1.3, -1.3];

const Photo = ({ img, title, alt, idx }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div
      key={img.src}
      initial={{ scale: 1, rotate: possibleRotations[idx % possibleRotations.length], opacity: 0 }}
      whileHover={{ scale: 1.1, rotate: 0, transition: { duration: 0.2 } }}
      whileInView={{ opacity: 1, transition: { delay: idx / 100 } }}
      viewport={{ once: true }}
      onHoverStart={() => setIsVisible(true)}
      onHoverEnd={() => setIsVisible(false)}
      className={clsx(
        'relative aspect-[9/10] w-44 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl',
      )}
    >
      <Image
        src={img}
        alt={alt}
        sizes="(min-width: 640px) 18rem, 11rem"
        className="absolute inset-0 h-full w-full object-cover"
        placeholder="blur"
      />
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 w-full bg-gradient-to-t from-black/75 via-black/0 flex items-end"
          >
            <h3 className="px-3 py-2 text-xs font-bold text-white">{title}</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Photos = () => {
  return (
    <div className="my-8">
      <div className="hide-scrollbar -my-4 flex gap-8 overflow-y-auto py-4 px-8">
        {myPics.map((myPic, index) => (
          <Photo
            key={myPic.img.src}
            img={myPic.img}
            title={myPic.title}
            alt={myPic.alt}
            idx={index}
          />
        ))}
      </div>
    </div>
  );
};
