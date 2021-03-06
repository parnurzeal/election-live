import { getProvinceById } from "."

// @ts-check

// Provinces where zone boundaries were manipulated by NCPO
// @see https://github.com/codeforthailand/election-live/issues/21
const GERRYMANDERING_PROVINCES = [30, 32, 44, 35, 47, 41, 60, 73, 57, 64, 18]

// Provinces where vote count difference between 1st and 2nd parties
// is less than 5% (source: Thailand general election 2554)
// @see https://github.com/codeforthailand/election-live/issues/22
const SWING_PROVINCES = [37, 26, 70, 25, 20, 10, 62, 64, 74]

// Urban zone is zone which its density is more than 800 people / sq.km.
// (taken from the least dense zone in Bangkok)
// @see https://github.com/codeforthailand/election-live/issues/19
const URBAN_ZONES = [
  "10-1",
  "10-22",
  "10-7",
  "10-2",
  "10-3",
  "10-30",
  "10-5",
  "11-3",
  "10-4",
  "10-23",
  "10-6",
  "10-21",
  "10-8",
  "10-13",
  "10-14",
  "10-10",
  "90-2",
  "10-29",
  "10-12",
  "10-9",
  "12-2",
  "10-11",
  "13-4",
  "10-24",
  "11-1",
  "10-28",
  "12-1",
  "10-19",
  "11-6",
  "10-20",
  "10-26",
  "12-5",
  "12-4",
  "10-15",
  "10-27",
  "30-1",
  "11-2",
  "83-1",
  "40-1",
  "10-16",
  "74-2",
  "10-25",
  "41-1",
  "12-3",
  "10-18",
  "73-5",
  "13-3",
  "50-1",
  "11-7",
  "11-4",
  "20-1",
  "90-1",
  "73-1",
  "13-2",
  "20-2",
  "74-1",
  "94-1",
  "10-17",
]

/**
 * Available filters.
 *
 * To add a new filter, please also add a new entry in ZoneFilterName type.
 *
 * @type {{ [filterName in ZoneFilterName]: IZoneFilter }}
 */
export const filters = {
  all: {
    name: {
      th: "ทั่วประเทศ",
      en: "All areas",
    },
    criterion: (province, zone) => true,
  },
  northern: {
    name: {
      th: "ภาคเหนือ",
      en: "Northern region",
    },
    criterion: (province, zone) => province.regionId === 1,
  },
  northeastern: {
    name: {
      th: "ภาคตะวันออกเฉียงเหนือ",
      en: "Northeastern region",
    },
    criterion: (province, zone) => province.regionId === 2,
  },
  central: {
    name: {
      th: "ภาคกลาง",
      en: "Central region",
    },
    criterion: (province, zone) => province.regionId === 3,
  },
  southern: {
    name: {
      th: "ภาคใต้",
      en: "Southern region",
    },
    criterion: (province, zone) => province.regionId === 4,
  },
  urban: {
    name: {
      th: "เขตพื้นที่ในเมือง",
      en: "Urban",
    },
    criterion: (province, zone) =>
      URBAN_ZONES.includes(`${zone.provinceId}-${zone.no}`),
  },
  rural: {
    name: {
      th: "เขตพื้นที่นอกเมือง",
      en: "Rural",
    },
    criterion: (province, zone) =>
      !URBAN_ZONES.includes(`${zone.provinceId}-${zone.no}`),
  },
  gerrymandering: {
    name: {
      th: "เขตถูกแบ่งโดย คสช.",
      en: "Gerrymandering",
    },
    criterion: (province, zone) =>
      GERRYMANDERING_PROVINCES.includes(province.id),
  },
  swing: {
    name: {
      th: "เขตที่ไม่มีฐานเสียงชัดเจน",
      en: "Swing District",
    },
    criterion: (province, zone) => SWING_PROVINCES.includes(province.id),
  },
}

/**
 * @param {ZoneFilterName} filterName
 */
export function filterPath(filterName) {
  return filterName === "all" ? "/" : `/filters/${filterName}`
}

/**
 * @param {IZoneFilter} filter
 * @param {IZone} zone
 */
export function checkFilter(filter, zone) {
  return filter.criterion(getProvinceById(zone.provinceId), zone)
}
