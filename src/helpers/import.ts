import {PortfolioItem} from '../models/portfolio-item.model.js';
import { PortfolioCategory } from '../models/portfolio-category.model.js';

const portfolioItems = [
  {
    title: 'Логотип Асоціації зброярів України',
    description: 'Дизайн логотипу громадської організації "Асоціація Зброярів України"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Чио Сан"',
    description: 'Дизайн логотипу для серії фруктових вин торгової марки "Чио Сан"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Аква Маркет"',
    description:
      'Дизайн логотипу та елементи корпоративного стилю інтернет-магазину з продажу бутильованої води та супровідних товарів "Аква Маркет"',
    categories: 'Айдентика',
  },
  {
    title: 'Ілюстрації на тему квітів та рослин',
    description: 'Створення графічних ілюстрацій для упаковок кремів для тіла ТМ "Повна Чаша"',
    categories: 'Ілюстрації',
  },
  {
    title: 'Ілюстрації на фруктово-ягідну тему',
    description: 'Створення графічних ілюстрацій для упаковок соків та нектарів ТМ "Повна Чаша"',
    categories: 'Ілюстрації',
  },
  {
    title: 'Ілюстрації для мюслів',
    description: 'Створення графічних ілюстрацій для етикеток мюслів ТМ "Повна Чаша"',
    categories: 'Ілюстрації',
  },
  {
    title: 'Етикетки для вина "Almatera"',
    description: 'Дизайн етикеток для лінійки чілійських вин ТМ "Almatera"',
    categories: 'Упаковка',
  },
  {
    title: 'Піктограми для зубної пасти',
    description: 'Створення серії піктограм для упаковки зубної пасти ТМ "Stardent"',
    categories: 'Ілюстрації',
  },
  {
    title: 'Ілюстрації продуктів харчування',
    description: 'Розробка графічних ілюстрацій для упаковок продуктів харчування ТМ "Премія"',
    categories: 'Ілюстрації',
  },
  {
    title: 'Серія піктограм для промтоварів',
    description: 'Створення серії піктограм для упаковок промислових товарів ТМ "Премія"',
    categories: 'Ілюстрації',
  },
  {
    title: 'Логотип "City Маркет"',
    description: 'Дизайн логотипу та корпоративного стилю для інтернет-магазину з продажу продуктів харчування',
    categories: 'Айдентика',
  },
  {
    title: 'Розробка ТМ "Das Ist!"',
    description: 'Розробка назви та логотипу для торгової марки продуктів харчування з Німеччини',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Деко Транс"',
    description:
      'Дизайн логотипу та елементів корпоративного стилю компанії з постачання запасних частин для залізничного транспорту',
    categories: 'Айдентика',
  },
  {
    title: 'Дизайн рекламних матеріалів для ТМ "Душа пивовара"',
    description: 'Дизайн рекламних матеріалів, включаючи розробку слогана для ТМ "Душа пивовара"',
    categories: 'Поліграфія',
  },
  {
    title: 'Упаковка сирів "Feel The Cheese"',
    description: 'Дизайн упаковки лінійки м\'яких імпортних сирів ТМ "Feel The Cheese"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка сирів ТМ "Euro Mark"',
    description: 'Дизайн упаковки серії нарізок європейського виробництва торгової марки "Euro Mark"',
    categories: 'Упаковка',
  },
  {
    title: 'Етикетки "Душевна Настоянка"',
    description: 'Дизайн етикеток лінійки настоянок на коньяку ТМ "Душевна настоянка"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка крем-сиру "Das Ist!"',
    description: 'Дизайн упаковок для серії крем-сирів ТМ "Das Ist!"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка сирів "Das Ist!"',
    description: 'Дизайн серії упаковок сирів у слайсах ТМ "Das Ist!"',
    categories: 'Упаковка',
  },
  {
    title: 'Верстка сайту Linux Admin',
    description: 'Адаптивна верстка сайту IT-компанії Linux Admin',
    categories: 'Веб',
  },
  {
    title: 'Верстка сайту Ciklum HR',
    description: 'Адаптивна верстка сайту щодо підбору співробітників IT-компанії Ciklum',
    categories: 'Веб',
  },
  {
    title: 'Верстка сайту PHP Developers',
    description: 'Адаптивна верстка сайту PHP Developers IT-компанії Ciklum',
    categories: 'Веб',
  },
  {
    title: 'Верстка сайту Ciklum',
    description: 'Адаптивна верстка сайту IT-компанії Ciklum',
    categories: 'Веб',
  },
  {
    title: "Постер для Новоград-Волинського М'ясокомбінату",
    description: "Дизайн постера для Новгород-Волинського М'ясокомбінату",
    categories: 'Поліграфія',
  },
  {
    title: 'Журнальна реклама соків “Мрія”',
    description: 'Дизайн журнальної реклами соків ТМ "Мрія". Проект також включав організацію та проведення фотосесії',
    categories: 'Поліграфія',
  },
  {
    title: 'Білборди та постери горілки "Холодний Яр"',
    description:
      'Створення серії білбордів та постерів, включаючи проведення фотосесії, для торгової марки "Холодний Яр"',
    categories: 'Поліграфія',
  },
  {
    title: 'Логотип "Ice Shock"',
    description:
      'Розробка логотипу для компанії з виробництва харчового та сухого льоду, а також крижаних скульптур для свят та корпоративів "Ice Shock"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Холодний Яр"',
    description: 'Розробка логотипу для лінійки горілок "Холодний Яр"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Hike"',
    description: 'Створення логотипу та слогану для торгової марки пива "Hike"',
    categories: 'Айдентика',
  },
  {
    title: 'Розробка ТМ "Feel the Cheese"',
    description: 'Розробка назви та логотипу для торгової марки сирних продуктів "Feel the Cheese"',
    categories: 'Айдентика',
  },
  {
    title: 'Розробка ТМ "Euro Mark"',
    description: 'Розробка торгової марки для продуктів харчування з Європи, включаючи назву та дизайн логотипу',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Душа Пивовара"',
    description: 'Розробка назви та логотипу для пивної торгової марки "Душа Пивовара"',
    categories: 'Айдентика',
  },
  {
    title: 'Верстка сайту Pug It',
    description: 'Адаптивна верстка сайту компанії Pug It',
    categories: 'Веб',
  },
  {
    title: 'Логотип "Пивоварня Радомишля"',
    description: 'Розробка логотипу для торгової марки пива "Пивоварня Радомишля"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Полоскун"',
    description: 'Дизайн логотипу для серії пральних порошків "Полоскун" торгової марки "Премія"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Пешка"',
    description: 'Розробка логотипу для інтернет-магазину шахів "Пешка"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Om Space Studio"',
    description: 'Дизайн логотипу та елементів корпоративного стилю для студії медитації "Om Space Studio"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Мрія"',
    description: 'Дизайн логотипу для лінійки соків та нектарів торгової марки "Мрія"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Luxury Travel & Event"',
    description: 'Варіанти дизайну логотипу для компанії з організації VIP заходів "Luxury Travel &amp; Event"',
    categories: 'Айдентика',
  },
  {
    title: 'Упаковка грецького йогурту ТМ "Feel the Yogurt"',
    description: 'Дизайн упаковки грецького йогурту торгової марки "Feel the Yogurt"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка вершкового масла ТМ "Feel the Butter"',
    description: 'Дизайн упаковки вершкового масла із Німеччини торгової марки "Feel the Butter"',
    categories: 'Упаковка',
  },
  {
    title: 'Створення рекламних ілюстрацій',
    description:
      "Створення цілісних ілюстрацій з різних елементів шляхом комп'ютерного композитингу без проведення фотосесії для торгової мережі “Сільпо”",
    categories: 'Ілюстрації',
  },
  {
    title: 'Логотип "Телефабрика"',
    description: 'Розробка логотипу для творчого об\'єднання "Телефабрика"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Таяна"',
    description: 'Розробка логотипу для питної бутильованої води "Таяна"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Світ М\'яса"',
    description: 'Розробка логотипу для торгової марки м\'ясних продуктів ТМ "Світ М\'яса"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Stardent"',
    description: 'Розробка логотипу для лінійки зубних паст торгової марки "Stardent"',
    categories: 'Айдентика',
  },
  {
    title: 'Упаковка лінійки соків "100% фрукти" ТМ "Мрія"',
    description: 'Дизайн упаковок серії соків "100% фрукти" ТМ "Мрія", включаючи проведення фотосесії',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка лінійки соків "Надзвичайні фрукти" ТМ "Мрія"',
    description: 'Дизайн упаковок серії соків "Надзвичайні фрукти" ТМ "Мрія", включаючи проведення фотосесії',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка макаронних виробів "Макарошки"',
    description: 'Дизайн упаковки, включаючи створення ілюстрації для торгової марки макаронних виробів ТМ "Макарошки"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка горілки "Холодний Яр"',
    description:
      'Розробка оригінальної упаковки, включаючи дизайн пляшки, ковпачка та етикеток для горілчаної серії торгової марки "Холодний Яр"',
    categories: 'Упаковка',
  },
  {
    title: 'Етикетки пива "Hike"',
    description: 'Дизайн етикеток лінійки пива торгової марки "Hike"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка крем-сиру ТМ "Feel the Cheese"',
    description: 'Дизайн упаковки для серії крем-сирів торгової марки "Feel the Cheese"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка кисломолочного напою "Feel the Active Drink"',
    description: 'Дизайн упаковки для серії кисломолочних напоїв із фруктовим соком "Feel the Active Drink"',
    categories: 'Упаковка',
  },
  {
    title: 'Логотип пива "Рогань"',
    description: 'Дизайн логотипу для торгової марки пива "Рогань"',
    categories: 'Айдентика',
  },
  {
    title: 'Етикетка "Пшеничне Еталон"',
    description: 'Дизайн етикеток та келиха для нефільтрованого пива торгової марки "Пшеничне Еталон"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка снеків ТМ "Повна Чаша"',
    description: 'Дизайн лінійки упаковок снеків "Хрустики" торгової марки "Повна Чаша"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка печива ТМ "Повна Чаша"',
    description: 'Дизайн лінійки упаковок печива "Double Cake" торгової марки "Повна Чаша"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка "Pasta Paolo"',
    description: 'Дизайн лінійки упаковок макаронних виробів торгової марки "Pasta Paolo"',
    categories: 'Упаковка',
  },
  {
    title: 'Етикетка пива "Obolon Export"',
    description: 'Пропозиція щодо дизайну етикетки пива торгової марки "Obolon Export"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка зубочисток "Премія"',
    description: 'Дизайн серії упаковок зубочисток торгової марки "Премія"',
    categories: 'Упаковка',
  },
  {
    title: 'Дизайн упаковок станків для гоління ТМ "Премія"',
    description: 'Дизайн упаковок лінійки чоловічих та жіночих станків для гоління та змінних картриджів ТМ "Премія"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка великоднього кексу "Панеттоне"',
    description: 'Дизайн упаковки великоднього кексу "Панеттоне" торгової марки "Премія"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка філе оселедця ТМ "Премія"',
    description: 'Дизайн лінійки упаковок філе оселедця торгової марки "Премія"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка засобів для взуття ТМ "Премія"',
    description: 'Дизайн упаковок засобів для догляду за взуттям торгової марки "Премія"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка кетчупів "Премія"',
    description: 'Дизайн лінійки упаковок кетчупів торгової марки "Премія"',
    categories: 'Упаковка',
  },
  {
    title: 'Сітілайт пива "Hike"',
    description: 'Створення сітілайт-постеру для пива "Hike", включаючи проведення фотосесії',
    categories: 'Поліграфія',
  },
  {
    title: 'Листівка ТМ "Світ М\'яса"',
    description: 'Дизайн рекламної листівка для торгової марки м\'ясних делікатесів "Світ М\'яса"',
    categories: 'Поліграфія',
  },
  {
    title: 'Білборд та постер для пива "Рогань"',
    description: 'Дизайн серії спонсорських рекламних білбордів та постерів ТМ "Рогань" з Андрієм Шевченком',
    categories: 'Поліграфія',
  },
  {
    title: 'Рекламна кампанія пива "Рогань"',
    description:
      'Дизайн загальнонаціональної рекламної кампанії пива ТМ "Рогань". Проект також включав створення концепції та проведення фотосесії',
    categories: 'Поліграфія',
  },
  {
    title: 'Журнальна реклама Пивоварні Радомишля',
    description:
      'Дизайн серії макетів у пресу, включаючи проведення фотозйомок, для торгової марки пива "Пивоварня Радомишля"',
    categories: 'Поліграфія',
  },
  {
    title: 'Постери пива "Пшеничне Еталон"',
    description: 'Дизайн постерів для торгової марки нефільтрованого пива "Пшеничне Еталон"',
    categories: 'Поліграфія',
  },
  {
    title: 'Упаковка зубной пасти "Stardent"',
    description: 'Дизайн лінійки упаковок зубних паст торгової марки "Stardent"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковки головоломок "Smart Cube"',
    description: 'Дизайн серії упаковок для головоломок ТМ Smart Cube',
    categories: 'Упаковка',
  },
  {
    title: 'Логотип пива "Пшеничне Еталон"',
    description: 'Розробка логотипу для нефільтрованого пшеничного пива ТМ "Пшеничне Еталон"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Оранжеві Соки"',
    description: 'Розробка логотипу для лінійки фруктових соків "Оранжеві Соки"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Лісова ягода"',
    description: 'Розробка логотипу для морсів торгової марки "Лісова ягода"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Древлянський Квас"',
    description: 'Розробка логотипу для торгової марки "Древлянський квас"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Кувшинка"',
    description: 'Розробка логотипу для горілки торгової марки "Кувшинка"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Kristall"',
    description: 'Розробка логотипу для пшеничного пива торгової марки "Kristall"',
    categories: 'Айдентика',
  },
  {
    title: 'Етикетка для пива "Kristall"',
    description: 'Розробка дизайну етикетки та келиха для пшеничного пива ТМ "Kristall"',
    categories: 'Упаковка',
  },
  {
    title: 'Етикетка пива "Душа Пивовара"',
    description: 'Дизайн лінійки етикеток пива ТМ "Душа Пивовара"',
    categories: 'Упаковка',
  },
  {
    title: 'Етикетка для вода "Айсберг"',
    description: 'Дизайн етикетки для бутильованої води ТМ "Айсберг"',
    categories: 'Упаковка',
  },
  {
    title: 'Етикетка для води "Ефект 811"',
    description: 'Дизайн етикетки для бутильованої води ТМ "Ефект 811"',
    categories: 'Упаковка',
  },
  {
    title: 'Логотип "Звенигора"',
    description: 'Розробка логотипу для лінійки сирних продуктів торгової марки "Звенигора"',
    categories: 'Айдентика',
  },
  {
    title: 'Логотип "Tendita"',
    description: 'Розробка логотипу для торгової марки сирних продуктів "Tendita"',
    categories: 'Айдентика',
  },
  {
    title: 'Розробка ТМ "Продартіль"',
    description: 'Розробка назви та логотипу для торгової марки продуктів харчування "Продартіль"',
    categories: 'Айдентика',
  },
  {
    title: 'Етикетка для води "Таяна"',
    description: 'Дизайн етикетки для бутильованої води ТМ "Таяна"',
    categories: 'Упаковка',
  },
  {
    title: 'Етикетки "Самий Сік"',
    description: 'Дизайн етикеток для лінійки фруктово-овочевих соків прямого віджиму ТМ "Самий Сік"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка напівсолодких вин ТМ "Повна Чарка"',
    description: 'Дизайну упаковок для лінійки напівсолодких вин ТМ "Повна Чарка"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка шампунів "Повна Чаша"',
    description: 'Дизайн серії упаковок шампунів та бальзамів для волосся торгової марки "Повна Чаша"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка портвейнів "Повна Чарка"',
    description: 'Розробка дизайну упаковки для лінійки портвейнів ТМ "Повна Чарка"',
    categories: 'Упаковка',
  },
  {
    title: 'Етикетка для води "Оазис"',
    description: 'Дизайн етикетки для бутильованої води ТМ "Оазис"',
    categories: 'Упаковка',
  },
  {
    title: 'Етикетка "Древлянський Квас"',
    description: 'Розробка етикеток для квасу торгової марки "Древлянський Квас"',
    categories: 'Упаковка',
  },
  {
    title: 'Постер пива "Kristall"',
    description: 'Створення постера для пшеничного пива торгової марки "Kristall"',
    categories: 'Поліграфія',
  },
  {
    title: 'Білборд пива "Kristall"',
    description: 'Створення вертикального білборду для пшеничного пива торгової марки "Kristall"',
    categories: 'Поліграфія',
  },
  {
    title: 'Етикетка пива "Янтар"',
    description: 'Дизайн етикетки для пива торгової марки "Янтар"',
    categories: 'Упаковка',
  },
  {
    title: 'Етикетка для води "Vesna"',
    description: 'Дизайну етикетки для бутильованої води "Vesna"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка сирних делікатесів "Tendita"',
    description: 'Дизайн упаковки для лінійки сирних делікатесів торгової марки "Tendita"',
    categories: 'Упаковка',
  },
  {
    title: 'Упаковка м\'яких сирів "Tendita"',
    description: 'Дизайн упаковки для лінійки м\'яких французьких сирів Камамбер торгової марки "Tendita"',
    categories: 'Упаковка',
  },
  {
    title: 'Білборд пива ТМ ”Радомишль”',
    description: 'Дизайн білборду для пива торгової марки "Радомишль"',
    categories: 'Поліграфія',
  },
  {
    title: 'Розробка ТМ "Don Jamón"',
    description: "Розробка назви та логотипу для торгової марки іспанських м'ясних делікатесів",
    categories: 'Айдентика',
  },
  {
    title: 'Білборд соків "Мрія"',
    description: 'Дизайн білборду для соків торгової марки "Мрія"',
    categories: 'Поліграфія',
  },
];

