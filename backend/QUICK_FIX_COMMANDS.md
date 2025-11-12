# Quick Fix Commands

## Issue
- Django not found in venv
- `psycopg2-binary==2.9.9` incompatible with Python 3.13

## Solution

Run these commands in PowerShell (make sure venv is activated):

```powershell
# 1. Make sure you're in backend folder and venv is active
cd backend
venv\Scripts\activate

# 2. Verify venv is active (should show venv path)
where python
# Should show: ...\backend\venv\Scripts\python.exe

# 3. Install all packages in venv (requirements.txt updated to use psycopg2-binary==2.9.11)
pip install -r requirements.txt

# 4. Verify Django is installed
pip show django

# 5. Run server
python manage.py runserver 8001
```

## If packages still install in system Python:

```powershell
# Force reinstall everything in venv
pip install --force-reinstall --no-deps -r requirements.txt
pip install -r requirements.txt
```

## Alternative: Install packages one by one (excluding psycopg2-binary since you already have it)

```powershell
pip install Django==4.2.7
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install djangorestframework-simplejwt==5.3.0
pip install "Pillow>=9.0.0"
pip install python-decouple==3.8
# psycopg2-binary==2.9.11 already installed
pip install django-filter==23.5
pip install django-extensions==3.2.3
pip install celery==5.3.4
pip install redis==5.0.1
pip install django-storages==1.14.2
pip install boto3==1.34.0
```

