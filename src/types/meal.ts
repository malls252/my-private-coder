export interface MealItem {
  id: string;
  name: string;
  portion: string;
  calories?: number;
}

export interface MealSchedule {
  id: string;
  title: string;
  time: string;
  icon: string;
  items: MealItem[];
  isCompleted: boolean;
  alarmEnabled: boolean;
}
