import type { IntiLanguage } from '@/features/ai-interview/types/language'

export const getSystemPrompt = (
  language: IntiLanguage,
  applicantName?: string,
  jobInfo?: { title: string; location?: string; description?: string }
): string => {
  if (language === 'pt') {
    return `Você é Inti, uma entrevistadora de IA de recrutamento. Seu papel é:
- Conduzir uma entrevista profissional e amigável
- Fazer perguntas da lista fornecida
- Reconhecer respostas dos candidatos de forma natural e conversacional
- Gerar reconhecimentos breves e envolventes (menos de 20 palavras)
- Fazer perguntas de acompanhamento quando apropriado para aprofundar
- Manter um tom profissional, mas caloroso
${applicantName ? `- O nome do candidato é ${applicantName}. Use o nome dele naturalmente nos reconhecimentos para personalizar a conversa.` : ''}

${jobInfo ? `Detalhes da Vaga:
- Título: ${jobInfo.title}
- Localização: ${jobInfo.location || 'Não especificado'}
- Descrição: ${jobInfo.description || 'Não fornecida'}` : ''}

Diretrizes:
- Mantenha os reconhecimentos concisos e naturais
${applicantName ? `- Use o nome do candidato (${applicantName}) naturalmente nos reconhecimentos, mas não exagere - uma vez por reconhecimento é suficiente` : ''}
- Demonstre interesse genuíno nas respostas do candidato
- Se uma resposta for breve, faça uma pergunta de acompanhamento para obter mais detalhes
- Se uma resposta for abrangente, reconheça e passe para a próxima pergunta
- Nunca repita a resposta completa do candidato de volta para ele
- Resuma os pontos principais da resposta do candidato no seu reconhecimento`
  }

  if (language === 'es') {
    return `Eres Inti, una entrevistadora de IA de reclutamiento. Tu función es:
- Realizar una entrevista profesional y amigable
- Hacer las preguntas de la lista proporcionada
- Reconocer las respuestas de los candidatos de forma natural y conversacional
- Generar reconocimientos breves y atractivos (menos de 20 palabras)
- Hacer preguntas de seguimiento cuando sea apropiado para profundizar
- Mantener un tono profesional pero cálido
${applicantName ? `- El nombre del candidato es ${applicantName}. Usa su nombre de forma natural en los reconocimientos para personalizar la conversación.` : ''}

${jobInfo ? `Detalles del puesto:
- Título: ${jobInfo.title}
- Ubicación: ${jobInfo.location || 'No especificada'}
- Descripción: ${jobInfo.description || 'No proporcionada'}` : ''}

Directrices:
- Mantén los reconocimientos concisos y naturales
${applicantName ? `- Usa el nombre del candidato (${applicantName}) de forma natural en los reconocimientos, sin exagerar: una vez por reconocimiento es suficiente` : ''}
- Muestra interés genuino en las respuestas del candidato
- Si una respuesta es breve, haz una pregunta de seguimiento para obtener más detalles
- Si una respuesta es completa, reconócela y pasa a la siguiente pregunta
- Nunca repitas la respuesta completa del candidato
- Resume los puntos principales de su respuesta en tu reconocimiento`
  }

  return `You are Inti, an AI recruitment interviewer. Your role is to:
- Conduct a professional, friendly interview
- Ask questions from the provided list
- Acknowledge candidate answers naturally and conversationally
- Generate brief, engaging acknowledgements (under 20 words)
- Ask follow-up questions when appropriate to dig deeper
- Maintain a professional yet warm tone
${applicantName ? `- The candidate's name is ${applicantName}. Use their name naturally in acknowledgements to personalize the conversation.` : ''}

${jobInfo ? `Job Details:
- Title: ${jobInfo.title}
- Location: ${jobInfo.location || 'Not specified'}
- Description: ${jobInfo.description || 'Not provided'}` : ''}

Guidelines:
- Keep acknowledgements concise and natural
${applicantName ? `- Use the candidate's name (${applicantName}) naturally in acknowledgements, but don't overuse it - once per acknowledgement is enough` : ''}
- Show genuine interest in the candidate's responses
- If an answer is brief, ask a follow-up to get more detail
- If an answer is comprehensive, acknowledge it and move to the next question
- Never repeat the candidate's full answer back to them
- Summarize key points from their answer in your acknowledgement`
}

export const getAcknowledgementPrompt = (language: IntiLanguage): string => {
  if (language === 'pt') {
    return `Você é um entrevistador de IA chamado Inti. Após um candidato responder uma pergunta, forneça um reconhecimento breve e conversacional que:
- Agradece pela resposta
- Resume o(s) ponto(s) principal(is) da resposta em 1-2 frases
- Soa natural e amigável
- É conciso (menos de 20 palavras no total)

NÃO repita a resposta completa. Apenas reconheça e resuma o ponto principal.`
  }

  if (language === 'es') {
    return `Eres una entrevistadora de IA llamada Inti. Después de que un candidato responda una pregunta, proporciona un reconocimiento breve y conversacional que:
- Agradezca la respuesta
- Resuma el/los punto(s) principal(es) en 1-2 frases
- Suene natural y amigable
- Sea conciso (menos de 20 palabras en total)

NO repitas la respuesta completa. Solo reconoce y resume el punto principal.`
  }

  return `You are an AI interviewer named Inti. After a candidate answers a question, provide a brief, conversational acknowledgement that:
- Thanks them for their answer
- Summarizes the key point(s) from their response in 1-2 sentences
- Sounds natural and friendly
- Is concise (under 20 words total)

Do NOT repeat their full answer. Just acknowledge and summarize the main point.`
}

export const getValidationPrompt = (language: IntiLanguage): string => {
  if (language === 'pt') {
    return `Classifique a resposta como aceitável ou inaceitável. Responda APENAS: aceitável|<razão> OU inaceitável|<razão>|<esclarecimento>`
  }
  if (language === 'es') {
    return `Clasifica la respuesta como aceptable o inaceptable. Responde SOLO: aceptable|<razón> O inaceptable|<razón>|<aclaración>`
  }

  return `Classify answer as acceptable or unacceptable. Reply ONLY: acceptable|<reason> OR unacceptable|<reason>|<clarification>`
}

export const getClarificationMessage = (
  language: IntiLanguage,
  applicantName: string | null,
  question: string,
  retryCount: number
): string => {
  const namePrefix = applicantName ? `${applicantName}, ` : ''

  if (language === 'pt') {
    if (retryCount === 1) {
      return `${namePrefix}Notei que sua resposta não abordou diretamente a pergunta sobre "${question}". Você poderia fornecer uma resposta mais específica?`
    }
    return `${namePrefix}Por favor, concentre-se na sua experiência ou habilidades relacionadas a: "${question}".`
  }

  if (language === 'es') {
    if (retryCount === 1) {
      return `${namePrefix}Noté que tu respuesta no abordó directamente la pregunta sobre "${question}". ¿Podrías dar una respuesta más específica?`
    }
    return `${namePrefix}Por favor, concéntrate en tu experiencia o habilidades relacionadas con: "${question}".`
  }

  if (retryCount === 1) {
    return `${namePrefix}I noticed your answer didn't directly address the question about "${question}". Could you please provide a more specific response?`
  }
  return `${namePrefix}Please focus on your experience or skills related to: "${question}".`
}

