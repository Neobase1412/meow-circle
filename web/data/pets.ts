import {
  type Pet,
  PetGender,
  type HealthRecord,
  type Vaccination,
  type LifeRecord,
  LifeRecordType,
  type Album,
  type AlbumPhoto,
} from "@/types/pet"

export const pets: Pet[] = [
  {
    id: "1",
    name: "奶茶",
    ownerId: "2", // meowlover
    breed: "英國短毛貓",
    gender: PetGender.MALE,
    birthDate: new Date("2021-05-15"),
    adoptionDate: new Date("2021-08-10"),
    chipNumber: "CHIP123456",
    weight: 5.2,
    description: "奶茶是一隻活潑好動的英短，喜歡玩逗貓棒和追逐小球。毛色是奶茶色，非常可愛。",
    primaryImageUrl: "/images/pets/pet1.jpg",
    isActive: true,
    createdAt: new Date("2021-08-10"),
    updatedAt: new Date("2023-06-15"),
  },
  {
    id: "2",
    name: "牛奶",
    ownerId: "2", // meowlover
    breed: "美國短毛貓",
    gender: PetGender.FEMALE,
    birthDate: new Date("2022-01-20"),
    adoptionDate: new Date("2022-04-05"),
    chipNumber: "CHIP789012",
    weight: 4.3,
    description: "牛奶是一隻安靜乖巧的美短，喜歡窩在主人懷裡睡覺。全身雪白，眼睛是漂亮的藍色。",
    primaryImageUrl: "/images/pets/pet2.jpg",
    isActive: true,
    createdAt: new Date("2022-04-05"),
    updatedAt: new Date("2023-06-15"),
  },
  {
    id: "3",
    name: "小橘",
    ownerId: "3", // catmom
    breed: "橘貓",
    gender: PetGender.MALE,
    birthDate: new Date("2020-07-10"),
    adoptionDate: new Date("2020-09-15"),
    chipNumber: "CHIP345678",
    weight: 6.1,
    description: "小橘是一隻活力充沛的橘貓，喜歡到處探險。非常貪吃，特別喜歡吃魚。",
    primaryImageUrl: "/images/pets/pet3.jpg",
    isActive: true,
    createdAt: new Date("2020-09-15"),
    updatedAt: new Date("2023-06-10"),
  },
  {
    id: "4",
    name: "黑糖",
    ownerId: "3", // catmom
    breed: "黑貓",
    gender: PetGender.FEMALE,
    birthDate: new Date("2021-02-14"),
    adoptionDate: new Date("2021-05-01"),
    chipNumber: "CHIP901234",
    weight: 4.8,
    description: "黑糖是一隻神秘優雅的黑貓，喜歡在夜晚活動。非常聰明，會自己開門。",
    primaryImageUrl: "/images/pets/pet4.jpg",
    isActive: true,
    createdAt: new Date("2021-05-01"),
    updatedAt: new Date("2023-06-12"),
  },
  {
    id: "5",
    name: "灰灰",
    ownerId: "3", // catmom
    breed: "俄羅斯藍貓",
    gender: PetGender.MALE,
    birthDate: new Date("2019-11-20"),
    adoptionDate: new Date("2020-02-10"),
    chipNumber: "CHIP567890",
    weight: 5.5,
    description: "灰灰是一隻安靜的俄羅斯藍貓，喜歡獨處。毛色是漂亮的藍灰色，眼睛是綠色的。",
    primaryImageUrl: "/images/pets/pet5.jpg",
    isActive: true,
    createdAt: new Date("2020-02-10"),
    updatedAt: new Date("2023-06-05"),
  },
  {
    id: "6",
    name: "餅乾",
    ownerId: "5", // newbie
    breed: "米克斯",
    gender: PetGender.FEMALE,
    birthDate: new Date("2023-01-10"),
    adoptionDate: new Date("2023-05-20"),
    weight: 2.8,
    description: "餅乾是一隻剛滿半歲的小貓，非常活潑好動。是從收容所領養的，毛色是棕白相間。",
    primaryImageUrl: "/images/pets/pet6.jpg",
    isActive: true,
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-06-21"),
  },
]

export const healthRecords: HealthRecord[] = [
  {
    id: "1",
    petId: "1", // 奶茶
    recordType: "年度健康檢查",
    title: "2023年度健康檢查",
    description: "整體健康狀況良好，體重略微超標，建議控制飲食並增加運動量。",
    date: new Date("2023-05-20"),
    veterinarian: "王醫師",
    hospital: "喵喵動物醫院",
    attachments: ["/documents/health/report1.pdf"],
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-05-20"),
  },
  {
    id: "2",
    petId: "1", // 奶茶
    recordType: "疫苗接種",
    title: "三合一疫苗接種",
    description: "完成三合一疫苗接種，注射部位無異常反應。",
    date: new Date("2023-02-15"),
    veterinarian: "李醫師",
    hospital: "喵喵動物醫院",
    attachments: ["/documents/health/vaccine1.pdf"],
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-02-15"),
  },
  {
    id: "3",
    petId: "2", // 牛奶
    recordType: "年度健康檢查",
    title: "2023年度健康檢查",
    description: "健康狀況良好，牙齒需要注意清潔，建議定期刷牙。",
    date: new Date("2023-05-25"),
    veterinarian: "王醫師",
    hospital: "喵喵動物醫院",
    attachments: ["/documents/health/report2.pdf"],
    createdAt: new Date("2023-05-25"),
    updatedAt: new Date("2023-05-25"),
  },
]

