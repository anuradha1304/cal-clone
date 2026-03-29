'use client'

import Link from 'next/link'
import { Globe } from 'lucide-react'
import { pageContainer } from './marketing-layout'

const solutions = [
  'iOS & Android App',
  'Self-hosted',
  'Pricing',
  'Docs',
  'Cal.ai',
  'Enterprise',
]

const useCases = [
  'Sales',
  'Marketing',
  'Talent',
  'Support',
  'Education',
  'Recruiting',
]

const resources = [
  'Affiliate',
  'Help',
  'Blog',
  'Teams',
  'Embed',
  'Developers',
]

const company = [
  'Jobs',
  'About',
  'Open startup',
  'Support',
  'Privacy',
  'Terms',
]

const downloads = [
  'iPhone',
  'Android',
  'Chrome',
  'Safari',
  'Edge',
  'Firefox',
  'MacOS',
  'Windows',
  'Linux',
]

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white py-20 px-4 mt-20">
      <div className={pageContainer}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-16">
          <div className="col-span-2 md:col-span-1 flex flex-col items-start gap-4">
            <span className="text-xl font-bold text-gray-900 tracking-tight">Cal.com</span>
            <p className="max-w-[200px] text-sm text-gray-500 font-medium">
              © {new Date().getFullYear()} Cal.com, Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
                {['ISO 27001', 'SOC 2', 'CCPA', 'GDPR', 'HIPAA'].map((b) => (
                    <span
                        key={b}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-500"
                    >
                    {b}
                    </span>
                ))}
            </div>
            <p className="mt-6 text-sm text-gray-400 font-medium leading-relaxed">
              Our mission is to connect a billion people by 2031 through calendar
              scheduling.
            </p>
            <div className="mt-8 flex flex-col gap-3 w-full">
              <button className="flex justify-center items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">
                <Globe className="h-4 w-4" />
                English
              </button>
              <div className="flex justify-center flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                All systems operational
              </div>
            </div>
            <div className="mt-12 w-full">
               <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                 Downloads
               </p>
               <div className="mt-4 flex flex-wrap gap-2">
                 {downloads.map((d) => (
                   <span
                     key={d}
                     className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500 cursor-pointer hover:border-gray-300 hover:text-gray-900"
                   >
                     {d}
                   </span>
                 ))}
               </div>
            </div>
          </div>
          <FooterCol title="Solutions" links={solutions} />
          <FooterCol title="Use cases" links={useCases} />
          <FooterCol title="Resources" links={resources} />
          <FooterCol title="Company" links={company} />
        </div>

        <div className="mt-20 border-t border-gray-100 pt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm font-medium text-gray-500">
            Need help?{' '}
            <a href="mailto:support@cal.com" className="text-gray-900 underline hover:no-underline font-semibold">
              support@cal.com
            </a>{' '}
            or visit{' '}
            <a href="#" className="text-gray-900 underline hover:no-underline font-semibold">
              cal.com/help
            </a>
            .
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              G2 — Read reviews
            </span>
            <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Trustpilot — Read reviews
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-8 flex-1">
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      <ul className="flex flex-col gap-4">
        {links.map((l) => (
           <li key={l}>
             <Link
               href="#"
               className="text-base font-medium text-gray-500 hover:text-gray-900"
             >
               {l}
             </Link>
           </li>
        ))}
      </ul>
    </div>
  )
}
