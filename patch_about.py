import sys

with open('src/pages/About.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ("import React, { useEffect } from 'react';", "import React, { useEffect } from 'react';\nimport { useTranslation } from 'react-i18next';"),
    ("export default function About() {", "export default function About() {\n  const { t } = useTranslation();"),
    ("KURUMSAL TANITIM | İMPA ORMAN ÜRÜNLERİ", "{t('aboutPage.badge')}"),
    ("Güvenle Büyüyen, Kaliteyle Üreten.", "{t('aboutPage.title')}"),
    (
        "2003 yılında Batman'da kurulan İMPA Orman Ürünleri, mobilya ve orman ürünleri sektöründe kalite, güven ve müşteri memnuniyetini esas alan hizmet anlayışıyla faaliyetlerine başlamıştır. Yirmi yılı aşkın deneyimi boyunca istikrarlı büyümesini sürdüren şirketimiz; güçlü tedarik ağı, geniş ürün yelpazesi ve sürekli yatırım anlayışıyla sektörünün güvenilir ve saygın firmalarından biri hâline gelmiştir.",
        "{t('aboutPage.p1')}"
    ),
    (
        "Kuruluşumuzdan bu yana yalnızca ticaret yapmayı değil, bölgemize değer katmayı, istihdam oluşturmayı ve üretim gücümüzü sürekli geliştirmeyi temel hedef olarak benimsedik. Bugün İMPA Orman Ürünleri, hem ticaret hem de üretim alanında faaliyet gösteren entegre bir yapı olarak müşterilerine kapsamlı çözümler sunmaktadır.",
        "{t('aboutPage.p2')}"
    ),
    (
        "Faaliyet Alanlarımız",
        "{t('aboutPage.activitiesTitle')}"
    ),
    (
        "İMPA Orman Ürünleri olarak; ürün çeşitliliğimiz, güçlü stok kapasitemiz ve hızlı tedarik ağımız sayesinde bireysel müşterilerden büyük ölçekli projelere kadar her ihtiyaca profesyonel çözümler sunuyoruz.",
        "{t('aboutPage.activitiesDesc')}"
    ),
    (
        "ÜRETİM GÜCÜMÜZ",
        "{t('aboutPage.productionPowerBadge')}"
    ),
    (
        "İMPA MODÜLER",
        "{t('aboutPage.modularTitle')}"
    ),
    (
        "2024 yılında Batman Organize Sanayi Bölgesi'nde gerçekleştirdiğimiz yatırım ile İMPA MODÜLER markamızı hayata geçirerek modüler mobilya ve proje bazlı inşaat mobilyaları üretim fabrikamızı faaliyete aldık.",
        "{t('aboutPage.modularP1')}"
    ),
    (
        "Modern üretim teknolojileriyle donatılmış tesisimizde; toplu konut projeleri, kamu kurumları, eğitim yapıları, sağlık tesisleri, oteller, ofisler ve özel yaşam alanlarına yönelik yüksek kalite standartlarında üretim gerçekleştiriyoruz. Her projeye özel çözümler geliştiren üretim anlayışımızla estetik, fonksiyonellik ve dayanıklılığı bir araya getirerek müşterilerimizin beklentilerinin ötesinde ürünler sunuyoruz.",
        "{t('aboutPage.modularP2')}"
    ),
    (
        "İMPA SURFACE",
        "{t('aboutPage.surfaceTitle')}"
    ),
    (
        "2026 yılında yine Batman Organize Sanayi Bölgesi'nde ikinci büyük sanayi yatırımımızı gerçekleştirerek İMPA SURFACE markasını üretim ailemize kazandırdık.",
        "{t('aboutPage.surfaceP1')}"
    ),
    (
        "İMPA SURFACE; son teknoloji üretim hatları, modern makine parkuru ve uzman teknik kadrosuyla lake kapı ve lake kapak üretiminde faaliyet göstermektedir. Yüksek kalite standartlarında gerçekleştirilen üretim süreçlerimiz sayesinde estetik görünümü, kusursuz yüzey kalitesini ve uzun ömürlü kullanım performansını bir araya getirerek Türkiye'nin dört bir yanındaki müşterilerimize güvenilir çözümler sunuyoruz.",
        "{t('aboutPage.surfaceP2')}"
    ),
    (
        "&quot;Yüzeyde Mükemmellik, Üretimde Güven.&quot;",
        "{t('aboutPage.surfaceQuote')}"
    ),
    (
        "NEDEN İMPA?",
        "{t('aboutPage.whyTitle')}"
    ),
    (
        '[\n              "Geniş ürün çeşitliliği",\n              "Güçlü stok ve tedarik ağı",\n              "Hızlı teslimat anlayışı",\n              "Kaliteli üretim",\n              "Güvenilir ticaret ilkesi",\n              "Deneyimli uzman kadro",\n              "Modern üretim teknolojileri",\n              "Müşteri memnuniyeti odaklı hizmet anlayışı"\n            ]',
        "[\n              t('aboutPage.whyItem1'),\n              t('aboutPage.whyItem2'),\n              t('aboutPage.whyItem3'),\n              t('aboutPage.whyItem4'),\n              t('aboutPage.whyItem5'),\n              t('aboutPage.whyItem6'),\n              t('aboutPage.whyItem7'),\n              t('aboutPage.whyItem8')\n            ]"
    ),
    (
        "&quot;Bu değerler sayesinde yıllardır müşterilerimizle uzun soluklu iş ortaklıkları kuruyor ve her geçen gün büyüyen bir marka olmanın gururunu yaşıyoruz.&quot;",
        "{t('aboutPage.whyQuote')}"
    ),
    (
        "Vizyonumuz",
        "{t('aboutPage.visionTitle')}"
    ),
    (
        "Sektörümüzde kalite, güven ve yenilik denildiğinde ilk akla gelen markalardan biri olmak; üretim kapasitemizi ve ürün çeşitliliğimizi sürekli geliştirerek ülkemize değer katan, ulusal ve uluslararası pazarda tercih edilen güçlü bir üretici ve tedarikçi konumuna ulaşmaktır.",
        "{t('aboutPage.visionDesc')}"
    ),
    (
        "Misyonumuz",
        "{t('aboutPage.missionTitle')}"
    ),
    (
        "Müşterilerimizin beklentilerini en üst seviyede karşılayan kaliteli ürünler üretmek, güvenilir hizmet anlayışımızdan ödün vermeden teknolojiyi yakından takip etmek ve sürekli gelişen üretim altyapımızla sektöre değer katmaktır. Her geçen gün ürün çeşitliliğimizi artırıyor, memleketimiz Batman'a yatırım yapıyor, yeni istihdam alanları oluşturuyor ve ülke ekonomisine katkı sağlamaya devam ediyoruz.",
        "{t('aboutPage.missionDesc')}"
    ),
    (
        "Batman, Türkiye — © 2003–2026 İMPA Holding A.Ş.",
        "{t('footerText')}"
    )
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
    else:
        print(f"Warning: could not find snippet:\n{old}\n")

with open('src/pages/About.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to About.jsx")
