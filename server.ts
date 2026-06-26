import express from "express";
import path from "path";
import fs from "fs";
// vite dev only
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import pg from "pg";
import { getFallbackLessonData } from "./src/fallbackLessons";
import { getFallbackExam } from "./src/fallbackExams";
import Stripe from "stripe";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// PostgreSQL connection setup and Fallback Database Engine
const usePostgres = !!process.env.DATABASE_URL;
const pool = usePostgres ? new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
}) : null;

const DB_FILE = path.resolve(process.cwd(), "database.json");

function readLocalDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return {
        students: [],
        community_messages: [],
        alerts: [],
        teachers: [],
        admins: [],
        app_config: {},
        ads: [],
        reports: [],
        custom_data: {}
      };
    }
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const db = JSON.parse(raw);
    if (!db.students) db.students = [];
    if (!db.community_messages && db.communityMessages) {
      db.community_messages = db.communityMessages;
    } else if (!db.community_messages) {
      db.community_messages = [];
    }
    if (!db.alerts) db.alerts = [];
    if (!db.teachers) db.teachers = [];
    if (!db.admins) db.admins = [];
    if (!db.app_config) db.app_config = {};
    if (!db.ads) db.ads = [];
    if (!db.reports) db.reports = [];
    if (!db.custom_data) db.custom_data = {};
    return db;
  } catch (err) {
    console.error("LocalDB Read Error:", err);
    return {
      students: [],
      community_messages: [],
      alerts: [],
      teachers: [],
      admins: [],
      app_config: {},
      ads: [],
      reports: [],
      custom_data: {}
    };
  }
}

function writeLocalDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("LocalDB Write Error:", err);
  }
}

