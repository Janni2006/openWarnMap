# Generated by Django 3.2.6 on 2021-08-04 16:57

import django.contrib.gis.db.models.fields
import django.contrib.gis.geos.point
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_issue_position'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='issue',
            name='position',
        ),
        migrations.AddField(
            model_name='issue',
            name='gps',
            field=django.contrib.gis.db.models.fields.PointField(blank=True, default=django.contrib.gis.geos.point.Point(0, 0), srid=4326),
        ),
    ]
