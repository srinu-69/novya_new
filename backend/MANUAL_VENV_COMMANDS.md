# Manual Virtual Environment Commands

Quick reference for manual venv setup and usage commands.

## 🚀 Windows (PowerShell/CMD)

### Initial Setup (Run Once)

```powershell
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Upgrade pip (optional but recommended)
python -m pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

### Daily Usage

```powershell
# Navigate to backend folder
cd backend

# Activate virtual environment
venv\Scripts\activate
# OR use helper script:
# call activate_venv.bat

# Run Django commands
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# When done, deactivate
deactivate
```

### Quick Start Server

```powershell
cd backend
venv\Scripts\activate
python manage.py runserver 8001
```

## 🐧 Linux/Mac (Terminal)

### Initial Setup (Run Once)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
# OR use helper script:
# source activate_venv.sh

# Upgrade pip (optional but recommended)
pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

### Daily Usage

```bash
# Navigate to backend folder
cd backend

# Activate virtual environment
source venv/bin/activate
# OR use helper script:
# source activate_venv.sh

# Run Django commands
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# When done, deactivate
deactivate
```

### Quick Start Server

```bash
cd backend
source venv/bin/activate
python manage.py runserver 8001
```

## 📋 Common Commands Reference

### Django Management Commands

```bash
# Run migrations
python manage.py migrate

# Create migrations
python manage.py makemigrations

# Create superuser
python manage.py createsuperuser

# Run server (port 8000)
python manage.py runserver

# Run server (port 8001)
python manage.py runserver 8001

# Run custom command
python manage.py populate_initial_data

# Django shell
python manage.py shell

# Check project
python manage.py check
```

### Virtual Environment Management

```bash
# Windows: Activate
venv\Scripts\activate
# OR
call activate_venv.bat

# Linux/Mac: Activate
source venv/bin/activate
# OR
source activate_venv.sh

# Deactivate (both platforms)
deactivate

# Check if venv is active
# Look for (venv) prefix in your prompt
# OR check environment:
echo $VIRTUAL_ENV  # Linux/Mac
echo %VIRTUAL_ENV%  # Windows CMD
$env:VIRTUAL_ENV   # Windows PowerShell
```

### Package Management

```bash
# Install new package
pip install package_name

# Install from requirements
pip install -r requirements.txt

# Freeze current packages
pip freeze > requirements.txt

# List installed packages
pip list

# Show package info
pip show package_name

# Uninstall package
pip uninstall package_name

# Upgrade package
pip install --upgrade package_name
```

## ⚠️ Troubleshooting

### Virtual environment not found
```bash
# Check if venv exists
# Windows:
dir venv
# Linux/Mac:
ls -la venv

# If missing, create it:
python -m venv venv  # Windows
python3 -m venv venv  # Linux/Mac
```

### Module not found errors
```bash
# Make sure venv is activated (check for (venv) in prompt)
# Reinstall dependencies:
pip install -r requirements.txt
```

### Permission errors (Linux/Mac)
```bash
# Make scripts executable:
chmod +x activate_venv.sh
chmod +x deactivate_venv.sh
```

## 🎯 Quick Workflow Example

**Windows:**
```powershell
# 1. Setup (one time)
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# 2. Daily work
cd backend
venv\Scripts\activate
python manage.py runserver 8001

# 3. When done
deactivate
```

**Linux/Mac:**
```bash
# 1. Setup (one time)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. Daily work
cd backend
source venv/bin/activate
python manage.py runserver 8001

# 3. When done
deactivate
```

---

**Tip**: Add these to your shell profile for faster access!

