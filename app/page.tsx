'use client';

import { useEffect, useMemo, useState } from 'react';

type Language = 'en' | 'ja' | 'zh';
type SectionKey =
  | 'about'
  | 'signature'
  | 'classics'
  | 'howToEat'
  | 'wifi'
  | 'restroom'
  | 'story'
  | 'optionalThree'
  | 'optionalFour';

type Localized = Record<Language, string>;

const DEFAULT_ORDER: SectionKey[] = [
  'about',
  'signature',
  'classics',
  'howToEat',
  'wifi',
  'restroom',
  'story',
  'optionalThree',
  'optionalFour',
];

const languages: { key: Language; label: string }[] = [
  { key: 'en', label: 'EN' },
  { key: 'ja', label: '日本語' },
  { key: 'zh', label: '中文' },
];

const globalCopy: Record<Language, Record<string, string>> = {
  en: {
    prototypeLabel: 'Interactive prototype',
    editLayout: 'Edit section order',
    openNow: 'Open now',
    neighborhood: 'Seongsu · Seoul',
    storeName: 'OKDAM Korean Kitchen',
    tagline: 'A small table for the honest flavors of Seoul, cooked slowly every morning.',
    reviewCount: 'Local favorite · 128 reviews',
    viewMap: 'View map',
    call: 'Call',
    share: 'Share',
    footer: 'A more welcoming neighborhood, in every language.',
    previewSettings: 'Preview settings',
    sectionOrder: 'Section order',
    layoutHelp: 'Drag sections or use the arrow buttons. Sections without content stay hidden from visitors.',
    resetOrder: 'Reset order',
    viewPage: 'View page',
    visible: 'Visible to visitors',
    hidden: 'Hidden · no content',
    copied: 'Wi-Fi password copied',
    shared: 'Link copied',
    updated: 'Section order updated',
    copy: 'Copy',
    signatureBadge: 'Signature',
  },
  ja: {
    prototypeLabel: 'インタラクティブ試作',
    editLayout: 'セクション順を編集',
    openNow: '営業中',
    neighborhood: '聖水 · ソウル',
    storeName: 'オクダム韓食堂',
    tagline: '毎朝じっくり仕込む、ソウルのまっすぐな味を楽しめる小さな食卓です。',
    reviewCount: '地元で人気 · レビュー128件',
    viewMap: '地図を見る',
    call: '電話',
    share: '共有',
    footer: 'すべての言語で、もっと親しみやすい街へ。',
    previewSettings: 'プレビュー設定',
    sectionOrder: 'セクション順',
    layoutHelp: 'ドラッグまたは矢印で並べ替えられます。内容のないセクションは自動で非表示になります。',
    resetOrder: '順番を戻す',
    viewPage: 'ページを見る',
    visible: '訪問者に表示',
    hidden: '非表示 · 内容なし',
    copied: 'Wi-Fiパスワードをコピーしました',
    shared: 'リンクをコピーしました',
    updated: 'セクション順を更新しました',
    copy: 'コピー',
    signatureBadge: 'おすすめ',
  },
  zh: {
    prototypeLabel: '交互式原型',
    editLayout: '编辑栏目顺序',
    openNow: '营业中',
    neighborhood: '圣水 · 首尔',
    storeName: '玉潭韩食馆',
    tagline: '每天清晨慢火烹制，在小小的餐桌上品尝首尔朴实的味道。',
    reviewCount: '本地人喜爱 · 128条评价',
    viewMap: '查看地图',
    call: '电话',
    share: '分享',
    footer: '用每一种语言，让街区更加友好。',
    previewSettings: '预览设置',
    sectionOrder: '栏目顺序',
    layoutHelp: '拖动栏目或使用箭头排序。没有内容的栏目会自动对访客隐藏。',
    resetOrder: '恢复顺序',
    viewPage: '查看页面',
    visible: '对访客显示',
    hidden: '已隐藏 · 无内容',
    copied: 'Wi-Fi密码已复制',
    shared: '链接已复制',
    updated: '栏目顺序已更新',
    copy: '复制',
    signatureBadge: '招牌',
  },
};

