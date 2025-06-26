import AWS from 'aws-sdk';

// models
import {PortfolioItem} from '../models/portfolio-item.model.js';
import { PortfolioCategory } from '../models/portfolio-category.model.js';
import { MediaFile } from '../models/file.model.js';

// helpers
import { generateDateBasedPath } from '../helpers/media-files.js';
import e from 'express';

const portfolioItems = [
    {
        "title": "Логотип Асоціації зброярів України",
        "description": "Дизайн логотипу громадської організації \"Асоціація Зброярів України\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Чио Сан\"",
        "description": "Дизайн логотипу для серії фруктових вин торгової марки \"Чио Сан\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Аква Маркет\"",
        "description": "Дизайн логотипу та елементи корпоративного стилю інтернет-магазину з продажу бутильованої води та супровідних товарів \"Аква Маркет\"",
        "categories": "Айдентика",
        "secondImageUrl": "http://intelligent-project.com/wp-content/uploads/identity_akvamarket_02.png"
    },
    {
        "title": "Ілюстрації на тему квітів та рослин",
        "description": "Створення графічних ілюстрацій для упаковок кремів для тіла ТМ \"Повна Чаша\"",
        "categories": "Ілюстрації",
        "secondImageUrl": null
    },
    {
        "title": "Ілюстрації на фруктово-ягідну тему",
        "description": "Створення графічних ілюстрацій для упаковок соків та нектарів ТМ \"Повна Чаша\"",
        "categories": "Ілюстрації",
        "secondImageUrl": null
    },
    {
        "title": "Ілюстрації для мюслів",
        "description": "Створення графічних ілюстрацій для етикеток мюслів ТМ \"Повна Чаша\"",
        "categories": "Ілюстрації",
        "secondImageUrl": null
    },
    {
        "title": "Етикетки для вина \"Almatera\"",
        "description": "Дизайн етикеток для лінійки чілійських вин ТМ \"Almatera\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Піктограми для зубної пасти",
        "description": "Створення серії піктограм для упаковки зубної пасти ТМ \"Stardent\"",
        "categories": "Ілюстрації",
        "secondImageUrl": null
    },
    {
        "title": "Ілюстрації продуктів харчування",
        "description": "Розробка графічних ілюстрацій для упаковок продуктів харчування ТМ \"Премія\"",
        "categories": "Ілюстрації",
        "secondImageUrl": null
    },
    {
        "title": "Серія піктограм для промтоварів",
        "description": "Створення серії піктограм для упаковок промислових товарів ТМ \"Премія\"",
        "categories": "Ілюстрації",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"City Маркет\"",
        "description": "Дизайн логотипу та корпоративного стилю для інтернет-магазину з продажу продуктів харчування",
        "categories": "Айдентика",
        "secondImageUrl": "http://intelligent-project.com/wp-content/uploads/identity_citymarket_02.png"
    },
    {
        "title": "Розробка ТМ \"Das Ist!\"",
        "description": "Розробка назви та логотипу для торгової марки продуктів харчування з Німеччини",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Деко Транс\"",
        "description": "Дизайн логотипу та елементів корпоративного стилю компанії з постачання запасних частин для залізничного транспорту",
        "categories": "Айдентика",
        "secondImageUrl": "http://intelligent-project.com/wp-content/uploads/identity_dekotrans_02.png"
    },
    {
        "title": "Дизайн рекламних матеріалів для ТМ \"Душа пивовара\"",
        "description": "Дизайн рекламних матеріалів, включаючи розробку слогана для ТМ \"Душа пивовара\"",
        "categories": "Поліграфія"
    },
    {
        "title": "Упаковка сирів \"Feel The Cheese\"",
        "description": "Дизайн упаковки лінійки м'яких імпортних сирів ТМ \"Feel The Cheese\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка сирів ТМ \"Euro Mark\"",
        "description": "Дизайн упаковки серії нарізок європейського виробництва торгової марки \"Euro Mark\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Етикетки \"Душевна Настоянка\"",
        "description": "Дизайн етикеток лінійки настоянок на коньяку ТМ \"Душевна настоянка\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка крем-сиру \"Das Ist!\"",
        "description": "Дизайн упаковок для серії крем-сирів ТМ \"Das Ist!\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка сирів \"Das Ist!\"",
        "description": "Дизайн серії упаковок сирів у слайсах ТМ \"Das Ist!\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Верстка сайту Linux Admin",
        "description": "Адаптивна верстка сайту IT-компанії Linux Admin",
        "categories": "Веб"
    },
    {
        "title": "Верстка сайту Ciklum HR",
        "description": "Адаптивна верстка сайту щодо підбору співробітників IT-компанії Ciklum",
        "categories": "Веб"
    },
    {
        "title": "Верстка сайту PHP Developers",
        "description": "Адаптивна верстка сайту PHP Developers IT-компанії Ciklum",
        "categories": "Веб",
        "secondImageUrl": "http://intelligent-project.com/wp-content/uploads/web_ciklum_developers_02.png"
    },
    {
        "title": "Верстка сайту Ciklum",
        "description": "Адаптивна верстка сайту IT-компанії Ciklum",
        "categories": "Веб"
    },
    {
        "title": "Постер для Новоград-Волинського М'ясокомбінату",
        "description": "Дизайн постера для Новгород-Волинського М'ясокомбінату",
        "categories": "Поліграфія",
        "secondImageUrl": null
    },
    {
        "title": "Журнальна реклама соків “Мрія”",
        "description": "Дизайн журнальної реклами соків ТМ \"Мрія\". Проект також включав організацію та проведення фотосесії",
        "categories": "Поліграфія",
        "secondImageUrl": null
    },
    {
        "title": "Білборди та постери горілки \"Холодний Яр\"",
        "description": "Створення серії білбордів та постерів, включаючи проведення фотосесії, для торгової марки \"Холодний Яр\"",
        "categories": "Поліграфія",
        "secondImageUrl": "http://intelligent-project.com/wp-content/uploads/print_holodnyyar1_02.png"
    },
    {
        "title": "Логотип \"Ice Shock\"",
        "description": "Розробка логотипу для компанії з виробництва харчового та сухого льоду, а також крижаних скульптур для свят та корпоративів \"Ice Shock\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Холодний Яр\"",
        "description": "Розробка логотипу для лінійки горілок \"Холодний Яр\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Hike\"",
        "description": "Створення логотипу та слогану для торгової марки пива \"Hike\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Розробка ТМ \"Feel the Cheese\"",
        "description": "Розробка назви та логотипу для торгової марки сирних продуктів \"Feel the Cheese\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Розробка ТМ \"Euro Mark\"",
        "description": "Розробка торгової марки для продуктів харчування з Європи, включаючи назву та дизайн логотипу",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Душа Пивовара\"",
        "description": "Розробка назви та логотипу для пивної торгової марки \"Душа Пивовара\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Верстка сайту Pug It",
        "description": "Адаптивна верстка сайту компанії Pug It",
        "categories": "Веб",
        "secondImageUrl": "http://intelligent-project.com/wp-content/uploads/web_pug_it_02.png"
    },
    {
        "title": "Логотип \"Пивоварня Радомишля\"",
        "description": "Розробка логотипу для торгової марки пива \"Пивоварня Радомишля\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Полоскун\"",
        "description": "Дизайн логотипу для серії пральних порошків \"Полоскун\" торгової марки \"Премія\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Пешка\"",
        "description": "Розробка логотипу для інтернет-магазину шахів \"Пешка\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Om Space Studio\"",
        "description": "Дизайн логотипу та елементів корпоративного стилю для студії медитації \"Om Space Studio\"",
        "categories": "Айдентика",
        "secondImageUrl": "http://intelligent-project.com/wp-content/uploads/identity_omspacestudio_02.png"
    },
    {
        "title": "Логотип \"Мрія\"",
        "description": "Дизайн логотипу для лінійки соків та нектарів торгової марки \"Мрія\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Luxury Travel & Event\"",
        "description": "Варіанти дизайну логотипу для компанії з організації VIP заходів \"Luxury Travel &amp; Event\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка грецького йогурту ТМ \"Feel the Yogurt\"",
        "description": "Дизайн упаковки грецького йогурту торгової марки \"Feel the Yogurt\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка вершкового масла ТМ \"Feel the Butter\"",
        "description": "Дизайн упаковки вершкового масла із Німеччини торгової марки \"Feel the Butter\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Створення рекламних ілюстрацій",
        "description": "Створення цілісних ілюстрацій з різних елементів шляхом комп'ютерного композитингу без проведення фотосесії для торгової мережі “Сільпо”",
        "categories": "Ілюстрації",
        "secondImageUrl": "http://intelligent-project.com/wp-content/uploads/illustration_vigne_compisiting_02.png"
    },
    {
        "title": "Логотип \"Телефабрика\"",
        "description": "Розробка логотипу для творчого об'єднання \"Телефабрика\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Таяна\"",
        "description": "Розробка логотипу для питної бутильованої води \"Таяна\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Світ М'яса\"",
        "description": "Розробка логотипу для торгової марки м'ясних продуктів ТМ \"Світ М'яса\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Stardent\"",
        "description": "Розробка логотипу для лінійки зубних паст торгової марки \"Stardent\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка лінійки соків \"100% фрукти\" ТМ \"Мрія\"",
        "description": "Дизайн упаковок серії соків \"100% фрукти\" ТМ \"Мрія\", включаючи проведення фотосесії",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка лінійки соків \"Надзвичайні фрукти\" ТМ \"Мрія\"",
        "description": "Дизайн упаковок серії соків \"Надзвичайні фрукти\" ТМ \"Мрія\", включаючи проведення фотосесії",
        "categories": "Упаковка",
        "secondImageUrl": "http://intelligent-project.com/wp-content/uploads/packaging_mriya_juices1_01.png"
    },
    {
        "title": "Упаковка макаронних виробів \"Макарошки\"",
        "description": "Дизайн упаковки, включаючи створення ілюстрації для торгової марки макаронних виробів ТМ \"Макарошки\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка горілки \"Холодний Яр\"",
        "description": "Розробка оригінальної упаковки, включаючи дизайн пляшки, ковпачка та етикеток для горілчаної серії торгової марки \"Холодний Яр\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Етикетки пива \"Hike\"",
        "description": "Дизайн етикеток лінійки пива торгової марки \"Hike\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка крем-сиру ТМ \"Feel the Cheese\"",
        "description": "Дизайн упаковки для серії крем-сирів торгової марки \"Feel the Cheese\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка кисломолочного напою \"Feel the Active Drink\"",
        "description": "Дизайн упаковки для серії кисломолочних напоїв із фруктовим соком \"Feel the Active Drink\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Логотип пива \"Рогань\"",
        "description": "Дизайн логотипу для торгової марки пива \"Рогань\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка \"Пшеничне Еталон\"",
        "description": "Дизайн етикеток та келиха для нефільтрованого пива торгової марки \"Пшеничне Еталон\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка снеків ТМ \"Повна Чаша\"",
        "description": "Дизайн лінійки упаковок снеків \"Хрустики\" торгової марки \"Повна Чаша\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка печива ТМ \"Повна Чаша\"",
        "description": "Дизайн лінійки упаковок печива \"Double Cake\" торгової марки \"Повна Чаша\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка \"Pasta Paolo\"",
        "description": "Дизайн лінійки упаковок макаронних виробів торгової марки \"Pasta Paolo\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка пива \"Obolon Export\"",
        "description": "Пропозиція щодо дизайну етикетки пива торгової марки \"Obolon Export\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка зубочисток \"Премія\"",
        "description": "Дизайн серії упаковок зубочисток торгової марки \"Премія\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Дизайн упаковок станків для гоління ТМ \"Премія\"",
        "description": "Дизайн упаковок лінійки чоловічих та жіночих станків для гоління та змінних картриджів ТМ \"Премія\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка великоднього кексу \"Панеттоне\"",
        "description": "Дизайн упаковки великоднього кексу \"Панеттоне\" торгової марки \"Премія\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка філе оселедця ТМ \"Премія\"",
        "description": "Дизайн лінійки упаковок філе оселедця торгової марки \"Премія\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка засобів для взуття ТМ \"Премія\"",
        "description": "Дизайн упаковок засобів для догляду за взуттям торгової марки \"Премія\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка кетчупів \"Премія\"",
        "description": "Дизайн лінійки упаковок кетчупів торгової марки \"Премія\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Сітілайт пива \"Hike\"",
        "description": "Створення сітілайт-постеру для пива \"Hike\", включаючи проведення фотосесії",
        "categories": "Поліграфія",
        "secondImageUrl": null
    },
    {
        "title": "Листівка ТМ \"Світ М'яса\"",
        "description": "Дизайн рекламної листівка для торгової марки м'ясних делікатесів \"Світ М'яса\"",
        "categories": "Поліграфія",
        "secondImageUrl": null
    },
    {
        "title": "Білборд та постер для пива \"Рогань\"",
        "description": "Дизайн серії спонсорських рекламних білбордів та постерів ТМ \"Рогань\" з Андрієм Шевченком",
        "categories": "Поліграфія",
        "secondImageUrl": null
    },
    {
        "title": "Рекламна кампанія пива \"Рогань\"",
        "description": "Дизайн загальнонаціональної рекламної кампанії пива ТМ \"Рогань\". Проект також включав створення концепції та проведення фотосесії",
        "categories": "Поліграфія",
        "secondImageUrl": null
    },
    {
        "title": "Журнальна реклама Пивоварні Радомишля",
        "description": "Дизайн серії макетів у пресу, включаючи проведення фотозйомок, для торгової марки пива \"Пивоварня Радомишля\"",
        "categories": "Поліграфія",
        "secondImageUrl": null
    },
    {
        "title": "Постери пива \"Пшеничне Еталон\"",
        "description": "Дизайн постерів для торгової марки нефільтрованого пива \"Пшеничне Еталон\"",
        "categories": "Поліграфія",
        "secondImageUrl": "https://intelligent-project.com/wp-content/uploads/print_pe_02.png"
    },
    {
        "title": "Упаковка зубной пасти \"Stardent\"",
        "description": "Дизайн лінійки упаковок зубних паст торгової марки \"Stardent\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковки головоломок \"Smart Cube\"",
        "description": "Дизайн серії упаковок для головоломок ТМ Smart Cube",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Логотип пива \"Пшеничне Еталон\"",
        "description": "Розробка логотипу для нефільтрованого пшеничного пива ТМ \"Пшеничне Еталон\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Оранжеві Соки\"",
        "description": "Розробка логотипу для лінійки фруктових соків \"Оранжеві Соки\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Лісова ягода\"",
        "description": "Розробка логотипу для морсів торгової марки \"Лісова ягода\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Древлянський Квас\"",
        "description": "Розробка логотипу для торгової марки \"Древлянський квас\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Кувшинка\"",
        "description": "Розробка логотипу для горілки торгової марки \"Кувшинка\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Kristall\"",
        "description": "Розробка логотипу для пшеничного пива торгової марки \"Kristall\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка для пива \"Kristall\"",
        "description": "Розробка дизайну етикетки та келиха для пшеничного пива ТМ \"Kristall\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка пива \"Душа Пивовара\"",
        "description": "Дизайн лінійки етикеток пива ТМ \"Душа Пивовара\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка для вода \"Айсберг\"",
        "description": "Дизайн етикетки для бутильованої води ТМ \"Айсберг\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка для води \"Ефект 811\"",
        "description": "Дизайн етикетки для бутильованої води ТМ \"Ефект 811\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Звенигора\"",
        "description": "Розробка логотипу для лінійки сирних продуктів торгової марки \"Звенигора\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Логотип \"Tendita\"",
        "description": "Розробка логотипу для торгової марки сирних продуктів \"Tendita\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Розробка ТМ \"Продартіль\"",
        "description": "Розробка назви та логотипу для торгової марки продуктів харчування \"Продартіль\"",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка для води \"Таяна\"",
        "description": "Дизайн етикетки для бутильованої води ТМ \"Таяна\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Етикетки \"Самий Сік\"",
        "description": "Дизайн етикеток для лінійки фруктово-овочевих соків прямого віджиму ТМ \"Самий Сік\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка напівсолодких вин ТМ \"Повна Чарка\"",
        "description": "Дизайну упаковок для лінійки напівсолодких вин ТМ \"Повна Чарка\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка шампунів \"Повна Чаша\"",
        "description": "Дизайн серії упаковок шампунів та бальзамів для волосся торгової марки \"Повна Чаша\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка портвейнів \"Повна Чарка\"",
        "description": "Розробка дизайну упаковки для лінійки портвейнів ТМ \"Повна Чарка\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка для води \"Оазис\"",
        "description": "Дизайн етикетки для бутильованої води ТМ \"Оазис\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка \"Древлянський Квас\"",
        "description": "Розробка етикеток для квасу торгової марки \"Древлянський Квас\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Постер пива \"Kristall\"",
        "description": "Створення постера для пшеничного пива торгової марки \"Kristall\"",
        "categories": "Поліграфія",
        "secondImageUrl": null
    },
    {
        "title": "Білборд пива \"Kristall\"",
        "description": "Створення вертикального білборду для пшеничного пива торгової марки \"Kristall\"",
        "categories": "Поліграфія",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка пива \"Янтар\"",
        "description": "Дизайн етикетки для пива торгової марки \"Янтар\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Етикетка для води \"Vesna\"",
        "description": "Дизайну етикетки для бутильованої води \"Vesna\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка сирних делікатесів \"Tendita\"",
        "description": "Дизайн упаковки для лінійки сирних делікатесів торгової марки \"Tendita\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Упаковка м'яких сирів \"Tendita\"",
        "description": "Дизайн упаковки для лінійки м'яких французьких сирів Камамбер торгової марки \"Tendita\"",
        "categories": "Упаковка",
        "secondImageUrl": null
    },
    {
        "title": "Білборд пива ТМ ”Радомишль”",
        "description": "Дизайн білборду для пива торгової марки \"Радомишль\"",
        "categories": "Поліграфія",
        "secondImageUrl": null
    },
    {
        "title": "Розробка ТМ \"Don Jamón\"",
        "description": "Розробка назви та логотипу для торгової марки іспанських м'ясних делікатесів",
        "categories": "Айдентика",
        "secondImageUrl": null
    },
    {
        "title": "Білборд соків \"Мрія\"",
        "description": "Дизайн білборду для соків торгової марки \"Мрія\"",
        "categories": "Поліграфія",
        "secondImageUrl": null
    }
]

