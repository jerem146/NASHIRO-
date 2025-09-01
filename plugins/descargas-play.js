// 🎥 VIDEO (Nexfuture API)
else if (command === 'play2' || command === 'ytv' || command === 'ytmp4' || command === 'mp4') {
  try {
    const response = await fetch(`https://api.nexfuture.com.br/ytmp4?id=${ytplay2.videoId}`)
    const json = await response.json()

    const video = json?.resultado?.resultado?.video
    const titulo = video?.titulo || title || "Desconocido"

    if (!video || !video.url) throw new Error('⚠ El enlace de video no se generó correctamente.')

    await conn.sendFile(m.chat, video.url, `${titulo}.mp4`, titulo, m)
  } catch (e) {
    console.log("Error YTMP4:", e)
    return conn.reply(m.chat, '⚠︎ No se pudo enviar el video. Esto puede deberse a que el archivo es demasiado pesado o a un error en la generación de la URL. Por favor, intenta nuevamente más tarde.', m)
  }
}