from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    UserViewSet, KategoriViewSet, UrunViewSet, SiparisViewSet, AdresViewSet, 
    get_user_cart, login_user, register_user, add_to_cart, confirm_order, 
    get_user_confirmed_orders, get_user_addresses, add_user_address, delete_address
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'kategoriler', KategoriViewSet)
router.register(r'urunler', UrunViewSet)
router.register(r'siparisler', SiparisViewSet)
router.register(r'adresler', AdresViewSet)

urlpatterns = router.urls + [
    path('cart/<int:user_id>/', get_user_cart, name='get_user_cart'),
    path('login/', login_user, name='login_user'),
    path('register/', register_user, name='register_user'),
    path('add-to-cart/', add_to_cart, name='add_to_cart'),
    path('addresses/<int:user_id>/', get_user_addresses, name='get_user_addresses'),
    path('confirm-order/', confirm_order, name='confirm_order'),
    path('orders/<int:user_id>/', get_user_confirmed_orders, name='get_user_confirmed_orders'),
    path('add-address/', add_user_address, name='add_user_address'),
    path('delete-address/<int:address_id>/', delete_address, name='delete_address'), 
]