const spacesProvider = {
  aws: {
    bucket: process.env.DIGITALOCEAN_SPACE_BUCKET!,
    region: process.env.DIGITALOCEAN_SPACE_REGION!,
    endpoint: new AWS.Endpoint(process.env.DIGITALOCEAN_SPACE_ENDPOINT!),
  },
};

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

    let createdMediaId;
  
let createdMedia;
  // Check for duplicates
  const existing = await PortfolioItem.findOne({ title: item.title });

  if (existing && !item.secondImageUrl) {
    return { imported: false };
  }

  if (existing && item.secondImageUrl) {
    const mediaResponse = await createMediaFilesFromUrls(item.secondImageUrl, existing.id);
    createdMedia = mediaResponse.mediaFile;
    createdMediaId = mediaResponse.createdMediaId;

    existing.mediaFiles.push(createdMediaId);
    await existing.save();
    return { imported: true };
  }

  if (!existing && item.secondImageUrl) {
    const mediaResponse = await createMediaFilesFromUrls(item.secondImageUrl);
    createdMedia = mediaResponse.mediaFile;
    createdMediaId = mediaResponse.createdMediaId;
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

  if (createdMediaId) {
    portfolioData.mediaFiles.push(createdMediaId);
  }

  const portfolioItem = new PortfolioItem(portfolioData);
  await portfolioItem.save();

  if (!existing && createdMedia) {
    createdMedia.portfolioItems.push(portfolioItem.id);
    await createdMedia.save();
  }

//   if (portfolioItem && item.secondImageUrl && !createdMediaId) {
//     const createdMedia = await createMediaFilesFromUrls(item.secondImageUrl, portfolioItem.id);
//     createdMediaId = createdMedia.createdMediaId;

//     await portfolioItem.up
//   }

  return { imported: true };
}

