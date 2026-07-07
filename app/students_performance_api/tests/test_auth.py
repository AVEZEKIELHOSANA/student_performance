import requests
import json

BASE_URL = "http://localhost:8000/api/v1/auth"

print("="*50)
print("🧪 Testing Authentication API")
print("="*50)

# 1. Register
print("\n1️⃣ Testing Registration...")
register_data = {
    "username": "testuser",
    "email": "aveze96@gmail.com",
    "password": "password123",
    "role": "student"
}
response = requests.post(f"{BASE_URL}/register", json=register_data)
print(f"   Status: {response.status_code}")
if response.status_code == 201:
    print(f"   ✅ Success: {response.json()}")
else:
    print(f"   ❌ Error: {response.json()}")

# 2. Login
print("\n2️⃣ Testing Login...")
login_data = {
    "email": "aveze96@gmail.com",
    "password": "password123"
}
response = requests.post(f"{BASE_URL}/login", json=login_data)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"   ✅ Success!")
    print(f"   Token: {data['access_token'][:50]}...")
    print(f"   User: {data['user']}")
else:
    print(f"   ❌ Error: {response.json()}")

# 3. Forgot Password
print("\n3️⃣ Testing Forgot Password...")
forgot_data = {"email": "aveze96@gmail.com"}
response = requests.post(f"{BASE_URL}/forgot-password", json=forgot_data)
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")