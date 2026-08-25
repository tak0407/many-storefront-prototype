'use client';

import { useEffect, useMemo, useState } from 'react';

type StepKey = 'store' | 'menu' | 'guide' | 'order';
type SectionKey = 'store' | 'signature' | 'classics' | 'howToEat' | 'wifi' | 'restroom' | 'story';

type StoreDraft = {
  name: string;
  shortDescription: string;
  introduction: string;
  address: string;
  phone: string;
  hours: string;
  wifiName: string;
  wifiPassword: string;
  restroom: string;
  howToEat: string;
  story: string;
};

type MenuItem = {
  id: number;
  category: 'signature' | 'classics';
  name: string;
  description: string;
  price: string;
};

const initialStore: StoreDraft = {
  name: '옥담 한식당',
  shortDescription: '매일 아침 천천히 준비한 서울의 정직한 맛',
  introduction: '옥담은 한씨 가족이 2대째 운영하는 동네 한식당입니다. 새벽부터 국물을 우리고 모든 반찬을 매장에서 직접 만듭니다.',
  address: '서울특별시 성동구 연무장길 24',
  phone: '02-3409-1287',
  hours: '11:30–21:00 · 쉬는 시간 15:00–17:00',
  wifiName: 'OKDAM_GUEST',
  wifiPassword: 'okdam2026!',
  restroom: '계산대를 지나 왼쪽에 있습니다. 별도 비밀번호는 없습니다.',
  howToEat: '비빔밥은 고추장을 절반만 넣고 아래에서부터 가볍게 섞어주세요.',
  story: '어머니가 1989년 여섯 자리 작은 식당을 열었습니다. 지금도 2대째 같은 솥에 국물을 준비합니다.',
};

const initialMenu: MenuItem[] = [
  { id: 1, category: 'signature', name: '들깨 수제비', description: '고소한 들깨 국물과 손으로 뜯은 반죽', price: '12,000' },
  { id: 2, category: 'signature', name: '한우 떡갈비', description: '숯불에 구운 한우와 배 간장 소스', price: '19,000' },
  { id: 3, category: 'classics', name: '장어탕', description: '12시간 우린 깊고 구수한 국물', price: '15,000' },
];

const initialOrder: SectionKey[] = ['store', 'signature', 'classics', 'howToEat', 'wifi', 'restroom', 'story'];

const sectionLabels: Record<SectionKey, string> = {
  store: '가게 정보',
  signature: '대표 메뉴',
  classics: '밥과 국',
  howToEat: '맛있게 먹는 법',
  wifi: '와이파이',
  restroom: '화장실',
  story: '가게 이야기',
};

const steps: Array<{ key: StepKey; number: string; label: string; helper: string }> = [
  { key: 'store', number: '01', label: '가게 정보', helper: '이름·소개·영업정보' },
  { key: 'menu', number: '02', label: '메뉴', helper: '메뉴명·가격·설명' },
  { key: 'guide', number: '03', label: '이용 안내', helper: '와이파이·화장실·추가 정보' },
  { key: 'order', number: '04', label: '순서와 공개', helper: '섹션 순서·언어 확인' },
];