export async function createMediaFilesFromUrls(imageUrls: string, forPortfolioItemId?: string): Promise<{createdMediaId: string, mediaFile: any}> {
  console.log(`🚀 Starting bulk import of ${imageUrls.length} images...`);
  
  const results = {
    imported: 0,
    failed: 0,
    errors: [] as string[]
  };

  let createdMediaId: string;
let mediaFile;
  for (const [index, url] of [imageUrls].entries()) {
    try {
      console.log(`📥 ${index + 1}/${imageUrls.length}: Processing ${url}`);
      
      mediaFile = await downloadAndCreateMediaFile(url, forPortfolioItemId);
      results.imported++;
      createdMediaId = mediaFile.id;
      
      console.log(`✅ Created: ${mediaFile.s3Key} for forPortfolioItemId: ${forPortfolioItemId || 'N/A'}`);
      
    } catch (error) {
      results.failed++;
      results.errors.push(`${url}: ${error.message}`);
      console.error(`❌ Failed: ${url} - ${error.message}`);
    }
    
    // Add small delay to avoid overwhelming the server
    if (index < imageUrls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`🎉 Bulk import completed:`);
  console.log(`   ✅ Imported: ${results.imported}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log(`\n📋 Errors:`);
    results.errors.forEach(error => console.log(`   - ${error}`));
  }

    // return  // the last from array of create (the only for now)
  return {createdMediaId: createdMediaId, mediaFile: mediaFile};
}

async function downloadAndCreateMediaFile(imageUrl: string, portfolioItemId?: string): Promise<any> {
  try {
    // 1. Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // 2. Get file info
    const urlParts = new URL(imageUrl);
    const originalFilename = urlParts.pathname.split('/').pop() || 'image';
    const extension = originalFilename.includes('.') 
      ? originalFilename.split('.').pop() 
      : 'jpg';
    
    const contentType = response.headers.get('content-type') || `image/${extension}`;
    
    // 3. Generate S3 key
    const s3Key = generateDateBasedPath('imported', null, originalFilename);

    const s3 = new AWS.S3({
        endpoint: spacesProvider.aws.endpoint,
        accessKeyId: process.env.DIGITALOCEAN_SPACE_ACCESS_KEY!,
        secretAccessKey: process.env.DIGITALOCEAN_SPACE_SECRET_KEY!,
        region: spacesProvider.aws.region,
    });
    
    // 4. Upload to S3/Digital Ocean Spaces
    await s3.upload({
      Bucket: process.env.DIGITALOCEAN_SPACE_BUCKET!,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read' // Make images publicly accessible
    }).promise();

    // 5. Create MediaFile record
    const mediaFile = new MediaFile({
      s3Key,
      bucket: process.env.DIGITALOCEAN_SPACE_BUCKET!,
      mime: contentType,
      originalName: originalFilename,
      size: buffer.length,
      portfolioItems: portfolioItemId ? [portfolioItemId] : [], // Empty initially
      metadata: {
        sourceUrl: imageUrl,
        importedAt: new Date(),
        importMethod: 'url-bulk-import-when-custom-importing'
      }
    });

    await mediaFile.save();
    return mediaFile;

  } catch (error) {
    throw new Error(`Download/upload failed: ${error.message}`);
  }
}