import { Hospital, Hotel, PawPrint, Scissors, ShoppingBag } from 'lucide-react';

// 더미데이터
export const CATEGORIES = [
  { key: 'hospital', name: '동물병원', label: '병원', Icon: Hospital },
  { key: 'beauty', name: '미용', label: '미용', Icon: Scissors },
  { key: 'goods', name: '용품', label: '용품', Icon: ShoppingBag },
  { key: 'pet-friendly', name: '동반장소', label: '동반', Icon: PawPrint },
  { key: 'hotel', name: '호텔', label: '호텔', Icon: Hotel },
];

export const DEFAULT_CATEGORY = 'hospital';

export const KIND = {
  hospital: '동물병원',
  beauty: '반려동물 미용',
  goods: '반려동물 용품',
  'pet-friendly': '반려동물 동반 카페',
  hotel: '반려동물 호텔',
};

export const SORT_OPTIONS = ['거리순', '추천순', '이름순'];

export const PLACES = {
  jb: {
    name: '전북동물의료센터',
    cat: 'hospital',
    d: 0.4,
    hours: '24시간',
    open: '진료 중',
    phone: '063-247-0001',
    addr: '전주시 덕진구 기린대로 451',
    tags: ['24시', '응급'],
  },
  on: {
    name: '온누리동물병원',
    cat: 'hospital',
    d: 1.5,
    hours: '09:00 – 20:00',
    open: '진료 중',
    phone: '063-245-0002',
    addr: '전주시 덕진구 백제대로 712',
    tags: ['예약', '주차'],
  },
  deok: {
    name: '덕진24시동물병원',
    cat: 'hospital',
    d: 2.2,
    hours: '24시간',
    open: '진료 중',
    phone: '063-246-0003',
    addr: '전주시 덕진구 권삼득로 214',
    tags: ['24시', '응급'],
  },
  eco: {
    name: '에코동물메디컬센터',
    cat: 'hospital',
    d: 0.5,
    hours: '09:00 – 21:00',
    open: '진료 중',
    phone: '063-251-1001',
    addr: '전주시 완산구 팔달로 88',
    tags: ['응급', '정형외과'],
  },
  song: {
    name: '송천동물병원',
    cat: 'hospital',
    d: 1.1,
    hours: '10:00 – 20:00',
    open: '진료 중',
    phone: '063-252-1002',
    addr: '전주시 덕진구 송천중앙로 41',
    tags: ['예약', '주차'],
  },
  aj: {
    name: '아중24시동물의료센터',
    cat: 'hospital',
    d: 1.9,
    hours: '24시간',
    open: '진료 중',
    phone: '063-253-1003',
    addr: '전주시 덕진구 아중로 160',
    tags: ['24시', '응급'],
  },
  groom: {
    name: '꼬리살롱',
    cat: 'beauty',
    d: 1.2,
    hours: '10:00 – 19:00',
    open: '영업 중',
    phone: '063-000-0001',
    addr: '전주시 완산구 홍산로 12',
    tags: ['예약', '고양이 가능'],
  },
  groom2: {
    name: '보송보송 펫미용',
    cat: 'beauty',
    d: 2.0,
    hours: '10:00 – 20:00',
    open: '영업 중',
    phone: '063-000-0011',
    addr: '전주시 덕진구 우아로 33',
    tags: ['예약'],
  },
  shop: {
    name: '반려생활 용품점',
    cat: 'goods',
    d: 0.9,
    hours: '10:00 – 21:00',
    open: '영업 중',
    phone: '063-000-0002',
    addr: '전주시 덕진구 기린대로 520',
    tags: ['주차'],
  },
  cafe: {
    name: '꼬리숲 카페',
    cat: 'pet-friendly',
    d: 1.8,
    hours: '10:00 – 20:00',
    open: '영업 중',
    phone: '063-000-0003',
    addr: '전주시 완산구 전주천동로 70',
    tags: ['대형견 가능', '야외석'],
  },
  hotel: {
    name: '함께하개 호텔',
    cat: 'hotel',
    d: 2.5,
    hours: '09:00 – 21:00',
    open: '영업 중',
    phone: '063-000-0004',
    addr: '전주시 덕진구 견훤로 300',
    tags: ['예약', 'CCTV'],
  },
};

// 지도 위 핀 자리(지도 판 기준 %)
// 지도 좌표 [위도, 경도]. 실제 API가 오면 서버가 주는 좌표로 바꾼다
export const SPOTS = {
  jb: [35.842, 127.1168],
  on: [35.827, 127.1266],
  deok: [35.8372, 127.1448],
  eco: [35.836, 127.128],
  song: [35.8222, 127.142],
  aj: [35.836, 127.1546],
  groom: [35.8252, 127.1322],
  groom2: [35.842, 127.149],
  shop: [35.833, 127.1385],
  cafe: [35.8228, 127.1231],
  hotel: [35.8252, 127.1504],
};

export const AI_QUERY_PATTERN = /수술|잘하는|추천/;

export const SUGGESTIONS = {
  hospital: ['24시 동물병원', '야간진료', '가까운 곳'],
  'pet-friendly': ['대형견 가능', '야외석', '가까운 곳'],
  hotel: ['CCTV', '가까운 곳'],
  beauty: ['예약 가능', '가까운 곳'],
  goods: ['예약 가능', '가까운 곳'],
};
