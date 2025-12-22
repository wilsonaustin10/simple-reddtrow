#!/usr/bin/env node
/**
 * Static Page Generator for Reddtrow Landing Pages
 * Generates all landing page variants from content data
 */

const fs = require('fs');
const path = require('path');

// Icon SVGs
const icons = {
  check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  cash: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  clock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  home: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  shield: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  file: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  zap: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  scale: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M5 8l7-5 7 5"/><path d="M5 16l7 5 7-5"/></svg>',
  truck: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  hammer: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  calendar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
};

// Page content data
const pages = [
  {
    slug: 'companies-that-buy-houses',
    adGroup: 'ugly_houses_as_is',
    meta: {
      title: 'Companies That Buy Houses | Local Cash Buyers You Can Trust',
      description: "Looking for companies that buy houses? We're local cash buyers with 100+ purchases. No fees, fair offers. See why homeowners choose us.",
    },
    hero: {
      h1: "Looking for Companies That Buy Houses? Here's Why We're Different",
      h2: 'Local Buyers. Fair Offers. No Hidden Fees. No Games.',
      badge: 'Trusted Local Buyers',
      bullets: [
        'Local company, not a national call center',
        'We buy direct — no middlemen',
        'Transparent pricing, no hidden fees',
        '100+ houses purchased in your area',
      ],
    },
    benefits: [
      { icon: 'users', title: 'Local Experts', description: 'We know your neighborhood and make offers based on local market knowledge.' },
      { icon: 'cash', title: 'No Hidden Fees', description: 'National iBuyers charge 5-8% in fees. We charge $0. What we offer is what you get.' },
      { icon: 'check', title: 'Direct Buyers', description: 'We buy with our own funds. No wholesaling to other investors.' },
      { icon: 'home', title: 'Any Condition', description: 'Unlike picky iBuyers, we buy in any condition without repair deductions.' },
      { icon: 'heart', title: 'Personal Service', description: 'Talk to real people, not a call center. We guide you through every step.' },
      { icon: 'shield', title: 'Proven Track Record', description: '100+ homes purchased. Check our reviews and see our reputation.' },
    ],
    process: [
      { step: 1, title: 'Get Multiple Offers', description: "We encourage you to compare. Get offers from us and others to see who's fair." },
      { step: 2, title: 'Review Our Transparent Offer', description: 'We show you exactly how we calculated our price. No mystery math.' },
      { step: 3, title: 'Close With Confidence', description: "Work with a local company you can trust. We've helped hundreds of homeowners." },
    ],
    faqs: [
      { q: 'How are you different from Opendoor or Offerpad?', a: "We're local, not national. We charge no fees (they charge 5-8%). We buy any condition (they're picky). And you'll work with real people, not a call center." },
      { q: 'How do I know you\'re legitimate?', a: "Check our Google reviews, BBB rating, and ask us for references. We've been in business for years and have bought 100+ homes in this area." },
      { q: 'What should I look for in a home buying company?', a: 'Look for: local presence, no hidden fees, proof of funds, positive reviews, and transparency about their offer. Ask questions and trust your gut.' },
      { q: 'Do you wholesale to other investors?', a: 'No. We buy direct with our own funds. Your contract is with us and we close the deal ourselves.' },
      { q: "What if I've been contacted by other companies?", a: "Get multiple offers and compare. A legitimate company will have no problem with you shopping around. We're confident in our fair pricing." },
      { q: "Can I see houses you've bought before?", a: "Yes! We're happy to show you before/after examples of homes we've purchased and renovated. It helps you see what we do." },
    ],
    testimonials: [
      { name: 'Janet M.', location: 'Richardson, TX', text: 'I got offers from 3 different companies. These guys were the most transparent and fair. They actually explained their offer instead of just throwing out a number.', situation: 'Compared Multiple Offers' },
      { name: 'William K.', location: 'Mesquite, TX', text: 'After getting lowballed by a couple of those national iBuyer companies, I was skeptical. But these guys gave me a fair offer with no fees taken out.', situation: 'Chose Local Over National' },
      { name: 'Maria R.', location: 'Grand Prairie, TX', text: 'I loved that I could meet them in person and see their office. Felt so much safer than just working with some anonymous company online.', situation: 'Valued Personal Touch' },
    ],
  },
  {
    slug: 'divorce',
    adGroup: 'distressed_situation',
    meta: {
      title: 'Sell Your House Fast During Divorce | Fair Cash Offer',
      description: 'Going through divorce? Sell your house fast for cash without the drama. Fair offers, fast closing, move on. Get your free offer today.',
    },
    hero: {
      h1: 'Selling Your House During Divorce? We Make It Simple',
      h2: 'Fair Cash Offer. Fast Closing. Move On With Your Life.',
      badge: 'Divorce Sale Specialists',
      bullets: [
        'Fast, fair sale for both parties',
        'No repairs or showings required',
        'Close on your timeline',
        'One less thing to fight about',
      ],
    },
    benefits: [
      { icon: 'scale', title: 'Neutral Third Party', description: "We're not on anyone's side. We provide a fair offer that works for both parties." },
      { icon: 'clock', title: 'Fast Resolution', description: 'Close in days, not months. Stop prolonging the process and move forward.' },
      { icon: 'cash', title: 'Clean Cash Split', description: 'Cash offer means no financing delays. Split the proceeds fairly and easily.' },
      { icon: 'x', title: 'No Repair Disputes', description: 'Sell as-is. No arguments about who pays for repairs or staging.' },
      { icon: 'file', title: 'Simple Process', description: 'We handle all the paperwork. You just need to sign at closing.' },
      { icon: 'heart', title: 'Reduce Conflict', description: 'Eliminate one major source of stress during an already difficult time.' },
    ],
    process: [
      { step: 1, title: 'Either Spouse Can Request an Offer', description: "One or both of you can reach out. We'll provide a fair market offer." },
      { step: 2, title: 'Both Parties Review', description: 'We present our offer to both parties for review and approval.' },
      { step: 3, title: 'Close & Split Proceeds', description: 'Once approved, we close quickly. You split the cash and move on.' },
    ],
    faqs: [
      { q: 'Do both spouses need to agree to sell?', a: 'Typically, yes. Both parties usually need to sign off on the sale. However, we can work with your attorneys if there are special circumstances or court orders involved.' },
      { q: 'How do you determine a fair price?', a: "We look at comparable sales in your area, your home's condition, and current market conditions. Our offer is based on real data, not emotions." },
      { q: 'How quickly can we close?', a: 'We can close in as little as 7 days, or we can work around your timeline if you need more time to make arrangements.' },
      { q: "What if we can't agree on the price?", a: "Our offers are based on fair market value. Having a neutral third-party offer often helps resolve disputes because it's based on facts, not feelings." },
      { q: 'Is this process confidential?', a: 'Absolutely. We handle everything privately. There are no yard signs, no public listings, no nosy neighbors.' },
      { q: 'What if the house has both our names on it?', a: "That's completely normal in divorce situations. Both parties simply sign at closing. We've done this hundreds of times." },
    ],
    testimonials: [
      { name: 'Jennifer & Mark', location: 'Houston, TX', text: 'Going through divorce was hard enough. These guys made selling the house the easiest part. Fair offer, quick close, and we could finally move on with our lives.', situation: 'Divorce Sale' },
      { name: 'Lisa M.', location: 'Austin, TX', text: "My ex and I couldn't agree on anything, but we both agreed their offer was fair. It was such a relief to have one less thing to argue about.", situation: 'Amicable Divorce' },
      { name: 'Robert K.', location: 'Plano, TX', text: 'The traditional sale process was dragging out our divorce for months. They closed in 2 weeks and we were finally able to finalize everything.', situation: 'Fast Divorce Settlement' },
    ],
  },
  {
    slug: 'foreclosure',
    adGroup: 'distressed_situation',
    meta: {
      title: 'Sell Your House Fast Before Foreclosure | Cash Offer in 24 Hours',
      description: 'Facing foreclosure? We buy houses fast for cash & can close before the bank does. No repairs, no fees. Get your free cash offer today.',
    },
    hero: {
      h1: 'Facing Foreclosure? We Can Help You Sell Fast',
      h2: 'Close Before the Bank Does — Get a Fair Cash Offer Today',
      badge: 'Foreclosure Specialists',
      bullets: [
        'Stop foreclosure proceedings',
        'Close in as little as 7 days',
        'Protect your credit score',
        'Walk away with cash in hand',
      ],
    },
    benefits: [
      { icon: 'clock', title: 'Beat the Deadline', description: 'We can close before your auction date and stop the foreclosure process.' },
      { icon: 'shield', title: 'Protect Your Credit', description: 'Avoid having a foreclosure on your record that can affect you for years.' },
      { icon: 'cash', title: 'Walk Away With Cash', description: 'Get money in your pocket at closing instead of losing everything.' },
      { icon: 'heart', title: 'End the Stress', description: 'Stop the collection calls, letters, and uncertainty once and for all.' },
      { icon: 'file', title: 'We Handle Everything', description: 'We work directly with your lender to expedite the process.' },
      { icon: 'users', title: 'No Judgment', description: "We understand life happens. We're here to help, not to judge." },
    ],
    process: [
      { step: 1, title: 'Tell Us Your Situation', description: 'No judgment. We just need basic info about your property and timeline.' },
      { step: 2, title: 'Get Your Cash Offer', description: "We'll make you a fair offer within 24 hours based on your home's value." },
      { step: 3, title: 'Close & Get Paid', description: 'We work with your bank to close fast. You walk away with cash.' },
    ],
    faqs: [
      { q: 'Can you really close before my foreclosure date?', a: "In most cases, yes. We've closed in as little as 5 days when needed. The key is acting quickly — contact us as soon as possible so we have time to work with your lender." },
      { q: 'Will I still owe money after the sale?', a: "It depends on your situation and how much equity you have. In many cases, we can help you walk away clean with cash in hand. We'll explain all your options upfront with complete transparency." },
      { q: 'How much will I get for my house?', a: "We make fair market offers based on your home's condition and the local market. Our goal is a win-win — you get out of a tough situation with cash, and we get a property to renovate." },
      { q: 'What if I\'m already behind on payments?', a: "That's completely okay. Many of our clients are behind on payments. We can often work with your lender to find a solution that works for everyone." },
      { q: 'Is this process confidential?', a: "Absolutely. We handle everything discreetly. Your neighbors won't know you're selling unless you tell them." },
      { q: 'What if I have a second mortgage or liens?', a: 'We deal with complicated situations all the time. We can work with multiple lien holders to reach a resolution and get your house sold.' },
    ],
    testimonials: [
      { name: 'Michael R.', location: 'Dallas, TX', text: 'I was 3 months behind on my mortgage and the bank had started foreclosure proceedings. These guys closed in 8 days and I walked away with money in my pocket. They literally saved my credit.', situation: 'Avoided Foreclosure' },
      { name: 'Sandra T.', location: 'Fort Worth, TX', text: "After my divorce, I couldn't afford the house on my own and fell behind. I was scared and didn't know what to do. They made the whole process easy and treated me with respect.", situation: 'Foreclosure & Divorce' },
      { name: 'James W.', location: 'San Antonio, TX', text: "Lost my job and couldn't keep up with payments. I thought I was going to lose everything. They gave me a fair offer and closed before the auction date. Forever grateful.", situation: 'Pre-Foreclosure Sale' },
    ],
  },
  {
    slug: 'need-to-sell',
    adGroup: 'distressed_situation',
    meta: {
      title: 'Need to Sell Your House Fast? Cash Offer in 24 Hours',
      description: 'Whatever your situation, we can help. Get a fair cash offer for your house in 24 hours. No repairs, no fees. Close in as little as 7 days.',
    },
    hero: {
      h1: "Need to Sell Your House Fast? Here's Your Best Option",
      h2: 'Cash Offer in 24 Hours. Close in 7 Days. Zero Stress.',
      badge: 'Fast Home Buyers',
      bullets: [
        'Whatever your situation, we can help',
        'Cash offer within 24 hours',
        'No repairs, no fees, no hassle',
        'Close on your timeline',
      ],
    },
    benefits: [
      { icon: 'zap', title: 'Fastest Option Available', description: 'Skip the 60-90 day traditional sale. We can close in as little as 7 days.' },
      { icon: 'cash', title: 'Fair Cash Offers', description: "We make competitive offers based on current market conditions and your home's value." },
      { icon: 'x', title: 'Zero Fees', description: 'No agent commissions, no closing costs, no hidden fees. Keep more money.' },
      { icon: 'hammer', title: 'No Repairs Needed', description: 'Sell your house exactly as it is. We buy in any condition.' },
      { icon: 'calendar', title: 'Your Timeline', description: 'Need to close fast? Or need more time? We work on your schedule.' },
      { icon: 'check', title: 'Guaranteed Sale', description: 'No financing contingencies. When we make an offer, we close. Period.' },
    ],
    process: [
      { step: 1, title: 'Tell Us About Your Property', description: 'Fill out the form with basic info. It takes less than 60 seconds.' },
      { step: 2, title: 'Get Your Cash Offer', description: "We'll evaluate your property and present a fair cash offer within 24 hours." },
      { step: 3, title: 'Close & Get Paid', description: "Accept our offer and get paid in as little as 7 days. It's that simple." },
    ],
    faqs: [
      { q: 'How fast can you actually close?', a: 'We can close in as little as 7 days if needed. The average is about 14 days, but we work around your timeline.' },
      { q: 'Will I get a fair price?', a: "Yes. We make competitive offers based on market data, comparable sales, and your home's condition. While you may net slightly less than a traditional sale, you save on repairs, commissions, and months of waiting." },
      { q: "What's the catch?", a: "There's no catch. We're professional investors who buy houses to renovate and resell. You get speed and convenience; we get a fair deal on a property." },
      { q: 'Do I need to clean or repair anything?', a: "No. We buy houses as-is. Leave the mess, leave the repairs, leave whatever you don't want. We handle it all." },
      { q: 'What situations do you help with?', a: "All of them. Foreclosure, divorce, inheritance, relocation, tired landlords, behind on payments, houses needing repairs — we've seen it all and can help." },
      { q: 'Are there any fees?', a: "None. We don't charge commissions or fees. We even pay typical closing costs. The offer we make is what you get." },
    ],
    testimonials: [
      { name: 'Patricia H.', location: 'Arlington, TX', text: 'I needed to sell quickly due to medical bills piling up. They gave me a fair offer and I had cash in my account within 2 weeks. Such a relief.', situation: 'Medical Emergency' },
      { name: 'Tom & Linda', location: 'Irving, TX', text: "We inherited a house and had no idea what to do with it. They made the whole process simple and we didn't have to do any repairs or cleaning.", situation: 'Inherited Property' },
      { name: 'Marcus J.', location: 'Garland, TX', text: 'Tired landlord here. Dealing with bad tenants for years. They bought my rental property and I finally got to walk away from the headaches.', situation: 'Tired Landlord' },
    ],
  },
  {
    slug: 'relocation',
    adGroup: 'distressed_situation',
    meta: {
      title: 'Relocating? Sell Your House Fast for Cash | Close in 7 Days',
      description: 'Job relocation leaving you stuck with a house? We buy homes fast for cash so you can move on. Get your free offer today.',
    },
    hero: {
      h1: 'Relocating? Sell Your House in Days, Not Months',
      h2: "Don't Let Your Old House Hold Up Your New Life",
      badge: 'Relocation Specialists',
      bullets: [
        'Close before your move date',
        "No repairs or showings while you're packing",
        'Cash offer means no buyer financing delays',
        'We handle everything — you focus on moving',
      ],
    },
    benefits: [
      { icon: 'truck', title: 'Close Before You Move', description: "We can close on your timeline so you're not stuck with two mortgages." },
      { icon: 'x', title: 'No Showings Required', description: "No strangers walking through while you're trying to pack and prepare." },
      { icon: 'cash', title: 'Guaranteed Cash Offer', description: 'No financing contingencies means no last-minute deal failures.' },
      { icon: 'home', title: "Leave What You Can't Take", description: "Don't want to move that old furniture? Leave it. We'll handle it." },
      { icon: 'clock', title: 'Fast & Flexible Closing', description: 'Close in 7 days or coordinate with your new job start date.' },
      { icon: 'file', title: 'Remote-Friendly Process', description: 'Already moved? No problem. We can handle everything remotely.' },
    ],
    process: [
      { step: 1, title: 'Tell Us About Your Timeline', description: "Let us know when you need to move and we'll work around your schedule." },
      { step: 2, title: 'Get Your Cash Offer', description: "We'll make a fair offer within 24 hours — no obligation to accept." },
      { step: 3, title: 'Close & Move On', description: 'We handle all the paperwork. You focus on your exciting new chapter.' },
    ],
    faqs: [
      { q: 'Can you close before my start date?', a: "In most cases, yes. We regularly close in 7-14 days. Let us know your timeline and we'll do everything we can to accommodate it." },
      { q: "What if I've already moved?", a: 'Not a problem at all. Many of our clients have already relocated. We can handle everything remotely, including the closing.' },
      { q: 'Do I need to fly back for closing?', a: 'Usually not. We can often arrange for mobile notary services or remote online notarization depending on your state.' },
      { q: 'Can I leave furniture and belongings behind?', a: "Absolutely. Leave whatever you don't want to move. We'll take care of clearing out the property after closing." },
      { q: 'What about my mortgage?', a: "We'll pay off your existing mortgage at closing. If there's equity remaining, you get that as cash." },
      { q: "I'm paying two mortgages right now. Can you help?", a: 'Yes! This is exactly what we specialize in. A fast sale means you can stop making double payments quickly.' },
    ],
    testimonials: [
      { name: 'David & Sarah', location: 'Previously Dallas, TX', text: "My job transferred me to Seattle with 3 weeks notice. These guys had us closed in 10 days. We didn't have to worry about paying two mortgages or flying back for showings.", situation: 'Job Relocation' },
      { name: 'Amanda L.', location: 'Previously Houston, TX', text: "I accepted a dream job across the country but couldn't sell my house fast enough through a realtor. They gave me a fair offer and I was able to start my new life stress-free.", situation: 'Career Move' },
      { name: 'Chris R.', location: 'Previously Austin, TX', text: 'Military orders came through and I had to move fast. They understood the urgency and made it happen. Super professional and hassle-free.', situation: 'Military Relocation' },
    ],
  },
  {
    slug: 'sell-as-is',
    adGroup: 'ugly_houses_as_is',
    meta: {
      title: 'Sell Your House As-Is for Cash | No Repairs Required',
      description: 'Sell your house as-is without repairs, cleaning, or hassle. Fair cash offer, close on your timeline. Get started today.',
    },
    hero: {
      h1: 'Sell Your House As-Is — No Repairs, No Cleaning, No Stress',
      h2: 'Leave the Keys, Leave the Mess, Leave the Worry Behind',
      badge: 'As-Is Specialists',
      bullets: [
        'Sell in current condition — period',
        'No repair requests after inspection',
        'No cleaning required',
        'Leave unwanted items behind',
      ],
    },
    benefits: [
      { icon: 'check', title: 'True As-Is Sale', description: 'We mean it. No repair negotiations, no credits, no last-minute surprises.' },
      { icon: 'x', title: 'Skip the Repairs', description: 'That leaky roof? Old HVAC? Outdated kitchen? Leave it all to us.' },
      { icon: 'home', title: 'Leave Everything', description: "Furniture, appliances, junk in the garage — take what you want, leave the rest." },
      { icon: 'clock', title: 'No Showings Hassle', description: 'No staging, no open houses, no strangers walking through your home.' },
      { icon: 'file', title: 'Simple Process', description: 'No lengthy negotiations. Our offer is our offer. Accept and close.' },
      { icon: 'cash', title: 'Cash at Closing', description: 'No bank approvals, no financing contingencies. Just cash in your account.' },
    ],
    process: [
      { step: 1, title: 'Tell Us About Your Property', description: 'No need to sugarcoat anything. We buy as-is, so be honest about condition.' },
      { step: 2, title: 'Get Your No-Hassle Offer', description: "We'll make a fair offer with no repair requests — guaranteed." },
      { step: 3, title: 'Close On Your Terms', description: "Pick your closing date, leave what you don't want, and walk away with cash." },
    ],
    faqs: [
      { q: 'What does "as-is" really mean?', a: 'It means we buy your house in its current condition with no repair requests. What you see is what we buy. No negotiations, no credits, no surprises.' },
      { q: 'Do I need to get inspections done?', a: "No. We don't require any inspections from you. We'll do our own due diligence, but we never ask for repairs based on what we find." },
      { q: 'What can I leave behind?', a: "Anything you don't want. Old furniture, broken appliances, clothes, junk in the attic, stuff in the garage — leave it all. We handle removal." },
      { q: 'Is this different from selling to a regular buyer as-is?', a: 'Yes. Even when you list "as-is" with an agent, buyers often still request repairs or credits after inspection. With us, our offer is final. No renegotiating.' },
      { q: 'What if my house needs a lot of work?', a: "Perfect. That's exactly what we buy. The more work it needs, the more we can help." },
      { q: 'How is your offer calculated?', a: "We look at the after-repair value of your home, subtract estimated renovation costs, and make a fair offer. We're transparent about our process." },
    ],
    testimonials: [
      { name: 'Kevin & Mary', location: 'Plano, TX', text: 'We tried listing with a realtor but every offer came with a list of repair demands. These guys made an offer and stuck to it. No negotiations, no headaches.', situation: 'Failed Traditional Sale' },
      { name: 'Susan P.', location: 'Frisco, TX', text: "My house was outdated and I didn't have the money or energy to fix it up. They bought it exactly as it was and I didn't have to lift a finger.", situation: 'Outdated Property' },
      { name: 'Tony G.', location: 'McKinney, TX', text: "I left behind a garage full of stuff, old furniture, everything. They didn't care. Best decision I made — so much easier than dealing with all that junk.", situation: 'Left Everything Behind' },
    ],
  },
  {
    slug: 'sell-fast',
    adGroup: 'sell_house_fast_core',
    meta: {
      title: 'Sell Your House Fast for Cash | Offer in 24 Hours, Close in 7 Days',
      description: 'Need to sell your house fast? Get a fair cash offer in 24 hours and close in as little as 7 days. No repairs, no fees.',
    },
    hero: {
      h1: 'Sell Your House Fast — Cash Offer in 24 Hours',
      h2: 'No Repairs. No Showings. No Waiting. Close in 7 Days.',
      badge: '#1 Fast Home Buyers',
      bullets: [
        'Get your cash offer within 24 hours',
        'Close in as little as 7 days',
        'Zero fees or commissions',
        'Sell as-is, no repairs needed',
      ],
    },
    benefits: [
      { icon: 'zap', title: 'Lightning Fast Offers', description: 'Get a fair cash offer within 24 hours of contacting us. No waiting.' },
      { icon: 'clock', title: '7-Day Closing', description: 'We can close in as little as 7 days. Traditional sales take 60-90 days.' },
      { icon: 'x', title: 'Zero Fees', description: 'No agent commissions (6%), no closing costs, no hidden charges.' },
      { icon: 'hammer', title: 'No Repairs', description: 'Sell your house exactly as it is. We buy in any condition.' },
      { icon: 'home', title: 'No Showings', description: 'No strangers, no open houses, no staging. We make one visit.' },
      { icon: 'cash', title: 'Cash Guaranteed', description: 'We pay cash. No financing fall-throughs, no appraisal issues.' },
    ],
    process: [
      { step: 1, title: 'Submit Your Info', description: 'Fill out our quick form. It takes less than 60 seconds.' },
      { step: 2, title: 'Get Your Cash Offer', description: "We'll call to learn about your property and make a fair offer within 24 hours." },
      { step: 3, title: 'Close & Get Paid', description: 'Accept our offer and choose your closing date. Get cash in as little as 7 days.' },
    ],
    faqs: [
      { q: 'How fast can you really close?', a: "Our fastest closing was 5 days. On average, we close in 14 days. But we work around your timeline — if you need 30 or 60 days, that's fine too." },
      { q: "What's your fee?", a: "Zero. We don't charge any fees or commissions. We even pay normal closing costs. The offer we make is what you get." },
      { q: 'How much will you offer for my house?', a: "We make fair offers based on your home's condition, location, and current market. While you might net slightly less than a perfect traditional sale, you save on repairs, commissions, and months of waiting." },
      { q: 'Do you need to see my house?', a: "We can make an initial offer based on info you provide. If you accept, we'll schedule one quick visit to confirm details before closing." },
      { q: 'What if my house needs a lot of repairs?', a: 'Perfect! We specialize in buying houses that need work. No repairs are required on your end.' },
      { q: 'Can I sell if I still have a mortgage?', a: 'Absolutely. Most people do. We pay off your mortgage at closing and you get the remaining equity in cash.' },
    ],
    testimonials: [
      { name: 'Rebecca L.', location: 'Dallas, TX', text: 'I needed to sell FAST because I was relocating for a new job. They made an offer the same day I called and we closed in 10 days. Incredible.', situation: 'Sold in 10 Days' },
      { name: 'George M.', location: 'Fort Worth, TX', text: 'My realtor had my house listed for 4 months with no serious offers. These guys made me a fair offer and closed in 2 weeks. Should have called them first.', situation: 'After Failed Listing' },
      { name: 'Michelle H.', location: 'Arlington, TX', text: 'The process was so easy. No showings, no repairs, no waiting. Just a fair offer and a quick close. Exactly what I needed.', situation: 'Hassle-Free Sale' },
    ],
  },
  {
    slug: 'ugly-houses',
    adGroup: 'ugly_houses_as_is',
    meta: {
      title: 'We Buy Ugly Houses for Cash | Any Condition, Fair Offer',
      description: 'We specialize in buying ugly, damaged & outdated homes. No repairs, no cleaning. Get a fair cash offer today.',
    },
    hero: {
      h1: 'We Buy Ugly Houses — No Repairs Needed, Ever',
      h2: "Fire Damage? Foundation Issues? Hoarder House? We Don't Care.",
      badge: 'Any Condition Accepted',
      bullets: [
        'We buy houses in ANY condition',
        'No cleaning, no repairs, no inspections',
        'Leave everything behind — we handle it',
        'Fair cash offer regardless of condition',
      ],
    },
    benefits: [
      { icon: 'home', title: 'We Buy As-Is', description: "Ugly, damaged, outdated — we don't care. We buy it exactly as it sits." },
      { icon: 'x', title: 'No Repairs Ever', description: "Don't spend a dime on repairs. We handle all the work after closing." },
      { icon: 'hammer', title: 'Any Damage Accepted', description: "Fire, water, storm, foundation — we've seen it all and bought it all." },
      { icon: 'check', title: 'No Cleaning Required', description: "Leave the mess. Leave the junk. Leave everything you don't want." },
      { icon: 'cash', title: 'Fair Offers', description: 'We make honest offers based on condition. No lowball tactics.' },
      { icon: 'heart', title: 'No Judgment', description: "We're not here to judge. We're here to help you move forward." },
    ],
    process: [
      { step: 1, title: 'Tell Us About Your Property', description: "Be honest about the condition — it won't affect whether we buy, just our offer." },
      { step: 2, title: 'Get Your Cash Offer', description: "We'll make a fair offer based on the property's potential, not its current state." },
      { step: 3, title: 'Close & Walk Away', description: 'Leave everything. We take the property as-is and you get cash.' },
    ],
    faqs: [
      { q: 'Do you really buy houses in any condition?', a: "Yes, truly any condition. Fire damage, flood damage, foundation issues, mold, hoarder situations, condemned properties — we've bought them all." },
      { q: 'Will the condition affect my offer?', a: "Yes, condition is one factor we consider, but it doesn't mean we won't buy. We make fair offers based on the property's potential value after repairs." },
      { q: 'Do I need to clean out the house first?', a: 'Not at all. Leave furniture, appliances, junk, everything. We handle all cleanouts after closing.' },
      { q: 'What about houses with code violations?', a: 'We buy properties with code violations regularly. This is not a problem for us.' },
      { q: 'What if my house has structural damage?', a: 'We buy properties with structural issues including foundation problems, roof damage, and more. Nothing scares us away.' },
      { q: "What's the ugliest house you've bought?", a: 'We\'ve bought houses that had trees growing through the roof, severe hoarder situations, and properties others said were "unsellable." If it has a deed, we can buy it.' },
    ],
    testimonials: [
      { name: 'Richard S.', location: 'Fort Worth, TX', text: 'My house had major foundation issues that would cost $40k to fix. Every realtor said it was unsellable. These guys made me a fair offer and closed in 12 days.', situation: 'Foundation Problems' },
      { name: 'Carol B.', location: 'Dallas, TX', text: "After my mother passed, we inherited her house. It had been neglected for years and was full of stuff. They bought it as-is and we didn't have to clean a thing.", situation: 'Hoarder House' },
      { name: 'Daniel M.', location: 'Houston, TX', text: "Fire damaged my rental property. Insurance didn't cover everything and I couldn't afford repairs. They bought it for a fair price and I could finally move on.", situation: 'Fire Damage' },
    ],
  },
];

