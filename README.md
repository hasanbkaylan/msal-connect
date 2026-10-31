# 🚀 MSAL Connect — Mastodon Fediverse Web Client

Modern, hızlı ve açık web (ActivityPub / Fediverse) mimarisine uygun bağımsız Mastodon klonu.

## ✨ Özellikler

- **📱 Kusursuz Mobil & Masaüstü Deneyimi:**
  - **Masaüstü:** Mastodon'un efsanevi çoklu sütunlu arayüzü (Sol Navigasyon, Gönderi Akışı, Keşfet & Gündem Sütunu).
  - **Mobil:** Akıcı alt gezinme çubuğu (Bottom Navigation Bar) ve hızlı aksiyon butonu.
- **🐘 Mastodon & Fediverse Fonksiyonları:**
  - Durum güncellemesi / Toot gönderme (500 karakter desteği).
  - **İçerik Uyarısı (CW / Spoiler Warning)** desteği ve tek tıkla gizleme/gösterme.
  - **İnteraktif Anketler (Polls):** Anket oluşturma, oy kullanma, oy oranları ve konfeti animasyonu.
  - **Medya Galerisi:** Çoklu görsel yükleme, hassas medya (NSFW) bulanıklaştırma koruması ve Lightbox büyütme.
  - **Zaman Tünelleri:** Ana Sayfa, Yerel Sunucu, Genel Fediverse, Keşfet, Bildirimler, Yer İmleri ve Favoriler.
  - **Profil Sayfası:** Kapak fotoğrafı, biyografi, ActivityPub onaylı alanlar ve takipçi sayıları.
- **⚡ Supabase Entegrasyonu:**
  - Demo verileriyle doğrudan çalışır (LocalStorage üzerinde anında reaktif durum yönetimi).
  - Ayarlar panelinden dilediğiniz zaman Supabase URL ve Anon Key girip bağlantıyı test edebilir, kendi veritabanınıza geçiş yapabilirsiniz.
- **🌐 GitHub Pages Yayınına Tam Uyumlu:**
  - `base: './'` konfigürasyonu ile GitHub Pages alt dizinlerinde (örneğin `username.github.io/repo/`) hatasız ve varlık yolları bozulmadan çalışır.
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
