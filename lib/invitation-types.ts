export interface TimelineItem {
  time?: string
  venue?: string
  event: string
  eventLang2?: string
  venueLang2?: string
}

export interface InvitationData {
  groomNameEn: string
  groomLastNameEn: string
  groomNameAr: string
  brideNameEn: string
  brideLastNameEn: string
  brideNameAr: string
  weddingDate: string
  weddingDateAr: string
  weddingYear: string
  weddingTime: string
  weddingDay: string
  weddingDayAr: string
  cityEn: string
  cityAr: string
  venueEn: string
  venueAr: string
  ceremonyMapsUrl: string
  receptionVenueEn: string
  receptionCityEn: string
  receptionMapsUrl: string
  dresscodeType: string
  dresscodeMen: string
  dresscodeMenColor: string
  dresscodeWomen: string
  dresscodeWomenColor: string
  hashtag: string
  rsvpDeadline: string
  timeline: TimelineItem[]
  // Second language (Riviera Dreams)
  lang2Code: string
  lang2Label: string
  lang2Date: string
  lang2City: string
  lang2Venue: string
  lang2DresscodeType: string
  lang2DresscodeMen: string
  lang2DresscodeWomen: string
  // Music
  musicUrl: string
}

export const DEFAULT_INVITATION_DATA: InvitationData = {
  groomNameEn: 'James',
  groomLastNameEn: 'Harrison',
  groomNameAr: 'جيمس',
  brideNameEn: 'Emma',
  brideLastNameEn: 'Sullivan',
  brideNameAr: 'إيما',
  weddingDate: 'June 27',
  weddingDateAr: '27 جوان',
  weddingYear: '2026',
  weddingTime: '20:00',
  weddingDay: 'Saturday',
  weddingDayAr: 'السبت',
  cityEn: 'Santorini',
  cityAr: 'تونس',
  venueEn: 'Villa Indira',
  venueAr: 'قاعة الأفراح دريم لاك 1',
  ceremonyMapsUrl: 'https://www.google.com/maps/search/Oia+Santorini+Greece',
  receptionVenueEn: '',
  receptionCityEn: '',
  receptionMapsUrl: '',
  dresscodeType: 'Cocktail Attire',
  dresscodeMen: 'Suit & Tie',
  dresscodeMenColor: '#1B2A4A',
  dresscodeWomen: 'Cocktail Dress or Gown',
  dresscodeWomenColor: '#BDD0E4',
  hashtag: '#JamesAndEmma2026',
  rsvpDeadline: '',
  timeline: [
    { time: '18:00', venue: 'Filerimos Monastery', event: 'Ceremony'        },
    { time: '20:00', venue: 'Villa Indira',         event: 'Welcome Drinks'  },
    { time: '21:00',                                event: 'Dinner'          },
    {                                               event: 'Party to follow' },
  ],
  lang2Code: '',
  lang2Label: '',
  lang2Date: '',
  lang2City: '',
  lang2Venue: '',
  lang2DresscodeType: '',
  lang2DresscodeMen: '',
  lang2DresscodeWomen: '',
  musicUrl: '',
}

/** Defaults shown when no draft exists for the Arabic Moorish template */
export const ARABIC_MOORISH_DEFAULTS: InvitationData = {
  groomNameEn: 'Omar',
  groomLastNameEn: 'Mahmoud',
  groomNameAr: 'عمر محمود',
  brideNameEn: 'Layla',
  brideLastNameEn: 'Mansour',
  brideNameAr: 'ليلى منصور',
  weddingDate: 'June 27',
  weddingDateAr: '27 جوان',
  weddingYear: '2026',
  weddingTime: '20:00',
  weddingDay: 'Saturday',
  weddingDayAr: 'السبت',
  cityEn: 'Tunis',
  cityAr: 'تونس',
  venueEn: 'Salle Des Fêtes Dream Lac1',
  venueAr: 'قاعة الأفراح دريم لاك 1',
  ceremonyMapsUrl: '',
  receptionVenueEn: '',
  receptionCityEn: '',
  receptionMapsUrl: '',
  dresscodeType: 'Cocktail Attire',
  dresscodeMen: 'Navy Blue Suit & Necktie',
  dresscodeMenColor: '#1B2A4A',
  dresscodeWomen: 'Light blue or baby pink dress',
  dresscodeWomenColor: '#BDD0E4',
  hashtag: '#OmarAndLayla2026',
  rsvpDeadline: '',
  timeline: [
    { time: '18:00', venue: 'Mosque Al-Zaytuna', event: 'Ceremony'        },
    { time: '20:00', venue: 'Dream Lac1',         event: 'Welcome Drinks'  },
    { time: '21:00',                              event: 'Dinner'          },
    {                                             event: 'Party to follow' },
  ],
  lang2Code: '',
  lang2Label: '',
  lang2Date: '',
  lang2City: '',
  lang2Venue: '',
  lang2DresscodeType: '',
  lang2DresscodeMen: '',
  lang2DresscodeWomen: '',
  musicUrl: '',
}

export const IVORY_PAVILION_DEFAULTS: InvitationData = {
  groomNameEn: 'Alexander',
  groomLastNameEn: 'Laurent',
  groomNameAr: '',
  brideNameEn: 'Isabelle',
  brideLastNameEn: 'Moreau',
  brideNameAr: '',
  weddingDate: 'September 14',
  weddingDateAr: '',
  weddingYear: '2026',
  weddingTime: '17:00',
  weddingDay: 'Saturday',
  weddingDayAr: '',
  cityEn: 'Provence',
  cityAr: '',
  venueEn: 'Château de la Lumière',
  venueAr: '',
  ceremonyMapsUrl: 'https://www.google.com/maps/search/Provence+France',
  receptionVenueEn: 'Grand Salon',
  receptionCityEn: 'Provence',
  receptionMapsUrl: '',
  dresscodeType: 'Black Tie',
  dresscodeMen: 'Black Tuxedo',
  dresscodeMenColor: '#2C2416',
  dresscodeWomen: 'Floor-length Gown',
  dresscodeWomenColor: '#C8B99A',
  hashtag: '#AlexanderAndIsabelle2026',
  rsvpDeadline: 'August 1, 2026',
  timeline: [
    { time: '17:00', venue: 'Chapel Garden', event: 'Ceremony' },
    { time: '18:30', venue: 'Terrace', event: 'Cocktail Hour' },
    { time: '20:00', venue: 'Grand Salon', event: 'Dinner' },
    { event: 'Dancing to follow' },
  ],
  lang2Code: '',
  lang2Label: '',
  lang2Date: '',
  lang2City: '',
  lang2Venue: '',
  lang2DresscodeType: '',
  lang2DresscodeMen: '',
  lang2DresscodeWomen: '',
  musicUrl: '',
}

/** Returns the right starter defaults for a given templateId */
export function getTemplateDefaults(templateId: string): InvitationData {
  if (templateId === 'arabic-moorish') return ARABIC_MOORISH_DEFAULTS
  if (templateId === 'ivory-pavilion') return IVORY_PAVILION_DEFAULTS
  return DEFAULT_INVITATION_DATA // riviera-dreams and any future templates
}
