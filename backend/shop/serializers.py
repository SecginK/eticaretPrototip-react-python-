from rest_framework import serializers
from .models import User, Kategori, Urun, Siparis, Adres

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class KategoriSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kategori
        fields = '__all__'

class UrunSerializer(serializers.ModelSerializer):
    resim = serializers.ImageField(use_url=True) 

    class Meta:
        model = Urun
        fields = '__all__'

class SiparisSerializer(serializers.ModelSerializer):
    urun = UrunSerializer() 

    class Meta:
        model = Siparis
        fields = '__all__'
class AdresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adres
        fields = '__all__'
