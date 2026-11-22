export type Lang = 'en' | 'ar'

export type Trail = {
  id: string
  image: string
  name: string
  region: string
  blurb: string
  distance: string
  difficulty: string
  difficultyKey: 'easy' | 'moderate' | 'varies'
  season: string
  seasonMonths: number[]
}

type Copy = {
  skip: string
  nav: {
    trails: string
    safety: string
    how: string
    about: string
    join: string
  }
  langToggle: string
  langToggleAria: string
  hero: {
    brandAr: string
    brandEn: string
    tagline: string
    lede: string
    ctaPrimary: string
    ctaSecondary: string
  }
  promise: {
    eyebrow: string
    title: string
    lede: string
  }
  trails: {
    eyebrow: string
    title: string
    lede: string
    explore: string
    metaDistance: string
    metaDifficulty: string
    metaSeason: string
    filterDifficulty: string
    filterSeason: string
    filterAll: string
    emptyFiltered: string
    emptyCatalog: string
    items: Trail[]
  }
  safety: {
    eyebrow: string
    title: string
    lede: string
    items: { title: string; body: string }[]
  }
  how: {
    eyebrow: string
    title: string
    lede: string
    steps: { title: string; body: string }[]
    note: string
  }
  team: {
    eyebrow: string
    title: string
    lede: string
  }
  waitlist: {
    eyebrow: string
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
    top: string
  }
}

/** Empty until real trails are published from the catalogue. */
const trailEn: Trail[] = []
const trailAr: Trail[] = []

