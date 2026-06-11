'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { GraduationCap, Users2 } from 'lucide-react';

const academicLeaders = [
  { name: 'Dr. Dany Bhugon', image: '/academic-leadership/image1.jpeg' },
  { name: 'Dr. Karim Mahmoud', image: '/academic-leadership/image2.png' },
  { name: 'Dr. Emil Shehata', image: '/academic-leadership/image3.png' },
  { name: 'Dr. Rajeev Gupta', image: '/academic-leadership/image4.png' },
  { name: 'Dr. Arsheed Hakeem', image: '/academic-leadership/image5.png' },
  { name: 'Dr. Md. Jaweed', image: '/academic-leadership/image6.jpeg' },
  { name: 'Dr. Mohit Mann', image: '/academic-leadership/image7.jpeg' },
  { name: 'Dr. Soumya Banerjee', image: '/academic-leadership/image8.jpeg' },
  { name: 'Dr. Supriya Chauhan', image: '/academic-leadership/image9.jpeg' },
  { name: 'Dr. Shankar Naik', image: '/academic-leadership/image10.jpeg' },
  { name: 'Dr. Salma Muhammad', image: '/academic-leadership/image11.jpeg' },
  { name: 'Dr. Ayush Panday', image: '/academic-leadership/image12-fixed.jpeg' },
  { name: 'Dr. Girija Mohanty', image: '/academic-leadership/image13.jpeg' },
  { name: 'Dr. Piranitha', image: '/academic-leadership/image14.jpeg' },
  { name: 'Dr. Supriya Kumari', image: '/academic-leadership/image15.jpeg' },
  { name: 'Dr. Gopambuj', image: '/academic-leadership/image16.jpeg' },
  { name: 'Dr. Nadezhda Magdeeva', image: '/academic-leadership/image17.jpeg' },
];

const scrollingLeaders = [...academicLeaders, ...academicLeaders];

export default function AcademicLeadershipSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="bg-gradient-to-br from-slate-50 via-white to-secondary-50/30 py-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex rounded-full bg-secondary-50 px-4 py-2 text-sm font-semibold text-secondary">
            Academic Leadership
          </div>
          <h2 className="text-4xl font-bold text-primary md:text-5xl">Guided By Distinguished Medical Educators</h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600 md:text-xl">
            IBMP is supported by an academic leadership network of experienced physicians, educators, and clinical mentors who strengthen the board&apos;s global training, research, and professional development mission.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 space-y-6"
        >
          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm md:p-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/15">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Leadership Network</p>
                <h3 className="mt-1 text-2xl font-bold text-primary">Academic Excellence In Practice</h3>
              </div>
            </div>

            <p className="mt-6 text-base leading-8 text-gray-600 md:text-lg">
              This leadership group reflects the depth of IBMP&apos;s academic community, bringing together expertise across medical education, specialty practice, mentorship, assessment, and institutional collaboration.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Listed Leaders</p>
                <p className="mt-2 text-3xl font-black text-primary">17</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">Academic leaders included from the shared roster document.</p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Focus Areas</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary ring-1 ring-gray-200">Education</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary ring-1 ring-gray-200">Research</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary ring-1 ring-gray-200">Mentorship</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary ring-1 ring-gray-200">Clinical Leadership</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Roster</p>
                <h3 className="mt-1 text-2xl font-bold text-primary">Academic Leadership Members</h3>
              </div>
              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary md:flex">
                <Users2 className="h-6 w-6" />
              </div>
            </div>

            <div className="overflow-hidden pb-2">
              <motion.div
                className="flex w-max gap-4"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 36, ease: 'linear', repeat: Infinity }}
              >
              {scrollingLeaders.map((leader, index) => (
                <motion.div
                  key={`${leader.name}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.2 + index * 0.03 }}
                  className="group w-[72vw] max-w-[280px] shrink-0 overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-slate-50 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/30 hover:shadow-lg sm:w-[42vw] lg:w-[26vw] xl:w-[22%]"
                >
                  <div className="relative aspect-[4/4.35] overflow-hidden bg-slate-100">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/25 to-transparent" />
                  </div>
                  <div className="p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Member {String(index + 1).padStart(2, '0')}</p>
                      <h4 className="mt-1 text-base font-bold leading-6 text-primary">{leader.name}</h4>
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