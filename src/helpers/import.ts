import AWS from 'aws-sdk';

// models
import { PortfolioItem } from '../models/portfolio-item.model.js';
import { PortfolioCategory } from '../models/portfolio-category.model.js';
import { MediaFile } from '../models/file.model.js';

// helpers
import { generateDateBasedPath } from '../helpers/media-files.js';
import { getMediaUrl } from '../helpers/url.js';


const portfolioItems = [
  {
    "title": "Розробка ТМ \"Das Ist!\"",
    "description": "Розробка назви та логотипу для торгової марки продуктів харчування з Німеччини",
    "link": "https://intelligent-project.com/intproj-portfolio/das-ist/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_dasist_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Деко Транс\"",
    "description": "Дизайн логотипу та елементів корпоративного стилю компанії з постачання запасних частин для залізничного транспорту",
    "link": "https://intelligent-project.com/intproj-portfolio/syr-kamamber-tendita/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_dekotrans_01.png",
    "imageGallery": [
      "https://intelligent-project.com/wp-content/uploads/identity_dekotrans_02.png"
    ]
  },
  {
    "title": "Логотип Асоціації зброярів України",
    "description": "Дизайн логотипу громадської організації \"Асоціація Зброярів України\"",
    "link": "https://intelligent-project.com/intproj-portfolio/azu/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_azu_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Чио Сан\"",
    "description": "Дизайн логотипу для серії фруктових вин торгової марки \"Чио Сан\"",
    "link": "https://intelligent-project.com/intproj-portfolio/chio-san/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_chiosan_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Аква Маркет\"",
    "description": "Дизайн логотипу та елементи корпоративного стилю інтернет-магазину з продажу бутильованої води та супровідних товарів \"Аква Маркет\"",
    "link": "https://intelligent-project.com/intproj-portfolio/akva-market/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_akvamarket_01.png",
    "imageGallery": [
      "https://intelligent-project.com/wp-content/uploads/identity_akvamarket_02.png"
    ]
  },
  {
    "title": "Упаковка сирів \"Feel The Cheese\"",
    "description": "Дизайн упаковки лінійки м'яких імпортних сирів ТМ \"Feel The Cheese\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-syrov-feel-the-cheese/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_feelthe_alpinebluecamembert_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка сирів ТМ \"Euro Mark\"",
    "description": "Дизайн упаковки серії нарізок європейського виробництва торгової марки \"Euro Mark\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-syrov-euro-mark/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_euromark_cheeseslises_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетки \"Душевна Настоянка\"",
    "description": "Дизайн етикеток лінійки настоянок на коньяку ТМ \"Душевна настоянка\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-dushevna-nastoyanka/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_dushevnanastoyanka_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка крем-сиру \"Das Ist!\"",
    "description": "Дизайн упаковок для серії крем-сирів ТМ \"Das Ist!\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-krem-syra-das-ist/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_dasist_softcheese_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка сирів \"Das Ist!\"",
    "description": "Дизайн серії упаковок сирів у слайсах ТМ \"Das Ist!\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-syrov-das-ist/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_dasist_cheeseslises_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетки для вина \"Almatera\"",
    "description": "Дизайн етикеток для лінійки чілійських вин ТМ \"Almatera\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-vina-almatera/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_almatera_labels_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"City Маркет\"",
    "description": "Дизайн логотипу та корпоративного стилю для інтернет-магазину з продажу продуктів харчування",
    "link": "https://intelligent-project.com/intproj-portfolio/city-market/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_citymarket_01.png",
    "imageGallery": [
      "https://intelligent-project.com/wp-content/uploads/identity_citymarket_02.png"
    ]
  },
  {
    "title": "Логотип \"Душа Пивовара\"",
    "description": "Розробка назви та логотипу для пивної торгової марки \"Душа Пивовара\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-dusha-pivovara/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_dushapivovara_01.png",
    "imageGallery": []
  },
  {
    "title": "Верстка сайту Pug It",
    "description": "Адаптивна верстка сайту компанії Pug It",
    "link": "https://intelligent-project.com/intproj-portfolio/verstka-sajta-pug-it/",
    "categories": [
      "Веб"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/web_pug_it_01.png",
    "imageGallery": [
      "https://intelligent-project.com/wp-content/uploads/web_pug_it_02.png"
    ]
  },
  {
    "title": "Верстка сайту Linux Admin",
    "description": "Адаптивна верстка сайту IT-компанії Linux Admin",
    "link": "https://intelligent-project.com/intproj-portfolio/verstka-sajta-linux-admin/",
    "categories": [
      "Веб"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/web_linux_admin_01.png",
    "imageGallery": [
      "https://intelligent-project.com/wp-content/uploads/web_linux_admin_02.png",
      "https://intelligent-project.com/wp-content/uploads/web_linux_admin_03.png"
    ]
  },
  {
    "title": "Верстка сайту Ciklum HR",
    "description": "Адаптивна верстка сайту щодо підбору співробітників IT-компанії Ciklum",
    "link": "https://intelligent-project.com/intproj-portfolio/verstka-sajta-ciklum-hr/",
    "categories": [
      "Веб"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/web_jobs_ciklum_01.png",
    "imageGallery": [
      "https://intelligent-project.com/wp-content/uploads/web_jobs_ciklum_02.png",
      "https://intelligent-project.com/wp-content/uploads/web_jobs_ciklum_03.png"
    ]
  },
  {
    "title": "Верстка сайту PHP Developers",
    "description": "Адаптивна верстка сайту PHP Developers IT-компанії Ciklum",
    "link": "https://intelligent-project.com/intproj-portfolio/verstka-sajta-php-developers/",
    "categories": [
      "Веб"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/web_ciklum_developers_01.png",
    "imageGallery": [
      "https://intelligent-project.com/wp-content/uploads/web_ciklum_developers_02.png"
    ]
  },
  {
    "title": "Верстка сайту Ciklum",
    "description": "Адаптивна верстка сайту IT-компанії Ciklum",
    "link": "https://intelligent-project.com/intproj-portfolio/verstka-sajta-ciklum/",
    "categories": [
      "Веб"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/web_ciklum_01.png",
    "imageGallery": [
      "https://intelligent-project.com/wp-content/uploads/web_ciklum_02.png",
      "https://intelligent-project.com/wp-content/uploads/web_ciklum_03.png"
    ]
  },
  {
    "title": "Логотип \"Мрія\"",
    "description": "Дизайн логотипу для лінійки соків та нектарів торгової марки \"Мрія\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-mriya/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_mriya_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Luxury Travel & Event\"",
    "description": "Варіанти дизайну логотипу для компанії з організації VIP заходів \"Luxury Travel &amp; Event\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-luxury-travel-event/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_luxury_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Ice Shock\"",
    "description": "Розробка логотипу для компанії з виробництва харчового та сухого льоду, а також крижаних скульптур для свят та корпоративів \"Ice Shock\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-ice-shock/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_iceshock_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Холодний Яр\"",
    "description": "Розробка логотипу для лінійки горілок \"Холодний Яр\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-holodnij-yar/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_holodnyyar_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Hike\"",
    "description": "Створення логотипу та слогану для торгової марки пива \"Hike\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-hike/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_hike_01.png",
    "imageGallery": []
  },
  {
    "title": "Розробка ТМ \"Feel the Cheese\"",
    "description": "Розробка назви та логотипу для торгової марки сирних продуктів \"Feel the Cheese\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-feel-the-cheese/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_feelthecheese_01.png",
    "imageGallery": []
  },
  {
    "title": "Розробка ТМ \"Euro Mark\"",
    "description": "Розробка торгової марки для продуктів харчування з Європи, включаючи назву та дизайн логотипу",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-euro-mark/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_euromark_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Таяна\"",
    "description": "Розробка логотипу для питної бутильованої води \"Таяна\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-tayana/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_tayana_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Світ М'яса\"",
    "description": "Розробка логотипу для торгової марки м'ясних продуктів ТМ \"Світ М'яса\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-svit-myasa/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_svitmyasa_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Stardent\"",
    "description": "Розробка логотипу для лінійки зубних паст торгової марки \"Stardent\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-stardent/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_stardent_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Пивоварня Радомишля\"",
    "description": "Розробка логотипу для торгової марки пива \"Пивоварня Радомишля\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-pivovarnya-radomishlya/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_prp_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Полоскун\"",
    "description": "Дизайн логотипу для серії пральних порошків \"Полоскун\" торгової марки \"Премія\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-poloskun/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_poloskun_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Пешка\"",
    "description": "Розробка логотипу для інтернет-магазину шахів \"Пешка\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-peshka/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_peshka_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Om Space Studio\"",
    "description": "Дизайн логотипу та елементів корпоративного стилю для студії медитації \"Om Space Studio\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-om-space-studio/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_omspacestudio_01.png",
    "imageGallery": [
      "https://intelligent-project.com/wp-content/uploads/identity_omspacestudio_02.png"
    ]
  },
  {
    "title": "Етикетки пива \"Hike\"",
    "description": "Дизайн етикеток лінійки пива торгової марки \"Hike\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketki-piva-hike-premium-beer/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_hike_labels_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка крем-сиру ТМ \"Feel the Cheese\"",
    "description": "Дизайн упаковки для серії крем-сирів торгової марки \"Feel the Cheese\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-krem-syra-feel-the-cheese/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_feelthe_softcheese_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка кисломолочного напою \"Feel the Active Drink\"",
    "description": "Дизайн упаковки для серії кисломолочних напоїв із фруктовим соком \"Feel the Active Drink\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-jogurta-feel-the-active-drink/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_feelthe_probiotik_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка грецького йогурту ТМ \"Feel the Yogurt\"",
    "description": "Дизайн упаковки грецького йогурту торгової марки \"Feel the Yogurt\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-grecheskogo-jogurta-feel-the-yogurt/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_feelthe_greekjogurt_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка вершкового масла ТМ \"Feel the Butter\"",
    "description": "Дизайн упаковки вершкового масла із Німеччини торгової марки \"Feel the Butter\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-slivochnogo-masla-feel-the-butter/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_feelthe_butter_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Телефабрика\"",
    "description": "Розробка логотипу для творчого об'єднання \"Телефабрика\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-telefabrika/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_telefabrika_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка печива ТМ \"Повна Чаша\"",
    "description": "Дизайн лінійки упаковок печива \"Double Cake\" торгової марки \"Повна Чаша\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovki-double-cake/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_pch_doublecake_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка \"Pasta Paolo\"",
    "description": "Дизайн лінійки упаковок макаронних виробів торгової марки \"Pasta Paolo\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovki-makaronnyh-izdelij-pasta-paolo/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_pastapaolo_pasta_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка пива \"Obolon Export\"",
    "description": "Пропозиція щодо дизайну етикетки пива торгової марки \"Obolon Export\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-piva-obolon-export/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_obolon_exportbeer_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка лінійки соків \"100% фрукти\" ТМ \"Мрія\"",
    "description": "Дизайн упаковок серії соків \"100% фрукти\" ТМ \"Мрія\", включаючи проведення фотосесії",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-sokov-mriya-100-frukti/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_mriya_juices2_02.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка лінійки соків \"Надзвичайні фрукти\" ТМ \"Мрія\"",
    "description": "Дизайн упаковок серії соків \"Надзвичайні фрукти\" ТМ \"Мрія\", включаючи проведення фотосесії",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-sokov-mriya-nadzvichajni-frukti/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_mriya_juices1_02.png",
    "imageGallery": [
      "https://intelligent-project.com/wp-content/uploads/packaging_mriya_juices1_01.png"
    ]
  },
  {
    "title": "Упаковка макаронних виробів \"Макарошки\"",
    "description": "Дизайн упаковки, включаючи створення ілюстрації для торгової марки макаронних виробів ТМ \"Макарошки\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-makaronnyh-izdelij-makaroshki/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_makaroshky_packs_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка горілки \"Холодний Яр\"",
    "description": "Розробка оригінальної упаковки, включаючи дизайн пляшки, ковпачка та етикеток для горілчаної серії торгової марки \"Холодний Яр\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-vodki-holodnij-yar/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_hy_bottleslabels_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка великоднього кексу \"Панеттоне\"",
    "description": "Дизайн упаковки великоднього кексу \"Панеттоне\" торгової марки \"Премія\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-rozhdestvenskogo-keksa-panettone-premiya/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_prm_panettone_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка філе оселедця ТМ \"Премія\"",
    "description": "Дизайн лінійки упаковок філе оселедця торгової марки \"Премія\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-file-seldi-premiya/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_prm_oseledets_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка засобів для взуття ТМ \"Премія\"",
    "description": "Дизайн упаковок засобів для догляду за взуттям торгової марки \"Премія\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-sredstv-dlya-obuvi-premiya/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_prm_kremdlyavzuttya_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка кетчупів \"Премія\"",
    "description": "Дизайн лінійки упаковок кетчупів торгової марки \"Премія\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-ketchupov-premiya/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_prm_ketchup_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип пива \"Рогань\"",
    "description": "Дизайн логотипу для торгової марки пива \"Рогань\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-rogan/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_rogan_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка \"Пшеничне Еталон\"",
    "description": "Дизайн етикеток та келиха для нефільтрованого пива торгової марки \"Пшеничне Еталон\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-piva-pshenichne-etalon/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_pe_labelglass_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка снеків ТМ \"Повна Чаша\"",
    "description": "Дизайн лінійки упаковок снеків \"Хрустики\" торгової марки \"Повна Чаша\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-snekov-hrustiki-povna-chasha/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_pch_hrustyky_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Древлянський Квас\"",
    "description": "Розробка логотипу для торгової марки \"Древлянський квас\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-drevlyanskij-kvas/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_kvas_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Кувшинка\"",
    "description": "Розробка логотипу для горілки торгової марки \"Кувшинка\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-kuvshinka/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_kuvshynka_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Kristall\"",
    "description": "Розробка логотипу для пшеничного пива торгової марки \"Kristall\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-kristall/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_kristall_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка зубной пасти \"Stardent\"",
    "description": "Дизайн лінійки упаковок зубних паст торгової марки \"Stardent\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-zubnyh-past-stardent/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_stardent_packs_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковки головоломок \"Smart Cube\"",
    "description": "Дизайн серії упаковок для головоломок ТМ Smart Cube",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovki-golovolomok-smart-cube/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_smartcube_pack_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка зубочисток \"Премія\"",
    "description": "Дизайн серії упаковок зубочисток торгової марки \"Премія\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovki-zubochistok-premiya/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_rpm_zubochistki_01.png",
    "imageGallery": []
  },
  {
    "title": "Дизайн упаковок станків для гоління ТМ \"Премія\"",
    "description": "Дизайн упаковок лінійки чоловічих та жіночих станків для гоління та змінних картриджів ТМ \"Премія\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovki-britvennyh-stankov-premiya/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_prm_stankibritvennye_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Звенигора\"",
    "description": "Розробка логотипу для лінійки сирних продуктів торгової марки \"Звенигора\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-zvenigora/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_zvenygora_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Tendita\"",
    "description": "Розробка логотипу для торгової марки сирних продуктів \"Tendita\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-tendita/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_tendita_01.png",
    "imageGallery": []
  },
  {
    "title": "Розробка ТМ \"Продартіль\"",
    "description": "Розробка назви та логотипу для торгової марки продуктів харчування \"Продартіль\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-prodartil/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_prodartil_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип пива \"Пшеничне Еталон\"",
    "description": "Розробка логотипу для нефільтрованого пшеничного пива ТМ \"Пшеничне Еталон\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-pshenichne-etalon/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_pe_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Оранжеві Соки\"",
    "description": "Розробка логотипу для лінійки фруктових соків \"Оранжеві Соки\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-oranzhevi-soki/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_os_01.png",
    "imageGallery": []
  },
  {
    "title": "Логотип \"Лісова ягода\"",
    "description": "Розробка логотипу для морсів торгової марки \"Лісова ягода\"",
    "link": "https://intelligent-project.com/intproj-portfolio/logotip-lisova-yagoda/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_mors_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка портвейнів \"Повна Чарка\"",
    "description": "Розробка дизайну упаковки для лінійки портвейнів ТМ \"Повна Чарка\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-portvejna-povna-chasha/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_pch_portwine_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка для води \"Оазис\"",
    "description": "Дизайн етикетки для бутильованої води ТМ \"Оазис\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-oazis/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_oasis_label_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка \"Древлянський Квас\"",
    "description": "Розробка етикеток для квасу торгової марки \"Древлянський Квас\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-drevlyanskij-kvas/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_kvas_label.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка для пива \"Kristall\"",
    "description": "Розробка дизайну етикетки та келиха для пшеничного пива ТМ \"Kristall\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-kristall/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_kristall_labelglass_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка пива \"Душа Пивовара\"",
    "description": "Дизайн лінійки етикеток пива ТМ \"Душа Пивовара\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketki-dusha-pivovara/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_dp_labels_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка для вода \"Айсберг\"",
    "description": "Дизайн етикетки для бутильованої води ТМ \"Айсберг\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-ajsberg/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_aisberg_label_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка для води \"Ефект 811\"",
    "description": "Дизайн етикетки для бутильованої води ТМ \"Ефект 811\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-efekt-811/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_811_label_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка для води \"Vesna\"",
    "description": "Дизайну етикетки для бутильованої води \"Vesna\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-vesna/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_vesna_label_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка сирних делікатесів \"Tendita\"",
    "description": "Дизайн упаковки для лінійки сирних делікатесів торгової марки \"Tendita\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-tvorozhnyh-delikatesov-tendita/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_tendita_delikates_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка м'яких сирів \"Tendita\"",
    "description": "Дизайн упаковки для лінійки м'яких французьких сирів Камамбер торгової марки \"Tendita\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-myagkih-syrov-tendita/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_tendita_camamber_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка для води \"Таяна\"",
    "description": "Дизайн етикетки для бутильованої води ТМ \"Таяна\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-tayana/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_tayana_label_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетки \"Самий Сік\"",
    "description": "Дизайн етикеток для лінійки фруктово-овочевих соків прямого віджиму ТМ \"Самий Сік\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketki-samyj-sik/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_samyisik_labels_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка напівсолодких вин ТМ \"Повна Чарка\"",
    "description": "Дизайну упаковок для лінійки напівсолодких вин ТМ \"Повна Чарка\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovka-polusladkih-vin-povna-chasha/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_pch_wine_01.png",
    "imageGallery": []
  },
  {
    "title": "Упаковка шампунів \"Повна Чаша\"",
    "description": "Дизайн серії упаковок шампунів та бальзамів для волосся торгової марки \"Повна Чаша\"",
    "link": "https://intelligent-project.com/intproj-portfolio/upakovki-shampunya-povna-chasha/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_pch_shampoo_01.png",
    "imageGallery": []
  },
  {
    "title": "Етикетка пива \"Янтар\"",
    "description": "Дизайн етикетки для пива торгової марки \"Янтар\"",
    "link": "https://intelligent-project.com/intproj-portfolio/etiketka-yantar/",
    "categories": [
      "Упаковка"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/packaging_yantar_label_01.png",
    "imageGallery": []
  },
  {
    "title": "Розробка ТМ \"Don Jamón\"",
    "description": "Розробка назви та логотипу для торгової марки іспанських м'ясних делікатесів",
    "link": "https://intelligent-project.com/intproj-portfolio/rozrobka-tm-don-jamon/",
    "categories": [
      "Айдентика"
    ],
    "attachment": "https://intelligent-project.com/wp-content/uploads/identity_donjamon_01-1.png",
    "imageGallery": []
  }
];

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
    throw new Error(`Missing required field: name`);
  }

  let createdMedia, createdMediaId, createdAttachment, createdAttachmentId;
  // Check for duplicates
  const existing = await PortfolioItem.findOne({ name: item.title });

  if (existing && !item.imageGallery[0]) {
    return { imported: false };
  }

  if (existing && item.imageGallery[0] && item.mainImage) {
    const mediaResponse = await createMediaFilesFromUrls(item.imageGallery[0], existing.id);
    createdMedia = mediaResponse.mediaFile;
    createdMediaId = mediaResponse.createdMediaId;

    existing.mediaFiles.push(createdMediaId);
    await existing.save();
    return { imported: true };
  }

  if (!existing && item.imageGallery[0]) {
    const mediaResponse = await createMediaFilesFromUrls(item.imageGallery[0]);
    createdMedia = mediaResponse.mediaFile;
    createdMediaId = mediaResponse.createdMediaId;
  }

  // Handle categories
  const categoryIds: string[] = [];
  if (item.categories) {
    const categoryName = item.categories[0];
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

  if (item.title.indexOf("Om Space Studio") !== -1) {
    console.log(`Found item with name "Om Space Studio" at index ${index}`);
  }

  if (item.attachment && existing) {
    const attachmentResponse = await createMediaFilesFromUrls(item.attachment, existing.id);

    createdAttachment = attachmentResponse.mediaFile;
    createdAttachmentId = attachmentResponse.createdMediaId;

    existing.mainImage = createdMediaId;
    await existing.save();
    return { imported: true };

  } else if (item.attachment && !existing) {
    const attachmentResponse = await createMediaFilesFromUrls(item.attachment);
    createdAttachment = attachmentResponse.mediaFile;
    createdAttachmentId = attachmentResponse.createdMediaId;
  }

  // Create portfolio item
  const portfolioData = {
    name: item.title,
    description: item.description || '',
    categories: categoryIds,
    mainImage: createdAttachmentId,
    mediaFiles: [],
    status: item.status || 'draft',
    importedFrom: 'console',
    metadata: {
      originalIndex: index,
      importDate: new Date(),
    },
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

  //   if (portfolioItem && item.imageGallery[0] && !createdMediaId) {
  //     const createdMedia = await createMediaFilesFromUrls(item.imageGallery[0], portfolioItem.id);
  //     createdMediaId = createdMedia.createdMediaId;

  //     await portfolioItem.up
  //   }

  return { imported: true };
}

export async function createMediaFilesFromUrls(
  imageUrls: string,
  forPortfolioItemId?: string
): Promise<{ createdMediaId: string; mediaFile: any }> {
  console.log(`🚀 Starting bulk import of ${imageUrls.length} images...`);

  const results = {
    imported: 0,
    failed: 0,
    errors: [] as string[],
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
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  console.log(`🎉 Bulk import completed:`);
  console.log(`   ✅ Imported: ${results.imported}`);
  console.log(`   ❌ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log(`\n📋 Errors:`);
    results.errors.forEach((error) => console.log(`   - ${error}`));
  }

  // return  // the last from array of create (the only for now)
  return { createdMediaId: createdMediaId, mediaFile: mediaFile };
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
    const extension = originalFilename.includes('.') ? originalFilename.split('.').pop() : 'jpg';

    const contentType = response.headers.get('content-type') || `image/${extension}`;

    // 3. Generate S3 key
    const s3Key = generateDateBasedPath(null, originalFilename);

    const s3 = new AWS.S3({
      endpoint: spacesProvider.aws.endpoint,
      accessKeyId: process.env.DIGITALOCEAN_SPACE_ACCESS_KEY!,
      secretAccessKey: process.env.DIGITALOCEAN_SPACE_SECRET_KEY!,
      region: spacesProvider.aws.region,
    });

    // 4. Upload to S3/Digital Ocean Spaces
    await s3
      .upload({
        Bucket: process.env.DIGITALOCEAN_SPACE_BUCKET!,
        Key: s3Key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read', // Make images publicly accessible
      })
      .promise();

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
        importMethod: 'url-bulk-import-when-custom-importing',
      },
    });

    await mediaFile.save();
    return mediaFile;
  } catch (error) {
    throw new Error(`Download/upload failed: ${error.message}`);
  }
}

export async function uploadFileAndCreateDbRecord(
  buffer: Buffer,
  contentType: string,
  portfolioItemId?: string,
  originalName?: string
): Promise<any> {
  const originalFilename = originalName || 'uploaded-file.png';

  const s3Key = generateDateBasedPath(null, originalFilename);

    const s3 = new AWS.S3({
      endpoint: spacesProvider.aws.endpoint,
      accessKeyId: process.env.DIGITALOCEAN_SPACE_ACCESS_KEY!,
      secretAccessKey: process.env.DIGITALOCEAN_SPACE_SECRET_KEY!,
      region: spacesProvider.aws.region,
    });

    // 4. Upload to S3/Digital Ocean Spaces
    await s3
      .upload({
        Bucket: process.env.DIGITALOCEAN_SPACE_BUCKET!,
        Key: s3Key,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read', // Make images publicly accessible
      })
      .promise();

    // 5. Create MediaFile record
    const mediaFile = new MediaFile({
      s3Key,
      bucket: process.env.DIGITALOCEAN_SPACE_BUCKET!,
      mime: contentType,
      originalName: originalFilename,
      size: buffer.length,
      portfolioItems: portfolioItemId ? [portfolioItemId] : [], // Empty initially
      metadata: {
        // sourceUrl: imageUrl,
        importedAt: new Date(),
        importMethod: 'uploadFileAndCreateDbRecord-upload',
      },
    });

    await mediaFile.save();
    return { key: mediaFile.s3Key, url: getMediaUrl(mediaFile.bucket, mediaFile.s3Key), _id: mediaFile._id };
}