// Initialize database tables
async function initDB() {
  if (usePostgres && pool) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS community_messages (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS teachers (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL
      );
      CREATE TABLE IF NOT EXISTS admins (
        email TEXT PRIMARY KEY,
        data JSONB NOT NULL
      );
      CREATE TABLE IF NOT EXISTS app_config (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL
      );
      CREATE TABLE IF NOT EXISTS ads (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS custom_data (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL
      );
    `);

    // Seed default admin using env variables (never hardcoded)
    const adminEmail = process.env.ADMIN_EMAIL || "";
    const adminPassword = process.env.ADMIN_PASSWORD || "";
    if (adminEmail) {
      await pool.query(`
        INSERT INTO admins (email, data) VALUES ($1, $2)
        ON CONFLICT (email) DO NOTHING
      `, [adminEmail.toLowerCase(), JSON.stringify({ email: adminEmail.toLowerCase(), password: adminPassword, role: "master", name: "Souly" })]);
    }

    // Seed default teachers
    const defaultTeachers = getDefaultTeachers();
    for (const t of defaultTeachers) {
      await pool.query(`INSERT INTO teachers (id, data) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`, [t.id, JSON.stringify(t)]);
    }

    console.log("[DB] PostgreSQL tables ready.");
  } else {
    const db = readLocalDB();
    let changed = false;
    if (!db.teachers || db.teachers.length === 0) {
      db.teachers = getDefaultTeachers();
      changed = true;
    }
    if (!db.admins || db.admins.length === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || "soullis8@gmail.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "Sullivanem123_";
      db.admins = [{
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: "master",
        name: "Soulaymane"
      }];
      changed = true;
    }
    if (changed) {
      writeLocalDB(db);
    }
    console.log("[DB] Local JSON database ready.");
  }
}

// DB helper functions
async function getStudents() {
  if (usePostgres && pool) {
    const res = await pool.query(`SELECT data FROM students ORDER BY created_at ASC`);
    return res.rows.map((r: any) => r.data);
  } else {
    const db = readLocalDB();
    return db.students;
  }
}

async function getStudent(emailOrId: string) {
  const val = emailOrId.toLowerCase();
  if (usePostgres && pool) {
    const res = await pool.query(
      `SELECT data FROM students WHERE data->>'email' = $1 OR data->>'id' = $1 OR data->>'studentIdCode' = $1`,
      [val]
    );
    return res.rows[0]?.data || null;
  } else {
    const db = readLocalDB();
    return db.students.find((s: any) =>
      s.email?.toLowerCase() === val ||
      s.id === val ||
      s.studentIdCode === val
    ) || null;
  }
}

async function saveStudent(student: any) {
  if (usePostgres && pool) {
    await pool.query(
      `INSERT INTO students (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2`,
      [student.id, JSON.stringify(student)]
    );
  } else {
    const db = readLocalDB();
    const idx = db.students.findIndex((s: any) => s.id === student.id);
    if (idx !== -1) {
      db.students[idx] = student;
    } else {
      db.students.push(student);
    }
    writeLocalDB(db);
  }
}

async function getMessages() {
  if (usePostgres && pool) {
    const res = await pool.query(`SELECT data FROM community_messages ORDER BY created_at ASC`);
    return res.rows.map((r: any) => r.data);
  } else {
    const db = readLocalDB();
    return db.community_messages;
  }
}

async function saveMessage(msg: any) {
  if (usePostgres && pool) {
    await pool.query(
      `INSERT INTO community_messages (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2`,
      [msg.id, JSON.stringify(msg)]
    );
  } else {
    const db = readLocalDB();
    const idx = db.community_messages.findIndex((m: any) => m.id === msg.id);
    if (idx !== -1) {
      db.community_messages[idx] = msg;
    } else {
      db.community_messages.push(msg);
    }
    writeLocalDB(db);
  }
}

async function deleteMessage(id: string) {
  if (usePostgres && pool) {
    await pool.query(`DELETE FROM community_messages WHERE id = $1`, [id]);
  } else {
    const db = readLocalDB();
    db.community_messages = db.community_messages.filter((m: any) => m.id !== id);
    writeLocalDB(db);
  }
}

async function getAlerts() {
  if (usePostgres && pool) {
    const res = await pool.query(`SELECT data FROM alerts ORDER BY created_at DESC`);
    return res.rows.map((r: any) => r.data);
  } else {
    const db = readLocalDB();
    return db.alerts;
  }
}

async function saveAlert(alert: any) {
  if (usePostgres && pool) {
    await pool.query(
      `INSERT INTO alerts (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2`,
      [alert.id, JSON.stringify(alert)]
    );
  } else {
    const db = readLocalDB();
    const idx = db.alerts.findIndex((a: any) => a.id === alert.id);
    if (idx !== -1) {
      db.alerts[idx] = alert;
    } else {
      db.alerts.unshift(alert);
    }
    writeLocalDB(db);
  }
}

async function deleteAlert(id: string) {
  if (usePostgres && pool) {
    await pool.query(`DELETE FROM alerts WHERE id = $1`, [id]);
  } else {
    const db = readLocalDB();
    db.alerts = db.alerts.filter((a: any) => a.id !== id);
    writeLocalDB(db);
  }
}

async function getAdmins() {
  if (usePostgres && pool) {
    const res = await pool.query(`SELECT data FROM admins`);
    return res.rows.map((r: any) => r.data);
  } else {
    const db = readLocalDB();
    return db.admins;
  }
}

async function saveAdmin(admin: any) {
  if (usePostgres && pool) {
    await pool.query(
      `INSERT INTO admins (email, data) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET data = $2`,
      [admin.email.toLowerCase(), JSON.stringify(admin)]
    );
  } else {
    const db = readLocalDB();
    const idx = db.admins.findIndex((a: any) => a.email.toLowerCase() === admin.email.toLowerCase());
    if (idx !== -1) {
      db.admins[idx] = admin;
    } else {
      db.admins.push(admin);
    }
    writeLocalDB(db);
  }
}

async function deleteAdmin(email: string) {
  if (usePostgres && pool) {
    await pool.query(`DELETE FROM admins WHERE email = $1`, [email.toLowerCase()]);
  } else {
    const db = readLocalDB();
    db.admins = db.admins.filter((a: any) => a.email.toLowerCase() !== email.toLowerCase());
    writeLocalDB(db);
  }
}

async function getTeachers() {
  if (usePostgres && pool) {
    const res = await pool.query(`SELECT data FROM teachers`);
    return res.rows.map((r: any) => r.data);
  } else {
    const db = readLocalDB();
    return db.teachers;
  }
}

async function saveTeacher(teacher: any) {
  if (usePostgres && pool) {
    await pool.query(
      `INSERT INTO teachers (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2`,
      [teacher.id, JSON.stringify(teacher)]
    );
  } else {
    const db = readLocalDB();
    const idx = db.teachers.findIndex((t: any) => t.id === teacher.id);
    if (idx !== -1) {
      db.teachers[idx] = teacher;
    } else {
      db.teachers.push(teacher);
    }
    writeLocalDB(db);
  }
}

async function deleteTeacher(id: string) {
  if (usePostgres && pool) {
    await pool.query(`DELETE FROM teachers WHERE id = $1`, [id]);
  } else {
    const db = readLocalDB();
    db.teachers = db.teachers.filter((t: any) => t.id !== id);
    writeLocalDB(db);
  }
}

async function getConfig(key: string) {
  if (usePostgres && pool) {
    const res = await pool.query(`SELECT value FROM app_config WHERE key = $1`, [key]);
    return res.rows[0]?.value ?? null;
  } else {
    const db = readLocalDB();
    return db.app_config[key] ?? null;
  }
}

async function setConfig(key: string, value: any) {
  if (usePostgres && pool) {
    await pool.query(
      `INSERT INTO app_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`,
      [key, JSON.stringify(value)]
    );
  } else {
    const db = readLocalDB();
    db.app_config[key] = value;
    writeLocalDB(db);
  }
}

async function getAds() {
  if (usePostgres && pool) {
    const res = await pool.query(`SELECT data FROM ads ORDER BY created_at ASC`);
    return res.rows.map((r: any) => r.data);
  } else {
    const db = readLocalDB();
    return db.ads;
  }
}

async function saveAd(ad: any) {
  if (usePostgres && pool) {
    await pool.query(
      `INSERT INTO ads (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2`,
      [ad.id, JSON.stringify(ad)]
    );
  } else {
    const db = readLocalDB();
    const idx = db.ads.findIndex((a: any) => a.id === ad.id);
    if (idx !== -1) {
      db.ads[idx] = ad;
    } else {
      db.ads.push(ad);
    }
    writeLocalDB(db);
  }
}

async function deleteAd(id: string) {
  if (usePostgres && pool) {
    await pool.query(`DELETE FROM ads WHERE id = $1`, [id]);
  } else {
    const db = readLocalDB();
    db.ads = db.ads.filter((a: any) => a.id !== id);
    writeLocalDB(db);
  }
}

async function getReports() {
  if (usePostgres && pool) {
    const res = await pool.query(`SELECT data FROM reports ORDER BY created_at DESC`);
    return res.rows.map((r: any) => r.data);
  } else {
    const db = readLocalDB();
    return db.reports;
  }
}

async function saveReport(report: any) {
  if (usePostgres && pool) {
    await pool.query(
      `INSERT INTO reports (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2`,
      [report.id, JSON.stringify(report)]
    );
  } else {
    const db = readLocalDB();
    const idx = db.reports.findIndex((r: any) => r.id === report.id);
    if (idx !== -1) {
      db.reports[idx] = report;
    } else {
      db.reports.unshift(report);
    }
    writeLocalDB(db);
  }
}

async function getCustomData(key: string) {
  if (usePostgres && pool) {
    const res = await pool.query(`SELECT value FROM custom_data WHERE key = $1`, [key]);
    return res.rows[0]?.value ?? null;
  } else {
    const db = readLocalDB();
    return db.custom_data[key] ?? null;
  }
}

async function setCustomData(key: string, value: any) {
  if (usePostgres && pool) {
    await pool.query(
      `INSERT INTO custom_data (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2`,
      [key, JSON.stringify(value)]
    );
  } else {
    const db = readLocalDB();
    db.custom_data[key] = value;
    writeLocalDB(db);
  }
}

// =============================================
// GEMINI - ONLY FOR COMMENT MODERATION
// =============================================
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
}) : null;

const MULTILINGUAL_BAD_WORDS = [
  "mierda", "puta", "puto", "cabron", "cabrón", "joder", "maricon", "maricón", "gilipollas", "pendejo", "chingar",
  "merde", "putain", "connard", "salope", "fils de pute", "chier", "bordel",
  "shit", "fuck", "bitch", "asshole", "bastard", "cunt", "dick",
  "zamel", "kahba", "9ahba", "khara", "zab", "tabon", "mok", "zebe", "mounafiq", "quosombak", "kosomak", "sharmouta"
];

const DANGEROUS_TERMS = [
  "visado falso", "comprar nie", "documento falso", "empadronamiento falso", "matricula falsa",
  "falsificar", "comprar pasaporte", "soborno", "dinero negro",
  "vender examen", "respuestas pce", "comprar pce", "falso visado", "falsificado",
  "scam", "estafa", "hacker", "visa fake", "fake passport", "fake nie", "fake visa",
  "vender titulo", "comprar titulo", "comprar diploma", "fake degree",
  "harraga", "patera", "bomba", "matar", "asesinar", "terrorista", "armas", "suicidio", "drogar", "ilegal"
];

function containsInappropriateContent(text: string): boolean {
  if (!text) return false;
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return MULTILINGUAL_BAD_WORDS.some(word => normalized.includes(word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
}

function containsDangerousContent(text: string): boolean {
  if (!text) return false;
  const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return DANGEROUS_TERMS.some(word => normalized.includes(word.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
}

// AI moderation - ONLY used for community comments
async function moderatePostWithAI(text: string): Promise<{ isBad: boolean; reason: string; languageDetected: string }> {
  if (!text) return { isBad: false, reason: "", languageDetected: "" };

  if (containsDangerousContent(text)) {
    return { isBad: true, reason: "ALERTA RIESGO/FRAUDE: Términos peligrosos detectados.", languageDetected: "Filtro Seguridad" };
  }
  if (containsInappropriateContent(text)) {
    return { isBad: true, reason: "Vocabulario explícitamente restringido.", languageDetected: "Filtro Local" };
  }

  if (ai) {
    try {
      const prompt = `Analiza el siguiente mensaje de una comunidad estudiantil. Determina si contiene insultos, amenazas, acoso o vocabulario vulgar en árabe dialectal (darija), francés, español o inglés.

Mensaje: "${text}"

Responde SOLO con JSON plano (sin markdown): {"isBad": true/false, "reason": "justificación breve", "languageDetected": "idioma"}`;

      const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });
      if (response?.text) {
        let clean = response.text.trim().replace(/```(json)?/g, "").trim();
        const data = JSON.parse(clean);
        return { isBad: !!data.isBad, reason: data.reason || "", languageDetected: data.languageDetected || "" };
      }
    } catch (e) {
      console.error("[AI Moderation] Error:", e);
    }
  }

  return { isBad: false, reason: "", languageDetected: "" };
}

function getDefaultTeachers() {
  return [
    { id: "teach_1", name: "Mónica Ruiz Castro", subject: "Español A1 - B2", email: "monica.ruiz@espana-study.com", bio: "Profesora nativa con 8 años de experiencia.", phone: "+34 612 345 678", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", rating: 5 },
    { id: "teach_2", name: "Yassine El Amrani", subject: "PCE Selectividad - Matemáticas y Física", email: "yassine.amrani@espana-study.com", bio: "Doctor por la Universidad de Granada.", phone: "+34 688 123 456", photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", rating: 5 },
    { id: "teach_3", name: "Prof. Alberto Sanz", subject: "Español Técnico para FP", email: "alberto.sanz@espana-study.com", bio: "Especialista en terminología técnica.", phone: "+34 633 987 654", photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200", rating: 4.8 }
  ];
}

async function startServer() {
  await initDB();

  app.use(express.json());

  const activeSessions = new Map<string, string>();
  const adminTokens = new Map<string, string>();

  function isAdmin(req: express.Request): boolean {
    const email = (req.headers["x-admin-email"] as string || req.query.adminEmail as string || "").toLowerCase().trim();
    const token = req.headers["x-admin-token"] as string || req.query.adminToken as string || "";
    if (!email || !token) return false;
    return adminTokens.get(email) === token;
  }

  // Health check
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  // DB Stats
  app.get("/api/db/stats", async (req, res) => {
    try {
      const isReqAdmin = isAdmin(req);

      const studentsRaw = await getStudents();
      const communityMessages = await getMessages();
      const alertsRaw = await getAlerts();
      const teachers = await getTeachers();
      const ads = await getAds();

      // Filter students if not admin
      let students = studentsRaw;
      const premiumVideos = await getCustomData("premium_videos") || [];
      
      if (!isReqAdmin) {
        const verifyEmail = (req.query.verifyEmail as string || "").toLowerCase().trim();
        students = studentsRaw.map((s: any) => {
          if (verifyEmail && s.email?.toLowerCase() === verifyEmail) {
            // Retornar perfil completo del propio alumno para conservar campos privados (ej: purchasedVideos, teléfono, progreso)
            return s;
          }
          return {
            id: s.id,
            name: s.name,
            xp: s.xp || 0,
            level: s.level || "A1",
            streak: s.streak || 1,
            unlockedBadges: s.unlockedBadges || []
          };
        });
      }

      // Filter alerts if not admin (students only see alerts relevant to them, if any)
      let alerts = alertsRaw;
      if (!isReqAdmin) {
        const verifyEmail = (req.query.verifyEmail as string || "").toLowerCase().trim();
        alerts = alertsRaw.filter((a: any) => !a.isViolationUnit || (verifyEmail && a.violatorEmail?.toLowerCase() === verifyEmail));
      }

      const admins = isReqAdmin ? await getAdmins() : [];
      const progressReports = isReqAdmin ? await getReports() : [];
      const customMetrics = isReqAdmin ? (await getConfig("customMetrics") || { totalPageViews: 0, totalVisits: 0, avgSessionSeconds: 0, bounceRatePercent: 0 }) : { totalPageViews: 0, totalVisits: 0, avgSessionSeconds: 0, bounceRatePercent: 0 };

      const subscriptionPrice = await getConfig("subscriptionPrice");
      const subscriptionScope = await getConfig("subscriptionScope");
      const subscriptionBlocked = await getConfig("subscriptionBlocked");
      const subscriptionUserLimit = await getConfig("subscriptionUserLimit");
      const subscriptionEnabled = await getConfig("subscriptionEnabled");

      const verifyEmail = req.query.verifyEmail as string;
      if (verifyEmail) {
        const clientIP = ((req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1").split(",")[0].trim();
        const existingIP = activeSessions.get(verifyEmail.toLowerCase());
        if (existingIP && existingIP !== clientIP) {
          return res.status(403).json({ status: "ip_conflict", error: `Sesión cerrada. Tu cuenta fue accedida desde otra IP.` });
        }
        if (!existingIP) activeSessions.set(verifyEmail.toLowerCase(), clientIP);
      }

      res.json({ students, communityMessages, alerts, teachers, admins, ads, progressReports, customMetrics, subscriptionPrice, subscriptionScope, subscriptionBlocked, subscriptionUserLimit, subscriptionEnabled, premiumVideos });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // Student Login / Register
  app.post("/api/auth/student-login", async (req, res) => {
    const { email, name, lastName, phone, country, age, gender, currentEducation, academicGoal, city, targetCity, currentCountry, level, isOnlyLogin, referredBy } = req.body;
    if (!email) return res.status(400).json({ error: "El correo electrónico es requerido." });

    const clientIP = ((req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1").split(",")[0].trim();
    const existingIP = activeSessions.get(email.toLowerCase());
    if (existingIP && existingIP !== clientIP) {
      return res.status(403).json({ success: false, error: "Este correo ya está conectado desde otra IP." });
    }

    try {
      const subscriptionBlocked = await getConfig("subscriptionBlocked");
      let student = await getStudent(email);

      if (student) {
        if (student.isBlocked) return res.status(403).json({ success: false, error: "SU ACCESO HA SIDO TEMPORALMENTE RESTRINGIDO." });
        if (subscriptionBlocked) return res.status(403).json({ success: false, error: "PLATAFORMA BLOQUEADA por el administrador." });
        if (!isOnlyLogin) return res.status(400).json({ success: false, error: "Ya dispones de un perfil con este correo. Ve a 'Iniciar Sesión'." });
      } else {
        if (subscriptionBlocked) return res.status(403).json({ success: false, error: "PLATAFORMA BLOQUEADA." });
        if (isOnlyLogin) return res.status(404).json({ success: false, error: "Correo no registrado. Selecciona 'Crear Cuenta'." });
        if (!email.includes("@")) return res.status(404).json({ success: false, error: "ID no encontrado." });

        const allStudents = await getStudents();
        const userLimit = (await getConfig("subscriptionUserLimit")) ?? 1000;
        if (allStudents.length >= userLimit) return res.status(403).json({ success: false, error: `Límite de ${userLimit} estudiantes alcanzado.` });

        if (phone) {
          const phoneExists = allStudents.some((s: any) => s.phone && s.phone.trim() === phone.trim());
          if (phoneExists) return res.status(400).json({ success: false, error: "El número de teléfono ya está asignado a otro estudiante." });
        }

        student = {
          id: `stud_${Date.now()}`,
          name: name || email.split("@")[0],
          lastName: lastName || "",
          phone: phone || "",
          email: email.toLowerCase(),
          country: country || "Morocco",
          city: city || "Rabat",
          targetCity: targetCity || "Madrid",
          gender: gender || "Masculino",
          age: age ? Number(age) : 20,
          language: "fr",
          level: level || "A1",
          academicGoal: academicGoal || "FP Grado Superior",
          currentEducation: currentEducation || "Bachillerato",
          currentCountry: currentCountry || country || "Morocco",
          professionalGoal: "Estudiante de FP / Universidad",
          xp: 0, streak: 3, completedLessons: 0, completedExams: 0, studyTimeMinutes: 0,
          hasCv: false, registrationDate: new Date().toISOString().split("T")[0],
          premiumStatus: false, vocationalTopChoice: "Informática",
          isInternshipReady: false, hasJobReady: false, activeInCommunity: true,
          channel: "Direct", paymentAmount: 0, isBlocked: false
        };
        await saveStudent(student);

        // Handle friend referral points
        if (referredBy) {
          try {
            const refClean = referredBy.toLowerCase().trim();
            const referrer = await getStudent(refClean);
            if (referrer && refClean !== email.toLowerCase()) {
              referrer.xp = (referrer.xp || 0) + 50;
              if (!referrer.unlockedBadges) referrer.unlockedBadges = [];
              if (!referrer.unlockedBadges.includes("embajador")) {
                referrer.unlockedBadges.push("embajador");
              }
              await saveStudent(referrer);

              // Log referral bonus
              console.log(`[REFERRAL] Awarded +50 XP to referrer student: ${refClean} for inviting new student: ${email}`);

              // Save an alert for the referrer so they are notified when logging in
              const refAlert = {
                id: `alert_ref_${Date.now()}`,
                title: `🌍 ¡Un compañero se ha registrado con tu enlace! Has ganado +50 estrellas/puntos de bonificación ⭐`,
                type: "success",
                timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
                violatorEmail: refClean,
                violatorName: referrer.name,
                isViolationUnit: false
              };
              await saveAlert(refAlert);
            }
          } catch (refErr) {
            console.error("Error awarding referral bonus:", refErr);
          }
        }
      }

      activeSessions.set(email.toLowerCase(), clientIP);
      res.json({ success: true, student });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Student Logout
  app.post("/api/auth/student-logout", (req, res) => {
    const { email } = req.body;
    if (email) activeSessions.delete(email.toLowerCase());
    res.json({ success: true });
  });

  // Admin Login
  app.post("/api/auth/admin-login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Correo y contraseña requeridos." });
    try {
      const admins = await getAdmins();
      const admin = admins.find((a: any) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
      if (admin) {
        const token = "tok_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        adminTokens.set(email.toLowerCase(), token);
        return res.json({ success: true, admin, token });
      }
      res.status(401).json({ error: "Credenciales inválidas." });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Secure all /api/admin/* endpoints using the isAdmin middleware
  app.use("/api/admin", (req, res, next) => {
    if (!isAdmin(req)) {
      return res.status(403).json({ error: "No autorizado. Acceso exclusivo de administradores con sesión activa." });
    }
    next();
  });

  // Create Collaborator
  app.post("/api/admin/create-collaborator", async (req, res) => {
    const { creatorEmail, name, password, adminEmail, canEditData } = req.body;
    const masterEmail = process.env.ADMIN_EMAIL || "";
    if (!adminEmail || adminEmail.toLowerCase() !== masterEmail.toLowerCase()) {
      return res.status(403).json({ error: "Solo el Administrador Maestro puede crear colaboradores." });
    }
    try {
      const admins = await getAdmins();
      if (admins.find((a: any) => a.email.toLowerCase() === creatorEmail.toLowerCase())) {
        return res.status(400).json({ error: "Este correo ya está registrado como colaborador." });
      }
      const newAdmin = { email: creatorEmail.toLowerCase().trim(), password, role: "anfitrion", name: name.trim(), canEditData: !!canEditData };
      await saveAdmin(newAdmin);
      const allAdmins = await getAdmins();
      res.json({ success: true, admins: allAdmins });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Delete Collaborator
  app.post("/api/admin/delete-collaborator", async (req, res) => {
    const { email, adminEmail } = req.body;
    const masterEmail = process.env.ADMIN_EMAIL || "";
    if (!adminEmail || adminEmail.toLowerCase() !== masterEmail.toLowerCase()) {
      return res.status(403).json({ error: "Solo el Administrador Maestro puede eliminar colaboradores." });
    }
    try {
      await deleteAdmin(email);
      const allAdmins = await getAdmins();
      res.json({ success: true, admins: allAdmins });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Toggle Collaborator Edit
  app.post("/api/admin/toggle-collaborator-edit", async (req, res) => {
    const { email, adminEmail } = req.body;
    const masterEmail = process.env.ADMIN_EMAIL || "";
    if (!adminEmail || adminEmail.toLowerCase() !== masterEmail.toLowerCase()) {
      return res.status(403).json({ error: "Solo el Administrador Maestro puede modificar privilegios." });
    }
    try {
      const admins = await getAdmins();
      const admin = admins.find((a: any) => a.email.toLowerCase() === email.toLowerCase());
      if (admin) {
        admin.canEditData = !admin.canEditData;
        await saveAdmin(admin);
      }
      const allAdmins = await getAdmins();
      res.json({ success: true, admins: allAdmins });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Get Collaborators
  app.get("/api/admin/collaborators", async (req, res) => {
    try {
      const admins = await getAdmins();
      res.json({ success: true, collaborators: admins });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Create Student (Admin)
  app.post("/api/admin/create-student", async (req, res) => {
    const { name, lastName, country, targetCity, academicGoal, emailInput, level } = req.body;
    if (!name) return res.status(400).json({ error: "El nombre es obligatorio." });
    try {
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      const studentIdCode = `AE-STUD-${randomSuffix}`;
      const generatedEmail = emailInput?.trim() ? emailInput.trim().toLowerCase() : `estudiante-${randomSuffix.toLowerCase()}@atrevete.com`;

      const exists = await getStudent(generatedEmail);
      if (exists) return res.status(400).json({ error: "Este correo ya está registrado." });

      const newStudent = {
        id: `stud_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
        studentIdCode, name: name.trim(), lastName: (lastName || "").trim(),
        phone: "", email: generatedEmail, country: country || "Morocco",
        city: "Casablanca", targetCity: targetCity || "Madrid", gender: "Masculino", age: 20,
        language: "fr", level: level || "A1", academicGoal: academicGoal || "FP Grado Superior",
        currentEducation: "Bachillerato", currentCountry: country || "Morocco",
        professionalGoal: "Estudiante de FP / Universidad",
        xp: 0, streak: 3, completedLessons: 0, completedExams: 0, studyTimeMinutes: 0,
        hasCv: false, registrationDate: new Date().toISOString().split("T")[0],
        premiumStatus: false, vocationalTopChoice: "Informática",
        isInternshipReady: false, hasJobReady: false, activeInCommunity: true,
        channel: "Direct", paymentAmount: 0, isBlocked: false
      };
      await saveStudent(newStudent);
      const students = await getStudents();
      res.json({ success: true, student: newStudent, students });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Toggle Student Block
  app.post("/api/admin/toggle-student-block", async (req, res) => {
    const { id, isBlocked } = req.body;
    if (!id) return res.status(400).json({ error: "ID requerido." });
    try {
      const students = await getStudents();
      const student = students.find((s: any) => s.id === id);
      if (!student) return res.status(404).json({ error: "Alumno no encontrado." });
      student.isBlocked = !!isBlocked;
      await saveStudent(student);
      const allStudents = await getStudents();
      res.json({ success: true, student, students: allStudents });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Update Student
  app.post("/api/student/update", async (req, res) => {
    const { id, updates } = req.body;
    if (!id) return res.status(400).json({ error: "ID requerido." });
    try {
      const students = await getStudents();
      const student = students.find((s: any) => s.id === id);
      if (!student) return res.status(404).json({ error: "Estudiante no encontrado." });
      const updated = { ...student, ...updates };
      await saveStudent(updated);
      res.json({ success: true, student: updated });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Delete Student
  app.post("/api/admin/delete-student", async (req, res) => {
    const { email, phone } = req.body;
    if (!email) return res.status(400).json({ error: "El correo es requerido." });
    try {
      const students = await getStudents();
      const student = students.find((s: any) => s.email.toLowerCase() === email.toLowerCase().trim());
      if (!student) return res.status(404).json({ error: "Estudiante no encontrado." });
      
      if (usePostgres && pool) {
        await pool.query(`DELETE FROM students WHERE id = $1`, [student.id]);
        await pool.query(`DELETE FROM community_messages WHERE data->>'email' = $1`, [email.toLowerCase().trim()]);
      } else {
        const db = readLocalDB();
        db.students = db.students.filter((s: any) => s.id !== student.id);
        db.community_messages = db.community_messages.filter((m: any) => m.email?.toLowerCase() !== email.toLowerCase().trim());
        writeLocalDB(db);
      }
      
      const allStudents = await getStudents();
      const allMessages = await getMessages();
      res.json({ success: true, message: `Estudiante ${student.name} eliminado.`, students: allStudents, communityMessages: allMessages });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Update Metrics
  app.post("/api/admin/update-metrics", async (req, res) => {
    const { customMetrics, newAlert } = req.body;
    try {
      if (customMetrics) await setConfig("customMetrics", customMetrics);
      if (newAlert) {
        const alert = { id: `alert_${Date.now()}`, title: newAlert.title, type: newAlert.type || "info", timestamp: "Ahora" };
        await saveAlert(alert);
      }
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Dismiss Alert
  app.post("/api/admin/dismiss-alert", async (req, res) => {
    const { id } = req.body;
    try {
      await deleteAlert(id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Save Custom Data
  app.post("/api/admin/save-custom-data", async (req, res) => {
    const { key, data } = req.body;
    if (!key) return res.status(400).json({ error: "Key requerida." });
    try {
      await setCustomData(key, data);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Error del servidor." });
    }
  });

  // Ads
  app.get("/api/admin/ads", async (req, res) => {
    try { res.json({ success: true, ads: await getAds() }); } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/admin/ads/create", async (req, res) => {
    const { brand, title, description, imageUrl, targetUrl, section, durationHours, frequencyPerHour, fbAppId, fbPixelId, fbAccessToken, fbEventName } = req.body;
    if (!brand || !title) return res.status(400).json({ error: "Marca y título obligatorios." });
    try {
      const newAd = { id: `ad_${Date.now()}`, brand, title, description: description || "", imageUrl: imageUrl || "", targetUrl: targetUrl || "", status: "active", viewsCount: 0, clicksCount: 0, createdAt: new Date().toISOString(), section: section || "dashboard", durationHours: durationHours ?? -1, frequencyPerHour: frequencyPerHour ?? -1, fbAppId: fbAppId || "", fbPixelId: fbPixelId || "", fbAccessToken: fbAccessToken || "", fbEventName: fbEventName || "Lead" };
      await saveAd(newAd);
      res.json({ success: true, ad: newAd, ads: await getAds() });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/admin/ads/toggle", async (req, res) => {
    const { id } = req.body;
    try {
      const ads = await getAds();
      const ad = ads.find((a: any) => a.id === id);
      if (!ad) return res.status(404).json({ error: "Anuncio no encontrado." });
      ad.status = ad.status === "active" ? "paused" : "active";
      await saveAd(ad);
      res.json({ success: true, ad, ads: await getAds() });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/admin/ads/delete", async (req, res) => {
    const { id } = req.body;
    try { await deleteAd(id); res.json({ success: true, ads: await getAds() }); } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/student/ads/increment-view", async (req, res) => {
    const { id } = req.body;
    try {
      const ads = await getAds();
      const ad = ads.find((a: any) => a.id === id);
      if (!ad) return res.status(404).json({ error: "Anuncio no encontrado." });
      ad.viewsCount = (ad.viewsCount || 0) + 1;
      await saveAd(ad);
      res.json({ success: true, viewsCount: ad.viewsCount });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  // Subscription
  app.post("/api/admin/subscription/save", async (req, res) => {
    const { price, scope, blocked, limit, enabled } = req.body;
    try {
      if (price !== undefined) await setConfig("subscriptionPrice", Number(price));
      if (scope !== undefined) await setConfig("subscriptionScope", scope);
      if (blocked !== undefined) await setConfig("subscriptionBlocked", !!blocked);
      if (limit !== undefined) await setConfig("subscriptionUserLimit", Number(limit));
      if (enabled !== undefined) await setConfig("subscriptionEnabled", !!enabled);
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  // Reports
  app.get("/api/admin/reports", async (req, res) => {
    try { res.json({ success: true, reports: await getReports() }); } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/admin/reports/create", async (req, res) => {
    const { title, metricType, summary, value, trend, author } = req.body;
    if (!title || !metricType || !summary) return res.status(400).json({ error: "Campos obligatorios." });
    try {
      const report = { id: `rep_${Date.now()}`, title, date: new Date().toLocaleDateString("es-ES"), metricType, summary, value: value || "N/A", trend: trend || "stable", author: author || "Administrador" };
      await saveReport(report);
      res.json({ success: true, report, reports: await getReports() });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  // Community Post - WITH AI MODERATION
  app.post("/api/community/post", async (req, res) => {
    const { user, text, email } = req.body;
    if (!text || !user) return res.status(400).json({ error: "User y Text requeridos." });
    try {
      // Secure check: only admins can write in the forum
      if (!isAdmin(req)) {
        return res.status(403).json({ success: false, error: "Sólo los administradores autorizados con sesión activa pueden publicar en el foro de la comunidad." });
      }

      const { isBad, reason, languageDetected } = await moderatePostWithAI(text);

      if (isBad) {
        const alert = { id: `viol_${Date.now()}`, title: `⚠️ COMENTARIO RESTRINGIDO (${languageDetected}): "${user}" escribió: "${text}". IA: ${reason}`, type: "warning", timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }), violatorEmail: email, violatorName: user, isViolationUnit: true };
        await saveAlert(alert);
        return res.status(400).json({ success: false, restricted: true, error: `Comentario restringido. Idioma: ${languageDetected}. Motivo: ${reason}` });
      }

      const msg = { id: `msg_${Date.now()}`, user, text, time: new Date().toISOString(), email, language: languageDetected || "es" };
      await saveMessage(msg);

      if (email) {
        const student = await getStudent(email);
        if (student) { student.xp = (student.xp || 0) + 5; await saveStudent(student); }
      }

      res.json({ success: true, message: msg, scoreUp: email ? 5 : 0 });
    } catch (e) { res.status(500).json({ error: "Error del servidor." }); }
  });

  app.post("/api/community/delete", async (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado." });
    const id = req.body.id || req.body.postId;
    if (!id) return res.status(400).json({ error: "ID requerido." });
    try { await deleteMessage(id); res.json({ success: true, communityMessages: await getMessages() }); } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/community/edit", async (req, res) => {
    if (!isAdmin(req)) return res.status(403).json({ error: "No autorizado." });
    const { id, text } = req.body;
    if (!id || text === undefined) return res.status(400).json({ error: "ID y texto requeridos." });
    try {
      const messages = await getMessages();
      const msg = messages.find((m: any) => m.id === id);
      if (!msg) return res.status(404).json({ error: "Mensaje no encontrado." });
      msg.text = text;
      await saveMessage(msg);
      res.json({ success: true, communityMessages: await getMessages() });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/community/report", async (req, res) => {
    const { messageId, reason, reporterEmail } = req.body;
    if (!messageId) return res.status(400).json({ error: "ID requerido." });
    try {
      const messages = await getMessages();
      const message = messages.find((m: any) => m.id === messageId);
      if (!message) return res.status(404).json({ error: "Mensaje no encontrado." });

      const reports = (await getCustomData("reports")) || [];
      const newReport = { id: `rep_${Date.now()}`, messageId, postText: message.text, violatorName: message.user, violatorEmail: message.email || "Invitado", reporterEmail: reporterEmail || "Anónimo", reason: reason || "Contenido inadecuado.", timestamp: new Date().toISOString() };
      reports.unshift(newReport);
      await setCustomData("reports", reports);

      const alert = { id: `alert_rep_${Date.now()}`, title: `🚩 DENUNCIA: "${message.user}" denunciado. Comentario: "${message.text}". Motivo: ${reason}`, type: "warning", timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }), violatorEmail: message.email, violatorName: message.user, isViolationUnit: true };
      await saveAlert(alert);

      res.json({ success: true, report: newReport });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  // Block Student
  app.post("/api/admin/block-student", async (req, res) => {
    const { email, block } = req.body;
    if (!email) return res.status(400).json({ error: "Correo requerido." });
    try {
      const student = await getStudent(email);
      if (!student) return res.status(404).json({ error: "Estudiante no encontrado." });
      student.isBlocked = !!block;
      await saveStudent(student);
      res.json({ success: true, student, message: block ? "Estudiante bloqueado." : "Estudiante desbloqueado." });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  // Accompaniment
  app.post("/api/community/accompaniment", async (req, res) => {
    const { studentEmail, studentPhone, studentName, details } = req.body;
    if (!studentEmail) return res.status(400).json({ error: "Correo obligatorio." });
    try {
      const requests = (await getCustomData("accompanimentRequests")) || [];
      const emailTrim = studentEmail.toLowerCase().trim();
      const exists = requests.find((r: any) => r.studentEmail.toLowerCase() === emailTrim && r.status !== "Completado");
      if (exists) return res.status(400).json({ error: "Ya tienes una solicitud activa." });

      const student = await getStudent(emailTrim);
      const newRequest = { id: `acc_${Date.now()}`, studentEmail: emailTrim, studentName: studentName || (student?.name || "Estudiante"), studentPhone: studentPhone || (student?.phone || ""), country: student?.country || "", city: student?.city || "", academicGoal: student?.academicGoal || "", level: student?.level || "", timestamp: new Date().toISOString(), details: details || "Solicitud R Consulting", status: "Pendiente" };
      requests.unshift(newRequest);
      await setCustomData("accompanimentRequests", requests);

      const alert = { id: `alert_acc_${Date.now()}`, title: `🤝 NUEVA SOLICITUD: "${newRequest.studentName}" (${newRequest.studentEmail}) solicita R Consulting.`, type: "info", timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }), violatorEmail: newRequest.studentEmail, violatorName: newRequest.studentName, isViolationUnit: false };
      await saveAlert(alert);

      res.json({ success: true, request: newRequest });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/admin/archive-accompaniment", async (req, res) => {
    const { id } = req.body;
    try {
      const requests = (await getCustomData("accompanimentRequests")) || [];
      const idx = requests.findIndex((r: any) => r.id === id);
      if (idx !== -1) { requests[idx].status = "Completado"; await setCustomData("accompanimentRequests", requests); }
      res.json({ success: true, accompanimentRequests: requests });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/admin/delete-accompaniment", async (req, res) => {
    const { id } = req.body;
    try {
      const requests = (await getCustomData("accompanimentRequests")) || [];
      const filtered = requests.filter((r: any) => r.id !== id);
      await setCustomData("accompanimentRequests", filtered);
      res.json({ success: true, accompanimentRequests: filtered });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  // Teachers
  app.post("/api/teachers/create", async (req, res) => {
    const { name, subject, email, bio, phone, photoUrl, rating } = req.body;
    if (!name || !subject || !email) return res.status(400).json({ error: "Nombre, asignatura y correo requeridos." });
    try {
      const t = { id: `teach_${Date.now()}`, name, subject, email, bio: bio || "Profesor colaborador.", phone: phone || "", photoUrl: photoUrl || "", rating: rating ? Number(rating) : 5.0 };
      await saveTeacher(t);
      res.json({ success: true, teacher: t, teachers: await getTeachers() });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/teachers/update", async (req, res) => {
    const { id, name, subject, email, bio, phone, photoUrl, rating } = req.body;
    if (!id) return res.status(400).json({ error: "ID requerido." });
    try {
      const teachers = await getTeachers();
      const t = teachers.find((x: any) => x.id === id);
      if (!t) return res.status(404).json({ error: "Profesor no encontrado." });
      const updated = { ...t, name: name || t.name, subject: subject || t.subject, email: email || t.email, bio: bio ?? t.bio, phone: phone ?? t.phone, photoUrl: photoUrl ?? t.photoUrl, rating: rating !== undefined ? Number(rating) : t.rating };
      await saveTeacher(updated);
      res.json({ success: true, teacher: updated, teachers: await getTeachers() });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  app.post("/api/teachers/delete", async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID requerido." });
    try { await deleteTeacher(id); res.json({ success: true, teachers: await getTeachers() }); } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  // AI Admin Advisor - uses static fallback, no Gemini
  app.post("/api/admin/advisor", async (req, res) => {
    try {
      const students = await getStudents();
      const messages = await getMessages();
      const totalUsers = students.length;
      const premiumUsers = students.filter((s: any) => s.premiumStatus).length;
      const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : "0";

      const fallbackReport = `### 📊 Informe Ejecutivo\n\n- **Estudiantes registrados:** ${totalUsers}\n- **Premium:** ${premiumUsers} (${conversionRate}% conversión)\n- **Mensajes comunidad:** ${messages.length}\n\n#### Recomendaciones\n1. Refuerza el módulo de homologación de títulos.\n2. Introduce planes de pago fraccionados.\n3. Incentiva la participación con badges.`;
      res.json({ response: fallbackReport });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  // Lessons - static fallback only
  app.post("/api/lesson", async (req, res) => {
    const { level, topic, targetLang } = req.body;
    let langCode = "en";
    if (typeof targetLang === "string") {
      const l = targetLang.toLowerCase();
      if (l.includes("arab") || l === "ar") langCode = "ar";
      else if (l.includes("fran") || l === "fr") langCode = "fr";
    }
    res.json(getFallbackLessonData(level || "A1", topic || "Alphabet", langCode));
  });

  // Exams - static fallback only
  app.post("/api/exam", async (req, res) => {
    const { level, examId, targetLang } = req.body;
    let langCode = "es";
    if (typeof targetLang === "string") {
      const l = targetLang.toLowerCase();
      if (l.includes("arab") || l === "ar") langCode = "ar";
      else if (l.includes("fran") || l === "fr") langCode = "fr";
    }
    res.json(getFallbackExam(level || "A1", examId || 1, langCode));
  });

  // CV - static fallback only
  app.post("/api/cv", async (req, res) => {
    const { name, email, role, city, edu, skills, exp } = req.body;
    const cvHtml = `<div style="font-family:system-ui;padding:40px;max-width:800px;margin:0 auto;border:1px solid #e2e8f0;border-radius:16px"><h1>${name || "Candidato"}</h1><p>${role || "Profesional"} — ${city || "España"}</p><p>${email || ""}</p><h2>Formación</h2><p>${edu || ""}</p><h2>Habilidades</h2><p>${skills || ""}</p><h2>Experiencia</h2><p>${exp || ""}</p></div>`;
    res.json({ cvHtml });
  });

  // Chat Correct - uses AI moderation check only
  app.post("/api/chat-correct", async (req, res) => {
    const { message } = req.body;
    const { isBad } = await moderatePostWithAI(message);
    if (isBad) return res.json({ tip: "⚠️ Mensaje bloqueado por contener palabras prohibidas." });
    res.json({ tip: null });
  });

  // =============================================
  // PREMIUM VIDEOS & STRIPE PAYMENTS
  // =============================================
  let stripeInstance: any = null;
  function getStripeInstance() {
    if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
      stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16" as any,
      });
    }
    return stripeInstance;
  }

  // Admin: Create Premium Video
  app.post("/api/admin/videos/create", async (req, res) => {
    try {
      const { title, description, videoUrl, price, pdfUrl } = req.body;
      if (!title || !videoUrl || price === undefined) {
        return res.status(400).json({ error: "Título, URL del video y precio son obligatorios." });
      }
      const videos = await getCustomData("premium_videos") || [];
      const newVideo = {
        id: `vid_${Date.now()}`,
        title: title.trim(),
        description: (description || "").trim(),
        videoUrl: videoUrl.trim(),
        pdfUrl: (pdfUrl || "").trim(),
        price: Math.max(0, Number(price)),
        createdAt: new Date().toISOString()
      };
      videos.push(newVideo);
      await setCustomData("premium_videos", videos);
      res.json({ success: true, videos });
    } catch (err) {
      console.error("Error creating premium video:", err);
      res.status(500).json({ error: "Error al guardar el video en la base de datos." });
    }
  });

  // Admin: Delete Premium Video
  app.post("/api/admin/videos/delete", async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "ID del video requerido." });
      let videos = await getCustomData("premium_videos") || [];
      videos = videos.filter((v: any) => v.id !== id);
      await setCustomData("premium_videos", videos);
      res.json({ success: true, videos });
    } catch (err) {
      console.error("Error deleting premium video:", err);
      res.status(500).json({ error: "Error al eliminar el video." });
    }
  });

  // Student/Admin: Initiate Stripe Checkout Session
  app.post("/api/stripe/create-checkout", async (req, res) => {
    try {
      const { videoId, email, baseUrl } = req.body;
      if (!videoId || !email) {
        return res.status(400).json({ error: "Se requiere videoId y correo electrónico." });
      }

      const videos = await getCustomData("premium_videos") || [];
      const video = videos.find((v: any) => v.id === videoId);
      if (!video) return res.status(404).json({ error: "El video no existe en el catálogo." });

      const stripe = getStripeInstance();
      if (stripe) {
        // Create real Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: video.title,
                  description: video.description || "Clase de Formación de Alta Calidad",
                },
                unit_amount: Math.round(video.price * 100), // in cents
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          customer_email: email,
          metadata: {
            videoId,
            email,
            type: "premium_video_purchase"
          },
          success_url: `${baseUrl || "http://localhost:3000"}?stripe_success=true&videoId=${videoId}`,
          cancel_url: `${baseUrl || "http://localhost:3000"}?stripe_cancel=true`,
        });

        return res.json({ url: session.url, simulated: false });
      } else {
        // No Stripe Key configured yet, return simulated payment required
        return res.json({ url: null, simulated: true, price: video.price, title: video.title });
      }
    } catch (err: any) {
      console.error("Stripe Checkout Error:", err);
      res.status(500).json({ error: err.message || "Error al iniciar pasarela de pagos con Stripe." });
    }
  });

  // Purchase Success Callback (both real redirection success or simulated payment)
  app.post("/api/stripe/payment-success", async (req, res) => {
    try {
      const { videoId, email } = req.body;
      if (!videoId || !email) {
        return res.status(400).json({ error: "Faltan parámetros requeridos (videoId, email)." });
      }

      const student = await getStudent(email);
      if (!student) return res.status(404).json({ error: "El alumno no se encuentra registrado en el sistema." });

      if (!student.purchasedVideos) {
        student.purchasedVideos = [];
      }
      if (!student.purchasedVideos.includes(videoId)) {
        student.purchasedVideos.push(videoId);
      }
      
      await saveStudent(student);

      // Log purchase alert inside system notifications
      const purchaseAlert = {
         id: `purchase_${Date.now()}`,
         title: `💰 Transacción: "${student.name} ${student.lastName || ""}" (${email}) ha adquirido de por vida la clase premium "${videoId}".`,
         type: "success",
         timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
         violatorEmail: email,
         violatorName: student.name,
         isViolationUnit: false
      };
      await saveAlert(purchaseAlert);

      res.json({ success: true, student });
    } catch (err: any) {
      console.error("Payment Confirmation Error:", err);
      res.status(500).json({ error: "Ocurrió un error al desbloquear la compra." });
    }
  });

  // =============================================
  // CONSULTATION BOOKING ROUTES
  // =============================================

  // Get booked slots
  app.get("/api/consultation/booked-slots", async (req, res) => {
    try {
      const bookings = await getCustomData("consultationBookings") || [];
      const slots = bookings.map((b: any) => `${b.day}-${b.hour}`);
      res.json({ slots });
    } catch (e) { res.json({ slots: [] }); }
  });

  // Create consultation checkout
  app.post("/api/consultation/create-checkout", async (req, res) => {
    const { phone, email, day, hour, studentName, studentId, price, signatureName } = req.body;
    if (!phone || !email || !day || !hour) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }
    try {
      const consultationPrice = (await getConfig("consultationPrice")) ?? 30;
      const finalPrice = price || consultationPrice;
      const baseUrl = process.env.APP_URL || `https://${req.headers.host}`;
      const stripe = getStripeInstance();

      if (stripe) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: "eur",
              product_data: { name: "Consulta Personalizada R-Consulting", description: `Sesión ${day} a las ${hour} (horario España)` },
              unit_amount: Math.round(finalPrice * 100),
            },
            quantity: 1,
          }],
          mode: "payment",
          customer_email: email,
          metadata: { phone, email, day, hour, studentName: studentName || "", studentId: studentId || "", signatureName: signatureName || "" },
          success_url: `${baseUrl}?consultation_success=true&day=${day}&hour=${hour}`,
          cancel_url: `${baseUrl}?consultation_cancel=true`,
        });
        res.json({ url: session.url });
      } else {
        res.status(400).json({ error: "Stripe no está configurado. Contacta al administrador." });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Error al crear sesión de pago." });
    }
  });

  // Consultation payment success webhook
  app.post("/api/consultation/payment-success", async (req, res) => {
    const { phone, email, day, hour, studentName, signatureName } = req.body;
    try {
      const bookings = await getCustomData("consultationBookings") || [];
      const newBooking = {
        id: `consult_${Date.now()}`,
        phone, email, day, hour,
        studentName: studentName || "Estudiante",
        signatureName: signatureName || "",
        status: "pending",
        createdAt: new Date().toISOString()
      };
      bookings.unshift(newBooking);
      await setCustomData("consultationBookings", bookings);

      // Alert for admin
      const alert = {
        id: `alert_consult_${Date.now()}`,
        title: `📞 NUEVA CONSULTA RESERVADA: ${studentName || email} — ${day} a las ${hour}. Tel: ${phone}. Email: ${email}`,
        type: "info",
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        isViolationUnit: false
      };
      await saveAlert(alert);

      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Error." });
    }
  });

  // Get consultation bookings (admin)
  app.get("/api/consultation/bookings", async (req, res) => {
    try {
      const bookings = await getCustomData("consultationBookings") || [];
      res.json({ bookings });
    } catch (e) { res.json({ bookings: [] }); }
  });

  // Update consultation price (admin)
  app.post("/api/consultation/set-price", async (req, res) => {
    const { price } = req.body;
    try {
      await setConfig("consultationPrice", Number(price));
      res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Error." }); }
  });

  // Serve frontend
  if (process.env.NODE_ENV !== "production") {
    // dev mode only
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));
}

startServer();
