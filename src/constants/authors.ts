import { Author } from "@/types";

export const AUTHORS: Author[] = [
  {
    id: "leo-tolstoy",
    name: "Leo Tolstoy",
    nationality: "Russian",
    born: 1828,
    died: 1910,
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=faces&q=80",
    shortBio: "Master of realistic fiction and moral philosophy, Tolstoy reshaped the novel with sweeping portraits of Russian society.",
    fullBio: "Count Lev Nikolayevich Tolstoy was a Russian writer who is regarded as one of the greatest authors of all time. Born to an aristocratic Russian family in 1828, he is best known for the novels War and Peace (1869) and Anna Karenina (1878), both acknowledged as pinnacles of realist fiction. Tolstoy's later works demonstrated an increasing preoccupation with Christian morality and social reform. He developed a philosophy later known as Tolstoyanism — a form of Christian anarchism advocating nonviolent resistance. His thoughts on nonviolent resistance to evil had a profound impact on Mahatma Gandhi and Martin Luther King Jr.",
    faqs: [
      { question: "What is Tolstoy's most famous work?", answer: "War and Peace (1869) is widely considered his magnum opus — an epic chronicle of Russian society during the Napoleonic Wars." },
      { question: "Was Tolstoy religious?", answer: "Later in life, Tolstoy became deeply spiritual, though he was excommunicated from the Russian Orthodox Church for his heterodox beliefs." },
      { question: "How did Tolstoy influence later literature?", answer: "His psychological depth and moral complexity influenced writers like Dostoevsky, Virginia Woolf, and Ernest Hemingway." },
      { question: "What was his relationship with Anna Karenina?", answer: "Anna Karenina (1878) was serialized in a journal. Tolstoy himself considered it his first true novel, crafted with meticulous attention to character psychology." }
    ],
    stories: [
      {
        id: "war-and-peace",
        title: "War and Peace",
        type: "novel",
        year: 1869,
        genre: "Historical Fiction",
        freeChapters: 2,
        coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=420&fit=crop&q=80",
        description: "An epic saga following five aristocratic families through the tumultuous Napoleonic Wars, exploring themes of fate, free will, and Russian identity.",
        synopsis: "Set against the backdrop of Napoleon's invasion of Russia, War and Peace follows the intertwined fates of five aristocratic families — the Bezukhovs, Bolkonskys, Rostovs, Kuragins, and Drubetskoys — across fifteen years of tumultuous Russian history. At its heart, the novel traces the moral and spiritual journeys of three characters: the idealistic Pierre Bezukhov searching for meaning in a corrupt world; the proud, complex Prince Andrei Bolkonsky seeking glory and then peace; and the vivacious Natasha Rostova, whose capacity for joy and suffering mirrors Russia itself. Tolstoy weaves their private dramas against grand historical panoramas — Austerlitz, Borodino, the burning of Moscow — challenging the very idea that great men shape history, arguing instead that anonymous collective forces are what truly move nations.",
        themes: ["Fate vs. Free Will", "War and Its Futility", "Moral Redemption", "Russian National Identity", "Aristocratic Society in Decline", "History and the Individual"],
        quotes: [
          { text: "The strongest of all warriors are these two — Time and Patience.", context: "Pierre's reflection on endurance during Napoleon's invasion" },
          { text: "We are asleep until we fall in love.", context: "On the transformative power of love" },
          { text: "All happy families are alike; each unhappy family is unhappy in its own way.", context: "Opening line — the most famous in Russian literature" },
          { text: "If everyone fought for their own convictions there would be no war.", context: "Prince Andrei on the nature of conflict" }
        ],
        pages: 1225
      },
      {
        id: "anna-karenina",
        title: "Anna Karenina",
        type: "novel",
        year: 1878,
        genre: "Realist Fiction",
        freeChapters: 2,
        coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=420&fit=crop&q=80",
        description: "A tragic story of aristocratic St. Petersburg society, following Anna's ill-fated passion and Levin's search for moral truth.",
        synopsis: "Anna Karenina runs two parallel narratives: the doomed love affair between Anna Karenina, a married aristocrat of great beauty and intelligence, and Count Alexei Vronsky, a dashing cavalry officer; and the spiritual journey of Konstantin Levin, a landowner searching for life's meaning through honest work and authentic love. Anna abandons her husband and son to follow passion, only to find that social exile and Vronsky's gradual indifference trap her in a cage of jealousy and despair. Levin, meanwhile, finds quiet salvation through marriage to Kitty and his growing connection to the Russian peasantry. Tolstoy constructs these two trajectories as a meditation on the consequences of self-deception versus self-knowledge, passion versus duty, and the difference between love and obsession.",
        themes: ["Passion vs. Duty", "Social Hypocrisy", "Marriage and Fidelity", "Spiritual Seeking", "Class and Society", "Jealousy and Self-Destruction"],
        quotes: [
          { text: "Respect was invented to cover the empty place where love should be.", context: "Anna's bitter reflection on her marriage to Karenin" },
          { text: "He stepped down, trying not to look long at her, as if she were the sun, yet he saw her, like the sun, even without looking.", context: "Levin's first sight of Kitty" },
          { text: "I think… if it is true that there are as many minds as there are heads, then there are as many kinds of love as there are hearts.", context: "Levin on the universality and individuality of love" }
        ],
        pages: 864
      },
      {
        id: "the-death-of-ivan-ilyich",
        title: "The Death of Ivan Ilyich",
        type: "short-story",
        year: 1886,
        genre: "Philosophical Fiction",
        coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=420&fit=crop&q=80",
        description: "A devastating novella about a high-court judge who, facing death, confronts the emptiness of his bourgeois life.",
        synopsis: "Ivan Ilyich Golovin is a successful high-court judge in 19th-century Russia who has lived an entirely conventional, respectable life — ambitious, proper, and essentially hollow. When a minor injury leads to a mysterious and progressive illness, Ivan is forced to confront the question he has never asked: was his life well-lived? As his colleagues scheme over his position and his wife calculates his pension, only Gerasim — his peasant servant — tends to him with genuine, uncomplicated kindness. In his final days, Ivan experiences a spiritual crisis and sudden illumination, discovering that his whole life was built on the wrong foundation, and that true peace comes only from releasing the pretense.",
        themes: ["Mortality and Denial", "The Inauthenticity of Bourgeois Life", "Spiritual Awakening", "Compassion vs. Social Duty", "Isolation in Illness"],
        quotes: [
          { text: "Ivan Ilyich's life had been most simple and most ordinary and therefore most terrible.", context: "The novella's central thesis, stated in the opening pages" },
          { text: "What if my whole life has really been wrong?", context: "Ivan's devastating deathbed realization" },
          { text: "The syllogism he had learnt from Kiesewetter's Logic: 'Caius is a man, men are mortal, therefore Caius is mortal,' had always seemed to him correct as applied to Caius, but certainly not as applied to himself.", context: "Ivan's confrontation with his own mortality" }
        ],
        readTime: "3 hrs"
      },
      {
        id: "the-cossacks",
        title: "The Cossacks",
        type: "short-story",
        year: 1863,
        genre: "Adventure",
        coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=420&fit=crop&q=80",
        description: "A young Moscow nobleman escapes to the Caucasus, finding freedom and romance among the wild Cossack people.",
        synopsis: "Olenin, a young, disillusioned Moscow nobleman, enlists in the Russian army and is posted to a Cossack village in the Caucasus. He becomes entranced by the wild, natural life of the Cossacks — their hunting, their freedom from social convention, their physical vitality — and falls desperately in love with the beautiful Maryanka. Olenin believes he can transform himself through this new world, renouncing his old identity. But his romantic idealism and self-consciousness forever separate him from the authentic, unconscious happiness he seeks. The Cossacks, especially the old hunter Eroshka, are not interested in his philosophical yearnings — they simply live. The novella is Tolstoy's most autobiographical early work, drawn from his own military service.",
        themes: ["Civilization vs. Nature", "Romantic Idealism", "Self-Reinvention", "Desire and Unattainability", "The Caucasus as Escape"],
        quotes: [
          { text: "Happiness is being with nature, seeing her, conversing with her.", context: "Olenin's creed upon arriving in the Caucasus" },
          { text: "A Cossack's happiness consists in freedom alone.", context: "Old Eroshka explaining the Cossack way of life" }
        ],
        readTime: "4 hrs"
      }
    ],
    novelCount: 2,
    shortStoryCount: 2
  },
  {
    id: "jane-austen",
    name: "Jane Austen",
    nationality: "British",
    born: 1775,
    died: 1817,
    portrait: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=faces&q=80",
    shortBio: "With razor wit and keen social observation, Austen crafted six novels that transformed the romantic comedy into high literary art.",
    fullBio: "Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique, and comment upon the British landed gentry at the end of the 18th century. Austen's plots often explore the dependence of women on marriage in the pursuit of favourable social standing and economic security. Her works critique the novels of sensibility of the second half of the 18th century and are part of the transition to 19th-century literary realism. Her use of biting irony, along with her realism and social commentary, have earned her acclaim among critics and scholars alike. The Prince Regent admired her work and kept a set of her novels in each of his residences.",
    faqs: [
      { question: "How many novels did Austen publish?", answer: "Austen published four novels during her lifetime — Sense and Sensibility, Pride and Prejudice, Mansfield Park, and Emma. Northanger Abbey and Persuasion appeared posthumously." },
      { question: "Why did Austen never marry?", answer: "She received at least one proposal she initially accepted but then declined. Her letters suggest she believed in marrying for love rather than financial security." },
      { question: "Was she successful during her lifetime?", answer: "Her novels sold respectably, though anonymously. True fame came after her death when her nephew published a memoir revealing her identity." },
      { question: "What themes dominate her work?", answer: "Marriage, class, money, and female agency are her central themes — always explored with irony and psychological precision." }
    ],
    stories: [
      {
        id: "pride-and-prejudice",
        title: "Pride and Prejudice",
        type: "novel",
        year: 1813,
        genre: "Romantic Comedy",
        freeChapters: 2,
        coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=420&fit=crop&q=80",
        description: "The spirited Elizabeth Bennet and the proud Mr. Darcy navigate misunderstandings, family pressure, and their own hearts in Regency England.",
        synopsis: "In the English countryside of Regency England, Mrs. Bennet is consumed by one goal: marrying off her five daughters. When the wealthy, eligible Mr. Bingley arrives with his even wealthier friend Mr. Darcy, the stage is set for one of literature's greatest love stories. Elizabeth Bennet, the second eldest and most sharp-witted of the daughters, clashes immediately with the reserved, apparently arrogant Darcy. Their mutual misreading of each other's characters — her prejudice, his pride — forms the central engine of the novel. As Darcy's admiration for Elizabeth grows despite his social condescension, and as Elizabeth gradually sees through her own biases, Austen delivers a precise, witty dissection of how class, manners, and self-knowledge shape the possibilities for love.",
        themes: ["Pride and Self-Deception", "Class and Social Mobility", "Marriage as Economic Necessity", "Female Intelligence and Agency", "First Impressions vs. True Character"],
        quotes: [
          { text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.", context: "The novel's legendary opening sentence" },
          { text: "I could easily forgive his pride, if he had not mortified mine.", context: "Elizabeth on Darcy after the Netherfield ball" },
          { text: "You have bewitched me, body and soul, and I love, I love, I love you.", context: "Darcy's second proposal to Elizabeth" },
          { text: "I declare after all there is no enjoyment like reading!", context: "Miss Bingley — ironically, as she reads nothing at all" }
        ],
        pages: 432
      },
      {
        id: "emma",
        title: "Emma",
        type: "novel",
        year: 1815,
        genre: "Comedy of Manners",
        freeChapters: 2,
        coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=420&fit=crop&q=80",
        description: "A clever but misguided matchmaker meddles in the love lives of her friends, only to discover her own heart in the process.",
        synopsis: "Emma Woodhouse — handsome, clever, and rich, with a comfortable home and happy disposition — has little to vex her in the world. Except that she has absolutely no interest in marriage for herself, yet can think of nothing she'd enjoy more than arranging it for others. Her meddling in the romantic affairs of her new friend Harriet Smith sets in motion a chain of misunderstandings, humiliations, and revelations that gradually expose Emma's considerable blind spots. Her neighbor Mr. Knightley is the only person who regularly challenges her assumptions. Austen herself called Emma a heroine no one but herself will like — and yet Emma's flaws are so recognizably human, and her growth so genuinely earned, that she has become one of fiction's most beloved protagonists.",
        themes: ["Self-Knowledge and Growth", "Matchmaking and Its Dangers", "Class Snobbery", "Female Independence", "Domestic Comedy of Manners"],
        quotes: [
          { text: "Silly things do cease to be silly if they are done by sensible people in an impudent way.", context: "Emma defending her amusements to Mr. Knightley" },
          { text: "I may have lost my heart, but not my self-possession.", context: "Emma's characteristically confident self-assessment" },
          { text: "If I loved you less, I might be able to talk about it more.", context: "Mr. Knightley's declaration to Emma" }
        ],
        pages: 474
      },
      {
        id: "lady-susan",
        title: "Lady Susan",
        type: "short-story",
        year: 1794,
        genre: "Epistolary Fiction",
        coverUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=420&fit=crop&q=80",
        description: "Austen's darkest and most subversive heroine — a witty, amoral widow who manipulates everyone around her through brilliantly crafted letters.",
        synopsis: "Written in epistolary form entirely composed of letters, Lady Susan follows the recently widowed Lady Susan Vernon as she visits her brother-in-law's country estate in Churchill. Lady Susan is beautiful, brilliant, and utterly ruthless — simultaneously conducting two romantic intrigues, manipulating her daughter into an unwanted marriage, and charming every man in her orbit while confiding her cynical strategies to her London friend Alicia Johnson. Austen gives her antihero an intelligence and verbal wit that rivals any protagonist she ever created, making Lady Susan's amorality almost admirable. The novella is striking for showing us a woman who refuses the era's feminine norms of passivity and sentiment, choosing agency — however destructive — at every turn.",
        themes: ["Female Agency and Subversion", "Epistolary Form and Unreliable Voice", "Social Manipulation", "Motherhood and Neglect", "The Limits of Charm"],
        quotes: [
          { text: "I have always been more in need of a confidant than of a friend.", context: "Lady Susan in a letter to Alicia Johnson" },
          { text: "There is exquisite pleasure in subduing an insolent spirit.", context: "Lady Susan on her conquest of Reginald De Courcy" }
        ],
        readTime: "2 hrs"
      }
    ],
    novelCount: 2,
    shortStoryCount: 1
  },
  {
    id: "fyodor-dostoevsky",
    name: "Fyodor Dostoevsky",
    nationality: "Russian",
    born: 1821,
    died: 1881,
    portrait: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=faces&q=80",
    shortBio: "Dostoevsky plumbed the darkest depths of the human soul, producing novels that redefined psychological fiction forever.",
    fullBio: "Fyodor Mikhailovich Dostoevsky was a Russian novelist, short story writer, essayist, and journalist. Dostoevsky's literary works explore human psychology in the troubled political, social, and spiritual atmospheres of 19th-century Russia, and engage with a variety of philosophical and religious themes. He began his career as a journalist and short story writer before being arrested in 1849 for involvement in a literary discussion group that discussed banned books. He was sentenced to death, then pardoned at the last moment and sent to a Siberian prison camp for four years. This experience transformed his worldview and became a crucible for his later masterpieces.",
    faqs: [
      { question: "What was Dostoevsky's prison experience?", answer: "He spent four years in a Siberian labor camp after a mock execution — an experience that profoundly shaped his spiritual and philosophical worldview." },
      { question: "What is his greatest novel?", answer: "The Brothers Karamazov (1880) is widely considered his masterpiece — a philosophical novel about faith, doubt, and patricide." },
      { question: "How did he influence modern literature?", answer: "He is credited as a forefather of existentialism and modernism, influencing Nietzsche, Kafka, Camus, and virtually all 20th-century psychological fiction." },
      { question: "Was Dostoevsky a gambler?", answer: "Yes — his compulsive gambling led to severe debt and inspired his novella The Gambler, written in just 26 days to meet a publisher's deadline." }
    ],
    stories: [
      {
        id: "crime-and-punishment",
        title: "Crime and Punishment",
        type: "novel",
        year: 1866,
        genre: "Psychological Thriller",
        freeChapters: 2,
        coverUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=420&fit=crop&q=80",
        description: "A destitute student commits murder to test his theory of extraordinary men — and is destroyed by guilt and conscience.",
        synopsis: "Rodion Raskolnikov, a brilliant but destitute ex-student living in a cramped St. Petersburg garret, develops a theory: that certain exceptional people — Napoleons, world-changers — have the moral right to transgress ordinary law for the greater good. To test both his theory and his nerve, he murders a pawnbroker. What follows is not triumphant liberation but a slow psychological disintegration, as Raskolnikov's guilt manifests in fever, paranoia, and compulsive near-confessions. Against the grim tenement backdrop of 1860s St. Petersburg, Dostoevsky populates the novel with unforgettable characters: the relentless detective Porfiry Petrovich, who hunts Raskolnikov not with evidence but psychological pressure; and Sonya Marmeladova, a devout prostitute whose unconditional compassion offers Raskolnikov the only possible path to redemption.",
        themes: ["Extraordinary vs. Ordinary Man", "Guilt and Conscience", "Redemption Through Suffering", "Poverty and Social Degradation", "Rational Theory vs. Human Reality"],
        quotes: [
          { text: "Pain and suffering are always inevitable for a large intelligence and a deep heart.", context: "Raskolnikov's self-justifying philosophy" },
          { text: "To go wrong in one's own way is better than to go right in someone else's.", context: "The novel's moral of authentic self-determination" },
          { text: "Taking a new step, uttering a new word, is what people fear most.", context: "On the paralysis of the intellect" }
        ],
        pages: 671
      },
      {
        id: "the-idiot",
        title: "The Idiot",
        type: "novel",
        year: 1869,
        genre: "Philosophical Fiction",
        freeChapters: 2,
        coverUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=420&fit=crop&q=80",
        description: "A pure, Christlike prince enters corrupt St. Petersburg society and cannot survive contact with a world that despises innocence.",
        synopsis: "Prince Lev Nikolayevich Myshkin, an epileptic who has spent years in a Swiss sanatorium, arrives in St. Petersburg with childlike openness, genuine kindness, and an almost supernatural ability to perceive the inner life of others. Dostoevsky's intention was to portray a truly good man — and to show what the world does to him. Myshkin becomes entangled with two women whose fates consume him: the ravishingly beautiful and self-destructive Nastasya Filippovna, who believes she is irredeemably fallen; and the joyful Aglaya Yepanchin, who represents society and possibility. His pure love for both, and his inability to choose, precipitates tragedy. The novel is Dostoevsky's most directly Christian work — a meditation on whether goodness and innocence have any power in a fallen world.",
        themes: ["Goodness in a Corrupt World", "Christian Compassion", "Beauty and Destruction", "Epilepsy and Spiritual Vision", "The Impossibility of Pure Love"],
        quotes: [
          { text: "Beauty will save the world.", context: "Myshkin's famous declaration — one of literature's most debated lines" },
          { text: "The soul is healed by being with children.", context: "Myshkin on his time with Swiss village children" },
          { text: "There is something at the bottom of every new human thought, every thought of genius, or even every earnest thought that springs up in any brain, which can never be communicated to others.", context: "On the ultimate solitude of consciousness" }
        ],
        pages: 656
      },
      {
        id: "white-nights",
        title: "White Nights",
        type: "short-story",
        year: 1848,
        genre: "Romantic Fiction",
        coverUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&h=420&fit=crop&q=80",
        description: "A lonely dreamer falls in love during four magical St. Petersburg nights — and learns the bittersweet limits of romantic fantasy.",
        synopsis: "During four consecutive White Nights — the midsummer phenomenon when St. Petersburg never fully darkens — a lonely, unnamed dreamer encounters a young woman named Nastenka weeping on an embankment. Over the luminous, almost unreal nights that follow, they confide their lives to each other. The narrator reveals himself as a dreamer, someone who has built an elaborate interior life as a substitute for real experience. Nastenka is waiting for a man she loves who has promised to return. As the narrator falls helplessly in love, the approaching dawn of the fourth night will force both to confront the difference between dream and reality, between fantasy love and the messy truth of actual feeling.",
        themes: ["Dreaming vs. Living", "Unrequited Love", "The Romance of St. Petersburg", "Loneliness and the Interior Life", "Illusion and Disenchantment"],
        quotes: [
          { text: "I am a dreamer. I know so little of real life that I just can't help re-living such moments as these in my dreams.", context: "The narrator describing himself to Nastenka" },
          { text: "Good God, only a minute of bliss? Isn't such a thing sufficient for the whole of a man's life?", context: "The narrator's closing reflection — the story's final line" }
        ],
        readTime: "2.5 hrs"
      },
      {
        id: "the-dream-of-a-ridiculous-man",
        title: "The Dream of a Ridiculous Man",
        type: "short-story",
        year: 1877,
        genre: "Philosophical Fantasy",
        coverUrl: "https://images.unsplash.com/photo-1475669698648-2f144fcaaeb1?w=300&h=420&fit=crop&q=80",
        description: "A man on the verge of suicide dreams of a utopian world untouched by human corruption — and wakes transformed.",
        synopsis: "The narrator — a man who has arrived at complete indifference to the world, convinced that nothing matters — is about to shoot himself when he falls asleep and dreams. He is transported to another Earth, an exact copy of ours but untouched by the Fall — a paradise where the people live in innocent harmony, without sin, shame, or suffering. But gradually, through the narrator's mere presence, this perfect world begins to corrupt: he teaches them lies, they learn pride, they divide and make war. He wakes in anguish, transformed. The story is Dostoevsky's most compressed statement of his faith — that love and goodness are possible and necessary, that the ridiculous man's dream was more real than the waking world that dismissed him.",
        themes: ["Nihilism and Its Defeat", "Paradise Lost", "The Corruption of Innocence", "Dreams as Higher Reality", "The Power of Transformation"],
        quotes: [
          { text: "I suddenly felt that it made no difference to me whether the world existed or whether nothing existed anywhere at all.", context: "The narrator's opening state of radical indifference" },
          { text: "The main thing is to love others as yourself — that's the main thing, and that's everything, nothing more is needed.", context: "The narrator's awakened conviction after the dream" }
        ],
        readTime: "1.5 hrs"
      }
    ],
    novelCount: 2,
    shortStoryCount: 2
  },
  {
    id: "virginia-woolf",
    name: "Virginia Woolf",
    nationality: "British",
    born: 1882,
    died: 1941,
    portrait: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=500&fit=crop&crop=faces&q=80",
    shortBio: "Woolf revolutionized the novel with her stream-of-consciousness technique, capturing the inner life with unmatched poetic intensity.",
    fullBio: "Adeline Virginia Woolf was an English writer, considered one of the most important modernist 20th-century authors and a pioneer in the use of stream of consciousness as a narrative device. Woolf was born into an affluent household in South Kensington, London. Her father was Sir Leslie Stephen, a notable historian, author, and critic. She was largely educated at home, reading widely in her father's library. From 1905 onward, Woolf lived in Bloomsbury, where she became a central figure of the Bloomsbury Group — a circle of intellectuals, philosophers, and artists who shaped British culture between the wars. Despite suffering from severe mental illness throughout her life, she produced a body of work of extraordinary range and beauty.",
    faqs: [
      { question: "What is stream of consciousness?", answer: "A narrative technique that captures a character's unfiltered thought process — associations, memories, and perceptions flowing without conventional structure." },
      { question: "What is the Bloomsbury Group?", answer: "An influential circle of British intellectuals including E.M. Forster, John Maynard Keynes, and Lytton Strachey, centered on Virginia and her sister Vanessa." },
      { question: "How did Woolf's mental illness affect her writing?", answer: "She experienced recurring breakdowns throughout her life, yet these extremes of perception deepened the psychological richness of her work." },
      { question: "What was 'A Room of One's Own' about?", answer: "Her 1929 essay argued that women need financial independence and a private space to create — it became a foundational feminist text." }
    ],
    stories: [
      {
        id: "mrs-dalloway",
        title: "Mrs Dalloway",
        type: "novel",
        year: 1925,
        genre: "Modernist Fiction",
        freeChapters: 1,
        coverUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=420&fit=crop&q=80",
        description: "A single day in post-WWI London seen through the minds of Clarissa Dalloway preparing a party and Septimus Smith haunted by war.",
        synopsis: "On a single June day in 1923 London, Clarissa Dalloway, a society hostess, prepares for the party she will give that evening. Through Woolf's stream-of-consciousness technique, the novel weaves between Clarissa's present perceptions and her memories — a summer in Bourton decades ago, her choice of Richard Dalloway over the passionate Peter Walsh, the road not taken. Running parallel is the story of Septimus Warren Smith, a WWI veteran whose shell shock has broken his connection to reality. They never meet directly, yet their stories rhyme: both confront mortality, social performance, and the weight of consciousness. When news of Septimus's suicide reaches her party, Clarissa feels not horror but a strange kinship — a recognition that his act of escape preserves something she herself has surrendered.",
        themes: ["Time, Memory, and the Present Moment", "The Performance of Social Identity", "Shell Shock and Post-War Trauma", "Life vs. Death as Choices", "The Interior vs. Exterior Self"],
        quotes: [
          { text: "She would not say of anyone in the world now that they were this or were that.", context: "Clarissa's refusal of fixed identity" },
          { text: "I thought how unpleasant it is to be locked out; and I thought how it is worse, perhaps, to be locked in.", context: "On constraint and freedom" },
          { text: "What a lark! What a plunge!", context: "Clarissa's exhilarated opening as she steps into the London morning" }
        ],
        pages: 194
      },
      {
        id: "to-the-lighthouse",
        title: "To the Lighthouse",
        type: "novel",
        year: 1927,
        genre: "Modernist Fiction",
        freeChapters: 1,
        coverUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&h=420&fit=crop&q=80",
        description: "A family's visits to the Isle of Skye over ten years — a meditation on art, time, loss, and the nature of perception.",
        synopsis: "To the Lighthouse is structured in three parts of wildly different scale. In 'The Window,' the Ramsay family and their guests spend an afternoon and evening at their summer house on the Scottish island of Skye, with a proposed trip to a nearby lighthouse perpetually deferred. Woolf captures the minute fluctuations of consciousness — Mrs. Ramsay's tenderness and tragic premonition, Mr. Ramsay's vanity, young James's furious disappointment, artist Lily Briscoe's struggle. Then 'Time Passes' compresses ten years into a few lyrical pages, reporting war deaths and the decay of the empty house with terrible parenthetical casualness. Finally, 'The Lighthouse' — the survivors return, the trip is completed, and Lily at last finishes her painting. The lighthouse itself becomes the most resonant symbol in modernist literature: something always approached, never quite reached.",
        themes: ["Time and Its Erasure", "The Nature of Art and Vision", "Marriage and Gender", "Grief and Survival", "The Attempt to Capture Ephemeral Moments"],
        quotes: [
          { text: "The great revelation had never come. The great revelation perhaps never did come. Instead there were little daily miracles, illuminations, matches struck unexpectedly in the dark.", context: "Lily Briscoe reflecting on life's meaning" },
          { text: "Nothing was simply one thing.", context: "James's recognition of the lighthouse's dual reality" },
          { text: "For nothing was simply one thing. The other Lighthouse was true too.", context: "The novel's central insight about perception and reality" }
        ],
        pages: 209
      },
      {
        id: "the-mark-on-the-wall",
        title: "The Mark on the Wall",
        type: "short-story",
        year: 1917,
        genre: "Modernist Sketch",
        coverUrl: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=420&fit=crop&q=80",
        description: "A narrator's eye catches a mark on the wall, spiraling into a meditative journey through memory, speculation, and the nature of thought.",
        synopsis: "One of the first examples of Woolf's mature style, this sketch begins with a simple observation: the narrator notices an unidentified mark on the white wall opposite. Rather than getting up to examine it, she follows her mind wherever it leads — into speculation about what the mark might be, into memories, into reflections on how we construct reality, into a meditation on human certainty and its absurdity. The outside world intrudes once — a voice mentioning the war — before the mark is finally identified as a snail. The story enacts its own argument: that the wandering, associative mind at rest is as real and as rich as any external event, and that consciousness itself is the true subject of modern literature.",
        themes: ["Stream of Consciousness", "The Nature of Thought", "Certainty vs. Speculation", "Domesticity and the Interior Mind", "Modernist Anti-Narrative"],
        quotes: [
          { text: "I want to think quietly, calmly, spaciously, never to be interrupted, never to have to rise from my chair.", context: "The narrator's ideal of contemplative freedom" },
          { text: "How readily our thoughts swarm upon a new object, lifting it a little way, as ants carry a blade of straw so feverishly, and then leave it.", context: "On the restlessness of the associative mind" }
        ],
        readTime: "30 min"
      }
    ],
    novelCount: 2,
    shortStoryCount: 1
  },
  {
    id: "ernest-hemingway",
    name: "Ernest Hemingway",
    nationality: "American",
    born: 1899,
    died: 1961,
    portrait: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=faces&q=80",
    shortBio: "Hemingway's iceberg prose — spare, muscular, emotionally loaded — defined American literary modernism and earned him the Nobel Prize.",
    fullBio: "Ernest Miller Hemingway was an American novelist, short-story writer, and journalist. His economical and understated style — which he termed the iceberg theory — had a strong influence on 20th-century fiction, while his adventurous lifestyle and his public image brought him admiration from later generations. Hemingway produced most of his work between the mid-1920s and mid-1950s, and he won the Nobel Prize in Literature in 1954. He published seven novels, six short-story collections, and two non-fiction works during his lifetime. A Sun Also Rises (1926) and A Farewell to Arms (1929) are considered his seminal works. He was among the notable expatriate writers of the Lost Generation, living in Paris during the 1920s.",
    faqs: [
      { question: "What is the iceberg theory?", answer: "Hemingway's principle that the surface detail of a story should reveal only a fraction of its meaning — the emotional depth lies beneath, unstated." },
      { question: "What is the Lost Generation?", answer: "American expatriate writers in 1920s Paris — including Hemingway, F. Scott Fitzgerald, and Gertrude Stein — disillusioned by WWI." },
      { question: "When did he win the Nobel Prize?", answer: "In 1954, primarily for The Old Man and the Sea. The committee cited his 'powerful, style-forming mastery of the art of modern narration.'" },
      { question: "How did war shape his writing?", answer: "He served as an ambulance driver in WWI and a correspondent in WWII. Combat and its aftermath became the defining subject of his fiction." }
    ],
    stories: [
      {
        id: "the-old-man-and-the-sea",
        title: "The Old Man and the Sea",
        type: "novel",
        year: 1952,
        genre: "Literary Fiction",
        freeChapters: 1,
        coverUrl: "https://images.unsplash.com/photo-1465929639680-64ee080eb3ed?w=300&h=420&fit=crop&q=80",
        description: "An aging Cuban fisherman battles a great marlin alone at sea — a parable of courage, endurance, and the dignity of the human struggle.",
        synopsis: "Santiago, an aging Cuban fisherman, has gone eighty-four days without catching a fish. On the eighty-fifth day, sailing far beyond the usual waters, he hooks an enormous marlin. For three days and nights, alone in the open Gulf Stream, Santiago battles the great fish — speaking to him, respecting him, feeling something like love for his worthy adversary. When he finally kills the marlin and lashes it to the side of his skiff for the return journey, sharks begin to attack. By the time Santiago reaches shore, only the skeleton remains. But he has not been defeated — not truly. Hemingway's shortest and most intensely focused novel is a meditation on endurance, the contest between human will and natural force, and the dignity available to a person even in absolute loss.",
        themes: ["Human Endurance and Dignity", "Man vs. Nature", "Old Age and Decline", "The Nature of Heroism", "Pride and Humility"],
        quotes: [
          { text: "A man can be destroyed but not defeated.", context: "Santiago's essential credo — the novel's moral center" },
          { text: "Now is no time to think of what you do not have. Think of what you can do with what there is.", context: "Santiago's discipline in the face of scarcity" },
          { text: "Every day is a new day. It is better to be lucky. But I would rather be exact.", context: "On craftsmanship and dedication" }
        ],
        pages: 127
      },
      {
        id: "a-farewell-to-arms",
        title: "A Farewell to Arms",
        type: "novel",
        year: 1929,
        genre: "War Fiction",
        freeChapters: 2,
        coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=420&fit=crop&q=80",
        description: "An American ambulance driver falls in love with a British nurse against the brutal backdrop of the Italian front in WWI.",
        synopsis: "Lieutenant Frederic Henry, an American serving as a volunteer ambulance driver with the Italian army during World War I, falls in love with Catherine Barkley, a British nurse's aide. Their romance deepens from a casual flirtation into desperate mutual need as the war's violence closes in. After Henry is wounded and hospitalized in Milan, they live a brief idyll that cannot last. When the disastrous retreat from Caporetto forces Henry to desert, he and Catherine flee to Switzerland. The novel's ending is one of the most devastating in American fiction — Hemingway strips away war, romance, and hope simultaneously, leaving only the bare fact of loss. It is the novel in which Hemingway most directly asks what, if anything, remains after the world breaks you.",
        themes: ["War and Its Disillusionment", "Love as Refuge from Violence", "Desertion and Loyalty", "Loss and the Absence of Comfort", "Nature and its Indifference"],
        quotes: [
          { text: "The world breaks everyone and afterward many are strong at the broken places.", context: "One of Hemingway's most quoted reflections on resilience" },
          { text: "I had seen nothing sacred, and the things that were glorious had no glory and the sacrifices were like the stockyards at Chicago.", context: "Henry's disillusionment with the language of patriotism" },
          { text: "If people bring so much courage to this world the world has to kill them to break them, so of course it kills them.", context: "The novel's bleak governing logic" }
        ],
        pages: 332
      },
      {
        id: "hills-like-white-elephants",
        title: "Hills Like White Elephants",
        type: "short-story",
        year: 1927,
        genre: "Minimalist Fiction",
        coverUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=420&fit=crop&q=80",
        description: "Two travelers wait for a train at a Spanish station. Their halting conversation about 'the operation' says everything left unsaid.",
        synopsis: "At a train station in the Ebro valley of Spain, an American man and a young woman he calls Jig wait for a train to Madrid. They order drinks and talk, and their conversation circles around something they call 'the operation' — never named, never described. The man wants Jig to have it. He insists it is simple and will make things fine again. Jig is uncertain, perhaps afraid, perhaps already decided against it, though she cannot say so directly. The hills across the dry valley look like white elephants. The story contains almost no description, no interior access, no authorial commentary — only dialogue and the most minimal physical detail. Everything essential is communicated through what the characters cannot say to each other: the operation is an abortion, and their relationship is already over.",
        themes: ["The Unsaid and the Subtext", "Power Dynamics in Relationships", "Choice and Its Consequences", "Communication Breakdown", "Iceberg Theory in Practice"],
        quotes: [
          { text: "They look like white elephants.", context: "Jig's observation — the story's central image of unwanted things" },
          { text: "That's all we do, isn't it — look at things and try new drinks?", context: "Jig on the emptiness of their life together" }
        ],
        readTime: "20 min"
      },
      {
        id: "a-clean-well-lighted-place",
        title: "A Clean, Well-Lighted Place",
        type: "short-story",
        year: 1933,
        genre: "Minimalist Fiction",
        coverUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=420&fit=crop&q=80",
        description: "Two waiters watch an old man drink alone late at night. A meditation on loneliness, nada, and the small mercies of light.",
        synopsis: "Late at night in a Spanish café, an old deaf man sits alone and drinks brandy. Two waiters watch him — the young one impatiently, wanting to close and go home; the older one with a kind of tired solidarity. After the old man leaves, the older waiter lingers, reluctant to face the night. In his mind he recites the Lord's Prayer with the word 'nada' substituted for God and all of creation — a joke that isn't a joke, a prayer to emptiness. The story is Hemingway's most direct statement of his existential worldview: nothingness underlies everything, and the only human response is the creation of small islands of order, light, and dignity against the dark.",
        themes: ["Nothingness and Existentialism", "Solitude and Late-Night Companionship", "Youth vs. Age", "The Comfort of Order and Light", "Dignity in Despair"],
        quotes: [
          { text: "It was all a nothing and a man was nothing too. It was only that and light was all it needed and a certain cleanness and order.", context: "The older waiter's existential meditation" },
          { text: "Our nada who art in nada, nada be thy name.", context: "The older waiter's nihilist Lord's Prayer — one of Hemingway's most famous passages" }
        ],
        readTime: "20 min"
      }
    ],
    novelCount: 2,
    shortStoryCount: 2
  },
  {
    id: "franz-kafka",
    name: "Franz Kafka",
    nationality: "Czech",
    born: 1883,
    died: 1924,
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=faces&q=80&random=kafka",
    shortBio: "Kafka's surreal, bureaucratic nightmares gave the world a new adjective — and a mirror for modern alienation and existential dread.",
    fullBio: "Franz Kafka was a German-speaking Bohemian novelist and short-story writer, widely regarded as one of the major figures of 20th-century literature. His work fuses elements of realism and the fantastic, typically featuring isolated protagonists facing surreal or nightmare-like circumstances. Kafka was born into a middle-class German-speaking Jewish family in Prague. He qualified as a lawyer and obtained employment with an insurance company, writing fiction in his spare time. His relationship with his authoritarian father, detailed in the never-delivered 'Letter to His Father,' is seen as formative. He requested that his friend Max Brod destroy all his manuscripts after his death — Brod famously refused.",
    faqs: [
      { question: "Did Kafka publish during his lifetime?", answer: "He published several short works, but his three major novels — The Trial, The Castle, and Amerika — were published posthumously by his friend Max Brod." },
      { question: "What does 'Kafkaesque' mean?", answer: "Marked by surreal distortion and a nightmarish quality of complexity, especially in interactions with bureaucratic or authoritarian systems." },
      { question: "Why did Kafka ask Brod to destroy his work?", answer: "He was deeply self-critical and saw his writing as incomplete. Brod believed in the work's importance and chose preservation over loyalty to the request." },
      { question: "How did his background influence his themes?", answer: "Being Jewish in Prague, writing in German, working in insurance — his sense of perpetual outsiderness permeates every story he wrote." }
    ],
    stories: [
      {
        id: "the-trial",
        title: "The Trial",
        type: "novel",
        year: 1925,
        genre: "Surrealist Fiction",
        freeChapters: 1,
        coverUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=300&h=420&fit=crop&q=80",
        description: "Josef K. is arrested one morning for a crime that is never named. His futile attempt to navigate an inscrutable legal system ends in execution.",
        synopsis: "On the morning of his thirtieth birthday, Josef K. — a senior bank employee — is arrested by two unidentified agents for an unspecified crime. He is never told what he is charged with, never allowed to confront his accusers, and never shown any actual evidence. Yet the proceedings begin to consume his life, drawing him into a labyrinthine legal system of endless courts, waiting rooms, and officials who speak in circular non-answers. His attempts to defend himself — through lawyers, through personal connections, through appeals to legal procedure — all founder against the system's impenetrability. The novel ends with K. being led into a quarry and executed 'like a dog.' Kafka never completed it, but the fragment is arguably the definitive modern text on bureaucratic dehumanization, guilt without cause, and the individual helpless before institutional power.",
        themes: ["Bureaucracy and Dehumanization", "Guilt Without Origin", "The Absurdity of Authority", "Individual Powerlessness", "Modern Alienation"],
        quotes: [
          { text: "Someone must have slandered Josef K., for one morning, without having done anything wrong, he was arrested.", context: "The novel's famous opening — one of the most arresting in 20th-century fiction" },
          { text: "Logic is no doubt unshakeable, but it cannot withstand a man who wants to go on living.", context: "On the limits of reason against the will to survive" },
          { text: "It's in the nature of this judicial system that one is condemned not only in innocence but also in ignorance.", context: "On the opacity of institutional guilt" }
        ],
        pages: 255
      },
      {
        id: "the-metamorphosis",
        title: "The Metamorphosis",
        type: "short-story",
        year: 1915,
        genre: "Surrealist Fiction",
        coverUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=420&fit=crop&q=80",
        description: "Gregor Samsa wakes one morning transformed into a monstrous insect. His family's repulsion becomes a devastating study in alienation and love.",
        synopsis: "One morning, travelling salesman Gregor Samsa wakes to find himself transformed into an ungeheures Ungeziefer — a monstrous vermin. What is most extraordinary about this premise is how matter-of-factly Kafka proceeds. Gregor's primary concern is not his transformation but whether he will miss his train to work. The novella then becomes a prolonged study of his family's adjustment to his condition: his father's growing disgust and violence, his mother's horrified love, and his sister Grete's initial tenderness that gradually curdles into relief at his death. Gregor, now unable to work, has lost his function as the family's provider — and discovers that without function, he has no place in the world. His death brings the family an almost cheerful sense of liberation. The novella is Kafka's most complete statement of his alienation — from his father, from his work, from his own body.",
        themes: ["Alienation and Estrangement", "The Worker as Commodity", "Family Obligation and Love", "Identity and the Body", "Guilt and Self-Erasure"],
        quotes: [
          { text: "As Gregor Samsa awoke one morning from uneasy dreams he found himself transformed in his bed into a gigantic insect.", context: "Perhaps the most analyzed opening sentence in modern literature" },
          { text: "He thought back on his family with devotion and love. His conviction that he would have to disappear was, if possible, even firmer than his sister's.", context: "Gregor's final selfless realization" }
        ],
        readTime: "2 hrs"
      },
      {
        id: "in-the-penal-colony",
        title: "In the Penal Colony",
        type: "short-story",
        year: 1919,
        genre: "Philosophical Horror",
        coverUrl: "https://images.unsplash.com/photo-1440635592348-167b1b30296f?w=300&h=420&fit=crop&q=80",
        description: "A visitor observes an elaborate torture-execution machine and the officer who worships it — a parable of law, justice, and cruelty.",
        synopsis: "On a remote penal colony, an explorer-visitor is invited by an officer to witness the execution of a condemned soldier. The execution is carried out by an intricate machine — the Harrow — which over the course of twelve hours inscribes the prisoner's violated commandment into his body with needles. The officer, a devoted acolyte of the machine and its deceased inventor, explains its workings with pride. The condemned man does not know his sentence or his crime. The explorer is uncomfortable but equivocal — reluctant to intervene. When he finally refuses to endorse the machine's continuation, the officer strips himself, programs in his own commandment ('Be Just'), and subjects himself to the machine, which breaks apart and kills him without delivering its promised illumination. The story is Kafka's most explicit treatment of justice as violence, law as cruelty, and the machinery of punishment as its own perverse religion.",
        themes: ["Law as Violence", "Bureaucratic Ritual and Cruelty", "Justice Without Mercy", "The Body as Text", "Colonial Power and Observation"],
        quotes: [
          { text: "Guilt is never to be doubted.", context: "The officer's foundational legal principle — the colony's entire judicial philosophy in five words" },
          { text: "My guiding principle is this: Guilt is always beyond doubt.", context: "The officer elaborating on his system of justice" }
        ],
        readTime: "1.5 hrs"
      }
    ],
    novelCount: 1,
    shortStoryCount: 2
  }
];
