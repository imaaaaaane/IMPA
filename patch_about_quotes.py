import sys

with open('src/pages/About.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    (
        "2003 yılında Batman&apos;da kurulan İMPA Orman Ürünleri, mobilya ve orman ürünleri sektöründe kalite, güven ve müşteri memnuniyetini esas alan hizmet anlayışıyla faaliyetlerine başlamıştır. Yirmi yılı aşkın deneyimi boyunca istikrarlı büyümesini sürdüren şirketimiz; güçlü tedarik ağı, geniş ürün yelpazesi ve sürekli yatırım anlayışıyla sektörünün güvenilir ve saygın firmalarından biri hâline gelmiştir.",
        "{t('aboutPage.p1')}"
    ),
    (
        "2024 yılında Batman Organize Sanayi Bölgesi&apos;nde gerçekleştirdiğimiz yatırım ile İMPA MODÜLER markamızı hayata geçirerek modüler mobilya ve proje bazlı inşaat mobilyaları üretim fabrikamızı faaliyete aldık.",
        "{t('aboutPage.modularP1')}"
    ),
    (
        "2026 yılında yine Batman Organize Sanayi Bölgesi&apos;nde ikinci büyük sanayi yatırımımızı gerçekleştirerek İMPA SURFACE markasını üretim ailemize kazandırdık.",
        "{t('aboutPage.surfaceP1')}"
    ),
    (
        "İMPA SURFACE; son teknoloji üretim hatları, modern makine parkuru ve uzman teknik kadrosuyla lake kapı ve lake kapak üretiminde faaliyet göstermektedir. Yüksek kalite standartlarında gerçekleştirilen üretim süreçlerimiz sayesinde estetik görünümü, kusursuz yüzey kalitesini ve uzun ömürlü kullanım performansını bir araya getirerek Türkiye&apos;nin dört bir yanındaki müşterilerimize güvenilir çözümler sunuyoruz.",
        "{t('aboutPage.surfaceP2')}"
    ),
    (
        "Müşterilerimizin beklentilerini en üst seviyede karşılayan kaliteli ürünler üretmek, güvenilir hizmet anlayışımızdan ödün vermeden teknolojiyi yakından takip etmek ve sürekli gelişen üretim altyapımızla sektöre değer katmaktır. Her geçen gün ürün çeşitliliğimizi artırıyor, memleketimiz Batman&apos;a yatırım yapıyor, yeni istihdam alanları oluşturuyor ve ülke ekonomisine katkı sağlamaya devam ediyoruz.",
        "{t('aboutPage.missionDesc')}"
    )
]

for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
    else:
        print(f"Warning: could not find snippet:\n{old}\n")

with open('src/pages/About.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to About.jsx for quotes")
