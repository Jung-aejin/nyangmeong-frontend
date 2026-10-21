import { useState } from 'react';
import { AI_QUERY_PATTERN, CATEGORIES, PLACES, SUGGESTIONS } from './placeData';

const nameOf = (category) =>
  CATEGORIES.find((item) => item.key === category).name;

// 카테고리를 처음 열었을 때의 검색 상태. 병원이 아니면 검색어는 카테고리 이름이다
const initialSearch = (category) => ({
  q: nameOf(category),
  scope: 'first', // first: 시 전체, new: 지도 영역으로 다시 검색한 결과
  isMoved: false,
  isEmpty: false,
  isAi: false,
  selected: '',
  selectedBy: '', // pin | list. 핀으로 골랐을 때만 목록을 그 장소로 스크롤한다
});

function getResultIds(category, search, sort) {
  if (search.isEmpty) return [];
  let ids;
  if (category === 'hospital') {
    if (search.isAi) ids = ['eco', 'aj'];
    else ids = search.scope === 'new' ? ['eco', 'song', 'aj'] : ['on', 'deok'];
  } else {
    ids = Object.keys(PLACES).filter((id) => PLACES[id].cat === category);
  }
  if (sort === '이름순') {
    ids.sort((a, b) => PLACES[a].name.localeCompare(PLACES[b].name, 'ko'));
  } else if (sort === '거리순') {
    ids.sort((a, b) => PLACES[a].d - PLACES[b].d);
  }
  return ids;
}

// 추천 검색어나 이 카테고리 장소의 이름·주소·태그에 걸리는 말이 아니면 결과가 없다
function hasResult(category, q) {
  if (q === nameOf(category) || SUGGESTIONS[category].includes(q)) return true;
  return Object.values(PLACES).some(
    (place) =>
      place.cat === category &&
      [place.name, place.addr, ...place.tags].some((text) => text.includes(q)),
  );
}

export default function usePlaceSearch(category, onCategoryChange) {
  const [search, setSearch] = useState(() => initialSearch(category));
  const [syncedCategory, setSyncedCategory] = useState(category);
  const [sort, setSort] = useState('거리순');
  const [favorites, setFavorites] = useState({ jb: true });

  // 주소창이나 GNB로 카테고리가 바뀌면 검색 상태를 처음으로 되돌린다
  if (syncedCategory !== category) {
    setSyncedCategory(category);
    setSearch(initialSearch(category));
  }

  const resultIds = getResultIds(category, search, sort);
  const favoriteIds = Object.keys(favorites).filter(
    (id) => favorites[id] && PLACES[id].cat === category,
  );
  // 재검색한 영역 밖에 있는 즐겨찾기
  const isOutside = (id) => search.scope === 'new' && id === 'jb';

  const changeCategory = (next, nextSearch) => {
    setSyncedCategory(next);
    setSearch(nextSearch);
    onCategoryChange(next);
  };

  const selectCategory = (next) => changeCategory(next, initialSearch(next));

  const submitSearch = (text) => {
    const q = text.trim();
    if (!q) return;
    const isAi = AI_QUERY_PATTERN.test(q);
    const next = isAi || q.includes('병원') ? 'hospital' : category;
    changeCategory(next, {
      ...initialSearch(next),
      q,
      isAi,
      isEmpty: !isAi && !hasResult(next, q),
    });
  };

  const selectPlace = (id, by) =>
    setSearch((prev) => ({
      ...prev,
      selected: prev.selected === id && by === 'list' ? '' : id,
      selectedBy: by,
    }));

  const closePlace = () =>
    setSearch((prev) => ({ ...prev, selected: '', selectedBy: '' }));

  const markMoved = () =>
    setSearch((prev) => (prev.isMoved ? prev : { ...prev, isMoved: true }));

  const researchHere = () =>
    setSearch((prev) => ({
      ...prev,
      scope: 'new',
      isMoved: false,
      isEmpty: false,
      selected: '',
      selectedBy: '',
    }));

  const toggleFavorite = (id) =>
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));

  const regionText = search.isMoved
    ? '지도를 움직였어요'
    : search.scope === 'new'
      ? '현재 지도 영역'
      : '전주시 전체';

  return {
    search,
    sort,
    setSort,
    favorites,
    resultIds,
    favoriteIds,
    isOutside,
    regionText,
    selectCategory,
    submitSearch,
    selectPlace,
    closePlace,
    markMoved,
    researchHere,
    toggleFavorite,
  };
}
