// Category mappings
export const categoryMap = {
  맛집: "food",
  쇼핑: "shopping",
  관광명소: "attraction",
  체험: "experience",
  웰니스: "wellness",
  나이트라이프: "nightlife",
} as any;

export const subCategoryMap = {
  맛집: {
    전체: "all",
    한식: "korean",
    분식: "snack",
    "카페/디저트": "cafe",
    고기구이: "bbq",
    해산물: "seafood",
    "채식/비건": "vegan",
    "바/펍": "bar",
    "다국적/퓨전": "fusion",
    패스트푸드: "fastfood",
  },
  쇼핑: {
    전체: "all",
    "패션/의류": "fashion",
    "화장품/뷰티": "beauty",
    "기념품/특산품": "souvenir",
    "백화점/쇼핑몰": "department",
  },
  체험: {
    전체: "all",
    한복체험: "hanbok",
    클래스: "class",
    공예체험: "craft",
    "콘서트 & 공연": "concert",
    "야외 액티비티": "outdoor",
    케이팝: "kpop",
  },
  웰니스: {
    전체: "all",
    "스파/마사지": "spa",
    "요가/명상": "yoga",
    뷰티케어: "beautycare",
  },
  나이트라이프: {
    전체: "all",
    클럽: "club",
    루프탑바: "rooftop",
    "재즈바/공연바": "jazzbar",
    "포장마차/포차": "pocha",
  },
} as any;

export const regions = [
  { id: "지역 전체", name: "지역 전체" },
  { id: "명동", name: "명동" },
  { id: "강남", name: "강남" },
  { id: "종로/인사동", name: "종로/인사동" },
  { id: "경복궁/북촌", name: "경복궁/북촌" },
  { id: "삼청동", name: "삼청동" },
  { id: "서촌", name: "서촌" },
  { id: "이태원", name: "이태원" },
  { id: "한남동", name: "한남동" },
  { id: "압구정/청담", name: "압구정/청담" },
  { id: "홍대", name: "홍대" },
  { id: "연남", name: "연남" },
  { id: "합정", name: "합정" },
  { id: "망원", name: "망원" },
  { id: "성수", name: "성수" },
  { id: "여의도", name: "여의도" },
  { id: "잠실", name: "잠실" },
  { id: "기타", name: "기타" },
];
