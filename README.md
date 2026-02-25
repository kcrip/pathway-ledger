# Pathway Ledger 📜✨

**Pathway Ledger** is a private, local-first web application designed to help individuals navigate the 4th and 5th steps of 12-step recovery programs. It provides a structured, digital version of traditional moral inventory worksheets with integrated AI tools to foster deeper self-reflection.

## 🌟 Key Features

- **Local-First Privacy**: Your inventory data is stored exclusively in your browser's LocalStorage. No data is sent to a database or stored in the cloud.
- **Structured Inventories**: Dedicated tabs for **Resentments**, **Fears**, and **Harms**, based on Big Book workshop formats.
- **AI-Powered Reflection**: Use the "Sparkles" tool to generate clarifying, non-judgmental questions about any entry to help uncover "your part."
- **Entity Summary**: A high-level visualization that groups entries by person/institution to identify patterns and "drill down" into your work.
- **5th Step Interactive Mode**: A focused interface for sharing your inventory with a sponsor, including a dedicated field for "Sponsor Insights."
- **Spiritual Prayer Synthesis**: Automatically generate a personalized "Prayer & Meditation List" based on your 5th step completions, following universal spiritual principles.
- **Professional Print Layout**: Export your entire ledger into a clean, formatted workbook for offline 5th step sessions.
- **Data Portability**: Import/Export full JSON backups or copy/paste tab-separated values (TSV) directly to/from Google Sheets or Excel.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API Key (for AI features)

### Installation

1. **Fork the repository** to your own GitHub account.
2. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/pathway-ledger.git
   cd pathway-ledger
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   Create a `.env` file in the root directory and add your API key:
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```
5. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) in your browser.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **AI Framework**: [Genkit](https://github.com/firebase/genkit)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🤝 Contributing & Feedback

We welcome contributions! If you encounter a bug or have an idea for a feature that would help the recovery community:

1. **Check for existing Issues**: See if someone else has already reported it.
2. **Open an Issue**: Use the [Issues](https://github.com/your-username/pathway-ledger/issues) tab to describe the bug or request a feature.
3. **Submit a Pull Request**: If you've fixed a bug or added a feature, feel free to open a PR!

## 📄 License

This project is licensed under the **MIT License**. We believe recovery tools should be "freely given" and accessible to everyone. See the [LICENSE](src/app/license/page.tsx) page within the app for full details.

## 💙 Support

Pathway Ledger is an open-source labor of love. If this tool has helped you, consider supporting the ongoing costs of AI tokens and hosting. Links to support the project can be found in the application footer.

---

*"Self-reliance failed us." — We built this to help you find a better way.*