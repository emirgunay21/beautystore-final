# BeautyStore E-Ticaret Projesi

## Proje Hakkında

BeautyStore, bitirme projesi kapsamında geliştirilmiş bir e-ticaret web uygulamasıdır.  
Kullanıcıların ürünleri görüntüleyebildiği, sepete ürün ekleyebildiği, ürünlere yorum yapabildiği, adres yönetimi gerçekleştirebildiği ve sipariş oluşturabildiği bir sistemdir.

Proje modern yazılım geliştirme prensiplerine uygun olacak şekilde yeniden yapılandırılmıştır.

Bu kapsamda:

- MVC mimarisi uygulanmıştır
- REST API altyapısı kurulmuştur
- Veriler veritabanı üzerinden yönetilmektedir
- Frontend modüler hale getirilmiştir
- Git ile versiyon kontrolü uygulanmıştır

---

# Kullanılan Teknolojiler

## Frontend

- HTML5  
- CSS3  
- JavaScript (ES6 Modules)

## Backend

- Node.js  
- Express.js  

## Veritabanı

- MySQL

## Kimlik Doğrulama

- JWT (JSON Web Token)

## Versiyon Kontrol

- Git  
- GitHub  

---

# Backend Mimarisi

Backend tarafında **Model-View-Controller (MVC)** mimarisi uygulanmıştır.

Proje klasör yapısı:

src  
 ├ controllers  
 ├ models  
 ├ routes  
 ├ middleware  
 ├ app.js  
 └ server.js  

### Controllers

API isteklerini karşılayan ve iş mantığını yöneten katmandır.

### Models

Veritabanı ile iletişim kuran ve SQL sorgularını yöneten katmandır.

### Routes

API endpointlerini tanımlar ve ilgili controller fonksiyonlarına yönlendirir.

### Middleware

JWT doğrulama gibi güvenlik işlemleri bu katmanda gerçekleştirilir.

---

# API Endpointleri

## Kimlik Doğrulama

POST /auth/register  
POST /auth/login  

## Ürünler

GET /products  
GET /products/:id  

## Sepet

GET /cart  
POST /cart  
PUT /cart/:productId  
DELETE /cart/:productId  

## Adresler

GET /addresses  
POST /addresses  
PUT /addresses/:id  
DELETE /addresses/:id  

## Yorumlar

GET /comments/:productId  
POST /comments  

## Siparişler

GET /orders  
POST /orders  

---

# Veritabanı Yapısı

Projede aşağıdaki temel tablolar oluşturulmuştur:

- users  
- products  
- categories  
- cart_items  
- orders  
- order_items  
- addresses  
- comments  

Tablolar arasında **Foreign Key ilişkileri** kurulmuş ve veri bütünlüğü sağlanmıştır.

---

# Projede Yapılan Geliştirmeler

Projenin ilk sürümünde veriler LocalStorage üzerinde tutulmakta ve JavaScript kodu tek bir büyük dosyada yer almaktaydı.

Aşağıdaki iyileştirmeler gerçekleştirilmiştir.

### API Tabanlı Veri Yönetimi

Sepet, yorum ve adres verileri artık LocalStorage yerine REST API aracılığıyla veritabanında saklanmaktadır.

### MVC Mimarisine Geçiş

Backend kodu aşağıdaki katmanlara ayrılmıştır:

- Controllers  
- Models  
- Routes  

### Modüler Frontend Yapısı

1700 satırlık büyük JavaScript dosyası sayfa bazlı modüllere ayrılmıştır.

js  
 ├ api.js  
 ├ cart.js  
 ├ auth.js  
 ├ navbar.js  

Pages  
 ├ home.js  
 ├ productPage.js  
 ├ productDetails.js  
 ├ cartPage.js  
 ├ step1.js  
 ├ step2.js  
 └ step3.js  

### Kimlik Doğrulama

JWT tabanlı kimlik doğrulama sistemi kullanılarak yetkisiz erişim engellenmiştir.

---

# Projeyi Çalıştırma

## 1 Projeyi Klonlama

git clone https://github.com/kullaniciadi/beautystore.git

## 2 Backend Bağımlılıklarını Kurma

cd backend  
npm install  

## 3 Ortam Değişkenleri

.env dosyası oluşturulmalıdır:

PORT=3001  
DB_HOST=localhost  
DB_USER=root  
DB_PASSWORD=şifre  
DB_NAME=beautystore  
JWT_SECRET=secret_key  

## 4 Backend Sunucusunu Başlatma

npm run dev  

## 5 Frontend'i Çalıştırma

Frontend dosyaları Live Server veya herhangi bir yerel sunucu ile çalıştırılabilir.

---

# Geliştirici

Emir Günay  

Bitirme Projesi – Full Stack Web Uygulaması