export const getCompletionMessage = (
  language: IntiLanguage,
  applicantName: string | null,
  isLastQuestion: boolean
): string => {
  const nameSuffix = applicantName ? `, ${applicantName}` : ''
  const namePrefix = applicantName ? `${applicantName}, ` : ''

  if (language === 'pt') {
    if (isLastQuestion) {
      return `Obrigado pela sua resposta${nameSuffix}. Isso encerra a entrevista. Obrigado pelo seu tempo.`
    }
    return `${namePrefix}Obrigado. Vamos passar para a próxima pergunta.`
  }

  if (language === 'es') {
    if (isLastQuestion) {
      return `Gracias por tu respuesta${nameSuffix}. Esto concluye la entrevista. Gracias por tu tiempo.`
    }
    return `${namePrefix}Gracias. Pasemos a la siguiente pregunta.`
  }

  if (isLastQuestion) {
    return `Thank you for your answer${nameSuffix}. That wraps up the interview. Thank you for your time.`
  }
  return `${namePrefix}Thank you. Let's move on to the next question.`
}

export const getCompletionSuffix = (
  language: IntiLanguage,
  isComplete: boolean
): string => {
  if (language === 'pt') {
    return isComplete
      ? ' Isso encerra a entrevista. Obrigado pelo seu tempo.'
      : ' Vamos passar para a próxima pergunta.'
  }
  if (language === 'es') {
    return isComplete
      ? ' Esto concluye la entrevista. Gracias por tu tiempo.'
      : ' Pasemos a la siguiente pregunta.'
  }
  return isComplete
    ? ' That wraps up the interview. Thank you for your time.'
    : ' Let me move on to the next question.'
}

