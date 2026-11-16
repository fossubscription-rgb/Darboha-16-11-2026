export type Lang = 'en' | 'ar'

export type Trail = {
  id: string
  image: string
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
      placeholderBadge: string
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
    roles: string[]
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
      lede: 'A small set of places we are documenting with care — difficulty, season, and what the day actually asks of you. Placeholder facts for now; real field notes come next.',
      explore: 'Explore trails',
      metaDistance: 'Distance',
      metaDifficulty: 'Difficulty',
      metaSeason: 'Season',
      placeholderBadge: 'Placeholder content',
      items: [
        {
          id: 'balcony',
          image: '/images/trail.jpg',
          name: 'Jebel Shams — W6 Balcony Walk',
          region: 'Al Dakhiliyah',
          blurb: 'Iconic canyon rim path with big views and honest exposure notes.',
          distance: '~8 km RT',
          difficulty: 'Easy–moderate',
          season: 'Oct–Apr',
        },
        {
          id: 'shab',
          image: '/images/wadi.jpg',
          name: 'Wadi Shab',
          region: 'Ash Sharqiyah',
          blurb: 'Boat crossing, pools, and a cave swim — footwear and swim skill matter.',
          distance: 'Day hike',
          difficulty: 'Moderate',
          season: 'Sep–May',
        },
        {
          id: 'bani-khalid',
          image: '/images/hero.jpg',
          name: 'Wadi Bani Khalid',
          region: 'Ash Sharqiyah',
          blurb: 'Oasis pools and stone walls — classic, crowded in peak season.',
          distance: 'Short walks',
          difficulty: 'Easy',
          season: 'Feb–Apr best',
        },
        {
          id: 'akhdar',
          image: '/images/coast.jpg',
          name: 'Jebel Akhdar terraces',
          region: 'Al Dakhiliyah',
          blurb: 'Green mountain villages and short terrace walks — cooler air, checkpoint culture.',
          distance: 'Village loops',
          difficulty: 'Easy–moderate',
          season: 'Cooler months',
        },
        {
          id: 'tiwi',
          image: '/images/wadi.jpg',
          name: 'Wadi Tiwi / Mibam',
          region: 'Ash Sharqiyah',
          blurb: 'Adventure wadi alternative — hiking and swimming with local path sense.',
          distance: 'Half–full day',
          difficulty: 'Moderate',
          season: 'Sep–May',
        },
        {
          id: 'wahiba',
          image: '/images/hero.jpg',
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
      title: 'Guidance first. Thrill second.',
      lede: 'Health & safety is a core role on our team — not a footer disclaimer. Eco habits travel with every trail tip.',
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
      title: 'A Grade 9 company for Oman Wijhati.',
      lede: 'Seven students building in the field سياحة المغامرات والابتكار البيئي — adventure tourism and eco innovation. Student-owned idea, prototype path, and story.',
      roles: [
        'CEO / Developer',
        'Data analysts ×2',
        'CFO / VP',
        'Social media ×2',
        'Health & safety',
      ],
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
      lede: 'مجموعة صغيرة نوثّقها بعناية — الصعوبة، الموسم، وما يطلبه اليوم فعلاً. حقائق مؤقتة الآن؛ ملاحظات ميدانية لاحقاً.',
      explore: 'استكشف المسارات',
      metaDistance: 'المسافة',
      metaDifficulty: 'الصعوبة',
      metaSeason: 'الموسم',
      placeholderBadge: 'محتوى مؤقت',
      items: [
        {
          id: 'balcony',
          image: '/images/trail.jpg',
          name: 'جبل شمس — ممشى الشرفة W6',
          region: 'الداخلية',
          blurb: 'درب شهير على حافة الوادي بإطلالات واسعة وملاحظات صريحة عن التعرض.',
          distance: '~٨ كم ذهاباً وإياباً',
          difficulty: 'سهل–متوسط',
          season: 'أكتوبر–أبريل',
        },
        {
          id: 'shab',
          image: '/images/wadi.jpg',
          name: 'وادي شاب',
          region: 'الشرقية',
          blurb: 'عبور بالقارب وبرك وسباحة في كهف — الحذاء ومهارة السباحة مهمان.',
          distance: 'نزهة يوم',
          difficulty: 'متوسط',
          season: 'سبتمبر–مايو',
        },
        {
          id: 'bani-khalid',
          image: '/images/hero.jpg',
          name: 'وادي بني خالد',
          region: 'الشرقية',
          blurb: 'برك واحة وجدران صخرية — كلاسيكي ومزدحم في ذروة الموسم.',
          distance: 'مشاوير قصيرة',
          difficulty: 'سهل',
          season: 'فبراير–أبريل أفضل',
        },
        {
          id: 'akhdar',
          image: '/images/coast.jpg',
          name: 'مدرجات الجبل الأخضر',
          region: 'الداخلية',
          blurb: 'قرى جبلية خضراء ومشاوير مدرجات قصيرة — هواء أبرد وثقافة نقاط التفتيش.',
          distance: 'حلقات قروية',
          difficulty: 'سهل–متوسط',
          season: 'الأشهر الأبرد',
        },
        {
          id: 'tiwi',
          image: '/images/wadi.jpg',
          name: 'وادي طوي / ميام',
          region: 'الشرقية',
          blurb: 'بديل مغامرات في الوادي — مشي وسباحة مع حسّ المسار المحلي.',
          distance: 'نصف يوم–يوم',
          difficulty: 'متوسط',
          season: 'سبتمبر–مايو',
        },
        {
          id: 'wahiba',
          image: '/images/hero.jpg',
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
      title: 'الإرشاد أولاً. الإثارة ثانياً.',
      lede: 'الصحة والسلامة دور أساسي في فريقنا — لا ملاحظة في التذييل. عادات احترام البيئة ترافق كل نصيحة مسار.',
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
      title: 'شركة طلابية من الصف التاسع في عمان وجهتي.',
      lede: 'سبعة طلاب يبنون في مجال سياحة المغامرات والابتكار البيئي. فكرة ونموذج أولي وقصة يملكها الطلبة.',
      roles: [
        'الرئيس التنفيذي / المطوّر',
        'محللو بيانات ×٢',
        'المدير المالي / نائب الرئيس',
        'وسائل التواصل ×٢',
        'الصحة والسلامة',
      ],
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
