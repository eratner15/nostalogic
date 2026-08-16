export type PropertyCategory =
  | "Movie"
  | "TV"
  | "Music"
  | "Video Game"
  | "Toy/Fad"
  | "Tech"
  | "Sports/Media";

export type RebootType = "Movie" | "TV Show" | "Video Game" | "Toys" | "Streaming Series" | "Live Event";

export type TimingStage = "Pre-Peak" | "Sweet Spot" | "Mature";

export interface Property {
  id: string;
  name: string;
  year: number; // 1993-1998, the confirmed window
  category: PropertyCategory;
  genre: string;
  originalImpact: number;
  modernRelevance: number;
  socialBuzz: number;
  rightsComplexity: number;
  creatorAvailability: number;
  briefDescription: string;
  coreAudience: string;
  currentSignal: string;
  revivalFormat: string;
  tags: string[];
  preserve: string[];
  update: string[];
}

export interface PropertyScore extends Property {
  rank: number;
  nostalgiaAlignment: number;
  revivalReadinessScore: number;
  riskScore: number;
  timingStage: TimingStage;
  targetAudienceAge: number;
  launchWindow: string;
  recommendation: string;
}

export interface PropertyFilters {
  category?: PropertyCategory | "All";
  year?: string;
  query?: string;
  timing?: TimingStage | "All";
}

const CURRENT_YEAR = 2026;
const PEAK_CHILDHOOD_AGE = 12;
const SWEET_SPOT_CENTER = 40;

