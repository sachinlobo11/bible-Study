@echo off
title Bible Study LMS Dev Server
cd /d "C:\Users\Lenovo\Downloads\bible_study_lms"
start "" http://localhost:5173
npm run dev -- --host
pause