export const vaccinations: Vaccination[] = [
  {
    id: "1",
    petId: "1", // 奶茶
    vaccineName: "三合一疫苗",
    date: new Date("2023-02-15"),
    expiryDate: new Date("2024-02-15"),
    hospital: "喵喵動物醫院",
    veterinarian: "李醫師",
    batchNumber: "VAC123456",
    reminderEnabled: true,
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2023-02-15"),
  },
  {
    id: "2",
    petId: "1", // 奶茶
    vaccineName: "狂犬病疫苗",
    date: new Date("2023-03-10"),
    expiryDate: new Date("2024-03-10"),
    hospital: "喵喵動物醫院",
    veterinarian: "王醫師",
    batchNumber: "VAC789012",
    reminderEnabled: true,
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-10"),
  },
  {
    id: "3",
    petId: "2", // 牛奶
    vaccineName: "三合一疫苗",
    date: new Date("2023-04-20"),
    expiryDate: new Date("2024-04-20"),
    hospital: "喵喵動物醫院",
    veterinarian: "李醫師",
    batchNumber: "VAC345678",
    reminderEnabled: true,
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2023-04-20"),
  },
]

export const lifeRecords: LifeRecord[] = [
  {
    id: "1",
    petId: "1", // 奶茶
    recordType: LifeRecordType.DIET,
    title: "換新飼料",
    content: "今天開始嘗試新的無穀飼料，奶茶似乎很喜歡，吃得很開心。",
    mood: "開心",
    photos: ["/images/records/diet1.jpg"],
    recordDate: new Date("2023-06-10"),
    isPublic: true,
    createdAt: new Date("2023-06-10"),
    updatedAt: new Date("2023-06-10"),
  },
  {
    id: "2",
    petId: "1", // 奶茶
    recordType: LifeRecordType.WEIGHT,
    title: "體重記錄",
    content: "今天測量體重為5.2公斤，比上個月增加了0.2公斤，需要控制飲食了。",
    photos: ["/images/records/weight1.jpg"],
    recordDate: new Date("2023-06-15"),
    isPublic: true,
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2023-06-15"),
  },
  {
    id: "3",
    petId: "2", // 牛奶
    recordType: LifeRecordType.GROOMING,
    title: "第一次洗澡",
    content: "今天帶牛奶去寵物店洗澡，雖然有點害怕但整體表現很乖。洗完後毛髮特別蓬鬆柔軟。",
    mood: "緊張",
    photos: ["/images/records/grooming1.jpg", "/images/records/grooming2.jpg"],
    recordDate: new Date("2023-06-12"),
    isPublic: true,
    createdAt: new Date("2023-06-12"),
    updatedAt: new Date("2023-06-12"),
  },
]

export const albums: Album[] = [
  {
    id: "1",
    title: "奶茶的日常",
    description: "記錄奶茶的日常生活點滴",
    coverUrl: "/images/albums/album1-cover.jpg",
    petId: "1", // 奶茶
    isPublic: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-06-15"),
  },
  {
    id: "2",
    title: "牛奶的成長記錄",
    description: "從小到大的成長過程",
    coverUrl: "/images/albums/album2-cover.jpg",
    petId: "2", // 牛奶
    isPublic: true,
    createdAt: new Date("2023-04-10"),
    updatedAt: new Date("2023-06-15"),
  },
]

export const albumPhotos: AlbumPhoto[] = [
  {
    id: "1",
    albumId: "1", // 奶茶的日常
    imageUrl: "/images/albums/album1-photo1.jpg",
    caption: "午後陽光下的奶茶",
    takenAt: new Date("2023-05-20"),
    taggedPetIds: ["1"],
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-05-20"),
  },
  {
    id: "2",
    albumId: "1", // 奶茶的日常
    imageUrl: "/images/albums/album1-photo2.jpg",
    caption: "專注玩逗貓棒的奶茶",
    takenAt: new Date("2023-05-25"),
    taggedPetIds: ["1"],
    createdAt: new Date("2023-05-25"),
    updatedAt: new Date("2023-05-25"),
  },
  {
    id: "3",
    albumId: "1", // 奶茶的日常
    imageUrl: "/images/albums/album1-photo3.jpg",
    caption: "睡午覺的奶茶",
    takenAt: new Date("2023-06-01"),
    taggedPetIds: ["1"],
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "4",
    albumId: "2", // 牛奶的成長記錄
    imageUrl: "/images/albums/album2-photo1.jpg",
    caption: "剛到家的牛奶",
    takenAt: new Date("2022-04-05"),
    taggedPetIds: ["2"],
    createdAt: new Date("2022-04-05"),
    updatedAt: new Date("2022-04-05"),
  },
  {
    id: "5",
    albumId: "2", // 牛奶的成長記錄
    imageUrl: "/images/albums/album2-photo2.jpg",
    caption: "三個月大的牛奶",
    takenAt: new Date("2022-07-10"),
    taggedPetIds: ["2"],
    createdAt: new Date("2022-07-10"),
    updatedAt: new Date("2022-07-10"),
  },
]

export const currentPet = pets[0] // 奶茶
