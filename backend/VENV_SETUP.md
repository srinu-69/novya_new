# Virtual Environment (venv) Setup Guide

This backend now uses Python virtual environment (venv) for better dependency isolation and easier deployment.

## ✅ Why Virtual Environment?

- **Isolation**: Keeps project dependencies separate from system Python
- **Reproducibility**: Ensures consistent environment across different machines
- **Deployment**: Easier to deploy with consistent dependencies
- **Clean System**: Doesn't pollute your system Python installation

## 🚀 Quick Start

### Windows

1. **Initial Setup** (run once):
   ```bash
   cd backend
   setup_windows.bat
   ```

2. **Activate Virtual Environment** (before running Django):
   ```bash
   cd backend
   call activate_venv.bat
   ```

3. **Start Server** (uses venv automatically):
   ```bash
   cd backend
   start.bat
   ```

### Linux/Mac

1. **Initial Setup** (run once):
   ```bash
   cd backend
   chmod +x setup_linux.sh  # or setup_macos.sh
   ./setup_linux.sh         # or ./setup_macos.sh
   ```

2. **Activate Virtual Environment** (before running Django):
   ```bash
   cd backend
   source activate_venv.sh
   ```

3. **Start Server**:
   ```bash
   python manage.py runserver
   ```

## 📋 Manual Commands

### Creating Virtual Environment (if needed manually)

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### Installing Dependencies

Once venv is activated:
```bash
pip install -r requirements.txt
```

### Running Django Commands

Make sure venv is activated, then:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py populate_initial_data
python manage.py runserver
```

## 🔄 Activating/Deactivating

### Windows
- **Activate**: `call activate_venv.bat` or `venv\Scripts\activate.bat`
- **Deactivate**: `deactivate` or `call deactivate_venv.bat`

### Linux/Mac
- **Activate**: `source activate_venv.sh` or `source venv/bin/activate`
- **Deactivate**: `deactivate` or `source deactivate_venv.sh`

## 📁 Project Structure

```
backend/
├── venv/              # Virtual environment (gitignored)
├── requirements.txt   # Python dependencies
├── activate_venv.bat  # Windows activation helper
├── activate_venv.sh   # Linux/Mac activation helper
├── start.bat          # Start script (auto-activates venv)
└── ...
```

## 🚢 Deployment Considerations

### For Docker
```dockerfile
FROM python:3.x
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
# ... rest of dockerfile
```

### For Cloud Platforms
Most platforms (AWS, Heroku, Railway, etc.) automatically:
- Detect `requirements.txt`
- Create virtual environment
- Install dependencies

### For Manual Deployment
1. Copy `requirements.txt` to server
2. Create venv: `python3 -m venv venv`
3. Activate: `source venv/bin/activate`
4. Install: `pip install -r requirements.txt`
5. Run Django: `python manage.py runserver` (or use gunicorn/uwsgi)

## ⚠️ Important Notes

- **Always activate venv** before running Django commands
- **venv folder is gitignored** - each developer/server creates their own
- **requirements.txt is versioned** - this ensures consistent dependencies
- **Never commit venv/** folder to git

## 🔧 Troubleshooting

### "Virtual environment not found"
- Run the appropriate setup script first: `setup_windows.bat` / `setup_linux.sh` / `setup_macos.sh`

### "Module not found" errors
- Make sure venv is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Permission errors (Linux/Mac)
- Make activation script executable: `chmod +x activate_venv.sh`

## 📝 Migration from Global Installation

If you were using global Python packages:

1. Create venv (already done by setup scripts)
2. Activate venv
3. Reinstall all packages: `pip install -r requirements.txt`
4. Your existing code should work without any changes!

---

**Note**: All existing functionality remains unchanged. Only the Python environment setup has been improved. 🎉

