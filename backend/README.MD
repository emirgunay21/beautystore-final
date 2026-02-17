# BeautyStore Full Stack E-Commerce Project

Bu proje Node.js, Express ve MySQL kullanılarak geliştirilmiş uçtan uca (Full-Stack) çalışan bir e-ticaret uygulamasıdır. Frontend ve Backend birbirine bağlıdır ve veri MySQL veritabanından çekilmektedir.

KURULUM:

1) MySQL kurulu olmalıdır.

2) Proje klasöründe bulunan "database.sql" dosyasını MySQL üzerinde çalıştırın. Bu işlem:
- beautystore veritabanını oluşturur
- products ve users tablolarını oluşturur

3) Terminal açın ve backend klasörüne girin:

cd backend

4) Bağımlılıkları yükleyin:

npm install

5) backend klasörünün içine ".env" isimli bir dosya oluşturun ve aşağıdaki bilgileri ekleyin:

PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=beautystore
JWT_SECRET=supersecretkey

(DB_PASSWORD kısmına kendi MySQL şifrenizi yazın.)

6) Backend’i başlatın:

npm start

veya

node src/server.js

Backend şu adreste çalışacaktır:
http://localhost:3001

7) Tarayıcıda test edin:
http://localhost:3001/products

Ürünler JSON formatında geliyorsa veritabanı bağlantısı başarılıdır.

8) Frontend’i çalıştırmak için proje ana klasöründeki Home.html dosyasını Live Server ile veya doğrudan tarayıcıda açabilirsiniz.

Frontend veriyi:
http://localhost:3001/products
adresinden çekmektedir.

Backend çalışmadan frontend veri göstermez.

Veritabanı boşsa aşağıdaki endpoint kullanılabilir:
http://localhost:3001/seed/products?category=beauty

Bu proje Backend + Database entegrasyonu içeren Full-Stack çalışan bir uygulamadır.
