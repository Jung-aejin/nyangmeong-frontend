export const WEEK_LABELS = ['09.13', '09.20', '09.27', '10.04', '10.11'];
export const LAB_LABELS = [
  '2025.01',
  '2025.06',
  '2026.01',
  '2026.05',
  '2026.09',
];
export const LAB_RANGE = [0.5, 1.6];

const SAMPLES = [
  {
    exam: { dayCount: 28, text: '2026.09.09 · 늘봄동물병원' },
    rx: { count: 1, text: '영양제 · 복용 중' },
    report: {
      title: '건강해요',
      tips: [
        '체중이 안정적이에요',
        '음수량이 지난주보다 10ml 늘었어요',
        '신장 보조제 복용을 잊지 마세요',
      ],
    },
    widgets: {
      weight: { value: 4.2, delta: -0.1, series: [4.3, 4.3, 4.2, 4.3, 4.2] },
      meal: { value: 65, delta: -5, series: [70, 72, 68, 70, 65] },
      water: { value: 120, delta: 10, series: [100, 110, 105, 110, 120] },
      walk: { value: 35, delta: 5, series: [25, 30, 28, 30, 35] },
      lab: { value: 1.3, delta: 0.2, series: [1.0, 1.1, 1.1, 1.1, 1.3] },
    },
    missions: [
      { type: 'meal', text: '정해진 양만큼 먹었어요', isDone: true },
      { type: 'water', text: '충분히 마셨어요', isDone: true },
      { type: 'walk', text: '오늘도 산책했어요', isDone: true },
      { type: 'medicine', text: '신장 보조제 1/2회', isDone: false },
      { type: 'etc', text: '특이사항 없음', isDone: true },
    ],
  },
  {
    exam: { dayCount: 45, text: '2026.08.27 · 행복동물병원' },
    rx: { count: 0, text: '복용 중인 처방 없음' },
    report: {
      title: '식사량이 안정적이에요',
      tips: [
        '식사량이 3주째 꾸준히 늘고 있어요',
        'CREA 수치가 참고범위 안에서 내려갔어요',
        '오늘 물 마시기를 한 번 더 챙겨 주세요',
      ],
    },
    widgets: {
      weight: { value: 4.8, delta: 0.1, series: [4.6, 4.7, 4.7, 4.7, 4.8] },
      meal: { value: 58, delta: 3, series: [52, 55, 54, 55, 58] },
      water: { value: 120, delta: 10, series: [90, 100, 110, 110, 120] },
      walk: { value: 0, delta: 0, series: [0, 0, 0, 0, 0] },
      lab: { value: 1.1, delta: -0.1, series: [1.3, 1.2, 1.2, 1.2, 1.1] },
    },
    missions: [
      { type: 'meal', text: '정해진 양만큼 먹었어요', isDone: true },
      { type: 'water', text: '충분히 마셨어요', isDone: false },
      { type: 'poop', text: '화장실을 잘 썼어요', isDone: true },
      { type: 'play', text: '낚싯대 놀이 10분', isDone: false },
      { type: 'etc', text: '특이사항 없음', isDone: true },
    ],
  },
];

export const getDashboardSample = (index) => SAMPLES[index % SAMPLES.length];

export const ASOF_TEXT = '기준일 2026.10.11(일) · 최근 업데이트 14:32:07';
