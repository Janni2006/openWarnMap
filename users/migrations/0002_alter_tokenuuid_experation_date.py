# Generated by Django 3.2.6 on 2021-08-21 20:55

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tokenuuid',
            name='experation_date',
            field=models.DateTimeField(default=datetime.datetime(2021, 8, 28, 20, 55, 26, 152661, tzinfo=utc)),
        ),
    ]
