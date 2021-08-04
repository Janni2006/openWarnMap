# Generated by Django 3.2.6 on 2021-08-04 16:27

import colorfield.fields
import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import users.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('api', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TokenUUID',
            fields=[
                ('uuid', models.TextField(default=users.models.generate_unique_uuid, primary_key=True, serialize=False, unique=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='auth.user')),
                ('email_confirmed', models.BooleanField(default=False)),
                ('validation_email_send', models.BooleanField(default=False)),
                ('validation_email_send_time', models.DateTimeField(blank=True, default=datetime.datetime.now)),
                ('published_count', models.IntegerField(default=0)),
                ('avatar_color', colorfield.fields.ColorField(default='#bdbdbd', max_length=18)),
                ('private_data', models.ManyToManyField(blank=True, to='api.Issue')),
            ],
        ),
    ]