const sectionMeta: Record<SectionKey, { kicker: Localized; title: Localized; nav: Localized; description: Localized }> = {
  about: {
    kicker: { en: 'Store information', ja: '店舗情報', zh: '店铺信息' },
    title: { en: 'Good food starts with good basics.', ja: '基本を大切にした、まっすぐな料理。', zh: '好味道，从认真做好基本开始。' },
    nav: { en: 'About', ja: '店舗', zh: '店铺' },
    description: {
      en: 'Everything you need before you visit, from opening hours to the nearest subway exit.',
      ja: '営業時間から最寄りの地下鉄出口まで、来店前に必要な情報をまとめました。',
      zh: '从营业时间到最近的地铁出口，来店前需要的信息都在这里。',
    },
  },
  signature: {
    kicker: { en: 'Menu · 01', ja: 'メニュー · 01', zh: '菜单 · 01' },
    title: { en: 'House signatures', ja: '店の看板料理', zh: '本店招牌' },
    nav: { en: 'Signatures', ja: 'おすすめ', zh: '招牌' },
    description: {
      en: 'The dishes regulars return for. Photos and descriptions appear only when the owner adds them.',
      ja: '常連客が何度も注文する料理。写真と説明は、店主が登録した場合のみ表示されます。',
      zh: '熟客一次次回来点的菜。只有店主录入后，才会显示照片和说明。',
    },
  },
  classics: {
    kicker: { en: 'Menu · 02', ja: 'メニュー · 02', zh: '菜单 · 02' },
    title: { en: 'Rice & warm bowls', ja: 'ご飯と温かい一椀', zh: '米饭与暖汤' },
    nav: { en: 'Rice & soup', ja: 'ご飯・スープ', zh: '饭与汤' },
    description: {
      en: 'Comforting everyday dishes served with rice and five house-made side dishes.',
      ja: 'ご飯と手作りのおかず5品が付く、毎日食べたい温かな料理です。',
      zh: '暖心的日常料理，配米饭与五种店内自制小菜。',
    },
  },
  howToEat: {
    kicker: { en: 'Local tip', ja: '食べ方', zh: '美味吃法' },
    title: { en: 'How to enjoy your meal', ja: 'もっとおいしく楽しむ方法', zh: '这样吃更美味' },
    nav: { en: 'How to eat', ja: '食べ方', zh: '吃法' },
    description: {
      en: 'A short guide from the owner, placed high on the page when it matters most.',
      ja: '店主からの短い案内。大切な内容ならページ上部へ移動できます。',
      zh: '来自店主的简短说明。重要内容可移动到页面上方。',
    },
  },
  wifi: {
    kicker: { en: 'Guest information', ja: 'ご案内', zh: '顾客信息' },
    title: { en: 'Wi-Fi', ja: 'Wi-Fi', zh: 'Wi-Fi' },
    nav: { en: 'Wi-Fi', ja: 'Wi-Fi', zh: 'Wi-Fi' },
    description: {
      en: 'Free guest Wi-Fi is available throughout the restaurant.',
      ja: '店内では無料Wi-Fiをご利用いただけます。',
      zh: '店内提供免费Wi-Fi。',
    },
  },
  restroom: {
    kicker: { en: 'Guest information', ja: 'ご案内', zh: '顾客信息' },
    title: { en: 'Restroom', ja: 'お手洗い', zh: '洗手间' },
    nav: { en: 'Restroom', ja: 'お手洗い', zh: '洗手间' },
    description: {
      en: 'The restroom is inside the restaurant. No door code is needed.',
      ja: 'お手洗いは店内にあります。暗証番号は必要ありません。',
      zh: '洗手间位于店内，无需门锁密码。',
    },
  },
  story: {
    kicker: { en: 'Our story', ja: '店の物語', zh: '我们的故事' },
    title: { en: 'A broth passed down for 37 years.', ja: '37年受け継がれてきた出汁。', zh: '传承37年的一锅汤。' },
    nav: { en: 'Our story', ja: '店の物語', zh: '品牌故事' },
    description: {
      en: 'An owner-written section appears only when there is a story worth telling.',
      ja: '伝えたい物語がある時だけ、店主が書いた自由セクションを表示できます。',
      zh: '只有在值得讲述时，店主撰写的自由内容才会出现在店铺页面。',
    },
  },
  optionalThree: {
    kicker: { en: 'Optional section · 03', ja: '自由項目 · 03', zh: '自由栏目 · 03' },
    title: { en: 'Seasonal notice', ja: '季節のお知らせ', zh: '时令通知' },
    nav: { en: 'Seasonal', ja: '季節', zh: '时令' },
    description: { en: '', ja: '', zh: '' },
  },
  optionalFour: {
    kicker: { en: 'Optional section · 04', ja: '自由項目 · 04', zh: '自由栏目 · 04' },
    title: { en: 'Visitor note', ja: 'ご来店案内', zh: '到店须知' },
    nav: { en: 'Visitor note', ja: 'ご案内', zh: '到店须知' },
    description: { en: '', ja: '', zh: '' },
  },
};

