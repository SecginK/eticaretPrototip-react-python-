from django.contrib import admin
from .models import User, Kategori, Urun, Siparis, Adres

admin.site.register(User)

admin.site.register(Kategori)

admin.site.register(Siparis)

admin.site.register(Adres)

@admin.register(Urun)
class UrunAdmin(admin.ModelAdmin):
    list_display = ('urun_ad', 'kategori', 'fiyat', 'resim')
