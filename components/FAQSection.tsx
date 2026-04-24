'use client'
import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const faqs = [
  {
    q: 'Why should I use this tool and not X?',
    a: "As newly weds, we've created this tool to reduce overwhelm for others organizing weddings. We've kept everything simple, we do one thing, and we do it well.",
  },
  {
    q: 'Does my link expire?',
    a: 'Free Wedvites expire after 30 days. To keep your link online we have a small fee of 2€/month so we can maintain our service!',
  },
  {
    q: 'I would like to customize the invitation, can you do this for me?',
    a: 'We do provide simple custom wedding invitations. Click here to check all the options.',
  },
  {
    q: "My guests aren't replying to the link I've sent them, do I need to chase them?",
    a: 'We offer a paid feature that will send an email or SMS to your guests and remind them to reply. You can learn more on our offer here.',
  },
  {
    q: 'How many guests can I invite?',
    a: 'Free users can invite up to 20 guests. Paid users can invite up to 500 guests.',
  },
  {
    q: 'Do I need a domain to use Wedvite?',
    a: 'No, having your own domain is optional. We provide our users with a free link, which can be customized on paid plans.',
  },
  {
    q: 'Can I get notified when my guests RSVP?',
    a: 'Yes, paid users can get email as well as SMS notifications every time a guest replies to the RSVP.',
  },
  {
    q: 'What can I customize?',
    a: 'Free users can customize their theme, names, images and even sound. Paid users can customize all those and have a custom link to share with their guests.',
  },
  {
    q: 'Can guests bring plus-ones?',
    a: 'Yes, if you want them to. This is a simple setting to set on your Wedvite.',
  },
]

function FAQItem({
  question,
  answer,
  index,
}: {
  question: string
  answer: string
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="border-b border-espresso/10 last:border-b-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-6 flex items-start justify-between gap-4 group"
        aria-expanded={open}
      >
        <span className="font-sans font-bold text-espresso text-base group-hover:text-gold-deep transition-colors duration-200">
          {question}
        </span>
        <span
          className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
            open ? 'bg-espresso border-espresso' : 'border-espresso/20 group-hover:border-gold'
          }`}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
            aria-hidden
          >
            <path
              d="M5 1v8M1 5h8"
              stroke={open ? '#f7f0e4' : '#2a1808'}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="font-sans text-muted text-base leading-relaxed pb-6 max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="bg-parchment py-24" ref={ref}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">Questions</p>
          <h2 className="font-serif text-4xl md:text-5xl text-espresso">
            Everything you need to know
          </h2>
        </motion.div>

        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 pt-12 border-t border-espresso/10 text-center"
        >
          <h3 className="font-serif text-3xl text-espresso mb-6">
            Create your Wedvite in 5 minutes
          </h3>
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 px-8 py-4 bg-espresso text-champagne font-sans font-bold text-sm tracking-wide rounded-full hover:bg-espresso-dk transition-all duration-200 hover:scale-105 shadow-lg shadow-espresso/20"
          >
            Get started for free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
