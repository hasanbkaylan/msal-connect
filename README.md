# 🎓 MSAL Connect — Mehmet Serttaş Anadolu Lisesi Sosyal Ağı

Mehmet Serttaş Anadolu Lisesi için geliştirilmiş modern, hızlı ve açık web (ActivityPub / Mastodon Fediverse) mimarisine uygun okul sosyal medya platformu.

## ✨ Özellikler

- **🏫 Mehmet Serttaş Anadolu Lisesi Topluluğu:**
  - Öğrenciler, öğretmenler, okul kulüpleri ve okul idaresi için merkeziyetsiz dijital kampüs alanı.
  - Okul etkinlikleri, sınav takvimleri, bilim fuarları, turnuvalar ve duyurular.
- **📱 Kusursuz Mobil & Masaüstü Deneyimi:**
  - **Masaüstü:** Mastodon tarzı çoklu sütunlu arayüz (Sol Navigasyon, Gönderi Akışı, Okul Gündemi & Kulüpler Paneli).
  - **Mobil:** Akıcı alt gezinme çubuğu (Bottom Navigation Bar) ve anlık gönderi paylaşım butonu.
- **🐘 Mastodon & Fediverse Fonksiyonları:**
  - Durum güncellemesi / Gönderi paylaşımı (500 karakter desteği).
  - **İçerik Uyarısı (CW / Spoiler Warning)** desteği ve tek tıkla gizleme/gösterme.
  - **İnteraktif Okul Anketleri (Polls):** Anket oluşturma, oy kullanma, oy oranları ve konfeti animasyonu.
  - **Medya Galerisi:** Çoklu görsel yükleme, Lightbox büyütme.
  - **Zaman Tünelleri:** Ana Sayfa, MSAL Yerel Ağ, Fediverse, Keşfet, Bildirimler, Yer İmleri ve Favoriler.
  - **Profil Sayfası:** Öğrenci/kulüp profili, biyografi, ActivityPub onaylı alanlar ve takip sistemi.
- **⚡ Supabase & Güvenilir Veri Mimarisi:**
  - Hataya dayanıklı akıllı yerel depolama ve React ErrorBoundary koruması sayesinde beyaz ekran hatası yaşanmaz.
  - Ayarlar panelinden dilediğiniz zaman harici Supabase veritabanına bağlanabilir.
- **🌐 GitHub Pages Yayınına Tam Uyumlu:**
  - `base: './'` konfigürasyonu ile GitHub Pages alt dizinlerinde hatasız ve varlık yolları bozulmadan çalışır.
  - Otomatik `.github/workflows/deploy.yml` GitHub Actions yapılandırması hazırdır.

## 🛠️ Yerel Geliştirme

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# GitHub Pages için derleyin
npm run build
```
