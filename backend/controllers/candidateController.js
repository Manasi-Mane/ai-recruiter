const Profile = require('../models/Profile');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const askAI = async (systemPrompt, userMessage) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 300
  });
  return response.choices[0].message.content;
};

// GET my profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CREATE or UPDATE profile
exports.saveProfile = async (req, res) => {
  try {
    const { summary, skills, experience, projects, education, completionPercent } = req.body;
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile.summary = summary || profile.summary;
      profile.skills = skills || profile.skills;
      profile.experience = experience || profile.experience;
      profile.projects = projects || profile.projects;
      profile.education = education || profile.education;
      profile.completionPercent = completionPercent || profile.completionPercent;
      profile.lastSaved = Date.now();
      await profile.save();
    } else {
      profile = new Profile({
        user: req.user.id,
        summary, skills, experience,
        projects, education, completionPercent
      });
      await profile.save();
    }
    res.json({ message: 'Profile saved!', profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// AI PROCESS - Real Groq AI
exports.aiProcess = async (req, res) => {
  try {
    const { message, step, profile } = req.body;
    let updatedProfile = { ...profile };
    let reply = '';

    if (step === 1) {
      reply = await askAI(
        `You are a friendly AI recruitment assistant helping candidates build professional profiles.
        The candidate just introduced themselves.
        1. Warmly greet them by name if mentioned
        2. Acknowledge what role they are looking for
        3. Encourage them
        4. Ask about their work experience naturally
        Keep response under 100 words. Be warm and conversational.`,
        message
      );
      updatedProfile.summary = `Professional seeking opportunities: ${message}`;
    }

    else if (step === 2) {
      reply = await askAI(
        `You are an AI recruitment assistant. The candidate described their work experience.
        1. Extract and confirm: job title, company, duration, responsibilities
        2. Suggest 2-3 relevant skills based on their experience
        3. Ask about their technical skills next
        Keep under 150 words. Be structured and encouraging.`,
        message
      );
      updatedProfile.experience = [
        ...(profile.experience || []),
        { title: 'Professional', company: 'Previous Company', duration: 'Recent', description: message }
      ];
    }

    else if (step === 3) {
      reply = await askAI(
        `You are an AI recruitment assistant. The candidate listed their skills.
        1. List all skills you extracted from their message
        2. Suggest 3 additional relevant skills they likely have
        3. Categorize them: Technical Skills, Tools, Soft Skills
        4. Ask about their projects next
        Keep under 150 words. Be encouraging.`,
        message
      );
      const skillWords = message.split(/[,\n]+/).map(s => s.trim()).filter(s => s.length > 1);
      updatedProfile.skills = [...new Set([...(profile.skills || []), ...skillWords])];
    }

    else if (step === 4) {
      reply = await askAI(
        `You are an AI recruitment assistant. The candidate described their projects.
        1. Identify project name, what it does, and tech stack used
        2. Highlight what makes it impressive to recruiters
        3. Ask about their education next
        Keep under 150 words. Be enthusiastic!`,
        message
      );
      updatedProfile.projects = [
        ...(profile.projects || []),
        { name: 'Project', description: message, techStack: 'Various', link: '' }
      ];
    }

    else if (step === 5) {
      const fullContext = `
        Education: ${message}
        Experience: ${JSON.stringify(profile.experience)}
        Skills: ${profile.skills?.join(', ')}
        Projects: ${JSON.stringify(profile.projects)}
      `;

      reply = await askAI(
        `You are an AI recruitment assistant. The candidate just completed their profile.
        1. Confirm their education details
        2. Write a professional 2-sentence summary of their entire profile
        3. Tell them their profile is complete with a celebration 🎉
        4. Give 2 quick tips to stand out to recruiters
        Keep under 200 words. Be celebratory and motivating!`,
        fullContext
      );

      const summary = await askAI(
        `Write a 2-sentence professional bio for a candidate with this background: ${fullContext}. Return only the bio, nothing else.`,
        'Generate the summary now.'
      );

      updatedProfile.education = [
        ...(profile.education || []),
        { degree: 'Degree', institution: message, year: new Date().getFullYear().toString() }
      ];
      updatedProfile.summary = summary;
    }

    res.json({ reply, profile: updatedProfile });

  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ message: 'AI processing failed', error: err.message });
  }
};