export const importPortfolioItems = async () => {
  try {
    console.log(`🚀 Starting import of ${portfolioItems.length} items...`);

    let importedCount = 0;
    let errors: string[] = [];
    let skippedCount = 0;
    for (const [index, item] of portfolioItems.entries()) {
      try {
        const result = await importSingleItem(item, index);
        if (result.imported) {
          importedCount++;
          console.log(`✅ ${importedCount}/${portfolioItems.length}: ${item.title}`);
        } else {
          skippedCount++;
          console.log(`⚠️ Skipped: ${item.title} (duplicate)`);
        }
      } catch (error) {
        errors.push(`Item ${index + 1} (${item.title || 'untitled'}): ${error.message}`);
        console.error(`❌ Error importing item ${index + 1}:`, error.message);
      }
    }
    console.log(`🎉 Import completed:`);
    console.log(`   ✅ Imported: ${importedCount}`);
    console.log(`   ⚠️ Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errors.length}`);

    if (errors.length > 0) {
      console.log(`\n📋 Errors:`);
      errors.forEach((error) => console.log(`   - ${error}`));
    }

    return {
      imported: importedCount,
      skipped: skippedCount,
      errors: errors.length,
      errorDetails: errors,
    };
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
};

async function importSingleItem(item: any, index: number): Promise<{ imported: boolean }> {
  // Validate required fields
  if (!item.title) {
    throw new Error(`Missing required field: title`);
  }

  // Check for duplicates
  const existing = await PortfolioItem.findOne({ title: item.title });
  if (existing) {
    return { imported: false };
  }

  // Handle categories
  const categoryIds: string[] = [];
  if (item.categories) {
    const categoryName = item.categories;
    // for (const categoryName of item.categories) {
      if (typeof categoryName === 'string' && categoryName.trim()) {
        let category = await PortfolioCategory.findOne({ name: categoryName.trim() });
        if (!category) {
          category = new PortfolioCategory({ name: categoryName.trim() });
          await category.save();
        }
        categoryIds.push(category._id.toString());
      }
    // }
  }

  // Create portfolio item
  const portfolioData = {
    title: item.title,
    description: item.description || '',
    categories: categoryIds,
    mediaFiles: [],
    status: item.status || 'draft',
    importedFrom: 'console',
    metadata: {
      originalIndex: index,
      importDate: new Date()
    }
  };

  const portfolioItem = new PortfolioItem(portfolioData);
  await portfolioItem.save();

  return { imported: true };
}