const menuGroups: Record<'signature' | 'classics', Array<{
  korean: string;
  name: Localized;
  description: Localized;
  price: string;
  image: string;
  signature?: boolean;
}>> = {
  signature: [
    {
      korean: '들깨 수제비',
      name: { en: 'Perilla Seed Sujebi', ja: 'エゴマすいとん', zh: '紫苏籽面片汤' },
      description: {
        en: 'Hand-torn dough in a nutty perilla broth with potato and oyster mushroom.',
        ja: '香ばしいエゴマのスープに、手ちぎり生地、じゃがいも、ヒラタケを合わせました。',
        zh: '手撕面片配浓香紫苏籽汤，加入土豆与平菇。',
      },
      price: '₩12,000',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=82',
      signature: true,
    },
    {
      korean: '한우 떡갈비',
      name: { en: 'Hanwoo Tteokgalbi', ja: '韓牛トッカルビ', zh: '韩牛肉饼' },
      description: {
        en: 'Charcoal-grilled Korean beef patty, pear soy glaze, and seasonal greens.',
        ja: '炭火で焼いた韓牛のハンバーグに、梨入り醤油だれと季節の青菜を添えました。',
        zh: '炭火烤韩牛牛肉饼，配梨香酱油汁与时令蔬菜。',
      },
      price: '₩19,000',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82',
      signature: true,
    },
  ],
  classics: [
    {
      korean: '장어탕',
      name: { en: 'Freshwater Eel Soup', ja: 'うなぎの滋養スープ', zh: '鳗鱼滋补汤' },
      description: {
        en: 'A rich 12-hour broth with tender eel. Deeply savory and not spicy.',
        ja: '12時間煮込んだ濃厚な出汁と柔らかなうなぎ。辛くありません。',
        zh: '慢熬12小时的浓郁汤底与软嫩鳗鱼，不辣。',
      },
      price: '₩15,000',
      image: 'https://images.unsplash.com/photo-1547928576-b822bc410bdf?auto=format&fit=crop&w=900&q=82',
    },
    {
      korean: '나물 비빔밥',
      name: { en: 'Seasonal Bibimbap', ja: '季節のナムルビビンバ', zh: '时蔬拌饭' },
      description: {
        en: 'Seven vegetables, fried egg, sesame oil, and mild gochujang served separately.',
        ja: '7種の野菜、目玉焼き、ごま油。辛さ控えめのコチュジャンは別添えです。',
        zh: '七种蔬菜、煎蛋和芝麻油，微辣辣椒酱另放。',
      },
      price: '₩11,000',
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=900&q=82',
    },
  ],
};

const aboutCopy = {
  quote: {
    en: '“We make the kind of food we would serve to our own family.”',
    ja: '「家族に出したいと思える料理を作ります。」',
    zh: '“我们做的，是愿意端给自己家人的饭菜。”',
  },
  body: {
    en: 'OKDAM is a neighborhood Korean kitchen run by two generations of the Han family. Our stocks simmer from dawn, and every side dish is made in the restaurant.',
    ja: 'オクダムは、ハン一家が二代にわたり営む街の韓食堂です。夜明けから出汁を取り、すべてのおかずを店内で手作りしています。',
    zh: '玉潭是韩氏一家两代经营的社区韩餐馆。汤底从清晨开始熬制，每一道小菜都在店内亲手制作。',
  },
};

const infoRows: Array<{ label: Localized; value: Localized }> = [
  {
    label: { en: 'Address', ja: '住所', zh: '地址' },
    value: { en: '24 Yeonmujang-gil, Seongdong-gu, Seoul', ja: 'ソウル特別市 城東区 練武場キル24', zh: '首尔特别市 城东区 练武场街24' },
  },
  {
    label: { en: 'Hours', ja: '営業時間', zh: '营业时间' },
    value: { en: '11:30–21:00 · Break 15:00–17:00', ja: '11:30–21:00 · 休憩 15:00–17:00', zh: '11:30–21:00 · 休息 15:00–17:00' },
  },
  {
    label: { en: 'Phone', ja: '電話', zh: '电话' },
    value: { en: '+82 2-3409-1287', ja: '+82 2-3409-1287', zh: '+82 2-3409-1287' },
  },
  {
    label: { en: 'Subway', ja: '地下鉄', zh: '地铁' },
    value: { en: '6 min from Seongsu Station Exit 3', ja: '聖水駅3番出口から徒歩6分', zh: '距圣水站3号出口步行6分钟' },
  },
];

