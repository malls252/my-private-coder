import { MealSchedule } from "@/types/meal";

export const defaultMeals: MealSchedule[] = [
  {
    id: "1",
    title: "Sarapan",
    time: "07:00",
    icon: "🌅",
    items: [
      { id: "1a", name: "Oatmeal", portion: "100g", calories: 380 },
      { id: "1b", name: "Telur Rebus", portion: "3 butir", calories: 210 },
      { id: "1c", name: "Pisang", portion: "2 buah", calories: 180 },
      { id: "1d", name: "Susu Full Cream", portion: "300ml", calories: 180 },
    ],
    isCompleted: false,
    alarmEnabled: true,
  },
  {
    id: "2",
    title: "Snack Pagi",
    time: "10:00",
    icon: "🥜",
    items: [
      { id: "2a", name: "Kacang Almond", portion: "30g", calories: 170 },
      { id: "2b", name: "Greek Yogurt", portion: "150g", calories: 130 },
    ],
    isCompleted: false,
    alarmEnabled: true,
  },
  {
    id: "3",
    title: "Makan Siang",
    time: "12:30",
    icon: "☀️",
    items: [
      { id: "3a", name: "Nasi Putih", portion: "200g", calories: 260 },
      { id: "3b", name: "Dada Ayam Panggang", portion: "200g", calories: 330 },
      { id: "3c", name: "Brokoli & Wortel", portion: "150g", calories: 50 },
      { id: "3d", name: "Minyak Zaitun", portion: "1 sdm", calories: 120 },
    ],
    isCompleted: false,
    alarmEnabled: true,
  },
  {
    id: "4",
    title: "Snack Sore",
    time: "15:30",
    icon: "🍌",
    items: [
      { id: "4a", name: "Roti Gandum", portion: "2 lembar", calories: 160 },
      { id: "4b", name: "Selai Kacang", portion: "2 sdm", calories: 190 },
      { id: "4c", name: "Apel", portion: "1 buah", calories: 95 },
    ],
    isCompleted: false,
    alarmEnabled: true,
  },
  {
    id: "5",
    title: "Makan Malam",
    time: "19:00",
    icon: "🌙",
    items: [
      { id: "5a", name: "Nasi Merah", portion: "200g", calories: 220 },
      { id: "5b", name: "Ikan Salmon", portion: "200g", calories: 400 },
      { id: "5c", name: "Sayur Bayam", portion: "100g", calories: 25 },
      { id: "5d", name: "Tahu Goreng", portion: "100g", calories: 150 },
    ],
    isCompleted: false,
    alarmEnabled: true,
  },
  {
    id: "6",
    title: "Sebelum Tidur",
    time: "21:30",
    icon: "💤",
    items: [
      { id: "6a", name: "Susu + Whey Protein", portion: "300ml + 1 scoop", calories: 320 },
      { id: "6b", name: "Keju Cottage", portion: "100g", calories: 100 },
    ],
    isCompleted: false,
    alarmEnabled: true,
  },
];
