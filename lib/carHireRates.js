// ============================================================================
// Car hire rate book — extracted verbatim from SafariQuote_Master_v2_9_95.html
// (CAR_HIRE_COMPANIES, lines 32301-33477 of the source file). Do not hand-edit
// rate numbers here without checking against the source rate sheets — these
// are real negotiated company rates.
// ============================================================================

export const CAR_HIRE_COMPANIES = {
  NTS: {
    name: "Namibia Tours & Safaris (NTS)",
    contact: "enquiries@namibia-tours-safaris.com | +264 64 406038",
    note: "Rates incl. VAT, unlimited km, Collision & Theft Cover, GPS, 2nd spare tyre, 24/7 assistance, cooler box, GPS tracker, EVAC passenger insurance.",
    vehicles: [
      {
        id:"nts_fortuner_old", label:"SUV 4x4 Fortuner Auto (130k-200k km)",
        pax:4, camping:false,
        rates:{
          low:{d1_14:{rack:2060,sto:1650}, d15p:{rack:1890,sto:1510}},
          high:{d1_14:{rack:2330,sto:1865}, d15p:{rack:2110,sto:1690}}
        },
        stdExcess:0, reducedExcessDaily:null, reducedExcess:null, zeroExcessDaily:null, zeroExcess:0,
        note:"Zero excess included in daily rate."
      },
      {
        id:"nts_fortuner_hilux", label:"SUV 4x4 Fortuner Auto / Toyota Hilux D/C 4x4 Auto",
        pax:4, camping:false,
        rates:{
          low:{d1_14:{rack:2700,sto:2160}, d15p:{rack:2420,sto:1940}},
          high:{d1_14:{rack:3150,sto:2520}, d15p:{rack:2785,sto:2230}}
        },
        stdExcess:70000, reducedExcessDaily:485, reducedExcess:7000, zeroExcessDaily:730, zeroExcess:0,
        note:"Reduced excess N$7,000 (N$485/day). Zero excess available (N$730/day)."
      },
      {
        id:"nts_prado", label:"Toyota Prado 4x4 Auto",
        pax:5, camping:false,
        rates:{
          low:{d1_14:{rack:4070,sto:3260}, d15p:{rack:3665,sto:2930}},
          high:{d1_14:{rack:4680,sto:3745}, d15p:{rack:4215,sto:3370}}
        },
        stdExcess:0, reducedExcessDaily:null, reducedExcess:null, zeroExcessDaily:null, zeroExcess:0,
        note:"Zero excess included in daily rate."
      },
      {
        id:"nts_lc_dc", label:"Land Cruiser D/C 4x4 Manual",
        pax:4, camping:false,
        rates:{
          low:{d1_14:{rack:4070,sto:3260}, d15p:{rack:3665,sto:2930}},
          high:{d1_14:{rack:4680,sto:3745}, d15p:{rack:4215,sto:3370}}
        },
        stdExcess:0, reducedExcessDaily:null, reducedExcess:null, zeroExcessDaily:null, zeroExcess:0,
        note:"Zero excess included in daily rate."
      },
      {
        id:"nts_hilux_camp2", label:"Toyota Hilux D/C 4x4 Auto — Camping 2 pax",
        pax:2, camping:true,
        rates:{
          low:{d1_14:{rack:2945,sto:2360}, d15p:{rack:2660,sto:2130}},
          high:{d1_14:{rack:3390,sto:2710}, d15p:{rack:3025,sto:2420}}
        },
        stdExcess:70000, reducedExcessDaily:485, reducedExcess:7000, zeroExcessDaily:730, zeroExcess:0,
        note:"Camping equipped. Reduced excess N$7,000 (N$485/day). Zero excess N$730/day."
      },
      {
        id:"nts_hilux_camp4", label:"Toyota Hilux D/C 4x4 Auto — Camping 4 pax",
        pax:4, camping:true,
        rates:{
          low:{d1_14:{rack:3185,sto:2550}, d15p:{rack:2905,sto:2325}},
          high:{d1_14:{rack:3630,sto:2905}, d15p:{rack:3270,sto:2620}}
        },
        stdExcess:70000, reducedExcessDaily:485, reducedExcess:7000, zeroExcessDaily:730, zeroExcess:0,
        note:"Camping equipped. Reduced excess N$7,000 (N$485/day). Zero excess N$730/day."
      },
      {
        id:"nts_lc_camp2", label:"Land Cruiser D/C 4x4 Manual — Camping 2 pax",
        pax:2, camping:true,
        rates:{
          low:{d1_14:{rack:3590,sto:2870}, d15p:{rack:3235,sto:2590}},
          high:{d1_14:{rack:4125,sto:3300}, d15p:{rack:3720,sto:2980}}
        },
        stdExcess:70000, reducedExcessDaily:485, reducedExcess:7000, zeroExcessDaily:730, zeroExcess:0,
        note:"Camping equipped. Reduced excess N$7,000 (N$485/day). Zero excess N$730/day."
      },
      {
        id:"nts_lc_camp4", label:"Land Cruiser D/C 4x4 Manual — Camping 4 pax",
        pax:4, camping:true,
        rates:{
          low:{d1_14:{rack:3830,sto:3065}, d15p:{rack:3445,sto:2760}},
          high:{d1_14:{rack:4400,sto:3520}, d15p:{rack:3960,sto:3170}}
        },
        stdExcess:70000, reducedExcessDaily:485, reducedExcess:7000, zeroExcessDaily:730, zeroExcess:0,
        note:"Camping equipped. Reduced excess N$7,000 (N$485/day). Zero excess N$730/day."
      },
      {
        id:"nts_safari_6", label:"Safari 4x4 6/7-Seater (4-Window) — max 4-5 pax excl. driver",
        pax:7, camping:false,
        rates:{
          low:{d1_14:{rack:4295,sto:3440}, d15p:{rack:3870,sto:3100}},
          high:{d1_14:{rack:4960,sto:3970}, d15p:{rack:4480,sto:3585}}
        },
        stdExcess:10000, reducedExcessDaily:null, reducedExcess:null, zeroExcessDaily:null, zeroExcess:null,
        note:"Std excess N$10,000. No reduced/zero excess option."
      },
      {
        id:"nts_safari_9", label:"Safari 4x4 9-Seater (6-Window) — max 6-7 pax excl. driver",
        pax:9, camping:false,
        rates:{
          low:{d1_14:{rack:4840,sto:3870}, d15p:{rack:4360,sto:3490}},
          high:{d1_14:{rack:5630,sto:4505}, d15p:{rack:5080,sto:4065}}
        },
        stdExcess:10000, reducedExcessDaily:null, reducedExcess:null, zeroExcessDaily:null, zeroExcess:null,
        note:"Std excess N$10,000. No reduced/zero excess option."
      },
      {
        id:"nts_safari_11", label:"Safari 4x4 11-Seater + trailer — max 8-9 pax excl. driver",
        pax:11, camping:false,
        rates:{
          low:{d1_14:{rack:5325,sto:4260}, d15p:{rack:4840,sto:3870}},
          high:{d1_14:{rack:6110,sto:4890}, d15p:{rack:5570,sto:4460}}
        },
        stdExcess:14000, reducedExcessDaily:null, reducedExcess:null, zeroExcessDaily:null, zeroExcess:null,
        note:"Std excess N$14,000. No reduced/zero excess option."
      }
    ]
  },
  NRCR: {
    name: "Namib's Roos Car Rental (NRCR)",
    contact: "reservations@namibsrooscarrentals.com | +264 81 728 2381",
    note: "Rates incl. VAT, unlimited km, Collision & Theft Cover, GPS (Tracks4Africa), 2x spare tyres, recovery box, 24/7 assistance. STD excess N$75,000.",
    vehicles: [
      {
        id:"nrcr_fortuner", label:"4x4 Toyota Fortuner Auto (2023-2025)",
        pax:5, camping:false,
        rates:{
          low:{d1_15:{rack:2595,sto:2076}, d16p:{rack:2480,sto:1984}},
          high:{d1_15:{rack:2865,sto:2292}, d16p:{rack:2750,sto:2200}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      },
      {
        id:"nrcr_hilux_nc", label:"4x4 Toyota Hilux 2.4 / Ford Ranger 2.2 Auto — Non-camping",
        pax:4, camping:false,
        rates:{
          low:{d1_15:{rack:1995,sto:1596}, d16p:{rack:1880,sto:1504}},
          high:{d1_15:{rack:2250,sto:1800}, d16p:{rack:2135,sto:1708}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      },
      {
        id:"nrcr_hilux_c2", label:"4x4 Toyota Hilux 2.4 / Ford Ranger 2.2 Auto — Camping 2 pax",
        pax:2, camping:true,
        rates:{
          low:{d1_15:{rack:2120,sto:1696}, d16p:{rack:2005,sto:1604}},
          high:{d1_15:{rack:2375,sto:1900}, d16p:{rack:2260,sto:1808}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"Camping equipped. Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      },
      {
        id:"nrcr_hilux_c4", label:"4x4 Toyota Hilux 2.4 / Ford Ranger 2.2 Auto — Camping 4 pax",
        pax:4, camping:true,
        rates:{
          low:{d1_15:{rack:2250,sto:1800}, d16p:{rack:2135,sto:1708}},
          high:{d1_15:{rack:2505,sto:2004}, d16p:{rack:2390,sto:1912}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"Camping equipped. Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      },
      {
        id:"nrcr_lc28_nc", label:"4x4 Landcruiser D/C 2.8 Auto (2024) — Non-camping",
        pax:4, camping:false,
        rates:{
          low:{d1_15:{rack:2415,sto:1932}, d16p:{rack:2300,sto:1840}},
          high:{d1_15:{rack:2535,sto:2028}, d16p:{rack:2420,sto:1936}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      },
      {
        id:"nrcr_lc28_c2", label:"4x4 Landcruiser D/C 2.8 Auto (2024) — Camping 2 pax",
        pax:2, camping:true,
        rates:{
          low:{d1_15:{rack:2575,sto:2060}, d16p:{rack:2460,sto:1968}},
          high:{d1_15:{rack:2700,sto:2160}, d16p:{rack:2585,sto:2068}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"Camping equipped. Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      },
      {
        id:"nrcr_lc28_c4", label:"4x4 Landcruiser D/C 2.8 Auto (2024) — Camping 4 pax",
        pax:4, camping:true,
        rates:{
          low:{d1_15:{rack:2730,sto:2184}, d16p:{rack:2615,sto:2092}},
          high:{d1_15:{rack:2865,sto:2292}, d16p:{rack:2730,sto:2184}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"Camping equipped. Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      },
      {
        id:"nrcr_lcv8_nc", label:"4x4 Landcruiser D/C V8 4.5l Manual (2019) — Non-camping",
        pax:4, camping:false,
        rates:{
          low:{d1_15:{rack:2120,sto:1696}, d16p:{rack:2005,sto:1604}},
          high:{d1_15:{rack:2505,sto:2004}, d16p:{rack:2390,sto:1912}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"Manual. Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      },
      {
        id:"nrcr_lcv8_c2", label:"4x4 Landcruiser D/C V8 4.5l Manual (2019) — Camping 2 pax",
        pax:2, camping:true,
        rates:{
          low:{d1_15:{rack:2250,sto:1800}, d16p:{rack:2135,sto:1708}},
          high:{d1_15:{rack:2635,sto:2108}, d16p:{rack:2520,sto:2016}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"Manual. Camping equipped. Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      },
      {
        id:"nrcr_lcv8_c4", label:"4x4 Landcruiser D/C V8 4.5l Manual (2019) — Camping 4 pax",
        pax:4, camping:true,
        rates:{
          low:{d1_15:{rack:2375,sto:1900}, d16p:{rack:2260,sto:1808}},
          high:{d1_15:{rack:2730,sto:2184}, d16p:{rack:2615,sto:2092}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"Manual. Camping equipped. Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      },
      {
        id:"nrcr_safari6", label:"4x4 Cruiser Safari 6-Window Seater Manual (2019) — C1 licence req.",
        pax:7, camping:false,
        rates:{
          low:{d1_15:{rack:4810,sto:3848}, d16p:{rack:4695,sto:3756}},
          high:{d1_15:{rack:5355,sto:4284}, d16p:{rack:5240,sto:4192}}
        },
        stdExcess:75000, tyreWindscreen:325, reducedExcessDaily:450, reducedExcess:10000, zeroExcessDaily:695, zeroExcess:0,
        note:"C1 licence required. Tyre & Windscreen: N$325/day. Reduced excess N$10,000 (N$450/day). Zero excess N$695/day."
      }
    ]
  },

  BRITZ: {
    name: "Britz 4x4 Rentals (Namibia)",
    contact: "www.britz.co.za | +27 11 230 5200",
    note: "Rates in NAD (Namibia collection). Includes Standard Cover, unlimited km, VAT. Super Cover (zero liability) included in Jimny rates. Min 3 days. ⚠ Rates valid Nov 2024–Oct 2026 — confirm 2026/27 rates directly.",
    vehicles: [
      {
        id:"britz_jimny_uneq", label:"Suzuki Jimny 4x4 Unequipped (2 pax)",
        pax:2, camping:false,
        rates:{
          low:{d0_5:{rack:1181,sto:1181}, d5p:{rack:945,sto:945}},
          high:{d0_5:{rack:1536,sto:1536}, d5p:{rack:1229,sto:1229}}
        },
        stdExcess:0, note:"Super Cover included (zero liability). Low=Nov–Jun, High=Jul–Oct."
      },
      {
        id:"britz_jimny_eq", label:"Suzuki Jimny 4x4 Equipped Camping (2 pax)",
        pax:2, camping:true,
        rates:{
          low:{d0_5:{rack:1838,sto:1838}, d5p:{rack:1470,sto:1470}},
          high:{d0_5:{rack:2231,sto:2231}, d5p:{rack:1785,sto:1785}}
        },
        stdExcess:0, note:"Super Cover included (zero liability). Rooftop tent & camping kit."
      },
      {
        id:"britz_se", label:"Hilux Single Cab Equipped 4x4 (2 pax)",
        pax:2, camping:true,
        rates:{
          low:{d0_5:{rack:2200,sto:2200}, d5p:{rack:1760,sto:1760}},
          high:{d0_5:{rack:3000,sto:3000}, d5p:{rack:2400,sto:2400}}
        },
        stdExcess:55000, note:"LLR1 N$275/day (excess N$27,500). Super Cover N$440/day (zero excess)."
      },
      {
        id:"britz_dce", label:"Hilux Double Cab Equipped 4x4 (4 pax)",
        pax:4, camping:true,
        rates:{
          low:{d0_5:{rack:2763,sto:2763}, d5p:{rack:2210,sto:2210}},
          high:{d0_5:{rack:3456,sto:3456}, d5p:{rack:2765,sto:2765}}
        },
        stdExcess:55000, note:"LLR1 N$275/day (excess N$27,500). Super Cover N$440/day (zero excess)."
      },
      {
        id:"britz_navi", label:"Hilux NAVI Equipped 4x4 (2 pax)",
        pax:2, camping:true,
        rates:{
          low:{d0_5:{rack:2500,sto:2500}, d5p:{rack:2000,sto:2000}},
          high:{d0_5:{rack:3400,sto:3400}, d5p:{rack:2720,sto:2720}}
        },
        stdExcess:55000, note:"LLR1 N$275/day (excess N$27,500). Super Cover N$440/day (zero excess)."
      },
      {
        id:"britz_bfta", label:"Toyota Fortuner Unequipped 4x4 (5 pax)",
        pax:5, camping:false,
        rates:{
          low:{d0_5:{rack:1939,sto:1939}, d5p:{rack:1939,sto:1939}},
          high:{d0_5:{rack:2600,sto:2600}, d5p:{rack:2080,sto:2080}}
        },
        stdExcess:33000, note:"Single flat rate 3+ days low season. LLR1 N$275/day. Super Cover N$440/day."
      },
      {
        id:"britz_btsc", label:"Hilux Single Cab Unequipped 4x4 (2 pax)",
        pax:2, camping:false,
        rates:{
          low:{d0_5:{rack:1650,sto:1650}, d5p:{rack:1320,sto:1320}},
          high:{d0_5:{rack:2050,sto:2050}, d5p:{rack:1640,sto:1640}}
        },
        stdExcess:55000, note:"LLR1 N$275/day. Super Cover N$440/day (zero excess)."
      },
      {
        id:"britz_btdc", label:"Hilux Double Cab Unequipped 4x4 (4 pax)",
        pax:4, camping:false,
        rates:{
          low:{d0_5:{rack:1950,sto:1950}, d5p:{rack:1560,sto:1560}},
          high:{d0_5:{rack:2500,sto:2500}, d5p:{rack:2000,sto:2000}}
        },
        stdExcess:55000, note:"LLR1 N$275/day. Super Cover N$440/day (zero excess)."
      }
    ]
  },
  MCR: {
    name: "Melbic Car Rentals (MCR)",
    contact: "7 Delius Street, Windhoek West, Windhoek | P.O. Box 87 207, Eros, Windhoek | Office +264 61 248 018 | Office Mobile +264 81 298 3574 | Tech Mobile +264 81 125 2522 | info@melbic.com | www.melbic.com",
    note: "Rates in NAD, incl VAT. Complimentary airport transfers. No deposit required. Min 3 days. ⚠ CDW is NOT a selectable option anywhere in this tool — it's informational only (see each vehicle's stdExcess/opt2Excess/opt3Excess/zeroExcess fields and note). Melbic publishes 4 CDW tiers per vehicle class: Opt 1 = standard (full excess, no daily charge); Opt 2 = 1x tyre cover; Opt 3 = 2x tyre+windscreen+undercarriage+sandblast, reduced excess; Opt 4 = ZERO EXCESS (full cover, highest daily charge — N$545/day Hilux/Fortuner classes, N$695/day Land Cruiser classes). To quote a specific CDW option, add its daily rate × rental days manually via the 'Override rack/day' and 'Override STO/day' fields on the car hire line, on top of the base vehicle rate. ⚠ Fleet update (12 Aug 2025): Melbic discontinued the VW Transporter Bus and introduced a 7-seater Toyota Land Cruiser (permanent sliding fridge, 2 spare wheels, PA system, 2.8L diesel auto, two fuel tanks, safari roof hatch, normal license) — already loaded as mcr_lc28_7. Confirmed 2027/28 rates (15 Mar 2027–14 Mar 2028) loaded as season keys s27_1–s27_4 alongside the pre-existing s1–s5 structure (which remains in force for dates before 15 Mar 2027 — no explicit end-date was ever published for that earlier sheet, so it's kept as the fallback for anything before the new one takes effect).",
    extrasReference: [
      {label:"Additional Driver (per rental)", rate:280},
      {label:"Young Driver Surcharge, driver 23–24 (per day)", rate:280},
      {label:"GPS (per day)", rate:120},
      {label:"Satellite Phone (per day)", rate:240},
      {label:"Blanket (per rental)", rate:70},
      {label:"Towels (per rental)", rate:80},
      {label:"Cool box (per rental)", rate:200},
      {label:"Baby/Booster seat (per day)", rate:100},
      {label:"Roof Top Tent 1.2m or 1.4m (per day)", rate:150},
      {label:"Ground tent 2 per 2.1x2.1m + Mattress (per day)", rate:150},
      {label:"Ground tent Mattress (per rental)", rate:200},
      {label:"Hardshell rooftop tent (per day)", rate:200},
      {label:"Sleeping bag (per rental)", rate:200},
      {label:"Pillow (per rental)", rate:50},
      {label:"Chair (per rental)", rate:50},
      {label:"Table (per rental)", rate:150},
      {label:"Braai grid (per rental)", rate:100},
      {label:"40L Fridge (per day)", rate:150},
      {label:"25L Water Container (per rental)", rate:100},
      {label:"Jerry Can (per rental)", rate:150},
      {label:"Gas Bottle with cooker top (per rental)", rate:200},
      {label:"Cross Border Papers (per rental)", rate:900},
    ], // ⚠ Reference only — not yet wired into any calculator or line-item picker. Source: Extras' Rates 15 Mar 2027–14 Mar 2028.
    dropoffFeesReference: [
      {dest:"Swakopmund", country:"Namibia", fee:4300}, {dest:"Walvis Bay", country:"Namibia", fee:4800},
      {dest:"Otjiwarongo", country:"Namibia", fee:4100}, {dest:"Grootfontein", country:"Namibia", fee:7200},
      {dest:"Etosha Okaukuejo", country:"Namibia", fee:7100}, {dest:"Etosha Halali", country:"Namibia", fee:7700},
      {dest:"Etosha Namutoni", country:"Namibia", fee:8200}, {dest:"Solitaire", country:"Namibia", fee:4400},
      {dest:"Sossusvlei", country:"Namibia", fee:8000}, {dest:"Sesriem", country:"Namibia", fee:6100},
      {dest:"Katima Mulilo", country:"Namibia", fee:12100}, {dest:"Rundu", country:"Namibia", fee:12100},
      {dest:"Luderitz", country:"Namibia", fee:12600}, {dest:"Upington", country:"South Africa", fee:12200},
      {dest:"Kasane", country:"Botswana", fee:13100}, {dest:"Kazangula", country:"Botswana", fee:13300},
      {dest:"Maun", country:"Botswana", fee:12000}, {dest:"Cape Town", country:"South Africa", fee:13900},
      {dest:"Livingstone / Victoria Falls", country:"Zambia / Zimbabwe", fee:16200},
    ], // ⚠ Reference only — one-way client charge, per the "Vehicle Drop-off and Pick-up Rates Dec 2025–Dec 2026" sheet. Not wired into the standalone one-way override fields; enter manually.
    vehicles: [
      {
        id:"mcr_hilux24_sc_0", label:"Hilux 2.4 Single Cab Auto — Unequipped (2 pax)",
        pax:2, camping:false,
        rates:{
          s1:{d3_7:{rack:1950,sto:1560}, d8_14:{rack:1750,sto:1400}, d15p:{rack:1700,sto:1360}},
          s2:{d3_7:{rack:1850,sto:1480}, d8_14:{rack:1650,sto:1320}, d15p:{rack:1600,sto:1280}},
          s3:{d3_7:{rack:2750,sto:2200}, d8_14:{rack:2500,sto:2000}, d15p:{rack:2400,sto:1920}},
          s4:{d3_7:{rack:2300,sto:1840}, d8_14:{rack:2100,sto:1680}, d15p:{rack:2000,sto:1600}},
          s5:{d3_7:{rack:1700,sto:1360}, d8_14:{rack:1550,sto:1240}, d15p:{rack:1500,sto:1200}},
          s27_1:{d3_7:{rack:2300,sto:1840}, d8_14:{rack:2050,sto:1640}, d15p:{rack:1900,sto:1520}},
          s27_2:{d3_7:{rack:3250,sto:2600}, d8_14:{rack:2850,sto:2280}, d15p:{rack:2750,sto:2200}},
          s27_3:{d3_7:{rack:2700,sto:2160}, d8_14:{rack:2450,sto:1960}, d15p:{rack:2350,sto:1880}},
          s27_4:{d3_7:{rack:1950,sto:1560}, d8_14:{rack:1800,sto:1440}, d15p:{rack:1750,sto:1400}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"CDW: Opt 1 N$55,000 excess/N$0/day; Opt 2 N$35,000 excess/N$315/day (1x tyre); Opt 3 N$15,000 excess/N$425/day (2x tyre+windscreen+undercarriage+sandblast); Opt 4 ZERO EXCESS/N$545/day (full cover)."
      },
      {
        id:"mcr_hilux24_sc_2", label:"Hilux 2.4 Single Cab Auto — Camping 2 pax",
        pax:2, camping:true,
        rates:{
          s1:{d3_7:{rack:2300,sto:1840}, d8_14:{rack:2100,sto:1680}, d15p:{rack:2000,sto:1600}},
          s2:{d3_7:{rack:2200,sto:1760}, d8_14:{rack:1950,sto:1560}, d15p:{rack:1900,sto:1520}},
          s3:{d3_7:{rack:3250,sto:2600}, d8_14:{rack:2900,sto:2320}, d15p:{rack:2850,sto:2280}},
          s4:{d3_7:{rack:2750,sto:2200}, d8_14:{rack:2450,sto:1960}, d15p:{rack:2400,sto:1920}},
          s5:{d3_7:{rack:2000,sto:1600}, d8_14:{rack:1800,sto:1440}, d15p:{rack:1750,sto:1400}},
          s27_1:{d3_7:{rack:2700,sto:2160}, d8_14:{rack:2400,sto:1920}, d15p:{rack:2300,sto:1840}},
          s27_2:{d3_7:{rack:3800,sto:3040}, d8_14:{rack:3350,sto:2680}, d15p:{rack:3300,sto:2640}},
          s27_3:{d3_7:{rack:3250,sto:2600}, d8_14:{rack:2850,sto:2280}, d15p:{rack:2800,sto:2240}},
          s27_4:{d3_7:{rack:2350,sto:1880}, d8_14:{rack:2100,sto:1680}, d15p:{rack:2050,sto:1640}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"Camping equipped. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_hilux24_dc_m_0", label:"Hilux 2.4 Double Cab Manual — Unequipped (4 pax)",
        pax:4, camping:false,
        rates:{
          s1:{d3_7:{rack:2050,sto:1640}, d8_14:{rack:1850,sto:1480}, d15p:{rack:1800,sto:1440}},
          s2:{d3_7:{rack:1950,sto:1560}, d8_14:{rack:1750,sto:1400}, d15p:{rack:1700,sto:1360}},
          s3:{d3_7:{rack:2900,sto:2320}, d8_14:{rack:2600,sto:2080}, d15p:{rack:2550,sto:2040}},
          s4:{d3_7:{rack:2450,sto:1960}, d8_14:{rack:2200,sto:1760}, d15p:{rack:2150,sto:1720}},
          s5:{d3_7:{rack:1800,sto:1440}, d8_14:{rack:1600,sto:1280}, d15p:{rack:1550,sto:1240}},
          s27_1:{d3_7:{rack:2400,sto:1920}, d8_14:{rack:2150,sto:1720}, d15p:{rack:2100,sto:1680}},
          s27_2:{d3_7:{rack:3400,sto:2720}, d8_14:{rack:2950,sto:2360}, d15p:{rack:2900,sto:2320}},
          s27_3:{d3_7:{rack:2850,sto:2280}, d8_14:{rack:2550,sto:2040}, d15p:{rack:2500,sto:2000}},
          s27_4:{d3_7:{rack:2100,sto:1680}, d8_14:{rack:1850,sto:1480}, d15p:{rack:1800,sto:1440}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"Manual. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_hilux24_dc_m_2", label:"Hilux 2.4 Double Cab Manual — Camping 2 pax",
        pax:2, camping:true,
        rates:{
          s1:{d3_7:{rack:2300,sto:1840}, d8_14:{rack:2050,sto:1640}, d15p:{rack:2000,sto:1600}},
          s2:{d3_7:{rack:2150,sto:1720}, d8_14:{rack:1950,sto:1560}, d15p:{rack:1850,sto:1480}},
          s3:{d3_7:{rack:3200,sto:2560}, d8_14:{rack:2850,sto:2280}, d15p:{rack:2800,sto:2240}},
          s4:{d3_7:{rack:2700,sto:2160}, d8_14:{rack:2400,sto:1920}, d15p:{rack:2350,sto:1880}},
          s5:{d3_7:{rack:2000,sto:1600}, d8_14:{rack:1800,sto:1440}, d15p:{rack:1750,sto:1400}},
          s27_1:{d3_7:{rack:2700,sto:2160}, d8_14:{rack:2350,sto:1880}, d15p:{rack:2300,sto:1840}},
          s27_2:{d3_7:{rack:3700,sto:2960}, d8_14:{rack:3300,sto:2640}, d15p:{rack:3200,sto:2560}},
          s27_3:{d3_7:{rack:3150,sto:2520}, d8_14:{rack:2800,sto:2240}, d15p:{rack:2750,sto:2200}},
          s27_4:{d3_7:{rack:2350,sto:1880}, d8_14:{rack:2100,sto:1680}, d15p:{rack:2050,sto:1640}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"Manual. Camping equipped. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_hilux24_dc_m_5", label:"Hilux 2.4 Double Cab Manual — Camping 5 pax",
        pax:5, camping:true,
        rates:{
          s1:{d3_7:{rack:2400,sto:1920}, d8_14:{rack:2150,sto:1720}, d15p:{rack:2050,sto:1640}},
          s2:{d3_7:{rack:2250,sto:1800}, d8_14:{rack:2000,sto:1600}, d15p:{rack:1950,sto:1560}},
          s3:{d3_7:{rack:3350,sto:2680}, d8_14:{rack:3000,sto:2400}, d15p:{rack:2900,sto:2320}},
          s4:{d3_7:{rack:2800,sto:2240}, d8_14:{rack:2550,sto:2040}, d15p:{rack:2450,sto:1960}},
          s5:{d3_7:{rack:2050,sto:1640}, d8_14:{rack:1850,sto:1480}, d15p:{rack:1800,sto:1440}},
          s27_1:{d3_7:{rack:2800,sto:2240}, d8_14:{rack:2450,sto:1960}, d15p:{rack:2350,sto:1880}},
          s27_2:{d3_7:{rack:3900,sto:3120}, d8_14:{rack:3450,sto:2760}, d15p:{rack:3350,sto:2680}},
          s27_3:{d3_7:{rack:3300,sto:2640}, d8_14:{rack:2950,sto:2360}, d15p:{rack:2850,sto:2280}},
          s27_4:{d3_7:{rack:2400,sto:1920}, d8_14:{rack:2150,sto:1720}, d15p:{rack:2100,sto:1680}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"Manual. Camping equipped 5 pax. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_hilux24_dc_a_0", label:"Hilux 2.4 Double Cab Auto — Unequipped (4 pax)",
        pax:4, camping:false,
        rates:{
          s1:{d3_7:{rack:2150,sto:1720}, d8_14:{rack:1950,sto:1560}, d15p:{rack:1900,sto:1520}},
          s2:{d3_7:{rack:2050,sto:1640}, d8_14:{rack:1850,sto:1480}, d15p:{rack:1750,sto:1400}},
          s3:{d3_7:{rack:3000,sto:2400}, d8_14:{rack:2700,sto:2160}, d15p:{rack:2650,sto:2120}},
          s4:{d3_7:{rack:2550,sto:2040}, d8_14:{rack:2300,sto:1840}, d15p:{rack:2200,sto:1760}},
          s5:{d3_7:{rack:1900,sto:1520}, d8_14:{rack:1700,sto:1360}, d15p:{rack:1650,sto:1320}},
          s27_1:{d3_7:{rack:2500,sto:2000}, d8_14:{rack:2250,sto:1800}, d15p:{rack:2200,sto:1760}},
          s27_2:{d3_7:{rack:3500,sto:2800}, d8_14:{rack:3050,sto:2440}, d15p:{rack:3000,sto:2400}},
          s27_3:{d3_7:{rack:2950,sto:2360}, d8_14:{rack:2700,sto:2160}, d15p:{rack:2550,sto:2040}},
          s27_4:{d3_7:{rack:2250,sto:1800}, d8_14:{rack:1950,sto:1560}, d15p:{rack:1900,sto:1520}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"Auto. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_hilux24_dc_a_2", label:"Hilux 2.4 Double Cab Auto — Camping 2 pax",
        pax:2, camping:true,
        rates:{
          s1:{d3_7:{rack:2400,sto:1920}, d8_14:{rack:2150,sto:1720}, d15p:{rack:2050,sto:1640}},
          s2:{d3_7:{rack:2250,sto:1800}, d8_14:{rack:2000,sto:1600}, d15p:{rack:1950,sto:1560}},
          s3:{d3_7:{rack:3350,sto:2680}, d8_14:{rack:3000,sto:2400}, d15p:{rack:2900,sto:2320}},
          s4:{d3_7:{rack:2800,sto:2240}, d8_14:{rack:2500,sto:2000}, d15p:{rack:2450,sto:1960}},
          s5:{d3_7:{rack:2050,sto:1640}, d8_14:{rack:1850,sto:1480}, d15p:{rack:1800,sto:1440}},
          s27_1:{d3_7:{rack:2800,sto:2240}, d8_14:{rack:2450,sto:1960}, d15p:{rack:2350,sto:1880}},
          s27_2:{d3_7:{rack:3900,sto:3120}, d8_14:{rack:3450,sto:2760}, d15p:{rack:3350,sto:2680}},
          s27_3:{d3_7:{rack:3300,sto:2640}, d8_14:{rack:2900,sto:2320}, d15p:{rack:2850,sto:2280}},
          s27_4:{d3_7:{rack:2400,sto:1920}, d8_14:{rack:2150,sto:1720}, d15p:{rack:2100,sto:1680}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"Auto. Camping equipped 2 pax. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_hilux24_dc_a_5", label:"Hilux 2.4 Double Cab Auto — Camping 5 pax",
        pax:5, camping:true,
        rates:{
          s1:{d3_7:{rack:2500,sto:2000}, d8_14:{rack:2250,sto:1800}, d15p:{rack:2150,sto:1720}},
          s2:{d3_7:{rack:2350,sto:1880}, d8_14:{rack:2100,sto:1680}, d15p:{rack:2050,sto:1640}},
          s3:{d3_7:{rack:3500,sto:2800}, d8_14:{rack:3150,sto:2520}, d15p:{rack:3050,sto:2440}},
          s4:{d3_7:{rack:2950,sto:2360}, d8_14:{rack:2650,sto:2120}, d15p:{rack:2550,sto:2040}},
          s5:{d3_7:{rack:2150,sto:1720}, d8_14:{rack:1950,sto:1560}, d15p:{rack:1900,sto:1520}},
          s27_1:{d3_7:{rack:2900,sto:2320}, d8_14:{rack:2600,sto:2080}, d15p:{rack:2450,sto:1960}},
          s27_2:{d3_7:{rack:4100,sto:3280}, d8_14:{rack:3600,sto:2880}, d15p:{rack:3500,sto:2800}},
          s27_3:{d3_7:{rack:3450,sto:2760}, d8_14:{rack:3050,sto:2440}, d15p:{rack:2950,sto:2360}},
          s27_4:{d3_7:{rack:2500,sto:2000}, d8_14:{rack:2300,sto:1840}, d15p:{rack:2250,sto:1800}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"Auto. Camping equipped 5 pax. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_hilux28_dc_a_0", label:"Hilux 2.8 Double Cab Auto — Unequipped (4 pax)",
        pax:4, camping:false,
        rates:{
          s1:{d3_7:{rack:2500,sto:2000}, d8_14:{rack:2250,sto:1800}, d15p:{rack:2150,sto:1720}},
          s2:{d3_7:{rack:2350,sto:1880}, d8_14:{rack:2100,sto:1680}, d15p:{rack:2050,sto:1640}},
          s3:{d3_7:{rack:3500,sto:2800}, d8_14:{rack:3150,sto:2520}, d15p:{rack:3050,sto:2440}},
          s4:{d3_7:{rack:2950,sto:2360}, d8_14:{rack:2650,sto:2120}, d15p:{rack:2550,sto:2040}},
          s5:{d3_7:{rack:2150,sto:1720}, d8_14:{rack:1950,sto:1560}, d15p:{rack:1900,sto:1520}},
          s27_1:{d3_7:{rack:2900,sto:2320}, d8_14:{rack:2600,sto:2080}, d15p:{rack:2450,sto:1960}},
          s27_2:{d3_7:{rack:4100,sto:3280}, d8_14:{rack:3600,sto:2880}, d15p:{rack:3500,sto:2800}},
          s27_3:{d3_7:{rack:3450,sto:2760}, d8_14:{rack:3050,sto:2440}, d15p:{rack:2950,sto:2360}},
          s27_4:{d3_7:{rack:2500,sto:2000}, d8_14:{rack:2300,sto:1840}, d15p:{rack:2250,sto:1800}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"2.8L. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_hilux28_dc_a_2", label:"Hilux 2.8 Double Cab Auto — Camping 2 pax",
        pax:2, camping:true,
        rates:{
          s1:{d3_7:{rack:2750,sto:2200}, d8_14:{rack:2450,sto:1960}, d15p:{rack:2400,sto:1920}},
          s2:{d3_7:{rack:2550,sto:2040}, d8_14:{rack:2300,sto:1840}, d15p:{rack:2250,sto:1800}},
          s3:{d3_7:{rack:3850,sto:3080}, d8_14:{rack:3450,sto:2760}, d15p:{rack:3350,sto:2680}},
          s4:{d3_7:{rack:3200,sto:2560}, d8_14:{rack:2900,sto:2320}, d15p:{rack:2800,sto:2240}},
          s5:{d3_7:{rack:2400,sto:1920}, d8_14:{rack:2150,sto:1720}, d15p:{rack:2050,sto:1640}},
          s27_1:{d3_7:{rack:3250,sto:2600}, d8_14:{rack:2800,sto:2240}, d15p:{rack:2750,sto:2200}},
          s27_2:{d3_7:{rack:4500,sto:3600}, d8_14:{rack:3950,sto:3160}, d15p:{rack:3850,sto:3080}},
          s27_3:{d3_7:{rack:3700,sto:2960}, d8_14:{rack:3400,sto:2720}, d15p:{rack:3300,sto:2640}},
          s27_4:{d3_7:{rack:2800,sto:2240}, d8_14:{rack:2500,sto:2000}, d15p:{rack:2400,sto:1920}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"2.8L. Camping equipped. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_hilux28_dc_a_5", label:"Hilux 2.8 Double Cab Auto — Camping 5 pax",
        pax:5, camping:true,
        rates:{
          s1:{d3_7:{rack:2850,sto:2280}, d8_14:{rack:2550,sto:2040}, d15p:{rack:2500,sto:2000}},
          s2:{d3_7:{rack:2700,sto:2160}, d8_14:{rack:2400,sto:1920}, d15p:{rack:2350,sto:1880}},
          s3:{d3_7:{rack:4000,sto:3200}, d8_14:{rack:3600,sto:2880}, d15p:{rack:3500,sto:2800}},
          s4:{d3_7:{rack:3350,sto:2680}, d8_14:{rack:3050,sto:2440}, d15p:{rack:2950,sto:2360}},
          s5:{d3_7:{rack:2500,sto:2000}, d8_14:{rack:2250,sto:1800}, d15p:{rack:2150,sto:1720}},
          s27_1:{d3_7:{rack:3350,sto:2680}, d8_14:{rack:2900,sto:2320}, d15p:{rack:2850,sto:2280}},
          s27_2:{d3_7:{rack:4650,sto:3720}, d8_14:{rack:4100,sto:3280}, d15p:{rack:4000,sto:3200}},
          s27_3:{d3_7:{rack:3900,sto:3120}, d8_14:{rack:3550,sto:2840}, d15p:{rack:3450,sto:2760}},
          s27_4:{d3_7:{rack:2900,sto:2320}, d8_14:{rack:2650,sto:2120}, d15p:{rack:2500,sto:2000}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"2.8L. Camping equipped 5 pax. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_fortuner_7", label:"Toyota Fortuner 2.4 Auto — 7 pax",
        pax:7, camping:false,
        rates:{
          s1:{d3_7:{rack:2050,sto:1640}, d8_14:{rack:1850,sto:1480}, d15p:{rack:1800,sto:1440}},
          s2:{d3_7:{rack:1950,sto:1560}, d8_14:{rack:1750,sto:1400}, d15p:{rack:1700,sto:1360}},
          s3:{d3_7:{rack:2900,sto:2320}, d8_14:{rack:2600,sto:2080}, d15p:{rack:2550,sto:2040}},
          s4:{d3_7:{rack:2450,sto:1960}, d8_14:{rack:2200,sto:1760}, d15p:{rack:2150,sto:1720}},
          s5:{d3_7:{rack:1800,sto:1440}, d8_14:{rack:1600,sto:1280}, d15p:{rack:1550,sto:1240}},
          s27_1:{d3_7:{rack:2350,sto:1880}, d8_14:{rack:2100,sto:1680}, d15p:{rack:2000,sto:1600}},
          s27_2:{d3_7:{rack:3300,sto:2640}, d8_14:{rack:2900,sto:2320}, d15p:{rack:2800,sto:2240}},
          s27_3:{d3_7:{rack:2750,sto:2200}, d8_14:{rack:2500,sto:2000}, d15p:{rack:2400,sto:1920}},
          s27_4:{d3_7:{rack:2000,sto:1600}, d8_14:{rack:1850,sto:1480}, d15p:{rack:1750,sto:1400}}
        },
        stdExcess:55000, opt2ExcessDaily:315, opt2Excess:35000, opt3ExcessDaily:425, opt3Excess:15000, zeroExcessDaily:545, zeroExcess:0,
        note:"7-seater. CDW: Opt 1 N$55,000/N$0/day; Opt 2 N$35,000/N$315/day; Opt 3 N$15,000/N$425/day; Opt 4 ZERO EXCESS/N$545/day."
      },
      {
        id:"mcr_lc28_0", label:"Land Cruiser 2.8 Auto — Unequipped (4 pax)",
        pax:4, camping:false,
        rates:{
          s1:{d3_7:{rack:2800,sto:2240}, d8_14:{rack:2500,sto:2000}, d15p:{rack:2400,sto:1920}},
          s2:{d3_7:{rack:2600,sto:2080}, d8_14:{rack:2350,sto:1880}, d15p:{rack:2300,sto:1840}},
          s3:{d3_7:{rack:3900,sto:3120}, d8_14:{rack:3500,sto:2800}, d15p:{rack:3400,sto:2720}},
          s4:{d3_7:{rack:3300,sto:2640}, d8_14:{rack:2950,sto:2360}, d15p:{rack:2850,sto:2280}},
          s5:{d3_7:{rack:2400,sto:1920}, d8_14:{rack:2200,sto:1760}, d15p:{rack:2100,sto:1680}},
          s27_1:{d3_7:{rack:3200,sto:2560}, d8_14:{rack:2800,sto:2240}, d15p:{rack:2700,sto:2160}},
          s27_2:{d3_7:{rack:4450,sto:3560}, d8_14:{rack:3900,sto:3120}, d15p:{rack:3800,sto:3040}},
          s27_3:{d3_7:{rack:3750,sto:3000}, d8_14:{rack:3400,sto:2720}, d15p:{rack:3250,sto:2600}},
          s27_4:{d3_7:{rack:2750,sto:2200}, d8_14:{rack:2500,sto:2000}, d15p:{rack:2400,sto:1920}}
        },
        stdExcess:75000, opt2ExcessDaily:465, opt2Excess:45000, opt3ExcessDaily:575, opt3Excess:20000, zeroExcessDaily:695, zeroExcess:0,
        note:"CDW (Land Cruiser table): Opt 1 N$75,000 excess/N$0/day; Opt 2 N$45,000 excess/N$465/day (1x tyre); Opt 3 N$20,000 excess/N$575/day (2x tyre+windscreen+undercarriage+sandblast); Opt 4 ZERO EXCESS/N$695/day (full cover)."
      },
      {
        id:"mcr_lc28_2", label:"Land Cruiser 2.8 Auto — Camping 2 pax",
        pax:2, camping:true,
        rates:{
          s1:{d3_7:{rack:3050,sto:2440}, d8_14:{rack:2750,sto:2200}, d15p:{rack:2650,sto:2120}},
          s2:{d3_7:{rack:2900,sto:2320}, d8_14:{rack:2600,sto:2080}, d15p:{rack:2500,sto:2000}},
          s3:{d3_7:{rack:4300,sto:3440}, d8_14:{rack:3850,sto:3080}, d15p:{rack:3750,sto:3000}},
          s4:{d3_7:{rack:3600,sto:2880}, d8_14:{rack:3250,sto:2600}, d15p:{rack:3150,sto:2520}},
          s5:{d3_7:{rack:2650,sto:2120}, d8_14:{rack:2400,sto:1920}, d15p:{rack:2300,sto:1840}},
          s27_1:{d3_7:{rack:3500,sto:2800}, d8_14:{rack:3050,sto:2440}, d15p:{rack:2950,sto:2360}},
          s27_2:{d3_7:{rack:4900,sto:3920}, d8_14:{rack:4300,sto:3440}, d15p:{rack:4150,sto:3320}},
          s27_3:{d3_7:{rack:4150,sto:3320}, d8_14:{rack:3700,sto:2960}, d15p:{rack:3600,sto:2880}},
          s27_4:{d3_7:{rack:3000,sto:2400}, d8_14:{rack:2750,sto:2200}, d15p:{rack:2650,sto:2120}}
        },
        stdExcess:75000, opt2ExcessDaily:465, opt2Excess:45000, opt3ExcessDaily:575, opt3Excess:20000, zeroExcessDaily:695, zeroExcess:0,
        note:"Camping equipped. CDW (Land Cruiser table): Opt 1 N$75,000/N$0/day; Opt 2 N$45,000/N$465/day; Opt 3 N$20,000/N$575/day; Opt 4 ZERO EXCESS/N$695/day."
      },
      {
        id:"mcr_lc28_5", label:"Land Cruiser 2.8 Auto — Camping 5 pax",
        pax:5, camping:true,
        rates:{
          s1:{d3_7:{rack:3200,sto:2560}, d8_14:{rack:2900,sto:2320}, d15p:{rack:2800,sto:2240}},
          s2:{d3_7:{rack:3000,sto:2400}, d8_14:{rack:2700,sto:2160}, d15p:{rack:2600,sto:2080}},
          s3:{d3_7:{rack:4500,sto:3600}, d8_14:{rack:4050,sto:3240}, d15p:{rack:3900,sto:3120}},
          s4:{d3_7:{rack:3800,sto:3040}, d8_14:{rack:3400,sto:2720}, d15p:{rack:3300,sto:2640}},
          s5:{d3_7:{rack:2800,sto:2240}, d8_14:{rack:2500,sto:2000}, d15p:{rack:2400,sto:1920}},
          s27_1:{d3_7:{rack:3650,sto:2920}, d8_14:{rack:3200,sto:2560}, d15p:{rack:3100,sto:2480}},
          s27_2:{d3_7:{rack:5100,sto:4080}, d8_14:{rack:4500,sto:3600}, d15p:{rack:4350,sto:3480}},
          s27_3:{d3_7:{rack:4300,sto:3440}, d8_14:{rack:3850,sto:3080}, d15p:{rack:3750,sto:3000}},
          s27_4:{d3_7:{rack:3200,sto:2560}, d8_14:{rack:2850,sto:2280}, d15p:{rack:2750,sto:2200}}
        },
        stdExcess:75000, opt2ExcessDaily:465, opt2Excess:45000, opt3ExcessDaily:575, opt3Excess:20000, zeroExcessDaily:695, zeroExcess:0,
        note:"Camping equipped 5 pax. CDW (Land Cruiser table): Opt 1 N$75,000/N$0/day; Opt 2 N$45,000/N$465/day; Opt 3 N$20,000/N$575/day; Opt 4 ZERO EXCESS/N$695/day."
      },
      {
        id:"mcr_lc28_7", label:"Land Cruiser 2.8 Auto — 7-Seater",
        pax:7, camping:false,
        rates:{
          s1:{d3_7:{rack:4200,sto:3360}, d8_14:{rack:3750,sto:3000}, d15p:{rack:3650,sto:2920}},
          s2:{d3_7:{rack:3950,sto:3160}, d8_14:{rack:3550,sto:2840}, d15p:{rack:3400,sto:2720}},
          s3:{d3_7:{rack:5850,sto:4680}, d8_14:{rack:5250,sto:4200}, d15p:{rack:5100,sto:4080}},
          s4:{d3_7:{rack:4950,sto:3960}, d8_14:{rack:4450,sto:3560}, d15p:{rack:4300,sto:3440}},
          s5:{d3_7:{rack:3650,sto:2920}, d8_14:{rack:3250,sto:2600}, d15p:{rack:3150,sto:2520}},
          s27_1:{d3_7:{rack:4750,sto:3800}, d8_14:{rack:4200,sto:3360}, d15p:{rack:4050,sto:3240}},
          s27_2:{d3_7:{rack:6700,sto:5360}, d8_14:{rack:5950,sto:4760}, d15p:{rack:5700,sto:4560}},
          s27_3:{d3_7:{rack:5600,sto:4480}, d8_14:{rack:5100,sto:4080}, d15p:{rack:4950,sto:3960}},
          s27_4:{d3_7:{rack:4150,sto:3320}, d8_14:{rack:3750,sto:3000}, d15p:{rack:3600,sto:2880}}
        },
        stdExcess:75000, opt2ExcessDaily:465, opt2Excess:45000, opt3ExcessDaily:575, opt3Excess:20000, zeroExcessDaily:695, zeroExcess:0,
        note:"7-seater LC. CDW (Land Cruiser table): Opt 1 N$75,000/N$0/day; Opt 2 N$45,000/N$465/day; Opt 3 N$20,000/N$575/day; Opt 4 ZERO EXCESS/N$695/day."
      }
    ]
  },
  N2GO: {
    name: "Namibia2Go (Gondwana)",
    contact: "enquiries@namibia2go.com | +264 61 427 220",
    note: "Rates NETT — Premium Cover (zero excess) included in daily rate. Unlimited km, additional drivers, cross-border docs & airport transfers included. ⚠ One-way drop-off fees are non-commissionable and extra. 2026 rates valid Nov 2025–Oct 2026. 2027 rates valid Nov 2026–Oct 2027.",
    vehicles: [
      // ── 2026 SEASON (01 Nov 2025 – 31 Oct 2026) ──────────────────────────
      {
        id:"n2go_jimny3", label:"[2026] Suzuki Jimny 4x4 AT 3-Door (2 pax)",
        pax:2, camping:false, season:"2026",
        rates:{
          low:{d1_14:{rack:1268,sto:1014}, d15p:{rack:1141,sto:913}},
          high:{d1_14:{rack:1690,sto:1352}, d15p:{rack:1690,sto:1352}}
        },
        note:"2026 rates. Premium Cover incl. Zero excess."
      },
      {
        id:"n2go_jimny5", label:"[2026] Suzuki Jimny 4x4 AT 5-Door (2 pax)",
        pax:2, camping:false, season:"2026",
        rates:{
          low:{d1_14:{rack:1395,sto:1116}, d15p:{rack:1255,sto:1004}},
          high:{d1_14:{rack:1860,sto:1488}, d15p:{rack:1860,sto:1488}}
        },
        note:"2026 rates. Premium Cover incl. Zero excess."
      },
      {
        id:"n2go_corolla", label:"[2026] Toyota Corolla Cross Hybrid 2x4 AT (5 pax)",
        pax:5, camping:false, season:"2026",
        rates:{
          low:{d1_14:{rack:1395,sto:1116}, d15p:{rack:1255,sto:1004}},
          high:{d1_14:{rack:1860,sto:1488}, d15p:{rack:1860,sto:1488}}
        },
        note:"2026 rates. 2x4 only. Premium Cover incl."
      },
      {
        id:"n2go_fortuner", label:"[2026] Toyota Fortuner SUV 4x4 AT (5 pax)",
        pax:5, camping:false, season:"2026",
        rates:{
          low:{d1_14:{rack:2400,sto:1920}, d15p:{rack:2160,sto:1728}},
          high:{d1_14:{rack:3200,sto:2560}, d15p:{rack:3200,sto:2560}}
        },
        note:"2026 rates. Premium Cover incl."
      },
      {
        id:"n2go_dc_std", label:"[2026] Standard Double Cab 4x4 AT (5 pax)",
        pax:5, camping:false, season:"2026",
        rates:{
          low:{d1_14:{rack:2400,sto:1920}, d15p:{rack:2160,sto:1728}},
          high:{d1_14:{rack:3200,sto:2560}, d15p:{rack:3200,sto:2560}}
        },
        note:"2026 rates. Premium Cover incl."
      },
      {
        id:"n2go_dc_budget", label:"[2026] Budget Camping Double Cab 4x4 AT (5 pax)",
        pax:5, camping:true, season:"2026",
        rates:{
          low:{d1_14:{rack:2640,sto:2112}, d15p:{rack:2376,sto:1901}},
          high:{d1_14:{rack:3520,sto:2816}, d15p:{rack:3520,sto:2816}}
        },
        note:"2026 rates. Budget camping equipment included. Premium Cover incl."
      },
      {
        id:"n2go_dc_comfort", label:"[2026] Comfort Camping Double Cab 4x4 AT (5 pax)",
        pax:5, camping:true, season:"2026",
        rates:{
          low:{d1_14:{rack:2910,sto:2328}, d15p:{rack:2619,sto:2095}},
          high:{d1_14:{rack:3880,sto:3104}, d15p:{rack:3880,sto:3104}}
        },
        note:"2026 rates. Comfort camping equipment included. Premium Cover incl."
      },
      {
        id:"n2go_vw_transporter", label:"[2026] AWD VW Transporter AT (8 pax)",
        pax:8, camping:false, season:"2026",
        rates:{
          low:{d1_14:{rack:3216,sto:2573}, d15p:{rack:2894,sto:2315}},
          high:{d1_14:{rack:4020,sto:3216}, d15p:{rack:4020,sto:3216}}
        },
        note:"2026 rates. AWD. Premium Cover incl."
      },
      {
        id:"n2go_luxury_suv", label:"[2026] 4x4 Luxury SUV AT (5 pax)",
        pax:5, camping:false, season:"2026",
        rates:{
          low:{d1_14:{rack:4000,sto:3200}, d15p:{rack:3600,sto:2880}},
          high:{d1_14:{rack:4450,sto:3560}, d15p:{rack:4450,sto:3560}}
        },
        note:"2026 rates. Luxury SUV. Premium Cover incl."
      },
      {
        id:"n2go_expedition", label:"[2026] Expedition Camping Extra Cab 4x4 AT (2 pax)",
        pax:2, camping:true, season:"2026",
        rates:{
          low:{d1_14:{rack:4000,sto:3200}, d15p:{rack:3600,sto:2880}},
          high:{d1_14:{rack:4450,sto:3560}, d15p:{rack:4450,sto:3560}}
        },
        note:"2026 rates. Expedition spec. Premium Cover incl."
      },
      {
        id:"n2go_quantum7", label:"[2026] Safari Quantum 7-Seater MT (7 pax) — C1 licence",
        pax:7, camping:false, season:"2026",
        rates:{
          low:{d1_14:{rack:4000,sto:3200}, d15p:{rack:3600,sto:2880}},
          high:{d1_14:{rack:4450,sto:3560}, d15p:{rack:4450,sto:3560}}
        },
        note:"2026 rates. ⚠ C1 licence required. Premium Cover incl."
      },
      {
        id:"n2go_quantum10", label:"[2026] Safari Quantum 10-Seater AT (10 pax) — C1 licence",
        pax:10, camping:false, season:"2026",
        rates:{
          low:{d1_14:{rack:4400,sto:3520}, d15p:{rack:3960,sto:3168}},
          high:{d1_14:{rack:4850,sto:3880}, d15p:{rack:4850,sto:3880}}
        },
        note:"2026 rates. ⚠ C1 licence required. Premium Cover incl."
      },
      // ── 2027 SEASON (01 Nov 2026 – 31 Oct 2027) ──────────────────────────
      // Note: 2027 fleet uses full Toyota branding; 15+ days discount applies to BOTH seasons.
      // High season 2027: 1-14 days and 15+ days are both listed separately.
      {
        id:"n2go_27_jimny3", label:"[2027] Suzuki Jimny 4x4 AT 3-Door (2 pax)",
        pax:2, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:1400,sto:1120}, d15p:{rack:1260,sto:1008}},
          high:{d1_14:{rack:1750,sto:1400}, d15p:{rack:1575,sto:1260}}
        },
        note:"2027 rates. Premium insurance incl. Zero excess."
      },
      {
        id:"n2go_27_jimny5", label:"[2027] Suzuki Jimny 4x4 AT 5-Door (2 pax)",
        pax:2, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:1560,sto:1248}, d15p:{rack:1404,sto:1123}},
          high:{d1_14:{rack:1950,sto:1560}, d15p:{rack:1755,sto:1404}}
        },
        note:"2027 rates. Premium insurance incl. Zero excess."
      },
      {
        id:"n2go_27_corolla", label:"[2027] Toyota Corolla Cross 2x4 AT (5 pax)",
        pax:5, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:1560,sto:1248}, d15p:{rack:1404,sto:1123}},
          high:{d1_14:{rack:1950,sto:1560}, d15p:{rack:1755,sto:1404}}
        },
        note:"2027 rates. 2x4 only. Premium insurance incl."
      },
      {
        id:"n2go_27_fortuner", label:"[2027] Toyota Fortuner SUV 4x4 AT (5 pax)",
        pax:5, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:2550,sto:2040}, d15p:{rack:2295,sto:1836}},
          high:{d1_14:{rack:3400,sto:2720}, d15p:{rack:3060,sto:2448}}
        },
        note:"2027 rates. Premium insurance incl."
      },
      {
        id:"n2go_27_hilux_std", label:"[2027] Toyota Hilux Standard Double Cab 4x4 AT (5 pax)",
        pax:5, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:2550,sto:2040}, d15p:{rack:2295,sto:1836}},
          high:{d1_14:{rack:3400,sto:2720}, d15p:{rack:3060,sto:2448}}
        },
        note:"2027 rates. Premium insurance incl."
      },
      {
        id:"n2go_27_hilux_budget", label:"[2027] Toyota Hilux Budget Camping Double Cab 4x4 AT (5 pax)",
        pax:5, camping:true, season:"2027",
        rates:{
          low:{d1_14:{rack:2700,sto:2160}, d15p:{rack:2430,sto:1944}},
          high:{d1_14:{rack:3600,sto:2880}, d15p:{rack:3240,sto:2592}}
        },
        note:"2027 rates. Budget camping equipment included. Premium insurance incl."
      },
      {
        id:"n2go_27_lc76", label:"[2027] Toyota Land Cruiser 76 SUV 4x4 AT (5 pax)",
        pax:5, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:3000,sto:2400}, d15p:{rack:2700,sto:2160}},
          high:{d1_14:{rack:4000,sto:3200}, d15p:{rack:3600,sto:2880}}
        },
        note:"2027 rates. Premium insurance incl."
      },
      {
        id:"n2go_27_hilux_comfort", label:"[2027] Toyota Hilux Comfort Camping Double Cab 4x4 AT (5 pax)",
        pax:5, camping:true, season:"2027",
        rates:{
          low:{d1_14:{rack:3000,sto:2400}, d15p:{rack:2700,sto:2160}},
          high:{d1_14:{rack:4000,sto:3200}, d15p:{rack:3600,sto:2880}}
        },
        note:"2027 rates. Comfort camping equipment included. Premium insurance incl."
      },
      {
        id:"n2go_27_prado", label:"[2027] Toyota Land Cruiser Prado Luxury SUV 4x4 AT (5 pax)",
        pax:5, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:3825,sto:3060}, d15p:{rack:3442,sto:2754}},
          high:{d1_14:{rack:4500,sto:3600}, d15p:{rack:4050,sto:3240}}
        },
        note:"2027 rates. Premium insurance incl."
      },
      {
        id:"n2go_27_hilux_expedition", label:"[2027] Toyota Hilux Expedition Camping Extra Cab 4x4 AT (2 pax)",
        pax:2, camping:true, season:"2027",
        rates:{
          low:{d1_14:{rack:3825,sto:3060}, d15p:{rack:3442,sto:2754}},
          high:{d1_14:{rack:4500,sto:3600}, d15p:{rack:4050,sto:3240}}
        },
        note:"2027 rates. Expedition spec. Premium insurance incl."
      },
      {
        id:"n2go_27_quantum7", label:"[2027] Toyota Safari Quantum 7-Seater MT (7 pax) — C1 licence",
        pax:7, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:4050,sto:3240}, d15p:{rack:3645,sto:2916}},
          high:{d1_14:{rack:4500,sto:3600}, d15p:{rack:4050,sto:3240}}
        },
        note:"2027 rates. ⚠ C1 licence required. Premium insurance incl."
      },
      {
        id:"n2go_27_quantum10", label:"[2027] Toyota Safari Quantum 10-Seater AT (10 pax) — C1 licence",
        pax:10, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:4500,sto:3600}, d15p:{rack:4050,sto:3240}},
          high:{d1_14:{rack:5000,sto:4000}, d15p:{rack:4500,sto:3600}}
        },
        note:"2027 rates. ⚠ C1 licence required. Premium insurance incl."
      },
      {
        id:"n2go_27_truck14", label:"[2027] 4x4 Passenger Truck 14-Seater MT (16 seats incl driver) — C1 + driver incl",
        pax:14, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:7200,sto:5760}, d15p:{rack:6480,sto:5184}},
          high:{d1_14:{rack:8000,sto:6400}, d15p:{rack:7200,sto:5760}}
        },
        note:"2027 rates. ⚠ C1 licence required. Driver included in rate. Premium insurance incl."
      },
      {
        id:"n2go_27_truck18", label:"[2027] 4x4 Passenger Truck 18-Seater MT (20 seats incl driver) — C1 + driver incl",
        pax:18, camping:false, season:"2027",
        rates:{
          low:{d1_14:{rack:9360,sto:7488}, d15p:{rack:8424,sto:6739}},
          high:{d1_14:{rack:10400,sto:8320}, d15p:{rack:9360,sto:7488}}
        },
        note:"2027 rates. ⚠ C1 licence required. Driver included in rate. Premium insurance incl."
      }
    ]
  },

  BUSHLORE: {
    name: "Bushlore Africa",
    contact: "31 Gallagher Ave, Midway Park, Midrand, Johannesburg, South Africa | +27 (11) 312 8084 | info@bushlore.com | www.bushlore.com",
    note: "Namibia collection, 2027 rates, in NAD incl VAT. STO = flat 20% off rack (confirmed via companion 'Rack less 20%' sheet — literal STO figures below, not just a formula). Available from 8 days, mileage dependent. Insurance excess is NAD 30,000 standard on every vehicle (see insuranceReference for the two paid CDW options that reduce it). SA collections: use SA rates (not loaded here — Namibia sheet only). Cross Border fee: Southern Africa NAD 800; Northern Mozambique/Angola/Malawi/North NAD 3,000. Cleaning Fee: NAD 450 (unequipped) / NAD 920 (camping-equipped). Contract Fee: NAD 130. Carbon Tax: NAD 600 (all vehicles). One local free airport/hotel transfer included on day of collection/return. Long-term discounts: +5% for 46–70 days, +10% for 71+ days. Relocation fees: Windhoek→Maun NAD 12,000; Windhoek→any other location NAD 15,000. (A)/AT = automatic; D/C = double cab; S/C = single cab. ⚠ Depot surcharge/delivery fee schedule is a large city-to-city matrix (~25 origins × 25 destinations across Namibia/South Africa/Botswana/Zambia/Zimbabwe/Mozambique/Malawi/Tanzania/Kenya) published in two separate PDFs by season (01/07–10/11 high season; 01/01–30/06 & 11/11–31/12 low season, the latter specifically for HilCAM/CruCAM/ForS) — NOT loaded as structured data here, same convention as Go2/Caprivi transfers. Refer to the source PDFs directly for a delivery-fee quote rather than a manual line-item guess.",
    insuranceReference: [
      {tier:"STD", label:"Standard Cover (95% cover for theft & collision)", excess:30000, dailyFee:{rack:{d8_15:0,d16_24:0,d25p:0}, sto:{d8_15:0,d16_24:0,d25p:0}}, note:"Included, no extra daily charge."},
      {tier:"CDW1", label:"Collision & Theft Waiver — excess reduced to NAD 15,000", excess:15000, dailyFee:{rack:{d8_15:210,d16_24:190,d25p:150}, sto:{d8_15:190,d16_24:175,d25p:140}}},
      {tier:"CDW2", label:"Collision & Theft Waiver — excess reduced to ZERO (deposit NAD 5,000, tyres & windscreens incl.)", excess:0, dailyFee:{rack:{d8_15:520,d16_24:485,d25p:430}, sto:{d8_15:470,d16_24:435,d25p:390}}},
    ], // ⚠ Reference only — not wired into any calculator. All 3 tiers share this one table across every vehicle (excess/fee do not vary by vehicle class for Bushlore, unlike Melbic).
    extrasReference: [
      {label:"After Hours Fee (collect/return)", rate:525},
      {label:"Extra Person Camp Equipment", rate:1260},
      {label:"GPS with Tracks4Africa (p/d, 10-day min charge)", rate:65},
      {label:"Satellite Phone (p/d, 10-day min charge)", rate:130},
      {label:"2-Way Radios (p/d, 10-day min charge)", rate:65},
      {label:"Extra Driver", rate:525},
      {label:"Ground Tent (p/d, 10-day min)", rate:55},
      {label:"Single Mattress (once off)", rate:315},
      {label:"Pop-Up Roof Tent — 2 Pax (p/d, 10-day min) — HilC2/CruC2 only, pick-up/drop-off must match", rate:210},
      {label:"Pop-Up Roof Tent — Installation (once off)", rate:890},
      {label:"Roof Top Tent (p/d, 10-day min) — option on Unequipped vehicles, standard on equipped", rate:130},
      {label:"Removal of Stickers (once off)", rate:1050},
      {label:"Fridge 40L (p/d, 10-day min) — option on Unequipped, standard on equipped", rate:105},
      {label:"Cooler Box (once off)", rate:525},
      {label:"Water Tank 40L (once off)", rate:630},
      {label:"Child / Baby Seat (once off)", rate:315},
      {label:"Booster Seat (once off)", rate:315},
      {label:"Carnet de Passage (once off)", rate:7800},
      {label:"Heated Shower (once off)", rate:1050},
      {label:"Jerry Can 20L (once off)", rate:315},
      {label:"220VAC Inverter (once off)", rate:525},
      {label:"Awning (p/d, 10-day min)", rate:65},
      {label:"Awning Installation (once off)", rate:525},
    ], // ⚠ Reference only — not yet wired into any calculator or line-item picker. Source: Extra Equipment Rates 2027 (Bushlore) — cross-checked against the standalone Extra Equipment 2027 sheet (quoted in ZAR there; treated as 1:1 with NAD per the QB's NAD/ZAR peg).
    vehicles: [
      {
        id:"bl_hils_a", label:"Toyota Hilux 2.4 GD6 4x4 D/C AT Unequipped", pax:2, camping:false,
        rates:{
          s1:{d8_15:{rack:2255,sto:1805}, d16_24:{rack:2140,sto:1715}, d25p:{rack:2050,sto:1640}},
          s2:{d8_15:{rack:2705,sto:2165}, d16_24:{rack:2555,sto:2045}, d25p:{rack:2445,sto:1960}},
          s3:{d8_15:{rack:3725,sto:2985}, d16_24:{rack:3600,sto:2880}, d25p:{rack:3440,sto:2755}},
          s4:{d8_15:{rack:3960,sto:3175}, d16_24:{rack:3840,sto:3075}, d25p:{rack:3630,sto:2905}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000). CDW1/CDW2 paid options — see company insuranceReference."
      },
      {
        id:"bl_hilc2_a", label:"Toyota Hilux 2.4 GD6 4x4 D/C AT Camp 2 pax", pax:2, camping:true,
        rates:{
          s1:{d8_15:{rack:2555,sto:2045}, d16_24:{rack:2450,sto:1960}, d25p:{rack:2265,sto:1815}},
          s2:{d8_15:{rack:3045,sto:2440}, d16_24:{rack:2895,sto:2320}, d25p:{rack:2710,sto:2170}},
          s3:{d8_15:{rack:4025,sto:3220}, d16_24:{rack:3840,sto:3075}, d25p:{rack:3635,sto:2910}},
          s4:{d8_15:{rack:4295,sto:3440}, d16_24:{rack:4095,sto:3280}, d25p:{rack:3835,sto:3070}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000). Pop-Up Roof Tent 2-pax option available (pick-up/drop-off must match)."
      },
      {
        id:"bl_hilc4_a", label:"Toyota Hilux 2.4 GD6 4x4 D/C AT Camp 4 pax", pax:4, camping:true,
        rates:{
          s1:{d8_15:{rack:2685,sto:2150}, d16_24:{rack:2575,sto:2060}, d25p:{rack:2400,sto:1920}},
          s2:{d8_15:{rack:3145,sto:2520}, d16_24:{rack:2995,sto:2400}, d25p:{rack:2805,sto:2245}},
          s3:{d8_15:{rack:4210,sto:3370}, d16_24:{rack:4000,sto:3200}, d25p:{rack:3760,sto:3010}},
          s4:{d8_15:{rack:4460,sto:3570}, d16_24:{rack:4250,sto:3405}, d25p:{rack:4035,sto:3230}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000)."
      },
      {
        id:"bl_hilcam2_a", label:"Toyota Hilux 2.4 GD6 4x4 D/C AT Bush Camper 2 Pax", pax:2, camping:true,
        rates:{
          s1:{d8_15:{rack:3240,sto:2595}, d16_24:{rack:3120,sto:2500}, d25p:{rack:2920,sto:2340}},
          s2:{d8_15:{rack:3635,sto:2910}, d16_24:{rack:3485,sto:2790}, d25p:{rack:3280,sto:2625}},
          s3:{d8_15:{rack:4530,sto:3625}, d16_24:{rack:4340,sto:3475}, d25p:{rack:4085,sto:3270}},
          s4:{d8_15:{rack:4800,sto:3840}, d16_24:{rack:4620,sto:3700}, d25p:{rack:4405,sto:3525}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000). Bush Camper — fully equipped. ⚠ Low-season depot delivery fee schedule (footnote *5 on source PDF) applies to this vehicle class."
      },
      {
        id:"bl_hilcam_a", label:"Toyota Hilux 2.4 GD6 4x4 D/C AT Bush Camper", pax:4, camping:true,
        rates:{
          s1:{d8_15:{rack:3600,sto:2880}, d16_24:{rack:3465,sto:2775}, d25p:{rack:3240,sto:2595}},
          s2:{d8_15:{rack:4035,sto:3230}, d16_24:{rack:3870,sto:3100}, d25p:{rack:3640,sto:2915}},
          s3:{d8_15:{rack:5030,sto:4025}, d16_24:{rack:4820,sto:3860}, d25p:{rack:4535,sto:3630}},
          s4:{d8_15:{rack:5325,sto:4260}, d16_24:{rack:5130,sto:4105}, d25p:{rack:4890,sto:3915}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000). Bush Camper — fully equipped. ⚠ Low-season depot delivery fee schedule (footnote *5 on source PDF) applies to this vehicle class."
      },
      {
        id:"bl_crus", label:"Toyota Land Cruiser 79 4x4 D/C Unequipped (manual)", pax:2, camping:false,
        rates:{
          s1:{d8_15:{rack:2935,sto:2350}, d16_24:{rack:2835,sto:2270}, d25p:{rack:2695,sto:2160}},
          s2:{d8_15:{rack:3505,sto:2805}, d16_24:{rack:3385,sto:2710}, d25p:{rack:3210,sto:2570}},
          s3:{d8_15:{rack:4540,sto:3635}, d16_24:{rack:4355,sto:3490}, d25p:{rack:4090,sto:3280}},
          s4:{d8_15:{rack:4795,sto:3840}, d16_24:{rack:4630,sto:3705}, d25p:{rack:4425,sto:3540}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000)."
      },
      {
        id:"bl_cruc2", label:"Toyota Land Cruiser 79 4x4 D/C Camp 2 pax (manual)", pax:2, camping:true,
        rates:{
          s1:{d8_15:{rack:3115,sto:2495}, d16_24:{rack:2970,sto:2380}, d25p:{rack:2780,sto:2225}},
          s2:{d8_15:{rack:3690,sto:2955}, d16_24:{rack:3510,sto:2810}, d25p:{rack:3310,sto:2650}},
          s3:{d8_15:{rack:4715,sto:3775}, d16_24:{rack:4495,sto:3600}, d25p:{rack:4240,sto:3395}},
          s4:{d8_15:{rack:5005,sto:4010}, d16_24:{rack:4800,sto:3845}, d25p:{rack:4565,sto:3655}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000)."
      },
      {
        id:"bl_cruc4", label:"Toyota Land Cruiser 79 4x4 D/C Camp 4 pax (manual)", pax:4, camping:true,
        rates:{
          s1:{d8_15:{rack:3305,sto:2645}, d16_24:{rack:3110,sto:2490}, d25p:{rack:2930,sto:2345}},
          s2:{d8_15:{rack:3870,sto:3100}, d16_24:{rack:3645,sto:2920}, d25p:{rack:3410,sto:2730}},
          s3:{d8_15:{rack:4980,sto:3985}, d16_24:{rack:4725,sto:3780}, d25p:{rack:4390,sto:3515}},
          s4:{d8_15:{rack:5270,sto:4220}, d16_24:{rack:4980,sto:3985}, d25p:{rack:4715,sto:3775}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000)."
      },
      {
        id:"bl_crucam", label:"Toyota Land Cruiser 79 4x4 S/C Bush Camper (manual)", pax:2, camping:true,
        rates:{
          s1:{d8_15:{rack:4220,sto:3380}, d16_24:{rack:3935,sto:3150}, d25p:{rack:3700,sto:2960}},
          s2:{d8_15:{rack:4735,sto:3790}, d16_24:{rack:4430,sto:3545}, d25p:{rack:4135,sto:3310}},
          s3:{d8_15:{rack:5710,sto:4570}, d16_24:{rack:5470,sto:4380}, d25p:{rack:5055,sto:4045}},
          s4:{d8_15:{rack:5845,sto:4680}, d16_24:{rack:5640,sto:4515}, d25p:{rack:5340,sto:4275}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000). Bush Camper — fully equipped, single cab. ⚠ Low-season depot delivery fee schedule (footnote *5 on source PDF) applies to this vehicle class."
      },
      {
        id:"bl_crus_a", label:"Toyota Land Cruiser 79 4x4 D/C AT Unequipped", pax:2, camping:false,
        rates:{
          s1:{d8_15:{rack:3230,sto:2585}, d16_24:{rack:3120,sto:2500}, d25p:{rack:2965,sto:2375}},
          s2:{d8_15:{rack:3860,sto:3090}, d16_24:{rack:3725,sto:2980}, d25p:{rack:3535,sto:2830}},
          s3:{d8_15:{rack:4995,sto:4000}, d16_24:{rack:4790,sto:3835}, d25p:{rack:4500,sto:3605}},
          s4:{d8_15:{rack:5280,sto:4225}, d16_24:{rack:5095,sto:4075}, d25p:{rack:4870,sto:3900}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000)."
      },
      {
        id:"bl_cruc2_a", label:"Toyota Land Cruiser 79 4x4 D/C AT Camp 2 pax", pax:2, camping:true,
        rates:{
          s1:{d8_15:{rack:3430,sto:2745}, d16_24:{rack:3270,sto:2620}, d25p:{rack:3060,sto:2450}},
          s2:{d8_15:{rack:4060,sto:3250}, d16_24:{rack:3865,sto:3095}, d25p:{rack:3645,sto:2920}},
          s3:{d8_15:{rack:5190,sto:4155}, d16_24:{rack:4950,sto:3960}, d25p:{rack:4665,sto:3735}},
          s4:{d8_15:{rack:5510,sto:4410}, d16_24:{rack:5285,sto:4230}, d25p:{rack:5020,sto:4020}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000)."
      },
      {
        id:"bl_cruc4_a", label:"Toyota Land Cruiser 79 4x4 D/C AT Camp 4 pax", pax:4, camping:true,
        rates:{
          s1:{d8_15:{rack:3640,sto:2915}, d16_24:{rack:3425,sto:2740}, d25p:{rack:3225,sto:2580}},
          s2:{d8_15:{rack:4260,sto:3410}, d16_24:{rack:4010,sto:3210}, d25p:{rack:3755,sto:3005}},
          s3:{d8_15:{rack:5480,sto:4385}, d16_24:{rack:5200,sto:4160}, d25p:{rack:4830,sto:3865}},
          s4:{d8_15:{rack:5800,sto:4645}, d16_24:{rack:5480,sto:4385}, d25p:{rack:5190,sto:4155}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000)."
      },
      {
        id:"bl_crucam_a", label:"Toyota Land Cruiser 79 4x4 S/C AT Bush Camper", pax:2, camping:true,
        rates:{
          s1:{d8_15:{rack:4645,sto:3720}, d16_24:{rack:4330,sto:3465}, d25p:{rack:4070,sto:3260}},
          s2:{d8_15:{rack:5210,sto:4170}, d16_24:{rack:4875,sto:3900}, d25p:{rack:4550,sto:3640}},
          s3:{d8_15:{rack:6280,sto:5025}, d16_24:{rack:6020,sto:4820}, d25p:{rack:5560,sto:4450}},
          s4:{d8_15:{rack:6435,sto:5150}, d16_24:{rack:6210,sto:4970}, d25p:{rack:5875,sto:4700}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000). Bush Camper — fully equipped, single cab, automatic. ⚠ Low-season depot delivery fee schedule (footnote *5 on source PDF) applies to this vehicle class."
      },
      {
        id:"bl_fors_a", label:"Toyota Fortuner 2.4 GD6 4x4 Unequipped", pax:5, camping:false,
        rates:{
          s1:{d8_15:{rack:2665,sto:2135}, d16_24:{rack:2530,sto:2025}, d25p:{rack:2415,sto:1935}},
          s2:{d8_15:{rack:3180,sto:2545}, d16_24:{rack:3010,sto:2410}, d25p:{rack:2870,sto:2300}},
          s3:{d8_15:{rack:4170,sto:3340}, d16_24:{rack:4040,sto:3235}, d25p:{rack:3850,sto:3080}},
          s4:{d8_15:{rack:4435,sto:3550}, d16_24:{rack:4300,sto:3440}, d25p:{rack:4065,sto:3255}}
        },
        stdExcess:30000, note:"Standard Cover incl. (excess NAD 30,000). ⚠ Low-season depot delivery fee schedule (footnote *5 on source PDF) applies to this vehicle class."
      }
    ]
  },

  AES: {
    name: "African Elegance Safaris",
    contact: "info@africanelegancesafaris.com | +49 (0)2842-21994-71 (VOIP – Namibia) | africanelegancesafaris.com",
    note: "⚠ LIMITED-TIME SPECIAL — valid only for travel in December 2026 and January & February 2027; bookings must be confirmed within this promotional period. Travel outside this window is quoted at standard rates (not loaded — this is the special-rate flyer only). Toyota Hilux only. Rates per vehicle per day, incl. standard vehicle equipment, unlimited km, Platinum Insurance (collision & theft). Excl. fuel, cross-border fees/permits, traffic fines, optional extras (additional driver, two-way radios, satellite phone). Minimum 7-day rental (shorter durations subject to rate adjustment). 20% non-refundable deposit to secure (or full prepayment if booked within 6 weeks of pickup); final payment due 6 weeks prior to pickup. Cannot be combined with other promotions/discounts. Cross-border travel must be declared in advance and approved.",
    vehicles: [
      {
        id:"aes_hilux_nocamp", label:"Toyota Hilux D/C 4x4 — Non-Camping Equipped (SPECIAL)",
        pax:4, camping:false,
        rates:{
          low:{d1_14:{rack:2500,sto:2250}, d15p:{rack:2500,sto:2250}},
          high:{d1_14:{rack:2500,sto:2250}, d15p:{rack:2500,sto:2250}}
        },
        stdExcess:null, reducedExcessDaily:null, reducedExcess:null, zeroExcessDaily:null, zeroExcess:null,
        note:"Special rate — flat, no seasonal variation, valid Dec 2026 & Jan–Feb 2027 only. Min 7 days. Platinum Insurance incl."
      },
      {
        id:"aes_hilux_camp", label:"Toyota Hilux D/C 4x4 — Camping Equipped (SPECIAL)",
        pax:4, camping:true,
        rates:{
          low:{d1_14:{rack:2750,sto:2475}, d15p:{rack:2750,sto:2475}},
          high:{d1_14:{rack:2750,sto:2475}, d15p:{rack:2750,sto:2475}}
        },
        stdExcess:null, reducedExcessDaily:null, reducedExcess:null, zeroExcessDaily:null, zeroExcess:null,
        note:"Special rate — flat, valid Dec 2026 & Jan–Feb 2027 only. Min 7 days. Camping equipped. Platinum Insurance incl."
      },
      {
        id:"aes_hilux_extreme", label:"Toyota Hilux D/C 4x4 — Safari Extreme (SPECIAL)",
        pax:4, camping:true,
        rates:{
          low:{d1_14:{rack:2800,sto:2520}, d15p:{rack:2800,sto:2520}},
          high:{d1_14:{rack:2800,sto:2520}, d15p:{rack:2800,sto:2520}}
        },
        stdExcess:null, reducedExcessDaily:null, reducedExcess:null, zeroExcessDaily:null, zeroExcess:null,
        note:"Special rate — flat, valid Dec 2026 & Jan–Feb 2027 only. Min 7 days. Platinum Insurance incl."
      },
      {
        id:"aes_hilux_bushcamper", label:"Toyota Hilux D/C 4x4 — Bushcamper (SPECIAL)",
        pax:4, camping:true,
        rates:{
          low:{d1_14:{rack:3000,sto:2700}, d15p:{rack:3000,sto:2700}},
          high:{d1_14:{rack:3000,sto:2700}, d15p:{rack:3000,sto:2700}}
        },
        stdExcess:null, reducedExcessDaily:null, reducedExcess:null, zeroExcessDaily:null, zeroExcess:null,
        note:"Special rate — flat, valid Dec 2026 & Jan–Feb 2027 only. Min 7 days. Fully kitted bushcamper. Platinum Insurance incl."
      }
    ]
  },

  // Added [session date]. Source: "TAB 2027 RACK Rates.pdf" + "TAB 2027 Rack
  // -20 NETT Rates.pdf" (Travel Adventures Botswana). First TAB entry — new
  // company, not a rate update to an existing one.
  TAB: {
    name: "Travel Adventures Botswana (TAB)",
    currency: "USD",
    contact: "reservations@traveladventuresbotswana.com | WhatsApp/Mobile: +267 763 67205 | Office Landline: +267 684 0351",
    note: "Rates quoted in USD, per vehicle per day, inclusive of unlimited KM. Guides hold a Botswana Professional Guide's Licence and Driver's Licence. Confirmed season sheet runs 1 Feb 2027 – 31 Jan 2028; dates outside that window fall back to the 'shoulder' season as a placeholder only — reconfirm with TAB before quoting travel outside the stated window. STO shown is the supplier's own stated 20% NETT rate (confirmed directly from the rate sheet, not an assumed discount — stoDisc-style estimation does not apply here).",
    vehicles: [
      {
        id: "tab_dcab_full",
        label: "4x4 Toyota Double Cab Landcruiser — Fully Equipped (GPS, Sat Phone, cooking & camping gear)",
        camping: true,
        rates: {
          green:    { d5_14: {rack:223, sto:178}, d15p:  {rack:202, sto:162} },
          shoulder: { d5_10: {rack:287, sto:230}, d11_20:{rack:274, sto:219}, d21p:{rack:252, sto:202} },
          midpeak:  { d5_14: {rack:385, sto:308}, d15p:  {rack:361, sto:289} },
          peak:     { d7_20: {rack:396, sto:317}, d21p:  {rack:385, sto:308} }
        }
      },
      {
        id: "tab_dcab_std",
        label: "4x4 Toyota Double Cab Landcruiser — Vehicle Only, Standard Equipped (GPS, Sat Phone, Picnic Gear & Engel fridge)",
        camping: false,
        rates: {
          green:    { d5_14: {rack:201, sto:161}, d15p:  {rack:188, sto:150} },
          shoulder: { d5_10: {rack:263, sto:210}, d11_20:{rack:254, sto:203}, d21p:{rack:234, sto:187} },
          midpeak:  { d5_14: {rack:355, sto:284}, d15p:  {rack:329, sto:263} },
          peak:     { d7_20: {rack:364, sto:291}, d21p:  {rack:350, sto:284} }
        }
      }
    ],
    guiding: {
      standardGuideRatePerDay: 185,
      note: "Fee includes guiding as indicated. Excludes: US$115 guide's passenger liability cover, fuel, guide's meals, accommodation, park fees for clients' account."
    },
    insurance: {
      standardExcess: { amount: 4000, dailyFee: 0, note: "Included" },
      superExcessOption: { amount: 380, dailyFee: 60 }
    },
    extrasReference: [
      { label: "Okavango Air Rescue Membership per person (mandatory)", rack: 20, sto: 15 },
      { label: "Unique Super Duper Driver Training (recommended)", rack: 160, sto: 150 },
      { label: "Cleaning Fee (mandatory)", rack: 60, sto: 55 },
      { label: "Campsite Booking Fee (mandatory, per person per night)", rack: 25, sto: 20 },
      { label: "Satellite Phone Usage (per minute, non-commissionable)", rack: 6, sto: 6 },
      { label: "Two Way Radios (recommended for up to 3 vehicle groups, per radio per day, non-commissionable)", rack: 3, sto: 3 },
      { label: "\"Out of Hours\" vehicle handovers (before 9am / after 4pm)", rack: 80, sto: 80 },
      { label: "Saturday vehicle handover (per booking per time)", rack: 100, sto: 100 },
      { label: "Sunday vehicle handover (per booking per time)", rack: 200, sto: 200 },
      { label: "Call out fee (per kilometre)", rack: 6, sto: 6 }
    ],
    dropoffFeesReference: [
      { dest: "Maun", fee: "FOC" },
      { dest: "Kasane", fee: 420 },
      { dest: "Francistown", fee: 445 },
      { dest: "Gaborone or Windhoek", fee: 865 },
      { dest: "Livingstone", fee: 790 },
      { dest: "Victoria Falls", fee: 495 },
      { dest: "Bulawayo & Harare", fee: "ON REQUEST" }
    ],
    dropoffFeesNote: "Non-commissionable. Current surcharge is +20% (basis not specified on the sheet — confirm with TAB before quoting a relocation). Fuel surcharge paid on vehicle receiving by credit card: +4% card admin fee. Extra Equipment & Additional Driver: FOC, T&C apply.",
    unresolved: [
      "Vehicle passenger capacity (pax) is not stated on either rate sheet for either vehicle class — confirm with TAB before assuming a seat count.",
      "The '+20%' relocation surcharge doesn't specify its base (one-way fee? total rental?) — confirm before quoting a relocation."
    ]
  }

};

// ── 2027 RATE ESTIMATOR ──────────────────────────────────────────────────────
// If a lodge has no 2027 rates yet, fall back to 2026 rates × 1.10.
// Returns {rack, sto, estimated:true} when using the fallback, or
// {rack, sto, estimated:false} when real rates exist.
// Pass the room object, the desired season id, and the parent lodge object.
