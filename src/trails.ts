export type DifficultyKey = 'easy' | 'easy-moderate' | 'moderate' | 'varies'

/** Cool / spring / extended windows used by the marketing filters. */
export type SeasonFilterKey = 'cool' | 'spring' | 'extended'

export type TrailPhoto = {
  src: string
  isCover: boolean
  captionEn: string
  captionAr: string
}

export type TrailCatalogEntry = {
  id: string
  difficultyKey: DifficultyKey
  /** Inclusive months 1–12 when the trail is in season (placeholder). */
  seasonMonths: number[]
  photos: TrailPhoto[]
  /**
   * Lower number = higher trend priority for the marketing hero rotation.
   * Omit when a place is not currently featured as a trend slide.
   * Placeholder until Supabase-published places drive this.
   */
  trendRank?: number
}

export type HeroTrendSlide = {
  trailId: string
  src: string
  captionEn: string
  captionAr: string
}

const MONTHS = {
  cool: [10, 11, 12, 1, 2, 3],
  spring: [2, 3, 4],
  extended: [9, 10, 11, 12, 1, 2, 3, 4, 5],
} as const

export const seasonFilterMonths: Record<SeasonFilterKey, readonly number[]> =
  MONTHS

export const trailCatalog: TrailCatalogEntry[] = [
  {
    id: 'balcony',
    difficultyKey: 'easy-moderate',
    seasonMonths: [10, 11, 12, 1, 2, 3, 4],
    trendRank: 1,
    photos: [
      {
        src: '/images/trail.jpg',
        isCover: true,
        captionEn: 'Cover placeholder — canyon rim light on Jebel Shams.',
        captionAr: 'غلاف مؤقت — ضوء حافة الوادي على جبل شمس.',
      },
      {
        src: '/images/coast.jpg',
        isCover: false,
        captionEn: 'Gallery placeholder — stone path and open sky.',
        captionAr: 'معرض مؤقت — درب حجري وسماء مفتوحة.',
      },
    ],
  },
  {
    id: 'shab',
    difficultyKey: 'moderate',
    seasonMonths: [9, 10, 11, 12, 1, 2, 3, 4, 5],
    trendRank: 2,
    photos: [
      {
        src: '/images/wadi.jpg',
        isCover: true,
        captionEn: 'Cover placeholder — pools and palm shade in Wadi Shab.',
        captionAr: 'غلاف مؤقت — برك وظل نخيل في وادي شاب.',
      },
      {
        src: '/images/hero.jpg',
        isCover: false,
        captionEn: 'Gallery placeholder — approach water and rock walls.',
        captionAr: 'معرض مؤقت — ماء الاقتراب وجدران صخرية.',
      },
    ],
  },
  {
    id: 'bani-khalid',
    difficultyKey: 'easy',
    seasonMonths: [2, 3, 4],
    photos: [
      {
        src: '/images/hero.jpg',
        isCover: true,
        captionEn: 'Cover placeholder — oasis pools at Wadi Bani Khalid.',
        captionAr: 'غلاف مؤقت — برك الواحة في وادي بني خالد.',
      },
      {
        src: '/images/wadi.jpg',
        isCover: false,
        captionEn: 'Gallery placeholder — stone walls and clear water.',
        captionAr: 'معرض مؤقت — جدران حجرية وماء صافٍ.',
      },
    ],
  },
  {
    id: 'akhdar',
    difficultyKey: 'easy-moderate',
    seasonMonths: [10, 11, 12, 1, 2, 3],
    trendRank: 3,
    photos: [
      {
        src: '/images/coast.jpg',
        isCover: true,
        captionEn: 'Cover placeholder — terrace paths on Jebel Akhdar.',
        captionAr: 'غلاف مؤقت — دروب المدرجات في الجبل الأخضر.',
      },
      {
        src: '/images/trail.jpg',
        isCover: false,
        captionEn: 'Gallery placeholder — village edge and cooler air.',
        captionAr: 'معرض مؤقت — طرف القرية وهواء أبرد.',
      },
    ],
  },
  {
    id: 'tiwi',
    difficultyKey: 'moderate',
    seasonMonths: [9, 10, 11, 12, 1, 2, 3, 4, 5],
    photos: [
      {
        src: '/images/wadi.jpg',
        isCover: true,
        captionEn: 'Cover placeholder — adventure wadi light at Tiwi / Mibam.',
        captionAr: 'غلاف مؤقت — ضوء وادي المغامرة في طوي / ميام.',
      },
      {
        src: '/images/coast.jpg',
        isCover: false,
        captionEn: 'Gallery placeholder — swim and hike segments.',
        captionAr: 'معرض مؤقت — مقاطع سباحة ومشي.',
      },
    ],
  },
  {
    id: 'wahiba',
    difficultyKey: 'varies',
    seasonMonths: [10, 11, 12, 1, 2, 3],
    trendRank: 4,
    photos: [
      {
        src: '/images/hero.jpg',
        isCover: true,
        captionEn: 'Cover placeholder — Wahiba dunes under soft light.',
        captionAr: 'غلاف مؤقت — كثبان وهيبة تحت ضوء لطيف.',
      },
      {
        src: '/images/trail.jpg',
        isCover: false,
        captionEn: 'Gallery placeholder — desert sky and evening heat honesty.',
        captionAr: 'معرض مؤقت — سماء صحراوية وصدق مع حرارة المساء.',
      },
    ],
  },
]

export function coverFirstPhotos(photos: TrailPhoto[]): TrailPhoto[] {
  const cover = photos.find((photo) => photo.isCover)
  const rest = photos.filter((photo) => !photo.isCover)
  return cover ? [cover, ...rest] : [...photos]
}

/** Cover images for places currently marked as trending (placeholder ranks). */
export function getTrendingHeroSlides(
  catalog: TrailCatalogEntry[] = trailCatalog,
): HeroTrendSlide[] {
  return catalog
    .filter((entry) => typeof entry.trendRank === 'number')
    .sort((a, b) => (a.trendRank ?? 99) - (b.trendRank ?? 99))
    .map((entry) => {
      const cover =
        entry.photos.find((photo) => photo.isCover) ?? entry.photos[0]
      if (!cover) return null
      return {
        trailId: entry.id,
        src: cover.src,
        captionEn: cover.captionEn,
        captionAr: cover.captionAr,
      }
    })
    .filter((slide): slide is HeroTrendSlide => slide !== null)
}

export function monthsOverlap(
  trailMonths: number[],
  filterMonths: readonly number[],
): boolean {
  const set = new Set(trailMonths)
  return filterMonths.some((month) => set.has(month))
}