export const getAcknowledgementFallback = (
  language: IntiLanguage,
  isComplete: boolean
): string => {
  if (language === 'pt') {
    return isComplete
      ? 'Obrigado pela sua resposta. Isso encerra a entrevista. Obrigado pelo seu tempo.'
      : 'Obrigado pela sua resposta. Vamos passar para a próxima pergunta.'
  }
  if (language === 'es') {
    return isComplete
      ? 'Gracias por tu respuesta. Esto concluye la entrevista. Gracias por tu tiempo.'
      : 'Gracias por tu respuesta. Pasemos a la siguiente pregunta.'
  }
  return isComplete
    ? 'Thank you for your answer. That wraps up the interview. Thank you for your time.'
    : 'Thank you for your answer. Let me move on to the next question.'
}

export const getSimpleAcknowledgementFallback = (language: IntiLanguage): string => {
  if (language === 'pt') return 'Obrigado pela sua resposta.'
  if (language === 'es') return 'Gracias por tu respuesta.'
  return 'Thank you for your answer.'
}

export const getTransitionMessage = (
  language: IntiLanguage,
  applicantName: string | null
): string => {
  if (language === 'pt') {
    return applicantName
      ? `${applicantName}, agora deixe-me fazer a próxima pergunta.`
      : 'Agora, deixe-me fazer a próxima pergunta.'
  }

  if (language === 'es') {
    return applicantName
      ? `${applicantName}, ahora permíteme hacerte la siguiente pregunta.`
      : 'Ahora, permíteme hacerte la siguiente pregunta.'
  }

  return applicantName
    ? `${applicantName}, now let me ask you the next question.`
    : 'Now, let me ask you the next question.'
}

export const getIntroMessage = (
  language: IntiLanguage,
  applicantName: string,
  jobTitle: string
): string => {
  if (language === 'pt') {
    return `Olá ${applicantName}, eu sou Inti, sua entrevistadora de IA. Vamos passar por algumas perguntas sobre sua experiência para a função de ${jobTitle}. 
Por favor, responda cada pergunta claramente e com suas próprias palavras. Quando estiver pronto, você iniciará e parará a gravação para cada resposta. Vamos começar.`
  }

  if (language === 'es') {
    return `Hola ${applicantName}, soy Inti, tu entrevistadora de IA. Haremos algunas preguntas sobre tu experiencia para el puesto de ${jobTitle}. 
Por favor, responde cada pregunta con claridad y con tus propias palabras. Cuando estés listo, iniciarás y detendrás la grabación para cada respuesta. Empecemos.`
  }

  return `Hi ${applicantName}, I'm Inti, your AI interviewer. We'll go through a few questions about your experience for the ${jobTitle} role. 
Please answer each question clearly and in your own words. When you're ready, you'll start and stop recording for each answer. Let's begin.`
}

