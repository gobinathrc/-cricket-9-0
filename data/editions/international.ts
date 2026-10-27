import { TournamentSquad } from "../../types/cricket";

/**
 * Historical and breakout international tournament squads across the T20 World Cup.
 * Expanded with complete multi-player rosters (starters + full bench).
 */
export const INTERNATIONAL_EDITIONS: TournamentSquad[] = [
  // 1. Pakistan 2009 (Champions)
  {
    id: "squad_pak_2009",
    editionYear: 2009,
    teamName: "Pakistan (2009 Champions)",
    countryCode: "PAK",
    isChampion: true,
    themeColor: "from-emerald-700 to-green-950",
    roster: [
      { id: "pak_2009_shahid_afridi", athleteId: "shahid_afridi", name: "Shahid Afridi", countryCode: "PAK", editionYear: 2009, role: "AR", battingStyle: "RHB", bowlingType: "SPIN_LEG", ovr: 96, subRatings: { batting: 91, bowling: 95, paceOrTurn: 95, clutch: 99 }, tournamentStats: { runs: 176, ballsFaced: 125, strikeRate: 140.8, average: 35.2, wickets: 11, oversBowled: 28, economy: 5.32 } },
      { id: "pak_2009_umar_gul", athleteId: "umar_gul", name: "Umar Gul", countryCode: "PAK", editionYear: 2009, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 95, subRatings: { batting: 50, bowling: 96, paceOrTurn: 95, clutch: 96 }, tournamentStats: { runs: 8, ballsFaced: 8, strikeRate: 100.0, average: 8.0, wickets: 13, oversBowled: 27.2, economy: 6.43 } },
      { id: "pak_2009_kamran_akmal", athleteId: "kamran_akmal", name: "Kamran Akmal", countryCode: "PAK", editionYear: 2009, role: "WK", battingStyle: "RHB", bowlingType: "NONE", ovr: 88, subRatings: { batting: 89, bowling: 35, paceOrTurn: 35, clutch: 88 }, tournamentStats: { runs: 247, ballsFaced: 187, strikeRate: 132.0, average: 35.2, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "pak_2009_saeed_ajmal", athleteId: "saeed_ajmal", name: "Saeed Ajmal", countryCode: "PAK", editionYear: 2009, role: "BOWL", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 92, subRatings: { batting: 45, bowling: 93, paceOrTurn: 94, clutch: 92 }, tournamentStats: { runs: 1, ballsFaced: 2, strikeRate: 50.0, average: 1.0, wickets: 12, oversBowled: 28, economy: 5.82 } },
      { id: "pak_2009_younis_khan", athleteId: "younis_khan", name: "Younis Khan", countryCode: "PAK", editionYear: 2009, role: "BAT", battingStyle: "RHB", bowlingType: "NONE", ovr: 86, subRatings: { batting: 87, bowling: 40, paceOrTurn: 40, clutch: 91 }, tournamentStats: { runs: 172, ballsFaced: 124, strikeRate: 138.7, average: 28.6, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "pak_2009_shoaib_malik", athleteId: "shoaib_malik", name: "Shoaib Malik", countryCode: "PAK", editionYear: 2009, role: "AR", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 87, subRatings: { batting: 88, bowling: 78, paceOrTurn: 78, clutch: 90 }, tournamentStats: { runs: 202, ballsFaced: 168, strikeRate: 120.2, average: 40.4, wickets: 2, oversBowled: 7, economy: 6.8 } },
      { id: "pak_2009_abdur_razzaq", athleteId: "abdur_razzaq", name: "Abdul Razzaq", countryCode: "PAK", editionYear: 2009, role: "AR", battingStyle: "RHB", bowlingType: "FAST", ovr: 88, subRatings: { batting: 86, bowling: 87, paceOrTurn: 85, clutch: 94 }, tournamentStats: { runs: 15, ballsFaced: 10, strikeRate: 150.0, average: 15.0, wickets: 5, oversBowled: 12, economy: 5.91 } },
      { id: "pak_2009_fawad_alam", athleteId: "fawad_alam", name: "Fawad Alam", countryCode: "PAK", editionYear: 2009, role: "BAT", battingStyle: "LHB", bowlingType: "SPIN_OFF", ovr: 80, subRatings: { batting: 81, bowling: 65, paceOrTurn: 65, clutch: 80 }, tournamentStats: { runs: 42, ballsFaced: 40, strikeRate: 105.0, average: 21.0, wickets: 0, oversBowled: 2, economy: 8.0 } },
      { id: "pak_2009_mohammad_amir", athleteId: "mohammad_amir", name: "Mohammad Amir", countryCode: "PAK", editionYear: 2009, role: "BOWL", battingStyle: "LHB", bowlingType: "FAST", ovr: 89, subRatings: { batting: 45, bowling: 90, paceOrTurn: 92, clutch: 91 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 6, oversBowled: 28, economy: 7.28 } },
      { id: "pak_2009_misbah_ul_haq", athleteId: "misbah_ul_haq", name: "Misbah-ul-Haq", countryCode: "PAK", editionYear: 2009, role: "BAT", battingStyle: "RHB", bowlingType: "NONE", ovr: 85, subRatings: { batting: 86, bowling: 40, paceOrTurn: 40, clutch: 87 }, tournamentStats: { runs: 82, ballsFaced: 78, strikeRate: 105.1, average: 20.5, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "pak_2009_shahzaib_hasan", athleteId: "shahzaib_hasan", name: "Shahzaib Hasan", countryCode: "PAK", editionYear: 2009, role: "BAT", battingStyle: "RHB", bowlingType: "NONE", ovr: 80, subRatings: { batting: 81, bowling: 35, paceOrTurn: 35, clutch: 82 }, tournamentStats: { runs: 84, ballsFaced: 70, strikeRate: 120.0, average: 21.0, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "pak_2009_sohail_tanvir", athleteId: "sohail_tanvir", name: "Sohail Tanvir", countryCode: "PAK", editionYear: 2009, role: "BOWL", battingStyle: "LHB", bowlingType: "FAST", ovr: 82, subRatings: { batting: 60, bowling: 83, paceOrTurn: 84, clutch: 82 }, tournamentStats: { runs: 6, ballsFaced: 5, strikeRate: 120.0, average: 6.0, wickets: 3, oversBowled: 12, economy: 7.8 } },
    ],
  },

  // 2. England 2010 (Champions)
  {
    id: "squad_eng_2010",
    editionYear: 2010,
    teamName: "England (2010 Champions)",
    countryCode: "ENG",
    isChampion: true,
    themeColor: "from-red-600 to-slate-900",
    roster: [
      { id: "eng_2010_kevin_pietersen", athleteId: "kevin_pietersen", name: "Kevin Pietersen", countryCode: "ENG", editionYear: 2010, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 97, subRatings: { batting: 98, bowling: 60, paceOrTurn: 60, clutch: 99 }, tournamentStats: { runs: 248, ballsFaced: 180, strikeRate: 137.7, average: 62.0, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "eng_2010_craig_kieswetter", athleteId: "craig_kieswetter", name: "Craig Kieswetter", countryCode: "ENG", editionYear: 2010, role: "WK", battingStyle: "RHB", bowlingType: "NONE", ovr: 89, subRatings: { batting: 90, bowling: 35, paceOrTurn: 35, clutch: 93 }, tournamentStats: { runs: 222, ballsFaced: 189, strikeRate: 117.4, average: 31.7, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "eng_2010_graeme_swann", athleteId: "graeme_swann", name: "Graeme Swann", countryCode: "ENG", editionYear: 2010, role: "BOWL", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 93, subRatings: { batting: 60, bowling: 94, paceOrTurn: 94, clutch: 93 }, tournamentStats: { runs: 12, ballsFaced: 8, strikeRate: 150.0, average: 12.0, wickets: 10, oversBowled: 24, economy: 6.54 } },
      { id: "eng_2010_stuart_broad", athleteId: "stuart_broad", name: "Stuart Broad", countryCode: "ENG", editionYear: 2010, role: "BOWL", battingStyle: "LHB", bowlingType: "FAST", ovr: 90, subRatings: { batting: 62, bowling: 91, paceOrTurn: 91, clutch: 90 }, tournamentStats: { runs: 6, ballsFaced: 5, strikeRate: 120.0, average: 6.0, wickets: 8, oversBowled: 23, economy: 7.21 } },
      { id: "eng_2010_paul_collingwood", athleteId: "paul_collingwood", name: "Paul Collingwood", countryCode: "ENG", editionYear: 2010, role: "AR", battingStyle: "RHB", bowlingType: "MEDIUM", ovr: 88, subRatings: { batting: 87, bowling: 82, paceOrTurn: 80, clutch: 92 }, tournamentStats: { runs: 101, ballsFaced: 88, strikeRate: 114.7, average: 25.2, wickets: 2, oversBowled: 6, economy: 7.5 } },
      { id: "eng_2010_eoin_morgan", athleteId: "eoin_morgan", name: "Eoin Morgan", countryCode: "ENG", editionYear: 2010, role: "BAT", battingStyle: "LHB", bowlingType: "NONE", ovr: 89, subRatings: { batting: 90, bowling: 40, paceOrTurn: 40, clutch: 92 }, tournamentStats: { runs: 183, ballsFaced: 139, strikeRate: 131.6, average: 36.6, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "eng_2010_luke_wright", athleteId: "luke_wright", name: "Luke Wright", countryCode: "ENG", editionYear: 2010, role: "AR", battingStyle: "RHB", bowlingType: "FAST", ovr: 85, subRatings: { batting: 84, bowling: 81, paceOrTurn: 82, clutch: 85 }, tournamentStats: { runs: 90, ballsFaced: 75, strikeRate: 120.0, average: 18.0, wickets: 3, oversBowled: 8, economy: 8.1 } },
      { id: "eng_2010_ryan_sidebottom", athleteId: "ryan_sidebottom", name: "Ryan Sidebottom", countryCode: "ENG", editionYear: 2010, role: "BOWL", battingStyle: "LHB", bowlingType: "FAST", ovr: 88, subRatings: { batting: 45, bowling: 89, paceOrTurn: 87, clutch: 88 }, tournamentStats: { runs: 1, ballsFaced: 1, strikeRate: 100.0, average: 1.0, wickets: 10, oversBowled: 24, economy: 7.33 } },
      { id: "eng_2010_michael_yardy", athleteId: "michael_yardy", name: "Michael Yardy", countryCode: "ENG", editionYear: 2010, role: "AR", battingStyle: "LHB", bowlingType: "SPIN_OFF", ovr: 85, subRatings: { batting: 75, bowling: 86, paceOrTurn: 86, clutch: 86 }, tournamentStats: { runs: 18, ballsFaced: 16, strikeRate: 112.5, average: 18.0, wickets: 7, oversBowled: 21, economy: 6.95 } },
      { id: "eng_2010_tim_bresnan", athleteId: "tim_bresnan", name: "Tim Bresnan", countryCode: "ENG", editionYear: 2010, role: "AR", battingStyle: "RHB", bowlingType: "FAST", ovr: 84, subRatings: { batting: 76, bowling: 85, paceOrTurn: 85, clutch: 84 }, tournamentStats: { runs: 12, ballsFaced: 9, strikeRate: 133.3, average: 12.0, wickets: 4, oversBowled: 16, economy: 7.75 } },
      { id: "eng_2010_james_anderson", athleteId: "james_anderson", name: "James Anderson", countryCode: "ENG", editionYear: 2010, role: "BOWL", battingStyle: "LHB", bowlingType: "FAST", ovr: 82, subRatings: { batting: 45, bowling: 83, paceOrTurn: 85, clutch: 80 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 2, oversBowled: 6, economy: 8.2 } },
    ],
  },

  // 3. West Indies 2012 (Champions)
  {
    id: "squad_wi_2012",
    editionYear: 2012,
    teamName: "West Indies (2012 Champions)",
    countryCode: "WI",
    isChampion: true,
    themeColor: "from-amber-700 to-rose-950",
    roster: [
      { id: "wi_2012_marlon_samuels", athleteId: "marlon_samuels", name: "Marlon Samuels", countryCode: "WI", editionYear: 2012, role: "AR", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 96, subRatings: { batting: 96, bowling: 84, paceOrTurn: 83, clutch: 99 }, tournamentStats: { runs: 230, ballsFaced: 173, strikeRate: 132.9, average: 38.3, wickets: 4, oversBowled: 15, economy: 6.73 } },
      { id: "wi_2012_chris_gayle", athleteId: "chris_gayle", name: "Chris Gayle", countryCode: "WI", editionYear: 2012, role: "BAT", battingStyle: "LHB", bowlingType: "SPIN_OFF", ovr: 95, subRatings: { batting: 97, bowling: 65, paceOrTurn: 65, clutch: 95 }, tournamentStats: { runs: 222, ballsFaced: 148, strikeRate: 150.0, average: 44.4, wickets: 3, oversBowled: 10, economy: 7.5 } },
      { id: "wi_2012_sunil_narine", athleteId: "sunil_narine", name: "Sunil Narine", countryCode: "WI", editionYear: 2012, role: "BOWL", battingStyle: "LHB", bowlingType: "SPIN_OFF", ovr: 94, subRatings: { batting: 60, bowling: 95, paceOrTurn: 96, clutch: 95 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 9, oversBowled: 23.4, economy: 5.61 } },
      { id: "wi_2012_dwayne_bravo", athleteId: "dwayne_bravo", name: "Dwayne Bravo", countryCode: "WI", editionYear: 2012, role: "AR", battingStyle: "RHB", bowlingType: "FAST", ovr: 90, subRatings: { batting: 88, bowling: 89, paceOrTurn: 88, clutch: 92 }, tournamentStats: { runs: 134, ballsFaced: 114, strikeRate: 117.5, average: 33.5, wickets: 5, oversBowled: 16, economy: 8.1 } },
      { id: "wi_2012_darren_sammy", athleteId: "darren_sammy", name: "Darren Sammy", countryCode: "WI", editionYear: 2012, role: "AR", battingStyle: "RHB", bowlingType: "MEDIUM", ovr: 87, subRatings: { batting: 86, bowling: 84, paceOrTurn: 80, clutch: 94 }, tournamentStats: { runs: 85, ballsFaced: 62, strikeRate: 137.0, average: 28.3, wickets: 4, oversBowled: 14, economy: 7.6 } },
      { id: "wi_2012_kieron_pollard", athleteId: "kieron_pollard", name: "Kieron Pollard", countryCode: "WI", editionYear: 2012, role: "AR", battingStyle: "RHB", bowlingType: "MEDIUM", ovr: 89, subRatings: { batting: 90, bowling: 82, paceOrTurn: 82, clutch: 92 }, tournamentStats: { runs: 124, ballsFaced: 90, strikeRate: 137.7, average: 24.8, wickets: 4, oversBowled: 11, economy: 7.9 } },
      { id: "wi_2012_denesh_ramdin", athleteId: "denesh_ramdin", name: "Denesh Ramdin", countryCode: "WI", editionYear: 2012, role: "WK", battingStyle: "RHB", bowlingType: "NONE", ovr: 82, subRatings: { batting: 81, bowling: 35, paceOrTurn: 35, clutch: 84 }, tournamentStats: { runs: 45, ballsFaced: 40, strikeRate: 112.5, average: 15.0, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "wi_2012_ravi_rampaul", athleteId: "ravi_rampaul", name: "Ravi Rampaul", countryCode: "WI", editionYear: 2012, role: "BOWL", battingStyle: "LHB", bowlingType: "FAST", ovr: 88, subRatings: { batting: 45, bowling: 89, paceOrTurn: 89, clutch: 88 }, tournamentStats: { runs: 2, ballsFaced: 4, strikeRate: 50.0, average: 2.0, wickets: 9, oversBowled: 23, economy: 7.43 } },
      { id: "wi_2012_samuel_badree", athleteId: "samuel_badree", name: "Samuel Badree", countryCode: "WI", editionYear: 2012, role: "BOWL", battingStyle: "RHB", bowlingType: "SPIN_LEG", ovr: 89, subRatings: { batting: 40, bowling: 90, paceOrTurn: 90, clutch: 90 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 4, oversBowled: 13, economy: 6.07 } },
      { id: "wi_2012_johnson_charles", athleteId: "johnson_charles", name: "Johnson Charles", countryCode: "WI", editionYear: 2012, role: "BAT", battingStyle: "RHB", bowlingType: "NONE", ovr: 84, subRatings: { batting: 85, bowling: 35, paceOrTurn: 35, clutch: 82 }, tournamentStats: { runs: 137, ballsFaced: 120, strikeRate: 114.1, average: 22.8, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "wi_2012_andre_russell", athleteId: "andre_russell", name: "Andre Russell", countryCode: "WI", editionYear: 2012, role: "AR", battingStyle: "RHB", bowlingType: "FAST", ovr: 86, subRatings: { batting: 87, bowling: 84, paceOrTurn: 88, clutch: 86 }, tournamentStats: { runs: 40, ballsFaced: 28, strikeRate: 142.8, average: 13.3, wickets: 3, oversBowled: 9, economy: 8.5 } },
      { id: "wi_2012_fidel_edwards", athleteId: "fidel_edwards", name: "Fidel Edwards", countryCode: "WI", editionYear: 2012, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 81, subRatings: { batting: 40, bowling: 83, paceOrTurn: 92, clutch: 80 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 2, oversBowled: 8, economy: 8.4 } },
    ],
  },

  // 4. Australia 2021 (Champions)
  {
    id: "squad_aus_2021",
    editionYear: 2021,
    teamName: "Australia (2021 Champions)",
    countryCode: "AUS",
    isChampion: true,
    themeColor: "from-amber-400 to-green-900",
    roster: [
      { id: "aus_2021_david_warner", athleteId: "david_warner", name: "David Warner", countryCode: "AUS", editionYear: 2021, role: "BAT", battingStyle: "LHB", bowlingType: "NONE", ovr: 96, subRatings: { batting: 97, bowling: 40, paceOrTurn: 40, clutch: 98 }, tournamentStats: { runs: 289, ballsFaced: 197, strikeRate: 146.7, average: 48.1, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "aus_2021_mitchell_marsh", athleteId: "mitchell_marsh", name: "Mitchell Marsh", countryCode: "AUS", editionYear: 2021, role: "AR", battingStyle: "RHB", bowlingType: "FAST", ovr: 95, subRatings: { batting: 96, bowling: 80, paceOrTurn: 80, clutch: 98 }, tournamentStats: { runs: 185, ballsFaced: 126, strikeRate: 146.8, average: 61.6, wickets: 0, oversBowled: 5, economy: 7.8 } },
      { id: "aus_2021_adam_zampa", athleteId: "adam_zampa", name: "Adam Zampa", countryCode: "AUS", editionYear: 2021, role: "BOWL", battingStyle: "RHB", bowlingType: "SPIN_LEG", ovr: 95, subRatings: { batting: 40, bowling: 96, paceOrTurn: 95, clutch: 95 }, tournamentStats: { runs: 1, ballsFaced: 1, strikeRate: 100.0, average: 1.0, wickets: 13, oversBowled: 27, economy: 5.81 } },
      { id: "aus_2021_josh_hazlewood", athleteId: "josh_hazlewood", name: "Josh Hazlewood", countryCode: "AUS", editionYear: 2021, role: "BOWL", battingStyle: "LHB", bowlingType: "FAST", ovr: 93, subRatings: { batting: 40, bowling: 94, paceOrTurn: 93, clutch: 94 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 11, oversBowled: 24, economy: 6.87 } },
      { id: "aus_2021_mitchell_starc", athleteId: "mitchell_starc", name: "Mitchell Starc", countryCode: "AUS", editionYear: 2021, role: "BOWL", battingStyle: "LHB", bowlingType: "FAST", ovr: 91, subRatings: { batting: 55, bowling: 92, paceOrTurn: 96, clutch: 92 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 9, oversBowled: 27, economy: 8.33 } },
      { id: "aus_2021_pat_cummins", athleteId: "pat_cummins", name: "Pat Cummins", countryCode: "AUS", editionYear: 2021, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 90, subRatings: { batting: 68, bowling: 91, paceOrTurn: 92, clutch: 93 }, tournamentStats: { runs: 16, ballsFaced: 10, strikeRate: 160.0, average: 16.0, wickets: 5, oversBowled: 24, economy: 7.37 } },
      { id: "aus_2021_glenn_maxwell", athleteId: "glenn_maxwell", name: "Glenn Maxwell", countryCode: "AUS", editionYear: 2021, role: "AR", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 89, subRatings: { batting: 90, bowling: 80, paceOrTurn: 80, clutch: 91 }, tournamentStats: { runs: 115, ballsFaced: 80, strikeRate: 143.7, average: 38.3, wickets: 2, oversBowled: 16, economy: 6.18 } },
      { id: "aus_2021_aaron_finch", athleteId: "aaron_finch", name: "Aaron Finch", countryCode: "AUS", editionYear: 2021, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 85, subRatings: { batting: 86, bowling: 40, paceOrTurn: 40, clutch: 88 }, tournamentStats: { runs: 135, ballsFaced: 116, strikeRate: 116.3, average: 19.2, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "aus_2021_matthew_wade", athleteId: "matthew_wade", name: "Matthew Wade", countryCode: "AUS", editionYear: 2021, role: "WK", battingStyle: "LHB", bowlingType: "NONE", ovr: 90, subRatings: { batting: 91, bowling: 35, paceOrTurn: 35, clutch: 98 }, tournamentStats: { runs: 84, ballsFaced: 58, strikeRate: 144.8, average: 84.0, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "aus_2021_marcus_stoinis", athleteId: "marcus_stoinis", name: "Marcus Stoinis", countryCode: "AUS", editionYear: 2021, role: "AR", battingStyle: "RHB", bowlingType: "MEDIUM", ovr: 88, subRatings: { batting: 89, bowling: 80, paceOrTurn: 80, clutch: 92 }, tournamentStats: { runs: 80, ballsFaced: 58, strikeRate: 137.9, average: 80.0, wickets: 0, oversBowled: 4, economy: 8.5 } },
      { id: "aus_2021_steve_smith", athleteId: "steve_smith", name: "Steve Smith", countryCode: "AUS", editionYear: 2021, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_LEG", ovr: 83, subRatings: { batting: 84, bowling: 55, paceOrTurn: 55, clutch: 84 }, tournamentStats: { runs: 69, ballsFaced: 71, strikeRate: 97.1, average: 23.0, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "aus_2021_ashton_agar", athleteId: "ashton_agar", name: "Ashton Agar", countryCode: "AUS", editionYear: 2021, role: "AR", battingStyle: "LHB", bowlingType: "SPIN_OFF", ovr: 82, subRatings: { batting: 70, bowling: 84, paceOrTurn: 84, clutch: 80 }, tournamentStats: { runs: 7, ballsFaced: 5, strikeRate: 140.0, average: 7.0, wickets: 1, oversBowled: 6, economy: 6.83 } },
    ],
  },

  // 5. South Africa 2024 (Runners-Up)
  {
    id: "squad_sa_2024",
    editionYear: 2024,
    teamName: "South Africa (2024 Finalists)",
    countryCode: "SA",
    isChampion: false,
    themeColor: "from-emerald-600 to-amber-500",
    roster: [
      { id: "sa_2024_heinrich_klaasen", athleteId: "heinrich_klaasen", name: "Heinrich Klaasen", countryCode: "SA", editionYear: 2024, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 96, subRatings: { batting: 97, bowling: 40, paceOrTurn: 40, clutch: 96 }, tournamentStats: { runs: 190, ballsFaced: 150, strikeRate: 126.6, average: 27.1, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "sa_2024_anrich_nortje", athleteId: "anrich_nortje", name: "Anrich Nortje", countryCode: "SA", editionYear: 2024, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 95, subRatings: { batting: 45, bowling: 96, paceOrTurn: 98, clutch: 95 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 15, oversBowled: 35, economy: 5.74 } },
      { id: "sa_2024_quinton_de_kock", athleteId: "quinton_de_kock", name: "Quinton de Kock", countryCode: "SA", editionYear: 2024, role: "WK", battingStyle: "LHB", bowlingType: "NONE", ovr: 93, subRatings: { batting: 94, bowling: 35, paceOrTurn: 35, clutch: 92 }, tournamentStats: { runs: 243, ballsFaced: 173, strikeRate: 140.4, average: 27.0, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "sa_2024_kagiso_rabada", athleteId: "kagiso_rabada", name: "Kagiso Rabada", countryCode: "SA", editionYear: 2024, role: "BOWL", battingStyle: "LHB", bowlingType: "FAST", ovr: 93, subRatings: { batting: 55, bowling: 94, paceOrTurn: 95, clutch: 93 }, tournamentStats: { runs: 14, ballsFaced: 12, strikeRate: 116.6, average: 7.0, wickets: 14, oversBowled: 33, economy: 6.27 } },
      { id: "sa_2024_david_miller", athleteId: "david_miller", name: "David Miller", countryCode: "SA", editionYear: 2024, role: "BAT", battingStyle: "LHB", bowlingType: "NONE", ovr: 91, subRatings: { batting: 92, bowling: 35, paceOrTurn: 35, clutch: 94 }, tournamentStats: { runs: 169, ballsFaced: 165, strikeRate: 102.4, average: 28.1, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "sa_2024_tabraiz_shamsi", athleteId: "tabraiz_shamsi", name: "Tabraiz Shamsi", countryCode: "SA", editionYear: 2024, role: "BOWL", battingStyle: "RHB", bowlingType: "SPIN_LEG", ovr: 91, subRatings: { batting: 40, bowling: 92, paceOrTurn: 93, clutch: 92 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 11, oversBowled: 19, economy: 7.15 } },
      { id: "sa_2024_marco_jansen", athleteId: "marco_jansen", name: "Marco Jansen", countryCode: "SA", editionYear: 2024, role: "AR", battingStyle: "RHB", bowlingType: "FAST", ovr: 88, subRatings: { batting: 78, bowling: 89, paceOrTurn: 91, clutch: 85 }, tournamentStats: { runs: 45, ballsFaced: 42, strikeRate: 107.1, average: 15.0, wickets: 8, oversBowled: 30, economy: 7.5 } },
      { id: "sa_2024_keshav_maharaj", athleteId: "keshav_maharaj", name: "Keshav Maharaj", countryCode: "SA", editionYear: 2024, role: "BOWL", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 89, subRatings: { batting: 60, bowling: 90, paceOrTurn: 89, clutch: 91 }, tournamentStats: { runs: 20, ballsFaced: 25, strikeRate: 80.0, average: 10.0, wickets: 11, oversBowled: 32, economy: 6.37 } },
      { id: "sa_2024_aiden_markram", athleteId: "aiden_markram", name: "Aiden Markram", countryCode: "SA", editionYear: 2024, role: "AR", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 87, subRatings: { batting: 88, bowling: 78, paceOrTurn: 78, clutch: 88 }, tournamentStats: { runs: 123, ballsFaced: 122, strikeRate: 100.8, average: 15.3, wickets: 1, oversBowled: 7, economy: 5.85 } },
      { id: "sa_2024_tristan_stubbs", athleteId: "tristan_stubbs", name: "Tristan Stubbs", countryCode: "SA", editionYear: 2024, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 86, subRatings: { batting: 88, bowling: 50, paceOrTurn: 50, clutch: 86 }, tournamentStats: { runs: 165, ballsFaced: 163, strikeRate: 101.2, average: 23.5, wickets: 1, oversBowled: 2, economy: 6.0 } },
      { id: "sa_2024_ottneil_baartman", athleteId: "ottneil_baartman", name: "Ottneil Baartman", countryCode: "SA", editionYear: 2024, role: "BOWL", battingStyle: "RHB", bowlingType: "MEDIUM", ovr: 86, subRatings: { batting: 40, bowling: 87, paceOrTurn: 84, clutch: 85 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 6, oversBowled: 19, economy: 4.94 } },
      { id: "sa_2024_reeza_hendricks", athleteId: "reeza_hendricks", name: "Reeza Hendricks", countryCode: "SA", editionYear: 2024, role: "BAT", battingStyle: "RHB", bowlingType: "NONE", ovr: 81, subRatings: { batting: 82, bowling: 35, paceOrTurn: 35, clutch: 80 }, tournamentStats: { runs: 113, ballsFaced: 130, strikeRate: 86.9, average: 12.5, wickets: 0, oversBowled: 0, economy: 0 } },
    ],
  },

  // 6. New Zealand 2021 (Runners-Up)
  {
    id: "squad_nz_2021",
    editionYear: 2021,
    teamName: "New Zealand (2021 Finalists)",
    countryCode: "NZ",
    isChampion: false,
    themeColor: "from-slate-700 to-black",
    roster: [
      { id: "nz_2021_kane_williamson", athleteId: "kane_williamson", name: "Kane Williamson", countryCode: "NZ", editionYear: 2021, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 96, subRatings: { batting: 97, bowling: 50, paceOrTurn: 50, clutch: 98 }, tournamentStats: { runs: 216, ballsFaced: 187, strikeRate: 115.5, average: 43.2, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "nz_2021_trent_boult", athleteId: "trent_boult", name: "Trent Boult", countryCode: "NZ", editionYear: 2021, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 95, subRatings: { batting: 45, bowling: 96, paceOrTurn: 95, clutch: 96 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 13, oversBowled: 27.4, economy: 6.25 } },
      { id: "nz_2021_daryl_mitchell", athleteId: "daryl_mitchell", name: "Daryl Mitchell", countryCode: "NZ", editionYear: 2021, role: "AR", battingStyle: "RHB", bowlingType: "MEDIUM", ovr: 93, subRatings: { batting: 94, bowling: 78, paceOrTurn: 78, clutch: 98 }, tournamentStats: { runs: 208, ballsFaced: 148, strikeRate: 140.5, average: 34.6, wickets: 0, oversBowled: 3, economy: 9.0 } },
      { id: "nz_2021_ish_sodhi", athleteId: "ish_sodhi", name: "Ish Sodhi", countryCode: "NZ", editionYear: 2021, role: "BOWL", battingStyle: "RHB", bowlingType: "SPIN_LEG", ovr: 91, subRatings: { batting: 45, bowling: 92, paceOrTurn: 92, clutch: 91 }, tournamentStats: { runs: 6, ballsFaced: 5, strikeRate: 120.0, average: 6.0, wickets: 9, oversBowled: 24, economy: 7.33 } },
      { id: "nz_2021_tim_southee", athleteId: "tim_southee", name: "Tim Southee", countryCode: "NZ", editionYear: 2021, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 91, subRatings: { batting: 60, bowling: 92, paceOrTurn: 90, clutch: 92 }, tournamentStats: { runs: 7, ballsFaced: 5, strikeRate: 140.0, average: 7.0, wickets: 8, oversBowled: 28, economy: 6.50 } },
      { id: "nz_2021_martin_guptill", athleteId: "martin_guptill", name: "Martin Guptill", countryCode: "NZ", editionYear: 2021, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 88, subRatings: { batting: 89, bowling: 40, paceOrTurn: 40, clutch: 88 }, tournamentStats: { runs: 208, ballsFaced: 172, strikeRate: 120.9, average: 29.7, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "nz_2021_devon_conway", athleteId: "devon_conway", name: "Devon Conway", countryCode: "NZ", editionYear: 2021, role: "WK", battingStyle: "LHB", bowlingType: "NONE", ovr: 89, subRatings: { batting: 90, bowling: 35, paceOrTurn: 35, clutch: 88 }, tournamentStats: { runs: 129, ballsFaced: 119, strikeRate: 108.4, average: 32.2, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "nz_2021_glenn_phillips", athleteId: "glenn_phillips", name: "Glenn Phillips", countryCode: "NZ", editionYear: 2021, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 86, subRatings: { batting: 87, bowling: 65, paceOrTurn: 65, clutch: 86 }, tournamentStats: { runs: 105, ballsFaced: 92, strikeRate: 114.1, average: 21.0, wickets: 0, oversBowled: 4, economy: 6.5 } },
      { id: "nz_2021_james_neesham", athleteId: "james_neesham", name: "James Neesham", countryCode: "NZ", editionYear: 2021, role: "AR", battingStyle: "LHB", bowlingType: "MEDIUM", ovr: 89, subRatings: { batting: 90, bowling: 84, paceOrTurn: 84, clutch: 95 }, tournamentStats: { runs: 86, ballsFaced: 49, strikeRate: 175.5, average: 43.0, wickets: 3, oversBowled: 12, economy: 7.41 } },
      { id: "nz_2021_mitchell_santner", athleteId: "mitchell_santner", name: "Mitchell Santner", countryCode: "NZ", editionYear: 2021, role: "AR", battingStyle: "LHB", bowlingType: "SPIN_OFF", ovr: 87, subRatings: { batting: 75, bowling: 89, paceOrTurn: 89, clutch: 87 }, tournamentStats: { runs: 15, ballsFaced: 12, strikeRate: 125.0, average: 15.0, wickets: 2, oversBowled: 19, economy: 6.47 } },
      { id: "nz_2021_adam_milne", athleteId: "adam_milne", name: "Adam Milne", countryCode: "NZ", editionYear: 2021, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 85, subRatings: { batting: 40, bowling: 86, paceOrTurn: 94, clutch: 85 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 3, oversBowled: 17, economy: 7.23 } },
      { id: "nz_2021_tim_seifert", athleteId: "tim_seifert", name: "Tim Seifert", countryCode: "NZ", editionYear: 2021, role: "WK", battingStyle: "RHB", bowlingType: "NONE", ovr: 80, subRatings: { batting: 81, bowling: 35, paceOrTurn: 35, clutch: 80 }, tournamentStats: { runs: 8, ballsFaced: 6, strikeRate: 133.3, average: 8.0, wickets: 0, oversBowled: 0, economy: 0 } },
    ],
  },

  // 7. USA 2024 (Historic Super 8 Breakout Squad)
  {
    id: "squad_usa_2024",
    editionYear: 2024,
    teamName: "USA (2024 Super 8 Breakout)",
    countryCode: "USA",
    isChampion: false,
    themeColor: "from-blue-700 via-red-600 to-slate-900",
    roster: [
      { id: "usa_2024_aaron_jones", athleteId: "aaron_jones", name: "Aaron Jones", countryCode: "USA", editionYear: 2024, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_LEG", ovr: 92, subRatings: { batting: 94, bowling: 50, paceOrTurn: 50, clutch: 95 }, tournamentStats: { runs: 162, ballsFaced: 120, strikeRate: 135.0, average: 40.5, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "usa_2024_saurabh_netravalkar", athleteId: "saurabh_netravalkar", name: "Saurabh Netravalkar", countryCode: "USA", editionYear: 2024, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 93, subRatings: { batting: 45, bowling: 94, paceOrTurn: 90, clutch: 98 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 6, oversBowled: 21, economy: 6.61 } },
      { id: "usa_2024_andries_gous", athleteId: "andries_gous", name: "Andries Gous", countryCode: "USA", editionYear: 2024, role: "WK", battingStyle: "RHB", bowlingType: "NONE", ovr: 91, subRatings: { batting: 92, bowling: 35, paceOrTurn: 35, clutch: 91 }, tournamentStats: { runs: 219, ballsFaced: 162, strikeRate: 135.1, average: 43.8, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "usa_2024_ali_khan", athleteId: "ali_khan", name: "Ali Khan", countryCode: "USA", editionYear: 2024, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 88, subRatings: { batting: 45, bowling: 89, paceOrTurn: 93, clutch: 91 }, tournamentStats: { runs: 14, ballsFaced: 8, strikeRate: 175.0, average: 14.0, wickets: 3, oversBowled: 19, economy: 8.1 } },
      { id: "usa_2024_harmeet_singh", athleteId: "harmeet_singh", name: "Harmeet Singh", countryCode: "USA", editionYear: 2024, role: "AR", battingStyle: "LHB", bowlingType: "SPIN_OFF", ovr: 89, subRatings: { batting: 88, bowling: 89, paceOrTurn: 89, clutch: 91 }, tournamentStats: { runs: 82, ballsFaced: 65, strikeRate: 126.1, average: 20.5, wickets: 3, oversBowled: 16, economy: 7.2 } },
      { id: "usa_2024_monank_patel", athleteId: "monank_patel", name: "Monank Patel", countryCode: "USA", editionYear: 2024, role: "WK", battingStyle: "RHB", bowlingType: "NONE", ovr: 86, subRatings: { batting: 87, bowling: 35, paceOrTurn: 35, clutch: 90 }, tournamentStats: { runs: 66, ballsFaced: 52, strikeRate: 126.9, average: 66.0, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "usa_2024_corey_anderson", athleteId: "corey_anderson", name: "Corey Anderson", countryCode: "USA", editionYear: 2024, role: "AR", battingStyle: "LHB", bowlingType: "FAST", ovr: 84, subRatings: { batting: 85, bowling: 81, paceOrTurn: 82, clutch: 84 }, tournamentStats: { runs: 66, ballsFaced: 70, strikeRate: 94.2, average: 16.5, wickets: 1, oversBowled: 7, economy: 8.2 } },
      { id: "usa_2024_steven_taylor", athleteId: "steven_taylor", name: "Steven Taylor", countryCode: "USA", editionYear: 2024, role: "BAT", battingStyle: "LHB", bowlingType: "SPIN_OFF", ovr: 81, subRatings: { batting: 82, bowling: 65, paceOrTurn: 65, clutch: 80 }, tournamentStats: { runs: 56, ballsFaced: 55, strikeRate: 101.8, average: 11.2, wickets: 0, oversBowled: 3, economy: 8.0 } },
      { id: "usa_2024_nitish_kumar", athleteId: "nitish_kumar", name: "Nitish Kumar", countryCode: "USA", editionYear: 2024, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 84, subRatings: { batting: 85, bowling: 60, paceOrTurn: 60, clutch: 92 }, tournamentStats: { runs: 76, ballsFaced: 62, strikeRate: 122.5, average: 19.0, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "usa_2024_jasdeep_singh", athleteId: "jasdeep_singh", name: "Jasdeep Singh", countryCode: "USA", editionYear: 2024, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 80, subRatings: { batting: 45, bowling: 81, paceOrTurn: 83, clutch: 80 }, tournamentStats: { runs: 2, ballsFaced: 3, strikeRate: 66.6, average: 2.0, wickets: 2, oversBowled: 11, economy: 8.8 } },
      { id: "usa_2024_nosthush_kenjige", athleteId: "nosthush_kenjige", name: "Nosthush Kenjige", countryCode: "USA", editionYear: 2024, role: "BOWL", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 85, subRatings: { batting: 40, bowling: 86, paceOrTurn: 86, clutch: 90 }, tournamentStats: { runs: 1, ballsFaced: 2, strikeRate: 50.0, average: 1.0, wickets: 3, oversBowled: 10, economy: 7.9 } },
      { id: "usa_2024_shayan_jahangir", athleteId: "shayan_jahangir", name: "Shayan Jahangir", countryCode: "USA", editionYear: 2024, role: "WK", battingStyle: "RHB", bowlingType: "NONE", ovr: 78, subRatings: { batting: 79, bowling: 35, paceOrTurn: 35, clutch: 78 }, tournamentStats: { runs: 15, ballsFaced: 20, strikeRate: 75.0, average: 7.5, wickets: 0, oversBowled: 0, economy: 0 } },
    ],
  },

  // 8. Netherlands 2022 (Super 12 Giantslayer Squad)
  {
    id: "squad_ned_2022",
    editionYear: 2022,
    teamName: "Netherlands (2022 Giantslayers)",
    countryCode: "NED",
    isChampion: false,
    themeColor: "from-orange-600 to-amber-700",
    roster: [
      { id: "ned_2022_bas_de_leede", athleteId: "bas_de_leede", name: "Bas de Leede", countryCode: "NED", editionYear: 2022, role: "AR", battingStyle: "RHB", bowlingType: "FAST", ovr: 92, subRatings: { batting: 90, bowling: 92, paceOrTurn: 90, clutch: 96 }, tournamentStats: { runs: 147, ballsFaced: 142, strikeRate: 103.5, average: 24.5, wickets: 13, oversBowled: 26, economy: 7.68 } },
      { id: "ned_2022_paul_van_meekeren", athleteId: "paul_van_meekeren", name: "Paul van Meekeren", countryCode: "NED", editionYear: 2022, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 90, subRatings: { batting: 45, bowling: 91, paceOrTurn: 94, clutch: 93 }, tournamentStats: { runs: 25, ballsFaced: 20, strikeRate: 125.0, average: 8.3, wickets: 11, oversBowled: 29, economy: 6.37 } },
      { id: "ned_2022_max_odowd", athleteId: "max_odowd", name: "Max O'Dowd", countryCode: "NED", editionYear: 2022, role: "BAT", battingStyle: "RHB", bowlingType: "NONE", ovr: 90, subRatings: { batting: 91, bowling: 40, paceOrTurn: 40, clutch: 90 }, tournamentStats: { runs: 242, ballsFaced: 215, strikeRate: 112.5, average: 34.5, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "ned_2022_scott_edwards", athleteId: "scott_edwards", name: "Scott Edwards", countryCode: "NED", editionYear: 2022, role: "WK", battingStyle: "RHB", bowlingType: "NONE", ovr: 87, subRatings: { batting: 88, bowling: 35, paceOrTurn: 35, clutch: 89 }, tournamentStats: { runs: 147, ballsFaced: 132, strikeRate: 111.3, average: 24.5, wickets: 0, oversBowled: 0, economy: 0 } },
      { id: "ned_2022_colin_ackermann", athleteId: "colin_ackermann", name: "Colin Ackermann", countryCode: "NED", editionYear: 2022, role: "AR", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 89, subRatings: { batting: 89, bowling: 84, paceOrTurn: 84, clutch: 93 }, tournamentStats: { runs: 166, ballsFaced: 136, strikeRate: 122.0, average: 27.6, wickets: 1, oversBowled: 8, economy: 6.75 } },
      { id: "ned_2022_fred_klaassen", athleteId: "fred_klaassen", name: "Fred Klaassen", countryCode: "NED", editionYear: 2022, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 86, subRatings: { batting: 45, bowling: 87, paceOrTurn: 86, clutch: 86 }, tournamentStats: { runs: 6, ballsFaced: 10, strikeRate: 60.0, average: 3.0, wickets: 8, oversBowled: 29, economy: 7.1 } },
      { id: "ned_2022_tim_pringle", athleteId: "tim_pringle", name: "Tim Pringle", countryCode: "NED", editionYear: 2022, role: "AR", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 83, subRatings: { batting: 75, bowling: 84, paceOrTurn: 84, clutch: 83 }, tournamentStats: { runs: 42, ballsFaced: 48, strikeRate: 87.5, average: 10.5, wickets: 3, oversBowled: 23, economy: 6.91 } },
      { id: "ned_2022_roelof_van_der_merwe", athleteId: "roelof_van_der_merwe", name: "Roelof van der Merwe", countryCode: "NED", editionYear: 2022, role: "AR", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 87, subRatings: { batting: 84, bowling: 88, paceOrTurn: 88, clutch: 95 }, tournamentStats: { runs: 30, ballsFaced: 25, strikeRate: 120.0, average: 15.0, wickets: 3, oversBowled: 14, economy: 6.28 } },
      { id: "ned_2022_tom_cooper", athleteId: "tom_cooper", name: "Tom Cooper", countryCode: "NED", editionYear: 2022, role: "BAT", battingStyle: "RHB", bowlingType: "SPIN_OFF", ovr: 84, subRatings: { batting: 85, bowling: 60, paceOrTurn: 60, clutch: 88 }, tournamentStats: { runs: 143, ballsFaced: 110, strikeRate: 130.0, average: 20.4, wickets: 0, oversBowled: 2, economy: 9.0 } },
      { id: "ned_2022_logan_van_beek", athleteId: "logan_van_beek", name: "Logan van Beek", countryCode: "NED", editionYear: 2022, role: "AR", battingStyle: "RHB", bowlingType: "FAST", ovr: 86, subRatings: { batting: 82, bowling: 87, paceOrTurn: 87, clutch: 89 }, tournamentStats: { runs: 35, ballsFaced: 30, strikeRate: 116.6, average: 11.6, wickets: 5, oversBowled: 18, economy: 7.8 } },
      { id: "ned_2022_brandon_glover", athleteId: "brandon_glover", name: "Brandon Glover", countryCode: "NED", editionYear: 2022, role: "BOWL", battingStyle: "RHB", bowlingType: "FAST", ovr: 87, subRatings: { batting: 40, bowling: 88, paceOrTurn: 93, clutch: 94 }, tournamentStats: { runs: 0, ballsFaced: 0, strikeRate: 0, average: 0, wickets: 7, oversBowled: 11.4, economy: 6.85 } },
      { id: "ned_2022_stephan_myburgh", athleteId: "stephan_myburgh", name: "Stephan Myburgh", countryCode: "NED", editionYear: 2022, role: "BAT", battingStyle: "LHB", bowlingType: "NONE", ovr: 82, subRatings: { batting: 83, bowling: 35, paceOrTurn: 35, clutch: 85 }, tournamentStats: { runs: 90, ballsFaced: 85, strikeRate: 105.8, average: 18.0, wickets: 0, oversBowled: 0, economy: 0 } },
    ],
  },
];
