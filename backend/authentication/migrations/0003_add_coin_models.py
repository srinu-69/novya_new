# Generated migration for coin/rewards models

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_add_registration_models'),
    ]

    operations = [
        migrations.CreateModel(
            name='CoinTransaction',
            fields=[
                ('transaction_id', models.AutoField(primary_key=True, serialize=False)),
                ('coins', models.IntegerField()),
                ('transaction_type', models.CharField(choices=[('earned', 'Earned'), ('spent', 'Spent')], max_length=50)),
                ('source', models.CharField(max_length=50)),
                ('reason', models.TextField(blank=True, null=True)),
                ('reference_id', models.IntegerField(blank=True, null=True)),
                ('reference_type', models.CharField(blank=True, max_length=50, null=True)),
                ('metadata', models.JSONField(blank=True, null=True)),
                ('balance_after', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('student_id', models.ForeignKey(db_column='student_id', on_delete=django.db.models.deletion.CASCADE, to='authentication.studentregistration')),
            ],
            options={
                'verbose_name': 'Coin Transaction',
                'verbose_name_plural': 'Coin Transactions',
                'db_table': 'coin_transaction',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='UserCoinBalance',
            fields=[
                ('balance_id', models.AutoField(primary_key=True, serialize=False)),
                ('total_coins', models.IntegerField(default=0)),
                ('total_earned', models.IntegerField(default=0)),
                ('total_spent', models.IntegerField(default=0)),
                ('last_transaction_at', models.DateTimeField(blank=True, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('student_id', models.OneToOneField(db_column='student_id', on_delete=django.db.models.deletion.CASCADE, to='authentication.studentregistration')),
            ],
            options={
                'verbose_name': 'User Coin Balance',
                'verbose_name_plural': 'User Coin Balances',
                'db_table': 'user_coin_balance',
            },
        ),
        migrations.AddIndex(
            model_name='cointransaction',
            index=models.Index(fields=['student_id', 'created_at'], name='coin_trans_student_id_idx'),
        ),
        migrations.AddIndex(
            model_name='cointransaction',
            index=models.Index(fields=['source'], name='coin_trans_source_idx'),
        ),
    ]