export const getResumeIntroMessage = (
  language: IntiLanguage,
  applicantName: string,
  jobTitle: string
): string => {
  if (language === 'pt') {
    return `Olá ${applicantName}, bem-vindo de volta. Estamos continuando sua entrevista para a função de ${jobTitle}. Você iniciou esta entrevista anteriormente e continuaremos de onde paramos. Vamos prosseguir com a próxima pergunta.`
  }

  if (language === 'es') {
    return `Hola ${applicantName}, bienvenido de nuevo. Continuamos tu entrevista para el puesto de ${jobTitle}. Habías iniciado esta entrevista antes y seguiremos donde lo dejaste. Procedamos con la siguiente pregunta.`
  }

  return `Hi ${applicantName}, welcome back. We're continuing your interview for the ${jobTitle} role. You previously started this interview, and we'll continue from where you left off. Let's proceed with the next question.`
}

export const getAcknowledgementPromptForSession = (
  language: IntiLanguage,
  applicantName: string | null,
  isLastQuestion: boolean,
  nextQuestion?: string
): string => {
  if (language === 'pt') {
    return isLastQuestion
      ? `Forneça um reconhecimento caloroso de encerramento (menos de 20 palavras)${applicantName ? ` usando o nome ${applicantName}` : ''}. Formato: RECONHECIMENTO: [texto]`
      : `Forneça: 1) Reconhecimento breve (menos de 20 palavras)${applicantName ? ` usando o nome ${applicantName}` : ''} resumindo pontos principais, 2) Se deve fazer uma pergunta de acompanhamento ou passar para a próxima pergunta. NÃO inclua frases de transição como "deixe-me fazer a próxima pergunta" - apenas reconheça a resposta deles. Próxima pergunta: "${nextQuestion}". Formato: RECONHECIMENTO: [seu reconhecimento]\nAÇÃO: [acompanhamento OU próxima-pergunta]\nACOMPANHAMENTO: [pergunta de acompanhamento opcional se AÇÃO for acompanhamento]`
  }

  if (language === 'es') {
    return isLastQuestion
      ? `Proporciona un reconocimiento cálido de cierre (menos de 20 palabras)${applicantName ? ` usando el nombre ${applicantName}` : ''}. Formato: RECONOCIMIENTO: [texto]`
      : `Proporciona: 1) Reconocimiento breve (menos de 20 palabras)${applicantName ? ` usando el nombre ${applicantName}` : ''} resumiendo puntos principales, 2) Si debe hacer una pregunta de seguimiento o pasar a la siguiente. NO incluyas frases de transición como "permíteme hacerte la siguiente pregunta" - solo reconoce su respuesta. Siguiente pregunta: "${nextQuestion}". Formato: RECONOCIMIENTO: [tu reconocimiento]\nACCIÓN: [seguimiento O siguiente-pregunta]\nSEGUIMIENTO: [pregunta de seguimiento opcional si ACCIÓN es seguimiento]`
  }

  return isLastQuestion
    ? `Provide a warm closing acknowledgement (under 20 words)${applicantName ? ` using ${applicantName}'s name` : ''}. Format: ACKNOWLEDGEMENT: [text]`
    : `Provide: 1) Brief acknowledgement (under 20 words)${applicantName ? ` using ${applicantName}'s name` : ''} summarizing key points, 2) Whether to ask a follow-up or move to the next question. Do NOT include transition phrases like "let me ask the next question" - just acknowledge their answer. Next question: "${nextQuestion}". Format: ACKNOWLEDGEMENT: [your acknowledgement]\nACTION: [follow-up OR next-question]\nFOLLOW_UP: [optional follow-up question if ACTION is follow-up]`
}

export const getDefaultSessionAcknowledgement = (language: IntiLanguage): string => {
  if (language === 'pt') {
    return 'Obrigado pela sua resposta. Vamos passar para a próxima pergunta.'
  }
  if (language === 'es') {
    return 'Gracias por tu respuesta. Pasemos a la siguiente pregunta.'
  }
  return 'Thank you for your answer. Let me move on to the next question.'
}

export function whisperLanguageCode(language: IntiLanguage): string {
  if (language === 'pt') return 'pt'
  if (language === 'es') return 'es'
  return 'en'
}
