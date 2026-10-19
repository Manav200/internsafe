import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import mammoth from 'mammoth';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase body parser limit for PDF/DOCX base64 uploads
app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI client (Server-Side only)
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Resume Parsing Endpoint
app.post('/api/parse-resume', async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileBase64, mimeType, fileName, textContent } = req.body;

    if (!fileBase64 && !textContent) {
      res.status(400).json({
        error: 'Missing resume payload. Please provide a file or resume text.',
      });
      return;
    }

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not configured on server.');
      res.status(503).json({
        error: 'AI Resume Parsing service is currently unavailable. API key not configured.',
      });
      return;
    }

    const systemInstruction = `You are an expert technical talent recruiter and resume parser.
Analyze the provided student resume document or text.
Extract information into structured JSON conforming strictly to the requested schema:
- skills: array of concrete technical, creative, software, and domain skills (e.g. "React", "Python", "SQL", "Figma", "Docker", "Git"). Exclude generic filler phrases like "hard worker" or "fast learner".
- education: array of objects with degree, school, and graduation year if mentioned.
- projects: array of student projects with title, short description, and techStack array.
- experience: array of internships, jobs, or campus roles with role, company, duration, and key highlights.
- summary: a concise 1-2 sentence professional overview of the student's profile.

Do NOT invent or hallucinate skills that are not present or clearly implied by the projects/experience.`;

    const promptText = `Please parse this student resume (${fileName || 'resume'}) and extract all technical and domain skills, education, projects, and work experience. Return strictly valid JSON.`;

    const parts: any[] = [];

    const isPdf = mimeType === 'application/pdf' || mimeType?.includes('pdf') || fileName?.toLowerCase().endsWith('.pdf');
    const isDocx = fileName?.toLowerCase().endsWith('.docx') || fileName?.toLowerCase().endsWith('.doc') || mimeType?.includes('wordprocessingml') || mimeType?.includes('msword');

    if (fileBase64 && isPdf) {
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: fileBase64,
        },
      });
    } else if (fileBase64 && isDocx) {
      const buffer = Buffer.from(fileBase64, 'base64');
      try {
        const docxResult = await mammoth.extractRawText({ buffer });
        parts.push({
          text: `Extracted Word Document Text:\n${docxResult.value.slice(0, 25000)}`,
        });
      } catch (mErr) {
        console.warn('Mammoth extraction failed, fallback to raw buffer text:', mErr);
        parts.push({
          text: `Resume File Content:\n${buffer.toString('utf-8').slice(0, 15000)}`,
        });
      }
    } else if (fileBase64) {
      const buffer = Buffer.from(fileBase64, 'base64');
      const decodedText = buffer.toString('utf-8');
      parts.push({
        text: `Resume File Content:\n${decodedText.slice(0, 15000)}`,
      });
    }

    if (textContent) {
      parts.push({
        text: `Additional text extracted from resume:\n${textContent.slice(0, 15000)}`,
      });
    }

    parts.push({ text: promptText });

    const config = {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Extracted technical and professional skills',
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING },
                school: { type: Type.STRING },
                year: { type: Type.STRING },
              },
              required: ['degree', 'school'],
            },
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                techStack: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['title', 'description'],
            },
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                company: { type: Type.STRING },
                duration: { type: Type.STRING },
                highlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['role', 'company'],
            },
          },
          summary: {
            type: Type.STRING,
            description: 'A 1-2 sentence professional summary of the candidate',
          },
        },
        required: ['skills', 'education', 'projects', 'experience'],
      },
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config,
      });
    } catch (modelErr: any) {
      console.warn('Primary model failed, retrying with gemini-2.5-flash fallback:', modelErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config,
      });
    }

    const parsedJson = JSON.parse(response.text || '{}');

    // Return structured payload
    res.json({
      success: true,
      data: {
        skills: parsedJson.skills || [],
        education: parsedJson.education || [],
        projects: parsedJson.projects || [],
        experience: parsedJson.experience || [],
        summary: parsedJson.summary || 'Aspiring intern with verified technical coursework and projects.',
        extractedAt: new Date().toISOString(),
        fileName: fileName || 'Uploaded_Resume',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/parse-resume:', err);
    res.status(500).json({
      error: err?.message || 'Failed to parse resume document. Please verify the file is not corrupted.',
    });
  }
});

async function startServer() {
  // Mount Vite development middlewares in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  ➜  Local:   http://localhost:${PORT}`);
    console.log(`  ➜  Network: http://127.0.0.1:${PORT}\n`);
  });
}

startServer();
