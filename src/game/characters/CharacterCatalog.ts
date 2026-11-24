export interface CharacterDefinition {
  id: string;
  nameVi: string;
  speciesVi: string;
  descriptionVi: string;
  modelKey: string;
  primaryColor: string;
  secondaryColor: string;
  hatType: 'tall_toque' | 'beret' | 'bandana' | 'mini_toque' | 'baker_cap';
  accentColor: string;
  skinColor: string;
  eyeType: 'round' | 'squint' | 'glasses' | 'cat';
  hasEars?: boolean;
  earType?: 'cat' | 'fox' | 'bear' | 'bunny' | 'dragon';
  unlockConditionVi: string;
}

export const CHARACTERS: CharacterDefinition[] = [
  {
    id: 'chef_cat',
    nameVi: 'Chef Mèo Mướp',
    speciesVi: 'Mèo cam',
    descriptionVi: 'Đầu bếp mèo nhanh nhẹn với chiếc mũ đầu bếp cao và khăn quàng đỏ rực.',
    modelKey: 'cat',
    primaryColor: '#f97316',
    secondaryColor: '#fff7ed',
    hatType: 'tall_toque',
    accentColor: '#ef4444',
    skinColor: '#fb923c',
    eyeType: 'cat',
    hasEars: true,
    earType: 'cat',
    unlockConditionVi: 'Có sẵn ngay từ đầu',
  },
  {
    id: 'chef_panda',
    nameVi: 'Chef Gấu Trúc',
    speciesVi: 'Gấu trúc',
    descriptionVi: 'Bậc thầy ẩm thực trầm tĩnh, luôn nấu ăn với lòng yêu thương và thìa tre.',
    modelKey: 'panda',
    primaryColor: '#1e293b',
    secondaryColor: '#f8fafc',
    hatType: 'tall_toque',
    accentColor: '#22c55e',
    skinColor: '#f8fafc',
    eyeType: 'round',
    hasEars: true,
    earType: 'bear',
    unlockConditionVi: 'Đạt 3 sao ở Cấp độ 1',
  },
  {
    id: 'chef_fox',
    nameVi: 'Chef Cáo Đỏ',
    speciesVi: 'Cáo lửa',
    descriptionVi: 'Nhanh nhẹn và tháo vát, chuyên xử lý các đơn hàng gấp rút trong tích tắc.',
    modelKey: 'fox',
    primaryColor: '#ea580c',
    secondaryColor: '#ffedd5',
    hatType: 'beret',
    accentColor: '#3b82f6',
    skinColor: '#f97316',
    eyeType: 'squint',
    hasEars: true,
    earType: 'fox',
    unlockConditionVi: 'Đạt 500 điểm trong một ván',
  },
  {
    id: 'chef_owl',
    nameVi: 'Chef Cú Trí Thức',
    speciesVi: 'Cú mèo',
    descriptionVi: 'Đầu bếp thông thái với cặp kính tròn, luôn ghi nhớ chính xác từng công thức.',
    modelKey: 'owl',
    primaryColor: '#78350f',
    secondaryColor: '#fef3c7',
    hatType: 'mini_toque',
    accentColor: '#eab308',
    skinColor: '#b45309',
    eyeType: 'glasses',
    hasEars: true,
    earType: 'cat',
    unlockConditionVi: 'Hoàn thành Thế giới 1',
  },
  {
    id: 'chef_piglet',
    nameVi: 'Chef Heo Hồng',
    speciesVi: 'Heo con',
    descriptionVi: 'Bé heo yêu đời, đam mê làm bánh ngọt và nướng bánh pizza phô mai kéo sợi.',
    modelKey: 'piglet',
    primaryColor: '#ec4899',
    secondaryColor: '#fdf2f8',
    hatType: 'baker_cap',
    accentColor: '#f43f5e',
    skinColor: '#f472b6',
    eyeType: 'round',
    hasEars: true,
    earType: 'bear',
    unlockConditionVi: 'Nấu thành công 10 chiếc pizza',
  },
  {
    id: 'chef_penguin',
    nameVi: 'Chef Cánh Cụt',
    speciesVi: 'Chim cánh cụt',
    descriptionVi: 'Đầu bếp bảnh bao với bộ tuxedo tự nhiên và chiếc nơ đỏ quý phái.',
    modelKey: 'penguin',
    primaryColor: '#0f172a',
    secondaryColor: '#ffffff',
    hatType: 'tall_toque',
    accentColor: '#ef4444',
    skinColor: '#ffffff',
    eyeType: 'round',
    unlockConditionVi: 'Phục vụ 20 món hải sản',
  },
  {
    id: 'chef_dragon',
    nameVi: 'Chef Rồng Con',
    speciesVi: 'Rồng lửa con',
    descriptionVi: 'Chú rồng tí hon biết phun lửa nhỏ giúp món áp chảo đạt độ thơm nồng.',
    modelKey: 'dragon',
    primaryColor: '#16a34a',
    secondaryColor: '#dcfce7',
    hatType: 'tall_toque',
    accentColor: '#f59e0b',
    skinColor: '#22c55e',
    eyeType: 'round',
    hasEars: true,
    earType: 'dragon',
    unlockConditionVi: 'Dập tắt 5 vụ cháy nhà bếp',
  },
  {
    id: 'chef_bunny',
    nameVi: 'Chef Thỏ Trắng',
    speciesVi: 'Thỏ ngọc',
    descriptionVi: 'Chuyên gia salad với đôi tai dài tinh nghịch xuyên qua chiếc mũ đầu bếp.',
    modelKey: 'bunny',
    primaryColor: '#f1f5f9',
    secondaryColor: '#fce7f3',
    hatType: 'tall_toque',
    accentColor: '#06b6d4',
    skinColor: '#f8fafc',
    eyeType: 'round',
    hasEars: true,
    earType: 'bunny',
    unlockConditionVi: 'Đạt chuỗi combo x4',
  },
  {
    id: 'chef_tuan',
    nameVi: 'Chef Tuấn',
    speciesVi: 'Người',
    descriptionVi: 'Chàng đầu bếp trẻ tuổi đầy nhiệt huyết với tạp dề sọc và kỹ năng thái rau siêu tốc.',
    modelKey: 'human_tuan',
    primaryColor: '#0284c7',
    secondaryColor: '#f0f9ff',
    hatType: 'tall_toque',
    accentColor: '#fbbf24',
    skinColor: '#fed7aa',
    eyeType: 'round',
    unlockConditionVi: 'Có sẵn ngay từ đầu',
  },
  {
    id: 'chef_mai',
    nameVi: 'Chef Mai',
    speciesVi: 'Người',
    descriptionVi: 'Cô nàng nghệ nhân bánh ngọt với chiếc khăn turban hồng duyên dáng.',
    modelKey: 'human_mai',
    primaryColor: '#db2777',
    secondaryColor: '#fdf2f8',
    hatType: 'beret',
    accentColor: '#a855f7',
    skinColor: '#ffedd5',
    eyeType: 'round',
    unlockConditionVi: 'Hoàn thành 5 màn chơi bất kỳ',
  },
  {
    id: 'chef_hung',
    nameVi: 'Chef Hùng',
    speciesVi: 'Người',
    descriptionVi: 'Bậc thầy sushi và ẩm thực Á Đông với chiếc khăn buộc đầu truyền thống.',
    modelKey: 'human_hung',
    primaryColor: '#dc2626',
    secondaryColor: '#ffffff',
    hatType: 'bandana',
    accentColor: '#172554',
    skinColor: '#fed7aa',
    eyeType: 'squint',
    unlockConditionVi: 'Đạt 3 sao ở 10 cấp độ',
  },
  {
    id: 'chef_lan',
    nameVi: 'Chef Lan',
    speciesVi: 'Người',
    descriptionVi: 'Chuyên gia các món canh và lẩu cay nồng với huy hiệu muỗng vàng danh giá.',
    modelKey: 'human_lan',
    primaryColor: '#7c3aed',
    secondaryColor: '#faf5ff',
    hatType: 'baker_cap',
    accentColor: '#f59e0b',
    skinColor: '#ffedd5',
    eyeType: 'round',
    unlockConditionVi: 'Đạt tổng điểm tích lũy 5,000',
  },
];

export const PLAYER_COLORS = [
  '#ef4444', // 1: Red
  '#3b82f6', // 2: Blue
  '#22c55e', // 3: Green
  '#eab308', // 4: Yellow
  '#a855f7', // 5: Purple
  '#f97316', // 6: Orange
  '#06b6d4', // 7: Cyan
  '#ec4899', // 8: Pink
];