export const copy: Record<Lang, Copy> = {
  en: {
    skip: 'Skip to content',
    nav: {
      trails: 'Trails',
      safety: 'Safety',
      how: 'How it works',
      about: 'About',
      join: 'Join waitlist',
    },
    langToggle: 'العربية',
    langToggleAria: 'Switch to Arabic',
    hero: {
      brandAr: 'دربها',
      brandEn: 'Darboha',
      tagline: 'Know the trail. Respect the land.',
      lede: 'Self-guided travel for Oman’s wild places — follow curated trails on an in-app map, without a tour guide. Clearer routes, safer habits, gentler footprints.',
      ctaPrimary: 'Join the waitlist',
      ctaSecondary: 'Explore trails',
    },
    promise: {
      eyebrow: 'The promise',
      title: 'Walk Oman with a map in your pocket — and respect in your pack.',
      lede: 'Darboha is a safety-and-guidance companion for foreigners, travelers, and hikers. We curate the trails that matter, show you how to prepare, and teach you how to leave the land whole — so you can explore without hiring a guide for every step.',
    },
    trails: {
      eyebrow: 'Curated, not endless',
      title: 'Featured trails',
      lede: 'Curated routes will appear here as we publish them — with difficulty, season, and what the day actually asks of you.',
      explore: 'Explore trails',
      metaDistance: 'Distance',
      metaDifficulty: 'Difficulty',
      metaSeason: 'Season',
      filterDifficulty: 'Difficulty',
      filterSeason: 'Season',
      filterAll: 'All',
      emptyFiltered: 'No trails match these filters.',
      emptyCatalog: 'No trails published yet. Join the waitlist and we’ll share the first routes when they go live.',
      items: trailEn,
    },
    safety: {
      eyebrow: 'Safety & the land',
      title: 'Guidance first. Thrill second.',
      lede: 'Safety is built into every trail tip — not a footer disclaimer. Eco habits travel with every note.',
      items: [
        {
          title: 'Know before you go',
          body: 'Difficulty, length, heat, water, and “when not to go” before you lace up.',
        },
        {
          title: 'Weather & floods',
          body: 'Skip midday summer heat when you can. Never camp on a wadi floor — flash floods are real.',
        },
        {
          title: 'Kit that matches the land',
          body: 'No flip-flops in wadis. Swim skill for caves and pools. Modest dress on village paths.',
        },
        {
          title: 'Leave No Trace',
          body: 'Pack out litter, protect falaj water, stay on paths, give wildlife distance.',
        },
      ],
    },
    how: {
      eyebrow: 'How it works',
      title: 'Map-guided hiking — without a tour shop.',
      lede: 'The product we are building is a self-guided companion: choose a curated trail, prep with safety notes, then follow the route on an in-app map at your own pace.',
      steps: [
        {
          title: '1. Choose a trail',
          body: 'Browse a curated Oman set with distance, difficulty, and season — not a giant catalog.',
        },
        {
          title: '2. Prep with care',
          body: 'Read safety cues, packing notes, and eco reminders before you leave.',
        },
        {
          title: '3. Follow the map',
          body: 'Walk with the in-app map as your guide — self-guided travel, no tour guide required.',
        },
      ],
      note: 'Marketing site now. Interactive map prototype next — we will not fake live GPS before it ships.',
    },
    team: {
      eyebrow: 'About Darboha',
      title: 'Built in Oman, for people who want to walk it well.',
      lede: 'Darboha is an adventure-guidance company focused on self-guided hiking: curated routes, clear safety notes, and respect for the land — so travelers can explore Oman’s wild places with confidence.',
    },
    waitlist: {
      eyebrow: 'Stay close',
      title: 'Join the waitlist for the trail companion.',
      lede: 'Leave an email for prototype updates as we publish the first curated trails.',
      placeholder: 'you@email.com',
      submit: 'Join waitlist',
      thanks: 'Thanks — you’re on the list. We’ll be in touch as Darboha grows.',
      emailLabel: 'Email',
    },
    footer: {
      tagline: 'Know the trail. Respect the land.',
      note: 'Photos: Wikimedia Commons (Oman landscapes). Marketing site — product app coming later.',
      top: 'Top',
    },
  },
  ar: {
    skip: 'تخطى إلى المحتوى',
    nav: {
      trails: 'المسارات',
      safety: 'السلامة',
      how: 'كيف يعمل',
      about: 'من نحن',
      join: 'قائمة الانتظار',
    },
    langToggle: 'English',
    langToggleAria: 'التبديل إلى الإنجليزية',
    hero: {
      brandAr: 'دربها',
      brandEn: 'Darboha',
      tagline: 'اعرف الدرب. احترم الأرض.',
      lede: 'سفر موجّه ذاتياً في أماكن عُمان البرية — اتبع مسارات مختارة عبر خريطة داخل التطبيق، دون مرشد سياحي. مسارات أوضح، عادات أأمن، وبصمة ألطف.',
      ctaPrimary: 'انضم لقائمة الانتظار',
      ctaSecondary: 'استكشف المسارات',
    },
    promise: {
      eyebrow: 'وعدنا',
      title: 'امشِ عُمان وخريطتك في جيبك — والاحترام في حقيبتك.',
      lede: 'دربها رفيق سلامة وإرشاد للمسافرين والمتنزهين. نختار المسارات بعناية، ونوضح كيف تستعد، ونعلّم كيف تترك الأرض سليمة — لتستكشف دون الحاجة لمرشد في كل خطوة.',
    },
    trails: {
      eyebrow: 'مختار لا موسوعة',
      title: 'مسارات مميزة',
      lede: 'ستظهر هنا المسارات المختارة عند نشرها — مع الصعوبة والموسم وما يطلبه اليوم فعلاً.',
      explore: 'استكشف المسارات',
      metaDistance: 'المسافة',
      metaDifficulty: 'الصعوبة',
      metaSeason: 'الموسم',
      filterDifficulty: 'الصعوبة',
      filterSeason: 'الموسم',
      filterAll: 'الكل',
      emptyFiltered: 'لا مسارات تطابق هذه المرشّحات.',
      emptyCatalog: 'لا مسارات منشورة بعد. انضم لقائمة الانتظار وسنشارك أول المسارات عند إطلاقها.',
      items: trailAr,
    },
    safety: {
      eyebrow: 'السلامة والأرض',
      title: 'الإرشاد أولاً. الإثارة ثانياً.',
      lede: 'السلامة مدمجة في كل نصيحة مسار — لا ملاحظة في التذييل. عادات احترام البيئة ترافق كل ملاحظة.',
      items: [
        {
          title: 'اعرف قبل أن تذهب',
          body: 'الصعوبة والطول والحرارة والماء و«متى لا تذهب» قبل أن تربط حذاءك.',
        },
        {
          title: 'الطقس والسيول',
          body: 'تجنب حرارة منتصف صيف إن أمكن. لا تخيّم في قاع الوادي — السيول حقيقية.',
        },
        {
          title: 'عدة تناسب الأرض',
          body: 'لا صندل في الأودية. مهارة سباحة للكهوف والبرك. لباس محتشم في مسارات القرى.',
        },
        {
          title: 'لا تترك أثراً',
          body: 'احمل نفاياتك، احمِ مياه الأفلاج، التزم المسارات، واترك مسافة للحياة الفطرية.',
        },
      ],
    },
    how: {
      eyebrow: 'كيف يعمل',
      title: 'مشي موجّه بالخريطة — بلا متجر جولات.',
      lede: 'المنتج الذي نبنيه رفيق موجّه ذاتياً: اختر مساراً مختاراً، استعد بملاحظات السلامة، ثم اتبع الطريق على خريطة داخل التطبيق بوتيرتك.',
      steps: [
        {
          title: '١. اختر مساراً',
          body: 'تصفح مجموعة عُمانية مختارة مع المسافة والصعوبة والموسم — لا كتالوجاً ضخماً.',
        },
        {
          title: '٢. استعد بعناية',
          body: 'اقرأ إشارات السلامة وملاحظات التجهيز وتذكيرات احترام البيئة قبل المغادرة.',
        },
        {
          title: '٣. اتبع الخريطة',
          body: 'امشِ والخريطة داخل التطبيق مرشدك — سفر موجّه ذاتياً دون مرشد سياحي.',
        },
      ],
      note: 'موقع تسويقي الآن. نموذج أولي تفاعلي للخريطة لاحقاً — لن ندّعي GPS حيّاً قبل أن يُطلق.',
    },
    team: {
      eyebrow: 'عن دربها',
      title: 'بُنيت في عُمان، لمن يريد أن يمشيها كما يجب.',
      lede: 'دربها شركة إرشاد للمغامرات تركز على المشي الموجّه ذاتياً: مسارات مختارة، ملاحظات سلامة واضحة، واحترام للأرض — ليستكشف المسافرون أماكن عُمان البرية بثقة.',
    },
    waitlist: {
      eyebrow: 'ابقَ قريباً',
      title: 'انضم لقائمة انتظار رفيق المسار.',
      lede: 'اترك بريداً لتحديثات النموذج الأولي بينما ننشر أول المسارات المختارة.',
      placeholder: 'you@email.com',
      submit: 'انضم للقائمة',
      thanks: 'شكراً — أنت على القائمة. سنتواصل مع نمو دربها.',
      emailLabel: 'البريد الإلكتروني',
    },
    footer: {
      tagline: 'اعرف الدرب. احترم الأرض.',
      note: 'الصور: ويكيميديا كومنز (مناظر عُمان). موقع تسويقي — تطبيق المنتج لاحقاً.',
      top: 'الأعلى',
    },
  },
}