// HTML template generator
function generatePage(content) {
  const escape = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const fixDashes = (str) => str.replace(/--/g, '—').replace(/ - /g, ' — ');

  const benefitsHtml = content.benefits.map(b => `
          <div class="benefit-card">
            <div class="benefit-icon">${icons[b.icon] || icons.check}</div>
            <h3 class="benefit-title">${fixDashes(b.title)}</h3>
            <p class="benefit-desc">${fixDashes(b.description)}</p>
          </div>`).join('');

  const processHtml = content.process.map(p => `
          <div class="process-step">
            <div class="step-number">${p.step}</div>
            <h3 class="step-title">${fixDashes(p.title)}</h3>
            <p class="step-desc">${fixDashes(p.description)}</p>
          </div>`).join('');

  const testimonialsHtml = content.testimonials.map(t => `
          <div class="testimonial-card">
            <div class="testimonial-quote"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg></div>
            <div class="testimonial-stars"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
            <p class="testimonial-text">"${fixDashes(t.text)}"</p>
            <div class="testimonial-author">
              <p class="author-name">${t.name}</p>
              <p class="author-location">${t.location}</p>
              <p class="author-situation">${t.situation}</p>
            </div>
          </div>`).join('');

  const faqsHtml = content.faqs.map(f => `
          <div class="faq-item">
            <button class="faq-question" type="button" aria-expanded="false">
              <span>${fixDashes(f.q)}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="faq-answer"><p class="faq-answer-inner">${fixDashes(f.a)}</p></div>
          </div>`).join('');

  const bulletsHtml = content.hero.bullets.map(b => `
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${fixDashes(b)}</span>
              </li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escape(content.meta.title)}</title>
  <meta name="description" content="${escape(content.meta.description)}">
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="dns-prefetch" href="https://maps.googleapis.com">
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(content.meta.title)}">
  <meta property="og:description" content="${escape(content.meta.description)}">
  <meta property="og:url" content="https://www.reddtrowhomebuyers.com/${content.slug}">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--primary:#8B2828;--primary-hover:#731f1f;--primary-light:#a33232;--secondary:#4F4F4F;--secondary-hover:#3d3d3d;--success:#16a34a;--destructive:#dc2626;--background:#fff;--foreground:#1a1a1a;--muted:#6b7280;--muted-bg:#f9fafb;--border:#e5e7eb;--radius:0.75rem;--shadow:0 4px 6px -1px rgb(0 0 0 / 0.1);--shadow-lg:0 10px 15px -3px rgb(0 0 0 / 0.1)}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}body{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--background);color:var(--foreground);line-height:1.6;-webkit-font-smoothing:antialiased}@media(max-width:767px){body{padding-bottom:60px}}img{max-width:100%;height:auto;display:block}a{color:inherit;text-decoration:none}button{font:inherit;cursor:pointer;border:none;background:none}input,textarea,select{font:inherit}.container{width:100%;max-width:1200px;margin:0 auto;padding:0 1rem}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,0.97);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);min-height:72px}.header-inner{display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0}.logo{height:48px;width:auto}@media(min-width:768px){.logo{height:56px}}.header-phone{display:flex;align-items:center;gap:0.5rem;color:var(--primary);font-weight:700;font-size:1.125rem;transition:color 0.2s}.header-phone:hover{color:var(--primary-hover)}.header-phone svg{width:20px;height:20px;flex-shrink:0}.header-phone-text{display:none}@media(min-width:640px){.header-phone-text{display:inline}}.hero{background:linear-gradient(135deg,var(--primary),var(--primary-light));color:#fff;padding:2rem 0;min-height:auto;position:relative;overflow:hidden}.hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='g' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M10 0L0 0 0 10' fill='none' stroke='white' stroke-width='.5' opacity='.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23g)' width='100' height='100'/%3E%3C/svg%3E");pointer-events:none}.hero-grid{display:grid;gap:2rem;align-items:center;position:relative;z-index:1}@media(min-width:1024px){.hero-grid{grid-template-columns:1fr 1fr;gap:3rem}}.hero-content{order:2}@media(min-width:1024px){.hero-content{order:1}}.hero-badge{display:inline-block;background:var(--success);color:#fff;padding:0.5rem 1rem;border-radius:9999px;font-size:0.875rem;font-weight:700;margin-bottom:1rem}.hero h1{font-size:clamp(1.75rem,5vw,3rem);font-weight:800;line-height:1.1;margin-bottom:1rem}.hero-subtitle{font-size:clamp(1rem,2.5vw,1.25rem);opacity:0.9;margin-bottom:1.5rem;line-height:1.5}.hero-bullets{list-style:none;display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem}.hero-bullets li{display:flex;align-items:flex-start;gap:0.75rem;font-size:1rem;font-weight:500}.hero-bullets svg{width:24px;height:24px;color:var(--success);flex-shrink:0;margin-top:2px}.hero-trust{display:flex;flex-wrap:wrap;gap:0.5rem 1.5rem;font-size:0.875rem;opacity:0.85}.hero-trust span{font-weight:500}.form-wrapper{order:1;width:100%;max-width:28rem;margin:0 auto}@media(min-width:1024px){.form-wrapper{order:2;margin:0 0 0 auto}}.lead-form{background:#fff;border-radius:var(--radius);padding:1.5rem;border:2px solid var(--primary);box-shadow:var(--shadow-lg)}.form-header{text-align:center;margin-bottom:1.25rem}.form-title{color:var(--primary);font-size:1.375rem;font-weight:700;margin-bottom:0.25rem}.form-subtitle{color:var(--muted);font-size:0.875rem}.form-group{margin-bottom:1rem}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}.form-label{display:flex;align-items:center;gap:0.375rem;font-size:0.875rem;font-weight:500;margin-bottom:0.375rem;color:var(--foreground)}.form-label svg{width:16px;height:16px}.form-input{width:100%;height:48px;padding:0 1rem;border:1px solid var(--border);border-radius:0.5rem;font-size:1rem;transition:border-color 0.2s,box-shadow 0.2s;background:var(--muted-bg)}.form-input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(139,40,40,0.1)}.form-input.error{border-color:var(--destructive)}.form-input.success{border-color:var(--success)}.form-error{font-size:0.75rem;color:var(--destructive);min-height:1rem;margin-top:0.25rem}.checkbox-group{display:flex;align-items:flex-start;gap:0.5rem;margin:1rem 0}.checkbox-input{width:18px;height:18px;margin-top:2px;flex-shrink:0;accent-color:var(--primary)}.checkbox-label{font-size:0.75rem;color:var(--muted);line-height:1.5}.checkbox-label a{color:var(--primary);text-decoration:underline}.checkbox-label a:hover{color:var(--primary-hover)}.submit-btn{width:100%;height:56px;background:linear-gradient(135deg,var(--secondary),var(--secondary-hover));color:#fff;font-size:1.125rem;font-weight:700;border-radius:0.5rem;display:flex;align-items:center;justify-content:center;gap:0.5rem;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 4px 14px rgba(79,79,79,0.4)}.submit-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(79,79,79,0.5)}.submit-btn:disabled{opacity:0.6;cursor:not-allowed}.submit-btn svg{width:20px;height:20px}.submit-btn.loading .btn-text{display:none}.submit-btn .btn-loading{display:none}.submit-btn.loading .btn-loading{display:flex;align-items:center;gap:0.5rem}@keyframes spin{to{transform:rotate(360deg)}}.spinner{animation:spin 1s linear infinite}.form-footer{text-align:center;font-size:0.75rem;color:var(--muted);margin-top:1rem}.trust-bar{background:var(--muted-bg);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:1rem 0}.trust-items{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1rem 2rem}.trust-item{display:flex;align-items:center;gap:0.5rem;font-weight:500;font-size:0.9rem}.trust-item svg{width:20px;height:20px}.trust-stars{display:flex}.trust-stars svg{width:18px;height:18px;fill:#facc15;color:#facc15}.trust-divider{display:none;width:1px;height:24px;background:var(--border)}@media(min-width:768px){.trust-divider{display:block}}.bbb-logo{height:40px;width:auto}.benefits{padding:3rem 0;background:#fff}.section-header{text-align:center;margin-bottom:2.5rem}.section-title{font-size:clamp(1.5rem,4vw,2.25rem);font-weight:700;color:var(--primary);margin-bottom:0.5rem}.section-subtitle{font-size:1rem;color:var(--muted);max-width:600px;margin:0 auto}.benefits-grid{display:grid;gap:1.5rem;max-width:1000px;margin:0 auto}@media(min-width:768px){.benefits-grid{grid-template-columns:repeat(2,1fr)}}@media(min-width:1024px){.benefits-grid{grid-template-columns:repeat(3,1fr)}}.benefit-card{padding:1.5rem;border:2px solid var(--border);border-radius:var(--radius);transition:border-color 0.2s,box-shadow 0.2s}.benefit-card:hover{border-color:rgba(139,40,40,0.2);box-shadow:var(--shadow)}.benefit-icon{width:40px;height:40px;color:var(--secondary);margin-bottom:1rem}.benefit-icon svg{width:40px;height:40px}.benefit-title{font-size:1.125rem;font-weight:700;color:var(--primary);margin-bottom:0.5rem}.benefit-desc{font-size:0.9rem;color:var(--muted);line-height:1.6}.process{padding:3rem 0;background:var(--muted-bg)}.process-steps{display:grid;gap:2rem;max-width:900px;margin:0 auto}@media(min-width:768px){.process-steps{grid-template-columns:repeat(3,1fr)}}.process-step{text-align:center;padding:1.5rem}.step-number{width:48px;height:48px;background:var(--primary);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:700;margin:0 auto 1rem}.step-title{font-size:1.125rem;font-weight:700;margin-bottom:0.5rem}.step-desc{font-size:0.9rem;color:var(--muted)}.testimonials{padding:3rem 0;background:#fff}.testimonials-grid{display:grid;gap:1.5rem;max-width:1000px;margin:0 auto}@media(min-width:768px){.testimonials-grid{grid-template-columns:repeat(2,1fr)}}@media(min-width:1024px){.testimonials-grid{grid-template-columns:repeat(3,1fr)}}.testimonial-card{padding:1.5rem;border:2px solid var(--border);border-radius:var(--radius);background:#fff}.testimonial-quote{color:rgba(139,40,40,0.2);margin-bottom:0.75rem}.testimonial-quote svg{width:32px;height:32px}.testimonial-stars{display:flex;margin-bottom:0.75rem}.testimonial-stars svg{width:18px;height:18px;fill:#facc15;color:#facc15}.testimonial-text{font-style:italic;margin-bottom:1rem;line-height:1.6}.testimonial-author{border-top:1px solid var(--border);padding-top:1rem}.author-name{font-weight:600}.author-location{font-size:0.875rem;color:var(--muted)}.author-situation{font-size:0.75rem;color:var(--primary);font-weight:500;margin-top:0.25rem}.faq{padding:3rem 0;background:var(--muted-bg)}.faq-list{max-width:800px;margin:0 auto}.faq-item{background:#fff;border-radius:var(--radius);margin-bottom:0.75rem;border:1px solid var(--border);box-shadow:var(--shadow);overflow:hidden}.faq-question{width:100%;padding:1.25rem 1.5rem;display:flex;align-items:center;justify-content:space-between;font-weight:600;text-align:left;transition:color 0.2s;cursor:pointer}.faq-question:hover{color:var(--primary)}.faq-question svg{width:20px;height:20px;flex-shrink:0;transition:transform 0.2s}.faq-item.open .faq-question svg{transform:rotate(180deg)}.faq-answer{max-height:0;overflow:hidden;transition:max-height 0.3s ease}.faq-item.open .faq-answer{max-height:500px}.faq-answer-inner{padding:0 1.5rem 1.25rem;color:var(--muted);line-height:1.7}.cta{padding:3rem 0;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:#fff;text-align:center}.cta h2{font-size:clamp(1.5rem,4vw,2rem);margin-bottom:0.75rem}.cta p{font-size:1rem;opacity:0.9;margin-bottom:1.5rem;max-width:500px;margin-left:auto;margin-right:auto}.cta-btn{display:inline-flex;align-items:center;gap:0.5rem;background:#fff;color:var(--primary);padding:1rem 2rem;border-radius:0.5rem;font-weight:700;font-size:1.125rem;transition:transform 0.2s,box-shadow 0.2s}.cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.2)}.cta-btn svg{width:20px;height:20px}.footer{background:var(--primary);color:#fff;padding:2.5rem 0}@media(max-width:767px){.footer{padding-bottom:4rem}}.footer-grid{display:grid;gap:2rem;text-align:center}@media(min-width:768px){.footer-grid{grid-template-columns:repeat(3,1fr);text-align:left}}.footer-logo{height:64px;width:auto;margin:0 auto 1rem}@media(min-width:768px){.footer-logo{margin:0 0 1rem}}.footer-desc{font-size:0.875rem;opacity:0.8;line-height:1.6}.footer-title{font-weight:600;margin-bottom:1rem}.footer-links{display:flex;flex-direction:column;gap:0.75rem}.footer-link{display:flex;align-items:center;gap:0.5rem;font-size:0.9rem;transition:opacity 0.2s;justify-content:center}@media(min-width:768px){.footer-link{justify-content:flex-start}}.footer-link:hover{opacity:0.8}.footer-link svg{width:16px;height:16px;flex-shrink:0}.footer-bottom{border-top:1px solid rgba(255,255,255,0.2);margin-top:2rem;padding-top:1.5rem;text-align:center}.footer-bottom p{font-size:0.75rem;opacity:0.6;margin-bottom:0.5rem}.mobile-bar{display:none;position:fixed;bottom:0;left:0;right:0;background:var(--secondary);color:#fff;padding:0.875rem 1rem;z-index:100;box-shadow:0 -4px 12px rgba(0,0,0,0.15)}@media(max-width:767px){.mobile-bar{display:flex;align-items:center;justify-content:center;gap:0.75rem}}.mobile-bar svg{width:20px;height:20px}.mobile-bar a{font-weight:700;font-size:1.125rem}.hp-field{position:absolute;left:-9999px;opacity:0;pointer-events:none}.pac-container{border-radius:0.5rem;border:1px solid var(--border);box-shadow:var(--shadow-lg);margin-top:4px;font-family:inherit}.pac-item{padding:0.75rem 1rem;cursor:pointer}.pac-item:hover{background:var(--muted-bg)}
  </style>
</head>
<body>
  <header class="header">
    <div class="container">
      <div class="header-inner">
        <a href="/" aria-label="Reddtrow Properties Home"><img src="/reddtrow-logo.webp" alt="Reddtrow Properties" class="logo" width="127" height="56" fetchpriority="high"></a>
        <a href="tel:+12109720134" class="header-phone" id="header-phone">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span class="header-phone-text">210-972-0134</span>
        </a>
      </div>
    </div>
  </header>
  <main>
    <section class="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <span class="hero-badge">${fixDashes(content.hero.badge)}</span>
            <h1>${fixDashes(content.hero.h1)}</h1>
            <p class="hero-subtitle">${fixDashes(content.hero.h2)}</p>
            <ul class="hero-bullets">${bulletsHtml}</ul>
            <div class="hero-trust"><span>No Obligation</span><span>|</span><span>100% Free</span><span>|</span><span>Completely Confidential</span></div>
          </div>
          <div class="form-wrapper">
            <form id="lead-form" class="lead-form" novalidate>
              <div class="form-header">
                <h2 class="form-title">Get Your FREE Cash Offer</h2>
                <p class="form-subtitle">No obligation. Takes less than 60 seconds.</p>
              </div>
              <div class="form-group">
                <label for="address" class="form-label"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Property Address *</label>
                <input type="text" id="address" name="address" class="form-input" placeholder="123 Main St, City, State, ZIP" required autocomplete="street-address">
                <div class="form-error" id="address-error"></div>
              </div>
              <div class="form-row">
                <div class="form-group"><label for="firstName" class="form-label">First Name *</label><input type="text" id="firstName" name="firstName" class="form-input" placeholder="John" required autocomplete="given-name"><div class="form-error" id="firstName-error"></div></div>
                <div class="form-group"><label for="lastName" class="form-label">Last Name *</label><input type="text" id="lastName" name="lastName" class="form-input" placeholder="Smith" required autocomplete="family-name"><div class="form-error" id="lastName-error"></div></div>
              </div>
              <div class="form-group">
                <label for="phone" class="form-label"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Phone Number *</label>
                <input type="tel" id="phone" name="phone" class="form-input" placeholder="(555) 555-5555" required autocomplete="tel">
                <div class="form-error" id="phone-error"></div>
              </div>
              <div class="form-group"><label for="email" class="form-label">Email Address *</label><input type="email" id="email" name="email" class="form-input" placeholder="your@email.com" required autocomplete="email"><div class="form-error" id="email-error"></div></div>
              <div class="hp-field" aria-hidden="true"><input type="text" name="website" id="website" tabindex="-1" autocomplete="off"></div>
              <div class="checkbox-group"><input type="checkbox" id="smsConsent" name="smsConsent" class="checkbox-input" required><label for="smsConsent" class="checkbox-label">I agree to the <a href="/terms-conditions.html" target="_blank" rel="noopener">Terms &amp; Conditions</a> and <a href="/privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a>. By submitting, you consent to receive SMS/calls from Reddtrow Properties LLC. Msg &amp; data rates may apply.</label></div>
              <div class="form-error" id="consent-error"></div>
              <input type="hidden" name="gclid" id="gclid"><input type="hidden" name="wbraid" id="wbraid"><input type="hidden" name="gbraid" id="gbraid"><input type="hidden" name="utm_source" id="utm_source"><input type="hidden" name="utm_medium" id="utm_medium"><input type="hidden" name="utm_campaign" id="utm_campaign"><input type="hidden" name="utm_campaignid" id="utm_campaignid"><input type="hidden" name="utm_adgroupid" id="utm_adgroupid"><input type="hidden" name="utm_term" id="utm_term"><input type="hidden" name="utm_device" id="utm_device"><input type="hidden" name="utm_creative" id="utm_creative"><input type="hidden" name="utm_network" id="utm_network"><input type="hidden" name="utm_assetgroup" id="utm_assetgroup"><input type="hidden" name="utm_headline" id="utm_headline"><input type="hidden" name="landing_page" id="landing_page"><input type="hidden" name="referrer" id="referrer"><input type="hidden" name="session_id" id="session_id">
              <button type="submit" class="submit-btn" id="submit-btn"><span class="btn-text"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Get My Cash Offer</span><span class="btn-loading"><svg class="spinner" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Submitting...</span></button>
              <p class="form-footer">Your information is secure and will never be sold.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
    <section class="trust-bar">
      <div class="container">
        <div class="trust-items">
          <div class="trust-item"><div class="trust-stars"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div><span>4.9/5 Rating</span></div>
          <div class="trust-divider"></div>
          <div class="trust-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>100+ Homes Purchased</span></div>
          <div class="trust-divider"></div>
          <a href="https://www.bbb.org/us/tx/midlothian/profile/real-estate-investing/reddtrow-properties-llc-0875-90843940#bbbseal" target="_blank" rel="noopener noreferrer" class="trust-item"><img src="/bbb-logo.webp" alt="BBB Accredited Business" class="bbb-logo" width="25" height="40" loading="lazy" decoding="async"></a>
          <div class="trust-divider"></div>
          <div class="trust-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg><span>Verified Cash Buyers</span></div>
        </div>
      </div>
    </section>
    <section class="benefits" id="benefits">
      <div class="container">
        <div class="section-header"><h2 class="section-title">Why Choose Us?</h2><p class="section-subtitle">We make selling your house fast and easy</p></div>
        <div class="benefits-grid">${benefitsHtml}</div>
      </div>
    </section>
    <section class="process">
      <div class="container">
        <div class="section-header"><h2 class="section-title">How It Works</h2><p class="section-subtitle">Sell your house in 3 simple steps</p></div>
        <div class="process-steps">${processHtml}</div>
      </div>
    </section>
    <section class="testimonials">
      <div class="container">
        <div class="section-header"><h2 class="section-title">What Our Clients Say</h2><p class="section-subtitle">Hear from homeowners who sold their houses fast</p></div>
        <div class="testimonials-grid">${testimonialsHtml}</div>
      </div>
    </section>
    <section class="faq">
      <div class="container">
        <div class="section-header"><h2 class="section-title">Frequently Asked Questions</h2><p class="section-subtitle">Get answers to common questions</p></div>
        <div class="faq-list">${faqsHtml}</div>
      </div>
    </section>
    <section class="cta">
      <div class="container">
        <h2>Ready to Get Your Cash Offer?</h2>
        <p>No obligation, no fees, no hassles. Get your fair cash offer today.</p>
        <a href="#lead-form" class="cta-btn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Get My Cash Offer Now</a>
      </div>
    </section>
  </main>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div><img src="/reddtrow-emblem.webp" alt="Reddtrow Properties" class="footer-logo" width="51" height="64" loading="lazy" decoding="async"><p class="footer-desc">We're local cash home buyers helping homeowners sell their properties quickly and fairly.</p></div>
        <div><h4 class="footer-title">Contact Us</h4><div class="footer-links"><a href="tel:+12109720134" class="footer-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>210-972-0134</a><a href="mailto:info@reddtrowproperties.com" class="footer-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>info@reddtrowproperties.com</a><span class="footer-link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Serving DFW Metroplex</span></div></div>
        <div><h4 class="footer-title">Quick Links</h4><div class="footer-links"><a href="/privacy-policy.html" class="footer-link">Privacy Policy</a><a href="/terms-conditions.html" class="footer-link">Terms &amp; Conditions</a><a href="/about.html" class="footer-link">About Us</a></div></div>
      </div>
      <div class="footer-bottom"><p>&copy; 2025 Reddtrow Properties, LLC. All rights reserved.</p><p>We are professional real estate investors. We are not real estate agents. We do not list houses. We buy houses directly from homeowners.</p></div>
    </div>
  </footer>
  <div class="mobile-bar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><a href="tel:+12109720134" id="mobile-phone">Call 210-972-0134</a></div>
  <script>
    (function(){'use strict';var CONFIG={SUPABASE_URL:'https://wxhybxzqybejfckicdav.supabase.co',SUPABASE_ANON_KEY:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aHlieHpxeWJlamZja2ljZGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2NjM3OTYsImV4cCI6MjA0MjIzOTc5Nn0.vXPfswVnLhD3YxBk3dDmFI2r2Jd5GYXU1rXGXvzNsrU',GTM_ID:'GTM-MGDBJPQQ',GOOGLE_PLACES_API_KEY:'',AD_GROUP:'${content.adGroup}'};var TRACKING_FIELDS=['gclid','wbraid','gbraid','utm_source','utm_medium','utm_campaign','utm_campaignid','utm_adgroupid','utm_term','utm_device','utm_creative','utm_network','utm_assetgroup','utm_headline','landing_page','referrer','session_id'];var form=document.getElementById('lead-form');var submitBtn=document.getElementById('submit-btn');var addressInput=document.getElementById('address');var isAddressSelected=false;function generateSessionId(){if(typeof crypto!=='undefined'&&crypto.randomUUID){return crypto.randomUUID()}return Date.now()+'-'+Math.random().toString(36).slice(2,10)}function captureTracking(){var params=new URLSearchParams(window.location.search);var storage=null;try{storage=window.sessionStorage}catch(e){}TRACKING_FIELDS.forEach(function(key){var value='';var input=document.getElementById(key);if(key==='landing_page'){value=window.location.pathname}else if(key==='referrer'){value=document.referrer||''}else if(key==='session_id'){value=(storage&&storage.getItem(key))||generateSessionId()}else{value=params.get(key)||(storage&&storage.getItem(key))||''}if(value&&storage){try{storage.setItem(key,value)}catch(e){}}if(input)input.value=value});var trackingData={};TRACKING_FIELDS.forEach(function(key){var input=document.getElementById(key);if(input&&input.value)trackingData[key]=input.value});document.cookie='_aa_lt='+encodeURIComponent(JSON.stringify(trackingData))+';Max-Age=7776000;Path=/;SameSite=Lax'}function formatPhone(value){var numbers=value.replace(/\\D/g,'');if(numbers.length<=3)return numbers;if(numbers.length<=6)return'('+numbers.slice(0,3)+') '+numbers.slice(3);return'('+numbers.slice(0,3)+') '+numbers.slice(3,6)+'-'+numbers.slice(6,10)}function validateEmail(email){return/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)}function validatePhone(phone){return phone.replace(/\\D/g,'').length===10}function showError(fieldId,message){var errorEl=document.getElementById(fieldId+'-error');var input=document.getElementById(fieldId);if(errorEl)errorEl.textContent=message;if(input)input.classList.add('error')}function clearError(fieldId){var errorEl=document.getElementById(fieldId+'-error');var input=document.getElementById(fieldId);if(errorEl)errorEl.textContent='';if(input)input.classList.remove('error')}function validateField(field,value){switch(field){case'firstName':case'lastName':return value.trim()?'':(field==='firstName'?'First':'Last')+' name is required';case'email':if(!value.trim())return'Email is required';return validateEmail(value)?'':'Please enter a valid email';case'phone':if(!value.trim())return'Phone number is required';return validatePhone(value)?'':'Please enter a valid phone number';case'address':if(!value.trim())return'Property address is required';return isAddressSelected?'':'Please select an address from the dropdown';default:return''}}var phoneInput=document.getElementById('phone');phoneInput.addEventListener('input',function(e){e.target.value=formatPhone(e.target.value);clearError('phone')});['firstName','lastName','email','phone','address'].forEach(function(field){var input=document.getElementById(field);if(input){input.addEventListener('blur',function(){var error=validateField(field,input.value);if(error)showError(field,error)});input.addEventListener('input',function(){clearError(field);if(field==='address')isAddressSelected=false})}});var placesLoaded=false;function loadGooglePlaces(){if(placesLoaded||!CONFIG.GOOGLE_PLACES_API_KEY)return;placesLoaded=true;var script=document.createElement('script');script.src='https://maps.googleapis.com/maps/api/js?key='+CONFIG.GOOGLE_PLACES_API_KEY+'&libraries=places&callback=initAutocomplete';script.async=true;script.defer=true;document.head.appendChild(script)}window.initAutocomplete=function(){if(!addressInput||typeof google==='undefined')return;var autocomplete=new google.maps.places.Autocomplete(addressInput,{componentRestrictions:{country:'us'},fields:['formatted_address'],types:['address']});autocomplete.addListener('place_changed',function(){var place=autocomplete.getPlace();if(place.formatted_address){addressInput.value=place.formatted_address;isAddressSelected=true;addressInput.classList.remove('error');addressInput.classList.add('success');clearError('address')}})};addressInput.addEventListener('focus',loadGooglePlaces,{once:true});form.addEventListener('submit',function(e){e.preventDefault();var honeypot=document.getElementById('website');if(honeypot&&honeypot.value){window.location.href='/thank-you.html';return}var hasErrors=false;['firstName','lastName','email','phone','address'].forEach(function(field){var input=document.getElementById(field);var error=validateField(field,input.value);if(error){showError(field,error);hasErrors=true}});var consent=document.getElementById('smsConsent');if(!consent.checked){document.getElementById('consent-error').textContent='Please agree to the terms to continue';hasErrors=true}else{document.getElementById('consent-error').textContent=''}if(hasErrors)return;submitBtn.classList.add('loading');submitBtn.disabled=true;var formData={firstName:document.getElementById('firstName').value.trim(),lastName:document.getElementById('lastName').value.trim(),email:document.getElementById('email').value.trim(),phone:document.getElementById('phone').value.trim(),address:document.getElementById('address').value.trim(),smsConsent:consent.checked,website:honeypot?honeypot.value:'',adGroup:CONFIG.AD_GROUP};TRACKING_FIELDS.forEach(function(key){var input=document.getElementById(key);if(input)formData[key]=input.value});fetch(CONFIG.SUPABASE_URL+'/functions/v1/submit-lead',{method:'POST',headers:{'Content-Type':'application/json','apikey':CONFIG.SUPABASE_ANON_KEY,'Authorization':'Bearer '+CONFIG.SUPABASE_ANON_KEY},body:JSON.stringify(formData)}).then(function(response){if(!response.ok)throw new Error('Submission failed');return response.json()}).then(function(){if(window.dataLayer){window.dataLayer.push({event:'form_submission',form_name:'lead_form',landing_page:window.location.pathname,ad_group:CONFIG.AD_GROUP})}window.location.href='/thank-you.html'}).catch(function(error){console.error('Submission error:',error);alert('There was a problem submitting your information. Please try again or call us directly.');submitBtn.classList.remove('loading');submitBtn.disabled=false})});document.querySelectorAll('.faq-question').forEach(function(btn){btn.addEventListener('click',function(){var item=this.parentElement;var isOpen=item.classList.contains('open');document.querySelectorAll('.faq-item.open').forEach(function(openItem){openItem.classList.remove('open');openItem.querySelector('.faq-question').setAttribute('aria-expanded','false')});if(!isOpen){item.classList.add('open');this.setAttribute('aria-expanded','true')}})});function trackPhoneClick(){if(window.dataLayer){window.dataLayer.push({event:'phone_click',phone_number:'210-972-0134'})}}document.getElementById('header-phone').addEventListener('click',trackPhoneClick);document.getElementById('mobile-phone').addEventListener('click',trackPhoneClick);if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',captureTracking)}else{captureTracking()}document.querySelector('.cta-btn').addEventListener('click',function(e){e.preventDefault();document.getElementById('address').focus();window.scrollTo({top:0,behavior:'smooth'})})})();
  </script>
  <script>window.dataLayer=window.dataLayer||[];function loadGTM(){if(window.__gtmLoaded)return;window.__gtmLoaded=true;var script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtm.js?id=GTM-MGDBJPQQ';document.head.appendChild(script)}['scroll','click','touchstart','keydown'].forEach(function(event){document.addEventListener(event,loadGTM,{once:true,passive:true})});if(typeof requestIdleCallback!=='undefined'){requestIdleCallback(loadGTM,{timeout:4000})}else{setTimeout(loadGTM,3000)}</script>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MGDBJPQQ" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
</body>
</html>`;
}

// Generate all pages
pages.forEach(page => {
  const html = generatePage(page);
  const filePath = path.join(__dirname, `${page.slug}.html`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Generated: ${page.slug}.html`);
});

console.log(`\nGenerated ${pages.length} landing pages successfully!`);
