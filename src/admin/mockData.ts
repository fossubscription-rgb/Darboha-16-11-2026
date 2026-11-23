import type { FinanceDraft, Place } from './types'

const emptySafety = {
  hazards: '',
  heat: '',
  flood: '',
  water: '',
  signal: '',
  emergency: '',
  whenNotToGo: '',
  kit: '',
  emergencyContacts: '',
  nearestClinic: '',
  nearestClinicPlaceId: '',
  nearestClinicLat: null,
  nearestClinicLng: null,
  nearestClinicMapsUrl: '',
  notesEn: '',
  notesAr: '',
  completed: false,
}

/** Empty draft used when DA creates a new place. */
export function blankPlace(ownerId: string, ownerLabel: string): Place {
  return {
    id: crypto.randomUUID(),
    createdBy: ownerId,
    ownerLabel,
    status: 'draft',
    nameEn: '',
    nameAr: '',
    summaryEn: '',
    summaryAr: '',
    region: '',
    difficulty: 'Moderate',
    seasonFrom: null,
    seasonTo: null,
    distanceKm: '',
    durationText: '',
    startPlaceEn: '',
    startPlaceAr: '',
    startPlacePlaceId: '',
    startPlaceLat: null,
    startPlaceLng: null,
    startPlaceMapsUrl: '',
    endPlaceEn: '',
    endPlaceAr: '',
    endPlacePlaceId: '',
    endPlaceLat: null,
    endPlaceLng: null,
    endPlaceMapsUrl: '',
    nearbyAmenities: [],
    amenitiesNotesEn: '',
    amenitiesNotesAr: '',
    fragile: false,
    vehicleAccess: 'four_wd',
    accessNotesEn: '',
    accessNotesAr: '',
    trailheadNotesEn: '',
    trailheadNotesAr: '',
    photos: [],
    safety: { ...emptySafety },
    updatedAt: new Date().toISOString(),
  }
}

/** Empty draft used when CFO creates a new budget line. */
export function blankFinance(createdBy: string): FinanceDraft {
  return {
    id: crypto.randomUUID(),
    createdBy,
    category: '',
    whoFor: '',
    description: '',
    amountOmr: '',
    status: 'draft',
    updatedAt: new Date().toISOString(),
  }
}
