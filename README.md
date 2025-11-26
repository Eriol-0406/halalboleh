# AMANA — Halal-X: AI-Powered JAKIM Certification Assistant

🕌 **Tagline:** AI assistant for JAKIM Halal certification

**Last updated:** 26 November 2025
Built for **EmbeddedLLM CodeFest** - Generative AI for Malaysian Industries with JamAI Base

---

## 🎯 Project Overview

**Problem:**
- Malaysian SMEs struggle to get JAKIM Halal certification
- Hiring a Halal Executive costs RM3,500/month (unaffordable)
- 73.5% of SMEs fail on the Sertu process
- New MYeHALAL digital system (May 2025) is confusing

**Solution:**
Halal-X is an AI assistant that guides SMEs through the entire JAKIM certification process using JamAI Base's Chain of Thought reasoning for transparent and trustworthy decisions.

---

## 🚀 Features

### 1. **Eligibility Checker** (`/eligibility`)
- Determine if your business is eligible for JAKIM certification
- Get estimated timeline (30-51 days) and cost (RM100+)
- Receive step-by-step next actions
- **Chain of Thought:** See how AI analyzes JAKIM regulations

### 2. **NCR Risk Scanner** (`/ncr-scan`)
- Upload factory/kitchen photo
- AI detects Top 5 NCR (Non-Conformance Report) risks
- Get risk score (0-10) with severity levels
- Receive action plan to fix issues before audit
- **73.5% of SMEs fail on Sertu!**

### 3. **Sertu Process Guide** (`/sertu`)
- Step-by-step Islamic cleansing ritual guide
- Equipment-specific instructions (knife, pot, mixer, etc.)
- Material list and time estimation
- **Most critical process for JAKIM certification**

### 4. **MYeHALAL Form Helper** (`/form-helper`)
- Chat interface in Bahasa Malaysia, English, or Manglish
- Ask questions about complex application forms
- AI provides suggested values to fill in forms
- Links to relevant JAKIM documents

### 5. **Mock Audit Practice** (`/mock-audit`)
- Interview-style practice with real JAKIM auditor questions
- Categories: Sertu, Materials, Staff, Hygiene, Documentation
- Get expected answers and tips
- Build confidence before real audit

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI Platform:** JamAI Base (EmbeddedLLM)
- **PWA:** Installable mobile app

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm

### Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create `.env.local` file:
```env
NEXT_PUBLIC_JAMAI_BASE_URL=http://localhost:8000
NEXT_PUBLIC_JAMAI_API_KEY=your_api_key_here
```

3. **Run development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

5. **Access from mobile on same WiFi:**
```
http://192.168.1.X:3000
```

---

## 🎨 Design System

### Color Scheme (Islamic Green)
- **Primary:** `#16A085` (Teal Green)
- **Primary Dark:** `#0F6F66`
- **Primary Light:** `#1ABC9C`
- **Gold:** `#D4AF37` (Accent)
- **Success:** `#27AE60` (Halal confirmed)
- **Warning:** `#F39C12` (Needs check)
- **Danger:** `#E74C3C` (Not halal)

### Typography
- **Font:** Inter (Google Fonts)
- **Headers:** Bold, 18-24px
- **Body:** Regular, 14-16px
- **Buttons:** Semibold, 16-18px

### Mobile-First
- Optimized for 375px width screens
- Minimum touch target: 44x44px
- One-column layout
- Large, accessible buttons

---

## 🧠 JamAI Base Integration

### Knowledge Tables
Upload these documents to JamAI Base:
1. `JAKIM_MPPHM_2020.pdf` - Manual Procedure
2. `NCR_Common_Issues.csv` - Top 5 failures
3. `Sertu_Process_Guide.pdf` - Islamic cleansing
4. `MYeHALAL_Portal_Screenshots/` - UI guide
5. `Foreign_Halal_Bodies_List.pdf` - Recognized certifiers
6. `Cost_Timeline_Matrix.csv` - By business category

