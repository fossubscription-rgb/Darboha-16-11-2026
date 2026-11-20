import type { PublishedPlaceRow } from '../admin/api'
import type { Lang, Trail } from '../i18n'

const MONTHS_EN = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const MONTHS_AR = [
  '',
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
]

function difficultyKey(
  difficulty: string,
): Trail['difficultyKey'] {
  const d = difficulty.toLowerCase()
  if (d.includes('easy') || d.includes('سهل')) return 'easy'
  if (d.includes('var') || d.includes('متفاوت')) return 'varies'
  return 'moderate'
}

function seasonLabel(
  from: number | null,
  to: number | null,
  lang: Lang,
): string {
  if (!from || !to) return '—'
  const months = lang === 'ar' ? MONTHS_AR : MONTHS_EN
  if (from === to) return months[from] ?? '—'
  return `${months[from] ?? from}–${months[to] ?? to}`
}

function seasonMonths(from: number | null, to: number | null): number[] {
  if (!from || !to) return []
  const out: number[] = []
  let m = from
  for (let i = 0; i < 12; i++) {
    out.push(m)
    if (m === to) break
    m = m === 12 ? 1 : m + 1
  }
  return out
}

function coverImage(photos: PublishedPlaceRow['photos']): string {
  const list = photos ?? []
  const cover = list.find((p) => p.isCover) ?? list[0]
  return cover?.url?.trim() || '/images/hero.jpg'
}

export function mapPublishedToTrail(
  row: PublishedPlaceRow,
  lang: Lang,
): Trail {
  const name = lang === 'ar' ? row.nameAr || row.nameEn : row.nameEn || row.nameAr
  const blurb =
    lang === 'ar'
      ? row.summaryAr || row.summaryEn
      : row.summaryEn || row.summaryAr
  const distance =
    [row.distanceKm?.trim() && `${row.distanceKm.trim()} km`, row.durationText?.trim()]
      .filter(Boolean)
      .join(' · ') || '—'

  return {
    id: row.id,
    image: coverImage(row.photos),
    name: name || 'Untitled',
    region: row.region || '—',
    blurb: blurb || '',
    distance,
    difficulty: row.difficulty || '—',
    difficultyKey: difficultyKey(row.difficulty || ''),
    season: seasonLabel(row.seasonFrom, row.seasonTo, lang),
    seasonMonths: seasonMonths(row.seasonFrom, row.seasonTo),
  }
}
