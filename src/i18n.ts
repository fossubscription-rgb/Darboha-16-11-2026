export type Lang = 'en' | 'ar'

export type TrailCopy = {
  id: string
  name: string
  region: string
  blurb: string
  distance: string
  difficulty: string
  season: string
}

type Copy = {
  skip: string
  nav: {
    trails: string
    safety: string
    how: string
    join: string
  }
  langToggle: string
  langToggleAria: string
  hero: {
    brandPrimary: string
    brandSecondary: string
    brandSecondaryLang: Lang
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
    placeholderBadge: string
    coverBadge: string
    captionEnLabel: string
    captionArLabel: string
    filters: {
      difficultyLabel: string
      seasonLabel: string
      all: string
      empty: string
      reset: string
      difficulty: {
        easy: string
        'easy-moderate': string
        moderate: string
        varies: string
      }
      season: {
        cool: string
        spring: string
        extended: string
      }
    }
    items: TrailCopy[]
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

export const copy: Record<Lang, Copy> = {
  en: {
    skip: 'Skip to content',
    nav: {
      trails: 'Trails',
      safety: 'Safety',
      how: 'How it works',
      join: 'Join waitlist',
    },
    langToggle: 'العربية',
    langToggleAria: 'Switch to Arabic',
    hero: {
      brandPrimary: 'Darboha',
      brandSecondary: 'دربها',
      brandSecondaryLang: 'ar',
      tagline: 'Know the trail. Respect the land.',
      lede: 'Self-guided travel for Oman’s wild places — follow curated trails on an in-app map, without a tour guide. Clearer routes, safer habits, gentler footprints.',
      ctaPrimary: 'Join the waitlist',
      ctaSecondary: 'Explore trails',
    },
    promise: {
      eyebrow: 'The promise',
      title: 'Walk Oman with a map in your pocket — and respect in your pack.',
      lede: 'Darboha is a trail companion for foreigners, travelers, and hikers — not a tour shop. We curate the paths that matter, show you how to prepare, and help you leave the land whole, so you can explore on your own map.',
    },
    trails: {
      eyebrow: 'Curated, not endless',
      title: 'Featured trails',
      lede: 'A small set of places we are documenting with care — difficulty, season, and what the day actually asks of you. Placeholder facts for now; real field notes come next.',
      explore: 'Explore trails',
      metaDistance: 'Distance',
      metaDifficulty: 'Difficulty',
      metaSeason: 'Season',
      placeholderBadge: 'Placeholder content',
      coverBadge: 'Cover',
      captionEnLabel: 'EN',
      captionArLabel: 'AR',
      filters: {
        difficultyLabel: 'Difficulty',
        seasonLabel: 'Season',
        all: 'All',
        empty: 'No trails match these filters. Reset to see the full curated set.',
        reset: 'Reset filters',
        difficulty: {
          easy: 'Easy',
          'easy-moderate': 'Easy–moderate',
          moderate: 'Moderate',
          varies: 'Varies',
        },
        season: {
          cool: 'Cool (Oct–Mar)',
          spring: 'Spring (Feb–Apr)',
          extended: 'Extended (Sep–May)',
        },
      },
      items: [
        {
          id: 'balcony',
          name: 'Jebel Shams — W6 Balcony Walk',
          region: 'Al Dakhiliyah',
          blurb: 'Iconic canyon rim path with big views and honest exposure notes.',
          distance: '~8 km RT',
          difficulty: 'Easy–moderate',
          season: 'Oct–Apr',
        },
        {
          id: 'shab',
          name: 'Wadi Shab',
          region: 'Ash Sharqiyah',
          blurb: 'Boat crossing, pools, and a cave swim — footwear and swim skill matter.',
          distance: 'Day hike',
          difficulty: 'Moderate',
          season: 'Sep–May',
        },
        {
          id: 'bani-khalid',
          name: 'Wadi Bani Khalid',
          region: 'Ash Sharqiyah',
          blurb: 'Oasis pools and stone walls — classic, crowded in peak season.',
          distance: 'Short walks',
          difficulty: 'Easy',
          season: 'Feb–Apr best',
        },
        {
          id: 'akhdar',
          name: 'Jebel Akhdar terraces',
          region: 'Al Dakhiliyah',
          blurb: 'Green mountain villages and short terrace walks — cooler air, checkpoint culture.',
          distance: 'Village loops',
          difficulty: 'Easy–moderate',
          season: 'Cooler months',
        },
        {
          id: 'tiwi',
          name: 'Wadi Tiwi / Mibam',
          region: 'Ash Sharqiyah',
          blurb: 'Adventure wadi alternative — hiking and swimming with local path sense.',
          distance: 'Half–full day',
          difficulty: 'Moderate',
          season: 'Sep–May',
        },
        {
          id: 'wahiba',
          name: 'Wahiba Sands',
          region: 'Ash Sharqiyah',
          blurb: 'Desert travel context, not a hiking trail — dunes, night sky, and heat honesty.',
          distance: 'Day / overnight',
          difficulty: 'Varies',
          season: 'Oct–Mar',
        },
      ],
    },
    safety: {
      eyebrow: 'Safety & the land',
      title: 'Your companion for a careful day out.',
      lede: 'Darboha walks beside you with clear prep — not a booking desk. Safety notes and Leave No Trace habits sit with every trail, so you decide when to go and when to turn back.',
      items: [
        {
          title: 'Know before you go',
          body: 'Difficulty, length, heat, water, and “when not to go” — read them before you lace up.',
        },
        {
          title: 'Weather & floods',
          body: 'Skip harsh midday heat when you can. Never camp on a wadi floor — flash floods are real.',
        },
        {
          title: 'Kit that matches the land',
          body: 'Solid shoes in wadis. Swim skill for caves and pools. Modest dress on village paths.',
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
    waitlist: {
      eyebrow: 'Stay close',
      title: 'Join the waitlist for the trail companion.',
      lede: 'Draft form — no backend yet. Submit to see a local confirmation; real signup comes later.',
      placeholder: 'you@email.com',
      submit: 'Join waitlist',
      thanks: 'Saved locally for this draft — thanks! Real waitlist storage comes later (no email sent).',
      emailLabel: 'Email',
    },
    footer: {
      tagline: 'Know the trail. Respect the land.',
      note: 'Photos: Wikimedia Commons (Oman landscapes). Marketing site only — product app and logo mark coming later. Social links TBD.',
      top: 'Top',
    },
  },
  ar: {
    skip: 'تخطى إلى المحتوى',
    nav: {
      trails: 'المسارات',
      safety: 'السلامة',
      how: 'كيف يعمل',
      join: 'القائمة',
    },
    langToggle: 'English',
    langToggleAria: 'التبديل إلى الإنجليزية',
    hero: {
      brandPrimary: 'دربها',
      brandSecondary: 'Darboha',
      brandSecondaryLang: 'en',
      tagline: 'اعرف الدرب. احترم الأرض.',
      lede: 'سفر موجّه ذاتياً في أماكن عُمان البرية — اتبع مسارات مختارة عبر خريطة داخل التطبيق، دون مرشد سياحي. مسارات أوضح، عادات أأمن، وبصمة ألطف.',
      ctaPrimary: 'انضم للقائمة',
      ctaSecondary: 'استكشف المسارات',
    },
    promise: {
      eyebrow: 'وعدنا',
      title: 'امشِ عُمان وخريطتك في جيبك — والاحترام في حقيبتك.',
      lede: 'دربها رفيق مسار للمسافرين والمتنزهين — لا متجر جولات. نختار الدروب بعناية، ونوضح كيف تستعد، ونساعدك على ترك الأرض سليمة، لتستكشف بخريطتك أنت.',
    },
    trails: {
      eyebrow: 'مختار لا موسوعة',
      title: 'مسارات مميزة',
      lede: 'مجموعة صغيرة نوثّقها بعناية — الصعوبة، الموسم، وما يطلبه اليوم فعلاً. حقائق مؤقتة الآن؛ ملاحظات ميدانية لاحقاً.',
      explore: 'استكشف المسارات',
      metaDistance: 'المسافة',
      metaDifficulty: 'الصعوبة',
      metaSeason: 'الموسم',
      placeholderBadge: 'محتوى مؤقت',
      coverBadge: 'الغلاف',
      captionEnLabel: 'EN',
      captionArLabel: 'ع',
      filters: {
        difficultyLabel: 'الصعوبة',
        seasonLabel: 'الموسم',
        all: 'الكل',
        empty: 'لا مسارات تطابق هذه المرشّحات. أعد التعيين لرؤية المجموعة المختارة كاملة.',
        reset: 'إعادة تعيين المرشّحات',
        difficulty: {
          easy: 'سهل',
          'easy-moderate': 'سهل–متوسط',
          moderate: 'متوسط',
          varies: 'متفاوت',
        },
        season: {
          cool: 'بارد (أكتوبر–مارس)',
          spring: 'ربيع (فبراير–أبريل)',
          extended: 'ممتد (سبتمبر–مايو)',
        },
      },
      items: [
        {
          id: 'balcony',
          name: 'جبل شمس — ممشى الشرفة W6',
          region: 'الداخلية',
          blurb: 'درب شهير على حافة الوادي بإطلالات واسعة وملاحظات صريحة عن التعرض.',
          distance: '~٨ كم ذهاباً وإياباً',
          difficulty: 'سهل–متوسط',
          season: 'أكتوبر–أبريل',
        },
        {
          id: 'shab',
          name: 'وادي شاب',
          region: 'الشرقية',
          blurb: 'عبور بالقارب وبرك وسباحة في كهف — الحذاء ومهارة السباحة مهمان.',
          distance: 'نزهة يوم',
          difficulty: 'متوسط',
          season: 'سبتمبر–مايو',
        },
        {
          id: 'bani-khalid',
          name: 'وادي بني خالد',
          region: 'الشرقية',
          blurb: 'برك واحة وجدران صخرية — كلاسيكي ومزدحم في ذروة الموسم.',
          distance: 'مشاوير قصيرة',
          difficulty: 'سهل',
          season: 'فبراير–أبريل أفضل',
        },
        {
          id: 'akhdar',
          name: 'مدرجات الجبل الأخضر',
          region: 'الداخلية',
          blurb: 'قرى جبلية خضراء ومشاوير مدرجات قصيرة — هواء أبرد وثقافة نقاط التفتيش.',
          distance: 'حلقات قروية',
          difficulty: 'سهل–متوسط',
          season: 'الأشهر الأبرد',
        },
        {
          id: 'tiwi',
          name: 'وادي طوي / ميام',
          region: 'الشرقية',
          blurb: 'بديل مغامرات في الوادي — مشي وسباحة مع حسّ المسار المحلي.',
          distance: 'نصف يوم–يوم',
          difficulty: 'متوسط',
          season: 'سبتمبر–مايو',
        },
        {
          id: 'wahiba',
          name: 'رمال وهيبة',
          region: 'الشرقية',
          blurb: 'سياق سفر صحراوي لا درب مشي — كثبان وسماء ليلية وصدق مع الحرارة.',
          distance: 'يوم / مبيت',
          difficulty: 'متفاوت',
          season: 'أكتوبر–مارس',
        },
      ],
    },
    safety: {
      eyebrow: 'السلامة والأرض',
      title: 'رفيقك ليومٍ حذر في الطبيعة.',
      lede: 'دربها يسير معك بتجهيز واضح — لا مكتب حجوزات. ملاحظات السلامة وعادات «لا تترك أثراً» ترافق كل مسار، فتقرر متى تذهب ومتى تعود.',
      items: [
        {
          title: 'اعرف قبل أن تذهب',
          body: 'الصعوبة والطول والحرارة والماء و«متى لا تذهب» — اقرأها قبل أن تربط حذاءك.',
        },
        {
          title: 'الطقس والسيول',
          body: 'تجنّب حرارة الظهيرة القاسية إن أمكن. لا تخيّم في قاع الوادي — السيول حقيقية.',
        },
        {
          title: 'عدة تناسب الأرض',
          body: 'حذاء متين في الأودية. مهارة سباحة للكهوف والبرك. لباس محتشم في مسارات القرى.',
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
    waitlist: {
      eyebrow: 'ابقَ قريباً',
      title: 'انضم لقائمة انتظار رفيق المسار.',
      lede: 'نموذج مسودة — بلا خلفية بعد. أرسل لترى تأكيداً محلياً؛ التسجيل الحقيقي لاحقاً.',
      placeholder: 'you@email.com',
      submit: 'انضم للقائمة',
      thanks: 'حُفظ محلياً لهذه المسودة — شكراً! تخزين قائمة الانتظار الحقيقي لاحقاً (لم يُرسل بريد).',
      emailLabel: 'البريد الإلكتروني',
    },
    footer: {
      tagline: 'اعرف الدرب. احترم الأرض.',
      note: 'الصور: ويكيميديا كومنز (مناظر عُمان). موقع تسويقي فقط — تطبيق المنتج وشعار العلامة لاحقاً. روابط التواصل قيد التحديد.',
      top: 'الأعلى',
    },
  },
}