### Action Tables (Chain of Thought)
Each feature uses multi-step reasoning:
- **Eligibility:** Query standards → Apply logic → Calculate timeline → Generate steps
- **NCR Scan:** Analyze image → Compare database → Match issues → Calculate risk → Generate plan
- **Sertu:** Query guide → Generate steps → Calculate materials → Estimate cost
- **Form Helper:** Understand question → Query forms → Generate answer → Suggest value
- **Mock Audit:** Query standards → Generate questions → Provide answers → Give tips

---

## 📱 PWA Configuration

The app is installable as a Progressive Web App:

1. **On Mobile (iOS/Android):**
   - Open in Safari/Chrome
   - Tap "Share" → "Add to Home Screen"

2. **On Desktop:**
   - Click install icon in browser address bar

---

## 🎭 Demo Day Strategy

### 5-Minute Pitch:

1. **Hook (30s):**
   - "Pak Cik ada kedai makan, nak sijil halal tapi RM3,500/bulan mahal!"
   - Show problem with real statistics

2. **Solution Demo (3m):**
   - Open app on phone (not laptop!)
   - **Eligibility:** Fill form → AI reasoning → Result in 3 seconds
   - **NCR Scan:** Upload photo → AI finds risks → 73.5% stat
   - **Sertu Guide:** "This is why 73.5% fail!" → Step-by-step fix

3. **Technology (1m):**
   - Highlight **Chain of Thought** panel
   - "JamAI Base shows WHY AI decides" → Transparency
   - Show multi-step reasoning process

4. **Impact (30s):**
   - "RM3,500 → RM50. That's 70x savings!"
   - "8,000+ certified companies × 70x = massive impact"
   - "Malaysia is #1 in Global Islamic Economy"

---

## 🏆 Judging Criteria Alignment

1. **Local Impact (25%):** ✅ Solves real Malaysian SME problem with JAKIM data
2. **Use of JamAI Base (25%):** ✅ Heavy use of Knowledge + Action Tables + Chain of Thought
3. **Creativity (20%):** ✅ Not just chatbot - actual workflow automation
4. **User Experience (15%):** ✅ Mobile-first, bilingual, color-coded, emoji-rich
5. **Technical Execution (15%):** ✅ Clean TypeScript, PWA, working demo

---

## 📊 Key Statistics (From Research)

- **73.5%** - SME failure rate on Sertu process
- **37.8%** - Failure on Halal Executive appointment
- **21.4%** - Failure on training records
- **30-51 days** - Average certification timeline
- **RM100+** - Base application fee
- **8,000+** - JAKIM-certified companies in Malaysia
- **#1** - Malaysia's rank in Global Islamic Economy

---

## 🔮 Future Enhancements

### Phase 2 (Post-Hackathon):
- PDF report generation for action plans
- Certificate renewal reminder system
- Ongoing compliance monitoring
- Integration with actual MYeHALAL portal
- Supplier halal certificate validator
- Timeline predictor based on business category

### Phase 3 (Production):
- Real JamAI Base API integration
- Image recognition for equipment/layout
- Multi-language support (Arabic, Chinese, Tamil)
- SMS/WhatsApp notifications
- Government partnership for official endorsement

---

## 📄 License

This project is created for EmbeddedLLM CodeFest 2025.

---

## 👥 About EmbeddedLLM

**EmbeddedLLM** specializes in integrating LLMs into businesses through:
- Expert consulting and robust support
- AMD platform optimization
- Innovative LLM platforms for generative AI

**JamAI Base** - Collaborative spreadsheet for AI that chains cells into powerful pipelines
- Experiment with prompts and models in real-time
- Evaluate LLM responses with transparency
- GitHub: github.com/EmbeddedLLM/jamaibase

---

## 🙏 Acknowledgments

- **JAKIM** - For halal certification standards and procedures
- **EmbeddedLLM** - For JamAI Base technology
- Research papers on SME halal certification challenges
- Malaysian halal industry stakeholders

---

## 📧 Contact

For questions or feedback about this project, please contact the development team.

---

**Built with ❤️ for Malaysian SMEs**

🕌 **Halal-X** - Making halal certification accessible to everyone
