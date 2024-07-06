# Kimlik Bildirim Servisi Kullanımı
Bu proje, Kimlik Bildirim Servisi ile etkileşimde bulunmak için geliştirilmiş örnekler içermektedir. Kimlik Bildirim Servisi, kullanıcıların çeşitli işlemleri gerçekleştirebilmelerini sağlayan bir SOAP tabanlı servistir.

## Kurulum
Projenin kullanımı için aşağıdaki adımları izleyin:

## Servis Ayarları

Kimlik Bildirim Servisi'ne erişim için gerekli olan bilgileri projeye entegre edin. Bu bilgiler, servis sağlayıcınız tarafından sağlanır.

**WSDL Adres** : https://vatandas.jandarma.gov.tr/KBS_Tesis_Servis/SrvShsYtkTml.svc?singleWsdl

**TSS_KOD**: Kimlik Bildirim Servisi için kullanılacak TSS (Ticari Servis Sağlayıcı) kodu.

**KULLANICI_TC**: Kimlik Bildirim Servisi'ne erişim için kullanılacak kullanıcı TC kimlik numarası.

**SIFRE**: Kimlik Bildirim Servisi'ne erişim için kullanılacak şifre.

Bu bilgiler genellikle çevresel değişkenlerden veya konfigürasyon dosyalarından alınabilir.

## Örnek Kullanımlar
Proje içinde yer alan örneklerle Kimlik Bildirim Servisi'ne nasıl erişileceği hakkında daha fazla bilgi edinin. Örnekler aşağıdaki işlemleri içermektedir:

1. **musteriYabanciListele**
Yabancı müşterilerin listesini getirir.

```
try {
    $response = (new \App\Services\KimlikBildirimService($TSSKOD, $KULLANICI_TC, $sifre))
        ->musteriYabanciListele();

    dd($response);
} catch (\SoapFault $e) {
    // Hata yönetimi burada yapılabilir
}
```

2. **musteriYabanciCikis**
Yabancı müşterinin çıkış işlemini gerçekleştirir.

```
$musteriBilgi = [
    'CKSTIP' => 'TESISTENCIKIS',
    'CKSTRH' => '2024-07-06T01:00:00',
    'BELGENO' => '123456789',
];

try {
    $response = (new \App\Services\KimlikBildirimService($TSSKOD, $KULLANICI_TC, $SIFRE))
        ->musteriYabanciCikis($musteriBilgi);

    dd($response);
} catch (\SoapFault $e) {
    // Hata yönetimi burada yapılabilir
}
```

3. **musteriYabanciGiris**
Yabancı müşterinin giriş işlemini gerçekleştirir.

```
$musteriBilgi = [
    'ADI' => 'Ahmet',
    'SOYADI' => 'Mehmet',
    'ANAADI' => 'Ayşe',
    'BABAADI' => 'Mehmet',
    'BELGENO' => '123456789',
    'CINSIYET' => 'ERKEK',
    'DOGUMTARIHI' => '1980-01-01T00:00:00',
    'GRSTRH' => '2024-07-05T12:00:00',
    'MEDENIHAL' => 'BEKAR', // EVLI, BEKAR
    'ODANO' => '101',
    'PLKNO' => '35AE5911',
    'TELNO' => '05551234567',
    'ULKKOD' => 'TURKIYE', 
];

try {
    $response = (new \App\Services\KimlikBildirimService($TSSKOD, $KULLANICI_TC, $SIFRE))
        ->musteriYabanciGiris($musteriBilgi);

    dd($response);
} catch (\SoapFault $e) {
    // Hata yönetimi burada yapılabilir
}
```

4. **musteriKimlikNoCikis**
Belirtilen kimlik numarasına sahip müşterinin çıkış işlemini gerçekleştirir.

```
$musteriBilgi = [
    'CKSTIP' => 'TESISTENCIKIS',
    'CKSTRH' => '2024-07-06T00:00:00',
    'KIMLIKNO' => '34345876112',
];

try {
    $response = (new \App\Services\KimlikBildirimService($TSSKOD, $KULLANICI_TC, $SIFRE))
        ->musteriKimlikNoCikis($musteriBilgi);

    dd($response);
} catch (\SoapFault $e) {
    // Hata yönetimi burada yapılabilir
}
```

5. **parametreListele**
Belirtilen parametre bilgisini listeler.

```
$parametreBilgi = [
    'PARAMETRE' => 'CINSIYET', // TANIMSIZ, ULKELER, CINSIYET, MEDENIHAL, KULLANICIYETKITIPLERI, SAHISTIPI, PERSONELCIKISTURU, KONAKLAYANCIKISTURU, MADDE7KAPSAMINDACIKISTURU, BILDIRIMZORUNLULUGUTURU, KONAKLAYANKULLANIMSEKLI
];

try {
    $response = (new \App\Services\KimlikBildirimService($TSSKOD, $KULLANICI_TC, $SIFRE))
        ->parametreListele($parametreBilgi);

    dd($response);
} catch (\SoapFault $e) {
    // Hata yönetimi burada yapılabilir
}
```

6. **musteriKimlikNoGiris**
Belirtilen kimlik numarasına sahip müşterinin giriş işlemini gerçekleştirir.

```
$musteriBilgi = [
    'GRSTRH' => '2024-07-05T12:00:00',
    'KIMLIKNO' => '12345678910',
    'KULLANIMSEKLI' => 'KONAKLAMA',
    'ODANO' => '101',
    'PLKNO' => '35XX1234',
    'ADI' => 'AHMET',
    'SOYADI' => 'MEHMET',
    'TELNO' => '05551234567',
    'ULKKOD' => 'TURKIYE',
];

try {
    $response = (new \App\Services\KimlikBildirimService($TSSKOD, $KULLANICI_TC, $SIFRE))
        ->musteriKimlikNoGiris($musteriBilgi);

    dd($response);
} catch (\SoapFault $e) {
    // Hata yönetimi burada yapılabilir
}
```
**Not:** Örneklerde yer alan parametreler ve değerleri, Kimlik Bildirim Servisi'ne göre değişiklik gösterebilir. Bu nedenle, servis belgelerine göz atarak doğru parametreleri ve değerlerini kullanmaya özen gösterin.

## Hata Yönetimi
Servis çağrıları sırasında olası hata durumlarına karşı try-catch blokları kullanın ve uygun şekilde yönetim yapın.

## Lisans
Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için LICENSE dosyasını inceleyin.