function Field({ label, value, onChange, placeholder, multiline = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <label className="builder-field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} rows={4} />
      ) : (
        <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

export default function BuilderPage() {
  const [activeStep, setActiveStep] = useState<StepKey>('store');
  const [store, setStore] = useState<StoreDraft>(initialStore);
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [order, setOrder] = useState<SectionKey[]>(initialOrder);
  const [toast, setToast] = useState('');
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem('many-builder-draft');
    if (!saved) return;
    try {
      const draft = JSON.parse(saved) as { store?: StoreDraft; menu?: MenuItem[]; order?: SectionKey[] };
      if (draft.store) setStore(draft.store);
      if (draft.menu) setMenu(draft.menu);
      if (draft.order) setOrder(draft.order);
    } catch {
      window.localStorage.removeItem('many-builder-draft');
    }
  }, []);

  const visibleOrder = useMemo(
    () => order.filter((section) => {
      if (section === 'wifi') return Boolean(store.wifiName || store.wifiPassword);
      if (section === 'restroom') return Boolean(store.restroom);
      if (section === 'howToEat') return Boolean(store.howToEat);
      if (section === 'story') return Boolean(store.story);
      if (section === 'signature' || section === 'classics') return menu.some((item) => item.category === section && item.name);
      return true;
    }),
    [menu, order, store],
  );

  function updateStore(key: keyof StoreDraft, value: string) {
    setStore((current) => ({ ...current, [key]: value }));
  }

  function updateMenu(id: number, key: 'name' | 'description' | 'price', value: string) {
    setMenu((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  }

  function updateMenuCategory(id: number, category: MenuItem['category']) {
    setMenu((current) => current.map((item) => (item.id === id ? { ...item, category } : item)));
  }

  function addMenuItem() {
    const nextId = Math.max(0, ...menu.map((item) => item.id)) + 1;
    setMenu((current) => [...current, { id: nextId, category: 'classics', name: '', description: '', price: '' }]);
  }

  function removeMenuItem(id: number) {
    setMenu((current) => current.filter((item) => item.id !== id));
  }

  function moveSection(section: SectionKey, direction: -1 | 1) {
    const currentIndex = order.indexOf(section);
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= order.length) return;
    const nextOrder = [...order];
    [nextOrder[currentIndex], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[currentIndex]];
    setOrder(nextOrder);
  }

  function saveDraft(message = '작성 중인 내용을 이 브라우저에 저장했습니다') {
    window.localStorage.setItem('many-builder-draft', JSON.stringify({ store, menu, order }));
    setSavedAt(new Intl.DateTimeFormat('ko-KR', { hour: '2-digit', minute: '2-digit' }).format(new Date()));
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }

  function goNext() {
    const index = steps.findIndex((step) => step.key === activeStep);
    if (index < steps.length - 1) setActiveStep(steps[index + 1].key);
    else saveDraft('프로토타입 저장 완료 · 실제 발행은 회원가입과 저장 기능 연결 후 가능합니다');
  }

  function renderEditor() {
    if (activeStep === 'store') {
      return (
        <div className="builder-form-grid">
          <Field label="가게 이름" value={store.name} onChange={(value) => updateStore('name', value)} />
          <Field label="한 줄 소개" value={store.shortDescription} onChange={(value) => updateStore('shortDescription', value)} />
          <div className="builder-field--wide"><Field label="가게 설명" value={store.introduction} onChange={(value) => updateStore('introduction', value)} multiline /></div>
          <Field label="주소" value={store.address} onChange={(value) => updateStore('address', value)} />
          <Field label="전화번호" value={store.phone} onChange={(value) => updateStore('phone', value)} />
          <div className="builder-field--wide"><Field label="영업시간" value={store.hours} onChange={(value) => updateStore('hours', value)} /></div>
        </div>
      );
    }

    if (activeStep === 'menu') {
      return (
        <div className="builder-menu-editor">
          {menu.map((item, index) => (
            <article className="builder-menu-item" key={item.id}>
              <div className="builder-menu-item__header">
                <strong>메뉴 {index + 1}</strong>
                <button type="button" onClick={() => removeMenuItem(item.id)}>삭제</button>
              </div>
              <label className="builder-field">
                <span>메뉴 분류</span>
                <select value={item.category} onChange={(event) => updateMenuCategory(item.id, event.target.value as MenuItem['category'])}>
                  <option value="signature">대표 메뉴</option>
                  <option value="classics">밥과 국</option>
                </select>
              </label>
              <div className="builder-form-grid">
                <Field label="메뉴 이름" value={item.name} onChange={(value) => updateMenu(item.id, 'name', value)} placeholder="예: 들깨 수제비" />
                <Field label="가격" value={item.price} onChange={(value) => updateMenu(item.id, 'price', value.replace(/[^0-9,]/g, ''))} placeholder="12,000" />
                <div className="builder-field--wide"><Field label="한 줄 설명" value={item.description} onChange={(value) => updateMenu(item.id, 'description', value)} /></div>
              </div>
            </article>
          ))}
          <button className="builder-add-button" type="button" onClick={addMenuItem}>＋ 메뉴 추가</button>
        </div>
      );
    }

    if (activeStep === 'guide') {
      return (
        <div className="builder-guide-grid">
          <article className="builder-guide-card"><h3>와이파이</h3><Field label="네트워크 이름" value={store.wifiName} onChange={(value) => updateStore('wifiName', value)} /><Field label="비밀번호" value={store.wifiPassword} onChange={(value) => updateStore('wifiPassword', value)} /></article>
          <article className="builder-guide-card"><h3>화장실</h3><Field label="위치와 이용 안내" value={store.restroom} onChange={(value) => updateStore('restroom', value)} multiline /></article>
          <article className="builder-guide-card"><h3>맛있게 먹는 법</h3><Field label="사장님의 안내" value={store.howToEat} onChange={(value) => updateStore('howToEat', value)} multiline /></article>
          <article className="builder-guide-card"><h3>가게 이야기</h3><Field label="가게의 유래나 소개" value={store.story} onChange={(value) => updateStore('story', value)} multiline /></article>
          <p className="builder-empty-note">내용을 비워두면 해당 섹션은 방문자 페이지에서 자동으로 숨겨집니다.</p>
        </div>
      );
    }

    return (
      <div className="builder-order-panel">
        <div className="builder-language-box">
          <div><p>공개 언어</p><h3>한국어 원문 + 자동 번역 3개 언어</h3></div>
          <div><span>한국어</span><span>English</span><span>日本語</span><span>中文</span></div>
        </div>
        <p className="builder-order-help">방문자에게 보여줄 순서를 정해주세요. 비어 있는 섹션은 순서와 관계없이 숨겨집니다.</p>
        <div className="builder-order-list">
          {order.map((section, index) => {
            const visible = visibleOrder.includes(section);
            return (
              <article className={!visible ? 'is-empty' : ''} key={section}>
                <span>⠿</span>
                <div><strong>{sectionLabels[section]}</strong><small>{visible ? '공개 페이지에 표시' : '내용 없음 · 자동 숨김'}</small></div>
                <div><button type="button" disabled={index === 0} onClick={() => moveSection(section, -1)}>↑</button><button type="button" disabled={index === order.length - 1} onClick={() => moveSection(section, 1)}>↓</button></div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  function renderPreviewSection(section: SectionKey) {
    if (section === 'store') {
      return <section className="builder-preview-about" key={section}><p>{store.introduction || '가게 설명을 입력해주세요.'}</p><dl><div><dt>주소</dt><dd>{store.address}</dd></div><div><dt>영업시간</dt><dd>{store.hours}</dd></div><div><dt>전화</dt><dd>{store.phone}</dd></div></dl></section>;
    }
    if (section === 'signature' || section === 'classics') {
      const items = menu.filter((item) => item.category === section && item.name);
      return <section className="builder-preview-section" key={section}><p className="builder-preview-kicker">메뉴</p><h3>{sectionLabels[section]}</h3><div className="builder-preview-menu">{items.map((item) => <article key={item.id}><div><strong>{item.name}</strong><small>{item.description}</small></div><b>₩{item.price || '0'}</b></article>)}</div></section>;
    }
    const value = section === 'wifi' ? `${store.wifiName} · ${store.wifiPassword}` : section === 'restroom' ? store.restroom : section === 'howToEat' ? store.howToEat : store.story;
    return <section className="builder-preview-info" key={section}><span>{section === 'wifi' ? 'Wi' : section === 'restroom' ? 'WC' : section === 'howToEat' ? 'TIP' : 'STORY'}</span><div><h3>{sectionLabels[section]}</h3><p>{value}</p></div></section>;
  }

  return (
    <div className="builder-shell">
      <header className="builder-header">
        <a className="builder-brand" href="/"><b>Many</b><span>LOCAL STUDIO</span></a>
        <div className="builder-header__actions"><span>{savedAt ? `${savedAt} 저장됨` : '저장 전'}</span><a href="/" target="_blank">방문자 페이지 보기 ↗</a><button type="button" onClick={() => saveDraft()}>임시 저장</button></div>
      </header>

      <div className="builder-workspace">
        <aside className="builder-steps">
          <div><p>사이트 만들기</p><h1>가게의 이야기를<br />여행자의 언어로.</h1><span>한국어로 입력하면 외국인 관광객용 페이지로 확장할 수 있습니다.</span></div>
          <nav>{steps.map((step) => <button className={activeStep === step.key ? 'is-active' : ''} type="button" key={step.key} onClick={() => setActiveStep(step.key)}><b>{step.number}</b><span><strong>{step.label}</strong><small>{step.helper}</small></span></button>)}</nav>
          <div className="builder-progress"><span style={{ width: `${((steps.findIndex((step) => step.key === activeStep) + 1) / steps.length) * 100}%` }} /></div>
        </aside>

        <main className="builder-editor">
          <header className="builder-editor__header"><div><p>{steps.find((step) => step.key === activeStep)?.number} STEP</p><h2>{steps.find((step) => step.key === activeStep)?.label}</h2></div><span>오른쪽에서 실시간으로 확인할 수 있어요.</span></header>
          {renderEditor()}
          <div className="builder-editor__footer"><button type="button" className="builder-secondary" onClick={() => saveDraft()}>임시 저장</button><button type="button" className="builder-primary" onClick={goNext}>{activeStep === 'order' ? '발행 흐름 확인' : '다음 단계'}</button></div>
        </main>

        <aside className="builder-preview-wrap">
          <div className="builder-preview-label"><span>LIVE PREVIEW</span><b>모바일 방문자 화면</b></div>
          <div className="builder-phone">
            <div className="builder-phone__top"><span>Many</span><div>한국어⌄</div></div>
            <div className="builder-preview-hero"><span>영업 중 · 성수</span><h2>{store.name || '가게 이름'}</h2><p>{store.shortDescription || '한 줄 소개를 입력해주세요.'}</p></div>
            <div className="builder-preview-body">{visibleOrder.map(renderPreviewSection)}</div>
          </div>
        </aside>
      </div>
      <div className={`builder-toast ${toast ? 'is-visible' : ''}`} role="status">{toast}</div>
    </div>
  );
}
