import { SchemaName } from '../../common/interfaces/schema';
import type { Category, CategoryDocument } from '../../modules/category/schemas/category.schema';
import { Db, ObjectId } from 'mongodb';

export type CategoryFixture = {
  name: string;
  slug: string;
  subCategories: CategoryFixture[];
  sizeGroupSlug?: null | string;
};

export const insertCategoryFixtures = async (db: Db): Promise<any> => {
  const queue: { subCategories: CategoryFixture[]; parent: (Category & Pick<CategoryDocument, '_id'>) | null }[] = [];

  queue.push({ subCategories: categoryFixture, parent: null });

  while (queue.length > 0) {
    // categories to insert
    const { parent, subCategories } = queue.shift()!;

    for (const subCategory of subCategories) {
      const data = {
        name: subCategory.name,
        path: parent?.path ? `${parent.path}/${subCategory.slug}` : subCategory.slug,
        parent: parent?._id,
        ancestors: parent?._id ? [...parent.ancestors, parent._id] : [],
      };

      const response = await db.collection(SchemaName.CATEGORY).insertOne(data);

      const insertedCategory = {
        ...data,
        _id: new ObjectId(response.insertedId),
      };

      queue.push({ subCategories: subCategory.subCategories, parent: insertedCategory });
    }
  }
};

