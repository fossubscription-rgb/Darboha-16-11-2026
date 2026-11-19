export type Lang = 'en' | 'ar'

type Copy = {
  skip: string
  langToggle: string
  langToggleAria: string
  hero: {
    brandAr: string
    brandEn: string
    status: string
    lede: string
    cta: string
  }
  note: {
    title: string
    body: string
  }
  waitlist: {
    title: string
    lede: string
    placeholder: string
    submit: string
    thanks: string
    emailLabel: string
  }
  footer: {
    tagline: string
    note: string
  }
}

export const copy: Record<Lang, Copy> = {
  en: {
    skip: 'Skip to content',
    langToggle: 'العربية',
    langToggleAria: 'Switch to Arabic',
    hero: {
      brandAr: 'دربها',
      brandEn: 'Darboha',
      status: 'Coming soon',
      lede: 'A self-guided trail companion for Oman — curated routes, safety notes, and respect for the land. Trails appear here when they are ready.',
      cta: 'Notify me',
    },
    note: {
      title: 'Empty map for now',
      body: 'We have not published locations yet. When our field notes clear safety review, curated trails will open here — not a giant catalog.',
    },
    waitlist: {
      title: 'Be first when trails open',
      lede: 'Leave an email for launch updates. No spam — just when Darboha has real places to walk.',
      placeholder: 'you@email.com',
      submit: 'Join waitlist',
      thanks: 'Thanks — you are on the list.',
      emailLabel: 'Email',
    },
    footer: {
      tagline: 'Know the trail. Respect the land.',
      note: 'Marketing site · Product and logo mark coming later.',
    },
  },
  ar: {
    skip: 'تخطى إلى المحتوى',
    langToggle: 'English',
    langToggleAria: 'التبديل إلى الإنجليزية',
    hero: {
      brandAr: 'دربها',
      brandEn: 'Darboha',
      status: 'قريباً',
      lede: 'رفيق مسارات موجّه ذاتياً لعُمان — دروب مختارة، ملاحظات سلامة، واحترام للأرض. تظهر المسارات هنا عندما تكون جاهزة.',
      cta: 'أخبرني',
    },
    note: {
      title: 'الخريطة فارغة الآن',
      body: 'لم ننشر مواقع بعد. عندما تجتاز ملاحظاتنا الميدانية مراجعة السلامة، ستُفتح هنا مسارات مختارة — لا كتالوج ضخم.',
    },
    waitlist: {
      title: 'كن أول من يعرف عند فتح المسارات',
      lede: 'اترك بريداً لتحديثات الإطلاق. بلا رسائل مزعجة — فقط عندما يكون لدربها أماكن حقيقية للمشي.',
      placeholder: 'you@email.com',
      submit: 'انضم للقائمة',
      thanks: 'شكراً — أنت على القائمة.',
      emailLabel: 'البريد',
    },
    footer: {
      tagline: 'اعرف الدرب. احترم الأرض.',
      note: 'موقع تعريفي · المنتج وشعار العلامة لاحقاً.',
    },
  },
}
