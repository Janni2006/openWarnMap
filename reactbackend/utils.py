import datetime
import jwt
from django.conf import settings
from users.models import TokenUUID


def generate_access_token(user):
    access_token = jwt.encode(
        {
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=15),
            'iat': datetime.datetime.utcnow(),
        }, settings.SECRET_KEY, algorithm="HS256")
    return access_token


def generate_refresh_token(user):
    token_uuid = TokenUUID(user=user)
    token_uuid.save()
    refresh_token = jwt.encode(
        {
            'user_id': user.id,
            'uuid': token_uuid.uuid,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
            'iat': datetime.datetime.utcnow()
        }, settings.REFRESH_TOKEN_SECRET, algorithm='HS256')

    return refresh_token
