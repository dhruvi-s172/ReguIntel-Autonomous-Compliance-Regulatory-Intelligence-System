import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Regulatory Data - High Fidelity
  let circulars = [
    {
      id: "RBI/2024-25/102",
      title: "Master Direction – Cyber Resilience and Digital Payment Security Controls for PSOs",
      source: "RBI",
      region: "India",
      date: "2024-04-01",
      url: "https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12654",
      status: "New",
      riskScore: 88,
      category: "Compliance",
      summary: "Comprehensive framework for Payment System Operators to enhance cyber resilience and secure digital payment transactions."
    },
    {
      id: "SEC-2024-089",
      title: "Cybersecurity Risk Management, Strategy, Governance, and Incident Disclosure",
      source: "SEC",
      region: "USA",
      date: "2024-03-28",
      url: "https://www.sec.gov/rules/final/2023/33-11216.pdf",
      status: "Analyzed",
      riskScore: 94,
      category: "Compliance",
      summary: "Mandates standardized disclosure regarding cybersecurity risk management and material incident reporting within 4 business days."
    },
    {
      id: "EU-AI-ACT-2024",
      title: "Regulation on Artificial Intelligence (AI Act) - Final Compromise Text",
      source: "EU",
      region: "EU",
      date: "2024-03-13",
      url: "https://data.consilium.europa.eu/doc/document/ST-5662-2024-INIT/en/pdf",
      status: "New",
      riskScore: 92,
      category: "Scope",
      summary: "World's first comprehensive AI law, categorizing AI systems by risk and imposing strict transparency and safety obligations."
    },
    {
      id: "FCA-PS24/3",
      title: "Operational Resilience: Critical Third Parties to the UK Financial Sector",
      source: "FCA",
      region: "UK",
      date: "2024-03-20",
      url: "https://www.fca.org.uk/publications/policy-statements/ps24-3-operational-resilience",
      status: "Action Taken",
      riskScore: 76,
      category: "Compliance",
      summary: "New requirements for critical third parties providing services to UK financial firms to ensure operational continuity."
    }
  ];

  // API Routes
  app.get("/api/circulars", (req, res) => {
    res.json(circulars);
  });

  app.post("/api/scan", (req, res) => {
    const newCircular = {
      id: `SEBI/HO/IMD/IMD-I/P/CIR/${new Date().getFullYear()}/${Math.floor(Math.random() * 200)}`,
      title: "Streamlining of Regulatory Reporting by Mutual Funds",
      source: "SEBI",
      region: "India",
      date: new Date().toISOString().split('T')[0],
      url: "#",
      status: "New",
      riskScore: Math.floor(Math.random() * 40) + 50,
      category: "Procedural",
      summary: "New reporting formats and timelines for Mutual Funds to ensure better data consistency and transparency."
    };
    circulars = [newCircular, ...circulars];
    res.json({ message: "Global scan complete. 1 new regulatory update detected.", circular: newCircular });
  });

  app.get("/api/impact/:id", (req, res) => {
    const id = req.params.id;
    res.json({
      circularId: id,
      riskScore: 88,
      summary: `Deep impact analysis for ${id} reveals critical alignment requirements. The regulation mandates real-time reporting of cybersecurity incidents within 6 hours of detection.`,
      affectedEntities: [
        { name: "IT Security", type: "Department", impact: "High", reason: "Reporting window reduced from 24h to 6h." },
        { name: "Digital Wallet", type: "Product", impact: "High", reason: "Direct conflict with new data residency mandates." },
        { name: "Information Security Policy", type: "Policy", impact: "Medium", reason: "Requires update to disclosure timelines." },
        { name: "SaaS Master Agreement v4.2", type: "Contract", impact: "High", reason: "New liability clauses required for third-party AI providers." }
      ],
      causalChain: [
        { from: "Regulation", to: "Incident Response Plan", impact: "High", reason: "Reporting timeline conflict" },
        { from: "Regulation", to: "Board Governance Policy", impact: "Medium", reason: "New oversight mandates" },
        { from: "Incident Response Plan", to: "Digital Wallet", impact: "High", reason: "Operational dependency" }
      ],
      predictiveInsight: "Based on historical SEBI enforcement, failure to align reporting within 90 days may result in a Tier-2 penalty escalation."
    });
  });

  app.post("/api/simulate", (req, res) => {
    const { scenario } = req.body;
    res.json({
      score: 74,
      impact: "Significant",
      summary: `Simulation of '${scenario}' indicates a 40% increase in compliance overhead for the EU region.`,
      mitigation: "Implement automated data tagging and localized storage nodes in the Frankfurt region."
    });
  });

  app.post("/api/draft", (req, res) => {
    res.json([
      {
        type: 'Policy',
        title: 'Cybersecurity Incident Response Policy',
        justification: 'Aligns with SEC 4-day disclosure mandate and RBI cyber resilience framework.',
        content: 'SECTION 4.2: INCIDENT DISCLOSURE\n\nAll material cybersecurity incidents must be reported to the Board and relevant regulatory bodies (SEC, RBI) within 4 business days of determination of materiality. Materiality is defined as any event that significantly affects the financial condition or operational results of the Enterprise.'
      },
      {
        type: 'Contract',
        title: 'Data Processing Addendum (DPA)',
        justification: 'Ensures compliance with EU AI Act transparency requirements for third-party providers.',
        content: 'CLAUSE 12.4: AI TRANSPARENCY\n\nThe Processor shall provide the Controller with detailed documentation regarding the training data, algorithmic logic, and safety testing of any AI systems used in the processing of Personal Data, in accordance with the EU AI Act.'
      }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ReguIntel Enterprise Server running on http://localhost:${PORT}`);
  });
}

startServer();