const slug = (name: string, year: number) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${year}`;

const p = (
  name: string,
  year: number,
  category: PropertyCategory,
  genre: string,
  originalImpact: number,
  modernRelevance: number,
  socialBuzz: number,
  rightsComplexity: number,
  creatorAvailability: number,
  briefDescription: string,
  coreAudience: string,
  currentSignal: string,
  revivalFormat: string,
  tags: string[],
  preserve: string[],
  update: string[]
): Property => ({
  id: slug(name, year),
  name,
  year,
  category,
  genre,
  originalImpact,
  modernRelevance,
  socialBuzz,
  rightsComplexity,
  creatorAvailability,
  briefDescription,
  coreAudience,
  currentSignal,
  revivalFormat,
  tags,
  preserve,
  update,
});

export const properties: Property[] = [
  p("The Lion King", 1994, "Movie", "Animated musical", 99, 96, 92, 28, 72, "A mythic coming-of-age story with multigenerational awareness and evergreen music.", "Millennials, parents, animation families", "Stage longevity, music virality, remake memory", "premium animated anthology or theatrical event", ["family", "music", "animals", "legacy"], ["circle-of-life mythology", "music", "family stakes"], ["fresh visual language", "ecological lens", "global casting"]),
  p("Pulp Fiction", 1994, "Movie", "Crime", 97, 88, 82, 74, 55, "Nonlinear crime pop culture that rewired dialogue, editing, and soundtrack grammar.", "Gen X, elder millennials, cinephiles", "Memes, quote culture, collector screenings", "limited-series crime universe", ["crime", "auteur", "soundtrack"], ["nonlinear structure", "verbal tension", "cool soundtrack"], ["modern moral frame", "new city", "diverse ensemble"]),
  p("Forrest Gump", 1994, "Movie", "Drama", 96, 72, 58, 43, 48, "A sentimental American life story attached to historic milestones and quotable optimism.", "Broad four-quadrant adults", "Debate cycles and comfort-viewing", "legacy sequel or anthology of ordinary lives", ["americana", "drama", "history"], ["emotional sweep", "historical touchpoints", "sincerity"], ["less simplistic politics", "multi-perspective history", "contemporary framing"]),
  p("The Mask", 1994, "Movie", "Superhero comedy", 90, 82, 78, 46, 64, "A cartoon-logic star vehicle with elastic comedy and visual transformation hooks.", "Millennials, comedy fans, superhero audiences", "Cosplay, meme reaction faces, comic-book nostalgia", "PG-13 comedy franchise reboot", ["comedy", "superhero", "vfx"], ["transformative mask", "physical comedy", "noir nightclub energy"], ["new wearer", "modern effects restraint", "creator-economy chaos"]),
  p("The Crow", 1994, "Movie", "Goth action", 86, 78, 69, 64, 42, "A dark revenge romance with gothic aesthetics and cult emotional weight.", "Alt culture, comic fans, action-horror fans", "Goth fashion revival and soundtrack nostalgia", "prestige supernatural revenge series", ["goth", "action", "cult"], ["tragic romance", "rain-soaked city", "vengeful myth"], ["avoid imitation", "expand mythology", "modern grief psychology"]),
  p("Speed", 1994, "Movie", "Action thriller", 88, 77, 66, 36, 58, "A clean high-concept action machine built around one impossible public-safety constraint.", "Action fans, disaster-thriller fans", "High-concept thriller conversations", "contained real-time streaming film", ["action", "transport", "thriller"], ["simple ticking clock", "practical tension", "everyday infrastructure"], ["ride-share era systems", "urban surveillance", "new ensemble"]),
  p("The Shawshank Redemption", 1994, "Movie", "Drama", 93, 91, 74, 52, 38, "A long-tail cable classic about hope, institutional survival, and friendship.", "Adults, prestige drama fans", "Perennial top-film lists and streaming discovery", "prestige limited prequel or spiritual anthology", ["prestige", "prison", "friendship"], ["hopeful emotional core", "voiceover intimacy", "earned catharsis"], ["avoid direct sequel", "justice-system nuance", "new institution"]),
  p("Dumb and Dumber", 1994, "Movie", "Comedy", 88, 74, 70, 42, 62, "Broad physical comedy with instantly recognizable costumes and repeatable bits.", "Millennials, comedy audiences", "GIFs, Halloween costumes, road-trip nostalgia", "low-budget buddy comedy relaunch", ["comedy", "road", "buddy"], ["idiot optimism", "road-trip structure", "visual gags"], ["shorter pacing", "new duo", "avoid cruelty"]),
  p("Ace Ventura: Pet Detective", 1994, "Movie", "Comedy mystery", 85, 55, 62, 54, 33, "A catchphrase-heavy detective comedy with major star dependence and sensitivity risk.", "Comedy nostalgists", "Meme recognition with reputational friction", "reimagined eccentric investigator series", ["comedy", "detective", "animals"], ["absurd clue-solving", "big physicality", "case-of-week"], ["inclusive humor", "new lead", "less shock comedy"]),
  p("Interview with the Vampire", 1994, "Movie", "Gothic horror", 85, 86, 76, 48, 68, "A lush immortal melodrama with fandom-friendly character dynamics.", "Horror, fantasy, romance fans", "Vampire cycles, prestige TV adaptation momentum", "expanded gothic universe", ["vampire", "romance", "horror"], ["sensual dread", "immortality angst", "period richness"], ["global settings", "deeper character agency", "serialized plotting"]),
  p("Toy Story", 1995, "Movie", "Animated adventure", 100, 98, 94, 18, 80, "The CG animation inflection point and a durable friendship engine.", "Families, animation fans, millennials", "Franchise strength and generational handoff", "theatrical continuation or interactive experience", ["family", "toys", "animation"], ["toy point of view", "friendship jealousy", "emotional maturity"], ["AI-era toy anxieties", "new child household", "mixed-media play"]),
  p("Se7en", 1995, "Movie", "Crime thriller", 92, 84, 76, 49, 53, "A grim procedural with iconic structure and a twist ending embedded in culture.", "Thriller fans, true-crime audiences", "Prestige crime appetite and ending discourse", "anthology detective miniseries", ["crime", "thriller", "noir"], ["moral dread", "rainy city", "investigator contrast"], ["avoid copycat killer glamor", "modern forensic limits", "fresh sin taxonomy"]),
  p("Clueless", 1995, "Movie", "Teen comedy", 88, 93, 86, 39, 70, "A fashion-forward teen satire with linguistic, retail, and social status staying power.", "Millennial women, Gen Z fashion audiences", "TikTok fashion loops and quotable scenes", "streaming teen series", ["teen", "fashion", "comedy"], ["optimistic heroine", "social makeover engine", "style vocabulary"], ["platform status games", "new school diversity", "creator-economy retail"]),
  p("Jumanji", 1995, "Movie", "Family adventure", 89, 90, 84, 24, 72, "A magical game premise that naturally mutates across formats and generations.", "Families, adventure fans, gamers", "Successful relaunch proof and game nostalgia", "immersive streaming-game hybrid", ["family", "game", "adventure"], ["dangerous game rules", "ensemble survival", "wish fulfillment"], ["AR mechanics", "global folklore boards", "co-op strategy"]),
  p("Braveheart", 1995, "Movie", "Historical epic", 87, 61, 48, 58, 35, "A rousing historical epic with scale, speeches, and accuracy controversy.", "Epic-action fans", "Occasional quote revivals and prestige-battle appetite", "historical anthology reframing", ["history", "war", "epic"], ["scale", "rebellion stakes", "battle spectacle"], ["historical correction", "multi-faction view", "less savior framing"]),
  p("Apollo 13", 1995, "Movie", "Historical drama", 88, 80, 57, 31, 52, "Competence-core disaster drama about engineers, astronauts, and institutional calm.", "Adults, space fans, STEM audiences", "Space-economy resurgence", "prestige mission-control limited series", ["space", "history", "teamwork"], ["problem-solving", "procedural tension", "ensemble competence"], ["private-space parallels", "women in mission control", "modern visualizations"]),
  p("Batman Forever", 1995, "Movie", "Superhero", 83, 74, 72, 20, 68, "Neon comic maximalism from a superhero era now ripe for ironic reappraisal.", "Comic fans, millennial nostalgists", "Camp Batman discourse and toy-line nostalgia", "stylized Elseworlds miniseries", ["superhero", "camp", "neon"], ["goth-pop city", "villain theatricality", "Robin mentorship"], ["self-aware tone", "tighter story", "modern queer-coded nuance"]),
  p("GoldenEye", 1995, "Movie", "Spy action", 86, 86, 79, 26, 61, "A Bond relaunch and a gaming-memory anchor for a generation.", "Action fans, gamers, Bond fans", "N64 multiplayer nostalgia and Bond recasting cycles", "spy thriller game-series tie-in", ["spy", "action", "game"], ["post-Cold War paranoia", "gadget elegance", "facility infiltration"], ["cyber warfare", "female agency", "online co-op"]),
  p("Casper", 1995, "Movie", "Family fantasy", 78, 72, 60, 42, 56, "A friendly ghost brand with melancholy, Halloween utility, and family rewatch value.", "Families, spooky-season audiences", "Seasonal streaming and soft-horror demand", "family supernatural series", ["family", "ghost", "halloween"], ["kind ghost", "haunted-house warmth", "grief tenderness"], ["new family dynamic", "practical ghost rules", "less celebrity cameo reliance"]),
  p("Heat", 1995, "Movie", "Crime drama", 94, 89, 82, 45, 44, "A definitive cops-and-robbers epic with professional obsession and urban cool.", "Adult thriller fans, cinephiles", "Legacy sequel novel attention and crime-thriller demand", "prestige prequel/sequel event series", ["crime", "heist", "prestige"], ["professional codes", "LA sprawl", "tactical realism"], ["new crews", "financial crime", "surveillance-state heat"]),
  p("Independence Day", 1996, "Movie", "Sci-fi disaster", 93, 81, 77, 32, 60, "A patriotic alien-invasion blockbuster with spectacle, speeches, and ensemble survival.", "Action families, sci-fi fans", "Disaster movie cycles and alien UAP curiosity", "global invasion event series", ["alien", "disaster", "action"], ["ensemble countdown", "massive set pieces", "human unity"], ["less nationalism", "climate-disaster parallels", "international leads"]),
  p("Scream", 1996, "Movie", "Horror", 92, 94, 91, 23, 78, "Meta-slasher grammar with unusually durable rules, masks, and generational refresh capacity.", "Horror fans, Gen Z, millennials", "Recent franchise momentum and social horror appetite", "next-gen horror mystery series", ["horror", "meta", "slasher"], ["rules discourse", "whodunit tension", "masked iconography"], ["online parasocial stakes", "true-crime critique", "new survivor circle"]),
  p("Space Jam", 1996, "Movie", "Sports comedy", 84, 82, 80, 25, 69, "A sports-animation mashup with merchandising gravity and NBA mythology.", "Basketball fans, families, sneaker culture", "Athlete media companies and Looney Tunes recognition", "live sports animated tournament special", ["sports", "animation", "basketball"], ["athlete-meets-toons premise", "court spectacle", "soundtrack energy"], ["women's game", "global basketball", "interactive streaming stats"]),
  p("Trainspotting", 1996, "Movie", "Dark comedy drama", 86, 76, 64, 57, 48, "A kinetic youth-culture anti-glamor story with style, music, and addiction risk.", "Indie film fans, music culture", "90s fashion and soundtrack rediscovery", "limited series about a new subculture", ["indie", "music", "youth"], ["voiceover velocity", "friend-group chaos", "music identity"], ["harm reduction lens", "modern economy pressure", "avoid addiction chic"]),
  p("Romeo + Juliet", 1996, "Movie", "Romantic drama", 84, 85, 82, 33, 58, "A Shakespeare adaptation that made classical text feel like MTV-era pop opera.", "Millennials, theater students, romance fans", "Y2K fashion and stylized romance revival", "visual anthology of classic texts", ["romance", "shakespeare", "style"], ["heightened language", "youthful urgency", "music-video grammar"], ["new city tribe logic", "modern gender dynamics", "interactive classroom cuts"]),
  p("Mission: Impossible", 1996, "Movie", "Spy action", 90, 95, 86, 16, 75, "A franchise launch built on betrayal paranoia, impossible set pieces, and star commitment.", "Action fans, global audiences", "Ongoing franchise halo", "streaming IMF side-team series", ["spy", "action", "stunts"], ["team deception", "practical stunts", "mask reveals"], ["ensemble depth", "AI espionage", "lower-scale missions"]),
  p("Twister", 1996, "Movie", "Disaster", 85, 83, 74, 28, 66, "A storm-chasing spectacle with weather anxiety and tactile field-science appeal.", "Disaster fans, weather obsessives", "Climate volatility and sequel momentum", "storm-chaser series or immersive attraction", ["weather", "disaster", "science"], ["field team camaraderie", "tornado awe", "chase logistics"], ["climate context", "modern radar tech", "safer spectacle"]),
  p("Jerry Maguire", 1996, "Movie", "Sports romance", 82, 72, 62, 44, 45, "A sports-agent redemption story with quotable romance and business ethics tension.", "Adults, sports fans", "Agent economy, athlete branding, quote culture", "sports-business limited series", ["sports", "romance", "business"], ["mission statement", "athlete-agent loyalty", "romantic vulnerability"], ["NIL economy", "women athletes", "less savior arc"]),
  p("Mars Attacks!", 1996, "Movie", "Sci-fi comedy", 76, 78, 70, 41, 52, "A cult alien satire with trading-card weirdness and elastic B-movie comedy.", "Cult film fans, sci-fi comedy audiences", "Retro kitsch and collectible culture", "adult animated invasion satire", ["alien", "satire", "cult"], ["absurd aliens", "ensemble chaos", "retro cards"], ["sharper media satire", "animation freedom", "global vignettes"]),
  p("The Rock", 1996, "Movie", "Action thriller", 86, 74, 65, 38, 44, "A maximalist siege thriller with practical stakes, military secrets, and odd-couple leads.", "Action fans", "90s action reappraisal", "contained military conspiracy film", ["action", "military", "siege"], ["odd-couple competence", "island siege", "moral villain"], ["biotech security", "less macho excess", "new specialist lead"]),
  p("Stargate", 1994, "Movie", "Sci-fi adventure", 83, 84, 73, 34, 59, "A portal-to-ancient-worlds premise that already proved expandable across television.", "Sci-fi fans, mythology audiences", "Streaming sci-fi demand and franchise-world appetite", "prestige exploration series", ["sci-fi", "portal", "myth"], ["ancient-tech mystery", "team expedition", "portal travel"], ["less colonial framing", "global archaeology", "harder science rules"]),
  p("True Lies", 1994, "Movie", "Action comedy", 84, 69, 55, 39, 36, "A domestic spy farce with major set pieces and marital-secret comedy.", "Action-comedy fans", "Spy comedy cycles and 90s action nostalgia", "couples espionage series", ["spy", "comedy", "action"], ["domestic double life", "stunt spectacle", "marital farce"], ["gender balance", "less xenophobia", "modern surveillance stakes"]),
  p("The Santa Clause", 1994, "Movie", "Holiday family", 82, 82, 75, 22, 61, "A holiday succession comedy with durable seasonal utility.", "Families, millennial parents", "Annual streaming cycles and holiday franchise appetite", "limited holiday event series", ["holiday", "family", "fantasy"], ["ordinary parent becomes myth", "North Pole rules", "family reconciliation"], ["modern co-parenting", "global holiday lore", "less sitcom broadness"]),
  p("Natural Born Killers", 1994, "Movie", "Crime satire", 78, 70, 58, 61, 34, "A media-violence satire whose form is still volatile and culturally charged.", "Cult film fans, media critics", "True-crime and platform sensationalism debate", "limited media-satire series", ["crime", "satire", "media"], ["media critique", "hallucinatory form", "fame toxicity"], ["avoid glamorization", "platform algorithms", "victim-centered framing"]),
  p("Bad Boys", 1995, "Movie", "Buddy action", 86, 82, 76, 18, 70, "A buddy-cop brand built on chemistry, Miami gloss, and explosive comic swagger.", "Action fans, franchise audiences", "Recent sequel momentum and buddy-action nostalgia", "younger-team spinoff", ["action", "buddy", "miami"], ["lead chemistry", "Miami energy", "comic danger"], ["new detectives", "tighter stakes", "procedural relevance"]),
  p("Mortal Kombat", 1995, "Movie", "Game adaptation", 82, 86, 81, 20, 69, "A game-to-film milestone with tournament clarity and soundtrack memory.", "Gamers, action fans", "Ongoing game franchise and R-rated adaptation demand", "tournament event film", ["game", "film", "fighting"], ["tournament structure", "theme music", "realm mythology"], ["better fights", "character depth", "earned gore"]),
  p("Pocahontas", 1995, "Movie", "Animated musical", 82, 58, 47, 24, 49, "A major animated musical with high awareness and high cultural correction needs.", "Disney fans, family audiences", "Representation reassessment and soundtrack memory", "historical reframing documentary or inspired musical", ["animation", "music", "history"], ["music craft", "nature imagery", "romantic sweep"], ["historical accountability", "Native authorship", "avoid romance myth"]),
  p("The Usual Suspects", 1995, "Movie", "Crime mystery", 88, 69, 61, 63, 21, "A twist-driven crime puzzle with durable ending recognition and reputational obstacles.", "Thriller fans, cinephiles", "Mystery-box demand with creator risk", "new-criminal-myth anthology", ["crime", "mystery", "twist"], ["unreliable narration", "interrogation frame", "mythic villain"], ["new creative team", "less twist dependence", "procedural ethics"]),
  p("Babe", 1995, "Movie", "Family comedy", 84, 82, 63, 28, 50, "A gentle talking-animal underdog story with rare cross-generational warmth.", "Families, animal lovers", "Cozy family viewing and practical-animal nostalgia", "premium family feature", ["family", "animals", "farm"], ["kind underdog", "farm community", "gentle humor"], ["animal welfare lens", "modern farm economics", "subtle effects"]),
  p("The Craft", 1996, "Movie", "Teen supernatural", 81, 89, 84, 30, 66, "Teen witch power fantasy with fashion, outsider identity, and coven dynamics.", "Millennial women, Gen Z witchcore fans", "Witchcore, alt fashion, teen horror resurgence", "prestige teen coven series", ["witch", "teen", "horror"], ["coven friendship", "outsider power", "goth fashion"], ["intersectional coven", "social media consequences", "responsible magic ethics"]),
  p("Matilda", 1996, "Movie", "Family fantasy", 86, 90, 84, 24, 69, "A smart-kid liberation fantasy with school cruelty, found family, and telekinetic wish fulfillment.", "Families, theater fans, book lovers", "Stage musical awareness and comfort nostalgia", "family limited series", ["family", "books", "magic"], ["brilliant child POV", "found family", "bookish rebellion"], ["modern school pressure", "more child agency", "warm visual magic"]),
  p("From Dusk Till Dawn", 1996, "Movie", "Crime horror", 80, 76, 68, 51, 45, "A sharp genre-switch cult film with vampire bar iconography.", "Horror fans, cult-action audiences", "Vampire cycles and grindhouse nostalgia", "contained horror-crime anthology", ["horror", "vampire", "crime"], ["midpoint genre turn", "desert bar", "survival siege"], ["new filmmaker voice", "less exploitation gaze", "regional folklore"]),

  p("Friends", 1994, "TV", "Sitcom", 98, 89, 90, 28, 65, "The apartment sitcom template for chosen-family comfort viewing.", "Millennials, Gen Z comfort-TV audiences", "Streaming endurance and fashion loops", "limited reunion story or new-neighbor spinoff", ["sitcom", "friendship", "nyc"], ["chosen family", "hangout rhythm", "romantic tension"], ["economic realism", "more representative city", "shorter seasons"]),
  p("ER", 1994, "TV", "Medical drama", 93, 80, 57, 36, 52, "High-velocity hospital drama that made procedural intensity cinematic.", "Adults, procedural fans", "Medical-worker respect and network drama nostalgia", "prestige hospital limited series", ["medical", "procedural", "ensemble"], ["real-time pressure", "teaching hospital", "rotating ensemble"], ["post-pandemic burnout", "health inequity", "new resident class"]),
  p("My So-Called Life", 1994, "TV", "Teen drama", 82, 86, 72, 44, 50, "A short-lived teen interiority classic with enduring authenticity.", "Millennial women, teen drama fans", "Claire Danes nostalgia and teen sincerity demand", "sequel about parenting teens", ["teen", "drama", "cult"], ["inner monologue", "awkward realism", "family empathy"], ["social media texture", "queer/trans teen depth", "no glossy reset"]),
  p("Party of Five", 1994, "TV", "Family drama", 79, 69, 45, 42, 46, "A sibling-survival melodrama about grief, responsibility, and found adulthood.", "Family drama audiences", "Economic precarity and sibling-household stories", "limited family-drama reboot", ["family", "drama", "grief"], ["siblings raising siblings", "messy responsibility", "emotional stakes"], ["new cause of loss", "modern support systems", "less melodrama padding"]),
  p("Spider-Man: The Animated Series", 1994, "TV", "Animated superhero", 88, 96, 90, 18, 73, "A definitive Saturday-morning superhero text for millennial Marvel fans.", "Marvel fans, animation fans", "Spider-Verse success and 90s animation nostalgia", "animated continuation", ["superhero", "animation", "marvel"], ["street-level morality", "rogues gallery", "serialized arcs"], ["modern animation", "multiverse restraint", "adult fan layer"]),
  p("The X-Files", 1995, "TV", "Sci-fi mystery", 94, 91, 86, 30, 64, "Paranoia, monsters, and romantic investigative chemistry in peak form.", "Sci-fi fans, conspiracy-thriller audiences", "Institutional mistrust and monster-of-week hunger", "new-cell investigative series", ["sci-fi", "mystery", "procedural"], ["skeptic/believer tension", "case files", "slow-burn intimacy"], ["misinformation literacy", "AI/UAP cases", "new agents"]),
  p("Star Trek: Voyager", 1995, "TV", "Sci-fi", 86, 83, 70, 19, 63, "A stranded-ship survival format with a landmark woman captain.", "Trek fans, sci-fi streamers", "Streaming Trek ecosystem", "serialized survival sequel", ["space", "sci-fi", "ensemble"], ["lost ship premise", "ethical command", "found crew"], ["tighter serialization", "resource scarcity", "new quadrant politics"]),
  p("Pinky and the Brain", 1995, "TV", "Animated comedy", 82, 76, 66, 35, 55, "A simple world-domination comedy with perfect repeatable character contrast.", "Animation fans, families", "Meme-ready catchphrases", "short-form animated revival", ["animation", "comedy", "catchphrase"], ["tiny schemes", "duo contrast", "repetition with variation"], ["modern tech plots", "short episodes", "less formula fatigue"]),
  p("Hercules: The Legendary Journeys", 1995, "TV", "Fantasy adventure", 75, 66, 44, 46, 40, "Syndicated myth adventure with camp, monsters, and modular quests.", "Fantasy fans, syndication nostalgists", "Myth remixes and low-stakes adventure appetite", "mythic adventure streamer", ["fantasy", "myth", "adventure"], ["quest format", "camp charm", "myth monsters"], ["broader mythologies", "modern action design", "stronger arcs"]),
  p("Sabrina the Teenage Witch", 1996, "TV", "Fantasy sitcom", 82, 83, 76, 29, 68, "A magical teen sitcom with a talking-cat icon and clean wish-fulfillment rules.", "Millennial women, YA fantasy fans", "Witchcore, cozy fantasy, Halloween streaming", "cozy supernatural sitcom", ["witch", "sitcom", "teen"], ["wish-gone-wrong magic", "aunts", "Salem sarcasm"], ["modern teen stress", "practical magic ethics", "less canned format"]),
  p("3rd Rock from the Sun", 1996, "TV", "Sci-fi sitcom", 79, 68, 47, 38, 41, "Aliens-as-family sitcom that uses outsider logic to satirize human behavior.", "Sitcom fans, sci-fi comedy fans", "Fish-out-of-water comedy cycles", "single-cam alien family reboot", ["sitcom", "alien", "family"], ["outsider observations", "ensemble weirdness", "humanity satire"], ["current social norms", "workplace tech", "subtler alien lore"]),
  p("Everybody Loves Raymond", 1996, "TV", "Family sitcom", 82, 62, 39, 31, 35, "A domestic-family sitcom with evergreen in-law tension.", "Broadcast sitcom viewers", "Comfort-TV library value", "multicam family relaunch", ["sitcom", "family", "domestic"], ["in-law friction", "marriage comedy", "family proximity"], ["balanced spouse perspective", "modern parenting", "less gender stasis"]),
  p("Dexter's Laboratory", 1996, "TV", "Animated comedy", 84, 84, 74, 32, 62, "A kid-genius lab comedy with strong silhouettes and meme-friendly sibling conflict.", "Animation fans, STEM kids, millennials", "Cartoon Network nostalgia and STEM culture", "animated STEM adventure reboot", ["animation", "science", "comedy"], ["secret lab", "sibling chaos", "visual exaggeration"], ["AI robotics plots", "more Dee Dee agency", "maker culture"]),
  p("Hey Arnold!", 1996, "TV", "Animated slice-of-life", 82, 87, 73, 31, 60, "Urban kid empathy, neighborhood texture, and melancholy warmth.", "Animation fans, city nostalgists", "Lo-fi city nostalgia and emotional animation appreciation", "animated city anthology", ["animation", "city", "kids"], ["urban ensemble", "gentle empathy", "jazz mood"], ["new neighborhood pressures", "modern school life", "richer family arcs"]),
  p("Blue's Clues", 1996, "TV", "Preschool", 86, 82, 61, 27, 64, "Interactive preschool TV that trained a generation in participatory viewing.", "Parents, preschool audiences", "Educational nostalgia and reboot proof", "interactive learning platform", ["preschool", "interactive", "education"], ["direct address", "clue structure", "warm host"], ["app co-play", "bilingual modules", "parent dashboards"]),

  p("Nirvana: MTV Unplugged", 1994, "Music", "Alternative", 96, 91, 82, 64, 22, "A canonical intimate performance that keeps 90s authenticity emotionally current.", "Alt-rock fans, Gen Z music explorers", "Vinyl, acoustic covers, documentary discourse", "immersive concert documentary", ["music", "grunge", "live"], ["raw intimacy", "unpolished vocals", "cover choices"], ["archival context", "mental-health framing", "creator tribute format"]),
  p("Green Day: Dookie", 1994, "Music", "Pop punk", 94, 88, 84, 42, 67, "Pop-punk's mainstream breakthrough, compact and instantly youth-coded.", "Millennials, punk revival fans", "Pop-punk revival and festival demand", "stage musical or animated series", ["music", "punk", "youth"], ["bratty speed", "suburban anxiety", "three-chord clarity"], ["new teen boredom", "less slacker-only lens", "cross-genre collabs"]),
  p("The Notorious B.I.G.: Ready to Die", 1994, "Music", "Hip-hop", 96, 94, 88, 58, 20, "A landmark rap narrative of charisma, fatalism, and Brooklyn specificity.", "Hip-hop fans, documentary audiences", "Catalog reverence and biopic cycles", "prestige music docuseries", ["hip-hop", "brooklyn", "legacy"], ["storytelling", "voice", "street specificity"], ["estate-sensitive framing", "context over myth", "new artist mentorship"]),
  p("Soundgarden: Superunknown", 1994, "Music", "Grunge metal", 88, 79, 58, 47, 18, "Heavy, psychedelic alternative rock with iconic vocals and darker textures.", "Rock fans, guitar culture", "90s rock rediscovery", "premium album documentary", ["rock", "grunge", "guitar"], ["sonic heaviness", "surreal lyrics", "vocal power"], ["mental health context", "visual album", "younger musician covers"]),
  p("Alanis Morissette: Jagged Little Pill", 1995, "Music", "Alternative pop", 96, 91, 86, 36, 72, "Confessional rage and vulnerability that still maps onto gendered frustration.", "Millennial women, theater fans", "Musical adaptation and confessional pop lineage", "limited series or stage-to-screen event", ["music", "confessional", "women"], ["emotional directness", "anger as release", "diary intimacy"], ["modern relationship politics", "intersectional ensemble", "new sonic textures"]),
  p("Oasis: What's the Story Morning Glory?", 1995, "Music", "Britpop", 93, 82, 79, 45, 66, "A stadium-scale Britpop record with karaoke-proof hooks.", "Rock fans, UK nostalgia, festival audiences", "Reunion speculation and singalong endurance", "tour documentary and scripted band drama", ["music", "britpop", "band"], ["anthemic choruses", "sibling tension", "working-class swagger"], ["avoid hagiography", "new Manchester context", "fan community lens"]),
  p("Coolio: Gangsta's Paradise", 1995, "Music", "Hip-hop soundtrack", 90, 83, 76, 41, 12, "A soundtrack rap crossover with instantly recognizable hook and school-drama association.", "Hip-hop fans, soundtrack nostalgists", "Short-form audio reuse and memorial interest", "soundtrack anthology episode", ["music", "hip-hop", "soundtrack"], ["haunting hook", "moral reflection", "school stakes"], ["education inequity lens", "new classroom story", "estate-respectful tribute"]),
  p("No Doubt: Tragic Kingdom", 1995, "Music", "Ska pop", 91, 87, 82, 38, 62, "Bright ska-pop heartbreak with fashion, charisma, and festival utility.", "Millennials, pop-rock fans", "Y2K/ska revival cycles", "music-fashion docuseries", ["music", "ska", "fashion"], ["breakup specificity", "horn energy", "frontwoman identity"], ["new OC culture", "gender lens", "fashion archive activation"]),
  p("Spice Girls: Spice", 1996, "Music", "Pop", 93, 90, 91, 34, 72, "Girl-power branding that fused music, personality archetypes, and merch.", "Millennial women, pop fans, families", "Y2K fashion and reunion demand", "global pop competition or scripted comedy", ["music", "pop", "girl power"], ["archetype clarity", "friendship", "participatory branding"], ["less slogan feminism", "global girlhood", "interactive fan casting"]),
  p("Tupac: All Eyez on Me", 1996, "Music", "Hip-hop", 96, 95, 90, 60, 8, "A massive rap statement tied to charisma, controversy, and enduring iconography.", "Hip-hop fans, documentary audiences", "Cultural scholarship and catalog streaming", "prestige archive docuseries", ["hip-hop", "legacy", "west coast"], ["performance intensity", "contradiction", "poetic urgency"], ["rights-sensitive archive", "nuanced politics", "avoid exploitation"]),
  p("Jay-Z: Reasonable Doubt", 1996, "Music", "Hip-hop", 91, 96, 85, 52, 76, "A blueprint for hustler introspection and luxury rap storytelling.", "Hip-hop fans, business culture", "Founder myth and catalog reappraisal", "business-of-rap limited docuseries", ["hip-hop", "business", "nyc"], ["cold precision", "ambition", "mafioso texture"], ["modern entrepreneurship", "less glorification", "artist ownership lens"]),
  p("Beck: Odelay", 1996, "Music", "Alternative", 88, 80, 63, 44, 57, "A collage-pop record built for remix culture before platforms made it normal.", "Alt music fans, producers", "Sample culture and genre-fluid artists", "interactive remix album experience", ["music", "samples", "alternative"], ["collage energy", "absurd lyrics", "genre hopping"], ["creator tools", "sample clearance story", "visual remix lab"]),
  p("Fugees: The Score", 1996, "Music", "Hip-hop soul", 94, 92, 84, 49, 44, "A crossover hip-hop-soul classic with group chemistry and Lauryn Hill gravity.", "Hip-hop/R&B fans", "Catalog reverence and reunion curiosity", "premium album documentary", ["music", "hip-hop", "r&b"], ["group chemistry", "soulful covers", "diasporic identity"], ["diaspora context", "women's authorship", "global fan chapters"]),
  p("R.E.M.: Monster", 1994, "Music", "Alternative rock", 84, 72, 43, 35, 38, "A loud glam-adjacent pivot from a college-rock institution.", "Alt-rock fans", "Tour anniversaries and vinyl culture", "album-era podcast/doc", ["music", "rock", "college"], ["reinvention", "guitar fuzz", "outsider empathy"], ["fan reappraisal", "queer glam lens", "modern indie covers"]),
  p("Mariah Carey: Daydream", 1995, "Music", "Pop/R&B", 94, 93, 88, 29, 70, "Pop perfection and vocal athleticism with hip-hop collaboration signals.", "Pop/R&B fans, vocal fandoms", "Holiday/catalog dominance and vocal TikTok", "vocal competition special", ["music", "pop", "r&b"], ["vocal runs", "romantic uplift", "hip-hop crossover"], ["producer-storytelling", "new duets", "behind-the-vocals content"]),

  p("Donkey Kong Country", 1994, "Video Game", "Platformer", 90, 86, 78, 22, 70, "Pre-rendered jungle platforming that made 16-bit hardware feel impossible.", "Nintendo fans, retro gamers", "Switch retro libraries and speedruns", "2.5D co-op platformer", ["game", "platformer", "nintendo"], ["rhythm platforming", "animal buddies", "jungle music"], ["accessibility modes", "online co-op", "procedural challenge rooms"]),
  p("Sony PlayStation", 1994, "Tech", "Console", 99, 97, 88, 16, 82, "The console brand that made games cinematic, adult, and CD-native.", "Gamers, tech historians", "Retro mini consoles and PS1 aesthetic loops", "retro cloud arcade hub", ["console", "gaming", "hardware"], ["CD-era weirdness", "startup identity", "genre experimentation"], ["licensed classics", "CRT filters", "creator commentary"]),
  p("EarthBound", 1994, "Video Game", "RPG", 78, 91, 82, 24, 58, "A cult RPG that turns suburbia, childhood, and absurdity into emotional fantasy.", "Indie game fans, Nintendo collectors", "Indie influence and collector market", "animated adventure or spiritual game sequel", ["game", "rpg", "cult"], ["deadpan suburbia", "kid party", "emotional weirdness"], ["modern indie art", "mental-health themes", "less grind"]),
  p("Warcraft: Orcs & Humans", 1994, "Video Game", "Strategy", 86, 82, 66, 18, 75, "The RTS foundation for a larger fantasy universe and decades of fandom.", "PC gamers, MMO fans", "Strategy nostalgia and Warcraft ecosystem", "single-player tactics revival", ["game", "strategy", "fantasy"], ["faction contrast", "base-building", "fantasy war"], ["less binary races", "campaign choice", "modern onboarding"]),
  p("Tekken", 1994, "Video Game", "Fighting", 84, 87, 76, 18, 71, "A 3D fighting brand with family melodrama and arcade muscle memory.", "Fighting-game community", "Competitive scene and new releases", "story-forward fighting expansion", ["game", "fighting", "arcade"], ["Mishima drama", "3D combat", "arcade feel"], ["rollback-first online", "cinematic tutorials", "character accessibility"]),
  p("Mortal Kombat II", 1994, "Video Game", "Fighting", 89, 91, 86, 18, 74, "The arcade violence spectacle that made fighting games tabloid-famous.", "Fighting-game fans, horror-action fans", "Ongoing franchise strength", "R-rated tournament series", ["game", "fighting", "horror"], ["fatality spectacle", "mythic realms", "martial tournament"], ["character stakes", "practical gore balance", "global fighters"]),
  p("Chrono Trigger", 1995, "Video Game", "RPG", 93, 95, 88, 24, 62, "A time-travel RPG masterpiece with unusually high remake demand.", "JRPG fans, collectors", "HD-2D remake appetite", "premium HD-2D remake", ["game", "rpg", "time travel"], ["time eras", "ensemble party", "music"], ["quality-of-life", "expanded endings", "no live-service layer"]),
  p("Command & Conquer", 1995, "Video Game", "Strategy", 88, 79, 62, 28, 59, "FMV-backed RTS that gave PC strategy personality and faction ideology.", "PC strategy fans", "Remaster performance and RTS revival murmurs", "modern tactics/RTS hybrid", ["game", "strategy", "pc"], ["faction identity", "FMV briefings", "resource pressure"], ["accessible controls", "co-op campaign", "modern geopolitical caution"]),
  p("Rayman", 1995, "Video Game", "Platformer", 82, 80, 63, 24, 55, "A whimsical limb-less platforming mascot with strong visual identity.", "Platformer fans, families", "Mascot platformer rediscovery", "hand-painted co-op platformer", ["game", "platformer", "mascot"], ["surreal worlds", "music timing", "clean silhouette"], ["modern precision", "family co-op", "creator levels"]),
  p("Twisted Metal", 1995, "Video Game", "Vehicular combat", 82, 81, 74, 20, 70, "Car combat chaos with killer clown iconography and arena readability.", "Gamers, action-comedy fans", "Streaming adaptation awareness", "arcade battle royale game", ["game", "cars", "combat"], ["vehicle identities", "arena chaos", "dark carnival tone"], ["online balance", "campaign character arcs", "less edge-for-edge"]),
  p("Resident Evil", 1996, "Video Game", "Survival horror", 94, 98, 91, 15, 82, "Survival horror's mansion template with puzzles, scarcity, and corporate bio-dread.", "Horror gamers, film/TV fans", "Remake excellence and franchise momentum", "prestige horror series or remake", ["game", "horror", "zombies"], ["resource tension", "mansion layout", "bio-conspiracy"], ["stronger dialogue", "grounded science", "smart episodic suspense"]),
  p("Super Mario 64", 1996, "Video Game", "Platformer", 100, 97, 90, 12, 86, "The 3D movement grammar lesson for an entire industry.", "Nintendo fans, game designers, families", "Speedruns and 3D platformer nostalgia", "museum-quality remaster or new 3D platformer", ["game", "platformer", "3d"], ["movement joy", "castle hub", "star collection"], ["camera polish", "co-op ghosts", "creator challenge mode"]),
  p("Pokemon Red/Green", 1996, "Video Game", "RPG/collecting", 100, 100, 98, 12, 90, "The monster-collecting ecosystem that became a global childhood language.", "Families, gamers, collectors", "Perennial franchise dominance", "premium classic-region experience", ["game", "collecting", "anime"], ["collection loop", "trading", "starter identity"], ["open region", "parent-child co-play", "ethical creature care"]),
  p("Tomb Raider", 1996, "Video Game", "Action adventure", 91, 88, 82, 20, 72, "A 3D adventure icon with archaeology fantasy and a complicated heroine legacy.", "Gamers, action-adventure fans", "Remaster and adaptation cycles", "prestige adventure series", ["game", "adventure", "heroine"], ["exploration awe", "puzzles", "athletic protagonist"], ["colonial critique", "survival intellect", "less objectification"]),
  p("Quake", 1996, "Video Game", "FPS", 92, 84, 70, 32, 60, "A fully 3D shooter that shaped speed, modding, and online competition.", "PC gamers, esports historians", "Boomer-shooter revival", "arena shooter relaunch", ["game", "fps", "pc"], ["speed", "gothic tech", "modding"], ["crossplay", "creator maps", "anti-toxicity systems"]),
  p("Crash Bandicoot", 1996, "Video Game", "Platformer", 88, 86, 78, 22, 68, "PlayStation's corridor-platform mascot with expressive animation and trial precision.", "PlayStation fans, families", "Remaster sales and mascot nostalgia", "new family platformer", ["game", "platformer", "mascot"], ["expressive mascot", "crate rhythm", "bright hazards"], ["less frustration spikes", "co-op assists", "short challenge loops"]),
  p("Nights into Dreams", 1996, "Video Game", "Action flight", 78, 79, 59, 36, 44, "A dreamy flying game with cult Sega identity and music-led mood.", "Sega fans, art-game audiences", "Cult retrospectives", "VR dream-flight experience", ["game", "sega", "dream"], ["flight arcs", "dream worlds", "score flow"], ["VR comfort design", "therapeutic dream framing", "creator worlds"]),
  p("Diablo", 1996, "Video Game", "Action RPG", 91, 90, 83, 18, 76, "A loot-driven dungeon crawler that made clicking through darkness compulsive.", "ARPG fans, PC gamers", "Seasonal ARPG market and franchise cycles", "dark co-op roguelite", ["game", "arpg", "loot"], ["gothic town", "loot tension", "descent structure"], ["fair monetization", "co-op storytelling", "less grind opacity"]),

  p("Pogs", 1994, "Toy/Fad", "Collectible game", 82, 70, 68, 64, 53, "A schoolyard collectible economy with simple rules and tactile stacks.", "Millennials, collectors, toy companies", "Analog collectibles and mystery-pack cycles", "mobile-physical collectible game", ["fad", "collectible", "school"], ["simple slammer mechanic", "scarcity", "custom art"], ["anti-gambling guardrails", "AR battles", "creator designs"]),
  p("Beanie Babies", 1995, "Toy/Fad", "Plush collectible", 88, 86, 82, 38, 62, "A plush scarcity phenomenon that foreshadowed internet-fueled collecting bubbles.", "Millennial parents, collectors", "Documentary cycles and plush collector markets", "satirical collectible marketplace game", ["toy", "collectible", "plush"], ["cute characters", "retirement scarcity", "tag lore"], ["transparent drops", "digital provenance", "bubble-aware story"]),
  p("Windows 95", 1995, "Tech", "Operating system", 98, 94, 88, 15, 70, "The consumer-computing launch that made the Start button and internet era mainstream.", "Tech workers, 90s kids, designers", "Retro UI, vaporwave, productivity nostalgia", "interactive workplace comedy/tool museum", ["tech", "pc", "internet"], ["startup sound", "desktop metaphor", "mass-market optimism"], ["modern privacy critique", "browser-era storytelling", "usable emulator demos"]),
  p("Amazon/eBay Launch", 1995, "Tech", "Internet commerce", 97, 99, 86, 12, 88, "Two marketplace origin stories that changed shopping, auctions, and logistics.", "Tech/business audiences", "Founder-story demand and marketplace regulation debates", "prestige founder-era docudrama", ["tech", "commerce", "internet"], ["garage origin", "marketplace thrill", "early-web texture"], ["labor/platform critique", "seller stories", "regulatory stakes"]),
  p("Sega Saturn", 1995, "Tech", "Console", 79, 70, 58, 37, 42, "A messy console launch with cult arcade ports and business-strategy lessons.", "Sega fans, game historians", "Console-war retrospectives", "interactive business documentary", ["console", "sega", "gaming"], ["arcade feel", "underdog identity", "hardware mystique"], ["clear UX", "lost-game archive", "business postmortem"]),
  p("Nintendo 64", 1996, "Tech", "Console", 97, 95, 91, 16, 82, "The couch-multiplayer and 3D-console memory engine for a generation.", "Gamers, families, collectors", "Retro controllers, speedruns, local multiplayer nostalgia", "modern couch-party platform", ["console", "nintendo", "multiplayer"], ["four controller ports", "analog stick", "party play"], ["online couch feel", "licensed retro vault", "family tournament mode"]),
  p("Tamagotchi", 1996, "Toy/Fad", "Digital pet", 90, 88, 86, 28, 75, "A pocket pet that turned responsibility, anxiety, and attachment into beeps.", "Millennials, Gen Z kawaii fans", "Digital pets, wearables, wellness companions", "AI companion toy ecosystem", ["toy", "digital pet", "portable"], ["care loop", "portable attachment", "cute consequence"], ["healthy notifications", "privacy-first AI", "parent controls"]),
  p("Tickle Me Elmo", 1996, "Toy/Fad", "Interactive plush", 88, 79, 72, 24, 68, "A holiday toy frenzy that proved interactive plush could create mass panic demand.", "Parents, toy industry, collectors", "Holiday-toy nostalgia and interactive plush tech", "smart plush holiday relaunch", ["toy", "plush", "holiday"], ["laugh response", "hug appeal", "holiday scarcity"], ["safe sensors", "language learning", "transparent supply"]),
  p("DVD Launch", 1996, "Tech", "Home media", 91, 86, 63, 30, 54, "The premium home-media format that made extras, menus, and collecting feel cinematic.", "Film collectors, AV enthusiasts", "Physical media renaissance", "collector streaming companion", ["tech", "film", "home media"], ["bonus features", "chapter menus", "collector ownership"], ["digital extras", "creator commentary hub", "portable libraries"]),
  p("Power Rangers Movie/Toys", 1995, "Toy/Fad", "Action franchise", 86, 84, 79, 22, 71, "Color-coded teamwork, martial arts, monsters, and toyetic transformation rituals.", "Millennial parents, kids, action fans", "Ongoing brand and sentai nostalgia", "premium young-adult team series", ["toy", "action", "team"], ["team colors", "morphing", "monster escalation"], ["higher stunt quality", "character arcs", "international team"]),
  p("Magic: The Gathering", 1994, "Toy/Fad", "Trading card game", 92, 97, 89, 18, 84, "A fantasy card system that became a durable competitive and collector economy.", "TCG players, fantasy audiences", "TCG boom and digital tabletop growth", "animated fantasy anthology", ["cards", "fantasy", "strategy"], ["color identity", "planes", "deck expression"], ["entry-friendly lore", "digital/physical bridge", "accessible play"]),
  p("Goosebumps TV/Books", 1995, "Toy/Fad", "Kids horror", 88, 91, 87, 24, 76, "Safe scares, twist endings, and school-library ubiquity.", "Millennial parents, kids, horror fans", "Kids horror resurgence and brand familiarity", "anthology streamer with family scares", ["books", "horror", "kids"], ["twist endings", "creature hooks", "kid POV"], ["modern fears", "season arcs", "practical creature charm"]),
  p("Nickelodeon Slime Culture", 1994, "Toy/Fad", "Kids media", 86, 84, 76, 31, 65, "A tactile symbol of kid agency, messy game shows, and anti-grownup fun.", "Millennials, family entertainment", "Slime toy and game-show nostalgia", "live family competition format", ["kids", "slime", "game show"], ["messy stakes", "kid contestants", "bright soundstage"], ["creator challenges", "safe materials", "family co-play"]),
  p("Furbies Precursor Digital Toy Wave", 1996, "Toy/Fad", "Interactive toys", 75, 77, 59, 39, 58, "The pre-Furby appetite for electronic personality toys and reactive play.", "Toy companies, parents", "AI toy discussion", "privacy-first AI toy line", ["toy", "interactive", "ai"], ["reactive personality", "cute collectibility", "mystery behavior"], ["privacy controls", "offline intelligence", "ethical companion design"]),
  p("Lisa Frank School Supplies", 1994, "Toy/Fad", "Design/fashion", 80, 86, 74, 33, 57, "Hyper-saturated school identity built from dolphins, stickers, binders, and maximal joy.", "Millennial women, stationery fans", "Maximalist nostalgia and collab culture", "fashion/stationery collab platform", ["fashion", "school", "design"], ["rainbow maximalism", "animal fantasy", "school ownership"], ["premium materials", "creator collabs", "adult desk line"]),
  p("WWE Monday Night Wars", 1996, "Sports/Media", "Pro wrestling", 90, 88, 84, 31, 73, "The beginning of a weekly live-TV arms race built on characters and shock turns.", "Wrestling fans, sports media", "Wrestling documentary and live-event growth", "docuseries plus interactive watch hub", ["sports", "wrestling", "tv"], ["live stakes", "character turns", "faction energy"], ["worker safety", "behind-the-scenes transparency", "women's division depth"]),
];

export const categories: (PropertyCategory | "All")[] = ["All", "Movie", "TV", "Music", "Video Game", "Toy/Fad", "Tech", "Sports/Media"];
export const years = ["All", "1993", "1994", "1995", "1996", "1997", "1998"];

export function getTargetAudienceAge(property: Property): number {
  return CURRENT_YEAR - property.year + PEAK_CHILDHOOD_AGE;
}

export function getNostalgiaAlignment(property: Property): number {
  const age = getTargetAudienceAge(property);
  const distance = Math.abs(age - SWEET_SPOT_CENTER);
  return Math.max(0, Math.round(100 - distance * 8));
}

export function getTimingStage(property: Property): TimingStage {
  const age = getTargetAudienceAge(property);
  if (age < 35) return "Pre-Peak";
  if (age <= 45) return "Sweet Spot";
  return "Mature";
}

export function getLaunchWindow(property: Property): string {
  const age = getTargetAudienceAge(property);
  if (age < 35) return `${CURRENT_YEAR + (35 - age)}-${CURRENT_YEAR + (38 - age)}`;
  if (age <= 45) return `${CURRENT_YEAR}-${CURRENT_YEAR + Math.max(1, 45 - age)}`;
  return "Now, with legacy framing";
}

export function getRevivalReadinessScore(property: Property): number {
  return Math.round(
    property.socialBuzz * 0.3 +
      getNostalgiaAlignment(property) * 0.4 +
      property.modernRelevance * 0.3
  );
}

export function getRiskScore(property: Property): number {
  const rightsRisk = property.rightsComplexity * 0.45;
  const sensitivityRisk = Math.max(0, 80 - property.modernRelevance) * 0.25;
  const executionRisk = Math.max(0, 70 - property.creatorAvailability) * 0.3;
  return Math.min(100, Math.round(rightsRisk + sensitivityRisk + executionRisk));
}

export function getRecommendation(property: Property): string {
  const score = getRevivalReadinessScore(property);
  const risk = getRiskScore(property);
  if (score >= 88 && risk < 45) return "Greenlight exploration";
  if (score >= 78) return "Acquire option and validate fan thesis";
  if (score >= 68) return "Watchlist with social listening";
  return "Archive until stronger signal emerges";
}

export function scoreProperty(property: Property, index = 0): PropertyScore {
  return {
    ...property,
    rank: index + 1,
    nostalgiaAlignment: getNostalgiaAlignment(property),
    revivalReadinessScore: getRevivalReadinessScore(property),
    riskScore: getRiskScore(property),
    timingStage: getTimingStage(property),
    targetAudienceAge: getTargetAudienceAge(property),
    launchWindow: getLaunchWindow(property),
    recommendation: getRecommendation(property),
  };
}

export function scoreAll(list: Property[]): PropertyScore[] {
  return list
    .map(scoreProperty)
    .sort((a, b) => b.revivalReadinessScore - a.revivalReadinessScore)
    .map((property, index) => ({ ...property, rank: index + 1 }));
}

/**
 * Live library from the API, with the bundled list as the offline fallback.
 * The API returns camelCase Property fields; anything extra is ignored.
 */
export async function fetchPropertiesFromApi(): Promise<Property[] | null> {
  try {
    const res = await fetch("/api/properties", { headers: { accept: "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as { properties?: Property[] };
    if (!data.properties || data.properties.length === 0) return null;
    return data.properties;
  } catch {
    return null;
  }
}

export function getPropertiesFrom(list: PropertyScore[], filters: PropertyFilters = {}): PropertyScore[] {
  const query = filters.query?.trim().toLowerCase();
  return list.filter((property) => {
    const categoryMatches = !filters.category || filters.category === "All" || property.category === filters.category;
    const yearMatches = !filters.year || filters.year === "All" || String(property.year) === filters.year;
    const timingMatches = !filters.timing || filters.timing === "All" || property.timingStage === filters.timing;
    const queryMatches =
      !query ||
      [property.name, property.genre, property.briefDescription, property.tags.join(" "), property.currentSignal]
        .join(" ")
        .toLowerCase()
        .includes(query);
    return categoryMatches && yearMatches && timingMatches && queryMatches;
  });
}

export const scoredProperties: PropertyScore[] = properties
  .map(scoreProperty)
  .sort((a, b) => b.revivalReadinessScore - a.revivalReadinessScore)
  .map((property, index) => ({ ...property, rank: index + 1 }));

export function getProperty(id: string): PropertyScore | undefined {
  return scoredProperties.find((property) => property.id === id);
}

export function getFeaturedProperties(limit = 6): PropertyScore[] {
  return scoredProperties.slice(0, limit);
}

export function getProperties(filters: PropertyFilters = {}): PropertyScore[] {
  const query = filters.query?.trim().toLowerCase();
  return scoredProperties.filter((property) => {
    const categoryMatches = !filters.category || filters.category === "All" || property.category === filters.category;
    const yearMatches = !filters.year || filters.year === "All" || String(property.year) === filters.year;
    const timingMatches = !filters.timing || filters.timing === "All" || property.timingStage === filters.timing;
    const queryMatches =
      !query ||
      [property.name, property.genre, property.briefDescription, property.tags.join(" "), property.currentSignal]
        .join(" ")
        .toLowerCase()
        .includes(query);
    return categoryMatches && yearMatches && timingMatches && queryMatches;
  });
}

export function getCategoryStats() {
  return categories
    .filter((category): category is PropertyCategory => category !== "All")
    .map((category) => {
      const categoryProperties = scoredProperties.filter((property) => property.category === category);
      const average =
        categoryProperties.reduce((sum, property) => sum + property.revivalReadinessScore, 0) /
        categoryProperties.length;
      return {
        category,
        count: categoryProperties.length,
        average: Math.round(average),
        top: categoryProperties[0],
      };
    })
    .sort((a, b) => b.average - a.average);
}

export function getNostalgiaCurve(property: PropertyScore) {
  return Array.from({ length: 13 }, (_, index) => {
    const year = 2020 + index;
    const age = year - property.year + PEAK_CHILDHOOD_AGE;
    const distance = Math.abs(age - SWEET_SPOT_CENTER);
    const alignment = Math.max(0, Math.round(100 - distance * 8));
    const readiness = Math.round(property.socialBuzz * 0.3 + alignment * 0.4 + property.modernRelevance * 0.3);
    return { year, age, alignment, readiness };
  });
}

export function getModernizationRecommendations(property: PropertyScore): string[] {
  return [
    `Preserve ${property.preserve[0]} as the emotional contract for original fans.`,
    `Update ${property.update[0]} so the revival feels native to 2026 rather than costumed in 1995.`,
    `Package as a ${property.revivalFormat} with a launch window of ${property.launchWindow}.`,
    `Use ${property.currentSignal.toLowerCase()} as the top-of-funnel marketing signal.`,
    `De-risk rights and execution early: current model risk is ${property.riskScore}/100.`,
  ];
}

export function generateViralPitch(property: PropertyScore, format: RebootType = "Streaming Series") {
  const hook = property.tags.includes("game")
    ? "Playable nostalgia with modern onboarding"
    : property.tags.includes("music")
      ? "A soundtrack-first cultural event"
      : property.tags.includes("toy") || property.tags.includes("fad")
        ? "A collectible revival built for physical-digital fandom"
        : "A legacy revival built for parents and first-time fans";

  return {
    title: `${property.name}: Re/Signal`,
    logline: `${hook}: ${property.name} returns as a ${format.toLowerCase()} that keeps ${property.preserve[0]} while rebuilding the premise around ${property.update[0]}.`,
    audience: `${property.coreAudience}, plus younger audiences reached through ${property.currentSignal.toLowerCase()}.`,
    campaign: [
      `Drop a 90-second "memory unlock" teaser built around ${property.preserve[1]}.`,
      `Invite creators to remix ${property.tags.slice(0, 3).join(", ")} iconography before the official trailer.`,
      `Launch a fan-proof beta screening focused on the preserve/update contract.`,
    ],
    risk: `Primary risk is ${property.riskScore >= 55 ? "rights, tone, and execution complexity" : "execution discipline rather than demand"}.`,
  };
}

const unique = <T>(items: T[]): T[] => Array.from(new Set(items));

const average = (items: number[]): number =>
  items.length ? Math.round(items.reduce((sum, item) => sum + item, 0) / items.length) : 0;

const conceptTitles = [
  "Signal Arcade",
  "The Neon Covenant",
  "Pocket Universe",
  "After School Protocol",
  "Prime Time Ghosts",
  "The Memory Engine",
  "Saturday Night Upload",
  "Mallworld",
  "The Rewind Society",
  "Analog Hearts",
];

export function generateCompositePitch(properties: PropertyScore[], format: RebootType = "Streaming Series") {
  const sources = properties.slice(0, 5);
  const primary = sources[0] || scoredProperties[0];
  const categories = unique(sources.map((property) => property.category));
  const tags = unique(sources.flatMap((property) => property.tags));
  const preserve = unique(sources.flatMap((property) => property.preserve)).slice(0, 6);
  const update = unique(sources.flatMap((property) => property.update)).slice(0, 6);
  const categoryBonus = Math.min(8, Math.max(0, categories.length - 1) * 3);
  const signalBonus = Math.min(6, Math.max(0, sources.length - 2) * 2);
  const compositeScore = Math.min(
    100,
    average(sources.map((property) => property.revivalReadinessScore)) + categoryBonus + signalBonus
  );
  const riskScore = Math.min(
    100,
    average(sources.map((property) => property.riskScore)) + Math.max(0, sources.length - 3) * 4
  );
  const titleSeed = sources.reduce((sum, property) => sum + property.name.length + property.year, 0);
  const title = conceptTitles[titleSeed % conceptTitles.length];
  const sourceNames = sources.map((property) => property.name);
  const spine = preserve[0] || primary.preserve[0];
  const modernFrame = update[0] || primary.update[0];
  const sourcePhrase = sourceNames.length > 1
    ? `${sourceNames.slice(0, -1).join(", ")} and ${sourceNames[sourceNames.length - 1]}`
    : sourceNames[0];

  return {
    title,
    subtitle: `A new ${format.toLowerCase()} synthesized from ${sourcePhrase}`,
    logline: `${title} is a new ${format.toLowerCase()} that fuses ${spine}, ${preserve[1] || "90s emotional familiarity"}, and ${tags.slice(0, 3).join("/")} iconography into an original franchise built around ${modernFrame}.`,
    compositeScore,
    riskScore,
    categories,
    tags: tags.slice(0, 8),
    audience: `Primary buyers are ${unique(sources.map((property) => property.coreAudience.split(",")[0])).join(", ")}, with Gen Z and Gen Alpha entry points through ${unique(sources.map((property) => property.currentSignal.toLowerCase())).slice(0, 3).join("; ")}.`,
    world: [
      `Core emotional promise: preserve ${spine} while avoiding a literal crossover that would multiply rights exposure.`,
      `World engine: combine ${categories.join(", ")} behaviors into a repeatable franchise loop instead of a one-off nostalgia sketch.`,
      `Visual language: borrow the audience memory of ${tags.slice(0, 4).join(", ")} without copying protected expression.`,
    ],
    mechanics: [
      `Hero loop: every episode or act remixes ${preserve[1] || spine} through a present-day pressure point: ${modernFrame}.`,
      `Fan entry: launch with source-coded teasers for ${sourceNames.slice(0, 3).join(", ")} communities, then reveal the original title.`,
      `Merch/product wedge: build around ${tags.includes("toy") || tags.includes("collectible") ? "collectible drops and physical-digital ownership" : tags.includes("game") ? "interactive missions and co-op challenges" : "soundtrack, wardrobe, and quote-ready scenes"}.`,
    ],
    launch: [
      `Phase 1: publish a "nostalgia DNA" teaser campaign that hints at ${preserve.slice(0, 3).join(", ")} without naming the sources.`,
      `Phase 2: test three audience cuts: original fans, genre-native younger viewers, and parents sharing 90s culture with kids.`,
      `Phase 3: release the ${format.toLowerCase()} with companion shorts that explain the new mythology, not the reference list.`,
    ],
    preserve,
    update,
    risk: riskScore >= 55
      ? "High concept strength, but rights hygiene and tonal coherence need early legal and creative guardrails."
      : "Strong synthesis opportunity. Biggest risk is making the references too visible instead of letting the new property stand alone.",
  };
}

export const platformPrompt = `Build NostalDamus, a predictive analytics platform for identifying dormant 1994-1996 intellectual property ready for revival. The product must combine a searchable IP library, deterministic nostalgia scoring, cultural trend analysis, modernization recommendations, and a pitch/remix generator. Use a modern retro-futurist visual system: dark interface, restrained neon magenta/cyan accents, dense analytics surfaces, 90s grid motifs, and professional B2B polish. The core algorithm is Revival Readiness = Social Buzz * 0.30 + Nostalgia Window Alignment * 0.40 + Modern Cultural Relevance * 0.30. Nostalgia Window Alignment should model the original 8-16-year-old audience reaching ages 35-45, with age 40 as peak. Every property needs name, year, category, genre, original impact, modern relevance, social buzz, rights complexity, creator availability, description, current signal, preserve/update guidance, launch window, timing stage, risk score, and recommendations.`;