const categoryFixture: CategoryFixture[] = [
  {
    name: 'Женщинам',
    slug: 'womens',
    subCategories: [
      {
        name: 'Одежда',
        slug: 'clothes',
        subCategories: [
          {
            name: 'Верхняя одежда',
            slug: 'outerwear',
            subCategories: [
              {
                name: 'Анораки',
                slug: 'anoraks',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Бомберы',
                slug: 'bomber-jackets',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Джинсовые куртки',
                slug: 'denim-jackets',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Кожаные куртки',
                slug: 'leather-jackets',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Жилеты',
                slug: 'vests',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Ветровки и легкие куртки',
                slug: 'windbreaker',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Пальто',
                slug: 'coat',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Парки',
                slug: 'parkas',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Плащи и тренчи',
                slug: 'trench-coats-raincoats',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [
                  {
                    name: 'Плащи',
                    slug: 'raincoats',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Тренчи',
                    slug: 'trench-coats',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Пончо и кейпы',
                slug: 'ponchos-and-capes',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Пуховики',
                slug: 'puffer-jackets',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Зимние куртки',
                slug: 'snowsuits',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Шубы и дубленки',
                slug: 'fur-coats',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Платья',
            slug: 'dresses-and-sundresses',
            sizeGroupSlug: 'womens-clothes',
            subCategories: [
              {
                name: 'Короткие платья',
                slug: 'short-dresses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Длинные платья',
                slug: 'long-dresses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Платья миди',
                slug: 'mini-dresses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Вечерние платья',
                slug: 'evening-dresses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Свадебные платья',
                slug: 'wedding-dresses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Сарафаны',
                slug: 'sundresses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Туники',
                slug: 'tunics',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Юбки',
            slug: 'skirts',
            sizeGroupSlug: 'womens-clothes',
            subCategories: [
              {
                name: 'Мини юбки',
                slug: 'mini-skirts',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Миди юбки',
                slug: 'midi-skirts',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Длинные юбки',
                slug: 'long-skirts',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Блузы и рубашки',
            slug: 'blouses-and-shirts',
            subCategories: [
              {
                name: 'Блузы',
                slug: 'blouses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Рубашки',
                slug: 'shirts',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Боди',
                slug: 'body',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Майки и футболки',
            slug: 't-shirts-and-tanks',
            sizeGroupSlug: 'womens-clothes',
            subCategories: [
              {
                name: 'Футболки',
                slug: 't-shirts',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Майки',
                slug: 'tanks',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Поло',
                slug: 'Polo',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Топы',
                slug: 'tops',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Брюки',
            slug: 'pants',
            sizeGroupSlug: 'womens-bottoms',
            subCategories: [
              {
                name: 'Джинсы',
                slug: 'jeans',
                sizeGroupSlug: 'womens-bottoms',
                subCategories: [],
              },
              {
                name: 'Классические брюки',
                slug: 'classic-pants',
                sizeGroupSlug: 'womens-bottoms',
                subCategories: [],
              },
              {
                name: 'Повседневные брюки',
                slug: 'casual-pants',
                sizeGroupSlug: 'womens-bottoms',
                subCategories: [],
              },
              {
                name: 'Леггинсы',
                slug: 'leggings',
                sizeGroupSlug: 'womens-bottoms',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Шорты и бриджи',
            slug: 'shorts',
            sizeGroupSlug: 'womens-bottoms',
            subCategories: [
              {
                name: 'Шорты',
                slug: 'casual-shorts',
                sizeGroupSlug: 'womens-bottoms',
                subCategories: [],
              },
              {
                name: 'Бриджи',
                slug: 'bridges',
                sizeGroupSlug: 'womens-bottoms',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Кофты',
            slug: 'kofti',
            subCategories: [
              {
                name: 'Джемперы',
                slug: 'jumpers',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Свитеры',
                slug: 'sweaters',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Кардиганы',
                slug: 'cardigans',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Водолазки',
                slug: 'turtlenecks',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Свитшоты',
                slug: 'sweatshirts',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Худи',
                slug: 'hoodie',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Пуловеры',
                slug: 'pullovers',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Толстовки',
                slug: 'tolstovki',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Лонгсливы',
                slug: 'longsleeves',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Нижнее белье',
            slug: 'lingerie',
            subCategories: [
              {
                name: 'Бюстальтеры',
                slug: 'bras',
                sizeGroupSlug: 'bras',
                subCategories: [],
              },
              {
                name: 'Комплекты',
                slug: 'sets',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Трусы',
                slug: 'underwear',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Носки',
                slug: 'socks',
                sizeGroupSlug: 'womens-shoes',
                subCategories: [],
              },
              {
                name: 'Колготки',
                slug: 'tights',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Чулки',
                slug: 'chulki',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Купальники',
            slug: 'swimwear',
            sizeGroupSlug: 'womens-clothes',
            subCategories: [
              {
                name: 'Лифы',
                slug: 'bras',
                sizeGroupSlug: 'bras',
                subCategories: [],
              },
              {
                name: 'Плавки',
                slug: 'swimming-trunks',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Пляжные платья и туники',
                slug: 'beach-dresses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Раздельный купальники',
                slug: 'two-piece-swimwear',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Слитные купальники',
                slug: 'one-piece-swimwear',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Комбинезоны',
            slug: 'overalls',
            sizeGroupSlug: 'womens-clothes',
            subCategories: [],
          },
          {
            name: 'Одежда для дома',
            slug: 'home-clothes',
            sizeGroupSlug: 'womens-clothes',
            subCategories: [
              {
                name: 'Домашняя одежда',
                slug: 'home-clothes',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Пижамы',
                slug: 'pyjamas',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Ночнушки',
                slug: 'nightgowns',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Халаты',
                slug: 'bathrobes',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Пиджаки и костюмы',
            slug: 'blazers-and-suits',
            sizeGroupSlug: 'womens-clothes',
            subCategories: [
              {
                name: 'Пиджаки',
                slug: 'blazers',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Жилеты',
                slug: 'vests',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Жакеты',
                slug: 'jackets',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Костюмы с шортами',
                slug: 'shorts-suits',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Костюмы с брюками',
                slug: 'pant-suits',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Костюмы с юбкой',
                slug: 'skirt-suits',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Спортивная одежда',
            slug: 'sport',
            sizeGroupSlug: 'womens-clothes',
            subCategories: [
              {
                name: 'Верхняя одежда',
                slug: 'outerwear',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [
                  {
                    name: 'Ветровки',
                    slug: 'Windbreakers',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Дождевики',
                    slug: 'rain-jackets',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Жилеты',
                    slug: 'vests',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Зимние комбинезоны и костюмы',
                    slug: 'snowwear',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Платья',
                slug: 'dresses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Спортивные костюмы',
                slug: 'sport-suits',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Юбки',
                slug: 'skirts',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Футболки и майки',
                slug: 't-shirts-and-tanks',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [
                  {
                    name: 'Футболки',
                    slug: 't-shirts',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Майки',
                    slug: 'tanks',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Топы',
                    slug: 'tops',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Штаны и лосины',
                slug: 'pants-and-tights',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [
                  {
                    name: 'Штаны',
                    slug: 'pants',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Лосины и леггинсы',
                    slug: 'tights',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Шорты',
                slug: 'Shorts',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Нижнее белье',
                slug: 'lingerie',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [
                  {
                    name: 'Бюстальтеры',
                    slug: 'bras',
                    sizeGroupSlug: 'bras',
                    subCategories: [],
                  },
                  {
                    name: 'Комплекты',
                    slug: 'sets',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Трусы',
                    slug: 'underwear',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Носки',
                    slug: 'socks',
                    sizeGroupSlug: 'womens-shoes',
                    subCategories: [],
                  },
                  {
                    name: 'Термобелье',
                    slug: 'thermal-wear',
                    sizeGroupSlug: 'womens-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Кофты',
                slug: 'kofti',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Одежда для беременных',
            slug: 'pregnancy-clothes',
            sizeGroupSlug: 'womens-clothes',
            subCategories: [
              {
                name: 'Верхняя одежда',
                slug: 'outerwear',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Платья',
                slug: 'dresses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Сарафаны',
                slug: 'sundresses',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Футболки',
                slug: 't-shirts',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Джинсы',
                slug: 'jeans',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Брюки',
                slug: 'pants',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Купальники',
                slug: 'swimwear',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Белье',
                slug: 'lingerie',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
              {
                name: 'Другая одежда',
                slug: 'other',
                sizeGroupSlug: 'womens-clothes',
                subCategories: [],
              },
            ],
          },
        ],
      },
      {
        name: 'Обувь',
        slug: 'shoes',
        sizeGroupSlug: 'womens-shoes',
        subCategories: [
          {
            name: 'Ботинки',
            slug: 'boots',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Балетки',
            slug: 'ballets',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Ботильоны',
            slug: 'ankle-boots',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Сапоги',
            slug: 'sapogi',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Кроссовки и кеды',
            slug: 'trainers',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Вечерняя обувь',
            slug: 'evening-shoes',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Домашняя обувь',
            slug: 'home-shoes',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Босоножки',
            slug: 'sandals',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Туфли',
            slug: 'low-shoes',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Мокасины и топсайдеры',
            slug: 'moccasins-and-topsiders',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Сандалии',
            slug: 'sandalii',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Слипоны',
            slug: 'slip-ons',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Резиновая обувь',
            slug: 'rubber-shoes',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Сабо и мюли',
            slug: 'clogs-and-mules',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Эспадрильи',
            slug: 'espadrilles',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
          {
            name: 'Ботфорты',
            slug: 'treads',
            sizeGroupSlug: 'womens-shoes',
            subCategories: [],
          },
        ],
      },
      {
        name: 'Аксессуары',
        slug: 'accessories',
        subCategories: [
          {
            name: 'Сумки',
            slug: 'bags',
            subCategories: [
              {
                name: 'Клатчи',
                slug: 'clutches',
                subCategories: [],
              },
              {
                name: 'С длинными ручками',
                slug: 'long-hands',
                subCategories: [],
              },
              {
                name: 'С короткими ручками',
                slug: 'short-hands',
                subCategories: [],
              },
              {
                name: 'Рюкзаки',
                slug: 'backpacks',
                subCategories: [],
              },
              {
                name: 'Дорожные чемоданы',
                slug: 'travel-bags',
                subCategories: [],
              },
              {
                name: 'Кошельки',
                slug: 'wallets',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Очки',
            slug: 'glasses',
            subCategories: [],
          },
          {
            name: 'Головные уборы',
            slug: 'hats',
            subCategories: [
              {
                name: 'Шапки',
                slug: 'hats',
                subCategories: [],
              },
              {
                name: 'Бейсболки и кепки',
                slug: 'baseball-caps',
                subCategories: [],
              },
              {
                name: 'Шляпы',
                slug: 'shlyapa',
                subCategories: [],
              },
              {
                name: 'Панамы',
                slug: 'panamas',
                subCategories: [],
              },
              {
                name: 'Повязки на голову',
                slug: 'headbands',
                subCategories: [],
              },
              {
                name: 'Береты',
                slug: 'berets',
                subCategories: [],
              },
              {
                name: 'Банданы',
                slug: 'bandanas',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Украшения и часы',
            slug: 'jewellery-and-watches',
            subCategories: [
              {
                name: 'Подвески',
                slug: 'pendants',
                subCategories: [],
              },
              {
                name: 'Колье и ожерелья',
                slug: 'necklaces',
                subCategories: [],
              },
              {
                name: 'Обручи',
                slug: 'hoops',
                subCategories: [],
              },
              {
                name: 'Чокеры',
                slug: 'chokers',
                subCategories: [],
              },
              {
                name: 'Заколки',
                slug: 'hairpins',
                subCategories: [],
              },
              {
                name: 'Цепочки',
                slug: 'chains',
                subCategories: [],
              },
              {
                name: 'Кулоны',
                slug: 'kulony',
                subCategories: [],
              },
              {
                name: 'Серьги',
                slug: 'earrings',
                subCategories: [],
              },
              {
                name: 'Кольца',
                slug: 'rings',
                subCategories: [],
              },
              {
                name: 'Браслеты',
                slug: 'bracelets',
                subCategories: [],
              },
              {
                name: 'Броши',
                slug: 'brooches',
                subCategories: [],
              },
              {
                name: 'Наборы',
                slug: 'sets',
                subCategories: [],
              },
              {
                name: 'Часы',
                slug: 'watches',
                subCategories: [],
              },
              {
                name: 'Другие украшения',
                slug: 'other',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Ремни',
            slug: 'belts',
            subCategories: [],
          },
          {
            name: 'Шарфы и платки',
            slug: 'scarves-and-shawls',
            subCategories: [],
          },
          {
            name: 'Галстуки и бабочки',
            slug: 'ties-and-bow-ties',
            subCategories: [],
          },
          {
            name: 'Перчатки и варежки',
            slug: 'gloves',
            subCategories: [],
          },
          {
            name: 'Зонты',
            slug: 'umbrellas',
            subCategories: [],
          },
          {
            name: 'Другие аксессуары',
            slug: 'other',
            subCategories: [],
          },
        ],
      },
    ],
  },
  {
    name: 'Мужчинам',
    slug: 'mens',
    subCategories: [
      {
        name: 'Одежда',
        slug: 'clothes',
        subCategories: [
          {
            name: 'Верхняя одежда',
            slug: 'outerwear',
            subCategories: [
              {
                name: 'Анораки',
                slug: 'anoraks',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Бомберы',
                slug: 'bomber-jackets',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Джинсовые куртки',
                slug: 'denim-jackets',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Кожаные куртки',
                slug: 'leather-jackets',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Жилеты',
                slug: 'vests',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Ветровки и легкие куртки',
                slug: 'windbreaker',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Пальто',
                slug: 'coat',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Парки',
                slug: 'parkas',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Плащи',
                slug: 'raincoats',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Пуховики',
                slug: 'puffer-jackets',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Зимние куртки',
                slug: 'snowsuits',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Шубы и дубленки',
                slug: 'fur-coats',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Рубашки',
            slug: 'shirts',
            subCategories: [],
          },
          {
            name: 'Майки и футболки',
            slug: 't-shirts-and-tanks',
            sizeGroupSlug: 'mens-clothes',
            subCategories: [
              {
                name: 'Футболки',
                slug: 't-shirts',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Майки',
                slug: 'tanks',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Поло',
                slug: 'Polo',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Брюки',
            slug: 'pants',
            sizeGroupSlug: 'mens-bottoms',
            subCategories: [
              {
                name: 'Джинсы',
                slug: 'jeans',
                sizeGroupSlug: 'mens-bottoms',
                subCategories: [],
              },
              {
                name: 'Классические брюки',
                slug: 'classic-pants',
                sizeGroupSlug: 'mens-bottoms',
                subCategories: [],
              },
              {
                name: 'Повседневные брюки',
                slug: 'casual-pants',
                sizeGroupSlug: 'mens-bottoms',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Шорты и бриджи',
            slug: 'shorts',
            sizeGroupSlug: 'mens-bottoms',
            subCategories: [
              {
                name: 'Шорты',
                slug: 'casual-shorts',
                sizeGroupSlug: 'mens-bottoms',
                subCategories: [],
              },
              {
                name: 'Бриджи',
                slug: 'bridges',
                sizeGroupSlug: 'mens-bottoms',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Кофты и свитера',
            slug: 'kofti-and-sweaters',
            subCategories: [
              {
                name: 'Джемперы',
                slug: 'jumpers',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Свитеры',
                slug: 'sweaters',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Кардиганы',
                slug: 'cardigans',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Водолазки',
                slug: 'turtlenecks',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Свитшоты',
                slug: 'sweatshirts',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Худи',
                slug: 'hoodie',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Пуловеры',
                slug: 'pullovers',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Толстовки',
                slug: 'tolstovki',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Лонгсливы',
                slug: 'longsleeves',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Нижнее белье',
            slug: 'lingerie',
            subCategories: [
              {
                name: 'Комплекты',
                slug: 'sets',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Трусы',
                slug: 'underwear',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Носки',
                slug: 'socks',
                sizeGroupSlug: 'mens-shoes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Плавки',
            slug: 'swimwear',
            sizeGroupSlug: 'mens-clothes',
            subCategories: [],
          },
          {
            name: 'Комбинезоны',
            slug: 'overalls',
            sizeGroupSlug: 'mens-clothes',
            subCategories: [],
          },
          {
            name: 'Одежда для дома',
            slug: 'home-clothes',
            sizeGroupSlug: 'mens-clothes',
            subCategories: [
              {
                name: 'Домашняя одежда',
                slug: 'home-clothes',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Пижамы',
                slug: 'pyjamas',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Ночнушки',
                slug: 'nightgowns',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Халаты',
                slug: 'bathrobes',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Пиджаки и костюмы',
            slug: 'blazers-and-suits',
            subCategories: [
              {
                name: 'Пиджаки',
                slug: 'blazers',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Жилеты',
                slug: 'vests',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Костюмы',
                slug: 'suits',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Спортивная одежда',
            slug: 'sport',
            sizeGroupSlug: 'mens-clothes',
            subCategories: [
              {
                name: 'Верхняя одежда',
                slug: 'outerwear',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [
                  {
                    name: 'Ветровки',
                    slug: 'Windbreakers',
                    sizeGroupSlug: 'mens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Дождевики',
                    slug: 'rain-jackets',
                    sizeGroupSlug: 'mens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Жилеты',
                    slug: 'vests',
                    sizeGroupSlug: 'mens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Зимние комбинезоны и костюмы',
                    slug: 'snowwear',
                    sizeGroupSlug: 'mens-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Спортивные костюмы',
                slug: 'sport-suits',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Футболки и майки',
                slug: 't-shirts-and-tanks',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [
                  {
                    name: 'Футболки',
                    slug: 't-shirts',
                    sizeGroupSlug: 'mens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Майки',
                    slug: 'tanks',
                    sizeGroupSlug: 'mens-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Штаны',
                slug: 'pants-and-tights',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Шорты',
                slug: 'Shorts',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
              {
                name: 'Нижнее белье',
                slug: 'lingerie',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [
                  {
                    name: 'Комплекты',
                    slug: 'sets',
                    sizeGroupSlug: 'mens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Трусы',
                    slug: 'underwear',
                    sizeGroupSlug: 'mens-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Носки',
                    slug: 'socks',
                    sizeGroupSlug: 'mens-shoes',
                    subCategories: [],
                  },
                  {
                    name: 'Термобелье',
                    slug: 'thermal-wear',
                    sizeGroupSlug: 'mens-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Кофты',
                slug: 'kofti',
                sizeGroupSlug: 'mens-clothes',
                subCategories: [],
              },
            ],
          },
        ],
      },
      {
        name: 'Обувь',
        slug: 'shoes',
        subCategories: [
          {
            name: 'Ботинки',
            slug: 'boots',
            sizeGroupSlug: 'mens-shoes',
            subCategories: [],
          },
          {
            name: 'Сапоги',
            slug: 'sapogi',
            sizeGroupSlug: 'mens-shoes',
            subCategories: [],
          },
          {
            name: 'Кроссовки',
            slug: 'trainers',
            sizeGroupSlug: 'mens-shoes',
            subCategories: [],
          },
          {
            name: 'Кеды',
            slug: 'sneakers',
            sizeGroupSlug: 'mens-shoes',
            subCategories: [],
          },
          {
            name: 'Домашняя обувь',
            slug: 'home-shoes',
            sizeGroupSlug: 'mens-shoes',
            subCategories: [],
          },
          {
            name: 'Туфли',
            slug: 'low-shoes',
            sizeGroupSlug: 'mens-shoes',
            subCategories: [],
          },
          {
            name: 'Мокасины',
            slug: 'moccasins',
            sizeGroupSlug: 'mens-shoes',
            subCategories: [],
          },
          {
            name: 'Сандалии',
            slug: 'sandalii',
            sizeGroupSlug: 'mens-shoes',
            subCategories: [],
          },
          {
            name: 'Резиновая обувь',
            slug: 'rubber-shoes',
            sizeGroupSlug: 'mens-shoes',
            subCategories: [],
          },
          {
            name: 'Слипоны и эспадрильи',
            slug: 'espadrilles',
            sizeGroupSlug: 'mens-shoes',
            subCategories: [],
          },
        ],
      },
      {
        name: 'Аксессуары',
        slug: 'accessories',
        subCategories: [
          {
            name: 'Сумки и рюкзаки',
            slug: 'bags -and-backpacks',
            subCategories: [
              {
                name: 'Сумки',
                slug: 'bags',
                subCategories: [],
              },
              {
                name: 'Рюкзаки',
                slug: 'backpacks',
                subCategories: [],
              },
              {
                name: 'Спортивные сумки',
                slug: 'training-bags',
                subCategories: [],
              },
              {
                name: 'Портфели',
                slug: 'portfolio',
                subCategories: [],
              },
              {
                name: 'Барсетки',
                slug: 'messenger-bags',
                subCategories: [],
              },
              {
                name: 'Дорожные',
                slug: 'travel-bags',
                subCategories: [],
              },
              {
                name: 'Чемоданы',
                slug: 'suitcases',
                subCategories: [],
              },
              {
                name: 'Кошельки',
                slug: 'wallets',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Очки',
            slug: 'glasses',
            subCategories: [],
          },
          {
            name: 'Головные уборы',
            slug: 'hats',
            subCategories: [
              {
                name: 'Шапки',
                slug: 'hats',
                subCategories: [],
              },
              {
                name: 'Бейсболки',
                slug: 'baseball-caps',
                subCategories: [],
              },
              {
                name: 'Кепки',
                slug: 'caps',
                subCategories: [],
              },
              {
                name: 'Шляпы',
                slug: 'shlyapi',
                subCategories: [],
              },
              {
                name: 'Панамы',
                slug: 'panamas',
                subCategories: [],
              },
              {
                name: 'Береты',
                slug: 'berets',
                subCategories: [],
              },
              {
                name: 'Банданы',
                slug: 'bandanas',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Украшения',
            slug: 'jewellery',
            subCategories: [
              {
                name: 'Цепочки',
                slug: 'chains',
                subCategories: [],
              },
              {
                name: 'Серьги',
                slug: 'earrings',
                subCategories: [],
              },
              {
                name: 'Кольца и перстни',
                slug: 'rings',
                subCategories: [],
              },
              {
                name: 'Браслеты',
                slug: 'bracelets',
                subCategories: [],
              },
              {
                name: 'Запонки',
                slug: 'cufflinks',
                subCategories: [],
              },
              {
                name: 'Другие украшения',
                slug: 'other',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Ремни',
            slug: 'belts',
            subCategories: [],
          },
          {
            name: 'Часы',
            slug: 'watches',
            subCategories: [],
          },
          {
            name: 'Шарфы',
            slug: 'scarves',
            subCategories: [],
          },
          {
            name: 'Галстуки и бабочки',
            slug: 'ties-and-bow-ties',
            subCategories: [],
          },
          {
            name: 'Перчатки',
            slug: 'gloves',
            subCategories: [],
          },
          {
            name: 'Другие аксессуары',
            slug: 'other',
            subCategories: [],
          },
        ],
      },
    ],
  },
  {
    name: 'Детям',
    slug: 'kids',
    subCategories: [
      {
        name: 'Девочкам',
        slug: 'girls',
        sizeGroupSlug: 'kids-clothes',
        subCategories: [
          {
            name: 'Одежда',
            slug: 'clothes',
            sizeGroupSlug: 'kids-clothes',
            subCategories: [
              {
                name: 'Верхняя одежда',
                slug: 'outerwear',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [
                  {
                    name: 'Куртки',
                    slug: 'coats',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Жилеты',
                    slug: 'vests',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Пальто',
                    slug: 'coat',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Парки',
                    slug: 'parkas',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Плащи',
                    slug: 'raincoats',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Пуховики',
                    slug: 'puffer-jackets',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Комбинезоны',
                    slug: 'snowsuits',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Шубы и дубленки',
                    slug: 'fur-coats',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Блузы и Рубашки',
                slug: 'blouses-and-shirts',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Майки и футболки',
                slug: 't-shirts-and-tanks',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Брюки, джинсы и лосины',
                slug: 'pants',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Платья и сарафаны',
                slug: 'dresses',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Юбки',
                slug: 'skirts',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Шорты',
                slug: 'shorts',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Кофты и свитера',
                slug: 'kofti-and-sweaters',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Нижнее белье',
                slug: 'lingerie',
                subCategories: [
                  {
                    name: 'Комплекты',
                    slug: 'sets',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Трусы',
                    slug: 'underwear',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Носки',
                    slug: 'socks',
                    sizeGroupSlug: 'kids-shoes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Купальники',
                slug: 'swimwear',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Комбинезоны',
                slug: 'overalls',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Одежда для дома',
                slug: 'home-clothes',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [
                  {
                    name: 'Домашняя одежда',
                    slug: 'home-clothes',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Пижамы',
                    slug: 'pyjamas',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Ночнушки',
                    slug: 'nightgowns',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Халаты',
                    slug: 'bathrobes',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Костюмы',
                slug: 'suits',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Спортивная одежда',
                slug: 'sport',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [
                  {
                    name: 'Верхняя одежда',
                    slug: 'outerwear',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [
                      {
                        name: 'Куртки',
                        slug: 'coats',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Ветровки',
                        slug: 'Windbreakers',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Дождевики',
                        slug: 'rain-jackets',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Жилеты',
                        slug: 'vests',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Зимние комбинезоны и костюмы',
                        slug: 'snowwear',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                    ],
                  },
                  {
                    name: 'Спортивные костюмы',
                    slug: 'sport-suits',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Футболки и майки',
                    slug: 't-shirts-and-tanks',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [
                      {
                        name: 'Футболки',
                        slug: 't-shirts',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Майки',
                        slug: 'tanks',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                    ],
                  },
                  {
                    name: 'Штаны',
                    slug: 'pants-and-tights',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Шорты',
                    slug: 'Shorts',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Нижнее белье',
                    slug: 'lingerie',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [
                      {
                        name: 'Комплекты',
                        slug: 'sets',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Трусы',
                        slug: 'underwear',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Носки',
                        slug: 'socks',
                        sizeGroupSlug: 'kids-shoes',
                        subCategories: [],
                      },
                      {
                        name: 'Термобелье',
                        slug: 'thermal-wear',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                    ],
                  },
                  {
                    name: 'Кофты',
                    slug: 'kofti',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                ],
              },
            ],
          },
          {
            name: 'Обувь',
            slug: 'shoes',
            sizeGroupSlug: 'kids-shoes',
            subCategories: [
              {
                name: 'Босоножки и шлепанцы',
                slug: 'sandals',
                sizeGroupSlug: 'kids-shoes',
                subCategories: [],
              },
              {
                name: 'Сапоги и ботинки',
                slug: 'boots',
                sizeGroupSlug: 'kids-shoes',
                subCategories: [],
              },
              {
                name: 'Кроссовки и кеды',
                slug: 'trainers',
                sizeGroupSlug: 'kids-shoes',
                subCategories: [],
              },
              {
                name: 'Туфли',
                slug: 'low-shoes',
                sizeGroupSlug: 'kids-shoes',
                subCategories: [],
              },
              {
                name: 'Другая обувь',
                slug: 'other',
                sizeGroupSlug: 'kids-shoes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Аксессуары',
            slug: 'accessories',
            subCategories: [
              {
                name: 'Сумки и рюкзаки',
                slug: 'bags -and-backpacks',
                subCategories: [],
              },
              {
                name: 'Очки',
                slug: 'glasses',
                subCategories: [],
              },
              {
                name: 'Головные уборы',
                slug: 'hats',
                subCategories: [],
              },
              {
                name: 'Украшения',
                slug: 'jewellery',
                subCategories: [],
              },
              {
                name: 'Ремни',
                slug: 'belts',
                subCategories: [],
              },
              {
                name: 'Часы',
                slug: 'watches',
                subCategories: [],
              },
              {
                name: 'Перчатки',
                slug: 'gloves',
                subCategories: [],
              },
              {
                name: 'Другие аксессуары',
                slug: 'other',
                subCategories: [],
              },
            ],
          },
        ],
      },
      {
        name: 'Мальчикам',
        slug: 'boys',
        sizeGroupSlug: 'kids-clothes',
        subCategories: [
          {
            name: 'Одежда',
            slug: 'clothes',
            sizeGroupSlug: 'kids-clothes',
            subCategories: [
              {
                name: 'Верхняя одежда',
                slug: 'outerwear',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [
                  {
                    name: 'Куртки',
                    slug: 'coats',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Жилеты',
                    slug: 'vests',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Пальто',
                    slug: 'coat',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Парки',
                    slug: 'parkas',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Плащи',
                    slug: 'raincoats',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Пуховики',
                    slug: 'puffer-jackets',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Комбинезоны',
                    slug: 'snowsuits',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Шубы и дубленки',
                    slug: 'fur-coats',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Рубашки',
                slug: 'shirts',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Майки и футболки',
                slug: 't-shirts-and-tanks',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Брюки, джинсы и лосины',
                slug: 'pants',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Шорты',
                slug: 'shorts',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Кофты и свитера',
                slug: 'kofti-and-sweaters',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Нижнее белье',
                slug: 'lingerie',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [
                  {
                    name: 'Комплекты',
                    slug: 'sets',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Трусы',
                    slug: 'underwear',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Носки',
                    slug: 'socks',
                    sizeGroupSlug: 'kids-shoes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Купальники',
                slug: 'swimwear',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Комбинезоны',
                slug: 'overalls',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Одежда для дома',
                slug: 'home-clothes',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [
                  {
                    name: 'Домашняя одежда',
                    slug: 'home-clothes',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Пижамы',
                    slug: 'pyjamas',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Ночнушки',
                    slug: 'nightgowns',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Халаты',
                    slug: 'bathrobes',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                ],
              },
              {
                name: 'Костюмы',
                slug: 'suits',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [],
              },
              {
                name: 'Спортивная одежда',
                slug: 'sport',
                sizeGroupSlug: 'kids-clothes',
                subCategories: [
                  {
                    name: 'Верхняя одежда',
                    slug: 'outerwear',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [
                      {
                        name: 'Куртки',
                        slug: 'coats',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Ветровки',
                        slug: 'Windbreakers',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Дождевики',
                        slug: 'rain-jackets',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Жилеты',
                        slug: 'vests',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Зимние комбинезоны и костюмы',
                        slug: 'snowwear',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                    ],
                  },
                  {
                    name: 'Спортивные костюмы',
                    slug: 'sport-suits',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Футболки и майки',
                    slug: 't-shirts-and-tanks',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [
                      {
                        name: 'Футболки',
                        slug: 't-shirts',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Майки',
                        slug: 'tanks',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                    ],
                  },
                  {
                    name: 'Штаны',
                    slug: 'pants-and-tights',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Шорты',
                    slug: 'Shorts',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                  {
                    name: 'Нижнее белье',
                    slug: 'lingerie',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [
                      {
                        name: 'Комплекты',
                        slug: 'sets',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Трусы',
                        slug: 'underwear',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                      {
                        name: 'Носки',
                        slug: 'socks',
                        sizeGroupSlug: 'kids-shoes',
                        subCategories: [],
                      },
                      {
                        name: 'Термобелье',
                        slug: 'thermal-wear',
                        sizeGroupSlug: 'kids-clothes',
                        subCategories: [],
                      },
                    ],
                  },
                  {
                    name: 'Кофты',
                    slug: 'kofti',
                    sizeGroupSlug: 'kids-clothes',
                    subCategories: [],
                  },
                ],
              },
            ],
          },
          {
            name: 'Обувь',
            slug: 'shoes',
            sizeGroupSlug: 'kids-shoes',
            subCategories: [
              {
                name: 'Босоножки и шлепанцы',
                slug: 'sandals',
                sizeGroupSlug: 'kids-shoes',
                subCategories: [],
              },
              {
                name: 'Сапоги и ботинки',
                slug: 'boots',
                sizeGroupSlug: 'kids-shoes',
                subCategories: [],
              },
              {
                name: 'Кроссовки и кеды',
                slug: 'trainers',
                sizeGroupSlug: 'kids-shoes',
                subCategories: [],
              },
              {
                name: 'Туфли',
                slug: 'low-shoes',
                sizeGroupSlug: 'kids-shoes',
                subCategories: [],
              },
              {
                name: 'Другая обувь',
                slug: 'other',
                sizeGroupSlug: 'kids-shoes',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Аксессуары',
            slug: 'accessories',
            subCategories: [
              {
                name: 'Сумки и рюкзаки',
                slug: 'bags -and-backpacks',
                subCategories: [],
              },
              {
                name: 'Очки',
                slug: 'glasses',
                subCategories: [],
              },
              {
                name: 'Головные уборы',
                slug: 'hats',
                subCategories: [],
              },
              {
                name: 'Украшения',
                slug: 'jewellery',
                subCategories: [],
              },
              {
                name: 'Ремни',
                slug: 'belts',
                subCategories: [],
              },
              {
                name: 'Часы',
                slug: 'watches',
                subCategories: [],
              },
              {
                name: 'Перчатки',
                slug: 'gloves',
                subCategories: [],
              },
              {
                name: 'Другие аксессуары',
                slug: 'other',
                subCategories: [],
              },
            ],
          },
        ],
      },
      {
        name: 'Малышам',
        slug: 'infants',
        sizeGroupSlug: 'infants-clothes',
        subCategories: [
          {
            name: 'Одежды',
            slug: 'clothes',
            sizeGroupSlug: 'infants-clothes',
            subCategories: [
              {
                name: 'Костюмы и комплекты',
                slug: 'suits-and-sets',
                sizeGroupSlug: 'infants-clothes',
                subCategories: [],
              },
              {
                name: 'Боди, человечки, песочники',
                slug: 'body',
                sizeGroupSlug: 'infants-clothes',
                subCategories: [],
              },
              {
                name: 'Ползунки, штаны, шорты',
                slug: 'pants-and-shorts',
                sizeGroupSlug: 'infants-clothes',
                subCategories: [],
              },
              {
                name: 'Распашонки и кофты',
                slug: 'kofti',
                sizeGroupSlug: 'infants-clothes',
                subCategories: [],
              },
              {
                name: 'Платья, сарафаны, юбки',
                slug: 'dresses-and-skirts',
                sizeGroupSlug: 'infants-clothes',
                subCategories: [],
              },
              {
                name: 'Вверхняя одежда',
                slug: 'outerwear',
                sizeGroupSlug: 'infants-clothes',
                subCategories: [],
              },
              {
                name: 'Футболки и майки',
                slug: 't-shirts-and-tanks',
                sizeGroupSlug: 'infants-clothes',
                subCategories: [],
              },
              {
                name: 'Другая одежда',
                slug: 'other',
                subCategories: [],
              },
            ],
          },
          {
            name: 'Обувь',
            slug: 'shoes',
            sizeGroupSlug: 'infants-shoes',
            subCategories: [],
          },
        ],
      },
    ],
  },
  {
    name: 'Красота и здоровье',
    slug: 'beauty-and-wellness',
    subCategories: [
      {
        name: 'Мужская косметика',
        slug: 'mens-skincare',
        subCategories: [],
      },
      {
        name: 'Парфюмерия',
        slug: 'perfumery',
        subCategories: [],
      },
      {
        name: 'Маникюр и педикюр',
        slug: 'manicure-and-pedicure',
        subCategories: [],
      },
      {
        name: 'Косметика для волос',
        slug: 'haircare',
        subCategories: [],
      },
      {
        name: 'Косметика для лица',
        slug: 'skincare',
        subCategories: [],
      },
      {
        name: 'Тело и ванна',
        slug: 'bath-and-tube',
        subCategories: [],
      },
    ],
  },
  {
    name: 'Для дома',
    slug: 'home',
    subCategories: [
      {
        name: 'Посуда',
        slug: 'tableware',
        subCategories: [],
      },
      {
        name: 'Книги',
        slug: 'books',
        subCategories: [],
      },
      {
        name: 'Домашний текстиль',
        slug: 'home-textiles',
        subCategories: [],
      },
    ],
  },
];
