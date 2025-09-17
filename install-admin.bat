@echo off
echo Installing Admin Panel Dependencies...
echo.

echo Installing client dependencies...
cd client
call npm install @editorjs/editorjs @editorjs/header @editorjs/list @editorjs/paragraph @editorjs/image @editorjs/quote @editorjs/code
echo.

echo Client dependencies installed successfully!
echo.

echo Starting development server...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:5000
echo Admin Panel will be available at: http://localhost:3000/admin
echo.
echo Default admin credentials:
echo Username: admin
echo Password: graphics2024
echo.

cd ..
call npm run dev

pause