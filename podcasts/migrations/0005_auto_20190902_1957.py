# Generated by Django 2.2.4 on 2019-09-02 17:57

import django.contrib.postgres.fields.jsonb
import django.core.serializers.json
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('podcasts', '0004_auto_20190902_1938'),
    ]

    operations = [
        migrations.AddField(
            model_name='episode',
            name='chapters',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=list, encoder=django.core.serializers.json.DjangoJSONEncoder),
        ),
        migrations.AlterField(
            model_name='episodechapter',
            name='episode',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='old_chapters', to='podcasts.Episode', verbose_name='Episode of Chapter'),
        ),
    ]
