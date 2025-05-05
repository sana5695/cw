export interface WatchCase {
  name: string;
  image: string;
  colors: {
    name: string;
    image: string;
  }[];
  availableParts: {
    hasDials: boolean;
    hasHands: boolean;
    hasRotors: boolean;
    hasStraps: boolean;
  };
}

export interface WatchPart {
  name: string;
  image: string;
  compatibleCases: string[];
}

export interface WatchData {
  cases: WatchCase[];
  dials: WatchPart[];
  hands: WatchPart[];
  rotors: WatchPart[];
  straps: WatchPart[];
}

// Функция для добавления базового пути к изображениям
function getImagePath(path: string): string {
  return (path);
}

const watchData: WatchData = {
  "cases": [
    {
      "name": "Nautilus",
      "image": getImagePath("/images/cases/c1.png"),
      "colors": [
        {
            "name": "Серебряный",
            "image": getImagePath("/images/cases/c1/c1s.png")
          },
        {
          "name": "Золотой",
          "image": getImagePath("/images/cases/c1/c1g.png")
        },
        {
          "name": "Розовый",
          "image": getImagePath("/images/cases/c1/c1p.png")
        }
      ],
      "availableParts": {
        "hasDials": true,
        "hasHands": false,
        "hasRotors": false,
        "hasStraps": false
      }
    }
  ],
  "dials": [
    {
      "name": "d1",
      "image": getImagePath("/images/dials/d1.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d2",
      "image": getImagePath("/images/dials/d2.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d3",
      "image": getImagePath("/images/dials/d3.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d4",
      "image": getImagePath("/images/dials/d4.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d5",
      "image": getImagePath("/images/dials/d5.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d6",
      "image": getImagePath("/images/dials/d6.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d7",
      "image": getImagePath("/images/dials/d7.png"),
      "compatibleCases": ["Nautilus"]
    },  
    {
      "name": "d8",
      "image": getImagePath("/images/dials/d8.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d9",
      "image": getImagePath("/images/dials/d9.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d10",
      "image": getImagePath("/images/dials/d10.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d11",
      "image": getImagePath("/images/dials/d11.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d12",
      "image": getImagePath("/images/dials/d12.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d13",
      "image": getImagePath("/images/dials/d13.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d14",
      "image": getImagePath("/images/dials/d14.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d15",
      "image": getImagePath("/images/dials/d15.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d16",
      "image": getImagePath("/images/dials/d16.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d17",
      "image": getImagePath("/images/dials/d17.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d18",
      "image": getImagePath("/images/dials/d18.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d19",
      "image": getImagePath("/images/dials/d19.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d20",
      "image": getImagePath("/images/dials/d20.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d21",
      "image": getImagePath("/images/dials/d21.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d22",
      "image": getImagePath("/images/dials/d22.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d23",
      "image": getImagePath("/images/dials/d23.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d24",
      "image": getImagePath("/images/dials/d24.png"),
      "compatibleCases": ["Nautilus"]
    }
      
    
    
  ],
  "hands": [

  ],
  "rotors": [

  ],
  "straps": [
    {
      "name": "Кожаный ремешок",
      "image": getImagePath("/images/straps/leather.png"),
      "compatibleCases": ["Спортивный корпус"]
    },
  ]
};

export default watchData;