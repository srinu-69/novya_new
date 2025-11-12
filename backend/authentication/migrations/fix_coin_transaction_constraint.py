# Generated migration to fix coin_transaction constraint
# This allows negative coin values for deductions

from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_add_coin_models'),  # Depends on the migration that created the table
    ]

    operations = [
        migrations.RunSQL(
            # Drop the existing constraint that prevents negative values
            sql="ALTER TABLE coin_transaction DROP CONSTRAINT IF EXISTS chk_coin_transaction_positive;",
            reverse_sql="ALTER TABLE coin_transaction ADD CONSTRAINT chk_coin_transaction_positive CHECK (coins > 0);"
        ),
    ]

