from django.contrib.auth.hashers import make_password, check_password
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Kategori, Urun, Siparis, Adres
from .serializers import UserSerializer, KategoriSerializer, UrunSerializer, SiparisSerializer, AdresSerializer

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class KategoriViewSet(ModelViewSet):
    queryset = Kategori.objects.all()
    serializer_class = KategoriSerializer

class UrunViewSet(ModelViewSet):
    queryset = Urun.objects.all()
    serializer_class = UrunSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        kategori_id = self.request.query_params.get('kategori')  
        if kategori_id:
            queryset = queryset.filter(kategori_id=kategori_id)
        return queryset

class SiparisViewSet(ModelViewSet):
    queryset = Siparis.objects.all()
    serializer_class = SiparisSerializer

class AdresViewSet(ModelViewSet):
    queryset = Adres.objects.all()
    serializer_class = AdresSerializer

@api_view(['GET'])
def get_user_cart(request, user_id):
    siparisler = Siparis.objects.filter(user_id=user_id, siparis_onay=False).select_related('urun')
    cart_data = [
        {
            "id": siparis.id,
            "urun": {
                "urun_id": siparis.urun.id,
                "urun_ad": siparis.urun.urun_ad,
                "urun_aciklama": siparis.urun.urun_aciklama,
                "fiyat": siparis.urun.fiyat,
                "resim": request.build_absolute_uri(siparis.urun.resim.url) if siparis.urun.resim else None, 
            },
            "siparis_onay": siparis.siparis_onay,
        }
        for siparis in siparisler
    ]
    return Response(cart_data, status=status.HTTP_200_OK)


@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    sifre = request.data.get('sifre')

    try:
        user = User.objects.get(email=email)
        if check_password(sifre, user.sifre):
            return Response({
                'message': 'Giriş başarılı',
                'user_id': user.id,
                'ad': user.ad,
                'soyad': user.soyad,
                'email': user.email
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Hatalı şifre'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'message': 'Kullanıcı bulunamadı'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def register_user(request):
    email = request.data.get('email')
    sifre = request.data.get('sifre')
    ad = request.data.get('ad')
    soyad = request.data.get('soyad')

    if User.objects.filter(email=email).exists():
        return Response({'message': 'Bu email adresi zaten kullanılıyor.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(
        email=email,
        sifre=make_password(sifre),  
        ad=ad,
        soyad=soyad
    )
    return Response({'message': 'Kayıt başarılı', 'user_id': user.id}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def add_to_cart(request):
    email = request.data.get('email')
    urun_id = request.data.get('urun_id')

    print(f"Gelen Veriler: {request.data}") 

    if not email or not urun_id:
        return Response({'message': 'Email veya Ürün ID eksik.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        urun = Urun.objects.get(id=urun_id)

        Siparis.objects.create(
            user=user,
            urun=urun,
            adres=None,
            siparis_onay=False
        )
        return Response({'message': 'Ürün sepete eklendi.'}, status=status.HTTP_201_CREATED)

    except User.DoesNotExist:
        return Response({'message': 'Kullanıcı bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

    except Urun.DoesNotExist:
        return Response({'message': 'Ürün bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_user_addresses(request, user_id):
    addresses = Adres.objects.filter(user_id=user_id)
    serializer = AdresSerializer(addresses, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def confirm_order(request):
    user_id = request.data.get('user_id')
    adres_id = request.data.get('adres_id')

    Siparis.objects.filter(user_id=user_id, siparis_onay=False).update(
        adres_id=adres_id,
        siparis_onay=True
    )

    return Response({'message': 'Sipariş onaylandı!'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user_confirmed_orders(request, user_id):
    try:
        siparisler = Siparis.objects.filter(user_id=user_id, siparis_onay=True).select_related('urun', 'adres')
        orders_data = [
            {
                "id": siparis.id,
                "urun": {
                    "urun_id": siparis.urun.id,
                    "urun_ad": siparis.urun.urun_ad,
                    "urun_aciklama": siparis.urun.urun_aciklama,
                    "fiyat": siparis.urun.fiyat,
                    "resim": request.build_absolute_uri(siparis.urun.resim.url) if siparis.urun.resim else None  
                },
                "adres": {
                    "adres": siparis.adres.adres,
                } if siparis.adres else None,
            }
            for siparis in siparisler
        ]
        return Response(orders_data, status=status.HTTP_200_OK)
    except Exception as e:
        print("Hata:", e)
        return Response({"message": "Siparişler getirilemedi."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['DELETE'])
def delete_order(request, siparis_id):
    try:
        siparis = Siparis.objects.get(id=siparis_id)
        siparis.delete()
        return Response({'message': 'Sipariş başarıyla silindi.'}, status=status.HTTP_200_OK)
    except Siparis.DoesNotExist:
        return Response({'message': 'Sipariş bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_user_addresses(request, user_id):
    try:
        addresses = Adres.objects.filter(user_id=user_id)
        serializer = AdresSerializer(addresses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print("Hata:", e)
        return Response({"message": "Adresler getirilemedi."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def add_user_address(request):
    try:
        user_id = request.data.get('user_id')
        adres_text = request.data.get('adres')

        if not user_id or not adres_text:
            return Response({"message": "Eksik bilgi."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(id=user_id)
        Adres.objects.create(user=user, adres=adres_text)

        return Response({"message": "Adres başarıyla eklendi."}, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"message": "Kullanıcı bulunamadı."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Hata:", e)
        return Response({"message": "Adres eklenirken bir hata oluştu."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_address(request, address_id):
    try:
        address = Adres.objects.get(id=address_id)
        address.delete()
        return Response({'message': 'Adres başarıyla silindi.'}, status=status.HTTP_200_OK)
    except Adres.DoesNotExist:
        return Response({'message': 'Adres bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)



