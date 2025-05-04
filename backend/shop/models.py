from django.db import models

class User(models.Model):
    sifre = models.CharField(max_length=255)
    ad = models.CharField(max_length=255)
    soyad = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.ad} {self.soyad} "

class Kategori(models.Model):
    kategori_ad = models.CharField(max_length=255)

    def __str__(self):
        return self.kategori_ad

class Urun(models.Model):
    urun_ad = models.CharField(max_length=255)
    urun_aciklama = models.CharField(max_length=150, null=True, blank=True)
    fiyat = models.DecimalField(max_digits=10, decimal_places=3)
    kategori = models.ForeignKey('Kategori', null=True, on_delete=models.SET_NULL)
    resim = models.ImageField(upload_to='urun_resimleri/', null=True, blank=True)  

    def __str__(self):
        return self.urun_ad

class Siparis(models.Model):
    urun = models.ForeignKey(Urun, null=True, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    adres = models.ForeignKey('Adres', null=True, on_delete=models.SET_NULL)
    siparis_onay = models.BooleanField(default=False)

class Adres(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    adres = models.CharField(max_length=255)

    def __str__(self):
        return self.adres
