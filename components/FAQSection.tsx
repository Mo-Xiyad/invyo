'use client'
import { useState, useRef, type ReactNode } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const faqs: { q: string; a: ReactNode }[] = [
  {
    q: 'Why should I use this tool and not X?',
    a: "As newly wed, we've created this tool to reduce overwhelm for others organizing weddings. We've kept everything simple, we do one thing, and we do it well.",
  },
  {
    q: 'Does my link expire?',
    a: 'Free Wedvites expire after 30 days, to keep your link online we have a small fee of 2€/month so we can maintain our service!',
  },
  {
    q: 'I would like to customize the invitation, can you do this for me?',
    a: (
      <>
        We do provide simple custom wedding invitations,{' '}
        <Link href="/options" className="font-semibold text-lt-ink underline decoration-2 underline-offset-2 hover:text-lt-muted">
          click here to check all the options
        </Link>
        .
      </>
    ),
  },
  {
    q: "My guests aren't replying to the link I've sent them, do I need to chase them?",
    a: (
      <>
        We offer a paid feature that will send an email or SMS to your guests and remind them to reply. You can learn more on{' '}
        <Link href="/guest-reminders" className="font-semibold text-lt-ink underline decoration-2 underline-offset-2 hover:text-lt-muted">
          our offer here
        </Link>
        .
      </>
    ),
  },
  {
    q: 'How many guests can I invite?',
    a: 'Free users can invite up to 20 guests, paid users can invite up to 500 guests.',
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
  answer: React.ReactNode
  index: number
}) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="border-b border-lt-border last:border-b-0"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group flex w-full items-start justify-between gap-4 py-5 text-left md:py-6"
        aria-expanded={open}
      >
        <span className="font-sans text-base font-bold text-lt-ink group-hover:text-lt-muted md:text-lg">{question}</span>
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-lt-ink transition-colors ${
            open ? 'bg-lt-ink text-lt-surface' : 'bg-transparent text-lt-ink'
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
            aria-hidden
          >
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="max-w-2xl pb-5 font-sans text-base font-medium leading-relaxed text-lt-muted md:pb-6">
              {answer}
            </div>
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
    <section className="bg-lt-surface py-20 md:py-28" ref={ref}>
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="mb-12 md:mb-14"
        >
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-lt-ink md:text-5xl">Questions</h2>
        </motion.div>

        <div className="rounded-2xl border border-lt-border px-1 md:rounded-3xl md:px-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.35 }}
          className="mt-16 border-t border-lt-border pt-12 text-center md:mt-20 md:pt-16"
        >
          <h3 className="font-display text-2xl font-extrabold text-lt-ink md:text-3xl">Create your Wedvite in 5 minutes</h3>
          <Link
            href="/get-started"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-lt-ink px-8 py-4 font-sans text-sm font-bold text-lt-surface transition-transform hover:scale-[1.02] active:scale-[0.98]"
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
