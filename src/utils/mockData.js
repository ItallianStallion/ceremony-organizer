export const MOCK_EVENTS = [
  {
    id: '1', 
    title: 'Весільне торжество', 
    category: 'Весілля',
    description: 'Незабутній день вашого кохання — від першого танцю до прощального феєрверку.',
    price: 45000,
    // Весільний вівтар на вулиці - світло та урочисто
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&h=400&fit=crop',
    includes: ['Декор залу та вхідна зона','Фотограф на 8 годин','Координатор заходу','Ведучий / MC','Квіткові композиції (10 шт)','Банкетне обслуговування до 50 гостей'],
    guestRange: '20–200 осіб', minGuests: 20, maxGuests: 200,
    addons: [
      { id: 'a1', label: 'Відеозйомка', price: 8000 },
      { id: 'a2', label: 'Феєрверк', price: 5000 },
      { id: 'a3', label: 'Лімузин', price: 3500 },
    ],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2', 
    title: 'Корпоративний захід', 
    category: 'Корпоратив',
    description: 'Зміцнюйте команду на стильному корпоративному заході з індивідуальною програмою.',
    price: 28000,
    // Фуршет/коктейльна вечірка - ідеально для корпоративу
    imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=600&h=400&fit=crop',
    includes: ['Оренда зали','Технічне забезпечення','Кейтеринг','Ведучий','Тімбілдинг-активності'],
    guestRange: '10–150 осіб', minGuests: 10, maxGuests: 150,
    addons: [
      { id: 'a1', label: 'Брендований мерч', price: 4000 },
      { id: 'a2', label: 'Фотозона', price: 2000 },
      { id: 'a3', label: 'Живий гурт', price: 6000 },
    ],
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3', 
    title: 'День народження', 
    category: 'День народження',
    description: 'Святкуйте кожен рік яскраво! Оригінальний декор і унікальна атмосфера.',
    price: 15000,
    // Яскравий торт зі свічками
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&h=400&fit=crop',
    includes: ['Декор у вибраному стилі','Торт на замовлення','Фотозона','Ведучий','DJ'],
    guestRange: '10–80 осіб', minGuests: 10, maxGuests: 80,
    addons: [
      { id: 'a1', label: 'Аніматор', price: 2500 },
      { id: 'a2', label: 'Кенді-бар', price: 1800 },
      { id: 'a3', label: 'Повітряні кулі', price: 800 },
    ],
    createdAt: new Date('2024-01-03'),
  },
  {
    id: '4', 
    title: 'Ювілей', 
    category: 'Ювілей',
    description: 'Відзначте важливу дату з розмахом. Ретроспективна виставка та живий гурт.',
    price: 20000,
    // Елегантний бенкетний зал з келихами
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600&h=400&fit=crop',
    includes: ['Жива музика','Ретроспективна фотовиставка','Банкет','Відеозйомка','Квіти'],
    guestRange: '20–120 осіб', minGuests: 20, maxGuests: 120,
    addons: [
      { id: 'a1', label: 'Слайд-шоу', price: 1500 },
      { id: 'a2', label: 'Феєрверк', price: 4000 },
    ],
    createdAt: new Date('2024-01-04'),
  },
  {
    id: '5', 
    title: 'Заміський пікнік', 
    category: 'Пікнік',
    description: 'Легкий атмосферний пікнік на природі з банкетом і фотозоною.',
    price: 9000,
    // Затишна вечірка з гірляндами на вулиці
    imageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=600&h=400&fit=crop',
    includes: ['Локація на природі','Пікнікові меблі','Фотозона','Легкий кейтеринг'],
    guestRange: '5–40 осіб', minGuests: 5, maxGuests: 40,
    addons: [
      { id: 'a1', label: 'Гамаки та ігри', price: 1000 },
      { id: 'a2', label: 'Барбекю-сет', price: 2000 },
    ],
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '6', 
    title: 'Дитяче свято', 
    category: 'Дитяче',
    description: 'Казкове свято для найменших: аніматори, солодкий стіл і фотозона.',
    price: 11000,
    // Яскраві кульки та дитячий декор
    imageUrl: 'https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=600&h=400&fit=crop',
    includes: ['Аніматори','Солодкий стіл','Фотозона','Подарунки для гостей','Торт'],
    guestRange: '10–50 осіб', minGuests: 10, maxGuests: 50,
    addons: [
      { id: 'a1', label: 'Батут', price: 1500 },
      { id: 'a2', label: 'Фокусник', price: 2000 },
      { id: 'a3', label: 'Боді-арт', price: 900 },
    ],
    createdAt: new Date('2024-01-06'),
  },
];