# -*- coding: utf-8 -*-
"""
dashboard.py - COMPLETE FIXED VERSION
Beautiful UI with animations, lazy loading, and error handling
"""

import streamlit as st
import requests
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib
import io
import os
from datetime import datetime
import time

matplotlib.use("Agg")

# ── Page Config ───────────────────────────────────────────────
st.set_page_config(
    page_title="🎓 Student Performance Predictor | UB FET",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ── API Configuration ─────────────────────────────────────────
API = "http://localhost:8000/api/v1"

# ── Custom CSS with Animations ────────────────────────────────
st.markdown("""
<style>
    /* ── Animations ── */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    /* ── Loading shimmer effect ── */
    .shimmer {
        background: linear-gradient(90deg, #f0f4ff 25%, #e8edf5 50%, #f0f4ff 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 8px;
    }
    
    /* ── Main container ── */
    .main {
        animation: fadeIn 0.5s ease-out;
    }
    
    /* ── Header ── */
    .header-banner {
        background: linear-gradient(135deg, #1a2a6c, #2d4373, #1a2a6c);
        background-size: 200% 200%;
        animation: gradientMove 4s ease infinite;
        padding: 32px 40px;
        border-radius: 20px;
        color: white;
        text-align: center;
        margin-bottom: 28px;
        box-shadow: 0 8px 32px rgba(26, 42, 108, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.3s ease;
    }
    .header-banner:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(26, 42, 108, 0.45);
    }
    @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    .header-banner h1 {
        font-size: 30px;
        margin: 0 0 4px 0;
        font-weight: 700;
        letter-spacing: 1px;
        animation: slideIn 0.6s ease-out;
    }
    .header-banner h3 {
        font-size: 14px;
        margin: 0;
        font-weight: 400;
        opacity: 0.85;
    }
    .header-banner .subtitle {
        font-size: 13px;
        opacity: 0.75;
        margin-top: 8px;
        animation: slideIn 0.8s ease-out;
    }
    
    /* ── Cards ── */
    .card {
        background: white;
        border-radius: 16px;
        padding: 24px 28px;
        margin-bottom: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(0, 0, 0, 0.04);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: fadeIn 0.6s ease-out;
    }
    .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.10);
        border-color: rgba(26, 42, 108, 0.15);
    }
    .card h4 {
        color: #1a2a6c;
        font-size: 16px;
        margin: 0 0 16px 0;
        padding-bottom: 10px;
        border-bottom: 2px solid #1a2a6c;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    /* ── Metric boxes ── */
    .metric-box {
        background: white;
        border-radius: 14px;
        padding: 22px 18px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(0, 0, 0, 0.04);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        height: 100%;
        animation: fadeIn 0.7s ease-out;
    }
    .metric-box:hover {
        transform: translateY(-4px) scale(1.01);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.10);
    }
    .metric-box .val {
        font-size: 30px;
        font-weight: 700;
        color: #1a2a6c;
        line-height: 1.2;
        transition: all 0.3s ease;
    }
    .metric-box .lbl {
        font-size: 12px;
        color: #666;
        margin-top: 6px;
        font-weight: 500;
    }
    
    /* ── Grade colours ── */
    .grade-a { color: #27ae60; }
    .grade-b { color: #2980b9; }
    .grade-c { color: #f39c12; }
    .grade-d { color: #e67e22; }
    .grade-fail { color: #e74c3c; }
    
    /* ── Advice items ── */
    .advice-item {
        background: linear-gradient(135deg, #f0f4ff, #f8faff);
        border-left: 4px solid #1a2a6c;
        padding: 14px 18px;
        border-radius: 8px;
        margin-bottom: 10px;
        font-size: 13.5px;
        line-height: 1.7;
        color: #1a1a2e;
        transition: all 0.3s ease;
        animation: slideIn 0.5s ease-out;
    }
    .advice-item:hover {
        transform: translateX(4px);
        box-shadow: 0 2px 12px rgba(26, 42, 108, 0.08);
    }
    
    /* ── Login card ── */
    .login-card {
        max-width: 440px;
        margin: 40px auto;
        background: white;
        border-radius: 24px;
        padding: 48px 44px;
        box-shadow: 0 8px 60px rgba(0, 0, 0, 0.12);
        border: 1px solid rgba(0, 0, 0, 0.04);
        animation: fadeIn 0.6s ease-out;
        transition: all 0.3s ease;
    }
    .login-card:hover {
        box-shadow: 0 12px 80px rgba(0, 0, 0, 0.15);
    }
    .login-card h1 {
        color: #1a2a6c;
        text-align: center;
        font-size: 24px;
        margin-bottom: 4px;
    }
    .login-card .sub {
        text-align: center;
        color: #666;
        font-size: 13px;
        margin-bottom: 28px;
    }
    
    /* ── Buttons ── */
    .stButton > button {
        background: linear-gradient(135deg, #1a2a6c, #2d4373) !important;
        color: white !important;
        font-weight: 600 !important;
        font-size: 15px !important;
        border-radius: 12px !important;
        padding: 12px 24px !important;
        border: none !important;
        width: 100% !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 4px 16px rgba(26, 42, 108, 0.25) !important;
    }
    .stButton > button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 32px rgba(26, 42, 108, 0.35) !important;
        background: linear-gradient(135deg, #2d4373, #1a2a6c) !important;
    }
    .stButton > button:active {
        transform: scale(0.98) !important;
    }
    
    /* ── Inputs ── */
    .stTextInput > div > div > input {
        border-radius: 10px !important;
        border: 1px solid #e0e0e0 !important;
        transition: all 0.3s ease !important;
    }
    .stTextInput > div > div > input:focus {
        border-color: #1a2a6c !important;
        box-shadow: 0 0 0 3px rgba(26, 42, 108, 0.1) !important;
    }
    
    /* ── Role badge ── */
    .role-badge {
        display: inline-block;
        padding: 2px 14px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        color: white;
        margin-left: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        animation: pulse 2s infinite;
    }
    .badge-student { background: #2980b9; }
    .badge-instructor { background: #27ae60; }
    .badge-admin { background: #e74c3c; }
    
    /* ── Footer ── */
    .footer {
        text-align: center;
        color: #aaa;
        font-size: 11px;
        padding: 24px 0 8px 0;
        border-top: 1px solid rgba(0, 0, 0, 0.05);
        margin-top: 40px;
        animation: fadeIn 1s ease-out;
    }
    
    /* ── Tabs ── */
    .stTabs [data-baseweb="tab-list"] {
        gap: 4px;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 10px 10px 0 0 !important;
        padding: 10px 24px !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        transition: all 0.3s ease !important;
    }
    .stTabs [data-baseweb="tab"]:hover {
        background: rgba(26, 42, 108, 0.05) !important;
    }
    .stTabs [aria-selected="true"] {
        background: #1a2a6c !important;
        color: white !important;
    }
    
    /* ── History rows ── */
    .history-row {
        background: white;
        border-radius: 10px;
        padding: 14px 18px;
        margin-bottom: 8px;
        border: 1px solid rgba(0, 0, 0, 0.05);
        font-size: 13px;
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        animation: slideIn 0.4s ease-out;
    }
    .history-row:hover {
        background: #f8faff;
        transform: translateX(4px);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }
    
    /* ── Spinner ── */
    .stSpinner > div {
        border-color: #1a2a6c !important;
        border-width: 3px !important;
        animation: spin 0.8s linear infinite !important;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* ── Success/Error/Warning ── */
    .stAlert {
        border-radius: 12px !important;
        border-left: 4px solid !important;
        animation: slideIn 0.3s ease-out !important;
    }
    
    /* ── Sidebar ── */
    .css-1d391kg, .css-163i3sr {
        background: #f0f4ff !important;
    }
    
    /* ── Selectbox ── */
    .stSelectbox > div > div {
        border-radius: 10px !important;
    }
</style>
""", unsafe_allow_html=True)

# ── Session State ─────────────────────────────────────────────
def init_session():
    defaults = {
        "token": None,
        "role": None,
        "username": None,
        "page": "login",
        "loading": False
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v

init_session()

# ── API Helpers with Error Handling ──────────────────────────
def api_post(endpoint, payload, auth=True):
    headers = {}
    if auth and st.session_state.token:
        headers["Authorization"] = f"Bearer {st.session_state.token}"
    
    try:
        with st.spinner("⏳ Processing request..."):
            r = requests.post(f"{API}{endpoint}", json=payload, headers=headers, timeout=15)
        return r
    except requests.exceptions.ConnectionError:
        st.error("❌ Cannot connect to server. Please ensure the FastAPI server is running on port 8000.")
        return None
    except requests.exceptions.Timeout:
        st.error("⏰ Request timed out. Please try again.")
        return None
    except Exception as e:
        st.error(f"❌ Unexpected error: {str(e)}")
        return None

def api_get(endpoint):
    headers = {}
    if st.session_state.token:
        headers["Authorization"] = f"Bearer {st.session_state.token}"
    
    try:
        with st.spinner("⏳ Loading data..."):
            r = requests.get(f"{API}{endpoint}", headers=headers, timeout=10)
        return r
    except requests.exceptions.ConnectionError:
        st.error("❌ Cannot connect to server.")
        return None
    except Exception as e:
        st.error(f"❌ Error: {str(e)}")
        return None

def check_api_health():
    try:
        r = requests.get(f"{API}/health", timeout=3)
        return r.status_code == 200
    except:
        return False

# ── Grade Config ──────────────────────────────────────────────
GRADE_COLOURS = {
    "A": "#27ae60",
    "B": "#2980b9",
    "C": "#f39c12",
    "D": "#e67e22",
    "Fail": "#e74c3c"
}

GPA_RANGES = {
    "A": "3.50 – 4.00",
    "B": "3.00 – 3.49",
    "C": "2.50 – 2.99",
    "D": "2.00 – 2.49",
    "Fail": "Below 2.00"
}

STATUS_MAP = {
    "A": "🎉 Excellent Performance",
    "B": "✅ Good Performance",
    "C": "📊 Average Performance",
    "D": "⚠️ Below Average — At Risk",
    "Fail": "🚨 Fail — Immediate Action Required"
}

# ── Login / Register Page ─────────────────────────────────────
def page_login():
    st.markdown("""
    <div style="text-align:center;margin-bottom:20px;animation:fadeIn 0.6s ease-out;">
        <h1 style="color:#1a2a6c;font-size:34px;font-weight:700;">🎓 Student Performance Predictor</h1>
        <p style="color:#666;font-size:15px;">University of Buea — Faculty of Engineering and Technology</p>
        <p style="color:#888;font-size:13px;">Final Year Project 2025/2026</p>
    </div>
    """, unsafe_allow_html=True)

    # Check API health
    if not check_api_health():
        st.warning("⚠️ API server not responding. Please start the FastAPI server first.")
        st.code("uvicorn app.main:app --reload --port 8000", language="bash")
        return

    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown('<div class="login-card">', unsafe_allow_html=True)
        
        tab1, tab2 = st.tabs(["🔐 Sign In", "📝 Create Account"])
        
        with tab1:
            with st.form("login_form"):
                st.markdown("#### Welcome Back")
                username = st.text_input("Username", placeholder="Enter your username")
                password = st.text_input("Password", type="password", placeholder="Enter your password")
                submit = st.form_submit_button("🔐 Sign In", use_container_width=True)
                
                if submit:
                    if not username or not password:
                        st.error("⚠️ Please enter both username and password.")
                    else:
                        try:
                            r = requests.post(
                                f"{API}/auth/login",
                                data={"username": username, "password": password},
                                timeout=10
                            )
                            if r.status_code == 200:
                                d = r.json()
                                st.session_state.token = d["access_token"]
                                st.session_state.role = d["role"]
                                st.session_state.username = d["username"]
                                st.session_state.page = "dashboard"
                                st.success(f"✅ Welcome back, {d['username']}!")
                                time.sleep(0.5)
                                st.rerun()
                            elif r.status_code == 401:
                                st.error("❌ Invalid username or password. Please try again.")
                            else:
                                error = r.json().get("detail", "Login failed.")
                                st.error(f"❌ {error}")
                        except requests.exceptions.ConnectionError:
                            st.error("❌ Cannot connect to server.")
        
        with tab2:
            with st.form("register_form"):
                st.markdown("#### Create Your Account")
                new_username = st.text_input("Username", placeholder="Choose a username", key="reg_user")
                new_email = st.text_input("Email", placeholder="your@email.com", key="reg_email")
                new_password = st.text_input("Password", type="password", placeholder="Min 6 characters", key="reg_pass")
                new_role = st.selectbox("Account Type", options=["student", "instructor", "admin"], key="reg_role")
                reg_submit = st.form_submit_button("📝 Create Account", use_container_width=True)
                
                if reg_submit:
                    if not all([new_username, new_email, new_password]):
                        st.error("⚠️ All fields are required.")
                    elif len(new_password) < 6:
                        st.error("⚠️ Password must be at least 6 characters.")
                    else:
                        try:
                            r = requests.post(
                                f"{API}/auth/register",
                                json={
                                    "username": new_username,
                                    "email": new_email,
                                    "password": new_password,
                                    "role": new_role
                                },
                                timeout=10
                            )
                            if r.status_code == 201:
                                st.success("✅ Account created successfully! You can now sign in.")
                                st.balloons()
                                st.info("💡 Use your username and password to sign in above.")
                            else:
                                error = r.json().get("detail", "Registration failed.")
                                st.error(f"❌ {error}")
                        except requests.exceptions.ConnectionError:
                            st.error("❌ Cannot connect to server.")
                        except Exception as e:
                            st.error(f"❌ Error: {str(e)}")
        
        st.markdown('</div>', unsafe_allow_html=True)

# ── Header ────────────────────────────────────────────────────
def show_header():
    role = st.session_state.role or ""
    badge_class = f"badge-{role}"
    st.markdown(f"""
    <div class="header-banner">
        <h1>🎓 Student Performance Prediction System</h1>
        <h3>University of Buea — Faculty of Engineering and Technology</h3>
        <div class="subtitle">
            👤 Logged in as <strong>{st.session_state.username}</strong>
            <span class="role-badge {badge_class}">{role.upper()}</span>
        </div>
    </div>
    """, unsafe_allow_html=True)

# ── Result Display ────────────────────────────────────────────
def display_result(data):
    grade = data["predicted_grade"]
    colour = GRADE_COLOURS.get(grade, "#1a2a6c")
    
    st.markdown("---")
    st.markdown("## 📊 Prediction Results")
    
    # Metrics Row
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown(f"""
        <div class="metric-box">
            <div class="val" style="color:{colour}">{data['predicted_gpa_range']}</div>
            <div class="lbl">Predicted GPA Range</div>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        status_text = data['academic_status']
        st.markdown(f"""
        <div class="metric-box">
            <div class="val" style="color:{colour};font-size:20px">{status_text}</div>
            <div class="lbl">Academic Status</div>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
        <div class="metric-box">
            <div class="val">{data['top_probability']}%</div>
            <div class="lbl">Probability of this outcome</div>
        </div>
        """, unsafe_allow_html=True)

    # Probability Chart
    st.markdown("### 📈 Probability Breakdown")
    probs = data["all_probabilities"]
    labels = list(probs.keys())
    values = list(probs.values())
    clrs = [GRADE_COLOURS.get(g, "#888") for g in labels]
    gpa_labels = [GPA_RANGES.get(g, g) for g in labels]

    fig, ax = plt.subplots(figsize=(10, 3.5))
    bars = ax.barh(gpa_labels, values, color=clrs, height=0.5, edgecolor="white")
    for bar, v in zip(bars, values):
        ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
                f"{v}%", va="center", fontsize=11, fontweight="bold")
    ax.set_xlabel("Probability (%)", fontsize=11)
    ax.set_xlim(0, 105)
    ax.set_title("Probability of Each Academic Outcome", fontsize=13, fontweight="bold")
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    plt.tight_layout()
    st.pyplot(fig)
    plt.close()

    # Recommendations
    st.markdown("### 💡 Personalised Recommendations")
    for i, tip in enumerate(data["recommendations"], 1):
        st.markdown(f'<div class="advice-item"><strong>{i}.</strong> {tip}</div>', unsafe_allow_html=True)

# ── Student Dashboard ─────────────────────────────────────────
def page_student():
    show_header()
    
    tab1, tab2, tab3 = st.tabs([
        "🎯 Predict My Performance",
        "🔬 What-If Simulator",
        "📋 My History"
    ])
    
    # Tab 1: Prediction
    with tab1:
        st.markdown("""
        <div class="card">
            <h4>📝 Enter Your Details</h4>
            <p style="color:#666;font-size:13px;">Fill in your academic and lifestyle information below. The system will predict your likely GPA range.</p>
        </div>
        """, unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        with col1:
            hours = st.slider("📚 Daily Study Hours", 0.0, 12.0, 4.0, 0.5)
            attendance = st.slider("📊 Class Attendance (%)", 0.0, 100.0, 75.0, 1.0)
            gpa = st.slider("📈 Previous GPA (0-4)", 0.0, 4.0, 2.5, 0.01)
            tutoring = st.selectbox("👨‍🏫 Extra Study Sessions/Week", [0, 1, 2, 3, 4, 5])
            
        with col2:
            sleep = st.slider("😴 Sleep Hours/Night", 3.0, 10.0, 7.0, 0.5)
            stress = st.slider("😰 Stress Level (1-10)", 1.0, 10.0, 5.0, 0.5)
            anxiety = st.slider("📝 Exam Anxiety (1-10)", 1.0, 10.0, 5.0, 0.5)
            motivation = st.slider("💪 Motivation Level (1-5)", 1.0, 5.0, 3.0, 0.5)
        
        if st.button("🔮 Generate Prediction", use_container_width=True):
            payload = {
                "hours_studied": hours,
                "attendance": attendance,
                "sleep_hours": sleep,
                "stress_level": stress,
                "screen_time": 3.0,
                "previous_gpa": gpa,
                "part_time_job": 0,
                "diet_quality": 1,
                "internet_quality": 2,
                "extracurricular": 0,
                "tutoring_sessions": tutoring,
                "family_income_level": 1,
                "exam_anxiety": anxiety,
                "electricity_availability": 0.5,
                "internet_accessibility": 1,
                "peer_influence": 1,
                "community_beliefs": 3.0,
                "family_support": 3.0,
                "home_study_environment": 3.0,
                "motivation_level": motivation,
                "lecture_quality": 3.0,
                "physical_health": 3.0,
                "psychological_state": 3.0,
                "gender_female": 1,
                "gender_male": 0,
                "gender_nonbinary": 0,
                "study_method_hybrid": 0,
                "study_method_offline": 1,
                "study_method_online": 0
            }
            
            r = api_post("/predict", payload)
            
            if r and r.status_code == 200:
                data = r.json()
                display_result(data)
                
                st.markdown("---")
                st.markdown("### 📤 Export Results")
                col1, col2 = st.columns(2)
                with col1:
                    df = pd.DataFrame([{
                        "GPA Range": data["predicted_gpa_range"],
                        "Status": data["academic_status"],
                        "Probability": f"{data['top_probability']}%"
                    }])
                    st.download_button(
                        "📊 Download CSV",
                        data=df.to_csv(index=False).encode("utf-8"),
                        file_name=f"prediction_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                        mime="text/csv"
                    )
            elif r:
                st.error(f"❌ {r.json().get('detail', 'Prediction failed.')}")
    
    # Tab 2: What-If
    with tab2:
        st.markdown("""
        <div class="card">
            <h4>🔬 What-If Simulator</h4>
            <p style="color:#666;font-size:13px;">
                Adjust the sliders below to see how changing your habits affects your predicted performance.
                Results are shown instantly but are <strong>not saved</strong> to your history.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        with col1:
            wi_hours = st.slider("📚 Study Hours", 0.0, 12.0, 4.0, 0.5, key="wi_hours")
            wi_attendance = st.slider("📊 Attendance %", 0.0, 100.0, 75.0, 1.0, key="wi_att")
            wi_gpa = st.slider("📈 Previous GPA", 0.0, 4.0, 2.5, 0.01, key="wi_gpa")
        with col2:
            wi_sleep = st.slider("😴 Sleep Hours", 3.0, 10.0, 7.0, 0.5, key="wi_sleep")
            wi_stress = st.slider("😰 Stress Level", 1.0, 10.0, 5.0, 0.5, key="wi_stress")
            wi_anxiety = st.slider("📝 Exam Anxiety", 1.0, 10.0, 5.0, 0.5, key="wi_anxiety")
        
        if st.button("🔬 Run Simulation", use_container_width=True, key="wi_btn"):
            payload = {
                "hours_studied": wi_hours,
                "attendance": wi_attendance,
                "sleep_hours": wi_sleep,
                "stress_level": wi_stress,
                "screen_time": 3.0,
                "previous_gpa": wi_gpa,
                "part_time_job": 0,
                "diet_quality": 1,
                "internet_quality": 2,
                "extracurricular": 0,
                "tutoring_sessions": 1,
                "family_income_level": 1,
                "exam_anxiety": wi_anxiety,
                "electricity_availability": 0.5,
                "internet_accessibility": 1,
                "peer_influence": 1,
                "community_beliefs": 3.0,
                "family_support": 3.0,
                "home_study_environment": 3.0,
                "motivation_level": 3.0,
                "lecture_quality": 3.0,
                "physical_health": 3.0,
                "psychological_state": 3.0,
                "gender_female": 1,
                "gender_male": 0,
                "gender_nonbinary": 0,
                "study_method_hybrid": 0,
                "study_method_offline": 1,
                "study_method_online": 0
            }
            
            r = api_post("/predict/whatif", payload)
            
            if r and r.status_code == 200:
                display_result(r.json())
                st.info("💡 This is a simulation. Results are not saved to your history.")
            elif r:
                st.error(f"❌ {r.json().get('detail', 'Simulation failed.')}")
    
    # Tab 3: History
    with tab3:
        st.markdown("#### 📋 Your Prediction History")
        r = api_get("/history")
        if r and r.status_code == 200:
            history = r.json()
            if not history:
                st.info("📭 No predictions yet. Make your first prediction in the tab above.")
            else:
                for rec in history[:20]:
                    colour = GRADE_COLOURS.get(rec.get("predicted_grade", "C"), "#888")
                    st.markdown(f"""
                    <div class="history-row">
                        <span>
                            <span style="color:{colour};font-weight:bold;">{rec.get('predicted_gpa_range', 'N/A')}</span>
                            &nbsp;|&nbsp; {rec.get('academic_status', 'N/A')}
                            &nbsp;|&nbsp; <strong>{rec.get('top_probability', 0)}%</strong>
                        </span>
                        <span style="color:#888;font-size:12px;">
                            📚 {rec.get('hours_studied', 0)}h &nbsp;|&nbsp;
                            📊 {rec.get('attendance', 0)}% &nbsp;|&nbsp;
                            {rec.get('created_at', '')[:10] if rec.get('created_at') else ''}
                        </span>
                    </div>
                    """, unsafe_allow_html=True)

# ── Instructor Dashboard ──────────────────────────────────────
def page_instructor():
    show_header()
    st.info("👨‍🏫 Instructor Dashboard - Batch predictions and class analytics coming soon.")

# ── Admin Dashboard ───────────────────────────────────────────
def page_admin():
    show_header()
    st.info("👑 Admin Dashboard - User management and system analytics coming soon.")

# ── Sidebar ────────────────────────────────────────────────────
def sidebar_nav():
    with st.sidebar:
        st.markdown("### 🧭 Navigation")
        if st.button("🚪 Logout", use_container_width=True):
            for k in ["token", "role", "username"]:
                st.session_state[k] = None
            st.session_state.page = "login"
            st.rerun()
        
        st.markdown("---")
        st.markdown("### 👤 User Info")
        st.markdown(f"**Role:** `{st.session_state.role}`")
        st.markdown(f"**User:** `{st.session_state.username}`")
        
        st.markdown("---")
        st.markdown("### 🤖 Model Info")
        st.markdown("**Algorithm:** Logistic Regression")
        st.markdown("**Accuracy:** 74.5%")
        st.markdown("**Features:** 29")
        
        st.markdown("---")
        st.markdown("### 📚 About")
        st.markdown("**Project:** Student Performance Prediction")
        st.markdown("**Institution:** UB FET")
        st.markdown("**Year:** 2025/2026")
        
        # API Health
        st.markdown("---")
        if check_api_health():
            st.success("✅ API: Online")
        else:
            st.error("❌ API: Offline")

# ── Main Router ───────────────────────────────────────────────
if st.session_state.token is None:
    page_login()
else:
    sidebar_nav()
    role = st.session_state.role
    if role == "student":
        page_student()
    elif role == "instructor":
        page_instructor()
    elif role == "admin":
        page_admin()
    else:
        st.error("❌ Unknown role.")

# ── Footer ─────────────────────────────────────────────────────
st.markdown("""
<div class="footer">
    🎓 Student Performance Prediction System — University of Buea, FET, 
    Department of Computer Engineering | Final Year Project 2025/2026
</div>
""", unsafe_allow_html=True)