# Elemes.id-Backend-Test

## Guide:
1. Cara Penginstalan
2. Menjalankan Program
3. Deploy Heroku

## 1. Cara Penginstalan
- Clone Repository ke local komputer Anda
- Setelah itu jalankan perintah ```npm install``` dengan Command Prompt/Terminal pada folder project
- Setelah semua dependencies ter install, tambahkan file .env pada root folder project
- Lalu tambahkan beberapa variable sebagai berikut:
  * ``` JWT_SECRET={{Your Own Creation Key}}```, namun ini optional, karena sudah ada defaultnya
  * ``` CLOUDINARY_CLOUD_NAME={{Your Cloudinary Cloud Name}} ```
  * ``` CLOUDINARY_API_KEY={{Your Cloudinary API KEY}} ```
  * ``` CLOUDINARY_API_SECRET={{Your Clodinary API Secret}} ```
- Variable CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET ini digunakan untuk upload gambar ke cloudinary, jika anda belum memilikinya silahkan daftar di [Cloudinary](https://cloudinary.com/)
- Terakhir pastikan [MongoDB](https://www.mongodb.com/) sudah terinstall di komputer Anda. Karena project ini menggunakan database MongoDB 

## 2. Menjalankan Program
- Masukan perintah ```npm run start-dev``` pada Command Prompt/Terminal untuk menjalankan program
- Gunakan [POSTMAN](https://www.postman.com/downloads/), atau aplikasi REST Client API sejenis lainnya
- Pertama-tama jika belum pernah melakukan seeding untuk database, buat request baru dengan API sebagai berikut:
  * ```GET localhost:5000/api/users/seed```, API ini akan generate 2 user, 1 user Admin dan 1 user biasa
    - User Admin: ```admin@gmail.com```, password ```1234```
    - User : ```john@gmail.com```, password ```1234```
  * ```GET localhost:5000/api/courses/seed```, API ini akan generate 7 course
- Secara garis besar project ini memiliki 2 API, yaitu User API dan Course API, berikut penjelasan detailnya

  ### 1. User API
     #### Register
     - Untuk membuat user baru
     - ```POST localhost:5000/api/users/register```
     - Dengan request body sebagai berikut
     ```
     {
        "name": "Billie Arianto",
        "email": "billie@gmail.com",
        "password": "1234"
     }
     ```
     - **name, email, password** bersifat required
     - Pada response body akan menghasilkan User Object dengan _id, beserta token yang berfungsi untuk Authentication menggunakan JWT
     
     #### Signin
     - Untuk login dan mendapatkan token dari user yang sudah ada
     - ```POST localhost:5000/api/users/signin```
     - Dengan request body:
     ```
     {
        "email": "admin@gmail.com",
        "password": "1234"
     }
     ```
     - **email, password** bersifat required
     - Pada response body akan menghasilkan User Object beserta dengan token, token khususnya untuk admin akan sangat diperlukan karena beberapa API akan membutuhkan Authentication sebagai admin.
     
     #### Delete User
     - Untuk menghapus User, perintah ini hanya dapat dilakukan oleh Admin
     - ```DELETE localhost:5000/api/users/{userId}```
     - Pada header request ```Authorization: bearer {token}```, dapatkan token Admin dengan Signin terlebih dahulu dengan user ```Admin@gmail.com```
     - User akan terhapus, namun User dihapus secara **Soft Delete**
     
     #### Get All Active User
     - Untuk mendapatkan semua aktif User, API ini hanya dapat dilakukan oleh Admin
     - ```GET localhost:5000/api/users/```
     - Pada header request ```Authorization: bearer {token}```, dapatkan token Admin dengan Signin terlebih dahulu dengan user ```Admin@gmail.com```
    
     #### Update User Profile
     - User dapat melakukan update name, email, dan password
     - ```PUT localhost:5000/api/users/profile```
     - Pada header request ```Authorization: bearer {token}```, dapatkan token User dengan Signin terlebih dahulu.
     - Dengan request body:
     ```
     {
        "name" : "Revine Arianto",
        "email" : "revineo@gmail.com",
        "password" : "12345"
     }
     ```
     - **name, email, password** bersifat optional, jadi bisa melakukan update hanya pada salah satu attribute
     
     #### Update User
     - Admin dapat melakukan update name, email, password, isAdmin, hanya Admin user yang dapat request API ini
     - ```PUT localhost:5000/api/users/{userId}```
     - Pada header request ```Authorization: bearer {token}```, dapatkan token Admin dengan Signin terlebih dahulu dengan user ```Admin@gmail.com```
     - Dengan request body:
     ```
     {
        "name" : "Revine Arianto",
        "email" : "revineo@gmail.com",
        "password" : "12345",
        "isAdmin" : true
     }
     ```
     - **name, email, password, isAdmin** bersifat optional, jadi bisa melakukan update hanya pada salah satu attribute
     - Update **isAdmin** menjadi **true** untuk merubah user menjadi Admin
    
  ### 2. Course API
  
     #### Create Course
     - Untuk membuat course baru, API ini hanya dapat direquest oleh Admin user.
     - ```POST localhost:5000/api/courses/```
     - Pada header request ```Authorization: bearer {token}```, dapatkan token Admin dengan Signin terlebih dahulu dengan user ```Admin@gmail.com``` atau Admin user lainnya
     - Dengan request body sebagai berikut
     ```
     {
        "name": "New Course",
        "image": "./images/p7.jpeg",
        "price": 400000,
        "category": "Example",
        "rating": 4.3,
        "numReviews": 20,
        "description": "Example Course"
     }
     ```
     - **name, category, description** bersifat required
     - **image, price, rating, numReviews** bersifat optional
     - **image** anda dapat menggunakan Path image pada local komputer anda. Nantinya image akan diupload ke akun [Cloudinary](https://cloudinary.com/) milik Anda. Atau dapat menggunakan local image pada project yang sudah disediakan:
       * ```./images/p1.jpeg```
       * ```./images/p2.png```
       * ```./images/p3.jpg```
       * ```./images/p4.jpg```
       * ```./images/p5.jpg```
       * ```./images/p6.jpeg```
       * ```./images/p7.jpeg```
     - Pada response body akan menghasilkan Course Object disertai image yang berisi URL image cloudinary yang sudah diupload, copy URL tersebut dan buka di browser untuk melihat image sudah terupload
     
     #### Update Course
     - Admin dapat melakukan update name, image, category, price, rating, numReviews, dan description, hanya Admin user yang dapat request API ini
     - ```PUT localhost:5000/api/courses/{courseId}```
     - Pada header request ```Authorization: bearer {token}```, dapatkan token Admin dengan Signin terlebih dahulu dengan user ```Admin@gmail.com``` atau Admin user lainnya
     - Dengan request body:
     ```
     {
        "name": "Update New Course",
        "image": "./images/p6.jpeg",
        "price": 500000,
        "category": "Example",
        "rating": 4.4,
        "numReviews": 30,
        "description": "Update Example Course"
     }
     ```
     - **name, image, category, price, rating, numReviews, dan description** bersifat optional, jadi bisa melakukan update hanya pada salah satu attribute
     - **image** anda dapat menggunakan Path image pada local komputer anda. Nantinya image akan diupload ke akun [Cloudinary](https://cloudinary.com/) milik Anda. Atau dapat menggunakan local image pada project yang sudah disediakan:
       * ```./images/p1.jpeg```
       * ```./images/p2.png```
       * ```./images/p3.jpg```
       * ```./images/p4.jpg```
       * ```./images/p5.jpg```
       * ```./images/p6.jpeg```
       * ```./images/p7.jpeg```
     - Pada response body akan menghasilkan Course Object yang sudah diupdate disertai image yang berisi URL image cloudinary yang sudah diupload, copy URL tersebut dan buka di browser untuk melihat image sudah terupload
    
     #### Delete Course
     - Untuk menghapus Course, perintah ini hanya dapat dilakukan oleh Admin
     - ```DELETE localhost:5000/api/courses/{courseId}```
     - Pada header request ```Authorization: bearer {token}```, dapatkan token Admin dengan Signin terlebih dahulu dengan user ```Admin@gmail.com``` atau Admin user lainnya
     
     #### Get Course
     - Untuk mendapatkan semua Course yang ada
     - ```GET localhost:5000/api/courses```
     
     #### Get Detail Course
     - Untuk mendapatkan Detail dari sebuah Course yang ada
     - ```GET localhost:5000/api/courses/{courseId}```
     
     #### Get Category Course
     - Untuk mendapatkan semua Category Course yang ada
     - ```GET localhost:5000/api/courses/categories```
     
     #### Get Popular Category Course
     - Untuk mendapatkan Top 3 Category Course berdasarkan rating
     - ```GET localhost:5000/api/courses/popular-categories```
     
     #### Search Course
     - Untuk mendapatkan Course berdasarkan paramater name, category, price, ratings, serta Sort Course based on: Lowest price, Highest price, dan Free
     - ```GET localhost:5000/api/courses/search/?name=backend```, akan menghasilkan course dengan name yang mengandung 'backend', insensitve case
     - ```GET localhost:5000/api/courses/search/?min=100000&max=500000```, akan menghasilkan course dengan range harga 100000 - 5000000
     - ```GET localhost:5000/api/courses/search/?category=Programming```, akan menghasilkan course dengan category 'Programming', sensitive case.
     - **Sort Course** ```GET localhost:5000/api/courses/search/?order=lowest```, akan menghasilkan semua course yang diurutkan berdasarkan harga terendah
     - Option untuk paramater ```order``` meliputi ```lowest```,```highest```, dan ```free```, untuk ```free``` otomatis yang tampil hanya course dengan harga 0
     - Anda juga dapat melakukan combine parameters seperti berikut: ```GET localhost:5000/api/courses/search/?min=100000&max=500000&order=lowest```, dst
     
     ### Get Simple Statistics
     - Untuk mendapatkan statistic yaitu total user, total course, dan total free course. API ini hanya bisa direquest oleh Admin user
     - ```GET localhost:5000/api/courses/simple-statistics```
     - Pada header request ```Authorization: bearer {token}```, dapatkan token Admin dengan Signin terlebih dahulu dengan user ```Admin@gmail.com``` atau Admin user lainnya
     
    
## 3. Deploy Heroku
  - Login [Heroku](https://www.heroku.com), atau Buat Akun baru jikalau belum ada
  - Pada [Dashboard](https://dashboard.heroku.com/apps), buat new App
  - Lalu kasih nama App sesuai keinginan
  - Setelah selesai dibuat, maka akan langsung diarahkan ke dashboard dari app tersebut
  - Lalu buka tab deploy dan ikuti langkah yang ada menggunakan git untuk deploy
  - Setelah berhasil dideploy
  - Pergi ke bagian tab settings, lalu tambahkan variable environment pada bagian Config Vars:
    * ```JWT_SECRET```
    * ```CLOUDINARY_CLOUD_NAME```
    * ```CLOUDINARY_API_KEY```
    * ```CLOUDINARY_API_SECRET```
    * ```MONGODB_URL```, dalam hal ini saya menggunakan [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/lp/try2?utm_content=rlsavisitor&utm_source=google&utm_campaign=gs_apac_rlsamulti_search_core_brand_atlas_desktop_rlsa&utm_term=mongo%20atlas&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=14412646476&gclid=CjwKCAjwh5qLBhALEiwAioods9iZQfz3Xn6KRDKIK9I6kjhA_nQNMyEnQl_xqCmCexU7v3N6-T00MRoCWukQAvD_BwE)
  - Setelah selesai, lakukan seeding:
    * ```GET {YOUR HEROKU APP URL}/api/users/seed```
    * ```GET {YOUR HEROKU APP URL}/api/courses/seed```
  - Aplikasi sudah dapat digunakan. Dapat lakukan seperti langkah ke 2 untuk menjalankan.
    
