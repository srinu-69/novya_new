#!/bin/bash

echo "Setting up NOVYA LMS Project..."
echo

echo "Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt
echo

echo "Installing AI Backend Dependencies..."
cd ai_backend
pip install -r requirements.txt
cd ..
echo

echo "Installing Frontend Dependencies..."
cd ../frontend
npm install
echo

echo "Setup Complete!"
echo
echo "To start the project:"
echo "1. Backend: cd backend && python manage.py runserver"
echo "2. AI Backend: cd backend/ai_backend && python app.py"
echo "3. Frontend: cd frontend && npm start"
echo