const howToSteps: Array<{ title: Localized; body: Localized }> = [
  {
    title: { en: 'Taste the broth first', ja: 'まずスープをそのまま', zh: '先尝一口原汤' },
    body: {
      en: 'Try one spoonful before adding anything. The perilla and anchovy stock is already seasoned.',
      ja: '薬味を入れる前に、まずひと口。エゴマと煮干しの出汁はそのままで味が整っています。',
      zh: '加调料前先喝一勺。紫苏籽与鳀鱼汤底已经调好味。',
    },
  },
  {
    title: { en: 'Mix the bibimbap gently', ja: 'ビビンバはやさしく混ぜる', zh: '轻轻拌匀拌饭' },
    body: {
      en: 'Add half the gochujang first. Mix from the bottom so the vegetables keep their texture.',
      ja: 'コチュジャンはまず半分。底からやさしく混ぜると野菜の食感が残ります。',
      zh: '先放一半辣椒酱，从底部轻轻拌，让蔬菜保留口感。',
    },
  },
  {
    title: { en: 'Wrap the last bite', ja: '最後のひと口は葉で包む', zh: '最后一口用菜叶包着吃' },
    body: {
      en: 'Put a little rice, tteokgalbi, and kimchi in a lettuce leaf for the owner’s favorite bite.',
      ja: 'サンチュに少量のご飯、トッカルビ、キムチを包むのが店主おすすめです。',
      zh: '生菜里放一点米饭、肉饼和泡菜，这是店主最喜欢的一口。',
    },
  },
];

const restroomCopy = {
  title: { en: 'Past the counter, on your left', ja: 'レジを過ぎて左側です', zh: '经过收银台后在左侧' },
  body: {
    en: 'The doorway is narrow. Please ask our staff if you need an accessible restroom nearby.',
    ja: '入口が狭いため、バリアフリートイレが必要な場合はスタッフにお声がけください。',
    zh: '入口较窄，如需附近的无障碍洗手间，请咨询工作人员。',
  },
};

const storyCopy = {
  quote: {
    en: '“Slow food is our way of welcoming you.”',
    ja: '「ゆっくり作ることが、私たちのおもてなしです。」',
    zh: '“慢慢做一顿饭，就是我们的待客之道。”',
  },
  body: {
    en: 'My mother opened a six-seat lunch counter in 1989. We moved twice, grew a little, and kept the same stockpot. Today, the second generation still starts the broth before sunrise.',
    ja: '母が1989年に6席の食堂を開きました。二度の移転を経て少し大きくなりましたが、寸胴鍋は同じです。今も二代目が夜明け前から出汁を取ります。',
    zh: '母亲在1989年开了一间只有六个座位的小饭馆。两次搬迁后店铺大了一些，那口汤锅却一直没换。如今第二代仍在天亮前开始熬汤。',
  },
};

const hasContent = (key: SectionKey) => !['optionalThree', 'optionalFour'].includes(key);

function SectionHeading({ section, language }: { section: SectionKey; language: Language }) {
  const meta = sectionMeta[section];
  return (
    <header className="section-heading">
      <div>
        <p className="section-kicker">{meta.kicker[language]}</p>
        <h2>{meta.title[language]}</h2>
      </div>
      <p className="section-heading__description">{meta.description[language]}</p>
    </header>
  );
}

