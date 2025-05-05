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
    hasBezel: boolean;
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
  bezels: WatchPart[];
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
        "hasStraps": false,
        "hasBezel": false
      }
    },
    {
      "name": "Speedmaster",
      "image": getImagePath("/images/cases/c2.png"),
      "colors": [
        {
          "name": "Серебряный",
          "image": getImagePath("/images/cases/c2/c2s.png")
        }
      ],
      "availableParts": {
        "hasDials": true,
        "hasHands": false,
        "hasRotors": false,
        "hasStraps": true,
        "hasBezel": true
      }
    }
  ],
  "dials": [
    {
      "name": "d1",
      "image": getImagePath("/images/dials/c1/d1.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d2",
      "image": getImagePath("/images/dials/c1/d2.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d3",
      "image": getImagePath("/images/dials/c1/d3.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d4",
      "image": getImagePath("/images/dials/c1/d4.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d5",
      "image": getImagePath("/images/dials/c1/d5.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d6",
      "image": getImagePath("/images/dials/c1/d6.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d7",
      "image": getImagePath("/images/dials/c1/d7.png"),
      "compatibleCases": ["Nautilus"]
    },  
    {
      "name": "d8",
      "image": getImagePath("/images/dials/c1/d8.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d9",
      "image": getImagePath("/images/dials/c1/d9.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d10",
      "image": getImagePath("/images/dials/c1/d10.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d11",
      "image": getImagePath("/images/dials/c1/d11.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d12",
      "image": getImagePath("/images/dials/c1/d12.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d13",
      "image": getImagePath("/images/dials/c1/d13.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d14",
      "image": getImagePath("/images/dials/c1/d14.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d15",
      "image": getImagePath("/images/dials/c1/d15.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d16",
      "image": getImagePath("/images/dials/c1/d16.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d17",
      "image": getImagePath("/images/dials/c1/d17.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d18",
      "image": getImagePath("/images/dials/c1/d18.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d19",
      "image": getImagePath("/images/dials/c1/d19.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d20",
      "image": getImagePath("/images/dials/c1/d20.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d21",
      "image": getImagePath("/images/dials/c1/d21.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d22",
      "image": getImagePath("/images/dials/c1/d22.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d23",
      "image": getImagePath("/images/dials/c1/d23.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d24",
      "image": getImagePath("/images/dials/c1/d24.png"),
      "compatibleCases": ["Nautilus"]
    },
    {
      "name": "d1",
      "image": getImagePath("/images/dials/c2/d1.png"),
      "compatibleCases": ["Speedmaster"]
    },
    {
      "name": "d2",
      "image": getImagePath("/images/dials/c2/d2.png"),
      "compatibleCases": ["Speedmaster"]
    },
    {
      "name": "d3",
      "image": getImagePath("/images/dials/c2/d3.png"),
      "compatibleCases": ["Speedmaster"]
    },
    {
      "name": "d4",
      "image": getImagePath("/images/dials/c2/d4.png"),
      "compatibleCases": ["Speedmaster"]
    },
    {
      "name": "d5",
      "image": getImagePath("/images/dials/c2/d5.png"),
      "compatibleCases": ["Speedmaster"]
    }
    
    
  ],
  "hands": [

  ],
  "rotors": [

  ],
  "straps": [
    {
      "name": "s1",
      "image": getImagePath("/images/straps/c2/s1.png"),
      "compatibleCases": ["Speedmaster"]
    },
    {
      "name": "s2",
      "image": getImagePath("/images/straps/c2/s2.png"),
      "compatibleCases": ["Speedmaster"]
    },
    {
      "name": "s3",
      "image": getImagePath("/images/straps/c2/s3.png"),
      "compatibleCases": ["Speedmaster"]
    }
  ],
  "bezels": [
    {
      "name": "b1",
      "image": getImagePath("/images/bezel/c2/b1.png"),
      "compatibleCases": ["Speedmaster"]
    },
    {
      "name": "b2",
      "image": getImagePath("/images/bezel/c2/b2.png"),
      "compatibleCases": ["Speedmaster"]
    },
    {
      "name": "b3",
      "image": getImagePath("/images/bezel/c2/b3.png"),
      "compatibleCases": ["Speedmaster"]
    }
    
  ]
};

export default watchData;