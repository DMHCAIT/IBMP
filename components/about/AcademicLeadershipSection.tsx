'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { GraduationCap, Users2 } from 'lucide-react';

const academicLeaders = [
  { name: 'Dr. Dany Bhugon', image: '/ibmp-doctors-images/Dr. Dany Bhugon.jpg' },
  { name: 'Dr. Karim Mahmoud', image: '/ibmp-doctors-images/Dr. Karim Mahmoud.jpg' },
  { name: 'Dr. Emil Shehata', image: '/ibmp-doctors-images/Dr. Emil Shehata.jpg' },
  { name: 'Dr. Md. Jaweed', image: '/ibmp-doctors-images/Dr. Md.Jaweed.jpg' },
  { name: 'Dr. Mohit Mann', image: '/ibmp-doctors-images/Dr. Mohit Mann.jpg' },
  { name: 'Dr. Gopambuj', image: '/ibmp-doctors-images/Dr. Gopambuj.jpg' },
  { name: 'Dr. Piranitha', image: '/ibmp-doctors-images/Dr. Piranitha.jpg' },
  { name: 'Dr. Nadezhda Magdeeva', image: '/ibmp-doctors-images/Dr. Nadezhda Magdeeva.jpg' },
  { name: 'Dr. Rohit Walwaikar', image: '/ibmp-doctors-images/Dr Rohit walwaikar.jpg' },
  { name: 'Dr. Sarika Gautam', image: '/ibmp-doctors-images/Dr Sarika Gautam.jpg' },
  { name: 'Dr. Rishabh', image: '/ibmp-doctors-images/Dr. Rishabh.jpg' },
];

const scrollingLeaders = [...academicLeaders, ...academicLeaders];

export default function AcademicLeadershipSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-gradient-to-b from-primary-50 via-white to-primary-50 py-20 md:py-28 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl -mr-48" />
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl -mt-40" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center mb-24"
        >
          <div className="mb-8 -mt-6 inline-flex rounded-full bg-gradient-to-r from-secondary-100 to-secondary-50 px-7 py-3 text-sm font-bold text-secondary-700 shadow-md border-2 border-secondary-200">
            Academic Leadership
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-primary leading-tight mb-6 sm:mb-8 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent px-2 sm:px-0">Guided By Distinguished Medical Educators</h2>
          <p className="mt-0 text-sm sm:text-base md:text-lg leading-relaxed text-gray-700 font-medium max-w-3xl mx-auto px-4 sm:px-0">
            IBMP is supported by an academic leadership network of experienced physicians, educators, and clinical mentors who strengthen the board&apos;s global training, research, and professional development mission.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-20 space-y-8"
        >
          <div className="rounded-3xl border border-gray-200 bg-white p-10 md:p-16 shadow-lg hover:shadow-2xl transition-shadow overflow-hidden group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/30 flex-shrink-0">
                  <GraduationCap className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Leadership Network</p>
                  <h3 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-black text-primary leading-tight">Academic Excellence In Practice</h3>
                </div>
              </div>

              <p className="text-lg leading-8 text-gray-700 font-medium mb-12">
                This leadership group reflects the depth of IBMP&apos;s academic community, bringing together expertise across medical education, specialty practice, mentorship, assessment, and institutional collaboration.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 hover:border-primary/40 transition-all">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Listed Leaders</p>
                  <p className="mt-4 text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">11</p>
                  <p className="mt-4 text-sm leading-6 text-gray-600 font-medium">Accomplished medical professionals in our leadership roster.</p>
                </div>
                <div className="rounded-3xl border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-accent/5 p-8 hover:border-secondary/40 transition-all">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Focus Areas</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-primary ring-2 ring-primary/30 hover:ring-primary/50 transition-all">Education</span>
                    <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-primary ring-2 ring-primary/30 hover:ring-primary/50 transition-all">Research</span>
                    <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-primary ring-2 ring-primary/30 hover:ring-primary/50 transition-all">Mentorship</span>
                    <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-primary ring-2 ring-primary/30 hover:ring-primary/50 transition-all">Clinical Leadership</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-shadow md:p-10 overflow-hidden group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="mb-8 flex items-center justify-between gap-4 relative z-10">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Roster</p>
                <h3 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-black text-primary">Academic Leadership Members</h3>
              </div>
              <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary-600 text-white md:flex shadow-lg">
                <Users2 className="h-8 w-8" />
              </div>
            </div>

            <div className="overflow-hidden pb-2 relative z-10">
              <motion.div
                className="flex w-max gap-6"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
              >
              {scrollingLeaders.map((leader, index) => (
                <motion.div
                  key={`${leader.name}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.2 + index * 0.03 }}
                  className="group w-[70vw] sm:w-[55vw] md:w-[45vw] lg:w-[200px] max-w-[200px] shrink-0 overflow-hidden rounded-3xl border-2 border-gray-200 bg-white transition-all duration-300 hover:-translate-y-3 hover:border-secondary hover:shadow-2xl shadow-md"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover object-center"
                      quality={95}
                      priority={index < 4}
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Member {String(index + 1).padStart(2, '0')}</p>
                      <h4 className="mt-2 text-sm font-bold leading-5 text-primary">{leader.name}</h4>
                    </div>
                  </div>
                </motion.div>
              ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}