function MenuSection({ section, language, signatureLabel }: { section: 'signature' | 'classics'; language: Language; signatureLabel: string }) {
  return (
    <section className="content-section" id={`section-${section}`}>
      <SectionHeading section={section} language={language} />
      <div className="menu-grid">
        {menuGroups[section].map((item) => (
          <article className="menu-card" key={item.korean}>
            <div className="menu-card__image" style={{ backgroundImage: `url('${item.image}')` }} role="img" aria-label={item.name[language]} />
            <div className="menu-card__body">
              <div className="menu-card__topline">
                <div><h3>{item.name[language]}</h3><p className="menu-card__korean">{item.korean}</p></div>
                <p className="menu-card__price">{item.price}</p>
              </div>
              <p className="menu-card__description">{item.description[language]}</p>
              {item.signature ? <span className="signature-badge">{signatureLabel}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [order, setOrder] = useState<SectionKey[]>(DEFAULT_ORDER);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dragging, setDragging] = useState<SectionKey | null>(null);
  const [toast, setToast] = useState('');
  const text = globalCopy[language];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('many-language') as Language | null;
    const savedOrder = window.localStorage.getItem('many-section-order');
    if (savedLanguage && languages.some((item) => item.key === savedLanguage)) setLanguage(savedLanguage);
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder) as SectionKey[];
        if (DEFAULT_ORDER.every((key) => parsed.includes(key))) setOrder(parsed);
      } catch {
        window.localStorage.removeItem('many-section-order');
      }
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('drawer-open', drawerOpen);
    return () => document.body.classList.remove('drawer-open');
  }, [drawerOpen]);

  const visibleSections = useMemo(() => order.filter(hasContent), [order]);

  function selectLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    window.localStorage.setItem('many-language', nextLanguage);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 1800);
  }

  function updateOrder(nextOrder: SectionKey[]) {
    setOrder(nextOrder);
    window.localStorage.setItem('many-section-order', JSON.stringify(nextOrder));
  }

  function moveSection(key: SectionKey, direction: -1 | 1) {
    const currentIndex = order.indexOf(key);
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= order.length) return;
    const nextOrder = [...order];
    [nextOrder[currentIndex], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[currentIndex]];
    updateOrder(nextOrder);
  }

  function dropSection(targetKey: SectionKey) {
    if (!dragging || dragging === targetKey || !hasContent(targetKey)) return;
    const nextOrder = order.filter((key) => key !== dragging);
    nextOrder.splice(nextOrder.indexOf(targetKey), 0, dragging);
    updateOrder(nextOrder);
    setDragging(null);
  }

  async function copyValue(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      showToast(message);
    } catch {
      showToast(message);
    }
  }

  async function sharePage() {
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url: window.location.href });
        return;
      } catch {
        return;
      }
    }
    await copyValue(window.location.href, text.shared);
  }

  function renderSection(section: SectionKey) {
    if (section === 'about') {
      return (
        <section className="content-section" id="section-about" key={section}>
          <SectionHeading section="about" language={language} />
          <div className="about-grid">
            <article className="about-story">
              <p className="about-story__quote">{aboutCopy.quote[language]}</p>
              <p className="about-story__body">{aboutCopy.body[language]}</p>
            </article>
            <dl className="info-panel">
              {infoRows.map((row) => (
                <div className="info-row" key={row.label.en}>
                  <dt>{row.label[language]}</dt><dd>{row.value[language]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      );
    }
    if (section === 'signature' || section === 'classics') {
      return <MenuSection section={section} language={language} signatureLabel={text.signatureBadge} key={section} />;
    }
    if (section === 'howToEat') {
      return (
        <section className="content-section" id="section-howToEat" key={section}>
          <SectionHeading section="howToEat" language={language} />
          <div className="detail-grid">
            {howToSteps.map((step, index) => (
              <article className={`detail-card ${index === 2 ? 'detail-card--wide detail-card--dark' : ''}`} key={step.title.en}>
                <span className="detail-card__number">0{index + 1}</span>
                <h3>{step.title[language]}</h3><p>{step.body[language]}</p>
              </article>
            ))}
          </div>
        </section>
      );
    }
    if (section === 'wifi') {
      return (
        <section className="content-section" id="section-wifi" key={section}>
          <SectionHeading section="wifi" language={language} />
          <article className="detail-card detail-card--wide detail-card--sage">
            <span className="detail-card__number">Wi</span>
            <h3>OKDAM_GUEST</h3>
            <p>{language === 'en' ? 'Password' : language === 'ja' ? 'パスワード' : '密码'}</p>
            <div className="wifi-password"><code>okdam2026!</code><button className="copy-button" type="button" onClick={() => copyValue('okdam2026!', text.copied)}>{text.copy}</button></div>
          </article>
        </section>
      );
    }
    if (section === 'restroom') {
      return (
        <section className="content-section" id="section-restroom" key={section}>
          <SectionHeading section="restroom" language={language} />
          <article className="detail-card detail-card--wide">
            <span className="detail-card__number">WC</span><h3>{restroomCopy.title[language]}</h3><p>{restroomCopy.body[language]}</p>
          </article>
        </section>
      );
    }
    if (section === 'story') {
      return (
        <section className="content-section" id="section-story" key={section}>
          <SectionHeading section="story" language={language} />
          <article className="story-layout">
            <div className="story-layout__image" role="img" aria-label="The owner preparing food in the restaurant" />
            <div className="story-layout__body"><blockquote>{storyCopy.quote[language]}</blockquote><p>{storyCopy.body[language]}</p></div>
          </article>
        </section>
      );
    }
    return null;
  }

  return (
    <>
      <div className="prototype-bar">
        <div className="prototype-bar__copy"><span className="prototype-dot" /><span>{text.prototypeLabel}</span></div>
        <button className="prototype-bar__button" type="button" onClick={() => setDrawerOpen(true)}>☷ <span>{text.editLayout}</span></button>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="MANY Local home">
          <span className="brand__wordmark">Many</span><span className="brand__divider" /><span className="brand__product">LOCAL</span>
        </a>
        <div className="language-switcher" role="group" aria-label="Language">
          {languages.map((item) => (
            <button className={`language-button ${language === item.key ? 'is-active' : ''}`} type="button" aria-pressed={language === item.key} key={item.key} onClick={() => selectLanguage(item.key)}>{item.label}</button>
          ))}
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="storeName">
          <div className="hero__image" role="img" aria-label="A table filled with Korean food" />
          <div className="hero__content">
            <div className="hero__eyebrow"><span className="status-pill"><span /><b>{text.openNow}</b></span><span>{text.neighborhood}</span></div>
            <p className="hero__korean-name">옥담 한식당</p><h1 id="storeName">{text.storeName}</h1>
            <p className="hero__description">{text.tagline}</p>
            <div className="hero__meta"><span><b>4.8</b> ★</span><span>{text.reviewCount}</span></div>
          </div>
        </section>

        <section className="quick-actions" aria-label="Store actions">
          <a className="quick-action" href="https://maps.google.com/?q=Seongsu+Seoul" target="_blank" rel="noreferrer"><span className="quick-action__icon">⌖</span><span>{text.viewMap}</span></a>
          <a className="quick-action" href="tel:+82234091287"><span className="quick-action__icon">☎</span><span>{text.call}</span></a>
          <button className="quick-action" type="button" onClick={sharePage}><span className="quick-action__icon">↗</span><span>{text.share}</span></button>
        </section>

        <nav className="section-nav" aria-label="Page sections">
          {visibleSections.map((section) => <a href={`#section-${section}`} key={section}>{sectionMeta[section].nav[language]}</a>)}
        </nav>

        <div className="section-stack">{visibleSections.map(renderSection)}</div>
      </main>

      <footer className="site-footer">
        <div className="site-footer__brand"><span className="brand__wordmark">Many</span><span>LOCAL</span></div>
        <p>{text.footer}</p><p className="site-footer__prototype">Sample store and content for prototype use.</p>
      </footer>

      <div className="drawer-backdrop" hidden={!drawerOpen} onClick={() => setDrawerOpen(false)} />
      <aside className={`layout-drawer ${drawerOpen ? 'is-open' : ''}`} aria-hidden={!drawerOpen} aria-labelledby="layoutTitle">
        <div className="layout-drawer__header">
          <div><p className="eyebrow">{text.previewSettings}</p><h2 id="layoutTitle">{text.sectionOrder}</h2></div>
          <button className="icon-button" type="button" aria-label="Close section editor" onClick={() => setDrawerOpen(false)}>×</button>
        </div>
        <p className="layout-drawer__intro">{text.layoutHelp}</p>
        <div className="layout-list">
          {order.map((section, index) => {
            const empty = !hasContent(section);
            return (
              <div
                className={`layout-item ${empty ? 'is-empty' : ''} ${dragging === section ? 'is-dragging' : ''}`}
                data-layout-key={section}
                draggable={!empty}
                key={section}
                onDragStart={() => setDragging(section)}
                onDragEnd={() => setDragging(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => dropSection(section)}
              >
                <span className="layout-item__handle">⠿</span>
                <div className="layout-item__copy"><strong>{sectionMeta[section].title[language]}</strong><span>{empty ? text.hidden : text.visible}</span></div>
                <div className="layout-item__actions">
                  <button className="move-button" type="button" aria-label="Move up" disabled={empty || index === 0} onClick={() => moveSection(section, -1)}>↑</button>
                  <button className="move-button" type="button" aria-label="Move down" disabled={empty || index === order.length - 1} onClick={() => moveSection(section, 1)}>↓</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="layout-drawer__footer">
          <button className="secondary-button" type="button" onClick={() => updateOrder(DEFAULT_ORDER)}>{text.resetOrder}</button>
          <button className="primary-button" type="button" onClick={() => { setDrawerOpen(false); showToast(text.updated); }}>{text.viewPage}</button>
        </div>
      </aside>

      <div className={`toast ${toast ? 'is-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
